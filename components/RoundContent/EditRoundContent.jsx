"use client";
import { Modal, Button } from "antd";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { PlusOutlined } from "@ant-design/icons";
import {
  handleEditRoundContent,
  handleGetAllRoundContent,
} from "../../lib/features/roundContentSlice";
import { toast } from "react-toastify";

export default function EditRoundContent({
  open,
  setOpen,
  id,
  rowData,
  setRowData,
}) {
  const dispatch = useDispatch();

  // Make sure we always have edit_content_loading
  const { edit_content_loading } =
    useSelector((state) => state?.content) || { edit_content_loading: false };

  const isFormValid = Boolean(rowData?.title && rowData?.description);

  function handleInputChange(e) {
    const { name, value } = e.target;
    setRowData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSubmit() {
    if (!isFormValid || edit_content_loading) return;

    const data_send = {
      id: rowData?.id, // content ID
      title: rowData?.title?.trim(),
      description: rowData?.description?.trim(),
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
        disabled={!isFormValid || edit_content_loading}
        loading={edit_content_loading}
        className="bg-orange-500 hover:!bg-orange-600 border-none rounded-md px-6"
        icon={<PlusOutlined />}
      >
        تعديل المحتوى
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
      title="تعديل محتوى الدورة"
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
            عنوان المحتوى
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
            وصف المحتوى
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
  );
}
