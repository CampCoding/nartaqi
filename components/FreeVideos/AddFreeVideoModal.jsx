"use client";
import { 
  Modal, 
  Button, 
  Form, 
  Input, 
  Upload, 
  Tooltip,
  message,
  Alert,
  Space
} from "antd";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  PlusOutlined,
  UploadOutlined,
  YoutubeOutlined,
  VideoCameraOutlined,
  ClockCircleOutlined,
  InfoCircleOutlined 
} from "@ant-design/icons";
import { toast } from "react-toastify";
import { handleCreateFreeVideos, handleGetAllFreeVideos } from "../../lib/features/freeVideoSlice";
import { Trash2, Link, Image as ImageIcon } from "lucide-react";

const { TextArea } = Input;

export default function AddFreeVideoModal({ open, setOpen, id, page, per_page, content_id }) {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { create_video_loading } = useSelector(state => state?.free_videos);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const handleSubmit = async (values) => {
    try {
      if(!values?.time?.includes(":")) {
        toast.warn("ادخل مدة الوقت بطريقة صحيحه لازم يحتوي علي :  ");
        return;
      }
      const formData = new FormData();
      formData.append('title', values.title?.trim());
      formData.append("description", values.description?.trim() || '');
      formData.append("time", values.time || '');
      formData.append("vimeo_link", values.vimeo_link || '');
      formData.append("youtube_link", values.youtube_link || '');
      
      // Append image file if selected
      if (imageFile) {
        formData.append("image", imageFile);
      }

      // Log FormData for debugging
      console.log('FormData being sent:');
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      dispatch(handleCreateFreeVideos({ body: formData }))
        .unwrap()
        .then((res) => {
          if (res?.data?.status == "success") {
            toast.success("تم إضافة الفيديو بنجاح");
            dispatch(handleGetAllFreeVideos({ page, per_page }));
            handleClose();
          } else {
            toast.error(res?.error?.response?.data?.message || "هناك خطأ أثناء إضافة الفيديو");
          }
        })
        .catch((err) => {
          console.error("Failed to add video:", err);
          toast.error("فشل في إضافة الفيديو");
        });
    } catch (error) {
      console.error("Form validation failed:", error);
    }
  };

  const handleClose = () => {
    form.resetFields();
    setImagePreview(null);
    setImageFile(null);
    setOpen(false);
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const beforeUpload = (file) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('يمكنك رفع صور فقط!');
      return Upload.LIST_IGNORE;
    }
    
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('يجب أن يكون حجم الصورة أقل من 2MB!');
      return Upload.LIST_IGNORE;
    }
    
    // Store the file object
    setImageFile(file);
    
    // Create preview
    const preview = URL.createObjectURL(file);
    setImagePreview(preview);
    
    return false; // Prevent auto upload
  };

  const removeImage = () => {
    setImagePreview(null);
    setImageFile(null);
    form.setFieldValue('image', null);
  };

  const validateLinks = (_, value) => {
    if (!value) {
      return Promise.resolve();
    }
    
    if (value.startsWith('http://') || value.startsWith('https://')) {
      return Promise.resolve();
    }
    
    return Promise.reject(new Error('يجب أن يبدأ الرابط بـ http:// أو https://'));
  };

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      title={
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-2 rounded-lg">
            <PlusOutlined className="text-white text-xl" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800 m-0">إضافة فيديو مجاني جديد</h2>
            <p className="text-sm text-gray-500 m-0">املأ البيانات لإضافة فيديو جديد</p>
          </div>
        </div>
      }
      width={700}
      centered
      footer={null}
      className="add-video-modal"
      destroyOnClose
      style={{ direction: "rtl" }}
    >
      <div className="pt-4">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          requiredMark="optional"
          className="space-y-6"
        >
          {/* Main Information Section */}
          <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <InfoCircleOutlined className="text-green-500" />
              المعلومات الأساسية
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Title */}
              <Form.Item
                label={
                  <span className="font-medium text-gray-700">
                    عنوان الفيديو
                    <span className="text-red-500 mr-1">*</span>
                  </span>
                }
                name="title"
                rules={[
                  { required: true, message: 'يرجى إدخال عنوان الفيديو' },
                  { min: 3, message: 'العنوان يجب أن يكون 3 أحرف على الأقل' }
                ]}
              >
                <Input 
                  size="large"
                  placeholder="أدخل عنوان الفيديو"
                  prefix={<VideoCameraOutlined className="text-gray-400" />}
                  className="rounded-lg hover:border-green-300 focus:border-green-500 focus:shadow-green-200"
                />
              </Form.Item>

              {/* Duration */}
              <Form.Item
                label={
                  <span className="font-medium text-gray-700">
                    مدة الفيديو
                  </span>
                }
                name="time"
                rules={[
                  { pattern: /^([0-5]?[0-9]):([0-5][0-9])$/, message: 'الرجاء إدخال الوقت بالتنسيق MM:SS' }
                ]}
              >
                <Input 
                  size="large"
                  placeholder="مثال: 30:00"
                  prefix={<ClockCircleOutlined className="text-gray-400" />}
                  className="rounded-lg"
                />
              </Form.Item>
            </div>

            {/* Description */}
            <Form.Item
              label={
                <span className="font-medium text-gray-700">
                  وصف الفيديو
                </span>
              }
              name="description"
            >
              <TextArea
                rows={3}
                placeholder="اكتب وصفاً مفصلاً للفيديو..."
                className="rounded-lg resize-none"
                showCount
                maxLength={500}
              />
            </Form.Item>
          </div>

          {/* Video Links Section */}
          <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Link className="w-5 h-5 text-blue-500" />
              روابط الفيديو
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* YouTube Link */}
              <Form.Item
                label={
                  <span className="font-medium text-gray-700 flex items-center gap-2">
                    <YoutubeOutlined className="text-red-500" />
                    رابط YouTube
                  </span>
                }
                name="youtube_link"
                rules={[
                  { validator: validateLinks },
                  { type: 'url', message: 'يرجى إدخال رابط صحيح' }
                ]}
              >
                <Input 
                  size="large"
                  placeholder="https://youtube.com/watch?v=..."
                  className="rounded-lg"
                />
              </Form.Item>

              {/* Vimeo Link */}
              <Form.Item
                label={
                  <span className="font-medium text-gray-700 flex items-center gap-2">
                    <VideoCameraOutlined className="text-blue-500" />
                    رابط Vimeo
                  </span>
                }
                name="vimeo_link"
                rules={[
                  { validator: validateLinks },
                  { type: 'url', message: 'يرجى إدخال رابط صحيح' }
                ]}
              >
                <Input 
                  size="large"
                  placeholder="https://vimeo.com/..."
                  className="rounded-lg"
                />
              </Form.Item>
            </div>

            <Alert
              message="معلومة"
              description="يمكنك إضافة رابط واحد على الأقل من المنصتين. يفضل إضافة رابط YouTube إذا متاح."
              type="info"
              showIcon
              className="rounded-lg"
            />
          </div>

          {/* Thumbnail Section */}
          <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-purple-500" />
              صورة الغلاف (اختياري)
            </h3>
            
            <Form.Item
              name="image"
              valuePropName="fileList"
              getValueFromEvent={normFile}
              extra="يُفضل صور PNG أو JPG بحجم 16:9 وأقل من 2MB"
            >
              <Upload
                name="image"
                listType="picture-card"
                showUploadList={false}
                beforeUpload={beforeUpload}
                accept="image/*"
                className="image-uploader"
                maxCount={1}
              >
                {imagePreview ? (
                  <div className="relative w-full h-full">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage();
                      }}
                      className="absolute top-2 left-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-gray-500">
                    <UploadOutlined className="text-2xl mb-2" />
                    <div className="text-sm">انقر لرفع صورة</div>
                    <div className="text-xs text-gray-400 mt-1">اختياري</div>
                  </div>
                )}
              </Upload>
            </Form.Item>

            {imageFile && (
              <Alert
                message="تم اختيار صورة"
                description={`اسم الملف: ${imageFile.name} (${(imageFile.size / 1024 / 1024).toFixed(2)} MB)`}
                type="success"
                showIcon
                className="rounded-lg"
              />
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <Button
                onClick={handleClose}
                size="large"
                className="rounded-lg px-8 border-gray-300 hover:border-gray-400"
              >
                إلغاء
              </Button>
              <Tooltip title="سيتم حذف جميع البيانات المدخلة">
                
              </Tooltip>
            </div>
            
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={create_video_loading}
                disabled={create_video_loading}
                className="rounded-lg px-8 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 border-none shadow-lg shadow-green-200"
                icon={<PlusOutlined />}
              >
                {create_video_loading ? 'جاري الإضافة...' : 'إضافة الفيديو'}
              </Button>
            </Space>
          </div>
        </Form>
      </div>
    </Modal>
  );
}