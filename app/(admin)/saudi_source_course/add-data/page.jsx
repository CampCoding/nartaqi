"use client";
import React, { useState } from "react";
import {
  BarChart3,
  Book,
  Files,
  Plus,
  X,
  Save,
  Video,
  FileText,
  Link,
  Copy,
  ChevronDown,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Card,
  Form,
  Input,
  Select,
  Switch,
  TimePicker,
  Upload as AntUpload,
  message,
  Divider,
  Row,
  Col,
  Button as AntButton,
  Collapse,
  Dropdown,
  Menu,
  Modal
} from "antd";
import {
  InboxOutlined,
  PlusOutlined,
  MinusCircleOutlined,
  EyeOutlined,
  DownloadOutlined,
  PlayCircleOutlined,
  FolderOutlined,
  SettingOutlined,
  LinkOutlined,
} from "@ant-design/icons";
import PageLayout from "../../../../components/layout/PageLayout";
import BreadcrumbsShowcase from "../../../../components/ui/BreadCrumbs";
import PagesHeader from "../../../../components/ui/PagesHeader";
import Button from "../../../../components/atoms/Button";
import SaudiCourseSourceBasicLevel from "../../../../components/SaudiCourseSource/SaudiCourseSourceBasicLevel";
import AddCourseLevelModal from "../../../../components/TeacherCourses/AddTeacherCourseContent/AddCourseLevelModal";
import AddCourseLessonModal from "../../../../components/TeacherCourses/AddTeacherCourseContent/AddCourseLessonModal";
import AddSaudiCourseSourceLectures from "../../../../components/SaudiCourseSource/AddSaudiCourseSourceLectures";
import AddSaudiCourseSourceExams from "../../../../components/SaudiCourseSource/AddSaudiCourseSourceExams";

const { Dragger } = AntUpload;

const breadcrumbs = [
  { label: "الرئيسية", href: "/", icon: BarChart3 },
  { label: "دورة المصدر", href: "#", icon: Plus, current: true },
];

const CONTENT_TYPES = [
  { id: 1, title: "مرحلة التأسيس", value: "stage", icon: Files },
  { id: 2, title: "محاضرات", value: "live", icon: Video },
  { id: 3, title: "اختبارات", value: "exam", icon: FileText },
  { id: 4, title: "المصادر", value: "resources", icon: Book },
];

const VIDEO_SOURCES = [
  { value: "url", label: "رابط (YouTube/Vimeo…)" },
  { value: "file", label: "رفع ملف من الجهاز" },
];

export default function AddCourseContentPage() {
  const [form] = Form.useForm();
  const [exams, setExams] = useState([
    {
      id: 1,
      title: "اختبار تأسيس — رقم 1",
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
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [foundationStages, setFoundationStages] = useState([]);
  const [savingStage, setSavingStage] = useState(false);
  const [savingLesson, setSavingLesson] = useState(false);
  const [openAddLesson, setOpenAddLesson] = useState(false);
  const [openAddStage, setOpenAddStage] = useState(false);
  const [openPickExam, setOpenPickExam] = useState(false);
  const [examLibrary, setExamLibrary] = useState([]);
  const [videos, setVideos] = useState([]); // Added videos state
  const router = useRouter();
  const [pickForm] = Form.useForm();

  // Sample courses data - replace with your actual courses data
  const availableCourses = [
    { id: 1, title: "دورة الرياضيات المتقدمة" },
    { id: 2, title: "دورة اللغة الإنجليزية" },
    { id: 3, title: "دورة البرمجة للمبتدئين" },
    { id: 4, title: "دورة التصميم الجرافيكي" },
  ];

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
      // antd handles validation
    }
  };

  // Function to copy content to another course
  const handleCopyToCourse = async (courseId, contentType, contentId = null) => {
    try {
      let contentToCopy = null;
      
      // Determine what content to copy based on the type
      if (contentType === "exam" && contentId) {
        // Copy specific exam
        contentToCopy = exams.find(exam => exam.id === contentId);
        console.log(`Copying exam ${contentId} to course ${courseId}`, contentToCopy);
        message.success("تم نسخ الاختبار إلى الدورة المحددة");
      } else if (contentType === "exam") {
        // Copy all exams
        console.log(`Copying all exams to course ${courseId}`, exams);
        message.success("تم نسخ جميع الاختبارات إلى الدورة المحددة");
      } else if (contentType === "stage" && contentId) {
        // Copy specific stage
        contentToCopy = foundationStages.find(stage => stage.id === contentId);
        console.log(`Copying stage ${contentId} to course ${courseId}`, contentToCopy);
        message.success("تم نسخ القسم إلى الدورة المحددة");
      } else if (contentType === "stage") {
        // Copy all stages
        console.log(`Copying all stages to course ${courseId}`, foundationStages);
        message.success("تم نسخ جميع الأقسام إلى الدورة المحددة");
      } else if (contentType === "resources") {
        // Copy resources
        console.log(`Copying resources to course ${courseId}`, videos);
        message.success("تم نسخ المصادر إلى الدورة المحددة");
      } else {
        // Copy all content
        const allContent = {
          stages: foundationStages,
          exams: exams,
          resources: videos
        };
        console.log(`Copying all content to course ${courseId}`, allContent);
        message.success("تم نسخ المحتوى إلى الدورة المحددة");
      }
      
      // Here you would typically make an API call to save the content to the target course
      // await api.copyContentToCourse(courseId, contentToCopy, contentType);
      
    } catch (error) {
      console.error("Error copying content:", error);
      message.error("حدث خطأ أثناء نسخ المحتوى");
    }
  };

  // Create dropdown menu for copying options
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

  // Added missing normFile function
  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
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
      // handled by antd
    } finally {
      setSavingStage(false);
    }
  };

  // Added missing submitLesson function
  const submitLesson = async () => {
    try {
      setSavingLesson(true);
      const v = await lessonForm.validateFields();

      // إنشاء/تحديد المرحلة المستهدفة
      let stageId = v.stageId;
      if (v.stageMode === "new") {
        stageId = `stg-${Date.now()}`;
        setFoundationStages((prev) => [
          {
            id: stageId,
            title: v.stageTitle.trim(),
            visible: true,
            lessons: [],
          },
          ...prev,
        ]);
      }

      // تكوين الدرس
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

      // إدراج الدرس داخل المرحلة المستهدفة
      setFoundationStages((prev) =>
        prev.map((st) =>
          st.id === stageId
            ? { ...st, lessons: [lesson, ...(st.lessons || [])] }
            : st
        )
      );

      setOpenAddLesson(false);
      lessonForm.resetFields();
      message.success("تم إضافة الدرس إلى المرحلة");
    } catch {
      // handled by antd
    } finally {
      setSavingLesson(false);
    }
  };

  const beforeUploadVideo = () => false;
  const beforeUploadPdf = () => false;

  // إحصائيات المحتوى
  const stats = {
    stageCount: foundationStages.length,
    lessonCount: foundationStages.reduce(
      (total, stage) => total + (stage.lessons?.length || 0),
      0
    ),
  };

  const handleContentTypeChange = (value) => {
    setSelectedContentType(value);
  };

  const onFinish = (values) => {
    console.log("Form values:", values);
    // Handle form submission
    message.success("تم حفظ المحتوى بنجاح");
    // router.push("/saudi_source_course");
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    message.error("يرجى مراجعة البيانات المدخلة");
  };

  const handleFileUpload = (info, lectureIndex) => {
    const { status } = info.file;

    if (status === "uploading") {
      return;
    }

    if (status === "done") {
      message.success(`${info.file.name} تم رفع الملف بنجاح`);

      // حفظ الملفات المرفوعة لكل محاضرة
      setUploadedFiles((prev) => {
        const currentFiles = prev[lectureIndex] || [];
        return {
          ...prev,
          [lectureIndex]: [
            ...currentFiles,
            {
              uid: info.file.uid,
              name: info.file.name,
              url:
                info.file.response?.url ||
                URL.createObjectURL(info.file.originFileObj),
            },
          ],
        };
      });
    } else if (status === "error") {
      message.error(`${info.file.name} فشل في رفع الملف`);
    }
  };

  const handleFileRemove = (file, lectureIndex) => {
    setUploadedFiles((prev) => {
      const currentFiles = prev[lectureIndex] || [];
      return {
        ...prev,
        [lectureIndex]: currentFiles.filter((f) => f.uid !== file.uid),
      };
    });
  };

  const uploadProps = (lectureIndex) => ({
    name: "file",
    multiple: true,
    action: "/api/upload",
    onChange: (info) => handleFileUpload(info, lectureIndex),
    onRemove: (file) => handleFileRemove(file, lectureIndex),
    accept: ".pdf",
    showUploadList: false,
  });

  // وظائف إدارة مرحلة التأسيس
  const deleteStage = (stageId) => {
    setFoundationStages((prev) => prev.filter((stage) => stage.id !== stageId));
    message.success("تم حذف القسم بنجاح");
  };

  const deleteLesson = (stageId, lessonId) => {
    setFoundationStages((prev) =>
      prev.map((stage) =>
        stage.id === stageId
          ? {
              ...stage,
              lessons:
                stage.lessons?.filter((lesson) => lesson.id !== lessonId) || [],
            }
          : stage
      )
    );
    message.success("تم حذف المحاضرة بنجاح");
  };

  const toggleStageVisibility = (stageId) => {
    setFoundationStages((prev) =>
      prev.map((stage) =>
        stage.id === stageId ? { ...stage, visible: !stage.visible } : stage
      )
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
                  lesson.id === lessonId
                    ? { ...lesson, visible: !lesson.visible } : lesson
                ) || [],
            }
          : stage
      )
    );
  };

  // وظائف إدارة الاختبارات
  const toggleExamVisibility = (examId) => {
    setExams((prev) =>
      prev.map((exam) =>
        exam.id === examId ? { ...exam, visible: !exam.visible } : exam
      )
    );
  };

  const deleteExam = (examId) => {
    setExams((prev) => prev.filter((exam) => exam.id !== examId));
    message.success("تم حذف الاختبار بنجاح");
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
                              file: file,
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
                          pdfs: (lesson.training?.pdfs || []).filter(
                            (file) => file.id !== fileId
                          ),
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

  // Component for rendering resources form
  const AddSaudiCourseSourceResource = () => (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-200">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          <FolderOutlined className="text-purple-600" />
          المصادر والملفات
        </h3>

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

        <div>
          <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <FolderOutlined className="text-blue-600" />
            ملفات إضافية
          </h4>
          <div className="space-y-3">
            {videos.map((v, idx) => (
              <div key={v.id} className="grid grid-cols-1 md:grid-cols-5 gap-3">
                <div className="md:col-span-2">
                  <Input
                    value={v.name}
                    onChange={(e) =>
                      setVideos((arr) =>
                        arr.map((x, i) =>
                          i === idx ? { ...x, name: e.target.value } : x
                        )
                      )
                    }
                    placeholder="اسم الملف"
                    className="rounded-lg"
                  />
                </div>
                <div className="md:col-span-3">
                  <Input
                    type="file"
                    onChange={(e) =>
                      setVideos((arr) =>
                        arr.map((x, i) =>
                          i === idx ? { ...x, url: e.target.value } : x
                        )
                      )
                    }
                    placeholder="رابط الفيديو (يوتيوب/منصة)"
                    className="rounded-lg"
                  />
                </div>
              </div>
            ))}
          </div>
          <AntButton
            className="mt-3"
            onClick={() =>
              setVideos((arr) => [
                ...arr,
                { id: Date.now(), name: "", url: "" },
              ])
            }
            icon={<PlusOutlined />}
          >
            إضافة ملف
          </AntButton>
        </div>
        
        {/* Copy resources dropdown */}
        <div className="mt-6 flex justify-end">
          <Dropdown
            overlay={getCopyMenu("resources")}
            trigger={["click"]}
            placement="bottomRight"
          >
            <AntButton 
              icon={<Copy className="w-4 h-4" />}
              className="flex items-center gap-2"
            >
              نسخ المصادر إلى دورة
              <ChevronDown className="w-4 h-4" />
            </AntButton>
          </Dropdown>
        </div>
      </div>
    </div>
  );

  const renderFormContent = () => {
    switch (selectedContentType) {
      case "stage":
        return (
          <SaudiCourseSourceBasicLevel
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
            deleteExam={deleteExam}
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
    <PageLayout>
      <div style={{ dir: "rtl" }} className="p-6">
        <BreadcrumbsShowcase items={breadcrumbs} variant="pill" />
        <PagesHeader
          title={"إضافة محتوى جديد"}
          subtitle={"أضف محتوى جديد لدورة المصدر"}
          extra={
            <div className="flex gap-2">
              {/* Copy All Content Dropdown */}
              <Dropdown
                overlay={getCopyMenu()}
                trigger={["click"]}
                placement="bottomRight"
              >
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  نوع المحتوى
                </label>
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
                        <span className="text-sm font-medium">
                          {type.title}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {renderFormContent()}

              <Divider />

              <div className="flex justify-end gap-3">
                
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<Save className="w-4 h-4" />}
                >
                  حفظ المحتوى
                </Button>
              </div>
            </Form>
          </Card>
        </div>
      </div>

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

      <Modal
        title="إنشاء اختبار"
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
            rules={[
              { required: true, message: "اختر اختبارًا واحدًا على الأقل" },
            ]}
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
    </PageLayout>
  );
}