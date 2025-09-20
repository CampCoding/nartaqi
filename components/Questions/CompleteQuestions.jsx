"use client";
import React from "react";
import Button from "../atoms/Button";
import Input from "./ExamInput";
import TextArea from "./ExamTextarea";
import { Plus, Trash2 } from "lucide-react";

/**
 * CompleteQuestions now supports an explanation for each expected answer.
 * Backward-compatible with legacy arrays of strings: they are normalized to
 * objects of shape { answer: string, explanation: string }.
 */
export default function CompleteQuestions({
  completeText,
  setCompleteText,
  completeAnswers,
  updateCompleteAnswer,
  removeCompleteAnswer,
  addCompleteAnswer,
}) {
  const normalizeItem = (item) => {
    if (typeof item === "string") return { answer: item, explanation: "" };
    if (item && typeof item === "object")
      return { answer: item.answer || "", explanation: item.explanation || "" };
    return { answer: "", explanation: "" };
  };

  const onChangeAnswer = (index, nextVal) => {
    const curr = normalizeItem(completeAnswers?.[index]);
    // Pass a merged object to parent; parent should store objects
    updateCompleteAnswer(index, { ...curr, answer: nextVal });
  };

  const onChangeExplanation = (index, nextVal) => {
    const curr = normalizeItem(completeAnswers?.[index]);
    updateCompleteAnswer(index, { ...curr, explanation: nextVal });
  };

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
        <div className="space-y-3">
          {completeAnswers?.map((raw, index) => {
            const item = normalizeItem(raw);
            return (
              <div key={index} className="border rounded-lg p-3 bg-white space-y-2">
                <div className="flex items-center gap-2">
                  <Input
                    placeholder={`الإجابة ${index + 1}`}
                    value={item.answer}
                    onChange={(e) => onChangeAnswer(index, e.target.value)}
                    className="flex-1"
                  />
                  {completeAnswers?.length > 1 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeCompleteAnswer(index)}
                      icon={<Trash2 />}
                      aria-label="حذف الإجابة"
                    />
                  )}
                </div>

                <TextArea
                  placeholder="اكتب شرحًا لهذه الإجابة (لماذا هي صحيحة / كيف تُقيَّم)"
                  rows={2}
                  value={item.explanation}
                  onChange={(e) => onChangeExplanation(index, e.target.value)}
                />
              </div>
            );
          })}

          <Button variant="outline" onClick={addCompleteAnswer} icon={<Plus className="w-5 h-5" />}>إضافة إجابة</Button>
        </div>
      </div>
    </div>
  );
}
