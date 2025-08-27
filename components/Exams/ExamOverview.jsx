import React from 'react'
import SectionCard from './ExamSectionCard'
import { Award, BarChart3, Clock3, TrendingUp } from 'lucide-react'

export default function ExamOverview() {
  return (
       <SectionCard title="نظرة عامة" icon={TrendingUp}>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl border border-emerald-200">
                    <div>
                      <div className="text-sm font-medium text-emerald-800">معدل النجاح</div>
                      <div className="text-lg font-bold text-emerald-900">85%</div>
                    </div>
                    <div className="rounded-full bg-emerald-200 p-2">
                      <Award className="w-5 h-5 text-emerald-700" />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                    <div>
                      <div className="text-sm font-medium text-blue-800">متوسط الدرجات</div>
                      <div className="text-lg font-bold text-blue-900">7.2/10</div>
                    </div>
                    <div className="rounded-full bg-blue-200 p-2">
                      <BarChart3 className="w-5 h-5 text-blue-700" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-amber-50 to-amber-100 rounded-xl border border-amber-200">
                    <div>
                      <div className="text-sm font-medium text-amber-800">متوسط الوقت المستغرق</div>
                      <div className="text-lg font-bold text-amber-900">98 دقيقة</div>
                    </div>
                    <div className="rounded-full bg-amber-200 p-2">
                      <Clock3 className="w-5 h-5 text-amber-700" />
                    </div>
                  </div>
                </div>
              </SectionCard>
  )
}
