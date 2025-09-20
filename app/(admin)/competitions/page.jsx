"use client";

import React, { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

import PageLayout from "../../../components/layout/PageLayout";
import BreadcrumbsShowcase from "../../../components/ui/BreadCrumbs";
import {
  Award,
  BarChart3,
  Plus,
  MoreVertical,
  Eye,
  EyeOff,
  Edit2,
  Trash2,
  Clock,
  User,
} from "lucide-react";
import PagesHeader from "../../../components/ui/PagesHeader";
import Button from "../../../components/atoms/Button";
import SearchAndFilters from "../../../components/ui/SearchAndFilters";
import {
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  DatePicker,
  message,
  Dropdown,
  Menu,
  Switch,
  Upload,
} from "antd";
import { InboxOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";

const { RangePicker } = DatePicker;
const { Dragger } = Upload;

/* ================= React-Quill (SSR-safe) ================ */
const ReactQuill = dynamic(() => import("react-quill-new").then(m => m.default), {
  ssr: false,
});

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ align: [] }],
    ["link", "blockquote", "code-block"],
    ["clean"],
  ],
};
const quillFormats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "list",
  "bullet",
  "align",
  "link",
  "blockquote",
  "code-block",
];

const RichTextItem = ({ label, name, required, placeholder = "اكتب هنا..." }) => (
  <Form.Item
    label={label}
    name={name}
    rules={required ? [{ required: true, message: `أدخل ${label}` }] : []}
    valuePropName="value"
  >
    {/* @ts-ignore */}
    <ReactQuill theme="snow" modules={quillModules} formats={quillFormats} placeholder={placeholder} />
  </Form.Item>
);

/* ================= Breadcrumbs ================ */
const breadcrumbs = [
  { label: "الرئيسية", href: "/", icon: BarChart3 },
  { label: "المسابقات", icon: Award, href: "#", current: true },
];

/* ================= Tiny bar ================ */
const Bar = ({ value, color = "orange" }) => {
  const c = { blue: "bg-blue-500", orange: "bg-orange-500", red: "bg-rose-500" };
  return (
    <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
      <div className={`h-2 ${c[color] || c.orange}`} style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
  );
};

/* ================= Upload helpers ================ */
const normFile = (e) => (Array.isArray(e) ? e : e?.fileList ?? []);
const fileFromList = (fileList) => fileList?.[0]?.originFileObj ?? null;

export default function CompetitionsPage() {
  const router = useRouter();
  const [mode, setMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("daily");
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [editing, setEditing] = useState(null);

  // seed data, now with rich-text fields
  const [comps, setComps] = useState([
    {
      id: "c-1",
      title: "المسابقة اليومية",
      type: "daily",
      description: "مجموعة سريعة من الأسئلة اليومية لاختبار سرعة البديهة والمعرفة العامة.",
      cover:
        "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?q=80&w=1200&auto=format&fit=crop",
      startAt: dayjs().hour(20).minute(0).second(0).toISOString(),
      endAt: dayjs().add(1, "day").hour(21).minute(0).second(0).toISOString(),
      capacity: 50,
      participants: 15,
      joined: false,
      visible: true,
      ideaHtml: "<p>أسئلة قصيرة تُنشر كل يوم لقياس معلوماتك العامة.</p>",
      prizesHtml: "<ul><li>وسام إنجاز يومي</li><li>نقاط إضافية للمتصدرين</li></ul>",
      startsAtHtml: "<p>تبدأ يوميًا الساعة 8 مساءً</p>",
    },
    {
      id: "c-2",
      title: "المسابقة الأسبوعية",
      type: "weekly",
      description: "اختبار متوسط الطول يستمر حتى نهاية الأسبوع. جوائز خاصة للفائزين!",
      cover:
        "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1200&auto=format&fit=crop",
      startAt: dayjs().day(4).hour(18).minute(0).toISOString(),
      endAt: dayjs().day(7).hour(23).minute(59).toISOString(),
      capacity: 100,
      participants: 62,
      joined: true,
      visible: true,
      ideaHtml: "<p>تحدٍ أسبوعي بموضوع مختلف كل مرة.</p>",
      prizesHtml: "<p><strong>جوائز:</strong> دورات مجانية وكوبونات خصم.</p>",
      startsAtHtml: "<p>تنطلق مساء الخميس وتنتهي الأحد.</p>",
    },
    {
      id: "c-3",
      title: "المسابقة الشهرية",
      type: "monthly",
      description: "تحدي كبير بنظام نقاط وتقييمات، مع جوائز قيمة لأصحاب المراكز الأولى.",
      cover:
        "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1200&auto=format&fit=crop",
      startAt: dayjs().startOf("month").toISOString(),
      endAt: dayjs().endOf("month").toISOString(),
      capacity: 300,
      participants: 230,
      joined: false,
      visible: true,
      ideaHtml: "<p>تراكمي على مدار الشهر بنظام لوحات الصدارة.</p>",
      prizesHtml: "<p>جائزة مالية + شهادات تقدير للثلاثة الأوائل.</p>",
      startsAtHtml: "<p>من اليوم الأول حتى آخر يوم في الشهر.</p>",
    },
  ]);

  /* ============== Derived ============== */
  const filtered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return comps.filter(
      (c) =>
        c.type === activeTab &&
        (c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q))
    );
  }, [comps, searchTerm, activeTab]);

  const timeLeft = (endAt) => {
    const diff = dayjs(endAt).diff(dayjs(), "minute");
    if (diff <= 0) return "انتهت";
    if (diff < 60) return `${diff} د`;
    const h = Math.floor(diff / 60);
    const m = diff % 60;
    return `${h} س ${m} د`;
  };

  const progress = (c) => (c.capacity ? Math.round((c.participants / c.capacity) * 100) : 0);
  const colorByType = (t) => (t === "daily" ? "blue" : t === "weekly" ? "orange" : "red");


  const toggleVisible = (id) =>
    setComps((prev) => prev.map((c) => (c.id === id ? { ...c, visible: !c.visible } : c)));

  const del = (id) => {
    setComps((prev) => {
      const target = prev.find((x) => x.id === id);
      if (target?.cover?.startsWith("blob:")) URL.revokeObjectURL(target.cover);
      return prev.filter((c) => c.id !== id);
    });
    message.success("تم حذف المسابقة");
  };

  /* ============== Add ============== */
  const openAdd = () => {
    form.resetFields();
    setAddOpen(true);
  };
  const submitAdd = async () => {
    try {
      const v = await form.validateFields();
      const [start, end] = v.range || [];
      const fileObj = fileFromList(v.coverFile);
      const preview =
        fileObj
          ? URL.createObjectURL(fileObj)
          : "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?q=80&w=1200&auto=format&fit=crop";

      const item = {
        id: `c-${Date.now()}`,
        title: v.title.trim(),
        type: v.type,
        description: v.description?.trim() || "",
        cover: preview,
        startAt: start?.toISOString(),
        endAt: end?.toISOString(),
        capacity: Number(v.capacity) || 50,
        participants: 0,
        joined: false,
        visible: true,
        // rich text
        startsAtHtml: v.startsAtRich || "",
        prizesHtml: v.prizes || "",
        ideaHtml: v.idea || "",
      };
      setComps((p) => [item, ...p]);
      setAddOpen(false);
      message.success("تم إنشاء المسابقة");
    } catch {}
  };

  /* ============== Edit ============== */
  const openEdit = (c) => {
    setEditing(c);
    editForm.setFieldsValue({
      title: c.title,
      type: c.type,
      description: c.description,
      capacity: c.capacity,
      range: [dayjs(c.startAt), dayjs(c.endAt)],
      visible: c.visible,
      startsAtRich: c.startsAtHtml || "",
      prizes: c.prizesHtml || "",
      idea: c.ideaHtml || "",
    });
    setEditOpen(true);
  };
  const submitEdit = async () => {
    try {
      const v = await editForm.validateFields();
      const [start, end] = v.range || [];
      const fileObj = fileFromList(v.coverFile);

      setComps((prev) =>
        prev.map((c) => {
          if (c.id !== editing.id) return c;
          let newCover = c.cover;
          if (fileObj) {
            if (newCover?.startsWith("blob:")) URL.revokeObjectURL(newCover);
            newCover = URL.createObjectURL(fileObj);
          }
          return {
            ...c,
            title: v.title.trim(),
            type: v.type,
            description: v.description?.trim(),
            capacity: Number(v.capacity) || c.capacity,
            startAt: start?.toISOString(),
            endAt: end?.toISOString(),
            visible: v.visible,
            cover: newCover,
            // rich text
            startsAtHtml: v.startsAtRich || "",
            prizesHtml: v.prizes || "",
            ideaHtml: v.idea || "",
          };
        })
      );

      setEditOpen(false);
      setEditing(null);
      message.success("تم تحديث المسابقة");
    } catch {}
  };

  /* ============== Card Menu ============== */
  const cardMenu = (c) => (
    <Menu
      items={[
        {
          key: "vis",
          label: c.visible ? "إخفاء" : "إظهار",
          icon: c.visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />,
          onClick: () => toggleVisible(c.id),
        },
        { key: "edit", label: "تعديل", icon: <Edit2 className="w-4 h-4" />, onClick: () => openEdit(c) },
        { key: "del", label: "حذف", icon: <Trash2 className="w-4 h-4" />, danger: true, onClick: () => del(c.id) },
        {key:"student", label:"المتصدرين" , icon : <User className="w-4 h-4"/> , onClick : () => router.push(`/competitions/students/${c?.id}`)}
      ]}
    />
  );

  /* ============== Card ============== */
  const CardComp = ({ c }) => (
    <div className="relative rounded-3xl bg-white shadow-xl border border-gray-100 overflow-hidden">
      <div className="relative">
        <img src={c.cover} alt={c.title} className="w-full h-40 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        <div className="absolute top-3 right-3">
          <span
            className={`px-3 py-1 text-xs font-bold rounded-full ${
              c.type === "daily"
                ? "bg-blue-100 text-blue-700"
                : c.type === "weekly"
                ? "bg-orange-100 text-orange-700"
                : "bg-rose-100 text-rose-700"
            }`}
          >
            {c.type === "daily" ? "يومية" : c.type === "weekly" ? "أسبوعية" : "شهرية"}
          </span>
        </div>

        <Dropdown overlay={cardMenu(c)} trigger={["click"]}>
          <button className="absolute top-2 left-2 p-2 rounded-lg bg-white/80 hover:bg-white">
            <MoreVertical className="w-5 h-5 text-gray-700" />
          </button>
        </Dropdown>
      </div>

      <div className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-extrabold text-gray-800">{c.title}</h3>
          <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-700">
            {c.visible ? "ظاهر" : "مخفي"}
          </span>
        </div>

        <p className="text-sm text-gray-600 leading-6">{c.description}</p>

        {/* Rich sections */}
        <div className="prose prose-sm max-w-none" dir="rtl">
          {c.ideaHtml && (
            <>
              <h4 className="font-bold mb-1">فكرتها</h4>
              <div dangerouslySetInnerHTML={{ __html: c.ideaHtml }} />
            </>
          )}
          {c.prizesHtml && (
            <>
              <h4 className="font-bold mt-3 mb-1">الجوائز</h4>
              <div dangerouslySetInnerHTML={{ __html: c.prizesHtml }} />
            </>
          )}
          {c.startsAtHtml && (
            <>
              <h4 className="font-bold mt-3 mb-1">متى تبدأ</h4>
              <div dangerouslySetInnerHTML={{ __html: c.startsAtHtml }} />
            </>
          )}
        </div>

        <div className="flex items-center justify-between text-sm text-gray-600">
          <span className="inline-flex items-center gap-1">
            <Clock className="w-4 h-4 text-gray-500" />
            الوقت المتبقي: <b className="ms-1">{timeLeft(c.endAt)}</b>
          </span>
          <span>
            {c.participants}/{c.capacity} مشارك
          </span>
        </div>

        <Bar value={progress(c)} color={colorByType(c.type)} />
        <div className="text-xs text-gray-500">نسبة الإشغال: {progress(c)}%</div>
      </div>
    </div>
  );

  /* ============== Render ============== */
  return (
    <PageLayout>
      <div style={{ dir: "rtl" }}>
        <BreadcrumbsShowcase variant="pill" items={breadcrumbs} />
        <PagesHeader
          title={"المسابقات"}
          subtitle={"انضم لتحديات يومية وأسبوعية وشهرية"}
          extra={
            <Button onClick={openAdd} icon={<Plus className="w-5 h-5" />} type="primary">
              إضافة مسابقة
            </Button>
          }
        />

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          {[
            { id: "daily", label: "يومية" },
            { id: "weekly", label: "أسبوعية" },
            { id: "monthly", label: "شهرية" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-4 py-2 rounded-xl border transition ${
                activeTab === t.id ? "bg-blue-600 text-white border-blue-600" : "bg-white border-gray-200"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <SearchAndFilters
          mode={mode}
          setMode={setMode}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />

        {/* List/Grid */}
        {filtered.length === 0 ? (
          <div className="text-gray-500 border rounded-xl p-8 text-center mt-4">
            لا توجد مسابقات مطابقة.
          </div>
        ) : mode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-4">
            {filtered.map((c) => (
              <CardComp key={c.id} c={c} />
            ))}
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {filtered.map((c) => (
              <div key={c.id} className="flex items-center gap-4 rounded-2xl border bg-white p-3">
                <img src={c.cover} className="w-28 h-20 object-cover rounded-xl" alt={c.title} />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-gray-800">{c.title}</h4>
                    <span className="text-xs px-2 py-1 rounded-full bg-gray-100">
                      {c.visible ? "ظاهر" : "مخفي"}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 line-clamp-1">{c.description}</div>
                  <div className="flex items-center gap-3 mt-2 text-sm text-gray-600">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {timeLeft(c.endAt)}
                    </span>
                    <span>
                      {c.participants}/{c.capacity} مشارك
                    </span>
                  </div>
                  <div className="mt-2">
                    <Bar value={progress(c)} color={colorByType(c.type)} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Modal */}
        <Modal
          title="إضافة مسابقة"
          open={addOpen}
          onCancel={() => setAddOpen(false)}
          onOk={submitAdd}
          okText="حفظ"
          width={900}
          okButtonProps={{ style: { backgroundColor: "#0ea5e9", borderColor: "#0ea5e9" } }}
          destroyOnClose
        >
          <Form form={form} layout="vertical">
            <Form.Item
              label="العنوان"
              name="title"
              rules={[{ required: true, message: "أدخل العنوان" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="النوع"
              name="type"
              rules={[{ required: true, message: "اختر النوع" }]}
            >
              <Select
                options={[
                  { value: "daily", label: "يومية" },
                  { value: "weekly", label: "أسبوعية" },
                  { value: "monthly", label: "شهرية" },
                ]}
              />
            </Form.Item>

            <Form.Item label="الوصف المختصر" name="description">
              <Input.TextArea rows={3} />
            </Form.Item>

            {/* Cover image (file) */}
            <Form.Item
              label="صورة الغلاف"
              name="coverFile"
              valuePropName="fileList"
              getValueFromEvent={normFile}
              rules={[{ required: true, message: "ارفع صورة الغلاف" }]}
            >
              <Dragger beforeUpload={() => false} maxCount={1} accept="image/*">
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">اسحب الصورة هنا أو اضغط للاختيار</p>
                <p className="ant-upload-hint">لن يتم الرفع الآن — نكتفي بالمعاينة المحلية.</p>
              </Dragger>
            </Form.Item>

            <Form.Item
              label="الفترة"
              name="range"
              rules={[{ required: true, message: "اختر فترة البداية والنهاية" }]}
            >
              <RangePicker showTime className="w-full" />
            </Form.Item>

            <Form.Item
              label="السعة (عدد المشاركين)"
              name="capacity"
              rules={[{ required: true, message: "أدخل السعة" }]}
            >
              <InputNumber min={10} className="w-full" />
            </Form.Item>

            {/* NEW: rich text fields */}
            <RichTextItem label="متى تبدأ" name="startsAtRich" />
            <RichTextItem label="الجوائز" name="prizes" required />
            <RichTextItem label="فكرتها" name="idea" required />
          </Form>
        </Modal>

        {/* Edit Modal */}
        <Modal
          width={900}
          title="تعديل مسابقة"
          open={editOpen}
          onCancel={() => {
            setEditOpen(false);
            setEditing(null);
          }}
          onOk={submitEdit}
          okText="تحديث"
          okButtonProps={{ style: { backgroundColor: "#22c55e", borderColor: "#22c55e" } }}
          destroyOnClose
        >
          <Form form={editForm} layout="vertical">
            <Form.Item
              label="العنوان"
              name="title"
              rules={[{ required: true, message: "أدخل العنوان" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="النوع"
              name="type"
              rules={[{ required: true, message: "اختر النوع" }]}
            >
              <Select
                options={[
                  { value: "daily", label: "يومية" },
                  { value: "weekly", label: "أسبوعية" },
                  { value: "monthly", label: "شهرية" },
                ]}
              />
            </Form.Item>

            <Form.Item label="الوصف المختصر" name="description">
              <Input.TextArea rows={3} />
            </Form.Item>

            {/* optional replace cover */}
            <Form.Item
              label="استبدال صورة الغلاف (اختياري)"
              name="coverFile"
              valuePropName="fileList"
              getValueFromEvent={normFile}
            >
              <Dragger beforeUpload={() => false} maxCount={1} accept="image/*">
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">اسحب صورة جديدة أو اضغط للاختيار</p>
                <p className="ant-upload-hint">اتركه فارغًا إذا كنت تريد الإبقاء على الصورة الحالية.</p>
              </Dragger>
            </Form.Item>

            <Form.Item
              label="الفترة"
              name="range"
              rules={[{ required: true, message: "اختر فترة البداية والنهاية" }]}
            >
              <RangePicker showTime className="w-full" />
            </Form.Item>

            <Form.Item label="السعة" name="capacity">
              <InputNumber min={10} className="w-full" />
            </Form.Item>

            <Form.Item label="إظهار في القائمة" name="visible" valuePropName="checked">
              <Switch />
            </Form.Item>

            {/* NEW: rich text fields (edit) */}
            <RichTextItem label="متى تبدأ" name="startsAtRich" />
            <RichTextItem label="الجوائز" name="prizes" />
            <RichTextItem label="فكرتها" name="idea" />
          </Form>
        </Modal>
      </div>
    </PageLayout>
  );
}
