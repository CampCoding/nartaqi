"use client";
import React, { useEffect, useState } from "react";
import { Award, Calendar, Trophy, Star, Crown, Plus } from "lucide-react";
import BadgeCard from "./BadgeCard";
import BadgeForm from "./BadgeForm";

export default function StudentsBadges() {
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [filterType, setFilterType] = useState("all");
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingBadge, setEditingBadge] = useState(null);

  // Seed
  const SEED = [
    {
      id: 1,
      name: "طالب متميز",
      description: "حصل على درجات عالية في جميع الاختبارات والمشاريع",
      courseTitle: "أساسيات البرمجة للأطفال",
      awardedDate: "2023-11-20",
      icon: "🏆",
      imageUrl: "",
      color: "from-yellow-400 via-yellow-500 to-orange-500", // gradient
      type: "القدرات العامة",
      categoryId: null,
      rarity: "نادر",
      points: 100,
      achievement: "حصل على 95% في جميع الاختبارات",
      glow: true,
    },
    {
      id: 2,
      name: "مثابر الشهر",
      description: "التزام مستمر بحضور الدروس وأداء الواجبات",
      courseTitle: "اللغة الإنجليزية",
      awardedDate: "2023-10-30",
      icon: "⭐",
      imageUrl: "",
      color: "from-blue-400 via-blue-500 to-purple-500",
      type: "تحصيلي",
      categoryId: null,
      rarity: "شائع",
      points: 50,
      achievement: "حضر 100% من الدروس لمدة شهر",
      glow: false,
    },
  ];

  const [badges, setBadges] = useState(SEED);

  // Persist
  useEffect(() => {
    const saved = localStorage.getItem("students_badges");
    if (saved) {
      try {
        setBadges(JSON.parse(saved));
      } catch {
        setBadges(SEED);
      }
    }
  }, []);
  useEffect(() => {
    localStorage.setItem("students_badges", JSON.stringify(badges));
  }, [badges]);

  const badgeTypes = [
    { key: "all", label: "جميع الشارات", icon: Award },
    { key: "القدرات العامة", label: "القدرات العامة", icon: Trophy },
    { key: "تحصيلي", label: "تحصيلي", icon: Calendar },
    { key: "الرخصة المهنية", label: "الرخصة المهنية", icon: Star },
    { key: "قدرات الجامعيين", label: "قدرات الجامعيين", icon: Crown },
  ];

  const filteredBadges =
    filterType === "all" ? badges : badges.filter((b) => b.type === filterType);

  // CRUD
  const handleAddBadge = (newBadge) => {
    const newId = Math.max(...badges.map((b) => b.id), 0) + 1;
    setBadges([...badges, { ...newBadge, id: newId }]);
    setIsAdding(false);
  };

  const handleUpdateBadge = (updatedBadge) => {
    if (!updatedBadge.id && editingBadge?.id) updatedBadge.id = editingBadge.id;
    setBadges((prev) =>
      prev.map((b) => (b.id === updatedBadge.id ? updatedBadge : b))
    );
    setIsEditing(false);
    setEditingBadge(null);
  };

  const handleDeleteBadge = (id) => {
    if (window.confirm("هل أنت متأكد من حذف هذه الشارة؟")) {
      setBadges((prev) => prev.filter((b) => b.id !== id));
      setSelectedBadge((prev) => (prev?.id === id ? null : prev));
      if (editingBadge?.id === id) {
        setIsEditing(false);
        setEditingBadge(null);
      }
    }
  };

  return (
    <div
      className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8"
      dir="rtl"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            شاراتي المحققة
          </h2>
          <p className="text-gray-600">
            مجموعة الإنجازات والتميز الأكاديمي ({badges.length} شارة)
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <Plus size={20} />
            إضافة شارة
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-8 p-2 bg-gray-50 rounded-2xl">
        {badgeTypes.map((type) => {
          const Icon = type.icon;
          const count =
            type.key === "all"
              ? badges.length
              : badges.filter((b) => b.type === type.key).length;
          return (
            <button
              key={type.key}
              onClick={() => setFilterType(type.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                filterType === type.key
                  ? "bg-gradient-to-r from-[#87bac8] to-[#27829b] text-white shadow-lg scale-105"
                  : "bg-white text-gray-700 hover:bg-gray-100 hover:scale-102"
              }`}
            >
              <Icon size={16} />
              {type.label}
              {count > 0 && (
                <span
                  className={`px-2 py-1 rounded-full text-xs font-bold ${
                    filterType === type.key
                      ? "bg-white/20 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Grid */}
      {filteredBadges.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <Award size={32} className="text-gray-400" />
          </div>
          <p className="text-gray-500 text-lg">
            لا توجد شارات في هذا التصنيف حتى الآن
          </p>
          <p className="text-gray-400 text-sm mt-2">
            استمر في التعلم لتحصل على المزيد من الشارات!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBadges.map((badge) => (
            <BadgeCard
              setEditingBadge={setEditingBadge}
              setIsEditing={setIsEditing}
              handleDeleteBadge={handleDeleteBadge}
              key={badge.id}
              badge={badge}
            />
          ))}
        </div>
      )}

      {/* Add */}
      {isAdding && (
        <BadgeForm
          onSubmit={handleAddBadge}
          onCancel={() => setIsAdding(false)}
        />
      )}

      {/* Edit */}
      {isEditing && editingBadge && (
        <BadgeForm
          badge={editingBadge}
          onSubmit={handleUpdateBadge}
          onCancel={() => {
            setIsEditing(false);
            setEditingBadge(null);
          }}
          isEdit={true}
        />
      )}
    </div>
  );
}
