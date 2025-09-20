"use client";
import React, { useCallback, useEffect, useState } from "react";
import { PlusIcon, Edit3, BookOpen, Save, X } from "lucide-react";
import QuestionStats from "./QuestionStats";
import Card from "./ExamCard";
import Input from "./ExamInput";
import ExamMainInfo from "./ExamMainInfo";
import QuestionSections from "./QuestionSections";
import TrueFalseQuestions from "./TrueFalseQuestions";
import EssayQuestions from "./EssayQuestions";
import CompleteQuestions from "./CompleteQuestions";
import DisplayQuestions from "./DisplayQuestions";
import QuestionTypeSelector from "./QuestionTypeSelector";
import McqSharedPassageEditor from "./McqQuestions";
import { colorMap, exam_types, mock_exam_section_Data, questionTypes } from "./utils";

/* ================= Button (robust icon) ================= */
const Button = ({
  variant = "primary",
  size = "md",
  icon,
  loading = false,
  children,
  className = "",
  ...props
}) => {
  const base =
    "inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-sm hover:shadow-md",
    secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500",
    outline: "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 focus:ring-gray-500",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    success: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500",
    ghost: "bg-transparent text-gray-700 hover:bg-gray-50 focus:ring-gray-300",
  };
  const sizes = { sm: "px-3 py-2 text-sm", md: "px-4 py-3 text-sm", lg: "px-6 py-3 text-base" };

  const renderIcon = () => {
    if (loading) {
      return <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />;
    }
    if (!icon) return null;
    if (typeof icon === "function") {
      const IconComp = icon;
      return <IconComp className="h-4 w-4" />;
    }
    return icon;
  };

  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} disabled={loading} {...props}>
      {renderIcon()}
      {children}
    </button>
  );
};
/* ======================================================== */

export default function ExamMainData({ examData: editExamData }) {
  const [examData, setExamData] = useState({ name: "", duration: "", type: "", sections: [] });
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

  // ===== MCQ (general) now supports explanation per option =====
  const emptyOption = () => ({ text: "", explanation: "" });
  const normalizeOption = (opt) => {
    if (typeof opt === "string") return { text: opt, explanation: "" };
    if (opt && typeof opt === "object") return { text: opt.text || "", explanation: opt.explanation || "" };
    return emptyOption();
  };
  const [mcqOptions, setMcqOptions] = useState([emptyOption(), emptyOption(), emptyOption(), emptyOption()]);
  const [mcqCorrectAnswer, setMcqCorrectAnswer] = useState(0);

  // MCQ subtype
  const [mcqSubType, setMcqSubType] = useState("general"); // "general" | "chemical" | "passage"

  // MCQ passages store per subtype (for the editor)
  const [mcqPassages, setMcqPassages] = useState({ chemical: [], passage: [] });

  /* ----------------------------- Effects ----------------------------- */
  // Sync sections list based on type
  useEffect(() => {
    if (examData?.type === "intern") setFilteredSection(mock_exam_section_Data[1]);
    else if (examData?.type === "mock") setFilteredSection(mock_exam_section_Data[2]);
    else setFilteredSection([]);
  }, [examData?.type]);

  useEffect(() => {
    if (editExamData) setExamData(editExamData);
  }, []);

  // Auto-select first section when sections change
  useEffect(() => {
    if (examData?.sections?.length > 0 && !selectedSectionId) setSelectedSectionId(examData.sections[0].id);
  }, [examData?.sections, selectedSectionId]);

  /* ----------------------------- Helpers ----------------------------- */
  const onAddSection = (section) => {
    const isAdded = examData?.sections.some((s) => s.id === section.id);
    if (isAdded) return;
    const newSection = { ...section, questions: [] };
    setExamData((prev) => ({ ...prev, sections: [...prev.sections, newSection] }));
  };

  const toggleSection = (sectionId) => setExpandedSections((prev) => ({ ...prev, [sectionId]: !prev[sectionId] }));

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

  const addCompleteAnswer = () => setCompleteAnswers((a) => [...a, { answer: "" }]);
  const removeCompleteAnswer = (index) => setCompleteAnswers((a) => a.filter((_, i) => i !== index));
  const updateCompleteAnswer = (index, value) => {
    setCompleteAnswers((a) => {
      const next = [...a];
      next[index].answer = value;
      return next;
    });
  };

  // ====== Updated MCQ general handlers (text + explanation) ======
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
      setMcqCorrectAnswer((curr) => (curr >= index ? Math.max(0, curr - 1) : curr));
      return next;
    });
  };

  const getQuestionsCount = (sectionId) => examData.sections.find((s) => s.id === sectionId)?.questions?.length || 0;
  const getTotalQuestions = () => examData.sections.reduce((acc, s) => acc + (s.questions?.length || 0), 0);
  const getEstimatedDuration = () => (examData.type === "mock" ? examData.sections.length * 25 : parseInt(examData.duration || 0));
  const canAddMoreQuestions = (sectionId) => (examData.type !== "mock" ? true : getQuestionsCount(sectionId) < 24);

  // Receive passages from child (stable)
  const handleMcqPassagesChange = useCallback(
    (passages) => {
      setMcqPassages((prev) => ({ ...prev, [mcqSubType]: passages }));
    },
    [mcqSubType]
  );

  useEffect(() => {
    console.log(examData);
  }, [examData]);

  /* ---------------------- Add / Update Question ---------------------- */
  const addOrUpdateQuestion = () => {
    if (!selectedSectionId) return;

    const currentCount = getQuestionsCount(selectedSectionId);

    // Non-general MCQ: flatten groups -> individual questions
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
            options: Array.isArray(q.options) ? q.options.map(normalizeOption) : [],
            correctAnswer: typeof q.correctIndex === "number" ? q.correctIndex : 0,
            passage: { id: p.id, content: p.content || "" },
            sectionId: selectedSectionId,
          });
        });
      });

      if (generated.length === 0) return;

      if (editingQuestion) {
        generated[0] = { ...generated[0], id: editingQuestion.id };

        const extra = generated.slice(1);
        const available = examData.type === "mock" ? Math.max(0, 24 - currentCount) : Infinity;
        if (extra.length > available) {
          alert(`لا يمكن إضافة ${extra.length} سؤال إضافي. المتاح الآن: ${available}`);
          const updatedSectionsOnlyReplace = examData.sections.map((section) => {
            if (section.id !== selectedSectionId) return section;
            return {
              ...section,
              questions: (section.questions || []).map((q) => (q.id === editingQuestion.id ? generated[0] : q)),
            };
          });
          setExamData((prev) => ({ ...prev, sections: updatedSectionsOnlyReplace }));
          resetQuestionForm();
          return;
        }

        const updatedSections = examData.sections.map((section) => {
          if (section.id !== selectedSectionId) return section;
          return {
            ...section,
            questions: [
              ...(section.questions || []).map((q) => (q.id === editingQuestion.id ? generated[0] : q)),
              ...extra,
            ],
          };
        });

        setExamData((prev) => ({ ...prev, sections: updatedSections }));
        resetQuestionForm();
        return;
      }

      if (examData.type === "mock" && currentCount + generated.length > 24) {
        alert(`لا يمكن إضافة ${generated.length} سؤال. الحد الأقصى 24 سؤال في القسم. المتاح الآن: ${Math.max(0, 24 - currentCount)}`);
        return;
      }

      const updatedSections = examData.sections.map((section) => {
        if (section.id !== selectedSectionId) return section;
        return { ...section, questions: [...(section.questions || []), ...generated] };
      });

      setExamData((prev) => ({ ...prev, sections: updatedSections }));
      resetQuestionForm();
      return;
    }

    // باقي الأنواع + MCQ العام
    if (!currentQuestion) return;

    if (examData.type === "mock" && !canAddMoreQuestions(selectedSectionId)) {
      alert("لا يمكن إضافة أكثر من 24 سؤال في قسم واحد لنوع الاختبار المحاكي");
      return;
    }

    let newQuestion = { id: editingQuestion ? editingQuestion.id : Date.now(), type: questionType, question: currentQuestion, sectionId: selectedSectionId };

    switch (questionType) {
      case "mcq": {
        newQuestion = { ...newQuestion, mcqSubType: "general", options: mcqOptions.map(normalizeOption), correctAnswer: mcqCorrectAnswer };
        break;
      }
      case "trueFalse": {
        newQuestion = { ...newQuestion, correctAnswer: trueFalseAnswer, explanation: trueFalseExplanation };
        break;
      }
      case "essay": {
        newQuestion = { ...newQuestion, modelAnswer: modalAnswer };
        break;
      }
      case "complete": {
        newQuestion = { ...newQuestion, text: completeText, answers: completeAnswers };
        break;
      }
      default:
        break;
    }

    const updatedSections = examData.sections.map((section) => {
      if (section.id !== selectedSectionId) return section;

      if (editingQuestion) {
        return { ...section, questions: (section.questions || []).map((q) => (q.id === editingQuestion.id ? newQuestion : q)) };
      }

      return { ...section, questions: [...(section.questions || []), newQuestion] };
    });

    setExamData((prev) => ({ ...prev, sections: updatedSections }));
    resetQuestionForm();
  };

  /* ---------------------- Editing passage/general MCQ ------------------- */
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
                correctIndex: typeof question.correctAnswer === "number" ? question.correctAnswer : 0,
              },
            ],
          },
        ],
      }));
    } else {
      setMcqOptions((question.options || [emptyOption(), emptyOption(), emptyOption(), emptyOption()]).map(normalizeOption));
      setMcqCorrectAnswer(typeof question.correctAnswer === "number" ? question.correctAnswer : 0);
    }

    setEditingQuestion(question);
  };

  /* ------------------------------- UI ------------------------------- */
  return (
    <div className="max-w-6xl mx-auto space-y-6 p-6 bg-gray-50 min-h-screen" dir="rtl">
      {/* Header Stats */}
      <QuestionStats examData={examData} getEstimatedDuration={getEstimatedDuration} getTotalQuestions={getTotalQuestions} />

      {/* Main Exam Info */}
      <ExamMainInfo colorMap={colorMap} examData={examData} exam_types={exam_types} getEstimatedDuration={getEstimatedDuration} setExamData={setExamData} />

      {/* Sections Selection */}
      <QuestionSections examData={examData} filteredSection={filteredSection} onAddSection={onAddSection} />

      {examData?.name && examData?.sections?.length > 0 && (
        <>
          <Card title="إنشاء الأسئلة" icon={Edit3}>
            <div className="space-y-6">
              <QuestionTypeSelector colorMap={colorMap} questionType={questionType} onTypeChange={handleQuestionTypeChange} />

              {/* Section Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">اختر القسم لإضافة السؤال</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {examData.sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setSelectedSectionId(section.id)}
                      className={`p-4 rounded-lg border-2 text-right transition-all duration-200 ${selectedSectionId === section.id ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"}`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{section.name}</h4>
                          <p className="text-xs text-gray-500 mt-1">{getQuestionsCount(section.id)} / {examData.type === "mock" ? "24" : "∞"}</p>
                        </div>
                        <div className={`w-4 h-4 rounded-full border-2 ${selectedSectionId === section.id ? "border-blue-500 bg-blue-500" : "border-gray-300"}`} />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* MCQ Subtype Selection */}
              {questionType === "mcq" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">نوع الأسئلة المتعددة</label>
                    <div className="grid grid-cols-3 gap-3">
                      <button onClick={() => setMcqSubType("general")} className={`p-3 rounded-lg border-2 text-center ${mcqSubType === "general" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"}`}>أسئلة عامة</button>
                      <button onClick={() => setMcqSubType("chemical")} className={`p-3 rounded-lg border-2 text-center ${mcqSubType === "chemical" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"}`}>معادلات</button>
                      <button onClick={() => setMcqSubType("passage")} className={`p-3 rounded-lg border-2 text-center ${mcqSubType === "passage" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"}`}>قطعة</button>
                    </div>
                  </div>

                  {/* General MCQ with explanations */}
                  {mcqSubType === "general" ? (
                    <div className="space-y-4">
                      <Input label="السؤال" placeholder="أدخل نص السؤال هنا" value={currentQuestion} onChange={(e) => setCurrentQuestion(e.target.value)} />

                      <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700">خيارات الإجابة (مع الشرح)</label>
                        {mcqOptions.map((option, index) => (
                          <div key={index} className="border rounded-md p-3 bg-white space-y-2">
                            <div className="flex items-center gap-2">
                              <input type="radio" checked={mcqCorrectAnswer === index} onChange={() => setMcqCorrectAnswer(index)} className="h-4 w-4 text-blue-600 focus:ring-blue-500" />
                              <input
                                type="text"
                                value={option.text}
                                onChange={(e) => updateMcqOption(index, "text", e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder={`الخيار ${index + 1}`}
                              />
                              {mcqOptions.length > 2 && (
                                <button type="button" onClick={() => removeMcqOption(index)} className="p-2 text-red-600 hover:text-red-800">✕</button>
                              )}
                            </div>
                            <textarea
                              value={option.explanation}
                              onChange={(e) => updateMcqOption(index, "explanation", e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              rows={2}
                              placeholder="اكتب شرح هذا الاختيار (لماذا هو صحيح/خاطئ)"
                            />
                          </div>
                        ))}
                        <Button type="button" onClick={addMcqOption} variant="outline" icon={<PlusIcon />} className="text-sm">إضافة خيار</Button>
                      </div>
                    </div>
                  ) : (
                    // Passage / Chemical editor
                    <McqSharedPassageEditor
                      key={`${mcqSubType}:${editingQuestion?.id ?? "new"}`}
                      mcqSubType={mcqSubType}
                      initialData={mcqPassages[mcqSubType] || []}
                      onPassagesChange={handleMcqPassagesChange}
                    />
                  )}
                </div>
              )}

              {/* Non-MCQ question's prompt */}
              {questionType !== "mcq" && (
                <Input label="السؤال" placeholder="أدخل نص السؤال هنا" value={currentQuestion} onChange={(e) => setCurrentQuestion(e.target.value)} />)
              }

              {questionType === "trueFalse" && (
                <TrueFalseQuestions setTrueFalseAnswer={setTrueFalseAnswer} setTrueFalseExplanation={setTrueFalseExplanation} trueFalseAnswer={trueFalseAnswer} trueFalseExplanation={trueFalseExplanation} />
              )}

              {questionType === "essay" && <EssayQuestions modalAnswer={modalAnswer} setModalAnswer={setModalAnswer} />}

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

              <div className="pt-4 border-t">
                <Button
                  onClick={addOrUpdateQuestion}
                  disabled={!selectedSectionId || (questionType !== "mcq" && !currentQuestion) || (examData.type === "mock" && !canAddMoreQuestions(selectedSectionId))}
                  icon={editingQuestion ? <Save /> : <PlusIcon />}
                  className="w-full"
                >
                  {editingQuestion ? "تحديث السؤال" : "إضافة السؤال"}
                </Button>
                {examData.type === "mock" && selectedSectionId && (
                  <p className="text-sm text-gray-500 mt-2 text-center">{getQuestionsCount(selectedSectionId)}/24 سؤال في هذا القسم</p>
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
            <Button
              variant="outline"
              icon={<X />}
              onClick={() => {
                if (confirm("هل أنت متأكد من إلغاء التغييرات؟")) {
                  setExamData({ name: "", duration: "", type: "", sections: [] });
                  resetQuestionForm();
                  setSelectedSectionId(null);
                  setExpandedSections({});
                }
              }}
            >
              إلغاء
            </Button>

            <Button
              variant="primary"
              icon={<Save />}
              onClick={() => {
                alert("تم حفظ الاختبار بنجاح!");
                console.log("Exam Data:", examData);
              }}
              disabled={!examData.name || !examData.type || examData.sections.length === 0}
            >
              حفظ الاختبار
            </Button>
          </div>
        </>
      )}

      {/* Empty State */}
      {(!examData.name || examData.sections.length === 0) && (
        <div className="text-center py-12">
          <div className="bg-blue-50 p-6 rounded-full w-20 h-20 mx-auto flex items-center justify-center mb-4">
            <BookOpen className="h-10 w-10 text-blue-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">ابدأ بإنشاء اختبار جديد</h3>
          <p className="text-gray-600 mb-6">املأ معلومات الاختبار الأساسية وأضف الأقسام لبدء إنشاء الأسئلة</p>
        </div>
      )}
    </div>
  );
}
