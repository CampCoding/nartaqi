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
import { Clock, Eye, FileIcon, VideoIcon } from "lucide-react";
import { handleActiveLive, handleMarkLiveAsFinish } from "../../lib/features/livesSlice";
import { toast } from "react-toastify";
import AddExamVideoModal from "../RoundContent/Exams/AddExamVideoModal";
import EditExamVideoModal from "../RoundContent/Exams/EditExamVideoModal";
import DeleteExamVideoModal from "../RoundContent/Exams/DeleteExamVideoModal";
import AddExamPdfModal from "../RoundContent/Exams/AddExamPdfModal";
import DeleteExamPdfModal from "../RoundContent/Exams/DeleteExamPdfModal";
import EditExamPdfModal from "../RoundContent/Exams/EditExamPdfModal";

const initialSchedule = {
  startDate: "2025-12-01",
  endDate: "2025-12-31",
  startTime: "09:00",
  endTime: "11:00",
};

export default function CourseSourceBasicLevel({ id }) {
  const [rowData, setRowData] = useState({});
  const [contentSchedule, setContentSchedule] = useState({});
  const [lessonSchedule, setLessonSchedule] = useState({});

  // Modal states...
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

  const toggleLessonCollapse = async (lessonId) => {
    const isCurrentlyExpanded = expandedLessons[lessonId];
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

  useEffect(() => {
    if (selectedContent) {
      dispatch(handleGetAllRoundLessons({
        body: {
          round_content_id: selectedContent
        }
      }));
    }
  }, [selectedContent]);

  const ActionButton = ({ disabled ,icon, title, onClick, className = "", children }) => (
    <button
     disabled={disabled}
      title={title || ""}
      onClick={onClick}
      className={`p-1 text-sm rounded-full transition duration-150 hover:bg-gray-200 ${className}`}
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
              <p className="font-medium text-gray-800 truncate">
                {video?.title}
              </p>
              {isFree && (
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                  مجاني
                </span>
              )}
              {isExamVideo && (
                <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                  فيديو اختبار
                </span>
              )}
            </div>
            <p className="text-gray-600 text-sm mt-1">{video?.description}</p>
            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
              {/* <span>⏱️ {video?.time}</span> */}
              {video?.video_url && (
                <a
                  href={video?.video_url}
                  target="_blank"
                  rel="noreferrer"
                  className="truncate max-w-xs text-blue-600 hover:text-blue-700"
                >
                  {video.video_url}
                </a>
              )}
            </div>
          </div>
        </div>
        <div className="flex space-x-2 space-x-reverse ml-4 flex-shrink-0">
          <ActionButton
            title="تعديل الفيديو"
            icon={<EditOutlined className="text-blue-600" />}
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
          />
          <ActionButton
            title="حذف الفيديو"
            icon={<DeleteOutlined className="text-red-600" />}
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
          />
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
              <p className="font-medium text-gray-800 truncate">
                {pdf?.title}
              </p>
              <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                ملف PDF
              </span>
            </div>
            <p className="text-gray-600 text-sm mt-1">{pdf?.description}</p>
            <div className="mt-2 text-xs text-gray-500">
              {pdf?.pdf_url && (
                <a
                  href={pdf?.pdf_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  <FileIcon className="w-3 h-3" />
                  عرض الملف
                </a>
              )}
            </div>
          </div>
        </div>
        <div className="flex space-x-2 space-x-reverse ml-4 flex-shrink-0">
          <ActionButton
            title="تعديل الملف"
            icon={<EditOutlined className="text-blue-600" />}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedExamPdf(pdf);
              setOpenEditExamPdf(true);
            }}
          />
          <ActionButton
            title="حذف الملف"
            icon={<DeleteOutlined className="text-red-600" />}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedExamPdf(pdf);
              setOpenDeleteExamPdf(true);
            }}
          />
        </div>
      </div>
    );
  };

  // Exam Card Renderer
  const ExamCard = ({ exam, lessonId }) => {
    console.log(exam?.videos);
    const isExamExpanded = expandedExams[exam.id];
    
    return (
      <div className="bg-orange-50/70 p-4 mb-3 rounded-lg border border-orange-100">
        {/* Exam Header */}
        <div 
          className="flex justify-between items-start cursor-pointer mb-3"
          onClick={() => toggleExamCollapse(exam.id)}
        >
          <div className="flex items-start flex-1 min-w-0">
            <CaretDownOutlined
              className={`text-xl ml-3 text-orange-500 transition-transform duration-300 ${
                isExamExpanded ? "rotate-0" : "-rotate-90"
              }`}
            />
            <div className="min-w-0 flex-1">
              <p className="font-medium text-gray-800 truncate">{exam?.exam?.title}</p>
              <p className="text-gray-600 text-sm mt-1">{exam?.exam?.description}</p>
            </div>
          </div>
          <div 
            className="flex space-x-2 space-x-reverse ml-4 flex-shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <ActionButton
              title="تعديل الاختبار"
              icon={<EditOutlined className="text-blue-600" />}
              onClick={() => {
                // Handle exam edit
                // You can add edit exam modal here
              }}
            />
            <ActionButton
              title="حذف الاختبار"
              icon={<DeleteOutlined className="text-red-600" />}
              onClick={() => {
                if (window.confirm("هل أنت متأكد من حذف هذا الاختبار؟")) {
                  // Handle exam deletion
                  console.log("Delete exam:", exam.id);
                }
              }}
            />
          </div>
        </div>

        {/* Exam Expanded Content */}
        {isExamExpanded && (
          <div className="mt-4 border-t pt-4">
            {/* Videos Section */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <h5 className="text-md font-semibold text-gray-700 flex items-center">
                  <VideoIcon className="ml-2 text-blue-500 w-4 h-4" />
                  فيديوهات الاختبار ({exam.videos?.length || 0})
                </h5>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedExam(exam?.exam?.id);
                    setOpenAddExamVideo(true);
                  }}
                  className="flex items-center text-sm text-green-600 hover:text-green-700"
                >
                  <PlusOutlined className="ml-1" />
                  إضافة فيديو
                </button>
              </div>
              
              {exam.videos && exam.videos.length > 0 ? (
                <div className="space-y-2">
                  {exam.videos.map((video) => (
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
                  ملفات PDF ({exam.pdfs?.length || 0})
                </h5>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedExam(exam?.exam);
                    setOpenAddExamPdf(true);
                  }}
                  className="flex items-center text-sm text-green-600 hover:text-green-700"
                >
                  <PlusOutlined className="ml-1" />
                  إضافة ملف PDF
                </button>
              </div>
              
              {exam?.exam_pdfs && exam?.exam_pdfs.length > 0 ? (
                <div className="space-y-2">
                  {exam?.exam_pdfs.map((pdf) => (
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

  const handleActivateLive = (liveId, isActive) => {
    const body = { id: liveId, active: isActive ? "0" : "1" };
    dispatch(handleActiveLive({ body }))
    .unwrap()
    .then(res =>{ 
      console.log(res)
      if(res?.data?.status == "success") {
        toast.success(res?.data?.message);
        dispatch(handleGetAllRoundContent({body : {
          round_id : id
        }}))
      }else {
        toast.error("هناك مشكله اُثناء تعديل حالة البث" || res?.data?.message )
      }
    }).catch(e => console.log(e))
  };

  const handleMarkAsFinished = (liveId) => {
    const body = { id: liveId };
    dispatch(handleMarkLiveAsFinish({ body }))
    .unwrap()
    .then(res => {
      console.log(res);
      if(res?.data?.status == "success") {
        toast.success(res?.data?.message);
        dispatch(handleGetAllRoundContent({body : {
          round_id : id
        }}))
      }else {
        toast.error("هناك مشكله اُثناء تعديل حالة البث" || res?.data?.message )
      }
    })
  };

  const LiveSessionCard = ({ live }) => {
    const isLiveActive = live?.active === "1";

    return (
      <div className="bg-yellow-50/70 p-4 mb-3 rounded-lg border border-yellow-100 flex justify-between items-start">
        <div className="flex items-start flex-1 min-w-0">
          <CalendarOutlined className="text-yellow-600 text-lg mt-1 ml-3 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="font-medium text-gray-800 truncate">{live?.title}</p>
              {isLiveActive && (
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">نشط</span>
              )}
            </div>
            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
              <span>⏱️ {live?.time}</span>
              {live?.link && (
                <a href={live?.link} target="_blank" rel="noreferrer" className="truncate max-w-xs text-blue-600 hover:text-blue-700">
                  {live?.link}
                </a>
              )}
            </div>
          </div>
        </div>
        <div className="flex space-x-2 space-x-reverse ml-4 flex-shrink-0">
          <ActionButton
            title="تعديل البث المباشر"
            icon={<EditOutlined className="text-blue-600" />}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedLive(live);
              setOpenEditLive(true);
            }}
          />
          <ActionButton
            title="حذف البث المباشر"
            icon={<DeleteOutlined className="text-red-600" />}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedLive(live);
              setOpenDeleteLive(true);
            }}
          />
          <ActionButton
            title={isLiveActive ? "إلغاء تنشيط البث" : "تنشيط البث"}
            icon={<Eye className="text-green-600 h-4 w-4"/>}
            onClick={(e) => {
              e.stopPropagation();
              handleActivateLive(live?.id, isLiveActive);
            }}
          />
          <ActionButton
           disabled={live?.finished}
            title="انهاء البث"
            icon={<Clock className="text-yellow-600 w-4 h-4" />}
            onClick={(e) => {
              e.stopPropagation();
              handleMarkAsFinished(live?.id);
            }}
          />
        </div>
      </div>
    );
  };

  // Lesson Card Renderer
  const LessonCard = ({ lesson }) => {
    const isLessonExpanded = expandedLessons[lesson.id];
    const isLoadingVideos = loadingLessons[lesson.id];
    const lessonVideos = lesson?.videos;

    const releaseAt =
      lessonSchedule[lesson.id] ?? lesson.release_at ?? lesson.releaseAt;
    const released = isReleased(releaseAt);

    const lessonExams = lesson?.exam_all_data;

    return (
      <div className="mb-4 bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        {/* Lesson Header */}
        <div
          className="p-4 flex justify-between items-start cursor-pointer hover:bg-gray-50 transition duration-150"
          onClick={() => toggleLessonCollapse(lesson.id)}
        >
          <div className="flex items-center flex-1 min-w-0">
            <CaretDownOutlined
              className={`text-xl ml-3 text-blue-500 transition-transform duration-300 ${
                isLessonExpanded ? "rotate-0" : "-rotate-90"
              }`}
            />
            <div className="min-w-0">
              <h4 className="text-lg font-semibold text-gray-800 truncate">
                {lesson?.lesson_title}
              </h4>
              <p className="text-sm text-gray-600 mt-1 truncate">
                {lesson.lesson_description}
              </p>

              <div className="mt-2 flex items-center gap-3 flex-wrap">
                {releaseAt ? (
                  released ? (
                    <Tag color="green">متاح</Tag>
                  ) : (
                    <Tag color="red">لم يُفتح بعد</Tag>
                  )
                ) : (
                  <Tag color="green">متاح الآن</Tag>
                )}
              </div>
            </div>
          </div>

          {/* Lesson Actions */}
          <div
            className="flex space-x-2 space-x-reverse ml-4 flex-shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <ActionButton
              title="تعديل الدرس"
              icon={<EditOutlined className="text-blue-600" />}
              onClick={() => {
                setSelectedLesson(lesson);
                setOpenEditLesson(true);
              }}
            />
            <ActionButton
              title="حذف الدرس"
              icon={<DeleteOutlined className="text-red-600" />}
              onClick={() => {
                setSelectedLesson(lesson);
                setOpenDeleteLesson(true);
              }}
            />
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
                {/* Videos Section */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-3">
                    <h5 className="text-md font-semibold text-gray-700 flex items-center">
                      <PlayCircleOutlined className="ml-2 text-blue-500" />
                      الفيديوهات ({lessonVideos?.length || 0})
                    </h5>
                    <button
                      onClick={() => {
                        setOpenAddVideo(true);
                        setSelectedLesson(lesson);
                      }}
                      className="flex items-center text-sm text-green-600 hover:text-green-700"
                    >
                      <PlusOutlined className="ml-1" />
                      إضافة فيديو
                    </button>
                  </div>

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

                {/* Exams Section */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-3">
                    <h5 className="text-md font-semibold text-gray-700 flex items-center">
                      <FileTextOutlined className="ml-2 text-orange-500" />
                      الاختبارات ({lessonExams?.length || 0})
                    </h5>
                    <button
                      onClick={() => {
                        router.push(`/questions/new?lessonId=${lesson?.id}`);
                      }}
                      className="flex items-center text-sm text-orange-600 hover:text-orange-700"
                    >
                      <PlusOutlined className="ml-1" />
                      إضافة اختبار
                    </button>
                  </div>

                  {lessonExams && lessonExams.length > 0 ? (
                    <div className="space-y-2">
                      {lessonExams.map((exam) => (
                        <ExamCard
                          key={exam.id}
                          exam={exam}
                          lessonId={lesson.id}
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 text-center py-3 text-sm">
                      لا توجد اختبارات في هذا الدرس بعد.
                    </p>
                  )}
                </div>

                {/* Live Sessions Section */}
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h5 className="text-md font-semibold text-gray-700 flex items-center">
                      <CalendarOutlined className="ml-2 text-yellow-500" />
                      البث المباشر ({lesson?.live?.length || 0})
                    </h5>
                    <button
                      onClick={() => {
                        setOpenAddLive(true);
                        setRowData(lesson);
                      }}
                      className="flex items-center px-4 py-2 text-green-600 rounded-lg transition duration-150"
                    >
                      <PlusOutlined className="ml-2" /> إضافة جلسة مباشرة
                    </button>
                  </div>

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
            <ActionButton
              icon={<PlusOutlined className="text-green-600" />}
              onClick={() => {
                setOpenAddLesson(true);
                setRowData(contentItem);
              }}
              className="text-base border border-green-200 bg-white"
            >
              إضافة درس
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
                setDeleteModalContent(true);
                setRowData(contentItem);
              }}
            />
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
          تنظيم المناهج، الدروس، والفيديوهات وتحديد جدول الدورة.
        </p>
      </div>

      {/* Main Grid Layout */}
      <div className="max-w-6xl mx-auto gap-8">
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

      <AddLessonModal
        id={id}
        open={openAddLesson}
        setOpen={setOpenAddLesson}
        round_content_id={rowData?.id}
        type={rowData?.content_type}
      />
      <DeleteLessonModal
        open={openDeleteLesson}
        setOpen={setOpenDeleteLesson}
        rowData={selectedLesson}
        setRowData={setSelectedLesson}
      />
      <EditLessonModal
        open={openEditLesson}
        setOpen={setOpenEditLesson}
        rowData={selectedLesson}
        setRowData={setSelectedLesson}
      />

      <AddVideoModal
        open={openAddVideo}
        setOpen={setOpenAddVideo}
        id={selectedLesson?.id}
        content_id={id}
      />
      <EditVideoModal
        open={openEditVideo}
        setOpen={setOpenEditVideo}
        rowData={selectedVideo}
        setRowData={setSelectedVideo}
        id={selectedLesson?.id}
      />
      <DeleteVideoModal
        open={openDeleteVideo}
        setOpen={setOpenDeleteVideo}
        rowData={selectedVideo}
        setRowData={setSelectedVideo}
      />

      <AddLivesModal open={openAddLive} setOpen={setOpenAddLive} id={id} lesson_id={rowData?.id} />
      <EditLivesModal open={openEditLive} lesson_id={selectedLive?.id} id={id} setOpen={setOpenEditLive} rowData={selectedLive} setRowData={setSelectedLive} />
      <DeleteLivesModal round_id={id} open={openDeleteLive} setOpen={setOpenDeleteLive} rowData={selectedLive} setRowData={setSelectedLive} />

      <AddExamVideoModal
        open={openAddExamVideo}
        setOpen={setOpenAddExamVideo}
        exam_id={selectedExam}
        id={id}
        lesson_id={selectedExam?.lesson_id}
      />

      <EditExamVideoModal
        open={openEditExamVideo}
        setOpen={setOpenEditExamVideo}
        rowData={selectedExamVideo}
        setRowData={setSelectedExamVideo}
        exam_id={selectedExam}
        id={id}
      />

      <DeleteExamVideoModal
        open={openDeleteExamVideo}
        setOpen={setOpenDeleteExamVideo}
        rowData={selectedExamVideo}
        setRowData={setSelectedExamVideo}
        id={id}
      />
      
      <AddExamPdfModal
        open={openAddExamPdf}
        setOpen={setOpenAddExamPdf}
        exam_id={selectedExam}
        lesson_id={selectedExam?.lesson_id}
        id={id}
      />

      <EditExamPdfModal id={id} exam_id={selectedExam} open={openEditExamPdf} setOpen={setOpenEditExamPdf} pdfData={selectedExamPdf}/>

      <DeleteExamPdfModal
        open={openDeleteExamPdf}
        setOpen={setOpenDeleteExamPdf}
        rowData={selectedExamPdf}
        setRowData={setSelectedExamPdf}
        id={id}
      />
    </div>
  );
}