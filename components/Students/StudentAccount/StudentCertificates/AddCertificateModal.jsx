"use client";
import { Save, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  handleAddCertificate,
  handleGetAllApplications,
} from "../../../../lib/features/certificateSlice";
import axios from "axios";
import { base_url } from "../../../../constants";
import { configs } from "../../../../configs";
import { toast } from "react-toastify";

function AddCertificateModal({ onClose, onSave }) {
  const [title, setTitle] = useState("");
  const [issueDate, setIssueDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [pdfUrl, setPdfUrl] = useState(null);
  const dispatch = useDispatch();
  const { applications_loading, applications_list } = useSelector(
    (state) => state?.certificate
  );
  const [pdfLoading, setPdfLoading] = useState(false);

  const handlePdfChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file); // Create a URL for the PDF
    setPdfUrl(file);
  };

  const handleSubmit = (e) => {
    const token = localStorage.getItem(configs.tokenKey)
      ? localStorage.getItem(configs.tokenKey)
      : "";
    console.log(token);
    e.preventDefault();
    if (!title || !pdfUrl) return;

    if (pdfUrl) {
      setPdfLoading(true);
      const formData = new FormData();
      formData.append("pdf", pdfUrl);
      axios
        .post(base_url + "admin/certificates/upload_pdf", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          console.log(res);
          if (res?.data?.status == "success") {
            const data_send = {
              student_id: 6,
              application_id: 4,
              round_id: 2,
              name: title,
              certification_name: title, // اسم الشهادة
              pdf_path: res?.data?.message?.pdf_path, // The uploaded P
            };
            dispatch(handleAddCertificate({ body: data_send }))
              .unwrap()
              .then((certificateRes) => {
                console.log(certificateRes);
                if (certificateRes.data?.status == "success") {
                  toast.success("تم اضافة الشهاده بنجاح");
                  onClose();
                  setTitle("");
                  setPdfUrl(null);
                } else {
                  toast.error("هناك خطأ أثناء اضافة الشهاده");
                }
              })
              .catch((e) => console.log(e))
              .finally(() => {
                onClose();
                setPdfLoading(false);
              });
          }
        });
    }
  };

  useEffect(() => {
    const data_send = {
      student_id: 6,
    };
    dispatch(handleGetAllApplications({ body: data_send }));
  }, [dispatch]);

  useEffect(() => {
    console.log(applications_list);
  }, [applications_list]);

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800">إضافة شهادة جديدة</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              اسم / عنوان الشهادة *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              placeholder="مثال: شهادة إتمام دورة كذا"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              شهادة PDF *
            </label>
            <input
              type="file"
              accept="application/pdf"
              onChange={handlePdfChange}
              required
              className="w-full rounded-xl border border-gray-300 px-4 py-2"
            />
            {pdfUrl && (
              <div className="mt-2 text-gray-700">
                <p>تم اختيار ملف PDF</p>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:shadow-lg"
            >
              <Save size={16} />
              {applications_loading || pdfLoading
                ? "جاري تحميل...."
                : "حفظ الشهادة "}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddCertificateModal;
