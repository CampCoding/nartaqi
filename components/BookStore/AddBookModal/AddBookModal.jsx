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
import { useDispatch , useSelector } from "react-redux";
// تم إزالة استيراد useDispatch و useSelector لتجنب خطأ "Could not resolve 'react-redux'"
// واستبدالها بحالة وهمية لتجنب التعطل.
// import { useDispatch, useSelector } from "react-redux"; 

// 1. UPDATED DEFAULT CATEGORIES: Books, Bags, Accessories
const DEFAULT_CATEGORIES = [
  { label: "كتب", value: "كتب" },
  { label: "حقائب", value: "حقائب" },
  { label: "إكسسوارات", value: "إكسسوارات" },
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

export default function AddBookModal({ open, setOpen, onSubmit, palette }) {
  // تم إزالة استخدام useDispatch و useSelector، واستبدال حالة التحميل بقيمة ثابتة أو حالة محلية بسيطة
  const dispatch = useDispatch();
  const {add_store_loading} = useSelector(state => state?.store || {});
  
  const [form] = Form.useForm();
  // تم تغيير اسم حالة التحميل لتكون أكثر دلالة على الإرسال
  const [submitting, setSubmitting] = useState(false); 
  const [fileList, setFileList] = useState([]);

  // categories state (dynamic)
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [addNewCategModal, setAddNewCategModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  // Load saved categories once (using localStorage is kept as per original logic)
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

  // Persist categories on change (using localStorage is kept as per original logic)
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
    const formData = new FormData();
    formData.append("title" , values?.title?.trim())
    setSubmitting(true); // Start loading state
  
    try {
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
        // Data for preview (if used)
        image: fileList?.[0]?.thumbUrl || "",
        // The actual file object for backend submission
        imageFile: fileList?.[0]?.originFileObj,
      };

      if (typeof onSubmit === "function") {
        await onSubmit(payload);
        message.success("تم إرسال بيانات الكتاب بنجاح ✅");
      } else {
        console.log("Book Data Payload (ready for API):", payload);
        message.success("تم تجهيز بيانات الكتاب بنجاح (يرجى مراجعة الـ console) ✅");
      }

      handleClose();
    } catch (error) {
        console.error("Submission failed:", error);
        message.error("فشل في معالجة بيانات الكتاب.");
    } finally {
      setSubmitting(false); // End loading state
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
                إضافة كتاب جديد
              </h2>
            </div>
            <p className="text-sm text-gray-500">
              املأ تفاصيل الكتاب ثم اضغط “إضافة”.
            </p>
          </div>

          <Divider className="my-4" />

          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{
              // Use the first category dynamically
              category: categories[0]?.value || "كتب",
              currency: "ر.س",
              inStock: true,
              level: "مبتدئ",
              language: "العربية",
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
                  popupRender={(menu) => (
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
                label="سعر المنتج"
                name="price"
                rules={[{ required: true, message: "ادخل السعر" }]}
              >
                <InputNumber className="w-full" min={0} step={0.5} placeholder="0.00" />
              </Form.Item>

              <Form.Item label="السعر بعد الخصم" name="oldPrice">
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
              extra="لن يتم الرفع فعلياً هنا — سيتم إرسال الملف في دالة الإرسال (onSubmit)."
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
                إضافة
              </Button>
            </div>
          </Form>
        </div>
      </Modal>

      {/* Add Category Modal (used within Select now, but kept in case needed standalone) */}
      <Modal
        open={addNewCategModal}
        onCancel={() => setAddNewCategModal(false)}
        title="إضافة فئة جديدة"
        okText="حفظ"
        cancelText="إلغاء"
        onOk={saveNewCategory}
        destroyOnHidden
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