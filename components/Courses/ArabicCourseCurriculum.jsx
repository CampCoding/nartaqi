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
import { Spin, Tag, Tooltip } from "antd";
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
import { FileIcon, VideoIcon } from "lucide-react";
import {
  handleActiveLive,
  handleMarkLiveAsFinish,
} from "../../lib/features/livesSlice";
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

export default function ArabicCourseCurriculum({ id }) {
  const [rowData, setRowData] = useState({});
  const [contentSchedule, setContentSchedule] = useState({});
  const [lessonSchedule, setLessonSchedule] = useState({});
  const [activeTab, setActiveTab] = useState("lecture"); // lecture | basic | exams

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

  const [expandedContents, setExpandedContents] = useState({});
  const [expandedLessons, setExpandedLessons] = useState({});
  const [expandedExams, setExpandedExams] = useState({});
  const [loadingContents, setLoadingContents] = useState({});
  const [loadingLessons, setLoadingLessons] = useState({});
  const [selectedContent, setSelectedContent] = useState(null);

  const isReleased = useCallback((releaseAt) => {
    if (!releaseAt) return true;
    return dayjs(releaseAt).isBefore(dayjs());
  }, []);

  useEffect(() => {
    if (id) {
      dispatch(
        handleGetAllRoundContent({
          body: {
            round_id: id,
          },
        })
      );
    }
  }, [id, dispatch]);

  const apiMessage = all_content_list?.data?.message;
  const contents = apiMessage?.contents || [];
  const examsRound = apiMessage?.exams_round || [];

  const filteredContents =
    activeTab === "lecture" || activeTab === "basic"
      ? contents.filter((c) => c.content_type === activeTab)
      : [];

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
      dispatch(
        handleGetAllRoundLessons({
          body: {
            round_content_id: selectedContent,
          },
        })
      );
    }
  }, [selectedContent, dispatch]);

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
      </div>
    );
  };

  const PdfCard = ({ pdf }) => {
    return (
      <div className="bg-gray-50/70 p-4 mb-3 rounded-lg border border-gray-100 flex justify-between items-start">
        <div className="flex items-start flex-1 min-w-0">
          <PaperClipOutlined className="text-gray-600 text-lg mt-1 ml-3 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="font-medium text-gray-800 truncate">{pdf?.title}</p>
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
      </div>
    );
  };

  const ExamCard = ({ exam }) => {
    const examData = exam?.exam || {};
    const examId = exam?.id || examData.id;
    const isExamExpanded = expandedExams[examId];

    const videos = exam?.videos || [];
    const pdfs = exam?.exam_pdfs || [];

    return (
      <div className="bg-orange-50/70 p-4 mb-3 rounded-lg border border-orange-100">
        <div
          className="flex justify-between items-start cursor-pointer mb-3"
          onClick={() => toggleExamCollapse(examId)}
        >
          <div className="flex items-start flex-1 min-w-0">
            <CaretDownOutlined
              className={`text-xl ml-3 text-orange-500 transition-transform duration-300 ${
                isExamExpanded ? "rotate-0" : "-rotate-90"
              }`}
            />
            <div className="min-w-0 flex-1">
              <p className="font-medium text-gray-800 truncate">
                {examData?.title}
              </p>
              <p className="text-gray-600 text-sm mt-1">
                {examData?.description}
              </p>
              <div className="flex gap-4 text-xs text-gray-500 mt-2">
                {examData?.date && (
                  <span>📅 {dayjs(examData.date).format("YYYY/MM/DD")}</span>
                )}
                {examData?.time && <span>⏱️ {examData.time}</span>}
              </div>
            </div>
          </div>
        </div>

        {isExamExpanded && (
          <div className="mt-4 border-t pt-4">
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <h5 className="text-md font-semibold text-gray-700 flex items-center">
                  <VideoIcon className="ml-2 text-blue-500 w-4 h-4" />
                  فيديوهات الاختبار ({videos.length})
                </h5>
              </div>

              {videos.length > 0 ? (
                <div className="space-y-2">
                  {videos.map((video) => (
                    <VideoCard
                      key={video.id}
                      video={video}
                      isExamVideo={true}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-3 text-sm">
                  لا توجد فيديوهات لهذا الاختبار بعد.
                </p>
              )}
            </div>

            <div className="mb-2">
              <div className="flex justify-between items-center mb-3">
                <h5 className="text-md font-semibold text-gray-700 flex items-center">
                  <FileIcon className="ml-2 text-gray-500 w-4 h-4" />
                  ملفات PDF ({pdfs.length})
                </h5>
              </div>

              {pdfs.length > 0 ? (
                <div className="space-y-2">
                  {pdfs.map((pdf) => (
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
    const isLiveActive = live?.active === "1";

    return (
      <div className="bg-yellow-50/70 p-4 mb-3 rounded-lg border border-yellow-100 flex justify-between items-start">
        <div className="flex items-start flex-1 min-w-0">
          <CalendarOutlined className="text-yellow-600 text-lg mt-1 ml-3 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="font-medium text-gray-800 truncate">
                {live?.title}
              </p>
              {isLiveActive && (
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                  نشط
                </span>
              )}
            </div>
            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
              <span>⏱️ {live?.time}</span>
              {live?.link && (
                <a
                  href={live?.link}
                  target="_blank"
                  rel="noreferrer"
                  className="truncate max-w-xs text-blue-600 hover:text-blue-700"
                >
                  {live?.link}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const LessonCard = ({ lesson }) => {
    const isLessonExpanded = expandedLessons[lesson.id];
    const isLoadingVideos = loadingLessons[lesson.id];
    const lessonVideos = lesson?.videos;
    const lessonExams = lesson?.exam_all_data;

    const releaseAt =
      lessonSchedule[lesson.id] ?? lesson.release_at ?? lesson.releaseAt;
    const released = isReleased(releaseAt);

    return (
      <div className="mb-4 bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
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
        </div>

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
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-3">
                    <h5 className="text-md font-semibold text-gray-700 flex items-center">
                      <PlayCircleOutlined className="ml-2 text-blue-500" />
                      الفيديوهات ({lessonVideos?.length || 0})
                    </h5>
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

                <div className="mb-6">
                  <div className="flex justify-between items-center mb-3">
                    <h5 className="text-md font-semibold text-gray-700 flex items-center">
                      <FileTextOutlined className="ml-2 text-orange-500" />
                      الاختبارات ({lessonExams?.length || 0})
                    </h5>
                  </div>

                  {lessonExams && lessonExams.length > 0 ? (
                    <div className="space-y-2">
                      {lessonExams.map((examGroup, idx) => (
                        <ExamCard key={idx} exam={examGroup} />
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 text-center py-3 text-sm">
                      لا توجد اختبارات في هذا الدرس بعد.
                    </p>
                  )}
                </div>

                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h5 className="text-md font-semibold text-gray-700 flex items-center">
                      <CalendarOutlined className="ml-2 text-yellow-500" />
                      البث المباشر ({lesson?.live?.length || 0})
                    </h5>
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

  const ContentSection = ({ contentItem }) => {
    const isContentExpanded = expandedContents[contentItem.id];
    const isLoading = loadingContents[contentItem.id];
    const contentLessons = contentItem.lessons;

    const releaseAt =
      contentSchedule[contentItem.id] ??
      contentItem.release_at ??
      contentItem.releaseAt;
    const opened = isReleased(releaseAt);

    return (
      <div className="mb-8 bg-gray-50 border border-gray-100 rounded-xl shadow-md overflow-hidden">
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

                <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                  النوع: {contentItem.content_type}
                </span>
              </div>
            </div>
          </div>
        </div>

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
      <div className="max-w-6xl mx-auto gap-8">
        {/* Tabs */}
        <div className="mb-6 flex gap-3 bg-white rounded-xl shadow-sm p-2 border border-gray-200">
          <button
            onClick={() => setActiveTab("lecture")}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
              activeTab === "lecture"
                ? "bg-blue-600 text-white shadow"
                : "bg-gray-50 text-gray-700 hover:bg-gray-100"
            }`}
          >
            مرحلة المحاضرات
          </button>
          <button
            onClick={() => setActiveTab("basic")}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
              activeTab === "basic"
                ? "bg-green-600 text-white shadow"
                : "bg-gray-50 text-gray-700 hover:bg-gray-100"
            }`}
          >
            مرحلة التأسيس
          </button>
          <button
            onClick={() => setActiveTab("exams")}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
              activeTab === "exams"
                ? "bg-orange-600 text-white shadow"
                : "bg-gray-50 text-gray-700 hover:bg-gray-100"
            }`}
          >
           الاختبارات التجريبية
          </button>
        </div>

        <div className="lg:col-span-2">
          {/* LECTURE / BASIC */}
          {activeTab === "lecture" || activeTab === "basic" ? (
            filteredContents.length > 0 ? (
              filteredContents.map((item) => (
                <ContentSection key={item.id} contentItem={item} />
              ))
            ) : (
              <div className="text-center p-10 bg-white rounded-xl shadow-lg">
                <p className="text-xl text-gray-500">
                  لا يوجد محتوى من النوع{" "}
                  {activeTab === "lecture" ? "محاضرات" : "أساسيات"} حتى الآن.
                </p>
              </div>
            )
          ) : null}

          {/* EXAMS TAB */}
          {activeTab === "exams" && (
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
              {examsRound.length > 0 ? (
                <>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    امتحانات الدورة
                  </h2>
                  <p className="text-sm text-gray-600 mb-4">
                    هنا تظهر كل الامتحانات المرتبطة بالروند، مع الفيديوهات وملفات
                    الـ PDF الخاصة بكل امتحان.
                  </p>
                  {examsRound.map((examGroup, idx) => (
                    <ExamCard
                      key={examGroup?.exam?.id || idx}
                      exam={examGroup}
                    />
                  ))}
                </>
              ) : (
                <div className="text-center py-10">
                  <p className="text-gray-500 text-lg">
                    لا توجد امتحانات مضافة لهذه الدورة حتى الآن.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
