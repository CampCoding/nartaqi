"use client";

import { AlertCircle, BookOpen, CheckCircle, PlusIcon } from "lucide-react";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import Card from "./ExamCard";
import ProgressBar from "./ExamProgressBar";
import "react-quill-new/dist/quill.snow.css";

// SSR-safe import for Next.js
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ align: ["", "center", "right", "justify"] }],
    // [{ direction: "ltr" }],
    [{ color: [] }, { background: [] }],
    ["link", "blockquote", "code-block"],
    ["clean"],
  ],
};

const quillFormats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "list",    // Add "list" to ensure list formats are available
  "bullet",  // Make sure bullet is included
  "align",
  "direction",
  "color",
  "background",
  "link",
  "blockquote",
  "code-block",
];

export default function QuestionSections({
  examData,
  filteredSection,
  onAddSection,
}) {
  // Local rich-text state for creating a custom section
  const [nameHtml, setNameHtml] = useState("");
  const [descHtml, setDescHtml] = useState("");

  const resetEditors = () => {
    setNameHtml("");
    setDescHtml("");
  };

  const addCustomSection = () => {
    const trimmedName = nameHtml.replace(/<p>|<\/p>/g, "").trim();
    if (!trimmedName) return; // Require a name

    // Create a new section with its own empty questions array
    const newSection = {
      id: `custom-${Date.now()}`,
      name: nameHtml, // rich HTML
      desc: descHtml, // rich HTML
      questions: [],  // Each section has its own questions array
    };

    // Pass the new section to the parent component
    onAddSection(newSection);
    resetEditors();
  };

  return (
    examData?.type && (
      <Card title="إدارة الأقسام" icon={BookOpen}>
        <div className="space-y-6">
          {/* Header row */}
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium text-gray-700">الأقسام المتاحة</h3>
            <ProgressBar
              current={examData?.sections?.length}
              total={filteredSection?.length || 1}
              label="الأقسام المضافة"
            />
          </div>

          {/* --- Rich Text Editors (Create Custom Section) --- */}
          <div className="rounded-xl border border-gray-200 p-4 space-y-4">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-gray-800">إنشاء قسم مخصص</p>
              {examData?.type === "mock" && (
                <span className="text-xs text-gray-500">
                  للمحاكاة: أضِف أسئلة لاحقًا للوصول إلى 24 سؤالًا كحد أدنى
                </span>
              )}
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700 text-right">
                اسم القسم 
              </label>
              <div dir="rtl" className="bg-white rounded-md overflow-hidden">
                <ReactQuill
                  theme="snow"
                  value={nameHtml}
                  onChange={setNameHtml}
                  modules={quillModules}
                  formats={quillFormats}
                  placeholder="اكتب اسم القسم..."
                  style={{ direction: "rtl" }}
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700 text-right">
                وصف القسم 
              </label>
              <div dir="rtl" className="bg-white rounded-md overflow-hidden">
                <ReactQuill
                  theme="snow"
                  value={descHtml}
                  onChange={setDescHtml}
                  modules={quillModules}
                  formats={quillFormats}
                  placeholder="اكتب وصفًا مختصرًا للقسم..."
                  style={{ direction: "rtl" }}
                />
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={resetEditors}
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
                title={
                  !nameHtml.replace(/<p>|<\/p>/g, "").trim()
                    ? "اسم القسم مطلوب"
                    : undefined
                }
              >
                إضافة قسم جديد
              </button>
            </div>
          </div>

          {/* --- Available Sections Grid --- */}
         
        </div>
      </Card>
    )
  );
}