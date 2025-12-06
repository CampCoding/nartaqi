"use client";
import React, { useEffect, useState, useMemo } from "react";
import { Award, Calendar, Trophy, Star, Crown, Plus } from "lucide-react";
import BadgeCard from "./BadgeCard";
import BadgeForm from "./BadgeForm";
import { useDispatch, useSelector } from "react-redux";
import { handleGetAllStudentBadges } from "../../../../lib/features/badgeSlice";
import { Spin } from "antd";

export default function StudentsBadges({ student_id }) {
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [filterType, setFilterType] = useState("all");
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingBadge, setEditingBadge] = useState(null);

  const dispatch = useDispatch();
  const { student_badges_loading, student_badges_list } = useSelector(
    (state) => state?.badges
  );

  // Fetch student badges
  useEffect(() => {
    if (!student_id) return;
    const data_send = {
      student_id: student_id, // Use prop, not hardcoded
    };
    dispatch(handleGetAllStudentBadges({ body: data_send }));
  }, [student_id, dispatch]);

  const [badges, setBadges] = useState([]);
  const [allCategories, setAllCategories] = useState([]);

  useEffect(() => {
    const list = student_badges_list?.data?.message || [];
    // Map the API data to a UI badge shape
    const mapped = list.map((item, index) => {
      const badge = item.badge || {};
      const round = item.round || {};
      const createdAt = item.created_at || badge.created_at || "";
      return {
        id: item.id ?? badge.id ?? index,
        name: badge.name || "شارة",
        description: badge.description || "",
        courseTitle: round.name || "",
        awardedDate: createdAt ? createdAt.split("T")[0] : "",
        icon: "🏆",
        imageUrl: badge.image_path || "",
        color: "from-blue-400 via-blue-500 to-purple-500",
        type: badge.category || "أخرى",
        categoryId: badge.id || null,
        rarity: "شائع",
        points: 0,
        achievement: "",
        glow: false,
      };
    });

    setBadges(mapped);

    // Extract unique categories from badges and set them as options for filter
    const categorySet = new Set(
      list.map((item) => item.badge?.category).filter(Boolean)
    );

    const cats = [
      { key: "all", label: "الكل", icon: Award },
      ...Array.from(categorySet).map((cat) => ({
        key: cat,
        label: cat,
        icon: Award,
      })),
    ];

    setAllCategories(cats);
  }, [student_badges_list]);

  const filteredBadges = useMemo(
    () =>
      filterType === "all"
        ? badges
        : badges.filter((b) => b.type === filterType),
    [badges, filterType]
  );

  // Handle Add Badge
  const handleAddBadge = (newBadge) => {
    const newId = Math.max(...badges.map((b) => b.id), 0) + 1;
    setBadges([...badges, { ...newBadge, id: newId }]);
    setIsAdding(false);
  };

  // Handle Update Badge
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

  if (student_badges_loading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <Spin size="large" spinning />
      </div>
    );
  }

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
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-8 p-2 bg-gray-50 rounded-2xl">
        {allCategories.map((type) => {
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
                  ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg scale-105"
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

      {/* Badges grid */}
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredBadges.map((badge) => (
            <BadgeCard
              key={badge.id}
              badge={badge}
              setEditingBadge={setEditingBadge}
              setIsEditing={setIsEditing}
              handleDeleteBadge={handleDeleteBadge}
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
