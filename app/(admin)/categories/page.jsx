"use client";
import Button from "@/components/atoms/Button";
import PageLayout from "@/components/layout/PageLayout";
import BreadcrumbsShowcase from "@/components/ui/BreadCrumbs";
import PagesHeader from "@/components/ui/PagesHeader";
import SearchAndFilters from "@/components/ui/SearchAndFilters";
import {
  BarChart3,
  Download,
  Plus,
  Book,
  Edit,
  Eye,
  EyeOff,
  Trash2,
  X,
} from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { Modal, Form, Input, Switch, message, Tooltip } from "antd";
import { useRouter } from "next/navigation";
import AddCategoryModal from "@/components/Categories/AddCategoryModal";
import DeleteCategoryModal from "@/components/Categories/DeleteCategoryModal";

/* ===================== Initial Data ===================== */
export const all_categories = [
  {
    id: 1,
    title: "الدورات العامة",
    description: "دورات تدريبية عامة في مختلف المجالات",
    coursesCount: 15,
    createdAt: "2024-01-15",
    status: "active",
    sections: ["مهارات أساسية", "تنمية ذاتية", "إدارة الوقت"],
  },
  {
    id: 2,
    title: "الرخصة المهنية",
    description: "دورات تأهيل للحصول على الرخص المهنية",
    coursesCount: 8,
    createdAt: "2024-02-10",
    status: "active",
    sections: ["رخصة المعلم", "اختبارات قياس", "أسئلة سابقة"],
  },
  {
    id: 3,
    title: "دورات اخري   ",
    description: "دورات متخصصة في اللغات والتقنية والعلوم الشرعية",
    coursesCount: 23,
    createdAt: "2024-03-05",
    status: "active",
    sections: ["لغة عربية", "لغة إنجليزية", "برمجة للمبتدئين", "حفظ القرآن"],
  },
].map((c) => ({ ...c, visible: true })); // ✅ اجعل كل الفئات مرئية افتراضياً

/* ===================== Small Helpers ===================== */
const arDate = (iso) =>
  new Date(iso).toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

/* ===================== Grid Card ===================== */
const CategoryCard = ({
  category,
  onEdit,
  onDelete,
  onViewSections,
  onToggleVisibility,
  expanded,
  onToggleExpand,
}) => {
  const router = useRouter();
  return (
    <div
      className={`bg-white relative rounded-xl overflow-hidden shadow-md border border-gray-100 p-6 transition-all ${
        category.visible ? "hover:shadow-lg" : "opacity-60"
      }`}
    >
      {/* Soft blobs */}
      <div className="absolute w-20 h-20 top-0 right-0 rounded-full blur-3xl bg-[#3B82F6]/40 pointer-events-none" />
      <div className="absolute w-20 h-20 bottom-0 left-0 rounded-full blur-3xl bg-[#F97316]/40 pointer-events-none" />

      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs bg-blue-50 text-blue-700 mb-2">
            <Book className="w-4 h-4" />
            {arDate(category.createdAt)}
          </div>
          <h3 className="text-xl font-semibold text-gray-900">
            {category.title}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          {!category.visible && (
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-700">
              مخفي
            </span>
          )}
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              category.status === "active"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {category.status === "active" ? "نشط" : "غير نشط"}
          </span>
        </div>
      </div>

      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
        {category.description}
      </p>

      {/* Sections */}
      {Array.isArray(category.sections) && category.sections.length > 0 && (
        <div className="mb-4">
          <div className="text-sm text-gray-700 mb-2">الأقسام:</div>
          <div className="flex flex-wrap gap-2">
            {(expanded ? category.sections : category.sections.slice(0, 6)).map(
              (s, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700"
                >
                  {s}
                </span>
              )
            )}
            {category.sections.length > 6 && (
              <button
                onClick={() => onToggleExpand(category.id)}
                className="px-2 py-1 rounded-full text-xs bg-blue-50 text-blue-700"
              >
                {expanded
                  ? "إظهار أقل"
                  : `+${category.sections.length - 6} المزيد`}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={() =>
            router.push(`/categories/sub-category/${category?.id}`)
          }
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm"
          title="عرض الأقسام"
        >
          <Eye className="w-4 h-4" /> عرض الأقسام
        </button>

        <div className="flex items-center gap-1">
          <Tooltip title="تعديل">
            <button
              onClick={() => onEdit(category)}
              className="p-2 hover:bg-green-50 rounded-lg text-green-600"
            >
              <Edit className="w-4 h-4" />
            </button>
          </Tooltip>

          {/* ✅ Show/Hide */}
          <Tooltip title={category.visible ? "إخفاء" : "إظهار"}>
            <button
              onClick={() => onToggleVisibility(category)}
              className="p-2 hover:bg-gray-50 rounded-lg text-gray-700"
            >
              {category.visible ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </Tooltip>

          <Tooltip title="حذف">
            <button
              onClick={() => onDelete(category)}
              className="p-2 hover:bg-red-50 rounded-lg text-red-600"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};


/* ===================== Mobile Row (Cards) ===================== */
const MobileCategoryRow = ({
  category,
  onEdit,
  onDelete,
  onViewSections,
  onToggleVisibility,
}) => {
  const router = useRouter();
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-base font-semibold text-gray-900 truncate">
            {category.title}
          </h3>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
            <span
              className={`inline-flex px-2 py-1 rounded-full ${
                category.status === "active"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {category.status === "active" ? "نشط" : "غير نشط"}
            </span>
            <span
              className={`inline-flex px-2 py-1 rounded-full ${
                category.visible
                  ? "bg-blue-100 text-blue-800"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {category.visible ? "ظاهر" : "مخفي"}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="shrink-0 flex items-center gap-1">
          <Tooltip title="عرض الأقسام">
            <button
              onClick={() => router.push(`/categories/sub-category/${category?.id}`)}
              className="p-2 rounded-lg hover:bg-blue-50 text-blue-600"
            >
              <Eye className="w-4 h-4" />
              <span className="sr-only">عرض الأقسام</span>
            </button>
          </Tooltip>
          <Tooltip title="تعديل">
            <button
              onClick={() => onEdit(category)}
              className="p-2 rounded-lg hover:bg-green-50 text-green-600"
            >
              <Edit className="w-4 h-4" />
              <span className="sr-only">تعديل</span>
            </button>
          </Tooltip>
          <Tooltip title={category.visible ? "إخفاء" : "إظهار"}>
            <button
              onClick={() => onToggleVisibility(category)}
              className="p-2 rounded-lg hover:bg-gray-50 text-gray-700"
            >
              {category.visible ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
              <span className="sr-only">تبديل الظهور</span>
            </button>
          </Tooltip>
          <Tooltip title="حذف">
            <button
              onClick={() => onDelete(category)}
              className="p-2 rounded-lg hover:bg-red-50 text-red-600"
            >
              <Trash2 className="w-4 h-4" />
              <span className="sr-only">حذف</span>
            </button>
          </Tooltip>
        </div>
      </div>

      {/* Meta */}
      <div className="mt-2 text-xs text-gray-500">
        <span>عدد الدورات: {category.coursesCount}</span>
        <span className="mx-2">•</span>
        <span>تاريخ: {arDate(category.createdAt)}</span>
      </div>

      {/* Description */}
      {category.description && (
        <p className="mt-2 text-sm text-gray-600 line-clamp-2">
          {category.description}
        </p>
      )}

      {/* Sections */}
      {Array.isArray(category.sections) && category.sections.length > 0 && (
        <div className="mt-3">
          <div className="text-xs text-gray-700 mb-1">الأقسام:</div>
          <div className="flex flex-wrap gap-2">
            {category.sections.slice(0, 4).map((s, i) => (
              <span
                key={i}
                className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700"
              >
                {s}
              </span>
            ))}
            {category.sections.length > 4 && (
              <button
                onClick={() => onViewSections(category)}
                className="text-xs text-blue-600 underline"
              >
                عرض الكل (+{category.sections.length - 4})
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

/* ===================== Responsive Table ===================== */
const CategoriesTable = ({
  categories,
  onEdit,
  onDelete,
  onViewSections,
  onToggleVisibility,
}) => (
  <>
    {/* Mobile: cards */}
    <div className="block md:hidden space-y-3">
      {categories?.map((category) => (
        <MobileCategoryRow
          key={category.id}
          category={category}
          onEdit={onEdit}
          onDelete={onDelete}
          onViewSections={onViewSections}
          onToggleVisibility={onToggleVisibility}
        />
      ))}
    </div>

    {/* Desktop / md+: table with horizontal scroll */}
    <div className="hidden md:block bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="overflow-x-auto">
        <table className="min-w-[1000px] divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                اسم الفئة
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                الوصف
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                الأقسام
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                عدد الدورات
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                تاريخ الإنشاء
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                الحالة
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                الظهور
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                الإجراءات
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {categories?.map((category) => (
              <tr key={category.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap w-[220px]">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {category.title}
                  </div>
                </td>
                <td className="px-6 py-4 w-[320px]">
                  <div className="text-sm text-gray-500 line-clamp-2">
                    {category.description}
                  </div>
                </td>
                <td className="px-6 py-4 w-[320px]">
                  <div className="flex flex-wrap gap-1 max-w-lg">
                    {category.sections?.slice(0, 5).map((s, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-700"
                      >
                        {s}
                      </span>
                    ))}
                    {category.sections && category.sections.length > 5 && (
                      <button
                        onClick={() => onViewSections(category)}
                        className="text-blue-600 text-xs underline"
                      >
                        عرض الكل
                      </button>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap w-[120px]">
                  <div className="text-sm text-gray-900">
                    {category.coursesCount}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap w-[160px]">
                  <div className="text-sm text-gray-500">
                    {arDate(category.createdAt)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap w-[140px]">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      category.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {category.status === "active" ? "نشط" : "غير نشط"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap w-[140px]">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      category.visible
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {category.visible ? "ظاهر" : "مخفي"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium w-[160px]">
                  <div className="flex items-center gap-2">
                    <Tooltip title="عرض الأقسام">
                      <button
                        onClick={() => onViewSections(category)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Eye className="w-4 h-4" />
                        <span className="sr-only">عرض الأقسام</span>
                      </button>
                    </Tooltip>
                    <Tooltip title="تعديل">
                      <button
                        onClick={() => onEdit(category)}
                        className="text-green-600 hover:text-green-900"
                      >
                        <Edit className="w-4 h-4" />
                        <span className="sr-only">تعديل</span>
                      </button>
                    </Tooltip>
                    <Tooltip title={category.visible ? "إخفاء" : "إظهار"}>
                      <button
                        onClick={() => onToggleVisibility(category)}
                        className="text-gray-700 hover:text-gray-900"
                      >
                        {category.visible ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                        <span className="sr-only">تبديل الظهور</span>
                      </button>
                    </Tooltip>
                    <Tooltip title="حذف">
                      <button
                        onClick={() => onDelete(category)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span className="sr-only">حذف</span>
                      </button>
                    </Tooltip>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </>
);

/* ===================== Page ===================== */
export default function Page() {
  const breadcrumbs = [
    { label: "الرئيسية", href: "/", icon: BarChart3 },
    { label: "فئات الدورات", href: "#", icon: Book, current: true },
  ];

  const [categories, setCategories] = useState(all_categories);
  const [newModal, setNewModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [sectionsModal, setSectionsModal] = useState(false);
  const [sectionsFor, setSectionsFor] = useState(null);

  // ✅ توسيع/طي الأقسام داخل الكروت
  const [expandedCards, setExpandedCards] = useState(new Set());

  // ✅ فلتر للظهور: all | visible | hidden
  const [visibilityFilter, setVisibilityFilter] = useState("visible");

  const onToggleExpand = (id) => {
    setExpandedCards((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // ✅ بحث + فلترة
  const filteredCategories = useMemo(() => {
    const term = (searchTerm || "").toLowerCase();
    return categories
      .filter((c) => {
        const matchesTerm =
          c.title?.toLowerCase().includes(term) ||
          c.description?.toLowerCase().includes(term);
        const matchesVisibility =
          visibilityFilter === "all"
            ? true
            : visibilityFilter === "visible"
            ? c.visible
            : !c.visible;
        return matchesTerm && matchesVisibility;
      })
      .sort((a, b) => Number(b.visible) - Number(a.visible)); // المرئي يظهر أولاً
  }, [categories, searchTerm, visibilityFilter]);

  /* ---------- Handlers ---------- */
  const handleAdd = () => {
    setNewModal(true);
    setSelectedCategory(null);
  };

  const handleAddFinish = (values) => {
    setConfirmLoading(true);
    setTimeout(() => {
      const newCategory = {
        id: Math.max(...categories.map((c) => c.id), 0) + 1,
        title: values.title,
        description: values.description,
        coursesCount: 0,
        createdAt: new Date().toISOString().split("T")[0],
        status: values.status ? "active" : "inactive",
        visible: true,
        sections: [],
      };
      setCategories((prev) => [...prev, newCategory]);
      setNewModal(false);
      setConfirmLoading(false);
      message.success("تم إضافة الفئة بنجاح");
    }, 500);
  };

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setEditModal(true);
  };

  const handleViewSections = (category) => {
    setSectionsFor(category);
    setSectionsModal(true);
  };

  const handleEditFinish = (values) => {
    setConfirmLoading(true);
    setTimeout(() => {
      setCategories((prev) =>
        prev.map((c) =>
          c.id === selectedCategory.id
            ? {
                ...c,
                title: values.title,
                description: values.description,
                status: values.status ? "active" : "inactive",
              }
            : c
        )
      );
      setEditModal(false);
      setSelectedCategory(null);
      setConfirmLoading(false);
      message.success("تم تعديل الفئة بنجاح");
    }, 500);
  };

  const handleDelete = (category) => {
    setSelectedCategory(category);
    setDeleteModal(true);
  };

  const confirmDelete = () => {
    setConfirmLoading(true);
    setTimeout(() => {
      setCategories((prev) => prev.filter((c) => c.id !== selectedCategory.id));
      setDeleteModal(false);
      setSelectedCategory(null);
      setConfirmLoading(false);
      message.success("تم حذف الفئة بنجاح");
    }, 500);
  };

  const cancelDelete = () => {
    setDeleteModal(false);
    setSelectedCategory(null);
  };

  // ✅ Toggle Show/Hide
  const toggleVisibility = (category) => {
    setCategories((prev) =>
      prev.map((c) =>
        c.id === category.id ? { ...c, visible: !c.visible } : c
      )
    );
    message.success(category.visible ? "تم إخفاء الفئة" : "تم إظهار الفئة");
  };

  // ✅ Export (JSON)
  const handleExport = () => {
    const data = JSON.stringify(categories, null, 2);
    const blob = new Blob([data], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `categories_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const countShown = filteredCategories.length;
  const countAll = categories.length;

  return (
    <PageLayout>
      <div dir="rtl">
        <BreadcrumbsShowcase variant="pill" items={breadcrumbs} />

        <PagesHeader
          title={"إدارة فئات الدورات"}
          subtitle={"نظّم وأدر فئات الدورات"}
          extra={
            <div className="flex items-center gap-3">
              <Button
                type="secondary"
                icon={<Download className="w-4 h-4" />}
                onClick={handleExport}
              >
                تصدير
              </Button>
              <Button
                onClick={handleAdd}
                type="primary"
                size="large"
                icon={<Plus className="w-5 h-5" />}
              >
                إضافة فئة جديدة
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

        {/* ✅ Visibility Filter */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-600">الظهور:</span>
          <button
            onClick={() => setVisibilityFilter("all")}
            className={`px-3 py-1.5 rounded-lg text-sm border ${
              visibilityFilter === "all"
                ? "bg-gray-900 text-white border-gray-900"
                : "bg-white text-gray-700 border-gray-300"
            }`}
          >
            الكل
          </button>
          <button
            onClick={() => setVisibilityFilter("visible")}
            className={`px-3 py-1.5 rounded-lg text-sm border ${
              visibilityFilter === "visible"
                ? "bg-gray-900 text-white border-gray-900"
                : "bg-white text-gray-700 border-gray-300"
            }`}
          >
            ظاهر فقط
          </button>
          <button
            onClick={() => setVisibilityFilter("hidden")}
            className={`px-3 py-1.5 rounded-lg text-sm border ${
              visibilityFilter === "hidden"
                ? "bg-gray-900 text-white border-gray-900"
                : "bg-white text-gray-700 border-gray-300"
            }`}
          >
            مخفي فقط
          </button>
        </div>

        {/* Data Display */}
        <div className="mt-6">
          {filteredCategories.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg mb-2">لا توجد فئات</div>
              <div className="text-gray-400 text-sm">
                {searchTerm
                  ? "لم يتم العثور على نتائج مطابقة للبحث"
                  : "لم يتم إنشاء أي فئات بعد"}
              </div>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCategories.map((category) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onViewSections={handleViewSections}
                  onToggleVisibility={toggleVisibility}
                  expanded={expandedCards.has(category.id)}
                  onToggleExpand={onToggleExpand}
                />
              ))}
            </div>
          ) : (
            <CategoriesTable
              categories={filteredCategories}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onViewSections={handleViewSections}
              onToggleVisibility={toggleVisibility}
            />
          )}
        </div>

        {/* Results Summary */}
        {countAll > 0 && (
          <div className="mt-6 text-sm text-gray-500 text-center">
            عرض {countShown} من {countAll} فئة
          </div>
        )}

        {/* Add Category Modal */}
        <AddCategoryModal
          visible={newModal}
          onCancel={() => setNewModal(false)}
          onFinish={handleAddFinish}
          formTitle="إضافة فئة جديدة"
          confirmLoading={confirmLoading}
        />

        {/* Edit Category Modal */}
        <AddCategoryModal
          visible={editModal}
          onCancel={() => {
            setEditModal(false);
            setSelectedCategory(null);
          }}
          onFinish={handleEditFinish}
          initialValues={{
            title: selectedCategory?.title,
            description: selectedCategory?.description,
            status: selectedCategory?.status === "active",
          }}
          formTitle="تعديل الفئة"
          confirmLoading={confirmLoading}
        />

        {/* Delete Confirmation Modal */}
        <DeleteCategoryModal 
        cancelDelete={cancelDelete}
        confirmDelete={confirmDelete}
        confirmLoading={confirmLoading}
        deleteModal={deleteModal}
        selectedCategory={selectedCategory}
        />
      </div>
    </PageLayout>
  );
}
