// "use client";

// import React, { useEffect, useState } from "react";
// import { Plus as PlusIcon, Trash2 } from "lucide-react";
// import MathFieldInput from "./parts/MathFieldInput";
// import LabeledEditor, { FIXED_IMG } from "./parts/LabeledEditor";
// import AttachmentPicker from "./parts/AttachmentPicker";

// /** Main editor */
// export default function McqSharedPassageEditor({
//   mcqSubType = "passage", // "passage" | "chemical" | "math"
//   initialData = [],
//   onPassagesChange,
//   uploadImage, // async (file) => url
// }) {
//   const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

//   const toOptionObject = (opt) => {
//     if (typeof opt === "string") return { latex: "", explanation: "", images: [] };
//     if (opt && typeof opt === "object")
//       return {
//         latex: opt.latex || "",
//         explanation: opt.explanation || "",
//         images: Array.isArray(opt.images) ? opt.images : [],
//       };
//     return { latex: "", explanation: "", images: [] };
//   };

//   const createQuestion = () => ({
//     id: uid(),
//     text: "",
//     options: [toOptionObject(""), toOptionObject("")],
//     correctIndex: 0,
//     attachments: [],
//   });

//   const createPassage = () => ({
//     id: uid(),
//     content: "",
//     questions: [createQuestion()],
//     attachments: [],
//   });

//   const normalize = (arr) =>
//     (arr || []).map((p) => ({
//       id: p.id || uid(),
//       content: p.content || "",
//       attachments: Array.isArray(p.attachments) ? p.attachments : [],
//       questions: (p.questions || []).map((q) => {
//         const opts =
//           Array.isArray(q.options) && q.options.length >= 2
//             ? q.options.map(toOptionObject)
//             : [toOptionObject(""), toOptionObject("")];
//         return {
//           id: q.id || uid(),
//           text: q.text || "",
//           options: opts,
//           correctIndex:
//             typeof q.correctIndex === "number" && q.correctIndex >= 0 && q.correctIndex < (opts?.length || 0)
//               ? q.correctIndex
//               : 0,
//           attachments: Array.isArray(q.attachments) ? q.attachments : [],
//         };
//       }),
//     }));

//   const [passages, setPassages] = useState(() =>
//     initialData?.length ? normalize(initialData) : [createPassage()]
//   );

//   useEffect(() => {
//     onPassagesChange?.(passages);
//   }, [passages, onPassagesChange]);

//   // ---- passage ops ----
//   const addPassage = () => setPassages((ps) => [...ps, createPassage()]);
//   const removePassage = (pId) =>
//     setPassages((ps) => (ps.length > 1 ? ps.filter((p) => p.id !== pId) : ps));
//   const updatePassageContent = (pId, content) =>
//     setPassages((ps) => ps.map((p) => (p.id === pId ? { ...p, content } : p)));
//   const addPassageFiles = (pId, files) =>
//     setPassages((ps) =>
//       ps.map((p) => (p.id === pId ? { ...p, attachments: [...(p.attachments || []), ...files] } : p))
//     );
//   const removePassageFile = (pId, fileIdx) =>
//     setPassages((ps) =>
//       ps.map((p) =>
//         p.id === pId ? { ...p, attachments: (p.attachments || []).filter((_, i) => i !== fileIdx) } : p
//       )
//     );

//   // ---- question ops ----
//   const addQuestion = (pId) =>
//     setPassages((ps) => ps.map((p) => (p.id === pId ? { ...p, questions: [...p.questions, createQuestion()] } : p)));
//   const removeQuestion = (pId, qId) =>
//     setPassages((ps) =>
//       ps.map((p) =>
//         p.id === pId
//           ? { ...p, questions: p.questions.length > 1 ? p.questions.filter((q) => q.id !== qId) : p.questions }
//           : p
//       )
//     );
//   const updateQuestionText = (pId, qId, text) =>
//     setPassages((ps) =>
//       ps.map((p) => (p.id === pId ? { ...p, questions: p.questions.map((q) => (q.id === qId ? { ...q, text } : q)) } : p))
//     );

//   // ---- options ops ----
//   const addOption = (pId, qId) =>
//     setPassages((ps) =>
//       ps.map((p) =>
//         p.id === pId
//           ? {
//               ...p,
//               questions: p.questions.map((q) =>
//                 q.id === qId ? { ...q, options: [...q.options, { latex: "", explanation: "", images: [] }] } : q
//               ),
//             }
//           : p
//       )
//     );
//   const removeOption = (pId, qId, optIndex) =>
//     setPassages((ps) =>
//       ps.map((p) => {
//         if (p.id !== pId) return p;
//         return {
//           ...p,
//           questions: p.questions.map((q) => {
//             if (q.id !== qId) return q;
//             if (q.options.length <= 2) return q;
//             const nextOpts = q.options.filter((_, i) => i !== optIndex);
//             let nextCorrect = q.correctIndex;
//             if (optIndex <= q.correctIndex) nextCorrect = Math.max(0, nextCorrect - 1);
//             if (nextCorrect >= nextOpts.length) nextCorrect = nextOpts.length - 1;
//             return { ...q, options: nextOpts, correctIndex: nextCorrect };
//           }),
//         };
//       })
//     );
//   const updateOptionField = (pId, qId, optIndex, field, value) =>
//     setPassages((ps) =>
//       ps.map((p) =>
//         p.id === pId
//           ? {
//               ...p,
//               questions: p.questions.map((q) => {
//                 if (q.id !== qId) return q;
//                 const next = q.options.map((opt, i) => (i === optIndex ? { ...opt, [field]: value } : opt));
//                 return { ...q, options: next };
//               }),
//             }
//           : p
//       )
//     );
//   const addOptionImages = (pId, qId, optIndex, files) =>
//     setPassages((ps) =>
//       ps.map((p) =>
//         p.id === pId
//           ? {
//               ...p,
//               questions: p.questions.map((q) => {
//                 if (q.id !== qId) return q;
//                 const next = q.options.map((opt, i) =>
//                   i === optIndex ? { ...opt, images: [...(opt.images || []), ...files] } : opt
//                 );
//                 return { ...q, options: next };
//               }),
//             }
//           : p
//       )
//     );
//   const removeOptionImage = (pId, qId, optIndex, imgIdx) =>
//     setPassages((ps) =>
//       ps.map((p) =>
//         p.id === pId
//           ? {
//               ...p,
//               questions: p.questions.map((q) => {
//                 if (q.id !== qId) return q;
//                 const next = q.options.map((opt, i) =>
//                   i === optIndex ? { ...opt, images: (opt.images || []).filter((_, k) => k !== imgIdx) } : opt
//                 );
//                 return { ...q, options: next };
//               }),
//             }
//           : p
//       )
//     );
//   const setCorrectIndex = (pId, qId, idx) =>
//     setPassages((ps) =>
//       ps.map((p) =>
//         p.id === pId ? { ...p, questions: p.questions.map((q) => (q.id === qId ? { ...q, correctIndex: idx } : q)) } : p
//       )
//     );

//   const isPassage = mcqSubType === "passage";
//   const isChemical = mcqSubType === "chemical";
//   const isMath = mcqSubType === "math" || mcqSubType === "chemical";

//   return (
//     <div className="space-y-6" dir="rtl">
//       <div className="flex items-center justify-between">
//         <h4 className="font-semibold text-gray-900">
//           {isPassage
//             ? "إدارة القطع وأسئلتها"
//             : isMath
//             ? "أسئلة معادلات — الإجابات معادلات + دعم مرفقات صور/PDF"
//             : "أسئلة (وصف/تعليمات عامة)"}
//         </h4>
//         {isPassage && (
//           <button
//             type="button"
//             onClick={addPassage}
//             className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm hover:bg-gray-50"
//           >
//             <PlusIcon className="h-4 w-4" />
//             إضافة قطعة
//           </button>
//         )}
//       </div>

//       {passages.map((p, pIndex) => {
//         const questionsCount = p.questions?.length || 0;
//         return (
//           <div key={p.id} className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
//             <div className="flex items-center justify-between border-b bg-gray-50 px-4 py-3">
//               <div className="flex items-center gap-3">
//                 <div className="text-sm font-semibold text-gray-800">
//                   {isPassage ? `قطعة ${pIndex + 1}` : isMath ? `معادلة ${pIndex + 1}` : `وصف عام ${pIndex + 1}`}
//                 </div>
//                 <span className="rounded-full border border-blue-100 bg-blue-50 px-2 py-0.5 text-[11px] text-blue-700">
//                   {questionsCount} سؤال
//                 </span>
//               </div>

//               <button
//                 type="button"
//                 onClick={() => removePassage(p.id)}
//                 className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-sm text-red-600 hover:bg-red-50 hover:text-red-700"
//                 title="حذف"
//               >
//                 <Trash2 className="h-4 w-4" /> حذف
//               </button>
//             </div>

//             {/* content */}
//             <div className="space-y-4 p-4">
//               {isChemical ? (
//                 <>
//                   <label className="block text-xs font-semibold text-gray-600">معادلات/صيغ عامة</label>
//                   <MathFieldInput
//                     value={p.content}
//                     onChange={(latex) => updatePassageContent(p.id, latex)}
//                     className="w-full"
//                     options={{ virtualKeyboardMode: "onfocus" }}
//                     placeholder="أدخل المعادلات/الصيغ العامة هنا…"
//                   />
//                 </>
//               ) : isMath ? (
//                 <>
//                   <label className="block text-xs font-semibold text-gray-600">المعادلة</label>
//                   <MathFieldInput
//                     value={p.content}
//                     onChange={(latex) => updatePassageContent(p.id, latex)}
//                     className="!w-full border border-gray-200"
//                     options={{ virtualKeyboardMode: "onfocus" }}
//                     placeholder="أدخل المعادلة هنا…"
//                   />
                  
//                   <AttachmentPicker
//                     label="مرفقات المعادلة (صور / PDF)"
//                     files={p.attachments || []}
//                     onAddFiles={(files) => addPassageFiles(p.id, files)}
//                     onRemoveFile={(idx) => removePassageFile(p.id, idx)}
//                     accept="application/pdf,image/*"
//                     multiple
//                   />
//                 </>
//               ) : (
//                 <LabeledEditor
//                   label={isPassage ? "نص القطعة" : "وصف/تعليمات عامة (اختياري)"}
//                   value={p.content}
//                   onChange={(value) => updatePassageContent(p.id, value)}
//                   editorMinH={140}
//                   uploadImage={uploadImage}
//                   imageSize={FIXED_IMG}
//                 />
//               )}
//             </div>

//             {/* questions */}
//             <div className="p-4 pt-0">
//               {isPassage && (
//                 <div className="mb-3 flex items-center justify-between">
//                   <div className="text-sm font-semibold text-gray-700">أسئلة هذه القطعة</div>
//                   <button
//                     type="button"
//                     onClick={() => addQuestion(p.id)}
//                     className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm hover:bg-gray-50"
//                   >
//                     <PlusIcon className="h-4 w-4" /> إضافة سؤال
//                   </button>
//                 </div>
//               )}

//               <div className="space-y-4">
//                 {p.questions.map((q, qIndex) => (
//                   <div key={q.id} className="rounded-xl border border-gray-200 bg-gray-50 p-4">
//                     {isPassage && (
//                       <div className="mb-3 flex items-center justify-between">
//                         <div className="text-sm font-medium text-gray-800">سؤال {qIndex + 1}</div>
//                         <button
//                           type="button"
//                           onClick={() => removeQuestion(p.id, q.id)}
//                           className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-red-600 hover:bg-red-50 hover:text-red-700"
//                           title="حذف السؤال"
//                         >
//                           <Trash2 className="h-4 w-4" /> حذف
//                         </button>
//                       </div>
//                     )}

//                     {isPassage && (
//                       <LabeledEditor
//                         label="نص السؤال"
//                         value={q.text}
//                         onChange={(val) => updateQuestionText(p.id, q.id, val)}
//                         editorMinH={110}
//                         uploadImage={uploadImage}
//                         imageSize={FIXED_IMG}
//                       />
//                     )}

//                     <div className="mt-4 space-y-3">
//                       <div className="text-xs font-semibold text-gray-700">
//                         الاختيارات{isMath ? " (تُكتب كمعادلات) + مرفقات صور/PDF" : ""}
//                       </div>

//                       {q.options.map((opt, optIndex) => {
//                         const isCorrect = q.correctIndex === optIndex;
//                         const letter = String.fromCharCode(65 + optIndex);
//                         return (
//                           <div
//                             key={optIndex}
//                             className={`flex flex-col gap-3 rounded-xl border bg-white p-3 shadow-sm transition ${
//                               isCorrect ? "ring-1 ring-green-200" : "ring-1 ring-transparent"
//                             }`}
//                           >
//                             <div className="flex items-center gap-3">
//                               <span
//                                 className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
//                                   isCorrect ? "bg-green-600 text-white" : "bg-gray-100 text-gray-700"
//                                 }`}
//                               >
//                                 {letter}
//                               </span>

//                               <label className="flex items-center gap-2 text-xs font-medium text-gray-600">
//                                 <input
//                                   type="radio"
//                                   name={`correct-${p.id}-${q.id}`}
//                                   checked={isCorrect}
//                                   onChange={() => setCorrectIndex(p.id, q.id, optIndex)}
//                                   className="h-4 w-4 text-blue-600 focus:ring-blue-500"
//                                   title="الإجابة الصحيحة"
//                                 />
//                                 إجابة صحيحة
//                               </label>

//                               {q.options.length > 2 && (
//                                 <button
//                                   type="button"
//                                   onClick={() => removeOption(p.id, q.id, optIndex)}
//                                   className="ml-auto rounded-lg px-2 py-1 text-xs text-red-600 hover:bg-red-50 hover:text-red-800"
//                                   title="حذف الاختيار"
//                                 >
//                                   حذف
//                                 </button>
//                               )}
//                             </div>

//                             {isMath ? (
//                               <>
//                                 <div className="space-y-2">
//                                   <label className="block text-xs font-semibold text-gray-600">معادلة الاختيار</label>
//                                   <MathFieldInput
//                                     value={opt.latex}
//                                     onChange={(latex) => updateOptionField(p.id, q.id, optIndex, "latex", latex)}
//                                     placeholder="مثال: \\frac{a+b}{c}"
//                                     className="w-full"
//                                     options={{ virtualKeyboardMode: "onfocus" }}
//                                   />
//                                 </div>

//                                 <AttachmentPicker
//                                   label="مرفقات الاختيار (صور / PDF)"
//                                   files={opt.images || []}
//                                   onAddFiles={(files) => addOptionImages(p.id, q.id, optIndex, files)}
//                                   onRemoveFile={(idx) => removeOptionImage(p.id, q.id, optIndex, idx)}
//                                   accept="application/pdf,image/*"
//                                   multiple
//                                 />
//                               </>
//                             ) : (
//                               <LabeledEditor
//                                 label="نص الاختيار"
//                                 value={opt.latex}
//                                 onChange={(val) => updateOptionField(p.id, q.id, optIndex, "latex", val)}
//                                 editorMinH={90}
//                                 uploadImage={uploadImage}
//                                 imageSize={FIXED_IMG}
//                               />
//                             )}

//                             <LabeledEditor
//                               label="شرح الاختيار (لماذا هو صحيح/خاطئ)"
//                               value={opt.explanation}
//                               onChange={(value) => updateOptionField(p.id, q.id, optIndex, "explanation", value)}
//                               editorMinH={90}
//                               uploadImage={uploadImage}
//                               imageSize={FIXED_IMG}
//                             />
//                           </div>
//                         );
//                       })}

//                       <button
//                         type="button"
//                         onClick={() => addOption(p.id, q.id)}
//                         className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs shadow-sm hover:bg-gray-50"
//                       >
//                         <PlusIcon className="h-4 w-4" /> إضافة خيار
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// }


// "use client";

// import React, { useEffect, useState } from "react";
// import { Plus as PlusIcon, Trash2 } from "lucide-react";
// import MathFieldInput from "./parts/MathFieldInput";
// import LabeledEditor, { FIXED_IMG } from "./parts/LabeledEditor";
// import AttachmentPicker from "./parts/AttachmentPicker";

// /** Main editor */
// export default function McqSharedPassageEditor({
//   mcqSubType = "passage", // "passage" | "chemical" | "math"
//   initialData = [],
//   onPassagesChange,
//   uploadImage, // async (file) => url
//   editingQuestion
// }) {
//   const uid = () =>
//     Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

//   // ✅ OPTION SHAPE NOW MATCHES NORMAL MCQ
//   const toOptionObject = (opt) => {
//     if (typeof opt === "string")
//       return { answer: opt, question_explanation: "", images: [] };

//     if (opt && typeof opt === "object")
//       return {
//         // support old shapes + new shape
//         answer: opt.answer || opt.latex || "",
//         question_explanation:
//           opt.question_explanation || opt.explanation || "",
//         images: Array.isArray(opt.images) ? opt.images : [],
//       };

//     return { answer: "", question_explanation: "", images: [] };
//   };

//   const createQuestion = () => ({
//     id: uid(),
//     text: "",
//     options: [toOptionObject(""), toOptionObject("")],
//     correctIndex: 0,
//     attachments: [],
//   });

//   const createPassage = () => ({
//     id: uid(),
//     content: "",
//     questions: [createQuestion()],
//     attachments: [],
//   });

//   const normalize = (arr) =>
//     (arr || []).map((p) => ({
//       id: p.id || uid(),
//       content: p.content || "",
//       attachments: Array.isArray(p.attachments) ? p.attachments : [],
//       questions: (p.questions || []).map((q) => {
//         const opts =
//           Array.isArray(q.options) && q.options.length >= 2
//             ? q.options.map(toOptionObject)
//             : [toOptionObject(""), toOptionObject("")];

//         return {
//           id: q.id || uid(),
//           text: q.text || "",
//           options: opts,
//           correctIndex:
//             typeof q.correctIndex === "number" &&
//             q.correctIndex >= 0 &&
//             q.correctIndex < (opts?.length || 0)
//               ? q.correctIndex
//               : 0,
//           attachments: Array.isArray(q.attachments) ? q.attachments : [],
//         };
//       }),
//     }));

//   const [passages, setPassages] = useState(() =>
//     initialData?.length ? normalize(initialData) : [createPassage()]
//   );

//   // In McqSharedPassageEditor component
// // useEffect(() => {
// //   console.log("McqSharedPassageEditor initialData:", editingQuestion);
  
// //   if (initialData && initialData.content) {
// //     // If initialData is already in passage format
// //     setPassages([initialData]);
// //   } else if (Array.isArray(initialData) && initialData.length > 0) {
// //     // If initialData is an array
// //     setPassages(initialData);
// //   } else if (initialData && initialData.type === "paragraph_mcq") {
// //     // Convert paragraph_mcq format to editor format
// //     const convertedPassage = {
// //       id: Date.now().toString(),
// //       content: initialData.paragraphContent || "",
// //       questions: initialData.questions?.map((q, index) => ({
// //         id: `${Date.now()}-q${index}`,
// //         text: q.questionText || "",
// //         options: q.options?.map(opt => ({
// //           answer: opt.text || "",
// //           explanation: opt.explanation || "",
// //           isCorrect: opt.isCorrect || false,
// //         })) || [],
// //         correctIndex: q.options?.findIndex(opt => opt.isCorrect) || 0,
// //       })) || [],
// //     };
// //     setPassages([convertedPassage]);
// //   }
// // }, [initialData , editingQuestion]);

// //   useEffect(() => {
// //   if (Array.isArray(initialData) && initialData.length > 0) {
// //     setPassages(normalize(initialData));
// //   } else {
// //     setPassages([createPassage()]);
// //   }
// //   // eslint-disable-next-line react-hooks/exhaustive-deps
// // }, [initialData, mcqSubType]);




//   useEffect(() => {
//     onPassagesChange?.(passages);
//   }, [passages, onPassagesChange]);

//   // ---- passage ops ----
//   const addPassage = () => setPassages((ps) => [...ps, createPassage()]);
//   const removePassage = (pId) =>
//     setPassages((ps) =>
//       ps.length > 1 ? ps.filter((p) => p.id !== pId) : ps
//     );
//   const updatePassageContent = (pId, content) =>
//     setPassages((ps) =>
//       ps.map((p) => (p.id === pId ? { ...p, content } : p))
//     );
//   const addPassageFiles = (pId, files) =>
//     setPassages((ps) =>
//       ps.map((p) =>
//         p.id === pId
//           ? { ...p, attachments: [...(p.attachments || []), ...files] }
//           : p
//       )
//     );
//   const removePassageFile = (pId, fileIdx) =>
//     setPassages((ps) =>
//       ps.map((p) =>
//         p.id === pId
//           ? {
//               ...p,
//               attachments: (p.attachments || []).filter(
//                 (_, i) => i !== fileIdx
//               ),
//             }
//           : p
//       )
//     );

//   // ---- question ops ----
//   const addQuestion = (pId) =>
//     setPassages((ps) =>
//       ps.map((p) =>
//         p.id === pId
//           ? { ...p, questions: [...p.questions, createQuestion()] }
//           : p
//       )
//     );
//   const removeQuestion = (pId, qId) =>
//     setPassages((ps) =>
//       ps.map((p) =>
//         p.id === pId
//           ? {
//               ...p,
//               questions:
//                 p.questions.length > 1
//                   ? p.questions.filter((q) => q.id !== qId)
//                   : p.questions,
//             }
//           : p
//       )
//     );
//   const updateQuestionText = (pId, qId, text) =>
//     setPassages((ps) =>
//       ps.map((p) =>
//         p.id === pId
//           ? {
//               ...p,
//               questions: p.questions.map((q) =>
//                 q.id === qId ? { ...q, text } : q
//               ),
//             }
//           : p
//       )
//     );

//   // ---- options ops ----
//   const addOption = (pId, qId) =>
//     setPassages((ps) =>
//       ps.map((p) =>
//         p.id === pId
//           ? {
//               ...p,
//               questions: p.questions.map((q) =>
//                 q.id === qId
//                   ? {
//                       ...q,
//                       options: [
//                         ...q.options,
//                         { answer: "", question_explanation: "", images: [] },
//                       ],
//                     }
//                   : q
//               ),
//             }
//           : p
//       )
//     );

//   const removeOption = (pId, qId, optIndex) =>
//     setPassages((ps) =>
//       ps.map((p) => {
//         if (p.id !== pId) return p;
//         return {
//           ...p,
//           questions: p.questions.map((q) => {
//             if (q.id !== qId) return q;
//             if (q.options.length <= 2) return q;
//             const nextOpts = q.options.filter(
//               (_, i) => i !== optIndex
//             );
//             let nextCorrect = q.correctIndex;
//             if (optIndex <= q.correctIndex)
//               nextCorrect = Math.max(0, nextCorrect - 1);
//             if (nextCorrect >= nextOpts.length)
//               nextCorrect = nextOpts.length - 1;
//             return {
//               ...q,
//               options: nextOpts,
//               correctIndex: nextCorrect,
//             };
//           }),
//         };
//       })
//     );

//   const updateOptionField = (
//     pId,
//     qId,
//     optIndex,
//     field,
//     value
//   ) =>
//     setPassages((ps) =>
//       ps.map((p) =>
//         p.id === pId
//           ? {
//               ...p,
//               questions: p.questions.map((q) => {
//                 if (q.id !== qId) return q;
//                 const next = q.options.map((opt, i) =>
//                   i === optIndex ? { ...opt, [field]: value } : opt
//                 );
//                 return { ...q, options: next };
//               }),
//             }
//           : p
//       )
//     );

//   const addOptionImages = (
//     pId,
//     qId,
//     optIndex,
//     files
//   ) =>
//     setPassages((ps) =>
//       ps.map((p) =>
//         p.id === pId
//           ? {
//               ...p,
//               questions: p.questions.map((q) => {
//                 if (q.id !== qId) return q;
//                 const next = q.options.map((opt, i) =>
//                   i === optIndex
//                     ? { ...opt, images: [...(opt.images || []), ...files] }
//                     : opt
//                 );
//                 return { ...q, options: next };
//               }),
//             }
//           : p
//       )
//     );

//   // const removeOptionImage = (
//   //   padding,
//   //   qIdpadding,
//   //   optIndex,
//   //   imgIdx
//   // ) =>
//   //   setPassages((ps) =>
//   //     ps.map((p) =>
//   //       p.id === pId
//   //         ? {
//   //             ...p,
//   //             questions: p.questions.map((q) => {
//   //               if (q.id !== qId) return q;
//   //               const next = q.options.map((opt, i) =>
//   //                 i === optIndex
//   //                   ? {
//   //                       ...opt,
//   //                       images: (opt.images || []).filter(
//   //                         (_, k) => k !== imgIdx
//   //                       ),
//   //                     }
//   //                   : opt
//   //               );
//   //               return { ...q, options: next };
//   //             }),
//   //           }
//   //         : p
//   //     )
//   //   );

//   const removeOptionImage = (pId, qId, optIndex, imgIdx) =>
//   setPassages((ps) =>
//     ps.map((p) =>
//       p.id === pId
//         ? {
//             ...p,
//             questions: p.questions.map((q) => {
//               if (q.id !== qId) return q;
//               const next = q.options.map((opt, i) =>
//                 i === optIndex
//                   ? { ...opt, images: (opt.images || []).filter((_, k) => k !== imgIdx) }
//                   : opt
//               );
//               return { ...q, options: next };
//             }),
//           }
//         : p
//     )
//   );


//   const setCorrectIndex = (pId, qId, idx) =>
//     setPassages((ps) =>
//       ps.map((p) =>
//         p.id === pId
//           ? {
//               ...p,
//               questions: p.questions.map((q) =>
//                 q.id === qId ? { ...q, correctIndex: idx } : q
//               ),
//             }
//           : p
//       )
//     );

//   const isPassage = mcqSubType === "passage";
//   const isChemical = mcqSubType === "chemical";
//   const isMath = mcqSubType === "math" || mcqSubType === "chemical";

//   return (
//     <div className="space-y-6" dir="rtl">
//       <div className="flex items-center justify-between">
//         <h4 className="font-semibold text-gray-900">
//           {isPassage
//             ? "إدارة القطع وأسئلتها"
//             : isMath
//             ? "أسئلة معادلات — الإجابات معادلات + دعم مرفقات صور/PDF"
//             : "أسئلة (وصف/تعليمات عامة)"}
//         </h4>
//         {isPassage && (
//           <button
//             type="button"
//             onClick={addPassage}
//             className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm hover:bg-gray-50"
//           >
//             <PlusIcon className="h-4 w-4" />
//             إضافة قطعة
//           </button>
//         )}
//       </div>

//       {passages.map((p, pIndex) => {
//         const questionsCount = p.questions?.length || 0;
//         return (
//           <div
//             key={p.id}
//             className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
//           >
//             <div className="flex items-center justify-between border-b bg-gray-50 px-4 py-3">
//               <div className="flex items-center gap-3">
//                 <div className="text-sm font-semibold text-gray-800">
//                   {isPassage
//                     ? `قطعة ${pIndex + 1}`
//                     : isMath
//                     ? `معادلة ${pIndex + 1}`
//                     : `وصف عام ${pIndex + 1}`}
//                 </div>
//                 <span className="rounded-full border border-blue-100 bg-blue-50 px-2 py-0.5 text-[11px] text-blue-700">
//                   {questionsCount} سؤال
//                 </span>
//               </div>

//               <button
//                 type="button"
//                 onClick={() => removePassage(p.id)}
//                 className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-sm text-red-600 hover:bg-red-50 hover:text-red-700"
//                 title="حذف"
//               >
//                 <Trash2 className="h-4 w-4" /> حذف
//               </button>
//             </div>

//             {/* content */}
//             <div className="space-y-4 p-4">
//               {isChemical ? (
//                 <>
//                   <label className="block text-xs font-semibold text-gray-600">
//                     معادلات/صيغ عامة
//                   </label>
//                   <MathFieldInput
//                     value={p.content}
//                     onChange={(latex) => updatePassageContent(p.id, latex)}
//                     className="w-full"
//                     options={{ virtualKeyboardMode: "onfocus" }}
//                     placeholder="أدخل المعادلات/الصيغ العامة هنا…"
//                   />
//                 </>
//               ) : isMath ? (
//                 <>
//                   <label className="block text-xs font-semibold text-gray-600">
//                     المعادلة
//                   </label>
//                   <MathFieldInput
//                     value={p.content}
//                     onChange={(latex) => updatePassageContent(p.id, latex)}
//                     className="!w-full border border-gray-200"
//                     options={{ virtualKeyboardMode: "onfocus" }}
//                     placeholder="أدخل المعادلة هنا…"
//                   />

//                   <AttachmentPicker
//                     label="مرفقات المعادلة (صور / PDF)"
//                     files={p.attachments || []}
//                     onAddFiles={(files) => addPassageFiles(p.id, files)}
//                     onRemoveFile={(idx) => removePassageFile(p.id, idx)}
//                     accept="application/pdf,image/*"
//                     multiple
//                   />
//                 </>
//               ) : (
//                 <LabeledEditor
//                   label={
//                     isPassage ? "نص القطعة" : "وصف/تعليمات عامة (اختياري)"
//                   }
//                   value={p.content}
//                   onChange={(value) => updatePassageContent(p.id, value)}
//                   editorMinH={140}
//                   uploadImage={uploadImage}
//                   imageSize={FIXED_IMG}
//                 />
//               )}
//             </div>

//             {/* questions */}
//             <div className="p-4 pt-0">
//               {isPassage && (
//                 <div className="mb-3 flex items-center justify-between">
//                   <div className="text-sm font-semibold text-gray-700">
//                     أسئلة هذه القطعة
//                   </div>
//                   <button
//                     type="button"
//                     onClick={() => addQuestion(p.id)}
//                     className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm hover:bg-gray-50"
//                   >
//                     <PlusIcon className="h-4 w-4" /> إضافة سؤال
//                   </button>
//                 </div>
//               )}

//               <div className="space-y-4">
//                 {p.questions.map((q, qIndex) => (
//                   <div
//                     key={q.id}
//                     className="rounded-xl border border-gray-200 bg-gray-50 p-4"
//                   >
//                     {isPassage && (
//                       <div className="mb-3 flex items-center justify-between">
//                         <div className="text-sm font-medium text-gray-800">
//                           سؤال {qIndex + 1}
//                         </div>
//                         <button
//                           type="button"
//                           onClick={() => removeQuestion(p.id, q.id)}
//                           className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-red-600 hover:bg-red-50 hover:text-red-700"
//                           title="حذف السؤال"
//                         >
//                           <Trash2 className="h-4 w-4" /> حذف
//                         </button>
//                       </div>
//                     )}

//                     {isPassage && (
//                       <LabeledEditor
//                         label="نص السؤال"
//                         value={q.text}
//                         onChange={(val) =>
//                           updateQuestionText(p.id, q.id, val)
//                         }
//                         editorMinH={110}
//                         uploadImage={uploadImage}
//                         imageSize={FIXED_IMG}
//                       />
//                     )}

//                     <div className="mt-4 space-y-3">
//                       <div className="text-xs font-semibold text-gray-700">
//                         الاختيارات
//                         {isMath
//                           ? " (تُكتب كمعادلات) + مرفقات صور/PDF"
//                           : ""}
//                       </div>

//                       {q.options.map((opt, optIndex) => {
//                         const isCorrect = q.correctIndex === optIndex;
//                         const letter = String.fromCharCode(65 + optIndex);

//                         return (
//                           <div
//                             key={optIndex}
//                             className={`flex flex-col gap-3 rounded-xl border bg-white p-3 shadow-sm transition ${
//                               isCorrect
//                                 ? "ring-1 ring-green-200"
//                                 : "ring-1 ring-transparent"
//                             }`}
//                           >
//                             <div className="flex items-center gap-3">
//                               <span
//                                 className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
//                                   isCorrect
//                                     ? "bg-green-600 text-white"
//                                     : "bg-gray-100 text-gray-700"
//                                 }`}
//                               >
//                                 {letter}
//                               </span>

//                               <label className="flex items-center gap-2 text-xs font-medium text-gray-600">
//                                 <input
//                                   type="radio"
//                                   name={`correct-${p.id}-${q.id}`}
//                                   checked={isCorrect}
//                                   onChange={() =>
//                                     setCorrectIndex(
//                                       p.id,
//                                       q.id,
//                                       optIndex
//                                     )
//                                   }
//                                   className="h-4 w-4 text-blue-600 focus:ring-blue-500"
//                                   title="الإجابة الصحيحة"
//                                 />
//                                 إجابة صحيحة
//                               </label>

//                               {q.options.length > 2 && (
//                                 <button
//                                   type="button"
//                                   onClick={() =>
//                                     removeOption(p.id, q.id, optIndex)
//                                   }
//                                   className="ml-auto rounded-lg px-2 py-1 text-xs text-red-600 hover:bg-red-50 hover:text-red-800"
//                                   title="حذف الاختيار"
//                                 >
//                                   حذف
//                                 </button>
//                               )}
//                             </div>

//                             {isMath ? (
//                               <>
//                                 <div className="space-y-2">
//                                   <label className="block text-xs font-semibold text-gray-600">
//                                     معادلة الاختيار
//                                   </label>
//                                   <MathFieldInput
//                                     value={opt.answer}
//                                     onChange={(latex) =>
//                                       updateOptionField(
//                                         p.id,
//                                         q.id,
//                                         optIndex,
//                                         "answer",
//                                         latex
//                                       )
//                                     }
//                                     placeholder="مثال: \\frac{a+b}{c}"
//                                     className="w-full"
//                                     options={{
//                                       virtualKeyboardMode: "onfocus",
//                                     }}
//                                   />
//                                 </div>

//                                 <AttachmentPicker
//                                   label="مرفقات الاختيار (صور / PDF)"
//                                   files={opt.images || []}
//                                   onAddFiles={(files) =>
//                                     addOptionImages(
//                                       p.id,
//                                       q.id,
//                                       optIndex,
//                                       files
//                                     )
//                                   }
//                                   onRemoveFile={(idx) =>
//                                     removeOptionImage(
//                                       p.id,
//                                       q.id,
//                                       optIndex,
//                                       idx
//                                     )
//                                   }
//                                   accept="application/pdf,image/*"
//                                   multiple
//                                 />
//                               </>
//                             ) : (
//                               <LabeledEditor
//                                 label="نص الاختيار"
//                                 value={opt.answer}
//                                 onChange={(val) =>
//                                   updateOptionField(
//                                     p.id,
//                                     q.id,
//                                     optIndex,
//                                     "answer",
//                                     val
//                                   )
//                                 }
//                                 editorMinH={90}
//                                 uploadImage={uploadImage}
//                                 imageSize={FIXED_IMG}
//                               />
//                             )}

//                             <LabeledEditor
//                               label="شرح الاختيار (لماذا هو صحيح/خاطئ)"
//                               value={opt.question_explanation}
//                               onChange={(value) =>
//                                 updateOptionField(
//                                   p.id,
//                                   q.id,
//                                   optIndex,
//                                   "question_explanation",
//                                   value
//                                 )
//                               }
//                               editorMinH={90}
//                               uploadImage={uploadImage}
//                               imageSize={FIXED_IMG}
//                             />
//                           </div>
//                         );
//                       })}

//                       <button
//                         type="button"
//                         onClick={() => addOption(p.id, q.id)}
//                         className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs shadow-sm hover:bg-gray-50"
//                       >
//                         <PlusIcon className="h-4 w-4" /> إضافة خيار
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// }


"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button, Divider, Segmented } from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import LabeledEditor from "./parts/LabeledEditor";

/**
 * McqSharedPassageEditor
 *
 * Supports 2 modes via `mcqSubType`:
 * - "passage": shared paragraph + multiple MCQs under it (paragraph_mcq authoring UX)
 * - "chemical": equation-like prompt groups (still a shared “content” + multiple MCQs)
 *
 * IMPORTANT FIX:
 * - `initialData` can be:
 *    1) Array of groups (the editor format), OR
 *    2) `editingQuestion` object coming from DisplayQuestions (paragraph_mcq shape)
 * - We hydrate the editor ONCE per (editingQuestion.id) to avoid overwriting user typing.
 *
 * Data format emitted to parent:
 * [
 *   {
 *     id,
 *     content,        // shared passage/equation content (HTML string)
 *     attachments: [],// optional (keep for future)
 *     questions: [
 *       {
 *         id,
 *         text,        // question text (HTML string)
 *         attachments: [],
 *         correctIndex,
 *         options: [
 *           { answer, question_explanation, images: [] }
 *         ]
 *       }
 *     ]
 *   }
 * ]
 */

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
  attachments: [],
  correctIndex: 0,
  options: [emptyOption(), emptyOption(), emptyOption(), emptyOption()],
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

/**
 * Convert editingQuestion (coming from DisplayQuestions) -> editor groups array
 * We try to support the most common paragraph_mcq shapes:
 * - { paragraphContent / paragraph_content / paragraphContentHtml }
 * - { questions: [{ questionText / question_text, options: [{text, explanation, isCorrect}] }] }
 */
function convertEditingQuestionToGroups(editingQuestion) {
  if (!editingQuestion || typeof editingQuestion !== "object") return [emptyGroup()];

  const paragraph =
    editingQuestion.paragraphContent ||
    editingQuestion.paragraph_content ||
    editingQuestion.paragraph ||
    editingQuestion.paragraphContentHtml ||
    editingQuestion.paragraph_html ||
    "";

  // If it already looks like our groups array, return as-is (defensive)
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

    // detect correct index
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
}) {
  const [groups, setGroups] = useState([emptyGroup()]);

  // ✅ Prevent re-hydration while typing (the conflict you had)
  const hydratedKeyRef = useRef(null);

  const editingId = useMemo(() => {
    // if initialData is an object (editingQuestion), it might have id
    if (initialData && !Array.isArray(initialData) && typeof initialData === "object") {
      return initialData.id ?? initialData.question_id ?? null;
    }
    return null;
  }, [initialData]);

  // ✅ Hydrate from initialData (array or editingQuestion object) ONCE
  useEffect(() => {
    const makeHydrateKey = () => {
      // If editing question: lock to its id so we hydrate once per edit
      if (editingId) return `edit:${editingId}`;

      // If array: use a stable key derived from length/content existence (lightweight)
      if (isEditorGroupsArray(initialData)) return `arr:${initialData.length}`;

      // if no data
      return "empty";
    };

    const key = makeHydrateKey();
    if (hydratedKeyRef.current === key) return;
    hydratedKeyRef.current = key;

    // 1) If array already in editor format
    if (isEditorGroupsArray(initialData)) {
      setGroups(initialData.length ? initialData : [emptyGroup()]);
      return;
    }

    // 2) If editingQuestion object
    if (initialData && typeof initialData === "object") {
      const converted = convertEditingQuestionToGroups(initialData);
      setGroups(converted.length ? converted : [emptyGroup()]);
      return;
    }

    // 3) fallback
    setGroups([emptyGroup()]);
  }, [initialData, editingId]);

  // Emit upward whenever groups changes
  useEffect(() => {
    onPassagesChange?.(groups);
  }, [groups, onPassagesChange]);

  /* ---------- Mutators ---------- */

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
      qs[questionIndex] = { ...q, options: opts };
      next[groupIndex] = { ...g, questions: qs };
      return next;
    });
  };

  const addOption = (groupIndex, questionIndex) => {
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
    setGroups((prev) => {
      const next = [...prev];
      const g = next[groupIndex];
      const qs = [...(g.questions || [])];
      const q = qs[questionIndex];
      const opts = [...(q.options || [])];

      if (opts.length <= 2) return prev;

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

  const title =
    mcqSubType === "chemical"
      ? "أسئلة المعادلات (محتوى مشترك + أسئلة)"
      : "";

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
            <div className="text-sm font-medium text-gray-700">
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

                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-700">
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
                    <div className="text-sm font-medium text-gray-700">
                      خيارات الإجابة
                    </div>

                    <Button
                      icon={<PlusOutlined />}
                      onClick={() => addOption(groupIndex, questionIndex)}
                    >
                      إضافة خيار
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {(q.options || []).map((opt, optionIndex) => {
                      const isCorrect = (q.correctIndex ?? 0) === optionIndex;

                      return (
                        <div
                          key={optionIndex}
                          className={`rounded-2xl border p-3 bg-white ${
                            isCorrect ? "border-green-300" : "border-gray-200"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-3 flex-wrap">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                name={`correct-${groupIndex}-${questionIndex}`}
                                checked={isCorrect}
                                onChange={() =>
                                  updateQuestion(groupIndex, questionIndex, {
                                    correctIndex: optionIndex,
                                  })
                                }
                              />
                              <span className="text-sm font-medium text-gray-700">
                                خيار #{optionIndex + 1}
                              </span>

                              {isCorrect && (
                                <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-100 px-2 py-1 rounded-full">
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
                              <div className="text-xs font-medium text-gray-600">
                                نص الخيار
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
                            </div>

                            <div className="space-y-1">
                              <div className="text-xs font-medium text-gray-600">
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
