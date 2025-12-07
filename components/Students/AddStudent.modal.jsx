// "use client";

// import React, { useMemo, useState } from "react";
// import {
//   Modal,
//   Form,
//   Input,
//   Select,
//   Upload,
//   Button,
//   ConfigProvider,
//   message,
//   Card,
//   Tooltip,
//   Divider,
// } from "antd";
// import "@ant-design/v5-patch-for-react-19";
// import {
//   PlusOutlined,
//   InboxOutlined,
//   UserOutlined,
//   PhoneOutlined,
//   MailOutlined,
//   EyeOutlined,
//   EyeInvisibleOutlined,
//   KeyOutlined,
//   ReloadOutlined,
//   CameraOutlined,
//   DeleteOutlined,
//   InfoCircleOutlined,
//   CheckCircleOutlined,
//   IdcardOutlined,
//   TeamOutlined,
//   InstagramOutlined,
//   FacebookOutlined,
//   LinkedinOutlined,
// } from "@ant-design/icons";
// import PhoneInput from "react-phone-number-input";
// import "react-phone-number-input/style.css";
// import { useDispatch, useSelector } from "react-redux";

// const { Dragger } = Upload;

// const PALETTE = {
//   primary: "#0F7490",
//   secondary: "#C9AE6C",
//   accent: "#8B5CF6",
//   background: "#F8FAFC",
//   text: "#1E293B",
//   success: "#10B981",
//   warning: "#F59E0B",
//   error: "#EF4444",
// };

// const toISO = (d) =>
//   d ? (typeof d.toDate === "function" ? d.toDate().toISOString() : d.toISOString?.()) : null;

// const initials = (name = "") =>
//   name
//     .trim()
//     .split(/\s+/)
//     .slice(0, 2)
//     .map((p) => p[0]?.toUpperCase() || "")
//     .join("");

// // مولّد كلمة مرور قوية
// const generatePassword = () => {
//   const length = 12;
//   const charset =
//     "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
//   let password = "";
//   password += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[Math.floor(Math.random() * 26)];
//   password += "abcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 26)];
//   password += "0123456789"[Math.floor(Math.random() * 10)];
//   password += "!@#$%^&*"[Math.floor(Math.random() * 8)];
//   for (let i = 4; i < length; i++) {
//     password += charset.charAt(Math.floor(Math.random() * charset.length));
//   }
//   return password.split("").sort(() => 0.5 - Math.random()).join("");
// };

// function AddStudentModal({
//   open,
//   onCancel,
//   onSubmit,
//   gradeOptions = [],
//   classOptions = [],
//   subjectOptions = [],
//   defaults = {},
// }) {
//   const [form] = Form.useForm();
//   const [loading, setLoading] = useState(false);
//   const [photoPreview, setPhotoPreview] = useState(null);
//   const [showPassword, setShowPassword] = useState(false);
//   const [phone, setPhone] = useState("");
//   const dispatch = useDispatch();
//   const {add_teacher_loading } = useSelector(state => state?.teachers)

//   // راقب نوع الحساب لإظهار روابط السوشيال عند "محاضر"
//   const role = Form.useWatch("role", form);

//   const normalizedSubjects = useMemo(
//     () =>
//       (subjectOptions || []).map((s) => ({
//         label: s.code ? `${s.name} (${s.code})` : s.name,
//         value: String(s.id ?? s.value ?? s.code ?? s.name),
//       })),
//     [subjectOptions]
//   );

//   const handleGeneratePassword = () => {
//     const newPassword = generatePassword();
//     form.setFieldsValue({ password: newPassword });
//     message.success("تم توليد كلمة مرور قوية جديدة");
//   };

//   const handleFinish = async (values) => {
//     const formData = new FormData();
//     formData.append("name", values?.fullName?.trim());
//     formData.append("email" , values?.email)
//     formData.append("gender" , values?.gender)
//     formData.append("description" , values?.notes)
//     formData.append("image" ,)
//     const payload = {
//       name: values.fullName?.trim(),
//       secondName: values.secondName?.trim() || "",
//       familyName: values.familyName?.trim() || "",
//       email: values.email?.trim() || "",
//       phone: phone,
//       password: values.password,
//       gender: values.gender, // ذكر / أنثى
//       role: values.role, // student | lecturer
//       // روابط السوشيال تُحفظ فقط إن كان محاضر
//       instagram: values.role === "lecturer" ? values.instagram?.trim() || "" : "",
//       facebook: values.role === "lecturer" ? values.facebook?.trim() || "" : "",
//       linkedin: values.role === "lecturer" ? values.linkedin?.trim() || "" : "",
//       grade: values.grade,
//       status: values.status,
//       joinDate: (toISO(values.enrollmentDate) || "").slice(0, 10),
//       studentId: values.studentId,
//       classSection: values.classSection,
//       subjects: values.subjects || [],
//       dob: toISO(values.dob),
//       transport: values.transport,
//       guardianName: values.guardianName,
//       guardianPhone: values.guardianPhone,
//       guardianEmail: values.guardianEmail,
//       emergencyName: values.emergencyName,
//       emergencyPhone: values.emergencyPhone,
//       address: values.address,
//       notes: values.notes,
//       photo: photoPreview,
//       sendInvite: values.sendInvite ?? false,
//     };

//     try {
//       setLoading(true);
//       await (typeof onSubmit === "function" ? onSubmit(payload) : Promise.resolve());
//       message.success({
//         content: "تم إضافة المتدرب بنجاح!",
//         icon: <CheckCircleOutlined style={{ color: PALETTE.success }} />,
//       });
//       form.resetFields();
//       setPhotoPreview(null);
//       setPhone("");
//       onCancel?.();
//     } catch (e) {
//       message.error("حدث خطأ أثناء الإضافة. حاول مرة أخرى.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const resetForm = () => {
//     form.resetFields();
//     setPhotoPreview(null);
//     setPhone("");
//     form.setFieldsValue({ password: generatePassword() });
//   };

//   const handleCancel = () => {
//     resetForm();
//     onCancel?.();
//   };

//   // مُتحقّق URL ديناميكي إذا كان الدور "محاضر"
//   const requiredUrlIfLecturer = (label) => ({
//     validator: (_, value) => {
//       if (role !== "lecturer") return Promise.resolve();
//       if (!value) return Promise.reject(new Error(`رابط ${label} مطلوب`));
//       try {
//         // يتحقق من صحة الرابط
//         new URL(value);
//         return Promise.resolve();
//       } catch {
//         return Promise.reject(new Error(`رابط ${label} غير صالح`));
//       }
//     },
//   });

//   return (
//     <ConfigProvider
//       direction="rtl"
//       theme={{
//         token: {
//           colorPrimary: PALETTE.primary,
//           borderRadius: 12,
//           colorText: PALETTE.text,
//           controlHeight: 48,
//           fontSize: 14,
//           colorBgContainer: "#FFFFFF",
//           boxShadow:
//             "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
//         },
//         components: {
//           Modal: { contentBg: PALETTE.background },
//           Card: { borderRadius: 16 },
//           Input: { borderRadius: 10 },
//           Select: { borderRadius: 10 },
//           Button: { borderRadius: 10 },
//         },
//       }}
//     >
//       <Modal
//         title={null}
//         open={open}
//         onCancel={handleCancel}
//         footer={null}
//         width="95%"
//         style={{ maxWidth: "1400px", top: 20 }}
//         bodyStyle={{ padding: 0 }}
//         className="student-modal"
//       >
//         <div
//           className="min-h-[600px]"
//           style={{
//             background: `linear-gradient(135deg, ${PALETTE.background} 0%, #EDF2F7 100%)`,
//           }}
//         >
//           {/* Header */}
//           <div
//             className="p-8 text-white relative overflow-hidden"
//             style={{
//               background: `linear-gradient(135deg, ${PALETTE.primary} 0%, ${PALETTE.accent} 100%)`,
//               borderRadius: "12px 12px 0 0",
//             }}
//           >
//             <div className="absolute inset-0 opacity-10">
//               <div className="absolute -top-10 -right-10 w-32 h-32 bg-white rounded-full" />
//               <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white rounded-full opacity-50" />
//             </div>

//             <div className="relative flex items-center gap-4">
//               <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
//                 <PlusOutlined className="text-white text-2xl" />
//               </div>
//               <div>
//                 <h2 className="text-3xl font-bold mb-2">إضافة متدرب جديد</h2>
//                 <p className="text-white/80 text-lg">أنشئ ملفًا شخصيًا شاملاً</p>
//               </div>
//             </div>
//           </div>

//           <div className="p-8">
//             <Form
//               form={form}
//               layout="vertical"
//               onFinish={handleFinish}
//               initialValues={{
//                 fullName: "",
//                 secondName: "",
//                 familyName: "",
//                 studentId: "",
//                 email: "",
//                 password: generatePassword(),
//                 gender: "ذكر", // جديد
//                 role: "student", // جديد: student | lecturer
//                 status: "approved",
//                 grade: defaults.gradeValue,
//                 classSection: defaults.classValue,
//                 subjects: [],
//                 enrollmentDate: null,
//                 dob: null,
//                 transport: "None",
//                 guardianName: "",
//                 guardianPhone: "",
//                 guardianEmail: "",
//                 emergencyName: "",
//                 emergencyPhone: "",
//                 address: "",
//                 notes: "",
//                 sendInvite: false,
//                 instagram: "",
//                 facebook: "",
//                 linkedin: "",
//               }}
//               className="grid grid-cols-1 xl:grid-cols-12 gap-8"
//             >
//               {/* اليمين: المعلومات الأساسية */}
//               <div className="xl:col-span-8 space-y-6">
//                 <Card className="shadow-lg border-0" bodyStyle={{ padding: "32px" }}>
//                   <div className="flex items-center gap-3 mb-6">
//                     <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
//                       <UserOutlined className="text-white text-lg" />
//                     </div>
//                     <div>
//                       <h3 className="text-xl font-bold text-gray-800">المعلومات الأساسية</h3>
//                       <p className="text-gray-500 text-sm">البيانات الشخصية والتواصل</p>
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     {/* الاسم الأول */}
//                     <Form.Item
//                       label={
//                         <span className="text-gray-700 font-semibold flex items-center gap-2">
//                           <UserOutlined className="text-blue-500" />
//                           الاسم الأول *
//                         </span>
//                       }
//                       name="fullName"
//                       rules={[
//                         { required: true, message: "من فضلك اكتب الاسم الأول" },
//                         {
//                           validator: (_, v) =>
//                             !v || v.trim().length >= 2
//                               ? Promise.resolve()
//                               : Promise.reject(new Error("الاسم لا يقل عن حرفين")),
//                         },
//                       ]}
//                     >
//                       <Input
//                         placeholder="مثال: علي"
//                         className="shadow-sm hover:shadow-md transition-shadow"
//                         style={{ height: "48px" }}
//                       />
//                     </Form.Item>

//                     {/* الاسم الأوسط */}
//                     <Form.Item
//                       label={
//                         <span className="text-gray-700 font-semibold flex items-center gap-2">
//                           <UserOutlined className="text-blue-500" />
//                           الاسم الأوسط *
//                         </span>
//                       }
//                       name="secondName"
//                       rules={[
//                         { required: true, message: "من فضلك اكتب الاسم الأوسط" },
//                         {
//                           validator: (_, v) =>
//                             !v || v.trim().length >= 2
//                               ? Promise.resolve()
//                               : Promise.reject(new Error("الاسم لا يقل عن حرفين")),
//                         },
//                       ]}
//                     >
//                       <Input
//                         placeholder="مثال: محمد"
//                         className="shadow-sm hover:shadow-md transition-shadow"
//                         style={{ height: "48px" }}
//                       />
//                     </Form.Item>

//                     {/* اسم العائلة */}
//                     <Form.Item
//                       label={
//                         <span className="text-gray-700 font-semibold flex items-center gap-2">
//                           <UserOutlined className="text-blue-500" />
//                           اسم العائلة *
//                         </span>
//                       }
//                       name="familyName"
//                       rules={[
//                         { required: true, message: "من فضلك اكتب اسم العائلة" },
//                         {
//                           validator: (_, v) =>
//                             !v || v.trim().length >= 2
//                               ? Promise.resolve()
//                               : Promise.reject(new Error("الاسم لا يقل عن حرفين")),
//                         },
//                       ]}
//                     >
//                       <Input
//                         placeholder="مثال: الأحمدي"
//                         className="shadow-sm hover:shadow-md transition-shadow"
//                         style={{ height: "48px" }}
//                       />
//                     </Form.Item>

//                     {/* البريد */}
//                     <Form.Item
//                       label={
//                         <span className="text-gray-700 font-semibold flex items-center gap-2">
//                           <MailOutlined className="text-red-500" />
//                           البريد الإلكتروني
//                         </span>
//                       }
//                       name="email"
//                       rules={[{ type: "email", message: "البريد الإلكتروني غير صحيح" }]}
//                     >
//                       <Input
//                         placeholder="student@school.edu"
//                         className="shadow-sm hover:shadow-md transition-shadow"
//                         style={{ height: "48px" }}
//                       />
//                     </Form.Item>

//                     {/* الهاتف */}
//                     <Form.Item
//                       label={
//                         <span className="text-gray-700 font-semibold flex items-center gap-2">
//                           <PhoneOutlined className="text-orange-500" />
//                           رقم الهاتف *
//                         </span>
//                       }
//                       required
//                       style={{ marginBottom: 0 }}
//                     >
//                       <PhoneInput
//                         international
//                         defaultCountry="SA"
//                         value={phone}
//                         onChange={setPhone}
//                         placeholder="رقم الهاتف"
//                         className="w-full !h-[48px] border-2 rounded-lg shadow-sm"
//                       />
//                     </Form.Item>

//                     {/* كلمة المرور */}
//                     <Form.Item
//                       label={
//                         <span className="text-gray-700 font-semibold flex items-center gap-2">
//                           <KeyOutlined className="text-purple-500" />
//                           كلمة المرور *
//                           <Tooltip title="كلمة المرور يجب أن تحتوي على 8 أحرف على الأقل">
//                             <InfoCircleOutlined className="text-gray-400 text-xs" />
//                           </Tooltip>
//                         </span>
//                       }
//                       name="password"
//                       rules={[
//                         { required: true, message: "كلمة المرور مطلوبة" },
//                         { min: 8, message: "كلمة المرور يجب أن تكون 8 أحرف على الأقل" },
//                       ]}
//                     >
//                       <Input
//                         type={showPassword ? "text" : "password"}
//                         placeholder="كلمة مرور قوية"
//                         className="shadow-sm hover:shadow-md transition-shadow"
//                         style={{ height: "48px" }}
//                         suffix={
//                           <div className="flex items-center gap-1">
//                             <Tooltip
//                               title={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
//                             >
//                               <Button
//                                 type="text"
//                                 icon={showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
//                                 onClick={() => setShowPassword(!showPassword)}
//                                 className="text-gray-400 hover:text-gray-600 border-0 shadow-none"
//                               />
//                             </Tooltip>
//                             <Tooltip title="توليد كلمة مرور قوية">
//                               <Button
//                                 type="text"
//                                 icon={<ReloadOutlined />}
//                                 onClick={handleGeneratePassword}
//                                 className="text-gray-400 hover:text-purple-600 border-0 shadow-none"
//                               />
//                             </Tooltip>
//                           </div>
//                         }
//                       />
//                     </Form.Item>

//                     {/* الجنس */}
//                     <Form.Item
//                       name="gender"
//                       label={
//                         <span className="text-gray-700 font-semibold flex items-center gap-2">
//                           <IdcardOutlined className="text-teal-600" />
//                           الجنس *
//                         </span>
//                       }
//                       rules={[{ required: true, message: "اختر الجنس" }]}
//                     >
//                       <Select
//                         placeholder="اختر الجنس"
//                         options={[
//                           { label: "ذكر", value: "ذكر" },
//                           { label: "أنثى", value: "أنثى" },
//                         ]}
//                       />
//                     </Form.Item>

              
//                   </div>

//                   {/* روابط السوشيال (تظهر فقط إذا كان محاضر) */}
//                   {role === "lecturer" && (
//                     <>
//                       <Divider className="my-6" />
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                         <Form.Item
//                           name="instagram"
//                           label={
//                             <span className="text-gray-700 font-semibold flex items-center gap-2">
//                               <InstagramOutlined className="text-pink-500" />
//                               رابط Instagram
//                             </span>
//                           }
//                           rules={[requiredUrlIfLecturer("Instagram")]}
//                           hasFeedback
//                         >
//                           <Input placeholder="https://instagram.com/username" />
//                         </Form.Item>

//                         <Form.Item
//                           name="facebook"
//                           label={
//                             <span className="text-gray-700 font-semibold flex items-center gap-2">
//                               <FacebookOutlined className="text-blue-600" />
//                               رابط Facebook
//                             </span>
//                           }
//                           rules={[requiredUrlIfLecturer("Facebook")]}
//                           hasFeedback
//                         >
//                           <Input placeholder="https://facebook.com/username" />
//                         </Form.Item>

//                         <Form.Item
//                           name="linkedin"
//                           label={
//                             <span className="text-gray-700 font-semibold flex items-center gap-2">
//                               <LinkedinOutlined className="text-sky-700" />
//                               رابط LinkedIn
//                             </span>
//                           }
//                           rules={[requiredUrlIfLecturer("LinkedIn")]}
//                           hasFeedback
//                         >
//                           <Input placeholder="https://www.linkedin.com/in/username" />
//                         </Form.Item>
//                       </div>
//                     </>
//                   )}
//                 </Card>
//               </div>

//               {/* اليسار: الصورة والمعاينة */}
//               <div className="xl:col-span-4 space-y-6">
//                 <Card className="shadow-lg border-0 sticky top-4" bodyStyle={{ padding: "32px" }}>
//                   <div className="flex items-center gap-3 mb-6">
//                     <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-orange-500 rounded-xl flex items-center justify-center">
//                       <CameraOutlined className="text-white text-lg" />
//                     </div>
//                     <div>
//                       <h3 className="text-xl font-bold text-gray-800">الصورة الشخصية</h3>
//                       <p className="text-gray-500 text-sm">إضافة صورة</p>
//                     </div>
//                   </div>

//                   {!photoPreview ? (
//                     <Dragger
//                       multiple={false}
//                       maxCount={1}
//                       showUploadList={false}
//                       beforeUpload={(file) => {
//                         if (file.size > 2 * 1024 * 1024) {
//                           message.error("حجم الصورة يجب أن يكون أقل من 2 ميجابايت");
//                           return false;
//                         }
//                         const reader = new FileReader();
//                         reader.onload = (e) => setPhotoPreview(e.target?.result);
//                         reader.readAsDataURL(file);
//                         return false; // منع الرفع الفعلي
//                       }}
//                       className="border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors rounded-xl"
//                       style={{
//                         background: "linear-gradient(135deg, #F8FAFC 0%, #EDF2F7 100%)",
//                       }}
//                     >
//                       <p className="ant-upload-drag-icon">
//                         <InboxOutlined style={{ fontSize: "48px", color: PALETTE.primary }} />
//                       </p>
//                       <p className="ant-upload-text text-lg font-medium text-gray-700">
//                         انقر أو اسحب صورة هنا للرفع
//                       </p>
//                       <p className="ant-upload-hint text-gray-500">PNG/JPG حتى 2MB</p>
//                     </Dragger>
//                   ) : (
//                     <div className="text-center">
//                       <div className="relative inline-block">
//                         <img
//                           src={photoPreview}
//                           alt="student preview"
//                           className="w-32 h-32 rounded-full object-cover shadow-lg border-4 border-white"
//                         />
//                         <Button
//                           danger
//                           type="primary"
//                           icon={<DeleteOutlined />}
//                           className="absolute -top-2 -right-2 rounded-full w-8 h-8 flex items-center justify-center p-0"
//                           onClick={() => setPhotoPreview(null)}
//                         />
//                       </div>
//                       <p className="mt-4 text-gray-600">تم رفع الصورة بنجاح</p>
//                       <Button className="mt-2" onClick={() => setPhotoPreview(null)}>
//                         تغيير الصورة
//                       </Button>
//                     </div>
//                   )}

//                   <Divider className="my-6" />

//                   <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl">
//                     <h4 className="font-semibold text-gray-800 mb-2">معاينة الملف الشخصي</h4>
//                     <div className="flex items-center gap-3">
//                       {photoPreview ? (
//                         <img
//                           src={photoPreview}
//                           alt="preview"
//                           className="w-12 h-12 rounded-full object-cover"
//                         />
//                       ) : (
//                         <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
//                           {initials(form.getFieldValue("fullName") || "ST")}
//                         </div>
//                       )}
//                       <div>
//                         <p className="font-medium text-gray-800">
//                           {form.getFieldValue("fullName") || "اسم المتدرب"}
//                         </p>
//                         <p className="text-sm text-gray-500">
//                           {form.getFieldValue("studentId") || "رقم المتدرب"}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 </Card>
//               </div>

//               {/* الأزرار */}
//               <div className="xl:col-span-12 border-t border-gray-200 pt-6">
//                 <div className="flex justify-end gap-4">
//                   <Button
//                     onClick={resetForm}
//                     className="px-8 py-3 text-gray-700 border border-gray-300 rounded-xl hover:border-gray-400 transition-all"
//                     style={{ height: "48px" }}
//                   >
//                     إعادة ضبط
//                   </Button>
//                   <Button
//                     type="primary"
//                     htmltype="submit"
//                     loading={loading}
//                     className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
//                     style={{ height: "48px" }}
//                     icon={<PlusOutlined />}
//                   >
//                     {loading ? "جاري الإضافة..." : "إضافة"}
//                   </Button>
//                 </div>
//               </div>
//             </Form>
//           </div>
//         </div>
//       </Modal>
//     </ConfigProvider>
//   );
// }

// export default AddStudentModal;

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
// import "@ant-design/v5-patch-for-react-19";
import {
  PlusOutlined,
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
import { handleAddTeacher, handleGetAllTeachers } from "../../lib/features/teacherSlice";
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

// مولّد كلمة مرور قوية
const generatePassword = () => {
  const length = 12;
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
  let password = "";
  password += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[Math.floor(Math.random() * 26)];
  password += "abcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 26)];
  password += "0123456789"[Math.floor(Math.random() * 10)];
  password += "!@#$%^&*"[Math.floor(Math.random() * 8)];
  for (let i = 4; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password
    .split("")
    .sort(() => 0.5 - Math.random())
    .join("");
};

function AddStudentModal({
  open,
  onCancel,
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
  const { add_teacher_loading } = useSelector(
    (state) => state?.teachers || {}
  );

  // إرسال نفس الـ form-data الموجودة في Postman
  const handleFinish = async (values) => {
    // دمج الاسم الأول + الأوسط + العائلة في حقل واحد name
    const fullName = [
      values.fullName?.trim(),
      values.secondName?.trim(),
      values.familyName?.trim(),
    ]
      .filter(Boolean)
      .join(" ");

    // تحويل الجنس لقيم backend (male/female) مثل Postman
    let gender = values.gender;
    if (gender === "ذكر") gender = "male";
    if (gender === "أنثى") gender = "female";

    const formData = new FormData();
    formData.append("name", fullName); // name
    formData.append("email", values.email?.trim() || ""); // email
    formData.append("gender", gender || ""); // gender
    formData.append("image", photoFile); // image (File)
    formData.append("description", values.notes?.trim() || ""); // description

    // الحقول الإضافية من Postman (كلها Text)
    formData.append("facebook", values.facebook?.trim() || "");
    formData.append("twitter", values.twitter?.trim() || "");
    formData.append("instagram", values.instagram?.trim() || "");
    formData.append("linkedin", values.linkedin?.trim() || "");
    formData.append("youtube", values.youtube?.trim() || "");
    formData.append("tiktok", values.tiktok?.trim() || "");
    formData.append("website", values.website?.trim() || "");

    try {

      const res = await dispatch(
        handleAddTeacher({ body: formData })
      ).unwrap();

      console.log(res);

      if (res?.data?.status === "success") {
        toast.success(res?.data?.message || "تم إضافة المحاضر بنجاح");
        dispatch(handleGetAllTeachers())
        resetForm();
        onCancel?.();
      } else {
        toast.error(res?.data?.message || "حدث خطأ أثناء الإضافة");
      }
    } catch (e) {
      toast.error("حدث خطأ أثناء الإضافة. حاول مرة أخرى.");
    }
  };

  const resetForm = () => {
    form.resetFields();
    setPhotoPreview(null);
    setPhotoFile(null);
    setPhone("");
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
                <PlusOutlined className="text-white text-2xl" />
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-2">إضافة محاضر جديد</h2>
                <p className="text-white/80 text-lg">
                  أنشئ ملفًا شخصيًا شاملاً للمحاضر
                </p>
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
                secondName: "",
                familyName: "",
                email: "",
                password: generatePassword(),
                gender: "ذكر",
                notes: "",
                instagram: "",
                facebook: "",
                linkedin: "",
                twitter: "",
                youtube: "",
                tiktok: "",
                website: "",
              }}
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
                        الاسم والتواصل وكلمة المرور
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

                    {/* الهاتف */}
                    {/* <Form.Item
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
                        onChange={(v) => setPhone(v || "")}
                        placeholder="رقم الهاتف"
                        className="w-full !h-[48px] border-2 rounded-lg shadow-sm"
                      />
                    </Form.Item> */}

                    {/* كلمة المرور (للنظام فقط – لا تُرسل للـ API الآن) */}
                    {/* <Form.Item
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
                        {
                          min: 8,
                          message:
                            "كلمة المرور يجب أن تكون 8 أحرف على الأقل",
                        },
                      ]}
                    >
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="كلمة مرور قوية"
                        className="shadow-sm hover:shadow-md transition-shadow"
                        style={{ height: "48px" }}
                        suffix={
                          <div className="flex items-center gap-1">
                            <Tooltip
                              title={
                                showPassword
                                  ? "إخفاء كلمة المرور"
                                  : "إظهار كلمة المرور"
                              }
                            >
                              <Button
                                type="text"
                                icon={
                                  showPassword ? (
                                    <EyeInvisibleOutlined />
                                  ) : (
                                    <EyeOutlined />
                                  )
                                }
                                onClick={() =>
                                  setShowPassword((prev) => !prev)
                                }
                                className="text-gray-400 hover:text-gray-600 border-0 shadow-none"
                              />
                            </Tooltip>
                            <Tooltip title="توليد كلمة مرور قوية">
                              <Button
                                type="text"
                                icon={<ReloadOutlined />}
                                onClick={() => {
                                  const pwd = generatePassword();
                                  form.setFieldsValue({ password: pwd });
                                  message.success(
                                    "تم توليد كلمة مرور قوية جديدة"
                                  );
                                }}
                                className="text-gray-400 hover:text-purple-600 border-0 shadow-none"
                              />
                            </Tooltip>
                          </div>
                        }
                      />
                    </Form.Item> */}

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

                    {/* ملاحظات / وصف المحاضر -> description */}
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

                  {/* روابط السوشيال – نفس الحقول الموجودة في Postman */}
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
                      <p className="text-gray-500 text-sm">إضافة صورة المحاضر</p>
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

                        return false; // لا ترفع تلقائياً
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
                        تم رفع الصورة بنجاح
                      </p>
                      <Button
                        className="mt-2"
                        onClick={() => {
                          setPhotoPreview(null);
                          setPhotoFile(null);
                        }}
                      >
                        تغيير الصورة
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
                    loading={add_teacher_loading}
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
                    style={{ height: "48px" }}
                    icon={<PlusOutlined />}
                  >
                    {add_teacher_loading
                      ? "جاري الإضافة..."
                      : "إضافة"}
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
