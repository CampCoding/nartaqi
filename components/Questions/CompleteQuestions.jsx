"use client";
import React, { useMemo, useRef, useCallback, useEffect } from "react";
import Button from "../atoms/Button";
import { Plus, Trash2, Image as ImageIcon } from "lucide-react";
import dynamic from "next/dynamic";

// Dynamically import ReactQuill with SSR disabled
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

/* ================= Fixed image sizing config ================= */
const FIXED_IMG = {
  width: 320,       // ⬅️ change if you want a different fixed width
  height: 200,      // ⬅️ change if you want a different fixed height
  objectFit: "contain",
};

/* ============== tiny helper: file -> data URL (fallback uploader) ============== */
async function fileToDataUrl(file) {
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onerror = reject;
    reader.onload = () => resolve(String(reader.result || ""));
    reader.readAsDataURL(file);
  });
}

/* ================= Shared Quill config (factory with custom image handler) ================= */
const useQuillConfig = (onImageRequest) =>
  useMemo(
    () => ({
      modules: {
        toolbar: {
          container: [
            [{ header: [1, 2, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ direction: "rtl" }, { align: [] }],
            ["link", "image", "clean"], // <-- added image
          ],
          handlers: {
            image: () => {
              if (typeof onImageRequest === "function") onImageRequest();
            },
          },
        },
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
        "image", // <-- allow image format
      ],
    }),
    [onImageRequest]
  );

/* ============== Small labeled editor wrapper (with image upload + fixed size) ============== */
const LabeledQuill = ({
  label,
  value,
  onChange,
  placeholder = "اكتب هنا…",
  minH = 120,
  className = "",
  uploadImage, // optional: async (file: File) => string (URL)
  imageSize = FIXED_IMG, // optional override
}) => {
  const quillRef = useRef(null);
  const fileInputRef = useRef(null);

  const openPicker = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const { modules, formats } = useQuillConfig(openPicker);

  // Apply fixed size to all images in this editor
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
        const url =
          (await (uploadImage ? uploadImage(file) : fileToDataUrl(file))) || "";
        const editor = quillRef.current?.getEditor?.();
        if (!editor || !url) return;

        const range = editor.getSelection(true) || {
          index: editor.getLength(),
          length: 0,
        };
        editor.insertEmbed(range.index, "image", url, "user");
        editor.setSelection(range.index + 1, 0);

        // Ensure the newly inserted image gets the fixed dimensions
        requestAnimationFrame(() => {
          const root = editor.root;
          try {
            const img = root.querySelector(`img[src="${CSS.escape(url)}"]`);
            if (img) {
              img.style.width = `${imageSize.width}px`;
              img.style.height = `${imageSize.height}px`;
              img.style.objectFit = imageSize.objectFit || "contain";
              img.style.display = "inline-block";
            }
          } catch {
            // Fallback: apply to all if querySelector fails due to special chars
            applyFixedSizeToAllImages();
          }
        });
      } finally {
        // allow selecting the same file again
        if (e?.target) e.target.value = "";
      }
    },
    [uploadImage, imageSize.height, imageSize.objectFit, imageSize.width, applyFixedSizeToAllImages]
  );

  // Re-apply fixed size after any content change or on mount
  useEffect(() => {
    const quill = quillRef.current?.getEditor?.();
    if (!quill) return;
    const handler = () => requestAnimationFrame(applyFixedSizeToAllImages);
    quill.on("text-change", handler);
    requestAnimationFrame(applyFixedSizeToAllImages);
    return () => quill.off("text-change", handler);
  }, [applyFixedSizeToAllImages]);

  // Also catch paste/drag-drop images and normalize size shortly after
  const onPaste = useCallback(() => {
    requestAnimationFrame(applyFixedSizeToAllImages);
  }, [applyFixedSizeToAllImages]);

  const onDrop = useCallback(() => {
    requestAnimationFrame(applyFixedSizeToAllImages);
  }, [applyFixedSizeToAllImages]);

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-gray-700">
          {label}
        </label>
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

      {/* RTL + min height + fixed image CSS fallback */}
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
        /* 🔒 Force all images inside *any* Quill editor to a fixed size as a safety net */
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
  uploadImage, // <-- optional prop passed down to all editors
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

  // Send patch to parent while staying backward-compatible
  const patchAnswer = (index, next) => {
    const curr = normalizeItem(completeAnswers?.[index]);
    const payload = { ...curr, ...next };
    // if parent uses string mode, only pass the "answer" string
    updateCompleteAnswer(index, isObjectMode ? payload : payload.answer);
  };

  return (
    <div className="space-y-5" dir="rtl">
      {/* Main text (with … placeholders) */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <LabeledQuill
          label="نص السؤال (ضع … في الأماكن الناقصة)"
          value={completeText}
          onChange={setCompleteText}
          placeholder='أدخل نص السؤال ويمكنك إدراج صور، مع وضع (…) في الأماكن الناقصة'
          minH={160}
          uploadImage={uploadImage}
          imageSize={FIXED_IMG}
        />
        <p className="mt-2 text-[11px] text-gray-500">
          مثال: &nbsp;
          <span className="px-2 py-0.5 rounded bg-gray-100">ولد … في عام …</span>
        </p>
      </div>

      {/* Answers list */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-semibold text-gray-800">
            الإجابات الصحيحة
          </label>
          <Button
            variant="outline"
            onClick={addCompleteAnswer}
            icon={<Plus className="w-5 h-5" />}
          >
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

                {/* Answer (rich text + images, fixed size) */}
                <LabeledQuill
                  label="نص الإجابة"
                  value={item.answer}
                  onChange={(v) => patchAnswer(index, { answer: v })}
                  placeholder={`الإجابة ${index + 1} (يمكنك إدراج صور)`}
                  minH={110}
                  uploadImage={uploadImage}
                  imageSize={FIXED_IMG}
                />

                {/* Optional explanation (rich text + images, fixed size) */}
                {isObjectMode && (
                  <LabeledQuill
                    label="شرح الإجابة (اختياري)"
                    value={item.explanation}
                    onChange={(v) => patchAnswer(index, { explanation: v })}
                    placeholder="اكتب شرحًا لهذه الإجابة… ويمكنك إدراج صور توضيحية"
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
