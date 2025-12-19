"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Plus,
  BookOpen,
  Trash2,
  BarChart3,
  AlertTriangle,
  Filter,
  Search,
  Clock,
  Users,
  Trophy,
  Grid3X3,
  List,
  FileText,
  Play,
} from "lucide-react";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
dayjs.extend(isBetween);

import BreadcrumbsShowcase from "../../../components/ui/BreadCrumbs";
import { useParams } from "next/navigation";
import Link from "next/link";
import Button from "../../../components/atoms/Button";
import PagesHeader from "../../../components/ui/PagesHeader";
import { Modal, Select, Input, DatePicker, Spin, Pagination } from "antd";
import CustomModal from "../../../components/layout/Modal";
import PageLayout from "../../../components/layout/PageLayout";
import ExamCard from "../../../components/ui/Cards/QuestionCard";
import { useDispatch, useSelector } from "react-redux";
import { handleDeleteExam, handleGetAllExams } from "../../../lib/features/examSlice";
import { toast } from "react-toastify";
import DeleteExamModal from "../../../components/Exams/DeleteExamModal";

const { Option } = Select;
const { RangePicker } = DatePicker;

const tabs = [
  { id: "intern", title: "تدريب" },
  { id: "mock", title: "اختبار محاكي" },
];

const TopicExams = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [dateRange, setDateRange] = useState(null); // [start, end] (dayjs)
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [sortBy, setSortBy] = useState("createdAt");
  const [selectedType, setSelectedType] = useState(null); // null=all, 'intern' or 'mock'
  const { id, unitId, topicId } = useParams();
  const [selectedExam, setSelectedExam] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const [deleteModal, setDeleteModal] = useState(false);
  const [prevModal, setPrevModal] = useState(false);

  const dispatch = useDispatch();
  const { all_exam_loading, all_exam_list, delete_exam_loading } = useSelector(
    (state) => state?.exam
  );

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6); // default per_page

  const metaData = all_exam_list?.data?.message;
  const total = metaData?.total || 0;
  const backendCurrentPage = metaData?.current_page || page;
  const backendPageSize = metaData?.per_page || pageSize;
  const lastPage = metaData?.last_page || 1;

  useEffect(() => {
      dispatch(
        handleGetAllExams({
          page,
          per_page: pageSize,
        })
      );
    }, [dispatch, page, pageSize]);
  useEffect(() => {
    console.log("API exams:", all_exam_list?.data?.message?.data);
  }, [all_exam_list]);

  const breadcrumbs = [
    { label: "الرئيسية", href: "/", icon: BarChart3 },
    { label: "الاختبارات", href: "#", current: true },
  ];

  /** Helpers */
  const normalizeDate = (d) => (d ? dayjs(d) : null);

  const normalizeExam = (exam) => {
    const createdAt =
      exam.createdAt || exam.created_at || exam.date || null;
    const date = exam.date || null;

    const isMock = !!(exam.time || exam.duration);
    const type = isMock ? "mock" : "intern";

    return {
      ...exam,
      name: exam.name || exam.title || "",
      createdAt,
      startDate: exam.startDate || date,
      endDate: exam.endDate || date,
      questions_count: exam?.questions_count,
      difficulty: exam.difficulty || exam.level || "",
      status: exam.status || "active",
      type,
      participantsCount: exam.participantsCount ?? exam.participants_count ?? 0,
      averageScore: exam.averageScore ?? exam.average_score ?? 0,
      totalMarks: exam.totalMarks ?? exam.total_marks ?? 0,
      questionsCount: exam?.questions_count ?? exam?.questions_count ?? 0,
      duration: exam.duration || exam.time || null,
      isFree: exam.free === "1" || exam.free === 1 || exam.free === true,
    };
  };

  useEffect(() => {
    console.log(all_exam_list?.data?.message?.data);
  }, [all_exam_list])

  const normalizedExams = useMemo(() => {
    return  (all_exam_list?.data?.message?.data || []).map(normalizeExam)
  } ,[all_exam_list])

  const inPickedRange = (exam, range) => {
    if (!range || !Array.isArray(range) || !range[0] || !range[1]) return true;

    const [rStart, rEnd] = range;
    const start = normalizeDate(exam.startDate);
    const end = normalizeDate(exam.endDate);
    const created = normalizeDate(exam.createdAt);

    const overlaps =
      start &&
      end &&
      (start.isBetween(rStart, rEnd, "day", "[]") ||
        end.isBetween(rStart, rEnd, "day", "[]") ||
        (start.isBefore(rStart, "day") && end.isAfter(rEnd, "day")));

    const createdInside =
      created && created.isBetween(rStart, rEnd, "day", "[]");

    return overlaps || createdInside;
  };

  const filteredExams = useMemo(() => {
    const lower = (v) => String(v || "").toLowerCase().trim();

    const base = normalizedExams.filter((exam) => {
      const matchesType = !selectedType || exam.type === selectedType;

      const term = lower(searchTerm);
      const matchesSearch =
        !term ||
        lower(exam?.name).includes(term) ||
        lower(exam?.title).includes(term) ||
        lower(exam?.description).includes(term);

      const matchesStatus = !selectedStatus || exam.status === selectedStatus;
      const matchesDifficulty =
        !selectedDifficulty || exam.difficulty === selectedDifficulty;

      const matchesDates = inPickedRange(exam, dateRange);

      return (
        matchesType &&
        matchesSearch &&
        matchesStatus &&
        matchesDifficulty &&
        matchesDates
      );
    });

    const sorted = [...base].sort((a, b) => {
      if (sortBy === "title") {
        return (a.name || a.title || "").localeCompare(
          b.name || b.title || "",
          "ar"
        );
      }
      if (sortBy === "participantsCount") {
        return (b.participantsCount || 0) - (a.participantsCount || 0);
      }
      if (sortBy === "averageScore") {
        return (b.averageScore || 0) - (a.averageScore || 0);
      }

      const da = normalizeDate(a.createdAt);
      const db = normalizeDate(b.createdAt);
      if (!da && !db) return 0;
      if (!da) return 1;
      if (!db) return -1;
      return db.valueOf() - da.valueOf();
    });

    return sorted;
  }, [
    normalizedExams,
    searchTerm,
    selectedStatus,
    selectedDifficulty,
    dateRange,
    sortBy,
    selectedType,
  ]);
  
  useEffect(() => {
    console.log(filteredExams);
  } ,[filteredExams])

  const paginatedExams = filteredExams.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const handleDelete = (id) => {
    const data_send = {
      id,
    };

    dispatch(handleDeleteExam({ body: data_send }))
      .unwrap()
      .then((res) => {
        if (res?.data?.status === "success") {
          toast.success(res?.data?.message || "تم حذف الاختبار بنجاح");
          dispatch(handleGetAllExams({ page, per_page: pageSize }));
          setDeleteModal(false);
        } else {
          toast.error(res?.data?.message || "هناك خطأ أثناء حذف الاختبار");
        }
      })
      .catch((e) => console.log(e))
      .finally(() => setDeleteModal(false));
  };

  const handlePageChange = (newPage, newPageSize) => {
    if (newPageSize !== pageSize) {
      setPage(1);
      setPageSize(newPageSize);
    } else {
      setPage(newPage);
    }
  };

  if (all_exam_loading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <Spin spinning size="large" />
      </div>
    );
  }

  return (
    <>
      <PageLayout>
        <BreadcrumbsShowcase items={breadcrumbs} variant="pill" />

        <PagesHeader
          extra={
            <div className="flex gap-4 items-center">
              <Link href={"questions/new"}>
                <Button
                  type="primary"
                  size="large"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 border-0 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  إنشاء اختبار جديد
                </Button>
              </Link>
            </div>
          }
          title="الاختبارات"
          subtitle="إدارة وتنظيم الاختبارات التعليمية"
        />

        {/* Filters and Search Section */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <Input
                size="large"
                placeholder="البحث في الاختبارات..."
                prefix={<Search className="w-4 h-4 text-gray-400" />}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="rounded-xl border-gray-200 hover:border-blue-300 focus:border-blue-500"
              />
            </div>

            {/* Filters Toggle */}
            <div className="flex items-center gap-3">
              <Button
                onClick={() => setShowFilters(!showFilters)}
                className={`${
                  showFilters
                    ? "bg-blue-50 text-blue-600 border-blue-200"
                    : "bg-gray-50 text-gray-600 border-gray-200"
                } transition-all duration-300`}
              >
                <Filter className="w-4 h-4 mr-2" />
                تصفية
              </Button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Select
                  size="large"
                  placeholder="حالة الاختبار"
                  allowClear
                  value={selectedStatus}
                  onChange={setSelectedStatus}
                  className="w-full"
                >
                  <Option value="active">نشط</Option>
                  <Option value="draft">مسودة</Option>
                  <Option value="completed">مكتمل</Option>
                  <Option value="expired">منتهي</Option>
                </Select>

                <Select
                  size="large"
                  placeholder="مستوى الصعوبة"
                  allowClear
                  value={selectedDifficulty}
                  onChange={setSelectedDifficulty}
                  className="w-full"
                >
                  <Option value="Easy">سهل</Option>
                  <Option value="Medium">متوسط</Option>
                  <Option value="Hard">صعب</Option>
                </Select>

                <Select
                  size="large"
                  placeholder="ترتيب حسب"
                  value={sortBy}
                  onChange={setSortBy}
                  className="w-full"
                >
                  <Option value="createdAt">تاريخ الإنشاء</Option>
                  <Option value="title">العنوان</Option>
                  <Option value="participantsCount">عدد المشاركين</Option>
                  <Option value="averageScore">المعدل</Option>
                </Select>

                <RangePicker
                  size="large"
                  placeholder={["تاريخ البداية", "تاريخ النهاية"]}
                  value={dateRange}
                  onChange={setDateRange}
                  className="w-full"
                  allowEmpty={[false, false]}
                />
              </div>
            </div>
          )}
        </div>

        {/* Exams Grid/List */}
        <div
          className={`${
            viewMode === "grid"
              ? "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8"
              : "space-y-6"
          } transition-all duration-500`}
        >
          {filteredExams?.map((exam) => (
            <ExamCard
            page={page}
            pageSize={pageSize}
              selectedExam={selectedExam}
              setSelectedExam={setSelectedExam}
              prevModal={prevModal}
              setPrevModal={setPrevModal}
              deleteModal={deleteModal}
              setDeleteModal={setDeleteModal}
              exam={exam}
              key={exam.id}
              viewMode={viewMode}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredExams.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              لا توجد اختبارات متاحة
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm ||
              selectedStatus ||
              selectedDifficulty ||
              dateRange ||
              selectedType
                ? "لم يتم العثور على اختبارات تطابق معايير البحث"
                : "ابدأ بإنشاء اختبار جديد"}
            </p>
            <Link href="exams/new">
              <Button
                type="primary"
                size="large"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 border-0"
              >
                <Plus className="w-5 h-5 mr-2" />
                إنشاء اختبار جديد
              </Button>
            </Link>
          </div>
        )}

        {/* Pagination */}
       {metaData &&  <div className="flex justify-center mt-8">
          <Pagination
           current={backendCurrentPage}
                  pageSize={backendPageSize}
                  total={total}
                  onChange={handlePageChange}
            showSizeChanger
            pageSizeOptions={["6", "10", "20"]}
            onShowSizeChange={(current, size) => setPageSize(size)}
          />
        </div>}

        <DeleteExamModal page={page} per_page={pageSize} open={deleteModal} setOpen={setDeleteModal}  selectedExam={selectedExam} rowData={selectedExam}/>
      </PageLayout>
    </>
  );
};

export default TopicExams;
