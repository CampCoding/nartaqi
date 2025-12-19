"use client";

import { DatePicker, Modal } from "antd";
import { useEffect, useState } from "react";
import dayjs from 'dayjs';
import { useDispatch } from "react-redux";
import {
  handleAddRoundContent,
  handleEditRoundContent,
  handleGetAllRoundContent
} from "@/lib/features/roundContentSlice";
import { toast } from "react-toastify";

export default function EditContent({
  data,
  open,
  setOpen,
  isEditing,
  setIsEditing,
  source
}) {
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();
  useEffect(() => {
    setFormData({...data});
  }, [data]);
  const changeHandler = (e) => {
    console.log(formData, "formData");
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      ...formData,
      show_date: dayjs(formData?.appearance_time || formData.date).format(
        "YYYY-MM-DD"
      ),
      type: formData?.type || "lecture",
      title: formData?.content_title,
      description: formData?.content_description
    };
    if (isEditing) {
      dispatch(handleEditRoundContent({ body: data })).then((payload) => {
        console.log("payload", payload);
        setIsEditing(false);
        if (payload?.payload?.status == 200 && payload?.payload?.data?.status === "success") {
          toast.success("Content updated successfully");
          setIsEditing(false);
          setOpen(false);
        }else{
          toast.error(payload?.payload?.error?.response?.data?.message);
        }
      })
    } else {
      dispatch(handleAddRoundContent({ body: data })).then((payload) => {
        console.log("payload", payload);
        setIsEditing(false);
        if (payload?.payload?.status == 200 && payload?.payload?.data?.status === "success") {
          toast.success("Content Created successfully");
          setIsEditing(false);
          setOpen(false);
        }else{
          toast.error(payload?.payload?.data?.message);
        }
      })
    }
    dispatch(
      handleGetAllRoundContent({ body: { round_id: formData.round_id } })
    );
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
        class="max-w-sm mx-auto space-y-4 flex flex-col"
        onSubmit={handleSubmit}
      >
        <div>
          <label
            for="visitors"
            class="block mb-2.5 text-sm font-medium text-heading "
          >
            عنوان المحاضرة
          </label>
          <input
            type="text"
            name="content_title"
            id="visitors"
            class="!rounded-md bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-2.5 py-2 shadow-xs placeholder:text-body text-black"
            placeholder=""
            required
            value={formData?.content_title}
            onChange={changeHandler}
          />
        </div>
        <div>
          <label
            for="visitors"
            class="block mb-2.5 text-sm font-medium text-heading"
          >
            وصف المحاضرة
          </label>
          <input
            name="content_description"
            type="text"
            id="visitors"
            class="!rounded-md bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body text-black"
            placeholder=""
            required
            value={formData?.content_description}
            onChange={changeHandler}
          />
        </div>
        <div>
          <label
            for="visitors"
            class="block mb-2.5 text-sm font-medium text-heading"
          >
            وقت الظهور
          </label>
          <DatePicker
            status="warning"
            style={{ width: '100%' }}
            value={
              formData?.appearance_time
                ? dayjs(formData.appearance_time)
                : dayjs()
            }
            onChange={(date, dateString) =>
              setFormData({ ...formData, appearance_time: dateString })
            }
          />
        </div>
        <button
          type="submit"
          class="!rounded-md text-white bg-primary mr-auto box-border border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none"
        >
          حفظ{" "}
        </button>
      </form>
    </Modal>
  );
}
