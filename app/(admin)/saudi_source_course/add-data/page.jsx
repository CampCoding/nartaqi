"use client";
import React, { useState } from "react";
import {
  BarChart3,
  Book,
  Files,
  Plus,
  Save,
  Video as VideoIcon,
  FileText,
  Copy,
  ChevronDown,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  Download,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Card,
  Form,
  Input,
  Select,
  message,
  Divider,
  Row,
  Col,
  Button as AntButton,
  Dropdown,
  Menu,
  Modal,
  Empty,
  Tag,
  Tooltip,
  Space,
  Switch,
  Upload,
  Tabs,
} from "antd";
import { PlusOutlined, FolderOutlined, LinkOutlined, InboxOutlined } from "@ant-design/icons";

// Layout & components
import PageLayout from "../../../../components/layout/PageLayout";
import BreadcrumbsShowcase from "../../../../components/ui/BreadCrumbs";
import PagesHeader from "../../../../components/ui/PagesHeader";
import Button from "../../../../components/atoms/Button";
import SaudiCourseSourceBasicLevel from "../../../../components/SaudiCourseSource/SaudiCourseSourceBasicLevel";
import AddCourseLevelModal from "../../../../components/TeacherCourses/AddTeacherCourseContent/AddCourseLevelModal";
import AddCourseLessonModal from "../../../../components/TeacherCourses/AddTeacherCourseContent/AddCourseLessonModal";
import AddSaudiCourseSourceLectures from "../../../../components/SaudiCourseSource/AddSaudiCourseSourceLectures";
import AddSaudiCourseSourceExams from "../../../../components/SaudiCourseSource/AddSaudiCourseSourceExams";

const { Dragger } = Upload;

const breadcrumbs = [
  { label: "الرئيسية", href: "/", icon: BarChart3 },
  { label: "دورة المصدر", href: "#", icon: Plus, current: true },
];

const CONTENT_TYPES = [
  { id: 1, title: "مرحلة التأسيس", value: "stage", icon: Files },
  { id: 2, title: "محاضرات", value: "live", icon: VideoIcon },
  { id: 3, title: "اختبارات", value: "exam", icon: FileText },
  { id: 4, title: "المصادر", value: "resources", icon: Book },
];

const VIDEO_SOURCES = [
  { value: "url", label: "رابط (YouTube/Vimeo…)" },
  { value: "file", label: "رفع ملف من الجهاز" },
];

/** ============== تب داخلي مستقل للحالة والمحتوى ============== */
function CourseContentTab({ regionLabel = "السعودية" }) {
  const [form] = Form.useForm();
  const [exams, setExams] = useState([
    {
      id: 1,
      title: `اختبار تأسيس — رقم 1 (${regionLabel})`,
      examType: "training",
      duration: 45,
      questions: 15,
      status: "مسودة",
      visible: true,
    },
  ]);
  const [lessonForm] = Form.useForm();
  const [stageForm] = Form.useForm();
  const [selectedContentType, setSelectedContentType] = useState("stage");
  const [foundationStages, setFoundationStages] = useState([]);
  const [savingStage, setSavingStage] = useState(false);
  const [savingLesson, setSavingLesson] = useState(false);
  const [openAddLesson, setOpenAddLesson] = useState(false);
  const [openAddStage, setOpenAddStage] = useState(false);
  const [openPickExam, setOpenPickExam] = useState(false);
  const [examLibrary, setExamLibrary] = useState([]);
  const [pickForm] = Form.useForm();
  const [openEditResource, setOpenEditResource] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [savingResource, setSavingResource] = useState(false);
  const [resourceForm] = Form.useForm();

  // resources: { id, name, file, fileName, visible }
  const [videos, setVideos] = useState([]);

  const router = useRouter();

  // دورات تجريبية للنسخ
  const availableCourses = [
    { id: 1, title: "دورة الرياضيات المتقدمة" },
    { id: 2, title: "دورة اللغة الإنجليزية" },
    { id: 3, title: "دورة البرمجة للمبتدئين" },
    { id: 4, title: "دورة التصميم الجرافيكي" },
  ];

  const normalizeLibraryExam = (e) => ({
    id: e.id ?? e._id,
    title: e.title ?? "بدون عنوان",
    examType: (e.examType ?? e.type) === "mock" ? "mock" : "training",
    duration: Number(e.duration) || 10,
    questions: Array.isArray(e.questions)
      ? e.questions.length
      : e.questionsCount ?? e.questions ?? 0,
    status: e.status ?? "مسودة",
    visible: !!e.visible,
  });

  const linkSelectedExams = async () => {
    try {
      const v = await pickForm.validateFields();
      const ids = v.examIds || [];
      const toLink = ids
        .map((id) => examLibrary.find((x) => (x.id ?? x._id) === id))
        .filter(Boolean)
        .map(normalizeLibraryExam);

      setExams((prev) => {
        const existing = new Set(prev.map((x) => String(x.id)));
        return [...toLink.filter((x) => !existing.has(String(x.id))), ...prev];
      });

      setOpenPickExam(false);
      pickForm.resetFields();
      message.success("تم ربط الاختبار/الاختبارات بنجاح");
    } catch {
      /* antd validation */
    }
  };

  // نسخ محتوى لدورة أخرى
  const handleCopyToCourse = async (courseId, contentType, contentId = null) => {
    try {
      if (contentType === "exam" && contentId) {
        const contentToCopy = exams.find((exam) => exam.id === contentId);
        console.log(`[${regionLabel}] Copy exam ${contentId} to course ${courseId}`, contentToCopy);
        message.success("تم نسخ الاختبار إلى الدورة المحددة");
      } else if (contentType === "exam") {
        console.log(`[${regionLabel}] Copy all exams`, exams);
        message.success("تم نسخ جميع الاختبارات إلى الدورة المحددة");
      } else if (contentType === "stage" && contentId) {
        const contentToCopy = foundationStages.find((stage) => stage.id === contentId);
        console.log(`[${regionLabel}] Copy stage ${contentId} to course ${courseId}`, contentToCopy);
        message.success("تم نسخ القسم إلى الدورة المحددة");
      } else if (contentType === "stage") {
        console.log(`[${regionLabel}] Copy all stages`, foundationStages);
        message.success("تم نسخ جميع الأقسام إلى الدورة المحددة");
      } else if (contentType === "resources") {
        console.log(`[${regionLabel}] Copy resources`, videos);
        message.success("تم نسخ المصادر إلى الدورة المحددة");
      } else {
        const allContent = { stages: foundationStages, exams, resources: videos };
        console.log(`[${regionLabel}] Copy ALL content`, allContent);
        message.success("تم نسخ المحتوى إلى الدورة المحددة");
      }
    } catch (error) {
      console.error("Error copying content:", error);
      message.error("حدث خطأ أثناء نسخ المحتوى");
    }
  };

  const getCopyMenu = (contentType = "all", contentId = null) => (
    <Menu>
      <Menu.ItemGroup title="نسخ إلى دورة">
        {availableCourses.map((course) => (
          <Menu.Item
            key={course.id}
            onClick={() => handleCopyToCourse(course.id, contentType, contentId)}
            icon={<Copy className="w-4 h-4" />}
          >
            {course.title}
          </Menu.Item>
        ))}
      </Menu.ItemGroup>
    </Menu>
  );

  const normFile = (e) => {
    if (Array.isArray(e)) return e;
    return e && e.fileList;
  };

  const submitStage = async () => {
    try {
      setSavingStage(true);
      const v = await stageForm.validateFields();
      const stage = {
        id: `stg-${Date.now()}`,
        title: v.title.trim(),
        visible: true,
        lessons: [],
      };
      setFoundationStages((prev) => [stage, ...prev]);
      setOpenAddStage(false);
      stageForm.resetFields();
      message.success("تم إضافة المرحلة");
    } catch {
    } finally {
      setSavingStage(false);
    }
  };

  const submitLesson = async () => {
    try {
      setSavingLesson(true);
      const v = await lessonForm.validateFields();

      // resolve stage
      let stageId = v.stageId;
      if (v.stageMode === "new") {
        stageId = `stg-${Date.now()}`;
        setFoundationStages((prev) => [
          { id: stageId, title: v.stageTitle.trim(), visible: true, lessons: [] },
          ...prev,
        ]);
      }

      const lesson = {
        id: `L-${Date.now()}`,
        title: v.title.trim(),
        visible: true,
        lessonVideo: {
          title: v.lessonVideoTitle.trim(),
          source: v.lessonVideoSource,
          ...(v.lessonVideoSource === "url"
            ? { url: v.lessonVideoUrl.trim() }
            : { fileList: v.lessonVideoFile ?? [] }),
        },
        training: {
          video: {
            title: v.trainingVideoTitle.trim(),
            source: v.trainingVideoSource,
            ...(v.trainingVideoSource === "url"
              ? { url: v.trainingVideoUrl.trim() }
              : { fileList: v.trainingVideoFile ?? [] }),
          },
          pdfs: (v.pdfs || []).map((p, idx) => ({
            id: `pdf-${Date.now()}-${idx}`,
            title: p.title.trim(),
            fileList: p.fileList || [],
          })),
        },
      };

      setFoundationStages((prev) =>
        prev.map((st) => (st.id === stageId ? { ...st, lessons: [lesson, ...(st.lessons || [])] } : st))
      );

      setOpenAddLesson(false);
      lessonForm.resetFields();
      message.success("تم إضافة الدرس إلى المرحلة");
    } catch {
    } finally {
      setSavingLesson(false);
    }
  };

  const beforeUploadVideo = () => false;
  const beforeUploadPdf = () => false;

  const stats = {
    stageCount: foundationStages.length,
    lessonCount: foundationStages.reduce((total, stage) => total + (stage.lessons?.length || 0), 0),
  };

  const handleContentTypeChange = (value) => setSelectedContentType(value);

  const onFinish = (values) => {
    console.log(`[${regionLabel}] Form values:`, values);
    message.success("تم حفظ المحتوى بنجاح");
  };

  const onFinishFailed = () => {
    message.error("يرجى مراجعة البيانات المدخلة");
  };

  const deleteStage = (stageId) => {
    setFoundationStages((prev) => prev.filter((stage) => stage.id !== stageId));
    message.success("تم حذف القسم بنجاح");
  };

  const deleteLesson = (stageId, lessonId) => {
    setFoundationStages((prev) =>
      prev.map((stage) =>
        stage.id === stageId
          ? { ...stage, lessons: stage.lessons?.filter((lesson) => lesson.id !== lessonId) || [] }
          : stage
      )
    );
    message.success("تم حذف المحاضرة بنجاح");
  };

  const toggleStageVisibility = (stageId) => {
    setFoundationStages((prev) =>
      prev.map((stage) => (stage.id === stageId ? { ...stage, visible: !stage.visible } : stage))
    );
  };

  const toggleLessonVisibility = (stageId, lessonId) => {
    setFoundationStages((prev) =>
      prev.map((stage) =>
        stage.id === stageId
          ? {
              ...stage,
              lessons:
                stage.lessons?.map((lesson) =>
                  lesson.id === lessonId ? { ...lesson, visible: !lesson.visible } : lesson
                ) || [],
            }
          : stage
      )
    );
  };

  // exams
  const toggleExamVisibility = (examId) => {
    setExams((prev) => prev.map((exam) => (exam.id === examId ? { ...exam, visible: !exam.visible } : exam)));
  };
  const deleteExam = (examId) => {
    setExams((prev) => prev.filter((exam) => exam.id !== examId));
  };

  // resources helpers
  const addResourceQuick = (values) => {
    const name = values.rName?.trim();
    const fileList = values.rFile || [];
    if (!name || fileList.length === 0) {
      message.warning("أدخل اسمًا وارفع ملفًا واحدًا على الأقل");
      return;
    }
    const fileObj = fileList[0]?.originFileObj;
    setVideos((arr) => [
      ...arr,
      { id: Date.now(), name, file: fileObj, fileName: fileObj?.name || "ملف", visible: true },
    ]);
    message.success("تمت إضافة المصدر");
  };

  const toggleResourceVisibility = (id) => {
    setVideos((arr) => arr.map((r) => (r.id === id ? { ...r, visible: !r.visible } : r)));
  };

  const deleteResource = (id) => {
    setVideos((arr) => arr.filter((r) => r.id !== id));
    message.success("تم حذف المصدر");
  };

  const onOpenEditResource = (r) => {
    setEditingResource(r);
    resourceForm.setFieldsValue({
      name: r?.name ?? "",
      rFile: r?.file
        ? [
            {
              uid: String(r.id),
              name: r.fileName || r.file?.name || "ملف",
              status: "done",
              originFileObj: r.file,
            },
          ]
        : [],
      visible: !!r?.visible,
    });
    setOpenEditResource(true);
  };

  const onSubmitEditResource = async () => {
    try {
      const v = await resourceForm.validateFields();
      setSavingResource(true);
      const nextName = v.name?.trim();
      const fileList = v.rFile || [];

      setVideos((arr) =>
        arr.map((r) => {
          if (r.id !== editingResource?.id) return r;
          const newFile = fileList[0]?.originFileObj ?? r.file;
          const newFileName = fileList[0]?.name ?? r.fileName ?? newFile?.name;
          return { ...r, name: nextName, file: newFile, fileName: newFileName, visible: v.visible };
        })
      );

      message.success("تم حفظ تعديلات المصدر");
      setOpenEditResource(false);
      setEditingResource(null);
      resourceForm.resetFields();
    } catch {
    } finally {
      setSavingResource(false);
    }
  };

  const handleDownloadResource = (r) => {
    if (!r?.file) {
      message.warning("لا يوجد ملف مرفوع لهذا المصدر");
      return;
    }
    const url = URL.createObjectURL(r.file);
    const a = document.createElement("a");
    a.href = url;
    a.download = r.fileName || r.file?.name || "resource";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  // Resources UI (within tab)
  const AddSaudiCourseSourceResource = () => {
    const [quickForm] = Form.useForm();

    return (
      <div className="space-y-8">
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-200">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <FolderOutlined className="text-purple-600" />
            المصادر والملفات — {regionLabel}
          </h3>

          {/* Telegram / WhatsApp */}
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label={
                  <span className="font-semibold text-gray-700 flex items-center gap-2">
                    <LinkOutlined className="text-blue-500" />
                    رابط مجموعة التليجرام
                  </span>
                }
                name={["resources", "telegram"]}
              >
                <Input
                  placeholder="https://t.me/groupname"
                  className="rounded-xl"
                  prefix={<LinkOutlined className="text-gray-400" />}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={
                  <span className="font-semibold text-gray-700 flex items-center gap-2">
                    <LinkOutlined className="text-green-500" />
                    رابط مجموعة الواتساب
                  </span>
                }
                name={["resources", "whatsapp"]}
              >
                <Input
                  placeholder="https://chat.whatsapp.com/groupid"
                  className="rounded-xl"
                  prefix={<LinkOutlined className="text-gray-400" />}
                />
              </Form.Item>
            </Col>
          </Row>

          {/* quick add (name + file) */}
          <div className="bg-white rounded-xl p-4 border mb-6">
            <Form form={quickForm} layout="vertical" onFinish={addResourceQuick}>
              <Row gutter={12}>
                <Col xs={24} md={8}>
                  <Form.Item
                    label="اسم المصدر"
                    name="rName"
                    rules={[{ required: true, message: "أدخل اسم المصدر" }]}
                  >
                    <Input placeholder="مثال: دليل المتدرب" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="رفع الملف"
                    name="rFile"
                    valuePropName="fileList"
                    getValueFromEvent={normFile}
                    rules={[{ required: true, message: "ارفع ملف المصدر" }]}
                  >
                    <Dragger beforeUpload={() => false} maxCount={1}>
                      <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                      </p>
                      <p className="ant-upload-text">اسحب الملف هنا أو اضغط للاختيار</p>
                      <p className="ant-upload-hint">ملف واحد فقط — لن نرفعه الآن.</p>
                    </Dragger>
                  </Form.Item>
                </Col>
                <Col xs={24} md={4} className="flex items-end">
                  <AntButton
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => quickForm.submit()}
                    className="w-full bg-blue-500 text-white"
                  >
                    إضافة
                  </AntButton>
                </Col>
              </Row>
            </Form>
          </div>

          {/* list */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <FolderOutlined className="text-blue-600" />
              جميع الموارد المضافة — {regionLabel}
            </h4>

            {videos.length === 0 ? (
              <Empty description="لا توجد موارد بعد" />
            ) : (
              <div className="space-y-3">
                {videos.map((r) => (
                  <div
                    key={r.id}
                    className={`flex items-center justify-between rounded-lg border p-3 ${
                      r.visible ? "bg-gray-50" : "bg-gray-100 opacity-75"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-indigo-100 p-2 text-indigo-700">
                        <Book className="w-4 h-4" />
                      </div>
                      <div>
                        <div className={`font-medium ${r.visible ? "text-gray-800" : "text-gray-500"}`}>
                          {r.name || "بدون اسم"}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center gap-2">
                          <Tag color={r.visible ? "green" : "red"} className="!m-0">
                            {r.visible ? "ظاهر" : "مخفي"}
                          </Tag>
                          {r.file ? (
                            <AntButton
                              type="link"
                              className="!p-0 inline-flex items-center gap-1"
                              onClick={() => handleDownloadResource(r)}
                            >
                              تحميل
                              <Download className="w-3 h-3" />
                            </AntButton>
                          ) : (
                            <span className="text-gray-400">لا يوجد ملف</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <Space>
                      <Tooltip title="تعديل">
                        <AntButton
                          type="text"
                          className="!p-2 hover:!bg-purple-50 !text-green-600"
                          icon={<Edit className="w-4 h-4" />}
                          onClick={() => onOpenEditResource(r)}
                        />
                      </Tooltip>

                      <Tooltip title={r.visible ? "إخفاء" : "إظهار"}>
                        <AntButton
                          type="text"
                          className="!p-2"
                          icon={
                            r.visible ? (
                              <Eye className="w-4 h-4 text-green-600" />
                            ) : (
                              <EyeOff className="w-4 h-4 text-gray-400" />
                            )
                          }
                          onClick={() => toggleResourceVisibility(r.id)}
                        />
                      </Tooltip>

                      <AntButton
                        danger
                        className="!p-2"
                        icon={<Trash2 className="w-4 h-4" />}
                        onClick={() => deleteResource(r.id)}
                      />
                    </Space>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* copy */}
          <div className="mt-6 flex justify-end">
            <Dropdown overlay={getCopyMenu("resources")} trigger={["click"]} placement="bottomRight">
              <AntButton icon={<Copy className="w-4 h-4" />} className="flex items-center gap-2">
                نسخ المصادر إلى دورة
                <ChevronDown className="w-4 h-4" />
              </AntButton>
            </Dropdown>
          </div>
        </div>
      </div>
    );
  };


  const addTrainingFiles = (stageId, lessonId, files) => {
    setFoundationStages((prev) =>
      prev.map((stage) =>
        stage.id === stageId
          ? {
              ...stage,
              lessons:
                stage.lessons?.map((lesson) =>
                  lesson.id === lessonId
                    ? {
                        ...lesson,
                        training: {
                          ...lesson.training,
                          pdfs: [
                            ...(lesson.training?.pdfs || []),
                            ...files.map((file, index) => ({
                              id: Date.now() + index,
                              name: file.name,
                              source: "upload",
                              file,
                            })),
                          ],
                        },
                      }
                    : lesson
                ) || [],
            }
          : stage
      )
    );
    message.success(`تم إضافة ${files.length} ملف بنجاح`);
  };

  const removeTrainingFile = (stageId, lessonId, fileId) => {
    setFoundationStages((prev) =>
      prev.map((stage) =>
        stage.id === stageId
          ? {
              ...stage,
              lessons:
                stage.lessons?.map((lesson) =>
                  lesson.id === lessonId
                    ? {
                        ...lesson,
                        training: {
                          ...lesson.training,
                          pdfs: (lesson.training?.pdfs || []).filter((f) => f.id !== fileId),
                        },
                      }
                    : lesson
                ) || [],
            }
          : stage
      )
    );
    message.success("تم حذف الملف بنجاح");
  };

  const renderFormContent = () => {
    switch (selectedContentType) {
      case "stage":
        return (
          <SaudiCourseSourceBasicLevel
            stats={stats}
            deleteLesson={(sid, lid) => deleteLesson(sid, lid)}
            deleteStage={(sid) => deleteStage(sid)}
            toggleStageVisibility={(sid) => toggleStageVisibility(sid)}
            toggleLessonVisibility={(sid, lid) => toggleLessonVisibility(sid, lid)}
            foundationStages={foundationStages}
            setOpenAddLesson={setOpenAddLesson}
            setOpenAddStage={setOpenAddStage}
            addTrainingFiles={addTrainingFiles}
            removeTrainingFile={removeTrainingFile}
            getCopyMenu={getCopyMenu}
          />
        );
      case "live":
        return (
          <AddSaudiCourseSourceLectures
            stats={stats}
            deleteLesson={deleteLesson}
            deleteStage={deleteStage}
            toggleStageVisibility={toggleStageVisibility}
            toggleLessonVisibility={toggleLessonVisibility}
            foundationStages={foundationStages}
            setOpenAddLesson={setOpenAddLesson}
            setOpenAddStage={setOpenAddStage}
            addTrainingFiles={addTrainingFiles}
            removeTrainingFile={removeTrainingFile}
          />
        );
      case "exam":
        return (
          <AddSaudiCourseSourceExams
            exams={exams}
            setExams={setExams}
            setOpenPickExam={setOpenPickExam}
            toggleExamVisibility={toggleExamVisibility}
            deleteExam={(id) => {
              deleteExam(id);
              message.success("تم حذف الاختبار بنجاح");
            }}
            getCopyMenu={getCopyMenu}
          />
        );
      case "resources":
        return <AddSaudiCourseSourceResource />;
      default:
        return null;
    }
  };

  return (
    <>
      <div style={{ dir: "rtl" }} className="">
        <BreadcrumbsShowcase items={breadcrumbs} variant="pill" />
        <PagesHeader
          title={`إضافة وعرض محتوي الدورة — الواجهة ${regionLabel}`}
          subtitle={`أضف محتوى جديد لدورة المصدر (${regionLabel})`}
          extra={
            <div className="flex gap-2">
              <Dropdown overlay={getCopyMenu()} trigger={["click"]} placement="bottomRight">
                <Button className="!bg-purple-600 hover:!bg-purple-700 !text-white !border-0 shadow-md transition-all duration-200 flex items-center gap-2">
                  <Copy className="w-4 h-4" />
                  نسخ المحتوى
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </Dropdown>
            </div>
          }
        />

        <div className="max-w-6xl mx-auto mt-6">
          <Card>
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              initialValues={{ lectures: [{}] }}
            >
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">نوع المحتوى</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {CONTENT_TYPES.map((type) => (
                    <div
                      key={type.id}
                      onClick={() => handleContentTypeChange(type.value)}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedContentType === type.value
                          ? "border-teal-500 bg-teal-50 text-teal-700"
                          : "border-gray-200 hover:border-teal-300"
                      }`}
                    >
                      <div className="flex flex-col items-center text-center">
                        <type.icon className="w-6 h-6 mb-2" />
                        <span className="text-sm font-medium">{type.title}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {renderFormContent()}

              <Divider />

              <div className="flex justify-end gap-3">
                <Button type="primary" htmltype="submit" icon={<Save className="w-4 h-4" />}>
                  حفظ المحتوى
                </Button>
              </div>
            </Form>
          </Card>
        </div>
      </div>

      {/* Modals for this tab only */}
      <AddCourseLevelModal
        openAddStage={openAddStage}
        savingStage={savingStage}
        setOpenAddStage={setOpenAddStage}
        stageForm={stageForm}
        submitStage={submitStage}
      />

      <AddCourseLessonModal
        VIDEO_SOURCES={VIDEO_SOURCES}
        beforeUploadVideo={beforeUploadVideo}
        beforeUploadPdf={beforeUploadPdf}
        foundationStages={foundationStages}
        lessonForm={lessonForm}
        normFile={normFile}
        openAddLesson={openAddLesson}
        savingLesson={savingLesson}
        setOpenAddLesson={setOpenAddLesson}
        submitLesson={submitLesson}
      />

      {/* Pick Exams Modal */}
      <Modal
        title={`إنشاء اختبار — ${regionLabel}`}
        open={openPickExam}
        onCancel={() => setOpenPickExam(false)}
        onOk={linkSelectedExams}
        okText="حفظ"
        destroyOnClose
      >
        <Form form={pickForm} layout="vertical">
          <Form.Item
            label="اختر اختبار"
            name="examIds"
            rules={[{ required: true, message: "اختر اختبارًا واحدًا على الأقل" }]}
          >
            <Select
              mode="multiple"
              placeholder={
                examLibrary.length
                  ? "اختر من الاختبارات المحفوظة"
                  : "لا توجد اختبارات في المكتبة — أنشئ اختبارًا أولاً"
              }
              optionFilterProp="label"
              options={examLibrary.map((e) => ({
                value: e.id ?? e._id,
                label: `${e.title ?? "بدون عنوان"} · ${
                  (e.examType ?? e.type) === "mock" ? "محاكي" : "تدريب"
                } · ${
                  Array.isArray(e.questions)
                    ? e.questions.length
                    : e.questionsCount ?? e.questions ?? 0
                } سؤال`,
              }))}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Resource Modal */}
      <Modal
        title={`تعديل المصدر — ${regionLabel}`}
        open={openEditResource}
        onCancel={() => {
          setOpenEditResource(false);
          setEditingResource(null);
          resourceForm.resetFields();
        }}
        onOk={onSubmitEditResource}
        okText="حفظ"
        confirmLoading={savingResource}
        destroyOnClose
        width={520}
      >
        <Form form={resourceForm} layout="vertical" initialValues={{ visible: true }}>
          <Form.Item label="اسم المصدر" name="name" rules={[{ required: true, message: "أدخل اسم المصدر" }]}>
            <Input placeholder="مثال: دليل المتدرب" />
          </Form.Item>

          <Form.Item
            label="استبدال الملف (اختياري)"
            name="rFile"
            valuePropName="fileList"
            getValueFromEvent={normFile}
          >
            <Dragger beforeUpload={() => false} maxCount={1}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">اسحب ملفًا هنا أو اضغط للاختيار</p>
              <p className="ant-upload-hint">اتركه فارغًا إذا كنت لا تريد تغيير الملف الحالي.</p>
            </Dragger>
          </Form.Item>

          <Form.Item label="إظهار" name="visible" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

/** ============== الصفحة الرئيسية: تبويب مصري/سعودي ============== */
export default function AddCourseContentPage() {
  return (
    <PageLayout>
      <Tabs
        defaultActiveKey="sa"
        centered 
          
        className=""
        items={[
          {
            key: "sa",
            label: "الواجهة السعودية",
            children: <CourseContentTab regionLabel="السعودية" />,
          },
          {
            key: "eg",
            label: "الواجهة المصرية",
            children: <CourseContentTab regionLabel="المصرية" />,
          },
        ]}
      />
    </PageLayout>
  );
}
