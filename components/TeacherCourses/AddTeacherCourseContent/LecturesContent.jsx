// import React, { useState } from "react";
// import Button from "@/components/atoms/Button";
// import { Card, Collapse, Empty, Space, Tag, Tooltip } from "antd";
// import {
//   Eye,
//   EyeOff,
//   Trash2,
//   Edit3,
//   CheckCircle2,
//   AlertCircle,
//   Clock,
//   Award,
//   Star,
//   Layers,
//   Video,
//   PlayCircle,
//   ExternalLink,
//   FileImage,
//   FileText,
//   Target,
//   Download,
//   Play,
//   BookOpen,
// } from "lucide-react";

// const { Panel } = Collapse;

// /**
//  * Props expected:
//  * - foundationStages: [
//  *     {
//  *       id, title, visible,
//  *       lessons: [{
//  *          id, title, visible, duration?, difficulty?, completionRate?,
//  *          lessonVideo: { title, source: "url"|"file", url?, duration? },
//  *          training: {
//  *            video: { title, source: "url"|"file", url?, duration? },
//  *            pdfs: [{ id?, name|title, size?, fileList? }]
//  *          }
//  *       }]
//  *     }
//  *   ]
//  * - toggleStageVisibility(stageId)
//  * - toggleLessonVisibility(stageId, lessonId)
//  * - deleteStage(stageId)
//  * - deleteLesson(stageId, lessonId)
//  * - setOpenAddStage(boolean)
//  * - setOpenAddLesson(boolean)
//  * - onEditStage?(stageId)
//  * - onEditLesson?(stageId, lessonId)
//  */
// export default function LecturesContent({
//   foundationStages = [],
//   toggleStageVisibility,
//   toggleLessonVisibility,
//   deleteStage,
//   deleteLesson,
//   setOpenAddLesson,
//   setOpenAddStage,
//   onEditStage,
//   onEditLesson,
// }) {
//   const [expandedLessonId, setExpandedLessonId] = useState(null);
//   const toggleLessonExpand = (lessonId) =>
//     setExpandedLessonId((prev) => (prev === lessonId ? null : lessonId));

//   return (
//     <Card
//       title={
//         <div className="flex items-center justify-between">
//           <span className="font-bold">المحاضرات</span>
//           <div className="flex items-center gap-2">
//             <Button className="!bg-gray-800 !text-white" onClick={() => setOpenAddStage(true)}>
//               إضافة مرحلة
//             </Button>
//             <Button type="primary" className="!bg-blue-600 !text-white" onClick={() => setOpenAddLesson(true)}>
//               إضافة درس
//             </Button>
//           </div>
//         </div>
//       }
//       className="mb-6"
//     >
//       {foundationStages.length === 0 ? (
//         <Empty description="لا توجد مراحل بعد" />
//       ) : (
//         <Collapse accordion>
//           {foundationStages.map((st) => (
//             <Panel
//               key={st.id}
//               header={
//                 <div className="flex items-center  shadow rounded-3xl  justify-between">
//                   <div className="flex items-center gap-2">

//                     <span className={`font-semibold ${st.visible ? "text-gray-800" : "text-gray-400"}`}>
//                        المرحلة :
//                       {st.title}
//                     </span>
//                   </div>

//                   <div className="flex items-center gap-2">
//                     <span className="text-xs text-gray-500">{st.lessons?.length || 0} درس</span>

//                     {onEditStage && (
//                       <Tooltip title="تعديل اسم المرحلة">
//                         <Button
//                           type="text"
//                           icon={<Edit3 className="w-4 h-4 text-blue-600" />}
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             onEditStage(st.id);
//                           }}
//                         />
//                       </Tooltip>
//                     )}

//                     <Tooltip title="حذف المرحلة">
//                       <Button
//                         danger
//                         type="text"
//                         icon={<Trash2 className="w-4 h-4" />}
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           deleteStage(st.id);
//                         }}
//                       />
//                     </Tooltip>

//                     <Tooltip title={st.visible ? "إخفاء المرحلة" : "إظهار المرحلة"}>
//                       <Button
//                         type="text"
//                         icon={
//                           st.visible ? (
//                             <Eye className="w-4 h-4 text-green-600" />
//                           ) : (
//                             <EyeOff className="w-4 h-4 text-gray-400" />
//                           )
//                         }
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           toggleStageVisibility(st.id);
//                         }}
//                       />
//                     </Tooltip>
//                   </div>
//                 </div>
//               }
//             >
//               {(st.lessons || []).length === 0 ? (
//                 <Empty description="لا توجد دروس في هذه المرحلة" />
//               ) : (
//                 <div className="space-y-6">
//                   {st.lessons.map((lesson, index) => (
//                     <div
//                       key={lesson.id}
//                       className={`group relative overflow-hidden rounded-3xl border transition-all duration-300 hover:scale-[1.01] ${
//                         lesson.visible
//                           ? "bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/20 border-blue-200/60 hover:border-blue-300 shadow"
//                           : "bg-gradient-to-br from-gray-50 via-gray-100/50 to-gray-200/30 border-gray-200 opacity-80"
//                       }`}
//                     >
//                       {/* background accents */}
//                       <div className="absolute inset-0 opacity-5 pointer-events-none">
//                         <div className="absolute top-4 right-4 w-24 h-24 bg-blue-400 rounded-full" />
//                         <div className="absolute bottom-4 left-4 w-16 h-16 bg-indigo-400 rounded-full" />
//                       </div>

//                       <div className="relative p-6 lg:p-8">
//                         {/* Header */}
//                         <div className="flex items-start justify-between gap-6 mb-6">
//                           <div className="flex items-start gap-4 lg:gap-6 flex-1">
//                             {/* number + status */}
//                             <div className="relative">
//                               <div
//                                 className={`w-16 h-16 lg:w-20 lg:h-20 rounded-3xl flex items-center justify-center font-black text-lg lg:text-xl ${
//                                   lesson.visible
//                                     ? "bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 text-white shadow"
//                                     : "bg-gradient-to-br from-gray-400 to-gray-500 text-gray-200"
//                                 }`}
//                               >
//                                 <span>{index + 1}</span>
//                               </div>

//                               <div
//                                 className={`absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center shadow ${
//                                   lesson.visible
//                                     ? "bg-gradient-to-br from-green-400 to-green-600"
//                                     : "bg-gradient-to-br from-gray-400 to-gray-500"
//                                 }`}
//                               >
//                                 {lesson.visible ? (
//                                   <CheckCircle2 className="w-4 h-4 text-white" />
//                                 ) : (
//                                   <AlertCircle className="w-4 h-4 text-white" />
//                                 )}
//                               </div>
//                             </div>

//                             {/* title + meta */}
//                             <div className="flex-1 space-y-4">
//                               <div className="space-y-3">
//                                 <div className="flex flex-col lg:flex-row lg:items-start gap-3">
//                                   <h4
//                                     className={`font-black text-xl lg:text-2xl leading-tight ${
//                                       lesson.visible ? "text-gray-900" : "text-gray-500"
//                                     }`}
//                                   >
//                                    القسم :
//                                     { lesson.title}
//                                   </h4>

//                                   {!lesson.visible && (
//                                     <span className="inline-flex items-center gap-2 bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-sm font-bold">
//                                       <EyeOff className="w-4 h-4" />
//                                       مخفي
//                                     </span>
//                                   )}
//                                 </div>

//                                 <div className="flex flex-wrap items-center gap-3 lg:gap-4">
//                                   {!!lesson.duration && (
//                                     <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-lg border border-blue-100">
//                                       <Clock className="w-4 h-4 text-blue-600" />
//                                       <span className="text-blue-700 font-semibold text-sm">{lesson.duration}</span>
//                                     </div>
//                                   )}

//                                   {!!lesson.difficulty && (
//                                     <div
//                                       className={`flex items-center gap-2 px-3 py-1 rounded-lg border ${
//                                         lesson.difficulty === "مبتدئ"
//                                           ? "bg-green-50 border-green-100 text-green-700"
//                                           : lesson.difficulty === "متوسط"
//                                           ? "bg-yellow-50 border-yellow-100 text-yellow-700"
//                                           : "bg-red-50 border-red-100 text-red-700"
//                                       }`}
//                                     >
//                                       <Award className="w-4 h-4" />
//                                       <span className="font-semibold text-sm">{lesson.difficulty}</span>
//                                     </div>
//                                   )}

//                                   {typeof lesson.completionRate === "number" && (
//                                     <div className="flex items-center gap-2 bg-purple-50 px-3 py-1 rounded-lg border border-purple-100">
//                                       <Star className="w-4 h-4 text-purple-600" />
//                                       <span className="text-purple-700 font-semibold text-sm">
//                                         {lesson.completionRate}% إكمال
//                                       </span>
//                                     </div>
//                                   )}

//                                   <button
//                                     onClick={() => toggleLessonExpand(lesson.id)}
//                                     className="flex items-center gap-2 bg-indigo-50 hover:bg-indigo-100 px-3 py-1 rounded-lg border border-indigo-100 text-indigo-700 font-semibold text-sm transition-all"
//                                   >
//                                     <Layers className="w-4 h-4" />
//                                     {expandedLessonId === lesson.id ? "إخفاء التفاصيل" : "عرض التفاصيل"}
//                                   </button>
//                                 </div>
//                               </div>
//                             </div>
//                           </div>

//                           {/* Actions */}
//                           <div className="flex items-start gap-2">
//                             {onEditLesson && (
//                               <Tooltip title="تعديل الدرس">
//                                 <Button
//                                   className="!w-12 !h-12 !bg-blue-50 hover:!bg-blue-100 !text-blue-600 !border-blue-200 hover:!border-blue-300"
//                                   icon={<Edit3 className="w-5 h-5" />}
//                                   onClick={() => onEditLesson(st.id, lesson.id)}
//                                 />
//                               </Tooltip>
//                             )}

//                             <Tooltip title={lesson.visible ? "إخفاء الدرس" : "إظهار الدرس"}>
//                               <Button
//                                 className={`!w-12 !h-12 transition-all ${
//                                   lesson.visible
//                                     ? "!bg-orange-50 hover:!bg-orange-100 !text-orange-600 !border-orange-200 hover:!border-orange-300"
//                                     : "!bg-green-50 hover:!bg-green-100 !text-green-600 !border-green-200 hover:!border-green-300"
//                                 }`}
//                                 icon={lesson.visible ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
//                                 onClick={() => toggleLessonVisibility(st.id, lesson.id)}
//                               />
//                             </Tooltip>

//                             <Tooltip title="حذف الدرس">
//                               <Button
//                                 danger
//                                 className="!w-12 !h-12"
//                                 icon={<Trash2 className="w-5 h-5" />}
//                                 onClick={() => deleteLesson(st.id, lesson.id)}
//                               />
//                             </Tooltip>
//                           </div>
//                         </div>

//                         {/* Content sections */}
//                         <div className="space-y-6">
//                           {/* Main Video */}
//                           <div className="bg-gradient-to-r from-blue-50 via-cyan-50 to-blue-50 rounded-2xl lg:rounded-3xl p-6 lg:p-8 border-2 border-blue-100 hover:border-blue-200 transition-all">
//                             <div className="flex items-start justify-between gap-4 mb-6">
//                               <div className="flex items-center gap-4">
//                                 <div className="bg-blue-600 p-3 rounded-2xl shadow">
//                                   <Video className="w-6 h-6 text-white" />
//                                 </div>
//                                 <div>
//                                   <h5 className="font-black text-xl text-gray-900 mb-1">الفيديو</h5>
//                                   <p className="text-blue-600 font-semibold">
//                                     {lesson.lessonVideo?.duration || "مدة غير محددة"}
//                                   </p>
//                                 </div>
//                               </div>

//                               <Tag color="blue" className="!px-4 !py-2 !rounded-xl !font-bold">
//                                 <PlayCircle className="w-4 h-4" />
//                                 فيديو أساسي
//                               </Tag>
//                             </div>

//                             <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-blue-200/50 shadow">
//                               <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
//                                 <div className="space-y-2">
//                                   <h6 className="font-bold text-lg text-gray-900">
//                                     {lesson.lessonVideo?.title || "لم يتم تحديد العنوان"}
//                                   </h6>
//                                   <div className="flex items-center gap-3 text-sm text-gray-600">
//                                     {lesson.lessonVideo?.source === "url" ? (
//                                       <span className="flex items-center gap-2">
//                                         <ExternalLink className="w-4 h-4 text-blue-500" />
//                                         رابط خارجي
//                                       </span>
//                                     ) : (
//                                       <span className="flex items-center gap-2">
//                                         <FileImage className="w-4 h-4 text-green-500" />
//                                         ملف مرفوع
//                                       </span>
//                                     )}
//                                   </div>
//                                 </div>

//                                 <div className="flex items-center gap-3">
//                                   {lesson.lessonVideo?.source === "url" && lesson.lessonVideo?.url ? (
//                                     <a
//                                       href={lesson.lessonVideo.url}
//                                       target="_blank"
//                                       rel="noreferrer"
//                                       className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow"
//                                     >
//                                       <PlayCircle className="w-5 h-5" />
//                                       مشاهدة الآن
//                                     </a>
//                                   ) : (
//                                     <span className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-2xl font-bold shadow">
//                                       <CheckCircle2 className="w-5 h-5" />
//                                       جاهز للعرض
//                                     </span>
//                                   )}
//                                 </div>
//                               </div>
//                             </div>
//                           </div>

//                           {/* Training */}
//                           <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 rounded-2xl lg:rounded-3xl p-6 lg:p-8 border-2 border-amber-200 hover:border-amber-300 transition-all">
//                             <div className="flex items-start justify-between gap-4 mb-6">
//                               <div className="flex items-center gap-4">
//                                 <div className="bg-amber-600 p-3 rounded-2xl shadow">
//                                   <Target className="w-6 h-6 text-white" />
//                                 </div>
//                                 <div>
//                                   <h5 className="font-black text-xl text-gray-900 mb-1"> التدريب</h5>
//                                   <p className="text-amber-600 font-semibold">تطبيقات عملية ومواد مساعدة</p>
//                                 </div>
//                               </div>

//                             </div>

//                             <div className="space-y-6">
//                               {/* Training Video */}
//                               <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-amber-200/50 shadow">
//                                 <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
//                                   <div className="flex items-start gap-4">
//                                     <div className="bg-amber-100 p-2 rounded-xl">
//                                       <PlayCircle className="w-5 h-5 text-amber-600" />
//                                     </div>
//                                     <div className="space-y-2">
//                                       <h6 className="font-bold text-lg text-gray-900">
//                                         {lesson.training?.video?.title || "لم يتم تحديد فيديو التدريب"}
//                                       </h6>
//                                       <div className="flex items-center gap-4 text-sm text-gray-600">
//                                         <span className="flex items-center gap-2">
//                                           <Clock className="w-4 h-4" />
//                                           {lesson.training?.video?.duration || "مدة غير محددة"}
//                                         </span>
//                                         {lesson.training?.video?.source === "url" ? (
//                                           <span className="flex items-center gap-2">
//                                             <ExternalLink className="w-4 h-4 text-blue-500" />
//                                             رابط خارجي
//                                           </span>
//                                         ) : (
//                                           <span className="flex items-center gap-2">
//                                             <FileImage className="w-4 h-4 text-green-500" />
//                                             ملف مرفوع
//                                           </span>
//                                         )}
//                                       </div>
//                                     </div>
//                                   </div>

//                                   {lesson.training?.video?.source === "url" && lesson.training?.video?.url ? (
//                                     <a
//                                       href={lesson.training.video.url}
//                                       target="_blank"
//                                       rel="noreferrer"
//                                       className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow"
//                                     >
//                                       <ExternalLink className="w-4 h-4" />
//                                       مشاهدة التدريب
//                                     </a>
//                                   ) : lesson.training?.video?.title ? (
//                                     <span className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-2xl font-bold shadow">
//                                       <CheckCircle2 className="w-4 h-4" />
//                                       متاح
//                                     </span>
//                                   ) : null}
//                                 </div>
//                               </div>

//                               {/* Training PDFs */}
//                               <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-amber-200/50 shadow">
//                                 <div className="flex items-center justify-between mb-4">
//                                   <div className="flex items-center gap-3">
//                                     <div className="bg-amber-100 p-2 rounded-xl">
//                                       <FileText className="w-5 h-5 text-amber-600" />
//                                     </div>
//                                     <div>
//                                       <h6 className="font-bold text-lg text-gray-900">المواد المساعدة (PDF)</h6>
//                                       <p className="text-sm text-gray-600">ملفات للمراجعة والتحميل</p>
//                                     </div>
//                                   </div>

//                                   <div className="flex items-center gap-3">
//                                     <span className="inline-flex items-center justify-center w-8 h-8 bg-amber-600 text-white rounded-full font-bold text-sm">
//                                       {lesson.training?.pdfs?.length || 0}
//                                     </span>
//                                     {(lesson.training?.pdfs?.length || 0) > 0 && (
//                                       <Button
//                                         className="!bg-amber-50 hover:!bg-amber-100 !text-amber-700 !border-amber-200 hover:!border-amber-300 !px-4 !py-2"
//                                         icon={<Download className="w-4 h-4" />}
//                                       >
//                                         تحميل الكل
//                                       </Button>
//                                     )}
//                                   </div>
//                                 </div>

//                                 {/* show list only when expanded */}
//                                 {expandedLessonId === lesson.id && (lesson.training?.pdfs?.length || 0) > 0 && (
//                                   <div className="space-y-3 pt-4 border-t border-amber-200/50">
//                                     {lesson.training.pdfs.map((pdf) => (
//                                       <div
//                                         key={pdf.id || pdf.name}
//                                         className="flex items-center justify-between bg-amber-50/50 rounded-xl p-4 border border-amber-100 hover:border-amber-200 transition-colors"
//                                       >
//                                         <div className="flex items-center gap-3">
//                                           <div className="bg-red-100 p-2 rounded-lg">
//                                             <FileText className="w-4 h-4 text-red-600" />
//                                           </div>
//                                           <div>
//                                             <h6 className="font-semibold text-gray-900">{pdf.title || pdf.name}</h6>
//                                             {pdf.size && <p className="text-sm text-gray-600">{pdf.size}</p>}
//                                           </div>
//                                         </div>

//                                         <Button
//                                           className="!bg-white hover:!bg-gray-50 !text-gray-700 !border-gray-200 hover:!border-gray-300"
//                                           icon={<Download className="w-4 h-4" />}
//                                         >
//                                           تحميل
//                                         </Button>
//                                       </div>
//                                     ))}
//                                   </div>
//                                 )}

//                                 {(lesson.training?.pdfs?.length || 0) === 0 && (
//                                   <div className="text-center py-8 text-gray-500">
//                                     <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
//                                     <p className="font-medium">لا توجد ملفات PDF متاحة</p>
//                                   </div>
//                                 )}
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </Panel>
//           ))}
//         </Collapse>
//       )}
//     </Card>
//   );
// }

import React, { useState } from "react";
import {
  Eye,
  EyeOff,
  Trash2,
  Edit3,
  CheckCircle2,
  AlertCircle,
  Clock,
  Award,
  Star,
  Layers,
  Video,
  PlayCircle,
  ExternalLink,
  FileImage,
  FileText,
  Target,
  Download,
  Play,
  BookOpen,
  ChevronDown,
  ChevronRight,
  Users,
  Calendar,
  TrendingUp,
  BarChart3,
  Zap,
  Plus,
} from "lucide-react";

// Enhanced Button component
const Button = ({
  children,
  className,
  onClick,
  icon,
  type,
  danger,
  ...props
}) => (
  <button
    className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl font-medium transition-all duration-300 ${
      danger
        ? "bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 hover:border-red-300 hover:shadow-md"
        : "bg-gray-50 hover:bg-gray-100 text-gray-600 border border-gray-200 hover:border-gray-300 hover:shadow-md"
    } ${className}`}
    onClick={onClick}
    {...props}
  >
    {icon}
    {children}
  </button>
);

// Enhanced Tag component
const Tag = ({ children, color, className }) => {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-700 border-blue-200",
    gold: "bg-amber-100 text-amber-700 border-amber-200",
    geekblue: "bg-indigo-100 text-indigo-700 border-indigo-200",
    green: "bg-green-100 text-green-700 border-green-200",
    orange: "bg-orange-100 text-orange-700 border-orange-200",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-sm font-semibold border ${
        colorClasses[color] || colorClasses.blue
      } ${className}`}
    >
      {children}
    </span>
  );
};

// Enhanced Tooltip component
const Tooltip = ({ title, children }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 text-xs font-medium text-white bg-gray-900 rounded-lg whitespace-nowrap z-50 animate-in fade-in-0 zoom-in-95 duration-200">
          {title}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      )}
    </div>
  );
};

// Enhanced Card component
const Card = ({ children, className, title, ...props }) => (
  <div
    className={`bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden ${className}`}
    {...props}
  >
    {title && (
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 px-8 py-6 border-b border-gray-100">
        <div className="flex items-center justify-between">{title}</div>
      </div>
    )}
    <div className="p-8">{children}</div>
  </div>
);

// Enhanced Empty component
const Empty = ({ description }) => (
  <div className="text-center py-16">
    <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mx-auto flex items-center justify-center mb-6 shadow-lg">
      <BookOpen className="w-12 h-12 text-gray-400" />
    </div>
    <h3 className="text-xl font-bold text-gray-700 mb-2">لا توجد بيانات</h3>
    <p className="text-gray-500 text-lg">{description}</p>
  </div>
);

// Enhanced Collapse Panel
const CollapsePanelComponent = ({
  stage,
  stageIndex,
  isExpanded,
  onToggle,
  toggleStageVisibility,
  deleteStage,
  onEditStage,
  toggleLessonVisibility,
  deleteLesson,
  onEditLesson,
  expandedLessonId,
  toggleLessonExpand,
}) => {
  // Calculate stage statistics
  const totalLessons = stage.lessons?.length || 0;
  const visibleLessons = stage.lessons?.filter((l) => l.visible)?.length || 0;
  const totalVideos =
    stage.lessons?.reduce((acc, lesson) => {
      let count = 0;
      if (lesson.lessonVideo?.title) count++;
      if (lesson.training?.video?.title) count++;
      return acc + count;
    }, 0) || 0;
  const totalPDFs =
    stage.lessons?.reduce(
      (acc, lesson) => acc + (lesson.training?.pdfs?.length || 0),
      0
    ) || 0;

  return (
    <div
      className={`mb-6 rounded-3xl overflow-hidden border-2 transition-all duration-500 hover:shadow-2xl ${
        isExpanded
          ? "border-blue-300 shadow-xl bg-gradient-to-br from-blue-50/50 to-indigo-50/30"
          : "border-gray-200 hover:border-blue-200 shadow-lg bg-white"
      }`}
    >
      {/* Enhanced Stage Header */}
      <div
        className={`relative p-6 lg:p-8 cursor-pointer transition-all duration-300 ${
          isExpanded
            ? "bg-gradient-to-r from-blue-50 to-indigo-50"
            : "hover:bg-gray-50"
        }`}
        onClick={onToggle}
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden opacity-5">
          <div className="absolute top-4 right-4 w-32 h-32 bg-blue-400 rounded-full animate-pulse"></div>
          <div className="absolute bottom-4 left-4 w-24 h-24 bg-indigo-400 rounded-full animate-bounce"></div>
        </div>

        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-4 lg:gap-6 flex-1">
            {/* Ultra-Modern Stage Number */}
            <div className="relative group">
              <div
                className={`w-20 h-20 lg:w-24 lg:h-24 rounded-3xl flex items-center justify-center font-black text-xl lg:text-2xl transition-all duration-500 group-hover:scale-110 ${
                  stage.visible
                    ? "bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 text-white shadow-2xl"
                    : "bg-gradient-to-br from-gray-300 to-gray-400 text-gray-600 shadow-lg"
                }`}
              >
                <span>{stageIndex + 1}</span>
              </div>

              {/* Enhanced Status Indicator */}
              <div
                className={`absolute -top-3 -right-3 w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
                  stage.visible
                    ? "bg-gradient-to-br from-green-400 to-green-600 animate-pulse"
                    : "bg-gradient-to-br from-gray-400 to-gray-500"
                }`}
              >
                {stage.visible ? (
                  <CheckCircle2 className="w-5 h-5 text-white" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-white" />
                )}
              </div>

              {/* Progress Ring */}
              <div className="absolute inset-0 rounded-3xl">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="transparent"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-blue-200"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="transparent"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeDasharray={`${
                      (visibleLessons / Math.max(totalLessons, 1)) * 283
                    } 283`}
                    strokeDashoffset="0"
                    className="text-green-500 transition-all duration-1000"
                    transform="rotate(-90 50 50)"
                  />
                </svg>
              </div>
            </div>

            <div className="flex-1 space-y-4">
              <div className="space-y-3">
                <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-4">
                  <h3
                    className={`font-black text-2xl ${
                      stage.visible ? "text-gray-900" : "text-gray-500"
                    }`}
                  >
                    المرحلة {stageIndex + 1}: {stage.title}
                  </h3>
                  {!stage.visible && (
                    <span className="inline-flex items-center gap-2 bg-gray-200 text-gray-600 px-4 py-2 rounded-full font-bold">
                      <EyeOff className="w-4 h-4" />
                      مخفية
                    </span>
                  )}
                </div>

                {/* Enhanced Statistics Grid */}
                {/* <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-600 p-2 rounded-xl">
                        <PlayCircle className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-blue-600 text-sm font-bold">
                          الدروس
                        </p>
                        <p className="text-2xl font-black text-blue-900">
                          {totalLessons}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 rounded-2xl p-4 border border-green-100">
                    <div className="flex items-center gap-3">
                      <div className="bg-green-600 p-2 rounded-xl">
                        <Eye className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-green-600 text-sm font-bold">
                          المرئية
                        </p>
                        <p className="text-2xl font-black text-green-900">
                          {visibleLessons}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-purple-50 rounded-2xl p-4 border border-purple-100">
                    <div className="flex items-center gap-3">
                      <div className="bg-purple-600 p-2 rounded-xl">
                        <Video className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-purple-600 text-sm font-bold">
                          الفيديوهات
                        </p>
                        <p className="text-2xl font-black text-purple-900">
                          {totalVideos}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-orange-50 rounded-2xl p-4 border border-orange-100">
                    <div className="flex items-center gap-3">
                      <div className="bg-orange-600 p-2 rounded-xl">
                        <FileText className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-orange-600 text-sm font-bold">
                          الملفات
                        </p>
                        <p className="text-2xl font-black text-orange-900">
                          {totalPDFs}
                        </p>
                      </div>
                    </div>
                  </div>
                </div> */}
              </div>
            </div>
          </div>

          {/* Enhanced Action Buttons */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-2">
              {onEditStage && (
                <Tooltip title="تعديل المرحلة">
                  <Button
                    className="!w-14 !h-14 !bg-blue-50 flex justify-center hover:!bg-blue-100 !text-blue-600 !border-blue-200 hover:!border-blue-300 !rounded-2xl"
                    icon={<Edit3 className="w-5 h-5" />}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditStage(stage.id);
                    }}
                  />
                </Tooltip>
              )}

              <Tooltip
                title={stage.visible ? "إخفاء المرحلة" : "إظهار المرحلة"}
              >
                <Button
                  className={`!w-14 !h-14 !rounded-2xl !transition-all !duration-300 ${
                    stage.visible
                      ? "!bg-orange-50 hover:!bg-orange-100 !text-orange-600 !border-orange-200 hover:!border-orange-300"
                      : "!bg-green-50 hover:!bg-green-100 !text-green-600 !border-green-200 hover:!border-green-300"
                  }`}
                  icon={
                    stage.visible ? (
                      <Eye className="w-5 h-5" />
                    ) : (
                      <EyeOff className="w-5 h-5" />
                    )
                  }
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleStageVisibility(stage.id);
                  }}
                />
              </Tooltip>

              <Tooltip title="حذف المرحلة">
                <Button
                  danger
                  className="!w-14 !h-14 !rounded-2xl"
                  icon={<Trash2 className="w-5 h-5" />}
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteStage(stage.id);
                  }}
                />
              </Tooltip>
            </div>

            {/* Enhanced Expand Button */}
            <div
              className={`w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center transition-all duration-500 shadow-lg hover:shadow-xl ${
                isExpanded
                  ? "from-blue-500 to-indigo-600 text-white rotate-180"
                  : "from-gray-100 to-gray-200 text-gray-600 hover:from-blue-100 hover:to-indigo-100 hover:text-blue-600"
              }`}
            >
              <ChevronDown className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Expandable Content */}
      <div
        className={`transition-all duration-500 ease-in-out ${
          isExpanded
            ? "max-h-[5000px] opacity-100"
            : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <div className="border-t-2 border-blue-100">
          {(stage.lessons || []).length === 0 ? (
            <div className="p-8">
              <Empty description="لا توجد دروس في هذه المرحلة" />
            </div>
          ) : (
            <div className="p-6 lg:p-8 space-y-8">
              {stage.lessons.map((lesson, index) => (
                <div
                  key={lesson.id}
                  className={`group relative overflow-hidden rounded-3xl border-2 transition-all duration-500 hover:scale-[1.01] ${
                    lesson.visible
                      ? "bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/20 border-blue-200/60 hover:border-blue-300 shadow-lg hover:shadow-2xl"
                      : "bg-gradient-to-br from-gray-50 via-gray-100/50 to-gray-200/30 border-gray-200 opacity-80 hover:opacity-90"
                  }`}
                >
                  {/* Animated Background Pattern */}
                  <div className="absolute inset-0 opacity-5 pointer-events-none">
                    <div className="absolute top-4 right-4 w-24 h-24 bg-blue-400 rounded-full animate-pulse" />
                    <div className="absolute bottom-4 left-4 w-16 h-16 bg-indigo-400 rounded-full animate-bounce" />
                  </div>

                  <div className="relative p-6 lg:p-8">
                    {/* Enhanced Lesson Header */}
                    <div className="flex items-start justify-between gap-6 mb-6">
                      <div className="flex items-start gap-4 lg:gap-6 flex-1">
                        {/* Ultra-Modern Lesson Number */}
                        <div className="relative group">
                          <div
                            className={`w-16 h-16 lg:w-20 lg:h-20 rounded-3xl flex items-center justify-center font-black text-lg lg:text-xl transition-all duration-500 group-hover:scale-110 ${
                              lesson.visible
                                ? "bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 text-white shadow-2xl"
                                : "bg-gradient-to-br from-gray-400 to-gray-500 text-gray-200 shadow-lg"
                            }`}
                          >
                            <span>{index + 1}</span>
                          </div>

                          <div
                            className={`absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
                              lesson.visible
                                ? "bg-gradient-to-br from-green-400 to-green-600 animate-pulse"
                                : "bg-gradient-to-br from-gray-400 to-gray-500"
                            }`}
                          >
                            {lesson.visible ? (
                              <CheckCircle2 className="w-4 h-4 text-white" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-white" />
                            )}
                          </div>
                        </div>

                        {/* Enhanced Lesson Info */}
                        <div className="flex-1 space-y-4">
                          <div className="space-y-3">
                            <div className="flex flex-col lg:flex-row lg:items-start gap-3">
                              <h4
                                className={`font-black text-xl lg:text-2xl leading-tight ${
                                  lesson.visible
                                    ? "text-gray-900"
                                    : "text-gray-500"
                                }`}
                              >
                                القسم {index + 1}: {lesson.title}
                              </h4>

                              {!lesson.visible && (
                                <span className="inline-flex items-center gap-2 bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-sm font-bold">
                                  <EyeOff className="w-4 h-4" />
                                  مخفي
                                </span>
                              )}
                            </div>

                            {/* Enhanced Metadata Tags */}
                            {/* <div className="flex flex-wrap items-center gap-3 lg:gap-4">
                              {!!lesson.duration && (
                                <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-xl border border-blue-100 hover:bg-blue-100 transition-colors">
                                  <Clock className="w-4 h-4 text-blue-600" />
                                  <span className="text-blue-700 font-bold text-sm">
                                    {lesson.duration}
                                  </span>
                                </div>
                              )}

                              {!!lesson.difficulty && (
                                <div
                                  className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-colors ${
                                    lesson.difficulty === "مبتدئ"
                                      ? "bg-green-50 border-green-100 text-green-700 hover:bg-green-100"
                                      : lesson.difficulty === "متوسط"
                                      ? "bg-yellow-50 border-yellow-100 text-yellow-700 hover:bg-yellow-100"
                                      : "bg-red-50 border-red-100 text-red-700 hover:bg-red-100"
                                  }`}
                                >
                                  <Award className="w-4 h-4" />
                                  <span className="font-bold text-sm">
                                    {lesson.difficulty}
                                  </span>
                                </div>
                              )}

                              {typeof lesson.completionRate === "number" && (
                                <div className="flex items-center gap-2 bg-purple-50 px-4 py-2 rounded-xl border border-purple-100 hover:bg-purple-100 transition-colors">
                                  <Star className="w-4 h-4 text-purple-600" />
                                  <span className="text-purple-700 font-bold text-sm">
                                    {lesson.completionRate}% إكمال
                                  </span>
                                </div>
                              )}

                              <button
                                onClick={() => toggleLessonExpand(lesson.id)}
                                className="flex items-center gap-2 bg-gradient-to-r from-indigo-50 to-blue-50 hover:from-indigo-100 hover:to-blue-100 px-4 py-2 rounded-xl border border-indigo-100 text-indigo-700 font-bold text-sm transition-all duration-300 hover:shadow-md"
                              >
                                <Layers className="w-4 h-4" />
                                {expandedLessonId === lesson.id
                                  ? "إخفاء التفاصيل"
                                  : "عرض التفاصيل"}
                              </button>
                            </div> */}
                          </div>
                        </div>
                      </div>

                      {/* Enhanced Action Buttons */}
                      <div className="flex items-start gap-2">
                        {onEditLesson && (
                          <Tooltip title="تعديل الدرس">
                            <Button
                              className="!w-12 !h-12 !bg-blue-50 hover:!bg-blue-100 !text-blue-600 !border-blue-200 hover:!border-blue-300 !rounded-xl"
                              icon={<Edit3 className="w-5 h-5" />}
                              onClick={() => onEditLesson(stage.id, lesson.id)}
                            />
                          </Tooltip>
                        )}

                        <Tooltip
                          title={lesson.visible ? "إخفاء الدرس" : "إظهار الدرس"}
                        >
                          <Button
                            className={`!w-12 !h-12 !rounded-xl transition-all ${
                              lesson.visible
                                ? "!bg-orange-50 hover:!bg-orange-100 !text-orange-600 !border-orange-200 hover:!border-orange-300"
                                : "!bg-green-50 hover:!bg-green-100 !text-green-600 !border-green-200 hover:!border-green-300"
                            }`}
                            icon={
                              lesson.visible ? (
                                <Eye className="w-5 h-5" />
                              ) : (
                                <EyeOff className="w-5 h-5" />
                              )
                            }
                            onClick={() =>
                              toggleLessonVisibility(stage.id, lesson.id)
                            }
                          />
                        </Tooltip>

                        <Tooltip title="حذف الدرس">
                          <Button
                            danger
                            className="!w-12 !h-12 !rounded-xl"
                            icon={<Trash2 className="w-5 h-5" />}
                            onClick={() => deleteLesson(stage.id, lesson.id)}
                          />
                        </Tooltip>
                      </div>
                    </div>

                    {/* Enhanced Content Sections */}
                    <div className="space-y-6">
                      {/* Main Video Section */}
                      <div className="bg-gradient-to-r from-blue-50 via-cyan-50 to-blue-50 rounded-2xl lg:rounded-3xl p-6 lg:p-8 border-2 border-blue-100 hover:border-blue-200 transition-all duration-300 group/video">
                        <div className="flex items-start justify-between gap-4 mb-6">
                          <div className="flex items-center gap-4">
                            <div className="bg-blue-600 p-3 rounded-2xl shadow-lg group-hover/video:scale-110 transition-transform duration-300">
                              <Video className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h5 className="font-black text-xl text-gray-900 mb-1">
                                الفيديو الأساسي
                              </h5>
                              <p className="text-blue-600 font-semibold">
                                {lesson.lessonVideo?.duration ||
                                  "مدة غير محددة"}
                              </p>
                            </div>
                          </div>

                          <Tag
                            color="blue"
                            className="!bg-blue-600 !text-white !border-blue-700 !px-4 !py-2 !rounded-xl !font-bold"
                          >
                            <PlayCircle className="w-4 h-4" />
                            فيديو أساسي
                          </Tag>
                        </div>

                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-blue-200/50 shadow-lg">
                          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                            <div className="space-y-2">
                              <h6 className="font-bold text-lg text-gray-900">
                                {lesson.lessonVideo?.title ||
                                  "لم يتم تحديد العنوان"}
                              </h6>
                              <div className="flex items-center gap-3 text-sm text-gray-600">
                                {lesson.lessonVideo?.source === "url" ? (
                                  <span className="flex items-center gap-2">
                                    <ExternalLink className="w-4 h-4 text-blue-500" />
                                    رابط خارجي
                                  </span>
                                ) : (
                                  <span className="flex items-center gap-2">
                                    <FileImage className="w-4 h-4 text-green-500" />
                                    ملف مرفوع
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              {lesson.lessonVideo?.source === "url" &&
                              lesson.lessonVideo?.url ? (
                                <a
                                  href={lesson.lessonVideo.url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-2xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                                >
                                  <PlayCircle className="w-5 h-5" />
                                  مشاهدة الآن
                                </a>
                              ) : (
                                <span className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg">
                                  <CheckCircle2 className="w-5 h-5" />
                                  جاهز للعرض
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Training Section */}
                      <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 rounded-2xl lg:rounded-3xl p-6 lg:p-8 border-2 border-amber-200 hover:border-amber-300 transition-all duration-300 group/training">
                        <div className="flex items-start justify-between gap-4 mb-6">
                          <div className="flex items-center gap-4">
                            <div className="bg-amber-600 p-3 rounded-2xl shadow-lg group-hover/training:scale-110 transition-transform duration-300">
                              <Target className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h5 className="font-black text-xl text-gray-900 mb-1">
                                مواد التدريب
                              </h5>
                              <p className="text-amber-600 font-semibold">
                                تطبيقات عملية ومواد مساعدة
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-6">
                          {/* Training Video */}
                          {lesson.training?.video && (
                            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-amber-200/50 shadow-lg">
                              <div className="flex items-center justify-between gap-4 mb-4">
                                <div className="flex items-center gap-3">
                                  <div className="bg-amber-500 p-2 rounded-xl">
                                    <Play className="w-4 h-4 text-white" />
                                  </div>
                                  <div>
                                    <h6 className="font-bold text-gray-900">
                                      فيديو التدريب
                                    </h6>
                                    <p className="text-sm text-amber-600">
                                      {lesson.training.video.title}
                                    </p>
                                  </div>
                                </div>
                                <Tag
                                  color="orange"
                                  className="!px-3 !py-2 !rounded-xl"
                                >
                                  تدريب عملي
                                </Tag>
                              </div>
                              <div className="flex items-center gap-3">
                                <button className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-4 py-2 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg">
                                  <Play className="w-4 h-4" />
                                  تشغيل الفيديو
                                </button>
                                <button className="flex items-center gap-2 bg-amber-100 hover:bg-amber-200 text-amber-700 px-4 py-2 rounded-xl font-semibold transition-all duration-300 border border-amber-200">
                                  <Download className="w-4 h-4" />
                                  تحميل
                                </button>
                              </div>
                            </div>
                          )}

                          {/* PDF Files */}
                          {/* {lesson.training?.pdfs &&
                            lesson.training.pdfs.length > 0 && (
                              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-amber-200/50 shadow-lg">
                                <div className="flex items-center justify-between gap-4 mb-4">
                                  <div className="flex items-center gap-3">
                                    <div className="bg-red-500 p-2 rounded-xl">
                                      <FileText className="w-4 h-4 text-white" />
                                    </div>
                                    <div>
                                      <h6 className="font-bold text-gray-900">
                                        الملفات التعليمية
                                      </h6>
                                      <p className="text-sm text-red-600">
                                        {lesson.training.pdfs.length} ملف PDF
                                      </p>
                                    </div>
                                  </div>
                                  <Tag
                                    color="geekblue"
                                    className="!px-3 !py-2 !rounded-xl"
                                  >
                                    موارد دراسية
                                  </Tag>
                                </div>
                                <div className="space-y-3">
                                  {lesson.training.pdfs.map((pdf, pdfIndex) => (
                                    <div
                                      key={pdfIndex}
                                      className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors"
                                    >
                                      <div className="flex items-center gap-3">
                                        <FileText className="w-5 h-5 text-red-500" />
                                        <span className="font-medium text-gray-700">
                                          {pdf.name}
                                        </span>
                                      </div>
                                      <button className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1 rounded-lg font-semibold transition-all duration-300 border border-red-200">
                                        <Download className="w-4 h-4" />
                                        تحميل
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )} */}

                          {!lesson.training?.video &&
                            (!lesson.training?.pdfs ||
                              lesson.training.pdfs.length === 0) && (
                              <div className="text-center py-8 bg-gradient-to-r from-amber-100 to-orange-100 rounded-2xl border-2 border-dashed border-amber-300">
                                <div className="w-16 h-16 bg-amber-200 rounded-full mx-auto flex items-center justify-center mb-4">
                                  <Target className="w-8 h-8 text-amber-600" />
                                </div>
                                <h6 className="font-bold text-amber-800 mb-2">
                                  لا توجد مواد تدريبية
                                </h6>
                                <p className="text-amber-600 text-sm">
                                  أضف فيديوهات أو ملفات تدريبية لهذا الدرس
                                </p>
                              </div>
                            )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Main Component
export default function EnhancedLecturesContent() {
  const [stages, setStages] = useState([
    {
      id: 1,
      title: "الأساسيات والمقدمة",
      visible: true,
      lessons: [
        {
          id: 1,
          title: "مقدمة في البرمجة",
          visible: true,
          duration: "45 دقيقة",
          difficulty: "مبتدئ",
          completionRate: 85,
          lessonVideo: {
            title: "أساسيات البرمجة - الدرس الأول",
            source: "url",
            url: "https://example.com/video1",
            duration: "30 دقيقة",
          },
          training: {
            video: {
              title: "تمارين عملية - الدرس الأول",
              source: "file",
              duration: "15 دقيقة",
            },
            pdfs: [
              { name: "ملخص الدرس الأول.pdf", size: "2.5 MB" },
              { name: "تمارين إضافية.pdf", size: "1.8 MB" },
            ],
          },
        },
        {
          id: 2,
          title: "المتغيرات وأنواع البيانات",
          visible: true,
          duration: "60 دقيقة",
          difficulty: "مبتدئ",
          completionRate: 72,
          lessonVideo: {
            title: "المتغيرات في البرمجة",
            source: "file",
            duration: "40 دقيقة",
          },
          training: {
            video: null,
            pdfs: [{ name: "دليل المتغيرات.pdf", size: "3.1 MB" }],
          },
        },
      ],
    },
    {
      id: 2,
      title: "المستوى المتقدم",
      visible: false,
      lessons: [],
    },
  ]);

  const [expandedStages, setExpandedStages] = useState(new Set());
  const [expandedLessonId, setExpandedLessonId] = useState(null);

  const toggleStageExpand = (stageId) => {
    const newExpandedStages = new Set(expandedStages);
    if (newExpandedStages.has(stageId)) {
      newExpandedStages.delete(stageId);
    } else {
      newExpandedStages.add(stageId);
    }
    setExpandedStages(newExpandedStages);
  };

  const toggleLessonExpand = (lessonId) => {
    setExpandedLessonId(expandedLessonId === lessonId ? null : lessonId);
  };

  const toggleStageVisibility = (stageId) => {
    setStages(
      stages.map((stage) =>
        stage.id === stageId ? { ...stage, visible: !stage.visible } : stage
      )
    );
  };

  const toggleLessonVisibility = (stageId, lessonId) => {
    setStages(
      stages.map((stage) =>
        stage.id === stageId
          ? {
              ...stage,
              lessons: stage.lessons.map((lesson) =>
                lesson.id === lessonId
                  ? { ...lesson, visible: !lesson.visible }
                  : lesson
              ),
            }
          : stage
      )
    );
  };

  const deleteStage = (stageId) => {
    setStages(stages.filter((stage) => stage.id !== stageId));
  };

  const deleteLesson = (stageId, lessonId) => {
    setStages(
      stages.map((stage) =>
        stage.id === stageId
          ? {
              ...stage,
              lessons: stage.lessons.filter((lesson) => lesson.id !== lessonId),
            }
          : stage
      )
    );
  };

  const onEditStage = (stageId) => {
    console.log("Edit stage:", stageId);
    // Implement edit functionality
  };

  const onEditLesson = (stageId, lessonId) => {
    console.log("Edit lesson:", stageId, lessonId);
    // Implement edit functionality
  };

  // Calculate overall statistics
  const totalStages = stages.length;
  const visibleStages = stages.filter((stage) => stage.visible).length;
  const totalLessons = stages.reduce(
    (acc, stage) => acc + (stage.lessons?.length || 0),
    0
  );
  const visibleLessons = stages.reduce(
    (acc, stage) =>
      acc + (stage.lessons?.filter((l) => l.visible)?.length || 0),
    0
  );
  const totalVideos = stages.reduce(
    (acc, stage) =>
      acc +
      (stage.lessons?.reduce((lessonAcc, lesson) => {
        let count = 0;
        if (lesson.lessonVideo?.title) count++;
        if (lesson.training?.video?.title) count++;
        return lessonAcc + count;
      }, 0) || 0),
    0
  );
  const totalPDFs = stages.reduce(
    (acc, stage) =>
      acc +
      (stage.lessons?.reduce(
        (lessonAcc, lesson) => lessonAcc + (lesson.training?.pdfs?.length || 0),
        0
      ) || 0),
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 p-4 lg:p-8">
      {/* Ultra-Modern Header */}
      <div className=" rounded-3xl lg:rounded-[2rem] shadow-2xl relative overflow-hidden mb-8">
        

        <div className="relative p-8 lg:p-12">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 mb-8">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="bg-white/20 backdrop-blur-xl p-6 rounded-3xl shadow-2xl border border-white/30">
                  <BookOpen className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-400 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-4xl lg:text-6xl font-black text-white mb-4 tracking-tight">
                  إدارة المحاضرات
                </h1>
                <p className="text-blue-100 text-xl lg:text-2xl font-medium">
                  أنشئ وأدر المحتوى التعليمي بطريقة احترافية
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Button
                className="!bg-white/20 !text-white !border !border-white/30 hover:!bg-white/30 backdrop-blur-xl rounded-2xl px-8 py-4 font-bold text-lg shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105"
                icon={<Plus className="w-6 h-6" />}
              >
                مرحلة جديدة
              </Button>
              <Button
                className="!bg-white !text-blue-700 !border-2 !border-white hover:!bg-blue-50 rounded-2xl px-8 py-4 font-bold text-lg shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105"
                icon={<Plus className="w-6 h-6" />}
              >
                قسم جديد
              </Button>
            </div>
          </div>

        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {stages.length === 0 ? (
          <Card className="text-center py-16">
            <Empty description="لا توجد مراحل تعليمية، ابدأ بإنشاء المرحلة الأولى" />
          </Card>
        ) : (
          stages.map((stage, index) => (
            <CollapsePanelComponent
              key={stage.id}
              stage={stage}
              stageIndex={index}
              isExpanded={expandedStages.has(stage.id)}
              onToggle={() => toggleStageExpand(stage.id)}
              toggleStageVisibility={toggleStageVisibility}
              deleteStage={deleteStage}
              onEditStage={onEditStage}
              toggleLessonVisibility={toggleLessonVisibility}
              deleteLesson={deleteLesson}
              onEditLesson={onEditLesson}
              expandedLessonId={expandedLessonId}
              toggleLessonExpand={toggleLessonExpand}
            />
          ))
        )}
      </div>
    </div>
  );
}
