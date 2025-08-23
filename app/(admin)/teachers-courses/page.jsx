// "use client";
// import React, { useState } from "react";
// import {
//   Plus,
//   Download,
//   Upload,
//   Grid3X3,
//   List,
//   Search,
//   Eye,
//   Users,
//   BookOpen,
//   Star,
//   Clock,
//   User,
//   GraduationCap,
//   Calendar,
//   Mail,
//   Phone,
//   MapPin,
//   Edit,
//   Trash2,
//   ChevronLeft,
//   ChevronRight,
//   Heart,
//   Play,
//   CalendarDays,
//   CalendarCheck2,
//   UsersRound,
//   BadgeCheck,
//   ExternalLink,
//   Bookmark,
//   Edit2,
//   Trash,
// } from "lucide-react";
// import { useRouter } from "next/navigation";
// import AddTeacherCourseForm from "../../../components/TeacherCourses/AddTeacherCourseForm/AddTeacherCourseForm";
// import EditTeacherCourseForm from "../../../components/TeacherCourses/EditTeacherCourseForm/EditTeacherCourseForm";

// const TeachersManagementPage = () => {
//   const [viewMode, setViewMode] = useState("grid");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterStatus, setFilterStatus] = useState("all");
//   const [newModal, setNewModal] = useState(false);
//   const router = useRouter();
//   const [openAddModal , setOpenAddModal] = useState(false);
//   const [openEditModal , setOpenEditModal] = useState(false);
//   const [openDeleteModal , setOpenDeleteModal] = useState(false);
//   const [rowData , setRowData] = useState({});
//   // Mock teacher data
//  const teachers = [
//   {
//     id: 1,
//     name: "د. أحمد محمد الصالح",
//     avatar: "/images/banner.png",  // Set your image URL here
//     specialization: "علوم الحاسوب والبرمجة",
//     experience: "8 سنوات",
//     courses: 12,
//     students: 1247,
//     rating: 4.9,
//     status: "نشط",
//     phone: "+966501234567",
//     email: "ahmed.saleh@school.edu.sa",
//     joinDate: "2019/09/01",
//     subjects: ["البرمجة", "قواعد البيانات", "الذكاء الاصطناعي"],
//     price: 150,
//     startDate: "15 فبراير 2026",
//     endDate: "15 مايو 2026",
//     hours: 15,
//     days: 5,
//     availableSeats: 5,
//     category: "معلمين"
//   },
//   {
//     id: 2,
//     name: "أ. فاطمة علي الزهراني",
//     avatar: "/images/banner.png",  // Set your image URL here
//     specialization: "الرياضيات والإحصاء",
//     experience: "12 سنة",
//     courses: 8,
//     students: 892,
//     rating: 4.8,
//     status: "نشط",
//     phone: "+966507891234",
//     email: "fatima.zahrani@school.edu.sa",
//     joinDate: "2015/09/01",
//     subjects: ["الرياضيات", "الإحصاء", "الجبر"],
//     price: 120,
//     startDate: "20 مارس 2026",
//     endDate: "20 يونيو 2026",
//     hours: 20,
//     days: 8,
//     availableSeats: 3,
//     category: "معلمات"
//   },
//   {
//     id: 3,
//     name: "د. محمد عبدالله النمر",
//     avatar: "/images/banner.png",  // Set your image URL here
//     specialization: "الفيزياء والعلوم التطبيقية",
//     experience: "10 سنوات",
//     courses: 15,
//     students: 1156,
//     rating: 4.7,
//     status: "مؤقت",
//     phone: "+966512345678",
//     email: "mohammed.alnamir@school.edu.sa",
//     joinDate: "2017/02/15",
//     subjects: ["الفيزياء", "الكيمياء", "العلوم"],
//     price: 140,
//     startDate: "1 أبريل 2026",
//     endDate: "1 يوليو 2026",
//     hours: 18,
//     days: 6,
//     availableSeats: 8,
//     category: "معلمين"
//   },
//   {
//     id: 4,
//     name: "أ. سارة حسن القحطاني",
//     avatar: "/images/banner.png",  // Set your image URL here
//     specialization: "اللغة العربية والأدب",
//     experience: "6 سنوات",
//     courses: 10,
//     students: 687,
//     rating: 4.6,
//     status: "نشط",
//     phone: "+966598765432",
//     email: "sarah.qahtani@school.edu.sa",
//     joinDate: "2021/09/01",
//     subjects: ["اللغة العربية", "الأدب", "النحو"],
//     price: 100,
//     startDate: "10 مايو 2026",
//     endDate: "10 أغسطس 2026",
//     hours: 12,
//     days: 4,
//     availableSeats: 12,
//     category: "معلمات"
//   },
//   {
//     id: 5,
//     name: "د. عمر يوسف الغامدي",
//     avatar: "/images/banner.png",  // Set your image URL here
//     specialization: "اللغة الإنجليزية والترجمة",
//     experience: "14 سنة",
//     courses: 18,
//     students: 1423,
//     rating: 4.9,
//     status: "نشط",
//     phone: "+966543216789",
//     email: "omar.ghamdi@school.edu.sa",
//     joinDate: "2013/09/01",
//     subjects: ["اللغة الإنجليزية", "الترجمة", "الأدب الإنجليزي"],
//     price: 160,
//     startDate: "25 يناير 2026",
//     endDate: "25 أبريل 2026",
//     hours: 22,
//     days: 7,
//     availableSeats: 2,
//     category: "معلمين"
//   },
//   {
//     id: 6,
//     name: "أ. نورا إبراهيم الشهري",
//     avatar: "/images/banner.png",  // Set your image URL here
//     specialization: "التربية الإسلامية والدراسات",
//     experience: "9 سنوات",
//     courses: 7,
//     students: 543,
//     rating: 4.5,
//     status: "إجازة",
//     phone: "+966587654321",
//     email: "nora.shehri@school.edu.sa",
//     joinDate: "2018/09/01",
//     subjects: ["التربية الإسلامية", "الحديث", "الفقه"],
//     price: 90,
//     startDate: "5 مارس 2026",
//     endDate: "5 يونيو 2026",
//     hours: 14,
//     days: 5,
//     availableSeats: 7,
//     category: "معلمات"
//   },
// ];


//   const stats = [
//     {
//       title: "المدرسين النشطين",
//       value: "24",
//       change: "+3",
//       icon: Users,
//       color: "blue",
//       bgColor: "bg-blue-50",
//       iconColor: "text-blue-600"
//     },
//     {
//       title: "إجمالي الطلاب",
//       value: "2,847",
//       change: "+156",
//       icon: GraduationCap,
//       color: "green",
//       bgColor: "bg-green-50",
//       iconColor: "text-green-600"
//     },
//     {
//       title: "إجمالي الدورات",
//       value: "89",
//       change: "+12",
//       icon: BookOpen,
//       color: "purple",
//       bgColor: "bg-purple-50",
//       iconColor: "text-purple-600"
//     },
//     {
//       title: "متوسط التقييم",
//       value: "4.7",
//       change: "+0.2",
//       icon: Star,
//       color: "orange",
//       bgColor: "bg-orange-50",
//       iconColor: "text-orange-600"
//     },
//   ];

//   const filteredTeachers = teachers.filter((teacher) => {
//     const matchesSearch =
//       teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       teacher.specialization.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesFilter =
//       filterStatus === "all" || teacher.status === filterStatus;
//     return matchesSearch && matchesFilter;
//   });

//   const Button = ({ children, type = "default", size = "medium", icon, onClick, className = "" }) => {
//     const baseClasses = "inline-flex items-center gap-2 font-medium rounded-xl transition-all duration-200 hover:shadow-lg";
//     const typeClasses = {
//       primary: "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-md",
//       secondary: "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-gray-300",
//       default: "bg-gray-100 text-gray-700 hover:bg-gray-200"
//     };
//     const sizeClasses = {
//       small: "px-3 py-2 text-sm",
//       medium: "px-4 py-2.5 text-sm",
//       large: "px-6 py-3 text-base"
//     };

//     return (
//       <button
//         onClick={onClick}
//         className={`${baseClasses} ${typeClasses[type]} ${sizeClasses[size]} ${className}`}
//       >
//         {icon}
//         {children}
//       </button>
//     );
//   };

//   const StatsCard = ({ stat }) => {
//     const IconComponent = stat.icon;
//     return (
//       <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
//         <div className="flex items-center justify-between">
//           <div>
//             <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
//             <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
//             <div className="flex items-center gap-1">
//               <span className="text-sm font-medium text-green-600">{stat.change}</span>
//               <span className="text-xs text-gray-500">من الشهر الماضي</span>
//             </div>
//           </div>
//           <div className={`w-14 h-14 rounded-2xl ${stat.bgColor} flex items-center justify-center`}>
//             <IconComponent className={`w-7 h-7 ${stat.iconColor}`} />
//           </div>
//         </div>
//       </div>
//     );
//   };

//   const TeacherCard = ({ teacher }) => (
//     <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:border-gray-200 transition-all duration-300 group">
//       {/* Header Image */}
//       <div 
//       // style={{backgroundImage : url(`${teacher?.avatar}`)}}
//       className="relative h-48 bg-gradient-to-br from-blue-600 via-purple-600 to-orange-500 overflow-hidden">
//         <div className="absolute inset-0 bg-black/20" />
//         <div className="absolute top-4 right-4">
//           <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
//             teacher.status === "نشط" 
//               ? "bg-green-100 text-green-800" 
//               : teacher.status === "مؤقت" 
//               ? "bg-yellow-100 text-yellow-800" 
//               : "bg-gray-100 text-gray-800"
//           }`}>
//             {teacher.status}
//           </span>
//         </div>
//         <div className="absolute bottom-4 right-4 left-4">
//           <h3 className="text-white font-bold text-lg mb-1">{teacher.specialization}</h3>
//           <p className="text-white/90 text-sm">{teacher.name}</p>
//         </div>
//         <button className="absolute left-4 bottom-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-200">
//           <Heart className="w-5 h-5" />
//         </button>
//       </div>

//       {/* Content */}
//       <div className="p-6">
//         {/* Date Range */}
//         <div className="grid grid-cols-2 gap-3 mb-4">
//           <div className="flex items-center gap-2 text-sm text-gray-600">
//             <CalendarDays className="w-4 h-4 text-green-500" />
//             <span>البداية: {teacher.startDate}</span>
//           </div>
//           <div className="flex items-center gap-2 text-sm text-gray-600">
//             <CalendarCheck2 className="w-4 h-4 text-blue-500" />
//             <span>الانتهاء: {teacher.endDate}</span>
//           </div>
//         </div>

//         {/* Course Details */}
//         <div className="grid grid-cols-2 gap-3 mb-4">
//           <div className="flex items-center gap-2 text-sm text-gray-600">
//             <BadgeCheck className="w-4 h-4 text-purple-500" />
//             <span>{teacher.category}</span>
//           </div>
//           <div className="flex items-center gap-2 text-sm text-gray-600">
//             <UsersRound className="w-4 h-4 text-orange-500" />
//             <span>متبقي: {teacher.availableSeats}</span>
//           </div>
//         </div>

//         {/* Stats */}
//         <div className="flex items-center justify-between mb-4 py-3 px-4 bg-gray-50 rounded-xl">
//           <div className="flex items-center gap-2">
//             <Star className="w-4 h-4 text-amber-500" />
//             <span className="text-sm font-medium">{teacher.rating}</span>
//           </div>
//           <div className="flex items-center gap-2">
//             <Clock className="w-4 h-4 text-gray-500" />
//             <span className="text-sm">{teacher.hours} ساعة</span>
//           </div>
//           <div className="flex items-center gap-2">
//             <Calendar className="w-4 h-4 text-gray-500" />
//             <span className="text-sm">{teacher.days} أيام</span>
//           </div>
//         </div>

//         {/* Price and CTA */}
//         <div className="flex items-end justify-between mb-4">
//           <div>
//             <p className="text-2xl font-bold text-gray-900">{teacher.price} ر.س</p>
//             <p className="text-xs text-gray-500">شاملة كتاب الدورة بصيغة PDF</p>
//           </div>
//           <div className="flex items-center gap-2">
           
//             <button className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
//               <ExternalLink className="w-4 h-4 text-gray-600" />
//             </button>
//           </div>
//         </div>

//         {/* Action Button */}
//         <div className="flex gap-2 items-center">
//         <button 
//         onClick={() => router.push(`/teachers-courses/${teacher?.id}`)}
//         className="w-full h-12 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-200 hover:shadow-lg group-hover:scale-105">
//           عرض التفاصيل
//         </button>

//         <button 
//         onClick={() => {
//           setOpenEditModal(true)
//           setRowData(teacher)
//         }}
//         className="w-16 h-12 hover:bg-orange-500 hover:text-white  border rounded-xl flex justify-center items-center border-orange-500 text-orange-500">
//           <Edit2 size={20}/>
//         </button>

//         <button 
//         onClick={() => setOpenDeleteModal(true)}
//         className="w-16 h-12 hover:bg-red-500 hover:text-white  border rounded-xl flex justify-center items-center border-red-500 text-red-500">
//           <Trash size={20}/>
//         </button>
//         </div>
//       </div>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" dir="rtl">
//         {/* Enhanced Header */}
//         <div className="mb-8">
//           <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
//             <div>
//               <h1 className="text-3xl font-bold text-gray-900 mb-2">إدارة دورات المعلمين</h1>
//               <p className="text-gray-600">نظّم وأدر مواردك التعليمية بكفاءة عالية</p>
//             </div>
//             <div className="flex items-center gap-3">
//               <Button type="default" icon={<Upload className="w-4 h-4" />}>
//                 استيراد
//               </Button>
//               <Button type="secondary" icon={<Download className="w-4 h-4" />}>
//                 تصدير
//               </Button>
//               <Button
//                 onClick={() => setNewModal(true)}
//                 type="primary"
//                 size="large"
//                 icon={<Plus className="w-5 h-5" />}
//               >
//                 إضافة دورة جديدة
//               </Button>
//             </div>
//           </div>
//         </div>

//         {/* Enhanced Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
//           {stats.map((stat, index) => (
//             <StatsCard key={index} stat={stat} />
//           ))}
//         </div>

//         {/* Enhanced Search and Filters */}
//         <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
//           <div className="flex flex-col lg:flex-row lg:items-center gap-4">
//             <div className="flex-1 relative">
//               <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//               <input
//                 type="text"
//                 placeholder="البحث في الدورات..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full pr-12 pl-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
//               />
//             </div>
//             <div className="flex items-center gap-3">
//               <select
//                 value={filterStatus}
//                 onChange={(e) => setFilterStatus(e.target.value)}
//                 className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white min-w-32"
//               >
//                 <option value="all">جميع الحالات</option>
//                 <option value="نشط">نشط</option>
//                 <option value="مؤقت">مؤقت</option>
//                 <option value="إجازة">إجازة</option>
//               </select>
//               <div className="flex rounded-xl border border-gray-200 bg-gray-50 p-1">
//                 <button
//                   onClick={() => setViewMode("grid")}
//                   className={`p-2 rounded-lg transition-all ${
//                     viewMode === "grid"
//                       ? "bg-white text-blue-600 shadow-sm"
//                       : "text-gray-500 hover:text-gray-700"
//                   }`}
//                 >
//                   <Grid3X3 className="w-4 h-4" />
//                 </button>
//                 <button
//                   onClick={() => setViewMode("list")}
//                   className={`p-2 rounded-lg transition-all ${
//                     viewMode === "list"
//                       ? "bg-white text-blue-600 shadow-sm"
//                       : "text-gray-500 hover:text-gray-700"
//                   }`}
//                 >
//                   <List className="w-4 h-4" />
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Enhanced Teachers Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 mb-8">
//           {filteredTeachers.map((teacher) => (
//             <TeacherCard key={teacher.id} teacher={teacher} />
//           ))}
//         </div>

//         {/* Enhanced Empty State */}
//         {filteredTeachers.length === 0 && (
//           <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
//             <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
//               <User className="w-10 h-10 text-gray-400" />
//             </div>
//             <h3 className="text-xl font-semibold text-gray-900 mb-2">
//               لا توجد دورات متاحة
//             </h3>
//             <p className="text-gray-500 mb-6">
//               لم يتم العثور على دورات تطابق معايير البحث المحددة
//             </p>
//             <Button type="primary" icon={<Plus className="w-4 h-4" />}>
//               إضافة دورة جديدة
//             </Button>
//           </div>
//         )}

//         {/* Enhanced Pagination */}
//         {filteredTeachers.length > 0 && (
//           <div className="flex justify-center items-center gap-3">
//             <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 text-sm font-medium transition-all">
//               <ChevronRight className="w-4 h-4" />
//               السابق
//             </button>
//             <div className="flex gap-2">
//               {[1, 2, 3].map((page) => (
//                 <button
//                   key={page}
//                   className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${
//                     page === 1
//                       ? "bg-blue-600 text-white shadow-lg"
//                       : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
//                   }`}
//                 >
//                   {page}
//                 </button>
//               ))}
//             </div>
//             <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 text-sm font-medium transition-all">
//               التالي
//               <ChevronLeft className="w-4 h-4" />
//             </button>
//           </div>
//         )}
//       </div>

//       <AddTeacherCourseForm open={newModal} setOpen={setNewModal} />
//       <EditTeacherCourseForm open={openEditModal} setOpen={setOpenEditModal} rowData={rowData} setRowData={setRowData}/>
//     </div>
//   );
// };

// export default TeachersManagementPage;


"use client";

import React, { useState } from "react";
import PageLayout from "../../../components/layout/PageLayout";
import BreadcrumbsShowcase from "../../../components/ui/BreadCrumbs";
import {
  BarChart3,
  Book,
  BookOpen,
  Calendar,
  Download,
  Edit3,
  FileText,
  MoreVertical,
  Plus,
  Settings,
  Trash2,
  Upload,
  Users,
} from "lucide-react";
import PagesHeader from "./../../../components/ui/PagesHeader";
import SubjectsPage from "../../../components/drafts/Subjects.draft";
import { subjects } from "../../../data/subjects";
import Button from "../../../components/atoms/Button";
import SubjectsStats from "../../../components/Subjects/SubjectStats";
import Table from "../../../components/ui/Table";
import SubjectCard from "../../../components/ui/Cards/SubjectCard";
import SearchAndFilters from "./../../../components/ui/SearchAndFilters";
import Badge from "../../../components/atoms/Badge";
import AddSubjectForm from "../../../components/Subjects/AddNewSubject.modal.jsx";
import DeleteSubjectModal from "../../../components/Subjects/DeleteSubject.modal.jsx";
import EditSubjectForm from "../../../components/Subjects/EditSubjectForm";
import SubjectActivationModal from "../../../components/Subjects/Activation.modal";
import OverviewSection from "../../../components/Subjects/SubjectOverviewSection";
import AddTeacherCourseForm from "../../../components/TeacherCourses/AddTeacherCourseForm/AddTeacherCourseForm";
import EditTeacherCourseForm from "../../../components/TeacherCourses/EditTeacherCourseForm/EditTeacherCourseForm";
import TeacherSubjectCard from "../../../components/ui/Cards/TeacherSubjectCard";


const SubjectsManagementPage = () => {
  const breadcrumbs = [
    { label: "الرئيسية", href: "/", icon: BarChart3 },
    { label: "المواد", href: "/subjects", icon: Book, current: true },
  ];

  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [NewModal, setNewModal] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [activationModal, setActivationModal] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "green";
      case "Medium":
        return "gold";
      case "Hard":
        return "red";
      default:
        return "default";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "blue";
      case "draft":
        return "purple";
      case "archived":
        return "default";
      default:
        return "default";
    }
  };

  const columns = [
    {
      title: "المادة",
      dataIndex: "name",
      key: "name",
      sorter: true,
      render: (text, record) => (
        <div className="flex items-center gap-3 gap-reverse">
          <div className="w-10 h-10 bg-gradient-to-br from-[#0F7490] to-[#8B5CF6] rounded-lg flex items-center justify-center text-white font-bold text-sm">
            {record.name.substring(0, 2)}
          </div>
          <div className="text-right">
            <div className="font-semibold text-[#202938]">{text}</div>
            <div className="text-xs text-[#202938]/60">
              الرمز: {record.code}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "الوصف",
      dataIndex: "description",
      key: "description",
      render: (text) => (
        <div className="max-w-xs">
          <p className="text-sm text-[#202938]/80 line-clamp-2 text-right">
            {text}
          </p>
        </div>
      ),
    },
    {
      title: "إحصاءات",
      key: "stats",
      render: (_, record) => (
        <div className="space-y-1 text-right">
          <div className="flex items-center justify-end gap-1 gap-reverse text-xs text-[#202938]/60">
            <BookOpen className="w-3 h-3" />
            <span>{record.units.length} وحدات</span>
          </div>
          <div className="flex items-center justify-end gap-1 gap-reverse text-xs text-[#202938]/60">
            <Users className="w-3 h-3" />
            <span>{record.students} طلاب</span>
          </div>
          <div className="flex items-center justify-end gap-1 gap-reverse text-xs text-[#202938]/60">
            <FileText className="w-3 h-3" />
            <span>{record.questions} أسئلة</span>
          </div>
        </div>
      ),
    },
    {
      title: "الحالة",
      dataIndex: "status",
      key: "status",
      sorter: true,
      render: (status) => (
        <div className="text-right">
          <Badge color={getStatusColor(status)}>
            {status === "active"
              ? "نشط"
              : status === "draft"
              ? "مسودة"
              : status === "archived"
              ? "مؤرشف"
              : status}
          </Badge>
        </div>
      ),
    },
    {
      title: "الصعوبة",
      dataIndex: "difficulty",
      key: "difficulty",
      sorter: true,
      render: (difficulty) => (
        <div className="text-right">
          <Badge color={getDifficultyColor(difficulty)}>
            {difficulty === "Easy"
              ? "سهل"
              : difficulty === "Medium"
              ? "متوسط"
              : difficulty === "Hard"
              ? "صعب"
              : difficulty}
          </Badge>
        </div>
      ),
    },
    {
      title: "آخر تحديث",
      dataIndex: "lastUpdated",
      key: "lastUpdated",
      sorter: true,
      render: (date) => (
        <div className="flex items-center justify-end gap-1 gap-reverse text-sm text-[#202938]/60">
          <Calendar className="w-3 h-3" />
          <span>{date}</span>
        </div>
      ),
    },
    {
      title: "إجراءات",
      key: "actions",
      render: (_, record) => (
        <div className="flex items-center justify-end gap-1 gap-reverse">
          <Button
            type="text"
            size="small"
            className="text-[#0F7490] hover:bg-[#0F7490]/10"
            aria-label="إعدادات"
          >
            <Settings className="w-4 h-4" />
          </Button>
          <Button
            type="text"
            size="small"
            className="text-[#C9AE6C] hover:bg-[#C9AE6C]/10"
            aria-label="تعديل"
          >
            <Edit3 className="w-4 h-4" />
          </Button>
          <Button
            type="text"
            size="small"
            className="text-red-500 hover:bg-red-50"
            aria-label="حذف"
            onClick={() => setSelectedSubject(record)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
          <Button
            type="text"
            size="small"
            className="text-[#202938]/60 hover:bg-gray-100"
            aria-label="المزيد"
          >
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <PageLayout>
      <div dir="rtl">
        <BreadcrumbsShowcase items={breadcrumbs} variant="pill" />

        {/* Header */}
        <PagesHeader
          title={"إدارة دورات المعلمين"}
          subtitle={"نظّم وأدر موادك التعليمية"}
          extra={
            <div className="flex items-center gap-4 gap-reverse">
              <Button type="default" icon={<Upload className="w-4 h-4" />}>
                استيراد
              </Button>
              <Button type="secondary" icon={<Download className="w-4 h-4" />}>
                تصدير
              </Button>
              <Button
                onClick={() => setNewModal(true)}
                type="primary"
                size="large"
                icon={<Plus className="w-5 h-5" />}
              >
                إضافة مادة جديدة
              </Button>
            </div>
          }
        />

        {/* Stats Cards (uses your existing component) */}
        <SubjectsStats subjects={subjects} />

        <SearchAndFilters
          mode={viewMode}
          setMode={setViewMode}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />

        {/* Content */}
        {viewMode === "table" ? (
          <Table
            columns={columns}
            dataSource={subjects}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            className="shadow-sm"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map((subject) => (
              <TeacherSubjectCard
                activationModal={activationModal}
                setActivationModal={setActivationModal}
                deleteModal={deleteModal}
                setDeleteModal={setDeleteModal}
                setEditOpen={setEditOpen}
                setSelectedSubject={setSelectedSubject}
                subject={subject}
                key={subject.code}
                dir="rtl"
              />
            ))}
          </div>
        )}

        <AddTeacherCourseForm open={NewModal} setOpen={setNewModal} />
        <DeleteSubjectModal
          open={deleteModal}
          setOpen={setDeleteModal}
          selectedSubject={selectedSubject}
        />

        <EditTeacherCourseForm
          open={editOpen}
          setOpen={setEditOpen}
          rowData={selectedSubject} // الكائن الحالي للدورة
          onUpdate={(payload) => {
            // استدعِ API التحديث هنا
            // fetch('/api/subjects/ID', { method: 'PUT', body: JSON.stringify(payload) })
          }}
        />
        <SubjectActivationModal
          open={activationModal}
          setOpen={setActivationModal}
          selectedSubject={selectedSubject}
        />
      </div>
    </PageLayout>
  );
};

export default SubjectsManagementPage;
