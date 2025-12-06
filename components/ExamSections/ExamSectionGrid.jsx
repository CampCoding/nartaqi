import { BookOpen, Edit3, Trash2 } from "lucide-react";
import React from "react";

export default function ExamSectionGrid({
  filtered,
  currentTab,
  onEdit,
  onDelete,
  openNew,
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filtered.map((item) => (
        <div
          key={item.id}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-200 overflow-hidden group"
        >
          <div
            className={`h-2 bg-gradient-to-r ${
              currentTab.color === "blue"
                ? "from-blue-400 to-blue-600"
                : "from-emerald-400 to-emerald-600"
            }`}
          />

          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-1">
                  {item.name}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                  {item.desc || "لا يوجد وصف"}
                </p>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  className="p-2 rounded-lg hover:bg-emerald-50 text-emerald-600 transition-colors"
                  title="تعديل"
                  onClick={() => onEdit(item)}
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                  title="حذف"
                  onClick={() => onDelete(item.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {filtered.length === 0 && (
        <div className="col-span-full bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <BookOpen className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            لا توجد عناصر
          </h3>
          <p className="text-gray-600 mb-4">
            لم يتم العثور على أي عناصر مطابقة للبحث
          </p>
          <button
            onClick={openNew}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            إضافة عنصر جديد
          </button>
        </div>
      )}
    </div>
  );
}
