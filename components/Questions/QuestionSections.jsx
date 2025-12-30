// "use client";

// import React, { useState, useEffect } from "react";
// import { BookOpen, Edit, Trash2 } from "lucide-react";
// import Card from "./ExamCard";
// import "react-quill-new/dist/quill.snow.css";
// import { useDispatch, useSelector } from "react-redux";
// import dynamic from "next/dynamic";
// import {
//   handleCreateExamSection,
//   handleUpdateExamSection,
//   handleDeleteExamSection,
//   handleGetAllExams,
//   handleGetAllExamSections,
//   handleEditExamSection,
// } from "../../lib/features/examSlice";
// import { toast } from "react-toastify";
// import { useParams } from "next/navigation";
// import { Modal, Input } from "antd";

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
//   onUpdateSection,
//   onDeleteSection,
//   sections = [],
//   data,
//   examId,
//   examInfoData,
//   lessonId,
// }) {
//   const [nameHtml, setNameHtml] = useState("");
//   const [descHtml, setDescHtml] = useState("");
//   const [editingSection, setEditingSection] = useState(null);
//   const [isEditing, setIsEditing] = useState(false);
//   const [localSections, setLocalSections] = useState([]);
//   const [time, setTime] = useState(""); // Add time state

//   // delete modal state
//   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//   const [sectionToDelete, setSectionToDelete] = useState(null);

//   const dispatch = useDispatch();
//   const {
//     add_exam_section_loading,
//     update_exam_section_loading,
//     delete_exam_section_loading,
//     all_exam_list,
//     get_exam_sections_loading,
//     get_exam_sections_list,
//   } = useSelector((state) => state?.exam);

//   const params = useParams();

//   // Load sections when component mounts or when params change
//   useEffect(() => {
//     console.log("data", data  , examData , examInfoData);
//   }, [data , examData , examInfoData]);

//   useEffect(() => {
//     if (params["exam-id"] || data) {
//       dispatch(
//         handleGetAllExamSections({ body: { exam_id: (params["exam-id"] || data?.sections?.exam_id || examId) } })
//       );
//     }
//   }, [params, dispatch, data, examData, examId]);

//   // Update local sections when API data changes
//   useEffect(() => {
//     if (get_exam_sections_list?.data?.message) {
//       setLocalSections(get_exam_sections_list.data.message);
//     } else if (sections.length > 0) {
//       setLocalSections(sections);
//     }
//   }, [get_exam_sections_list, sections]);

//   // Reset form
//   const resetEditors = () => {
//     setNameHtml("");
//     setTime(""); // Reset time
//     setDescHtml("");
//     setEditingSection(null);
//     setIsEditing(false);
//   };

//   // Set up editing mode
//   const startEditing = (section) => {
//     setEditingSection(section);
//     setNameHtml(section.title || "");
//     setDescHtml(section.description || "");
//     // Set time for editing if it exists
//     setTime(section.time_if_free || "");
//     setIsEditing(true);
//   };

//   // Cancel editing
//   const cancelEditing = () => {
//     resetEditors();
//   };

//   useEffect(() => {
//     console.log(isEditing, editingSection);
//   }, [isEditing, editingSection]);

//   // Add or Update section
//   const handleSaveSection = () => {
//     const trimmedName = nameHtml?.replace(/<p>|<\/p>/g, "")?.trim();
//     if (!trimmedName) {
//       toast.warn("اسم القسم مطلوب");
//       return;
//     }

//     // Validate time if type is intern
//     // if (examInfoData?.type == "intern" && !time) {
//     //   toast.warn("الوقت مطلوب للاختبارات الداخلية"); 
//     //   return;
//     // }

//     // If we're editing an existing section
//     if (isEditing && editingSection) {
//       const updatedSection = {
//         ...editingSection,
//         title: nameHtml,
//         description: descHtml || null,
//         type: (examInfoData?.type == "intern" || lessonId) ? "intern" :"mock",
//         // Only include time_if_free for intern type
//         time_if_free: null,
//       };

//       if (params["exam-id"] || examId) {
//         // Update via API for existing exam
//         dispatch(handleEditExamSection({ body: updatedSection }))
//           .unwrap()
//           .then((res) => {
//             if (res?.data?.status === "success") {
//               toast.success("تم تحديث القسم بنجاح");
//               resetEditors();
//               // Refresh sections list
//               dispatch(
//                 handleGetAllExamSections({
//                   body: { exam_id: params["exam-id"] || examId },
//                 })
//               );
//             } else {
//               toast.error(res?.error?.response?.data?.message || "فشل في تحديث القسم");
//             }
//           })
//           .catch((error) => {
//             console.error("Error updating section:", error);
//             toast.error("حدث خطأ أثناء تحديث القسم");
//           });
//       } else {
//         // Update locally for new exam
//         if (onUpdateSection) {
//           onUpdateSection(updatedSection);
//         }
//         resetEditors();
//       }
//     }
//     // If we're creating a new section
//     else {
//       if (params["exam-id"] || examId) {
//         // Create via API for existing exam
//         const newSection = {
//           exam_id: params["exam-id"] || examId,
//           title: nameHtml,
//           description: descHtml || null,
//           // type: "mock",
//           type: (examInfoData?.type == "intern" || lessonId) ? "intern" :"mock",
//           // Only include time_if_free for intern type
//         time_if_free:  null,
//         };

//         dispatch(handleCreateExamSection({ body: newSection }))
//           .unwrap()
//           .then((res) => {
//             if (res?.data?.status === "success") {
//               toast.success("تم إضافة القسم بنجاح");
//               resetEditors();
//               dispatch(
//                 handleGetAllExamSections({
//                   body: { exam_id: params["exam-id"] || examId },
//                 })
//               );
//             } else {
//               toast.error(res?.error?.response?.data?.message || "فشل في إضافة القسم");
//             }
//           })
//           .catch((error) => {
//             console.error("Error creating section:", error);
//             toast.error("حدث خطأ أثناء إضافة القسم");
//           });
//       } else {
//         // Create locally for new exam
//         const newSection = {
//           id: Date.now(), // Temporary ID for local state
//           exam_id: data?.id,
//           title: nameHtml,
//           description: descHtml || null,
//           // Only include time_if_free for intern type
//         time_if_free:  null,
//           questions: [],
//         };

//         if (onAddSection) {
//           onAddSection(newSection);
//         }
//         resetEditors();
//       }
//     }
//   };

//   // Open delete modal
//   const openDeleteModal = (section) => {
//     setSectionToDelete(section);
//     setIsDeleteModalOpen(true);
//   };

//   // Close delete modal
//   const closeDeleteModal = () => {
//     setSectionToDelete(null);
//     setIsDeleteModalOpen(false);
//   };

//   // Confirm delete from modal
//   const confirmDeleteSection = () => {
//     console.log(sectionToDelete);
//     if (!sectionToDelete) return;

//     const sectionId = sectionToDelete?.id;
//     const examId =
//       sectionToDelete?.exam_id ||
//       params["exam-id"] || params?.examId || data?.sections?.exam_id || data?.id;

//     if (examId && sectionId) {
//       dispatch(handleDeleteExamSection({ body: { id: sectionId } }))
//         .unwrap()
//         .then((res) => {
//           if (res?.data?.status === "success") {
//             toast.success("تم حذف القسم بنجاح");
//             dispatch(handleGetAllExamSections({ body: { exam_id: examId } })); // ✅ refresh
//           } else {
//             toast.error("فشل في حذف القسم");
//           }
//         })
//         .catch((error) => {
//           console.error("Error deleting section:", error);
//           toast.error("حدث خطأ أثناء حذف القسم");
//         })
//         .finally(() => {
//           closeDeleteModal();
//         });
//     } else {
//       // local-only delete
//       closeDeleteModal();
//     }
//   };

//   // Get the appropriate button text
//   const getButtonText = () => {
//     if (add_exam_section_loading || update_exam_section_loading) {
//       return "جاري الحفظ...";
//     }
//     if (isEditing) {
//       return "تحديث القسم";
//     }
//     return "إضافة قسم جديد";
//   };

//   // Check if exam type is intern
//   // const isInternType =  examInfoData?.type == "intern"  ;

//   useEffect(() => {
//     console.log(data, examData)
//   } , [data, examData])

//   if (!examInfoData?.type && !data?.type) return null;

//   return (
//     <Card title="إدارة الأقسام" icon={BookOpen}>
//       <div className="space-y-6" dir="rtl">
//         {/* Section Creation/Editing Form */}
//         <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
//           <div className="flex items-center justify-between">
//             <p className="font-semibold text-gray-900">
//               {isEditing ? "تعديل القسم" : "إنشاء قسم مخصص"}
//             </p>
//             {isEditing && (
//               <span className="text-xs text-blue-600 font-medium">
//                 وضع التعديل -{" "}
//                 {editingSection?.title
//                   ? editingSection.title.replace(/<[^>]*>/g, "").substring(0, 20) +
//                   "..."
//                   : ""}
//               </span>
//             )}
//             {examInfoData?.type === "mock" && (
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

//               {/* Time Input - Only show for intern type */}
//               {/* {(isInternType || lessonId)&& (
//                 <div className="space-y-2">
//                   <label className="block text-xs font-semibold text-gray-600">
//                     وقت القسم 
//                   </label>
//                   <Input
//                     type="number"
//                     min="1"
//                     value={time}
//                     onChange={(e) => setTime(e.target.value)}
//                     placeholder="أدخل الوقت "
//                     className="w-full"
//                     disabled={add_exam_section_loading || update_exam_section_loading}
//                   />
//                   <p className="text-xs text-gray-500">
//                     الوقت المخصص لهذا القسم  
//                   </p>
//                 </div>
//               )} */}
//             </div>

//             {/* Action Buttons */}
//             <div className="flex gap-3 justify-end">
//               {isEditing && (
//                 <button
//                   onClick={cancelEditing}
//                   className="px-3 py-2 rounded-lg border text-sm text-gray-700 hover:bg-gray-50 transition-colors"
//                   type="button"
//                   disabled={
//                     add_exam_section_loading || update_exam_section_loading
//                   }
//                 >
//                   إلغاء التعديل
//                 </button>
//               )}
//               <button
//                 onClick={resetEditors}
//                 className="px-3 py-2 rounded-lg border text-sm text-gray-700 hover:bg-gray-50 transition-colors"
//                 type="button"
//                 disabled={
//                   add_exam_section_loading || update_exam_section_loading
//                 }
//               >
//                 مسح
//               </button>
//               <button
//                 onClick={handleSaveSection}
//                 className="px-3 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//                 type="button"
//                 disabled={
//                   !nameHtml?.replace(/<p>|<\/p>/g, "")?.trim() ||
//                    // Disable if intern type and no time
//                   add_exam_section_loading ||
//                   update_exam_section_loading
//                 }
//                 title={
//                   !nameHtml?.replace(/<p>|<\/p>/g, "")?.trim()
//                     ? "اسم القسم مطلوب"
                    
//                       : undefined
//                 }
//               >
//                 {getButtonText()}
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Existing Sections List */}
//         {localSections && localSections.length > 0 && (
//           <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
//             <h3 className="font-semibold text-gray-900 mb-4">
//               الأقسام المضافة
//             </h3>
//             <div className="space-y-3">
//               {get_exam_sections_loading ? (
//                 <div className="text-center py-4">
//                   <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
//                   <p className="text-sm text-gray-500 mt-2">
//                     جاري تحميل الأقسام...
//                   </p>
//                 </div>
//               ) : (
//                 localSections.map((section) => (
//                   <div
//                     key={section.id}

//  className="flex items-start justify-between p-3 border border-gray-100 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors min-w-0"                    >
//                     <div className="flex-1 min-w-0">
//                       <h4
//                         className="font-medium break-words text-wrap text-gray-800"
//                         dangerouslySetInnerHTML={{ __html: section.title }}
//                       />
//                       {section.description && (
//                         <p
//                           className="text-sm text-wrap break-words text-gray-600 mt-1"
//                           dangerouslySetInnerHTML={{
//                             __html: section.description,
//                           }}
//                         />
//                       )}
//                       {/* Show time for intern type sections */}
//                       {/* {(isInternType || lessonId) && section.time_if_free && (
                       
//                        <div className="text-xs text-blue-600 mt-1">
//                           ⏱️ الوقت: {section.time_if_free} 
//                         </div>
//                       )} */}
//                       <div className="text-xs text-gray-500 mt-1">
//                         عدد الأسئلة: {section.mcq?.length || 0}
//                       </div>
//                     </div>
//                     <div className="flex gap-2">
//                       <button
//                         onClick={() => startEditing(section)}
//                         className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
//                         title="تعديل القسم"
//                         disabled={
//                           add_exam_section_loading ||
//                           update_exam_section_loading
//                         }
//                       >
//                         <Edit className="w-4 h-4" />
//                       </button>
//                       <button
//                         onClick={() => openDeleteModal(section)}
//                         className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
//                         disabled={delete_exam_section_loading}
//                         title="حذف القسم"
//                       >
//                         {<Trash2 className="w-4 h-4" />}
//                       </button>
//                     </div>
//                   </div>
//                 ))
//               )}
//             </div>
//           </div>
//         )}

//         {/* Empty state */}
//         {(!localSections || localSections.length === 0) &&
//           !get_exam_sections_loading && (
//             <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center">
//               <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
//               <h3 className="font-medium text-gray-700 mb-2">
//                 لا توجد أقسام مضافة
//               </h3>
//               <p className="text-sm text-gray-500">
//                 ابدأ بإضافة قسم جديد لتنظيم أسئلة الاختبار
//               </p>
//             </div>
//           )}

//         {/* Delete confirmation modal */}
//         <Modal open={isDeleteModalOpen} footer={null} onCancel={() => setIsDeleteModalOpen(false)}>
//           <div className="rounded-2xl w-full mx-4 p-6">
//             <h3 className="text-lg font-semibold text-gray-900 mb-2">
//               تأكيد حذف القسم
//             </h3>
//             <p className="text-sm text-gray-600 mb-4">
//               هل أنت متأكد أنك تريد حذف هذا القسم؟ سيتم حذف القسم وكل
//               الأسئلة المرتبطة به.
//             </p>
//             <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 mb-4">
//               <div
//                 className="text-sm font-medium text-gray-800"
//                 dangerouslySetInnerHTML={{ __html: sectionToDelete?.title }}
//               />
//               {sectionToDelete?.description && (
//                 <div
//                   className="text-xs text-gray-600 mt-1"
//                   dangerouslySetInnerHTML={{
//                     __html: sectionToDelete?.description,
//                   }}
//                 />
//               )}
//               {/* Show time in delete modal if exists */}
//               {/* {isInternType && sectionToDelete?.time_if_free && (
//                 <div className="text-xs text-blue-600 mt-1">
//                   ⏱️ الوقت: {sectionToDelete.time_if_free} دقيقة
//                 </div>
//               )} */}
//             </div>
//             <div className="flex justify-end gap-3">
//               <button
//                 type="button"
//                 onClick={closeDeleteModal}
//                 className="px-3 py-2 rounded-lg border text-sm text-gray-700 hover:bg-gray-50 transition-colors"
//                 disabled={delete_exam_section_loading}
//               >
//                 إلغاء
//               </button>
//               <button
//                 type="button"
//                 onClick={confirmDeleteSection}
//                 className="px-3 py-2 rounded-lg bg-red-600 text-white text-sm hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors inline-flex items-center gap-1"
//                 disabled={delete_exam_section_loading}
//               >
//                 <Trash2 className="w-4 h-4" />
//                 حذف نهائي
//               </button>
//             </div>
//           </div>
//         </Modal>
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
import {
  handleCreateExamSection,
  handleUpdateExamSection,
  handleDeleteExamSection,
  handleGetAllExams,
  handleGetAllExamSections,
  handleEditExamSection,
} from "../../lib/features/examSlice";
import { toast } from "react-toastify";
import { useParams } from "next/navigation";
import { Modal, Input } from "antd";

// SSR-safe import
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

// Quill toolbar config
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

// Helper function to sanitize HTML for display
const sanitizeHTMLForDisplay = (html) => {
  if (!html) return "";
  
  // Remove problematic inline styles that cause overflow
  let sanitized = html
    .replace(/style="[^"]*"/g, '')
    .replace(/width:\s*\d+px/g, '')
    .replace(/width:\s*\d+%/g, '')
    .replace(/min-width:\s*\d+px/g, '')
    .replace(/max-width:\s*\d+px/g, '')
    .replace(/<img/g, '<img class="max-w-full h-auto"')
    .replace(/<table/g, '<table class="max-w-full overflow-auto block"');
  
  return sanitized;
};

export default function QuestionSections({
  examData,
  filteredSection,
  onAddSection,
  onUpdateSection,
  onDeleteSection,
  sections = [],
  data,
  examId,
  examInfoData,
  lessonId,
}) {
  const [nameHtml, setNameHtml] = useState("");
  const [descHtml, setDescHtml] = useState("");
  const [editingSection, setEditingSection] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [localSections, setLocalSections] = useState([]);
  const [time, setTime] = useState(""); // Add time state

  // delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [sectionToDelete, setSectionToDelete] = useState(null);

  const dispatch = useDispatch();
  const {
    add_exam_section_loading,
    update_exam_section_loading,
    delete_exam_section_loading,
    all_exam_list,
    get_exam_sections_loading,
    get_exam_sections_list,
  } = useSelector((state) => state?.exam);

  const params = useParams();

  // Load sections when component mounts or when params change
  useEffect(() => {
    console.log("data", data, examData, examInfoData);
  }, [data, examData, examInfoData]);

  useEffect(() => {
    if (params["exam-id"] || data) {
      dispatch(
        handleGetAllExamSections({ body: { exam_id: (params["exam-id"] || data?.sections?.exam_id || examId) } })
      );
    }
  }, [params, dispatch, data, examData, examId]);

  // Update local sections when API data changes
  useEffect(() => {
    if (get_exam_sections_list?.data?.message) {
      setLocalSections(get_exam_sections_list.data.message);
    } else if (sections.length > 0) {
      setLocalSections(sections);
    }
  }, [get_exam_sections_list, sections]);

  // Reset form
  const resetEditors = () => {
    setNameHtml("");
    setTime(""); // Reset time
    setDescHtml("");
    setEditingSection(null);
    setIsEditing(false);
  };

  // Set up editing mode
  const startEditing = (section) => {
    setEditingSection(section);
    setNameHtml(section.title || "");
    setDescHtml(section.description || "");
    // Set time for editing if it exists
    setTime(section.time_if_free || "");
    setIsEditing(true);
  };

  // Cancel editing
  const cancelEditing = () => {
    resetEditors();
  };

  useEffect(() => {
    console.log(isEditing, editingSection);
  }, [isEditing, editingSection]);

  // Add or Update section
  const handleSaveSection = () => {
    const trimmedName = nameHtml?.replace(/<p>|<\/p>/g, "")?.trim();
    if (!trimmedName) {
      toast.warn("اسم القسم مطلوب");
      return;
    }

    // Validate time if type is intern
    // if (examInfoData?.type == "intern" && !time) {
    //   toast.warn("الوقت مطلوب للاختبارات الداخلية"); 
    //   return;
    // }

    // If we're editing an existing section
    if (isEditing && editingSection) {
      const updatedSection = {
        ...editingSection,
        title: nameHtml,
        description: descHtml || null,
        type: (examInfoData?.type == "intern" || lessonId) ? "intern" : "mock",
        // Only include time_if_free for intern type
        time_if_free: null,
      };

      if (params["exam-id"] || examId) {
        // Update via API for existing exam
        dispatch(handleEditExamSection({ body: updatedSection }))
          .unwrap()
          .then((res) => {
            if (res?.data?.status === "success") {
              toast.success("تم تحديث القسم بنجاح");
              resetEditors();
              // Refresh sections list
              dispatch(
                handleGetAllExamSections({
                  body: { exam_id: params["exam-id"] || examId },
                })
              );
            } else {
              toast.error(res?.error?.response?.data?.message || "فشل في تحديث القسم");
            }
          })
          .catch((error) => {
            console.error("Error updating section:", error);
            toast.error("حدث خطأ أثناء تحديث القسم");
          });
      } else {
        // Update locally for new exam
        if (onUpdateSection) {
          onUpdateSection(updatedSection);
        }
        resetEditors();
      }
    }
    // If we're creating a new section
    else {
      if (params["exam-id"] || examId) {
        // Create via API for existing exam
        const newSection = {
          exam_id: params["exam-id"] || examId,
          title: nameHtml,
          description: descHtml || null,
          // type: "mock",
          type: (examInfoData?.type == "intern" || lessonId) ? "intern" : "mock",
          // Only include time_if_free for intern type
          time_if_free: null,
        };

        dispatch(handleCreateExamSection({ body: newSection }))
          .unwrap()
          .then((res) => {
            if (res?.data?.status === "success") {
              toast.success("تم إضافة القسم بنجاح");
              resetEditors();
              dispatch(
                handleGetAllExamSections({
                  body: { exam_id: params["exam-id"] || examId },
                })
              );
            } else {
              toast.error(res?.error?.response?.data?.message || "فشل في إضافة القسم");
            }
          })
          .catch((error) => {
            console.error("Error creating section:", error);
            toast.error("حدث خطأ أثناء إضافة القسم");
          });
      } else {
        // Create locally for new exam
        const newSection = {
          id: Date.now(), // Temporary ID for local state
          exam_id: data?.id,
          title: nameHtml,
          description: descHtml || null,
          // Only include time_if_free for intern type
          time_if_free: null,
          questions: [],
        };

        if (onAddSection) {
          onAddSection(newSection);
        }
        resetEditors();
      }
    }
  };

  // Open delete modal
  const openDeleteModal = (section) => {
    setSectionToDelete(section);
    setIsDeleteModalOpen(true);
  };

  // Close delete modal
  const closeDeleteModal = () => {
    setSectionToDelete(null);
    setIsDeleteModalOpen(false);
  };

  // Confirm delete from modal
  const confirmDeleteSection = () => {
    console.log(sectionToDelete);
    if (!sectionToDelete) return;

    const sectionId = sectionToDelete?.id;
    const examId =
      sectionToDelete?.exam_id ||
      params["exam-id"] || params?.examId || data?.sections?.exam_id || data?.id;

    if (examId && sectionId) {
      dispatch(handleDeleteExamSection({ body: { id: sectionId } }))
        .unwrap()
        .then((res) => {
          if (res?.data?.status === "success") {
            toast.success("تم حذف القسم بنجاح");
            dispatch(handleGetAllExamSections({ body: { exam_id: examId } })); // ✅ refresh
          } else {
            toast.error("فشل في حذف القسم");
          }
        })
        .catch((error) => {
          console.error("Error deleting section:", error);
          toast.error("حدث خطأ أثناء حذف القسم");
        })
        .finally(() => {
          closeDeleteModal();
        });
    } else {
      // local-only delete
      closeDeleteModal();
    }
  };

  // Get the appropriate button text
  const getButtonText = () => {
    if (add_exam_section_loading || update_exam_section_loading) {
      return "جاري الحفظ...";
    }
    if (isEditing) {
      return "تحديث القسم";
    }
    return "إضافة قسم جديد";
  };

  // Check if exam type is intern
  // const isInternType =  examInfoData?.type == "intern"  ;

  useEffect(() => {
    console.log(data, examData)
  }, [data, examData])

  if (!examInfoData?.type && !data?.type) return null;

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
                وضع التعديل -{" "}
                {editingSection?.title
                  ? editingSection.title.replace(/<[^>]*>/g, "").substring(0, 20) +
                  "..."
                  : ""}
              </span>
            )}
            {examInfoData?.type === "mock" && (
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

              {/* Time Input - Only show for intern type */}
              {/* {(isInternType || lessonId)&& (
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-gray-600">
                    وقت القسم 
                  </label>
                  <Input
                    type="number"
                    min="1"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder="أدخل الوقت "
                    className="w-full"
                    disabled={add_exam_section_loading || update_exam_section_loading}
                  />
                  <p className="text-xs text-gray-500">
                    الوقت المخصص لهذا القسم  
                  </p>
                </div>
              )} */}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-end">
              {isEditing && (
                <button
                  onClick={cancelEditing}
                  className="px-3 py-2 rounded-lg border text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  type="button"
                  disabled={
                    add_exam_section_loading || update_exam_section_loading
                  }
                >
                  إلغاء التعديل
                </button>
              )}
              <button
                onClick={resetEditors}
                className="px-3 py-2 rounded-lg border text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                type="button"
                disabled={
                  add_exam_section_loading || update_exam_section_loading
                }
              >
                مسح
              </button>
              <button
                onClick={handleSaveSection}
                className="px-3 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                type="button"
                disabled={
                  !nameHtml?.replace(/<p>|<\/p>/g, "")?.trim() ||
                  // Disable if intern type and no time
                  add_exam_section_loading ||
                  update_exam_section_loading
                }
                title={
                  !nameHtml?.replace(/<p>|<\/p>/g, "")?.trim()
                    ? "اسم القسم مطلوب"
                    : undefined
                }
              >
                {getButtonText()}
              </button>
            </div>
          </div>
        </div>

        {/* Existing Sections List */}
        {localSections && localSections.length > 0 && (
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">
              الأقسام المضافة
            </h3>
            <div className="space-y-3">
              {get_exam_sections_loading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-sm text-gray-500 mt-2">
                    جاري تحميل الأقسام...
                  </p>
                </div>
              ) : (
                localSections.map((section) => (
                  <div
                    key={section.id}
                    className="flex items-start justify-between p-3 border border-gray-100 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors min-w-0"
                  >
                    <div className="flex-1 min-w-0 overflow-hidden">
                      {/* Title with proper overflow handling */}
                      <div className="max-w-full overflow-hidden">
                        <h4
                          className="font-medium text-gray-800 break-words"
                          dangerouslySetInnerHTML={{
                            __html: sanitizeHTMLForDisplay(section.title)
                          }}
                        />
                      </div>

                      {/* Description with proper overflow handling */}
                      {section.description && (
                        <div className="max-w-full overflow-hidden mt-1">
                          <div
                            className="text-sm text-gray-600 break-words"
                            dangerouslySetInnerHTML={{
                              __html: sanitizeHTMLForDisplay(section.description)
                            }}
                          />
                        </div>
                      )}

                      {/* Show time for intern type sections */}
                      {/* {(isInternType || lessonId) && section.time_if_free && (
                        <div className="text-xs text-blue-600 mt-1">
                          ⏱️ الوقت: {section.time_if_free} 
                        </div>
                      )} */}

                      {/* Question count */}
                      <div className="text-xs text-gray-500 mt-1">
                        عدد الأسئلة: {section.mcq?.length || 0}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-2 flex-shrink-0 ml-2">
                      <button
                        onClick={() => startEditing(section)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="تعديل القسم"
                        disabled={
                          add_exam_section_loading ||
                          update_exam_section_loading
                        }
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openDeleteModal(section)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        disabled={delete_exam_section_loading}
                        title="حذف القسم"
                      >
                        {<Trash2 className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Empty state */}
        {(!localSections || localSections.length === 0) &&
          !get_exam_sections_loading && (
            <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center">
              <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="font-medium text-gray-700 mb-2">
                لا توجد أقسام مضافة
              </h3>
              <p className="text-sm text-gray-500">
                ابدأ بإضافة قسم جديد لتنظيم أسئلة الاختبار
              </p>
            </div>
          )}

        {/* Delete confirmation modal */}
        <Modal
          open={isDeleteModalOpen}
          footer={null}
          onCancel={() => setIsDeleteModalOpen(false)}
          className="[&_.ant-modal-content]:p-0"
        >
          <div className="rounded-2xl w-full mx-4 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              تأكيد حذف القسم
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              هل أنت متأكد أنك تريد حذف هذا القسم؟ سيتم حذف القسم وكل
              الأسئلة المرتبطة به.
            </p>
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 mb-4 max-w-full overflow-hidden">
              {/* Title in delete modal */}
              <div
                className="text-sm font-medium text-gray-800 break-words"
                dangerouslySetInnerHTML={{
                  __html: sanitizeHTMLForDisplay(sectionToDelete?.title)
                }}
              />
              {/* Description in delete modal */}
              {sectionToDelete?.description && (
                <div
                  className="text-xs text-gray-600 mt-1 break-words"
                  dangerouslySetInnerHTML={{
                    __html: sanitizeHTMLForDisplay(sectionToDelete?.description)
                  }}
                />
              )}
              {/* Show time in delete modal if exists */}
              {/* {isInternType && sectionToDelete?.time_if_free && (
                <div className="text-xs text-blue-600 mt-1">
                  ⏱️ الوقت: {sectionToDelete.time_if_free} دقيقة
                </div>
              )} */}
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={closeDeleteModal}
                className="px-3 py-2 rounded-lg border text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                disabled={delete_exam_section_loading}
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={confirmDeleteSection}
                className="px-3 py-2 rounded-lg bg-red-600 text-white text-sm hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors inline-flex items-center gap-1"
                disabled={delete_exam_section_loading}
              >
                <Trash2 className="w-4 h-4" />
                حذف نهائي
              </button>
            </div>
          </div>
        </Modal>
      </div>

      {/* Add custom styles for Quill content */}
      <style jsx global>{`
        /* Ensure Quill editor content doesn't overflow */
        .ql-editor {
          max-width: 100% !important;
        }
        
        .ql-editor * {
          max-width: 100% !important;
          overflow-wrap: break-word !important;
          word-break: break-word !important;
        }
        
        /* Ensure images in Quill content are responsive */
        .ql-editor img {
          max-width: 100% !important;
          height: auto !important;
        }
        
        /* Ensure tables in Quill content are scrollable */
        .ql-editor table {
          max-width: 100% !important;
          display: block !important;
          overflow-x: auto !important;
        }
      `}</style>
    </Card>
  );
}