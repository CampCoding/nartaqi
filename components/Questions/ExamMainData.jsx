"use client";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Segmented, Select, Tag, Tooltip } from "antd";
import {
  PlusIcon,
  Edit3,
  BookOpen,
  Save,
  X,
  ListChecks,
  FlaskConical,
  FileText,
} from "lucide-react";

import QuestionStats from "./QuestionStats";
import Card from "./ExamCard";
import ExamMainInfo from "./ExamMainInfo";
import QuestionSections from "./QuestionSections";
import TrueFalseQuestions from "./TrueFalseQuestions";
import EssayQuestions from "./EssayQuestions";
import CompleteQuestions from "./CompleteQuestions";
import DisplayQuestions from "./DisplayQuestions";
import QuestionTypeSelector from "./QuestionTypeSelector";
import McqSharedPassageEditor from "./McqQuestions";
import {
  colorMap,
  exam_types,
  mock_exam_section_Data,
  questionTypes,
} from "./utils";

import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

/* ================= Helpers ================= */
const readFileAsDataURL = (file) =>
  new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = reject;
    r.readAsDataURL(file);
  });

/* =============== Quill config factory =============== */
const useQuillConfig = (allowImages, imageHandler) =>
  useMemo(() => {
    // Base toolbar
    const toolbar = [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ direction: "rtl" }, { align: [] }],
      ["link", "clean"],
    ];
    if (allowImages) toolbar.push(["image"]);

    return {
      modules: {
        toolbar: allowImages
          ? {
              container: toolbar,
              handlers: {
                image: imageHandler,
              },
            }
          : toolbar,
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
        ...(allowImages ? ["image"] : []),
      ],
    };
  }, [allowImages, imageHandler]);

/* =============== LabeledEditor with image support (fixed size) =============== */
const LabeledEditor = ({
  label,
  hint,
  value,
  onChange,
  placeholder = "اكتب هنا…",
  className = "",
  editorMinH = 140,
  allowImages = true, // ⬅️ enable image button/paste/drag-drop
  maxImageSizeMB = 3, // size guard (Data URL)
  acceptedImageTypes = "image/png,image/jpeg,image/webp,image/gif",
  // Fixed image size controls (you can tweak these numbers)
  imageSize = { width: 320, height: 200, objectFit: "contain" },
}) => {
  const quillRef = useRef(null);
  const hiddenInputRef = useRef(null);

  // apply fixed size for all <img> inside this editor
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

  // Handler used by toolbar button
  const openFileDialog = useCallback(() => {
    hiddenInputRef.current?.click();
  }, []);

  // Core insertion + force-size on the inserted image
  const insertImage = useCallback(
    async (file) => {
      if (!file || !file.type?.startsWith("image/")) return;
      const sizeMB = file.size / (1024 * 1024);
      if (sizeMB > maxImageSizeMB) {
        alert(`حجم الصورة ${sizeMB.toFixed(1)}MB — الحد الأقصى ${maxImageSizeMB}MB`);
        return;
      }
      const dataUrl = await readFileAsDataURL(file);
      const quill = quillRef.current?.getEditor?.();
      if (!quill) return;
      const range = quill.getSelection(true) || { index: quill.getLength(), length: 0 };
      quill.insertEmbed(range.index, "image", dataUrl, "user");
      quill.setSelection(range.index + 1, 0, "user");

      // ensure the newly-inserted image gets fixed dimensions
      requestAnimationFrame(() => {
        const root = quill.root;
        const img = root.querySelector(`img[src="${CSS.escape(dataUrl)}"]`);
        if (img) {
          img.style.width = `${imageSize.width}px`;
          img.style.height = `${imageSize.height}px`;
          img.style.objectFit = imageSize.objectFit || "contain";
          img.style.display = "inline-block";
        }
      });
    },
    [imageSize.height, imageSize.objectFit, imageSize.width, maxImageSizeMB]
  );

  // File input change
  const onPickFile = useCallback(
    async (e) => {
      const f = e.target.files?.[0];
      if (f) await insertImage(f);
      e.target.value = "";
    },
    [insertImage]
  );

  // Paste image from clipboard
  const onPaste = useCallback(
    async (e) => {
      if (!allowImages) return;
      const items = e.clipboardData?.items;
      if (!items) return;
      for (const it of items) {
        if (it.type?.startsWith("image/")) {
          e.preventDefault();
          const file = it.getAsFile();
          await insertImage(file);
        }
      }
      // ensure pasted HTML images also get fixed sizes
      requestAnimationFrame(applyFixedSizeToAllImages);
    },
    [allowImages, insertImage, applyFixedSizeToAllImages]
  );

  // Drag & drop image
  const onDrop = useCallback(
    async (e) => {
      if (!allowImages) return;
      const files = Array.from(e.dataTransfer?.files || []);
      const imgs = files.filter((f) => f.type?.startsWith("image/"));
      if (imgs.length) {
        e.preventDefault();
        for (const f of imgs) await insertImage(f);
        requestAnimationFrame(applyFixedSizeToAllImages);
      }
    },
    [allowImages, insertImage, applyFixedSizeToAllImages]
  );

  // Quill config with image handler
  const { modules, formats } = useQuillConfig(allowImages, openFileDialog);

  // Re-apply fixed size when content changes or on mount
  useEffect(() => {
    const quill = quillRef.current?.getEditor?.();
    if (!quill) return;
    const handler = () => requestAnimationFrame(applyFixedSizeToAllImages);
    quill.on("text-change", handler);
    requestAnimationFrame(applyFixedSizeToAllImages);
    return () => quill.off("text-change", handler);
  }, [applyFixedSizeToAllImages]);

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-gray-700">
          {label}
        </label>
        {hint ? <span className="text-[11px] text-gray-400">{hint}</span> : null}
      </div>

      <div
        className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-blue-500/20"
        onPaste={onPaste}
        onDrop={onDrop}
        onDragOver={(e) => allowImages && e.preventDefault()}
      >
        <ReactQuill
          ref={quillRef}
          value={value}
          onChange={onChange}
          modules={modules}
          formats={formats}
          placeholder={placeholder}
        />
        {allowImages && (
          <input
            ref={hiddenInputRef}
            type="file"
            accept={acceptedImageTypes}
            onChange={onPickFile}
            className="hidden"
          />
        )}
      </div>

      {/* Editor height & RTL + enforce fixed image size (CSS fallback) */}
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
        /* 🔒 Force all images inside Quill to a fixed size */
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
/* ============================================================ */

export default function ExamMainData({ examData: editExamData }) {
  const [examData, setExamData] = useState({
    name: "",
    duration: "",
    type: "",
    sections: [],
  });
  const [filteredSection, setFilteredSection] = useState([]);
  const [questionType, setQuestionType] = useState("mcq");

  // Common states
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [selectedSectionId, setSelectedSectionId] = useState(null);
  const [expandedSections, setExpandedSections] = useState({});
  const [editingQuestion, setEditingQuestion] = useState(null);

  // True/False
  const [trueFalseAnswer, setTrueFalseAnswer] = useState(null);
  const [trueFalseExplanation, setTrueFalseExplanation] = useState("");

  // Essay
  const [modalAnswer, setModalAnswer] = useState("");

  // Complete
  const [completeText, setCompleteText] = useState("");
  const [completeAnswers, setCompleteAnswers] = useState([{ answer: "" }]);

  // MCQ (general) with explanation
  const emptyOption = () => ({ text: "", explanation: "" });
  const normalizeOption = (opt) => {
    if (typeof opt === "string") return { text: opt, explanation: "" };
    if (opt && typeof opt === "object")
      return { text: opt.text || "", explanation: opt.explanation || "" };
    return emptyOption();
  };
  const [mcqOptions, setMcqOptions] = useState([
    emptyOption(),
    emptyOption(),
    emptyOption(),
    emptyOption(),
  ]);
  const [mcqCorrectAnswer, setMcqCorrectAnswer] = useState(0);

  // MCQ subtype
  const [mcqSubType, setMcqSubType] = useState("general"); // "general" | "chemical" | "passage"

  // MCQ passages store per subtype (for the editor)
  const [mcqPassages, setMcqPassages] = useState({ chemical: [], passage: [] });

  /* ----------------------------- Effects ----------------------------- */
  useEffect(() => {
    if (examData?.type === "intern")
      setFilteredSection(mock_exam_section_Data[1]);
    else if (examData?.type === "mock")
      setFilteredSection(mock_exam_section_Data[2]);
    else setFilteredSection([]);
  }, [examData?.type]);

  useEffect(() => {
    if (editExamData) setExamData(editExamData);
  }, []); // eslint-disable-line

  useEffect(() => {
    if (examData?.sections?.length > 0 && !selectedSectionId)
      setSelectedSectionId(examData.sections[0].id);
  }, [examData?.sections, selectedSectionId]);

  /* ----------------------------- Helpers ----------------------------- */
  const selectedSection = useMemo(
    () => examData.sections.find((s) => s.id === selectedSectionId),
    [examData.sections, selectedSectionId]
  );

  const onAddSection = (section) => {
    const isAdded = examData?.sections.some((s) => s.id === section.id);
    if (isAdded) return;
    const newSection = { ...section, questions: section.questions || [] };
    setExamData((prev) => ({
      ...prev,
      sections: [...prev.sections, newSection],
    }));
  };

  const toggleSection = (sectionId) =>
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));

  const handleQuestionTypeChange = (type) => {
    setQuestionType(type);
    resetQuestionForm();
  };

  const resetQuestionForm = () => {
    setCurrentQuestion("");
    setTrueFalseAnswer(null);
    setTrueFalseExplanation("");
    setModalAnswer("");
    setCompleteText("");
    setCompleteAnswers([{ answer: "" }]);
    setMcqOptions([emptyOption(), emptyOption(), emptyOption(), emptyOption()]);
    setMcqCorrectAnswer(0);
    setEditingQuestion(null);
    setMcqSubType("general");
    setMcqPassages({ chemical: [], passage: [] });
  };

  const addCompleteAnswer = () =>
    setCompleteAnswers((a) => [...a, { answer: "" }]);
  const removeCompleteAnswer = (index) =>
    setCompleteAnswers((a) => a.filter((_, i) => i !== index));
  const updateCompleteAnswer = (index, value) => {
    setCompleteAnswers((a) => {
      const next = [...a];
      next[index].answer = value;
      return next;
    });
  };

  const updateMcqOption = (index, field, value) =>
    setMcqOptions((opts) => {
      const next = [...opts];
      next[index] = { ...normalizeOption(next[index]), [field]: value };
      return next;
    });

  const addMcqOption = () => setMcqOptions((opts) => [...opts, emptyOption()]);

  const removeMcqOption = (index) => {
    setMcqOptions((opts) => {
      if (opts.length <= 2) return opts;
      const next = opts.filter((_, i) => i !== index);
      setMcqCorrectAnswer((curr) =>
        curr >= index ? Math.max(0, curr - 1) : curr
      );
      return next;
    });
  };

  const getQuestionsCount = (sectionId) =>
    examData.sections.find((s) => s.id === sectionId)?.questions?.length || 0;
  const getTotalQuestions = () =>
    examData.sections.reduce((acc, s) => acc + (s.questions?.length || 0), 0);
  const getEstimatedDuration = () =>
    examData.type === "mock"
      ? examData.sections.length * 25
      : parseInt(examData.duration || 0);
  const canAddMoreQuestions = (sectionId) =>
    examData.type !== "mock" ? true : getQuestionsCount(sectionId) < 24;

  const handleMcqPassagesChange = React.useCallback(
    (passages) => {
      setMcqPassages((prev) => ({ ...prev, [mcqSubType]: passages }));
    },
    [mcqSubType]
  );

  /* ---------------------- Add / Update Question ---------------------- */
  const addOrUpdateQuestion = () => {
    if (!selectedSectionId) return;

    const currentCount = getQuestionsCount(selectedSectionId);

    // Non-general MCQ groups
    if (questionType === "mcq" && mcqSubType !== "general") {
      const groups = mcqPassages[mcqSubType] || [];
      const generated = [];

      groups.forEach((p) => {
        (p.questions || []).forEach((q) => {
          generated.push({
            id: Date.now() + Math.random(),
            type: "mcq",
            mcqSubType,
            question: q.text || "",
            options: Array.isArray(q.options)
              ? q.options.map(normalizeOption)
              : [],
            correctAnswer:
              typeof q.correctIndex === "number" ? q.correctIndex : 0,
            passage: { id: p.id, content: p.content || "" },
            sectionId: selectedSectionId,
          });
        });
      });

      if (generated.length === 0) return;

      if (editingQuestion) {
        generated[0] = { ...generated[0], id: editingQuestion.id };

        const extra = generated.slice(1);
        const available =
          examData.type === "mock"
            ? Math.max(0, 24 - currentCount)
            : Infinity;
        if (extra.length > available) {
          alert(
            `لا يمكن إضافة ${extra.length} سؤال إضافي. المتاح الآن: ${available}`
          );
          const updatedSectionsOnlyReplace = examData.sections.map(
            (section) => {
              if (section.id !== selectedSectionId) return section;
              return {
                ...section,
                questions: (section.questions || []).map((q) =>
                  q.id === editingQuestion.id ? generated[0] : q
                ),
              };
            }
          );
          setExamData((prev) => ({
            ...prev,
            sections: updatedSectionsOnlyReplace,
          }));
          resetQuestionForm();
          return;
        }

        const updatedSections = examData.sections.map((section) => {
          if (section.id !== selectedSectionId) return section;
          return {
            ...section,
            questions: [
              ...(section.questions || []).map((q) =>
                q.id === editingQuestion.id ? generated[0] : q
              ),
              ...extra,
            ],
          };
        });

        setExamData((prev) => ({ ...prev, sections: updatedSections }));
        resetQuestionForm();
        return;
      }

      if (examData.type === "mock" && currentCount + generated.length > 24) {
        alert(
          `لا يمكن إضافة ${generated.length} سؤال. الحد الأقصى 24 سؤال في القسم. المتاح الآن: ${Math.max(
            0,
            24 - currentCount
          )}`
        );
        return;
      }

      const updatedSections = examData.sections.map((section) => {
        if (section.id !== selectedSectionId) return section;
        return {
          ...section,
          questions: [...(section.questions || []), ...generated],
        };
      });

      setExamData((prev) => ({ ...prev, sections: updatedSections }));
      resetQuestionForm();
      return;
    }

    // General MCQ & other types
    if (!currentQuestion) return;

    if (examData.type === "mock" && !canAddMoreQuestions(selectedSectionId)) {
      alert(
        "لا يمكن إضافة أكثر من 24 سؤال في قسم واحد لنوع الاختبار المحاكي"
      );
      return;
    }

    let newQuestion = {
      id: editingQuestion ? editingQuestion.id : Date.now(),
      type: questionType,
      question: currentQuestion,
      sectionId: selectedSectionId,
    };

    switch (questionType) {
      case "mcq": {
        newQuestion = {
          ...newQuestion,
          mcqSubType: "general",
          options: mcqOptions.map(normalizeOption),
          correctAnswer: mcqCorrectAnswer,
        };
        break;
      }
      case "trueFalse": {
        newQuestion = {
          ...newQuestion,
          correctAnswer: trueFalseAnswer,
          explanation: trueFalseExplanation,
        };
        break;
      }
      case "essay": {
        newQuestion = { ...newQuestion, modelAnswer: modalAnswer };
        break;
      }
      case "complete": {
        newQuestion = {
          ...newQuestion,
          text: completeText,
          answers: completeAnswers,
        };
        break;
      }
      default:
        break;
    }

    const updatedSections = examData.sections.map((section) => {
      if (section.id !== selectedSectionId) return section;

      if (editingQuestion) {
        return {
          ...section,
          questions: (section.questions || []).map((q) =>
            q.id === editingQuestion.id ? newQuestion : q
          ),
        };
      }

      return {
        ...section,
        questions: [...(section.questions || []), newQuestion],
      };
    });

    setExamData((prev) => ({ ...prev, sections: updatedSections }));
    resetQuestionForm();
  };

  /* ---------------------- Edit MCQ for passage/chemical ------------------- */
  const editMcqPassageQuestion = (question) => {
    setQuestionType("mcq");
    setCurrentQuestion(question.question || "");
    setMcqSubType(question.mcqSubType || "general");

    if (question.mcqSubType && question.mcqSubType !== "general") {
      setMcqPassages((prev) => ({
        ...prev,
        [question.mcqSubType]: [
          {
            id: question.passage?.id || `${Date.now()}-p`,
            content: question.passage?.content || "",
            questions: [
              {
                id: `${Date.now()}-q`,
                text: question.question || "",
                options: (question.options || []).map(normalizeOption),
                correctIndex:
                  typeof question.correctAnswer === "number"
                    ? question.correctAnswer
                    : 0,
              },
            ],
          },
        ],
      }));
    } else {
      setMcqOptions(
        (question.options || [
          emptyOption(),
          emptyOption(),
          emptyOption(),
          emptyOption(),
        ]).map(normalizeOption)
      );
      setMcqCorrectAnswer(
        typeof question.correctAnswer === "number"
          ? question.correctAnswer
          : 0
      );
    }

    setEditingQuestion(question);
  };

  /* ------------------------------- UI ------------------------------- */
  return (
    <div
      className="max-w-6xl mx-auto space-y-6 p-6 bg-gray-50 min-h-screen"
      dir="rtl"
    >
      {/* Header Stats */}
      <QuestionStats
        examData={examData}
        getEstimatedDuration={getEstimatedDuration}
        getTotalQuestions={getTotalQuestions}
      />

      {/* Main Exam Info */}
      <ExamMainInfo
        colorMap={colorMap}
        examData={examData}
        exam_types={exam_types}
        getEstimatedDuration={getEstimatedDuration}
        setExamData={setExamData}
      />

      {/* Sections Picker */}
      <QuestionSections
        examData={examData}
        filteredSection={filteredSection}
        onAddSection={onAddSection}
      />

      {examData?.name && examData?.sections?.length > 0 && (
        <>
          <Card title="إنشاء الأسئلة" icon={Edit3}>
            <div className="space-y-6">
              {/* Type selector */}
              <QuestionTypeSelector
                colorMap={colorMap}
                questionType={questionType}
                onTypeChange={handleQuestionTypeChange}
              />

              {/* Section dropdown + selected card */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700">
                    اختر القسم لإضافة السؤال
                  </label>
                  {selectedSection && (
                    <Tag color="blue">
                      إجمالي أسئلة القسم: {getQuestionsCount(selectedSection.id)}
                    </Tag>
                  )}
                </div>

                <Select
                  style={{ width: "100%", height: "105%", padding: "10px 0px" }}
                  placeholder="اختر قسمًا"
                  value={selectedSectionId ?? undefined}
                  onChange={(v) => setSelectedSectionId(v)}
                  showSearch
                  optionFilterProp="label"
                  dropdownStyle={{ borderRadius: 12 }}
                  options={examData.sections.map((section) => ({
                    value: section.id,
                    label: (
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div
                            className="font-medium text-gray-800"
                            dangerouslySetInnerHTML={{ __html: section?.name }}
                          />
                          {section?.desc ? (
                            <div
                              className="text-xs text-gray-500"
                              dangerouslySetInnerHTML={{ __html: section?.desc }}
                            />
                          ) : null}
                        </div>
                      </div>
                    ),
                  }))}
                  dropdownRender={(menu) => (
                    <div className="p-2">
                      <div className="px-2 pb-2 text-xs text-gray-500">
                        اختر من الأقسام المضافة بالأسفل
                      </div>
                      <div className="rounded-xl border">{menu}</div>
                    </div>
                  )}
                />

                {selectedSection && (
                  <div className="p-4 rounded-2xl border bg-white shadow-sm ring-1 ring-transparent hover:ring-blue-100 transition">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <h4
                          className="font-semibold text-gray-800"
                          dangerouslySetInnerHTML={{ __html: selectedSection.name }}
                        />
                        {selectedSection?.desc ? (
                          <p
                            className="text-sm text-gray-600"
                            dangerouslySetInnerHTML={{ __html: selectedSection.desc }}
                          />
                        ) : null}
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>
                            عدد الأسئلة:
                            <b className="mx-1">
                              {getQuestionsCount(selectedSection.id)}
                            </b>
                            / {examData.type === "mock" ? "24" : "∞"}
                          </span>
                          {examData.type === "mock" && (
                            <Tag color="volcano">اختبار محاكي</Tag>
                          )}
                        </div>
                      </div>
                      <div
                        className={`mt-1 w-4 h-4 rounded-full border-2 ${
                          selectedSectionId
                            ? "border-blue-500 bg-blue-500"
                            : "border-gray-300"
                        }`}
                        title="القسم الحالي"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* MCQ Subtype Selection (Segmented) */}
              {questionType === "mcq" && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium text-gray-700">
                      نوع الأسئلة المتعددة
                    </label>
                  </div>

                  <div className="rounded-2xl border bg-white p-3 shadow-sm">
                    <Segmented
                      size="large"
                      value={mcqSubType}
                      onChange={(v) => setMcqSubType(v)}
                      options={[
                        {
                          label: (
                            <div className="flex items-center gap-2">
                              <ListChecks className="w-4 h-4" />
                              <span>أسئلة عامة</span>
                            </div>
                          ),
                          value: "general",
                        },
                        {
                          label: (
                            <div className="flex items-center gap-2">
                              <FlaskConical className="w-4 h-4" />
                              <span>معادلات</span>
                            </div>
                          ),
                          value: "chemical",
                        },
                        {
                          label: (
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4" />
                              <span>قطعة</span>
                            </div>
                          ),
                          value: "passage",
                        },
                      ]}
                    />
                  </div>

                  {/* General MCQ */}
                  {mcqSubType === "general" ? (
                    <div className="space-y-5">
                      <LabeledEditor
                        label="نص السؤال"
                        value={currentQuestion}
                        onChange={setCurrentQuestion}
                        editorMinH={160}
                        allowImages
                      />

                      <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700">
                          خيارات الإجابة (لكل خيار نص + شرح)
                        </label>

                        {mcqOptions.map((option, index) => {
                          const letter = String.fromCharCode(65 + index); // A, B, C...
                          const isCorrect = mcqCorrectAnswer === index;

                          return (
                            <div
                              key={index}
                              className={`border rounded-2xl p-4 bg-white space-y-3 shadow-sm transition ${
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
                                    checked={isCorrect}
                                    onChange={() => setMcqCorrectAnswer(index)}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                                    title="الإجابة الصحيحة"
                                  />
                                  إجابة صحيحة
                                </label>

                                {mcqOptions.length > 2 && (
                                  <button
                                    type="button"
                                    onClick={() => removeMcqOption(index)}
                                    className="ml-auto px-2 py-1 text-red-600 hover:text-red-800 text-xs rounded-lg hover:bg-red-50"
                                    title="حذف الخيار"
                                  >
                                    حذف
                                  </button>
                                )}
                              </div>

                              {/* Option text with images (fixed size enforced) */}
                              <LabeledEditor
                                label={`نص الخيار #${index + 1}`}
                                value={option.text}
                                onChange={(v) => updateMcqOption(index, "text", v)}
                                editorMinH={110}
                                allowImages
                              />

                              {/* Explanation with images (fixed size enforced) */}
                              <LabeledEditor
                                label={`شرح الخيار #${index + 1} (لماذا هو صحيح/خاطئ)`}
                                value={option.explanation}
                                onChange={(v) =>
                                  updateMcqOption(index, "explanation", v)
                                }
                                editorMinH={90}
                                allowImages
                              />
                            </div>
                          );
                        })}

                        <button
                          type="button"
                          onClick={addMcqOption}
                          className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded-xl border border-gray-200 bg-white hover:bg-gray-50 shadow-sm"
                        >
                          <PlusIcon className="w-4 h-4" />
                          إضافة خيار
                        </button>
                      </div>
                    </div>
                  ) : (
                    <McqSharedPassageEditor
                      key={`${mcqSubType}:${editingQuestion?.id ?? "new"}`}
                      mcqSubType={mcqSubType}
                      initialData={mcqPassages[mcqSubType] || []}
                      onPassagesChange={handleMcqPassagesChange}
                    />
                  )}
                </div>
              )}

              {/* Non-MCQ question prompt (allow images too) */}
              {questionType !== "mcq" && (
                <LabeledEditor
                  label="نص السؤال"
                  value={currentQuestion}
                  onChange={setCurrentQuestion}
                  editorMinH={160}
                  allowImages
                />
              )}

              {questionType === "trueFalse" && (
                <>
                  <TrueFalseQuestions
                    setTrueFalseAnswer={setTrueFalseAnswer}
                    setTrueFalseExplanation={setTrueFalseExplanation}
                    trueFalseAnswer={trueFalseAnswer}
                    trueFalseExplanation={trueFalseExplanation}
                  />
                </>
              )}

              {questionType === "essay" && (
                <LabeledEditor
                  label="الإجابة النموذجية"
                  value={modalAnswer}
                  onChange={setModalAnswer}
                  editorMinH={160}
                  allowImages
                />
              )}

              {questionType === "complete" && (
                <CompleteQuestions
                  addCompleteAnswer={addCompleteAnswer}
                  completeAnswers={completeAnswers}
                  completeText={completeText}
                  removeCompleteAnswer={removeCompleteAnswer}
                  setCompleteText={setCompleteText}
                  updateCompleteAnswer={updateCompleteAnswer}
                />
              )}

              {/* Sticky action bar */}
              <div className="pt-4 border-t sticky bottom-0 bg-gray-50/75 backdrop-blur z-10">
                <button
                  onClick={addOrUpdateQuestion}
                  disabled={
                    !selectedSectionId ||
                    (questionType !== "mcq" && !currentQuestion) ||
                    (examData.type === "mock" &&
                      !canAddMoreQuestions(selectedSectionId))
                  }
                  className="w-full inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-200 bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 px-4 py-3"
                >
                  {editingQuestion ? <Save className="h-4 w-4" /> : <PlusIcon className="h-4 w-4" />}
                  {editingQuestion ? "تحديث السؤال" : "إضافة السؤال"}
                </button>
                {examData.type === "mock" && selectedSectionId && (
                  <p className="text-sm text-gray-500 mt-2 text-center">
                    {getQuestionsCount(selectedSectionId)}/24 سؤال في هذا القسم
                  </p>
                )}
              </div>
            </div>
          </Card>

          {/* Questions Display */}
          <DisplayQuestions
            toggleSection={toggleSection}
            examData={examData}
            expandedSections={expandedSections}
            questionTypes={questionTypes}
            setCompleteAnswers={setCompleteAnswers}
            setCompleteText={setCompleteText}
            setCurrentQuestion={setCurrentQuestion}
            setEditingQuestion={setEditingQuestion}
            setExamData={setExamData}
            setMcqCorrectAnswer={setMcqCorrectAnswer}
            setMcqOptions={setMcqOptions}
            setModalAnswer={setModalAnswer}
            setQuestionType={setQuestionType}
            setSelectedSectionId={setSelectedSectionId}
            setTrueFalseAnswer={setTrueFalseAnswer}
            setTrueFalseExplanation={setTrueFalseExplanation}
            setMcqSubType={setMcqSubType}
            editMcqPassageQuestion={editMcqPassageQuestion}
          />

          {/* Final Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              className="inline-flex items-center gap-2 px-4 py-3 text-sm rounded-xl border border-gray-200 bg-white hover:bg-gray-50"
              onClick={() => {
                if (confirm("هل أنت متأكد من إلغاء التغييرات؟")) {
                  setExamData({
                    name: "",
                    duration: "",
                    type: "",
                    sections: [],
                  });
                  resetQuestionForm();
                  setSelectedSectionId(null);
                  setExpandedSections({});
                }
              }}
            >
              <X className="h-4 w-4" />
              إلغاء
            </button>

            <button
              className="inline-flex items-center gap-2 px-4 py-3 text-sm rounded-xl bg-blue-600 text-white hover:bg-blue-700"
              onClick={() => {
                alert("تم حفظ الاختبار بنجاح!");
                console.log("Exam Data:", examData);
              }}
              disabled={
                !examData.name || !examData.type || examData.sections.length === 0
              }
            >
              <Save className="h-4 w-4" />
              حفظ الاختبار
            </button>
          </div>
        </>
      )}

      {/* Empty State */}
      {(!examData.name || examData.sections.length === 0) && (
        <div className="text-center py-12">
          <div className="bg-blue-50 p-6 rounded-full w-20 h-20 mx-auto flex items-center justify-center mb-4">
            <BookOpen className="h-10 w-10 text-blue-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            ابدأ بإنشاء اختبار جديد
          </h3>
          <p className="text-gray-600 mb-6">
            املأ معلومات الاختبار الأساسية وأضف الأقسام لبدء إنشاء الأسئلة
          </p>
        </div>
      )}
    </div>
  );
}
