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


"use client";

import React, { useEffect, useState } from "react";
import { Plus as PlusIcon, Trash2 } from "lucide-react";
import MathFieldInput from "./parts/MathFieldInput";
import LabeledEditor, { FIXED_IMG } from "./parts/LabeledEditor";
import AttachmentPicker from "./parts/AttachmentPicker";

/** Main editor */
export default function McqSharedPassageEditor({
  mcqSubType = "passage", // "passage" | "chemical" | "math"
  initialData = [],
  onPassagesChange,
  uploadImage, // async (file) => url
}) {
  const uid = () =>
    Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

  // ✅ OPTION SHAPE NOW MATCHES NORMAL MCQ
  const toOptionObject = (opt) => {
    if (typeof opt === "string")
      return { answer: opt, question_explanation: "", images: [] };

    if (opt && typeof opt === "object")
      return {
        // support old shapes + new shape
        answer: opt.answer || opt.latex || "",
        question_explanation:
          opt.question_explanation || opt.explanation || "",
        images: Array.isArray(opt.images) ? opt.images : [],
      };

    return { answer: "", question_explanation: "", images: [] };
  };

  const createQuestion = () => ({
    id: uid(),
    text: "",
    options: [toOptionObject(""), toOptionObject("")],
    correctIndex: 0,
    attachments: [],
  });

  const createPassage = () => ({
    id: uid(),
    content: "",
    questions: [createQuestion()],
    attachments: [],
  });

  const normalize = (arr) =>
    (arr || []).map((p) => ({
      id: p.id || uid(),
      content: p.content || "",
      attachments: Array.isArray(p.attachments) ? p.attachments : [],
      questions: (p.questions || []).map((q) => {
        const opts =
          Array.isArray(q.options) && q.options.length >= 2
            ? q.options.map(toOptionObject)
            : [toOptionObject(""), toOptionObject("")];

        return {
          id: q.id || uid(),
          text: q.text || "",
          options: opts,
          correctIndex:
            typeof q.correctIndex === "number" &&
            q.correctIndex >= 0 &&
            q.correctIndex < (opts?.length || 0)
              ? q.correctIndex
              : 0,
          attachments: Array.isArray(q.attachments) ? q.attachments : [],
        };
      }),
    }));

  const [passages, setPassages] = useState(() =>
    initialData?.length ? normalize(initialData) : [createPassage()]
  );

  // In McqSharedPassageEditor component
useEffect(() => {
  console.log("McqSharedPassageEditor initialData:", initialData);
  
  if (initialData && initialData.content) {
    // If initialData is already in passage format
    setPassages([initialData]);
  } else if (Array.isArray(initialData) && initialData.length > 0) {
    // If initialData is an array
    setPassages(initialData);
  } else if (initialData && initialData.type === "paragraph_mcq") {
    // Convert paragraph_mcq format to editor format
    const convertedPassage = {
      id: Date.now().toString(),
      content: initialData.paragraphContent || "",
      questions: initialData.questions?.map((q, index) => ({
        id: `${Date.now()}-q${index}`,
        text: q.questionText || "",
        options: q.options?.map(opt => ({
          answer: opt.text || "",
          explanation: opt.explanation || "",
          isCorrect: opt.isCorrect || false,
        })) || [],
        correctIndex: q.options?.findIndex(opt => opt.isCorrect) || 0,
      })) || [],
    };
    setPassages([convertedPassage]);
  }
}, [initialData]);

  useEffect(() => {
    onPassagesChange?.(passages);
  }, [passages, onPassagesChange]);

  // ---- passage ops ----
  const addPassage = () => setPassages((ps) => [...ps, createPassage()]);
  const removePassage = (pId) =>
    setPassages((ps) =>
      ps.length > 1 ? ps.filter((p) => p.id !== pId) : ps
    );
  const updatePassageContent = (pId, content) =>
    setPassages((ps) =>
      ps.map((p) => (p.id === pId ? { ...p, content } : p))
    );
  const addPassageFiles = (pId, files) =>
    setPassages((ps) =>
      ps.map((p) =>
        p.id === pId
          ? { ...p, attachments: [...(p.attachments || []), ...files] }
          : p
      )
    );
  const removePassageFile = (pId, fileIdx) =>
    setPassages((ps) =>
      ps.map((p) =>
        p.id === pId
          ? {
              ...p,
              attachments: (p.attachments || []).filter(
                (_, i) => i !== fileIdx
              ),
            }
          : p
      )
    );

  // ---- question ops ----
  const addQuestion = (pId) =>
    setPassages((ps) =>
      ps.map((p) =>
        p.id === pId
          ? { ...p, questions: [...p.questions, createQuestion()] }
          : p
      )
    );
  const removeQuestion = (pId, qId) =>
    setPassages((ps) =>
      ps.map((p) =>
        p.id === pId
          ? {
              ...p,
              questions:
                p.questions.length > 1
                  ? p.questions.filter((q) => q.id !== qId)
                  : p.questions,
            }
          : p
      )
    );
  const updateQuestionText = (pId, qId, text) =>
    setPassages((ps) =>
      ps.map((p) =>
        p.id === pId
          ? {
              ...p,
              questions: p.questions.map((q) =>
                q.id === qId ? { ...q, text } : q
              ),
            }
          : p
      )
    );

  // ---- options ops ----
  const addOption = (pId, qId) =>
    setPassages((ps) =>
      ps.map((p) =>
        p.id === pId
          ? {
              ...p,
              questions: p.questions.map((q) =>
                q.id === qId
                  ? {
                      ...q,
                      options: [
                        ...q.options,
                        { answer: "", question_explanation: "", images: [] },
                      ],
                    }
                  : q
              ),
            }
          : p
      )
    );

  const removeOption = (pId, qId, optIndex) =>
    setPassages((ps) =>
      ps.map((p) => {
        if (p.id !== pId) return p;
        return {
          ...p,
          questions: p.questions.map((q) => {
            if (q.id !== qId) return q;
            if (q.options.length <= 2) return q;
            const nextOpts = q.options.filter(
              (_, i) => i !== optIndex
            );
            let nextCorrect = q.correctIndex;
            if (optIndex <= q.correctIndex)
              nextCorrect = Math.max(0, nextCorrect - 1);
            if (nextCorrect >= nextOpts.length)
              nextCorrect = nextOpts.length - 1;
            return {
              ...q,
              options: nextOpts,
              correctIndex: nextCorrect,
            };
          }),
        };
      })
    );

  const updateOptionField = (
    pId,
    qId,
    optIndex,
    field,
    value
  ) =>
    setPassages((ps) =>
      ps.map((p) =>
        p.id === pId
          ? {
              ...p,
              questions: p.questions.map((q) => {
                if (q.id !== qId) return q;
                const next = q.options.map((opt, i) =>
                  i === optIndex ? { ...opt, [field]: value } : opt
                );
                return { ...q, options: next };
              }),
            }
          : p
      )
    );

  const addOptionImages = (
    pId,
    qId,
    optIndex,
    files
  ) =>
    setPassages((ps) =>
      ps.map((p) =>
        p.id === pId
          ? {
              ...p,
              questions: p.questions.map((q) => {
                if (q.id !== qId) return q;
                const next = q.options.map((opt, i) =>
                  i === optIndex
                    ? { ...opt, images: [...(opt.images || []), ...files] }
                    : opt
                );
                return { ...q, options: next };
              }),
            }
          : p
      )
    );

  const removeOptionImage = (
    padding,
    qIdpadding,
    optIndex,
    imgIdx
  ) =>
    setPassages((ps) =>
      ps.map((p) =>
        p.id === pId
          ? {
              ...p,
              questions: p.questions.map((q) => {
                if (q.id !== qId) return q;
                const next = q.options.map((opt, i) =>
                  i === optIndex
                    ? {
                        ...opt,
                        images: (opt.images || []).filter(
                          (_, k) => k !== imgIdx
                        ),
                      }
                    : opt
                );
                return { ...q, options: next };
              }),
            }
          : p
      )
    );

  const setCorrectIndex = (pId, qId, idx) =>
    setPassages((ps) =>
      ps.map((p) =>
        p.id === pId
          ? {
              ...p,
              questions: p.questions.map((q) =>
                q.id === qId ? { ...q, correctIndex: idx } : q
              ),
            }
          : p
      )
    );

  const isPassage = mcqSubType === "passage";
  const isChemical = mcqSubType === "chemical";
  const isMath = mcqSubType === "math" || mcqSubType === "chemical";

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-gray-900">
          {isPassage
            ? "إدارة القطع وأسئلتها"
            : isMath
            ? "أسئلة معادلات — الإجابات معادلات + دعم مرفقات صور/PDF"
            : "أسئلة (وصف/تعليمات عامة)"}
        </h4>
        {isPassage && (
          <button
            type="button"
            onClick={addPassage}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm hover:bg-gray-50"
          >
            <PlusIcon className="h-4 w-4" />
            إضافة قطعة
          </button>
        )}
      </div>

      {passages.map((p, pIndex) => {
        const questionsCount = p.questions?.length || 0;
        return (
          <div
            key={p.id}
            className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
          >
            <div className="flex items-center justify-between border-b bg-gray-50 px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="text-sm font-semibold text-gray-800">
                  {isPassage
                    ? `قطعة ${pIndex + 1}`
                    : isMath
                    ? `معادلة ${pIndex + 1}`
                    : `وصف عام ${pIndex + 1}`}
                </div>
                <span className="rounded-full border border-blue-100 bg-blue-50 px-2 py-0.5 text-[11px] text-blue-700">
                  {questionsCount} سؤال
                </span>
              </div>

              <button
                type="button"
                onClick={() => removePassage(p.id)}
                className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-sm text-red-600 hover:bg-red-50 hover:text-red-700"
                title="حذف"
              >
                <Trash2 className="h-4 w-4" /> حذف
              </button>
            </div>

            {/* content */}
            <div className="space-y-4 p-4">
              {isChemical ? (
                <>
                  <label className="block text-xs font-semibold text-gray-600">
                    معادلات/صيغ عامة
                  </label>
                  <MathFieldInput
                    value={p.content}
                    onChange={(latex) => updatePassageContent(p.id, latex)}
                    className="w-full"
                    options={{ virtualKeyboardMode: "onfocus" }}
                    placeholder="أدخل المعادلات/الصيغ العامة هنا…"
                  />
                </>
              ) : isMath ? (
                <>
                  <label className="block text-xs font-semibold text-gray-600">
                    المعادلة
                  </label>
                  <MathFieldInput
                    value={p.content}
                    onChange={(latex) => updatePassageContent(p.id, latex)}
                    className="!w-full border border-gray-200"
                    options={{ virtualKeyboardMode: "onfocus" }}
                    placeholder="أدخل المعادلة هنا…"
                  />

                  <AttachmentPicker
                    label="مرفقات المعادلة (صور / PDF)"
                    files={p.attachments || []}
                    onAddFiles={(files) => addPassageFiles(p.id, files)}
                    onRemoveFile={(idx) => removePassageFile(p.id, idx)}
                    accept="application/pdf,image/*"
                    multiple
                  />
                </>
              ) : (
                <LabeledEditor
                  label={
                    isPassage ? "نص القطعة" : "وصف/تعليمات عامة (اختياري)"
                  }
                  value={p.content}
                  onChange={(value) => updatePassageContent(p.id, value)}
                  editorMinH={140}
                  uploadImage={uploadImage}
                  imageSize={FIXED_IMG}
                />
              )}
            </div>

            {/* questions */}
            <div className="p-4 pt-0">
              {isPassage && (
                <div className="mb-3 flex items-center justify-between">
                  <div className="text-sm font-semibold text-gray-700">
                    أسئلة هذه القطعة
                  </div>
                  <button
                    type="button"
                    onClick={() => addQuestion(p.id)}
                    className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm hover:bg-gray-50"
                  >
                    <PlusIcon className="h-4 w-4" /> إضافة سؤال
                  </button>
                </div>
              )}

              <div className="space-y-4">
                {p.questions.map((q, qIndex) => (
                  <div
                    key={q.id}
                    className="rounded-xl border border-gray-200 bg-gray-50 p-4"
                  >
                    {isPassage && (
                      <div className="mb-3 flex items-center justify-between">
                        <div className="text-sm font-medium text-gray-800">
                          سؤال {qIndex + 1}
                        </div>
                        <button
                          type="button"
                          onClick={() => removeQuestion(p.id, q.id)}
                          className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-red-600 hover:bg-red-50 hover:text-red-700"
                          title="حذف السؤال"
                        >
                          <Trash2 className="h-4 w-4" /> حذف
                        </button>
                      </div>
                    )}

                    {isPassage && (
                      <LabeledEditor
                        label="نص السؤال"
                        value={q.text}
                        onChange={(val) =>
                          updateQuestionText(p.id, q.id, val)
                        }
                        editorMinH={110}
                        uploadImage={uploadImage}
                        imageSize={FIXED_IMG}
                      />
                    )}

                    <div className="mt-4 space-y-3">
                      <div className="text-xs font-semibold text-gray-700">
                        الاختيارات
                        {isMath
                          ? " (تُكتب كمعادلات) + مرفقات صور/PDF"
                          : ""}
                      </div>

                      {q.options.map((opt, optIndex) => {
                        const isCorrect = q.correctIndex === optIndex;
                        const letter = String.fromCharCode(65 + optIndex);

                        return (
                          <div
                            key={optIndex}
                            className={`flex flex-col gap-3 rounded-xl border bg-white p-3 shadow-sm transition ${
                              isCorrect
                                ? "ring-1 ring-green-200"
                                : "ring-1 ring-transparent"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <span
                                className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                                  isCorrect
                                    ? "bg-green-600 text-white"
                                    : "bg-gray-100 text-gray-700"
                                }`}
                              >
                                {letter}
                              </span>

                              <label className="flex items-center gap-2 text-xs font-medium text-gray-600">
                                <input
                                  type="radio"
                                  name={`correct-${p.id}-${q.id}`}
                                  checked={isCorrect}
                                  onChange={() =>
                                    setCorrectIndex(
                                      p.id,
                                      q.id,
                                      optIndex
                                    )
                                  }
                                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                                  title="الإجابة الصحيحة"
                                />
                                إجابة صحيحة
                              </label>

                              {q.options.length > 2 && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    removeOption(p.id, q.id, optIndex)
                                  }
                                  className="ml-auto rounded-lg px-2 py-1 text-xs text-red-600 hover:bg-red-50 hover:text-red-800"
                                  title="حذف الاختيار"
                                >
                                  حذف
                                </button>
                              )}
                            </div>

                            {isMath ? (
                              <>
                                <div className="space-y-2">
                                  <label className="block text-xs font-semibold text-gray-600">
                                    معادلة الاختيار
                                  </label>
                                  <MathFieldInput
                                    value={opt.answer}
                                    onChange={(latex) =>
                                      updateOptionField(
                                        p.id,
                                        q.id,
                                        optIndex,
                                        "answer",
                                        latex
                                      )
                                    }
                                    placeholder="مثال: \\frac{a+b}{c}"
                                    className="w-full"
                                    options={{
                                      virtualKeyboardMode: "onfocus",
                                    }}
                                  />
                                </div>

                                <AttachmentPicker
                                  label="مرفقات الاختيار (صور / PDF)"
                                  files={opt.images || []}
                                  onAddFiles={(files) =>
                                    addOptionImages(
                                      p.id,
                                      q.id,
                                      optIndex,
                                      files
                                    )
                                  }
                                  onRemoveFile={(idx) =>
                                    removeOptionImage(
                                      p.id,
                                      q.id,
                                      optIndex,
                                      idx
                                    )
                                  }
                                  accept="application/pdf,image/*"
                                  multiple
                                />
                              </>
                            ) : (
                              <LabeledEditor
                                label="نص الاختيار"
                                value={opt.answer}
                                onChange={(val) =>
                                  updateOptionField(
                                    p.id,
                                    q.id,
                                    optIndex,
                                    "answer",
                                    val
                                  )
                                }
                                editorMinH={90}
                                uploadImage={uploadImage}
                                imageSize={FIXED_IMG}
                              />
                            )}

                            <LabeledEditor
                              label="شرح الاختيار (لماذا هو صحيح/خاطئ)"
                              value={opt.question_explanation}
                              onChange={(value) =>
                                updateOptionField(
                                  p.id,
                                  q.id,
                                  optIndex,
                                  "question_explanation",
                                  value
                                )
                              }
                              editorMinH={90}
                              uploadImage={uploadImage}
                              imageSize={FIXED_IMG}
                            />
                          </div>
                        );
                      })}

                      <button
                        type="button"
                        onClick={() => addOption(p.id, q.id)}
                        className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs shadow-sm hover:bg-gray-50"
                      >
                        <PlusIcon className="h-4 w-4" /> إضافة خيار
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
