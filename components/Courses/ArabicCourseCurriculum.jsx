"use client";
import {
  CalendarOutlined,
  CaretDownOutlined,
  FileTextOutlined,
  PaperClipOutlined,
  PlayCircleOutlined,
  PlusOutlined
} from "@ant-design/icons";
import { Pagination, Spin, Tag, Tooltip } from "antd";
import dayjs from "dayjs";
import { BadgeAlert, Eye, FileIcon, Info, VideoIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { handleGetAllRoundLessons } from "../../lib/features/lessonSlice";
import { handleGetAllRoundContent } from "../../lib/features/roundContentSlice";
import EditContent from "./components/content/edit";
import DeleteModal from "./components/content/delete";
import EditLesson from "./components/lessons/edit";
import DeleteLessonModal from "./components/lessons/delete";
import DeleteVideoModal from "./components/videos/delete";
import EditVideo from "./components/videos/edit";
import DeleteExamModal from "./components/exam/delete";
import DeletePdfModal from "./components/exam/pdf/delete";
import EditPdf from "./components/exam/pdf/edit";
import AddExamPdfModal from "../RoundContent/Exams/AddExamPdfModal";
import EditLive from "./components/lives/edit";
import DeleteLiveModal from "./components/lives/delete";
import FinishLiveModal from "./components/lives/finish";
import { handleActiveLive } from "@/lib/features/livesSlice";
import { toast } from "react-toastify";
import FreeVideos from "../RoundContent/FreeVideos/FreeVideos";
import { handleGetAllExamByRoundId } from "../../lib/features/examSlice";

const initialSchedule = {
  startDate: "2025-12-01",
  endDate: "2025-12-31",
  startTime: "09:00",
  endTime: "11:00"
};

export default function ArabicCourseCurriculum({ id, source }) {
  const [rowData, setRowData] = useState({});
  const [contentSchedule, setContentSchedule] = useState({});
  const [lessonSchedule, setLessonSchedule] = useState({});
  const [activeTab, setActiveTab] = useState("lecture"); // lecture | basic | exams

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

  const { all_exam_round_loading, all_exam_round_list } = useSelector(state => state?.exam)
  const [examPagination, setExamPagination] = useState({
    current_page: 1,
    per_page: 15,
    last_page: 1,
    total: 0,
    from: 1,
    to: 15
  })
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(5);

  const isReleased = useCallback((releaseAt) => {
    if (!releaseAt) return true;
    return dayjs(releaseAt).isBefore(dayjs());
  }, []);

  useEffect(() => {
    if (id) {
      dispatch(
        handleGetAllRoundContent({
          body: {
            round_id: id
          }
        })
      );

      // dispatch(handleGetAllExamByRoundId({
      //   body: {
      //     round_id: id,
      //     page: examPagination?.current_page,
      //     per_page: examPagination?.per_page
      //   }
      // }))

      fetchExams(examPagination.current_page, examPagination.per_page);
    }
  }, [id, dispatch]);

    const fetchExams = (page = 1, perPage = 15) => {
    dispatch(handleGetAllExamByRoundId({
      body: {
        round_id: id,
        
      },
      page: page,
        per_page: perPage
    }));
  };



  useEffect(() => {
    if (all_exam_round_list?.data?.message) {
      const examData = all_exam_round_list.data.message;
    
    }
  }, [all_exam_round_list]);

  const handleExamPageChange = (page, pageSize) => {
    setExamPagination(prev => ({
      ...prev,
      current_page: page,
      per_page: pageSize
    }));
    fetchExams(page, pageSize);
  };


  useEffect(() => {
    console.log(all_exam_round_list?.data?.message?.data);
    setPage(all_content_list?.data?.message?.current_page);
    setPerPage(all_content_list?.data?.message?.per_page);

  }, [all_exam_round_list])

  const apiMessage = all_content_list?.data?.message;
  const contents = useSelector(
    (state) => state?.content?.all_content_list?.data?.message?.contents
  );
  const examsRound = apiMessage?.exams_round || [];

  const filteredContents =
    (contents && contents?.length && activeTab === "lecture") ||
      activeTab === "basic"
      ? contents.filter((c) => c.content_type === activeTab)
      : [];
  const [getContent, setContentSelected] = useState(null);
  const toggleContentCollapse = async (contentId, e, content) => {
    setSelectedContent(contentId);
    setContentSelected(content);
    const isCurrentlyExpanded = expandedContents[contentId];
    setExpandedContents((prev) => ({
      ...prev,
      [contentId]: !isCurrentlyExpanded
    }));
  };

  const toggleLessonCollapse = async (lessonId) => {
    const isCurrentlyExpanded = expandedLessons[lessonId];
    setExpandedLessons((prev) => ({
      ...prev,
      [lessonId]: !isCurrentlyExpanded
    }));
  };

  const toggleExamCollapse = async (examId) => {
    setSelectedExam(examId);
    const isCurrentlyExpanded = expandedExams[examId];
    setExpandedExams((prev) => ({
      ...prev,
      [examId]: !isCurrentlyExpanded
    }));
  };

  useEffect(() => {
    if (selectedContent) {
      dispatch(
        handleGetAllRoundLessons({
          body: {
            round_content_id: selectedContent
          }
        })
      );
    }
  }, [selectedContent, dispatch]);

  const VideoCard = ({
    video,
    isExamVideo = false,
    lesson,
    content,
    addVideo,
    setAddVideo
  }) => {
    const isFree = video?.free === "1";
    const [deleteOpen, setDeleteOpen] = useState(null);
    const [editOpen, setEditOpen] = useState(null);
    const [isEditing, setIsEditing] = useState(null);
    return (
      <div className="flex items-start justify-between p-4 mb-3 border border-blue-100 rounded-lg bg-blue-50/70">
        <DeleteVideoModal open={deleteOpen} setOpen={setDeleteOpen} />
        <EditVideo
          setIsEditing={setIsEditing}
          isEditing={isEditing}
          isExam={isExamVideo}
          open={addVideo || editOpen}
          data={addVideo || editOpen}
          setOpen={addVideo ? setAddVideo : setEditOpen}
        />
        <div className="flex items-center justify-between flex-1 min-w-0">
          <div className="flex items-center w-[100%]">
            <PlayCircleOutlined className="flex-shrink-0 mt-1 ml-3 text-lg text-blue-600" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-medium text-gray-800 truncate">
                  {video?.title}
                </p>
                {isFree && (
                  <span className="px-2 py-1 text-xs text-green-800 bg-green-100 rounded-full">
                    مجاني
                  </span>
                )}
                {isExamVideo && (
                  <span className="px-2 py-1 text-xs text-purple-800 bg-purple-100 rounded-full">
                    فيديو اختبار
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-gray-600">{video?.description}</p>
              <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                {video?.video_url && (
                  <a
                    href={video?.video_url}
                    target="_blank"
                    rel="noreferrer"
                    className="max-w-xs text-blue-600 truncate hover:text-blue-700"
                  >
                    {video.video_url}
                  </a>
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-3 actions">
            <div class="flex gap-3 items-center space-x-4">
              <button
                type="button"
                data-drawer-target="drawer-update-product"
                data-drawer-show="drawer-update-product"
                aria-controls="drawer-update-product"
                class="py-2 px-3 flex items-center text-sm font-medium text-center text-white bg-primary rounded-lg hover:bg-primary focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary dark:hover:bg-primary dark:focus:ring-primary"
                onClick={() => {
                  setEditOpen({
                    ...content,
                    ...lesson,
                    ...video,
                    isExam: isExamVideo
                  });
                  setIsEditing(true);
                }}
              >
                تعديل
              </button>

              <button
                type="button"
                data-modal-target="delete-modal"
                data-modal-toggle="delete-modal"
                onClick={() => {
                  setDeleteOpen({ ...content, ...lesson, ...video });
                }}
                class="flex items-center text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-3 py-2 text-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
              >
                حذف
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const PdfCard = ({
    pdf,
    content,
    lesson,
    video,
    exam,
    addPdf,
    setAddPdf
  }) => {
    const [editOpen, setEditOpen] = useState(null);
    const [isEditting, setIsEditting] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(null);
    return (
      <div className="flex items-start justify-between p-4 mb-3 border border-gray-100 rounded-lg bg-gray-50/70">
        <div className="flex items-start flex-1 min-w-0 w-[100%] justify-between">
          <PaperClipOutlined className="flex-shrink-0 mt-1 ml-3 text-lg text-gray-600" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-medium text-gray-800 truncate">{pdf?.title}</p>
              <span className="px-2 py-1 text-xs text-gray-800 bg-gray-100 rounded-full">
                ملف PDF
              </span>
            </div>
            <p className="mt-1 text-sm text-gray-600">{pdf?.description}</p>
            <div className="mt-2 text-xs text-gray-500">
              {pdf?.pdf_url && (
                <a
                  href={pdf?.pdf_url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
                >
                  <FileIcon className="w-3 h-3" />
                  عرض الملف
                </a>
              )}
            </div>
          </div>
          <div className="flex gap-3 actions">
            <div class="flex gap-3 items-center space-x-4">
              <button
                type="button"
                data-drawer-target="drawer-update-product"
                data-drawer-show="drawer-update-product"
                aria-controls="drawer-update-product"
                class="py-2 px-3 flex items-center text-sm font-medium text-center text-white bg-primary rounded-lg hover:bg-primary focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary dark:hover:bg-primary dark:focus:ring-primary"
                onClick={() => {
                  setEditOpen({ ...lesson, ...content, ...exam, ...pdf });
                  setIsEditting(true);
                  // if (typeof window != undefined) {
                  //   window.location.href = `/questions/new?lessonId=${lesson?.id}&exam-id=${examData?.id}`;
                  // }
                }}
              >
                تعديل
              </button>

              <button
                type="button"
                data-modal-target="delete-modal"
                data-modal-toggle="delete-modal"
                onClick={() => {
                  setDeleteOpen({ ...lesson, ...content, ...exam, ...pdf });
                }}
                class="flex items-center text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-3 py-2 text-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
              >
                حذف
              </button>
            </div>
          </div>
        </div>
        <DeletePdfModal open={deleteOpen} setOpen={setDeleteOpen} />
        <EditPdf
          data={editOpen}
          open={editOpen}
          setOpen={setEditOpen}
          isEditing={isEditting}
          setIsEditing={setIsEditting}
        />
      </div>
    );
  };

  const ExamCard = ({ exam, lesson, content }) => {
    const [deleteOpen, setDeleteOpen] = useState(false);
    const examData = exam || {};
    const examId = exam?.id || examData.id;
    const isExamExpanded = expandedExams[examId];
    const [addOpen, setAddOpen] = useState(false);
    const [addVideoOpen, setAddVideoOpen] = useState(false);
    const videos = exam?.videos || [];
    const pdfs = exam?.exam_pdfs || [];

    useEffect(() => {
      console.log("exam", exam, "lesson", lesson);
    }, [exam, lesson])

    return (
      <div className="p-4 mb-3 border border-orange-100 rounded-lg bg-orange-50/70">
        <div className="flex items-start justify-between mb-3 cursor-pointer">
          <div className="flex items-start flex-1 min-w-0 w-[100%] flex-col">
            <div className="flex w-[100%] items-center justify-between">
              {" "}
              {/* <CaretDownOutlined
                className={`text-xl ml-3 text-orange-500 transition-transform duration-300 cursor-pointer ${isExamExpanded ? "rotate-0" : "-rotate-90"
                  }`}
                onClick={() => toggleExamCollapse(examId)}
              /> */}

            </div>
            {console.log("examDataexamDataexamData-----.-----", examData)}
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-800 truncate">
                {examData?.title}
              </p>
              <p className="mt-1 text-sm text-gray-600">
                {examData?.description}
              </p>
              <div className="flex gap-4 mt-2 text-xs text-gray-500">
                {examData?.date && (
                  <span>📅 {dayjs(examData.date).format("YYYY/MM/DD")}</span>
                )}
                {examData?.time && <span>⏱️ {examData.time}</span>}
              </div>
            </div>
            {/* Actions Icons */}
            {examData?.id ? (
              <div className="flex gap-3 mt-3 actions">
                <div class="flex gap-3 items-center space-x-4">
                  <button
                    type="button"
                    data-drawer-target="drawer-update-product"
                    data-drawer-show="drawer-update-product"
                    aria-controls="drawer-update-product"
                    class="py-2 px-3 flex items-center text-sm font-medium text-center text-white bg-primary rounded-lg hover:bg-primary focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary dark:hover:bg-primary dark:focus:ring-primary"
                    onClick={() => {
                      if (typeof window != undefined) {
                        window.location.href = `/exams/edit/${examData?.id}`;
                      }
                    }}
                  >
                    تعديل
                  </button>

                  <button
                    type="button"
                    data-modal-target="delete-modal"
                    data-modal-toggle="delete-modal"
                    onClick={() => {
                      setDeleteOpen({ ...content?.round_id, ...examData });
                    }}
                    class="flex items-center text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-3 py-2 text-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
                  >
                    حذف
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
        <DeleteExamModal round_id={id} page={examPagination?.current_page} per_page={examPagination?.per_page} open={deleteOpen} setOpen={setDeleteOpen} />
        
        {/* {isExamExpanded && (
          <div className="pt-4 mt-4 border-t">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h5 className="flex items-center font-semibold text-gray-700 text-md">
                  <VideoIcon className="w-4 h-4 ml-2 text-blue-500" />
                  فيديوهات التدريب ({videos.length})
                </h5>
              </div>
              <button
                type="submit"
                class="!rounded-md mb-2 mr-auto text-white bg-primary mr-auto box-border border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none !m-2"
                onClick={() => {
                  setAddVideoOpen({
                    lesson_id: lesson?.id,
                    round_id: content?.round_id,
                    content_id: content?.id,
                    title: "",
                    description: "",
                    time: "",
                    vimeo_link: "",
                    video_url: "",
                    youtube_link: ""
                  });
                }}
              >
                إضافة فيديو{" "}
              </button>
              <EditVideo
                setIsEditing={() => null}
                isExam={true}
                isEditing={false}
                open={addVideoOpen}
                data={addVideoOpen}
                setOpen={setAddVideoOpen}
              />
              {videos.length > 0 ? (
                <div className="space-y-2">
                  {videos.map((video) => (
                    <VideoCard
                      key={video.id}
                      video={video}
                      lesson={lesson}
                      content={content}
                      isExamVideo={true}
                    />
                  ))}
                </div>
              ) : (
                <p className="py-3 text-sm text-center text-gray-400">
                  لا توجد فيديوهات لهذا التدريب بعد.
                </p>
              )}
            </div>

            <div className="mb-2">
              <div className="flex items-center justify-between mb-3">
                <h5 className="flex items-center font-semibold text-gray-700 text-md">
                  <FileIcon className="w-4 h-4 ml-2 text-gray-500" />
                  ملفات PDF ({pdfs.length})
                </h5>
              </div>
              <button
                type="submit"
                class="!rounded-md mb-2 mr-auto text-white bg-primary mr-auto box-border border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none !m-2"
                onClick={() => {
                  setAddOpen(true);
                }}
              >
                إضافة ملف{" "}
              </button>
              {console.log("------lesson", lesson)}
              <AddExamPdfModal
                data={{
                  lesson_id: lesson?.id,
                  title: "",
                  description: "",
                  pdf_url: ""
                }}
                id={content?.round_id}
                lesson_id={lesson?.id}
                exam_id={lesson?.id}
                open={addOpen}
                setOpen={setAddOpen}
                setIsEditing={setAddOpen}
                isEditing={false}
              />
              {pdfs.length > 0 ? (
                <div className="space-y-2">
                  {pdfs.map((pdf) => (
                    <PdfCard
                      key={pdf.id}
                      pdf={pdf}
                      lesson={lesson}
                      content={content}
                      exam={examData}
                    />
                  ))}
                </div>
              ) : (
                <p className="py-3 text-sm text-center text-gray-400">
                  لا توجد ملفات PDF لهذا التدريب بعد.
                </p>
              )}
            </div>
          </div>
        )} */}
      </div>
    );
  };

  const ActionButton = ({
    disabled,
    icon,
    title,
    onClick,
    className = "",
    children
  }) => (
    <button
      disabled={disabled}
      title={title || ""}
      onClick={onClick}
      className={`p-1 text-sm p-2 bg-[green] text-white  rounded-full transition duration-150  ${className}`}
    >
      {icon}
      {children}
    </button>
  );
  const LiveSessionCard = ({ live, lesson, content }) => {
    const isLiveActive = live?.active === "1";
    const isLiveFinished = live?.finished === "1";
    const [editOpen, setEditOpen] = useState(null);
    const [isEditting, setIsEditting] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(null);
    const [finishOpen, setFinishOpen] = useState(null);
    const dispatch = useDispatch();
    const handleActivateLive = (live, isActive) => {
      const body = { id: live?.id, active: isActive ? "0" : "1" };
      dispatch(handleActiveLive({ body }))
        .unwrap()
        .then((res) => {
          console.log(res);
          if (res?.data?.status == "success") {
            toast.success(res?.data?.message);
            dispatch(
              handleGetAllRoundContent({
                body: {
                  round_id: content?.round_id
                }
              })
            );
          } else {
            toast.error(
              "هناك مشكله اُثناء تعديل حالة البث" || res?.data?.message
            );
          }
        })
        .catch((e) => console.log(e));
    };
    return (
      <div className="flex items-start justify-between p-4 mb-3 border border-yellow-100 rounded-lg bg-yellow-50/70">
        <DeleteLiveModal open={deleteOpen} setOpen={setDeleteOpen} />
        <FinishLiveModal open={finishOpen} setOpen={setFinishOpen} />
        <EditLive
          source={source}
          setIsEditing={setIsEditting}
          isEditing={isEditting}
          open={editOpen}
          data={editOpen}
          setOpen={setEditOpen}
        />
        <div className="flex items-start flex-1 min-w-0">
          <CalendarOutlined className="flex-shrink-0 mt-1 ml-3 text-lg text-yellow-600" />
          <div className="flex-1 min-w-0  items-center w-[100%] justify-between">
            <div className="dlex items-center">
              <div className="flex items-center gap-2">
                <p className="font-medium text-gray-800 truncate">
                  {live?.title}
                </p>
                {isLiveActive && (
                  <span className="px-2 py-1 text-xs text-green-800 bg-green-100 rounded-full">
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
                    className="max-w-xs text-blue-600 truncate hover:text-blue-700"
                  >
                    {live?.link}
                  </a>
                )}
              </div>
            </div>
            <div class="flex gap-3 items-center space-x-4">
              <button
                type="button"
                data-drawer-target="drawer-update-product"
                data-drawer-show="drawer-update-product"
                aria-controls="drawer-update-product"
                class="py-2 px-3 flex items-center text-sm font-medium text-center text-white bg-primary rounded-lg hover:bg-primary focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary dark:hover:bg-primary dark:focus:ring-primary"
                onClick={() => {
                  setEditOpen({ ...content, ...lesson, ...live });
                  setIsEditting(true);
                }}
              >
                تعديل
              </button>
              <ActionButton
                title={isLiveActive ? "إلغاء تنشيط البث" : "تنشيط البث"}
                icon={isLiveActive ? "إلغاء تنشيط البث" : "تنشيط البث"}
                onClick={(e) => {
                  e.stopPropagation();
                  handleActivateLive(live, isLiveActive);
                }}
              />
              {isLiveFinished ? (
                "تم الانهاء"
              ) : (
                <button
                  type="button"
                  data-drawer-target="drawer-update-product"
                  data-drawer-show="drawer-update-product"
                  aria-controls="drawer-update-product"
                  class="py-2 px-3 flex items-center text-sm font-medium text-center text-white bg-primary rounded-lg hover:bg-primary focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary dark:hover:bg-primary dark:focus:ring-primary"
                  onClick={() => {
                    setFinishOpen({ ...content, ...lesson, ...live });
                    setIsEditting(true);
                  }}
                >
                  إنهاء
                </button>
              )}
              <button
                type="button"
                data-modal-target="delete-modal"
                data-modal-toggle="delete-modal"
                onClick={() => {
                  setDeleteOpen({ ...content, ...lesson, ...live });
                }}
                class="flex items-center text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-3 py-2 text-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
              >
                حذف
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const LessonCard = ({
    lesson,
    setIsEditLessonOpen,
    setIsEditing,
    setDeleteLessonOpen,
    content
  }) => {
    const isLessonExpanded = expandedLessons[lesson.id];
    const isLoadingVideos = loadingLessons[lesson.id];
    const lessonVideos = lesson?.videos;
    const lessonExams = lesson?.exam_all_data;
    const [addVideo, setAddVideo] = useState(null);
    const [addLive, setAddLive] = useState(null);
    const releaseAt =
      lessonSchedule[lesson.id] ?? lesson.release_at ?? lesson.releaseAt;
    const released = isReleased(releaseAt);

    useEffect(() => {
      console.log(lesson);
    }, [lesson])

    return (
      <div className="mb-4 overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="flex items-start justify-between p-4 transition duration-150 cursor-pointer hover:bg-gray-50">
          <div className="flex justify-between item-center w-[100%]">
            <div
              className="flex items-center min-w-0  w-[100%]"
              onClick={() => toggleLessonCollapse(lesson.id)}
            >
              <CaretDownOutlined
                className={`text-xl ml-3 text-blue-500 transition-transform duration-300 ${isLessonExpanded ? "rotate-0" : "-rotate-90"
                  }`}
              />
              <div className="min-w-0">
                <h4 className="text-lg font-semibold text-gray-800 truncate">
                  {lesson?.lesson_title}
                </h4>
                <p className="mt-1 text-sm text-gray-600 truncate">
                  {lesson.lesson_description}
                </p>

                <div className="flex flex-wrap items-center gap-3 mt-2">
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
            {/* Actions Icons */}
            <div className="flex gap-3 actions">
              <div class="flex gap-3 items-center space-x-4">
                <button
                  type="button"
                  data-drawer-target="drawer-update-product"
                  data-drawer-show="drawer-update-product"
                  aria-controls="drawer-update-product"
                  class="py-2 px-3 flex items-center text-sm font-medium text-center text-white bg-primary rounded-lg hover:bg-primary focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary dark:hover:bg-primary dark:focus:ring-primary"
                  onClick={() => {
                    setIsEditLessonOpen({ ...content, ...lesson });
                    setIsEditing(true);
                  }}
                >
                  تعديل
                </button>

                <button
                  type="button"
                  data-modal-target="delete-modal"
                  data-modal-toggle="delete-modal"
                  onClick={() => {
                    setDeleteLessonOpen({ ...content, ...lesson });
                  }}
                  class="flex items-center text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-3 py-2 text-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
                >
                  حذف
                </button>
              </div>
            </div>
          </div>
        </div>

        {isLessonExpanded && (
          <div className="p-4 pt-3 border-t bg-gray-50">
            {!released ? (
              <p className="text-center text-gray-400">
                هذا الدرس لم يُفتح بعد طبقاً لجدول الدورة.
              </p>
            ) : isLoadingVideos ? (
              <div className="flex items-center justify-center py-4">
                <Spin spinning size="default" />
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="flex items-center font-semibold text-gray-700 text-md">
                      <PlayCircleOutlined className="ml-2 text-blue-500" />
                      الفيديوهات ({lessonVideos?.length || 0})
                    </h5>
                  </div>
                  <button
                    type="submit"
                    class="!rounded-md mb-2 mr-auto text-white bg-primary mr-auto box-border border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none !m-2"
                    onClick={() => {
                      setAddVideo({
                        lesson_id: lesson?.id,
                        round_id: content?.round_id,
                        content_id: content?.id,
                        title: "",
                        description: "",
                        time: "",
                        vimeo_link: "",
                        youtube_link: ""
                      });
                      setIsEditing(false);
                    }}
                  >
                    إضافة فيديو{" "}
                  </button>
                  <EditVideo
                    setIsEditing={() => null}
                    isEditing={false}
                    open={addVideo}
                    data={addVideo}
                    setOpen={setAddVideo}
                  />
                  {lessonVideos && lessonVideos.length > 0 ? (
                    <div className="space-y-2">
                      {lessonVideos.map((video) => (
                        <VideoCard
                          addVideo={addVideo}
                          setAddVideo={setAddVideo}
                          key={video.id}
                          video={video}
                          lesson={lesson}
                          content={content}
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="py-3 text-sm text-center text-gray-400">
                      لا توجد فيديوهات في هذا الدرس بعد.
                    </p>
                  )}
                </div>

                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="flex items-center font-semibold text-gray-700 text-md">
                      <FileTextOutlined className="ml-2 text-orange-500" />
                      التدريب
                    </h5>
                  </div>

                  {/* {lessonExams && lessonExams.length > 0 ? ( */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="flex items-center font-semibold text-gray-700 text-md">
                        <FileTextOutlined className="ml-2 text-orange-500" />
                        الاختبارات ({lessonExams?.length || 0})
                      </h5>
                    </div>
                    {(lessonExams?.length
                      ? lessonExams
                      : [
                        {
                          exam: null,
                          videos: [],
                          exam_pdfs: []
                        }
                      ]
                    ).map((examGroup, idx) => (
                      <ExamCard
                        key={idx}
                        exam={examGroup}
                        lesson={lesson}
                        content={content}
                      />
                    ))}
                  </div>
                  {/* ) : (
                    <p className="py-3 text-sm text-center text-gray-400">
                      لا توجد اختبارات في هذا الدرس بعد.
                    </p>
                  )} */}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h5 className="flex items-center font-semibold text-gray-700 text-md">
                      <CalendarOutlined className="ml-2 text-yellow-500" />
                      البث المباشر ({lesson?.live?.length || 0})
                    </h5>
                  </div>
                  <button
                    type="submit"
                    class="!rounded-md mb-2 mr-auto text-white bg-primary mr-auto box-border border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none !m-2"
                    onClick={() => {
                      setAddLive({
                        lesson_id: lesson?.id,
                        round_id: content?.round_id,
                        content_id: content?.id,
                        title: "",
                        link: "",
                        time: "",
                        date: ""
                      });
                      setIsEditing(false);
                    }}
                  >
                    إضافة بث مباشر{" "}
                  </button>
                  <EditLive
                    setIsEditing={() => null}
                    isEditing={false}
                    open={addLive}
                    data={addLive}
                    setOpen={setAddLive}
                  />

                  {lesson?.live && lesson.live.length > 0 ? (
                    <div className="space-y-2">
                      {lesson.live.map((live) => (
                        <LiveSessionCard
                          key={live.id}
                          live={live}
                          lesson={lesson}
                          content={content}
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="py-3 text-sm text-center text-gray-400">
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
  const [editOpen, setIsEditOpen] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(null);
  const [editLessonOpen, setIsEditLessonOpen] = useState(null);
  const [deleteLessonOpen, setDeleteLessonOpen] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const ContentSection = ({
    contentItem,
    setIsEditOpen,
    setIsEditing,
    setDeleteOpen,
    setDeleteLessonOpen,
    setIsEditLessonOpen
  }) => {
    const isContentExpanded = expandedContents[contentItem.id];
    const isLoading = loadingContents[contentItem.id];
    const contentLessons = contentItem.lessons;

    const releaseAt =
      contentSchedule[contentItem.id] ??
      contentItem.release_at ??
      contentItem.releaseAt;
    const opened = isReleased(releaseAt);

    return (
      <div className="mb-8 overflow-hidden border border-gray-100 shadow-md bg-gray-50 rounded-xl">
        <div className="flex items-start justify-between p-6 pb-3 transition duration-150 border-b cursor-pointer hover:bg-gray-100">
          <div className="flex items-center justify-between flex-1 min-w-0">
            <div
              className="flex items-center basic"
              onClick={(e) =>
                toggleContentCollapse(contentItem.id, e, contentItem)
              }
            >
              <CaretDownOutlined
                className={`text-2xl ml-3 text-blue-700 transition-transform duration-300 ${isContentExpanded ? "rotate-0" : "-rotate-90"
                  }`}
              />
              <div className="min-w-0 !max-w-[100%]">
                <h3 className="text-xl flex gap-3 items-center font-bold text-gray-900 truncate">
                  <span>{contentItem.content_title}</span>
                 <Tooltip title={contentItem.content_description}>
                   <BadgeAlert color="gray" />
                 </Tooltip>
                </h3>
                {/* <p className="mt-1 text-base text-gray-700 truncate max-w-[600px] overflow-hidden text-ellipsis !whitespace-pre-wrap">
                  {contentItem.content_description}
                </p> */}
                <div className="flex flex-wrap items-center gap-3 mt-2">
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

            {/* Actions Icons */}
            <div className="flex gap-3 actions">
              <div class="flex gap-3 items-center space-x-4">
                <button
                  type="button"
                  data-drawer-target="drawer-update-product"
                  data-drawer-show="drawer-update-product"
                  aria-controls="drawer-update-product"
                  class="py-2 px-3 flex items-center text-sm font-medium text-center text-white bg-primary rounded-lg hover:bg-primary focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary dark:hover:bg-primary dark:focus:ring-primary"
                  onClick={() => {
                    setIsEditOpen(contentItem);
                    setIsEditing(true);
                  }}
                >
                  تعديل
                </button>

                <button
                  type="button"
                  data-modal-target="delete-modal"
                  data-modal-toggle="delete-modal"
                  onClick={() => {
                    setDeleteOpen(contentItem);
                  }}
                  class="flex items-center text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-3 py-2 text-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
                >
                  حذف
                </button>
              </div>
            </div>
          </div>
        </div>

        {isContentExpanded && (
          <div className="p-6 pt-3">
            <button
              type="submit"
              class="!rounded-md mb-2 mr-auto text-white bg-primary mr-auto box-border border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none !m-2"
              onClick={() => {
                setIsEditLessonOpen({
                  round_id: getContent.round_id,
                  content_id: getContent?.id,
                  lesson_title: "",
                  lesson_description: "",
                  type: activeTab
                });
                setIsEditing(false);
              }}
            >
              إضافة درس{" "}
            </button>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Spin spinning size="large" />
              </div>
            ) : contentLessons && contentLessons.length > 0 ? (
              <div className="pr-2 border-r-4 border-blue-300">
                {contentLessons.map((lesson) => (
                  <LessonCard
                    key={lesson.id}
                    lesson={lesson}
                    content={contentItem}
                    setIsEditLessonOpen={setIsEditLessonOpen}
                    setIsEditing={setIsEditing}
                    setDeleteLessonOpen={setDeleteLessonOpen}
                  />
                ))}
              </div>
            ) : (
              <p className="py-4 text-center text-gray-400">
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
      className="min-h-screen p-4 sm:p-8 bg-gradient-to-br from-gray-50 to-white"
      dir="rtl"
    >
      <div className="max-w-6xl gap-8 mx-auto">
        {/* Tabs */}
        <div className="flex gap-3 p-2 mb-6 bg-white border border-gray-200 shadow-sm rounded-xl">
          <button
            onClick={() => setActiveTab("basic")}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${activeTab === "basic"
                ? "bg-green-600 text-white shadow"
                : "bg-gray-50 text-gray-700 hover:bg-gray-100"
              }`}
          >
            مرحلة التأسيس
          </button>
          <button
            onClick={() => setActiveTab("lecture")}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${activeTab === "lecture"
                ? "bg-blue-600 text-white shadow"
                : "bg-gray-50 text-gray-700 hover:bg-gray-100"
              }`}
          >
            مرحلة المحاضرات
          </button>
          <button
            onClick={() => setActiveTab("exams")}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${activeTab === "exams"
                ? "bg-orange-600 text-white shadow"
                : "bg-gray-50 text-gray-700 hover:bg-gray-100"
              }`}
          >
            الاختبارات التجريبية
          </button>
          <button
            onClick={() => setActiveTab("free_explain")}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${activeTab === "free_explain"
                ? "bg-fuchsia-600 text-white shadow"
                : "bg-gray-50 text-gray-700 hover:bg-gray-100"
              }`}
          >
            الشروحات المجانية
          </button>
        </div>
        <EditContent
          source={source}
          open={editOpen}
          data={editOpen}
          setOpen={setIsEditOpen}
          setIsEditing={setIsEditing}
          isEditing={isEditing}
        />
        <EditLesson
          source={source}
          open={editLessonOpen}
          data={editLessonOpen}
          setOpen={setIsEditLessonOpen}
          setIsEditing={setIsEditing}
          isEditing={isEditing}
        />
        <DeleteLessonModal
          open={deleteLessonOpen}
          data={deleteOpen}
          setOpen={setDeleteLessonOpen}
        />
        <DeleteModal
          open={deleteOpen}
          data={deleteOpen}
          setOpen={setDeleteOpen}
        />
        <div className="lg:col-span-2">
          {/* LECTURE / BASIC */}

          {activeTab === "lecture" || activeTab === "basic" ? (
            <>
              <button
                type="submit"
                class="!rounded-md mb-2 mr-auto text-white bg-primary mr-auto box-border border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none"
                onClick={() => {
                  setIsEditOpen({
                    round_id: getContent?.round_id,
                    content_title: "",
                    content_description: "",
                    type: activeTab
                  });
                  setIsEditing(false);
                }}
              >
                إضافة محاضرة{" "}
              </button>
              {filteredContents.length > 0 ? (
                filteredContents.map((item) => (
                  <>
                    {/* {console.log("item", item)} */}

                    <ContentSection
                      source={source}
                      key={item.id}
                      contentItem={item}
                      setIsEditOpen={setIsEditOpen}
                      setIsEditing={setIsEditing}
                      setDeleteOpen={setDeleteOpen}
                      setDeleteLessonOpen={setDeleteLessonOpen}
                      setIsEditLessonOpen={setIsEditLessonOpen}
                    />
                  </>
                ))
              ) : (
                <div className="p-10 text-center bg-white shadow-lg rounded-xl">
                  <p className="text-xl text-gray-500">
                    لا يوجد محتوى من النوع{" "}
                    {activeTab === "lecture" ? "محاضرات" : "أساسيات"} حتى الآن.
                  </p>
                </div>
              )}
            </>
          ) : null}

          {/* EXAMS TAB */}
          {activeTab === "exams" && (
            <div className="p-6 bg-white border border-gray-200 shadow-md rounded-xl">
              {all_exam_round_loading ? (
                <div className="flex justify-center py-10">
                  <Spin size="large" />
                </div>
              ) : all_exam_round_list?.data?.message?.length > 0 ? (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="mb-1 text-xl font-bold text-gray-900">
                        امتحانات الدورة
                      </h2>
                      {/* <p className="text-sm text-gray-600">
                        عرض {examPagination.from} إلى {examPagination.to} من أصل {examPagination.total} امتحان
                      </p> */}
                    </div>
                    {/* <button
                      onClick={() => {
                        window.location.href = `/exams/new?roundId=${id}`;
                      }}
                      className="flex items-center gap-2 px-4 py-2 text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition duration-150"
                    >
                      <PlusOutlined />
                      إضافة امتحان جديد
                    </button> */}
                  </div>

                  <p className="mb-6 text-sm text-gray-600">
                    هنا تظهر كل الامتحانات المرتبطة بالروند، مع الفيديوهات
                    وملفات الـ PDF الخاصة بكل امتحان.
                  </p>

                  <div className="space-y-4 mb-8">
                    {all_exam_round_list?.data?.message?.map((examGroup, idx) => (
                      <ExamCard
                        source={source}
                        key={examGroup?.exam?.id || idx}
                        exam={examGroup}
                      />
                    ))}
                  </div>

                  {/* Exam Pagination */}
                  {/* {examPagination.total > examPagination.per_page && (
                    <div className="mt-8 pt-6 border-t border-gray-200">
                      <div className="flex flex-col items-center justify-between sm:flex-row">
                        <div className="mb-4 text-sm text-gray-600 sm:mb-0">
                          الصفحة {examPagination.current_page} من {examPagination.last_page}
                        </div>
                        <Pagination
                          current={examPagination.current_page}
                          pageSize={examPagination.per_page}
                          total={examPagination.total}
                          onChange={handleExamPageChange}
                          showSizeChanger
                          onShowSizeChange={(current, size) => {
                            handleExamPageChange(1, size);
                          }}
                          pageSizeOptions={[5, 10, 15, 20, 50]}
                          showTotal={(total, range) => `${range[0]}-${range[1]} من ${total} امتحان`}
                          locale={{
                            items_per_page: 'لكل صفحة',
                            jump_to: 'الذهاب إلى',
                            page: 'صفحة',
                            prev_page: 'الصفحة السابقة',
                            next_page: 'الصفحة التالية',
                            prev_5: '5 صفحات سابقة',
                            next_5: '5 صفحات تالية',
                            prev_3: '3 صفحات سابقة',
                            next_3: '3 صفحات تالية',
                          }}
                          className="exam-pagination"
                        />
                      </div>
                    </div>
                  )} */}
                </>
              ) : (
                <div className="py-10 text-center">
                  <div className="inline-block p-6 mb-4 bg-orange-100 rounded-full">
                    <FileTextOutlined className="text-3xl text-orange-500" />
                  </div>
                  <p className="mb-2 text-lg font-medium text-gray-700">
                    لا توجد امتحانات مضافة لهذه الدورة حتى الآن.
                  </p>
                  <p className="mb-6 text-gray-600">
                    ابدأ بإضافة أول امتحان للدورة لاختبار الطلاب.
                  </p>
                 
                </div>
              )}
            </div>
          )}


          {activeTab === "free_explain" && <FreeVideos />}
        </div>
      </div>
    </div>
  );
}
