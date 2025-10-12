"use client";

import React, { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { BookOpen } from "lucide-react";
import Card from "./ExamCard";
import "react-quill-new/dist/quill.snow.css";

// SSR-safe import
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

/** Toolbar with color/background + sub/sup already supported in ExamMainData editors.
 * For section name/desc, we also enable them here. */
const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ script: "sub" }, { script: "super" }],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ align: ["", "center", "right", "justify"] }],
    [{ color: [] }, { background: [] }],
    ["link", "clean"],
  ],
};
const quillFormats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "script",
  "list",
  "bullet",
  "align",
  "direction",
  "color",
  "background",
  "link",
];

export default function QuestionSections({ examData, filteredSection, onAddSection }) {
  const [nameHtml, setNameHtml] = useState("");
  const [descHtml, setDescHtml] = useState("");

  const selectedItem = null; // (dropdown was removed in your provided version)

  const resetEditors = () => {
    setNameHtml("");
    setDescHtml("");
  };

  const addCustomSection = () => {
    const trimmedName = nameHtml.replace(/<p>|<\/p>/g, "").trim();
    if (!trimmedName) return;

    const newSection = {
      id: `custom-${Date.now()}`,
      name: nameHtml,
      desc: descHtml,
      questions: [],
    };

    onAddSection(newSection);
    resetEditors();
  };

  if (!examData?.type) return null;

  return (
    <Card title="إدارة الأقسام" icon={BookOpen}>
      <div className="space-y-6" dir="rtl">
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-gray-900">إنشاء قسم مخصص</p>
            {examData?.type === "mock" && (
              <span className="text-xs text-gray-500">للمحاكاة: أضِف أسئلة لاحقًا للوصول إلى 24 سؤالًا كحد أدنى</span>
            )}
          </div>

          <div className="mt-3 space-y-4">
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-gray-600">اسم القسم</label>
              <div className="bg-white rounded-xl border border-gray-200">
                <ReactQuill
                  theme="snow"
                  value={nameHtml}
                  onChange={setNameHtml}
                  modules={quillModules}
                  formats={quillFormats}
                  placeholder="اكتب اسم القسم..."
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-gray-600">وصف القسم</label>
              <div className="bg-white rounded-xl border border-gray-200">
                <ReactQuill
                  theme="snow"
                  value={descHtml}
                  onChange={setDescHtml}
                  modules={quillModules}
                  formats={quillFormats}
                  placeholder="اكتب وصفًا مختصرًا للقسم..."
                />
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setNameHtml("");
                  setDescHtml("");
                }}
                className="px-3 py-2 rounded-lg border text-sm text-gray-700 hover:bg-gray-50"
                type="button"
              >
                مسح
              </button>
              <button
                onClick={addCustomSection}
                className="px-3 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700 disabled:opacity-50"
                type="button"
                disabled={!nameHtml.replace(/<p>|<\/p>/g, "").trim()}
                title={!nameHtml.replace(/<p>|<\/p>/g, "").trim() ? "اسم القسم مطلوب" : undefined}
              >
                إضافة قسم جديد
              </button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
