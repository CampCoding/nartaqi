// // "use client";

// // import React, { useCallback, useEffect, useMemo, useState , useRef } from "react";
// // import { Button, Segmented, Select, Tag } from "antd";
// // import {
// //   Plus as PlusIcon,
// //   Edit3,
// //   BookOpen,
// //   Save,
// //   X,
// //   ListChecks,
// //   FlaskConical,
// //   FileText,
// //   FileVideo,
// //   FilePlus,
// //   FileIcon,
// //   VideoIcon,
// //   Trash2,
// // } from "lucide-react";
// // import {
// //   PlusOutlined,
// //   EditOutlined,
// //   DeleteOutlined,
// //   CalendarOutlined,
// //   CaretDownOutlined,
// //   FileTextOutlined,
// //   PlayCircleOutlined,
// //   PaperClipOutlined,
// // } from "@ant-design/icons";
// // // Quill CSS
// // import "quill/dist/quill.snow.css";

// // // External components (keep your own paths)
// // import QuestionStats from "./QuestionStats";
// // import Card from "./ExamCard";
// // import ExamMainInfo from "./ExamMainInfo";
// // import QuestionSections from "./QuestionSections";
// // import TrueFalseQuestions from "./TrueFalseQuestions";
// // import EssayQuestions from "./EssayQuestions";
// // import CompleteQuestions from "./CompleteQuestions";
// // import DisplayQuestions from "./DisplayQuestions";
// // import QuestionTypeSelector from "./QuestionTypeSelector";
// // import {
// //   colorMap,
// //   exam_types,
// //   mock_exam_section_Data,
// //   questionTypes,
// // } from "./utils";

// // import McqSharedPassageEditor from "./McqSharedPassageEditor/McqSharedPassageEditor";
// // import LabeledEditor from "./McqSharedPassageEditor/parts/LabeledEditor";
// // import { useDispatch, useSelector } from "react-redux";
// // import {
// //   handleCreateExam,
// //   handleCreateExamSection,
// //   handleEditExam,
// //   handleEditExamSection,
// //   handleGetAllExams,
// //   handleGetAllExamSections,
// //   handleAddQuestion,
// //   handleGetExamQuestions,
// //   handleAssignExam,
// //   handleGetAllExamData,
// //   handleUpdateExamQuestions,
// //   handleDeleteExamSection,
// // } from "../../lib/features/examSlice";
// // import { toast } from "react-toastify";
// // import AssignExam from "./AssignExam";
// // import { useParams, useSearchParams } from "next/navigation";
// // import AddExamVideoModal from "../RoundContent/Exams/AddExamVideoModal";
// // import AddExamPdfModal from "../RoundContent/Exams/AddExamPdfModal";
// // import EditExamVideoModal from "../RoundContent/Exams/EditExamVideoModal";
// // import EditExamPdfModal from "../RoundContent/Exams/EditExamPdfModal";
// // import DeleteExamPdfModal from "../RoundContent/Exams/DeleteExamPdfModal";
// // import DeleteExamVideoModal from "../RoundContent/Exams/DeleteExamVideoModal";
// // import MathTypeEditor from "../MathTypeEditor/MathTypeEditor";


// // /* ===================== Main: ExamMainData ===================== */
// // export default function ExamMainData({
// //   examData: editExamData,
// //   rowData = {},
// //   setRowData,
// //   examid
// // }) {
// //   const dispatch = useDispatch();
// //     const searchparams = useSearchParams();
// //   const lessonId = searchparams?.get("lessonId") ?? null;
// //   const page = searchparams.get("page");
// //   const pageSize = searchparams.get("pageSize");
// //   const params = useParams();

// //   const lastLoadedEditIdRef = useRef(null);

// //   // const editExamId = params["]/

// //   const [examData, setExamData] = useState({
// //     name: "",
// //     duration: "",
// //     type: "",
// //     sections: [],
// //   });
// //   const [filteredSection, setFilteredSection] = useState([]);
// //   const [questionType, setQuestionType] = useState("mcq");

// //   // Common states
// //   const [currentQuestion, setCurrentQuestion] = useState("");
// //   const [selectedSectionId, setSelectedSectionId] = useState(null);
// //   const [selectedSectionData, setSelectedSectionData] = useState({});
// //   const [expandedSections, setExpandedSections] = useState({});
// //   const [editingQuestion, setEditingQuestion] = useState(null);

// //   // True/False
// //   const [trueFalseAnswer, setTrueFalseAnswer] = useState(null);
// //   const [trueFalseExplanation, setTrueFalseExplanation] = useState("");

// //   // Essay
// //   const [modalAnswer, setModalAnswer] = useState("");

// //   // Complete
// //   const [completeText, setCompleteText] = useState("");
// //   const [completeAnswers, setCompleteAnswers] = useState([{ answer: "" }]);
// //   const { get_exam_questions_list, get_exam_questions_loading } = useSelector(
// //     (state) => state?.exam
// //   );

// //    useEffect(() => {
// //     console.log("setEditingQuestion", editingQuestion);
// //   }, [editingQuestion])

// //   // MCQ (general) - Updated structure to match API
// //   const emptyOption = () => ({
// //     answer: "",
// //     question_explanation: "",
// //     correct_or_not: "0",
// //   });

// //   const normalizeOption = (opt) => {
// //     if (typeof opt === "string")
// //       return { answer: opt, question_explanation: "", correct_or_not: "0" };

// //     if (opt && typeof opt === "object")
// //       return {
// //         // IMPORTANT: support latex from chemical/math editor
// //         answer: opt.answer || opt.text || opt.latex || "",
// //         instructions: "Instructions",
// //         question_explanation: opt.question_explanation || opt.explanation || "",
// //         correct_or_not:
// //           opt.correct_or_not !== undefined && opt.correct_or_not !== null
// //             ? String(opt.correct_or_not)
// //             : "0",
// //       };

// //     return emptyOption();
// //   };

// //   const [mcqOptions, setMcqOptions] = useState([
// //     emptyOption(),
// //     emptyOption(),
// //     emptyOption(),
// //     emptyOption(),
// //   ]);
// //   const [mcqCorrectAnswer, setMcqCorrectAnswer] = useState(0);

// //   // MCQ subtype
// //   const [mcqSubType, setMcqSubType] = useState("general");
// //   const [mcqPassages, setMcqPassages] = useState({ chemical: [], passage: [] });

// //   const {
// //     add_exam_loading,
// //     all_exam_loading,
// //     all_exam_list,
// //     delete_exam_loading,
// //     edit_exam_loading,
// //     get_exam_sections_list,
// //     add_question_loading,
// //     all_exam_data_list
// //   } = useSelector((state) => state?.exam);

// //   const [exmaInfoData, setExamInfoData] = useState({
// //     title: "",
// //     description: "",
// //     free: 0,
// //     time: "",
// //     date: "",
// //     type: "mock",
// //     level: "medium",
// //     success_percentage: 0,
// //   });
// //   const [openExamSection, setOpenExamSection] = useState(false);
// //   const [openExamQuestion, setOpenExamQuestion] = useState(false);
// //   const [filteredData, setFilteredData] = useState({});

// //   // const params = useParams();
// //   const isEditMode = Boolean(params["exam-id"]);

// //   /* Effects */

// //   useEffect(() => {
// //     if (examData?.type === "intern")
// //       setFilteredSection(mock_exam_section_Data[1]);
// //     else if (examData?.type === "mock")
// //       setFilteredSection(mock_exam_section_Data[2]);
// //     else setFilteredSection([]);
// //   }, [examData?.type]);

// //   useEffect(() => {
// //     if (editExamData) setExamData(editExamData);
// //   }, [editExamData]);

// //   useEffect(() => {
// //     if (examData?.sections?.length > 0 && !selectedSectionId) {
// //       setSelectedSectionId(examData.sections[0].id);
// //     }
// //   }, [examData?.sections, selectedSectionId, selectedSectionData]);

// //   useEffect(() => {
// //     if (selectedSectionId) {
// //       const filtered = get_exam_sections_list?.data?.message?.find(item => item?.id == selectedSectionId);
// //       console.log(filtered);
// //       setSelectedSectionData(filtered)
// //     }
// //   }, [selectedSectionId])

// //   useEffect(() => {
// //     dispatch(handleGetAllExams({
// //       page: page,
// //       per_page: pageSize
// //     }))
// //       .unwrap()
// //       .then(res => {
// //         console.log(res)
// //         console.log(res?.data?.message?.data);
// //       })
// //   }, [dispatch, params["exam-id"], page, pageSize]);


// //   // Edit mode: load exam info
// //   useEffect(() => {
// //     console.log(params["exam-id"], all_exam_list)
// //     if (params["exam-id"] && !lessonId) {
// //       const filteredItem = all_exam_list?.data?.message?.data?.find(
// //         (item) => item?.id == params["exam-id"]
// //       );
// //       console.log(filteredItem)

// //       if (!filteredItem) return;

// //       setFilteredData(filteredItem);

// //       setExamInfoData((prev) => ({
// //         ...prev,
// //         id: filteredItem?.id,
// //         title: filteredItem?.title,
// //         description: filteredItem?.description,
// //         free: filteredItem?.free,
// //         level: filteredItem?.level,
// //         date: filteredItem?.date,
// //         time: filteredItem?.time,
// //         type: filteredItem?.type,
// //         success_percentage: filteredItem?.success_percentage
// //       }));

// //       setExamData((prev) => ({
// //         ...prev,
// //         type: lessonId ? "intern" : filteredItem?.type,
// //         sections: filteredItem?.sections || prev.sections || [],
// //       }));

// //       setOpenExamSection(true);
// //       setOpenExamQuestion(true);
// //     } else if (params["exam-id"] && lessonId) {
// //       const filteredItem = all_exam_data_list?.data?.message?.exam;
// //       // const filteredItem = all_exam_data_list?.data?.message?.data?.find(
// //       //   (item) => item?.id == params["exam-id"]
// //       // );
// //       // console.log(filteredItem)

// //       if (!filteredItem) return;

// //       setFilteredData(filteredItem);

// //       setExamInfoData((prev) => ({
// //         ...prev,
// //         id: filteredItem?.id,
// //         title: filteredItem?.title,
// //         description: filteredItem?.description,
// //         free: filteredItem?.free,
// //         level: filteredItem?.level,
// //         date: filteredItem?.date,
// //         time: filteredItem?.time,
// //         type: "intern",
// //         success_percentage: filteredItem?.success_percentage
// //       }));

// //       setExamData((prev) => ({
// //         ...prev,
// //         type: lessonId ? "intern" : filteredItem?.type,
// //         sections: filteredItem?.sections || prev.sections || [],
// //       }));

// //       setOpenExamSection(true);
// //       setOpenExamQuestion(true);
// //     }
// //   }, [params, all_exam_list, all_exam_data_list]);

// //   /* Helpers */

// //   const selectedSection = useMemo(
// //     () => examData.sections.find((s) => s.id === selectedSectionId),
// //     [examData.sections, selectedSectionId]
// //   );

// //   // Function to handle basic exam data changes
// //   const handleBasicDataChange = (field, value) => {
// //     setExamInfoData((prev) => ({ ...prev, [field]: value }));
// //   };

// //   const handleExamTypeChange = (type) => {
// //     setExamInfoData({
// //       ...exmaInfoData,
// //       type: type.value,
// //     });
// //     setExamData({
// //       ...examData,
// //       exam_type: type.value,
// //       lesson_id: type.value === "full_round" ? "" : examData.lesson_id,
// //       sections: [],
// //     });
// //   };

// //   const [examId, setExamId] = useState(null);

// //   useEffect(() => {
// //     console.log('editingQuestion', editingQuestion)
// //   }, [editingQuestion])


// //   const handleSubmitBasicData = () => {
// //     if (!exmaInfoData.title) {
// //       toast.warn("ادخل اسم الاختبار أولا!");
// //       return;
// //     }

// //     // if (!exmaInfoData.description) {
// //     //   toast.warn("ادخل وصف الاختبار أولا!");
// //     //   return;
// //     // }

// //     // if (!exmaInfoData?.time) {
// //     //   toast.warn("اختر وقت أولا");
// //     //   return;
// //     // }

// //     if (!exmaInfoData?.date) {
// //       toast.warn("اختر تاريخ أولا");
// //       return;
// //     }

// //     if (params["exam-id"]) {
// //       const data_send = {
// //         id: params["exam-id"],
// //         title: exmaInfoData.title,
// //         description: exmaInfoData.description,
// //         free: `${exmaInfoData.free}`,
// //         time: null,
// //         date: exmaInfoData.date,
// //         level: exmaInfoData?.level,
// //         type: lessonId ? "intern" : exmaInfoData?.type,
// //         success_percentage: exmaInfoData?.success_percentage
// //       };

// //       dispatch(handleEditExam({ body: data_send }))
// //         .unwrap()
// //         .then((res) => {
// //           if (res?.data?.status == "success") {
// //             toast.success("تم   تعديل الاختبار بنجاح!");
// //             setExamId(res?.data?.message?.id);
// //           } else {
// //             toast.error("هناك خطأ أثناء اضافه الاختبار");
// //             setOpenExamSection(false);
// //           }
// //         })
// //         .catch(() => {
// //           toast.error("حدث خطأ أثناء إضافة الاختبار.");
// //         });
// //     } else {
// //       const data_send = {
// //         title: exmaInfoData.title,
// //         description: exmaInfoData.description,
// //         free: JSON.stringify(exmaInfoData.free),
// //         time: null,
// //         date: exmaInfoData.date,
// //         level: exmaInfoData?.level,
// //         type: lessonId ? "intern" : exmaInfoData?.type,
// //         success_percentage: exmaInfoData?.success_percentage
// //       };


// //       dispatch(handleCreateExam({ body: data_send }))
// //         .unwrap()
// //         .then((res) => {
// //           if (res?.data?.status == "success") {
// //             toast.success("تم    !ضافة الاختبار بنجاح!");
// //             setOpenExamSection(res?.data?.message);
// //             if (lessonId) {
// //               const data_send = {
// //                 type: "lesson", // 'full_round' or 'lesson'
// //                 exam_id: res?.data?.message?.id, // Assuming an exam_id
// //                 lesson_or_round_id: lessonId,
// //               };
// //               setExamId(res?.data?.message?.id);
// //               dispatch(handleAssignExam({ body: data_send }));
// //             }
// //             dispatch(
// //               handleGetAllExamSections({
// //                 body: { exam_id: examId || params["exam-id"] || res?.data?.message?.id },
// //               })
// //             );
// //             setExamData({ ...examData, sections: [] });
// //           } else {
// //             toast.error("هناك خطأ أثناء اضافه الاختبار");
// //             setOpenExamSection(false);
// //           }
// //         })
// //         .catch(() => {
// //           toast.error("حدث خطأ أثناء إضافة الاختبار.");
// //         });
// //     }
// //   };

// //   const onAddSection = (section) => {
// //     if (!section?.title) {
// //       toast.warn("ادخل عنوان القسم أولا !");
// //       return;
// //     }

// //     if (!section?.description) {
// //       toast.warn("ادخل وصف للقسم أولا!");
// //       return;
// //     }

// //     if (params["exam-id"]) {
// //       // edit existing section (if section has id)
// //       if (section.id) {
// //         dispatch(
// //           handleEditExamSection({
// //             body: { ...section },
// //           })
// //         )
// //           .unwrap()
// //           .then((res) => {
// //             if (res?.data?.status == "success") {
// //               toast.success("تم تعديل القسم بنجاح");
// //               dispatch(
// //                 handleGetAllExamSections({
// //                   body: { exam_id: examid || res?.data?.message?.section?.id },
// //                 })
// //               );
// //             } else {
// //               toast.error(res?.data?.message || "هناك خطأ أثناء تعديل القسم");
// //             }
// //           })
// //           .catch((e) => console.log(e));
// //         return;
// //       }

// //       // add new section in edit mode
// //       dispatch(
// //         handleCreateExamSection({
// //           body: { ...section, exam_id: params["exam-id"] },
// //         })
// //       )
// //         .unwrap()
// //         .then((res) => {
// //           if (res?.data?.status == "success") {
// //             toast.success("تم إضافة القسم بنجاح");
// //             const newSection = res?.data?.message;
// //             dispatch(
// //               handleGetAllExamSections({
// //                 body: { exam_id: examId || params["exam-id"]|| newSection?.exam_id },
// //               })
// //             );
// //             setOpenExamQuestion(newSection);
// //             if (newSection?.id) {
// //               setExamData((prev) => ({
// //                 ...prev,
// //                 sections: [...(prev.sections || []), newSection],
// //               }));
// //             }
// //           } else {
// //             toast.error(res?.data?.message || "هناك خطأ أثناء اضافة القسم");
// //           }
// //         })
// //         .catch((e) => console.log(e));
// //       return;
// //     }

// //     // create-mode: use openExamSection.id
// //     dispatch(
// //       handleCreateExamSection({
// //         body: { ...section, exam_id: openExamSection?.id },
// //       })
// //     )
// //       .unwrap()
// //       .then((res) => {
// //         if (res?.data?.status == "success") {
// //           toast.success("تم إضافة القسم بنجاح");
// //           setOpenExamQuestion(res?.data?.message);
// //           dispatch(
// //             handleGetAllExamSections({
// //               body: { exam_id: examId || params["exam-id"] || res?.data?.message?.section?.exam_id },
// //             })
// //           );
// //         } else {
// //           toast.error(res?.data?.message || "هناك خطأ أثناء اضافة القسم");
// //         }
// //       })
// //       .catch((e) => console.log(e));
// //   };

// //   const toggleSection = (sectionId) =>
// //     setExpandedSections((prev) => ({
// //       ...prev,
// //       [sectionId]: !prev[sectionId],
// //     }));

// //   const handleQuestionTypeChange = (type) => {
// //     setQuestionType(type);
// //     resetQuestionForm();
// //   };

// //   const resetQuestionForm = () => {
// //     setCurrentQuestion("");
// //     setTrueFalseAnswer(null);
// //     setTrueFalseExplanation("");
// //     setModalAnswer("");
// //     setCompleteText("");
// //     setCompleteAnswers([{ answer: "" }]);
// //     setMcqOptions([emptyOption(), emptyOption(), emptyOption(), emptyOption()]);
// //     setMcqCorrectAnswer(0);
// //     setEditingQuestion(null);
// //     setMcqSubType("general");
// //     setMcqPassages({ chemical: [], passage: [] });
// //   };



// //   // ← UPDATED: Now keeps correct_or_not in sync
// //   const updateMcqOption = (index, field, v) =>
// //     setMcqOptions((opts) => {
// //       const next = [...opts];
// //       next[index] = { ...normalizeOption(next[index]), [field]: v };
// //       next[index].correct_or_not = mcqCorrectAnswer === index ? "1" : "0";
// //       return next;
// //     });

// //   const addMcqOption = () => setMcqOptions((opts) => [...opts, emptyOption()]);
// //   const removeMcqOption = (index) => {
// //     setMcqOptions((opts) => {
// //       if (opts.length <= 2) return opts;
// //       const next = opts.filter((_, i) => i !== index);
// //       setMcqCorrectAnswer((curr) =>
// //         curr >= index ? Math.max(0, curr - 1) : curr
// //       );
// //       return next;
// //     });
// //   };

// //   const getQuestionsCount = (sectionId) =>
// //     sectionId
// //       ? examData.sections.find((s) => s.id === sectionId)?.questions?.length ||
// //       0
// //       : 0;


// //   const canAddMoreQuestions = (sectionId) =>
// //     !sectionId
// //       ? false
// //       : examData.type !== "mock"
// //         ? true
// //         : getQuestionsCount(sectionId) < 24;

// //   const handleMcqPassagesChange = useCallback(
// //     (passages) =>
// //       setMcqPassages((prev) => ({ ...prev, [mcqSubType]: passages })),
// //     [mcqSubType]
// //   );


// //   // أضف هذه الوظيفة في ExamMainData component

// //   const editQuestion = async (question) => {
// //     // تحضير البيانات حسب نوع السؤال
// //     let updatedQuestionData = {
// //       id: question.id,
// //       question_text: question.question_text || currentQuestion,
// //       instructions: question.instructions || "Instructions",
// //     };

// //     // إضافة البيانات حسب نوع السؤال
// //     switch (questionType) {
// //       case "mcq":
// //         if (mcqSubType === "general") {
// //           updatedQuestionData = {
// //             ...updatedQuestionData,
// //             mcq_array: mcqOptions.map((opt, idx) => ({
// //               ...normalizeOption(opt),
// //               correct_or_not: mcqCorrectAnswer === idx ? "1" : "0",
// //             })),
// //           };
// //         }
// //         break;

// //       case "trueFalse":
// //         updatedQuestionData = {
// //           ...updatedQuestionData,
// //           question_type: "mcq", // True/False يتم معالجته كـ MCQ
// //           mcq_array: [
// //             {
// //               answer: "صحيح",
// //               correct_or_not: trueFalseAnswer === true ? "1" : "0",
// //               question_explanation: trueFalseExplanation || "",
// //             },
// //             {
// //               answer: "خطأ",
// //               correct_or_not: trueFalseAnswer === false ? "1" : "0",
// //               question_explanation: trueFalseExplanation || "",
// //             },
// //           ],
// //         };
// //         break;

// //     }

// //     try {
// //       const result = await dispatch(
// //         handleUpdateExamQuestions({ body: updatedQuestionData })
// //       ).unwrap();

// //       if (result?.data?.status === "success") {
// //         toast.success("تم تحديث السؤال بنجاح");

// //         // تحديث UI بشكل فوري
// //         const updatedSections = examData.sections.map((section) => {
// //           if (section.id !== selectedSectionId) return section;

// //           return {
// //             ...section,
// //             questions: section.questions.map((q) =>
// //               q.id === question.id ? { ...q, ...updatedQuestionData } : q
// //             ),
// //           };
// //         });

// //         setExamData((prev) => ({ ...prev, sections: updatedSections }));
// //         resetQuestionForm();

// //         // إعادة تحميل الأسئلة من API
// //         dispatch(
// //           handleGetExamQuestions({
// //             body: { exam_section_id: selectedSectionId },
// //           })
// //         );
// //       }
// //     } catch (error) {
// //       toast.error("فشل تحديث السؤال");
// //     }
// //   };


// //   // /* ===================== Add / Update Question ===================== */
// //   const addOrUpdateQuestion = async () => {
// //     if (!selectedSectionId) {
// //       toast.error("يرجى اختيار قسم أولاً");
// //       return;
// //     }

// //     if (questionType !== "mcq" && !currentQuestion.trim()) {
// //       toast.error("يرجى كتابة نص السؤال");
// //       return;
// //     }

// //     const section = examData?.sections.find((s) => s.id === selectedSectionId);
// //     const currentCount = section?.questions?.length || 0;
// //     const isMock = examData.type === "mock";
// //     const maxPerSection = 24;

// //     const canAdd = (count = 1) =>
// //       !isMock || currentCount + count <= maxPerSection;

// //     // ========== إذا كان في وضع تحرير ==========
// //     if (editingQuestion) {
// //       let payload;

// //       switch (questionType) {
// //         case "mcq":
// //           if (mcqSubType === "general") {
// //             if (mcqOptions?.filter((o) => o?.answer?.trim())?.length < 2) {
// //               toast.error("يجب إضافة خيارين على الأقل");
// //               return;
// //             }
// //             payload = {
// //               id: editingQuestion.id,
// //               question_text: currentQuestion,
// //               instructions: "اختر الإجابة الصحيحة",
// //               exam_section_id: selectedSectionId,
// //               mcq_array: mcqOptions.map((opt, idx) => ({
// //                 ...normalizeOption(opt),
// //                 correct_or_not: mcqCorrectAnswer === idx ? "1" : "0",
// //               })),
// //             };
// //           } else if (mcqSubType === "passage" || mcqSubType === "chemical") {
// //             // معالجة تحرير أسئلة الفقرة والمعادلات
// //             const groups = mcqPassages[mcqSubType] || [];
// //             if (groups.length === 0) {
// //               toast.error("يجب إضافة محتوى الفقرة/المعادلة");
// //               return;
// //             }

// //             payload = {
// //               id: editingQuestion.id,
// //               question_type: mcqSubType === "passage" ? "paragraph_mcq" : "mcq",
// //               paragraph_content: mcqSubType === "passage" ? groups[0]?.content : "",
// //               question_text: groups[0]?.questions?.[0]?.text || currentQuestion,
// //               instructions: "اختر الإجابة الصحيحة",
// //               exam_section_id: selectedSectionId,
// //               mcq_array: groups[0]?.questions?.[0]?.options?.map((opt, idx) => ({
// //                 ...normalizeOption(opt),
// //                 correct_or_not: groups[0]?.questions?.[0]?.correctIndex === idx ? "1" : "0",
// //               })) || [],
// //             };
// //           }
// //           break;

// //         case "trueFalse":
// //           if (trueFalseAnswer === null) {
// //             toast.error("اختر إجابة صحيحة");
// //             return;
// //           }
// //           payload = {
// //             id: editingQuestion.id,
// //             question_text: currentQuestion,
// //             instructions: "اختر الإجابة الصحيحة",
// //             exam_section_id: selectedSectionId,
// //             mcq_array: [
// //               {
// //                 answer: "صحيح",
// //                 correct_or_not: trueFalseAnswer === true ? "1" : "0",
// //                 question_explanation: trueFalseExplanation || "",
// //               },
// //               {
// //                 answer: "خطأ",
// //                 correct_or_not: trueFalseAnswer === false ? "1" : "0",
// //                 question_explanation: trueFalseExplanation || "",
// //               },
// //             ],
// //           };
// //           break;

// //         case "essay":
// //           payload = {
// //             id: editingQuestion.id,
// //             question_text: currentQuestion,
// //             instructions: "أجب عن السؤال التالي",
// //             exam_section_id: selectedSectionId,
// //             model_answer: modalAnswer,
// //           };
// //           break;

// //         case "complete":
// //           if (!completeText.trim()) {
// //             toast.error("اكتب نص الجملة");
// //             return;
// //           }
// //           if (completeAnswers.filter((a) => a.answer.trim()).length === 0) {
// //             toast.error("أضف إجابة واحدة على الأقل");
// //             return;
// //           }
// //           payload = {
// //             id: editingQuestion.id,
// //             question_text: completeText,
// //             instructions: "أكمل الجملة التالية",
// //             exam_section_id: selectedSectionId,
// //             answers: completeAnswers.map((a) => a.answer).filter(Boolean),
// //           };
// //           break;
// //       }

// //       try {
// //         const result = await dispatch(
// //           handleUpdateExamQuestions({ body: payload })
// //         ).unwrap();

// //         if (result?.data?.status === "success") {
// //           toast.success("تم تحديث السؤال بنجاح");

// //           // تحديث واجهة المستخدم فورياً
// //           const updatedSections = examData.sections.map((s) => {
// //             if (s.id !== selectedSectionId) return s;

// //             return {
// //               ...s,
// //               questions: s.questions.map((q) =>
// //                 q.id === editingQuestion.id ? { ...q, ...payload } : q
// //               ),
// //             };
// //           });

// //           setExamData((prev) => ({ ...prev, sections: updatedSections }));
// //           resetQuestionForm();

// //           // إعادة تحميل الأسئلة من API
// //           dispatch(
// //             handleGetExamQuestions({
// //               body: { exam_section_id: selectedSectionId },
// //             })
// //           );
// //         }
// //       } catch (error) {
// //         toast.error(error?.message || "فشل تحديث السؤال");
// //       }
// //       return; // انتهاء الدالة في وضع التحرير
// //     }

// //     /* ========== 1) MCQ with subtypes (chemical / passage) ========== */
// //     if (questionType === "mcq" && mcqSubType !== "general") {
// //       const groups = mcqPassages[mcqSubType] || [];

// //       /* ----- 1A) Paragraph MCQ → paragraph_mcq payload ----- */
// //       if (mcqSubType === "passage") {
// //         const flatQuestions = [];
// //         const paragraphPayloads = [];

// //         for (const group of groups) {
// //           if (!group?.content?.trim()) continue;

// //           const groupQuestionsForPayload = [];

// //           for (const q of group.questions || []) {
// //             if (!q.text?.trim()) continue;

// //             // Normalize options and mark correct
// //             const normalizedOptions = (q.options || []).map((opt, idx) => {
// //               const base = normalizeOption(opt);
// //               return {
// //                 ...base,
// //                 correct_or_not: q.correctIndex === idx ? "1" : "0",
// //               };
// //             });

// //             if (normalizedOptions.length < 2) {
// //               toast.error(
// //                 "كل سؤال في الفقرة يجب أن يحتوي على خيارين على الأقل"
// //               );
// //               return;
// //             }

// //             // UI-level question (flat for DisplayQuestions)
// //             const flatQuestion = {
// //               id: Date.now() + Math.random(),
// //               question_type: "paragraph_mcq",
// //               question_text: q.text,
// //               exam_section_id: selectedSectionId,
// //               mcqSubType,
// //               mcq_array: normalizedOptions,
// //               correctAnswer: q.correctIndex ?? 0,
// //               paragraph_content: group.content,
// //               instructions: "اختر الإجابة الصحيحة",
// //             };

// //             flatQuestions.push(flatQuestion);

// //             // API payload inner question
// //             groupQuestionsForPayload.push({
// //               question_text: q.text,
// //               instructions: "اختر الإجابة الصحيحة",
// //               mcq_array: normalizedOptions,
// //             });
// //           }

// //           if (groupQuestionsForPayload.length) {
// //             paragraphPayloads.push({
// //               exam_section_id: selectedSectionId,
// //               question_type: "paragraph_mcq",
// //               paragraph_content: group.content,
// //               questions: groupQuestionsForPayload,
// //             });
// //           }
// //         }

// //         if (!flatQuestions.length) {
// //           toast.error("لم يتم إنشاء أي سؤال صالح للفقرة");
// //           return;
// //         }

// //         const totalNewQuestions = flatQuestions.length;

// //         if (!canAdd(totalNewQuestions)) {
// //           toast.error(`الحد الأقصى 24 سؤال لكل قسم في الاختبار المحاكي`);
// //           return;
// //         }

// //         // Optimistic UI update (flat questions)
// //         const updatedSections = examData.sections.map((s) => {
// //           if (s.id !== selectedSectionId) return s;

// //           return {
// //             ...s,
// //             questions: [...(s.questions || []), ...flatQuestions],
// //           };
// //         });

// //         setExamData((prev) => ({ ...prev, sections: updatedSections }));
// //         resetQuestionForm();

// //         try {
// //           // API: send grouped paragraph_mcq payloads
// //           for (const payload of paragraphPayloads) {
// //             await dispatch(handleAddQuestion({ body: payload }))
// //               .unwrap()
// //               .then((res) => {
// //                 if (res?.data?.status == "success") {
// //                   toast.success("تم اضافة السؤال بنجاح");
// //                   dispatch(
// //                     handleGetExamQuestions({
// //                       body: {
// //                         exam_section_id:
// //                           res?.data?.message?.exam_section_id ||
// //                           res?.data?.message?.questions[0]?.exam_section_id ||
// //                           res?.data?.message?.paragraph[0]?.exam_section_id,
// //                       },
// //                     })
// //                   );
// //                 }
// //               });
// //           }
// //           toast.success("تم حفظ أسئلة الفقرة بنجاح");
// //         } catch (err) {
// //           toast.error("فشل حفظ أسئلة الفقرة");
// //         }

// //         return;
// //       }

// //       /* ----- 1B) Chemical equations → behave as normal MCQ ----- */
// //       const questionsToAdd = [];

// //       for (const group of groups) {
// //         for (const q of group.questions || []) {
// //           // Either a specific question text or fallback to the equation content
// //           if (!q.text?.trim() && !group?.content?.trim()) continue;

// //           const normalizedOptions = (q.options || []).map((opt, idx) => {
// //             const base = normalizeOption(opt);
// //             return {
// //               ...base,
// //               correct_or_not: q.correctIndex === idx ? "1" : "0",
// //             };
// //           });

// //           if (normalizedOptions.length < 2) {
// //             toast.error("كل سؤال يجب أن يحتوي على خيارين على الأقل");
// //             return;
// //           }

// //           questionsToAdd.push({
// //             id: Date.now() + Math.random(),
// //             question_type: "mcq",
// //             question_text: q.text || group.content || "",
// //             exam_section_id: selectedSectionId,
// //             mcqSubType,
// //             mcq_array: normalizedOptions,
// //             correctAnswer: q.correctIndex ?? 0,
// //             instructions: "اختر الاجابة الصحيحه",
// //           });
// //         }
// //       }

// //       if (!questionsToAdd.length) {
// //         toast.error("لم يتم إنشاء أي سؤال صالح");
// //         return;
// //       }

// //       if (!canAdd(questionsToAdd.length)) {
// //         toast.error(`الحد الأقصى 24 سؤال لكل قسم في الاختبار المحاكي`);
// //         return;
// //       }

// //       const updatedSections = examData.sections.map((s) =>
// //         s.id === selectedSectionId
// //           ? {
// //             ...s,
// //             questions: [...(s.questions || []), ...questionsToAdd],
// //           }
// //           : s
// //       );

// //       setExamData((prev) => ({ ...prev, sections: updatedSections }));
// //       resetQuestionForm();

// //       // Send each chemical question as normal MCQ to API
// //       for (const q of questionsToAdd) {
// //         try {
// //           const res = await dispatch(handleAddQuestion({ body: q })).unwrap();
// //           if (res?.data?.status == "success") {
// //             toast.success("تم اضافة السؤال بنجاح");
// //             dispatch(
// //               handleGetExamQuestions({
// //                 body: {
// //                   exam_section_id:
// //                     res?.data?.message?.exam_section_id ||
// //                     res?.data?.message?.questions[0]?.exam_section_id ||
// //                     res?.data?.message?.paragraph[0]?.exam_section_id,
// //                 },
// //               })
// //             );
// //           }
// //         } catch (err) {
// //           toast.error(`فشل حفظ سؤال: ${err}`);
// //         }
// //       }

// //       return;
// //     }

// //     /* ========== 2) Normal questions (general MCQ, True/False, Essay, Complete) ========== */

// //     if (isMock && !canAdd()) {
// //       toast.error("تم الوصول للحد الأقصى (24 سؤال) في هذا القسم");
// //       return;
// //     }

// //     const baseQuestion = {
// //       id: Date.now() + Math.random(),
// //       question_type: questionType,
// //       question_text: currentQuestion,
// //       exam_section_id: selectedSectionId,
// //       instructions: "Instructions",
// //     };

// //     let finalQuestion = { ...baseQuestion };

// //     switch (questionType) {
// //       case "mcq":
// //         if (mcqOptions?.filter((o) => o?.answer?.trim())?.length < 2) {
// //           toast.error("يجب إضافة خيارين على الأقل");
// //           return;
// //         }
// //         finalQuestion = {
// //           ...finalQuestion,
// //           question_type: "mcq",
// //           mcqSubType: "general",
// //           mcq_array: mcqOptions.map((opt, idx) => ({
// //             ...normalizeOption(opt),
// //             correct_or_not: mcqCorrectAnswer === idx ? "1" : "0",
// //           })),
// //           correctAnswer: mcqCorrectAnswer,
// //         };
// //         break;

// //       case "trueFalse":
// //         if (trueFalseAnswer === null) {
// //           toast.error("اختر إجابة صحيحة");
// //           return;
// //         }
// //         // Treat True/False as MCQ type with 2 options
// //         finalQuestion = {
// //           ...finalQuestion,
// //           question_type: "mcq",
// //           correctAnswer: trueFalseAnswer,
// //           explanation: trueFalseExplanation,
// //           mcq_array: [
// //             {
// //               answer: "صحيح",
// //               correct_or_not: trueFalseAnswer === true ? "1" : "0",
// //               question_explanation: trueFalseExplanation || "",
// //             },
// //             {
// //               answer: "خطأ",
// //               correct_or_not: trueFalseAnswer === false ? "1" : "0",
// //               question_explanation: trueFalseExplanation || "",
// //             },
// //           ],
// //         };
// //         break;

// //       case "essay":
// //         finalQuestion = {
// //           ...finalQuestion,
// //           model_answer: modalAnswer,
// //         };
// //         break;

// //       case "complete":
// //         if (!completeText.trim()) {
// //           toast.error("اكتب نص الجملة");
// //           return;
// //         }
// //         if (completeAnswers.filter((a) => a.answer.trim()).length === 0) {
// //           toast.error("أضف إجابة واحدة على الأقل");
// //           return;
// //         }
// //         finalQuestion = {
// //           ...finalQuestion,
// //           text: completeText,
// //           answers: completeAnswers.map((a) => a.answer).filter(Boolean),
// //         };
// //         break;
// //     }

// //     // Optimistic UI update
// //     const newSections = examData.sections.map((s) => {
// //       if (s.id !== selectedSectionId) return s;

// //       return {
// //         ...s,
// //         questions: [...(s.questions || []), finalQuestion],
// //       };
// //     });

// //     setExamData((prev) => ({ ...prev, sections: newSections }));
// //     resetQuestionForm();

// //     try {
// //       const result = await dispatch(
// //         handleAddQuestion({ body: finalQuestion })
// //       ).unwrap();

// //       if (result?.data?.status === "success") {
// //         toast.success("تم اضافة السؤال بنجاح");
// //         const exSectionId =
// //           result?.data?.message?.exam_section_id || selectedSectionId;
// //         if (exSectionId) {
// //           dispatch(
// //             handleGetExamQuestions({
// //               body: { exam_section_id: exSectionId },
// //             })
// //           );
// //         }
// //       }

// //       toast.success("تم إضافة السؤال بنجاح");
// //     } catch (error) {
// //       toast.error(error || "فشل حفظ السؤال");
// //     }
// //   };
  
  
// //   const toPassageEditorShape = (paragraphQ) => {
// //   // paragraphQ = object from DisplayQuestions apiQuestions with type "paragraph_mcq"
// //   // expected shape:
// //   // paragraphQ.paragraphContent
// //   // paragraphQ.questions = [{ questionText, options:[{text, explanation, isCorrect}] }]

// //   const passage = {
// //     id: String(paragraphQ.id ?? Date.now()),
// //     content: paragraphQ.paragraphContent || "",
// //     attachments: Array.isArray(paragraphQ.attachments) ? paragraphQ.attachments : [],
// //     questions: (paragraphQ.questions || []).map((qq, idx) => {
// //       const opts = (qq.options || []).map((opt) => ({
// //         answer: opt?.text || "",
// //         question_explanation: opt?.explanation || "",
// //         images: Array.isArray(opt?.images) ? opt.images : [],
// //       }));

// //       const correctIndex = (qq.options || []).findIndex((o) => o?.isCorrect);
// //       return {
// //         id: `${paragraphQ.id || "p"}-q-${idx}-${Date.now()}`,
// //         text: qq.questionText || "",
// //         options: opts.length >= 2 ? opts : [{ answer: "", question_explanation: "", images: [] }, { answer: "", question_explanation: "", images: [] }],
// //         correctIndex: correctIndex >= 0 ? correctIndex : 0,
// //         attachments: Array.isArray(qq.attachments) ? qq.attachments : [],
// //       };
// //     }),
// //   };

// //   return [passage]; // McqSharedPassageEditor expects array of passages
// // };

// //  useEffect(() => {
// //   if (!editingQuestion) return;

// //    // ✅ 1) auto-select the section of the question being edited
// //   if (editingQuestion?.exam_section_id) {
// //     setSelectedSectionId(editingQuestion.exam_section_id);
// //   }


// //   // MCQ normal
// //   if (editingQuestion.type === "mcq") {
// //     setQuestionType("mcq");
// //     setMcqSubType("general");
// //     setCurrentQuestion(editingQuestion.question || "");

// //     if (editingQuestion.options?.length) {
// //       const normalizedOptions = editingQuestion.options.map(opt => ({
// //         answer: opt.text || "",
// //         question_explanation: opt.explanation || "",
// //         correct_or_not: opt.is_correct?.toString() || "0",
// //       }));
// //       while (normalizedOptions.length < 4) normalizedOptions.push(emptyOption());
// //       setMcqOptions(normalizedOptions);

// //       setMcqCorrectAnswer(editingQuestion.correctAnswer || 0);
// //     }
// //     return;
// //   }

// //   // ✅ Paragraph MCQ
// //   if (editingQuestion.type === "paragraph_mcq") {
// //     setQuestionType("mcq");
// //     setMcqSubType("passage");

// //     const passages = toPassageEditorShape(editingQuestion);

// //     // populate editor data
// //     setMcqPassages((prev) => ({ ...prev, passage: passages }));

// //     // optional: setCurrentQuestion to first question text so your "payload" fallback isn't empty
// //     setCurrentQuestion(passages?.[0]?.questions?.[0]?.text || "");

// //     return;
// //   }
// // }, [editingQuestion]);
  

// //   useEffect(() => {
// //     dispatch(
// //       handleGetAllExamSections({
// //         body: {
// //           exam_id: examId ||  params["exam-id"] || openExamSection?.exam_id || openExamQuestion?.section?.exam_id,
// //         },
// //       })
// //     );
// //   }, [openExamSection, openExamQuestion, dispatch]);


// //   useEffect(() => {
// //     dispatch(handleGetAllExamData({
// //       body: {
// //         id: examid || examId
// //       }
// //     }))
// //   }, [examId, examid])

// //   // In ExamMainData component, add this useEffect to populate form when editingQuestion changes:
// //   useEffect(() => {
// //     if (editingQuestion) {
// //       console.log("Editing question loaded:", editingQuestion);

// //       // Determine question type from the editingQuestion object
// //       if (editingQuestion.type === "mcq") {
// //         setQuestionType("mcq");
// //         setCurrentQuestion(editingQuestion.question || "");

// //         // Set MCQ options
// //         if (editingQuestion.options && editingQuestion.options.length > 0) {
// //           // Convert options to the format expected by mcqOptions
// //           const normalizedOptions = editingQuestion.options.map(opt => ({
// //             answer: opt.text || "",
// //             question_explanation: opt.explanation || "",
// //             correct_or_not: opt.is_correct?.toString() || "0"
// //           }));

// //           // Ensure we have at least 4 options
// //           while (normalizedOptions.length < 4) {
// //             normalizedOptions.push(emptyOption());
// //           }

// //           setMcqOptions(normalizedOptions);

// //           // Set correct answer
// //           const correctIndex = editingQuestion.correctAnswer || 0;
// //           setMcqCorrectAnswer(correctIndex);
// //         }
// //       } else if (editingQuestion.type === "paragraph_mcq") {
// //         // Handle paragraph questions
// //         setQuestionType("mcq");
// //         setMcqSubType("passage");
// //         // You'll need to set up passage data here
// //       }
// //     }
// //   }, [editingQuestion]);

// //   const examIdForSections =
// //     examId || params["exam-id"] || params.examId || openExamSection?.exam_id;

// //   const onSectionDeleted = (deletedSectionId) => {
// //     console.log(deletedSectionId);
// //     // refresh redux list
// //     if (deletedSectionId) {
// //       dispatch(handleGetAllExamSections({ body: { exam_id: examIdForSections } }));
// //     }
// //   };



// //   useEffect(() => {
// //     console.log("get_exam_sections_list", get_exam_sections_list)
// //   }, [get_exam_sections_list])

// //   /* ===================== UI ===================== */
// //   return (
// //     <div
// //       className="max-w-6xl mx-auto space-y-6 p-6 bg-gray-50 min-h-screen"
// //       dir="rtl"
// //     >

// //       <ExamMainInfo
// //         lessonId={lessonId || null}
// //         add_exam_loading={add_exam_loading || edit_exam_loading}
// //         exam_types={exam_types}
// //         examData={examData}
// //         setExamData={setExamData}
// //         examInfoData={exmaInfoData}
// //         handleBasicDataChange={handleBasicDataChange}
// //         handleExamTypeChange={handleExamTypeChange}
// //         handleSubmitBasicData={handleSubmitBasicData}
// //       />

// //       {(openExamSection || isEditMode) && (
// //         <QuestionSections
// //           onDeleteSection={onSectionDeleted}
// //           editData={filteredData}
// //           data={openExamQuestion}
// //           examData={examData}
// //           filteredSection={filteredSection}
// //           onAddSection={onAddSection}
// //         />
// //       )}

// //       {(openExamSection || isEditMode) && !lessonId && (
// //         <AssignExam
// //           lessonId={lessonId}
// //           exam={openExamSection || filteredData}
// //         />
// //       )}


// //       {(openExamSection && get_exam_sections_list?.data?.message?.length) ||
// //         isEditMode ? (
// //         <>
// //           <Card title="إنشاء الأسئلة" icon={Edit3}>
// //             <div className="space-y-6">
// //               <QuestionTypeSelector
// //                 colorMap={colorMap}
// //                 questionType={questionType}
// //                 onTypeChange={handleQuestionTypeChange}
// //               />

// // {console.log("examData.sections", selectedSection)}


// //               {/* Section selector */}
// //               <div className="space-y-3">
// //                 <div className="flex items-center justify-between">
// //                   <label className="block text-sm font-medium text-gray-700">
// //                     اختر القسم لإضافة السؤال
// //                   </label>
// //                   {selectedSection && (
// //                     <Tag color="blue">
// //                       إجمالي أسئلة القسم:{" "}
// //                       {getQuestionsCount(selectedSection.id)}
// //                     </Tag>
// //                   )}
// //                 </div>

// //                 <Select
// //                   style={{
// //                     width: "100%",
// //                     height: "105%",
// //                     padding: "10px 0px",
// //                   }}
// //                   placeholder="اختر قسمًا"
// //                   value={selectedSectionId ?? undefined}
// //                   onChange={(v) => setSelectedSectionId(v)}
// //                   showSearch
// //                   optionFilterProp="label"
// //                   dropdownStyle={{ borderRadius: 12 }}
// //                   options={get_exam_sections_list?.data?.message?.map(
// //                     (section) => ({
// //                       value: section?.id,
// //                       label: (
// //                         <div className="flex items-start justify-between">
// //                           <div className="flex-1">
// //                             <div
// //                               className="font-medium text-gray-800"
// //                               dangerouslySetInnerHTML={{
// //                                 __html: section?.title,
// //                               }}
// //                             />
// //                             {section?.description ? (
// //                               <div
// //                                 className="text-xs text-gray-500"
// //                                 dangerouslySetInnerHTML={{
// //                                   __html: section?.description,
// //                                 }}
// //                               />
// //                             ) : null}
// //                           </div>
// //                         </div>
// //                       ),
// //                     })
// //                   )}
// //                   dropdownRender={(menu) => (
// //                     <div className="p-2">
// //                       <div className="px-2 pb-2 text-xs text-gray-500">
// //                         اختر من الأقسام المضافة بالأسفل
// //                       </div>
// //                       <div className="rounded-xl border">{menu}</div>
// //                     </div>
// //                   )}
// //                 />

// //                 {selectedSection && (
// //                   <div className="p-4 rounded-2xl border bg-white shadow-sm ring-1 ring-transparent hover:ring-blue-100 transition">
// //                     <div className="flex items-start justify-between gap-4">
// //                       <div className="space-y-1">
// //                         <h4
// //                           className="font-semibold text-gray-800"
// //                           dangerouslySetInnerHTML={{
// //                             __html: selectedSection.title,
// //                           }}
// //                         />
// //                         {selectedSection?.description ? (
// //                           <p
// //                             className="text-sm text-gray-600"
// //                             dangerouslySetInnerHTML={{
// //                               __html: selectedSection.description,
// //                             }}
// //                           />
// //                         ) : null}
// //                       </div>
// //                       <div
// //                         className={`mt-1 w-4 h-4 rounded-full border-2 ${selectedSectionId
// //                           ? "border-blue-500 bg-blue-500"
// //                           : "border-gray-300"
// //                           }`}
// //                         title="القسم الحالي"
// //                       />
// //                     </div>
// //                   </div>
// //                 )}
// //               </div>

// //               {/* MCQ types */}
// //               {questionType === "mcq" && (
// //                 <div className="space-y-5">
// //                   <div className="flex items-center justify-between">
// //                     <label className="block text-sm font-medium text-gray-700">
// //                       نوع الأسئلة المتعددة
// //                     </label>
// //                   </div>

// //                   <div className="rounded-2xl border bg-white p-3 shadow-sm">
// //                     <Segmented
// //                       size="large"
// //                       value={mcqSubType}
// //                       onChange={(v) => setMcqSubType(v)}
// //                       options={[
// //                         {
// //                           label: (
// //                             <div className="flex items-center gap-2">
// //                               <ListChecks className="w-4 h-4" />
// //                               <span>أسئلة عامة</span>
// //                             </div>
// //                           ),
// //                           value: "general",
// //                         },
// //                         {
// //                           label: (
// //                             <div className="flex items-center gap-2">
// //                               <FlaskConical className="w-4 h-4" />
// //                               <span>معادلات</span>
// //                             </div>
// //                           ),
// //                           value: "chemical",
// //                         },
// //                         {
// //                           label: (
// //                             <div className="flex items-center gap-2">
// //                               <FileText className="w-4 h-4" />
// //                               <span>قطعة</span>
// //                             </div>
// //                           ),
// //                           value: "passage",
// //                         },
// //                       ]}
// //                     />
// //                   </div>

// //                   {/* General MCQ */}
// //                   {mcqSubType === "general" ? (
// //                     <div className="space-y-8">
// //                       {/* Question Text */}
// //                       <div>
// //                         <label className="block text-lg font-semibold text-gray-800 mb-4">
// //                           نص السؤال
// //                         </label>
// //                         {/* <MathTypeEditor editorData={currentQuestion} setEditorData=
// //         {(data) => {
// //           setCurrentQuestion(data);
// //         }}
// //         /> */}
// //                         <LabeledEditor
// //                           label="" // Hide duplicate label since we have one above
// //                           value={currentQuestion}
// //                           onChange={setCurrentQuestion}
// //                           editorMinH={180}
// //                           allowImages
// //                           placeholder="اكتب نص السؤال هنا... يمكنك إضافة صور، معادلات، تنسيق..."
// //                         />
// //                       </div>

// //                       {/* Options Section */}
// //                       <div className="space-y-5">
// //                         <div className="flex items-center justify-between mb-5">
// //                           <label className="text-lg font-semibold text-gray-800">
// //                             خيارات الإجابة
// //                           </label>
// //                           <span className="text-sm text-gray-500">
// //                             يجب تحديد إجابة صحيحة واحدة فقط
// //                           </span>
// //                         </div>

// //                         <div className="space-y-6">
// //                           {mcqOptions.map((option, index) => {
// //                             const letter = String.fromCharCode(1632 + index + 1); // Arabic numerals: ١, ٢, ٣...
// //                             const isCorrect = mcqCorrectAnswer === index;

// //                             return (
// //                               <div
// //                                 key={index}
// //                                 className={`relative overflow-hidden rounded-3xl border-2 transition-all duration-300 ${isCorrect
// //                                     ? "border-green-400 bg-green-50/50 shadow-lg shadow-green-100"
// //                                     : "border-gray-200 bg-white shadow-md"
// //                                   }`}
// //                               >
// //                                 {/* Header with letter, correct indicator, and delete */}
// //                                 <div className="flex items-center justify-between p-5 bg-gradient-to-r from-transparent to-transparent">
// //                                   <div className="flex items-center gap-4">
// //                                     {/* Letter Circle */}
// //                                     <div
// //                                       className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-lg font-bold shadow-md transition-colors ${isCorrect
// //                                           ? "bg-green-600 text-white"
// //                                           : "bg-gray-100 text-gray-700"
// //                                         }`}
// //                                     >
// //                                       {letter}
// //                                     </div>

// //                                     {/* Correct Answer Radio */}
// //                                     <label className="flex items-center gap-3 cursor-pointer">
// //                                       <input
// //                                         type="radio"
// //                                         name="correctAnswer"
// //                                         checked={isCorrect}
// //                                         onChange={() => setMcqCorrectAnswer(index)}
// //                                         className="h-5 w-5 text-green-600 focus:ring-green-500"
// //                                       />
// //                                       <span className="font-medium text-gray-700">
// //                                         {isCorrect ? "الإجابة الصحيحة" : "تحديد كإجابة صحيحة"}
// //                                       </span>
// //                                       {isCorrect && (
// //                                         <span className="px-3 py-1 text-xs font-bold text-green-700 bg-green-200 rounded-full">
// //                                           ✓ صحيحة
// //                                         </span>
// //                                       )}
// //                                     </label>
// //                                   </div>

// //                                   {/* Delete Button - hidden if only 2 options */}
// //                                   {mcqOptions.length > 2 && (
// //                                     <button
// //                                       type="button"
// //                                       onClick={() => removeMcqOption(index)}
// //                                       className="p-2 text-red-600 rounded-xl hover:bg-red-50 transition-colors"
// //                                       title="حذف هذا الخيار"
// //                                     >
// //                                       <Trash2 className="w-5 h-5" />
// //                                     </button>
// //                                   )}
// //                                 </div>

// //                                 {/* Option Content */}
// //                                 <div className="px-6 pb-6 space-y-6 border-t border-gray-100">
// //                                   {/* Option Text */}
// //                                   <div>
// //                                     <label className="block text-sm font-medium text-gray-700 mb-3">
// //                                       نص الخيار
// //                                     </label>
// //                                     {/* <MathTypeEditor editorData={option.answer} setEditorData=

// //                                       {(data) =>
// //                                         updateMcqOption(
// //                                           index,
// //                                           "answer",
// //                                           data
// //                                         )
// //                                       }
// //                                     /> */}
// //                                     <LabeledEditor
// //                   label=""
// //                   value={option.answer}
// //                   onChange={(v) => updateMcqOption(index, "answer", v)}
// //                   editorMinH={130}
// //                   allowImages
// //                   placeholder="اكتب نص الخيار هنا..."
// //                 />
// //                                   </div>

// //                                   {/* Explanation */}
// //                                   <div>
// //                                     <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
// //                                       شرح الخيار
// //                                       <span className="text-xs font-normal text-gray-500">(يظهر بعد الإجابة في وضع المراجعة)</span>
// //                                     </label>
// //                                     <LabeledEditor
// //                                       label=""
// //                                       value={option.question_explanation}
// //                                       onChange={(v) => updateMcqOption(index, "question_explanation", v)}
// //                                       editorMinH={100}
// //                                       allowImages
// //                                       placeholder="اشرح لماذا هذا الخيار صحيح أو خاطئ... (اختياري لكن موصى به)"
// //                                     />
// //                                   </div>
// //                                 </div>
// //                               </div>
// //                             );
// //                           })}
// //                         </div>

// //                         {/* Add Option Button */}
// //                         <div className="flex justify-center pt-4">
// //                           <button
// //                             type="button"
// //                             onClick={addMcqOption}
// //                             className="inline-flex items-center gap-3 px-6 py-3 text-sm font-medium text-blue-700 bg-blue-50 rounded-2xl hover:bg-blue-100 hover:shadow-md transition-all shadow-sm border border-blue-200"
// //                           >
// //                             <PlusIcon className="w-5 h-5" />
// //                             إضافة خيار جديد
// //                           </button>
// //                         </div>
// //                       </div>
// //                     </div>
// //                   ) : (
// //                     <McqSharedPassageEditor
// //                       key={`${mcqSubType}:${editingQuestion?.id ?? "new"}`}
// //                       mcqSubType={mcqSubType}
// //                       initialData={mcqPassages[mcqSubType] || editingQuestion}
// //                       editingQuestion={editingQuestion}
// //                       onPassagesChange={handleMcqPassagesChange}
// //                     />
// //                   )}
// //                 </div>
// //               )}

// //               {/* Non-MCQ */}


// //               {questionType === "trueFalse" && (
// //                 <TrueFalseQuestions
// //                   questionHtml={currentQuestion}
// //                   setQuestionHtml={setCurrentQuestion}
// //                   trueFalseExplanation={trueFalseExplanation}
// //                   trueFalseAnswer={trueFalseAnswer}
// //                   setTrueFalseAnswer={setTrueFalseAnswer}
// //                   setTrueFalseExplanation={setTrueFalseExplanation}
// //                 />
// //               )}

// //               {/* Sticky action bar */}
// //               <div className="pt-4 border-t sticky bottom-0 bg-gray-50/75 backdrop-blur z-10">
// //                 <button
// //                   onClick={addOrUpdateQuestion}
// //                   disabled={
// //                     add_question_loading ||
// //                     !selectedSectionId ||
// //                     (questionType !== "mcq" && !currentQuestion) ||
// //                     (examData.type === "mock" &&
// //                       !canAddMoreQuestions(selectedSectionId))
// //                   }
// //                   className="w-full inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-200 bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 px-4 py-3 disabled:opacity-60 disabled:cursor-not-allowed"
// //                 >
// //                   {editingQuestion ? (
// //                     <Save className="h-4 w-4" />
// //                   ) : (
// //                     <PlusIcon className="h-4 w-4" />
// //                   )}
// //                   {editingQuestion
// //                     ? "تحديث السؤال"
// //                     : add_question_loading
// //                       ? "جاري الحفظ..."
// //                       : "إضافة السؤال"}
// //                 </button>
// //                 {examData.type === "mock" && selectedSectionId && (
// //                   <p className="text-sm text-gray-500 mt-2 text-center">
// //                     {getQuestionsCount(selectedSectionId)}/24 سؤال في هذا القسم
// //                   </p>
// //                 )}
// //               </div>
// //             </div>
// //           </Card>

// //           {/* Questions list */}
// //           {<DisplayQuestions
// //             selectedSection={selectedSectionData}
// //             setEditingQuestion={setEditingQuestion} editingQuestion={editQuestion} selectedSectionId={selectedSectionId} />}
// //         </>
// //       ) : (
// //         <div className="text-center py-12">
// //           <div className="bg-blue-50 p-6 rounded-full w-20 h-20 mx-auto flex items-center justify-center mb-4">
// //             <BookOpen className="h-10 w-10 text-blue-600" />
// //           </div>
// //           <h3 className="text-lg font-medium text-gray-900 mb-2">
// //             ابدأ بإنشاء اختبار جديد
// //           </h3>
// //           <p className="text-gray-600 mb-6">
// //             املأ معلومات الاختبار الأساسية وأضف الأقسام لبدء إنشاء الأسئلة
// //           </p>
// //         </div>
// //       )}

// //       {/* Add video / pdf */}
// //       {/* <AddExamVideoModal
// //         open={openExamVideoModal}
// //         setOpen={setOpenExamVideoModal}
// //         exam_id={examid || examId || openExamSection?.id}
// //         type="exam"
// //       /> */}

// //       {/* <AddExamPdfModal
// //         open={openExamPdfModal}
// //         setOpen={setOpenExamPdfModal}
// //         exam_id={examid || examId || openExamSection?.id}
// //         type="exam"
// //       /> */}

// //       {/* Edit video / pdf */}
// //       {/* <EditExamVideoModal
// //         open={openEditExamVideo}
// //         setOpen={setOpenEditExamVideo}
// //         rowData={videoRowData}
// //         setRowData={setVideoRowData}
// //         exam_id={examid || examId || openExamSection?.id}
// //       /> */}

// //       {/* <EditExamPdfModal
// //         pdfData={pdfRowData}
// //         open={openEditExamPdf}
// //         setOpen={setOpenEditExamPdf}
// //         rowData={pdfRowData}
// //         setRowData={setPdfRowData}
// //         exam_id={examid || examId || openExamSection?.id}
// //       /> */}

// //       {/* Delete video / pdf */}
// //       {/* <DeleteExamPdfModal
// //         open={openDeleteExamPdf}
// //         setOpen={setOpenDeleteExamPdf}
// //         id={examid || examId || openExamSection?.id}
// //         rowData={pdfRowData}
// //         setRowData={setPdfRowData}
// //       /> */}

// //       {/* <DeleteExamVideoModal
// //         open={openDeleteExamVideo}
// //         setOpen={setOpenDeleteExamVideo}
// //         rowData={videoRowData}
// //         setRowData={setVideoRowData}
// //         id={examid || examId || openExamSection?.id}
// //       /> */}
// //     </div>
// //   );
// // }


// "use client";

// import React, {
//   useCallback,
//   useEffect,
//   useMemo,
//   useRef,
//   useState,
// } from "react";
// import { Button, Segmented, Select, Tag } from "antd";
// import {
//   Plus as PlusIcon,
//   Edit3,
//   BookOpen,
//   Save,
//   X,
//   ListChecks,
//   FileText,
//   Trash2,
// } from "lucide-react";

// import "quill/dist/quill.snow.css";

// import Card from "./ExamCard";
// import ExamMainInfo from "./ExamMainInfo";
// import QuestionSections from "./QuestionSections";
// import TrueFalseQuestions from "./TrueFalseQuestions";
// import DisplayQuestions from "./DisplayQuestions";
// import QuestionTypeSelector from "./QuestionTypeSelector";
// import {
//   colorMap,
//   exam_types,
//   mock_exam_section_Data,
// } from "./utils";

// import McqSharedPassageEditor from "./McqSharedPassageEditor/McqSharedPassageEditor";
// import LabeledEditor from "./McqSharedPassageEditor/parts/LabeledEditor";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   handleCreateExam,
//   handleEditExam,
//   handleGetAllExams,
//   handleGetAllExamSections,
//   handleAddQuestion,
//   handleGetExamQuestions,
//   handleAssignExam,
//   handleGetAllExamData,
//   handleUpdateExamQuestions,
// } from "../../lib/features/examSlice";
// import { toast } from "react-toastify";
// import AssignExam from "./AssignExam";
// import { useParams, useSearchParams } from "next/navigation";

// /* ===================== Main: ExamMainData ===================== */
// export default function ExamMainData({
//   examData: editExamData,
//   rowData = {},
//   setRowData,
//   examid,
// }) {
//   const dispatch = useDispatch();
//   const [videoRowData, setVideoRowData] = useState({});
//   const [pdfRowData, setPdfRowData] = useState({});

//   // const [openEditExamPdf, setOpenEditExamPdf] = useState(false);

//   const searchparams = useSearchParams();
//   const lessonId = searchparams?.get("lessonId") ?? null;
//   const page = searchparams.get("page");
//   const pageSize = searchparams.get("pageSize");
//   const params = useParams();
//   // const editExamId = params["]/

//   const [examData, setExamData] = useState({
//     name: "",
//     duration: "",
//     type: "",
//     sections: [],
//   });
//   const [filteredSection, setFilteredSection] = useState([]);
//   const [questionType, setQuestionType] = useState("mcq");

//   // Common states
//   const [currentQuestion, setCurrentQuestion] = useState("");
//   const [selectedSectionId, setSelectedSectionId] = useState(null);
//   const [selectedSectionData, setSelectedSectionData] = useState({});
//   const [expandedSections, setExpandedSections] = useState({});
//   const [editingQuestion, setEditingQuestion] = useState(null);

//   // ✅ prevent “re-hydrating” form while you type
//   const lastLoadedEditIdRef = useRef(null);

//   // True/False
//   const [trueFalseAnswer, setTrueFalseAnswer] = useState(null);
//   const [trueFalseExplanation, setTrueFalseExplanation] = useState("");

//   // Essay
//   const [modalAnswer, setModalAnswer] = useState("");

//   // Complete
//   const [completeText, setCompleteText] = useState("");
//   const [completeAnswers, setCompleteAnswers] = useState([{ answer: "" }]);
//   const { get_exam_questions_list, get_exam_questions_loading } = useSelector(
//     (state) => state?.exam
//   );



//   // MCQ (general) - Updated structure to match API
//   const emptyOption = () => ({
//     answer: "",
//     question_explanation: "",
//     correct_or_not: "0",
//   });

//   const normalizeOption = (opt) => {
//     if (typeof opt === "string")
//       return { answer: opt, question_explanation: "", correct_or_not: "0" };

//     if (opt && typeof opt === "object")
//       return {
//         // IMPORTANT: support latex from chemical/math editor
//         answer: opt.answer || opt.text || opt.latex || "",
//         instructions: "Instructions",
//         question_explanation: opt.question_explanation || opt.explanation || "",
//         correct_or_not:
//           opt.correct_or_not !== undefined && opt.correct_or_not !== null
//             ? String(opt.correct_or_not)
//             : "0",
//       };

//     return emptyOption();
//   };

//   const [mcqOptions, setMcqOptions] = useState([
//     emptyOption(),
//     emptyOption(),
//     emptyOption(),
//     emptyOption(),
//   ]);
//   const [mcqCorrectAnswer, setMcqCorrectAnswer] = useState(0);

//   // MCQ subtype
//   const [mcqSubType, setMcqSubType] = useState("general");
//   const [mcqPassages, setMcqPassages] = useState({ chemical: [], passage: [] });

//   const {
//     add_exam_loading,
//     all_exam_loading,
//     all_exam_list,
//     delete_exam_loading,
//     edit_exam_loading,
//     get_exam_sections_list,
//     add_question_loading,
//     all_exam_data_list,
//   } = useSelector((state) => state?.exam);

//   const [exmaInfoData, setExamInfoData] = useState({
//     title: "",
//     description: "",
//     free: 0,
//     time: "",
//     date: "",
//     type: "mock",
//     level: "medium",
//     success_percentage: 0,
//   });
//   const [openExamSection, setOpenExamSection] = useState(false);
//   const [openExamQuestion, setOpenExamQuestion] = useState(false);
//   const [filteredData, setFilteredData] = useState({});

//   // const params = useParams();
//   const isEditMode = Boolean(params["exam-id"]);

//   /* Effects */

//   useEffect(() => {
//     if (examData?.type === "intern")
//       setFilteredSection(mock_exam_section_Data[1]);
//     else if (examData?.type === "mock")
//       setFilteredSection(mock_exam_section_Data[2]);
//     else setFilteredSection([]);
//   }, [examData?.type]);

//   useEffect(() => {
//     if (editExamData) setExamData(editExamData);
//   }, [editExamData]);

//   useEffect(() => {
//     if (examData?.sections?.length > 0 && !selectedSectionId) {
//       setSelectedSectionId(examData.sections[0].id);
//     }
//   }, [examData?.sections, selectedSectionId, selectedSectionData]);

//   useEffect(() => {
//     if (selectedSectionId) {
//       const filtered = get_exam_sections_list?.data?.message?.find(
//         (item) => item?.id == selectedSectionId
//       );
//       setSelectedSectionData(filtered);
//     }
//   }, [selectedSectionId]);

//   useEffect(() => {
//     dispatch(
//       handleGetAllExams({
//         page: page,
//         per_page: pageSize,
//       })
//     )
//       .unwrap()
//       .then((res) => {
//         console.log(res);
//       });
//   }, [dispatch, params["exam-id"], page, pageSize]);

//   // Edit mode: load exam info
//   useEffect(() => {
//     if (params["exam-id"] && !lessonId) {
//       const filteredItem = all_exam_list?.data?.message?.data?.find(
//         (item) => item?.id == params["exam-id"]
//       );

//       if (!filteredItem) return;

//       setFilteredData(filteredItem);

//       setExamInfoData((prev) => ({
//         ...prev,
//         id: filteredItem?.id,
//         title: filteredItem?.title,
//         description: filteredItem?.description,
//         free: filteredItem?.free,
//         level: filteredItem?.level,
//         date: filteredItem?.date,
//         time: filteredItem?.time,
//         type: filteredItem?.type,
//         success_percentage: filteredItem?.success_percentage,
//       }));

//       setExamData((prev) => ({
//         ...prev,
//         type: lessonId ? "intern" : filteredItem?.type,
//         sections: filteredItem?.sections || prev.sections || [],
//       }));

//       setOpenExamSection(true);
//       setOpenExamQuestion(true);
//     } else if (params["exam-id"] && lessonId) {
//       const filteredItem = all_exam_data_list?.data?.message?.exam;
//       // const filteredItem = all_exam_data_list?.data?.message?.data?.find(
//       //   (item) => item?.id == params["exam-id"]
//       // );
//       // console.log(filteredItem)

//       if (!filteredItem) return;

//       setFilteredData(filteredItem);

//       setExamInfoData((prev) => ({
//         ...prev,
//         id: filteredItem?.id,
//         title: filteredItem?.title,
//         description: filteredItem?.description,
//         free: filteredItem?.free,
//         level: filteredItem?.level,
//         date: filteredItem?.date,
//         time: filteredItem?.time,
//         type: "intern",
//         success_percentage: filteredItem?.success_percentage,
//       }));

//       setExamData((prev) => ({
//         ...prev,
//         type: lessonId ? "intern" : filteredItem?.type,
//         sections: filteredItem?.sections || prev.sections || [],
//       }));

//       setOpenExamSection(true);
//       setOpenExamQuestion(true);
//     }
//   }, [params, all_exam_list, all_exam_data_list]);

//   /* Helpers */

//   const selectedSection = useMemo(
//     () => examData.sections.find((s) => s.id === selectedSectionId),
//     [examData.sections, selectedSectionId]
//   );

//   // Function to handle basic exam data changes
//   const timeRegex = /^(?:([0-9]{1,2}):)?([0-5][0-9]):([0-5][0-9])$/;

//   const handleBasicDataChange = (field, value) => {
//     if (field === "time" && !timeRegex.test(value)) {
//       toast.warn("الوقت يجب أن يكون في الصيغة: ساعة:دقيقة:ثانية");
//       return;
//     }
//     setExamInfoData((prev) => ({ ...prev, [field]: value }));
//   };

//   const handleExamTypeChange = (type) => {
//     setExamInfoData({
//       ...exmaInfoData,
//       type: type.value,
//     });
//     setExamData({
//       ...examData,
//       exam_type: type.value,
//       lesson_id: type.value === "full_round" ? "" : examData.lesson_id,
//       sections: [],
//     });
//   };

//   const [examId, setExamId] = useState(null);


//   const handleSubmitBasicData = () => {
    
//     if (!exmaInfoData.title) {
//       toast.warn("ادخل اسم الاختبار أولا!");
//       return;
//     }

//     // if (!exmaInfoData.description) {
//     //   toast.warn("ادخل وصف الاختبار أولا!");
//     //   return;
//     // }

//     // if (!exmaInfoData?.time) {
//     //   toast.warn("اختر وقت أولا");
//     //   return;
//     // }

//     if (!exmaInfoData?.date) {
//       toast.warn("اختر تاريخ أولا");
//       return;
//     }

//     if (params["exam-id"]) {
//       const data_send = {
//         id: params["exam-id"],
//         title: exmaInfoData.title,
//         description: exmaInfoData.description,
//         free: `${exmaInfoData.free}`,
//         time: exmaInfoData?.time || null, 
//         date: exmaInfoData.date,
//         level: exmaInfoData?.level,
//         type: lessonId ? "intern" : exmaInfoData?.type,
//         success_percentage: exmaInfoData?.success_percentage,
//       };

//       dispatch(handleEditExam({ body: data_send }))
//         .unwrap()
//         .then((res) => {
//           if (res?.data?.status == "success") {
//             toast.success("تم   تعديل الاختبار بنجاح!");
//             setExamId(res?.data?.message?.id);
//           } else {
//             toast.error("هناك خطأ أثناء اضافه الاختبار");
//             setOpenExamSection(false);
//           }
//         })
//         .catch(() => {
//           toast.error("حدث خطأ أثناء إضافة الاختبار.");
//         });
//     } else {
//       const data_send = {
//         title: exmaInfoData.title,
//         description: exmaInfoData.description,
//         free: JSON.stringify(exmaInfoData.free),
//         time: exmaInfoData?.time || null,
//         date: exmaInfoData.date,
//         level: exmaInfoData?.level,
//         type: lessonId ? "intern" : exmaInfoData?.type,
//         success_percentage: exmaInfoData?.success_percentage,
//       };

//       dispatch(handleCreateExam({ body: data_send }))
//         .unwrap()
//         .then((res) => {
//           if (res?.data?.status == "success") {
//             toast.success("تم    !ضافة الاختبار بنجاح!");
//             setOpenExamSection(res?.data?.message);
//             if (lessonId) {
//               const data_send = {
//                 type: "lesson", // 'full_round' or 'lesson'
//                 exam_id: res?.data?.message?.id, // Assuming an exam_id
//                 lesson_or_round_id: lessonId,
//               };
//               setExamId(res?.data?.message?.id);
//               dispatch(handleAssignExam({ body: data_send }));
//             }
//             dispatch(
//               handleGetAllExamSections({
//                 body: {
//                   exam_id:
//                     examId || params["exam-id"] || res?.data?.message?.id,
//                 },
//               })
//             );
//             setExamData({ ...examData, sections: [] });
//           } else {
//             toast.error("هناك خطأ أثناء اضافه الاختبار");
//             setOpenExamSection(false);
//           }
//         })
//         .catch(() => {
//           toast.error("حدث خطأ أثناء إضافة الاختبار.");
//         });
//     }
//   };

 

//   const toggleSection = (sectionId) =>
//     setExpandedSections((prev) => ({
//       ...prev,
//       [sectionId]: !prev[sectionId],
//     }));

//   const handleQuestionTypeChange = (type) => {
//     setQuestionType(type);
//     resetQuestionForm();
//   };

//   const resetQuestionForm = () => {
//     setCurrentQuestion("");
//     setTrueFalseAnswer(null);
//     setTrueFalseExplanation("");
//     setModalAnswer("");
//     setCompleteText("");
//     setCompleteAnswers([{ answer: "" }]);
//     setMcqOptions([emptyOption(), emptyOption(), emptyOption(), emptyOption()]);
//     setMcqCorrectAnswer(0);
//     setEditingQuestion(null);
//     setMcqSubType("general");
//     setMcqPassages({ chemical: [], passage: [] });

//     // ✅ allow next edit to hydrate again
//     lastLoadedEditIdRef.current = null;
//   };

//   // ← UPDATED: Now keeps correct_or_not in sync
//   const updateMcqOption = (index, field, v) =>
//     setMcqOptions((opts) => {
//       const next = [...opts];
//       next[index] = { ...normalizeOption(next[index]), [field]: v };
//       next[index].correct_or_not = mcqCorrectAnswer === index ? "1" : "0";
//       return next;
//     });

//   const addMcqOption = () => setMcqOptions((opts) => [...opts, emptyOption()]);
//   const removeMcqOption = (index) => {
//     setMcqOptions((opts) => {
//       if (opts.length <= 2) return opts;
//       const next = opts.filter((_, i) => i !== index);
//       setMcqCorrectAnswer((curr) =>
//         curr >= index ? Math.max(0, curr - 1) : curr
//       );
//       return next;
//     });
//   };

//   const getQuestionsCount = (sectionId) =>
//     sectionId
//       ? examData.sections.find((s) => s.id === sectionId)?.questions?.length ||
//         0
//       : 0;

//   const canAddMoreQuestions = (sectionId) =>
//     !sectionId
//       ? false
//       : examData.type !== "mock"
//       ? true
//       : getQuestionsCount(sectionId) < 24;

//   const handleMcqPassagesChange = useCallback(
//     (passages) =>
//       setMcqPassages((prev) => ({ ...prev, [mcqSubType]: passages })),
//     [mcqSubType]
//   );

//   // ✅ helper: convert paragraph_mcq from DisplayQuestions -> McqSharedPassageEditor format
//   const convertParagraphToPassageEditor = (q) => {
//     const uid = () =>
//       Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

//     const toOpt = (opt) => ({
//       answer: opt?.text || "",
//       question_explanation: opt?.explanation || "",
//       images: Array.isArray(opt?.images) ? opt.images : [],
//     });

//     const questions = (q?.questions || []).map((qq) => {
//       const opts = (qq?.options || []).map(toOpt);
//       const correctIndex =
//         (qq?.options || []).findIndex((o) => o?.isCorrect) >= 0
//           ? (qq?.options || []).findIndex((o) => o?.isCorrect)
//           : 0;

//       // ensure >= 2 options
//       const safeOpts =
//         opts.length >= 2 ? opts : [toOpt({}), toOpt({})].slice(0, 2);

//       return {
//         id: uid(),
//         text: qq?.questionText || "",
//         options: safeOpts,
//         correctIndex: correctIndex >= 0 ? correctIndex : 0,
//         attachments: Array.isArray(qq?.attachments) ? qq.attachments : [],
//       };
//     });

//     return [
//       {
//         id: uid(),
//         content: q?.paragraphContent || "",
//         attachments: Array.isArray(q?.attachments) ? q.attachments : [],
//         questions: questions.length ? questions : [],
//       },
//     ];
//   };

//   // أضف هذه الوظيفة في ExamMainData component
//   const editQuestion = async (question) => {
//     // تحضير البيانات حسب نوع السؤال
//     let updatedQuestionData = {
//       id: question.id,
//       question_text: question.question_text || currentQuestion,
//       instructions: question.instructions || "Instructions",
//     };

//     // إضافة البيانات حسب نوع السؤال
//     switch (questionType) {
//       case "mcq":
//         if (mcqSubType === "general") {
//           updatedQuestionData = {
//             ...updatedQuestionData,
//             mcq_array: mcqOptions.map((opt, idx) => ({
//               ...normalizeOption(opt),
//               correct_or_not: mcqCorrectAnswer === idx ? "1" : "0",
//             })),
//           };
//         }
//         break;

//       case "trueFalse":
//         updatedQuestionData = {
//           ...updatedQuestionData,
//           question_type: "mcq", // True/False يتم معالجته كـ MCQ
//           mcq_array: [
//             {
//               answer: "صحيح",
//               correct_or_not: trueFalseAnswer === true ? "1" : "0",
//               question_explanation: trueFalseExplanation || "",
//             },
//             {
//               answer: "خطأ",
//               correct_or_not: trueFalseAnswer === false ? "1" : "0",
//               question_explanation: trueFalseExplanation || "",
//             },
//           ],
//         };
//         break;
//     }

//     try {
//       const result = await dispatch(
//         handleUpdateExamQuestions({ body: updatedQuestionData })
//       ).unwrap();

//       if (result?.data?.status === "success") {
//         toast.success("تم تحديث السؤال بنجاح");

//         // تحديث UI بشكل فوري
//         const updatedSections = examData.sections.map((section) => {
//           if (section.id !== selectedSectionId) return section;

//           return {
//             ...section,
//             questions: section.questions.map((q) =>
//               q.id === question.id ? { ...q, ...updatedQuestionData } : q
//             ),
//           };
//         });

//         setExamData((prev) => ({ ...prev, sections: updatedSections }));
//         resetQuestionForm();

//         // إعادة تحميل الأسئلة من API
//         dispatch(
//           handleGetExamQuestions({
//             body: { exam_section_id: selectedSectionId },
//           })
//         );
//       }
//     } catch (error) {
//       toast.error("فشل تحديث السؤال");
//     }
//   };

//   // /* ===================== Add / Update Question ===================== */
//   // const addOrUpdateQuestion = async () => {
//   //   if (!selectedSectionId) {
//   //     toast.error("يرجى اختيار قسم أولاً");
//   //     return;
//   //   }

//   //   if (questionType !== "mcq" && !currentQuestion.trim()) {
//   //     toast.error("يرجى كتابة نص السؤال");
//   //     return;
//   //   }

//   //   const section = examData?.sections.find((s) => s.id === selectedSectionId);
//   //   const currentCount = section?.questions?.length || 0;
//   //   const isMock = examData.type === "mock";
//   //   const maxPerSection = 24;

//   //   const canAdd = (count = 1) => !isMock || currentCount + count <= maxPerSection;

//   //   // ========== إذا كان في وضع تحرير ==========
//   //   if (editingQuestion) {
//   //     let payload;

//   //     switch (questionType) {
//   //       case "mcq":
//   //         if (mcqSubType === "general") {
//   //           if (mcqOptions?.filter((o) => o?.answer?.trim())?.length < 2) {
//   //             toast.error("يجب إضافة خيارين على الأقل");
//   //             return;
//   //           }
//   //           payload = {
//   //             id: editingQuestion.id,
//   //             question_text: currentQuestion,
//   //             instructions: "اختر الإجابة الصحيحة",
//   //             exam_section_id: selectedSectionId,
//   //             mcq_array: mcqOptions.map((opt, idx) => ({
//   //               ...normalizeOption(opt),
//   //               correct_or_not: mcqCorrectAnswer === idx ? "1" : "0",
//   //             })),
//   //           };
//   //         } else if (mcqSubType === "passage" || mcqSubType === "chemical") {
//   //           // معالجة تحرير أسئلة الفقرة والمعادلات
//   //           const groups = mcqPassages[mcqSubType] || [];
//   //           if (groups.length === 0) {
//   //             toast.error("يجب إضافة محتوى الفقرة/المعادلة");
//   //             return;
//   //           }

//   //           payload = {
//   //             id: editingQuestion.id,
//   //             question_type: mcqSubType === "passage" ? "paragraph_mcq" : "mcq",
//   //             paragraph_content: mcqSubType === "passage" ? groups[0]?.content : "",
//   //             question_text: groups[0]?.questions?.[0]?.text || currentQuestion,
//   //             instructions: "اختر الإجابة الصحيحة",
//   //             exam_section_id: selectedSectionId,
//   //             mcq_array:
//   //               groups[0]?.questions?.[0]?.options?.map((opt, idx) => ({
//   //                 ...normalizeOption(opt),
//   //                 correct_or_not:
//   //                   groups[0]?.questions?.[0]?.correctIndex === idx ? "1" : "0",
//   //               })) || [],
//   //           };
//   //         }
//   //         break;

//   //       case "trueFalse":
//   //         if (trueFalseAnswer === null) {
//   //           toast.error("اختر إجابة صحيحة");
//   //           return;
//   //         }
//   //         payload = {
//   //           id: editingQuestion.id,
//   //           question_text: currentQuestion,
//   //           instructions: "اختر الإجابة الصحيحة",
//   //           exam_section_id: selectedSectionId,
//   //           mcq_array: [
//   //             {
//   //               answer: "صحيح",
//   //               correct_or_not: trueFalseAnswer === true ? "1" : "0",
//   //               question_explanation: trueFalseExplanation || "",
//   //             },
//   //             {
//   //               answer: "خطأ",
//   //               correct_or_not: trueFalseAnswer === false ? "1" : "0",
//   //               question_explanation: trueFalseExplanation || "",
//   //             },
//   //           ],
//   //         };
//   //         break;

//   //       case "essay":
//   //         payload = {
//   //           id: editingQuestion.id,
//   //           question_text: currentQuestion,
//   //           instructions: "أجب عن السؤال التالي",
//   //           exam_section_id: selectedSectionId,
//   //           model_answer: modalAnswer,
//   //         };
//   //         break;

//   //       case "complete":
//   //         if (!completeText.trim()) {
//   //           toast.error("اكتب نص الجملة");
//   //           return;
//   //         }
//   //         if (completeAnswers.filter((a) => a.answer.trim()).length === 0) {
//   //           toast.error("أضف إجابة واحدة على الأقل");
//   //           return;
//   //         }
//   //         payload = {
//   //           id: editingQuestion.id,
//   //           question_text: completeText,
//   //           instructions: "أكمل الجملة التالية",
//   //           exam_section_id: selectedSectionId,
//   //           answers: completeAnswers.map((a) => a.answer).filter(Boolean),
//   //         };
//   //         break;
//   //     }

//   //     try {
//   //       const result = await dispatch(
//   //         handleUpdateExamQuestions({ body: payload })
//   //       ).unwrap();

//   //       if (result?.data?.status === "success") {
//   //         toast.success("تم تحديث السؤال بنجاح");

//   //         // تحديث واجهة المستخدم فورياً
//   //         const updatedSections = examData.sections.map((s) => {
//   //           if (s.id !== selectedSectionId) return s;

//   //           return {
//   //             ...s,
//   //             questions: s.questions.map((q) =>
//   //               q.id === editingQuestion.id ? { ...q, ...payload } : q
//   //             ),
//   //           };
//   //         });

//   //         setExamData((prev) => ({ ...prev, sections: updatedSections }));
//   //         resetQuestionForm();

//   //         // إعادة تحميل الأسئلة من API
//   //         dispatch(
//   //           handleGetExamQuestions({
//   //             body: { exam_section_id: selectedSectionId },
//   //           })
//   //         );
//   //       }
//   //     } catch (error) {
//   //       toast.error(error?.message || "فشل تحديث السؤال");
//   //     }
//   //     return; // انتهاء الدالة في وضع التحرير
//   //   }

//   //   /* ========== 1) MCQ with subtypes (chemical / passage) ========== */
//   //   if (questionType === "mcq" && mcqSubType !== "general") {
//   //     const groups = mcqPassages[mcqSubType] || [];

//   //     /* ----- 1A) Paragraph MCQ → paragraph_mcq payload ----- */
//   //     if (mcqSubType === "passage") {
//   //       const flatQuestions = [];
//   //       const paragraphPayloads = [];

//   //       for (const group of groups) {
//   //         if (!group?.content?.trim()) continue;

//   //         const groupQuestionsForPayload = [];

//   //         for (const q of group.questions || []) {
//   //           if (!q.text?.trim()) continue;

//   //           // Normalize options and mark correct
//   //           const normalizedOptions = (q.options || []).map((opt, idx) => {
//   //             const base = normalizeOption(opt);
//   //             return {
//   //               ...base,
//   //               correct_or_not: q.correctIndex === idx ? "1" : "0",
//   //             };
//   //           });

//   //           if (normalizedOptions.length < 2) {
//   //             toast.error("كل سؤال في الفقرة يجب أن يحتوي على خيارين على الأقل");
//   //             return;
//   //           }

//   //           // UI-level question (flat for DisplayQuestions)
//   //           const flatQuestion = {
//   //             id: Date.now() + Math.random(),
//   //             question_type: "paragraph_mcq",
//   //             question_text: q.text,
//   //             exam_section_id: selectedSectionId,
//   //             mcqSubType,
//   //             mcq_array: normalizedOptions,
//   //             correctAnswer: q.correctIndex ?? 0,
//   //             paragraph_content: group.content,
//   //             instructions: "اختر الإجابة الصحيحة",
//   //           };

//   //           flatQuestions.push(flatQuestion);

//   //           // API payload inner question
//   //           groupQuestionsForPayload.push({
//   //             question_text: q.text,
//   //             instructions: "اختر الإجابة الصحيحة",
//   //             mcq_array: normalizedOptions,
//   //           });
//   //         }

//   //         if (groupQuestionsForPayload.length) {
//   //           paragraphPayloads.push({
//   //             exam_section_id: selectedSectionId,
//   //             question_type: "paragraph_mcq",
//   //             paragraph_content: group.content,
//   //             questions: groupQuestionsForPayload,
//   //           });
//   //         }
//   //       }

//   //       if (!flatQuestions.length) {
//   //         toast.error("لم يتم إنشاء أي سؤال صالح للفقرة");
//   //         return;
//   //       }

//   //       const totalNewQuestions = flatQuestions.length;

//   //       if (!canAdd(totalNewQuestions)) {
//   //         toast.error(`الحد الأقصى 24 سؤال لكل قسم في الاختبار المحاكي`);
//   //         return;
//   //       }

//   //       // Optimistic UI update (flat questions)
//   //       const updatedSections = examData.sections.map((s) => {
//   //         if (s.id !== selectedSectionId) return s;

//   //         return {
//   //           ...s,
//   //           questions: [...(s.questions || []), ...flatQuestions],
//   //         };
//   //       });

//   //       setExamData((prev) => ({ ...prev, sections: updatedSections }));
//   //       resetQuestionForm();

//   //       try {
//   //         // API: send grouped paragraph_mcq payloads
//   //         for (const payload of paragraphPayloads) {
//   //           await dispatch(handleAddQuestion({ body: payload }))
//   //             .unwrap()
//   //             .then((res) => {
//   //               console.log("passage response" , res);
//   //               if (res?.data?.status == "success") {
//   //                 toast.success("تم اضافة السؤال بنجاح");
//   //                 dispatch(
//   //                   handleGetExamQuestions({
//   //                     body: {
//   //                       exam_section_id:
//   //                         res?.data?.message?.paragraph?.exam_section_id ||
//   //                         res?.data?.message?.questions[0]?.exam_section_id ||
//   //                         res?.data?.message?.paragraph[0]?.exam_section_id,
//   //                     },
//   //                   })
//   //                 );
//   //               }else {
//   //                  toast.error(res?.error?.response?.data?.message ||  res?.error?.message)
//   //               }
//   //             });
//   //         }
//   //         // toast.success("تم حفظ أسئلة الفقرة بنجاح");
//   //       } catch (err) {
//   //         toast.error("فشل حفظ أسئلة الفقرة");
//   //       }

//   //       return;
//   //     }

//   //     /* ----- 1B) Chemical equations → behave as normal MCQ ----- */
//   //     const questionsToAdd = [];

//   //     for (const group of groups) {
//   //       for (const q of group.questions || []) {
//   //         // Either a specific question text or fallback to the equation content
//   //         if (!q.text?.trim() && !group?.content?.trim()) continue;

//   //         const normalizedOptions = (q.options || []).map((opt, idx) => {
//   //           const base = normalizeOption(opt);
//   //           return {
//   //             ...base,
//   //             correct_or_not: q.correctIndex === idx ? "1" : "0",
//   //           };
//   //         });

//   //         if (normalizedOptions.length < 2) {
//   //           toast.error("كل سؤال يجب أن يحتوي على خيارين على الأقل");
//   //           return;
//   //         }

//   //         questionsToAdd.push({
//   //           id: Date.now() + Math.random(),
//   //           question_type: "mcq",
//   //           question_text: q.text || group.content || "",
//   //           exam_section_id: selectedSectionId,
//   //           mcqSubType,
//   //           mcq_array: normalizedOptions,
//   //           correctAnswer: q.correctIndex ?? 0,
//   //           instructions: "اختر الاجابة الصحيحه",
//   //         });
//   //       }
//   //     }

//   //     if (!questionsToAdd.length) {
//   //       toast.error("لم يتم إنشاء أي سؤال صالح");
//   //       return;
//   //     }

//   //     if (!canAdd(questionsToAdd.length)) {
//   //       toast.error(`الحد الأقصى 24 سؤال لكل قسم في الاختبار المحاكي`);
//   //       return;
//   //     }

//   //     const updatedSections = examData.sections.map((s) =>
//   //       s.id === selectedSectionId
//   //         ? {
//   //             ...s,
//   //             questions: [...(s.questions || []), ...questionsToAdd],
//   //           }
//   //         : s
//   //     );

//   //     setExamData((prev) => ({ ...prev, sections: updatedSections }));
//   //     resetQuestionForm();

//   //     // Send each chemical question as normal MCQ to API
//   //     for (const q of questionsToAdd) {
//   //       try {
//   //         const res = await dispatch(handleAddQuestion({ body: q })).unwrap();
//   //         if (res?.data?.status == "success") {
//   //           toast.success("تم اضافة السؤال بنجاح");
//   //           dispatch(
//   //             handleGetExamQuestions({
//   //               body: {
//   //                 exam_section_id:
//   //                   res?.data?.message?.exam_section_id ||
//   //                   res?.data?.message?.questions[0]?.exam_section_id ||
//   //                   res?.data?.message?.paragraph[0]?.exam_section_id,
//   //               },
//   //             })
//   //           );
//   //         }
//   //       } catch (err) {
//   //         toast.error(`فشل حفظ سؤال: ${err}`);
//   //       }
//   //     }

//   //     return;
//   //   }

//   //   /* ========== 2) Normal questions (general MCQ, True/False, Essay, Complete) ========== */

//   //   if (isMock && !canAdd()) {
//   //     toast.error("تم الوصول للحد الأقصى (24 سؤال) في هذا القسم");
//   //     return;
//   //   }

//   //   const baseQuestion = {
//   //     id: Date.now() + Math.random(),
//   //     question_type: questionType,
//   //     question_text: currentQuestion,
//   //     exam_section_id: selectedSectionId,
//   //     instructions: "Instructions",
//   //   };

//   //   let finalQuestion = { ...baseQuestion };

//   //   switch (questionType) {
//   //     case "mcq":
//   //       if (mcqOptions?.filter((o) => o?.answer?.trim())?.length < 2) {
//   //         toast.error("يجب إضافة خيارين على الأقل");
//   //         return;
//   //       }
//   //       finalQuestion = {
//   //         ...finalQuestion,
//   //         question_type: "mcq",
//   //         mcqSubType: "general",
//   //         mcq_array: mcqOptions.map((opt, idx) => ({
//   //           ...normalizeOption(opt),
//   //           correct_or_not: mcqCorrectAnswer === idx ? "1" : "0",
//   //         })),
//   //         correctAnswer: mcqCorrectAnswer,
//   //       };
//   //       break;

//   //     case "trueFalse":
//   //       if (trueFalseAnswer === null) {
//   //         toast.error("اختر إجابة صحيحة");
//   //         return;
//   //       }
//   //       // Treat True/False as MCQ type with 2 options
//   //       finalQuestion = {
//   //         ...finalQuestion,
//   //         question_type: "mcq",
//   //         correctAnswer: trueFalseAnswer,
//   //         explanation: trueFalseExplanation,
//   //         mcq_array: [
//   //           {
//   //             answer: "صحيح",
//   //             correct_or_not: trueFalseAnswer === true ? "1" : "0",
//   //             question_explanation: trueFalseExplanation || "",
//   //           },
//   //           {
//   //             answer: "خطأ",
//   //             correct_or_not: trueFalseAnswer === false ? "1" : "0",
//   //             question_explanation: trueFalseExplanation || "",
//   //           },
//   //         ],
//   //       };
//   //       break;

//   //     case "essay":
//   //       finalQuestion = {
//   //         ...finalQuestion,
//   //         model_answer: modalAnswer,
//   //       };
//   //       break;

//   //     case "complete":
//   //       if (!completeText.trim()) {
//   //         toast.error("اكتب نص الجملة");
//   //         return;
//   //       }
//   //       if (completeAnswers.filter((a) => a.answer.trim()).length === 0) {
//   //         toast.error("أضف إجابة واحدة على الأقل");
//   //         return;
//   //       }
//   //       finalQuestion = {
//   //         ...finalQuestion,
//   //         text: completeText,
//   //         answers: completeAnswers.map((a) => a.answer).filter(Boolean),
//   //       };
//   //       break;
//   //   }

//   //   // Optimistic UI update
//   //   const newSections = examData.sections.map((s) => {
//   //     if (s.id !== selectedSectionId) return s;

//   //     return {
//   //       ...s,
//   //       questions: [...(s.questions || []), finalQuestion],
//   //     };
//   //   });

//   //   setExamData((prev) => ({ ...prev, sections: newSections }));
//   //   resetQuestionForm();

//   //   try {
//   //     const result = await dispatch(handleAddQuestion({ body: finalQuestion }))
//   //       .unwrap();

//   //     if (result?.data?.status === "success") {
//   //       toast.success("تم اضافة السؤال بنجاح");
//   //       const exSectionId = result?.data?.message?.exam_section_id || selectedSectionId;
//   //       if (exSectionId) {
//   //         dispatch(
//   //           handleGetExamQuestions({
//   //             body: { exam_section_id: exSectionId },
//   //           })
//   //         );
//   //       }
//   //     }

//   //     toast.success("تم إضافة السؤال بنجاح");
//   //   } catch (error) {
//   //     toast.error(error || "فشل حفظ السؤال");
//   //   }
//   // };

// const refreshAfterAdd = async (res) => {
//   const exSectionId =
//     res?.data?.message?.exam_section_id ||
//     res?.data?.message?.paragraph?.exam_section_id ||
//     res?.data?.message?.questions?.[0]?.exam_section_id ||
//     res?.data?.message?.paragraph?.[0]?.exam_section_id ||
//     selectedSectionId;

//   if (!exSectionId) return;

//   await dispatch(
//     handleGetExamQuestions({
//       body: { exam_section_id: exSectionId },
//     })
//   );
// };

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

//   const canAdd = (count = 1) => !isMock || currentCount + count <= maxPerSection;

//   // ========== EDIT MODE ==========
//   if (editingQuestion) {
//     let payload;

//     switch (questionType) {
//       case "mcq":
//         if (mcqSubType === "general") {
//           if (mcqOptions?.filter((o) => o?.answer?.trim())?.length < 2) {
//             toast.error("يجب إضافة خيارين على الأقل");
//             return;
//           }
//           payload = {
//             id: editingQuestion.id,
//             question_text: currentQuestion,
//             instructions: "اختر الإجابة الصحيحة",
//             exam_section_id: selectedSectionId,
//             mcq_array: mcqOptions.map((opt, idx) => ({
//               ...normalizeOption(opt),
//               correct_or_not: mcqCorrectAnswer === idx ? "1" : "0",
//             })),
//           };
//         } else if (mcqSubType === "passage" || mcqSubType === "chemical") {
//           const groups = mcqPassages[mcqSubType] || [];
//           if (groups.length === 0) {
//             toast.error("يجب إضافة محتوى الفقرة/المعادلة");
//             return;
//           }

//           payload = {
//             id: editingQuestion.id,
//             question_type: mcqSubType === "passage" ? "paragraph_mcq" : "mcq",
//             paragraph_content: mcqSubType === "passage" ? groups[0]?.content : "",
//             question_text: groups[0]?.questions?.[0]?.text || currentQuestion,
//             instructions: "اختر الإجابة الصحيحة",
//             exam_section_id: selectedSectionId,
//             mcq_array:
//               groups[0]?.questions?.[0]?.options?.map((opt, idx) => ({
//                 ...normalizeOption(opt),
//                 correct_or_not:
//                   groups[0]?.questions?.[0]?.correctIndex === idx ? "1" : "0",
//               })) || [],
//           };
//         }
//         break;

//       case "trueFalse":
//         if (trueFalseAnswer === null) {
//           toast.error("اختر إجابة صحيحة");
//           return;
//         }
//         payload = {
//           id: editingQuestion.id,
//           question_text: currentQuestion,
//           instructions: "اختر الإجابة الصحيحة",
//           exam_section_id: selectedSectionId,
//           mcq_array: [
//             {
//               answer: "صحيح",
//               correct_or_not: trueFalseAnswer === true ? "1" : "0",
//               question_explanation: trueFalseExplanation || "",
//             },
//             {
//               answer: "خطأ",
//               correct_or_not: trueFalseAnswer === false ? "1" : "0",
//               question_explanation: trueFalseExplanation || "",
//             },
//           ],
//         };
//         break;

//       case "essay":
//         payload = {
//           id: editingQuestion.id,
//           question_text: currentQuestion,
//           instructions: "أجب عن السؤال التالي",
//           exam_section_id: selectedSectionId,
//           model_answer: modalAnswer,
//         };
//         break;

//       case "complete":
//         if (!completeText.trim()) {
//           toast.error("اكتب نص الجملة");
//           return;
//         }
//         if (completeAnswers.filter((a) => a.answer.trim()).length === 0) {
//           toast.error("أضف إجابة واحدة على الأقل");
//           return;
//         }
//         payload = {
//           id: editingQuestion.id,
//           question_text: completeText,
//           instructions: "أكمل الجملة التالية",
//           exam_section_id: selectedSectionId,
//           answers: completeAnswers.map((a) => a.answer).filter(Boolean),
//         };
//         break;
//     }

//     try {
//       const result = await dispatch(handleUpdateExamQuestions({ body: payload })).unwrap();

//       if (result?.data?.status === "success") {
//         toast.success("تم تحديث السؤال بنجاح");

//         // ✅ ALWAYS refresh after update
//         await refreshAfterAdd(result);

//         // Optional UI updates you already had:
//         const updatedSections = examData.sections.map((s) => {
//           if (s.id !== selectedSectionId) return s;
//           return {
//             ...s,
//             questions: s.questions.map((q) =>
//               q.id === editingQuestion.id ? { ...q, ...payload } : q
//             ),
//           };
//         });
//         setExamData((prev) => ({ ...prev, sections: updatedSections }));
//         resetQuestionForm();
//       } else {
//         toast.error(result?.data?.message || "فشل تحديث السؤال");
//       }
//     } catch (error) {
//       toast.error(error?.message || "فشل تحديث السؤال");
//     }

//     return;
//   }

//   /* ========== 1) MCQ with subtypes (chemical / passage) ========== */
//   if (questionType === "mcq" && mcqSubType !== "general") {
//     const groups = mcqPassages[mcqSubType] || [];

//     // ----- 1A) PASSAGE -----
//     if (mcqSubType === "passage") {
//       const flatQuestions = [];
//       const paragraphPayloads = [];

//       for (const group of groups) {
//         if (!group?.content?.trim()) continue;

//         const groupQuestionsForPayload = [];

//         for (const q of group.questions || []) {
//           if (!q.text?.trim()) continue;

//           const normalizedOptions = (q.options || []).map((opt, idx) => ({
//             ...normalizeOption(opt),
//             correct_or_not: q.correctIndex === idx ? "1" : "0",
//           }));

//           if (normalizedOptions.length < 2) {
//             toast.error("كل سؤال في الفقرة يجب أن يحتوي على خيارين على الأقل");
//             return;
//           }

//           flatQuestions.push({
//             id: Date.now() + Math.random(),
//             question_type: "paragraph_mcq",
//             question_text: q.text,
//             exam_section_id: selectedSectionId,
//             mcqSubType,
//             mcq_array: normalizedOptions,
//             correctAnswer: q.correctIndex ?? 0,
//             paragraph_content: group.content,
//             instructions: "اختر الإجابة الصحيحة",
//           });

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
//       }

//       if (!flatQuestions.length) {
//         toast.error("لم يتم إنشاء أي سؤال صالح للفقرة");
//         return;
//       }

//       if (!canAdd(flatQuestions.length)) {
//         toast.error(`الحد الأقصى 24 سؤال لكل قسم في الاختبار المحاكي`);
//         return;
//       }

//       // optimistic UI
//       setExamData((prev) => ({
//         ...prev,
//         sections: prev.sections.map((s) =>
//           s.id === selectedSectionId
//             ? { ...s, questions: [...(s.questions || []), ...flatQuestions] }
//             : s
//         ),
//       }));
//       resetQuestionForm();

//       try {
//         // ✅ AFTER EACH ADD payload success -> refresh
//         for (const payload of paragraphPayloads) {
//           const res = await dispatch(handleAddQuestion({ body: payload })).unwrap();

//           if (res?.data?.status === "success") {
//             toast.success("تم اضافة السؤال بنجاح");
//             await refreshAfterAdd(res); // ✅ refresh after every payload
//           } else {
//             toast.error(
//               res?.error?.response?.data?.message || res?.error?.message || "فشل حفظ أسئلة الفقرة"
//             );
//             return;
//           }
//         }
//       } catch (err) {
//         toast.error(err?.message || "فشل حفظ أسئلة الفقرة");
//       }

//       return;
//     }

//     // ----- 1B) CHEMICAL -----
//     const questionsToAdd = [];

//     for (const group of groups) {
//       for (const q of group.questions || []) {
//         if (!q.text?.trim() && !group?.content?.trim()) continue;

//         const normalizedOptions = (q.options || []).map((opt, idx) => ({
//           ...normalizeOption(opt),
//           correct_or_not: q.correctIndex === idx ? "1" : "0",
//         }));

//         if (normalizedOptions.length < 2) {
//           toast.error("كل سؤال يجب أن يحتوي على خيارين على الأقل");
//           return;
//         }

//         questionsToAdd.push({
//           id: Date.now() + Math.random(),
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

//     // optimistic UI
//     setExamData((prev) => ({
//       ...prev,
//       sections: prev.sections.map((s) =>
//         s.id === selectedSectionId
//           ? { ...s, questions: [...(s.questions || []), ...questionsToAdd] }
//           : s
//       ),
//     }));
//     resetQuestionForm();

//     // ✅ AFTER EACH ADD success -> refresh
//     for (const q of questionsToAdd) {
//       try {
//         const res = await dispatch(handleAddQuestion({ body: q })).unwrap();
//         if (res?.data?.status === "success") {
//           toast.success("تم اضافة السؤال بنجاح");
//           await refreshAfterAdd(res); // ✅ refresh after every question
//         } else {
//           toast.error(res?.data?.message || "فشل حفظ سؤال كيمياء");
//           return;
//         }
//       } catch (err) {
//         toast.error(err?.message || "فشل حفظ سؤال كيمياء");
//         return;
//       }
//     }

//     return;
//   }

//   /* ========== 2) Normal questions ========== */
//   if (isMock && !canAdd()) {
//     toast.error("تم الوصول للحد الأقصى (24 سؤال) في هذا القسم");
//     return;
//   }

//   const baseQuestion = {
//     id: Date.now() + Math.random(),
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

//   // optimistic UI
//   setExamData((prev) => ({
//     ...prev,
//     sections: prev.sections.map((s) =>
//       s.id === selectedSectionId
//         ? { ...s, questions: [...(s.questions || []), finalQuestion] }
//         : s
//     ),
//   }));
//   resetQuestionForm();

//   try {
//     const res = await dispatch(handleAddQuestion({ body: finalQuestion })).unwrap();

//     if (res?.data?.status === "success") {
//       toast.success("تم اضافة السؤال بنجاح");
//       await refreshAfterAdd(res); // ✅ refresh after add
//     } else {
//       toast.error(res?.data?.message || "فشل حفظ السؤال");
//     }
//   } catch (error) {
//     toast.error(error?.message || "فشل حفظ السؤال");
//   }
// };



//   useEffect(() => {
//     dispatch(
//       handleGetAllExamSections({
//         body: {
//           exam_id:
//             examId ||
//             params["exam-id"] ||
//             openExamSection?.exam_id ||
//             openExamQuestion?.section?.exam_id,
//         },
//       })
//     );
//   }, [openExamSection, openExamQuestion, dispatch]);

//   useEffect(() => {
//     dispatch(
//       handleGetAllExamData({
//         body: {
//           id: examid || examId,
//         },
//       })
//     );
//   }, [examId, examid]);

//   // In ExamMainData component, add this useEffect to populate form when editingQuestion changes:
//   useEffect(() => {
//     if (!editingQuestion) return;

//     // ✅ hydrate ONCE per question id (prevents “cant edit input” issue)
//     if (lastLoadedEditIdRef.current === editingQuestion.id) return;
//     lastLoadedEditIdRef.current = editingQuestion.id;

//     // ✅ make sure correct section is selected
//     if (editingQuestion?.exam_section_id) {
//       setSelectedSectionId(editingQuestion.exam_section_id);
//     }


//     // Determine question type from the editingQuestion object
//     if (editingQuestion.type === "mcq") {
//       setQuestionType("mcq");
//       setMcqSubType("general");
//       setCurrentQuestion(editingQuestion.question || "");

//       // Set MCQ options
//       if (editingQuestion.options && editingQuestion.options.length > 0) {
//         // Convert options to the format expected by mcqOptions
//         const normalizedOptions = editingQuestion.options.map((opt) => ({
//           answer: opt.text || "",
//           question_explanation: opt.explanation || "",
//           correct_or_not: opt.is_correct?.toString() || "0",
//         }));

//         // Ensure we have at least 4 options
//         while (normalizedOptions.length < 4) {
//           normalizedOptions.push(emptyOption());
//         }

//         setMcqOptions(normalizedOptions);

//         // Set correct answer
//         const correctIndex =
//           normalizedOptions.findIndex((o) => o.correct_or_not === "1") >= 0
//             ? normalizedOptions.findIndex((o) => o.correct_or_not === "1")
//             : editingQuestion.correctAnswer || 0;

//         setMcqCorrectAnswer(correctIndex >= 0 ? correctIndex : 0);
//       }
//     } else if (editingQuestion.type === "paragraph_mcq") {
//       // Handle paragraph questions
//       setQuestionType("mcq");
//       setMcqSubType("passage");

//       // ✅ feed the passage editor with correct shape
//       const passageArr = convertParagraphToPassageEditor(editingQuestion);
//       setMcqPassages((prev) => ({
//         ...prev,
//         passage: passageArr,
//       }));
//     }
//   }, [editingQuestion?.id]);

//   const examIdForSections =
//     examId || params["exam-id"] || params.examId || openExamSection?.exam_id;

//   const onSectionDeleted = (deletedSectionId) => {
//     // refresh redux list
//     if (deletedSectionId) {
//       dispatch(
//         handleGetAllExamSections({ body: { exam_id: examIdForSections } })
//       );
//     }
//   };


//   /* ===================== UI ===================== */
//   return (
//     <div className="max-w-6xl mx-auto space-y-6 p-6 bg-gray-50 min-h-screen" dir="rtl">
//       <ExamMainInfo
//         lessonId={lessonId || null}
//         add_exam_loading={add_exam_loading || edit_exam_loading}
//         exam_types={exam_types}
//         examData={examData}
//         setExamData={setExamData}
//         examInfoData={exmaInfoData}
//         handleBasicDataChange={handleBasicDataChange}
//         handleExamTypeChange={handleExamTypeChange}
//         handleSubmitBasicData={handleSubmitBasicData}
//       />

//       {(openExamSection || isEditMode) && (
//         <QuestionSections
//           onDeleteSection={onSectionDeleted}
//           editData={filteredData}
//           data={openExamQuestion}
//           examData={examData}
//           filteredSection={filteredSection}
//         />
//       )}

//       {(openExamSection || isEditMode) && !lessonId && (
//         <AssignExam lessonId={lessonId} exam={openExamSection || filteredData} />
//       )}

//       {(openExamSection && get_exam_sections_list?.data?.message?.length) ||
//       isEditMode ? (
//         <>
//           <Card title="إنشاء الأسئلة" icon={Edit3}>
//             <div className="space-y-6">
//               <QuestionTypeSelector
//                 colorMap={colorMap}
//                 questionType={questionType}
//                 onTypeChange={handleQuestionTypeChange}
//               />


//               {/* Section selector */}
//               <div className="space-y-3">
//                 <div className="flex items-center justify-between">
//                   <label className="block text-sm font-medium text-gray-700">
//                     اختر القسم لإضافة السؤال
//                   </label>
//                   {selectedSection && (
//                     <Tag color="blue">
//                       إجمالي أسئلة القسم: {getQuestionsCount(selectedSection.id)}
//                     </Tag>
//                   )}
//                 </div>

//                 <Select
//                   style={{
//                     width: "100%",
//                     height: "105%",
//                     padding: "10px 0px",
//                   }}
//                   placeholder="اختر قسمًا"
//                   value={selectedSectionId ?? undefined}
//                   onChange={(v) => setSelectedSectionId(v)}
//                   showSearch
//                   optionFilterProp="label"
//                   dropdownStyle={{ borderRadius: 12 }}
//                   options={get_exam_sections_list?.data?.message?.map((section) => ({
//                     value: section?.id,
//                     label: (
//                       <div className="flex items-start justify-between">
//                         <div className="flex-1">
//                           <div
//                             className="font-medium text-gray-800"
//                             dangerouslySetInnerHTML={{
//                               __html: section?.title,
//                             }}
//                           />
//                           {section?.description ? (
//                             <div
//                               className="text-xs text-gray-500"
//                               dangerouslySetInnerHTML={{
//                                 __html: section?.description,
//                               }}
//                             />
//                           ) : null}
//                         </div>
//                       </div>
//                     ),
//                   }))}
//                   dropdownRender={(menu) => (
//                     <div className="p-2">
//                       <div className="px-2 pb-2 text-xs text-gray-500">
//                         اختر من الأقسام المضافة بالأسفل
//                       </div>
//                       <div className="rounded-xl border">{menu}</div>
//                     </div>
//                   )}
//                 />

//                 {selectedSection && (
//                   <div className="p-4 rounded-2xl border bg-white shadow-sm ring-1 ring-transparent hover:ring-blue-100 transition">
//                     <div className="flex items-start justify-between gap-4">
//                       <div className="space-y-1">
//                         <h4
//                           className="font-semibold text-gray-800"
//                           dangerouslySetInnerHTML={{
//                             __html: selectedSection.title,
//                           }}
//                         />
//                         {selectedSection?.description ? (
//                           <p
//                             className="text-sm text-gray-600"
//                             dangerouslySetInnerHTML={{
//                               __html: selectedSection.description,
//                             }}
//                           />
//                         ) : null}
//                       </div>
//                       <div
//                         className={`mt-1 w-4 h-4 rounded-full border-2 ${
//                           selectedSectionId
//                             ? "border-blue-500 bg-blue-500"
//                             : "border-gray-300"
//                         }`}
//                         title="القسم الحالي"
//                       />
//                     </div>
//                   </div>
//                 )}
//               </div>

//               {/* MCQ types */}
//               {questionType === "mcq" && (
//                 <div className="space-y-5">
//                   <div className="flex items-center justify-between">
//                     <label className="block text-sm font-medium text-gray-700">
//                       نوع الأسئلة المتعددة
//                     </label>
//                   </div>

//                   <div className="rounded-2xl border bg-white p-3 shadow-sm">
//                     <Segmented
//                       size="large"
//                       value={mcqSubType}
//                       onChange={(v) => setMcqSubType(v)}
//                       options={[
//                         {
//                           label: (
//                             <div className="flex items-center gap-2">
//                               <ListChecks className="w-4 h-4" />
//                               <span>أسئلة عامة</span>
//                             </div>
//                           ),
//                           value: "general",
//                         },
//                         // {
//                         //   label: (
//                         //     <div className="flex items-center gap-2">
//                         //       <FlaskConical className="w-4 h-4" />
//                         //       <span>معادلات</span>
//                         //     </div>
//                         //   ),
//                         //   value: "chemical",
//                         // },
//                         {
//                           label: (
//                             <div className="flex items-center gap-2">
//                               <FileText className="w-4 h-4" />
//                               <span>قطعة</span>
//                             </div>
//                           ),
//                           value: "passage",
//                         },
//                       ]}
//                     />
//                   </div>

//                   {/* General MCQ */}
//                   {mcqSubType === "general" ? (
//                     <div className="space-y-8">
//                       {/* Question Text */}
//                       <div>
//                         <label className="block text-lg font-semibold text-gray-800 mb-4">
//                           نص السؤال
//                         </label>

//                         <LabeledEditor
//                           label="" // Hide duplicate label since we have one above
//                           value={currentQuestion}
//                           onChange={setCurrentQuestion}
//                           editorMinH={180}
//                           allowImages
//                           placeholder="اكتب نص السؤال هنا... يمكنك إضافة صور، معادلات، تنسيق..."
//                         />
//                       </div>

//                       {/* Options Section */}
//                       <div className="space-y-5">
//                         <div className="flex items-center justify-between mb-5">
//                           <label className="text-lg font-semibold text-gray-800">
//                             خيارات الإجابة
//                           </label>
//                           <span className="text-sm text-gray-500">
//                             يجب تحديد إجابة صحيحة واحدة فقط
//                           </span>
//                         </div>

//                         <div className="space-y-6">
//                           {mcqOptions.map((option, index) => {
//                             const letter = String.fromCharCode(1632 + index + 1); // Arabic numerals: ١, ٢, ٣...
//                             const isCorrect = mcqCorrectAnswer === index;

//                             return (
//                               <div
//                                 key={index}
//                                 className={`relative overflow-hidden rounded-3xl border-2 transition-all duration-300 ${
//                                   isCorrect
//                                     ? "border-green-400 bg-green-50/50 shadow-lg shadow-green-100"
//                                     : "border-gray-200 bg-white shadow-md"
//                                 }`}
//                               >
//                                 {/* Header with letter, correct indicator, and delete */}
//                                 <div className="flex items-center justify-between p-5 bg-gradient-to-r from-transparent to-transparent">
//                                   <div className="flex items-center gap-4">
//                                     {/* Letter Circle */}
//                                     <div
//                                       className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-lg font-bold shadow-md transition-colors ${
//                                         isCorrect
//                                           ? "bg-green-600 text-white"
//                                           : "bg-gray-100 text-gray-700"
//                                       }`}
//                                     >
//                                       {letter}
//                                     </div>

//                                     {/* Correct Answer Radio */}
//                                     <label className="flex items-center gap-3 cursor-pointer">
//                                       <input
//                                         type="radio"
//                                         name="correctAnswer"
//                                         checked={isCorrect}
//                                         onChange={() => setMcqCorrectAnswer(index)}
//                                         className="h-5 w-5 text-green-600 focus:ring-green-500"
//                                       />
//                                       <span className="font-medium text-gray-700">
//                                         {isCorrect
//                                           ? "الإجابة الصحيحة"
//                                           : "تحديد كإجابة صحيحة"}
//                                       </span>
//                                       {isCorrect && (
//                                         <span className="px-3 py-1 text-xs font-bold text-green-700 bg-green-200 rounded-full">
//                                           ✓ صحيحة
//                                         </span>
//                                       )}
//                                     </label>
//                                   </div>

//                                   {/* Delete Button - hidden if only 2 options */}
//                                   {mcqOptions.length > 2 && (
//                                     <button
//                                       type="button"
//                                       onClick={() => removeMcqOption(index)}
//                                       className="p-2 text-red-600 rounded-xl hover:bg-red-50 transition-colors"
//                                       title="حذف هذا الخيار"
//                                     >
//                                       <Trash2 className="w-5 h-5" />
//                                     </button>
//                                   )}
//                                 </div>

//                                 {/* Option Content */}
//                                 <div className="px-6 pb-6 space-y-6 border-t border-gray-100">
//                                   {/* Option Text */}
//                                   <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-3">
//                                       نص الخيار
//                                     </label>

//                                     <LabeledEditor
//                                       label=""
//                                       value={option.answer}
//                                       onChange={(v) => updateMcqOption(index, "answer", v)}
//                                       editorMinH={130}
//                                       allowImages
//                                       placeholder="اكتب نص الخيار هنا..."
//                                     />
//                                   </div>

//                                   {/* Explanation */}
//                                   <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
//                                       شرح الخيار
//                                       <span className="text-xs font-normal text-gray-500">
//                                         (يظهر بعد الإجابة في وضع المراجعة)
//                                       </span>
//                                     </label>
//                                     <LabeledEditor
//                                       label=""
//                                       value={option.question_explanation}
//                                       onChange={(v) =>
//                                         updateMcqOption(index, "question_explanation", v)
//                                       }
//                                       editorMinH={100}
//                                       allowImages
//                                       placeholder="اشرح لماذا هذا الخيار صحيح أو خاطئ... (اختياري لكن موصى به)"
//                                     />
//                                   </div>
//                                 </div>
//                               </div>
//                             );
//                           })}
//                         </div>

//                         {/* Add Option Button */}
//                         <div className="flex justify-center pt-4">
//                           <button
//                             type="button"
//                             onClick={addMcqOption}
//                             className="inline-flex items-center gap-3 px-6 py-3 text-sm font-medium text-blue-700 bg-blue-50 rounded-2xl hover:bg-blue-100 hover:shadow-md transition-all shadow-sm border border-blue-200"
//                           >
//                             <PlusIcon className="w-5 h-5" />
//                             إضافة خيار جديد
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   ) : (
//                     <McqSharedPassageEditor
//                       key={`${mcqSubType}:${editingQuestion?.id ?? "new"}`}
//                       mcqSubType={mcqSubType}
//                       // ✅ IMPORTANT: don’t pass [] (truthy) and block editingQuestion
//                       initialData={
//                         mcqPassages?.[mcqSubType]?.length
//                           ? mcqPassages[mcqSubType]
//                           : editingQuestion
//                       }
//                       onPassagesChange={handleMcqPassagesChange}
//                     />
//                   )}
//                 </div>
//               )}

//               {/* Non-MCQ */}
//               {questionType === "trueFalse" && (
//                 <TrueFalseQuestions
//                   questionHtml={currentQuestion}
//                   setQuestionHtml={setCurrentQuestion}
//                   trueFalseExplanation={trueFalseExplanation}
//                   trueFalseAnswer={trueFalseAnswer}
//                   setTrueFalseAnswer={setTrueFalseAnswer}
//                   setTrueFalseExplanation={setTrueFalseExplanation}
//                 />
//               )}

//               {/* Sticky action bar */}
//               <div className="pt-4 border-t sticky bottom-0 bg-gray-50/75 backdrop-blur z-10">
//                 <button
//                   onClick={addOrUpdateQuestion}
//                   disabled={
//                     add_question_loading ||
//                     !selectedSectionId ||
//                     (questionType !== "mcq" && !currentQuestion) ||
//                     (examData.type === "mock" &&
//                       !canAddMoreQuestions(selectedSectionId))
//                   }
//                   className="w-full inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-200 bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 px-4 py-3 disabled:opacity-60 disabled:cursor-not-allowed"
//                 >
//                   {editingQuestion ? (
//                     <Save className="h-4 w-4" />
//                   ) : (
//                     <PlusIcon className="h-4 w-4" />
//                   )}
//                   {editingQuestion
//                     ? "تحديث السؤال"
//                     : add_question_loading
//                     ? "جاري الحفظ..."
//                     : "إضافة السؤال"}
//                 </button>
//                 {examData.type === "mock" && selectedSectionId && (
//                   <p className="text-sm text-gray-500 mt-2 text-center">
//                     {getQuestionsCount(selectedSectionId)}/24 سؤال في هذا القسم
//                   </p>
//                 )}
//               </div>
//             </div>
//           </Card>

//           {/* Questions list */}
//           {
//             <DisplayQuestions
//               selectedSection={selectedSectionData}
//               setEditingQuestion={setEditingQuestion}
//               editingQuestion={editQuestion}
//               selectedSectionId={selectedSectionId}
//             />
//           }
//         </>
//       ) : (
//         <div className="text-center py-12">
//           <div className="bg-blue-50 p-6 rounded-full w-20 h-20 mx-auto flex items-center justify-center mb-4">
//             <BookOpen className="h-10 w-10 text-blue-600" />
//           </div>
//           <h3 className="text-lg font-medium text-gray-900 mb-2">
//             ابدأ بإنشاء اختبار جديد
//           </h3>
//           <p className="text-gray-600 mb-6">
//             املأ معلومات الاختبار الأساسية وأضف الأقسام لبدء إنشاء الأسئلة
//           </p>
//         </div>
//       )}

//       {/* Add video / pdf */}
//       {/* <AddExamVideoModal
//         open={openExamVideoModal}
//         setOpen={setOpenExamVideoModal}
//         exam_id={examid || examId || openExamSection?.id}
//         type="exam"
//       /> */}

//       {/* <AddExamPdfModal
//         open={openExamPdfModal}
//         setOpen={setOpenExamPdfModal}
//         exam_id={examid || examId || openExamSection?.id}
//         type="exam"
//       /> */}

//       {/* Edit video / pdf */}
//       {/* <EditExamVideoModal
//         open={openEditExamVideo}
//         setOpen={setOpenEditExamVideo}
//         rowData={videoRowData}
//         setRowData={setVideoRowData}
//         exam_id={examid || examId || openExamSection?.id}
//       /> */}

//       {/* <EditExamPdfModal
//         pdfData={pdfRowData}
//         open={openEditExamPdf}
//         setOpen={setOpenEditExamPdf}
//         rowData={pdfRowData}
//         setRowData={setPdfRowData}
//         exam_id={examid || examId || openExamSection?.id}
//       /> */}

//       {/* Delete video / pdf */}
//       {/* <DeleteExamPdfModal
//         open={openDeleteExamPdf}
//         setOpen={setOpenDeleteExamPdf}
//         id={examid || examId || openExamSection?.id}
//         rowData={pdfRowData}
//         setRowData={setPdfRowData}
//       /> */}

//       {/* <DeleteExamVideoModal
//         open={openDeleteExamVideo}
//         setOpen={setOpenDeleteExamVideo}
//         rowData={videoRowData}
//         setRowData={setVideoRowData}
//         id={examid || examId || openExamSection?.id}
//       /> */}
//     </div>
//   );
// }

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
} from "../../lib/features/examSlice";

import { toast } from "react-toastify";
import AssignExam from "./AssignExam";
import { useParams, useSearchParams } from "next/navigation";

/* helpers */
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

  // ✅ prevent “re-hydrating” form while you type
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
    emptyOption(),
    emptyOption(),
  ]);
  const [mcqCorrectAnswer, setMcqCorrectAnswer] = useState(0);

  const [mcqSubType, setMcqSubType] = useState("general");
  const [mcqPassages, setMcqPassages] = useState({ chemical: [], passage: [] });

  const {
    add_exam_loading,
    edit_exam_loading,
    all_exam_list,
    get_exam_sections_list,
    add_question_loading,
    all_exam_data_list,
  } = useSelector((state) => state?.exam);

  const [exmaInfoData, setExamInfoData] = useState({
    title: "",
    description: "",
    free: 0,
    time: "",
    date: "",
    type: "mock",
    level: "medium",
    success_percentage: 0,
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
    if (examData?.sections?.length > 0 && !selectedSectionId) {
      setSelectedSectionId(examData.sections[0].id);
    }
  }, [examData?.sections, selectedSectionId]);

  useEffect(() => {
    if (!selectedSectionId) return;
    const filtered = get_exam_sections_list?.data?.message?.find(
      (item) => item?.id == selectedSectionId
    );
    if (filtered) setSelectedSectionData(filtered);
  }, [selectedSectionId, get_exam_sections_list]);

  useEffect(() => {
    dispatch(handleGetAllExams({ page, per_page: pageSize })).unwrap().catch(() => {});
  }, [dispatch, params["exam-id"], page, pageSize]);

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
        success_percentage: filteredItem?.success_percentage,
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


      console.log(filteredItem);
      
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
        success_percentage: filteredItem?.success_percentage,
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
    dispatch(handleGetAllExamData({ body: { id: examid || examId } }));
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
    if (field === "time") {
      // allow empty
      if (value === "") {
        setExamInfoData((prev) => ({ ...prev, time: "" }));
        return;
      }

      // allow gradual typing (no toast spam)
      if (!timeRegexPartial.test(value)) return;

      // prevent insane long strings
      if (value.length > 8) return;

      setExamInfoData((prev) => ({ ...prev, time: value }));
      return;
    }

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

    if (!exmaInfoData?.date) {
      toast.warn("اختر تاريخ أولا");
      return;
    }

    // ✅ validate time only if user filled it
    if (exmaInfoData?.time?.trim()) {
      if (!timeRegexFinal.test(exmaInfoData.time.trim())) {
        toast.warn("الوقت لازم يكون بالشكل: HH:MM:SS أو MM:SS");
        return;
      }
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
        type: lessonId ? "intern" : exmaInfoData?.type,
        success_percentage: exmaInfoData?.success_percentage,
      };

      dispatch(handleEditExam({ body: data_send }))
        .unwrap()
        .then((res) => {
          if (res?.data?.status == "success") {
            toast.success("تم تعديل الاختبار بنجاح!");
            setExamId(res?.data?.message?.id);
          } else {
            toast.error("هناك خطأ أثناء تعديل الاختبار");
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
        type: lessonId ? "intern" : exmaInfoData?.type,
        success_percentage: exmaInfoData?.success_percentage,
      };

      dispatch(handleCreateExam({ body: data_send }))
        .unwrap()
        .then((res) => {
          if (res?.data?.status == "success") {
            toast.success("تم إضافة الاختبار بنجاح!");
            setOpenExamSection(res?.data?.message);

            const createdId = res?.data?.message?.id;
            setExamId(createdId);

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

    lastLoadedEditIdRef.current = null;
  };

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
    const exSectionId =
      res?.data?.message?.exam_section_id ||
      res?.data?.message?.paragraph?.exam_section_id ||
      res?.data?.message?.questions?.[0]?.exam_section_id ||
      res?.data?.message?.paragraph?.[0]?.exam_section_id ||
      selectedSectionId;

    if (!exSectionId) return;

    await dispatch(handleGetExamQuestions({ body: { exam_section_id: exSectionId } }));
  };

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
    const canAdd = (count = 1) => !isMock || currentCount + count <= maxPerSection;

    // ========== EDIT MODE ==========
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
              instructions: "اختر الإجابة الصحيحة",
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
        const result = await dispatch(handleUpdateExamQuestions({ body: payload })).unwrap();

        if (result?.data?.status === "success") {
          toast.success("تم تحديث السؤال بنجاح");
          await refreshAfterAdd(result);

          // optional optimistic update
          setExamData((prev) => ({
            ...prev,
            sections: prev.sections.map((s) =>
              s.id === selectedSectionId
                ? {
                    ...s,
                    questions: (s.questions || []).map((q) =>
                      q.id === editingQuestion.id ? { ...q, ...payload } : q
                    ),
                  }
                : s
            ),
          }));

          resetQuestionForm();
        } else {
          toast.error(result?.data?.message || "فشل تحديث السؤال");
        }
      } catch (error) {
        toast.error(error?.message || "فشل تحديث السؤال");
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
            instructions: "اختر الإجابة الصحيحة",
          });

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

      if (!canAdd(flatQuestions.length)) {
        toast.error("الحد الأقصى 24 سؤال لكل قسم في الاختبار المحاكي");
        return;
      }

      // optimistic UI
      setExamData((prev) => ({
        ...prev,
        sections: prev.sections.map((s) =>
          s.id === selectedSectionId
            ? { ...s, questions: [...(s.questions || []), ...flatQuestions] }
            : s
        ),
      }));
      resetQuestionForm();

      try {
        for (const payload of paragraphPayloads) {
          const res = await dispatch(handleAddQuestion({ body: payload })).unwrap();
          if (res?.data?.status === "success") {
            toast.success("تم اضافة السؤال بنجاح");
            await refreshAfterAdd(res);
          } else {
            toast.error(res?.data?.message || "فشل حفظ أسئلة الفقرة");
            return;
          }
        }
      } catch (err) {
        toast.error(err?.message || "فشل حفظ أسئلة الفقرة");
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

    // optimistic UI
    setExamData((prev) => ({
      ...prev,
      sections: prev.sections.map((s) =>
        s.id === selectedSectionId
          ? { ...s, questions: [...(s.questions || []), finalQuestion] }
          : s
      ),
    }));
    resetQuestionForm();

    try {
      const res = await dispatch(handleAddQuestion({ body: finalQuestion })).unwrap();
      if (res?.data?.status === "success") {
        toast.success("تم اضافة السؤال بنجاح");
        await refreshAfterAdd(res);
      } else {
        toast.error(res?.data?.message || "فشل حفظ السؤال");
      }
    } catch (error) {
      toast.error(error?.message || "فشل حفظ السؤال");
    }
  };

  /* ===================== Hydrate edit form ONCE ===================== */
  useEffect(() => {
    if (!editingQuestion) return;

    if (lastLoadedEditIdRef.current === editingQuestion.id) return;
    lastLoadedEditIdRef.current = editingQuestion.id;

    if (editingQuestion?.exam_section_id) setSelectedSectionId(editingQuestion.exam_section_id);

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
          editData={filteredData}
          data={openExamQuestion}
          examData={examData}
          filteredSection={filteredSection}
        />
      )}

      {/* {(openExamSection || isEditMode) && !lessonId && (
        <AssignExam lessonId={lessonId} exam={openExamSection || filteredData} />
      )} */}

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
                  <label className="block text-sm font-medium text-gray-700">
                    اختر القسم لإضافة السؤال
                  </label>
                  {selectedSection && (
                    <Tag color="blue">إجمالي أسئلة القسم: {getQuestionsCount(selectedSection.id)}</Tag>
                  )}
                </div>

                <Select
                  style={{ width: "100%", height: "105%", padding: "10px 0px" }}
                  placeholder="اختر قسمًا"
                  value={selectedSectionId ?? undefined}
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
                              className="text-xs text-gray-500"
                              dangerouslySetInnerHTML={{ __html: section?.description }}
                            />
                          ) : null}
                        </div>
                      </div>
                    ),
                  }))}
                  dropdownRender={(menu) => (
                    <div className="p-2">
                      <div className="px-2 pb-2 text-xs text-gray-500">
                        اختر من الأقسام المضافة بالأسفل
                      </div>
                      <div className="rounded-xl border">{menu}</div>
                    </div>
                  )}
                />
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

                      <div className="space-y-5">
                        <div className="flex items-center justify-between mb-5">
                          <label className="text-lg font-semibold text-gray-800">
                            خيارات الإجابة
                          </label>
                          <span className="text-sm text-gray-500">
                            يجب تحديد إجابة صحيحة واحدة فقط
                          </span>
                        </div>

                        <div className="space-y-6">
                          {mcqOptions.map((option, index) => {
                            const letter = String.fromCharCode(1632 + index + 1);
                            const isCorrect = mcqCorrectAnswer === index;

                            return (
                              <div
                                key={index}
                                className={`relative overflow-hidden rounded-3xl border-2 transition-all duration-300 ${
                                  isCorrect
                                    ? "border-green-400 bg-green-50/50 shadow-lg shadow-green-100"
                                    : "border-gray-200 bg-white shadow-md"
                                }`}
                              >
                                <div className="flex items-center justify-between p-5">
                                  <div className="flex items-center gap-4">
                                    <div
                                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-lg font-bold shadow-md transition-colors ${
                                        isCorrect ? "bg-green-600 text-white" : "bg-gray-100 text-gray-700"
                                      }`}
                                    >
                                      {letter}
                                    </div>

                                    <label className="flex items-center gap-3 cursor-pointer">
                                      <input
                                        type="radio"
                                        name="correctAnswer"
                                        checked={isCorrect}
                                        onChange={() => setMcqCorrectAnswer(index)}
                                        className="h-5 w-5 text-green-600 focus:ring-green-500"
                                      />
                                      <span className="font-medium text-gray-700">
                                        {isCorrect ? "الإجابة الصحيحة" : "تحديد كإجابة صحيحة"}
                                      </span>
                                      {isCorrect && (
                                        <span className="px-3 py-1 text-xs font-bold text-green-700 bg-green-200 rounded-full">
                                          ✓ صحيحة
                                        </span>
                                      )}
                                    </label>
                                  </div>

                                  {mcqOptions.length > 2 && (
                                    <button
                                      type="button"
                                      onClick={() => removeMcqOption(index)}
                                      className="p-2 text-red-600 rounded-xl hover:bg-red-50 transition-colors"
                                      title="حذف هذا الخيار"
                                    >
                                      <Trash2 className="w-5 h-5" />
                                    </button>
                                  )}
                                </div>

                                <div className="px-6 pb-6 space-y-6 border-t border-gray-100">
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                      نص الخيار
                                    </label>
                                    <LabeledEditor
                                      label=""
                                      value={option.answer}
                                      onChange={(v) => updateMcqOption(index, "answer", v)}
                                      editorMinH={130}
                                      allowImages
                                      placeholder="اكتب نص الخيار هنا..."
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                                      شرح الخيار
                                      <span className="text-xs font-normal text-gray-500">
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
                            className="inline-flex items-center gap-3 px-6 py-3 text-sm font-medium text-blue-700 bg-blue-50 rounded-2xl hover:bg-blue-100 hover:shadow-md transition-all shadow-sm border border-blue-200"
                          >
                            <PlusIcon className="w-5 h-5" />
                            إضافة خيار جديد
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <McqSharedPassageEditor
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
                  questionHtml={currentQuestion}
                  setQuestionHtml={setCurrentQuestion}
                  modalAnswer={modalAnswer}
                  setModalAnswer={setModalAnswer}
                />
              )}

              {questionType === "complete" && (
                <CompleteQuestions
                  completeText={completeText}
                  setCompleteText={setCompleteText}
                  completeAnswers={completeAnswers}
                  setCompleteAnswers={setCompleteAnswers}
                />
              )}

              {/* Sticky action bar */}
              <div className="pt-4 border-t sticky bottom-0 bg-gray-50/75 backdrop-blur z-10">
                <button
                  type="button"
                  onClick={addOrUpdateQuestion}
                  disabled={
                    add_question_loading ||
                    !selectedSectionId ||
                    (questionType !== "mcq" && !currentQuestion) ||
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

