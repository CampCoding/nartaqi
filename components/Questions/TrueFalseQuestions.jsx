"use client";

import React, { useRef, useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Button from "../atoms/Button";
import { Check, X, Eraser, Image as ImageIcon } from "lucide-react";
import { useQuillConfig } from "@/utils/quillConfig";
import MathTypeEditor from "../MathTypeEditor/MathTypeEditor";

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
  uploadImage, // optional: async (file) => URL
  imageSize = FIXED_IMG,
}) => {
  const quillRef = useRef(null);
  const fileInputRef = useRef(null);

  const openPicker = useCallback(() => fileInputRef.current?.click(), []);
  const { modules, formats } = useQuillConfig({ allowImages: true, onImageRequest: openPicker });

  const applyFixedSizeToAllImages = useCallback(() => {
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
    requestAnimationFrame(applyFixedSizeToAllImages);
    e.target.value = "";
  };

  useEffect(() => {
    const q = quillRef.current?.getEditor?.();
    if (!q) return;
    const h = () => requestAnimationFrame(applyFixedSizeToAllImages);
    q.on("text-change", h);
    requestAnimationFrame(applyFixedSizeToAllImages);
    return () => q.off("text-change", h);
  }, [applyFixedSizeToAllImages]);

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-gray-700">{label}</label>
        <Button
          variant="outline"
          size="xs"
          onClick={openPicker}
          className="!p-2"
          icon={<ImageIcon className="w-4 h-4" />}
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

export default function TrueFalseQuestions({
  questionHtml,
  setQuestionHtml,
  trueFalseExplanation,
  trueFalseAnswer,
  setTrueFalseAnswer,
  setTrueFalseExplanation,
  uploadImage,
}) {
  const [internalQuestion, setInternalQuestion] = useState(questionHtml || "");
  const qValue = typeof questionHtml === "string" ? questionHtml : internalQuestion;
  const setQ = setQuestionHtml || setInternalQuestion;

  const isTrue = trueFalseAnswer === true;
  const isFalse = trueFalseAnswer === false;

  return (
    <div className="space-y-5" dir="rtl">
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        {/* <MathTypeEditor editorData={qValue} setEditorData=
          {(data) => {
            setQ(data);
          }}
        /> */}
        <LabeledQuill
          label="نص السؤال"
          value={qValue}
          onChange={setQ}
          placeholder="اكتب نص السؤال… (يدعم الألوان والخلفية وكتابة H₂O باستخدام x₂)"
          minH={160}
          uploadImage={uploadImage}
        />
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-semibold text-gray-800">الإجابة الصحيحة</label>
          <Button variant="outline" size="sm" onClick={() => setTrueFalseAnswer(null)} icon={<Eraser className="w-4 h-4" />}>
            مسح الاختيار
          </Button>
        </div>

        <div role="radiogroup" aria-label="الإجابة الصحيحة" className="grid grid-cols-2 gap-3">
          <Button
            className={`w-full ${isTrue ? "ring-2 ring-green-400" : ""}`}
            variant={isTrue ? "success" : "outline"}
            onClick={() => setTrueFalseAnswer(true)}
            aria-pressed={isTrue}
            aria-label="صحيح"
            icon={<Check className="w-4 h-4" />}
          >
            صحيح
          </Button>

          <Button
            className={`w-full ${isFalse ? "ring-2 ring-red-400" : ""}`}
            variant={isFalse ? "danger" : "outline"}
            onClick={() => setTrueFalseAnswer(false)}
            aria-pressed={isFalse}
            aria-label="خطأ"
            icon={<X className="w-4 h-4" />}
          >
            خطأ
          </Button>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <LabeledQuill
          label="شرح الإجابة (اختياري)"
          value={trueFalseExplanation}
          onChange={setTrueFalseExplanation}
          placeholder="اكتب سبب صحة/خطأ العبارة… (يدعم الألوان والخلفية وsub/sup)"
          minH={140}
          uploadImage={uploadImage}
        />
      </div>
    </div>
  );
}
