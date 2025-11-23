"use client";

import React, { useState } from "react";
import { BookOpen } from "lucide-react";
import Card from "./ExamCard";
import "react-quill-new/dist/quill.snow.css";
import { useDispatch, useSelector } from "react-redux";
import dynamic from "next/dynamic";
import { handleCreateExamSection } from "../../lib/features/examSlice";
import { toast } from "react-toastify";

// SSR-safe import
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

// Quill toolbar config
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

export default function QuestionSections({
  examData,
  filteredSection,
  onAddSection,
}) {
  const [nameHtml, setNameHtml] = useState(""); // Section Name
  const [descHtml, setDescHtml] = useState(""); // Section Description

  const dispatch = useDispatch();
  const { add_exam_section_loading } = useSelector((state) => state?.exam);

  // Reset quill editor values
  const resetEditors = () => {
    setNameHtml("");
    setDescHtml("");
  };

  // Add custom section to the exam
  const addCustomSection = () => {
    const trimmedName = nameHtml.replace(/<p>|<\/p>/g, "").trim(); // Remove <p> tags and check for empty name
    if (!trimmedName) return;

    const newSection = {
      exam_id: 1, // Create unique id for the section
      title: nameHtml, // Section name
      description: descHtml, // Section description
      // questions: [], // Initialize with no questions
      time_if_free:"01:30:0",
    };
    onAddSection(newSection)
    
    
    // onAddSection(newSection); // Callback function to add the section
    // resetEditors(); // Reset the inputs
  };

  if (!examData?.type) return null;

  return (
    <Card title="إدارة الأقسام" icon={BookOpen}>
      <div className="space-y-6" dir="rtl">
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-gray-900">إنشاء قسم مخصص</p>
            {examData?.type === "mock" && (
              <span className="text-xs text-gray-500">
                للمحاكاة: أضِف أسئلة لاحقًا للوصول إلى 24 سؤالًا كحد أدنى
              </span>
            )}
          </div>

          <div className="mt-3 space-y-4">
            {/* Section Name */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-gray-600">
                اسم القسم
              </label>
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

            {/* Section Description */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-gray-600">
                وصف القسم
              </label>
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

            {/* Action Buttons */}
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
                title={
                  !nameHtml.replace(/<p>|<\/p>/g, "").trim()
                    ? "اسم القسم مطلوب"
                    : undefined
                }
              >
               {add_exam_section_loading ?"جاري الإضافة..." : " إضافة قسم جديد"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
