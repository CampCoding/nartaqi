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

const { Text, Title } = Typography;

const TeachersManagement = () => {
  const [teachers, setTeachers] = useState([
    {
      id: 1,
      name: "Ahmed Hassan",
      email: "ahmed.hassan@school.edu",
      phone: "+20 100 123 4567",
      subjects: ["Math", "Physics", "Chemistry", "Biology", "English"],
      status: "pending",
      joinDate: "2024-01-15",
      experience: "5 سنوات",
      qualification: "ماجستير رياضيات",
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
      experience: "8 سنوات",
      qualification: "دكتوراه في الفيزياء",
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
      experience: "3 سنوات",
      qualification: "بكالوريوس أحياء",
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
      experience: "6 سنوات",
      qualification: "ماجستير كيمياء",
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
      experience: "4 سنوات",
      qualification: "بكالوريوس أدب إنجليزي",
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

  // ========= تصفية البيانات (تحترم البحث والحالة لو متوصلين) =========
  const filteredTeachers = teachers.filter((t) => {
    const matchStatus = selectedStatus === "all" || t.status === selectedStatus;
    const q = (searchText || "").toLowerCase();
    const matchSearch =
      !q ||
      t.name.toLowerCase().includes(q) ||
      t.email.toLowerCase().includes(q) ||
      t.phone.toLowerCase().includes(q) ||
      (t.subjects || []).some((s) => s.toLowerCase().includes(q));
    return matchStatus && matchSearch;
  });

  // ========= تصدير Excel =========
  const handleExportExcel = async () => {
    try {
      setLoading(true);
      const XLSX = await import("xlsx");

      const columns = [
        { header: "ID", key: "id" },
        { header: "الاسم", key: "name" },
        { header: "البريد الإلكتروني", key: "email" },
        { header: "الهاتف", key: "phone" },
        { header: "المواد", key: "subjectsFormatted" },
        { header: "الحالة", key: "statusLabel" },
        { header: "تاريخ الانضمام", key: "joinDate" },
        { header: "الخبرة", key: "experience" },
        { header: "المؤهل", key: "qualification" },
      ];

      const rows = filteredTeachers.map((t) => ({
        id: t.id,
        name: t.name,
        email: t.email,
        phone: String(t.phone ?? ""), // الحفاظ على الأصفار الأولى
        subjectsFormatted: (t.subjects || []).join(", "),
        statusLabel: getStatusLabel(t.status),
        joinDate: new Date(t.joinDate), // Excel يتعرف عليها كتاريخ
        experience: t.experience,
        qualification: t.qualification,
      }));

      const ordered = rows.map((r) => {
        const o = {};
        columns.forEach((c) => (o[c.header] = r[c.key]));
        return o;
      });

      const ws = XLSX.utils.json_to_sheet(ordered, {
        cellDates: true,
        dateNF: "yyyy-mm-dd",
      });

      // ضبط عرض الأعمدة تلقائيًا
      ws["!cols"] = columns.map((c) => {
        const headerLen = c.header.length;
        const maxCell = Math.max(
          headerLen,
          ...rows.map((r) => String(r[c.key] ?? "").length)
        );
        return { wch: Math.min(maxCell + 2, 40) };
      });

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Teachers");

      const today = new Date().toISOString().slice(0, 10); // yyyy-mm-dd
      XLSX.writeFile(wb, `teachers-${today}.xlsx`);

      message.success("تم تصدير ملف Excel بنجاح");
    } catch (err) {
      console.error(err);
      message.error("حدث خطأ أثناء التصدير");
    } finally {
      setLoading(false);
    }
  };

  const breadcrumbs = [
    { label: "الرئيسية", href: "/", icon: BarChart3 },
    { label: "المعلمين", href: "/teachers", icon: Users, current: true },
  ];

  return (
    <PageLayout>
      <div dir="rtl">
        <BreadcrumbsShowcase items={breadcrumbs} variant="pill" />

        <PagesHeader
          title={"إدارة المعلمين"}
          subtitle={"مراجعة وإدارة طلبات المعلمين وملفاتهم"}
          extra={
            <div className="flex items-center gap-4 gap-reverse">
              
              <Button
                type="secondary"
                icon={<Download className="w-4 h-4" />}
                onClick={handleExportExcel}
                loading={loading}
              >
                تصدير
              </Button>
              <Button
                onClick={() => setAddNewModal(true)}
                type="primary"
                size="large"
                icon={<Plus className="w-5 h-5" />}
              >
                إضافة معلم
              </Button>
            </div>
          }
        />

        {/* بطاقات الإحصائيات (المكوّن الداخلي لديك) */}
        <TeacherStats />

        {/* فلاتر البحث وطريقة العرض */}
        <SearchAndFilters mode={viewMode} setMode={setViewMode} />

        {/* عرض الشبكة أو الجدول */}
        {viewMode === "table" ? (
          <TeachersTable
            searchText={searchText}
            selectedStatus={selectedStatus}
          />
        ) : (
          <TeacherCards
            data={filteredTeachers}
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
      <AddTeacherModal
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

export default TeachersManagement;
