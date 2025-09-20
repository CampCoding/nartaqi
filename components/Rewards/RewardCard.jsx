import {
  Calendar,
  Edit2,
  Eye,
  EyeOff,
  Star,
  Trash2,
  Trophy,
  Users,
} from "lucide-react";
import React from "react";

const RewardCard = ({
  getCategoryColor,
  getCategoryIcon,
  getLevelColor,
  reward,
  toggleVisible,
  openEdit,
  deleteReward,
}) => {
  const CategoryIcon = getCategoryIcon(reward.category);
  return (
    <div className="group relative bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-[1.02]">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={reward.image}
          alt={reward.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        {/* Status */}
        <div className="absolute top-4 right-4">
          <div
            className={`px-3 py-1 rounded-full text-xs font-bold ${
              reward.visible
                ? "bg-emerald-500/90 text-white"
                : "bg-gray-500/90 text-white"
            }`}
          >
            {reward.visible ? "نشط" : "معطل"}
          </div>
        </div>
        {/* Actions */}
        <div className="absolute top-4 left-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={() => toggleVisible(reward.id)}
            className="p-2 rounded-full bg-white/90 hover:bg-white"
            title={reward.visible ? "إخفاء" : "إظهار"}
          >
            {reward.visible ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={() => openEdit(reward)}
            className="p-2 rounded-full bg-white/90 hover:bg-white"
            title="تعديل"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => deleteReward(reward.id)}
            className="p-2 rounded-full bg-red-500/90 hover:bg-red-500 text-white"
            title="حذف"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
        {/* Points */}
        <div className="absolute bottom-4 right-4">
          <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
            <Star className="w-4 h-4 inline ml-1" />
            {reward.points} نقطة
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        <h3 className="text-xl font-bold text-gray-900 line-clamp-2">
          {reward.name}
        </h3>
        <div className="flex flex-wrap gap-2 mb-2">
          <div
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-white text-sm font-medium bg-gradient-to-r ${getCategoryColor(
              reward.category
            )}`}
          >
            <CategoryIcon className="w-4 h-4" />
            {reward.category}
          </div>
          <div
            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-white text-sm font-medium bg-gradient-to-r ${getLevelColor(
              reward.level
            )}`}
          >
            <Trophy className="w-3 h-3" />
            {reward.level}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-sm text-gray-600 mb-1">
              <Users className="w-4 h-4" />
              تم الاستلام
            </div>
            <div className="text-lg font-bold text-gray-900">
              {reward.claimed}
            </div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-sm text-gray-600 mb-1">
              <Calendar className="w-4 h-4" />
              تاريخ الإضافة
            </div>
            <div className="text-sm font-medium text-gray-700">
              {new Date(reward.createdAt).toLocaleDateString("ar-EG")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RewardCard;
