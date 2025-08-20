import React, { useState } from "react";
import {
  Eye,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  User,
} from "lucide-react";

const typeLabels = {
  "MCQ": "اختيار من متعدد",
  "True/False": "صواب/خطأ",
  "Essay": "مقالي",
};

const difficultyLabels = {
  "Easy": "سهل",
  "Medium": "متوسط",
  "Hard": "صعب",
};

const MCQPrev = () => {
  const [selectedMcq, setSelectedMcq] = useState(null);
  const [showExplanations, setShowExplanations] = useState(true);

  const mcqQuestion = {
    type: "MCQ",
    difficulty: "Easy",
    question: "ما حاصل ٢ + ٢؟",
    subject: "الرياضيات",
    uses: 15,
    tags: ["أساسي", "جمع"],
    modified: "2024-08-01",
    created: "2024-08-01",
    options: [
      {
        id: "أ",
        text: "٣",
        explanation: "إجابة غير صحيحة. ٢ + ٢ يساوي ٤، وليس ٣.",
      },
      {
        id: "ب",
        text: "٤",
        explanation: "صحيح! ٢ + ٢ = ٤. هذا مثال على الجمع الأساسي.",
        isCorrect: true,
      },
      {
        id: "ج",
        text: "٥",
        explanation: "إجابة غير صحيحة. ٥ هي نتيجة ٢ + ٣.",
      },
      {
        id: "د",
        text: "٦",
        explanation: "إجابة غير صحيحة. ٦ هي نتيجة ٢ + ٤ أو ٣ + ٣.",
      },
    ],
  };

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
            {typeLabels[question.type] ?? question.type}
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
            {difficultyLabels[question.difficulty] ?? question.difficulty}
          </span>
        </div>
      </div>

      <h3 className="text-xl font-semibold text-gray-900 mb-4 text-right">
        {question.question}
      </h3>

      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
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
          <span>تم التعديل {question.modified}</span>
        </span>
        <span className="flex items-center gap-1">
          <User className="w-4 h-4" />
          <span>أُنشئت {question.created}</span>
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
    <div className="bg-gray-50" dir="rtl">
      {/* سؤال اختيار من متعدد */}
      <QuestionCard question={mcqQuestion} bgColor="bg-blue-50">
        <div className="space-y-3">
          {mcqQuestion.options.map((option) => (
            <div key={option.id} className="space-y-2">
              <div
                className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedMcq === option.id
                    ? option.isCorrect
                      ? "border-green-500 bg-green-50"
                      : "border-red-500 bg-red-50"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
                onClick={() => setSelectedMcq(option.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium">
                      {option.id}
                    </span>
                    <span className="text-gray-900">{option.text}</span>
                  </div>
                  {selectedMcq === option.id &&
                    (option.isCorrect ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500" />
                    ))}
                </div>
              </div>

              {showExplanations && selectedMcq === option.id && (
                <div
                  className={`p-3 rounded-lg text-sm ${
                    option.isCorrect
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  <strong>التفسير:</strong> {option.explanation}
                </div>
              )}
            </div>
          ))}
        </div>
      </QuestionCard>
    </div>
  );
};

export default MCQPrev;
