"use client";
import React, { useMemo, useState } from "react";
import {
  ConfigProvider,
  Modal,
  Form,
  Input,
  Button,
  Divider,
  Select,
  message,
} from "antd";
import { PlusOutlined, SendOutlined } from "@ant-design/icons";


export default function AddSupportModal({ open, setOpen, onSubmit, palette }) {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

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
    setOpen(false);
  };

  const onFinish = async (values) => {
    const payload = {
      id: `s-${Date.now()}`,
      name: values.name?.trim(),
      desc: values.desc?.trim() || "",
      video: values.video?.trim(),
      tags: values.tags || [],
      createdAt: new Date().toISOString().slice(0, 10),
    };

    try {
      setSubmitting(true);
      if (typeof onSubmit === "function") {
        await onSubmit(payload);
      } else {
        message.success("تمت إضافة مادة الدعم بنجاح ✅");
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
      <Modal open={open} onCancel={handleClose} title={null} footer={null} destroyOnHidden className="!w-full max-w-3xl">
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
                إضافة مادة دعم
              </h2>
            </div>
            <p className="text-sm text-gray-500">
              أدخل عنوان الدورة، رابط الفيديو (YouTube أو MP4)، ووصفًا موجزًا.
            </p>
          </div>

          <Divider className="my-4" />

          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{ name: "", desc: "", video: "", tags: [] }}
          >
            <Form.Item
              label="العنوان"
              name="name"
              rules={[{ required: true, message: "أدخل عنوان الدورة" }]}
            >
              <Input placeholder="مثال: كيفية إنشاء حساب جديد" />
            </Form.Item>

            <Form.Item
              label="رابط الفيديو"
              name="video"
              rules={[
                { required: true, message: "أدخل رابط الفيديو" },
                { type: "url", message: "الرابط غير صالح" },
              ]}
              extra="يدعم روابط YouTube بصيغها المختلفة أو ملف MP4 مباشر."
            >
              <Input placeholder="https://www.youtube.com/watch?v=..." />
            </Form.Item>

            <Form.Item label="الوصف" name="desc">
              <Input.TextArea autoSize={{ minRows: 3, maxRows: 6 }} placeholder="نبذة مختصرة عن الدورة…" />
            </Form.Item>


            <div className="flex items-center justify-end gap-3">
              <Button onClick={handleClose}>إلغاء</Button>
              <Button
              className="bg-primary text-white"
                type="primary"
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
