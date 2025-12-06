import { Form, Input, Modal } from 'antd'
import React from 'react'

export default function AddCourseLevelModal({openAddStage , setOpenAddStage , savingStage ,stageForm , submitStage}) {
  return (
    <Modal
        title="إضافة قسم"
        open={openAddStage}
        onCancel={() => setOpenAddStage(false)}
        onOk={submitStage}
        cancelText="إلغاء"
        okText="إضافة"
        okButtonProps={{className:"!bg-blue-500 !text-white"}}
        confirmLoading={savingStage}
        destroyOnClose
      >
        <Form form={stageForm} layout="vertical" initialValues={{ title: "" }}>
          <Form.Item
            label="اسم القسم"
            name="title"
            rules={[{ required: true, message: "أدخل اسم القسم" }]}
          >
            <Input placeholder="مثال: مرحلة التأسيس — المستوى الأول" />
          </Form.Item>
        </Form>
      </Modal>
  )
}
