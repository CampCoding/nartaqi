import {
  Col,
  DatePicker,
  Badge,
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
import { handleAddBaiskRound, handleGetSourceRound } from "../../lib/features/roundsSlice";
import { handleGetAllTeachers } from "../../lib/features/teacherSlice";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const { Dragger } = Upload;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

// 🔹 Upload props for course book (books, PDFs, etc.)
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

// 🔹 Custom beforeUpload function to prevent auto-upload
const customBeforeUpload = (file) => {
  return false; // Prevent auto-upload
};

export default function AddCourseSourceBasicInfo({
  fileList,
  setFileList,
  selectedCategory,
  setSelectedCategory,
  availableSections,
  all_categories,
  beforeUpload = customBeforeUpload,
  setImagePreview,
  rowData,
  setRowData,
}) {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { all_courses_categories_list, get_categories_parts_list } =
    useSelector((state) => state?.categories);
  const {add_round_loading }=  useSelector(state => state?.rounds);

  const [categoriesOptions, setCategoriesOptions] = useState([]);
  const [categoriesPartOptions, setCategoriesPartOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {teachers_loading , teachers_list} = useSelector(state => state?.teachers)
  const [teacherOptions , setTeacherOptions]  = useState([]);
  const router = useRouter();

  /* ====================== Load categories & parts ====================== */
  useEffect(() => {
    dispatch(handleGetAllTeachers())
  } , [dispatch])

  useEffect(() => {
  setTeacherOptions(teachers_list?.data?.message?.map(item => ({label : item?.name , value : item?.id})))
  } ,[teachers_list])

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
    if (!selectedCategory) return;
    const data_send = {
      course_category_id: selectedCategory,
    };
    dispatch(handleGetCategoryParts({ body: data_send }));
  }, [selectedCategory, dispatch]);

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

    // Set image preview if there's a file
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
  };

  const handleRemoveFile = () => {
    setFileList([]);
    setImagePreview(null);
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
      active: rowData.active || true,
      goal: rowData.goal || "",
    };

    // Handle date range
    if (rowData.start_date && rowData.end_date) {
      formValues.availableRange = [
        dayjs(rowData.start_date),
        dayjs(rowData.end_date),
      ];
    }

    // Handle time - safely check if time exists and is valid
    if (rowData.time || rowData.duration_time || rowData.time_show) {
      const timeValue =
        rowData.time || rowData.duration_time || rowData.time_show;
      const parsedTime = dayjs(timeValue, "HH:mm:ss");
      if (parsedTime.isValid()) {
        formValues.time = parsedTime;
      }
    }

    form.setFieldsValue(formValues);

    // Prefill الصورة داخل Upload + المعاينة
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
  }, [rowData, form, fileList, setFileList, setImagePreview]);

  /* ====================== Validation Functions ====================== */

  const validateFormBeforeSubmit = (values) => {
    const errors = [];

    // Check required fields
    if (!values.name?.trim()) errors.push("اسم الدورة");
    if (!values.price && values.price !== 0) errors.push("السعر");
    if (!values.category) errors.push("الفئة");
    if (!values.section) errors.push("القسم");
    if (!values.description?.trim()) errors.push("وصف الدورة");
    if (!values.genderPolicy) errors.push("سياسة النوع");
    if (!values.capacity) errors.push("السعة القصوى");
    if (!values.instructor || values.instructor.length === 0)
      errors.push("المدربين");
    if (!values.availableRange || values.availableRange.length !== 2)
      errors.push("فترة إتاحة الدورة");
    if (!values.goal?.trim()) errors.push("الهدف");

    // Check image upload
    if (!fileList || fileList.length === 0) {
      errors.push("صورة الدورة");
    }

    return errors;
  };

  /* ====================== Handle Submit (normalize data) ====================== */

  async function handleSubmit(values) {
    try {

      // 🔹 Validate all required fields before submission
      const validationErrors = validateFormBeforeSubmit(values);

      if (validationErrors.length > 0) {
        message.error(`الحقول التالية مطلوبة: ${validationErrors.join("، ")}`);
        setIsSubmitting(false);
        return;
      }

      // Check if image file is properly uploaded
      if (!fileList || fileList.length === 0) {
        message.error("يجب رفع صورة للدورة");
        setIsSubmitting(false);
        return;
      }

      // Safely handle date range
      const [start, end] = values.availableRange || [null, null];

      // Safely handle time formatting
      const timeString =
        values.time && values.time.isValid()
          ? values.time.format("HH:mm:ss")
          : null;

      // Handle file uploads safely
      const courseBookFiles = (values.courseBook || [])
        .map((f) => f.originFileObj || f)
        .filter(Boolean);

      const extraPdfFile =
        values.extraPdf && values.extraPdf[0]
          ? values.extraPdf[0].originFileObj || values.extraPdf[0]
          : null;

      // 🔹 FIXED: Better image file handling
      let imageFile = null;
      if (fileList && fileList.length > 0) {
        const file = fileList[0];
        console.log("File object:", file);

        // Check different possible file properties
        imageFile = file.originFileObj || file.response || file;

        // If it's a fake file from rowData, we might not have the actual file
        if (file.uid === "-1" && file.url && !file.originFileObj) {
          console.log("This is a preview file from existing data");
          imageFile = null;
        }
      }

      if (!imageFile) {
        message.error("يجب رفع صورة صالحة للدورة");
        setIsSubmitting(false);
        return;
      }
      const formData = new FormData();
      formData.append("name", values?.name?.trim());
      formData.append("description", values?.description?.trim());
      formData.append("price", values?.price);

      if (start) {
        formData.append("start_date", dayjs(start).format("YYYY-MM-DD"));
      }
      if (end) {
        formData.append("end_date", dayjs(end).format("YYYY-MM-DD"));
      }

      formData.append("gender", values.genderPolicy || "both");
      formData.append("for", "Beginners");
      formData.append("goal", values?.goal?.trim());
      formData.append("course_category_id", selectedCategory);
      formData.append("category_part_id", selectedOption);
      formData.append("source", 1);
      formData.append("capacity", values?.capacity);

      // if (timeString);
     formData.append("time_show", timeString || "")
       formData.append("round_book", courseBookFiles[0] || null)
      formData.append("teacher_id", values?.instructor?.join(","));

      formData.append("round_road_map_book", extraPdfFile || null)

      formData.append("free", values?.free ? 1 : 0);
      formData.append("active", values?.active ? 1 : 0);

      // Append image file
      if (imageFile) {
        formData.append("image", imageFile);
      }

      dispatch(handleAddBaiskRound({ body: formData })).unwrap()
      .then(res => {
        if(res?.data?.status == "success") {
          console.log(res?.data)
          router.push(`/round_content?id=${res?.data?.message?.round_id}`)
          toast.success(res?.data?.message?.message);
          dispatch(handleGetSourceRound())
        }else {
          toast.error(res?.data?.message)
        }
      })
    } catch (error) {
      console.error("Submission error:", error);
      toast.error({ content: "فشل في إضافة الدورة", key: "save" });

      if (error.message) {
        toast.error(`خطأ: ${error.message}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  const disabledDate = (current) => {
    // disable days before today
    return current && current < dayjs().startOf("day");
  };

  /* ====================== Handle Form Submit Failure ====================== */

  function handleSubmitFailed(errorInfo) {
    console.log("Form submission failed:", errorInfo);

    const errorFields = errorInfo.errorFields
      .map((field) => field.name[0])
      .flat();
    const uniqueErrors = [...new Set(errorFields)];

    message.error(`يرجى مراجعة الحقول التالية: ${uniqueErrors.join("، ")}`);
  }

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
          <div className="lg:col-span-1">
            <Form.Item
              label={
                <span className="font-semibold text-gray-700 flex items-center gap-2">
                  <InboxOutlined className="text-blue-600" />
                  صورة الدورة *
                </span>
              }
              required
              rules={[
                {
                  validator: () => {
                    if (!fileList || fileList.length === 0) {
                      return Promise.reject(new Error("صورة الدورة مطلوبة"));
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Dragger
                accept="image/*"
                multiple={false}
                maxCount={1}
                beforeUpload={beforeUpload}
                fileList={fileList}
                onChange={handleFileChange}
                onRemove={handleRemoveFile}
                listType="picture"
                className="border-2 border-dashed border-blue-300 hover:border-blue-400 rounded-xl bg-blue-50/50"
              >
                <p className="ant-upload-drag-icon">
                  <InboxOutlined className="text-blue-500 text-4xl" />
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
              <Col span={12}>
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
                    { max: 100, message: "الاسم لا يزيد عن 100 حرف" },
                  ]}
                >
                  <Input
                    placeholder="مثال: دورة البرمجة المتقدمة"
                    className="rounded-xl border-gray-300 hover:border-blue-400 focus:border-blue-500"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
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
                >
                  <InputNumber
                    className="w-full rounded-xl"
                    placeholder="499"
                    min={0}
                    step={1}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label={
                    <span className="font-semibold text-gray-700 flex items-center gap-2">
                      <FolderOutlined className="text-purple-600" />
                      الفئة *
                    </span>
                  }
                  name="category"
                  rules={[{ required: true, message: "اختر الفئة" }]}
                >
                  <Select
                    placeholder="اختر فئة الدورة"
                    className="rounded-xl"
                    onChange={setSelectedCategory}
                    options={categoriesOptions}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={
                    <span className="font-semibold text-gray-700 flex items-center gap-2">
                      <BookOutlined className="text-indigo-600" />
                      القسم *
                    </span>
                  }
                  name="section"
                  rules={[{ required: true, message: "اختر القسم" }]}
                >
                  <Select
                    placeholder="اختر قسم من الفئة"
                    className="rounded-xl"
                    disabled={!selectedCategory}
                    onChange={setSelectedOption}
                    options={categoriesPartOptions}
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
                { min: 10, message: "الوصف لا يقل عن 10 أحرف" },
                { max: 1000, message: "الوصف لا يزيد عن 1000 حرف" },
              ]}
            >
              <TextArea
                rows={4}
                placeholder="اكتب وصفاً شاملاً للدورة وأهدافها التعليمية..."
                className="rounded-xl border-gray-300 hover:border-blue-400 focus:border-blue-500"
                showCount
                maxLength={1000}
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
            <Col span={8}>
              <Form.Item
                label={
                  <span className="font-semibold text-gray-700 flex items-center gap-2">
                    <UserOutlined className="text-pink-600" />
                    سياسة النوع *
                  </span>
                }
                name="genderPolicy"
                rules={[{ required: true, message: "اختر السياسة" }]}
              >
                <Select
                  className="rounded-xl"
                  options={[
                    { label: "👨 للذكور فقط", value: "male" },
                    { label: "👩 للإناث فقط", value: "female" },
                    { label: "👥 للجميع", value: "both" },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label={
                  <span className="font-semibold text-gray-700 flex items-center gap-2">
                    <TeamOutlined className="text-red-600" />
                    السعة القصوى *
                  </span>
                }
                name="capacity"
                rules={[
                  { required: true, message: "أدخل السعة" },
                  { type: "number", min: 1, message: "لا تقل عن 1" },
                  { type: "number", max: 1000, message: "لا تزيد عن 1000" },
                ]}
              >
                <InputNumber
                  className="w-full rounded-xl"
                  placeholder="50"
                  min={1}
                  max={1000}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label={
                  <span className="font-semibold text-gray-700 flex items-center gap-2">
                    <UserOutlined className="text-cyan-600" />
                    المدربين *
                  </span>
                }
                name="instructor"
                rules={[{ required: true, message: "اختر المدربين" }]}
              >
                <Select
                  mode="multiple"
                  className="rounded-xl"
                  placeholder="اختر المدربين"
                  options={teacherOptions}
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
          >
            <RangePicker
              className="w-full rounded-xl"
              placeholder={["تاريخ البداية", "تاريخ النهاية"]}
              format="DD/MM/YYYY"
              disabledDate={disabledDate} // ⬅️ هنا
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
            <Col span={24}>
              <Form.Item
                label={
                  <span className="font-semibold text-gray-700 flex items-center gap-2">
                    الهدف *
                  </span>
                }
                name="goal"
                rules={[{ required: true, message: "أدخل الهدف" }]}
              >
                <Input placeholder="أدخل الهدف من الدورة" />
              </Form.Item>
            </Col>
          </Row>

          <Col span={12}>
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
              />
            </Form.Item>
          </Col>

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
            <Dragger multiple {...uploadProps}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Click or drag file to this area to upload
              </p>
              <p className="ant-upload-hint">
                Support for a single or bulk upload. Strictly prohibited from
                uploading company data or other banned files.
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
            <Dragger multiple={false} accept=".pdf">
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

        <Button
          type="primary"
          htmlType="submit"
          size="large"
          loading={add_round_loading}
          className="!bg-blue-600 mb-4 !me-auto !text-white hover:!bg-blue-700"
        >
          {add_round_loading ? "جاري الحفظ..." : "حفظ البيانات"}
        </Button>
      </Form>
    </div>
  );
}
