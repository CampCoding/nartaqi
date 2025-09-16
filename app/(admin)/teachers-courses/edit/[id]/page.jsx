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
  EditOutlined,
  SaveOutlined
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
  Steps,
  Tabs
} from "antd";
import dayjs from "dayjs";
import "react-quill-new/dist/quill.snow.css";
import dynamic from "next/dynamic";
import AddTeacherCourseContent from "@/components/TeacherCourses/AddTeacherCourseContent/AddTeacherCourseContent";
import AddCourseResources from "@/components/TeacherCourses/AddCourseResources/AddCourseResources";
import AddCourseBasicInfo from "@/components/TeacherCourses/AddCourseBasicInfo/AddCourseBasicInfo";
import AddCourseSchedule from "@/components/TeacherCourses/AddCourseSchedule/AddCourseSchedule";
import { useParams } from "next/navigation";
import { subjects } from "../../../../../data/subjects";
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

// Mock data for categories with sections
const all_categories = [
  {
    id: 1,
    title: "دورات عامة",
    sections: [
      { id: 1, name: "تطوير الويب", isVisible: true },
      { id: 2, name: "تطوير التطبيقات", isVisible: true },
      { id: 3, name: "الذكاء الاصطناعي", isVisible: true },
    ],
  },
  {
    id: 2,
    title: "الرخصة المهنية",
    sections: [
      { id: 4, name: "تصميم UI/UX", isVisible: true },
      { id: 5, name: "الجرافيك ديزاين", isVisible: true },
      { id: 6, name: "الرسم الرقمي", isVisible: false },
    ],
  },
  {
    id: 3,
    title: "دورات اخري",
    sections: [
      { id: 7, name: "الرياضيات المتقدمة", isVisible: true },
      { id: 8, name: "الفيزياء", isVisible: true },
      { id: 9, name: "الكيمياء", isVisible: true },
    ],
  },
];

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
  "header", "bold", "italic", "underline", "strike", "list",
  "align", "direction", "color", "background", "link", "blockquote", "code-block",
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

const Page = () => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(1);
  const [fileList, setFileList] = useState([]);
  const [fileNames, setFileNames] = useState({});
  const [videos, setVideos] = useState([{ id: 1, name: "", url: "" }]);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [availableSections, setAvailableSections] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [newSchedule, setNewSchedule] = useState({
    day: "",
    date: "",
    startTime: null,
    endTime: null,
    maxStudents: 30,
    isActive: true,
  });
  const [rowData, setRowData] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const subject = subjects?.find(item => item?.code == id);
    if (subject) {
      setRowData(subject);
      // تعبئة النموذج بالبيانات الموجودة
      form.setFieldsValue({
        name: subject.name,
        price: subject.price,
        category: subject.category,
        section: subject.section,
        description: subject.description,
        genderPolicy: subject.genderPolicy,
        capacity: subject.capacity,
        instructor: subject.instructor,
        availableRange: subject.availableRange ? 
          [dayjs(subject.availableRange[0]), dayjs(subject.availableRange[1])] : undefined,
        summary: subject.summary,
        privacy: subject.privacy,
        benefits: subject.benefits
      });
      
      // تعبئة الجداول إذا كانت موجودة
      if (subject.schedules) {
        setSchedules(subject.schedules);
      }
      
      // تعبئة الفيديوهات إذا كانت موجودة
      if (subject.resources?.videos) {
        setVideos(subject.resources.videos);
      }
    }
  }, [subjects, id, form]);

  // Update sections when category changes
  useEffect(() => {
    if (selectedCategory) {
      const category = all_categories.find(cat => cat.id === selectedCategory);
      if (category) {
        setAvailableSections(category.sections.filter(section => section.isVisible));
      }
    } else {
      setAvailableSections([]);
    }
  }, [selectedCategory]);

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
      startTime: updatedSchedule.startTime?.format ? 
        updatedSchedule.startTime.format("HH:mm") : updatedSchedule.startTime,
      endTime: updatedSchedule.endTime?.format ? 
        updatedSchedule.endTime.format("HH:mm") : updatedSchedule.endTime,
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
        ...rowData, // الحفاظ على البيانات الحالية
        code: raw.code?.toUpperCase() || rowData.code,
        imageUrl: imagePreview || rowData.imageUrl,
        name: raw.name?.trim() || rowData.name,
        category: raw.category || rowData.category,
        section: raw.section || rowData.section,
        price: Number(raw.price ?? 0) || rowData.price,
        duration: raw.duration?.trim() || rowData.duration,
        description: raw.description?.trim() || rowData.description,
        status: raw.status || rowData.status,
        genderPolicy: raw.genderPolicy || rowData.genderPolicy,
        capacity: Number(raw.capacity ?? 0) || rowData.capacity,
        instructor: raw.instructor || rowData.instructor,
        availableFrom: raw.availableRange?.[0] ? 
          dayjs(raw.availableRange[0]).format("YYYY-MM-DD") : rowData.availableFrom,
        availableTo: raw.availableRange?.[1] ? 
          dayjs(raw.availableRange[1]).format("YYYY-MM-DD") : rowData.availableTo,
        summary: raw.summary || rowData.summary,
        privacy: raw.privacy || rowData.privacy,
        benefits: raw.benefits || rowData.benefits,
        schedules: schedules.length > 0 ? schedules : rowData.schedules,
        resources: {
          files: (raw.resources?.files || []).map((f) => ({
            uid: f.uid,
            name: fileNames[f.uid] ?? f.name,
            originName: f.name,
            type: f.type,
          })),
          telegram: raw.resources?.telegram || rowData.resources?.telegram,
          whatsapp: raw.resources?.whatsapp || rowData.resources?.whatsapp,
          videos: videos.filter((v) => v.url?.trim()).map((v) => ({ name: v.name?.trim() || "", url: v.url.trim() })),
        },
      };

      await new Promise((r) => setTimeout(r, 1500));
      console.log("Enhanced Form Data:", payload);
      
      // هنا يمكنك إضافة كود التحديث في قاعدة البيانات
      // updateCourseInDatabase(payload);
      
      message.success("تم تحديث الدورة بنجاح!");
      setIsEditing(false);
    } catch (e) {
      message.error("فشل تحديث الدورة. حاول مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    form.resetFields();
    setFileList([]);
    setImagePreview(null);
    setSelectedCategory(null);
    setAvailableSections([]);
    setSchedules([]);
    setNewSchedule({
      day: "",
      startTime: null,
      endTime: null,
      maxStudents: 30,
      isActive: true,
    });
    setIsEditing(false);
  };

  const tabItems = [
    { key: 1, label: "المعلومات الأساسية", icon: <BookOutlined /> },
    { key: 2, label: "الجدولة والمواعيد", icon: <CalendarOutlined /> },
    { key: 3, label: "المحتوى التفصيلي", icon: <FileTextOutlined /> },
    { key: 4, label: "المصادر والملفات", icon: <FolderOutlined /> },
  ];

  return (
    <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 min-h-[80vh]" dir="rtl">
      {/* Enhanced Header */}
      <div className="relative mb-8 p-6 bg-white rounded-2xl shadow-sm border-b-4 border-b-blue-500">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="relative flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
              <EditOutlined className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-blue-800 bg-clip-text text-transparent">
                تعديل الدورة: {rowData.name}
              </h1>
              <p className="text-gray-600 mt-1">تعديل الدورة التعليمية مع تحديث الجدولة والمحتوى</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            {!isEditing && (
              <Button 
                type="primary" 
                icon={<EditOutlined />}
                onClick={() => setIsEditing(true)}
                className="rounded-xl"
              >
                تمكين التعديل
              </Button>
            )}
            {isEditing && (
              <>
                <Button 
                  onClick={handleReset}
                  className="rounded-xl"
                >
                  إلغاء
                </Button>
                <Button 
                  type="primary" 
                  icon={<SaveOutlined />}
                  onClick={() => form.submit()}
                  loading={loading}
                  className="rounded-xl"
                >
                  حفظ التغييرات
                </Button>
              </>
            )}
          </div>
        </div>
        
        {/* Progress Indicator */}
        <div className="flex items-center gap-2 mt-4">
          {tabItems.map((tab, index) => (
            <div
              key={tab.key}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer
                ${activeTab === tab.key 
                  ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
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
          className="p-8"
        >
          {/* Basic Information Tab */}
          {activeTab === 1 && (
            <AddCourseBasicInfo
              rowData={rowData}
              setRowData={setRowData} 
              all_categories={all_categories}
              availableSections={availableSections}
              beforeUpload={beforeUpload}
              fileList={fileList}
              selectedCategory={selectedCategory}
              setFileList={setFileList}
              setImagePreview={setImagePreview}
              setSelectedCategory={setSelectedCategory}
              isEditing={isEditing}
            />
          )}

          {/* Schedule Tab */}
          {activeTab === 2 && (
            <AddCourseSchedule 
            rowData={rowData}
            setRowData={setRowData}
              handleAddSchedule={handleAddSchedule}
              handleRemoveSchedule={handleRemoveSchedule}
              handleUpdateSchedule={handleUpdateSchedule}
              newSchedule={newSchedule}
              schedules={schedules}
              setNewSchedule={setNewSchedule}
              isEditing={isEditing}
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
                  label={<span className="font-semibold text-gray-700">ملخص الدورة</span>}
                  name="summary"
                >
                  <RichTextField
                    placeholder="اكتب ملخصاً شاملاً للدورة يتضمن الأهداف التعليمية والمخرجات المتوقعة..."
                    readOnly={!isEditing}
                  />
                </Form.Item>

                <Form.Item
                  label={<span className="font-semibold text-gray-700">الشروط والأحكام</span>}
                  name="privacy"
                >
                  <RichTextField
                    placeholder="اكتب الشروط والأحكام الخاصة بالدورة..."
                    readOnly={!isEditing}
                  />
                </Form.Item>

                <Form.Item
                  label={<span className="font-semibold text-gray-700">مميزات الدورة</span>}
                  name="benefits"
                >
                  <RichTextField
                    placeholder={"اكتب مميزات الدورة ...."}
                    readOnly={!isEditing}
                  />
                </Form.Item>

                <Divider />

                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <PlayCircleOutlined className="text-blue-600" />
                    المحتوى التعليمي
                  </h4>
                  <p className="text-gray-600 mb-4">
                    يمكنك إضافة المحتوى التعليمي التفصيلي (الدروس، الفيديوهات، الاختبارات)
                  </p>
                  <AddTeacherCourseContent
                    courseId={id}
                    onContentAdded={(content) => console.log('Content added:', content)}
                    isEditing={isEditing}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Resources Tab */}
          {activeTab === 4 && (
            <AddCourseResources 
              setVideos={setVideos}
              videos={videos}
              isEditing={isEditing}
            />
          )}

          {/* Navigation and Actions */}
          {isEditing && (
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
                    className="rounded-xl"
                    icon={<span>→</span>}
                  >
                    التالي
                  </Button>
                ) : (
                  <Button
                    type="primary"
                    size="large"
                    htmlType="submit"
                    loading={loading}
                    className="rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                    icon={<SaveOutlined />}
                  >
                    حفظ التغييرات
                  </Button>
                )}
              </div>
            </div>
          )}
        </Form>
      </div>
    </div>
  );
};

export default Page;