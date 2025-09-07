"use client";
import React, { useMemo, useState } from "react";
import {
  BookOpen,
  Clock3,
  Users,
  Star,
  Target,
  Award,
  Download,
  Edit3,
  CheckCircle2,
  XCircle,
  ListChecks,
  Search as SearchIcon,
  Lightbulb,
} from "lucide-react";

import PageLayout from "../../../../components/layout/PageLayout";
import ExamOverview from "../../../../components/Exams/ExamOverview";
import ExamMainDescription from "../../../../components/Exams/ExamMainDescription";
import EditNewExamModal from "../../../../components/Exams/EditNewExamModal";

/* ---------- Small UI helpers ---------- */
const Pill = ({ children, color = "bg-gray-100 text-gray-700 border-gray-200", className = "" }) => (
  <span
    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium ${color} ${className}`}
  >
    {children}
  </span>
);

const Stat = ({ icon: Icon, label, value }) => (
  <div className="rounded-2xl border bg-white/80 p-5 shadow-sm">
    <div className="flex items-center justify-between">
      <div className="rounded-xl bg-gray-50 p-2.5">
        <Icon className="w-5 h-5 text-gray-600" />
      </div>
    </div>
    <div className="mt-3">
      <div className="text-xs font-medium text-gray-500">{label}</div>
      <div className="text-2xl font-bold text-gray-900 mt-1">{value}</div>
    </div>
  </div>
);

const ActionButton = ({ icon: Icon, children, variant = "secondary", className = "", onClick }) => {
  const base = "inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all";
  const variants = {
    primary:
      "text-white bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 shadow-lg",
    secondary: "border border-gray-200 bg-white hover:bg-gray-50 text-gray-700",
    ghost: "text-gray-600 hover:bg-gray-100",
  } ;
  return (
    <button className={`${base} ${variants[variant]} ${className}`} onClick={onClick}>
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </button>
  );
};

/* ---------- Normalization ---------- */
/** Normalize any incoming exam object into a single, predictable shape. */
function normalizeExam(input) {
  const fallback = {
    id: input?.id ?? Date.now(),
    title: input?.title ?? "امتحان بدون عنوان",
    description: input?.description ?? "",
    subject: input?.subject ?? "",
    status: input?.status ?? "مسودة",
    difficulty: input?.difficulty ?? "متوسط",
    participants: input?.participants ?? 0,
    rating: input?.rating ?? 0,
    lastModified: input?.lastModified ?? "",
    examType: input?.examType ?? "training", // training | mock
    duration: Number(input?.duration ?? input?.time ?? 0) || 0,
    questions: [],
    _raw: input?._raw ?? null,
  };

  // Prefer _raw.questions from editor if present
  const sourceQs =
    input?._raw?.questions ??
    input?.questions ??
    input?.questionsData ??
    [];

  const normalizedQs = (sourceQs || []).map((q, i) => {
    const type = q?.type ?? (q?.answers ? "mcq" : "written"); // legacy -> mcq
    const base = {
      id: q?.id ?? `q-${i + 1}`,
      type,
      title: q?.title ?? "",
      explanation: q?.explanation ?? "",
    } ;

    if (type === "mcq") {
      base.answers = (q?.answers || []).map((a, ai) => ({
        id: a?.id ?? `a-${i + 1}-${ai + 1}`,
        text: a?.text ?? "",
        isCorrect: !!a?.isCorrect,
        explanation: a?.explanation ?? "",
      }));
    } else if (type === "tf") {
      base.correct = typeof q?.correct === "boolean" ? q.correct : true;
    } else if (type === "written") {
      base.sampleAnswer = q?.sampleAnswer ?? "";
    } else if (type === "fill") {
      base.gaps = Array.isArray(q?.gaps) ? q.gaps : [];
      base.answerText = q?.answerText ?? "";
    }
    return base;
  });

  fallback.questions = normalizedQs;

  // Ensure _raw mirrors the new schema so Edit modal receives the same shape
  fallback._raw = fallback._raw ?? {
    id: fallback.id,
    title: fallback.title,
    description: fallback.description,
    time: String(fallback.duration),
    examType: fallback.examType,
    questions: normalizedQs,
  };

  return fallback;
}

/* ---------- Demo (in case no prop passed) ---------- */
const demoExamLegacy = {
  id: 3,
  title: "اختبار العلوم الطبيعية",
  description:
    "تقييم شامل في الفيزياء والكيمياء العضوية لقياس فهم المفاهيم الأساسية والتطبيقات العملية.",
  status: "منشور",
  duration: 120,
  difficulty: "صعب",
  subject: "علوم",
  participants: 189,
  rating: 4.5,
  lastModified: "منذ 3 أيام",
  examType: "mock",
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
      title: "سؤال صح/خطأ: الضوء موجة كهرومغناطيسية.",
      // legacy had no types; we’ll treat as MCQ unless explicit:
      // Show TF example explicitly by adding type
      type: "tf",
      correct: true,
    },
    {
      id: "q4",
      type: "written",
      title: "اشرح بإيجاز مفهوم طاقة وضع الجاذبية.",
      sampleAnswer:
        "هي الطاقة الناتجة عن موقع جسم في مجال جاذبي، وتتناسب مع الكتلة والارتفاع عن مرجع محدد.",
    },
    {
      id: "q5",
      type: "fill",
      title: "أكمل: عدد البروتونات في ذرة الكربون يساوي __.",
      gaps: ["6"],
    },
  ],
};

/* ---------- Per-question renderers ---------- */
function MCQView({
  answers,
  showCorrectOnly,
}) {
  const list = showCorrectOnly ? answers.filter((a) => a.isCorrect) : answers;
  return (
    <div className="space-y-2">
      {list.map((a) => (
        <div
          key={a.id}
          className={`flex items-start gap-2 rounded-lg border p-2.5 ${
            a.isCorrect
              ? "border-emerald-200 bg-emerald-50/50"
              : "border-gray-200 bg-white"
          }`}
        >
          {a.isCorrect ? (
            <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" />
          ) : (
            <XCircle className="mt-0.5 h-4 w-4 text-gray-400" />
          )}
          <div className="flex-1">
            <div className="text-sm text-gray-800">{a.text}</div>
            {a.explanation && (
              <div className="mt-1 text-xs text-gray-500">{a.explanation}</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function TFView({ correct }) {
  return (
    <div className="flex items-center gap-2">
      <Pill color="bg-emerald-100 text-emerald-800 border-emerald-200">
        الإجابة الصحيحة: {correct ? "صح" : "خطأ"}
      </Pill>
    </div>
  );
}

function WrittenView({ sampleAnswer }) {
  return (
    <div className="rounded-lg border p-3 bg-white">
      {sampleAnswer ? (
        <>
          <div className="text-xs text-gray-500 mb-1">إجابة نموذجية</div>
          <div className="text-sm text-gray-800 whitespace-pre-wrap">{sampleAnswer}</div>
        </>
      ) : (
        <div className="flex items-center gap-2 text-gray-600 text-sm">
          <Lightbulb className="w-4 h-4" />
          سؤال مقالي — يتم التصحيح يدوياً.
        </div>
      )}
    </div>
  );
}

function FillView({
  gaps,
  answerText,
}) {
  const hasGaps = gaps && gaps.length > 0;
  return (
    <div className="space-y-2">
      {hasGaps && (
        <div className="flex flex-wrap gap-2">
          {gaps.map((g, i) => (
            <Pill key={i} color="bg-indigo-100 text-indigo-800 border-indigo-200">
              {g}
            </Pill>
          ))}
        </div>
      )}
      {Boolean(answerText) && (
        <div className="rounded-lg border p-2.5 bg-white text-sm text-gray-800">
          {answerText}
        </div>
      )}
      {!hasGaps && !answerText && (
        <div className="text-sm text-gray-500">لا توجد إجابة نموذجيّة محددة.</div>
      )}
    </div>
  );
}

/* ---------- Questions Panel ---------- */
function QuestionsPanel({
  questions,
  query,
  setQuery,
  showCorrectOnly,
  setShowCorrectOnly,
}) {
  const filtered = useMemo(() => {
    const q = (query || "").toLowerCase().trim();
    if (!q) return questions;
    return questions.filter((x) => {
      const inTitle = (x.title || "").toLowerCase().includes(q);
      if (inTitle) return true;
      if (x.type === "mcq") {
        return (x.answers || []).some((a) => (a.text || "").toLowerCase().includes(q));
      }
      if (x.type === "fill") {
        return (
          (x.answerText || "").toLowerCase().includes(q) ||
          (x.gaps || []).some((g) => String(g).toLowerCase().includes(q))
        );
      }
      if (x.type === "written") {
        return (x.sampleAnswer || "").toLowerCase().includes(q);
      }
      return false;
    });
  }, [questions, query]);

  return (
    <div className="rounded-2xl border bg-white p-5">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-gray-800 font-semibold">
          <ListChecks className="w-5 h-5" />
          الأسئلة ({filtered.length})
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <SearchIcon className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-3 pr-9 py-2 rounded-xl border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="ابحث في نص السؤال أو الإجابات…"
            />
          </div>
          <label className="inline-flex items-center gap-2 text-sm text-gray-700 cursor-pointer select-none">
            <input
              type="checkbox"
              className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
              checked={showCorrectOnly}
              onChange={(e) => setShowCorrectOnly(e.target.checked)}
            />
            إظهار الإجابات الصحيحة فقط
          </label>
        </div>
      </div>

      <div className="space-y-5">
        {filtered.map((q, idx) => (
          <div key={q.id ?? idx} className="rounded-xl border p-4 bg-gray-50/40">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <Pill className="bg-teal-50 text-teal-700 border-teal-200">سؤال {idx + 1}</Pill>
              <Pill
                color={
                  q.type === "mcq"
                    ? "bg-indigo-100 text-indigo-800 border-indigo-200"
                    : q.type === "tf"
                    ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                    : q.type === "written"
                    ? "bg-amber-100 text-amber-800 border-amber-200"
                    : "bg-cyan-100 text-cyan-800 border-cyan-200"
                }
              >
                {q.type === "mcq"
                  ? "اختيار من متعدد"
                  : q.type === "tf"
                  ? "صح / خطأ"
                  : q.type === "written"
                  ? "سؤال مقالي"
                  : "أكمل الفراغ"}
              </Pill>
            </div>

            <div className="text-gray-900 font-medium">{q.title}</div>
            {q.explanation && (
              <div className="text-xs text-gray-500 mt-1">{q.explanation}</div>
            )}

            <div className="mt-3">
              {q.type === "mcq" && (
                <MCQView answers={q.answers || []} showCorrectOnly={showCorrectOnly} />
              )}
              {q.type === "tf" && <TFView correct={!!q.correct} />}
              {q.type === "written" && <WrittenView sampleAnswer={q.sampleAnswer} />}
              {q.type === "fill" && (
                <FillView gaps={q.gaps || []} answerText={q.answerText || ""} />
              )}
            </div>
          </div>
        ))}

        {!filtered.length && (
          <div className="text-center py-10 text-gray-500 text-sm">
            لا توجد أسئلة مطابقة لبحثك.
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- Page ---------- */
export default function ExamDetailsPage({ exam: examProp }) {
  const [query, setQuery] = useState("");
  const [showCorrectOnly, setShowCorrectOnly] = useState(false);

  const [editModal, setEditModal] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);

 // ⬇️ put these inside ExamDetailsPage (before return)

// Safe file name
const fileSafe = (s = "exam") =>
  String(s).replace(/[<>:"/\\|?*\x00-\x1F]/g, "").slice(0, 60);

// Sheet 2: one row per question (answers merged for quick reading)
const questionsToRows = (qs = []) =>
  qs.map((q, i) => {
    const base = { "#": i + 1, نوع: "", "نص السؤال": q.title || "", "شرح السؤال": q.explanation || "" };

    if (q.type === "mcq") {
      const answers = (q.answers || []).map((a) => a.text).join(" | ");
      const correct = (q.answers || []).filter((a) => a.isCorrect).map((a) => a.text).join(" | ");
      const exps = (q.answers || []).map((a) => a.explanation).filter(Boolean).join(" | ");
      return { ...base, نوع: "MCQ", الإجابات: answers, "الإجابات الصحيحة": correct, "شروح الإجابات": exps };
    }
    if (q.type === "tf") {
      return { ...base, نوع: "صح/خطأ", "الإجابة الصحيحة": q.correct ? "صح" : "خطأ" };
    }
    if (q.type === "written") {
      return { ...base, نوع: "مقالي", "إجابة نموذجية": q.sampleAnswer || "" };
    }
    // fill
    return {
      ...base,
      نوع: "أكمل",
      الفراغات: (q.gaps || []).join(" | "),
      "إجابة نصية": q.answerText || "",
    };
  });

// ⭐ NEW: Sheet 3 — one row per *answer*
const answersToRows = (qs = []) => {
  const out = [];
  qs.forEach((q, i) => {
    const qBase = {
      "س#": i + 1,
      "نوع السؤال": q.type === "mcq" ? "MCQ" : q.type === "tf" ? "صح/خطأ" : q.type === "written" ? "مقالي" : "أكمل",
      "نص السؤال": q.title || "",
      "شرح السؤال": q.explanation || "",
    };

    if (q.type === "mcq") {
      (q.answers || []).forEach((a, ai) => {
        out.push({
          ...qBase,
          "إجابة #": ai + 1,
          "نص الإجابة": a.text || "",
          "صحيحة؟": a.isCorrect ? "نعم" : "لا",
          "شرح الإجابة": a.explanation || "",
        });
      });
      if (!(q.answers || []).length) {
        out.push({ ...qBase, "إجابة #": "-", "نص الإجابة": "", "صحيحة؟": "", "شرح الإجابة": "" });
      }
      return;
    }

    if (q.type === "tf") {
      out.push({
        ...qBase,
        "إجابة #": 1,
        "نص الإجابة": q.correct ? "صح" : "خطأ",
        "صحيحة؟": "نعم",
        "شرح الإجابة": "",
      });
      return;
    }

    if (q.type === "written") {
      out.push({
        ...qBase,
        "إجابة #": 1,
        "نص الإجابة": q.sampleAnswer || "",
        "صحيحة؟": "",
        "شرح الإجابة": "",
      });
      return;
    }

    // fill
    const gaps = q.gaps || [];
    if (gaps.length) {
      gaps.forEach((g, gi) => {
        out.push({
          ...qBase,
          "إجابة #": gi + 1,
          "نص الإجابة": String(g || ""),
          "صحيحة؟": "",
          "شرح الإجابة": "فراغ",
        });
      });
    }
    if ((q.answerText || "").trim()) {
      out.push({
        ...qBase,
        "إجابة #": gaps.length ? gaps.length + 1 : 1,
        "نص الإجابة": q.answerText,
        "صحيحة؟": "",
        "شرح الإجابة": "نص كامل",
      });
    }
    if (!gaps.length && !q.answerText) {
      out.push({ ...qBase, "إجابة #": "-", "نص الإجابة": "", "صحيحة؟": "", "شرح الإجابة": "" });
    }
  });
  return out;
};

async function handleExportExcel() {
  try {
    const XLSX = await import("xlsx");

    // Sheet 1: Summary
    const summary = [
      ["العنوان", exam.title || "-"],
      ["النوع", exam.examType === "mock" ? "اختبار محاكي" : "تدريب"],
      ["المادة", exam.subject || "-"],
      ["المدة (دقيقة)", exam.duration || 0],
      ["عدد الأسئلة", exam.questions.length || 0],
      ["المشاركون", exam.participants || 0],
      ["التقييم", exam.rating || 0],
      ["آخر تعديل", exam.lastModified || "-"],
    ];
    const wsSummary = XLSX.utils.aoa_to_sheet(summary);

    // Sheet 2: Questions (compact)
    const qRows = questionsToRows(exam.questions);
    const wsQuestions = XLSX.utils.json_to_sheet(qRows);
    wsQuestions["!cols"] = Object.keys(qRows[0] || { "نص السؤال": "" }).map((k) => ({
      wch: Math.min(60, Math.max(k.length + 6, 16)),
    }));

    // ⭐ Sheet 3: Question + Answers (one row per answer)
    const qaRows = answersToRows(exam.questions);
    const wsQA = XLSX.utils.json_to_sheet(qaRows);
    wsQA["!cols"] = Object.keys(qaRows[0] || { "نص السؤال": "", "نص الإجابة": "" }).map((k) => ({
      wch: Math.min(60, Math.max(k.length + 8, 18)),
    }));

    // Workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, wsSummary, "ملخص");
    XLSX.utils.book_append_sheet(wb, wsQuestions, "الأسئلة");
    XLSX.utils.book_append_sheet(wb, wsQA, "الأسئلة+الإجابات");

    const name = `${fileSafe(exam.title)}-${new Date().toISOString().slice(0, 10)}.xlsx`;
    XLSX.writeFile(wb, name);
  } catch (e) {
    console.error(e);
    alert("تعذر التصدير إلى Excel");
  }
}


  // Normalize incoming prop or fallback demo
  const exam = useMemo(() => normalizeExam(examProp ?? demoExamLegacy), [examProp]);

  const stats = useMemo(
    () => [
      { icon: BookOpen, label: "عدد الأسئلة", value: exam.questions.length },
      { icon: Clock3, label: "المدة (دقيقة)", value: exam.duration },
      { icon: Users, label: "المشاركون", value: exam.participants },
      { icon: Star, label: "التقييم", value: exam.rating },
    ],
    [exam]
  );

  const avgPerQuestion = exam.questions.length
    ? Math.round(exam.duration / Math.max(1, exam.questions.length))
    : 0;

  return (
    <PageLayout>
      <div dir="rtl">
        {/* Header */}
        <div className="border-b sticky top-0 z-10 bg-white/70 backdrop-blur">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-4">
                <div className="rounded-3xl bg-gradient-to-br from-teal-100 to-teal-200 p-4 border border-teal-200 shadow-sm">
                  <BookOpen className="w-8 h-8 text-teal-700" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-gray-900">{exam.title}</h1>
                    <Pill
                      color={
                        exam.examType === "mock"
                          ? "bg-purple-100 text-purple-800 border-purple-200"
                          : "bg-sky-100 text-sky-800 border-sky-200"
                      }
                    >
                      {exam.examType === "mock" ? "اختبار محاكي" : "تـدريب"}
                    </Pill>
                    {exam.subject && (
                      <Pill className="bg-gray-100 text-gray-700 border-gray-200">
                        <Target className="w-3.5 h-3.5" />
                        المادة: {exam.subject}
                      </Pill>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                    <span className="inline-flex items-center gap-1.5">
                      <Award className="w-4 h-4" /> معدل الوقت: {avgPerQuestion} دقيقة/سؤال
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
               
                <ActionButton
                  icon={Edit3}
                  variant="primary"
                  onClick={() => {
                    setSelectedExam(exam._raw ?? exam);
                    setEditModal(true);
                  }}
                >
                  تعديل
                </ActionButton>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left */}
            <div className="lg:col-span-8 space-y-8">
              <ExamMainDescription exam={exam} />

              <QuestionsPanel
                questions={exam.questions}
                query={query}
                setQuery={setQuery}
                showCorrectOnly={showCorrectOnly}
                setShowCorrectOnly={setShowCorrectOnly}
              />
            </div>

            {/* Right */}
            <div className="lg:col-span-4 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                {stats.map((s) => (
                  <Stat key={s.label} icon={s.icon} label={s.label} value={s.value} />
                ))}
              </div>

              {/* Any performance/insights widget you already have */}
              <ExamOverview />
            </div>
          </div>
        </div>
      </div>

      {/* Edit modal gets the normalized _raw payload (same schema as Add modal) */}
      <EditNewExamModal open={editModal} setOpen={setEditModal} exam={selectedExam} />
    </PageLayout>
  );
}
