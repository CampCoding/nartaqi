"use client";

import React, { useState } from "react";
import {
  Trash2,
  Bell,
  Users,
  GraduationCap,
  Calendar,
  Search,
  Filter,
  Plus,
} from "lucide-react";
import {
  Table,
  Button,
  Input,
  Select,
  Card,
  Row,
  Col,
  Tag,
  Space,
  Typography,
  Statistic,
  Modal,
  Form,
  DatePicker,
  message,
  Popconfirm,
  Badge,
  Tooltip,
} from "antd";

import {
  BellOutlined,
  DeleteOutlined,
  SearchOutlined,
  FilterOutlined,
  PlusOutlined,
  TeamOutlined,
  UserOutlined,
  CalendarOutlined,
  ExclamationCircleOutlined,
  BookOutlined,
  NotificationOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { Option } = Select;

const NotificationManager = () => {
  const [notifications, setNotifications] = useState([
    {
      key: "1",
      id: 1,
      message: "New exam has been published: Algebra Basics",
      target: "All Students",
      date: "2025-07-28",
      type: "exam",
      priority: "high",
      status: "sent",
    },
    {
      key: "2",
      id: 2,
      message: "Physics question bank updated",
      target: "All Teachers",
      date: "2025-07-26",
      type: "update",
      priority: "medium",
      status: "sent",
    },
    {
      key: "3",
      id: 3,
      message: "Reminder: Final exam next week",
      target: "Students - Math",
      date: "2025-07-25",
      type: "reminder",
      priority: "high",
      status: "draft",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const deleteNotification = (id) => {
    setNotifications(notifications.filter((notif) => notif.id !== id));
    message.success("Notification deleted successfully");
  };

  const handleAddNotification = (values) => {
    const newNotification = {
      key: Date.now().toString(),
      id: Date.now(),
      message: values.message,
      target: values.target,
      date: values.date.format("YYYY-MM-DD"),
      type: values.type,
      priority: values.priority,
      status: "draft",
    };
    setNotifications([newNotification, ...notifications]);
    setIsModalVisible(false);
    form.resetFields();
    message.success("Notification created successfully");
  };

  const getTargetIcon = (target) => {
    if (target.includes("Students"))
      return <UserOutlined style={{ color: "#8B5CF6" }} />;
    if (target.includes("Teachers"))
      return <TeamOutlined style={{ color: "#C9AE6C" }} />;
    return <BellOutlined style={{ color: "#0F7490" }} />;
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "error";
      case "medium":
        return "warning";
      case "low":
        return "success";
      default:
        return "default";
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "exam":
        return <BookOutlined />;
      case "update":
        return <NotificationOutlined />;
      case "reminder":
        return <CalendarOutlined />;
      default:
        return <BellOutlined />;
    }
  };

  const filteredNotifications = notifications.filter((notif) => {
    const matchesSearch =
      notif.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notif.target.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || notif.type === filterType;
    const matchesPriority =
      filterPriority === "all" || notif.priority === filterPriority;
    return matchesSearch && matchesType && matchesPriority;
  });

  const columns = [
    {
      title: "Message",
      dataIndex: "message",
      key: "message",
      width: "40%",
      render: (text, record) => (
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-1">
            <Tag
              className={`type-${record.type}`}
              icon={getTypeIcon(record.type)}
            >
              {record.type.charAt(0).toUpperCase() + record.type.slice(1)}
            </Tag>
          </div>
          <div className="min-w-0 flex-1">
            <Text strong style={{ color: "#202938" }}>
              {text}
            </Text>
            <div className="mt-1">
              <Badge
                status={record.status === "sent" ? "success" : "processing"}
                text={
                  record.status.charAt(0).toUpperCase() + record.status.slice(1)
                }
              />
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Target",
      dataIndex: "target",
      key: "target",
      width: "20%",
      render: (text) => (
        <div className="flex items-center gap-2">
          {getTargetIcon(text)}
          <span style={{ color: "#202938" }}>{text}</span>
        </div>
      ),
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      width: "15%",
      render: (text) => (
        <div className="flex items-center gap-2">
          <CalendarOutlined style={{ color: "#9ca3af" }} />
          <span className="text-gray-600">{text}</span>
        </div>
      ),
    },
    {
      title: "Priority",
      dataIndex: "priority",
      key: "priority",
      width: "10%",
      render: (priority) => (
        <Tag color={getPriorityColor(priority)} className="font-medium">
          {priority.charAt(0).toUpperCase() + priority.slice(1)}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: "15%",
      render: (_, record) => (
        <Space>
          <Tooltip title="Delete notification">
            <Popconfirm
              title="Delete notification"
              description="Are you sure you want to delete this notification?"
              icon={<ExclamationCircleOutlined style={{ color: "red" }} />}
              onConfirm={() => deleteNotification(record.id)}
              okText="Yes"
              cancelText="No"
            >
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                size="small"
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  const stats = [
    {
      title: "Total Notifications",
      value: notifications.length,
      icon: <BellOutlined style={{ fontSize: 24, color: "#0F7490" }} />,
      color: "#0F7490",
    },
    {
      title: "High Priority",
      value: notifications.filter((n) => n.priority === "high").length,
      icon: (
        <ExclamationCircleOutlined style={{ fontSize: 24, color: "#dc2626" }} />
      ),
      color: "#dc2626",
    },
    {
      title: "Student Notifications",
      value: notifications.filter((n) => n.target.includes("Students")).length,
      icon: <UserOutlined style={{ fontSize: 24, color: "#8B5CF6" }} />,
      color: "#8B5CF6",
    },
    {
      title: "Teacher Notifications",
      value: notifications.filter((n) => n.target.includes("Teachers")).length,
      icon: <TeamOutlined style={{ fontSize: 24, color: "#C9AE6C" }} />,
      color: "#C9AE6C",
    },
  ];

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: "#F9FAFC" }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div
                className="p-3 rounded-lg"
                style={{ backgroundColor: "#0F7490" }}
              >
                <BellOutlined style={{ fontSize: 24, color: "white" }} />
              </div>
              <div>
                <Title level={2} style={{ color: "#202938", margin: 0 }}>
                  Manage Notifications
                </Title>
                <Text type="secondary">
                  Send and manage notifications to students and teachers
                </Text>
              </div>
            </div>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              size="large"
              className="custom-accent-btn"
              onClick={() => setIsModalVisible(true)}
            >
              New Notification
            </Button>
          </div>

          {/* Statistics Cards */}
          <Row gutter={[16, 16]} className="mb-6">
            {stats.map((stat, index) => (
              <Col xs={24} sm={12} lg={6} key={index}>
                <Card className="stat-card h-full">
                  <div className="flex items-center justify-between">
                    <div>
                      <Text type="secondary" className="text-sm">
                        {stat.title}
                      </Text>
                      <div
                        className="text-2xl font-bold mt-1"
                        style={{ color: stat.color }}
                      >
                        {stat.value}
                      </div>
                    </div>
                    <div className="flex-shrink-0">{stat.icon}</div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Search and Filters */}
          <Card className="mb-6">
            <Row gutter={[16, 16]} align="middle">
              <Col xs={24} md={12}>
                <Input
                  placeholder="Search notifications..."
                  prefix={<SearchOutlined />}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  size="large"
                />
              </Col>
              <Col xs={12} md={6}>
                <Select
                  placeholder="Filter by type"
                  value={filterType}
                  onChange={setFilterType}
                  size="large"
                  className="w-full"
                  suffixIcon={<FilterOutlined />}
                >
                  <Option value="all">All Types</Option>
                  <Option value="exam">Exams</Option>
                  <Option value="update">Updates</Option>
                  <Option value="reminder">Reminders</Option>
                </Select>
              </Col>
              <Col xs={12} md={6}>
                <Select
                  placeholder="Filter by priority"
                  value={filterPriority}
                  onChange={setFilterPriority}
                  size="large"
                  className="w-full"
                >
                  <Option value="all">All Priorities</Option>
                  <Option value="high">High</Option>
                  <Option value="medium">Medium</Option>
                  <Option value="low">Low</Option>
                </Select>
              </Col>
            </Row>
          </Card>
        </div>

        {/* Notifications Table */}
        <Card>
          <Table
            columns={columns}
            dataSource={filteredNotifications}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} notifications`,
            }}
            className="notification-table"
            locale={{
              emptyText: (
                <div className="text-center py-8">
                  <BellOutlined
                    style={{ fontSize: 48, color: "#d1d5db", marginBottom: 16 }}
                  />
                  <div>No notifications found</div>
                </div>
              ),
            }}
          />
        </Card>

        {/* Add Notification Modal */}
        <Modal
          title={
            <div className="flex items-center gap-2">
              <PlusOutlined style={{ color: "#8B5CF6" }} />
              Create New Notification
            </div>
          }
          open={isModalVisible}
          onCancel={() => {
            setIsModalVisible(false);
            form.resetFields();
          }}
          footer={null}
          width={600}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleAddNotification}
            className="mt-4"
          >
            <Form.Item
              name="message"
              label="Notification Message"
              rules={[
                {
                  required: true,
                  message: "Please enter notification message",
                },
              ]}
            >
              <Input.TextArea
                rows={3}
                placeholder="Enter your notification message..."
              />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="target"
                  label="Target Audience"
                  rules={[
                    {
                      required: true,
                      message: "Please select target audience",
                    },
                  ]}
                >
                  <Select placeholder="Select target audience">
                    <Option value="All Students">All Students</Option>
                    <Option value="All Teachers">All Teachers</Option>
                    <Option value="Students - Math">Students - Math</Option>
                    <Option value="Students - Physics">
                      Students - Physics
                    </Option>
                    <Option value="Students - Chemistry">
                      Students - Chemistry
                    </Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="date"
                  label="Date"
                  rules={[{ required: true, message: "Please select date" }]}
                >
                  <DatePicker className="w-full" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="type"
                  label="Type"
                  rules={[{ required: true, message: "Please select type" }]}
                >
                  <Select placeholder="Select notification type">
                    <Option value="exam">Exam</Option>
                    <Option value="update">Update</Option>
                    <Option value="reminder">Reminder</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="priority"
                  label="Priority"
                  rules={[
                    { required: true, message: "Please select priority" },
                  ]}
                >
                  <Select placeholder="Select priority">
                    <Option value="high">High</Option>
                    <Option value="medium">Medium</Option>
                    <Option value="low">Low</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item className="mb-0 text-right">
              <Space>
                <Button
                  onClick={() => {
                    setIsModalVisible(false);
                    form.resetFields();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="custom-accent-btn"
                >
                  Create Notification
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default NotificationManager;
