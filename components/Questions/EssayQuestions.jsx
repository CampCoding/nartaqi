"use client";
import React, { useMemo, useRef, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import Button from "../atoms/Button";
import { Image as ImageIcon } from "lucide-react";

// SSR-safe import for ReactQuill
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

/* =============== tiny helper: file -> data URL =============== */
const fileToDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result || ""));
    r.onerror = reject;
    r.readAsDataURL(file);
  });

/* =============== Shared Quill config (factory) =============== */
const useQuillConfig = (withImages, onImageRequest) =>
  useMemo(() => {
    const toolbarBase = [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ direction: "rtl" }, { align: [] }],
      ["link", "clean"],
    ];

    const modules = {
      toolbar: withImages
        ? {
            container: [...toolbarBase, ["image"]],
            handlers: {
              image: () => {
                if (typeof onImageRequest === "function") onImageRequest();
              },
            },
          }
        : toolbarBase,
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
      ...(withImages ? ["image"] : []),
    ];

    return { modules, formats };
  }, [withImages, onImageRequest]);

/* =============== Labeled Editor wrapper (with optional images) =============== */
function LabeledEditor({
  label,
  hint,
  value,
  onChange,
  placeholder = "اكتب هنا…",
  editorMinH = 200,
  allowImages = true,               // ✅ لتفعيل زر "أدرج صورة"
  uploadImage,                      // اختياري: async (file) => URL
  imageSize = { width: 320, height: 200, objectFit: "contain" }, // تحجيم ثابت
}) {
  const quillRef = useRef(null);
  const inputRef = useRef(null);

  const openPicker = useCallback(() => inputRef.current?.click(), []);
  const { modules, formats } = useQuillConfig(allowImages, openPicker);

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

        // أدخل الصورة عند المؤشر الحالي
        const range = editor.getSelection(true) || { index: editor.getLength(), length: 0 };
        editor.insertEmbed(range.index, "image", url, "user");
        editor.setSelection(range.index + 1, 0);

        // ثبّت حجم الصورة المُضافة فورًا
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
        e.target.value = ""; // للسماح برفع نفس الملف مرة أخرى
      }
    },
    [uploadImage, imageSize.height, imageSize.objectFit, imageSize.width, applyFixedSizeToAllImages]
  );

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
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-gray-700">{label}</label>
        <div className="flex items-center gap-2">
          {hint ? <span className="text-[11px] text-gray-400">{hint}</span> : null}
          {allowImages && (
            <>
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
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFiles}
              />
            </>
          )}
        </div>
      </div>

      <div
        className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-blue-500/20"
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

      {/* Editor height & RTL + fixed image CSS fallback */}
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
        /* شبكة أمان: فرض حجم ثابت لأي صورة داخل Quill */
        .ql-editor img {
          width: ${imageSize.width}px !important;
          height: ${imageSize.height}px !important;
          object-fit: ${imageSize.objectFit};
          display: inline-block;
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
  hint = "يمكنك استخدام التنسيق، القوائم، الروابط، وإدراج الصور",
  showCounters = true,
  uploadImage, // اختياري: نفس التوقيع المذكور أعلاه
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
        allowImages={true}
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
