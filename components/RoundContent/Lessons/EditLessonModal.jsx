"use client";
import { Button, DatePicker, Modal } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PlusOutlined } from "@ant-design/icons";
import {
  handleAddRoundLessons,
  handleEditRoundLessons,
  handleGetAllRoundLessons,
} from "../../../lib/features/lessonSlice";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { handleGetAllRoundContent } from "../../../lib/features/roundContentSlice";

export default function EditLessonModal({
  open,
  setOpen,
  rowData,
  setRowData,
  round_content_id,
  round_id,
  isSource
}) {
  const dispatch = useDispatch();
  const { edit_lesson_loading } = useSelector((state) => state?.lesson);

  const isFormValid = isSource ? Boolean(rowData?.lesson_title) : Boolean(rowData?.title && dateStr);
  const [date, setDate] = useState(null); // dayjs | null
  const [dateStr, setDateStr] = useState("");

  useEffect(() => {
    if (rowData) {
      setDate(dayjs(rowData?.lesson_show_date)); // Setting the date from rowData
      setDateStr(dayjs(rowData?.lesson_show_date)?.format("YYYY-MM-DD")); // Format date for DatePicker input
    }
  }, [rowData]);

  function handleInputChange(e) {
    const { name, value } = e.target;
    setRowData((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit() {
    if (!isFormValid || edit_lesson_loading) return;

    const data_send = {
      id: rowData?.id,
      title:  rowData?.lesson_title,
      description : rowData?.lesson_description || "",
      show_date :dateStr
    };

    dispatch(handleEditRoundLessons({ body: data_send }))
      .unwrap()
      .then((res) => {
        if (res?.data?.status === "success") {
          toast.success("تم تعديل الدرس بنجاح");
          dispatch(
            handleGetAllRoundLessons({
              body: {
                round_content_id: rowData?.round_content_id, // parent round id
              },
            })
          );
           dispatch(
            handleGetAllRoundContent({
               body: {
                round_id: round_id, // parent round id
              },
            })
          );
          setOpen(false);
        } else {
          toast.error(res?.error?.response?.data?.message || "هناك خطأ أثناء تعديل الدرس");
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
        disabled={edit_lesson_loading}
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
          <label htmlFor="lesson_title" className="text-lg font-medium text-gray-700">
            عنوان الدرس
          </label>
          <input
            id="lesson_title"
            name="lesson_title"
            value={rowData?.lesson_title || ""}
            onChange={handleInputChange}
            className="border border-gray-400 focus:outline-none rounded-md p-2 focus:ring-1 focus:ring-orange-400"
            placeholder="مثل: أساسيات برمجة React"
          />
        </div>

        {/* Date Input - Setting value from the state */}
        <div className="flex flex-col gap-2">
          <label htmlFor="lesson_show_date" className="text-lg font-medium text-gray-700">
         (تحديد تاريخ ظهور الدرس)   جدولة الدرس 
          </label>
          <DatePicker
            value={date} // Directly pass the dayjs date value here
            onChange={(value, stringValue) => {
              setDate(value); // set dayjs object
              setDateStr(stringValue); // set the date string
            }}
            format="YYYY-MM-DD"
            className="w-full"
          />
        </div>

        {/* Description Input */}
        <div className="flex flex-col gap-2">
          <label htmlFor="lesson_description" className="text-lg font-medium text-gray-700">
            وصف الدرس
          </label>
          <textarea
            id="lesson_description"
            name="lesson_description"
            value={rowData?.lesson_description || ""}
            onChange={handleInputChange}
            rows={3}
            className="border border-gray-400 focus:outline-none rounded-md p-2 focus:ring-1 focus:ring-orange-400 resize-none"
            placeholder="شرح موجز لأهداف هذا المحتوى وما سيتم تغطيته"
          />
        </div>
      </div>
    </Modal>
  );
}
