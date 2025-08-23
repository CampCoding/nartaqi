"use client";
import React, { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";

// UI imports from your project
import PageLayout from "../../../components/layout/PageLayout";
import BreadcrumbsShowcase from "../../../components/ui/BreadCrumbs";
import { BarChart3, Book, Save, Edit, X } from "lucide-react";
import PagesHeader from "../../../components/ui/PagesHeader";
import Button from "../../../components/atoms/Button";

// Load ReactQuill client-side only to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
import "react-quill-new/dist/quill.snow.css";

/**
 * What’s improved:
 * - Per-tab content with distinct localStorage keys.
 * - Fix Quill warning by removing `"bullet"` from `formats` (keep `"list"` only).
 * - Dynamic breadcrumbs/header/placeholder by active tab.
 * - RTL-safe editor & viewer; remove invalid Tailwind class `hover:scale-102`.
 * - Proper cancel behavior (restores last-saved per-tab content) and seeded defaults.
 */

const TABS = [
  { id: 1, key: "privacy", title: "سياسة الخصوصية" },
  { id: 2, key: "terms", title: "الشروط والأحكام" },
];

// Default seeded content per tab
const DEFAULT_CONTENT = {
  privacy: `
    <h2>مقدمة</h2>
    <p>في هذه الصفحة، نوضح كيفية جمع معلوماتك الشخصية واستخدامها وحمايتها. نلتزم بالشفافية في معاملة بياناتك الشخصية.</p>
    <h2>المعلومات التي نجمعها</h2>
    <p>نحن نجمع البيانات التي تقدمها طوعاً عبر نموذج التسجيل، مثل الاسم، البريد الإلكتروني، والمعلومات الأخرى ذات الصلة.</p>
    <h2>كيفية استخدام معلوماتك</h2>
    <p>نستخدم المعلومات لتحسين تجربتك وتقديم خدمة مخصصة حسب احتياجاتك، والامتثال للالتزامات القانونية.</p>
    <h2>حماية المعلومات</h2>
    <p>نطبق ضوابط تقنية وتنظيمية مناسبة لحماية بياناتك من الوصول غير المصرح به أو المعالجة غير القانونية.</p>
    <h2>حقوقك</h2>
    <p>لديك حقوق في الوصول إلى بياناتك وتصحيحها وحذفها، ويمكنك التواصل معنا لممارسة هذه الحقوق.</p>
    <h2>التعديلات</h2>
    <p>قد نقوم بتحديث سياسة الخصوصية. سنعلن عن أي تغييرات مهمة على هذه الصفحة.</p>
  `,
  terms: `
    <h2>مقدمة</h2>
    <p>باستخدامك منصتنا، فإنك توافق على الالتزام بهذه الشروط والأحكام. يرجى قراءتها بعناية.</p>
    <h2>حساب المستخدم</h2>
    <p>أنت مسؤول عن سرية بيانات تسجيل الدخول وأي أنشطة تتم عبر حسابك.</p>
    <h2>الاستخدام المقبول</h2>
    <p>يُحظر إساءة الاستخدام، بما في ذلك محاولة الوصول غير المصرح به أو تعطيل الخدمة.</p>
    <h2>المدفوعات والاشتراكات</h2>
    <p>تخضع الرسوم لسياسات السداد المذكورة. قد تتغير الأسعار مع إشعار مسبق.</p>
    <h2>الملكية الفكرية</h2>
    <p>جميع الحقوق محفوظة للمحتوى والمواد والعلامات التجارية على المنصة ما لم يُنص على خلاف ذلك.</p>
    <h2>إنهاء الاستخدام</h2>
    <p>يجوز لنا تعليق أو إنهاء الوصول في حال مخالفة الشروط.</p>
    <h2>التعديلات على الشروط</h2>
    <p>نحتفظ بالحق في تعديل الشروط، ويُعد استمرارك في الاستخدام موافقة على التعديلات.</p>
  `,
};

export default function PrivacyPolicyPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState(1); // 1=privacy, 2=terms
  const [content, setContent] = useState("");

  // Derived helpers
  const activeKey = useMemo(
    () => TABS.find((t) => t.id === activeTab)?.key ?? "privacy",
    [activeTab]
  );
  const lsKey = useMemo(() => `policyContent:${activeKey}`, [activeKey]);

  // Dynamic breadcrumbs based on tab
  const breadcrumbs = useMemo(
    () => [
      { label: "الرئيسية", href: "/", icon: BarChart3 },
      {
        label: TABS.find((t) => t.id === activeTab)?.title || "الوثائق",
        href: "/privacy-policy",
        icon: Book,
      },
    ],
    [activeTab]
  );

  // Dynamic header text
  const headerTitle = useMemo(
    () => TABS.find((t) => t.id === activeTab)?.title || "الوثائق",
    [activeTab]
  );
  const headerSubtitle = useMemo(
    () =>
      activeTab === 1
        ? "تحكّم في سياسة الخصوصية بما يناسب منصتك"
        : "نظّم وأدر الشروط والأحكام بمرونة",
    [activeTab]
  );

  // Quill modules & formats
  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ font: [] }],
        [{ size: ["small", false, "large", "huge"] }],
        ["bold", "italic", "underline", "strike"],
        [{ color: ["#0F7490", "#C9AE6C", "#8B5CF6", "#202938"] }, { background: [] }],
        [{ script: "sub" }, { script: "super" }],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ indent: "-1" }, { indent: "+1" }],
        [{ align: [] }],
        ["blockquote", "code-block"],
        ["link", "image", "video"],
        ["clean"],
      ],
    }),
    []
  );

  // IMPORTANT: Only include formats Quill recognizes. 'list' covers bullets & ordered.
  const formats = useMemo(
    () => [
      "header",
      "font",
      "size",
      "bold",
      "italic",
      "underline",
      "strike",
      "color",
      "background",
      "script",
      "list", // do NOT add "bullet" separately to avoid the registration error
      "indent",
      "align",
      "blockquote",
      "code-block",
      "link",
      "image",
      "video",
    ],
    []
  );

  // Mount + initial load
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Load content whenever active tab changes (after mount)
  useEffect(() => {
    if (!isMounted) return;
    if (typeof window === "undefined") return;

    const saved = localStorage.getItem(lsKey);
    if (saved) setContent(saved);
    else setContent(DEFAULT_CONTENT[activeKey] || "");
  }, [isMounted, lsKey, activeKey]);

  // Save current tab content
  const handleSave = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem(lsKey, content);
    }
    setIsEditing(false);
  };

  // Cancel editing (restore last-saved or default for current tab)
  const handleCancel = () => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(lsKey);
      if (saved) setContent(saved);
      else setContent(DEFAULT_CONTENT[activeKey] || "");
    }
    setIsEditing(false);
  };

  // Skeleton during mount
  if (!isMounted) {
    return (
      <PageLayout>
        <div dir="rtl" className="bg-gradient-to-r from-gray-50 to-gray-200 p-6 min-h-screen">
          <BreadcrumbsShowcase items={breadcrumbs} variant="pill" />
          <div className="animate-pulse bg-white rounded-lg p-8 mt-8">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-6"></div>
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div dir="rtl" className="min-h-screen p-6">
        {/* Breadcrumbs */}
        <BreadcrumbsShowcase items={breadcrumbs} variant="pill" />

        {/* Tabs */}
        <div className="flex flex-wrap gap-3 mb-8">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`group relative px-6 py-3 rounded-2xl font-semibold transition-all duration-300 flex items-center gap-3 ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-2xl scale-105"
                  : "bg-white/80 backdrop-blur-sm text-gray-700 border-2 border-gray-200 hover:bg-white hover:border-blue-300 hover:scale-105 shadow-lg"
              }`}
            >
              <div
                className={`w-3 h-3 rounded-full ${
                  activeTab === tab.id ? "bg-white" : "bg-primary"
                }`}
              ></div>
              <span>{tab.title}</span>
            </button>
          ))}
        </div>

        {/* Header */}
        <PagesHeader
          title={headerTitle}
          subtitle={headerSubtitle}
          extra={
            <div className="flex items-center gap-4 gap-reverse">
              {isEditing ? (
                <>
                  <Button
                    onClick={handleSave}
                    type="primary"
                    size="large"
                    icon={<Save className="w-5 h-5" />}
                  >
                    حفظ
                  </Button>
                  <Button
                    onClick={handleCancel}
                    type="secondary"
                    size="large"
                    icon={<X className="w-5 h-5" />}
                  >
                    إلغاء
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => setIsEditing(true)}
                  type="primary"
                  size="large"
                  icon={<Edit className="w-5 h-5" />}
                >
                  تعديل
                </Button>
              )}
            </div>
          }
        />

        {/* Editor / Viewer */}
        <div className="shadow-lg rounded-lg bg-white p-8 mt-8 mb-8 border-l-8 border-orange-500">
          {isEditing ? (
            <div className="min-h-[500px]">
              <div className="[&_.ql-editor]:text-right [&_.ql-editor]:leading-8 [&_.ql-editor]:min-h-[24rem] [&_.ql-editor]:rtl [&_.ql-container]:rounded-xl">
                <ReactQuill
                  value={content}
                  onChange={setContent}
                  modules={modules}
                  formats={formats}
                  theme="snow"
                  placeholder={`اكتب محتوى ${headerTitle} هنا...`}
                  className="h-96 mb-12"
                />
              </div>
            </div>
          ) : (
            <div
              className="prose prose-lg max-w-none rtl text-right"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          )}
        </div>
      </div>
    </PageLayout>
  );
}
