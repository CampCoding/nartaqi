"use client";
import React, { useState } from "react";
import {
  Button,
  ConfigProvider,
  DatePicker,
  Form,
  Input,
  Modal,
  Upload,
} from "antd";
import {
  PlusOutlined,
  BookOutlined,
  FileTextOutlined,
  InboxOutlined,
  DeleteOutlined,
  PlayCircleOutlined,
} from "@ant-design/icons";

import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });


const { Dragger } = Upload;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ align: ["", "center", "right", "justify"] }],
    [{ direction: "rtl" }],
    [{ color: [] }, { background: [] }],
    ["link", "blockquote", "code-block"],
    ["clean"],
  ],
};

const quillFormats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "list",    // Add "list" to ensure list formats are available
  "bullet",  // Make sure bullet is included
  "align",
  "direction",
  "color",
  "background",
  "link",
  "blockquote",
  "code-block",
];

const RichTextField = ({ value, onChange, placeholder }) => (
  <div dir="rtl">
    <ReactQuill
      className="ql-rtl"
      theme="snow"
      value={value}
      onChange={(html) => onChange?.(html)}
      modules={quillModules}
      formats={quillFormats}
      placeholder={placeholder}
    />
  </div>
);

export default function AddPrivacyPolicyModal({ open, setOpen }) {
  const [form] = Form.useForm();
  const [loading , setLoading] =useState(false);
  const handleReset = () => {
    form.resetFields();
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
         <div className="bg-[#F9FAFC]" dir="rtl">
          <div className="mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-[#0F7490] rounded-lg flex items-center justify-center">
                  <PlusOutlined className="text-white text-lg" />
                </div>
                <h1 className="text-3xl font-bold text-[#202938]">
                  إضافة شروط وأحكام  
                </h1>
              </div>
              <p className="text-gray-600">إضافة شروط وأحكام للدوره التعليمية الجديدة</p>
            </div>

            <div className="bg-white border-0 rounded-2xl overflow-hidden p-6">
              <Form
                form={form}
                layout="vertical"
                className="space-y-6"
              >
            
             
                {/* Rich Text Section */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="text-xl font-semibold text-[#202938] mb-4">
                    المحتوى التفصيلي
                  </h3>

                    <Form.Item
                        label="الشروط والأحكام"
                        name="privacy-policy"
                        valuePropName="value"
                        getValueFromEvent={(v) => v}
                      >
                        <RichTextField placeholder="اكتب....." />
                      </Form.Item>
                </div>

                

                {/* Actions */}
                <div className="border-t border-gray-200 pt-6">
                  <div className="flex justify-end gap-4">
                    <Button
                      type="default"
                      onClick={handleReset}
                      className="px-8 py-3 text-gray-700 border border-gray-300 rounded-lg hover:border-gray-400"
                    >
                      إعادة ضبط
                    </Button>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={loading}
                      className="px-8 py-3 bg-[#0F7490] text-white rounded-lg hover:!bg-[#0d5f75]"
                      icon={!loading ? <PlusOutlined /> : undefined}
                    >
                      {loading ? "جارٍ الإضافة..." : "إضافة الدورة"}
                    </Button>
                  </div>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </Modal>
    </ConfigProvider>
  );
}
