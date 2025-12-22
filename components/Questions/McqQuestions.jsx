// components/Questions/McqSharedPassageEditor.jsx
"use client";

import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import dynamic from "next/dynamic";
import { Plus as PlusIcon, Trash2, Paperclip, Image as ImageIcon } from "lucide-react";

// Quill (client only)
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

/* ================= Quill config ================= */
function useQuillConfig({ allowImages = true, onImageRequest } = {}) {
  const modules = useMemo(() => {
    const toolbar = [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ script: "sub" }, { script: "super" }],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ align: [] }, { direction: "rtl" }],
      [{ color: [] }, { background: [] }],
      ["link", "blockquote", "code-block", "clean"],
    ];
    if (allowImages) toolbar.push(["image"]);

    return {
      toolbar: allowImages
        ? {
            container: toolbar,
            handlers: { image: () => typeof onImageRequest === "function" && onImageRequest() },
          }
        : toolbar,
      clipboard: { matchVisual: false },
      history: { delay: 500, maxStack: 200, userOnly: true },
    };
  }, [allowImages, onImageRequest]);

  const formats = useMemo(
    () => [
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
      "blockquote",
      "code-block",
      ...(allowImages ? ["image"] : []),
    ],
    [allowImages]
  );

  return { modules, formats };
}

/* ============== ثابت عام لحجم الصور داخل المحررات ============== */
const FIXED_IMG = { width: 320, height: 200, objectFit: "contain" };

/* ============== file -> dataURL (fallback uploader) ============== */
async function fileToDataUrl(file) {
  if (!file) return "";
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onerror = reject;
    reader.onload = () => resolve(String(reader.result || ""));
    reader.readAsDataURL(file);
  });
}

/* ================= MathLive Arabic/RTL setup (JS only) ================= */
import "mathlive"; // JS only (CSS must be imported globally in app/globals.css)

/** run once per app load */
function useMathliveArabicSetupOnce() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (window.__ML_AR_SETUP_DONE__) return;
    window.__ML_AR_SETUP_DONE__ = true;

    try {
      if (document?.documentElement) {
        document.documentElement.setAttribute("dir", "rtl");
        document.documentElement.setAttribute("lang", "ar");
      }

      if (window.MathfieldElement) {
        window.MathfieldElement.locale = "ar";
        window.MathfieldElement.decimalSeparator = ",";
        window.MathfieldElement.fractionNavigationOrder = "denominator-numerator";
        window.MathfieldElement.strings = {
          ...window.MathfieldElement.strings,
          ar: {
            "tooltip.undo": "تراجع",
            "tooltip.redo": "إعادة",
            "tooltip.copy": "نسخ",
            "tooltip.paste": "لصق",
            "tooltip.cut": "قص",
            "tooltip.selectAll": "تحديد الكل",
            "tooltip.virtualKeyboard": "لوحة المفاتيح",
            "tooltip.hideKeypad": "إخفاء اللوحة",
            "menu.settings": "الإعدادات",
            "menu.math": "رياضيات",
            "menu.text": "نص",
          },
        };
      }

      if (window.mathVirtualKeyboard) {
        try {
          window.mathVirtualKeyboard.setKeycap("[.]", { label: "،", insert: "{,}" });
          window.mathVirtualKeyboard.setKeycap("[,]", { label: "٬", insert: "{,}" });
        } catch {}

        window.mathVirtualKeyboard.layouts = [
          {
            label: "١٢٣",
            id: "numeric-ar",
            rows: [
              ["١", "٢", "٣", "+", "−", "×", "÷", "="],
              ["٤", "٥", "٦", "(", ")", "[", "]", "%"],
              ["٧", "٨", "٩", "،", ".", ",", "^"],
              ["٠", "[backspace]", "[hide-keyboard]"],
            ],
          },
          {
            label: "رموز",
            id: "symbols-ar",
            rows: [
              [
                { latex: "+", label: "جمع" },
                { latex: "−", label: "طرح" },
                { latex: "×", label: "ضرب" },
                { latex: "÷", label: "قسمة" },
                { latex: "=", label: "يساوي" },
                { latex: "≈", label: "تقريب" },
                { latex: "≠", label: "لا يساوي" },
              ],
              [
                { latex: "(", label: "(" },
                { latex: ")", label: ")" },
                { latex: "[", label: "[" },
                { latex: "]", label: "]" },
                { latex: "{", label: "{" },
                { latex: "}", label: "}" },
              ],
              [
                { latex: "\\pi", label: "π" },
                { latex: "\\sqrt{#0}", label: "جذر", insert: "\\sqrt{#0}" },
                { latex: "\\frac{#0}{#?}", label: "كسر", insert: "\\frac{#0}{#?}" },
                { latex: "\\int", label: "تكامل" },
                { latex: "\\sum", label: "مجموع" },
                { latex: "\\infty", label: "مالانهاية" },
              ],
              [
                { latex: "\\log", label: "لوغاريتم", class: "vk-log" },
                { latex: "\\ln", label: "لوغاريتم طبيعي", class: "vk-log" },
                {
                  latex: "\\log_{#0}{#?}",
                  label: "لوغاريتم أساس",
                  insert: "\\log_{#0}{#?}",
                  class: "vk-log",
                },
                { latex: "e^{#0}", label: "س^رقم", insert: "e^{#0}", class: "vk-log" },
              ],
              [
                {
                  latex: "ax^{2}+bx+c=0",
                  label: "معادلة تربيعية",
                  insert: "ax^{2}+bx+c=0",
                  class: "vk-log",
                },
                {
                  latex: "y=mx+b",
                  label: "معادلة خطية",
                  insert: "y=mx+b",
                  class: "vk-log",
                },
              ],
              ["[space]", "[backspace]", "[hide-keyboard]"],
            ],
          },
          {
            label: "AR",
            id: "arabic",
            rows: [
              ["ض", "ص", "ث", "ق", "ف", "غ", "ع", "ه", "خ", "ح", "ج", "د"],
              ["ش", "س", "ي", "ب", "ل", "ا", "ت", "ن", "م", "ك", "ط"],
              ["ئ", "ء", "ؤ", "ر", "لا", "ى", "ة", "و", "ز", "ظ"],
              ["[hide-keyboard]", "[space]", "[backspace]"],
            ],
          },
        ];
      }
    } catch {}
  }, []);
}

/** Simple wrapper for the <math-field> web component */
function MathFieldInput({
  value = "",
  onChange,
  className = "",
  placeholder = "أدخل المعادلة (LaTeX)…",
  options = { virtualKeyboardMode: "onfocus" },
}) {
  useMathliveArabicSetupOnce();

  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.setAttribute("dir", "rtl");
    el.style.textAlign = "right";
    if (placeholder) el.setAttribute("aria-label", placeholder);
    if (options?.virtualKeyboardMode) el.setAttribute("virtual-keyboard-mode", options.virtualKeyboardMode);

    const handleInput = (e) => onChange?.(e?.target?.value ?? "");
    const handleFocus = () => {
      try {
        el.executeCommand?.("showVirtualKeyboard");
      } catch {}
    };

    el.addEventListener("input", handleInput);
    el.addEventListener("focus", handleFocus);
    return () => {
      el.removeEventListener("input", handleInput);
      el.removeEventListener("focus", handleFocus);
    };
  }, [onChange, placeholder, options?.virtualKeyboardMode]);

  // keep latex value synced
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (String(el.value || "") !== String(value || "")) {
      el.value = value || "";
    }
  }, [value]);

  return (
    <math-field
      ref={ref}
      dir="rtl"
      style={{ fontSize: "14px", minHeight: "48px", width: "100%", textAlign: "right" }}
      class={className}
    />
  );
}

/* ============== LabeledEditor (Quill) ============== */
function LabeledEditor({
  label,
  hint,
  value,
  onChange,
  placeholder = "اكتب هنا…",
  editorMinH = 140,
  uploadImage,
  imageSize = FIXED_IMG,
}) {
  const quillRef = useRef(null);
  const fileRef = useRef(null);

  const openPicker = useCallback(() => fileRef.current?.click(), []);
  const { modules, formats } = useQuillConfig({ allowImages: true, onImageRequest: openPicker });

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

  useEffect(() => {
    const quill = quillRef.current?.getEditor?.();
    if (!quill) return;
    const handler = () => requestAnimationFrame(applyFixedSizeToAllImages);
    quill.on("text-change", handler);
    requestAnimationFrame(applyFixedSizeToAllImages);
    return () => quill.off("text-change", handler);
  }, [applyFixedSizeToAllImages]);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-gray-700">{label}</label>
        {hint ? (
          <span className="text-[11px] text-gray-400">{hint}</span>
        ) : (
          <button
            type="button"
            onClick={openPicker}
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs hover:bg-gray-50"
          >
            <ImageIcon className="h-4 w-4" /> أدرج صورة
          </button>
        )}
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm focus-within:ring-2 focus-within:ring-blue-500/20">
        <ReactQuill
          ref={quillRef}
          value={value}
          onChange={onChange}
          modules={modules}
          formats={formats}
          placeholder={placeholder}
        />
      </div>

      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFiles} />

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
}

/* ============== مُلتقط ملفات عام (صور + PDF) ============== */
function AttachmentPicker({
  label = "مرفقات",
  files = [],
  onAddFiles,
  onRemoveFile,
  accept = "application/pdf,image/*",
  multiple = true,
}) {
  const inputRef = useRef(null);
  const handlePick = () => inputRef.current?.click();
  const handleChange = (e) => {
    const list = Array.from(e.target.files || []);
    if (list.length && onAddFiles) onAddFiles(list);
    e.target.value = "";
  };
  const isImage = (f) => (f?.type || "").startsWith("image/");
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-gray-700">{label}</label>
        <button
          type="button"
          onClick={handlePick}
          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs shadow-sm hover:bg-gray-50"
        >
          <Paperclip className="h-4 w-4" /> اختر ملفات
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        multiple={multiple}
        accept={accept}
        onChange={handleChange}
        className="hidden"
      />

      {!!files?.length && (
        <div className="flex flex-wrap gap-2">
          {files.map((f, idx) => (
            <div key={idx} className="group relative overflow-hidden rounded-lg border bg-white p-2">
              {isImage(f) ? (
                <img src={URL.createObjectURL(f)} alt={f.name} className="h-20 w-28 rounded-md object-cover" />
              ) : (
                <div className="flex h-20 w-28 items-center justify-center rounded-md bg-gray-100 p-2 text-center text-[11px] text-gray-600">
                  {f.type === "application/pdf" ? "PDF" : "ملف"}
                </div>
              )}
              <button
                type="button"
                onClick={() => onRemoveFile?.(idx)}
                className="absolute right-1 top-1 hidden rounded bg-red-600 px-1.5 py-0.5 text-[10px] text-white group-hover:block"
              >
                حذف
              </button>
              <div className="mt-1 w-28 truncate text-[11px] text-gray-700" title={f.name}>
                {f.name}
              </div>
            </div>
          ))}
        </div>
      )}
      {!files?.length && <p className="text-xs text-gray-500">مسموح: صور وملفات PDF</p>}
    </div>
  );
}

/* ============== McqSharedPassageEditor (export) ============== */
export default function McqSharedPassageEditor({
  mcqSubType = "passage", // "passage" | "chemical" | "math"
  initialData = [],
  onPassagesChange,
  uploadImage, // async (file) => url
}) {
  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

  // خيار الإجابة: latex + explanation + images[]
  const toOptionObject = (opt) => {
    if (typeof opt === "string") return { latex: "", explanation: "", images: [] };
    if (opt && typeof opt === "object")
      return {
        latex: opt.latex || "",
        explanation: opt.explanation || "",
        images: Array.isArray(opt.images) ? opt.images : [],
      };
    return { latex: "", explanation: "", images: [] };
  };

  const createQuestion = () => ({
    id: uid(),
    text: "",
    options: [toOptionObject(""), toOptionObject("")],
    correctIndex: 0,
    attachments: [],
  });

  const createPassage = () => ({
    id: uid(),
    content: "",
    questions: [createQuestion()],
    attachments: [],
  });

  const normalize = (arr) =>
    (arr || []).map((p) => ({
      id: p.id || uid(),
      content: p.content || "",
      attachments: Array.isArray(p.attachments) ? p.attachments : [],
      questions: (p.questions || []).map((q) => {
        const opts =
          Array.isArray(q.options) && q.options.length >= 2
            ? q.options.map(toOptionObject)
            : [toOptionObject(""), toOptionObject("")];
        return {
          id: q.id || uid(),
          text: q.text || "",
          options: opts,
          correctIndex:
            typeof q.correctIndex === "number" && q.correctIndex >= 0 && q.correctIndex < (opts?.length || 0)
              ? q.correctIndex
              : 0,
          attachments: Array.isArray(q.attachments) ? q.attachments : [],
        };
      }),
    }));

  const [passages, setPassages] = useState(() =>
    initialData?.length ? normalize(initialData) : [createPassage()]
  );

  useEffect(() => {
    onPassagesChange?.(passages);
  }, [passages, onPassagesChange]);

  /* -------- Passage ops -------- */
  const addPassage = () => setPassages((ps) => [...ps, createPassage()]);
  const removePassage = (pId) =>
    setPassages((ps) => (ps.length > 1 ? ps.filter((p) => p.id !== pId) : ps));
  const updatePassageContent = (pId, content) =>
    setPassages((ps) => ps.map((p) => (p.id === pId ? { ...p, content } : p)));
  const addPassageFiles = (pId, files) =>
    setPassages((ps) =>
      ps.map((p) => (p.id === pId ? { ...p, attachments: [...(p.attachments || []), ...files] } : p))
    );
  const removePassageFile = (pId, fileIdx) =>
    setPassages((ps) =>
      ps.map((p) =>
        p.id === pId ? { ...p, attachments: (p.attachments || []).filter((_, i) => i !== fileIdx) } : p
      )
    );

  /* -------- Question ops -------- */
  const addQuestion = (pId) =>
    setPassages((ps) => ps.map((p) => (p.id === pId ? { ...p, questions: [...p.questions, createQuestion()] } : p)));
  const removeQuestion = (pId, qId) =>
    setPassages((ps) =>
      ps.map((p) =>
        p.id === pId
          ? { ...p, questions: p.questions.length > 1 ? p.questions.filter((q) => q.id !== qId) : p.questions }
          : p
      )
    );
  const updateQuestionText = (pId, qId, text) =>
    setPassages((ps) =>
      ps.map((p) => (p.id === pId ? { ...p, questions: p.questions.map((q) => (q.id === qId ? { ...q, text } : q)) } : p))
    );

  /* -------- Options ops -------- */
  const addOption = (pId, qId) =>
    setPassages((ps) =>
      ps.map((p) =>
        p.id === pId
          ? {
              ...p,
              questions: p.questions.map((q) =>
                q.id === qId ? { ...q, options: [...q.options, { latex: "", explanation: "", images: [] }] } : q
              ),
            }
          : p
      )
    );

  const removeOption = (pId, qId, optIndex) =>
    setPassages((ps) =>
      ps.map((p) => {
        if (p.id !== pId) return p;
        return {
          ...p,
          questions: p.questions.map((q) => {
            if (q.id !== qId) return q;
            if (q.options.length <= 2) return q;
            const nextOpts = q.options.filter((_, i) => i !== optIndex);
            let nextCorrect = q.correctIndex;
            if (optIndex <= q.correctIndex) nextCorrect = Math.max(0, nextCorrect - 1);
            if (nextCorrect >= nextOpts.length) nextCorrect = nextOpts.length - 1;
            return { ...q, options: nextOpts, correctIndex: nextCorrect };
          }),
        };
      })
    );

  const updateOptionField = (pId, qId, optIndex, field, value) =>
    setPassages((ps) =>
      ps.map((p) =>
        p.id === pId
          ? {
              ...p,
              questions: p.questions.map((q) => {
                if (q.id !== qId) return q;
                const next = q.options.map((opt, i) => (i === optIndex ? { ...opt, [field]: value } : opt));
                return { ...q, options: next };
              }),
            }
          : p
      )
    );

  const addOptionImages = (pId, qId, optIndex, files) =>
    setPassages((ps) =>
      ps.map((p) =>
        p.id === pId
          ? {
              ...p,
              questions: p.questions.map((q) => {
                if (q.id !== qId) return q;
                const next = q.options.map((opt, i) =>
                  i === optIndex ? { ...opt, images: [...(opt.images || []), ...files] } : opt
                );
                return { ...q, options: next };
              }),
            }
          : p
      )
    );

  const removeOptionImage = (pId, qId, optIndex, imgIdx) =>
    setPassages((ps) =>
      ps.map((p) =>
        p.id === pId
          ? {
              ...p,
              questions: p.questions.map((q) => {
                if (q.id !== qId) return q;
                const next = q.options.map((opt, i) =>
                  i === optIndex ? { ...opt, images: (opt.images || []).filter((_, k) => k !== imgIdx) } : opt
                );
                return { ...q, options: next };
              }),
            }
          : p
      )
    );

  const setCorrectIndex = (pId, qId, idx) =>
    setPassages((ps) =>
      ps.map((p) =>
        p.id === pId ? { ...p, questions: p.questions.map((q) => (q.id === qId ? { ...q, correctIndex: idx } : q)) } : p
      )
    );

  const isPassage = mcqSubType === "passage";
  const isChemical = mcqSubType === "chemical";
  const isMath = mcqSubType === "math" || mcqSubType === "chemical";

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-gray-900">
          {isPassage
            ? "إدارة القطع وأسئلتها"
            : isMath
            ? "أسئلة معادلات — الإجابات معادلات + دعم مرفقات صور/PDF"
            : "أسئلة (وصف/تعليمات عامة)"}
        </h4>
        {isPassage && (
          <button
            type="button"
            onClick={addPassage}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm hover:bg-gray-50"
          >
            <PlusIcon className="h-4 w-4" />
            إضافة قطعة
          </button>
        )}
      </div>

      {passages.map((p, pIndex) => {
        const questionsCount = p.questions?.length || 0;
        return (
          <div key={p.id} className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b bg-gray-50 px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="text-sm font-semibold text-gray-800">
                  {isPassage ? `قطعة ${pIndex + 1}` : isMath ? `معادلة ${pIndex + 1}` : `وصف عام ${pIndex + 1}`}
                </div>
                <span className="rounded-full border border-blue-100 bg-blue-50 px-2 py-0.5 text-[11px] text-blue-700">
                  {questionsCount} سؤال
                </span>
              </div>

              <button
                type="button"
                onClick={() => removePassage(p.id)}
                className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-sm text-red-600 hover:bg-red-50 hover:text-red-700"
                title="حذف"
              >
                <Trash2 className="h-4 w-4" /> حذف
              </button>
            </div>

            {/* Passage content */}
            <div className="space-y-4 p-4">
              {isChemical ? (
                <>
                  <label className="block text-xs font-semibold text-gray-600">معادلات/صيغ عامة</label>
                  <MathFieldInput
                    value={p.content}
                    onChange={(latex) => updatePassageContent(p.id, latex)}
                    className="w-full"
                    options={{ virtualKeyboardMode: "onfocus" }}
                    placeholder="أدخل المعادلات/الصيغ العامة هنا…"
                  />
                </>
              ) : isMath ? (
                <>
                  <label className="block text-xs font-semibold text-gray-600">المعادلة</label>
                  <MathFieldInput
                    value={p.content}
                    onChange={(latex) => updatePassageContent(p.id, latex)}
                    className="w-full"
                    options={{ virtualKeyboardMode: "onfocus" }}
                    placeholder="أدخل المعادلة هنا…"
                  />
                  <AttachmentPicker
                    label="مرفقات المعادلة (صور / PDF)"
                    files={p.attachments || []}
                    onAddFiles={(files) => addPassageFiles(p.id, files)}
                    onRemoveFile={(idx) => removePassageFile(p.id, idx)}
                    accept="application/pdf,image/*"
                    multiple
                  />
                </>
              ) : (
                <LabeledEditor
                  label={isPassage ? "نص القطعة" : "وصف/تعليمات عامة (اختياري)"}
                  value={p.content}
                  onChange={(value) => updatePassageContent(p.id, value)}
                  editorMinH={140}
                  uploadImage={uploadImage}
                  imageSize={FIXED_IMG}
                />
              )}
            </div>

            {/* Questions */}
            <div className="p-4 pt-0">
              {isPassage && (
                <div className="mb-3 flex items-center justify-between">
                  <div className="text-sm font-semibold text-gray-700">أسئلة هذه القطعة</div>
                  <button
                    type="button"
                    onClick={() => addQuestion(p.id)}
                    className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm hover:bg-gray-50"
                  >
                    <PlusIcon className="h-4 w-4" /> إضافة سؤال
                  </button>
                </div>
              )}

              <div className="space-y-4">
                {p.questions.map((q, qIndex) => (
                  <div key={q.id} className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                    {isPassage && (
                      <div className="mb-3 flex items-center justify-between">
                        <div className="text-sm font-medium text-gray-800">سؤال {qIndex + 1}</div>
                        <button
                          type="button"
                          onClick={() => removeQuestion(p.id, q.id)}
                          className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-red-600 hover:bg-red-50 hover:text-red-700"
                          title="حذف السؤال"
                        >
                          <Trash2 className="h-4 w-4" /> حذف
                        </button>
                      </div>
                    )}

                    {isPassage && (
                      <LabeledEditor
                        label="نص السؤال"
                        value={q.text}
                        onChange={(val) => updateQuestionText(p.id, q.id, val)}
                        editorMinH={110}
                        uploadImage={uploadImage}
                        imageSize={FIXED_IMG}
                      />
                    )}

                    {/* الخيارات */}
                    <div className="mt-4 space-y-3">
                      <div className="text-xs font-semibold text-gray-700">
                        الاختيارات{isMath ? " (تُكتب كمعادلات) + مرفقات صور/PDF" : ""}
                      </div>

                      {q.options.map((opt, optIndex) => {
                        const isCorrect = q.correctIndex === optIndex;
                        const letter = String.fromCharCode(65 + optIndex);
                        return (
                          <div
                            key={optIndex}
                            className={`flex flex-col gap-3 rounded-xl border bg-white p-3 shadow-sm transition ${
                              isCorrect ? "ring-1 ring-green-200" : "ring-1 ring-transparent"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <span
                                className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                                  isCorrect ? "bg-green-600 text-white" : "bg-gray-100 text-gray-700"
                                }`}
                              >
                                {letter}
                              </span>

                              <label className="flex items-center gap-2 text-xs font-medium text-gray-600">
                                <input
                                  type="radio"
                                  name={`correct-${p.id}-${q.id}`}
                                  checked={isCorrect}
                                  onChange={() => setCorrectIndex(p.id, q.id, optIndex)}
                                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                                  title="الإجابة الصحيحة"
                                />
                                إجابة صحيحة
                              </label>

                              {q.options.length > 2 && (
                                <button
                                  type="button"
                                  onClick={() => removeOption(p.id, q.id, optIndex)}
                                  className="ml-auto rounded-lg px-2 py-1 text-xs text-red-600 hover:bg-red-50 hover:text-red-800"
                                  title="حذف الاختيار"
                                >
                                  حذف
                                </button>
                              )}
                            </div>

                            {/* محتوى الاختيار */}
                            {isMath ? (
                              <>
                                <div className="space-y-2">
                                  <label className="block text-xs font-semibold text-gray-600">معادلة الاختيار</label>
                                  <MathFieldInput
                                    value={opt.latex}
                                    onChange={(latex) => updateOptionField(p.id, q.id, optIndex, "latex", latex)}
                                    placeholder="مثال: \\frac{a+b}{c}"
                                    className="w-full"
                                    options={{ virtualKeyboardMode: "onfocus" }}
                                  />
                                </div>

                                {/* مرفقات الاختيار: صور + PDF */}
                                <AttachmentPicker
                                  label="مرفقات الاختيار (صور / PDF)"
                                  files={opt.images || []}
                                  onAddFiles={(files) => addOptionImages(p.id, q.id, optIndex, files)}
                                  onRemoveFile={(idx) => removeOptionImage(p.id, q.id, optIndex, idx)}
                                  accept="application/pdf,image/*"
                                  multiple
                                />
                              </>
                            ) : (
                              <LabeledEditor
                                label="نص الاختيار"
                                value={opt.latex}
                                onChange={(val) => updateOptionField(p.id, q.id, optIndex, "latex", val)}
                                editorMinH={90}
                                uploadImage={uploadImage}
                                imageSize={FIXED_IMG}
                              />
                            )}

                            {/* شرح الاختيار */}
                            <LabeledEditor
                              label="شرح الاختيار (لماذا هو صحيح/خاطئ)"
                              value={opt.explanation}
                              onChange={(value) => updateOptionField(p.id, q.id, optIndex, "explanation", value)}
                              editorMinH={90}
                              uploadImage={uploadImage}
                              imageSize={FIXED_IMG}
                            />
                          </div>
                        );
                      })}

                      <button
                        type="button"
                        onClick={() => addOption(p.id, q.id)}
                        className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs shadow-sm hover:bg-gray-50"
                      >
                        <PlusIcon className="h-4 w-4" /> إضافة خيار
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
