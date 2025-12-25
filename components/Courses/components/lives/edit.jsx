"use client";

import { handleAddExamVideo } from "@/lib/features/examSlice";
import {
  handleAddRoundLessons,
  handleEditRoundLessons
} from "@/lib/features/lessonSlice";
import { handleEditLive, handleStoreLive } from "@/lib/features/livesSlice";
import { handleGetAllRoundContent } from "@/lib/features/roundContentSlice";
import {
  handleAddLessonVideo,
  handleEditLessonVideo
} from "@/lib/features/videoSlice";
import { Modal } from "antd";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

export default function EditLive({
  data,
  open,
  setOpen,
  isEditing,
  setIsEditing,
  isExam,
}) {
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();
  const searchParams  =  useSearchParams();
  const source = searchParams.get("source"); 
   
  useEffect(() => {
    setFormData({ ...data });
  }, [data]);
  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    console.log("formDataokdfokdf", formData);
    e.preventDefault();
    let data ;
    if(!source) {
     data = {
      id: formData?.id,
      lesson_id: formData?.lesson_id,
      time: formData?.time,
      date: formData?.date,
      link: formData?.link,
      title: formData?.title,
      active: 0
    };
    }else {
       data = {
      id: formData?.id,
      lesson_id: formData?.lesson_id,
      // time: formData?.time,
      // date: formData?.date,
      // link: formData?.link,
      title: formData?.title,
      // active: 0
    };
    }
    if (isEditing) {
      dispatch(handleEditLive({ body: data })).then((payload) => {
        setIsEditing(false);
        if (
          payload?.payload?.status == 200 &&
          payload?.payload?.data?.status === "success"
        ) {
          toast.success("Live updated successfully");
          setIsEditing(false);
          setOpen(false);
          dispatch(
            handleGetAllRoundContent({ body: { round_id: formData.round_id } })
          );
        } else {
          toast.error(payload?.payload?.error?.response?.data?.message);
        }
      });
    } else {
      dispatch(handleStoreLive({ body: data })).then((payload) => {
        setIsEditing(false);
        console.log("payload -- 1 -- 2", payload);
        if (
          payload?.payload?.status == 200 &&
          payload?.payload?.data?.status === "success"
        ) {
          toast.success("Live Created successfully");
          setIsEditing(false);
          setOpen(false);
          dispatch(
            handleGetAllRoundContent({
              body: { round_id: formData.round_id }
            })
          );
        } else {
          toast.error(payload?.payload?.data?.message);
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
        class="max-w-sm mx-auto space-y-4 flex flex-col"
        onSubmit={handleSubmit}
      >
        <div>
          <label
            for="visitors"
            class="block mb-2.5 text-sm font-medium text-heading "
          >
            عنوان البث
          </label>
          <input
            type="text"
            name="title"
            id="visitors"
            class="!rounded-md bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-2.5 py-2 shadow-xs placeholder:text-body text-black"
            placeholder=""
            required
            value={formData?.title}
            onChange={changeHandler}
          />
        </div>
        {!source && <div className="flex flex-col gap-2">
        <div>
          <label
            for="visitors"
            class="block mb-2.5 text-sm font-medium text-heading"
          >
            تاريخ البث
          </label>
          <input
            name="date"
            type="date"
            id="visitors"
            class="!rounded-md bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body text-black"
            placeholder=""
            required
            value={formData?.date}
            onChange={changeHandler}
          />
        </div>

        <div>
          <label
            for="visitors"
            class="block mb-2.5 text-sm font-medium text-heading"
          >
            وقت البث
          </label>
          <input
            name="time"
            type="time"
            id="visitors"
            class="!rounded-md bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body text-black"
            placeholder=""
            value={formData?.time}
            onChange={changeHandler}
          />
        </div>

        <div>
          <label
            for="visitors"
            class="block mb-2.5 text-sm font-medium text-heading"
          >
            رابط البث
          </label>
          <input
            name="link"
            type="text"
            id="visitors"
            class="!rounded-md bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body text-black"
            placeholder=""
            required
            value={formData?.link}
            onChange={changeHandler}
          />
        </div>
</div>}
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
