"use client";
import React, { useEffect, useRef, useState } from "react";
import PageLayout from "../../../components/layout/PageLayout";
import BreadcrumbsShowcase from "../../../components/ui/BreadCrumbs";
import {
  BarChart3,
  Download,
  FileText,
  Plus,
  Upload,
  Users,
  Edit3,
  Target,
} from "lucide-react";
import PagesHeader from "../../../components/ui/PagesHeader";
import Button from "../../../components/atoms/Button";
import SearchAndFilters from "../../../components/ui/SearchAndFilters";
import ExamsStats from "../../../components/Exams/ExamsStats";
import ExamsGrid from "../../../components/Exams/ExamsGrid";
import AddNewExamModal from "../../../components/Exams/AddNewExamModal";
import EditNewExamModal from "../../../components/Exams/EditNewExamModal";
import DeleteExamModal from "../../../components/Exams/DeleteExamModal";
import ExamsTable from "../../../components/Exams/ExamsTable";

/* -------------------- Helpers -------------------- */
// يحوّل أسئلة المودالات لصيغة داخلية ثابتة مع IDs
const normalizeQuestions = (qs) =>
  (qs || []).map((q, qi) => ({
    id: q?.id ?? `q-${Date.now()}-${qi}`,
    title: (q?.title || "").trim(),
    answers: (q?.answers || []).map((a, ai) => ({
      id: a?.id ?? `a-${qi}-${ai}`,
      text: (a?.text || "").trim(),
      isCorrect: !!a?.isCorrect,
    })),
  }));

const breadcrumbs = [
  { label: "الرئيسية", href: "/", icon: BarChart3 },
  { label: "الاختبارات", href: "/exams", icon: FileText, current: true },
];

export default function ExamsPage() {
  const [newModal, setAddNewModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);

  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  // منيو النقاط
  const [openMenuFor, setOpenMenuFor] = useState(null);
  const menuRef = useRef(null);

  // بيانات افتراضية — الآن تحتوي على questionsData (تفاصيل الأسئلة والإجابات)
  const [exams, setExams] = useState([
    {
      id: 1,
      title: "اختبار الرياضيات المتقدم",
      description: "الجبر والهندسة التحليلية",
      questions: 20,
      status: "نشط",
      duration: 90,
      participants: 245,
      rating: 4.8,
      lastModified: "منذ يومين",
      difficulty: "متوسط",
      subject: "رياضيات",
      questionsData: [
        {
          id: "q1",
          title: "ما ناتج 2x + 3x ؟",
          answers: [
            { id: "q1a1", text: "5x", isCorrect: true },
            { id: "q1a2", text: "6x", isCorrect: false },
            { id: "q1a3", text: "x^2", isCorrect: false },
          ],
        },
        {
          id: "q2",
          title: "ميل المستقيم y = 4x - 7 هو:",
          answers: [
            { id: "q2a1", text: "4", isCorrect: true },
            { id: "q2a2", text: "-7", isCorrect: false },
            { id: "q2a3", text: "0", isCorrect: false },
          ],
        },
      ],
    },
    {
      id: 2,
      title: "اختبار اللغة الإنجليزية",
      description: "قواعد النحو والمفردات",
      questions: 15,
      status: "مسودة",
      duration: 60,
      participants: 0,
      rating: 0,
      lastModified: "منذ ساعة",
      difficulty: "سهل",
      subject: "لغة إنجليزية",
      questionsData: [
        {
          id: "q1",
          title: "Choose the correct past form of 'go':",
          answers: [
            { id: "q1a1", text: "went", isCorrect: true },
            { id: "q1a2", text: "goed", isCorrect: false },
          ],
        },
      ],
    },
    {
      id: 3,
      title: "اختبار العلوم الطبيعية",
      description: "الفيزياء والكيمياء العضوية",
      questions: 25,
      status: "منشور",
      duration: 120,
      participants: 189,
      rating: 4.5,
      lastModified: "منذ 3 أيام",
      difficulty: "صعب",
      subject: "علوم",
      questionsData: [
        {
          id: "q1",
          title: "الشحنة الأساسية للإلكترون:",
          answers: [
            { id: "q1a1", text: "سالبة", isCorrect: true },
            { id: "q1a2", text: "موجبة", isCorrect: false },
            { id: "q1a3", text: "متعادلة", isCorrect: false },
          ],
        },
      ],
    },
    {
      id: 4,
      title: "اختبار التاريخ الحديث",
      description: "القرن العشرين والأحداث المعاصرة",
      questions: 18,
      status: "نشط",
      duration: 75,
      participants: 156,
      rating: 4.2,
      lastModified: "منذ أسبوع",
      difficulty: "متوسط",
      subject: "تاريخ",
      questionsData: [
        {
          id: "q1",
          title: "في أي سنة بدأت الحرب العالمية الثانية؟",
          answers: [
            { id: "q1a1", text: "1939", isCorrect: true },
            { id: "q1a2", text: "1914", isCorrect: false },
          ],
        },
      ],
    },
  ]);

  const statusColors = {
    نشط: "bg-green-50 text-green-700 border-green-200",
    مسودة: "bg-yellow-50 text-yellow-700 border-yellow-200",
    منشور: "bg-blue-50 text-blue-700 border-blue-200",
  };

  const difficultyColors = {
    سهل: "bg-green-100 text-green-800",
    متوسط: "bg-yellow-100 text-yellow-800",
    صعب: "bg-red-100 text-red-800",
  };

  // فلترة
  const filteredExams = exams.filter((exam) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      exam.title.toLowerCase().includes(q) ||
      exam.description.toLowerCase().includes(q) ||
      (exam.subject || "").toLowerCase().includes(q);
    const matchesFilter =
      selectedFilter === "all" || exam.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  /* -------------------- Handlers (View / Edit / Delete) -------------------- */
  const handleView = (exam) => {
    setOpenMenuFor(null);
    // TODO: افتح صفحة/مودال المعاينة — exam.questionsData تحتوي التفاصيل
    console.log("عرض:", exam);
  };

  const handleEdit = (exam) => {
    setOpenMenuFor(null);
    // تجهيز بيانات قابلة للتعديل للمودال
    const editable = exam._raw
      ? { ...exam._raw, id: exam.id }
      : {
          id: exam.id,
          title: exam.title,
          description: exam.description,
          time: exam.duration,
          questions: exam.questionsData || [],
        };
    setSelectedExam(editable);
    setEditModal(true);
  };

  const handleDelete = (exam) => {
    setDeleteModal(true);
    // setExams((prev) => prev.filter((e) => e.id !== exam.id));
  };

  /* -------------------- Add / Edit Submit -------------------- */
  const onAddSubmit = async (payload) => {
    const nextId =
      (exams.length ? Math.max(...exams.map((e) => Number(e.id) || 0)) : 0) + 1;

    const questionsData = normalizeQuestions(payload.questions);

    const newExam = {
      id: nextId,
      title: payload.title,
      description: payload.description,
      duration: Number(payload.time) || 0,
      questions: questionsData.length, // العدد لواجهة الكروت
      status: "مسودة",
      participants: 0,
      rating: 0,
      lastModified: "الآن",
      difficulty: "متوسط",
      subject: "",
      questionsData, // التفاصيل
      _raw: {
        id: nextId,
        title: payload.title,
        description: payload.description,
        time: payload.time,
        questions: questionsData,
      },
    };

    setExams((prev) => [newExam, ...prev]);
  };

  const onEditSubmit = async (payload) => {
    const questionsData = normalizeQuestions(payload.questions);

    setExams((prev) =>
      prev.map((ex) => {
        if (String(ex.id) !== String(payload.id)) return ex;
        return {
          ...ex,
          title: payload.title,
          description: payload.description,
          duration: Number(payload.time) || 0,
          questions: questionsData.length,
          lastModified: "الآن",
          questionsData,
          _raw: {
            id: payload.id,
            title: payload.title,
            description: payload.description,
            time: payload.time,
            questions: questionsData,
          },
        };
      })
    );
  };

  const stats = [
    {
      label: "إجمالي الاختبارات",
      value: exams.length,
      icon: FileText,
      color: "bg-blue-500",
    },
    {
      label: "الاختبارات النشطة",
      value: exams.filter((e) => e.status === "نشط").length,
      icon: Target,
      color: "bg-green-500",
    },
    {
      label: "المسودات",
      value: exams.filter((e) => e.status === "مسودة").length,
      icon: Edit3,
      color: "bg-yellow-500",
    },
    {
      label: "إجمالي المشاركين",
      value: exams.reduce((s, e) => s + e.participants, 0),
      icon: Users,
      color: "bg-purple-500",
    },
  ];

  return (
    <PageLayout>
      <div dir="rtl">
        <BreadcrumbsShowcase items={breadcrumbs} variant="pill" />

        <PagesHeader
          title={"إدارة الاختبارات"}
          subtitle={"مراجعة وإدارة الاختبارات التعليمية"}
          extra={
            <div className="flex items-center gap-3 flex-row-reverse">
              <Button
                onClick={() => setAddNewModal(true)}
                type="primary"
                size="large"
                icon={<Plus className="w-5 h-5" />}
                className="shadow-lg hover:shadow-xl transition-shadow"
              >
                إضافة اختبار جديد
              </Button>
              <Button type="secondary" icon={<Download className="w-4 h-4" />}>
                تصدير
              </Button>
              <Button type="default" icon={<Upload className="w-4 h-4" />}>
                استيراد
              </Button>
            </div>
          }
        />

        {/* إحصائيات */}
        <ExamsStats stats={stats} />

        <SearchAndFilters
          mode={viewMode}
          searchTerm={searchTerm}
          setMode={setViewMode}
          setSearchTerm={setSearchTerm}
        />

        {/* الكروت + منيو النقاط */}

        {viewMode == "grid" ? (
          <ExamsGrid
            menuRef={menuRef}
            openMenuFor={openMenuFor}
            setOpenMenuFor={setOpenMenuFor}
            setSearchTerm={setSearchTerm}
            filteredExams={filteredExams}
            statusColors={statusColors}
            difficultyColors={difficultyColors}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ) : (
          <ExamsTable
            filteredExams={filteredExams}
            statusColors={statusColors}
            difficultyColors={difficultyColors}
            setSearchTerm={setSearchTerm}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>

      {/* مودال إضافة امتحان */}
      <AddNewExamModal
        open={newModal}
        setOpen={setAddNewModal}
        onSubmit={onAddSubmit}
        palette={{ primary: "#02AAA0" }}
      />

      {/* مودال تعديل امتحان */}
      <EditNewExamModal
        open={editModal}
        setOpen={setEditModal}
        exam={selectedExam}
        onSubmit={onEditSubmit}
        palette={{ primary: "#02AAA0" }}
      />

      <DeleteExamModal
        open={deleteModal}
        setOpen={setDeleteModal}
        rowData={selectedExam}
      />
    </PageLayout>
  );
}
