import React from "react";
import Card from "../atoms/Card";

export default function QuestionTypes(
  {handleQuestionTypeChange,
  questionType,
  handleAddQuestions}
) {
  return (
    <Card title={"نوع السؤال"} className="p-6">
      <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
        <button
          onClick={() => handleQuestionTypeChange("mcq")}
          className={`p-4 rounded-lg border-2 transition-all duration-200 text-right ${
            questionType === "mcq"
              ? "border-[#0F7490] bg-[#0F7490]/5"
              : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <div>
            <h3 className="font-medium text-[#202938]">الاختيار من متعدد</h3>
            <p className="text-sm text-[#202938]/60">خيارات متعددة</p>
          </div>
        </button>
        <button
          onClick={() => handleQuestionTypeChange("trueFalse")}
          className={`p-4 rounded-lg border-2 transition-all duration-200 text-right ${
            questionType === "trueFalse"
              ? "border-[#0F7490] bg-[#0F7490]/5"
              : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <div>
            <h3 className="font-medium text-[#202938]">صح/خطأ</h3>
            <p className="text-sm text-[#202938]/60">إجابة واحدة</p>
          </div>
        </button>
        <button
          onClick={() => handleQuestionTypeChange("essay")}
          className={`p-4 rounded-lg border-2 transition-all duration-200 text-right ${
            questionType === "essay"
              ? "border-[#0F7490] bg-[#0F7490]/5"
              : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <div>
            <h3 className="font-medium text-[#202938]">مقالي</h3>
            <p className="text-sm text-[#202938]/60">نص حر</p>
          </div>
        </button>
        <button
          onClick={() => handleQuestionTypeChange("complete")}
          className={`p-4 rounded-lg border-2 transition-all duration-200 text-right ${
            questionType === "complete"
              ? "border-[#0F7490] bg-[#0F7490]/5"
              : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <div>
            <h3 className="font-medium text-[#202938]">أكمل</h3>
            <p className="text-sm text-[#202938]/60">فراغات متعددة</p>
          </div>
        </button>
      </div>
    </Card>
  );
}
