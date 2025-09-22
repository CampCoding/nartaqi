// app/blog/BlogContent.jsx
'use client';

import React, { useMemo, useState } from "react";
import PageLayout from "../../../components/layout/PageLayout";
import BreadcrumbsShowcase from "../../../components/ui/BreadCrumbs";
import PagesHeader from "../../../components/ui/PagesHeader";
import SearchAndFilters from "../../../components/ui/SearchAndFilters";
import Button from "../../../components/atoms/Button";

import {
  BarChart3,
  Text as TextIcon,
  Plus,
  Download,
  Upload,
  MessageSquare,
  Eye,
  Calendar as CalendarIcon,
  Edit3,
  Trash2,
} from "lucide-react";

import { message } from "antd";
import AddBlogModal from "../../../components/Blogs/AddBlogModal/AddBlogModal";
import EditBlogModal from "../../../components/Blogs/EditBlogModal/EditBlogModal";
import DeleteBlogModal from "../../../components/Blogs/DeleteBlogModal/DeleteBlogModal";
import BlogDetailsModal from "../../../components/Blogs/BlogDetailsModal/BlogDetailsModal";

/* ========================
   Breadcrumbs
======================== */
const breadcrumbs = [
  { label: "الرئيسية", href: "/", icon: BarChart3 },
  { label: "المدونة", href: "/blog", icon: TextIcon, current: true },
];

/* ========================
   Sample Data
======================== */
const BLOGS_SEED = [
  {
    id: "b-001",
    title: "كيف تحسن مهارة الكتابة العربية؟",
    desc:
      "خطوات عملية وتمارين يومية لصقل مهارة الكتابة وتحسين الأسلوب لدى المتدربين والمبتدئين.",
    image:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200&auto=format&fit=crop",
    date: "2025-08-05",
    comments: 24,
    views: 1280,
  },
  {
    id: "b-002",
    title: "خريطة طريق لتعلم القراءة السريعة",
    desc:
      "مقدمة مختصرة في تقنيات القراءة السريعة وكيفية مضاعفة الاستيعاب دون التضحية بالفهم.",
    image:
      "https://images.unsplash.com/photo-1463320726281-696a485928c7?q=80&w=1200&auto=format&fit=crop",
    date: "2025-07-19",
    comments: 13,
    views: 845,
  },
  {
    id: "b-003",
    title: "أخطاء إملائية شائعة وحلول بسيطة",
    desc:
      "نتناول أكثر الأخطاء الإملائية شيوعاً مع أمثلة توضيحية وتمارين قصيرة لتثبيت القاعدة.",
    image:
      "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=1200&auto=format&fit=crop",
    date: "2025-06-30",
    comments: 31,
    views: 1543,
  },
  {
    id: "b-004",
    title: "نصائح للبدء مع البرمجة للأطفال",
    desc:
      "كيف تقدّم مفاهيم البرمجة الأساسية للأطفال بطريقة ممتعة وعملية باستخدام الأنشطة والألعاب.",
    image:
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1200&auto=format&fit=crop",
    date: "2025-06-10",
    comments: 9,
    views: 510,
  },
];

/* ========================
   Cards & Table
======================== */
function BlogCard({ post, onEdit, onDelete, onDetails }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition relative">
      {/* actions */}
      
      <div className='absolute bottom-0 bg-primary blur-3xl w-24 h-24 rounded-full'></div>
      <div className="absolute top-3 left-3 z-10 flex gap-2">
        <button
        className="p-2 rounded-lg bg-white/80 hover:bg-white border border-gray-200 text-sky-600"
          title="تفاصيل"
          onClick={() =>onDetails(post)}
        >
          <Eye className="w-4 h-4"/>
        </button>
        <button
          onClick={() => onEdit(post)}
          className="p-2 rounded-lg bg-white/80 hover:bg-white border border-gray-200 text-green-600"
          title="تعديل"
        >
          <Edit3 className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(post)}
          className="p-2 rounded-lg bg-white/80 hover:bg-white border border-gray-200 text-rose-600"
          title="حذف"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="relative">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-[220px] object-cover"
        />
      </div>

      <div className="p-4 space-y-3">
        <h3 className="text-lg font-semibold text-gray-900">{post.title}</h3>
        <p className="text-sm text-gray-600 line-clamp-3">{post.desc}</p>

        <div className="flex items-center justify-between text-sm text-gray-600 pt-1">
          <div className="flex items-center gap-1">
            <CalendarIcon className="w-4 h-4" />
            <span>{new Date(post.date).toLocaleDateString("ar-EG")}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <MessageSquare className="w-4 h-4" />
              {post.comments}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              {post.views}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function BlogTable({ rows, onEdit, onDelete, onDetails }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50 text-gray-600">
          <tr>
            <th className="text-right p-3">المنشور</th>
            <th className="text-right p-3">التاريخ</th>
            <th className="text-right p-3">التعليقات</th>
            <th className="text-right p-3">المشاهدات</th>
            <th className="text-right p-3">إجراء</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((post) => (
            <tr key={post.id} className="border-t">
              <td className="p-3">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-12 rounded-md overflow-hidden bg-gray-100">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {post.title}
                    </div>
                    <div className="text-xs text-gray-500 line-clamp-1">
                      {post.desc}
                    </div>
                  </div>
                </div>
              </td>
              <td className="p-3">
                {new Date(post.date).toLocaleDateString("ar-EG")}
              </td>
              <td className="p-3">{post.comments}</td>
              <td className="p-3">{post.views}</td>
              <td className="p-3">
                <div className="flex items-center gap-2">
                   <button
                    onClick={() => onDetails(post)}
                    className="px-3 py-1.5 rounded-lg text-sm bg-white border border-sky-200 text-sky-600 hover:bg-sky-50"
                  >
                    تفاصيل
                  </button>
                  <button
                    onClick={() => onEdit(post)}
                    className="px-3 py-1.5 rounded-lg text-sm bg-white border border-green-200 text-green-600 hover:bg-green-50"
                  >
                    تعديل
                  </button>
                  <button
                    onClick={() => onDelete(post)}
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
              <td colSpan={5} className="p-6 text-center text-gray-500">
                لا توجد مقالات مطابقة.
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
export default function BlogContent() {
  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [posts, setPosts] = useState(BLOGS_SEED);
  const [detailModal, setDetailModal] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [rowData, setRowData] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filtered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return posts;
    return posts.filter((p) => {
      const hay = `${p.title} ${p.desc}`.toLowerCase();
      return hay.includes(q);
    });
  }, [posts, searchTerm]);

  const handleAdd = async (payload) => {
    setPosts((prev) => [payload, ...prev]);
  };

  const requestEdit = (post) => {
    setRowData(post);
    setEditOpen(true);
  };

  const saveEdit = async (updated) => {
    setPosts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  const requestDelete = (post) => setDeleteTarget(post);
  const confirmDelete = () => {
    if (deleteTarget) {
      setPosts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      message.success("تم حذف المقال");
    }
    setDeleteTarget(null);
  };
 
  function handleShowDetails(item) {
    setDetailModal(true);
    setRowData(item)
  }

  return (
    <PageLayout>
      <div dir="rtl" className="min-h-screen p-6 bg-gray-50">
        <BreadcrumbsShowcase variant="pill" items={breadcrumbs} />

        <PagesHeader
          title="المدونة"
          subtitle="إدارة مقالات المدونة — إضافة، تعديل وحذف"
          extra={
            <div className="flex items-center gap-4 gap-reverse">
              <Button type="default" icon={<Upload className="w-4 h-4" />}>
                استيراد
              </Button>
              <Button type="secondary" icon={<Download className="w-4 h-4" />}>
                تصدير
              </Button>
              <Button
                onClick={() => setAddOpen(true)}
                type="primary"
                size="large"
                icon={<Plus className="w-5 h-5" />}
              >
                إضافة مقال
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

        {/* Results */}
        <div className="mt-6">
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filtered.map((post) => (
                <BlogCard 
                  onDetails={handleShowDetails}
                  key={post.id}
                  post={post}
                  onEdit={requestEdit}
                  onDelete={requestDelete}
                />
              ))}
            </div>
          ) : (
            <BlogTable
              onDetails={handleShowDetails}
              rows={filtered}
              onEdit={requestEdit}
              onDelete={requestDelete}
            />
          )}

          {/* Empty state */}
          {filtered.length === 0 && (
            <div className="mt-10 bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center">
              <TextIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
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

      {/* Modals */}
      <AddBlogModal open={addOpen} setOpen={setAddOpen} onSubmit={handleAdd} />
      <EditBlogModal
        open={editOpen}
        setOpen={setEditOpen}
        rowData={rowData}
        onSubmit={saveEdit}
      />
      
      <DeleteBlogModal open={deleteTarget} setOpen={setDeleteTarget} rowData={rowData} />
      <BlogDetailsModal open={detailModal} setOpen={setDetailModal} rowData={rowData}/>
    </PageLayout>
  );
}