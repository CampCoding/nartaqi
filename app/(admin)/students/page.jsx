"use client";

import React, { useMemo, useState } from "react";
import {
  Tag,
  Modal,
  message,
  Row,
  Col,
  Avatar,
  Badge,
  Typography,
  Divider,
} from "antd";
import "@ant-design/v5-patch-for-react-19";
import {
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
import {
  BarChart3,
  Download,
  Plus,
  Users,
  GraduationCap,
  User2,
} from "lucide-react";
import Button from "./../../../components/atoms/Button";
import AddStudentModal from "../../../components/Students/AddStudent.modal";
import StudentsGrid from "../../../components/Students/StudnetsGrid";
import StudentsTable from "../../../components/Students/StudentsTable";
import StudentsStats from "../../../components/Students/StudentsStats";
import SearchAndFilters from "../../../components/ui/SearchAndFilters";
import { subjects } from "../../../data/subjects";

const { Text, Title } = Typography;

const StudentsManagement = () => {
  const [addNewModal, setAddNewModal] = useState(false);

  // Seed now includes `role` so we can filter by محاضر/طالب
  const [teachers, setTeachers] = useState([
    {
      id: 1,
      role: "lecturer", // محاضر
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
      role: "lecturer",
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
      role: "lecturer",
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
      role: "lecturer",
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
      role: "lecturer",
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
    // Students
    {
      id: 6,
      role: "student", // طالب
      name: "Ahmed Adel",
      email: "ahmed.adel@student.edu",
      phone: "+20 105 000 1111",
      subjects: ["English", "Biology"],
      status: "approved",
      joinDate: "2024-06-01",
      experience: "—",
      qualification: "طالب",
      avatar: null,
    },
    {
      id: 7,
      role: "student",
      name: "Nada Samir",
      email: "nada.samir@student.edu",
      phone: "+20 106 000 2222",
      subjects: ["Math", "Computer"],
      status: "pending",
      joinDate: "2024-10-10",
      experience: "—",
      qualification: "طالبة",
      avatar: null,
    },
  ]);

  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState("grid");

  // NEW: role filter (all | lecturer | student)
  const [roleFilter, setRoleFilter] = useState("all");

  // Icons per status
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

  const getInitials = (name = "") =>
    name
      .split(" ")
      .map((n) => n?.[0] || "")
      .join("")
      .toUpperCase();

  const handleStatusChange = (teacherId, newStatus) => {
    setLoading(true);
    setTimeout(() => {
      setTeachers((prev) =>
        prev.map((t) => (t.id === teacherId ? { ...t, status: newStatus } : t))
      );
      message.success(
        `تم تغيير حالة الحساب إلى "${getStatusLabel(newStatus)}" بنجاح`
      );
      setLoading(false);
    }, 500);
  };

  // Filtered list by role
  const filteredData = useMemo(() => {
    return teachers.filter((t) => {
      const roleOk =
        roleFilter === "all" ? true : (t.role || "lecturer") === roleFilter;
      return roleOk;
    });
  }, [teachers, roleFilter]);

  // Counts for tabs
  const roleCounts = useMemo(() => {
    const total = teachers.length;
    const lecturer = teachers.filter(
      (t) => (t.role || "lecturer") === "lecturer"
    ).length;
    const student = teachers.filter((t) => t.role === "student").length;
    return { total, lecturer, student };
  }, [teachers]);

  const breadcrumbs = [
    { label: "الرئيسية", href: "/", icon: BarChart3 },
    { label: "الطلاب", href: "/students", icon: Users, current: true },
  ];

  // Pretty role tab button
  const RoleTab = ({ active, onClick, icon: Icon, label, count, gradient }) => (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={[
        "group inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-medium transition-all",
        "border focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#02AAA0]/60",
        active
          ? `text-white border-transparent shadow-md scale-[1.02] bg-gradient-to-r from-primary to-secondary`
          : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:shadow-sm",
      ].join(" ")}
    >
      <Icon className={active ? "opacity-100" : "opacity-80"} size={16} />
      <span>{label}</span>
      <span
        className={[
          "ml-1 inline-flex items-center justify-center min-w-[24px] h-6 px-2 rounded-full text-xs font-bold transition-colors",
          active ? "bg-white/20 text-white" : "bg-gray-100 text-gray-700",
        ].join(" ")}
      >
        {count}
      </span>
    </button>
  );

  return (
    <PageLayout>
      <div dir="rtl">
        <BreadcrumbsShowcase items={breadcrumbs} variant="pill" />

        <PagesHeader
          title={"إدارة المتدربين"}
          subtitle={"مراجعة وإدارة طلبات المتدربين وملفاتهم"}
          extra={
            <div className="flex items-center gap-4 gap-reverse">
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

        {/* Stats */}
        <StudentsStats />

        {/* View mode + role filter row */}
        <div className="flex flex-col gap-3">
          <SearchAndFilters mode={viewMode} setMode={setViewMode} />

          {/* Role filter (Pills) */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="text-sm text-gray-600">تصفية حسب نوع الحساب:</div>

            <div className="flex items-center my-7 gap-2 flex-wrap">
              <RoleTab
                active={roleFilter === "all"}
                onClick={() => setRoleFilter("all")}
                icon={Users}
                label="الكل"
                count={roleCounts.total}
                gradient="from-sky-500 to-cyan-600"
              />
              <RoleTab
                active={roleFilter === "lecturer"}
                onClick={() => setRoleFilter("lecturer")}
                icon={GraduationCap}
                label="معلم"
                count={roleCounts.lecturer}
                gradient="from-violet-500 to-fuchsia-600"
              />
              <RoleTab
                active={roleFilter === "student"}
                onClick={() => setRoleFilter("student")}
                icon={User2}
                label="طالب"
                count={roleCounts.student}
                gradient="from-emerald-500 to-teal-600"
              />
            </div>
          </div>
        </div>

        {/* Grid or Table */}
        {viewMode === "table" ? (
          <StudentsTable
            searchText={searchText}
            selectedStatus={selectedStatus}
          />
        ) : (
          <StudentsGrid
            data={filteredData}
            onView={(t) => {
              setSelectedTeacher(t);
              setViewModalVisible(true);
            }}
            onApprove={(t) => handleStatusChange(t.id, "approved")}
            onReject={(t) => handleStatusChange(t.id, "rejected")}
          />
        )}
      </div>

      {/* View details modal */}
      <Modal
        title={
          <div className="text-xl font-semibold text-gray-800">
            {selectedTeacher?.role === "student"
              ? "تفاصيل المتدرب"
              : "تفاصيل المحاضر"}
          </div>
        }
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={null}
        width={700}
        className="teacher-modal"
      >
        {selectedTeacher && (
          <div className="py-6">
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

            {/* Details */}
            <Row gutter={[24, 24]} className="mb-8">
              <Col span={12}>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <Text strong className="text-gray-700 flex items-center mb-2">
                    <BookOutlined className="mr-2 text-yellow-600" />
                    الدورات
                  </Text>
                  <div className="flex flex-wrap items-center gap-2">
                    {(selectedTeacher.subjects || []).map((item, i) => (
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
                    {(!selectedTeacher.subjects ||
                      selectedTeacher.subjects.length === 0) && (
                      <Text className="text-gray-500">—</Text>
                    )}
                  </div>
                </div>
              </Col>

              <Col span={12}>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <Text strong className="text-gray-700 flex items-center mb-2">
                    <TrophyOutlined className="mr-2 text-yellow-600" />
                    الخبرة / الحالة
                  </Text>
                  <Text className="text-lg">
                    {selectedTeacher.experience || "—"}
                  </Text>
                </div>
              </Col>

              <Col span={12}>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <Text strong className="text-gray-700 flex items-center mb-2">
                    <MailOutlined className="mr-2 text-blue-600" />
                    البريد الإلكتروني
                  </Text>
                  <Text className="text-sm text-blue-600">
                    {selectedTeacher.email}
                  </Text>
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
                    {new Date(
                      selectedTeacher.joinDate
                    ).toLocaleDateString("ar-EG")}
                  </Text>
                </div>
              </Col>

              <Col span={12}>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <Text strong className="text-gray-700 flex items-center mb-2">
                    <TrophyOutlined className="mr-2 text-indigo-600" />
                    المؤهل
                  </Text>
                  <Text>{selectedTeacher.qualification || "—"}</Text>
                </div>
              </Col>
            </Row>

            {/* Actions */}
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
                  قبول
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
                  رفض
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Add new */}
      <AddStudentModal
        open={addNewModal}
        onCancel={() => setAddNewModal(false)}
        subjectOptions={subjects}
        onSubmit={(payload) => {
          setTeachers((prev) => [
            {
              id: prev.length ? Math.max(...prev.map((t) => t.id)) + 1 : 1,
              status: "pending",
              avatar: null,
              role: payload.role || "student", // keep selected role
              name: payload.name || "بدون اسم",
              email: payload.email || "",
              phone: payload.phone || "",
              subjects: payload.subjects || [],
              joinDate:
                payload.joinDate || new Date().toISOString().slice(0, 10),
              experience: payload.experience || "—",
              qualification:
                payload.qualification ||
                (payload.role === "lecturer" ? "محاضر" : "طالب"),
            },
            ...prev,
          ]);
          message.success("تمت إضافة الحساب بنجاح");
          setAddNewModal(false);
        }}
      />
    </PageLayout>
  );
};

export default StudentsManagement;
