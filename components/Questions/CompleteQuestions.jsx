"use client";
import React from "react";
import Button from "../atoms/Button";
import Input from "./ExamInput";
import TextArea from "./ExamTextarea";
import { Plus, PlusIcon, Trash2 } from "lucide-react";

export default function CompleteQuestions({
  completeText,
  setCompleteText,
  completeAnswers,
  updateCompleteAnswer,
  removeCompleteAnswer,
  addCompleteAnswer,
}) {
  console.log(completeText , completeAnswers )
  return (
    <div className="space-y-4">
      <TextArea
        label="النص الناقص"
        placeholder="أدخل النص مع وضع (...) في الأماكن الناقصة"
        rows={4}
        value={completeText}
        onChange={(e) => setCompleteText(e.target.value)}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          الإجابات الصحيحة
        </label>
        <div className="space-y-2">
          {completeAnswers?.map((answer, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                placeholder={`الإجابة ${index + 1}`}
                value={answer?.answer || ""}
                onChange={(e) => updateCompleteAnswer(index, e.target.value)}
                className="flex-1"
              />
              {completeAnswers?.length > 1 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeCompleteAnswer(index)}
                  icon={<Trash2 />}
                />
              )}
            </div>
          ))}
          <Button variant="outline" onClick={addCompleteAnswer} icon={<Plus className="w-5 h-5"/>}>
            إضافة إجابة
          </Button>
        </div>
      </div>
    </div>
  );
}
