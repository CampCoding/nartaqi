"use client";

import React, { useEffect, useState } from "react";
import {
  PlusOutlined,
  BookOutlined,
  FileTextOutlined,
  InboxOutlined,
  EditOutlined,
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
} from "antd";
import '@ant-design/v5-patch-for-react-19';
import dayjs from "dayjs";

import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const { Dragger } = Upload;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

// ===== Helpers =====
const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });

// Quill toolbar/formats
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
  // "bullet",
  "align",
  "direction",
  "color",
  "background",
  "link",
  "blockquote",
  "code-block",
];

// RichText wrapper
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

const EditSubjectForm = ({ open, setOpen, subject, onUpdate }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Image state (existing URL or new base64)
  const [fileList, setFileList] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);

  // Hydrate form when modal opens or subject changes
  useEffect(() => {
    if (!open) return;

    // Build initial values from subject
    const init = {
      code: subject?.code || "",
      name: subject?.name || "",
      price: subject?.price ?? null,
      duration: subject?.duration || "",
      attachment: subject?.attachment || "",
      description: subject?.description || "",
      status: subject?.status || "نشط",
      genderPolicy: subject?.genderPolicy || "both",
      capacity: subject?.capacity ?? null,
      availableRange: [
        subject?.availableFrom ? dayjs(subject.availableFrom) : null,
        subject?.availableTo ? dayjs(subject.availableTo) : null,
      ],
      summary: subject?.summary || "",
      terms: subject?.terms || "",
      features: subject?.features || "",
      overview: subject?.overview || "",
    };

    form.setFieldsValue(init);

    const img = subject?.imageUrl || null;
    setImagePreview(img);
    setFileList(
      img
        ? [
            {
              uid: "existing-image",
              name: "current-image",
              status: "done",
              url: img,
            },
          ]
        : []
    );
  }, [open, subject, form]);

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

  const handleFinish = async () => {
    setLoading(true);
    try {
      const raw = form.getFieldsValue(true);

      // الصورة: لو المستخدم مسحها، ننبهه (اختياري)
      if (!imagePreview) {
        message.warning(
          "لم يتم تحديد صورة للمادة. سيتم حفظ التعديل بدون صورة."
        );
      }

      const payload = {
        id: subject?.id, // لو عندك ID
        code: raw.code?.toUpperCase() || subject?.code || "", // نضمن عدم فقدان القيمة
        imageUrl: imagePreview || subject?.imageUrl || "", // لو لم تُغيَّر؛ تبقى القديمة
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
        // rich text
        summary: raw.summary || "",
        terms: raw.terms || "",
        features: raw.features || "",
        overview: raw.overview || "",
      };

      // call API/update
      await new Promise((r) => setTimeout(r, 800));
      if (onUpdate) onUpdate(payload);
      console.log("Update Payload:", payload);

      message.success("تم حفظ التعديلات بنجاح!");
      setOpen(false);
    } catch (e) {
      message.error("فشل حفظ التعديلات. حاول مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    if (!subject) return;
    // رجّع القيم الأصلية
    form.resetFields();
    const img = subject?.imageUrl || null;
    setImagePreview(img);
    setFileList(
      img
        ? [
            {
              uid: "existing-image",
              name: "current-image",
              status: "done",
              url: img,
            },
          ]
        : []
    );
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
        className="!w-full max-w-4xl"
      >
        <div className="bg-[#F9FAFC]" dir="rtl">
          <div className="mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-[#0F7490] rounded-lg flex items-center justify-center">
                  <EditOutlined className="text-white text-lg" />
                </div>
                <h1 className="text-3xl font-bold text-[#202938]">
                  تعديل بيانات الدورة
                </h1>
              </div>
              <p className="text-gray-600">حرّر بيانات الدورة وحفظ التغييرات</p>
            </div>

            <div className="bg-white border-0 rounded-2xl overflow-hidden p-6">
              <Form
                form={form}
                layout="vertical"
                onFinish={handleFinish}
                className="space-y-6"
              >
                {/* Basic Information */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="text-xl font-semibold text-[#202938] mb-4 flex items-center gap-2">
                    <BookOutlined className="text-[#0F7490]" />
                    المعلومات الأساسية
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      {/* صورة الدورة */}
                      <Form.Item
                        label={<span className="font-medium">صورة الدورة</span>}
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
                          <p className="ant-upload-hint">الحد 5MB</p>
                        </Dragger>
                      </Form.Item>

                      {/* اسم الدورة */}
                      <Form.Item
                        label={
                          <span className="font-medium">اسم الدورة *</span>
                        }
                        name="name"
                        rules={[
                          { required: true, message: "أدخل اسم الدورة" },
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

                      {/* السعر */}

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

                    </div>

                    <div>
                     
                      {/* المدة */}
                      <Form.Item
                        label={<span className="font-medium">المدة</span>}
                        name="duration"
                        rules={[{ required: true, message: "أدخل مدة الدورة" }]}
                      >
                        <Input placeholder="مثال: 3 شهور" />
                      </Form.Item>

                      {/* المرفقات */}
                      <Form.Item
                        label={<span className="font-medium">المرفقات</span>}
                        name="attachment"
                      >
                        <Input placeholder="مثال: شامل كتاب الدورة pdf" />
                      </Form.Item>

                      {/* الوصف */}
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
                          rows={8}
                          placeholder="وصف مختصر..."
                          className="resize-none"
                        />
                      </Form.Item>
                    </div>
                  </div>
                </div>

                {/* Subject Configuration */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="text-xl font-semibold text-[#202938] mb-4 flex items-center gap-2">
                    <FileTextOutlined className="text-[#0F7490]" />
                    إعدادات الدورة
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

                  <Form.Item
                    label="نبذة مختصرة"
                    name="summary"
                    valuePropName="value"
                    getValueFromEvent={(v) => v}
                  >
                    <RichTextField placeholder="اكتب نبذة مختصرة عن الدورة..." />
                  </Form.Item>

                  <Form.Item
                    label="الشروط والأحكام"
                    name="terms"
                    valuePropName="value"
                    getValueFromEvent={(v) => v}
                  >
                    <RichTextField placeholder="أدخل الشروط والأحكام الخاصة بالالتحاق..." />
                  </Form.Item>

                  <Form.Item
                    label="مميزات الدورة"
                    name="features"
                    valuePropName="value"
                    getValueFromEvent={(v) => v}
                  >
                    <RichTextField placeholder="اذكر مميزات الدورة بنقاط..." />
                  </Form.Item>

                  <Form.Item
                    label="نبذة عن الدورة"
                    name="overview"
                    valuePropName="value"
                    getValueFromEvent={(v) => v}
                  >
                    <RichTextField placeholder="تفاصيل موسعة عن محتوى ومحاور الدورة..." />
                  </Form.Item>
                </div>

                {/* Actions */}
                <div className="border-t border-gray-200 pt-6">
                  <div className="flex justify-end gap-4">
                    <Button
                      type="default"
                      onClick={handleReset}
                      className="px-8 py-3 text-gray-700 border border-gray-300 rounded-lg hover:border-gray-400"
                    >
                      تراجع عن التغييرات
                    </Button>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={loading}
                      className="px-8 py-3 bg-[#0F7490] text-white rounded-lg hover:!bg-[#0d5f75]"
                      icon={!loading ? <EditOutlined /> : undefined}
                    >
                      {loading ? "جارٍ الحفظ..." : "حفظ التعديلات"}
                    </Button>
                  </div>
                </div>
              </Form>
            </div>
          </div>
        </div>

        {/* RTL tweaks for Quill */}
        <style jsx global>{`
          .ql-rtl .ql-editor {
            direction: rtl;
            text-align: right;
          }
          .ql-rtl .ql-editor.ql-blank::before {
            right: 12px;
            left: auto;
            text-align: right;
          }
        `}</style>
      </Modal>
    </ConfigProvider>
  );
};

export default EditSubjectForm;
