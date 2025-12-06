"use client";

import React, { useState } from "react";
import {
  Tabs,
  Form,
  Button as AntButton,
  Space,
  Card,
  message,
  Progress,
  Badge,
  Tooltip,
} from "antd";
import {
  SaveOutlined,
  EyeOutlined,
  FileTextOutlined,
  QuestionCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { Plus as PlusIcon, Award, BarChart3 } from "lucide-react";
import { useRouter } from "next/navigation";
import "react-quill-new/dist/quill.snow.css";
import BasicData from "./BasicData";
import CompetitionsQuestions from "./CompetitionsQuestions";
import PagesHeader from "../../../../components/ui/PagesHeader";
import PageLayout from "../../../../components/layout/PageLayout";
import BreadcrumbsShowcase from "../../../../components/ui/BreadCrumbs";

const STORAGE_KEY = "competitions_created";

const fileFromList = (fileList) => fileList?.[0]?.originFileObj ?? null;

const breadcrumbs = [
  { label: "الرئيسية", href: "/", icon: BarChart3 },
  { label: "المسابقات", icon: Award, href: "/competitions" },
  {label :" إنشاء مسابقة" , href:"#", current:true},
];

export default function AddCompetitionPage() {
  const router = useRouter();
  const [form] = Form.useForm();
  const [activeKey, setActiveKey] = useState("basic");
  const [saving, setSaving] = useState(false);
  const [sectionsState, setSectionsState] = useState([]); // from QuestionsBuilder

  // Calculate completion progress
  const getCompletionProgress = () => {
    let progress = 0;
    const fields = form.getFieldsValue();

    if (fields.title?.trim()) progress += 25;
    if (fields.description?.trim()) progress += 15;
    if (fields.type) progress += 10;
    if (fields.range?.[0] && fields.range?.[1]) progress += 20;

    const totalQuestions = sectionsState.reduce(
      (n, s) => n + (s.questions?.length || 0),
      0
    );
    if (totalQuestions > 0) progress += 30;

    return Math.min(progress, 100);
  };

  const saveToStorage = (item) => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const arr = raw ? JSON.parse(raw) : [];
      localStorage.setItem(STORAGE_KEY, JSON.stringify([item, ...arr]));
    } catch {}
  };

  const handleSubmit = async (publish = false) => {
    try {
      setSaving(true);
      const v = await form.validateFields();

      // ensure at least one question
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
      const preview = fileObj
        ? URL.createObjectURL(fileObj)
        : "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?q=80&w=1200&auto=format&fit=crop";

      const payload = {
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
        visible: publish,
        startsAtHtml: v.startsAtRich || "",
        prizesHtml: v.prizes || "",
        ideaHtml: v.idea || "",
        sections: sectionsState, // full builder output
      };

      saveToStorage(payload);
      message.success({
        content: publish
          ? "تم إنشاء ونشر المسابقة بنجاح! 🎉"
          : "تم حفظ المسودة بنجاح ✅",
        duration: 3,
      });
      router.push("/competitions");
    } catch (err) {
      // move to questions tab if fields ok but questions missing
      if (!Array.isArray(err?.errorFields) || err?.errorFields?.length === 0) {
        setActiveKey("questions");
      }
    } finally {
      setSaving(false);
    }
  };

  const totalQuestions = sectionsState.reduce(
    (n, s) => n + (s.questions?.length || 0),
    0
  );
  const completionProgress = getCompletionProgress();

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
      children: <BasicData />,
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
          <CompetitionsQuestions />
        </div>
      ),
    },
  ];

  return (
   <PageLayout>
     <div
      className="min-h-screen "
      dir="rtl"
    >
      <BreadcrumbsShowcase variant="pill" items={breadcrumbs}/>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <PagesHeader
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
          title={" إنشاء مسابقة جديدة"}
          subtitle={" قم بإنشاء مسابقة تفاعلية مع أسئلة متنوعة وجوائز مميزة"}
        />

        {/* Enhanced Form */}
        <Form
          form={form}
          layout="vertical"
          initialValues={{ type: "daily", capacity: 50 }}
        >
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

        .ant-progress-bg {
          transition: all 0.3s ease !important;
        }

        .ant-btn {
          transition: all 0.2s ease !important;
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
