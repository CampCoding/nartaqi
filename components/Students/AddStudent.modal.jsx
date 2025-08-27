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
  Switch,
  ConfigProvider,
  message,
} from "antd";
import '@ant-design/v5-patch-for-react-19';
import {
  PlusOutlined,
  InboxOutlined,
  UserOutlined,
  TeamOutlined,
  BookOutlined,
  CalendarOutlined,
  IdcardOutlined,
  HomeOutlined,
  PhoneOutlined,
  MailOutlined,
} from "@ant-design/icons";

const { TextArea } = Input;
const { Dragger } = Upload;

const PALETTE = {
  primary: "#0F7490",
  secondary: "#C9AE6C",
  accent: "#8B5CF6",
  background: "#F9FAFC",
  text: "#202938",
};

const toISO = (d) =>
  d ? (typeof d.toDate === "function" ? d.toDate().toISOString() : d.toISOString?.()) : null;

const initials = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() || "")
    .join("");

/**
 * Props:
 * open, onCancel, onSubmit(payload)
 * gradeOptions: [{label, value}], classOptions: [{label, value}]
 * subjectOptions: [{ id?, name, code? }...]
 * defaults: { gradeValue?, classValue? }
 *
 * ملاحظة: الـ payload الناتج متوافق مع شبكة الطلاب الحالية:
 * {
 *   name, email, grade, status, joinDate (YYYY-MM-DD),
 *   // باقي الحقول اختيارية للمستقبل
 * }
 */
function AddStudentModal({
  open,
  onCancel,
  onSubmit,
  gradeOptions = [],
  classOptions = [],
  subjectOptions = [],
  defaults = {},
}) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [age, setAge] = useState(null);

  const normalizedSubjects = useMemo(
    () =>
      (subjectOptions || []).map((s) => ({
        label: s.code ? `${s.name} (${s.code})` : s.name,
        value: String(s.id ?? s.value ?? s.code ?? s.name),
      })),
    [subjectOptions]
  );

  const handleDobChange = (d) => {
    if (!d) return setAge(null);
    const dt = typeof d.toDate === "function" ? d.toDate() : new Date(d);
    const diff = Date.now() - dt.getTime();
    const yrs = Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000));
    setAge(yrs);
  };

  const handleFinish = async (values) => {
    // نطابق أسماء الحقول مع شبكة الطلاب: name, email, grade, status, joinDate
    const payload = {
      name: values.fullName?.trim(),
      email: values.email?.trim() || "",
      grade: values.grade,
      status: values.status, // approved | pending | rejected
      joinDate: (toISO(values.enrollmentDate) || "").slice(0, 10), // YYYY-MM-DD
      // معلومات إضافية اختيارية للمستقبل (لا تؤثر على الشبكة الحالية)
      studentId: values.studentId,
      phone: values.phone,
      gender: values.gender,
      classSection: values.classSection,
      subjects: values.subjects || [],
      dob: toISO(values.dob),
      transport: values.transport,
      guardianName: values.guardianName,
      guardianPhone: values.guardianPhone,
      guardianEmail: values.guardianEmail,
      emergencyName: values.emergencyName,
      emergencyPhone: values.emergencyPhone,
      address: values.address,
      notes: values.notes,
      photo: photoPreview, // URL بعد الرفع إن لزم
      sendInvite: values.sendInvite ?? false,
    };

    try {
      setLoading(true);
      await (typeof onSubmit === "function" ? onSubmit(payload) : Promise.resolve());
      message.success("تم إضافة الطالب بنجاح");
      form.resetFields();
      setPhotoPreview(null);
      setAge(null);
      onCancel?.();
    } catch (e) {
      message.error("حدث خطأ أثناء إضافة الطالب. حاول مرة أخرى.");
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
          setPhotoPreview(null);
          setAge(null);
          onCancel?.();
        }}
        footer={null}
        className="!w-full max-w-6xl"
      >
        <div className="bg-background">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-sm">
                <PlusOutlined className="text-white text-lg" />
              </div>
              <h2 className="text-3xl font-bold text-text">إضافة طالب جديد</h2>
            </div>
            <p className="text-gray-600">أنشئ ملفًا لطالب واربطه بالصف والمواد.</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <Form
              form={form}
              layout="vertical"
              onFinish={handleFinish}
              initialValues={{
                fullName: "",
                studentId: "",
                email: "",
                phone: "",
                gender: "ذكر",
                status: "approved", // نشط افتراضيًا
                grade: defaults.gradeValue,
                classSection: defaults.classValue,
                subjects: [],
                enrollmentDate: null,
                dob: null,
                transport: "None",
                guardianName: "",
                guardianPhone: "",
                guardianEmail: "",
                emergencyName: "",
                emergencyPhone: "",
                address: "",
                notes: "",
                sendInvite: false,
              }}
              className="grid grid-cols-1 xl:grid-cols-3 gap-6"
            >
              {/* العمود الأيسر */}
              <div className="space-y-6 xl:col-span-2">
                {/* بيانات الطالب */}
                <div className="bg-gray-50 p-5 rounded-xl">
                  <h3 className="text-lg font-semibold text-text mb-4 flex items-center gap-2">
                    <UserOutlined className="text-primary" />
                    بيانات الطالب
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Form.Item
                      label={<span className="text-text font-medium">الاسم الكامل *</span>}
                      name="fullName"
                      rules={[
                        { required: true, message: "من فضلك اكتب الاسم الكامل" },
                        {
                          validator: (_, v) =>
                            !v || v.trim().length >= 2
                              ? Promise.resolve()
                              : Promise.reject(new Error("الاسم لا يقل عن حرفين")),
                        },
                      ]}
                    >
                      <Input placeholder="مثال: علي محمد" className="rounded-lg px-4 py-3" />
                    </Form.Item>

                    <Form.Item
                      label="رقم الطالب *"
                      name="studentId"
                      rules={[
                        { required: true, message: "من فضلك اكتب رقم الطالب" },
                        {
                          pattern: /^[A-Za-z0-9\-_.]{3,}$/,
                          message: "3 أحرف/أرقام على الأقل (تُسمح - _ .)",
                        },
                      ]}
                    >
                      <Input
                        prefix={<IdcardOutlined className="text-gray-400 mr-2" />}
                        placeholder="مثال: STU-2025-015"
                        className="rounded-lg px-4 py-3"
                      />
                    </Form.Item>

                    <Form.Item label="البريد الإلكتروني" name="email" rules={[{ type: "email" }]}>
                      <Input
                        prefix={<MailOutlined className="text-gray-400 mr-2" />}
                        placeholder="student@school.edu"
                        className="rounded-lg px-4 py-3"
                      />
                    </Form.Item>

                    <Form.Item
                      label="الهاتف"
                      name="phone"
                      rules={[{ pattern: /^[0-9+\-\s]{7,}$/, message: "رقم هاتف غير صالح" }]}
                    >
                      <Input
                        prefix={<PhoneOutlined className="text-gray-400 mr-2" />}
                        placeholder="+20 1X XXX XXXX"
                        className="rounded-lg px-4 py-3"
                      />
                    </Form.Item>

                    <Form.Item label="النوع" name="gender">
                      <Select
                        className="rounded-lg"
                        options={[
                          { label: "ذكر", value: "ذكر" },
                          { label: "أنثى", value: "أنثى" },
                          { label: "آخر", value: "آخر" },
                        ]}
                      />
                    </Form.Item>

                    <Form.Item label="الحالة *" name="status" rules={[{ required: true }]}>
                      {/* القيم متوافقة مع الشبكة: approved | pending | rejected */}
                      <Select
                        className="rounded-lg"
                        options={[
                          { label: "🟢 نشط", value: "approved" },
                          { label: "🟡 قيد المراجعة", value: "pending" },
                          { label: "🔴 محظور", value: "rejected" },
                        ]}
                      />
                    </Form.Item>
                  </div>

                  <div className="gap-4">
                    <Form.Item label="تاريخ الميلاد" name="dob" rules={[{ required: true }]}>
                      <DatePicker className="w-full rounded-lg" onChange={handleDobChange} />
                    </Form.Item>

                  </div>
                </div>
              </div>

              {/* العمود الأيمن */}
              <div className="space-y-6">
                {/* الصورة والمعاينة */}
                <div className="bg-gray-50 p-5 rounded-xl">
                  <h3 className="text-lg font-semibold text-text mb-4">الصورة والمعاينة</h3>

                  <Dragger
                    multiple={false}
                    maxCount={1}
                    showUploadList={false}
                    beforeUpload={(file) => {
                      const reader = new FileReader();
                      reader.onload = (e) => setPhotoPreview(e.target?.result);
                      reader.readAsDataURL(file);
                      return false; // لا ترفع تلقائيًا
                    }}
                  >
                    <p className="ant-upload-drag-icon">
                      <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">انقر أو اسحب صورة هنا للرفع</p>
                    <p className="ant-upload-hint">PNG/JPG حتى ~2MB.</p>
                  </Dragger>

                  <div className="mt-4 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-3">
                      {photoPreview ? (
                        <img
                          src={photoPreview}
                          alt="student"
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                          style={{
                            background: "linear-gradient(135deg, #8B5CF6 0%, #0F7490 100%)",
                          }}
                        >
                          {(initials(form.getFieldValue("fullName")) || "ST").slice(0, 2).toUpperCase()}
                        </div>
                      )}

                     
                    </div>
                    {photoPreview && (
                      <div className="mt-3">
                        <Button onClick={() => setPhotoPreview(null)} className="rounded-lg">
                          إزالة الصورة
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

              </div>

              {/* الأزرار */}
              <div className="xl:col-span-3 border-t border-gray-200 pt-6">
                <div className="flex justify-end gap-4">
                  <Button
                    onClick={() => {
                      form.resetFields();
                      setPhotoPreview(null);
                      setAge(null);
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
                    icon={<PlusOutlined />}
                  >
                    {loading ? "جاري الإضافة..." : "إضافة الطالب"}
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

export default AddStudentModal;
