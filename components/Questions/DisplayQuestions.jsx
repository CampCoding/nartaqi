"use client";
import React, { useEffect } from "react";
import { Edit3, Trash2, GripVertical } from "lucide-react";
import { Collapse, Empty, Spin, Tag } from "antd";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import Card from "./ExamCard";
import Button from "../atoms/Button";
import { useDispatch, useSelector } from "react-redux";
import {
  handleGetExamSections,
  handleGetExamQuestions,
} from "../../lib/features/examSlice";

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
  selectedSectionId,
}) {
  const dispatch = useDispatch();
  const {
    get_exam_questions_list,
    get_exam_questions_loading,
  } = useSelector((state) => state?.exam);

  /* ---------- Load questions from API for selected section ---------- */
  useEffect(() => {
    if (!selectedSectionId) return;
    dispatch(
      handleGetExamQuestions({
        body: {
          exam_section_id: selectedSectionId,
        },
      })
    );
  }, [selectedSectionId, dispatch]);

  /* ---------- Map API response to display format ---------- */
  const apiQuestions = React.useMemo(() => {
    if (!get_exam_questions_list) return [];

    const apiResponse = get_exam_questions_list;
    
    // Check if response is successful
    if (apiResponse?.data?.status !== "success" || apiResponse.statusCode !== 200) {
      console.error("API response error:", apiResponse);
      return [];
    }

    const apiData = apiResponse?.data?.message;
    
    // Map MCQ questions from API to display format
    const mcqQuestions = (apiData.mcq || []).map((q) => {
      const options = q.options || [];
      const correctIndex = options.findIndex(
        (opt) => Number(opt.is_correct) === 1
      );

      return {
        id: q.id,
        type: "mcq",
        question: q.question_text || "",
        exam_section_id: q.exam_section_id,
        instructions: q.instructions || "Instructions",
        mcqSubType: "general",
        correctAnswer: correctIndex >= 0 ? correctIndex : 0,
        options: options.map((opt) => ({
          text: opt.option_text || "",
          explanation: opt.question_explanation || "",
        })),
      };
    });

    return [...mcqQuestions];
  }, [get_exam_questions_list]);

  /* ---------- Edit / Delete ---------- */
  const handleEditQuestion = (q, sectionId) => {
    setQuestionType(q.type);
    setCurrentQuestion(q.question || "");
    setSelectedSectionId(sectionId);
    setEditingQuestion(q);

    switch (q.type) {
      case "mcq":
        if (q.mcqSubType && q.mcqSubType !== "general") {
          editMcqPassageQuestion(q);
        } else {
          setMcqOptions(
            (q.options || [
              { text: "", explanation: "" },
              { text: "", explanation: "" },
              { text: "", explanation: "" },
              { text: "", explanation: "" },
            ]).map((o) =>
              typeof o === "string"
                ? { text: o, explanation: "" }
                : o || { text: "", explanation: "" }
            )
          );
          setMcqCorrectAnswer(
            typeof q.correctAnswer === "number" ? q.correctAnswer : 0
          );
          setMcqSubType("general");
        }
        break;
      case "trueFalse":
        setTrueFalseAnswer(!!q.correctAnswer);
        setTrueFalseExplanation(q.explanation || "");
        break;
      case "essay":
        setModalAnswer(q.modelAnswer || "");
        break;
      case "complete":
        setCompleteText(q.text || "");
        setCompleteAnswers(
          Array.isArray(q.answers) && q.answers.length
            ? q.answers
            : [{ answer: "" }]
        );
        break;
      default:
        break;
    }
  };

  const handleDeleteQuestion = (questionId, sectionId) => {
    if (!confirm("هل أنت متأكد من حذف هذا السؤال؟")) return;
    // Here you would typically call an API to delete the question
    console.log("Delete question:", questionId, "from section:", sectionId);
    // For now, we'll just show a message since we're rendering directly from API
    alert("سيتم حذف السؤال. تحتاج إلى تنفيذ استدعاء API للحذف الفعلي.");
  };

  /* ---------- Render Question Body ---------- */
  const renderQuestionContent = (q) => {
    if (q.type === "mcq") {
      return (
        <div className="space-y-3">
          <p
            className="text-[13px] text-gray-800 leading-6"
            dangerouslySetInnerHTML={{ __html: q.question }}
          />
          <div className="grid gap-2">
            {(q.options || []).map((option, idx) => {
              const opt =
                typeof option === "string"
                  ? { text: option, explanation: "" }
                  : option || { text: "", explanation: "" };
              const isCorrect = idx === q.correctAnswer;
              return (
                <div
                  key={idx}
                  className={`rounded-lg border px-3 py-2 text-[12px] ${
                    isCorrect
                      ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                      : "bg-gray-50 border-gray-200 text-gray-700"
                  }`}
                >
                  <div className="font-medium">
                    {String.fromCharCode(1632 + (idx + 1))}.{" "}
                    <span
                      dangerouslySetInnerHTML={{ __html: opt.text || "" }}
                    />
                  </div>
                  {opt.explanation && (
                    <div className="mt-1 text-[12px] text-gray-600">
                      الشرح:{" "}
                      <span
                        dangerouslySetInnerHTML={{
                          __html: opt.explanation || "",
                        }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {q.passage && (
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
              <div className="text-[12px] font-semibold text-blue-800 mb-1">
                القطعة
              </div>
              <div
                className="text-[12px] text-blue-700 leading-6"
                dangerouslySetInnerHTML={{ __html: q.passage.content }}
              />
            </div>
          )}
        </div>
      );
    }

    if (q.type === "trueFalse") {
      return (
        <div className="space-y-3">
          <p
            className="text-[13px] text-gray-800 leading-6"
            dangerouslySetInnerHTML={{ __html: q.question }}
          />
          <div
            className={`rounded-lg border px-3 py-2 text-[12px] ${
              q.correctAnswer
                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                : "bg-rose-50 border-rose-200 text-rose-800"
            }`}
          >
            الإجابة: {q.correctAnswer ? "صحيح" : "خطأ"}
          </div>
          {q.explanation && (
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
              <div className="text-[12px] font-semibold text-gray-800 mb-1">
                الشرح
              </div>
              <div
                className="text-[12px] text-gray-700 leading-6"
                dangerouslySetInnerHTML={{ __html: q.explanation }}
              />
            </div>
          )}
        </div>
      );
    }

    if (q.type === "essay") {
      return (
        <div className="space-y-3">
          <p
            className="text-[13px] text-gray-800 leading-6"
            dangerouslySetInnerHTML={{ __html: q.question }}
          />
          {q.modelAnswer && (
            <div className="rounded-lg border border-indigo-200 bg-indigo-50 p-3">
              <div className="text-[12px] font-semibold text-indigo-800 mb-1">
                الإجابة النموذجية
              </div>
              <div
                className="text-[12px] text-indigo-700 leading-6"
                dangerouslySetInnerHTML={{ __html: q.modelAnswer }}
              />
            </div>
          )}
        </div>
      );
    }

    if (q.type === "complete") {
      return (
        <div className="space-y-3">
          <p
            className="text-[13px] text-gray-800 leading-6"
            dangerouslySetInnerHTML={{ __html: q.text }}
          />
          <div className="grid gap-2">
            {(q.answers || []).map((ans, idx) => {
              const a = typeof ans === "object" ? ans.answer : ans;
              return (
                <div
                  key={idx}
                  className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-[12px] text-emerald-800"
                >
                  الإجابة {idx + 1}:{" "}
                  <span dangerouslySetInnerHTML={{ __html: a || "" }} />
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    return (
      <p
        className="text-[13px] text-gray-800"
        dangerouslySetInnerHTML={{ __html: q.question }}
      />
    );
  };

  /* ---------- Question row header ---------- */
  const QuestionHeader = ({ index, typeLabel, subTag, dragHandleProps }) => (
    <div className="flex items-center gap-2">
      <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold">
        {index + 1}
      </span>
      <Tag color="blue" className="!m-0 !text-[11px]">
        {typeLabel}
      </Tag>
      {subTag && (
        <Tag color="purple" className="!m-0 !text-[11px]">
          {subTag}
        </Tag>
      )}
      <span
        className="ms-auto flex items-center gap-1 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 transition"
        {...dragHandleProps}
        title="سحب لتحريك السؤال"
      >
        <GripVertical className="w-4 h-4" />
        <span className="text-[11px]">سحب</span>
      </span>
    </div>
  );

  if (get_exam_questions_loading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <Spin spinning size="large" />
      </div>
    );
  }

  return (
    <Card title="الأسئلة المضافة" icon={Edit3}>
      {!selectedSectionId ? (
        <Empty description="يرجى اختيار قسم لعرض الأسئلة" />
      ) : apiQuestions.length === 0 ? (
        <Empty description="لا توجد أسئلة في هذا القسم بعد" />
      ) : (
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-blue-800">
                  قسم {selectedSectionId}
                </h3>
                <p className="text-sm text-blue-600">
                  عدد الأسئلة: {apiQuestions.length}
                </p>
              </div>
              <Tag color="blue" className="!m-0">
                {selectedSectionId}
              </Tag>
            </div>
          </div>

          <div className="space-y-3">
            {apiQuestions.map((q, index) => {
              const typeLabel =
                questionTypes.find((t) => t.value === q.type)?.label || "سؤال";
              const subTag =
                q.mcqSubType && q.mcqSubType !== "general"
                  ? q.mcqSubType === "chemical"
                    ? "معادلات"
                    : "قطعة"
                  : null;

              return (
                <div
                  key={q.id}
                  className="rounded-2xl border bg-white p-4 shadow-sm transition-all hover:shadow-md"
                >
                  {/* Header row with actions */}
                  <div className="flex items-center gap-2 mb-3">
                    <QuestionHeader
                      index={index}
                      typeLabel={typeLabel}
                      subTag={subTag}
                      dragHandleProps={{}}
                    />
                    <div className="ms-2 flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        className="px-2"
                        icon={<Edit3 className="h-4 w-4" />}
                        onClick={() => handleEditQuestion(q, selectedSectionId)}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        className="px-2"
                        icon={<Trash2 className="h-4 w-4" />}
                        onClick={() => handleDeleteQuestion(q.id, selectedSectionId)}
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="mt-3">
                    {renderQuestionContent(q)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </Card>
  );
}