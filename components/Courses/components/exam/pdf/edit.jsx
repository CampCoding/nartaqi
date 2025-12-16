"use client";

import {
  handleAddExamPdf,
  handleEditExamPdf,
  handleEditExamPdfFile
} from "@/lib/features/examSlice";
import {
  handleAddRoundLessons,
  handleEditRoundLessons
} from "@/lib/features/lessonSlice";
import { handleGetAllRoundContent } from "@/lib/features/roundContentSlice";
import {
  handleAddLessonVideo,
  handleEditLessonVideo
} from "@/lib/features/videoSlice";
import { Modal } from "antd";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

export default function EditPdf({
  data,
  open,
  setOpen,
  isEditing,
  setIsEditing
}) {
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();
  
  useEffect(() => {
    setFormData({ ...data });
  }, [data]);

  const changeHandler = (e) => {
    if (e.target.type === 'file') {
      setFormData({ ...formData, [e.target.name]: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const formRef = useRef();
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataForm = new FormData(formRef.current);
    
    // Always append lesson_id whether editing or creating
    if (formData?.lesson_id) {
      dataForm.append("lesson_id", formData?.lesson_id);
    }

    if (isEditing) {
      if (formData?.id) dataForm.append("id", formData?.id);
      
      // If no new file is selected, remove the file requirement
      if (!dataForm.get('pdf_url') || dataForm.get('pdf_url').size === 0) {
        dataForm.delete('pdf_url');
      }
      
      dispatch(handleEditExamPdfFile({ body: dataForm })).then((payload) => {
        setIsEditing(false);
        if (
          payload?.payload?.status == 200 &&
          payload?.payload?.data?.status === "success"
        ) {
          toast.success("Pdf updated successfully");
          setIsEditing(false);
          formRef?.current?.reset();
          setOpen(false);
          dispatch(
            handleGetAllRoundContent({ body: { round_id: formData.round_id } })
          );
        } else {
          toast.error(payload?.payload?.error?.response?.data?.message || "Failed to update PDF");
        }
      });
    } else {
      dispatch(handleAddExamPdf({ body: {"Sd": "Sd"} })).then((payload) => {
        if (
          payload?.payload?.status == 200 &&
          payload?.payload?.data?.status === "success"
        ) {
          toast.success("Pdf Created successfully");
          setIsEditing(false);
          formRef?.current?.reset();
          setOpen(false);
          dispatch(
            handleGetAllRoundContent({ body: { round_id: formData.round_id } })
          );
        } else {
          toast.error(payload?.payload?.data?.message || "Failed to create PDF");
        }
      });
    }
  };

  return (
    <Modal
      open={open}
      onCancel={() => setOpen(null)}
      okText={""}
      cancelText={""}
      footer={null}
    >
      <form
        className="max-w-sm mx-auto space-y-4 flex flex-col"
        onSubmit={handleSubmit}
        ref={formRef}
      >
        <div>
          <label
            htmlFor="title"
            className="block mb-2.5 text-sm font-medium text-heading"
          >
            عنوان الملف
          </label>
          <input
            type="text"
            name="title"
            id="title"
            className="!rounded-md bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-2.5 py-2 shadow-xs placeholder:text-body text-black"
            placeholder=""
            required
            value={formData?.title || ''}
            onChange={changeHandler}
          />
        </div>
        <div>
          <label
            htmlFor="description"
            className="block mb-2.5 text-sm font-medium text-heading"
          >
            وصف الملف
          </label>
          <input
            name="description"
            type="text"
            id="description"
            className="!rounded-md bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body text-black"
            placeholder=""
            required
            value={formData?.description || ''}
            onChange={changeHandler}
          />
        </div>
        <div>
          <label
            htmlFor="type"
            className="block mb-2.5 text-sm font-medium text-heading"
          >
            نوع الملف
          </label>
          <select
            value={formData?.type || ''}
            name="type"
            id="type"
            className="!rounded-md bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body text-black"
            onChange={changeHandler}
            required
          >
            <option value="">اختر نوع الملف</option>
            <option value="question">أسألة</option>
            <option value="answers">إجابات</option>
          </select>
        </div>
        <div>
          <label
            htmlFor="pdf_url"
            className="block mb-2.5 text-sm font-medium text-heading"
          >
            الملف
          </label>
          <div className="flex items-center gap-2">
            <input
              name="pdf_url"
              type="file"
              id="pdf_url"
              className="!rounded-md bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body text-black"
              placeholder=""
              accept=".pdf"
              required={!isEditing}
              onChange={changeHandler}
            />
            {formData?.pdf_url && typeof formData.pdf_url === 'string' && (
              <a
                href={formData?.pdf_url}
                target="_blank"
                className="inline-flex font-medium items-center text-fg-brand hover:underline whitespace-nowrap"
              >
                عرض الملف
                <svg
                  className="w-4 h-4 ms-2 rtl:rotate-[270deg]"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M18 14v4.833A1.166 1.166 0 0 1 16.833 20H5.167A1.167 1.167 0 0 1 4 18.833V7.167A1.166 1.166 0 0 1 5.167 6h4.618m4.447-2H20v5.768m-7.889 2.121 7.778-7.778"
                  />
                </svg>
              </a>
            )}
          </div>
        </div>
        <button
          type="submit"
          className="!rounded-md text-white bg-primary mr-auto box-border border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none"
        >
          حفظ
        </button>
      </form>
    </Modal>
  );
}