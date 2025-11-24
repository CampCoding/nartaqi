import { BookOpen, CheckCircle, Clock, Edit3, FileText } from "lucide-react";

export function makeBlankQuestion() {
  return {
    id:
      (typeof crypto !== "undefined" && crypto.randomUUID?.()) ||
      Math.random().toString(36).slice(2),
    text: "",
    allowMultipleCorrect: false,
    options: [
      { text: "", explanation: "", isCorrect: false },
      { text: "", explanation: "", isCorrect: false },
      { text: "", explanation: "", isCorrect: false },
      { text: "", explanation: "", isCorrect: false },
    ],
  };
}
export function makeBlankMathPassage() {
  return {
    id:
      (typeof crypto !== "undefined" && crypto.randomUUID?.()) ||
      Math.random().toString(36).slice(2),
    latex: "",
    allowMultipleCorrect: false,
    answers: [
      { text: "", explanation: "", isCorrect: false },
      { text: "", explanation: "", isCorrect: false },
    ],
  };
}
export function makeBlankTextPassage() {
  return {
    id:
      (typeof crypto !== "undefined" && crypto.randomUUID?.()) ||
      Math.random().toString(36).slice(2),
    text: "",
    questions: [makeBlankQuestion()],
  };
}

export function normalizeInitial(v) {
  // Final shape:
  // {
  //   questions: [...],                  // general questions
  //   mathPassages: [{ latex, answers, allowMultipleCorrect }, ...],
  //   textPassages: [{ text, questions: [...] }, ...]
  // }
  const base = {
    questions: [makeBlankQuestion()],
    mathPassages: [makeBlankMathPassage()],
    textPassages: [],
  };

  if (!v || typeof v !== "object") return base;

  // Backward-compat from older single fields
  const migratedMath =
    Array.isArray(v.mathPassages) && v.mathPassages.length
      ? v.mathPassages
      : v.passageMath || v.mathAnswers
      ? [
          {
            ...makeBlankMathPassage(),
            latex: v.passageMath || "",
            answers:
              Array.isArray(v.mathAnswers) && v.mathAnswers.length
                ? v.mathAnswers
                : makeBlankMathPassage().answers,
            allowMultipleCorrect: !!v.allowMultipleCorrectMath,
          },
        ]
      : base.mathPassages;

  const migratedText =
    Array.isArray(v.textPassages) && v.textPassages.length
      ? v.textPassages
      : v.hasPassage || v.passageText
      ? [
          {
            ...makeBlankTextPassage(),
            text: v.passageText || "",
            questions:
              Array.isArray(v.questions) && v.questions.length
                ? v.questions
                : [makeBlankQuestion()],
          },
        ]
      : base.textPassages;

  return {
    questions:
      Array.isArray(v.questions) && v.questions.length
        ? v.questions
        : base.questions,
    mathPassages: migratedMath,
    textPassages: migratedText,
  };
}


export const mock_exam_section_Data = {
  1: [
    {
      id: 1,
      name: "القراءة والفهم",
      desc: "أسئلة الفهم والاستيعاب",
      questions: new Array(30).fill(0).map((_, i) => ({ id: i, type: "mcq" })),
    },
    {
      id: 2,
      name: "القواعد النحوية",
      desc: "قواعد اللغة العربية",
      questions: new Array(25).fill(0).map((_, i) => ({ id: i, type: "mcq" })),
    },
  ],
  2: [
    {
      id: 3,
      name: "الرياضيات",
      desc: "الحساب والجبر",
      questions: new Array(24).fill(0).map((_, i) => ({ id: i, type: "mcq" })),
    },
    {
      id: 4,
      name: "العلوم",
      desc: "الفيزياء والكيمياء",
      questions: new Array(24).fill(0).map((_, i) => ({ id: i, type: "mcq" })),
    },
  ],
};

export const exam_types = [
  {
    id: 1,
    title: "تدريب",
    value: "intern",
    description: "اختبار تدريبي بدون قيود",
    icon: BookOpen,
    color: "blue",
  },
  {
    id: 2,
    title: "اختبار محاكي",
    value: "mock",
    description: "24 سؤال لكل قسم، 25 دقيقة",
    icon: Clock,
    color: "purple",
  },
];


export const questionTypes = [
  { id: "mcq", label: "اختيار من متعدد", icon: CheckCircle, color: "green" },
  { id: "trueFalse", label: "صح/خطأ", icon: CheckCircle, color: "blue" },
  // { id: "essay", label: "مقالي", icon: FileText, color: "orange" },
  { id: "complete", label: "أكمل", icon: Edit3, color: "purple" },
];

export const colorMap = {
  blue: {
    cardSelected: "border-blue-500 bg-blue-50",
    icon: "text-blue-600",
    badge: "bg-blue-100 text-blue-700",
    chip: "bg-blue-100",
  },
  purple: {
    cardSelected: "border-purple-500 bg-purple-50",
    icon: "text-purple-600",
    badge: "bg-purple-100 text-purple-700",
    chip: "bg-purple-100",
  },
  green: {
    cardSelected: "border-green-500 bg-green-50",
    icon: "text-green-600",
    badge: "bg-green-100 text-green-700",
    chip: "bg-green-100",
  },
  orange: {
    cardSelected: "border-orange-500 bg-orange-50",
    icon: "text-orange-600",
    badge: "bg-orange-100 text-orange-700",
    chip: "bg-orange-100",
  },
};