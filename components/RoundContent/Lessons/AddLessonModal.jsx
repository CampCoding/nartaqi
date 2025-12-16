"use client";
import { Button, DatePicker, Modal } from "antd";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PlusOutlined } from "@ant-design/icons";
import {
  handleAddRoundLessons,
  handleGetAllRoundLessons,
} from "../../../lib/features/lessonSlice";
import { toast } from "react-toastify";
import { handleGetAllRoundContent } from "../../../lib/features/roundContentSlice";

export default function AddLessonModal({
  open,
  setOpen,
  round_content_id,
  type,
  id,
}) {
  const [lessonData, setLessonData] = useState({
    title: "",
    description: "",
  });
  const dispatch = useDispatch();
  const [date, setDate] = useState(null); // dayjs | null
  const [dateStr, setDateStr] = useState(""); // string
  const { add_lesson_loading } = useSelector((state) => state?.lesson);

  const isFormValid = Boolean(lessonData?.title && lessonData?.description && dateStr);

  function handleInputChange(e) {
    const { name, value } = e.target;
    setLessonData((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit() {
    if (!isFormValid || add_lesson_loading) return;

    const data_send = {
      ...lessonData,
      round_content_id,
      show_date: dateStr,
      type: type,
    };
    console.log(data_send);

    dispatch(handleAddRoundLessons({ body: data_send }))
      .unwrap()
      .then((res) => {
        if (res?.data?.status === "success") {
          toast.success("تم اضافة الدرس بنجاح");
          dispatch(handleGetAllRoundContent({
            body: {
              round_id: id,
            },
          }))
          dispatch(
            handleGetAllRoundLessons({
              body: {
                round_content_id, // parent round id
              },
            })
          );
          setOpen(false);
        } else {
          console.log(res);
          toast.error(res?.error?.response?.data?.message || "هناك خطأ أثناء اضافة الدرس");
        }
      })
      .catch((err) => {
        console.error("Failed to add round lesson:", err);
        toast.error("حدث خطأ غير متوقع أثناء اضافة الدرس");
      });
  }

  const modalFooter = (
    <div className="flex justify-start space-x-2 space-x-reverse pt-4">
      <Button
        key="submit"
        type="primary"
        onClick={handleSubmit}
        disabled={!isFormValid || add_lesson_loading}
        loading={add_lesson_loading}
        className="bg-orange-500 hover:!bg-orange-600 border-none rounded-md px-6"
        icon={<PlusOutlined />}
      >
        حفظ الدرس
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
      title="إضافة درس"
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
              عنوان الدرس
            </label>

          </div>
          <input
            id="title"
            name="title"
            value={lessonData?.title || ""}
            onChange={handleInputChange}
            className="border border-gray-400 focus:outline-none rounded-md p-2 focus:ring-1 focus:ring-orange-400"
            placeholder="مثل: أساسيات برمجة React"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="date"
            className="text-lg font-medium text-gray-700"
          >جدولة الدرس</label>
          <DatePicker
            onChange={(value, stringValue) => {
              setDate(value); // value ده dayjs أو null
              setDateStr(stringValue); // string formatted
              console.log("dayjs:", value);
              console.log("string:", stringValue);
              console.log("ISO:", value ? value.toISOString() : null);
            }}
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
            value={lessonData?.description || ""}
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
