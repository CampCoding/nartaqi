"use client";

import React, { useMemo, useState } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  InputNumber,
  Upload,
  Button,
  ConfigProvider,
  message,
  Switch,
} from "antd";
import {
  InboxOutlined,
  PlusOutlined,
  BookOutlined,
  SettingOutlined,
} from "@ant-design/icons";

const { TextArea } = Input;
const { Dragger } = Upload;

// لوحة الألوان (مستخدمة في ConfigProvider)
const PALETTE = {
  primary: "#0F7490",
  secondary: "#C9AE6C",
  accent: "#8B5CF6",
  background: "#F9FAFC",
  text: "#202938",
};

const UNIT_COLORS = [
  { name: "Primary", value: "#0F7490" },
  { name: "Secondary", value: "#C9AE6C" },
  { name: "Accent", value: "#8B5CF6" },
  { name: "Green", value: "#10B981" },
  { name: "Indigo", value: "#6366F1" },
  { name: "Orange", value: "#F59E0B" },
  { name: "Red", value: "#EF4444" },
  { name: "Pink", value: "#EC4899" },
];

// تحويل Dayjs إلى ISO بأمان
const toISO = (d) =>
  d
    ? typeof d.toDate === "function"
      ? d.toDate().toISOString()
      : d.toISOString?.()
    : null;

function AddUnitForm({ open, onCancel, onSubmit, subjects }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [color, setColor] = useState(UNIT_COLORS[0].value);
  const [coverPreview, setCoverPreview] = useState(null);

  const subjectOptions = useMemo(
    () =>
      (subjects || []).map((s) => ({
        label: s.code ? `${s.name} (${s.code})` : s.name,
        value: String(s.id),
      })),
    [subjects]
  );

  const handleFinish = async (values) => {
    const payload = {
      ...values,
      color,
      startDate: toISO(values.startDate),
      cover: coverPreview, // استبدلها برابط من السيرفر في حال رفع الصورة فعليًا
    };

    try {
      setLoading(true);
      if (typeof onSubmit === "function") {
        await onSubmit(payload);
      } else {
        // Demo
        await new Promise((r) => setTimeout(r, 800));
        console.log("Unit payload:", payload);
      }
      message.success("تم إنشاء الوحدة بنجاح");
      form.resetFields();
      setColor(UNIT_COLORS[0].value);
      setCoverPreview(null);
      onCancel && onCancel();
    } catch (e) {
      message.error("فشل إنشاء الوحدة. حاول مرة أخرى.");
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
          setColor(UNIT_COLORS[0].value);
          setCoverPreview(null);
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
              <h2 className="text-3xl font-bold text-text">
                إضافة وحدة جديدة
              </h2>
            </div>
            <p className="text-gray-600">إنشاء وتكوين وحدة ضمن مادة.</p>
          </div>

          <div>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleFinish}
              initialValues={{
                unitName: "",
                unitCode: "",
                subjectId: undefined,
                description: "",
                order: 1,
                topicsCount: 0,
                status: "active",
                startDate: null,
                isPublished: true,
                durationWeeks: 4,
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
                    label={<span className="text-text font-medium">اسم الوحدة *</span>}
                    name="unitName"
                    rules={[
                      { required: true, message: "يرجى إدخال اسم الوحدة" },
                      {
                        validator: (_, v) =>
                          !v || v.trim().length >= 2
                            ? Promise.resolve()
                            : Promise.reject(
                                new Error("يجب ألا يقل الاسم عن حرفين")
                              ),
                      },
                    ]}
                  >
                    <Input
                      placeholder="مثال: أساسيات الجبر"
                      className="rounded-lg px-4 py-3 border hover:border-primary focus:border-primary"
                    />
                  </Form.Item>

                  <Form.Item
                    label={<span className="text-text font-medium">الوصف *</span>}
                    name="description"
                    rules={[
                      { required: true, message: "يرجى إدخال الوصف" },
                      {
                        validator: (_, v) =>
                          !v || v.trim().length >= 10
                            ? Promise.resolve()
                            : Promise.reject(
                                new Error("يجب ألا يقل الوصف عن 10 أحرف")
                              ),
                      },
                    ]}
                  >
                    <TextArea
                      rows={4}
                      placeholder="ما الذي تتناوله هذه الوحدة..."
                      className="rounded-lg px-4 py-3 border hover:border-primary focus:border-primary resize-none"
                    />
                  </Form.Item>

                  <div className="mb-3">
                    <label className="text-text font-medium block mb-2">
                      الحالة *
                    </label>
                    <Form.Item name="status" rules={[{ required: true }]} className="!mb-0">
                      <Select
                        className="rounded-lg"
                        options={[
                          { label: "🟢 نشطة", value: "active" },
                          { label: "⚪ غير نشطة", value: "inactive" },
                          { label: "🟡 مسودة", value: "draft" },
                        ]}
                      />
                    </Form.Item>
                  </div>
                </div>
              </div>

              {/* الأزرار (بعرض كامل) */}
              <div className="lg:col-span-2 border-t border-gray-200 pt-6">
                <div className="flex justify-end gap-4">
                  <Button
                    type="default"
                    onClick={() => {
                      form.resetFields();
                      setColor(UNIT_COLORS[0].value);
                      setCoverPreview(null);
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
                    {loading ? "جارٍ الإضافة..." : "إضافة الوحدة"}
                  </Button>
                </div>
              </div>
            </Form>
          </div>
        </div>
      </Modal>
    </ConfigProvider>
  );
}

export default AddUnitForm;
