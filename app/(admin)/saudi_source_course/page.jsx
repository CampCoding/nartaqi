"use client";

import React, { useEffect, useMemo, useState } from "react";
import PageLayout from "../../../components/layout/PageLayout";
import BreadcrumbsShowcase from "../../../components/ui/BreadCrumbs";
import {
  BarChart3,
  Book,
  Calendar,
  Edit3,
  MoreVertical,
  Plus,
  Settings,
  Trash2,
  Users,
  Copy,
  Eye,
  EyeOff,
} from "lucide-react";
import PagesHeader from "../../../components/ui/PagesHeader";
import Button from "../../../components/atoms/Button";
import SubjectsStats from "../../../components/Subjects/SubjectStats";
import Table from "../../../components/ui/Table";
import SearchAndFilters from "../../../components/ui/SearchAndFilters";
import Badge from "../../../components/atoms/Badge";
import DeleteSubjectModal from "../../../components/Subjects/DeleteSubject.modal.jsx";
import { useRouter } from "next/navigation";
import CourseSourceSubjectCard from "../../../components/ui/Cards/CourseSourceSubjectCard";
import { useDispatch, useSelector } from "react-redux";
import { Spin } from "antd";
import {
  handleGetAllRounds,
  handleGetSourceRound,
} from "@/lib/features/roundsSlice";

/* ===== Helpers ===== */
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
const getDifficultyColor = (d) =>
  d === "Easy"
    ? "green"
    : d === "Medium"
    ? "gold"
    : d === "Hard"
    ? "red"
    : "default";
const getStatusColor = (s) =>
  s === "active"
    ? "blue"
    : s === "draft"
    ? "purple"
    : s === "archived"
    ? "default"
    : "default";

const SubjectsManagementPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const breadcrumbs = [
    { label: "الرئيسية", href: "/", icon: BarChart3 },
    { label: "دورة المصدر ", href: "#", icon: Book, current: true },
  ];

  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);

  // ✅ مودال النسخ (دورة كاملة جديدة فقط)
  const [dupTableOpen, setDupTableOpen] = useState(false);
  const [dupFromSubject, setDupFromSubject] = useState(null);
  const [dupLoading, setDupLoading] = useState(false);
  const [dupError, setDupError] = useState("");

  // ✅ إنشاء دورة كاملة جديدة + جدولة الظهور
  const [newCourseTitle, setNewCourseTitle] = useState("");
  const [newCourseCode, setNewCourseCode] = useState("");
  const [releaseContentMode, setReleaseContentMode] =
    useState("now");
  const [contentVisibleFrom, setContentVisibleFrom] = useState(""); // datetime-local
  const [releaseSourcesMode, setReleaseSourcesMode] =
    useState("now");
  const [sourcesVisibleFrom, setSourcesVisibleFrom] = useState(""); // datetime-local

  // ✅ pagination state (sync with backend)
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(4); // default per_page

  const {
    rounds_loading,
    rounds_list,
    source_round_loading,
    source_round_list,
  } = useSelector((state) => state?.rounds);

  // meta from backend pagination
  const meta = source_round_list?.data?.message || {};

  /* ===== Effects ===== */

  // Get all rounds once (if needed)
  useEffect(() => {
    dispatch(handleGetAllRounds());
  }, [dispatch]);

  // Fetch source rounds whenever page/pageSize change
  useEffect(() => {
    dispatch(
      handleGetSourceRound({
        page,
        per_page: pageSize,
      })
    );
  }, [dispatch, page, pageSize]);

  // Debug: see raw data
  useEffect(() => {
    console.log("source_round_list:", source_round_list?.data?.message);
  }, [source_round_list]);

  // Normalize backend data to array
  const normalizedSubjects = useMemo(() => {
    const data = source_round_list?.data?.message?.data;
    if (!Array.isArray(data)) return [];
    return data.map((s) => ({
      ...s,
      _cat: inferCategory(s),
    }));
  }, [source_round_list]);

  // Filter by tab + search
  const filteredSubjects = useMemo(() => {
    const term = (searchTerm || "").toLowerCase();
    const base =
      activeTab === "all"
        ? normalizedSubjects
        : normalizedSubjects.filter((s) => s._cat === activeTab);

    return base.filter((s) => {
      const name = s.name?.toLowerCase() || "";
      const desc = s.description?.toLowerCase() || "";
      return name.includes(term) || desc.includes(term);
    });
  }, [normalizedSubjects, activeTab, searchTerm]);

  useEffect(() => {
    console.log("filteredSubjects:", filteredSubjects);
  }, [filteredSubjects]);

  // ✅ افتح مودال "دورة كاملة جديدة" مباشرة
  const openDuplicate = (record) => {
    setDupFromSubject(record);
    setDupError("");
    setNewCourseTitle(record?.name ? `نسخة من ${record.name}` : "");
    setNewCourseCode("");
    setReleaseContentMode("now");
    setContentVisibleFrom("");
    setReleaseSourcesMode("now");
    setSourcesVisibleFrom("");
    setDupTableOpen(true);
  };

  const confirmDuplicate = async () => {
    try {
      setDupError("");
      setDupLoading(true);

      if (!newCourseTitle.trim()) {
        setDupError("اكتب اسم الدورة الجديدة.");
        return;
      }
      if (releaseContentMode === "schedule" && !contentVisibleFrom) {
        setDupError("حدد موعد ظهور المحتوى.");
        return;
      }
      if (releaseSourcesMode === "schedule" && !sourcesVisibleFrom) {
        setDupError("حدد موعد ظهور المصادر.");
        return;
      }

      const payload = {
        fromCourseCode: dupFromSubject?.code,
        newCourse: {
          title: newCourseTitle.trim(),
          code: newCourseCode.trim() || undefined,
          release: {
            content:
              releaseContentMode === "now"
                ? { mode: "now" }
                : { mode: "schedule", at: contentVisibleFrom },
            sources:
              releaseSourcesMode === "now"
                ? { mode: "now" }
                : { mode: "schedule", at: sourcesVisibleFrom },
          },
        },
      };

      console.log("Duplicate (new full course):", payload);
      // TODO: call API here
      // await api.duplicateToNewCourse(payload)

      setDupTableOpen(false);
    } catch (e) {
      setDupError(e?.message || "تعذّر النسخ، جرّب مرة أخرى.");
    } finally {
      setDupLoading(false);
    }
  };

  /* ===== Table columns ===== */

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
            <Book className="w-3 h-3" />
            <span>{record.units?.length || 0} وحدات</span>
          </div>
          <div className="flex items-center justify-end gap-1 gap-reverse text-xs text-[#202938]/60">
            <Users className="w-3 h-3" />
            <span>{record.students ?? 0} طلاب</span>
          </div>
          <div className="flex items-center justify-end gap-1 gap-reverse text-xs text-[#202938]/60">
            <Copy className="w-3 h-3" />
            <span>{record.questions ?? 0} أسئلة</span>
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
          {/* ✅ افتح مودال "دورة كاملة جديدة" مباشرة */}
          <Button
            type="text"
            size="small"
            className="text-emerald-600 hover:bg-emerald-50"
            aria-label="نسخ إلى دورة كاملة جديدة"
            onClick={() => openDuplicate(record)}
          >
            <Copy className="w-4 h-4" />
          </Button>

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
      ),
    },
  ];

  if (source_round_loading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <Spin size="large" spinning />
      </div>
    );
  }

  const total = meta?.total || 0;
  const backendCurrentPage = meta?.current_page || page;
  const backendPageSize = meta?.per_page || pageSize;
  const lastPage = meta?.last_page || 1; // 👈 number of pages from backend

  return (
    <PageLayout>
      <div dir="rtl">
        <BreadcrumbsShowcase items={breadcrumbs} variant="pill" />

        <PagesHeader
          title={" إدارة دورة المصدر"}
          subtitle={"نظّم وأدر موادك التعليمية"}
          extra={
            <div className="flex items-center gap-4 gap-reverse">
              <Button
                onClick={() => router.push(`/saudi_source_course/add-data`)}
                type="primary"
                size="large"
                icon={<Plus className="w-5 h-5" />}
              >
                إضافة دورة جديدة
              </Button>
            </div>
          }
        />

        <SearchAndFilters
          mode={viewMode}
          setMode={setViewMode}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />

        {viewMode === "table" ? (
          <Table
            columns={columns}
            dataSource={filteredSubjects}
            rowKey={(r) => r.id || r.code}
            loading={source_round_loading}
            className="shadow-sm mt-3"
            pagination={{
              current: backendCurrentPage,
              pageSize: backendPageSize,
              total,
              // 👇 Antd will compute number of pages as total / pageSize,
              // while backend gives you `last_page` if you ever need it.
              showSizeChanger: true,
              showTotal: (total, range) =>
                `عرض ${range[0]}–${range[1]} من ${total} دورة (عدد الصفحات: ${lastPage})`,
              onChange: (newPage, newPageSize) => {
                setPage(newPage);
                setPageSize(newPageSize);
                // fetch handled by useEffect above
              },
            }}
          />
        ) : (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSubjects?.map((subject) => (
              <CourseSourceSubjectCard
                key={subject.code || subject.id}
                subject={subject}
                course_type="egyptian"
                buttonStyle="dropdown"
                onRequestDuplicate={(subj) => openDuplicate(subj)}
                onEdit={(subject) => console.log("Edit:", subject)}
                onDelete={(subject) => console.log("Delete:", subject)}
              />
            ))}
            {filteredSubjects.length === 0 && (
              <div className="col-span-full text-center text-gray-500 py-16">
                لا توجد دورات ضمن هذا التبويب تطابق بحثك
              </div>
            )}
          </div>
        )}

        {/* ✅ مودال النسخ لدورة كاملة جديدة + جدولة الظهور */}
        {dupTableOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setDupTableOpen(false)}
            />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 z-50">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                نسخ المحتوى من دورة المصدر
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                سيتم إنشاء <b>دورة كاملة جديدة</b> من{" "}
                <b>{dupFromSubject?.name}</b> مع إمكانية تحديد مواعيد الظهور.
              </p>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    اسم الدورة الجديدة
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200"
                    placeholder="مثال: دورة العلوم – فصل 1"
                    value={newCourseTitle}
                    onChange={(e) => setNewCourseTitle(e.target.value)}
                  />
                </div>

                <div className="rounded-lg border p-3 text-xs text-gray-700 bg-gray-50 space-y-3">
                  <div>
                    <div className="font-semibold mb-1">موعد ظهور المحتوى</div>
                    <div className="flex items-center gap-3">
                      <label className="inline-flex items-center gap-2">
                        <input
                          type="radio"
                          name="contentRelease"
                          checked={releaseContentMode === "now"}
                          onChange={() => setReleaseContentMode("now")}
                        />
                        الآن
                      </label>
                      <label className="inline-flex items-center gap-2">
                        <input
                          type="radio"
                          name="contentRelease"
                          checked={releaseContentMode === "schedule"}
                          onChange={() => setReleaseContentMode("schedule")}
                        />
                        جدولة
                      </label>
                    </div>
                    {releaseContentMode === "schedule" && (
                      <div className="mt-2">
                        <input
                          type="datetime-local"
                          className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200"
                          value={contentVisibleFrom}
                          onChange={(e) =>
                            setContentVisibleFrom(e.target.value)
                          }
                        />
                        <div className="mt-1 text-[11px] text-gray-500">
                          لن يظهر أي محتوى (وحدات/دروس/اختبارات) للطلاب قبل هذا
                          الموعد.
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="font-semibold mb-1">موعد ظهور المصادر</div>
                    <div className="flex items-center gap-3">
                      <label className="inline-flex items-center gap-2">
                        <input
                          type="radio"
                          name="sourcesRelease"
                          checked={releaseSourcesMode === "now"}
                          onChange={() => setReleaseSourcesMode("now")}
                        />
                        الآن
                      </label>
                      <label className="inline-flex items-center gap-2">
                        <input
                          type="radio"
                          name="sourcesRelease"
                          checked={releaseSourcesMode === "schedule"}
                          onChange={() => setReleaseSourcesMode("schedule")}
                        />
                        جدولة
                      </label>
                    </div>
                    {releaseSourcesMode === "schedule" && (
                      <div className="mt-2">
                        <input
                          type="datetime-local"
                          className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200"
                          value={sourcesVisibleFrom}
                          onChange={(e) =>
                            setSourcesVisibleFrom(e.target.value)
                          }
                        />
                        <div className="mt-1 text-[11px] text-gray-500">
                          لن تظهر ملفات/مصادر الدورة قبل هذا الموعد.
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="rounded-lg border p-3 text-xs text-gray-600 bg-gray-50">
                  سيتم نسخ <b>الدورة كاملة</b> (الوحدات، الدروس، الأسئلة،
                  المرفقات، المصادر) إلى دورة جديدة باسمك المحدد، مع احترام مواعيد
                  الظهور أعلاه.
                </div>
              </div>

              {dupError && (
                <p className="text-sm text-red-600 mt-3">{dupError}</p>
              )}

              <div className="mt-6 flex justify-end gap-2">
                <button
                  onClick={() => setDupTableOpen(false)}
                  disabled={dupLoading}
                  className="px-4 py-2 rounded-lg border bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  إلغاء
                </button>
                <button
                  onClick={confirmDuplicate}
                  disabled={dupLoading}
                  className="px-4 py-2 rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50"
                >
                  {dupLoading ? "جارٍ الإنشاء…" : "إنشاء ونسخ"}
                </button>
              </div>
            </div>
          </div>
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
