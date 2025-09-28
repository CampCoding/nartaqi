"use client";

import React, { useState } from "react";
import {
  Card,
  Col,
  InputNumber,
  Row,
  Select,
  Space,
  Switch,
  TimePicker,
  Form,
  DatePicker,
  Badge,
} from "antd";
import Button from "@/components/atoms/Button";
import {
  PlusOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  SettingOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

/* ===== Helpers for safe formatting ===== */
const fmtTime = (t) => (typeof t === "string" ? t : t?.format?.("HH:mm") ?? "");
const fmtDate = (d) => (typeof d === "string" ? d : d?.format?.("YYYY-MM-DD") ?? "");

/* ===== Single Schedule Card ===== */
const CourseScheduleCard = ({ schedule, onUpdate, onRemove, index }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm] = Form.useForm();

  const handleSave = (values) => {
    onUpdate(index, values);
    setIsEditing(false);
  };

  return (
    <Card
      size="small"
      className="mb-3 hover:shadow-md transition-shadow duration-300 border-l-4 border-l-blue-500"
      extra={
        <Space>
          <Button
            type="text"
            size="small"
            onClick={() => setIsEditing(!isEditing)}
            icon={<SettingOutlined />}
          />
          <Button
            type="text"
            size="small"
            danger
            onClick={() => onRemove(index)}
            icon={<DeleteOutlined />}
          />
        </Space>
      }
    >
      {!isEditing ? (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <CalendarOutlined className="text-blue-500" />
            <span className="font-medium">
              {fmtDate(schedule.date) || schedule.day || "—"}
            </span>
            <Badge
              status={schedule.isActive ? "processing" : "default"}
              text={schedule.isActive ? "نشط" : "متوقف"}
            />
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <ClockCircleOutlined />
              {fmtTime(schedule.startTime)} — {fmtTime(schedule.endTime)}
            </span>
            {schedule.maxStudents ? (
              <span className="flex items-center gap-1">
                <TeamOutlined />
                {schedule.maxStudents} طالب كحد أقصى
              </span>
            ) : null}
          </div>
        </div>
      ) : (
        <Form
          form={editForm}
          layout="vertical"
          initialValues={schedule}
          onFinish={handleSave}
          className="mb-0"
        >
          <Row gutter={16}>
            <Col xs={24} md={8}>
              
            </Col>
            <Col xs={24} md={8}>
              <Form.Item name="date" label="التاريخ" className="mb-2">
                <DatePicker format="YYYY-MM-DD" className="w-full" />
              </Form.Item>
            </Col>
            <Col xs={12} md={4}>
              <Form.Item name="startTime" label="بداية" className="mb-2">
                <TimePicker format="HH:mm" className="w-full" />
              </Form.Item>
            </Col>
            <Col xs={12} md={4}>
              <Form.Item name="endTime" label="نهاية" className="mb-2">
                <TimePicker format="HH:mm" className="w-full" />
              </Form.Item>
            </Col>

            {/* <Col xs={12} md={4}>
              <Form.Item name="isActive" valuePropName="checked" label="الحالة" className="mb-2">
                <Switch checkedChildren="نشط" unCheckedChildren="متوقف" />
              </Form.Item>
            </Col> */}
          </Row>

         
          <div className="flex justify-end gap-2">
            <Button size="small" onClick={() => setIsEditing(false)}>
              إلغاء
            </Button>
            <Button size="small" type="primary" htmltype="submit">
              حفظ
            </Button>
          </div>
        </Form>
      )}
    </Card>
  );
};

/* ===== Wrapper (Add / List) ===== */
export default function AddCourseSourceShedule({
  schedules,
  newSchedule,
  setNewSchedule,
  handleAddSchedule,
  handleRemoveSchedule,
  handleUpdateSchedule,
  rowData , setRowData
}) {
  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          <CalendarOutlined className="text-blue-600" />
          إدارة مواعيد الدورة
        </h3>

        {/* Add New Schedule Form */}
        <Card
          title="إضافة موعد جديد"
          className="mb-6 shadow-sm border-dashed"
          headStyle={{ backgroundColor: "#f8fafc" }}
        >
          <Row gutter={16}>
           

            <Col xs={24} md={6}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  التاريخ *
                </label>
                <DatePicker
                  value={newSchedule.date}
                  onChange={(date) => setNewSchedule({ ...newSchedule, date })}
                  format="YYYY-MM-DD"
                  className="w-full rounded-xl"
                  placeholder="اختر التاريخ"
                />
              </div>
            </Col>

            <Col xs={24} md={6}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  وقت البداية *
                </label>
                <TimePicker
                  value={newSchedule.startTime}
                  onChange={(time) => setNewSchedule({ ...newSchedule, startTime: time })}
                  format="HH:mm"
                  className="w-full rounded-xl"
                  placeholder="وقت البداية"
                />
              </div>
            </Col>

            <Col xs={24} md={6}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  وقت النهاية *
                </label>
                <TimePicker
                  value={newSchedule.endTime}
                  onChange={(time) => setNewSchedule({ ...newSchedule, endTime: time })}
                  format="HH:mm"
                  className="w-full rounded-xl"
                  placeholder="وقت النهاية"
                />
              </div>
            </Col>

            {/* <Col xs={24} md={6}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الحالة
                </label>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={newSchedule.isActive}
                    onChange={(checked) => setNewSchedule({ ...newSchedule, isActive: checked })}
                    checkedChildren="نشط"
                    unCheckedChildren="متوقف"
                  />
                </div>
              </div>
            </Col> */}
          </Row>

         
          <div className="flex items-center justify-between">
            <div />
            <Button
              type="primary"
              onClick={handleAddSchedule}
              disabled={
                !newSchedule.date ||
                !newSchedule.startTime ||
                !newSchedule.endTime
              }
              className="rounded-xl"
              icon={<PlusOutlined />}
            >
              إضافة الموعد
            </Button>
          </div>
        </Card>

        {/* Schedules List */}
        <div>
          <h4 className="text-lg font-semibold text-gray-800 mb-4">المواعيد المضافة</h4>
          {schedules.length === 0 ? (
            <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-xl">
              <CalendarOutlined className="text-4xl mb-3 text-gray-300" />
              <p>لم يتم إضافة أي مواعيد بعد</p>
            </div>
          ) : (
            <div className="space-y-3">
              {schedules.map((schedule, index) => (
                <CourseScheduleCard
                  key={index}
                  schedule={schedule}
                  onUpdate={handleUpdateSchedule}
                  onRemove={handleRemoveSchedule}
                  index={index}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
