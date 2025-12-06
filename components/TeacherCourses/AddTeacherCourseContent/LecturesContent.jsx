"use client";

import Button from "@/components/atoms/Button";
import {
  Badge,
  Card,
  Collapse,
  DatePicker,
  Divider,
  Empty,
  Tag,
  Tooltip,
} from "antd";
import {
  BookOpen,
  ExternalLink,
  Eye,
  EyeOff,
  FileText,
  Plus,
  Target,
  Trash2,
  Upload as UploadIcon,
  Video,
} from "lucide-react";
import dayjs from "dayjs";
import React from "react";

const { Panel } = Collapse;

/** شارة حالة الظهور (مشترك للأقسام والمحاضرات) */
const AvailabilityTag = ({ releaseAt, isReleased }) => {
  if (!releaseAt) return <Tag color="green">متاح الآن</Tag>;
  const opened = isReleased?.(releaseAt);
  return opened ? <Tag color="green">متاح</Tag> : <Tag color="red">لم يُفتح بعد</Tag>;
};

export default function LecturesContent({
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
  /** موجود سابقًا */
  isReleased,
  setLessonReleaseAt,
  /** جديد: جدولة الأقسام */
  setStageReleaseAt,
}) {
  // فتح مُلتقط الـ PDF لمحاضرة معينة
  const openPicker = (stageId, lessonId) => {
    const input = document.getElementById(`pdf-picker-${stageId}-${lessonId}`);
    input?.click();
  };

  // عند اختيار ملفات PDF
  const onFilesPicked = (stageId, lessonId, e) => {
    const files = Array.from(e.target.files || []);
    if (files.length && typeof addTrainingFiles === "function") {
      addTrainingFiles(stageId, lessonId, files);
    }
    e.target.value = "";
  };

  return (
    <div className="w-full" dir="rtl">
      {/* Header */}
      <Card className="mb-6 border-0 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-blue-600" />
              <h2 className="m-0 text-xl font-bold text-gray-800">مرحلة التأسيس</h2>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                count={stats.stageCount}
                showZero
                className="[&_.ant-badge-count]:bg-blue-600 [&_.ant-badge-count]:text-white"
              >
                <span className="rounded-full bg-gray-50 px-3 py-1 text-sm font-medium text-gray-600">
                  الأقسام
                </span>
              </Badge>
              <Badge
                count={stats.lessonCount}
                showZero
                className="[&_.ant-badge-count]:bg-emerald-600 [&_.ant-badge-count]:text-white"
              >
                <span className="rounded-full bg-gray-50 px-3 py-1 text-sm font-medium text-gray-600">
                  المحاضرات
                </span>
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              className="!border-0 !bg-gray-700 !text-white hover:!bg-gray-800 shadow-md flex items-center gap-2"
              onClick={() => setOpenAddStage(true)}
            >
              <Plus className="h-4 w-4" />
              إضافة قسم
            </Button>
            <Button
              type="primary"
              className="!border-0 !bg-blue-600 !text-white hover:!bg-blue-700 shadow-md flex items-center gap-2"
              onClick={() => setOpenAddLesson(true)}
            >
              <Plus className="h-4 w-4" />
              إضافة محاضرة
            </Button>
          </div>
        </div>
      </Card>

      {/* Content */}
      <Card className="border-0 shadow-lg !h-fit" bodyStyle={{ padding: 0 }}>
        {foundationStages.length === 0 ? (
          <div className="p-12">
            <Empty
              className="my-8"
              description={
                <div className="text-center">
                  <p className="mb-2 text-lg text-gray-500">لا توجد مراحل بعد</p>
                  <p className="text-sm text-gray-400">
                    ابدأ بإضافة قسم جديدة لتنظيم المحتوى
                  </p>
                </div>
              }
            />
          </div>
        ) : (
          <Collapse accordion className="border-0 !h-full" expandIconPosition="end">
            {foundationStages.map((st, stageIndex) => {
              const stageOpened = isReleased?.(st.releaseAt);
              const effectiveStageVisible = st.visible && stageOpened;

              return (
                <Panel
                  key={st.id}
                  className="!mb-2 !rounded-2xl"
                  style={{
                    backgroundColor: effectiveStageVisible ? "#fafafa" : "#f5f5f5",
                    border: 0,
                    marginBottom: 8,
                    opacity: effectiveStageVisible ? 1 : 0.85,
                  }}
                  header={
                    <div className="flex w-full items-center justify-between pr-4">
                      <div className="flex items-center gap-4">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                            effectiveStageVisible
                              ? "bg-blue-100 text-blue-700"
                              : "bg-gray-100 text-gray-400"
                          }`}
                        >
                          {stageIndex + 1}
                        </div>

                        <div className="flex items-center gap-3">
                          {/* Toggle visibility (disabled before release) */}
                          <Tooltip
                            title={
                              effectiveStageVisible
                                ? "إخفاء القسم"
                                : stageOpened
                                ? "إظهار القسم"
                                : "سيظهر تلقائياً عند موعده"
                            }
                          >
                            <Button
                              type="text"
                              size="small"
                              disabled={!stageOpened}
                              className={`!p-1 hover:!bg-gray-100 ${
                                effectiveStageVisible
                                  ? "!text-green-600"
                                  : "!text-gray-400"
                              }`}
                              icon={
                                effectiveStageVisible ? (
                                  <Eye className="h-4 w-4" />
                                ) : (
                                  <EyeOff className="h-4 w-4" />
                                )
                              }
                              onClick={(e) => {
                                e.stopPropagation();
                                if (stageOpened) toggleStageVisibility(st.id);
                              }}
                            />
                          </Tooltip>

                          <h3
                            className={`m-0 text-lg font-semibold ${
                              effectiveStageVisible
                                ? "text-gray-800"
                                : "text-gray-400"
                            }`}
                          >
                            القسم : {st.title}
                          </h3>

                          {/* حالة القسم + توقيت */}
                          <AvailabilityTag
                            releaseAt={st.releaseAt}
                            isReleased={isReleased}
                          />
                          {st.releaseAt && (
                            <Tooltip title="موعد الظهور">
                              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                                {dayjs(st.releaseAt).format("YYYY/MM/DD HH:mm")}
                              </span>
                            </Tooltip>
                          )}
                        </div>
                      </div>

                      {/* أدوات القسم: جدولة + مسح + حذف */}
                      <div
                        className="flex items-center gap-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <DatePicker
                          showTime
                          size="small"
                          placeholder="موعد ظهور القسم"
                          className="min-w-[190px]"
                          value={
                            st.releaseAt && dayjs(st.releaseAt).isValid()
                              ? dayjs(st.releaseAt)
                              : null
                          }
                          onChange={(v) => setStageReleaseAt?.(st.id, v || null)}
                        />
                        {st.releaseAt && (
                          <Button
                            size="small"
                            type="text"
                            onClick={() => setStageReleaseAt?.(st.id, null)}
                          >
                            مسح
                          </Button>
                        )}

                        <Tooltip title="حذف القسم">
                          <Button
                            danger
                            type="text"
                            size="small"
                            className="!p-1 hover:!bg-red-50"
                            icon={<Trash2 className="h-4 w-4" />}
                            onClick={() => deleteStage(st.id)}
                          />
                        </Tooltip>
                      </div>
                    </div>
                  }
                >
                  <div className="px-3 pb-4 sm:px-5">
                    {(st.lessons || []).length === 0 ? (
                      <div className="py-8 text-center">
                        <Empty
                          description="لا توجد محاضرات في هذه القسم"
                          image={Empty.PRESENTED_IMAGE_SIMPLE}
                        />
                      </div>
                    ) : (
                      <Collapse
                        accordion
                        bordered={false}
                        expandIconPosition="end"
                        className="bg-transparent"
                      >
                        {st.lessons.map((l, lessonIndex) => {
                          const pdfs = l?.training?.pdfs || [];
                          const opened = isReleased?.(l.releaseAt);

                          const header = (
                            <div className="flex w-full items-center justify-between">
                              {/* عنوان المحاضرة + شارات */}
                              <div className="flex items-center gap-3">
                                <div className="shadow-sm flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-sm font-bold text-white">
                                  {lessonIndex + 1}
                                </div>

                                <div className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:gap-3">
                                  <span
                                    className={`font-semibold ${
                                      l.visible
                                        ? "text-gray-800"
                                        : "text-gray-500"
                                    }`}
                                  >
                                    المحاضرة : {l.title}
                                  </span>

                                  <div className="flex items-center gap-2">
                                    <AvailabilityTag
                                      releaseAt={l.releaseAt}
                                      isReleased={isReleased}
                                    />
                                    <Badge count={pdfs.length} showZero size="small" />
                                    {l.releaseAt && (
                                      <Tooltip title="موعد الظهور">
                                        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                                          {dayjs(l.releaseAt).format(
                                            "YYYY/MM/DD HH:mm"
                                          )}
                                        </span>
                                      </Tooltip>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* أدوات المحاضرة */}
                              <div
                                className="flex items-center gap-1 sm:gap-2"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <DatePicker
                                  showTime
                                  size="small"
                                  placeholder="موعد الظهور"
                                  className="min-w-[190px]"
                                  value={
                                    l.releaseAt && dayjs(l.releaseAt).isValid()
                                      ? dayjs(l.releaseAt)
                                      : null
                                  }
                                  onChange={(v) =>
                                    setLessonReleaseAt(st.id, l.id, v || null)
                                  }
                                />
                                {l.releaseAt && (
                                  <Button
                                    size="small"
                                    type="text"
                                    onClick={() =>
                                      setLessonReleaseAt(st.id, l.id, null)
                                    }
                                  >
                                    مسح
                                  </Button>
                                )}

                                <Tooltip
                                  title={
                                    l.visible ? "إخفاء المحاضرة" : "إظهار المحاضرة"
                                  }
                                >
                                  <Button
                                    type="text"
                                    size="small"
                                    className={`!p-1 hover:!bg-gray-100 ${
                                      l.visible
                                        ? "!text-green-600"
                                        : "!text-gray-400"
                                    }`}
                                    icon={
                                      l.visible ? (
                                        <Eye className="h-4 w-4" />
                                      ) : (
                                        <EyeOff className="h-4 w-4" />
                                      )
                                    }
                                    onClick={() =>
                                      toggleLessonVisibility(st.id, l.id)
                                    }
                                  />
                                </Tooltip>

                                <Tooltip title="حذف المحاضرة">
                                  <Button
                                    danger
                                    size="small"
                                    className="!p-1 hover:!bg-red-50"
                                    icon={<Trash2 className="h-4 w-4" />}
                                    onClick={() => deleteLesson(st.id, l.id)}
                                  />
                                </Tooltip>
                              </div>
                            </div>
                          );

                          return (
                            <Panel
                              key={l.id}
                              header={header}
                              className={`!mb-3 !rounded-2xl transition ${
                                l.visible
                                  ? "bg-white !border !border-blue-100 hover:!border-blue-200"
                                  : "bg-gray-50 !border !border-gray-200 opacity-80"
                              }`}
                            >
                              {/* مُلتقط PDF مخفي لكل محاضرة */}
                              <input
                                id={`pdf-picker-${st.id}-${l.id}`}
                                type="file"
                                accept="application/pdf"
                                multiple
                                className="hidden"
                                onChange={(e) => onFilesPicked(st.id, l.id, e)}
                              />

                              <div className="space-y-4">
                                {/* فيديو الدرس */}
                                <Card size="small" className="border-blue-100 bg-blue-50">
                                  <div className="mb-2 flex items-center gap-2">
                                    <Video className="h-4 w-4 text-blue-600" />
                                    <Tag color="blue" className="!mb-0 font-medium">
                                      فيديو الدرس
                                    </Tag>
                                  </div>
                                  <div className="flex items-center gap-3 text-sm text-gray-700">
                                    <span className="font-medium">
                                      {l.lessonVideo?.title || "غير محدد"}
                                    </span>
                                    {l.lessonVideo?.source === "url" &&
                                    l.lessonVideo?.url ? (
                                      <a
                                        href={l.lessonVideo.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-1 font-medium text-blue-600 hover:text-blue-700"
                                      >
                                        مشاهدة <ExternalLink className="h-3 w-3" />
                                      </a>
                                    ) : l.lessonVideo ? (
                                      <span className="text-gray-500">ملف مرفوع</span>
                                    ) : null}
                                  </div>
                                </Card>

                                {/* تدريب */}
                                <Card size="small" className="border-amber-200 bg-amber-50">
                                  <div className="mb-2 flex items-center gap-2">
                                    <Target className="h-4 w-4 text-amber-600" />
                                    <Tag color="gold" className="!mb-0 font-medium">
                                      تدريب
                                    </Tag>
                                  </div>

                                  <div className="mb-3 flex items-center gap-3 text-sm text-gray-700">
                                    <span className="font-medium">
                                      فيديو: {l.training?.video?.title || "غير محدد"}
                                    </span>
                                    {l.training?.video?.source === "url" &&
                                    l.training?.video?.url ? (
                                      <a
                                        href={l.training.video.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-1 font-medium text-blue-600 hover:text-blue-700"
                                      >
                                        مشاهدة <ExternalLink className="h-3 w-3" />
                                      </a>
                                    ) : l.training?.video ? (
                                      <span className="text-gray-500">ملف مرفوع</span>
                                    ) : null}
                                  </div>

                                  <Divider className="!my-3" />

                                  {/* ملفات PDF */}
                                  <div>
                                    <div className="mb-2 flex items-center justify-between">
                                      <div className="flex items-center gap-2">
                                        <FileText className="h-4 w-4 text-indigo-600" />
                                        <Tag
                                          color="geekblue"
                                          className="!mb-0 font-medium"
                                        >
                                          ملفات PDF
                                        </Tag>
                                        <Badge
                                          count={l?.training?.pdfs?.length || 0}
                                          showZero
                                          size="small"
                                        />
                                      </div>

                                      <div onClick={(e) => e.stopPropagation()}>
                                        <Button
                                          type="dashed"
                                          size="small"
                                          className="flex items-center gap-1 !border-indigo-300 !text-indigo-600 hover:!border-indigo-400 hover:!text-indigo-700"
                                          onClick={() => openPicker(st.id, l.id)}
                                        >
                                          <UploadIcon className="h-3 w-3" />
                                          إضافة ملفات
                                        </Button>
                                      </div>
                                    </div>

                                    {(l?.training?.pdfs || []).length > 0 && (
                                      <div className="space-y-2">
                                        {l.training.pdfs.map((f, idx) => {
                                          const key = f?.id ?? idx;
                                          const label =
                                            f?.title || f?.name || `ملف ${idx + 1}`;
                                          const isUrl =
                                            f?.source === "url" && f?.url;

                                          return (
                                            <div
                                              key={key}
                                              className="flex items-center justify-between rounded-lg border bg-white p-3 transition-shadow hover:shadow-sm"
                                            >
                                              <div className="flex items-center gap-3">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100">
                                                  <FileText className="h-4 w-4 text-red-600" />
                                                </div>
                                                <span className="font-medium text-gray-800">
                                                  {label}
                                                </span>
                                              </div>

                                              <div
                                                className="flex items-center gap-2"
                                                onClick={(e) => e.stopPropagation()}
                                              >
                                                {isUrl ? (
                                                  <a
                                                    href={f.url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
                                                  >
                                                    عرض{" "}
                                                    <ExternalLink className="h-3 w-3" />
                                                  </a>
                                                ) : (
                                                  <span className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-500">
                                                    ملف مرفوع
                                                  </span>
                                                )}

                                                <Tooltip title="حذف الملف">
                                                  <Button
                                                    danger
                                                    type="text"
                                                    size="small"
                                                    icon={<Trash2 className="h-4 w-4" />}
                                                    className="!p-1 hover:!bg-red-50"
                                                    onClick={() =>
                                                      removeTrainingFile?.(
                                                        st.id,
                                                        l.id,
                                                        f?.id ?? idx
                                                      )
                                                    }
                                                  />
                                                </Tooltip>
                                              </div>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    )}
                                  </div>
                                </Card>
                              </div>
                            </Panel>
                          );
                        })}
                      </Collapse>
                    )}
                  </div>
                </Panel>
              );
            })}
          </Collapse>
        )}
      </Card>
    </div>
  );
}
