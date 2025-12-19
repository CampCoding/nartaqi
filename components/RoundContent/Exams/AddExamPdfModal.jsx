import React, { useState } from "react";
import { Modal, Form, Input, Button, Upload, message, Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { UploadOutlined } from "@ant-design/icons";
import { handleAddExamPdf, handleGetAllExamData } from "../../../lib/features/examSlice";
import { handleGetAllRoundContent } from "../../../lib/features/roundContentSlice";

const AddExamPdfModal = ({ open, setOpen, exam_id, lesson_id, id }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);

  const { add_exam_pdf } = useSelector((state) => state?.exam);

  const handleUploadChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const beforeUpload = (file) => {
    const isPdf = file.type === "application/pdf";
    const isLt5M = file.size / 1024 / 1024 < 5; // Less than 5MB

    if (!isPdf) {
      message.error("يمكنك رفع ملفات PDF فقط!");
      return Upload.LIST_IGNORE;
    }

    if (!isLt5M) {
      message.error("حجم الملف يجب أن يكون أقل من 5MB!");
      return Upload.LIST_IGNORE;
    }

    // Prevent auto upload, we will send it manually in FormData
    return false;
  };

  const handleSubmit = async (values) => {
    try {
      if (fileList.length === 0) {
        message.error("يرجى رفع ملف PDF");
        return;
      }

      const fileObj = fileList[0].originFileObj;
      if (!fileObj) {
        message.error("حدث خطأ في قراءة الملف، حاول مرة أخرى");
        return;
      }

      setLoading(true);

      // Build FormData to match your Postman request
      const formData = new FormData();
      formData.append("lesson_id",lesson_id || exam_id?.id || exam_id); // same as Postman
      formData.append("title", values.title);
      formData.append("description", values.description || "");
      formData.append("type", values?.type || "");
      formData.append("pdf_url", fileObj); // the actual file

      console.log("Sending FormData for add_exam_pdf");

      const result = await dispatch(handleAddExamPdf({ body: formData })).unwrap();

      if (result?.data?.status === "success") {
        toast.success( "تم إضافة الملف PDF بنجاح");
        // refresh round content
        dispatch(handleGetAllRoundContent({ body: { round_id: id } }));
        dispatch(handleGetAllExamData({body : {
          id : exam_id
        }}))
        form.resetFields();
        setFileList([]);
        setOpen(false);
      } else {
        toast.error(res?.error?.response?.data?.message ||"فشل في إضافة الملف PDF");
      }
    } catch (error) {
      console.error("Error adding exam PDF:", error);
      toast.error("حدث خطأ أثناء إضافة الملف PDF");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setFileList([]);
    setOpen(false);
  };

  return (
    <Modal
      title="إضافة ملف PDF للاختبار"
      open={open}
      onCancel={handleCancel}
      footer={null}
      centered
      width={600}
      dir="rtl"
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="mt-6"
      >
        <Form.Item
          name="title"
          label="عنوان الملف"
          rules={[
            { required: true, message: "يرجى إدخال عنوان الملف" },
            { min: 3, message: "العنوان يجب أن يكون على الأقل 3 أحرف" },
          ]}
        >
          <Input placeholder="أدخل عنوان الملف" size="large" />
        </Form.Item>

        <Form.Item name="description" label="وصف الملف (اختياري)">
          <Input.TextArea
            placeholder="أدخل وصف للملف"
            rows={3}
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="type"
          label="نوع الملف"
          // rules={[{ required: true, message: "يرجى اختيار نوع الملف" }]}
        >
          <Select
            placeholder="اختر نوع الملف"
            options={[
              { label: "الأسئلة", value: "question" },
              { label: "الاجابات", value: "answers" },
            ]}
          />
        </Form.Item>

        <Form.Item
          label="رفع ملف PDF"
          required
        >
          <Upload
            accept=".pdf"
            beforeUpload={beforeUpload}
            onChange={handleUploadChange}
            fileList={fileList}
            maxCount={1}
          >
            <Button icon={<UploadOutlined />}>اختر ملف PDF</Button>
          </Upload>
          
          {fileList.length > 0 && (
            <p className="text-xs text-green-600 mt-1">
              ✓ تم اختيار ملف: {fileList[0].name}
            </p>
          )}
        </Form.Item>

        <div className="flex gap-3 justify-end mt-8">
          <Button size="large" onClick={handleCancel} disabled={loading || add_exam_pdf}>
            إلغاء
          </Button>

          <Button
            type="primary"
            size="large"
            htmlType="submit"
            loading={loading || add_exam_pdf}
            className="bg-green-600 hover:bg-green-700"
            disabled={fileList.length === 0}
          >
            {loading ? "جاري الإضافة..." : "إضافة الملف"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default AddExamPdfModal;
