"use client";
import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Select, Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";

import { toast } from "react-toastify";
import { handleEditBadge, handleGetAllBadges } from "../../../lib/features/badgeSlice";

const { TextArea } = Input;
const { Option } = Select;

export default function EditBadgeModal({ open, setOpen, rowData, onCreate }) {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const dispatch = useDispatch();
  const { edit_badge_loading } = useSelector(
    (state) => state?.badges
  );

  // Set initial form values when the modal opens
 useEffect(() => {
  if (rowData) {
    form.setFieldsValue({
      name: rowData?.name,
      category: rowData?.category,
      description: rowData?.description,
    });
    
    // Check if image exists in rowData and set the fileList accordingly
    if (rowData?.imageUrl) {
      setFileList([{ url: rowData?.imageUrl }]); // Set the image URL in fileList
    }
  }
}, [rowData, form]);

useEffect(() => {
  console.log(fileList , rowData)
} , [fileList , rowData])


  const handleCancel = () => {
    setOpen(false);
    form.resetFields();
    setFileList([]);
  };

  const handleFinish = (values) => {
    const formData = new FormData();
    formData.append("id" , rowData?.id)
    formData.append("name", values.name);
    formData.append("category", values.category);
    formData.append("description", values.description || "");

    if (fileList[0]?.originFileObj) {
      formData.append("image", fileList[0].originFileObj);
    }else {
      formData.append("image",  rowData?.imageUrl)
    }

    if (rowData) {
      // If rowData exists, it's an edit, so we update the badge
      dispatch(handleEditBadge({ body: formData }))
        .unwrap()
        .then((res) => {
          console.log(res);
          if (res?.data?.status === "success") {
            toast.success(res?.data?.message);
            dispatch(handleGetAllBadges());
            handleCancel();
          } else {
            toast.error(res?.data?.message);
          }
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      // If no rowData exists, it's a creation, so we create the badge
      dispatch(handleEditBadge({ body: formData }))
        .unwrap()
        .then((res) => {
          if (res?.data?.status === "success") {
            toast.success(res?.data?.message);
            dispatch(handleGetAllBadges());
            handleCancel();
          } else {
            toast.error(res?.data?.message);
          }
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  return (
    <Modal
      open={open}
      onCancel={handleCancel}
      onOk={() => form.submit()}
      title={ "تعديل الشارة" }
      okText={edit_badge_loading ? "جاري الحفظ..." : "حفظ الشارة"}
      okButtonProps={{ className: "bg-blue-500 text-white" }}
      cancelText="إلغاء"
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
          <TextArea rows={3} placeholder="اكتب وصفًا قصيرًا للشارة" />
        </Form.Item>

        {/* Image */}
        <Form.Item
          label="صورة الشارة"
          name="image"
          rules={rowData?.imageUrl ? [] : [{ required: true, message: "من فضلك قم برفع صورة" }]} // Remove required if image exists in rowData
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
