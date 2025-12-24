

"use client";
import Link from "next/link";
import {
  Users,
  GraduationCap,
  FileText,
  Bell,
  Settings,
  BarChart3,
  BookOpen,
  Cog,
  CircleAlert,
  Users2,
  Book,
  Star,
  Text,
  ClockFading,
  BookOpenIcon,
  CreditCard,
  QrCode,
  Headset,
  BookCopy,
  Files,
  Award,
  Trophy,
  Badge,
  VideoIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { subjects } from "../../../data/subjects";

export default function Sidebar() {
  const [activeTab, setActiveTab] = useState("نظرة عامة");
  const [selectedSubject, setSelectedSubject] = useState(subjects[0].name);
  const [isSubjectDropdownOpen, setIsSubjectDropdownOpen] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  const baseMenuItems = [
    { name: "نظرة عامة", icon: BarChart3, path: "/" },
  ];

  // Subject items (translated)
  const getSubjectSpecificItems = (subjectName) => {
    const subject = subjects.find((s) => s.name === subjectName);
    const subjectPath = subject?.code;
    return [
      {
        name: "المعلمين",
        icon: Users,
        path: `/subjects/${subjectPath}/teachers`,
      },
      { name: "الدورات", icon: Cog, path: `/subjects/${subjectPath}/units` },
    ];
  };

  const handleSubjectChange = (subjectName) => {
    const subject = subjects.find((s) => s.name === subjectName);
    if (!subject) return;

    setSelectedSubject(subjectName);
    setIsSubjectDropdownOpen(false);

    const pathSegments = pathname.split("/");
    const subjectIndex = pathSegments.findIndex((seg) => seg === "subjects");

    if (subjectIndex !== -1 && pathSegments.length > subjectIndex + 1) {
      pathSegments[subjectIndex + 1] = subject.code;

      const isInUnitsChildRoute =
        pathSegments[subjectIndex + 2] === "units" &&
        pathSegments.length > subjectIndex + 3;

      if (isInUnitsChildRoute) {
        router.replace(`/subjects/${subject.code}/units`);
        return;
      }
    }

    const newPath = pathSegments.join("/");
    router.replace(newPath);
  };

  const menuItems = [
      {
      name:"الفئات",
      icon : BookOpen,
      path:"/categories"
    },

    {
      name: "دورات الوجهه السعودية",
      icon: BookOpen,
      path: "/teachers-courses",
    },
    // {
    //   name:"دورات الوجهه المصرية",
    //   icon : BookOpen,
    //   path:"/egyptian_course"
    // },
     {
      name:"دورة المصدر ",
      icon:Files,
      path:"/saudi_source_course"
    },
    // {
    //   name:"محتوي الدورة",
    //   icon: Files,
    //   path:"/round_content"
    // },
    { name: "المتدربين", icon: GraduationCap, path: "/students" },
    // { name: "أقسام الاختبارات", icon: BookCopy , path: "/exam_sections" },
    { name: "الاختبارات", icon: FileText, path: "/exams" },
    {name:"الشروحات المجانية",icon:VideoIcon,path:"/freeVideos"},
    {
      name:"المدونة",
      icon : BookOpenIcon,
      path:"/blog"
    },
    {
      name:"متجر الكتب",
      icon : Book ,
      path : "/book-store"
    },
    {
      name:"المسابقات",
      icon:Award,
      path:'/competitions'
    },
    {
      name:"المسوقين",
      icon:Users,
      path:'/marketers'
    },
    {
      name:"المكافآت",
      icon : Trophy ,
      path:"/rewards"
    },
    {
      name:"الشارات",
      icon:Badge,
      path:"/badge",
    },
    {
      name:"فريق العمل",
      icon:Users2  ,
      path:"/teams"
    },
    {
      name:"التقييم",
      icon :  Star ,
      path:"/rating"
    },
    {
      name:"الإشعارات",
      icon : Bell ,
      path: "/notifications"
    },
     {
      name:"QR",
      icon : QrCode,
      path:"/qr-code"
    },
    {
      name:"الدعم الفني",
      icon : Headset,
      path:"/technical_support"
    },
    {
      name:"بوابة الدعم",
      icon : ClockFading,
      path:"/support" 
    },
   
    {
      name:"تأكيد الدفع",
      icon: CreditCard,
      path: "/confirm-payment"
    },
     {
      name:"أسئلة شائعة",
      icon : Text ,
      path:"/faq"
    },
    {
      name:"الشروط والأحكام",
      icon: CircleAlert ,
      badge:"",
      path :"/privacy-policy"
    },
    { name: "الموقع", icon: Settings, path: "/settings" },
  ];

  useEffect(() => {
    const currentItem = [
      ...baseMenuItems,
      ...getSubjectSpecificItems(selectedSubject),
    ].find((item) => pathname === item.path);
    if (currentItem) setActiveTab(currentItem.name);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const selectedSubjectData = subjects.find((s) => s.name === selectedSubject);
  const SelectedSubjectIcon = selectedSubjectData?.icon || BookOpen;

  return (
    <div
      dir="rtl"
      className="fixed right-0 top-0 h-screen overflow-y-auto w-64 bg-white shadow-lg border-l border-gray-100"
    >
      <div className="p-6 border-b-2 border-accent/30 border-dashed">
        {/* Logo */}
        <div className="flex items-center justify-center">
          <Link
            href="/"
            className="group flex items-center justify-center gap-4 gap-reverse transition-transform duration-300 hover:scale-105"
          >
            <img
              src="/images/logo.svg"
              className="w-24 h-24 mx-auto"
              alt="الشعار"
            />
          </Link>
        </div>
      </div>

      <nav className="mt-6">
        <RenderNavs
          items={baseMenuItems}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          selectedSubject={selectedSubject}
          rtl
        />

        <hr />

        {menuItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeTab === item.name;
          return (
            <Link
              href={item.path}
              key={item.name}
              onClick={() => setActiveTab(item.name)}
              className={`w-full flex items-center px-6 gap-3 py-3 text-right transition-all duration-200 hover:bg-gray-50 ${
                isActive ? "border-l-4 bg-blue-50" : ""
              }`}
              style={{
                borderLeftColor: isActive ? "#0F7490" : "transparent",
                color: isActive ? "#0F7490" : "#202938",
              }}
            >
              <IconComponent className="w-5 h-5" />
              <span className="font-medium ml-3">{item.name}</span>
              {item.badge && (
                <span
                  className="mr-auto px-2 py-1 text-xs rounded-full text-white"
                  style={{ backgroundColor: "#8B5CF6" }}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

function RenderNavs({ items, setActiveTab, activeTab, selectedSubject, rtl }) {
  return items.map((item) => {
    const IconComponent = item.icon;
    const isActive = activeTab === item.name;
    return (
      <Link
        href={{
          pathname: item.path,
          query: selectedSubject ? { subject: selectedSubject } : {},
        }}
        key={`${item.name}-${selectedSubject}`}
        onClick={() => setActiveTab(item.name)}
        className={`w-full flex items-center gap-3 px-6 py-3 text-right transition-all duration-200 hover:bg-gray-50 ${
          isActive ? "border-l-4 bg-blue-50" : ""
        }`}
        style={{
          borderLeftColor: isActive ? "#0F7490" : "transparent",
          color: isActive ? "#0F7490" : "#202938",
        }}
      >
        <IconComponent className="w-5 h-5" />
        <div className="font-medium ml-3">{item.name}</div>
      </Link>
    );
  });
}
