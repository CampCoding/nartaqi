"use client";
import React from "react";
import Button from "../atoms/Button";
import { Plus, Trash2 } from "lucide-react";
import dynamic from "next/dynamic";

// Dynamically import ReactQuill with SSR disabled
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

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
    updateCompleteAnswer(index, { ...curr, answer: nextVal });
  };

  const onChangeExplanation = (index, nextVal) => {
    const curr = normalizeItem(completeAnswers?.[index]);
    updateCompleteAnswer(index, { ...curr, explanation: nextVal });
  };

  return (
    <div className="space-y-4">
       <label className="block text-sm font-medium text-gray-700 mb-3">
         أدخل النص مع وضع (...) في الأماكن الناقصة
        </label>
      <ReactQuill
        value={completeText}
        onChange={(value) => setCompleteText(value)}
        placeholder="أدخل النص مع وضع (...) في الأماكن الناقصة"
        modules={{
          toolbar: [
            [{ header: [1, 2, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ direction: "rtl" }, { align: [] }],
            ["link", "clean"],
          ],
        }}
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
                  <ReactQuill
                    value={item.answer}
                    onChange={(value) => onChangeAnswer(index, value)}
                    placeholder={`الإجابة ${index + 1}`}
                    className="flex-1"
                    modules={{
                      toolbar: [
                        [{ header: [1, 2, false] }],
                        ["bold", "italic", "underline", "strike"],
                        [{ list: "ordered" }, { list: "bullet" }],
                        [{ direction: "rtl" }, { align: [] }],
                        ["link", "clean"],
                      ],
                    }}
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

                <ReactQuill
                  value={item.explanation}
                  onChange={(value) => onChangeExplanation(index, value)}
                  placeholder="اكتب شرحًا لهذه الإجابة (لماذا هي صحيحة / كيف تُقيَّم)"
                  modules={{
                    toolbar: [
                      [{ header: [1, 2, false] }],
                      ["bold", "italic", "underline", "strike"],
                      [{ list: "ordered" }, { list: "bullet" }],
                      [{ direction: "rtl" }, { align: [] }],
                      ["link", "clean"],
                    ],
                  }}
                />
              </div>
            );
          })}

          <Button variant="outline" onClick={addCompleteAnswer} icon={<Plus className="w-5 h-5" />}>
            إضافة إجابة
          </Button>
        </div>
      </div>
    </div>
  );
}
