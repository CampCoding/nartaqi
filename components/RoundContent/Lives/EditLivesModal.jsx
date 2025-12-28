"use client";
import { Button, DatePicker, Modal } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PlusOutlined } from "@ant-design/icons";
import { handleEditLive, handleGetAllLives } from "../../../lib/features/livesSlice";
import { toast } from "react-toastify";
import { handleGetAllRoundContent } from "../../../lib/features/roundContentSlice";
import { handleGetAllRoundLessons } from "../../../lib/features/lessonSlice";
import dayjs from "dayjs";

export default function EditLivesModal({
  open,
  setOpen,
  round_content_id,
  lesson_id,
  id,
  rowData,
  setRowData,
  selectedLesson,
  isSource
}) {
  const dispatch = useDispatch();
  const [date, setDate] = useState(null);
  const [dateStr, setDateStr] = useState("");
  const { edit_live_loading } = useSelector((state) => state?.lives);

  const isFormValid = isSource 
    ? Boolean(rowData?.title) 
    : Boolean(rowData?.title && dateStr );

  useEffect(() => {
    if (rowData && open) {
      setDateStr(rowData?.date || "");
      // تأكد من تهيئة active بشكل صحيح
      if (!rowData?.active && rowData?.active !== "0") {
        setRowData(prev => ({ ...prev, active: 0 }));
      }
    }
  }, [rowData, open]);

  function handleInputChange(e) {
    const { name, value } = e.target;
    setRowData((prev) => ({ ...prev, [name]: value }));
  }

  // دالة خاصة لمعالجة تغيير active
  function handleActiveChange(e) {
    setRowData((prev) => ({ 
      ...prev, 
      active: e.target.checked ? 1 : 0 
    }));
  }

  function handleSubmit() {
    if (!isFormValid || edit_live_loading) return;
    
    const data_send = isSource 
      ? {
          id: rowData?.id,
          lesson_id: rowData?.lesson_id,
          title: rowData?.title
        }
      : {
          ...rowData,
          id: rowData?.id,
          lesson_id: rowData?.lesson_id,
          title: rowData?.title,
          date: dateStr,
        };

    // للتأكد: تحقق من قيمة active قبل الإرسال
    console.log("Sending data:", data_send);

    dispatch(handleEditLive({ body: data_send }))
      .unwrap()
      .then((res) => {
        if (res?.data?.status === "success") {
          toast.success("تم تعديل البث بنجاح");
          dispatch(handleGetAllLives({
            body: { lesson_id: selectedLesson }
          }));
          dispatch(handleGetAllRoundContent({
            body: { round_id: id },
          }));
          dispatch(handleGetAllRoundLessons({
            body: { round_content_id },
          }));
          setOpen(false);
        } else {
          toast.error(res?.error?.response?.data?.message || "هناك خطأ أثناء تعديل البث");
        }
      })
      .catch((err) => {
        console.error("Failed to edit live session:", err);
        toast.error("حدث خطأ غير متوقع أثناء تعديل البث");
      });
  }

  const modalFooter = (
    <div className="flex justify-start space-x-2 space-x-reverse pt-4">
      <Button
        key="submit"
        type="primary"
        onClick={handleSubmit}
        disabled={edit_live_loading}
        loading={edit_live_loading}
        className="bg-orange-500 hover:!bg-orange-600 border-none rounded-md px-6"
        icon={<PlusOutlined />}
      >
        حفظ التعديلات
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
      title="تعديل البث المباشر"
      wrapClassName="rtl-modal-wrap"
      style={{ direction: "rtl" }}
    >
      <div className="flex flex-col gap-4 mt-4">
        {/* Title Input */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor="title"
              className="text-lg font-medium text-gray-700"
            >
              عنوان البث
            </label>
          </div>
          <input
            id="title"
            name="title"
            value={rowData?.title || ""}
            onChange={handleInputChange}
            className="border border-gray-400 focus:outline-none rounded-md p-2 focus:ring-1 focus:ring-orange-400"
          />
        </div>
        
        {!isSource && (
          <div className="flex flex-col gap-2">
            {/* Link Input */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="link"
                className="text-lg font-medium text-gray-700"
              >
                رابط البث المباشر (رابط مباشر)
              </label>
              <input
                id="link"
                name="link"
                value={rowData?.link || ""}
                onChange={handleInputChange}
                className="border border-gray-400 focus:outline-none rounded-md p-2 focus:ring-1 focus:ring-orange-400"
                placeholder="رابط البث (مثل: https://example.com)"
              />
            </div>

            {/* Date Input */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="date"
                className="text-lg font-medium text-gray-700"
              >
                تاريخ البث
              </label>
              <DatePicker
                value={dateStr ? dayjs(dateStr) : null}
                onChange={(value, stringValue) => {
                  setDate(value);
                  setDateStr(stringValue);
                }}
                className="border border-gray-400 rounded-md p-2 focus:ring-1 focus:ring-orange-400"
              />
            </div>

            {/* Time Input */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="time"
                className="text-lg font-medium text-gray-700"
              >
                وقت البث
              </label>
              <input
                id="time"
                name="time"
                value={rowData?.time || ""}
                onChange={handleInputChange}
                className="border border-gray-400 focus:outline-none rounded-md p-2 focus:ring-1 focus:ring-orange-400"
                placeholder="وقت البث (مثل: 18:00)"
              />
            </div>

            {/* Active Toggle - تم التصحيح */}
            {/* <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={rowData?.active === "1"}
                onChange={handleActiveChange}
                className="form-checkbox h-5 w-5 text-orange-500"
              />
              <label className="text-gray-700 text-sm">تنشيط البث</label>
            </div> */}
          </div>
        )}
      </div>
    </Modal>
  );
}