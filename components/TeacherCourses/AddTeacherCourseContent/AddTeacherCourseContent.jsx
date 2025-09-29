"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Clock3, ListChecks, Target, Eye, EyeOff } from "lucide-react";
import {
  Button,
  Card,
  Collapse,
  DatePicker,
  Divider,
  Empty,
  Form,
  Input,
  Modal,
  Radio,
  Select,
  Space,
  Switch,
  Tag,
  TimePicker,
  Tooltip,
  message,
} from "antd";
import dayjs from "dayjs";
import AddCourseLevelModal from "./AddCourseLevelModal";
import BasicLevel from "./BasicLevel";
import AddCourseLessonModal from "./AddCourseLessonModal";
import LecturesContent from "./LecturesContent";

/** التبويبات */
const TABS = [
  { id: 1, key: "foundation", title: "مرحلة التأسيس" },
  { id: 2, key: "live", title: "المحاضرات " },
  { id: 3, key: "exams", title: "اختبارات" },
];

/** مصادر الفيديو */
const VIDEO_SOURCES = [
  { value: "url", label: "رابط (YouTube/Vimeo…)" },
  { value: "file", label: "رفع ملف من الجهاز" },
];

/** تخزين محلي (مع ترحيل) */
const STORAGE_KEY = "course_content_v3";
const loadState = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};
const saveState = (state) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
};

/** تطبيع رفع الملفات */
const normFile = (e) => (Array.isArray(e) ? e : e?.fileList ?? []);
const beforeUploadVideo = () => false;
const beforeUploadPdf = () => false;

const ExamTypeTag = ({ t }) =>
  t === "mock" ? <Tag color="purple">اختبار محاكي</Tag> : <Tag color="cyan">تدريب</Tag>;

/* ================== Exam Library (shared) ================== */
const EXAM_LIBRARY_KEY = "exam_library_v1";

const loadExamLibrary = () => {
  try {
    const raw = localStorage.getItem(EXAM_LIBRARY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

/** 🌱 داتا تجريبية للاختبارات (تُحفظ مرة واحدة عند أول تحميل) */
const seedExamLibraryIfEmpty = () => {
  const current = loadExamLibrary();
  if (Array.isArray(current) && current.length > 0) return;

  const dummy = [
    {
      id: "ex-lib-1",
      title: "اختبار الرياضيات الشامل",
      type: "intern", // ستُعرض كتدريب
      duration: 90,
      questionsCount: 40,
      status: "active",
    },
    {
      id: "ex-lib-2",
      title: "اختبار العلوم — فيزياء وكيمياء",
      examType: "mock",
      duration: 120,
      questionsCount: 30,
      status: "draft",
    },
    {
      id: "ex-lib-3",
      name: "اختبار التاريخ المعاصر", // name بدلاً من title (لاختبار التطبيع)
      type: "intern",
      duration: 60,
      questions: Array.from({ length: 25 }, (_, i) => ({ id: i + 1 })),
      status: "completed",
    },
    {
      id: "ex-lib-4",
      title: "اختبار اللغة العربية",
      examType: "mock",
      duration: 75,
      questionsCount: 20,
      status: "expired",
    },
  ];

  try {
    localStorage.setItem(EXAM_LIBRARY_KEY, JSON.stringify(dummy));
  } catch {}
};

/** تطبيع بيانات الاختبار القادمة من صفحة الإنشاء/الإدارة إلى الشكل المطلوب هنا */
const normalizeLibraryExam = (e) => ({
  id: e?.id ?? e?._id ?? `lib-${Date.now()}`,
  title: e?.title ?? e?.name ?? "بدون عنوان",
  examType: e?.examType ?? e?.type ?? "training", // "training" | "mock" | "intern"
  duration: Number(e?.duration ?? e?.time ?? 0) || 0,
  questions: Array.isArray(e?.questions)
    ? e.questions.length
    : Number(e?.questionsCount ?? e?.questions ?? 0) || 0,
  status: e?.status ?? "مسودة",
  visible: true,
});

/** === Helpers for release logic === */
const isReleased = (ts) => {
  if (!ts) return true; // لو ما اتحددش موعد ظهور، يعتبر ظاهر
  return dayjs().isAfter(dayjs(ts));
};

export default function AddTeacherCourseContent() {
  const [activeTab, setActiveTab] = useState(1);

  /** ====== المراحل ← الدروس ====== */
  const [foundationStages, setFoundationStages] = useState([
    {
      id: "stg-1",
      title: "مرحلة التأسيس",
      visible: true,
      lessons: [
        {
          id: "L-1",
          title: "مقدمة التأسيس",
          visible: true,
          releaseAt: dayjs().add(1, "day").hour(8).minute(0).second(0).toISOString(),
          lessonVideo: {
            title: "تعريف بالمقرر",
            source: "url",
            url: "https://youtu.be/xxxxx",
          },
          training: {
            video: {
              title: "تدريب سريع",
              source: "url",
              url: "https://youtu.be/yyyyy",
            },
            pdfs: [{ id: "p1", title: "ملخص الدرس", fileList: [] }],
          },
        },
      ],
    },
  ]);

  /** ====== محاضرات مباشرة ====== */
  const [liveLectures, setLiveLectures] = useState([
    {
      id: "ls1",
      title: "قسم محاضرات — الوحدة 1",
      visible: true,
      items: [
        {
          id: "lv1",
          title: "مراجعة الوحدة الأولى",
          startAt: dayjs().add(2, "day").hour(19).minute(0).second(0).toISOString(),
          releaseAt: dayjs().add(2, "day").hour(19).minute(0).second(0).toISOString(), // افتراضيًا يساوي startAt
          duration: 60,
          meetingUrl: "#",
          locked: false,
          visible: true,
        },
      ],
    },
  ]);

  /** ====== اختبارات داخل هذا المقرر ====== */
  const [exams, setExams] = useState([
    {
      id: 1,
      title: "اختبار تأسيس — رقم 1",
      examType: "training",
      duration: 45,
      questions: 15,
      status: "مسودة",
      visible: true,
      releaseAt: dayjs().add(3, "day").hour(9).minute(0).second(0).toISOString(),
    },
  ]);

  const setLessonReleaseAt = (stageId, lessonId, dtOrNull) => {
    setFoundationStages((prev) =>
      prev.map((st) =>
        st.id !== stageId
          ? st
          : {
              ...st,
              lessons: (st.lessons || []).map((l) =>
                l.id !== lessonId
                  ? l
                  : {
                      ...l,
                      releaseAt: dtOrNull ? dayjs(dtOrNull).toISOString() : undefined,
                    }
              ),
            }
      )
    );
  };

  const setStageReleaseAt = (stageId, v) => {
    setFoundationStages((prev) =>
      prev.map((st) =>
        st.id === stageId ? { ...st, releaseAt: v ? dayjs(v).toISOString() : undefined } : st
      )
    );
  };

  /** ✅ جديد: جدولة لكل اختبار على حدة */
  const setExamReleaseAt = (examId, dtOrNull) => {
    setExams((prev) =>
      prev.map((e) =>
        String(e.id) === String(examId)
          ? { ...e, releaseAt: dtOrNull ? dayjs(dtOrNull).toISOString() : undefined }
          : e
      )
    );
  };

  /** ====== مكتبة الاختبارات (مشتركة) ====== */
  const [examLibrary, setExamLibrary] = useState([]);
  const [openPickExam, setOpenPickExam] = useState(false);
  const [pickForm] = Form.useForm();

  /** ====== التحميل/الحفظ المحلي + ترحيل من v2 (إن وجِد) ====== */
  useEffect(() => {
    const saved = loadState();
    if (saved) {
      if (Array.isArray(saved.foundationStages)) {
        setFoundationStages(saved.foundationStages);
      } else if (Array.isArray(saved.foundationLessons)) {
        setFoundationStages([
          {
            id: "stg-migrated",
            title: "مرحلة التأسيس",
            visible: true,
            lessons: saved.foundationLessons,
          },
        ]);
      }
      if (Array.isArray(saved.liveLectures)) setLiveLectures(saved.liveLectures);
      if (Array.isArray(saved.exams)) setExams(saved.exams);
    }
  }, []);

  useEffect(() => {
    saveState({ foundationStages, liveLectures, exams });
  }, [foundationStages, liveLectures, exams]);

  // 🌱 Seed + تحميل مكتبة الاختبارات + الاستماع لتغييراتها من تبويب/صفحة أخرى
  useEffect(() => {
    seedExamLibraryIfEmpty();
    setExamLibrary(loadExamLibrary());
    const onStorage = (e) => {
      if (e.key === EXAM_LIBRARY_KEY) setExamLibrary(loadExamLibrary());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  /** ====== إحصاءات سريعة ====== */
  const stats = useMemo(() => {
    const stageCount = foundationStages.length;
    const lessonCount = foundationStages.reduce((s, st) => s + (st.lessons?.length || 0), 0);
    const liveItems = liveLectures.flatMap((s) => s.items || []);
    const liveUpcoming = liveItems.filter((l) => dayjs(l.startAt).isAfter(dayjs())).length;
    return { stageCount, lessonCount, liveUpcoming, examsCount: exams.length };
  }, [foundationStages, liveLectures, exams]);

  /** ====== المودالات + النماذج ====== */
  const [openAddStage, setOpenAddStage] = useState(false);
  const [openAddLesson, setOpenAddLesson] = useState(false);
  const [openAddLive, setOpenAddLive] = useState(false);
  const [openAddExam, setOpenAddExam] = useState(false);

  const [stageForm] = Form.useForm();
  const [lessonForm] = Form.useForm();
  const [liveForm] = Form.useForm();
  const [examForm] = Form.useForm();

  const [savingStage, setSavingStage] = useState(false);
  const [savingLesson, setSavingLesson] = useState(false);
  const [savingLive, setSavingLive] = useState(false);
  const [savingExam, setSavingExam] = useState(false);

  /** ====== عمليات المرحلة/الدرس ====== */
  const toggleStageVisibility = (stageId) => {
    setFoundationStages((prev) => prev.map((st) => (st.id === stageId ? { ...st, visible: !st.visible } : st)));
  };
  const deleteStage = (stageId) => {
    setFoundationStages((prev) => prev.filter((st) => st.id !== stageId));
  };

  const toggleLessonVisibility = (stageId, lessonId) => {
    setFoundationStages((prev) =>
      prev.map((st) =>
        st.id === stageId
          ? {
              ...st,
              lessons: (st.lessons || []).map((l) => (l.id === lessonId ? { ...l, visible: !l.visible } : l)),
            }
          : st
      )
    );
  };

  const deleteLesson = (stageId, lessonId) => {
    setFoundationStages((prev) =>
      prev.map((st) =>
        st.id === stageId ? { ...st, lessons: (st.lessons || []).filter((l) => l.id !== lessonId) } : st
      )
    );
  };

  /** ====== حفظ مرحلة جديدة ====== */
  const submitStage = async () => {
    try {
      setSavingStage(true);
      const v = await stageForm.validateFields();
      const stage = {
        id: `stg-${Date.now()}`,
        title: v.title.trim(),
        visible: true,
        lessons: [],
      };
      setFoundationStages((prev) => [stage, ...prev]);
      setOpenAddStage(false);
      stageForm.resetFields();
      message.success("تم إضافة المرحلة");
    } catch {
      // handled by antd
    } finally {
      setSavingStage(false);
    }
  };

  /** ====== حفظ درس ضمن مرحلة (جديدة أو موجودة) ====== */
  const submitLesson = async () => {
    try {
      setSavingLesson(true);
      const v = await lessonForm.validateFields();

      // إنشاء/تحديد المرحلة المستهدفة
      let stageId = v.stageId;
      if (v.stageMode === "new") {
        stageId = `stg-${Date.now()}`;
        setFoundationStages((prev) => [
          {
            id: stageId,
            title: v.stageTitle.trim(),
            visible: true,
            lessons: [],
          },
          ...prev,
        ]);
      }

      // تكوين الدرس
      const lesson = {
        id: `L-${Date.now()}`,
        title: v.title.trim(),
        visible: true,
        releaseAt: v.lessonReleaseAt ? dayjs(v.lessonReleaseAt).toISOString() : undefined, // جديد: موعد ظهور اختياري
        lessonVideo: {
          title: v.lessonVideoTitle.trim(),
          source: v.lessonVideoSource,
          ...(v.lessonVideoSource === "url"
            ? { url: v.lessonVideoUrl.trim() }
            : { fileList: v.lessonVideoFile ?? [] }),
        },
        training: {
          video: {
            title: v.trainingVideoTitle.trim(),
            source: v.trainingVideoSource,
            ...(v.trainingVideoSource === "url"
              ? { url: v.trainingVideoUrl.trim() }
              : { fileList: v.trainingVideoFile ?? [] }),
          },
          pdfs: (v.pdfs || []).map((p, idx) => ({
            id: `pdf-${Date.now()}-${idx}`,
            title: p.title.trim(),
            fileList: p.fileList || [],
          })),
        },
      };

      // إدراج الدرس داخل المرحلة المستهدفة
      setFoundationStages((prev) =>
        prev.map((st) => (st.id === stageId ? { ...st, lessons: [lesson, ...(st.lessons || [])] } : st))
      );

      setOpenAddLesson(false);
      lessonForm.resetFields();
      message.success("تم إضافة الدرس إلى المرحلة");
    } catch {
      // handled by antd
    } finally {
      setSavingLesson(false);
    }
  };

  /** ====== محاضرات مباشرة ====== */
  const combineDT = (date, time) =>
    dayjs(date).hour(dayjs(time).hour()).minute(dayjs(time).minute()).second(0).toISOString();

  const toggleLiveSectionVisibility = (sectionId) => {
    setLiveLectures((prev) => prev.map((s) => (s.id === sectionId ? { ...s, visible: !s.visible } : s)));
  };
  const toggleLiveItemVisibility = (sectionId, itemId) => {
    setLiveLectures((prev) =>
      prev.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              items: (s.items || []).map((i) => (i.id === itemId ? { ...i, visible: !i.visible } : i)),
            }
          : s
      )
    );
  };
  const deleteLiveSession = (sectionId, itemId) => {
    setLiveLectures((prev) =>
      prev.map((s) => (s.id === sectionId ? { ...s, items: (s.items || []).filter((i) => i.id !== itemId) } : s))
    );
  };

  const submitLive = async () => {
    try {
      setSavingLive(true);
      const v = await liveForm.validateFields();

      let sectionId = v.sectionId;
      if (v.sectionMode === "new") {
        sectionId = `ls-${Date.now()}`;
        setLiveLectures((prev) => [{ id: sectionId, title: v.sectionTitle, visible: true, items: [] }, ...prev]);
      }

      const sessions = (v.sessions || []).map((s, i) => {
        const startAt = combineDT(s.date, s.time);
        return {
          id: `lv-${Date.now()}-${i}`,
          title: s.title,
          startAt,
          releaseAt: s.releaseAt ? dayjs(s.releaseAt).toISOString() : startAt, // جديد: releaseAt قابل للتعديل
          duration: s.duration ? Number(s.duration) : undefined,
          meetingUrl: (s.meetingUrl || "").trim() || "#",
          locked: !!s.locked,
          visible: true,
        };
      });

      setLiveLectures((prev) =>
        prev.map((sec) => (sec.id === sectionId ? { ...sec, items: [...sessions, ...(sec.items || [])] } : sec))
      );

      message.success("تم حفظ المحاضرات داخل القسم");
      setOpenAddLive(false);
      liveForm.resetFields();
    } catch {
      // handled by antd
    } finally {
      setSavingLive(false);
    }
  };

  /** ====== ملفات التدريب (PDFs) داخل الدروس ====== */
  const addTrainingFiles = (stageId, lessonId, files) => {
    setFoundationStages((prev) =>
      prev.map((s) =>
        s.id !== stageId
          ? s
          : {
              ...s,
              lessons: s.lessons.map((l) => {
                if (l.id !== lessonId) return l;
                const nextPdfs = [...(l.training?.pdfs || [])];
                files.forEach((file) => {
                  nextPdfs.push({
                    id: crypto?.randomUUID?.() || Date.now() + Math.random(),
                    title: file.name.replace(/\.pdf$/i, ""),
                    source: "upload",
                    file,
                  });
                });
                return {
                  ...l,
                  training: {
                    ...(l.training || {}),
                    pdfs: nextPdfs,
                  },
                };
              }),
            }
      )
    );
  };

  const removeTrainingFile = (stageId, lessonId, fileKey) => {
    setFoundationStages((prev) =>
      prev.map((s) =>
        s.id !== stageId
          ? s
          : {
              ...s,
              lessons: s.lessons.map((l) => {
                if (l.id !== lessonId) return l;
                const list = [...(l.training?.pdfs || [])];
                const idx = list.findIndex((f) => (f.id ?? -1) === fileKey);
                const final = idx >= 0 ? list.filter((_, i) => i !== idx) : list.filter((_, i) => i !== fileKey);
                return {
                  ...l,
                  training: { ...(l.training || {}), pdfs: final },
                };
              }),
            }
      )
    );
  };

  /** ====== اختبارات داخل هذا المقرر ====== */
  const toggleExamVisibility = (id) => {
    setExams((prev) => prev.map((e) => (String(e.id) === String(id) ? { ...e, visible: !e.visible } : e)));
  };

  const submitExam = async () => {
    try {
      setSavingExam(true);
      const v = await examForm.validateFields();
      const entity = {
        id: `ex-${Date.now()}`,
        title: v.title,
        examType: v.examType,
        duration: Number(v.duration),
        questions: Number(v.questions),
        status: "مسودة",
        visible: true,
        releaseAt: v.releaseAt ? dayjs(v.releaseAt).toISOString() : undefined, // جديد
      };
      setExams((p) => [entity, ...p]);
      setOpenAddExam(false);
      examForm.resetFields();
      message.success("تم حفظ الاختبار");
    } catch {
      // handled by antd
    } finally {
      setSavingExam(false);
    }
  };

  /** ====== ربط اختبارات موجودة من مكتبة الاختبارات ====== */
  const linkSelectedExams = async () => {
    try {
      const v = await pickForm.validateFields();
      const ids = v.examIds || [];
      const toLink = ids
        .map((id) => examLibrary.find((x) => (x.id ?? x._id) === id))
        .filter(Boolean)
        .map(normalizeLibraryExam);

      setExams((prev) => {
        const existing = new Set(prev.map((x) => String(x.id)));
        // عند الربط من المكتبة، نسمح بتعيين releaseAt لاحقاً
        return [...toLink.filter((x) => !existing.has(String(x.id))), ...prev];
      });

      setOpenPickExam(false);
      pickForm.resetFields();
      message.success("تم ربط الاختبار/الاختبارات بنجاح");
    } catch {
      // antd handles validation
    }
  };

  /** ====== مزامنة اختبار مرتبط مع بياناته في المكتبة ====== */
  const syncExamFromLibrary = (examId) => {
    const lib = examLibrary.find((x) => (x.id ?? x._id) === examId);
    if (!lib) return message.warning("الاختبار غير موجود في المكتبة");
    const fresh = normalizeLibraryExam(lib);

    setExams((prev) =>
      prev.map((e) =>
        String(e.id) === String(examId)
          ? {
              ...e,
              title: fresh.title,
              examType: fresh.examType,
              duration: fresh.duration,
              questions: fresh.questions,
              status: fresh.status,
            }
          : e
      )
    );
    message.success("تمت مزامنة بيانات الاختبار");
  };

  /** ====== مخطط جدولة الظهور (Bulk) ====== */
  const [openReleasePlanner, setOpenReleasePlanner] = useState(false);
  const [releaseForm] = Form.useForm();

  const applyReleasePlan = (plan) => {
    const base = plan.baseDate ? dayjs(plan.baseDate) : dayjs();

    // الدروس
    if (plan.lessonsAbsolute || plan.lessonsOffsetDays !== undefined) {
      setFoundationStages((prev) =>
        prev.map((st) => ({
          ...st,
          lessons: (st.lessons || []).map((l) => ({
            ...l,
            releaseAt: plan.lessonsAbsolute
              ? plan.lessonsAbsolute
              : base.add(plan.lessonsOffsetDays || 0, "day").toISOString(),
          })),
        }))
      );
    }

    // المحاضرات
    if (plan.liveAbsolute || plan.liveOffsetDays !== undefined) {
      setLiveLectures((prev) =>
        prev.map((sec) => ({
          ...sec,
          items: (sec.items || []).map((i) => ({
            ...i,
            releaseAt: plan.liveAbsolute
              ? plan.liveAbsolute
              : base.add(plan.liveOffsetDays || 0, "day").toISOString(),
          })),
        }))
      );
    }

    // الاختبارات
    if (plan.examsAbsolute || plan.examsOffsetDays !== undefined) {
      setExams((prev) =>
        prev.map((e) => ({
          ...e,
          releaseAt: plan.examsAbsolute
            ? plan.examsAbsolute
            : base.add(plan.examsOffsetDays || 0, "day").toISOString(),
        }))
      );
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6" dir="rtl">
      {/* شريط التبويب + زر المخطط */}
      <div className="mb-4 flex items-center gap-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`rounded-xl px-4 py-2 text-sm font-semibold border transition-all ${
              activeTab === t.id
                ? "bg-teal-600 text-white border-teal-700 shadow"
                : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
            }`}
          >
            {t.title}
          </button>
        ))}
        <div className="ml-auto">
          <Button onClick={() => setOpenReleasePlanner(true)} className="!bg-teal-600 !text-white">
            جدولة ظهور المحتوى
          </Button>
        </div>
      </div>

      {/* ====== تبويب المراحل + الدروس ====== */}
      {activeTab === 1 && (
        <BasicLevel
          deleteLesson={deleteLesson}
          deleteStage={deleteStage}
          foundationStages={foundationStages}
          setOpenAddLesson={setOpenAddLesson}
          setOpenAddStage={setOpenAddStage}
          stats={stats}
          toggleStageVisibility={toggleStageVisibility}
          addTrainingFiles={addTrainingFiles}
          removeTrainingFile={removeTrainingFile}
          toggleLessonVisibility={toggleLessonVisibility}
          /** جديد: تمرير أدوات الجدولة داخل المحتوى */
          isReleased={isReleased}
          setLessonReleaseAt={setLessonReleaseAt}
          setStageReleaseAt={setStageReleaseAt}
        />
      )}

      {/* ====== تبويب المحاضرات المباشرة ====== */}
      {activeTab === 2 && (
        <LecturesContent
          stats={stats}
          deleteLesson={deleteLesson}
          deleteStage={deleteStage}
          toggleStageVisibility={toggleStageVisibility}
          toggleLessonVisibility={toggleLessonVisibility}
          foundationStages={foundationStages}
          setOpenAddLesson={setOpenAddLesson}
          setOpenAddStage={setOpenAddStage}
          addTrainingFiles={addTrainingFiles}
          removeTrainingFile={removeTrainingFile}
          isReleased={isReleased}
          setLessonReleaseAt={setLessonReleaseAt}
          setStageReleaseAt={setStageReleaseAt}
        />
      )}

      {/* ====== تبويب الاختبارات ====== */}
      {activeTab === 3 && (
        <Card
          title={
            <div className="flex items-center justify-between">
              <span className="font-bold">الاختبارات</span>
              <div className="flex gap-2">
                <Button className="!bg-gray-700 !text-white" onClick={() => setOpenPickExam(true)}>
                  انشاء اختبار
                </Button>
              </div>
            </div>
          }
        >
          {exams.length === 0 ? (
            <Empty description="لا توجد اختبارات" />
          ) : (
            <div className="space-y-3">
              {exams.map((e) => {
                const released = isReleased(e.releaseAt);
                const effectiveVisible = e.visible && released;
                return (
                  <div
                    key={e.id}
                    className={`flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-lg border p-3 ${
                      effectiveVisible ? "bg-gray-50" : "bg-gray-100 opacity-70"
                    }`}
                  >
                    <div className="flex items-start sm:items-center gap-3">
                      <div className="rounded-lg bg-purple-100 p-2 text-purple-700">
                        <ListChecks className="w-4 h-4" />
                      </div>
                      <div>
                        <div className={`font-medium ${effectiveVisible ? "text-gray-800" : "text-gray-500"}`}>
                          {e.title}
                        </div>
                        <div className="mt-1 text-xs text-gray-500 flex flex-col sm:flex-row sm:items-center sm:gap-3">
                          <span className="inline-flex items-center gap-1">
                            <ExamTypeTag t={e.examType} />
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Clock3 className="w-3.5 h-3.5" />
                            {e.duration} دقيقة
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Target className="w-3.5 h-3.5" />
                            {e.questions} سؤال
                          </span>
                          {e.releaseAt && (
                            <span className="inline-flex items-center gap-1">
                              موعد الظهور: {dayjs(e.releaseAt).format("YYYY/MM/DD HH:mm")}
                              {!released && <Tag color="red">لم يُفتح بعد</Tag>}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* أدوات الاختبار: جدولة/مسح/إظهار/حذف */}
                    <Space wrap align="center">
                      {/* ✅ DatePicker فردي لكل اختبار */}
                      <Tooltip title="موعد ظهور الاختبار">
                        <DatePicker
                          showTime
                          size="small"
                          className="min-w-[200px]"
                          value={e.releaseAt && dayjs(e.releaseAt).isValid() ? dayjs(e.releaseAt) : null}
                          onChange={(v) => setExamReleaseAt(e.id, v || null)}
                        />
                      </Tooltip>
                      {e.releaseAt && (
                        <Button size="small" type="text" onClick={() => setExamReleaseAt(e.id, null)}>
                          مسح
                        </Button>
                      )}

                      <Tooltip
                        title={
                          effectiveVisible
                            ? "إخفاء الاختبار"
                            : released
                            ? "إظهار الاختبار"
                            : "سيظهر تلقائياً عند موعده"
                        }
                      >
                        <Button
                          type="text"
                          disabled={!released}
                          icon={
                            effectiveVisible ? (
                              <Eye className="w-4 h-4 text-green-600" />
                            ) : (
                              <EyeOff className="w-4 h-4 text-gray-400" />
                            )
                          }
                          onClick={() => released && toggleExamVisibility(e.id)}
                        />
                      </Tooltip>

                      <Button danger onClick={() => setExams((p) => p.filter((x) => x.id !== e.id))}>
                        حذف
                      </Button>
                    </Space>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      )}

      {/* ================== Modals ================== */}

      {/* إضافة مرحلة */}
      <AddCourseLevelModal
        openAddStage={openAddStage}
        savingStage={savingStage}
        setOpenAddStage={setOpenAddStage}
        stageForm={stageForm}
        submitStage={submitStage}
      />

      {/* إضافة درس داخل مرحلة (جديدة/موجودة) */}
      <AddCourseLessonModal
        VIDEO_SOURCES={VIDEO_SOURCES}
        beforeUploadVideo={beforeUploadVideo}
        beforeUploadPdf={beforeUploadPdf}
        foundationStages={foundationStages}
        lessonForm={lessonForm}
        normFile={normFile}
        openAddLesson={openAddLesson}
        savingLesson={savingLesson}
        setOpenAddLesson={setOpenAddLesson}
        submitLesson={submitLesson}
        // أضف داخل المودال حقل DatePicker باسم lessonReleaseAt لو أردت جدولة من شاشة الإضافة
      />

      {/* إضافة محاضرات مباشرة */}
      <Modal
        title="إضافة محاضرات مباشرة"
        open={openAddLive}
        onCancel={() => setOpenAddLive(false)}
        onOk={submitLive}
        confirmLoading={savingLive}
        width={800}
      >
        <Form
          form={liveForm}
          layout="vertical"
          initialValues={{
            sectionMode: "new",
            sessions: [
              {
                title: "",
                date: null,
                time: null,
                duration: 60,
                meetingUrl: "",
                locked: false,
                releaseAt: null,
              },
            ],
          }}
        >
          <Form.Item label="إضافة إلى" name="sectionMode" rules={[{ required: true }]}>
            <Radio.Group>
              <Radio value="new">قسم جديد</Radio>
              <Radio value="exist">قسم موجود</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item noStyle shouldUpdate={(p, c) => p.sectionMode !== c.sectionMode}>
            {({ getFieldValue }) =>
              getFieldValue("sectionMode") === "new" ? (
                <Form.Item label="عنوان القسم الجديد" name="sectionTitle" rules={[{ required: true, message: "أدخل عنوان القسم" }]}>
                  <Input placeholder="مثال: محاضرات الوحدة 3" />
                </Form.Item>
              ) : (
                <Form.Item label="اختر القسم" name="sectionId" rules={[{ required: true, message: "اختر القسم" }]}>
                  <Select
                    placeholder="اختيار قسم"
                    options={(liveLectures || []).map((s) => ({
                      value: s.id,
                      label: s.title,
                    }))}
                  />
                </Form.Item>
              )
            }
          </Form.Item>

          <Divider />

          <Form.List name="sessions">
            {(fields, { add, remove, move }) => (
              <>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="m-0">الجلسات داخل القسم</h4>
                  <Button
                    type="dashed"
                    onClick={() =>
                      add({
                        title: "",
                        date: null,
                        time: null,
                        duration: 60,
                        meetingUrl: "",
                        locked: false,
                        releaseAt: null,
                      })
                    }
                  >
                    إضافة جلسة
                  </Button>
                </div>

                {fields.map(({ key, name, ...rest }) => (
                  <Card
                    key={key}
                    className="mb-3"
                    title={`جلسة #${name + 1}`}
                    extra={
                      <Space>
                        <Button size="small" onClick={() => name > 0 && move(name, name - 1)}>
                          ↑
                        </Button>
                        <Button size="small" onClick={() => name < fields.length - 1 && move(name, name + 1)}>
                          ↓
                        </Button>
                        <Button danger type="text" onClick={() => remove(name)}>
                          حذف
                        </Button>
                      </Space>
                    }
                  >
                    <Form.Item
                      {...rest}
                      label="عنوان الجلسة"
                      name={[name, "title"]}
                      rules={[{ required: true, message: "أدخل عنوان الجلسة" }]}
                    >
                      <Input placeholder="مثال: مراجعة شاملة للوحدة" />
                    </Form.Item>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <Form.Item label="التاريخ" name={[name, "date"]} rules={[{ required: true, message: "اختر التاريخ" }]}>
                        <DatePicker className="w-full" />
                      </Form.Item>
                      <Form.Item label="الوقت" name={[name, "time"]} rules={[{ required: true, message: "اختر الوقت" }]}>
                        <TimePicker className="w-full" format="HH:mm" />
                      </Form.Item>
                      <Form.Item label="المدة (دقيقة)" name={[name, "duration"]}>
                        <Input placeholder="مثال: 60" />
                      </Form.Item>
                    </div>

                    <Form.Item label="رابط الغرفة" name={[name, "meetingUrl"]}>
                      <Input placeholder="رابط Zoom/Meet…" />
                    </Form.Item>

                    <Form.Item label="تاريخ/وقت الظهور (اختياري)" name={[name, "releaseAt"]}>
                      <DatePicker showTime className="w-full" placeholder="افتراضيًا يساوي وقت البدء" />
                    </Form.Item>

                    <Form.Item label="مقفولة؟" name={[name, "locked"]} valuePropName="checked">
                      <Switch />
                    </Form.Item>
                  </Card>
                ))}
              </>
            )}
          </Form.List>
        </Form>
      </Modal>

      {/* إضافة اختبار (جديد) */}
      <Modal
        title="إضافة اختبار"
        open={openAddExam}
        onCancel={() => setOpenAddExam(false)}
        onOk={submitExam}
        confirmLoading={savingExam}
        destroyOnClose
      >
        <Form form={examForm} layout="vertical" initialValues={{ examType: "training" }}>
          <Form.Item label="نوع الاختبار" name="examType" rules={[{ required: true, message: "اختر نوع الاختبار" }]}>
            <Select
              options={[
                { value: "training", label: "تدريب" },
                { value: "mock", label: "اختبار محاكي" },
              ]}
              placeholder="اختر النوع"
            />
          </Form.Item>

          <Form.Item label="عنوان الاختبار" name="title" rules={[{ required: true, message: "أدخل عنوان الاختبار" }]}>
            <Input placeholder="مثال: اختبار الوحدة الثالثة" />
          </Form.Item>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Form.Item label="المدة (دقائق)" name="duration" rules={[{ required: true, message: "أدخل مدة الاختبار" }]}>
              <Input placeholder="مثال: 45" />
            </Form.Item>

            <Form.Item label="عدد الأسئلة" name="questions" rules={[{ required: true, message: "أدخل عدد الأسئلة" }]}>
              <Input placeholder="مثال: 20" />
            </Form.Item>
          </div>

          <Form.Item label="موعد الظهور (اختياري)" name="releaseAt">
            <DatePicker showTime className="w-full" />
          </Form.Item>
        </Form>
      </Modal>

      {/* ربط اختبار موجود من المكتبة */}
      <Modal
        title="إنشاء اختبار"
        open={openPickExam}
        onCancel={() => setOpenPickExam(false)}
        onOk={linkSelectedExams}
        okText="حفظ"
        cancelText="إلغاء"
        okButtonProps={{className:"!bg-blue-500 !text-white"}}
        destroyOnClose
      >
        <Form form={pickForm} layout="vertical">
          <Form.Item
            label="اختر اختبار"
            name="examIds"
            rules={[{ required: true, message: "اختر اختبارًا واحدًا على الأقل" }]}
          >
            <Select
              mode="multiple"
              placeholder={
                examLibrary.length ? "اختر من الاختبارات المحفوظة" : "لا توجد اختبارات في المكتبة — أنشئ اختبارًا أولاً"
              }
              optionFilterProp="label"
              options={examLibrary.map((e) => ({
                value: e.id ?? e._id,
                label: `${e.title ?? "بدون عنوان"} · ${
                  (e.examType ?? e.type) === "mock" ? "محاكي" : "تدريب"
                } · ${Array.isArray(e.questions) ? e.questions.length : e.questionsCount ?? e.questions ?? 0} سؤال`,
              }))}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* مخطط جدولة الظهور (Bulk) */}
      <Modal
        title="جدولة ظهور المحتوى"
        open={openReleasePlanner}
        onCancel={() => setOpenReleasePlanner(false)}
        onOk={async () => {
          const v = await releaseForm.validateFields();
          applyReleasePlan({
            baseDate: v.baseDate ? dayjs(v.baseDate).startOf("day").toISOString() : undefined,
            lessonsOffsetDays: v.lessonsMode === "offset" ? Number(v.lessonsOffset ?? 0) : undefined,
            liveOffsetDays: v.liveMode === "offset" ? Number(v.liveOffset ?? 0) : undefined,
            examsOffsetDays: v.examsMode === "offset" ? Number(v.examsOffset ?? 0) : undefined,
            lessonsAbsolute: v.lessonsMode === "absolute" && v.lessonsAbs ? dayjs(v.lessonsAbs).toISOString() : undefined,
            liveAbsolute: v.liveMode === "absolute" && v.liveAbs ? dayjs(v.liveAbs).toISOString() : undefined,
            examsAbsolute: v.examsMode === "absolute" && v.examsAbs ? dayjs(v.examsAbs).toISOString() : undefined,
          });
          setOpenReleasePlanner(false);
          message.success("تم تطبيق الجدولة على المحتوى الحالي");
        }}
        okText="تطبيق"
        destroyOnClose
      >
        <Form
          form={releaseForm}
          layout="vertical"
          initialValues={{
            lessonsMode: "offset",
            liveMode: "offset",
            examsMode: "offset",
            lessonsOffset: 1,
            liveOffset: 2,
            examsOffset: 3,
          }}
        >
          <div className="mb-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-amber-900 text-sm">
            يمكنك ضبط مواعيد الظهور لجميع المحتويات الحالية مرة واحدة. عند النسخ لاحقاً من دورة المصدر، مرّر نفس
            الخطة لتطبيقها تلقائياً.
          </div>

          <Form.Item
            label="التاريخ الاساسي"
            name="baseDate"
            tooltip="مثلاً تاريخ بداية الكورس؛ لو تركتها فارغة، تأخير الأيام تُحسب من الآن"
          >
            <DatePicker className="w-full" />
          </Form.Item>

          <Divider>مرحلة التأسيس</Divider>
          <Form.Item name="lessonsMode" label="طريقة التعيين">
            <Radio.Group>
              <Radio value="offset">تأخير أيام عن التاريخ الأساسي</Radio>
              <Radio value="absolute">موعد محدد</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item noStyle shouldUpdate={(p, c) => p.lessonsMode !== c.lessonsMode}>
            {({ getFieldValue }) =>
              getFieldValue("lessonsMode") === "offset" ? (
                <Form.Item label="تأخير (أيام)" name="lessonsOffset" rules={[{ required: true }]}>
                  <Input placeholder="مثال: 1" />
                </Form.Item>
              ) : (
                <Form.Item label="موعد" name="lessonsAbs" rules={[{ required: true }]}>
                  <DatePicker showTime className="w-full" />
                </Form.Item>
              )
            }
          </Form.Item>

          <Divider>المحاضرات المباشرة</Divider>
          <Form.Item name="liveMode" label="طريقة التعيين">
            <Radio.Group>
              <Radio value="offset">تأخير أيام عن التاريخ الأساسي</Radio>
              <Radio value="absolute">موعد محدد</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item noStyle shouldUpdate={(p, c) => p.liveMode !== c.liveMode}>
            {({ getFieldValue }) =>
              getFieldValue("liveMode") === "offset" ? (
                <Form.Item label="تأخير (أيام)" name="liveOffset" rules={[{ required: true }]}>
                  <Input placeholder="مثال: 2" />
                </Form.Item>
              ) : (
                <Form.Item label="موعد" name="liveAbs" rules={[{ required: true }]}>
                  <DatePicker showTime className="w-full" />
                </Form.Item>
              )
            }
          </Form.Item>

          <Divider>الاختبارات</Divider>
          <Form.Item name="examsMode" label="طريقة التعيين">
            <Radio.Group>
              <Radio value="offset">تأخير أيام عن التاريخ الأساسي</Radio>
              <Radio value="absolute">موعد محدد</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item noStyle shouldUpdate={(p, c) => p.examsMode !== c.examsMode}>
            {({ getFieldValue }) =>
              getFieldValue("examsMode") === "offset" ? (
                <Form.Item label="تأخير (أيام)" name="examsOffset" rules={[{ required: true }]}>
                  <Input placeholder="مثال: 3" />
                </Form.Item>
              ) : (
                <Form.Item label="موعد" name="examsAbs" rules={[{ required: true }]}>
                  <DatePicker showTime className="w-full" />
                </Form.Item>
              )
            }
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
