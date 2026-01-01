// // "use client";

// // import React, { useMemo, useState, useEffect } from "react";
// // import {
// //   Edit3,
// //   Trash2,
// //   Save,
// //   X,
// //   ChevronDown,
// //   ChevronUp,
// //   FileText,
// //   List,
// //   Plus,
// //   Minus,
// //   AlertCircle,
// //   CheckCircle,
// //   XCircle,
// // } from "lucide-react";
// // import {
// //   Empty,
// //   Spin,
// //   Tag,
// //   Button,
// //   Modal,
// //   Divider,
// //   Tooltip,
// //   Space,
// //   Alert,
// //   Card as AntCard,
// //   Badge,
// //   Collapse,
// //   Popconfirm,
// //   Radio,
// // } from "antd";
// // import { useDispatch, useSelector } from "react-redux";
// // import dynamic from "next/dynamic";
// // import Card from "./ExamCard";
// // import {
// //   handleDeleteExamQuestions,
// //   handleGetExamQuestions,
// //   handleUpdateExamQuestions,
// //   handleEditParagraph,
// //   handleDeleteParagraph,
// //   handleAddParagraphQuestion,
// // } from "../../lib/features/examSlice";
// // import { toast } from "react-toastify";

// // const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
// // import "react-quill-new/dist/quill.snow.css";

// // const { Panel } = Collapse;

// // export default function DisplayQuestions({
// //   selectedSectionId,
// //   selectedSection,
// // }) {
// //   const dispatch = useDispatch();

// //   const {
// //     get_exam_questions_list,
// //     get_exam_question_loading,
// //     delete_question_loading,
// //     edit_question_loading,
// //     edit_paragraph_loading,
// //     delete_paragraph_loading,
// //     create_question_loading,
// //   } = useSelector((state) => state?.exam);

// //   // =========================
// //   // Helpers
// //   // =========================
// //   const stripHtml = (html = "") =>
// //     String(html)
// //       .replace(/<[^>]*>/g, " ")
// //       .replace(/&nbsp;/g, " ")
// //       .replace(/\s+/g, " ")
// //       .trim();

// //   const isHtmlEmpty = (html) => stripHtml(html).length === 0;

// //   const makeTempId = (prefix = "temp") =>
// //     `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;

// //   // =========================
// //   // UI State
// //   // =========================
// //   const [expandedQuestions, setExpandedQuestions] = useState({});
// //   const [editingQuestionId, setEditingQuestionId] = useState(null);
// //   const [editingType, setEditingType] = useState(null);

// //   // MCQ editing
// //   const [editingContent, setEditingContent] = useState("");
// //   const [editingOptions, setEditingOptions] = useState([]);
// //   const [editingCorrectAnswer, setEditingCorrectAnswer] = useState(0);

// //   // T/F editing
// //   const [editingTFContent, setEditingTFContent] = useState("");
// //   const [editingTFAnswer, setEditingTFAnswer] = useState(true); // true or false
// //   const [editingTFExplanation, setEditingTFExplanation] = useState("");

// //   // Paragraph editing
// //   const [editingParagraphContent, setEditingParagraphContent] = useState("");
// //   const [editingParagraphQuestions, setEditingParagraphQuestions] = useState([]);

// //   // Add question to existing paragraph modal
// //   const [addingQuestionToParagraph, setAddingQuestionToParagraph] = useState(null);
// //   const [newParagraphQuestionText, setNewParagraphQuestionText] = useState("");
// //   const [newParagraphQuestionOptions, setNewParagraphQuestionOptions] = useState([
// //     { id: makeTempId("opt"), text: "", explanation: "", isCorrect: true },
// //     { id: makeTempId("opt"), text: "", explanation: "", isCorrect: false },
// //   ]);

// //   // Delete modals
// //   const [deleteModal, setDeleteModal] = useState(false);
// //   const [questionToDelete, setQuestionToDelete] = useState(null);

// //   // =========================
// //   // Init expands from API
// //   // =========================
// //   useEffect(() => {
// //     if (!get_exam_questions_list) return;

// //     const initial = {};
// //     (get_exam_questions_list?.data?.message?.mcq || []).forEach(
// //       (q) => (initial[`mcq-${q.id}`] = false)
// //     );
// //     (get_exam_questions_list?.data?.message?.paragraphs || []).forEach(
// //       (p) => (initial[`paragraph-${p.paragraph.id}`] = false)
// //     );
// //     setExpandedQuestions(initial);
// //   }, [get_exam_questions_list]);

// //   const quillModules = {
// //     toolbar: [
// //       [{ header: [1, 2, 3, false] }],
// //       ["bold", "italic", "underline"],
// //       [{ list: "ordered" }, { list: "bullet" }],
// //       ["link"],
// //     ],
// //   };

// //   const quillFormats = [
// //     "header",
// //     "bold",
// //     "italic",
// //     "underline",
// //     "list",
// //     "bullet",
// //     "link",
// //   ];

// //   const apiQuestions = useMemo(() => {
// //     console.log("get_exam_questions_list", get_exam_questions_list);
// //     if (!get_exam_questions_list && !selectedSection) return [];

// //     const data = get_exam_questions_list?.data?.message || selectedSection || {
// //       mcq: [],
// //       paragraphs: [],
// //     };

// //     console.log("data", data);
// //     console.log("selectedSection", selectedSection);

// //     // Process all questions from mcq array (including t_f type)
// //     const mcqSource =
// //       data?.mcq && data?.mcq?.length > 0
// //         ? data?.mcq
// //         : data?.mcq && data?.mcq?.length
// //           ? data?.mcq
// //           : [];

// //     const allQuestions = mcqSource.map((q) => {
// //       const options = q?.options || [];

// //       if (q.question_type === "t_f") {
// //         // Handle T/F question - find which option is marked as correct
// //         // Don't check text content, just check is_correct flag
// //         const trueOption = options.find(opt => 
// //           (opt?.option_text?.toLowerCase().includes("صحيح") || 
// //            opt?.option_text?.toLowerCase().includes("صح")) &&
// //           Number(opt?.is_correct) === 1
// //         );
        
// //         const isTrue = !!trueOption; // If "صحيح" is correct, then answer is true
        
// //         console.log("T/F Question analysis:", {
// //           id: q.id,
// //           options: options,
// //           trueOptionFound: !!trueOption,
// //           isTrue: isTrue,
// //           option1: options[0]?.option_text + " - is_correct: " + options[0]?.is_correct,
// //           option2: options[1]?.option_text + " - is_correct: " + options[1]?.is_correct
// //         });

// //         return {
// //           id: q.id,
// //           type: "t_f", // Use t_f type for T/F questions
// //           question: q?.question_text || "",
// //           correctAnswer: isTrue,
// //           options: options.map((opt) => ({
// //             id: opt?.id,
// //             text: opt.option_text || "",
// //             explanation: opt.question_explanation || "",
// //             isCorrect: Number(opt?.is_correct) === 1,
// //           })),
// //           rawData: q,
// //         };
// //       } else {
// //         // Handle regular MCQ
// //         const correctIndex = options.findIndex(
// //           (opt) => Number(opt?.is_correct) === 1
// //         );

// //         return {
// //           id: q.id,
// //           type: "mcq",
// //           question: q?.question_text || "",
// //           correctAnswer: correctIndex >= 0 ? correctIndex : 0,
// //           options: options.map((opt) => ({
// //             id: opt?.id,
// //             text: opt.option_text || "",
// //             explanation: opt.question_explanation || "",
// //             isCorrect: Number(opt?.is_correct) === 1,
// //           })),
// //           rawData: q,
// //         };
// //       }
// //     });

// //     console.log("allQuestions", allQuestions);

// //     // Process Paragraph questions
// //     const paragraphSource =
// //       data?.paragraphs && data?.paragraphs?.length
// //         ? data?.paragraphs
// //         : data?.paragraphs || [];

// //     const paragraphs = paragraphSource.map((p) => ({
// //       id: p?.paragraph?.id,
// //       type: "paragraph_mcq",
// //       paragraphContent: p?.paragraph?.paragraph_content || "",
// //       questions: (p?.questions || []).map((q) => ({
// //         id: q?.id,
// //         questionText: q?.question_text || "",
// //         options: (q?.options || []).map((opt) => ({
// //           id: opt?.id,
// //           text: opt?.option_text || "",
// //           explanation: opt?.question_explanation || "",
// //           isCorrect: Number(opt?.is_correct) === 1,
// //         })),
// //         rawData: q,
// //       })),
// //       rawData: p,
// //     }));

// //     return [...allQuestions, ...paragraphs];
// //   }, [get_exam_questions_list, selectedSection, selectedSectionId]);

// //   // =========================
// //   // CSS class for text wrapping
// //   // =========================
// //   const textWrapClass = "break-words whitespace-normal overflow-hidden max-w-full [&_*]:break-words [&_*]:whitespace-normal  px-4";

// //   // =========================
// //   // Expand/collapse helpers
// //   // =========================
// //   const toggleQuestion = (id, type) => {
// //     const key = `${type === "mcq" ? "mcq" : type === "t_f" ? "t_f" : "paragraph"}-${id}`;
// //     setExpandedQuestions((prevState) => {  // Change 'prev' to a named parameter
// //       const isCurrentlyExpanded = prevState[key] || false;

// //       // If editing and collapsing, cancel editing
// //       if (editingQuestionId === id && isCurrentlyExpanded) {
// //         cancelEditing();
// //       }

// //       return { ...prevState, [key]: !isCurrentlyExpanded };
// //     });
// //   };

// //   const isExpanded = (id, type) => {
// //     const key = `${type === "mcq" ? "mcq" : type === "t_f" ? "t_f" : "paragraph"}-${id}`;
// //     return expandedQuestions[key] || false;
// //   };

// //   // =========================
// //   // Start editing - opens collapse
// //   // =========================
// //   const startEditing = (q) => {
// //     console.log("Starting edit for T/F question:", {
// //       q: q,
// //       correctAnswer: q.correctAnswer,
// //       options: q.options,
// //       rawData: q.rawData
// //     });
    
// //     if (!q || !q.id) {
// //       console.error("Invalid question object:", q);
// //       return;
// //     }

// //     // First expand the question if it's not already expanded
// //     const key = `${q.type === "mcq" ? "mcq" : q.type === "t_f" ? "t_f" : "paragraph"}-${q.id}`;
// //     if (!expandedQuestions[key]) {
// //       setExpandedQuestions(prev => ({ ...prev, [key]: true }));
// //     }

// //     setEditingQuestionId(q.id);
// //     setEditingType(q.type);

// //     if (q.type === "mcq") {
// //       setEditingContent(q.question || "");
// //       setEditingOptions((q.options || []).map((opt) => ({ ...opt })));

// //       const correctIndex = (q.options || []).findIndex((o) => !!o.isCorrect);
// //       const safeIndex = correctIndex >= 0 ? correctIndex : (q.correctAnswer ?? 0);
// //       setEditingCorrectAnswer(safeIndex);

// //       setEditingOptions((prev) =>
// //         (prev || []).map((o, idx) => ({ ...o, isCorrect: idx === safeIndex }))
// //       );
// //     } else if (q.type === "t_f") {
// //       console.log("Editing T/F question details:", {
// //         question: q.question,
// //         correctAnswer: q.correctAnswer,
// //         options: q.options,
// //         correctOption: q.options?.find(opt => opt.isCorrect)
// //       });
      
// //       setEditingTFContent(q.question || "");
      
// //       // Determine correct answer from options
// //       let correctAnswer = true; // default
      
// //       if (q.options && q.options.length >= 2) {
// //         // Find which option is marked as correct
// //         const correctOption = q.options.find(opt => opt.isCorrect);
// //         if (correctOption) {
// //           // Check if the correct option is "صحيح" (true) or "خطأ" (false)
// //           const optionText = correctOption.text?.toLowerCase() || "";
// //           correctAnswer = optionText.includes("صحيح") || optionText.includes("صح");
// //         }
// //       }
      
// //       console.log("Setting editingTFAnswer to:", correctAnswer);
// //       setEditingTFAnswer(correctAnswer);
      
// //       // Get explanation from any option (they should all have the same explanation)
// //       const explanation = q.options?.find(opt => opt.explanation)?.explanation || "";
// //       setEditingTFExplanation(explanation);
// //     } else if (q.type === "paragraph_mcq") {
// //       setEditingParagraphContent(q.paragraphContent || "");
// //       // Initialize with isEditing set to false for all questions
// //       setEditingParagraphQuestions(
// //         (q.questions || []).map((pq) => ({
// //           id: pq.id,
// //           questionText: pq.questionText || "",
// //           options: (pq.options || []).map((opt) => ({ ...opt })),
// //           rawData: pq.rawData,
// //           isEditing: false // Initialize as false
// //         }))
// //       );
// //     }
// //   };

// //   const startEditingParagraphQuestion = (paragraph, questionIndex) => {
// //     // First, enter edit mode for the paragraph
// //     startEditing(paragraph);

// //     // Then, after a short delay, enable edit mode for the specific question
// //     setTimeout(() => {
// //       setEditingParagraphQuestions(prev =>
// //         prev.map((pq, idx) => ({
// //           ...pq,
// //           isEditing: idx === questionIndex
// //         }))
// //       );
// //     }, 50);
// //   };

// //   const cancelEditing = () => {
// //     setEditingQuestionId(null);
// //     setEditingType(null);
// //     setEditingContent("");
// //     setEditingOptions([]);
// //     setEditingCorrectAnswer(0);
// //     setEditingTFContent("");
// //     setEditingTFAnswer(true);
// //     setEditingTFExplanation("");
// //     setEditingParagraphContent("");
// //     setEditingParagraphQuestions([]);
// //   };

// //   const refreshQuestions = async () => {
// //     if (selectedSectionId || selectedSection) {
// //       try {
// //         await dispatch(
// //           handleGetExamQuestions({
// //             body: { exam_section_id: selectedSectionId || selectedSection?.id },
// //           })
// //         ).unwrap();

// //         // Reset expansion states
// //         const initial = {};
// //         if (get_exam_questions_list?.data?.message?.mcq) {
// //           get_exam_questions_list.data.message.mcq.forEach(
// //             (q) => (initial[`mcq-${q.id}`] = false)
// //           );
// //         }
// //         if (get_exam_questions_list?.data?.message?.paragraphs) {
// //           get_exam_questions_list.data.message.paragraphs.forEach(
// //             (p) => (initial[`paragraph-${p.paragraph.id}`] = false)
// //           );
// //         }
// //         setExpandedQuestions(initial);

// //         // Also reset editing state
// //         cancelEditing();

// //       } catch (error) {
// //         console.error("Error refreshing questions:", error);
// //       }
// //     }
// //   };

// //   useEffect(() => {
// //     refreshQuestions();
// //   }, [selectedSection, selectedSectionId]);

// //   // Add this effect to watch for editing completion and refresh
// //   // useEffect(() => {
// //   //   if (!edit_question_loading && editingQuestionId) {
// //   //     refreshQuestions();      
// //   //   }
// //   // }, [edit_question_loading, editingQuestionId]);

// //   // // Also add this to refresh when question is deleted
// //   // useEffect(() => {
// //   //   if (!delete_question_loading && !delete_paragraph_loading) {
// //   //     refreshQuestions();
// //   //   }
// //   // }, [delete_question_loading, delete_paragraph_loading]);

// //   // =========================
// //   // Add/Remove options functions
// //   // =========================
// //   const addOptionToMCQ = () => {
// //     setEditingOptions(prev => [
// //       ...prev,
// //       { id: makeTempId("opt"), text: "", explanation: "", isCorrect: false }
// //     ]);
// //   };

// //   const removeOptionFromMCQ = (index) => {
// //     if (editingOptions.length <= 2) {
// //       toast.error("يجب أن يكون هناك خياران على الأقل");
// //       return;
// //     }

// //     // If removing the correct answer, make the first option correct
// //     const isRemovingCorrect = editingOptions[index].isCorrect;
// //     const newOptions = editingOptions.filter((_, i) => i !== index);

// //     if (isRemovingCorrect && newOptions.length > 0) {
// //       newOptions[0].isCorrect = true;
// //       setEditingCorrectAnswer(0);
// //     } else if (index < editingCorrectAnswer) {
// //       // Adjust correct answer index if removed option was before it
// //       setEditingCorrectAnswer(editingCorrectAnswer - 1);
// //     }

// //     setEditingOptions(newOptions);
// //   };

// //   const addOptionToParagraphQuestion = (questionIndex) => {
// //     setEditingParagraphQuestions(prev => {
// //       const copy = [...prev];
// //       const qCopy = { ...copy[questionIndex] };
// //       qCopy.options = [
// //         ...qCopy.options,
// //         { id: makeTempId("opt"), text: "", explanation: "", isCorrect: false }
// //       ];
// //       copy[questionIndex] = qCopy;
// //       return copy;
// //     });
// //   };

// //   const removeOptionFromParagraphQuestion = (questionIndex, optionIndex) => {
// //     setEditingParagraphQuestions(prev => {
// //       const copy = [...prev];
// //       const qCopy = { ...copy[questionIndex] };

// //       if (qCopy.options.length <= 2) {
// //         toast.error("يجب أن يكون هناك خياران على الأقل");
// //         return prev;
// //       }

// //       // If removing the correct answer, make the first option correct
// //       const isRemovingCorrect = qCopy.options[optionIndex].isCorrect;
// //       const newOptions = qCopy.options.filter((_, i) => i !== optionIndex);

// //       if (isRemovingCorrect && newOptions.length > 0) {
// //         newOptions[0].isCorrect = true;
// //       }

// //       qCopy.options = newOptions;
// //       copy[questionIndex] = qCopy;
// //       return copy;
// //     });
// //   };

// //   // =========================
// //   // Save MCQ (update)
// //   // =========================
// //   const handleSaveMCQ = async (q) => {
// //     if (isHtmlEmpty(editingContent)) {
// //       toast.error("يرجى إدخال نص السؤال");
// //       return;
// //     }

// //     const hasCorrect = (editingOptions || []).some((o) => !!o.isCorrect);
// //     if (!hasCorrect) {
// //       toast.error("يرجى تحديد إجابة صحيحة");
// //       return;
// //     }

// //     // Check if all options have text
// //     const anyEmptyOpt = editingOptions.some((o) => isHtmlEmpty(o.text));
// //     if (anyEmptyOpt) {
// //       toast.error("يرجى إدخال نص لكل خيار");
// //       return;
// //     }

// //     const payload = {
// //       id: q.id,
// //       question_text: editingContent,
// //       instructions: "Read carefully before answering",
// //       mcq_array: (editingOptions || []).map((opt) => ({
// //         answer: opt?.text || "",
// //         question_explanation: opt?.explanation || "",
// //         correct_or_not: opt?.isCorrect ? "1" : "0",
// //       })),
// //     };

// //     try {
// //       const res = await dispatch(handleUpdateExamQuestions({ body: payload })).unwrap();

// //       if (res?.data?.status === "success") {
// //         toast.success("تم تعديل السؤال بنجاح");
// //         refreshQuestions();
// //         cancelEditing();
// //       } else {
// //         toast.error(res?.data?.message || "فشل تعديل السؤال");
// //       }
// //     } catch (e) {
// //       toast.error("حصل خطأ أثناء تعديل السؤال");
// //     }
// //   };

// //   // =========================
// //   // Save T/F question
// //   // =========================
// //   const handleSaveTF = async (q) => {
// //     if (isHtmlEmpty(editingTFContent)) {
// //       toast.error("يرجى إدخال نص السؤال");
// //       return;
// //     }

// //     // T/F questions have two options: صحيح and خطأ
// //     const trueOption = {
// //       answer: "صحيح",
// //       correct_or_not: editingTFAnswer ? "1" : "0",
// //       question_explanation: editingTFExplanation || "",
// //     };

// //     const falseOption = {
// //       answer: "خطأ",
// //       correct_or_not: !editingTFAnswer ? "1" : "0",
// //       question_explanation: editingTFExplanation || "",
// //     };

// //     const payload = {
// //       id: q.id,
// //       question_text: editingTFContent,
// //       instructions: "اختر الإجابة الصحيحة",
// //       question_type: "t_f", // Set question_type to t_f
// //       mcq_array: [trueOption, falseOption],
// //     };

// //     try {
// //       const res = await dispatch(handleUpdateExamQuestions({ body: payload })).unwrap();

// //       if (res?.data?.status === "success") {
// //         toast.success("تم تعديل السؤال بنجاح");
        
// //         // Force immediate state update
// //         cancelEditing();
        
// //         // Close the expanded view
// //         const key = `t_f-${q.id}`;
// //         setExpandedQuestions(prev => ({ ...prev, [key]: false }));        
// //         // Refresh after a short delay to ensure API has updated
// //           refreshQuestions();
        
// //       } else {
// //         toast.error(res?.data?.message || "فشل تعديل السؤال");
// //       }
// //     } catch (e) {
// //       toast.error("حصل خطأ أثناء تعديل السؤال");
// //     }
// //   };

// //   // =========================
// //   // Save paragraph question (update)
// //   // =========================
// //   const handleSaveParagraph = async (pq) => {
// //     // Extract question from the editing state
// //     const editingQuestion = editingParagraphQuestions.find(q => q.id === pq.id);
// //     if (!editingQuestion) return;

// //     if (isHtmlEmpty(editingQuestion.questionText)) {
// //       toast.error("يرجى إدخال نص السؤال");
// //       return;
// //     }

// //     const hasCorrect = (editingQuestion?.options || []).some((o) => !!o.isCorrect);
// //     if (!hasCorrect) {
// //       toast.error("يرجى تحديد إجابة صحيحة واحدة على الأقل");
// //       return;
// //     }

// //     // Check if all options have text
// //     const anyEmptyOpt = (editingQuestion?.options || []).some((o) => isHtmlEmpty(o.text));
// //     if (anyEmptyOpt) {
// //       toast.error("يرجى إدخال نص لكل خيار");
// //       return;
// //     }

// //     const payload = {
// //       id: editingQuestion?.rawData?.id,
// //       question_text: editingQuestion?.questionText,
// //       instructions: "Read carefully before answering",
// //       mcq_array: (editingQuestion?.options || []).map((opt) => ({
// //         answer: opt.text,
// //         correct_or_not: opt.isCorrect ? "1" : "0",
// //         question_explanation: opt.explanation || "",
// //       })),
// //     };

// //     try {
// //       const res = await dispatch(handleUpdateExamQuestions({ body: payload })).unwrap();

// //       if (res?.data?.status === "success") {
// //         toast.success("تم تعديل السؤال بنجاح");
// //         // Turn off editing mode for this question
// //         setEditingParagraphQuestions(prev =>
// //           prev.map(q =>
// //             q.id === pq.id
// //               ? { ...q, isEditing: false }
// //               : q
// //           )
// //         );
// //         refreshQuestions();
// //       } else {
// //         toast.error(res?.data?.message || "فشل تعديل السؤال");
// //       }
// //     } catch (e) {
// //       toast.error("حصل خطأ أثناء تعديل السؤال");
// //     }
// //   };

// //   // =========================
// //   // Start adding question to paragraph
// //   // =========================
// //   const startAddingQuestionToParagraph = (paragraph) => {
// //     setAddingQuestionToParagraph(paragraph);
// //     setNewParagraphQuestionText("");
// //     setNewParagraphQuestionOptions([
// //       { id: makeTempId("opt"), text: "", explanation: "", isCorrect: true },
// //       { id: makeTempId("opt"), text: "", explanation: "", isCorrect: false },
// //     ]);
// //   };

// //   // =========================
// //   // Add/Remove options in paragraph question form (modal)
// //   // =========================
// //   const addOptionToParagraphQuestionModal = () => {
// //     setNewParagraphQuestionOptions(prev => [
// //       ...prev,
// //       { id: makeTempId("opt"), text: "", explanation: "", isCorrect: false }
// //     ]);
// //   };

// //   const removeOptionFromParagraphQuestionModal = (index) => {
// //     if (newParagraphQuestionOptions.length <= 2) {
// //       toast.error("يجب أن يكون هناك خياران على الأقل");
// //       return;
// //     }

// //     // If removing the correct answer, make the first option correct
// //     const isRemovingCorrect = newParagraphQuestionOptions[index].isCorrect;
// //     const newOptions = newParagraphQuestionOptions.filter((_, i) => i !== index);

// //     if (isRemovingCorrect && newOptions.length > 0) {
// //       newOptions[0].isCorrect = true;
// //     }

// //     setNewParagraphQuestionOptions(newOptions);
// //   };

// //   // =========================
// //   // Save new question to paragraph
// //   // =========================
// //   const handleSaveNewParagraphQuestion = async () => {
// //     if (!addingQuestionToParagraph) return;

// //     if (isHtmlEmpty(newParagraphQuestionText)) {
// //       toast.error("يرجى إدخال نص السؤال");
// //       return;
// //     }

// //     const hasCorrectOption = newParagraphQuestionOptions.some((opt) => opt.isCorrect);
// //     if (!hasCorrectOption) {
// //       toast.error("يرجى تحديد إجابة صحيحة واحدة على الأقل");
// //       return;
// //     }

// //     // Check if all options have text
// //     const anyEmptyOpt = newParagraphQuestionOptions.some((o) => isHtmlEmpty(o.text));
// //     if (anyEmptyOpt) {
// //       toast.error("يرجى إدخال نص لكل خيار");
// //       return;
// //     }

// //     const payload = {
// //       paragraph_id: addingQuestionToParagraph.id,
// //       exam_section_id: selectedSectionId,
// //       question_text: newParagraphQuestionText,
// //       instructions: "Select the most appropriate answer based on the paragraph content.",
// //       mcq_array: newParagraphQuestionOptions.map((opt) => ({
// //         answer: opt.text,
// //         correct_or_not: opt.isCorrect ? "1" : "0",
// //         question_explanation: opt.explanation || "",
// //       })),
// //     };

// //     try {
// //       const res = await dispatch(handleAddParagraphQuestion({ body: payload })).unwrap();

// //       if (res?.data?.status === "success") {
// //         toast.success("تم إضافة السؤال الجديد إلى الفقرة بنجاح");
// //         refreshQuestions();
// //         setAddingQuestionToParagraph(null);
// //         setNewParagraphQuestionText("");
// //         setNewParagraphQuestionOptions([
// //           { id: makeTempId("opt"), text: "", explanation: "", isCorrect: true },
// //           { id: makeTempId("opt"), text: "", explanation: "", isCorrect: false },
// //         ]);
// //       } else {
// //         toast.error(res?.data?.message || "فشل إضافة السؤال");
// //       }
// //     } catch (e) {
// //       toast.error("حصل خطأ أثناء إضافة السؤال");
// //     }
// //   };

// //   // =========================
// //   // Handle delete - FIXED VERSION
// //   // =========================
// //   const handleDeleteAny = async () => {
// //     if (!questionToDelete) return;

// //     try {
// //       let res;

// //       if (questionToDelete.type === "mcq" || questionToDelete.type === "t_f") {
// //         res = await dispatch(
// //           handleDeleteExamQuestions({ body: { id: questionToDelete.id } })
// //         ).unwrap();
// //       } else if (questionToDelete.type === "paragraph") {
// //         res = await dispatch(
// //           handleDeleteParagraph({ body: { id: questionToDelete.id } })
// //         ).unwrap();
// //       } else if (questionToDelete.type === "paragraph_question") {
// //         // Handle deletion of individual question within paragraph
// //         res = await dispatch(
// //           handleDeleteExamQuestions({ body: { id: questionToDelete.id } })
// //         ).unwrap();
// //       }

// //       if (res?.data?.status === "success") {
// //         toast.success("تم الحذف بنجاح");

// //         // Close the modal immediately
// //         setDeleteModal(false);
// //         setQuestionToDelete(null);

// //         // Force close any expanded state for the deleted item
// //         if (questionToDelete.type === "mcq" || questionToDelete.type === "t_f") {
// //           const key = `${questionToDelete.type === "mcq" ? "mcq" : "t_f"}-${questionToDelete.id}`;
// //           setExpandedQuestions(prev => ({ ...prev, [key]: false }));
// //         } else if (questionToDelete.type === "paragraph") {
// //           const key = `paragraph-${questionToDelete.id}`;
// //           setExpandedQuestions(prev => ({ ...prev, [key]: false }));
// //         } else if (questionToDelete.type === "paragraph_question") {
// //           // If deleting a question from a paragraph, close the paragraph edit mode
// //           if (editingQuestionId === questionToDelete.paragraphId) {
// //             cancelEditing();
// //           }
// //         }

// //         // If editing the deleted item, cancel editing
// //         if (editingQuestionId === questionToDelete.id) {
// //           cancelEditing();
// //         }

// //         // Refresh immediately and wait for API
// //         await refreshQuestions();

// //       } else {
// //         toast.error(res?.data?.message || "فشل الحذف");
// //       }
// //     } catch (e) {
// //       console.error("Delete error:", e);
// //       toast.error("حصل خطأ أثناء الحذف");

// //       // Even on error, refresh to get current state
// //       refreshQuestions();
// //     } finally {
// //       // Ensure modal is closed even on error
// //       setDeleteModal(false);
// //       setQuestionToDelete(null);
// //     }
// //   };

// //   const handleEditParagraphContent = (q) => {
// //     const data_send = { id: q?.id, paragraph_content: editingParagraphContent };

// //     dispatch(handleEditParagraph({ body: data_send }))
// //       .unwrap()
// //       .then((res) => {
// //         if (res?.data?.status === "success") {
// //           toast.success("تم تعديل الفقرة بنجاح");
// //           refreshQuestions();
// //           cancelEditing();
// //         } else {
// //           toast.error(res?.data?.message || "فشل تعديل الفقرة");
// //         }
// //       })
// //       .catch(() => toast.error("حصل خطأ أثناء تعديل نص الفقرة"));
// //   };

// //   // =========================
// //   // Render Question Content (editing vs normal)
// //   // =========================
// //   useEffect(() => {
// //     console.log("editing Tf Question", editingTFAnswer)
// //   }, [editingTFAnswer])

// //   const renderQuestionContent = (q) => {
// //     const isEditing = editingQuestionId === q.id;

// //     if (isEditing) {
// //       const isMCQ = q.type === "mcq";
// //       const isTF = q.type === "t_f";
// //       const isParagraph = q.type === "paragraph_mcq";

// //       return (
// //         <div className="space-y-6">
// //           <div className="flex items-center justify-between mb-4 p-4 bg-blue-50 rounded-lg">
// //             <div className="flex items-center gap-3">
// //               <span className="font-bold text-lg">
// //                 {isMCQ ? "تعديل سؤال MCQ" : isTF ? "تعديل سؤال صح/خطأ" : "تعديل فقرة"}
// //               </span>
// //             </div>
// //             <Space>
// //               <Button onClick={cancelEditing} icon={<X className="w-4 h-4" />}>
// //                 إلغاء
// //               </Button>
// //               {isMCQ && (
// //                 <Button
// //                   type="primary"
// //                   icon={<Save className="w-4 h-4" />}
// //                   loading={edit_question_loading}
// //                   onClick={() => handleSaveMCQ(q)}
// //                 >
// //                   حفظ
// //                 </Button>
// //               )}
// //               {isTF && (
// //                 <Button
// //                   type="primary"
// //                   icon={<Save className="w-4 h-4" />}
// //                   loading={edit_question_loading}
// //                   onClick={() => handleSaveTF(q)}
// //                 >
// //                   حفظ
// //                 </Button>
// //               )}
// //             </Space>
// //           </div>

// //           {/* MCQ EDIT */}
// //           {isMCQ && (
// //             <div className="space-y-4">
// //               <div>
// //                 <label className="block text-lg font-semibold mb-2">
// //                   نص السؤال
// //                 </label>
// //                 <div className="border border-gray-300 rounded-lg">
// //                   <ReactQuill
// //                     value={editingContent}
// //                     onChange={setEditingContent}
// //                     modules={quillModules}
// //                     formats={quillFormats}
// //                     className="min-h-[120px]"
// //                   />
// //                 </div>
// //               </div>

// //               <Divider />

// //               <div className="space-y-4">
// //                 <div className="flex justify-between items-center">
// //                   <div className="flex items-center gap-3">
// //                     <label className="font-semibold">الخيارات</label>
// //                     <Button
// //                       type="dashed"
// //                       icon={<Plus className="w-4 h-4" />}
// //                       onClick={addOptionToMCQ}
// //                       size="small"
// //                     >
// //                       إضافة خيار
// //                     </Button>
// //                   </div>
// //                   <span className="text-lg text-gray-500">
// //                     اختر الإجابة الصحيحة
// //                   </span>
// //                 </div>

// //                 {editingOptions.map((opt, idx) => {
// //                   console.log("opt", opt);
// //                   return (
// //                     <div
// //                       key={opt.id}
// //                       className={`p-4 border rounded-lg relative ${editingCorrectAnswer === idx ? "border-green-400 bg-green-50" : "border-gray-300"
// //                         }`}
// //                     >
// //                       <div className="flex items-center justify-between mb-3">
// //                         <div className="flex items-center gap-3">
// //                           <input
// //                             type="radio"
// //                             checked={editingCorrectAnswer === idx}
// //                             onChange={() => {
// //                               setEditingCorrectAnswer(idx);
// //                               setEditingOptions(prev =>
// //                                 prev.map((o, ii) => ({
// //                                   ...o,
// //                                   isCorrect: ii === idx,
// //                                 }))
// //                               );
// //                             }}
// //                             className="w-5 h-5"
// //                           />
// //                           <span className="font-medium">
// //                             {editingCorrectAnswer === idx ? "إجابة صحيحة" : "تحديد كإجابة صحيحة"}
// //                           </span>
// //                         </div>
// //                         <Space>
// //                           <span className="px-3 py-1 bg-gray-100 rounded">
// //                             {String.fromCharCode(1632 + idx + 1)}
// //                           </span>
// //                           {editingOptions.length > 2 && (
// //                             <Button
// //                               danger
// //                               type="text"
// //                               icon={<Minus className="w-4 h-4" />}
// //                               onClick={() => removeOptionFromMCQ(idx)}
// //                               size="small"
// //                             />
// //                           )}
// //                         </Space>
// //                       </div>

// //                       <div className="space-y-3 pl-8">
// //                         <div>
// //                           <label className="text-lg mb-1 block">نص الخيار</label>
// //                           <div className="border border-gray-300 rounded">
// //                             <ReactQuill
// //                               value={opt.text}
// //                               onChange={(v) => {
// //                                 setEditingOptions(prev => {
// //                                   const copy = [...prev];
// //                                   copy[idx] = { ...copy[idx], text: v };
// //                                   return copy;
// //                                 });
// //                               }}
// //                               modules={quillModules}
// //                               formats={quillFormats}
// //                               className="min-h-[80px]"
// //                             />
// //                           </div>
// //                         </div>

// //                         <div>
// //                           <label className="text-lg mb-1 block">الشرح (اختياري)</label>
// //                           <div className="border border-gray-300 rounded">
// //                             <ReactQuill
// //                               value={opt.explanation}
// //                               onChange={(v) => {
// //                                 setEditingOptions(prev => {
// //                                   const copy = [...prev];
// //                                   copy[idx] = { ...copy[idx], explanation: v };
// //                                   return copy;
// //                                 });
// //                               }}
// //                               modules={quillModules}
// //                               formats={quillFormats}
// //                               className="min-h-[80px]"
// //                             />
// //                           </div>
// //                         </div>
// //                       </div>
// //                     </div>
// //                   );
// //                 }
// //                 )}

// //                 <div className="flex justify-between items-center pt-4">
// //                   <div className="text-lg text-gray-500">
// //                     <AlertCircle className="w-4 h-4 inline mr-1" />
// //                     {editingOptions.length} خيارات
// //                   </div>
// //                   <Button
// //                     type="primary"
// //                     icon={<Save className="w-4 h-4" />}
// //                     loading={edit_question_loading}
// //                     onClick={() => handleSaveMCQ(q)}
// //                   >
// //                     حفظ السؤال
// //                   </Button>
// //                 </div>
// //               </div>
// //             </div>
// //           )}

// //           {/* T/F EDIT */}
// //           {isTF && (
// //             <div className="space-y-4">
// //               <div>
// //                 <label className="block text-lg font-semibold mb-2">
// //                   نص السؤال
// //                 </label>
// //                 <div className="border border-gray-300 rounded-lg">
// //                   <ReactQuill
// //                     value={editingTFContent}
// //                     onChange={setEditingTFContent}
// //                     modules={quillModules}
// //                     formats={quillFormats}
// //                     className="min-h-[120px]"
// //                   />
// //                 </div>
// //               </div>

// //               <Divider />

// //               <div className="space-y-4">
// //                 <div className="flex justify-between items-center mb-4">
// //                   <label className="font-semibold">الإجابة الصحيحة</label>
// //                   <div className="flex gap-6">
// //                     <label className="flex items-center gap-2 cursor-pointer">
// //                       <input
// //                         type="radio"
// //                         checked={editingTFAnswer === true}
// //                         onChange={() => setEditingTFAnswer(true)}
// //                         className="w-5 h-5"
// //                       />
// //                       <div className="flex items-center gap-2">
// //                         <CheckCircle className="w-5 h-5 text-green-600" />
// //                         <span className="font-medium">صح</span>
// //                       </div>
// //                     </label>
// //                     <label className="flex items-center gap-2 cursor-pointer">
// //                       <input
// //                         type="radio"
// //                         checked={editingTFAnswer === false}
// //                         onChange={() => setEditingTFAnswer(false)}
// //                         className="w-5 h-5"
// //                       />
// //                       <div className="flex items-center gap-2">
// //                         <XCircle className="w-5 h-5 text-red-600" />
// //                         <span className="font-medium">خطأ</span>
// //                       </div>
// //                     </label>
// //                   </div>
// //                 </div>

// //                 <div>
// //                   <label className="block text-lg font-semibold mb-2">
// //                     شرح الإجابة (اختياري)
// //                   </label>
// //                   <div className="border border-gray-300 rounded-lg">
// //                     <ReactQuill
// //                       value={editingTFExplanation}
// //                       onChange={setEditingTFExplanation}
// //                       modules={quillModules}
// //                       formats={quillFormats}
// //                       className="min-h-[100px]"
// //                     />
// //                   </div>
// //                 </div>

// //                 <div className="flex justify-between items-center pt-4">
// //                   <div className="text-lg text-gray-500">
// //                     <AlertCircle className="w-4 h-4 inline mr-1" />
// //                     سؤال صح/خطأ
// //                   </div>
// //                   <Button
// //                     type="primary"
// //                     icon={<Save className="w-4 h-4" />}
// //                     loading={edit_question_loading}
// //                     onClick={() => handleSaveTF(q)}
// //                   >
// //                     حفظ السؤال
// //                   </Button>
// //                 </div>
// //               </div>
// //             </div>
// //           )}

// //           {/* PARAGRAPH EDIT */}
// //           {isParagraph && (
// //             <div className="space-y-6">
// //               <div>
// //                 <div className="flex justify-between items-center mb-4">
// //                   <label className="font-semibold">نص الفقرة</label>
// //                   <Space>
// //                     <Button
// //                       type="primary"
// //                       loading={edit_paragraph_loading}
// //                       onClick={() => handleEditParagraphContent(q)}
// //                       icon={<Save className="w-4 h-4" />}
// //                     >
// //                       حفظ الفقرة
// //                     </Button>
// //                   </Space>
// //                 </div>
// //                 <div className="border border-gray-300 rounded-lg">
// //                   <ReactQuill
// //                     value={editingParagraphContent}
// //                     onChange={setEditingParagraphContent}
// //                     modules={quillModules}
// //                     formats={quillFormats}
// //                     className="min-h-[150px]"
// //                   />
// //                 </div>
// //               </div>

// //               <Divider />

// //               <div>
// //                 <div className="flex justify-between items-center mb-4">
// //                   <label className="font-semibold">أسئلة الفقرة</label>
// //                   <Button
// //                     type="primary"
// //                     onClick={() => startAddingQuestionToParagraph(q)}
// //                     icon={<Plus className="w-4 h-4" />}
// //                   >
// //                     إضافة سؤال جديد
// //                   </Button>
// //                 </div>

// //                 {editingParagraphQuestions.length === 0 ? (
// //                   <div className="text-center py-8 text-gray-500">
// //                     لا توجد أسئلة
// //                   </div>
// //                 ) : (
// //                   <div className="space-y-4">
// //                     {editingParagraphQuestions.map((pq, qIdx) => (
// //                       <div key={pq.id} className="border border-gray-300 rounded-lg p-4">
// //                         <div className="flex justify-between items-center mb-4">
// //                           <div className="font-semibold">سؤال {qIdx + 1}</div>
// //                           <Space>
// //                             <Button
// //                               icon={<Edit3 className="w-4 h-4" />}
// //                               onClick={() => {
// //                                 setEditingParagraphQuestions(prev =>
// //                                   prev.map((item, idx) =>
// //                                     idx === qIdx
// //                                       ? { ...item, isEditing: !item.isEditing }
// //                                       : { ...item, isEditing: false }
// //                                   )
// //                                 );
// //                               }}
// //                             >
// //                               {pq.isEditing ? "إلغاء التعديل" : "تعديل"}
// //                             </Button>
// //                             <Button
// //                               danger
// //                               icon={<Trash2 className="w-4 h-4" />}
// //                               onClick={() => {
// //                                 setQuestionToDelete({
// //                                   type: "paragraph_question",
// //                                   id: pq.rawData?.id,
// //                                   paragraphId: q.id
// //                                 });
// //                                 setDeleteModal(true);
// //                               }}
// //                             >
// //                               حذف
// //                             </Button>
// //                           </Space>
// //                         </div>

// //                         {pq.isEditing ? (
// //                           <div className="space-y-4">
// //                             <div>
// //                               <label className="text-lg mb-1 block">نص السؤال</label>
// //                               <div className="border border-gray-300 rounded">
// //                                 <ReactQuill
// //                                   value={pq.questionText}
// //                                   onChange={(v) => {
// //                                     setEditingParagraphQuestions(prev => {
// //                                       const copy = [...prev];
// //                                       copy[qIdx] = { ...copy[qIdx], questionText: v };
// //                                       return copy;
// //                                     });
// //                                   }}
// //                                   modules={quillModules}
// //                                   formats={quillFormats}
// //                                   className="min-h-[80px]"
// //                                 />
// //                               </div>
// //                             </div>

// //                             <div className="space-y-3">
// //                               <div className="flex justify-between items-center">
// //                                 <div className="flex items-center gap-3">
// //                                   <label className="font-medium">الخيارات</label>
// //                                   <Button
// //                                     type="dashed"
// //                                     icon={<Plus className="w-4 h-4" />}
// //                                     onClick={() => addOptionToParagraphQuestion(qIdx)}
// //                                     size="small"
// //                                   >
// //                                     إضافة خيار
// //                                   </Button>
// //                                 </div>
// //                               </div>
// //                               {pq.options.map((opt, oIdx) => (
// //                                 <div key={opt.id}
// //                                   className={`p-4 border rounded-lg ${opt.isCorrect ? 'border-green-400 bg-green-50' : 'border-gray-300'}`}
// //                                 >
// //                                   <div className="flex items-center justify-between mb-2">
// //                                     <div className="flex items-center gap-3">
// //                                       <input
// //                                         type="radio"
// //                                         checked={!!opt.isCorrect}
// //                                         onChange={() => {
// //                                           setEditingParagraphQuestions(prev => {
// //                                             const copy = [...prev];
// //                                             const qCopy = { ...copy[qIdx] };
// //                                             qCopy.options = qCopy.options.map((o, ii) => ({
// //                                               ...o,
// //                                               isCorrect: ii === oIdx,
// //                                             }));
// //                                             copy[qIdx] = qCopy;
// //                                             return copy;
// //                                           });
// //                                         }}
// //                                         className="w-4 h-4"
// //                                       />
// //                                       <span>الإجابة {oIdx + 1}</span>
// //                                     </div>
// //                                     <Space>
// //                                       <span>{String.fromCharCode(1632 + oIdx + 1)}</span>
// //                                       {pq.options.length > 2 && (
// //                                         <Button
// //                                           danger
// //                                           type="text"
// //                                           icon={<Minus className="w-4 h-4" />}
// //                                           onClick={() => removeOptionFromParagraphQuestion(qIdx, oIdx)}
// //                                           size="small"
// //                                         />
// //                                       )}
// //                                     </Space>
// //                                   </div>
// //                                   <div className="space-y-2 pl-7">
// //                                     <div>
// //                                       <label className="text-lg mb-1 block">نص الخيار</label>
// //                                       <div className="border border-gray-300 rounded">
// //                                         <ReactQuill
// //                                           value={opt.text}
// //                                           onChange={(v) => {
// //                                             setEditingParagraphQuestions(prev => {
// //                                               const copy = [...prev];
// //                                               const qCopy = { ...copy[qIdx] };
// //                                               const opts = [...qCopy.options];
// //                                               opts[oIdx] = { ...opts[oIdx], text: v };
// //                                               qCopy.options = opts;
// //                                               copy[qIdx] = qCopy;
// //                                               return copy;
// //                                             });
// //                                           }}
// //                                           modules={quillModules}
// //                                           formats={quillFormats}
// //                                           className="min-h-[60px]"
// //                                         />
// //                                       </div>
// //                                     </div>
// //                                     <div>
// //                                       <label className="text-lg mb-1 block">الشرح (اختياري)</label>
// //                                       <div className="border border-gray-300 rounded">
// //                                         <ReactQuill
// //                                           value={opt.explanation}
// //                                           onChange={(v) => {
// //                                             setEditingParagraphQuestions(prev => {
// //                                               const copy = [...prev];
// //                                               const qCopy = { ...copy[qIdx] };
// //                                               const opts = [...qCopy.options];
// //                                               opts[oIdx] = { ...opts[oIdx], explanation: v };
// //                                               qCopy.options = opts;
// //                                               copy[qIdx] = qCopy;
// //                                               return copy;
// //                                             });
// //                                           }}
// //                                           modules={quillModules}
// //                                           formats={quillFormats}
// //                                           className="min-h-[60px]"
// //                                         />
// //                                       </div>
// //                                     </div>
// //                                   </div>
// //                                 </div>
// //                               ))}
// //                             </div>

// //                             <div className="flex justify-between items-center pt-4">
// //                               <div className="text-lg text-gray-500">
// //                                 {pq.options.length} خيارات
// //                               </div>
// //                               <Button
// //                                 type="primary"
// //                                 icon={<Save className="w-4 h-4" />}
// //                                 onClick={() => handleSaveParagraph(pq)}
// //                                 loading={edit_question_loading}
// //                               >
// //                                 حفظ التعديلات
// //                               </Button>
// //                             </div>
// //                           </div>
// //                         ) : (
// //                           <div className={textWrapClass}>
// //                             <div
// //                               className="mb-3"
// //                               dangerouslySetInnerHTML={{ __html: pq.questionText }}
// //                             />
// //                             <div className="space-y-2">
// //                               {pq.options.map((opt, oIdx) => (
// //                                 <div
// //                                   key={opt.id}
// //                                   className={`p-2 rounded ${opt.isCorrect ? 'bg-green-50' : 'bg-gray-50'} ${textWrapClass}`}
// //                                 >
// //                                   <span className="font-medium mr-2">
// //                                     {String.fromCharCode(1632 + oIdx + 1)}:
// //                                   </span>
// //                                   <span
// //                                     dangerouslySetInnerHTML={{ __html: opt.text }}
// //                                   />
// //                                   {opt.explanation && (
// //                                     <div className="mt-1 text-lg text-gray-600">
// //                                       <span className="font-medium">الشرح:</span>
// //                                       <span dangerouslySetInnerHTML={{ __html: opt.explanation }} />
// //                                     </div>
// //                                   )}
// //                                 </div>
// //                               ))}
// //                             </div>
// //                           </div>
// //                         )}
// //                       </div>
// //                     ))}
// //                   </div>
// //                 )}
// //               </div>
// //             </div>
// //           )}
// //         </div>
// //       );
// //     }

// //     // =========================
// //     // Normal Display Mode
// //     // =========================
// //     return (
// //       <div className="space-y-4">
// //         {q.type === "paragraph_mcq" && (
// //           <div className="mb-6">
// //             <div className="flex justify-between items-center mb-4">
// //               <div className="flex items-center gap-2">
// //                 <FileText className="w-5 h-5" />
// //                 <span className="font-bold">الفقرة</span>
// //               </div>
// //               <Space>
// //                 <Button
// //                   icon={<Edit3 className="w-4 h-4" />}
// //                   onClick={(e) => {
// //                     e.stopPropagation();
// //                     e.preventDefault();
// //                     startEditing(q);
// //                   }}
// //                 >
// //                   تعديل الفقرة
// //                 </Button>
// //                 <Button
// //                   danger
// //                   onClick={(e) => {
// //                     e.stopPropagation();
// //                     e.preventDefault();
// //                     setQuestionToDelete({ type: "paragraph", id: q?.id });
// //                     setDeleteModal(true);
// //                   }}
// //                   icon={<Trash2 className="w-4 h-4" />}
// //                 >
// //                   حذف الفقرة
// //                 </Button>
// //                 <Button
// //                   type="primary"
// //                   icon={<Plus className="w-4 h-4" />}
// //                   onClick={(e) => {
// //                     e.stopPropagation();
// //                     e.preventDefault();
// //                     startAddingQuestionToParagraph(q);
// //                   }}
// //                 >
// //                   إضافة سؤال
// //                 </Button>
// //               </Space>
// //             </div>
// //             <div
// //               className={`border border-gray-300 rounded-lg p-4 bg-gray-50 ${textWrapClass}`}
// //               dangerouslySetInnerHTML={{ __html: q.paragraphContent }}
// //             />
// //           </div>
// //         )}

// //         <div className="space-y-6">
// //           {(q.type === "mcq"
// //             ? [
// //               {
// //                 id: q.id,
// //                 questionText: q.question,
// //                 options: q.options,
// //                 correctAnswer: q.correctAnswer,
// //                 type: "mcq",
// //               },
// //             ]
// //             : q.type === "t_f"
// //               ? [
// //                 {
// //                   id: q.id,
// //                   questionText: q.question,
// //                   correctAnswer: q.correctAnswer,
// //                   explanation: q.options?.[0]?.explanation || "",
// //                   type: "t_f",
// //                 },
// //               ]
// //               : q.questions
// //           ).map((item, qIdx) => (
// //             <div key={item.id || qIdx} className="border border-gray-300 rounded-lg p-4">
// //               <div className="flex justify-between items-center mb-4">
// //                 <div className="font-semibold">
// //                   {q.type === "paragraph_mcq" ? `سؤال ${qIdx + 1}` :
// //                     q.type === "t_f" ? "سؤال صح/خطأ" : "سؤال MCQ"}
// //                 </div>
// //                 <Space>
// //                   {q.type === "mcq" ? (
// //                     <>
// //                       <Button
// //                         icon={<Edit3 className="w-4 h-4" />}
// //                         onClick={(e) => {
// //                           e.stopPropagation();
// //                           e.preventDefault();
// //                           startEditing(q);
// //                         }}
// //                       >
// //                         تعديل
// //                       </Button>
// //                       <Button
// //                         danger
// //                         icon={<Trash2 className="w-4 h-4" />}
// //                         onClick={(e) => {
// //                           e.stopPropagation();
// //                           e.preventDefault();
// //                           setQuestionToDelete({ type: "mcq", id: q.id });
// //                           setDeleteModal(true);
// //                         }}
// //                       >
// //                         حذف
// //                       </Button>
// //                     </>
// //                   ) : q.type === "t_f" ? (
// //                     <>
// //                       <Button
// //                         icon={<Edit3 className="w-4 h-4" />}
// //                         onClick={(e) => {
// //                           e.stopPropagation();
// //                           e.preventDefault();
// //                           startEditing(q);
// //                         }}
// //                       >
// //                         تعديل
// //                       </Button>
// //                       <Button
// //                         danger
// //                         icon={<Trash2 className="w-4 h-4" />}
// //                         onClick={(e) => {
// //                           e.stopPropagation();
// //                           e.preventDefault();
// //                           setQuestionToDelete({ type: "t_f", id: q.id });
// //                           setDeleteModal(true);
// //                         }}
// //                       >
// //                         حذف
// //                       </Button>
// //                     </>
// //                   ) : (
// //                     <>
// //                       <Button
// //                         icon={<Edit3 className="w-4 h-4" />}
// //                         onClick={(e) => {
// //                           e.stopPropagation();
// //                           e.preventDefault();
// //                           startEditingParagraphQuestion(q, qIdx);
// //                         }}
// //                       >
// //                         تعديل
// //                       </Button>
// //                       <Button
// //                         danger
// //                         icon={<Trash2 className="w-4 h-4" />}
// //                         onClick={(e) => {
// //                           e.stopPropagation();
// //                           e.preventDefault();
// //                           setQuestionToDelete({
// //                             type: "paragraph_question",
// //                             id: item.rawData?.id,
// //                             paragraphId: q.id
// //                           });
// //                           setDeleteModal(true);
// //                         }}
// //                       >
// //                         حذف
// //                       </Button>
// //                     </>
// //                   )}
// //                 </Space>
// //               </div>

// //               <div
// //                 className={`mb-4 ${textWrapClass}`}
// //                 dangerouslySetInnerHTML={{ __html: item.questionText }}
// //               />

// //               {/* Render T/F answer */}
// //               {q.type === "t_f" && (
// //                 <div className="mt-4">
// //                   <div className={`p-4 rounded-lg ${q.correctAnswer ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
// //                     <div className="flex items-center gap-3">
// //                       {q.correctAnswer ? (
// //                         <>
// //                           <CheckCircle className="w-5 h-5 text-green-600" />
// //                           <span className="font-bold text-green-700">الإجابة الصحيحة: صح</span>
// //                         </>
// //                       ) : (
// //                         <>
// //                           <XCircle className="w-5 h-5 text-red-600" />
// //                           <span className="font-bold text-red-700">الإجابة الصحيحة: خطأ</span>
// //                         </>
// //                       )}
// //                     </div>
// //                     {item.explanation && (
// //                       <div className={`mt-3 pt-3 border-t border-gray-200 ${textWrapClass}`}>
// //                         <div className="text-lg font-medium text-gray-700 mb-1">الشرح:</div>
// //                         <div className="text-gray-600" dangerouslySetInnerHTML={{ __html: item.explanation }} />
// //                       </div>
// //                     )}
// //                   </div>
// //                 </div>
// //               )}

// //               {/* Render MCQ options */}
// //               {q.type === "mcq" && (
// //                 <div className="space-y-2">
// //                   {item.options?.map((opt, oIdx) => (
// //                     <div
// //                       key={opt.id}
// //                       className={`p-2 rounded ${opt.isCorrect || oIdx === item.correctAnswer ? 'bg-green-50 border border-green-200' : 'bg-gray-50'} ${textWrapClass}`}
// //                     >
// //                       <div className="flex items-center gap-2">
// //                         <span className="font-medium">
// //                           {String.fromCharCode(1632 + oIdx + 1)}:
// //                         </span>
// //                         <span
// //                           dangerouslySetInnerHTML={{ __html: opt.text }}
// //                         />
// //                       </div>
// //                       {opt.explanation && (
// //                         <div className={`mt-1 text-lg text-gray-600 pr-6 ${textWrapClass}`}>
// //                           <span className="font-medium">الشرح:</span>
// //                           <span dangerouslySetInnerHTML={{ __html: opt.explanation }} />
// //                         </div>
// //                       )}
// //                     </div>
// //                   ))}
// //                 </div>
// //               )}

// //               {/* Render Paragraph question options */}
// //               {q.type === "paragraph_mcq" && (
// //                 <div className="space-y-2">
// //                   {item.options?.map((opt, oIdx) => (
// //                     <div
// //                       key={opt.id}
// //                       className={`p-2 rounded ${opt.isCorrect ? 'bg-green-50 border border-green-200' : 'bg-gray-50'} ${textWrapClass}`}
// //                     >
// //                       <div className="flex items-center gap-2">
// //                         <span className="font-medium">
// //                           {String.fromCharCode(1632 + oIdx + 1)}:
// //                         </span>
// //                         <span
// //                           dangerouslySetInnerHTML={{ __html: opt.text }}
// //                         />
// //                       </div>
// //                       {opt.explanation && (
// //                         <div className={`mt-1 text-lg text-gray-600 pr-6 ${textWrapClass}`}>
// //                           <span className="font-medium">الشرح:</span>
// //                           <span dangerouslySetInnerHTML={{ __html: opt.explanation }} />
// //                         </div>
// //                       )}
// //                     </div>
// //                   ))}
// //                 </div>
// //               )}
// //             </div>
// //           ))}
// //         </div>
// //       </div>
// //     );
// //   };

// //   // =========================
// //   // Modal لإضافة سؤال إلى فقرة
// //   // =========================
// //   const renderAddQuestionToParagraphModal = () => {
// //     if (!addingQuestionToParagraph) return null;

// //     return (
// //       <Modal
// //         title={
// //           <div className="flex items-center gap-2">
// //             <Plus className="w-5 h-5" />
// //             <span>إضافة سؤال جديد إلى الفقرة</span>
// //           </div>
// //         }
// //         open={!!addingQuestionToParagraph}
// //         onCancel={() => {
// //           setAddingQuestionToParagraph(null);
// //           setNewParagraphQuestionText("");
// //           setNewParagraphQuestionOptions([
// //             { id: makeTempId("opt"), text: "", explanation: "", isCorrect: true },
// //             { id: makeTempId("opt"), text: "", explanation: "", isCorrect: false },
// //           ]);
// //         }}
// //         footer={[
// //           <Button
// //             key="cancel"
// //             onClick={() => {
// //               setAddingQuestionToParagraph(null);
// //               setNewParagraphQuestionText("");
// //               setNewParagraphQuestionOptions([
// //                 { id: makeTempId("opt"), text: "", explanation: "", isCorrect: true },
// //                 { id: makeTempId("opt"), text: "", explanation: "", isCorrect: false },
// //               ]);
// //             }}
// //           >
// //             إلغاء
// //           </Button>,
// //           <Button
// //             key="submit"
// //             type="primary"
// //             loading={create_question_loading}
// //             onClick={handleSaveNewParagraphQuestion}
// //           >
// //             إضافة السؤال
// //           </Button>,
// //         ]}
// //         width={700}
// //       >
// //         <div className="space-y-6">
// //           <div>
// //             <label className="block font-semibold mb-2">
// //               نص السؤال
// //             </label>
// //             <div className="border border-gray-300 rounded-lg">
// //               <ReactQuill
// //                 value={newParagraphQuestionText}
// //                 onChange={setNewParagraphQuestionText}
// //                 modules={quillModules}
// //                 formats={quillFormats}
// //                 className="min-h-[120px]"
// //               />
// //             </div>
// //           </div>

// //           <Divider>
// //             <span>خيارات السؤال</span>
// //           </Divider>

// //           <div className="space-y-4">
// //             <div className="flex justify-between items-center">
// //               <div className="flex items-center gap-3">
// //                 <label className="font-semibold">قم بتحديد الإجابة الصحيحة</label>
// //                 <Button
// //                   type="dashed"
// //                   icon={<Plus className="w-4 h-4" />}
// //                   onClick={addOptionToParagraphQuestionModal}
// //                 >
// //                   إضافة خيار
// //                 </Button>
// //               </div>
// //             </div>

// //             <div className="space-y-4">
// //               {newParagraphQuestionOptions.map((opt, idx) => (
// //                 <div
// //                   key={opt.id}
// //                   className={`p-4 border !rounded-lg ${opt.isCorrect ? 'border-green-400 bg-green-50' : 'border-gray-300'}`}
// //                 >
// //                   <div className="flex items-center justify-between mb-3">
// //                     <div className="flex items-center gap-3">
// //                       <input
// //                         type="radio"
// //                         checked={!!opt.isCorrect}
// //                         onChange={() => {
// //                           setNewParagraphQuestionOptions(prev =>
// //                             prev.map((o, ii) => ({
// //                               ...o,
// //                               isCorrect: ii === idx,
// //                             }))
// //                           );
// //                         }}
// //                         className="w-4 h-4"
// //                       />
// //                       <span>الإجابة {idx + 1}</span>
// //                     </div>
// //                     <Space>
// //                       <span className="px-3 py-1 bg-gray-100 rounded">
// //                         {String.fromCharCode(1632 + idx + 1)}
// //                       </span>
// //                       {newParagraphQuestionOptions.length > 2 && (
// //                         <Button
// //                           danger
// //                           type="text"
// //                           icon={<Minus className="w-4 h-4" />}
// //                           onClick={() => removeOptionFromParagraphQuestionModal(idx)}
// //                           size="small"
// //                         />
// //                       )}
// //                     </Space>
// //                   </div>

// //                   <div className="grid gap-3">
// //                     <div>
// //                       <label className="text-lg mb-1 block">نص الخيار</label>
// //                       <div className="border border-gray-300 rounded">
// //                         <ReactQuill
// //                           value={opt.text}
// //                           onChange={(v) => {
// //                             setNewParagraphQuestionOptions(prev => {
// //                               const copy = [...prev];
// //                               copy[idx] = { ...copy[idx], text: v };
// //                               return copy;
// //                             });
// //                           }}
// //                           modules={quillModules}
// //                           formats={quillFormats}
// //                           className="min-h-[80px]"
// //                         />
// //                       </div>
// //                     </div>

// //                     <div>
// //                       <label className="text-lg mb-1 block">
// //                         <span className="text-gray-500">(اختياري)</span> الشرح
// //                       </label>
// //                       <div className="border border-gray-300 rounded">
// //                         <ReactQuill
// //                           value={opt.explanation}
// //                           onChange={(v) => {
// //                             setNewParagraphQuestionOptions(prev => {
// //                               const copy = [...prev];
// //                               copy[idx] = { ...copy[idx], explanation: v };
// //                               return copy;
// //                             });
// //                           }}
// //                           modules={quillModules}
// //                           formats={quillFormats}
// //                           className="min-h-[80px]"
// //                         />
// //                       </div>
// //                     </div>
// //                   </div>
// //                 </div>
// //               ))}
// //             </div>

// //             <div className="flex justify-between items-center">
// //               <div className="text-lg text-gray-500">
// //                 <AlertCircle className="w-4 h-4 inline mr-1" />
// //                 الخيار الأول هو الإجابة الصحيحة افتراضياً
// //               </div>
// //               <div className="text-lg text-gray-500">
// //                 {newParagraphQuestionOptions.length} خيارات
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       </Modal>
// //     );
// //   };

// //   // =========================
// //   // Loading
// //   // =========================
// //   if (get_exam_question_loading) {
// //     return (
// //       <div className="flex flex-col items-center justify-center py-32">
// //         <Spin size="large" />
// //         <p className="mt-4 text-gray-600">جاري تحميل الأسئلة...</p>
// //       </div>
// //     );
// //   }

// //   // =========================
// //   // Main Render
// //   // =========================
// //   return (
// //     <Card title="أسئلة الامتحان" icon={FileText} className="p-0">
// //       <div className="p-6">
// //         {apiQuestions.length === 0 ? (
// //           <div className="text-center py-16">
// //             <Empty
// //               description="لا توجد أسئلة في هذا القسم"
// //               image={Empty.PRESENTED_IMAGE_SIMPLE}
// //             />
// //           </div>
// //         ) : (
// //           <div className="space-y-6">
// //             <div className="mb-6">
// //               <div className="flex items-center justify-between gap-3 mb-4">
// //                 <div
// //                   dangerouslySetInnerHTML={{ __html: selectedSection?.title || "قسم الامتحان" }}
// //                   className={`text-2xl font-bold text-gray-900 ${textWrapClass}`}
// //                 />
// //                 <Tag color="blue">{apiQuestions?.length || 0} سؤال</Tag>
// //               </div>
// //             </div>

// //             <div className="space-y-4">
// //               {apiQuestions?.map((q, index) => {
// //                 const isExp = isExpanded(q.id, q.type);
// //                 const typeLabel =
// //                   q.type === "mcq" ? "MCQ" :
// //                     q.type === "t_f" ? "صح/خطأ" :
// //                       "فقرة";

// //                 return (
// //                   <div
// //                     key={`${q.type}-${q.id}`}
// //                     className="border border-gray-300 rounded-lg overflow-hidden"
// //                   >
// //                     <div
// //                       onClick={() => toggleQuestion(q.id, q.type)}
// //                       className={`flex items-center justify-between p-4 cursor-pointer ${isExp ? 'bg-gray-50' : 'hover:bg-gray-50'
// //                         }`}
// //                     >
// //                       <div className="flex items-center gap-4">
// //                         <div className={`w-10 h-10 rounded-full flex items-center justify-center ${q.type === "mcq" ? 'bg-blue-100 text-blue-700' :
// //                           q.type === "t_f" ? 'bg-orange-100 text-orange-700' :
// //                             'bg-purple-100 text-purple-700'
// //                           }`}>
// //                           {index + 1}
// //                         </div>
// //                         <div>
// //                           <div className="font-bold">
// //                             {typeLabel}
// //                             {q.type === "paragraph_mcq" && (
// //                               <span className="text-lg text-gray-500 mr-2">
// //                                 ({q.questions?.length || 0} أسئلة)
// //                               </span>
// //                             )}
// //                           </div>
// //                           <div className={`text-lg text-gray-500 ${textWrapClass}`}>
// //                             {q.type === "mcq"
// //                               ? stripHtml(q.question).substring(0, 50) + "..."
// //                               : q.type === "t_f"
// //                                 ? stripHtml(q.question).substring(0, 50) + "..."
// //                                 : stripHtml(q.paragraphContent).substring(0, 50) + "..."
// //                             }
// //                           </div>
// //                         </div>
// //                       </div>

// //                       <div className="flex items-center gap-2">
// //                         {isExp ? (
// //                           <ChevronUp className="w-5 h-5" />
// //                         ) : (
// //                           <ChevronDown className="w-5 h-5" />
// //                         )}
// //                       </div>
// //                     </div>

// //                     {isExp && (
// //                       <div className="border-t border-gray-300">
// //                         <div className="p-4">
// //                           {renderQuestionContent(q)}
// //                         </div>
// //                       </div>
// //                     )}
// //                   </div>
// //                 );
// //               })}
// //             </div>
// //           </div>
// //         )}
// //       </div>

// //       {/* MODALS */}
// //       {renderAddQuestionToParagraphModal()}

// //       {/* DELETE MODAL */}
// //       <Modal
// //         open={deleteModal}
// //         onCancel={() => setDeleteModal(false)}
// //         onOk={handleDeleteAny}
// //         okText="نعم، احذف"
// //         cancelText="إلغاء"
// //         okButtonProps={{
// //           danger: true,
// //           loading: delete_question_loading || delete_paragraph_loading,
// //         }}
// //         width={500}
// //       >
// //         <div className="py-6">
// //           <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
// //             <Trash2 className="w-8 h-8 text-red-600" />
// //           </div>
// //           <h3 className="text-xl font-bold text-center mb-2">تأكيد الحذف</h3>
// //           <p className="text-gray-600 text-center">
// //             هل أنت متأكد من الحذف؟
// //             <br />
// //             <span className="text-lg text-gray-500">
// //               هذا الإجراء لا يمكن التراجع عنه
// //             </span>
// //           </p>
// //         </div>
// //       </Modal>
// //     </Card>
// //   );
// // }

// "use client";

// import React, { useMemo, useState, useEffect } from "react";
// import {
//   Edit3,
//   Trash2,
//   Save,
//   X,
//   ChevronDown,
//   ChevronUp,
//   FileText,
//   List,
//   Plus,
//   Minus,
//   AlertCircle,
//   CheckCircle,
//   XCircle,
//   Info,
// } from "lucide-react";
// import {
//   Empty,
//   Spin,
//   Tag,
//   Button,
//   Modal,
//   Divider,
//   Tooltip,
//   Space,
//   Alert,
//   Card as AntCard,
//   Badge,
//   Collapse,
//   Popconfirm,
//   Radio,
// } from "antd";
// import { useDispatch, useSelector } from "react-redux";
// import dynamic from "next/dynamic";
// import Card from "./ExamCard";
// import {
//   handleDeleteExamQuestions,
//   handleGetExamQuestions,
//   handleUpdateExamQuestions,
//   handleEditParagraph,
//   handleDeleteParagraph,
//   handleAddParagraphQuestion,
// } from "../../lib/features/examSlice";
// import { toast } from "react-toastify";

// const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
// import "react-quill-new/dist/quill.snow.css";

// const { Panel } = Collapse;

// export default function DisplayQuestions({
//   selectedSectionId,
//   selectedSection,
// }) {
//   const dispatch = useDispatch();

//   const {
//     get_exam_questions_list,
//     get_exam_question_loading,
//     delete_question_loading,
//     edit_question_loading,
//     edit_paragraph_loading,
//     delete_paragraph_loading,
//     create_question_loading,
//   } = useSelector((state) => state?.exam);

//   // =========================
//   // Helpers
//   // =========================
//   const stripHtml = (html = "") =>
//     String(html)
//       .replace(/<[^>]*>/g, " ")
//       .replace(/&nbsp;/g, " ")
//       .replace(/\s+/g, " ")
//       .trim();

//   const isHtmlEmpty = (html) => stripHtml(html).length === 0;

//   const makeTempId = (prefix = "temp") =>
//     `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;

//   // =========================
//   // UI State
//   // =========================
//   const [expandedQuestions, setExpandedQuestions] = useState({});
//   const [editingQuestionId, setEditingQuestionId] = useState(null);
//   const [editingType, setEditingType] = useState(null);

//   // MCQ editing
//   const [editingContent, setEditingContent] = useState("");
//   const [editingOptions, setEditingOptions] = useState([]);
//   const [editingCorrectAnswer, setEditingCorrectAnswer] = useState(0);
//   const [editingInstruction, setEditingInstruction] = useState(""); // Add instruction state

//   // T/F editing
//   const [editingTFContent, setEditingTFContent] = useState("");
//   const [editingTFAnswer, setEditingTFAnswer] = useState(true); // true or false
//   const [editingTFExplanation, setEditingTFExplanation] = useState("");

//   // Paragraph editing
//   const [editingParagraphContent, setEditingParagraphContent] = useState("");
//   const [editingParagraphQuestions, setEditingParagraphQuestions] = useState([]);

//   // Add question to existing paragraph modal
//   const [addingQuestionToParagraph, setAddingQuestionToParagraph] = useState(null);
//   const [newParagraphQuestionText, setNewParagraphQuestionText] = useState("");
//   const [newParagraphQuestionOptions, setNewParagraphQuestionOptions] = useState([
//     { id: makeTempId("opt"), text: "", explanation: "", isCorrect: true },
//     { id: makeTempId("opt"), text: "", explanation: "", isCorrect: false },
//   ]);

//   // Delete modals
//   const [deleteModal, setDeleteModal] = useState(false);
//   const [questionToDelete, setQuestionToDelete] = useState(null);

//   // =========================
//   // Init expands from API
//   // =========================
//   useEffect(() => {
//     if (!get_exam_questions_list) return;

//     const initial = {};
//     (get_exam_questions_list?.data?.message?.mcq || []).forEach(
//       (q) => (initial[`mcq-${q.id}`] = false)
//     );
//     (get_exam_questions_list?.data?.message?.paragraphs || []).forEach(
//       (p) => (initial[`paragraph-${p.paragraph.id}`] = false)
//     );
//     setExpandedQuestions(initial);
//   }, [get_exam_questions_list]);

//   const quillModules = {
//     toolbar: [
//       [{ header: [1, 2, 3, false] }],
//       ["bold", "italic", "underline"],
//       [{ list: "ordered" }, { list: "bullet" }],
//       ["link"],
//     ],
//   };

//   const quillFormats = [
//     "header",
//     "bold",
//     "italic",
//     "underline",
//     "list",
//     "bullet",
//     "link",
//   ];

//   const apiQuestions = useMemo(() => {
//     console.log("get_exam_questions_list", get_exam_questions_list);
//     if (!get_exam_questions_list && !selectedSection) return [];

//     const data = get_exam_questions_list?.data?.message || selectedSection || {
//       mcq: [],
//       paragraphs: [],
//     };

//     console.log("data", data);
//     console.log("selectedSection", selectedSection);

//     // Process all questions from mcq array (including t_f type)
//     const mcqSource =
//       data?.mcq && data?.mcq?.length > 0
//         ? data?.mcq
//         : data?.mcq && data?.mcq?.length
//           ? data?.mcq
//           : [];

//     const allQuestions = mcqSource.map((q) => {
//       const options = q?.options || [];

//       if (q.question_type === "t_f") {
//         // Handle T/F question - find which option is marked as correct
//         // Don't check text content, just check is_correct flag
//         const trueOption = options.find(opt => 
//           (opt?.option_text?.toLowerCase().includes("صحيح") || 
//            opt?.option_text?.toLowerCase().includes("صح")) &&
//           Number(opt?.is_correct) === 1
//         );
        
//         const isTrue = !!trueOption; // If "صحيح" is correct, then answer is true
        
//         console.log("T/F Question analysis:", {
//           id: q.id,
//           options: options,
//           trueOptionFound: !!trueOption,
//           isTrue: isTrue,
//           option1: options[0]?.option_text + " - is_correct: " + options[0]?.is_correct,
//           option2: options[1]?.option_text + " - is_correct: " + options[1]?.is_correct
//         });

//         return {
//           id: q.id,
//           type: "t_f", // Use t_f type for T/F questions
//           question: q?.question_text || "",
//           correctAnswer: isTrue,
//           instruction: q?.instructions || "", // Add instruction field
//           options: options.map((opt) => ({
//             id: opt?.id,
//             text: opt.option_text || "",
//             explanation: opt.question_explanation || "",
//             isCorrect: Number(opt?.is_correct) === 1,
//           })),
//           rawData: q,
//         };
//       } else {
//         // Handle regular MCQ
//         const correctIndex = options.findIndex(
//           (opt) => Number(opt?.is_correct) === 1
//         );

//         return {
//           id: q.id,
//           type: "mcq",
//           question: q?.question_text || "",
//           instruction: q?.instructions || "", // Add instruction field
//           correctAnswer: correctIndex >= 0 ? correctIndex : 0,
//           options: options.map((opt) => ({
//             id: opt?.id,
//             text: opt.option_text || "",
//             explanation: opt.question_explanation || "",
//             isCorrect: Number(opt?.is_correct) === 1,
//           })),
//           rawData: q,
//         };
//       }
//     });

//     console.log("allQuestions", allQuestions);

//     // Process Paragraph questions
//     const paragraphSource =
//       data?.paragraphs && data?.paragraphs?.length
//         ? data?.paragraphs
//         : data?.paragraphs || [];

//     const paragraphs = paragraphSource.map((p) => ({
//       id: p?.paragraph?.id,
//       type: "paragraph_mcq",
//       paragraphContent: p?.paragraph?.paragraph_content || "",
//       questions: (p?.questions || []).map((q) => ({
//         id: q?.id,
//         questionText: q?.question_text || "",
//         instruction: q?.instructions || "", // Add instruction field
//         options: (q?.options || []).map((opt) => ({
//           id: opt?.id,
//           text: opt?.option_text || "",
//           explanation: opt?.question_explanation || "",
//           isCorrect: Number(opt?.is_correct) === 1,
//         })),
//         rawData: q,
//       })),
//       rawData: p,
//     }));

//     return [...allQuestions, ...paragraphs];
//   }, [get_exam_questions_list, selectedSection, selectedSectionId]);

//   // =========================
//   // CSS class for text wrapping
//   // =========================
//   const textWrapClass = "break-words whitespace-normal overflow-hidden max-w-full [&_*]:break-words [&_*]:whitespace-normal  px-4";

//   // =========================
//   // Expand/collapse helpers
//   // =========================
//   const toggleQuestion = (id, type) => {
//     const key = `${type === "mcq" ? "mcq" : type === "t_f" ? "t_f" : "paragraph"}-${id}`;
//     setExpandedQuestions((prevState) => {  // Change 'prev' to a named parameter
//       const isCurrentlyExpanded = prevState[key] || false;

//       // If editing and collapsing, cancel editing
//       if (editingQuestionId === id && isCurrentlyExpanded) {
//         cancelEditing();
//       }

//       return { ...prevState, [key]: !isCurrentlyExpanded };
//     });
//   };

//   const isExpanded = (id, type) => {
//     const key = `${type === "mcq" ? "mcq" : type === "t_f" ? "t_f" : "paragraph"}-${id}`;
//     return expandedQuestions[key] || false;
//   };

//   // =========================
//   // Start editing - opens collapse
//   // =========================
//   const startEditing = (q) => {
//     console.log("Starting edit for T/F question:", {
//       q: q,
//       correctAnswer: q.correctAnswer,
//       options: q.options,
//       rawData: q.rawData
//     });
    
//     if (!q || !q.id) {
//       console.error("Invalid question object:", q);
//       return;
//     }

//     // First expand the question if it's not already expanded
//     const key = `${q.type === "mcq" ? "mcq" : q.type === "t_f" ? "t_f" : "paragraph"}-${q.id}`;
//     if (!expandedQuestions[key]) {
//       setExpandedQuestions(prev => ({ ...prev, [key]: true }));
//     }

//     setEditingQuestionId(q.id);
//     setEditingType(q.type);

//     // Set instruction for all question types
//     setEditingInstruction(q.instruction || "");

//     if (q.type === "mcq") {
//       setEditingContent(q.question || "");
//       setEditingOptions((q.options || []).map((opt) => ({ ...opt })));

//       const correctIndex = (q.options || []).findIndex((o) => !!o.isCorrect);
//       const safeIndex = correctIndex >= 0 ? correctIndex : (q.correctAnswer ?? 0);
//       setEditingCorrectAnswer(safeIndex);

//       setEditingOptions((prev) =>
//         (prev || []).map((o, idx) => ({ ...o, isCorrect: idx === safeIndex }))
//       );
//     } else if (q.type === "t_f") {
//       console.log("Editing T/F question details:", {
//         question: q.question,
//         correctAnswer: q.correctAnswer,
//         options: q.options,
//         correctOption: q.options?.find(opt => opt.isCorrect)
//       });
      
//       setEditingTFContent(q.question || "");
      
//       // Determine correct answer from options
//       let correctAnswer = true; // default
      
//       if (q.options && q.options.length >= 2) {
//         // Find which option is marked as correct
//         const correctOption = q.options.find(opt => opt.isCorrect);
//         if (correctOption) {
//           // Check if the correct option is "صحيح" (true) or "خطأ" (false)
//           const optionText = correctOption.text?.toLowerCase() || "";
//           correctAnswer = optionText.includes("صحيح") || optionText.includes("صح");
//         }
//       }
      
//       console.log("Setting editingTFAnswer to:", correctAnswer);
//       setEditingTFAnswer(correctAnswer);
      
//       // Get explanation from any option (they should all have the same explanation)
//       const explanation = q.options?.find(opt => opt.explanation)?.explanation || "";
//       setEditingTFExplanation(explanation);
//     } else if (q.type === "paragraph_mcq") {
//       setEditingParagraphContent(q.paragraphContent || "");
//       // Initialize with isEditing set to false for all questions
//       setEditingParagraphQuestions(
//         (q.questions || []).map((pq) => ({
//           id: pq.id,
//           questionText: pq.questionText || "",
//           instruction: pq.instruction || "", // Set instruction for paragraph questions
//           options: (pq.options || []).map((opt) => ({ ...opt })),
//           rawData: pq.rawData,
//           isEditing: false // Initialize as false
//         }))
//       );
//     }
//   };

//   const startEditingParagraphQuestion = (paragraph, questionIndex) => {
//     // First, enter edit mode for the paragraph
//     startEditing(paragraph);

//     // Then, after a short delay, enable edit mode for the specific question
//     setTimeout(() => {
//       setEditingParagraphQuestions(prev =>
//         prev.map((pq, idx) => ({
//           ...pq,
//           isEditing: idx === questionIndex
//         }))
//       );
//     }, 50);
//   };

//   const cancelEditing = () => {
//     setEditingQuestionId(null);
//     setEditingType(null);
//     setEditingContent("");
//     setEditingInstruction(""); // Reset instruction
//     setEditingOptions([]);
//     setEditingCorrectAnswer(0);
//     setEditingTFContent("");
//     setEditingTFAnswer(true);
//     setEditingTFExplanation("");
//     setEditingParagraphContent("");
//     setEditingParagraphQuestions([]);
//   };

//   const refreshQuestions = async () => {
//     if (selectedSectionId || selectedSection) {
//       try {
//         await dispatch(
//           handleGetExamQuestions({
//             body: { exam_section_id: selectedSectionId || selectedSection?.id },
//           })
//         ).unwrap();

//         // Reset expansion states
//         const initial = {};
//         if (get_exam_questions_list?.data?.message?.mcq) {
//           get_exam_questions_list.data.message.mcq.forEach(
//             (q) => (initial[`mcq-${q.id}`] = false)
//           );
//         }
//         if (get_exam_questions_list?.data?.message?.paragraphs) {
//           get_exam_questions_list.data.message.paragraphs.forEach(
//             (p) => (initial[`paragraph-${p.paragraph.id}`] = false)
//           );
//         }
//         setExpandedQuestions(initial);

//         // Also reset editing state
//         cancelEditing();

//       } catch (error) {
//         console.error("Error refreshing questions:", error);
//       }
//     }
//   };

//   useEffect(() => {
//     refreshQuestions();
//   }, [selectedSection, selectedSectionId]);

//   // =========================
//   // Add/Remove options functions
//   // =========================
//   const addOptionToMCQ = () => {
//     setEditingOptions(prev => [
//       ...prev,
//       { id: makeTempId("opt"), text: "", explanation: "", isCorrect: false }
//     ]);
//   };

//   const removeOptionFromMCQ = (index) => {
//     if (editingOptions.length <= 2) {
//       toast.error("يجب أن يكون هناك خياران على الأقل");
//       return;
//     }

//     // If removing the correct answer, make the first option correct
//     const isRemovingCorrect = editingOptions[index].isCorrect;
//     const newOptions = editingOptions.filter((_, i) => i !== index);

//     if (isRemovingCorrect && newOptions.length > 0) {
//       newOptions[0].isCorrect = true;
//       setEditingCorrectAnswer(0);
//     } else if (index < editingCorrectAnswer) {
//       // Adjust correct answer index if removed option was before it
//       setEditingCorrectAnswer(editingCorrectAnswer - 1);
//     }

//     setEditingOptions(newOptions);
//   };

//   const addOptionToParagraphQuestion = (questionIndex) => {
//     setEditingParagraphQuestions(prev => {
//       const copy = [...prev];
//       const qCopy = { ...copy[questionIndex] };
//       qCopy.options = [
//         ...qCopy.options,
//         { id: makeTempId("opt"), text: "", explanation: "", isCorrect: false }
//       ];
//       copy[questionIndex] = qCopy;
//       return copy;
//     });
//   };

//   const removeOptionFromParagraphQuestion = (questionIndex, optionIndex) => {
//     setEditingParagraphQuestions(prev => {
//       const copy = [...prev];
//       const qCopy = { ...copy[questionIndex] };

//       if (qCopy.options.length <= 2) {
//         toast.error("يجب أن يكون هناك خياران على الأقل");
//         return prev;
//       }

//       // If removing the correct answer, make the first option correct
//       const isRemovingCorrect = qCopy.options[optionIndex].isCorrect;
//       const newOptions = qCopy.options.filter((_, i) => i !== optionIndex);

//       if (isRemovingCorrect && newOptions.length > 0) {
//         newOptions[0].isCorrect = true;
//       }

//       qCopy.options = newOptions;
//       copy[questionIndex] = qCopy;
//       return copy;
//     });
//   };

//   // =========================
//   // Save MCQ (update)
//   // =========================
//   const handleSaveMCQ = async (q) => {
//     if (isHtmlEmpty(editingContent)) {
//       toast.error("يرجى إدخال نص السؤال");
//       return;
//     }

//     const hasCorrect = (editingOptions || []).some((o) => !!o.isCorrect);
//     if (!hasCorrect) {
//       toast.error("يرجى تحديد إجابة صحيحة");
//       return;
//     }

//     // Check if all options have text
//     const anyEmptyOpt = editingOptions.some((o) => isHtmlEmpty(o.text));
//     if (anyEmptyOpt) {
//       toast.error("يرجى إدخال نص لكل خيار");
//       return;
//     }

//     const payload = {
//       id: q.id,
//       question_text: editingContent,
//       instructions: editingInstruction || "Read carefully before answering", // Use instruction field
//       mcq_array: (editingOptions || []).map((opt) => ({
//         answer: opt?.text || "",
//         question_explanation: opt?.explanation || "",
//         correct_or_not: opt?.isCorrect ? "1" : "0",
//       })),
//     };

//     try {
//       const res = await dispatch(handleUpdateExamQuestions({ body: payload })).unwrap();

//       if (res?.data?.status === "success") {
//         toast.success("تم تعديل السؤال بنجاح");
//         refreshQuestions();
//         cancelEditing();
//       } else {
//         toast.error(res?.data?.message || "فشل تعديل السؤال");
//       }
//     } catch (e) {
//       toast.error("حصل خطأ أثناء تعديل السؤال");
//     }
//   };

//   // =========================
//   // Save T/F question
//   // =========================
//   const handleSaveTF = async (q) => {
//     if (isHtmlEmpty(editingTFContent)) {
//       toast.error("يرجى إدخال نص السؤال");
//       return;
//     }

//     // T/F questions have two options: صحيح and خطأ
//     const trueOption = {
//       answer: "صحيح",
//       correct_or_not: editingTFAnswer ? "1" : "0",
//       question_explanation: editingTFExplanation || "",
//     };

//     const falseOption = {
//       answer: "خطأ",
//       correct_or_not: !editingTFAnswer ? "1" : "0",
//       question_explanation: editingTFExplanation || "",
//     };

//     const payload = {
//       id: q.id,
//       question_text: editingTFContent,
//       instructions: editingInstruction || "اختر الإجابة الصحيحة", // Use instruction field
//       question_type: "t_f", // Set question_type to t_f
//       mcq_array: [trueOption, falseOption],
//     };

//     try {
//       const res = await dispatch(handleUpdateExamQuestions({ body: payload })).unwrap();

//       if (res?.data?.status === "success") {
//         toast.success("تم تعديل السؤال بنجاح");
        
//         // Force immediate state update
//         cancelEditing();
        
//         // Close the expanded view
//         const key = `t_f-${q.id}`;
//         setExpandedQuestions(prev => ({ ...prev, [key]: false }));        
//         // Refresh after a short delay to ensure API has updated
//           refreshQuestions();
        
//       } else {
//         toast.error(res?.data?.message || "فشل تعديل السؤال");
//       }
//     } catch (e) {
//       toast.error("حصل خطأ أثناء تعديل السؤال");
//     }
//   };

//   // =========================
//   // Save paragraph question (update)
//   // =========================
//   const handleSaveParagraph = async (pq) => {
//     // Extract question from the editing state
//     const editingQuestion = editingParagraphQuestions.find(q => q.id === pq.id);
//     if (!editingQuestion) return;

//     if (isHtmlEmpty(editingQuestion.questionText)) {
//       toast.error("يرجى إدخال نص السؤال");
//       return;
//     }

//     const hasCorrect = (editingQuestion?.options || []).some((o) => !!o.isCorrect);
//     if (!hasCorrect) {
//       toast.error("يرجى تحديد إجابة صحيحة واحدة على الأقل");
//       return;
//     }

//     // Check if all options have text
//     const anyEmptyOpt = (editingQuestion?.options || []).some((o) => isHtmlEmpty(o.text));
//     if (anyEmptyOpt) {
//       toast.error("يرجى إدخال نص لكل خيار");
//       return;
//     }

//     const payload = {
//       id: editingQuestion?.rawData?.id,
//       question_text: editingQuestion?.questionText,
//       instructions: editingQuestion.instruction || "Read carefully before answering", // Use instruction field
//       mcq_array: (editingQuestion?.options || []).map((opt) => ({
//         answer: opt.text,
//         correct_or_not: opt.isCorrect ? "1" : "0",
//         question_explanation: opt.explanation || "",
//       })),
//     };

//     try {
//       const res = await dispatch(handleUpdateExamQuestions({ body: payload })).unwrap();

//       if (res?.data?.status === "success") {
//         toast.success("تم تعديل السؤال بنجاح");
//         // Turn off editing mode for this question
//         setEditingParagraphQuestions(prev =>
//           prev.map(q =>
//             q.id === pq.id
//               ? { ...q, isEditing: false }
//               : q
//           )
//         );
//         refreshQuestions();
//       } else {
//         toast.error(res?.data?.message || "فشل تعديل السؤال");
//       }
//     } catch (e) {
//       toast.error("حصل خطأ أثناء تعديل السؤال");
//     }
//   };

//   // =========================
//   // Start adding question to paragraph
//   // =========================
//   const startAddingQuestionToParagraph = (paragraph) => {
//     setAddingQuestionToParagraph(paragraph);
//     setNewParagraphQuestionText("");
//     setNewParagraphQuestionOptions([
//       { id: makeTempId("opt"), text: "", explanation: "", isCorrect: true },
//       { id: makeTempId("opt"), text: "", explanation: "", isCorrect: false },
//     ]);
//   };

//   // =========================
//   // Add/Remove options in paragraph question form (modal)
//   // =========================
//   const addOptionToParagraphQuestionModal = () => {
//     setNewParagraphQuestionOptions(prev => [
//       ...prev,
//       { id: makeTempId("opt"), text: "", explanation: "", isCorrect: false }
//     ]);
//   };

//   const removeOptionFromParagraphQuestionModal = (index) => {
//     if (newParagraphQuestionOptions.length <= 2) {
//       toast.error("يجب أن يكون هناك خياران على الأقل");
//       return;
//     }

//     // If removing the correct answer, make the first option correct
//     const isRemovingCorrect = newParagraphQuestionOptions[index].isCorrect;
//     const newOptions = newParagraphQuestionOptions.filter((_, i) => i !== index);

//     if (isRemovingCorrect && newOptions.length > 0) {
//       newOptions[0].isCorrect = true;
//     }

//     setNewParagraphQuestionOptions(newOptions);
//   };

//   // =========================
//   // Save new question to paragraph
//   // =========================
//   const handleSaveNewParagraphQuestion = async () => {
//     if (!addingQuestionToParagraph) return;

//     if (isHtmlEmpty(newParagraphQuestionText)) {
//       toast.error("يرجى إدخال نص السؤال");
//       return;
//     }

//     const hasCorrectOption = newParagraphQuestionOptions.some((opt) => opt.isCorrect);
//     if (!hasCorrectOption) {
//       toast.error("يرجى تحديد إجابة صحيحة واحدة على الأقل");
//       return;
//     }

//     // Check if all options have text
//     const anyEmptyOpt = newParagraphQuestionOptions.some((o) => isHtmlEmpty(o.text));
//     if (anyEmptyOpt) {
//       toast.error("يرجى إدخال نص لكل خيار");
//       return;
//     }

//     const payload = {
//       paragraph_id: addingQuestionToParagraph.id,
//       exam_section_id: selectedSectionId,
//       question_text: newParagraphQuestionText,
//       instructions: "Select the most appropriate answer based on the paragraph content.",
//       mcq_array: newParagraphQuestionOptions.map((opt) => ({
//         answer: opt.text,
//         correct_or_not: opt.isCorrect ? "1" : "0",
//         question_explanation: opt.explanation || "",
//       })),
//     };

//     try {
//       const res = await dispatch(handleAddParagraphQuestion({ body: payload })).unwrap();

//       if (res?.data?.status === "success") {
//         toast.success("تم إضافة السؤال الجديد إلى الفقرة بنجاح");
//         refreshQuestions();
//         setAddingQuestionToParagraph(null);
//         setNewParagraphQuestionText("");
//         setNewParagraphQuestionOptions([
//           { id: makeTempId("opt"), text: "", explanation: "", isCorrect: true },
//           { id: makeTempId("opt"), text: "", explanation: "", isCorrect: false },
//         ]);
//       } else {
//         toast.error(res?.data?.message || "فشل إضافة السؤال");
//       }
//     } catch (e) {
//       toast.error("حصل خطأ أثناء إضافة السؤال");
//     }
//   };

//   // =========================
//   // Handle delete - FIXED VERSION
//   // =========================
//   const handleDeleteAny = async () => {
//     if (!questionToDelete) return;

//     try {
//       let res;

//       if (questionToDelete.type === "mcq" || questionToDelete.type === "t_f") {
//         res = await dispatch(
//           handleDeleteExamQuestions({ body: { id: questionToDelete.id } })
//         ).unwrap();
//       } else if (questionToDelete.type === "paragraph") {
//         res = await dispatch(
//           handleDeleteParagraph({ body: { id: questionToDelete.id } })
//         ).unwrap();
//       } else if (questionToDelete.type === "paragraph_question") {
//         // Handle deletion of individual question within paragraph
//         res = await dispatch(
//           handleDeleteExamQuestions({ body: { id: questionToDelete.id } })
//         ).unwrap();
//       }

//       if (res?.data?.status === "success") {
//         toast.success("تم الحذف بنجاح");

//         // Close the modal immediately
//         setDeleteModal(false);
//         setQuestionToDelete(null);

//         // Force close any expanded state for the deleted item
//         if (questionToDelete.type === "mcq" || questionToDelete.type === "t_f") {
//           const key = `${questionToDelete.type === "mcq" ? "mcq" : "t_f"}-${questionToDelete.id}`;
//           setExpandedQuestions(prev => ({ ...prev, [key]: false }));
//         } else if (questionToDelete.type === "paragraph") {
//           const key = `paragraph-${questionToDelete.id}`;
//           setExpandedQuestions(prev => ({ ...prev, [key]: false }));
//         } else if (questionToDelete.type === "paragraph_question") {
//           // If deleting a question from a paragraph, close the paragraph edit mode
//           if (editingQuestionId === questionToDelete.paragraphId) {
//             cancelEditing();
//           }
//         }

//         // If editing the deleted item, cancel editing
//         if (editingQuestionId === questionToDelete.id) {
//           cancelEditing();
//         }

//         // Refresh immediately and wait for API
//         await refreshQuestions();

//       } else {
//         toast.error(res?.data?.message || "فشل الحذف");
//       }
//     } catch (e) {
//       console.error("Delete error:", e);
//       toast.error("حصل خطأ أثناء الحذف");

//       // Even on error, refresh to get current state
//       refreshQuestions();
//     } finally {
//       // Ensure modal is closed even on error
//       setDeleteModal(false);
//       setQuestionToDelete(null);
//     }
//   };

//   const handleEditParagraphContent = (q) => {
//     const data_send = { id: q?.id, paragraph_content: editingParagraphContent };

//     dispatch(handleEditParagraph({ body: data_send }))
//       .unwrap()
//       .then((res) => {
//         if (res?.data?.status === "success") {
//           toast.success("تم تعديل الفقرة بنجاح");
//           refreshQuestions();
//           cancelEditing();
//         } else {
//           toast.error(res?.data?.message || "فشل تعديل الفقرة");
//         }
//       })
//       .catch(() => toast.error("حصل خطأ أثناء تعديل نص الفقرة"));
//   };

//   // =========================
//   // Render Question Content (editing vs normal)
//   // =========================
//   const renderQuestionContent = (q) => {
//     const isEditing = editingQuestionId === q.id;

//     if (isEditing) {
//       const isMCQ = q.type === "mcq";
//       const isTF = q.type === "t_f";
//       const isParagraph = q.type === "paragraph_mcq";

//       return (
//         <div className="space-y-6">
//           <div className="flex items-center justify-between mb-4 p-4 bg-blue-50 rounded-lg">
//             <div className="flex items-center gap-3">
//               <span className="font-bold text-lg">
//                 {isMCQ ? "تعديل سؤال MCQ" : isTF ? "تعديل سؤال صح/خطأ" : "تعديل فقرة"}
//               </span>
//             </div>
//             <Space>
//               <Button onClick={cancelEditing} icon={<X className="w-4 h-4" />}>
//                 إلغاء
//               </Button>
//               {isMCQ && (
//                 <Button
//                   type="primary"
//                   icon={<Save className="w-4 h-4" />}
//                   loading={edit_question_loading}
//                   onClick={() => handleSaveMCQ(q)}
//                 >
//                   حفظ
//                 </Button>
//               )}
//               {isTF && (
//                 <Button
//                   type="primary"
//                   icon={<Save className="w-4 h-4" />}
//                   loading={edit_question_loading}
//                   onClick={() => handleSaveTF(q)}
//                 >
//                   حفظ
//                 </Button>
//               )}
//             </Space>
//           </div>

//           {/* Instruction field for all question types */}
//           {!isParagraph && <div className="space-y-2">
//             <label htmlFor="instruction" className="block text-lg font-medium text-gray-700">
//               تعليمات السؤال (اختياري)
//             </label>
//             <input
//               id="instruction"
//               type="text"
//               value={editingInstruction}
//               onChange={(e) => setEditingInstruction(e.target.value)}
//               className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               placeholder="مثال: اختر الإجابة الصحيحة، أكمل الجملة التالية، إلخ..."
//             />
//             <p className="text-md text-gray-500">
//               هذه التعليمات ستظهر للطالب قبل الإجابة على السؤال
//             </p>
//           </div>}

//           <Divider />

//           {/* MCQ EDIT */}
//           {isMCQ && (
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-lg font-semibold mb-2">
//                   نص السؤال
//                 </label>
//                 <div className="border border-gray-300 rounded-lg">
//                   <ReactQuill
//                     value={editingContent}
//                     onChange={setEditingContent}
//                     modules={quillModules}
//                     formats={quillFormats}
//                     className="min-h-[120px]"
//                   />
//                 </div>
//               </div>

//               <Divider />

//               <div className="space-y-4">
//                 <div className="flex justify-between items-center">
//                   <div className="flex items-center gap-3">
//                     <label className="font-semibold">الخيارات</label>
//                     <Button
//                       type="dashed"
//                       icon={<Plus className="w-4 h-4" />}
//                       onClick={addOptionToMCQ}
//                       size="small"
//                     >
//                       إضافة خيار
//                     </Button>
//                   </div>
//                   <span className="text-lg text-gray-500">
//                     اختر الإجابة الصحيحة
//                   </span>
//                 </div>

//                 {editingOptions.map((opt, idx) => {
//                   console.log("opt", opt);
//                   return (
//                     <div
//                       key={opt.id}
//                       className={`p-4 border rounded-lg relative ${editingCorrectAnswer === idx ? "border-green-400 bg-green-50" : "border-gray-300"
//                         }`}
//                     >
//                       <div className="flex items-center justify-between mb-3">
//                         <div className="flex items-center gap-3">
//                           <input
//                             type="radio"
//                             checked={editingCorrectAnswer === idx}
//                             onChange={() => {
//                               setEditingCorrectAnswer(idx);
//                               setEditingOptions(prev =>
//                                 prev.map((o, ii) => ({
//                                   ...o,
//                                   isCorrect: ii === idx,
//                                 }))
//                               );
//                             }}
//                             className="w-5 h-5"
//                           />
//                           <span className="font-medium">
//                             {editingCorrectAnswer === idx ? "إجابة صحيحة" : "تحديد كإجابة صحيحة"}
//                           </span>
//                         </div>
//                         <Space>
//                           <span className="px-3 py-1 bg-gray-100 rounded">
//                             {String.fromCharCode(1632 + idx + 1)}
//                           </span>
//                           {editingOptions.length > 2 && (
//                             <Button
//                               danger
//                               type="text"
//                               icon={<Minus className="w-4 h-4" />}
//                               onClick={() => removeOptionFromMCQ(idx)}
//                               size="small"
//                             />
//                           )}
//                         </Space>
//                       </div>

//                       <div className="space-y-3 pl-8">
//                         <div>
//                           <label className="text-lg mb-1 block">نص الخيار</label>
//                           <div className="border border-gray-300 rounded">
//                             <ReactQuill
//                               value={opt.text}
//                               onChange={(v) => {
//                                 setEditingOptions(prev => {
//                                   const copy = [...prev];
//                                   copy[idx] = { ...copy[idx], text: v };
//                                   return copy;
//                                 });
//                               }}
//                               modules={quillModules}
//                               formats={quillFormats}
//                               className="min-h-[80px]"
//                             />
//                           </div>
//                         </div>

//                         <div>
//                           <label className="text-lg mb-1 block">الشرح (اختياري)</label>
//                           <div className="border border-gray-300 rounded">
//                             <ReactQuill
//                               value={opt.explanation}
//                               onChange={(v) => {
//                                 setEditingOptions(prev => {
//                                   const copy = [...prev];
//                                   copy[idx] = { ...copy[idx], explanation: v };
//                                   return copy;
//                                 });
//                               }}
//                               modules={quillModules}
//                               formats={quillFormats}
//                               className="min-h-[80px]"
//                             />
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 }
//                 )}

//                 <div className="flex justify-between items-center pt-4">
//                   <div className="text-lg text-gray-500">
//                     <AlertCircle className="w-4 h-4 inline mr-1" />
//                     {editingOptions.length} خيارات
//                   </div>
//                   <Button
//                     type="primary"
//                     icon={<Save className="w-4 h-4" />}
//                     loading={edit_question_loading}
//                     onClick={() => handleSaveMCQ(q)}
//                   >
//                     حفظ السؤال
//                   </Button>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* T/F EDIT */}
//           {isTF && (
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-lg font-semibold mb-2">
//                   نص السؤال
//                 </label>
//                 <div className="border border-gray-300 rounded-lg">
//                   <ReactQuill
//                     value={editingTFContent}
//                     onChange={setEditingTFContent}
//                     modules={quillModules}
//                     formats={quillFormats}
//                     className="min-h-[120px]"
//                   />
//                 </div>
//               </div>

//               <Divider />

//               <div className="space-y-4">
//                 <div className="flex justify-between items-center mb-4">
//                   <label className="font-semibold">الإجابة الصحيحة</label>
//                   <div className="flex gap-6">
//                     <label className="flex items-center gap-2 cursor-pointer">
//                       <input
//                         type="radio"
//                         checked={editingTFAnswer === true}
//                         onChange={() => setEditingTFAnswer(true)}
//                         className="w-5 h-5"
//                       />
//                       <div className="flex items-center gap-2">
//                         <CheckCircle className="w-5 h-5 text-green-600" />
//                         <span className="font-medium">صح</span>
//                       </div>
//                     </label>
//                     <label className="flex items-center gap-2 cursor-pointer">
//                       <input
//                         type="radio"
//                         checked={editingTFAnswer === false}
//                         onChange={() => setEditingTFAnswer(false)}
//                         className="w-5 h-5"
//                       />
//                       <div className="flex items-center gap-2">
//                         <XCircle className="w-5 h-5 text-red-600" />
//                         <span className="font-medium">خطأ</span>
//                       </div>
//                     </label>
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-lg font-semibold mb-2">
//                     شرح الإجابة (اختياري)
//                   </label>
//                   <div className="border border-gray-300 rounded-lg">
//                     <ReactQuill
//                       value={editingTFExplanation}
//                       onChange={setEditingTFExplanation}
//                       modules={quillModules}
//                       formats={quillFormats}
//                       className="min-h-[100px]"
//                     />
//                   </div>
//                 </div>

//                 <div className="flex justify-between items-center pt-4">
//                   <div className="text-lg text-gray-500">
//                     <AlertCircle className="w-4 h-4 inline mr-1" />
//                     سؤال صح/خطأ
//                   </div>
//                   <Button
//                     type="primary"
//                     icon={<Save className="w-4 h-4" />}
//                     loading={edit_question_loading}
//                     onClick={() => handleSaveTF(q)}
//                   >
//                     حفظ السؤال
//                   </Button>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* PARAGRAPH EDIT */}
//           {isParagraph && (
//             <div className="space-y-6">
//               <div>
//                 <div className="flex justify-between items-center mb-4">
//                   <label className="font-semibold">نص الفقرة</label>
//                   <Space>
//                     <Button
//                       type="primary"
//                       loading={edit_paragraph_loading}
//                       onClick={() => handleEditParagraphContent(q)}
//                       icon={<Save className="w-4 h-4" />}
//                     >
//                       حفظ الفقرة
//                     </Button>
//                   </Space>
//                 </div>
//                 <div className="border border-gray-300 rounded-lg">
//                   <ReactQuill
//                     value={editingParagraphContent}
//                     onChange={setEditingParagraphContent}
//                     modules={quillModules}
//                     formats={quillFormats}
//                     className="min-h-[150px]"
//                   />
//                 </div>
//               </div>

//               <Divider />

//               <div>
//                 <div className="flex justify-between items-center mb-4">
//                   <label className="font-semibold">أسئلة الفقرة</label>
//                   <Button
//                     type="primary"
//                     onClick={() => startAddingQuestionToParagraph(q)}
//                     icon={<Plus className="w-4 h-4" />}
//                   >
//                     إضافة سؤال جديد
//                   </Button>
//                 </div>

//                 {editingParagraphQuestions.length === 0 ? (
//                   <div className="text-center py-8 text-gray-500">
//                     لا توجد أسئلة
//                   </div>
//                 ) : (
//                   <div className="space-y-4">
//                     {editingParagraphQuestions.map((pq, qIdx) => (
//                       <div key={pq.id} className="border border-gray-300 rounded-lg p-4">
//                         <div className="flex justify-between items-center mb-4">
//                           <div className="font-semibold">سؤال {qIdx + 1}</div>
//                           <Space>
//                             <Button
//                               icon={<Edit3 className="w-4 h-4" />}
//                               onClick={() => {
//                                 setEditingParagraphQuestions(prev =>
//                                   prev.map((item, idx) =>
//                                     idx === qIdx
//                                       ? { ...item, isEditing: !item.isEditing }
//                                       : { ...item, isEditing: false }
//                                   )
//                                 );
//                               }}
//                             >
//                               {pq.isEditing ? "إلغاء التعديل" : "تعديل"}
//                             </Button>
//                             <Button
//                               danger
//                               icon={<Trash2 className="w-4 h-4" />}
//                               onClick={() => {
//                                 setQuestionToDelete({
//                                   type: "paragraph_question",
//                                   id: pq.rawData?.id,
//                                   paragraphId: q.id
//                                 });
//                                 setDeleteModal(true);
//                               }}
//                             >
//                               حذف
//                             </Button>
//                           </Space>
//                         </div>

//                         {/* Instruction for paragraph question */}
//                         {pq.instruction && !pq.isEditing && (
//                           <div className="mb-3 p-3 bg-blue-50 rounded-lg">
//                             <div className="flex items-center gap-2 text-blue-700">
//                               <Info className="w-4 h-4" />
//                               <span className="font-medium">التعليمات:</span>
//                             </div>
//                             <div className="mt-1 text-lg text-blue-800">
//                               {pq.instruction}
//                             </div>
//                           </div>
//                         )}

//                         {pq.isEditing ? (
//                           <div className="space-y-4">
//                             {/* Instruction field for paragraph question in edit mode */}
//                             <div className="space-y-2">
//                               <label htmlFor="paragraph-question-instruction" className="block text-lg font-medium text-gray-700">
//                                 تعليمات السؤال (اختياري)
//                               </label>
//                               <input
//                                 id="paragraph-question-instruction"
//                                 type="text"
//                                 value={pq.instruction}
//                                 onChange={(e) => {
//                                   setEditingParagraphQuestions(prev => {
//                                     const copy = [...prev];
//                                     copy[qIdx] = { ...copy[qIdx], instruction: e.target.value };
//                                     return copy;
//                                   });
//                                 }}
//                                 className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                 placeholder="مثال: اختر الإجابة الصحيحة بناءً على الفقرة..."
//                               />
//                             </div>

//                             <div>
//                               <label className="text-lg mb-1 block">نص السؤال</label>
//                               <div className="border border-gray-300 rounded">
//                                 <ReactQuill
//                                   value={pq.questionText}
//                                   onChange={(v) => {
//                                     setEditingParagraphQuestions(prev => {
//                                       const copy = [...prev];
//                                       copy[qIdx] = { ...copy[qIdx], questionText: v };
//                                       return copy;
//                                     });
//                                   }}
//                                   modules={quillModules}
//                                   formats={quillFormats}
//                                   className="min-h-[80px]"
//                                 />
//                               </div>
//                             </div>

//                             <div className="space-y-3">
//                               <div className="flex justify-between items-center">
//                                 <div className="flex items-center gap-3">
//                                   <label className="font-medium">الخيارات</label>
//                                   <Button
//                                     type="dashed"
//                                     icon={<Plus className="w-4 h-4" />}
//                                     onClick={() => addOptionToParagraphQuestion(qIdx)}
//                                     size="small"
//                                   >
//                                     إضافة خيار
//                                   </Button>
//                                 </div>
//                               </div>
//                               {pq.options.map((opt, oIdx) => (
//                                 <div key={opt.id}
//                                   className={`p-4 border rounded-lg ${opt.isCorrect ? 'border-green-400 bg-green-50' : 'border-gray-300'}`}
//                                 >
//                                   <div className="flex items-center justify-between mb-2">
//                                     <div className="flex items-center gap-3">
//                                       <input
//                                         type="radio"
//                                         checked={!!opt.isCorrect}
//                                         onChange={() => {
//                                           setEditingParagraphQuestions(prev => {
//                                             const copy = [...prev];
//                                             const qCopy = { ...copy[qIdx] };
//                                             qCopy.options = qCopy.options.map((o, ii) => ({
//                                               ...o,
//                                               isCorrect: ii === oIdx,
//                                             }));
//                                             copy[qIdx] = qCopy;
//                                             return copy;
//                                           });
//                                         }}
//                                         className="w-4 h-4"
//                                       />
//                                       <span>الإجابة {oIdx + 1}</span>
//                                     </div>
//                                     <Space>
//                                       <span>{String.fromCharCode(1632 + oIdx + 1)}</span>
//                                       {pq.options.length > 2 && (
//                                         <Button
//                                           danger
//                                           type="text"
//                                           icon={<Minus className="w-4 h-4" />}
//                                           onClick={() => removeOptionFromParagraphQuestion(qIdx, oIdx)}
//                                           size="small"
//                                         />
//                                       )}
//                                     </Space>
//                                   </div>
//                                   <div className="space-y-2 pl-7">
//                                     <div>
//                                       <label className="text-lg mb-1 block">نص الخيار</label>
//                                       <div className="border border-gray-300 rounded">
//                                         <ReactQuill
//                                           value={opt.text}
//                                           onChange={(v) => {
//                                             setEditingParagraphQuestions(prev => {
//                                               const copy = [...prev];
//                                               const qCopy = { ...copy[qIdx] };
//                                               const opts = [...qCopy.options];
//                                               opts[oIdx] = { ...opts[oIdx], text: v };
//                                               qCopy.options = opts;
//                                               copy[qIdx] = qCopy;
//                                               return copy;
//                                             });
//                                           }}
//                                           modules={quillModules}
//                                           formats={quillFormats}
//                                           className="min-h-[60px]"
//                                         />
//                                       </div>
//                                     </div>
//                                     <div>
//                                       <label className="text-lg mb-1 block">الشرح (اختياري)</label>
//                                       <div className="border border-gray-300 rounded">
//                                         <ReactQuill
//                                           value={opt.explanation}
//                                           onChange={(v) => {
//                                             setEditingParagraphQuestions(prev => {
//                                               const copy = [...prev];
//                                               const qCopy = { ...copy[qIdx] };
//                                               const opts = [...qCopy.options];
//                                               opts[oIdx] = { ...opts[oIdx], explanation: v };
//                                               qCopy.options = opts;
//                                               copy[qIdx] = qCopy;
//                                               return copy;
//                                             });
//                                           }}
//                                           modules={quillModules}
//                                           formats={quillFormats}
//                                           className="min-h-[60px]"
//                                         />
//                                       </div>
//                                     </div>
//                                   </div>
//                                 </div>
//                               ))}
//                             </div>

//                             <div className="flex justify-between items-center pt-4">
//                               <div className="text-lg text-gray-500">
//                                 {pq.options.length} خيارات
//                               </div>
//                               <Button
//                                 type="primary"
//                                 icon={<Save className="w-4 h-4" />}
//                                 onClick={() => handleSaveParagraph(pq)}
//                                 loading={edit_question_loading}
//                               >
//                                 حفظ التعديلات
//                               </Button>
//                             </div>
//                           </div>
//                         ) : (
//                           <div className={textWrapClass}>
//                             {/* Display instruction if exists */}
//                             {pq.instruction && (
//                               <div className="mb-3 p-3 bg-blue-50 rounded-lg">
//                                 <div className="flex items-center gap-2 text-blue-700">
//                                   <Info className="w-4 h-4" />
//                                   <span className="font-medium">التعليمات:</span>
//                                 </div>
//                                 <div className="mt-1 text-lg text-blue-800">
//                                   {pq.instruction}
//                                 </div>
//                               </div>
//                             )}
                            
//                             <div
//                               className="mb-3"
//                               dangerouslySetInnerHTML={{ __html: pq.questionText }}
//                             />
//                             <div className="space-y-2">
//                               {pq.options.map((opt, oIdx) => (
//                                 <div
//                                   key={opt.id}
//                                   className={`p-2 rounded ${opt.isCorrect ? 'bg-green-50' : 'bg-gray-50'} ${textWrapClass}`}
//                                 >
//                                   <span className="font-medium mr-2">
//                                     {String.fromCharCode(1632 + oIdx + 1)}:
//                                   </span>
//                                   <span
//                                     dangerouslySetInnerHTML={{ __html: opt.text }}
//                                   />
//                                   {opt.explanation && (
//                                     <div className="mt-1 text-lg text-gray-600">
//                                       <span className="font-medium">الشرح:</span>
//                                       <span dangerouslySetInnerHTML={{ __html: opt.explanation }} />
//                                     </div>
//                                   )}
//                                 </div>
//                               ))}
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}
//         </div>
//       );
//     }

//     // =========================
//     // Normal Display Mode
//     // =========================
//     return (
//       <div className="space-y-4">
//         {q.type === "paragraph_mcq" && (
//           <div className="mb-6">
//             <div className="flex justify-between items-center mb-4">
//               <div className="flex items-center gap-2">
//                 <FileText className="w-5 h-5" />
//                 <span className="font-bold">الفقرة</span>
//               </div>
//               <Space>
//                 <Button
//                   icon={<Edit3 className="w-4 h-4" />}
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     e.preventDefault();
//                     startEditing(q);
//                   }}
//                 >
//                   تعديل الفقرة
//                 </Button>
//                 <Button
//                   danger
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     e.preventDefault();
//                     setQuestionToDelete({ type: "paragraph", id: q?.id });
//                     setDeleteModal(true);
//                   }}
//                   icon={<Trash2 className="w-4 h-4" />}
//                 >
//                   حذف الفقرة
//                 </Button>
//                 <Button
//                   type="primary"
//                   icon={<Plus className="w-4 h-4" />}
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     e.preventDefault();
//                     startAddingQuestionToParagraph(q);
//                   }}
//                 >
//                   إضافة سؤال
//                 </Button>
//               </Space>
//             </div>
//             <div
//               className={`border border-gray-300 rounded-lg p-4 bg-gray-50 ${textWrapClass}`}
//               dangerouslySetInnerHTML={{ __html: q.paragraphContent }}
//             />
//           </div>
//         )}

//         <div className="space-y-6">
//           {(q.type === "mcq"
//             ? [
//               {
//                 id: q.id,
//                 questionText: q.question,
//                 instruction: q.instruction, // Include instruction
//                 options: q.options,
//                 correctAnswer: q.correctAnswer,
//                 type: "mcq",
//               },
//             ]
//             : q.type === "t_f"
//               ? [
//                 {
//                   id: q.id,
//                   questionText: q.question,
//                   instruction: q.instruction, // Include instruction
//                   correctAnswer: q.correctAnswer,
//                   explanation: q.options?.[0]?.explanation || "",
//                   type: "t_f",
//                 },
//               ]
//               : q.questions
//           ).map((item, qIdx) => (
//             <div key={item.id || qIdx} className="border border-gray-300 rounded-lg p-4">
//               <div className="flex justify-between items-center mb-4">
//                 <div className="font-semibold">
//                   {q.type === "paragraph_mcq" ? `سؤال ${qIdx + 1}` :
//                     q.type === "t_f" ? "سؤال صح/خطأ" : "سؤال MCQ"}
//                 </div>
//                 <Space>
//                   {q.type === "mcq" ? (
//                     <>
//                       <Button
//                         icon={<Edit3 className="w-4 h-4" />}
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           e.preventDefault();
//                           startEditing(q);
//                         }}
//                       >
//                         تعديل
//                       </Button>
//                       <Button
//                         danger
//                         icon={<Trash2 className="w-4 h-4" />}
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           e.preventDefault();
//                           setQuestionToDelete({ type: "mcq", id: q.id });
//                           setDeleteModal(true);
//                         }}
//                       >
//                         حذف
//                       </Button>
//                     </>
//                   ) : q.type === "t_f" ? (
//                     <>
//                       <Button
//                         icon={<Edit3 className="w-4 h-4" />}
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           e.preventDefault();
//                           startEditing(q);
//                         }}
//                       >
//                         تعديل
//                       </Button>
//                       <Button
//                         danger
//                         icon={<Trash2 className="w-4 h-4" />}
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           e.preventDefault();
//                           setQuestionToDelete({ type: "t_f", id: q.id });
//                           setDeleteModal(true);
//                         }}
//                       >
//                         حذف
//                       </Button>
//                     </>
//                   ) : (
//                     <>
//                       <Button
//                         icon={<Edit3 className="w-4 h-4" />}
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           e.preventDefault();
//                           startEditingParagraphQuestion(q, qIdx);
//                         }}
//                       >
//                         تعديل
//                       </Button>
//                       <Button
//                         danger
//                         icon={<Trash2 className="w-4 h-4" />}
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           e.preventDefault();
//                           setQuestionToDelete({
//                             type: "paragraph_question",
//                             id: item.rawData?.id,
//                             paragraphId: q.id
//                           });
//                           setDeleteModal(true);
//                         }}
//                       >
//                         حذف
//                       </Button>
//                     </>
//                   )}
//                 </Space>
//               </div>

//               {/* Display instruction if exists */}
//               {item.instruction && (
//                 <div className="mb-4 p-3 bg-blue-50 rounded-lg">
//                   <div className="flex items-center gap-2 text-blue-700">
//                     <Info className="w-4 h-4" />
//                     <span className="font-medium">التعليمات:</span>
//                   </div>
//                   <div className="mt-1 text-lg text-blue-800">
//                     {item.instruction}
//                   </div>
//                 </div>
//               )}

//               <div
//                 className={`mb-4 ${textWrapClass}`}
//                 dangerouslySetInnerHTML={{ __html: item.questionText }}
//               />

//               {/* Render T/F answer */}
//               {q.type === "t_f" && (
//                 <div className="mt-4">
//                   <div className={`p-4 rounded-lg ${q.correctAnswer ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
//                     <div className="flex items-center gap-3">
//                       {q.correctAnswer ? (
//                         <>
//                           <CheckCircle className="w-5 h-5 text-green-600" />
//                           <span className="font-bold text-green-700">الإجابة الصحيحة: صح</span>
//                         </>
//                       ) : (
//                         <>
//                           <XCircle className="w-5 h-5 text-red-600" />
//                           <span className="font-bold text-red-700">الإجابة الصحيحة: خطأ</span>
//                         </>
//                       )}
//                     </div>
//                     {item.explanation && (
//                       <div className={`mt-3 pt-3 border-t border-gray-200 ${textWrapClass}`}>
//                         <div className="text-lg font-medium text-gray-700 mb-1">الشرح:</div>
//                         <div className="text-gray-600" dangerouslySetInnerHTML={{ __html: item.explanation }} />
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               )}

//               {/* Render MCQ options */}
//               {q.type === "mcq" && (
//                 <div className="space-y-2">
//                   {item.options?.map((opt, oIdx) => (
//                     <div
//                       key={opt.id}
//                       className={`p-2 rounded ${opt.isCorrect || oIdx === item.correctAnswer ? 'bg-green-50 border border-green-200' : 'bg-gray-50'} ${textWrapClass}`}
//                     >
//                       <div className="flex items-center gap-2">
//                         <span className="font-medium">
//                           {String.fromCharCode(1632 + oIdx + 1)}:
//                         </span>
//                         <span
//                           dangerouslySetInnerHTML={{ __html: opt.text }}
//                         />
//                       </div>
//                       {opt.explanation && (
//                         <div className={`mt-1 text-lg text-gray-600 pr-6 ${textWrapClass}`}>
//                           <span className="font-medium">الشرح:</span>
//                           <span dangerouslySetInnerHTML={{ __html: opt.explanation }} />
//                         </div>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               )}

//               {/* Render Paragraph question options */}
//               {q.type === "paragraph_mcq" && (
//                 <div className="space-y-2">
//                   {item.options?.map((opt, oIdx) => (
//                     <div
//                       key={opt.id}
//                       className={`p-2 rounded ${opt.isCorrect ? 'bg-green-50 border border-green-200' : 'bg-gray-50'} ${textWrapClass}`}
//                     >
//                       <div className="flex items-center gap-2">
//                         <span className="font-medium">
//                           {String.fromCharCode(1632 + oIdx + 1)}:
//                         </span>
//                         <span
//                           dangerouslySetInnerHTML={{ __html: opt.text }}
//                         />
//                       </div>
//                       {opt.explanation && (
//                         <div className={`mt-1 text-lg text-gray-600 pr-6 ${textWrapClass}`}>
//                           <span className="font-medium">الشرح:</span>
//                           <span dangerouslySetInnerHTML={{ __html: opt.explanation }} />
//                         </div>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       </div>
//     );
//   };

//   // =========================
//   // Modal لإضافة سؤال إلى فقرة
//   // =========================
//   const renderAddQuestionToParagraphModal = () => {
//     if (!addingQuestionToParagraph) return null;

//     return (
//       <Modal
//         title={
//           <div className="flex items-center gap-2">
//             <Plus className="w-5 h-5" />
//             <span>إضافة سؤال جديد إلى الفقرة</span>
//           </div>
//         }
//         open={!!addingQuestionToParagraph}
//         onCancel={() => {
//           setAddingQuestionToParagraph(null);
//           setNewParagraphQuestionText("");
//           setNewParagraphQuestionOptions([
//             { id: makeTempId("opt"), text: "", explanation: "", isCorrect: true },
//             { id: makeTempId("opt"), text: "", explanation: "", isCorrect: false },
//           ]);
//         }}
//         footer={[
//           <Button
//             key="cancel"
//             onClick={() => {
//               setAddingQuestionToParagraph(null);
//               setNewParagraphQuestionText("");
//               setNewParagraphQuestionOptions([
//                 { id: makeTempId("opt"), text: "", explanation: "", isCorrect: true },
//                 { id: makeTempId("opt"), text: "", explanation: "", isCorrect: false },
//               ]);
//             }}
//           >
//             إلغاء
//           </Button>,
//           <Button
//             key="submit"
//             type="primary"
//             loading={create_question_loading}
//             onClick={handleSaveNewParagraphQuestion}
//           >
//             إضافة السؤال
//           </Button>,
//         ]}
//         width={700}
//       >
//         <div className="space-y-6">
//           <div>
//             <label className="block font-semibold mb-2">
//               نص السؤال
//             </label>
//             <div className="border border-gray-300 rounded-lg">
//               <ReactQuill
//                 value={newParagraphQuestionText}
//                 onChange={setNewParagraphQuestionText}
//                 modules={quillModules}
//                 formats={quillFormats}
//                 className="min-h-[120px]"
//               />
//             </div>
//           </div>

//           <Divider>
//             <span>خيارات السؤال</span>
//           </Divider>

//           <div className="space-y-4">
//             <div className="flex justify-between items-center">
//               <div className="flex items-center gap-3">
//                 <label className="font-semibold">قم بتحديد الإجابة الصحيحة</label>
//                 <Button
//                   type="dashed"
//                   icon={<Plus className="w-4 h-4" />}
//                   onClick={addOptionToParagraphQuestionModal}
//                 >
//                   إضافة خيار
//                 </Button>
//               </div>
//             </div>

//             <div className="space-y-4">
//               {newParagraphQuestionOptions.map((opt, idx) => (
//                 <div
//                   key={opt.id}
//                   className={`p-4 border !rounded-lg ${opt.isCorrect ? 'border-green-400 bg-green-50' : 'border-gray-300'}`}
//                 >
//                   <div className="flex items-center justify-between mb-3">
//                     <div className="flex items-center gap-3">
//                       <input
//                         type="radio"
//                         checked={!!opt.isCorrect}
//                         onChange={() => {
//                           setNewParagraphQuestionOptions(prev =>
//                             prev.map((o, ii) => ({
//                               ...o,
//                               isCorrect: ii === idx,
//                             }))
//                           );
//                         }}
//                         className="w-4 h-4"
//                       />
//                       <span>الإجابة {idx + 1}</span>
//                     </div>
//                     <Space>
//                       <span className="px-3 py-1 bg-gray-100 rounded">
//                         {String.fromCharCode(1632 + idx + 1)}
//                       </span>
//                       {newParagraphQuestionOptions.length > 2 && (
//                         <Button
//                           danger
//                           type="text"
//                           icon={<Minus className="w-4 h-4" />}
//                           onClick={() => removeOptionFromParagraphQuestionModal(idx)}
//                           size="small"
//                         />
//                       )}
//                     </Space>
//                   </div>

//                   <div className="grid gap-3">
//                     <div>
//                       <label className="text-lg mb-1 block">نص الخيار</label>
//                       <div className="border border-gray-300 rounded">
//                         <ReactQuill
//                           value={opt.text}
//                           onChange={(v) => {
//                             setNewParagraphQuestionOptions(prev => {
//                               const copy = [...prev];
//                               copy[idx] = { ...copy[idx], text: v };
//                               return copy;
//                             });
//                           }}
//                           modules={quillModules}
//                           formats={quillFormats}
//                           className="min-h-[80px]"
//                         />
//                       </div>
//                     </div>

//                     <div>
//                       <label className="text-lg mb-1 block">
//                         <span className="text-gray-500">(اختياري)</span> الشرح
//                       </label>
//                       <div className="border border-gray-300 rounded">
//                         <ReactQuill
//                           value={opt.explanation}
//                           onChange={(v) => {
//                             setNewParagraphQuestionOptions(prev => {
//                               const copy = [...prev];
//                               copy[idx] = { ...copy[idx], explanation: v };
//                               return copy;
//                             });
//                           }}
//                           modules={quillModules}
//                           formats={quillFormats}
//                           className="min-h-[80px]"
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             <div className="flex justify-between items-center">
//               <div className="text-lg text-gray-500">
//                 <AlertCircle className="w-4 h-4 inline mr-1" />
//                 الخيار الأول هو الإجابة الصحيحة افتراضياً
//               </div>
//               <div className="text-lg text-gray-500">
//                 {newParagraphQuestionOptions.length} خيارات
//               </div>
//             </div>
//           </div>
//         </div>
//       </Modal>
//     );
//   };

//   // =========================
//   // Loading
//   // =========================
//   if (get_exam_question_loading) {
//     return (
//       <div className="flex flex-col items-center justify-center py-32">
//         <Spin size="large" />
//         <p className="mt-4 text-gray-600">جاري تحميل الأسئلة...</p>
//       </div>
//     );
//   }

//   // =========================
//   // Main Render
//   // =========================
//   return (
//     <Card title="أسئلة الامتحان" icon={FileText} className="p-0">
//       <div className="p-6">
//         {apiQuestions.length === 0 ? (
//           <div className="text-center py-16">
//             <Empty
//               description="لا توجد أسئلة في هذا القسم"
//               image={Empty.PRESENTED_IMAGE_SIMPLE}
//             />
//           </div>
//         ) : (
//           <div className="space-y-6">
//             <div className="mb-6">
//               <div className="flex items-center justify-between gap-3 mb-4">
//                 <div
//                   dangerouslySetInnerHTML={{ __html: selectedSection?.title || "قسم الامتحان" }}
//                   className={`text-2xl font-bold text-gray-900 ${textWrapClass}`}
//                 />
//                 <Tag color="blue">{apiQuestions?.length || 0} سؤال</Tag>
//               </div>
//             </div>

//             <div className="space-y-4">
//               {apiQuestions?.map((q, index) => {
//                 const isExp = isExpanded(q.id, q.type);
//                 const typeLabel =
//                   q.type === "mcq" ? "MCQ" :
//                     q.type === "t_f" ? "صح/خطأ" :
//                       "فقرة";

//                 return (
//                   <div
//                     key={`${q.type}-${q.id}`}
//                     className="border border-gray-300 rounded-lg overflow-hidden"
//                   >
//                     <div
//                       onClick={() => toggleQuestion(q.id, q.type)}
//                       className={`flex items-center justify-between p-4 cursor-pointer ${isExp ? 'bg-gray-50' : 'hover:bg-gray-50'
//                         }`}
//                     >
//                       <div className="flex items-center gap-4">
//                         <div className={`w-10 h-10 rounded-full flex items-center justify-center ${q.type === "mcq" ? 'bg-blue-100 text-blue-700' :
//                           q.type === "t_f" ? 'bg-orange-100 text-orange-700' :
//                             'bg-purple-100 text-purple-700'
//                           }`}>
//                           {index + 1}
//                         </div>
//                         <div>
//                           <div className="font-bold">
//                             {typeLabel}
//                             {q.type === "paragraph_mcq" && (
//                               <span className="text-lg text-gray-500 mr-2">
//                                 ({q.questions?.length || 0} أسئلة)
//                               </span>
//                             )}
//                           </div>
//                           <div className={`text-lg text-gray-500 ${textWrapClass}`}>
//                             {q.type === "mcq"
//                               ? stripHtml(q.question).substring(0, 50) + "..."
//                               : q.type === "t_f"
//                                 ? stripHtml(q.question).substring(0, 50) + "..."
//                                 : stripHtml(q.paragraphContent).substring(0, 50) + "..."
//                             }
//                           </div>
//                           {/* Show instruction in collapsed view if exists */}
//                           {q.instruction && !isExp && (
//                             <div className="text-md text-blue-600 mt-1 flex items-center gap-1">
//                               <Info className="w-3 h-3" />
//                               <span className="truncate">{q.instruction}</span>
//                             </div>
//                           )}
//                         </div>
//                       </div>

//                       <div className="flex items-center gap-2">
//                         {isExp ? (
//                           <ChevronUp className="w-5 h-5" />
//                         ) : (
//                           <ChevronDown className="w-5 h-5" />
//                         )}
//                       </div>
//                     </div>

//                     {isExp && (
//                       <div className="border-t border-gray-300">
//                         <div className="p-4">
//                           {renderQuestionContent(q)}
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         )}
//       </div>

//       {/* MODALS */}
//       {renderAddQuestionToParagraphModal()}

//       {/* DELETE MODAL */}
//       <Modal
//         open={deleteModal}
//         onCancel={() => setDeleteModal(false)}
//         onOk={handleDeleteAny}
//         okText="نعم، احذف"
//         cancelText="إلغاء"
//         okButtonProps={{
//           danger: true,
//           loading: delete_question_loading || delete_paragraph_loading,
//         }}
//         width={500}
//       >
//         <div className="py-6">
//           <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
//             <Trash2 className="w-8 h-8 text-red-600" />
//           </div>
//           <h3 className="text-xl font-bold text-center mb-2">تأكيد الحذف</h3>
//           <p className="text-gray-600 text-center">
//             هل أنت متأكد من الحذف؟
//             <br />
//             <span className="text-lg text-gray-500">
//               هذا الإجراء لا يمكن التراجع عنه
//             </span>
//           </p>
//         </div>
//       </Modal>
//     </Card>
//   );
// }

"use client";

import React, { useMemo, useState, useEffect, useCallback } from "react";
import {
  Edit3,
  Trash2,
  Save,
  X,
  ChevronDown,
  ChevronUp,
  FileText,
  Plus,
  Minus,
  AlertCircle,
  CheckCircle,
  XCircle,
  Info,
} from "lucide-react";
import { Empty, Spin, Tag, Button, Modal, Divider, Space } from "antd";
import { useDispatch, useSelector } from "react-redux";
import dynamic from "next/dynamic";
import Card from "./ExamCard";
import {
  handleDeleteExamQuestions,
  handleGetExamQuestions,
  handleUpdateExamQuestions,
  handleEditParagraph,
  handleDeleteParagraph,
  handleAddParagraphQuestion,
} from "../../lib/features/examSlice";
import { toast } from "react-toastify";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
import "react-quill-new/dist/quill.snow.css";

export default function DisplayQuestions({ selectedSectionId, selectedSection }) {
  const dispatch = useDispatch();

  const {
    get_exam_questions_list,
    get_exam_question_loading,
    delete_question_loading,
    edit_question_loading,
    edit_paragraph_loading,
    delete_paragraph_loading,
    create_question_loading,
  } = useSelector((state) => state?.exam);

  // =========================
  // Helpers
  // =========================
  const stripHtml = (html = "") =>
    String(html)
      .replace(/<[^>]*>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/\s+/g, " ")
      .trim();

  const isHtmlEmpty = (html) => stripHtml(html).length === 0;

  const makeTempId = (prefix = "temp") =>
    `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;

  const buildExpandedInitial = (message) => {
    const initial = {};
    const mcqList = message?.mcq || [];
    const paragraphs = message?.paragraphs || [];

    mcqList.forEach((q) => {
      const keyPrefix = q?.question_type === "t_f" ? "t_f" : "mcq";
      initial[`${keyPrefix}-${q.id}`] = false;
    });

    paragraphs.forEach((p) => {
      const pid = p?.paragraph?.id;
      if (pid) initial[`paragraph-${pid}`] = false;
    });

    return initial;
  };

  // =========================
  // UI State
  // =========================
  const [expandedQuestions, setExpandedQuestions] = useState({});
  const [editingQuestionId, setEditingQuestionId] = useState(null);

  // MCQ editing
  const [editingContent, setEditingContent] = useState("");
  const [editingOptions, setEditingOptions] = useState([]);
  const [editingCorrectAnswer, setEditingCorrectAnswer] = useState(0);
  const [editingInstruction, setEditingInstruction] = useState("");

  // T/F editing
  const [editingTFContent, setEditingTFContent] = useState("");
  const [editingTFAnswer, setEditingTFAnswer] = useState(true);
  const [editingTFExplanation, setEditingTFExplanation] = useState("");

  // Paragraph editing
  const [editingParagraphContent, setEditingParagraphContent] = useState("");
  const [editingParagraphQuestions, setEditingParagraphQuestions] = useState([]);

  // Add question to paragraph modal
  const [addingQuestionToParagraph, setAddingQuestionToParagraph] = useState(null);
  const [newParagraphQuestionText, setNewParagraphQuestionText] = useState("");
  const [newParagraphQuestionInstruction, setNewParagraphQuestionInstruction] = useState("");
  const [newParagraphQuestionOptions, setNewParagraphQuestionOptions] = useState([
    { id: makeTempId("opt"), text: "", explanation: "", isCorrect: true },
    { id: makeTempId("opt"), text: "", explanation: "", isCorrect: false },
  ]);

  // Delete modal
  const [deleteModal, setDeleteModal] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState(null);

  // =========================
  // Quill config
  // =========================
  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link"],
    ],
  };

  const quillFormats = ["header", "bold", "italic", "underline", "list", "bullet", "link"];

  // =========================
  // Init expands from store
  // =========================
  useEffect(() => {
    const msg = get_exam_questions_list?.data?.message;
    if (!msg) return;
    setExpandedQuestions(buildExpandedInitial(msg));
  }, [get_exam_questions_list]);

  // =========================
  // Parse API questions
  // =========================
  const apiQuestions = useMemo(() => {
    const data = get_exam_questions_list?.data?.message || selectedSection || { mcq: [], paragraphs: [] };

    const mcqSource = Array.isArray(data?.mcq) ? data.mcq : [];

    const allQuestions = mcqSource.map((q) => {
      const options = Array.isArray(q?.options) ? q.options : [];
      const instruction = q?.instructions || "";

      if (q?.question_type === "t_f") {
        const correctOption = options.find((o) => Number(o?.is_correct) === 1) || options[0];
        const correctText = (correctOption?.option_text || "").toLowerCase();

        // "true" if correct option is "صح/صحيح/true"
        const isTrue =
          correctText.includes("صحيح") ||
          correctText.includes("صح") ||
          correctText.includes("true") ||
          correctText.includes("✓");

        const explanation =
          options.find((o) => !!o?.question_explanation)?.question_explanation ||
          correctOption?.question_explanation ||
          "";

        return {
          id: q.id,
          type: "t_f",
          question: q?.question_text || "",
          instruction,
          correctAnswer: isTrue,
          options: options.map((opt) => ({
            id: opt?.id,
            text: opt?.option_text || "",
            explanation: opt?.question_explanation || "",
            isCorrect: Number(opt?.is_correct) === 1,
          })),
          rawData: q,
          tfExplanation: explanation,
        };
      }

      // MCQ
      const correctIndex = options.findIndex((opt) => Number(opt?.is_correct) === 1);

      return {
        id: q.id,
        type: "mcq",
        question: q?.question_text || "",
        instruction,
        correctAnswer: correctIndex >= 0 ? correctIndex : 0,
        options: options.map((opt) => ({
          id: opt?.id,
          text: opt?.option_text || "",
          explanation: opt?.question_explanation || "",
          isCorrect: Number(opt?.is_correct) === 1,
        })),
        rawData: q,
      };
    });

    const paragraphSource = Array.isArray(data?.paragraphs) ? data.paragraphs : [];
    const paragraphs = paragraphSource.map((p) => ({
      id: p?.paragraph?.id,
      type: "paragraph_mcq",
      paragraphContent: p?.paragraph?.paragraph_content || "",
      questions: (p?.questions || []).map((q) => ({
        id: q?.id,
        questionText: q?.question_text || "",
        instruction: q?.instructions || "",
        options: (q?.options || []).map((opt) => ({
          id: opt?.id,
          text: opt?.option_text || "",
          explanation: opt?.question_explanation || "",
          isCorrect: Number(opt?.is_correct) === 1,
        })),
        rawData: q,
      })),
      rawData: p,
    }));

    return [...allQuestions, ...paragraphs];
  }, [get_exam_questions_list, selectedSection, selectedSectionId]);

  // =========================
  // Styling helper
  // =========================
  const textWrapClass =
    "break-words whitespace-normal overflow-hidden max-w-full [&_*]:break-words [&_*]:whitespace-normal px-4";

  // =========================
  // Expand/collapse helpers
  // =========================
  const keyOf = (id, type) =>
    `${type === "mcq" ? "mcq" : type === "t_f" ? "t_f" : "paragraph"}-${id}`;

  const toggleQuestion = (id, type) => {
    const k = keyOf(id, type);

    setExpandedQuestions((prev) => {
      const expanded = !!prev[k];

      // لو بيقفل وهو بيمدّت نفس السؤال -> اقفل edit
      if (editingQuestionId === id && expanded) cancelEditing();

      return { ...prev, [k]: !expanded };
    });
  };

  const isExpanded = (id, type) => !!expandedQuestions[keyOf(id, type)];

  // =========================
  // Editing helpers
  // =========================
  const cancelEditing = () => {
    setEditingQuestionId(null);

    setEditingContent("");
    setEditingInstruction("");
    setEditingOptions([]);
    setEditingCorrectAnswer(0);

    setEditingTFContent("");
    setEditingTFAnswer(true);
    setEditingTFExplanation("");

    setEditingParagraphContent("");
    setEditingParagraphQuestions([]);
  };

  const startEditing = (q) => {
    if (!q?.id) return;

    // افتح السؤال لو مقفول
    const k = keyOf(q.id, q.type);
    setExpandedQuestions((prev) => ({ ...prev, [k]: true }));

    setEditingQuestionId(q.id);
    setEditingInstruction(q.instruction || "");

    if (q.type === "mcq") {
      setEditingContent(q.question || "");
      const opts = (q.options || []).map((o) => ({ ...o }));
      const correctIndex = opts.findIndex((o) => !!o.isCorrect);
      const safeIndex = correctIndex >= 0 ? correctIndex : q.correctAnswer ?? 0;

      setEditingCorrectAnswer(safeIndex);
      setEditingOptions(opts.map((o, idx) => ({ ...o, isCorrect: idx === safeIndex })));
      return;
    }

    if (q.type === "t_f") {
      setEditingTFContent(q.question || "");

      // تحديد الإجابة من الخيار الصح
      const correctOpt = (q.options || []).find((o) => o.isCorrect) || q.options?.[0];
      const txt = (correctOpt?.text || "").toLowerCase();
      const isTrue = txt.includes("صحيح") || txt.includes("صح") || txt.includes("true") || txt.includes("✓");

      setEditingTFAnswer(isTrue);
      setEditingTFExplanation(q.tfExplanation || correctOpt?.explanation || "");
      return;
    }

    if (q.type === "paragraph_mcq") {
      setEditingParagraphContent(q.paragraphContent || "");
      setEditingParagraphQuestions(
        (q.questions || []).map((pq) => ({
          id: pq.id,
          questionText: pq.questionText || "",
          instruction: pq.instruction || "",
          options: (pq.options || []).map((opt) => ({ ...opt })),
          rawData: pq.rawData,
          isEditing: false,
        }))
      );
    }
  };

  const startEditingParagraphQuestion = (paragraph, questionIndex) => {
    startEditing(paragraph);
    setTimeout(() => {
      setEditingParagraphQuestions((prev) =>
        prev.map((pq, idx) => ({ ...pq, isEditing: idx === questionIndex }))
      );
    }, 50);
  };

  // =========================
  // Refresh from API (safe)
  // =========================
  const refreshQuestions = useCallback(async () => {
    const sectionId = selectedSectionId || selectedSection?.id;
    if (!sectionId) return;

    try {
      const res = await dispatch(handleGetExamQuestions({ body: { exam_section_id: sectionId } })).unwrap();
      const msg = res?.data?.message;
      if (msg) setExpandedQuestions(buildExpandedInitial(msg));
      cancelEditing();
    } catch (err) {
      console.error("Error refreshing questions:", err);
    }
  }, [dispatch, selectedSectionId, selectedSection]);

  useEffect(() => {
    refreshQuestions();
  }, [refreshQuestions]);

  // =========================
  // Options add/remove
  // =========================
  const addOptionToMCQ = () => {
    setEditingOptions((prev) => [...prev, { id: makeTempId("opt"), text: "", explanation: "", isCorrect: false }]);
  };

  const removeOptionFromMCQ = (index) => {
    if (editingOptions.length <= 2) return toast.error("يجب أن يكون هناك خياران على الأقل");

    const removingCorrect = !!editingOptions[index]?.isCorrect;
    const newOptions = editingOptions.filter((_, i) => i !== index);

    if (removingCorrect && newOptions.length > 0) {
      newOptions[0].isCorrect = true;
      setEditingCorrectAnswer(0);
    } else if (index < editingCorrectAnswer) {
      setEditingCorrectAnswer(editingCorrectAnswer - 1);
    }

    setEditingOptions(newOptions);
  };

  const addOptionToParagraphQuestion = (questionIndex) => {
    setEditingParagraphQuestions((prev) => {
      const copy = [...prev];
      const qCopy = { ...copy[questionIndex] };
      qCopy.options = [...qCopy.options, { id: makeTempId("opt"), text: "", explanation: "", isCorrect: false }];
      copy[questionIndex] = qCopy;
      return copy;
    });
  };

  const removeOptionFromParagraphQuestion = (questionIndex, optionIndex) => {
    setEditingParagraphQuestions((prev) => {
      const copy = [...prev];
      const qCopy = { ...copy[questionIndex] };

      if (qCopy.options.length <= 2) {
        toast.error("يجب أن يكون هناك خياران على الأقل");
        return prev;
      }

      const removingCorrect = !!qCopy.options[optionIndex]?.isCorrect;
      const newOptions = qCopy.options.filter((_, i) => i !== optionIndex);

      if (removingCorrect && newOptions.length > 0) newOptions[0].isCorrect = true;

      qCopy.options = newOptions;
      copy[questionIndex] = qCopy;
      return copy;
    });
  };

  // =========================
  // Save MCQ
  // =========================
  const handleSaveMCQ = async (q) => {
    if (isHtmlEmpty(editingContent)) return toast.error("يرجى إدخال نص السؤال");

    const hasCorrect = (editingOptions || []).some((o) => !!o.isCorrect);
    if (!hasCorrect) return toast.error("يرجى تحديد إجابة صحيحة");

    const anyEmptyOpt = (editingOptions || []).some((o) => isHtmlEmpty(o.text));
    if (anyEmptyOpt) return toast.error("يرجى إدخال نص لكل خيار");

    const payload = {
      id: q.id,
      question_text: editingContent,
      instructions: editingInstruction || "Read carefully before answering",
      mcq_array: (editingOptions || []).map((opt) => ({
        answer: opt?.text || "",
        question_explanation: opt?.explanation || "",
        correct_or_not: opt?.isCorrect ? "1" : "0",
      })),
    };

    try {
      const res = await dispatch(handleUpdateExamQuestions({ body: payload })).unwrap();
      if (res?.data?.status === "success") {
        toast.success("تم تعديل السؤال بنجاح");
        await refreshQuestions();
      } else {
        toast.error(res?.data?.message || "فشل تعديل السؤال");
      }
    } catch {
      toast.error("حصل خطأ أثناء تعديل السؤال");
    }
  };

  // =========================
  // Save T/F
  // =========================
  const handleSaveTF = async (q) => {
    if (isHtmlEmpty(editingTFContent)) return toast.error("يرجى إدخال نص السؤال");

    const trueOption = {
      answer: "صحيح",
      correct_or_not: editingTFAnswer ? "1" : "0",
      question_explanation: editingTFExplanation || "",
    };

    const falseOption = {
      answer: "خطأ",
      correct_or_not: !editingTFAnswer ? "1" : "0",
      question_explanation: editingTFExplanation || "",
    };

    const payload = {
      id: q.id,
      question_text: editingTFContent,
      instructions: editingInstruction || "اختر الإجابة الصحيحة",
      question_type: "t_f",
      mcq_array: [trueOption, falseOption],
    };

    try {
      const res = await dispatch(handleUpdateExamQuestions({ body: payload })).unwrap();
      if (res?.data?.status === "success") {
        toast.success("تم تعديل السؤال بنجاح");
        await refreshQuestions();
      } else {
        toast.error(res?.data?.message || "فشل تعديل السؤال");
      }
    } catch {
      toast.error("حصل خطأ أثناء تعديل السؤال");
    }
  };

  // =========================
  // Save paragraph question
  // =========================
  const handleSaveParagraph = async (pq) => {
    const editingQuestion = editingParagraphQuestions.find((q) => q.id === pq.id);
    if (!editingQuestion) return;

    if (isHtmlEmpty(editingQuestion.questionText)) return toast.error("يرجى إدخال نص السؤال");

    const hasCorrect = (editingQuestion?.options || []).some((o) => !!o.isCorrect);
    if (!hasCorrect) return toast.error("يرجى تحديد إجابة صحيحة واحدة على الأقل");

    const anyEmptyOpt = (editingQuestion?.options || []).some((o) => isHtmlEmpty(o.text));
    if (anyEmptyOpt) return toast.error("يرجى إدخال نص لكل خيار");

    const payload = {
      id: editingQuestion?.rawData?.id,
      question_text: editingQuestion?.questionText,
      instructions: editingQuestion.instruction || "Read carefully before answering",
      mcq_array: (editingQuestion?.options || []).map((opt) => ({
        answer: opt.text,
        correct_or_not: opt.isCorrect ? "1" : "0",
        question_explanation: opt.explanation || "",
      })),
    };

    try {
      const res = await dispatch(handleUpdateExamQuestions({ body: payload })).unwrap();
      if (res?.data?.status === "success") {
        toast.success("تم تعديل السؤال بنجاح");
        setEditingParagraphQuestions((prev) =>
          prev.map((q) => (q.id === pq.id ? { ...q, isEditing: false } : q))
        );
        await refreshQuestions();
      } else {
        toast.error(res?.data?.message || "فشل تعديل السؤال");
      }
    } catch {
      toast.error("حصل خطأ أثناء تعديل السؤال");
    }
  };

  // =========================
  // Edit paragraph content
  // =========================
  const handleEditParagraphContent = (q) => {
    const data_send = { id: q?.id, paragraph_content: editingParagraphContent };

    dispatch(handleEditParagraph({ body: data_send }))
      .unwrap()
      .then(async (res) => {
        if (res?.data?.status === "success") {
          toast.success("تم تعديل الفقرة بنجاح");
          await refreshQuestions();
        } else {
          toast.error(res?.data?.message || "فشل تعديل الفقرة");
        }
      })
      .catch(() => toast.error("حصل خطأ أثناء تعديل نص الفقرة"));
  };

  // =========================
  // Add question to paragraph
  // =========================
  const startAddingQuestionToParagraph = (paragraph) => {
    setAddingQuestionToParagraph(paragraph);
    setNewParagraphQuestionText("");
    setNewParagraphQuestionInstruction("");
    setNewParagraphQuestionOptions([
      { id: makeTempId("opt"), text: "", explanation: "", isCorrect: true },
      { id: makeTempId("opt"), text: "", explanation: "", isCorrect: false },
    ]);
  };

  const addOptionToParagraphQuestionModal = () => {
    setNewParagraphQuestionOptions((prev) => [
      ...prev,
      { id: makeTempId("opt"), text: "", explanation: "", isCorrect: false },
    ]);
  };

  const removeOptionFromParagraphQuestionModal = (index) => {
    if (newParagraphQuestionOptions.length <= 2) return toast.error("يجب أن يكون هناك خياران على الأقل");

    const removingCorrect = !!newParagraphQuestionOptions[index]?.isCorrect;
    const newOptions = newParagraphQuestionOptions.filter((_, i) => i !== index);

    if (removingCorrect && newOptions.length > 0) newOptions[0].isCorrect = true;

    setNewParagraphQuestionOptions(newOptions);
  };

  const handleSaveNewParagraphQuestion = async () => {
    if (!addingQuestionToParagraph) return;

    if (isHtmlEmpty(newParagraphQuestionText)) return toast.error("يرجى إدخال نص السؤال");

    const hasCorrect = newParagraphQuestionOptions.some((opt) => !!opt.isCorrect);
    if (!hasCorrect) return toast.error("يرجى تحديد إجابة صحيحة واحدة على الأقل");

    const anyEmptyOpt = newParagraphQuestionOptions.some((o) => isHtmlEmpty(o.text));
    if (anyEmptyOpt) return toast.error("يرجى إدخال نص لكل خيار");

    const payload = {
      paragraph_id: addingQuestionToParagraph.id,
      exam_section_id: selectedSectionId,
      question_text: newParagraphQuestionText,
      instructions:
        newParagraphQuestionInstruction ||
        "Select the most appropriate answer based on the paragraph content.",
      mcq_array: newParagraphQuestionOptions.map((opt) => ({
        answer: opt.text,
        correct_or_not: opt.isCorrect ? "1" : "0",
        question_explanation: opt.explanation || "",
      })),
    };

    try {
      const res = await dispatch(handleAddParagraphQuestion({ body: payload })).unwrap();
      if (res?.data?.status === "success") {
        toast.success("تم إضافة السؤال الجديد إلى الفقرة بنجاح");
        setAddingQuestionToParagraph(null);
        await refreshQuestions();
      } else {
        toast.error(res?.data?.message || "فشل إضافة السؤال");
      }
    } catch {
      toast.error("حصل خطأ أثناء إضافة السؤال");
    }
  };

  // =========================
  // Delete
  // =========================
  const handleDeleteAny = async () => {
    if (!questionToDelete) return;

    try {
      let res;

      if (questionToDelete.type === "mcq" || questionToDelete.type === "t_f" || questionToDelete.type === "paragraph_question") {
        res = await dispatch(handleDeleteExamQuestions({ body: { id: questionToDelete.id } })).unwrap();
      } else if (questionToDelete.type === "paragraph") {
        res = await dispatch(handleDeleteParagraph({ body: { id: questionToDelete.id } })).unwrap();
      }

      if (res?.data?.status === "success") {
        toast.success("تم الحذف بنجاح");
        setDeleteModal(false);
        setQuestionToDelete(null);
        await refreshQuestions();
      } else {
        toast.error(res?.data?.message || "فشل الحذف");
      }
    } catch (e) {
      console.error("Delete error:", e);
      toast.error("حصل خطأ أثناء الحذف");
      await refreshQuestions();
    } finally {
      setDeleteModal(false);
      setQuestionToDelete(null);
    }
  };

  // =========================
  // Render Question Content
  // =========================
  const renderQuestionContent = (q) => {
    const isEditing = editingQuestionId === q.id;

    if (isEditing) {
      const isMCQ = q.type === "mcq";
      const isTF = q.type === "t_f";
      const isParagraph = q.type === "paragraph_mcq";

      return (
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-4 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-3">
              <span className="font-bold text-lg">
                {isMCQ ? "تعديل سؤال MCQ" : isTF ? "تعديل سؤال صح/خطأ" : "تعديل فقرة"}
              </span>
            </div>
            <Space>
              <Button onClick={cancelEditing} icon={<X className="w-4 h-4" />}>
                إلغاء
              </Button>

              {isMCQ && (
                <Button
                  type="primary"
                  icon={<Save className="w-4 h-4" />}
                  loading={edit_question_loading}
                  onClick={() => handleSaveMCQ(q)}
                >
                  حفظ
                </Button>
              )}

              {isTF && (
                <Button
                  type="primary"
                  icon={<Save className="w-4 h-4" />}
                  loading={edit_question_loading}
                  onClick={() => handleSaveTF(q)}
                >
                  حفظ
                </Button>
              )}
            </Space>
          </div>

          {/* Instruction field for MCQ & TF */}
          {!isParagraph && (
            <div className="space-y-2">
              <label className="block text-lg font-medium text-gray-700">تعليمات السؤال (اختياري)</label>
              <input
                type="text"
                value={editingInstruction}
                onChange={(e) => setEditingInstruction(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="مثال: اختر الإجابة الصحيحة، أكمل الجملة التالية..."
              />
              <p className="text-md text-gray-500">هذه التعليمات ستظهر للطالب قبل الإجابة على السؤال</p>
              <Divider />
            </div>
          )}

          {/* MCQ EDIT */}
          {isMCQ && (
            <div className="space-y-4">
              <div>
                <label className="block text-lg font-semibold mb-2">نص السؤال</label>
                <div className="border border-gray-300 rounded-lg">
                  <ReactQuill
                    value={editingContent}
                    onChange={setEditingContent}
                    modules={quillModules}
                    formats={quillFormats}
                    className="min-h-[120px]"
                  />
                </div>
              </div>

              <Divider />

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <label className="font-semibold">الخيارات</label>
                    <Button type="dashed" icon={<Plus className="w-4 h-4" />} onClick={addOptionToMCQ} size="small">
                      إضافة خيار
                    </Button>
                  </div>
                  <span className="text-lg text-gray-500">اختر الإجابة الصحيحة</span>
                </div>

                {editingOptions.map((opt, idx) => (
                  <div
                    key={opt.id}
                    className={`p-4 border rounded-lg relative ${
                      editingCorrectAnswer === idx ? "border-green-400 bg-green-50" : "border-gray-300"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          checked={editingCorrectAnswer === idx}
                          onChange={() => {
                            setEditingCorrectAnswer(idx);
                            setEditingOptions((prev) => prev.map((o, ii) => ({ ...o, isCorrect: ii === idx })));
                          }}
                          className="w-5 h-5"
                        />
                        <span className="font-medium">
                          {editingCorrectAnswer === idx ? "إجابة صحيحة" : "تحديد كإجابة صحيحة"}
                        </span>
                      </div>
                      <Space>
                        <span className="px-3 py-1 bg-gray-100 rounded">{String.fromCharCode(1632 + idx + 1)}</span>
                        {editingOptions.length > 2 && (
                          <Button
                            danger
                            type="text"
                            icon={<Minus className="w-4 h-4" />}
                            onClick={() => removeOptionFromMCQ(idx)}
                            size="small"
                          />
                        )}
                      </Space>
                    </div>

                    <div className="space-y-3 pl-8">
                      <div>
                        <label className="text-lg mb-1 block">نص الخيار</label>
                        <div className="border border-gray-300 rounded">
                          <ReactQuill
                            value={opt.text}
                            onChange={(v) => {
                              setEditingOptions((prev) => {
                                const copy = [...prev];
                                copy[idx] = { ...copy[idx], text: v };
                                return copy;
                              });
                            }}
                            modules={quillModules}
                            formats={quillFormats}
                            className="min-h-[80px]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-lg mb-1 block">الشرح (اختياري)</label>
                        <div className="border border-gray-300 rounded">
                          <ReactQuill
                            value={opt.explanation}
                            onChange={(v) => {
                              setEditingOptions((prev) => {
                                const copy = [...prev];
                                copy[idx] = { ...copy[idx], explanation: v };
                                return copy;
                              });
                            }}
                            modules={quillModules}
                            formats={quillFormats}
                            className="min-h-[80px]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="flex justify-between items-center pt-4">
                  <div className="text-lg text-gray-500">
                    <AlertCircle className="w-4 h-4 inline mr-1" />
                    {editingOptions.length} خيارات
                  </div>
                  <Button
                    type="primary"
                    icon={<Save className="w-4 h-4" />}
                    loading={edit_question_loading}
                    onClick={() => handleSaveMCQ(q)}
                  >
                    حفظ السؤال
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* T/F EDIT */}
          {isTF && (
            <div className="space-y-4">
              <div>
                <label className="block text-lg font-semibold mb-2">نص السؤال</label>
                <div className="border border-gray-300 rounded-lg">
                  <ReactQuill
                    value={editingTFContent}
                    onChange={setEditingTFContent}
                    modules={quillModules}
                    formats={quillFormats}
                    className="min-h-[120px]"
                  />
                </div>
              </div>

              <Divider />

              <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <label className="font-semibold">الإجابة الصحيحة</label>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        checked={editingTFAnswer === true}
                        onChange={() => setEditingTFAnswer(true)}
                        className="w-5 h-5"
                      />
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="font-medium">صح</span>
                      </div>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        checked={editingTFAnswer === false}
                        onChange={() => setEditingTFAnswer(false)}
                        className="w-5 h-5"
                      />
                      <div className="flex items-center gap-2">
                        <XCircle className="w-5 h-5 text-red-600" />
                        <span className="font-medium">خطأ</span>
                      </div>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-lg font-semibold mb-2">شرح الإجابة (اختياري)</label>
                  <div className="border border-gray-300 rounded-lg">
                    <ReactQuill
                      value={editingTFExplanation}
                      onChange={setEditingTFExplanation}
                      modules={quillModules}
                      formats={quillFormats}
                      className="min-h-[100px]"
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4">
                  <div className="text-lg text-gray-500">
                    <AlertCircle className="w-4 h-4 inline mr-1" />
                    سؤال صح/خطأ
                  </div>
                  <Button
                    type="primary"
                    icon={<Save className="w-4 h-4" />}
                    loading={edit_question_loading}
                    onClick={() => handleSaveTF(q)}
                  >
                    حفظ السؤال
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* PARAGRAPH EDIT */}
          {isParagraph && (
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <label className="font-semibold">نص الفقرة</label>
                  <Space>
                    <Button
                      type="primary"
                      loading={edit_paragraph_loading}
                      onClick={() => handleEditParagraphContent(q)}
                      icon={<Save className="w-4 h-4" />}
                    >
                      حفظ الفقرة
                    </Button>
                  </Space>
                </div>

                <div className="border border-gray-300 rounded-lg">
                  <ReactQuill
                    value={editingParagraphContent}
                    onChange={setEditingParagraphContent}
                    modules={quillModules}
                    formats={quillFormats}
                    className="min-h-[150px]"
                  />
                </div>
              </div>

              <Divider />

              <div>
                <div className="flex justify-between items-center mb-4">
                  <label className="font-semibold">أسئلة الفقرة</label>
                  <Button type="primary" onClick={() => startAddingQuestionToParagraph(q)} icon={<Plus className="w-4 h-4" />}>
                    إضافة سؤال جديد
                  </Button>
                </div>

                {editingParagraphQuestions.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">لا توجد أسئلة</div>
                ) : (
                  <div className="space-y-4">
                    {editingParagraphQuestions.map((pq, qIdx) => (
                      <div key={pq.id} className="border border-gray-300 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-4">
                          <div className="font-semibold">سؤال {qIdx + 1}</div>
                          <Space>
                            <Button
                              icon={<Edit3 className="w-4 h-4" />}
                              onClick={() => {
                                setEditingParagraphQuestions((prev) =>
                                  prev.map((item, idx) =>
                                    idx === qIdx ? { ...item, isEditing: !item.isEditing } : { ...item, isEditing: false }
                                  )
                                );
                              }}
                            >
                              {pq.isEditing ? "إلغاء التعديل" : "تعديل"}
                            </Button>

                            <Button
                              danger
                              icon={<Trash2 className="w-4 h-4" />}
                              onClick={() => {
                                setQuestionToDelete({ type: "paragraph_question", id: pq.rawData?.id, paragraphId: q.id });
                                setDeleteModal(true);
                              }}
                            >
                              حذف
                            </Button>
                          </Space>
                        </div>

                        {pq.isEditing ? (
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <label className="block text-lg font-medium text-gray-700">تعليمات السؤال (اختياري)</label>
                              <input
                                type="text"
                                value={pq.instruction}
                                onChange={(e) => {
                                  setEditingParagraphQuestions((prev) => {
                                    const copy = [...prev];
                                    copy[qIdx] = { ...copy[qIdx], instruction: e.target.value };
                                    return copy;
                                  });
                                }}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="مثال: اختر الإجابة الصحيحة بناءً على الفقرة..."
                              />
                            </div>

                            <div>
                              <label className="text-lg mb-1 block">نص السؤال</label>
                              <div className="border border-gray-300 rounded">
                                <ReactQuill
                                  value={pq.questionText}
                                  onChange={(v) => {
                                    setEditingParagraphQuestions((prev) => {
                                      const copy = [...prev];
                                      copy[qIdx] = { ...copy[qIdx], questionText: v };
                                      return copy;
                                    });
                                  }}
                                  modules={quillModules}
                                  formats={quillFormats}
                                  className="min-h-[80px]"
                                />
                              </div>
                            </div>

                            <div className="space-y-3">
                              <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                  <label className="font-medium">الخيارات</label>
                                  <Button
                                    type="dashed"
                                    icon={<Plus className="w-4 h-4" />}
                                    onClick={() => addOptionToParagraphQuestion(qIdx)}
                                    size="small"
                                  >
                                    إضافة خيار
                                  </Button>
                                </div>
                              </div>

                              {pq.options.map((opt, oIdx) => (
                                <div
                                  key={opt.id}
                                  className={`p-4 border rounded-lg ${opt.isCorrect ? "border-green-400 bg-green-50" : "border-gray-300"}`}
                                >
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-3">
                                      <input
                                        type="radio"
                                        checked={!!opt.isCorrect}
                                        onChange={() => {
                                          setEditingParagraphQuestions((prev) => {
                                            const copy = [...prev];
                                            const qCopy = { ...copy[qIdx] };
                                            qCopy.options = qCopy.options.map((o, ii) => ({ ...o, isCorrect: ii === oIdx }));
                                            copy[qIdx] = qCopy;
                                            return copy;
                                          });
                                        }}
                                        className="w-4 h-4"
                                      />
                                      <span>الإجابة {oIdx + 1}</span>
                                    </div>

                                    <Space>
                                      <span>{String.fromCharCode(1632 + oIdx + 1)}</span>
                                      {pq.options.length > 2 && (
                                        <Button
                                          danger
                                          type="text"
                                          icon={<Minus className="w-4 h-4" />}
                                          onClick={() => removeOptionFromParagraphQuestion(qIdx, oIdx)}
                                          size="small"
                                        />
                                      )}
                                    </Space>
                                  </div>

                                  <div className="space-y-2 pl-7">
                                    <div>
                                      <label className="text-lg mb-1 block">نص الخيار</label>
                                      <div className="border border-gray-300 rounded">
                                        <ReactQuill
                                          value={opt.text}
                                          onChange={(v) => {
                                            setEditingParagraphQuestions((prev) => {
                                              const copy = [...prev];
                                              const qCopy = { ...copy[qIdx] };
                                              const opts = [...qCopy.options];
                                              opts[oIdx] = { ...opts[oIdx], text: v };
                                              qCopy.options = opts;
                                              copy[qIdx] = qCopy;
                                              return copy;
                                            });
                                          }}
                                          modules={quillModules}
                                          formats={quillFormats}
                                          className="min-h-[60px]"
                                        />
                                      </div>
                                    </div>

                                    <div>
                                      <label className="text-lg mb-1 block">الشرح (اختياري)</label>
                                      <div className="border border-gray-300 rounded">
                                        <ReactQuill
                                          value={opt.explanation}
                                          onChange={(v) => {
                                            setEditingParagraphQuestions((prev) => {
                                              const copy = [...prev];
                                              const qCopy = { ...copy[qIdx] };
                                              const opts = [...qCopy.options];
                                              opts[oIdx] = { ...opts[oIdx], explanation: v };
                                              qCopy.options = opts;
                                              copy[qIdx] = qCopy;
                                              return copy;
                                            });
                                          }}
                                          modules={quillModules}
                                          formats={quillFormats}
                                          className="min-h-[60px]"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>

                            <div className="flex justify-between items-center pt-4">
                              <div className="text-lg text-gray-500">{pq.options.length} خيارات</div>
                              <Button
                                type="primary"
                                icon={<Save className="w-4 h-4" />}
                                onClick={() => handleSaveParagraph(pq)}
                                loading={edit_question_loading}
                              >
                                حفظ التعديلات
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className={textWrapClass}>
                            {pq.instruction && (
                              <div className="mb-3 p-3 bg-blue-50 rounded-lg">
                                <div className="flex items-center gap-2 text-blue-700">
                                  <Info className="w-4 h-4" />
                                  <span className="font-medium">التعليمات:</span>
                                </div>
                                <div className="mt-1 text-lg text-blue-800">{pq.instruction}</div>
                              </div>
                            )}

                            <div className="mb-3" dangerouslySetInnerHTML={{ __html: pq.questionText }} />

                            <div className="space-y-2">
                              {pq.options.map((opt, oIdx) => (
                                <div
                                  key={opt.id}
                                  className={`p-2 rounded ${opt.isCorrect ? "bg-green-50" : "bg-gray-50"} ${textWrapClass}`}
                                >
                                  <span className="font-medium mr-2">{String.fromCharCode(1632 + oIdx + 1)}:</span>
                                  <span dangerouslySetInnerHTML={{ __html: opt.text }} />
                                  {opt.explanation && (
                                    <div className="mt-1 text-lg text-gray-600">
                                      <span className="font-medium">الشرح:</span>{" "}
                                      <span dangerouslySetInnerHTML={{ __html: opt.explanation }} />
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      );
    }

    // =========================
    // Normal Display Mode
    // =========================
    const list =
      q.type === "mcq"
        ? [
            {
              id: q.id,
              questionText: q.question,
              instruction: q.instruction,
              options: q.options,
              correctAnswer: q.correctAnswer,
              type: "mcq",
            },
          ]
        : q.type === "t_f"
        ? [
            {
              id: q.id,
              questionText: q.question,
              instruction: q.instruction,
              correctAnswer: q.correctAnswer,
              explanation: q.tfExplanation || q.options?.[0]?.explanation || "",
              type: "t_f",
            },
          ]
        : q.questions || [];

    return (
      <div className="space-y-4">
        {q.type === "paragraph_mcq" && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                <span className="font-bold">الفقرة</span>
              </div>

              <Space>
                <Button
                  icon={<Edit3 className="w-4 h-4" />}
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    startEditing(q);
                  }}
                >
                  تعديل الفقرة
                </Button>

                <Button
                  danger
                  icon={<Trash2 className="w-4 h-4" />}
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setQuestionToDelete({ type: "paragraph", id: q?.id });
                    setDeleteModal(true);
                  }}
                >
                  حذف الفقرة
                </Button>

                <Button
                  type="primary"
                  icon={<Plus className="w-4 h-4" />}
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    startAddingQuestionToParagraph(q);
                  }}
                >
                  إضافة سؤال
                </Button>
              </Space>
            </div>

            <div
              className={`border border-gray-300 rounded-lg p-4 bg-gray-50 ${textWrapClass}`}
              dangerouslySetInnerHTML={{ __html: q.paragraphContent }}
            />
          </div>
        )}

        <div className="space-y-6">
          {list.map((item, qIdx) => (
            <div key={item.id || qIdx} className="border border-gray-300 rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <div className="font-semibold">
                  {q.type === "paragraph_mcq"
                    ? `سؤال ${qIdx + 1}`
                    : item.type === "t_f"
                    ? "سؤال صح/خطأ"
                    : "سؤال MCQ"}
                </div>

                <Space>
                  {q.type === "paragraph_mcq" ? (
                    <>
                      <Button
                        icon={<Edit3 className="w-4 h-4" />}
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          startEditingParagraphQuestion(q, qIdx);
                        }}
                      >
                        تعديل
                      </Button>
                      <Button
                        danger
                        icon={<Trash2 className="w-4 h-4" />}
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          setQuestionToDelete({ type: "paragraph_question", id: item.rawData?.id, paragraphId: q.id });
                          setDeleteModal(true);
                        }}
                      >
                        حذف
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        icon={<Edit3 className="w-4 h-4" />}
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          startEditing(q);
                        }}
                      >
                        تعديل
                      </Button>

                      <Button
                        danger
                        icon={<Trash2 className="w-4 h-4" />}
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          setQuestionToDelete({ type: q.type, id: q.id });
                          setDeleteModal(true);
                        }}
                      >
                        حذف
                      </Button>
                    </>
                  )}
                </Space>
              </div>

              {item.instruction && (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 text-blue-700">
                    <Info className="w-4 h-4" />
                    <span className="font-medium">التعليمات:</span>
                  </div>
                  <div className="mt-1 text-lg text-blue-800">{item.instruction}</div>
                </div>
              )}

              <div className={`mb-4 ${textWrapClass}`} dangerouslySetInnerHTML={{ __html: item.questionText }} />

              {/* T/F answer */}
              {item.type === "t_f" && (
                <div className="mt-4">
                  <div
                    className={`p-4 rounded-lg ${
                      item.correctAnswer ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {item.correctAnswer ? (
                        <>
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <span className="font-bold text-green-700">الإجابة الصحيحة: صح</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-5 h-5 text-red-600" />
                          <span className="font-bold text-red-700">الإجابة الصحيحة: خطأ</span>
                        </>
                      )}
                    </div>

                    {item.explanation && (
                      <div className={`mt-3 pt-3 border-t border-gray-200 ${textWrapClass}`}>
                        <div className="text-lg font-medium text-gray-700 mb-1">الشرح:</div>
                        <div className="text-gray-600" dangerouslySetInnerHTML={{ __html: item.explanation }} />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* MCQ options */}
              {item.type === "mcq" && (
                <div className="space-y-2">
                  {item.options?.map((opt, oIdx) => (
                    <div
                      key={opt.id}
                      className={`p-2 rounded ${
                        opt.isCorrect || oIdx === item.correctAnswer
                          ? "bg-green-50 border border-green-200"
                          : "bg-gray-50"
                      } ${textWrapClass}`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{String.fromCharCode(1632 + oIdx + 1)}:</span>
                        <span dangerouslySetInnerHTML={{ __html: opt.text }} />
                      </div>

                      {opt.explanation && (
                        <div className={`mt-1 text-lg text-gray-600 pr-6 ${textWrapClass}`}>
                          <span className="font-medium">الشرح:</span>{" "}
                          <span dangerouslySetInnerHTML={{ __html: opt.explanation }} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Paragraph options */}
              {q.type === "paragraph_mcq" && item.options && (
                <div className="space-y-2">
                  {item.options.map((opt, oIdx) => (
                    <div
                      key={opt.id}
                      className={`p-2 rounded ${
                        opt.isCorrect ? "bg-green-50 border border-green-200" : "bg-gray-50"
                      } ${textWrapClass}`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{String.fromCharCode(1632 + oIdx + 1)}:</span>
                        <span dangerouslySetInnerHTML={{ __html: opt.text }} />
                      </div>

                      {opt.explanation && (
                        <div className={`mt-1 text-lg text-gray-600 pr-6 ${textWrapClass}`}>
                          <span className="font-medium">الشرح:</span>{" "}
                          <span dangerouslySetInnerHTML={{ __html: opt.explanation }} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // =========================
  // Add Question Modal
  // =========================
  const renderAddQuestionToParagraphModal = () => {
    if (!addingQuestionToParagraph) return null;

    return (
      <Modal
        title={
          <div className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            <span>إضافة سؤال جديد إلى الفقرة</span>
          </div>
        }
        open={!!addingQuestionToParagraph}
        onCancel={() => setAddingQuestionToParagraph(null)}
        footer={[
          <Button key="cancel" onClick={() => setAddingQuestionToParagraph(null)}>
            إلغاء
          </Button>,
          <Button key="submit" type="primary" loading={create_question_loading} onClick={handleSaveNewParagraphQuestion}>
            إضافة السؤال
          </Button>,
        ]}
        width={760}
      >
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="block font-semibold mb-2">تعليمات السؤال (اختياري)</label>
            <input
              type="text"
              value={newParagraphQuestionInstruction}
              onChange={(e) => setNewParagraphQuestionInstruction(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="مثال: اختر الإجابة الصحيحة بناءً على الفقرة..."
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">نص السؤال</label>
            <div className="border border-gray-300 rounded-lg">
              <ReactQuill
                value={newParagraphQuestionText}
                onChange={setNewParagraphQuestionText}
                modules={quillModules}
                formats={quillFormats}
                className="min-h-[120px]"
              />
            </div>
          </div>

          <Divider>
            <span>خيارات السؤال</span>
          </Divider>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <label className="font-semibold">قم بتحديد الإجابة الصحيحة</label>
                <Button type="dashed" icon={<Plus className="w-4 h-4" />} onClick={addOptionToParagraphQuestionModal}>
                  إضافة خيار
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {newParagraphQuestionOptions.map((opt, idx) => (
                <div
                  key={opt.id}
                  className={`p-4 border rounded-lg ${opt.isCorrect ? "border-green-400 bg-green-50" : "border-gray-300"}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        checked={!!opt.isCorrect}
                        onChange={() => {
                          setNewParagraphQuestionOptions((prev) =>
                            prev.map((o, ii) => ({ ...o, isCorrect: ii === idx }))
                          );
                        }}
                        className="w-4 h-4"
                      />
                      <span>الإجابة {idx + 1}</span>
                    </div>

                    <Space>
                      <span className="px-3 py-1 bg-gray-100 rounded">{String.fromCharCode(1632 + idx + 1)}</span>
                      {newParagraphQuestionOptions.length > 2 && (
                        <Button
                          danger
                          type="text"
                          icon={<Minus className="w-4 h-4" />}
                          onClick={() => removeOptionFromParagraphQuestionModal(idx)}
                          size="small"
                        />
                      )}
                    </Space>
                  </div>

                  <div className="grid gap-3">
                    <div>
                      <label className="text-lg mb-1 block">نص الخيار</label>
                      <div className="border border-gray-300 rounded">
                        <ReactQuill
                          value={opt.text}
                          onChange={(v) => {
                            setNewParagraphQuestionOptions((prev) => {
                              const copy = [...prev];
                              copy[idx] = { ...copy[idx], text: v };
                              return copy;
                            });
                          }}
                          modules={quillModules}
                          formats={quillFormats}
                          className="min-h-[80px]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-lg mb-1 block">
                        <span className="text-gray-500">(اختياري)</span> الشرح
                      </label>
                      <div className="border border-gray-300 rounded">
                        <ReactQuill
                          value={opt.explanation}
                          onChange={(v) => {
                            setNewParagraphQuestionOptions((prev) => {
                              const copy = [...prev];
                              copy[idx] = { ...copy[idx], explanation: v };
                              return copy;
                            });
                          }}
                          modules={quillModules}
                          formats={quillFormats}
                          className="min-h-[80px]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

           
          </div>
        </div>
      </Modal>
    );
  };

  // =========================
  // Loading
  // =========================
  if (get_exam_question_loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <Spin size="large" />
        <p className="mt-4 text-gray-600">جاري تحميل الأسئلة...</p>
      </div>
    );
  }

  // =========================
  // Main Render
  // =========================
  return (
    <Card title="أسئلة الامتحان" icon={FileText} className="p-0">
      <div className="p-6">
        {apiQuestions.length === 0 ? (
          <div className="text-center py-16">
            <Empty description="لا توجد أسئلة في هذا القسم" image={Empty.PRESENTED_IMAGE_SIMPLE} />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="mb-6">
              <div className="flex items-center justify-between gap-3 mb-4">
                <div
                  dangerouslySetInnerHTML={{ __html: selectedSection?.title || "قسم الامتحان" }}
                  className={`text-2xl font-bold text-gray-900 ${textWrapClass}`}
                />
                <Tag color="blue">{apiQuestions?.length || 0} سؤال</Tag>
              </div>
            </div>

            <div className="space-y-4">
              {apiQuestions.map((q, index) => {
                const isExp = isExpanded(q.id, q.type);
                const typeLabel = q.type === "mcq" ? "MCQ" : q.type === "t_f" ? "صح/خطأ" : "فقرة";

                const preview =
                  q.type === "mcq"
                    ? stripHtml(q.question).substring(0, 50) + "..."
                    : q.type === "t_f"
                    ? stripHtml(q.question).substring(0, 50) + "..."
                    : stripHtml(q.paragraphContent).substring(0, 50) + "...";

                return (
                  <div key={`${q.type}-${q.id}`} className="border border-gray-300 rounded-lg overflow-hidden">
                    <div
                      onClick={() => toggleQuestion(q.id, q.type)}
                      className={`flex items-center justify-between p-4 cursor-pointer ${
                        isExp ? "bg-gray-50" : "hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            q.type === "mcq"
                              ? "bg-blue-100 text-blue-700"
                              : q.type === "t_f"
                              ? "bg-orange-100 text-orange-700"
                              : "bg-purple-100 text-purple-700"
                          }`}
                        >
                          {index + 1}
                        </div>

                        <div>
                          <div className="font-bold">
                            {typeLabel}
                            {q.type === "paragraph_mcq" && (
                              <span className="text-lg text-gray-500 mr-2">({q.questions?.length || 0} أسئلة)</span>
                            )}
                          </div>
                          <div className={`text-lg text-gray-500 ${textWrapClass}`}>{preview}</div>
                        </div>
                      </div>

                      {isExp ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>

                    {isExp && (
                      <div className="border-t border-gray-300">
                        <div className="p-4">{renderQuestionContent(q)}</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* MODALS */}
      {renderAddQuestionToParagraphModal()}

      {/* DELETE MODAL */}
      <Modal
        open={deleteModal}
        onCancel={() => setDeleteModal(false)}
        onOk={handleDeleteAny}
        okText="نعم، احذف"
        cancelText="إلغاء"
        okButtonProps={{
          danger: true,
          loading: delete_question_loading || delete_paragraph_loading,
        }}
        width={500}
      >
        <div className="py-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
            <Trash2 className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-center mb-2">تأكيد الحذف</h3>
          <p className="text-gray-600 text-center">
            هل أنت متأكد من الحذف؟
            <br />
            <span className="text-lg text-gray-500">هذا الإجراء لا يمكن التراجع عنه</span>
          </p>
        </div>
      </Modal>
    </Card>
  );
}
