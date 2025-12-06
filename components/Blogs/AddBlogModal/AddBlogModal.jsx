"use client";
import React, { useEffect, useMemo, useState } from "react";
import {
  ConfigProvider,
  Modal,
  Form,
  Input,
  DatePicker,
  InputNumber,
  Upload,
  Button,
  Divider,
  message,
  Select,
} from "antd";
import dayjs from "dayjs";
import { PlusOutlined, UploadOutlined, SendOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { handleAddBlog, handleGetAllBlogs } from "@/lib/features/blogSlice";
import { toast } from "react-toastify";

export default function AddBlogModal({ open, blogsData, setOpen, onSubmit, palette }) {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [fileList, setFileList] = useState([]);
  const dispatch = useDispatch();
  const {add_blog_loading , blogs_data , blogs_loading} = useSelector(state => state?.blogs);
  const [allBlogsOptions , setALlBlogsOptions] = useState([]);

  useEffect(() => {
    setALlBlogsOptions(blogs_data?.data?.message?.map(item => ({label: item?.title , value:item?.id})))
  } , [blogs_data])

  const PALETTE = useMemo(
    () => ({
      primary: (palette && palette.primary) || "#0F7490",
      text: (palette && palette.text) || "#202938",
      background: (palette && palette.background) || "#F9FAFC",
    }),
    [palette]
  );

  const handleClose = () => {
    form.resetFields();
    setFileList([]);
    setOpen(false);
  };

  const normalizeUpload = ({ fileList: fl }) => fl;

  const onFinish = async (values) => {
    try {
      const formData = new FormData();
      
      // Append the actual file if exists (use originFileObj, not thumbUrl)
      if (fileList && fileList.length > 0 && fileList[0].originFileObj) {
        formData.append("image", fileList[0].originFileObj);
      }
      
      // Append other form fields
      formData.append("title", values?.title?.trim());
      formData.append("content", values?.desc?.trim());
      if(values?.related_blogs && Array.isArray(values?.related_blogs) && values?.related_blogs?.length > 0) {
        formData.append("related_blogs_ids", values?.related_blogs?.join(","))
      }

      const res = await dispatch(handleAddBlog({ body: formData })).unwrap();
      // console.log(res);
      if(res?.data?.status == "success") {
        toast.success(res?.data?.message);
        dispatch(handleGetAllBlogs());
handleClose()
      }
     else {
      toast.error(res?.data?.message)
     }
    } catch (error) {
      console.error("Error adding blog:", error);
      message.error("حدث خطأ أثناء إضافة المقال");
    }
  };

  return (
    <ConfigProvider
      direction="rtl"
      theme={{
        token: {
          colorPrimary: PALETTE.primary,
          borderRadius: 14,
          colorText: PALETTE.text,
          controlHeight: 44,
        },
      }}
    >
      <Modal
        open={open}
        onCancel={handleClose}
        title={null}
        footer={null}
        className="!w-full max-w-3xl"
      >
        <div className="bg-white" dir="rtl">
          {/* Header */}
          <div className="mb-3">
            <div className="flex items-center gap-3 mb-1">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ background: PALETTE.primary }}
              >
                <PlusOutlined className="text-white text-lg" />
              </div>
              <h2 className="text-2xl font-bold" style={{ color: PALETTE.text }}>
                إضافة مقال جديد
              </h2>
            </div>
            <p className="text-sm text-gray-500">أدخل بيانات المقال ثم اضغط “إضافة”.</p>
          </div>

          <Divider className="my-4" />

          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{
              date: dayjs(),
              comments: 0,
              views: 0,
            }}
          >
            <Form.Item
              label="العنوان"
              name="title"
              rules={[{ required: true, message: "الرجاء إدخال العنوان" }]}
            >
              <Input placeholder="مثال: كيف تحسن مهارة الكتابة العربية؟" />
            </Form.Item>

            <Form.Item
              label="الوصف المختصر"
              name="desc"
              rules={[{ required: true, message: "الرجاء إدخال الوصف" }]}
            >
              <Input.TextArea placeholder="نبذة قصيرة عن المقال…" autoSize={{ minRows: 3, maxRows: 6 }} />
            </Form.Item>

              <Form.Item
              label="المقالات ذات الصلة"
              name="related_blogs"
              rules={[{ required: true, message: "الرجاء  اختيار مقالة" }]}
            >
             <Select options={allBlogsOptions}
             mode="multiple"
             ></Select>
            </Form.Item>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* <Form.Item label="تاريخ النشر" name="date">
                <DatePicker className="w-full" />
              </Form.Item> */}

              {/* <Form.Item label="رابط الصورة (اختياري)" name="imageUrl" rules={[{ type: "url", message: "الرابط غير صالح" }]}>
                <Input placeholder="https://example.com/image.jpg" />
              </Form.Item> */}
            </div>

            <Form.Item
              label="رفع صورة الغلاف (اختياري)"
              name="imageUpload"
              valuePropName="fileList"
              getValueFromEvent={normalizeUpload}
              extra="سيتم رفع الصورة مع البيانات عند الضغط على إضافة."
            >
              <Upload.Dragger
                name="file"
                fileList={fileList}
                maxCount={1}
                accept="image/*"
                beforeUpload={() => false} // منع الرفع التلقائي - سنرسل الملف يدوياً
                onChange={({ fileList }) => setFileList(fileList)}
              >
                <p className="ant-upload-drag-icon">
                  <UploadOutlined />
                </p>
                <p className="ant-upload-text">اسحب وأفلت الصورة هنا أو اضغط للاختيار</p>
                <p className="ant-upload-hint">يدعم JPG, PNG, WEBP (ملف واحد).</p>
              </Upload.Dragger>
            </Form.Item>

            

            {/* Footer actions */}
            <div className="flex items-center justify-end gap-3">
              <Button onClick={handleClose}>إلغاء</Button>
              <Button
                type="primary"
                className="bg-primary text-white"
                icon={<SendOutlined />}
                loading={add_blog_loading}
                onClick={() => form.submit()}
              >
                إضافة
              </Button>
            </div>
          </Form>
        </div>
      </Modal>
    </ConfigProvider>
  );
}
