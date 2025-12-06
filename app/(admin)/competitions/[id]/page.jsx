"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Card,
  Tag,
  Badge,
  Row,
  Col,
  Typography,
  Descriptions,
  Divider,
  Alert,
  Empty,
  Skeleton,
  Button,
  Progress,
  Tooltip,
  Avatar,
  Space,
  Timeline,
  Statistic,
} from "antd";
import {
  CalendarOutlined,
  UserOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  CheckCircleOutlined,
  QuestionCircleOutlined,
  FileTextOutlined,
  TrophyOutlined,
  ClockCircleOutlined,
  UsergroupAddOutlined,
  PlayCircleOutlined,
  ShareAltOutlined,
  BookOutlined,
  FireOutlined,
} from "@ant-design/icons";
import {
  Award,
  BarChart3,
  ArrowLeft,
  Users,
  Clock,
  Star,
  Target,
  Zap,
} from "lucide-react";

// if you don't use these aliases, swap to your relative paths
import PagesHeader from "@/components/ui/PagesHeader";
import PageLayout from "@/components/layout/PageLayout";
import BreadcrumbsShowcase from "@/components/ui/BreadCrumbs";

const { Title, Text, Paragraph } = Typography;

/* ---------------- MathLive (read-only) ---------------- */
function MathFieldReadOnly({ value = "", className = "" }) {
  const hostRef = useRef(null);
  const mfRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (typeof window === "undefined") return;
      const mathlive = await import("mathlive");
      const MathfieldElement =
        mathlive.MathfieldElement || window.MathfieldElement;
      if (!MathfieldElement || !hostRef.current || !mounted) return;

      const mf = new MathfieldElement({
        smartMode: false,
        readOnly: true,
        virtualKeyboardMode: "off",
        textDirection: "rtl",
        locale: "ar",
      });
      mf.setAttribute("dir", "rtl");
      mf.style.textAlign = "right";
      try {
        mf.setValue ? mf.setValue(value || "") : (mf.value = value || "");
      } catch {}
      hostRef.current.innerHTML = "";
      hostRef.current.appendChild(mf);
      mfRef.current = mf;
    })();

    return () => {
      mounted = false;
      if (mfRef.current) {
        try {
          mfRef.current.remove();
        } catch {}
        mfRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const mf = mfRef.current;
    if (!mf) return;
    const current =
      typeof mf.getValue === "function" ? mf.getValue("latex") : mf.value || "";
    if ((value || "") !== (current || "")) {
      try {
        mf.setValue ? mf.setValue(value || "") : (mf.value = value || "");
      } catch {}
    }
  }, [value]);

  return (
    <div
      ref={hostRef}
      className={`min-h-[44px] px-4 py-3 border border-gray-200 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 ${className}`}
    />
  );
}

/* ---------------- Helpers ---------------- */
const typeLabel = {
  daily: "يومية",
  weekly: "أسبوعية",
  monthly: "شهرية",
};

const typeColors = {
  daily: "volcano",
  weekly: "geekblue",
  monthly: "purple",
};

function HtmlBlock({ html }) {
  if (!html) return null;
  return (
    <div
      className="prose max-w-none prose-slate"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

function renderQuestion(q, index) {
  if (q.type === "mcq" && q.mcqSubType === "general") {
    return (
      <Card className="question-card border-0 shadow-md hover:shadow-lg transition-all duration-300">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
              {index + 1}
            </div>
          </div>
          <div className="flex-1">
            <div
              className="mb-4 text-lg font-medium"
              dangerouslySetInnerHTML={{ __html: q.promptHtml }}
            />
            <div className="space-y-3">
              {q.options.map((o, i) => (
                <div
                  key={i}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                    q.correctIndex === i
                      ? "border-green-300 bg-green-50 shadow-sm"
                      : "border-gray-200 bg-gray-50 hover:border-blue-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${
                        q.correctIndex === i
                          ? "bg-green-500 text-white"
                          : "bg-gray-300 text-gray-600"
                      }`}
                    >
                      {String.fromCharCode(65 + i)}
                    </div>
                    <div className={q.correctIndex === i ? "font-semibold text-green-800" : ""}>
                      <span dangerouslySetInnerHTML={{ __html: o.textHtml || "-" }} />
                      {q.correctIndex === i && (
                        <CheckCircleOutlined className="text-green-500 ms-2" />
                      )}
                    </div>
                  </div>
                  {o.explainHtml && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="text-xs text-gray-600 mb-1">💡 شرح الإجابة:</div>
                      <div
                        className="text-sm text-gray-700"
                        dangerouslySetInnerHTML={{ __html: o.explainHtml }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    );
  }

  if (q.type === "mcq" && q.mcqSubType === "passage") {
    return (
      <Card className="question-card border-0 shadow-md">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold text-sm">
              {index + 1}
            </div>
          </div>
          <div className="flex-1">
            <div className="mb-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
              <div className="flex items-center gap-2 mb-3">
                <BookOutlined className="text-blue-600" />
                <span className="font-medium text-blue-800">نص القراءة</span>
              </div>
              <div
                className="text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: q.passageHtml }}
              />
            </div>
            <div className="space-y-4">
              {q.items.map((it, idx) => (
                <Card key={it.id} className="border-l-4 border-l-blue-500 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      {idx + 1}
                    </div>
                    <span className="text-sm font-medium text-blue-800">
                      سؤال فرعي
                    </span>
                  </div>
                  <div
                    className="mb-3 font-medium"
                    dangerouslySetInnerHTML={{ __html: it.textHtml }}
                  />
                  {it?.opts?.length ? (
                    <div className="space-y-2">
                      {it.opts.map((o, oi) => (
                        <div
                          key={oi}
                          className={`p-3 rounded-lg border ${
                            it.correctIndex === oi
                              ? "border-green-300 bg-green-50"
                              : "border-gray-200 bg-gray-50"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                                it.correctIndex === oi
                                  ? "bg-green-500 text-white"
                                  : "bg-gray-300 text-gray-600"
                              }`}
                            >
                              {oi + 1}
                            </div>
                            <span
                              className={
                                it.correctIndex === oi ? "font-semibold text-green-800" : ""
                              }
                            >
                              <span
                                dangerouslySetInnerHTML={{ __html: o.textHtml || "-" }}
                              />
                            </span>
                          </div>
                          {o.explainHtml && (
                            <div className="mt-2 pt-2 border-t border-gray-200 text-xs text-gray-600">
                              <div
                                dangerouslySetInnerHTML={{ __html: o.explainHtml }}
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : null}
                </Card>
              ))}
            </div>
          </div>
        </div>
      </Card>
    );
  }

  if (q.type === "mcq" && q.mcqSubType === "chemical") {
    const list =
      Array.isArray(q.answers) && q.answers.length
        ? (q.answers.some((a) => a?.correct === true)
            ? q.answers.filter((a) => a?.correct)
            : q.answers
          ).map((a) => (typeof a === "string" ? { latex: a } : a))
        : Array.isArray(q.answersLatex)
        ? q.answersLatex.map((s) => ({ latex: s }))
        : q.answerLatex
        ? [{ latex: q.answerLatex }]
        : [];

    return (
      <Card className="question-card border-0 shadow-md">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-teal-600 flex items-center justify-center text-white font-bold text-sm">
              {index + 1}
            </div>
          </div>
          <div className="flex-1 space-y-4">
            <div className="p-4 bg-gradient-to-r from-green-50 to-teal-50 rounded-xl border border-green-200">
              <div className="flex items-center gap-2 mb-3">
                <Target className="w-4 h-4 text-green-600" />
                <span className="font-medium text-green-800">المعادلة / المسألة</span>
              </div>
              <MathFieldReadOnly value={q.equationLatex || ""} />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <CheckCircleOutlined className="text-green-600" />
                <span className="font-medium text-green-800">الإجابات الصحيحة</span>
              </div>
              {list.length === 0 ? (
                <Empty
                  description="لا توجد إجابات محفوظة"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              ) : (
                <div className="space-y-3">
                  {list.map((a, i) => (
                    <Card
                      key={i}
                      className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                          {i + 1}
                        </div>
                        <span className="text-sm font-medium text-blue-800">
                          إجابة
                        </span>
                      </div>
                      <MathFieldReadOnly value={a?.latex || ""} />
                      {a?.explanationHtml && (
                        <div className="mt-3 pt-3 border-t border-blue-200">
                          <div className="text-xs text-blue-600 mb-1">💡 شرح الإجابة:</div>
                          <div
                            className="prose prose-sm max-w-none text-gray-700"
                            dangerouslySetInnerHTML={{ __html: a.explanationHtml }}
                          />
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              )}
            </div>
            {q.explainHtml && (
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                <div className="text-amber-800 font-medium mb-2">📚 شرح عام:</div>
                <div
                  className="text-amber-700"
                  dangerouslySetInnerHTML={{ __html: q.explainHtml }}
                />
              </div>
            )}
          </div>
        </div>
      </Card>
    );
  }

  if (q.type === "trueFalse") {
    return (
      <Card className="question-card border-0 shadow-md">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-red-600 flex items-center justify-center text-white font-bold text-sm">
              {index + 1}
            </div>
          </div>
          <div className="flex-1">
            <div
              className="mb-4 text-lg font-medium"
              dangerouslySetInnerHTML={{ __html: q.promptHtml }}
            />
            <div className="flex items-center gap-4 mb-4">
              <div
                className={`px-6 py-3 rounded-xl border-2 font-semibold ${
                  q.correct
                    ? "border-green-300 bg-green-50 text-green-800"
                    : "border-red-300 bg-red-50 text-red-800"
                }`}
              >
                <div className="flex items-center gap-2">
                  {q.correct ? (
                    <CheckCircleOutlined className="text-green-500" />
                  ) : (
                    <ClockCircleOutlined className="text-red-500" />
                  )}
                  <span>{q.correct ? "✅ صحيح" : "❌ خطأ"}</span>
                </div>
              </div>
            </div>
            {q.explainHtml && (
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                <div className="text-blue-800 font-medium mb-2">💡 التفسير:</div>
                <div
                  className="text-blue-700"
                  dangerouslySetInnerHTML={{ __html: q.explainHtml }}
                />
              </div>
            )}
          </div>
        </div>
      </Card>
    );
  }

  if (q.type === "essay") {
    return (
      <Card className="question-card border-0 shadow-md">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
              {index + 1}
            </div>
          </div>
          <div className="flex-1">
            <div
              className="mb-4 text-lg font-medium"
              dangerouslySetInnerHTML={{ __html: q.promptHtml }}
            />
            {q.modelAnswerHtml && (
              <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                <div className="flex items-center gap-2 mb-3">
                  <Star className="w-4 h-4 text-purple-600" />
                  <span className="font-medium text-purple-800">الإجابة النموذجية</span>
                </div>
                <div
                  className="text-purple-700"
                  dangerouslySetInnerHTML={{ __html: q.modelAnswerHtml }}
                />
              </div>
            )}
          </div>
        </div>
      </Card>
    );
  }

  // complete
  return (
    <Card className="question-card border-0 shadow-md">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
            {index + 1}
          </div>
        </div>
        <div className="flex-1">
          {q.promptHtml && (
            <div
              className="mb-4 text-lg font-medium"
              dangerouslySetInnerHTML={{ __html: q.promptHtml }}
            />
          )}
          {q.completeTextHtml && (
            <div
              className="mb-3"
              dangerouslySetInnerHTML={{ __html: q.completeTextHtml }}
            />
          )}
          <div className="p-4 bg-cyan-50 rounded-xl border border-cyan-200">
            <div className="text-cyan-800 font-medium mb-2">✅ الإجابات المقبولة:</div>
            <div className="flex flex-wrap gap-2">
              {q.answers.map((a, i) => (
                <Tag key={i} color="cyan" className="px-3 py-1 text-sm">
                  {a.answer}
                </Tag>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

/* ---------------- Dummy data ---------------- */
const MOCK_COMPETITION = {
  id: "c-123456",
  title: "مسابقة الثقافة العامة الأسبوعية",
  type: "weekly",
  description:
    "مسابقة ممتعة تضم أسئلة منوعة في التاريخ والجغرافيا والعلوم. جاوب واربح جوائز!",
  cover:
    "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?q=80&w=1200&auto=format&fit=crop",
  startAt: new Date(Date.now() + 86400000).toISOString(),
  endAt: new Date(Date.now() + 7 * 86400000).toISOString(),
  capacity: 200,
  participants: 157,
  joined: false,
  visible: true,
  startsAtHtml:
    "<p>تبدأ المسابقة يوم <b>السبت</b> الساعة <b>9:00 صباحًا</b> بتوقيت الرياض.</p><p>المدة: 30 دقيقة.</p>",
  prizesHtml:
    "<ul><li>🥇 المركز الأول: بطاقة هدية 500 ريال</li><li>🥈 المركز الثاني: بطاقة هدية 300 ريال</li><li>🥉 المركز الثالث: بطاقة هدية 150 ريال</li></ul>",
  ideaHtml:
    "<p>تهدف المسابقة إلى نشر الثقافة العامة وتشجيع روح التحدي والمعرفة لدى الجميع.</p>",
  sections: [
    {
      id: "s-1",
      name: "القسم الرئيسي",
      descHtml: "<p>أسئلة سريعة وعامة</p>",
      questions: [
        {
          id: "q-1",
          type: "mcq",
          mcqSubType: "general",
          promptHtml: "<p>ما عاصمة فرنسا؟</p>",
          options: [
            { textHtml: "باريس", explainHtml: "العاصمة الصحيحة لفرنسا." },
            { textHtml: "روما", explainHtml: "هذه عاصمة إيطاليا." },
            { textHtml: "مدريد", explainHtml: "هذه عاصمة إسبانيا." },
            { textHtml: "برلين", explainHtml: "هذه عاصمة ألمانيا." },
          ],
          correctIndex: 0,
        },
        {
          id: "q-2",
          type: "trueFalse",
          promptHtml: "<p>الشمس كوكب.</p>",
          correct: false,
          explainHtml: "<p>الشمس <b>نجم</b> وليست كوكبًا.</p>",
        },
        {
          id: "q-3",
          type: "essay",
          promptHtml: "<p>اشرح بإيجاز نظرية فيثاغورس.</p>",
          modelAnswerHtml:
            "<p>في مثلث قائم الزاوية: <i>a² + b² = c²</i> حيث <i>c</i> هو الوتر.</p>",
        },
      ],
    },
    {
      id: "s-2",
      name: "قطعة قراءة",
      descHtml: "<p>اقرأ القطعة ثم أجب عن الأسئلة.</p>",
      questions: [
        {
          id: "q-4",
          type: "mcq",
          mcqSubType: "passage",
          passageHtml:
            "<p>اكتشف العلماء كوكبًا خارج المجموعة الشمسية يحتمل وجود الماء السائل على سطحه. هذا الاكتشاف يعد نقلة مهمة في البحث عن الحياة خارج الأرض...</p>",
          items: [
            {
              id: "p-1",
              textHtml: "ما الموضوع الرئيسي للقطعة؟",
              opts: [
                { textHtml: "اكتشاف كوكب جديد", explainHtml: "هذا هو الموضوع الأساسي" },
                { textHtml: "حياة على المريخ", explainHtml: "القطعة لا تتحدث عن المريخ" },
                { textHtml: "تاريخ وكالة ناسا", explainHtml: "لم تذكر القطعة وكالة ناسا" },
              ],
              correctIndex: 0,
            },
            {
              id: "p-2",
              textHtml: "لماذا يُعد وجود الماء السائل مهمًا؟",
              opts: [
                { textHtml: "دليل محتمل على الحياة", explainHtml: "الماء أساسي للحياة" },
                { textHtml: "يجعل الكوكب أثقل", explainHtml: "هذا ليس السبب الأهم" },
              ],
              correctIndex: 0,
            },
          ],
        },
      ],
    },
    {
      id: "s-3",
      name: "مسائل ومعادلات",
      descHtml: "<p>أسئلة رياضية/فيزيائية باستخدام LaTeX</p>",
      questions: [
        {
          id: "q-5",
          type: "mcq",
          mcqSubType: "chemical",
          equationLatex: "E=mc^2",
          answers: [
            {
              latex: "E=mc^2",
              explanationHtml: "علاقة طاقة الكتلة لأينشتاين.",
              correct: true,
            },
            {
              latex: "E=\\frac{1}{2}mv^2",
              explanationHtml: "هذه طاقة حركة، ليست نفس العلاقة.",
              correct: false,
            },
          ],
          explainHtml: "<p>اختر الصيغة الموافقة للوصف.</p>",
        },
        {
          id: "q-6",
          type: "complete",
          promptHtml: "<p>أكمل: عدد أيام الأسبوع هو ______.</p>",
          completeTextHtml: "",
          answers: [{ answer: "7" }, { answer: "سبعة" }],
        },
      ],
    },
  ],
};

/* ---------------- Page ---------------- */
const breadcrumbs = [
  { label: "الرئيسية", href: "/", icon: BarChart3 },
  { label: "المسابقات", icon: Award, href: "/competitions" },
  { label: "تفاصيل المسابقة", href: "#", current: true },
];

export default function CompetitionDetailsPage() {
  const [loading] = useState(false);
  const [item] = useState(MOCK_COMPETITION);

  const meta = useMemo(() => {
    if (!item) return null;
    const start = item.startAt ? new Date(item.startAt) : null;
    const end = item.endAt ? new Date(item.endAt) : null;
    const totalQuestions = (item.sections || []).reduce(
      (n, s) => n + (s.questions?.length || 0),
      0
    );
    const participationRate = Math.round((item.participants / item.capacity) * 100);

    let phase = "—";
    let tagColor = "default";
    const now = new Date();
    if (end && now > end) {
      phase = "انتهت";
      tagColor = "red";
    } else if (start && now < start) {
      phase = "تبدأ قريبًا";
      tagColor = "blue";
    } else if (start && end && now >= start && now <= end) {
      phase = "جارية";
      tagColor = "green";
    }

    return {
      start,
      end,
      period:
        start && end ? `${start.toLocaleString()} → ${end.toLocaleString()}` : "—",
      cap: `${item.participants}/${item.capacity}`,
      totalQuestions,
      participationRate,
      phase,
      tagColor,
    };
  }, [item]);

  // small helper for hero time chip
  const timeChip = () => {
    const now = new Date();
    if (!meta?.start || !meta?.end) return "—";
    const fmt = (ms) => {
      if (ms < 0) ms = 0;
      const d = Math.floor(ms / 86400000);
      const h = Math.floor((ms % 86400000) / 3600000);
      if (d > 0) return `${d} يوم${d === 1 ? "" : ""} و ${h} ساعة`;
      const m = Math.floor((ms % 3600000) / 60000);
      if (h > 0) return `${h} ساعة و ${m} دقيقة`;
      const s = Math.floor((ms % 60000) / 1000);
      if (m > 0) return `${m} دقيقة`;
      return `${s} ثانية`;
    };
    if (now < meta.start) return `تبدأ بعد ${fmt(meta.start - now)}`;
    if (now > meta.end) return `انتهت منذ ${fmt(now - meta.end)}`;
    return `تنتهي بعد ${fmt(meta.end - now)}`;
  };

  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50" dir="rtl">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <BreadcrumbsShowcase variant="pill" items={breadcrumbs} />

          {loading ? (
            <Skeleton active paragraph={{ rows: 8 }} />
          ) : !item ? (
            <Card className="rounded-2xl shadow-lg">
              <Alert
                type="warning"
                message="لا توجد بيانات"
                description="هذه صفحة عرض وهمية للمعاينة."
                showIcon
                className="rounded-xl"
              />
            </Card>
          ) : (
            <>
              {/* Enhanced Hero Section */}
              <Card className="mb-8 overflow-hidden border-0 shadow-2xl rounded-3xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
                <div className="relative">
                  <div className="absolute inset-0 bg-black/30"></div>
                  <Row gutter={[32, 32]} align="middle" className="relative z-10">
                    <Col xs={24} lg={14}>
                      <div className="text-white p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                            <Award className="w-8 h-8 text-white" />
                          </div>
                          <div className="flex items-center gap-3">
                            <Tag
                              color={item.visible ? "success" : "default"}
                              icon={
                                item.visible ? (
                                  <EyeTwoTone twoToneColor="#52c41a" />
                                ) : (
                                  <EyeInvisibleOutlined />
                                )
                              }
                              className="px-3 py-1 text-sm font-medium"
                            >
                              {item.visible ? "منشورة" : "مسودة"}
                            </Tag>
                            <Tag
                              color={typeColors[item.type]}
                              className="px-3 py-1 text-sm font-medium"
                            >
                              {typeLabel[item.type]}
                            </Tag>
                            <Tag color={meta.tagColor} className="px-3 py-1 text-sm font-medium">
                              {meta.phase}
                            </Tag>
                          </div>
                        </div>

                        <Title level={1} className="!text-white !mb-4 !text-3xl md:!text-4xl">
                          {item.title}
                        </Title>

                        <Paragraph className="!text-white/90 !text-lg !mb-6 leading-relaxed">
                          {item.description}
                        </Paragraph>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                          <div className="bg-white/15 rounded-2xl p-4 backdrop-blur-md border border-white/20">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-white/80 text-sm">المشاركون</span>
                              <UsergroupAddOutlined className="text-white/80" />
                            </div>
                            <div className="flex items-end gap-2">
                              <Title level={3} className="!text-white !mb-0">
                                {item.participants}
                              </Title>
                              <span className="text-white/70">/ {item.capacity}</span>
                            </div>
                            <Progress
                              percent={meta.participationRate}
                              size="small"
                              showInfo={false}
                              strokeColor="#22c55e"
                              className="mt-2"
                            />
                          </div>

                          <div className="bg-white/15 rounded-2xl p-4 backdrop-blur-md border border-white/20">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-white/80 text-sm">الفترة</span>
                              <CalendarOutlined className="text-white/80" />
                            </div>
                            <div className="text-white/90 text-sm leading-relaxed">
                              {meta.period}
                            </div>
                            <div className="mt-2 text-white/80 text-xs">{timeChip()}</div>
                          </div>

                          <div className="bg-white/15 rounded-2xl p-4 backdrop-blur-md border border-white/20">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-white/80 text-sm">عدد الأسئلة</span>
                              <QuestionCircleOutlined className="text-white/80" />
                            </div>
                            <Title level={3} className="!text-white !mb-0">
                              {meta.totalQuestions}
                            </Title>
                          </div>
                        </div>

                      </div>
                    </Col>

                    {/* Cover on the side */}
                    <Col xs={24} lg={10}>
                      <div className="p-6">
                        <div className="rounded-2xl overflow-hidden border-4 border-white/30 shadow-lg">
                          <img
                            src={
                              item.cover ||
                              "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?q=80&w=1200&auto=format&fit=crop"
                            }
                            alt="cover"
                            className="w-full h-[280px] object-cover"
                          />
                        </div>
                      </div>
                    </Col>
                  </Row>
                </div>
              </Card>

              {/* Info Sections */}
              <Row gutter={[24, 24]}>
                <Col xs={24} lg={12}>
                  <Card
                    title={
                      <div className="flex items-center gap-2">
                        <FileTextOutlined /> متى تبدأ المسابقة
                      </div>
                    }
                    className="rounded-2xl"
                  >
                    <HtmlBlock html={item.startsAtHtml} />
                    {!item.startsAtHtml && <Empty description="لا يوجد محتوى" />}
                  </Card>
                </Col>
                <Col xs={24} lg={12}>
                  <Card
                    title={
                      <div className="flex items-center gap-2">
                        <TrophyOutlined /> الجوائز والحوافز
                      </div>
                    }
                    className="rounded-2xl"
                  >
                    <HtmlBlock html={item.prizesHtml} />
                    {!item.prizesHtml && <Empty description="لا يوجد محتوى" />}
                  </Card>
                </Col>
                <Col xs={24}>
                  <Card
                    title={
                      <div className="flex items-center gap-2">
                        <QuestionCircleOutlined /> فكرة المسابقة
                      </div>
                    }
                    className="rounded-2xl"
                  >
                    <HtmlBlock html={item.ideaHtml} />
                    {!item.ideaHtml && <Empty description="لا يوجد محتوى" />}
                  </Card>
                </Col>
              </Row>

              <Divider />

              {/* Sections & Questions */}
              <Card
                title={
                  <div className="flex items-center gap-2">
                    <QuestionCircleOutlined />
                    <span>الأسئلة</span>
                    <Tag color="blue" className="ms-2">
                      {(item.sections || []).reduce(
                        (n, s) => n + (s.questions?.length || 0),
                        0
                      )}{" "}
                      سؤال
                    </Tag>
                  </div>
                }
                className="rounded-2xl"
              >
                {(item.sections || []).length === 0 ? (
                  <Empty description="لا توجد أقسام" />
                ) : (
                  <div className="space-y-10">
                    {item.sections.map((sec) => (
                      <div key={sec.id} className="space-y-4">
                        <div className="flex items-center gap-3">
                          <Title level={4} className="!mb-0">
                            {sec.name}
                          </Title>
                          <Tag>{sec.questions?.length || 0} سؤال</Tag>
                        </div>
                        {sec.descHtml ? (
                          <div
                            className="text-gray-600"
                            dangerouslySetInnerHTML={{ __html: sec.descHtml }}
                          />
                        ) : null}

                        {(sec.questions || []).length === 0 ? (
                          <Empty description="لا توجد أسئلة في هذا القسم" />
                        ) : (
                          <div className="space-y-6">
                            {sec.questions.map((q, idx) => (
                              <div key={q.id}>{renderQuestion(q, idx)}</div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </Card>

              <style jsx global>{`
                .ant-card {
                  border-radius: 12px;
                }
                .prose :where(img) {
                  max-width: 100%;
                  border-radius: 12px;
                }
              `}</style>
            </>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
