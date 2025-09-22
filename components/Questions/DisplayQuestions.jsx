// "use client";
// import React from "react";
// import {
//   BookOpen,
//   ChevronDown,
//   ChevronUp,
//   Edit3,
//   Eye,
//   FileText,
//   Trash2,
//   Check,
//   CheckCircle,
//   Circle,
//   Calculator,
//   PenTool,
//   HelpCircle,
//   Award,
//   Target
// } from "lucide-react";

// /* =============== بطاقة العرض (Card) =============== */
// const Card = ({ title, icon: Icon, children, className = "" }) => (
//   <div className={`bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden ${className}`} dir="rtl">
//     <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
//       <div className="flex items-center gap-3">
//         <div className="bg-white/20 p-2 rounded-lg">
//           <Icon className="h-5 w-5 text-white" />
//         </div>
//         <h3 className="text-lg font-semibold text-white">{title}</h3>
//       </div>
//     </div>
//     <div className="p-6">{children}</div>
//   </div>
// );

// /* =============== زر (Button) =============== */
// const Button = ({
//   children,
//   variant = "primary",
//   size = "md",
//   onClick,
//   disabled = false,
//   className = ""
// }) => {
//   const baseClasses =
//     "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";

//   const variants = {
//     primary:
//       "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 disabled:bg-gray-300",
//     outline:
//       "border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-gray-500",
//     danger:
//       "border border-red-300 text-red-600 bg-white hover:bg-red-50 focus:ring-red-500"
//   };

//   const sizes = {
//     sm: "px-3 py-1.5 text-sm gap-1.5",
//     md: "px-4 py-2 text-sm gap-2",
//     lg: "px-6 py-3 text-base gap-2"
//   };

//   return (
//     <button
//       onClick={onClick}
//       disabled={disabled}
//       className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
//     >
//       {children}
//     </button>
//   );
// };

// export default function DisplayQuestions({
//   toggleSection,
//   examData,
//   expandedSections,
//   questionTypes,
//   setCompleteAnswers,
//   setCompleteText,
//   setCurrentQuestion,
//   setEditingQuestion,
//   setExamData,
//   setMcqCorrectAnswer,
//   setMcqOptions,
//   setModalAnswer,
//   setQuestionType,
//   setSelectedSectionId,
//   setTrueFalseAnswer,
//   setTrueFalseExplanation,
//   setMcqSubType,
//   editMcqPassageQuestion
// }) {
//   /* أيقونة النوع */
//   const getQuestionIcon = (type) => {
//     const icons = {
//       mcq: CheckCircle,
//       trueFalse: Circle,
//       essay: PenTool,
//       complete: FileText
//     };
//     return icons[type] || HelpCircle;
//   };

//   /* ألوان شارة النوع */
//   const getQuestionTypeColor = (type) => {
//     const colors = {
//       mcq: "bg-blue-100 text-blue-700 border-blue-200",
//       trueFalse: "bg-green-100 text-green-700 border-green-200",
//       essay: "bg-purple-100 text-purple-700 border-purple-200",
//       complete: "bg-orange-100 text-orange-700 border-orange-200"
//     };
//     return colors[type] || "bg-gray-100 text-gray-700 border-gray-200";
//   };

//   /* اسم النوع */
//   const getQuestionTypeName = (type) => {
//     const names = {
//       mcq: "اختيار من متعدد",
//       trueFalse: "صح / خطأ",
//       essay: "مقال",
//       complete: "إكمال"
//     };
//     return names[type] || "غير معروف";
//   };

//   /* عرض MCQ العام */
//   const renderGeneralMcq = (question) => (
//     <div className="space-y-3">
//       <div className="flex items-center gap-2 mb-3">
//         <Target className="h-4 w-4 text-blue-500" />
//         <p className="text-sm font-medium text-gray-700">خيارات الإجابة:</p>
//       </div>
//       <div className="grid grid-cols-1 gap-3">
//         {question.options.map((option, optIndex) => (
//           <div
//             key={optIndex}
//             className={`p-3 rounded-lg border-2 transition-all duration-200 ${
//               optIndex === question.correctAnswer
//                 ? "border-green-300 bg-green-50 shadow-sm"
//                 : "border-gray-200 bg-gray-50 hover:bg-gray-100"
//             }`}
//           >
//             <div className="flex items-center gap-3">
//               <div className="relative">
//                 {optIndex === question.correctAnswer ? (
//                   <CheckCircle className="w-5 h-5 text-green-600" />
//                 ) : (
//                   <Circle className="w-5 h-5 text-gray-400" />
//                 )}
//               </div>
//               <span className="font-medium text-gray-600 text-xs bg-white px-2 py-1 rounded">
//                 {String.fromCharCode(65 + optIndex)}
//               </span>
//               <span className="text-sm text-gray-800 flex-1">{option}</span>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );

//   /* عرض MCQ المسطّح (سؤال + قطعة/معادلة واحدة مرفقة) */
//   const renderFlattenedMcq = (question) => (
//     <div className="space-y-4">
//       {question.passage?.content && (
//         <div className="rounded-lg border-2 border-gray-200 p-4 bg-gradient-to-br from-gray-50 to-gray-100">
//           <div className="flex items-center gap-2 mb-3">
//             {question.mcqSubType === "chemical" ? (
//               <Calculator className="h-4 w-4 text-purple-600" />
//             ) : (
//               <FileText className="h-4 w-4 text-blue-600" />
//             )}
//             <p className="text-sm font-semibold text-gray-700">
//               {question.mcqSubType === "chemical"
//                 ? "معادلة رياضية (LaTeX)"
//                 : "نص القطعة"}
//             </p>
//           </div>
//           {question.mcqSubType === "chemical" ? (
//             <div className="bg-white border border-gray-300 rounded-lg p-3 font-mono text-sm overflow-x-auto shadow-inner">
//               <code>{question.passage.content}</code>
//             </div>
//           ) : (
//             <div className="bg-white border border-gray-300 rounded-lg p-3 text-sm leading-relaxed shadow-inner">
//               <p className="text-gray-700 whitespace-pre-line">
//                 {question.passage.content}
//               </p>
//             </div>
//           )}
//         </div>
//       )}

//       {Array.isArray(question.options) && renderGeneralMcq(question)}
//     </div>
//   );

//   /* دعم البنية القديمة (passages[]) إن وُجدت */
//   const renderLegacyNestedMcq = (question) => (
//     <div className="space-y-4">
//       {question.passages.map((p, pIdx) => (
//         <div
//           key={p.id || pIdx}
//           className="rounded-lg border-2 border-gray-200 bg-gradient-to-br from-gray-50 to-white overflow-hidden"
//         >
//           <div className="bg-gradient-to-r from-gray-100 to-gray-50 p-4 border-b border-gray-200">
//             <div className="flex items-center gap-3">
//               {question.mcqSubType === "chemical" ? (
//                 <Calculator className="h-5 w-5 text-purple-600" />
//               ) : (
//                 <FileText className="h-5 w-5 text-blue-600" />
//               )}
//               <h4 className="text-sm font-semibold text-gray-800">
//                 {p.title ||
//                   (question.mcqSubType === "chemical"
//                     ? `معادلة ${pIdx + 1}`
//                     : `قطعة ${pIdx + 1}`)}
//               </h4>
//             </div>

//             {question.mcqSubType === "passage" && p.content && (
//               <div className="mt-3 bg-white rounded-lg p-3 border border-gray-200">
//                 <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
//                   {p.content}
//                 </p>
//               </div>
//             )}

//             {question.mcqSubType === "chemical" && p.latex && (
//               <div className="mt-3 bg-white rounded-lg p-3 border border-gray-200 font-mono">
//                 <code className="text-xs text-gray-700">{p.latex}</code>
//               </div>
//             )}
//           </div>

//           <div className="p-4 space-y-4">
//             {Array.isArray(p.questions) &&
//               p.questions.map((pq, pqIdx) => (
//                 <div
//                   key={pq.id || pqIdx}
//                   className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm"
//                 >
//                   <div className="flex items-start gap-3 mb-3">
//                     <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
//                       س{pqIdx + 1}
//                     </span>
//                     <p className="text-sm font-medium text-gray-800 flex-1">
//                       {pq.text || (
//                         <span className="text-gray-400 italic">لا يوجد نص</span>
//                       )}
//                     </p>
//                   </div>

//                   <div className="grid grid-cols-1 gap-2 ml-8">
//                     {Array.isArray(pq.answers) &&
//                       pq.answers.map((ans, aIdx) => (
//                         <div
//                           key={aIdx}
//                           className={`p-2 rounded-lg border transition-all duration-200 ${
//                             ans.isCorrect
//                               ? "border-green-300 bg-green-50"
//                               : "border-gray-200 bg-gray-50"
//                           }`}
//                         >
//                           <div className="flex items-center gap-3">
//                             {ans.isCorrect ? (
//                               <CheckCircle className="h-4 w-4 text-green-600" />
//                             ) : (
//                               <Circle className="h-4 w-4 text-gray-400" />
//                             )}
//                             <span className="font-medium text-gray-600 text-xs bg-white px-2 py-1 rounded">
//                               {String.fromCharCode(65 + aIdx)}
//                             </span>
//                             <span className="text-sm text-gray-800">
//                               {ans.text || (
//                                 <span className="text-gray-400 italic">
//                                   لا يوجد نص للإجابة
//                                 </span>
//                               )}
//                             </span>
//                           </div>
//                         </div>
//                       ))}
//                   </div>

//                   {pq.allowMultipleCorrect && (
//                     <div className="mt-3 ml-8">
//                       <span className="inline-flex items-center gap-1 text-xs text-amber-700 bg-amber-50 px-2 py-1 rounded-full border border-amber-200">
//                         <Award className="h-3 w-3" />
//                         يسمح بأكثر من إجابة صحيحة
//                       </span>
//                     </div>
//                   )}
//                 </div>
//               ))}
//           </div>
//         </div>
//       ))}
//     </div>
//   );

//   /* إحصائيات القسم */
//   const getSectionStats = (section) => {
//     const totalQuestions = section?.questions?.length || 0;
//     const questionTypeBreakdown =
//       section?.questions?.reduce((acc, q) => {
//         acc[q.type] = (acc[q.type] || 0) + 1;
//         return acc;
//       }, {}) || {};

//     return { totalQuestions, questionTypeBreakdown };
//   };

//   return (
//     <Card title="الأسئلة المضافة" icon={Eye} className="mt-6">
//       <div className="space-y-6">
//         {examData?.sections?.map((section) => {
//           const { totalQuestions, questionTypeBreakdown } =
//             getSectionStats(section);

//           return (
//             <div
//               key={section.id}
//               className="border-2 border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
//             >
//               <div
//                 className="flex items-center justify-between p-5 bg-gradient-to-r from-gray-50 to-gray-100 cursor-pointer hover:from-gray-100 hover:to-gray-150 transition-all duration-200"
//                 onClick={() => toggleSection(section.id)}
//               >
//                 <div className="flex items-center gap-4">
//                   <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-xl shadow-md">
//                     <BookOpen className="h-5 w-5 text-white" />
//                   </div>
//                   <div>
//                     <h4 className="font-semibold text-gray-900 text-lg">
//                       {section?.name}
//                     </h4>
//                     <div className="flex items-center gap-4 mt-1">
//                       <span className="text-sm text-gray-600 flex items-center gap-1">
//                         <FileText className="h-4 w-4" />
//                         {totalQuestions} سؤال
//                       </span>
//                       {totalQuestions > 0 && (
//                         <div className="flex items-center gap-2">
//                           {Object.entries(questionTypeBreakdown).map(
//                             ([type, count]) => (
//                               <span
//                                 key={type}
//                                 className={`text-xs px-2 py-1 rounded-full border ${getQuestionTypeColor(
//                                   type
//                                 )}`}
//                               >
//                                 {getQuestionTypeName(type)}: {count}
//                               </span>
//                             )
//                           )}
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   {totalQuestions > 0 && (
//                     <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
//                       {totalQuestions}
//                     </div>
//                   )}
//                   <div className="flex items-center gap-2 text-gray-500">
//                     <span className="text-sm font-medium">
//                       {expandedSections[section.id] ? "إخفاء" : "عرض"}
//                     </span>
//                     {expandedSections[section.id] ? (
//                       <ChevronUp className="h-5 w-5" />
//                     ) : (
//                       <ChevronDown className="h-5 w-5" />
//                     )}
//                   </div>
//                 </div>
//               </div>

//               {expandedSections[section.id] && (
//                 <div className="p-6 bg-white">
//                   {section?.questions?.length === 0 ? (
//                     <div className="text-center py-12">
//                       <div className="bg-gray-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
//                         <FileText className="h-8 w-8 text-gray-400" />
//                       </div>
//                       <p className="text-lg font-medium text-gray-600 mb-2">
//                         لا توجد أسئلة بعد
//                       </p>
//                       <p className="text-sm text-gray-500">
//                         ابدأ بإضافة أسئلة لهذا القسم
//                       </p>
//                     </div>
//                   ) : (
//                     <div className="space-y-6">
//                       {section?.questions?.map((question, index) => {
//                         const QuestionIcon = getQuestionIcon(question.type);

//                         return (
//                           <div
//                             key={question.id}
//                             className="bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-xl p-6 hover:shadow-md transition-all duration-200"
//                           >
//                             <div className="flex items-start justify-between mb-4">
//                               <div className="flex items-center gap-4">
//                                 <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-lg">
//                                   <QuestionIcon className="h-5 w-5 text-white" />
//                                 </div>
//                                 <div>
//                                   <div className="flex items-center gap-3 mb-1">
//                                     <span
//                                       className={`px-3 py-1 rounded-full text-xs font-semibold border ${getQuestionTypeColor(
//                                         question.type
//                                       )}`}
//                                     >
//                                       {getQuestionTypeName(question.type)}
//                                     </span>
//                                     <span className="text-sm font-medium text-gray-600">
//                                       السؤال {index + 1}
//                                     </span>
//                                   </div>
//                                   {question.points && (
//                                     <div className="flex items-center gap-1 text-xs text-gray-500">
//                                       <Award className="h-3 w-3" />
//                                       {question.points} درجة
//                                     </div>
//                                   )}
//                                 </div>
//                               </div>

//                               <div className="flex items-center gap-2">
//                                 <Button
//                                   variant="outline"
//                                   size="sm"
//                                   onClick={() => {
//                                     setEditingQuestion(question);
//                                     setQuestionType(question.type);
//                                     setCurrentQuestion(question.question);
//                                     setSelectedSectionId(section.id);

//                                     if (question.type === "mcq") {
//                                       setMcqSubType(
//                                         question.mcqSubType || "general"
//                                       );
//                                       if (
//                                         question.mcqSubType &&
//                                         question.mcqSubType !== "general"
//                                       ) {
//                                         editMcqPassageQuestion?.(question);
//                                       } else {
//                                         setMcqOptions(
//                                           question.options || [
//                                             "",
//                                             "",
//                                             "",
//                                             ""
//                                           ]
//                                         );
//                                         setMcqCorrectAnswer(
//                                           typeof question.correctAnswer ===
//                                             "number"
//                                             ? question.correctAnswer
//                                             : 0
//                                         );
//                                       }
//                                     } else if (question.type === "trueFalse") {
//                                       setTrueFalseAnswer(
//                                         question.correctAnswer ?? null
//                                       );
//                                       setTrueFalseExplanation(
//                                         question.explanation || ""
//                                       );
//                                     } else if (question.type === "essay") {
//                                       setModalAnswer(
//                                         question.modelAnswer || ""
//                                       );
//                                     } else if (question.type === "complete") {
//                                       setCompleteText(question.text || "");
//                                       setCompleteAnswers(
//                                         question.answers || [{ answer: "" }]
//                                       );
//                                     }
//                                   }}
//                                   className="hover:bg-blue-50 hover:border-blue-300"
//                                 >
//                                   <Edit3 className="h-4 w-4" />
//                                   تعديل
//                                 </Button>
//                                 <Button
//                                   variant="danger"
//                                   size="sm"
//                                   onClick={() => {
//                                     const updated =
//                                       examData?.sections?.map((s) =>
//                                         s.id === section.id
//                                           ? {
//                                               ...s,
//                                               questions: s.questions.filter(
//                                                 (q) => q.id !== question.id
//                                               )
//                                             }
//                                           : s
//                                       );
//                                     setExamData((p) => ({
//                                       ...p,
//                                       sections: updated
//                                     }));
//                                   }}
//                                   className="hover:bg-red-50"
//                                 >
//                                   <Trash2 className="h-4 w-4" />
//                                   حذف
//                                 </Button>
//                               </div>
//                             </div>

//                             {/* نص السؤال */}
//                             {question?.question && (
//                               <div className="mb-4 p-4 bg-white rounded-lg border border-gray-200">
//                                 <h5 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
//                                   <HelpCircle className="h-4 w-4 text-blue-500" />
//                                   نص السؤال:
//                                 </h5>
//                                 <p className="text-gray-900 leading-relaxed">
//                                   {question?.question}
//                                 </p>
//                               </div>
//                             )}

//                             {/* عرض اختيار من متعدد */}
//                             {question?.type === "mcq" && (
//                               <>
//                                 {question.mcqSubType && (
//                                   <div className="mb-4">
//                                     <span className="inline-flex items-center gap-2 text-xs px-3 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-200">
//                                       {question.mcqSubType === "general" && (
//                                         <>
//                                           <CheckCircle className="h-3 w-3" />
//                                           أسئلة عامة
//                                         </>
//                                       )}
//                                       {question.mcqSubType === "passage" && (
//                                         <>
//                                           <FileText className="h-3 w-3" />
//                                           سؤال مبني على قطعة
//                                         </>
//                                       )}
//                                       {question.mcqSubType === "chemical" && (
//                                         <>
//                                           <Calculator className="h-3 w-3" />
//                                           معادلات رياضية
//                                         </>
//                                       )}
//                                     </span>
//                                   </div>
//                                 )}

//                                 {question.mcqSubType === "general" &&
//                                   Array.isArray(question.options) &&
//                                   renderGeneralMcq(question)}

//                                 {question.mcqSubType !== "general" &&
//                                   question.passage &&
//                                   renderFlattenedMcq(question)}

//                                 {question.mcqSubType !== "general" &&
//                                   Array.isArray(question.passages) &&
//                                   renderLegacyNestedMcq(question)}
//                               </>
//                             )}

//                             {/* صح / خطأ */}
//                             {question?.type === "trueFalse" && (
//                               <div className="bg-white rounded-lg border border-gray-200 p-4">
//                                 <div className="flex items-center gap-3 mb-2">
//                                   <Target className="h-4 w-4 text-blue-500" />
//                                   <span className="text-sm font-medium text-gray-700">
//                                     الإجابة:
//                                   </span>
//                                 </div>
//                                 <div className="flex items-center gap-4">
//                                   <span
//                                     className={`px-4 py-2 rounded-lg text-sm font-medium border-2 ${
//                                       question.correctAnswer
//                                         ? "bg-green-50 text-green-700 border-green-300"
//                                         : "bg-red-50 text-red-700 border-red-300"
//                                     }`}
//                                   >
//                                     {question.correctAnswer ? "صحيح" : "خطأ"}
//                                   </span>
//                                   {question.explanation && (
//                                     <div className="flex-1">
//                                       <span className="text-sm text-gray-600 italic">
//                                         الشرح: {question.explanation}
//                                       </span>
//                                     </div>
//                                   )}
//                                 </div>
//                               </div>
//                             )}

//                             {/* مقال */}
//                             {question.type === "essay" && (
//                               <div className="bg-white rounded-lg border border-gray-200 p-4">
//                                 <div className="flex items-center gap-2 mb-3">
//                                   <PenTool className="h-4 w-4 text-purple-500" />
//                                   <p className="text-sm font-medium text-gray-700">
//                                     الإجابة النموذجية:
//                                   </p>
//                                 </div>
//                                 <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
//                                   <p className="text-sm text-gray-700 leading-relaxed">
//                                     {question.modelAnswer}
//                                   </p>
//                                 </div>
//                               </div>
//                             )}

//                             {/* إكمال */}
//                             {question.type === "complete" && (
//                               <div className="space-y-4">
//                                 <div className="bg-white rounded-lg border border-gray-200 p-4">
//                                   <div className="flex items-center gap-2 mb-3">
//                                     <FileText className="h-4 w-4 text-orange-500" />
//                                     <p className="text-sm font-medium text-gray-700">
//                                       النص الناقص:
//                                     </p>
//                                   </div>
//                                   <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
//                                     <p className="text-sm text-gray-700 leading-relaxed">
//                                       {question.text}
//                                     </p>
//                                   </div>
//                                 </div>

//                                 <div className="bg-white rounded-lg border border-gray-200 p-4">
//                                   <div className="flex items-center gap-2 mb-3">
//                                     <Target className="h-4 w-4 text-green-500" />
//                                     <p className="text-sm font-medium text-gray-700">
//                                       الإجابات الصحيحة:
//                                     </p>
//                                   </div>
//                                   <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                                     {question.answers?.map(
//                                       (answer, ansIndex) => (
//                                         <div
//                                           key={ansIndex}
//                                           className="bg-green-50 border-2 border-green-200 rounded-lg p-3"
//                                         >
//                                           <div className="flex items-center gap-3">
//                                             <CheckCircle className="h-4 w-4 text-green-600" />
//                                             <span className="text-sm font-medium text-green-800">
//                                               {answer.answer}
//                                             </span>
//                                           </div>
//                                         </div>
//                                       )
//                                     )}
//                                   </div>
//                                 </div>
//                               </div>
//                             )}
//                           </div>
//                         );
//                       })}
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>
//           );
//         })}

//         {examData?.sections?.every((s) => (s.questions?.length || 0) === 0) && (
//           <div className="text-center py-16">
//             <div className="bg-gradient-to-br from-gray-100 to-gray-200 p-6 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
//               <FileText className="h-12 w-12 text-gray-400" />
//             </div>
//             <h3 className="text-xl font-semibold text-gray-600 mb-2">
//               لم يتم إضافة أي أسئلة بعد
//             </h3>
//             <p className="text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
//               ابدأ بإنشاء الاختبار عبر إضافة أسئلة من النموذج بالأعلى. يمكنك
//               إضافة أنواع متعددة مثل اختيار من متعدد، صح/خطأ، مقال، وإكمال.
//             </p>
//           </div>
//         )}
//       </div>
//     </Card>
//   );
// }


"use client";
import React from "react";
import { Edit3, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import Card from "./ExamCard";
import Button from "../atoms/Button";

export default function DisplayQuestions({
  toggleSection,
  examData,
  expandedSections,
  questionTypes,
  setCompleteAnswers,
  setCompleteText,
  setCurrentQuestion,
  setEditingQuestion,
  setExamData,
  setMcqCorrectAnswer,
  setMcqOptions,
  setModalAnswer,
  setQuestionType,
  setSelectedSectionId,
  setTrueFalseAnswer,
  setTrueFalseExplanation,
  setMcqSubType,
  editMcqPassageQuestion,
}) {
  const handleEditQuestion = (question, sectionId) => {
    setQuestionType(question.type);
    setCurrentQuestion(question.question || "");
    setSelectedSectionId(sectionId);
    setEditingQuestion(question);

    // Set question type specific data
    switch (question.type) {
      case "mcq":
        if (question.mcqSubType && question.mcqSubType !== "general") {
          // Handle passage-based MCQ questions
          editMcqPassageQuestion(question);
        } else {
          // Handle general MCQ questions
          setMcqOptions(question.options || ["", "", "", ""]);
          setMcqCorrectAnswer(
            typeof question.correctAnswer === "number" ? question.correctAnswer : 0
          );
          setMcqSubType("general");
        }
        break;
      case "trueFalse":
        setTrueFalseAnswer(question.correctAnswer);
        setTrueFalseExplanation(question.explanation || "");
        break;
      case "essay":
        setModalAnswer(question.modelAnswer || "");
        break;
      case "complete":
        setCompleteText(question.text || "");
        setCompleteAnswers(question.answers || [{ answer: "" }]);
        break;
      default:
        break;
    }

    // Scroll to the question form
    document.getElementById("question-form")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleDeleteQuestion = (questionId, sectionId) => {
    if (confirm("هل أنت متأكد من حذف هذا السؤال؟")) {
      const updatedSections = examData.sections.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            questions: section.questions.filter((q) => q.id !== questionId),
          };
        }
        return section;
      });

      setExamData({ ...examData, sections: updatedSections });
    }
  };

  const renderQuestionContent = (question) => {
    switch (question.type) {
      case "mcq":
        return (
          <div className="space-y-2">
            <p className="text-sm text-gray-700">{question.question}</p>
            <div className="space-y-1">
              {question.options?.map((option, idx) => (
                <div
                  key={idx}
                  className={`text-xs p-2 rounded ${
                    idx === question.correctAnswer
                      ? "bg-green-100 text-green-800 border border-green-200"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {String.fromCharCode(1632 + idx + 1)}. {option}
                </div>
              ))}
            </div>
            {question.passage && (
              <div className="mt-2 p-2 bg-blue-50 rounded border border-blue-200">
                <p className="text-xs text-blue-800 font-medium">القطعة:</p>
                <p className="text-xs text-blue-700">{question.passage.content}</p>
              </div>
            )}
          </div>
        );
      case "trueFalse":
        return (
          <div className="space-y-2">
            <p className="text-sm text-gray-700">{question.question}</p>
            <div
              className={`text-xs p-2 rounded ${
                question.correctAnswer
                  ? "bg-green-100 text-green-800 border border-green-200"
                  : "bg-red-100 text-red-800 border border-red-200"
              }`}
            >
              الإجابة: {question.correctAnswer ? "صحيح" : "خطأ"}
            </div>
            {question.explanation && (
              <div className="mt-2 p-2 bg-gray-50 rounded border border-gray-200">
                <p className="text-xs text-gray-800 font-medium">الشرح:</p>
                <p className="text-xs text-gray-700">{question.explanation}</p>
              </div>
            )}
          </div>
        );
      case "essay":
        return (
          <div className="space-y-2">
            <p className="text-sm text-gray-700">{question.question}</p>
            {question.modelAnswer && (
              <div className="mt-2 p-2 bg-blue-50 rounded border border-blue-200">
                <p className="text-xs text-blue-800 font-medium">الإجابة النموذجية:</p>
                <p className="text-xs text-blue-700">{question.modelAnswer}</p>
              </div>
            )}
          </div>
        );
      case "complete":
        return (
          <div className="space-y-2">
            <p className="text-sm text-gray-700">{question.text}</p>
            <div className="space-y-1">
              {question.answers?.map((answer, idx) => (
                <div
                  key={idx}
                  className="text-xs p-2 bg-green-100 text-green-800 rounded border border-green-200"
                >
                  الإجابة {idx + 1}: {answer.answer}
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return <p className="text-sm text-gray-700">{question.question}</p>;
    }
  };

  return (
    <Card title="الأسئلة المضافة" icon={Edit3}>
      <div className="space-y-4">
        {examData.sections.map((section) => (
          <div key={section.id} className="border rounded-lg overflow-hidden">
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full p-4 bg-gray-50 flex items-center justify-between text-right"
            >
              <div className="flex items-center gap-3">
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  {section.questions?.length || 0}
                </span>
                <h3 dangerouslySetInnerHTML={{__html : section?.name}} className="font-medium text-gray-900"></h3>
              </div>
              {expandedSections[section.id] ? (
                <ChevronUp className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              )}
            </button>

            {expandedSections[section.id] && (
              <div className="p-4 space-y-4">
                {section.questions?.length === 0 ? (
                  <p className="text-center text-gray-500 py-4">لا توجد أسئلة في هذا القسم بعد</p>
                ) : (
                  section.questions?.map((question, index) => (
                    <div
                      key={question.id}
                      className="border rounded-lg p-4 bg-white shadow-sm"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">
                            {index + 1}
                          </span>
                          <span className="text-xs font-medium px-2.5 py-0.5 rounded text-white bg-blue-600">
                            {questionTypes.find((t) => t.value === question.type)?.label}
                          </span>
                          {question.mcqSubType && question.mcqSubType !== "general" && (
                            <span className="text-xs font-medium px-2.5 py-0.5 rounded text-white bg-purple-600">
                              {question.mcqSubType === "chemical" ? "معادلات" : "قطعة"}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            icon={<Edit3 className="h-4 w-4" />}
                            onClick={() => handleEditQuestion(question, section.id)}
                          >
                            تعديل
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            icon={<Trash2 className="h-4 w-4" />}
                            onClick={() => handleDeleteQuestion(question.id, section.id)}
                          >
                            حذف
                          </Button>
                        </div>
                      </div>
                      {renderQuestionContent(question)}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}