"use client";

import React, { useState } from "react";
import Button from "../../../components/atoms/Button";

import {
  BarChart3,
  CreditCard,
  Search,
  Filter,
  Download,
  Upload,
  Eye,
  CheckCircle,
  XCircle,
  Check,
  Clock,
  AlertCircle,
  Phone,
  User,
  Calendar,
  DollarSign,
  FileText,
  MoreVertical,
  Edit,
  Trash2,
  RefreshCw,
  FileSpreadsheet,
  Image,
  ExternalLink,
  ChevronDown,
  // Check,
  X,
  AlertTriangle,
  Copy,
  Send,
} from "lucide-react";
import PageLayout from "@/components/layout/PageLayout";
import BreadcrumbsShowcase from "@/components/ui/BreadCrumbs";
import PagesHeader from "@/components/ui/PagesHeader";
import PaymentTable from "./PaymentTable";

const PaymentConfirmationPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPaymentMethod, setFilterPaymentMethod] = useState("all");
  const [selectedPayments, setSelectedPayments] = useState([]);
  const [bulkActionModal, setBulkActionModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Mock payment data with more realistic scenarios
  const [payments, setPayments] = useState([
    {
      id: 1,
      studentName: "أحمد محمد علي الشمري",
      phone: "+966501234567",
      email: "ahmed.alshammari@email.com",
      courseName: "دورة الرخصة المهنية للمعلمين",
      amount: 1500,
      paymentMethod: "online",
      status: "confirmed",
      paymentDate: "2024-01-15T10:30:00",
      receiptImage: "/images/receipt1.jpg",
      notes: "تم الدفع بنجاح عبر بطاقة الائتمان - Visa ****1234",
      transactionId: "TXN-001-2024",
      bankReference: "REF123456789",
      confirmationDate: "2024-01-15T10:35:00",
      confirmedBy: "أحمد المدير",
      gatewayReference: "8276352767",
    },
    {
      id: 2,
      studentName: "فاطمة أحمد الزهراني",
      phone: "+966507891234",
      email: "fatima.alzahrani@email.com",
      courseName: "دورة التطوير المهني المستمر",
      amount: 1200,
      paymentMethod: "bank_transfer",
      status: "pending",
      paymentDate: "2024-01-14T14:20:00",
      receiptImage: "/images/receipt2.jpg",
      notes: "تحويل بنكي من البنك الأهلي - في انتظار التأكيد",
      transactionId: "TXN-002-2024",
      bankReference: "BNK987654321",
      pendingReason: "صورة الإيصال غير واضحة",
      gatewayReference: "8276352767",
    },
    {
      id: 3,
      studentName: "محمد عبدالله النمر",
      phone: "+966512345678",
      email: "mohammed.alnamir@email.com",
      courseName: "دورة القيادة التربوية",
      amount: 800,
      paymentMethod: "online",
      status: "failed",
      paymentDate: "2024-01-13T16:45:00",
      receiptImage: null,
      notes: "فشلت عملية الدفع - بطاقة منتهية الصلاحية، رصيد غير كافي",
      transactionId: "TXN-003-2024",
      failureReason: "INSUFFICIENT_FUNDS",
      retryAttempts: 3,
      gatewayReference: "8276352767",
    },

    {
      id: 5,
      studentName: "عمر يوسف الغامدي",
      phone: "+966543216789",
      email: "omar.alghamdi@email.com",
      courseName: "دورة التطوير المهني المستمر",
      amount: 1200,
      paymentMethod: "online",
      status: "review",
      paymentDate: "2024-01-11T13:30:00",
      receiptImage: "/images/receipt5.jpg",
      notes: "دفع إلكتروني - يحتاج مراجعة إضافية للتأكد من صحة البيانات",
      transactionId: "TXN-005-2024",
      reviewReason: "مبلغ مختلف عن المطلوب",
      gatewayReference: "8276352767",
    },
    {
      id: 6,
      studentName: "نورا سليم البلوي",
      phone: "+966556789012",
      email: "noura.albalawi@email.com",
      courseName: "دورة القيادة التربوية",
      amount: 800,
      paymentMethod: "bank_transfer",
      status: "rejected",
      paymentDate: "2024-01-10T11:45:00",
      receiptImage: "/images/receipt6.jpg",
      notes: "تم رفض الدفع - إيصال مكرر أو مزيف",
      transactionId: "TXN-006-2024",
      rejectionReason: "مستند مكرر",
      rejectedBy: "أحمد المدير",
      rejectionDate: "2024-01-11T08:30:00",
      gatewayReference: "8276352767",
    },
  ]);

  const getStatusLabel = (status) => {
    switch (status) {
      case "confirmed":
        return "مؤكد";
      case "pending":
        return "في الانتظار";
      case "failed":
        return "فشل";
      case "review":
        return "قيد المراجعة";
      case "rejected":
        return "مرفوض";
      default:
        return status;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="w-4 h-4" />;
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "failed":
        return <XCircle className="w-4 h-4" />;
      case "review":
        return <AlertCircle className="w-4 h-4" />;
      case "rejected":
        return <X className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getPaymentMethodLabel = (method) => {
    switch (method) {
      case "online":
        return "دفع إلكتروني";
      case "bank_transfer":
        return "تحويل بنكي";

      default:
        return method;
    }
  };

  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case "online":
        return <CreditCard className="w-4 h-4" />;
      case "bank_transfer":
        return <FileText className="w-4 h-4" />;
      default:
        return <CreditCard className="w-4 h-4" />;
    }
  };

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.phone.includes(searchTerm) ||
      payment.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || payment.status === filterStatus;
    const matchesMethod =
      filterPaymentMethod === "all" ||
      payment.paymentMethod === filterPaymentMethod;

    return matchesSearch && matchesStatus && matchesMethod;
  });

  const stats = [
    {
      title: "إجمالي المدفوعات",
      value: payments.length,
      icon: CreditCard,
      color: "blue",
      details: `${payments
        .reduce((sum, p) => sum + p.amount, 0)
        .toLocaleString()} ر.س`,
    },
    {
      title: "المدفوعات المؤكدة",
      value: payments.filter((p) => p.status === "confirmed").length,
      icon: CheckCircle,
      color: "green",
      details: `${payments
        .filter((p) => p.status === "confirmed")
        .reduce((sum, p) => sum + p.amount, 0)
        .toLocaleString()} ر.س`,
    },
    {
      title: "في الانتظار",
      value: payments.filter((p) => p.status === "pending").length,
      icon: Clock,
      color: "yellow",
      details: `${payments
        .filter((p) => p.status === "pending")
        .reduce((sum, p) => sum + p.amount, 0)
        .toLocaleString()} ر.س`,
    },
    {
      title: "تحتاج مراجعة",
      value: payments.filter((p) =>
        ["failed", "review", "rejected"].includes(p.status)
      ).length,
      icon: AlertTriangle,
      color: "red",
      details: `${payments
        .filter((p) => ["failed", "review", "rejected"].includes(p.status))
        .reduce((sum, p) => sum + p.amount, 0)
        .toLocaleString()} ر.س`,
    },
  ];

  const handleBulkAction = (action) => {
    setIsLoading(true);
    setTimeout(() => {
      if (action === "confirm") {
        setPayments((prev) =>
          prev.map((payment) =>
            selectedPayments.includes(payment.id)
              ? {
                  ...payment,
                  status: "confirmed",
                  confirmationDate: new Date().toISOString(),
                  confirmedBy: "المسؤول",
                }
              : payment
          )
        );
      } else if (action === "reject") {
        setPayments((prev) =>
          prev.map((payment) =>
            selectedPayments.includes(payment.id)
              ? {
                  ...payment,
                  status: "rejected",
                  rejectionDate: new Date().toISOString(),
                  rejectedBy: "المسؤول",
                }
              : payment
          )
        );
      }
      setSelectedPayments([]);
      setBulkActionModal(false);
      setIsLoading(false);
    }, 1500);
  };

  const updatePaymentStatus = (paymentId, newStatus, notes) => {
    setPayments((prev) =>
      prev.map((payment) =>
        payment.id === paymentId
          ? {
              ...payment,
              status: newStatus,
              notes: notes || payment.notes,
              confirmationDate:
                newStatus === "confirmed"
                  ? new Date().toISOString()
                  : payment.confirmationDate,
              confirmedBy:
                newStatus === "confirmed" ? "المسؤول" : payment.confirmedBy,
            }
          : payment
      )
    );
  };

  const StatsCard = ({ stat }) => {
    const IconComponent = stat.icon;
    return (
      <div className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-all duration-200 cursor-pointer">
        <div className="flex items-center justify-between mb-4">
          <div
            className={`w-12 h-12 bg-${stat.color}-100 rounded-xl flex items-center justify-center`}
          >
            <IconComponent className={`w-6 h-6 text-${stat.color}-600`} />
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-600">{stat.title}</p>
          </div>
        </div>
        <div className="pt-2 border-t border-gray-50">
          <p className="text-xs text-gray-500">{stat.details}</p>
        </div>
      </div>
    );
  };

  const BulkActionModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">إجراء جماعي</h2>
          <p className="text-sm text-gray-600 mt-1">
            تم تحديد {selectedPayments.length} من المدفوعات
          </p>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleBulkAction("confirm")}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <CheckCircle className="w-5 h-5" />
              تأكيد المحدد
            </button>
            <button
              onClick={() => handleBulkAction("reject")}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <X className="w-5 h-5" />
              رفض المحدد
            </button>
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <button
              onClick={() => setBulkActionModal(false)}
              className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              إلغاء
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // =========================
  // Excel Export (filtered)
  // =========================
  const handleExportExcel = async () => {
    try {
      setIsLoading(true);
      const XLSX = await import("xlsx");

      // Column config (Arabic headers)
      const columns = [
        { header: "ID", key: "id" },
        { header: "اسم الطالب", key: "studentName" },
        { header: "الهاتف", key: "phone" },
        { header: "البريد الإلكتروني", key: "email" },
        { header: "الدورة", key: "courseName" },
        { header: "طريقة الدفع", key: "paymentMethodLabel" },
        { header: "الحالة", key: "statusLabel" },
        { header: "المبلغ", key: "amount" },
        { header: "تاريخ الدفع", key: "paymentDate" },
        { header: "تاريخ التأكيد", key: "confirmationDate" },
        { header: "أكد بواسطة", key: "confirmedBy" },
        { header: "رقم العملية", key: "transactionId" },
        { header: "مرجع البنك", key: "bankReference" },
        { header: "سبب", key: "reason" },
        { header: "ملاحظات", key: "notes" },
        { header: "صورة الإيصال", key: "receiptImage" },
      ];

      const toRow = (p) => ({
        id: p.id,
        studentName: p.studentName || "",
        phone: String(p.phone ?? ""),
        email: p.email || "",
        courseName: p.courseName || "",
        paymentMethodLabel: getPaymentMethodLabel(p.paymentMethod),
        statusLabel: getStatusLabel(p.status),
        amount: typeof p.amount === "number" ? p.amount : Number(p.amount) || 0,
        paymentDate: p.paymentDate ? new Date(p.paymentDate) : "",
        confirmationDate: p.confirmationDate
          ? new Date(p.confirmationDate)
          : "",
        confirmedBy: p.confirmedBy || p.receivedBy || "",
        transactionId: p.transactionId || "",
        bankReference: p.bankReference || "",
        reason:
          p.pendingReason ||
          p.failureReason ||
          p.reviewReason ||
          p.rejectionReason ||
          "",
        notes: p.notes || "",
        receiptImage: p.receiptImage || "",
      });

      const rows = filteredPayments.map(toRow);

      const ordered = rows.map((r) => {
        const o = {};
        columns.forEach((c) => (o[c.header] = r[c.key]));
        return o;
      });

      const ws = XLSX.utils.json_to_sheet(ordered, {
        cellDates: true,
        dateNF: "yyyy-mm-dd hh:mm",
      });

      // Autosize columns
      ws["!cols"] = columns.map((c) => {
        const headerLen = c.header.length;
        const maxCell = Math.max(
          headerLen,
          ...rows.map((r) => String(r[c.key] ?? "").length)
        );
        return { wch: Math.min(maxCell + 2, 50) };
      });

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "المدفوعات (بعد الفلترة)");

      const today = new Date().toISOString().slice(0, 10);
      XLSX.writeFile(wb, `payments-${today}.xlsx`);

      // Done
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const breadcrumbs = [
    { label: "الرئيسية", href: "/", icon: BarChart3 },
    { label: "تأكيد الدفع", href: "#", icon: CreditCard, current: true },
  ];

  return (
    <PageLayout>
      <div className="p-6 space-y-6">
        <BreadcrumbsShowcase variant="pill" items={breadcrumbs} />

        <PagesHeader
          title="تأكيد الدفع"
          subtitle="نظّم تأكيد الدفع  "
          extra={
            <div className="flex items-center gap-4 gap-reverse">
              {/* <Button type="default" icon={<Uploa className="w-4 h-4" />}>
                استيراد
              </Button> */}
              <Button
                type="secondary"
                icon={<Download className="w-4 h-4" />}
                onClick={handleExportExcel}
                loading={isLoading}
              >
                تصدير
              </Button>
              {/* <Button onClick={() => setNewModal(true)} type="primary" size="large" icon={<Plus className="w-5 h-5" />}>
                إضافة سؤال جديد
              </Button> */}
            </div>
          }
        />

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatsCard key={index} stat={stat} />
          ))}
        </div>

        {/* Filters */}
        <div className="grid grid-cols-[8fr_2fr_2fr] items-center gap-4 mb-6">
          <input
            type="text"
            placeholder="بحث"
            className="w-1/3 w-full px-4 py-2 border border-gray-300 rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 w-full border border-gray-300 rounded-lg"
          >
            <option value="all">الكل</option>
            <option value="confirmed">مؤكد</option>
            <option value="pending">في الانتظار</option>
            <option value="failed">فشل</option>
            <option value="review">قيد المراجعة</option>
            <option value="rejected">مرفوض</option>
          </select>

          <select
            value={filterPaymentMethod}
            onChange={(e) => setFilterPaymentMethod(e.target.value)}
            className="px-4 py-2 w-full border border-gray-300 rounded-lg"
          >
            <option value="all">الكل</option>
            <option value="online">دفع إلكتروني</option>
            <option value="bank_transfer">تحويل بنكي</option>
          </select>
        </div>

        {/* Payments Table */}
        <div className="space-y-6">
          {filteredPayments.map((payment) => (
            <PaymentTable
              key={payment.id}
              updatePaymentStatus={updatePaymentStatus}
              getPaymentMethodIcon={getPaymentMethodIcon}
              getStatusIcon={getStatusIcon}
              getPaymentMethodLabel={getPaymentMethodLabel}
              getStatusLabel={getStatusLabel}
              payment={payment}
            />
          ))}
        </div>

        {bulkActionModal && <BulkActionModal />}
      </div>
    </PageLayout>
  );
};

export default PaymentConfirmationPage;
