// "use client";

// import React, { useEffect, useState } from "react";
// import {
//   PlusOutlined,
//   BookOutlined,
//   FileTextOutlined,
//   DeleteOutlined,
//   PlayCircleOutlined,
//   CalendarOutlined,
//   FolderOutlined,
//   SettingOutlined,
// } from "@ant-design/icons";
// import {
//   Form,
//   Button,
//   message,
//   Upload,
//   Divider,
// } from "antd";
// import dayjs from "dayjs";
// import "react-quill-new/dist/quill.snow.css";
// import dynamic from "next/dynamic";
// import AddCourseSourceContent from "../../../../components/SaudiCourseSource/AddCourseSourceContent";
// import AddCourseSourceBasicInfo from "../../../../components/SaudiCourseSource/AddCourseSourceBasicInfo";
// import AddCourseSourceShedule from "../../../../components/SaudiCourseSource/AddCourseSourceShedule";
// import AddCourseSourceResource from "../../../../components/SaudiCourseSource/AddCourseSourceResource";
// import { useDispatch, useSelector } from "react-redux";
// const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

// // Mock data for categories with sections
// export const all_categories = [
//   {
//     id: 1,
//     title: "دورات عامة",
//     sections: [
//       { id: 1, name: "تطوير الويب", isVisible: true },
//       { id: 2, name: "تطوير التطبيقات", isVisible: true },
//       { id: 3, name: "الذكاء الاصطناعي", isVisible: true },
//     ],
//   },
//   {
//     id: 2,
//     title: "الرخصة المهنية",
//     sections: [
//       { id: 4, name: "تصميم UI/UX", isVisible: true },
//       { id: 5, name: "الجرافيك ديزاين", isVisible: true },
//       { id: 6, name: "الرسم الرقمي", isVisible: false },
//     ],
//   },
//   {
//     id: 3,
//     title: "دورات اخري",
//     sections: [
//       { id: 7, name: "الرياضيات المتقدمة", isVisible: true },
//       { id: 8, name: "الفيزياء", isVisible: true },
//       { id: 9, name: "الكيمياء", isVisible: true },
//     ],
//   },
// ];

// const quillModules = {
//   toolbar: [
//     [{ header: [1, 2, 3, false] }],
//     ["bold", "italic", "underline", "strike"],
//     [{ list: "ordered" }, { list: "bullet" }],
//     [{ align: ["", "center", "right", "justify"] }],
//     [{ direction: "rtl" }],
//     [{ color: [] }, { background: [] }],
//     ["link", "blockquote", "code-block"],
//     ["clean"],
//   ],
// };

// const quillFormats = [
//   "header", "bold", "italic", "underline", "strike", "list",
//   "align", "direction", "color", "background", "link", "blockquote", "code-block",
// ];

// const RichTextField = ({ value, onChange, placeholder }) => (
//   <div dir="rtl" className="rich-text-field">
//     <ReactQuill
//       className="ql-rtl"
//       theme="snow"
//       value={value}
//       onChange={(html) => onChange?.(html)}
//       modules={quillModules}
//       formats={quillFormats}
//       placeholder={placeholder}
//       style={{ minHeight: "120px" }}
//     />
//   </div>
// );

// // Helper: convert file -> base64
// const getBase64 = (file) =>
//   new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.readAsDataURL(file);
//     reader.onload = () => resolve(reader.result);
//     reader.onerror = reject;
//   });

// const EnhancedCourseForm = ({ open, setOpen }) => {
//   const [form] = Form.useForm();
//   const [loading, setLoading] = useState(false);
//   const [activeTab, setActiveTab] = useState(1);
//   const [fileList, setFileList] = useState([]);
//   const [fileNames, setFileNames] = useState({}); // uid -> custom name
//   const [videos, setVideos] = useState([{ id: 1, name: "", url: "" }]);
//   const [imagePreview, setImagePreview] = useState(null);
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [availableSections, setAvailableSections] = useState([]);
//   const [schedules, setSchedules] = useState([]);
//   const [newSchedule, setNewSchedule] = useState({
//     day: "",
//     date:"",
//     startTime: null,
//     endTime: null,
//     maxStudents: 30,
//     isActive: true,
//   });
//   const dispatch = useDispatch();
//   const {add_round_loading} = useSelector(state => state?.rounds)

//   // Update sections when category changes
//   useEffect(() => {
//     if (selectedCategory) {
//       const category = all_categories.find(cat => cat.id === selectedCategory);
//       if (category) {
//         setAvailableSections(category.sections.filter(section => section.isVisible));
//       }
//     } else {
//       setAvailableSections([]);
//     }
//   }, [selectedCategory]);

//   const beforeUpload = async (file) => {
//     const isImage = file.type?.startsWith("image/");
//     if (!isImage) {
//       message.error("من فضلك ارفع ملف صورة فقط.");
//       return Upload.LIST_IGNORE;
//     }
//     const isLt5M = file.size / 1024 / 1024 < 5;
//     if (!isLt5M) {
//       message.error("حجم الصورة يجب أن يكون أقل من 5MB.");
//       return Upload.LIST_IGNORE;
//     }

//     const preview = await getBase64(file);
//     setImagePreview(preview);
//     setFileList([
//       {
//         uid: file.uid || file.name,
//         name: file.name,
//         status: "done",
//         originFileObj: file,
//       },
//     ]);
//     return false;
//   };

//   const onFilesChange = ({ fileList }) => {
//     setFileList(fileList);
//     setFileNames((prev) => {
//       const next = { ...prev };
//       fileList.forEach((f) => {
//         if (f.uid && !next[f.uid]) next[f.uid] = f.name?.replace(/\.[^.]+$/, "") || "";
//       });
//       // remove stale uids
//       Object.keys(next).forEach((uid) => {
//         if (!fileList.find((f) => f.uid === uid)) delete next[uid];
//       });
//       return next;
//     });
//   };

//   const handleAddSchedule = () => {
//     if (newSchedule.date && newSchedule.startTime && newSchedule.endTime) {
//       const schedule = {
//         ...newSchedule,
//         startTime: newSchedule.startTime.format("HH:mm"),
//         endTime: newSchedule.endTime.format("HH:mm"),
//       };
//       setSchedules([...schedules, schedule]);
//       setNewSchedule({
//         day: "",
//         startTime: null,
//         endTime: null,
//         maxStudents: 30,
//         isActive: true,
//       });
//       message.success("تم إضافة الجدولة بنجاح!");
//     } else {
//       message.error("يجب إدخال جميع البيانات المطلوبة.");
//     }
//   };

//   const handleUpdateSchedule = (index, updatedSchedule) => {
//     const newSchedules = [...schedules];
//     newSchedules[index] = {
//       ...updatedSchedule,
//       startTime: updatedSchedule.startTime?.format ?
//         updatedSchedule.startTime.format("HH:mm") : updatedSchedule.startTime,
//       endTime: updatedSchedule.endTime?.format ?
//         updatedSchedule.endTime.format("HH:mm") : updatedSchedule.endTime,
//     };
//     setSchedules(newSchedules);
//     message.success("تم تحديث الجدولة بنجاح!");
//   };

//   const handleRemoveSchedule = (index) => {
//     const newSchedules = [...schedules];
//     newSchedules.splice(index, 1);
//     setSchedules(newSchedules);
//     message.success("تم حذف الجدولة بنجاح!");
//   };

//   const handleFinish = async () => {
//     setLoading(true);
//     try {
//       const raw = form.getFieldsValue(true);

//       const payload = {
//         code: raw.code?.toUpperCase(),
//         imageUrl: imagePreview,
//         name: raw.name?.trim(),
//         category: raw.category,
//         section: raw.section,
//         price: Number(raw.price ?? 0),
//         duration: raw.duration?.trim(),
//         description: raw.description?.trim(),
//         status: raw.status,
//         genderPolicy: raw.genderPolicy,
//         capacity: Number(raw.capacity ?? 0),
//         instructor: raw.instructor,
//         availableFrom: raw.availableRange?.[0] ?
//           dayjs(raw.availableRange[0]).format("YYYY-MM-DD") : undefined,
//         availableTo: raw.availableRange?.[1] ?
//           dayjs(raw.availableRange[1]).format("YYYY-MM-DD") : undefined,
//         summary: raw.summary || "",
//         schedules: schedules,
//         resources: {
//           files: (raw.resources?.files || []).map((f) => ({
//             // preserve original file object where possible
//             uid: f.uid,
//             name: fileNames[f.uid] ?? f.name,
//             originName: f.name,
//             type: f.type,
//           })),
//           telegram: raw.resources?.telegram || "",
//           whatsapp: raw.resources?.whatsapp || "",
//           videos: videos.filter((v) => v.url?.trim()).map((v) => ({ name: v.name?.trim() || "", url: v.url.trim() })),
//         },
//       };

//       await new Promise((r) => setTimeout(r, 1500));
//       console.log("Enhanced Form Data:", payload);
//       message.success("تمت إضافة الدورة بنجاح!");
//       handleReset();
//       setOpen(false);
//     } catch (e) {
//       message.error("فشل إضافة الدورة. حاول مرة أخرى.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleReset = () => {
//     form.resetFields();
//     setFileList([]);
//     setImagePreview(null);
//     setSelectedCategory(null);
//     setAvailableSections([]);
//     setSchedules([]);
//     setNewSchedule({
//       day: "",
//       startTime: null,
//       endTime: null,
//       maxStudents: 30,
//       isActive: true,
//     });
//   };

//   const tabItems = [
//     { key: 1, label: "المعلومات الأساسية", icon: <BookOutlined /> },
//     // { key: 2, label: "الجدولة والمواعيد", icon: <CalendarOutlined /> },
//     // { key: 3, label: "المحتوى التفصيلي", icon: <FileTextOutlined /> },
//     // { key: 4, label: "المصادر والملفات", icon: <FolderOutlined /> },
//   ];

//   return (
//     <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 min-h-[80vh]" dir="rtl">
//           {/* Enhanced Header */}
//           <div className="relative mb-8 p-6 bg-white rounded-2xl shadow-sm border-b-4 border-b-blue-500">
//             <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full -translate-y-16 translate-x-16"></div>
//             <div className="relative flex items-center gap-4 mb-3">
//               <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
//                 <PlusOutlined className="text-white text-xl" />
//               </div>
//               <div>
//                 <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-blue-800 bg-clip-text text-transparent">
//                   إضافة دورة جديدة
//                 </h1>
//                 <p className="text-gray-600 mt-1">إنشاء وتكوين دورة تعليمية شاملة مع الجدولة والمحتوى</p>
//               </div>
//             </div>

//             {/* Progress Indicator */}
//             <div className="flex items-center gap-2 mt-4">
//               {tabItems.map((tab, index) => (
//                 <div
//                   key={tab.key}
//                   className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer
//                     ${activeTab === tab.key
//                       ? 'bg-blue-100 text-blue-700 border border-blue-200'
//                       : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
//                     }`}
//                   onClick={() => setActiveTab(tab.key)}
//                 >
//                   {tab.icon}
//                   <span className="hidden sm:inline">{tab.label}</span>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
//             <div
//               // form={form}
//               // layout="vertical"
//               // onFinish={handleFinish}
//               initialValues={{
//                 code: "COURSE_" + Math.random().toString(36).substr(2, 6).toUpperCase(),
//                 name: "",
//                 category: null,
//                 section: null,
//                 price: 499,
//                 duration: "3 شهور",
//                 description: "",
//                 status: "نشط",
//                 genderPolicy: "both",
//                 capacity: 50,
//                 instructor: [],
//                 availableRange: [dayjs().add(1, 'week'), dayjs().add(3, 'month')],
//                 summary: "",
//               }}
//               className="p-8"
//             >
//               {/* Basic Information Tab */}
//               {activeTab === 1 && (
//                 <AddCourseSourceBasicInfo
//                 all_categories={all_categories}
//                 availableSections={availableSections}
//                 beforeUpload={beforeUpload}
//                 fileList={fileList}
//                 selectedCategory={selectedCategory}
//                 setFileList={setFileList}
//                 setImagePreview={setImagePreview}
//                 setSelectedCategory={setSelectedCategory}
//                 />
//               )}

//               {/* Schedule Tab */}
//               {activeTab === 2 && (
//                 <AddCourseSourceShedule
//                 handleAddSchedule={handleAddSchedule}
//                 handleRemoveSchedule={handleRemoveSchedule}
//                 handleUpdateSchedule={handleUpdateSchedule}
//                 newSchedule={newSchedule}
//                 schedules={schedules}
//                 setNewSchedule={setNewSchedule}
//                 />
//               )}

//               {/* Content Tab */}
//               {activeTab === 3 && (
//                 <div className="space-y-8">
//                   <div className="rounded-2xl p-6">
//                     <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
//                       <FileTextOutlined className="text-green-600" />
//                       المحتوى التفصيلي للدورة
//                     </h3>

//                     <Form.Item
//                       label={<span className="font-semibold text-gray-700">ملخص الدورة</span>}
//                       name="summary"
//                     >
//                       <RichTextField
//                         placeholder="اكتب ملخصاً شاملاً للدورة يتضمن الأهداف التعليمية والمخرجات المتوقعة..."
//                       />
//                     </Form.Item>

//                     <Form.Item
//                       label={<span className="font-semibold text-gray-700">الشروط والأحكام</span>}
//                       name="privacy"
//                     >
//                       <RichTextField
//                         placeholder="اكتب ملخصاً شاملاً للدورة يتضمن الأهداف التعليمية والمخرجات المتوقعة..."
//                       />
//                     </Form.Item>

//                       <Form.Item
//                       label={<span className="font-semibold text-gray-700">مميزات الدورة</span>}
//                       name="benefits"
//                     >
//                       <RichTextField
//                         placeholder={"اكتب مميزات الدورة ...."}
//                       />
//                     </Form.Item>

//                     <Divider />

//                     <div>
//                       <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
//                         <PlayCircleOutlined className="text-blue-600" />
//                         المحتوى التعليمي
//                       </h4>
//                       <p className="text-gray-600 mb-4">
//                         يمكنك إضافة المحتوى التعليمي التفصيلي (الدروس، الفيديوهات، الاختبارات) بعد إنشاء الدورة
//                       </p>
//                       <AddCourseSourceContent
//                         courseId={null}
//                         onContentAdded={(content) => console.log('Content added:', content)}
//                       />
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* Resources Tab */}
//               {activeTab === 4 && (
//                 <AddCourseSourceResource
//                 setVideos={setVideos}
//                 videos={videos}
//                 />
//               )}

//               {/* Navigation and Actions */}
//               <div className="flex items-center justify-between pt-8 border-t border-gray-200">
//                 <div className="flex items-center gap-3">
//                   {activeTab > 1 && (
//                     <Button
//                       size="large"
//                       onClick={() => setActiveTab(activeTab - 1)}
//                       className="rounded-xl"
//                       icon={<span>←</span>}
//                     >
//                       السابق
//                     </Button>
//                   )}
//                 </div>

//                 {/* <div className="flex items-center gap-3">
//                   {activeTab < 4 ? (
//                     <Button
//                       type="primary"
//                       size="large"
//                       onClick={() => setActiveTab(activeTab + 1)}
//                       className="rounded-xl"
//                       icon={<span>→</span>}
//                     >
//                       التالي
//                     </Button>
//                   ) : (
//                     <Button
//                       type="primary"
//                       size="large"
//                       htmltype="submit"
//                       loading={loading}
//                       className="rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
//                       icon={<PlusOutlined />}
//                     >
//                       إنشاء الدورة
//                     </Button>
//                   )}
//                 </div> */}
//               </div>
//             </div>
//           </div>
//         </div>

//   );
// };

// export default EnhancedCourseForm;

// "use client";
// import { useParams, useSearchParams } from "next/navigation";
// import React, { useEffect, useState } from "react";
// import { PlusOutlined } from "@ant-design/icons";
// import { Check } from "lucide-react";
// import AddCourseSourceBasicInfo from "../../../../../components/SaudiCourseSource/AddCourseSourceBasicInfo";
// import Features from "../../../../../components/SaudiCourseSource/Features";
// import AddCourseSourceResource from "../../../../../components/SaudiCourseSource/AddCourseSourceResource";
// import { handleGetSourceRound } from "../../../../../lib/features/roundsSlice";
// import { useDispatch } from "react-redux";

// // Define the steps data
// const STEPS = [
//   {
//     id: 1,
//     title: "بيانات الدورة",
//     description: "إضافة أقسام، دروس، ومواد تعليمية.",
//   },
//   {
//     id: 2,
//     title: "مميزات الدورة",
//     description: "إضافة أقسام، دروس، ومواد تعليمية.",
//   },
//   {
//     id: 3,
//     title: "المصادر والملفات",
//     description: "رفع الملفات والروابط المساندة ومراجعة الدورة.",
//   },
// ];

// export default function Page() {
//   const {id} = useParams();
//   const params = useSearchParams();
//   const [currentStep, setCurrentStep] = useState(1);
//   const [roundId, setRoundId] = useState(null);
//   const [fileList, setFileList] = useState([]);
//   const [fileNames, setFileNames] = useState({});
//   const [videos, setVideos] = useState([{ id: 1, name: "", url: "" }]);
//   const [imagePreview, setImagePreview] = useState(null);
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [rowData , setRowData] = useState({});
//   const dispatch = useDispatch();

//     useEffect(() => {
//        dispatch(handleGetSourceRound())
//        .unwrap()
//        .then(res => {
//          if(res?.data?.status == "success") {
//           setRowData(res?.data?.message?.data?.find(item => item?.id == id));
//          }
//        })
//      } , [id])
   
//   // --- Navigation Logic ---
//   const goToNextStep = () => {
//     setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
//   };

//   const goToPrevStep = () => {
//     setCurrentStep((prev) => Math.max(prev - 1, 1));
//   };
//   // -------------------------

//   const getStepStatus = (stepId) => {
//     if (stepId < currentStep) return "complete";
//     if (stepId === currentStep) return "current";
//     return "upcoming";
//   };

//   const beforeUpload = async (file) => {
//     const isImage = file.type?.startsWith("image/");
//     if (!isImage) {
//       message.error("من فضلك ارفع ملف صورة فقط.");
//       return Upload.LIST_IGNORE;
//     }
//     const isLt5M = file.size / 1024 / 1024 < 5;
//     if (!isLt5M) {
//       message.error("حجم الصورة يجب أن يكون أقل من 5MB.");
//       return Upload.LIST_IGNORE;
//     }

//     const preview = await getBase64(file);
//     setImagePreview(preview);
//     setFileList([
//       {
//         uid: file.uid || file.name,
//         name: file.name,
//         status: "done",
//         originFileObj: file,
//       },
//     ]);
//     return false;
//   };

//   const onFilesChange = ({ fileList }) => {
//     setFileList(fileList);
//     setFileNames((prev) => {
//       const next = { ...prev };
//       fileList.forEach((f) => {
//         if (f.uid && !next[f.uid])
//           next[f.uid] = f.name?.replace(/\.[^.]+$/, "") || "";
//       });
//       // remove stale uids
//       Object.keys(next).forEach((uid) => {
//         if (!fileList.find((f) => f.uid === uid)) delete next[uid];
//       });
//       return next;
//     });
//   };

//   const getStatusClasses = (status) => {
//     switch (status) {
//       case "complete":
//         return {
//           dot: "bg-blue-600 text-white border-blue-600",
//           text: "text-blue-800 font-semibold",
//           line: "bg-blue-600",
//         };
//       case "current":
//         return {
//           dot: "bg-white text-blue-600 border-2 border-blue-600 shadow-md",
//           text: "text-gray-900 font-bold",
//           line: "bg-gray-300",
//         };
//       case "upcoming":
//       default:
//         return {
//           dot: "bg-gray-200 text-gray-500 border-gray-300",
//           text: "text-gray-500",
//           line: "bg-gray-300",
//         };
//     }
//   };

//   // ------- Step content -------
//   const renderStepContent = () => {
//     if (currentStep === 1) {
//       // مرحلة التأسيس
//       return (
//         <AddCourseSourceBasicInfo
//           id={id}
//           beforeUpload={beforeUpload}
//           fileList={fileList}
//           selectedCategory={selectedCategory}
//           setSelectedCategory={setSelectedCategory}
//           setFileList={setFileList}
//           setImagePreview={setImagePreview}
//           currentStep={currentStep}
//           goToNextStep={goToNextStep}
//           goToPrevStep={goToPrevStep}
//           setRoundId={setRoundId}
//           rowData={rowData}
//           setRowData={setRowData}
//         />
//       );
//     }

//     if (currentStep === 2) {
//       // المحاضرات
//       return (
//         <Features
//           roundId={roundId}
//           currentStep={currentStep}
//           goToNextStep={goToNextStep}
//           goToPrevStep={goToPrevStep}
//           STEPS={STEPS}
//         />
//         //  <CourseSourceLecturesContent id={id}/>
//       );
//     }

//     // المصادر والملفات
//     return (
//       <AddCourseSourceResource
//         currentStep={currentStep}
//         goToPrevStep={goToPrevStep}
//         id={roundId}
//         STEPS={STEPS}
//       />
//     );
//   };
//   // ---------------------------

//   return (
//     <div
//       className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-4 sm:p-8"
//       dir="rtl"
//     >
//       {/* Header */}
//       <div className="relative mx-auto mb-8 max-w-6xl rounded-2xl border-b-4 border-blue-500 bg-white p-6 shadow-xl">
//         <div className="absolute top-0 right-0 h-32 w-32 -translate-y-16 translate-x-16 rounded-full bg-gradient-to-br from-blue-400/10 to-purple-400/10 opacity-50" />

//         <div className="relative mb-3 flex items-center gap-4">
//           <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 shadow-2xl">
//             <PlusOutlined className="text-xl text-white" />
//           </div>
//           <div>
//             <h1 className="bg-gradient-to-r from-gray-800 to-blue-800 bg-clip-text text-3xl font-extrabold text-transparent">
//               إضافة دورة جديدة
//             </h1>
//             <p className="mt-1 text-gray-600">
//               إنشاء وتكوين دورة تعليمية شاملة مع الجدولة والمحتوى.
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Main */}
//       <div className="mx-auto max-w-6xl">
//         {/* Stepper */}
//         <div className="mb-10 flex items-start justify-between rounded-xl border border-gray-100 bg-white p-6 shadow-lg">
//           {STEPS.map((step, index) => {
//             const status = getStepStatus(step.id);
//             const { dot, text, line } = getStatusClasses(status);
//             const isLast = index === STEPS.length - 1;

//             return (
//               <React.Fragment key={step.id}>
//                 <div className="flex w-1/4 min-w-0 flex-shrink-0 flex-col items-center">
//                   <div
//                     className={`relative flex h-10 w-10 items-center justify-center rounded-full transition duration-300 ${dot}`}
//                   >
//                     {status === "complete" ? (
//                       <Check className="h-4 w-4" />
//                     ) : (
//                       <span className="text-lg">{step.id}</span>
//                     )}
//                   </div>

//                   <div className="mt-3 min-w-0 text-center">
//                     <h3
//                       className={`overflow-hidden text-ellipsis whitespace-nowrap text-sm md:text-base leading-tight transition duration-300 ${text}`}
//                     >
//                       {step.title}
//                     </h3>
//                     <p className="mt-0.5 hidden text-xs text-gray-500 md:block">
//                       {status === "current"
//                         ? "الخطوة الحالية"
//                         : step.description.split(",")[0]}
//                     </p>
//                   </div>
//                 </div>

//                 {!isLast && (
//                   <div className="mx-2 flex flex-grow items-center">
//                     <div
//                       className={`h-0.5 w-full transition duration-300 ${
//                         status === "complete" ? "bg-blue-600" : line
//                       }`}
//                     />
//                   </div>
//                 )}
//               </React.Fragment>
//             );
//           })}
//         </div>

//         {/* Content */}
//         <div className="mt-8 rounded-xl border border-gray-100 bg-white p-8 shadow-lg">
//           <h2 className="mb-4 border-b pb-2 text-2xl font-bold text-gray-800">
//             الخطوة {currentStep}: {STEPS[currentStep - 1].title}
//           </h2>

//           {renderStepContent()}

//           {/* Navigation buttons */}
//           {/* <div className="mt-8 flex justify-between space-x-4 space-x-reverse">
//             <button
//               onClick={goToPrevStep}
//               disabled={currentStep === 1}
//               className={`rounded-lg border border-gray-300 bg-white px-6 py-2 text-gray-700 transition duration-150 hover:bg-gray-50 ${
//                 currentStep === 1 ? "cursor-not-allowed opacity-50" : ""
//               }`}
//             >
//               السابق
//             </button>
//             <button
//               onClick={goToNextStep}
//               disabled={currentStep === STEPS.length}
//               className={`rounded-lg bg-blue-600 px-6 py-2 text-white shadow-md transition duration-150 hover:bg-blue-700 ${
//                 currentStep === STEPS.length ? "cursor-not-allowed opacity-50" : ""
//               }`}
//             >
//               {currentStep === STEPS.length ? "إنهاء ونشر" : "التالي"}
//             </button>
//           </div> */}
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";
import { useParams, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Check } from "lucide-react";
import { Upload, message } from "antd";
import AddCourseSourceBasicInfo from "../../../../../components/SaudiCourseSource/AddCourseSourceBasicInfo";
import Features from "../../../../../components/SaudiCourseSource/Features";
import AddCourseSourceResource from "../../../../../components/SaudiCourseSource/AddCourseSourceResource";
import { handleGetSourceRound } from "../../../../../lib/features/roundsSlice";
import { useDispatch } from "react-redux";

// Helper لتحويل الصورة لـ base64 (للمعاينة)
const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

// Define the steps data
const STEPS = [
  {
    id: 1,
    title: "بيانات الدورة",
    description: "إضافة أقسام، دروس، ومواد تعليمية.",
  },
  {
    id: 2,
    title: "مميزات الدورة",
    description: "إضافة أقسام، دروس، ومواد تعليمية.",
  },
  {
    id: 3,
    title: "المصادر والملفات",
    description: "رفع الملفات والروابط المساندة ومراجعة الدورة.",
  },
];

export default function Page() {
  const { id } = useParams();
  const params = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [roundId, setRoundId] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [fileNames, setFileNames] = useState({});
  const [videos, setVideos] = useState([{ id: 1, name: "", url: "" }]);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [rowData, setRowData] = useState({});
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(handleGetSourceRound())
      .unwrap()
      .then((res) => {
        if (res?.data?.status === "success") {
          const found = res?.data?.message?.data?.find(
            (item) => String(item?.id) === String(id)
          );
          setRowData(found || null);
          if (found?.id) {
            setRoundId(found.id);
          }
        }
      });
  }, [id, dispatch]);

  // --- Navigation Logic ---
  const goToNextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
  };

  const goToPrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };
  // -------------------------

  const getStepStatus = (stepId) => {
    if (stepId < currentStep) return "complete";
    if (stepId === currentStep) return "current";
    return "upcoming";
  };

  const beforeUpload = async (file) => {
    const isImage = file.type?.startsWith("image/");
    if (!isImage) {
      message.error("من فضلك ارفع ملف صورة فقط.");
      return Upload.LIST_IGNORE;
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error("حجم الصورة يجب أن يكون أقل من 5MB.");
      return Upload.LIST_IGNORE;
    }

    const preview = await getBase64(file);
    setImagePreview(preview);
    setFileList([
      {
        uid: file.uid || file.name,
        name: file.name,
        status: "done",
        originFileObj: file,
      },
    ]);
    return false; // منع الرفع التلقائي
  };

  const onFilesChange = ({ fileList }) => {
    setFileList(fileList);
    setFileNames((prev) => {
      const next = { ...prev };
      fileList.forEach((f) => {
        if (f.uid && !next[f.uid])
          next[f.uid] = f.name?.replace(/\.[^.]+$/, "") || "";
      });
      Object.keys(next).forEach((uid) => {
        if (!fileList.find((f) => f.uid === uid)) delete next[uid];
      });
      return next;
    });
  };

  const getStatusClasses = (status) => {
    switch (status) {
      case "complete":
        return {
          dot: "bg-blue-600 text-white border-blue-600",
          text: "text-blue-800 font-semibold",
          line: "bg-blue-600",
        };
      case "current":
        return {
          dot: "bg-white text-blue-600 border-2 border-blue-600 shadow-md",
          text: "text-gray-900 font-bold",
          line: "bg-gray-300",
        };
      case "upcoming":
      default:
        return {
          dot: "bg-gray-200 text-gray-500 border-gray-300",
          text: "text-gray-500",
          line: "bg-gray-300",
        };
    }
  };

  // ------- Step content -------
  const renderStepContent = () => {
    if (currentStep === 1) {
      return (
        <AddCourseSourceBasicInfo
          id={id}
          beforeUpload={beforeUpload}
          fileList={fileList}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          setFileList={setFileList}
          setImagePreview={setImagePreview}
          currentStep={currentStep}
          goToNextStep={goToNextStep}
          goToPrevStep={goToPrevStep}
          setRoundId={setRoundId}
          rowData={rowData}
          setRowData={setRowData}
        />
      );
    }

    if (currentStep === 2) {
      return (
        <Features
          roundId={roundId}
          currentStep={currentStep}
          goToNextStep={goToNextStep}
          goToPrevStep={goToPrevStep}
          STEPS={STEPS}
        />
      );
    }

    return (
      <AddCourseSourceResource
        currentStep={currentStep}
        goToPrevStep={goToPrevStep}
        id={roundId}
        STEPS={STEPS}
      />
    );
  };
  // ---------------------------

  const isEditMode = Boolean(id && rowData?.id);

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-4 sm:p-8"
      dir="rtl"
    >
      {/* Header */}
      <div className="relative mx-auto mb-8 max-w-6xl rounded-2xl border-b-4 border-blue-500 bg-white p-6 shadow-xl">
        <div className="absolute top-0 right-0 h-32 w-32 -translate-y-16 translate-x-16 rounded-full bg-gradient-to-br from-blue-400/10 to-purple-400/10 opacity-50" />

        <div className="relative mb-3 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 shadow-2xl">
            <PlusOutlined className="text-xl text-white" />
          </div>
          <div>
            <h1 className="bg-gradient-to-r from-gray-800 to-blue-800 bg-clip-text text-3xl font-extrabold text-transparent">
              {isEditMode ? "تعديل بيانات الدورة" : "إضافة دورة جديدة"}
            </h1>
            <p className="mt-1 text-gray-600">
              إنشاء وتكوين دورة تعليمية شاملة مع الجدولة والمحتوى.
            </p>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="mx-auto max-w-6xl">
        {/* Stepper */}
        <div className="mb-10 flex items-start justify-between rounded-xl border border-gray-100 bg-white p-6 shadow-lg">
          {STEPS.map((step, index) => {
            const status = getStepStatus(step.id);
            const { dot, text, line } = getStatusClasses(status);
            const isLast = index === STEPS.length - 1;

            return (
              <React.Fragment key={step.id}>
                <div className="flex w-1/4 min-w-0 flex-shrink-0 flex-col items-center">
                  <div
                    className={`relative flex h-10 w-10 items-center justify-center rounded-full transition duration-300 ${dot}`}
                  >
                    {status === "complete" ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <span className="text-lg">{step.id}</span>
                    )}
                  </div>

                  <div className="mt-3 min-w-0 text-center">
                    <h3
                      className={`overflow-hidden text-ellipsis whitespace-nowrap text-sm md:text-base leading-tight transition duration-300 ${text}`}
                    >
                      {step.title}
                    </h3>
                    <p className="mt-0.5 hidden text-xs text-gray-500 md:block">
                      {status === "current"
                        ? "الخطوة الحالية"
                        : step.description.split(",")[0]}
                    </p>
                  </div>
                </div>

                {!isLast && (
                  <div className="mx-2 flex flex-grow items-center">
                    <div
                      className={`h-0.5 w-full transition duration-300 ${
                        status === "complete" ? "bg-blue-600" : line
                      }`}
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Content */}
        <div className="mt-8 rounded-xl border border-gray-100 bg-white p-8 shadow-lg">
          <h2 className="mb-4 border-b pb-2 text-2xl font-bold text-gray-800">
            الخطوة {currentStep}: {STEPS[currentStep - 1].title}
          </h2>

          {renderStepContent()}
        </div>
      </div>
    </div>
  );
}
