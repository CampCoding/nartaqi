import { Gift, Plus } from "lucide-react";
import React from "react";
import RewardCard from "./RewardCard";

export default function RewardsGrid({
  filtered,
  openAdd,
  getCategoryColor,
  getCategoryIcon,
  getLevelColor,
  reward,
  toggleVisible,
  openEdit,
  deleteReward,
}) {
  return filtered.length === 0 ? (
    <div className="text-center py-16">
      <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-12 max-w-md mx-auto">
        <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
          <Gift className="w-10 h-10 text-gray-500" />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">لا توجد مكافآت</h3>
        <p className="text-gray-600 mb-6">
          لم يتم العثور على مكافآت تطابق معايير البحث
        </p>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:from-purple-600 hover:to-indigo-600"
        >
          <Plus className="w-5 h-5" />
          إضافة مكافأة جديدة
        </button>
      </div>
    </div>
  ) : (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
      {filtered.map((reward) => (
        <RewardCard
          deleteReward={deleteReward}
          getCategoryColor={getCategoryColor}
          getCategoryIcon={getCategoryIcon}
          getLevelColor={getLevelColor}
          openEdit={openEdit}
          toggleVisible={toggleVisible}
          key={reward.id}
          reward={reward}
        />
      ))}
    </div>
  );
}
