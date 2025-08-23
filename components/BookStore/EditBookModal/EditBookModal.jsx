"use client";
import React, { useEffect, useMemo, useState } from "react";
import {
  ConfigProvider,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Upload,
  Switch,
  DatePicker,
  Button,
  Divider,
  message,
} from "antd";
import { PlusOutlined, UploadOutlined, SendOutlined } from "@ant-design/icons";

const DEFAULT_CATEGORIES = [
  { label: "كتب", value: "كتب" },
  { label: "حقائب", value: "حقائب" },
];

const LEVEL_OPTIONS = [
  { label: "مبتدئ", value: "مبتدئ" },
  { label: "متوسط", value: "متوسط" },
  { label: "متقدم", value: "متقدم" },
];

const LANGUAGE_OPTIONS = [
  { label: "العربية", value: "العربية" },
  { label: "الإنجليزية", value: "الإنجليزية" },
];

const BADGE_OPTIONS = ["الأكثر مبيعًا", "خصم", "جديد", "محدود"];

export default function EditBookModal({ open, setOpen,rowData , setRowData, onSubmit, palette }) {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [fileList, setFileList] = useState([]);

  // categories state (dynamic)
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [addNewCategModal, setAddNewCategModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  // Load saved categories once
  useEffect(() => {
    try {
      const raw = localStorage.getItem("bookstore.categories");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length) {
          setCategories(parsed);
        }
      }
    } catch {}
  }, []);

  // Persist categories on change
  useEffect(() => {
    try {
      localStorage.setItem("bookstore.categories", JSON.stringify(categories));
    } catch {}
  }, [categories]);

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

      const payload = {
        id: `p-${Date.now()}`,
        title: values.title?.trim(),
        subtitle: values.subtitle?.trim() || "",
        slug:
          values.slug?.trim() ||
          String(values.title || "").trim().replace(/\s+/g, "-").toLowerCase(),
        category: values.category,
        subcategory: values.subcategory?.trim() || "",
        price: Number(values.price),
        oldPrice: values.oldPrice ? Number(values.oldPrice) : undefined,
        currency: values.currency || "ر.س",
        inStock: values.inStock ?? true,
        rating: values.rating ?? 0,
        reviewsCount: values.reviewsCount ?? 0,
        badges: values.badges || [],
        language: values.language || "العربية",
        level: values.level || "مبتدئ",
        pages: values.pages ? Number(values.pages) : undefined,
        publisher: values.publisher?.trim() || "",
        author: values.author?.trim() || "",
        createdAt: values.createdAt
          ? values.createdAt.format("YYYY-MM-DD")
          : undefined,
        tags: values.tags || [],
        image: fileList?.[0]?.thumbUrl || "",
        imageFile: fileList?.[0]?.originFileObj,
      };

      if (typeof onSubmit === "function") {
        await onSubmit(payload);
      } else {
        message.success("تم إضافة الكتاب بنجاح ✅");
      }

      handleClose();
    } finally {
      setSubmitting(false);
    }
  };

  // Add new category flow
  const saveNewCategory = () => {
    const name = newCategoryName.trim();
    if (!name) {
      message.warning("اكتب اسم الفئة.");
      return;
    }
    if (categories.some((c) => c.value === name)) {
      message.info("هذه الفئة موجودة بالفعل.");
      return;
    }
    const next = [...categories, { label: name, value: name }];
    setCategories(next);
    // select it in the form immediately
    form.setFieldsValue({ category: name });
    setAddNewCategModal(false);
    setNewCategoryName("");
    message.success("تمت إضافة الفئة.");
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
        destroyOnClose
        className="!w-full max-w-6xl"
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
                تعديل كتاب جديد
              </h2>
            </div>
            <p className="text-sm text-gray-500">
              املأ تفاصيل الكتاب ثم اضغط تعديل.
            </p>
          </div>

          <Divider className="my-4" />

          {/* Add Category button */}
          {/* <Button
            onClick={() => setAddNewCategModal(true)}
            type="primary"
            className="bg-primary text-white mb-3"
          >
            إضافة فئة
          </Button> */}

          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{
              category:rowData?.category || "كتب",
              currency: "ر.س",
              inStock: true,
              level: "مبتدئ",
              language: "العربية",
              title: rowData?.title,
              subtitle : rowData?.subtitle,
              price:rowData?.price,
              oldPrice: rowData?.oldPrice
            }}
          >
            {/* Basic info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Item
                label="عنوان الكتاب"
                name="title"
                rules={[{ required: true, message: "الرجاء إدخال العنوان" }]}
              >
                <Input placeholder="مثال: مصنف الكتابة العربية" />
              </Form.Item>

              <Form.Item label="العنوان الفرعي" name="subtitle">
                <Input placeholder="وصف مختصر للكتاب" />
              </Form.Item>

              <Form.Item
                label="الفئة"
                name="category"
                rules={[{ required: true, message: "اختر الفئة" }]}
              >
                <Select
                  options={categories}
                  placeholder="اختر الفئة"
                  allowClear
                  dropdownRender={(menu) => (
                    <div>
                      {menu}
                      {/* quick add from dropdown as well */}
                      <div className="p-2 border-t">
                        <Input
                          size="small"
                          placeholder="أضف فئة جديدة"
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                          onPressEnter={saveNewCategory}
                        />
                        <Button
                          size="small"
                          className="mt-2"
                          type="link"
                          onClick={saveNewCategory}
                        >
                          حفظ الفئة
                        </Button>
                      </div>
                    </div>
                  )}
                />
              </Form.Item>

              <Form.Item
                label="السعر"
                name="price"
                rules={[{ required: true, message: "ادخل السعر" }]}
              >
                <InputNumber className="w-full" min={0} step={0.5} placeholder="0.00" />
              </Form.Item>

              <Form.Item label="السعر قبل الخصم" name="oldPrice">
                <InputNumber className="w-full" min={0} step={0.5} />
              </Form.Item>

              <Form.Item label="متوفر في المخزون" name="inStock" valuePropName="checked">
                <Switch />
              </Form.Item>
            </div>

            {/* Image */}
            <Form.Item
              label="صورة الغلاف"
              name="image"
              valuePropName="fileList"
              getValueFromEvent={normalizeUpload}
              extra="لن يتم الرفع فعلياً هنا — أرسل الملف في onSubmit."
              rules={[{ required: true, message: "أضف صورة الغلاف" }]}
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

            <Divider />

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
                تعديل
              </Button>
            </div>
          </Form>
        </div>
      </Modal>

      {/* Add Category Modal */}
      <Modal
        open={addNewCategModal}
        onCancel={() => setAddNewCategModal(false)}
        title="إضافة فئة جديدة"
        okText="حفظ"
        cancelText="إلغاء"
        onOk={saveNewCategory}
        destroyOnClose
      >
        <Form layout="vertical">
          <Form.Item label="اسم الفئة">
            <Input
              placeholder="اكتب اسم الفئة"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              onPressEnter={saveNewCategory}
            />
          </Form.Item>
        </Form>
      </Modal>
    </ConfigProvider>
  );
}
