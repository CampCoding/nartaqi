"use client";
import { Modal, Button, Spin } from 'antd' // Import Button and Spin from Ant Design
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux' 
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons'; // Import icons
import { handleAddRoundContent, handleGetAllRoundContent } from '../../lib/features/roundContentSlice';
import { toast } from 'react-toastify';



export default function AddRoundContent({ open, setOpen, id }) {
  const [roundContentData, setRoundContentData] = useState({
    title: "",
    description: "",
  });
  
  const dispatch = useDispatch(); 
  const { store_content_loading } = useSelector(state => state?.content || { store_content_loading: false });
  
  const isFormValid = roundContentData.title && roundContentData.description;

  function handleInputChange(e) {
    const { name, value } = e.target;
    setRoundContentData(prev => ({
      ...prev,
      [name]: value
    }));
  }

  function handleSubmit() {
    if (!isFormValid) return;

    const data_send = {
      ...roundContentData,
      type: "basic",
      round_id: id // Ensure 'id' is correctly passed as the parent round ID
    };

    dispatch(handleAddRoundContent({ body: data_send }))
      .unwrap()
      .then(res => {
        if(res?.data?.status == "success") {
          toast.success("تم اضافه المحتوي بنجاح");
          dispatch(handleGetAllRoundContent({body : {
            round_id : id
          }}))
           setOpen(false);
        setRoundContentData({ title: "", description: "" });
        }else {
          toast.error(res?.data?.message || "هناك خطأ أثناء اضافه المحتوي")
        }
      })
      .catch(err => {
        console.error("Failed to add round content:", err);
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
        disabled={!isFormValid || store_content_loading}
        loading={store_content_loading}
        className='bg-orange-500 hover:!bg-orange-600 border-none rounded-md px-6'
        icon={<PlusOutlined />}
      >
        إضافة المحتوى
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
      title="إضافة محتوي الدورة"
      wrapClassName="rtl-modal-wrap"
      style={{ direction: 'rtl' }}
    >
      <div className='flex flex-col gap-4 mt-4'>
        
        {/* Title Input */}
        <div className='flex flex-col gap-2'>
          <label htmlFor='title' className='text-lg font-medium text-gray-700'>
            عنوان المحتوى
          </label>
          <input 
            id='title'
            name='title'
            value={roundContentData.title}
            onChange={handleInputChange}
            className='border border-gray-400 focus:outline-none rounded-md p-2 focus:ring-1 focus:ring-orange-400'
            placeholder='مثل: أساسيات برمجة React'
          />
        </div>

        {/* Description Input (using textarea for multi-line description) */}
        <div className='flex flex-col gap-2'>
          <label htmlFor='description' className='text-lg font-medium text-gray-700'>
            وصف المحتوى
          </label>
          <textarea 
            id='description'
            name='description'
            value={roundContentData.description}
            onChange={handleInputChange}
            rows={3} // Allows for a better description entry experience
            className='border border-gray-400 focus:outline-none rounded-md p-2 focus:ring-1 focus:ring-orange-400 resize-none'
            placeholder='شرح موجز لأهداف هذا المحتوى وما سيتم تغطيته'
          />
        </div>
        
      </div>
    </Modal>
  );
}