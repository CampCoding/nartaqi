import { Eye, Gift, Star, Users } from "lucide-react";
import React from "react";

export default function RewardsStats({ stats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {[
        {
          label: "إجمالي المكافآت",
          value: stats.total,
          icon: Gift,
          color: "from-blue-500 to-indigo-500",
        },
        {
          label: "المكافآت النشطة",
          value: stats.visible,
          icon: Eye,
          color: "from-green-500 to-emerald-500",
        },
        {
          label: "مرات الاستلام",
          value: stats.totalClaimed,
          icon: Users,
          color: "from-purple-500 to-violet-500",
        },
        {
          label: "إجمالي النقاط",
          value: stats.totalPoints,
          icon: Star,
          color: "from-amber-500 to-orange-500",
        },
      ].map((stat, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </div>
            <div className={`p-3 rounded-2xl bg-gradient-to-r ${stat.color}`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
