"use client";
import React, { useState } from "react";
import {
  BarChart3,
  Star,
  Eye,
  EyeOff,
  Edit3,
  Trash2,
  Grid3X3,
  List,
  Plus,
  Filter,
  Search,
  Users,
  TrendingUp,
} from "lucide-react";
import BreadcrumbsShowcase from "@/components/ui/BreadCrumbs";
import PagesHeader from "@/components/ui/PagesHeader";
import SearchAndFilters from "@/components/ui/SearchAndFilters";

const breadcrumbs = [
  { label: "الرئيسية", href: "/", icon: BarChart3 },
  { label: "التقييم", href: "/rating", icon: Star, current: true },
];

// Mock components for layout
const PageLayout = ({ children }) => <div className="w-full">{children}</div>;

export default function RatingPage() {
  const [ratings, setRatings] = useState([
    {
      id: 1,
      title: "تجربة ممتازة",
      description:
        "خدمة رائعة وسرعة استجابة. الفريق محترف جداً وقدم لي المساعدة الكاملة التي احتجتها. أنصح بشدة بالتعامل معهم.",
      gender: "ذكر",
      value: 5,
      visible: true,
      date: "2024-03-15",
      customerName: "أحمد محمد",
    },
    {
      id: 2,
      title: "خدمة جيدة",
      description: "الخدمة جيدة بشكل عام لكن يمكن تحسين سرعة الاستجابة قليلاً.",
      gender: "أنثى",
      value: 4,
      visible: true,
      date: "2024-03-14",
      customerName: "فاطمة أحمد",
    },
    {
      id: 3,
      title: "تجربة مرضية",
      description:
        "حصلت على ما كنت أبحث عنه بالضبط. الجودة ممتازة والسعر مناسب.",
      gender: "ذكر",
      value: 4,
      visible: false,
      date: "2024-03-13",
      customerName: "محمد علي",
    },
    {
      id: 4,
      title: "ممتاز!",
      description:
        "أفضل خدمة حصلت عليها على الإطلاق. سأعود للتعامل معكم مرة أخرى بالتأكيد.",
      gender: "أنثى",
      value: 5,
      visible: true,
      date: "2024-03-12",
      customerName: "سارة خالد",
    },
  ]);

  const [form, setForm] = useState({
    id: null,
    title: "",
    description: "",
    gender: "ذكر",
    value: 5,
    visible: true,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [mode, setMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");

  const resetForm = () => {
    setForm({
      id: null,
      title: "",
      description: "",
      gender: "ذكر",
      value: 5,
      visible: true,
    });
    setIsEditing(false);
  };

  const deleteRow = (id) => {
    setRatings((prev) => prev.filter((r) => r.id !== id));
    if (form.id === id) resetForm();
  };

  const toggleVisible = (id) => {
    setRatings((prev) =>
      prev.map((r) => (r.id === id ? { ...r, visible: !r.visible } : r))
    );
  };

  const filteredRatings = ratings.filter(
    (rating) =>
      rating.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rating.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rating.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: ratings.length,
    average: ratings.reduce((acc, r) => acc + r.value, 0) / ratings.length || 0,
    visible: ratings.filter((r) => r.visible).length,
    fiveStars: ratings.filter((r) => r.value === 5).length,
  };

  const RatingCard = ({ rating }) => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 overflow-hidden group">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
              {rating.title}
            </h3>
            <div className="flex items-center gap-2 mb-2">
              <div className="inline-flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < rating.value
                        ? "text-yellow-500 fill-current"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">({rating.value}/5)</span>
            </div>
          </div>
          <button
            onClick={() => toggleVisible(rating.id)}
            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              rating.visible
                ? "bg-green-100 text-green-700 hover:bg-green-200"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {rating.visible ? (
              <Eye className="w-4 h-4" />
            ) : (
              <EyeOff className="w-4 h-4" />
            )}
            {rating.visible ? "ظاهر" : "مخفي"}
          </button>
        </div>

        <p className="text-gray-700 mb-4 line-clamp-3 leading-relaxed">
          {rating.description}
        </p>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <span className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            {rating.customerName} • {rating.gender}
          </span>
          <span>{rating?.date}</span>
        </div>

        <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
          <button
            onClick={() => deleteRow(rating.id)}
            className="flex-1 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            حذف
          </button>
        </div>
      </div>
    </div>
  );

  const StatsCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100 text-sm">إجمالي التقييمات</p>
            <p className="text-3xl font-bold">{stats.total}</p>
          </div>
          <div className="bg-blue-400 bg-opacity-50 rounded-xl p-3">
            <BarChart3 className="w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-yellow-100 text-sm">متوسط التقييم</p>
            <p className="text-3xl font-bold">{stats.average.toFixed(1)}</p>
          </div>
          <div className="bg-yellow-400 bg-opacity-50 rounded-xl p-3">
            <Star className="w-6 h-6 fill-current" />
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-100 text-sm">التقييمات الظاهرة</p>
            <p className="text-3xl font-bold">{stats.visible}</p>
          </div>
          <div className="bg-green-400 bg-opacity-50 rounded-xl p-3">
            <Eye className="w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-purple-100 text-sm">5 نجوم</p>
            <p className="text-3xl font-bold">{stats.fiveStars}</p>
          </div>
          <div className="bg-purple-400 bg-opacity-50 rounded-xl p-3">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <PageLayout>
      <div
        dir="rtl"
        className="min-h-screen p-6 bg-gradient-to-br from-gray-50 to-gray-100"
      >
        <BreadcrumbsShowcase variant="pill" items={breadcrumbs} />
        <PagesHeader
          title={"إدارة التقييمات"}
          subtitle={
            "أضف/عدّل/احذف تقييمات بعنوان ووصف والجنس والتقييم، مع إظهار/إخفاء."
          }
        />

        <StatsCards />
        <SearchAndFilters
          mode={mode}
          setMode={setMode}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />

        {mode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredRatings.map((rating) => (
              <RatingCard key={rating.id} rating={rating} />
            ))}
            {filteredRatings.length === 0 && (
              <div className="col-span-full bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  لا توجد تقييمات
                </h3>
                <p className="text-gray-500">
                  لم يتم العثور على تقييمات مطابقة لبحثك
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-right" dir="rtl">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr className="text-gray-700 text-sm">
                    <th className="px-6 py-4 font-semibold">العنوان</th>
                    <th className="px-6 py-4 font-semibold">العميل</th>
                    <th className="px-6 py-4 font-semibold">الوصف</th>
                    <th className="px-6 py-4 font-semibold">الجنس</th>
                    <th className="px-6 py-4 font-semibold">التقييم</th>
                    <th className="px-6 py-4 font-semibold">التاريخ</th>
                    <th className="px-6 py-4 font-semibold">الحالة</th>
                    <th className="px-6 py-4 font-semibold">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredRatings.map((r) => (
                    <tr
                      key={r.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 font-semibold text-gray-900">
                        {r.title}
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {r.customerName}
                      </td>
                      <td className="px-6 py-4 text-gray-700 max-w-[300px]">
                        <span className="line-clamp-2 inline-block">
                          {r.description}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-700">{r.gender}</td>
                      <td className="px-6 py-4 text-gray-700">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < r.value
                                    ? "text-yellow-500 fill-current"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </span>
                          <span className="text-sm text-gray-500">
                            ({r.value})
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600 text-sm">
                        {r?.date}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => toggleVisible(r.id)}
                          className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                            r.visible
                              ? "bg-green-100 text-green-700 hover:bg-green-200"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {r.visible ? (
                            <Eye className="w-4 h-4" />
                          ) : (
                            <EyeOff className="w-4 h-4" />
                          )}
                          {r.visible ? "ظاهر" : "مخفي"}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 justify-end">
                          <button
                            onClick={() => deleteRow(r.id)}
                            className="px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 text-sm flex items-center gap-1 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" /> حذف
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredRatings.length === 0 && (
                    <tr>
                      <td
                        colSpan={8}
                        className="px-6 py-12 text-center text-gray-500"
                      >
                        <Star className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-lg font-medium mb-1">
                          لا توجد تقييمات
                        </p>
                        <p className="text-sm">
                          لم يتم العثور على تقييمات مطابقة لبحثك
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
