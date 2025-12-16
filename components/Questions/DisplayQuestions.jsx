// "use client";

// import React, { useMemo, useState, useEffect } from "react";
// import { Edit3, Trash2, GripVertical, Save, X } from "lucide-react";
// import { Collapse, Empty, Spin, Tag, Button, Modal } from "antd";
// import { useDispatch, useSelector } from "react-redux";
// // import { handleGetExamQuestions, handleDeleteQuestion } from "../../lib/features/examSlice";
// import { questionTypes } from "./utils";
// // import Button from "../atoms/Button";
// import Card from "./ExamCard";
// import dynamic from "next/dynamic";

// // Dynamically import Quill to avoid SSR issues
// const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
// import "quill/dist/quill.snow.css";
// import TabButton from "../ui/TabButton";
// import { handleDeleteExamQuestions, handleGetExamQuestions } from "../../lib/features/examSlice";

// const { Panel } = Collapse;
// const { confirm } = Modal;

// export default function DisplayQuestions({
//   selectedSectionId,
//   setEditingQuestion,
//   editingQuestion
// }) {
//   const dispatch = useDispatch();
//   const { get_exam_questions_list, get_exam_questions_loading, delete_question_loading } = useSelector(state => state?.exam);

//   // State for editing
//   const [editingQuestionId, setEditingQuestionId] = useState(null);
//   const [editingContent, setEditingContent] = useState("");
//   const [editingOptions, setEditingOptions] = useState([]);
//   const [editingCorrectAnswer, setEditingCorrectAnswer] = useState(0);
//   const [editingParagraphContent, setEditingParagraphContent] = useState("");
//   const [editingParagraphQuestions, setEditingParagraphQuestions] = useState([]);

//   // Log to verify if selectedSectionId is set correctly
//   useEffect(() => {
//     if (selectedSectionId) {
//       console.log("Fetching questions for section ID:", selectedSectionId);
//       dispatch(handleGetExamQuestions({ body: { exam_section_id: selectedSectionId } }));
//     }
//   }, [selectedSectionId, dispatch]);

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



//   const [deleteModal , setDeleteModal] = useState(false);
//   // Function to delete a question
//   const deleteQuestion = () => {
//    dispatch(handleDeleteExamQuestions({body : {
//     id:  deleteModal?.id
//    }}))
//    .unwrap()
//    .then(res => {
//     console.log(res);
//    })
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
//                 onClick={() =>{
//                   setDeleteModal(q)
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
//                   setDeleteModal(q)
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
//                 <div className="flex-1">
//                   <p 
//                     className="text-[13px] text-gray-800 leading-6 mb-2"
//                     dangerouslySetInnerHTML={{__html : question.questionText}}
//                   />
//                 </div>
//                 <div className="flex space-x-2 space-x-reverse mr-2">
//                   <button
//                     onClick={() => {
//                       setDeleteModal(question)
//                     }}
//                     className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
//                     title="حذف هذا السؤال فقط"
//                     disabled={delete_question_loading}
//                   >
//                     <Trash2 className="w-3 h-3" />
//                   </button>
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
//               setDeleteModal(q)
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
//                 <h3 className="font-semibold text-blue-800">Section {selectedSectionId}</h3>
//                 <p className="text-sm text-blue-600">Total Questions: {apiQuestions.length}</p>
//               </div>
//               <Tag color="blue" className="!m-0">
//                 {selectedSectionId}
//               </Tag>
//             </div>
//           </div>

//           <div className="space-y-3">
//             {apiQuestions.map((q, index) => {
//               const typeLabel = questionTypes.find((t) => t.value === q.type)?.label || "Question";
//               const subTag = q.mcqSubType && q.mcqSubType !== "general" ? q.mcqSubType === "chemical" ? "Chemical" : "Passage" : null;

//               return (
//                 <div 
//                   key={q.id} 
//                   className={`rounded-2xl border bg-white p-4 shadow-sm transition-all hover:shadow-md ${
//                     editingQuestionId === q.id ? 'ring-2 ring-blue-300' : ''
//                   }`}
//                 >
//                   <div className="flex items-center justify-between gap-2 mb-3">
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
                    
//                     {editingQuestionId !== q.id && (
//                       <div className="flex items-center space-x-2 space-x-reverse">
//                         <span className="text-xs text-gray-500">
//                           ID: {q.id}
//                         </span>
//                       </div>
//                     )}
//                   </div>
                  
//                   <div className="mt-3">{renderQuestionContent(q)}</div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       )}

//       <Modal
//       onOk={deleteQuestion}
//       okButtonProps={{className:"!bg-red-500"}}
//       open={deleteModal} onCancel={() => setDeleteModal(false)}>
//         <h2 className="text-center font-medium">هل تريد حذف السؤال؟</h2>
        
//       </Modal>
//     </Card>
//   );
// }

"use client";

import React, { useMemo, useState, useEffect } from "react";
import { Edit3, Trash2, GripVertical, Save, X, ChevronDown, ChevronUp } from "lucide-react";
import { Collapse, Empty, Spin, Tag, Button, Modal } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { questionTypes } from "./utils";
import Card from "./ExamCard";
import dynamic from "next/dynamic";

// Dynamically import Quill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "quill/dist/quill.snow.css";
import TabButton from "../ui/TabButton";
import { handleDeleteExamQuestions, handleGetExamQuestions } from "../../lib/features/examSlice";
import { toast } from "react-toastify";

const { Panel } = Collapse;
const { confirm } = Modal;

export default function DisplayQuestions({
  selectedSectionId,
  setEditingQuestion,
  editingQuestion,
  selectedSection
}) {
  const dispatch = useDispatch();
  const { get_exam_questions_list, get_exam_questions_loading, delete_question_loading } = useSelector(state => state?.exam);

  // State for collapsable panels
  const [expandedQuestions, setExpandedQuestions] = useState({});

  
  // State for editing
  const [editingQuestionId, setEditingQuestionId] = useState(null);
  const [editingContent, setEditingContent] = useState("");
  const [editingOptions, setEditingOptions] = useState([]);
  const [editingCorrectAnswer, setEditingCorrectAnswer] = useState(0);
  const [editingParagraphContent, setEditingParagraphContent] = useState("");
  const [editingParagraphQuestions, setEditingParagraphQuestions] = useState([]);

  const [deleteModal, setDeleteModal] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState(null);
  const [sectionName , setSectionName] = useState("");
  // Log to verify if selectedSectionId is set correctly
  
  useEffect(() => {
    console.log("selectedSection" , selectedSection)
  } ,[selectedSection])

  useEffect(() => {
    if (selectedSectionId) {
      console.log("Fetching questions for section ID:", selectedSectionId);
      dispatch(handleGetExamQuestions({ body: { exam_section_id: selectedSectionId } }))
      .unwrap()
      .then(res => {
        console.log(res);
        if(res?.data?.status == "success") {
          const filtered = res?.data?.message?.filter(item=> item?.id == selectedSectionId)
          setSectionName(filtered?.title)
        }
      })
    }
  }, [selectedSectionId, dispatch]);

  // Initialize all questions as expanded by default
  useEffect(() => {
    if (get_exam_questions_list) {
      const questions = get_exam_questions_list?.data?.message;
      const initialExpandedState = {};
      
      // Process MCQs
      (questions?.mcq || []).forEach((q, index) => {
        initialExpandedState[`mcq-${q.id}`] = true; // Default expanded
      });
      
      // Process paragraphs
      (questions?.paragraphs || []).forEach((p, index) => {
        initialExpandedState[`paragraph-${p?.paragraph?.id}`] = true; // Default expanded
      });
      
      setExpandedQuestions(initialExpandedState);
    }
  }, [get_exam_questions_list]);

  // Quill configuration
  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'direction': 'rtl' }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'font': [] }],
      [{ 'align': [] }],
      ['clean'],
      ['formula', 'link', 'image']
    ],
  };

  const quillFormats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'indent',
    'script',
    'direction',
    'size',
    'color', 'background',
    'font',
    'align',
    'formula', 'link', 'image'
  ];

  // UseMemo to process the API data into the desired format
  const apiQuestions = useMemo(() => {
    if (!get_exam_questions_list) return [];
    const apiResponse = get_exam_questions_list;

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
          id: opt?.id,
          text: opt?.option_text || "",
          explanation: opt?.question_explanation || "",
          is_correct: opt?.is_correct || 0,
        })),
        rawData: q // Keep original data for editing
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
          id: opt?.id,
          text: opt?.option_text || "",
          explanation: opt?.question_explanation || "",
          isCorrect: opt?.is_correct === 1 ? true : false,
        })),
        rawData: q
      })),
      rawData: p
    }));

    return [...mcqQuestions, ...paragraphQuestions];
  }, [get_exam_questions_list]);

  // Toggle question expansion
  const toggleQuestion = (questionId, questionType = 'mcq') => {
    const key = `${questionType === 'mcq' ? 'mcq' : 'paragraph'}-${questionId}`;
    setExpandedQuestions(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Check if question is expanded
  const isQuestionExpanded = (questionId, questionType = 'mcq') => {
    const key = `${questionType === 'mcq' ? 'mcq' : 'paragraph'}-${questionId}`;
    return expandedQuestions[key] !== false; // Default to true if not set
  };

  // Function to delete a question
  const handleDeleteQuestion = () => {
    if (!questionToDelete) return;
    
    dispatch(handleDeleteExamQuestions({
      body: {
        id: questionToDelete.id
      }
    }))
    .unwrap()
    .then(res => {
      console.log(res);
      if (res?.data?.status === "success") {
        // Refresh questions list
        toast.success(res?.data?.message);
        dispatch(handleGetExamQuestions({ body: { exam_section_id: selectedSectionId } }));
        setDeleteModal(false);
        setQuestionToDelete(null);
      }else {
        toast.error(res?.data?.message);
      }
    })
    .catch(error => {
      console.error("Delete error:", error);
    });
  };

  // Function to cancel editing
  const cancelEditing = () => {
    setEditingQuestionId(null);
    setEditingContent("");
    setEditingOptions([]);
    setEditingCorrectAnswer(0);
    setEditingParagraphContent("");
    setEditingParagraphQuestions([]);
  };

  // Function to save edited question
  const saveEditedQuestion = (questionId, questionType) => {
    // Implement save logic here
    console.log("Save edited question:", { questionId, questionType });
    cancelEditing();
  };

  // Update an option in editing mode
  const updateEditingOption = (index, field, value) => {
    const newOptions = [...editingOptions];
    newOptions[index] = { ...newOptions[index], [field]: value };
    setEditingOptions(newOptions);
  };

  // Render question content based on type with editing capabilities
  const renderQuestionContent = (q) => {
    // If this question is being edited
    if (editingQuestionId === q.id) {
      if (q.type === "mcq") {
        return (
          <div className="space-y-4">
            {/* Question Text Editor */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">نص السؤال</label>
              <ReactQuill
                value={editingContent}
                onChange={setEditingContent}
                modules={quillModules}
                formats={quillFormats}
                className="bg-white rounded-lg"
                style={{ minHeight: '150px' }}
              />
            </div>

            {/* Options Editor */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">خيارات الإجابة</label>
              {editingOptions.map((option, idx) => (
                <div key={idx} className="border rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center space-x-2 space-x-reverse">
                      <input
                        type="radio"
                        checked={editingCorrectAnswer === idx}
                        onChange={() => setEditingCorrectAnswer(idx)}
                        className="h-4 w-4 text-blue-600"
                      />
                      <span>الإجابة الصحيحة</span>
                    </label>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {String.fromCharCode(1632 + (idx + 1))}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs text-gray-600">نص الخيار</label>
                    <ReactQuill
                      value={option.text}
                      onChange={(value) => updateEditingOption(idx, 'text', value)}
                      modules={quillModules}
                      formats={quillFormats}
                      className="bg-white rounded-lg"
                      style={{ minHeight: '80px' }}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs text-gray-600">شرح الخيار</label>
                    <ReactQuill
                      value={option.explanation}
                      onChange={(value) => updateEditingOption(idx, 'explanation', value)}
                      modules={quillModules}
                      formats={quillFormats}
                      className="bg-white rounded-lg"
                      style={{ minHeight: '80px' }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-2 space-x-reverse pt-4 border-t">
              <TabButton
                onClick={cancelEditing}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <X className="w-4 h-4 ml-1" />
                إلغاء
              </TabButton>
              <Button
                onClick={() => saveEditedQuestion(q.id, q.type)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                loading={delete_question_loading}
              >
                <Save className="w-4 h-4 ml-1" />
                حفظ التعديلات
              </Button>
            </div>
          </div>
        );
      }

      if (q.type === "paragraph_mcq") {
        return (
          <div className="space-y-4">
            {/* Paragraph Content Editor */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">محتوى الفقرة</label>
              <ReactQuill
                value={editingParagraphContent}
                onChange={setEditingParagraphContent}
                modules={quillModules}
                formats={quillFormats}
                className="bg-white rounded-lg"
                style={{ minHeight: '150px' }}
              />
            </div>

            {/* Questions Editor */}
            {editingParagraphQuestions.map((pq, pIdx) => (
              <div key={pIdx} className="border rounded-lg p-4 space-y-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">سؤال {pIdx + 1}</label>
                  <ReactQuill
                    value={pq.questionText}
                    onChange={(value) => {
                      const newQuestions = [...editingParagraphQuestions];
                      newQuestions[pIdx].questionText = value;
                      setEditingParagraphQuestions(newQuestions);
                    }}
                    modules={quillModules}
                    formats={quillFormats}
                    className="bg-white rounded-lg"
                    style={{ minHeight: '100px' }}
                  />
                </div>

                {/* Options for this question */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-700">خيارات السؤال</label>
                  {pq.options.map((option, oIdx) => (
                    <div key={oIdx} className="border rounded p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="flex items-center space-x-2 space-x-reverse">
                          <input
                            type="radio"
                            checked={option.isCorrect}
                            onChange={() => {
                              const newQuestions = [...editingParagraphQuestions];
                              newQuestions[pIdx].options = newQuestions[pIdx].options.map((opt, idx) => ({
                                ...opt,
                                isCorrect: idx === oIdx
                              }));
                              setEditingParagraphQuestions(newQuestions);
                            }}
                            className="h-4 w-4 text-blue-600"
                          />
                          <span>الإجابة الصحيحة</span>
                        </label>
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {String.fromCharCode(1632 + (oIdx + 1))}
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-xs text-gray-600">نص الخيار</label>
                        <ReactQuill
                          value={option.text}
                          onChange={(value) => {
                            const newQuestions = [...editingParagraphQuestions];
                            newQuestions[pIdx].options[oIdx].text = value;
                            setEditingParagraphQuestions(newQuestions);
                          }}
                          modules={quillModules}
                          formats={quillFormats}
                          className="bg-white rounded-lg"
                          style={{ minHeight: '80px' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-2 space-x-reverse pt-4 border-t">
              <Button
                onClick={cancelEditing}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <X className="w-4 h-4 ml-1" />
                إلغاء
              </Button>
              <Button
                onClick={() => saveEditedQuestion(q.id, q.type)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                loading={delete_question_loading}
              >
                <Save className="w-4 h-4 ml-1" />
                حفظ التعديلات
              </Button>
            </div>
          </div>
        );
      }
    }

    // Normal view (not editing)
    if (q.type === "mcq") {
      return (
        <div className="space-y-3">
          <div className="flex justify-between items-start mb-2">
            <div className="flex-1">
              <div 
                className="text-[13px] text-gray-800 leading-6 mb-3" 
                dangerouslySetInnerHTML={{__html : q?.question}}
              />
            </div>
            <div className="flex space-x-2 space-x-reverse mr-2">
              <button
                onClick={() => setEditingQuestion(q)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="تعديل السؤال"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setQuestionToDelete(q);
                  setDeleteModal(true);
                }}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="حذف السؤال"
                disabled={delete_question_loading}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
          
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
                    className="font-medium"
                  />
                  {option.explanation && (
                    <div 
                      dangerouslySetInnerHTML={{__html : `Explanation: ${option.explanation}`}}
                      className="mt-1 text-[12px] text-gray-600"
                    />
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
          <div className="flex justify-between items-start mb-2">
            <div className="flex-1">
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 mb-3">
                <div className="text-[12px] font-semibold text-blue-800 mb-1">Paragraph:</div>
                <div 
                  className="text-[12px] text-blue-700 leading-6"
                  dangerouslySetInnerHTML={{__html : q.paragraphContent}}
                />
              </div>
            </div>
            <div className="flex space-x-2 space-x-reverse mr-2">
              <button
                onClick={() => setEditingQuestion(q)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="تعديل الفقرة والأسئلة"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setQuestionToDelete(q);
                  setDeleteModal(true);
                }}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="حذف الفقرة والأسئلة"
                disabled={delete_question_loading}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {q.questions.map((question, idx) => (
            <div key={idx} className="space-y-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p 
                    className="text-[13px] text-gray-800 leading-6 mb-2"
                    dangerouslySetInnerHTML={{__html : question.questionText}}
                  />
                </div>
                <div className="flex space-x-2 space-x-reverse mr-2">
                  <button
                    onClick={() => {
                      setQuestionToDelete(question);
                      setDeleteModal(true);
                    }}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="حذف هذا السؤال فقط"
                    disabled={delete_question_loading}
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
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
                      <div 
                        className="font-medium" 
                        dangerouslySetInnerHTML={{__html : `${String.fromCharCode(1632 + (i + 1))}. ${option?.text}`}}
                      />
                      {option.explanation && (
                        <div 
                          dangerouslySetInnerHTML={{__html :` Explanation: ${option.explanation}`}}
                          className="mt-1 text-[12px] text-gray-600"
                        />
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

    return (
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <p className="text-[13px] text-gray-800" dangerouslySetInnerHTML={{__html : q.question}}></p>
        </div>
        <div className="flex space-x-2 space-x-reverse mr-2">
          <button
            onClick={() => setEditingQuestion(q)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="تعديل السؤال"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setQuestionToDelete(q);
              setDeleteModal(true);
            }}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="حذف السؤال"
            disabled={delete_question_loading}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
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
                <h3 
                dangerouslySetInnerHTML={{__html : `Section ${sectionName}`}}
                className="font-semibold text-blue-800"></h3>
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
              const isExpanded = isQuestionExpanded(q.id, q.type);

              return (
                <div 
                  key={q.id} 
                  className="rounded-2xl border bg-white shadow-sm transition-all hover:shadow-md"
                >
                  {/* Collapsible Header */}
                  <div 
                    className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 rounded-t-2xl transition-colors"
                    onClick={() => toggleQuestion(q.id, q.type)}
                  >
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
                    </div>
                    
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <span className="text-xs text-gray-500">
                        ID: {q.id}
                      </span>
                      <span className="text-gray-400">
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </span>
                    </div>
                  </div>
                  
                  {/* Collapsible Content */}
                  {isExpanded && (
                    <div className="p-4 pt-0 border-t">
                      <div className="mt-3">{renderQuestionContent(q)}</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        open={deleteModal}
        onCancel={() => {
          setDeleteModal(false);
          setQuestionToDelete(null);
        }}
        onOk={handleDeleteQuestion}
        okText="حذف"
        cancelText="إلغاء"
        okButtonProps={{ className: "!bg-red-500 hover:!bg-red-600" }}
        confirmLoading={delete_question_loading}
      >
        <div className="text-center py-4">
          <Trash2 className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-lg font-semibold mb-2">هل أنت متأكد من حذف السؤال؟</h2>
          <p className="text-gray-600">
            هذا الإجراء لا يمكن التراجع عنه. سيتم حذف السؤال نهائياً.
          </p>
        </div>
      </Modal>
    </Card>
  );
}