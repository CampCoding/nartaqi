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

// const initialSchedule = {
//   startDate: "2025-12-01",
//   endDate: "2025-12-31",
//   startTime: "09:00",
//   endTime: "11:00",
// };

// export default function CourseSourceBasicLevel({ id }) {
//   const [rowData, setRowData] = useState({});
//   const [schedule, setSchedule] = useState(initialSchedule);
//   const [isScheduleCollapsed, setIsScheduleCollapsed] = useState(false);

//   // per section and per lesson release times (local state, can be synced with backend)
//   const [contentSchedule, setContentSchedule] = useState({});
//   const [lessonSchedule, setLessonSchedule] = useState({});

//   // Modal states...
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

//   const router = useRouter();
//   const dispatch = useDispatch();

//   const { all_content_list } = useSelector((state) => state?.content);
//   const { all_lessons_list } = useSelector((state) => state?.lesson);
//   const { all_videos_list } = useSelector((state) => state?.videos);

//   // Track which content sections are expanded and their loading states
//   const [expandedContents, setExpandedContents] = useState({});
//   const [expandedLessons, setExpandedLessons] = useState({});
//   const [loadingContents, setLoadingContents] = useState({});
//   const [loadingLessons, setLoadingLessons] = useState({});

//   const [basicData, setBasicData] = useState([]);

//   // helper to know if something is "released" based on its datetime
//   const isReleased = useCallback((releaseAt) => {
//     if (!releaseAt) return true; // if no schedule -> always available
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
//       all_content_list?.data?.message?.filter(
//         (item) => item?.type === "basic"
//       ) || []
//     );
//   }, [all_content_list]);

//   // Helper to get videos for specific lesson
//   const getVideosByLessonId = useCallback(
//     (lessonId) => {
//       return (
//         all_videos_list?.data?.message?.filter(
//           (item) => item?.lesson_id === lessonId
//         ) || []
//       );
//     },
//     [all_videos_list]
//   );

//   // Helper to get lessons for specific content
//   const getLessonsByContentId = useCallback(
//     (contentId) => {
//       return (
//         all_lessons_list?.data?.message?.filter(
//           (item) =>
//             item?.type === "basic" && item?.round_content_id === contentId
//         ) || []
//       );
//     },
//     [all_lessons_list]
//   );

//   function handleScheduleChange(e) {
//     const { name, value } = e.target;
//     setSchedule((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//     // TODO: here you can also call an API to save course-level schedule
//   }

//   const handleContentReleaseChange = (contentId, value) => {
//     const release_at = value ? value.toISOString() : null;

//     setContentSchedule((prev) => ({
//       ...prev,
//       [contentId]: release_at,
//     }));

//     // TODO: call your API / Redux action here to persist:
//     // dispatch(updateRoundContentRelease({ id: contentId, release_at }));
//   };

//   const handleLessonReleaseChange = (lessonId, value) => {
//     const release_at = value ? value.toISOString() : null;

//     setLessonSchedule((prev) => ({
//       ...prev,
//       [lessonId]: release_at,
//     }));

//     // TODO: call your API / Redux action here to persist:
//     // dispatch(updateLessonRelease({ id: lessonId, release_at }));
//   };

//   // --- Toggle Handlers ---

//   const toggleContentCollapse = async (contentId) => {
//     const isCurrentlyExpanded = expandedContents[contentId];

//     // Toggle the expanded state
//     setExpandedContents((prev) => ({
//       ...prev,
//       [contentId]: !isCurrentlyExpanded,
//     }));

//     // If we're expanding and haven't loaded lessons yet, fetch them
//     if (!isCurrentlyExpanded) {
//       setLoadingContents((prev) => ({
//         ...prev,
//         [contentId]: true,
//       }));

//       try {
//         await dispatch(
//           handleGetAllRoundLessons({
//             body: {
//               round_content_id: contentId,
//             },
//           })
//         );
//       } catch (error) {
//         console.error("Error fetching lessons:", error);
//       } finally {
//         setLoadingContents((prev) => ({
//           ...prev,
//           [contentId]: false,
//         }));
//       }
//     }
//   };

//   const toggleLessonCollapse = async (lessonId) => {
//     const isCurrentlyExpanded = expandedLessons[lessonId];

//     // Toggle the expanded state
//     setExpandedLessons((prev) => ({
//       ...prev,
//       [lessonId]: !isCurrentlyExpanded,
//     }));

//     // If we're expanding and haven't loaded videos yet, fetch them
//     if (!isCurrentlyExpanded) {
//       setLoadingLessons((prev) => ({
//         ...prev,
//         [lessonId]: true,
//       }));

//       try {
//         await dispatch(
//           handleGetAllLessonVideo({
//             body: {
//               lesson_id: lessonId,
//             },
//           })
//         );
//       } catch (error) {
//         console.error("Error fetching videos:", error);
//       } finally {
//         setLoadingLessons((prev) => ({
//           ...prev,
//           [lessonId]: false,
//         }));
//       }
//     }
//   };

//   const toggleScheduleCollapse = () => {
//     setIsScheduleCollapsed((prev) => !prev);
//   };

//   const ActionButton = ({ icon, onClick, className = "", children }) => (
//     <button
//       onClick={onClick}
//       className={`p-1 text-sm rounded-full transition duration-150 hover:bg-gray-200 ${className}`}
//     >
//       {icon}
//       {children}
//     </button>
//   );

//   // Video Card Renderer
//   const VideoCard = ({ video }) => {
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
//             </div>
//             <p className="text-gray-600 text-sm mt-1">{video?.description}</p>
//             <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
//               <span>⏱️ {video?.time}</span>
//               {video?.video && (
//                 <a
//                   href={video?.video}
//                   target="_blank"
//                   rel="noreferrer"
//                   className="truncate max-w-xs text-blue-600 hover:text-blue-700"
//                 >
//                   {video.video}
//                 </a>
//               )}
//             </div>
//           </div>
//         </div>
//         <div className="flex space-x-2 space-x-reverse ml-4 flex-shrink-0">
//           <ActionButton
//             icon={<EditOutlined className="text-blue-600" />}
//             onClick={(e) => {
//               e.stopPropagation();
//               setSelectedVideo(video);
//               setOpenEditVideo(true);
//             }}
//           />
//           <ActionButton
//             icon={<DeleteOutlined className="text-red-600" />}
//             onClick={(e) => {
//               e.stopPropagation();
//               setSelectedVideo(video);
//               setOpenDeleteVideo(true);
//             }}
//           />
//         </div>
//       </div>
//     );
//   };

//   // Exam Card Renderer (placeholder)
//   const ExamCard = ({ exam, lessonId }) => (
//     <div className="bg-orange-50/70 p-4 mb-3 rounded-lg border border-orange-100 flex justify-between items-start">
//       <div className="flex items-start flex-1 min-w-0">
//         <FileTextOutlined className="text-orange-600 text-lg mt-1 ml-3 flex-shrink-0" />
//         <div className="min-w-0 flex-1">
//           <p className="font-medium text-gray-800 truncate">{exam.title}</p>
//           <p className="text-gray-600 text-sm mt-1">{exam.description}</p>
//           <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
//             <span>⏱️ {exam.duration} دقيقة</span>
//             <span>❓ {exam.questions} أسئلة</span>
//           </div>
//         </div>
//       </div>
//       <div className="flex space-x-2 space-x-reverse ml-4 flex-shrink-0">
//         <ActionButton
//           icon={<EditOutlined className="text-blue-600" />}
//           onClick={(e) => {
//             e.stopPropagation();
//             // Handle exam edit
//           }}
//         />
//         <ActionButton
//           icon={<DeleteOutlined className="text-red-600" />}
//           onClick={() => handleDeleteExam(lessonId, exam.id)}
//         />
//       </div>
//     </div>
//   );

//   // Lesson Card Renderer
//   const LessonCard = ({ lesson }) => {
//     const isLessonExpanded = expandedLessons[lesson.id];
//     const isLoadingVideos = loadingLessons[lesson.id];
//     const lessonVideos = getVideosByLessonId(lesson.id);

//     const releaseAt =
//       lessonSchedule[lesson.id] ?? lesson.release_at ?? lesson.releaseAt;
//     const released = isReleased(releaseAt);

//     // Mock exams data - replace with actual API call
//     const lessonExams = [];

//     return (
//       <div className="mb-4 bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
//         {/* Lesson Header (Clickable for Collapse) */}
//         <div
//           className="p-4 flex justify-between items-start cursor-pointer hover:bg-gray-50 transition duration-150"
//           onClick={() => toggleLessonCollapse(lesson.id)}
//         >
//           <div className="flex items-center flex-1 min-w-0">
//             <CaretDownOutlined
//               className={`text-xl ml-3 text-blue-500 transition-transform duration-300 ${
//                 isLessonExpanded ? "rotate-0" : "-rotate-90"
//               }`}
//             />
//             <div className="min-w-0">
//               <h4 className="text-lg font-semibold text-gray-800 truncate">
//                 {lesson.title}
//               </h4>
//               <p className="text-sm text-gray-600 mt-1 truncate">
//                 {lesson.description}
//               </p>

//               <div className="mt-2 flex items-center gap-3 flex-wrap">
//                 {releaseAt ? (
//                   released ? (
//                     <Tag color="green">متاح</Tag>
//                   ) : (
//                     <Tag color="red">لم يُفتح بعد</Tag>
//                   )
//                 ) : (
//                   <Tag color="green">متاح الآن</Tag>
//                 )}

//                 {releaseAt && (
//                   <Tooltip title="موعد الظهور">
//                     <span className="text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">
//                       {dayjs(releaseAt).format("YYYY/MM/DD HH:mm")}
//                     </span>
//                   </Tooltip>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Lesson Actions */}
//           <div
//             className="flex space-x-2 space-x-reverse ml-4 flex-shrink-0"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <DatePicker
//               showTime
//               allowClear
//               placeholder="موعد الظهور"
//               value={releaseAt ? dayjs(releaseAt) : null}
//               onChange={(val) => handleLessonReleaseChange(lesson.id, val)}
//               className="w-40"
//             />
//             <ActionButton
//               icon={<EditOutlined className="text-blue-600" />}
//               onClick={() => {
//                 setSelectedLesson(lesson);
//                 setOpenEditLesson(true);
//               }}
//             />
//             <ActionButton
//               icon={<DeleteOutlined className="text-red-600" />}
//               onClick={() => {
//                 setSelectedLesson(lesson);
//                 setOpenDeleteLesson(true);
//               }}
//             />
//           </div>
//         </div>

//         {/* Videos & Exams Section (Conditional Rendering) */}
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
//                 {/* Videos Section */}
//                 <div className="mb-6">
//                   <div className="flex justify-between items-center mb-3">
//                     <h5 className="text-md font-semibold text-gray-700 flex items-center">
//                       <PlayCircleOutlined className="ml-2 text-blue-500" />
//                       الفيديوهات ({lessonVideos.length})
//                     </h5>
//                     <button
//                       onClick={() => {
//                         setOpenAddVideo(true);
//                         setSelectedLesson(lesson);
//                       }}
//                       className="flex items-center text-sm text-green-600 hover:text-green-700"
//                     >
//                       <PlusOutlined className="ml-1" />
//                       إضافة فيديو
//                     </button>
//                   </div>

//                   {lessonVideos.length > 0 ? (
//                     <div className="space-y-2">
//                       {lessonVideos.map((video) => (
//                         <VideoCard key={video.id} video={video} />
//                       ))}
//                     </div>
//                   ) : (
//                     <p className="text-gray-400 text-center py-3 text-sm">
//                       لا توجد فيديوهات في هذا الدرس بعد.
//                     </p>
//                   )}
//                 </div>

//                 {/* Exams Section */}
//                 <div>
//                   <div className="flex justify-between items-center mb-3">
//                     <h5 className="text-md font-semibold text-gray-700 flex items-center">
//                       <FileTextOutlined className="ml-2 text-orange-500" />
//                       الاختبارات ({lessonExams.length})
//                     </h5>
//                     <button
//                       onClick={() => {
//                         router.push(`/questions/new?lessonId=${lesson?.id}`);
//                       }}
//                       className="flex items-center text-sm text-orange-600 hover:text-orange-700"
//                     >
//                       <PlusOutlined className="ml-1" />
//                       إضافة اختبار
//                     </button>
//                   </div>

//                   {lessonExams.length > 0 ? (
//                     <div className="space-y-2">
//                       {lessonExams.map((exam) => (
//                         <ExamCard
//                           key={exam.id}
//                           exam={exam}
//                           lessonId={lesson.id}
//                         />
//                       ))}
//                     </div>
//                   ) : (
//                     <p className="text-gray-400 text-center py-3 text-sm">
//                       لا توجد اختبارات في هذا الدرس بعد.
//                     </p>
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
//     const contentLessons = getLessonsByContentId(contentItem.id);

//     const releaseAt =
//       contentSchedule[contentItem.id] ??
//       contentItem.release_at ??
//       contentItem.releaseAt;
//     const opened = isReleased(releaseAt);

//     return (
//       <div className="mb-8 bg-gray-50 border border-gray-100 rounded-xl shadow-md overflow-hidden">
//         {/* Content Header (Clickable for Collapse) */}
//         <div
//           className="p-6 flex justify-between items-start border-b pb-3 cursor-pointer hover:bg-gray-100 transition duration-150"
//           onClick={() => toggleContentCollapse(contentItem.id)}
//         >
//           <div className="flex items-center flex-1 min-w-0">
//             <CaretDownOutlined
//               className={`text-2xl ml-3 text-blue-700 transition-transform duration-300 ${
//                 isContentExpanded ? "rotate-0" : "-rotate-90"
//               }`}
//             />
//             <div className="min-w-0">
//               <h3 className="text-xl font-bold text-gray-900 truncate">
//                 {contentItem.title}
//               </h3>
//               <p className="text-base text-gray-700 mt-1 truncate">
//                 {contentItem.description}
//               </p>

//               <div className="mt-2 flex items-center gap-3 flex-wrap">
//                 {releaseAt ? (
//                   opened ? (
//                     <Tag color="green">متاح</Tag>
//                   ) : (
//                     <Tag color="red">لم يُفتح بعد</Tag>
//                   )
//                 ) : (
//                   <Tag color="green">متاح الآن</Tag>
//                 )}

//                 {releaseAt && (
//                   <Tooltip title="موعد الظهور">
//                     <span className="text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">
//                       {dayjs(releaseAt).format("YYYY/MM/DD HH:mm")}
//                     </span>
//                   </Tooltip>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Content Actions */}
//           <div
//             className="flex space-x-3 space-x-reverse ml-4 flex-shrink-0"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <DatePicker
//               showTime
//               allowClear
//               placeholder="موعد ظهور المحتوى"
//               value={releaseAt ? dayjs(releaseAt) : null}
//               onChange={(val) => handleContentReleaseChange(contentItem.id, val)}
//               className="w-44"
//             />
//             <ActionButton
//               icon={<PlusOutlined className="text-green-600" />}
//               onClick={() => {
//                 setOpenAddLesson(true);
//                 setRowData(contentItem);
//               }}
//               className="text-base border border-green-200 bg-white"
//             >
//               إضافة درس
//             </ActionButton>
//             <ActionButton
//               icon={<EditOutlined className="text-blue-600" />}
//               onClick={() => {
//                 setRowData(contentItem);
//                 setEditModalContent(true);
//               }}
//             />
//             <ActionButton
//               icon={<DeleteOutlined className="text-red-600" />}
//               onClick={() => {
//                 setDeleteModalContent(true);
//                 setRowData(contentItem);
//               }}
//             />
//           </div>
//         </div>

//         {/* Lesson List (Conditional Rendering) */}
//         {isContentExpanded && (
//           <div className="p-6 pt-3">
//             {isLoading ? (
//               <div className="flex justify-center items-center py-8">
//                 <Spin spinning size="large" />
//               </div>
//             ) : contentLessons.length > 0 ? (
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

//   // Schedule Section with proper toggle
//   const ScheduleSection = () => (
//     <div className="lg:col-span-1 p-6 bg-white rounded-xl shadow-lg h-fit sticky top-4 overflow-hidden">
//       {/* Schedule Header - Clickable for Collapse */}
//       <div
//         className="flex justify-between items-center cursor-pointer pb-2 mb-2"
//         onClick={toggleScheduleCollapse}
//       >
//         <h2 className="text-xl font-bold text-blue-700 flex items-center">
//           <CalendarOutlined className="ml-2" /> جدول وتوقيت الدورة
//         </h2>
//         <CaretDownOutlined
//           className={`text-2xl text-blue-500 transition-transform duration-300 ${
//             isScheduleCollapsed ? "-rotate-90" : "rotate-0"
//           }`}
//         />
//       </div>

//       {/* Schedule Form Content (Conditional Rendering) */}
//       {!isScheduleCollapsed && (
//         <div className="space-y-4 pt-2 border-t border-gray-100">
//           <div>
//             <label
//               htmlFor="startDate"
//               className="block text-sm font-medium text-gray-700 mb-1"
//             >
//               تاريخ البدء
//             </label>
//             <input
//               type="date"
//               id="startDate"
//               name="startDate"
//               value={schedule.startDate}
//               onChange={handleScheduleChange}
//               className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
//             />
//           </div>
//           <div>
//             <label
//               htmlFor="endDate"
//               className="block text-sm font-medium text-gray-700 mb-1"
//             >
//               تاريخ الانتهاء
//             </label>
//             <input
//               type="date"
//               id="endDate"
//               name="endDate"
//               value={schedule.endDate}
//               onChange={handleScheduleChange}
//               className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
//             />
//           </div>
//           <div>
//             <label
//               htmlFor="startTime"
//               className="block text-sm font-medium text-gray-700 mb-1"
//             >
//               وقت البدء
//             </label>
//             <input
//               type="time"
//               id="startTime"
//               name="startTime"
//               value={schedule.startTime}
//               onChange={handleScheduleChange}
//               className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
//             />
//           </div>
//           <div>
//             <label
//               htmlFor="endTime"
//               className="block text-sm font-medium text-gray-700 mb-1"
//             >
//               وقت الانتهاء
//             </label>
//             <input
//               type="time"
//               id="endTime"
//               name="endTime"
//               value={schedule.endTime}
//               onChange={handleScheduleChange}
//               className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
//             />
//           </div>
//           <p className="text-xs text-gray-500 mt-4 border-t pt-3">
//             **ملاحظة:** سيتم تطبيق هذه الأوقات على جميع دروس هذه الدورة (يمكنك
//             لاحقاً تخصيص مواعيد فتح كل قسم ودرس من اليسار).
//           </p>
//         </div>
//       )}
//     </div>
//   );

//   const handleDeleteExam = (lessonId, examId) => {
//     if (window.confirm("هل أنت متأكد من حذف هذا الاختبار؟")) {
//       // Implement delete exam API call
//       console.log("Delete exam:", examId, "from lesson:", lessonId);
//     }
//   };

//   return (
//     <div
//       className="p-4 sm:p-8 bg-gradient-to-br from-gray-50 to-white min-h-screen"
//       dir="rtl"
//     >
//       {/* Page Header */}
//       <div className="max-w-6xl mx-auto mb-8 p-6 bg-white rounded-2xl shadow-xl border-b-4 border-blue-500">
//         <h1 className="text-3xl font-extrabold text-gray-800">
//           إدارة محتوى الدورة | المستوى الأساسي
//         </h1>
//         <p className="text-gray-600 mt-1">
//           تنظيم المناهج، الدروس، والفيديوهات وتحديد جدول الدورة.
//         </p>
//       </div>

//       {/* Main Grid Layout */}
//       <div className="max-w-6xl mx-auto  gap-8">
//         {/* Scheduling Panel */}
//         {/* <ScheduleSection /> */}

//         {/* Course Content Structure */}
//         <div className="lg:col-span-2">
//           <div className="flex justify-between items-center mb-6">
//             <h2 className="text-2xl font-bold text-gray-800">
//               هيكل المحتوى والمناهج
//             </h2>
//             <button
//               onClick={() => setAddModalContent(true)}
//               className="flex items-center px-4 py-2 text-white bg-green-600 rounded-lg shadow-md hover:bg-green-700 transition duration-150"
//             >
//               <PlusOutlined className="ml-2" /> إضافة محتوى رئيسي
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
//       <AddRoundContent
//         open={addModalContent}
//         setOpen={setAddModalContent}
//         id={id}
//       />
//       <EditRoundContent
//         open={editModalContent}
//         setOpen={setEditModalContent}
//         id={id}
//         rowData={rowData}
//         setRowData={setRowData}
//       />
//       <DeleteRoundContent
//         id={id}
//         open={deleteModalContent}
//         setOpen={setDeleteModalContent}
//         rowData={rowData}
//       />

//       <AddLessonModal
//         open={openAddLesson}
//         setOpen={setOpenAddLesson}
//         round_content_id={rowData?.id}
//       />
//       <DeleteLessonModal
//         open={openDeleteLesson}
//         setOpen={setOpenDeleteLesson}
//         rowData={selectedLesson}
//         setRowData={setSelectedLesson}
//       />
//       <EditLessonModal
//         open={openEditLesson}
//         setOpen={setOpenEditLesson}
//         rowData={selectedLesson}
//         setRowData={setSelectedLesson}
//       />

//       <AddVideoModal
//         open={openAddVideo}
//         setOpen={setOpenAddVideo}
//         id={rowData?.id}
//       />

//       <EditVideoModal
//         open={openEditVideo}
//         setOpen={setOpenEditVideo}
//         rowData={selectedVideo}
//         setRowData={setSelectedVideo}
//         id={selectedLesson?.id}
//       />

//       <DeleteVideoModal
//         open={openDeleteVideo}
//         setOpen={setOpenDeleteVideo}
//         rowData={selectedVideo}
//         setRowData={setSelectedVideo}
//       />
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
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { handleGetAllRoundContent } from "../../lib/features/roundContentSlice";
import { useRouter } from "next/navigation";
import { Spin, DatePicker, Tag, Tooltip } from "antd";
import dayjs from "dayjs";
import AddRoundContent from "../RoundContent/AddRoundContent";
import DeleteRoundContent from "../RoundContent/DeleteRoundContent";
import EditRoundContent from "../RoundContent/EditRoundContent";

// ✅ we will still reuse the existing thunk to fetch videos, but now by content
import { handleGetAllLessonVideo } from "../../lib/features/videoSlice";
import AddVideoModal from "../RoundContent/Videos/AddVideoModal";
import EditVideoModal from "../RoundContent/Videos/EditVideoModal";
import DeleteVideoModal from "../RoundContent/Videos/DeleteVideoModal";

const initialSchedule = {
  startDate: "2025-12-01",
  endDate: "2025-12-31",
  startTime: "09:00",
  endTime: "11:00",
};

export default function CourseSourceBasicLevel({ id }) {
  const [rowData, setRowData] = useState({});
  const [schedule, setSchedule] = useState(initialSchedule);
  const [isScheduleCollapsed, setIsScheduleCollapsed] = useState(false);

  // per content release times (local state, can be synced with backend)
  const [contentSchedule, setContentSchedule] = useState({});

  // Modals (content)
  const [addModalContent, setAddModalContent] = useState(false);
  const [deleteModalContent, setDeleteModalContent] = useState(false);
  const [editModalContent, setEditModalContent] = useState(false);

  // Modals (videos)
  const [openAddVideo, setOpenAddVideo] = useState(false);
  const [openEditVideo, setOpenEditVideo] = useState(false);
  const [openDeleteVideo, setOpenDeleteVideo] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState({});

  const router = useRouter();
  const dispatch = useDispatch();

  const { all_content_list } = useSelector((state) => state?.content);
  const { all_videos_list } = useSelector((state) => state?.videos);

  // Track which content sections are expanded and their loading states
  const [expandedContents, setExpandedContents] = useState({});
  const [loadingContents, setLoadingContents] = useState({});

  const [basicData, setBasicData] = useState([]);

  // helper to know if something is "released" based on its datetime
  const isReleased = useCallback((releaseAt) => {
    if (!releaseAt) return true; // if no schedule -> always available
    return dayjs(releaseAt).isBefore(dayjs());
  }, []);

  // === Fetch basic content ===
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
    console.log(all_content_list?.data?.message?.content , all_content_list?.data?.message)
    setBasicData(
      all_content_list?.data?.message?.content?.filter(
        (item) => item?.content_type == "basic"
      ) || []
    );
  }, [all_content_list]);

  // === Videos helpers ===

  // Get videos for specific content (now videos are directly under content)
  const getVideosByContentId = useCallback(
    (contentId) => {
      return (
        all_videos_list?.data?.message?.filter(
          // 🔁 adjust this field name if your backend uses something else
          (item) => item?.round_content_id === contentId
        ) || []
      );
    },
    [all_videos_list]
  );

  function handleScheduleChange(e) {
    const { name, value } = e.target;
    setSchedule((prev) => ({
      ...prev,
      [name]: value,
    }));
    // TODO: here you can also call an API to save course-level schedule
  }

  const handleContentReleaseChange = (contentId, value) => {
    const release_at = value ? value.toISOString() : null;

    setContentSchedule((prev) => ({
      ...prev,
      [contentId]: release_at,
    }));

    // TODO: call your API / Redux action here to persist:
    // dispatch(updateRoundContentRelease({ id: contentId, release_at }));
  };

  // --- Toggle Handlers ---

  const toggleContentCollapse = async (contentId) => {
    const isCurrentlyExpanded = expandedContents[contentId];

    // Toggle the expanded state
    setExpandedContents((prev) => ({
      ...prev,
      [contentId]: !isCurrentlyExpanded,
    }));

    // If we're expanding and haven't loaded videos yet, fetch them
    if (!isCurrentlyExpanded) {
      setLoadingContents((prev) => ({
        ...prev,
        [contentId]: true,
      }));

      try {
        // 🔁 Existing thunk, but now we treat it as "videos for content"
        await dispatch(
          handleGetAllLessonVideo({
            body: {
              // backend should accept round_content_id (or adjust accordingly)
              round_content_id: contentId,
            },
          })
        );
      } catch (error) {
        console.error("Error fetching videos:", error);
      } finally {
        setLoadingContents((prev) => ({
          ...prev,
          [contentId]: false,
        }));
      }
    }
  };

  const toggleScheduleCollapse = () => {
    setIsScheduleCollapsed((prev) => !prev);
  };

  const ActionButton = ({ icon, onClick, className = "", children }) => (
    <button
      onClick={onClick}
      className={`p-1 text-sm rounded-full transition duration-150 hover:bg-gray-200 ${className}`}
    >
      {icon}
      {children}
    </button>
  );

  // Video Card Renderer (now fully controlled via props)
  const VideoCard = ({ video, onEdit, onDelete }) => {
    const isFree = video?.free === "1";

    return (
      <div className="bg-blue-50/70 p-4 mb-3 rounded-lg border border-blue-100 flex justify-between items-start">
        <div className="flex items-start flex-1 min-w-0">
          <PlayCircleOutlined className="text-blue-600 text-lg mt-1 ml-3 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="font-medium text-gray-800 truncate">
                {video?.title}
              </p>
              {isFree && (
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                  مجاني
                </span>
              )}
            </div>
            <p className="text-gray-600 text-sm mt-1">{video?.description}</p>
            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
              <span>⏱️ {video?.time}</span>
              {video?.video && (
                <a
                  href={video?.video}
                  target="_blank"
                  rel="noreferrer"
                  className="truncate max-w-xs text-blue-600 hover:text-blue-700"
                >
                  {video.video}
                </a>
              )}
            </div>
          </div>
        </div>
        <div className="flex space-x-2 space-x-reverse ml-4 flex-shrink-0">
          <ActionButton
            icon={<EditOutlined className="text-blue-600" />}
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.();
            }}
          />
          <ActionButton
            icon={<DeleteOutlined className="text-red-600" />}
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.();
            }}
          />
        </div>
      </div>
    );
  };

  // Exam Card Renderer (now directly under content)
  const ExamCard = ({ exam, onDelete }) => (
    <div className="bg-orange-50/70 p-4 mb-3 rounded-lg border border-orange-100 flex justify-between items-start">
      <div className="flex items-start flex-1 min-w-0">
        <FileTextOutlined className="text-orange-600 text-lg mt-1 ml-3 flex-shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="font-medium text-gray-800 truncate">{exam.title}</p>
          <p className="text-gray-600 text-sm mt-1">{exam.description}</p>
          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
            <span>⏱️ {exam.duration} دقيقة</span>
            <span>❓ {exam.questions} أسئلة</span>
          </div>
        </div>
      </div>
      <div className="flex space-x-2 space-x-reverse ml-4 flex-shrink-0">
        <ActionButton
          icon={<EditOutlined className="text-blue-600" />}
          onClick={(e) => {
            e.stopPropagation();
            // Handle exam edit (to be implemented)
          }}
        />
        <ActionButton
          icon={<DeleteOutlined className="text-red-600" />}
          onClick={(e) => {
            e.stopPropagation();
            onDelete?.();
          }}
        />
      </div>
    </div>
  );

  // Content Section Renderer (videos + exams directly here)
  const ContentSection = ({ contentItem }) => {
    const isContentExpanded = expandedContents[contentItem.id];
    const isLoading = loadingContents[contentItem.id];

    const releaseAt =
      contentSchedule[contentItem.id] ??
      contentItem.release_at ??
      contentItem.releaseAt;
    const opened = isReleased(releaseAt);

    // Videos directly under this content
    const contentVideos = getVideosByContentId(contentItem.id);

    // 🔁 Placeholder exams array (replace with real API data)
    const contentExams= [];

    return (
      <div className="mb-8 bg-gray-50 border border-gray-100 rounded-xl shadow-md overflow-hidden">
        {/* Content Header (Clickable for Collapse) */}
        <div
          className="p-6 flex justify-between items-start border-b pb-3 cursor-pointer hover:bg-gray-100 transition duration-150"
          onClick={() => toggleContentCollapse(contentItem.id)}
        >
          <div className="flex items-center flex-1 min-w-0">
            <CaretDownOutlined
              className={`text-2xl ml-3 text-blue-700 transition-transform duration-300 ${
                isContentExpanded ? "rotate-0" : "-rotate-90"
              }`}
            />
            <div className="min-w-0">
              <h3 className="text-xl font-bold text-gray-900 truncate">
                {contentItem.content_title}
              </h3>
              <p className="text-base text-gray-700 mt-1 truncate">
                {contentItem.content_description}
              </p>

              <div className="mt-2 flex items-center gap-3 flex-wrap">
                {releaseAt ? (
                  opened ? (
                    <Tag color="green">متاح</Tag>
                  ) : (
                    <Tag color="red">لم يُفتح بعد</Tag>
                  )
                ) : (
                  <Tag color="green">متاح الآن</Tag>
                )}

                {releaseAt && (
                  <Tooltip title="موعد الظهور">
                    <span className="text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">
                      {dayjs(releaseAt).format("YYYY/MM/DD HH:mm")}
                    </span>
                  </Tooltip>
                )}
              </div>
            </div>
          </div>

          {/* Content Actions */}
          <div
            className="flex space-x-3 space-x-reverse ml-4 flex-shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <DatePicker
              showTime
              allowClear
              placeholder="موعد ظهور المحتوى"
              value={releaseAt ? dayjs(releaseAt) : null}
              onChange={(val) => handleContentReleaseChange(contentItem.id, val)}
              className="w-44"
            />
            <ActionButton
              icon={<PlusOutlined className="text-green-600" />}
              onClick={() => {
                setRowData(contentItem);
                setOpenAddVideo(true);
              }}
              className="text-base border border-green-200 bg-white"
            >
              إضافة فيديو
            </ActionButton>
            <ActionButton
              icon={<EditOutlined className="text-blue-600" />}
              onClick={() => {
                setRowData(contentItem);
                setEditModalContent(true);
              }}
            />
            <ActionButton
              icon={<DeleteOutlined className="text-red-600" />}
              onClick={() => {
                setRowData(contentItem);
                setDeleteModalContent(true);
              }}
            />
          </div>
        </div>

        {/* Videos & Exams for this content */}
        {isContentExpanded && (
          <div className="p-6 pt-3">
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <Spin spinning size="large" />
              </div>
            ) : !opened ? (
              <p className="text-center text-gray-400">
                هذا القسم لم يُفتح بعد طبقاً لجدول الدورة.
              </p>
            ) : (
              <>
                {/* Videos Section */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-3">
                    <h5 className="text-md font-semibold text-gray-700 flex items-center">
                      <PlayCircleOutlined className="ml-2 text-blue-500" />
                      الفيديوهات ({contentVideos.length})
                    </h5>
                    <button
                      onClick={() => {
                        setRowData(contentItem);
                        setOpenAddVideo(true);
                      }}
                      className="flex items-center text-sm text-green-600 hover:text-green-700"
                    >
                      <PlusOutlined className="ml-1" />
                      إضافة فيديو
                    </button>
                  </div>

                  {contentVideos.length > 0 ? (
                    <div className="space-y-2">
                      {contentVideos.map((video) => (
                        <VideoCard
                          key={video.id}
                          video={video}
                          onEdit={() => {
                            setSelectedVideo(video);
                            setRowData(contentItem);
                            setOpenEditVideo(true);
                          }}
                          onDelete={() => {
                            setSelectedVideo(video);
                            setOpenDeleteVideo(true);
                          }}
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 text-center py-3 text-sm">
                      لا توجد فيديوهات في هذا المحتوى بعد.
                    </p>
                  )}
                </div>

                {/* Exams Section (direct under content) */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h5 className="text-md font-semibold text-gray-700 flex items-center">
                      <FileTextOutlined className="ml-2 text-orange-500" />
                      الاختبارات ({contentExams.length})
                    </h5>
                    <button
                      onClick={() => {
                        router.push(
                          `/questions/new?contentId=${contentItem?.id}`
                        );
                      }}
                      className="flex items-center text-sm text-orange-600 hover:text-orange-700"
                    >
                      <PlusOutlined className="ml-1" />
                      إضافة اختبار
                    </button>
                  </div>

                  {contentExams.length > 0 ? (
                    <div className="space-y-2">
                      {contentExams.map((exam) => (
                        <ExamCard
                          key={exam.id}
                          exam={exam}
                          onDelete={() => handleDeleteExam(contentItem.id, exam.id)}
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 text-center py-3 text-sm">
                      لا توجد اختبارات في هذا المحتوى بعد.
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    );
  };

  // (Optional) Schedule Section – still ready if you want to re-enable it
  const ScheduleSection = () => (
    <div className="lg:col-span-1 p-6 bg-white rounded-xl shadow-lg h-fit sticky top-4 overflow-hidden">
      <div
        className="flex justify-between items-center cursor-pointer pb-2 mb-2"
        onClick={toggleScheduleCollapse}
      >
        <h2 className="text-xl font-bold text-blue-700 flex items-center">
          <CalendarOutlined className="ml-2" /> جدول وتوقيت الدورة
        </h2>
        <CaretDownOutlined
          className={`text-2xl text-blue-500 transition-transform duration-300 ${
            isScheduleCollapsed ? "-rotate-90" : "rotate-0"
          }`}
        />
      </div>

      {!isScheduleCollapsed && (
        <div className="space-y-4 pt-2 border-t border-gray-100">
          <div>
            <label
              htmlFor="startDate"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              تاريخ البدء
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={schedule.startDate}
              onChange={handleScheduleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="endDate"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              تاريخ الانتهاء
            </label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={schedule.endDate}
              onChange={handleScheduleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="startTime"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              وقت البدء
            </label>
            <input
              type="time"
              id="startTime"
              name="startTime"
              value={schedule.startTime}
              onChange={handleScheduleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="endTime"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              وقت الانتهاء
            </label>
            <input
              type="time"
              id="endTime"
              name="endTime"
              value={schedule.endTime}
              onChange={handleScheduleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <p className="text-xs text-gray-500 mt-4 border-t pt-3">
            **ملاحظة:** سيتم تطبيق هذه الأوقات على جميع محتوى هذه الدورة (ويمكنك
            لاحقاً تخصيص مواعيد فتح كل قسم من اليسار).
          </p>
        </div>
      )}
    </div>
  );

  const handleDeleteExam = (contentId, examId) => {
    if (window.confirm("هل أنت متأكد من حذف هذا الاختبار؟")) {
      // Implement delete exam API call here
      console.log("Delete exam:", examId, "from content:", contentId);
    }
  };

  return (
    <div
      className="p-4 sm:p-8 bg-gradient-to-br from-gray-50 to-white min-h-screen"
      dir="rtl"
    >
      {/* Page Header */}
      <div className="max-w-6xl mx-auto mb-8 p-6 bg-white rounded-2xl shadow-xl border-b-4 border-blue-500">
        <h1 className="text-3xl font-extrabold text-gray-800">
          إدارة محتوى الدورة | المستوى الأساسي
        </h1>
        <p className="text-gray-600 mt-1">
          تنظيم المناهج، الفيديوهات، والاختبارات وتحديد جدول الدورة.
        </p>
      </div>

      {/* Main Layout */}
      <div className="max-w-6xl mx-auto gap-8">
        {/* لو حبيت ترجع الجدول، فك الكومنت ده */}
        {/* <ScheduleSection /> */}

        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              هيكل المحتوى والمناهج
            </h2>
            <button
              onClick={() => setAddModalContent(true)}
              className="flex items-center px-4 py-2 text-white bg-green-600 rounded-lg shadow-md hover:bg-green-700 transition duration-150"
            >
              <PlusOutlined className="ml-2" /> إضافة محتوى رئيسي
            </button>
          </div>

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

      {/* Content Modals */}
      <AddRoundContent
        open={addModalContent}
        setOpen={setAddModalContent}
        id={id}
      />
      <EditRoundContent
        open={editModalContent}
        setOpen={setEditModalContent}
        id={id}
        rowData={rowData}
        setRowData={setRowData}
      />
      <DeleteRoundContent
        id={id}
        open={deleteModalContent}
        setOpen={setDeleteModalContent}
        rowData={rowData}
      />

      {/* Video Modals (content-level) */}
      <AddVideoModal
        open={openAddVideo}
        setOpen={setOpenAddVideo}
        id={rowData?.id} // round_content_id
      />

      <EditVideoModal
        open={openEditVideo}
        setOpen={setOpenEditVideo}
        rowData={selectedVideo}
        setRowData={setSelectedVideo}
        id={rowData?.id} // content id; adjust if modal expects something else
      />

      <DeleteVideoModal
        open={openDeleteVideo}
        setOpen={setOpenDeleteVideo}
        rowData={selectedVideo}
        setRowData={setSelectedVideo}
      />
    </div>
  );
}
