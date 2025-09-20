"use client";
import React, { useMemo, useState } from "react";
import { BarChart3, Crown, Medal, Search, Trophy, Star, ChevronUp, Zap, Target, Award } from "lucide-react";
import BreadcrumbsShowcase from "../../../../../components/ui/BreadCrumbs";
import PagesHeader from "../../../../../components/ui/PagesHeader";

// Mock PageLayout and components since they're not available
const PageLayout = ({ children }) => <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">{children}</div>;





const breadcrumbs = [
  { label: "الرئيسية", href: "/", icon: BarChart3 },
  { label: "المسابقات", href: "#", current: true },
];

const seed = {
  daily: [
    { id: 1, name: "أحمد علي", points: 180, streak: 7, level: "محترف" },
    { id: 2, name: "فاطمة محمد", points: 175, streak: 5, level: "متقدم" },
    { id: 3, name: "سارة خالد", points: 160, streak: 3, level: "متقدم" },
    { id: 4, name: "محمد إبراهيم", points: 160, streak: 4, level: "متوسط" },
    { id: 5, name: "خالد سمير", points: 140, streak: 2, level: "متوسط" },
    { id: 6, name: "نورهان ياسر", points: 130, streak: 6, level: "متوسط" },
    { id: 7, name: "مصطفى عماد", points: 110, streak: 1, level: "مبتدئ" },
  ],
  weekly: [
    { id: 11, name: "ليلى حسن", points: 920, streak: 12, level: "خبير" },
    { id: 12, name: "محمود سعيد", points: 910, streak: 10, level: "محترف" },
    { id: 13, name: "سلمى طارق", points: 880, streak: 8, level: "محترف" },
    { id: 14, name: "عمر شريف", points: 870, streak: 7, level: "متقدم" },
    { id: 15, name: "يمنى يوسف", points: 860, streak: 9, level: "متقدم" },
  ],
  monthly: [
    { id: 21, name: "زياد محمد", points: 4010, streak: 25, level: "أسطورة" },
    { id: 22, name: "هند خالد", points: 3980, streak: 23, level: "خبير" },
    { id: 23, name: "جنى أحمد", points: 3920, streak: 20, level: "خبير" },
    { id: 24, name: "كريم أشرف", points: 3890, streak: 18, level: "محترف" },
    { id: 25, name: "آية سمير", points: 3850, streak: 16, level: "محترف" },
    { id: 26, name: "يوسف عمرو", points: 3820, streak: 15, level: "محترف" },
  ],
};

// احسب المراكز مع مراعاة التعادلات (Dense Ranking)
function rankify(rows) {
  const sorted = [...rows].sort((a, b) => b.points - a.points);
  let lastPoints = null;
  let lastRank = 0;
  let count = 0;
  return sorted.map((r) => {
    count += 1;
    if (r.points !== lastPoints) {
      lastRank = count;
      lastPoints = r.points;
    }
    return { ...r, rank: lastRank };
  });
}



export default function LeaderboardPage() {
  const [scope, setScope] = useState("daily");
  const [search, setSearch] = useState("");

  const ranked = useMemo(() => {
    const base = seed[scope] ?? [];
    const filtered = base.filter((x) =>
      x.name.toLowerCase().includes(search.trim().toLowerCase())
    );
    return rankify(filtered);
  }, [scope, search]);

  const top3 = ranked.slice(0, 3);
  const rest = ranked.slice(3);

  const scopeConfigs = [
    { id: "daily", label: "يومي", icon: Target, color: "bg-emerald-500" },
    { id: "weekly", label: "أسبوعي", icon: Zap, color: "bg-blue-500" },
    { id: "monthly", label: "شهري", icon: Award, color: "bg-purple-500" },
  ];

  return (
    <PageLayout>
      <div className="max-w-6xl mx-auto p-6" dir="rtl">
        <BreadcrumbsShowcase variant="pill" items={breadcrumbs} />
        <PagesHeader
          title="لوحة المتصدرين في المسابقات" 
          subtitle="أعلى اللاعبين وفقًا للنقاط والإنجازات" 
        />

        {/* أدوات التصفية المحسنة */}
        <div className="flex flex-col lg:flex-row gap-6 items-center justify-between mb-8">
          <div className="flex gap-3">
            {scopeConfigs.map((config) => (
              <button
                key={config.id}
                onClick={() => setScope(config.id)}
                className={`group relative overflow-hidden px-6 py-3 rounded-2xl font-medium transition-all duration-300 transform hover:scale-105 ${
                  scope === config.id
                    ? `${config.color} text-white shadow-lg`
                    : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 shadow-sm"
                }`}
              >
                <div className="flex items-center gap-2">
                  <config.icon className="w-5 h-5" />
                  {config.label}
                </div>
                {scope === config.id && (
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent" />
                )}
              </button>
            ))}
          </div>

          <div className="relative max-w-xs w-full">
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث عن لاعب..."
              className="w-full rounded-2xl border border-gray-200 px-12 py-3 bg-white/80 backdrop-blur focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent shadow-sm"
            />
          </div>
        </div>

        {/* قمة التصنيف المحسنة */}
        {ranked.length > 0 ? (
          <>
            {/* المراكز الثلاثة الأولى */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {top3.map((player, idx) => {
                const isFirst = player.rank === 1;
                const isSecond = player.rank === 2;
                const isThird = player.rank === 3;
                
                const podiumHeight = isFirst ? "h-32" : isSecond ? "h-28" : "h-24";
                const gradients = {
                  1: "from-yellow-400 via-amber-500 to-orange-500",
                  2: "from-gray-300 via-gray-400 to-gray-500", 
                  3: "from-amber-600 via-orange-600 to-red-600"
                };

                return (
                  <div
                    key={player.id}
                    className={`relative group transform transition-all duration-500 hover:scale-105 ${
                      isFirst ? "md:order-2 scale-110" : isSecond ? "md:order-1" : "md:order-3"
                    }`}
                  >
                    {/* خلفية متحركة */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className={`relative bg-gradient-to-br ${gradients[player.rank]} p-1 rounded-3xl shadow-2xl`}>
                      <div className="bg-white rounded-3xl p-6">
                        {/* رقم المركز */}
                        <div className="flex items-center justify-between mb-4">
                          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm bg-gradient-to-r ${gradients[player.rank]} text-white shadow-lg`}>
                            {isFirst ? <Crown className="w-5 h-5" /> : <Medal className="w-5 h-5" />}
                            المركز {player.rank === 1 ? "الأول" : player.rank === 2 ? "الثاني" : "الثالث"}
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-gray-800">{player.points}</div>
                            <div className="text-xs text-gray-500">نقطة</div>
                          </div>
                        </div>

                        {/* اسم اللاعب */}
                        <div className="text-xl font-bold text-gray-900 mb-2">{player.name}</div>
                                              
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* باقي المتسابقين */}
            {rest.length > 0 && (
              <div className="bg-white/80 backdrop-blur rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-4">
                  <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-blue-600" />
                    باقي المتسابقين
                  </h3>
                </div>

                <div className="divide-y divide-gray-100">
                  {rest.map((player, index) => (
                    <div
                      key={player.id}
                      className="px-6 py-4 hover:bg-blue-50/50 transition-all duration-300 group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          {/* رقم المركز */}
                          <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                            <span className="font-bold text-gray-700">#{player.rank}</span>
                          </div>
                          
                          {/* معلومات اللاعب */}
                          <div>
                            <div className="font-semibold text-gray-900 text-lg">{player.name}</div>
                           
                          </div>
                        </div>

                        {/* النقاط */}
                        <div className="text-right">
                          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-xl font-bold shadow-lg group-hover:shadow-xl transition-shadow">
                            <ChevronUp className="w-4 h-4" />
                            {player.points}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <div className="bg-white/80 backdrop-blur rounded-3xl shadow-xl border border-gray-100 p-12">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
                <Search className="w-10 h-10 text-gray-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">لا توجد نتائج</h3>
              <p className="text-gray-600">لم يتم العثور على أي لاعبين يطابقون بحثك</p>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
}