import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { handleGetAllRoundContent } from '../../../lib/features/roundContentSlice';
import { handleEditExamVideo, handleGetAllExamData } from '../../../lib/features/examSlice';

const EditExamVideoModal = ({ open, setOpen, rowData, setRowData, exam_id  , id}) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const { edit_exam_video_loading } = useSelector((state) => state?.exam);


  useEffect(() => {
    console.log(rowData);
    if (rowData && open) {
      form.setFieldsValue({
        title: rowData.title || '',
        description: rowData.description || '',
        video_url: rowData.video_url || rowData.video || '',
      });
    }
  }, [rowData, open, form]);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      
      const body = {
        id: rowData.id,
        exam_id: exam_id || rowData.exam_id,
        title: values.title,
        description: values.description || "",
        video_url: values.video_url,
      };

      const result = await dispatch(handleEditExamVideo({ body })).unwrap();
      console.log(result)
      if (result?.data?.status === "success") {
        toast.success("تم تعديل الفيديو بنجاح");
        dispatch(handleGetAllExamData({body : {id:exam_id}}))
        dispatch(handleGetAllRoundContent({body  : {
          round_id : id
        }}))
        form.resetFields();
        setOpen(false);
        setRowData({});
      } else {
        toast.error("فشل في تعديل الفيديو");
      }
    } catch (error) {
      console.error('Error editing exam video:', error);
      toast.error("حدث خطأ أثناء تعديل الفيديو");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setOpen(false);
    setRowData({});
  };

  return (
    <Modal
      title="تعديل فيديو الاختبار"
      open={open}
      onCancel={handleCancel}
      footer={null}
      centered
      width={600}
      dir="rtl"
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="mt-6"
      >
        <Form.Item
          name="title"
          label="عنوان الفيديو"
          rules={[
            { required: true, message: 'يرجى إدخال عنوان الفيديو' },
            { min: 3, message: 'العنوان يجب أن يكون على الأقل 3 أحرف' }
          ]}
        >
          <Input 
            placeholder="أدخل عنوان الفيديو" 
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="description"
          label="وصف الفيديو (اختياري)"
        >
          <Input.TextArea
            placeholder="أدخل وصف للفيديو"
            rows={3}
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="video_url"
          label="رابط الفيديو"
          rules={[
            { required: true, message: 'يرجى إدخال رابط الفيديو' },
            { type: 'url', message: 'يرجى إدخال رابط صحيح' }
          ]}
        >
          <Input 
            placeholder="https://example.com/video.mp4"
            size="large"
          />
        </Form.Item>

        <div className="flex gap-3 justify-end mt-8">
          <Button
            size="large"
            onClick={handleCancel}
            disabled={loading}
          >
            إلغاء
          </Button>
          
          <Button
            type="primary"
            size="large"
            htmlType="submit"
            loading={loading || edit_exam_video_loading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            حفظ التعديلات
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default EditExamVideoModal;