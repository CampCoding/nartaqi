"use client";
import React, { useState } from "react";
import {
  BarChart3,
  Download,
  Plus,
  Upload,
  Users,
  Mail,
  Phone,
  MapPin,
  Edit,
  Trash2,
  MoreVertical,
  Filter,
  Search,
  Grid3X3,
  List,
  Eye,
  MessageCircle,
  Calendar,
  Award,
  Clock,
  CheckCircle,
  AlertCircle,
  Pause,
  Users2,
} from "lucide-react";
import AddTeamModal from "../../../components/Teams/AddTeamModal/AddTeamModal";
import BreadcrumbsShowcase from "../../../components/ui/BreadCrumbs";
import EditTeamModal from "../../../components/Teams/EditTeamModal/EditTeamModal";
import DeleteTeamModal from "../../../components/Teams/DeleteTeamModal/DeleteTeamModal";

const tabs = [
  { id: 1, title: "الكل", count: 12, color: "bg-blue-500" },
  { id: 2, title: "إداريين", count: 4, color: "bg-purple-500" },
  { id: 3, title: "فنيين", count: 5, color: "bg-green-500" },
  { id: 4, title: "الدعم الفني", count: 2, color: "bg-orange-500" },
  { id: 5, title: "إدخال البيانات", count: 1, color: "bg-indigo-500" },
];

const teamMembers = [
  {
    id: 1,
    name: "أحمد محمد",
    role: "مدير إداري",
    img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    description: "مسؤول عن الإدارة اليومية للفريق والتنسيق بين الأقسام",
    email: "ahmed@company.com",
    phone: "+966 50 123 4567",
    location: "الرياض، السعودية",
    status: "نشط",
    statusColor: "green",
    joinDate: "2023/05/15",
    activeTab: 1,
    completedProjects: 24,
    rating: 4.8,
  },
  {
    id: 2,
    name: "مريم محمد",
    role: "فني دعم",
    img: "/images/banner.png",
    description: "متخصصة في حل مشاكل التقنية وتقديم الدعم الفني",
    email: "mariam@company.com",
    phone: "+966 55 987 6543",
    location: "جدة، السعودية",
    status: "نشط",
    statusColor: "green",
    joinDate: "2023/08/22",
    activeTab: 3,
    completedProjects: 18,
    rating: 4.6,
  },
  {
    id: 3,
    name: "علي حسن",
    role: "مدير قاعدة البيانات",
    img: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    description: "مسؤول عن إدارة وتنظيم قواعد البيانات وأنظمة التخزين",
    email: "ali@company.com",
    phone: "+966 54 456 7890",
    location: "الدمام، السعودية",
    status: "إجازة",
    statusColor: "yellow",
    joinDate: "2022/11/10",
    activeTab: 2,
    completedProjects: 32,
    rating: 4.9,
  },
  {
    id: 4,
    name: "سارة أحمد",
    role: "مدخل بيانات",
    img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    description: "متخصصة في إدخال البيانات وتحليلها وتنظيمها",
    email: "sara@company.com",
    phone: "+966 53 123 7890",
    location: "مكة، السعودية",
    status: "نشط",
    statusColor: "green",
    joinDate: "2023/02/18",
    activeTab: 5,
    completedProjects: 15,
    rating: 4.7,
  },
  {
    id: 5,
    name: "خالد سعد",
    role: "فني شبكات",
    img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    description: "متخصص في إدارة وصيانة شبكات الحاسوب والاتصالات",
    email: "khaled@company.com",
    phone: "+966 56 789 1234",
    location: "الرياض، السعودية",
    status: "نشط",
    statusColor: "green",
    joinDate: "2023/01/05",
    activeTab: 3,
    completedProjects: 21,
    rating: 4.5,
  },
  {
    id: 6,
    name: "فاطمة ناصر",
    role: "مديرة مشاريع",
    img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    description: "مسؤولة عن تخطيط وتنفيذ ومتابعة المشاريع التقنية",
    email: "fatima@company.com",
    phone: "+966 57 456 1234",
    location: "الظهران، السعودية",
    status: "مؤقت",
    statusColor: "red",
    joinDate: "2023/06/30",
    activeTab: 2,
    completedProjects: 12,
    rating: 4.4,
  },
];

const Button = ({ type = "default", size = "medium", icon, onClick, children, className = "" }) => {
  const baseClasses = "inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const typeClasses = {
    primary: "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 focus:ring-blue-500 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5",
    secondary: "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-gray-200 hover:to-gray-300 focus:ring-gray-500 border border-gray-300",
    default: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-gray-500 shadow-sm hover:shadow-md",
    success: "bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 focus:ring-green-500",
    danger: "bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 focus:ring-red-500"
  };
  
  const sizeClasses = {
    small: "px-3 py-2 text-sm",
    medium: "px-4 py-2.5 text-sm",
    large: "px-6 py-3 text-base"
  };

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${typeClasses[type]} ${sizeClasses[size]} ${className}`}
    >
      {icon}
      {children}
    </button>
  );
};

const StatusBadge = ({ status, color }) => {
  const statusIcons = {
    نشط: <CheckCircle className="w-3 h-3" />,
    إجازة: <Pause className="w-3 h-3" />,
    مؤقت: <AlertCircle className="w-3 h-3" />
  };

  const colorClasses = {
    green: "bg-emerald-100 text-emerald-700 border-emerald-200",
    yellow: "bg-amber-100 text-amber-700 border-amber-200",
    red: "bg-red-100 text-red-700 border-red-200"
  };

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${colorClasses[color]}`}>
      {statusIcons[status]}
      {status}
    </div>
  );
};

const StarRating = ({ rating }) => {
  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className={`w-3 h-3 rounded-full ${
            i < Math.floor(rating) ? "bg-yellow-400" : "bg-gray-200"
          }`}
        />
      ))}
      <span className="text-xs text-gray-600 ml-1">{rating}</span>
    </div>
  );
};

export default function TeamsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState(1);
  const [viewMode, setViewMode] = useState("grid");
  const [selectedMember, setSelectedMember] = useState(null);
  const [NewModal , setNewModal] = useState(false);
  const [openEditModal ,setOpenEditModal] = useState(false);
  const [openDeleteModal , setOpenDeleteModal] = useState(false);
  const [rowData , setRowData] = useState({});
  // Filter team members based on active tab and search term

  const breadcrumbs = [
      { label: "الرئيسية", href: "/", icon: BarChart3 },
      { label: "فريق العما", href: "/teams", icon: Users2 },
    ];

  const filteredMembers = teamMembers.filter(
    (member) =>
      (activeTab === 1 || member.activeTab === activeTab) &&
      (member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleEdit = (member) => {
    setSelectedMember(member);
    console.log("Edit member:", member);
  };

  const handleDelete = (member) => {
    setSelectedMember(member);
    console.log("Delete member:", member);
  };

  const handleView = (member) => {
    setSelectedMember(member);
    console.log("View member:", member);
  };

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Background Pattern */}
      {/* <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd" fill="%234f46e5" fill-opacity="0.02" cx="30" cy="30" r="4")] opacity-40"></div> */}
      
      <div className="relative z-10 p-6">
        {/* Breadcrumbs */}
        <BreadcrumbsShowcase variant="pill" items={breadcrumbs}/>

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
                  <Users className="w-4 h-4" />
                  <span>إجمالي الأعضاء: {teamMembers.length}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  <span>نشط: {teamMembers.filter(m => m.status === "نشط").length}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button type="default" icon={<Upload className="w-4 h-4" />}>
                استيراد
              </Button>
              <Button type="secondary" icon={<Download className="w-4 h-4" />}>
                تصدير
              </Button>
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
                  className={`p-3 rounded-lg transition-all duration-200 ${
                    viewMode === "grid"
                      ? "bg-white text-blue-600 shadow-lg scale-105"
                      : "text-gray-500 hover:text-gray-700 hover:bg-white/50"
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-3 rounded-lg transition-all duration-200 ${
                    viewMode === "list"
                      ? "bg-white text-blue-600 shadow-lg scale-105"
                      : "text-gray-500 hover:text-gray-700 hover:bg-white/50"
                  }`}
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
              className={`group relative px-6 py-3 rounded-2xl font-semibold transition-all duration-300 flex items-center gap-3 ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-2xl transform scale-105"
                  : "bg-white/80 backdrop-blur-sm text-gray-700 border-2 border-gray-200 hover:bg-white hover:border-blue-300 hover:scale-102 shadow-lg"
              }`}
            >
              <div className={`w-3 h-3 rounded-full ${activeTab === tab.id ? "bg-white" : tab.color}`}></div>
              <span>{tab.title}</span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold ${
                  activeTab === tab.id
                    ? "bg-white/20 text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Team Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredMembers.map((member, index) => (
            <div
              key={member.id}
              className="group relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:scale-105 animate-fade-in-up"
              style={{
                animationDelay: `${index * 100}ms`
              }}
            >
              {/* Background Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white to-indigo-50/50"></div>
            
              {/* Action Menu */}
              <div className="absolute top-4 right-4 z-10">
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={() => {
                      setOpenEditModal(true)
                      setRowData(member)
                    }}
                    className="p-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                    title="تعديل"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() =>{
                      setOpenDeleteModal(true)
                      setRowData(member)
                    }}
                    className="p-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                    title="حذف"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="relative p-6">
                {/* Profile Image */}
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-white shadow-2xl">
                      <img
                        src={member.img}
                        alt={member.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                    <div className={`absolute -bottom-2 -right-2 w-6 h-6 rounded-full border-4 border-white ${
                      member.statusColor === 'green' ? 'bg-green-500' :
                      member.statusColor === 'yellow' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}></div>
                  </div>
                </div>

                {/* Member Info */}
                <div className="text-center mb-6">
                  <h3 className="font-bold text-gray-900 text-xl mb-1">
                    {member.name}
                  </h3>
                  <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full text-sm font-medium mb-4">
                    <Award className="w-4 h-4 mr-2" />
                    {member.role}
                  </div>
                  
                  {/* Rating */}
                  <div className="flex justify-center mb-4">
                    <StarRating rating={member.rating} />
                  </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Mail className="w-4 h-4 text-blue-600" />
                    </div>
                    <a href={`mailto:${member?.email}`} target="_blank" className="truncate">{member.email}</a>
                  </div>
                  
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <Phone className="w-4 h-4 text-green-600" />
                    </div>
                    <span>{member.phone}</span>
                  </div>
                  
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-purple-600" />
                    </div>
                    <span>{member.location}</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                  {/* <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{member.completedProjects}</div>
                    <div className="text-xs text-gray-500">مشروع مكتمل</div>
                  </div> */}
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>انضم {member.joinDate.split('/')[0]}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredMembers.length === 0 && (
          <div className="text-center py-20 bg-white/80 backdrop-blur-sm rounded-3xl border border-white/20 shadow-xl">
            <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
              <Users className="w-16 h-16 text-blue-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              لا يوجد أعضاء
            </h3>
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

       <AddTeamModal open={NewModal} setOpen={setNewModal}/>
      <EditTeamModal open={openEditModal} setOpen={setOpenEditModal} rowData={rowData} setRowData={setRowData} />
      <DeleteTeamModal open={openDeleteModal} setOpen={setOpenDeleteModal} rowData={rowData} setRowData={setRowData}/>
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
}