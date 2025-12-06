"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  PlusOutlined,
  BookOutlined,
  FileTextOutlined,
  PlayCircleOutlined,
  CalendarOutlined,
  EditOutlined,
  SaveOutlined,
  FolderOutlined,
} from "@ant-design/icons";
import {
  Form,
  Button,
  message,
  Upload,
  Divider,
  Modal,
} from "antd";
import dayjs from "dayjs";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { subjects } from "../../../../../data/subjects";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
import "react-quill-new/dist/quill.snow.css";
import AddEgyptianCourseBasicInfo from "../../../../../components/EgyptianCourses/AddEgyptianCourseBasicInfo/AddEgyptianCourseBasicInfo";
import AddEgyptianCourseSchedule from "../../../../../components/EgyptianCourses/AddEgyptianCourseSchedule/AddEgyptianCourseSchedule";
import AddEgyptianCourseContent from "../../../../../components/EgyptianCourses/AddEgyptainCourseContent/AddEgyptainCourseContent";
import AddEgyptianCourseResources from "../../../../../components/EgyptianCourses/AddEgyptianCourseResources/AddEgyptianCourseResources";

/********************
 * Categories & Grades
 ********************/
const all_categories = [
  {
    id: 1,
    title: "أبناؤنا في الخارج",
    sections: [
      { id: 1, name: "KG1", isVisible: true },
      { id: 2, name: "KG2", isVisible: true },
      { id: 3, name: "ابتدائي", isVisible: true },
      { id: 4, name: "اعدادي", isVisible: true },
      { id: 5, name: "ثانوي", isVisible: true },
    ],
  },
  {
    id: 2,
    title: "العام",
    sections: [
      { id: 1, name: "ابتدائي", isVisible: true },
      { id: 2, name: "اعدادي", isVisible: true },
      { id: 3, name: "ثانوي", isVisible: true },
    ],
  },
  {
    id: 3,
    title: "الأزهر",
    sections: [
      { id: 1, name: "ابتدائي", isVisible: true },
      { id: 2, name: "اعدادي", isVisible: true },
      { id: 3, name: "ثانوي", isVisible: true },
    ],
  },
  {
    id: 4,
    title: "أقسام اخري",
    sections: [
      { id: 1, name: "مبتدئ", isVisible: true },
      { id: 2, name: "متوسط", isVisible: true },
      { id: 3, name: "متقدم", isVisible: true },
    ],
  },
];

const gradeLevels = {
  ابتدائي: [
    { id: 1, name: "أول ابتدائي (عربي)", value: "first_arabic" },
    { id: 2, name: "أول ابتدائي (لغات)", value: "first_languages" },
    { id: 3, name: "ثاني ابتدائي (عربي)", value: "second_arabic" },
    { id: 4, name: "ثاني ابتدائي (لغات)", value: "second_languages" },
    { id: 5, name: "ثالث ابتدائي (عربي)", value: "third_arabic" },
    { id: 6, name: "ثالث ابتدائي (لغات)", value: "third_languages" },
    { id: 7, name: "رابع ابتدائي (عربي)", value: "fourth_arabic" },
    { id: 8, name: "رابع ابتدائي (لغات)", value: "fourth_languages" },
    { id: 9, name: "خامس ابتدائي (عربي)", value: "fifth_arabic" },
    { id: 10, name: "خامس ابتدائي (لغات)", value: "fifth_languages" },
    { id: 11, name: "سادس ابتدائي (عربي)", value: "sixth_arabic" },
    { id: 12, name: "سادس ابتدائي (لغات)", value: "sixth_languages" },
  ],
  اعدادي: [
    { id: 1, name: "أول إعدادي (عربي)", value: "first_prep_arabic" },
    { id: 2, name: "أول إعدادي (لغات)", value: "first_prep_languages" },
    { id: 3, name: "ثاني إعدادي (عربي)", value: "second_prep_arabic" },
    { id: 4, name: "ثاني إعدادي (لغات)", value: "second_prep_languages" },
    { id: 5, name: "ثالث إعدادي (عربي)", value: "third_prep_arabic" },
    { id: 6, name: "ثالث إعدادي (لغات)", value: "third_prep_languages" },
  ],
  ثانوي: [
    { id: 1, name: "أول ثانوي (عربي)", value: "first_secondary_arabic" },
    { id: 2, name: "أول ثانوي (لغات)", value: "first_secondary_languages" },
    { id: 3, name: "ثاني ثانوي (عربي)", value: "second_secondary_arabic" },
    { id: 4, name: "ثاني ثانوي (لغات)", value: "second_secondary_languages" },
    { id: 5, name: "ثالث ثانوي (عربي)", value: "third_secondary_arabic" },
    { id: 6, name: "ثالث ثانوي (لغات)", value: "third_secondary_languages" },
  ],
  KG1: [
    { id: 1, name: "KG1 (عربي)", value: "kg1_arabic" },
    { id: 2, name: "KG1 (لغات)", value: "kg1_languages" },
  ],
  KG2: [
    { id: 1, name: "KG2 (عربي)", value: "kg2_arabic" },
    { id: 2, name: "KG2 (لغات)", value: "kg2_languages" },
  ],
  default: [],
};

/********************
 * Quill Helpers
 ********************/
const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ align: ["", "center", "right", "justify"] }],
    [{ direction: "rtl" }],
    [{ color: [] }, { background: [] }],
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
  "align",
  "direction",
  "color",
  "background",
  "link",
  "blockquote",
  "code-block",
];

const RichTextField = ({ value, onChange, placeholder, readOnly = false }) => (
  <div dir="rtl" className="rich-text-field">
    <ReactQuill
      className="ql-rtl"
      theme="snow"
      value={value}
      onChange={(html) => onChange?.(html)}
      modules={readOnly ? { toolbar: false } : quillModules}
      formats={quillFormats}
      placeholder={placeholder}
      readOnly={readOnly}
      style={{ minHeight: "120px" }}
    />
  </div>
);

// Helper: convert file -> base64 (cover image preview)
const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });

/********************
 * Edit Page Component
 ********************/
const Page = () => {
  const { id } = useParams(); // نتوقع أن يكون id = code
  const [form] = Form.useForm();

  // UI State
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(1);
  const [isEditing, setIsEditing] = useState(false);

  // Media/files state
  const [fileList, setFileList] = useState([]);
  const [fileNames, setFileNames] = useState({}); // uid -> custom name
  const [imagePreview, setImagePreview] = useState(null);

  // Hierarchy selections
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [availableSections, setAvailableSections] = useState([]);
  const [availableGrades, setAvailableGrades] = useState([]);

  // Content
  const [videos, setVideos] = useState([{ id: 1, name: "", url: "" }]);

  // Schedules
  const [schedules, setSchedules] = useState([]);
  const [newSchedule, setNewSchedule] = useState({
    day: "",
    date: "",
    startTime: null,
    endTime: null,
    maxStudents: 30,
    isActive: true,
  });

  // Existing row data
  const [rowData, setRowData] = useState({});

  // ---------- Load Existing Course ----------
  useEffect(() => {
    const subject = subjects?.find((item) => String(item?.code) === String(id));
    if (!subject) return;

    setRowData(subject);

    // Try resolve initial selection ids by title/name matching
    const resolvedCategoryId = (() => {
      if (!subject.category && !subject.categoryTitle) return null;
      const title = subject.categoryTitle || subject.category;
      const cat = all_categories.find((c) => c.title === title);
      return cat?.id ?? null;
    })();

    const resolvedSectionId = (() => {
      if (!resolvedCategoryId) return null;
      const cat = all_categories.find((c) => c.id === resolvedCategoryId);
      if (!cat) return null;
      if (typeof subject.section === "number") {
        return subject.section; // assume id
      }
      if (typeof subject.section === "string") {
        const sec = cat.sections.find((s) => s.name === subject.section);
        return sec?.id ?? null;
      }
      return null;
    })();

    setSelectedCategory(resolvedCategoryId);
    setSelectedSection(resolvedSectionId);
    setAvailableSections(
      resolvedCategoryId
        ? all_categories
            .find((c) => c.id === resolvedCategoryId)
            ?.sections.filter((s) => s.isVisible) || []
        : []
    );

    // Available grades
    const resolvedSectionName = availableSections.find((s) => s.id === resolvedSectionId)?.name;
    setAvailableGrades(
      resolvedSectionName && gradeLevels[resolvedSectionName]
        ? gradeLevels[resolvedSectionName]
        : gradeLevels.default
    );

    // Prefill form values
    form.setFieldsValue({
      code: subject.code,
      name: subject.name,
      category: resolvedCategoryId ?? null,
      section: resolvedSectionId ?? null,
      grade: subject.grade ?? null,
      price: subject.price,
      duration: subject.duration,
      description: subject.description,
      status: subject.status ?? "نشط",
      genderPolicy: subject.genderPolicy ?? "both",
      capacity: subject.capacity ?? 50,
      instructor: subject.instructor ?? [],
      availableRange: subject.availableFrom && subject.availableTo
        ? [dayjs(subject.availableFrom), dayjs(subject.availableTo)]
        : undefined,
      summary: subject.summary ?? "",
      privacy: subject.privacy ?? "",
      benefits: subject.benefits ?? "",
      resources: subject.resources || {},
    });

    // Existing schedules & videos
    if (Array.isArray(subject.schedules)) setSchedules(subject.schedules);
    if (subject.resources?.videos) setVideos(subject.resources.videos);

    // Cover image preview if exists
    if (subject.imageUrl) {
      setImagePreview(subject.imageUrl);
      setFileList([
        {
          uid: "__cover__",
          name: "cover",
          status: "done",
          url: subject.imageUrl,
        },
      ]);
    }
  }, [id]);

  // ---------- React to category/section changes ----------
  useEffect(() => {
    if (selectedCategory) {
      const cat = all_categories.find((c) => c.id === selectedCategory);
      setAvailableSections(cat ? cat.sections.filter((s) => s.isVisible) : []);
    } else {
      setAvailableSections([]);
    }
    // Reset section & grades if category changed manually
    setSelectedSection(null);
    setAvailableGrades([]);
  }, [selectedCategory]);

  useEffect(() => {
    if (selectedSection && availableSections.length) {
      const sec = availableSections.find((s) => s.id === selectedSection);
      const grades = sec && gradeLevels[sec.name] ? gradeLevels[sec.name] : gradeLevels.default;
      setAvailableGrades(grades);
    } else {
      setAvailableGrades([]);
    }
  }, [selectedSection, availableSections]);

  // ---------- Media & Upload ----------
  const beforeUpload = async (file) => {
    const isImage = file.type?.startsWith("image/");
    if (!isImage) {
      message.error("من فضلك ارفع ملف صورة فقط.");
      return Upload.LIST_IGNORE;
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error("حجم الصورة يجب أن يكون أقل من 5MB.");
      return Upload.LIST_IGNORE;
    }

    const preview = await getBase64(file);
    setImagePreview(preview);
    setFileList([
      {
        uid: file.uid || file.name,
        name: file.name,
        status: "done",
        originFileObj: file,
      },
    ]);
    return false;
  };

  // ---------- Schedule Handlers ----------
  const handleAddSchedule = () => {
    if (newSchedule.date && newSchedule.startTime && newSchedule.endTime) {
      const schedule = {
        ...newSchedule,
        startTime: newSchedule.startTime.format("HH:mm"),
        endTime: newSchedule.endTime.format("HH:mm"),
      };
      setSchedules([...schedules, schedule]);
      setNewSchedule({
        day: "",
        startTime: null,
        endTime: null,
        maxStudents: 30,
        isActive: true,
      });
      message.success("تم إضافة الجدولة بنجاح!");
    } else {
      message.error("يجب إدخال جميع البيانات المطلوبة.");
    }
  };

  const handleUpdateSchedule = (index, updated) => {
    const list = [...schedules];
    list[index] = {
      ...updated,
      startTime: updated.startTime?.format ? updated.startTime.format("HH:mm") : updated.startTime,
      endTime: updated.endTime?.format ? updated.endTime.format("HH:mm") : updated.endTime,
    };
    setSchedules(list);
    message.success("تم تحديث الجدولة بنجاح!");
  };

  const handleRemoveSchedule = (index) => {
    const list = [...schedules];
    list.splice(index, 1);
    setSchedules(list);
    message.success("تم حذف الجدولة بنجاح!");
  };

  // ---------- Save ----------
  const handleFinish = async () => {
    setLoading(true);
    try {
      const raw = form.getFieldsValue(true);

      const payload = {
        ...rowData,
        code: raw.code?.toUpperCase() || rowData.code,
        imageUrl: imagePreview || rowData.imageUrl,
        name: raw.name?.trim() || rowData.name,
        category: raw.category ?? rowData.category, // category id
        section: raw.section ?? rowData.section, // section id
        grade: raw.grade ?? rowData.grade,
        price: Number(raw.price ?? rowData.price ?? 0),
        duration: raw.duration?.trim() ?? rowData.duration,
        description: raw.description?.trim() ?? rowData.description,
        status: raw.status ?? rowData.status,
        genderPolicy: raw.genderPolicy ?? rowData.genderPolicy,
        capacity: Number(raw.capacity ?? rowData.capacity ?? 0),
        instructor: raw.instructor ?? rowData.instructor,
        availableFrom: raw.availableRange?.[0]
          ? dayjs(raw.availableRange[0]).format("YYYY-MM-DD")
          : rowData.availableFrom,
        availableTo: raw.availableRange?.[1]
          ? dayjs(raw.availableRange[1]).format("YYYY-MM-DD")
          : rowData.availableTo,
        summary: raw.summary ?? rowData.summary,
        privacy: raw.privacy ?? rowData.privacy,
        benefits: raw.benefits ?? rowData.benefits,
        schedules: schedules.length ? schedules : rowData.schedules,
        resources: {
          files: (raw.resources?.files || []).map((f) => ({
            uid: f.uid,
            name: fileNames[f.uid] ?? f.name,
            originName: f.name,
            type: f.type,
          })),
          telegram: raw.resources?.telegram || rowData.resources?.telegram,
          whatsapp: raw.resources?.whatsapp || rowData.resources?.whatsapp,
          videos: (videos || [])
            .filter((v) => v.url?.trim())
            .map((v) => ({ name: v.name?.trim() || "", url: v.url.trim() })),
        },
      };

      // Simulate API
      await new Promise((r) => setTimeout(r, 1000));
      console.log("[Edit] Payload:", payload);
      message.success("تم تحديث الدورة بنجاح!");
      setIsEditing(false);
    } catch (e) {
      console.error(e);
      message.error("فشل تحديث الدورة. حاول مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    form.resetFields();
    setFileList([]);
    setImagePreview(null);
    setSelectedCategory(null);
    setSelectedSection(null);
    setAvailableSections([]);
    setAvailableGrades([]);
    setSchedules([]);
    setNewSchedule({
      day: "",
      startTime: null,
      endTime: null,
      maxStudents: 30,
      isActive: true,
    });
    setIsEditing(false);
  };

  // ---------- UI Tabs ----------
  const tabItems = [
    { key: 1, label: "المعلومات الأساسية", icon: <BookOutlined /> },
    { key: 2, label: "الجدولة والمواعيد", icon: <CalendarOutlined /> },
    { key: 3, label: "المحتوى التفصيلي", icon: <FileTextOutlined /> },
    { key: 4, label: "المصادر والملفات", icon: <FolderOutlined /> },
  ];

  return (
    <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 min-h-[80vh]" dir="rtl">
      {/* Header */}
      <div className="relative mb-8 p-6 bg-white rounded-2xl shadow-sm border-b-4 border-b-blue-500">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full -translate-y-16 translate-x-16" />
        <div className="relative flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
              <EditOutlined className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-blue-800 bg-clip-text text-transparent">
                تعديل الدورة: {rowData?.name || "—"}
              </h1>
              <p className="text-gray-600 mt-1">تعديل الدورة التعليمية مع تحديث الجدولة والمحتوى</p>
            </div>
          </div>

          <div className="flex gap-2">
            {!isEditing && (
              <Button type="primary" icon={<EditOutlined />} onClick={() => setIsEditing(true)} className="rounded-xl">
                تمكين التعديل
              </Button>
            )}
            {isEditing && (
              <>
                <Button onClick={handleReset} className="rounded-xl">إلغاء</Button>
                <Button type="primary" icon={<SaveOutlined />} onClick={() => form.submit()} loading={loading} className="rounded-xl">
                  حفظ التغييرات
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center gap-2 mt-4">
          {tabItems.map((tab) => (
            <div
              key={tab.key}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                activeTab === tab.key
                  ? "bg-blue-100 text-blue-700 border border-blue-200"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <Form form={form} layout="vertical" onFinish={handleFinish} className="p-8">
          {/* Tab 1: Basic Info */}
          {activeTab === 1 && (
            <AddEgyptianCourseBasicInfo
              all_categories={all_categories}
              availableSections={availableSections}
              availableGrades={availableGrades}
              beforeUpload={beforeUpload}
              fileList={fileList}
              selectedCategory={selectedCategory}
              selectedSection={selectedSection}
              setFileList={setFileList}
              setImagePreview={setImagePreview}
              setSelectedCategory={setSelectedCategory}
              setSelectedSection={setSelectedSection}
              isEditing={isEditing}
            />
          )}

          {/* Tab 2: Schedule */}
          {activeTab === 2 && (
            <AddEgyptianCourseSchedule
              handleAddSchedule={handleAddSchedule}
              handleRemoveSchedule={handleRemoveSchedule}
              handleUpdateSchedule={handleUpdateSchedule}
              newSchedule={newSchedule}
              schedules={schedules}
              setNewSchedule={setNewSchedule}
              isEditing={isEditing}
            />
          )}

          {/* Tab 3: Content */}
          {activeTab === 3 && (
            <div className="space-y-8">
              <div className="rounded-2xl p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <FileTextOutlined className="text-green-600" />
                  المحتوى التفصيلي للدورة
                </h3>

                <Form.Item label={<span className="font-semibold text-gray-700">ملخص الدورة</span>} name="summary">
                  <RichTextField placeholder="اكتب ملخصاً شاملاً للدورة يتضمن الأهداف التعليمية والمخرجات المتوقعة..." readOnly={!isEditing} />
                </Form.Item>

                <Form.Item label={<span className="font-semibold text-gray-700">الشروط والأحكام</span>} name="privacy">
                  <RichTextField placeholder="حدد الشروط والأحكام الخاصة بالدورة..." readOnly={!isEditing} />
                </Form.Item>

                <Form.Item label={<span className="font-semibold text-gray-700">مميزات الدورة</span>} name="benefits">
                  <RichTextField placeholder={"اكتب مميزات الدورة ...."} readOnly={!isEditing} />
                </Form.Item>

                <Divider />

                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <PlayCircleOutlined className="text-blue-600" />
                    المحتوى التعليمي
                  </h4>
                  <p className="text-gray-600 mb-4">يمكنك تعديل المحتوى التعليمي التفصيلي (الدروس، الفيديوهات، الاختبارات)</p>
                  <AddEgyptianCourseContent courseId={id} onContentAdded={(content) => console.log("Content updated:", content)} isEditing={isEditing} />
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Resources */}
          {activeTab === 4 && (
            <AddEgyptianCourseResources setVideos={setVideos} videos={videos} isEditing={isEditing} />
          )}

          {/* Navigation & Actions */}
          {isEditing && (
            <div className="flex items-center justify-between pt-8 border-t border-gray-200">
              <div className="flex items-center gap-3">
                {activeTab > 1 && (
                  <Button size="large" onClick={() => setActiveTab(activeTab - 1)} className="rounded-xl" icon={<span>←</span>}>
                    السابق
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-3">
                {activeTab < 4 ? (
                  <Button type="primary" size="large" onClick={() => setActiveTab(activeTab + 1)} className="rounded-xl !bg-blue-500" icon={<span>→</span>}>
                    التالي
                  </Button>
                ) : (
                  <Button type="primary" size="large" htmltype="submit" loading={loading} className="rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800" icon={<SaveOutlined />}>
                    حفظ التغييرات
                  </Button>
                )}
              </div>
            </div>
          )}
        </Form>
      </div>
    </div>
  );
};

export default Page;
