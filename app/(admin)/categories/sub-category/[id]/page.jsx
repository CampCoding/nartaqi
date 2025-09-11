"use client";
import "@ant-design/v5-patch-for-react-19";
import PageLayout from "@/components/layout/PageLayout";
import BreadcrumbsShowcase from "@/components/ui/BreadCrumbs";
import PagesHeader from "@/components/ui/PagesHeader";
import {
  BarChart3,
  Book,
  Plus,
  Upload,
  Eye,
  EyeOff,
  Edit2,
  Trash2,
  Image as ImageIcon,
  Layers,
  TrendingUp,
} from "lucide-react";
import { useParams } from "next/navigation";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Modal, Form, Input, Switch, message, Tooltip } from "antd";
import { all_categories } from "../../page";

/* ===================== Utils ===================== */
const fileToDataUrl = (file) =>
  new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onload = (e) => res(e.target.result);
    reader.onerror = rej;
    reader.readAsDataURL(file);
  });

/* ===================== Modals ===================== */
function SectionFormModal({
  open,
  title,
  onCancel,
  onSubmit,
  confirmLoading,
  initialValues,
}) {
  const [form] = Form.useForm();
  const [preview, setPreview] = useState(initialValues?.imagePreview || null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (open) {
      form.resetFields();
      form.setFieldsValue({
        name: initialValues?.name || "",
        isVisible: initialValues?.isVisible ?? true,
      });
      setPreview(initialValues?.imagePreview || null);
    }
  }, [open, initialValues, form]);

  const handleChoose = () => fileInputRef.current?.click();

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      message.error("الملف يجب أن يكون صورة");
      return;
    }
    const dataUrl = await fileToDataUrl(file);
    setPreview(dataUrl);
  };

  const handleFinish = (values) => {
    onSubmit({
      name: values.name.trim(),
      isVisible: !!values.isVisible,
      imagePreview: preview || null,
    });
  };

  return (
    <Modal
      title={<div className="text-lg font-semibold text-gray-800">{title}</div>}
      open={open}
      onCancel={onCancel}
      footer={null}
      destroyOnClose
      className="rtl-modal"
      width={600}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish} className="mt-6">
        <Form.Item
          name="name"
          label={<span className="text-sm font-medium text-gray-700">اسم القسم</span>}
          rules={[
            { required: true, message: "يرجى إدخال اسم القسم" },
            { min: 3, message: "يجب أن لا يقل الاسم عن 3 أحرف" },
          ]}
        >
          <Input
            placeholder="أدخل اسم القسم"
            className="h-11 rounded-lg border-gray-300 focus:border-blue-500"
          />
        </Form.Item>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-gray-700">
              صورة القسم
            </label>
            {preview && (
              <button
                type="button"
                onClick={() => setPreview(null)}
                className="text-xs text-red-600 hover:text-red-700 hover:underline transition-colors"
              >
                إزالة الصورة
              </button>
            )}
          </div>

          <div className="space-y-4">
            <button
              type="button"
              onClick={handleChoose}
              className="inline-flex items-center gap-3 px-6 py-3 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 text-gray-600 hover:text-blue-600"
            >
              <Upload size={20} />
              اختيار صورة من الجهاز
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            {preview ? (
              <div className="relative inline-block">
                <img
                  src={preview}
                  alt="معاينة"
                  className="w-32 h-32 object-cover rounded-xl border-2 border-gray-200 shadow-sm"
                />
                <div className="absolute inset-0 bg-black/10 rounded-xl"></div>
              </div>
            ) : (
              <div className="w-32 h-32 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 grid place-items-center">
                <div className="text-center">
                  <ImageIcon size={32} className="text-gray-400 mx-auto mb-2" />
                  <p className="text-xs text-gray-500">معاينة الصورة</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <Form.Item 
          name="isVisible" 
          valuePropName="checked" 
          label={<span className="text-sm font-medium text-gray-700">حالة الظهور</span>}
        >
          <Switch 
            checkedChildren="مرئي" 
            unCheckedChildren="مخفي"
            className="bg-gray-300"
          />
        </Form.Item>

        <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium transition-colors"
          >
            إلغاء
          </button>
          <button
            type="submit"
            disabled={confirmLoading}
            className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 disabled:opacity-60 disabled:cursor-not-allowed font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            {confirmLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                جارٍ الحفظ...
              </div>
            ) : (
              "حفظ القسم"
            )}
          </button>
        </div>
      </Form>
    </Modal>
  );
}

function ConfirmDeleteModal({ open, onCancel, onConfirm, name }) {
  return (
    <Modal
      title={<div className="text-lg font-semibold text-red-600">تأكيد الحذف</div>}
      open={open}
      onCancel={onCancel}
      onOk={onConfirm}
      okText="حذف نهائياً"
      okButtonProps={{ 
        danger: true,
        className: "bg-red-600 hover:bg-red-700 border-red-600 hover:border-red-700 h-10 px-6 font-medium"
      }}
      cancelText="إلغاء"
      cancelButtonProps={{
        className: "h-10 px-6 font-medium"
      }}
      className="rtl-modal"
    >
      <div className="py-4">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <Trash2 size={20} className="text-red-600" />
          </div>
          <div>
            <p className="text-gray-800 font-medium">
              هل تريد حذف القسم <span className="text-red-600 font-bold">"{name}"</span>؟
            </p>
            <p className="text-gray-500 text-sm mt-1">
              سيتم حذف القسم نهائياً ولا يمكن التراجع عن هذا الإجراء.
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
}

/* ===================== Card ===================== */
function SectionCard({ section, onEdit, onToggleVisibility, onDelete }) {
  return (
    <div className="group relative">
      <div
        className={`relative rounded-2xl border-2 bg-white shadow-sm overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${
          section.isVisible 
            ? "border-gray-200 hover:border-blue-300" 
            : "border-gray-300 opacity-75 hover:opacity-90"
        }`}
      >
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-pink-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        {/* Image header with enhanced styling */}
        <div className="relative h-48 bg-gradient-to-br from-gray-100 via-gray-50 to-white overflow-hidden">
          {section.imagePreview ? (
            <>
              <img
                src={section.imagePreview}
                alt={section.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </>
          ) : (
            <div className="w-full h-full grid place-items-center">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 grid place-items-center mb-3 mx-auto">
                  <ImageIcon size={28} className="text-gray-500" />
                </div>
                <p className="text-sm text-gray-500 font-medium">لا توجد صورة</p>
              </div>
            </div>
          )}

          {/* Enhanced visibility badge */}
          {!section.isVisible && (
            <div className="absolute top-4 left-4">
              <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-gray-900/90 text-white font-medium backdrop-blur-sm">
                <EyeOff size={12} />
                مخفي
              </span>
            </div>
          )}

          {/* Enhanced hover actions */}
          <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
            <Tooltip title="تعديل القسم" placement="bottom">
              <button
                onClick={onEdit}
                className="p-2.5 rounded-xl bg-white/95 hover:bg-white text-blue-600 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 backdrop-blur-sm"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            </Tooltip>
            <Tooltip title={section.isVisible ? "إخفاء القسم" : "إظهار القسم"} placement="bottom">
              <button
                onClick={onToggleVisibility}
                className={`p-2.5 rounded-xl bg-white/95 hover:bg-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 backdrop-blur-sm ${
                  section.isVisible ? "text-green-600" : "text-gray-600"
                }`}
              >
                {section.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
            </Tooltip>
            <Tooltip title="حذف القسم" placement="bottom">
              <button
                onClick={onDelete}
                className="p-2.5 rounded-xl bg-white/95 hover:bg-white text-red-600 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 backdrop-blur-sm"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </Tooltip>
          </div>
        </div>

        {/* Enhanced body */}
        <div className="relative p-5">
          <div className="flex items-start justify-between">
            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-bold text-gray-900 truncate group-hover:text-blue-700 transition-colors duration-200">
                {section.name}
              </h3>
              <div className="flex items-center gap-2 mt-2">
                <div className={`w-2 h-2 rounded-full ${section.isVisible ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                <p className="text-sm text-gray-600 font-medium">
                  {section.isVisible ? "مرئي للجميع" : "مخفي حالياً"}
                </p>
              </div>
            </div>

            {/* Mobile actions */}
            <div className="flex items-center gap-1 sm:hidden">
              <button
                onClick={onEdit}
                className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={onToggleVisibility}
                className="p-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
              >
                {section.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
              <button
                onClick={onDelete}
                className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Subtle bottom gradient line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
    </div>
  );
}

/* ===================== Enhanced Stats Card ===================== */
function StatsCard({ icon: Icon, title, value, color = "blue", trend }) {
  const colorClasses = {
    blue: "from-blue-500 to-blue-600 bg-blue-50 text-blue-600",
    green: "from-green-500 to-green-600 bg-green-50 text-green-600",
    purple: "from-purple-500 to-purple-600 bg-purple-50 text-purple-600",
    orange: "from-orange-500 to-orange-600 bg-orange-50 text-orange-600"
  };

  return (
    <div className="group relative rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 overflow-hidden">
      <div className="absolute top-0 right-0 w-20 h-20 rounded-full -translate-y-10 translate-x-10 bg-gradient-to-br opacity-10 transition-opacity group-hover:opacity-20" style={{background: `linear-gradient(135deg, ${colorClasses[color].split(' ')[0].replace('from-', '#')} 0%, ${colorClasses[color].split(' ')[1].replace('to-', '#')} 100%)`}}></div>
      
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp size={14} className="text-green-600" />
              <span className="text-xs text-green-600 font-medium">{trend}</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl bg-gradient-to-br ${colorClasses[color]}`}>
          <Icon size={24} className="text-white" />
        </div>
      </div>
    </div>
  );
}

/* ===================== Page ===================== */
export default function Page() {
  const { id } = useParams();

  const [sections, setSections] = useState(
    [
    { id: 1, name: "أساسيات البرمجة", imagePreview: null, isVisible: true },
    { id: 2, name: "تطوير الويب", imagePreview: null, isVisible: false },
    { id: 3, name: "قواعد البيانات", imagePreview: null, isVisible: true },
    { id: 4, name: "الذكاء الاصطناعي", imagePreview: null, isVisible: true },
  ]);

  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  
  useEffect(() => {
    setSelected(all_categories?.find(item => item?.id == id))
  } , [id])

  const breadcrumbs = [
    { label: "الرئيسية", href: "/", icon: BarChart3 },
    { label: selected?.title ?? "الفئات", href: "/categories", icon: Book },
    { label: "أقسام الفئة", href: "#", icon: Book, current: true },
  ];

  const visibleCount = useMemo(() => sections.filter(s => s.isVisible).length, [sections]);
  const hiddenCount = useMemo(() => sections.filter(s => !s.isVisible).length, [sections]);

  const handleAdd = (payload) => {
    setLoading(true);
    setTimeout(() => {
      setSections((prev) => [
        ...prev,
        {
          id: Date.now(),
          name: payload.name,
          imagePreview: payload.imagePreview,
          isVisible: payload.isVisible,
        },
      ]);
      setLoading(false);
      setAddOpen(false);
      message.success("تم إضافة القسم بنجاح!");
    }, 800);
  };

  const handleEdit = (payload) => {
    if (!selected) return;
    setLoading(true);
    setTimeout(() => {
      setSections((prev) =>
        prev.map((s) =>
          s.id === selected.id
            ? {
                ...s,
                name: payload.name,
                isVisible: payload.isVisible,
                imagePreview: payload.imagePreview ?? s.imagePreview,
              }
            : s
        )
      );
      setLoading(false);
      setEditOpen(false);
      setSelected(null);
      message.success("تم تعديل القسم بنجاح!");
    }, 800);
  };

  const toggleVisibility = (id) => {
    const section = sections.find(s => s.id === id);
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isVisible: !s.isVisible } : s))
    );
    message.success(section?.isVisible ? "تم إخفاء القسم" : "تم إظهار القسم");
  };

  const confirmDelete = () => {
    if (!selected) return;
    setLoading(true);
    setTimeout(() => {
      setSections((prev) => prev.filter((s) => s.id !== selected.id));
      setLoading(false);
      setDeleteOpen(false);
      message.success("تم حذف القسم نهائياً");
      setSelected(null);
    }, 600);
  };
 
    return (
       <PageLayout>
      <div dir="rtl" className="space-y-8 max-w-7xl">
        <BreadcrumbsShowcase variant="pill" items={breadcrumbs} />
        
        <PagesHeader
          title="إدارة أقسام الفئة"
          subtitle={id ? `معرّف الفئة: ${id}` : "تنظيم وإدارة أقسام الفئة التعليمية"}
          extra={
            <button
              onClick={() => setAddOpen(true)}
              className="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 font-medium shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
            >
              <Plus size={20} />
              إضافة قسم جديد
            </button>
          }
        />

        {/* Enhanced Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            icon={Layers}
            title="إجمالي الأقسام"
            value={sections.length}
            color="blue"
            trend="+12% هذا الشهر"
          />
          <StatsCard
            icon={Eye}
            title="الأقسام المعروضة"
            value={visibleCount}
            color="green"
          />
          <StatsCard
            icon={EyeOff}
            title="الأقسام المخفية"
            value={hiddenCount}
            color="orange"
          />
          <StatsCard
            icon={Book}
            title="معدل النشاط"
            value="85%"
            color="purple"
            trend="+5% من الأمس"
          />
        </div>

        {/* Enhanced Sections Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">قائمة الأقسام</h2>
            <div className="text-sm text-gray-500">
              {sections.length} {sections.length === 1 ? 'قسم' : 'أقسام'} إجمالي
            </div>
          </div>
          
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {sections.map((section) => (
              <SectionCard
                key={section.id}
                section={section}
                onEdit={() => {
                  setSelected(section);
                  setEditOpen(true);
                }}
                onToggleVisibility={() => toggleVisibility(section.id)}
                onDelete={() => {
                  setSelected(section);
                  setDeleteOpen(true);
                }}
              />
            ))}
          </div>
        </div>

        {/* Enhanced Empty State */}
        {sections.length === 0 && (
          <div className="text-center py-20">
            <div className="relative inline-block">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 grid place-items-center mb-6 mx-auto">
                <Book size={48} className="text-gray-400" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-blue-500 grid place-items-center">
                <Plus size={16} className="text-white" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">لا توجد أقسام حتى الآن</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              ابدأ بإنشاء أول قسم لتنظيم محتوى الدورات التعليمية وتقسيمها إلى فئات مناسبة
            </p>
            <button
              onClick={() => setAddOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 font-medium transition-colors"
            >
              <Plus size={18} />
              إضافة أول قسم
            </button>
          </div>
        )}

        {/* Modals */}
        <SectionFormModal
          open={addOpen}
          title="إضافة قسم جديد"
          onCancel={() => setAddOpen(false)}
          onSubmit={handleAdd}
          confirmLoading={loading}
          initialValues={{ name: "", isVisible: true, imagePreview: null }}
        />

        <SectionFormModal
          open={editOpen}
          title="تعديل القسم"
          onCancel={() => {
            setEditOpen(false);
            setSelected(null);
          }}
          onSubmit={handleEdit}
          confirmLoading={loading}
          initialValues={selected || { name: "", isVisible: true, imagePreview: null }}
        />

        <ConfirmDeleteModal
          open={deleteOpen}
          onCancel={() => {
            setDeleteOpen(false);
            setSelected(null);
          }}
          onConfirm={confirmDelete}
          name={selected?.name}
        />
        </div>
       </PageLayout>
  );
}