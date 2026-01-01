// "use client";
// import {
//   Col,
//   DatePicker,
//   Form,
//   Input,
//   InputNumber,
//   Row,
//   Select,
//   Upload,
//   Button,
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
//   FileDoneOutlined,
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
//   handleEditBaiskRound,
//   add_round_data,
//   handleGetAllRounds,
// } from "../../lib/features/roundsSlice";
// import { handleGetAllTeachers } from "../../lib/features/teacherSlice";
// import { toast } from "react-toastify";
// import { useRouter } from "next/navigation";
// import dynamic from "next/dynamic";
// import "react-quill-new/dist/quill.snow.css";

// const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

// const { Dragger } = Upload;
// const { TextArea } = Input;
// const { RangePicker } = DatePicker;

// const normFile = (e) => {
//   if (Array.isArray(e)) return e;
//   return e?.fileList || [];
// };

// const customBeforeUpload = () => false;

// const isDayjsValid = (value) => {
//   if (!value) return false;
//   if (dayjs.isDayjs(value)) return value.isValid();
//   return false;
// };

// export default function AddCourseSourceBasicInfo({
//   isSource,
//   fileList,
//   setFileList,
//   setSource,
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
//   id,
//   page,
//   pageSize,
//   Cat_id
// }) {
//   const [form] = Form.useForm();
//   const dispatch = useDispatch();
//   const { all_courses_categories_list, get_categories_parts_list, get_categories_parts_loading } =
//     useSelector((state) => state?.categories);
//   const { store_round, add_round_loading, edit_round_loading } = useSelector(
//     (state) => state?.rounds
//   );
//   const { teachers_list } = useSelector((state) => state?.teachers);
//   // const searchParams = new URLSearchParams(typeof window != undefined && typeof window != "undefined" && window.location.search);
//   const [categoriesOptions, setCategoriesOptions] = useState([]);
//   const [categoriesPartOptions, setCategoriesPartOptions] = useState([]);
//   const [selectedOption, setSelectedOption] = useState(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [teacherOptions, setTeacherOptions] = useState([]);
//   const [validationErrors, setValidationErrors] = useState([]);
//   const [touchedFields, setTouchedFields] = useState({});
//   const [courseBookFileList, setCourseBookFileList] = useState([]);
//   const [extraPdfFileList, setExtraPdfFileList] = useState([]);
//   const [oldFilesToDelete, setOldFilesToDelete] = useState({
//     image: false,
//     round_book: false,
//     round_road_map_book: false,
//   });
//   const [isInitialized, setIsInitialized] = useState(false);
//   const router = useRouter();

//   const isEditMode = Boolean(id);

//   const getFieldLabel = (fieldName) => {
//     const labels = {
//       name: "اسم الدورة",
//       price: "السعر",
//       category: "الفئة",
//       section: "القسم",
//       description: "وصف الدورة",
//       genderPolicy: "سياسة النوع",
//       capacity: "السعة القصوى",
//       instructor: "المدربين",
//       availableRange: "فترة إتاحة الدورة",
//       goal: "الهدف",
//       terms_condition: "الشروط والأحكام",
//       image: "صورة الدورة",
//       time: "وقت الدورة",
//     };
//     return labels[fieldName] || fieldName;
//   };

//   /* ====================== Load teachers / categories ====================== */
//   useEffect(() => {
//     dispatch(handleGetAllTeachers());
//   }, [dispatch]);

//   useEffect(() => {
//     console.log(teachers_list?.data?.message)
//     if (teachers_list?.data?.message) {
//       setTeacherOptions(
//         teachers_list.data.message.map((item) => ({
//           label: item?.name,
//           value: item?.id,
//         }))
//       );
//     }
//   }, [teachers_list]);

//   useEffect(() => {
//     dispatch(handleGetAllCoursesCategories({}));
//   }, [dispatch]);

//   useEffect(() => {
//     if (all_courses_categories_list?.data?.message?.data) {
//       setCategoriesOptions(
//         all_courses_categories_list.data.message.data.map((item) => ({
//           label: item?.name,
//           value: item?.id,
//         }))
//       );
//     }
//   }, [all_courses_categories_list]);

//   useEffect(() => {
//     if (selectedCategory) {
//       const data_send = {
//         course_category_id: selectedCategory,
//       };
//       dispatch(handleGetCategoryParts({ body: data_send }));
//     }
//   }, [selectedCategory, dispatch]);

//   const quillModules = {
//     toolbar: [
//       [{ header: [1, 2, 3, false] }],
//       ["bold", "italic", "underline"],
//       [{ list: "ordered" }, { list: "bullet" }],
//       [{ align: [] }],
//       ["link"],
//       ["clean"],
//     ],
//   };

//   const quillFormats = [
//     "header",
//     "bold",
//     "italic",
//     "underline",
//     "list",
//     "bullet",
//     "align",
//     "link",
//   ];

//   const isQuillEmpty = (value) => {
//     if (!value) return true;
//     const plain = value
//       .replace(/<[^>]+>/g, "")
//       .replace(/&nbsp;/g, " ")
//       .trim();
//     return plain.length === 0;
//   };

//   // useEffect(() => {
//   //   if (get_categories_parts_list?.data?.message) {
//   //     console.log("get_categories_parts_list", get_categories_parts_list?.data?.message);
//   //     const options = get_categories_parts_list.data.message
//   //       .filter((item) => Number(item?.course_category_id) === Number(selectedCategory))
//   //       .map((part) => ({
//   //         label: part?.name,
//   //         value: part?.id,
//   //       }));
//   //     setCategoriesPartOptions(options || []);
//   //   } else {
//   //     setCategoriesPartOptions([]);
//   //   }
//   // }, [get_categories_parts_list, selectedCategory]);

//   // Add this useEffect to update section options when category changes
// useEffect(() => {
//   if (selectedCategory && get_categories_parts_list?.data?.message) {
//     const options = get_categories_parts_list.data.message
//       .filter((item) => 
//         Number(item?.course_category_id) === Number(selectedCategory)
//       )
//       .map((part) => ({
//         label: part?.name,
//         value: part?.id,
//       }));
    
//     setCategoriesPartOptions(options || []);
    
//     // Clear section if it doesn't belong to new category
//     const currentSection = form.getFieldValue("section");
//     if (currentSection && !options.find(opt => opt.value === currentSection)) {
//       form.setFieldsValue({ section: undefined });
//     }
//   }
// }, [selectedCategory, get_categories_parts_list, form]);
//   /* ====================== Handle file changes ====================== */
//   const handleFileChange = ({ fileList: newFileList }) => {
//     setFileList(newFileList);

//     if (newFileList.length > 0) {
//       const file = newFileList[0];
//       if (file.originFileObj) {
//         const previewUrl = URL.createObjectURL(file.originFileObj);
//         setImagePreview(previewUrl);
//         if (isEditMode && rowData?.image_url) {
//           setOldFilesToDelete(prev => ({ ...prev, image: true }));
//         }
//       } else if (file.url) {
//         setImagePreview(file.url);
//       }
//     } else {
//       setImagePreview(null);
//       if (isEditMode && rowData?.image_url) {
//         setOldFilesToDelete(prev => ({ ...prev, image: true }));
//       }
//     }

//     validateImageField(newFileList);
//   };

//   const handleRemoveFile = () => {
//     setFileList([]);
//     setImagePreview(null);
//     if (isEditMode && rowData?.image_url) {
//       setOldFilesToDelete(prev => ({ ...prev, image: true }));
//     }
//     validateImageField([]);
//   };

//   const handleCourseBookChange = ({ fileList: newFileList }) => {
//     setCourseBookFileList(newFileList);
//     form.setFieldsValue({ courseBook: newFileList });
//   };

//   const handleExtraPdfChange = ({ fileList: newFileList }) => {
//     setExtraPdfFileList(newFileList);
//     form.setFieldsValue({ extraPdf: newFileList });
//   };

//   const validateImageField = (files) => {
//     if (!files || files.length === 0) {
//       if (!isEditMode || !rowData?.image_url) {
//         if (!touchedFields.image) {
//           setTouchedFields((prev) => ({ ...prev, image: true }));
//         }
//         return false;
//       }
//     }
//     return true;
//   };

//   /* ====================== Field change handlers ====================== */
//   const handleFieldChange = (fieldName, value) => {
//     setTouchedFields((prev) => ({ ...prev, [fieldName]: true }));

//     if (fieldName === "goal" || fieldName === "terms_condition") {
//       validateQuillField(value, fieldName);
//     }
//   };

//   const validateQuillField = (value, fieldName) => {
//     if (isQuillEmpty(value)) {
//       if (!validationErrors.includes(fieldName) && touchedFields[fieldName]) {
//         setValidationErrors((prev) => [...prev, fieldName]);
//       }
//     } else {
//       setValidationErrors((prev) => prev.filter((err) => err !== fieldName));
//     }
//   };

//   /* ====================== Prefill when editing ====================== */
//   useEffect(() => {
//     console.log(rowData);
//     if (id && rowData) {
//       const formValues = {
//         name: rowData.name || "",
//         price: rowData.price || 0,
//         category: rowData.course_category_id || rowData.category_id || "",
//         section: rowData.category_part_id || "",
//         description: rowData.description || "",
//         genderPolicy: rowData.gender || "both",
//         capacity: rowData.capacity || 20,
//         instructor: rowData?.teachers?.map(item => item?.id) || [],
//         free: Boolean(rowData.free == "1" ?? false) ,
//         active: Boolean(rowData.active ?? true),
//         goal: rowData.goal || "",
//         // terms_condition: rowData.terms_condition || "",
//         certificate: Boolean(
//           rowData?.have_certificate == "1" ?? false
//         ),
//       };
//       if (rowData?.category_part_id) {
//   // Set form value directly, don't use selectedOption state
//   form.setFieldsValue({ section: rowData.category_part_id });
// }
//       // setSelectedOption(rowData?.category_part_id);

//       if (rowData.start_date && rowData.end_date) {
//         formValues.availableRange = [
//           dayjs(rowData.start_date),
//           dayjs(rowData.end_date),
//         ];
//       }

//       if (rowData.time || rowData.duration_time || rowData.time_show) {
//         const timeValue = rowData.time || rowData.duration_time || rowData.time_show;
//         const parsedTime = dayjs(timeValue, "HH:mm:ss");
//         if (parsedTime.isValid()) {
//           formValues.time = parsedTime;
//         }
//       }

//       form.setFieldsValue(formValues);

//       if (formValues.category) {
//         setSelectedCategory(formValues.category);
//       }
//       // if (formValues.section || rowData?.category_part_id) {
//       //   setSelectedOption(formValues.section || rowData?.category_part_id);
//       // }

//       if (rowData?.image_url && fileList.length === 0) {
//         const fakeFile = {
//           uid: `image-${rowData.id}`,
//           name: "course-cover",
//           status: "done",
//           url: rowData.image_url,
//         };
//         setFileList([fakeFile]);
//         setImagePreview(rowData.image_url);
//       }

//       setIsInitialized(true);
//     }
//   }, [rowData, id, form, fileList, setFileList, setImagePreview, setSelectedCategory,
//     courseBookFileList, extraPdfFileList, isInitialized, isEditMode]);

//   useEffect(() => {
//     if (store_round && !rowData) {
//       const formValues = {
//         name: store_round.name || "",
//         price: store_round.price || 0,
//         category: store_round.course_category_id || store_round.category_id || "",
//         section: store_round.category_part_id || "",
//         description: store_round.description || "",
//         genderPolicy: store_round.gender || "both",
//         capacity: store_round.capacity || 20,
//         instructor: store_round?.instructor || [],
//         free: Boolean(store_round?.free),
//         active: Boolean(store_round?.active ?? true),
//         goal: store_round?.goal || "",
//         // terms_condition: store_round?.terms_condition || "",
//         certificate: Boolean(
//           store_round?.certificate ?? store_round?.have_certificate == "1" ?? store_round?.hasCertificate ?? false
//         ),
//       };

//       if (store_round.start_date && store_round.end_date) {
//         formValues.availableRange = [
//           dayjs(store_round.start_date),
//           dayjs(store_round.end_date),
//         ];
//       }

//       if (store_round.time_show || store_round.time) {
//         const timeValue = store_round.time_show || store_round.time;
//         const parsedTime = dayjs(timeValue, "HH:mm:ss");
//         if (parsedTime.isValid()) {
//           formValues.time = parsedTime;
//         }
//       }

//       form.setFieldsValue(formValues);

//       if (formValues.category) {
//         setSelectedCategory(formValues.category);
//       }
//       if (formValues.section) {
//         setSelectedOption(formValues.section);
//       }

//       setIsInitialized(true);
//     }
//   }, [store_round, form, setSelectedCategory,
//     rowData, isInitialized, setCourseBookFileList, setExtraPdfFileList]);

//   /* ====================== Validation ====================== */
//   const validateFormBeforeSubmit = (values) => {
//     const errors = [];

//     // Always required fields
//     if (!values.name?.trim()) errors.push("name");
//     if (values.price === undefined || values.price === null || values.price === "") errors.push("price");
//     if (!values.category) errors.push("category");
//     if (!values.section) errors.push("section");
//     if (!values.genderPolicy) errors.push("genderPolicy");
//     if (!values.capacity) errors.push("capacity");
//     // if (!values.instructor || values.instructor.length === 0) errors.push("instructor");

//     // Conditionally required based on isSource
//     if (isSource) {
//       // if (!values.description?.trim()) errors.push("description");
//       // If isSource is true, make these fields required
//       if (!values.instructor || values.instructor.length === 0) errors.push("instructor")

//       if (!values.availableRange || values.availableRange.length !== 2) {
//         errors.push("availableRange");
//       } else {
//         const [start, end] = values.availableRange;
//         if (!isDayjsValid(start) || !isDayjsValid(end)) {
//           errors.push("availableRange");
//         } else if (end.isBefore(start)) {
//           errors.push("availableRange");
//           toast.error("تاريخ النهاية يجب أن يكون بعد تاريخ البداية");
//         }
//       }

//       if (!values.time || !isDayjsValid(values.time)) {
//         errors.push("time");
//       }
//     }
//     // If isSource is false, these fields remain optional (no validation)

//     if (isQuillEmpty(values.goal)) {
//       errors.push("goal");
//     }

//     if (!isEditMode && (!fileList || fileList.length === 0)) {
//       errors.push("image");
//     }

//     return errors;
//   };

//   const showValidationToast = (errors) => {
//     if (errors.length === 0) return;

//     const errorMessages = errors.map((err) => getFieldLabel(err));
//     const errorText = `الحقول التالية مطلوبة: ${errorMessages.join("، ")}`;

//     toast.error(errorText, {
//       position: "top-center",
//       autoClose: 5000,
//       hideProgressBar: false,
//       closeOnClick: true,
//       pauseOnHover: true,
//       draggable: true,
//       progress: undefined,
//     });
//   };

//   const getFileObject = (fileItem) => {
//     if (fileItem.originFileObj) {
//       return fileItem.originFileObj;
//     }
//     if (fileItem.response) {
//       return fileItem.response;
//     }
//     return null;
//   };

//   /* ====================== Submit ====================== */
//   async function handleSubmit(values) {
//     try {
//       setIsSubmitting(true);

//       const allFields = [
//         "name",
//         "price",
//         "category",
//         "section",
//         "genderPolicy",
//         "capacity",
//         "instructor",
//         "goal",
//         "image",
//       ];

//       // Add conditional fields based on isSource
//       if (isSource) {
//         allFields.push("availableRange", "time");
//       }

//       const touchedAll = {};
//       allFields.forEach((field) => (touchedAll[field] = true));
//       setTouchedFields(touchedAll);

//       const validationErrors = validateFormBeforeSubmit(values);

//       if (validationErrors.length > 0) {
//         setValidationErrors(validationErrors);
//         showValidationToast(validationErrors);
//         setIsSubmitting(false);

//         const firstError = validationErrors[0];
//         const element = document.querySelector(`[data-field="${firstError}"]`);
//         if (element) {
//           element.scrollIntoView({ behavior: "smooth", block: "center" });
//         }

//         return;
//       }

//       setValidationErrors([]);

//       const range = Array.isArray(values?.availableRange) ? values.availableRange : [];
//       const start = range[0] || null;
//       const end = range[1] || null;

//       const hasStart = isDayjsValid(start);
//       const hasEnd = isDayjsValid(end);

//       const timeString =
//         values.time && isDayjsValid(values.time)
//           ? values.time.format("HH:mm:ss")
//           : null;

//       let courseBookFile = null;
//       if (courseBookFileList.length > 0) {
//         const fileItem = courseBookFileList[0];
//         courseBookFile = getFileObject(fileItem);
//       }

//       let extraPdfFile = null;
//       if (extraPdfFileList.length > 0) {
//         const fileItem = extraPdfFileList[0];
//         extraPdfFile = getFileObject(fileItem);
//       }

//       let imageFile = null;
//       if (fileList && fileList.length > 0) {
//         const file = fileList[0];
//         imageFile = getFileObject(file);
//       }

//       if (!isEditMode && !imageFile) {
//         toast.error("يجب رفع صورة صالحة للدورة");
//         setIsSubmitting(false);
//         return;
//       }

//       const formData = new FormData();
//       formData.append("name", values?.name?.trim());
//       formData.append("description", values?.description?.trim() || "");
//       formData.append("price", values?.price?.toString() || "0");
//       formData.append("have_certificate", values?.certificate ? "1" : "0");

//       if (hasStart) {
//         formData.append("start_date", dayjs(start).format("YYYY-MM-DD"));
//       } else if (isEditMode && touchedFields.availableRange) {
//         formData.append("start_date", "");
//       }

//       if (hasEnd) {
//         formData.append("end_date", dayjs(end).format("YYYY-MM-DD"));
//       } else if (isEditMode && touchedFields.availableRange) {
//         formData.append("end_date", "");
//       }

//       formData.append("gender", values.genderPolicy || "both");
//       formData.append("for", "Beginners");
//       formData.append("goal", values?.goal || "");
//       // formData.append("terms_condition", values?.terms_condition || "");
//       formData.append("course_category_id", selectedCategory?.toString());
//       const sectionValue = form.getFieldValue("section");
// formData.append("category_part_id", sectionValue?.toString());
//       // formData.append("category_part_id", selectedOption?.toString());
//       formData.append("source", isSource ? "0" : "1");
//       formData.append("capacity", values?.capacity?.toString() || "20");

//       // if (timeString) {
//       //   formData.append("time_show", timeString);
//       // } else if (isEditMode && touchedFields.time) {
//       //   formData.append("time_show", "");
//       // }

//       if (timeString) {
//         formData.append("time_show", timeString);
//       } else  {
//         formData.append("time_show", "");
//       }

//       formData.append("teacher_id", values?.instructor?.join(",") || null);
//       formData.append("free", values?.free ? "1" : "0");
//       formData.append("active", values?.active ? "1" : "0");

//       if (isEditMode) {
//         formData.append("id", rowData?.id?.toString());

//         if (imageFile) {
//           formData.append("image", imageFile);
//         } else if (oldFilesToDelete.image) {
//           formData.append("image", "");
//         }

//         if (courseBookFile) {
//           formData.append("round_book", courseBookFile);
//         } else if (oldFilesToDelete.round_book) {
//           // formData.append("round_book", "");
//         } else if (rowData?.round_book_url && !oldFilesToDelete.round_book) {
//           // formData.append("round_book", rowData.round_book_url);
//         } else {
//           // formData.append("round_book", "");
//         }

//         if (extraPdfFile) {
//           formData.append("round_road_map_book", extraPdfFile);
//         } else if (oldFilesToDelete.round_road_map_book) {
//           // formData.append("round_road_map_book", "");
//         } else if (rowData?.round_road_map_book_url && !oldFilesToDelete.round_road_map_book) {
//           // formData.append("round_road_map_book", rowData.round_road_map_book_url);
//         } else {
//           // formData.append("round_road_map_book", "");
//         }
//       } else {
//         if (imageFile) {
//           formData.append("image", imageFile);
//         }
//         if (courseBookFile) {
//           formData.append("round_book", courseBookFile);
//         } else {
//           formData.append("round_book", "");
//         }
//         if (extraPdfFile) {
//           formData.append("round_road_map_book", extraPdfFile);
//         } else {
//           formData.append("round_road_map_book", "");
//         }

//         const startStr = hasStart ? dayjs(start).format("YYYY-MM-DD") : "";
//         const endStr = hasEnd ? dayjs(end).format("YYYY-MM-DD") : "";

//         dispatch(add_round_data({
//           ...values,
//           course_category_id: selectedCategory,
//           category_part_id: selectedOption,
//           teacher_id: values?.instructor?.join(',') || null,
//           start_date: startStr,
//           end_date: endStr,
//           time_show: timeString || "",
//           description: values?.description || "",
//           certificate: values?.certificate ? 1 : 0,
//           round_road_map_book: extraPdfFile,
//           round_book: courseBookFile,
//           goal: values?.goal || "",
//           // terms_condition: values?.terms_condition || ""
//         }));
//       }

//       const result = await dispatch(
//         isEditMode
//           ? handleEditBaiskRound({ body: formData })
//           : handleAddBaiskRound({ body: formData })
//       ).unwrap();

//       if (result?.data?.status == "success") {
//       const url = new URL(window.location);
//       url.searchParams.set("round_id", result?.data?.message?.round_id || rowData?.id || id);
//       window.history.replaceState({}, "", url);
    
//         const roundIdValue = result?.data?.message?.round_id || rowData?.id || id;
//         setRoundId(roundIdValue);
//         dispatch(handleGetSourceRound({ page, per_page: 100000 }));
//         dispatch(handleGetAllRounds({
//           course_category_id: Cat_id,
//           page,
//           per_page: 6
//         }))
//         if (isEditMode && result?.data?.status == "success") {
//           toast.success(
//             result?.data?.message?.message || "تم تحديث الدورة بنجاح"
//           );
//           setOldFilesToDelete({
//             image: false,
//             round_book: false,
//             round_road_map_book: false,
//           });
//         } else {
//           toast.success(result?.data?.message || "تم إضافة الدورة بنجاح");
//         }
//         goToNextStep();
//       } 
//       else {
//         console.log("errorrrr", result);
//         toast.error(
//           result?.error?.response?.data?.message || "حدث خطأ أثناء حفظ البيانات"
//         );
//       }
//     } catch (error) {
//       console.error("Submission error:", error);
//       toast.error("حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى");
//     } finally {
//       setIsSubmitting(false);
//     }
//   }

//   const disabledDate = (current) => {
//     return current && current < dayjs().startOf("day");
//   };

//   function handleSubmitFailed(errorInfo) {
//     console.log("Form submission failed:", errorInfo);

//     const errorFields = errorInfo.errorFields
//       .map((field) => field.name[0])
//       .flat();
//     const uniqueErrors = [...new Set(errorFields)];

//     const errorMessages = uniqueErrors.map((field) => getFieldLabel(field));
//     const errorText = `يرجى مراجعة الحقول التالية: ${errorMessages.join("، ")}`;

//     toast.error(errorText, {
//       position: "top-center",
//       autoClose: 5000,
//     });

//     const touched = {};
//     uniqueErrors.forEach((field) => (touched[field] = true));
//     setTouchedFields((prev) => ({ ...prev, ...touched }));
//   }

//   const hasError = (fieldName) => {
//     return validationErrors.includes(fieldName) && touchedFields[fieldName];
//   };

//   // Helper function to get label based on isSource
//   const getFieldLabelWithOptional = (fieldName) => {
//     const baseLabel = getFieldLabel(fieldName);
//     if (isSource) {
//       return `${baseLabel} *`;
//     }
//     return `${baseLabel} ${fieldName === 'description' || fieldName === 'availableRange' || fieldName === 'time' ? '(اختياري)' : '*'}`;
//   };

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
//           certificate: false,
//           price: 0,
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
//           <div className="lg:col-span-1" data-field="image">
//             <Form.Item
//               label={
//                 <span className="font-semibold text-gray-700 flex items-center gap-2">
//                   <InboxOutlined className="text-blue-600" />
//                   {getFieldLabelWithOptional("image")}
//                 </span>
//               }
//               required={!isEditMode}
//               validateStatus={hasError("image") ? "error" : ""}
//               help={hasError("image") ? "صورة الدورة مطلوبة" : null}
//             >
//               <Dragger
//                 accept=".jpg,.jpeg,.png"
//                 multiple={false}
//                 maxCount={1}
//                 beforeUpload={beforeUpload}
//                 fileList={fileList}
//                 onChange={handleFileChange}
//                 onRemove={handleRemoveFile}
//                 listType="picture"
//                 className={`border-2 border-dashed rounded-xl ${hasError("image")
//                   ? "border-red-400 bg-red-50/50"
//                   : "border-blue-300 hover:border-blue-400 bg-blue-50/50"
//                   }`}
//               >
//                 <p className="ant-upload-drag-icon">
//                   <InboxOutlined
//                     className={`text-4xl ${hasError("image") ? "text-red-500" : "text-blue-500"
//                       }`}
//                   />
//                 </p>
//                 <p className="ant-upload-text font-medium text-gray-700">
//                   {isEditMode && rowData?.image_url ? "تغيير الصورة" : "اسحب الصورة هنا أو اضغط للاختيار"}
//                 </p>
//                 <p className="ant-upload-hint text-gray-500">
//                   الحجم الأقصى 5MB - صيغ مدعومة: JPG, PNG
//                 </p>
//               </Dragger>
//             </Form.Item>
//           </div>

//           {/* Basic Details */}
//           <div className="lg:col-span-2 space-y-6">
//             <Row gutter={16}>
//               <Col span={12} data-field="name">
//                 <Form.Item
//                   label={
//                     <span className="font-semibold text-gray-700 flex items-center gap-2">
//                       <BookOutlined className="text-green-600" />
//                       {getFieldLabelWithOptional("name")}
//                     </span>
//                   }
//                   name="name"
//                   rules={[
//                     { required: true, message: "أدخل اسم الدورة" },
//                     { min: 3, message: "الاسم لا يقل عن 3 أحرف" },
//                   ]}
//                   validateStatus={hasError("name") ? "error" : ""}
//                 >
//                   <Input
//                     placeholder="مثال: دورة البرمجة المتقدمة"
//                     className={`rounded-xl ${hasError("name")
//                       ? "border-red-400"
//                       : "border-gray-300 hover:border-blue-400 focus:border-blue-500"
//                       }`}
//                     onChange={(e) => handleFieldChange("name", e.target.value)}
//                   />
//                 </Form.Item>
//               </Col>
//               <Col span={12} data-field="price">
//                 <Form.Item
//                   label={
//                     <span className="font-semibold text-gray-700 flex items-center gap-2">
//                       <DollarOutlined className="text-orange-600" />
//                       {getFieldLabelWithOptional("price")}
//                     </span>
//                   }
//                   name="price"
//                   rules={[
//                     { required: true, message: "أدخل السعر" },
//                     { type: "number", min: 0, message: "السعر لا يقل عن 0" },
//                   ]}
//                   validateStatus={hasError("price") ? "error" : ""}
//                 >
//                   <InputNumber
//                     className={`w-full rounded-xl ${hasError("price") ? "border-red-400" : ""
//                       }`}
//                     placeholder="499"
//                     min={0}
//                     step={1}
//                     formatter={(value) =>
//                       `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
//                     }
//                     parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
//                     onChange={(value) => handleFieldChange("price", value)}
//                   />
//                 </Form.Item>
//               </Col>
//             </Row>

//             <Row gutter={16}>
//               <Col span={12} data-field="category">
//                 <Form.Item
//                   label={
//                     <span className="font-semibold text-gray-700 flex items-center gap-2">
//                       <FolderOutlined className="text-purple-600" />
//                       {getFieldLabelWithOptional("category")}
//                     </span>
//                   }
//                   name="category"
//                   rules={[{ required: true, message: "اختر الفئة" }]}
//                   validateStatus={hasError("category") ? "error" : ""}
//                 >
//                   <Select
//                     placeholder="اختر فئة الدورة"
//                     className={`rounded-xl ${hasError("category") ? "border-red-400" : ""
//                       }`}
//                     // onChange={(value) => {
//                     //   setSelectedCategory(value);
//                     //   handleFieldChange("category", value);
//                     //   form.setFieldsValue({ section: undefined });
//                     //   setSelectedOption(null);
//                     //   setValidationErrors((prev) =>
//                     //     prev.filter((err) => err !== "section")
//                     //   );
//                     // }}
//                     // In category Select onChange:
// onChange={(value) => {
//   setSelectedCategory(value);
//   handleFieldChange("category", value);
//   // Clear section when category changes
//   form.setFieldsValue({ section: undefined });
//   setValidationErrors((prev) =>
//     prev.filter((err) => err !== "section")
//   );
// }}
//                     options={categoriesOptions}
//                   />
//                 </Form.Item>
//               </Col>
//               <Col span={12} data-field="section">
//                 <Form.Item
//                   label={
//                     <span className="font-semibold text-gray-700 flex items-center gap-2">
//                       <BookOutlined className="text-indigo-600" />
//                       {getFieldLabelWithOptional("section")}
//                     </span>
//                   }
//                   name="section"
//   rules={[{ required: true, message: "اختر القسم" }]}
//   validateStatus={hasError("section") ? "error" : ""}
//                   // name="section"
//                   // rules={[{ required: true, message: "اختر القسم" }]}
//                   // validateStatus={hasError("section") ? "error" : ""}
//                 >
//                   <Select
//                     loading={get_categories_parts_loading}
//     placeholder="اختر قسم من الفئة"
//     className={`rounded-xl ${hasError("section") ? "border-red-400" : ""}`}
//     disabled={!selectedCategory || get_categories_parts_loading}
//     onChange={(value) => {
//       form.setFieldsValue({ section: value });
//       handleFieldChange("section", value);
//     }}
//     options={categoriesPartOptions}
//     notFoundContent={
//       !selectedCategory
//         ? "يرجى اختيار الفئة أولاً"
//         : "لا توجد أقسام لهذه الفئة"
//     }
//                   />
//                 </Form.Item>
//               </Col>
//             </Row>

//             <Form.Item
//               label={
//                 <span className="font-semibold text-gray-700 flex items-center gap-2">
//                   <FileTextOutlined className="text-gray-600" />
//                   {getFieldLabelWithOptional("description")}
//                 </span>
//               }
//               name="description"
              
//               validateStatus={hasError("description") ? "error" : ""}
//               data-field="description"
//             >
//               <TextArea
//                 rows={4}
//                 placeholder={isSource ? "اكتب وصفاً شاملاً للدورة وأهدافها التعليمية..." : "اكتب وصفاً شاملاً للدورة وأهدافها التعليمية... (اختياري)"}
//                 className={`rounded-xl ${hasError("description")
//                   ? "border-red-400"
//                   : "border-gray-300 hover:border-blue-400 focus:border-blue-500"
//                   }`}
//                 showCount
//                 onChange={(e) =>
//                   handleFieldChange("description", e.target.value)
//                 }
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
//             <Col span={8} data-field="genderPolicy">
//               <Form.Item
//                 label={
//                   <span className="font-semibold text-gray-700 flex items-center gap-2">
//                     <UserOutlined className="text-pink-600" />
//                     {getFieldLabelWithOptional("genderPolicy")}
//                   </span>
//                 }
//                 name="genderPolicy"
//                 rules={[{ required: true, message: "اختر السياسة" }]}
//                 validateStatus={hasError("genderPolicy") ? "error" : ""}
//               >
//                 <Select
//                   className={`rounded-xl ${hasError("genderPolicy") ? "border-red-400" : ""
//                     }`}
//                   options={[
//                     { label: "👨 للذكور فقط", value: "male" },
//                     { label: "👩 للإناث فقط", value: "female" },
//                     { label: "👥 للجميع", value: "both" },
//                   ]}
//                   onChange={(value) => handleFieldChange("genderPolicy", value)}
//                 />
//               </Form.Item>
//             </Col>
//             <Col span={8} data-field="capacity">
//               <Form.Item
//                 label={
//                   <span className="font-semibold text-gray-700 flex items-center gap-2">
//                     <TeamOutlined className="text-red-600" />
//                     {getFieldLabelWithOptional("capacity")}
//                   </span>
//                 }
//                 name="capacity"
//                 rules={[{ required: true, message: "أدخل السعة القصوى" }]}
//                 validateStatus={hasError("capacity") ? "error" : ""}
//               >
//                 <InputNumber
//                   className={`w-full rounded-xl ${hasError("capacity") ? "border-red-400" : ""
//                     }`}
//                   placeholder="50"
//                   min={1}
//                   onChange={(value) => handleFieldChange("capacity", value)}
//                 />
//               </Form.Item>
//             </Col>
//             <Col span={8} data-field="instructor">
//               <Form.Item
//                 label={
//                   <span className="font-semibold text-gray-700 flex items-center gap-2">
//                     <UserOutlined className="text-cyan-600" />
//                     {getFieldLabelWithOptional("instructor")}
//                   </span>
//                 }
//                 name="instructor"
//                 rules={isSource ? [
//                   { required: true, message: "اختر المدربين"}
//                 ] : []}
//                 validateStatus={hasError("instructor") ? "error" : ""}
//               >
//                 <Select
//                   mode="multiple"
//                   className={`rounded-xl ${hasError("instructor") ? "border-red-400" : ""
//                     }`}
//                   placeholder="اختر المدربين"
//                   options={teacherOptions}
//                   onChange={(value) => handleFieldChange("instructor", value)}
//                 />
//               </Form.Item>
//             </Col>
//           </Row>

//           <Row gutter={24}>
//             <Col span={12} data-field="availableRange">
//               <Form.Item
//                 label={
//                   <div>
//                     <span className="font-semibold text-gray-700 flex items-center gap-2">
//                       <CalendarOutlined className="text-green-600" />
//                       {getFieldLabelWithOptional("availableRange")}
//                     </span>
//                     <p className="text-xs text-gray-500 mt-1 mb-2">
//                       تاريخ بداية الدورة - تاريخ نهاية الدورة
//                     </p>
//                   </div>
//                 }
//                 name="availableRange"
//                 rules={isSource ? [
//                   { required: true, message: "حدد فترة إتاحة الدورة" }
//                 ] : []}
//                 validateStatus={hasError("availableRange") ? "error" : ""}
//               >
//                 <RangePicker
//                   className={`w-full rounded-xl ${hasError("availableRange") ? "border-red-400" : ""
//                     }`}
//                   placeholder={["تاريخ البداية", "تاريخ النهاية"]}
//                   format="DD/MM/YYYY"
//                   disabledDate={disabledDate}
//                   onChange={(dates) => handleFieldChange("availableRange", dates)}
//                 />
//               </Form.Item>
//             </Col>
//             <Col span={12} data-field="time">
//               <Form.Item
//                 label={
//                   <div>
//                     <span className="font-semibold text-gray-700 flex items-center gap-2">
//                       <ClockCircleOutlined className="text-blue-600" />
//                       {getFieldLabelWithOptional("time")}
//                     </span>
//                     <p className="text-xs text-gray-500 mt-1 mb-2">
//                       وقت عرض الدورة (مثلا : 14:00:00)
//                     </p>
//                   </div>
//                 }
//                 name="time"
//                 rules={isSource ? [
//                   { required: true, message: "حدد وقت الدورة" }
//                 ] : []}
//                 validateStatus={hasError("time") ? "error" : ""}
//               >
//                 <TimePicker
//                   className={`w-full rounded-xl ${hasError("time") ? "border-red-400" : ""
//                     }`}
//                   format="HH:mm:ss"
//                   placeholder={isSource ? "اختر وقت الدورة" : "اختر وقت الدورة (اختياري)"}
//                   onChange={(value) => handleFieldChange("time", value)}
//                 />
//               </Form.Item>
//             </Col>
//           </Row>

//           <Row gutter={24}>
//             <Col span={8}>
//               <Form.Item
//                 label={<span className="font-semibold text-gray-700 flex items-center gap-2">مجاني</span>}
//                 name="free"
//                 valuePropName="checked"
//               >
//                 <Switch onChange={(v) => handleFieldChange("free", v)} />
//               </Form.Item>
//             </Col>

//             {/* <Col span={8}>
//               <Form.Item
//                 label={<span className="font-semibold text-gray-700 flex items-center gap-2">نشط</span>}
//                 name="active"
//                 valuePropName="checked"
//               >
//                 <Switch onChange={(v) => handleFieldChange("active", v)} />
//               </Form.Item>
//             </Col> */}

//             <Col span={8}>
//               <Form.Item
//                 label={<span className="font-semibold text-gray-700 flex items-center gap-2">شهادة</span>}
//                 name="certificate"
//                 valuePropName="checked"
//               >
//                 <Switch onChange={(v) => handleFieldChange("certificate", v)} />
//               </Form.Item>
//             </Col>
//           </Row>

//           <Row gutter={24}>
//             <Col span={24} data-field="goal">
//               <Form.Item
//                 label={
//                   <span className="font-semibold text-gray-700 flex items-center gap-2">
//                     <FileTextOutlined className="text-green-600" />
//                     {getFieldLabelWithOptional("goal")}
//                   </span>
//                 }
//                 className="min-h-44"
//                 name="goal"
//                 validateStatus={hasError("goal") ? "error" : ""}
//                 help={hasError("goal") ? "أدخل الهدف" : null}
//               >
//                 <div
//                   className={`bg-white  rounded-xl ${hasError("goal") ? "border border-red-400" : ""
//                     }`}
//                 >
//                   <ReactQuill
//                     theme="snow"
//                     modules={quillModules}
//                     formats={quillFormats}
//                     placeholder="اكتب الهدف من الدورة بالتفصيل (مثلاً: ماذا يتعلم الطالب، النتائج المتوقعة، الجمهور المستهدف)..."
//                     className="!min-h-44"
//                     value={form.getFieldValue("goal")}
//                     onChange={(value) => {
//                       form.setFieldsValue({ goal: value });
//                       handleFieldChange("goal", value);
//                       validateQuillField(value, "goal");
//                     }}
//                   />
//                 </div>
//               </Form.Item>
//             </Col>

        
//           </Row>

//           {/* كتاب الدورة */}
//           <div className="flex flex-col gap-2">
//             <Form.Item
//               label={
//                 <span className="font-semibold text-gray-700 flex items-center gap-2">
//                   <FileTextOutlined className="text-cyan-600" />
//                   كتاب الدورة (اختياري)
//                 </span>
//               }
//               name="courseBook"
//               valuePropName="fileList"
//               getValueFromEvent={normFile}
//             >
//               <Dragger
//               maxCount={1}
//                 multiple={false}
//                 accept=".pdf,.doc,.docx,.txt"
//                 beforeUpload={customBeforeUpload}
//                 fileList={courseBookFileList}
//                 onChange={handleCourseBookChange}
//                 onRemove={(file) => {
//                   return true;
//                 }}
//               >
//                 <p className="ant-upload-drag-icon">
//                   <InboxOutlined />
//                 </p>
//                 <p className="ant-upload-text">
//                   {isEditMode && rowData?.round_book_url ? "تغيير كتاب الدورة" : "اسحب ملف كتاب الدورة هنا أو اضغط للاختيار (اختياري)"}
//                 </p>
//                 {courseBookFileList.length === 0 && rowData?.round_book_url && (
//                   <p className="text-sm text-gray-500 mt-2">
//                     الملف الحالي: {rowData?.round_book_name || "round-book.pdf"}
//                   </p>
//                 )}
//               </Dragger>
//             </Form.Item>
//             {courseBookFileList.length === 0 && rowData?.round_book_url && !oldFilesToDelete.round_book && (
//               <div className="flex items-center gap-2">
//                 <a
//                   href={rowData.round_book_url}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="text-blue-600 hover:text-blue-800"
//                 >
//                   عرض الملف الحالي
//                 </a>
//                 <Button
//                   type="text"
//                   danger
//                   size="small"
//                   onClick={() => {
//                     setCourseBookFileList([]);
//                     setOldFilesToDelete(prev => ({ ...prev, round_book: true }));
//                   }}
//                 >
//                   حذف الملف
//                 </Button>
//               </div>
//             )}
//           </div>

//           {/* ملف PDF إضافي */}
//           <div className="flex flex-col gap-2">
//             <Form.Item
//               label={
//                 <span className="font-semibold text-gray-700 flex items-center gap-2">
//                   <FileTextOutlined className="text-purple-600" />
//                   جدول الدورة (اختياري)
//                 </span>
//               }
//               name="extraPdf"
//               valuePropName="fileList"
//               getValueFromEvent={normFile}
//             >
//               <Dragger
//               maxCount={1}
//                 multiple={false}
//                 accept=".pdf,.doc,.docx,.txt"
//                 beforeUpload={customBeforeUpload}
//                 fileList={extraPdfFileList}
//                 onChange={handleExtraPdfChange}
//                 onRemove={(file) => {
//                   return true;
//                 }}
//               >
//                 <p className="ant-upload-drag-icon">
//                   <InboxOutlined />
//                 </p>
//                 <p className="ant-upload-text">
//                   {isEditMode && rowData?.round_road_map_book_url ? "تغيير جدول الدورة" : "اسحب ملف PDF هنا أو اضغط للاختيار (اختياري)"}
//                 </p>
//                 {extraPdfFileList.length === 0 && rowData?.round_road_map_book_url && (
//                   <p className="text-sm text-gray-500 mt-2">
//                     الملف الحالي: {rowData?.round_road_map_book_name || "road-map-book.pdf"}
//                   </p>
//                 )}
//               </Dragger>
//             </Form.Item>
//             {extraPdfFileList?.length === 0 && rowData?.round_road_map_book_url && !oldFilesToDelete?.round_road_map_book && (
//               <div className="flex items-center gap-2">
//                 <a
//                   href={rowData.round_road_map_book_url}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="text-blue-600 hover:text-blue-800"
//                 >
//                   عرض الملف الحالي
//                 </a>
//                 <Button
//                   type="text"
//                   danger
//                   size="small"
//                   onClick={() => {
//                     setExtraPdfFileList([]);
//                     setOldFilesToDelete(prev => ({ ...prev, round_road_map_book: true }));
//                   }}
//                 >
//                   حذف الملف
//                 </Button>
//               </div>
//             )}
//           </div>
//         </div>

//         <div className="mt-8 flex justify-between space-x-4 space-x-reverse">
//           <div className="mt-8 flex justify-between !ms-auto space-x-4 space-x-reverse">
//             <Button
//               size="large"
//               onClick={goToPrevStep}
//               disabled={currentStep === 1}
//               className={`rounded-lg border border-gray-300 bg-white px-6 py-2 text-gray-700 transition duration-150 hover:bg-gray-50 ${currentStep === 1 ? "cursor-not-allowed opacity-50" : ""
//                 }`}
//             >
//               السابق
//             </Button>

//             <Button
//               type="primary"
//               htmlType="submit"
//               size="large"
//               loading={add_round_loading || edit_round_loading || isSubmitting}
//               className="rounded-lg bg-blue-600 px-6 py-2 text-white shadow-md hover:bg-blue-700"
//             >
//               {add_round_loading || edit_round_loading || isSubmitting
//                 ? "جاري الحفظ..."
//                 : isEditMode
//                   ? "حفظ التعديلات"
//                   : "التالي"}
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
  TimePicker,
  Switch,
} from "antd";
import React, { useEffect, useState } from "react";
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
  FileDoneOutlined,
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
  add_round_data,
  handleGetAllRounds,
} from "../../lib/features/roundsSlice";
import { handleGetAllTeachers } from "../../lib/features/teacherSlice";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const { Dragger } = Upload;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

const normFile = (e) => {
  if (Array.isArray(e)) return e;
  return e?.fileList || [];
};

const customBeforeUpload = () => false;

const isDayjsValid = (value) => {
  if (!value) return false;
  if (dayjs.isDayjs(value)) return value.isValid();
  return false;
};

export default function AddCourseSourceBasicInfo({
  isSource,
  fileList,
  setFileList,
  setSource,
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
  page,
  pageSize,
  Cat_id
}) {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { all_courses_categories_list, get_categories_parts_list, get_categories_parts_loading } =
    useSelector((state) => state?.categories);
  const { store_round, add_round_loading, edit_round_loading } = useSelector(
    (state) => state?.rounds
  );
  const { teachers_list } = useSelector((state) => state?.teachers);
  // const searchParams = new URLSearchParams(typeof window != undefined && typeof window != "undefined" && window.location.search);
  const [categoriesOptions, setCategoriesOptions] = useState([]);
  const [categoriesPartOptions, setCategoriesPartOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [teacherOptions, setTeacherOptions] = useState([]);
  const [validationErrors, setValidationErrors] = useState([]);
  const [touchedFields, setTouchedFields] = useState({});
  const [courseBookFileList, setCourseBookFileList] = useState([]);
  const [extraPdfFileList, setExtraPdfFileList] = useState([]);
  const [oldFilesToDelete, setOldFilesToDelete] = useState({
    image: false,
    round_book: false,
    round_road_map_book: false,
  });
  const [isInitialized, setIsInitialized] = useState(false);
  const router = useRouter();

  const isEditMode = Boolean(id);

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
      terms_condition: "الشروط والأحكام",
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
    console.log(teachers_list?.data?.message)
    if (teachers_list?.data?.message) {
      setTeacherOptions(
        teachers_list.data.message.map((item) => ({
          label: item?.name,
          value: item?.id,
        }))
      );
    }
  }, [teachers_list]);

  useEffect(() => {
    dispatch(handleGetAllCoursesCategories({}));
  }, [dispatch]);

  useEffect(() => {
    if (all_courses_categories_list?.data?.message?.data) {
      setCategoriesOptions(
        all_courses_categories_list.data.message.data.map((item) => ({
          label: item?.name,
          value: item?.id,
        }))
      );
    }
  }, [all_courses_categories_list]);

  useEffect(() => {
    if (selectedCategory) {
      const data_send = {
        course_category_id: selectedCategory,
      };
      dispatch(handleGetCategoryParts({ body: data_send }));
    }
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

  // Track when category parts are loaded
  const [categoryPartsLoaded, setCategoryPartsLoaded] = useState(false);

  useEffect(() => {
    if (get_categories_parts_list?.data?.message) {
      setCategoryPartsLoaded(true);
    }
  }, [get_categories_parts_list]);

  // Update section options when category parts are loaded or category changes
  useEffect(() => {
    if (selectedCategory && get_categories_parts_list?.data?.message) {
      
      // Filter by selected category and map to options
      const options = get_categories_parts_list.data.message
        .filter((item) => {
          return Number(item?.course_category_id) === Number(selectedCategory);
        })
        .map((part) => ({
          label: part?.name,
          value: part?.id,
        }));
      
      setCategoriesPartOptions(options || []);
      
      // Check if current section exists in options
      const currentSection = form.getFieldValue("section");
      
      if (currentSection && options.length > 0) {
        const sectionExists = options.some(opt => 
          Number(opt.value) === Number(currentSection)
        );
        
        if (!sectionExists) {
          form.setFieldsValue({ section: undefined });
        }
      }
    } else {
      setCategoriesPartOptions([]);
    }
  }, [get_categories_parts_list, selectedCategory, form]);

  /* ====================== Handle file changes ====================== */
  const handleFileChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);

    if (newFileList.length > 0) {
      const file = newFileList[0];
      if (file.originFileObj) {
        const previewUrl = URL.createObjectURL(file.originFileObj);
        setImagePreview(previewUrl);
        if (isEditMode && rowData?.image_url) {
          setOldFilesToDelete(prev => ({ ...prev, image: true }));
        }
      } else if (file.url) {
        setImagePreview(file.url);
      }
    } else {
      setImagePreview(null);
      if (isEditMode && rowData?.image_url) {
        setOldFilesToDelete(prev => ({ ...prev, image: true }));
      }
    }

    validateImageField(newFileList);
  };

  const handleRemoveFile = () => {
    setFileList([]);
    setImagePreview(null);
    if (isEditMode && rowData?.image_url) {
      setOldFilesToDelete(prev => ({ ...prev, image: true }));
    }
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

    if (fieldName === "goal" || fieldName === "terms_condition") {
      validateQuillField(value, fieldName);
    }
  };

  const validateQuillField = (value, fieldName) => {
    if (isQuillEmpty(value)) {
      if (!validationErrors.includes(fieldName) && touchedFields[fieldName]) {
        setValidationErrors((prev) => [...prev, fieldName]);
      }
    } else {
      setValidationErrors((prev) => prev.filter((err) => err !== fieldName));
    }
  };

  /* ====================== Prefill when editing ====================== */
  useEffect(() => {
  console.log("rowData", rowData);
    if (id && rowData) {
      const formValues = {
        name: rowData.name || "",
        price: rowData.price || 0,
        category: rowData.course_category_id || rowData.category_id || "",
        section: rowData.category_part_id || "",
        description: rowData.description || "",
        genderPolicy: rowData.gender || "both",
        capacity: rowData.capacity || 20,
        instructor: rowData?.teachers?.map(item => item?.id) || [],
        free: Boolean(rowData?.free == "1" ?? false),
        active: Boolean(rowData?.active ?? true),
        goal: rowData?.goal || "",
        certificate: Boolean(rowData?.have_certificate == "1" ?? false),
      };

      if (rowData.start_date && rowData.end_date) {
        formValues.availableRange = [
          dayjs(rowData.start_date),
          dayjs(rowData.end_date),
        ];
      }

      if (rowData.time || rowData.duration_time || rowData.time_show) {
        const timeValue = rowData.time || rowData.duration_time || rowData.time_show;
        const parsedTime = dayjs(timeValue, "HH:mm:ss");
        if (parsedTime.isValid()) {
          formValues.time = parsedTime;
        }
      }

      // Set all form values
      form.setFieldsValue(formValues);

      // Set selected category state
      if (formValues.category) {
        setSelectedCategory(formValues.category);
      }

      // Wait a bit for category parts to load, then try to set section again
      if (formValues.section && !categoryPartsLoaded) {
        // We'll handle this in the next useEffect
      }

      if (rowData?.image_url && fileList.length === 0) {
        const fakeFile = {
          uid: `image-${rowData.id}`,
          name: "course-cover",
          status: "done",
          url: rowData.image_url,
        };
        setFileList([fakeFile]);
        setImagePreview(rowData.image_url);
      }

      setIsInitialized(true);
    }
  }, [rowData, id, form, fileList, setFileList, setImagePreview, setSelectedCategory,
    courseBookFileList, extraPdfFileList, isInitialized, isEditMode]);

  // This useEffect handles the case where section needs to be set after category parts are loaded
  useEffect(() => {
    if (isEditMode && rowData && categoryPartsLoaded) {
      const currentSection = form.getFieldValue("section");
      const expectedSection = rowData.category_part_id;

      // If section is not set but it should be, set it now
      if (!currentSection && expectedSection) {
        form.setFieldsValue({ section: expectedSection });
      }
      
      // Also check if section exists in current options
      if (currentSection && categoriesPartOptions.length > 0) {
        const exists = categoriesPartOptions.some(opt => 
          Number(opt.value) === Number(currentSection)
        );
        
        if (!exists) {
          console.log("Section doesn't exist in loaded options. Available options:", categoriesPartOptions);
        }
      }
    }
  }, [isEditMode, rowData, categoryPartsLoaded, form, categoriesPartOptions, selectedCategory]);

  useEffect(() => {
    if (store_round && !rowData) {
      const formValues = {
        name: store_round.name || "",
        price: store_round.price || 0,
        category: store_round.course_category_id || store_round.category_id || "",
        section: store_round.category_part_id || "",
        description: store_round.description || "",
        genderPolicy: store_round.gender || "both",
        capacity: store_round.capacity || 20,
        instructor: store_round?.instructor || [],
        free: Boolean(store_round?.free == "1" ?? false),
        active: Boolean(store_round?.active ?? true),
        goal: store_round?.goal || "",
        certificate: Boolean(
          store_round?.certificate ?? store_round?.have_certificate == "1" ?? store_round?.hasCertificate ?? false
        ),
      };

      if (store_round.start_date && store_round.end_date) {
        formValues.availableRange = [
          dayjs(store_round.start_date),
          dayjs(store_round.end_date),
        ];
      }

      if (store_round.time_show || store_round.time) {
        const timeValue = store_round.time_show || store_round.time;
        const parsedTime = dayjs(timeValue, "HH:mm:ss");
        if (parsedTime.isValid()) {
          formValues.time = parsedTime;
        }
      }

      form.setFieldsValue(formValues);

      if (formValues.category) {
        setSelectedCategory(formValues.category);
      }

      setIsInitialized(true);
    }
  }, [store_round, form, setSelectedCategory,
    rowData, isInitialized, setCourseBookFileList, setExtraPdfFileList]);

  /* ====================== Validation ====================== */
  const validateFormBeforeSubmit = (values) => {
    const errors = [];

    // Always required fields
    if (!values.name?.trim()) errors.push("name");
    if (values.price === undefined || values.price === null || values.price === "") errors.push("price");
    if (!values.category) errors.push("category");
    if (!values.section) errors.push("section");
    if (!values.genderPolicy) errors.push("genderPolicy");
    if (!values.capacity) errors.push("capacity");

    // Conditionally required based on isSource
    if (isSource) {
      if (!values.instructor || values.instructor.length === 0) errors.push("instructor")

      if (!values.availableRange || values.availableRange.length !== 2) {
        errors.push("availableRange");
      } else {
        const [start, end] = values.availableRange;
        if (!isDayjsValid(start) || !isDayjsValid(end)) {
          errors.push("availableRange");
        } else if (end.isBefore(start)) {
          errors.push("availableRange");
          toast.error("تاريخ النهاية يجب أن يكون بعد تاريخ البداية");
        }
      }

      if (!values.time || !isDayjsValid(values.time)) {
        errors.push("time");
      }
    }

    if (isQuillEmpty(values.goal)) {
      errors.push("goal");
    }

    if (!isEditMode && (!fileList || fileList.length === 0)) {
      errors.push("image");
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

      const allFields = [
        "name",
        "price",
        "category",
        "section",
        "genderPolicy",
        "capacity",
        "instructor",
        "goal",
        "image",
      ];

      // Add conditional fields based on isSource
      if (isSource) {
        allFields.push("availableRange", "time");
      }

      const touchedAll = {};
      allFields.forEach((field) => (touchedAll[field] = true));
      setTouchedFields(touchedAll);

      const validationErrors = validateFormBeforeSubmit(values);

      if (validationErrors.length > 0) {
        setValidationErrors(validationErrors);
        showValidationToast(validationErrors);
        setIsSubmitting(false);

        const firstError = validationErrors[0];
        const element = document.querySelector(`[data-field="${firstError}"]`);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }

        return;
      }

      setValidationErrors([]);

      const range = Array.isArray(values?.availableRange) ? values.availableRange : [];
      const start = range[0] || null;
      const end = range[1] || null;

      const hasStart = isDayjsValid(start);
      const hasEnd = isDayjsValid(end);

      const timeString =
        values.time && isDayjsValid(values.time)
          ? values.time.format("HH:mm:ss")
          : null;

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

      if (!isEditMode && !imageFile) {
        toast.error("يجب رفع صورة صالحة للدورة");
        setIsSubmitting(false);
        return;
      }

      const formData = new FormData();
      formData.append("name", values?.name?.trim());
      formData.append("description", values?.description?.trim() || "");
      formData.append("price", values?.price?.toString() || "0");
      formData.append("have_certificate", values?.certificate ? "1" : "0");

      if (hasStart) {
        formData.append("start_date", dayjs(start).format("YYYY-MM-DD"));
      } else if (isEditMode && touchedFields.availableRange) {
        formData.append("start_date", "");
      }

      if (hasEnd) {
        formData.append("end_date", dayjs(end).format("YYYY-MM-DD"));
      } else if (isEditMode && touchedFields.availableRange) {
        formData.append("end_date", "");
      }

      formData.append("gender", values.genderPolicy || "both");
      formData.append("for", "Beginners");
      formData.append("goal", values?.goal || "");
      formData.append("course_category_id", selectedCategory?.toString());
      formData.append("category_part_id", values?.section?.toString() || "");
      formData.append("source", isSource ? "0" : "1");
      formData.append("capacity", values?.capacity?.toString() || "20");

      if (timeString) {
        formData.append("time_show", timeString);
      } else  {
        formData.append("time_show", "");
      }

      formData.append("teacher_id", values?.instructor?.join(",") || "");
      formData.append("free", values?.free ? "1" : "0");
      formData.append("active", values?.active ? "1" : "0");

      if (isEditMode) {
        formData.append("id", rowData?.id?.toString());

        if (imageFile) {
          formData.append("image", imageFile);
        } else if (oldFilesToDelete.image) {
          formData.append("image", "");
        }

        if (courseBookFile) {
          formData.append("round_book", courseBookFile);
        } else if (oldFilesToDelete.round_book) {
          // formData.append("round_book", "");
        } else if (rowData?.round_book_url && !oldFilesToDelete.round_book) {
          // formData.append("round_book", rowData.round_book_url);
        } else {
          // formData.append("round_book", "");
        }

        if (extraPdfFile) {
          formData.append("round_road_map_book", extraPdfFile);
        } else if (oldFilesToDelete.round_road_map_book) {
          // formData.append("round_road_map_book", "");
        } else if (rowData?.round_road_map_book_url && !oldFilesToDelete.round_road_map_book) {
          // formData.append("round_road_map_book", rowData.round_road_map_book_url);
        } else {
          // formData.append("round_road_map_book", "");
        }
      } else {
        if (imageFile) {
          formData.append("image", imageFile);
        }
        if (courseBookFile) {
          formData.append("round_book", courseBookFile);
        } else {
          formData.append("round_book", "");
        }
        if (extraPdfFile) {
          formData.append("round_road_map_book", extraPdfFile);
        } else {
          formData.append("round_road_map_book", "");
        }

        const startStr = hasStart ? dayjs(start).format("YYYY-MM-DD") : "";
        const endStr = hasEnd ? dayjs(end).format("YYYY-MM-DD") : "";

        dispatch(add_round_data({
          ...values,
          course_category_id: selectedCategory,
          category_part_id: values?.section,
          teacher_id: values?.instructor?.join(',') || "",
          start_date: startStr,
          end_date: endStr,
          time_show: timeString || "",
          description: values?.description || "",
          certificate: values?.certificate ? 1 : 0,
          round_road_map_book: extraPdfFile,
          round_book: courseBookFile,
          goal: values?.goal || "",
        }));
      }

      const result = await dispatch(
        isEditMode
          ? handleEditBaiskRound({ body: formData })
          : handleAddBaiskRound({ body: formData })
      ).unwrap();

      if (result?.data?.status == "success") {
      const url = new URL(window.location);
      url.searchParams.set("round_id", result?.data?.message?.round_id || rowData?.id || id);
      window.history.replaceState({}, "", url);
    
        const roundIdValue = result?.data?.message?.round_id || rowData?.id || id;
        setRoundId(roundIdValue);
        dispatch(handleGetSourceRound({ page, per_page: 100000 }));
        dispatch(handleGetAllRounds({
          course_category_id: Cat_id,
          page,
          per_page: 6
        }))
        if (isEditMode && result?.data?.status == "success") {
          toast.success(
            result?.data?.message?.message || "تم تحديث الدورة بنجاح"
          );
          setOldFilesToDelete({
            image: false,
            round_book: false,
            round_road_map_book: false,
          });
        } else {
          toast.success(result?.data?.message || "تم إضافة الدورة بنجاح");
        }
        goToNextStep();
      } 
      else {
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

    const touched = {};
    uniqueErrors.forEach((field) => (touched[field] = true));
    setTouchedFields((prev) => ({ ...prev, ...touched }));
  }

  const hasError = (fieldName) => {
    return validationErrors.includes(fieldName) && touchedFields[fieldName];
  };

  // Helper function to get label based on isSource
  const getFieldLabelWithOptional = (fieldName) => {
    const baseLabel = getFieldLabel(fieldName);
    if (isSource) {
      return `${baseLabel} *`;
    }
    return `${baseLabel} ${fieldName === 'description' || fieldName === 'availableRange' || fieldName === 'time' ? '(اختياري)' : '*'}`;
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
          certificate: false,
          price: 0,
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
        {/* Debug button (temporary) */}
       

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Image Upload */}
          <div className="lg:col-span-1" data-field="image">
            <Form.Item
              label={
                <span className="font-semibold text-gray-700 flex items-center gap-2">
                  <InboxOutlined className="text-blue-600" />
                  {getFieldLabelWithOptional("image")}
                </span>
              }
              required={!isEditMode}
              validateStatus={hasError("image") ? "error" : ""}
              help={hasError("image") ? "صورة الدورة مطلوبة" : null}
            >
              <Dragger
                accept=".jpg,.jpeg,.png"
                multiple={false}
                maxCount={1}
                beforeUpload={beforeUpload}
                fileList={fileList}
                onChange={handleFileChange}
                onRemove={handleRemoveFile}
                listType="picture"
                className={`border-2 border-dashed rounded-xl ${hasError("image")
                  ? "border-red-400 bg-red-50/50"
                  : "border-blue-300 hover:border-blue-400 bg-blue-50/50"
                  }`}
              >
                <p className="ant-upload-drag-icon">
                  <InboxOutlined
                    className={`text-4xl ${hasError("image") ? "text-red-500" : "text-blue-500"
                      }`}
                  />
                </p>
                <p className="ant-upload-text font-medium text-gray-700">
                  {isEditMode && rowData?.image_url ? "تغيير الصورة" : "اسحب الصورة هنا أو اضغط للاختيار"}
                </p>
                <p className="ant-upload-hint text-gray-500">
                  الحجم الأقصى 5MB - صيغ مدعومة: JPG, PNG
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
                      {getFieldLabelWithOptional("name")}
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
                    className={`rounded-xl ${hasError("name")
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
                      {getFieldLabelWithOptional("price")}
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
                    className={`w-full rounded-xl ${hasError("price") ? "border-red-400" : ""
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
                      {getFieldLabelWithOptional("category")}
                    </span>
                  }
                  name="category"
                  rules={[{ required: true, message: "اختر الفئة" }]}
                  validateStatus={hasError("category") ? "error" : ""}
                >
                  <Select
                    placeholder="اختر فئة الدورة"
                    className={`rounded-xl ${hasError("category") ? "border-red-400" : ""
                      }`}
                    onChange={(value) => {
                      setSelectedCategory(value);
                      handleFieldChange("category", value);
                      form.setFieldsValue({ section: undefined });
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
                      {getFieldLabelWithOptional("section")}
                    </span>
                  }
                  name="section"
                  rules={[{ required: true, message: "اختر القسم" }]}
                  validateStatus={hasError("section") ? "error" : ""}
                >
                  <Select
                    loading={get_categories_parts_loading}
                    placeholder="اختر قسم من الفئة"
                    className={`rounded-xl ${hasError("section") ? "border-red-400" : ""
                      }`}
                    disabled={!selectedCategory || get_categories_parts_loading}
                    onChange={(value) => {
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
                <span className="font-semibold text-gray-700 flex items-center gap-2">
                  <FileTextOutlined className="text-gray-600" />
                  {getFieldLabelWithOptional("description")}
                </span>
              }
              name="description"
              
              validateStatus={hasError("description") ? "error" : ""}
              data-field="description"
            >
              <TextArea
                rows={4}
                placeholder={isSource ? "اكتب وصفاً شاملاً للدورة وأهدافها التعليمية..." : "اكتب وصفاً شاملاً للدورة وأهدافها التعليمية... (اختياري)"}
                className={`rounded-xl ${hasError("description")
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
                    {getFieldLabelWithOptional("genderPolicy")}
                  </span>
                }
                name="genderPolicy"
                rules={[{ required: true, message: "اختر السياسة" }]}
                validateStatus={hasError("genderPolicy") ? "error" : ""}
              >
                <Select
                  className={`rounded-xl ${hasError("genderPolicy") ? "border-red-400" : ""
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
                    {getFieldLabelWithOptional("capacity")}
                  </span>
                }
                name="capacity"
                rules={[{ required: true, message: "أدخل السعة القصوى" }]}
                validateStatus={hasError("capacity") ? "error" : ""}
              >
                <InputNumber
                  className={`w-full rounded-xl ${hasError("capacity") ? "border-red-400" : ""
                    }`}
                  placeholder="50"
                  min={1}
                  onChange={(value) => handleFieldChange("capacity", value)}
                />
              </Form.Item>
            </Col>
            <Col span={8} data-field="instructor">
              <Form.Item
                label={
                  <span className="font-semibold text-gray-700 flex items-center gap-2">
                    <UserOutlined className="text-cyan-600" />
                    {getFieldLabelWithOptional("instructor")}
                  </span>
                }
                name="instructor"
                rules={isSource ? [
                  { required: true, message: "اختر المدربين"}
                ] : []}
                validateStatus={hasError("instructor") ? "error" : ""}
              >
                <Select
                  mode="multiple"
                  className={`rounded-xl ${hasError("instructor") ? "border-red-400" : ""
                    }`}
                  placeholder="اختر المدربين"
                  options={teacherOptions}
                  onChange={(value) => handleFieldChange("instructor", value)}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={12} data-field="availableRange">
              <Form.Item
                label={
                  <div>
                    <span className="font-semibold text-gray-700 flex items-center gap-2">
                      <CalendarOutlined className="text-green-600" />
                      {getFieldLabelWithOptional("availableRange")}
                    </span>
                    <p className="text-xs text-gray-500 mt-1 mb-2">
                      تاريخ بداية الدورة - تاريخ نهاية الدورة
                    </p>
                  </div>
                }
                name="availableRange"
                rules={isSource ? [
                  { required: true, message: "حدد فترة إتاحة الدورة" }
                ] : []}
                validateStatus={hasError("availableRange") ? "error" : ""}
              >
                <RangePicker
                  className={`w-full rounded-xl ${hasError("availableRange") ? "border-red-400" : ""
                    }`}
                  placeholder={["تاريخ البداية", "تاريخ النهاية"]}
                  format="DD/MM/YYYY"
                  disabledDate={disabledDate}
                  onChange={(dates) => handleFieldChange("availableRange", dates)}
                />
              </Form.Item>
            </Col>
            <Col span={12} data-field="time">
              <Form.Item
                label={
                  <div>
                    <span className="font-semibold text-gray-700 flex items-center gap-2">
                      <ClockCircleOutlined className="text-blue-600" />
                      {getFieldLabelWithOptional("time")}
                    </span>
                    <p className="text-xs text-gray-500 mt-1 mb-2">
                      وقت عرض الدورة (مثلا : 14:00:00)
                    </p>
                  </div>
                }
                name="time"
                rules={isSource ? [
                  { required: true, message: "حدد وقت الدورة" }
                ] : []}
                validateStatus={hasError("time") ? "error" : ""}
              >
                <TimePicker
                  className={`w-full rounded-xl ${hasError("time") ? "border-red-400" : ""
                    }`}
                  format="HH:mm:ss"
                  placeholder={isSource ? "اختر وقت الدورة" : "اختر وقت الدورة (اختياري)"}
                  onChange={(value) => handleFieldChange("time", value)}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={8}>
              <Form.Item
                label={<span className="font-semibold text-gray-700 flex items-center gap-2">مجاني</span>}
                name="free"
                valuePropName="checked"
              >
                <Switch onChange={(v) => handleFieldChange("free", v)} />
              </Form.Item>
            </Col>

            {/* <Col span={8}>
              <Form.Item
                label={<span className="font-semibold text-gray-700 flex items-center gap-2">نشط</span>}
                name="active"
                valuePropName="checked"
              >
                <Switch onChange={(v) => handleFieldChange("active", v)} />
              </Form.Item>
            </Col> */}

            <Col span={8}>
              <Form.Item
                label={<span className="font-semibold text-gray-700 flex items-center gap-2">شهادة</span>}
                name="certificate"
                valuePropName="checked"
              >
                <Switch onChange={(v) => handleFieldChange("certificate", v)} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={24} data-field="goal">
              <Form.Item
                label={
                  <span className="font-semibold text-gray-700 flex items-center gap-2">
                    <FileTextOutlined className="text-green-600" />
                    {getFieldLabelWithOptional("goal")}
                  </span>
                }
                className="min-h-44"
                name="goal"
                validateStatus={hasError("goal") ? "error" : ""}
                help={hasError("goal") ? "أدخل الهدف" : null}
              >
                <div
                  className={`bg-white  rounded-xl ${hasError("goal") ? "border border-red-400" : ""
                    }`}
                >
                  <ReactQuill
                    theme="snow"
                    modules={quillModules}
                    formats={quillFormats}
                    placeholder="اكتب الهدف من الدورة بالتفصيل (مثلاً: ماذا يتعلم الطالب، النتائج المتوقعة، الجمهور المستهدف)..."
                    className="!min-h-44"
                    value={form.getFieldValue("goal")}
                    onChange={(value) => {
                      form.setFieldsValue({ goal: value });
                      handleFieldChange("goal", value);
                      validateQuillField(value, "goal");
                    }}
                  />
                </div>
              </Form.Item>
            </Col>

        
          </Row>

          {/* كتاب الدورة */}
          <div className="flex flex-col gap-2">
            <Form.Item
              label={
                <span className="font-semibold text-gray-700 flex items-center gap-2">
                  <FileTextOutlined className="text-cyan-600" />
                  كتاب الدورة (اختياري)
                </span>
              }
              name="courseBook"
              valuePropName="fileList"
              getValueFromEvent={normFile}
            >
              <Dragger
              maxCount={1}
                multiple={false}
                accept=".pdf,.doc,.docx,.txt"
                beforeUpload={customBeforeUpload}
                fileList={courseBookFileList}
                onChange={handleCourseBookChange}
                onRemove={(file) => {
                  return true;
                }}
              >
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                  {isEditMode && rowData?.round_book_url ? "تغيير كتاب الدورة" : "اسحب ملف كتاب الدورة هنا أو اضغط للاختيار (اختياري)"}
                </p>
                {courseBookFileList.length === 0 && rowData?.round_book_url && (
                  <p className="text-sm text-gray-500 mt-2">
                    الملف الحالي: {rowData?.round_book_name || "round-book.pdf"}
                  </p>
                )}
              </Dragger>
            </Form.Item>
            {courseBookFileList.length === 0 && rowData?.round_book_url && !oldFilesToDelete.round_book && (
              <div className="flex items-center gap-2">
                <a
                  href={rowData.round_book_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800"
                >
                  عرض الملف الحالي
                </a>
                <Button
                  type="text"
                  danger
                  size="small"
                  onClick={() => {
                    setCourseBookFileList([]);
                    setOldFilesToDelete(prev => ({ ...prev, round_book: true }));
                  }}
                >
                  حذف الملف
                </Button>
              </div>
            )}
          </div>

          {/* ملف PDF إضافي */}
          <div className="flex flex-col gap-2">
            <Form.Item
              label={
                <span className="font-semibold text-gray-700 flex items-center gap-2">
                  <FileTextOutlined className="text-purple-600" />
                  جدول الدورة (اختياري)
                </span>
              }
              name="extraPdf"
              valuePropName="fileList"
              getValueFromEvent={normFile}
            >
              <Dragger
              maxCount={1}
                multiple={false}
                accept=".pdf,.doc,.docx,.txt"
                beforeUpload={customBeforeUpload}
                fileList={extraPdfFileList}
                onChange={handleExtraPdfChange}
                onRemove={(file) => {
                  return true;
                }}
              >
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                  {isEditMode && rowData?.round_road_map_book_url ? "تغيير جدول الدورة" : "اسحب ملف PDF هنا أو اضغط للاختيار (اختياري)"}
                </p>
                {extraPdfFileList.length === 0 && rowData?.round_road_map_book_url && (
                  <p className="text-sm text-gray-500 mt-2">
                    الملف الحالي: {rowData?.round_road_map_book_name || "road-map-book.pdf"}
                  </p>
                )}
              </Dragger>
            </Form.Item>
            {extraPdfFileList?.length === 0 && rowData?.round_road_map_book_url && !oldFilesToDelete?.round_road_map_book && (
              <div className="flex items-center gap-2">
                <a
                  href={rowData.round_road_map_book_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800"
                >
                  عرض الملف الحالي
                </a>
                <Button
                  type="text"
                  danger
                  size="small"
                  onClick={() => {
                    setExtraPdfFileList([]);
                    setOldFilesToDelete(prev => ({ ...prev, round_road_map_book: true }));
                  }}
                >
                  حذف الملف
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 flex justify-between space-x-4 space-x-reverse">
          <div className="mt-8 flex justify-between !ms-auto space-x-4 space-x-reverse">
            <Button
              size="large"
              onClick={goToPrevStep}
              disabled={currentStep === 1}
              className={`rounded-lg border border-gray-300 bg-white px-6 py-2 text-gray-700 transition duration-150 hover:bg-gray-50 ${currentStep === 1 ? "cursor-not-allowed opacity-50" : ""
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