// "use client";

// import Button from "@/components/atoms/Button";
// import { Card, Collapse, Empty, Tag, Tooltip, Badge, DatePicker, Divider, Modal, Input, Checkbox, Space } from "antd";
// import { Eye, EyeOff, FileText, Play, Target, Trash2, Plus, Video, ExternalLink, Upload as UploadIcon, BookOpen, Copy } from "lucide-react";
// import dayjs from "dayjs";
// import React, { useMemo, useState } from "react";

// const { Panel } = Collapse;
// const { Search } = Input;

// export default function CourseSourceLecturesContent({
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

//   /** ✅ جديدة للجدولة */
//   isReleased,
//   setLessonReleaseAt,
//   setStageReleaseAt,

//   /** ✅ نسخ */
//   duplicateTargets = [],
//   onCopy,
// }) {
//   // open hidden file picker for a specific lesson
//   const openPicker = (stageId, lessonId) => {
//     const input = document.getElementById(`pdf-picker-${stageId}-${lessonId}`);
//     if (input) input.click();
//   };

//   // handle file selection for a lesson
//   const onFilesPicked = (stageId, lessonId, e) => {
//     const files = Array.from(e.target.files || []);
//     if (files.length && typeof addTrainingFiles === "function") {
//       addTrainingFiles(stageId, lessonId, files);
//     } else {
//       console.warn("addTrainingFiles(stageId, lessonId, files[]) not provided.");
//     }
//     // allow picking the same files again later
//     e.target.value = "";
//   };

//   /* ========== نسخ: الحالة العامة للمودال ========== */
//   const [copyOpen, setCopyOpen] = useState(false);
//   const [copyLoading, setCopyLoading] = useState(false);
//   const [copyError, setCopyError] = useState("");
//   const [targetsSearch, setTargetsSearch] = useState("");
//   const [selectedTargets, setSelectedTargets] = useState([]);

//   // سياق النسخ: كل/قسم/محاضرة + عنوان لعرضه
//   const [copyCtx, setCopyCtx] = useState({ type: "all", stageId: undefined, lessonId: undefined, title: "" });

//   const filteredTargets = useMemo(() => {
//     const term = (targetsSearch || "").toLowerCase();
//     if (!term) return duplicateTargets;
//     return duplicateTargets.filter((t) => (t.title || "").toLowerCase().includes(term));
//   }, [duplicateTargets, targetsSearch]);

//   const toggleTarget = (id) => {
//     setSelectedTargets((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
//   };

//   const toggleAllTargets = () => {
//     if (selectedTargets.length === filteredTargets.length) {
//       setSelectedTargets([]);
//     } else {
//       setSelectedTargets(filteredTargets.map((t) => t.id));
//     }
//   };

//   const openCopyModal = (ctx) => {
//     setCopyCtx(ctx);
//     setCopyError("");
//     setSelectedTargets([]);
//     setTargetsSearch("");
//     setCopyOpen(true);
//   };

//   const confirmCopy = async () => {
//     if (selectedTargets.length === 0) {
//       setCopyError("برجاء اختيار دورة/دورات الهدف أولاً.");
//       return;
//     }
//     try {
//       setCopyLoading(true);
//       if (typeof onCopy === "function") {
//         await onCopy(copyCtx, selectedTargets);
//       } else {
//         console.log("COPY ->", { ctx: copyCtx, to: selectedTargets });
//       }
//       setCopyOpen(false);
//     } catch (e) {
//       setCopyError(e?.message || "تعذّر النسخ، جرّب مرة أخرى.");
//     } finally {
//       setCopyLoading(false);
//     }
//   };

//   const ctxTitle = useMemo(() => {
//     if (copyCtx.type === "all") return "نسخ مرحلة التأسيس كاملة";
//     if (copyCtx.type === "stage") return `نسخ القسم: ${copyCtx.title ?? copyCtx.stageId}`;
//     return `نسخ المحاضرة: ${copyCtx.title ?? copyCtx.lessonId}`;
//   }, [copyCtx]);

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
//               <Badge count={stats.stageCount} showZero color="blue" className="[&_.ant-badge-count]:bg-blue-500">
//                 <span className="text-sm text-gray-600 font-medium px-3 py-1 bg-white rounded-full">الأقسام</span>
//               </Badge>
//               <Badge count={stats.lessonCount} showZero color="green" className="[&_.ant-badge-count]:bg-green-500">
//                 <span className="text-sm text-gray-600 font-medium px-3 py-1 bg-white rounded-full">المحاضرات</span>
//               </Badge>
//             </div>
//           </div>
//           <div className="flex items-center gap-3">
//             {/* ✅ نسخ كل المحتوى */}
//             <Button
//               className="!bg-emerald-600 hover:!bg-emerald-700 !text-white !border-0 shadow-md transition-all duration-200 flex items-center gap-2"
//               onClick={() => openCopyModal({ type: "all", title: "مرحلة التأسيس" })}
//             >
//               <Copy className="w-4 h-4" />
//               نسخ الكل
//             </Button>
//             <Button
//               className="!bg-gray-700 hover:!bg-gray-800 !text-white !border-0 shadow-md transition-all duration-200 flex items-center gap-2"
//               onClick={() => setOpenAddStage(true)}
//             >
//               <Plus className="w-4 h-4" />
//               إضافة قسم
//             </Button>
//             <Button
//               type="primary"
//               className="!bg-blue-600 hover:!bg-blue-700 !text-white !border-0 shadow-md transition-all duration-200 flex items-center gap-2"
//               onClick={() => setOpenAddLesson(true)}
//             >
//               <Plus className="w-4 h-4" />
//               إضافة محاضرة
//             </Button>
//           </div>
//         </div>
//       </Card>

//       {/* Content Area */}
//       <Card className="shadow-lg !h-fit border-0" bodyStyle={{ padding: "0" }}>
//         {foundationStages.length === 0 ? (
//           <div className="p-12">
//             <Empty
//               description={
//                 <div className="text-center">
//                   <p className="text-gray-500 text-lg mb-2">لا توجد مراحل بعد</p>
//                   <p className="text-gray-400 text-sm">ابدأ بإضافة قسم جديدة لتنظيم المحتوى</p>
//                 </div>
//               }
//               className="my-8"
//             />
//           </div>
//         ) : (
//           <Collapse accordion className="border-0 !h-full" expandIconPosition="end">
//             {foundationStages.map((st, stageIndex) => {
//               const opened = isReleased?.(st.releaseAt);
//               const effectiveVisible = st.visible && opened;

//               return (
//                 <Panel
//                   key={st.id}
//                   header={
//                     <div className="flex items-center justify-between w-full pr-4">
//                       <div className="flex items-center gap-4">
//                         <div
//                           className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
//                             effectiveVisible ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-400"
//                           }`}
//                         >
//                           {stageIndex + 1}
//                         </div>
//                         <div className="flex items-center gap-3">
//                           <Tooltip title={effectiveVisible ? "إخفاء القسم" : opened ? "إظهار القسم" : "سيظهر تلقائياً عند موعده"}>
//                             <Button
//                               type="text"
//                               size="small"
//                               className={`!p-1 hover:!bg-gray-100 ${effectiveVisible ? "!text-green-600" : "!text-gray-400"}`}
//                               disabled={!opened}
//                               icon={effectiveVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
//                               onClick={(e) => {
//                                 e.stopPropagation();
//                                 if (opened) toggleStageVisibility(st.id);
//                               }}
//                             />
//                           </Tooltip>
//                           <h3 className={`font-semibold text-lg m-0 ${effectiveVisible ? "text-gray-800" : "text-gray-400"}`}>
//                             القسم : {st.title}
//                           </h3>

//                           {/* حالة الظهور */}
//                           {st.releaseAt ? (opened ? <Tag color="green">متاح</Tag> : <Tag color="red">لم يُفتح بعد</Tag>) : <Tag color="green">متاح الآن</Tag>}

//                           {st.releaseAt && (
//                             <Tooltip title="موعد الظهور">
//                               <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
//                                 {dayjs(st.releaseAt).format("YYYY/MM/DD HH:mm")}
//                               </span>
//                             </Tooltip>
//                           )}
//                         </div>
//                       </div>
//                       <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
//                         {/* ⬇️ جدولة القسم */}
//                         <DatePicker
//                           showTime
//                           size="small"
//                           placeholder="موعد ظهور القسم"
//                           className="min-w-[190px]"
//                           value={st.releaseAt && dayjs(st.releaseAt).isValid() ? dayjs(st.releaseAt) : null}
//                           onChange={(v) => setStageReleaseAt?.(st.id, v || null)}
//                         />
//                         {st.releaseAt && (
//                           <Button size="small" type="text" onClick={() => setStageReleaseAt?.(st.id, null)}>
//                             مسح
//                           </Button>
//                         )}

//                         <Badge
//                           count={st.lessons?.length || 0}
//                           showZero
//                           size="small"
//                           className="[&_.ant-badge-count]:bg-indigo-500 [&_.ant-badge-count]:text-xs"
//                         >
//                           <span className="text-xs text-gray-500 font-medium">محاضرات</span>
//                         </Badge>

//                         {/* نسخ القسم */}
//                         <Tooltip title="نسخ هذا القسم إلى دورات أخرى">
//                           <Button
//                             type="text"
//                             size="small"
//                             className="!p-1 hover:!bg-emerald-50 !text-emerald-600"
//                             icon={<Copy className="w-4 h-4" />}
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               openCopyModal({ type: "stage", stageId: st.id, title: st.title });
//                             }}
//                           />
//                         </Tooltip>

//                         <Tooltip title="حذف القسم">
//                           <Button
//                             danger
//                             type="text"
//                             size="small"
//                             className="!p-1 hover:!bg-red-50"
//                             icon={<Trash2 className="w-4 h-4" />}
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               deleteStage(st.id);
//                             }}
//                           />
//                         </Tooltip>
//                       </div>
//                     </div>
//                   }
//                   className="!border-0 !mb-2"
//                   style={{
//                     backgroundColor: effectiveVisible ? "#fafafa" : "#f5f5f5",
//                     borderRadius: "12px",
//                     marginBottom: "8px",
//                   }}
//                 >
//                   <div className="px-6 pb-4">
//                     {(st.lessons || []).length === 0 ? (
//                       <div className="text-center py-8">
//                         <Empty
//                           description="لا توجد محاضرات في هذه القسم"
//                           image={Empty.PRESENTED_IMAGE_SIMPLE}
//                           className="!text-gray-400"
//                         />
//                       </div>
//                     ) : (
//                       <div className="space-y-4">
//                         {st.lessons.map((l, lessonIndex) => {
//                           const pdfs = l?.training?.pdfs || [];
//                           const released = isReleased?.(l.releaseAt);

//                           return (
//                             <div
//                               key={l.id}
//                               className={`relative rounded-xl border-2 p-6 transition-all duration-300 hover:shadow-md ${
//                                 l.visible
//                                   ? "bg-white border-blue-100 hover:border-blue-200"
//                                   : "bg-gray-50 border-gray-200 opacity-75"
//                               }`}
//                             >
//                               {/* Lesson Number */}
//                               <div className="absolute -top-3 -right-3 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-md">
//                                 {lessonIndex + 1}
//                               </div>

//                               <div className="flex items-start justify-between">
//                                 <div className="flex-1">
//                                   {/* Header */}
//                                   <div className="flex items-start gap-4 mb-4">
//                                     <div className="rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 p-3 text-blue-700">
//                                       <Play className="w-5 h-5" />
//                                     </div>
//                                     <div className="flex-1">
//                                       <div className="flex items-center justify-between gap-3">
//                                         <h4 className={`font-bold text-lg mb-2 ${l.visible ? "text-gray-800" : "text-gray-500"}`}>
//                                           المحاضرة : {l.title}
//                                         </h4>

//                                         {/* ⬇️ جدولة المحاضرة */}
//                                         <Space onClick={(e) => e.stopPropagation()}>
//                                           <Tooltip title="موعد الظهور">
//                                             <DatePicker
//                                               showTime
//                                               size="small"
//                                               value={l.releaseAt && dayjs(l.releaseAt).isValid() ? dayjs(l.releaseAt) : null}
//                                               placeholder="موعد الظهور"
//                                               className="min-w-[190px]"
//                                               onChange={(v) => setLessonReleaseAt(st.id, l.id, v || null)}
//                                             />
//                                           </Tooltip>
//                                           {l.releaseAt && (
//                                             <Button size="small" onClick={() => setLessonReleaseAt(st.id, l.id, null)}>
//                                               مسح
//                                             </Button>
//                                           )}
//                                           {l.releaseAt ? (released ? <Tag color="green">متاح</Tag> : <Tag color="red">لم يُفتح بعد</Tag>) : <Tag color="green">متاح الآن</Tag>}
//                                         </Space>
//                                       </div>

//                                       {/* Main Video */}
//                                       <div className="bg-blue-50 rounded-lg p-4 mb-4">
//                                         <div className="flex items-center gap-2 mb-3">
//                                           <Video className="w-4 h-4 text-blue-600" />
//                                           <Tag color="blue" className="!mb-0 font-medium">
//                                             فيديو : {l?.lessonVideo?.title}
//                                           </Tag>
//                                         </div>
//                                         <div className="flex items-center gap-3 text-sm text-gray-700">
//                                           <span className="font-medium">{l.lessonVideo?.title || "غير محدد"}</span>
//                                           {l.lessonVideo?.source === "url" && l.lessonVideo?.url ? (
//                                             <a
//                                               href={l.lessonVideo.url}
//                                               target="_blank"
//                                               rel="noreferrer"
//                                               className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium"
//                                             >
//                                               مشاهدة
//                                               <ExternalLink className="w-3 h-3" />
//                                             </a>
//                                           ) : (
//                                             <span className="text-gray-500">ملف مرفوع</span>
//                                           )}
//                                         </div>
//                                       </div>

//                                       {/* Training */}
//                                       <div className="bg-amber-50 rounded-lg p-4">
//                                         <div className="flex items-center gap-2 mb-3">
//                                           <Target className="w-4 h-4 text-amber-600" />
//                                           <Tag color="gold" className="!mb-0 font-medium">
//                                             تدريب
//                                           </Tag>
//                                         </div>

//                                         <Divider className="!my-4" />

//                                         {/* PDFs */}
//                                         <div>
//                                           <div className="flex items-center justify-between mb-3">
//                                             <div className="flex items-center gap-2">
//                                               <FileText className="w-4 h-4 text-indigo-600" />
//                                               <Tag color="geekblue" className="!mb-0 font-medium">
//                                                 ملفات PDF
//                                               </Tag>
//                                               <Badge count={pdfs.length} showZero size="small" />
//                                             </div>
//                                             <Button
//                                               type="dashed"
//                                               size="small"
//                                               className="!border-indigo-300 !text-indigo-600 hover:!border-indigo-400 hover:!text-indigo-700 flex items-center gap-1"
//                                               onClick={(e) => {
//                                                 e.stopPropagation();
//                                                 openPicker(st.id, l.id);
//                                               }}
//                                             >
//                                               <UploadIcon className="w-3 h-3" />
//                                               إضافة ملفات
//                                             </Button>

//                                             {/* hidden input per lesson (multi) */}
//                                             <input
//                                               id={`pdf-picker-${st.id}-${l.id}`}
//                                               type="file"
//                                               accept="application/pdf"
//                                               multiple
//                                               className="hidden"
//                                               onChange={(e) => onFilesPicked(st.id, l.id, e)}
//                                               onClick={(e) => e.stopPropagation()}
//                                             />
//                                           </div>

//                                           {pdfs.length > 0 && (
//                                             <div className="space-y-2">
//                                               {pdfs.map((f, idx) => {
//                                                 const key = f?.id ?? idx;
//                                                 const label = f?.title || f?.name || `ملف ${idx + 1}`;
//                                                 const isUrl = f?.source === "url" && f?.url;

//                                                 return (
//                                                   <div
//                                                     key={key}
//                                                     className="flex items-center justify-between rounded-lg border bg-white p-3 hover:shadow-sm transition-shadow"
//                                                   >
//                                                     <div className="flex items-center gap-3">
//                                                       <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
//                                                         <FileText className="w-4 h-4 text-red-600" />
//                                                       </div>
//                                                       <span className="text-gray-800 font-medium">{label}</span>
//                                                     </div>
//                                                     <div className="flex items-center gap-2">
//                                                       {isUrl ? (
//                                                         <a
//                                                           href={f.url}
//                                                           target="_blank"
//                                                           rel="noreferrer"
//                                                           className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
//                                                           onClick={(e) => e.stopPropagation()}
//                                                         >
//                                                           عرض
//                                                           <ExternalLink className="w-3 h-3" />
//                                                         </a>
//                                                       ) : (
//                                                         <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
//                                                           ملف مرفوع
//                                                         </span>
//                                                       )}
//                                                       <Tooltip title="حذف الملف">
//                                                         <Button
//                                                           danger
//                                                           type="text"
//                                                           size="small"
//                                                           icon={<Trash2 className="w-4 h-4" />}
//                                                           className="!p-1 hover:!bg-red-50"
//                                                           onClick={(e) => {
//                                                             e.stopPropagation();
//                                                             if (typeof removeTrainingFile === "function") {
//                                                               removeTrainingFile(st.id, l.id, f?.id ?? idx);
//                                                             }
//                                                           }}
//                                                         />
//                                                       </Tooltip>
//                                                     </div>
//                                                   </div>
//                                                 );
//                                               })}
//                                             </div>
//                                           )}
//                                         </div>
//                                       </div>
//                                     </div>
//                                   </div>
//                                 </div>

//                                 {/* Actions */}
//                                 <div className="flex items-start gap-2 ml-4">
//                                   {/* ✅ نسخ المحاضرة */}
//                                   <Tooltip title="نسخ هذه المحاضرة إلى دورات أخرى">
//                                     <Button
//                                       type="text"
//                                       size="small"
//                                       className="!p-2 hover:!bg-emerald-50 !text-emerald-600"
//                                       icon={<Copy className="w-4 h-4" />}
//                                       onClick={() =>
//                                         openCopyModal({
//                                           type: "lesson",
//                                           stageId: st.id,
//                                           lessonId: l.id,
//                                           title: l.title,
//                                         })
//                                       }
//                                     />
//                                   </Tooltip>
//                                   <Tooltip title={l.visible ? "إخفاء المحاضرة" : "إظهار المحاضرة"}>
//                                     <Button
//                                       type="text"
//                                       size="small"
//                                       className={`!p-2 hover:!bg-gray-100 ${l.visible ? "!text-green-600" : "!text-gray-400"}`}
//                                       icon={l.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
//                                       onClick={() => toggleLessonVisibility(st.id, l.id)}
//                                     />
//                                   </Tooltip>
//                                   <Tooltip title="حذف المحاضرة">
//                                     <Button
//                                       danger
//                                       size="small"
//                                       className="!p-2 hover:!bg-red-50"
//                                       onClick={() => deleteLesson(st.id, l.id)}
//                                       icon={<Trash2 className="w-4 h-4" />}
//                                     />
//                                   </Tooltip>
//                                 </div>
//                               </div>
//                             </div>
//                           );
//                         })}
//                       </div>
//                     )}
//                   </div>
//                 </Panel>
//               );
//             })}
//           </Collapse>
//         )}
//       </Card>

//       {/* ✅ مودال النسخ */}
//       <Modal
//         open={copyOpen}
//         onCancel={() => setCopyOpen(false)}
//         onOk={confirmCopy}
//         okText={copyLoading ? "جارٍ النسخ..." : "نسخ"}
//         cancelText="إلغاء"
//         confirmLoading={copyLoading}
//         width={560}
//         title="نسخ إلى دورات أخرى"
//       >
//         <div className="space-y-3" dir="rtl">
//           <div className="text-sm text-gray-700">
//             <span className="font-semibold">السياق:</span> {ctxTitle}
//           </div>

//           <Search
//             placeholder="ابحث عن دورة هدف..."
//             allowClear
//             onChange={(e) => setTargetsSearch(e.target.value)}
//           />

//           <div className="flex items-center justify-between">
//             <button
//               type="button"
//               className="text-xs px-2 py-1 rounded border hover:bg-gray-50"
//               onClick={toggleAllTargets}
//             >
//               {selectedTargets.length === filteredTargets.length ? "إلغاء تحديد الكل" : "تحديد الكل"}
//             </button>
//             <div className="text-xs text-gray-500">
//               المختار: {selectedTargets.length}/{filteredTargets.length}
//             </div>
//           </div>

//           {filteredTargets.length > 0 ? (
//             <div className="max-h-64 overflow-auto space-y-2 pr-1">
//               {filteredTargets.map((t) => (
//                 <label
//                   key={t.id}
//                   className={`flex items-center justify-between border rounded-lg px-3 py-2 cursor-pointer hover:bg-gray-50 ${
//                     selectedTargets.includes(t.id) ? "border-emerald-400 bg-emerald-50/50" : "border-gray-200"
//                   }`}
//                   onClick={() => toggleTarget(t.id)}
//                 >
//                   <div className="flex items-center gap-3">
//                     <Checkbox
//                       checked={selectedTargets.includes(t.id)}
//                       onChange={() => toggleTarget(t.id)}
//                       onClick={(e) => e.stopPropagation()}
//                     />
//                     <div>
//                       <div className="font-medium text-gray-900 text-sm">{t.title}</div>
//                       <div className="text-xs text-gray-500">ID: {t.id}</div>
//                     </div>
//                   </div>
//                 </label>
//               ))}
//             </div>
//           ) : (
//             <div className="p-3 rounded-lg border border-amber-200 bg-amber-50 text-amber-800 text-sm">
//               لا توجد دورات مطابقة لبحثك.
//             </div>
//           )}

//           {copyError && <div className="text-sm text-red-600">{copyError}</div>}
//         </div>
//       </Modal>
//     </div>
//   );
// }

"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CalendarOutlined,
  CaretDownOutlined,
  CloseOutlined,
  FileTextOutlined,
  PlayCircleOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { handleGetAllRoundContent } from "../../lib/features/roundContentSlice";
import { useRouter, useSearchParams } from "next/navigation";
import { Spin } from "antd";
import AddRoundContent from "../RoundContent/AddRoundContent";
import DeleteRoundContent from "../RoundContent/DeleteRoundContent";
import EditRoundContent from "../RoundContent/EditRoundContent";
import AddLessonModal from "../RoundContent/Lessons/AddLessonModal";
import { handleGetAllRoundLessons } from "../../lib/features/lessonSlice";
import DeleteLessonModal from "../RoundContent/Lessons/DeleteLessonModal";
import EditLessonModal from "../RoundContent/Lessons/EditLessonModal";
import AddVideoModal from "../RoundContent/Videos/AddVideoModal";
import { handleGetAllLessonVideo } from "../../lib/features/videoSlice";
import EditVideoModal from "../RoundContent/Videos/EditVideoModal";
import DeleteVideoModal from "../RoundContent/Videos/DeleteVideoModal";

const initialSchedule = {
  startDate: "2025-12-01",
  endDate: "2025-12-31",
  startTime: "09:00",
  endTime: "11:00",
};

export default function CourseSourceLecturesContent({ id }) {
  const [rowData, setRowData] = useState({});
  const [schedule, setSchedule] = useState(initialSchedule);
  const [isScheduleCollapsed, setIsScheduleCollapsed] = useState(false);

  // Modal states...
  const [addModalContent, setAddModalContent] = useState(false);
  const [deleteModalContent, setDeleteModalContent] = useState(false);
  const [editModalContent, setEditModalContent] = useState(false);
  const [openAddLesson, setOpenAddLesson] = useState(false);
  const [openEditLesson, setOpenEditLesson] = useState(false);
  const [openDeleteLesson, setOpenDeleteLesson] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState({});
  const [openAddVideo, setOpenAddVideo] = useState(false);
  const [openEditVideo, setOpenEditVideo] = useState(false);
  const [openDeleteVideo, setOpenDeleteVideo] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState({});
  const router = useRouter();

  const dispatch = useDispatch();
  const { all_content_list } = useSelector((state) => state?.content);
  const { all_lessons_list } = useSelector((state) => state?.lesson);
  const { all_videos_list } = useSelector((state) => state?.videos);

  // Track which content sections are expanded and their loading states
  const [expandedContents, setExpandedContents] = useState({});
  const [expandedLessons, setExpandedLessons] = useState({});
  const [loadingContents, setLoadingContents] = useState({});
  const [loadingLessons, setLoadingLessons] = useState({});

  const [basicData, setBasicData] = useState([]);

  useEffect(() => {
    dispatch(
      handleGetAllRoundContent({
        body: {
          round_id: id,
        },
      })
    );
  }, [id, dispatch]);

  useEffect(() => {
    console.log(all_content_list?.data?.message);

    setBasicData(
      all_content_list?.data?.message?.contents?.filter(
        (item) => item?.type == "lecture"
      ) || []
    );
  }, [all_content_list]);

  // Helper to get videos for specific lesson
  const getVideosByLessonId = useCallback(
    (lessonId) => {
      return (
        all_videos_list?.data?.message?.filter(
          (item) => item?.lesson_id === lessonId
        ) || []
      );
    },
    [all_videos_list]
  );

  function handleScheduleChange() {
    console.log("");
  }

  // Helper to get lessons for specific content
  const getLessonsByContentId = useCallback(
    (contentId) => {
      return (
        all_lessons_list?.data?.message?.filter(
          (item) =>
            item?.type === "lecture" && item?.round_content_id === contentId
        ) || []
      );
    },
    [all_lessons_list]
  );

  // --- Toggle Handlers ---

  const toggleContentCollapse = async (contentId) => {
    const isCurrentlyExpanded = expandedContents[contentId];

    // Toggle the expanded state
    setExpandedContents((prev) => ({
      ...prev,
      [contentId]: !isCurrentlyExpanded,
    }));

    // If we're expanding and haven't loaded lessons yet, fetch them
    if (!isCurrentlyExpanded) {
      setLoadingContents((prev) => ({
        ...prev,
        [contentId]: true,
      }));

      try {
        await dispatch(
          handleGetAllRoundLessons({
            body: {
              round_content_id: contentId,
            },
          })
        );
      } catch (error) {
        console.error("Error fetching lessons:", error);
      } finally {
        setLoadingContents((prev) => ({
          ...prev,
          [contentId]: false,
        }));
      }
    }
  };

  const toggleLessonCollapse = async (lessonId) => {
    const isCurrentlyExpanded = expandedLessons[lessonId];

    // Toggle the expanded state
    setExpandedLessons((prev) => ({
      ...prev,
      [lessonId]: !isCurrentlyExpanded,
    }));

    // If we're expanding and haven't loaded videos yet, fetch them
    if (!isCurrentlyExpanded) {
      setLoadingLessons((prev) => ({
        ...prev,
        [lessonId]: true,
      }));

      try {
        await dispatch(
          handleGetAllLessonVideo({
            body: {
              lesson_id: lessonId,
            },
          })
        );
      } catch (error) {
        console.error("Error fetching videos:", error);
      } finally {
        setLoadingLessons((prev) => ({
          ...prev,
          [lessonId]: false,
        }));
      }
    }
  };

  const toggleScheduleCollapse = () => {
    setIsScheduleCollapsed((prev) => !prev);
  };

  const ActionButton = ({ icon, onClick, className = "", children }) => (
    <button
      onClick={onClick}
      className={`p-1 text-sm rounded-full transition duration-150 hover:bg-gray-200 ${className}`}
    >
      {icon}
      {children}
    </button>
  );

  // Video Card Renderer
  const VideoCard = ({ video, lessonId }) => {
    const isFree = video?.free === "1";

    return (
      <div className="bg-blue-50/70 p-4 mb-3 rounded-lg border border-blue-100 flex justify-between items-start">
        <div className="flex items-start flex-1 min-w-0">
          <PlayCircleOutlined className="text-blue-600 text-lg mt-1 ml-3 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="font-medium text-gray-800 truncate">
                {video?.title}
              </p>
              {isFree && (
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                  مجاني
                </span>
              )}
            </div>
            <p className="text-gray-600 text-sm mt-1">{video?.description}</p>
            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
              <span>⏱️ {video?.time}</span>
              <a
                href={video?.video}
                target="_blank"
                className="truncate max-w-xs"
              >
                {video.video}
              </a>
            </div>
          </div>
        </div>
        <div className="flex space-x-2 space-x-reverse ml-4 flex-shrink-0">
          <ActionButton
            icon={<EditOutlined className="text-blue-600" />}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedVideo(video);
              setOpenEditVideo(true);
            }}
          />
          <ActionButton
            icon={<DeleteOutlined className="text-red-600" />}
            onClick={() => {
              setSelectedVideo(video);
              setOpenDeleteVideo(true);
            }}
          />
        </div>
      </div>
    );
  };

  // Exam Card Renderer (Placeholder - you can expand this based on your exam data structure)
  const ExamCard = ({ exam, lessonId }) => (
    <div className="bg-orange-50/70 p-4 mb-3 rounded-lg border border-orange-100 flex justify-between items-start">
      <div className="flex items-start flex-1 min-w-0">
        <FileTextOutlined className="text-orange-600 text-lg mt-1 ml-3 flex-shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="font-medium text-gray-800 truncate">{exam.title}</p>
          <p className="text-gray-600 text-sm mt-1">{exam.description}</p>
          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
            <span>⏱️ {exam.duration} دقيقة</span>
            <span>❓ {exam.questions} أسئلة</span>
          </div>
        </div>
      </div>
      <div className="flex space-x-2 space-x-reverse ml-4 flex-shrink-0">
        <ActionButton
          icon={<EditOutlined className="text-blue-600" />}
          onClick={(e) => {
            e.stopPropagation();
            // Handle exam edit
          }}
        />
        <ActionButton
          icon={<DeleteOutlined className="text-red-600" />}
          onClick={() => handleDeleteExam(lessonId, exam.id)}
        />
      </div>
    </div>
  );

  // Lesson Card Renderer
  const LessonCard = ({ lesson, contentId }) => {
    const isLessonExpanded = expandedLessons[lesson.id];
    const isLoadingVideos = loadingLessons[lesson.id];
    const lessonVideos = getVideosByLessonId(lesson.id);
    // Mock exams data - replace with actual API call
    const lessonExams = []; // You can add exams data here

    return (
      <div className="mb-4 bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        {/* Lesson Header (Clickable for Collapse) */}
        <div
          className="p-4 flex justify-between items-start cursor-pointer hover:bg-gray-50 transition duration-150"
          onClick={() => toggleLessonCollapse(lesson.id)}
        >
          <div className="flex items-center flex-1 min-w-0">
            <CaretDownOutlined
              className={`text-xl ml-3 text-blue-500 transition-transform duration-300 ${
                isLessonExpanded ? "rotate-0" : "-rotate-90"
              }`}
            />
            <div className="min-w-0">
              <h4 className="text-lg font-semibold text-gray-800 truncate">
                {lesson.title}
              </h4>
              <p className="text-sm text-gray-600 mt-1 truncate">
                {lesson.description}
              </p>
            </div>
          </div>

          {/* Lesson Actions */}
          <div
            className="flex space-x-2 space-x-reverse ml-4 flex-shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            {/* <ActionButton
              icon={<PlusOutlined className="text-green-600" />}
              onClick={() => {
                setOpenAddVideo(true);
                setSelectedLesson(lesson);
              }}
              className="text-sm border border-green-200"
              title="إضافة فيديو"
            /> */}
            <ActionButton
              icon={<EditOutlined className="text-blue-600" />}
              onClick={() => {
                setSelectedLesson(lesson);
                setOpenEditLesson(true);
              }}
            />
            <ActionButton
              icon={<DeleteOutlined className="text-red-600" />}
              onClick={() => {
                setSelectedLesson(lesson);
                setOpenDeleteLesson(true);
              }}
            />
          </div>
        </div>

        {/* Videos & Exams Section (Conditional Rendering) */}
        {isLessonExpanded && (
          <div className="p-4 pt-3 bg-gray-50 border-t">
            {isLoadingVideos ? (
              <div className="flex justify-center items-center py-4">
                <Spin spinning size="default" />
              </div>
            ) : (
              <>
                {/* Videos Section */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-3">
                    <h5 className="text-md font-semibold text-gray-700 flex items-center">
                      <PlayCircleOutlined className="ml-2 text-blue-500" />
                      الفيديوهات ({lessonVideos.length})
                    </h5>
                    <button
                      onClick={() => {
                        setOpenAddVideo(true);
                        setSelectedLesson(lesson);
                      }}
                      className="flex items-center text-sm text-green-600 hover:text-green-700"
                    >
                      <PlusOutlined className="ml-1" />
                      إضافة فيديو
                    </button>
                  </div>

                  {lessonVideos.length > 0 ? (
                    <div className="space-y-2">
                      {lessonVideos.map((video) => (
                        <VideoCard
                          key={video.id}
                          video={video}
                          lessonId={lesson.id}
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 text-center py-3 text-sm">
                      لا توجد فيديوهات في هذا الدرس بعد.
                    </p>
                  )}
                </div>

                {/* Exams Section */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h5 className="text-md font-semibold text-gray-700 flex items-center">
                      <FileTextOutlined className="ml-2 text-orange-500" />
                      الاختبارات ({lessonExams.length})
                    </h5>
                    <button
                      onClick={() => {
                        // Handle add exam
                      }}
                      className="flex items-center text-sm text-orange-600 hover:text-orange-700"
                    >
                      <PlusOutlined className="ml-1" />
                      إضافة اختبار
                    </button>
                  </div>

                  {lessonExams.length > 0 ? (
                    <div className="space-y-2">
                      {lessonExams.map((exam) => (
                        <ExamCard
                          key={exam.id}
                          exam={exam}
                          lessonId={lesson.id}
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 text-center py-3 text-sm">
                      لا توجد اختبارات في هذا الدرس بعد.
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    );
  };

  // Content Section Renderer
  const ContentSection = ({ contentItem }) => {
    const isContentExpanded = expandedContents[contentItem.id];
    const isLoading = loadingContents[contentItem.id];
    const contentLessons = getLessonsByContentId(contentItem.id);

    return (
      <div className="mb-8 bg-gray-50 border border-gray-100 rounded-xl shadow-md overflow-hidden">
        {/* Content Header (Clickable for Collapse) */}
        <div
          className="p-6 flex justify-between items-start border-b pb-3 cursor-pointer hover:bg-gray-100 transition duration-150"
          onClick={() => toggleContentCollapse(contentItem.id)}
        >
          <div className="flex items-center flex-1 min-w-0">
            <CaretDownOutlined
              className={`text-2xl ml-3 text-blue-700 transition-transform duration-300 ${
                isContentExpanded ? "rotate-0" : "-rotate-90"
              }`}
            />
            <div className="min-w-0">
              <h3 className="text-xl font-bold text-gray-900 truncate">
                {contentItem.title}
              </h3>
              <p className="text-base text-gray-700 mt-1 truncate">
                {contentItem.description}
              </p>
            </div>
          </div>

          {/* Content Actions */}
          <div
            className="flex space-x-3 space-x-reverse ml-4 flex-shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <ActionButton
              icon={<PlusOutlined className="text-green-600" />}
              onClick={() => {
                setOpenAddLesson(true);
                setRowData(contentItem);
              }}
              className="text-base border border-green-200 bg-white"
            >
              إضافة درس
            </ActionButton>
            <ActionButton
              icon={<EditOutlined className="text-blue-600" />}
              onClick={() => {
                setRowData(contentItem);
                setEditModalContent(true);
              }}
            />
            <ActionButton
              icon={<DeleteOutlined className="text-red-600" />}
              onClick={() => {
                setDeleteModalContent(true);
                setRowData(contentItem);
              }}
            />
          </div>
        </div>

        {/* Lesson List (Conditional Rendering) */}
        {isContentExpanded && (
          <div className="p-6 pt-3">
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <Spin spinning size="large" />
              </div>
            ) : contentLessons.length > 0 ? (
              <div className="pr-2 border-r-4 border-blue-300">
                {contentLessons.map((lesson) => (
                  <LessonCard
                    key={lesson.id}
                    lesson={lesson}
                    contentId={contentItem.id}
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-4">
                انقر على <PlusOutlined /> لإضافة الدرس الأول في هذا المحتوى.
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  // Schedule Section with proper toggle
  const ScheduleSection = () => (
    <div className="lg:col-span-1 p-6 bg-white rounded-xl shadow-lg h-fit sticky top-4 overflow-hidden">
      {/* Schedule Header - Clickable for Collapse */}
      <div
        className="flex justify-between items-center cursor-pointer pb-2 mb-2"
        onClick={toggleScheduleCollapse}
      >
        <h2 className="text-xl font-bold text-blue-700 flex items-center">
          <CalendarOutlined className="ml-2" /> جدول وتوقيت الدورة
        </h2>
        <CaretDownOutlined
          className={`text-2xl text-blue-500 transition-transform duration-300 ${
            isScheduleCollapsed ? "-rotate-90" : "rotate-0"
          }`}
        />
      </div>

      {/* Schedule Form Content (Conditional Rendering) */}
      {!isScheduleCollapsed && (
        <div className="space-y-4 pt-2 border-t border-gray-100">
          <div>
            <label
              htmlFor="startDate"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              تاريخ البدء
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={schedule.startDate}
              onChange={handleScheduleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="endDate"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              تاريخ الانتهاء
            </label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={schedule.endDate}
              onChange={handleScheduleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="startTime"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              وقت البدء
            </label>
            <input
              type="time"
              id="startTime"
              name="startTime"
              value={schedule.startTime}
              onChange={handleScheduleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="endTime"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              وقت الانتهاء
            </label>
            <input
              type="time"
              id="endTime"
              name="endTime"
              value={schedule.endTime}
              onChange={handleScheduleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <p className="text-xs text-gray-500 mt-4 border-t pt-3">
            **ملاحظة:** سيتم تطبيق هذه الأوقات على جميع دروس هذه الدورة.
          </p>
        </div>
      )}
    </div>
  );

  const handleDeleteExam = (lessonId, examId) => {
    if (window.confirm("هل أنت متأكد من حذف هذا الاختبار؟")) {
      // Implement delete exam API call
      console.log("Delete exam:", examId, "from lesson:", lessonId);
    }
  };

  return (
    <div
      className="p-4 sm:p-8 bg-gradient-to-br from-gray-50 to-white min-h-screen"
      dir="rtl"
    >
      {/* Page Header */}
      <div className="max-w-6xl mx-auto mb-8 p-6 bg-white rounded-2xl shadow-xl border-b-4 border-blue-500">
        <h1 className="text-3xl font-extrabold text-gray-800">
          إدارة محتوى الدورة | المستوى الأساسي
        </h1>
        <p className="text-gray-600 mt-1">
          تنظيم المناهج، الدروس، والفيديوهات وتحديد جدول الدورة.
        </p>
      </div>

      {/* Main Grid Layout */}
      <div className="max-w-6xl mx-auto  gap-8">
        {/* Scheduling Panel */}
        {/* <ScheduleSection /> */}

        {/* Course Content Structure */}
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              هيكل المحتوى والمناهج
            </h2>
            <button
              onClick={() => setAddModalContent(true)}
              className="flex items-center px-4 py-2 text-white bg-green-600 rounded-lg shadow-md hover:bg-green-700 transition duration-150"
            >
              <PlusOutlined className="ml-2" /> إضافة محتوى رئيسي
            </button>
          </div>

          {/* Render all content sections */}
          {basicData.length > 0 ? (
            basicData.map((item) => (
              <ContentSection key={item.id} contentItem={item} />
            ))
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
      <AddRoundContent
        open={addModalContent}
        setOpen={setAddModalContent}
        id={id}
        type="lecture"
      />
      <EditRoundContent
        open={editModalContent}
        setOpen={setEditModalContent}
        id={id}
        rowData={rowData}
        setRowData={setRowData}
      />
      <DeleteRoundContent
        id={id}
        open={deleteModalContent}
        setOpen={setDeleteModalContent}
        rowData={rowData}
      />

      <AddLessonModal
        open={openAddLesson}
        setOpen={setOpenAddLesson}
        round_content_id={rowData?.id}
      />
      <DeleteLessonModal
        open={openDeleteLesson}
        setOpen={setOpenDeleteLesson}
        rowData={selectedLesson}
        setRowData={setSelectedLesson}
      />
      <EditLessonModal
        open={openEditLesson}
        setOpen={setOpenEditLesson}
        rowData={selectedLesson}
        setRowData={setSelectedLesson}
      />

      <AddVideoModal
        open={openAddVideo}
        setOpen={setOpenAddVideo}
        id={selectedLesson?.id}
      />

      <EditVideoModal
        open={openEditVideo}
        setOpen={setOpenEditVideo}
        rowData={selectedVideo}
        setRowData={setSelectedVideo}
        id={selectedLesson?.id}
      />

      <DeleteVideoModal
        open={openDeleteVideo}
        setOpen={setOpenDeleteVideo}
        rowData={selectedVideo}
        setRowData={setSelectedVideo}
      />
    </div>
  );
}
