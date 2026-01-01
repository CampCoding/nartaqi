"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button, Divider, message } from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import LabeledEditor from "./parts/LabeledEditor";

const uid = () =>
  Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

const emptyOption = () => ({
  answer: "",
  question_explanation: "",
  images: [],
});

const emptyQuestion = () => ({
  id: uid(),
  text: "",
  instructions: "", // Add instructions field here
  attachments: [],
  correctIndex: 0,
  options: [emptyOption(), emptyOption()],
});

const emptyGroup = () => ({
  id: uid(),
  content: "",
  attachments: [],
  questions: [emptyQuestion()],
});

function isEditorGroupsArray(v) {
  return (
    Array.isArray(v) &&
    v.every(
      (g) =>
        g &&
        typeof g === "object" &&
        "content" in g &&
        Array.isArray(g.questions)
    )
  );
}

function convertEditingQuestionToGroups(editingQuestion) {
  if (!editingQuestion || typeof editingQuestion !== "object") return [emptyGroup()];

  const paragraph =
    editingQuestion.paragraphContent ||
    editingQuestion.paragraph_content ||
    editingQuestion.paragraph ||
    editingQuestion.paragraphContentHtml ||
    editingQuestion.paragraph_html ||
    "";

  if (isEditorGroupsArray(editingQuestion)) return editingQuestion;

  const normalizeOpt = (o) => ({
    answer: o?.answer || o?.text || "",
    question_explanation: o?.question_explanation || o?.explanation || "",
    images: Array.isArray(o?.images) ? o.images : [],
  });

  const normalizeQuestion = (q) => {
    const optsRaw = q?.options || q?.mcq_array || q?.choices || [];
    const opts = Array.isArray(optsRaw) ? optsRaw.map(normalizeOpt) : [];
    while (opts.length < 2) opts.push(emptyOption());
    while (opts.length < 4) opts.push(emptyOption());

    let correctIndex = 0;
    const idxIsCorrect =
      (q?.options || []).findIndex((x) => x?.isCorrect || x?.is_correct) ?? -1;
    if (idxIsCorrect >= 0) correctIndex = idxIsCorrect;

    const idxCorrectOrNot =
      (q?.mcq_array || []).findIndex(
        (x) => String(x?.correct_or_not) === "1"
      ) ?? -1;
    if (idxCorrectOrNot >= 0) correctIndex = idxCorrectOrNot;

    if (typeof q?.correctIndex === "number") correctIndex = q.correctIndex;
    if (typeof q?.correctAnswer === "number") correctIndex = q.correctAnswer;

    return {
      id: uid(),
      text: q?.questionText || q?.question_text || q?.text || "",
      instructions: q?.instructions || "", // Preserve instructions
      attachments: Array.isArray(q?.attachments) ? q.attachments : [],
      correctIndex,
      options: opts,
    };
  };

  const qsRaw = editingQuestion.questions || editingQuestion.paragraph_questions || [];
  const qs = Array.isArray(qsRaw) ? qsRaw.map(normalizeQuestion) : [];

  return [
    {
      id: uid(),
      content: paragraph,
      attachments: Array.isArray(editingQuestion.attachments)
        ? editingQuestion.attachments
        : [],
      questions: qs.length ? qs : [emptyQuestion()],
    },
  ];
}

export default function McqSharedPassageEditor({
  mcqSubType = "passage",
  initialData,
  onPassagesChange,
  questionInstruction, // Global instruction prop
  setQuestionInstruction, // Global instruction setter
}) {
  const [groups, setGroups] = useState([emptyGroup()]);
  const hydratedKeyRef = useRef(null);

  const editingId = useMemo(() => {
    if (initialData && !Array.isArray(initialData) && typeof initialData === "object") {
      return initialData.id ?? initialData.question_id ?? null;
    }
    return null;
  }, [initialData]);

  useEffect(() => {
    const makeHydrateKey = () => {
      if (editingId) return `edit:${editingId}`;
      if (isEditorGroupsArray(initialData)) return `arr:${initialData.length}`;
      return "empty";
    };

    const key = makeHydrateKey();
    if (hydratedKeyRef.current === key) return;
    hydratedKeyRef.current = key;

    if (isEditorGroupsArray(initialData)) {
      setGroups(initialData.length ? initialData : [emptyGroup()]);
      return;
    }

    if (initialData && typeof initialData === "object") {
      const converted = convertEditingQuestionToGroups(initialData);
      setGroups(converted.length ? converted : [emptyGroup()]);
      return;
    }

    setGroups([emptyGroup()]);
  }, [initialData, editingId]);

  useEffect(() => {
    onPassagesChange?.(groups);
  }, [groups, onPassagesChange]);

  /* ---------- Helper Functions ---------- */
  const showWarning = (msg) => {
    message.warning({
      content: msg,
      icon: <ExclamationCircleOutlined />,
      duration: 3,
    });
  };

  const checkAllOptionsFilled = (options) => {
    return options.every(opt => opt.answer?.trim());
  };

  const checkQuestionHasEmptyOptions = (question) => {
    return question.options?.some(opt => !opt.answer?.trim());
  };

  /* ---------- Mutators with Validation ---------- */

  const updateGroup = (groupIndex, patch) => {
    setGroups((prev) => {
      const next = [...prev];
      next[groupIndex] = { ...next[groupIndex], ...patch };
      return next;
    });
  };

  const addGroup = () => setGroups((prev) => [...prev, emptyGroup()]);

  const removeGroup = (groupIndex) => {
    setGroups((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((_, i) => i !== groupIndex);
    });
  };

  const updateQuestion = (groupIndex, questionIndex, patch) => {
    setGroups((prev) => {
      const next = [...prev];
      const g = next[groupIndex];
      const qs = [...(g.questions || [])];
      qs[questionIndex] = { ...qs[questionIndex], ...patch };
      next[groupIndex] = { ...g, questions: qs };
      return next;
    });
  };

  const addQuestion = (groupIndex) => {
    const group = groups[groupIndex];
    const lastQuestion = group.questions[group.questions.length - 1];
    
    // Check if last question has empty options
    if (lastQuestion && checkQuestionHasEmptyOptions(lastQuestion)) {
      showWarning("الرجاء ملء جميع خيارات السؤال الحالي قبل إضافة سؤال جديد");
      return;
    }
    
    setGroups((prev) => {
      const next = [...prev];
      const g = next[groupIndex];
      next[groupIndex] = {
        ...g,
        questions: [...(g.questions || []), emptyQuestion()],
      };
      return next;
    });
  };

  const removeQuestion = (groupIndex, questionIndex) => {
    setGroups((prev) => {
      const next = [...prev];
      const g = next[groupIndex];
      const qs = [...(g.questions || [])];
      if (qs.length <= 1) return prev;
      qs.splice(questionIndex, 1);
      next[groupIndex] = { ...g, questions: qs };
      return next;
    });
  };

  const updateOption = (groupIndex, questionIndex, optionIndex, patch) => {
    setGroups((prev) => {
      const next = [...prev];
      const g = next[groupIndex];
      const qs = [...(g.questions || [])];
      const q = qs[questionIndex];
      const opts = [...(q.options || [])];
      opts[optionIndex] = { ...opts[optionIndex], ...patch };
      
      // Clear correct answer if option becomes empty
      if (patch.answer !== undefined && !patch.answer.trim() && q.correctIndex === optionIndex) {
        qs[questionIndex] = { ...q, options: opts, correctIndex: 0 };
      } else {
        qs[questionIndex] = { ...q, options: opts };
      }
      
      next[groupIndex] = { ...g, questions: qs };
      return next;
    });
  };

  const addOption = (groupIndex, questionIndex) => {
    const question = groups[groupIndex].questions[questionIndex];
    
    // Check if all existing options are filled
    if (!checkAllOptionsFilled(question.options || [])) {
      const firstEmptyIndex = (question.options || []).findIndex(opt => !opt.answer?.trim());
      showWarning(`الرجاء ملء الخيار ${firstEmptyIndex + 1} قبل إضافة خيار جديد`);
      return;
    }
    
    // Check maximum limit
    if ((question.options || []).length >= 10) {
      showWarning("الحد الأقصى لعدد الخيارات هو 10");
      return;
    }
    
    setGroups((prev) => {
      const next = [...prev];
      const g = next[groupIndex];
      const qs = [...(g.questions || [])];
      const q = qs[questionIndex];
      const opts = [...(q.options || []), emptyOption()];
      qs[questionIndex] = { ...q, options: opts };
      next[groupIndex] = { ...g, questions: qs };
      return next;
    });
  };

  const removeOption = (groupIndex, questionIndex, optionIndex) => {
    const question = groups[groupIndex].questions[questionIndex];
    if ((question.options || []).length <= 2) {
      showWarning("يجب أن يحتوي السؤال على خيارين على الأقل");
      return;
    }
    
    setGroups((prev) => {
      const next = [...prev];
      const g = next[groupIndex];
      const qs = [...(g.questions || [])];
      const q = qs[questionIndex];
      const opts = [...(q.options || [])];

      opts.splice(optionIndex, 1);

      // fix correctIndex if needed
      let correctIndex = q.correctIndex ?? 0;
      if (correctIndex === optionIndex) correctIndex = 0;
      if (correctIndex > optionIndex) correctIndex -= 1;

      qs[questionIndex] = { ...q, options: opts, correctIndex };
      next[groupIndex] = { ...g, questions: qs };
      return next;
    });
  };

  /* ---------- UI ---------- */

  return (
    <div className="space-y-6">
      {groups.map((group, groupIndex) => (
        <div
          key={group.id || groupIndex}
          className="rounded-2xl border bg-white p-4 shadow-sm space-y-5"
        >
          {/* Group Header */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="font-medium text-gray-800">
              مجموعة #{groupIndex + 1}
            </div>

            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() => removeGroup(groupIndex)}
              disabled={groups.length <= 1}
            >
              حذف المجموعة
            </Button>
          </div>

          {/* Shared content */}
          <div className="space-y-2">
            <div className="text-lg font-medium text-gray-700">
              {mcqSubType === "chemical" ? "المعادلة / المحتوى" : "القطعة"}
            </div>

            <LabeledEditor
              label=""
              value={group.content}
              onChange={(v) => updateGroup(groupIndex, { content: v })}
              editorMinH={180}
              allowImages
              placeholder={
                mcqSubType === "chemical"
                  ? "اكتب المعادلة / المحتوى هنا..."
                  : "اكتب القطعة هنا..."
              }
            />
          </div>

          <Divider className="my-2" />

          {/* Questions under this group */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="font-medium text-gray-800">
              الأسئلة داخل المجموعة
            </div>

            <Button icon={<PlusOutlined />} onClick={() => addQuestion(groupIndex)}>
              إضافة سؤال
            </Button>
          </div>

          <div className="space-y-6">
            {(group.questions || []).map((q, questionIndex) => (
              <div
                key={q.id || questionIndex}
                className="rounded-2xl border p-4 bg-gray-50 space-y-4"
              >
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="font-medium text-gray-800">
                    سؤال #{questionIndex + 1}
                  </div>

                  <Button
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => removeQuestion(groupIndex, questionIndex)}
                    disabled={(group.questions || []).length <= 1}
                  >
                    حذف السؤال
                  </Button>
                </div>

                {/* Instructions field for each question */}
                <div className="space-y-2">
                  <label className="block text-lg font-medium text-gray-700">
                    تعليمات السؤال (اختياري)
                  </label>
                  <input
                    type="text"
                    value={q.instructions || ""}
                    onChange={(e) =>{
                      updateQuestion(groupIndex, questionIndex, {
                        instructions: e.target.value,
                      })
                      setQuestionInstruction(e.target.value)
                    }
                    }
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="مثال: اختر الإجابة الصحيحة، أكمل الجملة التالية، إلخ..."
                  />
                  <p className="text-md text-gray-500">
                    هذه التعليمات ستظهر للطالب قبل الإجابة على هذا السؤال
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="text-lg font-medium text-gray-700">
                    نص السؤال
                  </div>

                  <LabeledEditor
                    label=""
                    value={q.text}
                    onChange={(v) =>
                      updateQuestion(groupIndex, questionIndex, { text: v })
                    }
                    editorMinH={140}
                    allowImages
                    placeholder="اكتب نص السؤال هنا..."
                  />
                </div>

                {/* Options */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div className="text-lg font-medium text-gray-700">
                      خيارات الإجابة
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-md text-gray-500">
                        {(q.options || []).filter(opt => opt.answer?.trim()).length} من {(q.options || []).length} مكتملة
                      </span>
                      <Button
                        icon={<PlusOutlined />}
                        onClick={() => addOption(groupIndex, questionIndex)}
                        disabled={(q.options || []).length >= 10}
                      >
                        إضافة خيار
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {(q.options || []).map((opt, optionIndex) => {
                      const isCorrect = (q.correctIndex ?? 0) === optionIndex;
                      const isEmpty = !opt.answer?.trim();

                      return (
                        <div
                          key={optionIndex}
                          className={`rounded-2xl border p-3 ${
                            isEmpty ? "bg-red-50 border-red-200" : "bg-white border-gray-200"
                          } ${isCorrect ? "border-green-300" : ""}`}
                        >
                          {isEmpty && (
                            <div className="flex items-center gap-1 text-red-600 text-md mb-2">
                              <ExclamationCircleOutlined />
                              <span>هذا الخيار فارغ</span>
                            </div>
                          )}
                          
                          <div className="flex items-center justify-between gap-3 flex-wrap">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                name={`correct-${groupIndex}-${questionIndex}`}
                                checked={isCorrect}
                                onChange={() => {
                                  if (isEmpty) {
                                    showWarning("لا يمكن تحديد خيار فارغ كإجابة صحيحة");
                                    return;
                                  }
                                  updateQuestion(groupIndex, questionIndex, {
                                    correctIndex: optionIndex,
                                  });
                                }}
                                disabled={isEmpty}
                                className={`h-4 w-4 ${isEmpty ? "cursor-not-allowed opacity-50" : ""}`}
                              />
                              <span className={`text-lg font-medium ${isEmpty ? "text-red-600" : "text-gray-700"}`}>
                                خيار #{optionIndex + 1}
                              </span>

                              {isCorrect && !isEmpty && (
                                <span className="inline-flex items-center gap-1 text-md font-semibold text-green-700 bg-green-100 px-2 py-1 rounded-full">
                                  <CheckCircleOutlined />
                                  صحيح
                                </span>
                              )}
                            </label>

                            <Button
                              danger
                              icon={<DeleteOutlined />}
                              onClick={() =>
                                removeOption(groupIndex, questionIndex, optionIndex)
                              }
                              disabled={(q.options || []).length <= 2}
                            >
                              حذف الخيار
                            </Button>
                          </div>

                          <div className="mt-3 space-y-3">
                            <div className="space-y-1">
                              <div className="text-md font-medium text-gray-600">
                                نص الخيار *
                              </div>
                              <LabeledEditor
                                label=""
                                value={opt.answer}
                                onChange={(v) =>
                                  updateOption(groupIndex, questionIndex, optionIndex, {
                                    answer: v,
                                  })
                                }
                                editorMinH={110}
                                allowImages
                                placeholder="اكتب نص الخيار..."
                              />
                              {isEmpty && (
                                <p className="text-red-600 text-md mt-1">هذا الحقل مطلوب</p>
                              )}
                            </div>

                            <div className="space-y-1">
                              <div className="text-md font-medium text-gray-600">
                                شرح الخيار (اختياري)
                              </div>
                              <LabeledEditor
                                label=""
                                value={opt.question_explanation}
                                onChange={(v) =>
                                  updateOption(groupIndex, questionIndex, optionIndex, {
                                    question_explanation: v,
                                  })
                                }
                                editorMinH={90}
                                allowImages
                                placeholder="اشرح لماذا هذا الخيار صحيح/خطأ..."
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}