"use client";

import React, { useState } from "react";
import {
  PlusOutlined,
  BookOutlined,
  FileTextOutlined,
  InboxOutlined,
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
import dayjs from "dayjs";

import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import PageLayout from "../../../../components/layout/PageLayout";
import BreadcrumbsShowcase from "../../../../components/ui/BreadCrumbs";
import { BarChart3, Book, Plus } from "lucide-react";
import PagesHeader from "../../../../components/ui/PagesHeader";
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const { Dragger } = Upload;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

// helper: convert file -> base64 (لمعاينة محلية، أو كحل مؤقت)
const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });

// إعدادات التولبار/الفورمات للمحرر
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

// غلاف صغير يربط ReactQuill مع antd Form
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

const AddSubjectForm = ({ open, setOpen }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // 🖼️ إدارة رفع الصورة
  const [fileList, setFileList] = useState([]);
  const [imagePreview, setImagePreview] = useState(null); // base64 أو URL من السيرفر لاحقًا

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
    return false; // إيقاف الرفع التلقائي
  };

  const handleFinish = async () => {
    setLoading(true);
    try {
      const raw = form.getFieldsValue(true);

      // تأكيد وجود صورة
      if (!imagePreview) {
        message.error("من فضلك ارفع صورة الدورة أولاً.");
        setLoading(false);
        return;
      }

      const payload = {
        code: raw.code?.toUpperCase(),
        imageUrl: imagePreview, // 👈 نستخدم المعاينة (base64) مؤقتًا — استبدلها بـ URL من API في الإنتاج
        name: raw.name?.trim(),
        price: Number(raw.price ?? 0),
        duration: raw.duration?.trim(),
        attachment: raw.attachment?.trim(),
        description: raw.description?.trim(),
        status: raw.status, // "نشط" | "غير نشط" | "مسودة"
        genderPolicy: raw.genderPolicy, // "male" | "female" | "both"
        capacity: Number(raw.capacity ?? 0),
        availableFrom: raw.availableRange?.[0]
          ? dayjs(raw.availableRange[0]).format("YYYY-MM-DD")
          : undefined,
        availableTo: raw.availableRange?.[1]
          ? dayjs(raw.availableRange[1]).format("YYYY-MM-DD")
          : undefined,

        // الحقول المنسقة (HTML)
        summary: raw.summary || "",
        terms: raw.terms || "",
        features: raw.features || "",
        overview: raw.overview || "",
      };

      // Simulate API
      await new Promise((r) => setTimeout(r, 1200));

      console.log("Form Data:", payload);
      message.success("تمت إضافة الدورة بنجاح!");
      form.resetFields();
      setFileList([]);
      setImagePreview(null);
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
  };

  const breadcrumbs = [
    { label: "الرئيسية", href: "/", icon: BarChart3 },
    { label: "الدورات", href: "/subjects", icon: Book },
    {
      label: "إضافة دورة جديدة",
      href: "/subjects/new",
      icon: Plus,
      current: true,
    },
  ];

  return (
    <PageLayout>
      <BreadcrumbsShowcase items={breadcrumbs} variant="pill" />
      {/* Header */}
      <PagesHeader
        title={
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#0F7490] rounded-lg flex items-center justify-center">
              <PlusOutlined className="text-white text-lg" />
            </div>
            إضافة دورة جديدة{" "}
          </div>
        }
        subtitle={"إنشاء وتكوين دورة تعليمية جديدة"}
        extra={null}
      />
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#0F7490",
            borderRadius: 12,
            controlHeight: 44,
          },
        }}
      >
        <section
          title={null}
          open={open}
          onCancel={() => setOpen(false)}
          footer={null}
          className="!w-full "
        >
          <div className="bg-[#F9FAFC]" dir="rtl">
            <div className="mx-auto">
             

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
                    features:
                      "<ul><li>محاضرات مسجلة</li><li>اختبارات تفاعلية</li><li>شهادة اجتياز</li></ul>",
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
                      {/* 🆕 رفع صورة بدل الرابط */}
                      <Form.Item
                        label={
                          <span className="font-medium">صورة الدورة *</span>
                        }
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
                        label={
                          <span className="font-medium">سياسة النوع *</span>
                        }
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
                        إعادة ضبط
                      </Button>
                      <Button
                        type="primary"
                        htmltype="submit"
                        loading={loading}
                        className="px-8 py-3 bg-[#0F7490] text-white rounded-lg hover:!bg-[#0d5f75]"
                        icon={!loading ? <PlusOutlined /> : undefined}
                      >
                        {loading ? "جارٍ الإضافة..." : "إضافة الدورة"}
                      </Button>
                    </div>
                  </div>
                </Form>
              </div>
            </div>
          </div>

          {/* ✅ RTL لواجهة المحرر والـ placeholder */}
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
        </section>
      </ConfigProvider>
    </PageLayout>
  );
};

export default AddSubjectForm;
