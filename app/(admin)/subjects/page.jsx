"use client";

import React, { useState } from "react";
import PageLayout from "../../../components/layout/PageLayout";
import BreadcrumbsShowcase from "../../../components/ui/BreadCrumbs";
import {
  BarChart3,
  Book,
  BookOpen,
  Calendar,
  Download,
  Edit3,
  FileText,
  MoreVertical,
  Plus,
  Settings,
  Trash2,
  Upload,
  Users,
} from "lucide-react";
import PagesHeader from "./../../../components/ui/PagesHeader";
import SubjectsPage from "../../../components/drafts/Subjects.draft";
import { subjects } from "../../../data/subjects";
import Button from "../../../components/atoms/Button";
import SubjectsStats from "../../../components/Subjects/SubjectStats";
import Table from "../../../components/ui/Table";
import SubjectCard from "../../../components/ui/Cards/SubjectCard";
import SearchAndFilters from "./../../../components/ui/SearchAndFilters";
import Badge from "../../../components/atoms/Badge";
import AddSubjectForm from "../../../components/Subjects/AddNewSubject.modal.jsx";
import DeleteSubjectModal from "../../../components/Subjects/DeleteSubject.modal.jsx";
import EditSubjectForm from "../../../components/Subjects/EditSubjectForm";
import SubjectActivationModal from "../../../components/Subjects/Activation.modal";
import OverviewSection from "../../../components/Subjects/SubjectOverviewSection";

const SubjectsManagementPage = () => {
  const breadcrumbs = [
    { label: "الرئيسية", href: "/", icon: BarChart3 },
    { label: "المواد", href: "/subjects", icon: Book, current: true },
  ];

  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [NewModal, setNewModal] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [activationModal, setActivationModal] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "green";
      case "Medium":
        return "gold";
      case "Hard":
        return "red";
      default:
        return "default";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "blue";
      case "draft":
        return "purple";
      case "archived":
        return "default";
      default:
        return "default";
    }
  };

  const columns = [
    {
      title: "المادة",
      dataIndex: "name",
      key: "name",
      sorter: true,
      render: (text, record) => (
        <div className="flex items-center gap-3 gap-reverse">
          <div className="w-10 h-10 bg-gradient-to-br from-[#0F7490] to-[#8B5CF6] rounded-lg flex items-center justify-center text-white font-bold text-sm">
            {record.name.substring(0, 2)}
          </div>
          <div className="text-right">
            <div className="font-semibold text-[#202938]">{text}</div>
            <div className="text-xs text-[#202938]/60">
              الرمز: {record.code}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "الوصف",
      dataIndex: "description",
      key: "description",
      render: (text) => (
        <div className="max-w-xs">
          <p className="text-sm text-[#202938]/80 line-clamp-2 text-right">
            {text}
          </p>
        </div>
      ),
    },
    {
      title: "إحصاءات",
      key: "stats",
      render: (_, record) => (
        <div className="space-y-1 text-right">
          <div className="flex items-center justify-end gap-1 gap-reverse text-xs text-[#202938]/60">
            <BookOpen className="w-3 h-3" />
            <span>{record.units.length} وحدات</span>
          </div>
          <div className="flex items-center justify-end gap-1 gap-reverse text-xs text-[#202938]/60">
            <Users className="w-3 h-3" />
            <span>{record.students} طلاب</span>
          </div>
          <div className="flex items-center justify-end gap-1 gap-reverse text-xs text-[#202938]/60">
            <FileText className="w-3 h-3" />
            <span>{record.questions} أسئلة</span>
          </div>
        </div>
      ),
    },
    {
      title: "الحالة",
      dataIndex: "status",
      key: "status",
      sorter: true,
      render: (status) => (
        <div className="text-right">
          <Badge color={getStatusColor(status)}>
            {status === "active"
              ? "نشط"
              : status === "draft"
              ? "مسودة"
              : status === "archived"
              ? "مؤرشف"
              : status}
          </Badge>
        </div>
      ),
    },
    {
      title: "الصعوبة",
      dataIndex: "difficulty",
      key: "difficulty",
      sorter: true,
      render: (difficulty) => (
        <div className="text-right">
          <Badge color={getDifficultyColor(difficulty)}>
            {difficulty === "Easy"
              ? "سهل"
              : difficulty === "Medium"
              ? "متوسط"
              : difficulty === "Hard"
              ? "صعب"
              : difficulty}
          </Badge>
        </div>
      ),
    },
    {
      title: "آخر تحديث",
      dataIndex: "lastUpdated",
      key: "lastUpdated",
      sorter: true,
      render: (date) => (
        <div className="flex items-center justify-end gap-1 gap-reverse text-sm text-[#202938]/60">
          <Calendar className="w-3 h-3" />
          <span>{date}</span>
        </div>
      ),
    },
    {
      title: "إجراءات",
      key: "actions",
      render: (_, record) => (
        <div className="flex items-center justify-end gap-1 gap-reverse">
          <Button
            type="text"
            size="small"
            className="text-[#0F7490] hover:bg-[#0F7490]/10"
            aria-label="إعدادات"
          >
            <Settings className="w-4 h-4" />
          </Button>
          <Button
            type="text"
            size="small"
            className="text-[#C9AE6C] hover:bg-[#C9AE6C]/10"
            aria-label="تعديل"
          >
            <Edit3 className="w-4 h-4" />
          </Button>
          <Button
            type="text"
            size="small"
            className="text-red-500 hover:bg-red-50"
            aria-label="حذف"
            onClick={() => setSelectedSubject(record)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
          <Button
            type="text"
            size="small"
            className="text-[#202938]/60 hover:bg-gray-100"
            aria-label="المزيد"
          >
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <PageLayout>
      <div dir="rtl">
        <BreadcrumbsShowcase items={breadcrumbs} variant="pill" />

        {/* Header */}
        <PagesHeader
          title={"إدارة دورات الطلاب"}
          subtitle={"نظّم وأدر موادك التعليمية"}
          extra={
            <div className="flex items-center gap-4 gap-reverse">
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
                إضافة دورة جديدة
              </Button>
            </div>
          }
        />

        {/* Stats Cards (uses your existing component) */}
        <SubjectsStats subjects={subjects} />

        <SearchAndFilters
          mode={viewMode}
          setMode={setViewMode}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />

        {/* Content */}
        {viewMode === "table" ? (
          <Table
            columns={columns}
            dataSource={subjects}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            className="shadow-sm"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map((subject) => (
              <SubjectCard
                activationModal={activationModal}
                setActivationModal={setActivationModal}
                deleteModal={deleteModal}
                setDeleteModal={setDeleteModal}
                setEditOpen={setEditOpen}
                setSelectedSubject={setSelectedSubject}
                subject={subject}
                key={subject.code}
                dir="rtl"
              />
            ))}
          </div>
        )}

        <AddSubjectForm open={NewModal} setOpen={setNewModal} />
        <DeleteSubjectModal
          open={deleteModal}
          setOpen={setDeleteModal}
          selectedSubject={selectedSubject}
        />

        <EditSubjectForm
          open={editOpen}
          setOpen={setEditOpen}
          subject={selectedSubject} // الكائن الحالي للدورة
          onUpdate={(payload) => {
            // استدعِ API التحديث هنا
            // fetch('/api/subjects/ID', { method: 'PUT', body: JSON.stringify(payload) })
          }}
        />
        <SubjectActivationModal
          open={activationModal}
          setOpen={setActivationModal}
          selectedSubject={selectedSubject}
        />
      </div>
    </PageLayout>
  );
};

export default SubjectsManagementPage;
