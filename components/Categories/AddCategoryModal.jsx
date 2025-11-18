"use client";
import React, { useEffect, useState } from "react";
import Button from "../atoms/Button";
import { Form, Switch, Modal, Input, Upload, message } from "antd";
import { X } from "lucide-react";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";


export default function AddCategoryModal({
  visible,
  onCancel,
  onFinish,
  initialValues,
  formTitle,
  confirmLoading,
  selectdCategory
}) {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    if (visible) {
      form.resetFields();
      setFileList([]);
      if (initialValues) {
        form.setFieldsValue({
          title: initialValues.title,
          description: initialValues.description,
          status:
            initialValues.status === "active" || initialValues.status === true,
        });
      }
    }
  }, [visible, initialValues, form]);

  const handleCancel = () => {
    form.resetFields();
    setFileList([]);
    onCancel();
  };

  const handleFileChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const beforeUpload = (file) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("يمكنك رفع ملفات الصور فقط!");
      return Upload.LIST_IGNORE;
    }

    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error("حجم الصورة يجب أن يكون أقل من 5MB!");
      return Upload.LIST_IGNORE;
    }

    return false; // Prevent auto upload
  };

  const handleRemove = () => {
    setFileList([]);
  };

  async function handleSubmit(values) {
    const formData = new FormData();
    if(selectdCategory) {
      formData.append("id" , selectdCategory?.id)
    }
    formData.append("name", values.title);
    formData.append("description", values.description);
    formData.append("active", values.status ? "1" : "0");

    if (fileList.length > 0 && fileList[0].originFileObj) {
      formData.append("image", fileList[0].originFileObj);
    }

    onFinish?.({
      values,
      formData,
      fileList,
    });
  }

  return (
    <Modal
      title={formTitle}
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={600}
      closeIcon={<X className="w-5 h-5" />}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="mt-6"
        initialValues={{
          status: true,
        }}
      >
        <Form.Item
          name="title"
          label="اسم الفئة"
          rules={[
            { required: true, message: "يرجى إدخال اسم الفئة" },
            { min: 3, message: "يجب أن يكون الاسم على الأقل 3 أحرف" },
            { max: 255, message: "يجب أن لا يتجاوز الاسم 255 حرف" },
          ]}
        >
          <Input placeholder="أدخل اسم الفئة" />
        </Form.Item>

        <Form.Item
          name="description"
          label="وصف الفئة"
          rules={[
            { required: true, message: "يرجى إدخال وصف الفئة" },
            { min: 10, message: "يجب أن يكون الوصف على الأقل 10 أحرف" },
            { max: 500, message: "يجب أن لا يتجاوز الوصف 500 حرف" },
          ]}
        >
          <Input.TextArea
            placeholder="أدخل وصف الفئة"
            rows={4}
            showCount
            maxLength={500}
          />
        </Form.Item>

        <Form.Item
          label="رفع صورة الغلاف (اختياري)"
          extra="الصور المدعومة: JPG, PNG, WEBP - الحد الأقصى للحجم: 5MB"
        >
          <Upload
            name="image"
            listType="picture"
            fileList={fileList}
            beforeUpload={beforeUpload}
            onChange={handleFileChange}
            onRemove={handleRemove}
            maxCount={1}
            accept="image/*"
          >
            {fileList.length >= 1 ? null : (
              <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors">
                <p className="flex justify-center text-2xl text-gray-400 mb-2">
                  <UploadOutlined />
                </p>
                <p className="text-center text-gray-600">
                  <PlusOutlined /> اضغط أو اسحب الصورة هنا
                </p>
                <p className="text-center text-gray-400 text-sm mt-1">
                  JPG, PNG, WEBP - حتى 5MB
                </p>
              </div>
            )}
          </Upload>
        </Form.Item>

        <Form.Item name="status" label="حالة الفئة" valuePropName="checked">
          <Switch
            checkedChildren="نشط"
            unCheckedChildren="غير نشط"
            defaultChecked
          />
        </Form.Item>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <Button
            type="secondary"
            onClick={handleCancel}
            disabled={confirmLoading}
          >
            إلغاء
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={confirmLoading}
            disabled={confirmLoading}
          >
            {confirmLoading ? "جاري الحفظ..." : "حفظ"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
