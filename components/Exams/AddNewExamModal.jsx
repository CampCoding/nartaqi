"use client";
import React, { useMemo } from "react";
import {
  PlusOutlined,
  DeleteOutlined,
  MinusCircleOutlined,
  QuestionCircleOutlined,
  SendOutlined,
} from "@ant-design/icons";
import {
  ConfigProvider,
  Modal,
  Divider,
  Form,
  Input,
  Button,
  Space,
  Checkbox,
  Tooltip,
  Card,
  message,
} from "antd";

function AddNewExamModal({ open, setOpen, palette, onSubmit }) {
  const [form] = Form.useForm();

  const PALETTE = useMemo(
    () => ({
      primary: (palette && palette.primary) || "#0F7490",
      text: (palette && palette.text) || "#202938",
      background: (palette && palette.background) || "#F9FAFC",
    }),
    [palette]
  );

  const handleCancel = () => setOpen(false);

  const handleFinish = async (values) => {
    const payload = {
      title: (values.title || "").trim(),
      description: (values.description || "").trim(),
      time: (values.time || "").toString().trim(),
      questions: (values.questions || []).map((q) => ({
        title: (q.title || "").trim(),
        explanation: (q.explanation || "").trim(), // ⬅️ شرح السؤال
        answers: (q.answers || [])
          .filter((a) => ((a && a.text) || "").trim().length > 0)
          .map((a) => ({
            text: a.text.trim(),
            isCorrect: !!a.isCorrect,
            explanation: (a.explanation || "").trim(), // ⬅️ شرح الإجابة
          })),
      })),
    };

    const badIdx = payload.questions.findIndex((q) => q.answers.length < 2);
    if (badIdx !== -1) {
      message.error(`السؤال رقم ${badIdx + 1} يجب أن يحتوي على إجابتين على الأقل.`);
      return;
    }

    const noCorrectIdx = payload.questions.findIndex(
      (q) => !q.answers.some((a) => a.isCorrect)
    );
    if (noCorrectIdx !== -1) {
      message.warning(`السؤال رقم ${noCorrectIdx + 1} لا يحتوي على إجابة صحيحة.`);
    }

    try {
      if (onSubmit) {
        await onSubmit(payload);
      } else {
        // eslint-disable-next-line no-console
        console.log("Exam payload:", payload);
      }
      message.success("تم إنشاء الامتحان بنجاح");
      setOpen(false);
      form.resetFields();
    } catch (e) {
      message.error((e && e.message) || "حدث خطأ أثناء حفظ الامتحان");
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
        onCancel={handleCancel}
        title={null}
        footer={null}
        destroyOnClose
        className="!w-full max-w-6xl"
      >
        <div className="bg-white" dir="rtl">
          <div className="mb-4">
            <div className="flex items-center gap-3 mb-2">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center shadow-sm"
                style={{ background: PALETTE.primary }}
              >
                <PlusOutlined className="text-white text-lg" />
              </div>
              <h2 className="text-2xl font-bold" style={{ color: PALETTE.text }}>
                إنشاء امتحان جديد
              </h2>
            </div>
            <p className="text-sm text-gray-500">
              أضف عنوانًا ووصفًا للامتحان، ثم أضف أسئلة متعددة ولكل سؤال عدة إجابات.
            </p>
          </div>

          <Divider className="my-4" />

          <Form
            form={form}
            layout="vertical"
            initialValues={{
              title: "",
              description: "",
              time: "",
              questions: [
                {
                  title: "",
                  explanation: "", // ⬅️ افتراضي
                  answers: [{ text: "", explanation: "" }, { text: "", explanation: "" }],
                },
              ],
            }}
            onFinish={handleFinish}
          >
            {/* عنوان ووصف الامتحان */}
            <Card bordered className="mb-6">
              <Form.Item
                label="عنوان الامتحان"
                name="title"
                rules={[
                  { required: true, message: "من فضلك أدخل عنوان الامتحان" },
                  { min: 3, message: "العنوان يجب ألا يقل عن 3 حروف" },
                ]}
              >
                <Input placeholder="مثال: امتحان الوحدة الأولى" />
              </Form.Item>

              <Form.Item label="وصف الامتحان (اختياري)" name="description">
                <Input.TextArea
                  rows={3}
                  placeholder="وصف مختصر للامتحان، التعليمات، الزمن، الدرجة..."
                />
              </Form.Item>

              <Form.Item
                label="مدة الامتحان"
                name="time"
                rules={[{ required: true, message: "من فضلك أدخل مده الامتحان بالدقيقة" }]}
              >
                <Input placeholder="مثال: 30 دقيقة" />
              </Form.Item>
            </Card>

            {/* قائمة الأسئلة */}
            <Form.List name="questions">
              {(fields, { add, remove, move }) => (
                <>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold" style={{ color: PALETTE.text }}>
                      الأسئلة
                    </h3>
                  </div>

                  <Space direction="vertical" className="w-full">
                    {fields.map(({ key, name, ...restField }, idx) => (
                      <Card
                        key={key}
                        title={
                          <div className="flex items-center gap-2">
                            <QuestionCircleOutlined />
                            <span>سؤال رقم {idx + 1}</span>
                          </div>
                        }
                        extra={
                          <div className="flex items-center gap-1">
                            <Tooltip title="تحريك لأعلى">
                              <Button size="small" onClick={() => idx > 0 && move(idx, idx - 1)}>
                                ↑
                              </Button>
                            </Tooltip>
                            <Tooltip title="تحريك لأسفل">
                              <Button
                                size="small"
                                onClick={() => idx < fields.length - 1 && move(idx, idx + 1)}
                              >
                                ↓
                              </Button>
                            </Tooltip>
                            <Tooltip title="نسخ هذا السؤال">
                              <Button
                                size="small"
                                onClick={() => {
                                  const current = form.getFieldValue(["questions", name]);
                                  add(
                                    {
                                      title: current?.title || "",
                                      explanation: current?.explanation || "",
                                      answers:
                                        (current?.answers || []).map((a) => ({
                                          text: a?.text || "",
                                          isCorrect: !!a?.isCorrect,
                                          explanation: a?.explanation || "",
                                        })) || [
                                          { text: "", explanation: "" },
                                          { text: "", explanation: "" },
                                        ],
                                    },
                                    idx + 1
                                  );
                                }}
                              >
                                نسخ
                              </Button>
                            </Tooltip>
                            <Tooltip title="حذف السؤال">
                              <Button danger type="text" icon={<DeleteOutlined />} onClick={() => remove(name)} />
                            </Tooltip>
                          </div>
                        }
                        bordered
                      >
                        <Form.Item
                          {...restField}
                          label="نص السؤال"
                          name={[name, "title"]}
                          rules={[{ required: true, message: "من فضلك أدخل نص السؤال" }]}
                        >
                          <Input placeholder="اكتب نص السؤال هنا" />
                        </Form.Item>

                        {/* إجابات السؤال */}
                        <Form.List name={[name, "answers"]}>
                          {(ansFields, { add: addAns, remove: removeAns }) => (
                            <>
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium">الإجابات</span>
                                <Button icon={<PlusOutlined />} onClick={() => addAns({ text: "", explanation: "" })}>
                                  إضافة إجابة
                                </Button>
                              </div>

                              <Space direction="vertical" className="w-full">
                                {ansFields.map(({ key: aKey, name: aName, ...aRest }, aIdx) => (
                                  <div key={aKey} className="grid grid-cols-12 gap-3 items-start">
                                    <div className="col-span-12 md:col-span-9">
                                      <Form.Item
                                        {...aRest}
                                        label={`الإجابة ${aIdx + 1}`}
                                        name={[aName, "text"]}
                                        rules={[{ required: true, message: "من فضلك أدخل نص الإجابة" }]}
                                      >
                                        <Input placeholder="نص الإجابة" />
                                      </Form.Item>
                                    </div>

                                    <div className="col-span-8 md:col-span-2">
                                      <Form.Item
                                        valuePropName="checked"
                                        name={[aName, "isCorrect"]}
                                        label="صحيحة؟"
                                      >
                                        <Checkbox />
                                      </Form.Item>
                                    </div>

                                    <div className="col-span-4 md:col-span-1 pt-6">
                                      <Tooltip title="حذف الإجابة">
                                        <Button
                                          danger
                                          type="text"
                                          icon={<MinusCircleOutlined />}
                                          onClick={() => removeAns(aName)}
                                        />
                                      </Tooltip>
                                    </div>

                                    {/* شرح الإجابة (اختياري) */}
                                    <div className="col-span-12">
                                      <Form.Item
                                        name={[aName, "explanation"]}
                                        label="شرح الإجابة (اختياري)"
                                      >
                                        <Input.TextArea rows={2} placeholder="لماذا هذه الإجابة صحيحة/خاطئة؟" />
                                      </Form.Item>
                                    </div>
                                  </div>
                                ))}
                              </Space>
                            </>
                          )}
                        </Form.List>
                      </Card>
                    ))}
                  </Space>

                  {/* زر إضافي أسفل القائمة */}
                  <div className="flex justify-end mt-3">
                    <Button
                      type="dashed"
                      icon={<PlusOutlined />}
                      onClick={() =>
                        add({
                          title: "",
                          explanation: "",
                          answers: [
                            { text: "", explanation: "" },
                            { text: "", explanation: "" },
                          ],
                        })
                      }
                    >
                      إضافة سؤال جديد
                    </Button>
                  </div>
                </>
              )}
            </Form.List>

            <Divider />

            <div className="flex items-center justify-end gap-3">
              <Button onClick={handleCancel}>إلغاء</Button>
              <Button className="bg-primary text-white" type="primary" icon={<SendOutlined />} onClick={() => form.submit()}>
                حفظ الامتحان
              </Button>
            </div>
          </Form>

          <div className="h-2" />
        </div>
      </Modal>
    </ConfigProvider>
  );
}

export default AddNewExamModal;
