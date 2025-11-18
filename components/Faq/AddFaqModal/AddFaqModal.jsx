"use client";
import React, { useMemo } from "react";
import { ConfigProvider, Modal, Form, Input, Button, Divider, Select, message } from "antd";
import { PlusOutlined, SendOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { handleAddFaq, handleGetAllFaqs } from "@/lib/features/faqSlice";

/**
 * Props:
 * - open (bool)          : حالة الفتح/الإغلاق
 * - setOpen (fn)         : دالة لتغيير حالة المودال
 * - onSubmit (fn)        : تُستدعى عند الإرسال بـ payload = [{ question, answers: [...] }, ...]
 * - palette (obj)        : ألوان الثيم اختياري { primary, text, background }
 */
const CATEGORY_OPTIONS = [
  { value: "general", label: "عام" },
  { value: "courses", label: "دورات" },
  { value: "enroll", label: "التسجيل والدفع" },
  { value: "support", label: "الدعم الفني" },
  { value: "professional_license", label: "الرخص المهنية" },
];


export default function AddFaqModal({ open, setOpen, palette }) {
  const PALETTE = useMemo(
    () => ({
      primary: (palette && palette.primary) || "#0F7490",
      text: (palette && palette.text) || "#202938",
      background: (palette && palette.background) || "#F9FAFC",
    }),
    [palette]
  );

  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { add_faq_loading } = useSelector((state) => state?.faq);

  const handleClose = () => {
    form.resetFields();
    setOpen(false);
  };

  const onFinish = async (values) => {
    const payload = {
      question: values.question?.trim(),
      answer: values.answer?.trim(),
      category: values.category,
    };

    try {
      const res = await dispatch(handleAddFaq({ body: payload })).unwrap();
      if (res?.data?.status === "success") {
        message.success(res?.data?.message || "تم إضافة السؤال بنجاح");
        handleClose();
        dispatch(handleGetAllFaqs());
      } else {
        message.error(res?.data?.message || "حدث خطأ أثناء الإضافة");
      }
    } catch (error) {
      message.error("حدث خطأ أثناء الإضافة");
      console.error("Add FAQ failed:", error);
    }
  };

  return (
    <ConfigProvider
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
        className="!w-full max-w-6xl"
      >
        <div className="bg-white" dir="rtl">
          {/* Header */}
          <div className="mb-4">
            <div className="flex items-center gap-3 mb-2">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center shadow-sm"
                style={{ background: PALETTE.primary }}
              >
                <PlusOutlined className="text-white text-lg" />
              </div>
              <h2 className="text-2xl font-bold" style={{ color: PALETTE.text }}>
                إضافة سؤال جديد
              </h2>
            </div>
            <p className="text-sm text-gray-500">
              أضف أسئلة متعددة، ولكل سؤال يمكن إضافة أكثر من إجابة.
            </p>
          </div>

          <Divider className="my-4" />

          <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item
              label="التصنيف"
              name="category"
              rules={[{ required: true, message: "يرجى اختيار التصنيف" }]}
            >
              <Select
                placeholder="اختر التصنيف"
                options={CATEGORY_OPTIONS}
                showSearch
                optionFilterProp="label"
              />
            </Form.Item>

            <Form.Item
              label="السؤال"
              name="question"
              rules={[{ required: true, message: "يرجى إدخال نص السؤال" }]}
            >
              <Input placeholder="اكتب نص السؤال هنا…" />
            </Form.Item>

            <Form.Item
              label="الإجابة"
              name="answer"
              rules={[{ required: true, message: "يرجى إدخال الإجابة" }]}
            >
              <Input.TextArea placeholder="اكتب الإجابة هنا…" autoSize={{ minRows: 3, maxRows: 6 }} />
            </Form.Item>

            <Divider className="my-5" />

            <div className="flex items-center justify-end gap-3">
              <Button onClick={handleClose}>إلغاء</Button>
              <Button
                type="primary"
                icon={<SendOutlined />}
                loading={add_faq_loading}
                onClick={() => form.submit()}
              >
                حفظ السؤال
              </Button>
            </div>
          </Form>

          <Divider className="my-5" />

          {/* Footer actions */}
          <div className="flex items-center justify-end gap-3">
            <Button onClick={handleClose}>إلغاء</Button>
            <Button
              type="primary"
              icon={<SendOutlined />}
              loading={add_faq_loading}
              onClick={onFinish}
            >
              إرسال التقييم
            </Button>
          </div>
        </div>
      </Modal>
    </ConfigProvider>
  );
}
