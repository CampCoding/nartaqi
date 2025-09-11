"use client";

import React, { useState } from "react";
import {
  Table,
  Input,
  Select,
  Space,
  Tag,
  Modal,
  message,
  Tooltip,
  Card,
  Statistic,
  Row,
  Col,
  Avatar,
  Badge,
  Typography,
  Divider,
} from "antd";
import DataTable from "./../../../components/layout/DataTable";
import '@ant-design/v5-patch-for-react-19';
import {
  SearchOutlined,
  PlusOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  BookOutlined,
  CalendarOutlined,
  TrophyOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import PageLayout from "../../../components/layout/PageLayout";
import PagesHeader from "./../../../components/ui/PagesHeader";
import BreadcrumbsShowcase from "./../../../components/ui/BreadCrumbs";
import { BarChart3, Download, Plus, Upload, Users } from "lucide-react";
import Button from "./../../../components/atoms/Button";
import TeacherStats from "../../../components/Teachers/TeachersStats";
import SearchAndFilters from "./../../../components/ui/SearchAndFilters";
import TeachersTable from "../../../components/Teachers/TeachersTable";
import TeacherCards from "../../../components/Teachers/TeachersGrid";
import { subjects } from "../../../data/subjects";
import AddTeacherModal from "../../../components/Teachers/AddTeacherModal.modal";
import EditTeacherModal from "../../../components/Teachers/EditTeacher.modal";
import StudentsStats from "../../../components/Students/StudentsStats";
import AddStudentModal from "../../../components/Students/AddStudent.modal";
import StudentsGrid from "../../../components/Students/StudnetsGrid";
import StudentsTable from "../../../components/Students/StudentsTable";

const { Text, Title } = Typography;

const StudentsManagement = () => {
  const [teachers, setTeachers] = useState(
    [
  {
    id: 1,
    name: "Youssef Ibrahim",
    email: "youssef.ibr@school.edu",
    phone: "+20 100 111 2233",
    // هنستخدم subjects ككورسات/مواد بيدرسها الطالب
    subjects: ["Math (G9)", "English", "Biology"],
    // خليه يعبّر عن حالة الطالب: approved=نشط, pending=قيد المراجعة, rejected=محظور
    status: "approved",
    // هنا تاريخ الالتحاق
    joinDate: "2024-09-10",
    // نستخدمها كمعدل حضور/أداء
    experience: "معدل حضور: 92%",
    // نستخدمها كصف/قسم
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
    status: "rejected", // محظور/موقوف
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


  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [addNewModal, setAddNewModal] = useState(false);
  
  // خريطة الأيقونة لكل حالة
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

  // ترجمة نص الحالة للعرض
  const getStatusLabel = (status) => {
    switch (status) {
      case "pending":
        return "قيد المراجعة";
      case "approved":
        return "مقبول";
      case "rejected":
        return "مرفوض";
      default:
        return "غير محدد";
    }
  };

  // حالة شارة AntD المسموح بها: success | processing | default | error | warning
  const getBadgeStatus = (status) => {
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

  const getInitials = (name) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  const handleStatusChange = (teacherId, newStatus) => {
    setLoading(true);
    setTimeout(() => {
      setTeachers((prev) =>
        prev.map((t) => (t.id === teacherId ? { ...t, status: newStatus } : t))
      );
      message.success(`تم تغيير حالة المعلم إلى "${getStatusLabel(newStatus)}" بنجاح`);
      setLoading(false);
    }, 500);
  };

  const breadcrumbs = [
    { label: "الرئيسية", href: "/", icon: BarChart3 },
    { label: "الطلاب", href: "/students", icon: Users, current: true },
  ];

  return (
    <PageLayout>
      <div dir="rtl">
        <BreadcrumbsShowcase items={breadcrumbs} variant="pill" />

        <PagesHeader
          title={"إدارة المتدربين"}
          subtitle={"مراجعة وإدارة طلبات المتدربين وملفاتهم"}
          extra={
            <div className="flex items-center gap-4 gap-reverse">

              <Button type="secondary" icon={<Download className="w-4 h-4" />}>
                تصدير
              </Button>
              <Button
                onClick={() => setAddNewModal(true)}
                type="primary"
                size="large"
                icon={<Plus className="w-5 h-5" />}
              >
                إضافة متدرب
              </Button>
            </div>
          }
        />

        {/* بطاقات الإحصائيات (المكوّن الداخلي لديك) */}
        <StudentsStats />

        {/* فلاتر البحث وطريقة العرض */}
        <SearchAndFilters mode={viewMode} setMode={setViewMode} />

        {/* عرض الشبكة أو الجدول */}
        {viewMode === "table" ? (
          <StudentsTable searchText={searchText} selectedStatus={selectedStatus} />
        ) : (
          <StudentsGrid
            data={teachers}
            onView={(t) => {
              setSelectedTeacher(t);
              setViewModalVisible(true);
            }}
            onApprove={(t) => handleStatusChange(t.id, "approved")}
            onReject={(t) => handleStatusChange(t.id, "rejected")}
          />
        )}
      </div>

      {/* نافذة عرض تفاصيل المعلم */}
      <Modal
        title={<div className="text-xl font-semibold text-gray-800">تفاصيل المعلم</div>}
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={null}
        width={700}
        className="teacher-modal"
      >
        {selectedTeacher && (
          <div className="py-6">
            {/* رأس النافذة */}
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
                status={getBadgeStatus(selectedTeacher.status)}
                text={
                  <span className="font-medium text-lg flex items-center gap-2">
                    {getStatusIcon(selectedTeacher.status)}
                    {getStatusLabel(selectedTeacher.status)}
                  </span>
                }
              />
            </div>

            <Divider />

            {/* معلومات المعلم */}
            <Row gutter={[24, 24]} className="mb-8">
              <Col span={12}>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <Text strong className="text-gray-700 flex items-center mb-2">
                    <BookOutlined className="mr-2 text-yellow-600" />
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
                  <Text strong className="text-gray-700 flex items-center mb-2">
                    <TrophyOutlined className="mr-2 text-yellow-600" />
                    الخبرة
                  </Text>
                  <Text className="text-lg">{selectedTeacher.experience}</Text>
                </div>
              </Col>

              <Col span={12}>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <Text strong className="text-gray-700 flex items-center mb-2">
                    <MailOutlined className="mr-2 text-blue-600" />
                    البريد الإلكتروني
                  </Text>
                  <Text className="text-sm text-blue-600">{selectedTeacher.email}</Text>
                </div>
              </Col>

              <Col span={12}>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <Text strong className="text-gray-700 flex items-center mb-2">
                    <PhoneOutlined className="mr-2 text-green-600" />
                    الهاتف
                  </Text>
                  <Text>{selectedTeacher.phone}</Text>
                </div>
              </Col>

              <Col span={12}>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <Text strong className="text-gray-700 flex items-center mb-2">
                    <CalendarOutlined className="mr-2 text-purple-600" />
                    تاريخ الانضمام
                  </Text>
                  <Text>
                    {new Date(selectedTeacher.joinDate).toLocaleDateString("ar-EG")}
                  </Text>
                </div>
              </Col>

              <Col span={12}>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <Text strong className="text-gray-700 flex items-center mb-2">
                    <TrophyOutlined className="mr-2 text-indigo-600" />
                    المؤهل
                  </Text>
                  <Text>{selectedTeacher.qualification}</Text>
                </div>
              </Col>
            </Row>

            {/* الأزرار */}
            <div className="text-center flex items-center justify-center gap-3">
              {selectedTeacher.status !== "approved" && (
                <Button
                  type="primary"
                  size="large"
                  className="bg-green-600 hover:bg-green-700 border-green-600 px-8"
                  icon={<CheckCircleOutlined />}
                  loading={loading}
                  onClick={() => {
                    handleStatusChange(selectedTeacher.id, "approved");
                    setViewModalVisible(false);
                  }}
                >
                  قبول المعلم
                </Button>
              )}
              {selectedTeacher.status !== "rejected" && (
                <Button
                  danger
                  size="large"
                  className="px-8"
                  icon={<CloseCircleOutlined />}
                  loading={loading}
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

      {/* إضافة معلم جديد */}
      <AddStudentModal
        open={addNewModal}
        onCancel={() => setAddNewModal(false)}
        subjectOptions={subjects}
        onSubmit={(payload) => {
          // إضافة المعلم للحالة الحالية
          setTeachers((prev) => [
            {
              id: prev.length ? Math.max(...prev.map((t) => t.id)) + 1 : 1,
              status: "pending",
              avatar: null,
              ...payload,
            },
            ...prev,
          ]);
          message.success("تمت إضافة المعلم بنجاح");
          setAddNewModal(false);
        }}
      />
    </PageLayout>
  );
};

export default StudentsManagement;
