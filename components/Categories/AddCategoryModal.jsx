"use client";

import React, { useEffect, useState } from "react";
import { Form, Switch, Modal, Input, Upload, message , Button} from "antd";
import {  UploadOutlined, PlusOutlined } from "@ant-design/icons";
import {X} from 'lucide-react';
import { toast } from "react-toastify";

export default function AddCategoryModal({
  visible,
  onCancel,
  onFinish,
  initialValues,
  formTitle = "إضافة فئة جديدة",
  confirmLoading = false,
  selectedCategory, // للتعديل
}) {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);

  // إعادة تعيين النموذج عند فتح المودال أو تغيير القيم الأولية
  useEffect(() => {
    if (visible) {
      form.resetFields();
      setFileList([]);

      if (initialValues) {
        form.setFieldsValue({
          title: initialValues.title || initialValues.name,
          description: initialValues.description,
          status: initialValues.status === true || initialValues.status === "active" || initialValues.active === "1",
        });

        // إذا كان هناك صورة موجودة في التعديل (للتعديل)
        if (initialValues.image_url) {
          setFileList([
            {
              uid: "-1",
              name: "image.png",
              status: "done",
              url: initialValues.image_url,
              thumbUrl: initialValues.image_url,
            },
          ]);
        }
      }
    }
  }, [visible, initialValues, form]);

  const handleCancel = () => {
    form.resetFields();
    setFileList([]);
    onCancel?.();
  };

  const beforeUpload = (file) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      toast.error("يمكنك رفع ملفات الصور فقط!");
      return Upload.LIST_IGNORE;
    }

    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      toast.error("حجم الصورة يجب أن يكون أقل من 5 ميغابايت!");
      return Upload.LIST_IGNORE;
    }

    return false; // منع الرفع التلقائي
  };

  const handleFileChange = ({ fileList: newFileList }) => {
    setFileList(newFileList.slice(-1)); // فقط صورة واحدة
  };

  const handleRemove = () => {
    setFileList([]);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields(); // سيُرمي خطأ إذا فشل التحقق

      const formData = new FormData();

      if (selectedCategory?.id) {
        formData.append("id", selectedCategory.id);
      }

      formData.append("name", values.title);
      formData.append("description", values.description);
      formData.append("active", values.status ? "1" : "0");

      // إذا تم رفع صورة جديدة
      if (fileList.length > 0 && fileList[0]?.originFileObj) {
        formData.append("image", fileList[0].originFileObj);
      }

      // إذا تم حذف الصورة القديمة (fileList فارغ لكن كان في صورة قبلًا)
      if (fileList.length === 0 && initialValues?.image_url) {
        formData.append("remove_image", "1"); // أخبر الباك إند بحذف الصورة
      }

      onFinish?.({ formData });

    } catch (error) {
      // هنا نعالج أخطاء التحقق من الصحة
      if (error.errorFields && error.errorFields.length > 0) {
        const errors = error.errorFields.map(field => field.errors[0]).join(" • ");
        toast.error(errors || "يرجى تعبئة جميع الحقول المطلوبة بشكل صحيح");
      } else {
        toast.error("حدث خطأ أثناء التحقق من البيانات");
      }
    }
  };

  return (
    <Modal
      title={<span className="text-lg font-semibold">{formTitle}</span>}
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={600}
      closeIcon={<X className="w-5 h-5 text-gray-500" />}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="mt-6"
        initialValues={{ status: true }}
      >
        <Form.Item
          name="title"
          label="اسم الفئة"
          rules={[
            { required: true, message: "اسم الفئة مطلوب" },
            { min: 3, message: "يجب أن يكون الاسم 3 أحرف على الأقل" },
            { max: 255, message: "الاسم لا يتجاوز 255 حرف" },
          ]}
          validateTrigger="onSubmit" // لإخفاء الرسائل تحت الحقل
        >
          <Input
            placeholder="مثال: تطوير الويب، تصميم جرافيك..."
            size="large"
            className="rounded-lg"
          />
        </Form.Item>

        <Form.Item
          name="description"
          label="وصف الفئة"
          rules={[
            { required: true, message: "الوصف مطلوب" },
          ]}
          validateTrigger="onSubmit"
        >
          <Input.TextArea
            placeholder="وصف مختصر وجذاب للفئة..."
            rows={4}
            showCount
            maxLength={500}
            className="rounded-lg"
          />
        </Form.Item>

        <Form.Item label="صورة الغلاف">
          <Upload
             rules={[
            { required: true, message: "الصورة مطلوب" },
             ]}
            listType="picture-card"
            fileList={fileList}
            beforeUpload={beforeUpload}
            onChange={handleFileChange}
            onRemove={handleRemove}
            maxCount={1}
            accept="image/*"
            showUploadList={{
              showPreviewIcon: true,
              showRemoveIcon: true,
            }}
          >
            {fileList.length === 0 && (
              <div className="flex flex-col items-center justify-center py-4">
                <UploadOutlined className="text-2xl text-gray-400 mb-2" />
                <div className="text-sm text-gray-600">ارفع صورة</div>
                <div className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP • حتى 5MB</div>
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

        <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
          <Button
            onClick={handleCancel}
            disabled={confirmLoading}
            size="large"
            className="px-6"
          >
            إلغاء
          </Button>

          <Button
            type="primary"
            htmlType="submit"
            loading={confirmLoading}
            size="large"
            className="px-8 bg-blue-600 hover:bg-blue-700"
          >
            {confirmLoading ? "جاري الحفظ..." : "حفظ الفئة"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
}