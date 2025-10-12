"use client";
import Button from "@/components/atoms/Button";
import PageLayout from "@/components/layout/PageLayout";
import BreadcrumbsShowcase from "@/components/ui/BreadCrumbs";
import PagesHeader from "@/components/ui/PagesHeader";
import { Modal, Table, Dropdown, Menu } from "antd";
import {
  BarChart3,
  Download,
  Eye,
  Plus,
  QrCode,
  Trash,
  Upload,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";

const breadcrumbs = [
  { label: "الرئيسية", href: "/", icon: BarChart3 },
  { label: "QR Code", href: "#", icon: QrCode, current: true },
];

export default function Page() {
  const router = useRouter();

  // Modal + form state
  const [newModal, setNewModal] = useState(false);
  const [bookTitle, setBookTitle] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [count, setCount] = useState(1);

  // Data (batches of QR codes)
  const [qrData, setQrData] = useState([]);

  // Keep pagination state so we can render a correct order column
  const [pagination, setPagination] = useState({ current: 1, pageSize: 5 });
  const currentStartIndex = useMemo(
    () => (pagination.current - 1) * pagination.pageSize,
    [pagination]
  );

  const handleGenerateQRCode = () => {
    if (!bookTitle.trim()) {
      alert("أدخل اسم الكتاب أولاً");
      return;
    }
    const n = parseInt(String(count), 10);
    if (!n || n <= 0) {
      alert("أدخل عدداً صحيحاً أكبر من صفر");
      return;
    }

    const batch = {
      id: Date.now(),
      book: bookTitle.trim(),
      category: categoryName.trim(),
      count: n,
      createdAt: new Date().toISOString(),
    };

    setQrData((prev) => [...prev, batch]);
    setNewModal(false);
    setBookTitle("");
    setCategoryName("");
    setCount(1);
  };

  const handleDelete = (id) =>
    setQrData((prev) => prev.filter((x) => x.id !== id));

  const columns = [
    {
      title: "م",
      key: "order",
      width: 70,
      render: (_t, _r, index) => currentStartIndex + index + 1,
    },
    { title: "#", dataIndex: "id", key: "id" },
    { title: "الكتاب", dataIndex: "book", key: "book" },
    { title: "القسم", dataIndex: "category", key: "category" },
    { title: "عدد ال QR Code", dataIndex: "count", key: "count" },
    {
      title: "إجراء",
      key: "actions",
      render: (_t, record) => (
        <div className="flex gap-2 items-center">
          <button
            onClick={() =>
              router.push(
                `/qr-code/${record.id}?count=${record.count}&book=${encodeURIComponent(
                  record.book
                )}&category=${encodeURIComponent(record.category)}`
              )
            }
            className="border rounded-md hover:bg-blue-500 hover:text-white transition-all duration-100 border-blue-500 text-blue-500 flex justify-center items-center p-2"
            title="تفاصيل"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(record.id)}
            className="border rounded-md hover:bg-red-500 hover:text-white transition-all duration-100 border-red-500 text-red-500 flex justify-center items-center p-2"
            title="حذف"
          >
            <Trash className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  const menu = (
    <Menu
      items={[
        { key: "1", icon: <Upload />, label: "استيراد" },
        { key: "2", icon: <Download />, label: "تصدير" },
      ]}
    />
  );

  return (
    <PageLayout>
      <div style={{ dir: "rtl" }}>
        <BreadcrumbsShowcase variant="pill" items={breadcrumbs} />

        <PagesHeader
          title={"إدارة QR Code "}
          subtitle={"نظّم وأدر QR Code "}
          extra={
            <div className="flex items-center gap-4 gap-reverse">
              <Dropdown overlay={menu}>
                <Button type="default" size="large">
                  خيارات
                </Button>
              </Dropdown>

              <Button
                onClick={() => setNewModal(true)}
                type="primary"
                size="large"
                icon={<Plus className="w-5 h-5" />}
              >
                إضافة دفعة QR
              </Button>
            </div>
          }
        />

        <Table
          columns={columns}
          dataSource={qrData}
          rowKey="id"
          pagination={pagination}
          className="mt-6"
          rowClassName="hover:bg-gray-50 cursor-pointer"
          onChange={(pag) =>
            setPagination({ current: pag.current, pageSize: pag.pageSize })
          }
        />

        {/* Create Batch Modal */}
        <Modal
          open={newModal}
          onCancel={() => {
            setNewModal(false);
            setBookTitle("");
            setCategoryName("");
            setCount(1);
          }}
          footer={null}
          title="إنشاء دفعة QR Code"
          className="modal"
        >
          <div className="modal-content">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label>اسم الكتاب</label>
                <input
                  type="text"
                  value={bookTitle}
                  onChange={(e) => setBookTitle(e.target.value)}
                  placeholder="أدخل اسم الكتاب"
                  className="input border border-gray-200 rounded-md p-2 w-full"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label>اسم القسم</label>
                <input
                  type="text"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  placeholder="أدخل اسم القسم"
                  className="input border border-gray-200 rounded-md p-2 w-full"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label>عدد ال QR Code</label>
                <input
                  type="number"
                  min={1}
                  value={count}
                  onChange={(e) => setCount(e.target.value)}
                  className="input border border-gray-200 rounded-md p-2 w-full"
                />
              </div>

              <Button onClick={handleGenerateQRCode} className="mt-4">
                إنشاء الدفعة
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </PageLayout>
  );
}
