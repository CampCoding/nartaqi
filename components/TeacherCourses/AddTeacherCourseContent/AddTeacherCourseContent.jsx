"use client";
import React, { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Play,
  FileText,
  CalendarClock,
  Clock3,
  ExternalLink,
  Lock,
  LockOpen,
  Trash2,
  ListChecks,
  Target,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  Badge,
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
  Upload,
  message,
} from "antd";
import dayjs from "dayjs";

const { Panel } = Collapse;

/** تبويبات عليا */
const TABS = [
  { id: 1, key: "recorded", title: "فيديوهات شرح مسجلة" },
  { id: 2, key: "live", title: "محاضرات مباشرة" },
  { id: 3, key: "exams", title: "اختبارات" },
];

/** أنواع محتوى المسجّل */
const REC_TYPES = [
  { value: "video", label: "فيديو" },
  { value: "training", label: "تدريب (فيديو + PDFs)" },
];

/** مصادر الفيديو */
const VIDEO_SOURCES = [
  { value: "url", label: "رابط (YouTube/Vimeo…)" },
  { value: "file", label: "رفع ملف من الجهاز" },
];

/** تخزين محلي */
const STORAGE_KEY = "atcc_state_v1";

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/** تطبيع رفع الملفات لِـ fileList */
const normFile = (e) => (Array.isArray(e) ? e : e?.fileList ?? []);
/** منع الرفع الفعلي (نحفظ محلياً فقط) */
const beforeUploadVideo = () => false;
const beforeUploadPdf = () => false;

export default function AddTeacherCourseContent() {
  const [activeTab, setActiveTab] = useState(1);

  /** ====== Recorded sections (وحدات + موضوعات) ====== */
  const [recorded, setRecorded] = useState([
    {
      id: "s1",
      title: "الوحدة 1 — أساسيات المادة",
      visible: true,
      items: [
        {
          id: "r1",
          type: "video",
          title: "تعريف المادة وحالاتها",
          duration: "12:30",
          locked: false,
          visible: true,
          source: "url",
          url: "https://youtu.be/xxxxx",
        },
        {
          id: "r2",
          type: "training",
          title: "تدريب سريع على حالات المادة",
          locked: false,
          visible: true,
          trainingVideo: { source: "url", url: "https://youtu.be/yyyyy" },
          pdfs: [],
        },
      ],
    },
    {
      id: "s2",
      title: "الوحدة 2 — الذرة والتركيب",
      visible: true,
      items: [
        {
          id: "r3",
          type: "video",
          title: "مقدمة عن الذرة",
          duration: "08:20",
          locked: true,
          visible: true,
          source: "url",
          url: "#",
        },
        {
          id: "r4",
          type: "video",
          title: "النواة والإلكترونات",
          duration: "10:05",
          locked: true,
          visible: true,
          source: "url",
          url: "#",
        },
      ],
    },
  ]);

  /** ====== Live lectures (أقسام + جلسات) ====== */
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
          duration: 60,
          meetingUrl: "#",
          locked: false,
          visible: true,
        },
      ],
    },
    {
      id: "ls2",
      title: "قسم محاضرات — الوحدة 2",
      visible: true,
      items: [
        {
          id: "lv2",
          title: "حل أسئلة تفاعلي",
          startAt: dayjs().subtract(3, "day").hour(18).minute(0).second(0).toISOString(),
          duration: 45,
          meetingUrl: "#",
          locked: false,
          visible: true,
        },
      ],
    },
  ]);

  /** ====== Exams (بيانات بسيطة) ====== */
  const [exams, setExams] = useState([
    { 
      id: 1, 
      title: "اختبار الرياضيات المتقدم", 
      examType: "mock", 
      duration: 90, 
      questions: 20, 
      status: "منشور",
      visible: true 
    },
    { 
      id: 2, 
      title: "تدريب اللغة الإنجليزية", 
      examType: "training", 
      duration: 45, 
      questions: 15, 
      status: "مسودة",
      visible: true 
    },
  ]);

  /** ====== LocalStorage persistence ====== */
  useEffect(() => {
    const saved = loadState();
    if (saved) {
      if (Array.isArray(saved.recorded)) setRecorded(saved.recorded);
      if (Array.isArray(saved.liveLectures)) setLiveLectures(saved.liveLectures);
      if (Array.isArray(saved.exams)) setExams(saved.exams);
    }
  }, []);

  useEffect(() => {
    const state = { recorded, liveLectures, exams };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [recorded, liveLectures, exams]);

  /** ====== Stats ====== */
  const stats = useMemo(() => {
    const recordedCount = recorded.reduce((s, sec) => s + (sec.items?.length || 0), 0);
    const liveItems = liveLectures.flatMap((sec) => sec.items || []);
    const liveUpcoming = liveItems.filter((l) => dayjs(l.startAt).isAfter(dayjs())).length;
    return { recordedSections: recorded.length, recordedItems: recordedCount, liveUpcoming, examsCount: exams.length };
  }, [recorded, liveLectures, exams]);

  /** ====== Modals & Forms ====== */
  const [openAddRecorded, setOpenAddRecorded] = useState(false);
  const [openAddLive, setOpenAddLive] = useState(false);
  const [openAddExam, setOpenAddExam] = useState(false);

  const [recForm] = Form.useForm();
  const [liveForm] = Form.useForm();
  const [examForm] = Form.useForm();

  const [savingRecorded, setSavingRecorded] = useState(false);
  const [savingLive, setSavingLive] = useState(false);
  const [savingExam, setSavingExam] = useState(false);

  /** ====== Helpers ====== */
  const combineDT = (date, time) =>
    dayjs(date).hour(dayjs(time).hour()).minute(dayjs(time).minute()).second(0).toISOString();

  const TypeTag = ({ type }) =>
    type === "video" ? (
      <Tag color="blue" className="flex items-center gap-1" icon={<Play className="w-3.5 h-3.5" />}>فيديو</Tag>
    ) : (
      <Tag color="gold" className="flex items-center gap-1" icon={<Target className="w-3.5 h-3.5" />}>تدريب</Tag>
    );

  const ExamTypeTag = ({ t }) =>
    t === "mock" ? <Tag color="purple">اختبار محاكي</Tag> : <Tag color="cyan">تدريب</Tag>;

  /** ====== Visibility Toggles ====== */
  const toggleSectionVisibility = (sectionId, type) => {
    if (type === "recorded") {
      setRecorded(prev => 
        prev.map(s => 
          s.id === sectionId ? { ...s, visible: !s.visible } : s
        )
      );
    } else if (type === "live") {
      setLiveLectures(prev => 
        prev.map(s => 
          s.id === sectionId ? { ...s, visible: !s.visible } : s
        )
      );
    }
  };

  const toggleItemVisibility = (sectionId, itemId, type) => {
    if (type === "recorded") {
      setRecorded(prev => 
        prev.map(s => 
          s.id === sectionId 
            ? { 
                ...s, 
                items: s.items.map(i => 
                  i.id === itemId ? { ...i, visible: !i.visible } : i
                ) 
              } 
            : s
        )
      );
    } else if (type === "live") {
      setLiveLectures(prev => 
        prev.map(s => 
          s.id === sectionId 
            ? { 
                ...s, 
                items: s.items.map(i => 
                  i.id === itemId ? { ...i, visible: !i.visible } : i
                ) 
              } 
            : s
        )
      );
    }
  };

  const toggleExamVisibility = (examId) => {
    setExams(prev => 
      prev.map(e => 
        e.id === examId ? { ...e, visible: !e.visible } : e
      )
    );
  };

  /** ====== Recorded: add ====== */
  const submitRecorded = async () => {
    try {
      setSavingRecorded(true);
      const v = await recForm.validateFields();
      let sectionId = v.sectionId;

      // إنشاء قسم جديد إذا لزم
      if (v.sectionMode === "new") {
        sectionId = `sec-${Date.now()}`;
        setRecorded((prev) => [{ id: sectionId, title: v.sectionTitle, visible: true, items: [] }, ...prev]);
      }

      // جهّز الموضوعات
      const topics = (v.topics || []).map((t, i) => {
        const base = { 
          id: `itm-${Date.now()}-${i}`, 
          title: t.title, 
          locked: !!t.locked,
          visible: true 
        };
        if (t.type === "video") {
          if (t.videoSource === "url") {
            return {
              ...base,
              type: "video" ,
              duration: t.duration || "",
              source: "url" ,
              url: (t.url || "").trim(),
            };
          }
          // ملف
          return {
            ...base,
            type: "video",
            duration: t.duration || "",
            source: "file",
            videoFile: t.videoFile || [],
          };
        }

        // training
        const trainingVideo =
          t.trainingVideoSource === "url"
            ? { source: "url" , url: (t.trainingVideoUrl || "").trim() }
            : { source: "file" , fileList: t.trainingVideoFile || [] };

        return {
          ...base,
          type: "training" ,
          trainingVideo,
          pdfs: t.pdfs || [],
        };
      });

      // أضف العناصر للقسم المستهدف
      setRecorded((prev) =>
        prev.map((s) => (s.id === sectionId ? { ...s, items: [...topics, ...(s.items || [])] } : s))
      );

      message.success("تم حفظ المحتوى المسجّل محليًا");
      setOpenAddRecorded(false);
      recForm.resetFields();
    } catch {
      // handled by antd
    } finally {
      setSavingRecorded(false);
    }
  };

  const deleteRecordedItem = (sectionId, itemId) => {
    setRecorded((prev) =>
      prev.map((s) => (s.id === sectionId ? { ...s, items: s.items.filter((it) => it.id !== itemId) } : s))
    );
  };

  /** ====== Live: add ====== (أقسام + جلسات) */
  const submitLive = async () => {
    try {
      setSavingLive(true);
      const v = await liveForm.validateFields();

      let sectionId = v.sectionId;
      if (v.sectionMode === "new") {
        sectionId = `ls-${Date.now()}`;
        setLiveLectures((prev) => [{ id: sectionId, title: v.sectionTitle, visible: true, items: [] }, ...prev]);
      }

      const sessions = (v.sessions || []).map((s, i) => ({
        id: `lv-${Date.now()}-${i}`,
        title: s.title,
        startAt: combineDT(s.date, s.time),
        duration: s.duration ? Number(s.duration) : undefined,
        meetingUrl: (s.meetingUrl || "").trim() || "#",
        locked: !!s.locked,
        visible: true,
      }));

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

  const deleteLiveSession = (sectionId, itemId) => {
    setLiveLectures((prev) =>
      prev.map((s) =>
        s.id === sectionId ? { ...s, items: (s.items || []).filter((it) => it.id !== itemId) } : s
      )
    );
  };

  /** ====== Exams ====== */
  const submitExam = async () => {
    try {
      setSavingExam(true);
      const v = await examForm.validateFields();
      const entity = {
        id: `ex-${Date.now()}`,
        title: v.title,
        examType: v.examType, // "training" | "mock"
        duration: Number(v.duration),
        questions: Number(v.questions),
        status: "مسودة",
        visible: true,
      } ;
      setExams((p) => [entity, ...p]);
      message.success("تم حفظ الاختبار محليًا");
      setOpenAddExam(false);
      examForm.resetFields();
    } catch {
      // handled by antd
    } finally {
      setSavingExam(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6" dir="rtl">
      {/* شريط التبويب */}
      <div className="mb-4 flex  items-center justify-between gap-3">
        <div className="flex items-center gap-2">
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
        </div>
       
      </div>

      {/* ====== Recorded Tab ====== */}
      {activeTab === 1 && (
        <Card
          title={
            <div className="flex items-center justify-between">
              <span className="font-bold">فيديوهات الشرح المسجلة</span>
              <Button type="primary" className="!bg-blue-600 !text-white" onClick={() => setOpenAddRecorded(true)}>
                إضافة
              </Button>
            </div>
          }
          className="mb-6"
        >
          {recorded.length === 0 ? (
            <Empty description="لا توجد وحدات مسجلة بعد" />
          ) : (
            <Collapse accordion>
              {recorded.map((sec) => (
                <Panel
                  key={sec.id}
                  header={
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Tooltip title={sec.visible ? "إخفاء القسم" : "إظهار القسم"}>
                          <Button
                            type="text"
                            icon={sec.visible ? <Eye className="w-4 h-4 text-green-600" /> : <EyeOff className="w-4 h-4 text-gray-400" />}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleSectionVisibility(sec.id, "recorded");
                            }}
                          />
                        </Tooltip>
                        <span className={`font-semibold ${sec.visible ? "text-gray-800" : "text-gray-400"}`}>
                          {sec.title}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">{sec.items.length} عنصر</span>
                    </div>
                  }
                >
                  <div className="space-y-3">
                    {sec.items.map((it) => {
                      const isVideo = it.type === "video";
                      const canOpen =
                        (isVideo && (it).source === "url" && it.url) ||
                        (!isVideo && (it).trainingVideo?.source === "url" && (it).trainingVideo?.url);

                      const duration =
                        isVideo ? (it).duration : undefined;

                      const trainingPdfCount =
                        !isVideo ? (it).pdfs?.length || 0 : 0;

                      const openUrl =
                        isVideo
                          ? it.url
                          : (it).trainingVideo?.url;

                      return (
                        <div
                          key={it.id}
                          className={`flex items-center justify-between rounded-lg border p-3 ${
                            it.visible ? "bg-gray-50" : "bg-gray-100 opacity-70"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`rounded-lg !flex !gap-2 !items-center p-2 ${
                                isVideo
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-amber-100 text-amber-700"
                              }`}
                            >
                              {isVideo ? (
                                <Play className="w-4 h-4" />
                              ) : (
                                <Target className="w-4 h-4" />
                              )}
                            </div>

                            <div>
                              <div className={`font-medium ${it.visible ? "text-gray-800" : "text-gray-500"}`}>
                                {it.title}
                              </div>
                              <div className="text-xs mt-3 text-gray-500 !flex !items-center gap-2">
                                <TypeTag type={it.type} />
                                {duration && (
                                  <span className="!flex items-center gap-1">
                                    <Clock3 className="w-3.5 h-3.5" />
                                    {duration}
                                  </span>
                                )}
                                {it.type === "training" && (
                                  <Tag className="!flex gap-2 !items-center" color="gold" icon={<FileText className="w-3.5 h-3.5" />}>
                                    {trainingPdfCount} PDF
                                  </Tag>
                                )}
                                
                              </div>
                            </div>
                          </div>

                          <Space>
                            <Tooltip title={it.visible ? "إخفاء العنصر" : "إظهار العنصر"}>
                              <Button
                                type="text"
                                icon={it.visible ? <Eye className="w-4 h-4 text-green-600" /> : <EyeOff className="w-4 h-4 text-gray-400" />}
                                onClick={() => toggleItemVisibility(sec.id, it.id, "recorded")}
                              />
                            </Tooltip>
                            
                            <Tooltip title="حذف">
                              <Button
                                danger
                                onClick={() => deleteRecordedItem(sec.id, it.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                                </Button>
                            </Tooltip>
                          </Space>
                        </div>
                      );
                    })}
                  </div>
                </Panel>
              ))}
            </Collapse>
          )}
        </Card>
      )}

      {/* ====== Live Tab (أقسام + جلسات) ====== */}
      {activeTab === 2 && (
        <Card
          title={
            <div className="flex items-center justify-between">
              <span className="font-bold">محاضرات مباشرة</span>
              <Button type="primary" className="!bg-blue-600 !text-white" onClick={() => setOpenAddLive(true)}>
                إضافة محاضرة
              </Button>
            </div>
          }
        >
          {liveLectures.length === 0 ? (
            <Empty description="لا توجد محاضرات مباشرة" />
          ) : (
            <Collapse accordion>
              {liveLectures.map((sec) => (
                <Panel
                  key={sec.id}
                  header={
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Tooltip title={sec.visible ? "إخفاء القسم" : "إظهار القسم"}>
                          <Button
                            type="text"
                            icon={sec.visible ? <Eye className="w-4 h-4 text-green-600" /> : <EyeOff className="w-4 h-4 text-gray-400" />}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleSectionVisibility(sec.id, "live");
                            }}
                          />
                        </Tooltip>
                        <span className={`font-semibold ${sec.visible ? "text-gray-800" : "text-gray-400"}`}>
                          {sec.title}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">{sec.items?.length || 0} محاضرة</span>
                    </div>
                  }
                >
                  {(sec.items || []).length === 0 ? (
                    <Empty description="لا توجد محاضرات في هذا القسم" />
                  ) : (
                    <div className="space-y-3">
                      {sec.items.map((l) => {
                        const isFinished = dayjs().isAfter(dayjs(l.startAt));
                        return (
                          <div
                            key={l.id}
                            className={`flex items-center justify-between rounded-lg border p-3 ${
                              l.visible ? "bg-gray-50" : "bg-gray-100 opacity-70"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className="rounded-lg bg-emerald-100 p-2 text-emerald-700">
                                <CalendarClock className="w-4 h-4" />
                              </div>
                              <div>
                                <div className={`font-medium ${l.visible ? "text-gray-800" : "text-gray-500"}`}>
                                  {l.title}
                                </div>
                                <div className="text-xs text-gray-500 flex  items-center gap-2">
                                  <span className="inline-flex items-center gap-1">
                                    <CalendarClock className="w-3.5 h-3.5" />
                                    {dayjs(l.startAt).format("YYYY/MM/DD")}
                                  </span>
                                  <span className="inline-flex items-center gap-1">
                                    <Clock3 className="w-3.5 h-3.5" />
                                    {dayjs(l.startAt).format("HH:mm")}
                                  </span>
                                  {l.duration ? (
                                    <span className="inline-flex items-center gap-1">
                                      <Clock3 className="w-3.5 h-3.5" /> {l.duration} دقيقة
                                    </span>
                                  ) : null}
                                  
                                </div>
                              </div>
                            </div>

                            <Space>
                              <Tooltip title={l.visible ? "إخفاء الجلسة" : "إظهار الجلسة"}>
                                <Button
                                  type="text"
                                  icon={l.visible ? <Eye className="w-4 h-4 text-green-600" /> : <EyeOff className="w-4 h-4 text-gray-400" />}
                                  onClick={() => toggleItemVisibility(sec.id, l.id, "live")}
                                />
                              </Tooltip>
                             
                              <Tooltip title="حذف">
                                <Button
                                  danger
                                  className="!flex !justify-center !items-center"
                                  icon={<Trash2  className="w-5 h-5"/>}
                                  onClick={() => deleteLiveSession(sec.id, l.id)}
                                />
                              </Tooltip>
                            </Space>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </Panel>
              ))}
            </Collapse>
          )}
        </Card>
      )}

      {/* ====== Exams Tab ====== */}
      {activeTab === 3 && (
        <Card
          title={
            <div className="flex items-center justify-between">
              <span className="font-bold">الاختبارات</span>
              <Button
                type="primary"
                className="text-white !bg-[#3B82F6]"
                onClick={() => setOpenAddExam(true)}
              >
                إضافة اختبار
              </Button>
            </div>
          }
        >
          {exams.length === 0 ? (
            <Empty description="لا توجد اختبارات" />
          ) : (
            <div className="space-y-3">
              {exams.map((e) => (
                <div
                  key={e.id}
                  className={`flex items-center justify-between rounded-lg border p-3 ${
                    e.visible ? "bg-gray-50" : "bg-gray-100 opacity-70"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-purple-100 p-2 text-purple-700">
                      <ListChecks className="w-4 h-4" />
                    </div>
                    <div>
                      <div className={`font-medium ${e.visible ? "text-gray-800" : "text-gray-500"}`}>
                        {e.title}
                      </div>
                      <div className="text-xs text-gray-500 flex items-center gap-2">
                        <ExamTypeTag t={e.examType} />
                        <span className="inline-flex items-center gap-1">
                          <Clock3 className="w-3.5 h-3.5" />
                          {e.duration} دقيقة
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Target className="w-3.5 h-3.5" />
                          {e.questions} سؤال
                        </span>
                      </div>
                    </div>
                  </div>
                  <Space>
                    <Tooltip title={e.visible ? "إخفاء الاختبار" : "إظهار الاختبار"}>
                      <Button
                        type="text"
                        icon={e.visible ? <Eye className="w-4 h-4 text-green-600" /> : <EyeOff className="w-4 h-4 text-gray-400" />}
                        onClick={() => toggleExamVisibility(e.id)}
                      />
                    </Tooltip>
                    <Button
                      className="!w-19 !h-10 flex justify-center items-center"
                      danger
                      onClick={() => setExams((p) => p.filter((x) => x.id !== e.id))}
                    >
                      حذف
                    </Button>
                  </Space>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* ================== Modals ================== */}

      {/* Recorded: إضافة قسم جديد أو الإضافة لقسم موجود + عدة موضوعات */}
      <Modal
        title="إضافة محتوى مسجّل"
        open={openAddRecorded}
        onCancel={() => setOpenAddRecorded(false)}
        onOk={submitRecorded}
        okText="حفظ"
        confirmLoading={savingRecorded}
        width={800}
        okButtonProps={""}
>
        <Form
          form={recForm}
          layout="vertical"
          initialValues={{
            sectionMode: "new",
            topics: [
              {
                type: "video",
                title: "",
                locked: false,
                videoSource: "url",
                url: "",
                duration: "",
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
                <Form.Item
                  label="عنوان القسم الجديد"
                  name="sectionTitle"
                  rules={[{ required: true, message: "أدخل عنوان القسم" }]}
                >
                  <Input placeholder="مثال: الوحدة 3 — الروابط الكيميائية" />
                </Form.Item>
              ) : (
                <Form.Item
                  label="اختر القسم"
                  name="sectionId"
                  rules={[{ required: true, message: "اختر القسم" }]}
                >
                  <Select
                    placeholder="اختيار قسم"
                    options={(recorded || []).map((s) => ({ value: s.id, label: s.title }))}
                  />
                </Form.Item>
              )
            }
          </Form.Item>

          <Divider />

          <Form.List name="topics">
            {(fields, { add, remove, move }) => (
              <>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="m-0">الموضوعات داخل القسم</h4>
                  <Button
                    type="dashed"
                    onClick={() =>
                      add({
                        type: "video",
                        title: "",
                        locked: false,
                        videoSource: "url",
                        url: "",
                        duration: "",
                      })
                    }
                  >
                    إضافة موضوع
                  </Button>
                </div>

                {fields.map(({ key, name, ...rest }) => (
                  <Card
                    key={key}
                    className="mb-3"
                    title={`موضوع #${name + 1}`}
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
                      label="عنوان الموضوع"
                      name={[name, "title"]}
                      rules={[{ required: true, message: "أدخل عنوان الموضوع" }]}
                    >
                      <Input placeholder="عنوان الفيديو/التدريب" />
                    </Form.Item>

                    <Form.Item
                      {...rest}
                      label="نوع العنصر"
                      name={[name, "type"]}
                      rules={[{ required: true }]}
                    >
                      <Select options={REC_TYPES} placeholder="اختر النوع" />
                    </Form.Item>

                    <Form.Item
                      noStyle
                      shouldUpdate={(prev, cur) => prev.topics?.[name]?.type !== cur.topics?.[name]?.type}
                    >
                      {({ getFieldValue }) => {
                        const t = getFieldValue(["topics", name, "type"]) || "video";

                        /** ---------- VIDEO UI ---------- */
                        if (t === "video") {
                          return (
                            <>
                              <Form.Item
                                label="مصدر الفيديو"
                                name={[name, "videoSource"]}
                                rules={[{ required: true }]}
                              >
                                <Radio.Group optionType="button" buttonStyle="solid">
                                  {VIDEO_SOURCES.map((s) => (
                                    <Radio key={s.value} value={s.value}>
                                      {s.label}
                                    </Radio>
                                  ))}
                                </Radio.Group>
                              </Form.Item>

                              <Form.Item
                                noStyle
                                shouldUpdate={(p, c) =>
                                  p.topics?.[name]?.videoSource !== c.topics?.[name]?.videoSource
                                }
                              >
                                {({ getFieldValue }) => {
                                  const src = getFieldValue(["topics", name, "videoSource"]);
                                  return src === "url" ? (
                                    <Form.Item
                                      label="رابط الفيديو"
                                      name={[name, "url"]}
                                      rules={[{ required: true, message: "أدخل الرابط" }]}
                                    >
                                      <Input placeholder="https://youtube.com/watch?v=..." />
                                    </Form.Item>
                                  ) : (
                                    <Form.Item
                                      label="رفع ملف الفيديو"
                                      name={[name, "videoFile"]}
                                      valuePropName="fileList"
                                      getValueFromEvent={normFile}
                                      rules={[{ required: true, message: "ارفَع ملف فيديو" }]}
                                    >
                                      <Upload.Dragger beforeUpload={beforeUploadVideo} accept="video/*" maxCount={1}>
                                        <p className="ant-upload-drag-icon">🎥</p>
                                        <p className="ant-upload-text">اسحب ملف الفيديو هنا أو اضغط للاختيار</p>
                                      </Upload.Dragger>
                                    </Form.Item>
                                  );
                                }}
                              </Form.Item>

                              <Form.Item label="المدة" name={[name, "duration"]}>
                                <Input placeholder="مثال: 14:20" />
                              </Form.Item>
                            </>
                          );
                        }

                        /** ---------- TRAINING UI ---------- */
                        return (
                          <>
                            <Divider>إعدادات التدريب</Divider>

                            <Form.Item
                              label="مصدر فيديو التدريب"
                              name={[name, "trainingVideoSource"]}
                              initialValue="url"
                              rules={[{ required: true }]}
                            >
                              <Radio.Group optionType="button" buttonStyle="solid">
                                {VIDEO_SOURCES.map((s) => (
                                  <Radio key={s.value} value={s.value}>
                                    {s.label}
                                  </Radio>
                                ))}
                              </Radio.Group>
                            </Form.Item>

                            <Form.Item
                              noStyle
                              shouldUpdate={(p, c) =>
                                p.topics?.[name]?.trainingVideoSource !== c.topics?.[name]?.trainingVideoSource
                              }
                            >
                              {({ getFieldValue }) => {
                                const src = getFieldValue(["topics", name, "trainingVideoSource"]);
                                return src === "url" ? (
                                  <Form.Item
                                    label="رابط فيديو التدريب"
                                    name={[name, "trainingVideoUrl"]}
                                    rules={[{ required: true, message: "أدخل الرابط" }]}
                                  >
                                    <Input placeholder="https://..." />
                                  </Form.Item>
                                ) : (
                                  <Form.Item
                                    label="رفع فيديو التدريب"
                                    name={[name, "trainingVideoFile"]}
                                    valuePropName="fileList"
                                    getValueFromEvent={normFile}
                                    rules={[{ required: true, message: "ارفع ملف فيديو" }]}
                                  >
                                    <Upload.Dragger beforeUpload={beforeUploadVideo} accept="video/*" maxCount={1}>
                                      <p className="ant-upload-drag-icon">🎥</p>
                                      <p className="ant-upload-text">اسحب ملف الفيديو هنا أو اضغط للاختيار</p>
                                    </Upload.Dragger>
                                  </Form.Item>
                                );
                              }}
                            </Form.Item>

                            <Form.Item
                              label="ملفات PDF للتدريب (يمكن رفع أكثر من ملف)"
                              name={[name, "pdfs"]}
                              valuePropName="fileList"
                              getValueFromEvent={normFile}
                              rules={[{ required: true, message: "أضف ملف PDF واحدًا على الأقل" }]}
                            >
                              <Upload.Dragger beforeUpload={beforeUploadPdf} accept=".pdf" multiple>
                                <p className="ant-upload-drag-icon">📄</p>
                                <p className="ant-upload-text">اسحب ملفات PDF هنا أو اضغط للاختيار</p>
                              </Upload.Dragger>
                            </Form.Item>
                          </>
                        );
                      }}
                    </Form.Item>

                    
                  </Card>
                ))}

                {fields.length === 0 && (
                  <div className="text-gray-500 text-center py-4">لا توجد موضوعات بعد — اضغط “إضافة موضوع”.</div>
                )}
              </>
            )}
          </Form.List>
        </Form>
      </Modal>

      {/* Live: إضافة قسم + عدة جلسات */}
      <Modal
        title="إضافة محاضرات مباشرة"
        open={openAddLive}
        onCancel={() => setOpenAddLive(false)}
        onOk={submitLive}
        okText="حفظ"
        confirmLoading={savingLive}
        width={800}
      >
        <Form
          form={liveForm}
          layout="vertical"
          initialValues={{
            sectionMode: "new",
            sessions: [{ title: "", date: null, time: null, duration: 60, meetingUrl: "", locked: false }],
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
                <Form.Item
                  label="عنوان القسم الجديد"
                  name="sectionTitle"
                  rules={[{ required: true, message: "أدخل عنوان القسم" }]}
                >
                  <Input placeholder="مثال: محاضرات الوحدة 3" />
                </Form.Item>
              ) : (
                <Form.Item
                  label="اختر القسم"
                  name="sectionId"
                  rules={[{ required: true, message: "اختر القسم" }]}
                >
                  <Select
                    placeholder="اختيار قسم"
                    options={(liveLectures || []).map((s) => ({ value: s.id, label: s.title }))}
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
                    onClick={() => add({ title: "", date: null, time: null, duration: 60, meetingUrl: "", locked: false })}
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
                      <Form.Item
                        label="التاريخ"
                        name={[name, "date"]}
                        rules={[{ required: true, message: "اختر التاريخ" }]}
                      >
                        <DatePicker className="w-full" />
                      </Form.Item>
                      <Form.Item
                        label="الوقت"
                        name={[name, "time"]}
                        rules={[{ required: true, message: "اختر الوقت" }]}
                      >
                        <TimePicker className="w-full" format="HH:mm" />
                      </Form.Item>
                      <Form.Item label="المدة (دقيقة)" name={[name, "duration"]}>
                        <Input placeholder="مثال: 60" />
                      </Form.Item>
                    </div>

                    <Form.Item label="رابط الغرفة" name={[name, "meetingUrl"]}>
                      <Input placeholder="رابط Zoom/Meet…" />
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

      {/* Exam: إضافة اختبار بسيط */}
      <Modal
        title="إضافة اختبار"
        open={openAddExam}
        onCancel={() => setOpenAddExam(false)}
        onOk={submitExam}
        okText="حفظ"
        confirmLoading={savingExam}
        destroyOnClose
      >
        <Form form={examForm} layout="vertical" initialValues={{ examType: "training" }}>
          <Form.Item
            label="نوع الاختبار"
            name="examType"
            rules={[{ required: true, message: "اختر نوع الاختبار" }]}
          >
            <Select
              options={[
                { value: "training", label: "تدريب" },
                { value: "mock", label: "اختبار محاكي" },
              ]}
              placeholder="اختر النوع"
            />
          </Form.Item>

          <Form.Item
            label="عنوان الاختبار"
            name="title"
            rules={[{ required: true, message: "أدخل عنوان الاختبار" }]}
          >
            <Input placeholder="مثال: اختبار الوحدة الثالثة" />
          </Form.Item>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Form.Item
              label="المدة (دقائق)"
              name="duration"
              rules={[{ required: true, message: "أدخل مدة الاختبار" }]}
            >
              <Input placeholder="مثال: 45" />
            </Form.Item>

            <Form.Item
              label="عدد الأسئلة"
              name="questions"
              rules={[{ required: true, message: "أدخل عدد الأسئلة" }]}
            >
              <Input placeholder="مثال: 20" />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  );
}