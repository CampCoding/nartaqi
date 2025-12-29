// "use client";
// import React, { useCallback, useEffect, useState } from "react";
// import {
//   PlusOutlined,
//   EditOutlined,
//   DeleteOutlined,
//   CalendarOutlined,
//   CaretDownOutlined,
//   FileTextOutlined,
//   PlayCircleOutlined,
//   PaperClipOutlined,
//   FileOutlined,
// } from "@ant-design/icons";
// import { useDispatch, useSelector } from "react-redux";
// import { handleGetAllRoundContent } from "../../lib/features/roundContentSlice";
// import { useRouter } from "next/navigation";
// import { Spin, DatePicker, Tag, Tooltip } from "antd";
// import dayjs from "dayjs";
// import AddRoundContent from "../RoundContent/AddRoundContent";
// import DeleteRoundContent from "../RoundContent/DeleteRoundContent";
// import EditRoundContent from "../RoundContent/EditRoundContent";
// import AddLessonModal from "../RoundContent/Lessons/AddLessonModal";
// import { handleGetAllRoundLessons } from "../../lib/features/lessonSlice";
// import DeleteLessonModal from "../RoundContent/Lessons/DeleteLessonModal";
// import EditLessonModal from "../RoundContent/Lessons/EditLessonModal";
// import AddVideoModal from "../RoundContent/Videos/AddVideoModal";
// import { handleGetAllLessonVideo } from "../../lib/features/videoSlice";
// import EditVideoModal from "../RoundContent/Videos/EditVideoModal";
// import DeleteVideoModal from "../RoundContent/Videos/DeleteVideoModal";
// import AddLivesModal from "../RoundContent/Lives/AddLivesModal";
// import EditLivesModal from "../RoundContent/Lives/EditLivesModal";
// import DeleteLivesModal from "../RoundContent/Lives/DeleteLivesModal";
// import { BadgeAlert, Clock, Eye, EyeOff, FileIcon, VideoIcon } from "lucide-react";
// import { handleActiveLive, handleMarkLiveAsFinish } from "../../lib/features/livesSlice";
// import { toast } from "react-toastify";
// import AddExamVideoModal from "../RoundContent/Exams/AddExamVideoModal";
// import EditExamVideoModal from "../RoundContent/Exams/EditExamVideoModal";
// import DeleteExamVideoModal from "../RoundContent/Exams/DeleteExamVideoModal";
// import AddExamPdfModal from "../RoundContent/Exams/AddExamPdfModal";
// import DeleteExamPdfModal from "../RoundContent/Exams/DeleteExamPdfModal";
// import EditExamPdfModal from "../RoundContent/Exams/EditExamPdfModal";
// import ActiveLiveModal from "../RoundContent/Lives/ActiveLiveModal";
// import FinishLiveModal from "../RoundContent/Lives/FinishLiveModal";
// import DeleteExamModal from "../Exams/DeleteExamModal";

// const initialSchedule = {
//   startDate: "2025-12-01",
//   endDate: "2025-12-31",
//   startTime: "09:00",
//   endTime: "11:00",
// };

//   const textWrapClass = "break-words whitespace-normal overflow-hidden max-w-full [&_*]:break-words [&_*]:whitespace-normal [&_*]:max-w-[80%] px-4";


// export default function CourseSourceBasicLevel({ id  , isSource}) {
//   const [rowData, setRowData] = useState({});
//   const [contentSchedule, setContentSchedule] = useState({});
//   const [lessonSchedule, setLessonSchedule] = useState({});

//   // Modal states...
//   const [deleteExamModal, setDeleteExamModal] = useState(false);
//   const [addModalContent, setAddModalContent] = useState(false);
//   const [deleteModalContent, setDeleteModalContent] = useState(false);
//   const [editModalContent, setEditModalContent] = useState(false);
//   const [openAddLesson, setOpenAddLesson] = useState(false);
//   const [openEditLesson, setOpenEditLesson] = useState(false);
//   const [openDeleteLesson, setOpenDeleteLesson] = useState(false);
//   const [selectedLesson, setSelectedLesson] = useState({});
//   const [openAddVideo, setOpenAddVideo] = useState(false);
//   const [openEditVideo, setOpenEditVideo] = useState(false);
//   const [openDeleteVideo, setOpenDeleteVideo] = useState(false);
//   const [selectedVideo, setSelectedVideo] = useState({});
//   const [activeLiveModal, setActiveLiveModal] = useState(false);
//   const [markFinishModal, setMarkFinishModal] = useState(false);

//   // Live modal states
//   const [openAddLive, setOpenAddLive] = useState(false);
//   const [openEditLive, setOpenEditLive] = useState(false);
//   const [openDeleteLive, setOpenDeleteLive] = useState(false);
//   const [selectedLive, setSelectedLive] = useState({});

//   // Exam modal states
//   const [openAddExamVideo, setOpenAddExamVideo] = useState(false);
//   const [openAddExamPdf, setOpenAddExamPdf] = useState(false);
//   const [openEditExamVideo, setOpenEditExamVideo] = useState(false);
//   const [openEditExamPdf, setOpenEditExamPdf] = useState(false);
//   const [openDeleteExamVideo, setOpenDeleteExamVideo] = useState(false);
//   const [openDeleteExamPdf, setOpenDeleteExamPdf] = useState(false);
//   const [selectedExam, setSelectedExam] = useState({});
//   const [selectedExamVideo, setSelectedExamVideo] = useState({});
//   const [selectedExamPdf, setSelectedExamPdf] = useState({});

//   const router = useRouter();
//   const dispatch = useDispatch();

//   const { all_content_list } = useSelector((state) => state?.content);
//   const { all_lessons_list } = useSelector((state) => state?.lesson);
//   const { all_videos_list } = useSelector((state) => state?.videos);
//   const { all_lives_list } = useSelector((state) => state?.lives);

//   const [expandedContents, setExpandedContents] = useState({});
//   const [expandedLessons, setExpandedLessons] = useState({});
//   const [expandedExams, setExpandedExams] = useState({});
//   const [expandedVideos, setExpandedVideos] = useState({});
//   const [expandedLives, setExpandedLives] = useState({});
//   const [loadingContents, setLoadingContents] = useState({});
//   const [loadingLessons, setLoadingLessons] = useState({});

//   const [basicData, setBasicData] = useState([]);

//   const isReleased = useCallback((releaseAt) => {
//     if (!releaseAt) return true;
//     return dayjs(releaseAt).isBefore(dayjs());
//   }, []);

//   useEffect(() => {
//     dispatch(
//       handleGetAllRoundContent({
//         body: {
//           round_id: id,
//         },
//       })
//     );
//   }, [id, dispatch]);

//   useEffect(() => {
//     setBasicData(
//       all_content_list?.data?.message?.contents.filter(
//         (item) => item?.content_type === "basic"
//       ) || []
//     );
//   }, [all_content_list]);

//   const [selectedContent, setSelectedContent] = useState(null);

//   const toggleContentCollapse = async (contentId) => {
//     setSelectedContent(contentId);
//     const isCurrentlyExpanded = expandedContents[contentId];
//     setExpandedContents((prev) => ({
//       ...prev,
//       [contentId]: !isCurrentlyExpanded,
//     }));
//   };

//   const toggleLessonCollapse = async (lesson, lessonId) => {
//     const isCurrentlyExpanded = expandedLessons[lessonId];
//     console.log("collapse lesson", lesson);
//     setSelectedExam(lesson);
//     setExpandedLessons((prev) => ({
//       ...prev,
//       [lessonId]: !isCurrentlyExpanded,
//     }));
//   };

//   const toggleExamCollapse = async (examId) => {
//     setSelectedExam(examId);
//     const isCurrentlyExpanded = expandedExams[examId];
//     setExpandedExams((prev) => ({
//       ...prev,
//       [examId]: !isCurrentlyExpanded,
//     }));
//   };

//   const toggleVideosCollapse = async (lessonId) => {
//     const isCurrentlyExpanded = expandedVideos[lessonId];
//     setExpandedVideos((prev) => ({
//       ...prev,
//       [lessonId]: !isCurrentlyExpanded,
//     }));
//   };

//   const toggleLivesCollapse = async (lessonId) => {
//     const isCurrentlyExpanded = expandedLives[lessonId];
//     setExpandedLives((prev) => ({
//       ...prev,
//       [lessonId]: !isCurrentlyExpanded,
//     }));
//   };

//   useEffect(() => {
//     if (selectedContent) {
//       dispatch(handleGetAllRoundLessons({
//         body: {
//           round_content_id: selectedContent
//         }
//       }));
//     }
//   }, [selectedContent]);

//   const ActionButton = ({ disabled, icon, title, onClick, className = "", children }) => (
//     <button
//       disabled={disabled}
//       title={title || ""}
//       onClick={onClick}
//       className={`p-1 text-sm rounded-full transition duration-150  ${className}`}
//     >
//       {icon}
//       {children}
//     </button>
//   );

//   // Video Card Renderer
//   const VideoCard = ({ video, isExamVideo = false }) => {
//     const isFree = video?.free === "1";

//     return (
//       <div className="bg-blue-50/70 p-4 mb-3 rounded-lg border border-blue-100 flex justify-between items-start">
//         <div className="flex items-start flex-1 min-w-0">
//           <PlayCircleOutlined className="text-blue-600 text-lg mt-1 ml-3 flex-shrink-0" />
//           <div className="min-w-0 flex-1">
//             <div className="flex items-center gap-2">
//               <p className="font-medium text-gray-800 truncate">
//                 {video?.title}
//               </p>
//               {isFree && (
//                 <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
//                   مجاني
//                 </span>
//               )}
//               {isExamVideo && (
//                 <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
//                   فيديو اختبار
//                 </span>
//               )}
//             </div>
//             <p className="text-gray-600 text-sm mt-1">{video?.description}</p>
//             {video?.youtube_link && <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
//               <span>لينك (Youtube)</span>
//               {video?.youtube_link && (
//                 <a
//                   href={video?.youtube_link}
//                   target="_blank"
//                   rel="noreferrer"
//                   className="truncate max-w-xs text-blue-600 hover:text-blue-700"
//                 >
//                   {video?.youtube_link}
//                 </a>
//               )}
//             </div>}

//             {video?.vimeo_link && <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
//               <span>لينك (Vimeo)</span>
//               {video?.vimeo_link && (
//                 <a
//                   href={video?.vimeo_link}
//                   target="_blank"
//                   rel="noreferrer"
//                   className="truncate max-w-xs text-blue-600 hover:text-blue-700"
//                 >
//                   {video?.vimeo_link}
//                 </a>
//               )}
//             </div>}
//           </div>
//         </div>
//         <div className="flex space-x-2 space-x-reverse ml-4 flex-shrink-0">
//           <ActionButton
//             className="bg-blue-500 text-white p-2 rounded-md"
//             // title="تعديل الفيديو"
//             // icon={<EditOutlined className="text-blue-600" />}
//             onClick={(e) => {
//               e.stopPropagation();
//               if (isExamVideo) {
//                 setSelectedExamVideo(video);
//                 setOpenEditExamVideo(true);
//               } else {
//                 setSelectedVideo(video);
//                 setOpenEditVideo(true);
//               }
//             }}
//           >
//             تعديل الفيديو
//           </ActionButton>
//           <ActionButton
//             // title="حذف الفيديو"
//             className="bg-red-500 text-white p-2 rounded-md"
//             // icon={<DeleteOutlined className="text-red-600" />}
//             onClick={(e) => {
//               e.stopPropagation();
//               if (isExamVideo) {
//                 setSelectedExamVideo(video);
//                 setOpenDeleteExamVideo(true);
//               } else {
//                 setSelectedVideo(video);
//                 setOpenDeleteVideo(true);
//               }
//             }}
//           >
//             حذف الفيديو
//           </ActionButton>
//         </div>
//       </div>
//     );
//   };

//   // PDF Card Renderer
//   const PdfCard = ({ pdf }) => {
//     return (
//       <div className="bg-gray-50/70 p-4 mb-3 rounded-lg border border-gray-100 flex justify-between items-start">
//         <div className="flex items-start flex-1 min-w-0">
//           <PaperClipOutlined className="text-gray-600 text-lg mt-1 ml-3 flex-shrink-0" />
//           <div className="min-w-0 flex-1">
//             <div className="flex items-center gap-2">
//               <p className="font-medium text-gray-800 truncate">
//                 {pdf?.title}
//               </p>
//               <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
//                 ملف PDF
//               </span>
//             </div>
//             <p className="text-gray-600 text-sm mt-1">{pdf?.description}</p>
//             <div className="mt-2 text-xs text-gray-500">
//               {pdf?.pdf_url && (
//                 <a
//                   href={pdf?.pdf_url}
//                   target="_blank"
//                   rel="noreferrer"
//                   className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
//                 >
//                   <FileIcon className="w-3 h-3" />
//                   عرض الملف
//                 </a>
//               )}
//             </div>
//           </div>
//         </div>
//         <div className="flex space-x-2 space-x-reverse ml-4 flex-shrink-0">
//           <ActionButton
//             className="bg-blue-500 text-white p-2 rounded-md"
//             // title="تعديل الملف"
//             // icon={<EditOutlined className="text-blue-600" />}
//             onClick={(e) => {
//               e.stopPropagation();
//               setSelectedExamPdf(pdf);
//               setOpenEditExamPdf(true);
//             }}
//           >
//             تعديل الملف
//           </ActionButton>
//           <ActionButton
//             className="bg-red-500 text-white p-2 rounded-md"
//             // title="حذف الملف"
//             // icon={<DeleteOutlined className="text-red-600" />}
//             onClick={(e) => {
//               e.stopPropagation();
//               setSelectedExamPdf(pdf);
//               setOpenDeleteExamPdf(true);
//             }}
//           >
//             حذف الملف
//           </ActionButton>
//         </div>
//       </div>
//     );
//   };

//   // Exam Card Renderer
//   const ExamCard = ({ exam, lessonId, lesson, lessonExams }) => {
//     const [exams, setExams] = useState({});
//     const [videos, setVideos] = useState([]);
//     const [pdfs, setPdfs] = useState([]);

//     useEffect(() => {
//       if (lessonExams && lessonExams?.length > 0) {
//         setExams(lessonExams[0]?.exam);
//         setVideos(lessonExams[0]?.videos);
//         setPdfs(lessonExams[0]?.exam_pdfs)
//       }
//     }, [lessonExams])


//     useEffect(() => {
//       console.log(exams, lessonExams)
//     }, [exams, lessonExams])

//     useEffect(() => {
//       setSelectedLesson(lesson);
//     }, [lesson])

//     return (
//       <div className="bg-orange-50/70 p-4 mb-3 rounded-lg border border-orange-100">
//         {(
//           <div className="mt-4 border-t pt-4">

//             {/* Exam Sections */}
//             <div className="mb-6">
//               <div className="flex justify-between items-center mb-3">
//                 <h5 className="text-md font-semibold text-gray-700 flex items-center">
//                   <FileOutlined className="ml-2 text-blue-500 w-4 h-4" />
//                   الاختبارات
//                 </h5>
//                 {(lessonExams?.length == 0 || !exams) && <button
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     setSelectedExam(exams?.id);
//                     router.push(`/questions/new?lessonId=${lessonId}`)
//                   }}
//                   className="flex items-center text-sm bg-green-700 text-white rounded-md p-2"
//                 >
//                   <PlusOutlined className="ml-1" />
//                   إضافة اختبار
//                 </button>}
//               </div>

//               {lessonExams?.length > 0 && exams ? (
//                 <div className="bg-blue-50/70 p-4 mb-3 rounded-lg border border-blue-100 flex justify-between items-start">
//                   <div className="flex flex-col gap-2">
//                     <p className="font-medium text-gray-800 truncate">اسم الاختبار  : {exams?.title}</p> <p className="text-gray-600 text-sm mt-1"> وصف الاختبار : {exams?.description}</p>
//                   </div>
//                   <div className="flex space-x-2 space-x-reverse ml-4 flex-shrink-0">
//                     <ActionButton
//                       className="bg-blue-500 text-white p-2 rounded-md"
//                       // title="تعديل الاختبار"
//                       // icon={<EditOutlined className="text-blue-600" />}
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         router.push(`/exams/edit/${exams?.id}?lessonId=${lessonId}`)
//                       }}
//                     >
//                       تعديل الاختبار
//                     </ActionButton>
//                     <ActionButton
//                       className="bg-red-500 text-white p-2 rounded-md"
//                       // title="حذف الاختبار"
//                       // icon={<DeleteOutlined className="text-red-600" />}
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         setDeleteExamModal(exams);
//                       }}
//                     >
//                       حذف الاختبار
//                     </ActionButton>
//                   </div>
//                 </div>

//               ) : (
//                 <p className="text-gray-400 text-center py-3 text-sm">
//                   لا توجد اختبارات لهذا التدريب بعد
//                 </p>
//               )}
//             </div>

//             {/* Videos Section */}
//             <div className="mb-6">
//               <div className="flex justify-between items-center mb-3">
//                 <h5 className="text-md font-semibold text-gray-700 flex items-center">
//                   <VideoIcon className="ml-2 text-blue-500 w-4 h-4" />
//                   فيديوهات الاختبار ({videos?.length || 0})
//                 </h5>
//                 <button
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     setSelectedExam(exams?.id);
//                     setOpenAddExamVideo(lesson);
//                   }}
//                   className="flex items-center text-sm text-white  bg-green-700 p-2 !rounded-md"
//                 >
//                   <PlusOutlined className="ml-1" />
//                   إضافة فيديو
//                 </button>
//               </div>

//               {videos && videos.length > 0 ? (
//                 <div className="space-y-2">
//                   {videos.map((video) => (
//                     <VideoCard key={video.id} video={video} isExamVideo={true} />
//                   ))}
//                 </div>
//               ) : (
//                 <p className="text-gray-400 text-center py-3 text-sm">
//                   لا توجد فيديوهات لهذا الاختبار بعد.
//                 </p>
//               )}
//             </div>

//             {/* PDFs Section */}
//             <div className="mb-6">
//               <div className="flex justify-between items-center mb-3">
//                 <h5 className="text-md font-semibold text-gray-700 flex items-center">
//                   <FileIcon className="ml-2 text-gray-500 w-4 h-4" />
//                   ملفات PDF ({pdfs?.length || 0})
//                 </h5>
//                 <button
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     setSelectedExam(exams);
//                     setOpenAddExamPdf(true);
//                   }}
//                   className="flex items-center text-sm text-white bg-green-700 p-2 rounded-md"
//                 >
//                   <PlusOutlined className="ml-1" />
//                   إضافة ملف PDF
//                 </button>
//               </div>

//               {pdfs && pdfs?.length > 0 ? (
//                 <div className="space-y-2">
//                   {pdfs?.map((pdf) => (
//                     <PdfCard key={pdf.id} pdf={pdf} />
//                   ))}
//                 </div>
//               ) : (
//                 <p className="text-gray-400 text-center py-3 text-sm">
//                   لا توجد ملفات PDF لهذا الاختبار بعد.
//                 </p>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   };


//   const LiveSessionCard = ({ live }) => {
//     const isLiveActive = live?.active == "1";
//     console.log("live active", isLiveActive);
//     return (
//       <div className="bg-yellow-50/70 p-4 mb-3 rounded-lg border border-yellow-100 flex justify-between items-start">
//         <div className="flex items-start flex-1 min-w-0">
//           <CalendarOutlined className="text-yellow-600 text-lg mt-1 ml-3 flex-shrink-0" />
//           <div className="min-w-0 flex-1">
//             <div className="flex items-center gap-2">
//               <p className="font-medium text-gray-800 truncate">{live?.title}</p>
//               {isLiveActive && (
//                 <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">نشط</span>
//               )}
//             </div>
//             <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
//               {live?.time && <span>⏱️ {live?.time}</span>}
//               {live?.link && (
//                 <a href={live?.link} target="_blank" rel="noreferrer" className="truncate max-w-xs text-blue-600 hover:text-blue-700">
//                   {live?.link}
//                 </a>
//               )}
//             </div>
//           </div>
//         </div>
//         <div className="flex space-x-2 space-x-reverse ml-4 flex-shrink-0">
//           <ActionButton
//             className="bg-blue-500 text-white p-2 rounded-md"
//             // title="تعديل البث المباشر"
//             // icon={<EditOutlined className="text-blue-600" />}
//             onClick={(e) => {
//               e.stopPropagation();
//               setSelectedLive(live);
//               setOpenEditLive(true);
//             }}
//           >
//             تعديل البث المباشر
//           </ActionButton>
//           <ActionButton
//             className="bg-red-500 text-white p-2 rounded-md"
//             // title="حذف البث المباشر"
//             // icon={<DeleteOutlined className="text-red-600" />}
//             onClick={(e) => {
//               e.stopPropagation();
//               setSelectedLive(live);
//               setOpenDeleteLive(true);
//             }}
//           >
//             حذف البث المباشر
//           </ActionButton>
//           {!isSource&& 
//           <>
//          {live?.finished == "0"  &&  <button
//             title={isLiveActive ? "إلغاء تنشيط البث" : "تنشيط البث"}
//             onClick={(e) => {
//               e.stopPropagation();
//               setSelectedLive(live);
//               console.log(live);
//               setActiveLiveModal(true);
//             }}>
//             {isLiveActive ?
//               <div className="flex items-center bg-yellow-700 rounded-md p-2 text-white gap-1">
//                 <span> إلغاء تنشيط البث</span>
//                 <EyeOff className=" h-4 w-4" />
//               </div> : <div className="flex items-center bg-yellow-700 rounded-md p-2 text-white gap-1">
//                 <span>
//                   تنشيط البث المباشر
//                 </span>
//                 <Eye className="text-white h-4 w-4" />
//               </div>}
//           </button>}
//           {live?.finished == "0" && <ActionButton
//             className="bg-red-500 text-white rounded-md p-2"
//             // title="انهاء البث"
//             // icon={<Clock className="text-yellow-600 w-4 h-4" />}
//             onClick={(e) => {
//               e.stopPropagation();
//               setSelectedLive(live);
//               setMarkFinishModal(true);
//             }}
//           >
//             إنهاء البث
//           </ActionButton>
//           }</>}
//         </div>
//       </div>
//     );
//   };

//   // Lesson Card Renderer
//   const LessonCard = ({ lesson }) => {
//     console.log("lesson card", lesson);
//     const isLessonExpanded = expandedLessons[lesson.id];
//     const isLoadingVideos = loadingLessons[lesson.id];
//     const lessonVideos = lesson?.videos;
//     const isVideosExpanded = expandedVideos[lesson.id];
//     const isLivesExpanded = expandedLives[lesson?.id];
//     const isExamExpanded = expandedExams[lesson?.id];


//     const releaseAt =
//       lessonSchedule[lesson.id] ?? lesson.release_at ?? lesson.releaseAt;
//     const released = isReleased(releaseAt);

//     const lessonExams = lesson?.exam_all_data;

//     return (
//       <div className="mb-4 bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
//         {/* Lesson Header */}
//         <div
//           className="p-4 flex justify-between items-start cursor-pointer hover:bg-gray-50 transition duration-150"
//           onClick={() => toggleLessonCollapse(lesson, lesson.id)}
//         >
//           <div className="flex items-center flex-1 min-w-0">
//             <CaretDownOutlined
//               className={`text-xl ml-3 text-blue-500 transition-transform duration-300 ${isLessonExpanded ? "rotate-0" : "-rotate-90"
//                 }`}
//             />
//             <div className="min-w-0">
//               <h4 className="text-lg textWrapClass font-semibold text-gray-800 truncate">
//                 {lesson?.lesson_title}
//               </h4>
//               <p className="text-sm textWrapClass text-gray-600 mt-1 truncate">
//                 {lesson.lesson_description}
//               </p>

//               <div className="mt-2 flex items-center gap-3 flex-wrap">
//                 {
//                   <Tag color="green">{lesson?.lesson_show_date}</Tag>
//                 }
//               </div>
//             </div>
//           </div>

//           {/* Lesson Actions */}
//           <div
//             className="flex space-x-2 space-x-reverse ml-4 flex-shrink-0"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <ActionButton
//               className="bg-blue-500 text-white p-2 rounded-md"
//               // title="تعديل الدرس"
//               // icon={<EditOutlined className="text-blue-600" />}
//               onClick={() => {
//                 setSelectedLesson(lesson);
//                 setOpenEditLesson(true);
//               }}
//             >
//               تعديل الدرس
//             </ActionButton>
//             <ActionButton
//               className="bg-red-500 text-white p-2 rounded-md"
//               // title="حذف الدرس"
//               // icon={<DeleteOutlined className="text-red-600" />}
//               onClick={() => {
//                 setSelectedLesson(lesson);
//                 setOpenDeleteLesson(true);
//               }}
//             >
//               حذف الدرس
//             </ActionButton>
//           </div>
//         </div>

//         {/* Lesson Expanded Content */}
//         {isLessonExpanded && (
//           <div className="p-4 pt-3 bg-gray-50 border-t">
//             {!released ? (
//               <p className="text-center text-gray-400">
//                 هذا الدرس لم يُفتح بعد طبقاً لجدول الدورة.
//               </p>
//             ) : isLoadingVideos ? (
//               <div className="flex justify-center items-center py-4">
//                 <Spin spinning size="default" />
//               </div>
//             ) : (
//               <>
//                 {/* Videos Section - Now Collapsible */}
//                 <div className="mb-6 border-blue-300 rounded-md bg-blue-50/70">
//                   <div
//                     className="flex  py-7 justify-between items-center mb-3 cursor-pointer hover:bg-gray-100 p-2 rounded-lg"
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       toggleVideosCollapse(lesson.id);
//                     }}
//                   >
//                     <h5 className="text-md font-semibold text-gray-700 flex items-center">
//                       <CaretDownOutlined
//                         className={`text-lg ml-2 text-blue-500 transition-transform duration-300 ${isVideosExpanded ? "rotate-0" : "-rotate-90"
//                           }`}
//                       />
//                       <PlayCircleOutlined className="ml-2 text-blue-500" />
//                       الفيديوهات ({lessonVideos?.length || 0})
//                     </h5>
//                     <button
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         setOpenAddVideo(true);
//                         setSelectedLesson(lesson);
//                       }}
//                       className="flex items-center text-sm text-white bg-green-700 rounded-md p-2"
//                     >
//                       <PlusOutlined className="ml-1" />
//                       إضافة فيديو
//                     </button>
//                   </div>

//                   {isVideosExpanded && (
//                     <div className="mt-4 border-t pt-4">
//                       {lessonVideos && lessonVideos.length > 0 ? (
//                         <div className="space-y-2">
//                           {lessonVideos.map((video) => (
//                             <VideoCard key={video.id} video={video} />
//                           ))}
//                         </div>
//                       ) : (
//                         <p className="text-gray-400 text-center py-3 text-sm">
//                           لا توجد فيديوهات في هذا الدرس بعد.
//                         </p>
//                       )}
//                     </div>
//                   )}
//                 </div>

//                 {/* Exams Section */}
//                 <div className="mb-6">

//                   <div
//                     className="flex justify-between items-start cursor-pointer mb-3"
//                     onClick={() => toggleExamCollapse(lesson?.id)}
//                   >
//                     <div className="flex items-start flex-1 min-w-0">
//                       <CaretDownOutlined
//                         className={`text-xl ml-3 text-orange-500 transition-transform duration-300 ${isExamExpanded ? "rotate-0" : "-rotate-90"
//                           }`}
//                       />
//                       <FileOutlined className="text-lg ml-3 text-orange-500" />
//                       <div className="min-w-0 flex-1">
//                         تدريب
//                       </div>
//                     </div>
//                   </div>


//                   {isExamExpanded &&
//                     <div className="space-y-2">


//                       <ExamCard
//                         lessonExams={lessonExams}
//                         // key={exam.id}
//                         // exam={exam}
//                         lessonId={lesson?.id}
//                         lesson={lesson}
//                       />
//                       {/* {lessonExams?.map((exam) => {
//                       console.log("exam lesson", lesson)
//                       return (
//                         <ExamCard
//                           key={exam.id}
//                           exam={exam}
//                           lessonId={lesson?.id}
//                           lesson={lesson}
//                         />
//                       )
//                     })} */}
//                     </div>}
//                 </div>

//                 {/* Live Sessions Section - Now Collapsible */}
//                 <div className="bg-yellow-100/50 border-yellow-300">
//                   <div
//                     className="flex justify-between  items-center mb-6 cursor-pointer hover:bg-gray-100 p-2 rounded-lg"
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       toggleLivesCollapse(lesson.id);
//                     }}
//                   >
//                     <h5 className="text-md font-semibold text-gray-700 flex items-center">
//                       <CaretDownOutlined
//                         className={`text-lg ml-2 text-yellow-500 transition-transform duration-300 ${isLivesExpanded ? "rotate-0" : "-rotate-90"
//                           }`}
//                       />
//                       <CalendarOutlined className="ml-2 text-yellow-500" />
//                       البث المباشر ({lesson?.live?.length || 0})
//                     </h5>
//                     <button
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         setOpenAddLive(true);
//                         setRowData(lesson);
//                       }}
//                       className="flex items-center px-4 py-2 bg-green-700 text-white rounded-md transition duration-150"
//                     >
//                       <PlusOutlined className="ml-2" /> إضافة جلسة مباشرة
//                     </button>
//                   </div>

//                   {isLivesExpanded && (
//                     <div className="mt-4 border-t pt-4">
//                       {lesson?.live && lesson.live.length > 0 ? (
//                         <div className="space-y-2">
//                           {lesson.live.map((live) => (
//                             <LiveSessionCard key={live.id} live={live} />
//                           ))}
//                         </div>
//                       ) : (
//                         <p className="text-gray-400 text-center py-3 text-sm">
//                           لا توجد جلسات مباشرة لهذا الدرس بعد.
//                         </p>
//                       )}
//                     </div>
//                   )}
//                 </div>
//               </>
//             )}
//           </div>
//         )}
//       </div>
//     );
//   };

//   // Content Section Renderer
//   const ContentSection = ({ contentItem }) => {
//     const isContentExpanded = expandedContents[contentItem.id];
//     const isLoading = loadingContents[contentItem.id];
//     const contentLessons = contentItem.lessons;

//     const releaseAt =
//       contentSchedule[contentItem.id] ?? contentItem.release_at ?? contentItem.releaseAt;
//     const opened = isReleased(releaseAt);

//     return (
//       <div className="mb-8 bg-gray-50 border border-gray-100 rounded-xl shadow-md overflow-hidden">
//         {/* Content Header */}
//         <div
//           className="p-6 flex justify-between items-start border-b pb-3 cursor-pointer hover:bg-gray-100 transition duration-150"
//           onClick={() => toggleContentCollapse(contentItem.id)}
//         >
//           <div className="flex items-center flex-1 min-w-0">
//             <CaretDownOutlined
//               className={`text-2xl ml-3 text-blue-700 transition-transform duration-300 ${isContentExpanded ? "rotate-0" : "-rotate-90"
//                 }`}
//             />
//             <div className="min-w-0">
//               <h3 className="text-xl  textWrapClass flex gap-3 items-center font-bold text-gray-900 truncate">
//                                 <span className="textWrapClass">{contentItem.content_title}</span>
//                                <Tooltip title={contentItem.content_description}>
//                                  <BadgeAlert color="gray" />
//                                </Tooltip>
//                               </h3>
//               {/* <h3 className="text-xl font-bold text-gray-900 truncate">
//                 {contentItem?.content_title}
//               </h3> */}
//               {/* <p className="text-base text-gray-700 mt-1 truncate">
//                 {contentItem?.content_description}
//               </p> */}

//               <div className="mt-2 flex items-center gap-3 flex-wrap">
//                 {/* {contentItem?.current_show_date} */}

//                 <Tooltip title="موعد الظهور">
//                   <span className="text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">
//                     {contentItem?.content_show_date}
//                   </span>
//                 </Tooltip>
//               </div>
//             </div>
//           </div>

//           {/* Content Actions */}
//           <div
//             className="flex space-x-3 space-x-reverse ml-4 flex-shrink-0"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <ActionButton
//               icon={<PlusOutlined className="text-white" />}
//               onClick={() => {
//                 setOpenAddLesson(true);
//                 setRowData(contentItem);
//               }}
//               className="text-base p-2 rounded-md bg-green-700 text-white border border-green-200"
//             >
//               إضافة درس
//             </ActionButton>
//             <ActionButton
//               className="bg-blue-500 text-white p-2 rounded-md"
//               // icon={<EditOutlined className="text-blue-600" />}
//               onClick={() => {
//                 setRowData(contentItem);
//                 setEditModalContent(true);
//               }}
//             >
//               تعديل المحتوي
//             </ActionButton>
//             <ActionButton
//               className="bg-red-500 text-white p-2 rounded-md"
//               // icon={<DeleteOutlined className="text-red-600" />}
//               onClick={() => {
//                 setDeleteModalContent(contentItem);
//                 setRowData(contentItem);
//               }}
//             >
//               حذف المحتوي
//             </ActionButton>
//           </div>
//         </div>

//         {/* Content Expanded Section */}
//         {isContentExpanded && (
//           <div className="p-6 pt-3">
//             {isLoading ? (
//               <div className="flex justify-center items-center py-8">
//                 <Spin spinning size="large" />
//               </div>
//             ) : contentLessons && contentLessons.length > 0 ? (
//               <div className="pr-2 border-r-4 border-blue-300">
//                 {contentLessons.map((lesson) => (
//                   <LessonCard key={lesson.id} lesson={lesson} />
//                 ))}
//               </div>
//             ) : (
//               <p className="text-gray-400 text-center py-4">
//                 انقر على <PlusOutlined /> لإضافة الدرس الأول في هذا المحتوى.
//               </p>
//             )}
//           </div>
//         )}
//       </div>
//     );
//   };

//   useEffect(() => {
//     console.log('selectedLesson', selectedLesson, "openAddExamVideo", openAddExamVideo);
//   }, [selectedLesson, openAddExamVideo])

//   return (
//     <div
//       className="p-4 sm:p-8 bg-gradient-to-br from-gray-50 to-white min-h-screen"
//       dir="rtl"
//     >
//       {/* Page Header */}
//       <div className="max-w-6xl mx-auto mb-8 p-6 bg-white rounded-2xl shadow-xl border-b-4 border-blue-500">
//         <h1 className="text-3xl font-extrabold text-gray-800">
//           إدارة محتوى الدورة |  مرحلة التأسيس
//         </h1>
//         <p className="text-gray-600 mt-1">
//           تنظيم المناهج، الدروس، والفيديوهات وتحديد جدول الدورة.
//         </p>
//       </div>

//       {/* Main Grid Layout */}
//       <div className="max-w-6xl mx-auto gap-8">
//         <div className="lg:col-span-2">
//           <div className="flex justify-between items-center mb-6">
//             <h2 className="text-2xl font-bold text-gray-800">
//               هيكل المحتوى والمناهج
//             </h2>
//             <button
//               onClick={() => setAddModalContent(true)}
//               className="flex items-center px-4 py-2 text-white bg-green-600 rounded-lg shadow-md hover:bg-green-700 transition duration-150"
//             >
//               <PlusOutlined className="ml-2" /> إضافة  مرحلة التأسيس
//             </button>
//           </div>

//           {/* Render all content sections */}
//           {basicData.length > 0 ? (
//             basicData.map((item) => (
//               <ContentSection key={item.id} contentItem={item} />
//             ))
//           ) : (
//             <div className="text-center p-10 bg-white rounded-xl shadow-lg">
//               <p className="text-xl text-gray-500">
//                 لا يوجد محتوى مضاف بعد. ابدأ بإضافة أول محتوى رئيسي لدورتك.
//               </p>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* MODAL RENDERING */}
//       {/* ... existing modals ... */}
//       <AddRoundContent
//       isSource={isSource}
//         open={addModalContent}
//         setOpen={setAddModalContent}
//         id={id}
//       />
//       <EditRoundContent
//       isSource={isSource}
//         type="lecture"
//         open={editModalContent}
//         setOpen={setEditModalContent}
//         id={id}
//         rowData={rowData}
//         setRowData={setRowData}
//       />
//       <DeleteRoundContent
//         id={id}
//         isSource={isSource}
//         open={deleteModalContent}
//         setOpen={setDeleteModalContent}
//         rowData={rowData}
//       />

//       <AddLessonModal
//         id={id}
//         isSource={isSource}
//         open={openAddLesson}
//         setOpen={setOpenAddLesson}
//         round_content_id={rowData?.id}
//         type={rowData?.content_type}
//       />
//       <DeleteLessonModal
//       round_id={id}
//       id={id}
//       isSource={isSource}
//         open={openDeleteLesson}
//         setOpen={setOpenDeleteLesson}
//         rowData={selectedLesson}
//         setRowData={setSelectedLesson}
//       />
//       <EditLessonModal
//       isSource={isSource}
//         round_id={id}
//         open={openEditLesson}
//         setOpen={setOpenEditLesson}
//         rowData={selectedLesson}
//         setRowData={setSelectedLesson}
//       />

//       <AddVideoModal
//       isSource={isSource}
//         open={openAddVideo}
//         setOpen={setOpenAddVideo}
//         id={selectedLesson?.id}
//         content_id={id}
//       />
//       <EditVideoModal
//       isSource={isSource}
//         open={openEditVideo}
//         setOpen={setOpenEditVideo}
//         rowData={selectedVideo}
//         setRowData={setSelectedVideo}
//         id={selectedLesson?.id}
//         round_id={id}
//       />
//       <DeleteVideoModal
//       isSource={isSource}
//         open={openDeleteVideo}
//         setOpen={setOpenDeleteVideo}
//         rowData={selectedVideo}
//         setRowData={setSelectedVideo}
//         round_id={id}
//       />

//       <AddLivesModal isSource={isSource} open={openAddLive} setOpen={setOpenAddLive} id={id} lesson_id={rowData?.id} />
//       <EditLivesModal isSource={isSource} open={openEditLive} lesson_id={selectedLive?.id} id={id} setOpen={setOpenEditLive} rowData={selectedLive} setRowData={setSelectedLive} />
//       <DeleteLivesModal round_id={id} open={openDeleteLive} setOpen={setOpenDeleteLive} rowData={selectedLive} setRowData={setSelectedLive} />
//       <ActiveLiveModal id={id} open={activeLiveModal} rowData={selectedLive} setOpen={setActiveLiveModal} />
//       <FinishLiveModal id={id} open={markFinishModal} rowData={selectedLive} setOpen={setMarkFinishModal} />

//       <AddExamVideoModal
//       isSource={isSource}
//         open={openAddExamVideo}
//         setOpen={setOpenAddExamVideo}
//         exam_id={selectedExam}
//         id={id}
//         lesson_id={selectedLesson?.id}
//       />

//       <EditExamVideoModal
//       isSource={isSource}
//         open={openEditExamVideo}
//         setOpen={setOpenEditExamVideo}
//         rowData={selectedExamVideo}
//         setRowData={setSelectedExamVideo}
//         exam_id={selectedExam}
//         id={id}
//       />

//       <DeleteExamVideoModal
//       isSource={isSource}
//         open={openDeleteExamVideo}
//         setOpen={setOpenDeleteExamVideo}
//         rowData={selectedExamVideo}
//         setRowData={setSelectedExamVideo}
//         id={id}
//       />

//       <AddExamPdfModal
//       isSource={isSource}
//         open={openAddExamPdf}
//         setOpen={setOpenAddExamPdf}
//         exam_id={selectedExam}
//         lesson_id={selectedLesson?.id}
//         id={id}
//       />

//       <EditExamPdfModal
//       isSource={isSource}
//       id={id} exam_id={selectedLesson?.id} open={openEditExamPdf} setOpen={setOpenEditExamPdf} pdfData={selectedExamPdf} />

//       <DeleteExamPdfModal
//         open={openDeleteExamPdf}
//         setOpen={setOpenDeleteExamPdf}
//         rowData={selectedExamPdf}
//         setRowData={setSelectedExamPdf}
//         id={id}
//         lesson_id={selectedLesson?.id}
//       />

//       <DeleteExamModal open={deleteExamModal} setOpen={setDeleteExamModal} round_id={id} selectedExam={deleteExamModal} />
//     </div>
//   );
// }

"use client";
import React, { useCallback, useEffect, useState } from "react";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CalendarOutlined,
  CaretDownOutlined,
  FileTextOutlined,
  PlayCircleOutlined,
  PaperClipOutlined,
  FileOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { handleGetAllRoundContent } from "../../lib/features/roundContentSlice";
import { useRouter } from "next/navigation";
import { Spin, DatePicker, Tag, Tooltip } from "antd";
import dayjs from "dayjs";
import AddRoundContent from "../RoundContent/AddRoundContent";
import DeleteRoundContent from "../RoundContent/DeleteRoundContent";
import EditRoundContent from "../RoundContent/EditRoundContent";
import AddLessonModal from "../RoundContent/Lessons/AddLessonModal";
import { handleGetAllRoundLessons } from "../../lib/features/lessonSlice";
import DeleteLessonModal from "../RoundContent/Lessons/DeleteLessonModal";
import EditLessonModal from "../RoundContent/Lessons/EditLessonModal";
import AddVideoModal from "../RoundContent/Videos/AddVideoModal";
import { handleGetAllLessonVideo } from "../../lib/features/videoSlice";
import EditVideoModal from "../RoundContent/Videos/EditVideoModal";
import DeleteVideoModal from "../RoundContent/Videos/DeleteVideoModal";
import AddLivesModal from "../RoundContent/Lives/AddLivesModal";
import EditLivesModal from "../RoundContent/Lives/EditLivesModal";
import DeleteLivesModal from "../RoundContent/Lives/DeleteLivesModal";
import { BadgeAlert, Clock, Eye, EyeOff, FileIcon, VideoIcon } from "lucide-react";
import { handleActiveLive, handleMarkLiveAsFinish } from "../../lib/features/livesSlice";
import { toast } from "react-toastify";
import AddExamVideoModal from "../RoundContent/Exams/AddExamVideoModal";
import EditExamVideoModal from "../RoundContent/Exams/EditExamVideoModal";
import DeleteExamVideoModal from "../RoundContent/Exams/DeleteExamVideoModal";
import AddExamPdfModal from "../RoundContent/Exams/AddExamPdfModal";
import DeleteExamPdfModal from "../RoundContent/Exams/DeleteExamPdfModal";
import EditExamPdfModal from "../RoundContent/Exams/EditExamPdfModal";
import ActiveLiveModal from "../RoundContent/Lives/ActiveLiveModal";
import FinishLiveModal from "../RoundContent/Lives/FinishLiveModal";
import DeleteExamModal from "../Exams/DeleteExamModal";

const initialSchedule = {
  startDate: "2025-12-01",
  endDate: "2025-12-31",
  startTime: "09:00",
  endTime: "11:00",
};

// ADD THIS CSS CLASS AT THE TOP LEVEL
const textWrapClass = "break-words whitespace-normal overflow-hidden max-w-full [&_*]:break-words [&_*]:whitespace-normal [&_*]:max-w-full";

export default function CourseSourceBasicLevel({ id, isSource }) {
  const [rowData, setRowData] = useState({});
  const [contentSchedule, setContentSchedule] = useState({});
  const [lessonSchedule, setLessonSchedule] = useState({});

  // Modal states...
  const [deleteExamModal, setDeleteExamModal] = useState(false);
  const [addModalContent, setAddModalContent] = useState(false);
  const [deleteModalContent, setDeleteModalContent] = useState(false);
  const [editModalContent, setEditModalContent] = useState(false);
  const [openAddLesson, setOpenAddLesson] = useState(false);
  const [openEditLesson, setOpenEditLesson] = useState(false);
  const [openDeleteLesson, setOpenDeleteLesson] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState({});
  const [openAddVideo, setOpenAddVideo] = useState(false);
  const [openEditVideo, setOpenEditVideo] = useState(false);
  const [openDeleteVideo, setOpenDeleteVideo] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState({});
  const [activeLiveModal, setActiveLiveModal] = useState(false);
  const [markFinishModal, setMarkFinishModal] = useState(false);

  // Live modal states
  const [openAddLive, setOpenAddLive] = useState(false);
  const [openEditLive, setOpenEditLive] = useState(false);
  const [openDeleteLive, setOpenDeleteLive] = useState(false);
  const [selectedLive, setSelectedLive] = useState({});

  // Exam modal states
  const [openAddExamVideo, setOpenAddExamVideo] = useState(false);
  const [openAddExamPdf, setOpenAddExamPdf] = useState(false);
  const [openEditExamVideo, setOpenEditExamVideo] = useState(false);
  const [openEditExamPdf, setOpenEditExamPdf] = useState(false);
  const [openDeleteExamVideo, setOpenDeleteExamVideo] = useState(false);
  const [openDeleteExamPdf, setOpenDeleteExamPdf] = useState(false);
  const [selectedExam, setSelectedExam] = useState({});
  const [selectedExamVideo, setSelectedExamVideo] = useState({});
  const [selectedExamPdf, setSelectedExamPdf] = useState({});

  const router = useRouter();
  const dispatch = useDispatch();

  const { all_content_list } = useSelector((state) => state?.content);
  const { all_lessons_list } = useSelector((state) => state?.lesson);
  const { all_videos_list } = useSelector((state) => state?.videos);
  const { all_lives_list } = useSelector((state) => state?.lives);

  const [expandedContents, setExpandedContents] = useState({});
  const [expandedLessons, setExpandedLessons] = useState({});
  const [expandedExams, setExpandedExams] = useState({});
  const [expandedVideos, setExpandedVideos] = useState({});
  const [expandedLives, setExpandedLives] = useState({});
  const [loadingContents, setLoadingContents] = useState({});
  const [loadingLessons, setLoadingLessons] = useState({});

  const [basicData, setBasicData] = useState([]);

  const isReleased = useCallback((releaseAt) => {
    if (!releaseAt) return true;
    return dayjs(releaseAt).isBefore(dayjs());
  }, []);

  useEffect(() => {
    dispatch(
      handleGetAllRoundContent({
        body: {
          round_id: id,
        },
      })
    );
  }, [id, dispatch]);

  useEffect(() => {
    setBasicData(
      all_content_list?.data?.message?.contents.filter(
        (item) => item?.content_type === "basic"
      ) || []
    );
  }, [all_content_list]);

  const [selectedContent, setSelectedContent] = useState(null);

  const toggleContentCollapse = async (contentId) => {
    setSelectedContent(contentId);
    const isCurrentlyExpanded = expandedContents[contentId];
    setExpandedContents((prev) => ({
      ...prev,
      [contentId]: !isCurrentlyExpanded,
    }));
  };

  const toggleLessonCollapse = async (lesson, lessonId) => {
    const isCurrentlyExpanded = expandedLessons[lessonId];
    console.log("collapse lesson", lesson);
    setSelectedExam(lesson);
    setExpandedLessons((prev) => ({
      ...prev,
      [lessonId]: !isCurrentlyExpanded,
    }));
  };

  const toggleExamCollapse = async (examId) => {
    setSelectedExam(examId);
    const isCurrentlyExpanded = expandedExams[examId];
    setExpandedExams((prev) => ({
      ...prev,
      [examId]: !isCurrentlyExpanded,
    }));
  };

  const toggleVideosCollapse = async (lessonId) => {
    const isCurrentlyExpanded = expandedVideos[lessonId];
    setExpandedVideos((prev) => ({
      ...prev,
      [lessonId]: !isCurrentlyExpanded,
    }));
  };

  const toggleLivesCollapse = async (lessonId) => {
    const isCurrentlyExpanded = expandedLives[lessonId];
    setExpandedLives((prev) => ({
      ...prev,
      [lessonId]: !isCurrentlyExpanded,
    }));
  };

  useEffect(() => {
    if (selectedContent) {
      dispatch(handleGetAllRoundLessons({
        body: {
          round_content_id: selectedContent
        }
      }));
    }
  }, [selectedContent]);

  const ActionButton = ({ disabled, icon, title, onClick, className = "", children }) => (
    <button
      disabled={disabled}
      title={title || ""}
      onClick={onClick}
      className={`p-1 text-sm rounded-full transition duration-150  ${className}`}
    >
      {icon}
      {children}
    </button>
  );

  // Video Card Renderer
  const VideoCard = ({ video, isExamVideo = false }) => {
    const isFree = video?.free === "1";

    return (
      <div className="bg-blue-50/70 p-4 mb-3 rounded-lg border border-blue-100 flex justify-between items-start">
        <div className="flex items-start flex-1 min-w-0">
          <PlayCircleOutlined className="text-blue-600 text-lg mt-1 ml-3 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className={`font-medium text-gray-800 ${textWrapClass}`}>
                {video?.title}
              </p>
              {isFree && (
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex-shrink-0">
                  مجاني
                </span>
              )}
              {isExamVideo && (
                <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full flex-shrink-0">
                  فيديو اختبار
                </span>
              )}
               {video?.time && (
                <Tag className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full flex-shrink-0">
                 المدة : {video?.time}
                </Tag>
              )}
            </div>
            <p className={`text-gray-600 text-sm mt-1 ${textWrapClass}`}>{video?.description}</p>
            {video?.youtube_link && <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
              <span className="flex-shrink-0">لينك (Youtube)</span>
              {video?.youtube_link && (
                <a
                  href={video?.youtube_link}
                  target="_blank"
                  rel="noreferrer"
                  className={`truncate max-w-xs text-blue-600 hover:text-blue-700 ${textWrapClass}`}
                >
                  {video?.youtube_link}
                </a>
              )}
            </div>}

            {video?.vimeo_link && <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
              <span className="flex-shrink-0">لينك (Vimeo)</span>
              {video?.vimeo_link && (
                <a
                  href={video?.vimeo_link}
                  target="_blank"
                  rel="noreferrer"
                  className={`truncate max-w-xs text-blue-600 hover:text-blue-700 ${textWrapClass}`}
                >
                  {video?.vimeo_link}
                </a>
              )}
            </div>}
          </div>
        </div>
        <div className="flex space-x-2 space-x-reverse ml-4 flex-shrink-0">
          <ActionButton
            className="bg-blue-500 text-white p-2 rounded-md"
            onClick={(e) => {
              e.stopPropagation();
              if (isExamVideo) {
                setSelectedExamVideo(video);
                setOpenEditExamVideo(true);
              } else {
                setSelectedVideo(video);
                setOpenEditVideo(true);
              }
            }}
          >
            تعديل الفيديو
          </ActionButton>
          <ActionButton
            className="bg-red-500 text-white p-2 rounded-md"
            onClick={(e) => {
              e.stopPropagation();
              if (isExamVideo) {
                setSelectedExamVideo(video);
                setOpenDeleteExamVideo(true);
              } else {
                setSelectedVideo(video);
                setOpenDeleteVideo(true);
              }
            }}
          >
            حذف الفيديو
          </ActionButton>
        </div>
      </div>
    );
  };

  // PDF Card Renderer
  const PdfCard = ({ pdf }) => {
    return (
      <div className="bg-gray-50/70 p-4 mb-3 rounded-lg border border-gray-100 flex justify-between items-start">
        <div className="flex items-start flex-1 min-w-0">
          <PaperClipOutlined className="text-gray-600 text-lg mt-1 ml-3 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className={`font-medium text-gray-800 ${textWrapClass}`}>
                {pdf?.title}
              </p>
              <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full flex-shrink-0">
                ملف PDF
              </span>
            </div>
            <p className={`text-gray-600 text-sm mt-1 ${textWrapClass}`}>{pdf?.description}</p>
            <div className="mt-2 text-xs text-gray-500">
              {pdf?.pdf_url && (
                <a
                  href={pdf?.pdf_url}
                  target="_blank"
                  rel="noreferrer"
                  className={`text-blue-600 hover:text-blue-700 flex items-center gap-1 ${textWrapClass}`}
                >
                  <FileIcon className="w-3 h-3" />
                  عرض الملف
                </a>
              )}
            </div>

            {pdf?.type &&<Tag className="mt-3" color="green">{pdf?.type}</Tag>}
          </div>
        </div>
        <div className="flex space-x-2 space-x-reverse ml-4 flex-shrink-0">
          <ActionButton
            className="bg-blue-500 text-white p-2 rounded-md"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedExamPdf(pdf);
              setOpenEditExamPdf(true);
            }}
          >
            تعديل الملف
          </ActionButton>
          <ActionButton
            className="bg-red-500 text-white p-2 rounded-md"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedExamPdf(pdf);
              setOpenDeleteExamPdf(true);
            }}
          >
            حذف الملف
          </ActionButton>
        </div>
      </div>
    );
  };

  // Exam Card Renderer
  const ExamCard = ({ exam, lessonId, lesson, lessonExams }) => {
    const [exams, setExams] = useState({});
    const [videos, setVideos] = useState([]);
    const [pdfs, setPdfs] = useState([]);
    
    useEffect(() => {
      console.log(exam , lessonExams);
    } , [exam , lessonExams])

    useEffect(() => {
      if (lessonExams && lessonExams?.length > 0) {
        setExams(lessonExams[0]?.exams);
        setVideos(lessonExams[0]?.videos);
        setPdfs(lessonExams[0]?.exam_pdfs)
      }
    }, [lessonExams])


    useEffect(() => {
      console.log(exams, lessonExams)
    }, [exams, lessonExams])

    useEffect(() => {
      setSelectedLesson(lesson);
    }, [lesson])

    return (
      <div className="bg-orange-50/70 p-4 mb-3 rounded-lg border border-orange-100">
        {(
          <div className="mt-4 border-t pt-4">

            {/* Exam Sections */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <h5 className="text-md font-semibold text-gray-700 flex items-center">
                  <FileOutlined className="ml-2 text-blue-500 w-4 h-4" />
                  الاختبارات
                </h5>
                {(lessonExams?.length == 0 || !exams) && <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedExam(exams?.id);
                    router.push(`/questions/new?lessonId=${lessonId}`)
                  }}
                  className="flex items-center text-sm bg-green-700 text-white rounded-md p-2 flex-shrink-0"
                >
                  <PlusOutlined className="ml-1" />
                  إضافة اختبار
                </button>}
              </div>

              {lessonExams?.length > 0 && exams ? (
                <div className="bg-blue-50/70 p-4 mb-3 rounded-lg border border-blue-100 flex justify-between items-start">
                  <div className="flex flex-col gap-2">
                    <p className={`font-medium text-gray-800 ${textWrapClass}`}>اسم الاختبار  : {exams?.title}</p>
                    <p className={`text-gray-600 text-sm mt-1 ${textWrapClass}`}> وصف الاختبار : {exams?.description}</p>
                  </div>
                  <div className="flex space-x-2 space-x-reverse ml-4 flex-shrink-0">
                    <ActionButton
                      className="bg-blue-500 text-white p-2 rounded-md"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/exams/edit/${exams?.id}?lessonId=${lessonId}`)
                      }}
                    >
                      تعديل الاختبار
                    </ActionButton>
                    <ActionButton
                      className="bg-red-500 text-white p-2 rounded-md"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteExamModal(exams);
                      }}
                    >
                      حذف الاختبار
                    </ActionButton>
                    <ActionButton
                      className="bg-green-500 text-white p-2 rounded-md"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/exams/${exams?.id}?lessonId=${lessonId}`)
                      }}
                    >
                      تفاصيل الاختبار
                    </ActionButton>
                  </div>
                </div>

              ) : (
                <p className="text-gray-400 text-center py-3 text-sm">
                  لا توجد اختبارات لهذا التدريب بعد
                </p>
              )}
            </div>

            {/* Videos Section */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <h5 className="text-md font-semibold text-gray-700 flex items-center">
                  <VideoIcon className="ml-2 text-blue-500 w-4 h-4" />
                  فيديوهات الاختبار ({videos?.length || 0})
                </h5>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedExam(exams?.id);
                    setOpenAddExamVideo(lesson);
                  }}
                  className="flex items-center text-sm text-white  bg-green-700 p-2 !rounded-md flex-shrink-0"
                >
                  <PlusOutlined className="ml-1" />
                  إضافة فيديو
                </button>
              </div>

              {videos && videos.length > 0 ? (
                <div className="space-y-2">
                  {videos.map((video) => (
                    <VideoCard key={video.id} video={video} isExamVideo={true} />
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-3 text-sm">
                  لا توجد فيديوهات لهذا الاختبار بعد.
                </p>
              )}
            </div>

            {/* PDFs Section */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <h5 className="text-md font-semibold text-gray-700 flex items-center">
                  <FileIcon className="ml-2 text-gray-500 w-4 h-4" />
                  ملفات PDF ({pdfs?.length || 0})
                </h5>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedExam(exams);
                    setOpenAddExamPdf(true);
                  }}
                  className="flex items-center text-sm text-white bg-green-700 p-2 rounded-md flex-shrink-0"
                >
                  <PlusOutlined className="ml-1" />
                  إضافة ملف PDF
                </button>
              </div>

              {pdfs && pdfs?.length > 0 ? (
                <div className="space-y-2">
                  {pdfs?.map((pdf) => (
                    <PdfCard key={pdf.id} pdf={pdf} />
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-3 text-sm">
                  لا توجد ملفات PDF لهذا الاختبار بعد.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };


  const LiveSessionCard = ({ live }) => {
    const isLiveActive = live?.active == "1";
    console.log("live active", isLiveActive);
    return (
      <div className="bg-yellow-50/70 p-4 mb-3 rounded-lg border border-yellow-100 flex justify-between items-start">
        <div className="flex items-start flex-1 min-w-0">
          <CalendarOutlined className="text-yellow-600 text-lg mt-1 ml-3 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className={`font-medium text-gray-800 ${textWrapClass}`}>{live?.title}</p>
              {isLiveActive && (
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex-shrink-0">نشط</span>
              )}
            </div>
            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
              {live?.time && <span className="flex-shrink-0">⏱️ {live?.time}</span>}
              {live?.link && (
                <a href={live?.link} target="_blank" rel="noreferrer" className={`truncate max-w-xs text-blue-600 hover:text-blue-700 ${textWrapClass}`}>
                  {live?.link}
                </a>
              )}
            </div>
          </div>
        </div>
        <div className="flex space-x-2 space-x-reverse ml-4 flex-shrink-0">
          <ActionButton
            className="bg-blue-500 text-white p-2 rounded-md"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedLive(live);
              setOpenEditLive(true);
            }}
          >
            تعديل البث المباشر
          </ActionButton>
          <ActionButton
            className="bg-red-500 text-white p-2 rounded-md"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedLive(live);
              setOpenDeleteLive(true);
            }}
          >
            حذف البث المباشر
          </ActionButton>
          {!isSource &&
            <>
              {live?.finished == "0" && <button
                title={isLiveActive ? "إلغاء تنشيط البث" : "تنشيط البث"}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedLive(live);
                  console.log(live);
                  setActiveLiveModal(true);
                }}>
                {isLiveActive ?
                  <div className="flex items-center bg-yellow-700 rounded-md p-2 text-white gap-1 flex-shrink-0">
                    <span> إلغاء تنشيط البث</span>
                    <EyeOff className=" h-4 w-4" />
                  </div> : <div className="flex items-center bg-yellow-700 rounded-md p-2 text-white gap-1 flex-shrink-0">
                    <span>
                      تنشيط البث المباشر
                    </span>
                    <Eye className="text-white h-4 w-4" />
                  </div>}
              </button>}
              {live?.finished == "0" && <ActionButton
                className="bg-red-500 text-white rounded-md p-2 flex-shrink-0"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedLive(live);
                  setMarkFinishModal(true);
                }}
              >
                إنهاء البث
              </ActionButton>
              }</>}
        </div>
      </div>
    );
  };

  // Lesson Card Renderer
  const LessonCard = ({ lesson }) => {
    console.log("lesson card", lesson);
    const isLessonExpanded = expandedLessons[lesson.id];
    const isLoadingVideos = loadingLessons[lesson.id];
    const lessonVideos = lesson?.videos;
    const isVideosExpanded = expandedVideos[lesson.id];
    const isLivesExpanded = expandedLives[lesson?.id];
    const isExamExpanded = expandedExams[lesson?.id];


    const releaseAt =
      lessonSchedule[lesson.id] ?? lesson.release_at ?? lesson.releaseAt;
    const released = isReleased(releaseAt);

    const lessonExams = lesson?.exam_all_data;

    return (
      <div className="mb-4 bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        {/* Lesson Header */}
        <div
          className="p-4 flex justify-between items-start cursor-pointer hover:bg-gray-50 transition duration-150"
          onClick={() => toggleLessonCollapse(lesson, lesson.id)}
        >
          <div className="flex items-center flex-1 min-w-0">
            <CaretDownOutlined
              className={`text-xl ml-3 text-blue-500 transition-transform duration-300 ${isLessonExpanded ? "rotate-0" : "-rotate-90"
                }`}
            />
            <div className="min-w-0">
              <h4 className={`text-lg font-semibold text-gray-800 ${textWrapClass}`}>
                {lesson?.lesson_title}
              </h4>
              <p className={`text-sm text-gray-600 mt-1 ${textWrapClass}`}>
                {lesson.lesson_description}
              </p>

              <div className="mt-2 flex items-center gap-3 flex-wrap">
                {
                  <Tag color="green" className="flex-shrink-0">{lesson?.lesson_show_date}</Tag>
                }
              </div>
            </div>
          </div>

          {/* Lesson Actions */}
          <div
            className="flex space-x-2 space-x-reverse ml-4 flex-shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <ActionButton
              className="bg-blue-500 text-white p-2 rounded-md flex-shrink-0"
              onClick={() => {
                setSelectedLesson(lesson);
                setOpenEditLesson(true);
              }}
            >
              تعديل الدرس
            </ActionButton>
            <ActionButton
              className="bg-red-500 text-white p-2 rounded-md flex-shrink-0"
              onClick={() => {
                setSelectedLesson(lesson);
                setOpenDeleteLesson(true);
              }}
            >
              حذف الدرس
            </ActionButton>
          </div>
        </div>

        {/* Lesson Expanded Content */}
        {isLessonExpanded && (
          <div className="p-4 pt-3 bg-gray-50 border-t">
            {!released ? (
              <p className="text-center text-gray-400">
                هذا الدرس لم يُفتح بعد طبقاً لجدول الدورة.
              </p>
            ) : isLoadingVideos ? (
              <div className="flex justify-center items-center py-4">
                <Spin spinning size="default" />
              </div>
            ) : (
              <>
                {/* Videos Section - Now Collapsible */}
                <div className="mb-6 border-blue-300 rounded-md bg-blue-50/70">
                  <div
                    className="flex  py-7 justify-between items-center mb-3 cursor-pointer hover:bg-gray-100 p-2 rounded-lg"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleVideosCollapse(lesson.id);
                    }}
                  >
                    <h5 className="text-md font-semibold text-gray-700 flex items-center">
                      <CaretDownOutlined
                        className={`text-lg ml-2 text-blue-500 transition-transform duration-300 ${isVideosExpanded ? "rotate-0" : "-rotate-90"
                          }`}
                      />
                      <PlayCircleOutlined className="ml-2 text-blue-500" />
                      الفيديوهات ({lessonVideos?.length || 0})
                    </h5>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenAddVideo(true);
                        setSelectedLesson(lesson);
                      }}
                      className="flex items-center text-sm text-white bg-green-700 rounded-md p-2 flex-shrink-0"
                    >
                      <PlusOutlined className="ml-1" />
                      إضافة فيديو
                    </button>
                  </div>

                  {isVideosExpanded && (
                    <div className="mt-4 border-t pt-4">
                      {lessonVideos && lessonVideos.length > 0 ? (
                        <div className="space-y-2">
                          {lessonVideos.map((video) => (
                            <VideoCard key={video.id} video={video} />
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-400 text-center py-3 text-sm">
                          لا توجد فيديوهات في هذا الدرس بعد.
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Exams Section */}
                <div className="mb-6">

                  <div
                    className="flex justify-between items-start cursor-pointer mb-3"
                    onClick={() => toggleExamCollapse(lesson?.id)}
                  >
                    <div className="flex items-start flex-1 min-w-0">
                      <CaretDownOutlined
                        className={`text-xl ml-3 text-orange-500 transition-transform duration-300 ${isExamExpanded ? "rotate-0" : "-rotate-90"
                          }`}
                      />
                      <FileOutlined className="text-lg ml-3 text-orange-500" />
                      <div className="min-w-0 flex-1">
                        تدريب
                      </div>
                    </div>
                  </div>


                  {isExamExpanded &&
                    <div className="space-y-2">


                      <ExamCard
                        lessonExams={lessonExams}
                        lessonId={lesson?.id}
                        lesson={lesson}
                      />
                    </div>}
                </div>

                {/* Live Sessions Section - Now Collapsible */}
                <div className="bg-yellow-100/50 border-yellow-300">
                  <div
                    className="flex justify-between  items-center mb-6 cursor-pointer hover:bg-gray-100 p-2 rounded-lg"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLivesCollapse(lesson.id);
                    }}
                  >
                    <h5 className="text-md font-semibold text-gray-700 flex items-center">
                      <CaretDownOutlined
                        className={`text-lg ml-2 text-yellow-500 transition-transform duration-300 ${isLivesExpanded ? "rotate-0" : "-rotate-90"
                          }`}
                      />
                      <CalendarOutlined className="ml-2 text-yellow-500" />
                      البث المباشر ({lesson?.live?.length || 0})
                    </h5>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenAddLive(true);
                        setRowData(lesson);
                      }}
                      className="flex items-center px-4 py-2 bg-green-700 text-white rounded-md transition duration-150 flex-shrink-0"
                    >
                      <PlusOutlined className="ml-2" /> إضافة جلسة مباشرة
                    </button>
                  </div>

                  {isLivesExpanded && (
                    <div className="mt-4 border-t pt-4">
                      {lesson?.live && lesson.live.length > 0 ? (
                        <div className="space-y-2">
                          {lesson.live.map((live) => (
                            <LiveSessionCard key={live.id} live={live} />
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-400 text-center py-3 text-sm">
                          لا توجد جلسات مباشرة لهذا الدرس بعد.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    );
  };

  // Content Section Renderer
  const ContentSection = ({ contentItem }) => {
    
    const isContentExpanded = expandedContents[contentItem.id];
    const isLoading = loadingContents[contentItem.id];
    const contentLessons = contentItem.lessons;

    const releaseAt =
      contentSchedule[contentItem.id] ?? contentItem.release_at ?? contentItem.releaseAt;
    const opened = isReleased(releaseAt);

    return (
      <div className="mb-8 bg-gray-50 border border-gray-100 rounded-xl shadow-md overflow-hidden">
        {/* Content Header */}
        <div
          className="p-6 flex justify-between gap-4 items-start border-b pb-3 cursor-pointer hover:bg-gray-100 transition duration-150"
          onClick={() => toggleContentCollapse(contentItem.id)}
        >
          <div className="flex items-center flex-1 min-w-0">
            <CaretDownOutlined
              className={`text-2xl ml-3 text-blue-700 transition-transform duration-300 ${isContentExpanded ? "rotate-0" : "-rotate-90"
                }`}
            />
            <div className="min-w-0">
              <h3 className={`text-xl flex gap-3  font-bold text-gray-900`}>
                <span className={`${textWrapClass}`}>{contentItem.content_title}</span>
                {contentItem?.content_description && <Tooltip title={contentItem?.content_description}>
                  <BadgeAlert color="gray" className="flex-shrink-0" />
                </Tooltip>}
              </h3>
              <div className="mt-2 flex items-center gap-3 flex-wrap">
                <Tooltip title="موعد الظهور">
                  <span className="text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full flex-shrink-0">
                    {contentItem?.content_show_date}
                  </span>
                </Tooltip>
              </div>
            </div>
          </div>

          {/* Content Actions */}
          <div
            className="flex space-x-3 space-x-reverse ml-4 flex-shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <ActionButton
              icon={<PlusOutlined className="text-white" />}
              onClick={() => {
                setOpenAddLesson(true);
                setRowData(contentItem);
              }}
              className="text-base p-2 rounded-md bg-green-700 text-white border border-green-200 flex-shrink-0"
            >
              إضافة درس
            </ActionButton>
            <ActionButton
              className="bg-blue-500 text-white p-2 rounded-md flex-shrink-0"
              onClick={() => {
                setRowData(contentItem);
                setEditModalContent(true);
              }}
            >
              تعديل المحتوي
            </ActionButton>
            <ActionButton
              className="bg-red-500 text-white p-2 rounded-md flex-shrink-0"
              onClick={() => {
                setDeleteModalContent(contentItem);
                setRowData(contentItem);
              }}
            >
              حذف المحتوي
            </ActionButton>
          </div>
        </div>

        {/* Content Expanded Section */}
        {isContentExpanded && (
          <div className="p-6 pt-3">
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <Spin spinning size="large" />
              </div>
            ) : contentLessons && contentLessons.length > 0 ? (
              <div className="pr-2 border-r-4 border-blue-300">
                {contentLessons.map((lesson) => (
                  <LessonCard key={lesson.id} lesson={lesson} />
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-4">
                انقر على <PlusOutlined /> لإضافة الدرس الأول في هذا المحتوى.
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  useEffect(() => {
    console.log('selectedLesson', selectedLesson, "openAddExamVideo", openAddExamVideo);
  }, [selectedLesson, openAddExamVideo])

  return (
    <div
      className="p-4 sm:p-8 bg-gradient-to-br from-gray-50 to-white min-h-screen"
      dir="rtl"
    >
      {/* Page Header */}
      <div className="max-w-6xl mx-auto mb-8 p-6 bg-white rounded-2xl shadow-xl border-b-4 border-blue-500">
        <h1 className="text-3xl font-extrabold text-gray-800">
          إدارة محتوى الدورة |  مرحلة التأسيس
        </h1>
        <p className="text-gray-600 mt-1">
          تنظيم المناهج، الدروس، والفيديوهات وتحديد جدول الدورة.
        </p>
      </div>

      {/* Main Grid Layout */}
      <div className="max-w-6xl mx-auto gap-8">
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
               المحتوى والمناهج
            </h2>
            <button
              onClick={() => setAddModalContent(true)}
              className="flex items-center px-4 py-2 text-white bg-green-600 rounded-lg shadow-md hover:bg-green-700 transition duration-150 flex-shrink-0"
            >
              <PlusOutlined className="ml-2" /> إضافة  مرحلة التأسيس
            </button>
          </div>

          {/* Render all content sections */}
          {basicData.length > 0 ? (
            basicData.map((item) => (
              <ContentSection key={item.id} contentItem={item} />
            ))
          ) : (
            <div className="text-center p-10 bg-white rounded-xl shadow-lg">
              <p className="text-xl text-gray-500">
                لا يوجد محتوى مضاف بعد. ابدأ بإضافة أول محتوى رئيسي لدورتك.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* MODAL RENDERING */}
      {/* ... existing modals ... */}
      <AddRoundContent
        isSource={isSource}
        open={addModalContent}
        setOpen={setAddModalContent}
        id={id}
      />
      <EditRoundContent
        isSource={isSource}
        type="lecture"
        open={editModalContent}
        setOpen={setEditModalContent}
        id={id}
        rowData={rowData}
        setRowData={setRowData}
      />
      <DeleteRoundContent
        id={id}
        isSource={isSource}
        open={deleteModalContent}
        setOpen={setDeleteModalContent}
        rowData={rowData}
      />

      <AddLessonModal
        id={id}
        isSource={isSource}
        open={openAddLesson}
        setOpen={setOpenAddLesson}
        round_content_id={rowData?.id}
        type={rowData?.content_type}
      />
      <DeleteLessonModal
        round_id={id}
        id={id}
        isSource={isSource}
        open={openDeleteLesson}
        setOpen={setOpenDeleteLesson}
        rowData={selectedLesson}
        setRowData={setSelectedLesson}
      />
      <EditLessonModal
        isSource={isSource}
        round_id={id}
        open={openEditLesson}
        setOpen={setOpenEditLesson}
        rowData={selectedLesson}
        setRowData={setSelectedLesson}
      />

      <AddVideoModal
        isSource={isSource}
        open={openAddVideo}
        setOpen={setOpenAddVideo}
        id={selectedLesson?.id}
        content_id={id}
      />
      <EditVideoModal
        isSource={isSource}
        open={openEditVideo}
        setOpen={setOpenEditVideo}
        rowData={selectedVideo}
        setRowData={setSelectedVideo}
        id={selectedLesson?.id}
        round_id={id}
      />
      <DeleteVideoModal
        isSource={isSource}
        open={openDeleteVideo}
        setOpen={setOpenDeleteVideo}
        rowData={selectedVideo}
        setRowData={setSelectedVideo}
        round_id={id}
      />

      <AddLivesModal isSource={isSource} open={openAddLive} setOpen={setOpenAddLive} id={id} lesson_id={rowData?.id} />
      <EditLivesModal isSource={isSource} open={openEditLive} lesson_id={selectedLive?.id} id={id} setOpen={setOpenEditLive} rowData={selectedLive} setRowData={setSelectedLive} />
      <DeleteLivesModal round_id={id} open={openDeleteLive} setOpen={setOpenDeleteLive} rowData={selectedLive} setRowData={setSelectedLive} />
      <ActiveLiveModal id={id} open={activeLiveModal} rowData={selectedLive} setOpen={setActiveLiveModal} />
      <FinishLiveModal id={id} open={markFinishModal} rowData={selectedLive} setOpen={setMarkFinishModal} />

      <AddExamVideoModal
        isSource={isSource}
        open={openAddExamVideo}
        setOpen={setOpenAddExamVideo}
        exam_id={selectedExam}
        id={id}
        lesson_id={selectedLesson?.id}
      />

      <EditExamVideoModal
        isSource={isSource}
        open={openEditExamVideo}
        setOpen={setOpenEditExamVideo}
        rowData={selectedExamVideo}
        setRowData={setSelectedExamVideo}
        exam_id={selectedExam}
        id={id}
      />

      <DeleteExamVideoModal
        isSource={isSource}
        open={openDeleteExamVideo}
        setOpen={setOpenDeleteExamVideo}
        rowData={selectedExamVideo}
        setRowData={setSelectedExamVideo}
        id={id}
      />

      <AddExamPdfModal
        isSource={isSource}
        open={openAddExamPdf}
        setOpen={setOpenAddExamPdf}
        exam_id={selectedExam}
        lesson_id={selectedLesson?.id}
        id={id}
      />

      <EditExamPdfModal
        isSource={isSource}
        id={id} exam_id={selectedLesson?.id} open={openEditExamPdf} setOpen={setOpenEditExamPdf} pdfData={selectedExamPdf} />

      <DeleteExamPdfModal
        open={openDeleteExamPdf}
        setOpen={setOpenDeleteExamPdf}
        rowData={selectedExamPdf}
        setRowData={setSelectedExamPdf}
        id={id}
        lesson_id={selectedLesson?.id}
      />

      <DeleteExamModal open={deleteExamModal} setOpen={setDeleteExamModal} round_id={id} selectedExam={deleteExamModal} />
    </div>
  );
}