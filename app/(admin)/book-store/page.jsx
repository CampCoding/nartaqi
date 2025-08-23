"use client";
import React, { useMemo, useState } from "react";
import { message } from "antd";
import PageLayout from "../../../components/layout/PageLayout";
import BreadcrumbsShowcase from "../../../components/ui/BreadCrumbs";
import {
  BarChart3,
  Text,
  Star,
  CheckCircle2,
  XCircle,
  Upload,
  Download,
  Plus,
  Trash2,
  Edit,
} from "lucide-react";
import SearchAndFilters from "../../../components/ui/SearchAndFilters";
import PagesHeader from "../../../components/ui/PagesHeader";
import Button from "../../../components/atoms/Button";
import AddBookModal from "../../../components/BookStore/AddBookModal/AddBookModal";
import EditBookModal from "../../../components/BookStore/EditBookModal/EditBookModal";
import DeleteBookModal from "../../../components/BookStore/DeleteBookModal/DeleteBookModal";

/* ========================
   Sample Data (initial)
======================== */
export const PRODUCTS = [
  {
    id: "p-001",
    title: "مصنف الكتابة العربية",
    subtitle: "دليل عملي لتحسين الخط وتنمية المهارات الكتابية",
    slug: "arabic-writing-file-1",
    category: "كتب",
    subcategory: "الكتابة العربية",
    price: 24.99,
    currency: "ر.س",
    inStock: true,
    rating: 4.7,
    reviewsCount: 126,
    badges: ["الأكثر مبيعًا"],
    image:
      "https://res.cloudinary.com/dbz6ebekj/image/upload/v1755943445/mari-potter-Zh0mcQuw_EQ-unsplash_brrjmq.jpg",
    pages: 160,
    language: "العربية",
    level: "مبتدئ",
    publisher: "دار البيان",
    author: "سامي العبدالله",
    createdAt: "2025-07-15",
    tags: ["كتابة", "خط", "تدريب"],
  },
  {
    id: "p-002",
    title: "مصنف الكتابة العربية",
    subtitle: "تمارين خط النسخ والرقعة مع أمثلة محلولة",
    slug: "arabic-writing-file-2",
    category: "كتب",
    subcategory: "الكتابة العربية",
    price: 24.99,
    oldPrice: 29.99,
    currency: "ر.س",
    inStock: true,
    rating: 4.5,
    reviewsCount: 89,
    badges: ["خصم"],
    image:
      "https://res.cloudinary.com/dbz6ebekj/image/upload/v1755943417/gulfer-ergin-LUGuCtvlk1Q-unsplash_fmkkyf.jpg",
    pages: 140,
    language: "العربية",
    level: "متوسط",
    publisher: "مكتبة الأفق",
    author: "منى الحربي",
    createdAt: "2025-06-20",
    tags: ["نسخ", "رقعة", "خط"],
  },
  {
    id: "p-003",
    title: "مصنف الكتابة العربية",
    subtitle: "قواعد الإملاء وعلامات الترقيم للناشئة",
    slug: "arabic-writing-file-3",
    category: "كتب",
    subcategory: "القواعد",
    price: 24.99,
    currency: "ر.س",
    inStock: true,
    rating: 4.6,
    reviewsCount: 77,
    badges: ["الأكثر مبيعًا"],
    image:
      "https://res.cloudinary.com/dbz6ebekj/image/upload/v1755943466/susan-q-yin-2JIvboGLeho-unsplash_ntbfex.jpg",
    pages: 120,
    language: "العربية",
    level: "مبتدئ",
    publisher: "الدرر",
    author: "خالد العطاوي",
    createdAt: "2025-05-11",
    tags: ["إملاء", "ترقيم"],
  },
  {
    id: "p-004",
    title: "مصنف الكتابة العربية",
    subtitle: "ممارسات يومية لتحسين الأسلوب",
    slug: "arabic-writing-file-4",
    category: "كتب",
    subcategory: "الكتابة العربية",
    price: 24.99,
    currency: "ر.س",
    inStock: false,
    rating: 4.2,
    reviewsCount: 41,
    badges: ["محدود"],
    image:
      "https://res.cloudinary.com/dbz6ebekj/image/upload/v1755943447/kimberly-farmer-lUaaKCUANVI-unsplash_vwyodc.jpg",
    pages: 132,
    language: "العربية",
    level: "متوسط",
    publisher: "مسك القلم",
    author: "نورة الدوسري",
    createdAt: "2025-08-01",
    tags: ["أسلوب", "تعبير"],
  },
  {
    id: "p-005",
    title: "مصنف الكتابة العربية",
    subtitle: "خطوات مبسطة لتعلم الكتابة للأطفال",
    slug: "arabic-writing-for-kids-1",
    category: "كتب",
    subcategory: "الكتابة",
    price: 19.99,
    currency: "ر.س",
    inStock: true,
    rating: 4.8,
    reviewsCount: 203,
    badges: ["الأكثر مبيعًا"],
    image:
      "https://res.cloudinary.com/dbz6ebekj/image/upload/v1755943506/tom-hermans-9BoqXzEeQqM-unsplash_1_njelrk.jpg",
    pages: 96,
    language: "العربية",
    level: "مبتدئ",
    publisher: "روضة العلم",
    author: "هبة السالم",
    createdAt: "2025-04-29",
    tags: ["أطفال", "تمارين", "كتابة"],
  },
  {
    id: "p-006",
    title: "مصنف القراءة السريعة",
    subtitle: "تقنيات مضاعفة سرعة الاستيعاب",
    slug: "speed-reading-1",
    category: "كتب",
    subcategory: "القراءة",
    price: 29.99,
    currency: "ر.س",
    inStock: true,
    rating: 4.1,
    reviewsCount: 58,
    image:
      "https://res.cloudinary.com/dbz6ebekj/image/upload/v1755943489/hans-jurgen-weinhardt-FZ5nx86tP2U-unsplash_t7yfo8.jpg",
    pages: 180,
    language: "العربية",
    level: "متوسط",
    publisher: "المدارك",
    author: "أشرف عادل",
    createdAt: "2025-03-10",
    tags: ["قراءة", "استيعاب"],
  },
  // حقائب
  {
    id: "b-001",
    title: "حقيبة مهارات الكتابة",
    subtitle: "مجموعة 3 كتب + دفاتر تدريب",
    slug: "bundle-writing-pack",
    category: "حقائب",
    subcategory: "تعليم",
    price: 69.99,
    currency: "ر.س",
    inStock: true,
    rating: 4.6,
    reviewsCount: 45,
    badges: ["جديد"],
    image:
      "https://res.cloudinary.com/dbz6ebekj/image/upload/v1755943514/ed-robertson-eeSdJfLfx1A-unsplash_gkhj2n.jpg",
    tags: ["حقيبة", "كتابة", "توفير"],
  },
  {
    id: "b-002",
    title: "حقيبة الطفل القارئ",
    subtitle: "قصص + ملصقات + كتيب تدريبات",
    slug: "bundle-kids-reader",
    category: "حقائب",
    subcategory: "أطفال",
    price: 59.0,
    currency: "ر.س",
    inStock: true,
    rating: 4.9,
    reviewsCount: 78,
    badges: ["الأكثر مبيعًا"],
    image:
      "https://res.cloudinary.com/dbz6ebekj/image/upload/v1755943504/tom-hermans-9BoqXzEeQqM-unsplash_dqt1q2.jpg",
    tags: ["أطفال", "قراءة", "حقيبة"],
  },
  {
    id: "b-003",
    title: "حقيبة تعلم البرمجة",
    subtitle: "JS Basics + كتيب تمارين + بطاقات",
    slug: "bundle-code-starter",
    category: "حقائب",
    subcategory: "برمجة",
    price: 89.0,
    currency: "ر.س",
    inStock: false,
    rating: 4.3,
    reviewsCount: 33,
    badges: ["محدود"],
    image:
      "https://res.cloudinary.com/dbz6ebekj/image/upload/v1755943420/abinash-jothimani-P4KX6qSaBcY-unsplash_m76yqu.jpg",
    tags: ["برمجة", "JavaScript", "حقيبة"],
  },
];

/* ========================
   Breadcrumbs & Tabs
======================== */
const breadcrumbs = [
  { label: "الرئيسية", href: "/", icon: BarChart3 },
  { label: "متجر الكتب", href: "/book-store", icon: Text, current: true },
];

const TABS = [
  { id: 1, key: "all", title: "الكل" },
  { id: 2, key: "books", title: "الكتب" },
  { id: 3, key: "bags", title: "الحقائب" },
];

/* ========================
   Small UI helpers
======================== */
function StarRow({ value }) {
  const full = Math.floor(value || 0);
  const half = value - full >= 0.5;
  return (
    <div className="flex items-center gap-1">
      {[0, 1, 2, 3, 4].map((i) => {
        if (i < full)
          return (
            <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          );
        if (i === full && half)
          return (
            <div key={i} className="relative w-4 h-4">
              <Star className="absolute inset-0 w-4 h-4 text-yellow-400" />
              <div className="absolute inset-0 overflow-hidden w-1/2">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              </div>
            </div>
          );
        return <Star key={i} className="w-4 h-4 text-gray-300" />;
      })}
    </div>
  );
}

function Badge({ label }) {
  const styles = {
    "الأكثر مبيعًا": "bg-blue-100 text-blue-700",
    جديد: "bg-green-100 text-green-700",
    خصم: "bg-rose-100 text-rose-700",
    محدود: "bg-amber-100 text-amber-700",
  };
  return (
    <span
      className={`px-2 py-1 text-xs rounded-full ${
        styles[label] || "bg-gray-100 text-gray-700"
      }`}
    >
      {label}
    </span>
  );
}

/* ========================
   Cards & Table
======================== */
function ProductCard({ p, onDelete, onEdit }) {
  return (
    <div className="rounded-2xl border relative border-gray-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition">
      {/* actions */}
      <div className="flex gap-2 absolute top-3 left-3 z-20 items-center">
        <button
          onClick={() => onEdit(p)}
          title="تعديل"
          className="p-2 rounded-lg bg-white/80 hover:bg-white border border-gray-200 text-green-600"
        >
          <Edit className="w-4 h-4" />
        </button>

        <button
          onClick={() => onDelete(p)}
          title="حذف"
          className="p-2 rounded-lg bg-white/80 hover:bg-white border border-gray-200 text-rose-600"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="absolute w-28 h-28 rounded-full blur-3xl bg-sky-700/60 bottom-0 -left-10" />

      <div className="relative">
        <img
          src={p.image}
          alt={p.title}
          className="object-cover w-full h-[260px]"
        />
      </div>

      <div className="p-4 space-y-3">
        <div className="flex items-center gap-2 flex-wrap">
          {p.badges?.map((b) => (
            <Badge key={b} label={b} />
          ))}
        </div>

        <div>
          <h3 className="font-semibold text-gray-900">{p.title}</h3>
          {p.subtitle && (
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
              {p.subtitle}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <StarRow value={p.rating} />
            <span className="text-xs text-gray-500">({p.reviewsCount})</span>
          </div>
          <div className="text-left">
            {p.oldPrice && (
              <div className="text-xs text-gray-400 line-through">
                {p.currency} {p.oldPrice.toFixed(2)}
              </div>
            )}
            <div className="text-lg font-bold text-gray-900">
              {p.currency} {p.price.toFixed(2)}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-1 text-xs">
            {p.inStock ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700">متوفر</span>
              </>
            ) : (
              <>
                <XCircle className="w-4 h-4 text-rose-600" />
                <span className="text-rose-700">غير متوفر</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductTable({ rows, onDelete, onEdit }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50 text-gray-600">
          <tr>
            <th className="text-right p-3">المنتج</th>
            <th className="text-right p-3">الفئة</th>
            <th className="text-right p-3">السعر</th>
            <th className="text-right p-3">التقييم</th>
            <th className="text-right p-3">التوفر</th>
            <th className="text-right p-3">إجراء</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((p) => (
            <tr key={p.id} className="border-t">
              <td className="p-3">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-12 rounded-md overflow-hidden bg-gray-100">
                    <img
                      src={p.image}
                      alt={p.title}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{p.title}</div>
                    <div className="text-xs text-gray-500 line-clamp-1">
                      {p.subtitle}
                    </div>
                  </div>
                </div>
              </td>
              <td className="p-3 text-gray-700">{p.category}</td>
              <td className="p-3">
                <div className="text-gray-900 font-semibold">
                  {p.currency} {p.price.toFixed(2)}
                </div>
                {p.oldPrice && (
                  <div className="text-xs text-gray-400 line-through">
                    {p.currency} {p.oldPrice.toFixed(2)}
                  </div>
                )}
              </td>
              <td className="p-3">
                <div className="flex items-center gap-2">
                  <StarRow value={p.rating} />
                  <span className="text-xs text-gray-500">
                    ({p.reviewsCount})
                  </span>
                </div>
              </td>
              <td className="p-3">
                {p.inStock ? (
                  <span className="px-2 py-1 text-xs rounded-full bg-emerald-100 text-emerald-700">
                    متوفر
                  </span>
                ) : (
                  <span className="px-2 py-1 text-xs rounded-full bg-rose-100 text-rose-700">
                    غير متوفر
                  </span>
                )}
              </td>
              <td className="p-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onEdit(p)}
                    title="تعديل"
                    className="px-3 py-1.5 rounded-lg text-sm bg-white border border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                  >
                    تعديل
                  </button>
                  <button
                    onClick={() => onDelete(p)}
                    title="حذف"
                    className="px-3 py-1.5 rounded-lg text-sm bg-white border border-rose-200 text-rose-600 hover:bg-rose-50"
                  >
                    حذف
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={6} className="p-6 text-center text-gray-500">
                لا توجد منتجات مطابقة.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

/* ========================
   Page
======================== */
export default function BookStorePage() {
  const [activeTab, setActiveTab] = useState(1);
  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [newModal, setNewModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [rowData, setRowData] = useState({});
  const [products, setProducts] = useState(PRODUCTS);

  const activeKey = useMemo(
    () => TABS.find((t) => t.id === activeTab)?.key ?? "all",
    [activeTab]
  );

  const filterByTab = (key) => {
    if (key === "all") return products;
    if (key === "books") return products.filter((p) => p.category === "كتب");
    if (key === "bags") return products.filter((p) => p.category === "حقائب");
    return products;
  };

  const filteredByTab = useMemo(
    () => filterByTab(activeKey),
    [activeKey, products]
  );

  const filteredProducts = useMemo(() => {
    const term = searchTerm.trim();
    if (!term) return filteredByTab;
    return filteredByTab.filter((p) => {
      const hay = `${p.title} ${p.subtitle ?? ""} ${
        p.tags?.join(" ") ?? ""
      }`.toLowerCase();
      return hay.includes(term.toLowerCase());
    });
  }, [filteredByTab, searchTerm]);

  const countForKey = (key) => filterByTab(key).length;

  // ADD
  const handleAddProduct = async (payload) => {
    const safe = {
      ...payload,
      id: payload.id || `p-${Date.now()}`,
      category: payload.category || "كتب",
      image: payload.image || "/images/store/placeholder.jpg",
    };
    setProducts((prev) => [safe, ...prev]);
    message.success("تمت إضافة المنتج");
  };

  // EDIT
  const handleEditOpen = (item) => {
    setRowData(item);
    setEditModal(true);
  };
  const handleEditSubmit = async (updated) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updated.id ? { ...p, ...updated } : p))
    );
    message.success("تم تحديث المنتج");
    setEditModal(false);
  };

  // DELETE
  const handleDeleteOpen = (item) => {
    setRowData(item);
    setDeleteModal(true);
  };
  const handleDeleteConfirm = async () => {
    setProducts((prev) => prev.filter((p) => p.id !== rowData.id));
    message.success("تم حذف المنتج");
    setDeleteModal(false);
  };

  return (
    <PageLayout>
      <div dir="rtl" className="min-h-screen p-6 bg-gray-50">
        <BreadcrumbsShowcase variant="pill" items={breadcrumbs} />

        <PagesHeader
          title="إدارة متجر الكتب"
          subtitle="أضف، حرّر، واحذف المنتجات والحقائب"
          extra={
            <div className="flex items-center gap-4 gap-reverse">
              <Button type="default" icon={<Upload className="w-4 h-4" />}>
                استيراد
              </Button>
              <Button type="secondary" icon={<Download className="w-4 h-4" />}>
                تصدير
              </Button>
              <Button
                onClick={() => setNewModal(true)}
                type="primary"
                size="large"
                icon={<Plus className="w-5 h-5" />}
              >
                إضافة كتاب/منتج
              </Button>
            </div>
          }
        />

        <SearchAndFilters
          mode={viewMode}
          setMode={setViewMode}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />

        {/* Tabs */}
        <div className="mt-6 flex flex-wrap gap-3">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`group relative px-6 py-3 rounded-2xl font-semibold transition-all duration-300 flex items-center gap-3 ${
                activeTab === tab.id
                  ? "bg-primary text-white shadow-lg scale-105"
                  : "bg-white/80 backdrop-blur-sm text-gray-700 border-2 border-gray-200 hover:bg-white hover:border-blue-300 hover:scale-105 shadow-sm"
              }`}
            >
              <div
                className={`w-2.5 h-2.5 rounded-full ${
                  activeTab === tab.id ? "bg-white" : "bg-primary"
                }`}
              />
              <span>{tab.title}</span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  activeTab === tab.id
                    ? "bg-white/20 text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {countForKey(tab.key)}
              </span>
            </button>
          ))}
        </div>

        {/* Results */}
        <div className="mt-6">
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  p={p}
                  onEdit={handleEditOpen}
                  onDelete={handleDeleteOpen}
                />
              ))}
            </div>
          ) : (
            <ProductTable
              rows={filteredProducts}
              onEdit={handleEditOpen}
              onDelete={handleDeleteOpen}
            />
          )}

          {/* Empty state */}
          {filteredProducts.length === 0 && (
            <div className="mt-10 bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center">
              <Text className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                لا توجد نتائج
              </h3>
              <p className="text-gray-600 mb-6">
                جرّب تعديل الفلاتر أو البحث بكلمات أخرى.
              </p>
              <button
                onClick={() => setSearchTerm("")}
                className="px-4 py-2 rounded-xl bg-primary text-white"
              >
                مسح البحث
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit / Delete modals */}
      <AddBookModal open={newModal} setOpen={setNewModal} onSubmit={handleAddProduct} />
      <EditBookModal open={editModal} setOpen={setEditModal} rowData={rowData} onSubmit={handleEditSubmit} />
      <DeleteBookModal
        open={deleteModal}
        setOpen={setDeleteModal}
        rowData={rowData}
        onConfirm={handleDeleteConfirm}
      />
    </PageLayout>
  );
}
