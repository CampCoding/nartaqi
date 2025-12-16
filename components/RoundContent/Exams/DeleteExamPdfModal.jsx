import React, { useState } from 'react';
import { Modal, Button } from 'antd';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { ExclamationCircleOutlined, FilePdfOutlined } from '@ant-design/icons';
import { handleDeleteExamPdf, handleGetAllExamData } from '../../../lib/features/examSlice';
import { handleGetAllRoundContent } from '../../../lib/features/roundContentSlice';

const DeleteExamPdfModal = ({ open, setOpen, rowData, setRowData ,id }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);
      
      const body = {
        id: rowData?.id 
      };

      const result = await dispatch(handleDeleteExamPdf({ body })).unwrap();
      
      if (result?.data?.status === "success") {
        toast.success("تم حذف الملف بنجاح");
        dispatch(handleGetAllExamData({body : {
          id ,
        }}))
        dispatch(handleGetAllRoundContent({body: {
          round_id : id
        }}))
        setOpen(false);
        setRowData({});
      } else {
        toast.error(res?.error?.response?.data?.message || "فشل في حذف الملف");
      }
    } catch (error) {
      console.error('Error deleting exam PDF:', error);
      toast.error("حدث خطأ أثناء حذف الملف");
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
      title="حذف ملف PDF"
      open={open}
      onCancel={handleCancel}
      footer={null}
      centered
      width={500}
      dir="rtl"
    >
      <div className="text-center py-6">
        <FilePdfOutlined className="text-red-500 text-5xl mb-4" />
        
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          هل أنت متأكد من حذف هذا الملف؟
        </h3>
        
        <p className="text-gray-600 mb-1">
          <span className="font-medium">الملف:</span> {rowData?.title}
        </p>
        
        {rowData?.description && (
          <p className="text-gray-600 mb-1">
            <span className="font-medium">الوصف:</span> {rowData?.description}
          </p>
        )}
        
        <p className="text-gray-600 mb-6">
          سيتم حذف الملف بشكل دائم ولا يمكن استرجاعه.
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
            حذف الملف
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteExamPdfModal;