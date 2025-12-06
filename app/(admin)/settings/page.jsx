"use client";
import FooterContainer from "@/components/Settings/FooterContainer";
import SettingHome from "@/components/Settings/SettingHome";
import BreadcrumbsShowcase from "@/components/ui/BreadCrumbs";
import {
  Settings,
  Home,
  Layout,
  BarChart3,
  Save,
  Phone,
  Mail,
  MapPin,
  LocateFixed,
  CreditCard,
} from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import PaymentGatewayManager from "../../../components/Settings/PaymentGateway";

// ✅ نحمّل الماب ديناميكياً بدون SSR (عشان Next)
const MapPicker = dynamic(() => import("@/components/Settings/MapPicker"), {
  ssr: false,
});

const SystemSettings = () => {
  const [activeTab, setActiveTab] = useState("home");

  // ==== Slider demo state (بدون تغيير) ====
  const [sliders, setSliders] = useState([
    {
      id: 1,
      title: "ابن مستقبلك مع أفضل الدورات التعليمية",
      description: "انضم إلينا واكتشف عالم التعليم المتميز",
      buttonText: "اكتشف المزيد",
      image: "/api/placeholder/800/400",
      video: null,
      order: 1,
      isActive: true,
    },
  ]);

  const [footerSections, setFooterSections] = useState({
    about: {
      visible: true,
      title: "من نحن",
      type: "about",
      content: {
        logo: "/api/placeholder/150/50",
        description:
          "تمكين المتدربين والمعلمين من خلال التحضير الشامل للامتحانات وموارد التطوير المهني",
        links: [
          { name: "حولنا", url: "#" },
          { name: "الأسئلة الشائعة", url: "#" },
          { name: "فريق", url: "#" },
          { name: "سياسة الخصوصية", url: "#" },
          { name: "مدونة", url: "#" },
        ],
      },
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
          { name: "اختبار المستوى", url: "#" },
        ],
      },
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
          { name: "تيليجرام", url: "https://telegram.org", icon: "✈️" },
        ],
      },
    },
  });

  const [newFooterSection, setNewFooterSection] = useState({
    title: "",
    type: "links",
    content: { description: "", links: [{ name: "", url: "" }] },
  });

  const [newSlider, setNewSlider] = useState({
    title: "",
    description: "",
    buttonText: "",
    image: "",
    video: "",
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [editingFooterSection, setEditingFooterSection] = useState(null);

  const addSlider = () => {
    const slider = {
      id: Date.now(),
      ...newSlider,
      order: sliders.length + 1,
      isActive: true,
    };
    setSliders((p) => [...p, slider]);
    setNewSlider({ title: "", description: "", buttonText: "", image: "", video: "" });
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
  };
  const deleteSlider = (id) => setSliders((p) => p.filter((s) => s.id !== id));
  const moveSlider = (id, dir) => {
    const i = sliders.findIndex((s) => s.id === id);
    if ((dir === "up" && i === 0) || (dir === "down" && i === sliders.length - 1)) return;
    const arr = [...sliders];
    const j = dir === "up" ? i - 1 : i + 1;
    [arr[i], arr[j]] = [arr[j], arr[i]];
    arr.forEach((s, idx) => (s.order = idx + 1));
    setSliders(arr);
  };
  const toggleSection = (key) =>
    setFooterSections((p) => ({ ...p, [key]: { ...p[key], visible: !p[key].visible } }));
  const updateFooterSection = (key, content) =>
    setFooterSections((p) => ({ ...p, [key]: { ...p[key], content } }));
  const addFooterSection = () => {
    const key = `section_${Date.now()}`;
    setFooterSections((p) => ({ ...p, [key]: { visible: true, ...newFooterSection } }));
    setNewFooterSection({ title: "", type: "links", content: { description: "", links: [{ name: "", url: "" }] } });
  };
  const deleteFooterSection = (key) =>
    setFooterSections((p) => {
      const c = { ...p };
      delete c[key];
      return c;
    });
  const handleImageUpload = (e) => {
    const f = e.target.files?.[0];
    if (f) {
      const url = URL.createObjectURL(f);
      setImagePreview(url);
      setNewSlider((s) => ({ ...s, image: url }));
    }
  };
  const clearImagePreview = () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
    setNewSlider((s) => ({ ...s, image: "" }));
  };

  // ===================== Contact Tab State =====================
  const [contact, setContact] = useState({
    phone: "",
    email: "",
    address: "",
    lat: null,
    lng: null,
  });

  // عكس جغرافي (اختياري) ➜ يحوّل lat/lng إلى اسم مكان
  const reverseGeocode = async (lat, lng) => {
    try {
      const resp = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
        { headers: { "Accept-Language": "ar" } }
      );
      const data = await resp.json();
      const label = data?.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
      setContact((p) => ({ ...p, address: label }));
    } catch {
      setContact((p) => ({ ...p, address: `${lat.toFixed(5)}, ${lng.toFixed(5)}` }));
    }
  };

  // زر "استخدم موقعي"
  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("المتصفح لا يدعم تحديد الموقع الجغرافي");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const { latitude, longitude } = coords;
        setContact((p) => ({ ...p, lat: latitude, lng: longitude }));
        // عكس جغرافي تلقائي
        await reverseGeocode(latitude, longitude);
      },
      (err) => {
        alert("تعذّر الحصول على موقعك. يرجى السماح للإذن أو المحاولة لاحقًا.");
        console.error(err);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const tabs = useMemo(
    () => [
      { id: "home", name: "الصفحة الرئيسية", icon: Home, color: "from-green-500 to-blue-500" },
      { id: "footer", name: "محتوى الفوتر", icon: Layout, color: "from-purple-500 to-pink-500" },
      { id: "contact", name: "تواصل معنا", icon: MapPin, color: "from-sky-500 to-indigo-500" },
      {id :"payment_gateway" ,name:"بوابة الدفع",icon: CreditCard , color:"from-blue-500 to-indigo-500"}
    ],
    []
  ); 

  const breadcrumbs = [
    { label: "الرئيسية", href: "/", icon: BarChart3 },
    { label: "الاعدادات", href: "#", icon: Settings, current: true },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6 my-3" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <BreadcrumbsShowcase variant="pill" items={breadcrumbs} />

        {/* Header */}
        <div className="mb-8 rounded-2xl shadow-lg p-6 border border-gray-100">
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

        {/* Tabs */}
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
                    isActive ? `bg-gradient-to-r ${tab.color} text-white shadow-lg` : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
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

        {activeTab === "contact" && (
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <MapPin className="w-6 h-6 text-sky-600" />
              إعدادات صفحة تواصل معنا
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Right: form */}
              <div className="space-y-4">
                <label className="block">
                  <span className="text-sm text-gray-700 flex items-center gap-2 mb-1">
                    <Phone className="w-4 h-4 text-emerald-600" />
                    رقم الهاتف
                  </span>
                  <input
                    type="tel"
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    placeholder="+20 10 123 45678"
                    value={contact.phone}
                    onChange={(e) => setContact((p) => ({ ...p, phone: e.target.value }))}
                  />
                </label>

                <label className="block">
                  <span className="text-sm text-gray-700 flex items-center gap-2 mb-1">
                    <Mail className="w-4 h-4 text-blue-600" />
                    البريد الإلكتروني
                  </span>
                  <input
                    type="email"
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="support@example.com"
                    value={contact.email}
                    onChange={(e) => setContact((p) => ({ ...p, email: e.target.value }))}
                  />
                </label>

                <label className="block">
                  <span className="text-sm text-gray-700 flex items-center gap-2 mb-1">
                    <MapPin className="w-4 h-4 text-rose-600" />
                    الموقع
                  </span>
                  <input
                    type="text"
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-400"
                    placeholder="اكتب العنوان أو اختر من الخريطة"
                    value={contact.address}
                    onChange={(e) => setContact((p) => ({ ...p, address: e.target.value }))}
                  />
                </label>

                <button
                  type="button"
                  onClick={useCurrentLocation}
                  className="mt-2 inline-flex items-center gap-2 rounded-xl bg-sky-600 text-white px-4 py-2 hover:bg-sky-700 transition"
                >
                  <LocateFixed className="w-4 h-4" />
                  استخدم موقعي الآن للخريطة
                </button>
              </div>

              {/* Left: interactive map (react-leaflet) */}
              <div className="rounded-xl overflow-hidden border border-gray-200 h-[340px]">
                <MapPicker
                  center={{
                    lat: contact.lat ?? 26.8206, // مصر كافتراضي
                    lng: contact.lng ?? 30.8025,
                  }}
                  marker={
                    contact.lat && contact.lng
                      ? { lat: contact.lat, lng: contact.lng }
                      : null
                  }
                  onPick={async ({ lat, lng }) => {
                    setContact((p) => ({ ...p, lat, lng }));
                    await reverseGeocode(lat, lng); // يملأ الـinput تلقائياً
                  }}
                  zoom={contact.lat && contact.lng ? 15 : 5}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab ==="payment_gateway" && <PaymentGatewayManager />}

        {/* Save Button */}
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
