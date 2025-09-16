import React from "react";
import Input from "./ExamInput";
import Button from "../atoms/Button";

export default function TrueFalseQuestions({
  trueFalseExplanation,
  trueFalseAnswer,
  setTrueFalseAnswer,
  setTrueFalseExplanation,
}) {
  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        الإجابة الصحيحة
      </label>
      <div className="grid grid-cols-2 gap-3">
        <Button 
        className={`${trueFalseAnswer ? "!bg-green-600 text-white" : ""}`}
          variant={trueFalseAnswer === true ? "success" : "outline"}
          onClick={() => setTrueFalseAnswer(true)}
        >
          صحيح
        </Button>
        <Button
         className={`${trueFalseAnswer ? "" : "!bg-red-500 text-white"}`}
          variant={trueFalseAnswer === false ? "danger" : "outline"}
          onClick={() => setTrueFalseAnswer(false)}
        >
          خطأ
        </Button>
      </div>
      <Input
        label="شرح الإجابة (اختياري)"
        placeholder="أدخل شرح الإجابة"
        value={trueFalseExplanation}
        onChange={(e) => setTrueFalseExplanation(e.target.value)}
      />
    </div>
  );
}
