"use client";
import React, { useMemo, useState, useEffect } from "react";
import PageLayout from "../../../components/layout/PageLayout";
import BreadcrumbsShowcase from "../../../components/ui/BreadCrumbs";
import {
  BarChart3,
  Star,
  Search,
  Upload,
  Plus,
  Download,
  Edit3,
  Trash2,
  MoreVertical,
  MessageSquare,
  TrendingUp,
} from "lucide-react";
import Button from "../../../components/atoms/Button";
import PagesHeader from "../../../components/ui/PagesHeader";
import SearchAndFilters from "../../../components/ui/SearchAndFilters";

import AddFaqModal from "../../../components/Faq/AddFaqModal/AddFaqModal";
import EditFaqModal from "../../../components/Faq/EditFaqModal/EditFaqModal";
import DeleteFaqModal from "../../../components/Faq/DeleteFaqModal/DeleteFaqModal";
import ShowHideFaqModal from "../../../components/Faq/ShowHideFaqModal/ShowHideFaqModal";
import { useDispatch, useSelector } from "react-redux";
import { handleGetAllFaqs } from "@/lib/features/faqSlice";
import { Spin } from "antd";

/** =========================
 *  Breadcrumbs & Tabs
 *  ========================= */
const breadcrumbs = [
  { label: "الرئيسية", href: "/", icon: BarChart3 },
  { label: "الأسئلة الشائعة", href: "/faq", icon: Star, current: true },
];

const CATEGORY_LABELS = {
  general: "عام",
  courses: "دورات",
  enroll: "التسجيل والدفع",
  support: "الدعم الفني",
  platform: "المنصة",
  professional_license: "الرخص المهنية",
};

/** =========================
 *  Small helpers & components
 *  ========================= */
function averageRating(answers) {
  if (!Array.isArray(answers) || !answers.length) return 0;
  const sum = answers.reduce((s, a) => s + (a.rating || 0), 0);
  return +(sum / answers.length).toFixed(1);
}

function QuestionActionsMenu({
  question,
  setEditModal,
  setRowData,
  onDelete,
  onToggleVisibility,
}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <MoreVertical className="w-4 h-4 text-gray-500" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute left-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20 min-w-[160px]">
            <button
              onClick={() => {
                setRowData(question);
                setEditModal(true);
                setIsOpen(false);
              }}
              className="w-full px-3 py-2 text-right text-sm hover:bg-gray-50 flex items-center gap-2"
            >
              <Edit3 className="w-4 h-4" />
              تعديل
            </button>
            <hr className="my-1" />
            <button
              onClick={() => {
                onToggleVisibility(question);
                setIsOpen(false);
              }}
              className="w-full px-3 py-2 text-right text-sm hover:bg-gray-50 flex items-center gap-2"
            >
              <TrendingUp className="w-4 h-4" />
              {question.hidden ? "إظهار" : "إخفاء"}
            </button>
            <hr className="my-1" />
            <button
              onClick={() => {
                onDelete(question);
                setIsOpen(false);
              }}
              className="w-full px-3 py-2 text-right text-sm hover:bg-red-50 text-red-600 flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              حذف
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function QuestionCard({ question, setRowData, setEditModal, onDelete, onToggleVisibility }) {
  const answers = Array.isArray(question.answers) ? question.answers : [];
  return (
    <div className="bg-white relative rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group">
      <div className="absolute w-32 h-32 -top-10 -right-20 rounded-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 group-hover:from-blue-500/20 group-hover:to-purple-500/20 transition-all duration-300"></div>

      <div className="p-6 flex flex-col gap-5 relative z-10">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-start w-fit ms-auto justify-between mb-3">
              

              <QuestionActionsMenu
                question={question}
                setEditModal={setEditModal}
                setRowData={setRowData}
                onDelete={(q) => onDelete(q)}
                onToggleVisibility={onToggleVisibility}
              />
            </div>

            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-gray-800 leading-relaxed flex-1">
                {question.text}
              </h3>
              {question.hidden && (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-600 border border-red-100">
                  مخفي
                </span>
              )}
            </div>

            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <MessageSquare className="w-4 h-4" />
                <span>{answers.length} إجابة</span>
              </div>
            </div>
          </div>
        </div>

        {/* Answers preview */}
        <div className="space-y-3">
          {answers.slice(0, 2).map((answer) => (
            <div
              key={answer.id}
              className="rounded-xl border border-gray-100 bg-gray-50/60 p-4 hover:bg-white hover:shadow-sm transition-all duration-200"
            >
              <p className="text-sm text-gray-700 leading-relaxed line-clamp-2">
                {answer.comment}
              </p>
            </div>
          ))}

          {answers.length === 0 && (
            <div className="rounded-xl border border-dashed border-gray-200 p-6 text-center">
              <MessageSquare className="w-8 h-8 mx-auto text-gray-400 mb-2" />
              <p className="text-gray-600 text-sm">لا توجد إجابات على هذا السؤال بعد</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="text-xs text-gray-500">
            تم الإنشاء: {new Date(question.createdAt).toLocaleDateString("ar-EG")}
          </div>
        </div>
      </div>
    </div>
  );
}

/** ============== TABLE VIEW ============== */
function getLastActivityDate(q) {
  const dates = [...(q.answers || []).map((a) => a.date), q.createdAt].filter(Boolean);
  const iso = dates.sort().at(-1);
  return iso ? new Date(iso) : null;
}

function FaqTable({ items, setEditModal, setRowData, onDelete, onToggleVisibility }) {
  return (
    <div className="mt-8 overflow-x-auto rounded-2xl border border-gray-200 bg-white">
      <table className="w-full text-right" dir="rtl">
        <thead className="bg-gray-50 w-full">
          <tr className="text-gray-600 text-sm">
            <th className="px-4 py-3 text-center font-semibold">السؤال</th>
            <th className="px-4 py-3 text-center font-semibold">عدد الإجابات</th>
            <th className="px-4 py-3 text-center font-semibold">آخر نشاط</th>
            <th className="px-4 py-3 text-center font-semibold">إجراءات</th>
          </tr>
        </thead>
        <tbody className="divide-y w-full divide-gray-100">
          {items.map((q) => {
            const last = getLastActivityDate(q);
            return (
              <tr key={q.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-4">
                  <div className="font-medium text-gray-900">{q.text}</div>
                  {q.hint && <div className="text-xs text-gray-500 mt-1 line-clamp-1">{q.hint}</div>}
                </td>
                
                <td className="px-4 text-center flex justify-center items-center  w-fit mx-auto py-4">
                  <div className="flex items-center gap-1 justify-end text-gray-700">
                    <MessageSquare className="w-4 h-4" />
                    {q.answers?.length || 0}
                  </div>
                </td>
                <td className="px-4 text-center w-fit mx-auto py-4 text-gray-700">
                  {last ? last.toLocaleDateString("ar-EG") : "-"}
                </td>
                <td className="px-4 flex justify-center items-center  text-center w-fit mx-auto py-4">
                  <div className="flex items-center gap-2 justify-end">
                    <button
                      onClick={() => {
                        setRowData(q);
                        setEditModal(true);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm"
                    >
                      تعديل
                    </button>
                    <button
                      onClick={() => onToggleVisibility(q)}
                      className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 text-sm"
                    >
                      {q.hidden ? "إظهار" : "إخفاء"}
                    </button>
                    <button
                      onClick={() => onDelete(q)}
                      className="px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 text-sm"
                    >
                      حذف
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
          {items.length === 0 && (
            <tr>
              <td colSpan={5} className="px-4 py-10 text-center text-gray-500">
                لا توجد عناصر مطابقة لمرشحات البحث الحالية.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

/** =========================
 *  Main Page
 *  ========================= */
export default function FaqPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [query, setQuery] = useState("");
  const [minRating, setMinRating] = useState(0);
  const [sort, setSort] = useState("newest");
  const [NewModal, setNewModal] = useState(false);
  const [viewMode, setViewMode] = useState("grid"); // "grid" | "table"
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteModal, setDeleteModal] = useState({ open: false, question: null });
  const [EditModal, setEditModal] = useState(false);
  const [rowData, setRowData] = useState({});
  const [showHideModal, setShowHideModal] = useState({ open: false, question: null });
  const dispatch = useDispatch();
  const { faq_list, faq_loading } = useSelector((state) => state?.faq);

  useEffect(() => {
    dispatch(handleGetAllFaqs())
  } , [dispatch])


  useEffect(() => {
    console.log(faq_list?.data?.message)
  } , [faq_list])

  useEffect(() => {
    document.body.style.overflow = EditModal || NewModal ? "hidden" : "auto";
  }, [EditModal, NewModal]);

  const normalizedFaqs = useMemo(() => {
    const message = faq_list?.data?.message;
    if (!Array.isArray(message)) return [];

    return message.map((item, index) => {
      const answersArray = Array.isArray(item.answers) ? item.answers : [];
      const fallbackAnswer =
        !answersArray.length && item.answer
          ? [
              {
                id: `${item.id || index}-answer`,
                comment: item.answer,
                user: item.answer_user || "",
                date: item.updated_at || item.created_at,
              },
            ]
          : [];

      const answers = [...answersArray, ...fallbackAnswer].map((ans, idx) => ({
        id: ans.id || `${item.id || index}-ans-${idx}`,
        user: ans.user || ans.author || "مستخدم",
        avatar: ans.avatar || (ans.user ? ans.user.slice(0, 2).toUpperCase() : "NA"),
        rating: ans.rating ?? 0,
        comment: ans.comment || ans.text || ans.answer || "",
        date: ans.date || ans.created_at || item.updated_at || item.created_at,
        likes: ans.likes ?? 0,
        verified: ans.verified ?? false,
      }));

      return {
        id: item.id || `faq-${index}`,
        category: item.category || "other",
        text: item.question || "",
        hint: item.hint || "",
        createdAt: item.created_at || item.updated_at || new Date().toISOString(),
        answers,
        hidden: Boolean(item.hidden),
      };
    });
  }, [faq_list]);

  const tabs = useMemo(() => {
    const counts = normalizedFaqs.reduce((acc, item) => {
      const key = item.category || "other";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const categoryTabs = Object.entries(counts).map(([key, count]) => ({
      id: key,
      key,
      title: CATEGORY_LABELS[key] || key,
      count,
    }));

    return [{ id: "all", key: "all", title: "الكل", count: normalizedFaqs.length }, ...categoryTabs];
  }, [normalizedFaqs]);

  useEffect(() => {
    if (activeTab === "all") return;
    const exists = tabs.some((tab) => tab.key === activeTab);
    if (!exists) {
      setActiveTab("all");
    }
  }, [activeTab, tabs]);

  /** Filter questions per tab, then search/sort */
  const questions = useMemo(() => {
    let list = normalizedFaqs.filter((q) => (activeTab === "all" ? true : q.category === activeTab));

    if (query.trim()) {
      const q = query.trim();
      list = list.filter(
        (item) =>
          item.text.includes(q) ||
          item.answers.some((a) => (a.user || "").includes(q) || (a.comment || "").includes(q))
      );
    }

    if (minRating > 0) {
      list = list.filter((item) => item.answers.some((a) => (a.rating || 0) >= minRating));
    }

    list = [...list];
    if (sort === "newest") {
      list.sort((a, b) => {
        const da = a.answers.map((x) => x.date).sort().at(-1) ?? "";
        const db = b.answers.map((x) => x.date).sort().at(-1) ?? "";
        return db.localeCompare(da);
      });
    } else if (sort === "rating") {
      list.sort((a, b) => averageRating(b.answers) - averageRating(a.answers));
    } else if (sort === "answers") {
      list.sort((a, b) => b.answers.length - a.answers.length);
    }

    return list;
  }, [normalizedFaqs, activeTab, query, minRating, sort]);

  const handleDelete = (question) => {
    setDeleteModal({ open: true, question });
    setRowData(question);
  };

  const handleToggleVisibility = (question) => {
    setRowData(question);
    setShowHideModal({ open: true, question });
  };

  if(faq_loading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <Spin size="large" spinning/>
      </div>
    )
  }

  return (
    <PageLayout>
      <div dir="rtl" className="min-h-screen p-6 bg-gray-50">
        {/* Breadcrumbs */}
        <BreadcrumbsShowcase variant="pill" items={breadcrumbs} />

        {/* Header */}
        <PagesHeader
          title="إدارة الأسئلة الشائعة"
          subtitle="نظّم وأدر الأسئلة الشائعة"
          extra={
            <div className="flex items-center gap-4 gap-reverse">
             
              <Button onClick={() => setNewModal(true)} type="primary" size="large" icon={<Plus className="w-5 h-5" />}>
                إضافة سؤال جديد
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
        {tabs.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-3">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`group relative px-6 py-3 rounded-2xl font-semibold transition-all duration-300 flex items-center gap-3 ${
                  activeTab === tab.key
                    ? " bg-primary text-white shadow-lg scale-105"
                    : "bg-white/80 backdrop-blur-sm text-gray-700 border-2 border-gray-200 hover:bg-white hover:border-blue-300 hover:scale-105 shadow-sm"
                }`}
              >
                <div className={`w-2.5 h-2.5 rounded-full ${activeTab === tab.key ? "bg-white" : "bg-primary"}`} />
                <span>{tab.title}</span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    activeTab === tab.key ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {tab.count ?? 0}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* View switch: Grid vs Table */}
        {viewMode === "grid" ? (
          <div className="mt-8 grid grid-cols-1 xl:grid-cols-2 gap-6">
            {questions.map((question) => (
              <QuestionCard
                key={question.id}
                question={question}
                setEditModal={setEditModal}
                setRowData={setRowData}
                onDelete={handleDelete}
                onToggleVisibility={handleToggleVisibility}
              />
            ))}
          </div>
        ) : (
          <FaqTable
            items={questions}
            setEditModal={setEditModal}
            setRowData={setRowData}
            onDelete={handleDelete}
            onToggleVisibility={handleToggleVisibility}
          />
        )}

        {/* Global empty state (لواجهة الشبكة فقط؛ الجدول لديه صف فارغ خاص به) */}
        {viewMode === "grid" && questions.length === 0 && (
          <div className="mt-10 bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center">
            <Search className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">لا توجد نتائج</h3>
            <p className="text-gray-600 mb-6">لا توجد عناصر مطابقة لمرشحات البحث الحالية.</p>
            <Button
              onClick={() => {
                setQuery("");
                setMinRating(0);
                setActiveTab(1);
              }}
              type="primary"
            >
              مسح المرشحات
            </Button>
          </div>
        )}
      </div>

      {/* Modals */}
      <AddFaqModal open={NewModal} setOpen={setNewModal} />
      <EditFaqModal open={EditModal} setOpen={setEditModal} rowData={rowData} activeTab={activeTab} setRowData={setRowData} />
      <DeleteFaqModal open={deleteModal?.open} setOpen={setDeleteModal} rowData={rowData} />
      <ShowHideFaqModal
        open={showHideModal?.open}
        setOpen={setShowHideModal}
        rowData={showHideModal?.question}
      />
    </PageLayout>
  );
}
