"use client";
import React, { useMemo, useState, useEffect } from "react";
import PageLayout from "../../../components/layout/PageLayout";
import BreadcrumbsShowcase from "../../../components/ui/BreadCrumbs";
import {
  BarChart3,
  ClockFading,
  Download,
  Plus,
  Upload,
  MoreVertical,
  Edit3,
  Trash2,
  PlayCircle,
  X,
} from "lucide-react";
import PagesHeader from "../../../components/ui/PagesHeader";
import Button from "../../../components/atoms/Button";
import SearchAndFilters from "../../../components/ui/SearchAndFilters";
import AddSupportModal from "../../../components/Support/AddSupportModal/AddSupportModal";
import EditSupportModal from "../../../components/Support/EditSupportModal/EditSupportModal";
import DeleteSupportModal from "../../../components/Support/DeleteSupportModal/DeleteSupportModal";

/* ========================
   Breadcrumbs
======================== */
const breadcrumbs = [
  { label: "الرئيسية", href: "/", icon: BarChart3 },
  { label: "بوابة الدعم", href: "/support", icon: ClockFading, current: true },
];

/* ========================
   Helpers (YouTube parsing)
======================== */
function parseYouTubeId(url) {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) {
      return u.pathname.slice(1);
    }
    if (u.hostname.includes("youtube.com")) {
      const v = u.searchParams.get("v");
      if (v) return v;
      // /embed/VIDEO_ID
      const parts = u.pathname.split("/");
      const idx = parts.indexOf("embed");
      if (idx >= 0 && parts[idx + 1]) return parts[idx + 1];
    }
  } catch {}
  return null;
}

function isYouTube(url) {
  return /youtu\.be|youtube\.com/.test(url);
}

function youtubeThumb(url) {
  const id = parseYouTubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : "";
}

function classNames(...arr) {
  return arr.filter(Boolean).join(" ");
}

/* ========================
   Sample Data (Support)
======================== */
const SUPPORT_DATA = [
  {
    id: "s-001",
    name: "كيفية إنشاء حساب جديد",
    desc: "شرح خطوة بخطوة لإنشاء حساب جديد على المنصة وتفعيل البريد الإلكتروني.",
    video: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    createdAt: "2025-07-12",
    tags: ["حساب", "تسجيل"],
  },
  {
    id: "s-002",
    name: "الدفع والاشتراك",
    desc: "طرق الدفع المتاحة، وكيفية تفعيل الاشتراك الشهري، وحل مشاكل الدفع الشائعة.",
    video: "https://www.youtube.com/watch?v=o-YBDTqX_ZU",
    createdAt: "2025-06-01",
    tags: ["دفع", "اشتراك"],
  },
  {
    id: "s-003",
    name: "رفع الواجبات",
    desc: "طريقة رفع ملف الواجب، التحقق من الصيغ المسموح بها ومتابعة حالة التسليم.",
    video: "https://res.cloudinary.com/demo/video/upload/sea_turtle.mp4", // مثال MP4
    createdAt: "2025-08-15",
    tags: ["واجب", "رفع الملفات"],
  },
  {
    id: "s-004",
    name: "التواصل مع الدعم",
    desc: "أفضل قنوات التواصل وسرعة الاستجابة، وكيفية فتح تذكرة دعم مفصّلة.",
    video: "https://www.youtube.com/watch?v=3JZ_D3ELwOQ",
    createdAt: "2025-05-20",
    tags: ["دعم", "تذكرة"],
  },
  {
    id: "s-005",
    name: "تنزيل المواد المرفقة",
    desc: "من أين تجد الملفات المرفقة بالدروس وكيف تحفظها على جهازك بسرعة.",
    video: "https://www.youtube.com/watch?v=l482T0yNkeo",
    createdAt: "2025-04-02",
    tags: ["مواد", "تحميل"],
  },
];

/* ========================
   Small sub-UI
======================== */
function Kbd({ children }) {
  return (
    <kbd className="px-1.5 py-0.5 rounded border border-gray-300 bg-gray-50 text-gray-700 text-[11px]">
      {children}
    </kbd>
  );
}

/* ========================
   Cards & Table
======================== */
function SupportCard({ item, onEdit, onDelete, onPlay }) {
  const yt = isYouTube(item.video);
  const thumb = yt ? youtubeThumb(item.video) : undefined;

  return (
    <div className="rounded-2xl  border border-gray-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition relative">
      {/* Actions */}
      <div className="absolute w-24 h-24 left-0 rounded-full  bg-primary blur-3xl cursor-none -bottom-10"></div>
      <div className="absolute top-2 left-2 z-20 flex gap-2">
        <button
          onClick={() => onEdit(item)}
          className="p-2 rounded-lg bg-white/80 hover:bg-white border border-gray-200 text-emerald-600"
          title="تعديل"
        >
          <Edit3 className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(item)}
          className="p-2 rounded-lg bg-white/80 hover:bg-white border border-gray-200 text-rose-600"
          title="حذف"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Media */}
      <div className="relative w-full h-48 bg-gray-100 overflow-hidden">
        {yt ? (
          <img
            src={thumb}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <video
            className="w-full h-full object-cover"
            src={item.video}
            muted
            preload="metadata"
          />
        )}
        <button
          onClick={() => onPlay(item)}
          className="absolute inset-0 flex items-center justify-center group"
          title="تشغيل الفيديو"
        >
          <div className="p-3 rounded-full bg-black/40 group-hover:bg-black/60 transition">
            <PlayCircle className="w-10 h-10 text-white" />
          </div>
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">
        <h3 className="font-semibold text-gray-900">{item.name}</h3>
        <p className="text-sm text-gray-600 line-clamp-2">{item.desc}</p>
      </div>
    </div>
  );
}

function SupportTable({ rows, onEdit, onDelete, onPlay }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50 text-gray-600">
          <tr>
            <th className="text-right p-3">الدورة</th>
            <th className="text-right p-3">الوصف</th>
            <th className="text-right p-3">الفيديو</th>
            <th className="text-right p-3">أضيف</th>
            <th className="text-right p-3">إجراءات</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((it) => (
            <tr key={it.id} className="border-t">
              <td className="p-3 font-medium text-gray-900">{it.name}</td>
              <td className="p-3 text-gray-700">
                <span className="line-clamp-2">{it.desc}</span>
              </td>
              <td className="p-3">
                <button
                  onClick={() => onPlay(it)}
                  className="px-2 py-1 rounded-lg bg-primary text-white"
                >
                  مشاهدة
                </button>
              </td>
              <td className="p-3 text-gray-500">
                {new Date(it.createdAt).toLocaleDateString("ar-EG")}
              </td>
              <td className="p-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onEdit(it)}
                    className="px-3 py-1.5 rounded-lg text-sm bg-white border border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                  >
                    تعديل
                  </button>
                  <button
                    onClick={() => onDelete(it)}
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
                لا توجد نتائج.
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
export default function SupportPage() {
  const [items, setItems] = useState(SUPPORT_DATA);
  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [newModal, setNewModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [playerModal, setPlayerModal] = useState(false);
  const [rowData, setRowData] = useState(null);

  // prevent body scroll when any modal open
  useEffect(() => {
    const open = newModal || editModal || deleteModal || playerModal;
    document.body.style.overflow = open ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [newModal, editModal, deleteModal, playerModal]);

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return items;
    return items.filter(
      (it) =>
        it.name.toLowerCase().includes(term) ||
        it.desc.toLowerCase().includes(term)
    );
  }, [items, searchTerm]);

  const handleAdd = (payload) => {
    setItems((prev) => [payload, ...prev]);
  };
  const handleEdit = (updated) => {
    setItems((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
  };
  const requestEdit = (it) => {
    setRowData(it);
    setEditModal(true);
  };
  const requestDelete = (it) => {
    setRowData(it);
    setDeleteModal(true);
  };
  const confirmDelete = () => {
    if (rowData) {
      setItems((prev) => prev.filter((x) => x.id !== rowData.id));
    }
    setDeleteModal(false);
    setRowData(null);
  };
  const requestPlay = (it) => {
    setRowData(it);
    setPlayerModal(true);
  };

  return (
    <PageLayout>
      <div dir="rtl" className="min-h-screen p-6 bg-gray-50">
        <BreadcrumbsShowcase variant="pill" items={breadcrumbs} />

        <PagesHeader
          title="بوابة الدعم"
          subtitle="مقالات فيديو موجّهة للمستخدمين: إنشاء حساب، الدفع، الواجبات…"
          extra={
            <div className="flex items-center gap-4 gap-reverse">
             
              <Button
                onClick={() => setNewModal(true)}
                type="primary"
                size="large"
                icon={<Plus className="w-5 h-5" />}
              >
                إضافة
              </Button>
            </div>
          }
        />

        <SearchAndFilters
          mode={viewMode}
          setMode={(m) => setViewMode(m)}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />

        {/* Results */}
        <div className="mt-6">
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filtered.map((it) => (
                <SupportCard
                  key={it.id}
                  item={it}
                  onEdit={requestEdit}
                  onDelete={requestDelete}
                  onPlay={requestPlay}
                />
              ))}
            </div>
          ) : (
            <SupportTable
              rows={filtered}
              onEdit={requestEdit}
              onDelete={requestDelete}
              onPlay={requestPlay}
            />
          )}

          {filtered.length === 0 && (
            <div className="mt-10 bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center">
              <ClockFading className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                لا توجد نتائج
              </h3>
              <p className="text-gray-600 mb-6">
                جرّب كلمات بحث أخرى أو <Kbd>مسح</Kbd> الفلاتر.
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
      <AddSupportModal
        open={newModal}
        setOpen={setNewModal}
        onSubmit={handleAdd}
      />
      <EditSupportModal
        open={editModal}
        setOpen={setEditModal}
        rowData={rowData}
      />
      <DeleteSupportModal
        open={deleteModal}
        setOpen={setDeleteModal}
        rowData={rowData}
      />
      {/* <VideoPlayerModal
        open={playerModal}
        onClose={() => setPlayerModal(false)}
        item={rowData}
      /> */}
    </PageLayout>
  );
}
