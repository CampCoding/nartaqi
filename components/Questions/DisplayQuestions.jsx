"use client";
import React from "react";
import { Edit3, Trash2 } from "lucide-react";
import { Collapse, Tag, Empty } from "antd";
import Card from "./ExamCard";
import Button from "../atoms/Button";

const { Panel } = Collapse;

export default function DisplayQuestions({
  examData,
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

    switch (question.type) {
      case "mcq":
        if (question.mcqSubType && question.mcqSubType !== "general") {
          editMcqPassageQuestion(question);
        } else {
          setMcqOptions(
            (question.options || [
              { text: "", explanation: "" },
              { text: "", explanation: "" },
              { text: "", explanation: "" },
              { text: "", explanation: "" },
            ]).map((o) =>
              typeof o === "string" ? { text: o, explanation: "" } : o
            )
          );
          setMcqCorrectAnswer(
            typeof question.correctAnswer === "number"
              ? question.correctAnswer
              : 0
          );
          setMcqSubType("general");
        }
        break;
      case "trueFalse":
        setTrueFalseAnswer(!!question.correctAnswer);
        setTrueFalseExplanation(question.explanation || "");
        break;
      case "essay":
        setModalAnswer(question.modelAnswer || "");
        break;
      case "complete":
        setCompleteText(question.text || "");
        setCompleteAnswers(
          Array.isArray(question.answers) && question.answers.length
            ? question.answers
            : [{ answer: "" }]
        );
        break;
      default:
        break;
    }
  };

  const handleDeleteQuestion = (questionId, sectionId) => {
    if (confirm("هل أنت متأكد من حذف هذا السؤال؟")) {
      const updatedSections = examData.sections.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            questions: (section.questions || []).filter(
              (q) => q.id !== questionId
            ),
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
            <p
              className="text-sm text-gray-700"
              dangerouslySetInnerHTML={{ __html: question.question }}
            />
            <div className="space-y-1">
              {(question.options || []).map((option, idx) => {
                const optObj =
                  typeof option === "string"
                    ? { text: option, explanation: "" }
                    : option || { text: "", explanation: "" };
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
                      {String.fromCharCode(1632 + idx + 1)}.{" "}
                      <span
                        dangerouslySetInnerHTML={{ __html: optObj.text }}
                      />
                    </div>
                    {optObj.explanation && (
                      <div className="mt-1 text-xs text-gray-600 italic">
                        الشرح:{" "}
                        <span
                          dangerouslySetInnerHTML={{
                            __html: optObj.explanation,
                          }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            {question.passage && (
              <div className="mt-2 p-2 bg-blue-50 rounded border border-blue-200">
                <p className="text-xs text-blue-800 font-medium">القطعة:</p>
                <p
                  className="text-xs text-blue-700"
                  dangerouslySetInnerHTML={{ __html: question.passage.content }}
                />
              </div>
            )}
          </div>
        );
      case "trueFalse":
        return (
          <div className="space-y-2">
            <p
              className="text-sm text-gray-700"
              dangerouslySetInnerHTML={{ __html: question.question }}
            />
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
                <p
                  className="text-xs text-gray-700"
                  dangerouslySetInnerHTML={{ __html: question.explanation }}
                />
              </div>
            )}
          </div>
        );
      case "essay":
        return (
          <div className="space-y-2">
            <p
              className="text-sm text-gray-700"
              dangerouslySetInnerHTML={{ __html: question.question }}
            />
            {question.modelAnswer && (
              <div className="mt-2 p-2 bg-blue-50 rounded border border-blue-200">
                <p className="text-xs text-blue-800 font-medium">
                  الإجابة النموذجية:
                </p>
                <p
                  className="text-xs text-blue-700"
                  dangerouslySetInnerHTML={{ __html: question.modelAnswer }}
                />
              </div>
            )}
          </div>
        );
      case "complete":
        return (
          <div className="space-y-2">
            <p
              className="text-sm text-gray-700"
              dangerouslySetInnerHTML={{ __html: question.text }}
            />
            <div className="space-y-1">
              {(question.answers || []).map((answer, idx) => {
                const answerText =
                  typeof answer === "object" ? answer.answer : answer;
                return (
                  <div
                    key={idx}
                    className="text-xs p-2 bg-green-100 text-green-800 rounded border border-green-200"
                  >
                    الإجابة {idx + 1}:{" "}
                    <span
                      dangerouslySetInnerHTML={{ __html: answerText || "" }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        );
      default:
        return (
          <p
            className="text-sm text-gray-700"
            dangerouslySetInnerHTML={{ __html: question.question }}
          />
        );
    }
  };

  return (
    <Card title="الأسئلة المضافة" icon={Edit3}>
      {examData.sections.length === 0 ? (
        <Empty description="لا توجد أقسام بعد" />
      ) : (
        <Collapse accordion expandIconPosition="end" className="rounded-xl bg-white">
          {examData.sections.map((section) => {
            const count = section.questions?.length || 0;

            return (
              <Panel
                key={section.id}
                className="!border !border-gray-200 !rounded-xl overflow-hidden"
                header={
                  <div className="flex items-center gap-3">
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      {count}
                    </span>
                    <h3
                      className="font-medium text-gray-900"
                      dangerouslySetInnerHTML={{ __html: section?.name }}
                    />
                  </div>
                }
              >
                {count === 0 ? (
                  <div className="py-6">
                    <Empty description="لا توجد أسئلة في هذا القسم بعد" />
                  </div>
                ) : (
                  <Collapse
                    accordion
                    bordered={false}
                    expandIconPosition="end"
                    className="bg-transparent"
                  >
                    {section.questions.map((question, index) => {
                      const typeLabel =
                        questionTypes.find((t) => t.value === question.type)
                          ?.label || "سؤال";
                      const subTag =
                        question.mcqSubType && question.mcqSubType !== "general"
                          ? question.mcqSubType === "chemical"
                            ? "معادلات"
                            : "قطعة"
                          : null;

                      const extra = (
                        <div
                          className="flex items-center gap-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            className="p-2"
                            icon={<Edit3 className="h-4 w-4" />}
                            onClick={() => handleEditQuestion(question, section.id)}
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            className="p-2"
                            icon={<Trash2 className="h-4 w-4" />}
                            onClick={() =>
                              handleDeleteQuestion(question.id, section.id)
                            }
                          />
                        </div>
                      );

                      return (
                        <Panel
                          key={question.id}
                          className="!mb-3 !rounded-xl bg-gray-50"
                          extra={extra}
                          header={
                            <div className="flex items-center gap-2">
                              <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                {index + 1}
                              </span>
                              <span className="text-xs font-medium px-2.5 py-0.5 rounded text-white bg-blue-600">
                                {typeLabel}
                              </span>
                              {subTag && (
                                <span className="text-xs font-medium px-2.5 py-0.5 rounded text-white bg-purple-600">
                                  {subTag}
                                </span>
                              )}
                            </div>
                          }
                        >
                          {renderQuestionContent(question)}
                        </Panel>
                      );
                    })}
                  </Collapse>
                )}
              </Panel>
            );
          })}
        </Collapse>
      )}
    </Card>
  );
}
