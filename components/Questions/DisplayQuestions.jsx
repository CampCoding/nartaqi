import React, { useMemo, useState, useEffect } from "react";
import { Edit3, Trash2, GripVertical } from "lucide-react";
import { Collapse, Empty, Spin, Tag } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { handleGetExamQuestions } from "../../lib/features/examSlice";
import { questionTypes } from "./utils";
import Button from "../atoms/Button";
import Card from "./ExamCard";

const { Panel } = Collapse;

export default function DisplayQuestions({
  selectedSectionId,
}) {
  const dispatch = useDispatch();
  const { get_exam_questions_list, get_exam_questions_loading } = useSelector(state => state?.exam);

  // Log to verify if selectedSectionId is set correctly
  useEffect(() => {
    if (selectedSectionId) {
      console.log("Fetching questions for section ID:", selectedSectionId);
      dispatch(handleGetExamQuestions({ body: { exam_section_id: selectedSectionId } }));
    }
  }, [selectedSectionId, dispatch]);

  useEffect(() => {
    console.log("Display Data",get_exam_questions_list?.data)
  } ,[get_exam_questions_list])

  // UseMemo to process the API data into the desired format
  const apiQuestions = useMemo(() => {
    if (!get_exam_questions_list) return [];
    const apiResponse = get_exam_questions_list;

    // if (apiResponse?.data?.status !== "success" || apiResponse.statusCode !== 200) {
    //   console.error("API response error:", apiResponse);
    //   return [];
    // }

    const apiData = apiResponse?.data?.message;
    // Process MCQs
    const mcqQuestions = (apiData?.mcq || []).map((q) => {
      const options = q?.options || [];
      const correctIndex = options?.findIndex((opt) => Number(opt?.is_correct) === 1);

      return {
        id: q.id,
        type: "mcq",
        question: q?.question_text || "",
        exam_section_id: q?.exam_section_id,
        instructions: q?.instructions || "Instructions",
        correctAnswer: correctIndex >= 0 ? correctIndex : 0,
        options: options?.map((opt) => ({
          text: opt?.option_text || "",
          explanation: opt?.question_explanation || "",
        })),
      };
    });

    // Process paragraph questions
    const paragraphQuestions = (apiData?.paragraphs || []).map((p) => ({
      id: p?.paragraph.id,
      type: "paragraph_mcq",
      paragraphContent: p?.paragraph?.paragraph_content || "",
      questions: p?.questions?.map((q) => ({
        id: q?.id,
        questionText: q?.question_text || "",
        instructions: q?.instructions || "Choose the correct answer",
        options: (q?.options || []).map((opt) => ({
          text: opt?.option_text || "",
          explanation: opt?.question_explanation || "",
          isCorrect: opt?.is_correct === 1 ? true : false,
        })),
      })),
    }));

    return [...mcqQuestions, ...paragraphQuestions];
  }, [get_exam_questions_list]);

  // Render question content based on type
  const renderQuestionContent = (q) => {
    if (q.type === "mcq") {
      return (
        <div className="space-y-3">
          <p className="text-[13px] text-gray-800 leading-6" dangerouslySetInnerHTML={{__html : q?.question}}></p>
          <div className="grid gap-2">
            {q.options.map((option, idx) => {
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
                  <div 
                  dangerouslySetInnerHTML={{__html : `${String.fromCharCode(1632 + (idx + 1))}. ${option?.text}`}}
                  className="font-medium">
                    
                  </div>
                  {option.explanation && (
                    <div 
                    dangerouslySetInnerHTML={{__html : `Explanation: ${option.explanation}`}}
                    className="mt-1 text-[12px] text-gray-600">
                      
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    if (q.type === "paragraph_mcq") {
      return (
        <div className="space-y-3">
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
            <div className="text-[12px] font-semibold text-blue-800 mb-1">Paragraph:</div>
            <div className="text-[12px] text-blue-700 leading-6"
            dangerouslySetInnerHTML={{__html : q.paragraphContent}}
            ></div>
          </div>

          {q.questions.map((question, idx) => (
            <div key={idx} className="space-y-3">
              <p className="text-[13px] text-gray-800 leading-6"
              dangerouslySetInnerHTML={{__html : question.questionText}}
              ></p>
              <div className="grid gap-2">
                {question.options.map((option, i) => {
                  const isCorrect = option.isCorrect;
                  return (
                    <div
                      key={i}
                      className={`rounded-lg border px-3 py-2 text-[12px] ${
                        isCorrect
                          ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                          : "bg-gray-50 border-gray-200 text-gray-700"
                      }`}
                    >
                      <div className="font-medium" 
                      dangerouslySetInnerHTML={{__html : `${String.fromCharCode(1632 + (idx + 1))}. ${option?.text}`}}
                      >
                      </div>
                      {option.explanation && (
                        <div 
                        dangerouslySetInnerHTML={{__html :` Explanation: ${option.explanation}`}}
                        className="mt-1 text-[12px] text-gray-600">
                         
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      );
    }

    return <p className="text-[13px] text-gray-800" dangerouslySetInnerHTML={{__html : q.question}}></p>;
  };

  if (get_exam_questions_loading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <Spin spinning size="large" />
      </div>
    );
  }

  return (
    <Card title="Exam Questions" icon={Edit3}>
      {apiQuestions.length === 0 ? (
        <Empty description="No questions available for this section" />
      ) : (
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-blue-800">Section {selectedSectionId}</h3>
                <p className="text-sm text-blue-600">Total Questions: {apiQuestions.length}</p>
              </div>
              <Tag color="blue" className="!m-0">
                {selectedSectionId}
              </Tag>
            </div>
          </div>

          <div className="space-y-3">
            {apiQuestions.map((q, index) => {
              const typeLabel = questionTypes.find((t) => t.value === q.type)?.label || "Question";
              const subTag = q.mcqSubType && q.mcqSubType !== "general" ? q.mcqSubType === "chemical" ? "Chemical" : "Passage" : null;

              return (
                <div key={q.id} className="rounded-2xl border bg-white p-4 shadow-sm transition-all hover:shadow-md">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold">{index + 1}</span>
                    <Tag color="blue" className="!m-0 !text-[11px]">{typeLabel}</Tag>
                    {subTag && <Tag color="purple" className="!m-0 !text-[11px]">{subTag}</Tag>}
                  </div>
                  <div className="mt-3">{renderQuestionContent(q)}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </Card>
  );
}
