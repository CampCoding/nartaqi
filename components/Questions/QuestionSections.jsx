// "use client";

// import React, { useState } from "react";
// import { BookOpen } from "lucide-react";
// import Card from "./ExamCard";
// import "react-quill-new/dist/quill.snow.css";
// import { useDispatch, useSelector } from "react-redux";
// import dynamic from "next/dynamic";
// import { handleCreateExamSection } from "../../lib/features/examSlice";
// import { toast } from "react-toastify";
// import { useParams } from "next/navigation";

// // SSR-safe import
// const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

// // Quill toolbar config
// const quillModules = {
//   toolbar: [
//     [{ header: [1, 2, 3, false] }],
//     ["bold", "italic", "underline", "strike"],
//     [{ script: "sub" }, { script: "super" }],
//     [{ list: "ordered" }, { list: "bullet" }],
//     [{ align: ["", "center", "right", "justify"] }],
//     [{ color: [] }, { background: [] }],
//     ["link", "clean"],
//   ],
// };
// const quillFormats = [
//   "header",
//   "bold",
//   "italic",
//   "underline",
//   "strike",
//   "script",
//   "list",
//   "bullet",
//   "align",
//   "direction",
//   "color",
//   "background",
//   "link",
// ];

// export default function QuestionSections({
//   examData,
//   filteredSection,
//   onAddSection,
// }) {
//   const [nameHtml, setNameHtml] = useState(""); // Section Name
//   const [descHtml, setDescHtml] = useState(""); // Section Description

//   const dispatch = useDispatch();
//   const { add_exam_section_loading } = useSelector((state) => state?.exam);
//   const params = useParams();

//   // Reset quill editor values
//   const resetEditors = () => {
//     setNameHtml("");
//     setDescHtml("");
//   };

//   // Add custom section to the exam
//   const addCustomSection = () => {
//     const trimmedName = nameHtml.replace(/<p>|<\/p>/g, "").trim(); // Remove <p> tags and check for empty name
//     if (!trimmedName) return;
    
//     if(params['exam-id']) {
//        const newSection = {
//         id:"",
//       exam_id: 1, // Create unique id for the section
//       title: nameHtml, // Section name
//       description: descHtml, // Section description
//       // questions: [], // Initialize with no questions
//       time_if_free:"01:30:0",
//     };
//     onAddSection(newSection)
//     }
//     else {
//     const newSection = {
//       exam_id: 1, // Create unique id for the section
//       title: nameHtml, // Section name
//       description: descHtml, // Section description
//       // questions: [], // Initialize with no questions
//       time_if_free:"01:30:0",
//     };
//     onAddSection(newSection)
//   }
    
//     // onAddSection(newSection); // Callback function to add the section
//     // resetEditors(); // Reset the inputs
//   };

//   if (!examData?.type) return null;

//   return (
//     <Card title="إدارة الأقسام" icon={BookOpen}>
//       <div className="space-y-6" dir="rtl">
//         <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
//           <div className="flex items-center justify-between">
//             <p className="font-semibold text-gray-900">إنشاء قسم مخصص</p>
//             {examData?.type === "mock" && (
//               <span className="text-xs text-gray-500">
//                 للمحاكاة: أضِف أسئلة لاحقًا للوصول إلى 24 سؤالًا كحد أدنى
//               </span>
//             )}
//           </div>

//           <div className="mt-3 space-y-4">
//             {/* Section Name */}
//             <div className="space-y-2">
//               <label className="block text-xs font-semibold text-gray-600">
//                 اسم القسم
//               </label>
//               <div className="bg-white rounded-xl border border-gray-200">
//                 <ReactQuill
//                   theme="snow"
//                   value={nameHtml}
//                   onChange={setNameHtml}
//                   modules={quillModules}
//                   formats={quillFormats}
//                   placeholder="اكتب اسم القسم..."
//                 />
//               </div>
//             </div>

//             {/* Section Description */}
//             <div className="space-y-2">
//               <label className="block text-xs font-semibold text-gray-600">
//                 وصف القسم
//               </label>
//               <div className="bg-white rounded-xl border border-gray-200">
//                 <ReactQuill
//                   theme="snow"
//                   value={descHtml}
//                   onChange={setDescHtml}
//                   modules={quillModules}
//                   formats={quillFormats}
//                   placeholder="اكتب وصفًا مختصرًا للقسم..."
//                 />
//               </div>
//             </div>

//             {/* Action Buttons */}
//             <div className="flex gap-3 justify-end">
//               <button
//                 onClick={() => {
//                   setNameHtml("");
//                   setDescHtml("");
//                 }}
//                 className="px-3 py-2 rounded-lg border text-sm text-gray-700 hover:bg-gray-50"
//                 type="button"
//               >
//                 مسح
//               </button>
//               <button
//                 onClick={addCustomSection}
//                 className="px-3 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700 disabled:opacity-50"
//                 type="button"
//                 disabled={!nameHtml.replace(/<p>|<\/p>/g, "").trim()}
//                 title={
//                   !nameHtml.replace(/<p>|<\/p>/g, "").trim()
//                     ? "اسم القسم مطلوب"
//                     : undefined
//                 }
//               >
//                {add_exam_section_loading ?"جاري الإضافة..." : " إضافة قسم جديد"}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </Card>
//   );
// }


"use client";

import React, { useState, useEffect } from "react";
import { BookOpen, Edit, Trash2 } from "lucide-react";
import Card from "./ExamCard";
import "react-quill-new/dist/quill.snow.css";
import { useDispatch, useSelector } from "react-redux";
import dynamic from "next/dynamic";
import { handleCreateExamSection, handleUpdateExamSection, handleDeleteExamSection, handleGetAllExams } from "../../lib/features/examSlice";
import { toast } from "react-toastify";
import { useParams } from "next/navigation";

// SSR-safe import
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

// Quill toolbar config (same as before)
const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ script: "sub" }, { script: "super" }],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ align: ["", "center", "right", "justify"] }],
    [{ color: [] }, { background: [] }],
    ["link", "clean"],
  ],
};

const quillFormats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "script",
  "list",
  "bullet",
  "align",
  "direction",
  "color",
  "background",
  "link",
];

export default function QuestionSections({
  examData,
  filteredSection,
  onAddSection,
  onUpdateSection,
  onDeleteSection,
  sections = [],
  data,
  filteredData
}) {
  const [nameHtml, setNameHtml] = useState("");
  const [descHtml, setDescHtml] = useState("");
  const [editingSection, setEditingSection] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const dispatch = useDispatch();
  const { add_exam_section_loading, update_exam_section_loading, delete_exam_section_loading , all_exam_list } = useSelector((state) => state?.exam);
  const params = useParams();
  const [filteredData , setFilteredData] = useState({})

  useEffect(() => {
    dispatch(handleGetAllExams())
  } , [])

  useEffect(() => {
    console.log(filteredData)
  } ,[filteredData])

  useEffect(() => {
    if(params['exam-id']) {
      const filteredItem = all_exam_list?.data?.message?.find(
      (item) => item?.id == params["exam-id"]
    );
    setFilteredData(filteredItem)
    console.log(filteredItem)
    setNameHtml(filteredItem?.title)
    setDescHtml(filteredItem?.description)
    }
  } ,[params]) 
   
  // Reset form
  const resetEditors = () => {
    setNameHtml("");
    setDescHtml("");
    setEditingSection(null);
    setIsEditing(false);
  };

  // Set up editing mode
  const startEditing = (section) => {
    setEditingSection(section);
    setNameHtml(section.title || "");
    setDescHtml(section.description || "");
    setIsEditing(true);
  };

  // Cancel editing
  const cancelEditing = () => {
    resetEditors();
  };

  // Add or Update section
  const handleSaveSection = () => {
    const trimmedName = nameHtml?.replace(/<p>|<\/p>/g, "")?.trim();
    if (!trimmedName) {
      toast.warn("اسم القسم مطلوب");
      return;
    }
      if (params['exam-id']) {
        const newSection = {
          id: filteredData?.id,
          exam_id: params['exam-id'],
          title: nameHtml,
          description: descHtml,
          time_if_free: "01:30:00",
        };
          onAddSection(newSection);
        // dispatch(handleCreateExamSection({ body: newSection }))
        //   .unwrap()
        //   .then((res) => {
        //     if (res?.data?.status === "success") {
        //       toast.success("تم إضافة القسم بنجاح");
        //       onAddSection(res?.data?.message);
        //       resetEditors();
        //     } else {
        //       toast.error("فشل في إضافة القسم");
        //     }
        //   })
        //   .catch((error) => {
        //     console.error("Error creating section:", error);
        //     toast.error("حدث خطأ أثناء إضافة القسم");
        //   });
      } else {
        const newSection = {
          exam_id: data?.id,
          title: nameHtml,
          description: descHtml,
          time_if_free: "01:30:00",
        };
        onAddSection(newSection);
        resetEditors();
      }
  };

  // Delete section
  const handleDeleteSection = (section) => {
    if (!confirm("هل أنت متأكد من حذف هذا القسم؟")) return;

    if (params['exam-id'] && section.id) {
      dispatch(handleDeleteExamSection({ id: section.id }))
        .unwrap()
        .then((res) => {
          if (res?.data?.status === "success") {
            toast.success("تم حذف القسم بنجاح");
            onDeleteSection(section.id);
          } else {
            toast.error("فشل في حذف القسم");
          }
        })
        .catch((error) => {
          console.error("Error deleting section:", error);
          toast.error("حدث خطأ أثناء حذف القسم");
        });
    } else {
      onDeleteSection(section.id);
    }
  };

  if (!examData?.type) return null;

  return (
    <Card title="إدارة الأقسام" icon={BookOpen}>
      <div className="space-y-6" dir="rtl">
        {/* Section Creation/Editing Form */}
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-gray-900">
              {isEditing ? "تعديل القسم" : "إنشاء قسم مخصص"}
            </p>
            {isEditing && (
              <span className="text-xs text-blue-600 font-medium">
                وضع التعديل
              </span>
            )}
            {examData?.type === "mock" && (
              <span className="text-xs text-gray-500">
                للمحاكاة: أضِف أسئلة لاحقًا للوصول إلى 24 سؤالًا كحد أدنى
              </span>
            )}
          </div>

          <div className="mt-3 space-y-4">
            {/* Section Name */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-gray-600">
                اسم القسم
              </label>
              <div className="bg-white rounded-xl border border-gray-200">
                <ReactQuill
                  theme="snow"
                  value={nameHtml}
                  onChange={setNameHtml}
                  modules={quillModules}
                  formats={quillFormats}
                  placeholder="اكتب اسم القسم..."
                />
              </div>
            </div>

            {/* Section Description */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-gray-600">
                وصف القسم
              </label>
              <div className="bg-white rounded-xl border border-gray-200">
                <ReactQuill
                  theme="snow"
                  value={descHtml}
                  onChange={setDescHtml}
                  modules={quillModules}
                  formats={quillFormats}
                  placeholder="اكتب وصفًا مختصرًا للقسم..."
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-end">
              {isEditing && (
                <button
                  onClick={cancelEditing}
                  className="px-3 py-2 rounded-lg border text-sm text-gray-700 hover:bg-gray-50"
                  type="button"
                >
                  إلغاء التعديل
                </button>
              )}
              <button
                onClick={() => resetEditors()}
                className="px-3 py-2 rounded-lg border text-sm text-gray-700 hover:bg-gray-50"
                type="button"
              >
                مسح
              </button>
              <button
                onClick={handleSaveSection}
                className="px-3 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700 disabled:opacity-50"
                type="button"
                disabled={!nameHtml?.replace(/<p>|<\/p>/g, "")?.trim() || add_exam_section_loading || update_exam_section_loading}
                title={
                  !nameHtml?.replace(/<p>|<\/p>/g, "")?.trim()
                    ? "اسم القسم مطلوب"
                    : undefined
                }
              >
                {add_exam_section_loading || update_exam_section_loading
                  ? "جاري الحفظ..."
                  : isEditing
                  ? "تحديث القسم"
                  : "إضافة قسم جديد"}
              </button>
            </div>
          </div>
        </div>

        {/* Existing Sections List */}
        {sections.length > 0 && (
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">الأقسام المضافة</h3>
            <div className="space-y-3">
              {sections.map((section) => (
                <div
                  key={section.id}
                  className="flex items-center justify-between p-3 border border-gray-100 rounded-lg bg-gray-50 hover:bg-gray-100"
                >
                  <div className="flex-1">
                    <h4
                      className="font-medium text-gray-800"
                      dangerouslySetInnerHTML={{ __html: section.title }}
                    />
                    {section.description && (
                      <p
                        className="text-sm text-gray-600 mt-1"
                        dangerouslySetInnerHTML={{ __html: section.description }}
                      />
                    )}
                    <div className="text-xs text-gray-500 mt-1">
                      عدد الأسئلة: {section.questions?.length || 0}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEditing(section)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="تعديل القسم"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteSection(section)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      disabled={delete_exam_section_loading}
                      title="حذف القسم"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}