"use client";
import { Phone, User , Check , X } from "lucide-react";
import Image from "next/image";
import React from "react";

export default function PaymentTable({payment , updatePaymentStatus , getPaymentMethodIcon , getPaymentMethodLabel , getStatusIcon , getStatusLabel}) {
  return (
    <div className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-md transition-all duration-200">
      <div className="flex items-center gap-4">
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-6 gap-4 items-center">
          {/* Student Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">
                  {payment.studentName}
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="w-3 h-3" />
                  <span className="truncate">{payment.phone}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Course Info */}
          <div className="lg:col-span-1">
            <p className="font-medium text-gray-900 text-sm truncate">
              {payment.courseName}
            </p>
            <p className="text-xs text-gray-500">
              {new Date(payment.paymentDate).toLocaleDateString("ar-SA")}
            </p>
          </div>

          {/* Amount */}
          <div className="lg:col-span-1 text-center">
            <p className="text-lg font-bold text-green-600">
              {payment.amount.toLocaleString()} ر.س
            </p>
            <p className="text-xs text-gray-500 truncate">
              {payment.transactionId}
            </p>
          </div>

          {/* Payment Method */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2">
              {getPaymentMethodIcon(payment.paymentMethod)}
              <span className="text-sm text-gray-600">
                {getPaymentMethodLabel(payment.paymentMethod)}
              </span>
            </div>
            {payment.receiptImage && (
              <div className="flex items-center gap-1 mt-1">
                <img src={payment?.receiptImage} alt="receiptImage" className="w-3 h-3 text-blue-500" />
                <span className="text-xs text-blue-600">يحتوي على إيصال</span>
              </div>
            )}
          </div>

          {/* Status */}
          <div className="lg:col-span-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium
                      ${
                        payment.status === "confirmed"
                          ? "bg-green-100 text-green-800"
                          : payment.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : payment.status === "failed"
                          ? "bg-red-100 text-red-800"
                          : payment.status === "review"
                          ? "bg-blue-100 text-blue-800"
                          : payment.status === "rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                >
                  {getStatusIcon(payment.status)}
                  <span>{getStatusLabel(payment.status)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1">
                {payment.status === "pending" && (
                  <>
                    <button
                      onClick={() =>
                        updatePaymentStatus(payment.id, "confirmed")
                      }
                      className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="تأكيد الدفع"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() =>
                        updatePaymentStatus(payment.id, "rejected")
                      }
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="رفض الدفع"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Info for pending/failed payments */}
      {(payment.status === "pending" ||
        payment.status === "failed" ||
        payment.status === "review") && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-700">{payment.notes}</p>
        </div>
      )}
    </div>
  );
}
