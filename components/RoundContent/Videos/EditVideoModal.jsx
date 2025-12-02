"use client";
import { Modal, Button, Spin } from 'antd' // Import Button and Spin from Ant Design
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux' 
import { PlusOutlined } from '@ant-design/icons'; // Import icons
import { toast } from 'react-toastify';
import { handleAddLessonVideo, handleEditLessonVideo, handleGetAllLessonVideo } from '../../../lib/features/videoSlice';



export default function EditVideoModal({ open, setOpen, id , rowData , setRowData }) {

  
  const dispatch = useDispatch(); 
  const { edit_video_laoding } = useSelector(state => state?.videos || { store_content_loading: false });
  
  const isFormValid = rowData.title && rowData.description;

  function handleInputChange(e) {
    const { name, value } = e.target;
    setRowData(prev => ({
      ...prev,
      [name]: value
    }));
  }

  function handleSubmit() {
    if (!isFormValid) return;

    const data_send = {
      ...rowData,
      id: rowData?.id // Ensure 'id' is correctly passed as the parent round ID
    };

    dispatch(handleEditLessonVideo({ body: data_send }))
      .unwrap()
      .then(res => {
        if(res?.data?.status == "success") {
          toast.success("تم تعديل الفيديو بنجاح");
          dispatch(handleGetAllLessonVideo({body : {
            round_content_id : rowData?.round_content_id
          }}))
           setOpen(false);
        setRowData({time :"",title:"",description:"",video:""});
        }else {
          toast.error(res?.data?.message || "هناك خطأ أثناء تعديل الفيديو")
        }
      })
      .catch(err => {
        console.error("Failed to add video:", err);
      })
      .finally(() => setOpen(false))
  }
  
  // Custom footer for better control over button design and loading state
  const modalFooter = (
    <div className='flex justify-start space-x-2 space-x-reverse pt-4'>
      <Button 
        key="submit" 
        type="primary" 
        onClick={handleSubmit} 
        disabled={!isFormValid || edit_video_laoding}
        loading={edit_video_laoding}
        className='bg-orange-500 hover:!bg-orange-600 border-none rounded-md px-6'
        icon={<PlusOutlined />}
      >
        تعديل الفيديو
      </Button>
      <Button 
        key="back" 
        onClick={() => setOpen(false)}
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
      title="تعديل الفيديو "
      wrapClassName="rtl-modal-wrap"
      style={{ direction: 'rtl' }}
    >
      <div className='flex flex-col gap-4 mt-4'>
        
        {/* Title Input */}
        <div className='flex flex-col gap-2'>
          <label htmlFor='title' className='text-lg font-medium text-gray-700'>
            عنوان الفيديو
          </label>
          <input 
            id='title'
            name='title'
            value={rowData?.title}
            onChange={handleInputChange}
            className='border border-gray-400 focus:outline-none rounded-md p-2 focus:ring-1 focus:ring-orange-400'
            placeholder='مثل: أساسيات برمجة React'
          />
        </div>

        {/* Description Input (using textarea for multi-line description) */}
        <div className='flex flex-col gap-2'>
          <label htmlFor='description' className='text-lg font-medium text-gray-700'>
            وصف الفيديو
          </label>
          <textarea 
            id='description'
            name='description'
            value={rowData?.description}
            onChange={handleInputChange}
            rows={3} // Allows for a better description entry experience
            className='border border-gray-400 focus:outline-none rounded-md p-2 focus:ring-1 focus:ring-orange-400 resize-none'
            placeholder='شرح موجز لأهداف هذا المحتوى وما سيتم تغطيته'
          />
        </div>
         
          <div className='flex flex-col gap-2'>
          <label htmlFor='video' className='text-lg font-medium text-gray-700'>
            لينك الفيديو
          </label>
          <input 
            id='video'
            name='video'
            value={rowData?.video}
            onChange={handleInputChange}
            className='border border-gray-400 focus:outline-none rounded-md p-2 focus:ring-1 focus:ring-orange-400'
          />
        </div>

         <div className='flex flex-col gap-2'>
          <label htmlFor='time' className='text-lg font-medium text-gray-700'>
            مدة الفيديو
          </label>
          <input 
            id='time'
            type='time'
            name='time'
            value={rowData?.time}
            onChange={handleInputChange}
            className='border border-gray-400 focus:outline-none rounded-md p-2 focus:ring-1 focus:ring-orange-400'
          />
        </div>
      </div>
    </Modal>
  );
}