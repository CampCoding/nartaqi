"use client";
import { Modal, Button, Spin, Select, DatePicker } from "antd"; // Import Button and Spin from Ant Design
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PlusOutlined, LoadingOutlined } from "@ant-design/icons"; // Import icons
import {
  handleAddRoundContent,
  handleGetAllRoundContent
} from "../../lib/features/roundContentSlice";
import { toast } from "react-toastify";
import { handleGetSourceRound } from "@/lib/features/roundsSlice";

export default function AddRoundContent({
  isSource,
  open,
  setOpen,
  id,
  type = "basic"
}) {
  const [date, setDate] = useState(null); // dayjs | null
  const [dateStr, setDateStr] = useState(""); // string

  const [roundContentData, setRoundContentData] = useState({
    title: "",
    description: "",
    round_id: null
  });

  const dispatch = useDispatch();
  const { store_content_loading } = useSelector(
    (state) => state?.content || { store_content_loading: false }
  );
  const { source_round_list, source_round_loading } = useSelector(
    (state) => state?.rounds
  );

  const isFormValid = isSource
    ? roundContentData.title
    : roundContentData.title && dateStr;

  useEffect(() => {
    if (!id) {
      dispatch(handleGetSourceRound());
    }
  }, [id]);

  useEffect(() => {
    console.log("source_round_list", source_round_list?.data?.message?.data);
  }, [source_round_list]);

  function handleInputChange(e) {
    const { name, value } = e.target;
    setRoundContentData((prev) => ({
      ...prev,
      [name]: value
    }));
  }

  useEffect(() => {
    console.log(id);
    if (id) {
      setRoundContentData((prev) => ({ ...prev, round_id: id }));
    }
  }, [id]);

  function handleSubmit() {
    if (!roundContentData?.title) {
      toast.warn("برجاء ادخال عنوان أولا!");
      return;
    }

    if (!isSource && !dateStr) {
      toast.warn("برجاء اختيار تاريخ أولا!");
      return;
    }

    const data_send = {
      ...roundContentData,
      type: type ? type : "basic",
      round_id: roundContentData?.round_id,
      show_date: dateStr
      // Ensure 'id' is correctly passed as the parent round ID
    };

    dispatch(handleAddRoundContent({ body: data_send }))
      .unwrap()
      .then((res) => {
        console.log(res);
        if (res?.data?.status == "success") {
          toast.success("تم اضافه المحتوي بنجاح");
          dispatch(
            handleGetAllRoundContent({
              body: {
                round_id: id || roundContentData?.round_id
              }
            })
          );
          setOpen(false);
          setRoundContentData({
            title: "",
            description: "",
            round_id: id || roundContentData?.round_id
          });
          setOpen(false);
          setDate(null);
          setDateStr("");
        } else {
          toast.error(
            res?.error?.response?.data?.message ||
              "هناك خطأ أثناء اضافه المحتوي"
          );
        }
      })
      .catch((err) => {
        console.error("Failed to add round content:", err);
      })
      .finally(() => null);
  }
  useEffect(() => {
    setRoundContentData({
      title: "",
      description: "",
      round_id: id || roundContentData?.round_id
    });
  }, [open]);
  // Custom footer for better control over button design and loading state
  const modalFooter = (
    <div className="flex justify-start space-x-2 space-x-reverse pt-4">
      <Button
        key="submit"
        type="primary"
        onClick={handleSubmit}
        disabled={!isFormValid || store_content_loading}
        loading={store_content_loading}
        className="bg-orange-500 hover:!bg-orange-600 border-none rounded-md px-6"
        icon={<PlusOutlined />}
      >
        إضافة المحتوى
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
      title="إضافة محتوي الدورة"
      wrapClassName="rtl-modal-wrap"
      style={{ direction: "rtl" }}
    >
      <div className="flex flex-col gap-4 mt-4">
        {!id && source_round_list?.data?.message?.data && (
          <div className="flex flex-col gap-2">
            <label
              htmlFor="title"
              className="text-lg font-medium text-gray-700"
            >
              الدورة
            </label>
            <Select
              value={roundContentData?.round_id}
              onChange={(value) =>
                setRoundContentData((prev) => ({ ...prev, round_id: value }))
              }
            >
              {source_round_list?.data?.message?.data?.map((round) => (
                <Select.Option key={round?.id} value={round?.id}>
                  {round?.name}
                </Select.Option>
              ))}
            </Select>
          </div>
        )}
        {/* Title Input */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            {" "}
            <label
              htmlFor="title"
              className="text-lg font-medium text-gray-700"
            >
              عنوان المحتوى
            </label>
            <div className=""> </div>
          </div>
          <input
            id="title"
            name="title"
            value={roundContentData.title}
            onChange={handleInputChange}
            className="border border-gray-400 focus:outline-none rounded-md p-2 focus:ring-1 focus:ring-orange-400"
            placeholder="قم بإدخال عنوان المحتوي"
          />
        </div>

        {/* Description Input (using textarea for multi-line description) */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="description"
            className="text-lg font-medium text-gray-700"
          >
            وصف المحتوى
          </label>
          <textarea
            id="description"
            name="description"
            value={roundContentData.description}
            onChange={handleInputChange}
            rows={3} // Allows for a better description entry experience
            className="border border-gray-400 focus:outline-none rounded-md p-2 focus:ring-1 focus:ring-orange-400 resize-none"
            placeholder="قم بإدخال وصف المحتوي"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label>جدولة المحتوي (تحديد تاريخ ظهور المحتوي) </label>
          <DatePicker
            onChange={(value, stringValue) => {
              setDate(value); // value ده dayjs أو null
              setDateStr(stringValue); // string formatted
              console.log("string:", stringValue);
              console.log("ISO:", value ? value.toISOString() : null);
            }}
          />
        </div>
      </div>
    </Modal>
  );
}
