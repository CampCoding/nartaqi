"use client";
import { Modal, Button, Typography } from 'antd';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import { handleDeleteRoundLessons, handleGetAllRoundLessons } from '../../../lib/features/lessonSlice';


const { Text } = Typography;

export default function DeleteLessonModal({ open, setOpen, rowData , id }) {
  const dispatch = useDispatch();
  const { delete_lesson_loading } = useSelector(state => state?.lesson);

  function handleDelete() {
    // Check if rowData is valid before dispatching
    if (!rowData || !rowData.id) {
      console.error("rowData or rowData.id is missing.");
      setOpen(false); // Close modal if data is invalid
      return;
    }

    const data_send = {
      id: rowData?.id
    };

    dispatch(handleDeleteRoundLessons({ body: data_send }))
      .unwrap()
      .then(res => {
        if(res?.data?.status == "success") {
          toast.success("تم حذف الدرس بنجاح");
          dispatch(handleGetAllRoundLessons({body : {
            round_content_id : id
          }}))
        }
        setOpen(false);
      })
      .catch(err => {
        console.error("Failed to delete lesson:", err);
      });
  }

  useEffect(() => {
    console.log(rowData);
  } , [rowData])

  // Determine the title of the item being deleted for clarity
  const contentTitle = rowData?.title || 'هذا الدرس';

  // Custom footer for better control over button design and loading state
  const modalFooter = (
    <div className='flex justify-start space-x-2 space-x-reverse pt-4'>
      <Button
        key="submit"
        type="primary"
        danger // Ant Design style for destructive action
        onClick={handleDelete}
        loading={delete_lesson_loading}
        className='rounded-md px-6'
        icon={<DeleteOutlined />}
      >
        حذف نهائي
      </Button>
      <Button
        key="back"
        onClick={() => setOpen(false)}
        disabled={delete_lesson_loading}
        className='rounded-md px-6'
      >
        إلغاء
      </Button>
    </div>
  );

  return (
    <Modal
      open={open}
      onCancel={() => setOpen(false)}
      footer={modalFooter}
      title={
        <span style={{ color: '#faad14' }}>
          <ExclamationCircleOutlined style={{ marginLeft: 8 }} /> تأكيد الحذف
        </span>
      }
      // Set modal direction to RTL for proper Arabic display
      wrapClassName="rtl-modal-wrap"
      style={{ direction: 'rtl' }}
    >
      <div className='flex flex-col gap-4 mt-4 text-right'>
        <Text strong style={{ fontSize: '1.1rem' }} className='text-gray-800'>
          هل أنت متأكد من حذف الدرس : <Text mark>{contentTitle}</Text>؟
        </Text>
        <Text type="danger" style={{ fontSize: '0.95rem' }}>
          **تحذير:** لا يمكن التراجع عن هذا الإجراء. سيتم فقدان جميع الدروس والفيديوهات المتعلقة بهذا المحتوى.
        </Text>
      </div>
    </Modal>
  );
}