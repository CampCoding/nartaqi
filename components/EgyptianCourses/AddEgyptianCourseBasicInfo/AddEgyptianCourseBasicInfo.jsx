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
  message,
} from "antd";
import React from "react";
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
} from "@ant-design/icons";
import dayjs from "dayjs";

const { Dragger } = Upload;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

const props = {
  name: "file",
  multiple: true,
  action: "https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload",
  onChange(info) {
    const { status } = info.file;
    if (status !== "uploading") {
      console.log(info.file, info.fileList);
    }
    if (status === "done") {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
  onDrop(e) {
    console.log("Dropped files", e.dataTransfer.files);
  },
};

export default function AddEgyptianCourseBasicInfo({
  fileList,
  setFileList,
  selectedCategory,
  setSelectedCategory,
  selectedSection,
  setSelectedSection,
  availableSections,
  availableGrades,
  all_categories,
  beforeUpload,
  setImagePreview,
  rowData,
  setRowData
}) {
  return (
    <div className="space-y-8">
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
          >
            <Dragger
              accept="image/*"
              multiple={false}
              maxCount={1}
              beforeUpload={beforeUpload}
              fileList={fileList}
              onChange={({ fileList }) => setFileList(fileList)}
              onRemove={() => {
                setFileList([]);
                setImagePreview(null);
              }}
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
                  controls={true}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
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
                  options={all_categories?.map((item) => ({
                    label: (
                      <div className="flex items-center gap-2">
                        <Badge
                          count={item.sections?.length || 0}
                          size="small"
                        />
                        <span>{item.title}</span>
                      </div>
                    ),
                    value: item.id,
                  }))}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
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
                  onChange={setSelectedSection}
                  options={availableSections.map((section) => ({
                    label: section.name,
                    value: section.id,
                  }))}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label={
                  <span className="font-semibold text-gray-700 flex items-center gap-2">
                    <BookOutlined className="text-teal-600" />
                    المرحلة/الصف
                  </span>
                }
                name="grade"
              >
                <Select
                  placeholder="اختر المرحلة/الصف"
                  className="rounded-xl"
                  disabled={!selectedSection || availableGrades.length === 0}
                  options={availableGrades.map((grade) => ({
                    label: grade.name,
                    value: grade.value,
                  }))}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label={
              <span className="font-semibold text-gray-700 flex items-center gap-2">
                <FileTextOutlined className="text-blue-500" />
                وصف الدورة *
              </span>
            }
            name="description"
            rules={[
              { required: true, message: "أدخل وصفًا للدورة" },
              { min: 20, message: "الوصف لا يقل عن 20 حرف" },
            ]}
          >
            <TextArea
              rows={4}
              placeholder="أدخل وصفًا تفصيليًا للدورة التعليمية..."
              className="rounded-xl border-gray-300 hover:border-blue-400 focus:border-blue-500"
              showCount
              maxLength={1000}
            />
          </Form.Item>
        </div>
      </div>
    </div>
  );
}