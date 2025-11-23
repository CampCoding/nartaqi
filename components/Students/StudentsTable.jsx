"use client";

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
import { Globe, Mail } from "lucide-react";

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
  FacebookFilled,
  InstagramOutlined,
  LinkedinOutlined,
  TwitterOutlined,
  YoutubeOutlined,
  TikTokFilled,
} from "@ant-design/icons";

const { Text, Title } = Typography;
const { useBreakpoint } = Grid;

const statusLabelAr = (status) => {
  switch (status) {
    case "pending":
      return "قيد المراجعة";
    case "approved":
      return "نشط";
    case "rejected":
      return "محظور";
    default:
      return status || "غير محدد";
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case "male":
      return "blue";
    case "female":
      return "pink";
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
    .map((n) => n?.[0] || "")
    .join("")
    .toUpperCase();

const StudentsTable = ({
  searchText = "",
  selectedStatus = "all",
  data = [],
}) => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const screens = useBreakpoint();

  // normalize incoming data (API teachers)
  useEffect(() => {
    const normalized =
      (data || []).map((s) => ({
        ...s,
        status: s.status || "approved",
        subjects: s.subjects || [],
        experience: s.experience || s.description || "—",
        joinDate: s.joinDate || s.created_at || "",
        avatar: s.avatar || s.image_url || s.image || null,
        qualification: s.qualification || "محاضر",
      })) || [];
    setStudents(normalized);
  }, [data]);

  const handleStatusChange = (studentId, newStatus) => {
    setLoading(true);
    setTimeout(() => {
      setStudents((prev) =>
        prev.map((s) => (s.id === studentId ? { ...s, status: newStatus } : s))
      );
      message.success(
        `تم تغيير حالة المتدرب إلى: ${statusLabelAr(newStatus)} بنجاح`
      );
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

  const renderSubjects = (subjects) => {
    if (!subjects || !Array.isArray(subjects) || subjects.length === 0) {
      return <Tag className="md:hidden">0 دورات</Tag>;
    }

    return (
      <>
        <div
          className="hidden md:flex flex-wrap w-full max-w-[240px] gap-2"
          dir="rtl"
        >
          {subjects.slice(0, 2).map((sub, i) => (
            <Tag
              key={i}
              className="px-2 py-1 w-fit text-xs font-medium border-0"
              style={{
                backgroundColor: "#26829B",
                color: "white",
              }}
            >
              {sub}
            </Tag>
          ))}
          {subjects.length > 2 && (
            <Tag className="bg-gray-500 text-white">
              +{subjects.length - 2}
            </Tag>
          )}
        </div>
        <Tooltip title={subjects.join(", ")}>
          <Tag className="md:hidden">{subjects.length} دورات</Tag>
        </Tooltip>
      </>
    );
  };

  const renderExperience = (experience) => {
    if (!experience) return "—";

    return (
      <div className="flex items-center text-gray-700" dir="rtl">
        <TrophyOutlined className="ml-2 text-yellow-500" />
        <span className="hidden md:inline">{experience}</span>
        <span className="md:hidden">
          {experience.includes(":")
            ? experience.split(":")[0]
            : experience.substring(0, 15) + "..."}
        </span>
      </div>
    );
  };

  const renderDate = (date) => {
    if (!date) return "—";

    try {
      return (
        <div className="flex items-center text-gray-700" dir="rtl">
          <CalendarOutlined className="ml-2 text-blue-500" />
          <span className="hidden md:inline">
            {new Date(date).toLocaleDateString("ar-EG")}
          </span>
          <span className="md:hidden">
            {new Date(date).toLocaleDateString("ar-EG", {
              month: "2-digit",
              day: "2-digit",
              year: "2-digit",
            })}
          </span>
        </div>
      );
    } catch (error) {
      return "—";
    }
  };

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
              src={record.avatar}
              className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold"
            >
              {getInitials(name)}
            </Avatar>
            <div>
              <Text className="text-gray-900 block text-sm md:text-base">
                {name || "—"}
              </Text>
              <div className="text-xs md:text-sm text-gray-500 flex items-center mt-1">
                <Mail className="ml-1 text-xs" />
                <span className="hidden md:inline">
                  {record.email || "—"}
                </span>
                <span className="md:hidden">
                  {(record.email || "").split("@")[0]}
                </span>
              </div>
            </div>
          </div>
        ),
      },
      
      {
        title: "الحالة",
        dataIndex: "gender",
        key: "gender",
        responsive: ["sm"],
        render: (status) => (
          <Badge
            color={status == "male" ?"blue":"pink"}
            text={
              <span className="capitalize font-medium hidden md:inline">
               {status =="male" ? "ذكر" :"أنثي"}
              </span>
            }
          />
        ),
      },
      {
        title: "الوصف",
        dataIndex: "experience",
        key: "experience",
        responsive: ["lg"],
        render: renderExperience,
      },
       {
        title: "السوشيال ميديا",
        dataIndex: "",
        key: "",
        responsive: ["lg"],
        render: (_, record) => {
          return (
             <div className="grid grid-cols-4 my-3 gap-1">
                                {record?.facebook && (
                                  <a href={record?.facebook} target="_blank" rel="noreferrer">
                                    <FacebookFilled className="w-7 h-7 text-blue-600" />
                                  </a>
                                )}
            
                                {record?.instagram && (
                                  <a href={record?.instagram} target="_blank" rel="noreferrer">
                                    <InstagramOutlined className="w-7 h-7 text-pink-500" />
                                  </a>
                                )}
            
                                {record?.linkedin && (
                                  <a href={record?.linkedin} target="_blank" rel="noreferrer">
                                    <LinkedinOutlined className="w-7 h-7 text-blue-400" />
                                  </a>
                                )}
            
                                {record?.tiktok && (
                                  <a href={record?.tiktok} target="_blank" rel="noreferrer">
                                    <TikTokFilled className="w-4 h-4 text-black mx-auto" />
                                  </a>
                                )}
            
                                {record?.twitter && (
                                  <a href={record?.twitter} target="_blank" rel="noreferrer">
                                    <TwitterOutlined className="w-7 h-7 text-blue-400" />
                                  </a>
                                )}
            
                                {record?.youtube && (
                                  <a href={record?.youtube} target="_blank" rel="noreferrer">
                                    <YoutubeOutlined className="w-7 h-7 text-red-500" />
                                  </a>
                                )}
            
                                {record?.website && (
                                  <a
                                    href={record?.website}
                                    className="flex justify-center items-center"
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    <Globe className="w-4 h-4 text-gray-500" />
                                  </a>
                                )}
                              </div>
          )
        },
      },
      {
        title: "تاريخ الانضمام",
        dataIndex: "joinDate",
        key: "joinDate",
        responsive: ["md"],
        render: renderDate,
      },
      {
        title: "إجراءات",
        key: "actions",
        fixed: screens.xs ? "right" : false,
        width: screens.xs ? 120 : undefined,
        render: (_, record) => (
          <Space
            size="small"
            direction="horizontal"
            style={{ direction: "rtl" }}
          >
            <Tooltip title="عرض التفاصيل">
              <Button
                type="primary"
                icon={<EyeOutlined />}
                size="small"
                className="bg-purple-600 !w-fit flex items-center justify-center hover:bg-purple-700 border-purple-600"
                onClick={() => handleViewStudent(record)}
              />
            </Tooltip>
            {/* {record.status !== "approved" && (
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
            )} */}

            {!screens.sm && (
              <Tooltip title="المزيد من الإجراءات">
                <Button size="small" icon={<UserOutlined />} />
              </Tooltip>
            )}
          </Space>
        ),
      },
    ];

    return baseColumns;
  };

  const renderModalSubjects = (subjects) => {
    if (!subjects || !Array.isArray(subjects) || subjects.length === 0) {
      return <Text className="text-gray-500">لا توجد دورات مسجلة</Text>;
    }

    return (
      <div className="flex flex-wrap gap-2 mt-2">
        {subjects.map((subject, index) => (
          <Tag key={index} color="blue" className="px-3 py-1">
            {subject}
          </Tag>
        ))}
      </div>
    );
  };

  return (
    <>
      <Card className="shadow-lg border-0" dir="rtl">
        <DataTable
          searchable={false}
          table={{
            header: getColumns(),
            rows: filteredStudents,
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
                  src={selectedStudent.avatar}
                  className="mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold"
                >
                  {getInitials(selectedStudent.name)}
                </Avatar>
                <Title level={4}>{selectedStudent.name || "—"}</Title>
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
                      <Text className="mr-2">
                        {selectedStudent.email || "—"}
                      </Text>
                    </div>
                  </Col>
                  <Col xs={24} sm={12}>
                    <div className="flex items-center mb-3">
                      <PhoneOutlined className="ml-2" />
                      <Text strong>الهاتف:</Text>
                      <Text className="mr-2">
                        {selectedStudent.phone || "—"}
                      </Text>
                    </div>
                  </Col>
                  <Col xs={24} sm={12}>
                    <div className="flex items-center mb-3">
                      <TrophyOutlined className="ml-2" />
                      <Text strong>الخبرة:</Text>
                      <Text className="mr-2">
                        {selectedStudent.experience || "—"}
                      </Text>
                    </div>
                  </Col>
                  <Col xs={24} sm={12}>
                    <div className="flex items-center mb-3">
                      <CalendarOutlined className="ml-2" />
                      <Text strong>تاريخ الانضمام:</Text>
                      <Text className="mr-2">
                        {selectedStudent.joinDate
                          ? new Date(
                              selectedStudent.joinDate
                            ).toLocaleDateString("ar-EG")
                          : "—"}
                      </Text>
                    </div>
                  </Col>
                  <Col xs={24}>
                    <Divider />
                    <Text strong>الدورات المسجلة:</Text>
                    {renderModalSubjects(selectedStudent.subjects)}
                  </Col>
                  <Col xs={24}>
                    <Divider />
                    <Text strong>التخصص/المؤهل:</Text>
                    <Text className="block mt-2">
                      {selectedStudent.qualification || "—"}
                    </Text>
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
