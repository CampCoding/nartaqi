"use client";
import React, { useEffect, useMemo, useState } from "react";
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

export default function EditBlogModal({
  open,
  rowData,
  setRowData, // اختياري: لتحديث الحالة في الصفحة الأم
  setOpen,
  onSubmit,
  palette,
}) {
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

  // جهّز القيم الابتدائية عند فتح المودال أو تغيّر rowData
  useEffect(() => {
    if (!open) return;
    const init = {
      title: rowData?.title ?? "",
      desc: rowData?.desc ?? "",
      date: rowData?.date ? dayjs(rowData.date) : undefined,
      imageUrl: "", // نتركه فارغًا لأن لدينا صورة موجودة أصلًا
      comments: rowData?.comments ?? 0,
      views: rowData?.views ?? 0,
    };
    form.setFieldsValue(init);

    // عرض صورة حالية في قائمة الرفع (معاينة فقط)
    if (rowData?.image) {
      setFileList([
        {
          uid: "-1",
          name: "cover.jpg",
          status: "done",
          url: rowData.image,
        },
      ]);
    } else {
      setFileList([]);
    }
  }, [open, rowData, form]);

  const handleClose = () => {
    form.resetFields();
    setFileList([]);
    setOpen(false);
  };

  const normalizeUpload = ({ fileList: fl }) => fl;

  const onFinish = async (values) => {
    try {
      setSubmitting(true);

      // اختيار الصورة: رابط جديد أو ملف مرفوع أو الصورة القديمة
      const imageFromUrl = (values.imageUrl || "").trim();
      const imageFromUpload =
        fileList?.[0]?.thumbUrl || fileList?.[0]?.url || "";
      const finalImage = imageFromUrl || imageFromUpload || rowData?.image || "";

      if (!finalImage) {
        message.warning("أضف رابط صورة أو ارفع صورة الغلاف، أو أبقِ الصورة الحالية.");
        setSubmitting(false);
        return;
      }

      const updated = {
        ...rowData, // نحافظ على الحقول/المعرف
        title: values.title?.trim(),
        desc: values.desc?.trim() || "",
        date: values.date ? values.date.format("YYYY-MM-DD") : rowData?.date,
        comments: Number(values.comments ?? rowData?.comments ?? 0),
        views: Number(values.views ?? rowData?.views ?? 0),
        image: finalImage,
        imageFile: fileList?.[0]?.originFileObj, // إن رغبت برفع فعلي لاحقًا
      };

      if (typeof onSubmit === "function") {
        await onSubmit(updated, { mode: "edit" });
      } else {
        message.success("تم حفظ التعديلات ✅");
      }

      // تحديث السجل في الحالة الأم إن رغبت
      if (typeof setRowData === "function") {
        setRowData(updated);
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
                تعديل مقال
              </h2>
            </div>
            <p className="text-sm text-gray-500">
              عدّل بيانات المقال ثم اضغط “حفظ التعديلات”.
            </p>
          </div>

          <Divider className="my-4" />

          <Form form={form} layout="vertical" onFinish={onFinish}>
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
              <Input.TextArea
                placeholder="نبذة قصيرة عن المقال…"
                autoSize={{ minRows: 3, maxRows: 6 }}
              />
            </Form.Item>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Item label="تاريخ النشر" name="date">
                <DatePicker className="w-full" />
              </Form.Item>

              <Form.Item
                label="رابط الصورة (اختياري)"
                name="imageUrl"
                rules={[{ type: "url", message: "الرابط غير صالح" }]}
                extra="إن لم تُدخل رابطًا سيُستخدم المرفوع أو الصورة الحالية."
              >
                <Input placeholder="https://example.com/image.jpg" />
              </Form.Item>
            </div>

            <Form.Item
              label="رفع صورة الغلاف (اختياري)"
              name="imageUpload"
              valuePropName="fileList"
              getValueFromEvent={normalizeUpload}
              extra="لن يتم الرفع فعلياً هنا — يمكنك رفع الملف من خلال onSubmit لاحقًا."
            >
              <Upload.Dragger
                name="file"
                fileList={fileList}
                maxCount={1}
                accept="image/*"
                beforeUpload={() => false}
                onChange={({ fileList }) => setFileList(fileList)}
              >
                <p className="ant-upload-drag-icon">
                  <UploadOutlined />
                </p>
                <p className="ant-upload-text">
                  اسحب وأفلت الصورة هنا أو اضغط للاختيار
                </p>
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
                حفظ التعديلات
              </Button>
            </div>
          </Form>
        </div>
      </Modal>
    </ConfigProvider>
  );
}
