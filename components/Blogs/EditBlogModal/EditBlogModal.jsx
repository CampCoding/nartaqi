"use client";
import React, { useEffect, useMemo, useState } from "react";
import {
  ConfigProvider,
  Modal,
  Form,
  Input,
  Upload,
  Button,
  Divider,
  message,
  Select,
} from "antd";
import { PlusOutlined, UploadOutlined, SendOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { handleEditBlog } from "../../../lib/features/blogSlice";

export default function EditBlogModal({
  open,
  rowData,
  setRowData,
  setOpen,
  onSubmit,
  palette,
  blogsData,
}) {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [allBlogsOptions, setALlBlogsOptions] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    setALlBlogsOptions(
      blogsData?.data?.message?.map((item) => ({
        label: item?.title,
        value: item?.id,
      })) || []
    );
  }, [blogsData]);

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

    // حول "18,19" → [18,19]
    let relatedArray = [];
    if (typeof rowData?.related_blogs_ids === "string") {
      relatedArray = rowData.related_blogs_ids
        .split(",")
        .map((id) => id.trim())
        .filter(Boolean)
        .map((id) => Number(id));
    } else if (Array.isArray(rowData?.related_blogs_ids)) {
      relatedArray = rowData.related_blogs_ids;
    }

    const init = {
      title: rowData?.title ?? "",
      desc: rowData?.content ?? "",
      related_blogs: relatedArray,
      imageUrl: "",
    };

    form.setFieldsValue(init);

    // إعداد رابط الصورة الكامل
    const STORAGE_BASE_URL =
      process.env.NEXT_PUBLIC_STORAGE_URL ||
      "https://camp-coding.site/nartaqi/public/storage/";

    if (rowData?.image_url || rowData?.image) {
      let fullUrl = rowData.image_url;

      if (!fullUrl && rowData.image) {
        // لو image مجرد "blogs/xxx.gif" نخليها full URL
        if (rowData.image.startsWith("http")) {
          fullUrl = rowData.image;
        } else {
          const base = STORAGE_BASE_URL.replace(/\/$/, "");
          const path = rowData.image.replace(/^\/?storage\//, "");
          fullUrl = `${base}/${path}`;
        }
      }

      setFileList([
        {
          uid: "-1",
          name: rowData.title || "cover",
          status: "done",
          url: fullUrl,
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

      const imageFromUrl = (values.imageUrl || "").trim();
      const existingImage = rowData?.image || "";
      const imageFile = fileList?.[0]?.originFileObj || null;

      // لو مفيش published_at في الفورم، نستخدم created_at أو نخليها فاضية
      const publishedAt = rowData?.published_at || rowData?.created_at || "";

      const relatedSelected = Array.isArray(values.related_blogs)
        ? values.related_blogs
        : [];

      const updated = {
        ...rowData,
        id: rowData?.id,
        title: values.title?.trim(),
        content: values.desc?.trim() || "",
        published_at: publishedAt,
        image: imageFromUrl || existingImage,
        related_blogs_ids: relatedSelected,
      };

      if (!imageFile && !imageFromUrl && !existingImage) {
        message.warning(
          "أضف رابط صورة أو ارفع صورة الغلاف، أو أبقِ الصورة الحالية."
        );
        return;
      }

      // ✅ FormData بنفس ستايل AddBlogModal
      const formData = new FormData();

      if (rowData?.id != null) {
        formData.append("id", String(rowData.id));
      }

      formData.append("title", updated.title || "");
      formData.append("content", updated.content || "");
      formData.append("published_at", updated.published_at || "");

      if (relatedSelected.length > 0) {
        formData.append("related_blogs_ids", relatedSelected.join(","));
      }

      // الصورة: ملف جديد أو رابط جديد فقط
      if (imageFile) {
        formData.append("image", imageFile);
      } else if (imageFromUrl) {
        formData.append("image", imageFromUrl);
      }

      const res = await dispatch(handleEditBlog({ body: formData })).unwrap();
      console.log(res);

      // حدّث السطر لو حابب في الجدول
      if (typeof setRowData === "function") {
        setRowData({
          ...updated,
          related_blogs_ids: relatedSelected.join(","),
        });
      }

      handleClose();
    } catch (err) {
      console.error(err);
      message.error("حدث خطأ أثناء حفظ التعديلات");
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
              <Form.Item
                label="المقالات ذات الصلة"
                name="related_blogs"
                rules={[
                  {
                    required: true,
                    message: "الرجاء اختيار مقالة واحدة على الأقل",
                  },
                ]}
              >
                <Select
                  options={allBlogsOptions}
                  mode="multiple"
                  placeholder="اختر مقالة أو أكثر"
                  allowClear
                />
              </Form.Item>
            </div>

            <Form.Item
              label="رفع صورة الغلاف (اختياري)"
              name="imageUpload"
              valuePropName="fileList"
              getValueFromEvent={normalizeUpload}
              extra="لن يتم الرفع تلقائيًا؛ سنرسل الملف ضمن FormData عند الحفظ."
            >
              <Upload.Dragger
                name="file"
                fileList={fileList}
                listType="picture-card" // 👈 عشان يظهر الـ thumbnail
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
