"use client";
import { Button, Modal } from 'antd'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { PlusOutlined } from "@ant-design/icons";
import { handleAddRoundLessons, handleEditRoundLessons, handleGetAllRoundLessons } from '../../../lib/features/lessonSlice';
import { toast } from 'react-toastify';

export default function EditLessonModal({open , setOpen ,rowData , setRowData , round_content_id}) {

  const dispatch = useDispatch();
  const {edit_lesson_loading} = useSelector(state => state?.lesson)

    const isFormValid = Boolean(rowData?.title && rowData?.description);


  function handleInputChange(e) {
    const {name , value} = e.target;
    setRowData(prev =>({...prev , [name] : value}))
  }

   function handleSubmit() {
      if (!isFormValid || edit_lesson_loading) return;
  
      const data_send = {
        id : rowData?.id,
        ...rowData
      };
  
      dispatch(handleEditRoundLessons({ body: data_send }))
        .unwrap()
        .then((res) => {
          if (res?.data?.status === "success") {
            toast.success("تم تعديل الدرس بنجاح");
            dispatch(
              handleGetAllRoundLessons({
                body: {
                  round_content_id : rowData?.round_content_id , // parent round id
                },
              })
            );
            setOpen(false);
          } else {
            toast.error(res?.data?.message || "هناك خطأ أثناء تعديل الدرس");
          }
        })
        .catch((err) => {
          console.error("Failed to Edit round lesson:", err);
          toast.error("حدث خطأ غير متوقع أثناء تعديل الدرس");
        });
    }

   const modalFooter = (
    <div className="flex justify-start space-x-2 space-x-reverse pt-4">
      <Button
        key="submit"
        type="primary"
        onClick={handleSubmit}
        disabled={!isFormValid || edit_lesson_loading}
        loading={edit_lesson_loading}
        className="bg-orange-500 hover:!bg-orange-600 border-none rounded-md px-6"
        icon={<PlusOutlined />}
      >
        تعديل الدرس
      </Button>
      <Button
        key="back"
        onClick={() => setOpen(false)}
        className="rounded-md px-6"
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
          title="تعديل درس"
          wrapClassName="rtl-modal-wrap"
          style={{ direction: "rtl" }}
        >
          <div className="flex flex-col gap-4 mt-4">
            {/* Title Input */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="title"
                className="text-lg font-medium text-gray-700"
              >
                عنوان الدرس
              </label>
              <input
                id="title"
                name="title"
                value={rowData?.title || ""}
                onChange={handleInputChange}
                className="border border-gray-400 focus:outline-none rounded-md p-2 focus:ring-1 focus:ring-orange-400"
                placeholder="مثل: أساسيات برمجة React"
              />
            </div>
    
            {/* Description Input */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="description"
                className="text-lg font-medium text-gray-700"
              >
                وصف الدرس
              </label>
              <textarea
                id="description"
                name="description"
                value={rowData?.description || ""}
                onChange={handleInputChange}
                rows={3}
                className="border border-gray-400 focus:outline-none rounded-md p-2 focus:ring-1 focus:ring-orange-400 resize-none"
                placeholder="شرح موجز لأهداف هذا المحتوى وما سيتم تغطيته"
              />
            </div>
          </div>
        </Modal>
  )
}
