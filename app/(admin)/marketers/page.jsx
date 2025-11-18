"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { Spin } from "antd";
import { BarChart3, Users2 } from "lucide-react";

import BreadcrumbsShowcase from "@/components/ui/BreadCrumbs";
import {
  handleGetAllMarketers,
  handleGenerateMarketersCode,
} from "@/lib/features/marketersSlice";
import { toast } from "react-toastify";

const breadcrumbs = [
  { label: "الرئيسية", href: "/", icon: BarChart3 },
  { label: "المسوقين", href: "/marketers", icon: Users2 },
];

function getStatusStyles(status) {
  switch (status) {
    case "pending":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "active":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "rejected":
      return "bg-rose-50 text-rose-700 border-rose-200";
    default:
      return "bg-slate-50 text-slate-600 border-slate-200";
  }
}

export default function MarketersPage() {
  const dispatch = useDispatch();
  const { marketers_list, marketers_loading, generate_code_loading } =
    useSelector((state) => state?.marketer);

  const [openCodeModal, setOpenCodeModal] = useState(false);
  const [selectedMarketer, setSelectedMarketer] = useState(null);
  const [codeForm, setCodeForm] = useState({
    status: "approved",
    discount_percentage: "",
    commission_percentage: "",
    usage_limit: "",
    expiry_date: "",
  });

  useEffect(() => {
    dispatch(handleGetAllMarketers());
  }, [dispatch]);

  const marketers = marketers_list?.data?.message ?? [];

  const handleOpenCodeModal = (marketer) => {
    setSelectedMarketer(marketer);
    setCodeForm({
      status: "approved",
      discount_percentage: "",
      commission_percentage: "",
      usage_limit: "",
      expiry_date: "",
    });
    setOpenCodeModal(true);
  };

  const handleCloseCodeModal = () => {
    setOpenCodeModal(false);
    setSelectedMarketer(null);
  };

  const handleChange = (field, value) => {
    setCodeForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmitCode = async (e) => {
    e.preventDefault();
    if (!selectedMarketer) return;

    const body = {
      marketer_id: selectedMarketer.id,
      status: codeForm.status,
      discount_percentage: Number(codeForm.discount_percentage),
      commission_percentage: Number(codeForm.commission_percentage),
      usage_limit: Number(codeForm.usage_limit),
      expiry_date: codeForm.expiry_date, // YYYY-MM-DD
    };

    try {
     const res =  await dispatch(handleGenerateMarketersCode({body})).unwrap();
     console.log(res)
     if(res?.data?.status == "success") {
        toast.success(res?.data?.message);
        handleCloseCodeModal();
     }
      // You can show toast here if you have toast lib
    } catch (err) {
      console.error("Generate code error:", err);
    }
  };

  if (marketers_loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <Spin size="large" spinning />
      </div>
    );
  }

  return (
    <div className="px-4 pb-10 pt-4 sm:px-6 lg:px-8">
      <BreadcrumbsShowcase variant="pill" items={breadcrumbs} />

      {/* Top summary card */}
      <section className="mt-6 space-y-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1 text-right">
              <p className="text-xs font-medium text-slate-500">
                لوحة تحكم المسوقين
              </p>
              <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                إدارة المسوقين
              </h1>
              <p className="text-sm text-slate-500">
                هنا يمكنك متابعة بيانات المسوقين وحالة كل حساب.
              </p>
            </div>

            <div className="flex items-center justify-end gap-4">
              <div className="rounded-xl bg-slate-50 px-4 py-2 text-right text-sm dark:bg-slate-800/70">
                <p className="text-xs text-slate-500">إجمالي المسوقين</p>
                <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {marketers.length}
                </p>
              </div>

              {generate_code_loading && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-medium text-emerald-700">
                  جاري تنفيذ طلبات الكود
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Empty state */}
        {marketers.length === 0 && (
          <div className="mt-6 flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center dark:border-slate-700 dark:bg-slate-900/60">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500 dark:bg-slate-800">
              <Users2 className="h-6 w-6" />
            </div>
            <h2 className="mb-2 text-base font-semibold text-slate-900 dark:text-slate-100">
              لا يوجد مسوقين حتى الآن
            </h2>
            <p className="max-w-md text-sm text-slate-500">
              عند تسجيل مسوقين جدد سوف يظهرون هنا مع جميع بياناتهم البنكية
              ومعلومات التواصل.
            </p>
            <button
              type="button"
              onClick={() => dispatch(handleGetAllMarketers())}
              className="mt-5 rounded-full bg-slate-900 px-5 py-2 text-sm font-medium text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400"
            >
              إعادة تحميل البيانات
            </button>
          </div>
        )}

        {/* Marketers grid */}
        {marketers.length > 0 && (
          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {marketers.map((marketer) => (
              <article
                key={marketer.id}
                className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 text-right shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/80"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                      {marketer.name || "مسوق بدون اسم"}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {marketer.city || "مدينة غير محددة"}
                    </p>
                  </div>

                  <div
                    className={
                      "rounded-full border px-3 py-1 text-[11px] font-medium " +
                      getStatusStyles(marketer.status)
                    }
                  >
                    {marketer.status === "pending"
                      ? "قيد المراجعة"
                      : marketer.status === "active"
                      ? "مفعل"
                      : marketer.status === "rejected"
                      ? "مرفوض"
                      : "غير محدد"}
                  </div>
                </div>

                {/* Contact info */}
                <div className="mt-3 space-y-2 rounded-xl bg-slate-50 p-3 text-xs text-slate-600 dark:bg-slate-800/80 dark:text-slate-200">
                  <div className="flex justify-between gap-2">
                    <span className="font-medium">البريد الإلكتروني</span>
                    <span className="truncate">{marketer.email}</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="font-medium">رقم واتساب</span>
                    <span>{marketer.whatsapp_number || "-"}</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="font-medium">الرقم القومي</span>
                    <span>{marketer.national_id || "-"}</span>
                  </div>
                </div>

                {/* Bank info */}
                <div className="mt-3 space-y-2 rounded-xl bg-slate-50 p-3 text-xs text-slate-600 dark:bg-slate-800/80 dark:text-slate-200">
                  <div className="flex justify-between gap-2">
                    <span className="font-medium">صاحب الحساب</span>
                    <span>{marketer.account_owner || "-"}</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="font-medium">رقم الحساب</span>
                    <span className="truncate">
                      {marketer.account_number || "-"}
                    </span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="font-medium">IBAN</span>
                    <span className="truncate">
                      {marketer.iban_number || "-"}
                    </span>
                  </div>
                </div>

                {/* Footer actions */}
                <div className="mt-3 flex items-center justify-between gap-3">
                  <div className="max-w-[55%] text-[11px] text-slate-500 line-clamp-2">
                    {marketer.description ||
                      "لا يوجد وصف متاح لهذا المسوق في الوقت الحالي."}
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    {marketer.cv && (
                      <Link
                        href={marketer.cv}
                        target="_blank"
                        className="inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-1.5 text-[11px] font-medium text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400"
                      >
                        عرض السيرة الذاتية
                      </Link>
                    )}

                    <button
                      type="button"
                      onClick={() => handleOpenCodeModal(marketer)}
                      className="inline-flex items-center justify-center rounded-full border border-slate-300 px-3 py-1.5 text-[11px] font-medium text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-600 dark:text-slate-100 dark:hover:bg-slate-800"
                    >
                      إنشاء كود خصم
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Generate Code Modal */}
      {openCodeModal && selectedMarketer && (
        <div 
        onClick={(e) => {
           e.stopPropagation()
           setOpenCodeModal(false)
        }}
        className="fixed inset-0  z-40 flex items-center justify-center bg-black/40">
          <div 
           onClick={(e) => e.stopPropagation()}
           className="w-full max-w-md rounded-2xl bg-white p-10 text-right shadow-xl dark:bg-slate-900">
            <h2 className="mb-1 text-base font-semibold text-slate-900 dark:text-slate-100">
              إنشاء كود للمسوق: {selectedMarketer.name}
            </h2>
            <p className="mb-4 text-xs text-slate-500">
              ادخل تفاصيل الكود ثم اضغط حفظ.
            </p>

            <form onSubmit={handleSubmitCode} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="block text-slate-600">الحالة</label>
                <select
                  value={codeForm.status}
                  onChange={(e) => handleChange("status", e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-slate-400"
                >
                  <option value="approved">موافق عليه</option>
                  <option value="pending">قيد المراجعة</option>
                  <option value="disabled">موقوف</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-slate-600">
                    نسبة الخصم (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={codeForm.discount_percentage}
                    onChange={(e) =>
                      handleChange("discount_percentage", e.target.value)
                    }
                    className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-slate-400"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-slate-600">
                    نسبة العمولة (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={codeForm.commission_percentage}
                    onChange={(e) =>
                      handleChange("commission_percentage", e.target.value)
                    }
                    className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-slate-400"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-slate-600">
                    عدد مرات الاستخدام
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={codeForm.usage_limit}
                    onChange={(e) =>
                      handleChange("usage_limit", e.target.value)
                    }
                    className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-slate-400"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-slate-600">تاريخ الانتهاء</label>
                  <input
                    type="date"
                    value={codeForm.expiry_date}
                    onChange={(e) =>
                      handleChange("expiry_date", e.target.value)
                    }
                    className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-slate-400"
                    required
                  />
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleCloseCodeModal}
                  className="rounded-full border border-slate-300 px-4 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={generate_code_loading}
                  className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-1.5 text-xs font-medium text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {generate_code_loading ? "جاري الحفظ..." : "حفظ الكود"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
