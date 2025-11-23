"use client";
import React, { useState } from "react";
import { Modal, Form, Input, Select, Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { handleCreateBadge, handleGetAllBadges } from "../../../lib/features/badgeSlice";
import { toast } from "react-toastify";

const { TextArea } = Input;
const { Option } = Select;

export default function AddBadgeModal({ open, setOpen, onCreate }) {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const dispatch= useDispatch();
  const {create_badge_loading} = useSelector(state => state?.badges);

  const handleCancel = () => {
    setOpen(false);
    form.resetFields();
    setFileList([]);
  };

  const handleFinish = (values) => {
    const formData = new FormData();

    formData.append("name", values.name);
    formData.append("category", values.category);
    formData.append("description", values.description || "");

    if (fileList[0]?.originFileObj) {
      formData.append("image", fileList[0].originFileObj);
    }

    dispatch(handleCreateBadge({body : formData}))
    .unwrap()
    .then(res => {
      if(res?.data?.status == "success") {
        toast.success(res?.data?.message);
        dispatch(handleGetAllBadges())
        handleCancel()
      }else {
        toast.error(res?.data?.message);
      }
    }).catch(e => {
      console.log(e)
    })
    .finally(() => handleCancel())
    // handleCancel();
  };

  return (
    <Modal
      open={open}
      onCancel={handleCancel}
      onOk={() => form.submit()}
      title="إضافة شارات"
      okText={create_badge_loading ?"loading..." :"حفظ الشارة"}
      okButtonProps={{className:"bg-blue-500 text-white"}}
      cancelText="إلغاء"
      // loading={create_badge_loading}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        style={{ direction: "rtl" }}
      >
        {/* Name */}
        <Form.Item
          label="اسم الشارة"
          name="name"
          rules={[{ required: true, message: "من فضلك أدخل اسم الشارة" }]}
        >
          <Input placeholder="مثال: متفوق الأسبوع" />
        </Form.Item>

        {/* Category */}
        <Form.Item
          label="الفئة"
          name="category"
          rules={[{ required: true, message: "من فضلك اختر الفئة" }]}
        >
          <Select placeholder="اختر الفئة">
            <Option value="gold">ذهبية</Option>
            <Option value="silver">فضية</Option>
            <Option value="bronze">برونزية</Option>
            {/* Add your categories here */}
          </Select>
        </Form.Item>

        {/* Description */}
        <Form.Item label="الوصف" name="description">
          <TextArea required rows={3} placeholder="اكتب وصفًا قصيرًا للشارة" />
        </Form.Item>

        {/* Image */}
        <Form.Item
          label="صورة الشارة"
          name="image"
          rules={[{ required: true, message: "من فضلك قم برفع صورة" }]}
        >
          <Upload
            beforeUpload={() => false} // يمنع الرفع التلقائي
            fileList={fileList}
            maxCount={1}
            onChange={({ fileList: newList }) => setFileList(newList)}
          >
            <Button icon={<UploadOutlined />}>رفع صورة</Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
}
