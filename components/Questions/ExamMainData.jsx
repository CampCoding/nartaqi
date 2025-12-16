"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Segmented, Select, Tag } from "antd";
import {
  Plus as PlusIcon,
  Edit3,
  BookOpen,
  Save,
  X,
  ListChecks,
  FlaskConical,
  FileText,
  FileVideo,
  FilePlus,
  FileIcon,
  VideoIcon,
} from "lucide-react";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CalendarOutlined,
  CaretDownOutlined,
  FileTextOutlined,
  PlayCircleOutlined,
  PaperClipOutlined,
} from "@ant-design/icons";
// Quill CSS
import "quill/dist/quill.snow.css";

// External components (keep your own paths)
import QuestionStats from "./QuestionStats";
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
  questionTypes,
} from "./utils";

import McqSharedPassageEditor from "./McqSharedPassageEditor/McqSharedPassageEditor";
import LabeledEditor from "./McqSharedPassageEditor/parts/LabeledEditor";
import { useDispatch, useSelector } from "react-redux";
import {
  handleCreateExam,
  handleCreateExamSection,
  handleEditExam,
  handleEditExamSection,
  handleGetAllExams,
  handleGetAllExamSections,
  handleAddQuestion,
  handleGetExamQuestions,
  handleAssignExam,
  handleGetAllExamData,
  handleUpdateExamQuestions,
  handleDeleteExamSection,
} from "../../lib/features/examSlice";
import { toast } from "react-toastify";
import AssignExam from "./AssignExam";
import { useParams, useSearchParams } from "next/navigation";
import AddExamVideoModal from "../RoundContent/Exams/AddExamVideoModal";
import AddExamPdfModal from "../RoundContent/Exams/AddExamPdfModal";
import EditExamVideoModal from "../RoundContent/Exams/EditExamVideoModal";
import EditExamPdfModal from "../RoundContent/Exams/EditExamPdfModal";
import DeleteExamPdfModal from "../RoundContent/Exams/DeleteExamPdfModal";
import DeleteExamVideoModal from "../RoundContent/Exams/DeleteExamVideoModal";


/* ===================== Main: ExamMainData ===================== */
export default function ExamMainData({
  examData: editExamData,
  rowData = {},
  setRowData,
  examid
}) {
  const dispatch = useDispatch();
  const { all_exam_data_loading, all_exam_data_list } = useSelector(
    (state) => state?.exam
  );

  const [openExamVideoModal, setOpenExamVideoModal] = useState(false); // Add video
  const [openExamPdfModal, setOpenExamPdfModal] = useState(false); // Add pdf

  const [openEditExamVideo, setOpenEditExamVideo] = useState(false); // Edit video
  const [openEditExamPdf, setOpenEditExamPdf] = useState(false); // Edit pdf

  const [openDeleteExamVideo, setOpenDeleteExamVideo] = useState(false); // Delete video
  const [openDeleteExamPdf, setOpenDeleteExamPdf] = useState(false); // Delete pdf

  const [selectedExamVideo, setSelectedExamVideo] = useState(null);
  const [selectedExamPdf, setSelectedExamPdf] = useState(null);

  const [videoRowData, setVideoRowData] = useState({});
  const [pdfRowData, setPdfRowData] = useState({});

  // const [openEditExamPdf, setOpenEditExamPdf] = useState(false);



  const searchparams = useSearchParams();
  const lessonId = searchparams?.get("lessonId") ?? null;

   useEffect(() => {
    console.log("exam id" , examid);
   }  ,[examid])

  const [examData, setExamData] = useState({
    name: "",
    duration: "",
    type: "",
    sections: [],
  });
  const [filteredSection, setFilteredSection] = useState([]);
  const [questionType, setQuestionType] = useState("mcq");

  // Common states
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [selectedSectionId, setSelectedSectionId] = useState(null);
  const [selectedSectionData , setSelectedSectionData] = useState({});
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
  const { get_exam_questions_list, get_exam_questions_loading } = useSelector(
    (state) => state?.exam
  );
  // MCQ (general) - Updated structure to match API
  const emptyOption = () => ({
    answer: "",
    question_explanation: "",
    correct_or_not: "0",
  });

  const normalizeOption = (opt) => {
    if (typeof opt === "string")
      return { answer: opt, question_explanation: "", correct_or_not: "0" };

    if (opt && typeof opt === "object")
      return {
        // IMPORTANT: support latex from chemical/math editor
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

  const [mcqOptions, setMcqOptions] = useState([
    emptyOption(),
    emptyOption(),
    emptyOption(),
    emptyOption(),
  ]);
  const [mcqCorrectAnswer, setMcqCorrectAnswer] = useState(0);

  // MCQ subtype
  const [mcqSubType, setMcqSubType] = useState("general");
  const [mcqPassages, setMcqPassages] = useState({ chemical: [], passage: [] });

  const {
    add_exam_loading,
    all_exam_loading,
    all_exam_list,
    delete_exam_loading,
    edit_exam_loading,
    get_exam_sections_list,
    add_question_loading,
  } = useSelector((state) => state?.exam);

  const [exmaInfoData, setExamInfoData] = useState({
    title: "",
    description: "",
    free: 0,
    time: "",
    date: "",
    type: "mock",
    level: "medium",
  });
  const [openExamSection, setOpenExamSection] = useState(false);
  const [openExamQuestion, setOpenExamQuestion] = useState(false);
  const [filteredData, setFilteredData] = useState({});

  const params = useParams();
  const isEditMode = Boolean(params["exam-id"]);

  /* Effects */

  useEffect(() => {
    if (examData?.type === "intern")
      setFilteredSection(mock_exam_section_Data[1]);
    else if (examData?.type === "mock")
      setFilteredSection(mock_exam_section_Data[2]);
    else setFilteredSection([]);
  }, [examData?.type]);

  useEffect(() => {
    if (editExamData) setExamData(editExamData);
  }, [editExamData]);

  useEffect(() => {
    if (examData?.sections?.length > 0 && !selectedSectionId)
      setSelectedSectionId(examData.sections[0].id);
      setSelectedSectionData(examData?.sections[0]);
  }, [examData?.sections, selectedSectionId]);


useEffect(() => {
  dispatch(handleGetAllExams({}))
  .unwrap()
  .then(res => {
    console.log(res?.data?.message?.data);
  })
}, [dispatch]);


  // Edit mode: load exam info
  useEffect(() => {
    if (params["exam-id"] && !lessonId) {
      const filteredItem = all_exam_list?.data?.message?.data?.find(
        (item) => item?.id == params["exam-id"]
      );
      console.log(filteredItem)

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
        type:  filteredItem?.type ,
      }));

      setExamData((prev) => ({
        ...prev,
        type:  lessonId ? "intern" : filteredItem?.type ,
        sections: filteredItem?.sections || prev.sections || [],
      }));

      setOpenExamSection(true);
      setOpenExamQuestion(true);
    }else if (params["exam-id"] && lessonId) {
      const filteredItem = all_exam_data_list?.data?.message?.exam;
      // const filteredItem = all_exam_data_list?.data?.message?.data?.find(
      //   (item) => item?.id == params["exam-id"]
      // );
      // console.log(filteredItem)

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
        type:  "intern"  ,
      }));

      setExamData((prev) => ({
        ...prev,
        type:  lessonId ? "intern" : filteredItem?.type ,
        sections: filteredItem?.sections || prev.sections || [],
      }));

      setOpenExamSection(true);
      setOpenExamQuestion(true);
    }
  }, [params, all_exam_list]);

  /* Helpers */

  const selectedSection = useMemo(
    () => examData.sections.find((s) => s.id === selectedSectionId),
    [examData.sections, selectedSectionId]
  );

  // Function to handle basic exam data changes
  const handleBasicDataChange = (field, value) => {
    setExamInfoData((prev) => ({ ...prev, [field]: value }));
  };

  const handleExamTypeChange = (type) => {
    setExamInfoData({
      ...exmaInfoData,
      type: type.value,
    });
    setExamData({
      ...examData,
      exam_type: type.value,
      lesson_id: type.value === "full_round" ? "" : examData.lesson_id,
      sections: [],
    });
  };

  const [examId, setExamId] = useState(null);

  useEffect(() => {
    console.log('editingQuestion', editingQuestion)
  }, [editingQuestion])

  const handleSubmitBasicData = () => {
    if (!exmaInfoData.title) {
      toast.warn("ادخل اسم الاختبار أولا!");
      return;
    }

    if (!exmaInfoData.description) {
      toast.warn("ادخل وصف الاختبار أولا!");
      return;
    }

    if (!exmaInfoData?.time) {
      toast.warn("اختر وقت أولا");
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
        time: exmaInfoData.time,
        date: exmaInfoData.date,
        level: exmaInfoData?.level,
        type: lessonId ? "intern" : exmaInfoData?.type
      };

      dispatch(handleEditExam({ body: data_send }))
        .unwrap()
        .then((res) => {
          if (res?.data?.status == "success") {
            toast.success("تم   تعديل الاختبار بنجاح!");
            setExamId(res?.data?.message?.id);
          } else {
            toast.error("هناك خطأ أثناء اضافه الاختبار");
            setOpenExamSection(false);
          }
        })
        .catch(() => {
          toast.error("حدث خطأ أثناء إضافة الاختبار.");
        });
    } else {
      const data_send = {
        title: exmaInfoData.title,
        description: exmaInfoData.description,
        free: JSON.stringify(exmaInfoData.free),
        time: exmaInfoData.time,
        date: exmaInfoData.date,
        level: exmaInfoData?.level,
        type: lessonId ? "intern" : exmaInfoData?.type,
      };

      dispatch(handleCreateExam({ body: data_send }))
        .unwrap()
        .then((res) => {
          if (res?.data?.status == "success") {
            toast.success("تم    !ضافة الاختبار بنجاح!");
            setOpenExamSection(res?.data?.message);
            if (lessonId) {
              const data_send = {
                type: "lesson", // 'full_round' or 'lesson'
                exam_id: res?.data?.message?.id, // Assuming an exam_id
                lesson_or_round_id: lessonId,
              };
              setExamId(res?.data?.message?.id);
              dispatch(handleAssignExam({ body: data_send }));
            }
            dispatch(
              handleGetAllExamSections({
                body: { exam_id: examid || res?.data?.message?.id },
              })
            );
            setExamData({ ...examData, sections: [] });
          } else {
            toast.error("هناك خطأ أثناء اضافه الاختبار");
            setOpenExamSection(false);
          }
        })
        .catch(() => {
          toast.error("حدث خطأ أثناء إضافة الاختبار.");
        });
    }
  };

  const onAddSection = (section) => {
    if (!section?.title) {
      toast.warn("ادخل عنوان القسم أولا !");
      return;
    }

    if (!section?.description) {
      toast.warn("ادخل وصف للقسم أولا!");
      return;
    }

    if (params["exam-id"]) {
      // edit existing section (if section has id)
      if (section.id) {
        dispatch(
          handleEditExamSection({
            body: { ...section },
          })
        )
          .unwrap()
          .then((res) => {
            if (res?.data?.status == "success") {
              toast.success("تم تعديل القسم بنجاح");
              dispatch(
                handleGetAllExamSections({
                  body: { exam_id: examid || res?.data?.message?.section?.id },
                })
              );
            } else {
              toast.error(res?.data?.message || "هناك خطأ أثناء تعديل القسم");
            }
          })
          .catch((e) => console.log(e));
        return;
      }

      // add new section in edit mode
      dispatch(
        handleCreateExamSection({
          body: { ...section, exam_id: params["exam-id"] },
        })
      )
        .unwrap()
        .then((res) => {
          if (res?.data?.status == "success") {
            toast.success("تم إضافة القسم بنجاح");
            const newSection = res?.data?.message;
            dispatch(
              handleGetAllExamSections({
                body: { exam_id: examid || newSection?.id },
              })
            );
            setOpenExamQuestion(newSection);
            if (newSection?.id) {
              setExamData((prev) => ({
                ...prev,
                sections: [...(prev.sections || []), newSection],
              }));
            }
          } else {
            toast.error(res?.data?.message || "هناك خطأ أثناء اضافة القسم");
          }
        })
        .catch((e) => console.log(e));
      return;
    }

    // create-mode: use openExamSection.id
    dispatch(
      handleCreateExamSection({
        body: { ...section, exam_id: openExamSection?.id },
      })
    )
      .unwrap()
      .then((res) => {
        if (res?.data?.status == "success") {
          toast.success("تم إضافة القسم بنجاح");
          setOpenExamQuestion(res?.data?.message);
          dispatch(
            handleGetAllExamSections({
              body: { exam_id: examid || res?.data?.message?.section?.id },
            })
          );
        } else {
          toast.error(res?.data?.message || "هناك خطأ أثناء اضافة القسم");
        }
      })
      .catch((e) => console.log(e));
  };

  const toggleSection = (sectionId) =>
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));

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

  const addCompleteAnswer = () =>
    setCompleteAnswers((a) => [...a, { answer: "" }]);
  const removeCompleteAnswer = (index) =>
    setCompleteAnswers((a) => a.filter((_, i) => i !== index));
  const updateCompleteAnswer = (index, value) => {
    setCompleteAnswers((a) => {
      const next = [...a];
      next[index] = typeof value === "object" ? value : { answer: value };
      return next;
    });
  };

  // ← UPDATED: Now keeps correct_or_not in sync
  const updateMcqOption = (index, field, v) =>
    setMcqOptions((opts) => {
      const next = [...opts];
      next[index] = { ...normalizeOption(next[index]), [field]: v };
      next[index].correct_or_not = mcqCorrectAnswer === index ? "1" : "0";
      return next;
    });

  const addMcqOption = () => setMcqOptions((opts) => [...opts, emptyOption()]);
  const removeMcqOption = (index) => {
    setMcqOptions((opts) => {
      if (opts.length <= 2) return opts;
      const next = opts.filter((_, i) => i !== index);
      setMcqCorrectAnswer((curr) =>
        curr >= index ? Math.max(0, curr - 1) : curr
      );
      return next;
    });
  };

  const getQuestionsCount = (sectionId) =>
    sectionId
      ? examData.sections.find((s) => s.id === sectionId)?.questions?.length ||
      0
      : 0;

  const getTotalQuestions = () =>
    examData.sections.reduce((acc, s) => acc + (s.questions?.length || 0), 0);

  const getEstimatedDuration = () =>
    examData.type === "mock"
      ? examData.sections.length * 25
      : parseInt(examData.duration || "0");

  const canAddMoreQuestions = (sectionId) =>
    !sectionId
      ? false
      : examData.type !== "mock"
        ? true
        : getQuestionsCount(sectionId) < 24;

  const handleMcqPassagesChange = useCallback(
    (passages) =>
      setMcqPassages((prev) => ({ ...prev, [mcqSubType]: passages })),
    [mcqSubType]
  );


  // أضف هذه الوظيفة في ExamMainData component

  const editQuestion = async (question) => {
    // تحضير البيانات حسب نوع السؤال
    let updatedQuestionData = {
      id: question.id,
      question_text: question.question_text || currentQuestion,
      instructions: question.instructions || "Instructions",
    };

    // إضافة البيانات حسب نوع السؤال
    switch (questionType) {
      case "mcq":
        if (mcqSubType === "general") {
          updatedQuestionData = {
            ...updatedQuestionData,
            mcq_array: mcqOptions.map((opt, idx) => ({
              ...normalizeOption(opt),
              correct_or_not: mcqCorrectAnswer === idx ? "1" : "0",
            })),
          };
        }
        break;

      case "trueFalse":
        updatedQuestionData = {
          ...updatedQuestionData,
          question_type: "mcq", // True/False يتم معالجته كـ MCQ
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
        updatedQuestionData = {
          ...updatedQuestionData,
          model_answer: modalAnswer,
        };
        break;

      case "complete":
        updatedQuestionData = {
          ...updatedQuestionData,
          text: completeText,
          answers: completeAnswers.map((a) => a.answer).filter(Boolean),
        };
        break;
    }

    try {
      const result = await dispatch(
        handleUpdateExamQuestions({ body: updatedQuestionData })
      ).unwrap();

      if (result?.data?.status === "success") {
        toast.success("تم تحديث السؤال بنجاح");

        // تحديث UI بشكل فوري
        const updatedSections = examData.sections.map((section) => {
          if (section.id !== selectedSectionId) return section;

          return {
            ...section,
            questions: section.questions.map((q) =>
              q.id === question.id ? { ...q, ...updatedQuestionData } : q
            ),
          };
        });

        setExamData((prev) => ({ ...prev, sections: updatedSections }));
        resetQuestionForm();

        // إعادة تحميل الأسئلة من API
        dispatch(
          handleGetExamQuestions({
            body: { exam_section_id: selectedSectionId },
          })
        );
      }
    } catch (error) {
      toast.error("فشل تحديث السؤال");
    }
  };

  // دالة لتحميل بيانات السؤال للتحرير
  // const loadQuestionForEdit = (question) => {
  //   setEditingQuestion(question);
  //   setCurrentQuestion(question.question_text || "");

  //   switch (question.question_type) {
  //     case "mcq":
  //       setQuestionType("mcq");

  //       // تحقق إذا كان سؤال فقرة (paragraph)
  //       if (question.paragraph_content) {
  //         setMcqSubType("passage");
  //         setMcqPassages({
  //           ...mcqPassages,
  //           passage: [{
  //             content: question.paragraph_content,
  //             questions: [{
  //               id: question.id,
  //               text: question.question_text,
  //               options: question.mcq_array || [],
  //               correctIndex: question.correctAnswer || 0,
  //             }]
  //           }]
  //         });
  //       } else if (question.mcqSubType === "chemical") {
  //         setMcqSubType("chemical");
  //         // معالجة معادلات كيميائية
  //       } else {
  //         setMcqSubType("general");
  //         setMcqOptions(question.mcq_array?.map(opt => normalizeOption(opt)) || [
  //           emptyOption(), emptyOption(), emptyOption(), emptyOption()
  //         ]);
  //         setMcqCorrectAnswer(
  //           question.mcq_array?.findIndex(opt => opt.correct_or_not === "1") || 0
  //         );
  //       }
  //       break;

  //     case "essay":
  //       setQuestionType("essay");
  //       setModalAnswer(question.model_answer || "");
  //       break;

  //     case "complete":
  //       setQuestionType("complete");
  //       setCompleteText(question.text || "");
  //       setCompleteAnswers(
  //         question.answers?.map(answer => ({ answer })) || [{ answer: "" }]
  //       );
  //       break;
  //   }

  //   // True/False يتم معالجته كـ MCQ خاص
  //   if (question.mcq_array?.length === 2 && 
  //       question.mcq_array[0].answer === "صحيح") {
  //     setQuestionType("trueFalse");
  //     setTrueFalseAnswer(question.mcq_array[0].correct_or_not === "1");
  //     setTrueFalseExplanation(
  //       question.mcq_array[0].question_explanation || ""
  //     );
  //   }
  // };

  /* ===================== Add / Update Question ===================== */
  // const addOrUpdateQuestion = async () => {
  //   if (!selectedSectionId) {
  //     toast.error("يرجى اختيار قسم أولاً");
  //     return;
  //   }

  //   if (questionType !== "mcq" && !currentQuestion.trim()) {
  //     toast.error("يرجى كتابة نص السؤال");
  //     return;
  //   }

  //   const section = examData?.sections.find((s) => s.id === selectedSectionId);
  //   const currentCount = section?.questions?.length || 0;
  //   const isMock = examData.type === "mock";
  //   const maxPerSection = 24;

  //   const canAdd = (count = 1) =>
  //     !isMock || currentCount + count <= maxPerSection;

  //   /* ========== 1) MCQ with subtypes (chemical / passage) ========== */
  //   if (questionType === "mcq" && mcqSubType !== "general") {
  //     const groups = mcqPassages[mcqSubType] || [];

  //     /* ----- 1A) Paragraph MCQ → paragraph_mcq payload ----- */
  //     if (mcqSubType === "passage") {
  //       const flatQuestions = [];
  //       const paragraphPayloads = [];

  //       for (const group of groups) {
  //         if (!group?.content?.trim()) continue;

  //         const groupQuestionsForPayload = [];

  //         for (const q of group.questions || []) {
  //           if (!q.text?.trim()) continue;

  //           // Normalize options and mark correct
  //           const normalizedOptions = (q.options || []).map((opt, idx) => {
  //             const base = normalizeOption(opt);
  //             return {
  //               ...base,
  //               correct_or_not: q.correctIndex === idx ? "1" : "0",
  //             };
  //           });

  //           if (normalizedOptions.length < 2) {
  //             toast.error(
  //               "كل سؤال في الفقرة يجب أن يحتوي على خيارين على الأقل"
  //             );
  //             return;
  //           }

  //           // UI-level question (flat for DisplayQuestions)
  //           const flatQuestion = {
  //             id: editingQuestion?.id || Date.now() + Math.random(),
  //             question_type: "paragraph_mcq",
  //             question_text: q.text,
  //             exam_section_id: selectedSectionId,
  //             mcqSubType,
  //             mcq_array: normalizedOptions,
  //             correctAnswer: q.correctIndex ?? 0,
  //             paragraph_content: group.content,
  //             instructions: "اختر الإجابة الصحيحة",
  //           };

  //           flatQuestions.push(flatQuestion);

  //           // API payload inner question
  //           groupQuestionsForPayload.push({
  //             question_text: q.text,
  //             instructions: "اختر الإجابة الصحيحة",
  //             mcq_array: normalizedOptions,
  //           });
  //         }

  //         if (groupQuestionsForPayload.length) {
  //           paragraphPayloads.push({
  //             exam_section_id: selectedSectionId,
  //             question_type: "paragraph_mcq",
  //             paragraph_content: group.content,
  //             questions: groupQuestionsForPayload,
  //           });
  //         }

  //         console.log(groupQuestionsForPayload);
  //       }

  //       if (!flatQuestions.length) {
  //         toast.error("لم يتم إنشاء أي سؤال صالح للفقرة");
  //         return;
  //       }

  //       const totalNewQuestions = flatQuestions.length;

  //       if (!canAdd(totalNewQuestions)) {
  //         toast.error(`الحد الأقصى 24 سؤال لكل قسم في الاختبار المحاكي`);
  //         return;
  //       }

  //       // Optimistic UI update (flat questions)
  //       const updatedSections = examData.sections.map((s) => {
  //         if (s.id !== selectedSectionId) return s;

  //         if (editingQuestion) {
  //           editQuestion();
  //           return;
  //           // simple replace by id for edit mode
  //           // return {
  //           //   ...s,
  //           //   questions: s.questions.map((q) =>
  //           //     q.id === editingQuestion.id ? flatQuestions[0] : q
  //           //   ),
  //           // };
  //         }

  //         return {
  //           ...s,
  //           questions: [...(s.questions || []), ...flatQuestions],
  //         };
  //       });

  //       setExamData((prev) => ({ ...prev, sections: updatedSections }));
  //       resetQuestionForm();

  //       try {
  //         // API: send grouped paragraph_mcq payloads
  //         for (const payload of paragraphPayloads) {
  //           await dispatch(handleAddQuestion({ body: payload }))
  //             .unwrap()
  //             .then((res) => {
  //               if (res?.data?.status == "success") {
  //                 toast.success("تم اضافة السؤال بنجاح");
  //                 dispatch(
  //                   handleGetExamQuestions({
  //                     body: {
  //                       exam_section_id:
  //                         res?.data?.message?.exam_section_id ||
  //                         res?.data?.message?.questions[0]?.exam_section_id ||
  //                         res?.data?.message?.paragraph[0]?.exam_section_id,
  //                     },
  //                   })
  //                 );
  //               }
  //             });
  //         }
  //         toast.success("تم حفظ أسئلة الفقرة بنجاح");
  //       } catch (err) {
  //         toast.error("فشل حفظ أسئلة الفقرة");
  //       }

  //       return;
  //     }

  //     /* ----- 1B) Chemical equations → behave as normal MCQ ----- */
  //     const questionsToAdd = [];

  //     for (const group of groups) {
  //       for (const q of group.questions || []) {
  //         // Either a specific question text or fallback to the equation content
  //         if (!q.text?.trim() && !group?.content?.trim()) continue;

  //         const normalizedOptions = (q.options || []).map((opt, idx) => {
  //           const base = normalizeOption(opt);
  //           return {
  //             ...base,
  //             correct_or_not: q.correctIndex === idx ? "1" : "0",
  //           };
  //         });

  //         if (normalizedOptions.length < 2) {
  //           toast.error("كل سؤال يجب أن يحتوي على خيارين على الأقل");
  //           return;
  //         }

  //         questionsToAdd.push({
  //           id: editingQuestion?.id || Date.now() + Math.random(),
  //           question_type: "mcq",
  //           question_text: q.text || group.content || "",
  //           exam_section_id: selectedSectionId,
  //           mcqSubType,
  //           mcq_array: normalizedOptions,
  //           correctAnswer: q.correctIndex ?? 0,
  //           instructions: "اختر الاجابة الصحيحه",
  //         });
  //       }
  //     }

  //     if (!questionsToAdd.length) {
  //       toast.error("لم يتم إنشاء أي سؤال صالح");
  //       return;
  //     }

  //     if (!canAdd(questionsToAdd.length)) {
  //       toast.error(`الحد الأقصى 24 سؤال لكل قسم في الاختبار المحاكي`);
  //       return;
  //     }

  //     const updatedSections = examData.sections.map((s) =>
  //       s.id === selectedSectionId
  //         ? {
  //           ...s,
  //           questions: editingQuestion
  //             ? s.questions.map((q) =>
  //               q.id === editingQuestion.id ? questionsToAdd[0] : q
  //             )
  //             : [...(s.questions || []), ...questionsToAdd],
  //         }
  //         : s
  //     );

  //     setExamData((prev) => ({ ...prev, sections: updatedSections }));
  //     resetQuestionForm();
  //     // toast.success(
  //     //   editingQuestion
  //     //     ? "تم تحديث الأسئلة بنجاح"
  //     //     : "تم إضافة الأسئلة بنجاح"
  //     // );

  //     // Send each chemical question as normal MCQ to API
  //     for (const q of questionsToAdd) {
  //       try {
  //         const res = await dispatch(handleAddQuestion({ body: q })).unwrap();
  //         console.log(res);
  //         if (res?.data?.status == "success") {
  //           toast.success("تم اضافة السؤال بنجاح");
  //           dispatch(
  //             handleGetExamQuestions({
  //               body: {
  //                 exam_section_id:
  //                   res?.data?.message?.exam_section_id ||
  //                   res?.data?.message?.questions[0]?.exam_section_id ||
  //                   res?.data?.message?.paragraph[0]?.exam_section_id,
  //               },
  //             })
  //           );
  //         }
  //       } catch (err) {
  //         toast.error(`فشل حفظ سؤال: ${err}`);
  //       }
  //     }

  //     return;
  //   }

  //   /* ========== 2) Normal questions (general MCQ, True/False, Essay, Complete) ========== */

  //   if (isMock && !canAdd()) {
  //     toast.error("تم الوصول للحد الأقصى (24 سؤال) في هذا القسم");
  //     return;
  //   }

  //   const baseQuestion = {
  //     id: editingQuestion?.id || Date.now() + Math.random(),
  //     question_type: questionType,
  //     question_text: currentQuestion,
  //     exam_section_id: selectedSectionId,
  //     instructions: "Instructions",
  //   };

  //   let finalQuestion = { ...baseQuestion };

  //   switch (questionType) {
  //     case "mcq":
  //       if (mcqOptions?.filter((o) => o?.answer?.trim())?.length < 2) {
  //         toast.error("يجب إضافة خيارين على الأقل");
  //         return;
  //       }
  //       finalQuestion = {
  //         ...finalQuestion,
  //         question_type: "mcq",
  //         mcqSubType: "general",
  //         mcq_array: mcqOptions.map((opt, idx) => ({
  //           ...normalizeOption(opt),
  //           correct_or_not: mcqCorrectAnswer === idx ? "1" : "0",
  //         })),
  //         correctAnswer: mcqCorrectAnswer,
  //       };
  //       break;

  //     case "trueFalse":
  //       if (trueFalseAnswer === null) {
  //         toast.error("اختر إجابة صحيحة");
  //         return;
  //       }
  //       // Treat True/False as MCQ type with 2 options
  //       finalQuestion = {
  //         ...finalQuestion,
  //         question_type: "mcq",
  //         correctAnswer: trueFalseAnswer,
  //         explanation: trueFalseExplanation,
  //         mcq_array: [
  //           {
  //             answer: "صحيح",
  //             correct_or_not: trueFalseAnswer === true ? "1" : "0",
  //             question_explanation: trueFalseExplanation || "",
  //           },
  //           {
  //             answer: "خطأ",
  //             correct_or_not: trueFalseAnswer === false ? "1" : "0",
  //             question_explanation: trueFalseExplanation || "",
  //           },
  //         ],
  //       };
  //       break;

  //     case "essay":
  //       finalQuestion = {
  //         ...finalQuestion,
  //         model_answer: modalAnswer,
  //       };
  //       break;

  //     case "complete":
  //       if (!completeText.trim()) {
  //         toast.error("اكتب نص الجملة");
  //         return;
  //       }
  //       if (completeAnswers.filter((a) => a.answer.trim()).length === 0) {
  //         toast.error("أضف إجابة واحدة على الأقل");
  //         return;
  //       }
  //       finalQuestion = {
  //         ...finalQuestion,
  //         text: completeText,
  //         answers: completeAnswers.map((a) => a.answer).filter(Boolean),
  //       };
  //       break;
  //   }

  //   // Optimistic UI update
  //   const newSections = examData.sections.map((s) => {
  //     if (s.id !== selectedSectionId) return s;

  //     if (editingQuestion) {
  //       return {
  //         ...s,
  //         questions: s.questions.map((q) =>
  //           q.id === editingQuestion.id ? finalQuestion : q
  //         ),
  //       };
  //     }
  //     return {
  //       ...s,
  //       questions: [...(s.questions || []), finalQuestion],
  //     };
  //   });

  //   setExamData((prev) => ({ ...prev, sections: newSections }));
  //   resetQuestionForm();

  //   try {
  //     const result = await dispatch(
  //       handleAddQuestion({ body: finalQuestion })
  //     ).unwrap();

  //     if (result?.data?.status === "success") {
  //       toast.success("تم اضافة السؤال بنجاح");
  //       const exSectionId =
  //         result?.data?.message?.exam_section_id || selectedSectionId;
  //       if (exSectionId) {
  //         dispatch(
  //           handleGetExamQuestions({
  //             body: {
  //               exam_section_id:
  //                 res?.data?.message?.exam_section_id ||
  //                 res?.data?.message?.questions[0]?.exam_section_id ||
  //                 res?.data?.message?.paragraph[0]?.exam_section_id,
  //             },
  //           })
  //         );
  //       }
  //     }

  //     toast.success(
  //       editingQuestion ? "تم تحديث السؤال بنجاح" : "تم إضافة السؤال بنجاح"
  //     );
  //   } catch (error) {
  //     toast.error(error || "فشل حفظ السؤال");
  //   }
  // };

  /* ===================== Add / Update Question ===================== */
  const addOrUpdateQuestion = async () => {
    if (!selectedSectionId) {
      toast.error("يرجى اختيار قسم أولاً");
      return;
    }

    if (questionType !== "mcq" && !currentQuestion.trim()) {
      toast.error("يرجى كتابة نص السؤال");
      return;
    }

    const section = examData?.sections.find((s) => s.id === selectedSectionId);
    const currentCount = section?.questions?.length || 0;
    const isMock = examData.type === "mock";
    const maxPerSection = 24;

    const canAdd = (count = 1) =>
      !isMock || currentCount + count <= maxPerSection;

    // ========== إذا كان في وضع تحرير ==========
    if (editingQuestion) {
      let payload;

      switch (questionType) {
        case "mcq":
          if (mcqSubType === "general") {
            if (mcqOptions?.filter((o) => o?.answer?.trim())?.length < 2) {
              toast.error("يجب إضافة خيارين على الأقل");
              return;
            }
            payload = {
              id: editingQuestion.id,
              question_text: currentQuestion,
              instructions: "اختر الإجابة الصحيحة",
              exam_section_id: selectedSectionId,
              mcq_array: mcqOptions.map((opt, idx) => ({
                ...normalizeOption(opt),
                correct_or_not: mcqCorrectAnswer === idx ? "1" : "0",
              })),
            };
          } else if (mcqSubType === "passage" || mcqSubType === "chemical") {
            // معالجة تحرير أسئلة الفقرة والمعادلات
            const groups = mcqPassages[mcqSubType] || [];
            if (groups.length === 0) {
              toast.error("يجب إضافة محتوى الفقرة/المعادلة");
              return;
            }

            payload = {
              id: editingQuestion.id,
              question_type: mcqSubType === "passage" ? "paragraph_mcq" : "mcq",
              paragraph_content: mcqSubType === "passage" ? groups[0]?.content : "",
              question_text: groups[0]?.questions?.[0]?.text || currentQuestion,
              instructions: "اختر الإجابة الصحيحة",
              exam_section_id: selectedSectionId,
              mcq_array: groups[0]?.questions?.[0]?.options?.map((opt, idx) => ({
                ...normalizeOption(opt),
                correct_or_not: groups[0]?.questions?.[0]?.correctIndex === idx ? "1" : "0",
              })) || [],
            };
          }
          break;

        case "trueFalse":
          if (trueFalseAnswer === null) {
            toast.error("اختر إجابة صحيحة");
            return;
          }
          payload = {
            id: editingQuestion.id,
            question_text: currentQuestion,
            instructions: "اختر الإجابة الصحيحة",
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
            instructions: "أجب عن السؤال التالي",
            exam_section_id: selectedSectionId,
            model_answer: modalAnswer,
          };
          break;

        case "complete":
          if (!completeText.trim()) {
            toast.error("اكتب نص الجملة");
            return;
          }
          if (completeAnswers.filter((a) => a.answer.trim()).length === 0) {
            toast.error("أضف إجابة واحدة على الأقل");
            return;
          }
          payload = {
            id: editingQuestion.id,
            question_text: completeText,
            instructions: "أكمل الجملة التالية",
            exam_section_id: selectedSectionId,
            answers: completeAnswers.map((a) => a.answer).filter(Boolean),
          };
          break;
      }

      try {
        const result = await dispatch(
          handleUpdateExamQuestions({ body: payload })
        ).unwrap();

        if (result?.data?.status === "success") {
          toast.success("تم تحديث السؤال بنجاح");

          // تحديث واجهة المستخدم فورياً
          const updatedSections = examData.sections.map((s) => {
            if (s.id !== selectedSectionId) return s;

            return {
              ...s,
              questions: s.questions.map((q) =>
                q.id === editingQuestion.id ? { ...q, ...payload } : q
              ),
            };
          });

          setExamData((prev) => ({ ...prev, sections: updatedSections }));
          resetQuestionForm();

          // إعادة تحميل الأسئلة من API
          dispatch(
            handleGetExamQuestions({
              body: { exam_section_id: selectedSectionId },
            })
          );
        }
      } catch (error) {
        toast.error(error?.message || "فشل تحديث السؤال");
      }
      return; // انتهاء الدالة في وضع التحرير
    }

    /* ========== 1) MCQ with subtypes (chemical / passage) ========== */
    if (questionType === "mcq" && mcqSubType !== "general") {
      const groups = mcqPassages[mcqSubType] || [];

      /* ----- 1A) Paragraph MCQ → paragraph_mcq payload ----- */
      if (mcqSubType === "passage") {
        const flatQuestions = [];
        const paragraphPayloads = [];

        for (const group of groups) {
          if (!group?.content?.trim()) continue;

          const groupQuestionsForPayload = [];

          for (const q of group.questions || []) {
            if (!q.text?.trim()) continue;

            // Normalize options and mark correct
            const normalizedOptions = (q.options || []).map((opt, idx) => {
              const base = normalizeOption(opt);
              return {
                ...base,
                correct_or_not: q.correctIndex === idx ? "1" : "0",
              };
            });

            if (normalizedOptions.length < 2) {
              toast.error(
                "كل سؤال في الفقرة يجب أن يحتوي على خيارين على الأقل"
              );
              return;
            }

            // UI-level question (flat for DisplayQuestions)
            const flatQuestion = {
              id: Date.now() + Math.random(),
              question_type: "paragraph_mcq",
              question_text: q.text,
              exam_section_id: selectedSectionId,
              mcqSubType,
              mcq_array: normalizedOptions,
              correctAnswer: q.correctIndex ?? 0,
              paragraph_content: group.content,
              instructions: "اختر الإجابة الصحيحة",
            };

            flatQuestions.push(flatQuestion);

            // API payload inner question
            groupQuestionsForPayload.push({
              question_text: q.text,
              instructions: "اختر الإجابة الصحيحة",
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

        const totalNewQuestions = flatQuestions.length;

        if (!canAdd(totalNewQuestions)) {
          toast.error(`الحد الأقصى 24 سؤال لكل قسم في الاختبار المحاكي`);
          return;
        }

        // Optimistic UI update (flat questions)
        const updatedSections = examData.sections.map((s) => {
          if (s.id !== selectedSectionId) return s;

          return {
            ...s,
            questions: [...(s.questions || []), ...flatQuestions],
          };
        });

        setExamData((prev) => ({ ...prev, sections: updatedSections }));
        resetQuestionForm();

        try {
          // API: send grouped paragraph_mcq payloads
          for (const payload of paragraphPayloads) {
            await dispatch(handleAddQuestion({ body: payload }))
              .unwrap()
              .then((res) => {
                if (res?.data?.status == "success") {
                  toast.success("تم اضافة السؤال بنجاح");
                  dispatch(
                    handleGetExamQuestions({
                      body: {
                        exam_section_id:
                          res?.data?.message?.exam_section_id ||
                          res?.data?.message?.questions[0]?.exam_section_id ||
                          res?.data?.message?.paragraph[0]?.exam_section_id,
                      },
                    })
                  );
                }
              });
          }
          toast.success("تم حفظ أسئلة الفقرة بنجاح");
        } catch (err) {
          toast.error("فشل حفظ أسئلة الفقرة");
        }

        return;
      }

      /* ----- 1B) Chemical equations → behave as normal MCQ ----- */
      const questionsToAdd = [];

      for (const group of groups) {
        for (const q of group.questions || []) {
          // Either a specific question text or fallback to the equation content
          if (!q.text?.trim() && !group?.content?.trim()) continue;

          const normalizedOptions = (q.options || []).map((opt, idx) => {
            const base = normalizeOption(opt);
            return {
              ...base,
              correct_or_not: q.correctIndex === idx ? "1" : "0",
            };
          });

          if (normalizedOptions.length < 2) {
            toast.error("كل سؤال يجب أن يحتوي على خيارين على الأقل");
            return;
          }

          questionsToAdd.push({
            id: Date.now() + Math.random(),
            question_type: "mcq",
            question_text: q.text || group.content || "",
            exam_section_id: selectedSectionId,
            mcqSubType,
            mcq_array: normalizedOptions,
            correctAnswer: q.correctIndex ?? 0,
            instructions: "اختر الاجابة الصحيحه",
          });
        }
      }

      if (!questionsToAdd.length) {
        toast.error("لم يتم إنشاء أي سؤال صالح");
        return;
      }

      if (!canAdd(questionsToAdd.length)) {
        toast.error(`الحد الأقصى 24 سؤال لكل قسم في الاختبار المحاكي`);
        return;
      }

      const updatedSections = examData.sections.map((s) =>
        s.id === selectedSectionId
          ? {
            ...s,
            questions: [...(s.questions || []), ...questionsToAdd],
          }
          : s
      );

      setExamData((prev) => ({ ...prev, sections: updatedSections }));
      resetQuestionForm();

      // Send each chemical question as normal MCQ to API
      for (const q of questionsToAdd) {
        try {
          const res = await dispatch(handleAddQuestion({ body: q })).unwrap();
          if (res?.data?.status == "success") {
            toast.success("تم اضافة السؤال بنجاح");
            dispatch(
              handleGetExamQuestions({
                body: {
                  exam_section_id:
                    res?.data?.message?.exam_section_id ||
                    res?.data?.message?.questions[0]?.exam_section_id ||
                    res?.data?.message?.paragraph[0]?.exam_section_id,
                },
              })
            );
          }
        } catch (err) {
          toast.error(`فشل حفظ سؤال: ${err}`);
        }
      }

      return;
    }

    /* ========== 2) Normal questions (general MCQ, True/False, Essay, Complete) ========== */

    if (isMock && !canAdd()) {
      toast.error("تم الوصول للحد الأقصى (24 سؤال) في هذا القسم");
      return;
    }

    const baseQuestion = {
      id: Date.now() + Math.random(),
      question_type: questionType,
      question_text: currentQuestion,
      exam_section_id: selectedSectionId,
      instructions: "Instructions",
    };

    let finalQuestion = { ...baseQuestion };

    switch (questionType) {
      case "mcq":
        if (mcqOptions?.filter((o) => o?.answer?.trim())?.length < 2) {
          toast.error("يجب إضافة خيارين على الأقل");
          return;
        }
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
        if (trueFalseAnswer === null) {
          toast.error("اختر إجابة صحيحة");
          return;
        }
        // Treat True/False as MCQ type with 2 options
        finalQuestion = {
          ...finalQuestion,
          question_type: "mcq",
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
        if (!completeText.trim()) {
          toast.error("اكتب نص الجملة");
          return;
        }
        if (completeAnswers.filter((a) => a.answer.trim()).length === 0) {
          toast.error("أضف إجابة واحدة على الأقل");
          return;
        }
        finalQuestion = {
          ...finalQuestion,
          text: completeText,
          answers: completeAnswers.map((a) => a.answer).filter(Boolean),
        };
        break;
    }

    // Optimistic UI update
    const newSections = examData.sections.map((s) => {
      if (s.id !== selectedSectionId) return s;

      return {
        ...s,
        questions: [...(s.questions || []), finalQuestion],
      };
    });

    setExamData((prev) => ({ ...prev, sections: newSections }));
    resetQuestionForm();

    try {
      const result = await dispatch(
        handleAddQuestion({ body: finalQuestion })
      ).unwrap();

      if (result?.data?.status === "success") {
        toast.success("تم اضافة السؤال بنجاح");
        const exSectionId =
          result?.data?.message?.exam_section_id || selectedSectionId;
        if (exSectionId) {
          dispatch(
            handleGetExamQuestions({
              body: { exam_section_id: exSectionId },
            })
          );
        }
      }

      toast.success("تم إضافة السؤال بنجاح");
    } catch (error) {
      toast.error(error || "فشل حفظ السؤال");
    }
  };

  const loadQuestionForEdit = (question) => {
    setEditingQuestion(question);
    setCurrentQuestion(question.question_text || "");

    // تحديد نوع السؤال
    if (question.paragraph_content) {
      setQuestionType("mcq");
      setMcqSubType("passage");
      // معالجة أسئلة الفقرة
    } else if (question.question_type === "mcq") {
      setQuestionType("mcq");
      setMcqSubType("general");
      setMcqOptions(question.mcq_array || []);
      setMcqCorrectAnswer(
        question.mcq_array?.findIndex(opt => opt.correct_or_not === "1") || 0
      );
    } else if (question.question_type === "essay") {
      setQuestionType("essay");
      setModalAnswer(question.model_answer || "");
    } else if (question.question_type === "complete") {
      setQuestionType("complete");
      setCompleteText(question.text || "");
      setCompleteAnswers(
        question.answers?.map(ans => ({ answer: ans })) || [{ answer: "" }]
      );
    }

    // معالجة True/False
    if (question.mcq_array?.length === 2 &&
      question.mcq_array[0].answer === "صحيح") {
      setQuestionType("trueFalse");
      setTrueFalseAnswer(question.mcq_array[0].correct_or_not === "1");
      setTrueFalseExplanation(question.mcq_array[0].question_explanation || "");
    }
  };

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
                correctIndex: question.correctAnswer || 0,
              },
            ],
          },
        ],
      }));
    } else {
      setMcqOptions(
        (
          question.options || [
            emptyOption(),
            emptyOption(),
            emptyOption(),
            emptyOption(),
          ]
        ).map((opt, idx) => ({
          answer: opt.answer || opt.text || "",
          question_explanation:
            opt.question_explanation || opt.explanation || "",
          correct_or_not:
            typeof question.correctAnswer === "number" &&
              question.correctAnswer === idx
              ? "1"
              : "0",
        }))
      );
      setMcqCorrectAnswer(
        typeof question.correctAnswer === "number" ? question.correctAnswer : 0
      );
    }

    setEditingQuestion(question);
  };

  useEffect(() => {
    dispatch(
      handleGetAllExamSections({
        body: {
          exam_id: examid || openExamSection?.id || openExamQuestion?.section?.id,
        },
      })
    );
  }, [openExamSection, openExamQuestion, dispatch]);


  useEffect(() => {
    dispatch(handleGetAllExamData({
      body: {
        id: examid || examId
      }
    }))
  }, [examId, examid])

  // In ExamMainData component, add this useEffect to populate form when editingQuestion changes:
  useEffect(() => {
    if (editingQuestion) {
      console.log("Editing question loaded:", editingQuestion);

      // Determine question type from the editingQuestion object
      if (editingQuestion.type === "mcq") {
        setQuestionType("mcq");
        setCurrentQuestion(editingQuestion.question || "");

        // Set MCQ options
        if (editingQuestion.options && editingQuestion.options.length > 0) {
          // Convert options to the format expected by mcqOptions
          const normalizedOptions = editingQuestion.options.map(opt => ({
            answer: opt.text || "",
            question_explanation: opt.explanation || "",
            correct_or_not: opt.is_correct?.toString() || "0"
          }));

          // Ensure we have at least 4 options
          while (normalizedOptions.length < 4) {
            normalizedOptions.push(emptyOption());
          }

          setMcqOptions(normalizedOptions);

          // Set correct answer
          const correctIndex = editingQuestion.correctAnswer || 0;
          setMcqCorrectAnswer(correctIndex);
        }
      } else if (editingQuestion.type === "paragraph_mcq") {
        // Handle paragraph questions
        setQuestionType("mcq");
        setMcqSubType("passage");
        // You'll need to set up passage data here
      }
    }
  }, [editingQuestion]);

  const examIdForSections =
    examid || params["exam-id"] || params.examId || openExamSection?.id;

  const onSectionDeleted = (deletedSectionId) => {
    console.log(deletedSectionId);
    // refresh redux list
    if (deletedSectionId) {
      dispatch(handleGetAllExamSections({ body: { exam_id: examIdForSections } }));
    }
  };



  /* ===================== UI ===================== */
  return (
    <div
      className="max-w-6xl mx-auto space-y-6 p-6 bg-gray-50 min-h-screen"
      dir="rtl"
    >
      {/* <QuestionStats
        examData={examData}
        getEstimatedDuration={getEstimatedDuration}
        getTotalQuestions={getTotalQuestions}
      /> */}

      <ExamMainInfo
        lessonId={lessonId || null}
        add_exam_loading={add_exam_loading || edit_exam_loading}
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
          onDeleteSection={onSectionDeleted}
          editData={filteredData}
          data={openExamQuestion}
          examData={examData}
          filteredSection={filteredSection}
          onAddSection={onAddSection}
        />
      )}

      {(openExamSection || isEditMode) && !lessonId && (
        <AssignExam
          lessonId={lessonId}
          exam={openExamSection || filteredData}
        />
      )}


      {(openExamSection && get_exam_sections_list?.data?.message?.length) ||
        isEditMode ? (
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
                  <label className="block text-sm font-medium text-gray-700">
                    اختر القسم لإضافة السؤال
                  </label>
                  {selectedSection && (
                    <Tag color="blue">
                      إجمالي أسئلة القسم:{" "}
                      {getQuestionsCount(selectedSection.id)}
                    </Tag>
                  )}
                </div>

                <Select
                  style={{
                    width: "100%",
                    height: "105%",
                    padding: "10px 0px",
                  }}
                  placeholder="اختر قسمًا"
                  value={selectedSectionId ?? undefined}
                  onChange={(v) => setSelectedSectionId(v)}
                  showSearch
                  optionFilterProp="label"
                  dropdownStyle={{ borderRadius: 12 }}
                  options={get_exam_sections_list?.data?.message?.map(
                    (section) => ({
                      value: section?.id,
                      label: (
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div
                              className="font-medium text-gray-800"
                              dangerouslySetInnerHTML={{
                                __html: section?.title,
                              }}
                            />
                            {section?.description ? (
                              <div
                                className="text-xs text-gray-500"
                                dangerouslySetInnerHTML={{
                                  __html: section?.description,
                                }}
                              />
                            ) : null}
                          </div>
                        </div>
                      ),
                    })
                  )}
                  dropdownRender={(menu) => (
                    <div className="p-2">
                      <div className="px-2 pb-2 text-xs text-gray-500">
                        اختر من الأقسام المضافة بالأسفل
                      </div>
                      <div className="rounded-xl border">{menu}</div>
                    </div>
                  )}
                />

                {selectedSection && (
                  <div className="p-4 rounded-2xl border bg-white shadow-sm ring-1 ring-transparent hover:ring-blue-100 transition">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <h4
                          className="font-semibold text-gray-800"
                          dangerouslySetInnerHTML={{
                            __html: selectedSection.title,
                          }}
                        />
                        {selectedSection?.description ? (
                          <p
                            className="text-sm text-gray-600"
                            dangerouslySetInnerHTML={{
                              __html: selectedSection.description,
                            }}
                          />
                        ) : null}
                      </div>
                      <div
                        className={`mt-1 w-4 h-4 rounded-full border-2 ${selectedSectionId
                          ? "border-blue-500 bg-blue-500"
                          : "border-gray-300"
                          }`}
                        title="القسم الحالي"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* MCQ types */}
              {questionType === "mcq" && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium text-gray-700">
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
                              <FlaskConical className="w-4 h-4" />
                              <span>معادلات</span>
                            </div>
                          ),
                          value: "chemical",
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

                  {/* General MCQ */}
                  {mcqSubType === "general" ? (
                    <div className="space-y-5">
                      <LabeledEditor
                        label="نص السؤال"
                        value={currentQuestion}
                        onChange={setCurrentQuestion}
                        editorMinH={160}
                        allowImages
                      />

                      <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700">
                          خيارات الإجابة (لكل خيار نص + شرح)
                        </label>

                        {mcqOptions.map((option, index) => {
                          const letter = String.fromCharCode(65 + index);
                          const isCorrect = mcqCorrectAnswer === index;

                          return (
                            <div
                              key={index}
                              className={`border rounded-2xl p-4 bg-white space-y-3 shadow-sm transition ${isCorrect
                                ? "ring-1 ring-green-200"
                                : "ring-1 ring-transparent"
                                }`}
                            >
                              <div className="flex items-center gap-3">
                                <span
                                  className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${isCorrect
                                    ? "bg-green-600 text-white"
                                    : "bg-gray-100 text-gray-700"
                                    }`}
                                >
                                  {letter}
                                </span>

                                <label
                                  className="flex items-center gap-2 text-xs font-medium text-gray-600"
                                  title="الإجابة الصحيحة"
                                >
                                  <input
                                    type="radio"
                                    checked={isCorrect}
                                    onChange={() => setMcqCorrectAnswer(index)}
                                    className="h-4 w-4 text-blue-600"
                                  />
                                  إجابة صحيحة
                                </label>

                                {mcqOptions.length > 2 && (
                                  <button
                                    type="button"
                                    onClick={() => removeMcqOption(index)}
                                    className="ml-auto px-2 py-1 text-red-600 hover:text-red-800 text-xs rounded-lg hover:bg-red-50"
                                    title="حذف الخيار"
                                  >
                                    حذف
                                  </button>
                                )}
                              </div>

                              <LabeledEditor
                                label={`نص الخيار #${index + 1}`}
                                value={option.answer}
                                onChange={(v) =>
                                  updateMcqOption(index, "answer", v)
                                }
                                editorMinH={110}
                                allowImages
                              />

                              <LabeledEditor
                                label={`شرح الخيار #${index + 1
                                  } (لماذا هو صحيح/خاطئ)`}
                                value={option.question_explanation}
                                onChange={(v) =>
                                  updateMcqOption(
                                    index,
                                    "question_explanation",
                                    v
                                  )
                                }
                                editorMinH={90}
                                allowImages
                              />
                            </div>
                          );
                        })}

                        <button
                          type="button"
                          onClick={addMcqOption}
                          className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded-xl border border-gray-200 bg-white hover:bg-gray-50 shadow-sm"
                        >
                          <PlusIcon className="w-4 h-4" />
                          إضافة خيار
                        </button>
                      </div>
                    </div>
                  ) : (
                    <McqSharedPassageEditor

                      key={`${mcqSubType}:${editingQuestion?.id ?? "new"}`}
                      mcqSubType={mcqSubType}
                      initialData={mcqPassages[mcqSubType] || []}
                      onPassagesChange={handleMcqPassagesChange}
                    />
                  )}
                </div>
              )}

              {/* Non-MCQ */}
              {questionType === "essay" && (
                <LabeledEditor
                  label="نص السؤال"
                  value={currentQuestion}
                  onChange={setCurrentQuestion}
                  editorMinH={160}
                  allowImages
                />
              )}

              {questionType === "trueFalse" && (
                <TrueFalseQuestions
                  questionHtml={currentQuestion}
                  setQuestionHtml={setCurrentQuestion}
                  trueFalseExplanation={trueFalseExplanation}
                  trueFalseAnswer={trueFalseAnswer}
                  setTrueFalseAnswer={setTrueFalseAnswer}
                  setTrueFalseExplanation={setTrueFalseExplanation}
                />
              )}

              {questionType === "essay" && (
                <EssayQuestions
                  modalAnswer={modalAnswer}
                  setModalAnswer={setModalAnswer}
                />
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

              {/* Sticky action bar */}
              <div className="pt-4 border-t sticky bottom-0 bg-gray-50/75 backdrop-blur z-10">
                <button
                  onClick={addOrUpdateQuestion}
                  disabled={
                    add_question_loading ||
                    !selectedSectionId ||
                    (questionType !== "mcq" && !currentQuestion) ||
                    (examData.type === "mock" &&
                      !canAddMoreQuestions(selectedSectionId))
                  }
                  className="w-full inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-200 bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 px-4 py-3 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {editingQuestion ? (
                    <Save className="h-4 w-4" />
                  ) : (
                    <PlusIcon className="h-4 w-4" />
                  )}
                  {editingQuestion
                    ? "تحديث السؤال"
                    : add_question_loading
                      ? "جاري الحفظ..."
                      : "إضافة السؤال"}
                </button>
                {examData.type === "mock" && selectedSectionId && (
                  <p className="text-sm text-gray-500 mt-2 text-center">
                    {getQuestionsCount(selectedSectionId)}/24 سؤال في هذا القسم
                  </p>
                )}
              </div>
            </div>
          </Card>

          {/* Questions list */}
          {<DisplayQuestions
           selectedSection={selectedSectionData}
            setEditingQuestion={setEditingQuestion} editingQuestion={editQuestion} selectedSectionId={selectedSectionId} />}
        </>
      ) : (
        <div className="text-center py-12">
          <div className="bg-blue-50 p-6 rounded-full w-20 h-20 mx-auto flex items-center justify-center mb-4">
            <BookOpen className="h-10 w-10 text-blue-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            ابدأ بإنشاء اختبار جديد
          </h3>
          <p className="text-gray-600 mb-6">
            املأ معلومات الاختبار الأساسية وأضف الأقسام لبدء إنشاء الأسئلة
          </p>
        </div>
      )}

      {/* Add video / pdf */}
      <AddExamVideoModal
        open={openExamVideoModal}
        setOpen={setOpenExamVideoModal}
        exam_id={examid || examId || openExamSection?.id}
        type="exam"
      />

      <AddExamPdfModal
        open={openExamPdfModal}
        setOpen={setOpenExamPdfModal}
        exam_id={examid || examId || openExamSection?.id}
        type="exam"
      />

      {/* Edit video / pdf */}
      <EditExamVideoModal
        open={openEditExamVideo}
        setOpen={setOpenEditExamVideo}
        rowData={videoRowData}
        setRowData={setVideoRowData}
        exam_id={examid || examId || openExamSection?.id}
      />

      <EditExamPdfModal
        pdfData={pdfRowData}
        open={openEditExamPdf}
        setOpen={setOpenEditExamPdf}
        rowData={pdfRowData}
        setRowData={setPdfRowData}
        exam_id={examid || examId || openExamSection?.id}
      />

      {/* Delete video / pdf */}
      <DeleteExamPdfModal
        open={openDeleteExamPdf}
        setOpen={setOpenDeleteExamPdf}
        id={examid || examId || openExamSection?.id}
        rowData={pdfRowData}
        setRowData={setPdfRowData}
      />

      <DeleteExamVideoModal
        open={openDeleteExamVideo}
        setOpen={setOpenDeleteExamVideo}
        rowData={videoRowData}
        setRowData={setVideoRowData}
        id={examid || examId || openExamSection?.id}
      />
    </div>
  );
}
