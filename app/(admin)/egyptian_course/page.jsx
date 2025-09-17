"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import PageLayout from "../../../components/layout/PageLayout";
import PagesHeader from "../../../components/ui/PagesHeader";
import Button from "../../../components/atoms/Button";
import BreadcrumbsShowcase from "../../../components/ui/BreadCrumbs";
import SearchAndFilters from "../../../components/ui/SearchAndFilters";
import SubjectsStats from "../../../components/Subjects/SubjectStats";
// لو عندك Card خاص بالكورسات (مثل اللي ظاهر عندك)، خليه كما هو:
import CourseSubjectCard from "../../../components/ui/Cards/CourseSubjectCard";

import { BarChart3, Book, Download, Plus } from "lucide-react";
import { Table, Tag, Modal, message, Tooltip, Space } from "antd";
import { subjects } from "../../../data/subjects";

const breadcrumbs = [
  { label: "الرئيسية", href: "/", icon: BarChart3 },
  { label: "الدورات", href: "#", icon: Book, current: true },
];

/** تبويبات الحالات */
const STATUS_TABS = [
  { key: "all", label: "الكل" },
  { key: "active", label: "مفعّل" },
  { key: "inactive", label: "غير مفعّل" },
  { key: "draft", label: "مسودة" },
];

/** بيانات تجريبية */
const SEED_SUBJECTS = [
  {
    id: "EG-101",
    code: "EG-101",
    title: "اللغة العربية - الصف الأول",
    instructor: "أ. سارة مجدي",
    category: "العام",
    students: 240,
    lessons: 36,
    status: "active",
    rating: 4.7,
    price: 0,
    createdAt: "2025-01-08",
    updatedAt: "2025-08-30",
  },
  {
    id: "EG-201",
    code: "EG-201",
    title: "الرياضيات - الأساسيات",
    instructor: "أ. أحمد كامل",
    category: "الأزهر",
    students: 180,
    lessons: 28,
    status: "inactive",
    rating: 4.4,
    price: 99,
    createdAt: "2025-02-15",
    updatedAt: "2025-08-21",
  },
  {
    id: "EG-301",
    code: "EG-301",
    title: "اللغة الإنجليزية - الفصحى",
    instructor: "أ. منى علي",
    category: "أبناؤنا في الخارج",
    students: 320,
    lessons: 40,
    status: "active",
    rating: 4.9,
    price: 149,
    createdAt: "2025-03-02",
    updatedAt: "2025-09-10",
  },
  {
    id: "EG-401",
    code: "EG-401",
    title: "العلوم - تمهيدي",
    instructor: "أ. محمد حسن",
    category: "العام",
    students: 0,
    lessons: 12,
    status: "draft",
    rating: null,
    price: 0,
    createdAt: "2025-07-10",
    updatedAt: "2025-07-15",
  },
];

export default function page() {
  const router = useRouter();

  // الحالة العامة
  const [all_subjects, setallSubjects] = useState(subjects);
  const [viewMode, setViewMode] = useState("grid"); // "grid" | "table"
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  // موّدالات/اختيارات
  const [editOpen, setEditOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [activationModal, setActivationModal] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);

  // فلترة حسب التبويب والبحث
  const filteredSubjects = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return all_subjects.filter((s) => {
      const matchesTab =
        activeTab === "all" ? true : s.status === activeTab;
      const haystack = `${s.title} ${s.code} ${s.instructor} ${s.category}`.toLowerCase();
      const matchesSearch = q ? haystack.includes(q) : true;
      return matchesTab && matchesSearch;
    });
  }, [all_subjects, activeTab, searchTerm]);

  // أعمدة الجدول
  const columns = [
    {
      title: "الكود",
      dataIndex: "code",
      key: "code",
      width: 120,
      render: (t) => <span className="font-mono">{t}</span>,
    },
    {
      title: "الدورة",
      dataIndex: "title",
      key: "title",
      render: (text, record) => (
        <div className="flex flex-col">
          <span className="font-semibold text-gray-900">{text}</span>
          <span className="text-xs text-gray-500">
            {record.category} • {record.lessons} درس
          </span>
        </div>
      ),
    },
    {
      title: "المدرّس",
      dataIndex: "instructor",
      key: "instructor",
      width: 180,
    },
    {
      title: "الطلاب",
      dataIndex: "students",
      key: "students",
      width: 100,
      align: "center",
      render: (v) => <span className="font-semibold">{v}</span>,
    },
    {
      title: "الحالة",
      dataIndex: "status",
      key: "status",
      width: 140,
      render: (status) => {
        const map = {
          active: { color: "green", label: "مفعّل" },
          inactive: { color: "red", label: "غير مفعّل" },
          draft: { color: "default", label: "مسودة" },
        }[status] || { color: "default", label: status };
        return <Tag color={map.color}>{map.label}</Tag>;
      },
    },
    {
      title: "التقييم",
      dataIndex: "rating",
      key: "rating",
      width: 120,
      align: "center",
      render: (r) => (r ? `${r.toFixed(1)}★` : "—"),
    },
    {
      title: "السعر",
      dataIndex: "price",
      key: "price",
      width: 120,
      align: "center",
      render: (p) => (p ? `${p} EGP` : "مجاني"),
    },
    {
      title: "أُنشئت",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 120,
      render: (d) =>
        new Date(d).toLocaleDateString("ar-EG", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }),
    },
    {
      title: "إجراءات",
      key: "actions",
      width: 280,
      align: "center",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="فتح">
            <Button
              size="small"
              onClick={() => router.push(`/egyptian_course/${record.id}`)}
            >
              عرض
            </Button>
          </Tooltip>
          <Tooltip title="تعديل">
            <Button
              size="small"
              type="default"
              onClick={() => {
                setSelectedSubject(record);
                setEditOpen(true);
                router.push(`/egyptian_course/edit-course/${record.id}`);
              }}
            >
              تعديل
            </Button>
          </Tooltip>
          <Tooltip title={record.status === "active" ? "تعطيل" : "تفعيل"}>
            <Button
              size="small"
              type={record.status === "active" ? "default" : "primary"}
              onClick={() => {
                setSelectedSubject(record);
                setActivationModal(true);
              }}
            >
              {record.status === "active" ? "تعطيل" : "تفعيل"}
            </Button>
          </Tooltip>
          <Tooltip title="حذف">
            <Button
              size="small"
              danger
              onClick={() => {
                setSelectedSubject(record);
                setDeleteModal(true);
              }}
            >
              حذف
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ];

  // إجراءات الحالة
  const toggleActivation = () => {
    if (!selectedSubject) return;
    setallSubjects((prev) =>
      prev.map((s) =>
        s.id === selectedSubject.id
          ? {
              ...s,
              status: s.status === "active" ? "inactive" : "active",
              updatedAt: new Date().toISOString().slice(0, 10),
            }
          : s
      )
    );
    message.success(
      selectedSubject.status === "active"
        ? "تم تعطيل الدورة بنجاح"
        : "تم تفعيل الدورة بنجاح"
    );
    setActivationModal(false);
    setSelectedSubject(null);
  };

  const deleteSubject = () => {
    if (!selectedSubject) return;
    setallSubjects((prev) => prev.filter((s) => s.id !== selectedSubject.id));
    message.success("تم حذف الدورة بنجاح");
    setDeleteModal(false);
    setSelectedSubject(null);
  };

  return (
    <PageLayout>
      <div dir="rtl">
        <BreadcrumbsShowcase items={breadcrumbs} variant="pill" />

        <PagesHeader
          title={"إدارة دورات الوجهه المصرية"}
          subtitle={"نظّم وأدر موادك التعليمية"}
          extra={
            <div className="flex items-center gap-4 gap-reverse">
              

              <Button
                onClick={() => router.push(`/egyptian_course/add-course`)}
                type="primary"
                size="large"
                icon={<Plus className="w-5 h-5" />}
              >
                إضافة دورة جديدة
              </Button>
            </div>
          }
        />

        <SubjectsStats  subjects={subjects}/>

        

        {/* البحث + الفلاتر (المكوّن عندك) */}
        <SearchAndFilters
          mode={viewMode}
          setMode={setViewMode}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />

        {/* عرض المحتوى حسب الطريقة المختارة */}
        {viewMode === "table" ? (
          <Table
            columns={columns}
            dataSource={filteredSubjects}
            rowKey={(r) => r.id || r.code}
            pagination={{ pageSize: 10 }}
            className="shadow-sm mt-3"
            onRow={(record) => ({
              onDoubleClick: () =>
                router.push(`/egyptian_course/${record.id}`),
            })}
          />
        ) : (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSubjects?.map((subject) => (
              <CourseSubjectCard 
              onDelete={deleteSubject}
                course_type={"egyptian"}
                key={subject.code || subject.id}
                subject={subject}
                activationModal={activationModal}
                setActivationModal={setActivationModal}
                deleteModal={deleteModal}
                setDeleteModal={setDeleteModal}
                setEditOpen={setEditOpen}
                setSelectedSubject={setSelectedSubject}
                dir="rtl"
              />
            ))}

            {filteredSubjects.length === 0 && (
              <div className="col-span-full text-center text-gray-500 py-16">
                لا توجد دورات ضمن هذا التبويب تطابق بحثك
              </div>
            )}
          </div>
        )}

        {/* مودال التفعيل/التعطيل */}
        <Modal
          title="تأكيد الإجراء"
          open={activationModal}
          onOk={toggleActivation}
          onCancel={() => {
            setActivationModal(false);
            setSelectedSubject(null);
          }}
          okText={
            selectedSubject?.status === "active" ? "تعطيل" : "تفعيل"
          }
          cancelText="إلغاء"
        >
          {selectedSubject && (
            <p className="text-gray-700">
              هل تريد{" "}
              <b>
                {selectedSubject.status === "active"
                  ? "تعطيل"
                  : "تفعيل"}
              </b>{" "}
              دورة <b>{selectedSubject.title}</b>؟
            </p>
          )}
        </Modal>

        {/* مودال الحذف */}
        <Modal
          title="حذف الدورة"
          open={deleteModal}
          onOk={deleteSubject}
          onCancel={() => {
            setDeleteModal(false);
            setSelectedSubject(null);
          }}
          okButtonProps={{ danger: true }}
          okText="حذف"
          cancelText="إلغاء"
        >
          {selectedSubject && (
            <p className="text-gray-700">
              هل أنت متأكد من حذف دورة <b>{selectedSubject.title}</b>؟
              لا يمكن التراجع عن هذا الإجراء.
            </p>
          )}
        </Modal>
      </div>
    </PageLayout>
  );
}
