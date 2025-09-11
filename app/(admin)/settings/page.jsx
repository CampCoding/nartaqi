"use client";
import FooterContainer from "@/components/Settings/FooterContainer";
import SettingHome from "@/components/Settings/SettingHome";
import BreadcrumbsShowcase from "@/components/ui/BreadCrumbs";
import { Settings, Home, Edit, Trash2, Plus, Save, ChevronUp, ChevronDown, Layout, BarChart3 } from "lucide-react";
import React, { useState } from "react";

const SystemSettings = () => {
  // Tab state
  const [activeTab, setActiveTab] = useState("home");
  // Home Page Slider Management
  const [sliders, setSliders] = useState([
    {
      id: 1,
      title: "ابن مستقبلك مع أفضل الدورات التعليمية",
      description: "انضم إلينا واكتشف عالم التعليم المتميز",
      buttonText: "اكتشف المزيد",
      image: "/api/placeholder/800/400",
      video: null,
      order: 1,
      isActive: true
    }
  ]);

  // Enhanced Footer Content Management
  const [footerSections, setFooterSections] = useState({
    about: { 
      visible: true, 
      title: "من نحن",
      type: "about",
      content: {
        logo: "/api/placeholder/150/50",
        description: "تمكين الطلاب والمعلمين من خلال التحضير الشامل للامتحانات وموارد التطوير المهني",
        links: [
          { name: "حولنا", url: "#" },
          { name: "الأسئلة الشائعة", url: "#" },
          { name: "فريق", url: "#" },
          { name: "سياسة الخصوصية", url: "#" },
          { name: "مدونة", url: "#" }
        ]
      }
    },
    resources: { 
      visible: true, 
      title: "الموارد",
      type: "links",
      content: {
        links: [
          { name: "دعم", url: "#" },
          { name: "جدول الدراسة", url: "#" },
          { name: "النقاط المرجحة", url: "#" },
          { name: "اختبار المستوى", url: "#" }
        ]
      }
    },
    contact: { 
      visible: true, 
      title: "اتصل",
      type: "contact",
      content: {
        phone: "+1 234 567 890",
        email: "contact@maannartaqi.com",
        address: "123 Education St, Learning City",
        workingHours: "الأحد - الخميس: 9:00 - 18:00",
        socialMedia: [
          { name: "انستغرام", url: "https://instagram.com", icon: "📷" },
          { name: "تويتر", url: "https://twitter.com", icon: "🐦" },
          { name: "يوتيوب", url: "https://youtube.com", icon: "📺" },
          { name: "تيك توك", url: "https://tiktok.com", icon: "🎵" },
          { name: "سناب شات", url: "https://snapchat.com", icon: "👻" },
          { name: "تيليجرام", url: "https://telegram.org", icon: "✈️" }
        ]
      }
    }
  });

  const [newFooterSection, setNewFooterSection] = useState({
    title: "",
    type: "links",
    content: {
      description: "",
      links: [{ name: "", url: "" }]
    }
  });

  const [newSlider, setNewSlider] = useState({
    title: "",
    description: "",
    buttonText: "",
    image: "",
    video: ""
  });

  const [imagePreview, setImagePreview] = useState(null);

  const [editingFooterSection, setEditingFooterSection] = useState(null);

  // Course Cards Management
  const [courseCards, setCourseCards] = useState([
    {
      id: 1,
      title: "منهجيات التدريس",
      courseCount: 15,
      image: "/api/placeholder/300/200",
      isVisible: true,
      order: 1
    },
    {
      id: 2,
      title: "إدارة الفصل الدراسي",
      courseCount: 15,
      image: "/api/placeholder/300/200",
      isVisible: true,
      order: 2
    },
    {
      id: 3,
      title: "التكنولوجيا التعليمية",
      courseCount: 15,
      image: "/api/placeholder/300/200",
      isVisible: true,
      order: 3
    }
  ]);

  const [newCourseCard, setNewCourseCard] = useState({
    title: "",
    courseCount: 0,
    image: ""
  });

  const addSlider = () => {
    const slider = {
      id: Date.now(),
      ...newSlider,
      order: sliders.length + 1,
      isActive: true
    };
    setSliders([...sliders, slider]);
    setNewSlider({ title: "", description: "", buttonText: "", image: "", video: "" });
    // Clear image preview
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
  };

  const toggleSection = (section) => {
    setFooterSections(prev => ({
      ...prev,
      [section]: { ...prev[section], visible: !prev[section].visible }
    }));
  };

  const deleteSlider = (id) => {
    setSliders(prev => prev.filter(slider => slider.id !== id));
  };

  const moveSlider = (id, direction) => {
    const currentIndex = sliders.findIndex(slider => slider.id === id);
    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === sliders.length - 1)
    ) return;

    const newSliders = [...sliders];
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
    [newSliders[currentIndex], newSliders[targetIndex]] = [newSliders[targetIndex], newSliders[currentIndex]];
    
    // Update order numbers
    newSliders.forEach((slider, index) => {
      slider.order = index + 1;
    });
    
    setSliders(newSliders);
  };

  const updateFooterSection = (sectionKey, newContent) => {
    setFooterSections(prev => ({
      ...prev,
      [sectionKey]: {
        ...prev[sectionKey],
        content: newContent
      }
    }));
    setEditingFooterSection(null);
  };



  const addFooterSection = () => {
    const sectionKey = `section_${Date.now()}`;
    const newSection = {
      visible: true,
      ...newFooterSection
    };
    setFooterSections(prev => ({
      ...prev,
      [sectionKey]: newSection
    }));
    setNewFooterSection({
      title: "",
      type: "links",
      content: {
        description: "",
        links: [{ name: "", url: "" }]
      }
    });
  };

  const deleteFooterSection = (sectionKey) => {
    setFooterSections(prev => {
      const newSections = { ...prev };
      delete newSections[sectionKey];
      return newSections;
    });
  };


  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create object URL for preview
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
      setNewSlider({...newSlider, image: imageUrl});
    }
  };

  const clearImagePreview = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);
    setNewSlider({...newSlider, image: ""});
  };

 

  // Tab configuration
  const tabs = [
    {
      id: "home",
      name: "الصفحة الرئيسية",
      icon: Home,
      color: "from-green-500 to-blue-500"
    },
    {
      id: "footer",
      name: "محتوى الفوتر",
      icon: Layout,
      color: "from-purple-500 to-pink-500"
    },
 
  ];

  const breadcrumbs = [
    { label: "الرئيسية", href: "/", icon: BarChart3 },
    { label: "الاعدادات", href: "#", icon: Settings, current: true },
];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6 my-3" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <BreadcrumbsShowcase variant="pill" items={breadcrumbs}/>
        {/* Enhanced Header */}
        <div className="mb-8  rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center gap-4 mb-3">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg">
              <Settings className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                إعدادات النظام
              </h1>
              <p className="text-gray-600 mt-1">تكوين تفضيلات النظام وإدارة المحتوى بشكل متقدم</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="flex">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 transition-all duration-300 ${
                    isActive
                      ? `bg-gradient-to-r ${tab.color} text-white shadow-lg`
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-semibold">{tab.name}</span>
                </button>
              );
            })}
        </div>
      </div>

        {/* Tab Content */}
        {activeTab === "home" && (
         <SettingHome 
         addSlider={addSlider}
         clearImagePreview={clearImagePreview}
         deleteSlider={deleteSlider}
         moveSlider={moveSlider}
         newSlider={newSlider}
         setNewSlider={setNewSlider}
         sliders={sliders}
         handleImageUpload={handleImageUpload}
         />
        )}

        {activeTab === "footer" && (
          <FooterContainer 
          addFooterSection={addFooterSection}
          deleteFooterSection={deleteFooterSection}
          editingFooterSection={editingFooterSection}
          footerSections={footerSections}
          newFooterSection={newFooterSection}
          setEditingFooterSection={setEditingFooterSection}
          setNewFooterSection={setNewFooterSection}
          toggleSection={toggleSection}
          />
        )}

        

        {/* Enhanced Save Button */}
        <div className="mt-8 flex justify-end">
          <button className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-8 py-4 rounded-xl hover:from-green-700 hover:to-blue-700 flex items-center gap-3 transition-all transform hover:scale-105 shadow-lg">
            <Save className="w-6 h-6" />
            <span className="text-lg font-semibold">حفظ جميع التغييرات</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;
