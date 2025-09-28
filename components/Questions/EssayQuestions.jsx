"use client";
import React, { useMemo } from "react";
import dynamic from "next/dynamic";

// SSR-safe import for ReactQuill
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

/* =============== Shared Quill config =============== */
const useQuillConfig = () =>
  useMemo(
    () => ({
      modules: {
        toolbar: [
          [{ header: [1, 2, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ direction: "rtl" }, { align: [] }],
          ["link", "clean"],
        ],
        clipboard: { matchVisual: false },
      },
      formats: [
        "header",
        "bold",
        "italic",
        "underline",
        "strike",
        "list",
        "bullet",
        "direction",
        "align",
        "link",
      ],
    }),
    []
  );

/* =============== Labeled Editor wrapper =============== */
function LabeledEditor({
  label,
  hint,
  value,
  onChange,
  placeholder = "اكتب هنا…",
  editorMinH = 160,
}) {
  const { modules, formats } = useQuillConfig();

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-gray-700">
          {label}
        </label>
        {hint ? <span className="text-[11px] text-gray-400">{hint}</span> : null}
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-blue-500/20">
        <ReactQuill
          value={value}
          onChange={onChange}
          modules={modules}
          formats={formats}
          placeholder={placeholder}
        />
      </div>

      {/* Editor height & RTL */}
      <style jsx global>{`
        [dir="rtl"] .ql-editor {
          direction: rtl;
          text-align: right;
          min-height: ${editorMinH}px;
        }
        .ql-toolbar.ql-snow {
          border: 0;
          border-bottom: 1px solid #e5e7eb;
          background: #fafafa;
        }
        .ql-container.ql-snow {
          border: 0;
        }
      `}</style>
    </div>
  );
}

/* ===================== EssayQuestions ===================== */
export default function EssayQuestions({
  modalAnswer,
  setModalAnswer,
  label = "الإجابة النموذجية",
  hint = "يمكنك استخدام التنسيق، القوائم والروابط",
  showCounters = true,
}) {
  // basic counters from HTML
  const plainText = useMemo(
    () => (modalAnswer || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim(),
    [modalAnswer]
  );
  const words = plainText ? plainText.split(" ").length : 0;
  const chars = plainText.length;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <LabeledEditor
        label={label}
        hint={hint}
        value={modalAnswer}
        onChange={setModalAnswer}
        placeholder="أدخل الإجابة النموذجية هنا…"
        editorMinH={200}
      />

      <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
        {showCounters ? (
          <div className="space-x-3 space-x-reverse">
            <span>عدد الكلمات: {words}</span>
            <span>عدد الحروف: {chars}</span>
          </div>
        ) : <span />}

        <button
          type="button"
          onClick={() => setModalAnswer("")}
          className="px-2.5 py-1 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-700"
          title="مسح المحتوى"
        >
          مسح
        </button>
      </div>
    </div>
  );
}
