"use client";

import React, { useEffect, useMemo, useState } from "react";
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
import {
  EditOutlined,
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
import dayjs from "dayjs";

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

const toDayjs = (v) => (v ? dayjs(v) : null);

const initials = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() || "")
    .join("");

/**
 * Props:
 * open, onCancel, onSubmit, student
 * gradeOptions, classOptions, subjectOptions, defaults
 * - onSubmit(payload) يجب أن تحدّث الطالب في الواجهة (وأيضًا في الباك إند لو موجود)
 * - payload يتضمن: { id, name, email, grade, status, joinDate, ... }
 */
function EditStudentModal({
  open,
  onCancel,
  onSubmit,
  student, // { id, name, email, phone, grade, status, joinDate, dob, subjects, ... }
  gradeOptions = [],
  classOptions = [],
  subjectOptions = [],
  defaults = {},
}) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [age, setAge] = useState(null);

  // subjects options
  const normalizedSubjects = useMemo(
    () =>
      (subjectOptions || []).map((s) => ({
        label: s.code ? `${s.name} (${s.code})` : s.name,
        value: String(s.id ?? s.value ?? s.code ?? s.name),
      })),
    [subjectOptions]
  );

  // عند فتح/تغيّر الطالب: عبّي الفورم بالبيانات الحالية
  useEffect(() => {
    if (!open) return;
    const init = {
      fullName: student?.name || "",
      studentId: student?.studentId || "",
      email: student?.email || "",
      phone: student?.phone || "",
      gender: student?.gender || "ذكر",
      status: student?.status || "approved", // approved|pending|rejected
      grade: student?.grade || defaults.gradeValue,
      classSection: student?.classSection || defaults.classValue,
      subjects: student?.subjects || [],
      enrollmentDate: toDayjs(student?.joinDate),
      dob: toDayjs(student?.dob),
      transport: student?.transport || "None",
      guardianName: student?.guardianName || "",
      guardianPhone: student?.guardianPhone || "",
      guardianEmail: student?.guardianEmail || "",
      emergencyName: student?.emergencyName || "",
      emergencyPhone: student?.emergencyPhone || "",
      address: student?.address || "",
      notes: student?.notes || "",
      sendInvite: !!student?.sendInvite,
    };
    form.setFieldsValue(init);
    setPhotoPreview(student?.photo || null);

    // احتساب العمر (إن وجد dob)
    if (student?.dob) {
      const dt = new Date(student.dob);
      const diff = Date.now() - dt.getTime();
      setAge(Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000)));
    } else {
      setAge(null);
    }
  }, [open, student, form, defaults.gradeValue, defaults.classValue]);

  const handleDobChange = (d) => {
    if (!d) return setAge(null);
    const dt = typeof d.toDate === "function" ? d.toDate() : new Date(d);
    const diff = Date.now() - dt.getTime();
    const yrs = Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000));
    setAge(yrs);
  };

  const handleFinish = async (values) => {
    // payload متوافق مع شبكة الطلاب لديك
    const payload = {
      id: student?.id,
      name: values.fullName?.trim(),
      email: values.email?.trim() || "",
      grade: values.grade,
      status: values.status, // approved | pending | rejected
      joinDate: (toISO(values.enrollmentDate) || "").slice(0, 10), // YYYY-MM-DD

      // حقول إضافية للتخزين المستقبلي
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
      message.success("تم حفظ التعديلات بنجاح");
      onCancel?.();
    } catch (e) {
      message.error("حدث خطأ أثناء حفظ التعديلات. حاول مرة أخرى.");
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
                <EditOutlined className="text-white text-lg" />
              </div>
              <h2 className="text-3xl font-bold text-text">تعديل بيانات الطالب</h2>
            </div>
            <p className="text-gray-600">حدّث بيانات الطالب واربطه بالصف والمواد.</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <Form
              form={form}
              layout="vertical"
              onFinish={handleFinish}
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
                    <Form.Item label="تاريخ الميلاد" name="dob">
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

                      <div>
                        <h4 className="text-text font-semibold">
                          {form.getFieldValue("fullName") || "اسم الطالب"}
                        </h4>
                        <p className="text-gray-500 text-sm">
                          {form.getFieldValue("studentId") || "المعرف —"}
                        </p>
                      </div>
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
                    icon={<EditOutlined />}
                  >
                    {loading ? "جاري الحفظ..." : "حفظ التغييرات"}
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

export default EditStudentModal;
