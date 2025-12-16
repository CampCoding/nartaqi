"use client";
import { Modal, Button, Typography } from 'antd';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import { handleDeleteLessonVideo, handleGetAllLessonVideo } from '../../../lib/features/videoSlice';
import { handleGetAllRoundContent } from '../../../lib/features/roundContentSlice';

const { Text } = Typography;

export default function DeleteVideoModal({ open, round_id,setOpen, rowData, id }) {
  const dispatch = useDispatch();
  // Ensure the state path and variable name are correct (e.g., state?.content?.delete_content_loading)
  const { delete_video_loading } = useSelector(state => state?.videos);

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

    dispatch(handleDeleteLessonVideo({ body: data_send }))
      .unwrap()
      .then(res => {
        if (res?.data?.status == "success") {
          toast.success("تم حذف الفيديو بنجاح");
          dispatch(handleGetAllLessonVideo({
            body: {
              round_content_id: rowData?.round_content_id
            }
          }))
          dispatch(
            handleGetAllRoundContent({
              body: {
                round_id, // parent round id
              },
            })
          );
        }
        setOpen(false);
      })
      .catch(err => {
        console.error("Failed to delete video:", err);
      });
  }

  // Determine the title of the item being deleted for clarity
  const contentTitle = rowData?.title || 'هذا الفيديو';

  // Custom footer for better control over button design and loading state
  const modalFooter = (
    <div className='flex justify-start space-x-2 space-x-reverse pt-4'>
      <Button
        key="submit"
        type="primary"
        danger // Ant Design style for destructive action
        onClick={handleDelete}
        loading={delete_video_loading}
        className='rounded-md px-6'
        icon={<DeleteOutlined />}
      >
        حذف نهائي
      </Button>
      <Button
        key="back"
        onClick={() => setOpen(false)}
        disabled={delete_video_loading}
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
          هل أنت متأكد من حذف محتوى الدورة: <Text mark>{contentTitle}</Text>؟
        </Text>
        <Text type="danger" style={{ fontSize: '0.95rem' }}>
          **تحذير:** لا يمكن التراجع عن هذا الإجراء. سيتم فقدان جميع الدروس والفيديوهات المتعلقة بهذا المحتوى.
        </Text>
      </div>
    </Modal>
  );
}