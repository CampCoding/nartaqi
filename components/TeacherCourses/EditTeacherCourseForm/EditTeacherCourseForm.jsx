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
  LinkOutlined,
  LockOutlined,
  UnlockOutlined,
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
  Switch,
  Radio,
  Space,
  Tooltip,
  Tag,
  Empty,
} from "antd";
import dayjs from "dayjs";
import "react-quill-new/dist/quill.snow.css";
import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const { Dragger } = Upload;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

/* ============ Quill ============ */
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
const RichTextField = ({ value, onChange, placeholder }) => (
  <div dir="rtl">
    <ReactQuill
      className="ql-rtl"
      theme="snow"
      value={value}
      onChange={(html) => onChange?.(html)}
      modules={quillModules}
      placeholder={placeholder}
    />
  </div>
);

/* ============ Helpers ============ */
const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });

const REC_TYPES = [
  { value: "video", label: "فيديو" },
  { value: "training", label: "تدريب (فيديو + PDFs)" },
];
const VIDEO_SOURCES = [
  { value: "url", label: "رابط (YouTube/Vimeo…)" },
  { value: "file", label: "رفع ملف من الجهاز" },
];
const normFile = (e) => (Array.isArray(e) ? e : e?.fileList ?? []);
const beforeUploadVideo = () => false;
const beforeUploadPdf = () => false;
const combineDT = (date, time) =>
  dayjs(date).hour(dayjs(time).hour()).minute(dayjs(time).minute()).second(0).toISOString();

/* ===================================================================== */

const EditTeacherCourseForm = ({ open, setOpen, rowData }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(1);

  // Cover image
  const [fileList, setFileList] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);

  // “Features” & “Lessons” (existing)
  const [features, setFeatures] = useState([]);
  const [newFeature, setNewFeature] = useState({ title: "", description: "", icon: "" });

  const [lessons, setLessons] = useState([]);
  const [newLesson, setNewLesson] = useState({ name: "", videos: [{ link: "", duration: "" }] });

  // ===== NEW: Recorded (sections + topics) =====
  const [recorded, setRecorded] = useState([
    // example structure
    // { id: "sec-1", title: "الوحدة 1", items: [ {id, type, title, ...}, ... ] }
  ]);
  const [openAddRecorded, setOpenAddRecorded] = useState(false);
  const [recForm] = Form.useForm();
  const [savingRecorded, setSavingRecorded] = useState(false);

  // ===== NEW: Live (sections + sessions) =====
  const [liveLectures, setLiveLectures] = useState([
    // { id: "ls-1", title: "قسم محاضرات", items: [ {id, title, startAt, ...}, ... ] }
  ]);
  const [openAddLive, setOpenAddLive] = useState(false);
  const [liveForm] = Form.useForm();
  const [savingLive, setSavingLive] = useState(false);

  // ===== Exam placeholder (optional later link) =====
  const [exams, setExams] = useState([]);

  useEffect(() => {
    // Prefill from rowData if available
    if (!rowData) return;
    // Example prefill:
    // setRecorded(rowData.recorded || []);
    // setLiveLectures(rowData.liveLectures || []);
  }, [rowData]);

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

  /* ===== Features ===== */
  const handleAddFeature = () => {
    if (newFeature.title && newFeature.description && newFeature.icon) {
      setFeatures((p) => [...p, { ...newFeature }]);
      setNewFeature({ title: "", description: "", icon: "" });
      message.success("تم إضافة الميزة بنجاح!");
    } else {
      message.error("يجب إدخال جميع الحقول.");
    }
  };
  const handleRemoveFeature = (index) =>
    setFeatures((p) => p.filter((_, i) => i !== index));

  /* ===== Lessons ===== */
  const handleAddVideoToLesson = () =>
    setNewLesson((p) => ({ ...p, videos: [...p.videos, { link: "", duration: "" }] }));

  const handleRemoveVideoFromLesson = (videoIndex) => {
    if (newLesson.videos.length > 1) {
      const newVideos = [...newLesson.videos];
      newVideos.splice(videoIndex, 1);
      setNewLesson({ ...newLesson, videos: newVideos });
    }
  };

  const handleUpdateVideoInLesson = (videoIndex, field, value) => {
    const newVideos = [...newLesson.videos];
    newVideos[videoIndex][field] = value;
    setNewLesson({ ...newLesson, videos: newVideos });
  };

  const handleAddLesson = () => {
    if (
      newLesson.name &&
      newLesson.videos.length > 0 &&
      newLesson.videos.every((v) => v.link && v.duration)
    ) {
      setLessons((p) => [...p, { ...newLesson }]);
      setNewLesson({ name: "", videos: [{ link: "", duration: "" }] });
      message.success("تم إضافة الدرس بنجاح!");
    } else {
      message.error("يجب إدخال جميع الحقول لكل فيديو.");
    }
  };
  const handleRemoveLesson = (index) =>
    setLessons((p) => p.filter((_, i) => i !== index));

  /* ===== Recorded Submit ===== */
  const submitRecorded = async () => {
    try {
      setSavingRecorded(true);
      const v = await recForm.validateFields();
      let sectionId = v.sectionId;

      if (v.sectionMode === "new") {
        sectionId = `sec-${Date.now()}`;
        setRecorded((prev) => [{ id: sectionId, title: v.sectionTitle, items: [] }, ...prev]);
      }

      const topics = (v.topics || []).map((t, i) => {
        const base = { id: `itm-${Date.now()}-${i}`, title: t.title, locked: !!t.locked };
        if (t.type === "video") {
          if (t.videoSource === "url") {
            return {
              ...base,
              type: "video",
              duration: t.duration || "",
              source: "url",
              url: (t.url || "").trim(),
            };
          }
          return {
            ...base,
            type: "video",
            duration: t.duration || "",
            source: "file",
            videoFile: t.videoFile || [],
          };
        }
        const trainingVideo =
          t.trainingVideoSource === "url"
            ? { source: "url", url: (t.trainingVideoUrl || "").trim() }
            : { source: "file", fileList: t.trainingVideoFile || [] };
        return {
          ...base,
          type: "training",
          trainingVideo,
          pdfs: t.pdfs || [],
        };
      });

      setRecorded((prev) =>
        prev.map((s) => (s.id === sectionId ? { ...s, items: [...topics, ...(s.items || [])] } : s))
      );
      message.success("تم حفظ المحتوى المسجّل داخل القسم");
      setOpenAddRecorded(false);
      recForm.resetFields();
    } catch {
      // handled by antd
    } finally {
      setSavingRecorded(false);
    }
  };
  const deleteRecordedItem = (sectionId, itemId) => {
    setRecorded((prev) =>
      prev.map((s) => (s.id === sectionId ? { ...s, items: s.items.filter((it) => it.id !== itemId) } : s))
    );
  };
  const deleteRecordedSection = (sectionId) =>
    setRecorded((p) => p.filter((s) => s.id !== sectionId));

  /* ===== Live Submit ===== */
  const submitLive = async () => {
    try {
      setSavingLive(true);
      const v = await liveForm.validateFields();

      let sectionId = v.sectionId;
      if (v.sectionMode === "new") {
        sectionId = `ls-${Date.now()}`;
        setLiveLectures((prev) => [{ id: sectionId, title: v.sectionTitle, items: [] }, ...prev]);
      }

      const sessions = (v.sessions || []).map((s, i) => ({
        id: `lv-${Date.now()}-${i}`,
        title: s.title,
        startAt: combineDT(s.date, s.time),
        duration: s.duration ? Number(s.duration) : undefined,
        meetingUrl: (s.meetingUrl || "").trim() || "#",
        locked: !!s.locked,
      }));

      setLiveLectures((prev) =>
        prev.map((sec) => (sec.id === sectionId ? { ...sec, items: [...sessions, ...(sec.items || [])] } : sec))
      );

      message.success("تم حفظ المحاضرات داخل القسم");
      setOpenAddLive(false);
      liveForm.resetFields();
    } catch {
      // handled by antd
    } finally {
      setSavingLive(false);
    }
  };
  const deleteLiveSession = (sectionId, itemId) => {
    setLiveLectures((prev) =>
      prev.map((s) =>
        s.id === sectionId ? { ...s, items: (s.items || []).filter((it) => it.id !== itemId) } : s
      )
    );
  };
  const deleteLiveSection = (sectionId) =>
    setLiveLectures((p) => p.filter((s) => s.id !== sectionId));

  /* ===== Submit Course ===== */
  const handleFinish = async () => {
    setLoading(true);
    try {
      const raw = form.getFieldsValue(true);

      if (!imagePreview) {
        message.error("من فضلك ارفع صورة الدورة أولاً.");
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
        overview: raw.overview || "",

        features,
        lessons,

        // NEW: include structured content
        recorded,
        liveLectures,
        // exams: [] // hook up later if needed
      };

      await new Promise((r) => setTimeout(r, 900));
      // eslint-disable-next-line no-console
      console.log("Form Data (Submit Payload):", payload);
      message.success("تم حفظ التعديلات بنجاح!");
      handleReset();
      setOpen(false);
    } catch (e) {
      message.error("فشل حفظ التعديلات. حاول مرة أخرى.");
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
    setRecorded([]);
    setLiveLectures([]);
  };

  /* ============================== UI ============================== */
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
                <h1 className="text-3xl font-bold text-[#202938]">تعديل دورة</h1>
              </div>
              <p className="text-gray-600">تحرير بيانات الدورة وإضافة المحتوى</p>
            </div>

            <div className="bg-white border-0 rounded-2xl overflow-hidden p-6">
              <Form
                form={form}
                layout="vertical"
                onFinish={handleFinish}
                initialValues={{
                  code: "MTH101",
                  name: rowData?.specialization,
                  price: rowData?.price,
                  duration: "3 شهور",
                  attachment: "شامل كتاب الدورة pdf",
                  description:
                    "مفاهيم الرياضيات الأساسية بما في ذلك الجبر والهندسة وحساب التفاضل والتكامل",
                  status: rowData?.status || "مسودة",
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
                    <Form.Item label={<span className="font-medium">صورة الدورة *</span>} required>
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
                        <p className="ant-upload-text">اسحب وأفلت الصورة هنا، أو اضغط للاختيار</p>
                        <p className="ant-upload-hint">يُسمح بصيغ الصور فقط وبحجم حتى 5MB</p>
                      </Dragger>
                    </Form.Item>

                    <Form.Item
                      label={<span className="font-medium">اسم الدورة *</span>}
                      name="name"
                      rules={[
                        { required: true, message: "أدخل اسم الدورة" },
                        {
                          validator: (_, value) =>
                            !value || value.trim().length >= 2
                              ? Promise.resolve()
                              : Promise.reject(new Error("الاسم لا يقل عن حرفين")),
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
                      <InputNumber className="w-full" placeholder="499" controls={false} />
                    </Form.Item>

                    <Form.Item
                      label={<span className="font-medium">المدة</span>}
                      name="duration"
                      rules={[{ required: true, message: "أدخل مدة الدورة" }]}
                    >
                      <Input placeholder="مثال: 3 شهور" />
                    </Form.Item>

                    <Form.Item label={<span className="font-medium">المرفقات</span>} name="attachment">
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
                              : Promise.reject(new Error("الوصف لا يقل عن 10 أحرف")),
                        },
                      ]}
                    >
                      <TextArea rows={3} placeholder="وصف مختصر..." className="resize-none" />
                    </Form.Item>
                  </div>
                </div>

                {/* Subject Configuration */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="text-xl font-semibold text-[#202938] mb-4 flex items-center gap-2">
                    <FileTextOutlined className="text-[#0F7490]" />
                    إعدادات الدورة
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Form.Item label={<span className="font-medium">الحالة *</span>} name="status" rules={[{ required: true }]}>
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
                      rules={[{ required: true, message: "حدد فترة الإتاحة (من/إلى)" }]}
                    >
                      <RangePicker className="w-full" />
                    </Form.Item>
                  </div>
                </div>

                {/* Rich Text Section */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="text-xl font-semibold text-[#202938] mb-4">المحتوى التفصيلي</h3>

                  <div className="space-y-6">
                    {/* Tabs */}
                    <div className="flex gap-2 items-center mb-4 flex-wrap">
                      {["نبذه مختصرة", "الشروط والأحكام", "التقييم", "مميزات الدورة", "المحتوى"].map(
                        (tab, index) => (
                          <button
                            key={index}
                            className={`rounded-3xl p-2 border text-primary cursor-pointer mb-2 ${
                              activeTab === index + 1 ? "bg-primary text-white" : ""
                            }`}
                            onClick={() => setActiveTab(index + 1)}
                          >
                            {tab}
                          </button>
                        )
                      )}
                    </div>

                    {/* 1) Summary */}
                    {activeTab === 1 && (
                      <Form.Item label="نبذة مختصرة" name="summary" valuePropName="value" getValueFromEvent={(v) => v}>
                        <RichTextField placeholder="اكتب نبذة مختصرة عن الدورة..." />
                      </Form.Item>
                    )}

                    {/* 2) Terms */}
                    {activeTab === 2 && (
                      <Form.Item label="الشروط والأحكام" name="terms" valuePropName="value" getValueFromEvent={(v) => v}>
                        <RichTextField placeholder="اكتب الشروط والأحكام..." />
                      </Form.Item>
                    )}

                    {/* 3) Rating (example static fields) */}
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

                    {/* 4) Features */}
                    {activeTab === 4 && (
                      <div>
                        <Row gutter={16}>
                          <Col xs={24} md={8}>
                            <Form.Item label="عنوان الميزة">
                              <Input
                                value={newFeature.title}
                                onChange={(e) => setNewFeature({ ...newFeature, title: e.target.value })}
                                placeholder="أدخل عنوان الميزة"
                              />
                            </Form.Item>
                          </Col>
                          <Col xs={24} md={8}>
                            <Form.Item label="وصف الميزة">
                              <Input
                                value={newFeature.description}
                                onChange={(e) => setNewFeature({ ...newFeature, description: e.target.value })}
                                placeholder="أدخل وصف الميزة"
                              />
                            </Form.Item>
                          </Col>
                          <Col xs={24} md={8}>
                            <Form.Item label="أيقونة الميزة">
                              <Input
                                value={newFeature.icon}
                                onChange={(e) => setNewFeature({ ...newFeature, icon: e.target.value })}
                                placeholder="أدخل رابط الأيقونة"
                              />
                            </Form.Item>
                          </Col>
                        </Row>

                        <Button type="dashed" onClick={handleAddFeature} className="mb-4" block icon={<PlusOutlined />}>
                          إضافة ميزة
                        </Button>

                        <Divider />

                        <div className="mt-4">
                          <h4 className="mb-2">مميزات الدورة المضافة:</h4>
                          {features.length > 0 ? (
                            <Row gutter={16}>
                              {features.map((feature, index) => (
                                <Col xs={24} md={12} lg={8} key={index} className="mb-3">
                                  <Card
                                    size="small"
                                    title={feature.title}
                                    extra={
                                      <Button
                                        type="text"
                                        danger
                                        icon={<DeleteOutlined />}
                                        onClick={() => handleRemoveFeature(index)}
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
                            <p className="text-gray-500">لم يتم إضافة أي ميزات بعد</p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* 5) Content: Lessons + Recorded + Live */}
                    {activeTab === 5 && (
                      <div className="space-y-8">
                        {/* A) Lessons (simple list you already had) */}
                        <div>
                          <h3 className="text-lg font-semibold mb-3">الدروس (بسيطة)</h3>
                          <Form.Item label="اسم الدرس">
                            <Input
                              value={newLesson.name}
                              onChange={(e) => setNewLesson({ ...newLesson, name: e.target.value })}
                              placeholder="أدخل اسم الدرس"
                            />
                          </Form.Item>

                          <h4 className="mb-2">فيديوهات الشرح المسجلة
                          الدرس:</h4>
                          {newLesson.videos.map((video, index) => (
                            <Card key={index} size="small" className="mb-3">
                              <Row gutter={16} align="middle">
                                <Col xs={24} md={10}>
                                  <Form.Item label={`رابط الفيديو ${index + 1}`}>
                                    <Input
                                      value={video.link}
                                      onChange={(e) => handleUpdateVideoInLesson(index, "link", e.target.value)}
                                      placeholder="أدخل رابط الفيديو"
                                    />
                                  </Form.Item>
                                </Col>
                                <Col xs={24} md={10}>
                                  <Form.Item label={`مدة الفيديو ${index + 1}`}>
                                    <Input
                                      value={video.duration}
                                      onChange={(e) => handleUpdateVideoInLesson(index, "duration", e.target.value)}
                                      placeholder="أدخل مدة الفيديو"
                                    />
                                  </Form.Item>
                                </Col>
                                <Col xs={24} md={4}>
                                  {newLesson.videos.length > 1 && (
                                    <Button danger icon={<DeleteOutlined />} onClick={() => handleRemoveVideoFromLesson(index)}>
                                      حذف
                                    </Button>
                                  )}
                                </Col>
                              </Row>
                            </Card>
                          ))}

                          <Button type="dashed" onClick={handleAddVideoToLesson} className="mb-4" block icon={<PlusOutlined />}>
                            إضافة فيديو آخر
                          </Button>

                          <Button type="primary" onClick={handleAddLesson} className="mb-4" block icon={<PlayCircleOutlined />}>
                            إضافة درس جديد
                          </Button>

                          <Divider />

                          <div className="mt-4">
                            <h4 className="mb-2">الدروس المضافة:</h4>
                            {lessons.length > 0 ? (
                              <Row gutter={16}>
                                {lessons.map((lesson, index) => (
                                  <Col xs={24} md={12} lg={8} key={index} className="mb-3">
                                    <Card
                                      size="small"
                                      title={lesson.name}
                                      extra={
                                        <Button
                                          type="text"
                                          danger
                                          icon={<DeleteOutlined />}
                                          onClick={() => handleRemoveLesson(index)}
                                        />
                                      }
                                    >
                                      <p>عدد الفيديوهات: {lesson.videos.length}</p>
                                      <ul>
                                        {lesson.videos.map((video, vidIndex) => (
                                          <li key={vidIndex}>الفيديو {vidIndex + 1}: {video.duration}</li>
                                        ))}
                                      </ul>
                                    </Card>
                                  </Col>
                                ))}
                              </Row>
                            ) : (
                              <p className="text-gray-500">لم يتم إضافة أي دروس بعد</p>
                            )}
                          </div>
                        </div>

                        <Divider />

                        {/* B) Recorded (Sections + Topics) */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-semibold">فيديوهات مسجلة (وحدات + موضوعات)</h3>
                            <Button type="primary" onClick={() => setOpenAddRecorded(true)} icon={<PlusOutlined />}>
                              إضافة محتوى مسجّل
                            </Button>
                          </div>

                          {recorded.length === 0 ? (
                            <Empty description="لا توجد وحدات مسجلة بعد" />
                          ) : (
                            <div className="space-y-3">
                              {recorded.map((sec) => (
                                <Card
                                  key={sec.id}
                                  title={<span className="font-semibold">{sec.title}</span>}
                                  extra={
                                    <Button danger type="text" icon={<DeleteOutlined />} onClick={() => deleteRecordedSection(sec.id)}>
                                      حذف القسم
                                    </Button>
                                  }
                                >
                                  {(sec.items || []).length === 0 ? (
                                    <Empty description="لا توجد عناصر في هذا القسم" />
                                  ) : (
                                    <div className="space-y-2">
                                      {sec.items.map((it) => {
                                        const isVideo = it.type === "video";
                                        const canOpen =
                                          (isVideo && it.source === "url" && it.url) ||
                                          (!isVideo && it.trainingVideo?.source === "url" && it.trainingVideo?.url);

                                        const openUrl = isVideo ? it.url : it.trainingVideo?.url;

                                        return (
                                          <div
                                            key={it.id}
                                            className="flex items-center justify-between rounded-lg border p-3 bg-gray-50"
                                          >
                                            <div className="flex items-center gap-3">
                                              <div className={`rounded-lg p-2 !flex !gap-2 !items-center ${isVideo ? "bg-blue-100" : "bg-amber-100"}`}>
                                                {isVideo ? <PlayCircleOutlined /> : <FileTextOutlined />}
                                              </div>
                                              <div>
                                                <div className="font-medium text-gray-800">{it.title}</div>
                                                <div className="text-xs text-gray-500 flex items-center gap-2">
                                                  <Tag color={isVideo ? "blue" : "gold"}>{isVideo ? "فيديو" : "تدريب"}</Tag>
                                                  {it.duration && <span><CalendarOutlined /> {it.duration}</span>}
                                                 
                                                  {!isVideo && <Tag color="gold">{(it.pdfs || []).length} PDF</Tag>}
                                                </div>
                                              </div>
                                            </div>
                                            <Space>
                                              
                                              <Tooltip title="حذف">
                                                <Button
                                                  danger
                                                  className="flex justify-self-center items-center"
                                                  icon={<DeleteOutlined className="w-5 h-5" />}
                                                  onClick={() => deleteRecordedItem(sec.id, it.id)}
                                                />
                                              </Tooltip>
                                            </Space>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  )}
                                </Card>
                              ))}
                            </div>
                          )}
                        </div>

                        <Divider />

                        {/* C) Live (Sections + Sessions) */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-semibold">محاضرات مباشرة (أقسام + جلسات)</h3>
                            <Button type="primary" onClick={() => setOpenAddLive(true)} icon={<PlusOutlined />}>
                              إضافة محاضرات مباشرة
                            </Button>
                          </div>

                          {liveLectures.length === 0 ? (
                            <Empty description="لا توجد محاضرات مباشرة" />
                          ) : (
                            <div className="space-y-3">
                              {liveLectures.map((sec) => (
                                <Card
                                  key={sec.id}
                                  title={<span className="font-semibold">{sec.title}</span>}
                                  extra={
                                    <Button danger type="text" icon={<DeleteOutlined />} onClick={() => deleteLiveSection(sec.id)}>
                                      حذف القسم
                                    </Button>
                                  }
                                >
                                  {(sec.items || []).length === 0 ? (
                                    <Empty description="لا توجد محاضرات في هذا القسم" />
                                  ) : (
                                    <div className="space-y-2">
                                      {sec.items.map((l) => {
                                        const isFinished = dayjs().isAfter(dayjs(l.startAt));
                                        return (
                                          <div
                                            key={l.id}
                                            className="flex items-center justify-between rounded-lg border p-3 bg-gray-50"
                                          >
                                            <div className="flex items-center gap-3">
                                              <div className="rounded-lg bg-emerald-100 p-2">
                                                <CalendarOutlined />
                                              </div>
                                              <div>
                                                <div className="font-medium text-gray-800">{l.title}</div>
                                                <div className="text-xs text-gray-500 flex flex-wrap items-center gap-2">
                                                  <span><CalendarOutlined /> {dayjs(l.startAt).format("YYYY/MM/DD")}</span>
                                                  <span><TimePicker /> {dayjs(l.startAt).format("HH:mm")}</span>
                                                  {l.duration ? <Tag>{l.duration} دقيقة</Tag> : null}
                                                  <Tag color={isFinished ? "default" : "green"}>{isFinished ? "منتهية" : "قادمة"}</Tag>
                                                  <Tag icon={l.locked ? <LockOutlined /> : <UnlockOutlined />} color={l.locked ? "default" : "blue"}>
                                                    {l.locked ? "مقفولة" : "متاحة"}
                                                  </Tag>
                                                </div>
                                              </div>
                                            </div>
                                            <Space>
                                              <Tooltip title="حذف">
                                                <Button danger icon={<DeleteOutlined />} onClick={() => deleteLiveSession(sec.id, l.id)} />
                                              </Tooltip>
                                            </Space>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  )}
                                </Card>
                              ))}
                            </div>
                          )}
                        </div>
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
                      htmltype="submit"
                      loading={loading}
                      className="px-8 py-3 bg-[#0F7490] text-white rounded-lg hover:!bg-[#0d5f75]"
                      icon={!loading ? <PlusOutlined /> : undefined}
                    >
                      {loading ? "جارٍ الحفظ..." : "حفظ التعديلات"}
                    </Button>
                  </div>
                </div>
              </Form>
            </div>
          </div>
        </div>

        {/* ============== Add Recorded Modal ============== */}
        <Modal
          title="إضافة محتوى مسجّل"
          open={openAddRecorded}
          onCancel={() => setOpenAddRecorded(false)}
          onOk={submitRecorded}
          okText="حفظ"
          confirmLoading={savingRecorded}
          width={800}
          destroyOnClose
        >
          <Form
            form={recForm}
            layout="vertical"
            initialValues={{
              sectionMode: "new",
              topics: [
                {
                  type: "video",
                  title: "",
                  locked: false,
                  videoSource: "url",
                  url: "",
                  duration: "",
                },
              ],
            }}
          >
            <Form.Item label="إضافة إلى" name="sectionMode" rules={[{ required: true }]}>
              <Radio.Group>
                <Radio value="new">قسم جديد</Radio>
                <Radio value="exist">قسم موجود</Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item noStyle shouldUpdate={(p, c) => p.sectionMode !== c.sectionMode}>
              {({ getFieldValue }) =>
                getFieldValue("sectionMode") === "new" ? (
                  <Form.Item
                    label="عنوان القسم الجديد"
                    name="sectionTitle"
                    rules={[{ required: true, message: "أدخل عنوان القسم" }]}
                  >
                    <Input placeholder="مثال: الوحدة 3 — الروابط الكيميائية" />
                  </Form.Item>
                ) : (
                  <Form.Item
                    label="اختر القسم"
                    name="sectionId"
                    rules={[{ required: true, message: "اختر القسم" }]}
                  >
                    <Select
                      placeholder="اختيار قسم"
                      options={(recorded || []).map((s) => ({ value: s.id, label: s.title }))}
                    />
                  </Form.Item>
                )
              }
            </Form.Item>

            <Divider />

            <Form.List name="topics">
              {(fields, { add, remove, move }) => (
                <>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="m-0">الموضوعات داخل القسم</h4>
                    <Button
                      type="dashed"
                      onClick={() =>
                        add({
                          type: "video",
                          title: "",
                          locked: false,
                          videoSource: "url",
                          url: "",
                          duration: "",
                        })
                      }
                    >
                      إضافة موضوع
                    </Button>
                  </div>

                  {fields.map(({ key, name, ...rest }) => (
                    <Card
                      key={key}
                      className="mb-3"
                      title={`موضوع #${name + 1}`}
                      extra={
                        <Space>
                         
                          <Button danger type="text" onClick={() => remove(name)}>
                            حذف
                          </Button>
                        </Space>
                      }
                    >
                      <Form.Item
                        {...rest}
                        label="عنوان الموضوع"
                        name={[name, "title"]}
                        rules={[{ required: true, message: "أدخل عنوان الموضوع" }]}
                      >
                        <Input placeholder="عنوان الفيديو/التدريب" />
                      </Form.Item>

                      <Form.Item
                        {...rest}
                        label="نوع العنصر"
                        name={[name, "type"]}
                        rules={[{ required: true }]}
                      >
                        <Select options={REC_TYPES} placeholder="اختر النوع" />
                      </Form.Item>

                      <Form.Item
                        noStyle
                        shouldUpdate={(prev, cur) => prev.topics?.[name]?.type !== cur.topics?.[name]?.type}
                      >
                        {({ getFieldValue }) => {
                          const t = getFieldValue(["topics", name, "type"]) || "video";

                          if (t === "video") {
                            return (
                              <>
                                <Form.Item label="مصدر الفيديو" name={[name, "videoSource"]} rules={[{ required: true }]}>
                                  <Radio.Group optionType="button" buttonStyle="solid">
                                    {VIDEO_SOURCES.map((s) => (
                                      <Radio key={s.value} value={s.value}>
                                        {s.label}
                                      </Radio>
                                    ))}
                                  </Radio.Group>
                                </Form.Item>

                                <Form.Item
                                  noStyle
                                  shouldUpdate={(p, c) =>
                                    p.topics?.[name]?.videoSource !== c.topics?.[name]?.videoSource
                                  }
                                >
                                  {({ getFieldValue }) => {
                                    const src = getFieldValue(["topics", name, "videoSource"]);
                                    return src === "url" ? (
                                      <Form.Item
                                        label="رابط الفيديو"
                                        name={[name, "url"]}
                                        rules={[{ required: true, message: "أدخل الرابط" }]}
                                      >
                                        <Input placeholder="https://youtube.com/watch?v=..." />
                                      </Form.Item>
                                    ) : (
                                      <Form.Item
                                        label="رفع ملف الفيديو"
                                        name={[name, "videoFile"]}
                                        valuePropName="fileList"
                                        getValueFromEvent={normFile}
                                        rules={[{ required: true, message: "ارفَع ملف فيديو" }]}
                                      >
                                        <Upload.Dragger beforeUpload={beforeUploadVideo} accept="video/*" maxCount={1}>
                                          <p className="ant-upload-drag-icon">🎥</p>
                                          <p className="ant-upload-text">اسحب ملف الفيديو هنا أو اضغط للاختيار</p>
                                        </Upload.Dragger>
                                      </Form.Item>
                                    );
                                  }}
                                </Form.Item>

                                <Form.Item label="المدة" name={[name, "duration"]}>
                                  <Input placeholder="مثال: 14:20" />
                                </Form.Item>
                              </>
                            );
                          }

                          // training
                          return (
                            <>
                              <Divider>إعدادات التدريب</Divider>

                              <Form.Item
                                label="مصدر فيديو التدريب"
                                name={[name, "trainingVideoSource"]}
                                initialValue="url"
                                rules={[{ required: true }]}
                              >
                                <Radio.Group optionType="button" buttonStyle="solid">
                                  {VIDEO_SOURCES.map((s) => (
                                    <Radio key={s.value} value={s.value}>
                                      {s.label}
                                    </Radio>
                                  ))}
                                </Radio.Group>
                              </Form.Item>

                              <Form.Item
                                noStyle
                                shouldUpdate={(p, c) =>
                                  p.topics?.[name]?.trainingVideoSource !== c.topics?.[name]?.trainingVideoSource
                                }
                              >
                                {({ getFieldValue }) => {
                                  const src = getFieldValue(["topics", name, "trainingVideoSource"]);
                                  return src === "url" ? (
                                    <Form.Item
                                      label="رابط فيديو التدريب"
                                      name={[name, "trainingVideoUrl"]}
                                      rules={[{ required: true, message: "أدخل الرابط" }]}
                                    >
                                      <Input placeholder="https://..." />
                                    </Form.Item>
                                  ) : (
                                    <Form.Item
                                      label="رفع فيديو التدريب"
                                      name={[name, "trainingVideoFile"]}
                                      valuePropName="fileList"
                                      getValueFromEvent={normFile}
                                      rules={[{ required: true, message: "ارفع ملف فيديو" }]}
                                    >
                                      <Upload.Dragger beforeUpload={beforeUploadVideo} accept="video/*" maxCount={1}>
                                        <p className="ant-upload-drag-icon">🎥</p>
                                        <p className="ant-upload-text">اسحب ملف الفيديو هنا أو اضغط للاختيار</p>
                                      </Upload.Dragger>
                                    </Form.Item>
                                  );
                                }}
                              </Form.Item>

                              <Form.Item
                                label="ملفات PDF للتدريب (يمكن رفع أكثر من ملف)"
                                name={[name, "pdfs"]}
                                valuePropName="fileList"
                                getValueFromEvent={normFile}
                                rules={[{ required: true, message: "أضف ملف PDF واحدًا على الأقل" }]}
                              >
                                <Upload.Dragger beforeUpload={beforeUploadPdf} accept=".pdf" multiple>
                                  <p className="ant-upload-drag-icon">📄</p>
                                  <p className="ant-upload-text">اسحب ملفات PDF هنا أو اضغط للاختيار</p>
                                </Upload.Dragger>
                              </Form.Item>
                            </>
                          );
                        }}
                      </Form.Item>
                    </Card>
                  ))}

                  {fields.length === 0 && (
                    <div className="text-gray-500 text-center py-4">لا توجد موضوعات بعد — اضغط “إضافة موضوع”.</div>
                  )}
                </>
              )}
            </Form.List>
          </Form>
        </Modal>

        {/* ============== Add Live Modal ============== */}
        <Modal
          title="إضافة محاضرات مباشرة"
          open={openAddLive}
          onCancel={() => setOpenAddLive(false)}
          onOk={submitLive}
          okText="حفظ"
          confirmLoading={savingLive}
          width={800}
          destroyOnClose
        >
          <Form
            form={liveForm}
            layout="vertical"
            initialValues={{
              sectionMode: "new",
              sessions: [{ title: "", date: null, time: null, duration: 60, meetingUrl: "", locked: false }],
            }}
          >
            <Form.Item label="إضافة إلى" name="sectionMode" rules={[{ required: true }]}>
              <Radio.Group>
                <Radio value="new">قسم جديد</Radio>
                <Radio value="exist">قسم موجود</Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item noStyle shouldUpdate={(p, c) => p.sectionMode !== c.sectionMode}>
              {({ getFieldValue }) =>
                getFieldValue("sectionMode") === "new" ? (
                  <Form.Item
                    label="عنوان القسم الجديد"
                    name="sectionTitle"
                    rules={[{ required: true, message: "أدخل عنوان القسم" }]}
                  >
                    <Input placeholder="مثال: محاضرات الوحدة 3" />
                  </Form.Item>
                ) : (
                  <Form.Item
                    label="اختر القسم"
                    name="sectionId"
                    rules={[{ required: true, message: "اختر القسم" }]}
                  >
                    <Select
                      placeholder="اختيار قسم"
                      options={(liveLectures || []).map((s) => ({ value: s.id, label: s.title }))}
                    />
                  </Form.Item>
                )
              }
            </Form.Item>

            <Divider />

            <Form.List name="sessions">
              {(fields, { add, remove, move }) => (
                <>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="m-0">الجلسات داخل القسم</h4>
                    <Button
                      type="dashed"
                      onClick={() => add({ title: "", date: null, time: null, duration: 60, meetingUrl: "", locked: false })}
                    >
                      إضافة جلسة
                    </Button>
                  </div>

                  {fields.map(({ key, name, ...rest }) => (
                    <Card
                      key={key}
                      className="mb-3"
                      title={`جلسة #${name + 1}`}
                      extra={
                        <Space>
                          
                          <Button danger type="text" onClick={() => remove(name)}>
                            حذف
                          </Button>
                        </Space>
                      }
                    >
                      <Form.Item
                        {...rest}
                        label="عنوان الجلسة"
                        name={[name, "title"]}
                        rules={[{ required: true, message: "أدخل عنوان الجلسة" }]}
                      >
                        <Input placeholder="مثال: مراجعة شاملة للوحدة" />
                      </Form.Item>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <Form.Item
                          label="التاريخ"
                          name={[name, "date"]}
                          rules={[{ required: true, message: "اختر التاريخ" }]}
                        >
                          <DatePicker className="w-full" />
                        </Form.Item>
                        <Form.Item
                          label="الوقت"
                          name={[name, "time"]}
                          rules={[{ required: true, message: "اختر الوقت" }]}
                        >
                          <TimePicker className="w-full" format="HH:mm" />
                        </Form.Item>
                        <Form.Item label="المدة (دقيقة)" name={[name, "duration"]}>
                          <Input placeholder="مثال: 60" />
                        </Form.Item>
                      </div>

                      <Form.Item label="رابط الغرفة" name={[name, "meetingUrl"]}>
                        <Input placeholder="رابط Zoom/Meet…" />
                      </Form.Item>

                      <Form.Item label="مقفولة؟" name={[name, "locked"]} valuePropName="checked">
                        <Switch />
                      </Form.Item>
                    </Card>
                  ))}
                </>
              )}
            </Form.List>
          </Form>
        </Modal>
      </Modal>
    </ConfigProvider>
  );
};

export default EditTeacherCourseForm;
