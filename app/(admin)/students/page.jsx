"use client";

import React, { useEffect, useMemo, useState } from "react";
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
  Spin,
} from "antd";
// import "@ant-design/v5-patch-for-react-19";
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
import { BarChart3, Plus, Users, GraduationCap, User2 } from "lucide-react";
import Button from "./../../../components/atoms/Button";
import AddStudentModal from "../../../components/Students/AddStudent.modal";
import StudentsGrid from "../../../components/Students/StudnetsGrid";
import StudentsTable from "../../../components/Students/StudentsTable";
import StudentsStats from "../../../components/Students/StudentsStats";
import SearchAndFilters from "../../../components/ui/SearchAndFilters";
import { subjects } from "../../../data/subjects";
import { useDispatch, useSelector } from "react-redux";
import { handleGetAllTeachers } from "../../../lib/features/teacherSlice";
import { handleGetAllStudents } from "../../../lib/features/studentSlice";

const { Text, Title } = Typography;

// normalize API teacher object into what UI components expect
const normalizeTeacher = (t) => ({
  id: t.id,
  role: "lecturer", // all from this endpoint are lecturers
  name: t.name,
  email: t.email,
  gender: t.gender,
  description: t.description || "",
  avatar: t.image_url || t.image || null,
  facebook: t.facebook || "",
  instagram: t.instagram || "",
  linkedin: t.linkedin || "",
  tiktok: t.tiktok || "",
  twitter: t.twitter || "",
  youtube: t.youtube || "",
  website: t.website || "",
  created_at: t.created_at || "",
  // fields used by table/grid/modal
  status: t.status || "approved",
  subjects: t.subjects || [], // if you add later from another API
  experience: t.experience || t.description || "—",
  joinDate: t.joinDate || t.created_at || "",
  qualification: t.qualification || "محاضر",
});

const StudentsManagement = () => {
  const [addNewModal, setAddNewModal] = useState(false);
  const [teachers, setTeachers] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [roleFilter, setRoleFilter] = useState("all"); // all | lecturer | student
    const { get_students_list, get_students_loading } = useSelector(
    (state) => state?.students
  );
  const dispatch = useDispatch();
  const { teachers_loading, teachers_list } = useSelector(
    (state) => state?.teachers
  );

  // fetch from API
  useEffect(() => {
    dispatch(handleGetAllTeachers());
  }, [dispatch]);

  // normalize API data into local state
  useEffect(() => {
    const apiTeachers = teachers_list?.data?.message || [];
    if (!Array.isArray(apiTeachers)) return;

    const normalized = apiTeachers.map((t) => normalizeTeacher(t));
    setTeachers(normalized);
  }, [teachers_list]);

    useEffect(() => {
    dispatch(
      handleGetAllStudents({
        body: {
          per_page: 21,
        },
      })
    );
  }, [dispatch]);

  
  const students = useMemo(
    () => get_students_list?.data?.data?.message || [],
    [get_students_list]
  );

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

  // Filter by role (UI only)
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
    { label: "المتدربين", href: "/students", icon: Users, current: true },
  ];

  const RoleTab = ({ active, onClick, icon: Icon, label, count }) => (
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

  if (teachers_loading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <Spin size="large" spinning />
      </div>
    );
  }

  return (
    <PageLayout>
      <div dir="rtl">
        <BreadcrumbsShowcase items={breadcrumbs} variant="pill" />

        <PagesHeader
          title={"إدارة المتدربين"}
          subtitle={"مراجعة وإدارة طلبات المتدربين وملفاتهم"}
          extra={
            <div className="flex items-center gap-4 gap-reverse">
              {/* <Button
                onClick={() => setAddNewModal(true)}
                type="primary"
                size="large"
                icon={<Plus className="w-5 h-5" />}
              >
                إضافة متدرب
              </Button> */}
            </div>
          }
        />

        {/* Stats */}
        {/* <StudentsStats /> */}

        {/* View mode + role filter row */}
        <div className="flex flex-col gap-3">
          <SearchAndFilters
            mode={viewMode}
            setMode={setViewMode}
            searchText={searchText}
            setSearchText={setSearchText}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
          />

          {/* Role filter (Pills) */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            {/* <div className="text-sm text-gray-600">تصفية حسب نوع الحساب:</div> */}

            {/* <div className="flex items-center my-7 gap-2 flex-wrap">
              <RoleTab
                active={roleFilter === "all"}
                onClick={() => setRoleFilter("all")}
                icon={Users}
                label="الكل"
                count={roleCounts.total}
              />
              <RoleTab
                active={roleFilter === "lecturer"}
                onClick={() => setRoleFilter("lecturer")}
                icon={GraduationCap}
                label="معلم"
                count={roleCounts.lecturer}
              />
              <RoleTab
                active={roleFilter === "student"}
                onClick={() => setRoleFilter("student")}
                icon={User2}
                label="طالب"
                count={roleCounts.student}
              />
            </div> */}
          </div>
        </div>

        {/* Grid or Table */}
        {viewMode === "table" ? (
          <StudentsTable
            searchText={searchText}
            selectedStatus={selectedStatus}
            data={filteredData}
          />
        ) : (
          <StudentsGrid
            data={students}
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
                src={selectedTeacher.avatar}
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
                  <Text>{selectedTeacher.phone || "—"}</Text>
                </div>
              </Col>

              <Col span={12}>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <Text strong className="text-gray-700 flex items-center mb-2">
                    <CalendarOutlined className="mr-2 text-purple-600" />
                    تاريخ الانضمام
                  </Text>
                  <Text>
                    {selectedTeacher.joinDate
                      ? new Date(
                          selectedTeacher.joinDate
                        ).toLocaleDateString("ar-EG")
                      : "—"}
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
          </div>
        )}
      </Modal>

      {/* Add new – adds to local list */}
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
              role: payload.role || "student",
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


// "use client";
// import React, { useEffect, useState, useMemo } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { handleGetAllStudents, handleInrollStudentRound } from "../../../lib/features/studentSlice";
// import { Spin, Modal, Select, notification } from "antd";
// import { useRouter } from "next/navigation";
// import { handleGetAllCoursesCategories } from "../../../lib/features/categoriesSlice";
// import { handleGetAllRounds } from "../../../lib/features/roundsSlice";
// import { toast } from "react-toastify";

// export default function StudentsPage() {
//   const dispatch = useDispatch();
//   const router = useRouter();

//   const { get_students_list, get_students_loading } = useSelector(
//     (state) => state?.students
//   );
//   const { rounds_list } = useSelector((state) => state?.rounds);
//   const { all_courses_categories_list, all_courses_categories_loading } = useSelector(
//     (state) => state?.categories
//   );

//   // Modal for enrollment
//   const [enrollModalOpen, setEnrollModalOpen] = useState(false);
//   const [selectedStudent, setSelectedStudent] = useState(null);
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [selectedRound, setSelectedRound] = useState(null);

//   useEffect(() => {
//     dispatch(handleGetAllCoursesCategories());
//   }, []);

//   useEffect(() => {
//     if (selectedCategory) {
//       dispatch(handleGetAllRounds({ course_category_id: selectedCategory }));
//     }
//   }, [selectedCategory]);

//   useEffect(() => {
//     dispatch(
//       handleGetAllStudents({
//         body: {
//           per_page: 21,
//         },
//       })
//     );
//   }, [dispatch]);

//   const students = useMemo(
//     () => get_students_list?.data?.data?.message || [],
//     [get_students_list]
//   );

//   const openEnrollModal = (student) => {
//     setSelectedStudent(student);
//     setEnrollModalOpen(true);
//   };

//   const closeEnrollModal = () => {
//     setEnrollModalOpen(false);
//     setSelectedStudent(null);
//     setSelectedCategory(null);
//     setSelectedRound(null);
//   };

//   const handleConfirmEnroll = () => {
//     if (!selectedRound) {
//       notification.error({
//         message: "خطأ",
//         description: "يجب عليك اختيار دورة لتسجيل الطالب.",
//       });
//       return;
//     }

//     // Dispatch the enrollment action
//     dispatch(
//       handleInrollStudentRound({
//         body: {
//           student_id: selectedStudent.id,
//           round_id: selectedRound,
//         },
//       })
//     ).unwrap().then((res) => {
//       console.log(res);
//       if (res?.data?.status == "success") {
//         setEnrollModalOpen(false);
//         toast.success("تم تسجيل الطالب ف الدورة بنجاح");
//       }else {
//         toast.error("حدث خطأ أثناء محاولة تسجيل الطالب في الدورة.")
//       }
//     }).catch(() => {
//       toast.error("حدث خطأ أثناء محاولة تسجيل الطالب في الدورة.")
//     });
//   };

//   if (get_students_loading) {
//     return (
//       <div className="h-screen flex justify-center items-center">
//         <Spin size="large" spinning />
//       </div>
//     );
//   }

//   return (
//     <div className="p-6" dir="rtl">
//       <h1 className="text-2xl font-bold mb-4">المتدربين</h1>

//       {students.length === 0 ? (
//         <div className="text-center text-gray-500 py-16">
//           لا يوجد طلاب متاحين حالياً.
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {students.map((student) => (
//             <div
//               key={student.id}
//               className="border rounded-xl shadow-sm p-4 bg-white flex flex-col gap-3"
//             >
//               <div className="flex items-center gap-3">
//                 <div className="w-12 h-12 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center">
//                   {student.image ? (
//                     <img
//                       src={student.image}
//                       alt={student.name}
//                       className="w-full h-full object-cover"
//                     />
//                   ) : (
//                     <span className="text-sm font-semibold text-gray-500">
//                       {student.name?.substring(0, 2) || "ST"}
//                     </span>
//                   )}
//                 </div>
//                 <div className="flex-1 text-right">
//                   <div className="font-semibold text-gray-900">{student.name}</div>
//                   <div className="text-xs text-gray-500">رقم الهاتف: {student.phone}</div>
//                   <div className="text-xs text-gray-500">
//                     الجنس:{" "}
//                     {student.gender === "male"
//                       ? "ذكر"
//                       : student.gender === "female"
//                         ? "أنثى"
//                         : student.gender}
//                   </div>
//                 </div>
//               </div>

//               <div className="mt-2 text-[11px] text-gray-400 text-right">
//                 أنشئ في:{" "}
//                 {student.created_at
//                   ? new Date(student.created_at).toLocaleString("ar-EG")
//                   : "غير متوفر"}
//               </div>

//               <div className="mt-3 flex flex-wrap gap-2 justify-between">
//                 <button
//                   onClick={() => openEnrollModal(student)}
//                   className="flex-1 px-3 py-2 rounded-lg bg-emerald-600 text-white text-xs hover:bg-emerald-700 transition"
//                 >
//                   تسجيل في دورة
//                 </button>

//                 {/* <button
//                   onClick={() => router.push("/rounds")} // Redirect to rounds page
//                   className="flex-1 px-3 py-2 rounded-lg bg-blue-600 text-white text-xs hover:bg-blue-700 transition"
//                 >
//                   عرض كل الدورات
//                 </button> */}

//                 <button
//                   onClick={() => router.push(`/students/${student?.id}`)}
//                   className="flex-1 px-3 py-2 rounded-lg bg-gray-100 text-gray-800 text-xs hover:bg-gray-200 transition"
//                 >
//                   تفاصيل الطالب
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Enrollment Modal */}
//       <Modal
//         open={enrollModalOpen}
//         onCancel={closeEnrollModal}
//         onOk={handleConfirmEnroll}
//         okText="تأكيد التسجيل"
//         cancelText="إلغاء"
//         centered
//         title="تسجيل الطالب في دورة"
//       >
//         {selectedStudent && (
//           <div className="space-y-3 text-right">
//             <p>
//               سيتم تسجيل الطالب:{" "}
//               <b className="text-emerald-700">{selectedStudent.name}</b> في أحد
//               الدورات.
//             </p>
//             <div className="flex flex-col gap-2">
//               <label>فئات الدورات</label>
//               <Select
//                 loading={all_courses_categories_loading}
//                 onChange={(e) => setSelectedCategory(e)}
//                 options={all_courses_categories_list?.data?.message?.data?.map(item => ({
//                   label: item?.name,
//                   value: item?.id,
//                 }))}
//               />
//             </div>

//             {/* Show rounds after selecting category */}
//             {selectedCategory && rounds_list?.data?.message?.data && (
//               <div className="flex flex-col gap-2 mt-2">
//                 <label>اختر الدورة</label>
//                 <Select
//                   onChange={(value) => setSelectedRound(value)}
//                   options={rounds_list?.data?.message?.data?.map(round => ({
//                     label: round?.name,
//                     value: round?.id,
//                   }))}
//                 />
//               </div>
//             )}
//           </div>
//         )}
//       </Modal>

//     </div>
//   );
// }


