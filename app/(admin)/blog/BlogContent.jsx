// app/blog/BlogContent.jsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
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
  MessageCircleWarning,
  EyeOff,
  MessageSquareMore,
} from "lucide-react";

import { message, Spin } from "antd";
import AddBlogModal from "../../../components/Blogs/AddBlogModal/AddBlogModal";
import EditBlogModal from "../../../components/Blogs/EditBlogModal/EditBlogModal";
import DeleteBlogModal from "../../../components/Blogs/DeleteBlogModal/DeleteBlogModal";
import BlogDetailsModal from "../../../components/Blogs/BlogDetailsModal/BlogDetailsModal";
import ShowHideModal from "../../../components/Blogs/ShowHideModal/ShowHideModal";
import { useDispatch, useSelector } from "react-redux";
import { handleGetAllBlogs } from "@/lib/features/blogSlice";
import SharedImage from "@/components/ui/SharedImage";
import { useRouter } from "next/navigation";

/* ========================
   Breadcrumbs
======================== */
const breadcrumbs = [
  { label: "الرئيسية", href: "/", icon: BarChart3 },
  { label: "المدونة", href: "/blog", icon: TextIcon, current: true },
];

/* ========================
   Cards & Table
======================== */
function BlogCard({ post, onEdit, onDelete, onDetails, onShowHide }) {
  const router = useRouter();
  return (
    <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition relative">
      {/* actions */}

      <div className="absolute bottom-0 bg-primary blur-3xl w-24 h-24 rounded-full"></div>
      <div className="absolute top-3 left-3 z-10 flex gap-2">
         <button
          className="p-2 rounded-lg bg-white/80 hover:bg-white border border-gray-200 text-sky-600"
          title={"التعليقات"}
          onClick={() => router.push(`/blog/${post?.id}/comments`)}
        >
          <MessageSquareMore className="w-4 h-4" />
        </button>
        <button
          className="p-2 rounded-lg bg-white/80 hover:bg-white border border-gray-200 text-sky-600"
          title={post?.hidden? "إظهار":"إخفاء"}
          onClick={() => onShowHide(post)}
        >
          {post?.hidden ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" /> }
        </button>
        <button
          className="p-2 rounded-lg bg-white/80 hover:bg-white border border-gray-200 text-sky-600"
          title="تفاصيل"
          onClick={() => onDetails(post)}
        >
          <MessageCircleWarning className="w-4 h-4" />
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
        <SharedImage
          src={post?.image || "/images/logo.svg"}
          alt={post?.title}
          className="w-full h-full object-contain"
        />
      </div>

      <div className="p-4 space-y-3">
        <h3 className="text-lg font-semibold text-gray-900">{post?.title}</h3>
        <p className="text-sm text-gray-600 line-clamp-3">{post?.content}</p>

        <div className="flex items-center justify-between text-sm text-gray-600 pt-1">
          <div className="flex items-center gap-1">
            <CalendarIcon className="w-4 h-4" />
            <span>{new Date(post.created_at).toLocaleDateString("ar-EG")}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <MessageSquare className="w-4 h-4" />
              {post.comments_count}
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

function BlogTable({ rows, onEdit, onDelete, onDetails, onShowHide }) {
  const safeRows = rows || [];
  const router = useRouter();
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
          {safeRows.length > 0 ? (
            safeRows.map((post) => (
              <tr key={post.id} className="border-t">
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-12 rounded-md overflow-hidden bg-gray-100">
                      {/* <img
                        src={post.image || "/images/logo.svg"}
                        alt={post.title}
                        className="w-full h-full object-contain"
                        onError={(e) => e.currentTarget.src = "/images/logo.svg"}
                      /> */}
                      <SharedImage
                        src={post?.image || "/images/logo.svg"}
                        alt={post?.title}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {post.title}
                      </div>
                      <div className="text-xs text-gray-500 line-clamp-1">
                        {post.content}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="p-3">
                  {new Date(post.created_at).toLocaleDateString("ar-EG")}
                </td>
                <td className="p-3">{post.comments_count}</td>
                <td className="p-3">{post.views}</td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                     <button
          className="p-2 rounded-lg bg-white/80 hover:bg-white border border-gray-200 text-sky-600"
          title={"التعليقات"}
          onClick={() => router.push(`/blog/${post?.id}/comments`)}
        >
          <MessageSquareMore className="w-4 h-4" />
        </button>
                    <button
                      onClick={() => onShowHide(post)}
                      className="px-3 py-1.5 rounded-lg text-sm bg-white border border-sky-200 text-sky-600 hover:bg-sky-50"
                      title="إخفاء/إظهار"
                    >
                      <Eye className="w-4 h-4 inline" />
                    </button>
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
            ))
          ) : (
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
  const [detailModal, setDetailModal] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [rowData, setRowData] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showHideTarget, setShowHideTarget] = useState(null);
  const dispatch = useDispatch();
  const { blogs_loading, blogs_data } = useSelector((state) => state?.blogs);

  useEffect(() => {
    dispatch(handleGetAllBlogs());
  }, [dispatch]);

  const filtered = useMemo(() => {
    const blogs = blogs_data?.data?.message || [];
    const q = searchTerm?.trim().toLowerCase();
    if (!q) return blogs;
    return blogs.filter((p) => {
      const hay = `${p?.title} ${p?.content}`.toLowerCase();
      return hay.includes(q);
    });
  }, [blogs_data, searchTerm]);

  useEffect(() => {
    console.log(blogs_data?.data?.message, filtered);
  }, [blogs_data, filtered]);

  const handleAdd = async (payload) => {
    // Refresh blogs after adding
    dispatch(handleGetAllBlogs());
  };

  const requestEdit = (post) => {
    setRowData(post);
    setEditOpen(true);
  };

  const saveEdit = async (updated) => {
    // Refresh blogs after editing
    dispatch(handleGetAllBlogs());
  };

  const requestDelete = (post) => setDeleteTarget(post);
  const confirmDelete = () => {
    if (deleteTarget) {
      // Refresh blogs after deleting
      dispatch(handleGetAllBlogs());
      message.success("تم حذف المقال");
    }
    setDeleteTarget(null);
  };

  function handleShowDetails(item) {
    setDetailModal(true);
    setRowData(item);
  }

  function handleShowHide(item) {
    setRowData(item);
    setShowHideTarget(item);
  }

  if (blogs_loading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <Spin size="large" spinning />
      </div>
    );
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
          {Array.isArray(filtered) && filtered.length > 0 ? (
            viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtered.map((post) => (
                  <BlogCard
                    onDetails={handleShowDetails}
                    key={post.id}
                    post={post}
                    onEdit={requestEdit}
                    onDelete={requestDelete}
                    onShowHide={handleShowHide}
                  />
                ))}
              </div>
            ) : (
              <BlogTable
                onDetails={handleShowDetails}
                rows={filtered}
                onEdit={requestEdit}
                onDelete={requestDelete}
                onShowHide={handleShowHide}
              />
            )
          ) : (
            <div className="mt-10 bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center">
              <TextIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {searchTerm ? "لا توجد نتائج" : "لا توجد مقالات"}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm
                  ? "جرّب تعديل الفلاتر أو البحث بكلمات أخرى."
                  : "لم يتم إضافة أي مقالات بعد. ابدأ بإضافة مقال جديد."}
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="px-4 py-2 rounded-xl bg-primary text-white hover:bg-primary/90 transition"
                >
                  مسح البحث
                </button>
              )}
              {!searchTerm && (
                <button
                  onClick={() => setAddOpen(true)}
                  className="px-4 py-2 rounded-xl bg-primary text-white hover:bg-primary/90 transition"
                >
                  إضافة مقال جديد
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <AddBlogModal blogsData={blogs_data} open={addOpen} setOpen={setAddOpen} onSubmit={handleAdd} />
      <EditBlogModal
      blogsData={blogs_data}
        open={editOpen}
        setOpen={setEditOpen}
        rowData={rowData}
        onSubmit={saveEdit}
      />

      <DeleteBlogModal
        open={deleteTarget}
        setOpen={setDeleteTarget}
        rowData={rowData}
      />
      <BlogDetailsModal
        open={detailModal}
        setOpen={setDetailModal}
        rowData={rowData}
      />
      <ShowHideModal
        open={showHideTarget}
        setOpen={setShowHideTarget}
        rowData={rowData}
      />
    </PageLayout>
  );
}
