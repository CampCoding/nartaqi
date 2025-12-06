import React, { useEffect, useState } from "react";
import {
  Avatar,
  Badge,
  Card,
  Tag,
  Tooltip,
  Typography,
  Space,
  Modal,
  Divider,
  Row,
  Col,
  message,
} from "antd";
import DataTable from "../layout/DataTable";
import { Mail } from "lucide-react";

import Button from "./../atoms/Button";
import {
  EyeOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  CalendarOutlined,
  TrophyOutlined,
} from "@ant-design/icons";

const { Text, Title } = Typography;

const statusLabelAr = (status) => {
  switch (status) {
    case "pending":
      return "قيد المراجعة";
    case "approved":
      return "معتمد";
    case "rejected":
      return "مرفوض";
    default:
      return status;
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case "pending":
      return "orange";
    case "approved":
      return "green";
    case "rejected":
      return "red";
    default:
      return "default";
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case "pending":
      return <ClockCircleOutlined />;
    case "approved":
      return <CheckCircleOutlined />;
    case "rejected":
      return <CloseCircleOutlined />;
    default:
      return null;
  }
};

const getInitials = (name) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

const TeachersTable = ({ searchText, selectedStatus }) => {
  const [teachers, setTeachers] = useState([
    {
      id: 1,
      name: "Ahmed Hassan",
      email: "ahmed.hassan@school.edu",
      phone: "+20 100 123 4567",
      subjects: ["Math", "Physics", "Chemistry", "Biology", "English"],
      status: "pending",
      joinDate: "2024-01-15",
      experience: "5 years",
      qualification: "Masters in Mathematics",
      avatar: null,
    },
    {
      id: 2,
      name: "Nour Adel",
      email: "nour.adel@school.edu",
      phone: "+20 101 234 5678",
      subjects: ["Math", "Biology", "English"],
      status: "approved",
      joinDate: "2023-09-10",
      experience: "8 years",
      qualification: "PhD in Physics",
      avatar: null,
    },
    {
      id: 3,
      name: "Omar Salah",
      email: "omar.salah@school.edu",
      phone: "+20 102 345 6789",
      subjects: ["Biology", "English"],
      status: "rejected",
      joinDate: "2024-02-20",
      experience: "3 years",
      qualification: "Bachelors in Biology",
      avatar: null,
    },
    {
      id: 4,
      name: "Sarah Mohamed",
      email: "sarah.mohamed@school.edu",
      phone: "+20 103 456 7890",
      subjects: ["English"],
      status: "approved",
      joinDate: "2023-11-05",
      experience: "6 years",
      qualification: "Masters in Chemistry",
      avatar: null,
    },
    {
      id: 5,
      name: "Khaled Ali",
      email: "khaled.ali@school.edu",
      phone: "+20 104 567 8901",
      subjects: ["Math", "Physics"],
      status: "pending",
      joinDate: "2024-03-12",
      experience: "4 years",
      qualification: "Bachelors in English Literature",
      avatar: null,
    },
  ]);

  const [filteredTeachers, setFilteredTeachers] = useState(teachers);
  const [loading, setLoading] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);

  const handleStatusChange = (teacherId, newStatus) => {
    setLoading(true);
    setTimeout(() => {
      setTeachers((prevTeachers) =>
        prevTeachers.map((teacher) =>
          teacher.id === teacherId ? { ...teacher, status: newStatus } : teacher
        )
      );
      message.success(
        `تم تغيير حالة المعلم إلى: ${statusLabelAr(newStatus)} بنجاح`
      );
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    let filtered = teachers;

    if (selectedStatus !== "all") {
      filtered = filtered.filter(
        (teacher) => teacher.status === selectedStatus
      );
    }

    if (searchText) {
      const term = searchText.toLowerCase();
      filtered = filtered.filter(
        (teacher) =>
          teacher.name.toLowerCase().includes(term) ||
          teacher.email.toLowerCase().includes(term) ||
          (teacher.subjects || [])
            .join(" ")
            .toLowerCase()
            .includes(term)
      );
    }

    setFilteredTeachers(filtered);
  }, [teachers, selectedStatus, searchText]);

  const handleViewTeacher = (teacher) => {
    setSelectedTeacher(teacher);
    setViewModalVisible(true);
  };

  const columns = [
    {
      title: "المعلم",
      dataIndex: "name",
      key: "name",
      render: (name, record) => (
        <div className="flex items-center gap-3" dir="rtl">
          <Avatar
            size={48}
            className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold"
          >
            {getInitials(name)}
          </Avatar>
          <div>
            <Text className="text-gray-900">{name}</Text>
            <div className="text-sm text-gray-500 flex items-center mt-1">
              <Mail className="ml-1 text-xs" />
              {record.email}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "المواد",
      dataIndex: "subjects",
      key: "subjects",
      render: (subject) => (
        <div className="flex flex-wrap w-full max-w-[240px] gap-2" dir="rtl">
          {subject.map((sub, i) => (
            <Tag
              key={i}
              className="px-3 py-1 w-fit text-xs font-medium border-0"
              style={{
                backgroundColor: "#26829B",
                color: "white",
              }}
            >
              {sub}
            </Tag>
          ))}
        </div>
      ),
    },
    {
      title: "الحالة",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Badge
          status={getStatusColor(status)}
          text={
            <span className="capitalize font-medium">
              {getStatusIcon(status)} {statusLabelAr(status)}
            </span>
          }
        />
      ),
    },
    {
      title: "الخبرة",
      dataIndex: "experience",
      key: "experience",
      render: (experience) => (
        <div className="flex items-center text-gray-700" dir="rtl">
          <TrophyOutlined className="ml-2 text-yellow-500" />
          {experience}
        </div>
      ),
    },
    {
      title: "تاريخ الانضمام",
      dataIndex: "joinDate",
      key: "joinDate",
      render: (date) => (
        <div className="flex items-center text-gray-700" dir="rtl">
          <CalendarOutlined className="ml-2 text-blue-500" />
          {new Date(date).toLocaleDateString("ar-EG")}
        </div>
      ),
    },
    {
      title: "إجراءات",
      key: "actions",
      render: (_, record) => (
        <Space size="small" direction="horizontal" style={{ direction: "rtl" }}>
          <Tooltip title="عرض التفاصيل">
            <Button
              type="primary"
              icon={<EyeOutlined />}
              size="small"
              className="bg-purple-600 !w-fit flex items-center justify-center hover:bg-purple-700 border-purple-600"
              onClick={() => handleViewTeacher(record)}
            />
          </Tooltip>
          {record.status !== "approved" && (
            <Button
              type="primary"
              size="small"
              className="bg-green-600 hover:bg-green-700 border-green-600"
              loading={loading}
              onClick={() => handleStatusChange(record.id, "approved")}
            >
              اعتماد
            </Button>
          )}
          {record.status !== "rejected" && (
            <Button
              danger
              size="small"
              loading={loading}
              onClick={() => handleStatusChange(record.id, "rejected")}
            >
              رفض
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <>
      <Card className="shadow-lg border-0" dir="rtl">
        <DataTable
          searchable={false}
          table={{ header: columns, rows: filteredTeachers }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => (
              <span className="text-gray-600">
                عرض {range[0]}–{range[1]} من {total} معلّمًا
              </span>
            ),
          }}
        />
      </Card>

      {/* View Teacher Modal */}
      <Modal
        title={<div className="text-xl font-semibold text-gray-800">تفاصيل المعلم</div>}
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={null}
        width={700}
        className="teacher-modal"
      >
        {selectedTeacher && (
          <div className="py-6" dir="rtl">
            {/* Header */}
            <div className="text-center mb-8">
              <Avatar
                size={100}
                className="bg-gradient-to-br from-cyan-500 to-purple-600 text-white font-bold text-2xl mb-4"
              >
                {getInitials(selectedTeacher.name)}
              </Avatar>
              <Title level={2} className="mb-2">
                {selectedTeacher.name}
              </Title>
              <Badge
                status={getStatusColor(selectedTeacher.status)}
                text={
                  <span className="capitalize font-medium text-lg">
                    {getStatusIcon(selectedTeacher.status)}{" "}
                    {statusLabelAr(selectedTeacher.status)}
                  </span>
                }
              />
            </div>

            <Divider />

            {/* Info Grid */}
            <Row gutter={[24, 24]} className="mb-8">
              <Col span={12}>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <Text strong className="text-gray-700 flex items-center mb-2">
                    المواد
                  </Text>
                  <div className="flex flex-wrap items-center gap-2">
                    {selectedTeacher.subjects.map((item, i) => (
                      <Tag
                        key={i}
                        className="px-3 py-1 text-sm h-fit w-fit"
                        style={{
                          backgroundColor: "#C9AE6C",
                          color: "white",
                          border: "none",
                        }}
                      >
                        {item}
                      </Tag>
                    ))}
                  </div>
                </div>
              </Col>
              <Col span={12}>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <Text strong className="text-gray-700 mb-2">الخبرة</Text>
                  <Text className="text-lg">{selectedTeacher.experience}</Text>
                </div>
              </Col>
              <Col span={12}>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <Text strong className="text-gray-700 mb-2">
                    البريد الإلكتروني
                  </Text>
                  <Text className="text-sm text-blue-600">
                    {selectedTeacher.email}
                  </Text>
                </div>
              </Col>
              <Col span={12}>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <Text strong className="text-gray-700 mb-2">الهاتف</Text>
                  <Text>{selectedTeacher.phone}</Text>
                </div>
              </Col>
              <Col span={12}>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <Text strong className="text-gray-700 mb-2">
                    تاريخ الانضمام
                  </Text>
                  <Text>
                    {new Date(selectedTeacher.joinDate).toLocaleDateString(
                      "ar-EG"
                    )}
                  </Text>
                </div>
              </Col>
              <Col span={12}>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <Text strong className="text-gray-700 mb-2">المؤهل</Text>
                  <Text>{selectedTeacher.qualification}</Text>
                </div>
              </Col>
            </Row>

            {/* Actions */}
            <div className="text-center gap-4">
              {selectedTeacher.status !== "approved" && (
                <Button
                  type="primary"
                  size="large"
                  className="bg-green-600 hover:bg-green-700 border-green-600 px-8"
                  onClick={() => {
                    handleStatusChange(selectedTeacher.id, "approved");
                    setViewModalVisible(false);
                  }}
                >
                  اعتماد المعلم
                </Button>
              )}
              {selectedTeacher.status !== "rejected" && (
                <Button
                  danger
                  size="large"
                  className="px-8"
                  onClick={() => {
                    handleStatusChange(selectedTeacher.id, "rejected");
                    setViewModalVisible(false);
                  }}
                >
                  رفض المعلم
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default TeachersTable;
