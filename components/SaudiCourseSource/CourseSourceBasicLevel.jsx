// "use client";
// import Button from "@/components/atoms/Button";
// import {
//   Card,
//   Collapse,
//   Empty,
//   Tag,
//   Tooltip,
//   Badge,
//   DatePicker,
//   Divider,
// } from "antd";
// import {
//   Eye,
//   EyeOff,
//   FileText,
//   Target,
//   Trash2,
//   Plus,
//   Video,
//   ExternalLink,
//   Upload,
//   BookOpen,
// } from "lucide-react";
// import dayjs from "dayjs";
// import React from "react";

// const { Panel } = Collapse;

// export default function CourseSourceBasicLevel({
//   stats,
//   deleteLesson,
//   deleteStage,
//   toggleStageVisibility,
//   toggleLessonVisibility,
//   foundationStages,
//   setOpenAddLesson,
//   setOpenAddStage,
//   addTrainingFiles,
//   removeTrainingFile,
//   /** جديد */
//   isReleased,
//   setLessonReleaseAt,
//   setStageReleaseAt,
// }) {
//   const openPicker = (stageId, lessonId) => {
//     const input = document.getElementById(`pdf-picker-${stageId}-${lessonId}`);
//     if (input) input.click();
//   };

//   const onFilesPicked = (stageId, lessonId, e) => {
//     const files = Array.from(e.target.files || []);
//     if (files.length && typeof addTrainingFiles === "function") {
//       addTrainingFiles(stageId, lessonId, files);
//     }
//     e.target.value = "";
//   };

//   return (
//     <div className="w-full" dir="rtl">
//       {/* Header */}
//       <Card className="mb-6 shadow-lg border-0 bg-gradient-to-r from-blue-50 to-indigo-50">
//         <div className="flex items-center justify-between flex-wrap gap-4">
//           <div className="flex items-center gap-4">
//             <div className="flex items-center gap-2">
//               <BookOpen className="w-6 h-6 text-blue-600" />
//               <h2 className="text-xl font-bold text-gray-800 m-0">مرحلة التأسيس</h2>
//             </div>
//             <div className="flex items-center gap-3">
//               <Badge
//                 count={stats.stageCount}
//                 showZero
//                 color="blue"
//                 className="[&_.ant-badge-count]:bg-blue-500"
//               >
//                 <span className="text-sm text-gray-600 font-medium px-3 py-1 bg-white rounded-full">
//                   الأقسام
//                 </span>
//               </Badge>
//               <Badge
//                 count={stats.lessonCount}
//                 showZero
//                 color="green"
//                 className="[&_.ant-badge-count]:bg-green-500"
//               >
//                 <span className="text-sm text-gray-600 font-medium px-3 py-1 bg-white rounded-full">
//                   المحاضرات
//                 </span>
//               </Badge>
//             </div>
//           </div>
//           <div className="flex items-center gap-3">
//             <Button
//               className="!bg-gray-700 hover:!bg-gray-800 !text-white !border-0 shadow-md flex items-center gap-2"
//               onClick={() => setOpenAddStage(true)}
//             >
//               <Plus className="w-4 h-4" /> إضافة قسم
//             </Button>
//             <Button
//               type="primary"
//               className="!bg-blue-600 hover:!bg-blue-700 !text-white !border-0 shadow-md flex items-center gap-2"
//               onClick={() => setOpenAddLesson(true)}
//             >
//               <Plus className="w-4 h-4" /> إضافة محاضرة
//             </Button>
//           </div>
//         </div>
//       </Card>

//       {/* Content */}
//       <Card className="shadow-lg !h-fit border-0" bodyStyle={{ padding: 0 }}>
//         {foundationStages.length === 0 ? (
//           <div className="p-12">
//             <Empty
//               description={
//                 <div className="text-center">
//                   <p className="text-gray-500 text-lg mb-2">لا توجد أقسام بعد</p>
//                   <p className="text-gray-400 text-sm">
//                     ابدأ بإضافة أقسام جديدة لتنظيم المحتوى
//                   </p>
//                 </div>
//               }
//               className="my-8"
//             />
//           </div>
//         ) : (
//           <Collapse accordion className="border-0 !h-full" expandIconPosition="end">
//             {foundationStages.map((st, stageIndex) => {
//               const stageOpened = isReleased?.(st.releaseAt);
//               const effectiveStageVisible = st.visible && stageOpened;

//               return (
//                 <Panel
//                   key={st.id}
//                   className="!border-0 !mb-2"
//                   style={{
//                     backgroundColor: effectiveStageVisible ? "#fafafa" : "#f5f5f5",
//                     borderRadius: "12px",
//                     marginBottom: "8px",
//                     opacity: effectiveStageVisible ? 1 : 0.9,
//                   }}
//                   header={
//                     <div className="flex items-center justify-between w-full pr-4">
//                       <div className="flex items-center gap-4">
//                         <div
//                           className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
//                             effectiveStageVisible
//                               ? "bg-blue-100 text-blue-700"
//                               : "bg-gray-100 text-gray-400"
//                           }`}
//                         >
//                           {stageIndex + 1}
//                         </div>
//                         <div className="flex items-center gap-3">
//                           <Tooltip
//                             title={
//                               effectiveStageVisible
//                                 ? "إخفاء القسم"
//                                 : stageOpened
//                                 ? "إظهار القسم"
//                                 : "سيظهر تلقائياً عند موعده"
//                             }
//                           >
//                             <Button
//                               type="text"
//                               size="small"
//                               disabled={!stageOpened}
//                               className={`!p-1 hover:!bg-gray-100 ${effectiveStageVisible ? "!text-green-600" : "!text-gray-400"}`}
//                               icon={effectiveStageVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
//                               onClick={(e) => {
//                                 e.stopPropagation();
//                                 if (stageOpened) toggleStageVisibility(st.id);
//                               }}
//                             />
//                           </Tooltip>

//                           <h3
//                             className={`font-semibold text-lg m-0 ${effectiveStageVisible ? "text-gray-800" : "text-gray-400"}`}
//                           >
//                             القسم : {st.title}
//                           </h3>

//                           {/* حالة ظهور القسم */}
//                           {st.releaseAt ? (
//                             stageOpened ? (
//                               <Tag color="green">متاح</Tag>
//                             ) : (
//                               <Tag color="red">لم يُفتح بعد</Tag>
//                             )
//                           ) : (
//                             <Tag color="green">متاح الآن</Tag>
//                           )}

//                           {st.releaseAt && (
//                             <Tooltip title="موعد الظهور">
//                               <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
//                                 {dayjs(st.releaseAt).format("YYYY/MM/DD HH:mm")}
//                               </span>
//                             </Tooltip>
//                           )}
//                         </div>
//                       </div>

//                       {/* أدوات القسم: جدولة/مسح/عداد/حذف */}
//                       <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
//                         <DatePicker
//                           showTime
//                           size="small"
//                           placeholder="موعد ظهور القسم"
//                           className="min-w-[190px]"
//                           value={
//                             st.releaseAt && dayjs(st.releaseAt).isValid()
//                               ? dayjs(st.releaseAt)
//                               : null
//                           }
//                           onChange={(v) => setStageReleaseAt?.(st.id, v || null)}
//                         />
//                         {st.releaseAt && (
//                           <Button
//                             size="small"
//                             type="text"
//                             onClick={() => setStageReleaseAt?.(st.id, null)}
//                           >
//                             مسح
//                           </Button>
//                         )}

//                         <Badge
//                           count={st.lessons?.length || 0}
//                           showZero
//                           size="small"
//                           className="[&_.ant-badge-count]:bg-indigo-500 [&_.ant-badge-count]:text-xs"
//                         >
//                           <span className="text-xs text-gray-500 font-medium">
//                             المحاضرات
//                           </span>
//                         </Badge>

//                         <Tooltip title="حذف القسم">
//                           <Button
//                             danger
//                             type="text"
//                             size="small"
//                             className="!p-1 hover:!bg-red-50"
//                             icon={<Trash2 className="w-4 h-4" />}
//                             onClick={() => deleteStage(st.id)}
//                           />
//                         </Tooltip>
//                       </div>
//                     </div>
//                   }
//                 >
//                   <div className="px-2 sm:px-4 md:px-6 pb-4">
//                     {(st.lessons || []).length === 0 ? (
//                       <div className="text-center py-8">
//                         <Empty
//                           description="لا توجد محاضرات في هذه القسم"
//                           image={Empty.PRESENTED_IMAGE_SIMPLE}
//                           className="!text-gray-400"
//                         />
//                       </div>
//                     ) : (
//                       <Collapse
//                         accordion
//                         bordered={false}
//                         expandIconPosition="end"
//                         className="bg-transparent"
//                       >
//                         {st.lessons.map((l, lessonIndex) => {
//                           const pdfs = l?.training?.pdfs || [];
//                           const released = isReleased?.(l.releaseAt);

//                           const header = (
//                             <div className="flex items-center justify-between w-full">
//                               <div className="flex items-center gap-3">
//                                 <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-sm">
//                                   {lessonIndex + 1}
//                                 </div>
//                                 <div className="flex items-center gap-2">
//                                   <span
//                                     className={`font-semibold ${l.visible ? "text-gray-800" : "text-gray-500"}`}
//                                   >
//                                     المحاضرة : {l.title}
//                                   </span>
//                                   <Badge count={pdfs.length} showZero size="small" />
//                                   {/* حالة الظهور */}
//                                   {l.releaseAt && !released && (
//                                     <Tag color="red">لم يُفتح بعد</Tag>
//                                   )}
//                                 </div>
//                               </div>

//                               {/* أدوات الجدولة للدرس */}
//                               <div
//                                 className="flex items-center gap-2"
//                                 onClick={(e) => e.stopPropagation()}
//                               >
//                                 <Tooltip title="موعد الظهور">
//                                   <DatePicker
//                                     showTime
//                                     size="small"
//                                     value={
//                                       l.releaseAt && dayjs(l.releaseAt).isValid()
//                                         ? dayjs(l.releaseAt)
//                                         : null
//                                     }
//                                     placeholder="موعد الظهور"
//                                     className="min-w-[190px]"
//                                     onChange={(v) =>
//                                       setLessonReleaseAt(st.id, l.id, v || null)
//                                     }
//                                   />
//                                 </Tooltip>
//                                 {l.releaseAt && (
//                                   <Button
//                                     size="small"
//                                     type="text"
//                                     onClick={() =>
//                                       setLessonReleaseAt(st.id, l.id, null)
//                                     }
//                                   >
//                                     مسح
//                                   </Button>
//                                 )}
//                                 <Tooltip
//                                   title={l.visible ? "إخفاء المحاضرة" : "إظهار المحاضرة"}
//                                 >
//                                   <Button
//                                     type="text"
//                                     size="small"
//                                     className={`!p-1 hover:!bg-gray-100 ${l.visible ? "!text-green-600" : "!text-gray-400"}`}
//                                     icon={l.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
//                                     onClick={() => toggleLessonVisibility(st.id, l.id)}
//                                   />
//                                 </Tooltip>
//                                 <Tooltip title="حذف المحاضرة">
//                                   <Button
//                                     danger
//                                     size="small"
//                                     className="!p-1 hover:!bg-red-50"
//                                     onClick={() => deleteLesson(st.id, l.id)}
//                                     icon={<Trash2 className="w-4 h-4" />}
//                                   />
//                                 </Tooltip>
//                               </div>
//                             </div>
//                           );

//                           return (
//                             <Panel
//                               key={l.id}
//                               header={header}
//                               className={`!rounded-xl !mb-3 ${
//                                 l.visible
//                                   ? "bg-white !border !border-blue-100 hover:!border-blue-200"
//                                   : "bg-gray-50 !border !border-gray-200 opacity-80"
//                               }`}
//                             >
//                               {/* مدخل رفع PDF المخفي */}
//                               <input
//                                 id={`pdf-picker-${st.id}-${l.id}`}
//                                 type="file"
//                                 accept="application/pdf"
//                                 multiple
//                                 className="hidden"
//                                 onChange={(e) => onFilesPicked(st.id, l.id, e)}
//                               />

//                               <div className="space-y-4">
//                                 {/* فيديو الدرس */}
//                                 <div className="bg-blue-50 rounded-lg p-4">
//                                   <div className="flex items-center gap-2 mb-3">
//                                     <Video className="w-4 h-4 text-blue-600" />
//                                     <Tag color="blue" className="!mb-0 font-medium">
//                                       فيديو الدرس
//                                     </Tag>
//                                   </div>
//                                   <div className="flex items-center gap-3 text-sm text-gray-700">
//                                     <span className="font-medium">
//                                       {l.lessonVideo?.title || "غير محدد"}
//                                     </span>
//                                     {l.lessonVideo?.source === "url" &&
//                                     l.lessonVideo?.url ? (
//                                       <a
//                                         href={l.lessonVideo.url}
//                                         target="_blank"
//                                         rel="noreferrer"
//                                         className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium"
//                                       >
//                                         مشاهدة <ExternalLink className="w-3 h-3" />
//                                       </a>
//                                     ) : l.lessonVideo ? (
//                                       <span className="text-gray-500">ملف مرفوع</span>
//                                     ) : null}
//                                   </div>
//                                 </div>

//                                 {/* Training */}
//                                 <div className="bg-amber-50 rounded-lg p-4">
//                                   <div className="flex items-center gap-2 mb-3">
//                                     <Target className="w-4 h-4 text-amber-600" />
//                                     <Tag color="gold" className="!mb-0 font-medium">
//                                       تدريب
//                                       </Tag>
//                                   </div>

//                                   <Divider className="!my-4" />

//                                   <div>
//                                     <div className="flex items-center justify-between mb-3">
//                                       <div className="flex items-center gap-2">
//                                         <FileText className="w-4 h-4 text-indigo-600" />
//                                         <Tag color="geekblue" className="!mb-0 font-medium">
//                                           ملفات PDF
//                                         </Tag>
//                                         <Badge count={pdfs.length} showZero size="small" />
//                                       </div>
//                                       <Button
//                                         type="dashed"
//                                         size="small"
//                                         className="!border-indigo-300 !text-indigo-600 hover:!border-indigo-400 hover:!text-indigo-700 flex items-center gap-1"
//                                         onClick={(e) => {
//                                           e.stopPropagation();
//                                           openPicker(st.id, l.id);
//                                         }}
//                                       >
//                                         <Upload className="w-3 h-3" /> إضافة ملفات
//                                       </Button>
//                                     </div>

//                                     {pdfs.length > 0 && (
//                                       <div className="space-y-2">
//                                         {pdfs.map((f, idx) => {
//                                           const key = f?.id ?? idx;
//                                           const label =
//                                             f?.title || f?.name || `ملف ${idx + 1}`;
//                                           const isUrl = f?.source === "url" && f?.url;

//                                           return (
//                                             <div
//                                               key={key}
//                                               className="flex items-center justify-between rounded-lg border bg-white p-3 hover:shadow-sm transition-shadow"
//                                             >
//                                               <div className="flex items-center gap-3">
//                                                 <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
//                                                   <FileText className="w-4 h-4 text-red-600" />
//                                                 </div>
//                                                 <span className="text-gray-800 font-medium">
//                                                   {label}
//                                                 </span>
//                                               </div>
//                                               <div className="flex items-center gap-2">
//                                                 {isUrl ? (
//                                                   <a
//                                                     href={f.url}
//                                                     target="_blank"
//                                                     rel="noreferrer"
//                                                     className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
//                                                     onClick={(e) => e.stopPropagation()}
//                                                   >
//                                                     عرض <ExternalLink className="w-3 h-3" />
//                                                   </a>
//                                                 ) : (
//                                                   <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
//                                                     ملف مرفوع
//                                                   </span>
//                                                 )}
//                                                 <Tooltip title="حذف الملف">
//                                                   <Button
//                                                     danger
//                                                     type="text"
//                                                     size="small"
//                                                     icon={<Trash2 className="w-4 h-4" />}
//                                                     className="!p-1 hover:!bg-red-50"
//                                                     onClick={(e) => {
//                                                       e.stopPropagation();
//                                                       removeTrainingFile?.(
//                                                         st.id,
//                                                         l.id,
//                                                         f?.id ?? idx
//                                                       );
//                                                     }}
//                                                   />
//                                                 </Tooltip>
//                                               </div>
//                                             </div>
//                                           );
//                                         })}
//                                       </div>
//                                     )}
//                                   </div>
//                                 </div>
//                               </div>
//                             </Panel>
//                           );
//                         })}
//                       </Collapse>
//                     )}
//                   </div>
//                 </Panel>
//               );
//             })}
//           </Collapse>
//         )}
//       </Card>
//     </div>
//   );
// }


"use client";
import React, { useEffect, useState } from 'react';
import { 
  PlusOutlined, EditOutlined, DeleteOutlined, 
  CalendarOutlined, CaretDownOutlined, CloseOutlined 
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { handleGetAllRoundContent } from '../../lib/features/roundContentSlice';
import { useSearchParams } from 'next/navigation';
import { Spin } from 'antd';
import AddRoundContent from '../RoundContent/AddRoundContent';
import DeleteRoundContent from '../RoundContent/DeleteRoundContent';
// Using standard Ant Design icons as FaCheck requires an external library import

// --- MOCK DATA & INITIAL STATE ---
const initialCourseContent = [
  {
    id: 1,
    title: 'مقدمة في الرياكت', 
    description: 'أساسيات المكونات، JSX، وبيئة التطوير.',
    type: 'basic', 
    isCollapsed: false, 
    lessons: [
      {
        id: 101,
        title: 'إعداد البيئة',
        description: 'تثبيت Node.js و إنشاء مشروع جديد.',
        isCollapsed: false, 
        videos: [
          { id: 1001, title: 'الفيديو 1: المتطلبات', description: 'شرح متطلبات النظام', link: 'https://video1.link', time: '05:30' },
        ],
      },
      {
        id: 102,
        title: 'مفهوم المكونات',
        description: 'المكونات الوظيفية والفئوية والفرق بينهما.',
        isCollapsed: true, 
        videos: [],
      },
    ],
  },
];

const initialSchedule = {
  startDate: '2025-12-01',
  endDate: '2025-12-31',
  startTime: '09:00',
  endTime: '11:00',
};

// Initial Data for New Items
const newContentData = { title: "عنوان المحتوي", description: "وصف المحتوي", type: "basic" };
const newLessonData = { title: "عنوان الدرس", description: "وصف الدرس" };
const newVideoData = { title: "عنوان الفيديو", description: "وصف الفيديو", link: "", time: "00:00" };


export default function CourseSourceBasicLevel({id}) {
  const [rowData , setRowData] = useState({});

  const [content, setContent] = useState(initialCourseContent);
  const [schedule, setSchedule] = useState(initialSchedule);
  const [isScheduleCollapsed, setIsScheduleCollapsed] = useState(false); 
  // --- Modal State Management ---
  const [addModalContent , setAddModalContent] = useState(false);
  const [deleteModalContent , setDeleteModalContent] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null); 
  const [editingItem, setEditingItem] = useState(null); 
  const [parentIds, setParentIds] = useState({ contentId: null, lessonId: null });
  const dispatch = useDispatch();
  const {all_content_loading , all_content_list , store_content_loading} = useSelector(state => state?.content);
  const [basicData , setBasicData] = useState([]);

  useEffect(() => {
    dispatch(handleGetAllRoundContent({body:{
       round_id : id
    }}))
  } ,[id])

  useEffect(() => {
    console.log(all_content_list?.data?.message)
    setBasicData(all_content_list?.data?.message?.filter(item => item?.type == "basic"))
  } , [all_content_list])
  // --- Modal Control Functions ---
  const openModal = (type, itemData = null, cId = null, lId = null) => {
    setModalType(type);
    // Use existing data if editing, otherwise use default new data
    setEditingItem(itemData || (type === 'content' ? newContentData : type === 'lesson' ? newLessonData : newVideoData));
    setParentIds({ contentId: cId, lessonId: lId });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setParentIds({ contentId: null, lessonId: null });
  };
  
  const handleModalChange = (e) => {
    const { name, value } = e.target;
    setEditingItem(prev => ({ ...prev, [name]: value }));
  };

  // --- CRUD Handlers ---

  const handleSaveContent = () => {
    const { contentId } = parentIds;
    const itemToSave = { ...editingItem };
    console.log(itemToSave);

    // setContent(prevContent => {
    //   if (contentId) {
    //     // Edit Content
    //     return prevContent.map(c => 
    //       c.id === contentId 
    //         ? { ...c, ...itemToSave } 
    //         : c
    //     );
    //   } else {
    //     // Add Content
    //     const newContent = { 
    //       id: Date.now(), 
    //       ...itemToSave,
    //       isCollapsed: false, 
    //       lessons: [],
    //     };
    //     return [...prevContent, newContent];
    //   }
    // });
    // closeModal();
  };
  
  const handleSaveLesson = () => {
    const { contentId, lessonId } = parentIds;
    const itemToSave = { ...editingItem };

    setContent(prevContent => prevContent.map(c => {
      if (c.id === contentId) {
        if (lessonId) {
          // Edit Lesson
          return {
            ...c,
            lessons: c.lessons.map(l =>
              l.id === lessonId ? { ...l, ...itemToSave } : l
            ),
          };
        } else {
          // Add Lesson
          const newLesson = { id: Date.now(), ...itemToSave, isCollapsed: false, videos: [] };
          return { ...c, lessons: [...c.lessons, newLesson] };
        }
      }
      return c;
    }));
    closeModal();
  };
  
  const handleSaveVideo = () => {
    const { contentId, lessonId } = parentIds;
    const itemToSave = { ...editingItem };

    setContent(prevContent => prevContent.map(c => {
      if (c.id === contentId) {
        return {
          ...c,
          lessons: c.lessons.map(l => {
            if (l.id === lessonId) {
              if (itemToSave.id) {
                // Edit Video
                return { ...l, videos: l.videos.map(v => v.id === itemToSave.id ? { ...v, ...itemToSave } : v) };
              } else {
                // Add Video
                const newVideo = { id: Date.now(), ...itemToSave };
                return { ...l, videos: [...l.videos, newVideo] };
              }
            }
            return l;
          }),
        };
      }
      return c;
    }));
    closeModal();
  };


  // --- Collapse and Deletion Handlers ---

  const toggleContentCollapse = (contentId) => {
    setContent(content.map(c => c.id === contentId ? { ...c, isCollapsed: !c.isCollapsed } : c));
  };

  const toggleLessonCollapse = (contentId, lessonId) => {
    setContent(content.map(c => {
      if (c.id === contentId) {
        return {
          ...c,
          lessons: c.lessons.map(l => l.id === lessonId ? { ...l, isCollapsed: !l.isCollapsed } : l),
        };
      }
      return c;
    }));
  };

  const handleDeleteContent = (contentId) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المحتوى بالكامل؟')) {
        setContent(content.filter(c => c.id !== contentId));
    }
  };

  const handleDeleteLesson = (contentId, lessonId) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الدرس؟')) {
        setContent(content.map(c =>
          c.id === contentId
            ? { ...c, lessons: c.lessons.filter(l => l.id !== lessonId) }
            : c
        ));
    }
  };

  const handleDeleteVideo = (contentId, lessonId, videoId) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الفيديو؟')) {
        setContent(content.map(c => {
          if (c.id === contentId) {
            return {
              ...c,
              lessons: c.lessons.map(l =>
                l.id === lessonId
                  ? { ...l, videos: l.videos.filter(v => v.id !== videoId) }
                  : l
              ),
            };
          }
          return c;
        }));
    }
  };

  // Schedule Handler
  const handleScheduleChange = (e) => {
    const { name, value } = e.target;
    setSchedule(prev => ({ ...prev, [name]: value }));
  };


  // --- UI Helper Components ---

  const ActionButton = ({ icon, onClick, className = '' }) => (
    <button
      onClick={onClick}
      className={`p-1 text-sm rounded-full transition duration-150 hover:bg-gray-200 ${className}`}
    >
      {icon}
    </button>
  );

  // Video Card Renderer
  const VideoCard = ({ video, contentId, lessonId }) => (
    <div className="bg-blue-50/70 p-3 mb-2 rounded-lg border border-blue-100 flex justify-between items-center text-sm">
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-800 truncate">{video.title} ({video.time})</p>
        <p className="text-gray-600 text-xs mt-0.5 truncate">{video.description}</p>
      </div>
      <div className="flex space-x-2 space-x-reverse ml-4 flex-shrink-0">
        <ActionButton 
          icon={<EditOutlined className="text-blue-600" />} 
          onClick={(e) => {
            e.stopPropagation();
            openModal('video', video, contentId, lessonId); 
          }}
        />
        <ActionButton 
          icon={<DeleteOutlined className="text-red-600" />} 
          onClick={() => handleDeleteVideo(contentId, lessonId, video.id)} 
        />
      </div>
    </div>
  );

  // Lesson Card Renderer
  const LessonCard = ({ lesson, contentId }) => (
    <div className="mb-4 bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      
      {/* Lesson Header (Clickable for Collapse) */}
      <div 
        className="p-4 flex justify-between items-start cursor-pointer hover:bg-gray-50 transition duration-150"
        onClick={() => toggleLessonCollapse(contentId, lesson.id)}
      >
        <div className="flex items-center flex-1 min-w-0">
          <CaretDownOutlined 
            className={`text-xl ml-3 text-blue-500 transition-transform duration-300 ${lesson.isCollapsed ? 'rotate-90' : 'rotate-180'}`} 
          />
          <div className="min-w-0">
             <h4 className="text-lg font-semibold text-gray-800 truncate">{lesson.title}</h4>
             <p className="text-sm text-gray-600 mt-1 truncate">{lesson.description}</p>
          </div>
        </div>
        
        {/* Lesson Actions */}
        <div className="flex space-x-2 space-x-reverse ml-4 flex-shrink-0" onClick={(e) => e.stopPropagation()}> 
          <ActionButton 
            icon={<PlusOutlined className="text-green-600" />} 
            onClick={() => openModal('video', null, contentId, lesson.id)} 
            className="text-sm border border-green-200"
          />
          <ActionButton 
            icon={<EditOutlined className="text-blue-600" />} 
            onClick={() => openModal('lesson', lesson, contentId, lesson.id)} 
          />
          <ActionButton 
            icon={<DeleteOutlined className="text-red-600" />} 
            onClick={() => handleDeleteLesson(contentId, lesson.id)} 
          />
        </div>
      </div>
      
      {/* Video List (Conditional Rendering) */}
      {!lesson.isCollapsed && (
        <div className="p-4 pt-0 pr-10 border-r-2 border-dashed border-gray-200">
          {lesson.videos.length > 0 ? (
            lesson.videos.map(video => (
              <VideoCard key={video.id} video={video} contentId={contentId} lessonId={lesson.id} />
            ))
          ) : (
            <p className="text-gray-400 text-sm text-center py-2">لا يوجد فيديوهات في هذا الدرس بعد.</p>
          )}
        </div>
      )}
    </div>
  );

  // Content Section Renderer
  const ContentSection = ({ contentItem }) => (
    <div className="mb-8 bg-gray-50 border border-gray-100 rounded-xl shadow-md overflow-hidden">
      
      {/* Content Header (Clickable for Collapse) */}
      <div 
        className="p-6 flex justify-between items-start border-b pb-3 cursor-pointer hover:bg-gray-100 transition duration-150"
        onClick={() => toggleContentCollapse(contentItem?.id)}
      >
        <div className="flex items-center flex-1 min-w-0">
          <CaretDownOutlined 
            className={`text-2xl ml-3 text-blue-700 transition-transform duration-300 ${contentItem?.isCollapsed ? 'rotate-90' : 'rotate-180'}`} 
          />
          <div className="min-w-0">
             <h3 className="text-xl font-bold text-gray-900 truncate">{contentItem?.title}</h3>
             <p className="text-base text-gray-700 mt-1 truncate">{contentItem?.description}</p>
          </div>
        </div>
        
        {/* Content Actions */}
        <div className="flex space-x-3 space-x-reverse ml-4 flex-shrink-0" onClick={(e) => e.stopPropagation()}> 
          <ActionButton 
            icon={<PlusOutlined className="text-green-600" />} 
            onClick={() => openModal('lesson', null, contentItem?.id)} 
            className="text-base border border-green-200 bg-white"
          >
             إضافة درس
          </ActionButton>
          <ActionButton 
            icon={<EditOutlined className="text-blue-600" />} 
            onClick={() => openModal('content', contentItem, contentItem?.id)} 
          />
          <ActionButton 
            icon={<DeleteOutlined className="text-red-600" />} 
            onClick={() => {
              setDeleteModalContent(true)
              setRowData(contentItem)
            }} 
          />
        </div>
      </div>

      {/* Lesson List (Conditional Rendering) */}
      {/* {!contentItem.isCollapsed && (
        <div className="p-6 pt-3">
          {contentItem.lessons.length > 0 ? (
            <div className="pr-2 border-r-4 border-blue-300">
              {contentItem.lessons.map(lesson => (
                <LessonCard key={lesson.id} lesson={lesson} contentItem={contentItem} contentId={contentItem.id} />
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-4">
                انقر على <PlusOutlined /> لإضافة الدرس الأول في هذا المحتوى.
            </p>
          )}
        </div>
      )} */}
    </div>
  );

  // --- Main Modal Component ---
  const Modal = () => {
    if (!isModalOpen || !editingItem) return null;

    const isEditing = editingItem.id !== undefined && (modalType !== 'content' || editingItem.type); 
    const itemTypeArabic = modalType === 'content' ? 'المحتوى' : modalType === 'lesson' ? 'الدرس' : 'الفيديو';
    const titleText = isEditing ? `تعديل ${itemTypeArabic}` : `إضافة ${itemTypeArabic} جديد`;
    let saveHandler;

    if (modalType === 'content') saveHandler = handleSaveContent;
    else if (modalType === 'lesson') saveHandler = handleSaveLesson;
    else if (modalType === 'video') saveHandler = handleSaveVideo;

    return (
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50"
        onClick={closeModal} 
      >
        <div 
          className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 p-6 max-h-[90vh] overflow-y-auto"
          dir="rtl"
          onClick={(e) => e.stopPropagation()} 
        >
          {/* Modal Header */}
          <div className="flex justify-between items-center pb-3 border-b mb-4 sticky top-0 bg-white z-10">
            <h3 className="text-xl font-bold text-gray-800">{titleText}</h3>
            <button onClick={closeModal} className="text-gray-500 hover:text-gray-800">
              <CloseOutlined />
            </button>
          </div>

          {/* Modal Form Content */}
          <div className="space-y-4">
            {/* Title Input */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                عنوان {itemTypeArabic}
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={editingItem.title || ''}
                onChange={handleModalChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder={`أدخل عنوان ${itemTypeArabic}`}
              />
            </div>
            {/* Description Input */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                وصف {itemTypeArabic}
              </label>
              <textarea
                id="description"
                name="description"
                value={editingItem.description || ''}
                onChange={handleModalChange}
                rows="3"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder={`أدخل وصف ${itemTypeArabic}`}
              />
            </div>
            
            {/* Conditional Fields (Video and Content Type) */}
            {modalType === 'video' && (
              <>
                <div>
                  <label htmlFor="link" className="block text-sm font-medium text-gray-700 mb-1">رابط الفيديو</label>
                  <input type="url" name="link" value={editingItem.link || ''} onChange={handleModalChange} className="w-full p-2 border border-gray-300 rounded-lg" placeholder="https://..." />
                </div>
                <div>
                  <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">مدة الفيديو (مثال: 10:30)</label>
                  <input type="text" name="time" value={editingItem.time || ''} onChange={handleModalChange} className="w-full p-2 border border-gray-300 rounded-lg" placeholder="00:00" />
                </div>
              </>
            )}
            {modalType === 'content' && (
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">نوع المحتوى</label>
                <select name="type" value={editingItem.type || 'basic'} onChange={handleModalChange} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
                  <option value="basic">أساسي</option>
                  <option value="advanced">متقدم</option>
                </select>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="flex justify-start mt-6 space-x-3 space-x-reverse">
            <button
              onClick={saveHandler}
              className="px-6 py-2 text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition duration-150"
            >
              حفظ
            </button>
            <button
              onClick={closeModal}
              className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-150"
            >
              إلغاء
            </button>
          </div>
        </div>
      </div>
    );
  };
  // --- End Modal Component ---
  
  if(all_content_loading) {
    return (
      <div className='h-screen flex justify-center items-center'>
        <Spin spinning size='large'/>
      </div>
    )
  }
  return (
    <div className="p-4 sm:p-8 bg-gradient-to-br from-gray-50 to-white min-h-screen" dir="rtl">
      
      {/* Page Header */}
      <div className="max-w-6xl mx-auto mb-8 p-6 bg-white rounded-2xl shadow-xl border-b-4 border-blue-500">
        <h1 className="text-3xl font-extrabold text-gray-800">إدارة محتوى الدورة | المستوى الأساسي</h1>
        <p className="text-gray-600 mt-1">تنظيم المناهج، الدروس، والفيديوهات وتحديد جدول الدورة.</p>
      </div>

      {/* Main Grid Layout */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 1. Scheduling Panel (Collapsible) */}
        <div className="lg:col-span-1 p-6 bg-white rounded-xl shadow-lg h-fit sticky top-4 overflow-hidden">
          
          {/* Schedule Header - Clickable for Collapse */}
          <div 
            className="flex justify-between items-center cursor-pointer pb-2 mb-2"
            onClick={() => setIsScheduleCollapsed(!isScheduleCollapsed)}
          >
            <h2 className="text-xl font-bold text-blue-700 flex items-center">
              <CalendarOutlined className="ml-2" /> جدول وتوقيت الدورة
            </h2>
             <CaretDownOutlined 
                className={`text-2xl text-blue-500 transition-transform duration-300 ${isScheduleCollapsed ? 'rotate-90' : 'rotate-180'}`} 
            />
          </div>

          {/* Schedule Form Content (Conditional Rendering) */}
          {!isScheduleCollapsed && (
            <div className="space-y-4 pt-2 border-t border-gray-100">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">تاريخ البدء</label>
                <input type="date" id="startDate" name="startDate" value={schedule.startDate} onChange={handleScheduleChange} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">تاريخ الانتهاء</label>
                <input type="date" id="endDate" name="endDate" value={schedule.endDate} onChange={handleScheduleChange} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">وقت البدء</label>
                <input type="time" id="startTime" name="startTime" value={schedule.startTime} onChange={handleScheduleChange} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">وقت الانتهاء</label>
                <input type="time" id="endTime" name="endTime" value={schedule.endTime} onChange={handleScheduleChange} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <p className="text-xs text-gray-500 mt-4 border-t pt-3">
                 **ملاحظة:** سيتم تطبيق هذه الأوقات على جميع دروس هذه الدورة.
              </p>
            </div>
          )}
        </div>

        {/* 2. Course Content Structure */}
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">هيكل المحتوى والمناهج</h2>
            <button
              onClick={() => setAddModalContent(true)} 
              className="flex items-center px-4 py-2 text-white bg-green-600 rounded-lg shadow-md hover:bg-green-700 transition duration-150"
            >
              <PlusOutlined className="ml-2" /> إضافة محتوى رئيسي
            </button>
          </div>
          
          {/* Render all content sections */}
          {basicData?.length > 0 ? (
            basicData?.map(item => (<ContentSection key={item.id} contentItem={item} />))
          ) : (
            <div className="text-center p-10 bg-white rounded-xl shadow-lg">
              <p className="text-xl text-gray-500">
                لا يوجد محتوى مضاف بعد. ابدأ بإضافة أول محتوى رئيسي لدورتك.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* MODAL RENDERING */}
      <Modal />
      <AddRoundContent open={addModalContent} setOpen={setAddModalContent} id={id}/>
      <DeleteRoundContent id={id} open={deleteModalContent} setOpen={setDeleteModalContent} rowData={rowData}/>
    </div>
  );
}