"use client";
import React, { useEffect, useState } from "react";
import { PlusIcon, Edit3, Save, X, BookOpen } from "lucide-react";
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

/* =============== Local Button (يدعم أيقونة كعنصر) =============== */
const Button = ({
  variant = "primary",
  size = "md",
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
  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-3 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={loading}
      {...props}
    >
      {loading && <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />}
      {children}
    </button>
  );
};
/* ================================================================ */

export default function ExamMainData() {
  const [examData, setExamData] = useState({
    name: "",
    duration: "",
    type: "",
    sections: [],
  });

  const [filteredSection, setFilteredSection] = useState([]);
  const [questionType, setQuestionType] = useState("mcq");

  // common
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [selectedSectionId, setSelectedSectionId] = useState(null);
  const [expandedSections, setExpandedSections] = useState({});
  const [editingQuestion, setEditingQuestion] = useState(null);

  // true/false
  const [trueFalseAnswer, setTrueFalseAnswer] = useState(null);
  const [trueFalseExplanation, setTrueFalseExplanation] = useState("");

  // essay
  const [modalAnswer, setModalAnswer] = useState("");

  // complete
  const [completeText, setCompleteText] = useState("");
  const [completeAnswers, setCompleteAnswers] = useState([{ answer: "" }]);

  // mcq general
  const [mcqOptions, setMcqOptions] = useState(["", "", "", ""]);
  const [mcqCorrectAnswer, setMcqCorrectAnswer] = useState(0);

  // mcq subtype
  const [mcqSubType, setMcqSubType] = useState("general"); // "general" | "chemical" | "passage"

  // mcq passages store
  const [mcqPassages, setMcqPassages] = useState({
    chemical: [],
    passage: [],
  });

  /* ---------------- Effects ---------------- */
  useEffect(() => {
    if (examData?.type === "intern") setFilteredSection(mock_exam_section_Data[1]);
    else if (examData?.type === "mock") setFilteredSection(mock_exam_section_Data[2]);
    else setFilteredSection([]);
  }, [examData?.type]);

  useEffect(() => {
    if (examData?.sections?.length > 0 && !selectedSectionId) {
      setSelectedSectionId(examData.sections[0].id);
    }
  }, [examData?.sections, selectedSectionId]);

  /* --------------- Helpers ----------------- */
  const onAddSection = (section) => {
    if (examData.sections.some((s) => s.id === section.id)) return;
    const newSection = { ...section, questions: [] };
    setExamData((prev) => ({ ...prev, sections: [...prev.sections, newSection] }));
  };

  const toggleSection = (sectionId) => {
    setExpandedSections((prev) => ({ ...prev, [sectionId]: !prev[sectionId] }));
  };

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
    setMcqOptions(["", "", "", ""]);
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

  const updateMcqOption = (index, value) => {
    setMcqOptions((opts) => {
      const next = [...opts];
      next[index] = value;
      return next;
    });
  };

  const addMcqOption = () => setMcqOptions((opts) => [...opts, ""]);
  const removeMcqOption = (index) => {
    setMcqOptions((opts) => {
      if (opts.length <= 2) return opts;
      const next = opts.filter((_, i) => i !== index);
      setMcqCorrectAnswer((curr) => (curr >= index ? Math.max(0, curr - 1) : curr));
      return next;
    });
  };

  const getQuestionsCount = (sectionId) =>
    examData.sections.find((s) => s.id === sectionId)?.questions?.length || 0;

  const getTotalQuestions = () =>
    examData.sections.reduce((acc, s) => acc + (s.questions?.length || 0), 0);

  const getEstimatedDuration = () =>
    examData.type === "mock" ? examData.sections.length * 25 : parseInt(examData.duration || 0);

  const canAddMoreQuestions = (sectionId) =>
    examData.type !== "mock" ? true : getQuestionsCount(sectionId) < 24;

  const handleMcqPassagesChange = (passages, subType) => {
    if (subType === "chemical" || subType === "passage") {
      setMcqPassages((prev) => ({ ...prev, [subType]: passages }));
    }
  };

  /* --------- Add / Update Question ---------- */
  const addOrUpdateQuestion = () => {
    if (!currentQuestion || !selectedSectionId) return;
    if (examData.type === "mock" && !canAddMoreQuestions(selectedSectionId)) {
      alert("لا يمكن إضافة أكثر من 24 سؤال في قسم واحد لنوع الاختبار المحاكي");
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
        if (mcqSubType !== "general") {
          newQuestion = {
            ...newQuestion,
            mcqSubType,
            passages: mcqPassages[mcqSubType] || [],
          };
        } else {
          newQuestion = {
            ...newQuestion,
            mcqSubType,
            options: mcqOptions,
            correctAnswer: mcqCorrectAnswer,
          };
        }
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
        return {
          ...section,
          questions: (section.questions || []).map((q) => (q.id === editingQuestion.id ? newQuestion : q)),
        };
      }

      return { ...section, questions: [...(section.questions || []), newQuestion] };
    });

    setExamData((prev) => ({ ...prev, sections: updatedSections }));
    resetQuestionForm();
  };

  /* ---- Editing MCQ (passage/chemical) ----- */
  const editMcqPassageQuestion = (question) => {
    setQuestionType("mcq");
    setCurrentQuestion(question.question || "");
    setMcqSubType(question.mcqSubType || "general");

    if (question.mcqSubType && question.mcqSubType !== "general") {
      setMcqPassages((prev) => ({ ...prev, [question.mcqSubType]: question.passages || [] }));
    } else {
      // general
      setMcqOptions(question.options || ["", "", "", ""]);
      setMcqCorrectAnswer(typeof question.correctAnswer === "number" ? question.correctAnswer : 0);
    }

    setEditingQuestion(question);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-6 bg-gray-50 min-h-screen" dir="rtl">
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

      {/* Sections Selection */}
      <QuestionSections examData={examData} filteredSection={filteredSection} onAddSection={onAddSection} />
      {examData?.name && examData?.sections?.length > 0 ? (
        <>
          <Card title="إنشاء الأسئلة" icon={Edit3}>
            <div className="space-y-6">
              <QuestionTypeSelector colorMap={colorMap} questionType={questionType} onTypeChange={handleQuestionTypeChange} />

              {/* Choose section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">اختر القسم لإضافة السؤال</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {examData.sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setSelectedSectionId(section.id)}
                      className={`p-4 rounded-lg border-2 text-right transition-all duration-200 ${
                        selectedSectionId === section.id ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{section.name}</h4>
                          <p className="text-xs text-gray-500 mt-1">
                            {getQuestionsCount(section.id)} / {examData.type === "mock" ? "24" : "∞"}
                          </p>
                        </div>
                        <div
                          className={`w-4 h-4 rounded-full border-2 ${
                            selectedSectionId === section.id ? "border-blue-500 bg-blue-500" : "border-gray-300"
                          }`}
                        />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* MCQ Subtype + Editors */}
              {questionType === "mcq" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">نوع الأسئلة المتعددة</label>
                    <div className="grid grid-cols-3 gap-3">
                      <button
                        onClick={() => setMcqSubType("general")}
                        className={`p-3 rounded-lg border-2 text-center ${
                          mcqSubType === "general" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        أسئلة عامة
                      </button>
                      <button
                        onClick={() => setMcqSubType("chemical")}
                        className={`p-3 rounded-lg border-2 text-center ${
                          mcqSubType === "chemical" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        معادلات
                      </button>
                      <button
                        onClick={() => setMcqSubType("passage")}
                        className={`p-3 rounded-lg border-2 text-center ${
                          mcqSubType === "passage" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        قطعة
                      </button>
                    </div>
                  </div>

                  {mcqSubType === "general" ? (
                    <div className="space-y-4">
                      <Input
                        label="السؤال"
                        placeholder="أدخل نص السؤال هنا"
                        value={currentQuestion}
                        onChange={(e) => setCurrentQuestion(e.target.value)}
                      />
                      <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700">خيارات الإجابة</label>
                        {mcqOptions.map((option, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <input
                              type="radio"
                              checked={mcqCorrectAnswer === index}
                              onChange={() => setMcqCorrectAnswer(index)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                            />
                            <input
                              type="text"
                              value={option}
                              onChange={(e) => updateMcqOption(index, e.target.value)}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder={`الخيار ${index + 1}`}
                            />
                            {mcqOptions.length > 2 && (
                              <button
                                type="button"
                                onClick={() => removeMcqOption(index)}
                                className="p-2 text-red-600 hover:text-red-800"
                              >
                                ✕
                              </button>
                            )}
                          </div>
                        ))}
                        <Button type="button" onClick={addMcqOption} variant="outline" className="text-sm">
                          <PlusIcon className="h-4 w-4" />
                          إضافة خيار
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <McqSharedPassageEditor
                      mcqSubType={mcqSubType}
                      onPassagesChange={(passages) => handleMcqPassagesChange(passages, mcqSubType)}
                      initialData={mcqPassages[mcqSubType] || []}
                    />
                  )}
                </div>
              )}

              {/* Non-MCQ prompt */}
              {questionType !== "mcq" && (
                <Input
                  label="السؤال"
                  placeholder="أدخل نص السؤال هنا"
                  value={currentQuestion}
                  onChange={(e) => setCurrentQuestion(e.target.value)}
                />
              )}

              {questionType === "trueFalse" && (
                <TrueFalseQuestions
                  setTrueFalseAnswer={setTrueFalseAnswer}
                  setTrueFalseExplanation={setTrueFalseExplanation}
                  trueFalseAnswer={trueFalseAnswer}
                  trueFalseExplanation={trueFalseExplanation}
                />
              )}

              {questionType === "essay" && (
                <EssayQuestions modalAnswer={modalAnswer} setModalAnswer={setModalAnswer} />
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

              <div className="pt-4 border-t">
                <Button
                  onClick={addOrUpdateQuestion}
                  disabled={
                    !currentQuestion ||
                    !selectedSectionId ||
                    (examData.type === "mock" && !canAddMoreQuestions(selectedSectionId))
                  }
                  className="w-full"
                >
                  {editingQuestion ? <><Save className="h-4 w-4" /> تحديث السؤال</> : <><PlusIcon className="h-4 w-4" /> إضافة السؤال</>}
                </Button>
                {examData.type === "mock" && selectedSectionId && (
                  <p className="text-sm text-gray-500 mt-2 text-center">
                    {getQuestionsCount(selectedSectionId)}/24 سؤال في هذا القسم
                  </p>
                )}
              </div>
            </div>
          </Card>

          {/* Questions list */}
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
            /* مهم للمحرر المبني على قطع/معادلات */
            setMcqSubType={setMcqSubType}
            editMcqPassageQuestion={editMcqPassageQuestion}
          />

          {/* Final actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                if (confirm("هل أنت متأكد من إلغاء التغييرات؟")) {
                  setExamData({ name: "", duration: "", type: "", sections: [] });
                  resetQuestionForm();
                  setSelectedSectionId(null);
                  setExpandedSections({});
                }
              }}
            >
              <X className="h-4 w-4" />
              إلغاء
            </Button>

            <Button
              variant="primary"
              onClick={() => {
                alert("تم حفظ الاختبار بنجاح!");
                console.log("Exam Data:", examData);
              }}
              disabled={!examData.name || !examData.type || examData.sections.length === 0}
            >
              <Save className="h-4 w-4" />
              حفظ الاختبار
            </Button>
          </div>
        </>
      ) : (
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
