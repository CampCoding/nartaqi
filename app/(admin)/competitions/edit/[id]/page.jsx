"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Tabs,
  Form,
  Button as AntButton,
  Card,
  message,
  Badge,
  Tooltip,
  Alert,
  Skeleton,
} from "antd";
import {
  SaveOutlined,
  EyeOutlined,
  FileTextOutlined,
  QuestionCircleOutlined,
  CheckCircleOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { Award, BarChart3 } from "lucide-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import dayjs from "dayjs";
import "react-quill-new/dist/quill.snow.css";

import BasicData from "../../add/BasicData";
import CompetitionsQuestions from "../../add/CompetitionsQuestions";
import PageLayout from "../../../../../components/layout/PageLayout";
import BreadcrumbsShowcase from "../../../../../components/ui/BreadCrumbs";
import PagesHeader from "../../../../../components/ui/PagesHeader";

const STORAGE_KEY = "competitions_created";
const fileFromList = (fileList) => fileList?.[0]?.originFileObj ?? null;

const breadcrumbs = [
  { label: "الرئيسية", href: "/", icon: BarChart3 },
  { label: "المسابقات", icon: Award, href: "/competitions" },
  { label: "تعديل مسابقة", href: "#", current: true },
];

/* ---------------- Dummy fallback ---------------- */
const MOCK_COMPETITION_EDIT = {
  id: "demo-edit-1",
  title: "✏️ تعديل — مسابقة الثقافة العامة",
  type: "weekly",
  description:
    "نسخة تجريبية للتعديل — أسئلة متنوعة في التاريخ والعلوم والجغرافيا.",
  cover:
    "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?q=80&w=1200&auto=format&fit=crop",
  startAt: new Date(Date.now() + 2 * 3600_000).toISOString(), // بعد ساعتين
  endAt: new Date(Date.now() + 5 * 24 * 3600_000).toISOString(), // بعد 5 أيام
  capacity: 150,
  participants: 48,
  joined: false,
  visible: false,
  startsAtHtml:
    "<p>تبدأ المسابقة يوم <b>الخميس</b> الساعة <b>8:00 مساءً</b> بتوقيت الرياض.</p>",
  prizesHtml:
    "<ul><li>🥇 400 ريال</li><li>🥈 250 ريال</li><li>🥉 100 ريال</li></ul>",
  ideaHtml: "<p>نهدف إلى نشر الثقافة العامة بطريقة ممتعة وتنافسية.</p>",
  sections: [
    {
      id: "s-1",
      name: "القسم الرئيسي",
      descHtml: "<p>أسئلة قصيرة</p>",
      questions: [
        {
          id: "q-1",
          type: "mcq",
          mcqSubType: "general",
          promptHtml: "<p>ما هي عاصمة اليابان؟</p>",
          options: [
            { textHtml: "طوكيو", explainHtml: "الإجابة الصحيحة." },
            { textHtml: "كيوتو", explainHtml: "" },
            { textHtml: "أوساكا", explainHtml: "" },
            { textHtml: "ناجويا", explainHtml: "" },
          ],
          correctIndex: 0,
        },
        {
          id: "q-2",
          type: "trueFalse",
          promptHtml: "<p>المحيط الأطلسي أكبر من الهادئ.</p>",
          correct: false,
          explainHtml: "<p>المحيط الهادئ هو الأكبر.</p>",
        },
      ],
    },
  ],
};

export default function EditCompetitionPage() {
  const params = useParams();
  const search = useSearchParams();
  const router = useRouter();
  const id = (params && params.id) || (search && search.get("id")) || "";

  const [form] = Form.useForm();
  const [activeKey, setActiveKey] = useState("basic");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [item, setItem] = useState(null);
  const [sectionsState, setSectionsState] = useState([]);

  // Load existing OR dummy
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const arr = raw ? JSON.parse(raw) : [];
      const found = arr.find((c) => c.id === id);
      const source = found || { ...MOCK_COMPETITION_EDIT, id: id || MOCK_COMPETITION_EDIT.id };

      setItem(source);

      // Prime form fields
      const initialCoverFile = source.cover
        ? [{ uid: "-1", name: "cover.jpg", status: "done", url: source.cover }]
        : [];

      form.setFieldsValue({
        title: source.title,
        type: source.type,
        description: source.description,
        range:
          source.startAt && source.endAt
            ? [dayjs(source.startAt), dayjs(source.endAt)]
            : undefined,
        capacity: source.capacity,
        coverFile: initialCoverFile,
        startsAtRich: source.startsAtHtml || "",
        prizes: source.prizesHtml || "",
        idea: source.ideaHtml || "",
      });

      setSectionsState(source.sections || []);
    } catch (e) {
      console.error(e);
      // fallback to dummy if anything goes wrong
      const source = { ...MOCK_COMPETITION_EDIT, id: id || MOCK_COMPETITION_EDIT.id };
      setItem(source);
      setSectionsState(source.sections || []);
      form.setFieldsValue({
        title: source.title,
        type: source.type,
        description: source.description,
        range: [dayjs(source.startAt), dayjs(source.endAt)],
        capacity: source.capacity,
        coverFile: [{ uid: "-1", name: "cover.jpg", status: "done", url: source.cover }],
        startsAtRich: source.startsAtHtml,
        prizes: source.prizesHtml,
        idea: source.ideaHtml,
      });
    } finally {
      setLoading(false);
    }
  }, [id, form]);

  const completionProgress = useMemo(() => {
    const fields = form.getFieldsValue();
    let progress = 0;
    if (fields.title?.trim()) progress += 25;
    if (fields.description?.trim()) progress += 15;
    if (fields.type) progress += 10;
    if (fields.range?.[0] && fields.range?.[1]) progress += 20;
    const totalQs = sectionsState.reduce(
      (n, s) => n + (s.questions?.length || 0),
      0
    );
    if (totalQs > 0) progress += 30;
    return Math.min(progress, 100);
  }, [form, sectionsState]);

  const totalQuestions = useMemo(
    () => sectionsState.reduce((n, s) => n + (s.questions?.length || 0), 0),
    [sectionsState]
  );

  const upsertInStorage = (updated) => {
    const raw = localStorage.getItem(STORAGE_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    const idx = arr.findIndex((c) => c.id === updated.id);
    if (idx >= 0) arr[idx] = updated;
    else arr.unshift(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
  };

  const handleSubmit = async (publish = false) => {
    if (!item) return;
    try {
      setSaving(true);
      const v = await form.validateFields();

      const totalQs = sectionsState.reduce(
        (n, s) => n + (s.questions?.length || 0),
        0
      );
      if (totalQs === 0) {
        message.error("أضف سؤالًا واحدًا على الأقل في تبويب الأسئلة.");
        setActiveKey("questions");
        setSaving(false);
        return;
      }

      const [start, end] = v.range || [];
      const fileObj = fileFromList(v.coverFile);
      const cover = fileObj
        ? URL.createObjectURL(fileObj)
        : item.cover ||
          "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?q=80&w=1200&auto=format&fit=crop";

      const payload = {
        ...item,
        title: v.title.trim(),
        type: v.type,
        description: v.description?.trim() || "",
        cover,
        startAt: start ? (start.toISOString ? start.toISOString() : start.toDate().toISOString()) : null,
        endAt: end ? (end.toISOString ? end.toISOString() : end.toDate().toISOString()) : null,
        capacity: Number(v.capacity) || 50,
        visible: publish,
        startsAtHtml: v.startsAtRich || "",
        prizesHtml: v.prizes || "",
        ideaHtml: v.idea || "",
        sections: sectionsState,
      };

      upsertInStorage(payload);
      message.success({
        content: publish
          ? "تم حفظ التعديلات ونشر المسابقة 🎉"
          : "تم حفظ التعديلات كمسودة ✅",
        duration: 3,
      });
      router.push("/competitions");
    } catch (err) {
      if (!Array.isArray(err?.errorFields) || err?.errorFields?.length === 0) {
        setActiveKey("questions");
      }
    } finally {
      setSaving(false);
    }
  };

  const tabItems = [
    {
      key: "basic",
      label: (
        <div className="flex items-center gap-2">
          <FileTextOutlined />
          <span>البيانات الأساسية</span>
          {completionProgress >= 70 && (
            <CheckCircleOutlined className="text-green-500" />
          )}
        </div>
      ),
      children: <BasicData />, // shares parent <Form> context
    },
    {
      key: "questions",
      label: (
        <div className="flex items-center gap-2">
          <QuestionCircleOutlined />
          <span>الأسئلة</span>
          {totalQuestions > 0 && (
            <Badge
              count={totalQuestions}
              size="small"
              style={{ backgroundColor: "#52c41a" }}
            />
          )}
        </div>
      ),
      children: (
        <div className="space-y-6">
          <CompetitionsQuestions value={sectionsState} onChange={setSectionsState} />
        </div>
      ),
    },
  ];

  return (
    <PageLayout>
      <div className="min-h-screen" dir="rtl">
        <BreadcrumbsShowcase variant="pill" items={breadcrumbs} />

        <div className="max-w-7xl mx-auto px-4 py-8">
          {loading ? (
            <Skeleton active paragraph={{ rows: 10 }} />
          ) : !item ? (
            <Card>
              <Alert
                type="warning"
                message="لم يتم العثور على المسابقة"
                description="سيتم استخدام بيانات تجريبية تلقائياً إذا لم تتوفر بيانات حقيقية."
                showIcon
              />
              <AntButton
                className="mt-4"
                icon={<ArrowLeftOutlined />}
                onClick={() => router.push("/competitions")}
              >
                العودة للمسابقات
              </AntButton>
            </Card>
          ) : (
            <>
              <PagesHeader
                title={`تعديل: ${item.title}`}
                subtitle="هذه الصفحة مُعبأة ببيانات وهمية للتجربة إن لم تتوفر بيانات حقيقية."
                extra={
                  <div className="flex flex-col gap-3">
                    <Tooltip title="احفظ التغييرات كمسودة">
                      <AntButton
                        size="large"
                        icon={<SaveOutlined />}
                        onClick={() => handleSubmit(false)}
                        loading={saving}
                        className="shadow-sm hover:shadow-md transition-all duration-200"
                      >
                        حفظ كمسودة
                      </AntButton>
                    </Tooltip>

                    <Tooltip title="انشر المسابقة للجمهور">
                      <AntButton
                        type="primary"
                        size="large"
                        icon={<EyeOutlined />}
                        onClick={() => handleSubmit(true)}
                        loading={saving}
                        disabled={completionProgress < 100}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 border-0 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
                      >
                        حفظ ونشر
                      </AntButton>
                    </Tooltip>
                  </div>
                }
              />

              <Form form={form} layout="vertical" initialValues={{ type: "daily", capacity: 50 }}>
                <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
                  <Tabs
                    activeKey={activeKey}
                    onChange={setActiveKey}
                    items={tabItems}
                    size="large"
                    className="custom-tabs"
                    tabBarStyle={{
                      marginBottom: 24,
                      borderBottom: "2px solid #f0f0f0",
                    }}
                  />
                </Card>
              </Form>
            </>
          )}
        </div>

        <style jsx global>{`
          .custom-tabs .ant-tabs-tab .ant-tabs-tab-btn {
            color: #595959;
            padding: 0px 10px;
          }
          .custom-tabs .ant-tabs-tab:hover .ant-tabs-tab-btn {
            color: #1890ff;
          }
          .custom-tabs .ant-tabs-tab-active {
            background: linear-gradient(135deg, #1890ff 0%, #722ed1 100%);
            border-radius: 8px 8px 0 0;
          }
          .custom-tabs .ant-tabs-tab-active .ant-tabs-tab-btn {
            color: #fff !important;
          }
          .custom-tabs .ant-tabs-tab-active:hover .ant-tabs-tab-btn {
            color: #fff !important;
          }
          .ant-card {
            border-radius: 12px !important;
          }
          .ant-form-item-label > label {
            font-weight: 500 !important;
          }
        `}</style>
      </div>
    </PageLayout>
  );
}
