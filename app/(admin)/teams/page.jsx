"use client";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { handleGetAllTeams } from "@/lib/features/teamSlice";
import { Edit, Trash2, CheckCircle, Mail, Phone, MapPin, Upload, Download, Plus, Search, Filter, Grid3X3, List, Award, Calendar, Users, Eye, EyeOff } from "lucide-react";
import BreadcrumbsShowcase from "../../../components/ui/BreadCrumbs";
import AddTeamModal from "../../../components/Teams/AddTeamModal/AddTeamModal";
import EditTeamModal from "../../../components/Teams/EditTeamModal/EditTeamModal";
import DeleteTeamModal from "../../../components/Teams/DeleteTeamModal/DeleteTeamModal";
import Button from "../../../components/atoms/Button";
import { Spin } from "antd";
import ShowHideTeamModal from "../../../components/Teams/DeleteTeamModal/DeleteTeamModal";

export default function TeamsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState(1);
  const [viewMode, setViewMode] = useState("grid");
  const [selectedMember, setSelectedMember] = useState(null);
  const [newModal, setNewModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [rowData, setRowData] = useState({});
  const dispatch = useDispatch();

  // Fetch teams from Redux state
  const { team_loading, team_list } = useSelector((state) => state?.team);

  useEffect(() => {
    dispatch(handleGetAllTeams());
  }, [dispatch]);

  useEffect(() => {
    console.log("Fetched Team List:", team_list?.data?.message);
  }, [team_list]);

  const breadcrumbs = [
    { label: "الرئيسية", href: "/", icon: CheckCircle },
    { label: "فريق العمل", href: "/teams", icon: CheckCircle },
  ];

  // Dynamically count members by category
  const categoryCounts = team_list?.data?.message?.reduce((counts, member) => {
    counts[member.category] = (counts[member.category] || 0) + 1;
    return counts;
  }, {});

  // Update the tabs with dynamic counts
  const tabs = [
    { id: 1, title: "الكل", value: "all", count: team_list?.data?.message?.length, color: "bg-blue-500" },
    { id: 2, title: "إداريين", value: "administrators", count: categoryCounts?.administrators || 0, color: "bg-purple-500" },
    { id: 3, title: "فنيين", value: "technicians", count: categoryCounts?.technicians || 0, color: "bg-green-500" },
    { id: 4, title: "الدعم الفني", value: "technical_support", count: categoryCounts?.technical_support || 0, color: "bg-orange-500" },
    { id: 5, title: "إدخال البيانات", value: "data_entry", count: categoryCounts?.data_entry || 0, color: "bg-indigo-500" },
  ];

  // Filter the team members based on active tab and search term
  const filteredMembers = team_list?.data?.message?.filter((member) => {
    const matchesCategory = activeTab === 1 || member.category === tabs[activeTab - 1]?.value;
    const matchesSearchTerm =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearchTerm;
  });

  useEffect(() => {
    console.log(filteredMembers);
  }, [filteredMembers]);


  const handleEdit = (member) => {
    setRowData(member)
    setSelectedMember(member);
    setOpenEditModal(true);
  };

  const handleDelete = (member) => {
    setSelectedMember(member);
    setOpenDeleteModal(true);
  };

  const handleView = (member) => {
    setSelectedMember(member);
    console.log("View member:", member);
  };

  if (team_loading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <Spin spinning size="large" />
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="relative z-10 p-6">
        <BreadcrumbsShowcase variant="pill" items={breadcrumbs} />

        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-2">
                فريق العمل
              </h1>
              <p className="text-gray-600 text-lg">إدارة وتنظيم أعضاء الفريق بكل سهولة ومرونة</p>
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <CheckCircle className="w-4 h-4" />
                  <span>إجمالي الأعضاء: {team_list?.data?.message?.length}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  <span>نشط: {team_list?.data?.message?.filter((m) => m.status === "نشط").length}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={() => setNewModal(true)}
                type="primary"
                size="large"
                icon={<Plus className="w-5 h-5" />}
              >
                إضافة عضو جديد
              </Button>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            <div className="flex-1 relative group">
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="text"
                placeholder="ابحث عن عضو الفريق بالاسم أو الدور أو البريد الإلكتروني..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-12 pl-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-white/50 backdrop-blur-sm text-gray-900 placeholder-gray-500"
              />
            </div>
            <div className="flex items-center gap-3">
              <Button type="default" icon={<Filter className="w-4 h-4" />}>
                الفلتر المتقدم
              </Button>
              <div className="flex rounded-xl border-2 border-gray-200 bg-gray-50/50 backdrop-blur-sm p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-3 rounded-lg transition-all duration-200 ${viewMode === "grid" ? "bg-white text-blue-600 shadow-lg scale-105" : "text-gray-500 hover:text-gray-700 hover:bg-white/50"}`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-3 rounded-lg transition-all duration-200 ${viewMode === "list" ? "bg-white text-blue-600 shadow-lg scale-105" : "text-gray-500 hover:text-gray-700 hover:bg-white/50"}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-3 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`group relative px-6 py-3 rounded-2xl font-semibold transition-all duration-300 flex items-center gap-3 ${activeTab === tab.id ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-2xl transform scale-105" : "bg-white/80 backdrop-blur-sm text-gray-700 border-2 border-gray-200 hover:bg-white hover:border-blue-300 hover:scale-102 shadow-lg"}`}
            >
              <div className={`w-3 h-3 rounded-full ${activeTab === tab.id ? "bg-white" : tab.color}`}></div>
              <span>{tab.title}</span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${activeTab === tab.id ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"}`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Team Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredMembers?.map((member, index) => (
            <div key={member.id} className="group relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:scale-105 animate-fade-in-up">
              <div className="absolute top-4 right-4 z-10">
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={() => handleEdit(member)}
                    className="p-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                    title="تعديل"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(member)}
                    className="p-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                    title="حذف"
                  >
                 {member?.hidden == 1 ?   <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="relative p-6">
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-white shadow-2xl">
                      <img
                        src={member?.image}
                        alt={member?.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                    <div className={`absolute -bottom-2 -right-2 w-6 h-6 rounded-full border-4 border-white ${member.statusColor === 'green' ? 'bg-green-500' : member.statusColor === 'yellow' ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                  </div>
                </div>

                <div className="text-center mb-6">
                  <h3 className="font-bold text-gray-900 text-xl mb-1">{member?.name}</h3>
                  <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full text-sm font-medium mb-4">
                    <Award className="w-4 h-4 mr-2" />
                    {member?.category}
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Mail className="w-4 h-4 text-blue-600" />
                    </div>
                    <a href={`mailto:${member?.email}`} target="_blank" className="truncate">{member?.email}</a>
                  </div>

                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Users className="w-4 h-4 text-purple-600" />
                    </div>
                    <span>{member.role}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>انضم {member?.created_at?.split('T')[0]}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredMembers?.length === 0 && (
          <div className="text-center py-20 bg-white/80 backdrop-blur-sm rounded-3xl border border-white/20 shadow-xl">
            <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
              <Users className="w-16 h-16 text-blue-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">لا يوجد أعضاء</h3>
            <p className="text-gray-600 mb-8 text-lg max-w-md mx-auto">
              {searchTerm
                ? "لم يتم العثور على أعضاء يطابقون معايير البحث المحددة"
                : "لم يتم إضافة أي أعضاء إلى الفريق بعد. ابدأ ببناء فريقك الآن!"}
            </p>
            <Button
              type="primary"
              size="large"
              onClick={() => setNewModal(true)}
              icon={<Plus className="w-5 h-5" />}
            >
              إضافة عضو جديد
            </Button>
          </div>
        )}
      </div>

      {/* Modals */}
      <AddTeamModal open={newModal} setOpen={setNewModal} />
      <EditTeamModal open={openEditModal} setOpen={setOpenEditModal} rowData={rowData} />
      <ShowHideTeamModal open={openDeleteModal} setOpen={setOpenDeleteModal} rowData={selectedMember} />
    </div>
  );
}
