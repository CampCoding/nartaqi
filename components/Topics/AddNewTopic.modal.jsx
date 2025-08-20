"use client";

import React, { useMemo, useState } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  Button,
  ConfigProvider,
  Tag,
  Upload,
  message,
  DatePicker,
} from "antd";
import {
  PlusOutlined,
  InboxOutlined,
  BookOutlined,
} from "@ant-design/icons";

const { TextArea } = Input;
const { Dragger } = Upload;

const PALETTE = {
  primary: "#0F7490",
  secondary: "#C9AE6C",
  accent: "#8B5CF6",
  background: "#F9FAFC",
  text: "#202938",
};

const TOPIC_COLORS = [
  "#0F7490",
  "#C9AE6C",
  "#8B5CF6",
  "#10B981",
  "#6366F1",
  "#F59E0B",
  "#EF4444",
  "#EC4899",
];

const toISO = (d) =>
  d
    ? typeof d.toDate === "function"
      ? d.toDate().toISOString()
      : d.toISOString?.()
    : null;

function AddTopicForm({ open, onCancel, onSubmit, units = [], defaultUnitId }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [color, setColor] = useState(TOPIC_COLORS[2]);
  const [coverPreview, setCoverPreview] = useState(null);
  const [tags, setTags] = useState([]);
  const [videoFile, setVideoFile] = useState(null);

  const unitOptions = useMemo(
    () =>
      units.map((u) => ({
        label: u.code ? `${u.name} (${u.code})` : u.name,
        value: String(u.id),
      })),
    [units]
  );

  const handleFinish = async (values) => {
    const payload = {
      ...values,
      color,
      startDate: toISO(values.startDate),
      tags,
      cover: coverPreview,
      video: videoFile,
    };

    try {
      setLoading(true);
      if (typeof onSubmit === "function") {
        await onSubmit(payload);
      } else {
        await new Promise((r) => setTimeout(r, 700));
        console.log("Topic payload:", payload);
      }
      message.success("تم إنشاء الموضوع بنجاح");
      form.resetFields();
      setTags([]);
      setCoverPreview(null);
      setVideoFile(null);
      setColor(TOPIC_COLORS[2]);
      onCancel && onCancel();
    } catch (e) {
      message.error("فشل إنشاء الموضوع. حاول مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ConfigProvider
      direction="rtl"
      theme={{
        token: {
          colorPrimary: PALETTE.primary,
          borderRadius: 14,
          colorText: PALETTE.text,
          controlHeight: 44,
        },
      }}
    >
      <Modal
        title={null}
        open={open}
        onCancel={() => {
          form.resetFields();
          setTags([]);
          setCoverPreview(null);
          setVideoFile(null);
          setColor(TOPIC_COLORS[2]);
          onCancel && onCancel();
        }}
        footer={null}
        className="!w-full max-w-4xl"
      >
        <div className="bg-background" dir="rtl">
          {/* العنوان */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-sm">
                <PlusOutlined className="text-white text-lg" />
              </div>
              <h2 className="text-3xl font-bold text-text">إضافة موضوع جديد</h2>
            </div>
            <p className="text-gray-600">إنشاء وتكوين موضوع داخل وحدة.</p>
          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={handleFinish}
            initialValues={{
              topicName: "",
              topicCode: "",
              unitId: defaultUnitId ? String(defaultUnitId) : undefined,
              description: "",
              learningObjectives: "",
              difficulty: "medium",
              status: "active",
              order: 1,
              estMinutes: 30,
              startDate: null,
              isPublished: true,
            }}
            className="grid grid-cols-1 lg:grid-cols-1 gap-6"
          >
            {/* المعلومات الأساسية */}
            <div className="space-y-6">
              <div className="bg-gray-50 p-5 rounded-xl">
                <h3 className="text-lg font-semibold text-text mb-4 flex items-center gap-2">
                  <BookOutlined className="text-primary" />
                  المعلومات الأساسية
                </h3>

                <Form.Item
                  label={<span className="text-text font-medium">اسم الموضوع *</span>}
                  name="topicName"
                  rules={[
                    { required: true, message: "من فضلك أدخل اسم الموضوع" },
                    {
                      validator: (_, v) =>
                        !v || v.trim().length >= 2
                          ? Promise.resolve()
                          : Promise.reject(new Error("يجب ألا يقل الاسم عن حرفين")),
                    },
                  ]}
                >
                  <Input
                    placeholder="مثال: تركيب الخلية"
                    className="rounded-lg px-4 py-3 border hover:border-primary focus:border-primary"
                  />
                </Form.Item>

                <Form.Item
                  label={<span className="text-text font-medium">وصف مختصر *</span>}
                  name="description"
                  rules={[
                    { required: true, message: "من فضلك أدخل الوصف" },
                    {
                      validator: (_, v) =>
                        !v || v.trim().length >= 10
                          ? Promise.resolve()
                          : Promise.reject(new Error("على الأقل 10 أحرف")),
                    },
                  ]}
                >
                  <TextArea
                    rows={4}
                    placeholder="ملخّص موجز لما يتناوله هذا الموضوع…"
                    className="rounded-lg px-4 py-3 border hover:border-primary focus:border-primary resize-none"
                  />
                </Form.Item>

                <Form.Item
                  label={<span className="text-text font-medium">أهداف التعلّم</span>}
                  name="learningObjectives"
                >
                  <TextArea
                    rows={3}
                    placeholder="مثال: تحديد العضيات؛ شرح النقل عبر الغشاء؛ …"
                    className="rounded-lg px-4 py-3 border hover:border-primary focus:border-primary resize-none"
                  />
                </Form.Item>

                {/* الحالة */}
                <div className="mb-4">
                  <label className="text-text font-medium block mb-2">
                    الحالة *
                  </label>
                  <Form.Item name="status" rules={[{ required: true }]} className="!mb-0">
                    <Select
                      className="rounded-lg"
                      options={[
                        { label: "🟢 نشط", value: "active" },
                        { label: "⚪ غير نشط", value: "inactive" },
                        { label: "🟡 مسودة", value: "draft" },
                      ]}
                    />
                  </Form.Item>
                </div>

                {/* الوسوم */}
                <div className="mb-4">
                  <label className="text-text font-medium block mb-2">الوسوم</label>
                  <Select
                    mode="tags"
                    placeholder="أضف وسومًا ثم اضغط إدخال"
                    value={tags}
                    onChange={setTags}
                    tokenSeparators={[","]}
                    className="w-full rounded-lg"
                  />
                  {!!tags?.length && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {tags.map((t) => (
                        <Tag key={t}>{t}</Tag>
                      ))}
                    </div>
                  )}
                </div>

                {/* تحميل فيديو */}
                <div className="mb-4">
                  <label className="text-text font-medium block mb-2">تحميل فيديو</label>
                  <Dragger
                    accept="video/*"
                    maxCount={1}
                    beforeUpload={(file) => {
                      const isVideo = file.type.startsWith("video/");
                      if (!isVideo) {
                        message.error("الرجاء تحميل ملف فيديو فقط.");
                        return Upload.LIST_IGNORE;
                      }
                      setVideoFile(file);
                      return false; // prevent auto upload
                    }}
                    onRemove={() => setVideoFile(null)}
                    fileList={videoFile ? [videoFile] : []}
                  >
                    <p className="ant-upload-drag-icon">
                      <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">اسحب الفيديو هنا أو انقر للتحميل</p>
                    <p className="ant-upload-hint text-sm text-gray-500">
                      صيغة الفيديو المسموحة مثل MP4 - لن يتم رفع الملف تلقائيًا
                    </p>
                  </Dragger>
                </div>
              </div>
            </div>

            {/* الأزرار */}
            <div className="lg:col-span-2 border-t border-gray-200 pt-6">
              <div className="flex justify-end gap-4">
                <Button
                  type="default"
                  onClick={() => {
                    form.resetFields();
                    setTags([]);
                    setCoverPreview(null);
                    setVideoFile(null);
                    setColor(TOPIC_COLORS[2]);
                  }}
                  className="px-8 py-3 text-gray-700 border border-gray-300 rounded-lg hover:border-gray-400"
                >
                  إعادة ضبط
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  className="px-8 py-3 bg-primary text-white rounded-lg hover:!bg-[#0d5f75]"
                  icon={!loading ? <PlusOutlined /> : undefined}
                >
                  {loading ? "جارٍ الإضافة..." : "إضافة الموضوع"}
                </Button>
              </div>
            </div>
          </Form>
        </div>
      </Modal>
    </ConfigProvider>
  );
}

export default AddTopicForm;
