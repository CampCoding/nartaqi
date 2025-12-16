"use client";
import { Modal, Button, Typography } from 'antd';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DeleteOutlined, ExclamationCircleOutlined, EyeOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import { handleGetAllRoundLessons } from '../../../lib/features/lessonSlice';
import { handleActiveLive, handleDeleteLive, handleGetAllLives, handleMarkLiveAsFinish } from '../../../lib/features/livesSlice';
import { handleGetAllRoundContent } from '../../../lib/features/roundContentSlice';


const { Text } = Typography;

export default function FinishLiveModal({ open, setOpen, rowData, id, round_id, selectedLesson }) {
  const dispatch = useDispatch();
  const { mark_live_finish_loading } = useSelector(state => state?.lives);

  const handleMarkAsFinished = () => {
    const body = { id: rowData?.id };
    dispatch(handleMarkLiveAsFinish({ body }))
      .unwrap()
      .then(res => {
        if (res?.data?.status == "success") {
          toast.success(res?.data?.message);
          dispatch(handleGetAllRoundContent({
            body: {
              round_id: id
            }
          }))
          setOpen(false)
        } else {
          toast.error(res?.error?.response?.data?.message || "هناك مشكله اُثناء تعديل حالة البث")
        }
      })
  };

  useEffect(() => {
    console.log(rowData);
  }, [rowData])

  // Determine the title of the item being deleted for clarity
  const contentTitle = rowData?.title || 'هذا البث';

  // Custom footer for better control over button design and loading state
  const modalFooter = (
    <div className='flex justify-start space-x-2 space-x-reverse pt-4'>
      <Button
        key="submit"
        type="primary"
        danger // Ant Design style for destructive action
        onClick={handleMarkAsFinished}
        loading={mark_live_finish_loading}
        className='rounded-md px-6'
        icon={<EyeOutlined />}
      >
        أيقاف البث
      </Button>
      <Button
        key="back"
        onClick={() => setOpen(false)}
        disabled={mark_live_finish_loading}
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
          <ExclamationCircleOutlined style={{ marginLeft: 8 }} /> تأكيد
        </span>
      }
      // Set modal direction to RTL for proper Arabic display
      wrapClassName="rtl-modal-wrap"
      style={{ direction: 'rtl' }}
    >
      <div className='flex flex-col gap-4 mt-4 text-right'>
        <Text strong style={{ fontSize: '1.1rem' }} className='text-gray-800'>
          هل أنت متأكد من  إيقاف هذا البث المباشر : <Text mark>{contentTitle}</Text>؟
        </Text>

      </div>
    </Modal>
  );
}