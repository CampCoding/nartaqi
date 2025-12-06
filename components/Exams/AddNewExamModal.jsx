"use client";
import React, { useEffect, useMemo, useState } from "react";
import {
  PlusOutlined,
  DeleteOutlined,
  MinusCircleOutlined,
  QuestionCircleOutlined,
  SendOutlined,
  CopyOutlined,
  EyeOutlined,
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
  Select,
  Radio,
} from "antd";

/* ---------- Types ---------- */
const QUESTION_TYPES = [
  { value: "mcq", label: "اختيار من متعدد" },
  { value: "tf", label: "صح / خطأ" },
  { value: "written", label: "سؤال مقالي" },
  { value: "fill", label: "أكمل الفراغ" },
  { value: "passage", label: "قطعة قراءة" },
];

const EXAM_TYPES = [
  { value: "training", label: "تدريب" },
  { value: "mock", label: "اختبار محاكي" },
];

/* ---------- Factories ---------- */
const makeDefaultQuestion = (type = "mcq") => {
  if (type === "mcq") {
    return {
      type: "mcq",
      title: "",
      explanation: "",
      answers: [
        { text: "", isCorrect: false, explanation: "" },
        { text: "", isCorrect: false, explanation: "" },
      ],
    };
  }
  if (type === "tf") {
    return {
      type: "tf",
      title: "",
      explanation: "",
      correct: true,
    };
  }
  if (type === "written") {
    return {
      type: "written",
      title: "",
      explanation: "",
      sampleAnswer: "",
    };
  }
  if (type === "fill") {
    return {
      type: "fill",
      title: "",
      explanation: "",
      gaps: [""],
      answerText: "",
    };
  }
  // Passage type
  return {
    type: "passage",
    title: "",
    explanation: "",
    passageTitle: "",
    passageText: "",
    subQuestions: [makeDefaultQuestion("mcq")],
  };
};

/* ---------- Helpers ---------- */
const mapQuestionForPayload = (q) => {
  const base = {
    type: q.type || "mcq",
    title: (q.title || "").trim(),
    explanation: (q.explanation || "").trim(),
  };
  switch (base.type) {
    case "mcq":
      base.answers = (q.answers || [])
        .filter((a) => ((a && a.text) || "").trim().length > 0)
        .map((a) => ({
          text: a.text.trim(),
          isCorrect: !!a.isCorrect,
          explanation: (a.explanation || "").trim(),
        }));
      break;
    case "tf":
      base.correct = typeof q.correct === "boolean" ? q.correct : true;
      break;
    case "written":
      base.sampleAnswer = (q.sampleAnswer || "").trim();
      break;
    case "fill":
      base.gaps = (q.gaps || []).map((g) => String(g || "").trim()).filter(Boolean);
      base.answerText = (q.answerText || "").trim();
      break;
    case "passage":
      base.passageTitle = (q.passageTitle || "").trim();
      base.passageText = (q.passageText || "").trim();
      base.subQuestions = (q.subQuestions || []).map(mapQuestionForPayload);
      break;
    default:
      break;
  }
  return base;
};

function AddNewExamModal({
  open,
  setOpen,
  palette,
  onSubmit,
  examTypeOptions = EXAM_TYPES,
  questionTypeOptions = QUESTION_TYPES, // تم تمرير الخيارات بشكل صحيح
}) {
  const [form] = Form.useForm();
  const [passagePreviewVisible, setPassagePreviewVisible] = useState(false);
  const [currentPassage, setCurrentPassage] = useState("");
  
  useEffect(() => {
    console.log("خيارات أنواع الأسئلة:", QUESTION_TYPES);
  }, [QUESTION_TYPES]);

  const PALETTE = useMemo(
    () => ({
      primary: (palette && palette.primary) || "#0F7490",
      text: (palette && palette.text) || "#202938",
      background: (palette && palette.background) || "#F9FAFC",
    }),
    [palette]
  );

  const handleCancel = () => setOpen(false);

  /* ---------- Validation (recursive) ---------- */
  const validateSingle = (q, label) => {
    if (!q.title?.trim() && q.type !== "passage") {
      message.error(`${label}: نص السؤال مطلوب`);
      return false;
    }
    switch (q.type) {
      case "mcq": {
        const answers = (q.answers || []).filter((a) => (a.text || "").trim());
        if (answers.length < 2) {
          message.error(`${label}: يجب إدخال إجابتين على الأقل`);
          return false;
        }
        if (!answers.some((a) => a.isCorrect)) {
          message.warning(`${label}: لا توجد إجابة صحيحة (سيمرّ لكن يُفضّل تعيين واحدة)`);
        }
        break;
      }
      case "tf": {
        if (typeof q.correct !== "boolean") {
          message.error(`${label}: الرجاء اختيار (صح/خطأ)`);
          return false;
        }
        break;
      }
      case "fill": {
        const hasGaps = (q.gaps || []).some((g) => String(g || "").trim().length > 0);
        const hasText = String(q.answerText || "").trim().length > 0;
        if (!hasGaps && !hasText) {
          message.error(`${label}: أدخل إجابات الفراغات أو إجابة نصية واحدة على الأقل`);
          return false;
        }
        break;
      }
      case "passage": {
        if (!String(q.passageText || "").trim()) {
          message.error(`${label}: أدخل نص القطعة`);
          return false;
        }
        if (!Array.isArray(q.subQuestions) || q.subQuestions.length === 0) {
          message.error(`${label}: أضف سؤالاً واحدًا على الأقل داخل القطعة`);
          return false;
        }
        for (let j = 0; j < q.subQuestions.length; j++) {
          if (!validateSingle(q.subQuestions[j], `${label} - سؤال فرعي ${j + 1}`)) return false;
        }
        break;
      }
      default:
        // written: no extra required
        break;
    }
    return true;
  };

  const validateQuestions = (qs = []) => {
    for (let i = 0; i < qs.length; i++) {
      const ok = validateSingle(qs[i], `السؤال رقم ${i + 1}`);
      if (!ok) return false;
    }
    return true;
  };

  /* ---------- Submit ---------- */
  const handleFinish = async (values) => {
    const payload = {
      title: (values.title || "").trim(),
      description: (values.description || "").trim(),
      time: (values.time || "").toString().trim(),
      examType: values.examType || "training",
      questions: (values.questions || []).map(mapQuestionForPayload),
    };

    if (!validateQuestions(payload.questions)) return;

    try {
      await onSubmit?.(payload);
      message.success("تم إنشاء الامتحان بنجاح");
      setOpen(false);
      form.resetFields();
    } catch (e) {
      message.error(e?.message || "حدث خطأ أثناء حفظ الامتحان");
    }
  };

  /* ---------- Mutators ---------- */
  const duplicateQuestion = (listAdd, current, insertIndex) => {
    const cloned = JSON.parse(JSON.stringify(current || makeDefaultQuestion("mcq")));
    listAdd(cloned, insertIndex);
  };

  const onChangeQuestionType = (qIndex, type) => {
    const qs = form.getFieldValue("questions") || [];
    const old = qs[qIndex] || {};
    const next = {
      ...makeDefaultQuestion(type),
      title: old.title || "",
      explanation: old.explanation || "",
    };
    qs[qIndex] = next;
    form.setFieldsValue({ questions: qs });
  };

  const onChangeSubQuestionType = (qIndex, subIndex, type) => {
    const qs = form.getFieldValue("questions") || [];
    const passage = qs[qIndex] || {};
    const subs = passage.subQuestions || [];
    const old = subs[subIndex] || {};
    subs[subIndex] = {
      ...makeDefaultQuestion(type),
      title: old.title || "",
      explanation: old.explanation || "",
    };
    passage.subQuestions = subs;
    qs[qIndex] = passage;
    form.setFieldsValue({ questions: qs });
  };

  const showPassagePreview = (passageText) => {
    setCurrentPassage(passageText);
    setPassagePreviewVisible(true);
  };

  /* one watcher (safe hook) */
  const questions = Form.useWatch("questions", form) || [];

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
              اختر نوع الاختبار، ثم أضف أسئلة من الأنواع المختلفة بما فيها قطعة قراءة مع أسئلة تابعة لها.
            </p>
          </div>

          <Divider className="my-4" />

          <Form
            form={form}
            layout="vertical"
            initialValues={{
              examType: "training",
              title: "",
              description: "",
              time: "",
              questions: [makeDefaultQuestion("mcq")],
            }}
            onFinish={handleFinish}
          >
            {/* Exam meta */}
            <Card variant="outlined" className="mb-6">
              <Form.Item
                label="نوع الاختبار"
                name="examType"
                rules={[{ required: true, message: "اختر نوع الاختبار" }]}
              >
                <Select options={examTypeOptions} placeholder="اختر النوع (تدريب / محاكي)" />
              </Form.Item>

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
                <Input.TextArea rows={3} placeholder="وصف مختصر للامتحان، التعليمات..." />
              </Form.Item>

              <Form.Item
                label="مدة الامتحان (بالدقائق)"
                name="time"
                rules={[{ required: true, message: "من فضلك أدخل مدة الامتحان بالدقيقة" }]}
              >
                <Input placeholder="مثال: 30" />
              </Form.Item>
            </Card>

            {/* Questions */}
            <Form.List name="questions">
              {(fields, { add, remove, move }) => (
                <>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold" style={{ color: PALETTE.text }}>
                      الأسئلة
                    </h3>
                  </div>

                  <Space direction="vertical" className="w-full">
                    {fields.map(({ key, name, ...restField }, idx) => {
                      const q = questions?.[name] || {};
                      const qType = q?.type || "mcq";

                      return (
                        <Card
                          key={key}
                          title={
                            <div className="flex items-center gap-2">
                              <QuestionCircleOutlined />
                              <span>سؤال رقم {idx + 1}</span>
                              {qType === "passage" && <span className="text-sm text-blue-500">(قطعة قراءة)</span>}
                            </div>
                          }
                          extra={
                            <div className="flex items-center gap-1">
                              <Tooltip title="حذف السؤال">
                                <Button danger type="text" icon={<DeleteOutlined />} onClick={() => remove(name)} />
                              </Tooltip>
                            </div>
                          }
                          variant="outlined"
                        >
                          {/* نوع السؤال */}
                          <Form.Item
                            {...restField}
                            label="نوع السؤال"
                            name={[name, "type"]}
                            rules={[{ required: true, message: "اختر نوع السؤال" }]}
                          >
                            <Select
                              options={QUESTION_TYPES} // استخدام المتغير الصحيح
                              onChange={(val) => onChangeQuestionType(name, val)}
                              placeholder="اختر النوع"
                            />
                          </Form.Item>

                          {/* نص السؤال (لا نعرضه في القطعة لأنها ليست سؤالاً بحد ذاتها) */}
                          {qType !== "passage" && (
                            <Form.Item
                              {...restField}
                              label="نص السؤال"
                              name={[name, "title"]}
                              rules={[{ required: true, message: "من فضلك أدخل نص السؤال" }]}
                            >
                              <Input placeholder="اكتب نص السؤال هنا" />
                            </Form.Item>
                          )}

                          {/* شرح السؤال (اختياري) */}
                          {qType !== "passage" && (
                            <Form.Item {...restField} label="شرح السؤال (اختياري)" name={[name, "explanation"]}>
                              <Input.TextArea rows={2} placeholder="ملاحظات/تلميحات تخص السؤال" />
                            </Form.Item>
                          )}

                          {/* === نوع: MCQ === */}
                          {qType === "mcq" && (
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
                                          <Form.Item valuePropName="checked" name={[aName, "isCorrect"]} label="صحيحة؟">
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

                                        <div className="col-span-12">
                                          <Form.Item name={[aName, "explanation"]} label="شرح الإجابة (اختياري)">
                                            <Input.TextArea rows={2} placeholder="لماذا هذه الإجابة صحيحة/خاطئة؟" />
                                          </Form.Item>
                                        </div>
                                      </div>
                                    ))}
                                  </Space>
                                </>
                              )}
                            </Form.List>
                          )}

                          {/* === نوع: TF === */}
                          {qType === "tf" && (
                            <Form.Item
                              name={[name, "correct"]}
                              label="الإجابة الصحيحة"
                              rules={[{ required: true, message: "اختر صح/خطأ" }]}
                            >
                              <Radio.Group>
                                <Radio value={true}>صح</Radio>
                                <Radio value={false}>خطأ</Radio>
                              </Radio.Group>
                            </Form.Item>
                          )}

                          {/* === نوع: Written === */}
                          {qType === "written" && (
                            <Form.Item name={[name, "sampleAnswer"]} label="إجابة نموذجية (اختياري)">
                              <Input.TextArea rows={3} placeholder="أدخل إجابة نموذجية مختصرة (اختياري)" />
                            </Form.Item>
                          )}

                          {/* === نوع: Fill === */}
                          {qType === "fill" && (
                            <>
                              <Form.List name={[name, "gaps"]}>
                                {(gapFields, { add: addGap, remove: removeGap }) => (
                                  <>
                                    <div className="flex items-center justify-between mb-2">
                                      <span className="font-medium">إجابات الفراغات</span>
                                      <Button icon={<PlusOutlined />} onClick={() => addGap("")}>
                                        إضافة فراغ
                                      </Button>
                                    </div>
                                    <Space direction="vertical" className="w-full">
                                      {gapFields.map(({ key: gKey, name: gName, ...gRest }, gIdx) => (
                                        <div key={gKey} className="grid grid-cols-12 gap-3 items-start">
                                          <div className="col-span-11">
                                            <Form.Item {...gRest} label={`الإجابة ${gIdx + 1}`} name={gName}>
                                              <Input placeholder="أدخل إجابة الفراغ" />
                                            </Form.Item>
                                          </div>
                                          <div className="col-span-1 pt-6">
                                            <Tooltip title="حذف">
                                              <Button
                                                danger
                                                type="text"
                                                icon={<MinusCircleOutlined />}
                                                onClick={() => removeGap(gName)}
                                              />
                                            </Tooltip>
                                          </div>
                                        </div>
                                      ))}
                                    </Space>
                                  </>
                                )}
                              </Form.List>

                              <Form.Item name={[name, "answerText"]} label="إجابة كنص واحد (بديل عن الفراغات)">
                                <Input placeholder="اكتب الإجابة الكاملة كنص واحد (اختياري)" />
                              </Form.Item>
                            </>
                          )}

                          {/* === NEW: نوع Passage === */}
                          {qType === "passage" && (
                            <>
                              <Form.Item
                                {...restField}
                                label="عنوان القطعة (اختياري)"
                                name={[name, "passageTitle"]}
                              >
                                <Input placeholder="مثال: التعليم المدمج" />
                              </Form.Item>

                              <Form.Item
                                {...restField}
                                label="نص القطعة"
                                name={[name, "passageText"]}
                                rules={[{ required: true, message: "أدخل نص القطعة" }]}
                              >
                                <Input.TextArea 
                                  rows={5} 
                                  placeholder="ألصق نص القطعة هنا..." 
                                />
                              </Form.Item>
                              
                              <div className="mb-4 flex justify-end">
                                <Button 
                                  icon={<EyeOutlined />} 
                                  onClick={() => showPassagePreview(q.passageText || "")}
                                >
                                  معاينة القطعة
                                </Button>
                              </div>

                              <Divider>الأسئلة التابعة للقطعة</Divider>

                              <Form.List name={[name, "subQuestions"]}>
                                {(subFields, { add: addSub, remove: removeSub, move: moveSub }) => (
                                  <>
                                    <div className="flex items-center justify-between mb-2">
                                      <h4 className="m-0">الأسئلة الفرعية</h4>
                                      <Space>
                                        <Select
                                          defaultValue="mcq"
                                          style={{ width: 220 }}
                                          options={QUESTION_TYPES?.filter(item => item?.value !== "passage")} // منع إضافة قطعة داخل قطعة
                                          onChange={(t) => addSub(makeDefaultQuestion(t))}
                                          placeholder="اختر نوع سؤال لإضافته"
                                        />
                                        <Button
                                          type="dashed"
                                          icon={<PlusOutlined />}
                                          onClick={() => addSub(makeDefaultQuestion("mcq"))}
                                        >
                                          إضافة سؤال فرعي
                                        </Button>
                                      </Space>
                                    </div>

                                    <Space direction="vertical" className="w-full">
                                      {subFields.map(({ key: skey, name: sName, ...sRest }, sIdx) => {
                                        const sub = questions?.[name]?.subQuestions?.[sName] || {};
                                        const sType = sub?.type || "mcq";

                                        return (
                                          <Card
                                            key={skey}
                                            className="!bg-gray-50"
                                            title={<span>سؤال فرعي #{sIdx + 1}</span>}
                                            extra={
                                              <Space>
                                                <Button danger type="text" icon={<DeleteOutlined />} onClick={() => removeSub(sName)} />
                                              </Space>
                                            }
                                          >
                                            {/* نوع السؤال الفرعي */}
                                            <Form.Item
                                              {...sRest}
                                              label="نوع السؤال"
                                              name={[sName, "type"]}
                                              rules={[{ required: true, message: "اختر نوع السؤال" }]}
                                            >
                                              <Select
                                                options={QUESTION_TYPES?.filter(item => item?.value !== "passage")} // منع تحويل السؤال الفرعي إلى قطعة
                                                onChange={(val) => onChangeSubQuestionType(name, sName, val)}
                                                placeholder="اختر النوع"
                                              />
                                            </Form.Item>

                                            {/* نص السؤال الفرعي */}
                                            <Form.Item
                                              {...sRest}
                                              label="نص السؤال"
                                              name={[sName, "title"]}
                                              rules={[{ required: true, message: "أدخل نص السؤال" }]}
                                            >
                                              <Input placeholder="اكتب نص السؤال هنا" />
                                            </Form.Item>

                                            {/* شرح (اختياري) */}
                                            <Form.Item {...sRest} label="شرح السؤال (اختياري)" name={[sName, "explanation"]}>
                                              <Input.TextArea rows={2} placeholder="ملاحظات/تلميحات تخص السؤال" />
                                            </Form.Item>

                                            {/* حقول الأنواع الفرعية */}
                                            {sType === "mcq" && (
                                              <Form.List name={[sName, "answers"]}>
                                                {(ansFields, { add: addAns, remove: removeAns }) => (
                                                  <>
                                                    <div className="flex items-center justify-between mb-2">
                                                      <span className="font-medium">الإجابات</span>
                                                      <Button
                                                        icon={<PlusOutlined />}
                                                        onClick={() => addAns({ text: "", explanation: "" })}
                                                      >
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
                                                              rules={[{ required: true, message: "أدخل نص الإجابة" }]}
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
                                                          <div className="col-span-12">
                                                            <Form.Item name={[aName, "explanation"]} label="شرح الإجابة (اختياري)">
                                                              <Input.TextArea rows={2} placeholder="لماذا هذه الإجابة صحيحة/خاطئة؟" />
                                                            </Form.Item>
                                                          </div>
                                                        </div>
                                                      ))}
                                                    </Space>
                                                  </>
                                                )}
                                              </Form.List>
                                            )}

                                            {sType === "tf" && (
                                              <Form.Item
                                                name={[sName, "correct"]}
                                                label="الإجابة الصحيحة"
                                                rules={[{ required: true, message: "اختر صح/خطأ" }]}
                                              >
                                                <Radio.Group>
                                                  <Radio value={true}>صح</Radio>
                                                  <Radio value={false}>خطأ</Radio>
                                                </Radio.Group>
                                              </Form.Item>
                                            )}

                                            {sType === "written" && (
                                              <Form.Item name={[sName, "sampleAnswer"]} label="إجابة نموذجية (اختياري)">
                                                <Input.TextArea rows={3} placeholder="أدخل إجابة نموذجية مختصرة" />
                                              </Form.Item>
                                            )}

                                            {sType === "fill" && (
                                              <>
                                                <Form.List name={[sName, "gaps"]}>
                                                  {(gapFields, { add: addGap, remove: removeGap }) => (
                                                    <>
                                                      <div className="flex items-center justify-between mb-2">
                                                        <span className="font-medium">إجابات الفراغات</span>
                                                        <Button icon={<PlusOutlined />} onClick={() => addGap("")}>
                                                          إضافة فراغ
                                                        </Button>
                                                      </div>
                                                      <Space direction="vertical" className="w-full">
                                                        {gapFields.map(({ key: gKey, name: gName, ...gRest }, gIdx) => (
                                                          <div key={gKey} className="grid grid-cols-12 gap-3 items-start">
                                                            <div className="col-span-11">
                                                              <Form.Item {...gRest} label={`الإجابة ${gIdx + 1}`} name={gName}>
                                                                <Input placeholder="أدخل إجابة الفراغ" />
                                                              </Form.Item>
                                                            </div>
                                                            <div className="col-span-1 pt-6">
                                                              <Tooltip title="حذف">
                                                                <Button
                                                                  danger
                                                                  type="text"
                                                                  icon={<MinusCircleOutlined />}
                                                                  onClick={() => removeGap(gName)}
                                                                />
                                                              </Tooltip>
                                                            </div>
                                                          </div>
                                                        ))}
                                                      </Space>
                                                    </>
                                                  )}
                                                </Form.List>

                                                <Form.Item name={[sName, "answerText"]} label="إجابة كنص واحد (بديل عن الفراغات)">
                                                  <Input placeholder="اكتب الإجابة الكاملة كنص واحد (اختياري)" />
                                                </Form.Item>
                                              </>
                                            )}
                                          </Card>
                                        );
                                      })}
                                    </Space>
                                  </>
                                )}
                              </Form.List>
                            </>
                          )}
                        </Card>
                      );
                    })}
                  </Space>

                  {/* Add new question */}
                  <div className="flex justify-end mt-3 gap-2">
                    <Select
                      defaultValue="mcq"
                      style={{ width: 240 }}
                      options={QUESTION_TYPES} // استخدام المتغير الصحيح
                      onChange={(t) => add(makeDefaultQuestion(t))}
                      placeholder="اختر نوع السؤال لإضافته"
                    />
                    <Button type="dashed" icon={<PlusOutlined />} onClick={() => add(makeDefaultQuestion("mcq"))}>
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

      {/* معاينة قطعة القراءة */}
      <Modal
        title="معاينة قطعة القراءة"
        open={passagePreviewVisible}
        onCancel={() => setPassagePreviewVisible(false)}
        footer={[
          <Button key="back" onClick={() => setPassagePreviewVisible(false)}>
            إغلاق
          </Button>,
        ]}
        width={700}
      >
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="whitespace-pre-line leading-7 text-justify">
            {currentPassage || "لم يتم إدخال نص القطعة بعد"}
          </div>
        </div>
      </Modal>
    </ConfigProvider>
  );
}

export default AddNewExamModal;