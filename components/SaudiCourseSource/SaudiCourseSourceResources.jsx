"use client";
import React from "react";
import { FolderOutlined, LinkOutlined } from "@ant-design/icons";
import { Col, Dropdown, Input, Menu, Row, Tooltip } from "antd";
import { Copy, Files, Plus } from "lucide-react";
import Button from "../atoms/Button";

export default function SaudiCourseSourceResources({content , selectedContent , handleContentSelection,setCopyModalVisible}) {
  return (
    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-200 mb-6">
      <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
        <FolderOutlined className="text-purple-600" />
        المصادر والملفات
      </h3>

      <Row gutter={24}>
        <Col span={12}>
          <div className="mb-4">
            <label className="font-semibold text-gray-700 flex items-center gap-2 mb-2">
              <LinkOutlined className="text-blue-500" />
              رابط مجموعة التليجرام
            </label>
            <Input
              value={content.resources.telegram}
              className="rounded-xl"
              prefix={<LinkOutlined className="text-gray-400" />}
              readOnly
            />
          </div>
        </Col>
        <Col span={12}>
          <div className="mb-4">
            <label className="font-semibold text-gray-700 flex items-center gap-2 mb-2">
              <LinkOutlined className="text-green-500" />
              رابط مجموعة الواتساب
            </label>
            <Input
              value={content.resources.whatsapp}
              className="rounded-xl"
              prefix={<LinkOutlined className="text-gray-400" />}
              readOnly
            />
          </div>
        </Col>
      </Row>

      <div>
        <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <FolderOutlined className="text-blue-600" />
          ملفات إضافية
        </h4>
        <div className="space-y-3">
          {content.resources.files.map((file) => (
            <div
              key={file.id}
              className="flex items-center justify-between p-3 bg-white rounded-lg border"
            >
              <div className="flex items-center gap-3">
                <Files className="w-4 h-4 text-blue-500" />
                <span>{file.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Tooltip title="نسخ هذا الملف">
                  <button
                    onClick={() => handleContentSelection("resources")}
                    className={`p-1 rounded ${
                      selectedContent.resources
                        ? "bg-blue-100 text-blue-600"
                        : "text-gray-500"
                    }`}
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </Tooltip>
                <a
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-700"
                >
                  <LinkOutlined />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <Button icon={<Plus className="w-4 h-4" />}>إضافة ملف</Button>

        <Dropdown
          overlay={
            <Menu>
              <Menu.Item
                key="copy-all"
                onClick={() => setCopyModalVisible(true)}
              >
                <div className="flex items-center gap-2">
                  <Copy className="w-4 h-4" />
                  <span>نسخ المحتوى المحدد</span>
                </div>
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item
                key="copy-resources"
                onClick={() => handleContentSelection("resources")}
              >
                <div className="flex items-center gap-2">
                  <Copy className="w-4 h-4" />
                  <span>نسخ المصادر والملفات فقط</span>
                </div>
              </Menu.Item>
            </Menu>
          }
          trigger={["click"]}
          placement="topRight"
        >
          <Button
            type="primary"
            icon={<Copy className="w-4 h-4" />}
            disabled={
              !selectedContent.stages.length &&
              !selectedContent.exams &&
              !selectedContent.resources
            }
          >
            نسخ المحتوى
          </Button>
        </Dropdown>
      </div>
    </div>
  );
}
