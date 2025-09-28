"use client";

import Button from "@/components/atoms/Button";
import { Card, Collapse, Empty, Tag, Tooltip, Badge, Divider, Modal, Input, Checkbox } from "antd";
import {
  Eye,
  EyeOff,
  FileText,
  Play,
  Target,
  Trash2,
  Plus,
  Video,
  ExternalLink,
  Upload,
  BookOpen,
  Copy
} from "lucide-react";
import React, { useMemo, useState } from "react";

const { Panel } = Collapse;
const { Search } = Input;

export default function CourseSourceBasicLevel({
  stats,
  deleteLesson,
  deleteStage,
  toggleStageVisibility,
  toggleLessonVisibility,
  foundationStages,
  setOpenAddLesson,
  setOpenAddStage,
  addTrainingFiles,
  removeTrainingFile,

  /** ✅ جديدة: لائحة الدورات الهدف */
  duplicateTargets = [],
  /** ✅ جديد: كولباك النسخ */
  onCopy, // (ctx, targetIds) => Promise|void
}) {
  // helper to open the hidden input for a specific lesson
  const openPicker = (stageId, lessonId) => {
    const input = document.getElementById(`pdf-picker-${stageId}-${lessonId}`);
    if (input) input.click();
  };

  // handle file selection for a lesson
  const onFilesPicked = (stageId, lessonId, e) => {
    const files = Array.from(e.target.files || []);
    if (files.length && typeof addTrainingFiles === "function") {
      addTrainingFiles(stageId, lessonId, files);
    } else {
      console.warn("addTrainingFiles(stageId, lessonId, files[]) not provided.");
    }
    e.target.value = "";
  };

  /* ========== نسخ: الحالة العامة للمودال ========== */
  const [copyOpen, setCopyOpen] = useState(false);
  const [copyLoading, setCopyLoading] = useState(false);
  const [copyError, setCopyError] = useState("");
  const [targetsSearch, setTargetsSearch] = useState("");
  const [selectedTargets, setSelectedTargets] = useState([]);

  // سياق النسخ: كل/قسم/محاضرة + عناوين لعرضها في المودال
  const [copyCtx, setCopyCtx] = useState({ type: "all" });

  const filteredTargets = useMemo(() => {
    const term = (targetsSearch || "").toLowerCase();
    if (!term) return duplicateTargets;
    return duplicateTargets.filter((t) => t.title?.toLowerCase().includes(term));
  }, [duplicateTargets, targetsSearch]);

  const toggleTarget = (id) => {
    setSelectedTargets((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleAllTargets = () => {
    if (selectedTargets.length === filteredTargets.length) {
      setSelectedTargets([]);
    } else {
      setSelectedTargets(filteredTargets.map((t) => t.id));
    }
  };

  const openCopyModal = (ctx) => {
    setCopyCtx(ctx);
    setCopyError("");
    setSelectedTargets([]);
    setTargetsSearch("");
    setCopyOpen(true);
  };

  const confirmCopy = async () => {
    if (selectedTargets.length === 0) {
      setCopyError("برجاء اختيار دورة/دورات الهدف أولاً.");
      return;
    }
    try {
      setCopyLoading(true);
      if (typeof onCopy === "function") {
        await onCopy(copyCtx, selectedTargets);
      } else {
        console.log("COPY ->", { ctx: copyCtx, to: selectedTargets });
      }
      setCopyOpen(false);
    } catch (e) {
      setCopyError(e?.message || "تعذّر النسخ، جرّب مرة أخرى.");
    } finally {
      setCopyLoading(false);
    }
  };

  // عنوان السياق لواجهة المودال
  const ctxTitle = useMemo(() => {
    if (copyCtx.type === "all") return "نسخ مرحلة التأسيس كاملة";
    if (copyCtx.type === "stage") return `نسخ القسم: ${copyCtx.title ?? copyCtx.stageId}`;
    return `نسخ المحاضرة: ${copyCtx.title ?? copyCtx.lessonId}`;
  }, [copyCtx]);

  return (
    <div className="w-full">
      {/* Header Card */}
      <Card className="mb-6 shadow-lg border-0 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-800 m-0">مرحلة التأسيس</h2>
            </div>
            <div className="flex items-center gap-3">
              <Badge
                count={stats.stageCount}
                showZero
                color="blue"
                className="[&_.ant-badge-count]:bg-blue-500"
              >
                <span className="text-sm text-gray-600 font-medium px-3 py-1 bg-white rounded-full">
                  الأقسام
                </span>
              </Badge>
              <Badge
                count={stats.lessonCount}
                showZero
                color="green"
                className="[&_.ant-badge-count]:bg-green-500"
              >
                <span className="text-sm text-gray-600 font-medium px-3 py-1 bg-white rounded-full">
                  المحاضرات
                </span>
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* ✅ زر نسخ كل المحتوى */}
            <Button
              className="!bg-emerald-600 hover:!bg-emerald-700 !text-white !border-0 shadow-md transition-all duration-200 flex items-center gap-2"
              onClick={() => openCopyModal({ type: "all", title: "مرحلة التأسيس" })}
            >
              <Copy className="w-4 h-4" />
              نسخ الكل
            </Button>
            <Button
              className="!bg-gray-700 hover:!bg-gray-800 !text-white !border-0 shadow-md transition-all duration-200 flex items-center gap-2"
              onClick={() => setOpenAddStage(true)}
            >
              <Plus className="w-4 h-4" />
              إضافة قسم
            </Button>
            <Button
              type="primary"
              className="!bg-blue-600 hover:!bg-blue-700 !text-white !border-0 shadow-md transition-all duration-200 flex items-center gap-2"
              onClick={() => setOpenAddLesson(true)}
            >
              <Plus className="w-4 h-4" />
              إضافة محاضرة
            </Button>
          </div>
        </div>
      </Card>

      {/* Content Area */}
      <Card className="shadow-lg !h-fit border-0" bodyStyle={{ padding: "0" }}>
        {foundationStages.length === 0 ? (
          <div className="p-12">
            <Empty
              description={
                <div className="text-center">
                  <p className="text-gray-500 text-lg mb-2">لا توجد أقسام بعد</p>
                  <p className="text-gray-400 text-sm">ابدأ بإضافة أقسام جديدة لتنظيم المحتوى</p>
                </div>
              }
              className="my-8"
            />
          </div>
        ) : (
          <Collapse accordion className="border-0 !h-full" expandIconPosition="end">
            {foundationStages.map((st, stageIndex) => (
              <Panel
                key={st.id}
                header={
                  <div className="flex items-center justify-between w-full pr-4">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          st.visible ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {stageIndex + 1}
                      </div>
                      <div className="flex items-center gap-3">
                        <Tooltip title={st.visible ? "إخفاء القسم" : "إظهار القسم"}>
                          <Button
                            type="text"
                            size="small"
                            className={`!p-1 hover:!bg-gray-100 ${
                              st.visible ? "!text-green-600" : "!text-gray-400"
                            }`}
                            icon={st.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleStageVisibility(st.id);
                            }}
                          />
                        </Tooltip>
                        <h3
                          className={`font-semibold text-lg m-0 ${
                            st.visible ? "text-gray-800" : "text-gray-400"
                          }`}
                        >
                          القسم : {st.title}
                        </h3>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {/* ✅ نسخ القسم */}
                      <Tooltip title="نسخ هذا القسم إلى دورات أخرى">
                        <Button
                          type="text"
                          size="small"
                          className="!p-1 hover:!bg-emerald-50 !text-emerald-600"
                          icon={<Copy className="w-4 h-4" />}
                          onClick={(e) => {
                            e.stopPropagation();
                            openCopyModal({ type: "stage", stageId: st.id, title: st.title });
                          }}
                        />
                      </Tooltip>
                      <Badge
                        count={st.lessons?.length || 0}
                        showZero
                        size="small"
                        className="[&_.ant-badge-count]:bg-indigo-500 [&_.ant-badge-count]:text-xs"
                      >
                        <span className="text-xs text-gray-500 font-medium">المحاضرات</span>
                      </Badge>
                      <Tooltip title="حذف القسم">
                        <Button
                          danger
                          type="text"
                          size="small"
                          className="!p-1 hover:!bg-red-50"
                          icon={<Trash2 className="w-4 h-4" />}
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteStage(st.id);
                          }}
                        />
                      </Tooltip>
                    </div>
                  </div>
                }
                className="!border-0 !mb-2"
                style={{
                  backgroundColor: st.visible ? "#fafafa" : "#f5f5f5",
                  borderRadius: "12px",
                  marginBottom: "8px",
                }}
              >
                <div className="px-6 pb-4">
                  {(st.lessons || []).length === 0 ? (
                    <div className="text-center py-8">
                      <Empty
                        description="لا توجد محاضرات في هذه القسم"
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        className="!text-gray-400"
                      />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {st.lessons.map((l, lessonIndex) => {
                        const pdfs = l?.training?.pdfs || [];
                        return (
                          <div
                            key={l.id}
                            className={`relative rounded-xl border-2 p-6 transition-all duration-300 hover:shadow-md ${
                              l.visible
                                ? "bg-white border-blue-100 hover:border-blue-200"
                                : "bg-gray-50 border-gray-200 opacity-75"
                            }`}
                          >
                   

                            {/* Lesson Number Badge */}
                            <div className="absolute -top-3 -right-3 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-md">
                              {lessonIndex + 1}
                            </div>

                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                {/* Lesson Header */}
                                <div className="flex items-start gap-4 mb-4">
                                  <div className="rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 p-3 text-blue-700">
                                    <Play className="w-5 h-5" />
                                  </div>
                                  <div className="flex-1">
                                    <h4
                                      className={`font-bold text-lg mb-2 ${
                                        l.visible ? "text-gray-800" : "text-gray-500"
                                      }`}
                                    >
                                      المحاضرة : {l.title}
                                    </h4>

                                    {/* Main Video Section */}
                                    <div className="bg-blue-50 rounded-lg p-4 mb-4">
                                      <div className="flex items-center gap-2 mb-3">
                                        <Video className="w-4 h-4 text-blue-600" />
                                        <Tag color="blue" className="!mb-0 font-medium">
                                          فيديو : {l?.lessonVideo?.title}
                                        </Tag>
                                      </div>
                                      <div className="flex items-center gap-3 text-sm text-gray-700">
                                        <span className="font-medium">
                                          {l.lessonVideo?.title || "غير محدد"}
                                        </span>
                                        {l.lessonVideo?.source === "url" && l.lessonVideo?.url ? (
                                          <a
                                            href={l.lessonVideo.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium"
                                          >
                                            مشاهدة
                                            <ExternalLink className="w-3 h-3" />
                                          </a>
                                        ) : (
                                          <span className="text-gray-500">ملف مرفوع</span>
                                        )}
                                      </div>
                                    </div>

                                    {/* Training Section */}
                                    <div className="bg-amber-50 rounded-lg p-4">
                                      <div className="flex items-center gap-2 mb-3">
                                        <Target className="w-4 h-4 text-amber-600" />
                                        <Tag color="gold" className="!mb-0 font-medium">
                                          تدريب
                                        </Tag>
                                      </div>

                                      {/* Training Video */}
                                      <div className="flex items-center gap-3 text-sm text-gray-700 mb-4">
                                        <span className="font-medium">
                                          فيديو: {l.training?.video?.title || "غير محدد"}
                                        </span>
                                        {l.training?.video?.source === "url" && l.training?.video?.url ? (
                                          <a
                                            href={l.training.video.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium"
                                          >
                                            مشاهدة
                                            <ExternalLink className="w-3 h-3" />
                                          </a>
                                        ) : l.training?.video ? (
                                          <span className="text-gray-500">ملف مرفوع</span>
                                        ) : null}
                                      </div>

                                      <Divider className="!my-4" />

                                      {/* PDF Files Section */}
                                      <div>
                                        <div className="flex items-center justify-between mb-3">
                                          <div className="flex items-center gap-2">
                                            <FileText className="w-4 h-4 text-indigo-600" />
                                            <Tag color="geekblue" className="!mb-0 font-medium">
                                              ملفات PDF
                                            </Tag>
                                            <Badge count={pdfs.length} showZero size="small" />
                                          </div>
                                          <Button
                                            type="dashed"
                                            size="small"
                                            className="!border-indigo-300 !text-indigo-600 hover:!border-indigo-400 hover:!text-indigo-700 flex items-center gap-1"
                                            onClick={() => openPicker(st.id, l.id)}
                                          >
                                            <Upload className="w-3 h-3" />
                                            إضافة ملفات
                                          </Button>
                                        </div>

                                        {pdfs.length > 0 && (
                                          <div className="space-y-2">
                                            {pdfs.map((f, idx) => {
                                              const key = f?.id ?? idx;
                                              const label = f?.title || f?.name || `ملف ${idx + 1}`;
                                              const isUrl = f?.source === "url" && f?.url;

                                              return (
                                                <div
                                                  key={key}
                                                  className="flex items-center justify-between rounded-lg border bg-white p-3 hover:shadow-sm transition-shadow"
                                                >
                                                  <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                                                      <FileText className="w-4 h-4 text-red-600" />
                                                    </div>
                                                    <span className="text-gray-800 font-medium">{label}</span>
                                                  </div>
                                                  <div className="flex items-center gap-2">
                                                    {isUrl ? (
                                                      <a
                                                        href={f.url}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
                                                      >
                                                        عرض
                                                        <ExternalLink className="w-3 h-3" />
                                                      </a>
                                                    ) : (
                                                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                                        ملف مرفوع
                                                      </span>
                                                    )}
                                                    <Tooltip title="حذف الملف">
                                                      <Button
                                                        danger
                                                        type="text"
                                                        size="small"
                                                        icon={<Trash2 className="w-4 h-4" />}
                                                        className="!p-1 hover:!bg-red-50"
                                                        onClick={() => {
                                                          if (typeof removeTrainingFile === "function") {
                                                            removeTrainingFile(st.id, l.id, f?.id ?? idx);
                                                          } else {
                                                            console.warn(
                                                              "removeTrainingFile(stageId, lessonId, fileKey) not provided."
                                                            );
                                                          }
                                                        }}
                                                      />
                                                    </Tooltip>
                                                  </div>
                                                </div>
                                              );
                                            })}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Action Buttons */}
                              <div className="flex items-start gap-1 ml-4">
                                {/* ✅ نسخ المحاضرة */}
                                <Tooltip title="نسخ هذه المحاضرة إلى دورات أخرى">
                                  <Button
                                    type="text"
                                    size="small"
                                    className="!p-2 hover:!bg-emerald-50 !text-emerald-600"
                                    icon={<Copy className="w-4 h-4" />}
                                    onClick={() =>
                                      openCopyModal({
                                        type: "lesson",
                                        stageId: st.id,
                                        lessonId: l.id,
                                        title: l.title,
                                      })
                                    }
                                  />
                                </Tooltip>
                                <Tooltip title={l.visible ? "إخفاء المحاضرة" : "إظهار المحاضرة"}>
                                  <Button
                                    type="text"
                                    size="small"
                                    className={`!p-2 hover:!bg-gray-100 ${
                                      l.visible ? "!text-green-600" : "!text-gray-400"
                                    }`}
                                    icon={l.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                    onClick={() => toggleLessonVisibility(st.id, l.id)}
                                  />
                                </Tooltip>
                                <Tooltip title="حذف المحاضرة">
                                  <Button
                                    danger
                                    size="small"
                                    className="!p-2 hover:!bg-red-50"
                                    onClick={() => deleteLesson(st.id, l.id)}
                                    icon={<Trash2 className="w-4 h-4" />}
                                  />
                                </Tooltip>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </Panel>
            ))}
          </Collapse>
        )}
      </Card>

      {/* ✅ مودال النسخ */}
      <Modal
        open={copyOpen}
        onCancel={() => setCopyOpen(false)}
        onOk={confirmCopy}
        okText={copyLoading ? "جارٍ النسخ..." : "نسخ"}
        cancelText="إلغاء"
        okButtonProps={{className:"!bg-blue-500 text-white"}}
        confirmLoading={copyLoading}
        width={560}
        title="نسخ إلى دورات أخرى"
      >
        <div className="space-y-3" dir="rtl">
          <div className="text-sm text-gray-700">
            <span className="font-semibold">السياق:</span> {ctxTitle}
          </div>

          <Search 
           className="w-full !h-full"
            placeholder="ابحث عن دورة هدف..."
            allowClear
            onChange={(e) => setTargetsSearch(e.target.value)}
          />

          <div className="flex items-center justify-between">
            <button
              type="button"
              className="text-xs px-2 py-1 rounded border hover:bg-gray-50"
              onClick={toggleAllTargets}
            >
              {selectedTargets.length === filteredTargets.length ? "إلغاء تحديد الكل" : "تحديد الكل"}
            </button>
            <div className="text-xs text-gray-500">
              المختار: {selectedTargets.length}/{filteredTargets.length}
            </div>
          </div>

          {filteredTargets.length > 0 ? (
            <div className="max-h-64 overflow-auto space-y-2 pr-1">
              {filteredTargets.map((t) => (
                <label
                  key={t.id}
                  className={`flex items-center justify-between border rounded-lg px-3 py-2 cursor-pointer hover:bg-gray-50 ${
                    selectedTargets.includes(t.id) ? "border-emerald-400 bg-emerald-50/50" : "border-gray-200"
                  }`}
                  onClick={() => toggleTarget(t.id)}
                >
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={selectedTargets.includes(t.id)}
                      onChange={() => toggleTarget(t.id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div>
                      <div className="font-medium text-gray-900 text-sm">{t.title}</div>
                      <div className="text-xs text-gray-500">ID: {t.id}</div>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          ) : (
            <div className="p-3 rounded-lg border border-amber-200 bg-amber-50 text-amber-800 text-sm">
              لا توجد دورات مطابقة لبحثك.
            </div>
          )}

          {copyError && <div className="text-sm text-red-600">{copyError}</div>}
        </div>
      </Modal>
    </div>
  );
}
