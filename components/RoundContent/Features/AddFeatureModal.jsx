import { Modal, Form, Input, Button, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { handleAddRoundFeatures, handleGetAllRoundFeatures } from '../../../lib/features/featuresSlice';
import { toast } from 'react-toastify';

export default function AddFeatureModal({ open, setOpen, id }) {
  console.log(open);
  // Use Antd Form instance for form submission and validation
  const [form] = Form.useForm(); 
  
  const [featureData, setFeatureData] = useState({
    title: "",
    description: "",
    image: null,
  });
  
  const dispatch = useDispatch();
  const { add_feature_loading } = useSelector(state => state?.features);

  // --- Utility Functions ---

  const handleClose = () => {
    setOpen(false);
    form.resetFields(); // Clear form fields on close
    setFeatureData({ // Reset state data
      title: "",
      description: "",
      image: null,
    });
  };

  const handleImageChange = (info) => {
    // Only proceed if a file is present and not an array
    const file = info.fileList?.[0]?.originFileObj || null;
    if (file) {
      setFeatureData(prev => ({ ...prev, image: file }));
    } else {
       setFeatureData(prev => ({ ...prev, image: null }));
    }

    // Prevents Antd from auto-uploading
    return false;
  };


  // --- Submission Handler ---
  
  async function handleSubmit() {
    try {
      // Validate all form fields first
      const values = await form.validateFields();
      
      const formData = new FormData();
      formData.append("round_id", id);
      formData.append("title", featureData.title);
      formData.append("description", featureData.description);
      
      // Conditionally append image only if it exists
      if (featureData.image) {
        formData.append("image", featureData.image);
      }
      
      // Show loading state and dispatch action
      dispatch(handleAddRoundFeatures({ body: formData }))
        .unwrap()
        .then(res => {
          if (res?.data?.status === "success") {
            toast.success(res?.data?.message || "تم إضافة الميزة بنجاح");
            
            // Refetch all features after successful addition
            dispatch(handleGetAllRoundFeatures({ body: { round_id: id } }));
            
            handleClose(); // Close and reset modal on success

          } else {
            toast.error(res?.data?.message || res?.data || "هناك خطأ أثناء إضافة الميزة");
          }
        })
        .catch(e => {
          console.error("Feature submission error:", e);
          toast.error("حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.");
        });

    } catch (errorInfo) {
      // This catches validation errors (e.g., required fields not filled)
      console.log('Validation Failed:', errorInfo);
      toast.error("يرجى ملء جميع الحقول المطلوبة بشكل صحيح.");
    }
  }

  // --- Component Render ---
  
  return (
    <Modal
      open={open}
      title="إضافة مميزات الدورة"
      onCancel={handleClose}
      confirmLoading={add_feature_loading}
      okText="إضافة"
      okButtonProps={{className:"bg-blue-500"}}
      cancelText="إلغاء"
      // Use the footer to handle submission via Antd's Form methods
      onOk={handleSubmit}
    >
      <Form
        form={form} // Connect the form instance
        layout="vertical"
        onValuesChange={(changedValues, allValues) => {
          // Update local state when form values change
          setFeatureData(prev => ({
            ...prev,
            ...changedValues
          }));
        }}
      >
        {/* Title Field */}
        <Form.Item
          name="title"
          label="عنوان الميزة"
          rules={[{ required: true, message: 'الرجاء إدخال عنوان الميزة!' }]}
        >
          <Input placeholder="مثال: شهادة معتمدة" />
        </Form.Item>

        {/* Description Field */}
        <Form.Item
          name="description"
          label="وصف الميزة"
          rules={[{ required: true, message: 'الرجاء إدخال وصف الميزة!' }]}
        >
          <Input.TextArea rows={4} placeholder="مثال: يحصل المتدرب على شهادة معتمدة من الجهة الفلانية بعد إتمام الدورة." />
        </Form.Item>

        {/* Image Upload Field */}
        <Form.Item
          name="image"
          label="صورة الميزة "
           rules={[{ required: true,}]}
          // No 'required' rule, but a custom validation to ensure file type if one is uploaded
          valuePropName="fileList"
          getValueFromEvent={(e) => {
            if (Array.isArray(e)) {
              return e;
            }
            return e && e.fileList;
          }}
        >
          <Upload
            name="image"
            listType="picture"
            maxCount={1}
            beforeUpload={() => false} // Prevent automatic upload
            onChange={handleImageChange}
            accept=".png,.jpg,.jpeg"
          >
            <Button icon={<UploadOutlined />}>اختر صورة</Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
}