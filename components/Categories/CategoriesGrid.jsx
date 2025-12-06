"use client";
import { Book, Eye, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const CategoryCard = ({
  category,
  onEdit,
  onDelete,
  onViewSections,
  onToggleVisibility,
  expanded,
  onToggleExpand,
}) => {
  const router = useRouter();
  return (
    <div
      className={`bg-white relative rounded-xl overflow-hidden shadow-md border border-gray-100 p-6 transition-all ${
        category.visible ? "hover:shadow-lg" : "opacity-60"
      }`}
    >
      {/* Soft blobs */}
      <div className="absolute w-20 h-20 top-0 right-0 rounded-full blur-3xl bg-[#3B82F6]/40 pointer-events-none" />
      <div className="absolute w-20 h-20 bottom-0 left-0 rounded-full blur-3xl bg-[#F97316]/40 pointer-events-none" />

      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs bg-blue-50 text-blue-700 mb-2">
            <Book className="w-4 h-4" />
            {category?.createdAt}
          </div>
          <h3 className="text-xl font-semibold text-gray-900">
            {category?.title}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          {!category?.visible && (
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-700">
              مخفي
            </span>
          )}
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              category?.status === "active"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {category?.status === "active" ? "نشط" : "غير نشط"}
          </span>
        </div>
      </div>

      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
        {category?.description}
      </p>

      {/* Sections */}
      {Array.isArray(category?.sections) && category?.sections?.length > 0 && (
        <div className="mb-4">
          <div className="text-sm text-gray-700 mb-2">الأقسام:</div>
          <div className="flex flex-wrap gap-2">
            {(expanded
              ? category?.sections
              : category?.sections.slice(0, 6)
            ).map((s, idx) => (
              <span
                key={idx}
                className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700"
              >
                {s}
              </span>
            ))}
            {category?.sections.length > 6 && (
              <button
                onClick={() => onToggleExpand(category.id)}
                className="px-2 py-1 rounded-full text-xs bg-blue-50 text-blue-700"
              >
                {expanded
                  ? "إظهار أقل"
                  : `+${category.sections.length - 6} المزيد`}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={() =>
            router.push(`/categories/sub-category/${category?.id}`)
          }
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm"
          title="عرض الأقسام"
        >
          <Eye className="w-4 h-4" /> عرض الأقسام
        </button>

        <div className="flex items-center gap-1">
          <Tooltip title="تعديل">
            <button
              onClick={() => onEdit(category)}
              className="p-2 hover:bg-green-50 rounded-lg text-green-600"
            >
              <Edit className="w-4 h-4" />
            </button>
          </Tooltip>

          {/* ✅ Show/Hide */}
          <Tooltip title={category.visible ? "إخفاء" : "إظهار"}>
            <button
              onClick={() => onToggleVisibility(category)}
              className="p-2 hover:bg-gray-50 rounded-lg text-gray-700"
            >
              {category.visible ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </Tooltip>

          <Tooltip title="حذف">
            <button
              onClick={() => onDelete(category)}
              className="p-2 hover:bg-red-50 rounded-lg text-red-600"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default function CategoriesGrid({
  filteredCategories,
  onEdit,
  onDelete,
  onViewSections,
  onToggleVisibility,
  expanded,
  onToggleExpand,
  
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredCategories.map((category) => (
        <CategoryCard
          key={category.id}
          category={category}
          onEdit={onEdit}
          onDelete={onDelete}
          onViewSections={onViewSections}
          onToggleVisibility={onToggleVisibility}
          expanded={expanded}
          onToggleExpand={onToggleExpand}
        />
      ))}
    </div>
  );
}
