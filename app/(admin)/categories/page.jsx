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
} from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { message, Tooltip, Pagination } from "antd";
import AddCategoryModal from "@/components/Categories/AddCategoryModal";
import DeleteCategoryModal from "@/components/Categories/DeleteCategoryModal";
import { useDispatch, useSelector } from "react-redux";
import {
  handleGetAllCoursesCategories,
  handleAddCategory,
  handleEditCategory,
  handleShowHideCategory,
} from "@/lib/features/categoriesSlice";
import SharedImage from "../../../components/ui/SharedImage";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

/* ===================== Small Helpers ===================== */
const arDate = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
    : "--";

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

  const mappedCategory = {
    id: category.id,
    title: category.name,
    description: category.description,
    coursesCount: category.courses_count || 0,
    createdAt: category.created_at,
    status: category.active === "1" ? "active" : "inactive",
    visible: category.visible !== false,
    sections: category.sections || [],
    image: category.image_url,
  };

  return (
    <div
      className={`bg-white relative rounded-xl overflow-hidden shadow-md border border-gray-100 p-6 transition-all ${mappedCategory.visible ? "hover:shadow-lg" : "opacity-60"
        }`}
    >
      {/* Soft blobs */}
      <div className="absolute w-20 h-20 top-0 right-0 rounded-full blur-3xl bg-[#3B82F6]/40 pointer-events-none" />
      <div className="absolute w-20 h-20 bottom-0 left-0 rounded-full blur-3xl bg-[#F97316]/40 pointer-events-none" />

      <div className="flex flex-col gap-2">
        <SharedImage
          src={mappedCategory.image}
          alt={mappedCategory.title}
          className="h-[200px]"
        />

        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs bg-blue-50 text-blue-700 mb-2">
              <Book className="w-4 h-4" />
              {arDate(mappedCategory.createdAt)}
            </div>
            <h3 className="text-xl font-semibold text-gray-900">
              {mappedCategory.title}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {!mappedCategory.visible && (
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-700">
                مخفي
              </span>
            )}
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${mappedCategory.status === "active"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
                }`}
            >
              {mappedCategory.status === "active" ? "نشط" : "غير نشط"}
            </span>
          </div>
        </div>
      </div>

      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
        {mappedCategory.description}
      </p>

      {Array.isArray(mappedCategory.sections) &&
        mappedCategory.sections.length > 0 && (
          <div className="mb-4">
            <div className="text-sm text-gray-700 mb-2">الأقسام:</div>
            <div className="flex flex-wrap gap-2">
              {(expanded
                ? mappedCategory.sections
                : mappedCategory.sections.slice(0, 6)
              ).map((s, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700"
                >
                  {s}
                </span>
              ))}
              {mappedCategory.sections.length > 6 && (
                <button
                  onClick={() => onToggleExpand(mappedCategory.id)}
                  className="px-2 py-1 rounded-full text-xs bg-blue-50 text-blue-700"
                >
                  {expanded
                    ? "إظهار أقل"
                    : `+${mappedCategory.sections.length - 6} المزيد`}
                </button>
              )}
            </div>
          </div>
        )}

      <div className="flex items-center justify-between">
        <button
          onClick={() =>
            router.push(`/categories/sub-category/${mappedCategory.id}`)
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

          {/* <Tooltip title={mappedCategory.visible ? "غير نشط" : "نشط"}>
            <button
              onClick={() => onToggleVisibility(category)}
              className="p-2 hover:bg-gray-50 rounded-lg text-gray-700"
            >
              {mappedCategory.visible ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </Tooltip> */}

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

  const mappedCategory = {
    id: category.id,
    title: category.name,
    description: category.description,
    coursesCount: category.courses_count || 0,
    createdAt: category.created_at,
    status: category.active == "1" ? "active" : "inactive",
    visible: category.active !== false,
    sections: category.sections || [],
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-base font-semibold text-gray-900 truncate">
            {mappedCategory.title}
          </h3>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
            <span
              className={`inline-flex px-2 py-1 rounded-full ${mappedCategory.status === "active"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
                }`}
            >
              {mappedCategory.status === "active" ? "نشط" : "غير نشط"}
            </span>
            <span
              className={`inline-flex px-2 py-1 rounded-full ${mappedCategory.active
                  ? "bg-blue-100 text-blue-800"
                  : "bg-gray-200 text-gray-700"
                }`}
            >
              {mappedCategory.active ? "نشط" : "غير نشط"}
            </span>
          </div>
        </div>

        <div className="shrink-0 flex items-center gap-1">
          <Tooltip title="عرض الأقسام">
            <button
              onClick={() =>
                router.push(`/categories/sub-category/${mappedCategory.id}`)
              }
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
          <Tooltip title={mappedCategory.visible ? "إخفاء" : "إظهار"}>
            <button
              onClick={() => onToggleVisibility(category)}
              className="p-2 rounded-lg hover:bg-gray-50 text-gray-700"
            >
              {mappedCategory.visible ? (
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

      <div className="mt-2 text-xs text-gray-500">
        <span>عدد الدورات: {mappedCategory.coursesCount}</span>
        <span className="mx-2">•</span>
        <span>تاريخ: {arDate(mappedCategory.createdAt)}</span>
      </div>

      {mappedCategory.description && (
        <p className="mt-2 text-sm text-gray-600 line-clamp-2">
          {mappedCategory.description}
        </p>
      )}

      {Array.isArray(mappedCategory.sections) &&
        mappedCategory.sections.length > 0 && (
          <div className="mt-3">
            <div className="text-xs text-gray-700 mb-1">الأقسام:</div>
            <div className="flex flex-wrap gap-2">
              {mappedCategory.sections.slice(0, 4).map((s, i) => (
                <span
                  key={i}
                  className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700"
                >
                  {s}
                </span>
              ))}
              {mappedCategory.sections.length > 4 && (
                <button
                  onClick={() => onViewSections(category)}
                  className="text-xs text-blue-600 underline"
                >
                  عرض الكل (+{mappedCategory.sections.length - 4})
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

    <div className="hidden md:block bg-white rounded-lg shadow-sm border border-gray-200 mt-4">
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
            {categories?.map((category) => {
              const mappedCategory = {
                id: category.id,
                title: category.name,
                description: category.description,
                coursesCount: category.courses_count || 0,
                createdAt: category.created_at,
                status: category.active === "1" ? "active" : "inactive",
                visible: category.visible !== false,
                sections: category.sections || [],
              };

              return (
                <tr key={mappedCategory.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap w-[220px]">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {mappedCategory.title}
                    </div>
                  </td>
                  <td className="px-6 py-4 w-[320px]">
                    <div className="text-sm text-gray-500 line-clamp-2">
                      {mappedCategory.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap w-[250px]">
                    <div className="text-sm text-gray-500">
                      {arDate(mappedCategory.createdAt)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap w-[140px]">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${mappedCategory.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                        }`}
                    >
                      {mappedCategory.status === "active" ? "نشط" : "غير نشط"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap w-[140px]">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${mappedCategory.visible
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-200 text-gray-700"
                        }`}
                    >
                      {mappedCategory.visible ? "ظاهر" : "مخفي"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium min-w-[160px]">
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
                      <Tooltip
                        title={mappedCategory.visible ? "إخفاء" : "إظهار"}
                      >
                        <button
                          onClick={() => onToggleVisibility(category)}
                          className="text-gray-700 hover:text-gray-900"
                        >
                          {mappedCategory.visible ? (
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
              );
            })}
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

  const [newModal, setNewModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [sectionsModal, setSectionsModal] = useState(false);
  const [sectionsFor, setSectionsFor] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [expandedCards, setExpandedCards] = useState(
    new Set()
  );
  const [visibilityFilter, setVisibilityFilter] =
    useState("active");

  const dispatch = useDispatch();
  const { all_courses_categories_loading, all_courses_categories_list, active_course_category_loading } =
    useSelector((state) => state?.categories);

  // API message structure: { current_page, data, total, per_page, last_page, ... }
  const apiMessage = all_courses_categories_list?.data?.message;

  useEffect(() => {
    dispatch(
      handleGetAllCoursesCategories({
        per_page: pageSize,
        page: currentPage,
      })
    );
  }, [dispatch, currentPage, pageSize]);

  // Sync pageSize with API per_page
  useEffect(() => {
    if (apiMessage?.per_page && apiMessage.per_page !== pageSize) {
      setPageSize(apiMessage.per_page);
    }
  }, [apiMessage?.per_page, pageSize]);

  const onToggleExpand = (id) => {
    setExpandedCards((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handlePageChange = (page, size) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  // Filter + search
  const filteredCategories = useMemo(() => {
    const apiCategories = apiMessage?.data || [];
    const term = (searchTerm || "").toLowerCase();

    return apiCategories
      .filter((c) => {
        const matchesTerm =
          c.name?.toLowerCase().includes(term) ||
          c.description?.toLowerCase().includes(term);

        const isVisible = c.active == "1";
        const matchesVisibility =
          visibilityFilter === "all"
            ? true
            : visibilityFilter === "active"
              ? isVisible
              : !isVisible;

        return matchesTerm && matchesVisibility;
      })
      .map((category) => ({
        ...category,
        visible: category.active === "1",
      }))
      .sort((a, b) => Number(b.visible) - Number(a.visible));
  }, [apiMessage?.data, searchTerm, visibilityFilter]);

  /* ---------- CRUD Handlers ---------- */
  const handleAdd = () => {
    setNewModal(true);
    setSelectedCategory(null);
  };

  const handleEdit = (category) => {
    console.log(category)
    setSelectedCategory(category);
    setEditModal(true);
  };

  const handleViewSections = (category) => {
    setSectionsFor(category);
    setSectionsModal(true);
  };

  // ✅ Add (from modal)
  const handleAddFinish = ({ formData }) => {
    setConfirmLoading(true);

    dispatch(handleAddCategory({ body: formData }))
      .unwrap()
      .then((res) => {
        if (res?.data?.status === "success") {
          toast.success(res?.data?.message || "تم إضافة الفئة بنجاح");
          setNewModal(false);
          setSelectedCategory(null);
          dispatch(
            handleGetAllCoursesCategories()
          );
        } else {
          toast.error(res?.err?.response?.data?.message || "حدث خطأ أثناء إضافة الفئة");
        }
      })
      .catch((err) => {
        console.error(err);
        toast.error("حدث خطأ أثناء إضافة الفئة");
      })
      .finally(() => setConfirmLoading(false));
  };

  // ✅ Edit (from modal)
  const handleEditFinish = ({ formData }) => {
    if (!selectedCategory?.id) return;
    console.log(selectedCategory , formData);
    setConfirmLoading(true);
    dispatch(
      handleEditCategory({body :formData})
    )
      .unwrap()
      .then((res) => {
        if (res?.data?.status === "success") {
          toast.success(res?.data?.message || "تم تعديل الفئة بنجاح");
          setEditModal(false);
          setSelectedCategory(null);
          dispatch(
            handleGetAllCoursesCategories({
              per_page: pageSize,
              page: currentPage,
            })
          );
        } else {
          toast.error(res?.err?.response?.data?.message || "حدث خطأ أثناء تعديل الفئة");
        }
      })
      .catch((err) => {
        console.error(err);
        toast.error("حدث خطأ أثناء تعديل الفئة");
      })
      .finally(() => setConfirmLoading(false));
  };

  const handleDelete = (category) => {
    setSelectedCategory(category);
    setDeleteModal(true);
  };

  const confirmDelete = () => {
    setConfirmLoading(true);
    // TODO: حط هنا API الحذف الحقيقي لما يبقى جاهز
    setTimeout(() => {
      setConfirmLoading(false);
      setDeleteModal(false);
      setSelectedCategory(null);
      message.success("تم حذف الفئة بنجاح (ديمو)");
      dispatch(
        handleGetAllCoursesCategories({
          per_page: pageSize,
          page: currentPage,
        })
      );
    }, 500);
  };

  const cancelDelete = () => {
    setDeleteModal(false);
    setSelectedCategory(null);
  };

  const toggleVisibility = (category) => {
    console.log(category)
    const formData = new FormData();
    formData.append("id", category?.id);
    formData.append("active", category?.active == "0" ? 1 : 0);

    dispatch(handleShowHideCategory({ body: formData }))
      .unwrap()
      .then(res => {
        console.log(res);
        if (res?.data?.status == "success") {
          toast.success(res?.data?.message || "تم تعديل حالة الفئة");
          handleGetAllCoursesCategories({
            per_page: pageSize,
            page: currentPage,
          })

        } else {
          toast.error(res?.err?.response?.data?.message || "هناك مشكله في تعديل حالة الفية")
        }
      })
  };

  const handleExport = () => {
    const data = JSON.stringify(filteredCategories, null, 2);
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

  const totalItems = apiMessage?.total || filteredCategories.length;

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

        {/* Visibility Filter */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-600">الظهور:</span>
          <button
            onClick={() => setVisibilityFilter("all")}
            className={`px-3 py-1.5 rounded-lg text-sm border ${visibilityFilter === "all"
                ? "bg-gray-900 text-white border-gray-900"
                : "bg-white text-gray-700 border-gray-300"
              }`}
          >
            الكل
          </button>
          <button
            onClick={() => setVisibilityFilter("active")}
            className={`px-3 py-1.5 rounded-lg text-sm border ${visibilityFilter === "active"
                ? "bg-gray-900 text-white border-gray-900"
                : "bg-white text-gray-700 border-gray-300"
              }`}
          >
            نشط فقط
          </button>
          <button
            onClick={() => setVisibilityFilter("inactive")}
            className={`px-3 py-1.5 rounded-lg text-sm border ${visibilityFilter === "inactive"
                ? "bg-gray-900 text-white border-gray-900"
                : "bg-white text-gray-700 border-gray-300"
              }`}
          >
            غير نشط فقط
          </button>
        </div>

        {/* Data Display */}
        <div className="mt-6">
          {all_courses_categories_loading ? (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg">جاري التحميل...</div>
            </div>
          ) : filteredCategories.length === 0 ? (
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

        {/* Pagination */}
        {!all_courses_categories_loading && apiMessage && (
          <div className="mt-6 flex justify-center">
            <Pagination
              current={apiMessage.current_page || currentPage}
              pageSize={apiMessage.per_page || pageSize}
              total={totalItems} // ✅ إجمالي العناصر (19 مثلاً)
              onChange={handlePageChange}
              showSizeChanger={false}
              locale={{
                items_per_page: "/ الصفحة",
                jump_to: "اذهب إلى",
                page: "الصفحة",
                prev_page: "الصفحة السابقة",
                next_page: "الصفحة التالية",
              }}
            />
          </div>
        )}

        {/* Add Category Modal */}
        <AddCategoryModal
        selectedCategory={selectedCategory}
          visible={newModal}
          onCancel={() => setNewModal(false)}
          onFinish={handleAddFinish}
          formTitle="إضافة فئة جديدة"
          confirmLoading={confirmLoading}
        />

        {/* Edit Category Modal */}
        <AddCategoryModal
        selectedCategory={selectedCategory}
          visible={editModal}
          onCancel={() => {
            setEditModal(false);
            setSelectedCategory(null);
          }}
          onFinish={handleEditFinish}
          initialValues={{
            title: selectedCategory?.name,
            description: selectedCategory?.description,
            status: selectedCategory?.active === "1",
          }}
          formTitle="تعديل الفئة"
          confirmLoading={confirmLoading}
          selectdCategory={selectedCategory}
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
