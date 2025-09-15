"use client";
import React, { useEffect, useMemo, useState } from "react";
import StudentRatingHeader from "./StudentRatingHeader";
import { Rate, Pagination } from "antd";
import { Eye, EyeOff } from "lucide-react";

export default function StudentRatings({ data = [] }) {
  // نسخة محلية + hidden
  const [ratings, setRatings] = useState([]);
  const [activeTab, setActiveTab] = useState(1); // 1: الكل، 2: مخفي، 3: ظاهر
  const [query, setQuery] = useState("");

  // Pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(9); // جرّب 6/9/12 حسب التصميم

  useEffect(() => {
    setRatings(
      (data || []).map((it, idx) => ({
        id: it.id ?? idx + 1,
        hidden: !!it.hidden,
        ...it,
      }))
    );
  }, [data]);

  const counts = useMemo(() => {
    const total = ratings.length;
    const hidden = ratings.filter((r) => r.hidden).length;
    const visible = total - hidden;
    return { total, hidden, visible };
  }, [ratings]);

  const tabDefs = [
    { id: 1, title: `الكل (${counts.total})` },
    { id: 2, title: `مخفي (${counts.hidden})` },
    { id: 3, title: `ظاهر (${counts.visible})` },
  ];

  const filtered = useMemo(() => {
    let list = ratings;
    if (activeTab === 2) list = ratings.filter((r) => r.hidden);
    else if (activeTab === 3) list = ratings.filter((r) => !r.hidden);

    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (r) =>
          (r.name || "").toLowerCase().includes(q) ||
          (r.type || "").toLowerCase().includes(q) ||
          (r.category || "").toLowerCase().includes(q) ||
          (r.description || "").toLowerCase().includes(q)
      );
    }
    return list;
  }, [ratings, activeTab, query]);

  // ارجاع الصفحة للأولى عند تغيير الفلاتر/البحث
  useEffect(() => {
    setPage(1);
  }, [activeTab, query, ratings.length]);

  // لو الصفحة الحالية خرجت عن المدى بعد تغيير الفلترة/الحجم
  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
    if (page > totalPages) setPage(totalPages);
  }, [filtered.length, page, pageSize]);

  const startIdx = (page - 1) * pageSize;
  const endIdx = Math.min(startIdx + pageSize, filtered.length);
  const pageItems = filtered.slice(startIdx, endIdx);

  const toggleHidden = (id) => {
    setRatings((prev) =>
      prev.map((r) => (r.id === id ? { ...r, hidden: !r.hidden } : r))
    );
  };

  const typeLabel = (t) =>
    t === "student"
      ? "طالب"
      : t === "parent"
      ? "وليّ أمر"
      : t === "teacher"
      ? "معلّم"
      : t || "أخرى";

  return (
    <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8">
      {/* الهيدر يقرأ كل البيانات */}
      <StudentRatingHeader data={ratings} />

      {/* البحث + أدوات */}
      <div className="my-4 grid grid-cols-1 lg:grid-cols-2 gap-14 justify-between items-center">
        <input
          className="border w-full border-gray-200 rounded-xl p-2 focus:outline-none"
          placeholder="بحث بالاسم/النوع/الفئة/الوصف..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        {/* التبويبات */}
        <div className="grid grid-cols-3 gap-2 items-center">
          {tabDefs.map((tab) => (
            <button
              key={tab.id}
              className={`group relative justify-center  px-6 py-3 rounded-xl text-sm md:text-base font-medium transition-all duration-300 flex items-center gap-3 min-w-fit
                ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-[#3B82F6] to-[#F97316] text-white shadow-lg scale-105"
                    : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:shadow-md"
                }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.title}
            </button>
          ))}
        </div>

       
      </div>

      {/* القائمة */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {pageItems.map((item) => (
          <div
            key={item.id}
            className="bg-white flex flex-col gap-3 hover:scale-[1.01] transition-all duration-150 relative p-4 rounded-[15px] border-[2px] border-[#C8C9D5]"
          >
            <div className="absolute bg-gradient-to-tr from-primary to-secondary w-20 h-20 rounded-full blur-3xl pointer-events-none"></div>

            <div className="flex justify-between items-start gap-2">
              <div className="flex items-center gap-2">
                <img
                  src={
                    item?.image ||
                    "https://ui-avatars.com/api/?name=User&background=CBD5E1&color=334155&rounded=true&size=128"
                  }
                  className="w-10 h-10 rounded-full object-cover"
                  alt=""
                />
                <div className="flex flex-col">
                  <h3 className="text-black font-bold">
                    {item?.name || "مستخدم"}
                  </h3>
                  <p className="text-gray-400">{typeLabel(item?.type)}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {item?.category && (
                  <div className="rounded-[12px] px-2 py-1 bg-[#C2D8FC] text-blue-950 text-xs">
                    {item.category}
                  </div>
                )}
                <button
                  onClick={() => toggleHidden(item.id)}
                  className={`rounded-[12px] px-3 py-2 text-xs md:text-sm border transition
                    ${
                      item.hidden
                        ? "bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
                        : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                    }`}
                  title={item.hidden ? "إظهار التقييم" : "إخفاء التقييم"}
                >
                  <span className="inline-flex items-center gap-1">
                    {item.hidden ? <Eye size={16} /> : <EyeOff size={16} />}
                  </span>
                </button>
              </div>
            </div>

            {item.hidden && (
              <div className="absolute top-2 left-2 bg-red-100 text-red-700 text-xs px-2 py-1 rounded-md">
                مخفي
              </div>
            )}

            <div className="flex items-center gap-2">
              <Rate value={Number(item?.rating) || 0} allowHalf disabled />
              <span className="text-sm text-gray-600">
                {Number(item?.rating || 0).toFixed(1)} / 5
              </span>
            </div>

            {item?.description && (
              <p className="text-gray-500 font-medium mt-2 leading-relaxed">
                {item.description}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* لا توجد نتائج */}
      {filtered.length === 0 && (
        <div className="text-center text-gray-500 mt-8">
          لا توجد تقييمات مطابقة لفلتر العرض أو البحث.
        </div>
      )}

      {/* أزرار التنقل بين الصفحات */}
      {filtered.length > 0 && (
        <div className="mt-6 flex items-center justify-center">
          <Pagination
            current={page}
            total={filtered.length}
            pageSize={pageSize}
            showSizeChanger={false} // نتحكم في الحجم من الـ select بالأعلى
            onChange={(p) => setPage(p)}
            showLessItems
          />
        </div>
      )}
    </div>
  );
}
