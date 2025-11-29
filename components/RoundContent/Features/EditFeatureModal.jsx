import { Modal, Form, Input, Button, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import React, { useEffect } from 'react'; 
import { useDispatch, useSelector } from 'react-redux';
import { handleEditRoundFeatures, handleGetAllRoundFeatures } from '../../../lib/features/featuresSlice';
import { toast } from 'react-toastify';

export default function EditFeatureModal({ open, setOpen, id, rowData, setRowData }) {
  const [form] = Form.useForm();

  const dispatch = useDispatch();
  const { edit_feature_loading } = useSelector(state => state?.features);

  // --- Effect to Populate Form Fields ---
  useEffect(() => {
    if (open && rowData) {
      // 1. Set fields for title and description directly
      form.setFieldsValue({
        title: rowData.title,
        description: rowData.description,
      });

      // 2. Handle Image URL for preview
      if (typeof rowData.image === 'string' && rowData.image.startsWith('http')) {
        form.setFieldsValue({
          image: [
            {
              uid: '-1', // Unique ID for existing image
              name: 'Existing Image',
              status: 'done',
              url: rowData.image, // URL of existing image
              isExisting: true, // Flag to indicate this is an existing image
            },
          ],
        });
      } else if (rowData.image instanceof File) {
         // If rowData already holds a File (e.g., if selected before modal closed)
         form.setFieldsValue({
            image: [{ 
                uid: '-1', 
                name: rowData.image.name, 
                status: 'done' 
            }]
         });
      }
      else {
        form.setFieldsValue({ image: [] });
      }
    }
  }, [open, rowData, form]);

  const handleClose = () => {
    setOpen(false);
    form.resetFields();
    setRowData({}); // Reset rowData to an empty object
  };

  // --- FIX: Corrected handleImageChange ---
  const handleImageChange = (info) => {
    const fileList = info.fileList;
    
    // Check if a file was selected/kept
    if (fileList.length > 0) {
      const file = fileList[0];
      
      if (file.originFileObj) {
        // A new file was selected (originFileObj exists)
        setRowData(prev => ({ ...prev, image: file.originFileObj }));
      } else if (file.isExisting || file.url) {
        // The existing file URL is still present
        setRowData(prev => ({ ...prev, image: prev.image })); 
      }
    } else {
      // Image was removed or list is empty
      setRowData(prev => ({ ...prev, image: null }));
    }

    // CRITICAL: Must return the fileList so the Form.Item can update the visual component
    return info.fileList; 
  };


  const handleSubmit = async () => {
    try {
      // Validate all fields
      const values = await form.validateFields();
      
      const formData = new FormData();
      
      // Feature ID (must be sent for editing)
      if (rowData.feature_id) {
        formData.append("id", rowData.feature_id);
      }
      formData.append("round_id", id);
      
      // Append current title and description from state
      formData.append("title", rowData.title);
      formData.append("description", rowData.description);

      // Handle image payload
      if (rowData.image instanceof File) {
        // Case 1: New file selected by the user
        formData.append("image", rowData.image); 
      } else if (typeof rowData.image === 'string' && rowData.image.startsWith('http')) {
        // Case 2: Existing URL (User didn't change the image, send the URL back)
        formData.append("image", rowData.image); 
      } else if (rowData.image === null) {
        // Case 3: Image explicitly removed (Send a signal to delete if needed)
        // Check your API documentation for how to handle image removal. 
        // Example: formData.append("delete_image", "true"); 
        // If your API ignores "image" when null, you can skip this.
      }
      
      dispatch(handleEditRoundFeatures({ body: formData }))
        .unwrap()
        .then(res => {
          console.log(res);
          if (res?.data?.status == "success") {
            toast.success(res?.data?.message || "تم تعديل الميزة بنجاح");
            dispatch(handleGetAllRoundFeatures({ body: { round_id: id } }));
            handleClose();
          } else {
            toast.error(res?.data?.message || "هناك خطأ أثناء تعديل الميزة");
          }
        })
        .catch(e => {
          console.error("Feature submission error:", e);
          toast.error("حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.");
        });

    } catch (errorInfo) {
      console.log('Validation Failed:', errorInfo);
      toast.error("يرجى ملء جميع الحقول المطلوبة بشكل صحيح.");
    }
  };

  return (
    <Modal
      open={open}
      title="تعديل مميزات الدورة"
      onCancel={handleClose}
      confirmLoading={edit_feature_loading}
      okText="تعديل"
      cancelText="إلغاء"
      onOk={handleSubmit}
    >
      <Form
        form={form}
        layout="vertical"
        // onValuesChange handles title/description state update
        onValuesChange={(changedValues) => {
          if (changedValues.title !== undefined || changedValues.description !== undefined) {
             setRowData(prev => ({
               ...prev,
               ...changedValues
             }));
          }
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
          label="صورة الميزة"
          valuePropName="fileList"
          // CRITICAL: getValueFromEvent must pass the fileList through
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
            onChange={handleImageChange} // Custom handler for setting rowData
            accept=".png,.jpg,.jpeg"
          >
            <Button icon={<UploadOutlined />}>اختر صورة</Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
}