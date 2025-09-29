"use client";

import React, { useMemo, useRef, useCallback, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Button from "../atoms/Button";
import { Check, X, Eraser, Image as ImageIcon } from "lucide-react";

// SSR-safe import for ReactQuill
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

/* ============== ثابت لحجم الصور ============== */
const FIXED_IMG = {
  width: 320,     // غيّر المقاس كما تريد
  height: 200,    // غيّر المقاس كما تريد
  objectFit: "contain",
};

/* ================= Helpers ================= */
// Fallback uploader: data URL embedding.
// For production, pass a real async uploader via the `uploadImage` prop and return a hosted URL.
async function fileToDataUrl(file) {
  if (!file) return "";
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onerror = reject;
    reader.onload = () => resolve(String(reader.result));
    reader.readAsDataURL(file);
  });
}

/* ================= Shared Quill config (factory) ================= */
const useQuillConfig = (onImageRequest) =>
  useMemo(() => {
    const modules = {
      toolbar: {
        container: [
          [{ header: [1, 2, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ direction: "rtl" }, { align: [] }],
          ["link", "image", "clean"],
        ],
        handlers: {
          image: () => {
            if (typeof onImageRequest === "function") onImageRequest();
          },
        },
      },
      clipboard: { matchVisual: false },
    };

    const formats = [
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
      "image",
    ];

    return { modules, formats };
  }, [onImageRequest]);

/* ============== LabeledQuill: مع رفع صور + ضبط حجم ثابت ============== */
const LabeledQuill = ({
  label,
  value,
  onChange,
  placeholder = "اكتب هنا…",
  minH = 120,
  className = "",
  uploadImage, // async (file) => url
  imageSize = FIXED_IMG,
}) => {
  const quillRef = useRef(null);
  const fileInputRef = useRef(null);

  const openPicker = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const { modules, formats } = useQuillConfig(openPicker);

  // ضبط حجم كل الصور داخل هذا المحرر
  const applyFixedSizeToAllImages = useCallback(() => {
    const quill = quillRef.current?.getEditor?.();
    const root = quill?.root;
    if (!root) return;
    const imgs = root.querySelectorAll("img");
    imgs.forEach((img) => {
      img.style.width = `${imageSize.width}px`;
      img.style.height = `${imageSize.height}px`;
      img.style.objectFit = imageSize.objectFit || "contain";
      img.style.display = "inline-block";
    });
  }, [imageSize.height, imageSize.objectFit, imageSize.width]);

  const handleFiles = useCallback(
    async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      try {
        const url = (await (uploadImage ? uploadImage(file) : fileToDataUrl(file))) || "";
        const editor = quillRef.current?.getEditor?.();
        if (!editor || !url) return;
        const range = editor.getSelection(true) || { index: editor.getLength(), length: 0 };
        editor.insertEmbed(range.index, "image", url, "user");
        editor.setSelection(range.index + 1, 0);

        // طبّق المقاس على الصورة المدخلة فورًا
        requestAnimationFrame(() => {
          const root = editor.root;
          try {
            const img = root.querySelector(`img[src="${CSS.escape(url)}"]`);
            if (img) {
              img.style.width = `${imageSize.width}px`;
              img.style.height = `${imageSize.height}px`;
              img.style.objectFit = imageSize.objectFit || "contain";
              img.style.display = "inline-block";
            } else {
              applyFixedSizeToAllImages();
            }
          } catch {
            applyFixedSizeToAllImages();
          }
        });
      } finally {
        if (e?.target) e.target.value = "";
      }
    },
    [uploadImage, imageSize.height, imageSize.objectFit, imageSize.width, applyFixedSizeToAllImages]
  );

  // إعادة تطبيق المقاس بعد أي تعديل نصّي/لصق/سحب
  useEffect(() => {
    const quill = quillRef.current?.getEditor?.();
    if (!quill) return;
    const handler = () => requestAnimationFrame(applyFixedSizeToAllImages);
    quill.on("text-change", handler);
    requestAnimationFrame(applyFixedSizeToAllImages);
    return () => quill.off("text-change", handler);
  }, [applyFixedSizeToAllImages]);

  const onPaste = useCallback(() => {
    requestAnimationFrame(applyFixedSizeToAllImages);
  }, [applyFixedSizeToAllImages]);

  const onDrop = useCallback(() => {
    requestAnimationFrame(applyFixedSizeToAllImages);
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
          aria-label="أدرج صورة"
        >
          أدرج صورة
        </Button>
      </div>

      <div
        className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-blue-500/20"
        onPaste={onPaste}
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <ReactQuill
          ref={quillRef}
          value={value}
          onChange={onChange}
          modules={modules}
          formats={formats}
          placeholder={placeholder}
        />
      </div>

      {/* Hidden input for image picking */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFiles}
      />

      {/* RTL + min height + fallback CSS لتثبيت حجم الصور */}
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
        /* إجبار أي صورة داخل أي محرر Quill على الحجم الثابت (شبكة أمان عامة) */
        .ql-editor img {
          width: ${imageSize.width}px !important;
          height: ${imageSize.height}px !important;
          object-fit: ${imageSize.objectFit};
          display: inline-block;
        }
        .ql-snow .ql-picker.ql-header .ql-picker-label::before {
          content: 'نمط العنوان';
        }
      `}</style>
    </div>
  );
};

/* ===================== Main Component ===================== */
export default function TrueFalseQuestions({
  // NEW (optional): question rich text
  questionHtml,
  setQuestionHtml,

  // Existing
  trueFalseExplanation,
  trueFalseAnswer,
  setTrueFalseAnswer,
  setTrueFalseExplanation,

  // OPTIONAL: custom async uploader (file => URL string). If omitted, embeds Data URLs.
  uploadImage,
}) {
  // Back-compat fallbacks so the component works even if parent doesn't supply question state yet
  const [internalQuestion, setInternalQuestion] = useState(questionHtml || "");
  const qValue = typeof questionHtml === "string" ? questionHtml : internalQuestion;
  const setQ = setQuestionHtml || setInternalQuestion;

  const isTrue = trueFalseAnswer === true;
  const isFalse = trueFalseAnswer === false;

  return (
    <div className="space-y-5" dir="rtl">
      {/* Card: question content (text + images) */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <LabeledQuill
          label="نص السؤال"
          value={qValue}
          onChange={setQ}
          placeholder="اكتب نص السؤال… ويمكنك إدراج صورة داخل السؤال من زر أدرج صورة أو من شريط الأدوات."
          minH={160}
          uploadImage={uploadImage}
          imageSize={FIXED_IMG}
        />
      </div>

      {/* Card: answer selector */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-semibold text-gray-800">الإجابة الصحيحة</label>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setTrueFalseAnswer(null)}
            icon={<Eraser className="w-4 h-4" />}
            aria-label="مسح الاختيار"
          >
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

      {/* Card: explanation (rich text + images) */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <LabeledQuill
          label="شرح الإجابة (اختياري)"
          value={trueFalseExplanation}
          onChange={setTrueFalseExplanation}
          placeholder="اكتب سبب صحة/خطأ العبارة… ويمكنك إدراج صور توضيحية."
          minH={140}
          uploadImage={uploadImage}
          imageSize={FIXED_IMG}
        />
      </div>
    </div>
  );
}
