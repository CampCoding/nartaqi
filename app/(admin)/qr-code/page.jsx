"use client";
import Button from "@/components/atoms/Button";
import PageLayout from "@/components/layout/PageLayout";
import BreadcrumbsShowcase from "@/components/ui/BreadCrumbs";
import PagesHeader from "@/components/ui/PagesHeader";
import { Modal, Table, Dropdown, Menu, Select } from "antd";
import {
  BarChart3,
  Download,
  Edit,
  Eye,
  Plus,
  QrCode,
  Trash,
  Upload,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";

const breadcrumbs = [
  { label: "الرئيسية", href: "/", icon: BarChart3 },
  { label: "QR Code", href: "#", icon: QrCode, current: true },
];

const data = [
  {
    id: 1,
    title: "Book 1",
    categories: [
      {
        id: 1,
        title: "Fiction",
        subcategories: [
          { id: 1, title: "Fantasy" },
          { id: 2, title: "Science Fiction" },
          { id: 3, title: "Adventure" },
        ],
      },
      {
        id: 2,
        title: "Non-fiction",
        subcategories: [
          { id: 4, title: "Biography" },
          { id: 5, title: "Self-help" },
          { id: 6, title: "History" },
        ],
      },
    ],
  },
  {
    id: 2,
    title: "Book 2",
    categories: [
      {
        id: 3,
        title: "Children",
        subcategories: [
          { id: 7, title: "Picture Books" },
          { id: 8, title: "Early Reader" },
          { id: 9, title: "Chapter Books" },
        ],
      },
      {
        id: 4,
        title: "Educational",
        subcategories: [
          { id: 10, title: "Science" },
          { id: 11, title: "Mathematics" },
          { id: 12, title: "Language Arts" },
        ],
      },
    ],
  },
  {
    id: 3,
    title: "Book 3",
    categories: [
      {
        id: 5,
        title: "Mystery",
        subcategories: [
          { id: 13, title: "Detective" },
          { id: 14, title: "Thriller" },
        ],
      },
      {
        id: 6,
        title: "Romance",
        subcategories: [
          { id: 15, title: "Contemporary" },
          { id: 16, title: "Historical" },
          { id: 17, title: "Romantic Comedy" },
        ],
      },
    ],
  },
];

export default function Page() {
  const router = useRouter();

  // Modal + form state
  const [newModal, setNewModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [count, setCount] = useState(1);

  // Data (batches of QR codes)
  const [qrData, setQrData] = useState([]);

  // Keep pagination state so we can render a correct order column
  const [pagination, setPagination] = useState({ current: 1, pageSize: 5 });
  const currentStartIndex = useMemo(
    () => (pagination.current - 1) * pagination.pageSize,
    [pagination]
  );

  // Derived helpers
  const selectedBookObj = useMemo(
    () => data.find((b) => b.id === selectedBook) || null,
    [selectedBook]
  );

  const handleGenerateQRCode = () => {
    if (!selectedBookObj) {
      alert("اختر الكتاب أولاً");
      return;
    }
    const n = parseInt(String(count), 10);
    if (!n || n <= 0) {
      alert("أدخل عدداً صحيحاً أكبر من صفر");
      return;
    }

    // هذا السجل يمثل "دفعة" إنشاء QR، سيتم فتح تفاصيلها في صفحة منفصلة
    const batch = {
      id: Date.now(),
      bookId: selectedBookObj.id,
      book: selectedBookObj.title,
      count: n,
      createdAt: new Date().toISOString(),
    };

    setQrData((prev) => [...prev, batch]);
    // reset
    setNewModal(false);
    setSelectedBook(null);
    setCount(1);
  };

  const handleDelete = (id) => setQrData((prev) => prev.filter((x) => x.id !== id));

  const columns = [
    {
      title: "م",
      key: "order",
      width: 70,
      render: (_t, _r, index) => currentStartIndex + index + 1,
    },
    { title: "#", dataIndex: "id", key: "id" },
    { title: "الكتاب", dataIndex: "book", key: "book" },
    { title: "عدد ال QR Code", dataIndex: "count", key: "count" },
    {
      title: "إجراء",
      key: "actions",
      render: (_t, record) => (
        <div className="flex gap-2 items-center">
          <button
            onClick={() => router.push(`/qr-code/${record.id}?count=${record.count}`)}
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
    <Menu>
      <Menu.Item key="1" icon={<Upload />}>استيراد</Menu.Item>
      <Menu.Item key="2" icon={<Download />}>تصدير</Menu.Item>
    </Menu>
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
          onChange={(pag) => setPagination({ current: pag.current, pageSize: pag.pageSize })}
        />

        {/* Create Batch Modal */}
        <Modal
          open={newModal}
          onCancel={() => {
            setNewModal(false);
            setSelectedBook(null);
            setCount(1);
          }}
          footer={null}
          title="إنشاء دفعة QR Code"
          className="modal"
        >
          <div className="modal-content">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label>الكتاب</label>
                <Select
                  placeholder="اختر الكتاب"
                  value={selectedBook}
                  onChange={setSelectedBook}
                  options={data?.map((item) => ({ label: item.title, value: item.id }))}
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
