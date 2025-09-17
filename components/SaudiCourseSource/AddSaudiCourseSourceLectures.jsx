import Button from "@/components/atoms/Button";
import { Card, Collapse, Empty, Space, Tag, Tooltip, Badge, Divider, Dropdown, Menu } from "antd";
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
  Copy,
  ChevronDown
} from "lucide-react";
import React from "react";
import { toast } from "react-toastify";

const { Panel } = Collapse;

export default function AddSaudiCourseSourceLectures({
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
}) {
  // Sample courses data - replace with your actual courses data
  const availableCourses = [
    { id: 1, title: "دورة الرياضيات المتقدمة" },
    { id: 2, title: "دورة اللغة الإنجليزية" },
    { id: 3, title: "دورة البرمجة للمبتدئين" },
    { id: 4, title: "دورة التصميم الجرافيكي" },
  ];

  // Function to handle copying content to a course
  const handleCopyToCourse = (courseId, stageId = null, lessonId = null) => {
    if (stageId && lessonId) {
      console.log(`Copying lesson ${lessonId} to course ${courseId}`);
      toast.success("تم نسخ المحاضرة إلى الدورة المحددة");
    } else if (stageId) {
      console.log(`Copying stage ${stageId} to course ${courseId}`);
      toast.success("تم نسخ القسم إلى الدورة المحددة");
    } else {
      console.log(`Copying all content to course ${courseId}`);
      toast.success("تم نسخ المحتوى إلى الدورة المحددة");
    }
  };

  // Create dropdown menu for copying options
  const getCopyMenu = (stageId = null, lessonId = null) => (
    <Menu>
      <Menu.ItemGroup title="نسخ إلى دورة">
        {availableCourses.map(course => (
          <Menu.Item 
            key={course.id} 
            onClick={() => handleCopyToCourse(course.id, stageId, lessonId)}
            icon={<Copy className="w-4 h-4" />}
          >
            {course.title}
          </Menu.Item>
        ))}
      </Menu.ItemGroup>
    </Menu>
  );

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

  return (
    <div className="w-full">
      {/* Enhanced Header Card */}
      <Card
        className="mb-6 shadow-lg border-0 bg-gradient-to-r from-blue-50 to-indigo-50"
        // bodyStyle={{ padding: '24px' }}
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-800 m-0">المحاضرات</h2>
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
            {/* Copy All Content Dropdown */}
            <Dropdown 
              overlay={getCopyMenu()} 
              trigger={['click']}
              placement="bottomRight"
            >
              <Button 
                className="!bg-purple-600 hover:!bg-purple-700 !text-white !border-0 shadow-md transition-all duration-200 flex items-center gap-2"
              >
                <Copy className="w-4 h-4" />
                نسخ المحتوى
                <ChevronDown className="w-4 h-4" />
              </Button>
            </Dropdown>
            
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
      <Card className="shadow-lg !h-fit border-0" bodyStyle={{ padding: '0' }}>
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
          <Collapse 
            accordion 
            className="border-0 !h-full"
            expandIconPosition="end"
          >
            {foundationStages.map((st, stageIndex) => (
              <Panel
                key={st.id}
                header={
                  <div className="flex items-center justify-between w-full pr-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        st.visible 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'bg-gray-100 text-gray-400'
                      }`}>
                        {stageIndex + 1}
                      </div>
                      <div className="flex items-center gap-3">
                        <Tooltip title={st.visible ? "إخفاء القسم" : "إظهار القسم"}>
                          <Button
                            type="text"
                            size="small"
                            className={`!p-1 hover:!bg-gray-100 ${
                              st.visible ? '!text-green-600' : '!text-gray-400'
                            }`}
                            icon={
                              st.visible ? (
                                <Eye className="w-4 h-4" />
                              ) : (
                                <EyeOff className="w-4 h-4" />
                              )
                            }
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleStageVisibility(st.id);
                            }}
                          />
                        </Tooltip>
                        <h3 className={`font-semibold text-lg m-0 ${
                          st.visible ? "text-gray-800" : "text-gray-400"
                        }`}>
                         القسم  : {st.title}
                        </h3>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge 
                        count={st.lessons?.length || 0} 
                        showZero 
                        size="small"
                        className="[&_.ant-badge-count]:bg-indigo-500 [&_.ant-badge-count]:text-xs"
                      >
                        <span className="text-xs text-gray-500 font-medium">المحاضرات</span>
                      </Badge>
                      
                      {/* Copy Stage Dropdown */}
                      <Dropdown 
                        overlay={getCopyMenu(st.id)} 
                        trigger={['click']}
                        placement="bottomRight"
                      >
                        <Tooltip title="نسخ القسم إلى دورة أخرى">
                          <Button
                            type="text"
                            size="small"
                            className="!p-1 hover:!bg-purple-50 !text-purple-600"
                            icon={<Copy className="w-4 h-4" />}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </Tooltip>
                      </Dropdown>
                      
                      <Tooltip title="حذف الالقسم">
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
                  backgroundColor: st.visible ? '#fafafa' : '#f5f5f5',
                  borderRadius: '12px',
                  marginBottom: '8px'
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
                        console.log(l);
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
                                    <h4 className={`font-bold text-lg mb-2 ${
                                      l.visible ? "text-gray-800" : "text-gray-500"
                                    }`}>
                                    المحاضرة :  {l.title}
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
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              openPicker(st.id, l.id);
                                            }}
                                          >
                                            <Upload className="w-3 h-3" />
                                            إضافة ملفات
                                          </Button>
                                        </div>

                                    

                                        {/* PDF Files List */}
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
                                                        onClick={(e) => e.stopPropagation()}
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
                                                        onClick={(e) => {
                                                          e.stopPropagation();
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
                              <div className="flex items-start gap-2 ml-4">
                                {/* Copy Lesson Dropdown */}
                                <Dropdown 
                                  overlay={getCopyMenu(st.id, l.id)} 
                                  trigger={['click']}
                                  placement="bottomRight"
                                >
                                  <Tooltip title="نسخ المحاضرة إلى دورة أخرى">
                                    <Button
                                      type="text"
                                      size="small"
                                      className="!p-2 hover:!bg-purple-50 !text-purple-600"
                                      icon={<Copy className="w-4 h-4" />}
                                    />
                                  </Tooltip>
                                </Dropdown>
                                
                                <Tooltip title={l.visible ? "إخفاء المحاضرة" : "إظهار المحاضرة"}>
                                  <Button
                                    type="text"
                                    size="small"
                                    className={`!p-2 hover:!bg-gray-100 ${
                                      l.visible ? '!text-green-600' : '!text-gray-400'
                                    }`}
                                    icon={
                                      l.visible ? (
                                        <Eye className="w-4 h-4" />
                                      ) : (
                                        <EyeOff className="w-4 h-4" />
                                      )
                                    }
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
    </div>
  );
}