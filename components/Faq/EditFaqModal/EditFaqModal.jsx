 "use client";
import React, { useEffect, useMemo } from "react";
import { ConfigProvider, Modal, Form, Input, Button, Divider, Select, message } from "antd";
import { SendOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { handleEditFaq, handleGetAllFaqs } from "@/lib/features/faqSlice";

const CATEGORY_OPTIONS = [
  { value: "general", label: "عام" },
  { value: "courses", label: "دورات" },
  { value: "enroll", label: "التسجيل والدفع" },
  { value: "support", label: "الدعم الفني" },
  { value: "professional_license", label: "الرخص المهنية" },
];

export default function EditFaqModal({ open, rowData, setOpen, palette }) {
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
  const { edit_faq_loading } = useSelector((state) => state?.faq);

  useEffect(() => {
    if (open && rowData) {
      form.setFieldsValue({
        question: rowData?.text || "",
        answer: rowData?.answers?.[0]?.comment || "",
        category: rowData?.category || undefined,
      });
    }
  }, [open, rowData, form]);

  const handleClose = () => {
    form.resetFields();
    setOpen(false);
  };

  const onFinish = async (values) => {
    const payload = {
      id: rowData?.id,
      question: values.question?.trim(),
      answer: values.answer?.trim(),
      category: values.category,
    };

    try {
      const res = await dispatch(handleEditFaq({ body: payload })).unwrap();
      if (res?.data?.status === "success") {
        message.success(res?.data?.message || "تم تحديث السؤال بنجاح");
        dispatch(handleGetAllFaqs());
        handleClose();
      } else {
        message.error(res?.data?.message || "حدث خطأ أثناء التحديث");
      }
    } catch (error) {
      message.error("حدث خطأ أثناء التحديث");
      console.error("Edit FAQ failed:", error);
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
      <Modal open={open} onCancel={handleClose} title={null} footer={null} destroyOnHidden className="!w-full max-w-4xl">
        <div className="bg-white" dir="rtl">
          <div className="mb-4">
            <h2 className="text-2xl font-bold" style={{ color: PALETTE.text }}>
              تعديل السؤال
            </h2>
            <p className="text-sm text-gray-500">قم بتحديث بيانات السؤال والإجابة والتصنيف.</p>
          </div>

          <Divider className="my-4" />

          <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item label="التصنيف" name="category" rules={[{ required: true, message: "يرجى اختيار التصنيف" }]}>
              <Select placeholder="اختر التصنيف" options={CATEGORY_OPTIONS} showSearch optionFilterProp="label" />
            </Form.Item>

            <Form.Item label="السؤال" name="question" rules={[{ required: true, message: "يرجى إدخال نص السؤال" }]}>
              <Input placeholder="اكتب نص السؤال هنا…" />
            </Form.Item>

            <Form.Item label="الإجابة" name="answer" rules={[{ required: true, message: "يرجى إدخال الإجابة" }]}>
              <Input.TextArea placeholder="اكتب الإجابة هنا…" autoSize={{ minRows: 3, maxRows: 6 }} />
            </Form.Item>

            <Divider className="my-5" />

            <div className="flex items-center justify-end gap-3">
              <Button onClick={handleClose}>إلغاء</Button>
              <Button type="primary" icon={<SendOutlined />} loading={edit_faq_loading} onClick={() => form.submit()}>
                حفظ التعديلات
              </Button>
            </div>
          </Form>
        </div>
      </Modal>
    </ConfigProvider>
  );
}
