"use client";
import React, { useMemo, useState } from "react";
import {
  ConfigProvider,
  Modal,
  Form,
  Input,
  Button,
  Space,
  Divider,
  Tag,
  Tooltip,
  message,
} from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  MinusCircleOutlined,
  QuestionCircleOutlined,
  SendOutlined,
} from "@ant-design/icons";

/**
 * Props:
 * - open (bool)          : حالة الفتح/الإغلاق
 * - setOpen (fn)         : دالة لتغيير حالة المودال
 * - onSubmit (fn)        : تُستدعى عند الإرسال بـ payload = [{ question, answers: [...] }, ...]
 * - palette (obj)        : ألوان الثيم اختياري { primary, text, background }
 */
export default function AddRatingModal({ open, setOpen, onSubmit, palette  , activeTab}) {
  const PALETTE = useMemo(
    () => ({
      primary: (palette && palette.primary) || "#0F7490",
      text: (palette && palette.text) || "#202938",
      background: (palette && palette.background) || "#F9FAFC",
    }),
    [palette]
  );

  // نموذج البيانات: [{question: "", answers: [""]}]
  const [qa, setQa] = useState([{ question: "", answers: [""] }]);
  const [submitting, setSubmitting] = useState(false);

  const addQuestion = () => setQa((prev) => [...prev, { question: "", answers: [""] }]);

  const removeQuestion = (qIdx) =>
    setQa((prev) => (prev.length === 1 ? prev : prev.filter((_, i) => i !== qIdx)));

  const updateQuestionText = (qIdx, text) =>
    setQa((prev) => {
      const copy = [...prev];
      copy[qIdx] = { ...copy[qIdx], question: text };
      return copy;
    });

  const addAnswer = (qIdx) =>
    setQa((prev) => {
      const copy = [...prev];
      const arr = [...copy[qIdx].answers, ""];
      copy[qIdx] = { ...copy[qIdx], answers: arr };
      return copy;
    });

  const removeAnswer = (qIdx, aIdx) =>
    setQa((prev) => {
      const copy = [...prev];
      const arr = [...copy[qIdx].answers];
      if (arr.length === 1) return prev; // لا نحذف آخر حقل
      arr.splice(aIdx, 1);
      copy[qIdx] = { ...copy[qIdx], answers: arr };
      return copy;
    });

  const updateAnswerText = (qIdx, aIdx, text) =>
    setQa((prev) => {
      const copy = [...prev];
      const arr = [...copy[qIdx].answers];
      arr[aIdx] = text;
      copy[qIdx] = { ...copy[qIdx], answers: arr };
      return copy;
    });

  const countFilledAnswers = (answers) =>
    (answers || []).filter((v) => v && v.trim().length > 0).length;

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async () => {
    // تحقّق بسيط
    const cleaned = qa
      .map((item) => ({
        question: (item.question || "").trim(),
        answers: (item.answers || []).map((a) => (a || "").trim()).filter(Boolean),
      }))
      .filter((item) => item.question.length > 0);

    if (!cleaned.length) {
      message.warning("أضف سؤالاً واحدًا على الأقل.");
      return;
    }
    if (cleaned.some((q) => q.answers.length === 0)) {
      message.warning("لكل سؤال يجب أن تُدخل إجابة واحدة على الأقل.");
      return;
    }

    try {
      setSubmitting(true);
      if (typeof onSubmit === "function") {
        await onSubmit(cleaned);
      } else {
        // للعرض فقط إن لم تُمرّر onSubmit
        // يمكنك ربطها بـ API بسهولة
        // console.log(cleaned);
        message.success("تم إرسال التقييم بنجاح ✅");
      }
      setOpen(false);
      // إعادة التهيئة
      setQa([{ question: "", answers: [""] }]);
    } finally {
      setSubmitting(false);
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
        destroyOnClose
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
                إضافة تقييم جديد
              </h2>
            </div>
            <p className="text-sm text-gray-500">
              أضف أسئلة متعددة، ولكل سؤال يمكن إضافة أكثر من إجابة.
            </p>
          </div>

          <Divider className="my-4" />

          {/* Questions Builder */}
          <div className="space-y-6">
            {qa.map((item, qIdx) => {
              const filled = countFilledAnswers(item.answers);
              return (
                <div
                  key={qIdx}
                  className="rounded-xl border border-gray-200 p-4 bg-gray-50"
                >
                  {/* Question header */}
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <Tag color="blue">سؤال #{qIdx + 1}</Tag>
                      <Tooltip title="نص السؤال الذي سيظهر للمستخدم">
                        <QuestionCircleOutlined className="text-gray-400" />
                      </Tooltip>
                    </div>
                    <div className="flex items-center gap-2">
                      <Tag color={filled > 0 ? "green" : "default"}>
                        إجابات: {filled} / {item.answers.length}
                      </Tag>
                      {qa.length > 1 && (
                        <Button
                          danger
                          type="text"
                          icon={<DeleteOutlined />}
                          onClick={() => removeQuestion(qIdx)}
                        >
                          حذف السؤال
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Question input */}
                  <Form layout="vertical">
                    <Form.Item label="نص السؤال">
                      <Input
                        placeholder="اكتب نص السؤال هنا…"
                        value={item.question}
                        onChange={(e) => updateQuestionText(qIdx, e.target.value)}
                      />
                    </Form.Item>

                    <Divider className="my-2">الإجــابــات</Divider>

                    {/* Answers list */}
                    <Space direction="vertical" className="w-full">
                      {item.answers.map((ans, aIdx) => (
                        <div key={aIdx} className="flex items-start gap-2">
                          <Input.TextArea
                            placeholder={`الإجابة ${aIdx + 1}…`}
                            value={ans}
                            autoSize={{ minRows: 2, maxRows: 5 }}
                            onChange={(e) =>
                              updateAnswerText(qIdx, aIdx, e.target.value)
                            }
                          />
                          {item.answers.length > 1 && (
                            <Button
                              danger
                              type="text"
                              icon={<MinusCircleOutlined />}
                              onClick={() => removeAnswer(qIdx, aIdx)}
                              title="حذف هذه الإجابة"
                            />
                          )}
                        </div>
                      ))}
                    </Space>

                    {/* Add answer */}
                    <div className="mt-3">
                      <Button
                        icon={<PlusOutlined />}
                        onClick={() => addAnswer(qIdx)}
                      >
                        إضافة إجابة أخرى
                      </Button>
                    </div>
                  </Form>
                </div>
              );
            })}
          </div>

          {/* Add question */}
          <div className="mt-5">
            <Button
              type="dashed"
              block
              icon={<PlusOutlined />}
              onClick={addQuestion}
            >
              إضافة سؤال جديد
            </Button>
          </div>

          <Divider className="my-5" />

          {/* Footer actions */}
          <div className="flex items-center justify-end gap-3">
            <Button onClick={handleClose}>إلغاء</Button>
            <Button
              type="primary"
              icon={<SendOutlined />}
              loading={submitting}
              onClick={handleSubmit}
            >
              إرسال التقييم
            </Button>
          </div>
        </div>
      </Modal>
    </ConfigProvider>
  );
}
