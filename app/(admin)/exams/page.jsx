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
import { subjects } from "../../../data/subjects";
import { useParams } from "next/navigation";
import Link from "next/link";
import Button from "../../../components/atoms/Button";
import PagesHeader from "../../../components/ui/PagesHeader";
import { Modal, Select, Input, DatePicker } from "antd";
import CustomModal from "../../../components/layout/Modal";
import PageLayout from "../../../components/layout/PageLayout";
import ExamCard from "../../../components/ui/Cards/QuestionCard";
import exams from "../../../data/exams";

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
   
  useEffect(() => {
    console.log(exams);
  } , [exams])

  const breadcrumbs = [
    { label: "الرئيسية", href: "/", icon: BarChart3 },
    { label: "الاختبارات", href: "#", current: true },
  ];

  /** Helpers */
  const normalizeDate = (d) => (d ? dayjs(d) : null);

  // Date overlap: an exam is included if any of these is true:
  // - exam period [startDate, endDate] overlaps the picked range
  // - OR (fallback) createdAt lies inside the picked range
  const inPickedRange = (exam, range) => {
    if (!range || !Array.isArray(range) || !range[0] || !range[1]) return true;

    const [rStart, rEnd] = range;
    const start = normalizeDate(exam.startDate);
    const end = normalizeDate(exam.endDate);
    const created = normalizeDate(exam.createdAt);

    // overlap check (inclusive)
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

    const base = exams.filter((exam) => {
      // Type tabs
      const matchesType = !selectedType || exam.type === selectedType;

      // Search (title, description, subjects)
      const term = lower(searchTerm);
      const matchesSearch =
        !term ||
        lower(exam.title).includes(term) ||
        lower(exam.description).includes(term) ||
        (exam.subjects || []).some((s) => lower(s).includes(term));

      // Status + Difficulty
      const matchesStatus = !selectedStatus || exam.status === selectedStatus;
      const matchesDifficulty =
        !selectedDifficulty || exam.difficulty === selectedDifficulty;

      // Date range
      const matchesDates = inPickedRange(exam, dateRange);

      return (
        matchesType &&
        matchesSearch &&
        matchesStatus &&
        matchesDifficulty &&
        matchesDates
      );
    });

    // Sorting
    const sorted = [...base].sort((a, b) => {
      if (sortBy === "title") {
        return a.title.localeCompare(b.title, "ar");
      }
      if (sortBy === "participantsCount") {
        return (b.participantsCount || 0) - (a.participantsCount || 0);
      }
      if (sortBy === "averageScore") {
        return (b.averageScore || 0) - (a.averageScore || 0);
      }
      // Default: createdAt (descending)
      const da = normalizeDate(a.createdAt);
      const db = normalizeDate(b.createdAt);
      if (!da && !db) return 0;
      if (!da) return 1;
      if (!db) return -1;
      return db.valueOf() - da.valueOf();
    });

    return sorted;
  }, [
    exams,
    searchTerm,
    selectedStatus,
    selectedDifficulty,
    dateRange,
    sortBy,
    selectedType,
  ]);

  const getStatusStats = () => {
    const stats = exams.reduce((acc, exam) => {
      acc[exam.status] = (acc[exam.status] || 0) + 1;
      return acc;
    }, {});
    return {
      total: exams.length,
      active: stats.active || 0,
      draft: stats.draft || 0,
      completed: stats.completed || 0,
      expired: stats.expired || 0,
    };
  };

  const stats = getStatusStats();

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

              {/* View Toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md transition-all duration-200 ${
                    viewMode === "grid"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-md transition-all duration-200 ${
                    viewMode === "list"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
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

        {/* Type Tabs */}
        <div className="flex gap-2 items-center my-3 !mb-5">
          {tabs.map((item) => {
            const active = selectedType === item.id;
            return (
              <button
                key={item.id}
                onClick={() =>
                  setSelectedType((prev) => (prev === item.id ? null : item.id))
                }
                className={`rounded-md px-3 py-2 border transition-all ${
                  active
                    ? "border-blue-600 text-blue-700 bg-blue-50"
                    : "border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {item.title}
              </button>
            );
          })}
          {(
            <button
              onClick={() => setSelectedType(null)}
              className="px-3 py-2 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50"
            >
              الكل
            </button>
          )}
        </div>

        {/* Results Summary */}
        {(searchTerm || selectedStatus || selectedDifficulty || dateRange || selectedType) && (
          <div className="mb-6">
            <div className="flex items-center justify-between bg-blue-50 rounded-xl p-4 border border-blue-100">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <span className="text-blue-800 font-medium">
                  عُثر على {filteredExams.length} اختبار من أصل {exams.length}
                </span>
              </div>
              
            </div>
          </div>
        )}

        {/* Exams Grid/List */}
        <div
          className={`${
            viewMode === "grid"
              ? "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8"
              : "space-y-6"
          } transition-all duration-500`}
        >
          {filteredExams.map((exam) => (
            <ExamCard
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
              {searchTerm || selectedStatus || selectedDifficulty || dateRange || selectedType
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

        {/* Preview Modal */}
        <Modal
          footer={null}
          open={prevModal}
          className="!w-[90%] !max-w-4xl"
          onCancel={() => setPrevModal(false)}
          title={
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  معاينة الاختبار
                </h3>
                <p className="text-sm text-gray-500">{selectedExam?.title}</p>
              </div>
            </div>
          }
        >
          {selectedExam && (
            <div className="space-y-6 p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-xl">
                  <FileText className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm text-blue-600 font-medium">الأسئلة</p>
                  <p className="text-xl font-bold text-blue-700">
                    {selectedExam.questionsCount}
                  </p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-xl">
                  <Clock className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <p className="text-sm text-green-600 font-medium">المدة</p>
                  <p className="text-xl font-bold text-green-700">
                    {selectedExam.duration} د
                  </p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-xl">
                  <Users className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                  <p className="text-sm text-purple-600 font-medium">
                    المشاركون
                  </p>
                  <p className="text-xl font-bold text-purple-700">
                    {selectedExam.participantsCount}
                  </p>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-xl">
                  <Trophy className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                  <p className="text-sm text-orange-600 font-medium">الدرجات</p>
                  <p className="text-xl font-bold text-orange-700">
                    {selectedExam.totalMarks}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-semibold text-gray-800 mb-2">
                  وصف الاختبار
                </h4>
                <p className="text-gray-600">{selectedExam.description}</p>
              </div>

              <div className="flex justify-end gap-3">
                <Button onClick={() => setPrevModal(false)}>إغلاق</Button>
                <Button
                  type="primary"
                  className="bg-gradient-to-r from-green-500 to-emerald-500 border-0"
                >
                  <Play className="w-4 h-4 mr-2" />
                  بدء الاختبار
                </Button>
              </div>
            </div>
          )}
        </Modal>

        {/* Delete Modal */}
        <CustomModal
          isOpen={deleteModal}
          onClose={() => setDeleteModal(false)}
          title="حذف الاختبار"
          size="sm"
        >
          <div className="space-y-4" dir="rtl">
            <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-red-900">هل أنت متأكد؟</h4>
                <p className="text-sm text-red-700">
                  سيتم حذف الاختبار نهائياً ولا يمكن التراجع عن هذا الإجراء.
                </p>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">الاختبار المراد حذفه:</p>
              <p className="font-medium text-[#202938] mb-1">
                {selectedExam?.title}
              </p>
              <p className="text-sm text-gray-500">
                {selectedExam?.participantsCount} مشارك •{" "}
                {selectedExam?.questionsCount} سؤال
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={() => setDeleteModal(false)}
                className="px-4 py-2 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                إلغاء
              </button>
              <button
                onClick={() => {
                  // TODO: delete logic
                  setDeleteModal(false);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                حذف الاختبار
              </button>
            </div>
          </div>
        </CustomModal>
      </PageLayout>
    </>
  );
};

export default TopicExams;
