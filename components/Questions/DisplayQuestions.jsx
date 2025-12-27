// // // "use client";

// // // import React, { useMemo, useState, useEffect } from "react";
// // // import { Edit3, Trash2, Save, X, ChevronDown, ChevronUp, FileText, List, Eye, EyeOff, AlertCircle } from "lucide-react";
// // // import { Empty, Spin, Tag, Button, Modal, Divider, Tooltip, Space, Alert, Card as AntCard, Steps, Badge } from "antd";
// // // import { useDispatch, useSelector } from "react-redux";
// // // import dynamic from "next/dynamic";
// // // import Card from "./ExamCard";
// // // import {
// // //   handleDeleteExamQuestions,
// // //   handleGetExamQuestions,
// // //   handleUpdateExamQuestions,
// // //   handleEditParagraph,
// // //   handleDeleteParagraph,
// // // } from "../../lib/features/examSlice";
// // // import { toast } from "react-toastify";

// // // const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
// // // import "react-quill-new/dist/quill.snow.css";

// // // export default function DisplayQuestions({
// // //   selectedSectionId,
// // //   setEditingQuestion,
// // //   selectedSection,
// // // }) {
// // //   const dispatch = useDispatch();

// // //   const {
// // //     get_exam_questions_list,
// // //     get_exam_question_loading,
// // //     delete_question_loading,
// // //     edit_question_loading,
// // //     edit_paragraph_loading,
// // //     delete_paragraph_loading,
// // //   } = useSelector((state) => state?.exam);

// // //   const [expandedQuestions, setExpandedQuestions] = useState({});
// // //   const [editingQuestionId, setEditingQuestionId] = useState(null);
// // //   const [editingType, setEditingType] = useState(null);
// // //   const [showAllQuestions, setShowAllQuestions] = useState(false);

// // //   // MCQ editing
// // //   const [editingContent, setEditingContent] = useState("");
// // //   const [editingOptions, setEditingOptions] = useState([]);
// // //   const [editingCorrectAnswer, setEditingCorrectAnswer] = useState(0);

// // //   // Paragraph editing
// // //   const [editingParagraphContent, setEditingParagraphContent] = useState("");
// // //   const [editingParagraphQuestions, setEditingParagraphQuestions] = useState([]);

// // //   // Delete modals
// // //   const [deleteParagraphModal, setDeleteParagraphModal] = useState(false);
// // //   const [deleteModal, setDeleteModal] = useState(false);
// // //   const [questionToDelete, setQuestionToDelete] = useState(null);

// // //   useEffect(() => {
// // //     if (get_exam_questions_list) {
// // //       const initial = {};
// // //       (get_exam_questions_list?.data?.message?.mcq || []).forEach(
// // //         (q) => (initial[`mcq-${q.id}`] = false)
// // //       );
// // //       (get_exam_questions_list?.data?.message?.paragraphs || []).forEach(
// // //         (p) => (initial[`paragraph-${p.paragraph.id}`] = false)
// // //       );
// // //       setExpandedQuestions(initial);
// // //     }
// // //   }, [get_exam_questions_list]);

// // //   const quillModules = {
// // //     toolbar: [
// // //       [{ header: [1, 2, 3, false] }],
// // //       ["bold", "italic", "underline"],
// // //       [{ list: "ordered" }, { list: "bullet" }],
// // //       [{ align: [] }],
// // //       ["clean"],
// // //       ["link", "image", "formula"],
// // //     ],
// // //   };

// // //   const quillFormats = [
// // //     "header",
// // //     "bold",
// // //     "italic",
// // //     "underline",
// // //     "list",
// // //     "bullet",
// // //     "align",
// // //     "link",
// // //     "image",
// // //     "formula",
// // //   ];

// // //   const apiQuestions = useMemo(() => {
// // //     if (!get_exam_questions_list && !selectedSection) return [];

// // //     const data = get_exam_questions_list?.data?.message || {
// // //       mcq: [],
// // //       paragraphs: [],
// // //     };

// // //     const mcqSource =
// // //       data?.mcq && data?.mcq?.length
// // //         ? data?.mcq
// // //         : selectedSection?.mcq && selectedSection?.mcq?.length
// // //           ? selectedSection?.mcq
// // //           : [];

// // //     const mcqs = mcqSource.map((q) => {
// // //       const options = q?.options || [];
// // //       const correctIndex = options.findIndex(
// // //         (opt) => Number(opt?.is_correct) === 1
// // //       );

// // //       return {
// // //         id: q.id,
// // //         type: "mcq",
// // //         question: q?.question_text || "",
// // //         correctAnswer: correctIndex >= 0 ? correctIndex : 0,
// // //         options: options.map((opt) => ({
// // //           id: opt?.id,
// // //           text: opt.option_text || "",
// // //           explanation: opt.question_explanation || "",
// // //           isCorrect: Number(opt?.is_correct) === 1,
// // //         })),
// // //         rawData: q,
// // //       };
// // //     });

// // //     const paragraphSource =
// // //       data?.paragraphs && data?.paragraphs?.length
// // //         ? data?.paragraphs
// // //         : selectedSection?.paragraphs || [];

// // //     const paragraphs = paragraphSource.map((p) => ({
// // //       id: p?.paragraph?.id,
// // //       type: "paragraph_mcq",
// // //       paragraphContent: p?.paragraph?.paragraph_content || "",
// // //       questions: (p?.questions || []).map((q) => ({
// // //         id: q?.id,
// // //         questionText: q?.question_text || "",
// // //         options: (q?.options || []).map((opt) => ({
// // //           id: opt?.id,
// // //           text: opt?.option_text || "",
// // //           explanation: opt?.question_explanation || "",
// // //           isCorrect: Number(opt?.is_correct) === 1,
// // //         })),
// // //       })),
// // //       rawData: p,
// // //     }));

// // //     return [...mcqs, ...paragraphs];
// // //   }, [get_exam_questions_list, selectedSection]);

// // //   const toggleQuestion = (id, type) => {
// // //     const key = `${type === "mcq" ? "mcq" : "paragraph"}-${id}`;
// // //     setExpandedQuestions((prev) => ({ ...prev, [key]: !prev[key] }));
// // //   };

// // //   const isExpanded = (id, type) =>
// // //     expandedQuestions[`${type === "mcq" ? "mcq" : "paragraph"}-${id}`] || false;

// // //   const expandAll = () => {
// // //     const allExpanded = {};
// // //     apiQuestions.forEach((q) => {
// // //       allExpanded[`${q.type === "mcq" ? "mcq" : "paragraph"}-${q.id}`] = true;
// // //     });
// // //     setExpandedQuestions(allExpanded);
// // //     setShowAllQuestions(true);
// // //   };

// // //   const collapseAll = () => {
// // //     const allCollapsed = {};
// // //     apiQuestions.forEach((q) => {
// // //       allCollapsed[`${q.type === "mcq" ? "mcq" : "paragraph"}-${q.id}`] = false;
// // //     });
// // //     setExpandedQuestions(allCollapsed);
// // //     setShowAllQuestions(false);
// // //   };

// // //   const startEditing = (q) => {
// // //     setEditingQuestionId(q.id);
// // //     setEditingType(q.type);

// // //     if (q.type === "mcq") {
// // //       setEditingContent(q.question);
// // //       setEditingOptions(q.options.map((opt) => ({ ...opt })));
// // //       setEditingCorrectAnswer(q.correctAnswer);
// // //     } else if (q.type === "paragraph_mcq") {
// // //       setEditingParagraphContent(q.paragraphContent);
// // //       setEditingParagraphQuestions(
// // //         q.questions.map((pq) => ({
// // //           id: pq.id,
// // //           questionText: pq.questionText,
// // //           options: pq.options.map((opt) => ({ ...opt })),
// // //         }))
// // //       );
// // //     }

// // //     setEditingQuestion(q);
// // //   };

// // //   const cancelEditing = () => {
// // //     setEditingQuestionId(null);
// // //     setEditingType(null);
// // //     setEditingContent("");
// // //     setEditingOptions([]);
// // //     setEditingCorrectAnswer(0);
// // //     setEditingParagraphContent("");
// // //     setEditingParagraphQuestions([]);
// // //     setEditingQuestion(null);
// // //   };

// // //   const refreshQuestions = () => {
// // //     dispatch(
// // //       handleGetExamQuestions({
// // //         body: { exam_section_id: selectedSectionId },
// // //       })
// // //     );
// // //   };

// // //   const handleSaveMCQ = async (q) => {
// // //     const payload = {
// // //       id: q.id,
// // //       question_text: editingContent,
// // //       instructions: "Read carefully before answering",
// // //       mcq_array: editingOptions?.map((opt, idx) => ({
// // //         answer: opt?.text || "",
// // //         question_explanation: opt?.explanation || "",
// // //         correct_or_not: opt?.isCorrect ? "1" : "0",
// // //       })),
// // //     };

// // //     try {
// // //       const res = await dispatch(
// // //         handleUpdateExamQuestions({ body: payload })
// // //       ).unwrap();

// // //       if (res?.data?.status === "success") {
// // //         toast.success("تم تعديل السؤال بنجاح");
// // //         refreshQuestions();
// // //         cancelEditing();
// // //       } else {
// // //         toast.error(res?.data?.message || "فشل تعديل السؤال");
// // //       }
// // //     } catch (e) {
// // //       toast.error("حصل خطأ أثناء تعديل السؤال");
// // //     } finally {
// // //       cancelEditing();
// // //     }
// // //   };

// // //   const handleSaveParagraph = async (pq) => {
// // //     const payload = {
// // //       id: pq?.id,
// // //       question_text: pq?.questionText,
// // //       instructions: "Read carefully before answering",
// // //       mcq_array: (pq?.options || []).map((opt) => ({
// // //         answer: opt?.text,
// // //         correct_or_not: opt?.isCorrect ? "1" : "0",
// // //         question_explanation: opt?.explanation,
// // //       })),
// // //     };

// // //     try {
// // //       const res = await dispatch(
// // //         handleUpdateExamQuestions({ body: payload })
// // //       ).unwrap();

// // //       if (res?.data?.status === "success") {
// // //         toast.success("تم تعديل أسئلة الفقرة بنجاح");
// // //         refreshQuestions();
// // //       } else {
// // //         toast.error(
// // //           res?.error?.response?.data?.message ||
// // //           res?.error?.message ||
// // //           "فشل تعديل أسئلة الفقرة"
// // //         );
// // //       }
// // //     } catch (e) {
// // //       toast.error("حصل خطأ أثناء تعديل الفقرة");
// // //     } finally {
// // //       cancelEditing();
// // //     }
// // //   };

// // //   const handleDeleteParagraphQuestions = async () => {
// // //     if (!deleteParagraphModal) return;

// // //     try {
// // //       const res = await dispatch(
// // //         handleDeleteExamQuestions({ body: { id: deleteParagraphModal?.id } })
// // //       ).unwrap();

// // //       if (res?.data?.status === "success") {
// // //         toast.success("تم حذف السؤال بنجاح");
// // //         refreshQuestions();
// // //         setDeleteParagraphModal(false);
// // //         if (typeof window !== undefined) {
// // //           window.location.reload();
// // //         }
// // //       } else {
// // //         toast.error(
// // //           res?.error?.response?.data?.message ||
// // //           res?.data?.message ||
// // //           "فشل الحذف"
// // //         );
// // //       }
// // //     } catch (e) {
// // //       toast.error("حصل خطأ أثناء الحذف");
// // //     }
// // //   };

// // //   const handleDeleteAny = async () => {
// // //     if (!questionToDelete) return;

// // //     try {
// // //       if (questionToDelete.type === "mcq") {
// // //         const res = await dispatch(
// // //           handleDeleteExamQuestions({ body: { id: questionToDelete.id } })
// // //         ).unwrap();

// // //         if (res?.data?.status === "success") {
// // //           toast.success("تم حذف السؤال بنجاح");
// // //           refreshQuestions();
// // //           if (typeof window !== undefined) {
// // //             window.location.reload();
// // //           }
// // //         } else {
// // //           toast.error(res?.data?.message || "فشل الحذف");
// // //         }
// // //       } else {
// // //         const res = await dispatch(
// // //           handleDeleteParagraph({ body: { id: questionToDelete.id } })
// // //         ).unwrap();

// // //         if (res?.data?.status === "success") {
// // //           toast.success("تم حذف الفقرة بنجاح");
// // //           refreshQuestions();
// // //           if (typeof window !== undefined) {
// // //             window.location.reload();
// // //           }
// // //         } else {
// // //           toast.error(res?.data?.message || "فشل الحذف");
// // //         }
// // //       }
// // //     } catch (e) {
// // //       toast.error("حصل خطأ أثناء الحذف");
// // //     } finally {
// // //       setDeleteModal(false);
// // //       setQuestionToDelete(null);
// // //     }
// // //   };

// // //   function handleEditParagraphContent(q) {
// // //     const data_send = { id: q?.id, paragraph_content: editingParagraphContent };

// // //     dispatch(handleEditParagraph({ body: data_send }))
// // //       .unwrap()
// // //       .then((res) => {
// // //         if (res?.data?.status === "success") {
// // //           toast.success(res?.data?.message || "تم تعديل الفقرة بنجاح");
// // //           refreshQuestions();
// // //         } else {
// // //           toast.error(res?.data?.message || "فشل تعديل الفقرة");
// // //         }
// // //       })
// // //       .catch(() => toast.error("حصل خطأ أثناء تعديل نص الفقرة"));
// // //   }

// // //   const renderQuestionContent = (q) => {
// // //     const isEditing = editingQuestionId === q.id;

// // //     if (isEditing) {
// // //       const isMCQ = q.type === "mcq";
// // //       const isParagraph = q.type === "paragraph_mcq";

// // //       return (
// // //         <div className="space-y-6">
// // //           {/* EDIT MODE INDICATOR */}
// // //           <Alert
// // //             message={
// // //               <div className="flex justify-between items-center">
// // //                 <div className="flex items-center gap-2">
// // //                   <Edit3 className="w-4 h-4" />
// // //                   <span>وضع التعديل - {isMCQ ? "سؤال MCQ" : "فقرة مع أسئلة"}</span>
// // //                 </div>

// // //                 {q?.type != "mcq" && <button className="bg-blue-500 text-white flex justify-center items-center rounded-md">إضافة سؤال</button>}
// // //               </div>

// // //             }
// // //             type="info"
// // //             showIcon
// // //             className="border-2 border-blue-200 bg-blue-50"
// // //           />

// // //           {/* EDIT HEADER BAR */}
// // //           <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200">
// // //             <div className="flex items-center gap-3">
// // //               <Badge
// // //                 count={isMCQ ? "MCQ" : "فقرة"}
// // //                 color={isMCQ ? "blue" : "purple"}
// // //                 className="font-bold"
// // //               />
// // //               <span className="font-bold text-gray-900 text-lg">
// // //                 {isMCQ ? "تعديل سؤال اختيار متعدد" : "تعديل فقرة وأسئلتها"}
// // //               </span>
// // //             </div>

// // //             <Space size="middle">
// // //               <Button
// // //                 onClick={cancelEditing}
// // //                 icon={<X className="w-4 h-4" />}
// // //                 size="large"
// // //                 className="hover:bg-gray-100"
// // //               >
// // //                 إلغاء التعديل
// // //               </Button>

// // //               {isMCQ && (
// // //                 <Button
// // //                   type="primary"
// // //                   icon={<Save className="w-4 h-4" />}
// // //                   loading={edit_question_loading}
// // //                   onClick={() => handleSaveMCQ(q)}
// // //                   size="large"
// // //                   className="min-w-[120px]"
// // //                 >
// // //                   حفظ التغييرات
// // //                 </Button>
// // //               )}
// // //             </Space>
// // //           </div>

// // //           {/* MCQ EDIT UI */}
// // //           {isMCQ && (
// // //             <AntCard
// // //               title={
// // //                 <div className="flex items-center gap-2">
// // //                   <List className="w-5 h-5" />
// // //                   <span>محتوى السؤال</span>
// // //                 </div>
// // //               }
// // //               className="shadow-lg border-0"
// // //             >
// // //               <div className="space-y-6">
// // //                 <div>
// // //                   <label className="block text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
// // //                     <span className="bg-blue-100 text-blue-700 w-6 h-6 rounded-full flex items-center justify-center">1</span>
// // //                     نص السؤال
// // //                   </label>
// // //                   <div className="border border-gray-200 rounded-lg overflow-hidden">
// // //                     <ReactQuill
// // //                       value={editingContent}
// // //                       onChange={setEditingContent}
// // //                       modules={quillModules}
// // //                       formats={quillFormats}
// // //                       className="bg-white min-h-[150px]"
// // //                       placeholder="أدخل نص السؤال هنا..."
// // //                     />
// // //                   </div>
// // //                 </div>

// // //                 <Divider>
// // //                   <span className="text-gray-500 font-medium">الخيارات</span>
// // //                 </Divider>

// // //                 <div className="space-y-4">
// // //                   <div className="flex items-center justify-between">
// // //                     <label className="block text-sm font-semibold text-gray-800 flex items-center gap-2">
// // //                       <span className="bg-green-100 text-green-700 w-6 h-6 rounded-full flex items-center justify-center">2</span>
// // //                       قم بتحديد الإجابة الصحيحة
// // //                     </label>
// // //                     <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
// // //                       اختر إجابة صحيحة واحدة
// // //                     </span>
// // //                   </div>

// // //                   <div className="space-y-4">
// // //                     {editingOptions.map((opt, idx) => (
// // //                       <div
// // //                         key={opt?.id ?? idx}
// // //                         className={`p-6 rounded-2xl border-2 transition-all duration-300 ${editingCorrectAnswer === idx
// // //                             ? "border-emerald-400 bg-gradient-to-r from-emerald-50 to-green-50 shadow-md"
// // //                             : "border-gray-200 bg-gray-50 hover:bg-white"
// // //                           }`}
// // //                       >
// // //                         <div className="flex items-center justify-between mb-4">
// // //                           <div className="flex items-center gap-4">
// // //                             <div className="relative">
// // //                               <input
// // //                                 type="radio"
// // //                                 checked={editingCorrectAnswer === idx}
// // //                                 onChange={() => setEditingCorrectAnswer(idx)}
// // //                                 className="w-6 h-6 cursor-pointer"
// // //                                 id={`option-${idx}`}
// // //                               />
// // //                               <label
// // //                                 htmlFor={`option-${idx}`}
// // //                                 className="absolute inset-0 cursor-pointer"
// // //                               />
// // //                             </div>
// // //                             <span className="font-medium text-gray-700">
// // //                               {editingCorrectAnswer === idx ? (
// // //                                 <span className="text-emerald-600 flex items-center gap-2">
// // //                                   <span className="w-2 h-2 bg-emerald-600 rounded-full"></span>
// // //                                   الإجابة الصحيحة
// // //                                 </span>
// // //                               ) : (
// // //                                 "إجابة خاطئة"
// // //                               )}
// // //                             </span>
// // //                           </div>

// // //                           <div className="flex items-center gap-3">
// // //                             <span className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg text-sm font-medium">
// // //                               {String.fromCharCode(1632 + idx + 1)}
// // //                             </span>
// // //                             <span className="text-sm text-gray-500">
// // //                               الخيار {idx + 1}
// // //                             </span>
// // //                           </div>
// // //                         </div>

// // //                         <div className="space-y-4 pl-10">
// // //                           <div>
// // //                             <label className="text-sm text-gray-600 mb-2 block font-medium">
// // //                               نص الخيار
// // //                             </label>
// // //                             <div className="border border-gray-200 rounded-lg overflow-hidden">
// // //                               <ReactQuill
// // //                                 value={opt.text}
// // //                                 onChange={(v) => {
// // //                                   setEditingOptions((prev) => {
// // //                                     const copy = [...prev];
// // //                                     copy[idx] = { ...copy[idx], text: v };
// // //                                     return copy;
// // //                                   });
// // //                                 }}
// // //                                 modules={quillModules}
// // //                                 formats={quillFormats}
// // //                                 className="bg-white min-h-[100px]"
// // //                               />
// // //                             </div>
// // //                           </div>

// // //                           <div>
// // //                             <label className="text-sm text-gray-600 mb-2 block font-medium">
// // //                               <span className="text-gray-400">(اختياري)</span> الشرح
// // //                             </label>
// // //                             <div className="border border-gray-200 rounded-lg overflow-hidden">
// // //                               <ReactQuill
// // //                                 value={opt.explanation}
// // //                                 onChange={(v) => {
// // //                                   setEditingOptions((prev) => {
// // //                                     const copy = [...prev];
// // //                                     copy[idx] = { ...copy[idx], explanation: v };
// // //                                     return copy;
// // //                                   });
// // //                                 }}
// // //                                 modules={quillModules}
// // //                                 formats={quillFormats}
// // //                                 className="bg-white min-h-[100px]"
// // //                                 placeholder="أدخل شرحاً للخيار (اختياري)..."
// // //                               />
// // //                             </div>
// // //                           </div>
// // //                         </div>
// // //                       </div>
// // //                     ))}
// // //                   </div>
// // //                 </div>

// // //                 <div className="flex justify-end gap-3 pt-6 border-t">
// // //                   <Button
// // //                     onClick={cancelEditing}
// // //                     icon={<X className="w-4 h-4" />}
// // //                     size="large"
// // //                   >
// // //                     إلغاء
// // //                   </Button>
// // //                   <Button
// // //                     type="primary"
// // //                     icon={<Save className="w-4 h-4" />}
// // //                     loading={edit_question_loading}
// // //                     onClick={() => handleSaveMCQ(q)}
// // //                     size="large"
// // //                     className="min-w-[140px]"
// // //                   >
// // //                     حفظ السؤال
// // //                   </Button>
// // //                 </div>
// // //               </div>
// // //             </AntCard>
// // //           )}

// // //           {/* PARAGRAPH EDIT UI */}
// // //           {isParagraph && (
// // //             <div className="space-y-6">
// // //               {/* <Steps
// // //                 current={0}
// // //                 items={[
// // //                   { title: 'تعديل الفقرة', description: 'النص الرئيسي' },
// // //                   { title: 'الأسئلة', description: `${editingParagraphQuestions.length} سؤال` },
// // //                   { title: 'مراجعة', description: 'الحفظ النهائي' },
// // //                 ]}
// // //                 className="mb-8"
// // //               /> */}

// // //               {/* Paragraph content card */}
// // //               <AntCard
// // //                 title={
// // //                   <div className="flex items-center gap-2">
// // //                     <FileText className="w-5 h-5" />
// // //                     <span>نص الفقرة الرئيسي</span>
// // //                   </div>
// // //                 }
// // //                 extra={
// // //                   <Space>
// // //                     <Tooltip title="حفظ نص الفقرة فقط">
// // //                       <Button
// // //                         type="primary"
// // //                         loading={edit_paragraph_loading}
// // //                         onClick={() => handleEditParagraphContent(q)}
// // //                         icon={<Save className="w-4 h-4" />}
// // //                       >
// // //                         حفظ الفقرة
// // //                       </Button>
// // //                     </Tooltip>
// // //                     <Tooltip title="حذف الفقرة بالكامل مع أسئلتها">
// // //                       <Button
// // //                         danger
// // //                         loading={delete_paragraph_loading}
// // //                         onClick={() => {
// // //                           setQuestionToDelete({ type: "paragraph", id: q?.id });
// // //                           setDeleteModal(true);
// // //                         }}
// // //                         icon={<Trash2 className="w-4 h-4" />}
// // //                       >
// // //                         حذف الفقرة
// // //                       </Button>
// // //                     </Tooltip>
// // //                   </Space>
// // //                 }
// // //                 className="shadow-lg border-0"
// // //               >
// // //                 <div className="border border-gray-200 rounded-lg overflow-hidden">
// // //                   <ReactQuill
// // //                     value={editingParagraphContent}
// // //                     onChange={setEditingParagraphContent}
// // //                     modules={quillModules}
// // //                     formats={quillFormats}
// // //                     className="bg-white min-h-[200px]"
// // //                     placeholder="أدخل نص الفقرة هنا..."
// // //                   />
// // //                 </div>
// // //                 <div className="mt-4 text-sm text-gray-500">
// // //                   <AlertCircle className="w-4 h-4 inline mr-1" />
// // //                   سيتم حفظ التغييرات عند النقر على زر "حفظ الفقرة"
// // //                 </div>
// // //               </AntCard>

// // //               {/* Paragraph questions list */}
// // //               <AntCard
// // //                 title={
// // //                   <div className="flex items-center justify-between">
// // //                     <div className="flex items-center gap-2">
// // //                       <List className="w-5 h-5" />
// // //                       <span>أسئلة الفقرة</span>
// // //                       <Badge count={editingParagraphQuestions.length} color="blue" />
// // //                     </div>
// // //                     <span className="text-sm text-gray-500">
// // //                       {editingParagraphQuestions.length} سؤال
// // //                     </span>
// // //                   </div>
// // //                 }
// // //                 className="shadow-lg border-0"
// // //               >
// // //                 <div className="space-y-6">
// // //                   {editingParagraphQuestions?.map((pq, qIdx) => (
// // //                     <div
// // //                       key={pq?.id ?? qIdx}
// // //                       className="p-6 rounded-2xl border border-gray-200 bg-gray-50/50 space-y-6"
// // //                     >
// // //                       <div className="flex items-center justify-between">
// // //                         <div className="flex items-center gap-4">
// // //                           <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">
// // //                             {qIdx + 1}
// // //                           </div>
// // //                           <div>
// // //                             <div className="font-bold text-gray-900 text-lg">
// // //                               سؤال {qIdx + 1}
// // //                             </div>
// // //                             <div className="text-sm text-gray-500">
// // //                               داخل الفقرة
// // //                             </div>
// // //                           </div>
// // //                         </div>

// // //                         <Space>
// // //                           <Button
// // //                             type="primary"
// // //                             icon={<Save className="w-4 h-4" />}
// // //                             loading={edit_question_loading}
// // //                             onClick={() => handleSaveParagraph(pq)}
// // //                             size="middle"
// // //                           >
// // //                             حفظ السؤال
// // //                           </Button>
// // //                           <Button
// // //                             danger
// // //                             icon={<Trash2 className="w-4 h-4" />}
// // //                             onClick={() => setDeleteParagraphModal(pq)}
// // //                             size="middle"
// // //                           >
// // //                             حذف السؤال
// // //                           </Button>
// // //                         </Space>
// // //                       </div>

// // //                       <div>
// // //                         <label className="text-sm font-semibold text-gray-800 mb-2 block">
// // //                           نص السؤال
// // //                         </label>
// // //                         <div className="border border-gray-200 rounded-lg overflow-hidden">
// // //                           <ReactQuill
// // //                             value={pq.questionText}
// // //                             onChange={(v) => {
// // //                               setEditingParagraphQuestions((prev) => {
// // //                                 const copy = [...prev];
// // //                                 copy[qIdx] = { ...copy[qIdx], questionText: v };
// // //                                 return copy;
// // //                               });
// // //                             }}
// // //                             modules={quillModules}
// // //                             formats={quillFormats}
// // //                             className="bg-white min-h-[120px]"
// // //                           />
// // //                         </div>
// // //                       </div>

// // //                       <div>
// // //                         <div className="flex items-center justify-between mb-4">
// // //                           <label className="text-sm font-semibold text-gray-800">
// // //                             الخيارات
// // //                           </label>
// // //                           <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
// // //                             اختر إجابة صحيحة واحدة لكل سؤال
// // //                           </span>
// // //                         </div>

// // //                         <div className="space-y-4">
// // //                           {(pq.options || []).map((opt, oIdx) => (
// // //                             <div
// // //                               key={opt?.id ?? oIdx}
// // //                               className={`p-5 rounded-xl border-2 transition-all ${opt.isCorrect
// // //                                   ? "border-emerald-400 bg-gradient-to-r from-emerald-50 to-green-50"
// // //                                   : "border-gray-200 bg-white hover:border-gray-300"
// // //                                 }`}
// // //                             >
// // //                               <div className="flex items-center justify-between mb-4">
// // //                                 <div className="flex items-center gap-4">
// // //                                   <div className="relative">
// // //                                     <input
// // //                                       type="radio"
// // //                                       checked={!!opt.isCorrect}
// // //                                       onChange={() => {
// // //                                         setEditingParagraphQuestions((prev) => {
// // //                                           const copy = [...prev];
// // //                                           const qCopy = { ...copy[qIdx] };
// // //                                           qCopy.options = qCopy.options.map(
// // //                                             (o, ii) => ({
// // //                                               ...o,
// // //                                               isCorrect: ii === oIdx,
// // //                                             })
// // //                                           );
// // //                                           copy[qIdx] = qCopy;
// // //                                           return copy;
// // //                                         });
// // //                                       }}
// // //                                       className="w-5 h-5 cursor-pointer"
// // //                                       id={`pq-${qIdx}-opt-${oIdx}`}
// // //                                     />
// // //                                     <label
// // //                                       htmlFor={`pq-${qIdx}-opt-${oIdx}`}
// // //                                       className="absolute inset-0 cursor-pointer"
// // //                                     />
// // //                                   </div>
// // //                                   <span className={`font-medium ${opt.isCorrect ? 'text-emerald-600' : 'text-gray-700'}`}>
// // //                                     {opt.isCorrect ? "✓ إجابة صحيحة" : "إجابة خاطئة"}
// // //                                   </span>
// // //                                 </div>

// // //                                 <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg text-sm font-medium">
// // //                                   {String.fromCharCode(1632 + oIdx + 1)}
// // //                                 </span>
// // //                               </div>

// // //                               <div className="space-y-4 pl-9">
// // //                                 <div>
// // //                                   <label className="text-sm text-gray-600 mb-2 block">
// // //                                     نص الخيار
// // //                                   </label>
// // //                                   <div className="border border-gray-200 rounded-lg overflow-hidden">
// // //                                     <ReactQuill
// // //                                       value={opt.text}
// // //                                       onChange={(v) => {
// // //                                         setEditingParagraphQuestions((prev) => {
// // //                                           const copy = [...prev];
// // //                                           const qCopy = { ...copy[qIdx] };
// // //                                           const opts = [...(qCopy.options || [])];
// // //                                           opts[oIdx] = { ...opts[oIdx], text: v };
// // //                                           qCopy.options = opts;
// // //                                           copy[qIdx] = qCopy;
// // //                                           return copy;
// // //                                         });
// // //                                       }}
// // //                                       modules={quillModules}
// // //                                       formats={quillFormats}
// // //                                       className="bg-white min-h-[80px]"
// // //                                     />
// // //                                   </div>
// // //                                 </div>

// // //                                 <div>
// // //                                   <label className="text-sm text-gray-600 mb-2 block">
// // //                                     <span className="text-gray-400">(اختياري)</span> الشرح
// // //                                   </label>
// // //                                   <div className="border border-gray-200 rounded-lg overflow-hidden">
// // //                                     <ReactQuill
// // //                                       value={opt.explanation}
// // //                                       onChange={(v) => {
// // //                                         setEditingParagraphQuestions((prev) => {
// // //                                           const copy = [...prev];
// // //                                           const qCopy = { ...copy[qIdx] };
// // //                                           const opts = [...(qCopy.options || [])];
// // //                                           opts[oIdx] = {
// // //                                             ...opts[oIdx],
// // //                                             explanation: v,
// // //                                           };
// // //                                           qCopy.options = opts;
// // //                                           copy[qIdx] = qCopy;
// // //                                           return copy;
// // //                                         });
// // //                                       }}
// // //                                       modules={quillModules}
// // //                                       formats={quillFormats}
// // //                                       className="bg-white min-h-[80px]"
// // //                                     />
// // //                                   </div>
// // //                                 </div>
// // //                               </div>
// // //                             </div>
// // //                           ))}
// // //                         </div>
// // //                       </div>
// // //                     </div>
// // //                   ))}
// // //                 </div>

// // //                 <Divider className="!my-6" />

// // //                 <div className="flex justify-between items-center">
// // //                   <div className="text-sm text-gray-500">
// // //                     <AlertCircle className="w-4 h-4 inline mr-1" />
// // //                     يجب حفظ كل سؤال على حدة
// // //                   </div>
// // //                   <Space>
// // //                     <Button onClick={cancelEditing} icon={<X className="w-4 h-4" />}>
// // //                       إغلاق التعديل
// // //                     </Button>
// // //                   </Space>
// // //                 </div>
// // //               </AntCard>
// // //             </div>
// // //           )}
// // //         </div>
// // //       );
// // //     }

// // //     // ====== NORMAL DISPLAY MODE ======
// // //     return (
// // //       <div className="space-y-8 px-2">
// // //         {q.type === "paragraph_mcq" && (
// // //           <div className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-3xl shadow-sm">
// // //             <div className="flex items-center justify-between mb-4">
// // //               <div className="flex items-center gap-3">
// // //                 <FileText className="w-6 h-6 text-blue-600" />
// // //                 <h4 className="font-bold text-blue-900 text-xl">الفقرة الرئيسية</h4>
// // //               </div>
// // //               <Tag color="blue" icon={<FileText />} className="text-sm px-4 py-1 rounded-full">
// // //                 فقرة نصية
// // //               </Tag>
// // //             </div>
// // //             <div
// // //               dangerouslySetInnerHTML={{ __html: q.paragraphContent }}
// // //               className="text-gray-800 leading-relaxed text-lg bg-white p-6 rounded-2xl border border-gray-100"
// // //             />
// // //             <div className="mt-4 flex items-center gap-2 text-blue-700">
// // //               <AlertCircle className="w-4 h-4" />
// // //               <span className="text-sm">تحتوي على {q.questions?.length || 0} سؤال</span>
// // //             </div>
// // //           </div>
// // //         )}

// // //         <div className="space-y-6">
// // //           {(q.type === "mcq"
// // //             ? [
// // //               {
// // //                 questionText: q.question,
// // //                 options: q.options,
// // //                 correctAnswer: q.correctAnswer,
// // //               },
// // //             ]
// // //             : q.questions
// // //           ).map((item, qIdx) => (
// // //             <div
// // //               key={qIdx}
// // //               className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm hover:shadow-md transition-shadow"
// // //             >
// // //               {q.type === "paragraph_mcq" && (
// // //                 <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
// // //                   <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-lg">
// // //                     {qIdx + 1}
// // //                   </div>
// // //                   <div>
// // //                     <h4 className="font-bold text-gray-900 text-lg">سؤال الفقرة {qIdx + 1}</h4>
// // //                     <p className="text-sm text-gray-500">جزء من الفقرة الرئيسية</p>
// // //                   </div>
// // //                 </div>
// // //               )}

// // //               <div
// // //                 dangerouslySetInnerHTML={{ __html: item.questionText }}
// // //                 className="text-gray-800 leading-relaxed text-xl mb-8 font-medium bg-gray-50 p-6 rounded-2xl"
// // //               />

// // //               <div className="grid gap-4">
// // //                 {item.options.map((opt, oIdx) => {
// // //                   const isCorrect =
// // //                     q.type === "mcq"
// // //                       ? oIdx === q.correctAnswer
// // //                       : !!opt.isCorrect;

// // //                   return (
// // //                     <div
// // //                       key={opt?.id ?? oIdx}
// // //                       className={`p-6 rounded-2xl border-2 transition-all duration-300 ${isCorrect
// // //                           ? "bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-300 shadow-sm"
// // //                           : "bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50"
// // //                         }`}
// // //                     >
// // //                       <div className="flex items-start gap-4">
// // //                         <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${isCorrect
// // //                             ? "bg-emerald-100 text-emerald-700 border-2 border-emerald-300"
// // //                             : "bg-gray-100 text-gray-700 border-2 border-gray-300"
// // //                           }`}>
// // //                           {String.fromCharCode(1632 + oIdx + 1)}
// // //                         </div>
// // //                         <div className="flex-1">
// // //                           <div
// // //                             dangerouslySetInnerHTML={{ __html: opt.text }}
// // //                             className="font-medium text-gray-800 leading-relaxed text-lg"
// // //                           />
// // //                           {opt.explanation && (
// // //                             <div className="mt-4 pt-4 border-t border-gray-200">
// // //                               <div className="flex items-center gap-2 mb-2">
// // //                                 <span className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
// // //                                   الشرح
// // //                                 </span>
// // //                               </div>
// // //                               <div
// // //                                 dangerouslySetInnerHTML={{
// // //                                   __html: opt.explanation,
// // //                                 }}
// // //                                 className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-xl"
// // //                               />
// // //                             </div>
// // //                           )}
// // //                         </div>
// // //                         {isCorrect && (
// // //                           <div className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2">
// // //                             <span className="w-2 h-2 bg-emerald-600 rounded-full"></span>
// // //                             صحيح
// // //                           </div>
// // //                         )}
// // //                       </div>
// // //                     </div>
// // //                   );
// // //                 })}
// // //               </div>
// // //             </div>
// // //           ))}
// // //         </div>

// // //         {/* Actions */}
// // //         <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 border-t border-gray-200">
// // //           <div className="text-sm text-gray-500">
// // //             <span className="font-medium">نوع السؤال:</span>{" "}
// // //             <Tag color={q.type === "mcq" ? "blue" : "purple"} className="mx-2">
// // //               {q.type === "mcq" ? "MCQ" : "فقرة"}
// // //             </Tag>
// // //             <span>•</span>
// // //             <span className="mx-2">عدد الخيارات: {q.type === "mcq" ? q.options.length : q.questions[0]?.options?.length}</span>
// // //           </div>

// // //           <Space size="middle">
// // //             <Button
// // //               size="large"
// // //               icon={<Edit3 className="w-5 h-5" />}
// // //               type="primary"
// // //               ghost
// // //               onClick={() => startEditing(q)}
// // //               className="min-w-[120px]"
// // //             >
// // //               تعديل
// // //             </Button>

// // //             {q.type === "mcq" && (
// // //               <Button
// // //                 size="large"
// // //                 icon={<Trash2 className="w-5 h-5" />}
// // //                 danger
// // //                 onClick={() => {
// // //                   setQuestionToDelete(q);
// // //                   setDeleteModal(true);
// // //                 }}
// // //                 loading={delete_question_loading}
// // //                 className="min-w-[120px]"
// // //               >
// // //                 حذف
// // //               </Button>
// // //             )}
// // //           </Space>
// // //         </div>
// // //       </div>
// // //     );
// // //   };

// // //   if (get_exam_question_loading) {
// // //     return (
// // //       <div className="flex flex-col items-center justify-center py-32">
// // //         <Spin size="large" />
// // //         <p className="mt-4 text-gray-600 text-lg">جاري تحميل الأسئلة...</p>
// // //         <p className="text-sm text-gray-400 mt-2">يرجى الانتظار</p>
// // //       </div>
// // //     );
// // //   }

// // //   return (
// // //     <Card title="أسئلة الامتحان" icon={FileText} className="p-0 overflow-hidden">
// // //       <div className="p-6">
// // //         {apiQuestions.length === 0 ? (
// // //           <Empty
// // //             description={
// // //               <div className="space-y-4">
// // //                 <div className="text-2xl font-bold text-gray-700">لا توجد أسئلة</div>
// // //                 <p className="text-gray-500">لم يتم إضافة أي أسئلة إلى هذا القسم بعد</p>
// // //               </div>
// // //             }
// // //             image={Empty.PRESENTED_IMAGE_SIMPLE}
// // //             className="py-16"
// // //           />
// // //         ) : (
// // //           <div className="space-y-8">
// // //             {/* SECTION HEADER WITH CONTROLS */}
// // //             <div className="p-8 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-3xl border-2 border-indigo-200 shadow-lg">
// // //               <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
// // //                 <div className="flex-1">
// // //                   <div className="flex items-center gap-3 mb-4">
// // //                     <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center text-xl font-bold">
// // //                       {apiQuestions.length}
// // //                     </div>
// // //                     <div>
// // //                       <h2
// // //                         dangerouslySetInnerHTML={{ __html: selectedSection?.title || "قسم الامتحان" }}
// // //                         className="text-3xl font-bold text-indigo-900">
// // //                       </h2>
// // //                       <div className="flex items-center gap-4 mt-2">
// // //                         <span className="text-lg text-indigo-700">
// // //                           <span className="font-bold">{apiQuestions.length}</span> سؤال
// // //                         </span>
// // //                         <span className="text-gray-400">•</span>
// // //                         <span className="text-sm text-gray-600">
// // //                           {apiQuestions.filter(q => q.type === "mcq").length} MCQ
// // //                         </span>
// // //                         <span className="text-gray-400">•</span>
// // //                         <span className="text-sm text-gray-600">
// // //                           {apiQuestions.filter(q => q.type === "paragraph_mcq").length} فقرة
// // //                         </span>
// // //                       </div>
// // //                     </div>
// // //                   </div>

// // //                 </div>
// // //               </div>
// // //             </div>

// // //             {/* QUESTIONS LIST */}
// // //             <div className="space-y-6">
// // //               <div className="flex items-center justify-between mb-4">
// // //                 <h3 className="text-xl font-bold text-gray-900">قائمة الأسئلة</h3>
// // //                 <div className="text-sm text-gray-500">
// // //                   {Object.values(expandedQuestions).filter(Boolean).length} من {apiQuestions.length} مفتوح
// // //                 </div>
// // //               </div>

// // //               {apiQuestions.map((q, index) => {
// // //                 const isExp = isExpanded(q.id, q.type);
// // //                 const typeLabel = q.type === "mcq" ? "سؤال اختيار متعدد" : "فقرة مع أسئلة";

// // //                 return (
// // //                   <div
// // //                     key={`${q.type}-${q.id}`}
// // //                     className={`bg-white rounded-3xl overflow-hidden shadow-xl border-2 transition-all duration-300 ${isExp ? "border-indigo-300 shadow-2xl" : "border-gray-100 hover:border-gray-300"
// // //                       } ${editingQuestionId === q.id ? "ring-4 ring-blue-100" : ""}`}
// // //                   >
// // //                     {/* QUESTION HEADER */}
// // //                     <div
// // //                       onClick={() => toggleQuestion(q.id, q.type)}
// // //                       className={`flex items-center justify-between p-6 cursor-pointer transition-colors ${isExp ? "bg-gradient-to-r from-blue-50 to-indigo-50" : "hover:bg-gray-50"
// // //                         }`}
// // //                     >
// // //                       <div className="flex items-center gap-5">
// // //                         <div className="relative">
// // //                           <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold shadow-lg ${q.type === "mcq"
// // //                               ? "bg-gradient-to-br from-blue-500 to-cyan-500 text-white"
// // //                               : "bg-gradient-to-br from-purple-500 to-pink-500 text-white"
// // //                             }`}>
// // //                             {index + 1}
// // //                           </div>
// // //                           {q.type === "paragraph_mcq" && (
// // //                             <Badge
// // //                               count={q.questions?.length || 0}
// // //                               color="purple"
// // //                               className="absolute -top-2 -right-2 shadow-lg"
// // //                             />
// // //                           )}
// // //                         </div>

// // //                         <div className="flex-1">
// // //                           <div className="flex items-center gap-3 mb-2">
// // //                             <h4 className="font-bold text-xl text-gray-900">
// // //                               {typeLabel}
// // //                             </h4>
// // //                             <Tag
// // //                               color={q.type === "mcq" ? "blue" : "purple"}
// // //                               className="text-sm px-3 py-1 rounded-full font-bold"
// // //                             >
// // //                               {q.type === "mcq" ? "MCQ" : "فقرة"}
// // //                             </Tag>

// // //                           </div>
// // //                           <div
// // //                             className="text-sm text-gray-600 line-clamp-2 leading-relaxed"
// // //                             dangerouslySetInnerHTML={{
// // //                               __html:
// // //                                 q.type === "mcq"
// // //                                   ? q.question
// // //                                   : q.paragraphContent?.substring(0, 150) + (q.paragraphContent?.length > 150 ? "..." : "") ||
// // //                                   "فقرة نصية مع أسئلة",
// // //                             }}
// // //                           />
// // //                         </div>
// // //                       </div>

// // //                       <div className="flex items-center gap-6">
// // //                         <div className="text-right flex gap-1 items-center hidden md:block">
// // //                           <div className="text-sm text-gray-500">عدد الخيارات</div>
// // //                           <div className="font-bold text-gray-900">
// // //                             {q.type === "mcq" ? q.options.length : q.questions[0]?.options?.length || 0}
// // //                           </div>
// // //                         </div>

// // //                         <div className="flex  items-center gap-2">
// // //                           {isExp ? (
// // //                             <ChevronUp className="w-6 h-6 text-indigo-600" />
// // //                           ) : (
// // //                             <ChevronDown className="w-6 h-6 text-gray-500" />
// // //                           )}
// // //                           <span className="text-xs text-gray-500">
// // //                             {isExp ? "إغلاق" : "فتح"}
// // //                           </span>
// // //                         </div>
// // //                       </div>
// // //                     </div>

// // //                     {/* QUESTION CONTENT */}
// // //                     {isExp && (
// // //                       <div className="border-t-2 border-gray-100">
// // //                         <div className="p-1">
// // //                           <div className="bg-gradient-to-r from-gray-50 to-white rounded-2xl m-4">
// // //                             {renderQuestionContent(q)}
// // //                           </div>
// // //                         </div>
// // //                       </div>
// // //                     )}
// // //                   </div>
// // //                 );
// // //               })}
// // //             </div>
// // //           </div>
// // //         )}
// // //       </div>

// // //       {/* DELETE MODALS */}
// // //       <Modal
// // //         open={deleteModal}
// // //         onCancel={() => setDeleteModal(false)}
// // //         onOk={handleDeleteAny}
// // //         okText="نعم، احذف"
// // //         cancelText="إلغاء"
// // //         okButtonProps={{
// // //           danger: true,
// // //           loading:
// // //             questionToDelete?.type === "mcq"
// // //               ? delete_question_loading
// // //               : delete_paragraph_loading,
// // //           className: "min-w-[120px]",
// // //         }}
// // //         cancelButtonProps={{
// // //           className: "min-w-[120px]",
// // //         }}
// // //         width={520}
// // //         className="text-center"
// // //       >
// // //         <div className="py-8 px-4">
// // //           <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
// // //             <Trash2 className="w-10 h-10 text-red-600" />
// // //           </div>
// // //           <h3 className="text-2xl font-bold text-gray-900 mb-3">
// // //             تأكيد الحذف
// // //           </h3>
// // //           <p className="text-gray-600 text-base leading-relaxed mb-6">
// // //             هل أنت متأكد من حذف{" "}
// // //             <span className="font-bold text-red-600">
// // //               {questionToDelete?.type === "mcq" ? "هذا السؤال" : "هذه الفقرة"}
// // //             </span>
// // //             ؟
// // //             <br />
// // //             <span className="text-sm text-gray-500 mt-2 block">
// // //               هذا الإجراء لا يمكن التراجع عنه وسيتم حذف جميع البيانات المرتبطة
// // //             </span>
// // //           </p>
// // //         </div>
// // //       </Modal>

// // //       <Modal
// // //         open={!!deleteParagraphModal}
// // //         onCancel={() => setDeleteParagraphModal(false)}
// // //         onOk={handleDeleteParagraphQuestions}
// // //         okText="نعم، احذف السؤال"
// // //         cancelText="إلغاء"
// // //         okButtonProps={{
// // //           danger: true,
// // //           loading: delete_question_loading,
// // //           className: "min-w-[140px]",
// // //         }}
// // //         cancelButtonProps={{
// // //           className: "min-w-[120px]",
// // //         }}
// // //         width={520}
// // //         className="text-center"
// // //       >
// // //         <div className="py-8 px-4">
// // //           <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-orange-100 flex items-center justify-center">
// // //             <AlertCircle className="w-10 h-10 text-orange-600" />
// // //           </div>
// // //           <h3 className="text-2xl font-bold text-gray-900 mb-3">
// // //             حذف سؤال من الفقرة
// // //           </h3>
// // //           <p className="text-gray-600 text-base leading-relaxed mb-6">
// // //             سيتم حذف هذا السؤال فقط من الفقرة
// // //             <br />
// // //             <span className="text-sm text-gray-500 mt-2 block">
// // //               باقي الأسئلة في الفقرة ستبقى كما هي
// // //             </span>
// // //           </p>
// // //         </div>
// // //       </Modal>
// // //     </Card>
// // //   );
// // // }


// // "use client";

// // import React, { useMemo, useState, useEffect } from "react";
// // import {
// //   Edit3, Trash2, Save, X, ChevronDown, ChevronUp,
// //   FileText, List, Eye, EyeOff, AlertCircle, Plus,
// //   Minus, Copy, MessageSquare, HelpCircle
// // } from "lucide-react";
// // import {
// //   Empty, Spin, Tag, Button, Modal, Divider, Tooltip,
// //   Space, Alert, Card as AntCard, Steps, Badge, Collapse,
// //   Input, Popconfirm, notification
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
// //   handleAddQuestion as handleCreateExamQuestions
// // } from "../../lib/features/examSlice";
// // import { toast } from "react-toastify";

// // const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
// // import "react-quill-new/dist/quill.snow.css";
// // const { Panel } = Collapse;

// // export default function DisplayQuestions({
// //   selectedSectionId,
// //   setEditingQuestion,
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

// //   const [expandedQuestions, setExpandedQuestions] = useState({});
// //   const [expandedParagraphQuestions, setExpandedParagraphQuestions] = useState({});
// //   const [editingQuestionId, setEditingQuestionId] = useState(null);
// //   const [editingType, setEditingType] = useState(null);
// //   const [showAllQuestions, setShowAllQuestions] = useState(false);

// //   // MCQ editing
// //   const [editingContent, setEditingContent] = useState("");
// //   const [editingOptions, setEditingOptions] = useState([]);
// //   const [editingCorrectAnswer, setEditingCorrectAnswer] = useState(0);

// //   // Paragraph editing
// //   const [editingParagraphContent, setEditingParagraphContent] = useState("");
// //   const [editingParagraphQuestions, setEditingParagraphQuestions] = useState([]);

// //   // Delete modals
// //   const [deleteParagraphModal, setDeleteParagraphModal] = useState(false);
// //   const [deleteModal, setDeleteModal] = useState(false);
// //   const [questionToDelete, setQuestionToDelete] = useState(null);

// //   useEffect(() => {
// //     if (get_exam_questions_list) {
// //       const initial = {};
// //       (get_exam_questions_list?.data?.message?.mcq || []).forEach(
// //         (q) => (initial[`mcq-${q.id}`] = false)
// //       );
// //       (get_exam_questions_list?.data?.message?.paragraphs || []).forEach(
// //         (p) => (initial[`paragraph-${p.paragraph.id}`] = false)
// //       );
// //       setExpandedQuestions(initial);

// //       // Initialize paragraph questions as collapsed by default
// //       const paragraphQuestionsInitial = {};
// //       (get_exam_questions_list?.data?.message?.paragraphs || []).forEach((p) => {
// //         (p.questions || []).forEach((q) => {
// //           paragraphQuestionsInitial[`pq-${q.id}`] = false;
// //         });
// //       });
// //       setExpandedParagraphQuestions(paragraphQuestionsInitial);
// //     }
// //   }, [get_exam_questions_list]);

// //   const quillModules = {
// //     toolbar: [
// //       [{ header: [1, 2, 3, false] }],
// //       ["bold", "italic", "underline"],
// //       [{ list: "ordered" }, { list: "bullet" }],
// //       [{ align: [] }],
// //       ["clean"],
// //       ["link", "image", "formula"],
// //     ],
// //   };

// //   const quillFormats = [
// //     "header",
// //     "bold",
// //     "italic",
// //     "underline",
// //     "list",
// //     "bullet",
// //     "align",
// //     "link",
// //     "image",
// //     "formula",
// //   ];

// //   const apiQuestions = useMemo(() => {
// //     if (!get_exam_questions_list && !selectedSection) return [];

// //     const data = get_exam_questions_list?.data?.message || {
// //       mcq: [],
// //       paragraphs: [],
// //     };

// //     const mcqSource =
// //       data?.mcq && data?.mcq?.length
// //         ? data?.mcq
// //         : selectedSection?.mcq && selectedSection?.mcq?.length
// //           ? selectedSection?.mcq
// //           : [];

// //     const mcqs = mcqSource.map((q) => {
// //       const options = q?.options || [];
// //       const correctIndex = options.findIndex(
// //         (opt) => Number(opt?.is_correct) === 1
// //       );

// //       return {
// //         id: q.id,
// //         type: "mcq",
// //         question: q?.question_text || "",
// //         correctAnswer: correctIndex >= 0 ? correctIndex : 0,
// //         options: options.map((opt) => ({
// //           id: opt?.id,
// //           text: opt.option_text || "",
// //           explanation: opt.question_explanation || "",
// //           isCorrect: Number(opt?.is_correct) === 1,
// //         })),
// //         rawData: q,
// //       };
// //     });

// //     const paragraphSource =
// //       data?.paragraphs && data?.paragraphs?.length
// //         ? data?.paragraphs
// //         : selectedSection?.paragraphs || [];

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
// //       })),
// //       rawData: p,
// //     }));

// //     return [...mcqs, ...paragraphs];
// //   }, [get_exam_questions_list, selectedSection]);

// //   const toggleQuestion = (id, type) => {
// //     const key = `${type === "mcq" ? "mcq" : "paragraph"}-${id}`;
// //     setExpandedQuestions((prev) => ({ ...prev, [key]: !prev[key] }));
// //   };

// //   const toggleParagraphQuestion = (questionId) => {
// //     setExpandedParagraphQuestions((prev) => ({
// //       ...prev,
// //       [`pq-${questionId}`]: !prev[`pq-${questionId}`]
// //     }));
// //   };

// //   const isParagraphQuestionExpanded = (questionId) =>
// //     expandedParagraphQuestions[`pq-${questionId}`] || false;

// //   const isExpanded = (id, type) =>
// //     expandedQuestions[`${type === "mcq" ? "mcq" : "paragraph"}-${id}`] || false;

// //   const expandAll = () => {
// //     const allExpanded = {};
// //     apiQuestions.forEach((q) => {
// //       allExpanded[`${q.type === "mcq" ? "mcq" : "paragraph"}-${q.id}`] = true;
// //       if (q.type === "paragraph_mcq") {
// //         q.questions.forEach((pq) => {
// //           allExpanded[`pq-${pq.id}`] = true;
// //         });
// //       }
// //     });
// //     setExpandedQuestions(allExpanded);
// //     setExpandedParagraphQuestions(allExpanded);
// //     setShowAllQuestions(true);
// //   };

// //   const collapseAll = () => {
// //     const allCollapsed = {};
// //     apiQuestions.forEach((q) => {
// //       allCollapsed[`${q.type === "mcq" ? "mcq" : "paragraph"}-${q.id}`] = false;
// //       if (q.type === "paragraph_mcq") {
// //         q.questions.forEach((pq) => {
// //           allCollapsed[`pq-${pq.id}`] = false;
// //         });
// //       }
// //     });
// //     setExpandedQuestions(allCollapsed);
// //     setExpandedParagraphQuestions(allCollapsed);
// //     setShowAllQuestions(false);
// //   };

// //   const startEditing = (q) => {
// //     setEditingQuestionId(q.id);
// //     setEditingType(q.type);

// //     if (q.type === "mcq") {
// //       setEditingContent(q.question);
// //       setEditingOptions(q.options.map((opt) => ({ ...opt })));
// //       setEditingCorrectAnswer(q.correctAnswer);
// //     } else if (q.type === "paragraph_mcq") {
// //       setEditingParagraphContent(q.paragraphContent);
// //       setEditingParagraphQuestions(
// //         q.questions.map((pq) => ({
// //           id: pq.id,
// //           questionText: pq.questionText,
// //           options: pq.options.map((opt) => ({ ...opt })),
// //         }))
// //       );
// //     }

// //     setEditingQuestion(q);
// //   };

// //   const cancelEditing = () => {
// //     setEditingQuestionId(null);
// //     setEditingType(null);
// //     setEditingContent("");
// //     setEditingOptions([]);
// //     setEditingCorrectAnswer(0);
// //     setEditingParagraphContent("");
// //     setEditingParagraphQuestions([]);
// //     setEditingQuestion(null);
// //   };

// //   const refreshQuestions = () => {
// //     dispatch(
// //       handleGetExamQuestions({
// //         body: { exam_section_id: selectedSectionId },
// //       })
// //     );
// //   };

// //   const handleSaveMCQ = async (q) => {
// //     const payload = {
// //       id: q.id,
// //       question_text: editingContent,
// //       instructions: "Read carefully before answering",
// //       mcq_array: editingOptions?.map((opt, idx) => ({
// //         answer: opt?.text || "",
// //         question_explanation: opt?.explanation || "",
// //         correct_or_not: opt?.isCorrect ? "1" : "0",
// //       })),
// //     };

// //     try {
// //       const res = await dispatch(
// //         handleUpdateExamQuestions({ body: payload })
// //       ).unwrap();

// //       if (res?.data?.status === "success") {
// //         toast.success("تم تعديل السؤال بنجاح");
// //         refreshQuestions();
// //         cancelEditing();
// //       } else {
// //         toast.error(res?.data?.message || "فشل تعديل السؤال");
// //       }
// //     } catch (e) {
// //       toast.error("حصل خطأ أثناء تعديل السؤال");
// //     } finally {
// //       cancelEditing();
// //     }
// //   };

// //   const handleSaveParagraph = async (pq) => {
// //     const payload = {
// //       id: pq?.id,
// //       question_text: pq?.questionText,
// //       instructions: "Read carefully before answering",
// //       mcq_array: (pq?.options || []).map((opt) => ({
// //         answer: opt?.text,
// //         correct_or_not: opt?.isCorrect ? "1" : "0",
// //         question_explanation: opt?.explanation,
// //       })),
// //     };

// //     try {
// //       const res = await dispatch(
// //         handleUpdateExamQuestions({ body: payload })
// //       ).unwrap();

// //       if (res?.data?.status === "success") {
// //         toast.success("تم تعديل أسئلة الفقرة بنجاح");
// //         refreshQuestions();
// //       } else {
// //         toast.error(
// //           res?.error?.response?.data?.message ||
// //           res?.error?.message ||
// //           "فشل تعديل أسئلة الفقرة"
// //         );
// //       }
// //     } catch (e) {
// //       toast.error("حصل خطأ أثناء تعديل الفقرة");
// //     } finally {
// //       cancelEditing();
// //     }
// //   };

// //   // Add new question to paragraph
// //   const addNewQuestionToParagraph = () => {
// //     const newQuestion = {
// //       id: `temp-${Date.now()}`,
// //       questionText: "",
// //       options: [
// //         { id: `opt-${Date.now()}-1`, text: "", explanation: "", isCorrect: false },
// //         { id: `opt-${Date.now()}-2`, text: "", explanation: "", isCorrect: false },
// //         { id: `opt-${Date.now()}-3`, text: "", explanation: "", isCorrect: false },
// //         { id: `opt-${Date.now()}-4`, text: "", explanation: "", isCorrect: false },
// //       ]
// //     };

// //     setEditingParagraphQuestions(prev => [...prev, newQuestion]);

// //     // Auto-expand the new question
// //     setExpandedParagraphQuestions(prev => ({
// //       ...prev,
// //       [`pq-${newQuestion.id}`]: true
// //     }));

// //     toast.info("تمت إضافة سؤال جديد. قم بملء البيانات ثم حفظ السؤال.");
// //   };

// //   // Duplicate existing question
// //   const duplicateQuestion = (questionToDuplicate) => {
// //     const duplicatedQuestion = {
// //       ...questionToDuplicate,
// //       id: `copy-${Date.now()}`,
// //       options: questionToDuplicate.options.map(opt => ({
// //         ...opt,
// //         id: `copy-opt-${Date.now()}-${Math.random()}`
// //       }))
// //     };

// //     setEditingParagraphQuestions(prev => [...prev, duplicatedQuestion]);

// //     // Auto-expand the duplicated question
// //     setExpandedParagraphQuestions(prev => ({
// //       ...prev,
// //       [`pq-${duplicatedQuestion.id}`]: true
// //     }));

// //     toast.success("تم نسخ السؤال بنجاح");
// //   };

// //   // Save new question to paragraph (create)
// //   const handleSaveNewParagraphQuestion = async (pq, paragraphId) => {
// //     if (!pq.questionText.trim()) {
// //       toast.error("يرجى إدخال نص السؤال");
// //       return;
// //     }

// //     const hasCorrectOption = pq.options.some(opt => opt.isCorrect);
// //     if (!hasCorrectOption) {
// //       toast.error("يرجى تحديد إجابة صحيحة واحدة على الأقل");
// //       return;
// //     }

// //     const payload = {
// //       exam_section_id: selectedSectionId,
// //       question_text: pq.questionText,
// //       question_type: "paragraph_mcq",
// //       instructions: "Read carefully before answering",
// //       mcq_array: (pq?.options || []).map((opt) => ({
// //         answer: opt?.text,
// //         correct_or_not: opt?.isCorrect ? "1" : "0",
// //         question_explanation: opt?.explanation,
// //       })),
// //     };

// //     try {
// //       const res = await dispatch(
// //         handleCreateExamQuestions({ body: payload })
// //       ).unwrap();

// //       if (res?.data?.status === "success") {
// //         toast.success("تم إضافة السؤال الجديد بنجاح");
// //         refreshQuestions();

// //         // Remove temp question from editing state
// //         setEditingParagraphQuestions(prev =>
// //           prev.filter(q => q.id !== pq.id)
// //         );
// //       } else {
// //         toast.error(
// //           res?.error?.response?.data?.message ||
// //           res?.error?.message ||
// //           "فشل إضافة السؤال"
// //         );
// //       }
// //     } catch (e) {
// //       toast.error("حصل خطأ أثناء إضافة السؤال");
// //     }
// //   };

// //   // Remove question from editing state (if not saved yet)
// //   const removeUnsavedQuestion = (questionId) => {
// //     setEditingParagraphQuestions(prev =>
// //       prev.filter(q => q.id !== questionId)
// //     );
// //     toast.info("تم إزالة السؤال غير المحفوظ");
// //   };

// //   const handleDeleteParagraphQuestions = async () => {
// //     if (!deleteParagraphModal) return;

// //     try {
// //       const res = await dispatch(
// //         handleDeleteExamQuestions({ body: { id: deleteParagraphModal?.id } })
// //       ).unwrap();

// //       if (res?.data?.status === "success") {
// //         toast.success("تم حذف السؤال بنجاح");
// //         refreshQuestions();
// //         setDeleteParagraphModal(false);
// //       } else {
// //         toast.error(
// //           res?.error?.response?.data?.message ||
// //           res?.data?.message ||
// //           "فشل الحذف"
// //         );
// //       }
// //     } catch (e) {
// //       toast.error("حصل خطأ أثناء الحذف");
// //     }
// //   };

// //   const handleDeleteAny = async () => {
// //     if (!questionToDelete) return;

// //     try {
// //       if (questionToDelete.type === "mcq") {
// //         const res = await dispatch(
// //           handleDeleteExamQuestions({ body: { id: questionToDelete.id } })
// //         ).unwrap();

// //         if (res?.data?.status === "success") {
// //           toast.success("تم حذف السؤال بنجاح");
// //           refreshQuestions();
// //         } else {
// //           toast.error(res?.data?.message || "فشل الحذف");
// //         }
// //       } else {
// //         const res = await dispatch(
// //           handleDeleteParagraph({ body: { id: questionToDelete.id } })
// //         ).unwrap();

// //         if (res?.data?.status === "success") {
// //           toast.success("تم حذف الفقرة بنجاح");
// //           refreshQuestions();
// //         } else {
// //           toast.error(res?.data?.message || "فشل الحذف");
// //         }
// //       }
// //     } catch (e) {
// //       toast.error("حصل خطأ أثناء الحذف");
// //     } finally {
// //       setDeleteModal(false);
// //       setQuestionToDelete(null);
// //     }
// //   };

// //   function handleEditParagraphContent(q) {
// //     const data_send = { id: q?.id, paragraph_content: editingParagraphContent };

// //     dispatch(handleEditParagraph({ body: data_send }))
// //       .unwrap()
// //       .then((res) => {
// //         if (res?.data?.status === "success") {
// //           toast.success(res?.data?.message || "تم تعديل الفقرة بنجاح");
// //           refreshQuestions();
// //         } else {
// //           toast.error(res?.data?.message || "فشل تعديل الفقرة");
// //         }
// //       })
// //       .catch(() => toast.error("حصل خطأ أثناء تعديل نص الفقرة"));
// //   }

// //   const renderQuestionContent = (q) => {
// //     const isEditing = editingQuestionId === q.id;

// //     if (isEditing) {
// //       const isMCQ = q.type === "mcq";
// //       const isParagraph = q.type === "paragraph_mcq";

// //       return (
// //         <div className="space-y-6">
// //           {/* EDIT MODE INDICATOR */}
// //           <Alert
// //             message={
// //               <div className="flex items-center gap-2">
// //                 <Edit3 className="w-4 h-4" />
// //                 <span>وضع التعديل - {isMCQ ? "سؤال MCQ" : "فقرة مع أسئلة"}</span>
// //               </div>
// //             }
// //             type="info"
// //             showIcon
// //             className="border-2 border-blue-200 bg-blue-50"
// //           />

// //           {/* EDIT HEADER BAR */}
// //           <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200">
// //             <div className="flex items-center gap-3">
// //               <Badge
// //                 count={isMCQ ? "MCQ" : "فقرة"}
// //                 color={isMCQ ? "blue" : "purple"}
// //                 className="font-bold"
// //               />
// //               <span className="font-bold text-gray-900 text-lg">
// //                 {isMCQ ? "تعديل سؤال اختيار متعدد" : "تعديل فقرة وأسئلتها"}
// //               </span>
// //             </div>

// //             <Space size="middle">
// //               <Button
// //                 onClick={cancelEditing}
// //                 icon={<X className="w-4 h-4" />}
// //                 size="large"
// //                 className="hover:bg-gray-100"
// //               >
// //                 إلغاء التعديل
// //               </Button>

// //               {isMCQ && (
// //                 <Button
// //                   type="primary"
// //                   icon={<Save className="w-4 h-4" />}
// //                   loading={edit_question_loading}
// //                   onClick={() => handleSaveMCQ(q)}
// //                   size="large"
// //                   className="min-w-[120px]"
// //                 >
// //                   حفظ التغييرات
// //                 </Button>
// //               )}
// //             </Space>
// //           </div>

// //           {/* MCQ EDIT UI */}
// //           {isMCQ && (
// //             <AntCard
// //               title={
// //                 <div className="flex items-center gap-2">
// //                   <List className="w-5 h-5" />
// //                   <span>محتوى السؤال</span>
// //                 </div>
// //               }
// //               className="shadow-lg border-0"
// //             >
// //               <div className="space-y-6">
// //                 <div>
// //                   <label className="block text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
// //                     <span className="bg-blue-100 text-blue-700 w-6 h-6 rounded-full flex items-center justify-center">1</span>
// //                     نص السؤال
// //                   </label>
// //                   <div className="border border-gray-200 rounded-lg overflow-hidden">
// //                     <ReactQuill
// //                       value={editingContent}
// //                       onChange={setEditingContent}
// //                       modules={quillModules}
// //                       formats={quillFormats}
// //                       className="bg-white min-h-[150px]"
// //                       placeholder="أدخل نص السؤال هنا..."
// //                     />
// //                   </div>
// //                 </div>

// //                 <Divider>
// //                   <span className="text-gray-500 font-medium">الخيارات</span>
// //                 </Divider>

// //                 <div className="space-y-4">
// //                   <div className="flex items-center justify-between">
// //                     <label className="block text-sm font-semibold text-gray-800 flex items-center gap-2">
// //                       <span className="bg-green-100 text-green-700 w-6 h-6 rounded-full flex items-center justify-center">2</span>
// //                       قم بتحديد الإجابة الصحيحة
// //                     </label>
// //                     <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
// //                       اختر إجابة صحيحة واحدة
// //                     </span>
// //                   </div>

// //                   <div className="space-y-4">
// //                     {editingOptions.map((opt, idx) => (
// //                       <div
// //                         key={opt?.id ?? idx}
// //                         className={`p-6 rounded-2xl border-2 transition-all duration-300 ${editingCorrectAnswer === idx
// //                           ? "border-emerald-400 bg-gradient-to-r from-emerald-50 to-green-50 shadow-md"
// //                           : "border-gray-200 bg-gray-50 hover:bg-white"
// //                           }`}
// //                       >
// //                         <div className="flex items-center justify-between mb-4">
// //                           <div className="flex items-center gap-4">
// //                             <div className="relative">
// //                               <input
// //                                 type="radio"
// //                                 checked={editingCorrectAnswer === idx}
// //                                 onChange={() => setEditingCorrectAnswer(idx)}
// //                                 className="w-6 h-6 cursor-pointer"
// //                                 id={`option-${idx}`}
// //                               />
// //                               <label
// //                                 htmlFor={`option-${idx}`}
// //                                 className="absolute inset-0 cursor-pointer"
// //                               />
// //                             </div>
// //                             <span className="font-medium text-gray-700">
// //                               {editingCorrectAnswer === idx ? (
// //                                 <span className="text-emerald-600 flex items-center gap-2">
// //                                   <span className="w-2 h-2 bg-emerald-600 rounded-full"></span>
// //                                   الإجابة الصحيحة
// //                                 </span>
// //                               ) : (
// //                                 "إجابة خاطئة"
// //                               )}
// //                             </span>
// //                           </div>

// //                           <div className="flex items-center gap-3">
// //                             <span className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg text-sm font-medium">
// //                               {String.fromCharCode(1632 + idx + 1)}
// //                             </span>
// //                             <span className="text-sm text-gray-500">
// //                               الخيار {idx + 1}
// //                             </span>
// //                           </div>
// //                         </div>

// //                         <div className="space-y-4 pl-10">
// //                           <div>
// //                             <label className="text-sm text-gray-600 mb-2 block font-medium">
// //                               نص الخيار
// //                             </label>
// //                             <div className="border border-gray-200 rounded-lg overflow-hidden">
// //                               <ReactQuill
// //                                 value={opt.text}
// //                                 onChange={(v) => {
// //                                   setEditingOptions((prev) => {
// //                                     const copy = [...prev];
// //                                     copy[idx] = { ...copy[idx], text: v };
// //                                     return copy;
// //                                   });
// //                                 }}
// //                                 modules={quillModules}
// //                                 formats={quillFormats}
// //                                 className="bg-white min-h-[100px]"
// //                               />
// //                             </div>
// //                           </div>

// //                           <div>
// //                             <label className="text-sm text-gray-600 mb-2 block font-medium">
// //                               <span className="text-gray-400">(اختياري)</span> الشرح
// //                             </label>
// //                             <div className="border border-gray-200 rounded-lg overflow-hidden">
// //                               <ReactQuill
// //                                 value={opt.explanation}
// //                                 onChange={(v) => {
// //                                   setEditingOptions((prev) => {
// //                                     const copy = [...prev];
// //                                     copy[idx] = { ...copy[idx], explanation: v };
// //                                     return copy;
// //                                   });
// //                                 }}
// //                                 modules={quillModules}
// //                                 formats={quillFormats}
// //                                 className="bg-white min-h-[100px]"
// //                                 placeholder="أدخل شرحاً للخيار (اختياري)..."
// //                               />
// //                             </div>
// //                           </div>
// //                         </div>
// //                       </div>
// //                     ))}
// //                   </div>
// //                 </div>

// //                 <div className="flex justify-end gap-3 pt-6 border-t">
// //                   <Button
// //                     onClick={cancelEditing}
// //                     icon={<X className="w-4 h-4" />}
// //                     size="large"
// //                   >
// //                     إلغاء
// //                   </Button>
// //                   <Button
// //                     type="primary"
// //                     icon={<Save className="w-4 h-4" />}
// //                     loading={edit_question_loading}
// //                     onClick={() => handleSaveMCQ(q)}
// //                     size="large"
// //                     className="min-w-[140px]"
// //                   >
// //                     حفظ السؤال
// //                   </Button>
// //                 </div>
// //               </div>
// //             </AntCard>
// //           )}

// //           {/* PARAGRAPH EDIT UI */}
// //           {isParagraph && (
// //             <div className="space-y-6">
            

// //               {/* Paragraph content card */}
// //               <AntCard
// //                 title={
// //                   <div className="flex justify-between items-center ">

// //                     <div className="flex items-center gap-2">
// //                       <FileText className="w-5 h-5" />
// //                       <span>نص الفقرة الرئيسي</span>
// //                     </div>

// //                   </div>
// //                 }
// //                 extra={
// //                   <Space>
// //                     <Tooltip title="حفظ نص الفقرة فقط">
// //                       <Button
// //                         type="primary"
// //                         loading={edit_paragraph_loading}
// //                         onClick={() => handleEditParagraphContent(q)}
// //                         icon={<Save className="w-4 h-4" />}
// //                       >
// //                         حفظ الفقرة
// //                       </Button>
// //                     </Tooltip>
// //                     <Tooltip title="حذف الفقرة بالكامل مع أسئلتها">
// //                       <Button
// //                         danger
// //                         loading={delete_paragraph_loading}
// //                         onClick={() => {
// //                           setQuestionToDelete({ type: "paragraph", id: q?.id });
// //                           setDeleteModal(true);
// //                         }}
// //                         icon={<Trash2 className="w-4 h-4" />}
// //                       >
// //                         حذف الفقرة
// //                       </Button>
// //                     </Tooltip>
// //                   </Space>
// //                 }
// //                 className="shadow-lg border-0"
// //               >
// //                 <div className="border border-gray-200 rounded-lg overflow-hidden">
// //                   <ReactQuill
// //                     value={editingParagraphContent}
// //                     onChange={setEditingParagraphContent}
// //                     modules={quillModules}
// //                     formats={quillFormats}
// //                     className="bg-white min-h-[200px]"
// //                     placeholder="أدخل نص الفقرة هنا..."
// //                   />
// //                 </div>
// //                 <div className="mt-4 text-sm text-gray-500">
// //                   <AlertCircle className="w-4 h-4 inline mr-1" />
// //                   سيتم حفظ التغييرات عند النقر على زر "حفظ الفقرة"
// //                 </div>
// //               </AntCard>

// //               {/* Paragraph questions list - NOW WITH COLLAPSE */}
// //               <AntCard
// //                 title={
// //                   <div className="flex items-center justify-between">
// //                     <div className="flex items-center gap-2">
// //                       <List className="w-5 h-5" />
// //                       <span>أسئلة الفقرة</span>
// //                       <Badge
// //                         count={editingParagraphQuestions.length}
// //                         color="blue"
// //                         showZero
// //                       />
// //                     </div>
// //                     <div className="flex items-center gap-3">
// //                       <span className="text-sm text-gray-500">
// //                         {editingParagraphQuestions.length} سؤال
// //                       </span>
// //                       <Button
// //                         type="primary"
// //                         icon={<Plus className="w-4 h-4" />}
// //                         onClick={addNewQuestionToParagraph}
// //                         className="flex items-center gap-2"
// //                       >
// //                         إضافة سؤال جديد
// //                       </Button>
// //                     </div>
// //                   </div>
// //                 }
// //                 className="shadow-lg border-0"
// //               >
// //                 <div className="space-y-4">
// //                   {editingParagraphQuestions.length === 0 ? (
// //                     <div className="text-center py-12">
// //                       <HelpCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
// //                       <p className="text-gray-500 text-lg">لا توجد أسئلة في هذه الفقرة</p>
// //                       <p className="text-gray-400 mt-2">انقر على زر "إضافة سؤال جديد" لبدء الإضافة</p>
// //                     </div>
// //                   ) : (
// //                     <Collapse
// //                       accordion={false}
// //                       bordered={false}
// //                       expandIcon={({ isActive }) =>
// //                         isActive ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />
// //                       }
// //                       expandIconPosition="end"
// //                       className="bg-transparent"
// //                     >
// //                       {editingParagraphQuestions?.map((pq, qIdx) => {
// //                         console.log(pq);
// //                         const isSavedQuestion = pq?.id
// //                         return (
// //                           <Panel
// //                             key={pq?.id}
// //                             header={
// //                               <div className="flex items-center justify-between w-full pr-4">
// //                                 <div className="flex items-center gap-4">
// //                                   <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold 
// //                                   bg-yellow-100 text-yellow-700 border-2 border-yellow-300
                                  
// //                                     `}>
// //                                     {qIdx + 1}
// //                                   </div>
// //                                   <div>
// //                                     <div className="font-bold text-gray-900">
// //                                       سؤال {qIdx + 1}
// //                                       {!isSavedQuestion && (
// //                                         <Tag color="gold" className="mr-2 text-xs">جديد</Tag>
// //                                       )}
// //                                     </div>
// //                                     <div className="text-sm text-gray-500">
// //                                       {pq.questionText ? (
// //                                         <span className="truncate max-w-md inline-block">
// //                                           {pq.questionText.replace(/<[^>]*>/g, '').substring(0, 50)}...
// //                                         </span>
// //                                       ) : (
// //                                         <span className="text-gray-400">(لم يتم إدخال نص السؤال بعد)</span>
// //                                       )}
// //                                     </div>
// //                                   </div>
// //                                 </div>
// //                                 <div className="flex items-center gap-2">
// //                                   <Badge
// //                                     count={pq.options.filter(opt => opt.isCorrect).length}
// //                                     color="green"
// //                                     showZero
// //                                   />
// //                                   <span className="text-sm text-gray-500">
// //                                     {pq.options.length} خيارات
// //                                   </span>
// //                                 </div>
// //                               </div>
// //                             }
// //                             extra={
// //                               <Space size="small" onClick={(e) => e.stopPropagation()}>
// //                                 <Tooltip title="نسخ هذا السؤال">
// //                                   <Button
// //                                     type="text"
// //                                     icon={<Copy className="w-4 h-4" />}
// //                                     onClick={() => duplicateQuestion(pq)}
// //                                     size="small"
// //                                   />
// //                                 </Tooltip>
// //                                 <Button
// //                                   danger
// //                                   type="text"
// //                                   icon={<Trash2 className="w-4 h-4" />}
// //                                   onClick={() => setDeleteParagraphModal(pq)}
// //                                   size="small"
// //                                 />
// //                               </Space>
// //                             }
// //                             className={`mb-4 rounded-xl border
// //                               border-yellow-300 bg-yellow-50
// //                               `}
// //                           >
// //                             <div className="p-4 space-y-6">
// //                               {/* Question text */}
// //                               <div>
// //                                 <label className="text-sm font-semibold text-gray-800 mb-2 block">
// //                                   نص السؤال
// //                                 </label>
// //                                 <div className="border border-gray-200 rounded-lg overflow-hidden">
// //                                   <ReactQuill
// //                                     value={pq.questionText}
// //                                     onChange={(v) => {
// //                                       setEditingParagraphQuestions((prev) => {
// //                                         const copy = [...prev];
// //                                         copy[qIdx] = { ...copy[qIdx], questionText: v };
// //                                         return copy;
// //                                       });
// //                                     }}
// //                                     modules={quillModules}
// //                                     formats={quillFormats}
// //                                     className="bg-white min-h-[120px]"
// //                                     placeholder="أدخل نص السؤال هنا..."
// //                                   />
// //                                 </div>
// //                               </div>

// //                               {/* Options */}
// //                               <div>
// //                                 <div className="flex items-center justify-between mb-4">
// //                                   <label className="text-sm font-semibold text-gray-800">
// //                                     الخيارات
// //                                   </label>
// //                                   <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
// //                                     اختر إجابة صحيحة واحدة لكل سؤال
// //                                   </span>
// //                                 </div>

// //                                 <div className="space-y-4">
// //                                   {(pq.options || []).map((opt, oIdx) => (
// //                                     <div
// //                                       key={opt?.id ?? oIdx}
// //                                       className={`p-5 rounded-xl border-2 transition-all ${opt.isCorrect
// //                                         ? "border-emerald-400 bg-gradient-to-r from-emerald-50 to-green-50"
// //                                         : "border-gray-200 bg-white hover:border-gray-300"
// //                                         }`}
// //                                     >
// //                                       <div className="flex items-center justify-between mb-4">
// //                                         <div className="flex items-center gap-4">
// //                                           <div className="relative">
// //                                             <input
// //                                               type="radio"
// //                                               checked={!!opt.isCorrect}
// //                                               onChange={() => {
// //                                                 setEditingParagraphQuestions((prev) => {
// //                                                   const copy = [...prev];
// //                                                   const qCopy = { ...copy[qIdx] };
// //                                                   qCopy.options = qCopy.options.map(
// //                                                     (o, ii) => ({
// //                                                       ...o,
// //                                                       isCorrect: ii === oIdx,
// //                                                     })
// //                                                   );
// //                                                   copy[qIdx] = qCopy;
// //                                                   return copy;
// //                                                 });
// //                                               }}
// //                                               className="w-5 h-5 cursor-pointer"
// //                                               id={`pq-${pq.id}-opt-${oIdx}`}
// //                                             />
// //                                             <label
// //                                               htmlFor={`pq-${pq.id}-opt-${oIdx}`}
// //                                               className="absolute inset-0 cursor-pointer"
// //                                             />
// //                                           </div>
// //                                           <span className={`font-medium ${opt.isCorrect ? 'text-emerald-600' : 'text-gray-700'}`}>
// //                                             {opt.isCorrect ? "✓ إجابة صحيحة" : "إجابة خاطئة"}
// //                                           </span>
// //                                         </div>

// //                                         <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg text-sm font-medium">
// //                                           {String.fromCharCode(1632 + oIdx + 1)}
// //                                         </span>
// //                                       </div>

// //                                       <div className="space-y-4 pl-9">
// //                                         <div>
// //                                           <label className="text-sm text-gray-600 mb-2 block">
// //                                             نص الخيار
// //                                           </label>
// //                                           <div className="border border-gray-200 rounded-lg overflow-hidden">
// //                                             <ReactQuill
// //                                               value={opt.text}
// //                                               onChange={(v) => {
// //                                                 setEditingParagraphQuestions((prev) => {
// //                                                   const copy = [...prev];
// //                                                   const qCopy = { ...copy[qIdx] };
// //                                                   const opts = [...(qCopy.options || [])];
// //                                                   opts[oIdx] = { ...opts[oIdx], text: v };
// //                                                   qCopy.options = opts;
// //                                                   copy[qIdx] = qCopy;
// //                                                   return copy;
// //                                                 });
// //                                               }}
// //                                               modules={quillModules}
// //                                               formats={quillFormats}
// //                                               className="bg-white min-h-[80px]"
// //                                             />
// //                                           </div>
// //                                         </div>

// //                                         <div>
// //                                           <label className="text-sm text-gray-600 mb-2 block">
// //                                             <span className="text-gray-400">(اختياري)</span> الشرح
// //                                           </label>
// //                                           <div className="border border-gray-200 rounded-lg overflow-hidden">
// //                                             <ReactQuill
// //                                               value={opt.explanation}
// //                                               onChange={(v) => {
// //                                                 setEditingParagraphQuestions((prev) => {
// //                                                   const copy = [...prev];
// //                                                   const qCopy = { ...copy[qIdx] };
// //                                                   const opts = [...(qCopy.options || [])];
// //                                                   opts[oIdx] = {
// //                                                     ...opts[oIdx],
// //                                                     explanation: v,
// //                                                   };
// //                                                   qCopy.options = opts;
// //                                                   copy[qIdx] = qCopy;
// //                                                   return copy;
// //                                                 });
// //                                               }}
// //                                               modules={quillModules}
// //                                               formats={quillFormats}
// //                                               className="bg-white min-h-[80px]"
// //                                             />
// //                                           </div>
// //                                         </div>
// //                                       </div>
// //                                     </div>
// //                                   ))}
// //                                 </div>
// //                               </div>

// //                               {/* Save button */}
// //                               <div className="flex justify-end pt-4 border-t border-gray-200">
                               
// //                                 {isSavedQuestion ? (
// //                                   <Button
// //                                     type="primary"
// //                                     icon={<Save className="w-4 h-4" />}
// //                                     loading={edit_question_loading}
// //                                     onClick={() => handleSaveParagraph(pq)}
// //                                     size="middle"
// //                                     className="min-w-[140px]"
// //                                   >
// //                                     حفظ التعديلات
// //                                   </Button>
// //                                 ) : (
// //                                    <Button
// //                                   type="primary"
// //                                   icon={<Save className="w-4 h-4" />}
// //                                   loading={create_question_loading}
// //                                   onClick={() => handleSaveNewParagraphQuestion(pq, q.id)}
// //                                   size="middle"
// //                                   className="min-w-[140px] bg-green-600 hover:bg-green-700"
// //                                 >
// //                                   حفظ السؤال الجديد
// //                                 </Button>
// //                                 )}
// //                               </div>
// //                             </div>
// //                           </Panel>
// //                         );
// //                       })}
// //                     </Collapse>
// //                   )}

// //                   {/* Add question button at bottom */}
// //                   <div className="pt-6 border-t border-gray-200">
// //                     <Button
// //                       type="dashed"
// //                       icon={<Plus className="w-4 h-4" />}
// //                       onClick={addNewQuestionToParagraph}
// //                       className="w-full h-16 text-lg"
// //                       size="large"
// //                     >
// //                       إضافة سؤال جديد إلى الفقرة
// //                     </Button>
// //                   </div>
// //                 </div>

// //                 <Divider className="!my-6" />

// //                 <div className="flex justify-between items-center">
// //                   <div className="text-sm text-gray-500">
// //                     <AlertCircle className="w-4 h-4 inline mr-1" />
// //                     الأسئلة المميزة باللون الأصفر جديدة ولم تحفظ بعد
// //                   </div>
// //                   <Space>
// //                     <Button onClick={cancelEditing} icon={<X className="w-4 h-4" />}>
// //                       إغلاق التعديل
// //                     </Button>
// //                   </Space>
// //                 </div>
// //               </AntCard>
// //             </div>
// //           )}
// //         </div>
// //       );
// //     }

// //     // ====== NORMAL DISPLAY MODE ======
// //     return (
// //       <div className="space-y-8 px-2">
// //         {q.type === "paragraph_mcq" && (
// //           <div className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-3xl shadow-sm">
// //             <div className="flex items-center justify-between mb-4">
// //               <div className="flex items-center gap-3">
// //                 <FileText className="w-6 h-6 text-blue-600" />
// //                 <h4 className="font-bold text-blue-900 text-xl">الفقرة الرئيسية</h4>
// //               </div>
// //               <div className="flex items-center gap-3">
// //                 <button className="bg-blue-500 p-3 rounded-md text-white">تعديل نص الفقرة</button>
// //                 <button className="bg-red-500 p-3 rounded-md text-white">حذف   الفقرة</button>
   
// //                 <Badge
// //                   count={q.questions?.length || 0}
// //                   color="blue"
// //                   showZero
// //                   className="shadow-md"
// //                 />
// //               </div>
// //             </div>
// //             <div
// //               dangerouslySetInnerHTML={{ __html: q.paragraphContent }}
// //               className="text-gray-800 leading-relaxed text-lg bg-white p-6 rounded-2xl border border-gray-100"
// //             />
// //             <div className="mt-4 flex items-center gap-2 text-blue-700">
// //               <MessageSquare className="w-4 h-4" />
// //               <span className="text-sm">تحتوي على {q.questions?.length || 0} سؤال - يمكنك فتح/غلق كل سؤال</span>
// //             </div>
// //           </div>
// //         )}

// //         <div className="space-y-4">
// //           {(q.type === "mcq"
// //             ? [
// //               {
// //                 id: q.id,
// //                 questionText: q.question,
// //                 options: q.options,
// //                 correctAnswer: q.correctAnswer,
// //                 type: 'mcq'
// //               },
// //             ]
// //             : q.questions
// //           ).map((item, qIdx) => {
// //             const isParagraphQuestion = q.type === "paragraph_mcq";
// //             const isExpanded = isParagraphQuestionExpanded(item.id);

// //             return (
// //               <div key={item.id || qIdx} className="space-y-2">
// //                 {isParagraphQuestion && (
// //                   <div
// //                     onClick={() => toggleParagraphQuestion(item.id)}
// //                     className="cursor-pointer"
// //                   >
// //                     <div className={`p-6 rounded-2xl border-2 transition-all duration-300 ${isExpanded
// //                       ? "border-indigo-300 bg-gradient-to-r from-indigo-50 to-blue-50"
// //                       : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
// //                       }`}>
// //                       <div className="flex items-center justify-between">
// //                         <div className="flex items-center gap-4">
// //                           <div className="relative">
// //                             <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold">
// //                               {qIdx + 1}
// //                             </div>
// //                             {item.options?.some(opt => opt.isCorrect) && (
// //                               <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
// //                                 <span className="text-white text-xs">✓</span>
// //                               </div>
// //                             )}
// //                           </div>
// //                           <div>
// //                             <h4 className="font-bold text-gray-900 text-lg flex items-center gap-2">
// //                               سؤال {qIdx + 1}
// //                               <Tag color="blue" className="text-xs">جزء من الفقرة</Tag>
// //                             </h4>
// //                             <div className="text-sm text-gray-500 mt-1">
// //                               {item.options?.length || 0} خيارات
// //                               <span className="mx-2">•</span>
// //                               {item.options?.filter(opt => opt.isCorrect).length || 0} إجابة صحيحة
// //                             </div>
// //                           </div>
// //                         </div>
// //                         <div className="flex items-center gap-4">
// //                           <div className="text-right hidden md:block">
// //                             <div className="text-sm text-gray-500">الحالة</div>
// //                             <div className="font-bold text-gray-900">
// //                               {isExpanded ? "مفتوح" : "مغلق"}
// //                             </div>
// //                           </div>
// //                           {isExpanded ? (
// //                             <ChevronUp className="w-6 h-6 text-indigo-600" />
// //                           ) : (
// //                             <ChevronDown className="w-6 h-6 text-gray-500" />
// //                           )}
// //                         </div>
// //                       </div>
// //                     </div>
// //                   </div>
// //                 )}

// //                 {/* Question content - only show if expanded or if MCQ */}
// //                 {(!isParagraphQuestion || isExpanded) && (
// //                   <div className={`bg-white rounded-2xl border border-gray-200 p-6 shadow-sm transition-all duration-300 ${isParagraphQuestion ? "ml-8" : ""
// //                     }`}>
// //                     {isParagraphQuestion && (
// //                       <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
// //                         <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold">
// //                           {qIdx + 1}
// //                         </div>
// //                         <div>
// //                           <h4 className="font-bold text-gray-900">سؤال الفقرة {qIdx + 1}</h4>
// //                           <p className="text-sm text-gray-500">جزء من الفقرة الرئيسية</p>
// //                         </div>
// //                       </div>
// //                     )}

// //                     <div
// //                       dangerouslySetInnerHTML={{ __html: item.questionText }}
// //                       className="text-gray-800 leading-relaxed text-lg mb-6 font-medium bg-gray-50 p-5 rounded-xl"
// //                     />

// //                     <div className="grid gap-3">
// //                       {item.options?.map((opt, oIdx) => {
// //                         const isCorrect = isParagraphQuestion
// //                           ? !!opt.isCorrect
// //                           : oIdx === item.correctAnswer;

// //                         return (
// //                           <div
// //                             key={opt?.id ?? oIdx}
// //                             className={`p-4 rounded-xl border transition-all ${isCorrect
// //                               ? "bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-300"
// //                               : "bg-white border-gray-200 hover:border-gray-300"
// //                               }`}
// //                           >
// //                             <div className="flex items-start gap-3">
// //                               <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${isCorrect
// //                                 ? "bg-emerald-100 text-emerald-700 border-2 border-emerald-300"
// //                                 : "bg-gray-100 text-gray-700 border-2 border-gray-300"
// //                                 }`}>
// //                                 {String.fromCharCode(1632 + oIdx + 1)}
// //                               </div>
// //                               <div className="flex-1">
// //                                 <div
// //                                   dangerouslySetInnerHTML={{ __html: opt.text }}
// //                                   className="font-medium text-gray-800 leading-relaxed"
// //                                 />
// //                                 {opt.explanation && (
// //                                   <div className="mt-3 pt-3 border-t border-gray-200">
// //                                     <div className="flex items-center gap-2 mb-2">
// //                                       <span className="text-sm font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded">
// //                                         الشرح
// //                                       </span>
// //                                     </div>
// //                                     <div
// //                                       dangerouslySetInnerHTML={{ __html: opt.explanation }}
// //                                       className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-lg"
// //                                     />
// //                                   </div>
// //                                 )}
// //                               </div>
// //                               {isCorrect && (
// //                                 <div className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold">
// //                                   ✓ صحيح
// //                                 </div>
// //                               )}
// //                             </div>
// //                           </div>
// //                         );
// //                       })}
// //                     </div>

// //                     {isParagraphQuestion && (
// //                       <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-gray-200">
// //                         <Tooltip title="تعديل هذا السؤال فقط">
// //                           <Button
// //                             icon={<Edit3 className="w-4 h-4" />}
// //                             type="primary"
// //                             ghost
// //                             size="small"
// //                             onClick={() => {
// //                               // Start editing just this paragraph question
// //                               const paragraphQuestion = {
// //                                 ...item,
// //                                 type: 'paragraph_question',
// //                                 paragraphId: q.id
// //                               };
// //                               startEditing({
// //                                 ...q,
// //                                 questions: [paragraphQuestion]
// //                               });
// //                             }}
// //                           >
// //                             تعديل السؤال
// //                           </Button>
// //                         </Tooltip>
// //                       </div>
// //                     )}
// //                   </div>
// //                 )}
// //               </div>
// //             );
// //           })}
// //         </div>

// //         {/* Actions - Only for main question, not individual paragraph questions */}
// //         <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 border-t border-gray-200">
// //           <div className="text-sm text-gray-500">
// //             <span className="font-medium">نوع السؤال:</span>{" "}
// //             <Tag color={q.type === "mcq" ? "blue" : "purple"} className="mx-2">
// //               {q.type === "mcq" ? "MCQ" : "فقرة"}
// //             </Tag>
// //             <span>•</span>
// //             <span className="mx-2">
// //               {q.type === "mcq"
// //                 ? `عدد الخيارات: ${q.options.length}`
// //                 : `عدد الأسئلة: ${q.questions?.length || 0}`
// //               }
// //             </span>
// //           </div>

// //           <Space size="middle">
// //             <Button
// //               size="large"
// //               icon={<Edit3 className="w-5 h-5" />}
// //               type="primary"
// //               ghost
// //               onClick={() => startEditing(q)}
// //               className="min-w-[120px]"
// //             >
// //               تعديل
// //             </Button>

// //             {q.type === "mcq" && (
// //               <Button
// //                 size="large"
// //                 icon={<Trash2 className="w-5 h-5" />}
// //                 danger
// //                 onClick={() => {
// //                   setQuestionToDelete(q);
// //                   setDeleteModal(true);
// //                 }}
// //                 loading={delete_question_loading}
// //                 className="min-w-[120px]"
// //               >
// //                 حذف
// //               </Button>
// //             )}
// //           </Space>
// //         </div>
// //       </div>
// //     );
// //   };

// //   if (get_exam_question_loading) {
// //     return (
// //       <div className="flex flex-col items-center justify-center py-32">
// //         <Spin size="large" />
// //         <p className="mt-4 text-gray-600 text-lg">جاري تحميل الأسئلة...</p>
// //         <p className="text-sm text-gray-400 mt-2">يرجى الانتظار</p>
// //       </div>
// //     );
// //   }

// //   return (
// //     <Card title="أسئلة الامتحان" icon={FileText} className="p-0 overflow-hidden">
// //       <div className="p-6">
// //         {apiQuestions.length === 0 ? (
// //           <Empty
// //             description={
// //               <div className="space-y-4">
// //                 <div className="text-2xl font-bold text-gray-700">لا توجد أسئلة</div>
// //                 <p className="text-gray-500">لم يتم إضافة أي أسئلة إلى هذا القسم بعد</p>
// //               </div>
// //             }
// //             image={Empty.PRESENTED_IMAGE_SIMPLE}
// //             className="py-16"
// //           />
// //         ) : (
// //           <div className="space-y-8">
// //             {/* SECTION HEADER WITH CONTROLS */}
// //             <div className="p-8 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-3xl border-2 border-indigo-200 shadow-lg">
// //               <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
// //                 <div className="flex-1">
// //                   <div className="flex items-center gap-3 mb-4">
// //                     <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center text-xl font-bold">
// //                       {apiQuestions.length}
// //                     </div>
// //                     <div>
// //                       <h2
// //                         dangerouslySetInnerHTML={{ __html: selectedSection?.title || "قسم الامتحان" }}
// //                         className="text-3xl font-bold text-indigo-900">
// //                       </h2>
// //                       <div className="flex items-center gap-4 mt-2">
// //                         <span className="text-lg text-indigo-700">
// //                           <span className="font-bold">{apiQuestions.length}</span> سؤال
// //                         </span>
// //                         <span className="text-gray-400">•</span>
// //                         <span className="text-sm text-gray-600">
// //                           {apiQuestions.filter(q => q.type === "mcq").length} MCQ
// //                         </span>
// //                         <span className="text-gray-400">•</span>
// //                         <span className="text-sm text-gray-600">
// //                           {apiQuestions.filter(q => q.type === "paragraph_mcq").length} فقرة
// //                         </span>
// //                       </div>
// //                     </div>
// //                   </div>


// //                 </div>
// //               </div>
// //             </div>

// //             {/* QUESTIONS LIST */}
// //             <div className="space-y-6">
// //               <div className="flex items-center justify-between mb-4">
// //                 <h3 className="text-xl font-bold text-gray-900">قائمة الأسئلة</h3>
// //                 <div className="text-sm text-gray-500">
// //                   {Object.values(expandedQuestions).filter(Boolean).length} من {apiQuestions.length} مفتوح
// //                 </div>
// //               </div>

// //               {apiQuestions.map((q, index) => {
// //                 const isExp = isExpanded(q.id, q.type);
// //                 const typeLabel = q.type === "mcq" ? "سؤال اختيار متعدد" : "فقرة مع أسئلة";

// //                 return (
// //                   <div
// //                     key={`${q.type}-${q.id}`}
// //                     className={`bg-white overflow-hidden rounded-3xl shadow-xl border-2 transition-all duration-300 ${isExp ? "border-indigo-300 shadow-2xl" : "border-gray-100 hover:border-gray-300"
// //                       } ${editingQuestionId === q.id ? "ring-4 ring-blue-100" : ""}`}
// //                   >
// //                     {/* QUESTION HEADER */}
// //                     <div
// //                       onClick={() => toggleQuestion(q.id, q.type)}
// //                       className={`flex items-center justify-between p-6 cursor-pointer transition-colors ${isExp ? "bg-gradient-to-r from-blue-50 to-indigo-50" : "hover:bg-gray-50"
// //                         }`}
// //                     >
// //                       <div className="flex items-center gap-5">
// //                         <div className="relative">
// //                           <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold shadow-lg ${q.type === "mcq"
// //                             ? "bg-gradient-to-br from-blue-500 to-cyan-500 text-white"
// //                             : "bg-gradient-to-br from-purple-500 to-pink-500 text-white"
// //                             }`}>
// //                             {index + 1}
// //                           </div>
// //                           {q.type === "paragraph_mcq" && (
// //                             <Badge
// //                               count={q.questions?.length || 0}
// //                               color="purple"
// //                               className="absolute -top-2 -right-2 shadow-lg"
// //                             />
// //                           )}
// //                         </div>

// //                         <div className="flex-1">
// //                           <div className="flex items-center gap-3 mb-2">
// //                             <h4 className="font-bold text-xl text-gray-900">
// //                               {typeLabel}
// //                             </h4>
// //                             <Tag
// //                               color={q.type === "mcq" ? "blue" : "purple"}
// //                               className="text-sm px-3 py-1 rounded-full font-bold"
// //                             >
// //                               {q.type === "mcq" ? "MCQ" : "فقرة"}
// //                             </Tag>
// //                           </div>
// //                           <div
// //                             className="text-sm text-gray-600 line-clamp-2 leading-relaxed"
// //                             dangerouslySetInnerHTML={{
// //                               __html:
// //                                 q.type === "mcq"
// //                                   ? q.question
// //                                   : q.paragraphContent?.substring(0, 150) + (q.paragraphContent?.length > 150 ? "..." : "") ||
// //                                   "فقرة نصية مع أسئلة",
// //                             }}
// //                           />
// //                         </div>
// //                       </div>

// //                       <div className="flex items-center gap-6">
// //                         <div className="text-right  gap-1 !items-center  hidden md:!flex">
// //                           <div className="text-sm text-gray-500">
// //                             {q.type === "mcq" ? "عدد الخيارات" : "عدد الأسئلة"}
// //                           </div>
// //                           <div className="font-bold text-gray-900">
// //                             {q.type === "mcq" ? q.options.length : q.questions?.length || 0}
// //                           </div>
// //                         </div>

// //                         <div className="flex !flex-row items-center gap-2">
// //                           {isExp ? (
// //                             <ChevronUp className="w-6 h-6 text-indigo-600" />
// //                           ) : (
// //                             <ChevronDown className="w-6 h-6 text-gray-500" />
// //                           )}
// //                           <span className="text-xs text-gray-500">
// //                             {isExp ? "إغلاق" : "فتح"}
// //                           </span>
// //                         </div>
// //                       </div>
// //                     </div>

// //                     {/* QUESTION CONTENT */}
// //                     {isExp && (
// //                       <div className="border-t-2 border-gray-100">
// //                         <div className="p-1">
// //                           <div className="bg-gradient-to-r from-gray-50 to-white rounded-2xl m-4">
// //                             {renderQuestionContent(q)}
// //                           </div>
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

// //       {/* DELETE MODALS */}
// //       <Modal
// //         open={deleteModal}
// //         onCancel={() => setDeleteModal(false)}
// //         onOk={handleDeleteAny}
// //         okText="نعم، احذف"
// //         cancelText="إلغاء"
// //         okButtonProps={{
// //           danger: true,
// //           loading:
// //             questionToDelete?.type === "mcq"
// //               ? delete_question_loading
// //               : delete_paragraph_loading,
// //           className: "min-w-[120px]",
// //         }}
// //         cancelButtonProps={{
// //           className: "min-w-[120px]",
// //         }}
// //         width={520}
// //         className="text-center"
// //       >
// //         <div className="py-8 px-4">
// //           <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
// //             <Trash2 className="w-10 h-10 text-red-600" />
// //           </div>
// //           <h3 className="text-2xl font-bold text-gray-900 mb-3">
// //             تأكيد الحذف
// //           </h3>
// //           <p className="text-gray-600 text-base leading-relaxed mb-6">
// //             هل أنت متأكد من حذف{" "}
// //             <span className="font-bold text-red-600">
// //               {questionToDelete?.type === "mcq" ? "هذا السؤال" : "هذه الفقرة"}
// //             </span>
// //             ؟
// //             <br />
// //             <span className="text-sm text-gray-500 mt-2 block">
// //               هذا الإجراء لا يمكن التراجع عنه وسيتم حذف جميع البيانات المرتبطة
// //             </span>
// //           </p>
// //         </div>
// //       </Modal>

// //       <Modal
// //         open={!!deleteParagraphModal}
// //         onCancel={() => setDeleteParagraphModal(false)}
// //         onOk={handleDeleteParagraphQuestions}
// //         okText="نعم، احذف السؤال"
// //         cancelText="إلغاء"
// //         okButtonProps={{
// //           danger: true,
// //           loading: delete_question_loading,
// //           className: "min-w-[140px]",
// //         }}
// //         cancelButtonProps={{
// //           className: "min-w-[120px]",
// //         }}
// //         width={520}
// //         className="text-center"
// //       >
// //         <div className="py-8 px-4">
// //           <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-orange-100 flex items-center justify-center">
// //             <AlertCircle className="w-10 h-10 text-orange-600" />
// //           </div>
// //           <h3 className="text-2xl font-bold text-gray-900 mb-3">
// //             حذف سؤال من الفقرة
// //           </h3>
// //           <p className="text-gray-600 text-base leading-relaxed mb-6">
// //             سيتم حذف هذا السؤال فقط من الفقرة
// //             <br />
// //             <span className="text-sm text-gray-500 mt-2 block">
// //               باقي الأسئلة في الفقرة ستبقى كما هي
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
//   Eye,
//   EyeOff,
//   AlertCircle,
//   Plus,
//   Minus,
//   Copy,
//   MessageSquare,
//   HelpCircle,
//   Pencil,
//   BookOpen,
//   CheckCircle,
//   Hash,
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
//   Input,
//   Popconfirm,
//   Tabs,
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
//   handleAddQuestion,
// } from "../../lib/features/examSlice";
// import { toast } from "react-toastify";

// const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
// import "react-quill-new/dist/quill.snow.css";

// const { Panel } = Collapse;

// export default function DisplayQuestions({
//   selectedSectionId,
//   setEditingQuestion,
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
//   const [expandedParagraphQuestions, setExpandedParagraphQuestions] = useState({});
//   const [editingQuestionId, setEditingQuestionId] = useState(null);
//   const [editingType, setEditingType] = useState(null);
//   const [showAllQuestions, setShowAllQuestions] = useState(false);
//   const [activeTab, setActiveTab] = useState("all");

//   // MCQ editing
//   const [editingContent, setEditingContent] = useState("");
//   const [editingOptions, setEditingOptions] = useState([]);
//   const [editingCorrectAnswer, setEditingCorrectAnswer] = useState(0);

//   // Paragraph editing
//   const [editingParagraphContent, setEditingParagraphContent] = useState("");
//   const [editingParagraphQuestions, setEditingParagraphQuestions] = useState([]);

//   // Delete modals
//   const [deleteParagraphModal, setDeleteParagraphModal] = useState(false);
//   const [deleteModal, setDeleteModal] = useState(false);
//   const [questionToDelete, setQuestionToDelete] = useState(null);

//   // Add new (global) modal
//   const [addingNewQuestion, setAddingNewQuestion] = useState(false);
//   const [newQuestionType, setNewQuestionType] = useState("mcq"); // "mcq" | "paragraph"
//   const [newParagraphContent, setNewParagraphContent] = useState("");

//   // New MCQ modal state
//   const [newMCQQuestion, setNewMCQQuestion] = useState("");
//   const [newMCQOptions, setNewMCQOptions] = useState([
//     { id: makeTempId("opt"), text: "", explanation: "", isCorrect: true },
//     { id: makeTempId("opt"), text: "", explanation: "", isCorrect: false },
//     { id: makeTempId("opt"), text: "", explanation: "", isCorrect: false },
//     { id: makeTempId("opt"), text: "", explanation: "", isCorrect: false },
//   ]);

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

//     const paragraphQuestionsInitial = {};
//     (get_exam_questions_list?.data?.message?.paragraphs || []).forEach((p) => {
//       (p.questions || []).forEach((q) => {
//         paragraphQuestionsInitial[`pq-${q.id}`] = false;
//       });
//     });
//     setExpandedParagraphQuestions(paragraphQuestionsInitial);
//   }, [get_exam_questions_list]);

//   const quillModules = {
//     toolbar: [
//       [{ header: [1, 2, 3, false] }],
//       ["bold", "italic", "underline"],
//       [{ list: "ordered" }, { list: "bullet" }],
//       [{ align: [] }],
//       ["clean"],
//       ["link", "image", "formula"],
//     ],
//   };

//   const quillFormats = [
//     "header",
//     "bold",
//     "italic",
//     "underline",
//     "list",
//     "bullet",
//     "align",
//     "link",
//     "image",
//     "formula",
//   ];

//   // =========================
//   // Normalize API data
//   // =========================
//   const apiQuestions = useMemo(() => {
//     if (!get_exam_questions_list && !selectedSection) return [];

//     const data = get_exam_questions_list?.data?.message || {
//       mcq: [],
//       paragraphs: [],
//     };

//     const mcqSource =
//       data?.mcq && data?.mcq?.length
//         ? data?.mcq
//         : selectedSection?.mcq && selectedSection?.mcq?.length
//         ? selectedSection?.mcq
//         : [];

//     const mcqs = mcqSource.map((q) => {
//       const options = q?.options || [];
//       const correctIndex = options.findIndex(
//         (opt) => Number(opt?.is_correct) === 1
//       );

//       return {
//         id: q.id,
//         type: "mcq",
//         question: q?.question_text || "",
//         correctAnswer: correctIndex >= 0 ? correctIndex : 0,
//         options: options.map((opt) => ({
//           id: opt?.id,
//           text: opt.option_text || "",
//           explanation: opt.question_explanation || "",
//           isCorrect: Number(opt?.is_correct) === 1,
//         })),
//         rawData: q,
//       };
//     });

//     const paragraphSource =
//       data?.paragraphs && data?.paragraphs?.length
//         ? data?.paragraphs
//         : selectedSection?.paragraphs || [];

//     const paragraphs = paragraphSource.map((p) => ({
//       id: p?.paragraph?.id,
//       type: "paragraph_mcq",
//       paragraphContent: p?.paragraph?.paragraph_content || "",
//       questions: (p?.questions || []).map((q) => ({
//         id: q?.id,
//         questionText: q?.question_text || "",
//         options: (q?.options || []).map((opt) => ({
//           id: opt?.id,
//           text: opt?.option_text || "",
//           explanation: opt?.question_explanation || "",
//           isCorrect: Number(opt?.is_correct) === 1,
//         })),
//       })),
//       rawData: p,
//     }));

//     return [...mcqs, ...paragraphs];
//   }, [get_exam_questions_list, selectedSection]);

//   // =========================
//   // Expand/collapse helpers
//   // =========================
//   const toggleQuestion = (id, type) => {
//     const key = `${type === "mcq" ? "mcq" : "paragraph"}-${id}`;
//     setExpandedQuestions((prev) => ({ ...prev, [key]: !prev[key] }));
//   };

//   const toggleParagraphQuestion = (questionId) => {
//     setExpandedParagraphQuestions((prev) => ({
//       ...prev,
//       [`pq-${questionId}`]: !prev[`pq-${questionId}`],
//     }));
//   };

//   const isParagraphQuestionExpanded = (questionId) =>
//     expandedParagraphQuestions[`pq-${questionId}`] || false;

//   const isExpanded = (id, type) =>
//     expandedQuestions[`${type === "mcq" ? "mcq" : "paragraph"}-${id}`] || false;

//   const expandAll = () => {
//     const topExpanded = {};
//     const pqExpanded = {};

//     apiQuestions.forEach((q) => {
//       topExpanded[`${q.type === "mcq" ? "mcq" : "paragraph"}-${q.id}`] = true;
//       if (q.type === "paragraph_mcq") {
//         (q.questions || []).forEach((pq) => {
//           pqExpanded[`pq-${pq.id}`] = true;
//         });
//       }
//     });

//     setExpandedQuestions(topExpanded);
//     setExpandedParagraphQuestions(pqExpanded);
//     setShowAllQuestions(true);
//   };

//   const collapseAll = () => {
//     const topCollapsed = {};
//     const pqCollapsed = {};

//     apiQuestions.forEach((q) => {
//       topCollapsed[`${q.type === "mcq" ? "mcq" : "paragraph"}-${q.id}`] = false;
//       if (q.type === "paragraph_mcq") {
//         (q.questions || []).forEach((pq) => {
//           pqCollapsed[`pq-${pq.id}`] = false;
//         });
//       }
//     });

//     setExpandedQuestions(topCollapsed);
//     setExpandedParagraphQuestions(pqCollapsed);
//     setShowAllQuestions(false);
//   };

//   // =========================
//   // Editing
//   // =========================
//   const startEditing = (q) => {
//     setEditingQuestionId(q.id);
//     setEditingType(q.type);

//     if (q.type === "mcq") {
//       setEditingContent(q.question);
//       setEditingOptions(q.options.map((opt) => ({ ...opt })));

//       const correctIndex = q.options.findIndex((o) => !!o.isCorrect);
//       const safeIndex = correctIndex >= 0 ? correctIndex : q.correctAnswer ?? 0;
//       setEditingCorrectAnswer(safeIndex);

//       // Ensure flags are synced (just in case)
//       setEditingOptions((prev) =>
//         (prev || []).map((o, idx) => ({ ...o, isCorrect: idx === safeIndex }))
//       );
//     } else if (q.type === "paragraph_mcq") {
//       setEditingParagraphContent(q.paragraphContent);
//       setEditingParagraphQuestions(
//         (q.questions || []).map((pq) => ({
//           id: pq.id,
//           questionText: pq.questionText,
//           options: (pq.options || []).map((opt) => ({ ...opt })),
//         }))
//       );
//     }

//     setEditingQuestion(q);
//   };

//   const cancelEditing = () => {
//     setEditingQuestionId(null);
//     setEditingType(null);

//     setEditingContent("");
//     setEditingOptions([]);
//     setEditingCorrectAnswer(0);

//     setEditingParagraphContent("");
//     setEditingParagraphQuestions([]);

//     setEditingQuestion(null);
//   };

//   const refreshQuestions = () => {
//     dispatch(
//       handleGetExamQuestions({
//         body: { exam_section_id: selectedSectionId },
//       })
//     );
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

//     const payload = {
//       id: q.id,
//       question_text: editingContent,
//       instructions: "Read carefully before answering",
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
//     } finally {
//       cancelEditing();
//     }
//   };

//   // =========================
//   // Save paragraph question (update)
//   // =========================
//   const handleSaveParagraph = async (pq) => {
//     if (isHtmlEmpty(pq?.questionText)) {
//       toast.error("يرجى إدخال نص السؤال");
//       return;
//     }

//     const hasCorrect = (pq?.options || []).some((o) => !!o.isCorrect);
//     if (!hasCorrect) {
//       toast.error("يرجى تحديد إجابة صحيحة واحدة على الأقل");
//       return;
//     }

//     const payload = {
//       id: pq?.id,
//       question_text: pq?.questionText,
//       instructions: "Read carefully before answering",
//       mcq_array: (pq?.options || []).map((opt) => ({
//         answer: opt?.text,
//         correct_or_not: opt?.isCorrect ? "1" : "0",
//         question_explanation: opt?.explanation,
//       })),
//     };

//     try {
//       const res = await dispatch(handleUpdateExamQuestions({ body: payload })).unwrap();

//       if (res?.data?.status === "success") {
//         toast.success("تم تعديل أسئلة الفقرة بنجاح");
//         refreshQuestions();
//       } else {
//         toast.error(
//           res?.error?.response?.data?.message ||
//             res?.error?.message ||
//             res?.data?.message ||
//             "فشل تعديل أسئلة الفقرة"
//         );
//       }
//     } catch (e) {
//       toast.error("حصل خطأ أثناء تعديل الفقرة");
//     }
//   };

//   // =========================
//   // Add new question inside existing paragraph (create)
//   // =========================
//   const addNewQuestionToParagraph = () => {
//     const base = Date.now();

//     const newQuestion = {
//       id: makeTempId("temp"),
//       questionText: "",
//       options: [
//         { id: `opt-${base}-1`, text: "", explanation: "", isCorrect: true },
//         { id: `opt-${base}-2`, text: "", explanation: "", isCorrect: false },
//         { id: `opt-${base}-3`, text: "", explanation: "", isCorrect: false },
//         { id: `opt-${base}-4`, text: "", explanation: "", isCorrect: false },
//       ],
//     };

//     setEditingParagraphQuestions((prev) => [...prev, newQuestion]);
//     setExpandedParagraphQuestions((prev) => ({ ...prev, [`pq-${newQuestion.id}`]: true }));

//     toast.info("تمت إضافة سؤال جديد. قم بملء البيانات ثم حفظ السؤال.");
//   };

//   const duplicateQuestion = (questionToDuplicate) => {
//     const now = Date.now();
//     const duplicatedQuestion = {
//       ...questionToDuplicate,
//       id: makeTempId("copy"),
//       options: (questionToDuplicate.options || []).map((opt, idx) => ({
//         ...opt,
//         id: `copy-opt-${now}-${idx}-${Math.random()}`,
//       })),
//     };

//     setEditingParagraphQuestions((prev) => [...prev, duplicatedQuestion]);
//     setExpandedParagraphQuestions((prev) => ({
//       ...prev,
//       [`pq-${duplicatedQuestion.id}`]: true,
//     }));

//     toast.success("تم نسخ السؤال بنجاح");
//   };

//   const removeUnsavedQuestion = (questionId) => {
//     setEditingParagraphQuestions((prev) => prev.filter((q) => q.id !== questionId));
//     toast.info("تم إزالة السؤال غير المحفوظ");
//   };

//   const handleSaveNewParagraphQuestion = async (pq, paragraphId) => {
//     if (isHtmlEmpty(pq.questionText)) {
//       toast.error("يرجى إدخال نص السؤال");
//       return;
//     }

//     const hasCorrectOption = (pq.options || []).some((opt) => opt.isCorrect);
//     if (!hasCorrectOption) {
//       toast.error("يرجى تحديد إجابة صحيحة واحدة على الأقل");
//       return;
//     }

//     // (Optional) Basic validation: ensure all option texts not empty
//     const anyEmptyOpt = (pq.options || []).some((o) => isHtmlEmpty(o.text));
//     if (anyEmptyOpt) {
//       toast.error("يرجى إدخال نص لكل خيار");
//       return;
//     }

//     const payload = {
//       exam_section_id: selectedSectionId,
//       question_type: "paragraph_mcq",

//       // If your backend supports attaching to an existing paragraph by id:
//       paragraph_id: paragraphId,

//       // Some backends still require a paragraph_content string even when paragraph_id is sent
//       paragraph_content: "Read the following paragraph and answer the questions...",

//       // Create ONE question under that paragraph
//       questions: [
//         {
//           question_text: pq.questionText,
//           instructions: "Choose the correct answer",
//           mcq_array: (pq?.options || []).map((opt) => ({
//             answer: opt?.text,
//             correct_or_not: opt?.isCorrect ? "1" : "0",
//             question_explanation: opt?.explanation || "",
//           })),
//         },
//       ],
//     };

//     try {
//       const res = await dispatch(handleAddQuestion({ body: payload })).unwrap();

//       if (res?.data?.status === "success") {
//         toast.success("تم إضافة السؤال الجديد بنجاح");
//         refreshQuestions();

//         // remove from local editing state
//         setEditingParagraphQuestions((prev) => prev.filter((q) => q.id !== pq.id));
//       } else {
//         toast.error(res?.data?.message || "فشل إضافة السؤال");
//       }
//     } catch (e) {
//       toast.error("حصل خطأ أثناء إضافة السؤال");
//     }
//   };

//   // =========================
//   // Add new full passage with questions (create)
//   // =========================
//   const handleAddNewPassage = async () => {
//     if (isHtmlEmpty(newParagraphContent)) {
//       toast.error("يرجى إدخال نص الفقرة");
//       return;
//     }

//     if (!editingParagraphQuestions.length) {
//       toast.error("يرجى إضافة سؤال واحد على الأقل للفقرة");
//       return;
//     }

//     // Validate questions
//     for (const pq of editingParagraphQuestions) {
//       if (isHtmlEmpty(pq.questionText)) {
//         toast.error("في سؤال بدون نص. راجع أسئلة الفقرة.");
//         return;
//       }
//       const hasCorrect = (pq.options || []).some((o) => !!o.isCorrect);
//       if (!hasCorrect) {
//         toast.error("في سؤال بدون إجابة صحيحة. راجع أسئلة الفقرة.");
//         return;
//       }
//       const anyEmptyOpt = (pq.options || []).some((o) => isHtmlEmpty(o.text));
//       if (anyEmptyOpt) {
//         toast.error("في سؤال به خيار بدون نص. راجع الخيارات.");
//         return;
//       }
//     }

//     const payload = {
//       exam_section_id: selectedSectionId,
//       question_type: "paragraph_mcq",
//       paragraph_content: newParagraphContent,
//       questions: editingParagraphQuestions.map((pq) => ({
//         question_text: pq.questionText,
//         instructions: "Choose the correct answer",
//         mcq_array: (pq.options || []).map((opt) => ({
//           answer: opt.text,
//           correct_or_not: opt.isCorrect ? "1" : "0",
//           question_explanation: opt.explanation || "",
//         })),
//       })),
//     };

//     try {
//       const res = await dispatch(handleAddQuestion({ body: payload })).unwrap();

//       if (res?.data?.status === "success") {
//         toast.success("تم إضافة الفقرة الجديدة بنجاح");
//         refreshQuestions();
//         setAddingNewQuestion(false);
//         setNewParagraphContent("");
//         setEditingParagraphQuestions([]);
//       } else {
//         toast.error(res?.data?.message || "فشل إضافة الفقرة");
//       }
//     } catch (e) {
//       toast.error("حصل خطأ أثناء إضافة الفقرة");
//     }
//   };

//   // =========================
//   // Add new MCQ (create)
//   // =========================
//   const handleAddNewMCQ = async () => {
//     if (isHtmlEmpty(newMCQQuestion)) {
//       toast.error("يرجى إدخال نص السؤال");
//       return;
//     }

//     const hasCorrect = (newMCQOptions || []).some((o) => !!o.isCorrect);
//     if (!hasCorrect) {
//       toast.error("يرجى تحديد إجابة صحيحة");
//       return;
//     }

//     const anyEmptyOpt = (newMCQOptions || []).some((o) => isHtmlEmpty(o.text));
//     if (anyEmptyOpt) {
//       toast.error("يرجى إدخال نص لكل خيار");
//       return;
//     }

//     const payload = {
//       exam_section_id: selectedSectionId,
//       question_type: "mcq",
//       question_text: newMCQQuestion,
//       instructions: "Read carefully before answering",
//       mcq_array: (newMCQOptions || []).map((opt) => ({
//         answer: opt.text,
//         correct_or_not: opt.isCorrect ? "1" : "0",
//         question_explanation: opt.explanation || "",
//       })),
//     };

//     try {
//       const res = await dispatch(handleAddQuestion({ body: payload })).unwrap();

//       if (res?.data?.status === "success") {
//         toast.success("تم إضافة سؤال MCQ بنجاح");
//         refreshQuestions();

//         // reset + close
//         setAddingNewQuestion(false);
//         setNewQuestionType("mcq");
//         setNewMCQQuestion("");
//         setNewMCQOptions([
//           { id: makeTempId("opt"), text: "", explanation: "", isCorrect: true },
//           { id: makeTempId("opt"), text: "", explanation: "", isCorrect: false },
//           { id: makeTempId("opt"), text: "", explanation: "", isCorrect: false },
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
//   // Delete flows
//   // =========================
//   const handleDeleteParagraphQuestions = async () => {
//     if (!deleteParagraphModal) return;

//     try {
//       const res = await dispatch(
//         handleDeleteExamQuestions({ body: { id: deleteParagraphModal?.id } })
//       ).unwrap();

//       if (res?.data?.status === "success") {
//         toast.success("تم حذف السؤال بنجاح");
//         refreshQuestions();
//         setDeleteParagraphModal(false);
//       } else {
//         toast.error(
//           res?.error?.response?.data?.message ||
//             res?.data?.message ||
//             "فشل الحذف"
//         );
//       }
//     } catch (e) {
//       toast.error("حصل خطأ أثناء الحذف");
//     }
//   };

//   const handleDeleteAny = async () => {
//     if (!questionToDelete) return;

//     try {
//       if (questionToDelete.type === "mcq") {
//         const res = await dispatch(
//           handleDeleteExamQuestions({ body: { id: questionToDelete.id } })
//         ).unwrap();

//         if (res?.data?.status === "success") {
//           toast.success("تم حذف السؤال بنجاح");
//           refreshQuestions();
//         } else {
//           toast.error(res?.data?.message || "فشل الحذف");
//         }
//       } else {
//         const res = await dispatch(
//           handleDeleteParagraph({ body: { id: questionToDelete.id } })
//         ).unwrap();

//         if (res?.data?.status === "success") {
//           toast.success("تم حذف الفقرة بنجاح");
//           refreshQuestions();
//         } else {
//           toast.error(res?.data?.message || "فشل الحذف");
//         }
//       }
//     } catch (e) {
//       toast.error("حصل خطأ أثناء الحذف");
//     } finally {
//       setDeleteModal(false);
//       setQuestionToDelete(null);
//     }
//   };

//   function handleEditParagraphContent(q) {
//     const data_send = { id: q?.id, paragraph_content: editingParagraphContent };

//     dispatch(handleEditParagraph({ body: data_send }))
//       .unwrap()
//       .then((res) => {
//         if (res?.data?.status === "success") {
//           toast.success(res?.data?.message || "تم تعديل الفقرة بنجاح");
//           refreshQuestions();
//         } else {
//           toast.error(res?.data?.message || "فشل تعديل الفقرة");
//         }
//       })
//       .catch(() => toast.error("حصل خطأ أثناء تعديل نص الفقرة"));
//   }

//   // =========================
//   // Render Question Content (editing vs normal)
//   // =========================
//   const renderQuestionContent = (q) => {
//     const isEditing = editingQuestionId === q.id;

//     if (isEditing) {
//       const isMCQ = q.type === "mcq";
//       const isParagraph = q.type === "paragraph_mcq";

//       return (
//         <div className="space-y-6">
//           <Alert
//             message={
//               <div className="flex justify-between items-center">
//                 <div className="flex items-center gap-2">
//                   <Edit3 className="w-4 h-4" />
//                   <span>وضع التعديل - {isMCQ ? "سؤال MCQ" : "فقرة مع أسئلة"}</span>
//                 </div>

//                 <div className="flex gap-2">
//                   <Button
//                     type="primary"
//                     onClick={isParagraph ? addNewQuestionToParagraph : () => {}}
//                     icon={<Plus className="w-4 h-4" />}
//                     className="flex items-center gap-2"
//                   >
//                     {isParagraph ? "إضافة سؤال جديد" : "إضافة خيار"}
//                   </Button>
//                 </div>
//               </div>
//             }
//             type="info"
//             showIcon
//             className="border-2 border-blue-200 bg-blue-50"
//           />

//           <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200">
//             <div className="flex items-center gap-3">
//               <Badge
//                 count={isMCQ ? "MCQ" : "فقرة"}
//                 color={isMCQ ? "blue" : "purple"}
//                 className="font-bold"
//               />
//               <span className="font-bold text-gray-900 text-lg">
//                 {isMCQ ? "تعديل سؤال اختيار متعدد" : "تعديل فقرة وأسئلتها"}
//               </span>
//             </div>

//             <Space size="middle">
//               <Button
//                 onClick={cancelEditing}
//                 icon={<X className="w-4 h-4" />}
//                 size="large"
//                 className="hover:bg-gray-100"
//               >
//                 إلغاء التعديل
//               </Button>

//               {isMCQ && (
//                 <Button
//                   type="primary"
//                   icon={<Save className="w-4 h-4" />}
//                   loading={edit_question_loading}
//                   onClick={() => handleSaveMCQ(q)}
//                   size="large"
//                   className="min-w-[120px]"
//                 >
//                   حفظ التغييرات
//                 </Button>
//               )}
//             </Space>
//           </div>

//           {/* ===================== MCQ EDIT ===================== */}
//           {isMCQ && (
//             <AntCard
//               title={
//                 <div className="flex items-center gap-2">
//                   <List className="w-5 h-5" />
//                   <span>محتوى السؤال</span>
//                 </div>
//               }
//               className="shadow-lg border-0"
//             >
//               <div className="space-y-6">
//                 <div>
//                   <label className="block text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
//                     <span className="bg-blue-100 text-blue-700 w-6 h-6 rounded-full flex items-center justify-center">
//                       1
//                     </span>
//                     نص السؤال
//                   </label>
//                   <div className="border border-gray-200 rounded-lg overflow-hidden">
//                     <ReactQuill
//                       value={editingContent}
//                       onChange={setEditingContent}
//                       modules={quillModules}
//                       formats={quillFormats}
//                       className="bg-white min-h-[150px]"
//                       placeholder="أدخل نص السؤال هنا..."
//                     />
//                   </div>
//                 </div>

//                 <Divider>
//                   <span className="text-gray-500 font-medium">الخيارات</span>
//                 </Divider>

//                 <div className="space-y-4">
//                   <div className="flex items-center justify-between">
//                     <label className="block text-sm font-semibold text-gray-800 flex items-center gap-2">
//                       <span className="bg-green-100 text-green-700 w-6 h-6 rounded-full flex items-center justify-center">
//                         2
//                       </span>
//                       قم بتحديد الإجابة الصحيحة
//                     </label>
//                     <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
//                       اختر إجابة صحيحة واحدة
//                     </span>
//                   </div>

//                   <div className="space-y-4">
//                     {editingOptions.map((opt, idx) => (
//                       <div
//                         key={opt?.id ?? idx}
//                         className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
//                           editingCorrectAnswer === idx
//                             ? "border-emerald-400 bg-gradient-to-r from-emerald-50 to-green-50 shadow-md"
//                             : "border-gray-200 bg-gray-50 hover:bg-white"
//                         }`}
//                       >
//                         <div className="flex items-center justify-between mb-4">
//                           <div className="flex items-center gap-4">
//                             <div className="relative">
//                               <input
//                                 type="radio"
//                                 checked={editingCorrectAnswer === idx}
//                                 onChange={() => {
//                                   setEditingCorrectAnswer(idx);
//                                   // ✅ sync flags
//                                   setEditingOptions((prev) =>
//                                     (prev || []).map((o, ii) => ({
//                                       ...o,
//                                       isCorrect: ii === idx,
//                                     }))
//                                   );
//                                 }}
//                                 className="w-6 h-6 cursor-pointer"
//                                 id={`option-${idx}`}
//                               />
//                               <label
//                                 htmlFor={`option-${idx}`}
//                                 className="absolute inset-0 cursor-pointer"
//                               />
//                             </div>
//                             <span className="font-medium text-gray-700">
//                               {editingCorrectAnswer === idx ? (
//                                 <span className="text-emerald-600 flex items-center gap-2">
//                                   <span className="w-2 h-2 bg-emerald-600 rounded-full"></span>
//                                   الإجابة الصحيحة
//                                 </span>
//                               ) : (
//                                 "إجابة خاطئة"
//                               )}
//                             </span>
//                           </div>

//                           <div className="flex items-center gap-3">
//                             <span className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg text-sm font-medium">
//                               {String.fromCharCode(1632 + idx + 1)}
//                             </span>
//                             <span className="text-sm text-gray-500">
//                               الخيار {idx + 1}
//                             </span>
//                           </div>
//                         </div>

//                         <div className="space-y-4 pl-10">
//                           <div>
//                             <label className="text-sm text-gray-600 mb-2 block font-medium">
//                               نص الخيار
//                             </label>
//                             <div className="border border-gray-200 rounded-lg overflow-hidden">
//                               <ReactQuill
//                                 value={opt.text}
//                                 onChange={(v) => {
//                                   setEditingOptions((prev) => {
//                                     const copy = [...prev];
//                                     copy[idx] = { ...copy[idx], text: v };
//                                     return copy;
//                                   });
//                                 }}
//                                 modules={quillModules}
//                                 formats={quillFormats}
//                                 className="bg-white min-h-[100px]"
//                               />
//                             </div>
//                           </div>

//                           <div>
//                             <label className="text-sm text-gray-600 mb-2 block font-medium">
//                               <span className="text-gray-400">(اختياري)</span>{" "}
//                               الشرح
//                             </label>
//                             <div className="border border-gray-200 rounded-lg overflow-hidden">
//                               <ReactQuill
//                                 value={opt.explanation}
//                                 onChange={(v) => {
//                                   setEditingOptions((prev) => {
//                                     const copy = [...prev];
//                                     copy[idx] = { ...copy[idx], explanation: v };
//                                     return copy;
//                                   });
//                                 }}
//                                 modules={quillModules}
//                                 formats={quillFormats}
//                                 className="bg-white min-h-[100px]"
//                                 placeholder="أدخل شرحاً للخيار (اختياري)..."
//                               />
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 <div className="flex justify-end gap-3 pt-6 border-t">
//                   <Button
//                     onClick={cancelEditing}
//                     icon={<X className="w-4 h-4" />}
//                     size="large"
//                   >
//                     إلغاء
//                   </Button>
//                   <Button
//                     type="primary"
//                     icon={<Save className="w-4 h-4" />}
//                     loading={edit_question_loading}
//                     onClick={() => handleSaveMCQ(q)}
//                     size="large"
//                     className="min-w-[140px]"
//                   >
//                     حفظ السؤال
//                   </Button>
//                 </div>
//               </div>
//             </AntCard>
//           )}

//           {/* ===================== PARAGRAPH EDIT ===================== */}
//           {isParagraph && (
//             <div className="space-y-6">
//               <AntCard
//                 title={
//                   <div className="flex justify-between items-center">
//                     <div className="flex items-center gap-2">
//                       <FileText className="w-5 h-5" />
//                       <span>نص الفقرة الرئيسي</span>
//                     </div>
//                     <Space>
//                       <Tooltip title="حفظ نص الفقرة فقط">
//                         <Button
//                           type="primary"
//                           loading={edit_paragraph_loading}
//                           onClick={() => handleEditParagraphContent(q)}
//                           icon={<Save className="w-4 h-4" />}
//                         >
//                           حفظ الفقرة
//                         </Button>
//                       </Tooltip>
//                       <Tooltip title="حذف الفقرة بالكامل مع أسئلتها">
//                         <Button
//                           danger
//                           loading={delete_paragraph_loading}
//                           onClick={() => {
//                             setQuestionToDelete({ type: "paragraph", id: q?.id });
//                             setDeleteModal(true);
//                           }}
//                           icon={<Trash2 className="w-4 h-4" />}
//                         >
//                           حذف الفقرة
//                         </Button>
//                       </Tooltip>
//                     </Space>
//                   </div>
//                 }
//                 className="shadow-lg border-0"
//               >
//                 <div className="border border-gray-200 rounded-lg overflow-hidden">
//                   <ReactQuill
//                     value={editingParagraphContent}
//                     onChange={setEditingParagraphContent}
//                     modules={quillModules}
//                     formats={quillFormats}
//                     className="bg-white min-h-[200px]"
//                     placeholder="أدخل نص الفقرة هنا..."
//                   />
//                 </div>
//                 <div className="mt-4 text-sm text-gray-500">
//                   <AlertCircle className="w-4 h-4 inline mr-1" />
//                   سيتم حفظ التغييرات عند النقر على زر "حفظ الفقرة"
//                 </div>
//               </AntCard>

//               <AntCard
//                 title={
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center gap-2">
//                       <List className="w-5 h-5" />
//                       <span>أسئلة الفقرة</span>
//                       <Badge
//                         count={editingParagraphQuestions.length}
//                         color="blue"
//                         showZero
//                       />
//                     </div>
//                     <div className="flex items-center gap-3">
//                       <span className="text-sm text-gray-500">
//                         {editingParagraphQuestions.length} سؤال
//                       </span>
                     
//                     </div>
//                   </div>
//                 }
//                 className="shadow-lg border-0"
//               >
//                 <div className="space-y-4">
//                   {editingParagraphQuestions.length === 0 ? (
//                     <div className="text-center py-12">
//                       <HelpCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//                       <p className="text-gray-500 text-lg">
//                         لا توجد أسئلة في هذه الفقرة
//                       </p>
//                       <p className="text-gray-400 mt-2">
//                         انقر على زر "إضافة سؤال جديد" لبدء الإضافة
//                       </p>
//                     </div>
//                   ) : (
//                     <Collapse
//                       accordion={false}
//                       bordered={false}
//                       expandIcon={({ isActive }) =>
//                         isActive ? (
//                           <Minus className="w-4 h-4" />
//                         ) : (
//                           <Plus className="w-4 h-4" />
//                         )
//                       }
//                       expandIconPosition="end"
//                       className="bg-transparent"
//                     >
//                       {editingParagraphQuestions?.map((pq, qIdx) => {
//                         const isSavedQuestion =
//                           !String(pq.id).startsWith("temp-") &&
//                           !String(pq.id).startsWith("copy-");

//                         return (
//                           <Panel
//                             key={pq.id}
//                             header={
//                               <div className="flex items-center justify-between w-full pr-4">
//                                 <div className="flex items-center gap-4">
//                                   <div
//                                     className={`w-8 h-8 rounded-full flex items-center justify-center font-bold 
//                                   ${
//                                     isSavedQuestion
//                                       ? "bg-green-100 text-green-700 border-2 border-green-300"
//                                       : "bg-yellow-100 text-yellow-700 border-2 border-yellow-300"
//                                   }`}
//                                   >
//                                     {qIdx + 1}
//                                   </div>
//                                   <div>
//                                     <div className="font-bold text-gray-900">
//                                       سؤال {qIdx + 1}
//                                       {!isSavedQuestion && (
//                                         <Tag
//                                           color="gold"
//                                           className="mr-2 text-xs"
//                                         >
//                                           جديد
//                                         </Tag>
//                                       )}
//                                     </div>
//                                     <div className="text-sm text-gray-500">
//                                       {pq.questionText ? (
//                                         <span className="truncate max-w-md inline-block">
//                                           {stripHtml(pq.questionText).substring(
//                                             0,
//                                             50
//                                           )}
//                                           ...
//                                         </span>
//                                       ) : (
//                                         <span className="text-gray-400">
//                                           (لم يتم إدخال نص السؤال بعد)
//                                         </span>
//                                       )}
//                                     </div>
//                                   </div>
//                                 </div>
//                                 <div className="flex items-center gap-2">
//                                   <Badge
//                                     count={
//                                       (pq.options || []).filter((opt) => opt.isCorrect)
//                                         .length
//                                     }
//                                     color="green"
//                                     showZero
//                                   />
//                                   <span className="text-sm text-gray-500">
//                                     {(pq.options || []).length} خيارات
//                                   </span>
//                                 </div>
//                               </div>
//                             }
//                             extra={
//                               <Space size="small" onClick={(e) => e.stopPropagation()}>
//                                 {/* <Tooltip title="نسخ هذا السؤال">
//                                   <Button
//                                     type="text"
//                                     icon={<Copy className="w-4 h-4" />}
//                                     onClick={() => duplicateQuestion(pq)}
//                                     size="small"
//                                   />
//                                 </Tooltip> */}

//                                 {!isSavedQuestion ? (
//                                   <Popconfirm
//                                     title="حذف السؤال غير المحفوظ"
//                                     description="هل أنت متأكد من حذف هذا السؤال غير المحفوظ؟"
//                                     onConfirm={() => removeUnsavedQuestion(pq.id)}
//                                     okText="نعم"
//                                     cancelText="لا"
//                                   >
//                                     <Button
//                                       danger
//                                       type="text"
//                                       icon={<Trash2 className="w-4 h-4" />}
//                                       size="small"
//                                     />
//                                   </Popconfirm>
//                                 ) : (
//                                   <Button
//                                     danger
//                                     type="text"
//                                     icon={<Trash2 className="w-4 h-4" />}
//                                     onClick={() => setDeleteParagraphModal(pq)}
//                                     size="small"
//                                   />
//                                 )}
//                               </Space>
//                             }
//                             className={`mb-4 rounded-xl border ${
//                               isSavedQuestion
//                                 ? "border-gray-200 bg-white"
//                                 : "border-yellow-300 bg-yellow-50"
//                             }`}
//                           >
//                             <div className="p-4 space-y-6">
//                               <div>
//                                 <label className="text-sm font-semibold text-gray-800 mb-2 block">
//                                   نص السؤال
//                                 </label>
//                                 <div className="border border-gray-200 rounded-lg overflow-hidden">
//                                   <ReactQuill
//                                     value={pq.questionText}
//                                     onChange={(v) => {
//                                       setEditingParagraphQuestions((prev) => {
//                                         const copy = [...prev];
//                                         copy[qIdx] = {
//                                           ...copy[qIdx],
//                                           questionText: v,
//                                         };
//                                         return copy;
//                                       });
//                                     }}
//                                     modules={quillModules}
//                                     formats={quillFormats}
//                                     className="bg-white min-h-[120px]"
//                                     placeholder="أدخل نص السؤال هنا..."
//                                   />
//                                 </div>
//                               </div>

//                               <div>
//                                 <div className="flex items-center justify-between mb-4">
//                                   <label className="text-sm font-semibold text-gray-800">
//                                     الخيارات
//                                   </label>
//                                   <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
//                                     اختر إجابة صحيحة واحدة لكل سؤال
//                                   </span>
//                                 </div>

//                                 <div className="space-y-4">
//                                   {(pq.options || []).map((opt, oIdx) => (
//                                     <div
//                                       key={opt?.id ?? oIdx}
//                                       className={`p-5 rounded-xl border-2 transition-all ${
//                                         opt.isCorrect
//                                           ? "border-emerald-400 bg-gradient-to-r from-emerald-50 to-green-50"
//                                           : "border-gray-200 bg-white hover:border-gray-300"
//                                       }`}
//                                     >
//                                       <div className="flex items-center justify-between mb-4">
//                                         <div className="flex items-center gap-4">
//                                           <div className="relative">
//                                             <input
//                                               type="radio"
//                                               checked={!!opt.isCorrect}
//                                               onChange={() => {
//                                                 setEditingParagraphQuestions((prev) => {
//                                                   const copy = [...prev];
//                                                   const qCopy = { ...copy[qIdx] };
//                                                   qCopy.options = (qCopy.options || []).map(
//                                                     (o, ii) => ({
//                                                       ...o,
//                                                       isCorrect: ii === oIdx,
//                                                     })
//                                                   );
//                                                   copy[qIdx] = qCopy;
//                                                   return copy;
//                                                 });
//                                               }}
//                                               className="w-5 h-5 cursor-pointer"
//                                               id={`pq-${pq.id}-opt-${oIdx}`}
//                                             />
//                                             <label
//                                               htmlFor={`pq-${pq.id}-opt-${oIdx}`}
//                                               className="absolute inset-0 cursor-pointer"
//                                             />
//                                           </div>
//                                           <span
//                                             className={`font-medium ${
//                                               opt.isCorrect
//                                                 ? "text-emerald-600"
//                                                 : "text-gray-700"
//                                             }`}
//                                           >
//                                             {opt.isCorrect
//                                               ? "✓ إجابة صحيحة"
//                                               : "إجابة خاطئة"}
//                                           </span>
//                                         </div>

//                                         <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg text-sm font-medium">
//                                           {String.fromCharCode(1632 + oIdx + 1)}
//                                         </span>
//                                       </div>

//                                       <div className="space-y-4 pl-9">
//                                         <div>
//                                           <label className="text-sm text-gray-600 mb-2 block">
//                                             نص الخيار
//                                           </label>
//                                           <div className="border border-gray-200 rounded-lg overflow-hidden">
//                                             <ReactQuill
//                                               value={opt.text}
//                                               onChange={(v) => {
//                                                 setEditingParagraphQuestions((prev) => {
//                                                   const copy = [...prev];
//                                                   const qCopy = { ...copy[qIdx] };
//                                                   const opts = [...(qCopy.options || [])];
//                                                   opts[oIdx] = { ...opts[oIdx], text: v };
//                                                   qCopy.options = opts;
//                                                   copy[qIdx] = qCopy;
//                                                   return copy;
//                                                 });
//                                               }}
//                                               modules={quillModules}
//                                               formats={quillFormats}
//                                               className="bg-white min-h-[80px]"
//                                             />
//                                           </div>
//                                         </div>

//                                         <div>
//                                           <label className="text-sm text-gray-600 mb-2 block">
//                                             <span className="text-gray-400">
//                                               (اختياري)
//                                             </span>{" "}
//                                             الشرح
//                                           </label>
//                                           <div className="border border-gray-200 rounded-lg overflow-hidden">
//                                             <ReactQuill
//                                               value={opt.explanation}
//                                               onChange={(v) => {
//                                                 setEditingParagraphQuestions((prev) => {
//                                                   const copy = [...prev];
//                                                   const qCopy = { ...copy[qIdx] };
//                                                   const opts = [...(qCopy.options || [])];
//                                                   opts[oIdx] = {
//                                                     ...opts[oIdx],
//                                                     explanation: v,
//                                                   };
//                                                   qCopy.options = opts;
//                                                   copy[qIdx] = qCopy;
//                                                   return copy;
//                                                 });
//                                               }}
//                                               modules={quillModules}
//                                               formats={quillFormats}
//                                               className="bg-white min-h-[80px]"
//                                             />
//                                           </div>
//                                         </div>
//                                       </div>
//                                     </div>
//                                   ))}
//                                 </div>
//                               </div>

//                               <div className="flex justify-end pt-4 border-t border-gray-200">
//                                 {isSavedQuestion ? (
//                                   <Button
//                                     type="primary"
//                                     icon={<Save className="w-4 h-4" />}
//                                     loading={edit_question_loading}
//                                     onClick={() => handleSaveParagraph(pq)}
//                                     size="middle"
//                                     className="min-w-[140px]"
//                                   >
//                                     حفظ التعديلات
//                                   </Button>
//                                 ) : (
//                                   <Button
//                                     type="primary"
//                                     icon={<Save className="w-4 h-4" />}
//                                     loading={create_question_loading}
//                                     onClick={() =>
//                                       handleSaveNewParagraphQuestion(pq, q.id)
//                                     }
//                                     size="middle"
//                                     className="min-w-[140px] bg-green-600 hover:bg-green-700"
//                                   >
//                                     حفظ السؤال الجديد
//                                   </Button>
//                                 )}
//                               </div>
//                             </div>
//                           </Panel>
//                         );
//                       })}
//                     </Collapse>
//                   )}

//                   <div className="pt-6 border-t border-gray-200">
//                     <Button
//                       type="dashed"
//                       icon={<Plus className="w-4 h-4" />}
//                       onClick={addNewQuestionToParagraph}
//                       className="w-full h-16 text-lg"
//                       size="large"
//                     >
//                       إضافة سؤال جديد إلى الفقرة
//                     </Button>
//                   </div>
//                 </div>

//                 <Divider className="!my-6" />

//                 <div className="flex justify-between items-center">
//                   <div className="text-sm text-gray-500">
//                     <AlertCircle className="w-4 h-4 inline mr-1" />
//                     الأسئلة المميزة باللون الأصفر جديدة ولم تحفظ بعد
//                   </div>
//                   <Space>
//                     <Button onClick={cancelEditing} icon={<X className="w-4 h-4" />}>
//                       إغلاق التعديل
//                     </Button>
//                   </Space>
//                 </div>
//               </AntCard>
//             </div>
//           )}
//         </div>
//       );
//     }

//     // =========================
//     // Normal Display Mode
//     // =========================
//     return (
//       <div className="space-y-8 px-2">
//         {q.type === "paragraph_mcq" && (
//           <div className="relative p-8 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-3xl shadow-sm">
//             <div className="absolute top-3 right-6 flex gap-3 z-10">
//               <Button
//                 type="primary"
//                 icon={<Pencil className="w-4 h-4" />}
//                 onClick={() => startEditing(q)}
//                 size="middle"
//                 className="shadow-md"
//               >
//                 تعديل الفقرة
//               </Button>
//               <Button
//                 danger
//                 icon={<Trash2 className="w-4 h-4" />}
//                 onClick={() => {
//                   setQuestionToDelete({ type: "paragraph", id: q.id });
//                   setDeleteModal(true);
//                 }}
//                 size="middle"
//                 loading={delete_paragraph_loading}
//                 className="shadow-md"
//               >
//                 حذف الفقرة
//               </Button>
//             </div>

//             <div className="flex mt-8 items-center justify-between mb-4">
//               <div className="flex items-center gap-3">
//                 <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
//                   <BookOpen className="w-6 h-6 text-blue-600" />
//                 </div>
//                 <div>
//                   <h4 className="font-bold text-blue-900 text-2xl">
//                     الفقرة الرئيسية
//                   </h4>
//                   <div className="flex items-center gap-4 mt-1">
//                     <Tag color="blue" className="text-sm px-4 py-1 rounded-full">
//                       فقرة نصية
//                     </Tag>
//                     <div className="flex items-center gap-2 text-blue-700">
//                       <Hash className="w-4 h-4" />
//                       <span className="text-sm font-medium">
//                         {q.questions?.length || 0} أسئلة
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div
//               dangerouslySetInnerHTML={{ __html: q.paragraphContent }}
//               className="text-gray-800 leading-relaxed text-lg bg-white p-6 rounded-2xl border border-gray-100 mt-4"
//             />

//             <div className="mt-6 flex items-center justify-between">
//               <div className="flex items-center gap-2 text-blue-700">
//                 <MessageSquare className="w-4 h-4" />
//                 <span className="text-sm">أسئلة الفقرة قابلة للفتح/غلق ↓</span>
//               </div>

//                <Button
//                       type="primary"
//                       icon={<Plus className="w-4 h-4" />}
//                       onClick={addNewQuestionToParagraph}
//                       className="w-fit bg-blue-500 text-white p-3 h-16 text-lg"
//                       size="large"
//                     >
//                       إضافة سؤال جديد إلى الفقرة
//                     </Button>
//             </div>
//           </div>
//         )}

//         <div className="space-y-4">
//           {(q.type === "mcq"
//             ? [
//                 {
//                   id: q.id,
//                   questionText: q.question,
//                   options: q.options,
//                   correctAnswer: q.correctAnswer,
//                   type: "mcq",
//                 },
//               ]
//             : q.questions
//           ).map((item, qIdx) => {
//             const isParagraphQuestion = q.type === "paragraph_mcq";
//             const expanded = isParagraphQuestion ? isParagraphQuestionExpanded(item.id) : true;

//             return (
//               <div key={item.id || qIdx} className="space-y-2">
//                 {isParagraphQuestion && (
//                   <div
//                     onClick={() => toggleParagraphQuestion(item.id)}
//                     className="cursor-pointer"
//                   >
//                     <div
//                       className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
//                         expanded
//                           ? "border-indigo-300 bg-gradient-to-r from-indigo-50 to-blue-50"
//                           : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
//                       }`}
//                     >
//                       <div className="flex items-center justify-between">
//                         <div className="flex items-center gap-4">
//                           <div className="relative">
//                             <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold">
//                               {qIdx + 1}
//                             </div>
//                             {item.options?.some((opt) => opt.isCorrect) && (
//                               <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
//                                 <CheckCircle className="w-3 h-3 text-white" />
//                               </div>
//                             )}
//                           </div>
//                           <div>
//                             <h4 className="font-bold text-gray-900 text-lg flex items-center gap-2">
//                               سؤال {qIdx + 1}
//                               <Tag color="blue" className="text-xs">
//                                 جزء من الفقرة
//                               </Tag>
//                             </h4>
//                             <div className="text-sm text-gray-500 mt-1">
//                               {item.options?.length || 0} خيارات
//                               <span className="mx-2">•</span>
//                               {item.options?.filter((opt) => opt.isCorrect).length || 0} إجابة صحيحة
//                             </div>
//                           </div>
//                         </div>

//                         <div className="flex items-center gap-4">
//                           <div className="flex flex-col items-end gap-1">
//                             <div className="text-sm text-gray-500">الحالة</div>
//                             <div className={`font-bold ${expanded ? "text-indigo-600" : "text-gray-900"}`}>
//                               {expanded ? "مفتوح" : "مغلق"}
//                             </div>
//                           </div>
//                           {expanded ? (
//                             <ChevronUp className="w-6 h-6 text-indigo-600" />
//                           ) : (
//                             <ChevronDown className="w-6 h-6 text-gray-500" />
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {(!isParagraphQuestion || expanded) && (
//                   <div
//                     className={`bg-white rounded-2xl border border-gray-200 p-6 shadow-sm transition-all duration-300 ${
//                       isParagraphQuestion ? "ml-8" : ""
//                     }`}
//                   >
//                     {isParagraphQuestion && (
//                       <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
//                         <div className="flex items-center gap-3">
//                           <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold">
//                             {qIdx + 1}
//                           </div>
//                           <div>
//                             <h4 className="font-bold text-gray-900">
//                               سؤال الفقرة {qIdx + 1}
//                             </h4>
//                             <p className="text-sm text-gray-500">
//                               جزء من الفقرة الرئيسية
//                             </p>
//                           </div>
//                         </div>

//                         <Space>
//                           <Button
//                             icon={<Edit3 className="w-4 h-4" />}
//                             type="primary"
//                             ghost
//                             size="small"
//                             onClick={() => startEditing(q)}
//                           >
//                             تعديل داخل الفقرة
//                           </Button>
//                           <Button
//                             danger
//                             icon={<Trash2 className="w-4 h-4" />}
//                             size="small"
//                             onClick={() => setDeleteParagraphModal(item)}
//                           >
//                             حذف السؤال
//                           </Button>
//                         </Space>
//                       </div>
//                     )}

//                     <div
//                       dangerouslySetInnerHTML={{ __html: item.questionText }}
//                       className="text-gray-800 leading-relaxed text-lg mb-6 font-medium bg-gray-50 p-5 rounded-xl"
//                     />

//                     <div className="grid gap-3">
//                       {item.options?.map((opt, oIdx) => {
//                         const isCorrect = isParagraphQuestion
//                           ? !!opt.isCorrect
//                           : oIdx === item.correctAnswer;

//                         return (
//                           <div
//                             key={opt?.id ?? oIdx}
//                             className={`p-4 rounded-xl border transition-all ${
//                               isCorrect
//                                 ? "bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-300"
//                                 : "bg-white border-gray-200 hover:border-gray-300"
//                             }`}
//                           >
//                             <div className="flex items-start gap-3">
//                               <div
//                                 className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
//                                   isCorrect
//                                     ? "bg-emerald-100 text-emerald-700 border-2 border-emerald-300"
//                                     : "bg-gray-100 text-gray-700 border-2 border-gray-300"
//                                 }`}
//                               >
//                                 {String.fromCharCode(1632 + oIdx + 1)}
//                               </div>

//                               <div className="flex-1">
//                                 <div
//                                   dangerouslySetInnerHTML={{ __html: opt.text }}
//                                   className="font-medium text-gray-800 leading-relaxed"
//                                 />

//                                 {opt.explanation && (
//                                   <div className="mt-3 pt-3 border-t border-gray-200">
//                                     <div className="flex items-center gap-2 mb-2">
//                                       <span className="text-sm font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded">
//                                         الشرح
//                                       </span>
//                                     </div>
//                                     <div
//                                       dangerouslySetInnerHTML={{ __html: opt.explanation }}
//                                       className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-lg"
//                                     />
//                                   </div>
//                                 )}
//                               </div>

//                               {isCorrect && (
//                                 <div className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
//                                   <CheckCircle className="w-3 h-3" />
//                                   صحيح
//                                 </div>
//                               )}
//                             </div>
//                           </div>
//                         );
//                       })}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             );
//           })}
//         </div>

//         {q.type === "mcq" && (
//           <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 border-t border-gray-200">
//             <div className="text-sm text-gray-500">
//               <span className="font-medium">نوع السؤال:</span>{" "}
//               <Tag color="blue" className="mx-2">
//                 MCQ
//               </Tag>
//               <span>•</span>
//               <span className="mx-2">عدد الخيارات: {q.options.length}</span>
//             </div>

//             <Space size="middle">
//               <Button
//                 size="large"
//                 icon={<Edit3 className="w-5 h-5" />}
//                 type="primary"
//                 ghost
//                 onClick={() => startEditing(q)}
//                 className="min-w-[120px]"
//               >
//                 تعديل
//               </Button>
//               <Button
//                 size="large"
//                 icon={<Trash2 className="w-5 h-5" />}
//                 danger
//                 onClick={() => {
//                   setQuestionToDelete(q);
//                   setDeleteModal(true);
//                 }}
//                 loading={delete_question_loading}
//                 className="min-w-[120px]"
//               >
//                 حذف
//               </Button>
//             </Space>
//           </div>
//         )}
//       </div>
//     );
//   };

//   // =========================
//   // Add New Modal
//   // =========================
//   const renderAddNewModal = () => {
//     if (!addingNewQuestion) return null;

//     return (
//       <Modal
//         title={
//           <div className="flex items-center gap-2">
//             <Plus className="w-5 h-5" />
//             <span>إضافة سؤال جديد</span>
//           </div>
//         }
//         open={addingNewQuestion}
//         onCancel={() => {
//           setAddingNewQuestion(false);
//           setNewQuestionType("mcq");

//           // reset paragraph
//           setNewParagraphContent("");
//           setEditingParagraphQuestions([]);

//           // reset mcq
//           setNewMCQQuestion("");
//           setNewMCQOptions([
//             { id: makeTempId("opt"), text: "", explanation: "", isCorrect: true },
//             { id: makeTempId("opt"), text: "", explanation: "", isCorrect: false },
//             { id: makeTempId("opt"), text: "", explanation: "", isCorrect: false },
//             { id: makeTempId("opt"), text: "", explanation: "", isCorrect: false },
//           ]);
//         }}
//         footer={[
//           <Button
//             key="cancel"
//             onClick={() => {
//               setAddingNewQuestion(false);
//               setNewQuestionType("mcq");
//               setNewParagraphContent("");
//               setEditingParagraphQuestions([]);
//               setNewMCQQuestion("");
//             }}
//           >
//             إلغاء
//           </Button>,
//           <Button
//             key="submit"
//             type="primary"
//             loading={create_question_loading}
//             onClick={newQuestionType === "mcq" ? handleAddNewMCQ : handleAddNewPassage}
//           >
//             {newQuestionType === "mcq" ? "إضافة سؤال MCQ" : "إضافة فقرة جديدة"}
//           </Button>,
//         ]}
//         width={900}
//       >
//         <div className="space-y-6">
//           <div>
//             <label className="block text-sm font-semibold text-gray-800 mb-2">
//               نوع السؤال
//             </label>
//             <div className="flex gap-4">
//               <Button
//                 type={newQuestionType === "mcq" ? "primary" : "default"}
//                 onClick={() => setNewQuestionType("mcq")}
//                 className="flex-1"
//               >
//                 <div className="flex flex-col items-center gap-2 py-2">
//                   <List className="w-6 h-6" />
//                   <span>سؤال MCQ</span>
//                 </div>
//               </Button>
//               <Button
//                 type={newQuestionType === "paragraph" ? "primary" : "default"}
//                 onClick={() => setNewQuestionType("paragraph")}
//                 className="flex-1"
//               >
//                 <div className="flex flex-col items-center gap-2 py-2">
//                   <FileText className="w-6 h-6" />
//                   <span>فقرة مع أسئلة</span>
//                 </div>
//               </Button>
//             </div>
//           </div>

//           {newQuestionType === "mcq" && (
//             <div className="space-y-5">
//               <AntCard title="نص سؤال MCQ" className="shadow-sm">
//                 <div className="border border-gray-200 rounded-lg overflow-hidden">
//                   <ReactQuill
//                     value={newMCQQuestion}
//                     onChange={setNewMCQQuestion}
//                     modules={quillModules}
//                     formats={quillFormats}
//                     className="bg-white min-h-[150px]"
//                     placeholder="أدخل نص السؤال هنا..."
//                   />
//                 </div>
//               </AntCard>

//               <AntCard
//                 title={
//                   <div className="flex items-center justify-between">
//                     <span>خيارات السؤال</span>
//                     <span className="text-xs text-gray-500">
//                       اختر إجابة صحيحة واحدة
//                     </span>
//                   </div>
//                 }
//                 className="shadow-sm"
//               >
//                 <div className="space-y-4">
//                   {newMCQOptions.map((opt, idx) => (
//                     <div
//                       key={opt.id}
//                       className={`p-4 rounded-xl border-2 ${
//                         opt.isCorrect
//                           ? "border-emerald-300 bg-emerald-50"
//                           : "border-gray-200 bg-white"
//                       }`}
//                     >
//                       <div className="flex items-center justify-between mb-3">
//                         <div className="flex items-center gap-3">
//                           <input
//                             type="radio"
//                             checked={!!opt.isCorrect}
//                             onChange={() => {
//                               setNewMCQOptions((prev) =>
//                                 (prev || []).map((o, ii) => ({
//                                   ...o,
//                                   isCorrect: ii === idx,
//                                 }))
//                               );
//                             }}
//                             className="w-5 h-5 cursor-pointer"
//                           />
//                           <span className="font-medium text-gray-700">
//                             {opt.isCorrect ? "✓ صحيحة" : "خاطئة"}
//                           </span>
//                         </div>
//                         <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg text-sm font-medium">
//                           {String.fromCharCode(1632 + idx + 1)}
//                         </span>
//                       </div>

//                       <div className="grid gap-3">
//                         <div className="border border-gray-200 rounded-lg overflow-hidden">
//                           <ReactQuill
//                             value={opt.text}
//                             onChange={(v) => {
//                               setNewMCQOptions((prev) => {
//                                 const copy = [...prev];
//                                 copy[idx] = { ...copy[idx], text: v };
//                                 return copy;
//                               });
//                             }}
//                             modules={quillModules}
//                             formats={quillFormats}
//                             className="bg-white min-h-[90px]"
//                             placeholder="نص الخيار..."
//                           />
//                         </div>

//                         <div className="border border-gray-200 rounded-lg overflow-hidden">
//                           <ReactQuill
//                             value={opt.explanation}
//                             onChange={(v) => {
//                               setNewMCQOptions((prev) => {
//                                 const copy = [...prev];
//                                 copy[idx] = { ...copy[idx], explanation: v };
//                                 return copy;
//                               });
//                             }}
//                             modules={quillModules}
//                             formats={quillFormats}
//                             className="bg-white min-h-[90px]"
//                             placeholder="شرح (اختياري)..."
//                           />
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </AntCard>
//             </div>
//           )}

//           {newQuestionType === "paragraph" && (
//             <div className="space-y-4">
//               <AntCard title="نص الفقرة" className="shadow-sm">
//                 <div className="border border-gray-200 rounded-lg overflow-hidden">
//                   <ReactQuill
//                     value={newParagraphContent}
//                     onChange={setNewParagraphContent}
//                     modules={quillModules}
//                     formats={quillFormats}
//                     className="bg-white min-h-[170px]"
//                     placeholder="أدخل نص الفقرة هنا..."
//                   />
//                 </div>
//               </AntCard>

//               <AntCard
//                 title={
//                   <div className="flex items-center justify-between">
//                     <span>أسئلة الفقرة</span>
//                     <Button
//                       type="dashed"
//                       icon={<Plus className="w-4 h-4" />}
//                       onClick={addNewQuestionToParagraph}
//                     >
//                       إضافة سؤال
//                     </Button>
//                   </div>
//                 }
//                 className="shadow-sm"
//               >
//                 <div className="space-y-4">
//                   {editingParagraphQuestions.length === 0 ? (
//                     <div className="text-center py-8 text-gray-500">
//                       لا توجد أسئلة بعد — اضغط "إضافة سؤال"
//                     </div>
//                   ) : (
//                     <div className="text-sm text-gray-500">
//                       سيتم استخدام نفس واجهة التحرير داخل الفقرة بعد الإضافة.
//                       (هنا فقط ننشئ الفقرة + الأسئلة)
//                     </div>
//                   )}
//                 </div>
//               </AntCard>
//             </div>
//           )}
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
//         <p className="mt-4 text-gray-600 text-lg">جاري تحميل الأسئلة...</p>
//         <p className="text-sm text-gray-400 mt-2">يرجى الانتظار</p>
//       </div>
//     );
//   }

//   // =========================
//   // Main Render
//   // =========================
//   return (
//     <Card title="أسئلة الامتحان" icon={FileText} className="p-0 overflow-hidden">
//       <div className="p-6">
//         {apiQuestions.length === 0 ? (
//           <div className="text-center py-16">
//             <Empty
//               description={
//                 <div className="space-y-4">
//                   <div className="text-2xl font-bold text-gray-700">
//                     لا توجد أسئلة
//                   </div>
//                   <p className="text-gray-500">
//                     لم يتم إضافة أي أسئلة إلى هذا القسم بعد
//                   </p>
//                 </div>
//               }
//               image={Empty.PRESENTED_IMAGE_SIMPLE}
//             />
//             <div className="mt-8">
//               <Button
//                 type="primary"
//                 size="large"
//                 icon={<Plus className="w-5 h-5" />}
//                 onClick={() => setAddingNewQuestion(true)}
//                 className="min-w-[200px]"
//               >
//                 إضافة سؤال جديد
//               </Button>
//             </div>
//           </div>
//         ) : (
//           <div className="space-y-8">
//             <div className="p-8 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-3xl border-2 border-indigo-200 shadow-lg">
//               <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
//                 <div className="flex-1">
//                   <div className="flex items-center gap-3 mb-4">
//                     <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center text-xl font-bold">
//                       {apiQuestions.length}
//                     </div>
//                     <div>
//                       <h2
//                         dangerouslySetInnerHTML={{
//                           __html: selectedSection?.title || "قسم الامتحان",
//                         }}
//                         className="text-3xl font-bold text-indigo-900"
//                       ></h2>
//                       <div className="flex items-center gap-4 mt-2">
//                         <span className="text-lg text-indigo-700">
//                           <span className="font-bold">{apiQuestions.length}</span>{" "}
//                           سؤال
//                         </span>
//                         <span className="text-gray-400">•</span>
//                         <span className="text-sm text-gray-600">
//                           {apiQuestions.filter((q) => q.type === "mcq").length}{" "}
//                           MCQ
//                         </span>
//                         <span className="text-gray-400">•</span>
//                         <span className="text-sm text-gray-600">
//                           {
//                             apiQuestions.filter((q) => q.type === "paragraph_mcq")
//                               .length
//                           }{" "}
//                           فقرة
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="flex flex-col sm:flex-row gap-3">
//                   <Button
//                     icon={
//                       showAllQuestions ? (
//                         <EyeOff className="w-4 h-4" />
//                       ) : (
//                         <Eye className="w-4 h-4" />
//                       )
//                     }
//                     onClick={showAllQuestions ? collapseAll : expandAll}
//                     size="large"
//                     className="min-w-[160px]"
//                   >
//                     {showAllQuestions ? "إغلاق جميع الأسئلة" : "فتح جميع الأسئلة"}
//                   </Button>
//                   <Button
//                     type="primary"
//                     icon={<Plus className="w-4 h-4" />}
//                     onClick={() => setAddingNewQuestion(true)}
//                     size="large"
//                     className="min-w-[160px] bg-green-600 hover:bg-green-700"
//                   >
//                     إضافة سؤال جديد
//                   </Button>
//                 </div>
//               </div>
//             </div>

//             <Tabs
//               activeKey={activeTab}
//               onChange={setActiveTab}
//               items={[
//                 {
//                   key: "all",
//                   label: (
//                     <div className="flex items-center gap-2">
//                       <List className="w-4 h-4" />
//                       جميع الأسئلة
//                       <Badge count={apiQuestions.length} color="blue" />
//                     </div>
//                   ),
//                 },
//                 {
//                   key: "mcq",
//                   label: (
//                     <div className="flex items-center gap-2">
//                       <List className="w-4 h-4" />
//                       أسئلة MCQ
//                       <Badge
//                         count={apiQuestions.filter((q) => q.type === "mcq").length}
//                         color="blue"
//                       />
//                     </div>
//                   ),
//                 },
//                 {
//                   key: "paragraph",
//                   label: (
//                     <div className="flex items-center gap-2">
//                       <FileText className="w-4 h-4" />
//                       فقرات
//                       <Badge
//                         count={
//                           apiQuestions.filter((q) => q.type === "paragraph_mcq")
//                             .length
//                         }
//                         color="purple"
//                       />
//                     </div>
//                   ),
//                 },
//               ]}
//             />

//             <div className="space-y-6">
//               <div className="flex items-center justify-between mb-4">
//                 <h3 className="text-xl font-bold text-gray-900">قائمة الأسئلة</h3>
//                 <div className="text-sm text-gray-500">
//                   {Object.values(expandedQuestions).filter(Boolean).length} من{" "}
//                   {apiQuestions.length} مفتوح
//                 </div>
//               </div>

//               {apiQuestions
//                 .filter((q) => {
//                   if (activeTab === "mcq") return q.type === "mcq";
//                   if (activeTab === "paragraph") return q.type === "paragraph_mcq";
//                   return true;
//                 })
//                 .map((q, index) => {
//                   const isExp = isExpanded(q.id, q.type);
//                   const typeLabel =
//                     q.type === "mcq" ? "سؤال اختيار متعدد" : "فقرة مع أسئلة";

//                   return (
//                     <div
//                       key={`${q.type}-${q.id}`}
//                       className={`bg-white overflow-hidden rounded-3xl shadow-xl border-2 transition-all duration-300 ${
//                         isExp
//                           ? "border-indigo-300 shadow-2xl"
//                           : "border-gray-100 hover:border-gray-300"
//                       } ${editingQuestionId === q.id ? "ring-4 ring-blue-100" : ""}`}
//                     >
//                       <div
//                         onClick={() => toggleQuestion(q.id, q.type)}
//                         className={`flex items-center justify-between p-6 cursor-pointer transition-colors ${
//                           isExp
//                             ? "bg-gradient-to-r from-blue-50 to-indigo-50"
//                             : "hover:bg-gray-50"
//                         }`}
//                       >
//                         <div className="flex items-center gap-5">
//                           <div className="relative">
//                             <div
//                               className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold shadow-lg ${
//                                 q.type === "mcq"
//                                   ? "bg-gradient-to-br from-blue-500 to-cyan-500 text-white"
//                                   : "bg-gradient-to-br from-purple-500 to-pink-500 text-white"
//                               }`}
//                             >
//                               {index + 1}
//                             </div>
//                             {q.type === "paragraph_mcq" && (
//                               <Badge
//                                 count={q.questions?.length || 0}
//                                 color="purple"
//                                 className="absolute -top-2 -right-2 shadow-lg"
//                               />
//                             )}
//                           </div>

//                           <div className="flex-1">
//                             <div className="flex items-center gap-3 mb-2">
//                               <h4 className="font-bold text-xl text-gray-900">
//                                 {typeLabel}
//                               </h4>
//                               <Tag
//                                 color={q.type === "mcq" ? "blue" : "purple"}
//                                 className="text-sm px-3 py-1 rounded-full font-bold"
//                               >
//                                 {q.type === "mcq" ? "MCQ" : "فقرة"}
//                               </Tag>
//                             </div>
//                             <div
//                               className="text-sm text-gray-600 line-clamp-2 leading-relaxed"
//                               dangerouslySetInnerHTML={{
//                                 __html:
//                                   q.type === "mcq"
//                                     ? q.question
//                                     : q.paragraphContent || "فقرة نصية مع أسئلة",
//                               }}
//                             />
//                           </div>
//                         </div>

//                         <div className="flex items-center gap-6">
//                           <div className="text-right gap-1 !items-center hidden md:!flex">
//                             <div className="text-sm text-gray-500">
//                               {q.type === "mcq" ? "عدد الخيارات" : "عدد الأسئلة"}
//                             </div>
//                             <div className="font-bold text-gray-900">
//                               {q.type === "mcq"
//                                 ? q.options.length
//                                 : q.questions?.length || 0}
//                             </div>
//                           </div>

//                           <div className="flex !flex-row items-center gap-2">
//                             {isExp ? (
//                               <ChevronUp className="w-6 h-6 text-indigo-600" />
//                             ) : (
//                               <ChevronDown className="w-6 h-6 text-gray-500" />
//                             )}
//                             <span className="text-xs text-gray-500">
//                               {isExp ? "إغلاق" : "فتح"}
//                             </span>
//                           </div>
//                         </div>
//                       </div>

//                       {isExp && (
//                         <div className="border-t-2 border-gray-100">
//                           <div className="p-1">
//                             <div className="bg-gradient-to-r from-gray-50 to-white rounded-2xl m-4">
//                               {renderQuestionContent(q)}
//                             </div>
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   );
//                 })}
//             </div>
//           </div>
//         )}
//       </div>

//       {renderAddNewModal()}

//       {/* DELETE MODALS */}
//       <Modal
//         open={deleteModal}
//         onCancel={() => setDeleteModal(false)}
//         onOk={handleDeleteAny}
//         okText="نعم، احذف"
//         cancelText="إلغاء"
//         okButtonProps={{
//           danger: true,
//           loading:
//             questionToDelete?.type === "mcq"
//               ? delete_question_loading
//               : delete_paragraph_loading,
//           className: "min-w-[120px]",
//         }}
//         cancelButtonProps={{
//           className: "min-w-[120px]",
//         }}
//         width={520}
//         className="text-center"
//       >
//         <div className="py-8 px-4">
//           <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
//             <Trash2 className="w-10 h-10 text-red-600" />
//           </div>
//           <h3 className="text-2xl font-bold text-gray-900 mb-3">تأكيد الحذف</h3>
//           <p className="text-gray-600 text-base leading-relaxed mb-6">
//             هل أنت متأكد من حذف{" "}
//             <span className="font-bold text-red-600">
//               {questionToDelete?.type === "mcq" ? "هذا السؤال" : "هذه الفقرة"}
//             </span>
//             ؟
//             <br />
//             <span className="text-sm text-gray-500 mt-2 block">
//               هذا الإجراء لا يمكن التراجع عنه وسيتم حذف جميع البيانات المرتبطة
//             </span>
//           </p>
//         </div>
//       </Modal>

//       <Modal
//         open={!!deleteParagraphModal}
//         onCancel={() => setDeleteParagraphModal(false)}
//         onOk={handleDeleteParagraphQuestions}
//         okText="نعم، احذف السؤال"
//         cancelText="إلغاء"
//         okButtonProps={{
//           danger: true,
//           loading: delete_question_loading,
//           className: "min-w-[140px]",
//         }}
//         cancelButtonProps={{
//           className: "min-w-[120px]",
//         }}
//         width={520}
//         className="text-center"
//       >
//         <div className="py-8 px-4">
//           <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-orange-100 flex items-center justify-center">
//             <AlertCircle className="w-10 h-10 text-orange-600" />
//           </div>
//           <h3 className="text-2xl font-bold text-gray-900 mb-3">
//             حذف سؤال من الفقرة
//           </h3>
//           <p className="text-gray-600 text-base leading-relaxed mb-6">
//             سيتم حذف هذا السؤال فقط من الفقرة
//             <br />
//             <span className="text-sm text-gray-500 mt-2 block">
//               باقي الأسئلة في الفقرة ستبقى كما هي
//             </span>
//           </p>
//         </div>
//       </Modal>
//     </Card>
//   );
// }

"use client";

import React, { useMemo, useState, useEffect } from "react";
import {
  Edit3,
  Trash2,
  Save,
  X,
  ChevronDown,
  ChevronUp,
  FileText,
  List,
  Eye,
  EyeOff,
  AlertCircle,
  Plus,
  Minus,
  Copy,
  MessageSquare,
  HelpCircle,
  Pencil,
  BookOpen,
  CheckCircle,
  Hash,
} from "lucide-react";
import {
  Empty,
  Spin,
  Tag,
  Button,
  Modal,
  Divider,
  Tooltip,
  Space,
  Alert,
  Card as AntCard,
  Badge,
  Collapse,
  Input,
  Popconfirm,
  Tabs,
  Form,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import dynamic from "next/dynamic";
import Card from "./ExamCard";
import {
  handleDeleteExamQuestions,
  handleGetExamQuestions,
  handleUpdateExamQuestions,
  handleEditParagraph,
  handleDeleteParagraph,
  handleAddQuestion,
  handleAddParagraphQuestion,
} from "../../lib/features/examSlice";
import { toast } from "react-toastify";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
import "react-quill-new/dist/quill.snow.css";

const { Panel } = Collapse;

export default function DisplayQuestions({
  selectedSectionId,
  setEditingQuestion,
  selectedSection,
}) {
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

  // =========================
  // UI State
  // =========================
  const [expandedQuestions, setExpandedQuestions] = useState({});
  const [expandedParagraphQuestions, setExpandedParagraphQuestions] = useState({});
  const [editingQuestionId, setEditingQuestionId] = useState(null);
  const [editingType, setEditingType] = useState(null);
  const [showAllQuestions, setShowAllQuestions] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  // MCQ editing
  const [editingContent, setEditingContent] = useState("");
  const [editingOptions, setEditingOptions] = useState([]);
  const [editingCorrectAnswer, setEditingCorrectAnswer] = useState(0);

  // Paragraph editing
  const [editingParagraphContent, setEditingParagraphContent] = useState("");
  const [editingParagraphQuestions, setEditingParagraphQuestions] = useState([]);

  // Delete modals
  const [deleteParagraphModal, setDeleteParagraphModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState(null);

  // Add new (global) modal
  const [addingNewQuestion, setAddingNewQuestion] = useState(false);
  const [newQuestionType, setNewQuestionType] = useState("mcq"); // "mcq" | "paragraph"
  const [newParagraphContent, setNewParagraphContent] = useState("");

  // New MCQ modal state
  const [newMCQQuestion, setNewMCQQuestion] = useState("");
  const [newMCQOptions, setNewMCQOptions] = useState([
    { id: makeTempId("opt"), text: "", explanation: "", isCorrect: true },
    { id: makeTempId("opt"), text: "", explanation: "", isCorrect: false },
    { id: makeTempId("opt"), text: "", explanation: "", isCorrect: false },
    { id: makeTempId("opt"), text: "", explanation: "", isCorrect: false },
  ]);

  // Add question to existing paragraph modal - UPDATED
  const [addingQuestionToParagraph, setAddingQuestionToParagraph] = useState(null);
  const [newParagraphQuestionText, setNewParagraphQuestionText] = useState("");
  const [newParagraphQuestionOptions, setNewParagraphQuestionOptions] = useState([
    { id: makeTempId("opt"), text: "", explanation: "", isCorrect: true },
    { id: makeTempId("opt"), text: "", explanation: "", isCorrect: false },
    { id: makeTempId("opt"), text: "", explanation: "", isCorrect: false },
    { id: makeTempId("opt"), text: "", explanation: "", isCorrect: false },
  ]);

  // =========================
  // Init expands from API
  // =========================
  useEffect(() => {
    if (!get_exam_questions_list) return;

    const initial = {};
    (get_exam_questions_list?.data?.message?.mcq || []).forEach(
      (q) => (initial[`mcq-${q.id}`] = false)
    );
    (get_exam_questions_list?.data?.message?.paragraphs || []).forEach(
      (p) => (initial[`paragraph-${p.paragraph.id}`] = false)
    );
    setExpandedQuestions(initial);

    const paragraphQuestionsInitial = {};
    (get_exam_questions_list?.data?.message?.paragraphs || []).forEach((p) => {
      (p.questions || []).forEach((q) => {
        paragraphQuestionsInitial[`pq-${q.id}`] = false;
      });
    });
    setExpandedParagraphQuestions(paragraphQuestionsInitial);
  }, [get_exam_questions_list]);

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ align: [] }],
      ["clean"],
      ["link", "image", "formula"],
    ],
  };

  const quillFormats = [
    "header",
    "bold",
    "italic",
    "underline",
    "list",
    "bullet",
    "align",
    "link",
    "image",
    "formula",
  ];

  // =========================
  // Normalize API data
  // =========================
  const apiQuestions = useMemo(() => {
    if (!get_exam_questions_list && !selectedSection) return [];

    const data = get_exam_questions_list?.data?.message || {
      mcq: [],
      paragraphs: [],
    };

    const mcqSource =
      data?.mcq && data?.mcq?.length
        ? data?.mcq
        : selectedSection?.mcq && selectedSection?.mcq?.length
        ? selectedSection?.mcq
        : [];

    const mcqs = mcqSource.map((q) => {
      const options = q?.options || [];
      const correctIndex = options.findIndex(
        (opt) => Number(opt?.is_correct) === 1
      );

      return {
        id: q.id,
        type: "mcq",
        question: q?.question_text || "",
        correctAnswer: correctIndex >= 0 ? correctIndex : 0,
        options: options.map((opt) => ({
          id: opt?.id,
          text: opt.option_text || "",
          explanation: opt.question_explanation || "",
          isCorrect: Number(opt?.is_correct) === 1,
        })),
        rawData: q,
      };
    });

    const paragraphSource =
      data?.paragraphs && data?.paragraphs?.length
        ? data?.paragraphs
        : selectedSection?.paragraphs || [];

    const paragraphs = paragraphSource.map((p) => ({
      id: p?.paragraph?.id,
      type: "paragraph_mcq",
      paragraphContent: p?.paragraph?.paragraph_content || "",
      questions: (p?.questions || []).map((q) => ({
        id: q?.id,
        questionText: q?.question_text || "",
        options: (q?.options || []).map((opt) => ({
          id: opt?.id,
          text: opt?.option_text || "",
          explanation: opt?.question_explanation || "",
          isCorrect: Number(opt?.is_correct) === 1,
        })),
      })),
      rawData: p,
    }));

    return [...mcqs, ...paragraphs];
  }, [get_exam_questions_list, selectedSection]);

  // =========================
  // Expand/collapse helpers
  // =========================
  const toggleQuestion = (id, type) => {
    const key = `${type === "mcq" ? "mcq" : "paragraph"}-${id}`;
    setExpandedQuestions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleParagraphQuestion = (questionId) => {
    setExpandedParagraphQuestions((prev) => ({
      ...prev,
      [`pq-${questionId}`]: !prev[`pq-${questionId}`],
    }));
  };

  const isParagraphQuestionExpanded = (questionId) =>
    expandedParagraphQuestions[`pq-${questionId}`] || false;

  const isExpanded = (id, type) =>
    expandedQuestions[`${type === "mcq" ? "mcq" : "paragraph"}-${id}`] || false;

  const expandAll = () => {
    const topExpanded = {};
    const pqExpanded = {};

    apiQuestions.forEach((q) => {
      topExpanded[`${q.type === "mcq" ? "mcq" : "paragraph"}-${q.id}`] = true;
      if (q.type === "paragraph_mcq") {
        (q.questions || []).forEach((pq) => {
          pqExpanded[`pq-${pq.id}`] = true;
        });
      }
    });

    setExpandedQuestions(topExpanded);
    setExpandedParagraphQuestions(pqExpanded);
    setShowAllQuestions(true);
  };

  const collapseAll = () => {
    const topCollapsed = {};
    const pqCollapsed = {};

    apiQuestions.forEach((q) => {
      topCollapsed[`${q.type === "mcq" ? "mcq" : "paragraph"}-${q.id}`] = false;
      if (q.type === "paragraph_mcq") {
        (q.questions || []).forEach((pq) => {
          pqCollapsed[`pq-${pq.id}`] = false;
        });
      }
    });

    setExpandedQuestions(topCollapsed);
    setExpandedParagraphQuestions(pqCollapsed);
    setShowAllQuestions(false);
  };

  // =========================
  // Editing
  // =========================
  const startEditing = (q) => {
    setEditingQuestionId(q.id);
    setEditingType(q.type);

    if (q.type === "mcq") {
      setEditingContent(q.question);
      setEditingOptions(q.options.map((opt) => ({ ...opt })));

      const correctIndex = q.options.findIndex((o) => !!o.isCorrect);
      const safeIndex = correctIndex >= 0 ? correctIndex : q.correctAnswer ?? 0;
      setEditingCorrectAnswer(safeIndex);

      // Ensure flags are synced (just in case)
      setEditingOptions((prev) =>
        (prev || []).map((o, idx) => ({ ...o, isCorrect: idx === safeIndex }))
      );
    } else if (q.type === "paragraph_mcq") {
      setEditingParagraphContent(q.paragraphContent);
      setEditingParagraphQuestions(
        (q.questions || []).map((pq) => ({
          id: pq.id,
          questionText: pq.questionText,
          options: (pq.options || []).map((opt) => ({ ...opt })),
        }))
      );
    }

    setEditingQuestion(q);
  };

  const cancelEditing = () => {
    setEditingQuestionId(null);
    setEditingType(null);

    setEditingContent("");
    setEditingOptions([]);
    setEditingCorrectAnswer(0);

    setEditingParagraphContent("");
    setEditingParagraphQuestions([]);

    setEditingQuestion(null);
  };

  const refreshQuestions = () => {
    dispatch(
      handleGetExamQuestions({
        body: { exam_section_id: selectedSectionId },
      })
    );
  };

  // =========================
  // Save MCQ (update)
  // =========================
  const handleSaveMCQ = async (q) => {
    if (isHtmlEmpty(editingContent)) {
      toast.error("يرجى إدخال نص السؤال");
      return;
    }

    const hasCorrect = (editingOptions || []).some((o) => !!o.isCorrect);
    if (!hasCorrect) {
      toast.error("يرجى تحديد إجابة صحيحة");
      return;
    }

    const payload = {
      id: q.id,
      question_text: editingContent,
      instructions: "Read carefully before answering",
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
        refreshQuestions();
        cancelEditing();
      } else {
        toast.error(res?.data?.message || "فشل تعديل السؤال");
      }
    } catch (e) {
      toast.error("حصل خطأ أثناء تعديل السؤال");
    } finally {
      cancelEditing();
    }
  };

  // =========================
  // Save paragraph question (update)
  // =========================
  const handleSaveParagraph = async (pq) => {
    if (isHtmlEmpty(pq?.questionText)) {
      toast.error("يرجى إدخال نص السؤال");
      return;
    }

    const hasCorrect = (pq?.options || []).some((o) => !!o.isCorrect);
    if (!hasCorrect) {
      toast.error("يرجى تحديد إجابة صحيحة واحدة على الأقل");
      return;
    }

    const payload = {
      id: pq?.id,
      question_text: pq?.questionText,
      instructions: "Read carefully before answering",
      mcq_array: (pq?.options || []).map((opt) => ({
        answer: opt?.text,
        correct_or_not: opt?.isCorrect ? "1" : "0",
        question_explanation: opt?.explanation,
      })),
    };

    try {
      const res = await dispatch(handleUpdateExamQuestions({ body: payload })).unwrap();

      if (res?.data?.status === "success") {
        toast.success("تم تعديل أسئلة الفقرة بنجاح");
        refreshQuestions();
      } else {
        toast.error(
          res?.error?.response?.data?.message ||
            res?.error?.message ||
            res?.data?.message ||
            "فشل تعديل أسئلة الفقرة"
        );
      }
    } catch (e) {
      toast.error("حصل خطأ أثناء تعديل الفقرة");
    }
  };

  // =========================
  // Start adding question to paragraph
  // =========================
  const startAddingQuestionToParagraph = (paragraph) => {
    setAddingQuestionToParagraph(paragraph);
    setNewParagraphQuestionText("");
    setNewParagraphQuestionOptions([
      { id: makeTempId("opt"), text: "", explanation: "", isCorrect: true },
      { id: makeTempId("opt"), text: "", explanation: "", isCorrect: false },
      { id: makeTempId("opt"), text: "", explanation: "", isCorrect: false },
      { id: makeTempId("opt"), text: "", explanation: "", isCorrect: false },
    ]);
  };

  // =========================
  // Save new question to paragraph - UPDATED
  // =========================
  const handleSaveNewParagraphQuestion = async () => {
    if (!addingQuestionToParagraph) return;

    if (isHtmlEmpty(newParagraphQuestionText)) {
      toast.error("يرجى إدخال نص السؤال");
      return;
    }

    const hasCorrectOption = newParagraphQuestionOptions.some((opt) => opt.isCorrect);
    if (!hasCorrectOption) {
      toast.error("يرجى تحديد إجابة صحيحة واحدة على الأقل");
      return;
    }

    // Check if all options have text
    const anyEmptyOpt = newParagraphQuestionOptions.some((o) => isHtmlEmpty(o.text));
    if (anyEmptyOpt) {
      toast.error("يرجى إدخال نص لكل خيار");
      return;
    }

    // Payload based on your API structure
    const payload = {
      paragraph_id: addingQuestionToParagraph.id,
      exam_section_id: selectedSectionId,
      question_text: newParagraphQuestionText,
      instructions: "Select the most appropriate answer based on the paragraph content.",
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
        refreshQuestions();
        setAddingQuestionToParagraph(null);
        setNewParagraphQuestionText("");
        setNewParagraphQuestionOptions([
          { id: makeTempId("opt"), text: "", explanation: "", isCorrect: true },
          { id: makeTempId("opt"), text: "", explanation: "", isCorrect: false },
          { id: makeTempId("opt"), text: "", explanation: "", isCorrect: false },
          { id: makeTempId("opt"), text: "", explanation: "", isCorrect: false },
        ]);
      } else {
        toast.error(res?.data?.message || "فشل إضافة السؤال");
      }
    } catch (e) {
      console.error("Error adding question to paragraph:", e);
      toast.error("حصل خطأ أثناء إضافة السؤال");
    }
  };

  // =========================
  // Add new question inside existing paragraph (create) - for edit mode
  // =========================
  const addNewQuestionToParagraphInEditMode = () => {
    const newQuestion = {
      id: makeTempId("temp"),
      questionText: "",
      options: [
        { id: makeTempId("opt"), text: "", explanation: "", isCorrect: true },
        { id: makeTempId("opt"), text: "", explanation: "", isCorrect: false },
        { id: makeTempId("opt"), text: "", explanation: "", isCorrect: false },
        { id: makeTempId("opt"), text: "", explanation: "", isCorrect: false },
      ],
    };

    setEditingParagraphQuestions((prev) => [...prev, newQuestion]);
    setExpandedParagraphQuestions((prev) => ({ ...prev, [`pq-${newQuestion.id}`]: true }));

    toast.info("تمت إضافة سؤال جديد. قم بملء البيانات ثم حفظ السؤال.");
  };

  const duplicateQuestion = (questionToDuplicate) => {
    const duplicatedQuestion = {
      ...questionToDuplicate,
      id: makeTempId("copy"),
      options: (questionToDuplicate.options || []).map((opt, idx) => ({
        ...opt,
        id: `copy-opt-${Date.now()}-${idx}-${Math.random()}`,
      })),
    };

    setEditingParagraphQuestions((prev) => [...prev, duplicatedQuestion]);
    setExpandedParagraphQuestions((prev) => ({
      ...prev,
      [`pq-${duplicatedQuestion.id}`]: true,
    }));

    toast.success("تم نسخ السؤال بنجاح");
  };

  const removeUnsavedQuestion = (questionId) => {
    setEditingParagraphQuestions((prev) => prev.filter((q) => q.id !== questionId));
    toast.info("تم إزالة السؤال غير المحفوظ");
  };

  // =========================
  // Add new full passage with questions (create)
  // =========================
  const handleAddNewPassage = async () => {
    if (isHtmlEmpty(newParagraphContent)) {
      toast.error("يرجى إدخال نص الفقرة");
      return;
    }

    if (!editingParagraphQuestions.length) {
      toast.error("يرجى إضافة سؤال واحد على الأقل للفقرة");
      return;
    }

    // Validate questions
    for (const pq of editingParagraphQuestions) {
      if (isHtmlEmpty(pq.questionText)) {
        toast.error("في سؤال بدون نص. راجع أسئلة الفقرة.");
        return;
      }
      const hasCorrect = (pq.options || []).some((o) => !!o.isCorrect);
      if (!hasCorrect) {
        toast.error("في سؤال بدون إجابة صحيحة. راجع أسئلة الفقرة.");
        return;
      }
      const anyEmptyOpt = (pq.options || []).some((o) => isHtmlEmpty(o.text));
      if (anyEmptyOpt) {
        toast.error("في سؤال به خيار بدون نص. راجع الخيارات.");
        return;
      }
    }

    const payload = {
      exam_section_id: selectedSectionId,
      question_type: "paragraph_mcq",
      paragraph_content: newParagraphContent,
      questions: editingParagraphQuestions.map((pq) => ({
        question_text: pq.questionText,
        instructions: "Choose the correct answer",
        mcq_array: (pq.options || []).map((opt) => ({
          answer: opt.text,
          correct_or_not: opt.isCorrect ? "1" : "0",
          question_explanation: opt.explanation || "",
        })),
      })),
    };

    try {
      const res = await dispatch(handleAddQuestion({ body: payload })).unwrap();

      if (res?.data?.status === "success") {
        toast.success("تم إضافة الفقرة الجديدة بنجاح");
        refreshQuestions();
        setAddingNewQuestion(false);
        setNewParagraphContent("");
        setEditingParagraphQuestions([]);
      } else {
        toast.error(res?.data?.message || "فشل إضافة الفقرة");
      }
    } catch (e) {
      toast.error("حصل خطأ أثناء إضافة الفقرة");
    }
  };

  // =========================
  // Add new MCQ (create)
  // =========================
  const handleAddNewMCQ = async () => {
    if (isHtmlEmpty(newMCQQuestion)) {
      toast.error("يرجى إدخال نص السؤال");
      return;
    }

    const hasCorrect = (newMCQOptions || []).some((o) => !!o.isCorrect);
    if (!hasCorrect) {
      toast.error("يرجى تحديد إجابة صحيحة");
      return;
    }

    const anyEmptyOpt = (newMCQOptions || []).some((o) => isHtmlEmpty(o.text));
    if (anyEmptyOpt) {
      toast.error("يرجى إدخال نص لكل خيار");
      return;
    }

    const payload = {
      exam_section_id: selectedSectionId,
      question_type: "mcq",
      question_text: newMCQQuestion,
      instructions: "Read carefully before answering",
      mcq_array: (newMCQOptions || []).map((opt) => ({
        answer: opt.text,
        correct_or_not: opt.isCorrect ? "1" : "0",
        question_explanation: opt.explanation || "",
      })),
    };

    try {
      const res = await dispatch(handleAddQuestion({ body: payload })).unwrap();

      if (res?.data?.status === "success") {
        toast.success("تم إضافة سؤال MCQ بنجاح");
        refreshQuestions();

        // reset + close
        setAddingNewQuestion(false);
        setNewQuestionType("mcq");
        setNewMCQQuestion("");
        setNewMCQOptions([
          { id: makeTempId("opt"), text: "", explanation: "", isCorrect: true },
          { id: makeTempId("opt"), text: "", explanation: "", isCorrect: false },
          { id: makeTempId("opt"), text: "", explanation: "", isCorrect: false },
          { id: makeTempId("opt"), text: "", explanation: "", isCorrect: false },
        ]);
      } else {
        toast.error(res?.data?.message || "فشل إضافة السؤال");
      }
    } catch (e) {
      toast.error("حصل خطأ أثناء إضافة السؤال");
    }
  };

  // =========================
  // Delete flows
  // =========================
  const handleDeleteParagraphQuestions = async () => {
    if (!deleteParagraphModal) return;

    try {
      const res = await dispatch(
        handleDeleteExamQuestions({ body: { id: deleteParagraphModal?.id } })
      ).unwrap();

      if (res?.data?.status === "success") {
        toast.success("تم حذف السؤال بنجاح");
        refreshQuestions();
        setDeleteParagraphModal(false);
      } else {
        toast.error(
          res?.error?.response?.data?.message ||
            res?.data?.message ||
            "فشل الحذف"
        );
      }
    } catch (e) {
      toast.error("حصل خطأ أثناء الحذف");
    }
  };

  const handleDeleteAny = async () => {
    if (!questionToDelete) return;

    try {
      if (questionToDelete.type === "mcq") {
        const res = await dispatch(
          handleDeleteExamQuestions({ body: { id: questionToDelete.id } })
        ).unwrap();

        if (res?.data?.status === "success") {
          toast.success("تم حذف السؤال بنجاح");
          refreshQuestions();
        } else {
          toast.error(res?.data?.message || "فشل الحذف");
        }
      } else {
        const res = await dispatch(
          handleDeleteParagraph({ body: { id: questionToDelete.id } })
        ).unwrap();

        if (res?.data?.status === "success") {
          toast.success("تم حذف الفقرة بنجاح");
          refreshQuestions();
        } else {
          toast.error(res?.data?.message || "فشل الحذف");
        }
      }
    } catch (e) {
      toast.error("حصل خطأ أثناء الحذف");
    } finally {
      setDeleteModal(false);
      setQuestionToDelete(null);
    }
  };

  function handleEditParagraphContent(q) {
    const data_send = { id: q?.id, paragraph_content: editingParagraphContent };

    dispatch(handleEditParagraph({ body: data_send }))
      .unwrap()
      .then((res) => {
        if (res?.data?.status === "success") {
          toast.success(res?.data?.message || "تم تعديل الفقرة بنجاح");
          refreshQuestions();
        } else {
          toast.error(res?.data?.message || "فشل تعديل الفقرة");
        }
      })
      .catch(() => toast.error("حصل خطأ أثناء تعديل نص الفقرة"));
  }

  // =========================
  // Render Question Content (editing vs normal)
  // =========================
  const renderQuestionContent = (q) => {
    const isEditing = editingQuestionId === q.id;

    if (isEditing) {
      const isMCQ = q.type === "mcq";
      const isParagraph = q.type === "paragraph_mcq";

      return (
        <div className="space-y-6">
          <Alert
            message={
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Edit3 className="w-4 h-4" />
                  <span>وضع التعديل - {isMCQ ? "سؤال MCQ" : "فقرة مع أسئلة"}</span>
                </div>

                <div className="flex gap-2">
                  {isParagraph && (
                    <Button
                      type="primary"
                      onClick={addNewQuestionToParagraphInEditMode}
                      icon={<Plus className="w-4 h-4" />}
                      className="flex items-center gap-2"
                    >
                      إضافة سؤال جديد
                    </Button>
                  )}
                </div>
              </div>
            }
            type="info"
            showIcon
            className="border-2 border-blue-200 bg-blue-50"
          />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200">
            <div className="flex items-center gap-3">
              <Badge
                count={isMCQ ? "MCQ" : "فقرة"}
                color={isMCQ ? "blue" : "purple"}
                className="font-bold"
              />
              <span className="font-bold text-gray-900 text-lg">
                {isMCQ ? "تعديل سؤال اختيار متعدد" : "تعديل فقرة وأسئلتها"}
              </span>
            </div>

            <Space size="middle">
              <Button
                onClick={cancelEditing}
                icon={<X className="w-4 h-4" />}
                size="large"
                className="hover:bg-gray-100"
              >
                إلغاء التعديل
              </Button>

              {isMCQ && (
                <Button
                  type="primary"
                  icon={<Save className="w-4 h-4" />}
                  loading={edit_question_loading}
                  onClick={() => handleSaveMCQ(q)}
                  size="large"
                  className="min-w-[120px]"
                >
                  حفظ التغييرات
                </Button>
              )}
            </Space>
          </div>

          {/* ===================== MCQ EDIT ===================== */}
          {isMCQ && (
            <AntCard
              title={
                <div className="flex items-center gap-2">
                  <List className="w-5 h-5" />
                  <span>محتوى السؤال</span>
                </div>
              }
              className="shadow-lg border-0"
            >
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <span className="bg-blue-100 text-blue-700 w-6 h-6 rounded-full flex items-center justify-center">
                      1
                    </span>
                    نص السؤال
                  </label>
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <ReactQuill
                      value={editingContent}
                      onChange={setEditingContent}
                      modules={quillModules}
                      formats={quillFormats}
                      className="bg-white min-h-[150px]"
                      placeholder="أدخل نص السؤال هنا..."
                    />
                  </div>
                </div>

                <Divider>
                  <span className="text-gray-500 font-medium">الخيارات</span>
                </Divider>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-semibold text-gray-800 flex items-center gap-2">
                      <span className="bg-green-100 text-green-700 w-6 h-6 rounded-full flex items-center justify-center">
                        2
                      </span>
                      قم بتحديد الإجابة الصحيحة
                    </label>
                    <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                      اختر إجابة صحيحة واحدة
                    </span>
                  </div>

                  <div className="space-y-4">
                    {editingOptions.map((opt, idx) => (
                      <div
                        key={opt?.id ?? idx}
                        className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
                          editingCorrectAnswer === idx
                            ? "border-emerald-400 bg-gradient-to-r from-emerald-50 to-green-50 shadow-md"
                            : "border-gray-200 bg-gray-50 hover:bg-white"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <div className="relative">
                              <input
                                type="radio"
                                checked={editingCorrectAnswer === idx}
                                onChange={() => {
                                  setEditingCorrectAnswer(idx);
                                  // ✅ sync flags
                                  setEditingOptions((prev) =>
                                    (prev || []).map((o, ii) => ({
                                      ...o,
                                      isCorrect: ii === idx,
                                    }))
                                  );
                                }}
                                className="w-6 h-6 cursor-pointer"
                                id={`option-${idx}`}
                              />
                              <label
                                htmlFor={`option-${idx}`}
                                className="absolute inset-0 cursor-pointer"
                              />
                            </div>
                            <span className="font-medium text-gray-700">
                              {editingCorrectAnswer === idx ? (
                                <span className="text-emerald-600 flex items-center gap-2">
                                  <span className="w-2 h-2 bg-emerald-600 rounded-full"></span>
                                  الإجابة الصحيحة
                                </span>
                              ) : (
                                "إجابة خاطئة"
                              )}
                            </span>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg text-sm font-medium">
                              {String.fromCharCode(1632 + idx + 1)}
                            </span>
                            <span className="text-sm text-gray-500">
                              الخيار {idx + 1}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-4 pl-10">
                          <div>
                            <label className="text-sm text-gray-600 mb-2 block font-medium">
                              نص الخيار
                            </label>
                            <div className="border border-gray-200 rounded-lg overflow-hidden">
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
                                className="bg-white min-h-[100px]"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="text-sm text-gray-600 mb-2 block font-medium">
                              <span className="text-gray-400">(اختياري)</span>{" "}
                              الشرح
                            </label>
                            <div className="border border-gray-200 rounded-lg overflow-hidden">
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
                                className="bg-white min-h-[100px]"
                                placeholder="أدخل شرحاً للخيار (اختياري)..."
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t">
                  <Button
                    onClick={cancelEditing}
                    icon={<X className="w-4 h-4" />}
                    size="large"
                  >
                    إلغاء
                  </Button>
                  <Button
                    type="primary"
                    icon={<Save className="w-4 h-4" />}
                    loading={edit_question_loading}
                    onClick={() => handleSaveMCQ(q)}
                    size="large"
                    className="min-w-[140px]"
                  >
                    حفظ السؤال
                  </Button>
                </div>
              </div>
            </AntCard>
          )}

          {/* ===================== PARAGRAPH EDIT ===================== */}
          {isParagraph && (
            <div className="space-y-6">
              <AntCard
                title={
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      <span>نص الفقرة الرئيسي</span>
                    </div>
                    <Space>
                      <Tooltip title="حفظ نص الفقرة فقط">
                        <Button
                          type="primary"
                          loading={edit_paragraph_loading}
                          onClick={() => handleEditParagraphContent(q)}
                          icon={<Save className="w-4 h-4" />}
                        >
                          حفظ الفقرة
                        </Button>
                      </Tooltip>
                      <Tooltip title="حذف الفقرة بالكامل مع أسئلتها">
                        <Button
                          danger
                          loading={delete_paragraph_loading}
                          onClick={() => {
                            setQuestionToDelete({ type: "paragraph", id: q?.id });
                            setDeleteModal(true);
                          }}
                          icon={<Trash2 className="w-4 h-4" />}
                        >
                          حذف الفقرة
                        </Button>
                      </Tooltip>
                    </Space>
                  </div>
                }
                className="shadow-lg border-0"
              >
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <ReactQuill
                    value={editingParagraphContent}
                    onChange={setEditingParagraphContent}
                    modules={quillModules}
                    formats={quillFormats}
                    className="bg-white min-h-[200px]"
                    placeholder="أدخل نص الفقرة هنا..."
                  />
                </div>
                <div className="mt-4 text-sm text-gray-500">
                  <AlertCircle className="w-4 h-4 inline mr-1" />
                  سيتم حفظ التغييرات عند النقر على زر "حفظ الفقرة"
                </div>
              </AntCard>

              <AntCard
                title={
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <List className="w-5 h-5" />
                      <span>أسئلة الفقرة</span>
                      <Badge
                        count={editingParagraphQuestions.length}
                        color="blue"
                        showZero
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-500">
                        {editingParagraphQuestions.length} سؤال
                      </span>
                    </div>
                  </div>
                }
                className="shadow-lg border-0"
              >
                <div className="space-y-4">
                  {editingParagraphQuestions.length === 0 ? (
                    <div className="text-center py-12">
                      <HelpCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 text-lg">
                        لا توجد أسئلة في هذه الفقرة
                      </p>
                      <p className="text-gray-400 mt-2">
                        انقر على زر "إضافة سؤال جديد" لبدء الإضافة
                      </p>
                    </div>
                  ) : (
                    <Collapse
                      accordion={false}
                      bordered={false}
                      expandIcon={({ isActive }) =>
                        isActive ? (
                          <Minus className="w-4 h-4" />
                        ) : (
                          <Plus className="w-4 h-4" />
                        )
                      }
                      expandIconPosition="end"
                      className="bg-transparent"
                    >
                      {editingParagraphQuestions?.map((pq, qIdx) => {
                        const isSavedQuestion =
                          !String(pq.id).startsWith("temp-") &&
                          !String(pq.id).startsWith("copy-");

                        return (
                          <Panel
                            key={pq.id}
                            header={
                              <div className="flex items-center justify-between w-full pr-4">
                                <div className="flex items-center gap-4">
                                  <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold 
                                  ${
                                    isSavedQuestion
                                      ? "bg-green-100 text-green-700 border-2 border-green-300"
                                      : "bg-yellow-100 text-yellow-700 border-2 border-yellow-300"
                                  }`}
                                  >
                                    {qIdx + 1}
                                  </div>
                                  <div>
                                    <div className="font-bold text-gray-900">
                                      سؤال {qIdx + 1}
                                      {!isSavedQuestion && (
                                        <Tag
                                          color="gold"
                                          className="mr-2 text-xs"
                                        >
                                          جديد
                                        </Tag>
                                      )}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      {pq.questionText ? (
                                        <span className="truncate max-w-md inline-block">
                                          {stripHtml(pq.questionText).substring(
                                            0,
                                            50
                                          )}
                                          ...
                                        </span>
                                      ) : (
                                        <span className="text-gray-400">
                                          (لم يتم إدخال نص السؤال بعد)
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge
                                    count={
                                      (pq.options || []).filter((opt) => opt.isCorrect)
                                        .length
                                    }
                                    color="green"
                                    showZero
                                  />
                                  <span className="text-sm text-gray-500">
                                    {(pq.options || []).length} خيارات
                                  </span>
                                </div>
                              </div>
                            }
                            extra={
                              <Space size="small" onClick={(e) => e.stopPropagation()}>
                                {!isSavedQuestion ? (
                                  <Popconfirm
                                    title="حذف السؤال غير المحفوظ"
                                    description="هل أنت متأكد من حذف هذا السؤال غير المحفوظ؟"
                                    onConfirm={() => removeUnsavedQuestion(pq.id)}
                                    okText="نعم"
                                    cancelText="لا"
                                  >
                                    <Button
                                      danger
                                      type="text"
                                      icon={<Trash2 className="w-4 h-4" />}
                                      size="small"
                                    />
                                  </Popconfirm>
                                ) : (
                                  <Button
                                    danger
                                    type="text"
                                    icon={<Trash2 className="w-4 h-4" />}
                                    onClick={() => setDeleteParagraphModal(pq)}
                                    size="small"
                                  />
                                )}
                              </Space>
                            }
                            className={`mb-4 rounded-xl border ${
                              isSavedQuestion
                                ? "border-gray-200 bg-white"
                                : "border-yellow-300 bg-yellow-50"
                            }`}
                          >
                            <div className="p-4 space-y-6">
                              <div>
                                <label className="text-sm font-semibold text-gray-800 mb-2 block">
                                  نص السؤال
                                </label>
                                <div className="border border-gray-200 rounded-lg overflow-hidden">
                                  <ReactQuill
                                    value={pq.questionText}
                                    onChange={(v) => {
                                      setEditingParagraphQuestions((prev) => {
                                        const copy = [...prev];
                                        copy[qIdx] = {
                                          ...copy[qIdx],
                                          questionText: v,
                                        };
                                        return copy;
                                      });
                                    }}
                                    modules={quillModules}
                                    formats={quillFormats}
                                    className="bg-white min-h-[120px]"
                                    placeholder="أدخل نص السؤال هنا..."
                                  />
                                </div>
                              </div>

                              <div>
                                <div className="flex items-center justify-between mb-4">
                                  <label className="text-sm font-semibold text-gray-800">
                                    الخيارات
                                  </label>
                                  <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                    اختر إجابة صحيحة واحدة لكل سؤال
                                  </span>
                                </div>

                                <div className="space-y-4">
                                  {(pq.options || []).map((opt, oIdx) => (
                                    <div
                                      key={opt?.id ?? oIdx}
                                      className={`p-5 rounded-xl border-2 transition-all ${
                                        opt.isCorrect
                                          ? "border-emerald-400 bg-gradient-to-r from-emerald-50 to-green-50"
                                          : "border-gray-200 bg-white hover:border-gray-300"
                                      }`}
                                    >
                                      <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-4">
                                          <div className="relative">
                                            <input
                                              type="radio"
                                              checked={!!opt.isCorrect}
                                              onChange={() => {
                                                setEditingParagraphQuestions((prev) => {
                                                  const copy = [...prev];
                                                  const qCopy = { ...copy[qIdx] };
                                                  qCopy.options = (qCopy.options || []).map(
                                                    (o, ii) => ({
                                                      ...o,
                                                      isCorrect: ii === oIdx,
                                                    })
                                                  );
                                                  copy[qIdx] = qCopy;
                                                  return copy;
                                                });
                                              }}
                                              className="w-5 h-5 cursor-pointer"
                                              id={`pq-${pq.id}-opt-${oIdx}`}
                                            />
                                            <label
                                              htmlFor={`pq-${pq.id}-opt-${oIdx}`}
                                              className="absolute inset-0 cursor-pointer"
                                            />
                                          </div>
                                          <span
                                            className={`font-medium ${
                                              opt.isCorrect
                                                ? "text-emerald-600"
                                                : "text-gray-700"
                                            }`}
                                          >
                                            {opt.isCorrect
                                              ? "✓ إجابة صحيحة"
                                              : "إجابة خاطئة"}
                                          </span>
                                        </div>

                                        <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg text-sm font-medium">
                                          {String.fromCharCode(1632 + oIdx + 1)}
                                        </span>
                                      </div>

                                      <div className="space-y-4 pl-9">
                                        <div>
                                          <label className="text-sm text-gray-600 mb-2 block">
                                            نص الخيار
                                          </label>
                                          <div className="border border-gray-200 rounded-lg overflow-hidden">
                                            <ReactQuill
                                              value={opt.text}
                                              onChange={(v) => {
                                                setEditingParagraphQuestions((prev) => {
                                                  const copy = [...prev];
                                                  const qCopy = { ...copy[qIdx] };
                                                  const opts = [...(qCopy.options || [])];
                                                  opts[oIdx] = { ...opts[oIdx], text: v };
                                                  qCopy.options = opts;
                                                  copy[qIdx] = qCopy;
                                                  return copy;
                                                });
                                              }}
                                              modules={quillModules}
                                              formats={quillFormats}
                                              className="bg-white min-h-[80px]"
                                            />
                                          </div>
                                        </div>

                                        <div>
                                          <label className="text-sm text-gray-600 mb-2 block">
                                            <span className="text-gray-400">
                                              (اختياري)
                                            </span>{" "}
                                            الشرح
                                          </label>
                                          <div className="border border-gray-200 rounded-lg overflow-hidden">
                                            <ReactQuill
                                              value={opt.explanation}
                                              onChange={(v) => {
                                                setEditingParagraphQuestions((prev) => {
                                                  const copy = [...prev];
                                                  const qCopy = { ...copy[qIdx] };
                                                  const opts = [...(qCopy.options || [])];
                                                  opts[oIdx] = {
                                                    ...opts[oIdx],
                                                    explanation: v,
                                                  };
                                                  qCopy.options = opts;
                                                  copy[qIdx] = qCopy;
                                                  return copy;
                                                });
                                              }}
                                              modules={quillModules}
                                              formats={quillFormats}
                                              className="bg-white min-h-[80px]"
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <div className="flex justify-end pt-4 border-t border-gray-200">
                                {isSavedQuestion ? (
                                  <Button
                                    type="primary"
                                    icon={<Save className="w-4 h-4" />}
                                    loading={edit_question_loading}
                                    onClick={() => handleSaveParagraph(pq)}
                                    size="middle"
                                    className="min-w-[140px]"
                                  >
                                    حفظ التعديلات
                                  </Button>
                                ) : (
                                  <Button
                                    type="primary"
                                    icon={<Save className="w-4 h-4" />}
                                    loading={create_question_loading}
                                    onClick={() =>
                                      handleSaveNewParagraphQuestion(pq, q.id)
                                    }
                                    size="middle"
                                    className="min-w-[140px] bg-green-600 hover:bg-green-700"
                                  >
                                    حفظ السؤال الجديد
                                  </Button>
                                )}
                              </div>
                            </div>
                          </Panel>
                        );
                      })}
                    </Collapse>
                  )}

                
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    <AlertCircle className="w-4 h-4 inline mr-1" />
                    الأسئلة المميزة باللون الأصفر جديدة ولم تحفظ بعد
                  </div>
                  <Space>
                    <Button onClick={cancelEditing} icon={<X className="w-4 h-4" />}>
                      إغلاق التعديل
                    </Button>
                  </Space>
                </div>
              </AntCard>
            </div>
          )}
        </div>
      );
    }

    // =========================
    // Normal Display Mode
    // =========================
    return (
      <div className="space-y-8 px-2">
        {q.type === "paragraph_mcq" && (
          <div className="relative p-8 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-3xl shadow-sm">
            {/* زر الإضافة بجانب الفقرة */}
            <div className="absolute top-3 right-6 flex gap-3 z-10">
              <Button
                type="primary"
                icon={<Pencil className="w-4 h-4" />}
                onClick={() => startEditing(q)}
                size="middle"
                className="shadow-md"
              >
                تعديل الفقرة
              </Button>
              <Button
                type="primary"
                icon={<Plus className="w-4 h-4" />}
                onClick={() => startAddingQuestionToParagraph(q)}
                size="middle"
                className="shadow-md bg-green-600"
              >
                إضافة سؤال
              </Button>
              <Button
                danger
                icon={<Trash2 className="w-4 h-4" />}
                onClick={() => {
                  setQuestionToDelete({ type: "paragraph", id: q.id });
                  setDeleteModal(true);
                }}
                size="middle"
                loading={delete_paragraph_loading}
                className="shadow-md"
              >
                حذف الفقرة
              </Button>
            </div>

            <div className="flex mt-8 items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-bold text-blue-900 text-2xl">
                    الفقرة الرئيسية
                  </h4>
                  <div className="flex items-center gap-4 mt-1">
                    <Tag color="blue" className="text-sm px-4 py-1 rounded-full">
                      فقرة نصية
                    </Tag>
                    <div className="flex items-center gap-2 text-blue-700">
                      <Hash className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        {q.questions?.length || 0} أسئلة
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              dangerouslySetInnerHTML={{ __html: q.paragraphContent }}
              className="text-gray-800 leading-relaxed text-lg bg-white p-6 rounded-2xl border border-gray-100 mt-4"
            />

            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center gap-2 text-blue-700">
                <MessageSquare className="w-4 h-4" />
                <span className="text-sm">أسئلة الفقرة قابلة للفتح/غلق ↓</span>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {(q.type === "mcq"
            ? [
                {
                  id: q.id,
                  questionText: q.question,
                  options: q.options,
                  correctAnswer: q.correctAnswer,
                  type: "mcq",
                },
              ]
            : q.questions
          ).map((item, qIdx) => {
            const isParagraphQuestion = q.type === "paragraph_mcq";
            const expanded = isParagraphQuestion ? isParagraphQuestionExpanded(item.id) : true;

            return (
              <div key={item.id || qIdx} className="space-y-2">
                {isParagraphQuestion && (
                  <div
                    onClick={() => toggleParagraphQuestion(item.id)}
                    className="cursor-pointer"
                  >
                    <div
                      className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
                        expanded
                          ? "border-indigo-300 bg-gradient-to-r from-indigo-50 to-blue-50"
                          : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold">
                              {qIdx + 1}
                            </div>
                            {item.options?.some((opt) => opt.isCorrect) && (
                              <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                                <CheckCircle className="w-3 h-3 text-white" />
                              </div>
                            )}
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                              سؤال {qIdx + 1}
                              <Tag color="blue" className="text-xs">
                                جزء من الفقرة
                              </Tag>
                            </h4>
                            <div className="text-sm text-gray-500 mt-1">
                              {item.options?.length || 0} خيارات
                              <span className="mx-2">•</span>
                              {item.options?.filter((opt) => opt.isCorrect).length || 0} إجابة صحيحة
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="flex flex-col items-end gap-1">
                            <div className="text-sm text-gray-500">الحالة</div>
                            <div className={`font-bold ${expanded ? "text-indigo-600" : "text-gray-900"}`}>
                              {expanded ? "مفتوح" : "مغلق"}
                            </div>
                          </div>
                          {expanded ? (
                            <ChevronUp className="w-6 h-6 text-indigo-600" />
                          ) : (
                            <ChevronDown className="w-6 h-6 text-gray-500" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {(!isParagraphQuestion || expanded) && (
                  <div
                    className={`bg-white rounded-2xl border border-gray-200 p-6 shadow-sm transition-all duration-300 ${
                      isParagraphQuestion ? "ml-8" : ""
                    }`}
                  >
                    {isParagraphQuestion && (
                      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold">
                            {qIdx + 1}
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900">
                              سؤال الفقرة {qIdx + 1}
                            </h4>
                            <p className="text-sm text-gray-500">
                              جزء من الفقرة الرئيسية
                            </p>
                          </div>
                        </div>

                        <Space>
                          <Button
                            icon={<Edit3 className="w-4 h-4" />}
                            type="primary"
                            ghost
                            size="small"
                            onClick={() => startEditing(q)}
                          >
                            تعديل داخل الفقرة
                          </Button>
                          <Button
                            danger
                            icon={<Trash2 className="w-4 h-4" />}
                            size="small"
                            onClick={() => setDeleteParagraphModal(item)}
                          >
                            حذف السؤال
                          </Button>
                        </Space>
                      </div>
                    )}

                    <div
                      dangerouslySetInnerHTML={{ __html: item.questionText }}
                      className="text-gray-800 leading-relaxed text-lg mb-6 font-medium bg-gray-50 p-5 rounded-xl"
                    />

                    <div className="grid gap-3">
                      {item.options?.map((opt, oIdx) => {
                        const isCorrect = isParagraphQuestion
                          ? !!opt.isCorrect
                          : oIdx === item.correctAnswer;

                        return (
                          <div
                            key={opt?.id ?? oIdx}
                            className={`p-4 rounded-xl border transition-all ${
                              isCorrect
                                ? "bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-300"
                                : "bg-white border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                                  isCorrect
                                    ? "bg-emerald-100 text-emerald-700 border-2 border-emerald-300"
                                    : "bg-gray-100 text-gray-700 border-2 border-gray-300"
                                }`}
                              >
                                {String.fromCharCode(1632 + oIdx + 1)}
                              </div>

                              <div className="flex-1">
                                <div
                                  dangerouslySetInnerHTML={{ __html: opt.text }}
                                  className="font-medium text-gray-800 leading-relaxed"
                                />

                                {opt.explanation && (
                                  <div className="mt-3 pt-3 border-t border-gray-200">
                                    <div className="flex items-center gap-2 mb-2">
                                      <span className="text-sm font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded">
                                        الشرح
                                      </span>
                                    </div>
                                    <div
                                      dangerouslySetInnerHTML={{ __html: opt.explanation }}
                                      className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-lg"
                                    />
                                  </div>
                                )}
                              </div>

                              {isCorrect && (
                                <div className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                  <CheckCircle className="w-3 h-3" />
                                  صحيح
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {q.type === "mcq" && (
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 border-t border-gray-200">
            <div className="text-sm text-gray-500">
              <span className="font-medium">نوع السؤال:</span>{" "}
              <Tag color="blue" className="mx-2">
                MCQ
              </Tag>
              <span>•</span>
              <span className="mx-2">عدد الخيارات: {q.options.length}</span>
            </div>

            <Space size="middle">
              <Button
                size="large"
                icon={<Edit3 className="w-5 h-5" />}
                type="primary"
                ghost
                onClick={() => startEditing(q)}
                className="min-w-[120px]"
              >
                تعديل
              </Button>
              <Button
                size="large"
                icon={<Trash2 className="w-5 h-5" />}
                danger
                onClick={() => {
                  setQuestionToDelete(q);
                  setDeleteModal(true);
                }}
                loading={delete_question_loading}
                className="min-w-[120px]"
              >
                حذف
              </Button>
            </Space>
          </div>
        )}
      </div>
    );
  };

  // =========================
  // Modal لإضافة سؤال إلى فقرة
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
        onCancel={() => {
          setAddingQuestionToParagraph(null);
          setNewParagraphQuestionText("");
          setNewParagraphQuestionOptions([
            { id: makeTempId("opt"), text: "", explanation: "", isCorrect: true },
            { id: makeTempId("opt"), text: "", explanation: "", isCorrect: false },
            { id: makeTempId("opt"), text: "", explanation: "", isCorrect: false },
            { id: makeTempId("opt"), text: "", explanation: "", isCorrect: false },
          ]);
        }}
        footer={[
          <Button
            key="cancel"
            onClick={() => {
              setAddingQuestionToParagraph(null);
              setNewParagraphQuestionText("");
              setNewParagraphQuestionOptions([
                { id: makeTempId("opt"), text: "", explanation: "", isCorrect: true },
                { id: makeTempId("opt"), text: "", explanation: "", isCorrect: false },
                { id: makeTempId("opt"), text: "", explanation: "", isCorrect: false },
                { id: makeTempId("opt"), text: "", explanation: "", isCorrect: false },
              ]);
            }}
          >
            إلغاء
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={create_question_loading}
            onClick={handleSaveNewParagraphQuestion}
            className="min-w-[120px]"
          >
            إضافة السؤال
          </Button>,
        ]}
        width={800}
      >
        <div className="space-y-6">
          <Alert
            message={
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span>إضافة سؤال إلى فقرة موجودة</span>
              </div>
            }
            type="info"
            showIcon
          />

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              نص السؤال
            </label>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <ReactQuill
                value={newParagraphQuestionText}
                onChange={setNewParagraphQuestionText}
                modules={quillModules}
                formats={quillFormats}
                className="bg-white min-h-[150px]"
                placeholder="أدخل نص السؤال هنا..."
              />
            </div>
          </div>

          <Divider>
            <span className="text-gray-500 font-medium">خيارات السؤال</span>
          </Divider>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-semibold text-gray-800">
                قم بتحديد الإجابة الصحيحة
              </label>
              <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                اختر إجابة صحيحة واحدة
              </span>
            </div>

            <div className="space-y-4">
              {newParagraphQuestionOptions.map((opt, idx) => (
                <div
                  key={opt.id}
                  className={`p-4 rounded-xl border-2 ${
                    opt.isCorrect
                      ? "border-emerald-300 bg-emerald-50"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        checked={!!opt.isCorrect}
                        onChange={() => {
                          setNewParagraphQuestionOptions((prev) =>
                            (prev || []).map((o, ii) => ({
                              ...o,
                              isCorrect: ii === idx,
                            }))
                          );
                        }}
                        className="w-5 h-5 cursor-pointer"
                      />
                      <span className="font-medium text-gray-700">
                        {opt.isCorrect ? "✓ صحيحة" : "خاطئة"}
                      </span>
                    </div>
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg text-sm font-medium">
                      {String.fromCharCode(1632 + idx + 1)}
                    </span>
                  </div>

                  <div className="grid gap-3">
                    <div>
                      <label className="text-sm text-gray-600 mb-1 block">
                        نص الخيار
                      </label>
                      <div className="border border-gray-200 rounded-lg overflow-hidden">
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
                          className="bg-white min-h-[80px]"
                          placeholder="أدخل نص الخيار..."
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm text-gray-600 mb-1 block">
                        <span className="text-gray-400">(اختياري)</span> الشرح
                      </label>
                      <div className="border border-gray-200 rounded-lg overflow-hidden">
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
                          className="bg-white min-h-[80px]"
                          placeholder="أدخل شرحاً للخيار (اختياري)..."
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
  // Add New Modal (للأسئلة الجديدة كاملة)
  // =========================
  const renderAddNewModal = () => {
    if (!addingNewQuestion) return null;

    return (
      <Modal
        title={
          <div className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            <span>إضافة سؤال جديد</span>
          </div>
        }
        open={addingNewQuestion}
        onCancel={() => {
          setAddingNewQuestion(false);
          setNewQuestionType("mcq");

          // reset paragraph
          setNewParagraphContent("");
          setEditingParagraphQuestions([]);

          // reset mcq
          setNewMCQQuestion("");
          setNewMCQOptions([
            { id: makeTempId("opt"), text: "", explanation: "", isCorrect: true },
            { id: makeTempId("opt"), text: "", explanation: "", isCorrect: false },
            { id: makeTempId("opt"), text: "", explanation: "", isCorrect: false },
            { id: makeTempId("opt"), text: "", explanation: "", isCorrect: false },
          ]);
        }}
        footer={[
          <Button
            key="cancel"
            onClick={() => {
              setAddingNewQuestion(false);
              setNewQuestionType("mcq");
              setNewParagraphContent("");
              setEditingParagraphQuestions([]);
              setNewMCQQuestion("");
            }}
          >
            إلغاء
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={create_question_loading}
            onClick={newQuestionType === "mcq" ? handleAddNewMCQ : handleAddNewPassage}
          >
            {newQuestionType === "mcq" ? "إضافة سؤال MCQ" : "إضافة فقرة جديدة"}
          </Button>,
        ]}
        width={900}
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              نوع السؤال
            </label>
            <div className="flex gap-4">
              <Button
                type={newQuestionType === "mcq" ? "primary" : "default"}
                onClick={() => setNewQuestionType("mcq")}
                className="flex-1"
              >
                <div className="flex flex-col items-center gap-2 py-2">
                  <List className="w-6 h-6" />
                  <span>سؤال MCQ</span>
                </div>
              </Button>
              <Button
                type={newQuestionType === "paragraph" ? "primary" : "default"}
                onClick={() => setNewQuestionType("paragraph")}
                className="flex-1"
              >
                <div className="flex flex-col items-center gap-2 py-2">
                  <FileText className="w-6 h-6" />
                  <span>فقرة مع أسئلة</span>
                </div>
              </Button>
            </div>
          </div>

          {newQuestionType === "mcq" && (
            <div className="space-y-5">
              <AntCard title="نص سؤال MCQ" className="shadow-sm">
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <ReactQuill
                    value={newMCQQuestion}
                    onChange={setNewMCQQuestion}
                    modules={quillModules}
                    formats={quillFormats}
                    className="bg-white min-h-[150px]"
                    placeholder="أدخل نص السؤال هنا..."
                  />
                </div>
              </AntCard>

              <AntCard
                title={
                  <div className="flex items-center justify-between">
                    <span>خيارات السؤال</span>
                    <span className="text-xs text-gray-500">
                      اختر إجابة صحيحة واحدة
                    </span>
                  </div>
                }
                className="shadow-sm"
              >
                <div className="space-y-4">
                  {newMCQOptions.map((opt, idx) => (
                    <div
                      key={opt.id}
                      className={`p-4 rounded-xl border-2 ${
                        opt.isCorrect
                          ? "border-emerald-300 bg-emerald-50"
                          : "border-gray-200 bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            checked={!!opt.isCorrect}
                            onChange={() => {
                              setNewMCQOptions((prev) =>
                                (prev || []).map((o, ii) => ({
                                  ...o,
                                  isCorrect: ii === idx,
                                }))
                              );
                            }}
                            className="w-5 h-5 cursor-pointer"
                          />
                          <span className="font-medium text-gray-700">
                            {opt.isCorrect ? "✓ صحيحة" : "خاطئة"}
                          </span>
                        </div>
                        <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg text-sm font-medium">
                          {String.fromCharCode(1632 + idx + 1)}
                        </span>
                      </div>

                      <div className="grid gap-3">
                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                          <ReactQuill
                            value={opt.text}
                            onChange={(v) => {
                              setNewMCQOptions((prev) => {
                                const copy = [...prev];
                                copy[idx] = { ...copy[idx], text: v };
                                return copy;
                              });
                            }}
                            modules={quillModules}
                            formats={quillFormats}
                            className="bg-white min-h-[90px]"
                            placeholder="نص الخيار..."
                          />
                        </div>

                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                          <ReactQuill
                            value={opt.explanation}
                            onChange={(v) => {
                              setNewMCQOptions((prev) => {
                                const copy = [...prev];
                                copy[idx] = { ...copy[idx], explanation: v };
                                return copy;
                              });
                            }}
                            modules={quillModules}
                            formats={quillFormats}
                            className="bg-white min-h-[90px]"
                            placeholder="شرح (اختياري)..."
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </AntCard>
            </div>
          )}

          {newQuestionType === "paragraph" && (
            <div className="space-y-4">
              <AntCard title="نص الفقرة" className="shadow-sm">
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <ReactQuill
                    value={newParagraphContent}
                    onChange={setNewParagraphContent}
                    modules={quillModules}
                    formats={quillFormats}
                    className="bg-white min-h-[170px]"
                    placeholder="أدخل نص الفقرة هنا..."
                  />
                </div>
              </AntCard>

              <AntCard
                title={
                  <div className="flex items-center justify-between">
                    <span>أسئلة الفقرة</span>
                    <Button
                      type="dashed"
                      icon={<Plus className="w-4 h-4" />}
                      onClick={addNewQuestionToParagraphInEditMode}
                    >
                      إضافة سؤال
                    </Button>
                  </div>
                }
                className="shadow-sm"
              >
                <div className="space-y-4">
                  {editingParagraphQuestions.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      لا توجد أسئلة بعد — اضغط "إضافة سؤال"
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500">
                      سيتم استخدام نفس واجهة التحرير داخل الفقرة بعد الإضافة.
                      (هنا فقط ننشئ الفقرة + الأسئلة)
                    </div>
                  )}
                </div>
              </AntCard>
            </div>
          )}
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
        <p className="mt-4 text-gray-600 text-lg">جاري تحميل الأسئلة...</p>
        <p className="text-sm text-gray-400 mt-2">يرجى الانتظار</p>
      </div>
    );
  }

  // =========================
  // Main Render
  // =========================
  return (
    <Card title="أسئلة الامتحان" icon={FileText} className="p-0 overflow-hidden">
      <div className="p-6">
        {apiQuestions.length === 0 ? (
          <div className="text-center py-16">
            <Empty
              description={
                <div className="space-y-4">
                  <div className="text-2xl font-bold text-gray-700">
                    لا توجد أسئلة
                  </div>
                  <p className="text-gray-500">
                    لم يتم إضافة أي أسئلة إلى هذا القسم بعد
                  </p>
                </div>
              }
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
            <div className="mt-8">
              <Button
                type="primary"
                size="large"
                icon={<Plus className="w-5 h-5" />}
                onClick={() => setAddingNewQuestion(true)}
                className="min-w-[200px]"
              >
                إضافة سؤال جديد
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="p-8 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-3xl border-2 border-indigo-200 shadow-lg">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center text-xl font-bold">
                      {apiQuestions.length}
                    </div>
                    <div>
                      <h2
                        dangerouslySetInnerHTML={{
                          __html: selectedSection?.title || "قسم الامتحان",
                        }}
                        className="text-3xl font-bold text-indigo-900"
                      ></h2>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-lg text-indigo-700">
                          <span className="font-bold">{apiQuestions.length}</span>{" "}
                          سؤال
                        </span>
                        <span className="text-gray-400">•</span>
                        <span className="text-sm text-gray-600">
                          {apiQuestions.filter((q) => q.type === "mcq").length}{" "}
                          MCQ
                        </span>
                        <span className="text-gray-400">•</span>
                        <span className="text-sm text-gray-600">
                          {
                            apiQuestions.filter((q) => q.type === "paragraph_mcq")
                              .length
                          }{" "}
                          فقرة
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    icon={
                      showAllQuestions ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )
                    }
                    onClick={showAllQuestions ? collapseAll : expandAll}
                    size="large"
                    className="min-w-[160px]"
                  >
                    {showAllQuestions ? "إغلاق جميع الأسئلة" : "فتح جميع الأسئلة"}
                  </Button>
                  <Button
                    type="primary"
                    icon={<Plus className="w-4 h-4" />}
                    onClick={() => setAddingNewQuestion(true)}
                    size="large"
                    className="min-w-[160px] bg-green-600 hover:bg-green-700"
                  >
                    إضافة سؤال جديد
                  </Button>
                </div>
              </div>
            </div>

            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              items={[
                {
                  key: "all",
                  label: (
                    <div className="flex items-center gap-2">
                      <List className="w-4 h-4" />
                      جميع الأسئلة
                      <Badge count={apiQuestions.length} color="blue" />
                    </div>
                  ),
                },
                {
                  key: "mcq",
                  label: (
                    <div className="flex items-center gap-2">
                      <List className="w-4 h-4" />
                      أسئلة MCQ
                      <Badge
                        count={apiQuestions.filter((q) => q.type === "mcq").length}
                        color="blue"
                      />
                    </div>
                  ),
                },
                {
                  key: "paragraph",
                  label: (
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      فقرات
                      <Badge
                        count={
                          apiQuestions.filter((q) => q.type === "paragraph_mcq")
                            .length
                        }
                        color="purple"
                      />
                    </div>
                  ),
                },
              ]}
            />

            <div className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">قائمة الأسئلة</h3>
                <div className="text-sm text-gray-500">
                  {Object.values(expandedQuestions).filter(Boolean).length} من{" "}
                  {apiQuestions.length} مفتوح
                </div>
              </div>

              {apiQuestions
                .filter((q) => {
                  if (activeTab === "mcq") return q.type === "mcq";
                  if (activeTab === "paragraph") return q.type === "paragraph_mcq";
                  return true;
                })
                .map((q, index) => {
                  const isExp = isExpanded(q.id, q.type);
                  const typeLabel =
                    q.type === "mcq" ? "سؤال اختيار متعدد" : "فقرة مع أسئلة";

                  return (
                    <div
                      key={`${q.type}-${q.id}`}
                      className={`bg-white overflow-hidden rounded-3xl shadow-xl border-2 transition-all duration-300 ${
                        isExp
                          ? "border-indigo-300 shadow-2xl"
                          : "border-gray-100 hover:border-gray-300"
                      } ${editingQuestionId === q.id ? "ring-4 ring-blue-100" : ""}`}
                    >
                      <div
                        onClick={() => toggleQuestion(q.id, q.type)}
                        className={`flex items-center justify-between p-6 cursor-pointer transition-colors ${
                          isExp
                            ? "bg-gradient-to-r from-blue-50 to-indigo-50"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center gap-5">
                          <div className="relative">
                            <div
                              className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold shadow-lg ${
                                q.type === "mcq"
                                  ? "bg-gradient-to-br from-blue-500 to-cyan-500 text-white"
                                  : "bg-gradient-to-br from-purple-500 to-pink-500 text-white"
                              }`}
                            >
                              {index + 1}
                            </div>
                            {q.type === "paragraph_mcq" && (
                              <Badge
                                count={q.questions?.length || 0}
                                color="purple"
                                className="absolute -top-2 -right-2 shadow-lg"
                              />
                            )}
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-bold text-xl text-gray-900">
                                {typeLabel}
                              </h4>
                              <Tag
                                color={q.type === "mcq" ? "blue" : "purple"}
                                className="text-sm px-3 py-1 rounded-full font-bold"
                              >
                                {q.type === "mcq" ? "MCQ" : "فقرة"}
                              </Tag>
                            </div>
                            <div
                              className="text-sm text-gray-600 line-clamp-2 leading-relaxed"
                              dangerouslySetInnerHTML={{
                                __html:
                                  q.type === "mcq"
                                    ? q.question
                                    : q.paragraphContent || "فقرة نصية مع أسئلة",
                              }}
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-6">
                          <div className="text-right gap-1 !items-center hidden md:!flex">
                            <div className="text-sm text-gray-500">
                              {q.type === "mcq" ? "عدد الخيارات" : "عدد الأسئلة"}
                            </div>
                            <div className="font-bold text-gray-900">
                              {q.type === "mcq"
                                ? q.options.length
                                : q.questions?.length || 0}
                            </div>
                          </div>

                          <div className="flex !flex-row items-center gap-2">
                            {isExp ? (
                              <ChevronUp className="w-6 h-6 text-indigo-600" />
                            ) : (
                              <ChevronDown className="w-6 h-6 text-gray-500" />
                            )}
                            <span className="text-xs text-gray-500">
                              {isExp ? "إغلاق" : "فتح"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {isExp && (
                        <div className="border-t-2 border-gray-100">
                          <div className="p-1">
                            <div className="bg-gradient-to-r from-gray-50 to-white rounded-2xl m-4">
                              {renderQuestionContent(q)}
                            </div>
                          </div>
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
      {renderAddNewModal()}
      {renderAddQuestionToParagraphModal()}

      {/* DELETE MODALS */}
      <Modal
        open={deleteModal}
        onCancel={() => setDeleteModal(false)}
        onOk={handleDeleteAny}
        okText="نعم، احذف"
        cancelText="إلغاء"
        okButtonProps={{
          danger: true,
          loading:
            questionToDelete?.type === "mcq"
              ? delete_question_loading
              : delete_paragraph_loading,
          className: "min-w-[120px]",
        }}
        cancelButtonProps={{
          className: "min-w-[120px]",
        }}
        width={520}
        className="text-center"
      >
        <div className="py-8 px-4">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
            <Trash2 className="w-10 h-10 text-red-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">تأكيد الحذف</h3>
          <p className="text-gray-600 text-base leading-relaxed mb-6">
            هل أنت متأكد من حذف{" "}
            <span className="font-bold text-red-600">
              {questionToDelete?.type === "mcq" ? "هذا السؤال" : "هذه الفقرة"}
            </span>
            ؟
            <br />
            <span className="text-sm text-gray-500 mt-2 block">
              هذا الإجراء لا يمكن التراجع عنه وسيتم حذف جميع البيانات المرتبطة
            </span>
          </p>
        </div>
      </Modal>

      <Modal
        open={!!deleteParagraphModal}
        onCancel={() => setDeleteParagraphModal(false)}
        onOk={handleDeleteParagraphQuestions}
        okText="نعم، احذف السؤال"
        cancelText="إلغاء"
        okButtonProps={{
          danger: true,
          loading: delete_question_loading,
          className: "min-w-[140px]",
        }}
        cancelButtonProps={{
          className: "min-w-[120px]",
        }}
        width={520}
        className="text-center"
      >
        <div className="py-8 px-4">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-orange-100 flex items-center justify-center">
            <AlertCircle className="w-10 h-10 text-orange-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            حذف سؤال من الفقرة
          </h3>
          <p className="text-gray-600 text-base leading-relaxed mb-6">
            سيتم حذف هذا السؤال فقط من الفقرة
            <br />
            <span className="text-sm text-gray-500 mt-2 block">
              باقي الأسئلة في الفقرة ستبقى كما هي
            </span>
          </p>
        </div>
      </Modal>
    </Card>
  );
}