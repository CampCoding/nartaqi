import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  Play, 
  FileText, 
  Download, 
  Clock,
  BookOpen,
  Video,
  Eye,
  CheckCircle2,
  ClipboardList,
  Monitor,
  Target,
  Star,
  Users,
  Calendar,
  ChevronRight,
  MoreVertical
} from 'lucide-react';

const ArabicCourseCurriculum = () => {
  const [activeTab, setActiveTab] = useState('foundation');
  const [expandedSections, setExpandedSections] = useState({ 1: true, 4: true });
  const [expandedDropdowns, setExpandedDropdowns] = useState({});

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const toggleDropdown = (lessonId) => {
    setExpandedDropdowns(prev => ({
      ...prev,
      [lessonId]: !prev[lessonId]
    }));
  };

  const tabs = [
    {
      id: 'foundation',
      label: 'مرحلة التأسيس',
      icon: Target,
      color: 'blue'
    },
    {
      id: 'lectures',
      label: 'المحاضرات',
      icon: Monitor,
      color: 'green'
    },
    {
      id: 'tests',
      label: 'الاختبارات',
      icon: ClipboardList,
      color: 'purple'
    },
  ];

  const courseData = {
    foundation: [
      {
        id: 1,
        title: "القسم الأول - مدخل إلى التدريس الفعال",
        isExpanded: true,
        lessonCount: 2,
        duration: "35 دقيقة",
        lessons: [
          {
            id: 1,
            title: "المحتوى الأول - مفهوم جودة التعلم من الناحية",
            duration: "18 دقيقة",
            type: "lesson",
            hasVideo: true,
            isCompleted: true,
            difficulty: "مبتدئ"
          },
          {
            id: 2,
            title: "فيديو تطبيقي عملي",
            duration: "17 دقيقة",
            type: "video",
            hasVideo: false,
            isCompleted: false,
            difficulty: "متوسط",
            isTraining: true,
            trainingMaterials: [
              {
                type: "video",
                title: "الفيديو التوضيحي",
                duration: "10 دقائق",
                format: "MP4"
              },
              {
                type: "pdf",
                title: "دليل التدريب العملي",
                pages: 12,
                format: "PDF"
              }
            ]
          }
        ]
      },
      {
        id: 2,
        title: "القسم الثاني - استراتيجيات التعلم النشط",
        isExpanded: false,
        lessonCount: 3,
        duration: "50 دقيقة",
        lessons: [
          {
            id: 1,
            title: "مقدمة في استراتيجيات التعلم النشط",
            duration: "15 دقيقة",
            type: "lesson",
            hasVideo: true,
            isCompleted: true,
            difficulty: "مبتدئ"
          },
          {
            id: 2,
            title: "تدريب عملي على الاستراتيجيات",
            duration: "20 دقيقة",
            type: "exercise",
            hasVideo: true,
            isCompleted: true,
            hasDownload: true,
            downloadLabel: "ملف التدريب",
            difficulty: "متوسط",
            isTraining: true,
            trainingMaterials: [
              {
                type: "video",
                title: "الفيديو التوضيحي للاستراتيجيات",
                duration: "15 دقائق",
                format: "MP4"
              },
              {
                type: "pdf",
                title: "كتيب الاستراتيجيات",
                pages: 8,
                format: "PDF"
              },
              {
                type: "pdf",
                title: "تمارين تطبيقية",
                pages: 5,
                format: "PDF"
              }
            ]
          },
          {
            id: 3,
            title: "اختبار تقييمي",
            duration: "15 دقيقة",
            type: "download",
            hasVideo: false,
            isCompleted: false,
            hasDownload: true,
            downloadLabel: "ملف الاختبار",
            difficulty: "متقدم"
          }
        ]
      },
      {
        id: 3,
        title: "القسم الثالث - تقييم المتدربين وأدوات القياس",
        isExpanded: false,
        lessonCount: 3,
        duration: "55 دقيقة",
        lessons: [
          {
            id: 1,
            title: "أدوات القياس والتقييم",
            duration: "20 دقيقة",
            type: "lesson",
            hasVideo: true,
            isCompleted: false,
            difficulty: "متوسط"
          },
          {
            id: 2,
            title: "فيديو توضيحي للتطبيق",
            duration: "15 دقيقة",
            type: "video",
            hasVideo: true,
            isCompleted: false,
            difficulty: "متوسط"
          },
          {
            id: 3,
            title: "نماذج التقييم",
            duration: "20 دقيقة",
            type: "download",
            hasVideo: false,
            isCompleted: false,
            hasDownload: true,
            downloadLabel: "نماذج PDF",
            difficulty: "متقدم"
          }
        ]
      },
      {
        id: 4,
        title: "القسم الرابع - التطبيقات العملية المتقدمة",
        isExpanded: true,
        lessonCount: 4,
        duration: "70 دقيقة",
        lessons: [
          {
            id: 1,
            title: "الدرس الأول - التطبيقات العملية",
            duration: "20 دقيقة",
            type: "lesson",
            hasVideo: true,
            isCompleted: true,
            difficulty: "متقدم"
          },
          {
            id: 2,
            title: "تدريب عملي شامل",
            duration: "25 دقيقة",
            type: "exercise",
            hasVideo: true,
            isCompleted: true,
            hasDownload: true,
            downloadLabel: "ملف التدريب",
            difficulty: "متوسط",
            isTraining: true,
            trainingMaterials: [
              {
                type: "video",
                title: "سلسلة التطبيقات العملية",
                duration: "20 دقائق",
                format: "MP4"
              },
              {
                type: "pdf",
                title: "دليل التطبيقات الشامل",
                pages: 15,
                format: "PDF"
              },
              {
                type: "pdf",
                title: "الحلول النموذجية",
                pages: 10,
                format: "PDF"
              }
            ]
          },
          {
            id: 3,
            title: "اختبار نهائي",
            duration: "15 دقيقة",
            type: "download",
            hasVideo: false,
            isCompleted: false,
            hasDownload: true,
            downloadLabel: "ملف الاختبار",
            difficulty: "متقدم"
          },
          {
            id: 4,
            title: "مراجعة نهائية",
            duration: "10 دقيقة",
            type: "video",
            hasVideo: true,
            isCompleted: false,
            difficulty: "مبتدئ"
          }
        ]
      },
      {
        id: 5,
        title: "القسم الخامس - أحدث الأبحاث الأساسية والتطبيقية",
        isExpanded: false,
        lessonCount: 3,
        duration: "60 دقيقة",
        lessons: [
          {
            id: 1,
            title: "أحدث الأبحاث في المجال",
            duration: "25 دقيقة",
            type: "lesson",
            hasVideo: true,
            isCompleted: false,
            difficulty: "متقدم"
          },
          {
            id: 2,
            title: "تطبيقات عملية من الأبحاث",
            duration: "20 دقيقة",
            type: "exercise",
            hasVideo: true,
            isCompleted: false,
            hasDownload: true,
            downloadLabel: "ملف التطبيقات",
            difficulty: "متوسط",
            isTraining: true,
            trainingMaterials: [
              {
                type: "video",
                title: "تحليل الأبحاث الحديثة",
                duration: "18 دقائق",
                format: "MP4"
              },
              {
                type: "pdf",
                title: "ملخص الأبحاث",
                pages: 20,
                format: "PDF"
              }
            ]
          },
          {
            id: 3,
            title: "اختبار تقييمي نهائي",
            duration: "15 دقيقة",
            type: "download",
            hasVideo: false,
            isCompleted: false,
            hasDownload: true,
            downloadLabel: "ملف الاختبار",
            difficulty: "متقدم"
          }
        ]
      }
    ],
    lectures: [
      {
        id: 1,
        title: "محاضرة مقدمة في علم التربية",
        isExpanded: false,
        lessonCount: 4,
        duration: "2 ساعة",
        lessons: [
          { id: 1, title: "تاريخ التربية", duration: "30 دقيقة", type: "lecture", isCompleted: true },
          { id: 2, title: "النظريات التربوية", duration: "45 دقيقة", type: "lecture", isCompleted: false },
        ]
      },
      {
        id: 2,
        title: "محاضرة علم النفس التربوي",
        isExpanded: false,
        lessonCount: 3,
        duration: "90 دقيقة",
        lessons: []
      }
    ],
    tests: [
      {
        id: 1,
        title: "اختبار الوحدة الأولى",
        isExpanded: false,
        lessonCount: 5,
        duration: "45 دقيقة",
        lessons: [
          { id: 1, title: "اختبار المفاهيم الأساسية", duration: "15 دقيقة", type: "test", isCompleted: true },
          { id: 2, title: "اختبار التطبيقات العملية", duration: "30 دقيقة", type: "test", isCompleted: false },
        ]
      }
    ]
  };

  const getLessonIcon = (type, isCompleted) => {
    if (isCompleted) {
      return <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />;
    }
    
    switch (type) {
      case 'video':
        return <Video className="w-4 h-4 text-blue-500 flex-shrink-0" />;
      case 'exercise':
        return <BookOpen className="w-4 h-4 text-purple-500 flex-shrink-0" />;
      case 'download':
        return <FileText className="w-4 h-4 text-orange-500 flex-shrink-0" />;
      case 'lecture':
        return <Monitor className="w-4 h-4 text-indigo-500 flex-shrink-0" />;
      case 'test':
        return <ClipboardList className="w-4 h-4 text-red-500 flex-shrink-0" />;
      default:
        return <Play className="w-4 h-4 text-gray-500 flex-shrink-0" />;
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'مبتدئ':
        return 'bg-green-100 text-green-800';
      case 'متوسط':
        return 'bg-yellow-100 text-yellow-800';
      case 'متقدم':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getMaterialIcon = (type) => {
    switch (type) {
      case 'video':
        return <Video className="w-4 h-4 text-blue-500" />;
      case 'pdf':
        return <FileText className="w-4 h-4 text-red-500" />;
      default:
        return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  const currentData = courseData[activeTab] || [];

  return (
    <div className="mx-auto p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* Enhanced Header with Stats */}
      <div className="bg-white rounded-2xl p-6 mb-8 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">محتوى الدورة التدريبية</h1>
            <p className="text-gray-600">تصفح المحتوى التعليمي المنظم حسب المراحل والأقسام</p>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">24</div>
              <div className="text-gray-500">إجمالي الدروس</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">68%</div>
              <div className="text-gray-500">معدل الإنجاز</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">4.8</div>
              <div className="text-gray-500 flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                التقييم
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Tabs */}
        <div className="flex bg-gray-100 rounded-xl p-1">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 flex-1 justify-center ${
                  isActive
                    ? `bg-${tab.color}-500 text-white shadow-lg transform scale-105`
                    : 'text-gray-600 hover:bg-gray-200 hover:text-gray-800'
                }`}
              >
                <IconComponent className="w-4 h-4" />
                <span>{tab.label}</span>
                {isActive && (
                  <span className={`bg-${tab.color}-400 text-xs px-2 py-1 rounded-full`}>
                    {currentData.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Course Sections with Enhanced Design */}
      {currentData.map((section) => (
        <div 
          key={section.id}
          className="bg-white rounded-xl shadow-sm border border-gray-200 mb-4 overflow-hidden"
        >
          <div 
            className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => toggleSection(section.id)}
          >
            <div className="flex items-center gap-3">
              {expandedSections[section.id] ? (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              )}
              <div>
                <h3 className="font-semibold text-gray-800">{section.title}</h3>
                <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    {section.lessonCount} دروس
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {section.duration}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">
                {section.lessons.filter(l => l.isCompleted).length}/{section.lessons.length} مكتمل
              </span>
              {/* <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 transition-all duration-300"
                  style={{ 
                    width: `${(section.lessons.filter(l => l.isCompleted).length / section.lessons.length) * 100}%` 
                  }}
                />
              </div> */}
            </div>
          </div>

          {expandedSections[section.id] && (
            <div className="border-t border-gray-200 p-4">
              {section.lessons.map((lesson) => (
                <div key={lesson.id}>
                  <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-all mb-2">
                    <div className="flex items-center gap-3 flex-1">
                      {getLessonIcon(lesson.type, lesson.isCompleted)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-800">{lesson.title}</span>
                          {lesson.difficulty && (
                            <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(lesson.difficulty)}`}>
                              {lesson.difficulty}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {lesson.duration}
                          </span>
                          {lesson.hasVideo && (
                            <span className="flex items-center gap-1">
                              <Video className="w-3 h-3" />
                              فيديو
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {lesson.isTraining && (
                        <button 
                          className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleDropdown(lesson.id);
                          }}
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      )}
                      {lesson.hasDownload && !lesson.isTraining && (
                        <button className="p-2 text-orange-500 hover:bg-orange-50 rounded-lg transition-colors">
                          <Download className="w-4 h-4" />
                        </button>
                      )}
                      <button className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Training Materials Dropdown */}
                  {lesson.isTraining && expandedDropdowns[lesson.id] && (
                    <div className="bg-gray-50 rounded-lg p-3 mb-3 mt-1">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">مواد التدريب:</h4>
                      <div className="space-y-2">
                        {lesson.trainingMaterials.map((material, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-white rounded-md border border-gray-200">
                            <div className="flex items-center gap-2">
                              {getMaterialIcon(material.type)}
                              <span className="text-sm text-gray-700">{material.title}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-xs text-gray-500">
                                {material.duration && `${material.duration} • `}
                                {material.pages && `${material.pages} صفحة • `}
                                {material.format}
                              </span>
                              <button className="p-1 text-blue-500 hover:bg-blue-100 rounded">
                                <Download className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Enhanced Footer Stats */}
      <div className="mt-8 bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="text-center">
              <div className="text-lg font-bold text-gray-800">
                {currentData.reduce((acc, section) => acc + section.lessonCount, 0)}
              </div>
              <div className="text-sm text-gray-500">إجمالي الدروس</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-800">
                {currentData.reduce((acc, section) => {
                  const completedLessons = section.lessons.filter(l => l.isCompleted).length;
                  return acc + completedLessons;
                }, 0)}
              </div>
              <div className="text-sm text-gray-500">دروس مكتملة</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-800">
                {activeTab === 'foundation' ? '270' : activeTab === 'lectures' ? '180' : '45'} دقيقة
              </div>
              <div className="text-sm text-gray-500">إجمالي المدة</div>
            </div>
          </div>
          
          <div className="text-left">
            <p className="text-sm text-gray-500 mb-1">آخر تحديث</p>
            <p className="text-sm font-medium text-gray-800">اليوم، 2:30 م</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArabicCourseCurriculum;