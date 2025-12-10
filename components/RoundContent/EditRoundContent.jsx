"use client";
import { Modal, Button, DatePicker } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PlusOutlined } from "@ant-design/icons";
import {
  handleEditRoundContent,
  handleGetAllRoundContent,
} from "../../lib/features/roundContentSlice";
import { toast } from "react-toastify";
import dayjs from "dayjs";

export default function EditRoundContent({
  open,
  setOpen,
  id,
  rowData,
  setRowData,
}) {
  const dispatch = useDispatch();
  const [errors, setErrors] = useState({});

  // Make sure we always have edit_content_loading
  const { edit_content_loading } =
    useSelector((state) => state?.content) || { edit_content_loading: false };

  // Reset errors when modal opens
  useEffect(() => {
    if (open) {
      setErrors({});
    }
  }, [open]);

  // Handle text input changes
  function handleInputChange(e) {
    const { name, value } = e.target;
    console.log(name, value);
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
    
    setRowData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  // Handle date change
  function handleDateChange(date, dateString) {
    console.log("Selected date string:", dateString);
    console.log("Selected date object:", date);
    
    // Clear date error
    if (errors.show_date) {
      setErrors(prev => ({ ...prev, show_date: null }));
    }
    
    setRowData((prev) => ({
      ...prev,
      show_date: dateString, // Store the date string in YYYY-MM-DD format
    }));
  }

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    // Validate title
    if (!rowData?.content_title?.trim()) {
      newErrors.content_title = "يرجى إدخال عنوان المحتوى";
    } else if (rowData.content_title.trim().length < 3) {
      newErrors.content_title = "يجب أن يكون العنوان 3 أحرف على الأقل";
    }
    
    // Validate description
    if (!rowData?.content_description?.trim()) {
      newErrors.content_description = "يرجى إدخال وصف المحتوى";
    } else if (rowData.content_description.trim().length < 10) {
      newErrors.content_description = "يجب أن يكون الوصف 10 أحرف على الأقل";
    }
    
    // Validate date
    if (!rowData?.show_date) {
      newErrors.show_date = "يرجى اختيار التاريخ";
    } else {
      const dateObj = dayjs(rowData.show_date);
      if (!dateObj.isValid()) {
        newErrors.show_date = "يرجى اختيار تاريخ صحيح";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  function handleSubmit() {
    if (!validateForm() || edit_content_loading) return;

    // Format the date properly for API
    let formattedDate = null;
    if (rowData?.show_date) {
      const dateObj = dayjs(rowData.show_date);
      if (dateObj.isValid()) {
        formattedDate = dateObj.format('YYYY-MM-DD');
      } else {
        formattedDate = rowData.show_date;
      }
    }

    const data_send = {
      id: rowData?.id, // content ID
      title: rowData?.content_title?.trim(),
      description: rowData?.content_description?.trim(),
      show_date: formattedDate, // Send formatted date
    };

    dispatch(handleEditRoundContent({ body: data_send }))
      .unwrap()
      .then((res) => {
        if (res?.data?.status === "success") {
          toast.success("تم تعديل المحتوى بنجاح");
          dispatch(
            handleGetAllRoundContent({
              body: {
                round_id: id, // parent round id
              },
            })
          );
          setOpen(false);
          setErrors({});
        } else {
          toast.error(res?.data?.message || "هناك خطأ أثناء تعديل المحتوى");
        }
      })
      .catch((err) => {
        console.error("Failed to edit round content:", err);
        toast.error("حدث خطأ غير متوقع أثناء تعديل المحتوى");
      });
  }

  const modalFooter = (
    <div className="flex justify-start space-x-2 space-x-reverse pt-4">
      <Button
        key="submit"
        type="primary"
        onClick={handleSubmit}
        disabled={edit_content_loading}
        loading={edit_content_loading}
        className="bg-orange-500 hover:!bg-orange-600 border-none rounded-md px-6"
        icon={<PlusOutlined />}
      >
        تعديل المحتوى
      </Button>
      <Button
        key="back"
        onClick={() => {
          setOpen(false);
          setErrors({});
        }}
        className="rounded-md px-6"
      >
        إلغاء
      </Button>
    </div>
  );

  // Get dayjs object for DatePicker
  const dateValue = rowData?.show_date ? dayjs(rowData.show_date) : null;

  return (
    <Modal
      open={open}
      onCancel={() => {
        setOpen(false);
        setErrors({});
      }}
      footer={modalFooter}
      title="تعديل محتوى الدورة"
      wrapClassName="rtl-modal-wrap"
      style={{ direction: "rtl" }}
    >
      <div className="flex flex-col gap-4 mt-4">
        {/* Title Input */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="content_title"
            className="text-lg font-medium text-gray-700"
          >
            عنوان المحتوى *
          </label>
          <input
            id="content_title"
            name="content_title"
            value={rowData?.content_title || ""}
            onChange={handleInputChange}
            className={`border rounded-md p-2 focus:outline-none focus:ring-1 ${
              errors.content_title 
                ? "border-red-500 focus:ring-red-400" 
                : "border-gray-400 focus:ring-orange-400"
            }`}
            placeholder="مثل: أساسيات برمجة React"
          />
          {errors.content_title && (
            <p className="text-red-500 text-sm mt-1">{errors.content_title}</p>
          )}
        </div>

        {/* Description Input */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="content_description"
            className="text-lg font-medium text-gray-700"
          >
            وصف المحتوى *
          </label>
          <textarea
            id="content_description"
            name="content_description"
            value={rowData?.content_description || ""}
            onChange={handleInputChange}
            rows={3}
            className={`border rounded-md p-2 focus:outline-none focus:ring-1 resize-none ${
              errors.content_description 
                ? "border-red-500 focus:ring-red-400" 
                : "border-gray-400 focus:ring-orange-400"
            }`}
            placeholder="شرح موجز لأهداف هذا المحتوى وما سيتم تغطيته"
          />
          {errors.content_description && (
            <p className="text-red-500 text-sm mt-1">{errors.content_description}</p>
          )}
        </div>

        {/* Date Input - Required */}
        <div className="flex flex-col gap-2">
          <label className="text-lg font-medium text-gray-700">
            التاريخ *
          </label>
          <DatePicker
            value={dateValue}
            onChange={handleDateChange}
            format="YYYY-MM-DD"
            className={`w-full ${
              errors?.show_date ? "border-red-500" : ""
            }`}
            placeholder="اختر التاريخ"
            status={errors?.show_date ? "error" : ""}
          />
          {errors?.show_date && (
            <p className="text-red-500 text-sm mt-1">{errors?.show_date}</p>
          )}
          {rowData?.show_date && !errors.show_date && (
            <p className="text-sm text-gray-500 mt-1">
              التاريخ الحالي: {dateValue?.format('YYYY-MM-DD') || rowData?.show_date}
            </p>
          )}
        </div>
      </div>
    </Modal>
  );
}