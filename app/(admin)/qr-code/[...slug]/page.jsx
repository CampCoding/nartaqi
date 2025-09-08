"use client";
import React, { useEffect, useMemo, useState } from "react";
import PageLayout from "../../../../components/layout/PageLayout";
import BreadcrumbsShowcase from "../../../../components/ui/BreadCrumbs";
import { BarChart3, QrCode, Edit, Trash } from "lucide-react";
import PagesHeader from "../../../../components/ui/PagesHeader";
import Button from "../../../../components/atoms/Button";
import { Modal, Table, Input, Form } from "antd";
import QRCode from "react-qr-code";
import { useSearchParams, useParams } from "next/navigation";

const breadcrumbs = [
  { label: "الرئيسية", href: "/", icon: BarChart3 },
  { label: "QR Code", href: "/qr-code", icon: QrCode },
  { label: "All Qr Code", href: "#", current: true, icon: "" },
];

// ✅ إصلاح: توليد ID كسلسلة (بدلاً من Math.random().slice)
const randomId = () => String(Math.random()).slice(2, 8);

export default function Page() {
  const searchParams = useSearchParams();
  const params = useParams();

  // State
  const [qrList, setQrList] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

  // Edit modal state
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();

  // Preview modal state (عند الضغط على QR)
  const [previewOpen, setPreviewOpen] = useState(false);
  const [preview, setPreview] = useState(null);

  const currentStartIndex = useMemo(
    () => (pagination.current - 1) * pagination.pageSize,
    [pagination]
  );

  const countFromQuery = Number(searchParams.get("count") || "0");
  const countFromPath = Number((params)?.count ?? NaN);
  const initialCount =
    Number.isFinite(countFromQuery) && countFromQuery > 0
      ? countFromQuery
      : Number.isFinite(countFromPath) && countFromPath > 0
      ? countFromPath
      : 0;

  useEffect(() => {
    if (qrList.length > 0) return; // don't duplicate on re-renders
    if (initialCount <= 0) return;

    const items = Array.from({ length: initialCount }).map(() => {
      const id = randomId();
      const createdAt = new Date().toISOString();
      const payloadObj = { id, url: "", meta: {}, createdAt };
      return {
        id,
        name: "",
        url: "",
        notes: "",
        createdAt,
        payload: JSON.stringify(payloadObj),
      };
    });

    setQrList(items);
  }, [initialCount, qrList.length]);

  const openEdit = (record) => {
    setEditing(record);
    form.setFieldsValue({
      name: record.name,
      url: record.url,
      notes: record.notes,
    });
    setEditOpen(true);
  };

  const saveEdit = () => {
    form.validateFields().then((values) => {
      const updated = { ...editing, ...values };
      const payloadObj = {
        id: updated.id,
        url: updated.url || "",
        meta: { name: updated.name || "", notes: updated.notes || "" },
        createdAt: updated.createdAt,
      };
      updated.payload = JSON.stringify(payloadObj);

      setQrList((prev) => prev.map((q) => (q.id === updated.id ? updated : q)));
      setEditOpen(false);
      setEditing(null);
      form.resetFields();
    });
  };

  const removeItem = (id) =>
    setQrList((prev) => prev.filter((x) => x.id !== id));

  // فتح مودال المعاينة
  const openPreview = (record) => {
    setPreview(record);
    setPreviewOpen(true);
  };

  const columns = [
    {
      title: "م",
      key: "order",
      width: 60,
      render: (_t, _r, index) => currentStartIndex + index + 1,
    },
    { title: "الكود", dataIndex: "id", key: "id" },
    {
      title: "الرابط",
      dataIndex: "url",
      key: "url",
      render: (v) => v || "-",
    },
    {
      title: "QR",
      key: "qr",
      render: (_t, record) => (
        <div
          onClick={() => openPreview(record)}
          className="cursor-pointer inline-block transition-transform hover:scale-105"
          title="اضغط للمعاينة"
        >
          <QRCode value={record.payload} size={64} />
        </div>
      ),
    },
    {
      title: "إجراء",
      key: "actions",
      render: (_t, record) => (
        <div className="flex gap-2 items-center">
          <button
            onClick={() => openEdit(record)}
            className="border rounded-md hover:bg-blue-500 hover:text-white transition-all duration-100 border-blue-500 text-blue-500 flex justify-center items-center p-2"
            title="تعديل"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => removeItem(record.id)}
            className="border rounded-md hover:bg-red-500 hover:text-white transition-all duration-100 border-red-500 text-red-500 flex justify-center items-center p-2"
            title="حذف"
          >
            <Trash className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <PageLayout>
      <div style={{ dir: "rtl" }}>
        <BreadcrumbsShowcase variant="pill" items={breadcrumbs} />
        <PagesHeader title={"إدارة QR Code "} subtitle={"نظّم وأدر QR Code "} />

        <div className="text-sm text-gray-600 mt-2">
          عدد الأكواد المُتولَّدة من العنوان: <b>{initialCount || 0}</b>
        </div>

        <Table
          columns={columns}
          dataSource={qrList}
          rowKey="id"
          pagination={pagination }
          className="mt-4"
          rowClassName="hover:bg-gray-50"
          onChange={(pag) =>
            setPagination({ current: pag.current, pageSize: pag.pageSize })
          }
        />

        {/* Modal التعديل */}
        <Modal
          open={editOpen}
          onCancel={() => {
            setEditOpen(false);
            setEditing(null);
            form.resetFields();
          }}
          onOk={saveEdit}
          okText="حفظ"
          cancelText="إلغاء"
          title="تعديل بيانات الـ QR"
        >
          <Form form={form} layout="vertical">
            <Form.Item label="الرابط (اختياري)" name="url">
              <Input placeholder="مثال: https://example.com/profile/103" />
            </Form.Item>
          </Form>
          <div className="mt-4 flex items-center justify-center">
            {editing && <QRCode value={editing.payload} size={128} />}
          </div>
        </Modal>

        {/* Modal المعاينة عند الضغط على QR */}
        <Modal
          open={previewOpen}
          footer={null}
          onCancel={() => {
            setPreviewOpen(false);
            setPreview(null);
          }}
          title="معاينة QR"
        >
          {preview && (
            <div className="flex flex-col items-center gap-3">
              <QRCode value={preview.payload} size={256} />
              <div className="text-xs text-gray-500 font-mono break-all">
                الكود: {preview.id}
              </div>
              {preview.url ? (
                <a
                  href={preview.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 hover:underline break-all"
                >
                  فتح الرابط
                </a>
              ) : null}
            </div>
          )}
        </Modal>
      </div>
    </PageLayout>
  );
}
