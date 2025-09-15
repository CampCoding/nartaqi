import React from "react";
import Card from "./ExamCard";
import {
  BookOpen,
  ChevronDown,
  ChevronUp,
  Edit3,
  Eye,
  FileText,
  Trash2,
} from "lucide-react";
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
}) {
  return (
    <Card title="الأسئلة المضافة" icon={Eye}>
      <div className="space-y-4">
        {examData?.sections?.map((section) => (
          <div
            key={section.id}
            className="border border-gray-200 rounded-lg overflow-hidden"
          >
            <div
              className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer"
              onClick={() => toggleSection(section.id)}
            >
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <BookOpen className="h-4 w-4 text-blue-600" />
                </div>
                <div className="text-right">
                  <h4 className="font-medium text-gray-900">{section?.name}</h4>
                  <p className="text-sm text-gray-500">
                    {section?.questions?.length || 0} سؤال
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">
                  {expandedSections[section.id] ? "إخفاء" : "عرض"}
                </span>
                {expandedSections[section.id] ? (
                  <ChevronUp className="h-4 w-4 text-gray-400" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                )}
              </div>
            </div>

            {expandedSections[section.id] && (
              <div className="p-4 bg-white">
                {section?.questions?.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p>لا توجد أسئلة في هذا القسم بعد</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {section?.questions?.map((question, index) => (
                      <div
                        key={question.id}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                              {
                                questionTypes?.find(
                                  (t) => t.id === question.type
                                )?.label
                              }
                            </span>
                            <span className="text-sm text-gray-500">
                              السؤال {index + 1}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              icon={Edit3}
                              onClick={() => {
                                setEditingQuestion(question);
                                setQuestionType(question.type);
                                setCurrentQuestion(question.question);
                                setSelectedSectionId(section.id);

                                if (question.type === "mcq") {
                                  setMcqOptions(
                                    question.options || ["", "", "", ""]
                                  );
                                  setMcqCorrectAnswer(
                                    typeof question.correctAnswer === "number"
                                      ? question.correctAnswer
                                      : 0
                                  );
                                } else if (question.type === "trueFalse") {
                                  setTrueFalseAnswer(
                                    question.correctAnswer ?? null
                                  );
                                  setTrueFalseExplanation(
                                    question.explanation || ""
                                  );
                                } else if (question.type === "essay") {
                                  setModalAnswer(question.modelAnswer || "");
                                } else if (question.type === "complete") {
                                  setCompleteText(question.text || "");
                                  setCompleteAnswers(
                                    question.answers || [{ answer: "" }]
                                  );
                                }
                              }}
                            >
                              تعديل
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              icon={Trash2}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => {
                                const updated = examData?.sections?.map((s) =>
                                  s.id === section.id
                                    ? {
                                        ...s,
                                        questions: s.questions.filter(
                                          (q) => q.id !== question.id
                                        ),
                                      }
                                    : s
                                );
                                setExamData((p) => ({
                                  ...p,
                                  sections: updated,
                                }));
                              }}
                            >
                              حذف
                            </Button>
                          </div>
                        </div>
                        <p className="text-gray-900 mb-3 font-medium">
                          {question?.question}
                        </p>
                        {question?.type === "mcq" && (
                          <div className="space-y-2">
                            <p className="text-sm font-medium text-gray-700">
                              الخيارات:
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {question?.options?.map((option, optIndex) => (
                                <div
                                  key={optIndex}
                                  className={`p-2 rounded border ${
                                    optIndex === question?.correctAnswer
                                      ? "border-green-200 bg-green-50"
                                      : "border-gray-200"
                                  }`}
                                >
                                  <div className="flex items-center gap-2">
                                    <div
                                      className={`w-4 h-4 rounded-full border-2 ${
                                        optIndex === question?.correctAnswer
                                          ? "border-green-500 bg-green-500"
                                          : "border-gray-300"
                                      }`}
                                    />
                                    <span className="text-sm">{option}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        {question?.type === "trueFalse" && (
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-700">
                              الإجابة:
                            </span>
                            <span
                              className={`px-2 py-1 rounded text-sm ${
                                question.correctAnswer
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {question.correctAnswer ? "صحيح" : "خطأ"}
                            </span>
                            {question.explanation && (
                              <span className="text-sm text-gray-600">
                                (شرح: {question.explanation})
                              </span>
                            )}
                          </div>
                        )}
                        {question.type === "essay" && (
                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-1">
                              الإجابة النموذجية:
                            </p>
                            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                              {question.modelAnswer}
                            </p>
                          </div>
                        )}
                        {question.type === "complete" && (
                          <div className="space-y-3">
                            <p className="text-sm font-medium text-gray-700 mb-1">
                              النص الناقص:
                            </p>
                            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                              {question.text}
                            </p>

                            <p className="text-sm font-medium text-gray-700 mb-1">
                              الإجابات الصحيحة:
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {question.answers?.map((answer, ansIndex) => (
                                <div
                                  key={ansIndex}
                                  className="p-2 rounded border border-gray-200 bg-gray-50"
                                >
                                  <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded-full border-2 border-blue-500 bg-blue-500" />
                                    <span className="text-sm">
                                      {answer.answer}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        // In DisplayQuestions.jsx, add this to the question
                        display section for MCQ questions:
                        {question.type === "mcq" && question.mcqSubType && (
                          <div className="mt-2">
                            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                              {question.mcqSubType === "general" &&
                                "أسئلة عامة"}
                              {question.mcqSubType === "passage" && "قطع ثابتة"}
                              {question.mcqSubType === "math" &&
                                "معادلات رياضية"}
                            </span>
                            {question.mcqSubType === "passage" &&
                              question.passageText && (
                                <div className="mt-2 p-2 bg-gray-50 rounded">
                                  <p className="text-sm text-gray-600">
                                    {question.passageText}
                                  </p>
                                </div>
                              )}
                            {question.mcqSubType === "math" &&
                              question.mathEquation && (
                                <div className="mt-2 p-2 bg-gray-50 rounded font-mono">
                                  <p className="text-sm">
                                    {question.mathEquation}
                                  </p>
                                </div>
                              )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {examData.sections.every((s) => (s.questions?.length || 0) === 0) && (
          <div className="text-center py-8 text-gray-500">
            <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>لم يتم إضافة أي أسئلة بعد</p>
            <p className="text-sm mt-1">
              ابدأ بإضافة أسئلة باستخدام نموذج إنشاء الأسئلة أعلاه
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
