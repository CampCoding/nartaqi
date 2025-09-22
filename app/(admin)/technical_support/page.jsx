"use client";

import React, { useMemo, useState } from "react";
import {
  Form,
  Input,
  Select,
  Switch,
  Modal,
  message,
  Table,
  Tag,
  Space,
  Tooltip,
} from "antd";
import "@ant-design/v5-patch-for-react-19";
import dynamic from "next/dynamic";
// 👇 استخدم react-quill-new بدل react-quill
import "react-quill-new/dist/quill.snow.css";
import PageLayout from "../../../components/layout/PageLayout";
import BreadcrumbsShowcase from "../../../components/ui/BreadCrumbs";
import PagesHeader from "../../../components/ui/PagesHeader";
import Button from "../../../components/atoms/Button";
import {
  BarChart3,
  Headset,
  Plus,
  Save,
  ExternalLink,
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  MoveUp,
  MoveDown,
  Video,
  FileText,
  Search,
  Filter,
} from "lucide-react";

// 👇 Dynamic import مع تعطيل SSR
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
const { TextArea } = Input;

const breadcrumbs = [
  { label: "الرئيسية", href: "/", icon: BarChart3 },
  { label: "الدعم الفني", href: "#", icon: Headset, current: true },
];

// ==== Helpers ===============================================================
const toWaLink = (num) => {
  const digits = (num || "").replace(/\D+/g, "");
  return digits ? `https://wa.me/${digits}` : "";
};

const stripHtml = (html = "") =>
  html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

const nl2br = (text = "") => text.replace(/\n/g, "<br/>");

const quillModules = {
  toolbar: [
    [{ header: [false, 3, 4, 5] }],
    ["bold", "italic", "underline"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ align: [] }],
    ["link"],
    ["clean"],
  ],
  clipboard: { matchVisual: true },
};

// ==== Seeds ================================================================
const initialSettings = {
  heroTitle: "الدعم الفني",
  heroSubtitle: "نقدّم لك قنوات دعم سريعة وواضحة لحل أي مشكلة تواجهك.",
  whatsappNumber: "+966 55 123 4567",
  whatsappLabel: "عبر واتساب من هنا",
  supportEmail: "support@example.com",
  workingNote:
    "خلال أيام الأسبوع (الأحد إلى الخميس) من الساعة 9 ص حتى 5 م. يتم الرد عادة خلال 24 ساعة عمل، وقد يمتد لـ 48 ساعة في أوقات الذروة.",
  resolutionNote:
    "سلم معالجة المشكلات: استقبال (24 ساعة) → تشخيص (2-3 أيام) → حل تقني متكامل خلال أسبوع إلى أسبوعين حسب طبيعة المشكلة.",
  showEmail: true,
  showWhatsApp: true,
};

const initialFaqs = [
  {
    id: 1,
    question: "ما هي قنوات الدعم الفني؟",
    answerHtml: nl2br("• المحادثة المباشرة داخل المنصة.\n• عبر واتساب من هنا.\n• البريد الإلكتروني."),
    visible: true,
    order: 1,
  },
  {
    id: 2,
    question: "ما هي الأوقات التي سيتم الإجابة فيها على استفساراتي؟",
    answerHtml: nl2br(
      "خلال أيام الأسبوع من الأحد إلى الخميس 9 ص – 5 م. الرد عادة خلال 24 ساعة عمل، وقد يمتد 48 ساعة في أوقات الذروة."
    ),
    visible: true,
    order: 2,
  },
  {
    id: 3,
    question: "الوقت المتوقع لحل المشكلة",
    answerHtml: nl2br(
      "تختلف المدة حسب نوع المشكلة. المشكلات البسيطة: خلال 24–48 ساعة. المشكلات التقنية المتقدمة: خلال أسبوع إلى أسبوعين."
    ),
    visible: true,
    order: 3,
  },
];

const initialKB = [
  {
    id: 1,
    title: "كيفية إنشاء حساب جديد",
    type: "article",
    category: "الحسابات",
    url: "/help/create-account",
    visible: true,
  },
  {
    id: 2,
    title: "الدفع عبر البطاقة خطوة بخطوة",
    type: "video",
    category: "الدفع",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    visible: true,
  },
  {
    id: 3,
    title: "رفع الواجبات من الجوال",
    type: "article",
    category: "الواجبات",
    url: "/help/upload-homework",
    visible: false,
  },
];

// ==== Subcomponents =========================================================
function TabPill({ active, onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={[
        "px-4 py-2 rounded-2xl text-sm font-medium transition-all border",
        active
          ? "bg-gradient-to-r from-sky-500 to-cyan-600 text-white border-transparent shadow"
          : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50",
      ].join(" ")}
    >
      {label}
    </button>
  );
}

function SectionCard({ title, children, extra }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800">{title}</h3>
        {extra}
      </div>
      {children}
    </div>
  );
}

// ==== Page ==================================================================
export default function page() {
  const [activeTab, setActiveTab] = useState("channels");

  // Settings (support channels)
  const [settings, setSettings] = useState(initialSettings);
  const [savingSettings, setSavingSettings] = useState(false);

  // FAQs
  const [faqs, setFaqs] = useState(initialFaqs);
  const [faqModalOpen, setFaqModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);

  // Knowledge base (articles/videos)
  const [kb, setKb] = useState(initialKB);
  const [kbModalOpen, setKbModalOpen] = useState(false);
  const [editingKb, setEditingKb] = useState(null);

  // FAQ search & filter
  const [faqQuery, setFaqQuery] = useState("");
  const [faqVisFilter, setFaqVisFilter] = useState("all"); // all | visible | hidden

  // Derived
  const sortedFaqs = useMemo(
    () => [...faqs].sort((a, b) => a.order - b.order),
    [faqs]
  );

  const filteredFaqs = useMemo(() => {
    let list = sortedFaqs;
    if (faqVisFilter === "visible") list = list.filter((f) => f.visible);
    if (faqVisFilter === "hidden") list = list.filter((f) => !f.visible);
    if (faqQuery.trim()) {
      const q = faqQuery.trim().toLowerCase();
      list = list.filter(
        (f) =>
          (f.question || "").toLowerCase().includes(q) ||
          stripHtml(f.answerHtml || "").toLowerCase().includes(q)
      );
    }
    return list;
  }, [sortedFaqs, faqQuery, faqVisFilter]);

  // ==== Actions: Settings ===================================================
  const handleSaveSettings = async (values) => {
    setSavingSettings(true);
    try {
      const clean = { ...settings, ...values };
      setSettings(clean);
      // TODO: call API (PUT /support/settings) with `clean`
      message.success("تم حفظ إعدادات الدعم الفني بنجاح");
    } catch (e) {
      message.error("تعذر الحفظ. حاول مرة أخرى.");
    } finally {
      setSavingSettings(false);
    }
  };

  // ==== Actions: FAQs =======================================================
  const openNewFaq = () => {
    setEditingFaq(null);
    setFaqModalOpen(true);
  };
  const openEditFaq = (rec) => {
    setEditingFaq(rec);
    setFaqModalOpen(true);
  };
  const deleteFaq = (id) => {
    setFaqs((prev) => prev.filter((f) => f.id !== id));
    message.success("تم حذف السؤال");
  };
  const toggleFaqVisibility = (id) => {
    setFaqs((prev) =>
      prev.map((f) => (f.id === id ? { ...f, visible: !f.visible } : f))
    );
  };
  const moveFaq = (id, dir) => {
    setFaqs((prev) => {
      const list = [...prev].sort((a, b) => a.order - b.order);
      const idx = list.findIndex((f) => f.id === id);
      if (idx === -1) return prev;
      const swapIdx = dir === "up" ? idx - 1 : idx + 1;
      if (swapIdx < 0 || swapIdx >= list.length) return prev;
      const a = list[idx];
      const b = list[swapIdx];
      const tmp = a.order;
      a.order = b.order;
      b.order = tmp;
      return [...list];
    });
  };
  const onSubmitFaq = (values) => {
    const payload = {
      question: values.question,
      answerHtml: values.answerHtml || "",
      visible: !!values.visible,
    };

    if (editingFaq) {
      setFaqs((prev) =>
        prev.map((f) => (f.id === editingFaq.id ? { ...f, ...payload } : f))
      );
      message.success("تم تحديث السؤال");
    } else {
      const maxOrder = Math.max(0, ...faqs.map((f) => f.order || 0));
      const maxId = Math.max(0, ...faqs.map((f) => f.id || 0));
      setFaqs((prev) => [
        { id: maxId + 1, order: maxOrder + 1, ...payload },
        ...prev,
      ]);
      message.success("تمت إضافة السؤال");
    }
    setFaqModalOpen(false);
  };

  // ==== Actions: KB =========================================================
  const openNewKb = () => {
    setEditingKb(null);
    setKbModalOpen(true);
  };
  const openEditKb = (rec) => {
    setEditingKb(rec);
    setKbModalOpen(true);
  };
  const deleteKb = (id) => {
    setKb((prev) => prev.filter((k) => k.id !== id));
    message.success("تم حذف العنصر");
  };
  const toggleKbVisibility = (id) => {
    setKb((prev) =>
      prev.map((k) => (k.id === id ? { ...k, visible: !k.visible } : k))
    );
  };
  const onSubmitKb = (values) => {
    if (editingKb) {
      setKb((prev) =>
        prev.map((k) => (k.id === editingKb.id ? { ...k, ...values } : k))
      );
      message.success("تم التحديث");
    } else {
      const maxId = Math.max(0, ...kb.map((k) => k.id || 0));
      setKb((prev) => [{ id: maxId + 1, visible: true, ...values }, ...prev]);
      message.success("تمت الإضافة");
    }
    setKbModalOpen(false);
  };

  // ==== Tables ==============================================================

  const faqCols = [
    {
      title: "الترتيب",
      dataIndex: "order",
      width: 90,
      align: "center",
      render: (_, rec) => (
        <div className="flex items-center justify-center gap-1">
          <Tooltip title="رفع لأعلى">
            <button
              onClick={() => moveFaq(rec.id, "up")}
              className="p-1 rounded-md hover:bg-gray-100"
            >
              <MoveUp size={16} />
            </button>
          </Tooltip>
          <span className="text-gray-700 font-semibold w-6 text-center">
            {rec.order}
          </span>
          <Tooltip title="إنزال لأسفل">
            <button
              onClick={() => moveFaq(rec.id, "down")}
              className="p-1 rounded-md hover:bg-gray-100"
            >
              <MoveDown size={16} />
            </button>
          </Tooltip>
        </div>
      ),
    },
    {
      title: "السؤال",
      dataIndex: "question",
      width: 380,
      render: (v) => <span className="font-medium">{v}</span>,
    },
    {
      title: "مقتطف الإجابة",
      dataIndex: "answerHtml",
      ellipsis: true,
      render: (html) => (
        <span className="text-gray-600">
          {stripHtml(html).slice(0, 90)}
          {stripHtml(html).length > 90 ? "…" : ""}
        </span>
      ),
    },
    {
      title: "الحالة",
      dataIndex: "visible",
      width: 120,
      align: "center",
      render: (vis) =>
        vis ? <Tag color="green">ظاهر</Tag> : <Tag>مخفي</Tag>,
    },
    {
      title: "إجراءات",
      width: 240,
      align: "center",
      render: (_, rec) => (
        <Space size="small">
          <Tooltip title="تعديل">
            <button
              onClick={() => openEditFaq(rec)}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50"
            >
              <Edit3 size={16} />
            </button>
          </Tooltip>
          <Tooltip title={rec.visible ? "إخفاء" : "إظهار"}>
            <button
              onClick={() => toggleFaqVisibility(rec.id)}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50"
            >
              {rec.visible ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </Tooltip>
          <Tooltip title="حذف">
            <button
              onClick={() => deleteFaq(rec.id)}
              className="p-2 rounded-lg border border-gray-200 hover:bg-red-50 text-red-600"
            >
              <Trash2 size={16} />
            </button>
          </Tooltip>
        </Space>
      ),
    },
  ];

  const kbCols = [
    {
      title: "العنوان",
      dataIndex: "title",
      render: (v) => <span className="font-medium">{v}</span>,
    },
    {
      title: "النوع",
      dataIndex: "type",
      width: 120,
      align: "center",
      render: (t) =>
        t === "video" ? (
          <Tag icon={<Video size={12} />}>فيديو</Tag>
        ) : (
          <Tag icon={<FileText size={12} />}>مقال</Tag>
        ),
    },
    {
      title: "التصنيف",
      dataIndex: "category",
      width: 140,
      align: "center",
      render: (v) => <Tag color="blue">{v}</Tag>,
    },
    {
      title: "الرابط",
      dataIndex: "url",
      render: (u) => (
        <a
          className="text-blue-600 underline underline-offset-4"
          href={u}
          target="_blank"
        >
          فتح <ExternalLink className="inline ms-1" size={14} />
        </a>
      ),
    },
    {
      title: "الحالة",
      dataIndex: "visible",
      width: 120,
      align: "center",
      render: (vis) =>
        vis ? <Tag color="green">منشور</Tag> : <Tag>مخفّى</Tag>,
    },
    {
      title: "إجراءات",
      width: 220,
      align: "center",
      render: (_, rec) => (
        <Space size="small">
          <Tooltip title="تعديل">
            <button
              onClick={() => openEditKb(rec)}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50"
            >
              <Edit3 size={16} />
            </button>
          </Tooltip>
          <Tooltip title={rec.visible ? "إخفاء" : "إظهار"}>
            <button
              onClick={() => toggleKbVisibility(rec.id)}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50"
            >
              {rec.visible ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </Tooltip>
          <Tooltip title="حذف">
            <button
              onClick={() => deleteKb(rec.id)}
              className="p-2 rounded-lg border border-gray-200 hover:bg-red-50 text-red-600"
            >
              <Trash2 size={16} />
            </button>
          </Tooltip>
        </Space>
      ),
    },
  ];

  // Counters for header
  const faqCounts = useMemo(() => {
    const total = faqs.length;
    const vis = faqs.filter((f) => f.visible).length;
    const hid = total - vis;
    return { total, vis, hid };
  }, [faqs]);

  return (
    <PageLayout>
      <div dir="rtl" className="min-h-screen p-6 bg-gray-50">
        <BreadcrumbsShowcase variant="pill" items={breadcrumbs} />

        <PagesHeader
          title="الدعم الفني"
          subtitle="مركز تحكم لمحتوى صفحة الدعم في الموقع: القنوات، الأسئلة الشائعة."
          extra={
            <div className="flex items-center gap-3">
              <Button
                onClick={() => setKbModalOpen(true)}
                type="primary"
                size="large"
                icon={<Plus className="w-5 h-5" />}
              >
                إضافة مادة مساعدة
              </Button>
            </div>
          }
        />

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-6">
          <TabPill
            active={activeTab === "channels"}
            onClick={() => setActiveTab("channels")}
            label="قنوات وإعدادات الدعم"
          />
          <TabPill
            active={activeTab === "faqs"}
            onClick={() => setActiveTab("faqs")}
            label={`الأسئلة الشائعة (FAQ) — ${faqCounts.total}`}
          />
        </div>

        {/* ===================== Channels & Settings ===================== */}
        {activeTab === "channels" && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <SectionCard
              title="البيانات الأساسية"
              extra={
                <Button
                  type="primary"
                  icon={<Save className="w-4 h-4" />}
                  loading={savingSettings}
                  onClick={() => {
                    const form = document.getElementById(
                      "support-settings-form"
                    );
                    form?.dispatchEvent(
                      new Event("submit", { bubbles: true, cancelable: true })
                    );
                  }}
                >
                  حفظ التغييرات
                </Button>
              }
            >
              <Form
                id="support-settings-form"
                layout="vertical"
                initialValues={settings}
                onFinish={handleSaveSettings}
                onValuesChange={(_, all) => setSettings(all)}
              >
                <Form.Item label="عنوان الهيرو في الموقع" name="heroTitle">
                  <Input placeholder="الدعم الفني" />
                </Form.Item>
                <Form.Item label="وصف قصير/سطر فرعي" name="heroSubtitle">
                  <Input placeholder="جملة تعريفية قصيرة تظهر تحت العنوان" />
                </Form.Item>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Form.Item label="رقم واتساب" name="whatsappNumber">
                    <Input placeholder="+966 55 123 4567" />
                  </Form.Item>
                  <Form.Item label="نص زر واتساب" name="whatsappLabel">
                    <Input placeholder="عبر واتساب من هنا" />
                  </Form.Item>
                  <Form.Item label="بريد الدعم" name="supportEmail">
                    <Input placeholder="support@example.com" />
                  </Form.Item>
                  <Form.Item
                    label="إظهار زر واتساب"
                    name="showWhatsApp"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                  <Form.Item
                    label="إظهار البريد"
                    name="showEmail"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                </div>

                <Form.Item
                  label="ملاحظات أوقات العمل/الرد"
                  name="workingNote"
                >
                  <TextArea
                    rows={3}
                    placeholder="مثال: الأحد–الخميس 9 ص إلى 5 م..."
                  />
                </Form.Item>

                <Form.Item
                  label="ملاحظات زمن الحل المتوقع"
                  name="resolutionNote"
                >
                  <TextArea
                    rows={3}
                    placeholder="مثال: خلال أسبوع إلى أسبوعين حسب نوع المشكلة..."
                  />
                </Form.Item>
              </Form>
            </SectionCard>

            {/* Preview */}
            <div className="xl:col-span-2">
              <SectionCard title="معاينة سريعة (كما ستظهر في الموقع)">
                <div className="rounded-2xl border border-gray-200 p-6 bg-gradient-to-br from-white to-gray-50">
                  <h2 className="text-2xl font-extrabold text-gray-900 mb-1">
                    {settings.heroTitle || "الدعم الفني"}
                  </h2>
                  <p className="text-gray-600 mb-4">
                    {settings.heroSubtitle ||
                      "نقدّم لك قنوات دعم سريعة وواضحة لحل أي مشكلة تواجهك."}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {settings.showWhatsApp && settings.whatsappNumber && (
                      <a
                        href={toWaLink(settings.whatsappNumber)}
                        target="_blank"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-white bg-green-600 hover:bg-green-700"
                      >
                        <Headset size={16} />
                        {settings.whatsappLabel || "عبر واتساب من هنا"}
                      </a>
                    )}
                    {settings.showEmail && settings.supportEmail && (
                      <a
                        href={`mailto:${settings.supportEmail}`}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-blue-700 bg-blue-100 hover:bg-blue-200"
                      >
                        {settings.supportEmail}
                      </a>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="text-sm text-gray-500 mb-1">
                        أوقات الرد
                      </div>
                      <div className="text-gray-800 bg-white border border-gray-200 rounded-xl p-3">
                        {settings.workingNote}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">
                        الوقت المتوقع للحل
                      </div>
                      <div className="text-gray-800 bg-white border border-gray-200 rounded-xl p-3">
                        {settings.resolutionNote}
                      </div>
                    </div>
                  </div>
                </div>
              </SectionCard>
            </div>
          </div>
        )}

        {/* ===================== FAQs ===================== */}
        {activeTab === "faqs" && (
          <SectionCard
            title="الأسئلة الشائعة (FAQ)"
            extra={
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2">
                  <Search size={16} className="text-gray-500" />
                  <input
                    className="outline-none text-sm w-48"
                    placeholder="بحث في الأسئلة…"
                    value={faqQuery}
                    onChange={(e) => setFaqQuery(e.target.value)}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">الحالة:</span>
                  <div className="flex items-center gap-1">
                    {[
                      { v: "all", label: "الكل", color: "from-slate-400 to-slate-500" },
                      { v: "visible", label: `ظاهر (${faqCounts.vis})`, color: "from-emerald-500 to-teal-600" },
                      { v: "hidden", label: `مخفي (${faqCounts.hid})`, color: "from-rose-500 to-red-600" },
                    ].map((t) => (
                      <button
                        key={t.v}
                        onClick={() => setFaqVisFilter(t.v)}
                        className={[
                          "px-3 py-1.5 rounded-xl text-xs font-semibold border",
                          faqVisFilter === t.v
                            ? `text-white border-transparent bg-gradient-to-r ${t.color}`
                            : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50",
                        ].join(" ")}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                <Button
                  type="primary"
                  icon={<Plus className="w-4 h-4" />}
                  onClick={openNewFaq}
                >
                  إضافة سؤال
                </Button>
              </div>
            }
          >
            <Table
              rowKey="id"
              dataSource={filteredFaqs}
              columns={faqCols}
              size="middle"
              pagination={{ pageSize: 8, position: ["bottomCenter"] }}
              expandable={{
                expandedRowRender: (rec) => (
                  <div className="prose prose-sm max-w-none rtl text-gray-800">
                    <div
                      className="[&>*]:mb-2"
                      dangerouslySetInnerHTML={{
                        __html: rec.answerHtml || "",
                      }}
                    />
                  </div>
                ),
                rowExpandable: (rec) => !!rec.answerHtml,
              }}
            />
          </SectionCard>
        )}

        {/* ===== FAQ Modal (Rich Text) ===== */}
        <Modal
          title={editingFaq ? "تعديل سؤال" : "إضافة سؤال جديد"}
          open={faqModalOpen}
          onCancel={() => setFaqModalOpen(false)}
          footer={null}
          destroyOnClose
        >
          <Form
            layout="vertical"
            onFinish={onSubmitFaq}
            initialValues={
              editingFaq || {
                question: "",
                answerHtml: "",
                visible: true,
              }
            }
          >
            <Form.Item
              label="السؤال"
              name="question"
              rules={[{ required: true, message: "اكتب السؤال" }]}
            >
              <Input placeholder="اكتب السؤال هنا" />
            </Form.Item>

            <Form.Item
              label="الإجابة"
              name="answerHtml"
              rules={[{ required: true, message: "اكتب الإجابة" }]}
              valuePropName="value"
              getValueFromEvent={(v) => v}
            >
              <ReactQuill theme="snow" modules={quillModules} />
            </Form.Item>

            <Form.Item
              label="ظاهر على الموقع"
              name="visible"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
            <div className="flex justify-end gap-2">
              <Button onClick={() => setFaqModalOpen(false)} type="secondary">
                إلغاء
              </Button>
              <Button
                type="primary"
                htmltype="submit"
                icon={<Save className="w-4 h-4" />}
              >
                حفظ
              </Button>
            </div>
          </Form>
        </Modal>

        {/* ===== KB Modal ===== */}
        <Modal
          title={editingKb ? "تعديل مادة مساعدة" : "إضافة مادة مساعدة"}
          open={kbModalOpen}
          onCancel={() => setKbModalOpen(false)}
          footer={null}
          destroyOnClose
        >
          <Form
            layout="vertical"
            onFinish={onSubmitKb}
            initialValues={
              editingKb || {
                title: "",
                type: "article",
                category: "",
                url: "",
                visible: true,
              }
            }
          >
            <Form.Item
              label="العنوان"
              name="title"
              rules={[{ required: true, message: "اكتب العنوان" }]}
            >
              <Input placeholder="عنوان المادة" />
            </Form.Item>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Item label="النوع" name="type" rules={[{ required: true }]}>
                <Select
                  options={[
                    { value: "article", label: "مقال" },
                    { value: "video", label: "فيديو" },
                  ]}
                />
              </Form.Item>
              <Form.Item
                label="التصنيف"
                name="category"
                rules={[{ required: true, message: "اختر التصنيف" }]}
              >
                <Input placeholder="مثال: الحسابات / الدفع / الواجبات" />
              </Form.Item>
            </div>
            <Form.Item
              label="الرابط (صفحة داخلية أو رابط خارجي)"
              name="url"
              rules={[{ required: true, message: "أدخل رابطًا صحيحًا" }]}
            >
              <Input placeholder="مثال: /help/create-account أو https://..." />
            </Form.Item>
            <Form.Item
              label="منشور على الموقع"
              name="visible"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
            <div className="flex justify-end gap-2">
              <Button onClick={() => setKbModalOpen(false)} type="secondary">
                إلغاء
              </Button>
              <Button
                type="primary"
                htmltype="submit"
                icon={<Save className="w-4 h-4" />}
              >
                حفظ
              </Button>
            </div>
          </Form>
        </Modal>
      </div>
    </PageLayout>
  );
}
