import React, { useState } from "react";
import {
  Eye,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Calendar,
} from "lucide-react";

const TYPE_LABELS = {
  MCQ: "اختيار من متعدد",
  "True/False": "صح / خطأ",
  Essay: "مقالي",
};

const DIFFICULTY_LABELS = {
  Easy: "سهل",
  Medium: "متوسط",
  Hard: "صعب",
};

const EssayPrev = () => {
  const essayQuestion = {
    type: "Essay", // لا تترجمه للحفاظ على شروط الألوان
    difficulty: "Hard", // لا تترجمه للحفاظ على شروط الألوان
    question: "اشرح أسباب اندلاع الحرب العالمية الثانية.",
    subject: "التاريخ",
    uses: 12,
    tags: ["الحرب العالمية", "تحليل"],
    modified: "2024-07-26",
    created: "2024-07-25",
    guidelines:
      "على الطالب مناقشة عوامل متعددة تشمل الأسباب السياسية والاقتصادية والاجتماعية. الطول المتوقع: 500–800 كلمة.",
    rubric: {
      "المعرفة بالمحتوى": "40%",
      "التحليل والتفكير النقدي": "30%",
      "التنظيم والبناء": "20%",
      "اللغة والأسلوب": "10%",
    },
  };

  // بطاقة السؤال
  const QuestionCard = ({ question, children, bgColor = "bg-white" }) => (
    <div
      className={`${bgColor} rounded-lg shadow-md border border-gray-200 p-6 mb-6`}
      dir="rtl"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              question.type === "MCQ"
                ? "bg-blue-100 text-blue-800"
                : question.type === "True/False"
                ? "bg-green-100 text-green-800"
                : "bg-purple-100 text-purple-800"
            }`}
          >
            {TYPE_LABELS[question.type] || question.type}
          </span>
          <span
            className={`px-2 py-1 rounded text-sm ${
              question.difficulty === "Easy"
                ? "bg-green-100 text-green-700"
                : question.difficulty === "Hard"
                ? "bg-red-100 text-red-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {DIFFICULTY_LABELS[question.difficulty] || question.difficulty}
          </span>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors">
            <Eye className="w-4 h-4" />
            <span className="text-sm">معاينة</span>
          </button>
          <button className="flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-md hover:bg-yellow-200 transition-colors">
            <FileText className="w-4 h-4" />
            <span className="text-sm">تكرار</span>
          </button>
        </div>
      </div>

      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        {question.question}
      </h3>

      <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
        <span className="flex items-center gap-1">
          <FileText className="w-4 h-4" />
          <span>{question.subject}</span>
        </span>
        <span className="flex items-center gap-1">
          <Eye className="w-4 h-4" />
          <span>{question.uses} استخدام</span>
        </span>
        <span className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          <span>آخر تعديل {question.modified}</span>
        </span>
        <span className="flex items-center gap-1">
          <User className="w-4 h-4" />
          <span>تم الإنشاء {question.created}</span>
        </span>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {question.tags.map((tag, index) => (
          <span
            key={index}
            className="px-2 py-1 bg-purple-100 text-purple-700 rounded-md text-sm"
          >
            {tag}
          </span>
        ))}
      </div>

      {children}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto bg-gray-50" dir="rtl">
      {/* سؤال مقالي */}
      <QuestionCard question={essayQuestion} bgColor="bg-purple-50">
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg border">
            <h4 className="font-medium text-gray-900 mb-2">الإجابة:</h4>
            <p className="text-gray-600 font-semibold text-base leading-7">
              نشوب الحرب العالمية الثانية كان نتيجة صعود الأنظمة الفاشية في
              ألمانيا وإيطاليا واليابان، مدفوعة بالنزعة العسكرية والتوسعية
              والقومية. <br />
              وقد أشعلتها غزو ألمانيا لبولندا عام 1939، بعد توترات لم تُحل منذ
              الحرب العالمية الأولى ومعاهدة فرساي.
            </p>
          </div>
        </div>
      </QuestionCard>
    </div>
  );
};

export default EssayPrev;
