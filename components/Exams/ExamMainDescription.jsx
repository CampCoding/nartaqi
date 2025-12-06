import React from 'react'
import SectionCard from './ExamSectionCard'
import { Clock3, FileText, ListChecks, Star, Users } from 'lucide-react'

export default function ExamMainDescription({ exam }) {
  return (
    <SectionCard
      title="الوصف العام"
      icon={FileText}
      extra={
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">
            معرّف الاختبار: #{exam.id}
          </span>
        </div>
      }
    >
      <p className="text-gray-700 leading-relaxed mb-6" dangerouslySetInnerHTML={{ __html: exam?.description || "—" }}></p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl p-3 border border-teal-200">
          <div className="flex items-center gap-2 text-teal-700">
            <Clock3 className="w-4 h-4" />
            <span className="text-sm font-semibold">المدة</span>
          </div>
          <div className="text-lg font-bold text-teal-800 mt-1">{exam.duration} دقيقة</div>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-3 border border-blue-200">
          <div className="flex items-center gap-2 text-blue-700">
            <ListChecks className="w-4 h-4" />
            <span className="text-sm font-semibold">الأسئلة</span>
          </div>
          <div className="text-lg font-bold text-blue-800 mt-1">{exam?.mcq?.length ?? 0}</div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-3 border border-purple-200">
          <div className="flex items-center gap-2 text-purple-700">
            <Users className="w-4 h-4" />
            <span className="text-sm font-semibold">مشاركون</span>
          </div>
          <div className="text-lg font-bold text-purple-800 mt-1">{exam.participants ?? 0}</div>
        </div>
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-3 border border-amber-200">
          <div className="flex items-center gap-2 text-amber-700">
            <Star className="w-4 h-4" />
            <span className="text-sm font-semibold">التقييم</span>
          </div>
          <div className="text-lg font-bold text-amber-800 mt-1">{exam.rating ?? 0}</div>
        </div>
      </div>
    </SectionCard>
  )
}