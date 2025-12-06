"use client";

import React, { useEffect, useState } from "react";
import {
  PlusOutlined,
  BookOutlined,
  FileTextOutlined,
  InboxOutlined,
  DeleteOutlined,
  PlayCircleOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  UserOutlined,
  DollarOutlined,
  TeamOutlined,
  FolderOutlined,
  SettingOutlined,
  LinkOutlined,
  FileAddOutlined,
} from "@ant-design/icons";
import {
  Modal,
  Form,
  Input,
  Select,
  Button,
  ConfigProvider,
  message,
  DatePicker,
  InputNumber,
  Upload,
  Row,
  Col,
  Card,
  Rate,
  Divider,
  TimePicker,
  Tag,
  Badge,
  Tooltip,
  Space,
  Switch,
} from "antd";
import dayjs from "dayjs";
import "react-quill-new/dist/quill.snow.css";
import dynamic from "next/dynamic";
import AddTeacherCourseContent from "@/components/TeacherCourses/AddTeacherCourseContent/AddTeacherCourseContent";
import AddCourseResources from "@/components/TeacherCourses/AddCourseResources/AddCourseResources";
import AddCourseSchedule from "@/components/TeacherCourses/AddCourseSchedule/AddCourseSchedule";
import AddEgyptianCourseBasicInfo from "../../../../components/EgyptianCourses/AddEgyptianCourseBasicInfo/AddEgyptianCourseBasicInfo";
import AddEgyptianCourseSchedule from "../../../../components/EgyptianCourses/AddEgyptianCourseSchedule/AddEgyptianCourseSchedule";
import AddEgyptianCourseContent from "../../../../components/EgyptianCourses/AddEgyptainCourseContent/AddEgyptainCourseContent";
import AddEgyptianCourseResources from "../../../../components/EgyptianCourses/AddEgyptianCourseResources/AddEgyptianCourseResources";
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

// Updated categories with sections based on requirements
const all_categories = [
  {
    id: 1,
    title: "أبناؤنا في الخارج",
    sections: [
      { id: 1, name: "KG1", isVisible: true },
      { id: 2, name: "KG2", isVisible: true },
      { id: 3, name: "ابتدائي", isVisible: true },
      { id: 4, name: "اعدادي", isVisible: true },
      { id: 5, name: "ثانوي", isVisible: true },
    ],
  },
  {
    id: 2,
    title: "العام",
    sections: [
      { id: 1, name: "ابتدائي", isVisible: true },
      { id: 2, name: "اعدادي", isVisible: true },
      { id: 3, name: "ثانوي", isVisible: true },
    ],
  },
  {
    id: 3,
    title: "الأزهر",
    sections: [
      { id: 1, name: "ابتدائي", isVisible: true },
      { id: 2, name: "اعدادي", isVisible: true },
      { id: 3, name: "ثانوي", isVisible: true },
    ],
  },
  {
    id: 4,
    title: "أقسام اخري",
    sections: [
      { id: 1, name: "مبتدئ", isVisible: true },
      { id: 2, name: "متوسط", isVisible: true },
      { id: 3, name: "متقدم", isVisible: true },
    ],
  },
];

// Grade levels for each section
const gradeLevels = {
  ابتدائي: [
    { id: 1, name: "أول ابتدائي (عربي)", value: "first_arabic" },
    { id: 2, name: "أول ابتدائي (لغات)", value: "first_languages" },
    { id: 3, name: "ثاني ابتدائي (عربي)", value: "second_arabic" },
    { id: 4, name: "ثاني ابتدائي (لغات)", value: "second_languages" },
    { id: 5, name: "ثالث ابتدائي (عربي)", value: "third_arabic" },
    { id: 6, name: "ثالث ابتدائي (لغات)", value: "third_languages" },
    { id: 7, name: "رابع ابتدائي (عربي)", value: "fourth_arabic" },
    { id: 8, name: "رابع ابتدائي (لغات)", value: "fourth_languages" },
    { id: 9, name: "خامس ابتدائي (عربي)", value: "fifth_arabic" },
    { id: 10, name: "خامس ابتدائي (لغات)", value: "fifth_languages" },
    { id: 11, name: "سادس ابتدائي (عربي)", value: "sixth_arabic" },
    { id: 12, name: "سادس ابتدائي (لغات)", value: "sixth_languages" },
  ],
  اعدادي: [
    { id: 1, name: "أول إعدادي (عربي)", value: "first_prep_arabic" },
    { id: 2, name: "أول إعدادي (لغات)", value: "first_prep_languages" },
    { id: 3, name: "ثاني إعدادي (عربي)", value: "second_prep_arabic" },
    { id: 4, name: "ثاني إعدادي (لغات)", value: "second_prep_languages" },
    { id: 5, name: "ثالث إعدادي (عربي)", value: "third_prep_arabic" },
    { id: 6, name: "ثالث إعدادي (لغات)", value: "third_prep_languages" },
  ],
  ثانوي: [
    { id: 1, name: "أول ثانوي (عربي)", value: "first_secondary_arabic" },
    { id: 2, name: "أول ثانوي (لغات)", value: "first_secondary_languages" },
    { id: 3, name: "ثاني ثانوي (عربي)", value: "second_secondary_arabic" },
    { id: 4, name: "ثاني ثانوي (لغات)", value: "second_secondary_languages" },
    { id: 5, name: "ثالث ثانوي (عربي)", value: "third_secondary_arabic" },
    { id: 6, name: "ثالث ثانوي (لغات)", value: "third_secondary_languages" },
  ],
  KG1: [
    { id: 1, name: "KG1 (عربي)", value: "kg1_arabic" },
    { id: 2, name: "KG1 (لغات)", value: "kg1_languages" },
  ],
  KG2: [
    { id: 1, name: "KG2 (عربي)", value: "kg2_arabic" },
    { id: 2, name: "KG2 (لغات)", value: "kg2_languages" },
  ],
  // Default empty array for sections that don't have grade levels
  default: [],
};

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ align: ["", "center", "right", "justify"] }],
    [{ direction: "rtl" }],
    [{ color: [] }, { background: [] }],
    ["link", "blockquote", "code-block"],
    ["clean"],
  ],
};

const quillFormats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "list",
  "align",
  "direction",
  "color",
  "background",
  "link",
  "blockquote",
  "code-block",
];

const RichTextField = ({ value, onChange, placeholder }) => (
  <div dir="rtl" className="rich-text-field">
    <ReactQuill
      className="ql-rtl"
      theme="snow"
      value={value}
      onChange={(html) => onChange?.(html)}
      modules={quillModules}
      formats={quillFormats}
      placeholder={placeholder}
      style={{ minHeight: "120px" }}
    />
  </div>
);

// Helper: convert file -> base64
const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });

const EnhancedCourseForm = ({ open, setOpen }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(1);
  const [fileList, setFileList] = useState([]);
  const [fileNames, setFileNames] = useState({}); // uid -> custom name
  const [videos, setVideos] = useState([{ id: 1, name: "", url: "" }]);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [availableSections, setAvailableSections] = useState([]);
  const [availableGrades, setAvailableGrades] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [newSchedule, setNewSchedule] = useState({
    day: "",
    date: "",
    startTime: null,
    endTime: null,
    maxStudents: 30,
    isActive: true,
  });

  // Update sections when category changes
  useEffect(() => {
    if (selectedCategory) {
      const category = all_categories.find(
        (cat) => cat.id === selectedCategory
      );
      if (category) {
        setAvailableSections(
          category.sections.filter((section) => section.isVisible)
        );
      }
    } else {
      setAvailableSections([]);
    }
    setSelectedSection(null);
    setAvailableGrades([]);
  }, [selectedCategory]);

  // Update grades when section changes
  useEffect(() => {
    if (selectedSection) {
      const section = availableSections.find(
        (sec) => sec.id === selectedSection
      );
      if (section && gradeLevels[section.name]) {
        setAvailableGrades(gradeLevels[section.name]);
      } else {
        setAvailableGrades(gradeLevels.default);
      }
    } else {
      setAvailableGrades([]);
    }
  }, [selectedSection, availableSections]);

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
    return false;
  };

  const onFilesChange = ({ fileList }) => {
    setFileList(fileList);
    setFileNames((prev) => {
      const next = { ...prev };
      fileList.forEach((f) => {
        if (f.uid && !next[f.uid])
          next[f.uid] = f.name?.replace(/\.[^.]+$/, "") || "";
      });
      // remove stale uids
      Object.keys(next).forEach((uid) => {
        if (!fileList.find((f) => f.uid === uid)) delete next[uid];
      });
      return next;
    });
  };

  const handleAddSchedule = () => {
    if (newSchedule.date && newSchedule.startTime && newSchedule.endTime) {
      const schedule = {
        ...newSchedule,
        startTime: newSchedule.startTime.format("HH:mm"),
        endTime: newSchedule.endTime.format("HH:mm"),
      };
      setSchedules([...schedules, schedule]);
      setNewSchedule({
        day: "",
        startTime: null,
        endTime: null,
        maxStudents: 30,
        isActive: true,
      });
      message.success("تم إضافة الجدولة بنجاح!");
    } else {
      message.error("يجب إدخال جميع البيانات المطلوبة.");
    }
  };

  const handleUpdateSchedule = (index, updatedSchedule) => {
    const newSchedules = [...schedules];
    newSchedules[index] = {
      ...updatedSchedule,
      startTime: updatedSchedule.startTime?.format
        ? updatedSchedule.startTime.format("HH:mm")
        : updatedSchedule.startTime,
      endTime: updatedSchedule.endTime?.format
        ? updatedSchedule.endTime.format("HH:mm")
        : updatedSchedule.endTime,
    };
    setSchedules(newSchedules);
    message.success("تم تحديث الجدولة بنجاح!");
  };

  const handleRemoveSchedule = (index) => {
    const newSchedules = [...schedules];
    newSchedules.splice(index, 1);
    setSchedules(newSchedules);
    message.success("تم حذف الجدولة بنجاح!");
  };

  const handleFinish = async () => {
    setLoading(true);
    try {
      const raw = form.getFieldsValue(true);

      const payload = {
        code: raw.code?.toUpperCase(),
        imageUrl: imagePreview,
        name: raw.name?.trim(),
        category: raw.category,
        section: raw.section,
        grade: raw.grade,
        price: Number(raw.price ?? 0),
        duration: raw.duration?.trim(),
        description: raw.description?.trim(),
        status: raw.status,
        genderPolicy: raw.genderPolicy,
        capacity: Number(raw.capacity ?? 0),
        instructor: raw.instructor,
        availableFrom: raw.availableRange?.[0]
          ? dayjs(raw.availableRange[0]).format("YYYY-MM-DD")
          : undefined,
        availableTo: raw.availableRange?.[1]
          ? dayjs(raw.availableRange[1]).format("YYYY-MM-DD")
          : undefined,
        summary: raw.summary || "",
        schedules: schedules,
        resources: {
          files: (raw.resources?.files || []).map((f) => ({
            // preserve original file object where possible
            uid: f.uid,
            name: fileNames[f.uid] ?? f.name,
            originName: f.name,
            type: f.type,
          })),
          telegram: raw.resources?.telegram || "",
          whatsapp: raw.resources?.whatsapp || "",
          videos: videos
            .filter((v) => v.url?.trim())
            .map((v) => ({ name: v.name?.trim() || "", url: v.url.trim() })),
        },
      };

      await new Promise((r) => setTimeout(r, 1500));
      console.log("Enhanced Form Data:", payload);
      message.success("تمت إضافة الدورة بنجاح!");
      handleReset();
      setOpen(false);
    } catch (e) {
      message.error("فشل إضافة الدورة. حاول مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    form.resetFields();
    setFileList([]);
    setImagePreview(null);
    setSelectedCategory(null);
    setSelectedSection(null);
    setAvailableSections([]);
    setAvailableGrades([]);
    setSchedules([]);
    setNewSchedule({
      day: "",
      startTime: null,
      endTime: null,
      maxStudents: 30,
      isActive: true,
    });
  };

  const tabItems = [
    { key: 1, label: "المعلومات الأساسية", icon: <BookOutlined /> },
    { key: 2, label: "الجدولة والمواعيد", icon: <CalendarOutlined /> },
    { key: 3, label: "المحتوى التفصيلي", icon: <FileTextOutlined /> },
    { key: 4, label: "المصادر والملفات", icon: <FolderOutlined /> },
  ];

  return (
    <div
      className="bg-gradient-to-br from-gray-50 to-blue-50/30 min-h-[80vh]"
      dir="rtl"
    >
      {/* Enhanced Header */}
      <div className="relative mb-8 p-6 bg-white rounded-2xl shadow-sm border-b-4 border-b-blue-500">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="relative flex items-center gap-4 mb-3">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
            <PlusOutlined className="text-white text-xl" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-blue-800 bg-clip-text text-transparent">
              إضافة دورة جديدة
            </h1>
            <p className="text-gray-600 mt-1">
              إنشاء وتكوين دورة تعليمية شاملة مع الجدولة والمحتوى
            </p>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center gap-2 mt-4">
          {tabItems.map((tab, index) => (
            <div
              key={tab.key}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer
                ${
                  activeTab === tab.key
                    ? "bg-blue-100 text-blue-700 border border-blue-200"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          initialValues={{
            code:
              "COURSE_" + Math.random().toString(36).substr(2, 6).toUpperCase(),
            name: "",
            category: null,
            section: null,
            grade: null,
            price: 499,
            duration: "3 شهور",
            description: "",
            status: "نشط",
            genderPolicy: "both",
            capacity: 50,
            instructor: [],
            availableRange: [dayjs().add(1, "week"), dayjs().add(3, "month")],
            summary: "",
          }}
          className="p-8"
        >
          {/* Basic Information Tab */}
          {activeTab === 1 && (
            <AddEgyptianCourseBasicInfo
              all_categories={all_categories}
              availableSections={availableSections}
              availableGrades={availableGrades}
              beforeUpload={beforeUpload}
              fileList={fileList}
              selectedCategory={selectedCategory}
              selectedSection={selectedSection}
              setFileList={setFileList}
              setImagePreview={setImagePreview}
              setSelectedCategory={setSelectedCategory}
              setSelectedSection={setSelectedSection}
            />
          )}

          {/* Schedule Tab */}
          {activeTab === 2 && (
            <AddEgyptianCourseSchedule
              handleAddSchedule={handleAddSchedule}
              handleRemoveSchedule={handleRemoveSchedule}
              handleUpdateSchedule={handleUpdateSchedule}
              newSchedule={newSchedule}
              schedules={schedules}
              setNewSchedule={setNewSchedule}
            />
          )}

          {/* Content Tab */}
          {activeTab === 3 && (
            <div className="space-y-8">
              <div className="rounded-2xl p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <FileTextOutlined className="text-green-600" />
                  المحتوى التفصيلي للدورة
                </h3>

                <Form.Item
                  label={
                    <span className="font-semibold text-gray-700">
                      ملخص الدورة
                    </span>
                  }
                  name="summary"
                >
                  <RichTextField placeholder="اكتب ملخصاً شاملاً للدورة يتضمن الأهداف التعليمية والمخرجات المتوقعة..." />
                </Form.Item>

                <Form.Item
                  label={
                    <span className="font-semibold text-gray-700">
                      الشروط والأحكام
                    </span>
                  }
                  name="privacy"
                >
                  <RichTextField placeholder="حدد الشروط والأحكام الخاصة بالدورة..." />
                </Form.Item>

                <Form.Item
                  label={
                    <span className="font-semibold text-gray-700">
                      مميزات الدورة
                    </span>
                  }
                  name="benefits"
                >
                  <RichTextField placeholder={"اكتب مميزات الدورة ...."} />
                </Form.Item>

                <Divider />

                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <PlayCircleOutlined className="text-blue-600" />
                    المحتوى التعليمي
                  </h4>
                  <p className="text-gray-600 mb-4">
                    يمكنك إضافة المحتوى التعليمي التفصيلي (الدروس، الفيديوهات،
                    الاختبارات) بعد إنشاء الدورة
                  </p>
                  <AddEgyptianCourseContent
                    courseId={null}
                    onContentAdded={(content) =>
                      console.log("Content added:", content)
                    }
                  />
                </div>
              </div>
            </div>
          )}

          {/* Resources Tab */}
          {activeTab === 4 && (
            <AddEgyptianCourseResources setVideos={setVideos} videos={videos} />
          )}

          {/* Navigation and Actions */}
          <div className="flex items-center justify-between pt-8 border-t border-gray-200">
            <div className="flex items-center gap-3">
              {activeTab > 1 && (
                <Button
                  size="large"
                  onClick={() => setActiveTab(activeTab - 1)}
                  className="rounded-xl"
                  icon={<span>←</span>}
                >
                  السابق
                </Button>
              )}
            </div>

            <div className="flex items-center gap-3">
              {activeTab < 4 ? (
                <Button
                  type="primary"
                  size="large"
                  onClick={() => setActiveTab(activeTab + 1)}
                  className="rounded-xl !bg-blue-500"
                  icon={<span>→</span>}
                >
                  التالي
                </Button>
              ) : (
                <Button
                  type="primary"
                  size="large"
                  htmltype="submit"
                  loading={loading}
                  className="rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                  icon={<PlusOutlined />}
                >
                  إنشاء الدورة
                </Button>
              )}
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default EnhancedCourseForm;
