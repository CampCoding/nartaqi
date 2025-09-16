import { Button, Col, Form, Input, Row } from "antd";
import React from "react";
import {
  PlayCircleOutlined,
  FolderOutlined,
  SettingOutlined,
  LinkOutlined,
} from "@ant-design/icons";

export default function AddCourseResources({videos , setVideos}) {
  const [form] = Form.useForm();

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-200">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          <FolderOutlined className="text-purple-600" />
          المصادر والملفات
        </h3>

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              label={
                <span className="font-semibold text-gray-700 flex items-center gap-2">
                  <LinkOutlined className="text-blue-500" />
                  رابط مجموعة التليجرام
                </span>
              }
              name={["resources", "telegram"]}
            >
              <Input
                placeholder="https://t.me/groupname"
                className="rounded-xl"
                prefix={<LinkOutlined className="text-gray-400" />}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={
                <span className="font-semibold text-gray-700 flex items-center gap-2">
                  <LinkOutlined className="text-green-500" />
                  رابط مجموعة الواتساب
                </span>
              }
              name={["resources", "whatsapp"]}
            >
              <Input
                placeholder="https://chat.whatsapp.com/groupid"
                className="rounded-xl"
                prefix={<LinkOutlined className="text-gray-400" />}
              />
            </Form.Item>
          </Col>
        </Row>


        <div>
          <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <FolderOutlined className="text-blue-600" />
            ملفات إضافية
          </h4>
          <div className="space-y-3">
            {videos.map((v, idx) => (
              <div key={v.id} className="grid grid-cols-1 md:grid-cols-5 gap-3">
                <div className="md:col-span-2">
                  <Input
                    value={v.name}
                    onChange={(e) =>
                      setVideos((arr) =>
                        arr.map((x, i) =>
                          i === idx ? { ...x, name: e.target.value } : x
                        )
                      )
                    }
                    placeholder="اسم الملف"
                    className="rounded-lg"
                  />
                </div>
                <div className="md:col-span-3">
                  <Input
                    type="file"
                    onChange={(e) =>
                      setVideos((arr) =>
                        arr.map((x, i) =>
                          i === idx ? { ...x, url: e.target.value } : x
                        )
                      )
                    }
                    placeholder="رابط الفيديو (يوتيوب/منصة)"
                    className="rounded-lg"
                  />
                </div>
              </div>
            ))}
          </div>
          <Button
            className="mt-3"
            onClick={() =>
              setVideos((arr) => [
                ...arr,
                { id: Date.now(), name: "", url: "" },
              ])
            }
          >
            إضافة ملف
          </Button>
        </div>
      </div>
    </div>
  );
}
