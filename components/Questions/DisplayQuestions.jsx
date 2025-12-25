// "use client";

// import React, { useMemo, useState, useEffect } from "react";
// import { Edit3, Trash2, GripVertical, Save, X, ChevronDown, ChevronUp } from "lucide-react";
// import { Collapse, Empty, Spin, Tag, Button, Modal } from "antd";
// import { useDispatch, useSelector } from "react-redux";
// import { questionTypes } from "./utils";
// import Card from "./ExamCard";
// import dynamic from "next/dynamic";

// // Dynamically import Quill to avoid SSR issues
// const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
// import "quill/dist/quill.snow.css";
// import TabButton from "../ui/TabButton";
// import { handleDeleteExamQuestions, handleGetExamQuestions } from "../../lib/features/examSlice";
// import { toast } from "react-toastify";

// const { Panel } = Collapse;
// const { confirm } = Modal;

// export default function DisplayQuestions({
//   selectedSectionId,
//   setEditingQuestion,
//   editingQuestion,
//   selectedSection
// }) {
//   const dispatch = useDispatch();
//   const { get_exam_questions_list, get_exam_questions_loading, delete_question_loading } = useSelector(state => state?.exam);

//   // State for collapsable panels
//   const [expandedQuestions, setExpandedQuestions] = useState({});

//   // State for editing
//   const [editingQuestionId, setEditingQuestionId] = useState(null);
//   const [editingContent, setEditingContent] = useState("");
//   const [editingOptions, setEditingOptions] = useState([]);
//   const [editingCorrectAnswer, setEditingCorrectAnswer] = useState(0);
//   const [editingParagraphContent, setEditingParagraphContent] = useState("");
//   const [editingParagraphQuestions, setEditingParagraphQuestions] = useState([]);

//   const [deleteModal, setDeleteModal] = useState(false);
//   const [questionToDelete, setQuestionToDelete] = useState(null);
//   const [sectionName , setSectionName] = useState("");
//   // Log to verify if selectedSectionId is set correctly

//   useEffect(() => {
//     console.log("selectedSection" , selectedSection)
//   } ,[selectedSection])

//   useEffect(() => {
//     if (selectedSectionId) {
//       console.log("Fetching questions for section ID:", selectedSectionId);
//       dispatch(handleGetExamQuestions({ body: { exam_section_id: selectedSectionId } }))
//       .unwrap()
//       .then(res => {
//         console.log(res);
//         if(res?.data?.status == "success") {
//           const filtered = res?.data?.message?.filter(item=> item?.id == selectedSectionId)
//           setSectionName(filtered?.title)
//         }
//       })
//     }
//   }, [selectedSectionId, dispatch]);

//   // Initialize all questions as expanded by default
//   useEffect(() => {
//     if (get_exam_questions_list) {
//       const questions = get_exam_questions_list?.data?.message;
//       const initialExpandedState = {};

//       // Process MCQs
//       (questions?.mcq || []).forEach((q, index) => {
//         initialExpandedState[`mcq-${q.id}`] = false; // Default expanded
//       });

//       // Process paragraphs
//       (questions?.paragraphs || []).forEach((p, index) => {
//         initialExpandedState[`paragraph-${p?.paragraph?.id}`] = false; // Default expanded
//       });

//       setExpandedQuestions(initialExpandedState);
//     }
//   }, [get_exam_questions_list]);

//   // Quill configuration
//   const quillModules = {
//     toolbar: [
//       [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
//       ['bold', 'italic', 'underline', 'strike'],
//       [{ 'list': 'ordered'}, { 'list': 'bullet' }],
//       [{ 'script': 'sub'}, { 'script': 'super' }],
//       [{ 'indent': '-1'}, { 'indent': '+1' }],
//       [{ 'direction': 'rtl' }],
//       [{ 'size': ['small', false, 'large', 'huge'] }],
//       [{ 'color': [] }, { 'background': [] }],
//       [{ 'font': [] }],
//       [{ 'align': [] }],
//       ['clean'],
//       ['formula', 'link', 'image']
//     ],
//   };

//   const quillFormats = [
//     'header',
//     'bold', 'italic', 'underline', 'strike',
//     'list', 'bullet', 'indent',
//     'script',
//     'direction',
//     'size',
//     'color', 'background',
//     'font',
//     'align',
//     'formula', 'link', 'image'
//   ];

//   // UseMemo to process the API data into the desired format
//   const apiQuestions = useMemo(() => {
//     if (!get_exam_questions_list) return [];
//     const apiResponse = get_exam_questions_list;

//     const apiData = apiResponse?.data?.message;
//     // Process MCQs
//     const mcqQuestions = (apiData?.mcq || []).map((q) => {
//       const options = q?.options || [];
//       const correctIndex = options?.findIndex((opt) => Number(opt?.is_correct) === 1);

//       return {
//         id: q.id,
//         type: "mcq",
//         question: q?.question_text || "",
//         exam_section_id: q?.exam_section_id,
//         instructions: q?.instructions || "Instructions",
//         correctAnswer: correctIndex >= 0 ? correctIndex : 0,
//         options: options?.map((opt) => ({
//           id: opt?.id,
//           text: opt?.option_text || "",
//           explanation: opt?.question_explanation || "",
//           is_correct: opt?.is_correct || 0,
//         })),
//         rawData: q // Keep original data for editing
//       };
//     });

//     // Process paragraph questions
//     const paragraphQuestions = (apiData?.paragraphs || []).map((p) => ({
//       id: p?.paragraph.id,
//       type: "paragraph_mcq",
//       paragraphContent: p?.paragraph?.paragraph_content || "",
//       questions: p?.questions?.map((q) => ({
//         id: q?.id,
//         questionText: q?.question_text || "",
//         instructions: q?.instructions || "Choose the correct answer",
//         options: (q?.options || []).map((opt) => ({
//           id: opt?.id,
//           text: opt?.option_text || "",
//           explanation: opt?.question_explanation || "",
//           isCorrect: opt?.is_correct === 1 ? true : false,
//         })),
//         rawData: q
//       })),
//       rawData: p
//     }));

//     return [...mcqQuestions, ...paragraphQuestions];
//   }, [get_exam_questions_list]);

//   // Toggle question expansion
//   const toggleQuestion = (questionId, questionType = 'mcq') => {
//     const key = `${questionType === 'mcq' ? 'mcq' : 'paragraph'}-${questionId}`;
//     setExpandedQuestions(prev => ({
//       ...prev,
//       [key]: !prev[key]
//     }));
//   };

//   // Check if question is expanded
//  // Check if question is expanded
// const isQuestionExpanded = (questionId, questionType = 'mcq') => {
//   const key = `${questionType === 'mcq' ? 'mcq' : 'paragraph'}-${questionId}`;
//   return expandedQuestions[key] === true; // Only true if explicitly set to true
// };

//   // Function to delete a question
//   const handleDeleteQuestion = () => {
//     if (!questionToDelete) return;

//     dispatch(handleDeleteExamQuestions({
//       body: {
//         id: questionToDelete.id
//       }
//     }))
//     .unwrap()
//     .then(res => {
//       console.log(res);
//       if (res?.data?.status === "success") {
//         // Refresh questions list
//         toast.success(res?.data?.message);
//         dispatch(handleGetExamQuestions({ body: { exam_section_id: selectedSectionId } }));
//         setDeleteModal(false);
//         setQuestionToDelete(null);
//       }else {
//         toast.error(res?.data?.message);
//       }
//     })
//     .catch(error => {
//       console.error("Delete error:", error);
//     });
//   };

//   // Function to cancel editing
//   const cancelEditing = () => {
//     setEditingQuestionId(null);
//     setEditingContent("");
//     setEditingOptions([]);
//     setEditingCorrectAnswer(0);
//     setEditingParagraphContent("");
//     setEditingParagraphQuestions([]);
//   };

//   // Function to save edited question
//   const saveEditedQuestion = (questionId, questionType) => {
//     // Implement save logic here
//     console.log("Save edited question:", { questionId, questionType });
//     cancelEditing();
//   };

//   // Update an option in editing mode
//   const updateEditingOption = (index, field, value) => {
//     const newOptions = [...editingOptions];
//     newOptions[index] = { ...newOptions[index], [field]: value };
//     setEditingOptions(newOptions);
//   };

//   // Render question content based on type with editing capabilities
//   const renderQuestionContent = (q) => {
//     // If this question is being edited
//     if (editingQuestionId === q.id) {
//       if (q.type === "mcq") {
//         return (
//           <div className="space-y-4">
//             {/* Question Text Editor */}
//             <div className="space-y-2">
//               <label className="text-sm font-medium text-gray-700">نص السؤال</label>
//               <ReactQuill
//                 value={editingContent}
//                 onChange={setEditingContent}
//                 modules={quillModules}
//                 formats={quillFormats}
//                 className="bg-white rounded-lg"
//                 style={{ minHeight: '150px' }}
//               />
//             </div>

//             {/* Options Editor */}
//             <div className="space-y-3">
//               <label className="text-sm font-medium text-gray-700">خيارات الإجابة</label>
//               {editingOptions.map((option, idx) => (
//                 <div key={idx} className="border rounded-lg p-3 space-y-2">
//                   <div className="flex items-center justify-between">
//                     <label className="flex items-center space-x-2 space-x-reverse">
//                       <input
//                         type="radio"
//                         checked={editingCorrectAnswer === idx}
//                         onChange={() => setEditingCorrectAnswer(idx)}
//                         className="h-4 w-4 text-blue-600"
//                       />
//                       <span>الإجابة الصحيحة</span>
//                     </label>
//                     <span className="text-xs bg-gray-100 px-2 py-1 rounded">
//                       {String.fromCharCode(1632 + (idx + 1))}
//                     </span>
//                   </div>

//                   <div className="space-y-2">
//                     <label className="text-xs text-gray-600">نص الخيار</label>
//                     <ReactQuill
//                       value={option.text}
//                       onChange={(value) => updateEditingOption(idx, 'text', value)}
//                       modules={quillModules}
//                       formats={quillFormats}
//                       className="bg-white rounded-lg"
//                       style={{ minHeight: '80px' }}
//                     />
//                   </div>

//                   <div className="space-y-2">
//                     <label className="text-xs text-gray-600">شرح الخيار</label>
//                     <ReactQuill
//                       value={option.explanation}
//                       onChange={(value) => updateEditingOption(idx, 'explanation', value)}
//                       modules={quillModules}
//                       formats={quillFormats}
//                       className="bg-white rounded-lg"
//                       style={{ minHeight: '80px' }}
//                     />
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Action Buttons */}
//             <div className="flex justify-end space-x-2 space-x-reverse pt-4 border-t">
//               <TabButton
//                 onClick={cancelEditing}
//                 className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
//               >
//                 <X className="w-4 h-4 ml-1" />
//                 إلغاء
//               </TabButton>
//               <Button
//                 onClick={() => saveEditedQuestion(q.id, q.type)}
//                 className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//                 loading={delete_question_loading}
//               >
//                 <Save className="w-4 h-4 ml-1" />
//                 حفظ التعديلات
//               </Button>
//             </div>
//           </div>
//         );
//       }

//       if (q.type === "paragraph_mcq") {
//         return (
//           <div className="space-y-4">
//             {/* Paragraph Content Editor */}
//             <div className="space-y-2">
//               <label className="text-sm font-medium text-gray-700">محتوى الفقرة</label>
//               <ReactQuill
//                 value={editingParagraphContent}
//                 onChange={setEditingParagraphContent}
//                 modules={quillModules}
//                 formats={quillFormats}
//                 className="bg-white rounded-lg"
//                 style={{ minHeight: '150px' }}
//               />
//             </div>

//             {/* Questions Editor */}
//             {editingParagraphQuestions.map((pq, pIdx) => (
//               <div key={pIdx} className="border rounded-lg p-4 space-y-3">
//                 <div className="space-y-2">
//                   <label className="text-sm font-medium text-gray-700">سؤال {pIdx + 1}</label>
//                   <ReactQuill
//                     value={pq.questionText}
//                     onChange={(value) => {
//                       const newQuestions = [...editingParagraphQuestions];
//                       newQuestions[pIdx].questionText = value;
//                       setEditingParagraphQuestions(newQuestions);
//                     }}
//                     modules={quillModules}
//                     formats={quillFormats}
//                     className="bg-white rounded-lg"
//                     style={{ minHeight: '100px' }}
//                   />
//                 </div>

//                 {/* Options for this question */}
//                 <div className="space-y-3">
//                   <label className="text-sm font-medium text-gray-700">خيارات السؤال</label>
//                   {pq.options.map((option, oIdx) => (
//                     <div key={oIdx} className="border rounded p-3 space-y-2">
//                       <div className="flex items-center justify-between">
//                         <label className="flex items-center space-x-2 space-x-reverse">
//                           <input
//                             type="radio"
//                             checked={option.isCorrect}
//                             onChange={() => {
//                               const newQuestions = [...editingParagraphQuestions];
//                               newQuestions[pIdx].options = newQuestions[pIdx].options.map((opt, idx) => ({
//                                 ...opt,
//                                 isCorrect: idx === oIdx
//                               }));
//                               setEditingParagraphQuestions(newQuestions);
//                             }}
//                             className="h-4 w-4 text-blue-600"
//                           />
//                           <span>الإجابة الصحيحة</span>
//                         </label>
//                         <span className="text-xs bg-gray-100 px-2 py-1 rounded">
//                           {String.fromCharCode(1632 + (oIdx + 1))}
//                         </span>
//                       </div>

//                       <div className="space-y-2">
//                         <label className="text-xs text-gray-600">نص الخيار</label>
//                         <ReactQuill
//                           value={option.text}
//                           onChange={(value) => {
//                             const newQuestions = [...editingParagraphQuestions];
//                             newQuestions[pIdx].options[oIdx].text = value;
//                             setEditingParagraphQuestions(newQuestions);
//                           }}
//                           modules={quillModules}
//                           formats={quillFormats}
//                           className="bg-white rounded-lg"
//                           style={{ minHeight: '80px' }}
//                         />
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             ))}

//             {/* Action Buttons */}
//             <div className="flex justify-end space-x-2 space-x-reverse pt-4 border-t">
//               <Button
//                 onClick={cancelEditing}
//                 className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
//               >
//                 <X className="w-4 h-4 ml-1" />
//                 إلغاء
//               </Button>
//               <Button
//                 onClick={() => saveEditedQuestion(q.id, q.type)}
//                 className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//                 loading={delete_question_loading}
//               >
//                 <Save className="w-4 h-4 ml-1" />
//                 حفظ التعديلات
//               </Button>
//             </div>
//           </div>
//         );
//       }
//     }

//     // Normal view (not editing)
//     if (q.type === "mcq") {
//       return (
//         <div className="space-y-3">
//           <div className="flex justify-between items-start mb-2">
//             <div className="flex-1">
//               <div
//                 className="text-[13px] text-gray-800 leading-6 mb-3"
//                 dangerouslySetInnerHTML={{__html : q?.question}}
//               />
//             </div>
//             <div className="flex space-x-2 space-x-reverse mr-2">
//               <button
//                 onClick={() => setEditingQuestion(q)}
//                 className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
//                 title="تعديل السؤال"
//               >
//                 <Edit3 className="w-4 h-4" />
//               </button>
//               <button
//                 onClick={() => {
//                   setQuestionToDelete(q);
//                   setDeleteModal(true);
//                 }}
//                 className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
//                 title="حذف السؤال"
//                 disabled={delete_question_loading}
//               >
//                 <Trash2 className="w-4 h-4" />
//               </button>
//             </div>
//           </div>

//           <div className="grid gap-2">
//             {q.options.map((option, idx) => {
//               const isCorrect = idx === q.correctAnswer;
//               return (
//                 <div
//                   key={idx}
//                   className={`rounded-lg border px-3 py-2 text-[12px] ${
//                     isCorrect
//                       ? "bg-emerald-50 border-emerald-200 text-emerald-800"
//                       : "bg-gray-50 border-gray-200 text-gray-700"
//                   }`}
//                 >
//                   <div
//                     dangerouslySetInnerHTML={{__html : `${String.fromCharCode(1632 + (idx + 1))}. ${option?.text}`}}
//                     className="font-medium"
//                   />
//                   {option.explanation && (
//                     <div
//                       dangerouslySetInnerHTML={{__html : `Explanation: ${option.explanation}`}}
//                       className="mt-1 text-[12px] text-gray-600"
//                     />
//                   )}
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       );
//     }

//     if (q.type === "paragraph_mcq") {
//       return (
//         <div className="space-y-3">
//           <div className="flex justify-between items-start mb-2">
//             <div className="flex-1">
//               <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 mb-3">
//                 <div className="text-[12px] font-semibold text-blue-800 mb-1">Paragraph:</div>
//                 <div
//                   className="text-[12px] text-blue-700 leading-6"
//                   dangerouslySetInnerHTML={{__html : q.paragraphContent}}
//                 />
//               </div>
//             </div>
//             <div className="flex space-x-2 space-x-reverse mr-2">
//               <button
//                 onClick={() => setEditingQuestion(q)}
//                 className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
//                 title="تعديل الفقرة والأسئلة"
//               >
//                 <Edit3 className="w-4 h-4" />
//               </button>
//               <button
//                 onClick={() => {
//                   setQuestionToDelete(q);
//                   setDeleteModal(true);
//                 }}
//                 className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
//                 title="حذف الفقرة والأسئلة"
//                 disabled={delete_question_loading}
//               >
//                 <Trash2 className="w-4 h-4" />
//               </button>
//             </div>
//           </div>

//           {q.questions.map((question, idx) => (
//             <div key={idx} className="space-y-3">
//               <div className="flex justify-between items-start">
//                 <h2 className="font-bold text-lg">أسئله القطعه</h2>
//                 <div className="flex-1">
//                   <p
//                     className="text-[13px] text-gray-800 leading-6 mb-2"
//                     dangerouslySetInnerHTML={{__html : question.questionText}}
//                   />
//                 </div>
//               </div>
//               <div className="grid gap-2">
//                 {question.options.map((option, i) => {
//                   const isCorrect = option.isCorrect;
//                   return (
//                     <div
//                       key={i}
//                       className={`rounded-lg border px-3 py-2 text-[12px] ${
//                         isCorrect
//                           ? "bg-emerald-50 border-emerald-200 text-emerald-800"
//                           : "bg-gray-50 border-gray-200 text-gray-700"
//                       }`}
//                     >
//                       <div
//                         className="font-medium"
//                         dangerouslySetInnerHTML={{__html : `${String.fromCharCode(1632 + (i + 1))}. ${option?.text}`}}
//                       />
//                       {option.explanation && (
//                         <div
//                           dangerouslySetInnerHTML={{__html :` Explanation: ${option.explanation}`}}
//                           className="mt-1 text-[12px] text-gray-600"
//                         />
//                       )}
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           ))}
//         </div>
//       );
//     }

//     return (
//       <div className="flex justify-between items-start">
//         <div className="flex-1">
//           <p className="text-[13px] text-gray-800" dangerouslySetInnerHTML={{__html : q.question}}></p>
//         </div>
//         <div className="flex space-x-2 space-x-reverse mr-2">
//           <button
//             onClick={() => setEditingQuestion(q)}
//             className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
//             title="تعديل السؤال"
//           >
//             <Edit3 className="w-4 h-4" />
//           </button>
//           <button
//             onClick={() => {
//               setQuestionToDelete(q);
//               setDeleteModal(true);
//             }}
//             className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
//             title="حذف السؤال"
//             disabled={delete_question_loading}
//           >
//             <Trash2 className="w-4 h-4" />
//           </button>
//         </div>
//       </div>
//     );
//   };

//   if (get_exam_questions_loading) {
//     return (
//       <div className="h-screen flex justify-center items-center">
//         <Spin spinning size="large" />
//       </div>
//     );
//   }

//   return (
//     <Card title="Exam Questions" icon={Edit3}>
//       {apiQuestions.length === 0 ? (
//         <Empty description="No questions available for this section" />
//       ) : (
//         <div className="space-y-4">
//           <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
//             <div className="flex items-center justify-between">
//               <div>
//                 <h3
//                 dangerouslySetInnerHTML={{__html : `Section ${sectionName}`}}
//                 className="font-semibold text-blue-800"></h3>
//                 <p className="text-sm text-blue-600">Total Questions: {apiQuestions.length}</p>
//               </div>
//               <Tag color="blue" className="!m-0">
//                 {selectedSectionId}
//               </Tag>
//             </div>
//           </div>

//           <div className="space-y-3">
//             {apiQuestions.map((q, index) => {
//               console.log(q);
//               const typeLabel = q?.type == "mcq" ? "MCQ" : "Paragraph" || "Question";
//               const subTag = q.mcqSubType && q.mcqSubType !== "general" ? q.mcqSubType === "chemical" ? "Chemical" : "Passage" : null;
//               const isExpanded = isQuestionExpanded(q.id, q.type);

//               return (
//                 <div
//                   key={q.id}
//                   className="rounded-2xl border bg-white shadow-sm transition-all hover:shadow-md"
//                 >
//                   {/* Collapsible Header */}
//                   <div
//                     className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 rounded-t-2xl transition-colors"
//                     onClick={() => toggleQuestion(q.id, q.type)}
//                   >
//                     <div className="flex items-center gap-2">
//                       <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold">
//                         {index + 1}
//                       </span>
//                       <Tag color="blue" className="!m-0 !text-[11px]">
//                         {typeLabel}
//                       </Tag>
//                       {subTag && (
//                         <Tag color="purple" className="!m-0 !text-[11px]">
//                           {subTag}
//                         </Tag>
//                       )}
//                     </div>
//                   </div>

//                   {/* Collapsible Content */}
//                   {isExpanded && (
//                     <div className="p-4 pt-0 border-t">
//                       <div className="mt-3">{renderQuestionContent(q)}</div>
//                     </div>
//                   )}
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       )}

//       {/* Delete Confirmation Modal */}
//       <Modal
//         open={deleteModal}
//         onCancel={() => {
//           setDeleteModal(false);
//           setQuestionToDelete(null);
//         }}
//         onOk={handleDeleteQuestion}
//         okText="حذف"
//         cancelText="إلغاء"
//         okButtonProps={{ className: "!bg-red-500 hover:!bg-red-600" }}
//         confirmLoading={delete_question_loading}
//       >
//         <div className="text-center py-4">
//           <Trash2 className="w-12 h-12 text-red-500 mx-auto mb-4" />
//           <h2 className="text-lg font-semibold mb-2">هل أنت متأكد من حذف السؤال؟</h2>
//           <p className="text-gray-600">
//             هذا الإجراء لا يمكن التراجع عنه. سيتم حذف السؤال نهائياً.
//           </p>
//         </div>
//       </Modal>
//     </Card>
//   );
// }

// "use client";

// import React, { useMemo, useState, useEffect } from "react";
// import { Edit3, Trash2, Save, X, ChevronDown, ChevronUp } from "lucide-react";
// import { Empty, Spin, Tag, Button, Modal } from "antd";
// import { useDispatch, useSelector } from "react-redux";
// import dynamic from "next/dynamic";
// import Card from "./ExamCard";
// import {
//   handleDeleteExamQuestions,
//   handleGetExamQuestions,
// } from "../../lib/features/examSlice";
// import { toast } from "react-toastify";

// const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
// import "react-quill-new/dist/quill.snow.css";
// import MathTypeEditor from "../MathTypeEditor/MathTypeEditor";

// const { confirm } = Modal;

// export default function DisplayQuestions({
//   selectedSectionId,
//   setEditingQuestion,
//   selectedSection,
// }) {
//   const dispatch = useDispatch();
//   const {
//     get_exam_questions_list,
//     get_exam_questions_loading,
//     delete_question_loading,
//   } = useSelector((state) => state?.exam);

//   const [expandedQuestions, setExpandedQuestions] = useState({});
//   const [editingQuestionId, setEditingQuestionId] = useState(null);
//   const [editingContent, setEditingContent] = useState("");
//   const [editingOptions, setEditingOptions] = useState([]);
//   const [editingCorrectAnswer, setEditingCorrectAnswer] = useState(0);
//   const [editingParagraphContent, setEditingParagraphContent] = useState("");
//   const [editingParagraphQuestions, setEditingParagraphQuestions] = useState(
//     []
//   );

//   const [deleteModal, setDeleteModal] = useState(false);
//   const [questionToDelete, setQuestionToDelete] = useState(null);
//   const [sectionName, setSectionName] = useState("");

//   useEffect(() => {
//     console.log("selectedSection", selectedSection);
//   }, [selectedSection]);

//   useEffect(() => {
//     if (get_exam_questions_list) {
//       const initial = {};
//       (get_exam_questions_list?.data?.message?.mcq || []).forEach(
//         (q) => (initial[`mcq-${q.id}`] = false)
//       );
//       (get_exam_questions_list?.data?.message?.paragraphs || []).forEach(
//         (p) => (initial[`paragraph-${p.paragraph.id}`] = false)
//       );
//       setExpandedQuestions(initial);
//     }
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

//   const apiQuestions = useMemo(() => {
//     if (!get_exam_questions_list && !selectedSection) return [];
//     const data = get_exam_questions_list?.data?.message || {
//       mcq: [],
//       paragraphs: [],
//     };
//     const mcqs = (
//       data?.mcq && data?.mcq?.length
//         ? data?.mcq
//         : selectedSection?.mcq && selectedSection?.mcq?.length
//         ? selectedSection?.mcq
//         : []
//     ).map((q) => {
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
//           text: opt.option_text || "",
//           explanation: opt.question_explanation || "",
//         })),
//         rawData: q,
//       };
//     });
//     console.log(
//       "get_exam_questions_list--------",
//       data?.mcq && data?.mcq?.length
//         ? data?.mcq
//         : selectedSection?.mcq && selectedSection?.mcq?.length
//         ? selectedSection?.mcq
//         : []
//     );
//     const paragraphs = (selectedSection?.paragraphs || []).map((p) => ({
//       id: p.paragraph.id,
//       type: "paragraph_mcq",
//       paragraphContent: p.paragraph.paragraph_content || "",
//       questions: p.questions.map((q) => ({
//         questionText: q.question_text || "",
//         options: (q.options || []).map((opt) => ({
//           text: opt.option_text || "",
//           explanation: opt.question_explanation || "",
//           isCorrect: opt.is_correct === 1,
//         })),
//       })),
//       rawData: p,
//     }));

//     return [...mcqs, ...paragraphs];
//   }, [get_exam_questions_list, selectedSection]);

//   const toggleQuestion = (id, type) => {
//     const key = `${type === "mcq" ? "mcq" : "paragraph"}-${id}`;
//     setExpandedQuestions((prev) => ({ ...prev, [key]: !prev[key] }));
//   };

//   const isExpanded = (id, type) =>
//     expandedQuestions[`${type === "mcq" ? "mcq" : "paragraph"}-${id}`] || false;

//   const startEditing = (q) => {
//     setEditingQuestionId(q.id);
//     if (q.type === "mcq") {
//       setEditingContent(q.question);
//       setEditingOptions(q.options.map((opt) => ({ ...opt })));
//       setEditingCorrectAnswer(q.correctAnswer);
//     } else if (q.type === "paragraph_mcq") {
//       setEditingParagraphContent(q.paragraphContent);
//       setEditingParagraphQuestions(
//         q.questions.map((pq) => ({
//           questionText: pq.questionText,
//           options: pq.options.map((opt) => ({ ...opt })),
//         }))
//       );
//     }
//     setEditingQuestion(q);
//   };

//   const cancelEditing = () => {
//     setEditingQuestionId(null);
//     setEditingContent("");
//     setEditingOptions([]);
//     setEditingCorrectAnswer(0);
//     setEditingParagraphContent("");
//     setEditingParagraphQuestions([]);
//     setEditingQuestion(null);
//   };

//   const handleDeleteQuestion = () => {
//     console.log("questionToDelete" , questionToDelete)
//     if (!questionToDelete) return;
//     dispatch(handleDeleteExamQuestions({ body: { id: questionToDelete.id } }))
//       .unwrap()
//       .then((res) => {
//         if (res?.data?.status === "success") {
//           toast.success("تم حذف السؤال بنجاح");
//           dispatch(
//             handleGetExamQuestions({
//               body: { exam_section_id: selectedSectionId },
//             })
//           );
//         } else {
//           toast.error(res?.data?.message || "فشل الحذف");
//         }
//       })
//       .finally(() => {
//         setDeleteModal(false);
//         setQuestionToDelete(null);
//       });
//   };

//   const renderQuestionContent = (q) => {
//     const isEditing = editingQuestionId === q.id;

//     if (isEditing) {
//       // Editing mode - clean and spacious
//       return (
//         <div className="space-y-8 py-6">
//           {q.type === "mcq" ? (
//             <>
//               <div>
//                 <label className="block text-sm font-semibold text-gray-800 mb-3">
//                   نص السؤال
//                 </label>
//                 <ReactQuill
//                   value={editingContent}
//                   onChange={setEditingContent}
//                   modules={quillModules}
//                   formats={quillFormats}
//                   className="bg-white"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-gray-800 mb-4">
//                   الخيارات
//                 </label>
//                 <div className="space-y-5">
//                   {editingOptions.map((opt, idx) => (
//                     <div
//                       key={idx}
//                       className="p-5 bg-gray-50 border border-gray-200 rounded-xl"
//                     >
//                       <div className="flex items-center gap-4 mb-4">
//                         <input
//                           type="radio"
//                           checked={editingCorrectAnswer === idx}
//                           onChange={() => setEditingCorrectAnswer(idx)}
//                           className="w-5 h-5 text-blue-600"
//                         />
//                         <span className="font-medium text-gray-700">
//                           الإجابة الصحيحة
//                         </span>
//                         <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg text-sm font-medium">
//                           {String.fromCharCode(1632 + idx + 1)}
//                         </span>
//                       </div>
//                       <div className="space-y-4">
//                         <div>
//                           <label className="text-sm text-gray-600 mb-2 block">
//                             نص الخيار
//                           </label>
//                           {/* <MathTypeEditor
//                             editorData={opt.text}
//                             setEditorData={(data) => {
//                               const newOpts = [...editingOptions];
//                               newOpts[idx].text = data;
//                               setEditingOptions(newOpts);
//                             }}
//                           /> */}
//                           <ReactQuill
//                             value={opt.text}
//                             onChange={v => {
//                               const newOpts = [...editingOptions];
//                               newOpts[idx].text = v;
//                               setEditingOptions(newOpts);
//                             }}
//                             modules={quillModules}
//                             formats={quillFormats}
//                           />
//                         </div>
//                         <div>
//                           <label className="text-sm text-gray-600 mb-2 block">
//                             الشرح (اختياري)
//                           </label>
//                           <ReactQuill
//                             value={opt.explanation}
//                             onChange={(v) => {
//                               const newOpts = [...editingOptions];
//                               newOpts[idx].explanation = v;
//                               setEditingOptions(newOpts);
//                             }}
//                             modules={quillModules}
//                             formats={quillFormats}
//                           />
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </>
//           ) : (
//             // Paragraph editing mode - similar spacious layout (omitted for brevity, follow same pattern)
//             <div>Paragraph editing UI goes here with same padding style...</div>
//           )}

//           <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
//             <Button
//               onClick={cancelEditing}
//               size="large"
//               icon={<X className="w-5 h-5" />}
//             >
//               إلغاء
//             </Button>
//             <Button
//               type="primary"
//               size="large"
//               icon={<Save className="w-5 h-5" />}
//               loading={delete_question_loading}
//             >
//               حفظ التعديلات
//             </Button>
//           </div>
//         </div>
//       );
//     }

//     // Normal display mode
//     return (
//       <div className="space-y-8 px-2">
//         {/* Paragraph (if applicable) */}
//         {q.type === "paragraph_mcq" && (
//           <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl">
//             <h4 className="font-bold text-blue-900 mb-4 text-lg">الفقرة</h4>
//             <div
//               dangerouslySetInnerHTML={{ __html: q.paragraphContent }}
//               className="text-gray-800 leading-relaxed text-base"
//             />
//           </div>
//         )}

//         {/* Questions */}
//         {(q.type === "mcq"
//           ? [
//               {
//                 questionText: q.question,
//                 options: q.options,
//                 correctAnswer: q.correctAnswer,
//               },
//             ]
//           : q.questions
//         ).map((item, qIdx) => (
//           <div key={qIdx} className="space-y-5">
//             {q.type === "paragraph_mcq" && (
//               <h4 className="font-bold text-gray-900 text-lg">
//                 سؤال {qIdx + 1}
//               </h4>
//             )}
//             {q.type === "paragraph_mcq" && (
//               <div
//                 dangerouslySetInnerHTML={{ __html: item.questionText }}
//                 className="text-gray-800 leading-relaxed text-base mb-4"
//               />
//             )}
//             {q.type === "mcq" && (
//               <div
//                 dangerouslySetInnerHTML={{ __html: item.questionText }}
//                 className="text-gray-800 leading-relaxed text-base mb-5"
//               />
//             )}

//             <div className="grid gap-4">
//               {item.options.map((opt, oIdx) => {
//                 const isCorrect =
//                   q.type === "mcq" ? oIdx === q.correctAnswer : opt.isCorrect;
//                 return (
//                   <div
//                     key={oIdx}
//                     className={`p-5 rounded-xl border-2 transition-all ${
//                       isCorrect
//                         ? "bg-emerald-50 border-emerald-300 shadow-sm"
//                         : "bg-white border-gray-200 hover:border-gray-300"
//                     }`}
//                   >
//                     <div className="flex items-start gap-3">
//                       <span className="font-bold text-lg text-gray-700 mt-1">
//                         {String.fromCharCode(1632 + oIdx + 1)}.
//                       </span>
//                       <div className="flex-1">
//                         <div
//                           dangerouslySetInnerHTML={{ __html: opt.text }}
//                           className="font-medium text-gray-800 leading-relaxed"
//                         />
//                         {opt.explanation && (
//                           <div className="mt-3 pt-3 border-t border-gray-200">
//                             <span className="text-sm font-medium text-gray-600">
//                               الشرح:
//                             </span>
//                             <div
//                               dangerouslySetInnerHTML={{
//                                 __html: opt.explanation,
//                               }}
//                               className="text-sm text-gray-600 mt-1 leading-relaxed"
//                             />
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         ))}

//         {/* Action Buttons */}
//         <div className="flex justify-end gap-4 pt-8 border-t border-gray-200">
//           <Button
//             size="large"
//             icon={<Edit3 className="w-5 h-5" />}
//             type="primary"
//             ghost
//             onClick={() => startEditing(q)}
//           >
//             تعديل
//           </Button>
//           <Button
//             size="large"
//             icon={<Trash2 className="w-5 h-5" />}
//             danger
//             onClick={() => {
//               setQuestionToDelete(q);
//               setDeleteModal(true);
//             }}
//             loading={delete_question_loading}
//           >
//             حذف
//           </Button>
//         </div>
//       </div>
//     );
//   };

//   if (get_exam_questions_loading) {
//     return (
//       <div className="flex flex-col items-center justify-center py-32">
//         <Spin size="large" />
//         <p className="mt-4 text-gray-600">جاري تحميل الأسئلة...</p>
//       </div>
//     );
//   }

//   return (
//     <Card title="أسئلة الامتحان" icon={Edit3} className="p-0">
//       <div className="p-6">
//         {" "}
//         {/* Main container padding */}
//         {apiQuestions.length === 0 ? (
//           <Empty description="لا توجد أسئلة في هذا القسم بعد" />
//         ) : (
//           <div className="space-y-8">
//             {/* Section Info Card */}
//             <div className="p-8 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-3xl border border-indigo-200 shadow-sm">
//               <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//                 <div>
//                   <div className="flex gap-1 items-center">
//                     {/* <h2 className="text-3xl font-bold text-indigo-900">قسم </h2> */}
//                     <h2
//                       className="text-3xl font-bold text-indigo-900"
//                       dangerouslySetInnerHTML={{
//                         __html: ` ${selectedSection?.title}`,
//                       }}
//                     />
//                   </div>
//                   <p className="text-lg text-indigo-700 mt-2">
//                     عدد الأسئلة:{" "}
//                     <span className="font-bold">{apiQuestions.length}</span>
//                   </p>
//                 </div>
//                 {/* <Tag color="indigo" className="text-base px-5 py-2">معرف القسم: {selectedSectionId}</Tag> */}
//               </div>
//             </div>

//             {/* Questions List */}
//             <div className="space-y-6">
//               {apiQuestions.map((q, index) => {
//                 console.log("q", q);
//                 const isExp = isExpanded(q.id, q.type);
//                 const typeLabel =
//                   q.type == "mcq" ? "سؤال اختيار متعدد" : "فقرة مع أسئلة";

//                 return (
//                   <div
//                     key={q.id}
//                     className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden transition-all hover:shadow-xl"
//                   >
//                     {/* Header */}
//                     <div
//                       onClick={() => toggleQuestion(q.id, q.type)}
//                       className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50 transition-colors"
//                     >
//                       <div className="flex items-center gap-5">
//                         <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center text-xl font-bold shadow-md">
//                           {index + 1}
//                         </div>
//                         <div>
//                           <div className="font-bold text-xl text-gray-900">
//                             {typeLabel}
//                           </div>
//                           <div
//                             className="text-sm text-gray-600 mt-1 line-clamp-2"
//                             dangerouslySetInnerHTML={{
//                               __html:
//                                 q.type === "mcq"
//                                   ? q.question
//                                   : q.paragraphContent ||
//                                     q.questions[0]?.questionText ||
//                                     "فقرة",
//                             }}
//                           />
//                         </div>
//                       </div>

//                       <div className="flex items-center gap-4">
//                         <Tag
//                           color={q.type === "mcq" ? "blue" : "purple"}
//                           className="text-sm px-4 py-1"
//                         >
//                           {q.type === "mcq" ? "MCQ" : "فقرة"}
//                         </Tag>
//                         {isExp ? (
//                           <ChevronUp className="w-6 h-6 text-gray-500" />
//                         ) : (
//                           <ChevronDown className="w-6 h-6 text-gray-500" />
//                         )}
//                       </div>
//                     </div>

//                     {/* Content */}
//                     {isExp && (
//                       <div className="border-t border-gray-200 px-8 pb-8 pt-6 bg-gray-50/50">
//                         {renderQuestionContent(q)}
//                       </div>
//                     )}
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Delete Modal */}
//       <Modal
//         open={deleteModal}
//         onCancel={() => setDeleteModal(false)}
//         onOk={handleDeleteQuestion}
//         okText="حذف نهائياً"
//         cancelText="إلغاء"
//         okButtonProps={{ danger: true, loading: delete_question_loading }}
//         width={500}
//       >
//         <div className="text-center py-10">
//           <Trash2 className="w-20 h-20 text-red-500 mx-auto mb-6" />
//           <h3 className="text-2xl font-bold text-gray-900 mb-4">تأكيد الحذف</h3>
//           <p className="text-gray-600 text-lg leading-relaxed">
//             هل أنت متأكد من حذف هذا{" "}
//             {questionToDelete?.type === "mcq" ? "السؤال" : "الفقرة مع أسئلتها"}؟
//             <br />
//             <strong className="text-red-600">هذا الإجراء لا رجعة فيه</strong>.
//           </p>
//         </div>
//       </Modal>
//     </Card>
//   );
// }


// "use client";

// import React, { useMemo, useState, useEffect } from "react";
// import { Edit3, Trash2, Save, X, ChevronDown, ChevronUp } from "lucide-react";
// import { Empty, Spin, Tag, Button, Modal } from "antd";
// import { useDispatch, useSelector } from "react-redux";
// import dynamic from "next/dynamic";
// import Card from "./ExamCard";
// import {
//   handleDeleteExamQuestions,
//   handleGetExamQuestions,
//   handleUpdateExamQuestions,
//   handleEditParagraph,
//   handleDeleteParagraph,
// } from "../../lib/features/examSlice";
// import { toast } from "react-toastify";

// const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
// import "react-quill-new/dist/quill.snow.css";
// // import MathTypeEditor from "../MathTypeEditor/MathTypeEditor";

// export default function DisplayQuestions({
//   selectedSectionId,
//   setEditingQuestion,
//   selectedSection,
// }) {
//   const dispatch = useDispatch();

//   const {
//     get_exam_questions_list,
//     get_exam_question_loading, // ✅ correct from slice
//     delete_question_loading,
//     edit_question_loading,
//     edit_paragraph_loading,
//     delete_paragraph_loading,
//   } = useSelector((state) => state?.exam);

//   const [expandedQuestions, setExpandedQuestions] = useState({});

//   const [editingQuestionId, setEditingQuestionId] = useState(null);
//   const [editingType, setEditingType] = useState(null); // "mcq" | "paragraph_mcq"

//   // MCQ editing
//   const [editingContent, setEditingContent] = useState("");
//   const [editingOptions, setEditingOptions] = useState([]);
//   const [editingCorrectAnswer, setEditingCorrectAnswer] = useState(0);

//   // Paragraph editing
//   const [editingParagraphContent, setEditingParagraphContent] = useState("");
//   const [editingParagraphQuestions, setEditingParagraphQuestions] = useState([]);


//   // Delete modal
//   const [deleteParagraphModal , setDeleteParagraphModal] = useState(false);
//   const [deleteQuestionModal , setDeleteQuestionModal] = useState(false);
//   const [deleteModal, setDeleteModal] = useState(false);
//   const [questionToDelete, setQuestionToDelete] = useState(null);

//   useEffect(() => {
//     if (get_exam_questions_list) {
//       const initial = {};
//       (get_exam_questions_list?.data?.message?.mcq || []).forEach(
//         (q) => (initial[`mcq-${q.id}`] = false)
//       );
//       (get_exam_questions_list?.data?.message?.paragraphs || []).forEach(
//         (p) => (initial[`paragraph-${p.paragraph.id}`] = false)
//       );
//       setExpandedQuestions(initial);
//     }
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
//           ? selectedSection?.mcq
//           : [];

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

//     // ✅ use API paragraphs if exists, fallback to selectedSection
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

//   const toggleQuestion = (id, type) => {
//     const key = `${type === "mcq" ? "mcq" : "paragraph"}-${id}`;
//     setExpandedQuestions((prev) => ({ ...prev, [key]: !prev[key] }));
//   };

//   const isExpanded = (id, type) =>
//     expandedQuestions[`${type === "mcq" ? "mcq" : "paragraph"}-${id}`] || false;

//   const startEditing = (q) => {
//     setEditingQuestionId(q.id);
//     setEditingType(q.type);

//     if (q.type === "mcq") {
//       setEditingContent(q.question);
//       setEditingOptions(q.options.map((opt) => ({ ...opt })));
//       setEditingCorrectAnswer(q.correctAnswer);
//     } else if (q.type === "paragraph_mcq") {
//       setEditingParagraphContent(q.paragraphContent);
//       setEditingParagraphQuestions(
//         q.questions.map((pq) => ({
//           id: pq.id,
//           questionText: pq.questionText,
//           options: pq.options.map((opt) => ({ ...opt })),
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

//   // ✅ Save MCQ alone
//   const handleSaveMCQ = async (q) => {
//     const payload = {
//       id: q.id,
//       question_text: editingContent,
//       options: editingOptions.map((opt, idx) => ({
//         id: opt?.id, // keep if backend needs
//         option_text: opt?.text || "",
//         question_explanation: opt?.explanation || "",
//         is_correct: editingCorrectAnswer === idx ? 1 : 0,
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

//   // ✅ Save Paragraph alone (paragraph + its questions/options)
//   const handleSaveParagraph = async (q) => {
//     console.log(q, editingParagraphQuestions);

//     const payload = {
//       id:q?.id,
//       question_text : q?.questionText,
//       "instructions": "Read carefully before answering",
//       mcq_array: q?.options?.map((pq) => ({
//         answer: pq?.text,
//         correct_or_not: pq?.isCorrect ?"1" :"0",
//         question_explanation : pq?.explanation
//         // id: pq?.id,
//         // question_text: pq?.questionText || "",
//         // options: (pq?.options || []).map((opt) => ({
//         //   id: opt?.id,
//         //   option_text: opt?.text || "",
//         //   question_explanation: opt?.explanation || "",
//         //   is_correct: opt?.isCorrect ? 1 : 0,
//         // })),
//       })),
//       // paragraph_id: q.id,
//       // paragraph_content: editingParagraphContent,
//       // questions: editingParagraphQuestions.map((pq) => ({
//       //   id: pq?.id,
//       //   question_text: pq?.questionText || "",
//       //   options: (pq?.options || []).map((opt) => ({
//       //     id: opt?.id,
//       //     option_text: opt?.text || "",
//       //     question_explanation: opt?.explanation || "",
//       //     is_correct: opt?.isCorrect ? 1 : 0,
//       //   })),
//       // })),
//     };

//     // 🛡️ small safe-guard: make sure each paragraph question has one correct option
//     // const invalid = payload.questions.some((qq) => {
//     //   const correctCount = (qq.options || []).filter((o) => Number(o.is_correct) === 1).length;
//     //   return correctCount !== 1;
//     // });
//     // if (invalid) {
//     //   toast.error("لازم تختار إجابة صحيحة واحدة لكل سؤال داخل الفقرة");
//     //   return;
//     // }

//     try {
//       const res = await dispatch(handleUpdateExamQuestions({ body: payload })).unwrap();
//       if (res?.data?.status === "success") {
//         toast.success("تم تعديل أسئلة الفقرة بنجاح");
//         refreshQuestions();
//         cancelEditing();
//       } else {
//         toast.error(res?.error?.response?.data?.message || res?.error?.message || "فشل تعديل أسئلة الفقرة");
//       }
//     } catch (e) {
//       toast.error("حصل خطأ أثناء تعديل الفقرة");
//     }
//   };
  
//   const handleDeleteParagraphQuestions = async () => {
//     if (!deleteParagraphModal) return;
   
//      const res = await dispatch(
//           handleDeleteExamQuestions({ body: { id: deleteParagraphModal?.id } })
//         ).unwrap();

//         if (res?.data?.status === "success") {
//           toast.success("تم حذف السؤال بنجاح");
//           refreshQuestions();
//           setDeleteParagraphModal(false);
//         } else {
//           toast.error(res?.error?.response?.data?.message ||res?.data?.message || "فشل الحذف");
//         }

//     // try {
//     //   if (questionToDelete.type === "mcq") {
//     //     const res = await dispatch(
//     //       handleDeleteExamQuestions({ body: { id: questionToDelete.id } })
//     //     ).unwrap();

//     //     if (res?.data?.status === "success") {
//     //       toast.success("تم حذف السؤال بنجاح");
//     //       refreshQuestions();
//     //     } else {
//     //       toast.error(res?.data?.message || "فشل الحذف");
//     //     }
//     //   } else {
//     //     // paragraph
//     //     const res = await dispatch(
//     //       handleDeleteParagraph({
//     //         body: { paragraph_id: questionToDelete.id, id: questionToDelete.id },
//     //       })
//     //     ).unwrap();

//     //     if (res?.data?.status === "success") {
//     //       toast.success("تم حذف الفقرة بنجاح");
//     //       refreshQuestions();
//     //     } else {
//     //       toast.error(res?.data?.message || "فشل الحذف");
//     //     }
//     //   }
//     // } catch (e) {
//     //   toast.error("حصل خطأ أثناء الحذف");
//     // } finally {
//     //   setDeleteModal(false);
//     //   setQuestionToDelete(null);
//     // }
//   };

//   // ✅ Delete MCQ alone OR Paragraph alone
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
//         // paragraph
//         const res = await dispatch(
//           handleDeleteParagraph({
//             body: {  id: questionToDelete.id },
//           })
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
//     const data_send = {
//       id: q?.id,
//       paragraph_content: editingParagraphContent
//     }

//     dispatch(handleEditParagraph({ body: data_send }))
//       .unwrap()
//       .then(res => {
//         if (res?.data?.status === "success") {
//           toast.success(res?.data?.message || "تم تعديل الفقرة بنجاح");
//           refreshQuestions();
//           cancelEditing();
//         } else {
//           toast.error(res?.data?.message || "فشل تعديل الفقرة");
//         }
//       }).catch(e => console.log(e))

//   }

//   const renderQuestionContent = (q) => {
//     const isEditing = editingQuestionId === q.id;

//     if (isEditing) {
//       const isMCQ = q.type === "mcq";
//       const isParagraph = q.type === "paragraph_mcq";

//       return (
//         <div className="space-y-8 py-6">
//           {/* ============ MCQ EDIT UI ============ */}
//           {isMCQ && (
//             <>
//               <div>
//                 <label className="block text-sm font-semibold text-gray-800 mb-3">
//                   نص السؤال
//                 </label>
//                 <ReactQuill
//                   value={editingContent}
//                   onChange={setEditingContent}
//                   modules={quillModules}
//                   formats={quillFormats}
//                   className="bg-white"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-gray-800 mb-4">
//                   الخيارات
//                 </label>
//                 <div className="space-y-5">
//                   {editingOptions.map((opt, idx) => (
//                     <div
//                       key={opt?.id ?? idx}
//                       className="p-5 bg-gray-50 border border-gray-200 rounded-xl"
//                     >
//                       <div className="flex items-center gap-4 mb-4">
//                         <input
//                           type="radio"
//                           checked={editingCorrectAnswer === idx}
//                           onChange={() => setEditingCorrectAnswer(idx)}
//                           className="w-5 h-5 text-blue-600"
//                         />
//                         <span className="font-medium text-gray-700">
//                           الإجابة الصحيحة
//                         </span>
//                         <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg text-sm font-medium">
//                           {String.fromCharCode(1632 + idx + 1)}
//                         </span>
//                       </div>

//                       <div className="space-y-4">
//                         <div>
//                           <label className="text-sm text-gray-600 mb-2 block">
//                             نص الخيار
//                           </label>
//                           <ReactQuill
//                             value={opt.text}
//                             onChange={(v) => {
//                               setEditingOptions((prev) => {
//                                 const copy = [...prev];
//                                 copy[idx] = { ...copy[idx], text: v };
//                                 return copy;
//                               });
//                             }}
//                             modules={quillModules}
//                             formats={quillFormats}
//                           />
//                         </div>

//                         <div>
//                           <label className="text-sm text-gray-600 mb-2 block">
//                             الشرح (اختياري)
//                           </label>
//                           <ReactQuill
//                             value={opt.explanation}
//                             onChange={(v) => {
//                               setEditingOptions((prev) => {
//                                 const copy = [...prev];
//                                 copy[idx] = { ...copy[idx], explanation: v };
//                                 return copy;
//                               });
//                             }}
//                             modules={quillModules}
//                             formats={quillFormats}
//                           />
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </>
//           )}

//           {/* ============ PARAGRAPH EDIT UI ============ */}
//           {isParagraph && (
//             <>
//               <div className="p-6 bg-white border border-gray-200 rounded-2xl">
//                 <label className="block text-sm font-semibold text-gray-800 mb-3">
//                   نص الفقرة
//                 </label>
//                 <ReactQuill
//                   value={editingParagraphContent}
//                   onChange={setEditingParagraphContent}
//                   modules={quillModules}
//                   formats={quillFormats}
//                   className="bg-white"
//                 />

//                <div className="flex gap-2 items-center">
//                  <button
//                   onClick={() => handleEditParagraphContent(q)}
//                   className="bg-blue-600 w-full flex justify-center items-start text-white p-3 rounded-md">
//                   {edit_paragraph_loading ? "جاري تعديل نص الفقرة...." : "تعديل نص الفقرة"}
//                 </button>

//                 <button
//                   onClick={() => setQuestionToDelete({
//                     type:"paragraph",
//                     id: q?.id
//                   })}
//                   className="bg-red-600 w-full flex justify-center items-start text-white p-3 rounded-md">
//                   {delete_paragraph_loading ? "جاري حذف نص الفقرة...." : "تعديل حذف الفقرة"}
//                 </button>
//                </div>
//               </div>

//               <div className="space-y-6">
//                 <label className="block text-sm font-semibold text-gray-800">
//                   أسئلة الفقرة
//                 </label>

//                 {editingParagraphQuestions.map((pq, qIdx) => (
//                   <div className="flex flex-col gap-2">
//                     <div
//                       key={pq?.id ?? qIdx}
//                       className="p-6 bg-gray-50 border border-gray-200 rounded-2xl space-y-5"
//                     >
//                       <div className="flex items-center justify-between">
//                         <h4 className="font-bold text-gray-900 text-lg">
//                           سؤال {qIdx + 1}
//                         </h4>
//                       </div>

//                       <div>
//                         <label className="text-sm text-gray-600 mb-2 block">
//                           نص السؤال
//                         </label>
//                         <ReactQuill
//                           value={pq.questionText}
//                           onChange={(v) => {
//                             setEditingParagraphQuestions((prev) => {
//                               const copy = [...prev];
//                               copy[qIdx] = { ...copy[qIdx], questionText: v };
//                               return copy;
//                             });
//                           }}
//                           modules={quillModules}
//                           formats={quillFormats}
//                           className="bg-white"
//                         />
//                       </div>

//                       <div className="space-y-4">
//                         <label className="text-sm font-semibold text-gray-800">
//                           الخيارات
//                         </label>

//                         {(pq.options || []).map((opt, oIdx) => (
//                           <div
//                             key={opt?.id ?? oIdx}
//                             className="p-5 bg-white border border-gray-200 rounded-xl"
//                           >
//                             <div className="flex items-center gap-4 mb-4">
//                               <input
//                                 type="radio"
//                                 checked={!!opt.isCorrect}
//                                 onChange={() => {
//                                   setEditingParagraphQuestions((prev) => {
//                                     const copy = [...prev];
//                                     const qCopy = { ...copy[qIdx] };
//                                     qCopy.options = qCopy.options.map((o, ii) => ({
//                                       ...o,
//                                       isCorrect: ii === oIdx,
//                                     }));
//                                     copy[qIdx] = qCopy;
//                                     return copy;
//                                   });
//                                 }}
//                                 className="w-5 h-5 text-blue-600"
//                               />
//                               <span className="font-medium text-gray-700">
//                                 الإجابة الصحيحة
//                               </span>
//                               <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg text-sm font-medium">
//                                 {String.fromCharCode(1632 + oIdx + 1)}
//                               </span>
//                             </div>

//                             <div className="space-y-4">
//                               <div>
//                                 <label className="text-sm text-gray-600 mb-2 block">
//                                   نص الخيار
//                                 </label>
//                                 <ReactQuill
//                                   value={opt.text}
//                                   onChange={(v) => {
//                                     setEditingParagraphQuestions((prev) => {
//                                       const copy = [...prev];
//                                       const qCopy = { ...copy[qIdx] };
//                                       const opts = [...(qCopy.options || [])];
//                                       opts[oIdx] = { ...opts[oIdx], text: v };
//                                       qCopy.options = opts;
//                                       copy[qIdx] = qCopy;
//                                       return copy;
//                                     });
//                                   }}
//                                   modules={quillModules}
//                                   formats={quillFormats}
//                                   className="bg-white"
//                                 />
//                               </div>

//                               <div>
//                                 <label className="text-sm text-gray-600 mb-2 block">
//                                   الشرح (اختياري)
//                                 </label>
//                                 <ReactQuill
//                                   value={opt.explanation}
//                                   onChange={(v) => {
//                                     setEditingParagraphQuestions((prev) => {
//                                       const copy = [...prev];
//                                       const qCopy = { ...copy[qIdx] };
//                                       const opts = [...(qCopy.options || [])];
//                                       opts[oIdx] = {
//                                         ...opts[oIdx],
//                                         explanation: v,
//                                       };
//                                       qCopy.options = opts;
//                                       copy[qIdx] = qCopy;
//                                       return copy;
//                                     });
//                                   }}
//                                   modules={quillModules}
//                                   formats={quillFormats}
//                                   className="bg-white"
//                                 />
//                               </div>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     </div>

//                     <div className="flex gap-2 items-center">
//                       <Button
//                       type="primary"
//                       size="large"
//                       icon={<Save className="w-5 h-5" />}
//                       loading={
//                          edit_paragraph_loading
//                       }
//                       onClick={() =>  handleSaveParagraph(pq)}
//                     >
//                      {edit_question_loading ?"جاري التعديل.....":" تعديل أسئله الفقرة"} 
//                     </Button>

//                     <Button
//                       type="danger"
//                       size="large"
//                       icon={<Trash2 className="w-5 h-5" />}
                     
//                       className="!bg-red-500 text-white p-2 rounded-md"
//                       onClick={() =>  setDeleteParagraphModal(pq)}
//                     >
//                      حذف السؤال
//                     </Button>
//                     </div>
//                   </div>

//                 ))}
//               </div>
//             </>
//           )}

//           {/* Actions */}
//           <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
//             <Button
//               onClick={cancelEditing}
//               size="large"
//               icon={<X className="w-5 h-5" />}
//             >
//               إلغاء
//             </Button>

//             {q.type === "mcq" &&
//               <Button
//                 type="primary"
//                 size="large"
//                 icon={<Save className="w-5 h-5" />}
//                 loading={
//                   q.type === "mcq" ? edit_question_loading : edit_paragraph_loading
//                 }
//                 onClick={() => (q.type === "mcq" ? handleSaveMCQ(q) : handleSaveParagraph(q))}
//               >
//                 حفظ التعديلات
//               </Button>
//             }
//           </div>
//         </div>
//       );
//     }

//     // Normal display mode
//     return (
//       <div className="space-y-8 px-2">
//         {/* Paragraph (if applicable) */}
//         {q.type === "paragraph_mcq" && (
//           <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl">
//             <h4 className="font-bold text-blue-900 mb-4 text-lg">الفقرة</h4>
//             <div
//               dangerouslySetInnerHTML={{ __html: q.paragraphContent }}
//               className="text-gray-800 leading-relaxed text-base"
//             />
//           </div>
//         )}

//         {/* Questions */}
//         {(q.type === "mcq"
//           ? [
//             {
//               questionText: q.question,
//               options: q.options,
//               correctAnswer: q.correctAnswer,
//             },
//           ]
//           : q.questions
//         ).map((item, qIdx) => (
//           <div key={qIdx} className="space-y-5">
//             {q.type === "paragraph_mcq" && (
//               <h4 className="font-bold text-gray-900 text-lg">
//                 سؤال {qIdx + 1}
//               </h4>
//             )}

//             <div
//               dangerouslySetInnerHTML={{ __html: item.questionText }}
//               className="text-gray-800 leading-relaxed text-base mb-5"
//             />

//             <div className="grid gap-4">
//               {item.options.map((opt, oIdx) => {
//                 const isCorrect =
//                   q.type === "mcq"
//                     ? oIdx === q.correctAnswer
//                     : !!opt.isCorrect;

//                 return (
//                   <div
//                     key={opt?.id ?? oIdx}
//                     className={`p-5 rounded-xl border-2 transition-all ${isCorrect
//                         ? "bg-emerald-50 border-emerald-300 shadow-sm"
//                         : "bg-white border-gray-200 hover:border-gray-300"
//                       }`}
//                   >
//                     <div className="flex items-start gap-3">
//                       <span className="font-bold text-lg text-gray-700 mt-1">
//                         {String.fromCharCode(1632 + oIdx + 1)}.
//                       </span>
//                       <div className="flex-1">
//                         <div
//                           dangerouslySetInnerHTML={{ __html: opt.text }}
//                           className="font-medium text-gray-800 leading-relaxed"
//                         />
//                         {opt.explanation && (
//                           <div className="mt-3 pt-3 border-t border-gray-200">
//                             <span className="text-sm font-medium text-gray-600">
//                               الشرح:
//                             </span>
//                             <div
//                               dangerouslySetInnerHTML={{
//                                 __html: opt.explanation,
//                               }}
//                               className="text-sm text-gray-600 mt-1 leading-relaxed"
//                             />
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         ))}

//         {/* Action Buttons */}
//         <div className="flex justify-end gap-4 pt-8 border-t border-gray-200">
//           <Button
//             size="large"
//             icon={<Edit3 className="w-5 h-5" />}
//             type="primary"
//             ghost
//             onClick={() => startEditing(q)}
//           >
//             تعديل
//           </Button>

//           { q.type === "mcq" && <Button
//             size="large"
//             icon={<Trash2 className="w-5 h-5" />}
//             danger
//             onClick={() => {
//              setQuestionToDelete(q);
//                setDeleteModal(true);
//             }}
//             loading={
//                 delete_question_loading 
//             }
//           >
//             حذف
//           </Button>}
//         </div>
//       </div>
//     );
//   };

//   if (get_exam_question_loading) {
//     return (
//       <div className="flex flex-col items-center justify-center py-32">
//         <Spin size="large" />
//         <p className="mt-4 text-gray-600">جاري تحميل الأسئلة...</p>
//       </div>
//     );
//   }

//   return (
//     <Card title="أسئلة الامتحان" icon={Edit3} className="p-0">
//       <div className="p-6">
//         {apiQuestions.length === 0 ? (
//           <Empty description="لا توجد أسئلة في هذا القسم بعد" />
//         ) : (
//           <div className="space-y-8">
//             {/* Section Info Card */}
//             <div className="p-8 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-3xl border border-indigo-200 shadow-sm">
//               <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//                 <div>
//                   <div className="flex gap-1 items-center">
//                     <h2
//                       className="text-3xl font-bold text-indigo-900"
//                       dangerouslySetInnerHTML={{
//                         __html: ` ${selectedSection?.title}`,
//                       }}
//                     />
//                   </div>
//                   <p className="text-lg text-indigo-700 mt-2">
//                     عدد الأسئلة:{" "}
//                     <span className="font-bold">{apiQuestions.length}</span>
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* Questions List */}
//             <div className="space-y-6">
//               {apiQuestions.map((q, index) => {
//                 const isExp = isExpanded(q.id, q.type);
//                 const typeLabel =
//                   q.type === "mcq" ? "سؤال اختيار متعدد" : "فقرة مع أسئلة";

//                 return (
//                   <div
//                     key={`${q.type}-${q.id}`}
//                     className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden transition-all hover:shadow-xl"
//                   >
//                     {/* Header */}
//                     <div
//                       onClick={() => toggleQuestion(q.id, q.type)}
//                       className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50 transition-colors"
//                     >
//                       <div className="flex items-center gap-5">
//                         <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center text-xl font-bold shadow-md">
//                           {index + 1}
//                         </div>

//                         <div>
//                           <div className="font-bold text-xl text-gray-900">
//                             {typeLabel}
//                           </div>
//                           <div
//                             className="text-sm text-gray-600 mt-1 line-clamp-2"
//                             dangerouslySetInnerHTML={{
//                               __html:
//                                 q.type === "mcq"
//                                   ? q.question
//                                   : q.paragraphContent ||
//                                   q.questions?.[0]?.questionText ||
//                                   "فقرة",
//                             }}
//                           />
//                         </div>
//                       </div>

//                       <div className="flex items-center gap-4">
//                         <Tag
//                           color={q.type === "mcq" ? "blue" : "purple"}
//                           className="text-sm px-4 py-1"
//                         >
//                           {q.type === "mcq" ? "MCQ" : "فقرة"}
//                         </Tag>
//                         {isExp ? (
//                           <ChevronUp className="w-6 h-6 text-gray-500" />
//                         ) : (
//                           <ChevronDown className="w-6 h-6 text-gray-500" />
//                         )}
//                       </div>
//                     </div>

//                     {/* Content */}
//                     {isExp && (
//                       <div className="border-t border-gray-200 px-8 pb-8 pt-6 bg-gray-50/50">
//                         {renderQuestionContent(q)}
//                       </div>
//                     )}
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Delete Modal */}
//       <Modal
//         open={deleteModal}
//         onCancel={() => setDeleteModal(false)}
//         onOk={handleDeleteAny}
//         okText="حذف نهائياً"
//         cancelText="إلغاء"
//         okButtonProps={{
//           danger: true,
//           loading:
//             questionToDelete?.type === "mcq"
//               ? delete_question_loading
//               : delete_paragraph_loading,
//         }}
//         width={500}
//       >
//         <div className="text-center py-10">
//           <Trash2 className="w-20 h-20 text-red-500 mx-auto mb-6" />
//           <h3 className="text-2xl font-bold text-gray-900 mb-4">تأكيد الحذف</h3>
//           <p className="text-gray-600 text-lg leading-relaxed">
//             هل أنت متأكد من حذف هذا{" "}
//             {questionToDelete?.type === "mcq" ? "السؤال" : "الفقرة مع أسئلتها"}؟
//             <br />
//             <strong className="text-red-600">هذا الإجراء لا رجعة فيه</strong>.
//           </p>
//         </div>
//       </Modal>

//       <Modal
//         open={deleteParagraphModal}
//         onCancel={() => setDeleteParagraphModal(false)}
//         onOk={handleDeleteParagraphQuestions}
//         okText="حذف نهائياً"
//         cancelText="إلغاء"
//         okButtonProps={{
//           danger: true,
//           loading:
//                delete_question_loading
//         }}
//         width={500}
//       >
//         <div className="text-center py-10">
//           <Trash2 className="w-20 h-20 text-red-500 mx-auto mb-6" />
//           <h3 className="text-2xl font-bold text-gray-900 mb-4">تأكيد الحذف</h3>
//           <p className="text-gray-600 text-lg leading-relaxed">
//             هل أنت متأكد من حذف هذا{" "}
//              "السؤال"
//             <br />
//             <strong className="text-red-600">هذا الإجراء لا رجعة فيه</strong>.
//           </p>
//         </div>
//       </Modal>
//     </Card>
//   );
// }



"use client";

import React, { useMemo, useState, useEffect } from "react";
import { Edit3, Trash2, Save, X, ChevronDown, ChevronUp } from "lucide-react";
import { Empty, Spin, Tag, Button, Modal, Divider, Tooltip, Space } from "antd";
import { useDispatch, useSelector } from "react-redux";
import dynamic from "next/dynamic";
import Card from "./ExamCard";
import {
  handleDeleteExamQuestions,
  handleGetExamQuestions,
  handleUpdateExamQuestions,
  handleEditParagraph,
  handleDeleteParagraph,
} from "../../lib/features/examSlice";
import { toast } from "react-toastify";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
import "react-quill-new/dist/quill.snow.css";

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
  } = useSelector((state) => state?.exam);

  const [expandedQuestions, setExpandedQuestions] = useState({});

  const [editingQuestionId, setEditingQuestionId] = useState(null);
  const [editingType, setEditingType] = useState(null);

  // MCQ editing
  const [editingContent, setEditingContent] = useState("");
  const [editingOptions, setEditingOptions] = useState([]);
  const [editingCorrectAnswer, setEditingCorrectAnswer] = useState(0);

  // Paragraph editing
  const [editingParagraphContent, setEditingParagraphContent] = useState("");
  const [editingParagraphQuestions, setEditingParagraphQuestions] = useState([]);

  // Delete modals
  const [deleteParagraphModal, setDeleteParagraphModal] = useState(false); // stores pq object
  const [deleteModal, setDeleteModal] = useState(false); // stores main q object
  const [questionToDelete, setQuestionToDelete] = useState(null);

  useEffect(() => {
    if (get_exam_questions_list) {
      const initial = {};
      (get_exam_questions_list?.data?.message?.mcq || []).forEach(
        (q) => (initial[`mcq-${q.id}`] = false)
      );
      (get_exam_questions_list?.data?.message?.paragraphs || []).forEach(
        (p) => (initial[`paragraph-${p.paragraph.id}`] = false)
      );
      setExpandedQuestions(initial);
    }
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

  const toggleQuestion = (id, type) => {
    const key = `${type === "mcq" ? "mcq" : "paragraph"}-${id}`;
    setExpandedQuestions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const isExpanded = (id, type) =>
    expandedQuestions[`${type === "mcq" ? "mcq" : "paragraph"}-${id}`] || false;

  const startEditing = (q) => {
    setEditingQuestionId(q.id);
    setEditingType(q.type);

    if (q.type === "mcq") {
      setEditingContent(q.question);
      setEditingOptions(q.options.map((opt) => ({ ...opt })));
      setEditingCorrectAnswer(q.correctAnswer);
    } else if (q.type === "paragraph_mcq") {
      setEditingParagraphContent(q.paragraphContent);
      setEditingParagraphQuestions(
        q.questions.map((pq) => ({
          id: pq.id,
          questionText: pq.questionText,
          options: pq.options.map((opt) => ({ ...opt })),
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

  const handleSaveMCQ = async (q) => {
    console.log(q , editingOptions);
    const payload = {
      id: q.id,
      question_text: editingContent,
      instructions: "Read carefully before answering",
      mcq_array: editingOptions?.map((opt, idx) => ({
        answer: opt?.text || "",
        question_explanation: opt?.explanation || "",
        correct_or_not: opt?.isCorrect  ? "1" : "0",
      })),
    };

    try {
      const res = await dispatch(
        handleUpdateExamQuestions({ body: payload })
      ).unwrap();

      if (res?.data?.status === "success") {
        toast.success("تم تعديل السؤال بنجاح");
        refreshQuestions();
        cancelEditing();
      } else {
        toast.error(res?.data?.message || "فشل تعديل السؤال");
      }
    } catch (e) {
      toast.error("حصل خطأ أثناء تعديل السؤال");
    }finally {
      cancelEditing();
    }
  };

  // انت كتبت payload جديد للـ paragraph question update
  const handleSaveParagraph = async (pq) => {
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
      const res = await dispatch(
        handleUpdateExamQuestions({ body: payload })
      ).unwrap();

      if (res?.data?.status === "success") {
        toast.success("تم تعديل أسئلة الفقرة بنجاح");
        refreshQuestions();
      } else {
        toast.error(
          res?.error?.response?.data?.message ||
            res?.error?.message ||
            "فشل تعديل أسئلة الفقرة"
        );
      }
    } catch (e) {
      toast.error("حصل خطأ أثناء تعديل الفقرة");
    } finally {
      cancelEditing();
    }
  };

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
        if(typeof window !== undefined) {
            window.location.reload();
          }
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
          if(typeof window !== undefined) {
            window.location.reload();
          }
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
          if(typeof window !== undefined) {
            window.location.reload();
          }
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

  const renderQuestionContent = (q) => {
    const isEditing = editingQuestionId === q.id;

    if (isEditing) {
      const isMCQ = q.type === "mcq";
      const isParagraph = q.type === "paragraph_mcq";

      return (
        <div className="space-y-6">
          {/* ======= EDIT HEADER BAR ======= */}
          <div className="flex items-center justify-between bg-white border border-gray-200 rounded-2xl p-4">
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-900">
                {isMCQ ? "تعديل سؤال MCQ" : "تعديل فقرة"}
              </span>
              <Tag color={isMCQ ? "blue" : "purple"}>
                {isMCQ ? "MCQ" : "Paragraph"}
              </Tag>
            </div>

            <Space>
              <Button
                onClick={cancelEditing}
                icon={<X className="w-4 h-4" />}
              >
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
            </Space>
          </div>

          {/* ============ MCQ EDIT UI ============ */}
          {isMCQ && (
            <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  نص السؤال
                </label>
                <ReactQuill
                  value={editingContent}
                  onChange={setEditingContent}
                  modules={quillModules}
                  formats={quillFormats}
                  className="bg-white"
                />
              </div>

              <Divider className="!my-2" />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-semibold text-gray-800">
                    الخيارات
                  </label>
                  <span className="text-xs text-gray-500">
                    اختر إجابة صحيحة واحدة
                  </span>
                </div>

                <div className="space-y-4">
                  {editingOptions.map((opt, idx) => (
                    <div
                      key={opt?.id ?? idx}
                      className={`p-5 rounded-2xl border transition-all ${
                        editingCorrectAnswer === idx
                          ? "border-emerald-300 bg-emerald-50"
                          : "border-gray-200 bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            checked={editingCorrectAnswer === idx}
                            onChange={() => setEditingCorrectAnswer(idx)}
                            className="w-5 h-5"
                          />
                          <span className="font-medium text-gray-700">
                            إجابة صحيحة
                          </span>
                        </div>

                        <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg text-sm font-medium">
                          {String.fromCharCode(1632 + idx + 1)}
                        </span>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="text-sm text-gray-600 mb-2 block">
                            نص الخيار
                          </label>
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
                          />
                        </div>

                        <div>
                          <label className="text-sm text-gray-600 mb-2 block">
                            الشرح (اختياري)
                          </label>
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
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ============ PARAGRAPH EDIT UI ============ */}
          {isParagraph && (
            <div className="space-y-6">
              {/* Paragraph content card */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-semibold text-gray-800">
                    نص الفقرة
                  </label>

                  <Space>
                    <Tooltip title="حفظ نص الفقرة فقط">
                      <Button
                        type="primary"
                        loading={edit_paragraph_loading}
                        onClick={() => handleEditParagraphContent(q)}
                      >
                        حفظ الفقرة
                      </Button>
                    </Tooltip>

                    <Tooltip title="حذف الفقرة بالكامل">
                      <Button
                        danger
                        loading={delete_paragraph_loading}
                        onClick={() => {
                          setQuestionToDelete({ type: "paragraph", id: q?.id });
                          setDeleteModal(true);
                        }}
                      >
                        حذف الفقرة
                      </Button>
                    </Tooltip>
                  </Space>
                </div>

                <ReactQuill
                  value={editingParagraphContent}
                  onChange={setEditingParagraphContent}
                  modules={quillModules}
                  formats={quillFormats}
                  className="bg-white"
                />
              </div>

              {/* Paragraph questions list */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-900">أسئلة الفقرة</h3>
                  <span className="text-xs text-gray-500">
                    كل سؤال له خياراته وتحديد إجابة صحيحة
                  </span>
                </div>

                <div className="space-y-5">
                  { editingParagraphQuestions&&  editingParagraphQuestions?.map((pq, qIdx) => (
                    <div
                      key={pq?.id ?? qIdx}
                      className="p-8 rounded-2xl border border-gray-200 bg-gray-50 space-y-5"
                    >
                      {/* Question header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">
                            {qIdx + 1}
                          </div>
                          <div className="font-bold text-gray-900">
                            سؤال داخل الفقرة
                          </div>
                        </div>

                        <Space>
                          <Button
                            type="primary"
                            icon={<Save className="w-4 h-4" />}
                            loading={edit_question_loading}
                            onClick={() => handleSaveParagraph(pq)}
                          >
                            حفظ السؤال
                          </Button>

                          <Button
                            danger
                            icon={<Trash2 className="w-4 h-4" />}
                            onClick={() => setDeleteParagraphModal(pq)}
                          >
                            حذف السؤال
                          </Button>
                        </Space>
                      </div>

                      {/* Question text */}
                      <div>
                        <label className="text-sm text-gray-600 mb-2 block">
                          نص السؤال
                        </label>
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
                          className="bg-white"
                        />
                      </div>

                      {/* Options */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-semibold text-gray-800">
                            الخيارات
                          </label>
                          <span className="text-xs text-gray-500">
                            اختر إجابة صحيحة واحدة
                          </span>
                        </div>

                        {(pq.options || []).map((opt, oIdx) => (
                          <div
                            key={opt?.id ?? oIdx}
                            className={`p-4 rounded-xl border transition-all ${
                              opt.isCorrect
                                ? "border-emerald-300 bg-emerald-50"
                                : "border-gray-200 bg-white"
                            }`}
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
                                      qCopy.options = qCopy.options.map(
                                        (o, ii) => ({
                                          ...o,
                                          isCorrect: ii === oIdx,
                                        })
                                      );
                                      copy[qIdx] = qCopy;
                                      return copy;
                                    });
                                  }}
                                  className="w-5 h-5"
                                />
                                <span className="text-sm text-gray-700">
                                  إجابة صحيحة
                                </span>
                              </div>

                              <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg text-sm font-medium">
                                {String.fromCharCode(1632 + oIdx + 1)}
                              </span>
                            </div>

                            <div className="space-y-3">
                              <div>
                                <label className="text-sm text-gray-600 mb-1 block">
                                  نص الخيار
                                </label>
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
                                  className="bg-white"
                                />
                              </div>

                              <div>
                                <label className="text-sm text-gray-600 mb-1 block">
                                  الشرح (اختياري)
                                </label>
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
                                  className="bg-white"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <Divider className="!my-5" />

                <div className="flex justify-end">
                  <Button onClick={cancelEditing} icon={<X className="w-4 h-4" />}>
                    إغلاق التعديل
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }

    // ====== Normal display mode ======
    return (
      <div className="space-y-8 px-2">
        {q.type === "paragraph_mcq" && (
          <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold text-blue-900 text-lg">الفقرة</h4>
              <Tag color="purple">Paragraph</Tag>
            </div>
            <div
              dangerouslySetInnerHTML={{ __html: q.paragraphContent }}
              className="text-gray-800 leading-relaxed text-base"
            />
          </div>
        )}

        {(q.type === "mcq"
          ? [
              {
                questionText: q.question,
                options: q.options,
                correctAnswer: q.correctAnswer,
              },
            ]
          : q.questions
        ).map((item, qIdx) => (
          <div key={qIdx} className="space-y-5">
            {q.type === "paragraph_mcq" && (
              <div className="flex items-center gap-2">
                <Tag color="geekblue">سؤال</Tag>
                <h4 className="font-bold text-gray-900 text-lg">
                  {qIdx + 1}
                </h4>
              </div>
            )}

            <div
              dangerouslySetInnerHTML={{ __html: item.questionText }}
              className="text-gray-800 leading-relaxed text-base mb-5"
            />

            <div className="grid gap-4">
              {item.options.map((opt, oIdx) => {
                const isCorrect =
                  q.type === "mcq"
                    ? oIdx === q.correctAnswer
                    : !!opt.isCorrect;

                return (
                  <div
                    key={opt?.id ?? oIdx}
                    className={`p-5 rounded-xl border-2 transition-all ${
                      isCorrect
                        ? "bg-emerald-50 border-emerald-300 shadow-sm"
                        : "bg-white border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="font-bold text-lg text-gray-700 mt-1">
                        {String.fromCharCode(1632 + oIdx + 1)}.
                      </span>
                      <div className="flex-1">
                        <div
                          dangerouslySetInnerHTML={{ __html: opt.text }}
                          className="font-medium text-gray-800 leading-relaxed"
                        />
                        {opt.explanation && (
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <span className="text-sm font-medium text-gray-600">
                              الشرح:
                            </span>
                            <div
                              dangerouslySetInnerHTML={{
                                __html: opt.explanation,
                              }}
                              className="text-sm text-gray-600 mt-1 leading-relaxed"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
          <Button
            size="large"
            icon={<Edit3 className="w-5 h-5" />}
            type="primary"
            ghost
            onClick={() => startEditing(q)}
          >
            تعديل
          </Button>

          {q.type === "mcq" && (
            <Button
              size="large"
              icon={<Trash2 className="w-5 h-5" />}
              danger
              onClick={() => {
                setQuestionToDelete(q);
                setDeleteModal(true);
              }}
              loading={delete_question_loading}
            >
              حذف
            </Button>
          )}
        </div>
      </div>
    );
  };

  if (get_exam_question_loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <Spin size="large" />
        <p className="mt-4 text-gray-600">جاري تحميل الأسئلة...</p>
      </div>
    );
  }

  return (
    <Card title="أسئلة الامتحان" icon={Edit3} className="p-0">
      <div className="p-6">
        {apiQuestions.length === 0 ? (
          <Empty description="لا توجد أسئلة في هذا القسم بعد" />
        ) : (
          <div className="space-y-8">
            {/* Section Info */}
            <div className="p-8 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-3xl border border-indigo-200 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2
                    className="text-3xl font-bold text-indigo-900"
                    dangerouslySetInnerHTML={{
                      __html: ` ${selectedSection?.title}`,
                    }}
                  />
                  <p className="text-lg text-indigo-700 mt-2">
                    عدد الأسئلة:{" "}
                    <span className="font-bold">{apiQuestions.length}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Questions */}
            <div className="space-y-6">
              {apiQuestions.map((q, index) => {
                const isExp = isExpanded(q.id, q.type);
                const typeLabel =
                  q.type === "mcq" ? "سؤال اختيار متعدد" : "فقرة مع أسئلة";

                return (
                  <div
                    key={`${q.type}-${q.id}`}
                    className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden transition-all hover:shadow-xl"
                  >
                    {/* Header */}
                    <div
                      onClick={() => toggleQuestion(q.id, q.type)}
                      className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center text-xl font-bold shadow-md">
                          {index + 1}
                        </div>

                        <div>
                          <div className="font-bold text-xl text-gray-900">
                            {typeLabel}
                          </div>
                          <div
                            className="text-sm text-gray-600 mt-1 line-clamp-2"
                            dangerouslySetInnerHTML={{
                              __html:
                                q.type === "mcq"
                                  ? q.question
                                  : q.paragraphContent ||
                                    q.questions?.[0]?.questionText ||
                                    "فقرة",
                            }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <Tag
                          color={q.type === "mcq" ? "blue" : "purple"}
                          className="text-sm px-4 py-1"
                        >
                          {q.type === "mcq" ? "MCQ" : "فقرة"}
                        </Tag>
                        {isExp ? (
                          <ChevronUp className="w-6 h-6 text-gray-500" />
                        ) : (
                          <ChevronDown className="w-6 h-6 text-gray-500" />
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    {isExp && (
                      <div className="border-t border-gray-200 px-8 pb-8 pt-6 bg-gray-50/50">
                        {renderQuestionContent(q)}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Delete main modal */}
      <Modal
        open={deleteModal}
        onCancel={() => setDeleteModal(false)}
        onOk={handleDeleteAny}
        okText="حذف نهائياً"
        cancelText="إلغاء"
        okButtonProps={{
          danger: true,
          loading:
            questionToDelete?.type === "mcq"
              ? delete_question_loading
              : delete_paragraph_loading,
        }}
        width={520}
      >
        <div className="text-center py-8">
          <Trash2 className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-3">تأكيد الحذف</h3>
          <p className="text-gray-600 text-base leading-relaxed">
            هل أنت متأكد من حذف هذا{" "}
            {questionToDelete?.type === "mcq" ? "السؤال" : "الفقرة"}؟
            <br />
            <strong className="text-red-600">هذا الإجراء لا رجعة فيه</strong>.
          </p>
        </div>
      </Modal>

      {/* Delete paragraph question modal */}
      <Modal
        open={!!deleteParagraphModal}
        onCancel={() => setDeleteParagraphModal(false)}
        onOk={handleDeleteParagraphQuestions}
        okText="حذف نهائياً"
        cancelText="إلغاء"
        okButtonProps={{
          danger: true,
          loading: delete_question_loading,
        }}
        width={520}
      >
        <div className="text-center py-8">
          <Trash2 className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-3">تأكيد الحذف</h3>
          <p className="text-gray-600 text-base leading-relaxed">
            هل أنت متأكد من حذف هذا السؤال من الفقرة؟
            <br />
            <strong className="text-red-600">هذا الإجراء لا رجعة فيه</strong>.
          </p>
        </div>
      </Modal>
    </Card>
  );
}
