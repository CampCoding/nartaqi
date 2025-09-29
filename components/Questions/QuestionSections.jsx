"use client";

import React, { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { BookOpen, CheckCircle, AlertCircle, PlusIcon } from "lucide-react";
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
  "list",
  "bullet",
  "align",
  "direction",
  "color",
  "background",
  "link",
  "blockquote",
  "code-block",
];

export default function QuestionSections({ examData, filteredSection, onAddSection }) {
  // Rich-text state for custom section
  const [nameHtml, setNameHtml] = useState("");
  const [descHtml, setDescHtml] = useState("");

  // Dropdown state
  const [selectedId, setSelectedId] = useState("");

  const selectedItem = useMemo(
    () => (filteredSection || []).find((s) => String(s.id) === String(selectedId)),
    [filteredSection, selectedId]
  );

  const isAlreadyAdded = useMemo(() => {
    if (!selectedItem) return false;
    return (examData?.sections || []).some((s) => String(s.id) === String(selectedItem.id));
  }, [examData?.sections, selectedItem]);

  const resetEditors = () => {
    setNameHtml("");
    setDescHtml("");
  };

  const addCustomSection = () => {
    const trimmedName = nameHtml.replace(/<p>|<\/p>/g, "").trim();
    if (!trimmedName) return;

    const newSection = {
      id: `custom-${Date.now()}`,
      name: nameHtml, // rich HTML
      desc: descHtml, // rich HTML
      questions: [],
    };

    onAddSection(newSection);
    resetEditors();
  };

  const handleAddFromDropdown = () => {
    if (!selectedItem) return;
    // Ensure the section carries its own questions array
    onAddSection({ ...selectedItem, questions: selectedItem.questions || [] });
  };

  if (!examData?.type) return null;

  return (
    <Card title="إدارة الأقسام" icon={BookOpen}>
      <div className="space-y-6" dir="rtl">
        {/* Header row */}
        {/* <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h3 className="text-sm font-medium text-gray-700">الأقسام المتاحة</h3>
          <ProgressBar
            current={examData?.sections?.length}
            total={filteredSection?.length || 1}
            label="الأقسام المضافة"
          />
        </div> */}

        {/* ---------- Create custom section (Rich Text) ---------- */}
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
                إضافة قسم جديد
              </button>
            </div>
          </div>
        </div>

        {/* ---------- Current added sections overview ---------- */}
        {/* {Array.isArray(examData?.sections) && examData.sections.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-700">الأقسام المضافة حاليًا</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {examData.sections.map((s) => (
                <div
                  key={s.id}
                  className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 rounded-lg bg-blue-50 p-2">
                      <BookOpen className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="space-y-1">
                      <h5
                        className="font-semibold text-gray-900"
                        dangerouslySetInnerHTML={{ __html: s?.name || `قسم ${s.id}` }}
                      />
                      {s?.desc ? (
                        <p
                          className="text-sm text-gray-600"
                          dangerouslySetInnerHTML={{ __html: s.desc }}
                        />
                      ) : (
                        <p className="text-sm text-gray-500">—</p>
                      )}
                      <div className="text-xs text-gray-500">
                        أسئلة: {s.questions?.length ?? 0}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )} */}
      </div>
    </Card>
  );
}
