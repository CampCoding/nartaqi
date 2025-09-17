import React from 'react'
import Card from '../Questions/ExamCard'
import Button from '../atoms/Button'
import { Empty, Tooltip, Dropdown, Space } from 'antd'
import { Clock3, Eye, EyeOff, ListChecks, Target, Copy } from 'lucide-react'

const ExamTypeTag = ({ t }) => (
  <span className={`px-2 py-1 rounded-full text-xs ${
    t === "training" 
      ? "bg-blue-100 text-blue-700" 
      : "bg-purple-100 text-purple-700"
  }`}>
    {t === "training" ? "تدريبي" : "محاكي"}
  </span>
);

export default function AddSaudiCourseSourceExams({
  setOpenPickExam, 
  setExams, 
  toggleExamVisibility, 
  exams, 
  getCopyMenu
}) {
  return (
    <Card
      title={
        <div className="flex items-center justify-between">
          <span className="font-bold">الاختبارات</span>
          <div className="flex gap-2">
            <Dropdown 
              overlay={getCopyMenu("exam")} 
              trigger={['click']}
              placement="bottomRight"
            >
              <Button className="!bg-purple-600 !text-white flex items-center gap-2">
                <Copy className="w-4 h-4" />
                نسخ الاختبارات
              </Button>
            </Dropdown>
            <Button className="!bg-gray-700 !text-white" onClick={() => setOpenPickExam(true)}>
              انشاء اختبار
            </Button>
          </div>
        </div>
      }
    >
      {exams.length === 0 ? (
        <Empty description="لا توجد اختبارات" />
      ) : (
        <div className="space-y-3">
          {exams.map((e) => (
            <div
              key={e.id}
              className={`flex items-center justify-between rounded-lg border p-3 ${
                e.visible ? "bg-gray-50" : "bg-gray-100 opacity-70"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-purple-100 p-2 text-purple-700">
                  <ListChecks className="w-4 h-4" />
                </div>
                <div>
                  <div className={`font-medium ${e.visible ? "text-gray-800" : "text-gray-500"}`}>{e.title}</div>
                  <div className="text-xs text-gray-500 flex items-center gap-2">
                    <ExamTypeTag t={e.examType} />
                    <span className="inline-flex items-center gap-1">
                      <Clock3 className="w-3.5 h-3.5" />
                      {e.duration} دقيقة
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Target className="w-3.5 h-3.5" />
                      {e.questions} سؤال
                    </span>
                  </div>
                </div>
              </div>
              <Space>
                {/* Copy Exam Dropdown */}
                <Dropdown 
                  overlay={getCopyMenu("exam", e.id)} 
                  trigger={['click']}
                  placement="bottomRight"
                >
                  <Tooltip title="نسخ الاختبار إلى دورة أخرى">
                    <Button
                      type="text"
                      className="!p-2 hover:!bg-purple-50 !text-purple-600"
                      icon={<Copy className="w-4 h-4" />}
                    />
                  </Tooltip>
                </Dropdown>
                
                <Tooltip title={e.visible ? "إخفاء الاختبار" : "إظهار الاختبار"}>
                  <Button
                    type="text"
                    icon={
                      e.visible ? <Eye className="w-4 h-4 text-green-600" /> : <EyeOff className="w-4 h-4 text-gray-400" />
                    }
                    onClick={() => toggleExamVisibility(e.id)}
                  />
                </Tooltip>

                <Button danger onClick={() => setExams((p) => p.filter((x) => x.id !== e.id))}>
                  حذف
                </Button>
              </Space>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}