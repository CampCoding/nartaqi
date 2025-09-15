// "use client";

// import React, { useEffect, useMemo, useState } from "react";
// import {
//   BarChart3,
//   Book,
//   Eye,
//   PlusIcon,
//   SaveIcon,
//   Trash2,
//   ChevronLeft,
//   CheckCircle2,
//   AlertCircle,
// } from "lucide-react";
// import BreadcrumbsShowcase from "../ui/BreadCrumbs";
// import Button from "../atoms/Button";
// import TextArea from "../atoms/TextArea";
// import Card from "../atoms/Card";
// import PagesHeader from "../ui/PagesHeader";
// import { useParams } from "next/navigation";
// import McqSharedPassageEditor from "./McqQuestions";
// import { mock_exam_section_Data } from "../../app/(admin)/exam_sections/page";
// import QuestionTypes from "./QuestionTypes";
// import QuestionSections from "./QuestionSections";
// import QuestionLivePreview from "./QuestionLivePreview";
// import Input from "../atoms/Input";

// const CreateQuestion = () => {
//   // اختبار
//   const [examName, setExamName] = useState("");
//   const [examDuration, setExamDuration] = useState(30);
//   const [examType, setExamType] = useState("intern");
//   const [selectedSection, setSelectedSection] = useState([]); // updated to allow multiple sections
//   const [filteredData, setFilteredData] = useState([]);

//   // إدارة الأسئلة
//   const [questions, setQuestions] = useState([]);
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1); // -1 = شاشة الاختبار، -2 = إضافة سؤال جديد، >=0 = تحرير

//   // حالة السؤال الحالي
//   const [questionType, setQuestionType] = useState("mcq");
//   const [question, setQuestion] = useState("");
//   const [modalAnswer, setModalAnswer] = useState("");
//   const [options, setOptions] = useState([
//     { text: "", explanation: "", isCorrect: false },
//     { text: "", explanation: "", isCorrect: false },
//   ]);
//   const [allowMultipleCorrect, setAllowMultipleCorrect] = useState(false); // جديد: أكثر من إجابة صحيحة
//   const [trueFalseAnswer, setTrueFalseAnswer] = useState(null);
//   const [trueFalseExplanation, setTrueFalseExplanation] = useState("");
//   const [difficulty, setDifficulty] = useState("medium");
//   const [tags, setTags] = useState("");
//   const [timeLimit, setTimeLimit] = useState("");
//   const [points, setPoints] = useState("1");
//   const [completeText, setCompleteText] = useState("");
//   const [completeAnswers, setCompleteAnswers] = useState([{ answer: "" }]);

//   // قطعة ثابتة اختيارية داخل MCQ
//   const [mcqHasPassage, setMcqHasPassage] = useState(false);
//   const [mcqPassageText, setMcqPassageText] = useState("");

//   // أكمل
//   const addCompleteAnswer = () =>
//     setCompleteAnswers([...completeAnswers, { answer: "" }]);
//   const removeCompleteAnswer = (index) => {
//     if (completeAnswers.length > 1)
//       setCompleteAnswers(completeAnswers.filter((_, i) => i !== index));
//   };
//   const updateCompleteAnswer = (index, value) => {
//     setCompleteAnswers((prev) => {
//       const next = prev.map((a) => ({ ...a }));
//       next[index].answer = value;
//       return next;
//     });
//   };

//   const handleQuestionTypeChange = (type) => {
//     setQuestionType(type);
//     if (type === "trueFalse") {
//       setTrueFalseAnswer(null);
//       setTrueFalseExplanation("");
//       setOptions([
//         { text: "", explanation: "", isCorrect: false },
//         { text: "", explanation: "", isCorrect: false },
//       ]);
//       setAllowMultipleCorrect(false);
//       setMcqHasPassage(false);
//       setMcqPassageText("");
//     } else if (type === "complete") {
//       setCompleteText("");
//       setCompleteAnswers([{ answer: "" }]);
//       setAllowMultipleCorrect(false);
//       setMcqHasPassage(false);
//       setMcqPassageText("");
//     } else if (type === "essay") {
//       setAllowMultipleCorrect(false);
//       setMcqHasPassage(false);
//       setMcqPassageText("");
//     } else if (type === "mcq") {
//       setOptions([
//         { text: "", explanation: "", isCorrect: false },
//         { text: "", explanation: "", isCorrect: false },
//       ]);
//       setAllowMultipleCorrect(false);
//       setMcqHasPassage(false);
//       setMcqPassageText("");
//     }
//   };

//   // حفظ السؤال (مع خيار المتابعة لإضافة آخر)
//   const addQuestionToExam = (timeForSection, question) => {
//     if (!isFormValid()) return;

//     const passageForSave =
//       questionType === "mcq" ? (mcqHasPassage ? mcqPassageText : "") : "";

//     const newQuestion = {
//       id: Date.now(),
//       type: questionType,
//       question,
//       options: questionType === "mcq" ? [...options] : [],
//       allowMultipleCorrect,
//       trueFalseAnswer,
//       trueFalseExplanation,
//       modalAnswer,
//       completeText,
//       completeAnswers: [...completeAnswers],
//       passageText: passageForSave,
//       difficulty,
//       tags,
//       timeLimit: timeForSection, // Set dynamic time limit here
//       points,
//     };

//     if (currentQuestionIndex >= 0) {
//       const updated = [...questions];
//       updated[currentQuestionIndex] = newQuestion;
//       setQuestions(updated);
//     } else {
//       setQuestions((prev) => [...prev, newQuestion]);
//     }

//     resetQuestionForm(true); // Keep question type to speed up input
//     setCurrentQuestionIndex(stayInCreate ? -2 : -1); // Stay in add mode or return to the list
//   };

//   // تحرير سؤال
//   const editQuestion = (index) => {
//     const q = questions[index];
//     setQuestionType(q.type);
//     setQuestion(q.question || "");
//     setOptions(q.options || []);
//     setAllowMultipleCorrect(!!q.allowMultipleCorrect);
//     setTrueFalseAnswer(q.trueFalseAnswer ?? null);
//     setTrueFalseExplanation(q.trueFalseExplanation || "");
//     setModalAnswer(q.modalAnswer || "");
//     setCompleteText(q.completeText || "");
//     setCompleteAnswers(q.completeAnswers || [{ answer: "" }]);
//     setDifficulty(q.difficulty || "medium");
//     setTags(q.tags || "");
//     setTimeLimit(q.timeLimit || "");
//     setPoints(q.points || "1");

//     if (q.type === "mcq" && (q.passageText || "").trim()) {
//       setMcqHasPassage(true);
//       setMcqPassageText(q.passageText);
//     } else {
//       setMcqHasPassage(false);
//       setMcqPassageText("");
//     }

//     setCurrentQuestionIndex(index);
//   };

//   const deleteQuestion = (index) =>
//     setQuestions(questions.filter((_, i) => i !== index));

//   const resetQuestionForm = (keepType = false) => {
//     if (!keepType) setQuestionType("mcq");
//     setQuestion("");
//     setOptions([
//       { text: "", explanation: "", isCorrect: false },
//       { text: "", explanation: "", isCorrect: false },
//     ]);
//     setAllowMultipleCorrect(false);
//     setTrueFalseAnswer(null);
//     setTrueFalseExplanation("");
//     setModalAnswer("");
//     setCompleteText("");
//     setCompleteAnswers([{ answer: "" }]);
//     setDifficulty("medium");
//     setTags("");
//     setTimeLimit("");
//     setPoints("1");
//     setMcqHasPassage(false);
//     setMcqPassageText("");
//   };
//   const difficultyOptions = [
//     { value: "easy", label: "سهل", color: "from-green-400 to-green-500" },
//     { value: "medium", label: "متوسط", color: "from-yellow-400 to-yellow-500" },
//     { value: "hard", label: "صعب", color: "from-red-400 to-red-500" },
//   ];

//   const breadcrumbs = [
//     { label: "الرئيسية", href: "/", icon: BarChart3 },
//     { label: "الاختبارات", href: "#" },
//   ];

//   // التحقق
//   const isFormValid = () => {
//     if (currentQuestionIndex === -1 && (!examName.trim() || !examDuration))
//       return false;

//     switch (questionType) {
//       case "mcq":
//         return (
//           question.trim() &&
//           options.every((opt) => opt.text.trim()) &&
//           options.some((opt) => opt.isCorrect) &&
//           difficulty
//         );
//       case "trueFalse":
//         return question.trim() && trueFalseAnswer !== null && difficulty;
//       case "essay":
//         return question.trim() && modalAnswer.trim() && difficulty;
//       case "complete":
//         return (
//           completeText.trim() &&
//           completeAnswers.every((ans) => ans.answer.trim()) &&
//           difficulty
//         );
//       default:
//         return false;
//     }
//   };

//   const isExamFormValid = () =>
//     examName.trim() && examDuration > 0 && questions.length > 0;

//   // كارت المعاينة في قائمة الأسئلة
//   const renderQuestionPreview = (q, index) => (
//     <div key={q.id} className="border rounded-lg p-4 mb-4">
//       <div className="flex justify-between items-center mb-3">
//         <h4 className="font-medium">السؤال {index + 1}</h4>
//         <div className="flex gap-2">
//           <Button type="text" onClick={() => editQuestion(index)}>
//             تعديل
//           </Button>
//           <Button
//             type="text"
//             onClick={() => deleteQuestion(index)}
//             className="text-red-500 hover:bg-red-50"
//           >
//             <Trash2 className="w-4 h-4" />
//           </Button>
//         </div>
//       </div>

//       <div className="mb-2">
//         <span className="text-sm text-gray-500">النوع: </span>
//         <span className="text-sm font-medium">
//           {q.type === "mcq"
//             ? "اختيار من متعدد"
//             : q.type === "trueFalse"
//             ? "صح/خطأ"
//             : q.type === "essay"
//             ? "مقالي"
//             : q.type === "complete"
//             ? "أكمل"
//             : ""}
//         </span>
//         {q.type === "mcq" && (
//           <span className="text-xs ml-2 px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
//             {q.allowMultipleCorrect
//               ? "متعدد الإجابات الصحيحة"
//               : "إجابة صحيحة واحدة"}
//           </span>
//         )}
//       </div>

//       <div className="mb-2">
//         <span className="text-sm text-gray-500">الصعوبة: </span>
//         <span className="text-sm font-medium">
//           {q.difficulty === "easy"
//             ? "سهل"
//             : q.difficulty === "medium"
//             ? "متوسط"
//             : "صعب"}
//         </span>
//       </div>

//       <div className="mt-3 p-3 bg-gray-50 rounded-lg space-y-3">
//         {q.type === "mcq" && q.passageText && (
//           <div className="p-3 bg-white rounded border">
//             <div className="text-xs text-gray-500 mb-1">نص القطعة:</div>
//             <div className="text-sm whitespace-pre-wrap">{q.passageText}</div>
//           </div>
//         )}

//         {q.type === "mcq" && (
//           <>
//             <p className="font-medium mb-2">{q.question}</p>
//             <ul className="list-disc list-inside space-y-1">
//               {q.options.map((opt, i) => (
//                 <li
//                   key={i}
//                   className={opt.isCorrect ? "text-green-600 font-medium" : ""}
//                 >
//                   {opt.text} {opt.isCorrect && "✓"}
//                 </li>
//               ))}
//             </ul>
//           </>
//         )}

//         {q.type === "trueFalse" && (
//           <p className="font-medium">
//             {q.question} - الإجابة: {q.trueFalseAnswer ? "صحيح" : "خطأ"}
//           </p>
//         )}

//         {q.type === "essay" && (
//           <>
//             <p className="font-medium mb-2">{q.question}</p>
//             <p className="text-sm text-gray-600">
//               الإجابة النموذجية: {q.modalAnswer}
//             </p>
//           </>
//         )}

//         {q.type === "complete" && (
//           <>
//             <p className="font-medium mb-2">{q.completeText}</p>
//             <p className="text-sm text-gray-600">
//               عدد الفراغات: {q.completeAnswers.length}
//             </p>
//           </>
//         )}
//       </div>
//     </div>
//   );
//   useEffect(() => {
//     // Sample data fetching or logic to set filteredData
//     if (examType === "intern") {
//       setFilteredData(mock_exam_section_Data[1]);
//     } else {
//       setFilteredData(mock_exam_section_Data[2]);
//     }
//   }, [examType]);

//   const handleAddQuestions = (sections) => {
//     sections.forEach((section) => {
//       const questionsForSection = section.questions.slice(
//         0,
//         examType === "mock" ? 24 : section.questions.length
//       ); // Only take 24 questions for mock exams
//       const timeForSection = examType === "mock" ? 25 : section.time; // Set 25 minutes for mock exams

//       questionsForSection.forEach((question) => {
//         addQuestionToExam(timeForSection, question); // Use the addQuestionToExam method to add each question
//       });
//     });
//   };

//   return (
//     <div className="min-h-screen bg-[#F9FAFC] p-6">
//       <div className="max-w-7xl mx-auto">
//         <BreadcrumbsShowcase items={breadcrumbs} variant="pill" />

//         <PagesHeader
//           title={
//             currentQuestionIndex === -1 ? "إنشاء اختبار جديد" : "إضافة سؤال"
//           }
//           subtitle={
//             currentQuestionIndex === -1
//               ? "صمم اختبار لطلابك"
//               : "أضف سؤال إلى الاختبار"
//           }
//           extra={
//             <div className="flex items-center gap-2">
//               <div
//                 className={`px-3 py-1 rounded-full text-sm font-medium ${
//                   questionType === "mcq"
//                     ? "bg-[#8B5CF6]/10 text-[#8B5CF6]"
//                     : questionType === "trueFalse"
//                     ? "bg-[#0F7490]/10 text-[#0F7490]"
//                     : questionType === "essay"
//                     ? "bg-[#C9AE6C]/10 text-[#C9AE6C]"
//                     : questionType === "complete"
//                     ? "bg-[#10B981]/10 text-[#10B981]"
//                     : "bg-[#F59E0B]/10 text-[#F59E0B]"
//                 }`}
//               >
//                 {questionType === "mcq"
//                   ? "الاختيار من متعدد"
//                   : questionType === "trueFalse"
//                   ? "صح/خطأ"
//                   : questionType === "essay"
//                   ? "مقالي"
//                   : questionType === "complete"
//                   ? "أكمل"
//                   : ""}
//               </div>
//             </div>
//           }
//         />

//         {currentQuestionIndex === -1 ? (
//           // شاشة الاختبار
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//             {/* يسار */}
//             <div className="lg:col-span-2 space-y-6">
//               <Card title="معلومات الاختبار" className="p-6" dir="rtl">
//                 <div className="grid grid-cols-1 mt-5 md:grid-cols-2 gap-6">
//                   <Input
//                     label="اسم الاختبار"
//                     placeholder="أدخل اسم الاختبار"
//                     required
//                     value={examName}
//                     onChange={(e) => setExamName(e.target.value)}
//                   />
//                   {/* <Input
//                     label="مدة الاختبار (دقيقة)"
//                     type="number"
//                     placeholder="أدخل المدة بالدقائق"
//                     required
//                     min="1"
//                     value={examDuration}
//                     onChange={(e) =>
//                       setExamDuration(parseInt(e.target.value) || 0)
//                     }
//                   /> */}
//                 </div>

//                 <div className="mt-6">
//                   <label className="block text-sm font-medium text-[#202938] mb-3">
//                     نوع الاختبار
//                   </label>
//                   <div className="grid grid-cols-2 gap-4">
//                     <button
//                       onClick={() => setExamType("intern")}
//                       className={`p-4 rounded-lg border-2 transition-all duration-200 text-right ${
//                         examType === "intern"
//                           ? "border-[#0F7490] bg-[#0F7490]/5"
//                           : "border-gray-200 hover:border-gray-300"
//                       }`}
//                     >
//                       <div className="flex items-center gap-3">
//                         <div
//                           className={`flex !min-w-[16px] !min-h-[16px] w-4 h-4 rounded-full border-2 ${
//                             examType === "intern"
//                               ? "border-[#8B5CF6] bg-[#8B5CF6]"
//                               : "border-gray-300"
//                           }`}
//                         />
//                         <div>
//                           <h3 className="font-medium text-[#202938]">تدريب</h3>
//                         </div>
//                       </div>
//                     </button>
//                     <button
//                       onClick={() => setExamType("mock")}
//                       className={`p-4 rounded-lg border-2 transition-all duration-200 text-right ${
//                         examType === "mock"
//                           ? "border-[#0F7490] bg-[#0F7490]/5"
//                           : "border-gray-200 hover:border-gray-300"
//                       }`}
//                     >
//                       <div className="flex items-center gap-3">
//                         <div
//                           className={`flex !min-w-[16px] !min-h-[16px] w-4 h-4 rounded-full border-2 ${
//                             examType === "mock"
//                               ? "border-[#8B5CF6] bg-[#8B5CF6]"
//                               : "border-gray-300"
//                           }`}
//                         />
//                         <div>
//                           <h3 className="font-medium text-[#202938]">
//                             اختبار محاكي
//                           </h3>
//                         </div>
//                       </div>
//                     </button>
//                   </div>
//                 </div>
//               </Card>

//               <Card title="أسئلة الاختبار" className="p-6" dir="rtl">
//                 <div className="section-info">
//                   {selectedSection.map((section) => (
//                     <div key={section.id} className="section-details">
//                       <h3>{section.name}</h3>
//                       <p>{section.desc}</p>
//                     </div>
//                   ))}
//                 </div>

//                 {questions.length === 0 ? (
//                   <div className="text-center py-8 text-gray-500">
//                     <Book className="w-12 h-12 mx-auto mb-4 text-gray-300" />
//                     <p>لا توجد أسئلة حتى الآن</p>
//                     <p className="text-sm">
//                       اضغط على زر إضافة سؤال لبدء إنشاء الأسئلة
//                     </p>
//                   </div>
//                 ) : (
//                   <div>
//                     {questions.map(renderQuestionPreview)}
//                     <div className="flex justify-between items-center mt-4">
//                       <span className="text-sm text-gray-600">
//                         عدد الأسئلة: {questions.length}
//                       </span>
//                       <Button
//                         type="primary"
//                         onClick={() => setCurrentQuestionIndex(-2)}
//                       >
//                         <PlusIcon className="w-4 h-4 ml-2" />
//                         إضافة سؤال آخر
//                       </Button>
//                     </div>
//                   </div>
//                 )}
//               </Card>
//             </div>

//             {/* يمين */}
//             <QuestionLivePreview
//               examDuration={examDuration}
//               examName={examName}
//               examType={examType}
//               isExamFormValid={isExamFormValid}
//               questions={questions}
//               setCurrentQuestionIndex={setCurrentQuestionIndex}
//             />
//           </div>
//         ) : (
//           // شاشة إضافة/تحرير سؤال
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//             <div className="lg:col-span-2 space-y-6">
//               <h3 className="font-medium   my-3 text-xl text-gray-500">
//                 <span>نوع الاختبار :</span>
//                 <span className="">
//                   {" "}
//                   {examType == "intern" ? "تدريب" : "اختبار محاكي"}
//                 </span>
//               </h3>

//               <QuestionSections
//                setSelectedSection={setSelectedSection}
//   selectedSection={selectedSection}
//   filteredData={filteredData}
//   handleAddQuestions={handleAddQuestions}
//   handleQuestionTypeChange={handleQuestionTypeChange}
//   examType={examType} 
//               />

//               {/* نوع السؤال */}
//               <QuestionTypes
//                 handleAddQuestions={handleAddQuestions}
//                 handleQuestionTypeChange={handleQuestionTypeChange}
//                 questionType={questionType}
//               />

//               <Card title="تفاصيل السؤال" className="p-6" dir="rtl">
//                 <div className="space-y-6">
//                   <McqSharedPassageEditor
//                     mcqHasPassage={mcqHasPassage}
//                     mcqPassageText={mcqPassageText}
//                     questionType={questionType}
//                     setMcqHasPassage={setMcqHasPassage}
//                     setMcqPassageText={setMcqPassageText}
//                   />
//                   {questionType === "essay" && (
//                     <TextArea
//                       label="الإجابة النموذجية"
//                       placeholder="أدخل الإجابة النموذجية هنا..."
//                       required
//                       rows={3}
//                       value={modalAnswer}
//                       onChange={(e) => setModalAnswer(e.target.value)}
//                     />
//                   )}

//                   {questionType === "complete" && (
//                     <>
//                       <TextArea
//                         label="النص الناقص"
//                         placeholder="أدخل النص مع وضع (...) في الأماكن الناقصة"
//                         required
//                         rows={4}
//                         value={completeText}
//                         onChange={(e) => setCompleteText(e.target.value)}
//                       />
//                       <div className="space-y-4">
//                         <label className="block text-sm font-medium text-[#202938]">
//                           الإجابات النموذجية للأماكن الناقصة
//                         </label>
//                         {completeAnswers.map((answer, index) => (
//                           <div key={index} className="flex items-center gap-2">
//                             <Input
//                               placeholder={`الإجابة للمكان الناقص ${index + 1}`}
//                               value={answer.answer}
//                               onChange={(e) =>
//                                 updateCompleteAnswer(index, e.target.value)
//                               }
//                               className="flex-1"
//                             />
//                             {completeAnswers.length > 1 && (
//                               <Button
//                                 type="text"
//                                 onClick={() => removeCompleteAnswer(index)}
//                                 className="text-red-500 hover:bg-red-50"
//                               >
//                                 <Trash2 className="w-4 h-4" />
//                               </Button>
//                             )}
//                           </div>
//                         ))}
//                         <Button
//                           type="secondary"
//                           onClick={addCompleteAnswer}
//                           className="mt-2"
//                         >
//                           <PlusIcon className="w-4 h-4 ml-2" />
//                           إضافة إجابة أخرى
//                         </Button>
//                       </div>
//                     </>
//                   )}

//                   {/* صح/خطأ */}
//                   {questionType === "trueFalse" && (
//                     <div className="space-y-4">
//                       <label className="block text-sm font-medium text-[#202938]">
//                         الإجابة الصحيحة
//                       </label>
//                       <div className="flex gap-4">
//                         <button
//                           onClick={() => setTrueFalseAnswer(true)}
//                           className={`flex-1 p-4 rounded-lg border-2 text-center ${
//                             trueFalseAnswer === true
//                               ? "border-green-500 bg-green-50 text-green-700"
//                               : "border-gray-200 hover:border-gray-300"
//                           }`}
//                         >
//                           صحيح
//                         </button>
//                         <button
//                           onClick={() => setTrueFalseAnswer(false)}
//                           className={`flex-1 p-4 rounded-lg border-2 text-center ${
//                             trueFalseAnswer === false
//                               ? "border-red-500 bg-red-50 text-red-700"
//                               : "border-gray-200 hover:border-gray-300"
//                           }`}
//                         >
//                           خطأ
//                         </button>
//                       </div>
//                       <Input
//                         label="شرح الإجابة (اختياري)"
//                         placeholder="أدخل شرح الإجابة"
//                         value={trueFalseExplanation}
//                         onChange={(e) =>
//                           setTrueFalseExplanation(e.target.value)
//                         }
//                       />
//                     </div>
//                   )}

//                   {/* إعدادات إضافية */}
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div>
//                       <label className="block text-sm font-medium text-[#202938] mb-2">
//                         مستوى الصعوبة
//                       </label>
//                       <div className="flex gap-2">
//                         {difficultyOptions.map((diff) => (
//                           <button
//                             key={diff.value}
//                             onClick={() => setDifficulty(diff.value)}
//                             className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
//                               difficulty === diff.value
//                                 ? "bg-gradient-to-r text-white " + diff.color
//                                 : "bg-gray-100 text-gray-600 hover:bg-gray-200"
//                             }`}
//                           >
//                             {diff.label}
//                           </button>
//                         ))}
//                       </div>
//                     </div>

//                     <Input
//                       label="النقاط"
//                       type="number"
//                       placeholder="أدخل عدد النقاط"
//                       min="1"
//                       value={points}
//                       onChange={(e) => setPoints(e.target.value)}
//                     />
//                     <Input
//                       label="الوقت المخصص (ثانية)"
//                       type="number"
//                       placeholder="أدخل الوقت بالثواني"
//                       min="1"
//                       value={timeLimit}
//                       onChange={(e) => setTimeLimit(e.target.value)}
//                     />
//                     <Input
//                       label="الكلمات المفتاحية"
//                       placeholder="أدخل الكلمات المفتاحية مفصولة بفواصل"
//                       value={tags}
//                       onChange={(e) => setTags(e.target.value)}
//                     />
//                   </div>
//                 </div>
//               </Card>
//             </div>

//             {/* المعاينة والإجراءات */}
//             <div className="space-y-6 sticky top-0" dir="rtl">
//               <Card title="معاينة السؤال" className="p-6">
//                 <div className="space-y-4">
//                   {questionType === "mcq" && (
//                     <>
//                       {mcqHasPassage && (mcqPassageText || "").trim() && (
//                         <div className="p-3 bg-white rounded border">
//                           <div className="text-xs text-gray-500 mb-1">
//                             نص القطعة:
//                           </div>
//                           <div className="text-sm whitespace-pre-wrap">
//                             {mcqPassageText}
//                           </div>
//                         </div>
//                       )}
//                       <h4 className="font-medium text-[#202938]">
//                         {question || "السؤال..."}
//                       </h4>
//                       <div className="space-y-2">
//                         {options.map((opt, i) => (
//                           <div
//                             key={i}
//                             className={`p-3 rounded-lg border ${
//                               opt.isCorrect
//                                 ? "border-green-500 bg-green-50"
//                                 : "border-gray-200"
//                             }`}
//                           >
//                             <div className="flex items-center gap-2">
//                               <div
//                                 className={`w-5 h-5 ${
//                                   allowMultipleCorrect
//                                     ? "rounded"
//                                     : "rounded-full"
//                                 } border-2 flex items-center justify-center ${
//                                   opt.isCorrect
//                                     ? "border-green-500 bg-green-500"
//                                     : "border-gray-300"
//                                 }`}
//                               >
//                                 {opt.isCorrect && (
//                                   <svg
//                                     className="w-3 h-3 text-white"
//                                     fill="currentColor"
//                                     viewBox="0 0 20 20"
//                                   >
//                                     <path
//                                       fillRule="evenodd"
//                                       d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
//                                       clipRule="evenodd"
//                                     />
//                                   </svg>
//                                 )}
//                               </div>
//                               <span>{opt.text || `الخيار ${i + 1}`}</span>
//                             </div>
//                             {opt.explanation && (
//                               <p className="text-xs text-gray-500 mt-2 mr-7">
//                                 {opt.explanation}
//                               </p>
//                             )}
//                           </div>
//                         ))}
//                       </div>
//                       <div className="text-xs text-gray-500">
//                         {allowMultipleCorrect
//                           ? "يسمح بأكثر من إجابة صحيحة"
//                           : "إجابة صحيحة واحدة"}
//                       </div>
//                     </>
//                   )}

//                   {questionType === "trueFalse" && (
//                     <>
//                       <h4 className="font-medium text-[#202938]">
//                         {question || "السؤال..."}
//                       </h4>
//                       <div className="flex gap-4 mt-3">
//                         <div
//                           className={`flex-1 p-3 rounded-lg border text-center ${
//                             trueFalseAnswer === true
//                               ? "border-green-500 bg-green-50 text-green-700"
//                               : "border-gray-200"
//                           }`}
//                         >
//                           صحيح
//                         </div>
//                         <div
//                           className={`flex-1 p-3 rounded-lg border text-center ${
//                             trueFalseAnswer === false
//                               ? "border-red-500 bg-red-50 text-red-700"
//                               : "border-gray-200"
//                           }`}
//                         >
//                           خطأ
//                         </div>
//                       </div>
//                       {trueFalseExplanation && (
//                         <p className="text-sm text-gray-600 mt-3">
//                           <strong>الشرح:</strong> {trueFalseExplanation}
//                         </p>
//                       )}
//                     </>
//                   )}

//                   {questionType === "essay" && (
//                     <>
//                       <h4 className="font-medium text-[#202938]">
//                         {question || "السؤال..."}
//                       </h4>
//                       <div className="p-3 bg-gray-50 rounded-lg mt-3">
//                         <p className="text-sm text-gray-600">
//                           <strong>الإجابة النموذجية:</strong>{" "}
//                           {modalAnswer || "سيظهر هنا..."}
//                         </p>
//                       </div>
//                     </>
//                   )}

//                   {questionType === "complete" && (
//                     <>
//                       <h4 className="font-medium text-[#202938]">
//                         {completeText
//                           ? completeText.replace(/\.\.\./g, "______")
//                           : "النص الناقص..."}
//                       </h4>
//                       <div className="mt-3">
//                         <p className="text-sm text-gray-600">
//                           عدد الفراغات: {completeAnswers.length}
//                         </p>
//                         <div className="grid grid-cols-2 gap-2 mt-2">
//                           {completeAnswers.map((ans, i) => (
//                             <div
//                               key={i}
//                               className="p-2 bg-gray-100 rounded text-center text-sm"
//                             >
//                               الإجابة {i + 1}: {ans.answer || "______"}
//                             </div>
//                           ))}
//                         </div>
//                       </div>
//                     </>
//                   )}
//                 </div>
//               </Card>

//               <Card title="إجراءات سريعة" className="p-6">
//                 <div className="space-y-3">
//                   <Button
//                     type="primary"
//                     className="w-full justify-center"
//                     onClick={() => addQuestionToExam(false)}
//                     disabled={!isFormValid()}
//                   >
//                     <SaveIcon className="w-4 h-4 ml-2" />
//                     {currentQuestionIndex >= 0
//                       ? "تحديث السؤال"
//                       : "إضافة إلى الاختبار"}
//                   </Button>
//                   <Button
//                     type="secondary"
//                     className="w-full justify-center"
//                     onClick={() => addQuestionToExam(true)}
//                     disabled={!isFormValid()}
//                   >
//                     <PlusIcon className="w-4 h-4 ml-2" />
//                     حفظ وإضافة سؤال آخر
//                   </Button>
//                   <Button
//                     type="default"
//                     className="w-full justify-center"
//                     onClick={() => resetQuestionForm(true)}
//                   >
//                     مسح النموذج
//                   </Button>
//                 </div>
//               </Card>

//               <Card className="p-6">
//                 <div className="text-center">
//                   <div
//                     className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${
//                       isFormValid() ? "bg-green-100" : "bg-gray-100"
//                     }`}
//                   >
//                     {isFormValid() ? (
//                       <CheckCircle2 className="w-8 h-8 text-green-600" />
//                     ) : (
//                       <AlertCircle className="w-8 h-8 text-gray-400" />
//                     )}
//                   </div>
//                   <p
//                     className={`text-sm font-medium ${
//                       isFormValid() ? "text-green-600" : "text-gray-500"
//                     }`}
//                   >
//                     {isFormValid()
//                       ? "جاهز للإضافة"
//                       : "الحقول المطلوبة غير مكتملة"}
//                   </p>
//                   <p className="text-xs text-[#202938]/50 mt-1">
//                     {isFormValid()
//                       ? "تم إكمال جميع الحقول المطلوبة"
//                       : "يجب ملء جميع الحقول الإلزامية"}
//                   </p>
//                 </div>
//               </Card>
//             </div>
//           </div>
//         )}

//         {/* أزرار أسفل الصفحة */}
//         {currentQuestionIndex === -1 && (
//           <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg">
//             <div className="max-w-7xl mx-auto flex justify-between items-center">
//               <div className="flex items-center gap-2">
//                 <span className="text-sm text-gray-600">
//                   {questions.length} أسئلة
//                 </span>
//                 <span className="text-sm text-gray-600">
//                   • المدة الإجمالية: {examDuration} دقيقة
//                 </span>
//               </div>
//               <div className="flex gap-3">
//                 <Button type="default">حفظ كمسودة</Button>
//                 <Button type="primary" disabled={!isExamFormValid()}>
//                   نشر الاختبار
//                 </Button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CreateQuestion;

"use client";
import React, { useEffect, useState } from 'react'
import PageLayout from '../layout/PageLayout';
import BreadcrumbsShowcase from '../ui/BreadCrumbs';
import { BarChart3, PlusIcon, SaveIcon, Trash2 } from 'lucide-react';
import PagesHeader from '../ui/PagesHeader';
import ExamMainData from './ExamMainData';
import Card from '../atoms/Card';
import Button from '../atoms/Button';

const breadcrumbs = [
  { label: "الرئيسية", href: "/", icon: BarChart3 },
  { label: "الاختبارات", href: "#", icon: "", current: true },
];

export default function CreateQuestion() {
  const [examData, setExamData] = useState({
    name: "",
    duration: "",
    type: "intern",
    sections: [],
  });

  const [activeTab, setActiveTab] = useState("info"); // "info" أو "questions"

  // إضافة قسم جديد مع التحقق من عدد الأسئلة للاختبار المحاكي
  const addSection = (section) => {
    const isAlreadyAdded = examData?.sections?.some(s => s.id === section.id);
    if (!isAlreadyAdded) {
      // للاختبار المحاكي: نأخذ فقط 24 سؤال من كل قسم
      const questionsToAdd = examData.type === "mock" 
        ? section?.questions?.slice(0, 24) // 24 سؤال فقط للاختبار المحاكي
        : section?.questions; // جميع الأسئلة للتدريب
      
      // للاختبار المحاكي: مدة كل قسم ثابتة (25 دقيقة)
      const sectionDuration = examData.type === "mock" 
        ? 25 // 25 دقيقة للاختبار المحاكي
        : section.time; // المدة الأصلية للتدريب

      setExamData({
        ...examData,
        sections: [...examData.sections, {
          ...section,
          questions: questionsToAdd,
          duration: sectionDuration,
          originalQuestionsCount: section.questions?.length || 0 // حفظ العدد الأصلي للأسئلة
        }]
      });
    }
  };

 
  function handleAddExam() {
    console.log(examData);
    // هنا يمكنك إضافة منطق حفظ الاختبار
  }

  useEffect(() => {
    console.log(examData)
  } , [examData])

  return (
    <PageLayout>
      <div style={{dir:"rtl"}}>
        <BreadcrumbsShowcase variant='pill' items={breadcrumbs}/>

        <PagesHeader 
          title="إنشاء اختبار جديد"
          subtitle={"صمم اختبار لطلابك"}
        />

        {/* تبويبات الصفحة */}
        <div className="flex border-b mb-6">
          <button
            className={`px-4 py-2 font-medium ${activeTab === "info" ? "border-b-2 border-[#0F7490] text-[#0F7490]" : "text-gray-500"}`}
            onClick={() => setActiveTab("info")}
          >
            معلومات الاختبار
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === "questions" ? "border-b-2 border-[#0F7490] text-[#0F7490]" : "text-gray-500"}`}
            onClick={() => setActiveTab("questions")}
            disabled={examData?.sections?.length === 0}
          >
            معاينة الأسئلة ({examData?.sections?.length})
          </button>
        </div>

        {activeTab === "info" ? (
          <>
            <ExamMainData 
              examData={examData} 
              setExamData={setExamData}
              onAddSection={addSection}
            />
                      </>
        ) : (
          <Card title="معاينة الأسئلة" className="p-6">
            <div className="space-y-6">
              {examData?.sections?.map(section => (
                <div key={section?.id} className="border-b pb-6 last:border-b-0">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold">{section?.name}</h3>
                    <div className="text-sm text-gray-500">
                      {section.questions?.length} سؤال • {section.duration} دقيقة
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    {section?.questions?.map((question, index) => (
                      <div key={question?.id || index} className="p-4 border rounded-lg">
                        <div className="flex items-start gap-3">
                          <span className="font-medium">{index + 1}.</span>
                          <div className="flex-1">
                            <p className="font-medium">{question?.text}</p>
                            <span className="text-sm text-gray-500 mt-1">
                              نوع السؤال: {question?.type === "mcq" ? "اختيار من متعدد" : "مقالي"}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              
              <div className="flex justify-between mt-6">
                <Button type="default" onClick={() => setActiveTab("info")}>
                  العودة إلى المعلومات
                </Button>
                <Button type="primary" onClick={handleAddExam}>
                  <SaveIcon className="w-4 h-4 ml-2" />
                  حفظ الاختبار
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </PageLayout>
  )
}