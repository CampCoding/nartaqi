"use client";
import React, { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  Plus,
  Edit3,
  Trash2,
  X,
  Save,
  Search,
  BookOpen,
  Target,
  Calendar,
  Filter,
  Eye,
  Grid,
  List,
} from "lucide-react";
import BreadcrumbsShowcase from "../../../components/ui/BreadCrumbs";
import PagesHeader from "../../../components/ui/PagesHeader";
import Button from "../../../components/atoms/Button";
import ExamSectionGrid from "../../../components/ExamSections/ExamSectionGrid";
import ExamSectionTable from "../../../components/ExamSections/ExamSectionTable";
import ExamSectionAddNewModal from "../../../components/ExamSections/ExamSectionAddNewModal";

const breadcrumbs = [
  { label: "الرئيسية", href: "/", icon: BarChart3 },
  { label: "أقسام الاختبارات", href: "#" },
];

const tabs = [
  {
    id: 1,
    title: "تدريب",
    icon: BookOpen,
    color: "blue",
    description: "أقسام التدريب والممارسة",
  },
  {
    id: 2,
    title: "الاختبار المحاكي",
    icon: Target,
    color: "emerald",
    description: "أقسام الاختبارات النهائية",
  },
];

// Mock data for demonstration
export const mock_exam_section_Data = {
  1: [
    {
      id: "1",
      name: "أساسيات البرمجة",
      desc: "تعلم المفاهيم الأساسية للبرمجة",
      createdAt: "2024-01-15T10:30:00.000Z",
    },
    {
      id: "2",
      name: "هياكل البيانات",
      desc: "دراسة الهياكل المختلفة لتنظيم البيانات",
      createdAt: "2024-01-20T14:20:00.000Z",
    },
  ],
  2: [
    {
      id: "3",
      name: "اختبار شامل - المستوى الأول",
      desc: "اختبار تقييمي شامل للمستوى المبتدئ",
      createdAt: "2024-01-25T09:15:00.000Z",
    },
  ],
};

const difficultyColors = {
  مبتدئ: "bg-green-100 text-green-800",
  متوسط: "bg-yellow-100 text-yellow-800",
  متقدم: "bg-red-100 text-red-800",
};

export default function ExamSectionsPage() {
  const [newModal, setNewModal] = useState(false);
  const [activeTab, setActiveTab] = useState(1);
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'table'

  // form state
  const [form, setForm] = useState({
    name: "",
    desc: "",
    difficulty: "مبتدئ",
    questionsCount: 0,
    category: 1, // Add category to form
  });
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");

  // data per tab
  const [data, setData] = useState(mock_exam_section_Data);

  const resetForm = () => {
    setForm({
      name: "",
      desc: "",
      difficulty: "مبتدئ",
      questionsCount: 0,
      category: activeTab, // Set default category to current active tab
    });
    setError("");
    setEditing(null);
  };

  const openNew = () => {
    resetForm();
    setNewModal(true);
  };

  const onSave = () => {
    const name = form.name.trim();
    const desc = form.desc.trim();
    if (!name) {
      setError("الاسم مطلوب");
      return;
    }
    if (form.questionsCount < 0) {
      setError("عدد الأسئلة يجب أن يكون رقماً موجباً");
      return;
    }

    const id =
      editing?.id ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;

    setData((prev) => {
      const copy = { ...prev };
      const targetCategory = form.category; // Use selected category from form
      const list = [...(copy[targetCategory] || [])];

      const payload = {
        id,
        name,
        desc,
        difficulty: form.difficulty,
        questionsCount: parseInt(form.questionsCount) || 0,
        createdAt: editing?.createdAt || new Date().toISOString(),
      };

      if (editing) {
        // If editing and category changed, remove from old category and add to new
        if (editing.category !== targetCategory) {
          copy[editing.category] = (copy[editing.category] || []).filter(
            (x) => x.id !== editing.id
          );
        }
        const targetList = [...(copy[targetCategory] || [])];
        const i = targetList.findIndex((x) => x.id === editing.id);
        if (i >= 0) {
          targetList[i] = { ...targetList[i], ...payload };
        } else {
          targetList.unshift(payload);
        }
        copy[targetCategory] = targetList;
      } else {
        list.unshift(payload);
        copy[targetCategory] = list;
      }
      return copy;
    });

    setNewModal(false);
    resetForm();
  };

  const onEdit = (item) => {
    setEditing({
      tabId: activeTab,
      id: item.id,
      createdAt: item.createdAt,
      category: activeTab,
    });
    setForm({
      name: item.name,
      desc: item.desc,
      difficulty: item.difficulty || "مبتدئ",
      questionsCount: item.questionsCount || 0,
      category: activeTab,
    });
    setNewModal(true);
  };

  const onDelete = (id) => {
    if (!confirm("هل أنت متأكد من حذف هذا القسم؟")) return;
    setData((prev) => {
      const copy = { ...prev };
      copy[activeTab] = (copy[activeTab] || []).filter((x) => x.id !== id);
      return copy;
    });
  };

  // search & filter
  const [q, setQ] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("all");

  const filtered = useMemo(() => {
    const list = data[activeTab] || [];
    let result = list;

    // Apply search filter
    const s = q.trim().toLowerCase();
    if (s) {
      result = result.filter(
        (x) =>
          x.name.toLowerCase().includes(s) ||
          (x.desc || "").toLowerCase().includes(s)
      );
    }

    // Apply difficulty filter
    if (difficultyFilter !== "all") {
      result = result.filter((x) => x.difficulty === difficultyFilter);
    }

    return result;
  }, [data, activeTab, q, difficultyFilter]);

  const currentTab = tabs.find((t) => t.id === activeTab);
  const totalItems = data[activeTab]?.length || 0;

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50"
      dir="rtl"
    >
      <div className="container mx-auto px-4 py-8 space-y-6">
        <BreadcrumbsShowcase variant="pill" items={breadcrumbs} />

        {/* Header */}
        <PagesHeader
          title={"أقسام الاختبارات والتدريب"}
          subtitle={"تنظيم واداره الأقسام التعليمية"}
          extra={
            <div>
              <Button
                onClick={() => setNewModal(true)}
                type="primary"
                icon={<Plus className="w-5 h-5" />}
              >
                إضافة
              </Button>
            </div>
          }
        />

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div className="flex gap-3">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                const Icon = tab.icon;
                return (
                  <button
                    onClick={() => {
                      setActiveTab(tab.id);
                      setQ("");
                      setDifficultyFilter("all");
                    }}
                    key={tab.id}
                    className={`relative flex items-center gap-3 px-6 py-4 rounded-xl border-2 transition-all duration-200 ${
                      isActive
                        ? `border-${tab.color}-200 bg-gradient-to-r from-${tab.color}-50 to-${tab.color}-100 text-${tab.color}-700`
                        : "border-gray-200 bg-white hover:border-gray-300 text-gray-700"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <div className="text-right">
                      <div className="font-semibold">{tab.title}</div>
                      <div className="text-xs opacity-75">
                        {tab.description}
                      </div>
                    </div>
                    <div
                      className={`absolute -top-2 -right-2 w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${
                        isActive
                          ? `bg-${tab.color}-500 text-white`
                          : "bg-gray-400 text-white"
                      }`}
                    >
                      {data[tab.id]?.length || 0}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Enhanced Filters */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="relative flex-1 max-w-md">
              <input
                className="w-full rounded-xl border-2 border-gray-200 px-12 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all"
                placeholder="ابحث بالاسم أو الوصف..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
              <Search className="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>

            <div className="text-sm text-gray-600 bg-gray-100 px-4 py-2 rounded-xl">
              {filtered.length} من {totalItems} عنصر
            </div>
          </div>
        </div>

        {viewMode === "grid" ? (
          <ExamSectionGrid
            currentTab={currentTab}
            filtered={filtered}
            onDelete={onDelete}
            onEdit={onEdit}
            openNew={openNew}
          />
        ) : (
          <ExamSectionTable
            filtered={filtered}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        )}

        {newModal && (
         <ExamSectionAddNewModal form={form} onSave={onSave} error={error} editing={editing} resetForm={resetForm} setForm={setForm} setNewModal={setNewModal} tabs={tabs}/>
        )}
      </div>
    </div>
  );
}
