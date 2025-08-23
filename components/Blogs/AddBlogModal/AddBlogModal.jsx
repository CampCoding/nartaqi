"use client";
import React, { useMemo, useState } from "react";
import {
  ConfigProvider,
  Modal,
  Form,
  Input,
  DatePicker,
  InputNumber,
  Upload,
  Button,
  Divider,
  message,
} from "antd";
import dayjs from "dayjs";
import { PlusOutlined, UploadOutlined, SendOutlined } from "@ant-design/icons";

export default function AddBlogModal({ open, setOpen, onSubmit, palette }) {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [fileList, setFileList] = useState([]);

  const PALETTE = useMemo(
    () => ({
      primary: (palette && palette.primary) || "#0F7490",
      text: (palette && palette.text) || "#202938",
      background: (palette && palette.background) || "#F9FAFC",
    }),
    [palette]
  );

  const handleClose = () => {
    form.resetFields();
    setFileList([]);
    setOpen(false);
  };

  const normalizeUpload = ({ fileList: fl }) => fl;

  const onFinish = async (values) => {
    try {
      setSubmitting(true);

      // استخدم رابط الصورة إن وُجد؛ وإلا استخدم الصورة المرفوعة (معاينة)
      const imageFromUrl = (values.imageUrl || "").trim();
      const imageFromUpload = fileList?.[0]?.thumbUrl || "";

      const payload = {
        id: `b-${Date.now()}`,
        title: values.title?.trim(),
        desc: values.desc?.trim() || "",
        date: values.date ? values.date.format("YYYY-MM-DD") : dayjs().format("YYYY-MM-DD"),
        comments: Number(values.comments ?? 0),
        views: Number(values.views ?? 0),
        image: imageFromUrl || imageFromUpload || "",
        // إن أردت الرفع الفعلي لاحقًا على السيرفر
        imageFile: fileList?.[0]?.originFileObj,
      };

      if (!payload.image) {
        message.warning("أضف رابط صورة أو ارفع صورة الغلاف.");
        setSubmitting(false);
        return;
      }

      if (typeof onSubmit === "function") {
        await onSubmit(payload);
      } else {
        message.success("تمت إضافة المقال بنجاح ✅");
      }

      handleClose();
    } finally {
      setSubmitting(false);
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
        open={open}
        onCancel={handleClose}
        title={null}
        footer={null}
        className="!w-full max-w-3xl"
      >
        <div className="bg-white" dir="rtl">
          {/* Header */}
          <div className="mb-3">
            <div className="flex items-center gap-3 mb-1">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ background: PALETTE.primary }}
              >
                <PlusOutlined className="text-white text-lg" />
              </div>
              <h2 className="text-2xl font-bold" style={{ color: PALETTE.text }}>
                إضافة مقال جديد
              </h2>
            </div>
            <p className="text-sm text-gray-500">أدخل بيانات المقال ثم اضغط “إضافة”.</p>
          </div>

          <Divider className="my-4" />

          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{
              date: dayjs(),
              comments: 0,
              views: 0,
            }}
          >
            <Form.Item
              label="العنوان"
              name="title"
              rules={[{ required: true, message: "الرجاء إدخال العنوان" }]}
            >
              <Input placeholder="مثال: كيف تحسن مهارة الكتابة العربية؟" />
            </Form.Item>

            <Form.Item
              label="الوصف المختصر"
              name="desc"
              rules={[{ required: true, message: "الرجاء إدخال الوصف" }]}
            >
              <Input.TextArea placeholder="نبذة قصيرة عن المقال…" autoSize={{ minRows: 3, maxRows: 6 }} />
            </Form.Item>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Item label="تاريخ النشر" name="date">
                <DatePicker className="w-full" />
              </Form.Item>

              <Form.Item label="رابط الصورة (اختياري)" name="imageUrl" rules={[{ type: "url", message: "الرابط غير صالح" }]}>
                <Input placeholder="https://example.com/image.jpg" />
              </Form.Item>
            </div>

            <Form.Item
              label="رفع صورة الغلاف (اختياري)"
              name="imageUpload"
              valuePropName="fileList"
              getValueFromEvent={normalizeUpload}
              extra="لن يتم الرفع فعلياً هنا — أرسل الملف من خلال onSubmit إن رغبت."
            >
              <Upload.Dragger
                name="file"
                fileList={fileList}
                maxCount={1}
                accept="image/*"
                beforeUpload={() => false} // منع الرفع التلقائي
                onChange={({ fileList }) => setFileList(fileList)}
              >
                <p className="ant-upload-drag-icon">
                  <UploadOutlined />
                </p>
                <p className="ant-upload-text">اسحب وأفلت الصورة هنا أو اضغط للاختيار</p>
                <p className="ant-upload-hint">يدعم JPG, PNG, WEBP (ملف واحد).</p>
              </Upload.Dragger>
            </Form.Item>

            

            {/* Footer actions */}
            <div className="flex items-center justify-end gap-3">
              <Button onClick={handleClose}>إلغاء</Button>
              <Button
                type="primary"
                className="bg-primary text-white"
                icon={<SendOutlined />}
                loading={submitting}
                onClick={() => form.submit()}
              >
                إضافة
              </Button>
            </div>
          </Form>
        </div>
      </Modal>
    </ConfigProvider>
  );
}
