"use client";
import {
  ConfigProvider,
  Form,
  Input,
  Modal,
  Upload,
  Button,
  message,
} from "antd";
import React, { useState } from "react";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";

export default function EditTeamModal({ open, setOpen, rowData, setRowData }) {
  const [form] = Form.useForm();
  const [image, setImage] = useState(null);

  // Handle image upload
  const handleImageChange = (info) => {
    if (info.file.status === "done") {
      setImage(info.file.response.url); // Assuming response contains the URL of the uploaded image
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  // Handle form submission
  const onFinish = (values) => {
    console.log("Form values:", values);
    console.log("Image URL:", image);
    // Do the necessary logic like sending data to the server
    setOpen(false); // Close the modal after submission
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#0F7490",
          borderRadius: 12,
          controlHeight: 44,
        },
      }}
    >
      <Modal
        title={null}
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        width="90%"
        style={{ maxWidth: "1200px" }}
      >
        <div dir="rtl">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-[#0F7490] rounded-lg flex items-center justify-center">
                <PlusOutlined className="text-white text-lg" />
              </div>
              <h1 className="text-3xl font-bold text-[#202938]">إضافة فريق</h1>
            </div>
            <p className="text-gray-600">إضافة فريق </p>
          </div>

          <div className="mx-auto">
            <Form
              form={form}
              onFinish={onFinish}
              layout="vertical"
              initialValues={{
                remember: true,
                name: rowData?.name,
                role: rowData?.role,
                email: rowData?.email,
                phone: rowData?.phone,
              }}
            >
              <Form.Item
                label="الاسم"
                name="name"
                rules={[{ required: true, message: "يرجى إدخال الاسم" }]}
              >
                <Input placeholder="Please Enter Name" />
              </Form.Item>

              <Form.Item
                label="الايميل"
                name="email"
                rules={[{ required: true, message: "يرجى إدخال الايميل" }]}
              >
                <Input placeholder="Please Enter Email" />
              </Form.Item>

              <Form.Item
                label="الهاتف"
                name="phone"
                rules={[{ required: true, message: "يرجى إدخال الهاتف" }]}
              >
                <Input placeholder="Please Enter Phone" />
              </Form.Item>

              <Form.Item
                label="الوظيفه"
                name="role"
                rules={[{ required: true, message: "يرجى إدخال الوظيفة" }]}
              >
                <Input placeholder="Please Enter Role" />
              </Form.Item>

              <Form.Item
                label="صورة"
                name="image"
                rules={[{ required: true, message: "يرجى رفع صورة" }]}
              >
                <Upload
                  name="file"
                  action="/upload" // Add your upload URL here
                  listType="picture"
                  onChange={handleImageChange}
                  showUploadList={false}
                >
                  <Button icon={<UploadOutlined />}>Click to Upload</Button>
                </Upload>
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  className="!bg-primary  !text-white"
                  htmlType="submit"
                >
                  إضافة الفريق
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </Modal>
    </ConfigProvider>
  );
}
