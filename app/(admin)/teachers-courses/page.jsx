"use client";

import React, { useMemo, useState } from "react";
import PageLayout from "../../../components/layout/PageLayout";
import BreadcrumbsShowcase from "../../../components/ui/BreadCrumbs";
import {
  BarChart3,
  Book,
  Calendar,
  Download,
  Edit3,
  FileText,
  MoreVertical,
  Plus,
  Settings,
  Trash2,
  Users,
} from "lucide-react";
import PagesHeader from "./../../../components/ui/PagesHeader";
import { subjects } from "../../../data/subjects";
import Button from "../../../components/atoms/Button";
import SubjectsStats from "../../../components/Subjects/SubjectStats";
import Table from "../../../components/ui/Table";
import CourseSubjectCard from "../../../components/ui/Cards/CourseSubjectCard";
import SearchAndFilters from "./../../../components/ui/SearchAndFilters";
import Badge from "../../../components/atoms/Badge";
import AddTeacherCourseForm from "../../../components/TeacherCourses/AddTeacherCourseForm/AddTeacherCourseForm";
import DeleteSubjectModal from "../../../components/Subjects/DeleteSubject.modal.jsx";
import EditTeacherCourseForm from "../../../components/TeacherCourses/EditTeacherCourseForm/EditTeacherCourseForm";
import SubjectActivationModal from "../../../components/Subjects/Activation.modal";
import { useRouter } from "next/navigation";

/* ===== Helpers ===== */
const TABS = [
  { key: "all", label: "الكل" },
  { key: "general", label: "دورات عامة" },
  { key: "license", label: "دورات الرخصة المهنية" },
  { key: "other", label: "دورات أخرى" },
];

// حاول نكتشف الفئة لو الداتا مش مضاف فيها categoryKey
function inferCategory(s) {
  const key = (s.categoryKey || s.category || s.type || "").toString().toLowerCase();
  const name = (s.name || "").toLowerCase();

  if (key.includes("license") || key.includes("رخص") || name.includes("رخص") || name.includes("قياس"))
    return "license";
  if (key.includes("general") || key.includes("عام") || name.includes("أساسيات") || name.includes("عام"))
    return "general";
  return "other";
}

const getDifficultyColor = (difficulty) =>
  difficulty === "Easy" ? "green" : difficulty === "Medium" ? "gold" : difficulty === "Hard" ? "red" : "default";

const getStatusColor = (status) =>
  status === "active" ? "blue" : status === "draft" ? "purple" : status === "archived" ? "default" : "default";

const SubjectsManagementPage = () => {
  const router = useRouter();

  const breadcrumbs = [
    { label: "الرئيسية", href: "/", icon: BarChart3 },
    { label: "المواد", href: "/subjects", icon: Book, current: true },
  ];

  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all"); // 👈 تبويب افتراضي (الكل)
  const [NewModal, setNewModal] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [activationModal, setActivationModal] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);

  // طبّع الداتا بإضافة _cat
  const normalizedSubjects = useMemo(
    () => subjects.map((s) => ({ ...s, _cat: inferCategory(s) })),
    []
  );

  // عدادات لكل تبويب
  const tabCounts = useMemo(() => {
    const c = { all: normalizedSubjects.length, general: 0, license: 0, other: 0 };
    normalizedSubjects.forEach((s) => (c[s._cat] = (c[s._cat] || 0) + 1));
    return c;
  }, [normalizedSubjects]);

  // فلترة بالبحث + التبويب
  const filteredSubjects = useMemo(() => {
    const term = (searchTerm || "").toLowerCase();
    const base = activeTab === "all" ? normalizedSubjects : normalizedSubjects.filter((s) => s._cat === activeTab);
    return base.filter(
      (s) =>
        s.name?.toLowerCase().includes(term) ||
        s.description?.toLowerCase().includes(term) ||
        s.code?.toLowerCase().includes(term)
    );
  }, [normalizedSubjects, activeTab, searchTerm]);

  const columns = [
    {
      title: "الدورة",
      dataIndex: "name",
      key: "name",
      sorter: true,
      render: (text, record) => (
        <div className="flex items-center gap-3 gap-reverse">
          <div className="w-10 h-10 bg-gradient-to-br from-[#0F7490] to-[#8B5CF6] rounded-lg flex items-center justify-center text-white font-bold text-sm">
            {record.name?.substring(0, 2)}
          </div>
          <div className="text-right">
            <div className="font-semibold text-[#202938]">{text}</div>
            <div className="text-xs text-[#202938]/60">الرمز: {record.code}</div>
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
          <p className="text-sm text-[#202938]/80 line-clamp-2 text-right">{text}</p>
        </div>
      ),
    },
    {
      title: "إحصاءات",
      key: "stats",
      render: (_, record) => (
        <div className="space-y-1 text-right">
          <div className="flex items-center justify-end gap-1 gap-reverse text-xs text-[#202938]/60">
            <Book className="w-3 h-3" />
            <span>{record.units?.length || 0} وحدات</span>
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
            {status === "active" ? "نشط" : status === "draft" ? "مسودة" : status === "archived" ? "مؤرشف" : status}
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
            {difficulty === "Easy" ? "سهل" : difficulty === "Medium" ? "متوسط" : difficulty === "Hard" ? "صعب" : difficulty}
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
          <Button type="text" size="small" className="text-[#0F7490] hover:bg-[#0F7490]/10" aria-label="إعدادات">
            <Settings className="w-4 h-4" />
          </Button>
          <Button
            type="text"
            size="small"
            className="text-[#C9AE6C] hover:bg-[#C9AE6C]/10"
            aria-label="تعديل"
            onClick={() => {
              setSelectedSubject(record);
              // افتح نموذج التعديل إن حابب
            }}
          >
            <Edit3 className="w-4 h-4" />
          </Button>
          <Button
            type="text"
            size="small"
            className="text-red-500 hover:bg-red-50"
            aria-label="حذف"
            onClick={() => {
              setSelectedSubject(record);
              // افتح مودال الحذف
            }}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
          <Button type="text" size="small" className="text-[#202938]/60 hover:bg-gray-100" aria-label="المزيد">
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
          title={"إدارة دورات"}
          subtitle={"نظّم وأدر موادك التعليمية"}
          extra={
            <div className="flex items-center gap-4 gap-reverse">
              <Button type="secondary" icon={<Download className="w-4 h-4" />}>
                تصدير
              </Button>
              <Button onClick={() => router.push(`/teachers-courses/add-course`)} type="primary" size="large" icon={<Plus className="w-5 h-5" />}>
                إضافة دورة جديدة
              </Button>
            </div>
          }
        />

        {/* ===== Tabs (3 فئات) ===== */}
        <div className="mt-4 mb-3">
          <div className="inline-flex rounded-xl border border-gray-200 bg-white p-1">
            {TABS.map((t) => {
              const isActive = activeTab === t.key;
              const count = tabCounts[t.key] || 0;
              return (
                <button
                  key={t.key}
                  onClick={() => setActiveTab(t.key)}
                  className={`px-3 sm:px-4 py-2 rounded-lg text-sm transition-all ${
                    isActive
                      ? "bg-gray-900 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <span>{t.label}</span>
                  <span
                    className={`ml-2 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-xs ${
                      isActive ? "bg-white/20 text-white" : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Stats for the filtered tab */}
        <SubjectsStats subjects={filteredSubjects} />

        {/* Search & view mode */}
        <SearchAndFilters mode={viewMode} setMode={setViewMode} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

        {/* Content */}
        {viewMode === "table" ? (
          <Table
            columns={columns}
            dataSource={filteredSubjects}
            rowKey={(r) => r.id || r.code}
            pagination={{ pageSize: 10 }}
            className="shadow-sm mt-3"
          />
        ) : (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSubjects?.map((subject) => (
              <CourseSubjectCard
                activationModal={activationModal}
                setActivationModal={setActivationModal}
                deleteModal={deleteModal}
                setDeleteModal={setDeleteModal}
                setEditOpen={setEditOpen}
                setSelectedSubject={setSelectedSubject}
                subject={subject}
                key={subject.code || subject.id}
                dir="rtl"
              />
            ))}
            {filteredSubjects.length === 0 && (
              <div className="col-span-full text-center text-gray-500 py-16">
                لا توجد دورات ضمن هذا التبويب تطابق بحثك
              </div>
            )}
          </div>
        )}

        {/* Modals (كما كانت) */}
        <AddTeacherCourseForm open={NewModal} setOpen={setNewModal} />

        <DeleteSubjectModal open={deleteModal} setOpen={setDeleteModal} selectedSubject={selectedSubject} />

        <EditTeacherCourseForm
          open={editOpen}
          setOpen={setEditOpen}
          rowData={selectedSubject}
          onUpdate={(payload) => {
            // TODO: استدعاء API للتحديث
          }}
        />

        <SubjectActivationModal open={activationModal} setOpen={setActivationModal} selectedSubject={selectedSubject} />
      </div>
    </PageLayout>
  );
};

export default SubjectsManagementPage;
