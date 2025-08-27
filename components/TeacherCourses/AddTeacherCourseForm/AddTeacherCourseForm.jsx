"use client";

import React, { useEffect, useState } from "react";
import {
  PlusOutlined,
  BookOutlined,
  FileTextOutlined,
  InboxOutlined,
  DeleteOutlined,
  PlayCircleOutlined,
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
} from "antd";
import dayjs from "dayjs";
import "react-quill-new/dist/quill.snow.css";
import dynamic from "next/dynamic";
import AddTeacherCourseContent from "../AddTeacherCourseContent/AddTeacherCourseContent";
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const { Dragger } = Upload;
const { TextArea } = Input;
const { RangePicker } = DatePicker;
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
  "bullet",
  "align",
  "direction",
  "color",
  "background",
  "link",
  "blockquote",
  "code-block",
];

const RichTextField = ({ value, onChange, placeholder }) => (
  <div dir="rtl">
    <ReactQuill
      className="ql-rtl"
      theme="snow"
      value={value}
      onChange={(html) => onChange?.(html)}
      modules={quillModules}
      formats={quillFormats}
      placeholder={placeholder}
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

const insideTabs = [
  {
    id: 1,
    title: "فيديوهات شرح مسجلة",
  },
  {
    id: 2,
    title: "اختبارات",
  },
  {
    id: 3,
    title: "محاضرات",
  },
];

const AddTeacherCourseForm = ({ open, setOpen }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(1);
  const [fileList, setFileList] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [features, setFeatures] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [newFeature, setNewFeature] = useState({
    title: "",
    description: "",
    icon: "",
  });
  const [newLesson, setNewLesson] = useState({
    name: "",
    videos: [{ link: "", duration: "" }],
  });
  const [insideTab, setInsideTab] = useState(1);
  const [videoUnit, setVideoUnit] = useState(""); // Video unit name
  const [videoUrl, setVideoUrl] = useState(""); // Video URL
  const [examUnit, setExamUnit] = useState(""); // Exam unit name
  const [examUrl, setExamUrl] = useState(""); // Exam URL
  const [isNewVideo, setIsNewVideo] = useState(true); // State to switch between new/existing video
  const [selectedVideo, setSelectedVideo] = useState(""); // State for the existing video selection

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

  // Feature Functions
  const handleAddFeature = () => {
    if (newFeature.title && newFeature.description && newFeature.icon) {
      setFeatures([...features, { ...newFeature }]);
      setNewFeature({ title: "", description: "", icon: "" });
      message.success("تم إضافة الميزة بنجاح!");
    } else {
      message.error("يجب إدخال جميع الحقول.");
    }
  };

  const handleRemoveFeature = (index) => {
    const newFeatures = [...features];
    newFeatures.splice(index, 1);
    setFeatures(newFeatures);
  };

  // Lesson Functions
  const handleAddVideoToLesson = () => {
    setNewLesson({
      ...newLesson,
      videos: [...newLesson.videos, { link: "", duration: "" }],
    });
  };

  const handleRemoveVideoFromLesson = (lessonIndex, videoIndex) => {
    if (newLesson.videos.length > 1) {
      const newVideos = [...newLesson.videos];
      newVideos.splice(videoIndex, 1);
      setNewLesson({
        ...newLesson,
        videos: newVideos,
      });
    }
  };

  const handleUpdateVideoInLesson = (videoIndex, field, value) => {
    const newVideos = [...newLesson.videos];
    newVideos[videoIndex][field] = value;
    setNewLesson({
      ...newLesson,
      videos: newVideos,
    });
  };

  const handleAddLesson = () => {
    if (
      newLesson.name &&
      newLesson.videos.length > 0 &&
      newLesson.videos.every((v) => v.link && v.duration)
    ) {
      setLessons([...lessons, { ...newLesson }]);
      setNewLesson({ name: "", videos: [{ link: "", duration: "" }] });
      message.success("تم إضافة الدرس بنجاح!");
    } else {
      message.error("يجب إدخال جميع الحقول لكل فيديو.");
    }
  };

  const handleRemoveLesson = (index) => {
    const newLessons = [...lessons];
    newLessons.splice(index, 1);
    setLessons(newLessons);
  };

  const handleFinish = async () => {
    setLoading(true);
    try {
      const raw = form.getFieldsValue(true);

      if (!imagePreview) {
        message.error("من فضلك ارفع صورة المادة أولاً.");
        setLoading(false);
        return;
      }

      const payload = {
        code: raw.code?.toUpperCase(),
        imageUrl: imagePreview,
        name: raw.name?.trim(),
        price: Number(raw.price ?? 0),
        duration: raw.duration?.trim(),
        attachment: raw.attachment?.trim(),
        description: raw.description?.trim(),
        status: raw.status,
        genderPolicy: raw.genderPolicy,
        capacity: Number(raw.capacity ?? 0),
        availableFrom: raw.availableRange?.[0]
          ? dayjs(raw.availableRange[0]).format("YYYY-MM-DD")
          : undefined,
        availableTo: raw.availableRange?.[1]
          ? dayjs(raw.availableRange[1]).format("YYYY-MM-DD")
          : undefined,
        summary: raw.summary || "",
        terms: raw.terms || "",
        features: features,
        lessons: lessons,
        overview: raw.overview || "",
      };

      await new Promise((r) => setTimeout(r, 1200));
      console.log("Form Data:", payload);
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
    setFeatures([]);
    setLessons([]);
    setNewFeature({ title: "", description: "", icon: "" });
    setNewLesson({ name: "", videos: [{ link: "", duration: "" }] });
  };

  const handleAddVideo = () => {
    if (videoUnit && videoUrl) {
      message.success("تم إضافة الفيديو بنجاح!");
      setVideoUnit("");
      setVideoUrl("");
    } else {
      message.error("يجب إدخال اسم الوحدة ورابط الفيديو.");
    }
  };

  const handleAddExam = () => {
    if (examUnit && examUrl) {
      message.success("تم إضافة الاختبار بنجاح!");
      setExamUnit("");
      setExamUrl("");
    } else {
      message.error("يجب إدخال اسم الوحدة ورابط الاختبار.");
    }
  };

  const handleVideoChange = (value) => {
    setSelectedVideo(value);
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#0F7490",
          borderRadius: 12,
          controlHeight: 44,
        },
      }}
    >
      <Modal
        title={null}
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        width="90%"
        style={{ maxWidth: "1200px" }}
      >
        <div className="bg-[#F9FAFC]" dir="rtl">
          <div className="mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-[#0F7490] rounded-lg flex items-center justify-center">
                  <PlusOutlined className="text-white text-lg" />
                </div>
                <h1 className="text-3xl font-bold text-[#202938]">
                  إضافة دورة جديدة
                </h1>
              </div>
              <p className="text-gray-600">إنشاء وتكوين دورة تعليمية جديدة</p>
            </div>

            <div className="bg-white border-0 rounded-2xl overflow-hidden p-6">
              <Form
                form={form}
                layout="vertical"
                onFinish={handleFinish}
                initialValues={{
                  code: "MTH101",
                  name: "الرياضيات",
                  price: 499,
                  duration: "3 شهور",
                  attachment: "شامل كتاب الدورة pdf",
                  description:
                    "مفاهيم الرياضيات الأساسية بما في ذلك الجبر والهندسة وحساب التفاضل والتكامل",
                  status: "نشط",
                  genderPolicy: "female",
                  capacity: 300,
                  availableRange: [dayjs("2025-08-01"), dayjs("2025-12-01")],
                  summary: "<p>نبذة سريعة عن الدورة.</p>",
                  terms:
                    "<ul><li>سياسة الاسترجاع...</li><li>حقوق الاستخدام...</li></ul>",
                  overview:
                    "<p>تفاصيل موسعة عن محاور الدورة وأهداف التعلم.</p>",
                }}
                className="space-y-6"
              >
                {/* Basic Information */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="text-xl font-semibold text-[#202938] mb-4 flex items-center gap-2">
                    <BookOutlined className="text-[#0F7490]" />
                    المعلومات الأساسية
                  </h3>

                  <div className="columns columns-1 md:columns-2 gap-4">
                    <Form.Item
                      label={<span className="font-medium">صورة المادة *</span>}
                      required
                    >
                      <Dragger
                        accept="image/*"
                        multiple={false}
                        maxCount={1}
                        beforeUpload={beforeUpload}
                        fileList={fileList}
                        onChange={({ fileList }) => setFileList(fileList)}
                        onRemove={() => {
                          setFileList([]);
                          setImagePreview(null);
                        }}
                        listType="picture"
                      >
                        <p className="ant-upload-drag-icon">
                          <InboxOutlined />
                        </p>
                        <p className="ant-upload-text">
                          اسحب وأفلت الصورة هنا، أو اضغط للاختيار
                        </p>
                        <p className="ant-upload-hint">
                          يُسمح بصيغ الصور فقط وبحجم حتى 5MB
                        </p>
                      </Dragger>
                    </Form.Item>
                    <Form.Item
                      label={<span className="font-medium">اسم المادة *</span>}
                      name="name"
                      rules={[
                        { required: true, message: "أدخل اسم المادة" },
                        {
                          validator: (_, value) =>
                            !value || value.trim().length >= 2
                              ? Promise.resolve()
                              : Promise.reject(
                                  new Error("الاسم لا يقل عن حرفين")
                                ),
                        },
                      ]}
                    >
                      <Input placeholder="مثال: الرياضيات، الفيزياء" />
                    </Form.Item>

                    <Form.Item
                      label={<span className="font-medium">السعر (ج.م)</span>}
                      name="price"
                      rules={[
                        { required: true, message: "أدخل السعر" },
                        { type: "number", min: 0, message: "لا يقل عن 0" },
                      ]}
                    >
                      <InputNumber
                        className="w-full"
                        placeholder="499"
                        controls={false}
                      />
                    </Form.Item>

                    <Form.Item
                      label={<span className="font-medium">المدة</span>}
                      name="duration"
                      rules={[{ required: true, message: "أدخل مدة الدورة" }]}
                    >
                      <Input placeholder="مثال: 3 شهور" />
                    </Form.Item>

                    <Form.Item
                      label={<span className="font-medium">المرفقات</span>}
                      name="attachment"
                    >
                      <Input placeholder="مثال: شامل كتاب الدورة pdf" />
                    </Form.Item>

                    <Form.Item
                      label={<span className="font-medium">الوصف *</span>}
                      name="description"
                      className="md:col-span-2"
                      rules={[
                        { required: true, message: "أدخل وصفًا للمادة" },
                        {
                          validator: (_, value) =>
                            !value || value.trim().length >= 10
                              ? Promise.resolve()
                              : Promise.reject(
                                  new Error("الوصف لا يقل عن 10 أحرف")
                                ),
                        },
                      ]}
                    >
                      <TextArea
                        rows={3}
                        placeholder="وصف مختصر..."
                        className="resize-none"
                      />
                    </Form.Item>
                  </div>
                </div>

                {/* Subject Configuration */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="text-xl font-semibold text-[#202938] mb-4 flex items-center gap-2">
                    <FileTextOutlined className="text-[#0F7490]" />
                    إعدادات المادة
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Form.Item
                      label={<span className="font-medium">الحالة *</span>}
                      name="status"
                      rules={[{ required: true }]}
                    >
                      <Select
                        options={[
                          { label: "🟢 نشط", value: "نشط" },
                          { label: "⚪ غير نشط", value: "غير نشط" },
                          { label: "🟡 مسودة", value: "مسودة" },
                        ]}
                      />
                    </Form.Item>

                    <Form.Item
                      label={<span className="font-medium">سياسة النوع *</span>}
                      name="genderPolicy"
                      rules={[{ required: true, message: "اختر السياسة" }]}
                    >
                      <Select
                        options={[
                          { label: "للذكور فقط", value: "male" },
                          { label: "للإناث فقط", value: "female" },
                          { label: "للجميع", value: "both" },
                        ]}
                      />
                    </Form.Item>

                    <Form.Item
                      label={<span className="font-medium">السعة</span>}
                      name="capacity"
                      rules={[
                        { required: true, message: "أدخل السعة" },
                        { type: "number", min: 1, message: "لا تقل عن 1" },
                      ]}
                    >
                      <InputNumber className="w-full" placeholder="300" />
                    </Form.Item>

                    <Form.Item
                      label={<span className="font-medium">الإتاحة</span>}
                      name="availableRange"
                      rules={[
                        {
                          required: true,
                          message: "حدد فترة الإتاحة (من/إلى)",
                        },
                      ]}
                    >
                      <RangePicker className="w-full" />
                    </Form.Item>
                  </div>
                </div>

                {/* Rich Text Section */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="text-xl font-semibold text-[#202938] mb-4">
                    المحتوى التفصيلي
                  </h3>

                  <div className="space-y-6">
                    {/* Tab Navigation */}
                    <div className="flex gap-2 items-center mb-4 flex-wrap">
                      {[
                        "نبذه مختصرة",
                        "الشروط والأحكام",
                        "التقييم",
                        "مميزات الدورة",
                        "المحتوى",
                        "المصادر",
                        "الدعم",
                      ].map((tab, index) => (
                        <button
                          key={index}
                          className={`rounded-3xl p-2 border text-primary cursor-pointer mb-2 ${
                            activeTab === index + 1
                              ? "bg-primary text-white"
                              : ""
                          }`}
                          onClick={() => setActiveTab(index + 1)}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>

                    {/* نبذه مختصه */}
                    {activeTab === 1 && (
                      <Form.Item
                        label="نبذة مختصرة"
                        name="summary"
                        valuePropName="value"
                        getValueFromEvent={(v) => v}
                      >
                        <RichTextField placeholder="اكتب نبذة مختصرة عن الدورة..." />
                      </Form.Item>
                    )}

                    {/* الشروط والأحكام */}
                    {activeTab === 2 && (
                      <Form.Item
                        label="الشروط والأحكام"
                        name="privacy policy"
                        valuePropName="value"
                        getValueFromEvent={(v) => v}
                      >
                        <RichTextField placeholder="اكتب نبذة مختصرة عن الدورة..." />
                      </Form.Item>
                    )}

                    {/* التقييم */}
                    {activeTab === 3 && (
                      <div className="flex flex-col gap-2">
                        <Form.Item label="اسم الشخص">
                          <Input />
                        </Form.Item>

                        <Form.Item label="الوصف">
                          <Input />
                        </Form.Item>

                        <Form.Item label="التقييم">
                          <Rate />
                        </Form.Item>
                      </div>
                    )}

                    {/* مميزات الدورة */}
                    {activeTab === 4 && (
                      <div>
                        <Row gutter={16}>
                          <Col xs={24} md={8}>
                            <Form.Item label="عنوان الميزة">
                              <Input
                                value={newFeature.title}
                                onChange={(e) =>
                                  setNewFeature({
                                    ...newFeature,
                                    title: e.target.value,
                                  })
                                }
                                placeholder="أدخل عنوان الميزة"
                              />
                            </Form.Item>
                          </Col>
                          <Col xs={24} md={8}>
                            <Form.Item label="وصف الميزة">
                              <Input
                                value={newFeature.description}
                                onChange={(e) =>
                                  setNewFeature({
                                    ...newFeature,
                                    description: e.target.value,
                                  })
                                }
                                placeholder="أدخل وصف الميزة"
                              />
                            </Form.Item>
                          </Col>
                          <Col xs={24} md={8}>
                            <Form.Item label="أيقونة الميزة">
                              <Input
                                value={newFeature.icon}
                                onChange={(e) =>
                                  setNewFeature({
                                    ...newFeature,
                                    icon: e.target.value,
                                  })
                                }
                                placeholder="أدخل رابط الأيقونة"
                              />
                            </Form.Item>
                          </Col>
                        </Row>

                        <Button
                          type="dashed"
                          onClick={() => {
                            handleAddFeature();
                            console.log("clickkeddd");
                          }}
                          className="mb-4"
                          block
                          icon={<PlusOutlined />}
                        >
                          إضافة ميزة
                        </Button>

                        <Divider />

                        <div className="mt-4">
                          <h4 className="mb-2">مميزات الدورة المضافة:</h4>
                          {features.length > 0 ? (
                            <Row gutter={16}>
                              {features.map((feature, index) => (
                                <Col
                                  xs={24}
                                  md={12}
                                  lg={8}
                                  key={index}
                                  className="mb-3"
                                >
                                  <Card
                                    size="small"
                                    title={feature.title}
                                    extra={
                                      <Button
                                        type="text"
                                        danger
                                        icon={<DeleteOutlined />}
                                        onClick={() =>
                                          handleRemoveFeature(index)
                                        }
                                      />
                                    }
                                  >
                                    <p>{feature.description}</p>
                                    <small>الأيقونة: {feature.icon}</small>
                                  </Card>
                                </Col>
                              ))}
                            </Row>
                          ) : (
                            <p className="text-gray-500">
                              لم يتم إضافة أي ميزات بعد
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* المحتوى */}
                    {activeTab === 5 && (
                    <AddTeacherCourseContent 
                      activeTab={activeTab}
                      insideTab={insideTab}
                      setInsideTab={setInsideTab}
                    />
                    )}

                    {activeTab === 6 && (
                      <div>
                        <Form.Item label="المصادر">
                          <Input type="file" />
                        </Form.Item>
                      </div>
                    )}

                    {activeTab === 7 && (
                      <div>
                        <Form.Item label=""></Form.Item>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="border-t border-gray-200 pt-6">
                  <div className="flex justify-end gap-4">
                    <Button
                      type="default"
                      onClick={handleReset}
                      className="px-8 py-3 text-gray-700 border border-gray-300 rounded-lg hover:border-gray-400"
                    >
                      إعادة ضبط
                    </Button>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={loading}
                      className="px-8 py-3 bg-[#0F7490] text-white rounded-lg hover:!bg-[#0d5f75]"
                      icon={!loading ? <PlusOutlined /> : undefined}
                    >
                      {loading ? "جارٍ الإضافة..." : "إضافة المادة"}
                    </Button>
                  </div>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </Modal>
    </ConfigProvider>
  );
};

export default AddTeacherCourseForm;
