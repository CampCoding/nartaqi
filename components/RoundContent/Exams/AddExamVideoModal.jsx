import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { handleGetAllRoundContent } from '../../../lib/features/roundContentSlice';
import { handleAddExamVideo, handleGetAllExamData } from '../../../lib/features/examSlice';

const AddExamVideoModal = ({ open, id, setOpen, exam_id , lesson_id }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const { add_exam_video_loading } = useSelector((state) => state?.exam);

   
  useEffect(() => {
    console.log(open, "exam_id" , exam_id , "lesson_id" , lesson_id);
  } ,[exam_id , open , lesson_id])

  const handleSubmit = async (values) => {
    try {
      setLoading(true);

      const body = {
        title: values.title,
        description: values.description || "",
        video_url: values.video_url,
        lesson_id : exam_id?.id || lesson_id || "",
      };

      const result = await dispatch(handleAddExamVideo({ body })).unwrap();

      if (result?.data?.status === "success") {
        toast.success("تم إضافة الفيديو بنجاح");
       dispatch(handleGetAllRoundContent({
          body: {
            round_id: id
          }
        }))
        dispatch(handleGetAllExamData({body : {
          id:  exam_id
        }}))
        form.resetFields();
        setOpen(false);
      } else {
        toast.error("فشل في إضافة الفيديو");
      }
    } catch (error) {
      console.error('Error adding exam video:', error);
      toast.error("حدث خطأ أثناء إضافة الفيديو");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setOpen(false);
  };

  return (
    <Modal
      title="إضافة فيديو للاختبار"
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
            loading={loading || add_exam_video_loading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            إضافة الفيديو
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default AddExamVideoModal;