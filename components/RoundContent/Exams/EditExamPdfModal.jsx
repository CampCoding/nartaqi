import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Button, Upload, message, Select } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { handleEditExamPdf, handleGetAllExamData } from "../../../lib/features/examSlice";
import { handleGetAllRoundContent } from "../../../lib/features/roundContentSlice";

const EditExamPdfModal = ({ open, setOpen, pdfData, exam_id, id }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);

  const { edit_exam_pdf } = useSelector((state) => state?.exam || {});

  useEffect(() => {
    if (pdfData && open) {
      form.setFieldsValue({
        title: pdfData?.title || "",
        description: pdfData?.description || "",
        type: pdfData?.type || "question",
      });
      // لا نعرض ملف في الـ Upload إلا لو المستخدم اختار واحد جديد
      setFileList([]);
    }
  }, [pdfData, open, form]);

  const handleUploadChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const beforeUpload = (file) => {
    const isPdf = file.type === "application/pdf";
    const isLt5M = file.size / 1024 / 1024 < 5;

    if (!isPdf) {
      message.error("يمكنك رفع ملفات PDF فقط!");
      return Upload.LIST_IGNORE;
    }

    if (!isLt5M) {
      message.error("حجم الملف يجب أن يكون أقل من 5MB!");
      return Upload.LIST_IGNORE;
    }

    // نمنع الرفع التلقائي، هنرفع مع الفورم
    return false;
  };

  const handleSubmit = async (values) => {
    if (!pdfData?.id) {
      message.error("لا يوجد ملف محدد للتعديل");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("id", pdfData.id);
      formData.append("exam_id", exam_id || pdfData.exam_id);
      formData.append("title", values.title);
      formData.append("description", values.description || "");
      formData.append("type", values?.type || "question");

      // لو المستخدم اختار ملف جديد نبعته، لو لأ نسيب القديم زي ما هو
      if (fileList.length > 0 && fileList[0]?.originFileObj) {
        formData.append("pdf_url", fileList[0].originFileObj);
      }

      const result = await dispatch(handleEditExamPdf({ body: formData })).unwrap();

      if (result?.data?.status === "success") {
        toast.success("تم تعديل ملف PDF بنجاح");
        dispatch(handleGetAllExamData({body : {
          id : exam_id
        }}))
        // تحديث محتوى الدورة
        dispatch(handleGetAllRoundContent({ body: { round_id: id } }));
        form.resetFields();
        setFileList([]);
        setOpen(false);
      } else {
        toast.error("فشل في تعديل ملف PDF");
      }
    } catch (error) {
      console.error("Error editing exam PDF:", error);
      toast.error("حدث خطأ أثناء تعديل الملف PDF");
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
      title="تعديل ملف PDF للاختبار"
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
          rules={[{ required: true, message: "يرجى اختيار نوع الملف" }]}
        >
          <Select
            placeholder="اختر نوع الملف"
            options={[
              { label: "الأسئلة", value: "question" },
              { label: "الإجابات", value: "answers" },
            ]}
          />
        </Form.Item>

        {pdfData?.pdf_url && (
          <div className="mb-3 text-sm">
            <span className="text-gray-600">الملف الحالي: </span>
            <a
              href={pdfData.pdf_url}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 hover:text-blue-700"
            >
              فتح الملف الحالي
            </a>
          </div>
        )}

        <Form.Item label="رفع ملف PDF جديد (اختياري)">
          <Upload
            accept=".pdf"
            beforeUpload={beforeUpload}
            onChange={handleUploadChange}
            fileList={fileList}
            maxCount={1}
          >
            <Button icon={<UploadOutlined />}>اختر ملف PDF جديد</Button>
          </Upload>
          <p className="text-xs text-gray-500 mt-2">
            يمكنك ترك هذه الخانة فارغة إذا كنت لا تريد تغيير الملف الحالي.
          </p>
          {fileList.length > 0 && (
            <p className="text-xs text-green-600 mt-1">
              ✓ تم اختيار ملف: {fileList[0].name}
            </p>
          )}
        </Form.Item>

        <div className="flex gap-3 justify-end mt-8">
          <Button
            size="large"
            onClick={handleCancel}
            disabled={loading || edit_exam_pdf}
          >
            إلغاء
          </Button>

          <Button
            type="primary"
            size="large"
            htmlType="submit"
            loading={loading || edit_exam_pdf}
            className="bg-green-600 hover:bg-green-700"
          >
            {loading ? "جاري التعديل..." : "حفظ التعديلات"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default EditExamPdfModal;
