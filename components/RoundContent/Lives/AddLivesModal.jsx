"use client";
import { Button, DatePicker, Modal } from "antd";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PlusOutlined } from "@ant-design/icons";
import { handleAddRoundLessons, handleGetAllRoundLessons } from "../../../lib/features/lessonSlice";
import { toast } from "react-toastify";
import { handleGetAllRoundContent } from "../../../lib/features/roundContentSlice";
import { handleGetAllLives, handleStoreLive } from "../../../lib/features/livesSlice";

export default function AddLivesModal({
  open,
  setOpen,
  round_content_id,
  type,
  lesson_id,
  id,
  selectedLesson,
  isSource
}) {
  const [lessonData, setLessonData] = useState({
    title: "",
    link: "",
    time: "",
    active: "0", // 0 or 1
  });

  const dispatch = useDispatch();
  const [date, setDate] = useState(null); // dayjs | null
  const [dateStr, setDateStr] = useState(""); // string
  const { store_live_loading } = useSelector((state) => state?.lives);

  const isFormValid = isSource ? Boolean(lessonData?.title) :Boolean(lessonData?.title && dateStr  && lessonData?.link);

  function handleInputChange(e) {
    const { name, value } = e.target;
    setLessonData((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit() {
    if (!isFormValid || store_live_loading) return;
    let data_send

    if (!isSource) {
      data_send = {
        ...lessonData,
        lesson_id,
        date: dateStr,
      };
    }
    else {
      data_send = {
        // ...lessonData,
        title: lessonData?.title,
        lesson_id,
        active : lessonData?.active
      }
    }
      console.log(data_send);

      dispatch(handleStoreLive({ body: data_send }))
        .unwrap()
        .then((res) => {
          console.log(res)
          if (res?.data?.status === "success") {
            toast.success("تم إضافة البث المباشر بنجاح");
            dispatch(handleGetAllLives({
              body: {
                lesson_id: selectedLesson
              }
            }))
            dispatch(handleGetAllRoundContent({
              body: {
                round_id: id,
              },
            }));
            dispatch(
              handleGetAllRoundLessons({
                body: {
                  round_content_id, // parent round id
                },
              })
            );
            setOpen(false);
            setLessonData({
              title:"",
              link:"",
              active:0,
              time:""
            })
            setDate(null);
            setDateStr("")
          } else {
            toast.error(res?.error?.response?.data?.message || "هناك خطأ أثناء إضافة البث ");
          }
        })
        .catch((err) => {
          console.error("Failed to add round lesson:", err);
          toast.error("حدث خطأ غير متوقع أثناء إضافة البث");
        });
    }

    const modalFooter = (
      <div className="flex justify-start space-x-2 space-x-reverse pt-4">
        <Button
          key="submit"
          type="primary"
          onClick={handleSubmit}
          disabled={!isFormValid || store_live_loading}
          loading={store_live_loading}
          className="bg-orange-500 hover:!bg-orange-600 border-none rounded-md px-6"
          icon={<PlusOutlined />}
        >
          حفظ البث
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
        title="إضافة بث مباشر"
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
                عنوان البث المباشر
              </label>

            </div>
            <input
              id="title"
              name="title"
              value={lessonData?.title || ""}
              onChange={handleInputChange}
              className="border border-gray-400 focus:outline-none rounded-md p-2 focus:ring-1 focus:ring-orange-400"
            />
          </div>
          
          
          {!isSource &&
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
                  value={lessonData?.link || ""}
                  onChange={handleInputChange}
                  className="border border-gray-400 focus:outline-none rounded-md p-2 focus:ring-1 focus:ring-orange-400"
                  placeholder="رابط الدرس (مثل: https://example.com)"
                />
              </div>

              {/* Date Input */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="date"
                  className="text-lg font-medium text-gray-700"
                >
                  تاريخ البث المباشر
                </label>
                <DatePicker
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
                  مدة البث المباشر
                </label>
                <input
                  id="time"
                  name="time"
                  // type="time"
                  value={lessonData?.time || ""}
                  onChange={handleInputChange}
                  className="border border-gray-400 focus:outline-none rounded-md p-2 focus:ring-1 focus:ring-orange-400"
                  placeholder="وقت الدرس (مثل: 18:00)"
                />
              </div>

              {/* Active Toggle */}
              
            </div>}

            <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={lessonData?.active === "1"}
                  onChange={(e) => setLessonData((prev) => ({ ...prev, active: e.target.checked ? "1" : "0" }))}
                  className="form-checkbox"
                />
                <label className="text-gray-700 text-sm">تنشيط البث المباشر</label>
              </div>
        </div>
      </Modal>
    );
  }
