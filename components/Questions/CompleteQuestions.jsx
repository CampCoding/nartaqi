"use client";

import React, { useRef, useCallback, useEffect } from "react";
import Button from "../atoms/Button";
import { Plus, Trash2, Image as ImageIcon } from "lucide-react";
import dynamic from "next/dynamic";
import { useQuillConfig } from "@/utils/quillConfig";

// SSR-safe
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const FIXED_IMG = { width: 320, height: 200, objectFit: "contain" };

const LabeledQuill = ({
  label,
  value,
  onChange,
  placeholder = "اكتب هنا…",
  minH = 120,
  className = "",
  uploadImage,
  imageSize = FIXED_IMG,
}) => {
  const quillRef = useRef(null);
  const fileInputRef = useRef(null);

  const openPicker = useCallback(() => fileInputRef.current?.click(), []);
  const { modules, formats } = useQuillConfig({ allowImages: true, onImageRequest: openPicker });

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
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-gray-700">{label}</label>
        <Button
          variant="outline"
          size="xs"
          className="!p-2"
          onClick={openPicker}
          icon={<ImageIcon className="w-4 h-4" />}
          aria-label="أدرج صورة"
        >
          أدرج صورة
        </Button>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
        <ReactQuill
          ref={quillRef}
          value={value}
          onChange={onChange}
          modules={modules}
          formats={formats}
          placeholder={placeholder}
        />
      </div>

      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFiles} />

      <style jsx global>{`
        [dir="rtl"] .ql-editor {
          direction: rtl;
          text-align: right;
          min-height: ${minH}px;
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

export default function CompleteQuestions({
  completeText,
  setCompleteText,
  completeAnswers,
  updateCompleteAnswer,
  removeCompleteAnswer,
  addCompleteAnswer,
  uploadImage,
}) {
  const isObjectMode =
    Array.isArray(completeAnswers) &&
    completeAnswers.length > 0 &&
    typeof completeAnswers[0] === "object" &&
    completeAnswers[0] !== null;

  const normalizeItem = (item) => {
    if (typeof item === "string") return { answer: item, explanation: "" };
    if (item && typeof item === "object")
      return { answer: item.answer || "", explanation: item.explanation || "" };
    return { answer: "", explanation: "" };
  };

  const patchAnswer = (index, next) => {
    const curr = normalizeItem(completeAnswers?.[index]);
    const payload = { ...curr, ...next };
    updateCompleteAnswer(index, isObjectMode ? payload : payload.answer);
  };

  return (
    <div className="space-y-5" dir="rtl">
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <LabeledQuill
          label="نص السؤال (ضع … في الأماكن الناقصة)"
          value={completeText}
          onChange={setCompleteText}
          placeholder="أدخل نص السؤال (يدعم الألوان والخلفية وsub/sup)"
          minH={160}
          uploadImage={uploadImage}
          imageSize={FIXED_IMG}
        />
        <p className="mt-2 text-[11px] text-gray-500">
          مثال:&nbsp;<span className="px-2 py-0.5 rounded bg-gray-100">ولد … في عام …</span>
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-semibold text-gray-800">الإجابات الصحيحة</label>
          <Button variant="outline" onClick={addCompleteAnswer} icon={<Plus className="w-5 h-5" />}>
            إضافة إجابة
          </Button>
        </div>

        <div className="space-y-3">
          {completeAnswers?.map((raw, index) => {
            const item = normalizeItem(raw);
            return (
              <div key={index} className="border rounded-xl p-3 bg-gray-50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 text-xs text-gray-600">
                    <span className="inline-block w-6 h-6 rounded-full bg-blue-100 text-blue-700 grid place-items-center font-bold">
                      {index + 1}
                    </span>
                    إجابة رقم {index + 1}
                  </span>

                  {completeAnswers?.length > 1 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeCompleteAnswer(index)}
                      icon={<Trash2 className="w-4 h-4" />}
                      aria-label="حذف الإجابة"
                    />
                  )}
                </div>

                <LabeledQuill
                  label="نص الإجابة"
                  value={item.answer}
                  onChange={(v) => patchAnswer(index, { answer: v })}
                  placeholder={`الإجابة ${index + 1} (يدعم الألوان والخلفية وsub/sup)`}
                  minH={110}
                  uploadImage={uploadImage}
                  imageSize={FIXED_IMG}
                />

                {isObjectMode && (
                  <LabeledQuill
                    label="شرح الإجابة (اختياري)"
                    value={item.explanation}
                    onChange={(v) => patchAnswer(index, { explanation: v })}
                    placeholder="اكتب شرحًا لهذه الإجابة… (يدعم الألوان والخلفية وsub/sup)"
                    minH={100}
                    uploadImage={uploadImage}
                    imageSize={FIXED_IMG}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
