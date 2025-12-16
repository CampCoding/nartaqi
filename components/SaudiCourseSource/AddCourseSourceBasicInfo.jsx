// // "use client";
// // import {
// //   Col,
// //   DatePicker,
// //   Form,
// //   Input,
// //   InputNumber,
// //   Row,
// //   Select,
// //   Upload,
// //   Button,
// //   message,
// //   TimePicker,
// //   Switch,
// // } from "antd";
// // import React, { useEffect, useState, useCallback } from "react";
// // import {
// //   BookOutlined,
// //   FileTextOutlined,
// //   InboxOutlined,
// //   CalendarOutlined,
// //   UserOutlined,
// //   DollarOutlined,
// //   TeamOutlined,
// //   FolderOutlined,
// //   SettingOutlined,
// //   ClockCircleOutlined,
// // } from "@ant-design/icons";
// // import dayjs from "dayjs";
// // import { useDispatch, useSelector } from "react-redux";
// // import {
// //   handleGetAllCoursesCategories,
// //   handleGetCategoryParts,
// // } from "../../lib/features/categoriesSlice";
// // import {
// //   handleAddBaiskRound,
// //   handleGetSourceRound,
// //   handleEditBaiskRound,
// //   add_round_data,
// // } from "../../lib/features/roundsSlice";
// // import { handleGetAllTeachers } from "../../lib/features/teacherSlice";
// // import { toast } from "react-toastify";
// // import { useRouter } from "next/navigation";
// // import dynamic from "next/dynamic";
// // import "react-quill-new/dist/quill.snow.css";

// // // 👇 ReactQuill بتحميل ديناميكي عشان الـ SSR في Next
// // const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

// // const { Dragger } = Upload;
// // const { TextArea } = Input;
// // const { RangePicker } = DatePicker;


// // // لتحويل event الخاص بالرفع إلى fileList داخل الـ Form
// // const normFile = (e) => {
// //   if (Array.isArray(e)) return e;
// //   return e?.fileList || [];
// // };

// // // منع الرفع التلقائي
// // const customBeforeUpload = () => {
// //   return false;
// // };


// // // Helper function to safely check if a value is a valid dayjs object
// // const isDayjsValid = (value) => {
// //   if (!value) return false;
// //   if (dayjs.isDayjs(value)) return value.isValid();
// //   return false;
// // };

// // export default function AddCourseSourceBasicInfo({
// //   isSource,
// //   fileList,
// //   setFileList,
// //   availableSections,
// //   selectedCategory,
// //   setSelectedCategory,
// //   all_categories,
// //   beforeUpload = customBeforeUpload,
// //   setImagePreview,
// //   rowData,
// //   setRowData,
// //   goToNextStep,
// //   setRoundId,
// //   goToPrevStep,
// //   currentStep,
// //   id,
// //   page,
// //   pageSize
// // }) {
// //   const [form] = Form.useForm();
// //   const dispatch = useDispatch();
// //   const { all_courses_categories_list, get_categories_parts_list, get_categories_parts_loading } =
// //     useSelector((state) => state?.categories);
// //   const { store_round, add_round_loading, edit_round_loading } = useSelector(
// //     (state) => state?.rounds
// //   );
// //   const { teachers_list } = useSelector((state) => state?.teachers);

// //   const [categoriesOptions, setCategoriesOptions] = useState([]);
// //   const [categoriesPartOptions, setCategoriesPartOptions] = useState([]);
// //   const [selectedOption, setSelectedOption] = useState(null);
// //   const [isSubmitting, setIsSubmitting] = useState(false);
// //   const [teacherOptions, setTeacherOptions] = useState([]);
// //   const [validationErrors, setValidationErrors] = useState([]);
// //   const [touchedFields, setTouchedFields] = useState({});
// //   const [courseBookFileList, setCourseBookFileList] = useState([]);
// //   const [extraPdfFileList, setExtraPdfFileList] = useState([]);
// //   const router = useRouter();

// //   const isEditMode = Boolean(id);

// //   // Helper function to get field labels
// //   const getFieldLabel = (fieldName) => {
// //     const labels = {
// //       name: "اسم الدورة",
// //       price: "السعر",
// //       category: "الفئة",
// //       section: "القسم",
// //       description: "وصف الدورة",
// //       genderPolicy: "سياسة النوع",
// //       capacity: "السعة القصوى",
// //       instructor: "المدربين",
// //       availableRange: "فترة إتاحة الدورة",
// //       goal: "الهدف",
// //       image: "صورة الدورة",
// //       time: "وقت الدورة",
// //     };
// //     return labels[fieldName] || fieldName;
// //   };

// //   /* ====================== Load teachers / categories ====================== */
// //   useEffect(() => {
// //     dispatch(handleGetAllTeachers());
// //   }, [dispatch]);

// //   useEffect(() => {
// //     setTeacherOptions(
// //       teachers_list?.data?.message?.map((item) => ({
// //         label: item?.name,
// //         value: item?.id,
// //       })) || []
// //     );
// //   }, [teachers_list]);

// //   useEffect(() => {
// //     dispatch(handleGetAllCoursesCategories({}));
// //   }, [dispatch]);

// //   useEffect(() => {
// //     setCategoriesOptions(
// //       all_courses_categories_list?.data?.message?.data?.map((item) => ({
// //         label: item?.name,
// //         value: item?.id,
// //       })) || []
// //     );
// //   }, [all_courses_categories_list]);

// //   useEffect(() => {
// //     const data_send = {
// //       course_category_id: selectedCategory,
// //     };
// //     dispatch(handleGetCategoryParts({ body: data_send }));
// //   }, [selectedCategory, dispatch]);

// //   const quillModules = {
// //     toolbar: [
// //       [{ header: [1, 2, 3, false] }],
// //       ["bold", "italic", "underline"],
// //       [{ list: "ordered" }, { list: "bullet" }],
// //       [{ align: [] }],
// //       ["link"],
// //       ["clean"],
// //     ],
// //   };

// //   const quillFormats = [
// //     "header",
// //     "bold",
// //     "italic",
// //     "underline",
// //     "list",
// //     "bullet",
// //     "align",
// //     "link",
// //   ];

// //   const isQuillEmpty = (value) => {
// //     if (!value) return true;
// //     const plain = value
// //       .replace(/<[^>]+>/g, "")
// //       .replace(/&nbsp;/g, " ")
// //       .trim();
// //     return plain.length === 0;
// //   };

// //   useEffect(() => {
// //     setCategoriesPartOptions(
// //       get_categories_parts_list?.data?.message
// //         ?.filter(
// //           (item) =>
// //             Number(item?.course_category_id) === Number(selectedCategory)
// //         )
// //         ?.map((part) => ({
// //           label: part?.name,
// //           value: part?.id,
// //         })) || []
// //     );
// //   }, [get_categories_parts_list, selectedCategory]);

// //   /* ====================== Handle file changes ====================== */
// //   const handleFileChange = ({ fileList: newFileList }) => {
// //     setFileList(newFileList);

// //     if (newFileList.length > 0) {
// //       const file = newFileList[0];
// //       if (file.originFileObj) {
// //         const previewUrl = URL.createObjectURL(file.originFileObj);
// //         setImagePreview(previewUrl);
// //       } else if (file.url) {
// //         setImagePreview(file.url);
// //       }
// //     } else {
// //       setImagePreview(null);
// //     }

// //     // Validate image when changed
// //     validateImageField(newFileList);
// //   };

// //   const handleRemoveFile = () => {
// //     setFileList([]);
// //     setImagePreview(null);
// //     validateImageField([]);
// //   };

// //   //  const handleCourseBookChange = ({ fileList: newFileList }) => {
// //   //   setCourseBookFileList(newFileList);
// //   //   form.setFieldsValue({ courseBook: newFileList });

// //   //   // Validate if needed
// //   //   if (newFileList.length === 0 && rowData?.round_book_url) {
// //   //     // Handle case where user removes existing file
// //   //   }
// //   // };

// //   // Handle Course Book Change (for course book file)




// //   const handleCourseBookChange = ({ fileList: newFileList }) => {
// //     if (newFileList.length > 0 && courseBookFileList.length > 0) {
// //       const newFile = newFileList[0];
// //       const oldFile = courseBookFileList[0];

// //       // Check if it's a different file (not the same URL)
// //       if (newFile.originFileObj && newFile.uid !== oldFile.uid) {
// //         // Remove the old file from state
// //         setCourseBookFileList(newFileList);
// //         form.setFieldsValue({ courseBook: newFileList });

// //         // If the old file was from the server (has URL), you might want to handle cleanup
// //         if (oldFile.url && oldFile.url.includes('http')) {
// //           console.log('Old course book file removed:', oldFile.name);
// //           // You could dispatch an action to delete old file from server if needed
// //         }
// //       }
// //     }

// //     // Handle normal file upload (no file in the list yet)
// //     setCourseBookFileList(newFileList);
// //     form.setFieldsValue({ courseBook: newFileList });
// //   };

// //   // Handle Extra PDF File Change
// //   const handleExtraPdfChange = ({ fileList: newFileList }) => {
// //     if (newFileList.length > 0 && extraPdfFileList.length > 0) {
// //       const newFile = newFileList[0];
// //       const oldFile = extraPdfFileList[0];

// //       // Check if it's a different file (not the same URL)
// //       if (newFile.originFileObj && newFile.uid !== oldFile.uid) {
// //         // Remove the old file from state
// //         setExtraPdfFileList(newFileList);
// //         form.setFieldsValue({ extraPdf: newFileList });

// //         // If the old file was from the server (has URL), you might want to handle cleanup
// //         if (oldFile.url && oldFile.url.includes('http')) {
// //           console.log('Old extra PDF file removed:', oldFile.name);
// //         }
// //       }
// //     }

// //     // Handle normal file upload (no file in the list yet)
// //     setExtraPdfFileList(newFileList);
// //     form.setFieldsValue({ extraPdf: newFileList });
// //   };




// //   const validateImageField = (files) => {
// //     if (!files || files.length === 0) {
// //       if (!isEditMode || !rowData?.image_url) {
// //         if (!touchedFields.image) {
// //           setTouchedFields((prev) => ({ ...prev, image: true }));
// //         }
// //         return false;
// //       }
// //     }
// //     return true;
// //   };

// //   /* ====================== Field change handlers ====================== */
// //   const handleFieldChange = (fieldName, value) => {
// //     setTouchedFields((prev) => ({ ...prev, [fieldName]: true }));

// //     // Special handling for Quill editor
// //     if (fieldName === "goal") {
// //       validateQuillField(value);
// //     }
// //   };

// //   const validateQuillField = (value) => {
// //     if (isQuillEmpty(value)) {
// //       if (!validationErrors.includes("goal") && touchedFields.goal) {
// //         setValidationErrors((prev) => [...prev, "goal"]);
// //       }
// //     } else {
// //       setValidationErrors((prev) => prev.filter((err) => err !== "goal"));
// //     }
// //   };

// //   const normalizeTeacherIds = (v) => {
// //     if (!v) return [];

// //     if (teachers_list?.data?.message?.length > 0) {
// //       return teachers_list?.data?.message?.filter(msg => msg?.id == v).map((item) => ({
// //         label: item?.name,
// //         value: item?.id,
// //       }))
// //     }
// //   };


// //   /* ====================== Prefill when editing ====================== */
// //   // useEffect(() => {
// //   //   if (!rowData) return;

// //   //   setTeacherOptions(rowData?.teachers?.map(item => ({label : item?.name , value:item?.id})))

// //   //   const formValues = {
// //   //     name: rowData.name,
// //   //     price: rowData.price,
// //   //     category: rowData.course_category_id || rowData.category_id,
// //   //     section: rowData.category_part_id,
// //   //     description: rowData.description,
// //   //     genderPolicy: rowData.gender,
// //   //     capacity: rowData.capacity,
// //   //     instructor: rowData?.teachers?.map(item => item?.id),
// //   //     free: rowData.free || false,
// //   //     active: rowData.active ?? true,
// //   //     goal: rowData.goal || "",
// //   //   };

// //   //   if (rowData.start_date && rowData.end_date) {
// //   //     formValues.availableRange = [
// //   //       dayjs(rowData.start_date),
// //   //       dayjs(rowData.end_date),
// //   //     ];
// //   //   }

// //   //   if (rowData.time || rowData.duration_time || rowData.time_show) {
// //   //     const timeValue =
// //   //       rowData.time || rowData.duration_time || rowData.time_show;
// //   //     const parsedTime = dayjs(timeValue, "HH:mm:ss");
// //   //     if (parsedTime.isValid()) {
// //   //       formValues.time = parsedTime;
// //   //     }
// //   //   }

// //   //   form.setFieldsValue(formValues);

// //   //   if (formValues.category) {
// //   //     setSelectedCategory(formValues.category);
// //   //   }
// //   //   if (formValues.section) {
// //   //     setSelectedOption(formValues.section);
// //   //   }

// //   //   if (rowData?.image_url && (!fileList || fileList.length === 0)) {
// //   //     const fakeFile = {
// //   //       uid: "-1",
// //   //       name: "course-cover",
// //   //       status: "done",
// //   //       url: rowData.image_url,
// //   //     };
// //   //     setFileList([fakeFile]);
// //   //     setImagePreview(rowData.image_url);
// //   //   }


// //   //  if (rowData?.round_book_url && courseBookFileList.length === 0) {
// //   //   const fakeCourseBookFile = {
// //   //     uid: `${rowData.id}-round-book`,
// //   //     name: rowData?.round_book_name || "round-book.pdf",
// //   //     status: "done",
// //   //     url: rowData.round_book_url,
// //   //   };
// //   //   setCourseBookFileList([fakeCourseBookFile]);
// //   //   form.setFieldsValue({ courseBook: [fakeCourseBookFile] });
// //   // }

// //   // // Handle road map book file
// //   // if (rowData?.round_road_map_book_url && extraPdfFileList.length === 0) {
// //   //   const fakeRoadMapBookFile = {
// //   //     uid: `${rowData.id}-road-map-book`,
// //   //     name: rowData?.round_road_map_book_name || "road-map-book.pdf",
// //   //     status: "done",
// //   //     url: rowData.round_road_map_book_url,
// //   //   };
// //   //   setExtraPdfFileList([fakeRoadMapBookFile]);
// //   //   form.setFieldsValue({ extraPdf: [fakeRoadMapBookFile] });
// //   // }
// //   //   // Validate prefilled fields
// //   //   if (formValues.goal) {
// //   //     validateQuillField(formValues.goal);
// //   //   }
// //   // }, [
// //   //   rowData,
// //   // form,
// //   // fileList,
// //   // setFileList,
// //   // setImagePreview,
// //   // setSelectedCategory,
// //   // courseBookFileList,
// //   // extraPdfFileList,
// //   // setCourseBookFileList,
// //   // setExtraPdfFileList,
// //   // ]);


// //   useEffect(() => {
// //     if (!rowData) return;

// //     if (rowData) {
// //       const formValues = {
// //         name: rowData.name,
// //         price: rowData.price,
// //         category: rowData.course_category_id || rowData.category_id,
// //         section: rowData.category_part_id,
// //         description: rowData.description,
// //         genderPolicy: rowData.gender,
// //         capacity: rowData.capacity,
// //         instructor: rowData?.teachers?.map(item => ({ label: item?.name, value: item?.id })),
// //         free: rowData.free || false,
// //         active: rowData.active ?? true,
// //         goal: rowData.goal || "",
// //       };

// //       if (rowData.start_date && rowData.end_date) {
// //         formValues.availableRange = [
// //           dayjs(rowData.start_date),
// //           dayjs(rowData.end_date),
// //         ];
// //       }

// //       if (rowData.time || rowData.duration_time || rowData.time_show) {
// //         const timeValue =
// //           rowData.time || rowData.duration_time || rowData.time_show;
// //         const parsedTime = dayjs(timeValue, "HH:mm:ss");
// //         if (parsedTime.isValid()) {
// //           formValues.time = parsedTime;
// //         }
// //       }

// //       form.setFieldsValue(formValues);

// //       if (formValues.category) {
// //         setSelectedCategory(formValues.category);
// //       }
// //       if (formValues.section) {
// //         setSelectedOption(formValues.section);
// //       }

// //       // Handle image prefill
// //       if (rowData?.image_url && (!fileList || fileList.length === 0)) {
// //         const fakeFile = {
// //           uid: "-1",
// //           name: "course-cover",
// //           status: "done",
// //           url: rowData.image_url,
// //         };
// //         setFileList([fakeFile]);
// //         setImagePreview(rowData.image_url);
// //       }

// //       // Handle course book prefill
// //       if (rowData?.round_book_url && (!courseBookFileList || courseBookFileList.length === 0)) {
// //         const fakeCourseBookFile = {
// //           uid: `${rowData.id}-round-book`,
// //           name: rowData?.round_book_name || "round-book.pdf",
// //           status: "done",
// //           url: rowData.round_book_url,
// //         };
// //         setCourseBookFileList([fakeCourseBookFile]);
// //         form.setFieldsValue({ courseBook: [fakeCourseBookFile] });
// //       }

// //       // Handle extra PDF prefill
// //       if (rowData?.round_road_map_book_url && extraPdfFileList.length === 0) {
// //         const fakeRoadMapBookFile = {
// //           uid: `${rowData.id}-road-map-book`,
// //           name: rowData?.round_road_map_book_name || "road-map-book.pdf",
// //           status: "done",
// //           url: rowData.round_road_map_book_url,
// //         };
// //         setExtraPdfFileList([fakeRoadMapBookFile]);
// //         form.setFieldsValue({ extraPdf: [fakeRoadMapBookFile] });
// //       }
// //     }

// //   }, [rowData, form, fileList, setFileList, setImagePreview, setSelectedCategory, courseBookFileList, extraPdfFileList, setCourseBookFileList, setExtraPdfFileList]);


// //   useEffect(() => {
// //   if (store_round && !rowData) {
// //     const formValues = {
// //       name: store_round.name || "",
// //       price: store_round.price || 0,
// //       category: store_round.course_category_id || store_round.category_id || "",
// //       section: store_round.category_part_id || "",
// //       description: store_round.description || "",
// //       genderPolicy: store_round.gender || "both",
// //       capacity: store_round.capacity || 20,
// //       instructor: store_round?.instructor || [],
// //       free: Boolean(store_round?.free),
// //       active: Boolean(store_round?.active ?? true),
// //       goal: store_round?.goal || "",
// //     };

// //     // Handle availableRange from store_round
// //     if (store_round.start_date && store_round.end_date) {
// //       formValues.availableRange = [
// //         dayjs(store_round.start_date),
// //         dayjs(store_round.end_date),
// //       ];
// //     }

// //     // Handle time from store_round
// //     if (store_round.time_show || store_round.time) {
// //       const timeValue = store_round.time_show || store_round.time;
// //       const parsedTime = dayjs(timeValue, "HH:mm:ss");
// //       if (parsedTime.isValid()) {
// //         formValues.time = parsedTime;
// //       }
// //     }

// //     form.setFieldsValue(formValues);

// //     if (formValues.category) {
// //       setSelectedCategory(formValues.category);
// //     }
// //     if (formValues.section) {
// //       setSelectedOption(formValues.section);
// //     }

// //     // Handle course book file - check both URL and file object
// //     if (store_round?.round_book && (!courseBookFileList || courseBookFileList.length === 0)) {
// //       // Check if it's a URL (string) or file object
// //       if (typeof store_round.round_book === 'string' && store_round.round_book.startsWith('http')) {
// //         // It's a URL from server
// //         const fakeCourseBookFile = {
// //           uid: `${Date.now()}-round-book`,
// //           name: store_round?.round_book_name || "round-book.pdf",
// //           status: "done",
// //           url: store_round.round_book,
// //         };
// //         setCourseBookFileList([fakeCourseBookFile]);
// //         form.setFieldsValue({ courseBook: [fakeCourseBookFile] });
// //       } else if (store_round.round_book instanceof File) {
// //         // It's a File object (for new uploads)
// //         const file = store_round.round_book;
// //         const fakeCourseBookFile = {
// //           uid: file.uid || `${Date.now()}-round-book`,
// //           name: file.name || "round-book.pdf",
// //           status: "uploading",
// //           percent: 100,
// //           originFileObj: file,
// //         };
// //         setCourseBookFileList([fakeCourseBookFile]);
// //         form.setFieldsValue({ courseBook: [fakeCourseBookFile] });
// //       }
// //     }

// //     // Handle extra PDF prefill
// //     if (store_round?.round_road_map_book && extraPdfFileList.length === 0) {
// //       if (typeof store_round.round_road_map_book === 'string' && store_round.round_road_map_book.startsWith('http')) {
// //         const fakeRoadMapBookFile = {
// //           uid: `${Date.now()}-road-map-book`,
// //           name: store_round?.round_road_map_book || "road-map-book.pdf",
// //           status: "done",
// //           url: store_round.round_road_map_book,
// //         };
// //         setExtraPdfFileList([fakeRoadMapBookFile]);
// //         form.setFieldsValue({ extraPdf: [fakeRoadMapBookFile] });
// //       } else if (store_round.round_road_map_book instanceof File) {
// //         const file = store_round.round_road_map_book;
// //         const fakeRoadMapBookFile = {
// //           uid: file.uid || `${Date.now()}-road-map-book`,
// //           name: file.name || "road-map-book.pdf",
// //           status: "uploading",
// //           percent: 100,
// //           originFileObj: file,
// //         };
// //         setExtraPdfFileList([fakeRoadMapBookFile]);
// //         form.setFieldsValue({ extraPdf: [fakeRoadMapBookFile] });
// //       }
// //     }
// //   }
// // }, [store_round, courseBookFileList, extraPdfFileList]);


// //   /* ====================== Validation ====================== */
// //   const validateFormBeforeSubmit = (values) => {
// //     const errors = [];

// //     // Required fields validation
// //     if (!values.name?.trim()) errors.push("name");
// //     if (!values.price && values.price !== 0) errors.push("price");
// //     if (!values.category) errors.push("category");
// //     if (!values.section) errors.push("section");
// //     if (!values.description?.trim()) errors.push("description");
// //     if (!values.genderPolicy) errors.push("genderPolicy");
// //     if (!values.capacity) errors.push("capacity");
// //     if (!values.instructor || values.instructor.length === 0)
// //       errors.push("instructor");

// //     // Validate availableRange
// //     if (!values.availableRange || values.availableRange.length !== 2) {
// //       errors.push("availableRange");
// //     } else {
// //       // Check if dates are valid dayjs objects
// //       const [start, end] = values.availableRange;
// //       if (!isDayjsValid(start) || !isDayjsValid(end)) {
// //         errors.push("availableRange");
// //       }
// //     }

// //     // Quill field validation
// //     if (isQuillEmpty(values.goal)) {
// //       errors.push("goal");
// //     }

// //     // Image validation
// //     if (!fileList || fileList.length === 0) {
// //       if (!isEditMode || !rowData?.image_url) {
// //         errors.push("image");
// //       }
// //     }

// //     return errors;
// //   };

// //   const showValidationToast = (errors) => {
// //     if (errors.length === 0) return;

// //     const errorMessages = errors.map((err) => getFieldLabel(err));
// //     const errorText = `الحقول التالية مطلوبة: ${errorMessages.join("، ")}`;

// //     toast.error(errorText, {
// //       position: "top-center",
// //       autoClose: 5000,
// //       hideProgressBar: false,
// //       closeOnClick: true,
// //       pauseOnHover: true,
// //       draggable: true,
// //       progress: undefined,
// //     });
// //   };

// //   /* ====================== Get actual File objects ====================== */
// //   const getFileObject = (fileItem) => {
// //     if (fileItem.originFileObj) {
// //       return fileItem.originFileObj;
// //     }
// //     if (fileItem.response) {
// //       return fileItem.response;
// //     }
// //     return null;
// //   };

// //   /* ====================== Submit ====================== */
// //   async function handleSubmit(values) {
// //     try {
// //       setIsSubmitting(true);

// //       // Mark all fields as touched
// //       const allFields = [
// //         "name",
// //         "price",
// //         "category",
// //         "section",
// //         "description",
// //         "genderPolicy",
// //         "capacity",
// //         "instructor",
// //         "availableRange",
// //         "goal",
// //         "image",
// //       ];
// //       const touchedAll = {};
// //       allFields.forEach((field) => (touchedAll[field] = true));
// //       setTouchedFields(touchedAll);


// //       // Validate all fields
// //       const validationErrors = validateFormBeforeSubmit(values);

// //       if (validationErrors.length > 0) {
// //         setValidationErrors(validationErrors);
// //         showValidationToast(validationErrors);
// //         setIsSubmitting(false);

// //         // Scroll to first error
// //         const firstError = validationErrors[0];
// //         const element = document.querySelector(`[data-field="${firstError}"]`);
// //         if (element) {
// //           element.scrollIntoView({ behavior: "smooth", block: "center" });
// //         }

// //         return;
// //       }

// //       // Clear any previous errors
// //       setValidationErrors([]);

// //       const [start, end] = values.availableRange || [null, null];

// //       const timeString =
// //         values.time && isDayjsValid(values.time)
// //           ? values.time.format("HH:mm:ss")
// //           : null;

// //       // Get actual File objects from file lists
// //       let courseBookFile = null;
// //       if (courseBookFileList.length > 0) {
// //         const fileItem = courseBookFileList[0];
// //         courseBookFile = getFileObject(fileItem);
// //       }

// //       let extraPdfFile = null;
// //       if (extraPdfFileList.length > 0) {
// //         const fileItem = extraPdfFileList[0];
// //         extraPdfFile = getFileObject(fileItem);
// //       }

// //       let imageFile = null;
// //       if (fileList && fileList.length > 0) {
// //         const file = fileList[0];
// //         imageFile = getFileObject(file);
// //       }

// //       if (!imageFile && !isEditMode) {
// //         toast.error("يجب رفع صورة صالحة للدورة");
// //         setIsSubmitting(false);
// //         return;
// //       }

// //       const formData = new FormData();
// //       formData.append("name", values?.name?.trim());
// //       formData.append("description", values?.description?.trim());
// //       formData.append("price", values?.price);

// //       if (start && isDayjsValid(start)) {
// //         formData.append("start_date", dayjs(start).format("YYYY-MM-DD"));
// //       }
// //       if (end && isDayjsValid(end)) {
// //         formData.append("end_date", dayjs(end).format("YYYY-MM-DD"));
// //       }

// //       formData.append("gender", values.genderPolicy || "both");
// //       formData.append("for", "Beginners");
// //       formData.append("goal", values?.goal);
// //       formData.append("course_category_id", selectedCategory);
// //       formData.append("category_part_id", selectedOption);
// //       formData.append("source", isSource ? 0 : 1);
// //       formData.append("capacity", values?.capacity);
// //       formData.append("time_show", timeString || "");

// //       formData.append("round_book", courseBookFile || rowData?.round_book_url || null);

// //       formData.append("teacher_id", values?.instructor?.join(","));

// //       formData.append("round_road_map_book", extraPdfFile || rowData?.round_road_map_book_url || null);
// //       formData.append("free", values?.free ? 1 : 0);
// //       formData.append("active", values?.active ? 1 : 0);

// //       if (rowData) {
// //         formData.append("id", rowData?.id);
// //       }

// //       if (imageFile) {
// //         formData.append("image", imageFile);
// //       }

// //        dispatch(add_round_data({
// //           ...values,
// //           course_category_id: selectedCategory,
// //           category_part_id: selectedOption,
// //           teacher_id: values?.instructor?.join(','),
// //           start_date: dayjs(start).format("YYYY-MM-DD"),
// //           end_date: dayjs(end).format("YYYY-MM-DD"),
// //           time_show: timeString,
// //           round_road_map_book :  extraPdfFile,
// //           round_book: courseBookFile
// //         }));
// //       const result = await dispatch(
// //         isEditMode
// //           ? handleEditBaiskRound({ body: formData })
// //           : handleAddBaiskRound({ body: formData })
// //       ).unwrap();

// //       if (result?.data?.status === "success") {
// //         const roundIdValue =
// //           result?.data?.message?.round_id || rowData?.id || id;

// //         setRoundId(roundIdValue);
// //         dispatch(handleGetSourceRound());

// //         if (isEditMode) {
// //           toast.success(
// //             result?.data?.message?.message || "تم تحديث الدورة بنجاح"
// //           );
// //         } else {
// //           toast.success(result?.data?.message || "تم إضافة الدورة بنجاح");
// //         }
// //         goToNextStep();
// //       } else {
// //         console.log("errorrrr", result);
// //         toast.error(
// //           result?.error?.response?.data?.message || "حدث خطأ أثناء حفظ البيانات"
// //         );
// //       }
// //     } catch (error) {
// //       console.error("Submission error:", error);
// //       toast.error("حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى");
// //     } finally {
// //       setIsSubmitting(false);
// //     }
// //   }



// //   const disabledDate = (current) => {
// //     return current && current < dayjs().startOf("day");
// //   };

// //   function handleSubmitFailed(errorInfo) {
// //     console.log("Form submission failed:", errorInfo);

// //     const errorFields = errorInfo.errorFields
// //       .map((field) => field.name[0])
// //       .flat();
// //     const uniqueErrors = [...new Set(errorFields)];

// //     const errorMessages = uniqueErrors.map((field) => getFieldLabel(field));
// //     const errorText = `يرجى مراجعة الحقول التالية: ${errorMessages.join("، ")}`;

// //     toast.error(errorText, {
// //       position: "top-center",
// //       autoClose: 5000,
// //     });

// //     // Mark these fields as touched
// //     const touched = {};
// //     uniqueErrors.forEach((field) => (touched[field] = true));
// //     setTouchedFields((prev) => ({ ...prev, ...touched }));
// //   }

// //   // Helper function to check if a field has error
// //   const hasError = (fieldName) => {
// //     return validationErrors.includes(fieldName) && touchedFields[fieldName];
// //   };

// //   /* ====================== Render ====================== */
// //   return (
// //     <div className="space-y-8">
// //       <Form
// //         form={form}
// //         layout="vertical"
// //         onFinish={handleSubmit}
// //         onFinishFailed={handleSubmitFailed}
// //         className="space-y-8"
// //         initialValues={{
// //           genderPolicy: "both",
// //           capacity: 20,
// //           free: false,
// //           active: true,
// //         }}
// //         validateMessages={{
// //           required: "${label} مطلوب",
// //           types: {
// //             number: "${label} يجب أن يكون رقماً",
// //           },
// //           number: {
// //             min: "${label} لا يمكن أن يكون أقل من ${min}",
// //             max: "${label} لا يمكن أن يكون أكثر من ${max}",
// //           },
// //           string: {
// //             min: "${label} يجب أن يكون على الأقل ${min} أحرف",
// //             max: "${label} لا يمكن أن يتجاوز ${max} أحرف",
// //           },
// //         }}
// //       >
// //         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
// //           {/* Image Upload */}
// //           <div className="lg:col-span-1" data-field="image">
// //             <Form.Item
// //               label={
// //                 <span className="font-semibold text-gray-700 flex items-center gap-2">
// //                   <InboxOutlined className="text-blue-600" />
// //                   صورة الدورة *
// //                 </span>
// //               }
// //               required
// //               validateStatus={hasError("image") ? "error" : ""}
// //               help={hasError("image") ? "صورة الدورة مطلوبة" : null}
// //             >
// //               <Dragger
// //                 accept=".jpg,.jpeg,.png,.gif,.webp"
// //                 multiple={false}
// //                 maxCount={1}
// //                 beforeUpload={beforeUpload}
// //                 fileList={fileList}
// //                 onChange={handleFileChange}
// //                 onRemove={handleRemoveFile}
// //                 listType="picture"
// //                 className={`border-2 border-dashed rounded-xl ${hasError("image")
// //                   ? "border-red-400 bg-red-50/50"
// //                   : "border-blue-300 hover:border-blue-400 bg-blue-50/50"
// //                   }`}
// //               >
// //                 <p className="ant-upload-drag-icon">
// //                   <InboxOutlined
// //                     className={`text-4xl ${hasError("image") ? "text-red-500" : "text-blue-500"
// //                       }`}
// //                   />
// //                 </p>
// //                 <p className="ant-upload-text font-medium text-gray-700">
// //                   اسحب الصورة هنا أو اضغط للاختيار
// //                 </p>
// //                 <p className="ant-upload-hint text-gray-500">
// //                   الحجم الأقصى 5MB - صيغ مدعومة: JPG, PNG, WebP
// //                 </p>
// //               </Dragger>
// //             </Form.Item>
// //           </div>

// //           {/* Basic Details */}
// //           <div className="lg:col-span-2 space-y-6">
// //             <Row gutter={16}>
// //               <Col span={12} data-field="name">
// //                 <Form.Item
// //                   label={
// //                     <span className="font-semibold text-gray-700 flex items-center gap-2">
// //                       <BookOutlined className="text-green-600" />
// //                       اسم الدورة *
// //                     </span>
// //                   }
// //                   name="name"
// //                   rules={[
// //                     { required: true, message: "أدخل اسم الدورة" },
// //                     { min: 3, message: "الاسم لا يقل عن 3 أحرف" },
// //                   ]}
// //                   validateStatus={hasError("name") ? "error" : ""}
// //                 >
// //                   <Input
// //                     placeholder="مثال: دورة البرمجة المتقدمة"
// //                     className={`rounded-xl ${hasError("name")
// //                       ? "border-red-400"
// //                       : "border-gray-300 hover:border-blue-400 focus:border-blue-500"
// //                       }`}
// //                     onChange={(e) => handleFieldChange("name", e.target.value)}
// //                   />
// //                 </Form.Item>
// //               </Col>
// //               <Col span={12} data-field="price">
// //                 <Form.Item
// //                   label={
// //                     <span className="font-semibold text-gray-700 flex items-center gap-2">
// //                       <DollarOutlined className="text-orange-600" />
// //                       السعر (ج.م) *
// //                     </span>
// //                   }
// //                   name="price"
// //                   rules={[
// //                     { required: true, message: "أدخل السعر" },
// //                     { type: "number", min: 0, message: "السعر لا يقل عن 0" },
// //                   ]}
// //                   validateStatus={hasError("price") ? "error" : ""}
// //                 >
// //                   <InputNumber
// //                     className={`w-full rounded-xl ${hasError("price") ? "border-red-400" : ""
// //                       }`}
// //                     placeholder="499"
// //                     min={0}
// //                     step={1}
// //                     formatter={(value) =>
// //                       `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
// //                     }
// //                     parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
// //                     onChange={(value) => handleFieldChange("price", value)}
// //                   />
// //                 </Form.Item>
// //               </Col>
// //             </Row>

// //             <Row gutter={16}>
// //               <Col span={12} data-field="category">
// //                 <Form.Item
// //                   label={
// //                     <span className="font-semibold text-gray-700 flex items-center gap-2">
// //                       <FolderOutlined className="text-purple-600" />
// //                       الفئة *
// //                     </span>
// //                   }
// //                   name="category"
// //                   rules={[{ required: true, message: "اختر الفئة" }]}
// //                   validateStatus={hasError("category") ? "error" : ""}
// //                 >
// //                   <Select
// //                     placeholder="اختر فئة الدورة"
// //                     className={`rounded-xl ${hasError("category") ? "border-red-400" : ""
// //                       }`}
// //                     onChange={(value) => {
// //                       setSelectedCategory(value);
// //                       handleFieldChange("category", value);

// //                       // Reset section when category changes
// //                       form.setFieldsValue({ section: undefined });
// //                       setSelectedOption(null);
// //                       setValidationErrors((prev) =>
// //                         prev.filter((err) => err !== "section")
// //                       );
// //                     }}
// //                     options={categoriesOptions}
// //                   />
// //                 </Form.Item>
// //               </Col>
// //               <Col span={12} data-field="section">
// //                 <Form.Item
// //                   label={
// //                     <span className="font-semibold text-gray-700 flex items-center gap-2">
// //                       <BookOutlined className="text-indigo-600" />
// //                       القسم *
// //                     </span>
// //                   }
// //                   name="section"
// //                   rules={[{ required: true, message: "اختر القسم" }]}
// //                   validateStatus={hasError("section") ? "error" : ""}
// //                 >
// //                   <Select
// //                     loading={get_categories_parts_loading}
// //                     placeholder="اختر قسم من الفئة"
// //                     className={`rounded-xl ${hasError("section") ? "border-red-400" : ""
// //                       }`}
// //                     disabled={!selectedCategory}
// //                     value={selectedOption}
// //                     onChange={(value) => {
// //                       setSelectedOption(value);
// //                       handleFieldChange("section", value);
// //                     }}
// //                     options={categoriesPartOptions}
// //                     notFoundContent={
// //                       !selectedCategory
// //                         ? "يرجى اختيار الفئة أولاً"
// //                         : "لا توجد أقسام لهذه الفئة"
// //                     }
// //                   />
// //                 </Form.Item>
// //               </Col>
// //             </Row>

// //             <Form.Item
// //               label={
// //                 <span className="font-semibold text-gray-700">
// //                   وصف الدورة *
// //                 </span>
// //               }
// //               name="description"
// //               rules={[
// //                 { required: true, message: "أدخل وصفًا للدورة" },
// //               ]}
// //               validateStatus={hasError("description") ? "error" : ""}
// //               data-field="description"
// //             >
// //               <TextArea
// //                 rows={4}
// //                 placeholder="اكتب وصفاً شاملاً للدورة وأهدافها التعليمية..."
// //                 className={`rounded-xl ${hasError("description")
// //                   ? "border-red-400"
// //                   : "border-gray-300 hover:border-blue-400 focus:border-blue-500"
// //                   }`}
// //                 showCount
// //                 onChange={(e) =>
// //                   handleFieldChange("description", e.target.value)
// //                 }
// //               />
// //             </Form.Item>
// //           </div>
// //         </div>

// //         {/* Configuration Section */}
// //         <div className="bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-2xl p-6 border border-gray-200">
// //           <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
// //             <SettingOutlined className="text-blue-600" />
// //             إعدادات الدورة
// //           </h3>

// //           <Row gutter={24}>
// //             <Col span={8} data-field="genderPolicy">
// //               <Form.Item
// //                 label={
// //                   <span className="font-semibold text-gray-700 flex items-center gap-2">
// //                     <UserOutlined className="text-pink-600" />
// //                     سياسة النوع *
// //                   </span>
// //                 }
// //                 name="genderPolicy"
// //                 rules={[{ required: true, message: "اختر السياسة" }]}
// //                 validateStatus={hasError("genderPolicy") ? "error" : ""}
// //               >
// //                 <Select
// //                   className={`rounded-xl ${hasError("genderPolicy") ? "border-red-400" : ""
// //                     }`}
// //                   options={[
// //                     { label: "👨 للذكور فقط", value: "male" },
// //                     { label: "👩 للإناث فقط", value: "female" },
// //                     { label: "👥 للجميع", value: "both" },
// //                   ]}
// //                   onChange={(value) => handleFieldChange("genderPolicy", value)}
// //                 />
// //               </Form.Item>
// //             </Col>
// //             <Col span={8} data-field="capacity">
// //               <Form.Item
// //                 label={
// //                   <span className="font-semibold text-gray-700 flex items-center gap-2">
// //                     <TeamOutlined className="text-red-600" />
// //                     السعة القصوى *
// //                   </span>
// //                 }
// //                 name="capacity"
// //                 rules={[{ required: true, message: "أدخل السعة القصوى" }]}
// //                 validateStatus={hasError("capacity") ? "error" : ""}
// //               >
// //                 <InputNumber
// //                   className={`w-full rounded-xl ${hasError("capacity") ? "border-red-400" : ""
// //                     }`}
// //                   placeholder="50"
// //                   onChange={(value) => handleFieldChange("capacity", value)}
// //                 />
// //               </Form.Item>
// //             </Col>
// //             <Col span={8} data-field="instructor">
// //               <Form.Item
// //                 label={
// //                   <span className="font-semibold text-gray-700 flex items-center gap-2">
// //                     <UserOutlined className="text-cyan-600" />
// //                     المدربين *
// //                   </span>
// //                 }
// //                 name="instructor"
// //                 rules={[{ required: true, message: "اختر المدربين" }]}
// //                 validateStatus={hasError("instructor") ? "error" : ""}
// //               >
// //                 <Select
// //                   mode="multiple"
// //                   className={`rounded-xl ${hasError("instructor") ? "border-red-400" : ""
// //                     }`}
// //                   placeholder="اختر المدربين"
// //                   options={teacherOptions}
// //                   onChange={(value) => handleFieldChange("instructor", value)}
// //                 />
// //               </Form.Item>
// //             </Col>
// //           </Row>

// //           <Form.Item
// //             label={
// //               <span className="font-semibold text-gray-700 flex items-center gap-2">
// //                 <CalendarOutlined className="text-green-600" />
// //                 فترة إتاحة الدورة *
// //               </span>
// //             }
// //             name="availableRange"
// //             rules={[{ required: true, message: "حدد فترة الإتاحة" }]}
// //             validateStatus={hasError("availableRange") ? "error" : ""}
// //             data-field="availableRange"
// //           >
// //             <RangePicker
// //               className={`w-full rounded-xl ${hasError("availableRange") ? "border-red-400" : ""
// //                 }`}
// //               placeholder={["تاريخ البداية", "تاريخ النهاية"]}
// //               format="DD/MM/YYYY"
// //               disabledDate={disabledDate}
// //               onChange={(dates) => handleFieldChange("availableRange", dates)}
// //             />
// //           </Form.Item>

// //           <Row gutter={24}>
// //             <Col span={12}>
// //               <Form.Item
// //                 label={
// //                   <span className="font-semibold text-gray-700 flex items-center gap-2">
// //                     مجاني
// //                   </span>
// //                 }
// //                 name="free"
// //                 valuePropName="checked"
// //               >
// //                 <Switch />
// //               </Form.Item>
// //             </Col>
// //             <Col span={12}>
// //               <Form.Item
// //                 label={
// //                   <span className="font-semibold text-gray-700 flex items-center gap-2">
// //                     نشط
// //                   </span>
// //                 }
// //                 name="active"
// //                 valuePropName="checked"
// //               >
// //                 <Switch />
// //               </Form.Item>
// //             </Col>
// //           </Row>

// //           <Row gutter={24}>
// //             <Col span={24} data-field="goal">
// //               <Form.Item
// //                 label={
// //                   <span className="font-semibold text-gray-700 flex items-center gap-2">
// //                     الهدف *
// //                   </span>
// //                 }
// //                 name="goal"
// //                 validateStatus={hasError("goal") ? "error" : ""}
// //                 help={hasError("goal") ? "أدخل الهدف" : null}
// //               >
// //                 <div
// //                   className={`bg-white border rounded-xl ${hasError("goal") ? "border-red-400" : "border-gray-200"
// //                     }`}
// //                 >
// //                   <ReactQuill
// //                     theme="snow"
// //                     modules={quillModules}
// //                     formats={quillFormats}
// //                     placeholder="اكتب الهدف من الدورة بالتفصيل (مثلاً: ماذا يتعلم الطالب، النتائج المتوقعة، الجمهور المستهدف)..."
// //                     className="h-full"
// //                     value={form.getFieldValue("goal")}
// //                     onChange={(value) => {
// //                       form.setFieldsValue({ goal: value });
// //                       handleFieldChange("goal", value);
// //                       validateQuillField(value);
// //                     }}
// //                   />
// //                 </div>
// //               </Form.Item>
// //             </Col>
// //           </Row>

// //           <Row gutter={24}>
// //             <Col span={12} data-field="time">
// //               <Form.Item
// //                 label={
// //                   <span className="font-semibold text-gray-700 flex items-center gap-2">
// //                     <ClockCircleOutlined className="text-blue-600" />
// //                     وقت الدورة
// //                   </span>
// //                 }
// //                 name="time"
// //               >
// //                 <TimePicker
// //                   className="w-full rounded-xl"
// //                   format="HH:mm:ss"
// //                   placeholder="اختر وقت الدورة"
// //                   onChange={(value) => handleFieldChange("time", value)}
// //                 />
// //               </Form.Item>
// //             </Col>
// //           </Row>

// //           {/* كتاب الدورة */}
// //           <Form.Item
// //             label={
// //               <span className="font-semibold text-gray-700 flex items-center gap-2">
// //                 <FileTextOutlined className="text-cyan-600" />
// //                 كتاب الدورة
// //               </span>
// //             }
// //             name="courseBook"
// //             valuePropName="fileList"
// //             getValueFromEvent={normFile}
// //           >
// //             <Dragger
// //               multiple={false}
// //               accept=".pdf,.doc,.docx,.txt"
// //               beforeUpload={customBeforeUpload}
// //               fileList={courseBookFileList}
// //               onChange={handleCourseBookChange}
// //             >
// //               <p className="ant-upload-drag-icon">
// //                 <InboxOutlined />
// //               </p>
// //               <p className="ant-upload-text">
// //                 اسحب ملف كتاب الدورة هنا أو اضغط للاختيار
// //               </p>
// //               <p className="ant-upload-hint">
// //               </p>
// //             </Dragger>
// //           </Form.Item>

// //           {/* ملف PDF إضافي */}
// //           <Form.Item
// //             label={
// //               <span className="font-semibold text-gray-700 flex items-center gap-2">
// //                 <FileTextOutlined className="text-purple-600" />
// //                 جدول الدورة
// //               </span>
// //             }
// //             name="extraPdf"
// //             valuePropName="fileList"
// //             getValueFromEvent={normFile}
// //           >
// //             <Dragger
// //               multiple={false}
// //               accept=".pdf,.doc,.docx,.txt"
// //               beforeUpload={customBeforeUpload}
// //               fileList={extraPdfFileList}
// //               onChange={handleExtraPdfChange}
// //             >
// //               <p className="ant-upload-drag-icon">
// //                 <InboxOutlined />
// //               </p>
// //               <p className="ant-upload-text">
// //                 اسحب ملف PDF هنا أو اضغط للاختيار
// //               </p>

// //             </Dragger>
// //           </Form.Item>
// //         </div>

// //         <div className="mt-8 flex justify-between space-x-4 space-x-reverse">
// //           <div className="mt-8 flex justify-between !ms-auto space-x-4 space-x-reverse">
// //             <Button
// //               size="large"
// //               onClick={goToPrevStep}
// //               disabled={currentStep === 1}
// //               className={`rounded-lg border border-gray-300 bg-white px-6 py-2 text-gray-700 transition duration-150 hover:bg-gray-50 ${currentStep === 1 ? "cursor-not-allowed opacity-50" : ""
// //                 }`}
// //             >
// //               السابق
// //             </Button>

// //             <Button
// //               type="primary"
// //               htmlType="submit"
// //               size="large"
// //               loading={add_round_loading || edit_round_loading || isSubmitting}
// //               className="rounded-lg bg-blue-600 px-6 py-2 text-white shadow-md hover:bg-blue-700"
// //             >
// //               {add_round_loading || edit_round_loading || isSubmitting
// //                 ? "جاري الحفظ..."
// //                 : isEditMode
// //                   ? "حفظ التعديلات"
// //                   : "التالي"}
// //             </Button>
// //           </div>
// //         </div>
// //       </Form>
// //     </div>
// //   );
// // }


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

//   useEffect(() => {
//     if (get_categories_parts_list?.data?.message) {
//       const options = get_categories_parts_list.data.message
//         .filter((item) => Number(item?.course_category_id) === Number(selectedCategory))
//         .map((part) => ({
//           label: part?.name,
//           value: part?.id,
//         }));
//       setCategoriesPartOptions(options || []);
//     } else {
//       setCategoriesPartOptions([]);
//     }
//   }, [get_categories_parts_list, selectedCategory]);

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
//     // if (newFileList.length > 0) {
//     //   const file = newFileList[0];
//     //   if (file.originFileObj && isEditMode && rowData?.round_book_url) {
//     //     setOldFilesToDelete(prev => ({ ...prev, round_book: true }));
//     //   }
//     // } else if (isEditMode && rowData?.round_book_url) {
//     //   setOldFilesToDelete(prev => ({ ...prev, round_book: true }));
//     // }

//     setCourseBookFileList(newFileList);
//     form.setFieldsValue({ courseBook: newFileList });
//   };

//   const handleExtraPdfChange = ({ fileList: newFileList }) => {
//     // if (newFileList.length > 0) {
//     //   const file = newFileList[0];
//     //   if (file.originFileObj && isEditMode && rowData?.round_road_map_book_url) {
//     //     setOldFilesToDelete(prev => ({ ...prev, round_road_map_book: true }));
//     //   }
//     // } else if (isEditMode && rowData?.round_road_map_book_url) {
//     //   setOldFilesToDelete(prev => ({ ...prev, round_road_map_book: true }));
//     // }

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

//     if (fieldName === "goal") {
//       validateQuillField(value);
//     }
//   };

//   const validateQuillField = (value) => {
//     if (isQuillEmpty(value)) {
//       if (!validationErrors.includes("goal") && touchedFields.goal) {
//         setValidationErrors((prev) => [...prev, "goal"]);
//       }
//     } else {
//       setValidationErrors((prev) => prev.filter((err) => err !== "goal"));
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
//         free: Boolean(rowData.free),
//         active: Boolean(rowData.active ?? true),
//         goal: rowData.goal || "",
//       };

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
//       if (formValues.section) {
//         setSelectedOption(formValues.section);
//       }

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

//       // if (rowData?.round_book_url && courseBookFileList.length === 0) {
//       //   const fakeCourseBookFile = {
//       //     uid: `course-book-${rowData.id}`,
//       //     name: rowData?.round_book_name || "round-book.pdf",
//       //     status: "done",
//       //     url: rowData?.round_book_url,
//       //   };
//       //   setCourseBookFileList([fakeCourseBookFile]);
//       //   form.setFieldsValue({ courseBook: [fakeCourseBookFile] });
//       // }

//       // if (rowData?.round_road_map_book_url && extraPdfFileList.length === 0) {
//       //   const fakeRoadMapBookFile = {
//       //     uid: `road-map-${rowData.id}`,
//       //     name: rowData?.round_road_map_book_name || "road-map-book.pdf",
//       //     status: "done",
//       //     url: rowData.round_road_map_book_url,
//       //   };
//       //   setExtraPdfFileList([fakeRoadMapBookFile]);
//       //   form.setFieldsValue({ extraPdf: [fakeRoadMapBookFile] });
//       // }

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

//       if (store_round?.round_book && courseBookFileList.length === 0) {
//         if (typeof store_round.round_book === 'string' && store_round.round_book.startsWith('http')) {
//           const fakeCourseBookFile = {
//             uid: `${Date.now()}-round-book`,
//             name: store_round?.round_book_name || "round-book.pdf",
//             status: "done",
//             url: store_round.round_book,
//           };
//           setCourseBookFileList([fakeCourseBookFile]);
//           form.setFieldsValue({ courseBook: [fakeCourseBookFile] });
//         }
//       }

//       if (store_round?.round_road_map_book && extraPdfFileList.length === 0) {
//         if (typeof store_round.round_road_map_book === 'string' && store_round.round_road_map_book.startsWith('http')) {
//           const fakeRoadMapBookFile = {
//             uid: `${Date.now()}-road-map-book`,
//             name: store_round?.round_road_map_book || "road-map-book.pdf",
//             status: "done",
//             url: store_round.round_road_map_book,
//           };
//           setExtraPdfFileList([fakeRoadMapBookFile]);
//           form.setFieldsValue({ extraPdf: [fakeRoadMapBookFile] });
//         }
//       }

//       setIsInitialized(true);
//     }
//   }, [store_round, courseBookFileList, extraPdfFileList, form, setSelectedCategory,
//     rowData, isInitialized, setCourseBookFileList, setExtraPdfFileList]);

//   /* ====================== Validation ====================== */
//   const validateFormBeforeSubmit = (values) => {
//     const errors = [];

//     if (!values.name?.trim()) errors.push("name");
//     if (values.price === undefined || values.price === null || values.price === "") errors.push("price");
//     if (!values.category) errors.push("category");
//     if (!values.section) errors.push("section");
//     if (!values.description?.trim()) errors.push("description");
//     if (!values.genderPolicy) errors.push("genderPolicy");
//     if (!values.capacity) errors.push("capacity");
//     if (!values.instructor || values.instructor.length === 0) errors.push("instructor");

//     if (!values.availableRange || values.availableRange.length !== 2) {
//       errors.push("availableRange");
//     } else {
//       const [start, end] = values.availableRange;
//       if (!isDayjsValid(start) || !isDayjsValid(end)) {
//         errors.push("availableRange");
//       } else if (end.isBefore(start)) {
//         errors.push("availableRange");
//         toast.error("تاريخ النهاية يجب أن يكون بعد تاريخ البداية");
//       }
//     }

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
//         "description",
//         "genderPolicy",
//         "capacity",
//         "instructor",
//         "availableRange",
//         "goal",
//         "image",
//       ];
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

//       const [start, end] = values.availableRange;

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
//       formData.append("description", values?.description?.trim());
//       formData.append("price", values?.price?.toString() || "0");

//       if (start && isDayjsValid(start)) {
//         formData.append("start_date", dayjs(start).format("YYYY-MM-DD"));
//       }
//       if (end && isDayjsValid(end)) {
//         formData.append("end_date", dayjs(end).format("YYYY-MM-DD"));
//       }

//       formData.append("gender", values.genderPolicy || "both");
//       formData.append("for", "Beginners");
//       formData.append("goal", values?.goal || "");
//       formData.append("course_category_id", selectedCategory?.toString());
//       formData.append("category_part_id", selectedOption?.toString());
//       formData.append("source", isSource ? "0" : "1");
//       formData.append("capacity", values?.capacity?.toString() || "20");

//       if (timeString) {
//         formData.append("time_show", timeString);
//       }

//       formData.append("teacher_id", values?.instructor?.join(",") || "");
//       formData.append("free", values?.free ? "1" : "0");
//       formData.append("active", values?.active ? "1" : "0");

//       if (isEditMode) {
//         formData.append("id", rowData?.id?.toString());

//         if (imageFile) {
//           formData.append("image", imageFile);
//         }

//         // formData.append("round_book", courseBookFile || "");
//         // if (courseBookFile) {
//         // } else if (oldFilesToDelete.round_book) {
//         //   formData.append("remove_round_book", "1");
//         // }

//         // formData.append("round_road_map_book", extraPdfFile || "");
//         // if (extraPdfFile) {
//         // } else if (oldFilesToDelete.round_road_map_book) {
//         //   formData.append("remove_round_road_map_book", "1");
//         // }
//       } else 
        
//         {
//         if (imageFile) {
//           formData.append("image", imageFile);
//         }
//         formData.append("round_book", courseBookFile || rowData?.round_book_url || "");
//         formData.append("round_road_map_book", extraPdfFile || rowData?.round_road_map_book_url || "");


//         dispatch(add_round_data({
//           ...values,
//           course_category_id: selectedCategory,
//           category_part_id: selectedOption,
//           teacher_id: values?.instructor?.join(','),
//           start_date: dayjs(start).format("YYYY-MM-DD"),
//           end_date: dayjs(end).format("YYYY-MM-DD"),
//           time_show: timeString,
//           round_road_map_book: extraPdfFile,
//           round_book: courseBookFile
//         }));
//       }

//       const result = await dispatch(
//         isEditMode
//           ? handleEditBaiskRound({ body: formData })
//           : handleAddBaiskRound({ body: formData })
//       ).unwrap();

//       if (result?.data?.status == "success") {
//         const roundIdValue = result?.data?.message?.round_id || rowData?.id || id;
//         setRoundId(roundIdValue);
//         dispatch(handleGetSourceRound({ page, per_page: 6 }));
//         dispatch(handleGetAllRounds({
//           course_category_id: Cat_id,
//           page,
//           per_page: 6
//         }))
//         if (isEditMode) {
//           toast.success(
//             result?.data?.message?.message || "تم تحديث الدورة بنجاح"
//           );

//           // setOldFilesToDelete({
//           //   image: false,
//           //   round_book: false,
//           //   round_road_map_book: false,
//           // });
//         } else {
//           toast.success(result?.data?.message || "تم إضافة الدورة بنجاح");
//         }
//         goToNextStep();
//       } else {
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
//                   صورة الدورة {!isEditMode && "*"}
//                 </span>
//               }
//               required={!isEditMode}
//               validateStatus={hasError("image") ? "error" : ""}
//               help={hasError("image") ? "صورة الدورة مطلوبة" : null}
//             >
//               <Dragger
//                 accept=".jpg,.jpeg,.png,.gif,.webp"
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
//                   الحجم الأقصى 5MB - صيغ مدعومة: JPG, PNG, WebP
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
//                       اسم الدورة *
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
//                       السعر (ج.م) *
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
//                       الفئة *
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
//                     onChange={(value) => {
//                       setSelectedCategory(value);
//                       handleFieldChange("category", value);

//                       form.setFieldsValue({ section: undefined });
//                       setSelectedOption(null);
//                       setValidationErrors((prev) =>
//                         prev.filter((err) => err !== "section")
//                       );
//                     }}
//                     options={categoriesOptions}
//                   />
//                 </Form.Item>
//               </Col>
//               <Col span={12} data-field="section">
//                 <Form.Item
//                   label={
//                     <span className="font-semibold text-gray-700 flex items-center gap-2">
//                       <BookOutlined className="text-indigo-600" />
//                       القسم *
//                     </span>
//                   }
//                   name="section"
//                   rules={[{ required: true, message: "اختر القسم" }]}
//                   validateStatus={hasError("section") ? "error" : ""}
//                 >
//                   <Select
//                     loading={get_categories_parts_loading}
//                     placeholder="اختر قسم من الفئة"
//                     className={`rounded-xl ${hasError("section") ? "border-red-400" : ""
//                       }`}
//                     disabled={!selectedCategory}
//                     value={selectedOption}
//                     onChange={(value) => {
//                       setSelectedOption(value);
//                       handleFieldChange("section", value);
//                     }}
//                     options={categoriesPartOptions}
//                     notFoundContent={
//                       !selectedCategory
//                         ? "يرجى اختيار الفئة أولاً"
//                         : "لا توجد أقسام لهذه الفئة"
//                     }
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
//               ]}
//               validateStatus={hasError("description") ? "error" : ""}
//               data-field="description"
//             >
//               <TextArea
//                 rows={4}
//                 placeholder="اكتب وصفاً شاملاً للدورة وأهدافها التعليمية..."
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
//                     سياسة النوع *
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
//                     السعة القصوى *
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
//                     المدربين *
//                   </span>
//                 }
//                 name="instructor"
//                 rules={[{ required: true, message: "اختر المدربين" }]}
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

//           <Form.Item
//             label={
//               <span className="font-semibold text-gray-700 flex items-center gap-2">
//                 <CalendarOutlined className="text-green-600" />
//                 فترة إتاحة الدورة *
//               </span>
//             }
//             name="availableRange"
//             rules={[{ required: true, message: "حدد فترة الإتاحة" }]}
//             validateStatus={hasError("availableRange") ? "error" : ""}
//             data-field="availableRange"
//           >
//             <RangePicker
//               className={`w-full rounded-xl ${hasError("availableRange") ? "border-red-400" : ""
//                 }`}
//               placeholder={["تاريخ البداية", "تاريخ النهاية"]}
//               format="DD/MM/YYYY"
//               disabledDate={disabledDate}
//               onChange={(dates) => handleFieldChange("availableRange", dates)}
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
//             <Col span={24} data-field="goal">
//               <Form.Item
//                 label={
//                   <span className="font-semibold text-gray-700 flex items-center gap-2">
//                     الهدف *
//                   </span>
//                 }
//                 name="goal"
//                 validateStatus={hasError("goal") ? "error" : ""}
//                 help={hasError("goal") ? "أدخل الهدف" : null}
//               >
//                 <div
//                   className={`bg-white border rounded-xl ${hasError("goal") ? "border-red-400" : "border-gray-200"
//                     }`}
//                 >
//                   <ReactQuill
//                     theme="snow"
//                     modules={quillModules}
//                     formats={quillFormats}
//                     placeholder="اكتب الهدف من الدورة بالتفصيل (مثلاً: ماذا يتعلم الطالب، النتائج المتوقعة، الجمهور المستهدف)..."
//                     className="h-full"
//                     value={form.getFieldValue("goal")}
//                     onChange={(value) => {
//                       form.setFieldsValue({ goal: value });
//                       handleFieldChange("goal", value);
//                       validateQuillField(value);
//                     }}
//                   />
//                 </div>
//               </Form.Item>
//             </Col>
//           </Row>

//           <Row gutter={24}>
//             <Col span={12} data-field="time">
//               <Form.Item
//                 label={
//                   <span className="font-semibold text-gray-700 flex items-center gap-2">
//                     <ClockCircleOutlined className="text-blue-600" />
//                     وقت الدورة
//                   </span>
//                 }
//                 name="time"
//               >
//                 <TimePicker
//                   className="w-full rounded-xl"
//                   format="HH:mm:ss"
//                   placeholder="اختر وقت الدورة"
//                   onChange={(value) => handleFieldChange("time", value)}
//                 />
//               </Form.Item>
//             </Col>
//           </Row>

//           {/* كتاب الدورة */}
//           <div className="flex flex-col gap-2">
//             <Form.Item
//               label={
//                 <span className="font-semibold text-gray-700 flex items-center gap-2">
//                   <FileTextOutlined className="text-cyan-600" />
//                   كتاب الدورة
//                 </span>
//               }
//               name="courseBook"
//               valuePropName="fileList"
//               getValueFromEvent={normFile}
//             >
//               <Dragger
//                 multiple={false}
//                 accept=".pdf,.doc,.docx,.txt"
//                 beforeUpload={customBeforeUpload}
//                 fileList={courseBookFileList}
//                 onChange={handleCourseBookChange}
//               >
//                 <p className="ant-upload-drag-icon">
//                   <InboxOutlined />
//                 </p>
//                 <p className="ant-upload-text">
//                   {isEditMode && rowData?.round_book_url ? "تغيير كتاب الدورة" : "اسحب ملف كتاب الدورة هنا أو اضغط للاختيار"}
//                 </p>
//               </Dragger>
//             </Form.Item>
//             {rowData && <a href={`${rowData?.round_book_url}`} target="_blank">
//               عرض الملف
//             </a>}
//           </div>

//           {/* ملف PDF إضافي */}
//           <div className="flex flex-col gap-2">
//             <Form.Item
//               label={
//                 <span className="font-semibold text-gray-700 flex items-center gap-2">
//                   <FileTextOutlined className="text-purple-600" />
//                   جدول الدورة
//                 </span>
//               }
//               name="extraPdf"
//               valuePropName="fileList"
//               getValueFromEvent={normFile}
//             >
//               <Dragger
//                 multiple={false}
//                 accept=".pdf,.doc,.docx,.txt"
//                 beforeUpload={customBeforeUpload}
//                 fileList={extraPdfFileList}
//                 onChange={handleExtraPdfChange}
//               >
//                 <p className="ant-upload-drag-icon">
//                   <InboxOutlined />
//                 </p>
//                 <p className="ant-upload-text">
//                   {isEditMode && rowData?.round_road_map_book_url ? "تغيير جدول الدورة" : "اسحب ملف PDF هنا أو اضغط للاختيار"}
//                 </p>

//               </Dragger>
//             </Form.Item>
//             {rowData && <a href={`${rowData?.round_road_map_book_url}`} target="_blank">
//               عرض الملف
//             </a>}
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

  useEffect(() => {
    if (get_categories_parts_list?.data?.message) {
      const options = get_categories_parts_list.data.message
        .filter((item) => Number(item?.course_category_id) === Number(selectedCategory))
        .map((part) => ({
          label: part?.name,
          value: part?.id,
        }));
      setCategoriesPartOptions(options || []);
    } else {
      setCategoriesPartOptions([]);
    }
  }, [get_categories_parts_list, selectedCategory]);

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
    
    // If user removes the file (empty array), mark old file for deletion
    // if (newFileList.length === 0 && isEditMode && rowData?.round_book_url) {
    //   setOldFilesToDelete(prev => ({ ...prev, round_book: true }));
    // } else if (newFileList.length > 0 && newFileList[0].originFileObj && isEditMode && rowData?.round_book_url) {
    //   // User uploaded a new file, mark old one for deletion
    //   setOldFilesToDelete(prev => ({ ...prev, round_book: true }));
    // }
  };

  const handleExtraPdfChange = ({ fileList: newFileList }) => {
    setExtraPdfFileList(newFileList);
    form.setFieldsValue({ extraPdf: newFileList });
    
    // If user removes the file (empty array), mark old file for deletion
    // if (newFileList.length === 0 && isEditMode && rowData?.round_road_map_book_url) {
    //   setOldFilesToDelete(prev => ({ ...prev, round_road_map_book: true }));
    // } else if (newFileList.length > 0 && newFileList[0].originFileObj && isEditMode && rowData?.round_road_map_book_url) {
    //   // User uploaded a new file, mark old one for deletion
    //   setOldFilesToDelete(prev => ({ ...prev, round_road_map_book: true }));
    // }
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
    console.log(rowData);
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
        free: Boolean(rowData.free),
        active: Boolean(rowData.active ?? true),
        goal: rowData.goal || "",
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

      form.setFieldsValue(formValues);

      if (formValues.category) {
        setSelectedCategory(formValues.category);
      }
      if (formValues.section) {
        setSelectedOption(formValues.section);
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

      // Initialize course book file list with existing file
      // if (rowData?.round_book_url && courseBookFileList.length === 0) {
      //   const fakeCourseBookFile = {
      //     uid: `course-book-${rowData.id}`,
      //     name: rowData?.round_book_name || "round-book.pdf",
      //     status: "done",
      //     url: rowData?.round_book_url,
      //   };
      //   setCourseBookFileList([fakeCourseBookFile]);
      //   form.setFieldsValue({ courseBook: [fakeCourseBookFile] });
      // }

      // Initialize extra PDF file list with existing file
      // if (rowData?.round_road_map_book_url && extraPdfFileList.length === 0) {
      //   const fakeRoadMapBookFile = {
      //     uid: `road-map-${rowData.id}`,
      //     name: rowData?.round_road_map_book_name || "road-map-book.pdf",
      //     status: "done",
      //     url: rowData.round_road_map_book_url,
      //   };
      //   setExtraPdfFileList([fakeRoadMapBookFile]);
      //   form.setFieldsValue({ extraPdf: [fakeRoadMapBookFile] });
      // }

      setIsInitialized(true);
    }
  }, [rowData, id, form, fileList, setFileList, setImagePreview, setSelectedCategory,
    courseBookFileList, extraPdfFileList, isInitialized, isEditMode]);

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
        free: Boolean(store_round?.free),
        active: Boolean(store_round?.active ?? true),
        goal: store_round?.goal || "",
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
      if (formValues.section) {
        setSelectedOption(formValues.section);
      }

      if (store_round?.round_book && courseBookFileList.length === 0) {
        if (typeof store_round.round_book === 'string' && store_round.round_book.startsWith('http')) {
          const fakeCourseBookFile = {
            uid: `${Date.now()}-round-book`,
            name: store_round?.round_book_name || "round-book.pdf",
            status: "done",
            url: store_round.round_book,
          };
          setCourseBookFileList([fakeCourseBookFile]);
          form.setFieldsValue({ courseBook: [fakeCourseBookFile] });
        }
      }

      if (store_round?.round_road_map_book && extraPdfFileList.length === 0) {
        if (typeof store_round.round_road_map_book === 'string' && store_round.round_road_map_book.startsWith('http')) {
          const fakeRoadMapBookFile = {
            uid: `${Date.now()}-road-map-book`,
            name: store_round?.round_road_map_book || "road-map-book.pdf",
            status: "done",
            url: store_round.round_road_map_book,
          };
          setExtraPdfFileList([fakeRoadMapBookFile]);
          form.setFieldsValue({ extraPdf: [fakeRoadMapBookFile] });
        }
      }

      setIsInitialized(true);
    }
  }, [store_round, courseBookFileList, extraPdfFileList, form, setSelectedCategory,
    rowData, isInitialized, setCourseBookFileList, setExtraPdfFileList]);

  /* ====================== Validation ====================== */
  const validateFormBeforeSubmit = (values) => {
    const errors = [];

    if (!values.name?.trim()) errors.push("name");
    if (values.price === undefined || values.price === null || values.price === "") errors.push("price");
    if (!values.category) errors.push("category");
    if (!values.section) errors.push("section");
    if (!values.description?.trim()) errors.push("description");
    if (!values.genderPolicy) errors.push("genderPolicy");
    if (!values.capacity) errors.push("capacity");
    if (!values.instructor || values.instructor.length === 0) errors.push("instructor");

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

      const [start, end] = values.availableRange;

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
      formData.append("description", values?.description?.trim());
      formData.append("price", values?.price?.toString() || "0");

      if (start && isDayjsValid(start)) {
        formData.append("start_date", dayjs(start).format("YYYY-MM-DD"));
      }
      if (end && isDayjsValid(end)) {
        formData.append("end_date", dayjs(end).format("YYYY-MM-DD"));
      }

      formData.append("gender", values.genderPolicy || "both");
      formData.append("for", "Beginners");
      formData.append("goal", values?.goal || "");
      formData.append("course_category_id", selectedCategory?.toString());
      formData.append("category_part_id", selectedOption?.toString());
      formData.append("source", isSource ? "0" : "1");
      formData.append("capacity", values?.capacity?.toString() || "20");

      if (timeString) {
        formData.append("time_show", timeString);
      }

      formData.append("teacher_id", values?.instructor?.join(",") || "");
      formData.append("free", values?.free ? "1" : "0");
      formData.append("active", values?.active ? "1" : "0");

      if (isEditMode) {
        formData.append("id", rowData?.id?.toString());

        if (imageFile) {
          formData.append("image", imageFile);
        } else if (oldFilesToDelete.image) {
          // If image was removed, send empty string to delete it
          formData.append("image", "");
        }

        // Handle course book
        if (courseBookFile) {
          // User uploaded a new file
          formData.append("round_book", courseBookFile);
        } else if (oldFilesToDelete.round_book) {
          // User removed the existing file (via trash icon)
          formData.append("round_book", "");
        } else if (rowData?.round_book_url && !oldFilesToDelete.round_book) {
          // Keep the existing file - send the URL
          formData.append("round_book", rowData.round_book_url);
        } else {
          // No file was provided - send empty
          formData.append("round_book", "");
        }

        // Handle extra PDF
        if (extraPdfFile) {
          // User uploaded a new file
          formData.append("round_road_map_book", extraPdfFile);
        } else if (oldFilesToDelete.round_road_map_book) {
          // User removed the existing file (via trash icon)
          formData.append("round_road_map_book", "");
        } else if (rowData?.round_road_map_book_url && !oldFilesToDelete.round_road_map_book) {
          // Keep the existing file - send the URL
          formData.append("round_road_map_book", rowData.round_road_map_book_url);
        } else {
          // No file was provided - send empty
          formData.append("round_road_map_book", "");
        }
      } else {
        // For new course
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

        dispatch(add_round_data({
          ...values,
          course_category_id: selectedCategory,
          category_part_id: selectedOption,
          teacher_id: values?.instructor?.join(','),
          start_date: dayjs(start).format("YYYY-MM-DD"),
          end_date: dayjs(end).format("YYYY-MM-DD"),
          time_show: timeString,
          round_road_map_book: extraPdfFile,
          round_book: courseBookFile
        }));
      }

      const result = await dispatch(
        isEditMode
          ? handleEditBaiskRound({ body: formData })
          : handleAddBaiskRound({ body: formData })
      ).unwrap();

      if (result?.data?.status == "success") {
        const roundIdValue = result?.data?.message?.round_id || rowData?.id || id;
        setRoundId(roundIdValue);
        dispatch(handleGetSourceRound({ page, per_page: 6 }));
        dispatch(handleGetAllRounds({
          course_category_id: Cat_id,
          page,
          per_page: 6
        }))
        if (isEditMode) {
          toast.success(
            result?.data?.message?.message || "تم تحديث الدورة بنجاح"
          );

          // Reset deletion flags
          setOldFilesToDelete({
            image: false,
            round_book: false,
            round_road_map_book: false,
          });
        } else {
          toast.success(result?.data?.message || "تم إضافة الدورة بنجاح");
        }
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

    const touched = {};
    uniqueErrors.forEach((field) => (touched[field] = true));
    setTouchedFields((prev) => ({ ...prev, ...touched }));
  }

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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Image Upload */}
          <div className="lg:col-span-1" data-field="image">
            <Form.Item
              label={
                <span className="font-semibold text-gray-700 flex items-center gap-2">
                  <InboxOutlined className="text-blue-600" />
                  صورة الدورة {!isEditMode && "*"}
                </span>
              }
              required={!isEditMode}
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
                      الفئة *
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
                    loading={get_categories_parts_loading}
                    placeholder="اختر قسم من الفئة"
                    className={`rounded-xl ${hasError("section") ? "border-red-400" : ""
                      }`}
                    disabled={!selectedCategory || get_categories_parts_loading}
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
                    سياسة النوع *
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
                    السعة القصوى *
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
                    المدربين *
                  </span>
                }
                name="instructor"
                rules={[{ required: true, message: "اختر المدربين" }]}
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
              className={`w-full rounded-xl ${hasError("availableRange") ? "border-red-400" : ""
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
                  className={`bg-white border rounded-xl ${hasError("goal") ? "border-red-400" : "border-gray-200"
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
          <div className="flex flex-col gap-2">
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
                onRemove={(file) => {
                  console.log(file);
                  // setCourseBookFileList([])
                  // When user clicks trash icon, file will be removed from UI
                  // The handleCourseBookChange will handle marking for deletion
                  return true;
                }}
              >
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                  {isEditMode && rowData?.round_book_url ? "تغيير كتاب الدورة" : "اسحب ملف كتاب الدورة هنا أو اضغط للاختيار"}
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
                    // Remove file from UI
                    setCourseBookFileList([]);
                    // Mark for deletion
                    setOldFilesToDelete(prev => ({ ...prev, round_book: true }));
                    // toast.info("تم إزالة ملف كتاب الدورة. سيتم حذفه عند الحفظ.");
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
                  جدول الدورة
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
                onRemove={(file) => {
                  // When user clicks trash icon, file will be removed from UI
                  // The handleExtraPdfChange will handle marking for deletion
                  return true;
                }}
              >
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                  {isEditMode && rowData?.round_road_map_book_url ? "تغيير جدول الدورة" : "اسحب ملف PDF هنا أو اضغط للاختيار"}
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
                    // Remove file from UI
                    setExtraPdfFileList([]);
                    // Mark for deletion
                    setOldFilesToDelete(prev => ({ ...prev, round_road_map_book: true }));
                    // toast.info("تم إزالة ملف كتاب الدورة. سيتم حذفه عند الحفظ.");
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