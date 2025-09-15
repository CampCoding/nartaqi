import { BookOpen, Clock, FileText, Users } from 'lucide-react'
import React from 'react'

export default function QuestionStats({examData , getEstimatedDuration , getTotalQuestions}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">إجمالي الأسئلة</p>
                  <p className="text-xl font-bold text-gray-900">{getTotalQuestions()}</p>
                </div>
              </div>
            </div>
    
            <div className="bg-white p-4 rounded-xl border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <BookOpen className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">الأقسام</p>
                  <p className="text-xl font-bold text-gray-900">{examData?.sections?.length}</p>
                </div>
              </div>
            </div>
    
            <div className="bg-white p-4 rounded-xl border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Clock className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">المدة (دقيقة)</p>
                  <p className="text-xl font-bold text-gray-900">{getEstimatedDuration()}</p>
                </div>
              </div>
            </div>
    
            <div className="bg-white p-4 rounded-xl border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Users className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">نوع الاختبار</p>
                  <p className="text-xl font-bold text-gray-900">
                    {examData?.type === "intern" ? "تدريب" : examData?.type === "mock" ? "محاكي" : "-"}
                  </p>
                </div>
              </div>
            </div>
          </div>
  )
}
