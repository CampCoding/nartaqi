"use client";

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
  Search,
  Filter,
  MoreVertical,
  ChevronRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { configs } from "../../../configs";

export default function Topbar() {
  const [notifications, setNotifications] = useState(3);
  const router = useRouter();


  return (
    <header className=" shadow-2xl bg-background  border-b-2 border-accent/30 border-dashed px-8 py-4 mr-64">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-text">لوحة التحكم</h2>
          <p className="text-gray-600 mt-1">مرحبًا بعودتك </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="بحث..."
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <button 
          onClick={() => router.push("/notifications")}
          className="relative p-2  text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell className="w-5 h-5" />
            {notifications > 0 && (
              <span
                className="absolute -top-1 -right-1 w-4 h-4 text-xs text-white rounded-full flex items-center justify-center"
                style={{ backgroundColor: "#8B5CF6" }}
              >
                {notifications}
              </span>
            )}
          </button>

          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-full mx-2 flex items-center justify-center text-white font-semibold"
              style={{ backgroundColor: "#0F7490" }}
            >
              م
            </div>
            <span className="text-sm font-medium" style={{ color: "#202938" }}>
              المسئول
            </span>
            <button 
            onClick={() => {
              localStorage.removeItem(configs.tokenKey);
              localStorage.removeItem(configs.userKey);
              router.push("/login")
            }}
            className="text-sm text-gray-600 hover:text-gray-800">
              تسجيل الخروج
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
