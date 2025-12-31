"use client";
import { Modal, Button, Spin, Alert } from "antd";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PlusOutlined, YoutubeOutlined, VideoCameraOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import {
  handleAddLessonVideo,
  handleGetAllLessonVideo
} from "../../../lib/features/videoSlice";
import { handleGetAllContentFreeVideos } from "../../../lib/features/roundContentSlice";

export default function AddContentVideoModal({ open, setOpen, id, content_id }) {
  const [videoData, setVideoData] = useState({
    title: "",
    description: "",
    youtube_link: "",
    vimeo_link: "",
    time: ""
  });

  const [errors, setErrors] = useState({
    title: "",
    youtube_link: "",
    vimeo_link: "",
    time: ""
  });

  const dispatch = useDispatch();
  const { add_video_loading } = useSelector(
    (state) => state?.videos || { store_content_loading: false }
  );

  // YouTube URL patterns
  const youtubePatterns = [
    /^(https?:\/\/(?:www\.)?youtube\.com\/watch\?(?:.*&)?v=[\w-]{11}(?:&.*)?)$/,
    /^(https?:\/\/(?:www\.)?youtu\.be\/[\w-]{11})$/,
    /^(https?:\/\/(?:www\.)?youtube\.com\/embed\/[\w-]{11})$/,
    /^(https?:\/\/(?:www\.)?youtube\.com\/shorts\/[\w-]{11})$/,
    /^(https?:\/\/(?:www\.)?youtube\.com\/v\/[\w-]{11})$/,
    /^(https?:\/\/(?:www\.)?youtube\.com\/live\/[\w-]+)$/,
  ];

  // Vimeo URL patterns
  const vimeoPatterns = [
    /^(https?:\/\/(?:www\.)?vimeo\.com\/\d+)$/,
    /^(https?:\/\/(?:www\.)?vimeo\.com\/album\/\d+\/video\/\d+)$/,
    /^(https?:\/\/(?:www\.)?vimeo\.com\/channels\/[^\/]+\/\d+)$/,
    /^(https?:\/\/(?:www\.)?vimeo\.com\/groups\/[^\/]+\/videos\/\d+)$/,
    /^(https?:\/\/(?:www\.)?vimeo\.com\/ondemand\/[^\/]+\/\d+)$/,
    /^(https?:\/\/player\.vimeo\.com\/video\/\d+)$/,
  ];

  // Validation functions
  const validateYouTubeLink = (value) => {
    // If field is empty, no error (completely optional)
    if (!value || value.trim() === "") {
      return "";
    }
    
    // Check if it starts with http:// or https://
    if (!value.startsWith('http://') && !value.startsWith('https://')) {
      return "يجب أن يبدأ الرابط بـ http:// أو https://";
    }

    // Check if the URL matches any YouTube pattern
    const isValidYouTube = youtubePatterns.some(pattern => pattern.test(value));
    
    if (!isValidYouTube) {
      return "رابط YouTube غير صحيح. أمثلة صحيحة:\nhttps://youtube.com/watch?v=dQw4w9WgXcQ\nhttps://youtu.be/dQw4w9WgXcQ";
    }

    return "";
  };

  const validateVimeoLink = (value) => {
    // If field is empty, no error (completely optional)
    if (!value || value.trim() === "") {
      return "";
    }
    
    // Check if it starts with http:// or https://
    if (!value.startsWith('http://') && !value.startsWith('https://')) {
      return "يجب أن يبدأ الرابط بـ http:// أو https://";
    }

    // Check if the URL matches any Vimeo pattern
    const isValidVimeo = vimeoPatterns.some(pattern => pattern.test(value));
    
    if (!isValidVimeo) {
      return "رابط Vimeo غير صحيح. مثال صحيح:\nhttps://vimeo.com/123456789";
    }

    return "";
  };

  const validateTime = (value) => {
    if (!value) {
      return "الرجاء إدخال مدة الفيديو";
    }
    
    // تحقق من تنسيق MM:SS
    const mmssPattern = /^(?:[0-5]?[0-9]):(?:[0-5][0-9])$/;
    // تحقق من تنسيق HH:MM:SS
    const hhmmssPattern = /^(?:[01]?[0-9]|2[0-3]):(?:[0-5][0-9]):(?:[0-5][0-9])$/;
    
    if (mmssPattern.test(value) || hhmmssPattern.test(value)) {
      return "";
    }
    
    return "الرجاء إدخال الوقت بالتنسيق HH:MM:SS أو MM:SS (مثال: 14:30:45 أو 05:30)";
  };

  const validateTitle = (value) => {
    if (!value) {
      return "يرجى إدخال عنوان الفيديو";
    }
    if (value.length < 3) {
      return "العنوان يجب أن يكون 3 أحرف على الأقل";
    }
    return "";
  };

  function handleInputChange(e) {
    const { name, value } = e.target;
    setVideoData((prev) => ({
      ...prev,
      [name]: value
    }));

    // Validate the changed field
    let error = "";
    switch (name) {
      case "title":
        error = validateTitle(value);
        break;
      case "youtube_link":
        error = validateYouTubeLink(value);
        break;
      case "vimeo_link":
        error = validateVimeoLink(value);
        break;
      case "time":
        error = validateTime(value);
        break;
      default:
        error = "";
    }

    setErrors((prev) => ({
      ...prev,
      [name]: error
    }));
  }

  // Validate all fields
  const validateAll = () => {
    const newErrors = {
      title: validateTitle(videoData.title),
      youtube_link: validateYouTubeLink(videoData.youtube_link),
      vimeo_link: validateVimeoLink(videoData.vimeo_link),
      time: validateTime(videoData.time)
    };

    setErrors(newErrors);

    // Check if there are any validation errors
    const hasValidationErrors = Object.values(newErrors).some(error => error !== "");
    
    return !hasValidationErrors;
  };

  function handleSubmit() {
    if (!validateAll()) {
      toast.error("يرجى تصحيح الأخطاء قبل الإرسال");
      return;
    }

    const data_send = {
      ...videoData,
      lesson_id: id,
      free: "1"
    };

    dispatch(handleAddLessonVideo({ body: data_send }))
      .unwrap()
      .then((res) => {
        if (res?.data?.status == "success") {
          toast.success("تم إضافة الفيديو بنجاح");
          dispatch(handleGetAllContentFreeVideos({body : {round_id: id}}));
          handleClose();
        } else {
          toast.error(res?.data?.message || "هناك خطأ أثناء إضافة الفيديو");
        }
      })
      .catch((err) => {
        console.error("Failed to add video:", err);
        toast.error("فشل في إضافة الفيديو");
      });
  }

  const handleClose = () => {
    setOpen(false);
    setVideoData({
      title: "",
      description: "",
      youtube_link: "",
      vimeo_link: "",
      time: ""
    });
    setErrors({
      title: "",
      youtube_link: "",
      vimeo_link: "",
      time: ""
    });
  };

  const isFormValid = videoData.title && 
                     !errors.title && !errors.time && 
                     !errors.youtube_link && !errors.vimeo_link;

  // Custom footer for better control over button design and loading state
  const modalFooter = (
    <div className="flex justify-start space-x-2 space-x-reverse pt-4">
      <Button
        key="submit"
        type="primary"
        onClick={handleSubmit}
        disabled={!isFormValid || add_video_loading}
        loading={add_video_loading}
        className="bg-orange-500 hover:!bg-orange-600 border-none rounded-md px-6"
        icon={<PlusOutlined />}
      >
        إضافة الفيديو
      </Button>
      <Button
        key="back"
        onClick={handleClose}
        className="rounded-md px-6"
      >
        إلغاء
      </Button>
    </div>
  );

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      footer={modalFooter}
      title={
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-2 rounded-lg">
            <PlusOutlined className="text-white text-xl" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800 m-0">إضافة فيديو مجاني</h2>
            <p className="text-sm text-gray-500 m-0">املأ البيانات لإضافة فيديو مجاني</p>
          </div>
        </div>
      }
      wrapClassName="rtl-modal-wrap"
      style={{ direction: "rtl" }}
      width={600}
      centered
    >
      <div className="flex flex-col gap-4 mt-4">
        {/* Title Input */}
        <div className="flex flex-col gap-2">
          <label htmlFor="title" className="text-lg font-medium text-gray-700">
            عنوان الفيديو *
          </label>
          <input
            id="title"
            name="title"
            value={videoData?.title}
            onChange={handleInputChange}
            className={`border ${errors.title ? 'border-red-500' : 'border-gray-400'} focus:outline-none rounded-md p-2 focus:ring-1 focus:ring-orange-400`}
            placeholder="مثل: أساسيات برمجة React"
          />
          {errors.title && (
            <div className="text-red-500 text-sm mt-1">{errors.title}</div>
          )}
        </div>

        {/* Description Input */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="description"
            className="text-lg font-medium text-gray-700"
          >
            وصف الفيديو
          </label>
          <textarea
            id="description"
            name="description"
            value={videoData?.description}
            onChange={handleInputChange}
            rows={3}
            className="border border-gray-400 focus:outline-none rounded-md p-2 focus:ring-1 focus:ring-orange-400 resize-none"
            placeholder="شرح موجز لأهداف هذا المحتوى وما سيتم تغطيته (اختياري)"
          />
        </div>

        {/* Video Links Section */}
        <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg mb-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <InfoCircleOutlined className="text-blue-500" />
            روابط الفيديو (اختيارية)
          </h3>

          <div className="space-y-4">
            {/* YouTube Link */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="youtube_link"
                className="text-lg font-medium text-gray-700 flex items-center gap-2"
              >
                <YoutubeOutlined className="text-red-500" />
                رابط YouTube (اختياري)
              </label>
              <input
                id="youtube_link"
                name="youtube_link"
                value={videoData?.youtube_link}
                onChange={handleInputChange}
                className={`border ${errors.youtube_link ? 'border-red-500' : 'border-gray-400'} focus:outline-none rounded-md p-2 focus:ring-1 focus:ring-orange-400`}
                placeholder="https://youtube.com/watch?v=VIDEO_ID (اختياري)"
              />
              {errors.youtube_link && (
                <div className="text-red-500 text-sm mt-1 whitespace-pre-line">{errors.youtube_link}</div>
              )}
            </div>

            {/* Vimeo Link */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="vimeo_link"
                className="text-lg font-medium text-gray-700 flex items-center gap-2"
              >
                <VideoCameraOutlined className="text-blue-500" />
                رابط Vimeo (اختياري)
              </label>
              <input
                id="vimeo_link"
                name="vimeo_link"
                value={videoData?.vimeo_link}
                onChange={handleInputChange}
                className={`border ${errors.vimeo_link ? 'border-red-500' : 'border-gray-400'} focus:outline-none rounded-md p-2 focus:ring-1 focus:ring-orange-400`}
                placeholder="https://vimeo.com/123456789 (اختياري)"
              />
              {errors.vimeo_link && (
                <div className="text-red-500 text-sm mt-1 whitespace-pre-line">{errors.vimeo_link}</div>
              )}
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            <p className="font-semibold mb-1">ملاحظة:</p>
            <p className="mb-1">• يمكنك إدخال رابط YouTube أو Vimeo أو كلاهما أو لا شيء</p>
            <p className="mb-1">• الروابط اختيارية تماماً</p>
            <p className="font-semibold mt-2 mb-1">أمثلة على الروابط الصحيحة:</p>
            <p className="mb-1">YouTube: https://youtube.com/watch?v=dQw4w9WgXcQ</p>
            <p>Vimeo: https://vimeo.com/123456789</p>
          </div>
        </div>

        {/* Duration Input */}
        <div className="flex flex-col gap-2">
          <label htmlFor="time" className="text-lg font-medium text-gray-700">
            مدة الفيديو
          </label>
          <input
            id="time"
            name="time"
            value={videoData?.time}
            onChange={handleInputChange}
            className={`border ${errors.time ? 'border-red-500' : 'border-gray-400'} focus:outline-none rounded-md p-2 focus:ring-1 focus:ring-orange-400`}
            placeholder="مثال: 14:30:45 أو 05:30"
          />
          {errors.time && (
            <div className="text-red-500 text-sm mt-1">{errors.time}</div>
          )}
          <div className="text-sm text-gray-500 mt-1">
            أدخل المدة بالتنسيق HH:MM:SS أو MM:SS
          </div>
        </div>
      </div>
    </Modal>
  );
}