// "use client";

// import React, {
//   useCallback,
//   useEffect,
//   useMemo,
//   useState,
// } from "react";
// import { Segmented, Select, Tag } from "antd";
// import {
//   Plus as PlusIcon,
//   Edit3,
//   BookOpen,
//   Save,
//   X,
//   ListChecks,
//   FlaskConical,
//   FileText,
// } from "lucide-react";

// // Quill CSS
// import "quill/dist/quill.snow.css";

// // External components (keep your own paths)
// import QuestionStats from "./QuestionStats";
// import Card from "./ExamCard";
// import ExamMainInfo from "./ExamMainInfo";
// import QuestionSections from "./QuestionSections";
// import TrueFalseQuestions from "./TrueFalseQuestions";
// import EssayQuestions from "./EssayQuestions";
// import CompleteQuestions from "./CompleteQuestions";
// import DisplayQuestions from "./DisplayQuestions";
// import QuestionTypeSelector from "./QuestionTypeSelector";
// import {
//   colorMap,
//   exam_types,
//   mock_exam_section_Data,
//   questionTypes,
// } from "./utils";

// import McqSharedPassageEditor from "./McqSharedPassageEditor/McqSharedPassageEditor";
// import LabeledEditor from "./McqSharedPassageEditor/parts/LabeledEditor";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   handleCreateExam,
//   handleCreateExamSection,
//   handleEditExam,
//   handleEditExamSection,
//   handleGetAllExams,
//   handleGetAllExamSections,
// } from "../../lib/features/examSlice";
// import { toast } from "react-toastify";
// import AssignExam from "./AssignExam";
// import { useParams } from "next/navigation";

// /* ===================== Main: ExamMainData ===================== */
// export default function ExamMainData({
//   examData: editExamData,
//   rowData = {},
//   setRowData,
// }) {
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
//   const [expandedSections, setExpandedSections] = useState({});
//   const [editingQuestion, setEditingQuestion] = useState(null);

//   // True/False
//   const [trueFalseAnswer, setTrueFalseAnswer] = useState(null);
//   const [trueFalseExplanation, setTrueFalseExplanation] = useState("");

//   // Essay
//   const [modalAnswer, setModalAnswer] = useState("");

//   // Complete
//   const [completeText, setCompleteText] = useState("");
//   const [completeAnswers, setCompleteAnswers] = useState([{ answer: "" }]);

//   // MCQ (general)
//   const emptyOption = () => ({ text: "", explanation: "" });
//   const normalizeOption = (opt) => {
//     if (typeof opt === "string") return { text: opt, explanation: "" };
//     if (opt && typeof opt === "object")
//       return { text: opt.text || "", explanation: opt.explanation || "" };
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

//   const dispatch = useDispatch();
//   const {
//     add_exam_loading,
//     all_exam_loading,
//     all_exam_list,
//     delete_exam_loading,
//     edit_exam_loading,
//     get_exam_sections_list
//   } = useSelector((state) => state?.exam);

//   const [exmaInfoData, setExamInfoData] = useState({
//     title: "",
//     description: "",
//     free: 0,
//     time: "",
//     date: "",
//     type: "mock",
//     level: "medium",
//   });
//   const [openExamSection, setOpenExamSection] = useState(false);
//   const [openExamQuestion, setOpenExamQuestion] = useState(false);
//   const [filteredData, setFilteredData] = useState({});

//   const params = useParams();
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
//   }, []);

//   useEffect(() => {
//     if (examData?.sections?.length > 0 && !selectedSectionId)
//       setSelectedSectionId(examData.sections[0].id);
//   }, [examData?.sections, selectedSectionId]);

//   useEffect(() => {
//     dispatch(handleGetAllExams());
//   }, [dispatch]);

//   // Edit mode: load exam info (you can also plug sections here if backend returns them)
//   useEffect(() => {
//     if (params["exam-id"]) {
//       const filteredItem = all_exam_list?.data?.message?.find(
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
//         type: filteredItem?.time ? "mock" : "intern",
//       }));

//       setExamData((prev) => ({
//         ...prev,
//         type: filteredItem?.time ? "mock" : "intern",
//         // if sections come from backend, plug them here:
//         sections: filteredItem?.sections || prev.sections || [],
//       }));

//       // in edit mode: open sections & questions by default
//       setOpenExamSection(true);
//       setOpenExamQuestion(true);
//     }
//   }, [params, all_exam_list]);

//   /* Helpers */

//   const selectedSection = useMemo(
//     () => examData.sections.find((s) => s.id === selectedSectionId),
//     [examData.sections, selectedSectionId]
//   );

//   // Function to handle basic exam data changes
//   const handleBasicDataChange = (field, value) => {
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

//   const handleSubmitBasicData = () => {
//     if (!exmaInfoData.title) {
//       toast.warn("ادخل اسم الاختبار أولا!");
//       return;
//     }

//     if (!exmaInfoData.description) {
//       toast.warn("ادخل وصف الاختبار أولا!");
//       return;
//     }

//     if (exmaInfoData?.type == "mock" && !exmaInfoData?.time) {
//       toast.warn("اختر وقت أولا");
//       return;
//     }

//     if (!exmaInfoData?.date) {
//       toast.warn("اختر تاريخ أولا");
//       return;
//     }

//     if (params["exam-id"]) {
//       const data_send = {
//         id: params["exam-id"],
//         title: exmaInfoData.title,
//         description: exmaInfoData.description,
//         free: exmaInfoData.free,
//         time: exmaInfoData.time,
//         date: exmaInfoData.date,
//         level: exmaInfoData?.level,
//       };

//       dispatch(handleEditExam({ body: data_send }))
//         .unwrap()
//         .then((res) => {
//           console.log(res);
//           if (res?.data?.status == "success") {
//             toast.success("تم   تعديل الاختبار بنجاح!");
//           } else {
//             toast.error("هناك خطأ أثناء اضافه الاختبار");
//             setOpenExamSection(false);
//           }
//         })
//         .catch((e) => {
//           console.log(e);
//           toast.error("حدث خطأ أثناء إضافة الاختبار.");
//         });
//     } else {
//       const data_send = {
//         title: exmaInfoData.title,
//         description: exmaInfoData.description,
//         free: JSON.stringify(exmaInfoData.free),
//         time: exmaInfoData.time,
//         date: exmaInfoData.date,
//         level: exmaInfoData?.level,
//       };

//       dispatch(handleCreateExam({ body: data_send }))
//         .unwrap()
//         .then((res) => {
//           console.log(res);
//           if (res?.data?.status == "success") {
//             toast.success("تم    !ضافة الاختبار بنجاح!");
//             setOpenExamSection(res?.data?.message);
//             setExamData({ ...examData, sections: [] }); // Reset exam data after submission
//           } else {
//             toast.error("هناك خطأ أثناء اضافه الاختبار");
//             setOpenExamSection(false);
//           }
//         })
//         .catch((e) => {
//           console.log(e);
//           toast.error("حدث خطأ أثناء إضافة الاختبار.");
//         });
//     }
//   };

//   const onAddSection = (section) => {
//     if(!section?.title) {
//       toast.warn("ادخل عنوان القسم أولا !");
//       return
//     }

//     if(!section?.description) {
//       toast.warn("ادخل وصف للقسم أولا!");
//       return
//     }
//     if (params["exam-id"]) {
//       // edit existing section (if section has id)
//       if (section.id) {
//         dispatch(
//           handleEditExamSection({
//             body: { ...section },
//           })
//         )
//           .unwrap()
//           .then((res) => {
//             console.log(res);
//             if (res?.data?.status == "success") {
//               toast.success("تم تعديل القسم بنجاح");
//             } else {
//               toast.error(
//                 res?.data?.message || "هناك خطأ أثناء تعديل القسم"
//               );
//             }
//           })
//           .catch((e) => console.log(e));
//         return;
//       }

//       // add new section in edit mode
//       dispatch(
//         handleCreateExamSection({
//           body: { ...section, exam_id: params["exam-id"] },
//         })
//       )
//         .unwrap()
//         .then((res) => {
//           console.log(res);
//           if (res?.data?.status == "success") {
//             toast.success("تم إضافة القسم بنجاح");
//             const newSection = res?.data?.message;
//             setOpenExamQuestion(newSection);
//             if (newSection?.id) {
//               setExamData((prev) => ({
//                 ...prev,
//                 sections: [...(prev.sections || []), newSection],
//               }));
//             }
//           } else {
//             toast.error(res?.data?.message || "هناك خطأ أثناء اضافة القسم");
//           }
//         })
//         .catch((e) => console.log(e));
//       return;
//     }

//     // create-mode: use openExamSection.id
//     dispatch(
//       handleCreateExamSection({
//         body: { ...section, exam_id: openExamSection?.id },
//       })
//     )
//       .unwrap()
//       .then((res) => {
//         console.log(res);
//         if (res?.data?.status == "success") {
//           toast.success("تم إضافة القسم بنجاح");
//           setOpenExamQuestion(res?.data?.message);
//         } else {
//           toast.error(res?.data?.message || "هناك خطأ أثناء اضافة القسم");
//         }
//       })
//       .catch((e) => console.log(e));
//   };

//   const toggleSection = (sectionId) =>
//     setExpandedSections((prev) => ({ ...prev, [sectionId]: !prev[sectionId] }));

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
//   };

//   const addCompleteAnswer = () =>
//     setCompleteAnswers((a) => [...a, { answer: "" }]);
//   const removeCompleteAnswer = (index) =>
//     setCompleteAnswers((a) => a.filter((_, i) => i !== index));
//   const updateCompleteAnswer = (index, value) => {
//     setCompleteAnswers((a) => {
//       const next = [...a];
//       next[index] = typeof value === "object" ? value : { answer: value };
//       return next;
//     });
//   };

//   const updateMcqOption = (index, field, v) =>
//     setMcqOptions((opts) => {
//       const next = [...opts];
//       next[index] = { ...normalizeOption(next[index]), [field]: v };
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

//   const getTotalQuestions = () =>
//     examData.sections.reduce((acc, s) => acc + (s.questions?.length || 0), 0);

//   const getEstimatedDuration = () =>
//     examData.type === "mock"
//       ? examData.sections.length * 25
//       : parseInt(examData.duration || "0");

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

//   /* Add / Update Question */
//   const addOrUpdateQuestion = () => {
//     if (!selectedSectionId) return;

//     const currentCount = getQuestionsCount(selectedSectionId);

//     // Non-general MCQ groups
//     if (questionType === "mcq" && mcqSubType !== "general") {
//       const groups = mcqPassages[mcqSubType] || [];
//       const generated = [];

//       groups.forEach((p) => {
//         (p.questions || []).forEach((q) => {
//           generated.push({
//             id: Date.now() + Math.random(),
//             type: "mcq",
//             mcqSubType,
//             question: q.text || "",
//             options: Array.isArray(q.options)
//               ? q.options.map(normalizeOption)
//               : [],
//             correctAnswer:
//               typeof q.correctIndex === "number" ? q.correctIndex : 0,
//             passage: { id: p.id, content: p.content || "" },
//             sectionId: selectedSectionId,
//           });
//         });
//       });

//       if (!generated.length) return;

//       if (editingQuestion) {
//         generated[0] = { ...generated[0], id: editingQuestion.id };

//         const extra = generated.slice(1);
//         const available =
//           examData.type === "mock" ? Math.max(0, 24 - currentCount) : Infinity;
//         if (extra.length > available) {
//           alert(
//             `لا يمكن إضافة ${extra.length} سؤال إضافي. المتاح الآن: ${available}`
//           );
//           const updatedSectionsOnlyReplace = examData.sections.map((section) =>
//             section.id !== selectedSectionId
//               ? section
//               : {
//                   ...section,
//                   questions: (section.questions || []).map((q) =>
//                     q.id === editingQuestion.id ? generated[0] : q
//                   ),
//                 }
//           );
//           setExamData((prev) => ({
//             ...prev,
//             sections: updatedSectionsOnlyReplace,
//           }));
//           resetQuestionForm();
//           return;
//         }

//         const updatedSections = examData.sections.map((section) =>
//           section.id !== selectedSectionId
//             ? section
//             : {
//                 ...section,
//                 questions: [
//                   ...(section.questions || []).map((q) =>
//                     q.id === editingQuestion.id ? generated[0] : q
//                   ),
//                   ...extra,
//                 ],
//               }
//         );

//         setExamData((prev) => ({ ...prev, sections: updatedSections }));
//         resetQuestionForm();
//         return;
//       }

//       if (examData.type === "mock" && currentCount + generated.length > 24) {
//         alert(
//           `لا يمكن إضافة ${
//             generated.length
//           } سؤال. الحد الأقصى 24 سؤال في القسم. المتاح الآن: ${Math.max(
//             0,
//             24 - currentCount
//           )}`
//         );
//         return;
//       }

//       const updatedSections = examData.sections.map((section) =>
//         section.id !== selectedSectionId
//           ? section
//           : {
//               ...section,
//               questions: [...(section.questions || []), ...generated],
//             }
//       );

//       setExamData((prev) => ({ ...prev, sections: updatedSections }));
//       resetQuestionForm();
//       return;
//     }

//     // General MCQ & other types
//     if (!currentQuestion) return;

//     if (examData.type === "mock" && !canAddMoreQuestions(selectedSectionId)) {
//       alert("لا يمكن إضافة أكثر من 24 سؤال في قسم واحد لنوع الاختبار المحاكي");
//       return;
//     }

//     let newQuestion = {
//       id: editingQuestion ? editingQuestion.id : Date.now(),
//       type: questionType,
//       question: currentQuestion,
//       sectionId: selectedSectionId,
//     };
    

//     switch (questionType) {
//       case "mcq":
//         newQuestion = {
//           ...newQuestion,
//           mcqSubType: "general",
//           options: mcqOptions.map(normalizeOption),
//           correctAnswer: mcqCorrectAnswer,
//         };
//         break;
//       case "trueFalse":
//         newQuestion = {
//           ...newQuestion,
//           correctAnswer: trueFalseAnswer,
//           explanation: trueFalseExplanation,
//         };
//         break;
//       case "essay":
//         newQuestion = { ...newQuestion, modelAnswer: modalAnswer };
//         break;
//       case "complete":
//         newQuestion = {
//           ...newQuestion,
//           text: completeText,
//           answers: completeAnswers,
//         };
//         break;
//     }

//     const updatedSections = examData.sections.map((section) => {
//       if (section.id !== selectedSectionId) return section;
//       if (editingQuestion) {
//         return {
//           ...section,
//           questions: (section.questions || []).map((q) =>
//             q.id === editingQuestion.id ? newQuestion : q
//           ),
//         };
//       }
//       return {
//         ...section,
//         questions: [...(section.questions || []), newQuestion],
//       };
//     });

//     setExamData((prev) => ({ ...prev, sections: updatedSections }));
//     resetQuestionForm();
//   };

//   useEffect(() => {
//     console.log("Question Data" , examData)
//   } , [examData])

//   const editMcqPassageQuestion = (question) => {
//     setQuestionType("mcq");
//     setCurrentQuestion(question.question || "");
//     setMcqSubType(question.mcqSubType || "general");

//     if (question.mcqSubType && question.mcqSubType !== "general") {
//       setMcqPassages((prev) => ({
//         ...prev,
//         [question.mcqSubType]: [
//           {
//             id: question.passage?.id || `${Date.now()}-p`,
//             content: question.passage?.content || "",
//             questions: [
//               {
//                 id: `${Date.now()}-q`,
//                 text: question.question || "",
//                 options: (question.options || []).map(normalizeOption),
//                 correctIndex:
//                   typeof question.correctAnswer === "number"
//                     ? question.correctAnswer
//                     : 0,
//               },
//             ],
//           },
//         ],
//       }));
//     } else {
//       setMcqOptions(
//         (
//           question.options || [
//             emptyOption(),
//             emptyOption(),
//             emptyOption(),
//             emptyOption(),
//           ]
//         ).map(normalizeOption)
//       );
//       setMcqCorrectAnswer(
//         typeof question.correctAnswer === "number" ? question.correctAnswer : 0
//       );
//     }

//     setEditingQuestion(question);
//   };

//   useEffect(() => {
//     console.log(openExamSection);
//     dispatch(handleGetAllExamSections({body : {exam_id : openExamSection?.id}}))
//   } , [openExamSection]) 

//   /* UI */
//   return (
//     <div
//       className="max-w-6xl mx-auto space-y-6 p-6 bg-gray-50 min-h-screen"
//       dir="rtl"
//     >
//       <QuestionStats
//         examData={examData}
//         getEstimatedDuration={getEstimatedDuration}
//         getTotalQuestions={getTotalQuestions}
//       />

//       <ExamMainInfo
//         add_exam_loading={add_exam_loading}
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
//           editData = {filteredData}
//           data={openExamQuestion}
//           examData={examData}
//           filteredSection={filteredSection}
//           onAddSection={onAddSection}
//         />
//       )}

//       {(openExamSection && !isEditMode) && <AssignExam exam={openExamSection || filteredData} />}

//       {(openExamSection && get_exam_sections_list?.data?.message?.length)  || isEditMode ? (
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
//                       إجمالي أسئلة القسم:{" "}
//                       {getQuestionsCount(selectedSection.id)}
//                     </Tag>
//                   )}
//                 </div>

//                 <Select
//                   style={{ width: "100%", height: "105%", padding: "10px 0px" }}
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
//                             dangerouslySetInnerHTML={{ __html: section?.title }}
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
//                         {/* <div className="flex items-center gap-2 text-xs text-gray-500">
//                           <span>
//                             عدد الأسئلة:
//                             <b className="mx-1">
//                               {getQuestionsCount(selectedSection.id)}
//                             </b>
//                             /{examData.type === "mock" ? "24" : "∞"}
//                           </span>
//                           {examData.type === "mock" && (
//                             <Tag color="volcano">اختبار محاكي</Tag>
//                           )}
//                         </div> */}
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
//                         {
//                           label: (
//                             <div className="flex items-center gap-2">
//                               <FlaskConical className="w-4 h-4" />
//                               <span>معادلات</span>
//                             </div>
//                           ),
//                           value: "chemical",
//                         },
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
//                     <div className="space-y-5">
//                       <LabeledEditor
//                         label="نص السؤال"
//                         value={currentQuestion}
//                         onChange={setCurrentQuestion}
//                         editorMinH={160}
//                         allowImages
//                       />

//                       <div className="space-y-3">
//                         <label className="block text-sm font-medium text-gray-700">
//                           خيارات الإجابة (لكل خيار نص + شرح)
//                         </label>

//                         {mcqOptions.map((option, index) => {
//                           const letter = String.fromCharCode(65 + index);
//                           const isCorrect = mcqCorrectAnswer === index;

//                           return (
//                             <div
//                               key={index}
//                               className={`border rounded-2xl p-4 bg-white space-y-3 shadow-sm transition ${
//                                 isCorrect
//                                   ? "ring-1 ring-green-200"
//                                   : "ring-1 ring-transparent"
//                               }`}
//                             >
//                               <div className="flex items-center gap-3">
//                                 <span
//                                   className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
//                                     isCorrect
//                                       ? "bg-green-600 text-white"
//                                       : "bg-gray-100 text-gray-700"
//                                   }`}
//                                 >
//                                   {letter}
//                                 </span>

//                                 <label
//                                   className="flex items-center gap-2 text-xs font-medium text-gray-600"
//                                   title="الإجابة الصحيحة"
//                                 >
//                                   <input
//                                     type="radio"
//                                     checked={isCorrect}
//                                     onChange={() => setMcqCorrectAnswer(index)}
//                                     className="h-4 w-4 text-blue-600"
//                                   />
//                                   إجابة صحيحة
//                                 </label>

//                                 {mcqOptions.length > 2 && (
//                                   <button
//                                     type="button"
//                                     onClick={() => removeMcqOption(index)}
//                                     className="ml-auto px-2 py-1 text-red-600 hover:text-red-800 text-xs rounded-lg hover:bg-red-50"
//                                     title="حذف الخيار"
//                                   >
//                                     حذف
//                                   </button>
//                                 )}
//                               </div>

//                               <LabeledEditor
//                                 label={`نص الخيار #${index + 1}`}
//                                 value={option.text}
//                                 onChange={(v) =>
//                                   updateMcqOption(index, "text", v)
//                                 }
//                                 editorMinH={110}
//                                 allowImages
//                               />

//                               <LabeledEditor
//                                 label={`شرح الخيار #${
//                                   index + 1
//                                 } (لماذا هو صحيح/خاطئ)`}
//                                 value={option.explanation}
//                                 onChange={(v) =>
//                                   updateMcqOption(index, "explanation", v)
//                                 }
//                                 editorMinH={90}
//                                 allowImages
//                               />
//                             </div>
//                           );
//                         })}

//                         <button
//                           type="button"
//                           onClick={addMcqOption}
//                           className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded-xl border border-gray-200 bg-white hover:bg-gray-50 shadow-sm"
//                         >
//                           <PlusIcon className="w-4 h-4" />
//                           إضافة خيار
//                         </button>
//                       </div>
//                     </div>
//                   ) : (
//                     <McqSharedPassageEditor
//                       key={`${mcqSubType}:${editingQuestion?.id ?? "new"}`}
//                       mcqSubType={mcqSubType}
//                       initialData={mcqPassages[mcqSubType] || []}
//                       onPassagesChange={handleMcqPassagesChange}
//                     />
//                   )}
//                 </div>
//               )}

//               {/* Non-MCQ */}
//               {questionType === "essay" && (
//                 <LabeledEditor
//                   label="نص السؤال"
//                   value={currentQuestion}
//                   onChange={setCurrentQuestion}
//                   editorMinH={160}
//                   allowImages
//                 />
//               )}

//               {questionType === "trueFalse" && (
//                 <TrueFalseQuestions
//                   trueFalseAnswer={trueFalseAnswer}
//                   setTrueFalseAnswer={setTrueFalseAnswer}
//                   trueFalseExplanation={trueFalseExplanation}
//                   setTrueFalseExplanation={setTrueFalseExplanation}
//                 />
//               )}

//               {questionType === "essay" && (
//                 <EssayQuestions
//                   modalAnswer={modalAnswer}
//                   setModalAnswer={setModalAnswer}
//                 />
//               )}

//               {questionType === "complete" && (
//                 <CompleteQuestions
//                   addCompleteAnswer={addCompleteAnswer}
//                   completeAnswers={completeAnswers}
//                   completeText={completeText}
//                   removeCompleteAnswer={removeCompleteAnswer}
//                   setCompleteText={setCompleteText}
//                   updateCompleteAnswer={updateCompleteAnswer}
//                 />
//               )}

//               {/* Sticky action bar */}
//               <div className="pt-4 border-t sticky bottom-0 bg-gray-50/75 backdrop-blur z-10">
//                 <button
//                   onClick={addOrUpdateQuestion}
//                   disabled={
//                     !selectedSectionId ||
//                     (questionType !== "mcq" && !currentQuestion) ||
//                     (examData.type === "mock" &&
//                       !canAddMoreQuestions(selectedSectionId))
//                   }
//                   className="w-full inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-200 bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 px-4 py-3"
//                 >
//                   {editingQuestion ? (
//                     <Save className="h-4 w-4" />
//                   ) : (
//                     <PlusIcon className="h-4 w-4" />
//                   )}
//                   {editingQuestion ? "تحديث السؤال" : "إضافة السؤال"}
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
//           <DisplayQuestions
//             toggleSection={toggleSection}
//             examData={examData}
//             expandedSections={expandedSections}
//             questionTypes={questionTypes}
//             setCompleteAnswers={setCompleteAnswers}
//             setCompleteText={setCompleteText}
//             setCurrentQuestion={setCurrentQuestion}
//             setEditingQuestion={setEditingQuestion}
//             setExamData={setExamData}
//             setMcqCorrectAnswer={setMcqCorrectAnswer}
//             setMcqOptions={setMcqOptions}
//             setModalAnswer={setModalAnswer}
//             setQuestionType={setQuestionType}
//             setSelectedSectionId={setSelectedSectionId}
//             setTrueFalseAnswer={setTrueFalseAnswer}
//             setTrueFalseExplanation={setTrueFalseExplanation}
//             setMcqSubType={setMcqSubType}
//             editMcqPassageQuestion={editMcqPassageQuestion}
//           />

//           {/* Final actions */}
//           <div className="flex justify-end gap-3 pt-4">
//             <button
//               className="inline-flex items-center gap-2 px-4 py-3 text-sm rounded-xl border border-gray-200 bg-white hover:bg-gray-50"
//               onClick={() => {
//                 if (confirm("هل أنت متأكد من إلغاء التغييرات؟")) {
//                   setExamData({
//                     name: "",
//                     duration: "",
//                     type: "",
//                     sections: [],
//                   });
//                   resetQuestionForm();
//                   setSelectedSectionId(null);
//                   setExpandedSections({});
//                 }
//               }}
//             >
//               <X className="h-4 w-4" />
//               إلغاء
//             </button>

//             <button
//               className="inline-flex items-center gap-2 px-4 py-3 text-sm rounded-xl bg-blue-600 text-white hover:bg-blue-700"
//               onClick={() => {
//                 alert("تم حفظ الاختبار بنجاح!");
//                 console.log("Exam Data:", examData);
//               }}
//               disabled={
//                 !examData.sections.length
//               }
//             >
//               <Save className="h-4 w-4" />
//               حفظ الاختبار
//             </button>
//           </div>
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
//     </div>
//   );
// }


"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Segmented, Select, Tag } from "antd";
import {
  Plus as PlusIcon,
  Edit3,
  BookOpen,
  Save,
  X,
  ListChecks,
  FlaskConical,
  FileText,
} from "lucide-react";

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
  handleGetExamQuestions,          // ⬅️ NEW
} from "../../lib/features/examSlice";
import { toast } from "react-toastify";
import AssignExam from "./AssignExam";
import { useParams } from "next/navigation";

/* ===================== Main: ExamMainData ===================== */
export default function ExamMainData({
  examData: editExamData,
  rowData = {},
  setRowData,
}) {
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
        answer: opt.answer || opt.text || "",
        question_explanation: opt.question_explanation || opt.explanation || "",
        correct_or_not: opt.correct_or_not ?? "0",
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

  const dispatch = useDispatch();
  const {
    add_exam_loading,
    all_exam_loading,
    all_exam_list,
    delete_exam_loading,
    edit_exam_loading,
    get_exam_sections_list,
    add_question_loading,           // ⬅️ NEW
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
  }, []);

  useEffect(() => {
    if (examData?.sections?.length > 0 && !selectedSectionId)
      setSelectedSectionId(examData.sections[0].id);
  }, [examData?.sections, selectedSectionId]);

  useEffect(() => {
    dispatch(handleGetAllExams());
  }, [dispatch]);

  // Edit mode: load exam info
  useEffect(() => {
    if (params["exam-id"]) {
      const filteredItem = all_exam_list?.data?.message?.find(
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
        type: filteredItem?.time ? "mock" : "intern",
      }));

      setExamData((prev) => ({
        ...prev,
        type: filteredItem?.time ? "mock" : "intern",
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

  const handleSubmitBasicData = () => {
    if (!exmaInfoData.title) {
      toast.warn("ادخل اسم الاختبار أولا!");
      return;
    }

    if (!exmaInfoData.description) {
      toast.warn("ادخل وصف الاختبار أولا!");
      return;
    }

    if (exmaInfoData?.type == "mock" && !exmaInfoData?.time) {
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
        free: exmaInfoData.free,
        time: exmaInfoData.time,
        date: exmaInfoData.date,
        level: exmaInfoData?.level,
      };

      dispatch(handleEditExam({ body: data_send }))
        .unwrap()
        .then((res) => {
          console.log(res);
          if (res?.data?.status == "success") {
            toast.success("تم   تعديل الاختبار بنجاح!");
          } else {
            toast.error("هناك خطأ أثناء اضافه الاختبار");
            setOpenExamSection(false);
          }
        })
        .catch((e) => {
          console.log(e);
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
      };

      dispatch(handleCreateExam({ body: data_send }))
        .unwrap()
        .then((res) => {
          console.log(res);
          if (res?.data?.status == "success") {
            toast.success("تم    !ضافة الاختبار بنجاح!");
            setOpenExamSection(res?.data?.message);
            dispatch(handleGetAllExamSections({body : {exam_id : res?.data?.message?.id}}))
            setExamData({ ...examData, sections: [] });
          } else {
            toast.error("هناك خطأ أثناء اضافه الاختبار");
            setOpenExamSection(false);
          }
        })
        .catch((e) => {
          console.log(e);
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
            console.log(res);
            if (res?.data?.status == "success") {
              toast.success("تم تعديل القسم بنجاح");
              dispatch(handleGetAllExamSections({body :  {exam_id : res?.data?.message?.section?.id }}))
            } else {
              toast.error(
                res?.data?.message || "هناك خطأ أثناء تعديل القسم"
              );
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
          console.log(res);
          if (res?.data?.status == "success") {
            toast.success("تم إضافة القسم بنجاح");
            const newSection = res?.data?.message;
            dispatch(handleGetAllExamSections({body : {exam_id : newSection?.id}}))
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
        console.log(res);
        if (res?.data?.status == "success") {
          toast.success("تم إضافة القسم بنجاح");
          setOpenExamQuestion(res?.data?.message);
          dispatch(handleGetAllExamSections({body : {exam_id : res?.data?.message?.section?.id}}))
        } else {
          toast.error(res?.data?.message || "هناك خطأ أثناء اضافة القسم");
        }
      })
      .catch((e) => console.log(e));
  };

  const toggleSection = (sectionId) =>
    setExpandedSections((prev) => ({ ...prev, [sectionId]: !prev[sectionId] }));

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

  /* Add / Update Question + STORE TO API - INTEGRATED FUNCTION */
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

    let questionsToAdd = [];

    // =============================================
    // 1. MCQ مع Passage أو Chemical Equations
    // =============================================
    if (questionType === "mcq" && mcqSubType !== "general") {
      const groups = mcqPassages[mcqSubType] || [];

      for (const group of groups) {
        for (const q of group.questions || []) {
          if (!q.text?.trim()) continue;

          const options = (q?.options || []).map(normalizeOption);
          if (options.length < 2) {
            toast.error("كل سؤال يجب أن يحتوي على خيارين على الأقل");
            return;
          }

          questionsToAdd.push({
            id: editingQuestion?.id || Date.now() + Math.random(),
            question_type: "mcq",
            question_text: q.text,
            exam_section_id: selectedSectionId,
            mcqSubType,
            mcq_array: options.map((opt, idx) => ({
              ...opt,
              correct_or_not: q.correctIndex === idx ? "1" : "0",
            })),
            correctAnswer: q.correctIndex ?? 0,
            passage_content: group.content || "",
          });
        }
      }

      if (questionsToAdd.length === 0) {
        toast.error("لم يتم إنشاء أي سؤال صالح");
        return;
      }

      if (!canAdd(questionsToAdd.length)) {
        toast.error(`الحد الأقصى 24 سؤال لكل قسم في الاختبار المحاكي`);
        return;
      }

      // تحديث الـ state محليًا أولاً (Optimistic UI)
      const updatedSections = examData.sections.map((s) =>
        s.id === selectedSectionId
          ? {
              ...s,
              questions: editingQuestion
                ? s.questions
                    .map((q) =>
                      q.passage_content === editingQuestion.passage_content
                        ? null
                        : q
                    )
                    .filter(Boolean)
                    .concat(questionsToAdd)
                : [...(s.questions || []), ...questionsToAdd],
            }
          : s
      );

      setExamData((prev) => ({ ...prev, sections: updatedSections }));
      resetQuestionForm();
      toast.success(
        editingQuestion ? "تم تحديث الأسئلة بنجاح" : "تم إضافة الأسئلة بنجاح"
      );

      // Send to API
      for (const q of questionsToAdd) {
        try {
          await dispatch(handleAddQuestion({ body: q })).unwrap();
        } catch (err) {
          toast.error(`فشل حفظ سؤال: ${err}`);
        }
      }
      return;
    }

    // =============================================
    // 2. الأسئلة العادية (MCQ general, True/False, Essay, Complete)
    // =============================================
    if (isMock && !canAdd()) {
      toast.error("تم الوصول للحد الأقصى (24 سؤال) في هذا القسم");
      return;
    }

    const baseQuestion = {
      id: editingQuestion?.id || Date.now() + Math.random(),
      question_type: questionType,
      question_text: currentQuestion,
      exam_section_id: selectedSectionId,
    };

    let finalQuestion = { ...baseQuestion , instructions:"Instructions"};

    switch (questionType) {
      case "mcq":
        if (mcqOptions?.filter((o) => o?.answer?.trim())?.length < 2) {
          toast.error("يجب إضافة خيارين على الأقل");
          return;
        }
        finalQuestion = {
          ...finalQuestion,
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

    // تحديث الـ state محليًا (Optimistic Update)
    const newSections = examData.sections.map((s) => {
      if (s.id !== selectedSectionId) return s;

      if (editingQuestion) {
        return {
          ...s,
          questions: s.questions.map((q) =>
            q.id === editingQuestion.id ? finalQuestion : q
          ),
        };
      }
      return {
        ...s,
        questions: [...(s.questions || []), finalQuestion],
      };
    });

    setExamData((prev) => ({ ...prev, sections: newSections }));
    resetQuestionForm();

    console.log("Sending question to API:", finalQuestion);

    try {
      const result = await dispatch(
        handleAddQuestion({ body: finalQuestion })
      ).unwrap();
      console.log(result);
      if(res?.data?.status == "success") {
        dispatch(handleGetExamQuestions({body : {
          exam_section_id : res?.data?.message?.exam_section_id
        } }))
      }
      toast.success(
        editingQuestion ? "تم تحديث السؤال بنجاح" : "تم إضافة السؤال بنجاح"
      );
    } catch (error) {
      toast.error(error || "فشل حفظ السؤال");
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
          question_explanation: opt.question_explanation || opt.explanation || "",
          correct_or_not: question.correctAnswer === idx ? "1" : "0",
        }))
      );
      setMcqCorrectAnswer(
        typeof question.correctAnswer === "number" ? question.correctAnswer : 0
      );
    }

    setEditingQuestion(question);
  };

  useEffect(() => {
    console.log("Question Data", examData);
  }, [examData]);

  useEffect(() => {
    console.log(openExamSection);
    dispatch(
      handleGetAllExamSections({ body: { exam_id: openExamSection?.id  || openExamQuestion?.section?.id} })
    );
  }, [openExamSection , openExamQuestion]);

  /* UI - KEEPING THE EXACT SAME DESIGN */
  return (
    <div
      className="max-w-6xl mx-auto space-y-6 p-6 bg-gray-50 min-h-screen"
      dir="rtl"
    >
      <QuestionStats
        examData={examData}
        getEstimatedDuration={getEstimatedDuration}
        getTotalQuestions={getTotalQuestions}
      />

      <ExamMainInfo
        add_exam_loading={add_exam_loading}
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
          onAddSection={onAddSection}
        />
      )}

      {openExamSection && !isEditMode && (
        <AssignExam exam={openExamSection || filteredData} />
      )}

      {(openExamSection &&
        get_exam_sections_list?.data?.message?.length) ||
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
                        className={`mt-1 w-4 h-4 rounded-full border-2 ${
                          selectedSectionId
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
                              className={`border rounded-2xl p-4 bg-white space-y-3 shadow-sm transition ${
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
                                label={`شرح الخيار #${
                                  index + 1
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
                  trueFalseAnswer={trueFalseAnswer}
                  setTrueFalseAnswer={setTrueFalseAnswer}
                  trueFalseExplanation={trueFalseExplanation}
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
          <DisplayQuestions
          selectedSectionId={selectedSectionId}
            toggleSection={toggleSection}
            examData={examData}
            expandedSections={expandedSections}
            questionTypes={questionTypes}
            setCompleteAnswers={setCompleteAnswers}
            setCompleteText={setCompleteText}
            setCurrentQuestion={setCurrentQuestion}
            setEditingQuestion={setEditingQuestion}
            setExamData={setExamData}
            setMcqCorrectAnswer={setMcqCorrectAnswer}
            setMcqOptions={setMcqOptions}
            setModalAnswer={setModalAnswer}
            setQuestionType={setQuestionType}
            setSelectedSectionId={setSelectedSectionId}
            setTrueFalseAnswer={setTrueFalseAnswer}
            setTrueFalseExplanation={setTrueFalseExplanation}
            setMcqSubType={setMcqSubType}
            editMcqPassageQuestion={editMcqPassageQuestion}
          />

          {/* Final actions */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              className="inline-flex items-center gap-2 px-4 py-3 text-sm rounded-xl border border-gray-200 bg-white hover:bg-gray-50"
              onClick={() => {
                if (confirm("هل أنت متأكد من إلغاء التغييرات؟")) {
                  setExamData({
                    name: "",
                    duration: "",
                    type: "",
                    sections: [],
                  });
                  resetQuestionForm();
                  setSelectedSectionId(null);
                  setExpandedSections({});
                }
              }}
            >
              <X className="h-4 w-4" />
              إلغاء
            </button>

            <button
              className="inline-flex items-center gap-2 px-4 py-3 text-sm rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
              onClick={() => {
                alert("تم حفظ الاختبار بنجاح!");
                console.log("Exam Data:", examData);
              }}
              disabled={!examData.sections.length}
            >
              <Save className="h-4 w-4" />
              حفظ الاختبار
            </button>
          </div>
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
    </div>
  );
}