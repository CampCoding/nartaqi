import { BookOpen, Edit3, Trash2 } from "lucide-react";
import React from "react";

export default function ExamSectionTable({ filtered, onDelete, onEdit }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                #
              </th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                الاسم
              </th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                الوصف
              </th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                تاريخ الإضافة
              </th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                إجراءات
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filtered.map((item, idx) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm text-gray-900">{idx + 1}</td>
                <td className="px-6 py-4">
                  <div className="font-semibold text-gray-900">{item.name}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 max-w-xs">
                  <div className="line-clamp-2">{item.desc || "—"}</div>
                </td>

                <td className="px-6 py-4 text-sm text-gray-900">
                  {item.questionsCount || 0}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {new Date(item.createdAt).toLocaleDateString("ar-EG")}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      className="p-2 rounded-lg hover:bg-emerald-50 text-emerald-600 transition-colors"
                      onClick={() => onEdit(item)}
                      title="تعديل"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                      onClick={() => onDelete(item.id)}
                      title="حذف"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center">
                    <BookOpen className="w-12 h-12 text-gray-400 mb-4" />
                    <p className="text-gray-600">لا توجد عناصر مطابقة لبحثك</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
