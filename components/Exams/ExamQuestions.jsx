import { ArrowRight, CheckCircle2, Filter, Search, Info } from 'lucide-react'
import React from 'react'
import SectionCard from './ExamSectionCard'

export default function ExamQuestions({
  ListChecks,
  query,
  setQuery,
  showCorrectOnly,
  setShowCorrectOnly,
  filteredQuestions
}) {
  return (
    <SectionCard
      title="الأسئلة والإجابات"
      icon={ListChecks}
      extra={
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="ابحث داخل الأسئلة..."
              className="w-full sm:w-64 pr-10 pl-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-300 text-sm transition-all"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <label className="inline-flex items-center gap-2 text-sm text-gray-700 bg-gray-50 px-3 py-2 rounded-xl border">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
              checked={showCorrectOnly}
              onChange={(e) => setShowCorrectOnly(e.target.checked)}
            />
            <Filter className="w-4 h-4" />
            الإجابات الصحيحة فقط
          </label>
        </div>
      }
    >
      {filteredQuestions.length === 0 ? (
        <div className="text-center py-12">
          <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <div className="text-gray-500 font-medium">لا توجد نتائج مطابقة للبحث</div>
          <div className="text-sm text-gray-400 mt-1">حاول استخدام كلمات مفتاحية أخرى</div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredQuestions.map((q, idx) => (
            <div
              key={q.id ?? `q-${idx}`}
              className="rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50/30 overflow-hidden hover:shadow-md transition-all duration-300"
            >
              <details className="group">
                <summary className="flex cursor-pointer list-none items-start justify-between p-5 hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="rounded-lg bg-gradient-to-br from-teal-100 to-teal-200 px-3 py-2 text-sm font-bold text-teal-800 border border-teal-300">
                      س {idx + 1}
                    </div>
                    <h4 className="text-gray-900 font-semibold text-right flex-1 leading-relaxed">
                      {q.title}
                    </h4>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 transition-all duration-300 group-open:-rotate-90 group-hover:text-teal-500 mt-1" />
                </summary>

                <div className="px-5 pb-5 space-y-3">
                  {/* الإجابات */}
                  {q.answers.map((a, ansIdx) => (
                    <div
                      key={a.id ?? `ans-${idx}-${ansIdx}`}
                      className={`flex flex-col gap-2 rounded-xl border px-4 py-3 transition-all hover:shadow-sm ${
                        a.isCorrect
                          ? 'border-emerald-200 bg-gradient-to-r from-emerald-50 to-emerald-100/50'
                          : 'border-gray-200 bg-white hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">
                          {a.isCorrect ? (
                            <div className="rounded-full bg-emerald-100 p-1">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            </div>
                          ) : (
                            <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center">
                              <span className="text-xs font-medium text-gray-500">
                                {String.fromCharCode(65 + ansIdx)}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="flex-1 text-sm text-gray-800 leading-relaxed">
                          {a.text}
                        </div>

                        {a.isCorrect && (
                          <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-1 rounded-full">
                            ✓ صحيحة
                          </span>
                        )}
                      </div>

                      {/* شرح الإجابة (اختياري) */}
                      {a.explanation && a.explanation.trim().length > 0 && (
                        <div className="flex items-start gap-2 pl-9 sm:pl-10">
                          <Info className="w-4 h-4 mt-0.5 text-gray-500" />
                          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                            <span className="font-medium">الشرح : </span>
                            {a.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </details>
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  )
}
