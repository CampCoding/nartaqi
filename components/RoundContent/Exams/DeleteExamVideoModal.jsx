import React, { useState } from 'react';
import { Modal, Button, message } from 'antd';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { handleGetAllRoundContent } from '../../../lib/features/roundContentSlice';
import { handleDeleteExamVideo, handleGetAllExamData } from '../../../lib/features/examSlice';

const DeleteExamVideoModal = ({ open, setOpen, rowData, setRowData , id}) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);
      
      const body = {
        id: rowData.id
      };

      const result = await dispatch(handleDeleteExamVideo({ body })).unwrap();
      
      if (result?.data?.status === "success") {
        toast.success( "تم حذف الفيديو بنجاح");
        dispatch(handleGetAllExamData({body :  {id}}))
        dispatch(handleGetAllRoundContent({body : {
          round_id:  id
        }}))
        setOpen(false);
        setRowData({});
      } else {
        toast.error("فشل في حذف الفيديو");
      }
    } catch (error) {
      console.error('Error deleting exam video:', error);
      toast.error("حدث خطأ أثناء حذف الفيديو");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setOpen(false);
    setRowData({});
  };

  return (
    <Modal
      title="حذف فيديو الاختبار"
      open={open}
      onCancel={handleCancel}
      footer={null}
      centered
      width={500}
      dir="rtl"
    >
      <div className="text-center py-6">
        <ExclamationCircleOutlined className="text-red-500 text-5xl mb-4" />
        
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          هل أنت متأكد من حذف هذا الفيديو؟
        </h3>
        
        <p className="text-gray-600 mb-1">
          <span className="font-medium">العنوان:</span> {rowData?.title}
        </p>
        
        <p className="text-gray-600 mb-6">
          سيتم حذف الفيديو بشكل دائم ولا يمكن استرجاعه.
        </p>

        <div className="flex gap-3 justify-center">
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
            onClick={handleDelete}
            loading={loading}
            danger
          >
            حذف الفيديو
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteExamVideoModal;