"use client";

import {
  Button,
  Card,
  Segmented,
  Space,
  Input,
  Radio,
  Tag,
  Typography,
  Tooltip,
  Modal,
  Checkbox, // ⬅️ NEW
} from "antd";
import {
  CheckCircle2,
  FileText,
  FlaskConical,
  HelpCircle,
  ListChecks,
  Save,
  Trash2,
} from "lucide-react";
import dynamic from "next/dynamic";
import { useMemo, useRef, useState, useEffect } from "react";
import {
  DeleteOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
  BulbOutlined,
  EditOutlined,
} from "@ant-design/icons";
import "react-quill-new/dist/quill.snow.css";
// import "mathlive/core.css";
// import "mathlive/static.css";

const { Title, Text } = Typography;

const uid = () => `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;

const ReactQuill = dynamic(
  () => import("react-quill-new").then((m) => m.default),
  { ssr: false }
);

/* ================= Quill ================= */
const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ align: [] }],
    ["link", "blockquote", "code-block", "image"],
    ["clean"],
  ],
};
const quillFormats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "list",
  "bullet",
  "align",
  "link",
  "blockquote",
  "code-block",
  "image",
];

const EnhancedQuillEditor = ({ value, onChange, placeholder, className = "" }) => (
  <div
    className={`border border-gray-200 rounded-xl overflow-hidden bg-white hover:border-gray-300 transition-colors ${className}`}
  >
    <ReactQuill
      theme="snow"
      modules={quillModules}
      formats={quillFormats}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      style={{ minHeight: "120px", border: "none" }}
    />
  </div>
);

/* ================= MathLive ================= */
function MathFieldInput({
  value = "",
  onChange,
  className = "",
  options = { virtualKeyboardMode: "onfocus" },
  placeholder = "أدخل المعادلة …",
  arabic = true,
  readOnly = false,
}) {
  const hostRef = useRef(null);
  const mfRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (typeof window === "undefined") return;

      const mathlive = await import("mathlive");
      const MathfieldElement =
        mathlive.MathfieldElement || window.MathfieldElement;
      const setOptions = mathlive.setOptions || MathfieldElement?.setOptions;

      if (!MathfieldElement || !hostRef.current || !mounted) return;

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
        "arabic-math": { label: "عربي", layers: "arabic-base" },
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
      if (readOnly) mf.readOnly = true;

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

      mf.addEventListener("focus", () => {
        try {
          mf.executeCommand?.("showVirtualKeyboard");
        } catch {}
        try {
          mf.executeCommand?.("switchKeyboardLayer", "arabic-base");
        } catch {}
        try {
          window.mathVirtualKeyboard?.switchKeyboardLayer?.("arabic-base");
        } catch {}
      });

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
  }, [arabic, options, placeholder, readOnly, onChange]);

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

  return (
    <div
      ref={hostRef}
      className={`min-h-[48px] px-3 py-2 border border-gray-200 rounded-xl bg-white shadow-sm focus-within:ring-2 focus-within:ring-blue-500/20 ${className}`}
    />
  );
}

/* ================= Option Card (General MCQ) ================= */
const OptionCard = ({
  option,
  index,
  isCorrect,
  onToggleCorrect,
  onUpdateText,
  onDelete,
  canDelete,
  type = "single",
}) => (
  <div
    className={`group relative bg-white border-2 rounded-2xl p-4 transition-all duration-200 ${
      isCorrect
        ? "border-green-200 bg-green-50 shadow-sm"
        : "border-gray-100 hover:border-gray-200 hover:shadow-sm"
    }`}
  >
    <div className="flex items-start gap-4">
      <div
        className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm transition-colors ${
          isCorrect
            ? "bg-green-500 text-white shadow-sm"
            : "bg-gray-100 text-gray-600 group-hover:bg-gray-200"
        }`}
      >
        {String.fromCharCode(65 + index)}
      </div>

      <div className="flex-1 space-y-3">
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer text-sm">
            {type === "single" ? (
              <input
                type="radio"
                checked={isCorrect}
                onChange={onToggleCorrect}
                className="text-green-500 focus:ring-green-500"
              />
            ) : (
              <input
                type="checkbox"
                checked={isCorrect}
                onChange={onToggleCorrect}
                className="text-green-500 focus:ring-green-500 rounded"
              />
            )}
            <span
              className={`font-medium transition-colors ${
                isCorrect ? "text-green-700" : "text-gray-600"
              }`}
            >
              الإجابة الصحيحة
            </span>
          </label>

          {canDelete && (
            <Button
              danger
              type="text"
              size="small"
              icon={<DeleteOutlined />}
              onClick={onDelete}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            />
          )}
        </div>

        <EnhancedQuillEditor
          value={option.textHtml}
          onChange={(value) => onUpdateText(value, "textHtml")}
          placeholder={`نص الخيار ${String.fromCharCode(65 + index)}...`}
          className="min-h-[100px]"
        />

        <div>
          <Text className="text-xs text-gray-500 block mb-2">شرح الخيار (اختياري)</Text>
          <EnhancedQuillEditor
            value={option.explainHtml || ""}
            onChange={(value) => onUpdateText(value, "explainHtml")}
            placeholder="لماذا هذا الخيار صحيح أو خاطئ؟"
            className="min-h-[80px]"
          />
        </div>
      </div>
    </div>

    {isCorrect && (
      <div className="absolute -top-2 -right-2">
        <div className="bg-green-500 text-white rounded-full p-1 shadow-sm">
          <CheckCircle2 className="w-4 h-4" />
        </div>
      </div>
    )}
  </div>
);

/* ================= Main ================= */
export default function CompetitionsQuestions({ value = [], onChange }) {
  const [sections, setSections] = useState(() =>
    value?.length
      ? value
      : [{ id: uid(), name: "القسم الرئيسي", descHtml: "", questions: [] }]
  );
  const [activeSectionId, setActiveSectionId] = useState(sections[0]?.id);
  const [qType, setQType] = useState("mcq");
  const [mcqSubType, setMcqSubType] = useState("general");

  // editors state
  const [promptHtml, setPromptHtml] = useState("");
  const [editingId, setEditingId] = useState(null);

  // MCQ (general)
  const emptyOpt = () => ({ textHtml: "", explainHtml: "" });
  const [options, setOptions] = useState([emptyOpt(), emptyOpt(), emptyOpt(), emptyOpt()]);
  const [correctIndex, setCorrectIndex] = useState(0);

  // MCQ (passage)
  const [passageHtml, setPassageHtml] = useState("");
  const [passageQuestions, setPassageQuestions] = useState([
    { id: uid(), textHtml: "", opts: [emptyOpt(), emptyOpt()], correctIndex: 0 },
  ]);

  // MCQ (chemical) — equation + multiple answers with explanation + ✔ correct flag
  const [chemEquationLatex, setChemEquationLatex] = useState("");
  const [chemAnswers, setChemAnswers] = useState([
    { id: uid(), latex: "", explanationHtml: "", isCorrect: true }, // default one correct
  ]);

  // T/F
  const [tfCorrect, setTfCorrect] = useState(true);
  const [tfExplainHtml, setTfExplainHtml] = useState("");

  // Essay
  const [essayAnswerHtml, setEssayAnswerHtml] = useState("");

  // Complete
  const [completeTextHtml, setCompleteTextHtml] = useState("");
  const [completeAnswers, setCompleteAnswers] = useState([{ id: uid(), answer: "" }]);

  const activeSection = useMemo(
    () => sections.find((s) => s.id === activeSectionId),
    [sections, activeSectionId]
  );

  const pushChange = (next) => {
    setSections(next);
    onChange?.(next);
  };

  const resetEditors = () => {
    setPromptHtml("");
    setEditingId(null);
    setQType("mcq");
    setMcqSubType("general");
    setOptions([emptyOpt(), emptyOpt(), emptyOpt(), emptyOpt()]);
    setCorrectIndex(0);
    setPassageHtml("");
    setPassageQuestions([
      { id: uid(), textHtml: "", opts: [emptyOpt(), emptyOpt()], correctIndex: 0 },
    ]);
    setChemEquationLatex("");
    setChemAnswers([{ id: uid(), latex: "", explanationHtml: "", isCorrect: true }]);
    setTfCorrect(true);
    setTfExplainHtml("");
    setEssayAnswerHtml("");
    setCompleteTextHtml("");
    setCompleteAnswers([{ id: uid(), answer: "" }]);
  };

  /* --------- Sections --------- */
  const addSection = () => {
    const s = { id: uid(), name: "قسم جديد", descHtml: "", questions: [] };
    const next = [s, ...sections];
    pushChange(next);
    setActiveSectionId(s.id);
  };

  const editSection = (section) => {
    let newName = section.name;
    Modal.confirm({
      title: "تعديل بيانات القسم",
      icon: <EditOutlined />,
      width: 720,
      content: (
        <div className="mt-3 space-y-3" dir="rtl">
          <Text className="text-sm">اسم القسم</Text>
          <Input defaultValue={section.name} onChange={(e) => (newName = e.target.value)} placeholder="اسم القسم" />
          <Text className="text-sm">الوصف (اختياري)</Text>
          <EnhancedQuillEditor
            value={section.descHtml}
            onChange={(v) => (section.descHtml = v)}
            placeholder="وصف مختصر للقسم..."
            className="min-h-[100px]"
          />
        </div>
      ),
      okText: "حفظ",
      cancelText: "إلغاء",
      onOk: () => {
        const next = sections.map((s) =>
          s.id === section.id ? { ...s, name: newName, descHtml: section.descHtml } : s
        );
        pushChange(next);
      },
    });
  };

  const removeSection = (id) => {
    if (sections.length === 1) {
      alert("لا يمكن حذف كل الأقسام.");
      return;
    }
    Modal.confirm({
      title: "حذف القسم",
      content: "سيتم حذف القسم وكل أسئلته. هل تريد المتابعة؟",
      okText: "حذف",
      okButtonProps: { danger: true },
      cancelText: "إلغاء",
      onOk: () => {
        const next = sections.filter((s) => s.id !== id);
        pushChange(next);
        if (activeSectionId === id) setActiveSectionId(next[0]?.id);
      },
    });
  };

  /* --------- Questions --------- */
  const upsertQuestion = () => {
    if (!activeSection) return;

    let payload;

    if (qType === "mcq") {
      if (mcqSubType === "general") {
        if (!promptHtml?.trim()) return alert("أدخل نص السؤال.");
        if (options.some((o) => !o.textHtml?.trim())) return alert("كل الخيارات يجب أن تحتوي نصًا.");
        payload = {
          id: editingId || uid(),
          type: "mcq",
          mcqSubType: "general",
          promptHtml,
          options,
          correctIndex,
        };
      } else if (mcqSubType === "passage") {
        if (!passageHtml?.trim()) return alert("أدخل نص القطعة.");
        const qs = passageQuestions.filter(
          (q) => q.textHtml?.trim() && q.opts.every((o) => o.textHtml?.trim())
        );
        if (qs.length === 0) return alert("أضف سؤالًا واحدًا على الأقل للقطعة.");
        payload = {
          id: editingId || uid(),
          type: "mcq",
          mcqSubType: "passage",
          passageHtml,
          items: qs,
        };
      } else {
        // chemical
        if (!chemEquationLatex?.trim()) return alert("أدخل نص المعادلة/المسألة.");
        const answers = (chemAnswers || [])
          .map((a) => ({
            latex: (a.latex || "").trim(),
            explanationHtml: (a.explanationHtml || "").trim(),
            correct: !!a.isCorrect,
          }))
          .filter((a) => a.latex);

        if (answers.length === 0) return alert("أدخل إجابة واحدة على الأقل.");
        if (!answers.some((a) => a.correct)) return alert("اختر إجابة صحيحة واحدة على الأقل.");

        const correctLatex = answers.filter((a) => a.correct).map((a) => a.latex);

        payload = {
          id: editingId || uid(),
          type: "mcq",
          mcqSubType: "chemical",
          equationLatex: chemEquationLatex,
          answers, // [{ latex, explanationHtml, correct }]
          answersLatex: correctLatex, // للإجابات الصحيحة فقط (توافق)
          answerLatex: correctLatex[0], // أول إجابة صحيحة
        };
      }
    } else if (qType === "trueFalse") {
      if (!promptHtml?.trim()) return alert("أدخل نص السؤال.");
      payload = {
        id: editingId || uid(),
        type: "trueFalse",
        promptHtml,
        correct: !!tfCorrect,
        explainHtml: tfExplainHtml,
      };
    } else if (qType === "essay") {
      if (!promptHtml?.trim()) return alert("أدخل نص السؤال.");
      payload = {
        id: editingId || uid(),
        type: "essay",
        promptHtml,
        modelAnswerHtml: essayAnswerHtml,
      };
    } else {
      // complete
      if (!promptHtml?.trim() && !completeTextHtml?.trim())
        return alert("أدخل نص السؤال/النص المكمل.");
      const ans = completeAnswers.filter((a) => a.answer?.trim());
      if (ans.length === 0) return alert("أدخل إجابة واحدة على الأقل.");
      payload = {
        id: editingId || uid(),
        type: "complete",
        promptHtml,
        completeTextHtml,
        answers: ans,
      };
    }

    const next = sections.map((s) => {
      if (s.id !== activeSection.id) return s;
      const list = s.questions || [];
      const exists = list.findIndex((q) => q.id === payload.id);
      return {
        ...s,
        questions:
          exists >= 0 ? list.map((q) => (q.id === payload.id ? payload : q)) : [payload, ...list],
      };
    });
    pushChange(next);
    resetEditors();
  };

  const editQuestion = (q) => {
    setEditingId(q.id);
    setQType(q.type);
    if (q.type === "mcq") {
      setMcqSubType(q.mcqSubType || "general");
      if (q.mcqSubType === "general") {
        setPromptHtml(q.promptHtml || "");
        setOptions(q.options || [emptyOpt(), emptyOpt()]);
        setCorrectIndex(typeof q.correctIndex === "number" ? q.correctIndex : 0);
      } else if (q.mcqSubType === "passage") {
        setPassageHtml(q.passageHtml || "");
        setPassageQuestions(
          (q.items || []).map((it) => ({
            id: it.id || uid(),
            textHtml: it.textHtml || "",
            opts: it.opts || [emptyOpt(), emptyOpt()],
            correctIndex: typeof it.correctIndex === "number" ? it.correctIndex : 0,
          }))
        );
      } else {
        // chemical
        setChemEquationLatex(q.equationLatex || "");
        const ansObjs = Array.isArray(q.answers)
          ? q.answers.map((a, i) => ({
              id: uid(),
              latex: typeof a === "string" ? a : (a?.latex || a?.answerLatex || ""),
              explanationHtml:
                typeof a === "object" && a?.explanationHtml ? a.explanationHtml : "",
              isCorrect:
                typeof a === "object" && "correct" in a
                  ? !!a.correct
                  : i === 0, // لو قديم: خلّي أول واحدة صحيحة
            }))
          : Array.isArray(q.answersLatex)
          ? q.answersLatex.map((s, i) => ({
              id: uid(),
              latex: s || "",
              explanationHtml: "",
              isCorrect: true, // كانت كلها صحيحة
            }))
          : q.answerLatex
          ? [{ id: uid(), latex: q.answerLatex, explanationHtml: "", isCorrect: true }]
          : [{ id: uid(), latex: "", explanationHtml: "", isCorrect: true }];
        setChemAnswers(ansObjs.length ? ansObjs : [{ id: uid(), latex: "", explanationHtml: "", isCorrect: true }]);
      }
    } else if (q.type === "trueFalse") {
      setPromptHtml(q.promptHtml || "");
      setTfCorrect(!!q.correct);
      setTfExplainHtml(q.explainHtml || "");
    } else if (q.type === "essay") {
      setPromptHtml(q.promptHtml || "");
      setEssayAnswerHtml(q.modelAnswerHtml || "");
    } else {
      setPromptHtml(q.promptHtml || "");
      setCompleteTextHtml(q.completeTextHtml || "");
      setCompleteAnswers(
        (q.answers || []).map((a) => ({ id: uid(), answer: a?.answer || a || "" }))
      );
    }
  };

  const removeQuestion = (qid) => {
    Modal.confirm({
      title: "حذف السؤال",
      content: "هل أنت متأكد من حذف هذا السؤال؟",
      okText: "حذف",
      okButtonProps: { danger: true },
      cancelText: "إلغاء",
      onOk: () => {
        const next = sections.map((s) =>
          s.id !== activeSectionId
            ? s
            : { ...s, questions: (s.questions || []).filter((q) => q.id !== qid) }
        );
        pushChange(next);
        if (editingId === qid) resetEditors();
      },
    });
  };

  // helpers (chemical)
  const addChemAnswer = () =>
    setChemAnswers((arr) => [...arr, { id: uid(), latex: "", explanationHtml: "", isCorrect: false }]);
  const removeChemAnswer = (idx) =>
    setChemAnswers((arr) => (arr.length > 1 ? arr.filter((_, i) => i !== idx) : arr));
  const updateChemAnswerLatex = (idx, latex) =>
    setChemAnswers((arr) => arr.map((a, i) => (i === idx ? { ...a, latex } : a)));
  const updateChemAnswerExplain = (idx, explanationHtml) =>
    setChemAnswers((arr) => arr.map((a, i) => (i === idx ? { ...a, explanationHtml } : a)));
  const toggleChemAnswerCorrect = (idx, checked) =>
    setChemAnswers((arr) => arr.map((a, i) => (i === idx ? { ...a, isCorrect: checked } : a)));

  return (
    <div className="space-y-8" dir="rtl">
      {/* Builder */}
      <Card className="border-0 shadow-lg rounded-3xl overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-500 via-blue-600 to-cyan-600 p-6 -m-6 mb-6">
          <div className="flex items-center gap-4 text-white">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
              <BulbOutlined className="text-2xl" />
            </div>
            <div>
              <Title level={3} className="!text-white !mb-1">إنشاء سؤال جديد</Title>
              <Text className="text-blue-100">اختر نوع السؤال وأدخل المحتوى</Text>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Type */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Text strong className="text-lg text-gray-800">نوع السؤال</Text>
              <Tooltip title="يمكنك تغيير نوع السؤال في أي وقت">
                <HelpCircle className="w-4 h-4 text-gray-400" />
              </Tooltip>
            </div>

            <div className="bg-gray-50 p-2 rounded-2xl">
              <Segmented
                size="large"
                value={qType}
                onChange={(v) => setQType(v)}
                className="w-full"
                options={[
                  { label: (<div className="flex items-center gap-2 px-4 py-2"><ListChecks className="w-4 h-4" /><span>اختيار من متعدد</span></div>), value: "mcq" },
                  { label: (<div className="flex items-center gap-2 px-4 py-2"><CheckCircle2 className="w-4 h-4" /><span>صح / خطأ</span></div>), value: "trueFalse" },
                  { label: (<div className="flex items-center gap-2 px-4 py-2"><EditOutlined className="w-4 h-4" /><span>مقالي</span></div>), value: "essay" },
                  { label: (<div className="flex items-center gap-2 px-4 py-2"><QuestionCircleOutlined className="w-4 h-4" /><span>إكمال</span></div>), value: "complete" },
                ]}
              />
            </div>
          </div>

          {/* MCQ Body */}
          {qType === "mcq" && (
            <div className="space-y-8">
              {/* subtype */}
              <div className="space-y-4">
                <Text strong className="text-base text-gray-800">نوع أسئلة الاختيار</Text>
                <div className="bg-gray-50 p-2 rounded-2xl">
                  <Segmented
                    size="large"
                    value={mcqSubType}
                    onChange={setMcqSubType}
                    className="w-full"
                    options={[
                      { label: (<div className="flex items-center gap-2 px-3 py-1"><ListChecks className="w-4 h-4" /><span>عام</span></div>), value: "general" },
                      { label: (<div className="flex items-center gap-2 px-3 py-1"><FileText className="w-4 h-4" /><span>قطعة</span></div>), value: "passage" },
                      { label: (<div className="flex items-center gap-2 px-3 py-1"><FlaskConical className="w-4 h-4" /><span>معادلات</span></div>), value: "chemical" },
                    ]}
                  />
                </div>
              </div>

              {/* general */}
              {mcqSubType === "general" && (
                <div className="space-y-8">
                  <div className="space-y-3">
                    <Text strong className="text-base text-gray-800">نص السؤال</Text>
                    <EnhancedQuillEditor value={promptHtml} onChange={setPromptHtml} placeholder="اكتب نص السؤال..." className="min-h-[120px]" />
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <Text strong className="text-base text-gray-800">خيارات الإجابة</Text>
                      <Button icon={<PlusOutlined />} onClick={() => setOptions((prev) => [...prev, emptyOpt()])} className="rounded-xl">
                        إضافة خيار
                      </Button>
                    </div>

                    <div className="grid gap-6">
                      {options.map((opt, idx) => (
                        <OptionCard
                          key={idx}
                          option={opt}
                          index={idx}
                          isCorrect={correctIndex === idx}
                          onToggleCorrect={() => setCorrectIndex(idx)}
                          onUpdateText={(value, field) => {
                            const next = [...options];
                            next[idx] = { ...next[idx], [field]: value };
                            setOptions(next);
                          }}
                          onDelete={() => {
                            const next = options.filter((_, i) => i !== idx);
                            setOptions(next);
                            if (correctIndex >= idx) setCorrectIndex(Math.max(0, correctIndex - 1));
                          }}
                          canDelete={options.length > 2}
                          type="single"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* passage */}
              {mcqSubType === "passage" && (
                <div className="space-y-8">
                  <div className="space-y-3">
                    <Text strong className="text-base text-gray-800">نص القطعة</Text>
                    <EnhancedQuillEditor value={passageHtml} onChange={setPassageHtml} placeholder="اكتب نص القطعة..." className="min-h-[150px]" />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Text strong className="text-base text-gray-800">أسئلة القطعة</Text>
                      <Button className="!bg-blue-500 !rounded-xl text-white" icon={<PlusOutlined />} onClick={() => {
                        const addItem = { id: uid(), textHtml: "", opts: [emptyOpt(), emptyOpt()], correctIndex: 0 };
                        setPassageQuestions((p) => [...p, addItem]);
                      }}>
                        إضافة سؤال
                      </Button>
                    </div>

                    <div className="space-y-6">
                      {passageQuestions.map((row, i) => (
                        <Card key={row.id} className="border-2 border-gray-100 rounded-3xl">
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <Text strong>السؤال #{i + 1}</Text>
                              <Button danger type="text" icon={<Trash2 className="w-4 h-4" />} onClick={() => setPassageQuestions((p) => p.filter((_, idx) => idx !== i))}>
                                حذف السؤال
                              </Button>
                            </div>

                            <EnhancedQuillEditor
                              value={row.textHtml}
                              onChange={(v) => {
                                const next = [...passageQuestions];
                                next[i] = { ...next[i], textHtml: v };
                                setPassageQuestions(next);
                              }}
                              placeholder="اكتب نص السؤال..."
                              className="min-h-[100px]"
                            />

                            <div className="space-y-4">
                              <Text className="text-sm text-gray-600">الخيارات</Text>
                              {row.opts.map((o, oi) => (
                                <OptionCard
                                  key={oi}
                                  option={o}
                                  index={oi}
                                  isCorrect={row.correctIndex === oi}
                                  onToggleCorrect={() => {
                                    const next = [...passageQuestions];
                                    next[i] = { ...next[i], correctIndex: oi };
                                    setPassageQuestions(next);
                                  }}
                                  onUpdateText={(value, field) => {
                                    const next = [...passageQuestions];
                                    const opts = [...next[i].opts];
                                    opts[oi] = { ...opts[oi], [field]: value };
                                    next[i] = { ...next[i], opts };
                                    setPassageQuestions(next);
                                  }}
                                  onDelete={() => {
                                    const next = [...passageQuestions];
                                    next[i] = {
                                      ...next[i],
                                      opts: next[i].opts.filter((_, idx) => idx !== oi),
                                      correctIndex: next[i].correctIndex >= oi ? Math.max(0, next[i].correctIndex - 1) : next[i].correctIndex,
                                    };
                                    setPassageQuestions(next);
                                  }}
                                  canDelete={row.opts.length > 2}
                                  type="single"
                                />
                              ))}
                              <Button icon={<PlusOutlined />} onClick={() => {
                                const next = [...passageQuestions];
                                next[i] = { ...next[i], opts: [...next[i].opts, emptyOpt()] };
                                setPassageQuestions(next);
                              }} className="w-full rounded-xl" type="dashed">
                                إضافة خيار
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* chemical */}
              {mcqSubType === "chemical" && (
                <div className="space-y-8">
                  <div className="space-y-3">
                    <Text strong className="text-base text-gray-800">نص المعادلة / المسألة</Text>
                    <MathFieldInput
                      value={chemEquationLatex}
                      onChange={setChemEquationLatex}
                      placeholder="مثال: E = mc^2 أو \\frac{a}{b} = c"
                      className="w-full"
                      options={{ virtualKeyboardMode: "onfocus" }}
                      arabic
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Text strong className="text-base text-gray-800">الإجابات (يمكن أكثر من إجابة صحيحة)</Text>
                      <Button icon={<PlusOutlined />} className="rounded-xl" onClick={addChemAnswer}>
                        إضافة إجابة
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {chemAnswers.map((ans, idx) => (
                        <div key={ans.id} className="rounded-xl border p-3 bg-white space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-600">إجابة #{idx + 1}</span>
                            <div className="flex items-center gap-2">
                              <Checkbox
                                checked={!!ans.isCorrect}
                                onChange={(e) => toggleChemAnswerCorrect(idx, e.target.checked)}
                              >
                                إجابة صحيحة
                              </Checkbox>
                              {chemAnswers.length > 1 && (
                                <Button size="small" type="text" danger icon={<DeleteOutlined />} onClick={() => removeChemAnswer(idx)}>
                                  حذف
                                </Button>
                              )}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Text className="block text-xs font-semibold text-gray-600">صيغة الإجابة</Text>
                            <MathFieldInput
                              value={ans.latex}
                              onChange={(latex) => updateChemAnswerLatex(idx, latex)}
                              placeholder="مثال: x=\frac{2}{3}"
                              className="w-full"
                              options={{ virtualKeyboardMode: "onfocus" }}
                              arabic
                            />
                          </div>

                          <div className="space-y-2">
                            <Text className="block text-xs font-semibold text-gray-600">شرح الإجابة</Text>
                            <EnhancedQuillEditor
                              value={ans.explanationHtml}
                              onChange={(v) => updateChemAnswerExplain(idx, v)}
                              placeholder="اكتب شرح الإجابة لهذه الصيغة..."
                              className="min-h-[90px]"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* True/False */}
          {qType === "trueFalse" && (
            <div className="space-y-8">
              <div className="space-y-3">
                <Text strong className="text-base text-gray-800">نص السؤال</Text>
                <EnhancedQuillEditor value={promptHtml} onChange={setPromptHtml} placeholder="اكتب نص السؤال..." className="min-h-[120px]" />
              </div>

              <div className="space-y-4">
                <Text strong className="text-base text-gray-800">الإجابة الصحيحة</Text>
                <div className="bg-gray-50 p-4 rounded-2xl">
                  <Radio.Group value={tfCorrect ? "true" : "false"} onChange={(e) => setTfCorrect(e.target.value === "true")} size="large">
                    <div className="grid grid-cols-2 gap-4">
                      <Radio value="true" className="!block">
                        <Card className={`border-2 p-4 text-center transition-all ${tfCorrect ? "border-green-500 bg-green-50" : "border-gray-200"}`}>
                          <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-green-500" />
                          <Text strong>صحيح</Text>
                        </Card>
                      </Radio>
                      <Radio value="false" className="!block">
                        <Card className={`border-2 p-4 text-center transition-all ${!tfCorrect ? "border-red-500 bg-red-50" : "border-gray-200"}`}>
                          <div className="w-8 h-8 mx-auto mb-2 bg-red-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-sm">✕</span>
                          </div>
                          <Text strong>خطأ</Text>
                        </Card>
                      </Radio>
                    </div>
                  </Radio.Group>
                </div>
              </div>

              <div className="space-y-3">
                <Text className="text-base text-gray-800">شرح الإجابة (اختياري)</Text>
                <EnhancedQuillEditor value={tfExplainHtml} onChange={setTfExplainHtml} placeholder="اشرح لماذا هذه الإجابة صحيحة أو خاطئة..." className="min-h-[100px]" />
              </div>
            </div>
          )}

          {/* Essay */}
          {qType === "essay" && (
            <div className="space-y-8">
              <div className="space-y-3">
                <Text strong className="text-base text-gray-800">نص السؤال</Text>
                <EnhancedQuillEditor value={promptHtml} onChange={setPromptHtml} placeholder="اكتب نص السؤال المقالي..." className="min-h-[120px]" />
              </div>

              <div className="space-y-3">
                <Text className="text-base text-gray-800">الإجابة النموذجية (اختياري)</Text>
                <EnhancedQuillEditor value={essayAnswerHtml} onChange={setEssayAnswerHtml} placeholder="اكتب إجابة نموذجية مختصرة..." className="min-h-[100px]" />
              </div>
            </div>
          )}

          {/* Complete */}
          {qType === "complete" && (
            <div className="space-y-8">
              <div className="space-y-3">
                <Text strong className="text-base text-gray-800">نص السؤال / مقدمة</Text>
                <EnhancedQuillEditor value={promptHtml} onChange={setPromptHtml} placeholder="اكتب نص السؤال (اختياري إذا استخدمت نص الإكمال)..." className="min-h-[120px]" />
              </div>

              <div className="space-y-3">
                <Text strong className="text-base text-gray-800">نص الإكمال (اختياري)</Text>
                <EnhancedQuillEditor value={completeTextHtml} onChange={setCompleteTextHtml} placeholder="أدخل النص المراد إكماله..." className="min-h-[100px]" />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Text strong className="text-base text-gray-800">الإجابات الصحيحة</Text>
                  <Button
                    icon={<PlusOutlined />}
                    onClick={() => setCompleteAnswers((p) => [...p, { id: uid(), answer: "" }])}
                    className="rounded-xl"
                  >
                    إضافة إجابة
                  </Button>
                </div>

                <div className="space-y-2">
                  {completeAnswers.map((a, i) => (
                    <div key={a.id} className="flex items-center gap-2">
                      <Input
                        value={a.answer}
                        onChange={(e) =>
                          setCompleteAnswers((prev) =>
                            prev.map((x) => (x.id === a.id ? { ...x, answer: e.target.value } : x))
                          )
                        }
                        placeholder={`إجابة #${i + 1}`}
                      />
                      <Button
                        size="small"
                        danger
                        type="text"
                        icon={<DeleteOutlined />}
                        onClick={() => setCompleteAnswers((p) => p.filter((x) => x.id !== a.id))}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Action Bar */}
          <div className="pt-4 border-t flex items-center justify-end gap-2">
            {editingId && <Button onClick={resetEditors}>إلغاء التعديل</Button>}
            <Button className="!bg-blue-500 !text-white" type="primary" icon={<Save className="w-4 h-4" />} onClick={upsertQuestion}>
              {editingId ? "تحديث السؤال" : "إضافة السؤال"}
            </Button>
          </div>
        </div>
      </Card>

      {/* Review / list */}
      <Card
        title={
          <div className="flex items-center gap-2">
            <QuestionCircleOutlined />
            <span>أسئلة القسم: {activeSection?.name || "-"}</span>
            <Tag color="blue" className="ms-2">{activeSection?.questions?.length || 0} سؤال</Tag>
          </div>
        }
        className="rounded-3xl shadow-sm"
      >
        {!activeSection || (activeSection.questions || []).length === 0 ? (
          <div className="text-gray-500 text-center py-8">لا توجد أسئلة بعد في هذا القسم.</div>
        ) : (
          <div className="space-y-6">
            {(activeSection.questions || []).map((q) => (
              <div key={q.id} className="rounded-xl border p-4 bg-white">
                <div className="flex items-start justify-between gap-3">
                  <div className="prose prose-sm max-w-none">
                    <div className="text-xs text-gray-500 mb-1">
                      {q.type === "mcq"
                        ? q.mcqSubType === "general"
                          ? "اختيار من متعدد — عام"
                          : q.mcqSubType === "passage"
                          ? "اختيار من متعدد — قطعة"
                          : "مسألة/معادلة — MathLive"
                        : q.type === "trueFalse"
                        ? "صح / خطأ"
                        : q.type === "essay"
                        ? "مقالي"
                        : "إكمال"}
                    </div>

                    {/* general mcq */}
                    {q.type === "mcq" && q.mcqSubType === "general" && (
                      <>
                        <div dangerouslySetInnerHTML={{ __html: q.promptHtml }} />
                        <ol className="list-decimal ps-5">
                          {q.options.map((o, i) => (
                            <li key={i} className={q.correctIndex === i ? "font-semibold text-emerald-700" : ""}>
                              <span dangerouslySetInnerHTML={{ __html: o.textHtml || "-" }} />
                            </li>
                          ))}
                        </ol>
                      </>
                    )}

                    {/* passage */}
                    {q.type === "mcq" && q.mcqSubType === "passage" && (
                      <>
                        <div className="text-gray-700 mb-2" dangerouslySetInnerHTML={{ __html: q.passageHtml }} />
                        <ol className="space-y-2 ps-5">
                          {q.items.map((it) => (
                            <li key={it.id}>
                              <div dangerouslySetInnerHTML={{ __html: it.textHtml }} />
                            </li>
                          ))}
                        </ol>
                      </>
                    )}

                    {/* chemical */}
                    {q.type === "mcq" && q.mcqSubType === "chemical" && (
                      <div className="space-y-3">
                        <div className="text-xs text-gray-500">المعادلة / المسألة:</div>
                        <div className="border rounded-lg p-2 bg-gray-50">
                          <MathFieldInput value={q.equationLatex || ""} onChange={() => {}} readOnly arabic options={{ virtualKeyboardMode: "off" }} />
                        </div>

                        <div className="text-xs text-gray-500 mt-1">الإجابات الصحيحة:</div>
                        {(() => {
                          // اختَر الصحيحين فقط لو عندهم flag, وإلا اعرض الكل (توافق مع الداتا القديمة)
                          const list =
                            Array.isArray(q.answers) && q.answers.length
                              ? (q.answers.some((a) => a?.correct === true)
                                  ? q.answers.filter((a) => a?.correct)
                                  : q.answers
                                ).map((a) => (typeof a === "string" ? { latex: a } : a))
                              : Array.isArray(q.answersLatex)
                              ? q.answersLatex.map((s) => ({ latex: s }))
                              : q.answerLatex
                              ? [{ latex: q.answerLatex }]
                              : [];

                          return list.map((a, i) => (
                            <div key={i} className="border rounded-lg p-2 bg-gray-50 mb-2">
                              <div className="text-[11px] text-gray-500 mb-1">إجابة #{i + 1}</div>
                              <MathFieldInput value={a?.latex || ""} onChange={() => {}} readOnly arabic options={{ virtualKeyboardMode: "off" }} />
                              {a?.explanationHtml ? (
                                <div className="mt-2">
                                  <div className="text-[11px] text-gray-500 mb-1">شرح الإجابة:</div>
                                  <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: a.explanationHtml }} />
                                </div>
                              ) : null}
                            </div>
                          ));
                        })()}

                      </div>
                    )}

                    {/* true/false */}
                    {q.type === "trueFalse" && (
                      <>
                        <div dangerouslySetInnerHTML={{ __html: q.promptHtml }} />
                        <div className="mt-1 text-sm">
                          الإجابة:{" "}
                          <b className={q.correct ? "text-emerald-700" : "text-rose-700"}>
                            {q.correct ? "صحيح" : "خطأ"}
                          </b>
                        </div>
                        {q.explainHtml ? (
                          <div className="mt-2 text-xs text-gray-600" dangerouslySetInnerHTML={{ __html: q.explainHtml }} />
                        ) : null}
                      </>
                    )}

                    {/* essay */}
                    {q.type === "essay" && (
                      <>
                        <div dangerouslySetInnerHTML={{ __html: q.promptHtml }} />
                        {q.modelAnswerHtml ? (
                          <div className="mt-2 text-xs">
                            <div className="text-gray-500 mb-1">إجابة نموذجية:</div>
                            <div dangerouslySetInnerHTML={{ __html: q.modelAnswerHtml }} />
                          </div>
                        ) : null}
                      </>
                    )}

                    {/* complete */}
                    {q.type === "complete" && (
                      <>
                        {q.promptHtml ? <div dangerouslySetInnerHTML={{ __html: q.promptHtml }} /> : null}
                        {q.completeTextHtml ? (
                          <div className="mt-1" dangerouslySetInnerHTML={{ __html: q.completeTextHtml }} />
                        ) : null}
                        <div className="mt-1 text-xs text-gray-600">
                          الإجابات: {q.answers.map((a) => a.answer).join(" / ")}
                        </div>
                      </>
                    )}
                  </div>

                  <Space>
                    <Button size="small" onClick={() => editQuestion(q)}>تعديل</Button>
                    <Button size="small" danger onClick={() => removeQuestion(q.id)}>حذف</Button>
                  </Space>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
