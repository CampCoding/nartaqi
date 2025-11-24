"use client";
import React, { useEffect } from "react";
import { Edit3, Trash2, GripVertical } from "lucide-react";
import { Collapse, Empty, Spin, Tag } from "antd";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import Card from "./ExamCard";
import Button from "../atoms/Button";
import { useDispatch, useSelector } from "react-redux";
import { handleGetAllExamSections, handleGetExamQuestions } from "../../lib/features/examSlice";

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
  selectedSectionId
}) {
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
            ]).map((o) => (typeof o === "string" ? { text: o, explanation: "" } : o))
          );
          setMcqCorrectAnswer(typeof q.correctAnswer === "number" ? q.correctAnswer : 0);
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
        setCompleteAnswers(Array.isArray(q.answers) && q.answers.length ? q.answers : [{ answer: "" }]);
        break;
      default:
        break;
    }
  };

  const handleDeleteQuestion = (questionId, sectionId) => {
    if (!confirm("هل أنت متأكد من حذف هذا السؤال؟")) return;
    const updatedSections = (examData.sections || []).map((s) =>
      s.id === sectionId
        ? { ...s, questions: (s.questions || []).filter((q) => q.id !== questionId) }
        : s
    );
    setExamData({ ...examData, sections: updatedSections });
  };

  /* ---------- Render Question Body ---------- */
  const renderQuestionContent = (q) => {
    if (q.type === "mcq") {
      return (
        <div className="space-y-3">
          <p className="text-[13px] text-gray-800 leading-6" dangerouslySetInnerHTML={{ __html: q.question }} />
          <div className="grid gap-2">
            {(q.options || []).map((option, idx) => {
              const opt = typeof option === "string" ? { text: option, explanation: "" } : option || { text: "", explanation: "" };
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
                    <span dangerouslySetInnerHTML={{ __html: opt.text }} />
                  </div>
                  {opt.explanation && (
                    <div className="mt-1 text-[12px] text-gray-600">
                      الشرح: <span dangerouslySetInnerHTML={{ __html: opt.explanation }} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {q.passage && (
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
              <div className="text-[12px] font-semibold text-blue-800 mb-1">القطعة</div>
              <div className="text-[12px] text-blue-700 leading-6" dangerouslySetInnerHTML={{ __html: q.passage.content }} />
            </div>
          )}
        </div>
      );
    }

    if (q.type === "trueFalse") {
      return (
        <div className="space-y-3">
          <p className="text-[13px] text-gray-800 leading-6" dangerouslySetInnerHTML={{ __html: q.question }} />
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
              <div className="text-[12px] font-semibold text-gray-800 mb-1">الشرح</div>
              <div className="text-[12px] text-gray-700 leading-6" dangerouslySetInnerHTML={{ __html: q.explanation }} />
            </div>
          )}
        </div>
      );
    }

    if (q.type === "essay") {
      return (
        <div className="space-y-3">
          <p className="text-[13px] text-gray-800 leading-6" dangerouslySetInnerHTML={{ __html: q.question }} />
          {q.modelAnswer && (
            <div className="rounded-lg border border-indigo-200 bg-indigo-50 p-3">
              <div className="text-[12px] font-semibold text-indigo-800 mb-1">الإجابة النموذجية</div>
              <div className="text-[12px] text-indigo-700 leading-6" dangerouslySetInnerHTML={{ __html: q.modelAnswer }} />
            </div>
          )}
        </div>
      );
    }

    if (q.type === "complete") {
      return (
        <div className="space-y-3">
          <p className="text-[13px] text-gray-800 leading-6" dangerouslySetInnerHTML={{ __html: q.text }} />
          <div className="grid gap-2">
            {(q.answers || []).map((ans, idx) => {
              const a = typeof ans === "object" ? ans.answer : ans;
              return (
                <div key={idx} className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-[12px] text-emerald-800">
                  الإجابة {idx + 1}: <span dangerouslySetInnerHTML={{ __html: a || "" }} />
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    return <p className="text-[13px] text-gray-800" dangerouslySetInnerHTML={{ __html: q.question }} />;
  };

  /* ---------- DnD helpers ---------- */
  const reorder = (list, start, end) => {
    const result = Array.from(list || []);
    const [removed] = result.splice(start, 1);
    result.splice(end, 0, removed);
    return result;
  };

  const move = ({ sections, source, destination }) => {
    const fromIdx = sections.findIndex((s) => String(s.id) === String(source.droppableId));
    const toIdx = sections.findIndex((s) => String(s.id) === String(destination.droppableId));
    if (fromIdx < 0 || toIdx < 0) return sections;

    const from = sections[fromIdx];
    const to = sections[toIdx];

    const fromQs = Array.from(from.questions || []);
    const toQs = Array.from(to.questions || []);

    const [moved] = fromQs.splice(source.index, 1);
    toQs.splice(destination.index, 0, moved);

    const next = Array.from(sections);
    next[fromIdx] = { ...from, questions: fromQs };
    next[toIdx] = { ...to, questions: toQs };
    return next;
  };

  const onDragEnd = ({ source, destination }) => {
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    setExamData((prev) => {
      const sections = Array.from(prev.sections || []);
      if (source.droppableId === destination.droppableId) {
        const secIdx = sections.findIndex((s) => String(s.id) === String(source.droppableId));
        if (secIdx < 0) return prev;
        const sec = sections[secIdx];
        const nextQs = reorder(sec.questions || [], source.index, destination.index);
        const nextSections = Array.from(sections);
        nextSections[secIdx] = { ...sec, questions: nextQs };
        return { ...prev, sections: nextSections };
      }
      const moved = move({ sections, source, destination });
      return { ...prev, sections: moved };
    });
  };

  /* ---------- Question row header ---------- */
  const QuestionHeader = ({ index, typeLabel, subTag, dragHandleProps }) => (
    <div className="flex items-center gap-2">
      <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold">
        {index + 1}
      </span>
      <Tag color="blue" className="!m-0 !text-[11px]">{typeLabel}</Tag>
      {subTag && <Tag color="purple" className="!m-0 !text-[11px]">{subTag}</Tag>}
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
  const dispatch = useDispatch();
  const {get_exam_sections_list , get_exam_questions_list , get_exam_questions_loading} = useSelector(state => state?.exam);

  useEffect(() => {
    dispatch(handleGetExamQuestions({body : {
      exam_section_id : selectedSectionId
    }}))
  } , [selectedSectionId])

  useEffect(() => {
    console.log(get_exam_questions_list?.data?.message)
  } , [get_exam_questions_list])

  if(get_exam_questions_loading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <Spin spinning size="large"/>
      </div>
    )
  }
  
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
                    <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-l from-cyan-50 to-teal-50 border border-teal-100 px-3 py-1">
                      <span className="h-2 w-2 rounded-full bg-teal-400" />
                      <span className="text-[12px] text-teal-800">القسم</span>
                    </span>
                    <h3
                      className="font-semibold text-gray-900 leading-6"
                      dangerouslySetInnerHTML={{ __html: section?.name }}
                    />
                    <span className="ms-auto inline-flex items-center rounded-full bg-gray-100 text-gray-700 text-[11px] px-2.5 py-1">
                      عدد الأسئلة: {count}
                    </span>
                  </div>
                }
              >
                {count === 0 ? (
                  <div className="py-6">
                    <Empty description="لا توجد أسئلة في هذا القسم بعد" />
                  </div>
                ) : (
                  <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId={String(section.id)}>
                      {(dropProvided, dropSnapshot) => (
                        <div
                          ref={dropProvided.innerRef}
                          {...dropProvided.droppableProps}
                          className={`transition-all rounded-xl p-1 ${
                            dropSnapshot.isDraggingOver ? "bg-emerald-50/70 border border-emerald-100" : ""
                          }`}
                        >
                          {(section.questions || []).map((q, index) => {
                            const typeLabel =
                              questionTypes.find((t) => t.value === q.type)?.label || "سؤال";
                            const subTag =
                              q.mcqSubType && q.mcqSubType !== "general"
                                ? q.mcqSubType === "chemical"
                                  ? "معادلات"
                                  : "قطعة"
                                : null;

                            return (
                              <Draggable key={q.id} draggableId={String(q.id)} index={index}>
                                {(dragProvided, dragSnapshot) => (
                                  <div
                                    ref={dragProvided.innerRef}
                                    {...dragProvided.draggableProps}
                                    style={dragProvided.draggableProps.style}
                                    className={`mb-3 rounded-2xl border bg-white p-3 shadow-sm transition-all ${
                                      dragSnapshot.isDragging ? "ring-2 ring-emerald-300 shadow-md" : "hover:shadow-md"
                                    }`}
                                  >
                                    {/* Header row with handle + actions */}
                                    <div className="flex items-center gap-2">
                                      <QuestionHeader
                                        index={index}
                                        typeLabel={typeLabel}
                                        subTag={subTag}
                                        dragHandleProps={dragProvided.dragHandleProps}
                                      />
                                      <div className="ms-2 flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          className="px-2"
                                          icon={<Edit3 className="h-4 w-4" />}
                                          onClick={() => handleEditQuestion(q, section.id)}
                                        />
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          className="px-2"
                                          icon={<Trash2 className="h-4 w-4" />}
                                          onClick={() => handleDeleteQuestion(q.id, section.id)}
                                        />
                                      </div>
                                    </div>

                                    {/* Content */}
                                    <div className="mt-3">
                                      {renderQuestionContent(q)}
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            );
                          })}
                          {dropProvided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                )}
              </Panel>
            );
          })}
        </Collapse>
      )}
    </Card>
  );
}
