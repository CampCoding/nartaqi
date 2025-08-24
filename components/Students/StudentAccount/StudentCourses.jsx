import React, { useState } from 'react'
import { BookOpen, Clock, CheckCircle, Award, TrendingUp, Play, Calendar } from 'lucide-react'

// Mock StudentProgressBar component
const StudentProgressBar = ({ value, color = 'blue' }) => {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-emerald-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500'
  }
  
  return (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div 
        className={`h-2 rounded-full transition-all duration-500 ease-out ${colorClasses[color] || colorClasses.blue}`}
        style={{ width: `${value}%` }}
      ></div>
    </div>
  )
}

export default function StudentCourses() {
  const [hoveredCourse, setHoveredCourse] = useState(null)
  
  // Mock data
  const courses = [
    {
      id: 1,
      title: "تطوير تطبيقات الويب",
      instructor: "أحمد محمد",
      status: "نشط",
      progress: 75,
      completedLessons: 15,
      totalLessons: 20,
      nextLesson: "React Hooks المتقدمة",
      color: "blue",
      duration: "6 أسابيع",
      difficulty: "متوسط"
    },
    {
      id: 2,
      title: "علوم البيانات والذكاء الاصطناعي",
      instructor: "فاطمة أحمد",
      status: "مكتمل",
      progress: 100,
      completedLessons: 25,
      totalLessons: 25,
      completionDate: "15 يوليو 2024",
      color: "green",
      duration: "8 أسابيع",
      difficulty: "متقدم"
    },
    {
      id: 3,
      title: "التصميم الجرافيكي",
      instructor: "سارة علي",
      status: "قيد الانتظار",
      progress: 0,
      completedLessons: 0,
      totalLessons: 12,
      nextLesson: "مقدمة في Adobe Illustrator",
      color: "purple",
      duration: "4 أسابيع",
      difficulty: "مبتدئ"
    }
  ]

  const calculateOverallProgress = () => {
    const totalProgress = courses.reduce((sum, course) => sum + course.progress, 0)
    return Math.round(totalProgress / courses.length)
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "نشط":
        return <Play className="w-3 h-3" />
      case "مكتمل":
        return <CheckCircle className="w-3 h-3" />
      default:
        return <Clock className="w-3 h-3" />
    }
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "مبتدئ":
        return "text-green-600 bg-green-50"
      case "متوسط":
        return "text-yellow-600 bg-yellow-50"
      case "متقدم":
        return "text-red-600 bg-red-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  return (
    <div className="min-h-screenp-6" dir="rtl">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Overall Progress Card */}
        <div className="relative bg-gradient-to-r from-[#87bac8] via-[#3f90a6] to-[#27829b] rounded-3xl p-8 text-white shadow-2xl overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-10 backdrop-blur-sm"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-white bg-opacity-20 rounded-2xl backdrop-blur-sm">
                <TrendingUp className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">معدل إنجاز الدورات المشترك بها</h2>
                <p className="text-blue-100 mt-1">إجمالي التقدم في جميع الدورات</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="flex-1">
                <div className="bg-white bg-opacity-20 rounded-full h-4 mb-2">
                  <div 
                    className="bg-white h-4 rounded-full transition-all duration-1000 ease-out shadow-lg"
                    style={{ width: `${calculateOverallProgress()}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm text-blue-100">
                  <span>البداية</span>
                  <span>الإتمام</span>
                </div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold mb-2">{calculateOverallProgress()}%</div>
                <div className="text-blue-100 text-sm">مكتمل</div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-8">
              <div className="text-center p-4 bg-white bg-opacity-10 rounded-2xl backdrop-blur-sm">
                <div className="text-2xl font-bold">{courses.length}</div>
                <div className="text-blue-100 text-sm">إجمالي الدورات</div>
              </div>
              <div className="text-center p-4 bg-white bg-opacity-10 rounded-2xl backdrop-blur-sm">
                <div className="text-2xl font-bold">{courses.filter(c => c.status === "مكتمل").length}</div>
                <div className="text-blue-100 text-sm">دورات مكتملة</div>
              </div>
              <div className="text-center p-4 bg-white bg-opacity-10 rounded-2xl backdrop-blur-sm">
                <div className="text-2xl font-bold">{courses.filter(c => c.status === "نشط").length}</div>
                <div className="text-blue-100 text-sm">دورات نشطة</div>
              </div>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-white bg-opacity-10 rounded-full"></div>
          <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white bg-opacity-5 rounded-full"></div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {courses.map((course) => (
            <div
              key={course.id}
              className={`group bg-white rounded-3xl shadow-xl border border-gray-100 p-8 flex flex-col gap-6 transition-all duration-300 hover:shadow-2xl hover:scale-105 cursor-pointer ${
                hoveredCourse === course.id ? 'ring-4 ring-blue-100' : ''
              }`}
              onMouseEnter={() => setHoveredCourse(course.id)}
              onMouseLeave={() => setHoveredCourse(null)}
            >
              {/* Course Header */}
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-xl text-gray-800 group-hover:text-blue-600 transition-colors">
                      {course.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-2 text-gray-500">
                      <BookOpen className="w-4 h-4" />
                      <span className="text-sm">مع {course.instructor}</span>
                    </div>
                  </div>
                  <span
                    className={`flex items-center gap-1 px-3 py-2 rounded-full text-xs font-semibold transition-all duration-300 ${
                      course.status === "نشط"
                        ? "bg-emerald-50 text-emerald-700 group-hover:bg-emerald-100"
                        : course.status === "مكتمل"
                        ? "bg-blue-50 text-blue-700 group-hover:bg-blue-100"
                        : "bg-amber-50 text-amber-700 group-hover:bg-amber-100"
                    }`}
                  >
                    {getStatusIcon(course.status)}
                    {course.status}
                  </span>
                </div>

                {/* Course Meta */}
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{course.duration}</span>
                  </div>
                  <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getDifficultyColor(course.difficulty)}`}>
                    {course.difficulty}
                  </span>
                </div>
              </div>

              {/* Progress Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 font-medium">التقدم</span>
                  <span className="font-bold text-gray-800 text-lg">{course.progress}%</span>
                </div>
                
                <div className="relative">
                  <StudentProgressBar value={course.progress} color={course.color} />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 -skew-x-12 animate-pulse"></div>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Award className="w-4 h-4" />
                    <span>{course.completedLessons}/{course.totalLessons} درس</span>
                  </div>
                  {course.progress > 0 && (
                    <div className="text-blue-600 font-medium">
                      {course.totalLessons - course.completedLessons} متبقي
                    </div>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  )
}