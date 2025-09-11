import React, { useState } from "react";
import { Award, Calendar, BookOpen, Trophy, Star, Medal, Crown, Target, Plus, Trash2, Edit, X, Save } from "lucide-react";

export default function StudentsBadges() {
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [filterType, setFilterType] = useState("all");
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingBadge, setEditingBadge] = useState(null);

  // Sample badges data with enhanced properties
  const [badges, setBadges] = useState([
    {
      id: 1,
      name: "طالب متميز",
      description: "حصل على درجات عالية في جميع الاختبارات والمشاريع",
      courseTitle: "أساسيات البرمجة للأطفال",
      awardedDate: "2023-11-20",
      icon: "🏆",
      color: "from-yellow-400 via-yellow-500 to-orange-500",
      type: "تميز أكاديمي",
      rarity: "نادر",
      points: 100,
      achievement: "حصل على 95% في جميع الاختبارات",
      glow: true
    },
    {
      id: 2,
      name: "مثابر الشهر",
      description: "التزام مستمر بحضور الدروس وأداء الواجبات",
      courseTitle: "اللغة الإنجليزية",
      awardedDate: "2023-10-30",
      icon: "⭐",
      color: "from-blue-400 via-blue-500 to-purple-500",
      type: "الالتزام والحضور",
      rarity: "شائع",
      points: 50,
      achievement: "حضر 100% من الدروس لمدة شهر",
      glow: false
    },
    {
      id: 3,
      name: "محل ثقة الأهل",
      description: "تقييم إيجابي متميز من ولي الأمر",
      courseTitle: "عام",
      awardedDate: "2023-12-01",
      icon: "💙",
      color: "from-green-400 via-green-500 to-teal-500",
      type: "تقدير الأهل",
      rarity: "متوسط",
      points: 75,
      achievement: "تقييم 5 نجوم من ولي الأمر",
      glow: false
    },
    {
      id: 4,
      name: "مبدع الحلول",
      description: "ابتكار حلول إبداعية للمشاكل البرمجية",
      courseTitle: "أساسيات البرمجة للأطفال",
      awardedDate: "2023-11-15",
      icon: "💡",
      color: "from-pink-400 via-pink-500 to-rose-500",
      type: "الإبداع والابتكار",
      rarity: "نادر جداً",
      points: 150,
      achievement: "ابتكر 3 مشاريع إبداعية",
      glow: true
    },
    {
      id: 5,
      name: "قائد المجموعة",
      description: "قيادة فريق العمل وتحقيق أهداف المشروع",
      courseTitle: "مهارات التواصل",
      awardedDate: "2023-09-25",
      icon: "👑",
      color: "from-purple-400 via-purple-500 to-indigo-500",
      type: "القيادة والتعاون",
      rarity: "متوسط",
      points: 80,
      achievement: "قاد فريق من 5 طلاب بنجاح",
      glow: false
    },
    {
      id: 6,
      name: "متحدي السرعة",
      description: "إنجاز المهام في وقت قياسي مع الحفاظ على الجودة",
      courseTitle: "الرياضيات المتقدمة",
      awardedDate: "2023-10-10",
      icon: "⚡",
      color: "from-orange-400 via-red-500 to-pink-500",
      type: "السرعة والدقة",
      rarity: "شائع",
      points: 60,
      achievement: "أنجز 10 مهام في وقت أقل من المحدد",
      glow: false
    }
  ]);

  const badgeTypes = [
    { key: "all", label: "جميع الشارات", icon: Award },
    { key: "تميز أكاديمي", label: "التميز الأكاديمي", icon: Trophy },
    { key: "الالتزام والحضور", label: "الالتزام", icon: Calendar },
    { key: "الإبداع والابتكار", label: "الإبداع", icon: Star },
    { key: "القيادة والتعاون", label: "القيادة", icon: Crown },
    { key: "السرعة والدقة", label: "السرعة", icon: Target },
    { key: "تقدير الأهل", label: "تقدير الأهل", icon: Medal }
  ];

  const iconOptions = [
    { value: "🏆", label: "كأس" },
    { value: "⭐", label: "نجمة" },
    { value: "💙", label: "قلب" },
    { value: "💡", label: "فكرة" },
    { value: "👑", label: "تاج" },
    { value: "⚡", label: "برق" },
    { value: "🎯", label: "هدف" },
    { value: "🚀", label: "صاروخ" }
  ];

  const colorOptions = [
    { value: "from-yellow-400 via-yellow-500 to-orange-500", label: "أصفر-برتقالي" },
    { value: "from-blue-400 via-blue-500 to-purple-500", label: "أزرق-بنفسجي" },
    { value: "from-green-400 via-green-500 to-teal-500", label: "أخضر-تركواز" },
    { value: "from-pink-400 via-pink-500 to-rose-500", label: "وردي-أحمر" },
    { value: "from-purple-400 via-purple-500 to-indigo-500", label: "بنفسجي-نيلي" },
    { value: "from-orange-400 via-red-500 to-pink-500", label: "برتقالي-وردي" }
  ];

  const rarityOptions = [
    { value: "شائع", label: "شائع" },
    { value: "متوسط", label: "متوسط" },
    { value: "نادر", label: "نادر" },
    { value: "نادر جداً", label: "نادر جداً" }
  ];

  const filteredBadges = filterType === "all" 
    ? badges 
    : badges.filter(badge => badge.type === filterType);

  const getRarityColor = (rarity) => {
    switch(rarity) {
      case "نادر جداً": return "text-purple-600 bg-purple-100";
      case "نادر": return "text-orange-600 bg-orange-100";
      case "متوسط": return "text-blue-600 bg-blue-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  // Add a new badge
  const handleAddBadge = (newBadge) => {
    const newId = Math.max(...badges.map(b => b.id), 0) + 1;
    setBadges([...badges, { ...newBadge, id: newId }]);
    setIsAdding(false);
  };

  // Update an existing badge
  const handleUpdateBadge = (updatedBadge) => {
    setBadges(badges.map(badge => 
      badge.id === updatedBadge.id ? updatedBadge : badge
    ));
    setIsEditing(false);
    setEditingBadge(null);
  };

  // Delete a badge
  const handleDeleteBadge = (id) => {
    if (window.confirm("هل أنت متأكد من حذف هذه الشارة؟")) {
      setBadges(badges.filter(badge => badge.id !== id));
      setSelectedBadge(null);
    }
  };

  // Start editing a badge
  const startEditing = (badge) => {
    setEditingBadge({ ...badge });
    setIsEditing(true);
  };

  const BadgeForm = ({ badge, onSubmit, onCancel, isEdit = false }) => {
    const [formData, setFormData] = useState(badge || {
      name: "",
      description: "",
      courseTitle: "",
      awardedDate: new Date().toISOString().split('T')[0],
      icon: "🏆",
      color: "from-yellow-400 via-yellow-500 to-orange-500",
      type: "تميز أكاديمي",
      rarity: "شائع",
      points: 50,
      achievement: "",
      glow: false
    });

    const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      onSubmit(formData);
    };

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div 
          className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto"
          onClick={e => e.stopPropagation()}
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


              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الأيقونة *
                </label>
                <select
                  name="icon"
                  value={formData.icon}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                >
                  {iconOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label} {option.value}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  التدرج اللوني *
                </label>
                <select
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                >
                  {colorOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  التصنيف *
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                >
                  {badgeTypes.filter(t => t.key !== "all").map(type => (
                    <option key={type.key} value={type.key}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الندرة *
                </label>
                <select
                  name="rarity"
                  value={formData.rarity}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                >
                  {rarityOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  النقاط *
                </label>
                <input
                  type="number"
                  name="points"
                  value={formData.points}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الإنجاز المميز *
                </label>
                <input
                  type="text"
                  name="achievement"
                  value={formData.achievement}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="glow"
                  name="glow"
                  checked={formData.glow}
                  onChange={handleChange}
                  className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="glow" className="mr-2 text-sm font-medium text-gray-700">
                  تأثير متوهج (للشارات النادرة)
                </label>
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

  const BadgeCard = ({ badge, onClick }) => (
    <div className="group relative p-6 rounded-3xl border-2 hover:border-transparent transition-all duration-500 cursor-pointer transform hover:-translate-y-2 hover:scale-105 bg-gradient-to-br from-white to-gray-50 border-gray-200 hover:shadow-2xl">
      {/* Action buttons */}
      <div className="absolute top-4 left-4 flex gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            startEditing(badge);
          }}
          className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors"
        >
          <Edit size={14} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteBadge(badge.id);
          }}
          className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* Rarity indicator */}
      <div className="absolute top-4 right-4">
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getRarityColor(badge.rarity)}`}>
          {badge.rarity}
        </span>
      </div>

      {/* Badge Icon */}
      <div className="flex justify-center mb-4 mt-4">
        <div
          className={`w-20 h-20 rounded-3xl flex items-center justify-center text-4xl shadow-2xl bg-gradient-to-br ${badge.color} transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500`}
        >
          <span className="drop-shadow-lg filter">{badge.icon}</span>
        </div>
      </div>

      {/* Badge Info */}
      <div className="text-center space-y-3">
        <h3 className="font-bold text-lg text-gray-800 group-hover:text-gray-900">
          {badge.name}
        </h3>
        
        <p className="text-sm text-gray-600 leading-relaxed min-h-[40px]">
          {badge.description}
        </p>

        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-center gap-2 text-gray-500">
            <BookOpen size={12} />
            <span>{badge.courseTitle}</span>
          </div>
          
          <div className="flex items-center justify-center gap-2 text-gray-500">
            <Calendar size={12} />
            <span>{new Date(badge.awardedDate).toLocaleDateString('ar-EG')}</span>
          </div>
        </div>

        {/* Badge type */}
        <div className="pt-2 border-t border-gray-100">
          <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
            {badge.type}
          </span>
        </div>
      </div>

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl" />
    </div>
  );

  const BadgeModal = ({ badge, onClose }) => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div 
        className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 transform transition-all duration-300 scale-100"
        onClick={e => e.stopPropagation()}
      >
        <div className="text-center">
          {/* Action buttons */}
          <div className="flex justify-end gap-2 mb-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                startEditing(badge);
                onClose();
              }}
              className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors"
            >
              <Edit size={16} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteBadge(badge.id);
                onClose();
              }}
              className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </div>

          {/* Large badge icon */}
          <div className="flex justify-center mb-6">
            <div
              className={`w-32 h-32 rounded-3xl flex items-center justify-center text-6xl shadow-2xl bg-gradient-to-br ${badge.color} animate-pulse`}
            >
              <span className="drop-shadow-lg filter">{badge.icon}</span>
            </div>
          </div>

          {/* Badge details */}
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-4">
              <h2 className="text-2xl font-bold text-gray-800">{badge.name}</h2>
              <span className={`px-3 py-1 rounded-full text-sm font-bold ${getRarityColor(badge.rarity)}`}>
                {badge.rarity}
              </span>
            </div>

            <div className="flex items-center justify-center gap-2 text-amber-600">
              <Star size={16} fill="currentColor" />
              <span className="text-lg font-bold">{badge.points} نقطة</span>
            </div>

            <p className="text-gray-600 leading-relaxed">{badge.description}</p>

            {/* Achievement details */}
            <div className="bg-blue-50 rounded-2xl p-4">
              <h4 className="font-semibold text-blue-800 mb-2">إنجاز مميز:</h4>
              <p className="text-blue-700 text-sm">{badge.achievement}</p>
            </div>

            {/* Badge metadata */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-gray-50 rounded-xl p-3">
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <BookOpen size={14} />
                  <span className="font-medium">الدورة</span>
                </div>
                <div className="text-gray-800">{badge.courseTitle}</div>
              </div>

              <div className="bg-gray-50 rounded-xl p-3">
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <Calendar size={14} />
                  <span className="font-medium">تاريخ المنح</span>
                </div>
                <div className="text-gray-800">{new Date(badge.awardedDate).toLocaleDateString('ar-EG')}</div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-3">
              <div className="text-sm text-gray-600 mb-1">التصنيف</div>
              <div className="text-gray-800 font-medium">{badge.type}</div>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 font-medium"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">شاراتي المحققة</h2>
          <p className="text-gray-600">
            مجموعة الإنجازات والتميز الأكاديمي ({badges.length} شارة)
          </p>
        </div>
        
        {/* Add button and total points */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <Plus size={20} />
            إضافة شارة
          </button>
          
          <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-6 py-3 rounded-2xl shadow-lg">
            <div className="flex items-center gap-2">
              <Trophy size={20} />
              <div>
                <div className="text-xs opacity-90">إجمالي النقاط</div>
                <div className="text-xl font-bold">{badges.reduce((sum, badge) => sum + badge.points, 0)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-8 p-2 bg-gray-50 rounded-2xl">
        {badgeTypes.map(type => {
          const Icon = type.icon;
          const count = type.key === "all" ? badges.length : badges.filter(b => b.type === type.key).length;
          
          return (
            <button
              key={type.key}
              onClick={() => setFilterType(type.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                filterType === type.key
                  ? 'bg-gradient-to-r from-[#87bac8] to-[#27829b] text-white shadow-lg scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-100 hover:scale-102'
              }`}
            >
              <Icon size={16} />
              {type.label}
              {count > 0 && (
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                  filterType === type.key ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
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
          <p className="text-gray-500 text-lg">لا توجد شارات في هذا التصنيف حتى الآن</p>
          <p className="text-gray-400 text-sm mt-2">استمر في التعلم لتحصل على المزيد من الشارات!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBadges.map((badge) => (
            <BadgeCard 
              key={badge.id} 
              badge={badge} 
              onClick={() => setSelectedBadge(badge)}
            />
          ))}
        </div>
      )}

      {/* Achievement summary */}
      {filteredBadges.length > 0 && (
        <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500 rounded-2xl">
              <Medal size={24} className="text-white" />
            </div>
            <div>
              <h4 className="font-bold text-gray-800 text-lg">إحصائيات الإنجاز</h4>
              <div className="flex flex-wrap items-center gap-6 mt-2 text-sm text-gray-600">
                <span>الشارات النادرة: {badges.filter(b => b.rarity === "نادر" || b.rarity === "نادر جداً").length}</span>
                <span>متوسط النقاط: {Math.round(badges.reduce((sum, badge) => sum + badge.points, 0) / badges.length)}</span>
                <span>آخر إنجاز: {Math.max(...badges.map(b => new Date(b.awardedDate).getTime())) && new Date(Math.max(...badges.map(b => new Date(b.awardedDate).getTime()))).toLocaleDateString('ar-EG')}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Badge detail modal */}
      {selectedBadge && (
        <BadgeModal 
          badge={selectedBadge} 
          onClose={() => setSelectedBadge(null)} 
        />
      )}

      {/* Add badge form */}
      {isAdding && (
        <BadgeForm 
          onSubmit={handleAddBadge}
          onCancel={() => setIsAdding(false)}
        />
      )}

      {/* Edit badge form */}
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