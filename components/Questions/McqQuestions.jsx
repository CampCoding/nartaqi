"use client";
import React, { useEffect, useRef, useState } from "react";
import { PlusIcon, Trash2 } from "lucide-react";

/* ===================== MathLive Wrapper ===================== */
function MathFieldInput({
  value = "",
  onChange,
  className = "",
  options = { virtualKeyboardMode: "manual" },
}) {
  const hostRef = useRef(null);
  const mfRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (typeof window === "undefined") return;
      if (!window.MathfieldElement) {
        await import("mathlive");
      }
      if (!mounted || !hostRef.current) return;

      const mf = new window.MathfieldElement({
        virtualKeyboardMode: "manual",
        smartMode: false,
        ...(options || {}),
      });

      if (typeof mf.setValue === "function") mf.setValue(value || "");
      else mf.value = value || "";

      const handleInput = () => {
        const latex =
          typeof mf.getValue === "function"
            ? mf.getValue("latex")
            : mf.value || "";
        onChange?.(latex);
      };

      mf.addEventListener("input", handleInput);
      hostRef.current.innerHTML = "";
      hostRef.current.appendChild(mf);
      mfRef.current = mf;
    })();

    return () => {
      mounted = false;
      const mf = mfRef.current;
      if (mf) {
        try {
          mf.remove();
        } catch {}
        mfRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const mf = mfRef.current;
    if (!mf) return;
    const current =
      typeof mf.getValue === "function" ? mf.getValue("latex") : mf.value || "";
    if ((value || "") !== (current || "")) {
      if (typeof mf.setValue === "function") mf.setValue(value || "");
      else mf.value = value || "";
    }
  }, [value]);

  return <div ref={hostRef} className={className} />;
}

/* ================= McqSharedPassageEditor ================== */
export default function McqSharedPassageEditor({
  mcqSubType = "passage",
  initialData = [],
  onPassagesChange,
}) {
  /* -------- Helpers -------- */
  const uid = () =>
    Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

  const createQuestion = () => ({
    id: uid(),
    text: "",
    options: ["", ""],
    correctIndex: 0,
  });

  const createPassage = () => ({
    id: uid(),
    content: "",
    questions: [createQuestion()],
  });

  const normalize = (arr) =>
    (arr || []).map((p) => ({
      id: p.id || uid(),
      content: p.content || "",
      questions: (p.questions || []).map((q) => ({
        id: q.id || uid(),
        text: q.text || "",
        options:
          Array.isArray(q.options) && q.options.length >= 2
            ? q.options
            : ["", ""],
        correctIndex:
          typeof q.correctIndex === "number" &&
          q.correctIndex >= 0 &&
          q.correctIndex < (q.options?.length || 0)
            ? q.correctIndex
            : 0,
      })),
    }));

  /* -------- State -------- */
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
    setPassages((ps) =>
      ps.map((p) => (p.id === pId ? { ...p, content } : p))
    );

  /* -------- Question ops -------- */
  const addQuestion = (pId) =>
    setPassages((ps) =>
      ps.map((p) =>
        p.id === pId
          ? { ...p, questions: [...p.questions, createQuestion()] }
          : p
      )
    );

  const removeQuestion = (pId, qId) =>
    setPassages((ps) =>
      ps.map((p) =>
        p.id === pId
          ? {
              ...p,
              questions:
                p.questions.length > 1
                  ? p.questions.filter((q) => q.id !== qId)
                  : p.questions,
            }
          : p
      )
    );

  const updateQuestionText = (pId, qId, text) =>
    setPassages((ps) =>
      ps.map((p) =>
        p.id === pId
          ? {
              ...p,
              questions: p.questions.map((q) =>
                q.id === qId ? { ...q, text } : q
              ),
            }
          : p
      )
    );

  /* -------- Options ops -------- */
  const addOption = (pId, qId) =>
    setPassages((ps) =>
      ps.map((p) =>
        p.id === pId
          ? {
              ...p,
              questions: p.questions.map((q) =>
                q.id === qId ? { ...q, options: [...q.options, ""] } : q
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

  const updateOption = (pId, qId, optIndex, value) =>
    setPassages((ps) =>
      ps.map((p) =>
        p.id === pId
          ? {
              ...p,
              questions: p.questions.map((q) => {
                if (q.id !== qId) return q;
                const next = [...q.options];
                next[optIndex] = value;
                return { ...q, options: next };
              }),
            }
          : p
      )
    );

  const setCorrectIndex = (pId, qId, idx) =>
    setPassages((ps) =>
      ps.map((p) =>
        p.id === pId
          ? {
              ...p,
              questions: p.questions.map((q) =>
                q.id === qId ? { ...q, correctIndex: idx } : q
              ),
            }
          : p
      )
    );

  const isPassage = mcqSubType === "passage";
  const isChemical = mcqSubType === "chemical";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-gray-900">
          {isPassage ? "إدارة القطع وأسئلتها" : "أسئلة المعادلات (نص السؤال والاختيارات نص عادي)"}
        </h4>
        <button
          type="button"
          onClick={addPassage}
          className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded-lg border border-gray-200 hover:bg-gray-50"
        >
          <PlusIcon className="w-4 h-4" />
          {isPassage ? "إضافة قطعة" : "إضافة مجموعة أسئلة"}
        </button>
      </div>

      {passages.map((p, pIndex) => (
        <div key={p.id} className="border rounded-xl bg-white shadow-sm">
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <div className="text-sm font-semibold text-gray-800">
              {isPassage ? `قطعة ${pIndex + 1}` : `مجموعة ${pIndex + 1}`}
            </div>
            <button
              type="button"
              onClick={() => removePassage(p.id)}
              className="text-red-600 hover:text-red-700 inline-flex items-center gap-1 text-sm"
              title="حذف"
            >
              <Trash2 className="w-4 h-4" />
              حذف
            </button>
          </div>

          {/* Passage content */}
          <div className="p-4 space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              {isPassage ? "نص القطعة" : "وصف/معادلات عامة (LaTeX اختياري)"}
            </label>

            {isChemical ? (
              // نُبقي MathLive فقط على مستوى وصف المجموعة (اختياري)
              <MathFieldInput
                value={p.content}
                onChange={(latex) => updatePassageContent(p.id, latex)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                options={{ virtualKeyboardMode: "manual" }}
              />
            ) : (
              <textarea
                value={p.content}
                onChange={(e) => updatePassageContent(p.id, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={isPassage ? 4 : 3}
                placeholder={
                  isPassage
                    ? "أدخل نص القطعة هنا..."
                    : "اكتب وصفًا عامًا أو معادلات ستتكرر داخل أسئلة هذه المجموعة (اختياري)..."
                }
              />
            )}
          </div>

          {/* Questions of this passage */}
          <div className="p-4 pt-0">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-semibold text-gray-700">
                أسئلة هذه {isPassage ? "القطعة" : "المجموعة"}
              </div>
              <button
                type="button"
                onClick={() => addQuestion(p.id)}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded-lg border border-gray-200 hover:bg-gray-50"
              >
                <PlusIcon className="w-4 h-4" />
                إضافة سؤال
              </button>
            </div>

            <div className="space-y-4">
              {p.questions.map((q, qIndex) => (
                <div key={q.id} className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-medium text-gray-800">
                      سؤال {qIndex + 1}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeQuestion(p.id, q.id)}
                      className="text-red-600 hover:text-red-700 inline-flex items-center gap-1 text-xs"
                      title="حذف السؤال"
                    >
                      <Trash2 className="w-4 h-4" />
                      حذف
                    </button>
                  </div>

                  {/* السؤال — نص عادي حتى في "chemical" */}
                  <input
                    type="text"
                    value={q.text}
                    onChange={(e) => updateQuestionText(p.id, q.id, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
                    placeholder="نص السؤال"
                  />

                  {/* الاختيارات — نص عادي حتى في "chemical" */}
                  <div className="space-y-2">
                    <div className="text-xs text-gray-700 font-medium">الاختيارات</div>

                    {q.options.map((opt, optIndex) => (
                      <div key={optIndex} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={`correct-${p.id}-${q.id}`}
                          checked={q.correctIndex === optIndex}
                          onChange={() => setCorrectIndex(p.id, q.id, optIndex)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                          title="الإجابة الصحيحة"
                        />

                        <input
                          type="text"
                          value={opt}
                          onChange={(e) =>
                            updateOption(p.id, q.id, optIndex, e.target.value)
                          }
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder={`الخيار ${optIndex + 1}`}
                        />

                        {q.options.length > 2 && (
                          <button
                            type="button"
                            onClick={() => removeOption(p.id, q.id, optIndex)}
                            className="p-2 text-red-600 hover:text-red-800"
                            title="حذف الخيار"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() => addOption(p.id, q.id)}
                      className="inline-flex items-center gap-2 px-3 py-2 text-xs rounded-lg border border-gray-200 hover:bg-gray-50"
                    >
                      <PlusIcon className="w-4 h-4" />
                      إضافة خيار
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
