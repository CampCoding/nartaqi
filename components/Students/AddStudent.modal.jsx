"use client";

import React, { useMemo, useState } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Upload,
  Button,
  ConfigProvider,
  message,
  Card,
  Tooltip,
  Divider,
  Badge,
  Switch
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
  EyeOutlined,
  EyeInvisibleOutlined,
  KeyOutlined,
  ReloadOutlined,
  CameraOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
  SendOutlined,
} from "@ant-design/icons";
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'

const { TextArea } = Input;
const { Dragger } = Upload;

const PALETTE = {
  primary: "#0F7490",
  secondary: "#C9AE6C",
  accent: "#8B5CF6",
  background: "#F8FAFC",
  text: "#1E293B",
  success: "#10B981",
  warning: "#F59E0B",
  error: "#EF4444",
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

// دالة لتوليد كلمة مرور عشوائية
const generatePassword = () => {
  const length = 12;
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
  let password = "";
  
  password += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[Math.floor(Math.random() * 26)];
  password += "abcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 26)];
  password += "0123456789"[Math.floor(Math.random() * 10)];
  password += "!@#$%^&*"[Math.floor(Math.random() * 8)];
  
  for (let i = 4; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  
  return password.split('').sort(() => 0.5 - Math.random()).join('');
};

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
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState('');

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

  const handleGeneratePassword = () => {
    const newPassword = generatePassword();
    form.setFieldsValue({ password: newPassword });
    message.success("تم توليد كلمة مرور قوية جديدة");
  };

  const handleFinish = async (values) => {
    const payload = {
      name: values.fullName?.trim(),
      email: values.email?.trim() || "",
      phone: phone,
      password: values.password,
      grade: values.grade,
      status: values.status,
      joinDate: (toISO(values.enrollmentDate) || "").slice(0, 10),
      studentId: values.studentId,
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
      photo: photoPreview,
      sendInvite: values.sendInvite ?? false,
    };

    try {
      setLoading(true);
      await (typeof onSubmit === "function" ? onSubmit(payload) : Promise.resolve());
      message.success({
        content: "تم إضافة الطالب بنجاح!",
        icon: <CheckCircleOutlined style={{ color: PALETTE.success }} />,
      });
      form.resetFields();
      setPhotoPreview(null);
      setAge(null);
      setPhone('');
      onCancel?.();
    } catch (e) {
      message.error("حدث خطأ أثناء إضافة الطالب. حاول مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    form.resetFields();
    setPhotoPreview(null);
    setAge(null);
    setPhone('');
    form.setFieldsValue({ password: generatePassword() });
  };

  const handleCancel = () => {
    resetForm();
    onCancel?.();
  };

  return (
    <ConfigProvider
      direction="rtl"
      theme={{
        token: {
          colorPrimary: PALETTE.primary,
          borderRadius: 12,
          colorText: PALETTE.text,
          controlHeight: 48,
          fontSize: 14,
          colorBgContainer: '#FFFFFF',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        },
        components: {
          Modal: {
            contentBg: PALETTE.background,
          },
          Card: {
            borderRadius: 16,
          },
          Input: {
            borderRadius: 10,
          },
          Select: {
            borderRadius: 10,
          },
          Button: {
            borderRadius: 10,
          },
        },
      }}
    >
      <Modal
        title={null}
        open={open}
        onCancel={handleCancel}
        footer={null}
        width="95%"
        style={{ maxWidth: '1400px', top: 20 }}
        bodyStyle={{ padding: 0 }}
        className="student-modal"
      >
        <div className="min-h-[600px]" style={{ background: `linear-gradient(135deg, ${PALETTE.background} 0%, #EDF2F7 100%)` }}>
          {/* Header with Gradient */}
          <div 
            className="p-8 text-white relative overflow-hidden"
            style={{ 
              background: `linear-gradient(135deg, ${PALETTE.primary} 0%, ${PALETTE.accent} 100%)`,
              borderRadius: '12px 12px 0 0'
            }}
          >
            <div className="absolute inset-0 opacity-10">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-white rounded-full"></div>
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white rounded-full opacity-50"></div>
            </div>
            
            <div className="relative flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                <PlusOutlined className="text-white text-2xl" />
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-2">إضافة متدرب جديد</h2>
                <p className="text-white/80 text-lg">أنشئ ملفًا شخصيًا شاملاً للطالب الجديد</p>
              </div>
            </div>
          </div>

          <div className="p-8">
            <Form
              form={form}
              layout="vertical"
              onFinish={handleFinish}
              initialValues={{
                fullName: "",
                studentId: "",
                email: "",
                password: generatePassword(),
                gender: "ذكر",
                status: "approved",
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
              className="grid grid-cols-1 xl:grid-cols-12 gap-8"
            >
              {/* المعلومات الأساسية */}
              <div className="xl:col-span-8 space-y-6">
                <Card 
                  className="shadow-lg border-0"
                  bodyStyle={{ padding: '32px' }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <UserOutlined className="text-white text-lg" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">المعلومات الأساسية</h3>
                      <p className="text-gray-500 text-sm">البيانات الشخصية والتواصل</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Form.Item
                      label={
                        <span className="text-gray-700 font-semibold flex items-center gap-2">
                          <UserOutlined className="text-blue-500" />
                          الاسم الكامل *
                        </span>
                      }
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
                      <Input 
                        placeholder="مثال: علي محمد الأحمد" 
                        className="shadow-sm hover:shadow-md transition-shadow"
                        style={{ height: '48px' }}
                      />
                    </Form.Item>

                    <Form.Item 
                      label={
                        <span className="text-gray-700 font-semibold flex items-center gap-2">
                          <MailOutlined className="text-red-500" />
                          البريد الإلكتروني
                        </span>
                      }
                      name="email" 
                      rules={[{ type: "email", message: "البريد الإلكتروني غير صحيح" }]}
                    >
                      <Input
                        placeholder="student@school.edu"
                        className="shadow-sm hover:shadow-md transition-shadow"
                        style={{ height: '48px' }}
                      />
                    </Form.Item>

                    <Form.Item
                      label={
                        <span className="text-gray-700 font-semibold flex items-center gap-2">
                          <PhoneOutlined className="text-orange-500" />
                          رقم الهاتف *
                        </span>
                      }
                      required
                      style={{ marginBottom: 0 }}
                    >
                      <PhoneInput
                        international
                        defaultCountry="SA"
                        value={phone}
                        onChange={setPhone}
                        placeholder="رقم الهاتف"
                        className="w-full !h-[48px] border-2 rounded-lg shadow-sm"
                      />
                    </Form.Item>

                    <Form.Item
                      label={
                        <span className="text-gray-700 font-semibold flex items-center gap-2">
                          <KeyOutlined className="text-purple-500" />
                          كلمة المرور *
                          <Tooltip title="كلمة المرور يجب أن تحتوي على 8 أحرف على الأقل">
                            <InfoCircleOutlined className="text-gray-400 text-xs" />
                          </Tooltip>
                        </span>
                      }
                      name="password"
                      rules={[
                        { required: true, message: "كلمة المرور مطلوبة" },
                        { min: 8, message: "كلمة المرور يجب أن تكون 8 أحرف على الأقل" }
                      ]}
                    >
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="كلمة مرور قوية"
                        className="shadow-sm hover:shadow-md transition-shadow"
                        style={{ height: '48px' }}
                        suffix={
                          <div className="flex items-center gap-1">
                            <Tooltip title={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}>
                              <Button
                                type="text"
                                icon={showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                                onClick={() => setShowPassword(!showPassword)}
                                className="text-gray-400 hover:text-gray-600 border-0 shadow-none"
                              />
                            </Tooltip>
                            <Tooltip title="توليد كلمة مرور قوية">
                              <Button
                                type="text"
                                icon={<ReloadOutlined />}
                                onClick={handleGeneratePassword}
                                className="text-gray-400 hover:text-purple-600 border-0 shadow-none"
                              />
                            </Tooltip>
                          </div>
                        }
                      />
                    </Form.Item>

                  </div>
                </Card>

               
              </div>

              {/* الصورة والمعاينة */}
              <div className="xl:col-span-4 space-y-6">
                <Card 
                  className="shadow-lg border-0 sticky top-4"
                  bodyStyle={{ padding: '32px' }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-orange-500 rounded-xl flex items-center justify-center">
                      <CameraOutlined className="text-white text-lg" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">الصورة الشخصية</h3>
                      <p className="text-gray-500 text-sm">إضافة صورة للطالب</p>
                    </div>
                  </div>

                  {!photoPreview ? (
                    <Dragger
                      multiple={false}
                      maxCount={1}
                      showUploadList={false}
                      beforeUpload={(file) => {
                        if (file.size > 2 * 1024 * 1024) {
                          message.error('حجم الصورة يجب أن يكون أقل من 2 ميجابايت');
                          return false;
                        }
                        const reader = new FileReader();
                        reader.onload = (e) => setPhotoPreview(e.target?.result);
                        reader.readAsDataURL(file);
                        return false;
                      }}
                      className="border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors rounded-xl"
                      style={{ background: 'linear-gradient(135deg, #F8FAFC 0%, #EDF2F7 100%)' }}
                    >
                      <p className="ant-upload-drag-icon">
                        <InboxOutlined style={{ fontSize: '48px', color: PALETTE.primary }} />
                      </p>
                      <p className="ant-upload-text text-lg font-medium text-gray-700">
                        انقر أو اسحب صورة هنا للرفع
                      </p>
                      <p className="ant-upload-hint text-gray-500">
                        PNG/JPG حتى 2MB
                      </p>
                    </Dragger>
                  ) : (
                    <div className="text-center">
                      <div className="relative inline-block">
                        <img
                          src={photoPreview}
                          alt="student preview"
                          className="w-32 h-32 rounded-full object-cover shadow-lg border-4 border-white"
                        />
                        <Button
                          danger
                          type="primary"
                          icon={<DeleteOutlined />}
                          className="absolute -top-2 -right-2 rounded-full w-8 h-8 flex items-center justify-center p-0"
                          onClick={() => setPhotoPreview(null)}
                        />
                      </div>
                      <p className="mt-4 text-gray-600">تم رفع الصورة بنجاح</p>
                      <Button 
                        className="mt-2" 
                        onClick={() => setPhotoPreview(null)}
                      >
                        تغيير الصورة
                      </Button>
                    </div>
                  )}

                  <Divider className="my-6" />

                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl">
                    <h4 className="font-semibold text-gray-800 mb-2">معاينة الملف الشخصي</h4>
                    <div className="flex items-center gap-3">
                      {photoPreview ? (
                        <img
                          src={photoPreview}
                          alt="preview"
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                          {initials(form.getFieldValue("fullName") || "ST")}
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-gray-800">
                          {form.getFieldValue("fullName") || "اسم الطالب"}
                        </p>
                        <p className="text-sm text-gray-500">
                          {form.getFieldValue("studentId") || "رقم الطالب"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Divider className="my-6" />

                 
                </Card>
              </div>

              {/* الأزرار */}
              <div className="xl:col-span-12 border-t border-gray-200 pt-6">
                <div className="flex justify-end gap-4">
                  <Button
                    onClick={resetForm}
                    className="px-8 py-3 text-gray-700 border border-gray-300 rounded-xl hover:border-gray-400 transition-all"
                    style={{ height: '48px' }}
                  >
                    إعادة ضبط
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
                    style={{ height: '48px' }}
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