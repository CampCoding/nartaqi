"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Tag,
  Space,
  Dropdown,
  Avatar,
  Tooltip,
  Typography,
  Popconfirm,
  message,
  Button as AntButton,
  Input,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  ExportOutlined,
  FilterOutlined,
  DeleteFilled,
  SearchOutlined,
} from "@ant-design/icons";
import { Table } from "antd";
import { Users } from "lucide-react";
import Button from "../atoms/Button";
import * as XLSX from 'xlsx';

const { Text } = Typography;

export default function SubjectStudentsSection({
  subjectName = "Biology",
  students = [],
  onView,
  onEdit,
  onRemove,
  onMessage,
}) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState();
  const [gradeFilter, setGradeFilter] = useState();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);

  const statusColors = {
    active: "green",
    inactive: "default",
    suspended: "red",
  };

  const statusLabels = {
    active: "نشط",
    inactive: "غير نشط",
    suspended: "موقوف",
  };

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

  useEffect(() => {
    console.log(filtered);
  }, [filtered])

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

  const handleExport = async (exportAll = false) => {
    try {
      setExportLoading(true);
      const dataToExport = exportAll ? students : filtered;
  
      if (dataToExport.length === 0) {
        message.warning("No data to export");
        return;
      }
      
      // Prepare worksheet data
      const worksheetData = dataToExport.map(student => ({
        "الاسم": student.name || "",
        "البريد الإلكتروني": student.email || "",
        "الحالة": statusLabels[student.status] || "",
        "آخر نشاط": student.lastActivity ? new Date(student.lastActivity).toLocaleString("ar-EG") : "",
        "تاريخ التسجيل": student.enrolledAt ? new Date(student.enrolledAt).toLocaleDateString("ar-EG") : "",
      }));
      
      // Create workbook and worksheet
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(worksheetData);
      
      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, "الطلاب");
      
      // Generate file name with timestamp
      const fileName = `طلاب_${subjectName}_${new Date().toISOString().split('T')[0]}.xlsx`;
      
      // Export the file
      XLSX.writeFile(workbook, fileName);
      
      message.success(`تم تصدير ${dataToExport.length} طالب بنجاح`);
      
    } catch (error) {
      console.error("Export error:", error);
      message.error("فشل في تصدير البيانات");
    } finally {
      setExportLoading(false);
    }
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
   
  ];
  
  return (
    <div className="bg-white rounded-xl w-full border border-gray-200 p-4 md:p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl md:text-2xl font-bold text-[#202938] flex items-center gap-2">
          <Users /> الطلاب المشتركين في الدورة
        </h2>
        
        <Space>
          <Dropdown
            menu={{
              items: [
                {
                  key: 'export-all',
                  label: 'تصدير جميع الطلاب',
                  icon: <ExportOutlined />,
                  onClick: () => handleExport(true)
                },
                {
                  key: 'export-filtered',
                  label: `تصدير الطلاب المصفى (${filtered.length})`,
                  icon: <FilterOutlined />,
                  onClick: () => handleExport(false),
                  disabled: filtered.length === 0
                }
              ]
            }}
            placement="bottomRight"
          >
            <AntButton 
              className="!bg-primary !text-white"
              icon={<ExportOutlined />} 
              loading={exportLoading}
              type="primary"
            >
              تصدير إلى Excel
            </AntButton>
          </Dropdown>
        </Space>
      </div>
      
      <div className="mb-4">
        <Input
          placeholder="بحث عن طالب..."
          prefix={<SearchOutlined />}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          allowClear
        />
      </div>
      
      <div className="grid grid-cols-1">
        <Table
          columns={columns}
          dataSource={filtered}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showTotal: (total, range) =>
              `عرض ${range[0]}-${range[1]} من ${total} طالب`,
            showSizeChanger: true,
            showQuickJumper: true,
          }}
          className="border border-gray-100 rounded-lg overflow-hidden w-full"
          rowClassName="hover:bg-gray-50 transition-colors"
          scroll={{ x: true }}
        />
      </div>
    </div>
  );
}