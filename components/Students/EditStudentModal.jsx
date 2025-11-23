"use client";

import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  Upload,
  Button,
  ConfigProvider,
  message,
  Card,
  Tooltip,
  Divider,
} from "antd";
import "@ant-design/v5-patch-for-react-19";
import {
  EditOutlined,
  InboxOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  KeyOutlined,
  ReloadOutlined,
  CameraOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
  IdcardOutlined,
  InstagramOutlined,
  FacebookOutlined,
  LinkedinOutlined,
  TikTokFilled,
  YoutubeFilled,
  TwitterOutlined,
} from "@ant-design/icons";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { useDispatch, useSelector } from "react-redux";
import { handleEditTeacher, handleGetAllTeachers } from "../../lib/features/teacherSlice";
import { Globe } from "lucide-react";
import { toast } from "react-toastify";

const { Dragger } = Upload;

const PALETTE = {
  primary: "#0F7490",
  secondary: "#C9AE6C",
  accent: "#8B5CF6",
  background: "#F8FAFC",
  text: "#1E293B",
};

const initials = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() || "")
    .join("");

function EditStudentModal({
  open,
  onCancel,
  student,
  gradeOptions = [],
  classOptions = [],
  subjectOptions = [],
  defaults = {},
}) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState("");

  const dispatch = useDispatch();
  const { edit_teacher_loading } = useSelector(
    (state) => state?.teachers || {}
  );

  // Split full name into parts for the form
  const splitName = (fullName = "") => {
    const parts = fullName.trim().split(/\s+/);
    if (parts.length >= 3) {
      return {
        fullName: parts[0],
        secondName: parts[1],
        familyName: parts.slice(2).join(" ")
      };
    } else if (parts.length === 2) {
      return {
        fullName: parts[0],
        secondName: parts[1],
        familyName: ""
      };
    } else {
      return {
        fullName: parts[0] || "",
        secondName: "",
        familyName: ""
      };
    }
  };

  // Convert gender to Arabic
  const getGenderInArabic = (gender) => {
    return gender === "male" ? "ذكر" : gender === "female" ? "أنثى" : "ذكر";
  };

  // Populate form when modal opens or student changes
  useEffect(() => {
    if (open && student) {
      const nameParts = splitName(student.name);
      
      const initialValues = {
        fullName: nameParts.fullName,
        secondName: nameParts.secondName,
        familyName: nameParts.familyName,
        email: student.email || "",
        gender: getGenderInArabic(student.gender),
        notes: student.description || "",
        instagram: student.instagram || "",
        facebook: student.facebook || "",
        linkedin: student.linkedin || "",
        twitter: student.twitter || "",
        youtube: student.youtube || "",
        tiktok: student.tiktok || "",
        website: student.website || "",
      };

      form.setFieldsValue(initialValues);
      
      // Set photo preview if image exists
      if (student.image_url) {
        setPhotoPreview(student.image_url);
      } else {
        setPhotoPreview(null);
      }
      
      setPhotoFile(null);
    }
  }, [open, student, form]);

  const handleFinish = async (values) => {
    if (!student?.id) {
      toast.error("لم يتم العثور على معرف المحاضر");
      return;
    }

    // Combine name parts into full name
    const fullName = [
      values.fullName?.trim(),
      values.secondName?.trim(),
      values.familyName?.trim(),
    ]
      .filter(Boolean)
      .join(" ");

    // Convert gender to backend format
    let gender = values.gender;
    if (gender === "ذكر") gender = "male";
    if (gender === "أنثى") gender = "female";

    const formData = new FormData();
    formData.append("name", fullName);
    formData.append("email", values.email?.trim() || "");
    formData.append("gender", gender || "");
    formData.append("description", values.notes?.trim() || "");

    // Only append image if a new one was selected
    if (photoFile) {
      formData.append("image", photoFile);
    }

    // Social media links
    formData.append("facebook", values.facebook?.trim() || "");
    formData.append("twitter", values.twitter?.trim() || "");
    formData.append("instagram", values.instagram?.trim() || "");
    formData.append("linkedin", values.linkedin?.trim() || "");
    formData.append("youtube", values.youtube?.trim() || "");
    formData.append("tiktok", values.tiktok?.trim() || "");
    formData.append("website", values.website?.trim() || "");

    // Use _method for PUT request (Laravel convention)
    formData.append("_method", "PUT");

    try {
      const res = await dispatch(
        handleEditTeacher({ 
          id: student.id, 
          body: formData 
        })
      ).unwrap();

      if (res?.data?.status === "success") {
        toast.success(res?.data?.message || "تم تعديل بيانات المحاضر بنجاح");
        dispatch(handleGetAllTeachers());
        resetForm();
        onCancel?.();
      } else {
        toast.error(res?.data?.message || "حدث خطأ أثناء التعديل");
      }
    } catch (e) {
      console.error("Edit teacher error:", e);
      toast.error("حدث خطأ أثناء التعديل. حاول مرة أخرى.");
    }
  };

  const resetForm = () => {
    form.resetFields();
    setPhotoPreview(null);
    setPhotoFile(null);
    setPhone("");
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
          colorBgContainer: "#FFFFFF",
          boxShadow:
            "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        },
      }}
    >
      <Modal
        title={null}
        open={open}
        onCancel={handleCancel}
        footer={null}
        width="95%"
        style={{ maxWidth: "1400px", top: 20 }}
        bodyStyle={{ padding: 0 }}
        className="student-modal"
      >
        <div
          className="min-h-[600px]"
          style={{
            background: `linear-gradient(135deg, ${PALETTE.background} 0%, #EDF2F7 100%)`,
          }}
        >
          {/* Header */}
          <div
            className="p-8 text-white relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${PALETTE.primary} 0%, ${PALETTE.accent} 100%)`,
              borderRadius: "12px 12px 0 0",
            }}
          >
            <div className="absolute inset-0 opacity-10">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-white rounded-full" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white rounded-full opacity-50" />
            </div>

            <div className="relative flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                <EditOutlined className="text-white text-2xl" />
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-2">تعديل بيانات المحاضر</h2>
                <p className="text-white/80 text-lg">
                  قم بتعديل الملف الشخصي للمحاضر
                </p>
              </div>
            </div>
          </div>

          <div className="p-8">
            <Form
              form={form}
              layout="vertical"
              onFinish={handleFinish}
              className="grid grid-cols-1 xl:grid-cols-12 gap-8"
            >
              {/* اليمين: المعلومات الأساسية + التواصل */}
              <div className="xl:col-span-8 space-y-6">
                <Card
                  className="shadow-lg border-0"
                  bodyStyle={{ padding: "32px" }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <UserOutlined className="text-white text-lg" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">
                        البيانات الأساسية
                      </h3>
                      <p className="text-gray-500 text-sm">
                        الاسم والتواصل والمعلومات الشخصية
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* الاسم الأول */}
                    <Form.Item
                      label={
                        <span className="text-gray-700 font-semibold flex items-center gap-2">
                          <UserOutlined className="text-blue-500" />
                          الاسم الأول *
                        </span>
                      }
                      name="fullName"
                      rules={[
                        { required: true, message: "من فضلك اكتب الاسم الأول" },
                        {
                          validator: (_, v) =>
                            !v || v.trim().length >= 2
                              ? Promise.resolve()
                              : Promise.reject(
                                  new Error("الاسم لا يقل عن حرفين")
                                ),
                        },
                      ]}
                    >
                      <Input
                        placeholder="مثال: علي"
                        className="shadow-sm hover:shadow-md transition-shadow"
                        style={{ height: "48px" }}
                      />
                    </Form.Item>

                    {/* الاسم الأوسط */}
                    <Form.Item
                      label={
                        <span className="text-gray-700 font-semibold flex items-center gap-2">
                          <UserOutlined className="text-blue-500" />
                          الاسم الأوسط *
                        </span>
                      }
                      name="secondName"
                      rules={[
                        {
                          required: true,
                          message: "من فضلك اكتب الاسم الأوسط",
                        },
                        {
                          validator: (_, v) =>
                            !v || v.trim().length >= 2
                              ? Promise.resolve()
                              : Promise.reject(
                                  new Error("الاسم لا يقل عن حرفين")
                                ),
                        },
                      ]}
                    >
                      <Input
                        placeholder="مثال: محمد"
                        className="shadow-sm hover:shadow-md transition-shadow"
                        style={{ height: "48px" }}
                      />
                    </Form.Item>

                    {/* اسم العائلة */}
                    <Form.Item
                      label={
                        <span className="text-gray-700 font-semibold flex items-center gap-2">
                          <UserOutlined className="text-blue-500" />
                          اسم العائلة *
                        </span>
                      }
                      name="familyName"
                      rules={[
                        {
                          required: true,
                          message: "من فضلك اكتب اسم العائلة",
                        },
                        {
                          validator: (_, v) =>
                            !v || v.trim().length >= 2
                              ? Promise.resolve()
                              : Promise.reject(
                                  new Error("الاسم لا يقل عن حرفين")
                                ),
                        },
                      ]}
                    >
                      <Input
                        placeholder="مثال: الأحمدي"
                        className="shadow-sm hover:shadow-md transition-shadow"
                        style={{ height: "48px" }}
                      />
                    </Form.Item>

                    {/* البريد */}
                    <Form.Item
                      label={
                        <span className="text-gray-700 font-semibold flex items-center gap-2">
                          <MailOutlined className="text-red-500" />
                          البريد الإلكتروني
                        </span>
                      }
                      name="email"
                      rules={[
                        { type: "email", message: "البريد الإلكتروني غير صحيح" },
                      ]}
                    >
                      <Input
                        placeholder="teacher@academy.com"
                        className="shadow-sm hover:shadow-md transition-shadow"
                        style={{ height: "48px" }}
                      />
                    </Form.Item>

                    {/* الجنس */}
                    <Form.Item
                      name="gender"
                      label={
                        <span className="text-gray-700 font-semibold flex items-center gap-2">
                          <IdcardOutlined className="text-teal-600" />
                          الجنس *
                        </span>
                      }
                      rules={[{ required: true, message: "اختر الجنس" }]}
                    >
                      <Select
                        placeholder="اختر الجنس"
                        options={[
                          { label: "ذكر", value: "ذكر" },
                          { label: "أنثى", value: "أنثى" },
                        ]}
                      />
                    </Form.Item>

                    {/* ملاحظات / وصف المحاضر */}
                    <Form.Item
                      name="notes"
                      label="وصف / نبذة عن المحاضر"
                      className="md:col-span-2"
                    >
                      <Input.TextArea
                        rows={4}
                        placeholder="اكتب وصفًا مختصرًا عن المحاضر وخبراته"
                      />
                    </Form.Item>
                  </div>

                  {/* روابط السوشيال */}
                  <Divider className="my-6" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Form.Item
                      name="instagram"
                      label={
                        <span className="text-gray-700 font-semibold flex items-center gap-2">
                          <InstagramOutlined className="text-pink-500" />
                          رابط Instagram
                        </span>
                      }
                    >
                      <Input placeholder="https://instagram.com/username" />
                    </Form.Item>

                    <Form.Item
                      name="facebook"
                      label={
                        <span className="text-gray-700 font-semibold flex items-center gap-2">
                          <FacebookOutlined className="text-blue-600" />
                          رابط Facebook
                        </span>
                      }
                    >
                      <Input placeholder="https://facebook.com/username" />
                    </Form.Item>

                    <Form.Item
                      name="linkedin"
                      label={
                        <span className="text-gray-700 font-semibold flex items-center gap-2">
                          <LinkedinOutlined className="text-sky-700" />
                          رابط LinkedIn
                        </span>
                      }
                    >
                      <Input placeholder="https://www.linkedin.com/in/username" />
                    </Form.Item>

                    <Form.Item
                      name="twitter"
                      label={
                        <span className="text-gray-700 font-semibold flex items-center gap-2">
                          <TwitterOutlined className="text-black" />
                          رابط Twitter / X
                        </span>
                      }
                    >
                      <Input placeholder="https://x.com/username" />
                    </Form.Item>

                    <Form.Item
                      name="youtube"
                      label={
                        <span className="text-gray-700 font-semibold flex items-center gap-2">
                          <YoutubeFilled className="text-red-500" />
                          رابط YouTube
                        </span>
                      }
                    >
                      <Input placeholder="https://youtube.com/@channel" />
                    </Form.Item>

                    <Form.Item
                      name="tiktok"
                      label={
                        <span className="text-gray-700 font-semibold flex items-center gap-2">
                          <TikTokFilled className="text-black" />
                          رابط TikTok
                        </span>
                      }
                    >
                      <Input placeholder="https://www.tiktok.com/@username" />
                    </Form.Item>

                    <Form.Item
                      name="website"
                      label={
                        <span className="text-gray-700 font-semibold flex items-center gap-2">
                          <Globe className="text-emerald-600" />
                          الموقع الإلكتروني
                        </span>
                      }
                      className="md:col-span-2"
                    >
                      <Input placeholder="https://example.com" />
                    </Form.Item>
                  </div>
                </Card>
              </div>

              {/* اليسار: الصورة والمعاينة */}
              <div className="xl:col-span-4 space-y-6">
                <Card
                  className="shadow-lg border-0 sticky top-4"
                  bodyStyle={{ padding: "32px" }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-orange-500 rounded-xl flex items-center justify-center">
                      <CameraOutlined className="text-white text-lg" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">
                        الصورة الشخصية
                      </h3>
                      <p className="text-gray-500 text-sm">تعديل صورة المحاضر</p>
                    </div>
                  </div>

                  {!photoPreview ? (
                    <Dragger
                      multiple={false}
                      maxCount={1}
                      showUploadList={false}
                      beforeUpload={(file) => {
                        if (file.size > 2 * 1024 * 1024) {
                          message.error(
                            "حجم الصورة يجب أن يكون أقل من 2 ميجابايت"
                          );
                          return false;
                        }
                        setPhotoFile(file);

                        const reader = new FileReader();
                        reader.onload = (e) =>
                          setPhotoPreview(e.target?.result || null);
                        reader.readAsDataURL(file);

                        return false;
                      }}
                      className="border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors rounded-xl"
                      style={{
                        background:
                          "linear-gradient(135deg, #F8FAFC 0%, #EDF2F7 100%)",
                      }}
                    >
                      <p className="ant-upload-drag-icon">
                        <InboxOutlined
                          style={{ fontSize: "48px", color: PALETTE.primary }}
                        />
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
                          alt="teacher preview"
                          className="w-32 h-32 rounded-full object-cover shadow-lg border-4 border-white"
                        />
                        <Button
                          danger
                          type="primary"
                          icon={<DeleteOutlined />}
                          className="absolute -top-2 -right-2 rounded-full w-8 h-8 flex items-center justify-center p-0"
                          onClick={() => {
                            setPhotoPreview(null);
                            setPhotoFile(null);
                          }}
                        />
                      </div>
                      <p className="mt-4 text-gray-600">
                        {photoFile ? "سيتم تحديث الصورة" : "الصورة الحالية"}
                      </p>
                      <Button
                        className="mt-2"
                        onClick={() => {
                          setPhotoPreview(null);
                          setPhotoFile(null);
                        }}
                      >
                        {photoFile ? "إلغاء التحديث" : "إزالة الصورة"}
                      </Button>
                    </div>
                  )}

                  <Divider className="my-6" />

                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl">
                    <h4 className="font-semibold text-gray-800 mb-2">
                      معاينة الملف الشخصي
                    </h4>
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
                          {form.getFieldValue("fullName") || "اسم المحاضر"}
                        </p>
                        <p className="text-sm text-gray-500">
                          {form.getFieldValue("email") || "البريد الإلكتروني"}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* الأزرار */}
              <div className="xl:col-span-12 border-t border-gray-200 pt-6">
                <div className="flex justify-end gap-4">
                  <Button
                    onClick={resetForm}
                    className="px-8 py-3 text-gray-700 border border-gray-300 rounded-xl hover:border-gray-400 transition-all"
                    style={{ height: "48px" }}
                  >
                    إعادة ضبط
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={edit_teacher_loading}
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
                    style={{ height: "48px" }}
                    icon={<EditOutlined />}
                  >
                    {edit_teacher_loading
                      ? "جاري التعديل..."
                      : "حفظ التعديلات"}
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