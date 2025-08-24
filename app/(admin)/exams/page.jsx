"use client";
import React, { useEffect, useRef, useState } from "react";
import PageLayout from "../../../components/layout/PageLayout";
import BreadcrumbsShowcase from "../../../components/ui/BreadCrumbs";
import {
  BarChart3,
  Download,
  FileText,
  Plus,
  Upload,
  Eye,
  Edit3,
  Trash2,
  Clock,
  Users,
  Filter,
  MoreVertical,
  Calendar,
  Target,
} from "lucide-react";
import PagesHeader from "../../../components/ui/PagesHeader";
import Button from "../../../components/atoms/Button";
import SearchAndFilters from "../../../components/ui/SearchAndFilters";

const breadcrumbs = [
  { label: "الرئيسية", href: "/", icon: BarChart3 },
  { label: "الاختبارات", href: "/exams", icon: FileText, current: true },
];

export default function ExamsPage() {
  const [newModal, setAddNewModal] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  // مَنُيو النقاط: من فتوح؟
  const [openMenuFor, setOpenMenuFor] = useState(null);
  const menuRef = useRef(null);

  // إغلاق القائمة عند الضغط خارجها
  useEffect(() => {
    const onClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenuFor(null);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const [exams, setExams] = useState([
    { id: 1, title: "اختبار الرياضيات المتقدم", description: "الجبر والهندسة التحليلية", questions: 20, status: "نشط", duration: 90, participants: 245, rating: 4.8, lastModified: "منذ يومين", difficulty: "متوسط", subject: "رياضيات" },
    { id: 2, title: "اختبار اللغة الإنجليزية", description: "قواعد النحو والمفردات", questions: 15, status: "مسودة", duration: 60, participants: 0, rating: 0, lastModified: "منذ ساعة", difficulty: "سهل", subject: "لغة إنجليزية" },
    { id: 3, title: "اختبار العلوم الطبيعية", description: "الفيزياء والكيمياء العضوية", questions: 25, status: "منشور", duration: 120, participants: 189, rating: 4.5, lastModified: "منذ 3 أيام", difficulty: "صعب", subject: "علوم" },
    { id: 4, title: "اختبار التاريخ الحديث", description: "القرن العشرين والأحداث المعاصرة", questions: 18, status: "نشط", duration: 75, participants: 156, rating: 4.2, lastModified: "منذ أسبوع", difficulty: "متوسط", subject: "تاريخ" },
  ]);

  const statusColors = {
    نشط: "bg-green-50 text-green-700 border-green-200",
    مسودة: "bg-yellow-50 text-yellow-700 border-yellow-200",
    منشور: "bg-blue-50 text-blue-700 border-blue-200",
  };

  const difficultyColors = {
    سهل: "bg-green-100 text-green-800",
    متوسط: "bg-yellow-100 text-yellow-800",
    صعب: "bg-red-100 text-red-800",
  };

  const filteredExams = exams.filter((exam) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      exam.title.toLowerCase().includes(q) ||
      exam.description.toLowerCase().includes(q) ||
      exam.subject.toLowerCase().includes(q);
    const matchesFilter = selectedFilter === "all" || exam.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  // Handlers للأكشنز
  const handleView = (exam) => {
    setOpenMenuFor(null);
    // TODO: افتح صفحة/مودال المعاينة
    console.log("عرض:", exam);
  };
  const handleEdit = (exam) => {
    setOpenMenuFor(null);
    // TODO: افتح مودال التعديل
    console.log("تعديل:", exam);
  };
  const handleDelete = (exam) => {
    setOpenMenuFor(null);
    // حذف بسيط تجريبي
    setExams((prev) => prev.filter((e) => e.id !== exam.id));
  };

  const stats = [
    { label: "إجمالي الاختبارات", value: exams.length, icon: FileText, color: "bg-blue-500" },
    { label: "الاختبارات النشطة", value: exams.filter((e) => e.status === "نشط").length, icon: Target, color: "bg-green-500" },
    { label: "المسودات", value: exams.filter((e) => e.status === "مسودة").length, icon: Edit3, color: "bg-yellow-500" },
    { label: "إجمالي المشاركين", value: exams.reduce((s, e) => s + e.participants, 0), icon: Users, color: "bg-purple-500" },
  ];

  return (
    <PageLayout>
      <div dir="rtl">
        <BreadcrumbsShowcase items={breadcrumbs} variant="pill" />

        <PagesHeader
          title={"إدارة الاختبارات"}
          subtitle={"مراجعة وإدارة الاختبارات التعليمية"}
          extra={
            <div className="flex items-center gap-3 flex-row-reverse">
              <Button type="default" icon={<Upload className="w-4 h-4" />}>استيراد</Button>
              <Button type="secondary" icon={<Download className="w-4 h-4" />}>تصدير</Button>
              <Button onClick={() => setAddNewModal(true)} type="primary" size="large" icon={<Plus className="w-5 h-5" />} className="shadow-lg hover:shadow-xl transition-shadow">
                إضافة اختبار جديد
              </Button>
            </div>
          }
        />

        {/* إحصائيات */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value.toLocaleString()}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* البحث والفلاتر */}
        {/* <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <SearchAndFilters searchTerm={searchTerm} setSearchTerm={setSearchTerm} mode={viewMode} setMode={setViewMode} />
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1">
                {["all", "نشط", "مسودة", "منشور"].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setSelectedFilter(filter)}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      selectedFilter === filter ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {filter === "all" ? "الكل" : filter}
                  </button>
                ))}
              </div>
              <Button type="default" icon={<Filter className="w-4 h-4" />}>فلاتر متقدمة</Button>
            </div>
          </div>
        </div> */}
        <SearchAndFilters mode={viewMode} searchTerm={searchTerm} setMode={setViewMode} setSearchTerm={setSearchTerm}/>

        {/* الكروت + منيو النقاط */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExams.map((exam) => (
            <div
              key={exam.id}
              className="bg-white relative shadow-sm rounded-2xl border border-gray-100 hover:shadow-lg hover:border-gray-200 transition-all duration-200 overflow-hidden group"
            >
              {/* Decorative dots */}
              <div className="absolute top-3 right-6 w-2 h-2 rounded-full bg-emerald-400 animate-ping opacity-70"></div>
              <div className="absolute bottom-6 left-6 w-3 h-3 rounded-full bg-blue-400 animate-bounce opacity-80"></div>

              {/* Blur circles */}
              <div className="absolute w-14 h-14 rounded-full bg-teal-500/40 top-0 -right-5 blur-3xl"></div>
              <div className="absolute w-14 h-14 rounded-full bg-indigo-500/40 bottom-0 -left-5 blur-3xl"></div>

              {/* Header */}
              <div className="p-6 pb-4 relative z-10">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                      {exam.title}
                    </h3>
                    <p className="text-gray-600 text-sm">{exam.description}</p>
                  </div>

                  {/* زر النقاط + القائمة */}
                  <div className="relative" ref={menuRef}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuFor((prev) => (prev === exam.id ? null : exam.id));
                      }}
                      className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-md hover:bg-gray-100"
                      aria-label="فتح القائمة"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>

                    {openMenuFor === exam.id && (
                      <div
                        className="absolute z-20 left-0 mt-2 w-40 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden"
                        role="menu"
                      >
                        <button
                          onClick={() => handleView(exam)}
                          className="w-full text-right px-3 py-2 text-sm hover:bg-gray-50 flex items-center justify-between"
                        >
                          عرض <Eye className="w-4 h-4 text-gray-500" />
                        </button>
                        <button
                          onClick={() => handleEdit(exam)}
                          className="w-full text-right px-3 py-2 text-sm hover:bg-gray-50 flex items-center justify-between"
                        >
                          تعديل <Edit3 className="w-4 h-4 text-gray-500" />
                        </button>
                        <button
                          onClick={() => handleDelete(exam)}
                          className="w-full text-right px-3 py-2 text-sm hover:bg-red-50 text-red-600 flex items-center justify-between"
                        >
                          حذف <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Status & Subject */}
                <div className="flex items-center gap-2 mb-4">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full border ${statusColors[exam.status]}`}>{exam.status}</span>
                  <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-md">{exam.subject}</span>
                  <span className={`px-2 py-1 text-xs rounded-md ${difficultyColors[exam.difficulty]}`}>{exam.difficulty}</span>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 text-center border-t border-gray-100 pt-4">
                  <div>
                    <div className="flex items-center justify-center text-gray-400 mb-1"><FileText className="w-4 h-4" /></div>
                    <p className="text-sm font-semibold text-gray-900">{exam.questions}</p>
                    <p className="text-xs text-gray-500">سؤال</p>
                  </div>
                  <div>
                    <div className="flex items-center justify-center text-gray-400 mb-1"><Clock className="w-4 h-4" /></div>
                    <p className="text-sm font-semibold text-gray-900">{exam.duration}</p>
                    <p className="text-xs text-gray-500">دقيقة</p>
                  </div>
                  <div>
                    <div className="flex items-center justify-center text-gray-400 mb-1"><Users className="w-4 h-4" /></div>
                    <p className="text-sm font-semibold text-gray-900">{exam.participants}</p>
                    <p className="text-xs text-gray-500">مشارك</p>
                  </div>
                </div>

                {/* Last Modified */}
                {exam.rating > 0 && (
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      {exam.lastModified}
                    </div>
                  </div>
                )}
              </div>

              {/* Actions (أزرار سريعة أسفل الكارت – اختياري) */}
             
            </div>
          ))}

          {filteredExams.length === 0 && (
            <div className="col-span-full">
              <div className="text-center text-gray-500 border-2 border-dashed border-gray-200 rounded-2xl p-12 bg-gray-50">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">لا توجد اختبارات</h3>
                <p className="text-gray-500 mb-4">لم يتم العثور على اختبارات مطابقة لمعايير البحث</p>
                <Button onClick={() => setSearchTerm("")} type="secondary">مسح البحث</Button>
              </div>
            </div>
          )}
        </div>

        {/* Pagination (شكل تجريبي) */}
        {filteredExams.length > 0 && (
          <div className="mt-8 flex items-center justify-center">
            <div className="flex items-center gap-2">
              <Button type="default" disabled>السابق</Button>
              <div className="flex items-center gap-1">
                {[1, 2, 3].map((page) => (
                  <button
                    key={page}
                    className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                      page === 1 ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <Button type="default">التالي</Button>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
