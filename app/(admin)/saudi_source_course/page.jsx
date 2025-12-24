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
import { Spin, Modal, Pagination } from "antd";
import {
  handleGetAllRounds,
  handleGetSourceRound,
  handleActiveRound,
  handleDeleteRound,
  handleCopyRound,
} from "@/lib/features/roundsSlice";
import { toast } from "react-toastify";

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
  // مواعيد نسخة الدورة الجديدة
  const [startDate, setStartDate] = useState("");      // YYYY-MM-DD
  const [endDate, setEndDate] = useState("");          // YYYY-MM-DD
  const [timeShow, setTimeShow] = useState("");        // HH:MM

  // مواعيد ظهور المصادر
  const [resourcesDate, setResourcesDate] = useState(""); // YYYY-MM-DD

  // ✅ pagination state (sync with backend)
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(100000); // default per_page

  const {
    rounds_loading,
    rounds_list,
    source_round_loading,
    source_round_list,
    copy_round_loading,
  } = useSelector((state) => state?.rounds);

  // meta from backend pagination
  const metaData = source_round_list?.data?.message;
  const total = metaData?.total || 0;
  const backendCurrentPage = metaData?.current_page || page;
  const backendPageSize = metaData?.per_page || pageSize;
  const lastPage = metaData?.last_page || 1;

  // ✅ Active toggle modal state
  const [activeModal, setActiveModal] = useState({
    open: false,
    subject: null,
  });
  const [activeLoading, setActiveLoading] = useState(false);

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

  /* ===== Handlers ===== */

  // ✅ افتح مودال "دورة كاملة جديدة" مباشرة
  const openDuplicate = (record) => {
    setDupFromSubject(record);
    setDupError("");
    setNewCourseTitle(record?.name ? `نسخة من ${record.name}` : "");
    setNewCourseCode("");

    // reset scheduling fields
    setStartDate("");
    setEndDate("");
    setTimeShow("");
    setResourcesDate("");

    setDupTableOpen(true);
  };


  const confirmDuplicate = async () => {
    setDupError("");

    if (!dupFromSubject?.id && !dupFromSubject?.round_id) {
      setDupError("تعذّر العثور على الدورة الأصلية.");
      return;
    }

    if (!newCourseTitle.trim()) {
      setDupError("اكتب اسم الدورة الجديدة.");
      return;
    }

    if (!startDate) {
      setDupError("حدد تاريخ بداية الدورة.");
      return;
    }

    if (!endDate) {
      setDupError("حدد تاريخ نهاية الدورة.");
      return;
    }

    if (!timeShow) {
      setDupError("حدد وقت ظهور المحتوى.");
      return;
    }

    if (!resourcesDate) {
      setDupError("حدد موعد ظهور مصادر الدورة.");
      return;
    }

    // normalize time "HH:MM" -> "HH:MM:00"
    const normalizedTime =
      timeShow.length === 5 ? `${timeShow}:00` : timeShow;

    const body = {
      round_id: dupFromSubject?.id ?? dupFromSubject?.round_id,
      name: newCourseTitle.trim(),
      start_date: startDate,             // "2025-10-15"
      end_date: endDate,                 // "2026-11-15"
      time_show: normalizedTime,         // "12:00:00"
      show_resources_date: resourcesDate // "2030-11-15"
    };


    setDupLoading(true);
    try {
      const res = await dispatch(handleCopyRound({ body })).unwrap();
      if (res?.data?.status == "success") {
        toast.success("تم إنشاء نسخة من الدورة بنجاح");
        setDupTableOpen(false);
      } else {
        setDupError(
          "تعذّر نسخ الدورة، جرّب مرة أخرى."
        );
      }
    } catch (e) {
      setDupError(
        e?.error?.response?.data?.message || "تعذّر نسخ الدورة، جرّب مرة أخرى."
      );
    } finally {
      setDupLoading(false);
    }
  };


  const openActiveModal = (subject) => {
    setActiveModal({
      open: true,
      subject,
    });
  };

  const closeActiveModal = () => {
    if (activeLoading) return;
    setActiveModal({
      open: false,
      subject: null,
    });
  };

  const confirmActiveToggle = () => {
    if (!activeModal.subject) return;
    const subject = activeModal.subject;

    const formData = new FormData();
    formData.append("id", subject?.id);
    // current value "1"/1 = active -> make 0, else 1
    const isActive = subject?.active === "1" || subject?.active === 1;
    formData.append("active", isActive ? 0 : 1);

    setActiveLoading(true);
    dispatch(handleActiveRound({ body: formData }))
      .unwrap()
      .then((res) => {
        if (res?.data?.status === "success") {
          toast.success(res?.data?.message);
          dispatch(
            handleGetSourceRound({
              page,
              per_page: pageSize,
            })
          );
        } else {
          toast.error(res?.data?.message || "حدث خطأ أثناء تحديث الحالة");
        }
      })
      .catch((e) => {
        console.log(e);
        toast.error("حدث خطأ أثناء تحديث الحالة");
      })
      .finally(() => {
        setActiveLoading(false);
        closeActiveModal();
      });
  };

  // ✅ Pagination handler (used by table & grid Pagination)
  const handlePageChange = (newPage, newPageSize) => {
    if (newPageSize !== pageSize) {
      setPage(1);
      setPageSize(newPageSize);
    } else {
      setPage(newPage);
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
              showSizeChanger: true,
              showTotal: (total, range) =>
                `عرض ${range[0]}–${range[1]} من ${total} دورة (عدد الصفحات: ${lastPage})`,
              onChange: (newPage, newPageSize) => {
                handlePageChange(newPage, newPageSize);
              },
            }}
          />
        ) : (
          <>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSubjects?.map((subject) => (
                <CourseSourceSubjectCard
                  page={page}
                  source={true}
                  pageSize={backendPageSize}
                  key={subject.code || subject.id}
                  subject={subject}
                  course_type="egyptian"
                  buttonStyle="dropdown"
                  onActive={openActiveModal} // ✅ تفعيل/إلغاء التفعيل
                  onRequestDuplicate={(subj) => openDuplicate(subj)}
                  onEdit={(subject) => console.log("Edit:", subject)}
                  onDelete={(subject) => {
                    setSelectedSubject(subject);
                    setDeleteModal(true);
                  }}
                />
              ))}
              {filteredSubjects.length === 0 && (
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
                  showSizeChanger
                  locale={{
                    items_per_page: "/ الصفحة",
                    jump_to: "اذهب إلى",
                    page: "الصفحة",
                    prev_page: "الصفحة السابقة",
                    next_page: "الصفحة التالية",
                  }}
                />
              </div>
            )}
          </>
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

                {/* مواعيد المحتوى */}
                <div className="rounded-lg border p-3 text-xs text-gray-700 bg-gray-50 space-y-3">
                  <div className="font-semibold mb-2">مواعيد ظهور المحتوى</div>
                  <div className="grid gap-3 md:grid-cols-2">
                    <div>
                      <label className="block mb-1 text-[11px] font-semibold">
                        تاريخ بداية الدورة
                      </label>
                      <input
                        type="date"
                        className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-[11px] font-semibold">
                        تاريخ نهاية الدورة
                      </label>
                      <input
                        type="date"
                        className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block mb-1 text-[11px] font-semibold">
                        وقت ظهور المحتوى 
                      </label>
                      <input
                        type="time"
                        className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200"
                        value={timeShow}
                        onChange={(e) => setTimeShow(e.target.value)}
                      />
                      <div className="mt-1 text-[11px] text-gray-500">
                        سيتم إتاحة المحتوى للطلاب في هذا الوقت حسب تواريخ البداية والنهاية.
                      </div>
                    </div>
                  </div>
                </div>

                {/* موعد ظهور المصادر */}
                <div className="rounded-lg border p-3 text-xs text-gray-700 bg-gray-50 space-y-2">
                  <div className="font-semibold mb-1">موعد ظهور المصادر</div>
                  <input
                    type="date"
                    className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200"
                    value={resourcesDate}
                    onChange={(e) => setResourcesDate(e.target.value)}
                  />
                  <div className="mt-1 text-[11px] text-gray-500">
                    لن تظهر ملفات/مصادر الدورة قبل هذا التاريخ.
                  </div>
                </div>

                <div className="rounded-lg border p-3 text-xs text-gray-600 bg-gray-50">
                  سيتم نسخ <b>الدورة كاملة</b> (الوحدات، الدروس، الأسئلة، المرفقات،
                  المصادر) إلى دورة جديدة باسمك المحدد، مع استخدام مواعيد الظهور أعلاه.
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

        {/* ✅ Active Toggle Modal */}
        <Modal
          open={activeModal.open}
          onCancel={closeActiveModal}
          onOk={confirmActiveToggle}
          okText={
            activeModal.subject &&
              (activeModal.subject.active === "1" ||
                activeModal.subject.active === 1)
              ? "جعلها غير نشطة"
              : "جعلها نشطة"
          }
          cancelText="إلغاء"
          confirmLoading={activeLoading}
          centered
          title={
            activeModal.subject &&
              (activeModal.subject.active === "1" ||
                activeModal.subject.active === 1)
              ? "إلغاء تفعيل الدورة"
              : "تفعيل الدورة"
          }
        >
          <p className="mb-2">
            {activeModal.subject &&
              (activeModal.subject.active === "1" ||
                activeModal.subject.active === 1)
              ? "هل أنت متأكد أنك تريد جعل هذه الدورة غير نشطة؟ لن تظهر للطلاب."
              : "هل أنت متأكد أنك تريد تفعيل هذه الدورة لتظهر للطلاب؟"}
          </p>
          {activeModal.subject && (
            <div className="p-3 rounded-md bg-slate-50 border text-sm text-slate-700">
              {activeModal.subject.name}
            </div>
          )}
        </Modal>

        <DeleteSubjectModal
        page={page}
        pageSize={pageSize}
          open={deleteModal}
          setOpen={setDeleteModal}
          selectedSubject={selectedSubject}
        />
      </div>
    </PageLayout>
  );
};

export default SubjectsManagementPage;
