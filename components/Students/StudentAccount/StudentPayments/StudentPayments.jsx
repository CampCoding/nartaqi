"use client";
import React, { useState } from "react";

export default function StudentPayment() {
  // 🔹 بيانات وهمية كمثال – بعد كده هتربطها بالـ API بتاعك
  const [status, setStatus] = useState("pending");

  const payment = {
    id: "#PAY-2025-00123",
    student: {
      name: "Ahmed Mohamed",
      email: "ahmed@example.com",
      phone: "01012345678",
    },
    createdAt: "2025-12-06 14:32",
    method: "Bank Transfer",
    receiptImageUrl:
      "https://via.placeholder.com/600x400.png?text=Receipt+Preview", // حط لينك صورة الوصل الحقيقي هنا
    courses: [
      {
        id: 1,
        title: "Full Stack Web Development",
        price: 2500,
      },
      {
        id: 2,
        title: "React Advanced Course",
        price: 1500,
      },
    ],
    discount: 0,
    currency: "EGP",
  };

  const total = payment.courses.reduce((sum, c) => sum + c.price, 0) - payment.discount;

  // 🔹 هنا هتربطهم بـ API
  const handleApprove = () => {
    // مثال بسيط – استبدله بـ fetch / axios
    console.log("Approve payment", payment.id);
    setStatus("approved");
  };

  const handleReject = () => {
    console.log("Reject payment", payment.id);
    setStatus("rejected");
  };

  const statusColor =
    status === "approved"
      ? "bg-emerald-100 text-emerald-700 border-emerald-300"
      : status === "rejected"
      ? "bg-red-100 text-red-700 border-red-300"
      : "bg-yellow-100 text-yellow-700 border-yellow-300";

  const statusLabel =
    status === "approved" ? "تم تأكيد الدفع" : status === "rejected" ? "تم رفض الدفع" : "قيد المراجعة";

  return (
    <div className="min-h-screen bg-slate-50 flex items-start justify-center py-10 px-4">
      <div className="w-full max-w-6xl bg-white  rounded-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-slate-800">
              مراجعة عملية الدفع
            </h1>
            <p className="text-sm text-slate-500">
              رقم العملية: <span className="font-medium">{payment.id}</span>
            </p>
          </div>

          <div className="flex gap-3 items-center mt-2 sm:mt-0">
            <span
              className={`px-3 py-1 text-xs font-semibold rounded-full border ${statusColor}`}
            >
              {statusLabel}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Receipt Image */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-800">
              صورة الوصل / التحويل
            </h2>

            <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-100">
              <div className="bg-slate-900 text-slate-100 text-xs px-3 py-2 flex justify-between items-center">
                <span>Receipt Preview</span>
                <span className="opacity-70">Click to open in new tab</span>
              </div>

              <a
                href={payment.receiptImageUrl}
                target="_blank"
                rel="noreferrer"
                className="block"
              >
                <img
                  src={payment.receiptImageUrl}
                  alt="Receipt"
                  className="w-full h-80 object-contain bg-slate-50"
                />
              </a>
            </div>

          </div>

          {/* Right: Details + Courses + Actions */}
          <div className="space-y-5">
            {/* Student Info */}
            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
              <h2 className="text-sm font-semibold text-slate-800 mb-3">
                بيانات الطالب
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-slate-500">الاسم</p>
                  <p className="font-medium text-slate-800">
                    {payment.student.name}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500">التليفون</p>
                  <p className="font-medium text-slate-800">
                    {payment.student.phone}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500">الإيميل</p>
                  <p className="font-medium text-slate-800 break-all">
                    {payment.student.email}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500">تاريخ الطلب</p>
                  <p className="font-medium text-slate-800">
                    {payment.createdAt}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500">طريقة الدفع</p>
                  <p className="font-medium text-slate-800">
                    {payment.method}
                  </p>
                </div>
              </div>
            </div>

            {/* Courses List */}
            <div className="border border-slate-200 rounded-xl p-4">
              <h2 className="text-sm font-semibold text-slate-800 mb-3">
                الكورسات فى عملية الدفع دي
              </h2>
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-slate-100">
                    <tr className="text-right text-slate-600">
                      <th className="py-2 px-3">الكورس</th>
                      <th className="py-2 px-3">السعر</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payment.courses.map((course) => (
                      <tr
                        key={course.id}
                        className="border-t border-slate-100 hover:bg-slate-50"
                      >
                        <td className="py-2 px-3 font-medium text-slate-800">
                          {course.title}
                        </td>
                        <td className="py-2 px-3 text-slate-700">
                          {course.price.toLocaleString()} {payment.currency}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Summary */}
              <div className="mt-4 flex flex-col gap-1 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>الإجمالي قبل الخصم</span>
                  <span>
                    {payment.courses
                      .reduce((sum, c) => sum + c.price, 0)
                      .toLocaleString()}{" "}
                    {payment.currency}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>الخصم</span>
                  <span>
                    {payment.discount.toLocaleString()} {payment.currency}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-semibold text-slate-900 mt-1">
                  <span>الإجمالي المطلوب</span>
                  <span>
                    {total.toLocaleString()} {payment.currency}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={handleApprove}
                className="flex-1 inline-flex items-center justify-center px-4 py-2.5 rounded-xl text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition disabled:opacity-60"
                disabled={status === "approved"}
              >
                تأكيد الدفع (Approve)
              </button>

              <button
                onClick={handleReject}
                className="flex-1 inline-flex items-center justify-center px-4 py-2.5 rounded-xl text-sm font-semibold border border-red-300 text-red-700 bg-red-50 hover:bg-red-100 transition disabled:opacity-60"
                disabled={status === "rejected"}
              >
                رفض الدفع (Reject)
              </button>
            </div>

            <p className="text-xs text-slate-500">
              بعد الضغط على تأكيد / رفض، اربط الزرار ده بـ API يحدّث حالة
              الاشتراك عند الطالب ويفعل له الكورسات أو يلغي الطلب.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
