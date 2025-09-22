"use client";
import React from "react";
import { Edit3, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import Card from "./ExamCard";
import Button from "../atoms/Button";

export default function DisplayQuestions({
  toggleSection,
  examData,
  expandedSections,
  questionTypes,
  setCompleteAnswers,
  setCompleteText,
  setCurrentQuestion,
  setEditingQuestion,
  setExamData,
  setMcqCorrectAnswer,
  setMcqOptions,
  setModalAnswer,
  setQuestionType,
  setSelectedSectionId,
  setTrueFalseAnswer,
  setTrueFalseExplanation,
  setMcqSubType,
  editMcqPassageQuestion,
}) {
  const handleEditQuestion = (question, sectionId) => {
    setQuestionType(question.type);
    setCurrentQuestion(question.question || "");
    setSelectedSectionId(sectionId);
    setEditingQuestion(question);

    // Set question type specific data
    switch (question.type) {
      case "mcq":
        if (question.mcqSubType && question.mcqSubType !== "general") {
          // Handle passage-based MCQ questions
          editMcqPassageQuestion(question);
        } else {
          // Handle general MCQ questions
          setMcqOptions(question.options || [{ text: "", explanation: "" }, { text: "", explanation: "" }, { text: "", explanation: "" }, { text: "", explanation: "" }]);
          setMcqCorrectAnswer(
            typeof question.correctAnswer === "number" ? question.correctAnswer : 0
          );
          setMcqSubType("general");
        }
        break;
      case "trueFalse":
        setTrueFalseAnswer(question.correctAnswer);
        setTrueFalseExplanation(question.explanation || "");
        break;
      case "essay":
        setModalAnswer(question.modelAnswer || "");
        break;
      case "complete":
        setCompleteText(question.text || "");
        setCompleteAnswers(question.answers || [{ answer: "" }]);
        break;
      default:
        break;
    }

    // Scroll to the question form
    document.getElementById("question-form")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleDeleteQuestion = (questionId, sectionId) => {
    if (confirm("هل أنت متأكد من حذف هذا السؤال؟")) {
      const updatedSections = examData.sections.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            questions: section.questions.filter((q) => q.id !== questionId),
          };
        }
        return section;
      });

      setExamData({ ...examData, sections: updatedSections });
    }
  };

  const renderQuestionContent = (question) => {
    switch (question.type) {
      case "mcq":
        return (
          <div className="space-y-2">
            <p className="text-sm text-gray-700" dangerouslySetInnerHTML={{ __html: question.question }}></p>
            <div className="space-y-1">
              {question.options?.map((option, idx) => {
                // Handle both string and object format options
                const optionText = typeof option === 'string' ? option : option.text;
                const optionExplanation = typeof option === 'object' ? option.explanation : '';
                
                return (
                  <div
                    key={idx}
                    className={`text-xs p-2 rounded ${
                      idx === question.correctAnswer
                        ? "bg-green-100 text-green-800 border border-green-200"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    <div className="font-medium">
                      {String.fromCharCode(1632 + idx + 1)}. <span dangerouslySetInnerHTML={{ __html: optionText }}></span>
                    </div>
                    {optionExplanation && (
                      <div className="mt-1 text-xs text-gray-600 italic">
                        الشرح: <span dangerouslySetInnerHTML={{ __html: optionExplanation }}></span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            {question.passage && (
              <div className="mt-2 p-2 bg-blue-50 rounded border border-blue-200">
                <p className="text-xs text-blue-800 font-medium">القطعة:</p>
                <p className="text-xs text-blue-700" dangerouslySetInnerHTML={{ __html: question.passage.content }}></p>
              </div>
            )}
          </div>
        );
      case "trueFalse":
        return (
          <div className="space-y-2">
            <p className="text-sm text-gray-700" dangerouslySetInnerHTML={{ __html: question.question }}></p>
            <div
              className={`text-xs p-2 rounded ${
                question.correctAnswer
                  ? "bg-green-100 text-green-800 border border-green-200"
                  : "bg-red-100 text-red-800 border border-red-200"
              }`}
            >
              الإجابة: {question.correctAnswer ? "صحيح" : "خطأ"}
            </div>
            {question.explanation && (
              <div className="mt-2 p-2 bg-gray-50 rounded border border-gray-200">
                <p className="text-xs text-gray-800 font-medium">الشرح:</p>
                <p className="text-xs text-gray-700" dangerouslySetInnerHTML={{ __html: question.explanation }}></p>
              </div>
            )}
          </div>
        );
      case "essay":
        return (
          <div className="space-y-2">
            <p className="text-sm text-gray-700" dangerouslySetInnerHTML={{ __html: question.question }}></p>
            {question.modelAnswer && (
              <div className="mt-2 p-2 bg-blue-50 rounded border border-blue-200">
                <p className="text-xs text-blue-800 font-medium">الإجابة النموذجية:</p>
                <p className="text-xs text-blue-700" dangerouslySetInnerHTML={{ __html: question.modelAnswer }}></p>
              </div>
            )}
          </div>
        );
      case "complete":
        return (
          <div className="space-y-2">
            <p className="text-sm text-gray-700" dangerouslySetInnerHTML={{ __html: question.text }}></p>
            <div className="space-y-1">
              {question.answers?.map((answer, idx) => {
                const answerText = typeof answer === 'object' ? answer.answer : answer;
                return (
                  <div
                    key={idx}
                    className="text-xs p-2 bg-green-100 text-green-800 rounded border border-green-200"
                  >
                    الإجابة {idx + 1}: <span dangerouslySetInnerHTML={{ __html: answerText }}></span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      default:
        return <p className="text-sm text-gray-700" dangerouslySetInnerHTML={{ __html: question.question }}></p>;
    }
  };

  return (
    <Card title="الأسئلة المضافة" icon={Edit3}>
      <div className="space-y-4">
        {examData.sections.map((section) => (
          <div key={section.id} className="border rounded-lg overflow-hidden">
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full p-4 bg-gray-50 flex items-center justify-between text-right"
            >
              <div className="flex items-center gap-3">
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  {section.questions?.length || 0}
                </span>
                <h3 dangerouslySetInnerHTML={{__html : section?.name}} className="font-medium text-gray-900"></h3>
              </div>
              {expandedSections[section.id] ? (
                <ChevronUp className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              )}
            </button>

            {expandedSections[section.id] && (
              <div className="p-4 space-y-4">
                {section.questions?.length === 0 ? (
                  <p className="text-center text-gray-500 py-4">لا توجد أسئلة في هذا القسم بعد</p>
                ) : (
                  section.questions?.map((question, index) => (
                    <div
                      key={question.id}
                      className="border rounded-lg p-4 bg-white shadow-sm"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">
                            {index + 1}
                          </span>
                          <span className="text-xs font-medium px-2.5 py-0.5 rounded text-white bg-blue-600">
                            {questionTypes.find((t) => t.value === question.type)?.label}
                          </span>
                          {question.mcqSubType && question.mcqSubType !== "general" && (
                            <span className="text-xs font-medium px-2.5 py-0.5 rounded text-white bg-purple-600">
                              {question.mcqSubType === "chemical" ? "معادلات" : "قطعة"}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="p-2"
                            icon={<Edit3 className="h-4 w-4" />}
                            onClick={() => handleEditQuestion(question, section.id)}
                          >
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="p-2"
                            icon={<Trash2 className="h-4 w-4" />}
                            onClick={() => handleDeleteQuestion(question.id, section.id)}
                          >
                          </Button>
                        </div>
                      </div>
                      {renderQuestionContent(question)}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}