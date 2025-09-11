"use client"
import React, { useEffect } from 'react'
import Button from '../atoms/Button'
import { Form, Switch , Modal, Input} from 'antd'
import { X } from 'lucide-react';

export default function AddCategoryModal({visible,
    onCancel,
    onFinish,
    initialValues,
    formTitle,
    confirmLoading}) {
    const [form] = Form.useForm();

  useEffect(() => {
    // ✅ تأكد أن الفورم يتحدث عند تغيير initialValues
    if (visible) {
      form.resetFields();
      if (initialValues) {
        form.setFieldsValue(initialValues);
      }
    }
  }, [visible, initialValues, form]);

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };
  return (
    <Modal
    title={formTitle}
    open={visible}
    onCancel={handleCancel}
    footer={null}
    width={600}
    closeIcon={<X className="w-5 h-5" />}
  >
    <Form form={form} layout="vertical" onFinish={onFinish} className="mt-6">
      <Form.Item
        name="title"
        label="اسم الفئة"
        rules={[
          { required: true, message: "يرجى إدخال اسم الفئة" },
          { min: 3, message: "يجب أن يكون الاسم على الأقل 3 أحرف" },
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
        ]}
      >
        <Input.TextArea placeholder="أدخل وصف الفئة" rows={4} />
      </Form.Item>

      <Form.Item
        name="status"
        label="حالة الفئة"
        valuePropName="checked"
        initialValue={true}
      >
        <Switch
          checkedChildren="نشط"
          unCheckedChildren="غير نشط"
          defaultChecked
        />
      </Form.Item>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <Button type="secondary" onClick={handleCancel}>
          إلغاء
        </Button>
        <Button type="primary" htmlType="submit" loading={confirmLoading}>
          حفظ
        </Button>
      </div>
    </Form>
  </Modal>
  )
}
