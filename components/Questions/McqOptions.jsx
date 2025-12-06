"use client";

import React from "react";
import Input from "../atoms/Input";
import Button from "../atoms/Button";
import { Trash2, PlusIcon } from "lucide-react";

export default function McqOptions({
  questionType,
  options,
  updateOption,
  toggleCorrect,
  addOption,
  removeOption,
  allowMultipleCorrect,
}) {
  if (questionType !== "mcq") return null;

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-[#202938]">خيارات الإجابة</label>

      {options.map((option, index) => (
        <div key={index} className="flex items-start gap-3">
          <div className="flex-1 space-y-2">
            <Input
              placeholder={`الخيار ${index + 1}`}
              value={option.text}
              onChange={(e) => updateOption(index, "text", e.target.value)}
            />
            <Input
              placeholder="شرح الإجابة (اختياري)"
              value={option.explanation}
              onChange={(e) => updateOption(index, "explanation", e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 mt-3">
            <button
              type="button"
              onClick={() => toggleCorrect(index)}
              title={allowMultipleCorrect ? "تبديل كإجابة صحيحة" : "تعيين الإجابة الصحيحة"}
              className={`w-5 h-5 ${
                allowMultipleCorrect ? "rounded border-2" : "rounded-full border-2"
              } flex items-center justify-center ${
                option.isCorrect ? "border-green-500 bg-green-500" : "border-gray-300"
              }`}
            >
              {option.isCorrect && (
                <svg className="w-3 h-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>

            {typeof removeOption === "function" && options.length > 2 && (
              <Button
                type="button"
                onClick={() => removeOption(index)}
                className="text-red-500 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      ))}

      <Button type="button" onClick={addOption} className="mt-2 inline-flex items-center gap-2">
        <PlusIcon className="w-4 h-4" />
        إضافة خيار
      </Button>
    </div>
  );
}
