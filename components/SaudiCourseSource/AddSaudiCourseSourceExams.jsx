import React, { useState } from 'react'
import Card from '../Questions/ExamCard'
import Button from '../atoms/Button'
import {
  Empty,
  Tooltip,
  Dropdown,
  Space,
  Modal,
  Form,
  Input,
  InputNumber,
  Radio,
  Switch,
  message,
  Select,
} from 'antd'
import { Clock3, Eye, EyeOff, ListChecks, Target, Copy, Edit } from 'lucide-react'

const ExamTypeTag = ({ t }) => (
  <span
    className={`px-2 py-1 rounded-full text-xs ${
      t === 'training' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
    }`}
  >
    {t === 'training' ? 'تدريبي' : 'محاكي'}
  </span>
)

export default function AddSaudiCourseSourceExams({
  setOpenPickExam,
  setExams,
  toggleExamVisibility,
  exams,
  getCopyMenu,
  updateExam,       // اختياري: (id, {title, examType, duration, visible}) => Promise|void
  examLibrary = [], // مكتبة الاختبارات لاختيار/تعبئة بيانات الاختبار
}) {
  // ----- Edit Modal state -----
  const [openEdit, setOpenEdit] = useState(false)
  const [editingExam, setEditingExam] = useState(null)
  const [saving, setSaving] = useState(false)
  const [form] = Form.useForm()

  const onOpenEdit = (exam) => {
    setEditingExam(exam)
    form.setFieldsValue({
      examId: exam?.id, // لو الاختبار موجود في المكتبة سيظهر مختارًا
      title: exam?.title ?? '',
      examType: exam?.examType ?? 'training',
      duration: Number(exam?.duration) || 10,
      visible: !!exam?.visible,
    })
    setOpenEdit(true)
  }

  const onSubmitEdit = async () => {
    try {
      const values = await form.validateFields()
      const targetId = values.examId ?? editingExam?.id
      if (!targetId) return

      const payload = {
        title: values.title.trim(),
        examType: values.examType,
        duration: Number(values.duration),
        visible: values.visible,
      }

      setSaving(true)

      if (typeof updateExam === 'function') {
        await Promise.resolve(updateExam(targetId, payload))
      } else {
        // تحديث محلي كحل افتراضي
        setExams((prev) =>
          prev.map((x) => ((x.id ?? x._id) === targetId ? { ...x, ...payload } : x))
        )
      }

      message.success('تم حفظ تعديلات الاختبار')
      setOpenEdit(false)
      setEditingExam(null)
      form.resetFields()
    } catch (e) {
      // validation error or thrown error
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card
      title={
        <div className="flex items-center justify-between">
          <span className="font-bold">الاختبارات</span>
          <div className="flex gap-2">
            <Dropdown overlay={getCopyMenu('exam')} trigger={['click']} placement="bottomRight">
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
                e.visible ? 'bg-gray-50' : 'bg-gray-100 opacity-70'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-purple-100 p-2 text-purple-700">
                  <ListChecks className="w-4 h-4" />
                </div>
                <div>
                  <div className={`font-medium ${e.visible ? 'text-gray-800' : 'text-gray-500'}`}>
                    {e.title}
                  </div>
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
                <Dropdown overlay={getCopyMenu('exam', e.id)} trigger={['click']} placement="bottomRight">
                  <Tooltip title="نسخ الاختبار إلى دورة أخرى">
                    <Button
                      type="text"
                      className="!p-2 hover:!bg-purple-50 !text-purple-600"
                      icon={<Copy className="w-4 h-4" />}
                    />
                  </Tooltip>
                </Dropdown>

                {/* Edit */}
                <Tooltip title="تعديل الاختبار">
                  <Button
                    type="text"
                    className="!p-2 hover:!bg-purple-50 !text-green-600"
                    icon={<Edit className="w-4 h-4" />}
                    onClick={() => onOpenEdit(e)}
                  />
                </Tooltip>

                {/* Toggle visibility */}
                <Tooltip title={e.visible ? 'إخفاء الاختبار' : 'إظهار الاختبار'}>
                  <Button
                    type="text"
                    icon={
                      e.visible ? (
                        <Eye className="w-4 h-4 text-green-600" />
                      ) : (
                        <EyeOff className="w-4 h-4 text-gray-400" />
                      )
                    }
                    onClick={() => toggleExamVisibility(e.id)}
                  />
                </Tooltip>

                {/* Delete */}
                <Button danger onClick={() => setExams((p) => p.filter((x) => x.id !== e.id))}>
                  حذف
                </Button>
              </Space>
            </div>
          ))}
        </div>
      )}

      {/* ====== EDIT EXAM MODAL (style aligned with pick modal) ====== */}
      <Modal
        title="تعديل اختبار"
        open={openEdit}
        onCancel={() => {
          setOpenEdit(false)
          setEditingExam(null)
          form.resetFields()
        }}
        onOk={onSubmitEdit}
        okText="حفظ"
        confirmLoading={saving}
        width={560}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ examType: 'training', duration: 10, visible: true }}
        >
          {/* اختيار اختبار واحد من المكتبة (اختياري) */}
          <Form.Item
            label="اختر اختبار"
            name="examId"
            tooltip="يمكنك اختيار اختبار من المكتبة لتعبئة الحقول ثم التعديل والحفظ"
          >
            <Select
              allowClear
              placeholder={
                examLibrary.length
                  ? 'اختر من الاختبارات المحفوظة'
                  : 'لا توجد اختبارات في المكتبة — أنشئ اختبارًا أولاً'
              }
              optionFilterProp="label"
              options={examLibrary.map((e) => ({
                value: e.id ?? e._id,
                label: `${e.title ?? 'بدون عنوان'} · ${
                  (e.examType ?? e.type) === 'mock' ? 'محاكي' : 'تدريب'
                } · ${
                  Array.isArray(e.questions)
                    ? e.questions.length
                    : e.questionsCount ?? e.questions ?? 0
                } سؤال`,
                raw: e,
              }))}
              onChange={(val, opt) => {
                if (!val) return
                const exam = opt?.raw ?? examLibrary.find((x) => (x.id ?? x._id) === val)
                if (exam) {
                  form.setFieldsValue({
                    title: exam.title ?? '',
                    examType: (exam.examType ?? exam.type) === 'mock' ? 'mock' : 'training',
                    duration: Number(exam.duration) || 10,
                    visible: !!exam.visible,
                  })
                }
              }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  )
}
