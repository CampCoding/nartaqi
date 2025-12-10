// import {
//   Col,
//   DatePicker,
//   Badge,
//   Form,
//   Input,
//   InputNumber,
//   Row,
//   Select,
//   Upload,
//   Button,
//   message,
//   TimePicker,
//   Switch,
// } from "antd";
// import React, { useEffect, useState } from "react";
// import {
//   BookOutlined,
//   FileTextOutlined,
//   InboxOutlined,
//   CalendarOutlined,
//   UserOutlined,
//   DollarOutlined,
//   TeamOutlined,
//   FolderOutlined,
//   SettingOutlined,
//   ClockCircleOutlined,
// } from "@ant-design/icons";
// import dayjs from "dayjs";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   handleGetAllCoursesCategories,
//   handleGetCategoryParts,
// } from "../../lib/features/categoriesSlice";
// import {
//   handleAddBaiskRound,
//   handleGetSourceRound,
// } from "../../lib/features/roundsSlice";
// import { handleGetAllTeachers } from "../../lib/features/teacherSlice";
// import { toast } from "react-toastify";
// import { useRouter } from "next/navigation";

// const { Dragger } = Upload;
// const { TextArea } = Input;
// const { RangePicker } = DatePicker;

// // 🔹 Upload props for course book (books, PDFs, etc.)
// const uploadProps = {
//   name: "file",
//   multiple: true,
//   action: "https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload",
//   onChange(info) {
//     const { status } = info.file;
//     if (status !== "uploading") {
//       console.log("Book upload:", info.file, info.fileList);
//     }
//     if (status === "done") {
//       message.success(`${info.file.name} تم رفع الملف بنجاح`);
//     } else if (status === "error") {
//       message.error(`${info.file.name} فشل في رفع الملف`);
//     }
//   },
//   onDrop(e) {
//     console.log("Dropped files", e.dataTransfer.files);
//   },
// };

// // لتحويل event الخاص بالرفع إلى fileList داخل الـ Form
// const normFile = (e) => {
//   if (Array.isArray(e)) return e;
//   return e?.fileList || [];
// };

// // 🔹 Custom beforeUpload function to prevent auto-upload
// const customBeforeUpload = (file) => {
//   return false; // Prevent auto-upload
// };

// export default function AddCourseSourceBasicInfo({
//   fileList,
//   setFileList,
//   availableSections,
//   selectedCategory,
//   setSelectedCategory,
//   all_categories,
//   beforeUpload = customBeforeUpload,
//   setImagePreview,
//   rowData,
//   setRowData,
//   goToNextStep,
//   setRoundId,
//   goToPrevStep,
//   currentStep,
//   id
// }) {
//   const [form] = Form.useForm();
//   const dispatch = useDispatch();
//   const { all_courses_categories_list, get_categories_parts_list  , source_round_loading , source_round_list} =
//     useSelector((state) => state?.categories);
//   const { add_round_loading } = useSelector((state) => state?.rounds);

//   const [categoriesOptions, setCategoriesOptions] = useState([]);
//   const [categoriesPartOptions, setCategoriesPartOptions] = useState([]);
//   const [selectedOption, setSelectedOption] = useState(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const { teachers_loading, teachers_list } = useSelector(
//     (state) => state?.teachers
//   );
//   const [teacherOptions, setTeacherOptions] = useState([]);
//   const router = useRouter();

//   /* ====================== Load categories & parts ====================== */
//   useEffect(() => {
//     dispatch(handleGetAllTeachers());
//   }, [dispatch]);

//   useEffect(() => {
//     setTeacherOptions(
//       teachers_list?.data?.message?.map((item) => ({
//         label: item?.name,
//         value: item?.id,
//       }))
//     );
//   }, [teachers_list]);

//   useEffect(() => {
//     dispatch(handleGetAllCoursesCategories({}));
//   }, [dispatch]);

//   useEffect(() => {
//     setCategoriesOptions(
//       all_courses_categories_list?.data?.message?.data?.map((item) => ({
//         label: item?.name,
//         value: item?.id,
//       })) || []
//     );
//   }, [all_courses_categories_list]);

//   useEffect(() => {
//     console.log(selectedCategory)
//     if (!selectedCategory) return;
//     const data_send = {
//       course_category_id: selectedCategory,
//     };
//     dispatch(handleGetCategoryParts({ body: data_send }));
//   }, [selectedCategory, dispatch]);

//   useEffect(() => {
//     setCategoriesPartOptions(
//       get_categories_parts_list?.data?.message
//         ?.filter(
//           (item) =>
//             Number(item?.course_category_id) === Number(selectedCategory)
//         )
//         ?.map((part) => ({
//           label: part?.name,
//           value: part?.id,
//         })) || []
//     );
//   }, [get_categories_parts_list, selectedCategory]);

//   /* ====================== Handle file changes ====================== */

//   const handleFileChange = ({ fileList: newFileList }) => {
//     setFileList(newFileList);

//     // Set image preview if there's a file
//     if (newFileList.length > 0) {
//       const file = newFileList[0];
//       if (file.originFileObj) {
//         const previewUrl = URL.createObjectURL(file.originFileObj);
//         setImagePreview(previewUrl);
//       } else if (file.url) {
//         setImagePreview(file.url);
//       }
//     } else {
//       setImagePreview(null);
//     }
//   };

//   const handleRemoveFile = () => {
//     setFileList([]);
//     setImagePreview(null);
//   };

//   /* ====================== Prefill when editing ====================== */

//   useEffect(() => {
//     if (!rowData) return;

//     const formValues = {
//       name: rowData.name,
//       price: rowData.price,
//       category: rowData.course_category_id || rowData.category_id,
//       section: rowData.category_part_id,
//       description: rowData.description,
//       genderPolicy: rowData.gender,
//       capacity: rowData.capacity,
//       instructor:
//         rowData.instructor_ids ||
//         (rowData.teacher_id ? [rowData.teacher_id] : []),
//       free: rowData.free || false,
//       active: rowData.active || true,
//       goal: rowData.goal || "",
//     };

//     // Handle date range
//     if (rowData.start_date && rowData.end_date) {
//       formValues.availableRange = [
//         dayjs(rowData.start_date),
//         dayjs(rowData.end_date),
//       ];
//     }

//     // Handle time - safely check if time exists and is valid
//     if (rowData.time || rowData.duration_time || rowData.time_show) {
//       const timeValue =
//         rowData.time || rowData.duration_time || rowData.time_show;
//       const parsedTime = dayjs(timeValue, "HH:mm:ss");
//       if (parsedTime.isValid()) {
//         formValues.time = parsedTime;
//       }
//     }

//     form.setFieldsValue(formValues);

//     // Prefill الصورة داخل Upload + المعاينة
//     if (rowData?.image_url && (!fileList || fileList.length === 0)) {
//       const fakeFile = {
//         uid: "-1",
//         name: "course-cover",
//         status: "done",
//         url: rowData.image_url,
//       };
//       setFileList([fakeFile]);
//       setImagePreview(rowData.image_url);
//     }
//   }, [rowData, form, fileList, setFileList, setImagePreview]);

//   /* ====================== Validation Functions ====================== */

//   const validateFormBeforeSubmit = (values) => {
//     const errors = [];

//     // Check required fields
//     if (!values.name?.trim()) errors.push("اسم الدورة");
//     if (!values.price && values.price !== 0) errors.push("السعر");
//     if (!values.category) errors.push("الفئة");
//     if (!values.section) errors.push("القسم");
//     if (!values.description?.trim()) errors.push("وصف الدورة");
//     if (!values.genderPolicy) errors.push("سياسة النوع");
//     if (!values.capacity) errors.push("السعة القصوى");
//     if (!values.instructor || values.instructor.length === 0)
//       errors.push("المدربين");
//     if (!values.availableRange || values.availableRange.length !== 2)
//       errors.push("فترة إتاحة الدورة");
//     if (!values.goal?.trim()) errors.push("الهدف");

//     // Check image upload
//     if (!fileList || fileList.length === 0) {
//       errors.push("صورة الدورة");
//     }

//     return errors;
//   };

//   /* ====================== Handle Submit (normalize data) ====================== */

//   // async function handleSubmit(values) {
//   //   try {

//   //     // 🔹 Validate all required fields before submission
//   //     const validationErrors = validateFormBeforeSubmit(values);

//   //     if (validationErrors.length > 0) {
//   //       message.error(`الحقول التالية مطلوبة: ${validationErrors.join("، ")}`);
//   //       setIsSubmitting(false);
//   //       return;
//   //     }

//   //     // Check if image file is properly uploaded
//   //     if (!fileList || fileList.length === 0) {
//   //       message.error("يجب رفع صورة للدورة");
//   //       setIsSubmitting(false);
//   //       return;
//   //     }

//   //     // Safely handle date range
//   //     const [start, end] = values.availableRange || [null, null];

//   //     // Safely handle time formatting
//   //     const timeString =
//   //       values.time && values.time.isValid()
//   //         ? values.time.format("HH:mm:ss")
//   //         : null;

//   //     // Handle file uploads safely
//   //     const courseBookFiles = (values.courseBook || [])
//   //       .map((f) => f.originFileObj || f)
//   //       .filter(Boolean);

//   //     const extraPdfFile =
//   //       values.extraPdf && values.extraPdf[0]
//   //         ? values.extraPdf[0].originFileObj || values.extraPdf[0]
//   //         : null;

//   //     // 🔹 FIXED: Better image file handling
//   //     let imageFile = null;
//   //     if (fileList && fileList.length > 0) {
//   //       const file = fileList[0];
//   //       console.log("File object:", file);

//   //       // Check different possible file properties
//   //       imageFile = file.originFileObj || file.response || file;

//   //       // If it's a fake file from rowData, we might not have the actual file
//   //       if (file.uid === "-1" && file.url && !file.originFileObj) {
//   //         console.log("This is a preview file from existing data");
//   //         imageFile = null;
//   //       }
//   //     }

//   //     if (!imageFile) {
//   //       message.error("يجب رفع صورة صالحة للدورة");
//   //       setIsSubmitting(false);
//   //       return;
//   //     }
//   //     const formData = new FormData();
//   //     formData.append("name", values?.name?.trim());
//   //     formData.append("description", values?.description?.trim());
//   //     formData.append("price", values?.price);

//   //     if (start) {
//   //       formData.append("start_date", dayjs(start).format("YYYY-MM-DD"));
//   //     }
//   //     if (end) {
//   //       formData.append("end_date", dayjs(end).format("YYYY-MM-DD"));
//   //     }

//   //     formData.append("gender", values.genderPolicy || "both");
//   //     formData.append("for", "Beginners");
//   //     formData.append("goal", values?.goal?.trim());
//   //     formData.append("course_category_id", selectedCategory);
//   //     formData.append("category_part_id", selectedOption);
//   //     formData.append("source", 1);
//   //     formData.append("capacity", values?.capacity);

//   //     // if (timeString);
//   //    formData.append("time_show", timeString || "")
//   //      formData.append("round_book", courseBookFiles[0] || null)
//   //     formData.append("teacher_id", values?.instructor?.join(","));

//   //     formData.append("round_road_map_book", extraPdfFile || null)

//   //     formData.append("free", values?.free ? 1 : 0);
//   //     formData.append("active", values?.active ? 1 : 0);

//   //     // Append image file
//   //     if (imageFile) {
//   //       formData.append("image", imageFile);
//   //     }

//   //     dispatch(handleAddBaiskRound({ body: formData })).unwrap()
//   //     .then(res => {
//   //       if(res?.data?.status == "success") {
//   //         console.log(res?.data);
//   //         setRoundId(res?.data?.message?.round_id)
//   //         // router.push(`/round_content?id=${res?.data?.message?.round_id}`)
//   //         toast.success(res?.data?.message?.message);
//   //         dispatch(handleGetSourceRound())
//   //       }else {
//   //         toast.error(res?.data?.message)
//   //       }
//   //     })
//   //   } catch (error) {
//   //     console.error("Submission error:", error);
//   //     toast.error({ content: "فشل في إضافة الدورة", key: "save" });
//   //     if (error.message) {
//   //       toast.error(`خطأ: ${error.message}`);
//   //     }
//   //   } finally {
//   //     setIsSubmitting(false);
//   //   }
//   // }

//   async function handleSubmit(values) {
//     try {
//       setIsSubmitting(true);

//       // 🔹 Validate all required fields before submission
//       const validationErrors = validateFormBeforeSubmit(values);

//       if (validationErrors.length > 0) {
//         message.error(`الحقول التالية مطلوبة: ${validationErrors.join("، ")}`);
//         setIsSubmitting(false);
//         return;
//       }

//       // Check if image file is properly uploaded
//       if (!fileList || fileList.length === 0) {
//         message.error("يجب رفع صورة للدورة");
//         setIsSubmitting(false);
//         return;
//       }

//       // Safely handle date range
//       const [start, end] = values.availableRange || [null, null];

//       // Safely handle time formatting
//       const timeString =
//         values.time && values.time.isValid()
//           ? values.time.format("HH:mm:ss")
//           : null;

//       // Handle file uploads safely
//       const courseBookFiles = (values.courseBook || [])
//         .map((f) => f.originFileObj || f)
//         .filter(Boolean);

//       const extraPdfFile =
//         values.extraPdf && values.extraPdf[0]
//           ? values.extraPdf[0].originFileObj || values.extraPdf[0]
//           : null;

//       // 🔹 FIXED: Better image file handling
//       let imageFile = null;
//       if (fileList && fileList.length > 0) {
//         const file = fileList[0];
//         console.log("File object:", file);

//         // Check different possible file properties
//         imageFile = file.originFileObj || file.response || file;

//         // If it's a fake file from rowData, we might not have the actual file
//         if (file.uid === "-1" && file.url && !file.originFileObj) {
//           console.log("This is a preview file from existing data");
//           imageFile = null;
//         }
//       }

//       if (!imageFile) {
//         message.error("يجب رفع صورة صالحة للدورة");
//         setIsSubmitting(false);
//         return;
//       }

//       const formData = new FormData();
//       formData.append("name", values?.name?.trim());
//       formData.append("description", values?.description?.trim());
//       formData.append("price", values?.price);

//       if (start) {
//         formData.append("start_date", dayjs(start).format("YYYY-MM-DD"));
//       }
//       if (end) {
//         formData.append("end_date", dayjs(end).format("YYYY-MM-DD"));
//       }

//       formData.append("gender", values.genderPolicy || "both");
//       formData.append("for", "Beginners");
//       formData.append("goal", values?.goal?.trim());
//       formData.append("course_category_id", selectedCategory);
//       formData.append("category_part_id", selectedOption);
//       formData.append("source", 1);
//       formData.append("capacity", values?.capacity);

//       formData.append("time_show", timeString || "");
//       formData.append("round_book", courseBookFiles[0] || null);
//       formData.append("teacher_id", values?.instructor?.join(","));
//       formData.append("round_road_map_book", extraPdfFile || null);
//       formData.append("free", values?.free ? 1 : 0);
//       formData.append("active", values?.active ? 1 : 0);

//       // Append image file
//       if (imageFile) {
//         formData.append("image", imageFile);
//       }

//       // 🔹 استخدام unwrap() مع await للتعامل مع النتيجة
//       const result = await dispatch(
//         handleAddBaiskRound({ body: formData })
//       ).unwrap();

//       if (result?.data?.status == "success") {
//         console.log(result?.data);
//         setRoundId(result?.data?.message?.round_id);
//         toast.success(result?.data?.message?.message);
//         dispatch(handleGetSourceRound());

//         // 🔹 هنا الانتقال للخطوة التالية بعد النجاح
//         goToNextStep();
//       } else {
//         toast.error(result?.data?.message);
//       }
//     } catch (error) {
//       console.error("Submission error:", error);
//       toast.error("فشل في إضافة الدورة");
//       if (error.message) {
//         toast.error(`خطأ: ${error.message}`);
//       }
//     } finally {
//       setIsSubmitting(false);
//     }
//   }

//   const disabledDate = (current) => {
//     // disable days before today
//     return current && current < dayjs().startOf("day");
//   };

//   /* ====================== Handle Form Submit Failure ====================== */

//   function handleSubmitFailed(errorInfo) {
//     console.log("Form submission failed:", errorInfo);

//     const errorFields = errorInfo.errorFields
//       .map((field) => field.name[0])
//       .flat();
//     const uniqueErrors = [...new Set(errorFields)];

//     message.error(`يرجى مراجعة الحقول التالية: ${uniqueErrors.join("، ")}`);
//   }

//   /* ====================== Render ====================== */

//   return (
//     <div className="space-y-8">
//       <Form
//         form={form}
//         layout="vertical"
//         onFinish={handleSubmit}
//         onFinishFailed={handleSubmitFailed}
//         className="space-y-8"
//         initialValues={{
//           genderPolicy: "both",
//           capacity: 20,
//           free: false,
//           active: true,
//         }}
//         validateMessages={{
//           required: "${label} مطلوب",
//           types: {
//             number: "${label} يجب أن يكون رقماً",
//           },
//           number: {
//             min: "${label} لا يمكن أن يكون أقل من ${min}",
//             max: "${label} لا يمكن أن يكون أكثر من ${max}",
//           },
//           string: {
//             min: "${label} يجب أن يكون على الأقل ${min} أحرف",
//             max: "${label} لا يمكن أن يتجاوز ${max} أحرف",
//           },
//         }}
//       >
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Image Upload */}
//           <div className="lg:col-span-1">
//             <Form.Item
//               label={
//                 <span className="font-semibold text-gray-700 flex items-center gap-2">
//                   <InboxOutlined className="text-blue-600" />
//                   صورة الدورة *
//                 </span>
//               }
//               required
//               rules={[
//                 {
//                   validator: () => {
//                     if (!fileList || fileList.length === 0) {
//                       return Promise.reject(new Error("صورة الدورة مطلوبة"));
//                     }
//                     return Promise.resolve();
//                   },
//                 },
//               ]}
//             >
//               <Dragger
//                 accept=".jpg,.jpeg,.png,.gif"
//                 multiple={false}
//                 maxCount={1}
//                 beforeUpload={beforeUpload}
//                 fileList={fileList}
//                 onChange={handleFileChange}
//                 onRemove={handleRemoveFile}
//                 listType="picture"
//                 className="border-2 border-dashed border-blue-300 hover:border-blue-400 rounded-xl bg-blue-50/50"
//               >
//                 <p className="ant-upload-drag-icon">
//                   <InboxOutlined className="text-blue-500 text-4xl" />
//                 </p>
//                 <p className="ant-upload-text font-medium text-gray-700">
//                   اسحب الصورة هنا أو اضغط للاختيار
//                 </p>
//                 <p className="ant-upload-hint text-gray-500">
//                   الحجم الأقصى 5MB - صيغ مدعومة: JPG, PNG, WebP
//                 </p>
//               </Dragger>
//             </Form.Item>
//           </div>

//           {/* Basic Details */}
//           <div className="lg:col-span-2 space-y-6">
//             <Row gutter={16}>
//               <Col span={12}>
//                 <Form.Item
//                   label={
//                     <span className="font-semibold text-gray-700 flex items-center gap-2">
//                       <BookOutlined className="text-green-600" />
//                       اسم الدورة *
//                     </span>
//                   }
//                   name="name"
//                   rules={[
//                     { required: true, message: "أدخل اسم الدورة" },
//                     { min: 3, message: "الاسم لا يقل عن 3 أحرف" },
//                     { max: 100, message: "الاسم لا يزيد عن 100 حرف" },
//                   ]}
//                 >
//                   <Input
//                     placeholder="مثال: دورة البرمجة المتقدمة"
//                     className="rounded-xl border-gray-300 hover:border-blue-400 focus:border-blue-500"
//                   />
//                 </Form.Item>
//               </Col>
//               <Col span={12}>
//                 <Form.Item
//                   label={
//                     <span className="font-semibold text-gray-700 flex items-center gap-2">
//                       <DollarOutlined className="text-orange-600" />
//                       السعر (ج.م) *
//                     </span>
//                   }
//                   name="price"
//                   rules={[
//                     { required: true, message: "أدخل السعر" },
//                     { type: "number", min: 0, message: "السعر لا يقل عن 0" },
//                   ]}
//                 >
//                   <InputNumber
//                     className="w-full rounded-xl"
//                     placeholder="499"
//                     min={0}
//                     step={1}
//                     formatter={(value) =>
//                       `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
//                     }
//                     parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
//                   />
//                 </Form.Item>
//               </Col>
//             </Row>

//             <Row gutter={16}>
//               <Col span={12}>
//                 <Form.Item
//                   label={
//                     <span className="font-semibold text-gray-700 flex items-center gap-2">
//                       <FolderOutlined className="text-purple-600" />
//                       الفئة *
//                     </span>
//                   }
//                   name="category"
//                   rules={[{ required: true, message: "اختر الفئة" }]}
//                 >
//                   <Select
//                     placeholder="اختر فئة الدورة"
//                     className="rounded-xl"
//                     onChange={setSelectedCategory}
//                     options={categoriesOptions}
//                   />
//                 </Form.Item>
//               </Col>
//               <Col span={12}>
//                 <Form.Item
//                   label={
//                     <span className="font-semibold text-gray-700 flex items-center gap-2">
//                       <BookOutlined className="text-indigo-600" />
//                       القسم *
//                     </span>
//                   }
//                   name="section"
//                   rules={[{ required: true, message: "اختر القسم" }]}
//                 >
//                   <Select
//                     placeholder="اختر قسم من الفئة"
//                     className="rounded-xl"
//                     disabled={!selectedCategory}
//                     onChange={setSelectedOption}
//                     options={categoriesPartOptions}
//                   />
//                 </Form.Item>
//               </Col>
//             </Row>

//             <Form.Item
//               label={
//                 <span className="font-semibold text-gray-700">
//                   وصف الدورة *
//                 </span>
//               }
//               name="description"
//               rules={[
//                 { required: true, message: "أدخل وصفًا للدورة" },
//                 { min: 10, message: "الوصف لا يقل عن 10 أحرف" },
//                 { max: 1000, message: "الوصف لا يزيد عن 1000 حرف" },
//               ]}
//             >
//               <TextArea
//                 rows={4}
//                 placeholder="اكتب وصفاً شاملاً للدورة وأهدافها التعليمية..."
//                 className="rounded-xl border-gray-300 hover:border-blue-400 focus:border-blue-500"
//                 showCount
//                 maxLength={1000}
//               />
//             </Form.Item>
//           </div>
//         </div>

//         {/* Configuration Section */}
//         <div className="bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-2xl p-6 border border-gray-200">
//           <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
//             <SettingOutlined className="text-blue-600" />
//             إعدادات الدورة
//           </h3>

//           <Row gutter={24}>
//             <Col span={8}>
//               <Form.Item
//                 label={
//                   <span className="font-semibold text-gray-700 flex items-center gap-2">
//                     <UserOutlined className="text-pink-600" />
//                     سياسة النوع *
//                   </span>
//                 }
//                 name="genderPolicy"
//                 rules={[{ required: true, message: "اختر السياسة" }]}
//               >
//                 <Select
//                   className="rounded-xl"
//                   options={[
//                     { label: "👨 للذكور فقط", value: "male" },
//                     { label: "👩 للإناث فقط", value: "female" },
//                     { label: "👥 للجميع", value: "both" },
//                   ]}
//                 />
//               </Form.Item>
//             </Col>
//             <Col span={8}>
//               <Form.Item
//                 label={
//                   <span className="font-semibold text-gray-700 flex items-center gap-2">
//                     <TeamOutlined className="text-red-600" />
//                     السعة القصوى *
//                   </span>
//                 }
//                 name="capacity"
//                 rules={[
//                   { required: true, message: "أدخل السعة" },
//                   { type: "number", min: 1, message: "لا تقل عن 1" },
//                   { type: "number", max: 1000, message: "لا تزيد عن 1000" },
//                 ]}
//               >
//                 <InputNumber
//                   className="w-full rounded-xl"
//                   placeholder="50"
//                   min={1}
//                   max={1000}
//                 />
//               </Form.Item>
//             </Col>
//             <Col span={8}>
//               <Form.Item
//                 label={
//                   <span className="font-semibold text-gray-700 flex items-center gap-2">
//                     <UserOutlined className="text-cyan-600" />
//                     المدربين *
//                   </span>
//                 }
//                 name="instructor"
//                 rules={[{ required: true, message: "اختر المدربين" }]}
//               >
//                 <Select
//                   mode="multiple"
//                   className="rounded-xl"
//                   placeholder="اختر المدربين"
//                   options={teacherOptions}
//                 />
//               </Form.Item>
//             </Col>
//           </Row>

//           <Form.Item
//             label={
//               <span className="font-semibold text-gray-700 flex items-center gap-2">
//                 <CalendarOutlined className="text-green-600" />
//                 فترة إتاحة الدورة *
//               </span>
//             }
//             name="availableRange"
//             rules={[{ required: true, message: "حدد فترة الإتاحة" }]}
//           >
//             <RangePicker
//               className="w-full rounded-xl"
//               placeholder={["تاريخ البداية", "تاريخ النهاية"]}
//               format="DD/MM/YYYY"
//               disabledDate={disabledDate} // ⬅️ هنا
//             />
//           </Form.Item>

//           <Row gutter={24}>
//             <Col span={12}>
//               <Form.Item
//                 label={
//                   <span className="font-semibold text-gray-700 flex items-center gap-2">
//                     مجاني
//                   </span>
//                 }
//                 name="free"
//                 valuePropName="checked"
//               >
//                 <Switch />
//               </Form.Item>
//             </Col>
//             <Col span={12}>
//               <Form.Item
//                 label={
//                   <span className="font-semibold text-gray-700 flex items-center gap-2">
//                     نشط
//                   </span>
//                 }
//                 name="active"
//                 valuePropName="checked"
//               >
//                 <Switch />
//               </Form.Item>
//             </Col>
//           </Row>

//           <Row gutter={24}>
//             <Col span={24}>
//               <Form.Item
//                 label={
//                   <span className="font-semibold text-gray-700 flex items-center gap-2">
//                     الهدف *
//                   </span>
//                 }
//                 name="goal"
//                 rules={[{ required: true, message: "أدخل الهدف" }]}
//               >
//                 <Input placeholder="أدخل الهدف من الدورة" />
//               </Form.Item>
//             </Col>
//           </Row>

//           <Col span={12}>
//             <Form.Item
//               label={
//                 <span className="font-semibold text-gray-700 flex items-center gap-2">
//                   <ClockCircleOutlined className="text-blue-600" />
//                   وقت الدورة
//                 </span>
//               }
//               name="time"
//             >
//               <TimePicker
//                 className="w-full rounded-xl"
//                 format="HH:mm:ss"
//                 placeholder="اختر وقت الدورة"
//               />
//             </Form.Item>
//           </Col>

//           {/* كتاب الدورة */}
//           <Form.Item
//             label={
//               <span className="font-semibold text-gray-700 flex items-center gap-2">
//                 <FileTextOutlined className="text-cyan-600" />
//                 كتاب الدورة
//               </span>
//             }
//             name="courseBook"
//             valuePropName="fileList"
//             getValueFromEvent={normFile}
//           >
//             <Dragger multiple {...uploadProps}>
//               <p className="ant-upload-drag-icon">
//                 <InboxOutlined />
//               </p>
//               <p className="ant-upload-text">
//                 Click or drag file to this area to upload
//               </p>
//               <p className="ant-upload-hint">
//                 Support for a single or bulk upload. Strictly prohibited from
//                 uploading company data or other banned files.
//               </p>
//             </Dragger>
//           </Form.Item>

//           {/* ملف PDF إضافي */}
//           <Form.Item
//             label={
//               <span className="font-semibold text-gray-700 flex items-center gap-2">
//                 <FileTextOutlined className="text-purple-600" />
//                 ملف PDF إضافي
//               </span>
//             }
//             name="extraPdf"
//             valuePropName="fileList"
//             getValueFromEvent={normFile}
//           >
//             <Dragger multiple={false} accept=".pdf">
//               <p className="ant-upload-drag-icon">
//                 <InboxOutlined />
//               </p>
//               <p className="ant-upload-text">
//                 اسحب ملف PDF هنا أو اضغط للاختيار
//               </p>
//               <p className="ant-upload-hint">
//                 ملف واحد فقط بصيغة PDF (مثلاً بروشور أو ملخص).
//               </p>
//             </Dragger>
//           </Form.Item>
//         </div>

//         {/* <Button
//           type="primary"
//           htmlType="submit"
//           size="large"
//           loading={add_round_loading}
//           className="!bg-blue-600 mb-4 !me-auto !text-white hover:!bg-blue-700"
//         >
//           {add_round_loading ? "جاري الحفظ..." : "حفظ البيانات"}
//         </Button> */}

//         <div className="mt-8 flex justify-between space-x-4 space-x-reverse">
//           {/* <button
//               onClick={goToPrevStep}
//               disabled={currentStep === 1}
//               className={`rounded-lg border border-gray-300 bg-white px-6 py-2 text-gray-700 transition duration-150 hover:bg-gray-50 ${
//                 currentStep === 1 ? "cursor-not-allowed opacity-50" : ""
//               }`}
//             >
//               السابق
//             </button> */}
//           <div className="mt-8 flex justify-between !ms-auto space-x-4 space-x-reverse">
//             <Button
//               size="large"
//               onClick={goToPrevStep}
//               disabled={currentStep === 1}
//               className={`rounded-lg border border-gray-300 bg-white px-6 py-2 text-gray-700 transition duration-150 hover:bg-gray-50 ${
//                 currentStep === 1 ? "cursor-not-allowed opacity-50" : ""
//               }`}
//             >
//               السابق
//             </Button>

//             <Button
//               type="primary"
//               htmlType="submit"
//               size="large"
//               // onClick={goToNextStep}
//               onClick={handleSubmit}
//               loading={add_round_loading}
//               className="rounded-lg bg-blue-600 px-6 py-2 text-white shadow-md hover:bg-blue-700"
//             >
//               {add_round_loading ? "جاري الحفظ..." : "التالي"}
//             </Button>
//           </div>
//         </div>
//       </Form>
//     </div>
//   );
// }

"use client";
import {
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Upload,
  Button,
  message,
  TimePicker,
  Switch,
} from "antd";
import React, { useEffect, useState, useCallback } from "react";
import {
  BookOutlined,
  FileTextOutlined,
  InboxOutlined,
  CalendarOutlined,
  UserOutlined,
  DollarOutlined,
  TeamOutlined,
  FolderOutlined,
  SettingOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import {
  handleGetAllCoursesCategories,
  handleGetCategoryParts,
} from "../../lib/features/categoriesSlice";
import {
  handleAddBaiskRound,
  handleGetSourceRound,
  handleEditBaiskRound,
} from "../../lib/features/roundsSlice";
import { handleGetAllTeachers } from "../../lib/features/teacherSlice";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

// 👇 ReactQuill بتحميل ديناميكي عشان الـ SSR في Next
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const { Dragger } = Upload;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

// Upload props لكتاب الدورة وغيره
const uploadProps = {
  name: "file",
  multiple: true,
  action: "https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload",
  onChange(info) {
    const { status } = info.file;
    if (status !== "uploading") {
      console.log("Book upload:", info.file, info.fileList);
    }
    if (status === "done") {
      message.success(`${info.file.name} تم رفع الملف بنجاح`);
    } else if (status === "error") {
      message.error(`${info.file.name} فشل في رفع الملف`);
    }
  },
  onDrop(e) {
    console.log("Dropped files", e.dataTransfer.files);
  },
};

// لتحويل event الخاص بالرفع إلى fileList داخل الـ Form
const normFile = (e) => {
  if (Array.isArray(e)) return e;
  return e?.fileList || [];
};

// منع الرفع التلقائي
const customBeforeUpload = () => {
  return false;
};

// Helper function to convert string/object to dayjs
const convertToDayjs = (value) => {
  if (!value) return null;
  if (dayjs.isDayjs(value)) return value;
  if (typeof value === "string" || typeof value === "number") {
    return dayjs(value);
  }
  if (value && value._isAMomentObject) {
    return dayjs(value);
  }
  return null;
};

// Helper function to safely check if a value is a valid dayjs object
const isDayjsValid = (value) => {
  if (!value) return false;
  if (dayjs.isDayjs(value)) return value.isValid();
  return false;
};

export default function AddCourseSourceBasicInfo({
  isSource,
  fileList,
  setFileList,
  availableSections,
  selectedCategory,
  setSelectedCategory,
  all_categories,
  beforeUpload = customBeforeUpload,
  setImagePreview,
  rowData,
  setRowData,
  goToNextStep,
  setRoundId,
  goToPrevStep,
  currentStep,
  id,
}) {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { all_courses_categories_list, get_categories_parts_list } =
    useSelector((state) => state?.categories);
  const { add_round_loading, edit_round_loading } = useSelector(
    (state) => state?.rounds
  );
  const { teachers_list } = useSelector((state) => state?.teachers);

  const [categoriesOptions, setCategoriesOptions] = useState([]);
  const [categoriesPartOptions, setCategoriesPartOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [teacherOptions, setTeacherOptions] = useState([]);
  const [validationErrors, setValidationErrors] = useState([]);
  const [touchedFields, setTouchedFields] = useState({});
  const [courseBookFileList, setCourseBookFileList] = useState([]);
  const [extraPdfFileList, setExtraPdfFileList] = useState([]);
  const router = useRouter();

  const isEditMode = Boolean(id && rowData?.id);

  // Helper function to get field labels
  const getFieldLabel = (fieldName) => {
    const labels = {
      name: "اسم الدورة",
      price: "السعر",
      category: "الفئة",
      section: "القسم",
      description: "وصف الدورة",
      genderPolicy: "سياسة النوع",
      capacity: "السعة القصوى",
      instructor: "المدربين",
      availableRange: "فترة إتاحة الدورة",
      goal: "الهدف",
      image: "صورة الدورة",
      time: "وقت الدورة",
    };
    return labels[fieldName] || fieldName;
  };

  /* ====================== Load teachers / categories ====================== */
  useEffect(() => {
    dispatch(handleGetAllTeachers());
  }, [dispatch]);

  useEffect(() => {
    setTeacherOptions(
      teachers_list?.data?.message?.map((item) => ({
        label: item?.name,
        value: item?.id,
      })) || []
    );
  }, [teachers_list]);

  useEffect(() => {
    dispatch(handleGetAllCoursesCategories({}));
  }, [dispatch]);

  useEffect(() => {
    setCategoriesOptions(
      all_courses_categories_list?.data?.message?.data?.map((item) => ({
        label: item?.name,
        value: item?.id,
      })) || []
    );
  }, [all_courses_categories_list]);

  useEffect(() => {
    const data_send = {
      course_category_id: selectedCategory,
    };
    dispatch(handleGetCategoryParts({ body: data_send }));
  }, [selectedCategory, dispatch]);

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ align: [] }],
      ["link"],
      ["clean"],
    ],
  };

  const quillFormats = [
    "header",
    "bold",
    "italic",
    "underline",
    "list",
    "bullet",
    "align",
    "link",
  ];

  const isQuillEmpty = (value) => {
    if (!value) return true;
    const plain = value
      .replace(/<[^>]+>/g, "")
      .replace(/&nbsp;/g, " ")
      .trim();
    return plain.length === 0;
  };

  useEffect(() => {
    setCategoriesPartOptions(
      get_categories_parts_list?.data?.message
        ?.filter(
          (item) =>
            Number(item?.course_category_id) === Number(selectedCategory)
        )
        ?.map((part) => ({
          label: part?.name,
          value: part?.id,
        })) || []
    );
  }, [get_categories_parts_list, selectedCategory]);

  /* ====================== Handle file changes ====================== */
  const handleFileChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);

    if (newFileList.length > 0) {
      const file = newFileList[0];
      if (file.originFileObj) {
        const previewUrl = URL.createObjectURL(file.originFileObj);
        setImagePreview(previewUrl);
      } else if (file.url) {
        setImagePreview(file.url);
      }
    } else {
      setImagePreview(null);
    }

    // Validate image when changed
    validateImageField(newFileList);
  };

  const handleRemoveFile = () => {
    setFileList([]);
    setImagePreview(null);
    validateImageField([]);
  };

  const handleCourseBookChange = ({ fileList: newFileList }) => {
    setCourseBookFileList(newFileList);
    form.setFieldsValue({ courseBook: newFileList });
  };

  const handleExtraPdfChange = ({ fileList: newFileList }) => {
    setExtraPdfFileList(newFileList);
    form.setFieldsValue({ extraPdf: newFileList });
  };

  const validateImageField = (files) => {
    if (!files || files.length === 0) {
      if (!isEditMode || !rowData?.image_url) {
        if (!touchedFields.image) {
          setTouchedFields((prev) => ({ ...prev, image: true }));
        }
        return false;
      }
    }
    return true;
  };

  /* ====================== Field change handlers ====================== */
  const handleFieldChange = (fieldName, value) => {
    setTouchedFields((prev) => ({ ...prev, [fieldName]: true }));

    // Special handling for Quill editor
    if (fieldName === "goal") {
      validateQuillField(value);
    }
  };

  const validateQuillField = (value) => {
    if (isQuillEmpty(value)) {
      if (!validationErrors.includes("goal") && touchedFields.goal) {
        setValidationErrors((prev) => [...prev, "goal"]);
      }
    } else {
      setValidationErrors((prev) => prev.filter((err) => err !== "goal"));
    }
  };

  /* ====================== Prefill when editing ====================== */
  useEffect(() => {
    if (!rowData) return;

    const formValues = {
      name: rowData.name,
      price: rowData.price,
      category: rowData.course_category_id || rowData.category_id,
      section: rowData.category_part_id,
      description: rowData.description,
      genderPolicy: rowData.gender,
      capacity: rowData.capacity,
      instructor:
        rowData.instructor_ids ||
        (rowData.teacher_id ? [rowData.teacher_id] : []),
      free: rowData.free || false,
      active: rowData.active ?? true,
      goal: rowData.goal || "",
    };

    if (rowData.start_date && rowData.end_date) {
      formValues.availableRange = [
        dayjs(rowData.start_date),
        dayjs(rowData.end_date),
      ];
    }

    if (rowData.time || rowData.duration_time || rowData.time_show) {
      const timeValue =
        rowData.time || rowData.duration_time || rowData.time_show;
      const parsedTime = dayjs(timeValue, "HH:mm:ss");
      if (parsedTime.isValid()) {
        formValues.time = parsedTime;
      }
    }

    form.setFieldsValue(formValues);

    if (formValues.category) {
      setSelectedCategory(formValues.category);
    }
    if (formValues.section) {
      setSelectedOption(formValues.section);
    }

    if (rowData?.image_url && (!fileList || fileList.length === 0)) {
      const fakeFile = {
        uid: "-1",
        name: "course-cover",
        status: "done",
        url: rowData.image_url,
      };
      setFileList([fakeFile]);
      setImagePreview(rowData.image_url);
    }

    // Validate prefilled fields
    if (formValues.goal) {
      validateQuillField(formValues.goal);
    }
  }, [
    rowData,
    form,
    fileList,
    setFileList,
    setImagePreview,
    setSelectedCategory,
  ]);

  /* ====================== Load from localStorage ====================== */
  const loadFromLocalStorage = useCallback(() => {
    try {
      const savedData = localStorage.getItem("courseBasicInfo");
      if (savedData && !rowData) {
        const formData = JSON.parse(savedData);

        // Convert date values to dayjs objects
        const formattedData = { ...formData };

        // Handle availableRange (date picker)
        if (
          formattedData.availableRange &&
          Array.isArray(formattedData.availableRange)
        ) {
          formattedData.availableRange = formattedData.availableRange
            .map((date) => convertToDayjs(date))
            .filter((date) => date && date.isValid());
        }

        // Handle time (time picker)
        if (formattedData.time) {
          formattedData.time = convertToDayjs(formattedData.time);
        }

        // Note: We cannot restore file objects from localStorage
        // Users will need to re-upload files
        delete formattedData.courseBook;
        delete formattedData.extraPdf;

        form.setFieldsValue(formattedData);

        // Set category and section if they exist
        if (formattedData.category) {
          setSelectedCategory(formattedData.category);
        }
        if (formattedData.category_part_id) {
          setSelectedOption(formattedData.category_part_id);
        }

        console.log("Loaded data from localStorage:", formattedData);

        // Show notification about files
        if (formattedData.hasCourseBook || formattedData.hasExtraPdf) {
          toast.info("يرجى إعادة رفع ملفات الدورة والملفات الإضافية", {
            position: "top-right",
            autoClose: 5000,
          });
        }
      }
    } catch (error) {
      console.error("Error loading from localStorage:", error);
    }
  }, [form, rowData, setSelectedCategory]);

  useEffect(() => {
    loadFromLocalStorage();
  }, [loadFromLocalStorage]);

  /* ====================== Save to localStorage on form change ====================== */
  const saveToLocalStorage = useCallback(() => {
    if (isEditMode) return; // Don't save in edit mode

    try {
      const formValues = form.getFieldsValue();

      // Convert dayjs objects to serializable format
      const dataToSave = { ...formValues };

      // Convert availableRange dates
      if (
        dataToSave.availableRange &&
        Array.isArray(dataToSave.availableRange)
      ) {
        dataToSave.availableRange = dataToSave.availableRange.map((date) =>
          isDayjsValid(date) ? date.toISOString() : date
        );
      }

      // Convert time
      if (dataToSave.time && isDayjsValid(dataToSave.time)) {
        dataToSave.time = dataToSave.time.toISOString();
      }

      // Add category and section
      dataToSave.category = selectedCategory;
      dataToSave.category_part_id = selectedOption;

      // Track if we have files (but don't store the actual files)
      dataToSave.hasCourseBook = courseBookFileList.length > 0;
      dataToSave.hasExtraPdf = extraPdfFileList.length > 0;
      dataToSave.hasImage = fileList.length > 0;

      // Remove file objects from localStorage (they can't be properly serialized)
      delete dataToSave.courseBook;
      delete dataToSave.extraPdf;

      localStorage.setItem("courseBasicInfo", JSON.stringify(dataToSave));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  }, [
    form,
    isEditMode,
    selectedCategory,
    selectedOption,
    courseBookFileList,
    extraPdfFileList,
    fileList,
  ]);

  // Save to localStorage when form values change
  useEffect(() => {
    const timer = setTimeout(() => {
      saveToLocalStorage();
    }, 500);

    return () => clearTimeout(timer);
  }, [saveToLocalStorage]);

  /* ====================== Validation ====================== */
  const validateFormBeforeSubmit = (values) => {
    const errors = [];

    // Required fields validation
    if (!values.name?.trim()) errors.push("name");
    if (!values.price && values.price !== 0) errors.push("price");
    if (!values.category) errors.push("category");
    if (!values.section) errors.push("section");
    if (!values.description?.trim()) errors.push("description");
    if (!values.genderPolicy) errors.push("genderPolicy");
    if (!values.capacity) errors.push("capacity");
    if (!values.instructor || values.instructor.length === 0)
      errors.push("instructor");

    // Validate availableRange
    if (!values.availableRange || values.availableRange.length !== 2) {
      errors.push("availableRange");
    } else {
      // Check if dates are valid dayjs objects
      const [start, end] = values.availableRange;
      if (!isDayjsValid(start) || !isDayjsValid(end)) {
        errors.push("availableRange");
      }
    }

    // Quill field validation
    if (isQuillEmpty(values.goal)) {
      errors.push("goal");
    }

    // Image validation
    if (!fileList || fileList.length === 0) {
      if (!isEditMode || !rowData?.image_url) {
        errors.push("image");
      }
    }

    return errors;
  };

  const showValidationToast = (errors) => {
    if (errors.length === 0) return;

    const errorMessages = errors.map((err) => getFieldLabel(err));
    const errorText = `الحقول التالية مطلوبة: ${errorMessages.join("، ")}`;

    toast.error(errorText, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  /* ====================== Get actual File objects ====================== */
  const getFileObject = (fileItem) => {
    if (fileItem.originFileObj) {
      return fileItem.originFileObj;
    }
    if (fileItem.response) {
      return fileItem.response;
    }
    return null;
  };

  /* ====================== Submit ====================== */
  async function handleSubmit(values) {
    try {
      setIsSubmitting(true);

      // Mark all fields as touched
      const allFields = [
        "name",
        "price",
        "category",
        "section",
        "description",
        "genderPolicy",
        "capacity",
        "instructor",
        "availableRange",
        "goal",
        "image",
      ];
      const touchedAll = {};
      allFields.forEach((field) => (touchedAll[field] = true));
      setTouchedFields(touchedAll);

      // Validate all fields
      const validationErrors = validateFormBeforeSubmit(values);

      if (validationErrors.length > 0) {
        setValidationErrors(validationErrors);
        showValidationToast(validationErrors);
        setIsSubmitting(false);

        // Scroll to first error
        const firstError = validationErrors[0];
        const element = document.querySelector(`[data-field="${firstError}"]`);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }

        return;
      }

      // Clear any previous errors
      setValidationErrors([]);

      const [start, end] = values.availableRange || [null, null];

      const timeString =
        values.time && isDayjsValid(values.time)
          ? values.time.format("HH:mm:ss")
          : null;

      // Get actual File objects from file lists
      let courseBookFile = null;
      if (courseBookFileList.length > 0) {
        const fileItem = courseBookFileList[0];
        courseBookFile = getFileObject(fileItem);
      }

      let extraPdfFile = null;
      if (extraPdfFileList.length > 0) {
        const fileItem = extraPdfFileList[0];
        extraPdfFile = getFileObject(fileItem);
      }

      let imageFile = null;
      if (fileList && fileList.length > 0) {
        const file = fileList[0];
        imageFile = getFileObject(file);
      }

      if (!imageFile && !isEditMode) {
        toast.error("يجب رفع صورة صالحة للدورة");
        setIsSubmitting(false);
        return;
      }

      const formData = new FormData();
      formData.append("name", values?.name?.trim());
      formData.append("description", values?.description?.trim());
      formData.append("price", values?.price);

      if (start && isDayjsValid(start)) {
        formData.append("start_date", dayjs(start).format("YYYY-MM-DD"));
      }
      if (end && isDayjsValid(end)) {
        formData.append("end_date", dayjs(end).format("YYYY-MM-DD"));
      }

      formData.append("gender", values.genderPolicy || "both");
      formData.append("for", "Beginners");
      formData.append("goal", values?.goal);
      formData.append("course_category_id", selectedCategory);
      formData.append("category_part_id", selectedOption);
      formData.append("source", isSource ? 0 : 1);
      formData.append("capacity", values?.capacity);
      formData.append("time_show", timeString || "");

      formData.append("round_book", courseBookFile || null);

      formData.append("teacher_id", values?.instructor?.join(","));

      formData.append("round_road_map_book", extraPdfFile || null);
      formData.append("free", values?.free ? 1 : 0);
      formData.append("active", values?.active ? 1 : 0);

      if (rowData) {
        formData.append("id", rowData?.id);
      }

      if (imageFile) {
        formData.append("image", imageFile);
      }

      // Log form data for debugging
      console.log("Submitting form data:");
      console.log("Name:", values?.name);
      console.log("Course Book File:", courseBookFile ? "Exists" : "None");
      console.log("Extra PDF File:", extraPdfFile ? "Exists" : "None");
      console.log("Image File:", imageFile ? "Exists" : "None");

      // Don't save file objects to localStorage (they can't be serialized)
      if (!rowData) {
        const dataToSave = {
          ...values,
          category_part_id: selectedOption,
          category: selectedCategory,
          // Don't save file objects
          courseBook: undefined,
          extraPdf: undefined,
          image: undefined,
        };
        // localStorage.setItem("courseBasicInfo", JSON.stringify(dataToSave));
      }

      const result = await dispatch(
        isEditMode
          ? handleEditBaiskRound({ body: formData })
          : handleAddBaiskRound({ body: formData })
      ).unwrap();

      if (result?.data?.status === "success") {
        const roundIdValue =
          result?.data?.message?.round_id || rowData?.id || id;

        setRoundId(roundIdValue);
        dispatch(handleGetSourceRound());

        if (isEditMode) {
          toast.success(
            result?.data?.message?.message || "تم تحديث الدورة بنجاح"
          );
        } else {
          toast.success(result?.data?.message || "تم إضافة الدورة بنجاح");
        }

        // Clear localStorage after successful submission
        // localStorage.removeItem("courseBasicInfo");

        goToNextStep();
      } else {
        console.log("errorrrr", result);
        toast.error(
          result?.error?.response?.data?.message || "حدث خطأ أثناء حفظ البيانات"
        );
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى");
    } finally {
      setIsSubmitting(false);
    }
  }

  const disabledDate = (current) => {
    return current && current < dayjs().startOf("day");
  };

  function handleSubmitFailed(errorInfo) {
    console.log("Form submission failed:", errorInfo);

    const errorFields = errorInfo.errorFields
      .map((field) => field.name[0])
      .flat();
    const uniqueErrors = [...new Set(errorFields)];

    const errorMessages = uniqueErrors.map((field) => getFieldLabel(field));
    const errorText = `يرجى مراجعة الحقول التالية: ${errorMessages.join("، ")}`;

    toast.error(errorText, {
      position: "top-center",
      autoClose: 5000,
    });

    // Mark these fields as touched
    const touched = {};
    uniqueErrors.forEach((field) => (touched[field] = true));
    setTouchedFields((prev) => ({ ...prev, ...touched }));
  }

  // Helper function to check if a field has error
  const hasError = (fieldName) => {
    return validationErrors.includes(fieldName) && touchedFields[fieldName];
  };

  /* ====================== Render ====================== */
  return (
    <div className="space-y-8">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        onFinishFailed={handleSubmitFailed}
        className="space-y-8"
        initialValues={{
          genderPolicy: "both",
          capacity: 20,
          free: false,
          active: true,
        }}
        validateMessages={{
          required: "${label} مطلوب",
          types: {
            number: "${label} يجب أن يكون رقماً",
          },
          number: {
            min: "${label} لا يمكن أن يكون أقل من ${min}",
            max: "${label} لا يمكن أن يكون أكثر من ${max}",
          },
          string: {
            min: "${label} يجب أن يكون على الأقل ${min} أحرف",
            max: "${label} لا يمكن أن يتجاوز ${max} أحرف",
          },
        }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Image Upload */}
          <div className="lg:col-span-1" data-field="image">
            <Form.Item
              label={
                <span className="font-semibold text-gray-700 flex items-center gap-2">
                  <InboxOutlined className="text-blue-600" />
                  صورة الدورة *
                </span>
              }
              required
              validateStatus={hasError("image") ? "error" : ""}
              help={hasError("image") ? "صورة الدورة مطلوبة" : null}
            >
              <Dragger
                accept=".jpg,.jpeg,.png,.gif,.webp"
                multiple={false}
                maxCount={1}
                beforeUpload={beforeUpload}
                fileList={fileList}
                onChange={handleFileChange}
                onRemove={handleRemoveFile}
                listType="picture"
                className={`border-2 border-dashed rounded-xl ${
                  hasError("image")
                    ? "border-red-400 bg-red-50/50"
                    : "border-blue-300 hover:border-blue-400 bg-blue-50/50"
                }`}
              >
                <p className="ant-upload-drag-icon">
                  <InboxOutlined
                    className={`text-4xl ${
                      hasError("image") ? "text-red-500" : "text-blue-500"
                    }`}
                  />
                </p>
                <p className="ant-upload-text font-medium text-gray-700">
                  اسحب الصورة هنا أو اضغط للاختيار
                </p>
                <p className="ant-upload-hint text-gray-500">
                  الحجم الأقصى 5MB - صيغ مدعومة: JPG, PNG, WebP
                </p>
              </Dragger>
            </Form.Item>
          </div>

          {/* Basic Details */}
          <div className="lg:col-span-2 space-y-6">
            <Row gutter={16}>
              <Col span={12} data-field="name">
                <Form.Item
                  label={
                    <span className="font-semibold text-gray-700 flex items-center gap-2">
                      <BookOutlined className="text-green-600" />
                      اسم الدورة *
                    </span>
                  }
                  name="name"
                  rules={[
                    { required: true, message: "أدخل اسم الدورة" },
                    { min: 3, message: "الاسم لا يقل عن 3 أحرف" },
                  ]}
                  validateStatus={hasError("name") ? "error" : ""}
                >
                  <Input
                    placeholder="مثال: دورة البرمجة المتقدمة"
                    className={`rounded-xl ${
                      hasError("name")
                        ? "border-red-400"
                        : "border-gray-300 hover:border-blue-400 focus:border-blue-500"
                    }`}
                    onChange={(e) => handleFieldChange("name", e.target.value)}
                  />
                </Form.Item>
              </Col>
              <Col span={12} data-field="price">
                <Form.Item
                  label={
                    <span className="font-semibold text-gray-700 flex items-center gap-2">
                      <DollarOutlined className="text-orange-600" />
                      السعر (ج.م) *
                    </span>
                  }
                  name="price"
                  rules={[
                    { required: true, message: "أدخل السعر" },
                    { type: "number", min: 0, message: "السعر لا يقل عن 0" },
                  ]}
                  validateStatus={hasError("price") ? "error" : ""}
                >
                  <InputNumber
                    className={`w-full rounded-xl ${
                      hasError("price") ? "border-red-400" : ""
                    }`}
                    placeholder="499"
                    min={0}
                    step={1}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                    onChange={(value) => handleFieldChange("price", value)}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12} data-field="category">
                <Form.Item
                  label={
                    <span className="font-semibold text-gray-700 flex items-center gap-2">
                      <FolderOutlined className="text-purple-600" />
                      الفئة *
                    </span>
                  }
                  name="category"
                  rules={[{ required: true, message: "اختر الفئة" }]}
                  validateStatus={hasError("category") ? "error" : ""}
                >
                  <Select
                    placeholder="اختر فئة الدورة"
                    className={`rounded-xl ${
                      hasError("category") ? "border-red-400" : ""
                    }`}
                    onChange={(value) => {
                      setSelectedCategory(value);
                      handleFieldChange("category", value);

                      // Reset section when category changes
                      form.setFieldsValue({ section: undefined });
                      setSelectedOption(null);
                      setValidationErrors((prev) =>
                        prev.filter((err) => err !== "section")
                      );
                    }}
                    options={categoriesOptions}
                  />
                </Form.Item>
              </Col>
              <Col span={12} data-field="section">
                <Form.Item
                  label={
                    <span className="font-semibold text-gray-700 flex items-center gap-2">
                      <BookOutlined className="text-indigo-600" />
                      القسم *
                    </span>
                  }
                  name="section"
                  rules={[{ required: true, message: "اختر القسم" }]}
                  validateStatus={hasError("section") ? "error" : ""}
                >
                  <Select
                    placeholder="اختر قسم من الفئة"
                    className={`rounded-xl ${
                      hasError("section") ? "border-red-400" : ""
                    }`}
                    disabled={!selectedCategory}
                    value={selectedOption}
                    onChange={(value) => {
                      setSelectedOption(value);
                      handleFieldChange("section", value);
                    }}
                    options={categoriesPartOptions}
                    notFoundContent={
                      !selectedCategory
                        ? "يرجى اختيار الفئة أولاً"
                        : "لا توجد أقسام لهذه الفئة"
                    }
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label={
                <span className="font-semibold text-gray-700">
                  وصف الدورة *
                </span>
              }
              name="description"
              rules={[
                { required: true, message: "أدخل وصفًا للدورة" },
              ]}
              validateStatus={hasError("description") ? "error" : ""}
              data-field="description"
            >
              <TextArea
                rows={4}
                placeholder="اكتب وصفاً شاملاً للدورة وأهدافها التعليمية..."
                className={`rounded-xl ${
                  hasError("description")
                    ? "border-red-400"
                    : "border-gray-300 hover:border-blue-400 focus:border-blue-500"
                }`}
                showCount
                onChange={(e) =>
                  handleFieldChange("description", e.target.value)
                }
              />
            </Form.Item>
          </div>
        </div>

        {/* Configuration Section */}
        <div className="bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-2xl p-6 border border-gray-200">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <SettingOutlined className="text-blue-600" />
            إعدادات الدورة
          </h3>

          <Row gutter={24}>
            <Col span={8} data-field="genderPolicy">
              <Form.Item
                label={
                  <span className="font-semibold text-gray-700 flex items-center gap-2">
                    <UserOutlined className="text-pink-600" />
                    سياسة النوع *
                  </span>
                }
                name="genderPolicy"
                rules={[{ required: true, message: "اختر السياسة" }]}
                validateStatus={hasError("genderPolicy") ? "error" : ""}
              >
                <Select
                  className={`rounded-xl ${
                    hasError("genderPolicy") ? "border-red-400" : ""
                  }`}
                  options={[
                    { label: "👨 للذكور فقط", value: "male" },
                    { label: "👩 للإناث فقط", value: "female" },
                    { label: "👥 للجميع", value: "both" },
                  ]}
                  onChange={(value) => handleFieldChange("genderPolicy", value)}
                />
              </Form.Item>
            </Col>
            <Col span={8} data-field="capacity">
              <Form.Item
                label={
                  <span className="font-semibold text-gray-700 flex items-center gap-2">
                    <TeamOutlined className="text-red-600" />
                    السعة القصوى *
                  </span>
                }
                name="capacity"
                rules={[{ required: true, message: "أدخل السعة القصوى" }]}
                validateStatus={hasError("capacity") ? "error" : ""}
              >
                <InputNumber
                  className={`w-full rounded-xl ${
                    hasError("capacity") ? "border-red-400" : ""
                  }`}
                  placeholder="50"
                  onChange={(value) => handleFieldChange("capacity", value)}
                />
              </Form.Item>
            </Col>
            <Col span={8} data-field="instructor">
              <Form.Item
                label={
                  <span className="font-semibold text-gray-700 flex items-center gap-2">
                    <UserOutlined className="text-cyan-600" />
                    المدربين *
                  </span>
                }
                name="instructor"
                rules={[{ required: true, message: "اختر المدربين" }]}
                validateStatus={hasError("instructor") ? "error" : ""}
              >
                <Select
                  mode="multiple"
                  className={`rounded-xl ${
                    hasError("instructor") ? "border-red-400" : ""
                  }`}
                  placeholder="اختر المدربين"
                  options={teacherOptions}
                  onChange={(value) => handleFieldChange("instructor", value)}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label={
              <span className="font-semibold text-gray-700 flex items-center gap-2">
                <CalendarOutlined className="text-green-600" />
                فترة إتاحة الدورة *
              </span>
            }
            name="availableRange"
            rules={[{ required: true, message: "حدد فترة الإتاحة" }]}
            validateStatus={hasError("availableRange") ? "error" : ""}
            data-field="availableRange"
          >
            <RangePicker
              className={`w-full rounded-xl ${
                hasError("availableRange") ? "border-red-400" : ""
              }`}
              placeholder={["تاريخ البداية", "تاريخ النهاية"]}
              format="DD/MM/YYYY"
              disabledDate={disabledDate}
              onChange={(dates) => handleFieldChange("availableRange", dates)}
            />
          </Form.Item>

          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label={
                  <span className="font-semibold text-gray-700 flex items-center gap-2">
                    مجاني
                  </span>
                }
                name="free"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={
                  <span className="font-semibold text-gray-700 flex items-center gap-2">
                    نشط
                  </span>
                }
                name="active"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={24} data-field="goal">
              <Form.Item
                label={
                  <span className="font-semibold text-gray-700 flex items-center gap-2">
                    الهدف *
                  </span>
                }
                name="goal"
                validateStatus={hasError("goal") ? "error" : ""}
                help={hasError("goal") ? "أدخل الهدف" : null}
              >
                <div
                  className={`bg-white border rounded-xl ${
                    hasError("goal") ? "border-red-400" : "border-gray-200"
                  }`}
                >
                  <ReactQuill
                    theme="snow"
                    modules={quillModules}
                    formats={quillFormats}
                    placeholder="اكتب الهدف من الدورة بالتفصيل (مثلاً: ماذا يتعلم الطالب، النتائج المتوقعة، الجمهور المستهدف)..."
                    className="h-full"
                    value={form.getFieldValue("goal")}
                    onChange={(value) => {
                      form.setFieldsValue({ goal: value });
                      handleFieldChange("goal", value);
                      validateQuillField(value);
                    }}
                  />
                </div>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={12} data-field="time">
              <Form.Item
                label={
                  <span className="font-semibold text-gray-700 flex items-center gap-2">
                    <ClockCircleOutlined className="text-blue-600" />
                    وقت الدورة
                  </span>
                }
                name="time"
              >
                <TimePicker
                  className="w-full rounded-xl"
                  format="HH:mm:ss"
                  placeholder="اختر وقت الدورة"
                  onChange={(value) => handleFieldChange("time", value)}
                />
              </Form.Item>
            </Col>
          </Row>

          {/* كتاب الدورة */}
          <Form.Item
            label={
              <span className="font-semibold text-gray-700 flex items-center gap-2">
                <FileTextOutlined className="text-cyan-600" />
                كتاب الدورة
              </span>
            }
            name="courseBook"
            valuePropName="fileList"
            getValueFromEvent={normFile}
          >
            <Dragger
              multiple={false}
              accept=".pdf,.doc,.docx,.txt"
              beforeUpload={customBeforeUpload}
              fileList={courseBookFileList}
              onChange={handleCourseBookChange}
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                اسحب ملف كتاب الدورة هنا أو اضغط للاختيار
              </p>
              <p className="ant-upload-hint">
                ملف واحد فقط بصيغة PDF, DOC, DOCX, TXT
              </p>
            </Dragger>
          </Form.Item>

          {/* ملف PDF إضافي */}
          <Form.Item
            label={
              <span className="font-semibold text-gray-700 flex items-center gap-2">
                <FileTextOutlined className="text-purple-600" />
                ملف PDF إضافي
              </span>
            }
            name="extraPdf"
            valuePropName="fileList"
            getValueFromEvent={normFile}
          >
            <Dragger
              multiple={false}
               accept=".pdf,.doc,.docx,.txt"
              beforeUpload={customBeforeUpload}
              fileList={extraPdfFileList}
              onChange={handleExtraPdfChange}
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                اسحب ملف PDF هنا أو اضغط للاختيار
              </p>
              <p className="ant-upload-hint">
                ملف واحد فقط بصيغة PDF (مثلاً بروشور أو ملخص).
              </p>
            </Dragger>
          </Form.Item>
        </div>

        <div className="mt-8 flex justify-between space-x-4 space-x-reverse">
          <div className="mt-8 flex justify-between !ms-auto space-x-4 space-x-reverse">
            <Button
              size="large"
              onClick={goToPrevStep}
              disabled={currentStep === 1}
              className={`rounded-lg border border-gray-300 bg-white px-6 py-2 text-gray-700 transition duration-150 hover:bg-gray-50 ${
                currentStep === 1 ? "cursor-not-allowed opacity-50" : ""
              }`}
            >
              السابق
            </Button>

            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={add_round_loading || edit_round_loading || isSubmitting}
              className="rounded-lg bg-blue-600 px-6 py-2 text-white shadow-md hover:bg-blue-700"
            >
              {add_round_loading || edit_round_loading || isSubmitting
                ? "جاري الحفظ..."
                : isEditMode
                ? "حفظ التعديلات"
                : "التالي"}
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
}
