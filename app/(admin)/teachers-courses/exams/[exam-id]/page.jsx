"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Plus,
  BookOpen,
  Trash2,
  BarChart3,
  Book,
  AlertTriangle,
  Filter,
  Search,
  Calendar,
  Clock,
  Users,
  Trophy,
  Grid3X3,
  List,
  SortDesc,
  FileText,
  Play,
  Pause,
  Settings,
} from "lucide-react";
import BreadcrumbsShowcase from "../../../../../components/ui/BreadCrumbs";
import { subjects } from "../../../../../data/subjects";
import { useParams } from "next/navigation";
import Link from "next/link";
import Button from "../../../../../components/atoms/Button";
import PagesHeader from "../../../../../components/ui/PagesHeader";
// import ExamCard from "../../../components/ui/Cards/ExamCard";
import { Modal, Select, Input, DatePicker } from "antd";
import CustomModal from "../../../../../components/layout/Modal";
import PageLayout from "../../../../../components/layout/PageLayout";
import ExamCard from "../../../../../components/ui/Cards/QuestionCard";

const { Option } = Select;
const { RangePicker } = DatePicker;

const TopicExams = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [dateRange, setDateRange] = useState(null);
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [sortBy, setSortBy] = useState("createdAt");
  const { id, unitId, topicId } = useParams();
  const [selectedExam, setSelectedExam] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const selectedSubjectAndUnitWithTopic = useMemo(() => {
    const subject = subjects.find((subject) => subject.code === id);
    const unit = subject?.units.find(
      (unit) => unit.name == decodeURIComponent(unitId)
    );
    const topic = unit?.topics.find(
      (topic) => topic.name == decodeURIComponent(topicId)
    );
    return { subject, unit, topic };
  }, [id, unitId, topicId]);

  const exams = [
    {
      id: 1,
      title: "اختبار الرياضيات الشامل",
      description:
        "اختبار شامل يغطي جميع موضوعات الجبر والهندسة للفصل الدراسي الأول",
      status: "active",
      difficulty: "Medium",
      questionsCount: 25,
      duration: 90,
      totalMarks: 100,
      participantsCount: 45,
      subjects: ["الجبر", "الهندسة"],
      createdAt: "2024-08-01",
      lastModified: "2024-08-15",
      startDate: "2024-09-01",
      endDate: "2024-09-30",
      creator: "أحمد محمد",
      attempts: 128,
      averageScore: 78.5,
    },
    {
      id: 2,
      title: "اختبار التاريخ المعاصر",
      description: "اختبار حول أحداث القرن العشرين والتطورات السياسية الحديثة",
      status: "draft",
      difficulty: "Hard",
      questionsCount: 30,
      duration: 120,
      totalMarks: 150,
      participantsCount: 0,
      subjects: ["التاريخ المعاصر"],
      createdAt: "2024-07-28",
      lastModified: "2024-08-10",
      startDate: "2024-10-01",
      endDate: "2024-10-31",
      creator: "فاطمة أحمد",
      attempts: 0,
      averageScore: 0,
    },
    {
      id: 3,
      title: "اختبار العلوم الطبيعية",
      description:
        "اختبار في الفيزياء والكيمياء يركز على المفاهيم الأساسية والتطبيقات العملية",
      status: "completed",
      difficulty: "Easy",
      questionsCount: 20,
      duration: 60,
      totalMarks: 80,
      participantsCount: 67,
      subjects: ["الفيزياء", "الكيمياء"],
      createdAt: "2024-07-15",
      lastModified: "2024-07-20",
      startDate: "2024-07-20",
      endDate: "2024-08-20",
      creator: "خالد عبدالله",
      attempts: 189,
      averageScore: 82.3,
    },
    {
      id: 4,
      title: "اختبار اللغة العربية",
      description:
        "اختبار شامل في النحو والصرف والأدب العربي الكلاسيكي والحديث",
      status: "expired",
      difficulty: "Hard",
      questionsCount: 35,
      duration: 150,
      totalMarks: 120,
      participantsCount: 23,
      subjects: ["النحو", "الأدب"],
      createdAt: "2024-06-01",
      lastModified: "2024-06-05",
      startDate: "2024-06-10",
      endDate: "2024-07-10",
      creator: "مريم سالم",
      attempts: 76,
      averageScore: 65.8,
    },
  ];

  const [deleteModal, setDeleteModal] = useState(false);
  const [prevModal, setPrevModal] = useState(false);
  const params = useParams();
  const exam_id = params["exam-id"];

  const [selectedSub, setSelectedSub] = useState({});

  useEffect(() => {
    setSelectedSub(subjects?.find((item) => item?.code == exam_id));
  }, [exam_id]);

  const breadcrumbs = [
    { label: "الرئيسية", href: "/", icon: BarChart3 },
    {
      label: selectedSub?.name,
      href: "/teachers-courses",
      icon: "",
    },
    { label: "الاختبارات", href: "#", current: true },
  ];

  const filteredExams = useMemo(() => {
    return exams.filter((exam) => {
      const matchesSearch =
        exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exam.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = !selectedStatus || exam.status === selectedStatus;
      const matchesDifficulty =
        !selectedDifficulty || exam.difficulty === selectedDifficulty;

      return matchesSearch && matchesStatus && matchesDifficulty;
    });
  }, [exams, searchTerm, selectedStatus, selectedDifficulty]);

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
              {/* Stats Cards */}
              {/* <div className="hidden lg:flex items-center gap-4">
                <div className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl px-4 py-3 border border-blue-100">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  <div className="text-right">
                    <p className="text-xs text-blue-600 font-medium">إجمالي الاختبارات</p>
                    <p className="text-lg font-bold text-blue-700">{stats.total}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl px-4 py-3 border border-green-100">
                  <Play className="w-5 h-5 text-green-600" />
                  <div className="text-right">
                    <p className="text-xs text-green-600 font-medium">نشط</p>
                    <p className="text-lg font-bold text-green-700">{stats.active}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl px-4 py-3 border border-yellow-100">
                  <Pause className="w-5 h-5 text-yellow-600" />
                  <div className="text-right">
                    <p className="text-xs text-yellow-600 font-medium">مسودة</p>
                    <p className="text-lg font-bold text-yellow-700">{stats.draft}</p>
                  </div>
                </div>
              </div> */}
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
                />
              </div>
            </div>
          )}
        </div>

        {/* Results Summary */}
        {(searchTerm || selectedStatus || selectedDifficulty) && (
          <div className="mb-6">
            <div className="flex items-center justify-between bg-blue-50 rounded-xl p-4 border border-blue-100">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <span className="text-blue-800 font-medium">
                  عُثر على {filteredExams.length} اختبار من أصل {exams.length}
                </span>
              </div>
              <Button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedStatus("");
                  setSelectedDifficulty("");
                  setDateRange(null);
                }}
                className="text-blue-600 hover:bg-blue-100 border-blue-200"
                size="small"
              >
                إعادة تعيين
              </Button>
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
              {searchTerm || selectedStatus || selectedDifficulty
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
              <p className="text-sm text-gray-600 mb-2">
                الاختبار المراد حذفه:
              </p>
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
                  // Handle delete logic here
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
