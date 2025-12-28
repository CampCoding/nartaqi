"use client";
import React, { useEffect, useMemo, useState } from "react";
import PageLayout from "../../../../../components/layout/PageLayout";
import BreadcrumbsShowcase from "../../../../../components/ui/BreadCrumbs";
import PagesHeader from "../../../../../components/ui/PagesHeader";
import Button from "../../../../../components/atoms/Button";
import StudentsStats from "../../../../../components/Students/StudentsStats";
import SearchAndFilters from "../../../../../components/ui/SearchAndFilters";
import { useParams } from "next/navigation";
import { subjects } from "../../../../../data/subjects";

import {
  Avatar,
  Card,
  Col,
  Divider,
  Input,
  message,
  Modal,
  Progress,
  Row,
  Select,
  Space,
  Table,
  Tag,
  Tooltip,
} from "antd";
import {
  BarChart3,
  Download,
  Plus,
  Upload as UploadIcon,
  Users,
  Search as SearchIcon,
  Copy,
} from "lucide-react";
import StudentsGrid from "../../../../../components/Students/StudnetsGrid";
import StudentsTable from "../../../../../components/Students/StudentsTable";
import AddStudentModal from "../../../../../components/Students/AddStudent.modal";

/* ===== بيانات تجريبية (Dummy) ===== */
const dummyStudents = [
  {
    id: 1,
    name: "Youssef Ibrahim",
    email: "youssef.ibr@school.edu",
    phone: "+20 100 111 2233",
    subjects: ["Math (G9)", "English", "Biology"],
    status: "approved", // سنحوّلها إلى active
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
    status: "rejected", // سنحوّلها إلى suspended
    joinDate: "2024-01-05",
    experience: "معدل حضور: 61%",
    qualification: "الصف السابع - قسم A",
    avatar: null,
  },
];

/* ===== خرائط الحالة الموحّدة للواجهة ===== */
const statusColors = {
  active: "green",
  pending: "gold",
  suspended: "red",
  dropped: "default",
};
const statusLabels = {
  active: "نشِط",
  pending: "بانتظار التفعيل",
  suspended: "موقوف",
  dropped: "منسحب",
};

/* تحويل حالة الداتا التجريبية إلى الحالات القياسية للواجهة */
function normalizeStatus(s) {
  if (s === "approved") return "active";
  if (s === "rejected") return "suspended";
  return s || "active";
}

/* استخراج نسبة رقمية من experience مثل: "معدل حضور: 92%" */
function progressFromExperience(exp) {
  const m = String(exp || "").match(/(\d{1,3})\s*%/);
  const val = m ? Number(m[1]) : 0;
  return Math.max(0, Math.min(100, val));
}

function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

/* Mock: جلب طلاب الدورة حسب كود الدورة */
async function fetchCourseStudentsByCode(code) {
  await new Promise((r) => setTimeout(r, 500));
  const seed = String(code || "").slice(0, 3).toUpperCase();
  const base = [
    {
      id: 1,
      name: "أحمد علي",
      email: `ahmed.${seed}@mail.com`,
      phone: "+966500000001",
      status: "active",
      joinDate: "2024-01-15",
      progress: 78,
      grade: "B+",
      parentName: "علي محمد",
      parentPhone: "+966511111111",
    },
    {
      id: 2,
      name: "ندى محمد",
      email: `nada.${seed}@mail.com`,
      phone: "+966500000002",
      status: "pending",
      joinDate: "2024-02-02",
      progress: 20,
      grade: "C",
      parentName: "محمد حسن",
      parentPhone: "+966522222222",
    },
    {
      id: 3,
      name: "خالد يوسف",
      email: `khaled.${seed}@mail.com`,
      phone: "+966500000003",
      status: "active",
      joinDate: "2024-03-10",
      progress: 55,
      grade: "B",
      parentName: "يوسف أحمد",
      parentPhone: "+966533333333",
    },
    {
      id: 4,
      name: "سارة خالد",
      email: `sara.${seed}@mail.com`,
      phone: "+966500000004",
      status: "suspended",
      joinDate: "2024-03-21",
      progress: 10,
      grade: "D",
      parentName: "خالد عادل",
      parentPhone: "+966544444444",
    },
  ];
  return base;
}

/* بطاقة المتدرب في شبكة العرض */
function StudentCard({ s, onView }) {
  return (
    <Card
      hoverable
      className="h-full"
      onClick={() => onView(s)}
      actions={[
        <span key="copy" onClick={(e) => e.stopPropagation()}>
          <Tooltip title="نسخ البريد">
            <Copy
              className="w-4 h-4 cursor-pointer"
              onClick={() => {
                navigator.clipboard.writeText(s.email || "");
                message.success("تم نسخ البريد");
              }}
            />
          </Tooltip>
        </span>,
      ]}
    >
      <div className="flex items-center gap-3">
        <Avatar size={48} style={{ background: "#1677ff", color: "#fff" }}>
          {getInitials(s.name)}
        </Avatar>
        <div className="min-w-0">
          <div className="font-semibold truncate">{s.name}</div>
          <div className="text-xs text-gray-500 truncate">{s.email}</div>
        </div>
      </div>

      <Divider className="my-3" />
      <div className="flex items-center justify-between">
        <Tag color={statusColors[s.status] || "default"}>
          {statusLabels[s.status] || s.status}
        </Tag>
        <div className="text-xs text-gray-500">{s.phone}</div>
      </div>
      <div className="mt-3">
        <div className="text-xs text-gray-500 mb-1">التقدم</div>
        <Progress percent={s.progress ?? 0} size="small" />
      </div>
    </Card>
  );
}

export default function Page() {
  const params = useParams();
  const id = params?.["teacher-student"];

  const [selectedSubject, setSelectedSubject] = useState(null);

  // حالات عامة
  const [viewMode, setViewMode] = useState("grid");
  const [students, setStudents] = useState([]); // سنملؤها من dummy
  const [searchText, setSearchText] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  // عرض التفاصيل
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // سحب من الدورة
  const [pullModalOpen, setPullModalOpen] = useState(false);
  const [pulling, setPulling] = useState(false);
  const [selectedFields, setSelectedFields] = useState([
    "name",
    "email",
    "phone",
    "status",
    "joinDate",
    "progress",
    "grade",
  ]);
  const [mergeStrategy, setMergeStrategy] = useState("replace"); // replace | merge
  const [matchBy, setMatchBy] = useState("email"); // email | phone | id

  // حمّل اسم/كود الدورة من subjects + حمّل الداتا التجريبية كقائمة افتراضية
  useEffect(() => {
    setSelectedSubject(subjects?.find((item) => String(item?.code) === String(id)) || null);

    // تطبيع بيانات الـ dummy: حالة + نسبة التقدّم + درجة افتراضية إن لم توجد
    const normalized = dummyStudents.map((s) => ({
      id: s.id,
      name: s.name,
      email: s.email,
      phone: s.phone,
      status: normalizeStatus(s.status),
      joinDate: s.joinDate,
      progress: progressFromExperience(s.experience),
      grade: s.grade || "-", // ليست موجودة في الداتا التجريبية الأصلية
      parentName: s.parentName,
      parentPhone: s.parentPhone,
    }));
    setStudents(normalized);
  }, [id]);

  // بحث وفلترة
  const filteredStudents = useMemo(() => {
    const q = (searchText || "").toLowerCase();
    return students.filter((s) => {
      const matchesSearch =
        !q ||
        (s.name || "").toLowerCase().includes(q) ||
        (s.email || "").toLowerCase().includes(q) ||
        (s.phone || "").toLowerCase().includes(q);
      const matchesStatus = selectedStatus === "all" || s.status === selectedStatus;
      return matchesSearch && matchesStatus;
    });
  }, [students, searchText, selectedStatus]);

  // أعمدة الجدول
  const columns = [
    {
      title: "المتدرب",
      dataIndex: "name",
      key: "name",
      render: (_, r) => (
        <Space>
          <Avatar size="small" style={{ background: "#1677ff", color: "#fff" }}>
            {getInitials(r.name)}
          </Avatar>
          <div>
            <div className="font-medium">{r.name}</div>
            <div className="text-xs text-gray-500">{r.email}</div>
          </div>
        </Space>
      ),
    },
    {
      title: "الهاتف",
      dataIndex: "phone",
      key: "phone",
      responsive: ["md"],
    },
    {
      title: "الحالة",
      dataIndex: "status",
      key: "status",
      render: (v) => (
        <Tag color={statusColors[v] || "default"}>{statusLabels[v] || v}</Tag>
      ),
      filters: [
        { text: "نشِط", value: "active" },
        { text: "بانتظار التفعيل", value: "pending" },
        { text: "موقوف", value: "suspended" },
        { text: "منسحب", value: "dropped" },
      ],
      onFilter: (val, rec) => rec.status === val,
    },
    {
      title: "التقدم",
      key: "progress",
      dataIndex: "progress",
      render: (p) => <Progress percent={p ?? 0} size="small" />,
      width: 160,
      responsive: ["md"],
    },
    {
      title: "الدرجة",
      dataIndex: "grade",
      key: "grade",
      width: 90,
      responsive: ["lg"],
    },
    {
      title: "انضم في",
      dataIndex: "joinDate",
      key: "joinDate",
      width: 120,
      render: (d) => (d ? new Date(d).toLocaleDateString("ar-EG") : "-"),
      responsive: ["lg"],
    },
    {
      title: "إجراءات",
      key: "act",
      width: 120,
      render: (_, r) => (
        <Space>
          <Button
            size="small"
            type="default"
            onClick={() => {
              setSelectedStudent(r);
              setViewModalVisible(true);
            }}
          >
            عرض
          </Button>
          <Select
            size="small"
            value={r.status}
            onChange={(val) => handleStatusChange(r.id, val)}
            style={{ width: 120 }}
            options={[
              { value: "active", label: "نشِط" },
              { value: "pending", label: "بانتظار التفعيل" },
              { value: "suspended", label: "موقوف" },
              { value: "dropped", label: "منسحب" },
            ]}
          />
        </Space>
      ),
    },
  ];

  const breadcrumbs = [
    { label: "الرئيسية", href: "/", icon: BarChart3 },
    { label: "دورات المدربين", href: "/teachers-courses", icon: Users },
    {
      label: selectedSubject?.name || "دورة",
      href: `/teachers-courses/${selectedSubject?.code || id}`,
      icon: "",
    },
    { label: "المتدربين", href: "#", current: true },
  ];

  function handleStatusChange(studentId, newStatus) {
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, status: newStatus } : s))
    );
    message.success("تم تحديث الحالة");
  }

  async function handleExportExcel() {
    try {
      const XLSX = await import("xlsx");
      const cols = [
        { header: "ID", key: "id" },
        { header: "الاسم", key: "name" },
        { header: "البريد", key: "email" },
        { header: "الهاتف", key: "phone" },
        { header: "الحالة", key: "statusLabel" },
        { header: "التقدم", key: "progress" },
        { header: "الدرجة", key: "grade" },
        { header: "تاريخ الانضمام", key: "joinDate" },
      ];
      const rows = filteredStudents.map((s) => ({
        id: s.id,
        name: s.name,
        email: s.email,
        phone: String(s.phone || ""),
        statusLabel: statusLabels[s.status] || s.status,
        progress: s.progress ?? 0,
        grade: s.grade ?? "",
        joinDate: s.joinDate ? new Date(s.joinDate) : "",
      }));
      const ordered = rows.map((r) => {
        const o = {};
        cols.forEach((c) => (o[c.header] = r[c.key]));
        return o;
      });
      const ws = (await XLSX).utils.json_to_sheet(ordered, {
        cellDates: true,
        dateNF: "yyyy-mm-dd",
      });
      ws["!cols"] = cols.map((c) => ({ wch: Math.min(40, c.header.length + 8) }));
      const wb = (await XLSX).utils.book_new();
      (await XLSX).utils.book_append_sheet(wb, ws, "Students");
      const today = new Date().toISOString().slice(0, 10);
      (await XLSX).writeFile(wb, `students-${selectedSubject?.code || id}-${today}.xlsx`);
      message.success("تم تصدير Excel");
    } catch (e) {
      console.error(e);
      message.error("تعذر التصدير");
    }
  }

  function mergeStudents(existing, incoming, { matchBy = "email", fields = [] }) {
    if (!incoming?.length) return existing || [];
    if (!fields?.length) {
      fields = [
        "name",
        "email",
        "phone",
        "status",
        "joinDate",
        "progress",
        "grade",
        "parentName",
        "parentPhone",
      ];
    }
    const key = (obj) => String(obj?.[matchBy] ?? "").toLowerCase();
    const map = new Map((existing || []).map((s) => [key(s), { ...s }]));
    incoming.forEach((inc) => {
      const k = key(inc);
      const picked = fields.reduce((acc, f) => {
        if (inc[f] !== undefined) acc[f] = inc[f];
        return acc;
      }, {});
      if (map.has(k)) {
        map.set(k, { ...map.get(k), ...picked });
      } else {
        const id = inc.id ?? Date.now() + Math.random();
        map.set(k, { id, ...picked });
      }
    });
    return Array.from(map.values());
  }

  async function onPullFromCourse() {
    setPulling(true);
    try {
      const courseStudents = await fetchCourseStudentsByCode(selectedSubject?.code || id);

      if (mergeStrategy === "replace") {
        const stripped = courseStudents.map((s) => {
          const obj = { id: s.id };
          selectedFields.forEach((f) => (obj[f] = s[f]));
          return obj;
        });
        setStudents(stripped);
      } else {
        const merged = mergeStudents(students, courseStudents, {
          matchBy,
          fields: selectedFields,
        });
        setStudents(merged);
      }

      message.success("تم سحب بيانات المتدربين من داخل الدورة");
      setPullModalOpen(false);
    } catch (e) {
      console.error(e);
      message.error("فشل جلب بيانات الدورة");
    } finally {
      setPulling(false);
    }
  }



  return (
    <PageLayout>
      <div>
        <BreadcrumbsShowcase variant="pill" items={breadcrumbs} />

        <PagesHeader
          title={"طلاب الدورة"}
          subtitle={`إدارة طلاب "${selectedSubject?.name || id || "الدورة"}" وسحب بياناتهم من داخل الدورة`}
          extra={
            <div className="flex items-center gap-3 gap-reverse">
              <Button
                type="default"
                icon={<UploadIcon className="w-4 h-4" />}
                onClick={() => setPullModalOpen(true)}
              >
                سحب من الدورة
              </Button>
              {/* <Button type="secondary" icon={<Download className="w-4 h-4" />} onClick={handleExportExcel}>
                تصدير
              </Button> */}
            
            </div>
          }
        />

        {/* إحصائيات عامة */}
        <StudentsStats />

        {/* تبديل طريقة العرض */}
        <SearchAndFilters searchTerm={searchText} setSearchTerm={setSearchText} mode={viewMode} setMode={setViewMode} />

        

        {/* عرض البيانات */}
       {viewMode === "table" ? (
          <StudentsTable searchText={searchText} selectedStatus={filteredStudents} />
        ) : (
          <StudentsGrid
            data={filteredStudents}
            onView={(t) => {
              setSelectedTeacher(t);
              setViewModalVisible(true);
            }}
            onApprove={(t) => handleStatusChange(t.id, "approved")}
            onReject={(t) => handleStatusChange(t.id, "rejected")}
          />
        )}

        {/* عرض تفاصيل المتدرب */}
        <Modal
          title="تفاصيل المتدرب"
          open={viewModalVisible}
          onCancel={() => setViewModalVisible(false)}
          footer={null}
          width={640}
        >
          {selectedStudent && (
            <div className="py-2">
              <div className="flex items-center gap-4 mb-4">
                <Avatar size={64} style={{ background: "#1677ff", color: "#fff" }}>
                  {getInitials(selectedStudent.name)}
                </Avatar>
                <div>
                  <div className="text-lg font-semibold">{selectedStudent.name}</div>
                  <div className="text-gray-500 text-sm">{selectedStudent.email}</div>
                </div>
              </div>

              <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                  <Card size="small">
                    <div className="text-gray-500 text-xs mb-1">الهاتف</div>
                    <div>{selectedStudent.phone || "-"}</div>
                  </Card>
                </Col>
                <Col xs={24} md={12}>
                  <Card size="small">
                    <div className="text-gray-500 text-xs mb-1">الحالة</div>
                    <Tag color={statusColors[selectedStudent.status] || "default"}>
                      {statusLabels[selectedStudent.status] || selectedStudent.status}
                    </Tag>
                  </Card>
                </Col>
                <Col xs={24} md={12}>
                  <Card size="small">
                    <div className="text-gray-500 text-xs mb-1">تاريخ الانضمام</div>
                    <div>
                      {selectedStudent.joinDate
                        ? new Date(selectedStudent.joinDate).toLocaleDateString("ar-EG")
                        : "-"}
                    </div>
                  </Card>
                </Col>
                <Col xs={24} md={12}>
                  <Card size="small">
                    <div className="text-gray-500 text-xs mb-1">التقدم</div>
                    <Progress percent={selectedStudent.progress ?? 0} />
                  </Card>
                </Col>
                <Col xs={24} md={12}>
                  <Card size="small">
                    <div className="text-gray-500 text-xs mb-1">الدرجة</div>
                    <div>{selectedStudent.grade || "-"}</div>
                  </Card>
                </Col>
              </Row>

              {(selectedStudent.parentName || selectedStudent.parentPhone) && (
                <>
                  <Divider />
                  <div className="font-semibold mb-2">ولي الأمر</div>
                  <Row gutter={[16, 16]}>
                    <Col xs={24} md={12}>
                      <Card size="small">
                        <div className="text-gray-500 text-xs mb-1">الاسم</div>
                        <div>{selectedStudent.parentName || "-"}</div>
                      </Card>
                    </Col>
                    <Col xs={24} md={12}>
                      <Card size="small">
                        <div className="text-gray-500 text-xs mb-1">الهاتف</div>
                        <div>{selectedStudent.parentPhone || "-"}</div>
                      </Card>
                    </Col>
                  </Row>
                </>
              )}
            </div>
          )}
        </Modal>

        {/* مودال السحب من داخل الدورة */}
        <Modal
          title="سحب بيانات المتدربين من داخل الدورة"
          open={pullModalOpen}
          onCancel={() => setPullModalOpen(false)}
          onOk={onPullFromCourse}
          okText={pulling ? "جارٍ السحب..." : "سحب"}
          confirmLoading={pulling}
        >
          <div className="space-y-4">
            <div>
              <div className="font-medium mb-1">الحقول المطلوب جلبها</div>
              <Select
                mode="multiple"
                value={selectedFields}
                onChange={setSelectedFields}
                className="w-full"
                options={[
                  { value: "name", label: "الاسم" },
                  { value: "email", label: "البريد" },
                  { value: "phone", label: "الهاتف" },
                  { value: "status", label: "الحالة" },
                  { value: "joinDate", label: "تاريخ الانضمام" },
                  { value: "progress", label: "التقدم" },
                  { value: "grade", label: "الدرجة" },
                  { value: "parentName", label: "اسم ولي الأمر" },
                  { value: "parentPhone", label: "هاتف ولي الأمر" },
                ]}
                placeholder="اختر الحقول"
              />
              <div className="text-xs text-gray-500 mt-1">
                اختيار جزء من الحقول يعني جلب هذه الأعمدة فقط وتحديثها/استبدالها.
              </div>
            </div>

            <Row gutter={12}>
              <Col span={12}>
                <div className="font-medium mb-1">طريقة الدمج</div>
                <Select
                  value={mergeStrategy}
                  onChange={setMergeStrategy}
                  className="w-full"
                  options={[
                    { value: "replace", label: "استبدال القائمة بالكامل" },
                    { value: "merge", label: "دمج مع الموجود (تحديث الجزئيات)" },
                  ]}
                />
              </Col>
              <Col span={12}>
                <div className="font-medium mb-1">مطابقة حسب</div>
                <Select
                  value={matchBy}
                  onChange={setMatchBy}
                  className="w-full"
                  options={[
                    { value: "email", label: "البريد" },
                    { value: "phone", label: "الهاتف" },
                    { value: "id", label: "المعرّف" },
                  ]}
                  disabled={mergeStrategy === "replace"}
                />
              </Col>
            </Row>

            <div className="rounded-lg border p-3 bg-gray-50 text-xs">
              <div className="font-semibold mb-1">ملاحظة:</div>
              <ul className="list-disc pr-5 space-y-1">
                <li>في وضع <b>الاستبدال</b> سيتم إنشاء القائمة من جديد بالحقول المحددة فقط.</li>
                <li>في وضع <b>الدمج</b> يتم تحديث السجلات المطابقة وإضافة أي سجلات جديدة غير موجودة.</li>
              </ul>
            </div>
          </div>
        </Modal>


      </div>
    </PageLayout>
  );
}
