"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Segmented, Select, Tag } from "antd";
import {
  Plus as PlusIcon,
  Edit3,
  BookOpen,
  Save,
  Trash2,
  ListChecks,
  FileText,
} from "lucide-react";
import "quill/dist/quill.snow.css";

import Card from "./ExamCard";
import ExamMainInfo from "./ExamMainInfo";
import QuestionSections from "./QuestionSections";
import TrueFalseQuestions from "./TrueFalseQuestions";
import EssayQuestions from "./EssayQuestions";
import CompleteQuestions from "./CompleteQuestions";
import DisplayQuestions from "./DisplayQuestions";
import QuestionTypeSelector from "./QuestionTypeSelector";

import {
  colorMap,
  exam_types,
  mock_exam_section_Data,
} from "./utils";

import McqSharedPassageEditor from "./McqSharedPassageEditor/McqSharedPassageEditor";
import LabeledEditor from "./McqSharedPassageEditor/parts/LabeledEditor";

import { useDispatch, useSelector } from "react-redux";
import {
  handleCreateExam,
  handleEditExam,
  handleGetAllExams,
  handleGetAllExamSections,
  handleAddQuestion,
  handleGetExamQuestions,
  handleAssignExam,
  handleGetAllExamData,
  handleUpdateExamQuestions,
  handleGetAllExamByLessonId,
} from "../../lib/features/examSlice";

import { toast } from "react-toastify";
import { useParams, useRouter, useSearchParams } from "next/navigation";

/* helpers */
const emptyOption = () => ({
  answer: "",
  question_explanation: "",
  correct_or_not: "0",
});

const normalizeOption = (opt) => {
  console.log("opt", opt);
  if (typeof opt === "string")
    return { answer: opt, question_explanation: "", correct_or_not: "0" };

  if (opt && typeof opt === "object")
    return {
      answer: opt.answer || opt.text || opt.latex || "",
      instructions: "Instructions",
      question_explanation: opt.question_explanation || opt.explanation || "",
      correct_or_not:
        opt.correct_or_not !== undefined && opt.correct_or_not !== null
          ? String(opt.correct_or_not)
          : "0",
    };

  return emptyOption();
};

export default function ExamMainData({ examData: editExamData, examid }) {
  const dispatch = useDispatch();
  const searchparams = useSearchParams();
  const lessonId = searchparams?.get("lessonId") ?? null;
  const page = searchparams.get("page");
  const pageSize = searchparams.get("pageSize");
  const params = useParams();
  const router = useRouter();

  const [addExam, setAddExam] = useState(false);

  const [examData, setExamData] = useState({
    name: "",
    duration: "",
    type: "",
    sections: [],
  });

  const [filteredSection, setFilteredSection] = useState([]);
  const [questionType, setQuestionType] = useState("mcq");

  const [currentQuestion, setCurrentQuestion] = useState("");
  const [selectedSectionId, setSelectedSectionId] = useState(null);
  const [selectedSectionData, setSelectedSectionData] = useState({});
  const [editingQuestion, setEditingQuestion] = useState(null);

  // ✅ prevent "re-hydrating" form while you type
  const lastLoadedEditIdRef = useRef(null);

  // True/False
  const [trueFalseAnswer, setTrueFalseAnswer] = useState(null);
  const [trueFalseExplanation, setTrueFalseExplanation] = useState("");

  // Essay
  const [modalAnswer, setModalAnswer] = useState("");

  // Complete
  const [completeText, setCompleteText] = useState("");
  const [completeAnswers, setCompleteAnswers] = useState([{ answer: "" }]);

  // MCQ
  const [mcqOptions, setMcqOptions] = useState([
    emptyOption(),
    emptyOption(),
  ]);
  const [mcqCorrectAnswer, setMcqCorrectAnswer] = useState(0);

  const [mcqSubType, setMcqSubType] = useState("general");
  const [mcqPassages, setMcqPassages] = useState({ chemical: [], passage: [] });

  // Add instruction state
  const [questionInstruction, setQuestionInstruction] = useState("");

  const {
    add_exam_loading,
    edit_exam_loading,
    all_exam_list,
    get_exam_sections_list,
    add_question_loading,
    all_exam_data_list,
    all_exam_lesson_loading,
    all_exam_lessons_list,
  } = useSelector((state) => state?.exam);

  const [exmaInfoData, setExamInfoData] = useState({
    title: "",
    description: "",
    free: 0,
    time: "",
    date: "",
    type: "mock",
    level: "medium",
    success_percentage: 50,
  });

  const [openExamSection, setOpenExamSection] = useState(false);
  const [openExamQuestion, setOpenExamQuestion] = useState(false);
  const [filteredData, setFilteredData] = useState({});

  const isEditMode = Boolean(params["exam-id"]);
  const [examId, setExamId] = useState(null);

  /* ===================== Effects ===================== */

  useEffect(() => {
    if (examData?.type === "intern") setFilteredSection(mock_exam_section_Data[1]);
    else if (examData?.type === "mock") setFilteredSection(mock_exam_section_Data[2]);
    else setFilteredSection([]);
  }, [examData?.type]);

  useEffect(() => {
    if (editExamData) setExamData(editExamData);
  }, [editExamData]);

  useEffect(() => {
    const sections = get_exam_sections_list?.data?.message || [];
    if (!selectedSectionId || !sections.length) return;

    const filtered = sections.find((item) => String(item?.id) === String(selectedSectionId));
    if (filtered) setSelectedSectionData(filtered);
  }, [selectedSectionId, get_exam_sections_list]);

  useEffect(() => {
    const sections = get_exam_sections_list?.data?.message || [];
    if (!sections.length) return;

    const hasSelected = selectedSectionId != null;
    const stillExists = hasSelected
      ? sections.some((s) => String(s?.id) === String(selectedSectionId))
      : false;

    // لو مفيش اختيار، أو الاختيار الحالي اتحذف/مش موجود
    if (!hasSelected || !stillExists) {
      setSelectedSectionId(sections[0]?.id);
    }
  }, [get_exam_sections_list, selectedSectionId]);

  useEffect(() => {
    dispatch(handleGetAllExams({ page, per_page: pageSize })).unwrap().catch(() => { });
  }, [dispatch, params["exam-id"], page, pageSize]);

  useEffect(() => {
    if (lessonId) {
      dispatch(
        handleGetAllExamByLessonId({
          body: {
            lesson_id: lessonId
          }
        })
      )
    }
  }, [lessonId])

  useEffect(() => {
    if (lessonId && all_exam_lessons_list?.data?.message?.length > 0) {
      router.push(`/exams/edit/${all_exam_lessons_list?.data?.message[0]?.id}?lessonId=${lessonId}`);
      return;
    }
  }, [lessonId, all_exam_lessons_list])

  useEffect(() => {
    if (params["exam-id"] && !lessonId) {
      const filteredItem = all_exam_list?.data?.message?.data?.find(
        (item) => item?.id == params["exam-id"]
      );
      if (!filteredItem) return;

      setFilteredData(filteredItem);

      setExamInfoData((prev) => ({
        ...prev,
        id: filteredItem?.id,
        title: filteredItem?.title,
        description: filteredItem?.description,
        free: filteredItem?.free,
        level: filteredItem?.level,
        date: filteredItem?.date,
        time: filteredItem?.time,
        type: filteredItem?.type,
        success_percentage: "50",
      }));

      setExamData((prev) => ({
        ...prev,
        type: lessonId ? "intern" : filteredItem?.type,
        sections: filteredItem?.sections || prev.sections || [],
      }));

      setOpenExamSection(true);
      setOpenExamQuestion(true);
    } else if (params["exam-id"] && lessonId) {
      const filteredItem = all_exam_data_list?.data?.message?.exam;
      if (!filteredItem) return;

      setFilteredData(filteredItem);

      setExamInfoData((prev) => ({
        ...prev,
        id: filteredItem?.id,
        title: filteredItem?.title,
        description: filteredItem?.description,
        free: filteredItem?.free,
        level: filteredItem?.level,
        date: filteredItem?.date,
        time: filteredItem?.time,
        type: "intern",
        success_percentage: "50",
      }));

      setExamData((prev) => ({
        ...prev,
        type: "intern",
        sections: filteredItem?.sections || prev.sections || [],
      }));

      setOpenExamSection(true);
      setOpenExamQuestion(true);
    }
  }, [params, all_exam_list, all_exam_data_list, lessonId]);

  useEffect(() => {
    dispatch(
      handleGetAllExamSections({
        body: {
          exam_id:
            examId ||
            params["exam-id"] ||
            openExamSection?.exam_id ||
            openExamQuestion?.section?.exam_id,
        },
      })
    );
  }, [openExamSection, openExamQuestion, dispatch, examId, params]);

  useEffect(() => {
    if (examid || examId) {
      dispatch(handleGetAllExamData({ body: { id: examid || examId } }));
    }
  }, [examId, examid, dispatch]);

  /* ===================== Helpers ===================== */

  const selectedSection = useMemo(
    () => examData.sections.find((s) => s.id === selectedSectionId),
    [examData.sections, selectedSectionId]
  );

  // ✅ FINAL valid formats: (HH:)?MM:SS
  const timeRegexFinal = /^(?:([0-9]{1,2}):)?([0-5][0-9]):([0-5][0-9])$/;

  // ✅ allow progressive typing: digits + colons only, up to 8 chars-ish
  const timeRegexPartial = /^[0-9:]*$/;

  const handleBasicDataChange = (field, value) => {
    setExamInfoData((prev) => ({ ...prev, [field]: value }));
  };

  const handleExamTypeChange = (type) => {
    setExamInfoData((prev) => ({ ...prev, type: type.value }));
    setExamData((prev) => ({
      ...prev,
      exam_type: type.value,
      lesson_id: type.value === "full_round" ? "" : prev.lesson_id,
      sections: [],
    }));
  };

  const handleSubmitBasicData = () => {
    if (!exmaInfoData.title) {
      toast.warn("ادخل اسم الاختبار أولا!");
      return;
    }

    if (lessonId && !exmaInfoData?.time.trim()) {
      toast.warn("ادخل وقت الاختبار  أولا");
      return;
    }
    if (!exmaInfoData?.date) {
      toast.warn("اختر تاريخ أولا");
      return;
    }

    if (params["exam-id"]) {
      const data_send = {
        id: params["exam-id"],
        title: exmaInfoData.title,
        description: exmaInfoData.description,
        free: `${exmaInfoData.free}`,
        time: exmaInfoData?.time?.trim() ? exmaInfoData.time.trim() : null,
        date: exmaInfoData.date,
        level: exmaInfoData?.level,
        type: lessonId ? "intern" : "mock",
        success_percentage: "50",
      };

      dispatch(handleEditExam({ body: data_send }))
        .unwrap()
        .then((res) => {
          if (res?.data?.status == "success") {
            toast.success("تم تعديل الاختبار بنجاح!");
            setExamId(res?.data?.message?.id);
            setOpenExamSection(res?.data?.message);

            // Refresh exam data
            dispatch(handleGetAllExams({ page: 1, per_page: 1000000 }));
            dispatch(handleGetAllExamData({ body: { id: res?.data?.message?.id } }));
          } else {
            toast.error(res?.error?.response?.data?.message || "هناك خطأ أثناء تعديل الاختبار");
            setOpenExamSection(false);
          }
        })
        .catch(() => toast.error("حدث خطأ أثناء تعديل الاختبار."));
    } else {
      const data_send = {
        title: exmaInfoData.title,
        description: exmaInfoData.description,
        free: JSON.stringify(exmaInfoData.free),
        time: exmaInfoData?.time?.trim() ? exmaInfoData.time.trim() : null,
        date: exmaInfoData.date,
        level: exmaInfoData?.level,
        type: lessonId ? "intern" : "mock",
        success_percentage: "50",
      };

      dispatch(handleCreateExam({ body: data_send }))
        .unwrap()
        .then((res) => {
          if (res?.data?.status == "success") {
            toast.success("تم إضافة الاختبار بنجاح!");
            setOpenExamSection(res?.data?.message);
            const createdId = res?.data?.message?.id;
            setExamId(createdId);
            setAddExam(true);
            dispatch(handleGetAllExams({ page: 1, per_page: 1000000 }));

            if (lessonId) {
              dispatch(
                handleAssignExam({
                  body: {
                    type: "lesson",
                    exam_id: createdId,
                    lesson_or_round_id: lessonId,
                  },
                })
              );
            }

            dispatch(handleGetAllExamSections({ body: { exam_id: createdId } }));

            // Refresh exam data
            dispatch(handleGetAllExamData({ body: { id: createdId } }));

            setExamData((prev) => ({ ...prev, sections: [] }));
          } else {
            toast.error("هناك خطأ أثناء إضافة الاختبار");
            setOpenExamSection(false);
          }
        })
        .catch(() => toast.error("حدث خطأ أثناء إضافة الاختبار."));
    }
  };

  const resetQuestionForm = () => {
    setCurrentQuestion("");
    setQuestionInstruction(""); // Reset instruction
    setTrueFalseAnswer(null);
    setTrueFalseExplanation("");
    setModalAnswer("");
    setCompleteText("");
    setCompleteAnswers([{ answer: "" }]);
    setMcqOptions([emptyOption(), emptyOption()]);
    setMcqCorrectAnswer(0);
    setEditingQuestion(null);
    setMcqSubType("general");
    setMcqPassages({ chemical: [], passage: [] });

    lastLoadedEditIdRef.current = null;
  };

  const updateMcqOption = (index, field, v) =>
    setMcqOptions((opts) => {
      const next = [...opts];
      next[index] = { ...normalizeOption(next[index]), [field]: v };
      next[index].correct_or_not = mcqCorrectAnswer === index ? "1" : "0";
      return next;
    });

  const addMcqOption = () => {
    // Check if all existing options have content
    const allOptionsFilled = mcqOptions.every(opt => opt.answer?.trim());

    if (!allOptionsFilled) {
      // Find the first empty option
      const firstEmptyIndex = mcqOptions.findIndex(opt => !opt.answer?.trim());
      toast.error(`الرجاء ملء الخيار ${firstEmptyIndex + 1} قبل إضافة خيار جديد`);
      return;
    }

    // Also check maximum limit if needed
    if (mcqOptions.length >= 10) {
      toast.error("الحد الأقصى لعدد الخيارات هو 10");
      return;
    }

    setMcqOptions((opts) => [...opts, emptyOption()]);
  };

  const removeMcqOption = (index) => {
    if (mcqOptions.length <= 2) {
      toast.error("يجب أن يحتوي السؤال على خيارين على الأقل");
      return;
    }

    setMcqOptions((opts) => {
      const next = opts.filter((_, i) => i !== index);
      setMcqCorrectAnswer((curr) => (curr >= index ? Math.max(0, curr - 1) : curr));
      return next;
    });
  };

  const getQuestionsCount = (sectionId) =>
    sectionId
      ? examData.sections.find((s) => s.id === sectionId)?.questions?.length || 0
      : 0;

  const canAddMoreQuestions = (sectionId) =>
    !sectionId ? false : examData.type !== "mock" ? true : getQuestionsCount(sectionId) < 24;

  const handleQuestionTypeChange = (type) => {
    setQuestionType(type);
    resetQuestionForm();
  };

  const handleMcqPassagesChange = useCallback(
    (passages) => setMcqPassages((prev) => ({ ...prev, [mcqSubType]: passages })),
    [mcqSubType]
  );

  // paragraph_mcq -> passage editor shape
  const convertParagraphToPassageEditor = (q) => {
    const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

    const toOpt = (opt) => ({
      answer: opt?.text || "",
      question_explanation: opt?.explanation || "",
      images: Array.isArray(opt?.images) ? opt.images : [],
    });

    const questions = (q?.questions || []).map((qq) => {
      const opts = (qq?.options || []).map(toOpt);
      const correctIndex = (qq?.options || []).findIndex((o) => o?.isCorrect);
      const safeOpts = opts.length >= 2 ? opts : [toOpt({}), toOpt({})];

      return {
        id: uid(),
        text: qq?.questionText || "",
        options: safeOpts,
        correctIndex: correctIndex >= 0 ? correctIndex : 0,
        attachments: Array.isArray(qq?.attachments) ? qq.attachments : [],
      };
    });

    return [
      {
        id: uid(),
        content: q?.paragraphContent || "",
        attachments: Array.isArray(q?.attachments) ? q.attachments : [],
        questions,
      },
    ];
  };

  const refreshAfterAdd = async (res) => {
    await dispatch(handleGetAllExams({
      page: 1,
      per_page: 10000000
    }))
    const exSectionId =
      res?.data?.message?.exam_section_id ||
      res?.data?.message?.paragraph?.exam_section_id ||
      res?.data?.message?.questions?.[0]?.exam_section_id ||
      res?.data?.message?.paragraph?.[0]?.exam_section_id ||
      selectedSectionId;

    if (!exSectionId) return;

    try {
      // Refresh exam questions
      await dispatch(handleGetExamQuestions({ body: { exam_section_id: exSectionId } }));

      // Also refresh the exam data if we have examId
      if (examId || examid || params["exam-id"]) {
        const examIdToUse = examId || examid || params["exam-id"];
        await dispatch(handleGetAllExamData({ body: { id: examIdToUse } }));
      }

      // Refresh exam sections
      await dispatch(handleGetAllExamSections({
        body: { exam_id: examId || params["exam-id"] }
      }));
    } catch (error) {
      console.error("Error refreshing data:", error);
    }
  };

  const validateQuestionBeforeSubmit = () => {
    // Validate for empty question
    if (questionType !== "mcq" && !currentQuestion.trim()) {
      toast.error("يرجى كتابة نص السؤال");
      return false;
    }

    // Validate MCQ options
    if (questionType === "mcq" && mcqSubType === "general") {
      // Check if all options are filled
      const allOptionsFilled = mcqOptions.every(opt => opt.answer?.trim());
      if (!allOptionsFilled) {
        const firstEmptyIndex = mcqOptions.findIndex(opt => !opt.answer?.trim());
        toast.error(`الرجاء ملء نص الخيار ${firstEmptyIndex + 1}`);
        return false;
      }

      const validOptions = mcqOptions.filter(opt => opt.answer?.trim());
      if (validOptions.length < 2) {
        toast.error("يجب إضافة خيارين على الأقل مع نص");
        return false;
      }

      // Check for duplicate options
      const optionTexts = validOptions.map(opt => opt.answer.trim().toLowerCase());
      const uniqueTexts = new Set(optionTexts);
      if (uniqueTexts.size !== optionTexts.length) {
        toast.error("لا يمكن أن تحتوي الخيارات على نفس النص");
        return false;
      }

      // Check if a correct answer is selected
      if (mcqCorrectAnswer < 0 || mcqCorrectAnswer >= mcqOptions.length) {
        toast.error("يجب تحديد الإجابة الصحيحة");
        return false;
      }
    }

    // Validate true/false
    if (questionType === "trueFalse" && trueFalseAnswer === null) {
      toast.error("اختر إجابة صحيحة");
      return false;
    }

    // Validate essay
    if (questionType === "essay" && !modalAnswer.trim()) {
      toast.error("أضف نموذج الإجابة");
      return false;
    }

    // Validate complete
    if (questionType === "complete") {
      if (!completeText.trim()) {
        toast.error("اكتب نص الجملة");
        return false;
      }

      // Check if all complete answers are filled
      const hasEmptyCompleteAnswers = completeAnswers.some(a => !a.answer?.trim());
      if (hasEmptyCompleteAnswers) {
        toast.error("الرجاء ملء جميع الإجابات");
        return false;
      }

      if (completeAnswers.filter((a) => a.answer.trim()).length === 0) {
        toast.error("أضف إجابة واحدة على الأقل");
        return false;
      }
    }

    // Validate MCQ passage
    if (questionType === "mcq" && mcqSubType === "passage") {
      const groups = mcqPassages.passage || [];
      if (!groups.length) {
        toast.error("يجب إضافة محتوى الفقرة");
        return false;
      }

      let hasValidQuestions = false;
      for (const group of groups) {
        for (const q of group.questions || []) {
          if (q.text?.trim()) {
            hasValidQuestions = true;

            // Check if all options in this question are filled
            const allOptionsFilled = (q.options || []).every(opt => opt.answer?.trim());
            if (!allOptionsFilled) {
              toast.error("جميع خيارات الأسئلة في الفقرة يجب أن تحتوي على نص");
              return false;
            }

            const validOptions = (q.options || []).filter(opt => opt.answer?.trim());
            if (validOptions.length < 2) {
              toast.error("كل سؤال في الفقرة يجب أن يحتوي على خيارين على الأقل");
              return false;
            }

            // Check if correct index is valid
            if (q.correctIndex < 0 || q.correctIndex >= validOptions.length) {
              toast.error("يجب تحديد إجابة صحيحة لكل سؤال في الفقرة");
              return false;
            }
          }
        }
      }

      if (!hasValidQuestions) {
        toast.error("يجب إضافة سؤال واحد على الأقل في الفقرة");
        return false;
      }
    }

    return true;
  };

  /* ===================== Add / Update Question ===================== */
  const addOrUpdateQuestion = async () => {
    if (!selectedSectionId) {
      toast.error("يرجى اختيار قسم أولاً");
      return;
    }

    // Validate question before proceeding
    if (!validateQuestionBeforeSubmit()) {
      return;
    }

    const section = examData?.sections.find((s) => s.id === selectedSectionId);
    const currentCount = section?.questions?.length || 0;
    const isMock = examData.type === "mock";
    const maxPerSection = 24;
    const canAdd = (count = 1) => !isMock || currentCount + count <= maxPerSection;

    // ========== EDIT MODE ==========
    if (editingQuestion) {
      let payload;

      switch (questionType) {
        case "mcq":
          if (mcqSubType === "general") {
            payload = {
              id: editingQuestion.id,
              question_text: currentQuestion,
              instructions: questionInstruction || "اختر الإجابة الصحيحة",
              exam_section_id: selectedSectionId,
              mcq_array: mcqOptions.map((opt, idx) => ({
                ...normalizeOption(opt),
                correct_or_not: mcqCorrectAnswer === idx ? "1" : "0",
              })),
            };
          } else if (mcqSubType === "passage") {
            const groups = mcqPassages.passage || [];
            if (!groups.length) {
              toast.error("يجب إضافة محتوى الفقرة");
              return;
            }

            payload = {
              id: editingQuestion.id,
              question_type: "paragraph_mcq",
              paragraph_content: groups[0]?.content || "",
              question_text: groups[0]?.questions?.[0]?.text || currentQuestion,
              instructions: questionInstruction || "اختر الإجابة الصحيحة",
              exam_section_id: selectedSectionId,
              mcq_array:
                groups[0]?.questions?.[0]?.options?.map((opt, idx) => ({
                  ...normalizeOption(opt),
                  correct_or_not: groups[0]?.questions?.[0]?.correctIndex === idx ? "1" : "0",
                })) || [],
            };
          }
          break;

        case "trueFalse":
          payload = {
            id: editingQuestion.id,
            question_text: currentQuestion,
            instructions: questionInstruction || "اختر الإجابة الصحيحة",
            exam_section_id: selectedSectionId,
        
            mcq_array: [
              {
                answer: "صحيح",
                correct_or_not: trueFalseAnswer === true ? "1" : "0",
                question_explanation: trueFalseExplanation || "",
              },
              {
                answer: "خطأ",
                correct_or_not: trueFalseAnswer === false ? "1" : "0",
                question_explanation: trueFalseExplanation || "",
              },
            ],
          };
          break;

        case "essay":
          payload = {
            id: editingQuestion.id,
            question_text: currentQuestion,
            instructions: questionInstruction || "أجب عن السؤال التالي",
            exam_section_id: selectedSectionId,
            model_answer: modalAnswer,
          };
          break;

        case "complete":
          payload = {
            id: editingQuestion.id,
            question_text: completeText,
            instructions: questionInstruction || "أكمل الجملة التالية",
            exam_section_id: selectedSectionId,
            answers: completeAnswers.map((a) => a.answer).filter(Boolean),
          };
          break;
      }

      try {
        const result = await dispatch(handleUpdateExamQuestions({ body: payload })).unwrap();

        if (result?.data?.status === "success") {
          toast.success("تم تحديث السؤال بنجاح");
          await refreshAfterAdd(result);
          resetQuestionForm();
        } else {
          toast.error(result?.error?.response?.data?.message || "فشل تحديث السؤال");
          // Don't reset form on error
          return;
        }
      } catch (error) {
        toast.error(error?.message || "فشل تحديث السؤال");
        // Don't reset form on error
        return;
      }

      return;
    }

    /* ========== MCQ PASSAGE ADD ========== */
    if (questionType === "mcq" && mcqSubType === "passage") {
      const groups = mcqPassages.passage || [];
      const flatQuestions = [];
      const paragraphPayloads = [];

      for (const group of groups) {
        if (!group?.content?.trim()) continue;

        const groupQuestionsForPayload = [];

        for (const q of group.questions || []) {
          if (!q.text?.trim()) continue;

          const normalizedOptions = (q.options || []).map((opt, idx) => ({
            ...normalizeOption(opt),
            correct_or_not: q.correctIndex === idx ? "1" : "0",
          }));

          if (normalizedOptions.length < 2) {
            toast.error("كل سؤال في الفقرة يجب أن يحتوي على خيارين على الأقل");
            return;
          }

          flatQuestions.push({
            id: Date.now() + Math.random(),
            question_type: "paragraph_mcq",
            question_text: q.text,
            exam_section_id: selectedSectionId,
            mcqSubType: "passage",
            mcq_array: normalizedOptions,
            correctAnswer: q.correctIndex ?? 0,
            paragraph_content: group.content,
            instructions: q?.instructions?.trim() || questionInstruction || "اختر الإجابة الصحيحة",
          });

          groupQuestionsForPayload.push({
            question_text: q.text,
            instructions: q?.instructions?.trim() || questionInstruction || "اختر الإجابة الصحيحة",
            mcq_array: normalizedOptions,
          });
        }

        if (groupQuestionsForPayload.length) {
          paragraphPayloads.push({
            exam_section_id: selectedSectionId,
            question_type: "paragraph_mcq",
            paragraph_content: group.content,
            questions: groupQuestionsForPayload,
          });
        }
      }

      if (!flatQuestions.length) {
        toast.error("لم يتم إنشاء أي سؤال صالح للفقرة");
        return;
      }

      if (!canAdd(flatQuestions.length)) {
        toast.error("الحد الأقصى 24 سؤال لكل قسم في الاختبار المحاكي");
        return;
      }

      // Save original form data in case of error
      const originalMcqPassages = JSON.parse(JSON.stringify(mcqPassages));
      const originalInstruction = questionInstruction;

      try {
        for (const payload of paragraphPayloads) {
          const res = await dispatch(handleAddQuestion({ body: payload })).unwrap();
          if (res?.data?.status === "success") {
            toast.success("تم اضافة السؤال بنجاح");
          } else {
            toast.error(res?.error?.response?.data?.message || "فشل حفظ أسئلة الفقرة");
            // Restore original data on error
            setMcqPassages(originalMcqPassages);
            setQuestionInstruction(originalInstruction);
            return;
          }
        }

        await refreshAfterAdd({ data: { status: "success" } });
        resetQuestionForm();
      } catch (err) {
        toast.error(err?.message || "فشل حفظ أسئلة الفقرة");
        // Restore original data on error
        setMcqPassages(originalMcqPassages);
        setQuestionInstruction(originalInstruction);
        return;
      }

      return;
    }

    /* ========== NORMAL QUESTIONS ADD ========== */
    if (isMock && !canAdd()) {
      toast.error("تم الوصول للحد الأقصى (24 سؤال) في هذا القسم");
      return;
    }

    const baseQuestion = {
      id: Date.now() + Math.random(),
      question_type: questionType,
      question_text: currentQuestion,
      instructions: questionInstruction || "Instructions",
      exam_section_id: selectedSectionId,
    };

    let finalQuestion = { ...baseQuestion };

    switch (questionType) {
      case "mcq":
        finalQuestion = {
          ...finalQuestion,
          question_type: "mcq",
          mcqSubType: "general",
          mcq_array: mcqOptions.map((opt, idx) => ({
            ...normalizeOption(opt),
            correct_or_not: mcqCorrectAnswer === idx ? "1" : "0",
          })),
          correctAnswer: mcqCorrectAnswer,
        };
        break;

      case "trueFalse":
        finalQuestion = {
          ...finalQuestion,
          question_type: "t_f",
          correctAnswer: trueFalseAnswer,
          explanation: trueFalseExplanation,
          mcq_array: [
            {
              answer: "صحيح",
              correct_or_not: trueFalseAnswer === true ? "1" : "0",
              question_explanation: trueFalseExplanation || "",
            },
            {
              answer: "خطأ",
              correct_or_not: trueFalseAnswer === false ? "1" : "0",
              question_explanation: trueFalseExplanation || "",
            },
          ],
        };
        break;

      case "essay":
        finalQuestion = {
          ...finalQuestion,
          model_answer: modalAnswer,
        };
        break;

      case "complete":
        finalQuestion = {
          ...finalQuestion,
          text: completeText,
          answers: completeAnswers.map((a) => a.answer).filter(Boolean),
        };
        break;
    }

    // Save original form data in case of error
    const originalFormData = {
      currentQuestion,
      questionInstruction,
      trueFalseAnswer,
      trueFalseExplanation,
      modalAnswer,
      completeText,
      completeAnswers: JSON.parse(JSON.stringify(completeAnswers)),
      mcqOptions: JSON.parse(JSON.stringify(mcqOptions)),
      mcqCorrectAnswer,
    };

    try {
      const res = await dispatch(handleAddQuestion({ body: finalQuestion })).unwrap();
      if (res?.data?.status === "success") {
        toast.success("تم اضافة السؤال بنجاح");
        await refreshAfterAdd(res);
        resetQuestionForm();
      } else {
        toast.error(res?.error?.response?.data?.message || "فشل حفظ السؤال");
        // Restore original form data on error
        setCurrentQuestion(originalFormData.currentQuestion);
        setQuestionInstruction(originalFormData.questionInstruction);
        setTrueFalseAnswer(originalFormData.trueFalseAnswer);
        setTrueFalseExplanation(originalFormData.trueFalseExplanation);
        setModalAnswer(originalFormData.modalAnswer);
        setCompleteText(originalFormData.completeText);
        setCompleteAnswers(originalFormData.completeAnswers);
        setMcqOptions(originalFormData.mcqOptions);
        setMcqCorrectAnswer(originalFormData.mcqCorrectAnswer);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "فشل حفظ السؤال");
      // Restore original form data on error
      setCurrentQuestion(originalFormData.currentQuestion);
      setQuestionInstruction(originalFormData.questionInstruction);
      setTrueFalseAnswer(originalFormData.trueFalseAnswer);
      setTrueFalseExplanation(originalFormData.trueFalseExplanation);
      setModalAnswer(originalFormData.modalAnswer);
      setCompleteText(originalFormData.completeText);
      setCompleteAnswers(originalFormData.completeAnswers);
      setMcqOptions(originalFormData.mcqOptions);
      setMcqCorrectAnswer(originalFormData.mcqCorrectAnswer);
    }
  };

  /* ===================== Hydrate edit form ONCE ===================== */
  useEffect(() => {
    if (!editingQuestion) return;

    if (lastLoadedEditIdRef.current === editingQuestion.id) return;
    lastLoadedEditIdRef.current = editingQuestion.id;

    if (editingQuestion?.exam_section_id) setSelectedSectionId(editingQuestion.exam_section_id);

    // Set the instruction from editing question
    setQuestionInstruction(editingQuestion.instructions || "");

    if (editingQuestion.type === "mcq") {
      setQuestionType("mcq");
      setMcqSubType("general");
      setCurrentQuestion(editingQuestion.question || "");

      if (editingQuestion.options && editingQuestion.options.length > 0) {
        const normalizedOptions = editingQuestion.options.map((opt) => ({
          answer: opt.text || "",
          question_explanation: opt.explanation || "",
          correct_or_not: opt.is_correct?.toString() || "0",
        }));

        while (normalizedOptions.length < 4) normalizedOptions.push(emptyOption());
        setMcqOptions(normalizedOptions);

        const correctIndex =
          normalizedOptions.findIndex((o) => o.correct_or_not === "1") >= 0
            ? normalizedOptions.findIndex((o) => o.correct_or_not === "1")
            : editingQuestion.correctAnswer || 0;

        setMcqCorrectAnswer(correctIndex >= 0 ? correctIndex : 0);
      }
    } else if (editingQuestion.type === "paragraph_mcq") {
      setQuestionType("mcq");
      setMcqSubType("passage");
      const passageArr = convertParagraphToPassageEditor(editingQuestion);
      setMcqPassages((prev) => ({ ...prev, passage: passageArr }));
    }
  }, [editingQuestion?.id]);

  /* ===================== UI ===================== */

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-6 bg-gray-50 min-h-screen" dir="rtl">
      <ExamMainInfo
        addExam={addExam}
        lessonId={lessonId || null}
        add_exam_loading={add_exam_loading}
        edit_exam_loading={edit_exam_loading}
        exam_types={exam_types}
        examData={examData}
        setExamData={setExamData}
        examInfoData={exmaInfoData}
        handleBasicDataChange={handleBasicDataChange}
        handleExamTypeChange={handleExamTypeChange}
        handleSubmitBasicData={handleSubmitBasicData}
      />

      {(openExamSection || isEditMode) && (
        <QuestionSections
          lessonId={lessonId}
          examInfoData={exmaInfoData}
          examId={examId}
          editData={filteredData}
          data={openExamSection}
          examData={examData}
          filteredSection={filteredSection}
        />
      )}

      {(openExamSection && get_exam_sections_list?.data?.message?.length) || isEditMode ? (
        <>
          <Card title="إنشاء الأسئلة" icon={Edit3}>
            <div className="space-y-6">
              <QuestionTypeSelector
                colorMap={colorMap}
                questionType={questionType}
                onTypeChange={handleQuestionTypeChange}
              />

              {/* Section selector */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-lg font-medium text-gray-700">
                    اختر القسم لإضافة السؤال
                  </label>
                  {selectedSection && (
                    <Tag color="blue">إجمالي أسئلة القسم: {getQuestionsCount(selectedSection.id)}</Tag>
                  )}
                </div>

                <Select
                  style={{ width: "100%", height: "105%", padding: "20px 0px !important" }}
                  placeholder="اختر قسمًا"
                  value={selectedSectionId}
                  onChange={(v) => setSelectedSectionId(v)}
                  showSearch
                  optionFilterProp="label"
                  dropdownStyle={{ borderRadius: 12 }}
                  options={get_exam_sections_list?.data?.message?.map((section) => ({
                    value: section?.id,
                    label: (
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div
                            className="font-medium text-gray-800"
                            dangerouslySetInnerHTML={{ __html: section?.title }}
                          />
                          {section?.description ? (
                            <div
                              className="text-md text-gray-500"
                              dangerouslySetInnerHTML={{ __html: section?.description }}
                            />
                          ) : null}
                        </div>
                      </div>
                    ),
                  }))}
                  dropdownRender={(menu) => (
                    <div className="p-2">
                      <div className="px-2 pb-2 text-md text-gray-500">
                        اختر من الأقسام المضافة بالأسفل
                      </div>
                      <div className="rounded-xl border">{menu}</div>
                    </div>
                  )}
                />
              </div>

              {/* Instruction field - Common for all question types */}


              {/* MCQ types */}
              {questionType === "mcq" && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <label className="block text-lg font-medium text-gray-700">
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
                              <FileText className="w-4 h-4" />
                              <span>قطعة</span>
                            </div>
                          ),
                          value: "passage",
                        },
                      ]}
                    />
                  </div>

                  {mcqSubType === "general" ? (
                    <div className="space-y-8">
                    
                      <div>
                        <label className="block text-lg font-semibold text-gray-800 mb-4">
                          نص السؤال
                        </label>
                        <LabeledEditor
                          label=""
                          value={currentQuestion}
                          onChange={setCurrentQuestion}
                          editorMinH={180}
                          allowImages
                          placeholder="اكتب نص السؤال هنا..."
                        />
                      </div>

                       <div className="space-y-2">
                        <label htmlFor="instruction" className="block text-lg font-medium text-gray-700">
                          تعليمات السؤال (اختياري)
                        </label>
                        <input
                          id="instruction"
                          type="text"
                          value={questionInstruction}
                          onChange={(e) => setQuestionInstruction(e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="مثال: اختر الإجابة الصحيحة، أكمل الجملة التالية، إلخ..."
                        />
                        <p className="text-md text-gray-500">
                          هذه التعليمات ستظهر للطالب قبل الإجابة على السؤال
                        </p>
                      </div>

                      <div className="space-y-5">
                        <div className="flex items-center justify-between mb-5">
                          <label className="text-lg font-semibold text-gray-800">
                            خيارات الإجابة
                          </label>
                          <span className="text-md text-gray-500">
                            يجب تحديد إجابة صحيحة واحدة فقط
                          </span>
                        </div>

                        <div className="space-y-6">
                          {mcqOptions.map((option, index) => {
                            const letter = String.fromCharCode(1632 + index + 1);
                            const isCorrect = mcqCorrectAnswer === index;
                            const isEmpty = !option.answer?.trim();

                            return (
                              <div
                                key={index}
                                className={`relative overflow-hidden rounded-3xl border-2 transition-all duration-300 ${isEmpty ? "border-red-300 bg-red-50/30 animate-pulse" :
                                  isCorrect
                                    ? "border-green-400 bg-green-50/50 shadow-lg shadow-green-100"
                                    : "border-gray-200 bg-white shadow-md"
                                  }`}
                              >
                                {isEmpty && (
                                  <div className="absolute top-3 right-3">
                                    <span className="px-2 py-1 text-md font-bold text-red-700 bg-red-200 rounded-full">
                                      ⚠️ غير مكتمل
                                    </span>
                                  </div>
                                )}

                                <div className="flex items-center justify-between p-5">
                                  <div className="flex items-center gap-4">
                                    <div
                                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-lg font-bold shadow-md transition-colors ${isCorrect ? "bg-green-600 text-white" :
                                        isEmpty ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700"
                                        }`}
                                    >
                                      {letter}
                                    </div>

                                    <label className="flex items-center gap-3 cursor-pointer">
                                      <input
                                        type="radio"
                                        name="correctAnswer"
                                        checked={isCorrect}
                                        onChange={() => {
                                          if (!option.answer?.trim()) {
                                            toast.error("الرجاء ملء نص الخيار قبل تحديده كإجابة صحيحة");
                                            return;
                                          }
                                          setMcqCorrectAnswer(index);
                                        }}
                                        disabled={isEmpty}
                                        className="h-5 w-5 text-green-600 focus:ring-green-500 disabled:cursor-not-allowed disabled:opacity-50"
                                      />
                                      <span className={`font-medium ${isEmpty ? "text-red-600" : "text-gray-700"}`}>
                                        {isCorrect ? "الإجابة الصحيحة" : "تحديد كإجابة صحيحة"}
                                      </span>
                                      {isCorrect && !isEmpty && (
                                        <span className="px-3 py-1 text-md font-bold text-green-700 bg-green-200 rounded-full">
                                          ✓ صحيحة
                                        </span>
                                      )}
                                    </label>
                                  </div>

                                  {mcqOptions.length > 2 && (
                                    <button
                                      type="button"
                                      onClick={() => removeMcqOption(index)}
                                      className="p-2 text-red-600 rounded-xl hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                      title="حذف هذا الخيار"
                                      disabled={mcqOptions.length <= 2}
                                    >
                                      <Trash2 className="w-5 h-5" />
                                    </button>
                                  )}
                                </div>

                                <div className="px-6 pb-6 space-y-6 border-t border-gray-100">
                                  <div>
                                    <label className="block text-lg font-medium text-gray-700 mb-3">
                                      نص الخيار *
                                    </label>
                                    <LabeledEditor
                                      label=""
                                      value={option.answer}
                                      onChange={(v) => {
                                        updateMcqOption(index, "answer", v);

                                        // Clear correct answer selection if this option was correct and is now empty
                                        if (mcqCorrectAnswer === index && !v.trim()) {
                                          setMcqCorrectAnswer(0);
                                          toast.warning("تم إلغاء تحديد الإجابة الصحيحة لأن الخيار أصبح فارغاً");
                                        }
                                      }}
                                      editorMinH={130}
                                      allowImages
                                      placeholder="اكتب نص الخيار هنا..."
                                    />
                                    {isEmpty && (
                                      <p className="text-red-600 text-md mt-2">هذا الحقل مطلوب</p>
                                    )}
                                  </div>

                                  <div>
                                    <label className="block text-lg font-medium text-gray-700 mb-3 flex items-center gap-2">
                                      شرح الخيار
                                      <span className="text-md font-normal text-gray-500">
                                        (يظهر بعد الإجابة في وضع المراجعة)
                                      </span>
                                    </label>
                                    <LabeledEditor
                                      label=""
                                      value={option.question_explanation}
                                      onChange={(v) => updateMcqOption(index, "question_explanation", v)}
                                      editorMinH={100}
                                      allowImages
                                      placeholder="اشرح لماذا هذا الخيار صحيح أو خاطئ..."
                                    />
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        <div className="flex justify-center pt-4">
                          <button
                            type="button"
                            onClick={addMcqOption}
                            disabled={mcqOptions.length >= 10}
                            className="inline-flex items-center gap-3 px-6 py-3 text-lg font-medium text-blue-700 bg-blue-50 rounded-2xl hover:bg-blue-100 hover:shadow-md transition-all shadow-sm border border-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <PlusIcon className="w-5 h-5" />
                            إضافة خيار جديد
                            {mcqOptions.length >= 10 && (
                              <span className="text-md text-red-600">(الحد الأقصى 10)</span>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <McqSharedPassageEditor
                      questionInstruction={questionInstruction}
                      setQuestionInstruction={setQuestionInstruction}
                      key={`${mcqSubType}:${editingQuestion?.id ?? "new"}`}
                      mcqSubType={mcqSubType}
                      initialData={
                        mcqPassages?.[mcqSubType]?.length ? mcqPassages[mcqSubType] : editingQuestion
                      }
                      onPassagesChange={handleMcqPassagesChange}
                    />
                  )}
                </div>
              )}

              {/* Non-MCQ */}
              {questionType === "trueFalse" && (
                <div>

                  <TrueFalseQuestions
                    questionInstruction={questionInstruction}
                    setQuestionInstruction={setQuestionInstruction}
                    questionHtml={currentQuestion}
                    setQuestionHtml={setCurrentQuestion}
                    trueFalseExplanation={trueFalseExplanation}
                    trueFalseAnswer={trueFalseAnswer}
                    setTrueFalseAnswer={setTrueFalseAnswer}
                    setTrueFalseExplanation={setTrueFalseExplanation}
                  />
                  <div className="space-y-2">
                    <label htmlFor="instruction" className="block text-sm font-medium text-gray-700">
                      تعليمات السؤال (اختياري)
                    </label>
                    <input
                      id="instruction"
                      type="text"
                      value={questionInstruction}
                      onChange={(e) => setQuestionInstruction(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="مثال: اختر الإجابة الصحيحة، أكمل الجملة التالية، إلخ..."
                    />
                    <p className="text-md text-gray-500">
                      هذه التعليمات ستظهر للطالب قبل الإجابة على السؤال
                    </p>
                  </div>
                </div>
              )}


              {/* Sticky action bar */}
              <div className="pt-4 border-t sticky bottom-0 bg-gray-50/75 backdrop-blur z-10">
                <button
                  type="button"
                  onClick={addOrUpdateQuestion}
                  disabled={
                    add_question_loading ||
                    !selectedSectionId ||
                    (questionType !== "mcq" && !currentQuestion.trim()) ||
                    (examData.type === "mock" && !canAddMoreQuestions(selectedSectionId))
                  }
                  className="w-full inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-200 bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 px-4 py-3 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {editingQuestion ? <Save className="h-4 w-4" /> : <PlusIcon className="h-4 w-4" />}
                  {editingQuestion
                    ? "تحديث السؤال"
                    : add_question_loading
                      ? "جاري الحفظ..."
                      : "إضافة السؤال"}
                </button>
              </div>
            </div>
          </Card>

          {/* Questions list */}
          <DisplayQuestions
            selectedSection={selectedSectionData}
            selectedSectionId={selectedSectionId}
            setEditingQuestion={setEditingQuestion}
          />
        </>
      ) : (
        <div className="text-center py-12">
          <div className="bg-blue-50 p-6 rounded-full w-20 h-20 mx-auto flex items-center justify-center mb-4">
            <BookOpen className="h-10 w-10 text-blue-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">ابدأ بإنشاء اختبار جديد</h3>
          <p className="text-gray-600 mb-6">
            املأ معلومات الاختبار الأساسية وأضف الأقسام لبدء إنشاء الأسئلة
          </p>
        </div>
      )}
    </div>
  );
}