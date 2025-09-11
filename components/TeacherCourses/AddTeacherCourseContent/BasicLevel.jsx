import Button from "@/components/atoms/Button";
import { Card, Collapse, Empty, Space, Tag, Tooltip } from "antd";
import { Eye, EyeOff, FileText, Play, Target, Trash2} from "lucide-react";
import React from "react";

const { Panel } = Collapse;

export default function BasicLevel({
  stats,
  deleteLesson,
  deleteStage,
  toggleStageVisibility,
  foundationStages,
  setOpenAddLesson,
  setOpenAddStage,
}) {
  return (
    <Card
      title={
        <div className="flex items-center justify-between">
          <span className="font-bold">
            المحتوى المسجل — المراحل ({stats.stageCount}) / الدروس (
            {stats.lessonCount})
          </span>
          <div className="flex items-center gap-2">
            <Button
              className="!bg-gray-800 !text-white"
              onClick={() => setOpenAddStage(true)}
            >
              إضافة مرحلة
            </Button>
            <Button
              type="primary"
              className="!bg-blue-600 !text-white"
              onClick={() => setOpenAddLesson(true)}
            >
              إضافة قسم
            </Button>
          </div>
        </div>
      }
      className="mb-6"
    >
      {foundationStages.length === 0 ? (
        <Empty description="لا توجد مراحل بعد" />
      ) : (
        <Collapse accordion>
          {foundationStages.map((st) => (
            <Panel
              key={st.id}
              header={
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Tooltip
                      title={st.visible ? "إخفاء المرحلة" : "إظهار المرحلة"}
                    >
                      <Button
                        type="text"
                        icon={
                          st.visible ? (
                            <Eye className="w-4 h-4 text-green-600" />
                          ) : (
                            <EyeOff className="w-4 h-4 text-gray-400" />
                          )
                        }
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleStageVisibility(st.id);
                        }}
                      />
                    </Tooltip>
                    <span
                      className={`font-semibold ${
                        st.visible ? "text-gray-800" : "text-gray-400"
                      }`}
                    >
                      {st.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">
                      {st.lessons?.length || 0} قسم
                    </span>
                    <Tooltip title="حذف المرحلة">
                      <Button
                        danger
                        type="text"
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
            >
              {(st.lessons || []).length === 0 ? (
                <Empty description="لا توجد اقسام في هذه المرحلة" />
              ) : (
                <div className="grid gap-3">
                  {st.lessons.map((l) => (
                    <div
                      key={l.id}
                      className={`flex items-start justify-between rounded-lg border p-3 ${
                        l.visible ? "bg-gray-50" : "bg-gray-100 opacity-70"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="rounded-lg bg-blue-100 p-2 text-blue-700">
                          <Play className="w-4 h-4" />
                        </div>
                        <div>
                          <div
                            className={`font-medium ${
                              l.visible ? "text-gray-800" : "text-gray-500"
                            }`}
                          >
                            {l.title}
                          </div>

                          {/* تفاصيل الفيديو الرئيسي */}
                          <div className="mt-1 text-xs text-gray-600 flex flex-wrap items-center gap-2">
                            <Tag color="blue" className="!mb-0">
                              فيديو القسم
                            </Tag>
                            <span>الاسم: {l.lessonVideo?.title || "-"}</span>
                            {l.lessonVideo?.source === "url" &&
                            l.lessonVideo?.url ? (
                              <a
                                href={l.lessonVideo.url}
                                target="_blank"
                                className="text-blue-600 underline"
                                rel="noreferrer"
                              >
                                مشاهدة
                              </a>
                            ) : (
                              <span>ملف مرفوع</span>
                            )}
                          </div>

                          {/* التدريب */}
                          <div className="mt-2 text-xs text-gray-600">
                            <div className="flex items-center gap-2 flex-wrap">
                              <Tag
                                color="gold"
                                className="!mb-0 flex items-center gap-1"
                              >
                                <Target className="w-3.5 h-3.5" />
                                تدريب القسم
                              </Tag>
                              <span>
                                فيديو: {l.training?.video?.title || "-"}
                              </span>
                              {l.training?.video?.source === "url" &&
                              l.training?.video?.url ? (
                                <a
                                  href={l.training.video.url}
                                  target="_blank"
                                  className="text-blue-600 underline"
                                  rel="noreferrer"
                                >
                                  مشاهدة
                                </a>
                              ) : (
                                <span>ملف مرفوع</span>
                              )}
                            </div>

                            <div className="mt-1 flex items-center gap-2 flex-wrap">
                              <Tag
                                color="geekblue"
                                className="!mb-0 flex items-center gap-1"
                              >
                                <FileText className="w-3.5 h-3.5" />
                                ملفات PDF:
                              </Tag>
                              <span>{l.training?.pdfs?.length || 0} ملف</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <Space>
                        <Tooltip
                          title={l.visible ? "إخفاء القسم" : "إظهار القسم"}
                        >
                          <Button
                            type="text"
                            icon={
                              l.visible ? (
                                <Eye className="w-4 h-4 text-green-600" />
                              ) : (
                                <EyeOff className="w-4 h-4 text-gray-400" />
                              )
                            }
                            onClick={() => toggleLessonVisibility(st.id, l.id)}
                          />
                        </Tooltip>
                        <Tooltip title="حذف">
                          <Button
                            danger
                            onClick={() => deleteLesson(st.id, l.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </Tooltip>
                      </Space>
                    </div>
                  ))}
                </div>
              )}
            </Panel>
          ))}
        </Collapse>
      )}
    </Card>
  );
}
