"use client";
import Button from "@/components/atoms/Button";
import {
  Card,
  Collapse,
  Empty,
  Tag,
  Tooltip,
  Badge,
  DatePicker,
  Divider,
} from "antd";
import {
  Eye,
  EyeOff,
  FileText,
  Target,
  Trash2,
  Plus,
  Video,
  ExternalLink,
  Upload,
  BookOpen,
} from "lucide-react";
import dayjs from "dayjs";
import React from "react";

const { Panel } = Collapse;

export default function BasicLevel({
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
  /** جديد */
  isReleased,
  setLessonReleaseAt,
  setStageReleaseAt, // <<== أضِف هذا من الأب
}) {
  const openPicker = (stageId, lessonId) => {
    const input = document.getElementById(`pdf-picker-${stageId}-${lessonId}`);
    if (input) input.click();
  };

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
            <Button
              className="!bg-gray-700 hover:!bg-gray-800 !text-white !border-0 shadow-md flex items-center gap-2"
              onClick={() => setOpenAddStage(true)}
            >
              <Plus className="w-4 h-4" /> إضافة قسم
            </Button>
            <Button
              type="primary"
              className="!bg-blue-600 hover:!bg-blue-700 !text-white !border-0 shadow-md flex items-center gap-2"
              onClick={() => setOpenAddLesson(true)}
            >
              <Plus className="w-4 h-4" /> إضافة محاضرة
            </Button>
          </div>
        </div>
      </Card>

      {/* Content */}
      <Card className="shadow-lg !h-fit border-0" bodyStyle={{ padding: 0 }}>
        {foundationStages.length === 0 ? (
          <div className="p-12">
            <Empty
              description={
                <div className="text-center">
                  <p className="text-gray-500 text-lg mb-2">لا توجد أقسام بعد</p>
                  <p className="text-gray-400 text-sm">
                    ابدأ بإضافة أقسام جديدة لتنظيم المحتوى
                  </p>
                </div>
              }
              className="my-8"
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
                  className="!border-0 !mb-2"
                  style={{
                    backgroundColor: effectiveStageVisible ? "#fafafa" : "#f5f5f5",
                    borderRadius: "12px",
                    marginBottom: "8px",
                    opacity: effectiveStageVisible ? 1 : 0.9,
                  }}
                  header={
                    <div className="flex items-center justify-between w-full pr-4">
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            effectiveStageVisible
                              ? "bg-blue-100 text-blue-700"
                              : "bg-gray-100 text-gray-400"
                          }`}
                        >
                          {stageIndex + 1}
                        </div>
                        <div className="flex items-center gap-3">
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
                                  <Eye className="w-4 h-4" />
                                ) : (
                                  <EyeOff className="w-4 h-4" />
                                )
                              }
                              onClick={(e) => {
                                e.stopPropagation();
                                if (stageOpened) toggleStageVisibility(st.id);
                              }}
                            />
                          </Tooltip>

                          <h3
                            className={`font-semibold text-lg m-0 ${
                              effectiveStageVisible ? "text-gray-800" : "text-gray-400"
                            }`}
                          >
                            القسم : {st.title}
                          </h3>

                          {/* حالة ظهور القسم */}
                          {st.releaseAt ? (
                            stageOpened ? (
                              <Tag color="green">متاح</Tag>
                            ) : (
                              <Tag color="red">لم يُفتح بعد</Tag>
                            )
                          ) : (
                            <Tag color="green">متاح الآن</Tag>
                          )}

                          {st.releaseAt && (
                            <Tooltip title="موعد الظهور">
                              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                                {dayjs(st.releaseAt).format("YYYY/MM/DD HH:mm")}
                              </span>
                            </Tooltip>
                          )}
                        </div>
                      </div>

                      {/* أدوات القسم: جدولة/مسح/عداد/حذف */}
                      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
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

                        <Badge
                          count={st.lessons?.length || 0}
                          showZero
                          size="small"
                          className="[&_.ant-badge-count]:bg-indigo-500 [&_.ant-badge-count]:text-xs"
                        >
                          <span className="text-xs text-gray-500 font-medium">
                            المحاضرات
                          </span>
                        </Badge>

                        <Tooltip title="حذف القسم">
                          <Button
                            danger
                            type="text"
                            size="small"
                            className="!p-1 hover:!bg-red-50"
                            icon={<Trash2 className="w-4 h-4" />}
                            onClick={() => deleteStage(st.id)}
                          />
                        </Tooltip>
                      </div>
                    </div>
                  }
                >
                  <div className="px-2 sm:px-4 md:px-6 pb-4">
                    {(st.lessons || []).length === 0 ? (
                      <div className="text-center py-8">
                        <Empty
                          description="لا توجد محاضرات في هذه القسم"
                          image={Empty.PRESENTED_IMAGE_SIMPLE}
                          className="!text-gray-400"
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
                          const released = isReleased?.(l.releaseAt);

                          const header = (
                            <div className="flex items-center justify-between w-full">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-sm">
                                  {lessonIndex + 1}
                                </div>
                                <div className="flex items-center gap-2">
                                  <span
                                    className={`font-semibold ${
                                      l.visible ? "text-gray-800" : "text-gray-500"
                                    }`}
                                  >
                                    المحاضرة : {l.title}
                                  </span>
                                  <Badge count={pdfs.length} showZero size="small" />
                                  {/* حالة الظهور */}
                                  {l.releaseAt && !released && (
                                    <Tag color="red">لم يُفتح بعد</Tag>
                                  )}
                                </div>
                              </div>

                              {/* أدوات الجدولة للدرس */}
                              <div
                                className="flex items-center gap-2"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Tooltip title="موعد الظهور">
                                  <DatePicker
                                    showTime
                                    size="small"
                                    value={
                                      l.releaseAt && dayjs(l.releaseAt).isValid()
                                        ? dayjs(l.releaseAt)
                                        : null
                                    }
                                    placeholder="موعد الظهور"
                                    className="min-w-[190px]"
                                    onChange={(v) =>
                                      setLessonReleaseAt(st.id, l.id, v || null)
                                    }
                                  />
                                </Tooltip>
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
                                  title={l.visible ? "إخفاء المحاضرة" : "إظهار المحاضرة"}
                                >
                                  <Button
                                    type="text"
                                    size="small"
                                    className={`!p-1 hover:!bg-gray-100 ${
                                      l.visible ? "!text-green-600" : "!text-gray-400"
                                    }`}
                                    icon={
                                      l.visible ? (
                                        <Eye className="w-4 h-4" />
                                      ) : (
                                        <EyeOff className="w-4 h-4" />
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
                                    onClick={() => deleteLesson(st.id, l.id)}
                                    icon={<Trash2 className="w-4 h-4" />}
                                  />
                                </Tooltip>
                              </div>
                            </div>
                          );

                          return (
                            <Panel
                              key={l.id}
                              header={header}
                              className={`!rounded-xl !mb-3 ${
                                l.visible
                                  ? "bg-white !border !border-blue-100 hover:!border-blue-200"
                                  : "bg-gray-50 !border !border-gray-200 opacity-80"
                              }`}
                            >
                              {/* مدخل رفع PDF المخفي */}
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
                                <div className="bg-blue-50 rounded-lg p-4">
                                  <div className="flex items-center gap-2 mb-3">
                                    <Video className="w-4 h-4 text-blue-600" />
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
                                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium"
                                      >
                                        مشاهدة <ExternalLink className="w-3 h-3" />
                                      </a>
                                    ) : l.lessonVideo ? (
                                      <span className="text-gray-500">ملف مرفوع</span>
                                    ) : null}
                                  </div>
                                </div>

                                {/* Training */}
                                <div className="bg-amber-50 rounded-lg p-4">
                                  <div className="flex items-center gap-2 mb-3">
                                    <Target className="w-4 h-4 text-amber-600" />
                                    <Tag color="gold" className="!mb-0 font-medium">
                                      تدريب
                                      </Tag>
                                  </div>

                                  <div className="flex items-center gap-3 text-sm text-gray-700 mb-4">
                                    <span className="font-medium">
                                      فيديو: {l.training?.video?.title || "غير محدد"}
                                    </span>
                                    {l.training?.video?.source === "url" &&
                                    l.training?.video?.url ? (
                                      <a
                                        href={l.training.video.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium"
                                      >
                                        مشاهدة <ExternalLink className="w-3 h-3" />
                                      </a>
                                    ) : l.training?.video ? (
                                      <span className="text-gray-500">ملف مرفوع</span>
                                    ) : null}
                                  </div>

                                  <Divider className="!my-4" />

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
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          openPicker(st.id, l.id);
                                        }}
                                      >
                                        <Upload className="w-3 h-3" /> إضافة ملفات
                                      </Button>
                                    </div>

                                    {pdfs.length > 0 && (
                                      <div className="space-y-2">
                                        {pdfs.map((f, idx) => {
                                          const key = f?.id ?? idx;
                                          const label =
                                            f?.title || f?.name || `ملف ${idx + 1}`;
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
                                                <span className="text-gray-800 font-medium">
                                                  {label}
                                                </span>
                                              </div>
                                              <div className="flex items-center gap-2">
                                                {isUrl ? (
                                                  <a
                                                    href={f.url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
                                                    onClick={(e) => e.stopPropagation()}
                                                  >
                                                    عرض <ExternalLink className="w-3 h-3" />
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
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                      removeTrainingFile?.(
                                                        st.id,
                                                        l.id,
                                                        f?.id ?? idx
                                                      );
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
