"use client";
import React, { useMemo, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  CalendarClock,
  CheckCircle2,
  Clock3,
  Download,
  Edit3,
  Eye,
  FileText,
  ListChecks,
  Settings,
  Share2,
  Star,
  Target,
  Trash2,
  Users,
  Search,
  Filter,
  TrendingUp,
  Award,
  Play,
  BarChart3,
} from "lucide-react";
import PageLayout from "../../../../components/layout/PageLayout";
import ExamQuestions from "../../../../components/Exams/ExamQuestions";
import SectionCard from "../../../../components/Exams/ExamSectionCard";
import ExamOverview from "../../../../components/Exams/ExamOverview";
import ExamMainDescription from "../../../../components/Exams/ExamMainDescription";
import EditNewExamModal from "../../../../components/Exams/EditNewExamModal";

/** Tailwind helpers */
const badgeColors = {
  نشط: "bg-emerald-100 text-emerald-800 border-emerald-200",
  مسودة: "bg-amber-100 text-amber-800 border-amber-200",
  منشور: "bg-blue-100 text-blue-800 border-blue-200",
};

const difficultyColors = {
  سهل: "bg-emerald-50 text-emerald-700 border-emerald-200",
  متوسط: "bg-amber-50 text-amber-700 border-amber-200",
  صعب: "bg-rose-50 text-rose-700 border-rose-200",
};

/** Enhanced UI Components */
const Stat = ({ icon: Icon, label, value, trend, className = "" }) => (
  <div className={`group relative rounded-2xl border bg-gradient-to-br from-white to-gray-50/50 p-5 shadow-sm hover:shadow-md transition-all duration-300 ${className}`}>
    <div className="flex items-center justify-between">
      <div className="rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 p-2.5 group-hover:from-teal-50 group-hover:to-teal-100 transition-all duration-300">
        <Icon className="w-5 h-5 text-gray-600 group-hover:text-teal-600 transition-colors" />
      </div>
      {trend && (
        <div className="flex items-center gap-1 text-xs font-medium text-emerald-600">
          <TrendingUp className="w-3 h-3" />
          +{trend}%
        </div>
      )}
    </div>
    <div className="mt-3">
      <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</div>
      <div className="text-2xl font-bold text-gray-900 mt-1">{value}</div>
    </div>
  </div>
);

const Pill = ({ children, color = "bg-gray-100 text-gray-700 border-gray-200" }) => (
  <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all hover:shadow-sm ${color}`}>
    {children}
  </span>
);



const ActionButton = ({ icon: Icon, children, variant = "secondary", className = "", ...props }) => {
  const baseClasses = "inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 hover:scale-105 active:scale-95";
  
  const variants = {
    primary: "text-white bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 shadow-lg shadow-teal-600/25",
    secondary: "border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 hover:border-gray-300",
    ghost: "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
  };

  return (
    <button className={`${baseClasses} ${variants[variant]} ${className}`} {...props}>
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </button>
  );
};

/** Demo fallback data */
const demoExam = {
  id: 3,
  title: "اختبار العلوم الطبيعية",
  description: "تقييم شامل في الفيزياء والكيمياء العضوية يهدف إلى قياس مستوى فهم الطلاب للمفاهيم الأساسية والتطبيقات العملية في هذين المجالين المهمين من العلوم الطبيعية.",
  status: "منشور",
  duration: 120,
  difficulty: "صعب",
  subject: "علوم",
  participants: 189,
  rating: 4.5,
  lastModified: "منذ 3 أيام",
  questionsData: [
    {
      id: "q1",
      title: "الشحنة الأساسية للإلكترون:",
      answers: [
        { id: "a1", text: "سالبة", isCorrect: true },
        { id: "a2", text: "موجبة", isCorrect: false },
        { id: "a3", text: "متعادلة", isCorrect: false },
      ],
    },
    {
      id: "q2",
      title: "العلاقة الصحيحة لقانون كولوم:",
      answers: [
        { id: "a1", text: "F ∝ q1q2 / r²", isCorrect: true },
        { id: "a2", text: "F ∝ r² / q1q2", isCorrect: false },
        { id: "a3", text: "F ∝ q1 + q2", isCorrect: false },
      ],
    },
    {
      id: "q3",
      title: "أي مما يلي هيدروكربون عطري؟",
      answers: [
        { id: "a1", text: "البنزين", isCorrect: true },
        { id: "a2", text: "الإيثان", isCorrect: false },
        { id: "a3", text: "البروپان", isCorrect: false },
      ],
    },
    {
      id: "q4",
      title: "ما هو الرقم الذري للكربون؟",
      answers: [
        { id: "a1", text: "6", isCorrect: true },
        { id: "a2", text: "12", isCorrect: false },
        { id: "a3", text: "14", isCorrect: false },
      ],
    },
    {
      id: "q5",
      title: "أي من القوانين التالية يصف حركة الكواكب؟",
      answers: [
        { id: "a1", text: "قوانين كبلر", isCorrect: true },
        { id: "a2", text: "قوانين نيوتن فقط", isCorrect: false },
        { id: "a3", text: "قانون الجاذبية العامة فقط", isCorrect: false },
      ],
    },
  ],
};

export default function ExamDetailsPage({ exam: examProp }) {
  const [query, setQuery] = useState("");
  const [showCorrectOnly, setShowCorrectOnly] = useState(false);
  const [editModal , setEditModal] = useState(false);
  const [selectedExam , setSelectedExam] = useState({});
  // Use prop or demo
  const exam = examProp ?? demoExam;

  const stats = useMemo(
    () => [
      { icon: FileText, label: "عدد الأسئلة", value: exam?.questionsData?.length ?? 0, trend: 12 },
      { icon: Clock3, label: "المدة (دقيقة)", value: exam?.duration ?? 0 },
      { icon: Users, label: "المشاركون", value: exam?.participants ?? 0, trend: 8 },
      { icon: Star, label: "التقييم", value: exam?.rating ?? 0 },
    ],
    [exam]
  );

  const filteredQuestions = useMemo(() => {
    const base = exam?.questionsData || [];
    const q = query.trim().toLowerCase();
    const byText = q
      ? base.filter(
          (x) =>
            x.title.toLowerCase().includes(q) ||
            x.answers.some((a) => a.text.toLowerCase().includes(q))
        )
      : base;

    if (!showCorrectOnly) return byText;
    return byText.map((x) => ({
      ...x,
      answers: x.answers.filter((a) => a.isCorrect),
    }));
  }, [exam, query, showCorrectOnly]);

  const correctAnswersCount = exam?.questionsData?.length ?? 0;
  const averageTime = Math.round((exam?.duration ?? 0) / (exam?.questionsData?.length ?? 1));

  return (
    <PageLayout >
      <div dir="rtl">
        {/* Enhanced Header */}
        <div className="border-b  sticky top-0 z-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-4">
                <div className="rounded-3xl bg-gradient-to-br from-teal-100 to-teal-200 p-4 border border-teal-200 shadow-sm">
                  <BookOpen className="w-8 h-8 text-teal-700" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text">
                      {exam.title}
                    </h1>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                    <span className="inline-flex items-center gap-1.5">
                      <Target className="w-4 h-4" /> المادة: {exam.subject || "غير محدد"}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Award className="w-4 h-4" /> معدل الوقت: {averageTime} دقيقة/سؤال
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">

                <ActionButton icon={Download} variant="secondary">
                  تصدير
                </ActionButton>
                <ActionButton
                onClick = {() => {
                  setEditModal(true);
                  setSelectedExam(exam)
                }}
                icon={Edit3} variant="primary">
                  تعديل
                </ActionButton>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-8 space-y-8">
              {/* Description Card */}
            <ExamMainDescription exam={exam} />

              {/* Questions Card */}
               <ExamQuestions ListChecks={ListChecks} filteredQuestions={filteredQuestions} query={query} setQuery={setQuery} setShowCorrectOnly={setShowCorrectOnly} showCorrectOnly={showCorrectOnly}/>
            </div>

            {/* Enhanced Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                {stats.map((s) => (
                  <Stat 
                    key={s.label} 
                    icon={s.icon} 
                    label={s.label} 
                    value={s.value} 
                    trend={s.trend}
                  />
                ))}
              </div>

              {/* Performance Insights */}
             <ExamOverview />
            </div>
          </div>
        </div>
      </div>

      <EditNewExamModal open={editModal} setOpen={setEditModal} exam={selectedExam}/>
    </PageLayout>
  );
}