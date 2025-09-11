"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams, useParams } from "next/navigation";
import { Table, Modal, Form, Input, message } from "antd";
import QRCode from "react-qr-code";
import { BarChart3, QrCode, Edit, Trash, Download } from "lucide-react";
import PageLayout from "../../../../components/layout/PageLayout";
import BreadcrumbsShowcase from "../../../../components/ui/BreadCrumbs";
import PagesHeader from "../../../../components/ui/PagesHeader";
import Button from "../../../../components/atoms/Button";

// Helper function to generate random ID
const randomId = () => String(Math.random()).slice(2, 8);


const breadcrumbs = [
  { label: "الرئيسية", href: "/", icon: BarChart3 },
  {label : "انشاء ال QR Code" , href:"/qr-code",icon:""},
  { label: "إدارة ال QR Code", href: "#", icon: "", current: true },
];

// Main Component
export default function Page() {
  const searchParams = useSearchParams();
  const params = useParams();

  const [qrList, setQrList] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [preview, setPreview] = useState(null);

  const currentStartIndex = useMemo(
    () => (pagination.current - 1) * pagination.pageSize,
    [pagination]
  );

  const countFromQuery = Number(searchParams.get("count") || "0");
  const countFromPath = Number(params?.count ?? NaN);
  const initialCount = countFromQuery || countFromPath || 0;

  useEffect(() => {
    if (qrList.length > 0 || initialCount <= 0) return;

    const items = Array.from({ length: initialCount }).map(() => {
      const id = randomId();
      const createdAt = new Date().toISOString();
      return {
        id,
        name: `QR-${id.slice(0, 4)}`,
        url: "",
        notes: "",
        createdAt,
        payload: JSON.stringify({ id, url: "", meta: {}, createdAt }),
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
      updated.payload = JSON.stringify({
        id: updated.id,
        url: updated.url || "",
        meta: { name: updated.name || "", notes: updated.notes || "" },
        createdAt: updated.createdAt,
      });

      setQrList((prev) => prev.map((q) => (q.id === updated.id ? updated : q)));
      setEditOpen(false);
      setEditing(null);
      form.resetFields();
      message.success("تم التحديث بنجاح");
    });
  };

  const removeItem = (id) => {
    setQrList((prev) => prev.filter((x) => x.id !== id));
    message.success("تم الحذف بنجاح");
  };

  const openPreview = (record) => {
    setPreview(record);
    setPreviewOpen(true);
  };

  const downloadQRCode = (record) => {
    const svg = document.getElementById(`qr-code-${record.id}`);
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      const fileName = `${record.name || "qr-code"}.png`;

      downloadLink.download = fileName;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
    message.success("جاري تحميل QR Code");
  };

  const downloadAllQRCodes = async () => {
    if (qrList.length === 0) {
      message.warning("لا توجد رموز للتحميل");
      return;
    }

    message.info(`جاري تحميل ${qrList.length} رمز، قد يستغرق بعض الوقت`);

    const downloadPromises = qrList.map((record, index) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          const svg = document.getElementById(`qr-code-${record.id}`);
          if (!svg) {
            resolve(null);
            return;
          }

          const svgData = new XMLSerializer().serializeToString(svg);
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          const img = new Image();

          img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            const pngFile = canvas.toDataURL("image/png");
            const downloadLink = document.createElement("a");
            const fileName = `${record.name || "qr-code"}.png`;

            downloadLink.download = fileName;
            downloadLink.href = pngFile;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
            resolve(true);
          };

          img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
        }, index * 300);
      });
    });

    Promise.all(downloadPromises).then(() => {
      message.success("تم تحميل جميع الرموز بنجاح");
    });
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
      title: "الاسم",
      dataIndex: "name",
      key: "name",
      render: (name) => name || "-",
    },
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
        <div className="flex flex-col items-center">
          <div
            onClick={() => openPreview(record)}
            className="cursor-pointer inline-block transition-transform hover:scale-105"
            title="اضغط للمعاينة"
          >
            <QRCode id={`qr-code-${record.id}`} value={record.payload} size={64} />
          </div>
         
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
          <button
           onClick={() => downloadQRCode(record)}
            className="border rounded-md hover:bg-green-500 hover:text-white transition-all duration-100 border-green-500 text-green-500 flex justify-center items-center p-2"
            title="تحميل"
          >
            <Download className="w-4 h-4" />
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

        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-gray-600">
            عدد الأكواد المُتولَّدة من العنوان: <b>{initialCount || 0}</b>
          </div>

          <Button onClick={downloadAllQRCodes} className="flex items-center gap-2" disabled={qrList.length === 0}>
            <Download size={16} />
            تحميل الكل
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={qrList}
          rowKey="id"
          pagination={pagination}
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
            <Form.Item
              label="الاسم"
              name="name"
              rules={[{ required: true, message: 'يرجى إدخال اسم للرمز' }]}
            >
              <Input placeholder="مثال: QR للحدث الرئيسي" />
            </Form.Item>

            <Form.Item label="الرابط (اختياري)" name="url">
              <Input placeholder="مثال: https://example.com/profile/103" />
            </Form.Item>

            <Form.Item label="ملاحظات (اختياري)" name="notes">
              <Input.TextArea rows={3} placeholder="أي ملاحظات إضافية حول هذا الرمز" />
            </Form.Item>
          </Form>
          <div className="mt-4 flex flex-col items-center justify-center">
            {editing && (
              <>
                <QRCode value={editing.payload} size={128} />
                <button
                  onClick={() => downloadQRCode(editing)}
                  className="mt-2 text-blue-600 hover:text-blue-800 flex items-center"
                >
                  <Download size={14} className="ml-1" />
                  تحميل هذا الرمز
                </button>
              </>
            )}
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
              <div className="text-sm font-medium">
                الاسم: {preview.name || "غير محدد"}
              </div>
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
              <button
                onClick={() => downloadQRCode(preview)}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
              >
                <Download size={16} className="ml-1" />
                تحميل QR Code
              </button>
            </div>
          )}
        </Modal>
      </div>
    </PageLayout>
  );
}
