"use client";
import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import dynamic from "next/dynamic";
import { PlusIcon, Trash2, Paperclip, Image as ImageIcon } from "lucide-react";

// IMPORTANT: load MathLive CSS once globally in app/layout.tsx or pages/_app.tsx
// import "mathlive/core.css";
// import "mathlive/static.css";

// SSR-safe import for ReactQuill
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

/* ================== ثابت عام لحجم الصور داخل كل المحررات ================== */
const FIXED_IMG = {
  width: 320,    // عدّل المقاسات كما يلزمك
  height: 200,
  objectFit: "contain",
};

/* ===================== Small helper: file -> data URL (fallback uploader) ===================== */
async function fileToDataUrl(file) {
  if (!file) return "";
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onerror = reject;
    reader.onload = () => resolve(String(reader.result || ""));
    reader.readAsDataURL(file);
  });
}

/* ===================== MathLive Wrapper (Arabic keyboard) ===================== */
function MathFieldInput({
  value = "",
  onChange,
  className = "",
  options = { virtualKeyboardMode: "onfocus" }, // تظهر اللوحة عند التركيز
  placeholder = "أدخل المعادلة (LaTeX)…",
  arabic = true, // تفعيل الكيبورد العربي
}) {
  const hostRef = useRef(null);
  const mfRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (typeof window === "undefined") return;

      const mathlive = await import("mathlive");
      const MathfieldElement = mathlive.MathfieldElement || window.MathfieldElement;
      const setOptions = mathlive.setOptions || MathfieldElement?.setOptions;

      if (!MathfieldElement || !hostRef.current || !mounted) return;

      // ==== Custom Arabic virtual keyboard (tab name: "عربي") ====
      const customVirtualKeyboardLayers = {
        "arabic-base": {
          rows: [
            [
              { label: "١", insert: "1" },
              { label: "٢", insert: "2" },
              { label: "٣", insert: "3" },
              { label: "٤", insert: "4" },
              { label: "٥", insert: "5" },
              { label: "٦", insert: "6" },
              { label: "٧", insert: "7" },
              { label: "٨", insert: "8" },
              { label: "٩", insert: "9" },
              { label: "٠", insert: "0" },
            ],
            [
              { label: "＋", insert: "+" },
              { label: "−", insert: "-" },
              { label: "×", insert: "\\times " },
              { label: "÷", insert: "\\div " },
              { label: "=", insert: "=" },
              { label: "≈", insert: "\\approx " },
              { label: "≠", insert: "\\neq " },
            ],
            [
              { label: "جذر", insert: "\\sqrt{}" },
              { label: "كسر", insert: "\\frac{}{}" },
              { label: "أس", insert: "^{ }" },
              { label: "أسفل", insert: "_{ }" },
              { label: "∞", insert: "\\infty " },
              { label: "π", insert: "\\pi " },
              { label: "θ", insert: "\\theta " },
            ],
            [
              { label: "sin", insert: "\\sin " },
              { label: "cos", insert: "\\cos " },
              { label: "tan", insert: "\\tan " },
              { label: "log", insert: "\\log " },
              { label: "ln", insert: "\\ln " },
              { label: "abs", insert: "\\left|\\,\\right|" },
              { label: "()", insert: "\\left(\\,\\right)" },
              { label: "[]", insert: "\\left[\\,\\right]" },
              { label: "{}", insert: "\\left\\{\\,\\right\\}" },
            ],
          ],
        },
      };

      const customVirtualKeyboards = {
        "arabic-math": {
          label: "عربي",
          layers: "arabic-base",
        },
      };

      const inlineShortcuts = {
        جذر: "\\sqrt{}",
        كسر: "\\frac{}{}",
        باي: "\\pi",
        مالانهاية: "\\infty",
        تق: "\\tan",
        جيب: "\\sin",
        جتا: "\\cos",
        لوغ: "\\log",
        لان: "\\ln",
      };

      try {
        setOptions?.({ customVirtualKeyboardLayers, customVirtualKeyboards });
      } catch {}

      const mf = new MathfieldElement({
        smartMode: false,
        virtualKeyboardMode: options?.virtualKeyboardMode ?? "onfocus",
        virtualKeyboards: arabic
          ? "arabic-math numeric symbols functions"
          : "numeric symbols functions",
        locale: arabic ? "ar" : "en",
        textDirection: "rtl",
        virtualKeyboardLayout: "auto",
        inlineShortcuts,
        ...(options || {}),
      });

      if (placeholder) mf.setAttribute("aria-label", placeholder);
      mf.setAttribute("dir", "rtl");
      mf.style.textAlign = "right";

      if (typeof mf.setValue === "function") mf.setValue(value || "");
      else mf.value = value || "";

      const handleInput = () => {
        const latex = typeof mf.getValue === "function" ? mf.getValue("latex") : mf.value || "";
        onChange?.(latex);
      };
      mf.addEventListener("input", handleInput);

      mf.addEventListener("focus", () => {
        try { mf.executeCommand?.("showVirtualKeyboard"); } catch {}
        try { mf.executeCommand?.("switchKeyboardLayer", "arabic-base"); } catch {}
        try { window.mathVirtualKeyboard?.switchKeyboardLayer?.("arabic-base"); } catch {}
      });

      hostRef.current.innerHTML = "";
      hostRef.current.appendChild(mf);
      mfRef.current = mf;
    })();

    return () => {
      const mf = mfRef.current;
      if (mf) {
        try { mf.remove(); } catch {}
        mfRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const mf = mfRef.current;
    if (!mf) return;
    const current = typeof mf.getValue === "function" ? mf.getValue("latex") : mf.value || "";
    if ((value || "") !== (current || "")) {
      if (typeof mf.setValue === "function") mf.setValue(value || "");
      else mf.value = value || "";
    }
  }, [value]);

  return (
    <div
      ref={hostRef}
      className={`min-h-[48px] px-3 py-2 border border-gray-200 rounded-xl bg-white shadow-sm focus-within:ring-2 focus-within:ring-blue-500/20 ${className}`}
    />
  );
}

/* ================= Shared Quill config + labeled wrapper (with image upload) ================= */
const baseQuillModules = (onImage) => ({
  toolbar: {
    container: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ direction: "rtl" }, { align: [] }],
      ["link", "image", "clean"],
    ],
    handlers: {
      image: () => onImage && onImage(),
    },
  },
  clipboard: { matchVisual: false },
});

const quillFormats = [
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

const LabeledEditor = ({
  label,
  hint,
  value,
  onChange,
  placeholder = "اكتب هنا…",
  editorMinH = 140,
  uploadImage, // optional async (file) => url
  imageSize = FIXED_IMG, // NEW: تمرير حجم ثابت (يُمكن تغييره من الأعلى)
}) => {
  const quillRef = useRef(null);
  const fileRef = useRef(null);

  const openPicker = useCallback(() => fileRef.current?.click(), []);
  const modules = useMemo(() => baseQuillModules(openPicker), [openPicker]);

  // فرض حجم ثابت لكل الصور داخل هذا المحرر
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

        // طبّق المقاس على الصورة التي تم إدراجها للتو
        requestAnimationFrame(() => {
          const root = editor.root;
          try {
            // CSS.escape قد لا يتوفر في كل البيئات – لذا نغلف بـ try/catch
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

  // أعِد تطبيق المقاس بعد أي تعديل/لصق/سحب
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
        {hint ? (
          <span className="text-[11px] text-gray-400">{hint}</span>
        ) : (
          <button
            type="button"
            onClick={openPicker}
            className="inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded-lg border border-gray-200 bg-white hover:bg-gray-50"
          >
            <ImageIcon className="w-4 h-4" /> أدرج صورة
          </button>
        )}
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
          formats={quillFormats}
          placeholder={placeholder}
        />
      </div>

      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFiles} />

      <style jsx global>{`
        [dir="rtl"] .ql-editor { direction: rtl; text-align: right; min-height: ${editorMinH}px; }
        .ql-toolbar.ql-snow { border: 0; border-bottom: 1px solid #e5e7eb; background: #fafafa; }
        .ql-container.ql-snow { border: 0; }
        /* شبكة أمان عامة: أي صورة داخل أي محرر Quill ستكون بالحجم الثابت */
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

/* ================= Reusable Attachments Picker ================= */
function AttachmentPicker({
  label = "مرفقات",
  files = [],
  onAddFiles,
  onRemoveFile,
  accept =
    "application/pdf,image/*,video/*,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,.zip,.rar,.7z",
  multiple = true,
  inputId,
}) {
  const inputRef = useRef(null);

  const handlePick = () => inputRef.current?.click();
  const handleChange = (e) => {
    const list = Array.from(e.target.files || []);
    if (list.length && onAddFiles) onAddFiles(list);
    e.target.value = "";
  };

  const formatSize = (bytes = 0) => {
    if (bytes < 1024) return `${bytes} B`;
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    const mb = kb / 1024;
    return `${mb.toFixed(1)} MB`;
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-gray-700">{label}</label>
        <button
          type="button"
          onClick={handlePick}
          className="inline-flex items-center gap-2 px-3 py-2 text-xs rounded-xl border border-gray-200 bg-white hover:bg-gray-50 shadow-sm"
        >
          <Paperclip className="w-4 h-4" /> اختر ملفات
        </button>
      </div>

      <input
        ref={inputRef}
        id={inputId}
        type="file"
        multiple={multiple}
        accept={accept}
        onChange={handleChange}
        className="hidden"
      />

      {files?.length ? (
        <ul className="space-y-2">
          {files.map((f, idx) => (
            <li key={`${f.name}-${idx}`} className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm">
              <div className="min-w-0">
                <div className="truncate font-medium text-gray-800">{f.name}</div>
                <div className="text-xs text-gray-500">{formatSize(f.size)}</div>
              </div>
              <button
                type="button"
                onClick={() => onRemoveFile?.(idx)}
                className="ml-3 inline-flex items-center gap-1 text-xs px-2 py-1 rounded-lg text-red-600 hover:bg-red-50"
                title="حذف الملف"
              >
                <Trash2 className="w-4 h-4" /> حذف
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-xs text-gray-500">مسموح: PDF، صور، فيديو، Word، Excel، PowerPoint، ZIP/RAR/7z</p>
      )}
    </div>
  );
}

/* ================= McqSharedPassageEditor ================== */
export default function McqSharedPassageEditor({
  mcqSubType = "passage", // "passage" | "chemical" | "math"
  initialData = [],
  onPassagesChange,
  uploadImage, // optional async (file) => url for rich text editors
}) {
  /* -------- Helpers -------- */
  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

  // MathLive answers (options) shape
  const toOptionObject = (opt) => {
    if (typeof opt === "string") return { latex: "", explanation: "" };
    if (opt && typeof opt === "object") return { latex: opt.latex || "", explanation: opt.explanation || "" };
    return { latex: "", explanation: "" };
  };

  const createQuestion = () => ({
    id: uid(),
    text: "", // نص السؤال (Rich Text)
    options: [toOptionObject(""), toOptionObject("")],
    correctIndex: 0,
    attachments: [],
  });

  const createPassage = () => ({
    id: uid(),
    content: "", // نص القطعة/الوصف
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
          Array.isArray(q.options) && q.options.length >= 2 ? q.options.map(toOptionObject) : [toOptionObject(""), toOptionObject("")];
        return {
          id: q.id || uid(),
          text: q.text || "",
          options: opts,
          correctIndex:
            typeof q.correctIndex === "number" && q.correctIndex >= 0 && q.correctIndex < (opts?.length || 0) ? q.correctIndex : 0,
          attachments: Array.isArray(q.attachments) ? q.attachments : [],
        };
      }),
    }));

  /* -------- State -------- */
  const [passages, setPassages] = useState(() => (initialData?.length ? normalize(initialData) : [createPassage()]));

  useEffect(() => {
    onPassagesChange?.(passages);
  }, [passages, onPassagesChange]);

  /* -------- Passage ops -------- */
  const addPassage = () => setPassages((ps) => [...ps, createPassage()]);
  const removePassage = (pId) => setPassages((ps) => (ps.length > 1 ? ps.filter((p) => p.id !== pId) : ps));
  const updatePassageContent = (pId, content) => setPassages((ps) => ps.map((p) => (p.id === pId ? { ...p, content } : p)));
  const addPassageFiles = (pId, files) => setPassages((ps) => ps.map((p) => (p.id === pId ? { ...p, attachments: [...(p.attachments || []), ...files] } : p)));
  const removePassageFile = (pId, fileIdx) => setPassages((ps) => ps.map((p) => (p.id === pId ? { ...p, attachments: p.attachments.filter((_, i) => i !== fileIdx) } : p)));

  /* -------- Question ops -------- */
  const addQuestion = (pId) => setPassages((ps) => ps.map((p) => (p.id === pId ? { ...p, questions: [...p.questions, createQuestion()] } : p)));
  const removeQuestion = (pId, qId) =>
    setPassages((ps) =>
      ps.map((p) =>
        p.id === pId ? { ...p, questions: p.questions.length > 1 ? p.questions.filter((q) => q.id !== qId) : p.questions } : p
      )
    );
  const updateQuestionText = (pId, qId, text) =>
    setPassages((ps) =>
      ps.map((p) => (p.id === pId ? { ...p, questions: p.questions.map((q) => (q.id === qId ? { ...q, text } : q)) } : p))
    );

  const addQuestionFiles = (pId, qId, files) =>
    setPassages((ps) =>
      ps.map((p) =>
        p.id === pId
          ? { ...p, questions: p.questions.map((q) => (q.id === qId ? { ...q, attachments: [...(q.attachments || []), ...files] } : q)) }
          : p
      )
    );
  const removeQuestionFile = (pId, qId, fileIdx) =>
    setPassages((ps) =>
      ps.map((p) =>
        p.id === pId
          ? { ...p, questions: p.questions.map((q) => (q.id === qId ? { ...q, attachments: q.attachments.filter((_, i) => i !== fileIdx) } : q)) }
          : p
      )
    );

  /* -------- Options ops -------- */
  const addOption = (pId, qId) =>
    setPassages((ps) =>
      ps.map((p) =>
        p.id === pId ? { ...p, questions: p.questions.map((q) => (q.id === qId ? { ...q, options: [...q.options, { latex: "", explanation: "" }] } : q)) } : p
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

  const setCorrectIndex = (pId, qId, idx) =>
    setPassages((ps) =>
      ps.map((p) => (p.id === pId ? { ...p, questions: p.questions.map((q) => (q.id === qId ? { ...q, correctIndex: idx } : q)) } : p))
    );

  const isPassage = mcqSubType === "passage";
  const isChemical = mcqSubType === "chemical";
  const isMath = mcqSubType === "math";

  return (
    <div className="space-y-6" dir="rtl">
      {/* top header */}
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-gray-900">
          {isPassage ? "إدارة القطع وأسئلتها" : isMath ? "أسئلة معادلات — الإجابات كلها بمعادلات (MathLive)" : "أسئلة (وصف/معادلات عامة للقطعة)"}
        </h4>
      </div>

      {passages.map((p, pIndex) => {
        const questionsCount = p.questions?.length || 0;
        return (
          <div key={p.id} className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="text-sm font-semibold text-gray-800">{isPassage ? `قطعة ${pIndex + 1}` : `معادلة ${pIndex + 1}`}</div>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">{questionsCount} سؤال</span>
              </div>

              <button
                type="button"
                onClick={() => removePassage(p.id)}
                className="text-red-600 hover:text-red-700 inline-flex items-center gap-1 text-sm px-2 py-1 rounded-lg hover:bg-red-50"
                title="حذف"
              >
                <Trash2 className="w-4 h-4" /> حذف
              </button>
            </div>

            {/* Passage content */}
            <div className="p-4 space-y-4">
              {isChemical ? (
                <>
                  <label className="block text-xs font-semibold text-gray-600">معادلات/صيغ عامة</label>
                  <MathFieldInput
                    arabic={true}
                    value={p.content}
                    onChange={(latex) => updatePassageContent(p.id, latex)}
                    className="w-full"
                    options={{ virtualKeyboardMode: "onfocus" }}
                    placeholder="أدخل المعادلات/الصيغ العامة هنا…"
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
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm font-semibold text-gray-700">أسئلة هذه القطعة</div>

                  <button
                    type="button"
                    onClick={() => addQuestion(p.id)}
                    className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded-xl border border-gray-200 bg-white hover:bg-gray-50 shadow-sm"
                  >
                    <PlusIcon className="w-4 h-4" /> إضافة سؤال
                  </button>
                </div>
              )}

              <div className="space-y-4">
                {p.questions.map((q, qIndex) => (
                  <div key={q.id} className="rounded-xl border border-gray-200 p-4 bg-gray-50">
                    {/* Question header */}
                    {isPassage && (
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-sm font-medium text-gray-800">سؤال {qIndex + 1}</div>
                        <button
                          type="button"
                          onClick={() => removeQuestion(p.id, q.id)}
                          className="text-red-600 hover:text-red-700 inline-flex items-center gap-1 text-xs px-2 py-1 rounded-lg hover:bg-red-50"
                          title="حذف السؤال"
                        >
                          <Trash2 className="w-4 h-4" /> حذف
                        </button>
                      </div>
                    )}

                    {/* Question stem (Rich Text with images) */}
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

                    {/* Options */}
                    <div className="space-y-3 mt-4">
                      <div className="text-xs text-gray-700 font-semibold">الاختيارات{isMath ? " (معادلات)" : ""}</div>

                      {q.options.map((opt, optIndex) => {
                        const isCorrect = q.correctIndex === optIndex;
                        const letter = String.fromCharCode(65 + optIndex);
                        return (
                          <div
                            key={optIndex}
                            className={`flex flex-col gap-3 rounded-xl border p-3 bg-white shadow-sm transition ${
                              isCorrect ? "ring-1 ring-green-200" : "ring-1 ring-transparent"
                            }`}
                          >
                            {/* Top bar */}
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
                                  className="ml-auto px-2 py-1 text-red-600 hover:text-red-800 text-xs rounded-lg hover:bg-red-50"
                                  title="حذف الاختيار"
                                >
                                  حذف
                                </button>
                              )}
                            </div>

                            {/* Option content: Math or Rich Text */}
                            {isMath ? (
                              <div className="space-y-2">
                                <label className="block text-xs font-semibold text-gray-600">معادلة الاختيار</label>
                                <MathFieldInput
                                  value={opt.latex}
                                  onChange={(latex) => updateOptionField(p.id, q.id, optIndex, "latex", latex)}
                                  placeholder="مثال: \\\frac{a+b}{c}"
                                  className="w-full"
                                  options={{ virtualKeyboardMode: "onfocus" }}
                                />
                              </div>
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

                            {/* Explanation */}
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
                        className="inline-flex items-center gap-2 px-3 py-2 text-xs rounded-xl border border-gray-200 bg-white hover:bg-gray-50 shadow-sm"
                      >
                        <PlusIcon className="w-4 h-4" /> إضافة خيار
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
