"use client";
import React, { useState } from 'react';
import PageLayout from '../../../components/layout/PageLayout';
import BreadcrumbsShowcase from '../../../components/ui/BreadCrumbs';
import { BarChart3, Book, Files, Plus, Copy, Eye, EyeOff, Trash2, Edit, ChevronDown, ChevronRight, Video, FileText, Download } from 'lucide-react';
import PagesHeader from '../../../components/ui/PagesHeader';
import Button from '../../../components/atoms/Button';
import { useRouter } from 'next/navigation';
import { Card, Modal, Input, Select, Form, Tooltip, Empty, Divider, Row, Col, Dropdown, Menu } from 'antd';
import { FolderOutlined, LinkOutlined, MoreOutlined } from '@ant-design/icons';
import SaudiCourseSourceResources from '../../../components/SaudiCourseSource/SaudiCourseSourceResources';

const breadcrumbs = [
  { label: "الرئيسية", href: "/", icon: BarChart3 },
  { label: "دورة المصدر", href: "#", icon: Files, current: true },
];

// Mock data for demonstration
const MOCK_COURSES = [
  { id: 1, title: "دورة الرياضيات المتقدمة", description: "دورة متقدمة في الرياضيات للمرحلة الثانوية" },
  { id: 2, title: "دورة الفيزياء الأساسية", description: "دورة تأسيسية في الفيزياء" },
  { id: 3, title: "دورة اللغة الإنجليزية", description: "دورة شاملة للغة الإنجليزية" },
];

const MOCK_CONTENT = {
  stages: [
    {
      id: 1,
      title: "الوحدة الأولى: الأساسيات",
      visible: true,
      type: "lectures",
      lectures: [
        { 
          id: 1, 
          title: "مقدمة في الدورة", 
          type: "video", 
          duration: "10:25", 
          visible: true,
          videoUrl: "https://example.com/video1.mp4",
          resources: [
            { id: 1, name: "ملخص الدرس", type: "pdf", url: "/files/summary1.pdf" },
            { id: 2, name: "تمارين الدرس", type: "pdf", url: "/files/exercises1.pdf" }
          ]
        },
        { 
          id: 2, 
          title: "المفاهيم الأساسية", 
          type: "training", 
          duration: "15 صفحة", 
          visible: true,
          trainingType: "mixed",
          videos: [
            { id: 1, title: "الفيديو التوضيحي", url: "https://example.com/training1.mp4", duration: "5:30" }
          ],
          pdfs: [
            { id: 1, title: "دليل التدريب", url: "/files/training1.pdf" },
            { id: 2, title: "تمارين تطبيقية", url: "/files/practice1.pdf" }
          ]
        },
      ]
    },
    {
      id: 2,
      title: "الوحدة الثانية: التطبيقات",
      visible: true,
      type: "lectures",
      lectures: [
        { 
          id: 3, 
          title: "التطبيق العملي 1", 
          type: "video", 
          duration: "22:15", 
          visible: true,
          videoUrl: "https://example.com/video2.mp4",
          resources: [
            { id: 1, name: "ملخص التطبيق", type: "pdf", url: "/files/summary2.pdf" }
          ]
        },
        { 
          id: 4, 
          title: "تمارين الوحدة", 
          type: "training", 
          duration: "8 صفحة", 
          visible: false,
          trainingType: "pdf-only",
          pdfs: [
            { id: 1, title: "تمارين الوحدة", url: "/files/unit-exercises.pdf" },
            { id: 2, title: "الإجابات النموذجية", url: "/files/answers.pdf" }
          ]
        },
      ]
    }
  ],
  resources: {
    telegram: "https://t.me/mathgroup",
    whatsapp: "https://chat.whatsapp.com/mathgroup",
    files: [
      { id: 1, name: "ملخص الوحدة الأولى", url: "/files/summary1.pdf" },
      { id: 2, name: "تمارين إضافية", url: "/files/extra-exercises.pdf" },
    ]
  },
  exams: [
    { id: 1, title: "اختبار الوحدة الأولى", type: "training", duration: 45, questions: 20, visible: true },
    { id: 2, title: "امتحان منتصف الفصل", type: "mock", duration: 90, questions: 40, visible: true },
  ]
};

const TABS = [
  { id: 1, title: "المراحل والدروس" },
  { id: 2, title: "المحاضرات المباشرة" },
  { id: 3, title: "الاختبارات" },
  { id: 4, title: "المصادر والملفات" },
];

export default function CourseContentPage() {
  const [activeTab, setActiveTab] = useState(1);
  const [courses, setCourses] = useState(MOCK_COURSES);
  const [content, setContent] = useState(MOCK_CONTENT);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [copyModalVisible, setCopyModalVisible] = useState(false);
  const [selectedContent, setSelectedContent] = useState({ stages: [], resources: false, exams: false });
  const [expandedStages, setExpandedStages] = useState([1, 2]);
  const [expandedLectures, setExpandedLectures] = useState([]);
  const router = useRouter();

  const toggleStageExpansion = (stageId) => {
    if (expandedStages.includes(stageId)) {
      setExpandedStages(expandedStages.filter(id => id !== stageId));
    } else {
      setExpandedStages([...expandedStages, stageId]);
    }
  };

  const toggleLectureExpansion = (lectureId) => {
    if (expandedLectures.includes(lectureId)) {
      setExpandedLectures(expandedLectures.filter(id => id !== lectureId));
    } else {
      setExpandedLectures([...expandedLectures, lectureId]);
    }
  };

  const toggleStageVisibility = (stageId) => {
    setContent(prev => ({
      ...prev,
      stages: prev.stages.map(stage => 
        stage.id === stageId ? { ...stage, visible: !stage.visible } : stage
      )
    }));
  };

  const toggleLectureVisibility = (stageId, lectureId) => {
    setContent(prev => ({
      ...prev,
      stages: prev.stages.map(stage => 
        stage.id === stageId 
          ? { 
              ...stage, 
              lectures: stage.lectures.map(lecture => 
                lecture.id === lectureId ? { ...lecture, visible: !lecture.visible } : lecture
              )
            } 
          : stage
      )
    }));
  };

  const toggleExamVisibility = (examId) => {
    setContent(prev => ({
      ...prev,
      exams: prev.exams.map(exam => 
        exam.id === examId ? { ...exam, visible: !exam.visible } : exam
      )
    }));
  };

  const handleContentSelection = (type, id = null) => {
    if (type === 'stages') {
      setSelectedContent(prev => ({
        ...prev,
        stages: prev.stages.includes(id) 
          ? prev.stages.filter(stageId => stageId !== id)
          : [...prev.stages, id]
      }));
    } else {
      setSelectedContent(prev => ({
        ...prev,
        [type]: !prev[type]
      }));
    }
  };

  const handleCopyContent = () => {
    // In a real application, this would copy content to the selected course
    alert(`سيتم نسخ المحتوى المحدد إلى الدورة: ${selectedCourse}`);
    setCopyModalVisible(false);
    setSelectedContent({ stages: [], resources: false, exams: false });
    setSelectedCourse(null);
  };

  const renderLectureContent = (lecture) => {
    if (lecture.type === 'video') {
      return (
        <div className="mt-2 p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-2 text-blue-700 mb-2">
            <Video className="w-4 h-4" />
            <span>فيديو المحاضرة</span>
          </div>
          <div className="text-sm">
            <a href={lecture.videoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              {lecture.videoUrl}
            </a>
          </div>
          
          {lecture.resources && lecture.resources.length > 0 && (
            <div className="mt-3">
              <div className="flex items-center gap-2 text-gray-700 mb-2">
                <FileText className="w-4 h-4" />
                <span>الملفات المرفقة</span>
              </div>
              <div className="space-y-1">
                {lecture.resources.map(resource => (
                  <div key={resource.id} className="flex items-center justify-between text-sm bg-white p-2 rounded border">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-500" />
                      <span>{resource.name}</span>
                    </div>
                    <a href={resource.url} download className="text-blue-500 hover:text-blue-700">
                      <Download className="w-4 h-4" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    } else if (lecture.type === 'training') {
      return (
        <div className="mt-2 p-3 bg-green-50 rounded-lg">
          <div className="flex items-center gap-2 text-green-700 mb-2">
            <FileText className="w-4 h-4" />
            <span>تدريب {lecture.trainingType === 'mixed' ? '(فيديو + PDF)' : '(PDF فقط)'}</span>
          </div>
          
          {lecture.videos && lecture.videos.length > 0 && (
            <div className="mb-3">
              <div className="text-sm font-medium text-gray-700 mb-1">الفيديوهات:</div>
              <div className="space-y-2">
                {lecture.videos.map(video => (
                  <div key={video.id} className="flex items-center justify-between text-sm bg-white p-2 rounded border">
                    <div className="flex items-center gap-2">
                      <Video className="w-4 h-4 text-gray-500" />
                      <span>{video.title}</span>
                      <span className="text-xs text-gray-500">({video.duration})</span>
                    </div>
                    <a href={video.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700">
                      <Eye className="w-4 h-4" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {lecture.pdfs && lecture.pdfs.length > 0 && (
            <div>
              <div className="text-sm font-medium text-gray-700 mb-1">ملفات PDF:</div>
              <div className="space-y-2">
                {lecture.pdfs.map(pdf => (
                  <div key={pdf.id} className="flex items-center justify-between text-sm bg-white p-2 rounded border">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-500" />
                      <span>{pdf.title}</span>
                    </div>
                    <a href={pdf.url} download className="text-blue-500 hover:text-blue-700">
                      <Download className="w-4 h-4" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }
  };

  const renderStagesTab = () => (
    <Card title="المراحل والدروس" className="mb-6">
      {content.stages.length === 0 ? (
        <Empty description="لا توجد مراحل مضافة" />
      ) : (
        <div className="space-y-4">
          {content.stages.map(stage => (
            <div key={stage.id} className="border rounded-lg overflow-hidden">
              <div className={`flex items-center justify-between p-4 ${stage.visible ? 'bg-gray-50' : 'bg-gray-100 opacity-70'}`}>
                <div className="flex items-center gap-3">
                  <button onClick={() => toggleStageExpansion(stage.id)}>
                    {expandedStages.includes(stage.id) ? 
                      <ChevronDown className="w-4 h-4" /> : 
                      <ChevronRight className="w-4 h-4" />
                    }
                  </button>
                  <div className="font-medium">{stage.title}</div>
                  <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                    {stage.type === 'lectures' ? 'محاضرات' : 'دروس'}
                  </span>
                  <Tooltip title={stage.visible ? "مرحلة ظاهرة للطلاب" : "مرحلة مخفية"}>
                    <button onClick={() => toggleStageVisibility(stage.id)}>
                      {stage.visible ? 
                        <Eye className="w-4 h-4 text-green-600" /> : 
                        <EyeOff className="w-4 h-4 text-gray-400" />
                      }
                    </button>
                  </Tooltip>
                </div>
                <div className="flex items-center gap-2">
                  <Dropdown
                    overlay={
                      <Menu>
                        <Menu.Item key="copy" onClick={() => handleContentSelection('stages', stage.id)}>
                          <div className="flex items-center gap-2">
                            <Copy className="w-4 h-4" />
                            <span>نسخ هذه المرحلة</span>
                          </div>
                        </Menu.Item>
                        <Menu.Item key="edit">
                          <div className="flex items-center gap-2">
                            <Edit className="w-4 h-4" />
                            <span>تعديل</span>
                          </div>
                        </Menu.Item>
                        <Menu.Item key="delete" danger>
                          <div className="flex items-center gap-2">
                            <Trash2 className="w-4 h-4" />
                            <span>حذف</span>
                          </div>
                        </Menu.Item>
                      </Menu>
                    }
                    trigger={['click']}
                    placement="bottomRight"
                  >
                    <Button type="text" icon={<MoreOutlined />} />
                  </Dropdown>
                </div>
              </div>
              
              {expandedStages.includes(stage.id) && (
                <div className="border-t">
                  {stage.lectures.map(lecture => (
                    <div key={lecture.id} className={`border-b last:border-b-0 ${lecture.visible ? '' : 'opacity-70 bg-gray-50'}`}>
                      <div className="flex items-center justify-between p-4 pl-10">
                        <div className="flex items-center gap-3">
                          <button onClick={() => toggleLectureExpansion(lecture.id)}>
                            {expandedLectures.includes(lecture.id) ? 
                              <ChevronDown className="w-4 h-4" /> : 
                              <ChevronRight className="w-4 h-4" />
                            }
                          </button>
                          <div className="font-medium">{lecture.title}</div>
                          <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-700">
                            {lecture.type === 'video' ? 'فيديو' : 'تدريب'}
                          </span>
                          <span className="text-xs text-gray-500">{lecture.duration}</span>
                          <Tooltip title={lecture.visible ? "المحاضرة ظاهرة للطلاب" : "المحاضرة مخفية"}>
                            <button onClick={() => toggleLectureVisibility(stage.id, lecture.id)}>
                              {lecture.visible ? 
                                <Eye className="w-4 h-4 text-green-600" /> : 
                                <EyeOff className="w-4 h-4 text-gray-400" />
                              }
                            </button>
                          </Tooltip>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="text-gray-500 hover:text-gray-700">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="text-red-500 hover:text-red-700">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      {expandedLectures.includes(lecture.id) && (
                        <div className="pl-16 pr-4 pb-4">
                          {renderLectureContent(lecture)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      <Button className="mt-4" icon={<Plus className="w-4 h-4" />}>
        إضافة مرحلة جديدة
      </Button>
    </Card>
  );

  const renderExamsTab = () => (
    <Card title="الاختبارات" className="mb-6">
      {content.exams.length === 0 ? (
        <Empty description="لا توجد اختبارات" />
      ) : (
        <div className="space-y-3">
          {content.exams.map(exam => (
            <div
              key={exam.id}
              className={`flex items-center justify-between rounded-lg border p-3 ${
                exam.visible ? "bg-gray-50" : "bg-gray-100 opacity-70"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-purple-100 p-2 text-purple-700">
                  <Files className="w-4 h-4" />
                </div>
                <div>
                  <div className={`font-medium ${exam.visible ? "text-gray-800" : "text-gray-500"}`}>
                    {exam.title}
                  </div>
                  <div className="text-xs text-gray-500 flex items-center gap-2">
                    <span>{exam.type === 'mock' ? 'اختبار محاكي' : 'اختبار تدريبي'}</span>
                    <span>•</span>
                    <span>{exam.duration} دقيقة</span>
                    <span>•</span>
                    <span>{exam.questions} سؤال</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Tooltip title={exam.visible ? "إخفاء الاختبار" : "إظهار الاختبار"}>
                  <button onClick={() => toggleExamVisibility(exam.id)}>
                    {exam.visible ? 
                      <Eye className="w-4 h-4 text-green-600" /> : 
                      <EyeOff className="w-4 h-4 text-gray-400" />
                    }
                  </button>
                </Tooltip>
                <Tooltip title="نسخ هذا الاختبار">
                  <button 
                    onClick={() => handleContentSelection('exams')}
                    className={`p-1 rounded ${selectedContent.exams ? 'bg-blue-100 text-blue-600' : 'text-gray-500'}`}
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </Tooltip>
                <button className="text-red-500 hover:text-red-700">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <Button className="mt-4" icon={<Plus className="w-4 h-4" />}>
        إضافة اختبار جديد
      </Button>
    </Card>
  );

  const renderResourcesTab = () => (
    <SaudiCourseSourceResources content={content} setCopyModalVisible={setCopyModalVisible} handleContentSelection={handleContentSelection} selectedContent={selectedContent}/>
  );

  return (
    <PageLayout>
      <div style={{dir:"rtl"}} className="p-6">
        <BreadcrumbsShowcase items={breadcrumbs} variant='pill' />
        <PagesHeader 
          title={"دورة المصدر"}
          subtitle={"انشاء ونظم محتوى دورة المصدر"}
          extra={
            <Button 
              onClick={() => router.push('/saudi_source_course/add-data')}
              icon={<Plus className='w-5 h-5'/>}
            >
              إضافة محتوى جديد
            </Button>
          }
        />
        
        <div className="max-w-6xl mx-auto mt-6">
          {/* شريط التبويب */}
          <div className="mb-6 flex items-center gap-2">
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

          {/* محتوى التبويب النشط */}
          {activeTab === 1 && renderStagesTab()}
          {activeTab === 3 && renderExamsTab()}
          {activeTab === 4 && renderResourcesTab()}
          
          {/* تبويب المحاضرات المباشرة (سيتم تنفيذه لاحقًا) */}
          {activeTab === 2 && (
            <Card title="المحاضرات المباشرة" className="mb-6">
              <Empty description="لا توجد محاضرات مباشرة مضافة" />
              <Button className="mt-4" icon={<Plus className="w-4 h-4" />}>
                إضافة محاضرة مباشرة
              </Button>
            </Card>
          )}
        </div>
        
        {/* Modal for copying content */}
        <Modal
          title="نسخ المحتوى إلى دورة أخرى"
          open={copyModalVisible}
          onCancel={() => setCopyModalVisible(false)}
          onOk={handleCopyContent}
          okText="نسخ"
          cancelText="إلغاء"
          width={600}
        >
          <div className="my-4">
            <p className="mb-3">اختر الدورة التي تريد نسخ المحتوى إليها:</p>
            <Select
              placeholder="اختر دورة"
              className="w-full"
              value={selectedCourse}
              onChange={setSelectedCourse}
            >
              {courses.map(course => (
                <Select.Option key={course.id} value={course.id}>
                  {course.title}
                </Select.Option>
              ))}
            </Select>
            
            <Divider />
            
            <p className="font-medium mb-2">المحتوى المحدد للنسخ:</p>
            <ul className="list-disc pr-4">
              {selectedContent.stages.length > 0 && (
                <li>{selectedContent.stages.length} مرحلة</li>
              )}
              {selectedContent.exams && <li>الاختبارات</li>}
              {selectedContent.resources && <li>المصادر والملفات</li>}
            </ul>
            
            {selectedContent.stages.length > 0 && (
              <div className="mt-3">
                <p className="font-medium mb-2">تفاصيل المراحل المحددة:</p>
                <div className="space-y-2">
                  {content.stages
                    .filter(stage => selectedContent.stages.includes(stage.id))
                    .map(stage => (
                      <div key={stage.id} className="bg-gray-50 p-2 rounded">
                        <div className="font-medium">{stage.title}</div>
                        <div className="text-sm text-gray-600">
                          {stage.lectures.length} محاضرة
                          {stage.lectures.filter(l => l.type === 'video').length > 0 && 
                            ` (${stage.lectures.filter(l => l.type === 'video').length} فيديو)`
                          }
                          {stage.lectures.filter(l => l.type === 'training').length > 0 && 
                            ` (${stage.lectures.filter(l => l.type === 'training').length} تدريب)`
                          }
                        </div>
                      </div>
                    ))
                  }
                </div>
              </div>
            )}
          </div>
        </Modal>
      </div>
    </PageLayout>
  );
}