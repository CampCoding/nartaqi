"use client";
import React, { useEffect, useRef, useState } from "react";
// import PageLayout from "../../../components/layout/PageLayout";
// import BreadcrumbsShowcase from "../../../components/ui/BreadCrumbs";
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
// import PagesHeader from "../../../components/ui/PagesHeader";
// import Button from "../../../components/atoms/Button";
// import SearchAndFilters from "../../../components/ui/SearchAndFilters";
// import ExamsStats from "../../../components/Exams/ExamsStats";
// import ExamsGrid from "../../../components/Exams/ExamsGrid";
// import AddNewExamModal from "../../../components/Exams/AddNewExamModal";
// import EditNewExamModal from "../../../components/Exams/EditNewExamModal";
// import DeleteExamModal from "../../../components/Exams/DeleteExamModal";
// import ExamsTable from "../../../components/Exams/ExamsTable";

import { Modal, Tag, Divider, Space, Typography, Select } from "antd";
import PageLayout from "@/components/layout/PageLayout";
import BreadcrumbsShowcase from "@/components/ui/BreadCrumbs";
import PagesHeader from "@/components/ui/PagesHeader";
import Button from "@/components/atoms/Button";
import ExamsStats from "@/components/Exams/ExamsStats";
import SearchAndFilters from "@/components/ui/SearchAndFilters";
import ExamsGrid from "@/components/Exams/ExamsGrid";
import ExamsTable from "@/components/Exams/ExamsTable";
import { useParams } from "next/navigation";
import { subjects } from "@/data/subjects";
const { Text, Title } = Typography;

/* -------------------- Helpers -------------------- */
// دمج/تطبيع الأنواع الأربعة للأسئلة
// شكل الخرج الموحّد لكل سؤال:
// { id, type: 'mcq'|'tf'|'written'|'fill', title, answers: [], meta: {} }
const normalizeQuestions = (qs) =>
  (qs || []).map((q, qi) => {
    const base = {
      id: q?.id ?? `q-${Date.now()}-${qi}`,
      type: (q?.type || "mcq").toLowerCase(), // mcq | tf | written | fill
      title: (q?.title || "").trim(),
      answers: [],
      meta: {},
    };

    if (base.type === "mcq") {
      base.answers = (q?.answers || []).map((a, ai) => ({
        id: a?.id ?? `a-${qi}-${ai}`,
        text: (a?.text || "").trim(),
        isCorrect: !!a?.isCorrect,
      }));
      // ضمان وجود إجابة صحيحة واحدة على الأقل
      if (!base.answers.some((a) => a.isCorrect) && base.answers.length) {
        base.answers[0].isCorrect = true;
      }
    } else if (base.type === "tf") {
      // مصدر صحيح/خطأ: يمكن أن يأتي payload.correct = true|false
      const correct = typeof q?.correct === "boolean" ? q.correct : true;
      base.answers = [
        { id: "true", text: "صح", isCorrect: !!correct },
        { id: "false", text: "خطأ", isCorrect: !correct },
      ];
      base.meta = { correct };
    } else if (base.type === "written") {
      // إجابة نموذجية اختيارية
      base.meta = { sampleAnswer: (q?.sampleAnswer || "").trim() };
      base.answers = [];
    } else if (base.type === "fill") {
      // أكمل: إمّا مصفوفة فراغات أو نص بإجابات بين أقواس مثلاً
      const gaps = Array.isArray(q?.gaps) ? q.gaps : [];
      const answerText = (q?.answerText || "").trim();
      base.meta = { gaps, answerText };
      base.answers = [];
    } else {
      // fallback => اعتبره mcq
      base.type = "mcq";
      base.answers = (q?.answers || []).map((a, ai) => ({
        id: a?.id ?? `a-${qi}-${ai}`,
        text: (a?.text || "").trim(),
        isCorrect: !!a?.isCorrect,
      }));
    }
    return base;
  });


// خرائط ألوان للحالة/الصعوبة
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

// خرائط نوع الاختبار
const examTypeLabels = {
  training: "تدريب",
  mock: "اختبار محاكي",
};
const examTypeTagColor = {
  training: "green",
  mock: "blue",
};

/* ----------- معاينة الاختبار (يعرض كل الأنواع) ----------- */
function ExamPreviewModal({ open, onClose, exam }) {
  if (!exam) return null;
  return (
    <Modal title="معاينة الاختبار" open={open} onCancel={onClose} footer={null} width={800}>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Title level={4} className="m-0">{exam.title}</Title>
          <Tag color={examTypeTagColor[exam.examType] || "default"}>
            {examTypeLabels[exam.examType] || exam.examType}
          </Tag>
        </div>
        <Text type="secondary">{exam.description}</Text>
        <Divider />
        {(exam.questionsData || []).map((q, idx) => (
          <div key={q.id} className="p-3 rounded-lg border">
            <Space align="baseline" wrap>
              <Tag color="default">
                {q.type === "mcq" && "اختيار من متعدد"}
                {q.type === "tf" && "صح / خطأ"}
                {q.type === "written" && "سؤال مقالي"}
                {q.type === "fill" && "أكمل الفراغ"}
              </Tag>
              <Text strong>س{idx + 1}:</Text>
              <Text>{q.title}</Text>
            </Space>

            {q.type === "mcq" && (
              <ul className="list-disc pr-5 mt-2">
                {(q.answers || []).map((a) => (
                  <li key={a.id} className={a.isCorrect ? "text-green-600 font-medium" : ""}>
                    {a.text} {a.isCorrect ? "✓" : ""}
                  </li>
                ))}
              </ul>
            )}

            {q.type === "tf" && (
              <div className="mt-2">
                <Tag color={q.meta?.correct ? "green" : "red"}>
                  الإجابة الصحيحة: {q.meta?.correct ? "صح" : "خطأ"}
                </Tag>
              </div>
            )}

            {q.type === "written" && (
              <div className="mt-2">
                <Text type="secondary">إجابة نموذجية (اختياري):</Text>
                <div className="p-2 bg-gray-50 rounded mt-1">{q.meta?.sampleAnswer || "—"}</div>
              </div>
            )}

            {q.type === "fill" && (
              <div className="mt-2 space-y-1">
                <Text type="secondary">إجابات الفراغات / النص:</Text>
                {Array.isArray(q.meta?.gaps) && q.meta.gaps.length > 0 ? (
                  <ul className="list-disc pr-5">
                    {q.meta.gaps.map((g, i) => (
                      <li key={i}>{g}</li>
                    ))}
                  </ul>
                ) : (
                  <div className="p-2 bg-gray-50 rounded">{q.meta?.answerText || "—"}</div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </Modal>
  );
}


export const exams_data =   [
  {
    id: 1,
    title: "اختبار الرياضيات المتقدم",
    description: "الجبر والهندسة التحليلية",
    questions: 4,
    status: "نشط",
    duration: 90,
    participants: 245,
    rating: 4.8,
    lastModified: "منذ يومين",
    difficulty: "متوسط",
    subject: "رياضيات",
    examType: "training", // تدريب
    questionsData: normalizeQuestions([
      {
        type: "mcq",
        title: "ما ناتج 2x + 3x ؟",
        answers: [
          { text: "5x", isCorrect: true },
          { text: "6x", isCorrect: false },
          { text: "x^2", isCorrect: false },
        ],
      },
      {
        type: "tf",
        title: "الميل في y = 4x - 7 يساوي 4.",
        correct: true,
      },
      {
        type: "written",
        title: "اشرح باختصار مفهوم المشتقة الأولى.",
        sampleAnswer: "معدل التغير اللحظي للدالة بالنسبة للمتغير المستقل.",
      },
      {
        type: "fill",
        title: "أكمل: مساحة المستطيل = ____ × ____",
        gaps: ["الطول", "العرض"],
      },
    ]),
  },
  {
    id: 2,
    title: "اختبار اللغة الإنجليزية",
    description: "قواعد النحو والمفردات",
    questions: 2,
    status: "مسودة",
    duration: 60,
    participants: 0,
    rating: 0,
    lastModified: "منذ ساعة",
    difficulty: "سهل",
    subject: "لغة إنجليزية",
    examType: "mock", // محاكي
    questionsData: normalizeQuestions([
      {
        type: "mcq",
        title: "Choose the correct past form of 'go':",
        answers: [
          { text: "went", isCorrect: true },
          { text: "goed", isCorrect: false },
        ],
      },
      {
        type: "tf",
        title: "The word 'childs' is the correct plural of 'child'.",
        correct: false,
      },
    ]),
  },
  {
    id: 3,
    title: "اختبار العلوم الطبيعية",
    description: "الفيزياء والكيمياء العضوية",
    questions: 3,
    status: "منشور",
    duration: 120,
    participants: 189,
    rating: 4.5,
    lastModified: "منذ 3 أيام",
    difficulty: "صعب",
    subject: "علوم",
    examType: "mock",
    questionsData: normalizeQuestions([
      {
        type: "tf",
        title: "الشحنة الأساسية للإلكترون موجبة.",
        correct: false,
      },
      {
        type: "written",
        title: "اذكر قانون حفظ الطاقة بصياغتك.",
        sampleAnswer: "",
      },
      {
        type: "mcq",
        title: "أي مما يلي عنصر؟",
        answers: [
          { text: "ماء", isCorrect: false },
          { text: "أكسجين", isCorrect: true },
          { text: "ملح الطعام", isCorrect: false },
        ],
      },
    ]),
  },
  {
    id: 4,
    title: "اختبار التاريخ الحديث",
    description: "القرن العشرين والأحداث المعاصرة",
    questions: 2,
    status: "نشط",
    duration: 75,
    participants: 156,
    rating: 4.2,
    lastModified: "منذ أسبوع",
    difficulty: "متوسط",
    subject: "تاريخ",
    examType: "training",
    questionsData: normalizeQuestions([
      {
        type: "mcq",
        title: "في أي سنة بدأت الحرب العالمية الثانية؟",
        answers: [
          { text: "1939", isCorrect: true },
          { text: "1914", isCorrect: false },
        ],
      },
      {
        type: "fill",
        title: "أكمل: تأسست هيئة الأمم المتحدة عام ____",
        answerText: "1945",
      },
    ]),
  },
]

export default function ExamsPage() {
  // مودالات
  const [newModal, setAddNewModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const params = useParams();
  // عرض/بحث/فلترة
  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all"); // حالة الاختبار (نشط/مسودة/منشور)
  const [examTypeFilter, setExamTypeFilter] = useState("all"); // نوع الاختبار (training/mock)
  const exam_id = params["exam-id"];
  const [filteredExam , setFilteredExam] = useState({});

  useEffect(() => {
    setFilteredExam(subjects?.find(item => item?.code == exam_id))
  } , [exam_id])

  const breadcrumbs = [
    { label: "الرئيسية", href: "/", icon: BarChart3 },
    {label :filteredExam?.name, href : "/teacher-courses" , icon :""},
    { label: "الاختبارات", href: "/exams", icon: FileText, current: true },
  ];

  
  // منيو النقاط
  const [openMenuFor, setOpenMenuFor] = useState(null);
  const menuRef = useRef(null);

  // مودال المعاينة
  const [previewOpen, setPreviewOpen] = useState(false);

  // بيانات افتراضية — الآن تحتوي على examType وأنواع أسئلة متعددة
  const [exams, setExams] = useState(exams_data);

  // فلترة رئيسية (بحث + حالة + نوع اختبار)
  const filteredExams = exams.filter((exam) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      exam.title.toLowerCase().includes(q) ||
      exam.description.toLowerCase().includes(q) ||
      (exam.subject || "").toLowerCase().includes(q);
    const matchesStatus =
      selectedFilter === "all" || exam.status === selectedFilter;
    const matchesType =
      examTypeFilter === "all" || exam.examType === examTypeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  /* -------------------- Handlers (View / Edit / Delete) -------------------- */
  const handleView = (exam) => {
    setOpenMenuFor(null);
    setSelectedExam(exam);
    setPreviewOpen(true);
  };

  const handleEdit = (exam) => {
    setOpenMenuFor(null);
    const editable = exam._raw
      ? { ...exam._raw, id: exam.id, examType: exam.examType }
      : {
          id: exam.id,
          title: exam.title,
          description: exam.description,
          time: exam.duration,
          questions: exam.questionsData || [],
          examType: exam.examType || "training",
        };
    setSelectedExam(editable);
    setEditModal(true);
  };

  const handleDelete = (exam) => {
    setSelectedExam(exam);
    setDeleteModal(true);
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
          subtitle={"مراجعة وإدارة الاختبارات التعليمية (تدريب / محاكي + أنواع أسئلة متعددة)"}
         
        />

        {/* إحصائيات */}
        <ExamsStats stats={stats} />

        {/* شريط البحث/وضع العرض */}
        <SearchAndFilters
          mode={viewMode}
          searchTerm={searchTerm}
          setMode={setViewMode}
          setSearchTerm={setSearchTerm}
        />

        {/* فلتر نوع الاختبار (تدريب/محاكي) */}
        <div className="my-4">
          <Space>
            <Text className="text-gray-700">نوع الاختبار:</Text>
            <Select
              value={examTypeFilter}
              onChange={setExamTypeFilter}
              style={{ minWidth: 180 }}
              options={[
                { value: "all", label: "كل الأنواع" },
                { value: "training", label: "تدريب" },
                { value: "mock", label: "اختبار محاكي" },
              ]}
            />
          </Space>
        </div>

        {/* الكروت / الجدول */}
        {viewMode === "grid" ? (
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
      {/* <AddNewExamModal
        open={newModal}
        setOpen={setAddNewModal}
        onSubmit={onAddSubmit}
        palette={{ primary: "#02AAA0" }}
        // تمرير خيارات النوع وأنواع الأسئلة (اختياري)
        examTypeOptions={[
          { value: "training", label: "تدريب" },
          { value: "mock", label: "اختبار محاكي" },
        ]}
        questionTypeOptions={[
          { value: "mcq", label: "اختيار من متعدد" },
          { value: "tf", label: "صح / خطأ" },
          { value: "written", label: "سؤال مقالي" },
          { value: "fill", label: "أكمل الفراغ" },
        ]}
      /> */}

      {/* مودال تعديل امتحان */}
      
      {/* مودال المعاينة */}
      {/* <ExamPreviewModal
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        exam={selectedExam}
      /> */}
    </PageLayout>
  );
}
