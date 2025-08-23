"use client";
import React, { useMemo, useState, useEffect } from "react";
import PageLayout from "../../../components/layout/PageLayout";
import BreadcrumbsShowcase from "../../../components/ui/BreadCrumbs";
import {
  BarChart3,
  Star,
  Search,
  MessageSquare,
  Upload,
  Plus,
  Download,
  Edit3,
  Trash2,
  MoreVertical,
  TrendingUp,
} from "lucide-react";
import Button from "../../../components/atoms/Button";
import AddRatingModal from "../../../components/Ratings/AddRatingModal/AddRatingModal";
import PagesHeader from "../../../components/ui/PagesHeader";
import SearchAndFilters from "../../../components/ui/SearchAndFilters";
import EditRatingModal from "../../../components/Ratings/EditRatingModal/EditRatingModal";
import DeleteRatingModal from "../../../components/Ratings/DeleteRatingModal/DeleteRatingModal";

/** =========================
 *  Breadcrumbs & Tabs
 *  ========================= */
const breadcrumbs = [
  { label: "الرئيسية", href: "/", icon: BarChart3 },
  { label: "التقييم", href: "/rating", icon: Star, current: true },
];

const TABS = [
  { id: 1, key: "all", title: "الكل", count: 15 },
  { id: 2, key: "general", title: "تقييمات عامة", count: 3 },
  { id: 3, key: "platform", title: "تقييم المنصة", count: 5 },
  { id: 4, key: "trainer", title: "تقييم المدرب", count: 4 },
  { id: 5, key: "course", title: "تقييم الدورة", count: 3 },
];

const QA_DATA = [
  // PLATFORM
  {
    id: "q1",
    category: "platform",
    text: "ما مدى سهولة التسجيل والدخول إلى المنصة؟",
    hint: "قيّم سهولة الخطوات ووضوح الواجهة",
    status: "active",
    priority: "high",
    createdAt: "2025-08-01",
    answers: [
      {
        id: "a1",
        user: "أحمد محمود",
        avatar: "AM",
        rating: 5,
        comment: "العملية واضحة جدًا ودخلت من أول مرة. التصميم بسيط ومفهوم.",
        date: "2025-08-19",
        likes: 8,
        verified: true,
      },
      {
        id: "a2",
        user: "دينا محمد",
        avatar: "DM",
        rating: 4,
        comment: "كويسه لكن رسالة التوثيق وصلت بعد دقيقتين.",
        date: "2025-08-18",
        likes: 3,
        verified: false,
      },
    ],
  },
  {
    id: "q2",
    category: "platform",
    text: "سرعة التصفح وأداء المنصة أثناء مشاهدة المحتوى؟",
    status: "active",
    priority: "medium",
    createdAt: "2025-08-02",
    answers: [
      {
        id: "a3",
        user: "كريم ياسر",
        avatar: "KY",
        rating: 4,
        comment: "فيه تحسن كبير، الفيديوهات تشتغل بسرعة والتنقل سلس.",
        date: "2025-08-20",
        likes: 6,
        verified: true,
      },
    ],
  },

  // TRAINER
  {
    id: "q3",
    category: "trainer",
    text: "مدى وضوح الشرح واستجابة المدرب للأسئلة؟",
    hint: "هل يقدّم أمثلة عملية؟ هل يرد سريعًا؟",
    status: "active",
    priority: "high",
    createdAt: "2025-08-03",
    answers: [
      {
        id: "a4",
        user: "سارة علي",
        avatar: "SA",
        rating: 5,
        comment: "المدرب رائع وبيجاوب على كل الأسئلة بوضوح تام.",
        date: "2025-08-12",
        likes: 12,
        verified: true,
      },
      {
        id: "a5",
        user: "محمود سمير",
        avatar: "MS",
        rating: 5,
        comment: "تفاعل ممتاز ومتابعة للواجبات والمشاريع.",
        date: "2025-08-18",
        likes: 10,
        verified: true,
      },
    ],
  },

  // COURSE
  {
    id: "q4",
    category: "course",
    text: "تنظيم محتوى الدورة وجودة المواد المرفقة؟",
    status: "active",
    priority: "medium",
    createdAt: "2025-08-04",
    answers: [
      {
        id: "a6",
        user: "محمد خالد",
        avatar: "MK",
        rating: 4,
        comment: "تقسيم الوحدات ممتاز والمرفقات مفيدة ومنظمة بشكل رائع.",
        date: "2025-08-05",
        likes: 4,
        verified: false,
      },
    ],
  },

  // GENERAL
  {
    id: "q5",
    category: "general",
    text: "ما تقييمك العام لتجربتك معنا؟",
    status: "active",
    priority: "low",
    createdAt: "2025-08-05",
    answers: [
      {
        id: "a7",
        user: "ندى عصام",
        avatar: "NE",
        rating: 4,
        comment: "تجربة إيجابية جداً وسهولة في الدفع والتواصل.",
        date: "2025-07-28",
        likes: 2,
        verified: true,
      },
    ],
  },
];

/** =========================
 *  UI Components & Helpers
 *  ========================= */
function StatusBadge({ status, priority }) {
  const statusColors = {
    active: "bg-green-100 text-green-700 border-green-200",
    draft: "bg-yellow-100 text-yellow-700 border-yellow-200",
    archived: "bg-gray-100 text-gray-700 border-gray-200",
  };

  const priorityColors = {
    high: "bg-red-100 text-red-700",
    medium: "bg-orange-100 text-orange-700",
    low: "bg-blue-100 text-blue-700",
  };

  return (
    <div className="flex items-center gap-2">
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium border ${
          statusColors[status] || statusColors.active
        }`}
      >
        {status === "active" ? "نشط" : status === "draft" ? "مسودة" : "مؤرشف"}
      </span>
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          priorityColors[priority] || priorityColors.medium
        }`}
      >
        {priority === "high" ? "عالي" : priority === "medium" ? "متوسط" : "منخفض"}
      </span>
    </div>
  );
}

function averageRating(answers) {
  if (!answers.length) return 0;
  const sum = answers.reduce((s, a) => s + (a.rating || 0), 0);
  return +(sum / answers.length).toFixed(1);
}

function getLastActivityDate(q) {
  const dates = [...(q.answers || []).map((a) => a.date), q.createdAt].filter(Boolean);
  const iso = dates.sort().at(-1);
  return iso ? new Date(iso) : null;
}



function QuestionActionsMenu({ question, setEditModal, setRowData, onDelete }) {
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

function QuestionCard({ question, setRowData, setEditModal, onDelete }) {
  const totalLikes = question.answers.reduce((sum, a) => sum + (a.likes || 0), 0);

  return (
    <div className="bg-white relative rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group">
      {/* Decorative bubble */}
      <div className="absolute w-32 h-32 -top-10 -right-20 rounded-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 group-hover:from-blue-500/20 group-hover:to-purple-500/20 transition-all duration-300"></div>

      <div className="p-6 flex flex-col gap-5 relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <StatusBadge status={question.status} priority={question.priority} />
          <QuestionActionsMenu
            question={question}
            setEditModal={setEditModal}
            setRowData={setRowData}
            onDelete={onDelete}
          />
        </div>

        <h3 className="text-lg font-semibold text-gray-800 leading-relaxed mb-2">
          {question.text}
        </h3>
        {question.hint && <p className="text-sm text-gray-500 mb-3">{question.hint}</p>}

        {/* Stats */}
        <div className="flex items-center gap-4 mb-2 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <MessageSquare className="w-4 h-4" />
            <span>{question.answers.length} إجابة</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500" />
            <span>{averageRating(question.answers)}</span>
          </div>
          <div className="flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            <span>{totalLikes} إعجاب</span>
          </div>
        </div>

        {/* Answers preview */}
        <div className="space-y-3">
          {question.answers.slice(0, 2).map((answer) => (
            <div
              key={answer.id}
              className="rounded-xl border border-gray-100 bg-gray-50/60 p-4 hover:bg-white hover:shadow-sm transition-all duration-200"
            >
              <p className="text-sm text-gray-700 leading-relaxed line-clamp-2">{answer.comment}</p>
            </div>
          ))}

          {question.answers.length === 0 && (
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
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                question.status === "active"
                  ? "bg-green-500"
                  : question.status === "draft"
                  ? "bg-yellow-500"
                  : "bg-gray-500"
              }`}
            />
            <span className="text-xs text-gray-500">
              {question.category === "platform"
                ? "المنصة"
                : question.category === "trainer"
                ? "المدرب"
                : question.category === "course"
                ? "الدورة"
                : "عام"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/** ============== TABLE VIEW ============== */
function RatingsTable({ items, setEditModal, setRowData, onDelete }) {
  return (
    <div className="mt-8 overflow-x-auto rounded-2xl border border-gray-200 bg-white">
      <table className="min-w-full text-right" dir="rtl">
        <thead className="bg-gray-50">
          <tr className="text-gray-600 text-sm">
            <th className="px-4 py-3 font-semibold">السؤال</th>
            <th className="px-4 py-3 font-semibold">القسم</th>
            <th className="px-4 py-3 font-semibold">الحالة</th>
            <th className="px-4 py-3 font-semibold">الأولوية</th>
            <th className="px-4 py-3 font-semibold">عدد الإجابات</th>
            <th className="px-4 py-3 font-semibold">متوسط التقييم</th>
            <th className="px-4 py-3 font-semibold">آخر نشاط</th>
            <th className="px-4 py-3 font-semibold">إجراءات</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {items.map((q) => {
            const last = getLastActivityDate(q);
            return (
              <tr key={q.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-4">
                  <div className="font-medium text-gray-900">{q.text}</div>
                  {q.hint && <div className="text-xs text-gray-500 mt-1 line-clamp-1">{q.hint}</div>}
                </td>
                <td className="px-4 py-4">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-50 text-blue-700">
                    {q.category === "platform"
                      ? "المنصة"
                      : q.category === "trainer"
                      ? "المدرب"
                      : q.category === "course"
                      ? "الدورة"
                      : "عام"}
                      
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                      q.status === "active"
                        ? "bg-green-100 text-green-700"
                        : q.status === "draft"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {q.status === "active" ? "نشط" : q.status === "draft" ? "مسودة" : "مؤرشف"}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                      q.priority === "high"
                        ? "bg-red-100 text-red-700"
                        : q.priority === "medium"
                        ? "bg-orange-100 text-orange-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {q.priority === "high" ? "عالي" : q.priority === "medium" ? "متوسط" : "منخفض"}
                  </span>
                </td>
                <td className="px-4 flex justify-center items-center text-center py-4">
                  <div className="flex items-center gap-1 justify-end text-gray-700">
                    <MessageSquare className="w-4 h-4" />
                    {q.answers?.length || 0}
                  </div>
                </td>
                <td className="px-4 py-4  text-gray-700">{averageRating(q.answers)}</td>
                <td className="px-4 py-4 text-gray-700">{last ? last.toLocaleDateString("ar-EG") : "-"}</td>
                <td className="px-4 py-4">
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
              <td colSpan={8} className="px-4 py-10 text-center text-gray-500">
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
export default function RatingPage() {
  const [activeTab, setActiveTab] = useState(1);
  const [query, setQuery] = useState("");
  const [minRating, setMinRating] = useState(0);
  const [sort, setSort] = useState("newest");
  const [NewModal, setNewModal] = useState(false);
  const [viewMode, setViewMode] = useState("grid"); // "grid" | "table"
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteModal, setDeleteModal] = useState({ open: false, question: null });
  const [EditModal, setEditModal] = useState(false);
  const [rowData, setRowData] = useState({});

  useEffect(() => {
    document.body.style.overflow = EditModal || NewModal ? "hidden" : "auto";
  }, [EditModal, NewModal]);

  const activeKey = useMemo(
    () => TABS.find((t) => t.id === activeTab)?.key ?? "all",
    [activeTab]
  );

  /** Filter questions per tab, then search/sort */
  const questions = useMemo(() => {
    let list = QA_DATA.filter((q) => (activeKey === "all" ? true : q.category === activeKey));

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
  }, [activeKey, query, minRating, sort]);

  const handleDelete = (question) => {
    setRowData(question); // لتمرير البيانات لمودال الحذف
    setDeleteModal({ open: true, question });
  };

  const totalQuestions = QA_DATA.length;
  const totalAnswers = QA_DATA.reduce((sum, q) => sum + q.answers.length, 0);
  const averageOverallRating =
    QA_DATA.reduce((sum, q) => sum + averageRating(q.answers), 0) / totalQuestions;

  return (
    <PageLayout>
      <div dir="rtl" className="min-h-screen p-6 bg-gray-50">
        {/* Breadcrumbs */}
        <BreadcrumbsShowcase variant="pill" items={breadcrumbs} />

        {/* Header */}
        <PagesHeader
          title="إدارة التقييم"
          subtitle="نظّم وأدر التقييمات والمراجعات"
          extra={
            <div className="flex items-center gap-4 gap-reverse">
              <Button type="default" icon={<Upload className="w-4 h-4" />}>
                استيراد
              </Button>
              <Button type="secondary" icon={<Download className="w-4 h-4" />}>
                تصدير
              </Button>
              <Button onClick={() => setNewModal(true)} type="primary" size="large" icon={<Plus className="w-5 h-5" />}>
                إضافة تقييم جديد
              </Button>
            </div>
          }
        />

        {/* Stats Cards */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 mb-3 gap-4">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{totalQuestions}</p>
                <p className="text-sm text-gray-600">إجمالي الأسئلة</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{totalAnswers}</p>
                <p className="text-sm text-gray-600">إجمالي الإجابات</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{averageOverallRating.toFixed(1)}</p>
                <p className="text-sm text-gray-600">متوسط التقييم</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">+12%</p>
                <p className="text-sm text-gray-600">نمو هذا الشهر</p>
              </div>
            </div>
          </div>
        </div>

        <SearchAndFilters mode={viewMode} setMode={setViewMode} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

        {/* Tabs */}
        <div className="mt-6 flex flex-wrap gap-3">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`group relative px-6 py-3 rounded-2xl font-semibold transition-all duration-300 flex items-center gap-3 ${
                activeTab === tab.id
                  ? " bg-primary text-white shadow-lg scale-105"
                  : "bg-white/80 backdrop-blur-sm text-gray-700 border-2 border-gray-200 hover:bg-white hover:border-blue-300 hover:scale-105 shadow-sm"
              }`}
            >
              <div className={`w-2.5 h-2.5 rounded-full ${activeTab === tab.id ? "bg-white" : "bg-primary"}`} />
              <span>{tab.title}</span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  activeTab === tab.id ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* View switch: Grid or Table */}
        {viewMode === "grid" ? (
          <div className="mt-8 grid grid-cols-1 xl:grid-cols-2 gap-6">
            {questions.map((question) => (
              <QuestionCard
                key={question.id}
                question={question}
                setEditModal={setEditModal}
                setRowData={setRowData}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <RatingsTable
            items={questions}
            setEditModal={setEditModal}
            setRowData={setRowData}
            onDelete={handleDelete}
          />
        )}

        {/* Global empty state (grid only) */}
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
      <AddRatingModal open={NewModal} setOpen={setNewModal} activeTab={activeTab} />
      <EditRatingModal open={EditModal} setOpen={setEditModal} rowData={rowData} activeTab={activeTab} setRowData={setRowData} />
      <DeleteRatingModal open={deleteModal?.open} setOpen={setDeleteModal} rowData={rowData} />
    </PageLayout>
  );
}
