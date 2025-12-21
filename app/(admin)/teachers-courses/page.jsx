"use client";

import React, { useEffect, useMemo, useState } from "react";
import PageLayout from "../../../components/layout/PageLayout";
import BreadcrumbsShowcase from "../../../components/ui/BreadCrumbs";
import {
  BarChart3,
  Book,
  Calendar,
  Edit3,
  FileText,
  MoreVertical,
  Plus,
  Settings,
  Trash2,
  Users
} from "lucide-react";
import PagesHeader from "./../../../components/ui/PagesHeader";
import Button from "../../../components/atoms/Button";
import SearchAndFilters from "./../../../components/ui/SearchAndFilters";
import Badge from "../../../components/atoms/Badge";
import DeleteSubjectModal from "../../../components/Subjects/DeleteSubject.modal.jsx";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { handleGetAllCoursesCategories } from "@/lib/features/categoriesSlice";
import {
  handleDeleteRound,
  handleGetAllRounds
} from "@/lib/features/roundsSlice";
import Table from "../../../components/ui/Table";
import CourseSubjectCard from "../../../components/ui/Cards/CourseSubjectCard";
import { toast } from "react-toastify";
import { Pagination, Spin } from "antd";

/* ===== Helpers ===== */

// حاول نكتشف الفئة لو الداتا مش مضاف فيها categoryKey
function inferCategory(s) {
  const key = (s.categoryKey || s.category || s.type || "")
    .toString()
    .toLowerCase();
  const name = (s.name || "").toLowerCase();

  if (
    key.includes("license") ||
    key.includes("رخص") ||
    name.includes("رخص") ||
    name.includes("قياس")
  )
    return "license";
  if (
    key.includes("general") ||
    key.includes("عام") ||
    name.includes("أساسيات") ||
    name.includes("عام")
  )
    return "general";
  return "other";
}

const getDifficultyColor = (difficulty) =>
  difficulty === "Easy"
    ? "green"
    : difficulty === "Medium"
    ? "gold"
    : difficulty === "Hard"
    ? "red"
    : "default";

const getStatusColor = (status) =>
  status === "active"
    ? "blue"
    : status === "draft"
    ? "purple"
    : status === "archived"
    ? "default"
    : "default";

const SubjectsManagementPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const breadcrumbs = [
    { label: "الرئيسية", href: "/", icon: BarChart3 },
    { label: "دورات الوجهه السعودية", href: "#", icon: Book, current: true }
  ];

  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState(null);

  // ✅ backend pagination state
  const [page, setPage] = useState(1);

  const [editOpen, setEditOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [activationModal, setActivationModal] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);

  const { all_courses_categories_list, all_courses_categories_loading } =
    useSelector((state) => state?.categories);
  const { rounds_loading, rounds_list } = useSelector((state) => state?.rounds);

  /* ===== Fetch categories once ===== */
  useEffect(() => {
    dispatch(handleGetAllCoursesCategories());
  }, [dispatch]);

  /* ===== Set default active tab when categories loaded ===== */
  useEffect(() => {
    const cats = all_courses_categories_list?.data?.message?.data;
    if (cats && cats.length > 0 && activeTab === null) {
      setActiveTab(cats[0].id);
    }
  }, [all_courses_categories_list, activeTab]);

  /* ===== Fetch rounds when tab or page changes ===== */
  useEffect(() => {
    if (!activeTab) return;
    dispatch(
      handleGetAllRounds({
        course_category_id: activeTab,
        page,
        per_page: 6
      })
    );
  }, [dispatch, activeTab, page]);

  /* ===== Reset page when tab changes ===== */
  useEffect(() => {
    // كل ما تغير التبويب نرجع لأول صفحة
    setPage(1);
  }, [activeTab]);

  const apiMessage = rounds_list?.data?.message;
  const apiData = apiMessage?.data || [];

  // ✅ meta from backend pagination
  const metaData = apiMessage;
  const total = metaData?.total || 0;
  const backendCurrentPage = metaData?.current_page || page;
  const backendPageSize = metaData?.per_page || apiData.length || 10;
  const lastPage = metaData?.last_page || 1;

  /* ===== Normalize rounds to subjects model the UI expects ===== */
  const normalizedSubjects = useMemo(() => {
    if (!apiData || apiData.length === 0) return [];

    return apiData.map((s) => {
      const status = s.active === "1" || s.active === 1 ? "active" : "draft";
      let difficulty;
      if (s.for?.toLowerCase().includes("beginner")) difficulty = "Easy";
      else if (s.for?.toLowerCase().includes("advanced")) difficulty = "Hard";
      else difficulty = "Medium";

      const lastUpdated =
        s.updated_at?.split("T")[0] || s.created_at?.split("T")[0] || "";

      return {
        ...s,
        _cat: inferCategory(s),
        status,
        difficulty,
        lastUpdated,
        units: s.units || [],
        students: s.students || 0,
        questions: s.questions || 0,
        code: s.code || `R-${s.id}`
      };
    });
  }, [apiData]);

  /* ===== عدادات لكل تبويب (لو حبيت تستخدمها) ===== */
  const tabCounts = useMemo(() => {
    const c = {
      all: normalizedSubjects.length,
      general: 0,
      license: 0,
      other: 0
    };
    normalizedSubjects.forEach((s) => {
      c[s._cat] = (c[s._cat] || 0) + 1;
    });
    return c;
  }, [normalizedSubjects]);

  /* ===== Search + filter ===== */
  const filteredSubjects = useMemo(() => {
    const term = (searchTerm || "").toLowerCase();
    const base = normalizedSubjects;

    if (!term) return base;

    return base.filter((s) => {
      return (
        s.name?.toLowerCase().includes(term) ||
        s.description?.toLowerCase().includes(term) ||
        s.code?.toLowerCase().includes(term)
      );
    });
  }, [normalizedSubjects, searchTerm]);

  /* ===== Pagination handler ===== */
  const handlePageChange = (newPage, _pageSize) => {
    setPage(newPage);
  };

  /* ===== Delete handler ===== */
  function handleDelete(id) {
    if (!id) return;
    const data_send = { id };
    dispatch(handleDeleteRound({ body: data_send }))
      .unwrap()
      .then((res) => {
        console.log(res);
        if (res?.data?.status == "success") {
          toast.success(res?.data?.message);
          dispatch(
            handleGetAllRounds({
              course_category_id: activeTab,
              page: backendCurrentPage,
              per_page: 6
            })
          );
        } else {
          toast.error(res?.data?.message);
        }
      })
      .catch((e) => console.log(e));
  }

  useEffect(() => {
    const cats = all_courses_categories_list?.data?.message?.data;
    if (cats && cats.length > 0 && activeTab === null) {
      setActiveTab(cats[0].id);
    }
  }, [all_courses_categories_list, activeTab]);

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
          </div>
        </div>
      )
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
      )
    },
    {
      title: "إحصاءات",
      key: "stats",
      dataIndex: "statsDummy",
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
      )
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
      )
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
      )
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
      )
    },
    {
      title: "إجراءات",
      key: "actions",
      dataIndex: "actionsDummy",
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
            onClick={() => {
              setSelectedSubject(record);
              setEditOpen(true);
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
              setDeleteModal(true);
            }}
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
      )
    }
  ];

  const isLoadingRounds = rounds_loading && normalizedSubjects.length === 0;

  if (rounds_loading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <Spin size="large" spinning />
      </div>
    );
  }

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
              <Button
                onClick={() => {
                  if (typeof window !== "undefined")
                    window.location.href = `/saudi_source_course/add-data?source=0`;
                }}
                type="primary"
                size="large"
                icon={<Plus className="w-5 h-5" />}
              >
                إضافة دورة جديدة
              </Button>
            </div>
          }
        />

        {/* Tabs */}
        <div className="mt-4 mb-3">
          {all_courses_categories_loading ? (
            <div className="h-10 w-64 bg-gray-100 animate-pulse rounded-xl" />
          ) : (
            <div className="inline-flex rounded-xl border border-gray-200 bg-white p-1">
              {all_courses_categories_list?.data?.message?.data?.map((t) => {
                const isActive = activeTab == t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t?.id)}
                    className={`px-3 sm:px-4 py-2 rounded-lg text-sm transition-all ${
                      isActive
                        ? "bg-gray-900 text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <span>{t?.name}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Search & view mode */}
        <SearchAndFilters
          mode={viewMode}
          setMode={setViewMode}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />

        {/* Content */}
        {isLoadingRounds ? (
          <div className="mt-6 bg-white rounded-xl border border-gray-100 p-8 text-center text-gray-500">
            جاري تحميل الدورات...
          </div>
        ) : viewMode === "table" ? (
          <div className="mt-4">
            <Table
              columns={columns}
              dataSource={filteredSubjects}
              rowKey={(r) => r.id || r.code}
              loading={rounds_loading}
              className="shadow-sm mt-3"
              pagination={{
                current: backendCurrentPage,
                pageSize: backendPageSize,
                total,
                showSizeChanger: false,
                showTotal: (total, range) =>
                  `عرض ${range[0]}–${range[1]} من ${total} دورة (عدد الصفحات: ${lastPage})`,
                onChange: handlePageChange
              }}
            />
          </div>
        ) : (
          <>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSubjects?.map((subject) => (
                <CourseSubjectCard
                  page={page}
                  cat_id={activeTab}
                  activationModal={activationModal}
                  setActivationModal={setActivationModal}
                  deleteModal={deleteModal}
                  setDeleteModal={setDeleteModal}
                  setEditOpen={setEditOpen}
                  setSelectedSubject={setSelectedSubject}
                  subject={subject}
                  key={subject.code || subject.id}
                  dir="rtl"
                  onDelete={() => handleDelete(subject?.id)}
                />
              ))}
              {filteredSubjects?.length === 0 && (
                <div className="col-span-full text-center text-gray-500 py-16">
                  لا توجد دورات ضمن هذا التبويب تطابق بحثك
                </div>
              )}
            </div>

            {/* ✅ Pagination for grid view */}
            {metaData && total > 0 && (
              <div className="mt-6 flex justify-center">
                <Pagination
                  current={backendCurrentPage}
                  pageSize={backendPageSize}
                  total={total}
                  onChange={handlePageChange}
                  showSizeChanger={false}
                  locale={{
                    items_per_page: "/ الصفحة",
                    jump_to: "اذهب إلى",
                    page: "الصفحة",
                    prev_page: "الصفحة السابقة",
                    next_page: "الصفحة التالية"
                  }}
                />
              </div>
            )}
          </>
        )}

        <DeleteSubjectModal
          open={deleteModal}
          setOpen={setDeleteModal}
          selectedSubject={selectedSubject}
        />
      </div>
    </PageLayout>
  );
};

export default SubjectsManagementPage;
