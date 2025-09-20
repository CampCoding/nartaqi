"use client";
import React, { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  Plus,
  Trophy,
  Eye,
  EyeOff,
  Edit2,
  Trash2,
  Search,
  Filter,
  Star,
  Gift,
  BookOpen,
  GraduationCap,
  CreditCard,
  Award,
  Calendar,
  Users,
  X,
  Camera
} from "lucide-react";
import PageLayout from "../../../components/layout/PageLayout";
import BreadcrumbsShowcase from "../../../components/ui/BreadCrumbs";
import RewardsStats from "../../../components/Rewards/RewardsStats";
import RewardCard from "../../../components/Rewards/RewardCard";
import RewardsGrid from "../../../components/Rewards/RewardsGrid";


const PagesHeader = ({ title, subtitle, extra }) => (
  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8" dir="rtl">
    <div>
      <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent mb-2">
        {title}
      </h1>
      <p className="text-gray-600 text-lg">{subtitle}</p>
    </div>
    <div className="mt-4 md:mt-0">{extra}</div>
  </div>
);

const breadcrumbs = [
  { label: "الرئيسية", href: "/", icon: BarChart3 },
  { label: "المكافآت", href: "#", icon: Trophy, current: true },
];

const CATEGORY_OPTIONS = [
  { value: "كتب", label: "كتب", icon: BookOpen, color: "from-green-500 to-emerald-500" },
  { value: "دورات", label: "دورات", icon: GraduationCap, color: "from-blue-500 to-indigo-500" },
  { value: "بطاقات هدايا", label: "بطاقات هدايا", icon: CreditCard, color: "from-pink-500 to-rose-500" },
  { value: "جوائز خاصة", label: "جوائز خاصة", icon: Award, color: "from-purple-500 to-violet-500" },
];

const LEVEL_OPTIONS = [
  { value: "برونزي", label: "برونزي", color: "from-amber-600 to-orange-600" },
  { value: "فضي", label: "فضي", color: "from-gray-400 to-gray-500" },
  { value: "ذهبي", label: "ذهبي", color: "from-yellow-400 to-amber-500" },
  { value: "بلاتيني", label: "بلاتيني", color: "from-cyan-400 to-blue-500" },
];

const getCategoryIcon = (category) => {
  const config = CATEGORY_OPTIONS.find(opt => opt.value === category);
  return config ? config.icon : Gift;
};
const getLevelColor = (level) => {
  const config = LEVEL_OPTIONS.find(opt => opt.value === level);
  return config ? config.color : "from-gray-400 to-gray-500";
};
const getCategoryColor = (category) => {
  const config = CATEGORY_OPTIONS.find(opt => opt.value === category);
  return config ? config.color : "from-gray-400 to-gray-500";
};

export default function RewardsPage() {
  // UI state
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [levelFilter, setLevelFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Form state
  const [addForm, setAddForm] = useState({
    name: "",
    category: "",
    level: "",
    points: "",
    image: null
  });
  const [editForm, setEditForm] = useState({
    name: "",
    category: "",
    level: "",
    points: "",
    image: null
  });

  // Data
  const [rewards, setRewards] = useState([
    {
      id: "r-1",
      name: "كتاب: مهارات المعلم المتميز",
      category: "كتب",
      level: "برونزي",
      points: 150,
      visible: true,
      image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200&auto=format&fit=crop",
      createdAt: "2024-01-15",
      claimed: 24
    },
    {
      id: "r-2",
      name: "دورة: تصميم مناهج فعّالة",
      category: "دورات",
      level: "فضي",
      points: 350,
      visible: true,
      image: "https://images.unsplash.com/photo-1513258496099-48168024aec0?q=80&w=1200&auto=format&fit=crop",
      createdAt: "2024-02-20",
      claimed: 12
    },
    {
      id: "r-3",
      name: "بطاقة هدايا 25$",
      category: "بطاقات هدايا",
      level: "ذهبي",
      points: 700,
      visible: false,
      image: "https://images.unsplash.com/photo-1611996575749-79a3a250f948?q=80&w=1200&auto=format&fit=crop",
      createdAt: "2024-03-10",
      claimed: 8
    },
    {
      id: "r-4",
      name: "جائزة التميز الأكاديمي",
      category: "جوائز خاصة",
      level: "بلاتيني",
      points: 1200,
      visible: true,
      image: "https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?q=80&w=1200&auto=format&fit=crop",
      createdAt: "2024-03-15",
      claimed: 3
    },
  ]);

  useEffect(() => {
    if(addOpen || editOpen) {
      document.body.style.overflowY  = "hidden"
    }else {
      document.body.style.overflowY = "auto"
    }
  } ,[addOpen , editOpen])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rewards.filter(
      (r) =>
        (!categoryFilter || r.category === categoryFilter) &&
        (!levelFilter || r.level === levelFilter) &&
        (r.name.toLowerCase().includes(q) || r.category.toLowerCase().includes(q))
    );
  }, [rewards, search, categoryFilter, levelFilter]);

  const stats = useMemo(() => ({
    total: rewards.length,
    visible: rewards.filter(r => r.visible).length,
    totalClaimed: rewards.reduce((sum, r) => sum + r.claimed, 0),
    totalPoints: rewards.reduce((sum, r) => sum + r.points, 0)
  }), [rewards]);

  // Actions
  const toggleVisible = (id) =>
    setRewards((prev) => prev.map((r) => (r.id === id ? { ...r, visible: !r.visible } : r)));
  const deleteReward = (id) =>
    setRewards((prev) => prev.filter((r) => r.id !== id));

  // Add
  const openAdd = () => {
    setAddForm({ name: "", category: "", level: "", points: "", image: null });
    setAddOpen(true);
  };
  const submitAdd = () => {
    if (!addForm.name || !addForm.category || !addForm.level || !addForm.points) return;
    const newReward = {
      id: `r-${Date.now()}`,
      name: addForm.name,
      category: addForm.category,
      level: addForm.level,
      points: parseInt(addForm.points),
      visible: true,
      image: addForm.image || "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200&auto=format&fit=crop",
      createdAt: new Date().toISOString().split("T")[0],
      claimed: 0
    };
    setRewards(prev => [newReward, ...prev]);
    setAddOpen(false);
  };

  // Edit
  const openEdit = (reward) => {
    setEditing(reward);
    setEditForm({
      name: reward.name,
      category: reward.category,
      level: reward.level,
      points: reward.points.toString(),
      image: reward.image
    });
    setEditOpen(true);
  };
  const submitEdit = () => {
    if (!editForm.name || !editForm.category || !editForm.level || !editForm.points) return;
    setRewards(prev =>
      prev.map(r =>
        r.id === editing.id
          ? {
              ...r,
              name: editForm.name,
              category: editForm.category,
              level: editForm.level,
              points: parseInt(editForm.points),
              image: editForm.image
            }
          : r
      )
    );
    setEditOpen(false);
    setEditing(null);
  };

  const handleImageUpload = (e, formType) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (formType === "add") {
        setAddForm(prev => ({ ...prev, image: ev.target.result }));
      } else {
        setEditForm(prev => ({ ...prev, image: ev.target.result }));
      }
    };
    reader.readAsDataURL(file);
  };

  

  const Modal = ({ isOpen, onClose, title, children, onSubmit, submitText = "حفظ" }) => {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full min-h-[90vh] overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="p-6 max-h-[calc(90vh-140px)] overflow-y-auto">{children}</div>
          <div className="flex gap-3 p-6 border-t border-gray-100">
            <button onClick={onClose} className="flex-1 px-6 py-3 rounded-2xl border border-gray-300 text-gray-700 hover:bg-gray-50">
              إلغاء
            </button>
            <button onClick={onSubmit} className="flex-1 px-6 py-3 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white hover:from-purple-600 hover:to-indigo-600 shadow-lg">
              {submitText}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto p-6" dir="rtl">
        <BreadcrumbsShowcase variant="pill" items={breadcrumbs} />

        <PagesHeader
          title="المكافآت"
          subtitle="إدارة مكافآت النقاط والجوائز التعليمية"
          extra={
            <button
              onClick={openAdd}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white font-medium hover:from-purple-600 hover:to-indigo-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              إضافة مكافأة
            </button>
          }
        />

        {/* Stats */}
        <RewardsStats stats={stats}/>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <Filter className="w-4 h-4" />
                تصفية
                {(categoryFilter || levelFilter) && <span className="w-2 h-2 bg-purple-500 rounded-full" />}
              </button>

              {showFilters && (
                <div className="flex flex-wrap gap-3">
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  >
                    <option value="">جميع الفئات</option>
                    {CATEGORY_OPTIONS.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>

                  <select
                    value={levelFilter}
                    onChange={(e) => setLevelFilter(e.target.value)}
                    className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  >
                    <option value="">جميع المستويات</option>
                    {LEVEL_OPTIONS.map(level => (
                      <option key={level.value} value={level.value}>{level.label}</option>
                    ))}
                  </select>

                  {(categoryFilter || levelFilter) && (
                    <button
                      onClick={() => {
                        setCategoryFilter("");
                        setLevelFilter("");
                      }}
                      className="px-3 py-2 rounded-xl text-gray-500 hover:bg-gray-100"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="relative max-w-sm w-full">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="البحث في المكافآت..."
                className="w-full pr-12 pl-4 py-3 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>
          </div>
        </div>

        {/* Grid */}
      <RewardsGrid deleteReward={deleteReward} filtered={filtered} getCategoryColor={getCategoryColor} getCategoryIcon={getCategoryIcon} getLevelColor={getLevelColor} openAdd={openAdd} openEdit={openEdit} toggleVisible={toggleVisible}/>

        {/* Add Modal */}
        <Modal
          isOpen={addOpen}
          onClose={() => setAddOpen(false)}
          title="إضافة مكافأة جديدة"
          onSubmit={submitAdd}
          submitText="إضافة المكافأة"
        >
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">اسم المكافأة</label>
              <input
                type="text"
                value={addForm.name}
                onChange={(e) => setAddForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="أدخل اسم المكافأة"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الفئة</label>
                <select
                  value={addForm.category}
                  onChange={(e) => setAddForm(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
                >
                  <option value="">اختر الفئة</option>
                  {CATEGORY_OPTIONS.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">المستوى</label>
                <select
                  value={addForm.level}
                  onChange={(e) => setAddForm(prev => ({ ...prev, level: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
                >
                  <option value="">اختر المستوى</option>
                  {LEVEL_OPTIONS.map(level => (
                    <option key={level.value} value={level.value}>{level.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">عدد النقاط المطلوبة</label>
              <input
                type="number"
                value={addForm.points}
                onChange={(e) => setAddForm(prev => ({ ...prev, points: e.target.value }))}
                placeholder="0"
                min="0"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">صورة المكافأة</label>
              <div className="relative">
                <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, "add")} className="hidden" id="add-image" />
                <label htmlFor="add-image" className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50">
                  {addForm.image ? (
                    <img src={addForm.image} alt="Preview" className="w-full h-full object-cover rounded-xl" />
                  ) : (
                    <>
                      <Camera className="w-10 h-10 text-gray-400 mb-2" />
                      <p className="text-gray-600">اضغط لاختيار صورة</p>
                    </>
                  )}
                </label>
              </div>
            </div>
          </div>
        </Modal>

        {/* Edit Modal */}
        <Modal
          isOpen={editOpen}
          onClose={() => {
            setEditOpen(false);
            setEditing(null);
          }}
          title="تعديل المكافأة"
          onSubmit={submitEdit}
          submitText="حفظ التعديلات"
        >
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">اسم المكافأة</label>
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الفئة</label>
                <select
                  value={editForm.category}
                  onChange={(e) => setEditForm(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
                >
                  <option value="">اختر الفئة</option>
                  {CATEGORY_OPTIONS.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">المستوى</label>
                <select
                  value={editForm.level}
                  onChange={(e) => setEditForm(prev => ({ ...prev, level: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
                >
                  <option value="">اختر المستوى</option>
                  {LEVEL_OPTIONS.map(level => (
                    <option key={level.value} value={level.value}>{level.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">عدد النقاط المطلوبة</label>
              <input
                type="number"
                value={editForm.points}
                onChange={(e) => setEditForm(prev => ({ ...prev, points: e.target.value }))}
                min="0"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">صورة المكافأة</label>
              <div className="relative">
                <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, "edit")} className="hidden" id="edit-image" />
                <label htmlFor="edit-image" className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50">
                  {editForm.image ? (
                    <img src={editForm.image} alt="Preview" className="w-full h-full object-cover rounded-xl" />
                  ) : (
                    <>
                      <Camera className="w-10 h-10 text-gray-400 mb-2" />
                      <p className="text-gray-600">اضغط لاختيار صورة</p>
                    </>
                  )}
                </label>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </PageLayout>
  );
}
