"use client";
import { Modal, Button, Spin } from 'antd' // Import Button and Spin from Ant Design
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux' 
import { PlusOutlined } from '@ant-design/icons'; // Import icons
import { toast } from 'react-toastify';
import { handleAddLessonVideo, handleGetAllLessonVideo } from '../../../lib/features/videoSlice';



export default function AddVideoModal({ open, setOpen, id }) {
  const [videoData , setVideoData] = useState({
    title:"",
    description:"",
    video:null,
    time:"",
  })
  
  const dispatch = useDispatch(); 
  const { add_video_loading } = useSelector(state => state?.videos || { store_content_loading: false });
  
  const isFormValid = videoData.title && videoData.description;

  function handleInputChange(e) {
    const { name, value } = e.target;
    setVideoData(prev => ({
      ...prev,
      [name]: value
    }));
  }

  function handleSubmit() {
    if (!isFormValid) return;

    const data_send = {
      ...videoData,
      round_content_id: id // Ensure 'id' is correctly passed as the parent round ID
    };

    dispatch(handleAddLessonVideo({ body: data_send }))
      .unwrap()
      .then(res => {
        if(res?.data?.status == "success") {
          toast.success("تم اضافه الفيديو بنجاح");
          dispatch(handleGetAllLessonVideo({body : {
            round_content_id : id
          }}))
           setOpen(false);
        setVideoData({time :"",title:"",description:"",video:""});
        }else {
          toast.error(res?.data?.message || "هناك خطأ أثناء اضافه الفيديو")
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
        disabled={!isFormValid || add_video_loading}
        loading={add_video_loading}
        className='bg-orange-500 hover:!bg-orange-600 border-none rounded-md px-6'
        icon={<PlusOutlined />}
      >
        إضافة الفيديو
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
      title="إضافة الفيديو "
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
            value={videoData?.title}
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
            value={videoData?.description}
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
            value={videoData?.video}
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
            value={videoData?.time}
            onChange={handleInputChange}
            className='border border-gray-400 focus:outline-none rounded-md p-2 focus:ring-1 focus:ring-orange-400'
          />
        </div>
      </div>
    </Modal>
  );
}