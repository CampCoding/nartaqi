import Button from '@/components/atoms/Button'
import { Card, Divider, Form, Input, Modal, Radio,Select,  Space, Upload } from 'antd'
import React from 'react'

export default function AddCourseLessonModal({openAddLesson,VIDEO_SOURCES,beforeUploadVideo, beforeUploadPdf , normFile,lessonForm , foundationStages , setOpenAddLesson , submitLesson , savingLesson }) {
  return (
    <Modal
    title="قسم درس"
    open={openAddLesson}
    onCancel={() => setOpenAddLesson(false)}
    onOk={submitLesson}
    confirmLoading={savingLesson}
    width={800}
    destroyOnClose
  >
    <Form
      form={lessonForm}
      layout="vertical"
      initialValues={{
        stageMode: foundationStages.length ? "exist" : "new",
        lessonVideoSource: "url",
        trainingVideoSource: "url",
        pdfs: [{ title: "", fileList: [] }],
      }}
    >
      <Form.Item label="الإضافة إلى" name="stageMode" rules={[{ required: true }]}>
        <Radio.Group>
          <Radio value="new">قسم جديد</Radio>
          <Radio value="exist" disabled={foundationStages.length === 0}>
            قسم موجود 
          </Radio>
        </Radio.Group>
      </Form.Item>

      <Form.Item noStyle shouldUpdate={(p, c) => p.stageMode !== c.stageMode}>
        {({ getFieldValue }) =>
          getFieldValue("stageMode") === "new" ? (
            <Form.Item
              label="اسم القسم الجديد"
              name="stageTitle"
              rules={[{ required: true, message: "أدخل اسم القسم" }]}
            >
              <Input placeholder="مثال: قسم المهارات الأساسية" />
            </Form.Item>
          ) : (
            <Form.Item
              label="اختر القسم"
              name="stageId"
              rules={[{ required: true, message: "اختر القسم" }]}
            >
              <Select
                placeholder="اختيار قسم"
                options={(foundationStages || []).map((s) => ({
                  value: s.id,
                  label: s.title,
                }))}
              />
            </Form.Item>
          )
        }
      </Form.Item>

      <Divider>بيانات المحاضرة</Divider>

      <Form.Item
        label="اسم المحاضرة"
        name="title"
        rules={[{ required: true, message: "أدخل اسم المحاضرة" }]}
      >
        <Input placeholder="مثال: الحروف والأصوات" />
      </Form.Item>

      <Divider>فيديو القسم</Divider>

      <Form.Item
        label="اسم الفيديو"
        name="lessonVideoTitle"
        rules={[{ required: true, message: "أدخل اسم فيديو القسم" }]}
      >
        <Input placeholder="مثال: شرح تمهيدي" />
      </Form.Item>

      <Form.Item label="مصدر الفيديو" name="lessonVideoSource" rules={[{ required: true }]}>
        <Radio.Group optionType="button" buttonStyle="solid">
          {VIDEO_SOURCES.map((s) => (
            <Radio key={s.value} value={s.value}>
              {s.label}
            </Radio>
          ))}
        </Radio.Group>
      </Form.Item>

      <Form.Item noStyle shouldUpdate>
        {({ getFieldValue }) =>
          getFieldValue("lessonVideoSource") === "url" ? (
            <Form.Item
              label="رابط الفيديو"
              name="lessonVideoUrl"
              rules={[{ required: true, message: "أدخل رابط الفيديو" }]}
            >
              <Input placeholder="https://youtube.com/watch?v=..." />
            </Form.Item>
          ) : (
            <Form.Item
              label="رفع ملف الفيديو"
              name="lessonVideoFile"
              valuePropName="fileList"
              getValueFromEvent={normFile}
              rules={[{ required: true, message: "ارفع ملف فيديو" }]}
            >
              <Upload.Dragger beforeUpload={beforeUploadVideo} accept="video/*" maxCount={1}>
                <p className="ant-upload-drag-icon">🎥</p>
                <p className="ant-upload-text">اسحب ملف الفيديو هنا أو اضغط للاختيار</p>
              </Upload.Dragger>
            </Form.Item>
          )
        }
      </Form.Item>

      <Divider>تدريب القسم</Divider>

      <Form.Item
        label="اسم فيديو التدريب"
        name="trainingVideoTitle"
        rules={[{ required: true, message: "أدخل اسم فيديو التدريب" }]}
      >
        <Input placeholder="مثال: تدريب تطبيقي" />
      </Form.Item>

      <Form.Item label="مصدر فيديو التدريب" name="trainingVideoSource" rules={[{ required: true }]}>
        <Radio.Group optionType="button" buttonStyle="solid">
          {VIDEO_SOURCES.map((s) => (
            <Radio key={s.value} value={s.value}>
              {s.label}
            </Radio>
          ))}
        </Radio.Group>
      </Form.Item>

      <Form.Item noStyle shouldUpdate>
        {({ getFieldValue }) =>
          getFieldValue("trainingVideoSource") === "url" ? (
            <Form.Item
              label="رابط فيديو التدريب"
              name="trainingVideoUrl"
              rules={[{ required: true, message: "أدخل الرابط" }]}
            >
              <Input placeholder="https://..." />
            </Form.Item>
          ) : (
            <Form.Item
              label="رفع فيديو التدريب"
              name="trainingVideoFile"
              valuePropName="fileList"
              getValueFromEvent={normFile}
              rules={[{ required: true, message: "ارفع ملف فيديو" }]}
            >
              <Upload.Dragger beforeUpload={beforeUploadVideo} accept="video/*" maxCount={1}>
                <p className="ant-upload-drag-icon">🎥</p>
                <p className="ant-upload-text">اسحب ملف الفيديو هنا أو اضغط للاختيار</p>
              </Upload.Dragger>
            </Form.Item>
          )
        }
      </Form.Item>

      <Divider>ملفات التدريب (PDF)</Divider>

      <Form.List name="pdfs">
        {(fields, { add, remove, move }) => (
          <>
            <div className="flex items-center justify-between mb-2">
              <h4 className="m-0 text-sm">ملفات PDF</h4>
              <Button type="dashed" className='text-primary hover:bg-primary hover:text-white transition-all duration-100 border border-primary p-2 rounded-lg ' onClick={() => add({ title: "", fileList: [] })}>
                إضافة PDF
              </Button>
            </div>

            {fields.map(({ key, name, ...rest }) => (
              <Card
                key={key}
                className="mb-3"
                size="small"
                title={`ملف #${name + 1}`}
                extra={
                  <Space>
                    <Button size="small" onClick={() => name > 0 && move(name, name - 1)}>
                      ↑
                    </Button>
                    <Button size="small" onClick={() => name < fields.length - 1 && move(name, name + 1)}>
                      ↓
                    </Button>
                    <Button danger type="text" onClick={() => remove(name)}>
                      حذف
                    </Button>
                  </Space>
                }
              >
                <Form.Item
                  {...rest}
                  label="اسم الملف"
                  name={[name, "title"]}
                  rules={[{ required: true, message: "أدخل اسم الملف" }]}
                >
                  <Input placeholder="مثال: ورقة عمل — الدرس 1" />
                </Form.Item>

                <Form.Item
                  label="رفع PDF"
                  name={[name, "fileList"]}
                  valuePropName="fileList"
                  getValueFromEvent={normFile}
                  rules={[{ required: true, message: "ارفع ملف PDF" }]}
                >
                  <Upload.Dragger beforeUpload={beforeUploadPdf} accept=".pdf" maxCount={1}>
                    <p className="ant-upload-drag-icon">📄</p>
                    <p className="ant-upload-text">اسحب ملف PDF هنا أو اضغط للاختيار</p>
                  </Upload.Dragger>
                </Form.Item>
              </Card>
            ))}

            {fields.length === 0 && (
              <div className="text-gray-500 text-center py-3">
                لا توجد ملفات — اضغط “إضافة PDF”.
              </div>
            )}
          </>
        )}
      </Form.List>
    </Form>
  </Modal>
  )
}
