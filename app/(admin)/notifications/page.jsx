"use client";

import React, { useState } from "react";
import {
  Trash2,
  Bell,
  Users,
  GraduationCap,
  Calendar,
  Search,
  Filter,
  Plus,
  X,
} from "lucide-react";

const NotificationManager = () => {
  const [notifications, setNotifications] = useState([
    {
      key: "1",
      id: 1,
      message: "تم نشر امتحان جديد: أساسيات الجبر",
      target: "جميع الطلاب",
      date: "2025-07-28",
      type: "exam",
      priority: "high",
      status: "sent",
    },
    {
      key: "2",
      id: 2,
      message: "تم تحديث بنك أسئلة الفيزياء",
      target: "جميع المعلمين",
      date: "2025-07-26",
      type: "update",
      priority: "medium",
      status: "sent",
    },
    {
      key: "3",
      id: 3,
      message: "تذكير: الامتحان النهائي الأسبوع القادم",
      target: "طلاب الرياضيات",
      date: "2025-07-25",
      type: "reminder",
      priority: "high",
      status: "draft",
    },
    {
      key: "4",
      id: 4,
      message: "تم إضافة محاضرة جديدة: الهندسة الفراغية",
      target: "طلاب الرياضيات",
      date: "2025-07-24",
      type: "update",
      priority: "low",
      status: "sent",
    },
    {
      key: "5",
      id: 5,
      message: "موعد تسليم المشروع: نهاية الأسبوع",
      target: "جميع الطلاب",
      date: "2025-07-23",
      type: "reminder",
      priority: "high",
      status: "draft",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newNotification, setNewNotification] = useState({
    message: "",
    target: "",
    date: new Date().toISOString().split('T')[0],
    type: "exam",
    priority: "medium"
  });

  const deleteNotification = (id) => {
    setNotifications(notifications.filter((notif) => notif.id !== id));
  };

  const handleAddNotification = (e) => {
    e.preventDefault();
    if (!newNotification.message || !newNotification.target || !newNotification.type || !newNotification.priority) {
      return;
    }
    
    const notification = {
      key: Date.now().toString(),
      id: Date.now(),
      message: newNotification.message,
      target: newNotification.target,
      date: newNotification.date || new Date().toISOString().split('T')[0],
      type: newNotification.type,
      priority: newNotification.priority,
      status: "draft",
    };
    
    setNotifications([notification, ...notifications]);
    setIsModalVisible(false);
    setNewNotification({
      message: "",
      target: "",
      date: new Date().toISOString().split('T')[0],
      type: "exam",
      priority: "medium"
    });
  };

  const getTargetIcon = (target) => {
    if (target.includes("طلاب"))
      return <GraduationCap className="w-4 h-4 text-purple-500" />;
    if (target.includes("معلمين"))
      return <Users className="w-4 h-4 text-amber-500" />;
    return <Bell className="w-4 h-4 text-blue-500" />;
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-700 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "exam":
        return <GraduationCap className="w-4 h-4" />;
      case "update":
        return <Bell className="w-4 h-4" />;
      case "reminder":
        return <Calendar className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "exam":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "update":
        return "bg-green-100 text-green-700 border-green-200";
      case "reminder":
        return "bg-orange-100 text-orange-700 border-orange-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const filteredNotifications = notifications.filter((notif) => {
    const matchesSearch =
      notif.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notif.target.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || notif.type === filterType;
    const matchesPriority =
      filterPriority === "all" || notif.priority === filterPriority;
    return matchesSearch && matchesType && matchesPriority;
  });

  const stats = [
    {
      title: "إجمالي الإشعارات",
      value: notifications.length,
      icon: <Bell className="w-6 h-6 text-white" />,
      gradient: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600"
    },
    {
      title: "عالية الأولوية",
      value: notifications.filter((n) => n.priority === "high").length,
      icon: <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center"><span className="text-red-500 text-xs font-bold">!</span></div>,
      gradient: "from-red-500 to-red-600",
      bgColor: "bg-red-50",
      textColor: "text-red-600"
    },
    {
      title: "إشعارات الطلاب",
      value: notifications.filter((n) => n.target.includes("طلاب")).length,
      icon: <GraduationCap className="w-6 h-6 text-white" />,
      gradient: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600"
    },
    {
      title: "إشعارات المعلمين",
      value: notifications.filter((n) => n.target.includes("معلمين")).length,
      icon: <Users className="w-6 h-6 text-white" />,
      gradient: "from-amber-500 to-amber-600",
      bgColor: "bg-amber-50",
      textColor: "text-amber-600"
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50" dir="rtl">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header with enhanced design */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
                  <Bell className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">{notifications.filter(n => n.status === 'draft').length}</span>
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-1">إدارة الإشعارات</h1>
                <p className="text-gray-600 text-lg">إرسال وإدارة الإشعارات للطلاب والمعلمين</p>
              </div>
            </div>
            <button
              onClick={() => setIsModalVisible(true)}
              className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-medium shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300 transform hover:-translate-y-0.5 transition-all duration-200"
            >
              <Plus className="w-5 h-5" />
              إشعار جديد
            </button>
          </div>

          {/* Enhanced Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="group hover:scale-105 transition-all duration-300">
                <div className={`${stat.bgColor} rounded-2xl p-6 border border-white shadow-sm hover:shadow-lg transition-all duration-300`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${stat.gradient} rounded-xl flex items-center justify-center shadow-md`}>
                      {stat.icon}
                    </div>
                    <div className={`text-3xl font-bold ${stat.textColor}`}>
                      {stat.value}
                    </div>
                  </div>
                  <h3 className="text-gray-700 font-medium">{stat.title}</h3>
                </div>
              </div>
            ))}
          </div>

          {/* Enhanced Search and Filters */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-6">
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="البحث في الإشعارات..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pr-12 pl-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>
              <div className="md:col-span-3">
                <div className="relative">
                  <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="w-full pr-12 pl-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none bg-white transition-all"
                  >
                    <option value="all">جميع الأنواع</option>
                    <option value="exam">امتحانات</option>
                    <option value="update">تحديثات</option>
                    <option value="reminder">تذكيرات</option>
                  </select>
                </div>
              </div>
              <div className="md:col-span-3">
                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none bg-white transition-all"
                >
                  <option value="all">جميع الأولويات</option>
                  <option value="high">عالي</option>
                  <option value="medium">متوسط</option>
                  <option value="low">منخفض</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Notifications Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-right py-4 px-6 font-semibold text-gray-700">الرسالة</th>
                  <th className="text-right py-4 px-6 font-semibold text-gray-700">المستهدف</th>
                  <th className="text-right py-4 px-6 font-semibold text-gray-700">التاريخ</th>
                  <th className="text-right py-4 px-6 font-semibold text-gray-700">الأولوية</th>
                  <th className="text-center py-4 px-6 font-semibold text-gray-700">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredNotifications.map((notification) => (
                  <tr key={notification.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-start gap-4">
                        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-medium border ${getTypeColor(notification.type)}`}>
                          {getTypeIcon(notification.type)}
                          {notification.type === "exam" && "امتحان"}
                          {notification.type === "update" && "تحديث"}
                          {notification.type === "reminder" && "تذكير"}
                        </span>
                        <div>
                          <p className="font-medium text-gray-900 mb-1">{notification.message}</p>
                          <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                            notification.status === "sent" 
                              ? "bg-green-100 text-green-700" 
                              : "bg-yellow-100 text-yellow-700"
                          }`}>
                            <div className={`w-2 h-2 rounded-full ${
                              notification.status === "sent" ? "bg-green-500" : "bg-yellow-500"
                            }`}></div>
                            {notification.status === "sent" ? "تم الإرسال" : "مسودة"}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        {getTargetIcon(notification.target)}
                        <span className="text-gray-700">{notification.target}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{notification.date}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium border ${getPriorityColor(notification.priority)}`}>
                        {notification.priority === "high" && "عالي"}
                        {notification.priority === "medium" && "متوسط"}
                        {notification.priority === "low" && "منخفض"}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="حذف الإشعار"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredNotifications.length === 0 && (
              <div className="text-center py-12">
                <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">لم يتم العثور على إشعارات</p>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Modal */}
        {isModalVisible && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <Plus className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">إنشاء إشعار جديد</h2>
                </div>
                <button 
                  onClick={() => setIsModalVisible(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddNotification} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">نص الإشعار</label>
                  <textarea
                    value={newNotification.message}
                    onChange={(e) => setNewNotification({...newNotification, message: e.target.value})}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    rows="3"
                    placeholder="أدخل نص الإشعار هنا..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">المستهدف</label>
                  <select
                    value={newNotification.target}
                    onChange={(e) => setNewNotification({...newNotification, target: e.target.value})}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none bg-white transition-all"
                    required
                  >
                    <option value="">اختر المستهدف</option>
                    <option value="جميع الطلاب">جميع الطلاب</option>
                    <option value="طلاب الرياضيات">طلاب الرياضيات</option>
                    <option value="طلاب الفيزياء">طلاب الفيزياء</option>
                    <option value="جميع المعلمين">جميع المعلمين</option>
                    <option value="معلمي الرياضيات">معلمي الرياضيات</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">نوع الإشعار</label>
                    <select
                      value={newNotification.type}
                      onChange={(e) => setNewNotification({...newNotification, type: e.target.value})}
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none bg-white transition-all"
                      required
                    >
                      <option value="exam">امتحان</option>
                      <option value="update">تحديث</option>
                      <option value="reminder">تذكير</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">الأولوية</label>
                    <select
                      value={newNotification.priority}
                      onChange={(e) => setNewNotification({...newNotification, priority: e.target.value})}
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none bg-white transition-all"
                      required
                    >
                      <option value="high">عالي</option>
                      <option value="medium">متوسط</option>
                      <option value="low">منخفض</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">التاريخ</label>
                  <input
                    type="date"
                    value={newNotification.date}
                    onChange={(e) => setNewNotification({...newNotification, date: e.target.value})}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    required
                  />
                </div>

                <div className="flex justify-end gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalVisible(false)}
                    className="px-6 py-3 text-gray-700 bg-gray-100 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-medium shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300 transition-all"
                  >
                    حفظ الإشعار
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationManager;