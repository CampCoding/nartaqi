"use client";
import {
  ConfigProvider,
  Form,
  Input,
  Modal,
  Upload,
  Button,
  message,
  Select,
} from "antd";
import React, { useState, useEffect } from "react";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  handleUpdateTeamMember,
  handleGetAllTeams,
} from "@/lib/features/teamSlice";
import { toast } from "react-toastify";

export default function EditTeamModal({ open, setOpen, rowData, setRowData }) {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const dispatch = useDispatch();
  const { update_team_loading } = useSelector((state) => state?.team);

  // Set initial form values when the modal opens
  useEffect(() => {
    if (rowData) {
      form.setFieldsValue({
        name: rowData?.name,
        email: rowData?.email,
        role: rowData?.role,
        category: rowData?.category,
      });
      setFileList(rowData?.image ? [{ url: rowData?.image }] : []); // Set image if exists
    }
  }, [rowData, form]);

  const handleClose = () => {
    form.resetFields();
    setFileList([]);
    setOpen(false);
  };

  // Handle image change
  const handleImageChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const onFinish = async (values) => {
    const formData = new FormData();
    formData.append("id", rowData?.id);
    formData.append("name", values?.name);
    formData.append("email", values?.email);
    formData.append("role", values?.role);
    formData.append("category", values?.category);

    // If a new image is uploaded, append it to the form data
    if (fileList?.[0]?.originFileObj) {
      formData.append("image", fileList[0].originFileObj); // Append new image if selected
    } else if (rowData?.image) {
      // If no new image, send the existing image URL as a string
      formData.append("image", rowData?.image);
    }

    try {
      const res = await dispatch(
        handleUpdateTeamMember({ body: formData })
      ).unwrap();
      if (res?.data?.status === "success") {
        toast.success(res?.data?.message || "تم تحديث عضو الفريق بنجاح");
        handleClose();
        dispatch(handleGetAllTeams());
      } else {
        toast.error(res?.data?.message || "حدث خطأ أثناء التحديث");
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء التحديث");
      console.error("Update team member failed:", error);
    }
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
              <h1 className="text-3xl font-bold text-[#202938]">تعديل فريق</h1>
            </div>
            <p className="text-gray-600">تعديل فريق</p>
          </div>

          <div className="mx-auto">
            <Form
              form={form}
              onFinish={onFinish}
              layout="vertical"
              initialValues={{ remember: true }}
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
                label="الوظيفة"
                name="role"
                rules={[{ required: true, message: "يرجى إدخال الوظيفة" }]}
              >
                <Input placeholder="Please Enter Role" />
              </Form.Item>

              <Form.Item
                label="الفئة"
                name="category"
                rules={[{ required: true, message: "يرجى إدخال الفئة" }]}
              >
                <Select
                  options={[
                    { label: "ادمن", value: "administrators" },
                    { label: "فني", value: "technicians" },
                    { label: "الدعم الفني", value: "technical_support" },
                    { label: "ادخال بيانات", value: "data_entry" },
                  ]}
                ></Select>
              </Form.Item>

              <Form.Item
                label="صورة"
                name="image"
                rules={rowData?.image ? [] : [{ required: true, message: "يرجى رفع صورة" }]} // Remove required if image exists in rowData
              >
                <Upload
                  name="file"
                  listType="picture"
                  beforeUpload={() => false}
                  onChange={handleImageChange}
                  fileList={fileList}
                >
                  <Button icon={<UploadOutlined />}>رفع الصورة</Button>
                </Upload>
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  className="!bg-primary !text-white"
                  htmlType="submit"
                  loading={update_team_loading}
                >
                  تحديث الفريق
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </Modal>
    </ConfigProvider>
  );
}
