"use client";

import { handleAddExamVideo } from "@/lib/features/examSlice";
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
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

export default function EditVideo({
  data,
  open,
  setOpen,
  isEditing,
  setIsEditing,
  isExam
}) {
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();
  useEffect(() => {
    setFormData({ ...data, vimeo_link: isExam ? data?.video_url : data?.vimeo_link });
  }, [data]);
  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    console.log("formDataokdfokdf", formData);
    e.preventDefault();
    const data = {
      id: formData?.id,
      lesson_id: formData?.lesson_id,
      time: formData?.time,
      youtube_link: formData?.youtube_link,
      vimeo_link: formData?.vimeo_link,
      video_url: formData?.vimeo_link,
      title: formData?.title,
      free: formData?.free,

      description: formData?.description
    };
    console.log(data, "formData");
    if (isEditing) {
      dispatch(handleEditLessonVideo({ body: data })).then((payload) => {
        setIsEditing(false);
        if (
          payload?.payload?.status == 200 &&
          payload?.payload?.data?.status === "success"
        ) {
          toast.success("Video updated successfully");
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
      if (isExam) {
          dispatch(handleAddExamVideo({ body: data })).then((payload) => {
          setIsEditing(false);
          console.log("payload -- 1 -- 2", payload)
          if (
            payload?.payload?.status == 200 &&
            payload?.payload?.data?.status === "success"
          ) {
            toast.success("Video Created successfully");
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
      } else {
        dispatch(handleAddLessonVideo({ body: data })).then((payload) => {
          setIsEditing(false);
          if (
            payload?.payload?.status == 200 &&
            payload?.payload?.data?.status === "success"
          ) {
            toast.success("Video Created successfully");
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
            عنوان الفيديو
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
        <div>
          <label
            for="visitors"
            class="block mb-2.5 text-sm font-medium text-heading"
          >
            وصف الفيديو
          </label>
          <input
            name="description"
            type="text"
            id="visitors"
            class="!rounded-md bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body text-black"
            placeholder=""
            required
            value={formData?.description}
            onChange={changeHandler}
          />
        </div>
        <div>
          <label
            for="visitors"
            class="block mb-2.5 text-sm font-medium text-heading"
          >
            وقت الفيديو
          </label>
          <input
            name="time"
            type="text"
            id="visitors"
            class="!rounded-md bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body text-black"
            placeholder=""
            
            value={formData?.time}
            onChange={changeHandler}
          />
        </div>
           <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              مجاني
            </label>
            <select
              value={formData?.free}
              onChange={changeHandler}
              name="free"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="0">لا</option>
              <option value="1">نعم</option>
            </select>
          </div>
        <div>
          <label
            for="visitors"
            class="block mb-2.5 text-sm font-medium text-heading"
          >
          {isExam ? "لينك الفيديو" : "لينك فيميو"}
          </label>
          <input
            name="vimeo_link"
            type="text"
            id="visitors"
            class="!rounded-md bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body text-black"
            placeholder=""
            required
            value={formData?.vimeo_link}
            onChange={changeHandler}
          />
        </div>
        {!isExam ? <div>
          <label
            for="visitors"
            class="block mb-2.5 text-sm font-medium text-heading"
          >
            لينك يوتيوب
          </label>
          <input
            name="youtube_link"
            type="text"
            id="visitors"
            class="!rounded-md bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body text-black"
            placeholder=""
            required
            value={formData?.youtube_link}
            onChange={changeHandler}
          />
        </div>: null}
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
