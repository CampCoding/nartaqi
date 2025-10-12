"use client";

import React, { useMemo, useRef, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import { useQuillConfig } from "@/utils/quillConfig";

// SSR-safe
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const FIXED_IMG = { width: 320, height: 200, objectFit: "contain" };

const LabeledEditor = ({
  label,
  hint,
  value,
  onChange,
  placeholder = "اكتب هنا…",
  editorMinH = 200,
  allowImages = true,
  uploadImage, // async (file)=>url (optional, fallback to dataURL)
  imageSize = FIXED_IMG,
}) => {
  const quillRef = useRef(null);
  const inputRef = useRef(null);
  const openPicker = useCallback(() => inputRef.current?.click(), []);
  const { modules, formats } = useQuillConfig({ allowImages, onImageRequest: openPicker });

  const applyFixed = useCallback(() => {
    const q = quillRef.current?.getEditor?.();
    const root = q?.root;
    if (!root) return;
    root.querySelectorAll("img").forEach((img) => {
      img.style.width = `${imageSize.width}px`;
      img.style.height = `${imageSize.height}px`;
      img.style.objectFit = imageSize.objectFit || "contain";
      img.style.display = "inline-block";
    });
  }, [imageSize.height, imageSize.objectFit, imageSize.width]);

  const fileToDataUrl = (file) =>
    new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(String(r.result || ""));
      r.onerror = reject;
      r.readAsDataURL(file);
    });

  const handleFiles = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = (await (uploadImage ? uploadImage(file) : fileToDataUrl(file))) || "";
    const editor = quillRef.current?.getEditor?.();
    if (!editor || !url) return;
    const range = editor.getSelection(true) || { index: editor.getLength(), length: 0 };
    editor.insertEmbed(range.index, "image", url, "user");
    editor.setSelection(range.index + 1, 0);
    requestAnimationFrame(applyFixed);
    e.target.value = "";
  };

  useEffect(() => {
    const q = quillRef.current?.getEditor?.();
    if (!q) return;
    const h = () => requestAnimationFrame(applyFixed);
    q.on("text-change", h);
    requestAnimationFrame(applyFixed);
    return () => q.off("text-change", h);
  }, [applyFixed]);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-gray-700">{label}</label>
        {allowImages && (
          <>
            <button
              type="button"
              onClick={openPicker}
              className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-lg border border-gray-200 hover:bg-gray-50"
              title="أدرج صورة"
            >
              📷 أدرج صورة
            </button>
            <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFiles} />
          </>
        )}
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm">
        <ReactQuill
          ref={quillRef}
          value={value}
          onChange={onChange}
          modules={modules}
          formats={formats}
          placeholder={placeholder}
        />
      </div>

      {hint && <div className="text-[11px] text-gray-500">{hint}</div>}

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
        .ql-editor img {
          width: ${imageSize.width}px !important;
          height: ${imageSize.height}px !important;
          object-fit: ${imageSize.objectFit};
          display: inline-block;
        }
      `}</style>
    </div>
  );
};

export default function EssayQuestions({
  modalAnswer,
  setModalAnswer,
  label = "الإجابة النموذجية",
  hint = "يدعم الألوان وخلفية النص وكتابة H₂O عبر زر x₂",
  showCounters = true,
  uploadImage,
}) {
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
        allowImages
        uploadImage={uploadImage}
      />

      <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
        {showCounters ? (
          <div className="space-x-3 space-x-reverse">
            <span>عدد الكلمات: {words}</span>
            <span>عدد الحروف: {chars}</span>
          </div>
        ) : (
          <span />
        )}

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
