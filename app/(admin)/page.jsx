"use client";

import React, { useState } from "react";
import {
  Users,
  GraduationCap,
  HelpCircle,
  FileText,
  Bell,
  Settings,
  BarChart3,
  TrendingUp,
  Award,
  Calendar,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("نظرة عامة");
  const [notifications, setNotifications] = useState(3);
  const [hoveredCard, setHoveredCard] = useState(null);

  const menuItems = [
    { name: "نظرة عامة", icon: BarChart3 },
    { name: "المعلمين", icon: Users },
    { name: "الطلاب", icon: GraduationCap },
    { name: "الأسئلة", icon: HelpCircle },
    { name: "الامتحانات", icon: FileText },
    { name: "الإشعارات", icon: Bell, badge: notifications },
    { name: "الإعدادات", icon: Settings },
  ];

  const stats2 = [
    {
      id: 1,
      title: "عدد المعلمين",
      value: "120",
      icon: Users,
      color: "text-[#0F7490]",
      bgGradient: "from-[#0F7490]/10 to-[#0F7490]/5",
      borderColor: "border-[#0F7490]/20",
      trend: "+12 هذا الأسبوع",
    },
    {
      id: 2,
      title: "عدد الطلاب",
      value: "340",
      icon: GraduationCap,
      color: "text-[#C9AE6C]",
      bgGradient: "from-[#C9AE6C]/10 to-[#C9AE6C]/5",
      borderColor: "border-[#C9AE6C]/20",
      trend: "+3 هذا الشهر",
    },
    {
      id: 3,
      title: "عدد الأسئلة",
      value: "1,230",
      icon: HelpCircle,
      color: "text-[#8B5CF6]",
      bgGradient: "from-[#8B5CF6]/10 to-[#8B5CF6]/5",
      borderColor: "border-[#8B5CF6]/20",
      trend: "+45 نشطة اليوم",
    },
    {
      id: 4,
      title: "الامتحانات النشطة",
      value: "24",
      icon: Award,
      color: "text-[#0F7490]",
      bgGradient: "from-[#0F7490]/10 to-[#0F7490]/5",
      borderColor: "border-[#0F7490]/20",
      trend: "+12 هذا الأسبوع",
    },
  ];

  const recentActivities = [
    { action: "تم تسجيل معلم جديد", time: "منذ ساعتين", type: "user" },
    { action: 'تم إنشاء امتحان "الرياضيات النهائي"', time: "منذ 4 ساعات", type: "exam" },
    { action: "تمت إضافة 15 سؤال جديد", time: "منذ يوم", type: "question" },
    { action: "تم إنشاء تقرير أداء الطلاب", time: "منذ يومين", type: "report" },
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFC] p-6" dir="rtl">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-[#202938] mb-2">
                لوحة التحكم
              </h1>
              <p className="text-[#202938]/60 text-lg">
                مرحبًا بعودتك! إليك ملخص ما يحدث في نظامك اليوم.
              </p>
            </div>
            <div className="flex items-center gap-4 gap-reverse">
              <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
                <Calendar className="w-6 h-6 text-[#0F7490]" />
              </div>
              <div className="text-right">
                <p className="text-sm text-[#202938]/60">اليوم</p>
                <p className="font-semibold text-[#202938]">2 أغسطس 2025</p>
              </div>
            </div>
          </div>
        </div>

        {/* الإحصائيات */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {stats2.map((stat) => {
            const IconComponent = stat.icon;
            return (
              <div
                key={stat.id}
                className={`bg-gradient-to-br ${stat.bgGradient} border ${stat.borderColor} rounded-2xl p-6 hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-105`}
                onMouseEnter={() => setHoveredCard(stat.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-white shadow-sm ${stat.color}`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div
                    className={`transition-all duration-300 ${
                      hoveredCard === stat.id
                        ? "opacity-100 translate-x-0"
                        : "opacity-0 translate-x-2"
                    }`}
                  >
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  </div>
                </div>
                <div>
                  <h3 className="text-[#202938]/70 text-sm font-medium mb-1">
                    {stat.title}
                  </h3>
                  <p className="text-3xl font-bold text-[#202938] mb-2">
                    {stat.value}
                  </p>
                  <p className="text-xs text-[#202938]/50">{stat.trend}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* الشبكة الرئيسية */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* النشاطات الأخيرة */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-[#202938]">النشاطات الأخيرة</h3>
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center p-4 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center ml-4"
                    style={{ backgroundColor: "#F9FAFC" }}
                  >
                    {activity.type === "user" && <Users className="w-5 h-5" style={{ color: "#0F7490" }} />}
                    {activity.type === "exam" && <FileText className="w-5 h-5" style={{ color: "#C9AE6C" }} />}
                    {activity.type === "question" && <HelpCircle className="w-5 h-5" style={{ color: "#8B5CF6" }} />}
                    {activity.type === "report" && <BarChart3 className="w-5 h-5" style={{ color: "#0F7490" }} />}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium" style={{ color: "#202938" }}>
                      {activity.action}
                    </p>
                    <p className="text-sm text-gray-600">{activity.time}</p>
                  </div>
                  <ChevronLeft className="w-4 h-4 text-gray-400" />
                </div>
              ))}
            </div>
          </div>

          {/* الإجراءات السريعة */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-[#202938]">الإجراءات السريعة</h3>
            </div>
            <div className="space-y-3">
              <button className="w-full text-right p-4 rounded-lg border-2 border-dashed border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all">
                <div className="flex items-center justify-start gap-3 gap-reverse">
                  <Users className="w-5 h-5" style={{ color: "#0F7490" }} />
                  <span className="font-medium" style={{ color: "#202938" }}>إضافة معلم جديد</span>
                </div>
              </button>

              <button className="w-full text-right p-4 rounded-lg border-2 border-dashed border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all">
                <div className="flex items-center justify-start gap-3 gap-reverse">
                  <FileText className="w-5 h-5" style={{ color: "#C9AE6C" }} />
                  <span className="font-medium" style={{ color: "#202938" }}>إنشاء امتحان جديد</span>
                </div>
              </button>

              <button className="w-full text-right p-4 rounded-lg border-2 border-dashed border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all">
                <div className="flex items-center justify-start gap-3 gap-reverse">
                  <HelpCircle className="w-5 h-5" style={{ color: "#8B5CF6" }} />
                  <span className="font-medium" style={{ color: "#202938" }}>إضافة أسئلة</span>
                </div>
              </button>

              <button className="w-full text-right p-4 rounded-lg border-2 border-dashed border-gray-200 hover:border-yellow-300 hover:bg-yellow-50 transition-all">
                <div className="flex items-center justify-start gap-3 gap-reverse">
                  <BarChart3 className="w-5 h-5" style={{ color: "#0F7490" }} />
                  <span className="font-medium" style={{ color: "#202938" }}>عرض التقارير</span>
                </div>
              </button>
            </div>

            {/* الفعاليات القادمة */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <h4 className="font-semibold mb-4" style={{ color: "#202938" }}>الفعاليات القادمة</h4>
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <Calendar className="w-4 h-4 ml-2" style={{ color: "#8B5CF6" }} />
                  <span className="text-gray-600">امتحان الرياضيات - 5 أغسطس</span>
                </div>
                <div className="flex items-center text-sm">
                  <Calendar className="w-4 h-4 ml-2" style={{ color: "#C9AE6C" }} />
                  <span className="text-gray-600">اجتماع المعلمين - 8 أغسطس</span>
                </div>
                <div className="flex items-center text-sm">
                  <Calendar className="w-4 h-4 ml-2" style={{ color: "#0F7490" }} />
                  <span className="text-gray-600">تسليم التقرير - 12 أغسطس</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>  
    </div>
  );
};

export default Dashboard;
