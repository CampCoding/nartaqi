"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  User,
  Lock,
  BookOpen,
  Award,
  FileText,

  Trophy,

  Shield,
  BarChart3,
  Users,
  User2,
} from "lucide-react";
import { StudentProgressBar } from "../../../../components/ui/StudentProgressBar";
import StudentCourses from "../../../../components/Students/StudentAccount/StudentCourses";
import StudentsBadges from "../../../../components/Students/StudentAccount/StudentBadges/StudentsBadges";
import StudentsCertificates from "../../../../components/Students/StudentAccount/StudentCertificates/StudentCertificates";
import BreadcrumbsShowcase from "../../../../components/ui/BreadCrumbs";
import { useParams } from "next/navigation";
import StudentsPrivacy from "../../../../components/Students/StudentAccount/StudentsPrivacy";
import StudentData from "../../../../components/Students/StudentAccount/StudentData";

// Mock PageLayout component (replace with your real layout)
const PageLayout = ({ children }) => (
  <div className="min-h-screen bg-gray-50">{children}</div>
);

export default function StudentAccountPage() {
  // Student data state
  const [student, setStudent] = useState({
    firstName: "أحمد",
    middleName: "محمد",
    lastName: "علي",
    email: "ahmed@example.com",
    phone: "01234567890",
    alternativePhone: "",
    familyPhone: "01098765432",
    avatar: "",
    gender: "male",
    birthDate: "2010-05-15",
    joinDate: "2023-09-01",
    // Account verification
    emailVerified: true,
    phoneVerified: false,
    // Settings
    notifications: true,
    parentAccess: true,
  });
  const { id } = useParams();

  useEffect(() => {
    console.log(id);
  }, [id]);

  const breadcrumbs = [
    { label: "الرئيسية", href: "/", icon: BarChart3 },
    { label: "المتدربين", href: "/students", icon: Users },
    { label: "بيانات المتدرب", href: `/students/${id}`, icon: User2, current: true },
  ];

  // UI state
  const [activeTab, setActiveTab] = useState("account");
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [pendingPhone, setPendingPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");

  // Courses data
  const [courses] = useState([
    {
      id: 1,
      title: "أساسيات البرمجة للأطفال",
      instructor: "أ. سارة أحمد",
      status: "نشط",
      progress: 75,
      totalLessons: 20,
      completedLessons: 15,
      enrollDate: "2023-09-15",
      color: "emerald",
      nextLesson: "الدرس 16: المتغيرات المتقدمة",
      lastAccessed: "منذ يومين",
    },
    {
      id: 2,
      title: "اللغة الإنجليزية - المستوى الأول",
      instructor: "أ. مريم حسن",
      status: "متوقف",
      progress: 40,
      totalLessons: 25,
      completedLessons: 10,
      enrollDate: "2023-10-01",
      color: "amber",
      nextLesson: "الدرس 11: الأفعال الماضية",
      lastAccessed: "منذ أسبوع",
    },
    {
      id: 3,
      title: "الرياضيات الممتعة",
      instructor: "أ. خالد محمود",
      status: "مكتمل",
      progress: 100,
      totalLessons: 15,
      completedLessons: 15,
      enrollDate: "2023-08-01",
      completionDate: "2023-11-15",
      color: "blue",
      grade: "امتياز",
    },
  ]);

  // Badges
  const [badges] = useState([
    {
      id: 1,
      name: "طالب متميز",
      description: "حصل على درجات عالية في جميع الاختبارات",
      courseTitle: "أساسيات البرمجة للأطفال",
      awardedDate: "2023-11-20",
      icon: "🏆",
      color: "from-yellow-400 to-orange-500",
      type: "تميز أكاديمي",
    },
    {
      id: 2,
      name: "مثابر الشهر",
      description: "التزام مستمر بحضور الدروس",
      courseTitle: "اللغة الإنجليزية",
      awardedDate: "2023-10-30",
      icon: "⭐",
      color: "from-blue-400 to-purple-500",
      type: "الالتزام والحضور",
    },
    {
      id: 3,
      name: "محل ثقة الأهل",
      description: "تقييم إيجابي من ولي الأمر",
      courseTitle: "عام",
      awardedDate: "2023-12-01",
      icon: "💙",
      color: "from-green-400 to-teal-500",
      type: "تقدير الأهل",
    },
  ]);

  // Certificates
  const [certificates] = useState([
    {
      id: 1,
      title: "شهادة إتمام دورة الرياضيات الممتعة",
      courseTitle: "الرياضيات الممتعة",
      issueDate: "2023-11-15",
      grade: "امتياز",
      instructorName: "أ. خالد محمود",
      pdfUrl: "/certificates/math-cert.pdf",
      certificateId: "CERT-MATH-2023-001",
    },
    {
      id: 2,
      title: "شهادة تقدير للالتزام والحضور",
      courseTitle: "أساسيات البرمجة للأطفال",
      issueDate: "2023-10-30",
      grade: "جيد جداً",
      instructorName: "أ. سارة أحمد",
      pdfUrl: "/certificates/attendance-cert.pdf",
      certificateId: "CERT-ATT-2023-002",
    },
  ]);

  // File input ref for avatar
  const fileInputRef = useRef(null);

  // Helpers
  const getAvatarUrl = () => {
    if (student.avatar) return student.avatar;
    return student.gender === "male"
      ? "https://ui-avatars.com/api/?name=Student&background=3B82F6&color=fff&rounded=true&size=200"
      : "https://ui-avatars.com/api/?name=Student&background=EC4899&color=fff&rounded=true&size=200";
  };

  const calculateOverallProgress = () => {
    const activeCourses = courses.filter(
      (c) => c.status === "نشط" || c.status === "مكتمل"
    );
    if (activeCourses.length === 0) return 0;
    const totalProgress = activeCourses.reduce(
      (sum, course) => sum + course.progress,
      0
    );
    return Math.round(totalProgress / activeCourses.length);
  };

  // Events
  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) =>
      setStudent((prev) => ({ ...prev, avatar: ev.target.result }));
    reader.readAsDataURL(file);
  };

  const handleSaveAccount = (e) => {
    e.preventDefault();
    setIsEditing(false);
    alert("تم حفظ بيانات الحساب بنجاح ✅");
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const currentPassword = formData.get("currentPassword");
    const newPassword = formData.get("newPassword");
    const confirmPassword = formData.get("confirmPassword");

    if (!currentPassword || !newPassword || !confirmPassword) {
      alert("من فضلك أكمل جميع الحقول");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("كلمتا المرور الجديدتان غير متطابقتين");
      return;
    }
    if (newPassword.length < 8) {
      alert("كلمة المرور يجب أن تحتوي على 8 أحرف على الأقل");
      return;
    }

    alert("تم تغيير كلمة المرور بنجاح ✅");
    setShowPasswordForm(false);
    e.target.reset();
  };

  const sendOtpForPhone = () => {
    if (!pendingPhone) {
      alert("من فضلك أدخل رقم الهاتف الجديد");
      return;
    }
    setOtpSent(true);
    alert("تم إرسال كود التحقق إلى الرقم الجديد");
  };

  const verifyPhoneOtp = () => {
    if (otp.length < 4) {
      alert("من فضلك أدخل كود التحقق");
      return;
    }
    setStudent((prev) => ({
      ...prev,
      phone: pendingPhone,
      phoneVerified: true,
    }));
    setPendingPhone("");
    setOtp("");
    setOtpSent(false);
    alert("تم تأكيد رقم الهاتف بنجاح ✅");
  };

  // UI atoms

  const TabButton = ({ id, icon: Icon, children, count }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`group relative px-6 py-3 rounded-xl text-sm md:text-base font-medium transition-all duration-300 flex items-center gap-3 min-w-fit
        ${
          activeTab === id
            ? "bg-gradient-to-r from-[#87bac8]  to-[#27829b]   text-white shadow-lg scale-105"
            : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:shadow-md"
        }`}
    >
      <Icon size={18} />
      {children}
      {typeof count === "number" && (
        <span
          className={`px-2 py-1 rounded-full text-xs font-bold ${
            activeTab === id
              ? "bg-white/20 text-white"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );

  const StatCard = ({ icon: Icon, title, value, subtitle, color }) => (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-2xl bg-gradient-to-br ${color}`}>
          <Icon size={24} className="text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <PageLayout>
      <div dir="rtl" className="p-6 min-h-screen">
        {/* Header */}
        <BreadcrumbsShowcase items={breadcrumbs} variant="pill" />
        {/* <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">صفحة حسابي</h1>
              <p className="text-gray-600">إدارة بيانات الحساب ومتابعة التقدم الأكاديمي</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-500">
                طالب منذ: {new Date(student.joinDate).toLocaleDateString("ar-EG")}
              </div>
              <button className="p-2 bg-white rounded-xl border border-gray-200 hover:shadow-md transition-all">
                <Bell size={20} className="text-gray-600" />
              </button>
            </div>
          </div>
        </div> */}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={BookOpen}
            title="الدورات النشطة"
            value={courses.filter((c) => c.status === "نشط").length}
            subtitle="دورة جارية"
            color="from-blue-400 to-blue-600"
          />
          <StatCard
            icon={Trophy}
            title="الدورات المكتملة"
            value={courses.filter((c) => c.status === "مكتمل").length}
            subtitle="بنجاح"
            color="from-green-400 to-green-600"
          />
          <StatCard
            icon={Award}
            title="الشارات المحققة"
            value={badges.length}
            subtitle="إنجاز متميز"
            color="from-amber-400 to-amber-600"
          />
          <StatCard
            icon={FileText}
            title="الشهادات"
            value={certificates.length}
            subtitle="شهادة معتمدة"
            color="from-purple-400 to-purple-600"
          />
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-3 mb-8 p-2 bg-white rounded-2xl border border-gray-200 shadow-sm">
          <TabButton id="account" icon={User}>
            بيانات الحساب
          </TabButton>
          <TabButton id="security" icon={Shield}>
            الأمان والخصوصية
          </TabButton>
          <TabButton id="courses" icon={BookOpen} count={courses.length}>
            دوراتي
          </TabButton>
          <TabButton id="badges" icon={Award} count={badges.length}>
            شاراتي
          </TabButton>
          <TabButton
            id="certificates"
            icon={FileText}
            count={certificates.length}
          >
            شهاداتي
          </TabButton>
        </div>

        {/* -------- Account Tab -------- */}
        {activeTab === "account" && (
          <StudentData calculateOverallProgress={calculateOverallProgress} fileInputRef={fileInputRef} getAvatarUrl={getAvatarUrl} handleAvatarChange={handleAvatarChange} handleAvatarClick={handleAvatarClick} handleSaveAccount={handleSaveAccount} isEditing={isEditing} otp={otp} sendOtpForPhone={sendOtpForPhone} otpSent={otpSent} pendingPhone={pendingPhone} setIsEditing={setIsEditing} setOtp={setOtp} setPendingPhone={setPendingPhone} setStudent={setStudent} student={student} verifyPhoneOtp={verifyPhoneOtp}/>
        )}

        {/* -------- Security Tab -------- */}
        {activeTab === "security" && <StudentsPrivacy />}

        {/* -------- Courses Tab -------- */}
        {activeTab === "courses" && (
          <StudentCourses
            courses={courses}
            calculateOverallProgress={calculateOverallProgress}
          />
        )}

        {/* -------- Badges Tab -------- */}
        {activeTab === "badges" && <StudentsBadges />}

        {/* -------- Certificates Tab -------- */}
        {activeTab === "certificates" && <StudentsCertificates />}
      </div>
    </PageLayout>
  );
}
