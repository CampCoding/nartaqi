"use client";
import { Save, X } from "lucide-react";
import React, { useState } from "react";
import { all_categories } from "../../../../app/(admin)/categories/page";

/** Gradient palette (Tailwind classes) */
const GRADIENTS = [
  {
    value: "from-yellow-400 via-yellow-500 to-orange-500",
    label: "أصفر → برتقالي",
  },
  { value: "from-blue-400 via-blue-500 to-purple-500", label: "أزرق → بنفسجي" },
  { value: "from-green-400 via-green-500 to-teal-500", label: "أخضر → تركواز" },
  { value: "from-pink-400 via-pink-500 to-rose-500", label: "وردي → أحمر" },
  {
    value: "from-purple-400 via-purple-500 to-indigo-500",
    label: "بنفسجي → نيلي",
  },
  { value: "from-orange-400 via-red-500 to-pink-500", label: "برتقالي → وردي" },
];

const BadgeForm = ({ badge, onSubmit, onCancel, isEdit = false }) => {
  const [formData, setFormData] = useState(
    badge || {
      name: "",
      description: "",
      courseTitle: "",
      awardedDate: new Date().toISOString().split("T")[0],
      icon: "🏆",
      imageUrl: "",
      color: GRADIENTS[0].value, // default gradient
      type: "",
      categoryId: "",
      rarity: "شائع",
      points: 50,
      achievement: "",
      glow: false,
    }
  );

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const checked = e.targett.checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setFormData((prev) => ({ ...prev, imageUrl: url }));
  };

  const handleCategory = (e) => {
    const id = e.target.value;
    const label =
      all_categories?.find((c) => String(c.id) === String(id))?.title || "";
    setFormData((prev) => ({ ...prev, categoryId: id, type: label }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(isEdit ? { ...formData, id: badge.id } : formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div
        className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {isEdit ? "تعديل الشارة" : "إضافة شارة جديدة"}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                اسم الشارة *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                وصف الشارة *
              </label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            {/* Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                صورة الشارة
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImage}
                className="w-full rounded-xl border border-gray-300 px-4 py-2"
              />
              {formData.imageUrl && (
                <div className="mt-2">
                  <img
                    src={formData.imageUrl}
                    alt="Badge preview"
                    className="w-20 h-20 rounded-xl object-cover border"
                  />
                </div>
              )}
            </div>

            {/* Gradient chooser */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                اختر تدرّج الخلفية *
              </label>
              <div className="grid grid-cols-3 gap-3">
                {GRADIENTS.map((g) => {
                  const active = formData.color === g.value;
                  return (
                    <button
                      type="button"
                      key={g.value}
                      onClick={() =>
                        setFormData((p) => ({ ...p, color: g.value }))
                      }
                      className={`h-10 rounded-xl border transition-all ${
                        active
                          ? "ring-2 ring-blue-500 border-blue-400"
                          : "border-gray-300"
                      } bg-gradient-to-br ${g.value}`}
                      title={g.label}
                    />
                  );
                })}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                سيتم استخدام التدرّج المختار على بطاقة الشارة.
              </p>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الفئة *
              </label>
              <select
                value={formData.categoryId || ""}
                onChange={handleCategory}
                required
                className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="" disabled>
                  اختر فئة
                </option>
                {all_categories?.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-medium"
            >
              <Save size={18} />
              {isEdit ? "حفظ التعديلات" : "إضافة الشارة"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BadgeForm;
