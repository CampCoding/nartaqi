"ise client";
import { Edit, Trash2 } from "lucide-react";
import React from "react";

const BadgeCard = ({
  badge,
  setEditingBadge,
  setIsEditing,
  handleDeleteBadge,
}) => {
  const typeLabel =
    badge.type ||
    all_categories?.find((c) => String(c.id) === String(badge.categoryId))
      ?.title ||
    "غير مُصنّف";

  const containerClass =
    "w-20 h-20 rounded-3xl flex items-center justify-center text-4xl shadow-2xl transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500";

  const startEditing = (badge) => {
    setEditingBadge({ ...badge });
    setIsEditing(true);
  };

  return (
    <div className="group relative p-6 rounded-3xl border-2 hover:border-transparent transition-all duration-500 cursor-pointer transform hover:-translate-y-2 hover:scale-105 bg-gradient-to-br from-white to-gray-50 border-gray-200 hover:shadow-2xl">
      {/* <div className="absolute top-4 left-4 flex gap-2">
        <button
          onClick={() => startEditing(badge)}
          className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors"
          title="تعديل"
        >
          <Edit size={14} />
        </button>
        <button
          onClick={() => handleDeleteBadge(badge.id)}
          className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors"
          title="حذف"
        >
          <Trash2 size={14} />
        </button>
      </div> */}

      {/* Icon/Image with gradient background */}
      <div className="flex justify-center mb-4 mt-4">
        <div className={`${containerClass} bg-gradient-to-br ${badge?.color}`}>
          {badge?.imageUrl || badge?.image ? (
            <img
              src={badge?.imageUrl || badge?.image}
              alt={badge?.name}
              className="w-12 h-12 object-contain rounded-xl"
            />
          ) : (
            <span className="drop-shadow-lg filter">{badge?.icon}</span>
          )}
        </div>
      </div>

      <div className="text-center space-y-3">
        <h3 className="font-bold text-lg text-gray-800 group-hover:text-gray-900">
          {badge.name}
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed min-h-[40px]">
          {badge.description}
        </p>
        <div className="pt-2 border-t border-gray-100">
          <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
            {typeLabel}
          </span>
        </div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl" />
    </div>
  );
};

export default BadgeCard;
