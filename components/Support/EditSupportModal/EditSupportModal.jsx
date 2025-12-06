"use client";
import React, { useMemo, useState, useEffect } from "react";
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
import { EditOutlined, SendOutlined } from "@ant-design/icons";

export default function EditSupportModal({
  open,
  rowData,
  setOpen,
  onSubmit,
  palette,
}) {
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

  // عند فتح المودال، عبّي الفورم من rowData
  useEffect(() => {
    if (!open) return;
    const initial = {
      name: rowData?.name || "",
      video: rowData?.video || "",
      desc: rowData?.desc || "",
      tags: Array.isArray(rowData?.tags) ? rowData.tags : [],
    };
    form.setFieldsValue(initial);
  }, [open, rowData, form]);

  const handleClose = () => {
    form.resetFields();
    setOpen(false);
  };

  const onFinish = async (values) => {
    const payload = {
      // احتفظ بنفس الـ id وتاريخ الإنشاء إن وجد
      id: rowData?.id || `s-${Date.now()}`,
      createdAt:
        rowData?.createdAt || new Date().toISOString().slice(0, 10),

      // الحقول القابلة للتعديل
      name: values.name?.trim(),
      desc: values.desc?.trim() || "",
      video: values.video?.trim(),
      tags: values.tags || [],

      // أي حقول إضافية غير مذكورة نحافظ عليها
      ...rowData,
    };

    try {
      setSubmitting(true);
      if (typeof onSubmit === "function") {
        await onSubmit(payload, { mode: "edit" });
      } else {
        message.success("تم حفظ التعديلات بنجاح ✅");
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
        destroyOnHidden
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
                <EditOutlined className="text-white text-lg" />
              </div>
              <h2
                className="text-2xl font-bold"
                style={{ color: PALETTE.text }}
              >
                تعديل مادة دعم
              </h2>
            </div>
            <p className="text-sm text-gray-500">
              حدّث العنوان، رابط الفيديو، الوصف والوسوم ثم احفظ التعديلات.
            </p>
          </div>

          <Divider className="my-4" />

          <Form form={form} layout="vertical" onFinish={onFinish}>
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
              <Input.TextArea
                autoSize={{ minRows: 3, maxRows: 6 }}
                placeholder="نبذة مختصرة عن الدورة…"
              />
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
                حفظ التعديلات
              </Button>
            </div>
          </Form>
        </div>
      </Modal>
    </ConfigProvider>
  );
}
