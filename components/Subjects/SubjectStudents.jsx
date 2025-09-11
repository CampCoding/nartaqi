"use client";

import React, { useMemo, useState } from "react";
import {
  Table,
  Tag,
  Input,
  Space,
  Dropdown,
  Menu,
  Avatar,
  Tooltip,
  Select,
  Typography,
  Popconfirm,
  message,
} from "antd";
import {
  UserAddOutlined,
  DeleteOutlined,
  MailOutlined,
  EditOutlined,
  EyeOutlined,
  MoreOutlined,
  ExportOutlined,
  ReloadOutlined,
  TeamOutlined,
  FilterOutlined,
  SearchOutlined,
  DeleteFilled,
} from "@ant-design/icons";
import DataTable from "../layout/DataTable";
import { Trash2Icon, TrashIcon, Users } from "lucide-react";
import Button from "../atoms/Button";

const { Text } = Typography;

/**
 * SubjectStudentsSection
 *
 * Props:
 * - subjectName?: string
 * - students: Array<{
 *     id: string|number,
 *     name: string,
 *     email?: string,
 *     avatarUrl?: string,
 *     status?: "active"|"inactive"|"suspended",
 *     grade?: string|number,
 *     lastActivity?: string, // ISO or human
 *     enrolledAt?: string,   // ISO or human
 *     notesCount?: number
 *   }>
 * - onView?: (student) => void
 * - onEdit?: (student) => void
 * - onRemove?: (studentIds: (string|number)[]) => Promise<void>|void
 * - onMessage?: (studentIds: (string|number)[]) => void
 * - onAddStudent?: () => void
 * - onExportCSV?: (filteredStudents) => void
 */
export default function SubjectStudentsSection({
  subjectName = "Biology",
  students = [],
  onView,
  onEdit,
  onRemove,
  onMessage,
  onAddStudent,
  onExportCSV,
}) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState();
  const [gradeFilter, setGradeFilter] = useState();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);

  const statusColors = {
    active: "green",
    inactive: "default",
    suspended: "red",
  };

  const grades = useMemo(() => {
    const set = new Set(
      students
        .map((s) => (s.grade ?? "").toString())
        .filter((g) => g && g.trim())
    );
    return Array.from(set);
  }, [students]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return students.filter((s) => {
      const matchQuery =
        !q ||
        s.name?.toLowerCase().includes(q) ||
        s.email?.toLowerCase().includes(q);
      const matchStatus = !statusFilter || s.status === statusFilter;
      const matchGrade =
        !gradeFilter || String(s.grade) === String(gradeFilter);
      return matchQuery && matchStatus && matchGrade;
    });
  }, [students, query, statusFilter, gradeFilter]);

  const handleRowRemove = async (id) => {
    try {
      setLoading(true);
      await onRemove?.([id]);
      message.success("Student removed");
      setSelectedRowKeys((prev) => prev.filter((k) => k !== id));
    } catch (e) {
      message.error("Failed to remove student");
    } finally {
      setLoading(false);
    }
  };

  const statusLabels = {
    active: "نشط",
    inactive: "غير نشط",
    suspended: "موقوف",
  };

  const columns = [
    {
      title: "الطالب",
      dataIndex: "name",
      key: "name",
      width: 280,
      render: (_, record) => (
        <Space>
          <Avatar src={record.avatarUrl} size={40}>
            {record.name?.charAt(0)}
          </Avatar>
          <div>
            <div className="font-medium">{record.name}</div>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {record.email}
            </Text>
          </div>
        </Space>
      ),
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "الحالة",
      dataIndex: "status",
      key: "status",
      width: 130,
      filters: [
        { text: "نشط", value: "active" },
        { text: "غير نشط", value: "inactive" },
        { text: "موقوف", value: "suspended" },
      ],
      onFilter: (val, rec) => rec.status === val,
      render: (status) => (
        <Tag color={statusColors[status] || "default"}>
          {statusLabels[status] || "—"}
        </Tag>
      ),
    },
    {
      title: "التقدير",
      dataIndex: "grade",
      key: "grade",
      width: 110,
      align: "center",
      sorter: (a, b) => String(a.grade).localeCompare(String(b.grade)),
      render: (g) => g ?? "—",
    },
    {
      title: "آخر نشاط",
      dataIndex: "lastActivity",
      key: "lastActivity",
      width: 180,
      sorter: (a, b) =>
        new Date(a.lastActivity || 0) - new Date(b.lastActivity || 0),
      render: (v) => (v ? new Date(v).toLocaleString("ar-EG") : "—"),
    },
    {
      title: "تاريخ التسجيل",
      dataIndex: "enrolledAt",
      key: "enrolledAt",
      width: 170,
      sorter: (a, b) =>
        new Date(a.enrolledAt || 0) - new Date(b.enrolledAt || 0),
      render: (v) => (v ? new Date(v).toLocaleDateString("ar-EG") : "—"),
    },
    {
      title: "الملاحظات",
      dataIndex: "notesCount",
      key: "notesCount",
      width: 90,
      align: "center",
      render: (n) => <Tag>{n ?? 0}</Tag>,
    },
    {
      title: "الإجراءات",
      key: "actions",
      fixed: "right",
      width: 160,
      render: (_, record) => {
        const menu = (
          <Menu
            items={[
              {
                key: "view",
                icon: <EyeOutlined />,
                label: "عرض الملف",
                onClick: () => onView?.(record),
              },
              {
                key: "edit",
                icon: <EditOutlined />,
                label: "تعديل",
                onClick: () => onEdit?.(record),
              },
              { type: "divider" },
              {
                key: "message",
                icon: <MailOutlined />,
                label: "إرسال رسالة",
                onClick: () => onMessage?.([record.id]),
              },
              {
                key: "remove",
                icon: <DeleteOutlined />,
                danger: true,
                label: (
                  <Popconfirm
                    title="إزالة الطالب"
                    description="سيتم إلغاء تسجيل الطالب من هذه الدورة."
                    okText="إزالة"
                    okButtonProps={{ danger: true }}
                    cancelText="إلغاء"
                    onConfirm={() => handleRowRemove(record.id)}
                  >
                    <span>إزالة</span>
                  </Popconfirm>
                ),
              },
            ]}
          />
        );

        return (
          <Space>
            <Tooltip title="عرض">
              <Button
                type="secondary"
                icon={<EyeOutlined />}
                onClick={() => onView?.(record)}
              />
            </Tooltip>
            <Tooltip title="تعديل">
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={() => onEdit?.(record)}
              />
            </Tooltip>
            <Tooltip title="حذف">
              <Popconfirm
                title="إزالة الطالب"
                description="سيتم إلغاء تسجيل الطالب من هذه الدورة."
                okText="إزالة"
                okButtonProps={{ danger: true }}
                cancelText="إلغاء"
                onConfirm={() => handleRowRemove(record.id)}
              >
                <Button
                  type="danger"
                  icon={<DeleteFilled />}
                  onClick={() => onEdit?.(record)}
                />
              </Popconfirm>
            </Tooltip>
            {/* <Dropdown overlay={menu} trigger={["click"]}>
              <Button size="small" icon={<MoreOutlined />} />
            </Dropdown> */}
          </Space>
        );
      },
    },
  ];
  return (
    <div className="bg-white rounded-xl w-full  border border-gray-200 p-4 md:p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl md:text-2xl font-bold text-[#202938] flex items-center gap-2">
          <Users /> الطلاب المشتركين في الدورة
        </h2>
      </div>
      <div className="grid grid-cols-1">
        <DataTable
          searchable={true}
          searchPlaceholder="بحث عن طالب..."
          table={{
            header: columns,
            rows: filtered,
          }}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} exams`,
            showSizeChanger: true,
            showQuickJumper: true,
          }}
          className="border border-gray-100 rounded-lg overflow-hidden w-[100%]"
          rowClassName="hover:bg-gray-50 transition-colors"
        />
      </div>
    </div>
  );
}

/* -------------------------
   (Optional) Example usage:

<SubjectStudentsSection
  subjectName="Biology"
  students={[
    {
      id: 1,
      name: "Amira N.",
      email: "amira@example.com",
      avatarUrl: "https://i.pravatar.cc/100?img=1",
      status: "active",
      grade: "A",
      lastActivity: "2025-08-16T15:22:00Z",
      enrolledAt: "2025-02-01",
      notesCount: 4,
    },
  ]}
  onView={(s) => console.log("view", s)}
  onEdit={(s) => console.log("edit", s)}
  onMessage={(ids) => console.log("message ->", ids)}
  onRemove={async (ids) => console.log("remove ->", ids)}
  onAddStudent={() => console.log("add student")}
  onExportCSV={(rows) => console.log("export rows", rows)}
/>

------------------------- */
