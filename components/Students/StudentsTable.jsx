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
  Grid,
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
  PhoneOutlined,
  UserOutlined,
} from "@ant-design/icons";

const { Text, Title } = Typography;
const { useBreakpoint } = Grid;

/* ---------- Helpers ---------- */
const statusLabelAr = (status) => {
  switch (status) {
    case "pending":
      return "قيد المراجعة";
    case "approved":
      return "نشط";
    case "rejected":
      return "محظور";
    default:
      return status;
  }
};

// antd Badge statuses: success | processing | default | error | warning
const getStatusColor = (status) => {
  switch (status) {
    case "pending":
      return "warning";
    case "approved":
      return "success";
    case "rejected":
      return "error";
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

const getInitials = (name = "") =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

const StudentsTable = ({ searchText = "", selectedStatus = "all" }) => {
  // بيانات طلاب تجريبية (نفس البنية المستخدمة في صفحات الإدارة عندك)
  const [students, setStudents] = useState([
    {
      id: 1,
      name: "Youssef Ibrahim",
      email: "youssef.ibr@school.edu",
      phone: "+20 100 111 2233",
      subjects: ["Math (G9)", "English", "Biology"],
      status: "approved",
      joinDate: "2024-09-10",
      experience: "معدل حضور: 92%",
      qualification: "الصف التاسع - قسم A",
      avatar: null,
    },
    {
      id: 2,
      name: "Mariam Tarek",
      email: "mariam.tarek@school.edu",
      phone: "+20 101 222 3344",
      subjects: ["Physics (G10)", "Chemistry", "English"],
      status: "pending",
      joinDate: "2025-02-01",
      experience: "معدل حضور: 86%",
      qualification: "الصف العاشر - قسم B",
      avatar: null,
    },
    {
      id: 3,
      name: "Omar Salah",
      email: "omar.salah@school.edu",
      phone: "+20 102 333 4455",
      subjects: ["History (G8)", "Arabic"],
      status: "approved",
      joinDate: "2023-11-20",
      experience: "معدل حضور: 95%",
      qualification: "الصف الثامن - قسم C",
      avatar: null,
    },
    {
      id: 4,
      name: "Hana Mohamed",
      email: "hana.mohamed@school.edu",
      phone: "+20 103 444 5566",
      subjects: ["Math (G7)", "Science", "Computer"],
      status: "rejected",
      joinDate: "2024-01-05",
      experience: "معدل حضور: 61%",
      qualification: "الصف السابع - قسم A",
      avatar: null,
    },
    {
      id: 5,
      name: "Karim Ali",
      email: "karim.ali@school.edu",
      phone: "+20 104 555 6677",
      subjects: ["Geography (G9)", "English"],
      status: "pending",
      joinDate: "2024-03-12",
      experience: "معدل حضور: 78%",
      qualification: "الصف التاسع - قسم B",
      avatar: null,
    },
  ]);

  const [filteredStudents, setFilteredStudents] = useState(students);
  const [loading, setLoading] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const screens = useBreakpoint();

  const handleStatusChange = (studentId, newStatus) => {
    setLoading(true);
    setTimeout(() => {
      setStudents((prev) =>
        prev.map((s) => (s.id === studentId ? { ...s, status: newStatus } : s))
      );
      message.success(`تم تغيير حالة المتدرب إلى: ${statusLabelAr(newStatus)} بنجاح`);
      setLoading(false);
    }, 400);
  };

  useEffect(() => {
    let filtered = students;

    if (selectedStatus && selectedStatus !== "all") {
      filtered = filtered.filter((s) => s.status === selectedStatus);
    }

    if (searchText) {
      const term = searchText.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.name.toLowerCase().includes(term) ||
          s.email.toLowerCase().includes(term) ||
          (s.qualification || "").toLowerCase().includes(term) ||
          (s.subjects || []).join(" ").toLowerCase().includes(term)
      );
    }

    setFilteredStudents(filtered);
  }, [students, selectedStatus, searchText]);

  const handleViewStudent = (student) => {
    setSelectedStudent(student);
    setViewModalVisible(true);
  };

  // Responsive columns configuration
  const getColumns = () => {
    const baseColumns = [
      {
        title: "المتدرب",
        dataIndex: "name",
        key: "name",
        fixed: screens.xs ? "left" : false,
        render: (name, record) => (
          <div className="flex items-center gap-3" dir="rtl">
            <Avatar
              size={screens.xs ? 40 : 48}
              className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold"
            >
              {getInitials(name)}
            </Avatar>
            <div>
              <Text className="text-gray-900 block text-sm md:text-base">{name}</Text>
              <div className="text-xs md:text-sm text-gray-500 flex items-center mt-1">
                <Mail className="ml-1 text-xs" />
                <span className="hidden md:inline">{record.email}</span>
                <span className="md:hidden">{record.email.split('@')[0]}</span>
              </div>
            </div>
          </div>
        ),
      },
      {
        title: "الدورات",
        dataIndex: "subjects",
        key: "subjects",
        responsive: ['md'],
        render: (subjects) => (
          <div className="flex flex-wrap w-full max-w-[240px] gap-2" dir="rtl">
            {subjects.map((sub, i) => (
              <Tag
                key={i}
                className="px-2 py-1 w-fit text-xs font-medium border-0 hidden md:inline-block"
                style={{
                  backgroundColor: "#26829B",
                  color: "white",
                }}
              >
                {sub}
              </Tag>
            ))}
            <Tooltip title={subjects.join(', ')}>
              <Tag className="md:hidden">
                {subjects.length} دورات
              </Tag>
            </Tooltip>
          </div>
        ),
      },
      {
        title: "الحالة",
        dataIndex: "status",
        key: "status",
        responsive: ['sm'],
        render: (status) => (
          <Badge
            status={getStatusColor(status)}
            text={
              <span className="capitalize font-medium hidden md:inline">
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
        responsive: ['lg'],
        render: (experience) => (
          <div className="flex items-center text-gray-700" dir="rtl">
            <TrophyOutlined className="ml-2 text-yellow-500" />
            <span className="hidden md:inline">{experience}</span>
            <span className="md:hidden">{experience.split(':')[0]}</span>
          </div>
        ),
      },
      {
        title: "تاريخ الانضمام",
        dataIndex: "joinDate",
        key: "joinDate",
        responsive: ['md'],
        render: (date) => (
          <div className="flex items-center text-gray-700" dir="rtl">
            <CalendarOutlined className="ml-2 text-blue-500" />
            <span className="hidden md:inline">
              {new Date(date).toLocaleDateString("ar-EG")}
            </span>
            <span className="md:hidden">
              {new Date(date).toLocaleDateString("ar-EG", { 
                month: '2-digit', 
                day: '2-digit',
                year: '2-digit'
              })}
            </span>
          </div>
        ),
      },
      {
        title: "إجراءات",
        key: "actions",
        fixed: screens.xs ? "right" : false,
        width: screens.xs ? 120 : undefined,
        render: (_, record) => (
          <Space size="small" direction="horizontal" style={{ direction: "rtl" }}>
            <Tooltip title="عرض التفاصيل">
              <Button
                type="primary"
                icon={<EyeOutlined />}
                size="small"
                className="bg-purple-600 !w-fit flex items-center justify-center hover:bg-purple-700 border-purple-600"
                onClick={() => handleViewStudent(record)}
              />
            </Tooltip>
            {record.status !== "approved" && (
              <Button
                type="primary"
                size="small"
                className="bg-green-600 hover:bg-green-700 border-green-600 hidden sm:inline-block"
                loading={loading}
                onClick={() => handleStatusChange(record.id, "approved")}
              >
                {screens.md ? "اعتماد" : ""}
              </Button>
            )}
            {record.status !== "rejected" && (
              <Button
                danger
                size="small"
                loading={loading}
                className="hidden sm:inline-block"
                onClick={() => handleStatusChange(record.id, "rejected")}
              >
                {screens.md ? "رفض" : ""}
              </Button>
            )}
            
            {/* Mobile dropdown for actions */}
            {!screens.sm && (
              <Tooltip title="المزيد من الإجراءات">
                <Button
                  size="small"
                  icon={<UserOutlined />}
                />
              </Tooltip>
            )}
          </Space>
        ),
      },
    ];

    return baseColumns;
  };

  return (
    <>
      <Card className="shadow-lg border-0" dir="rtl">
        <DataTable
          searchable={false}
          table={{ 
            header: getColumns(), 
            rows: filteredStudents 
          }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => (
              <span className="text-gray-600 text-xs md:text-sm">
                عرض {range[0]}–{range[1]} من {total} طالبًا
              </span>
            ),
          }}
          scroll={{ x: screens.xs ? 600 : "max-content" }}
        />
      </Card>

      {/* Student Detail Modal */}
      <Modal
        title="تفاصيل المتدرب"
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setViewModalVisible(false)}>
            إغلاق
          </Button>,
        ]}
        width={screens.xs ? "90%" : "70%"}
        className="student-detail-modal"
        dir="rtl"
      >
        {selectedStudent && (
          <div className="p-4">
            <Row gutter={[16, 16]}>
              <Col xs={24} md={8} className="text-center">
                <Avatar
                  size={100}
                  className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold mx-auto mb-4"
                >
                  {getInitials(selectedStudent.name)}
                </Avatar>
                <Title level={4}>{selectedStudent.name}</Title>
                <Badge
                  status={getStatusColor(selectedStudent.status)}
                  text={statusLabelAr(selectedStudent.status)}
                  className="mb-3"
                />
              </Col>
              <Col xs={24} md={16}>
                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={12}>
                    <div className="flex items-center mb-3">
                      <Mail className="ml-2" />
                      <Text strong>البريد الإلكتروني:</Text>
                      <Text className="mr-2">{selectedStudent.email}</Text>
                    </div>
                  </Col>
                  <Col xs={24} sm={12}>
                    <div className="flex items-center mb-3">
                      <PhoneOutlined className="ml-2" />
                      <Text strong>الهاتف:</Text>
                      <Text className="mr-2">{selectedStudent.phone}</Text>
                    </div>
                  </Col>
                  <Col xs={24} sm={12}>
                    <div className="flex items-center mb-3">
                      <TrophyOutlined className="ml-2" />
                      <Text strong>الخبرة:</Text>
                      <Text className="mr-2">{selectedStudent.experience}</Text>
                    </div>
                  </Col>
                  <Col xs={24} sm={12}>
                    <div className="flex items-center mb-3">
                      <CalendarOutlined className="ml-2" />
                      <Text strong>تاريخ الانضمام:</Text>
                      <Text className="mr-2">
                        {new Date(selectedStudent.joinDate).toLocaleDateString("ar-EG")}
                      </Text>
                    </div>
                  </Col>
                  <Col xs={24}>
                    <Divider />
                    <Text strong>الدورات المسجلة:</Text>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedStudent.subjects.map((subject, index) => (
                        <Tag
                          key={index}
                          color="blue"
                          className="px-3 py-1"
                        >
                          {subject}
                        </Tag>
                      ))}
                    </div>
                  </Col>
                  <Col xs={24}>
                    <Divider />
                    <Text strong>التخصص/المؤهل:</Text>
                    <Text className="block mt-2">{selectedStudent.qualification}</Text>
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>
        )}
      </Modal>
    </>
  );
};

export default StudentsTable;