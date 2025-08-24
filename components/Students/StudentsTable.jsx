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

  const handleStatusChange = (studentId, newStatus) => {
    setLoading(true);
    setTimeout(() => {
      setStudents((prev) =>
        prev.map((s) => (s.id === studentId ? { ...s, status: newStatus } : s))
      );
      message.success(`تم تغيير حالة الطالب إلى: ${statusLabelAr(newStatus)} بنجاح`);
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

 const columns = [
     {
       title: "الطالب",
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
          table={{ header: columns, rows: filteredStudents }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => (
              <span className="text-gray-600">
                عرض {range[0]}–{range[1]} من {total} طالبًا
              </span>
            ),
          }}
          scroll={{ x: "max-content" }}
        />
      </Card>

      
    </>
  );
};

export default StudentsTable;
