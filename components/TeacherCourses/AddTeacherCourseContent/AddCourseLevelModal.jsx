import { Form, Input, Modal } from 'antd'
import React from 'react'

export default function AddCourseLevelModal({openAddStage , setOpenAddStage , savingStage ,stageForm , submitStage}) {
  return (
    <Modal
        title="إضافة مرحلة"
        open={openAddStage}
        onCancel={() => setOpenAddStage(false)}
        onOk={submitStage}
        confirmLoading={savingStage}
        destroyOnClose
      >
        <Form form={stageForm} layout="vertical" initialValues={{ title: "" }}>
          <Form.Item
            label="اسم المرحلة"
            name="title"
            rules={[{ required: true, message: "أدخل اسم المرحلة" }]}
          >
            <Input placeholder="مثال: مرحلة التأسيس — المستوى الأول" />
          </Form.Item>
        </Form>
      </Modal>
  )
}
