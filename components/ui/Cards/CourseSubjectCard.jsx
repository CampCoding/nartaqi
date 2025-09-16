// "use client";

// import React, { useEffect, useMemo, useState, useCallback } from "react";
// import Card from "../../atoms/Card";
// import Badge from "../../atoms/Badge";
// import {
//   Calendar,
//   Users,
//   Mars,
//   Venus,
//   VenusAndMars,
//   Layers3,
//   HelpCircle,
//   MoreVertical,
//   Edit,
//   Delete,
//   Eye,
//   Star,            // ⬅️ NEW: for rating
//   Clock,           // used in imports already
//   Search,
//   X,
//   Book,
// } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";
// import Button from "../../atoms/Button";
// import { Dropdown, Button as AntdButton, Modal } from "antd";
// import '@ant-design/v5-patch-for-react-19';
// import { useRouter } from "next/navigation";

// const CourseSubjectCard = ({
//   subject,
//   setSelectedSubject,
//   fetchStudents,
//   setEditOpen,
//   setActivationModal,
//   setDeleteModal,
// }) => {
//   const [isStudentsOpen, setIsStudentsOpen] = useState(false);
//   const [studentsLoading, setStudentsLoading] = useState(false);
//   const [studentsError, setStudentsError] = useState("");
//   const router = useRouter();
//   const [students, setStudents] = useState(() =>
//     Array.isArray(subject?.enrolledStudents) ? subject.enrolledStudents : []
//   );
//   const [query, setQuery] = useState("");

//   /* ---------- Derived: enrolled/capacity ---------- */
//   const enrolledCount = useMemo(() => {
//     if (typeof subject?.students === "number") return subject.students;
//     if (Array.isArray(subject?.enrolledStudents))
//       return subject.enrolledStudents.length;
//     return 0;
//   }, [subject]);
//   const capacity =
//     typeof subject?.capacity === "number" ? subject.capacity : undefined;
//   const isCapped = typeof capacity === "number" && capacity > 0;
//   const clampedEnrolled = isCapped ? Math.min(enrolledCount, capacity) : enrolledCount;
//   const remaining = isCapped ? Math.max(capacity - enrolledCount, 0) : undefined;
//   const isFull = isCapped ? enrolledCount >= capacity : false;
//   const fillPct = isCapped ? Math.min((clampedEnrolled / capacity) * 100, 100) : 0;
//   const roundedFillPct = Math.round(fillPct * 100) / 100;

//   const capacityBarClass = !isCapped
//     ? "bg-gray-200"
//     : isFull
//     ? "bg-red-500"
//     : roundedFillPct >= 80
//     ? "bg-amber-500"
//     : "bg-emerald-500";

//   const getGenderMeta = (gp) => {
//     switch (gp) {
//       case "male":   return { label: "للذكور فقط",  color: "cyan",  Icon: Mars };
//       case "female": return { label: "للإناث فقط",   color: "pink",  Icon: Venus };
//       case "both":   return { label: "للجميع",       color: "green", Icon: VenusAndMars };
//       default: return null;
//     }
//   };
//   const genderMeta = getGenderMeta(subject?.genderPolicy);

//   /* ---------- Availability window ---------- */
//   const fmt = useMemo(
//     () => new Intl.DateTimeFormat("ar-EG", { dateStyle: "medium" }),
//     []
//   );
//   const startDate = useMemo(() => {
//     const s = subject?.availableFrom;
//     const d = s ? new Date(s) : null;
//     return d && !isNaN(d) ? d : null;
//   }, [subject?.availableFrom]);
//   const endDate = useMemo(() => {
//     const e = subject?.availableTo;
//     const d = e ? new Date(e) : null;
//     return d && !isNaN(d) ? d : null;
//   }, [subject?.availableTo]);

//   const now = new Date();
//   const hasStart = !!startDate;
//   const hasEnd = !!endDate;

//   const availabilityPhase = useMemo(() => {
//     if (hasStart && hasEnd) {
//       if (now < startDate) return "upcoming";
//       if (now > endDate)   return "ended";
//       return "ongoing";
//     }
//     if (hasStart && !hasEnd) return now < startDate ? "upcoming" : "ongoing";
//     if (!hasStart && hasEnd) return now <= endDate ? "ongoing" : "ended";
//     return "always";
//   }, [hasStart, hasEnd, now, startDate, endDate]);

//   const availabilityLabel = useMemo(() => {
//     if (availabilityPhase === "upcoming" && hasStart) return `يبدأ ${fmt.format(startDate)}`;
//     if (availabilityPhase === "ongoing"  && hasEnd)   return `ينتهي ${fmt.format(endDate)}`;
//     if (availabilityPhase === "ended")                return "منتهي";
//     if (hasStart && hasEnd) return `من ${fmt.format(startDate)} إلى ${fmt.format(endDate)}`;
//     return null;
//   }, [availabilityPhase, hasStart, hasEnd, startDate, endDate, fmt]);

//   // progress along window
//   const windowPct = useMemo(() => {
//     if (hasStart && hasEnd) {
//       const total = endDate.getTime() - startDate.getTime();
//       if (total <= 0) return 100;
//       if (now < startDate) return 0;
//       if (now > endDate)   return 100;
//       const elapsed = now.getTime() - startDate.getTime();
//       return Math.round(((elapsed / total) * 100) * 100) / 100;
//     }
//     return availabilityPhase === "ended" ? 100 : availabilityPhase === "upcoming" ? 0 : 100;
//   }, [hasStart, hasEnd, startDate, endDate, availabilityPhase, now]);

//   const windowBarClass =
//     availabilityPhase === "upcoming" ? "bg-gray-300"
//     : availabilityPhase === "ended" ? "bg-red-500"
//     : "bg-emerald-500";

//   /* ---------- NEW: Live countdown to start/end ---------- */
//   const targetDate =
//     availabilityPhase === "upcoming" ? startDate
//     : availabilityPhase === "ongoing" ? endDate
//     : null;

//   const [countdown, setCountdown] = useState(null);
//   useEffect(() => {
//     if (!targetDate) { setCountdown(null); return; }
//     const tick = () => {
//       const diff = Math.max(targetDate.getTime() - Date.now(), 0);
//       const d = Math.floor(diff / 86400000);
//       const h = Math.floor((diff % 86400000) / 3600000);
//       const m = Math.floor((diff % 3600000) / 60000);
//       const s = Math.floor((diff % 60000) / 1000);
//       setCountdown({ d, h, m, s });
//     };
//     tick();
//     const id = setInterval(tick, 1000);
//     return () => clearInterval(id);
//   }, [targetDate]);

//   /* ---------- Handlers ---------- */
//   const handleUnavailableClick = useCallback(() => {
//     let content = "هذه الدورة غير متاحة حاليًا.";
//     if (availabilityPhase === "upcoming" && hasStart) {
//       content = `تبدأ الدورة في ${fmt.format(startDate)}.`;
//     } else if (availabilityPhase === "ended") {
//       content = "تم انتهاء فترة إتاحة الدورة.";
//     }
//     Modal.info({ title: "غير متاح", content, okText: "حسنًا" });
//   }, [availabilityPhase, hasStart, startDate, fmt]);

//   const openStudents = useCallback(async () => {
//     setStudentsError("");
//     setIsStudentsOpen(true);
//     if (Array.isArray(subject?.enrolledStudents) && subject.enrolledStudents.length) {
//       setStudents(subject.enrolledStudents);
//       return;
//     }
//     if (typeof fetchStudents === "function") {
//       try {
//         setStudentsLoading(true);
//         const data = await fetchStudents(subject);
//         setStudents(Array.isArray(data) ? data : []);
//       } catch {
//         setStudentsError("حدث خطأ أثناء تحميل قائمة الطلاب. حاول مرة أخرى.");
//       } finally {
//         setStudentsLoading(false);
//       }
//     }
//   }, [fetchStudents, subject]);

//   useEffect(() => {
//     const onEsc = (e) => e.key === "Escape" && setIsStudentsOpen(false);
//     if (isStudentsOpen) document.addEventListener("keydown", onEsc);
//     return () => document.removeEventListener("keydown", onEsc);
//   }, [isStudentsOpen]);

//   const filtered = useMemo(() => {
//     const list = Array.isArray(students) ? students : [];
//     const q = (query || "").toLowerCase();
//     if (!q) return list;
//     return list.filter(
//       (s) =>
//         String(s?.name || "").toLowerCase().includes(q) ||
//         String(s?.email || "").toLowerCase().includes(q)
//     );
//   }, [students, query]);

//   const moreMenu = (subject) => ({
//     items: [
//       { key:"Details",  label:"تفاصيل", icon:<Eye className="w-4 h-4" /> },
//       ,
//       { key:"Students", label:"الطلاب",  icon:<Users className="w-4 h-4" /> },
//       { key:"edit",     label:"تعديل",  icon:<Edit className="w-4 h-4" /> },
//       { type:"divider" },
//       { key:"status",   label: subject.status === "نشط" ? "إلغاء التنشيط" : "تنشيط", icon:<Eye className="w-4 h-4" /> },
//       { type:"divider" },
//       { key:"delete",   label:"حذف", danger:true, icon:<Delete /> },
//     ],
//     onClick: ({ key }) => {
//       if (key === "Details")  router.push(`/subjects/${subject?.code}/units`);
//       if (key === "Students") router.push(`/teachers-courses/students/${subject?.code}`);
//       if (key === "edit")     { setSelectedSubject(subject); setEditOpen(true); }
//       if (key === "delete")   { setSelectedSubject(subject); setDeleteModal(true); }
//       if (key === "status")   { setSelectedSubject(subject); setActivationModal(true); }

//     },
//   });

//   const rating = typeof subject?.rating === "number" ? subject.rating : null;

//   /* ---------- UI ---------- */
//   return (
//     <>
//       <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} whileHover={{ scale: 1.05 }}>
//         <Card className="p-0 overflow-hidden hover:shadow-lg transition-all duration-300">
//           {/* Media header */}
//           <div className="relative h-40 w-full">
//             <img src={subject.imageUrl} alt={subject.name} className="h-full w-full object-cover" />
//             <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0" />

//             <div className="absolute top-2 left-2 flex flex-wrap items-center gap-2">
//               {genderMeta && (
//                 <Badge color={genderMeta.color} className="w-fit flex items-center gap-1 bg-white/90 backdrop-blur text-[#202938]">
//                   <genderMeta.Icon className="w-3.5 h-3.5" />
//                   {genderMeta.label}
//                 </Badge>
//               )}
//             </div>

//             <div className="absolute top-2 right-2">
//               <Badge className="w-fit bg-white/90 backdrop-blur text-[#202938]">
//                 {subject.status}
//               </Badge>
//             </div>
//           </div>

//           {/* ⬇️ NEW: info strip like the Figma (start/end, rating, remaining seats) */}
//           <div className="px-6 py-3 border-b bg-gray-50/60">
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-[13px] text-[#202938]">
//               <div className="flex items-center gap-2">
//                 <Calendar className="w-4 h-4 text-[#0F7490]" />
//                 <div className="truncate">
//                   <div className="text-gray-500">تاريخ البداية</div>
//                   <div className="font-semibold">{hasStart ? fmt.format(startDate) : "—"}</div>
//                 </div>
//               </div>
//               <div className="flex items-center gap-2">
//                 <Calendar className="w-4 h-4 text-[#0F7490]" />
//                 <div className="truncate">
//                   <div className="text-gray-500">تاريخ الانتهاء</div>
//                   <div className="font-semibold">{hasEnd ? fmt.format(endDate) : "—"}</div>
//                 </div>
//               </div>
//               <div className="flex items-center gap-2">
//                 <Star className="w-4 h-4 text-[#C9AE6C]" />
//                 <div>
//                   <div className="text-gray-500">التقييم</div>
//                   <div className="font-semibold">{rating !== null ? rating.toFixed(1) : "—"}</div>
//                 </div>
//               </div>
//               <div className="flex items-center gap-2">
//                 <Users className="w-4 h-4 text-[#0F7490]" />
//                 <div>
//                   <div className="text-gray-500">المقاعد</div>
//                   <div className="font-semibold">{isCapped ? remaining : "غير محدد"}</div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Body */}
//           <div className="p-6">
//             <h3 className="text-xl font-bold text-[#202938] mb-1">{subject.name}</h3>
//             <p className="text-sm text-[#202938]/80 mb-4 line-clamp-2">{subject.description}</p>

//             {/* Stats pills */}
//             <div className="grid grid-cols-3 gap-3 mb-4">
//               <div className="rounded-2xl border border-gray-100 bg-gray-50 p-3 text-center">
//                 <div className="flex items-center justify-center gap-1 text-[#0F7490]">
//                   <Layers3 className="w-4 h-4" />
//                   <span className="text-base font-bold">{subject?.units?.length || 0}</span>
//                 </div>
//                 <div className="text-[11px] text-[#202938]/60 mt-1">الوحدات</div>
//               </div>
//               <div className="rounded-2xl border border-gray-100 bg-gray-50 p-3 text-center">
//                 <div className="text-[#C9AE6C] text-base font-bold">
//                   {isCapped ? `${clampedEnrolled}/${capacity}` : enrolledCount}
//                 </div>
//                 <div className="text-[11px] text-[#202938]/60 mt-1">الطلاب</div>
//               </div>
//               <div className="rounded-2xl border border-gray-100 bg-gray-50 p-3 text-center">
//                 <div className="text-[#8B5CF6] text-base font-bold">{subject.questions}</div>
//                 <div className="text-[11px] text-[#202938]/60 mt-1">الأسئلة</div>
//               </div>
//             </div>

//             {/* ⬇️ NEW: countdown like the shot (days / hours / minutes / seconds) */}
//             {countdown && (
//               <div className="mb-4 rounded-2xl border bg-white p-3">
//                 <div className="text-xs text-gray-600 mb-2 flex items-center gap-1">
//                   <Clock className="w-4 h-4" />
//                   {availabilityPhase === "upcoming" ? "يبدأ بعد:" :
//                    availabilityPhase === "ongoing"  ? "ينتهي بعد:" : "—"}
//                 </div>
//                 <div className="grid grid-cols-4 gap-3 text-center">
//                   {[
//                     { label: "الأيام",   val: countdown.d },
//                     { label: "الساعات",  val: countdown.h },
//                     { label: "الدقائق",  val: countdown.m },
//                     { label: "ثواني",    val: countdown.s },
//                   ].map((b) => (
//                     <div key={b.label} className="rounded-xl bg-gray-50 border p-3">
//                       <div className="text-[#0F7490] font-bold text-lg">
//                         {String(b.val).padStart(2, "0")}
//                       </div>
//                       <div className="text-[11px] text-gray-600 mt-1">{b.label}</div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Availability timeline */}
//             {(hasStart || hasEnd) && (
//               <div className="mb-4">
//                 <div className="flex items-center justify-between text-xs text-[#202938]/70 mb-1">
//                   <span>{hasStart ? fmt.format(startDate) : "—"}</span>
//                   <span className="font-medium">
//                     {availabilityPhase === "upcoming" && hasStart ? "لم يبدأ بعد" :
//                      availabilityPhase === "ongoing"  && hasEnd   ? "قيد الإتاحة"  :
//                      availabilityPhase === "ended"                  ? "انتهى"        : ""}
//                   </span>
//                   <span>{hasEnd ? fmt.format(endDate) : "—"}</span>
//                 </div>
//                 <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
//                   <div
//                     className={`h-full ${windowBarClass} transition-all`}
//                     style={{ width: `${windowPct}%` }}
//                     aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(windowPct)}
//                     role="progressbar"
//                   />
//                 </div>
//               </div>
//             )}

//             {/* Capacity progress */}
//             {isCapped && (
//               <div className="mb-4">
//                 <div className="flex items-center justify-between text-xs text-[#202938]/70 mb-1">
//                   <span>0</span>
//                   <span className="font-medium">
//                     {isFull ? "مكتمل" : remaining <= 5 ? `متبقي ${remaining} مقاعد` : "متاح للتسجيل"}
//                   </span>
//                   <span>{capacity}</span>
//                 </div>
//                 <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
//                   <div
//                     className={`h-full ${capacityBarClass} transition-all`}
//                     style={{ width: `${roundedFillPct}%` }}
//                     aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(roundedFillPct)}
//                     role="progressbar"
//                   />
//                 </div>
//               </div>
//             )}

//             {/* Footer actions (price + menu + students) */}
//             <div className="flex items-center justify-between pt-4 border-t border-gray-100">
//               <div className="flex items-center w-full justify-between gap-2">
//                 <div className="flex items-center gap-3">
//                   <Button
//                     onClick={(e) => { e.preventDefault(); openStudents(); }}
//                     type="text" size="small"
//                     className={`flex items-center gap-1 ${isFull ? "text-gray-400 cursor-not-allowed" : "text-green-600 hover:bg-green-50"}`}
//                     aria-label="عرض الطلاب المسجلين"
//                   >
//                     <Users className="w-4 h-4" />
//                     <span className="hidden sm:inline">الطلاب</span>
//                   </Button>

//                   {/* Price */}
//                   <h4 className="text-primary text-xl font-bold">
//                     <span className="font-mono">{subject.price}</span> ر.س
//                   </h4>
//                 </div>

//                 <div onClick={(e) => e.preventDefault()}>
//                   <Dropdown trigger={["click"]} placement="bottomRight" menu={moreMenu(subject)}>
//                     <AntdButton className="rounded-lg" icon={<MoreVertical />} />
//                   </Dropdown>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </Card>
//       </motion.div>

//       {/* Students Modal (unchanged) */}
//       <AnimatePresence>
//         {isStudentsOpen && (
//           <motion.div className="fixed inset-0 z-50 flex items-center justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
//             <div className="absolute inset-0 bg-black/40" onClick={() => setIsStudentsOpen(false)} />
//             <motion.div role="dialog" aria-modal="true" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }} transition={{ type: "spring", stiffness: 260, damping: 22 }} className="relative bg-white w-full max-w-2xl rounded-2xl shadow-xl p-4 sm:p-6">
//               <div className="flex items-center justify-between mb-4">
//                 <h4 className="text-lg font-bold text-[#202938]">الطلاب المسجلون — {subject.name}</h4>
//                 <button onClick={() => setIsStudentsOpen(false)} className="p-2 rounded-lg hover:bg-gray-100" aria-label="إغلاق">
//                   <X className="w-5 h-5" />
//                 </button>
//               </div>

//               {isCapped && (
//                 <div className={`mb-3 rounded-xl border p-3 text-sm ${isFull ? "border-red-200 bg-red-50 text-red-800" : remaining <= 5 ? "border-amber-200 bg-amber-50 text-amber-900" : "border-emerald-200 bg-emerald-50 text-emerald-900"}`}>
//                   السعة: {clampedEnrolled} / {capacity}
//                   {isFull ? " — مكتمل، لا توجد مقاعد متاحة." : ` — متبقي ${remaining} مقعد.`}
//                 </div>
//               )}

//               <div className="mb-4">
//                 <div className="flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2">
//                   <Search className="w-4 h-4 text-gray-500" />
//                   <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="ابحث بالاسم أو البريد…" className="w-full outline-none text-sm" />
//                 </div>
//               </div>

//               {studentsLoading && (<><SkeletonRow /><SkeletonRow /><SkeletonRow /></>)}
//               {!!studentsError && (<p className="text-sm text-red-600 flex items-center gap-2"><HelpCircle className="w-4 h-4" /> {studentsError}</p>)}

//               {!studentsLoading && !studentsError && (Array.isArray(filtered) && filtered.length > 0 ? (
//                 <div className="max-h-[50vh] overflow-auto rounded-xl border border-gray-100">
//                   <table className="w-full text-sm">
//                     <thead className="bg-gray-50 sticky top-0">
//                       <tr>
//                         <th className="text-right p-3 font-semibold text-gray-700">الاسم</th>
//                         <th className="text-right p-3 font-semibold text-gray-700">البريد</th>
//                         <th className="text-right p-3 font-semibold text-gray-700">تاريخ التسجيل</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {filtered.map((s) => (
//                         <tr key={s.id ?? `${s.name}-${s.email}`} className="border-t border-gray-50 hover:bg-gray-50">
//                           <td className="p-3">{s.name || "—"}</td>
//                           <td className="p-3">{s.email || "—"}</td>
//                           <td className="p-3">{s.joinedAt || "—"}</td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               ) : (
//                 <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-900 flex items-center gap-2">
//                   <HelpCircle className="w-4 h-4" />
//                   لا توجد بيانات طلاب لعرضها حاليًا.
//                 </div>
//               ))}

//               <div className="mt-4 flex justify-end gap-2">
//                 <Button type="default" onClick={() => setIsStudentsOpen(false)} className="px-4">إغلاق</Button>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </>
//   );
// };

// const SkeletonRow = () => <div className="h-10 w-full animate-pulse rounded-lg bg-gray-100" />;

// export default CourseSubjectCard;

"use client";
import {
  FileTextIcon,
  ShareIcon,
  Edit,
  Trash2,
  MoreVertical,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const CourseCard = ({
  freeWidth = false,
  type = "students",
  buttonStyle = "normal",
  onEdit,
  onDelete,
  showActions = true,
  subject,
  course = {
    title: "إتقان التدريس الفعال",
    description:
      "تعرف على المبادئ الأساسية والاستراتيجيات العملية لتصبح معلمًا واثقًا ومؤثرًا.",
    category: "مهارات التعليم والتدريس",
    startDate: "15 فبراير 2024",
    seats: 35,
    rating: 4.5,
    reviews: 32,
    instructor: "جون سميث",
    image: "/images/teacher-course-banner.png",
    instructorImage: "/images/Image-24.png",
  },
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const width = freeWidth ? "w-full" : "w-[351px]";

  useEffect(() => {
    console.log(subject);
  }, [subject]);

  const handleEdit = (id) => {
    console.log(id);
    router.push(`/teachers-courses/edit/${id}`)
    setShowDropdown(false);
    if (onEdit) onEdit(course);
  };

  const handleDelete = () => {
    setShowDropdown(false);
    if (onDelete) onDelete(course);
  };

  const router = useRouter();

  return (
    <div
      className={`${width} rounded-[30px] p-[2px] bg-gradient-to-b from-[#3B82F6] to-[#F97316] relative`}
    >
      {/* Action Buttons - Top Right Corner */}
      {showActions && (
        <div className="absolute top-4 left-4 z-10">
          {buttonStyle === "dropdown" ? (
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-lg shadow-md flex items-center justify-center hover:bg-white transition-colors"
              >
                <MoreVertical size={16} className="text-gray-600" />
              </button>

              {showDropdown && (
                <div className="absolute top-10 right-0 bg-white rounded-lg shadow-lg border py-1 min-w-[120px] z-20">
                  <button
                    onClick={() => handleEdit(subject?.code)}
                    className="w-full px-3 py-2 text-right text-sm hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Edit size={14} className="text-blue-600" />
                    <span>تعديل</span>
                  </button>
                  <button
                    onClick={handleDelete}
                    className="w-full px-3 py-2 text-right text-sm hover:bg-gray-50 flex items-center gap-2 text-red-600"
                  >
                    <Trash2 size={14} />
                    <span>حذف</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(subject?.code)}
                className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-lg shadow-md flex items-center justify-center hover:bg-white transition-colors group"
                title="تعديل الدورة"
              >
                <Edit
                  size={14}
                  className="text-blue-600 group-hover:text-blue-700"
                />
              </button>
              <button
                onClick={handleDelete}
                className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-lg shadow-md flex items-center justify-center hover:bg-white transition-colors group"
                title="حذف الدورة"
              >
                <Trash2
                  size={14}
                  className="text-red-600 group-hover:text-red-700"
                />
              </button>
            </div>
          )}
        </div>
      )}

      <div
        onClick={() => router.push(`/subjects/${subject?.code}/units`)}
        className="bg-white cursor-pointer pb-8 h-full rounded-[28px] shadow-[0px_4px_20px_0px_rgba(0,0,0,0.25)] flex flex-col justify-start items-start gap-2"
      >
        <div
          className="self-stretch h-48 cursor-pointer pt-[24px] px-[16px] relative bg-black/25 rounded-tl-[20px] rounded-tr-[20px] overflow-hidden"
          style={{
            backgroundImage: `url('${subject?.imageUrl}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="px-4 py-2 cursor-pointer absolute top-4 right-4 bg-blue-500 rounded-[10px] inline-flex items-center gap-[7px]">
            <div className="justify-center cursor-pointer text-white text-[10px] font-medium">
              يبدأ: {subject?.date}
            </div>

            <div className="justify-center cursor-pointer text-white text-[10px] font-medium">
              ينتهي: {subject?.lastUpdated}
            </div>
          </div>
          <div className="w-8 h-8 p-2 left-[16px] top-[24px] absolute opacity-0 bg-white rounded-[10px] outline outline-1 outline-offset-[-1px] outline-zinc-500 inline-flex flex-col justify-start items-start gap-2.5 overflow-hidden">
            <div className="w-3.5 h-3 left-[9px] top-[10px] absolute bg-red-500" />
          </div>
        </div>

        <div className="self-stretch px-3 flex flex-col justify-start items-start gap-1">
          <div className="self-stretch cursor-pointer text-right justify-center text-text text-base font-bold">
            {subject?.name}
          </div>
          <div className="self-stretch cursor-pointer  w-[250px] truncate text-right justify-center text-zinc-600 text-sm font-normal">
            {subject?.description}
          </div>
        </div>

        <div className="text-black self-stretch p-3 flex flex-col justify-start items-start gap-3">
          <div className="self-stretch inline-flex justify-between items-center">
            <div className="px-2.5 py-3 bg-blue-200 rounded-[10px] flex justify-center items-center gap-2.5">
              <div className="justify-center text-text text-xs font-medium">
                {course?.category}
              </div>
            </div>
            <div className="px-9 py-2 bg-blue-500/25 rounded-[10px] outline outline-1 outline-offset-[-1px] outline-zinc-500 flex justify-center items-center gap-2.5">
              <div className="justify-center text-zinc-600 text-xs font-medium">
                {type === "students" ? "طلاب" : "معلمين"}
              </div>
            </div>
          </div>

          <div className="text-black self-stretch inline-flex justify-between items-center">
            <div className="flex justify-start items-center gap-[5px]">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_966_3515)">
                  <path
                    opacity="0.933"
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M23.9766 12.3516C23.9766 12.7891 23.9766 13.2266 23.9766 13.6641C23.8601 14.007 23.6257 14.2336 23.2734 14.3438C22.5861 14.3672 21.8986 14.375 21.2109 14.3672C21.2109 15.4297 21.2109 16.4922 21.2109 17.5547C21.9142 17.5469 22.6174 17.5547 23.3203 17.5781C23.5073 17.7635 23.5073 17.951 23.3203 18.1406C15.7578 18.1719 8.1953 18.1719 0.632812 18.1406C0.445817 17.951 0.445817 17.7635 0.632812 17.5781C1.33576 17.5547 2.03889 17.5469 2.74219 17.5547C2.74219 16.4922 2.74219 15.4297 2.74219 14.3672C2.02111 14.3868 1.30237 14.3634 0.585938 14.2969C0.291919 14.1669 0.0887944 13.956 -0.0234375 13.6641C-0.0234375 13.2422 -0.0234375 12.8203 -0.0234375 12.3984C0.0145043 12.353 0.0613795 12.314 0.117188 12.2813C0.24122 12.258 0.36622 12.2501 0.492188 12.2578C0.484378 10.789 0.492188 9.32026 0.515625 7.85157C0.646303 6.70525 1.27912 6.02556 2.41406 5.81251C3.21094 5.78125 4.00781 5.78125 4.80469 5.81251C5.9182 6.01979 6.55102 6.68382 6.70312 7.8047C6.72656 9.289 6.73439 10.7734 6.72656 12.2578C6.90267 12.2377 7.06673 12.2689 7.21875 12.3516C7.28011 12.5656 7.30355 12.7844 7.28906 13.0078C7.6328 13.0078 7.97658 13.0078 8.32031 13.0078C8.30255 12.783 8.32598 12.5642 8.39062 12.3516C8.41406 12.3281 8.4375 12.3047 8.46094 12.2813C8.60072 12.2579 8.74134 12.2501 8.88281 12.2578C8.87498 10.7421 8.88281 9.22651 8.90625 7.71095C9.08592 6.625 9.71873 5.99218 10.8047 5.81251C11.6016 5.78125 12.3984 5.78125 13.1953 5.81251C14.3737 6.03779 15.0066 6.74875 15.0938 7.94532C15.1172 9.38275 15.125 10.8203 15.1172 12.2578C15.2431 12.2501 15.3682 12.258 15.4922 12.2813C15.5301 12.2957 15.5613 12.3191 15.5859 12.3516C15.6301 12.5672 15.6458 12.786 15.6328 13.0078C15.9922 13.0078 16.3515 13.0078 16.7109 13.0078C16.7032 12.8041 16.711 12.601 16.7344 12.3984C16.7734 12.3594 16.8125 12.3203 16.8516 12.2813C16.9913 12.2579 17.132 12.2501 17.2734 12.2578C17.2656 10.6952 17.2734 9.13276 17.2969 7.57032C17.5192 6.56673 18.1364 5.98079 19.1484 5.81251C19.9453 5.78125 20.7422 5.78125 21.5391 5.81251C22.598 5.96514 23.2308 6.56668 23.4375 7.6172C23.4609 9.16398 23.4688 10.7109 23.4609 12.2578C23.6478 12.2349 23.8197 12.2661 23.9766 12.3516ZM2.64844 6.39845C3.40026 6.3804 4.15026 6.40384 4.89844 6.46876C5.49961 6.6324 5.88239 7.01523 6.04688 7.6172C6.07031 9.16398 6.07814 10.7109 6.07031 12.2578C4.42969 12.2578 2.78906 12.2578 1.14844 12.2578C1.12629 10.6618 1.14973 9.06803 1.21875 7.47657C1.48882 6.83884 1.96538 6.4795 2.64844 6.39845ZM10.9922 6.39845C11.7596 6.38026 12.5252 6.4037 13.2891 6.46876C13.9097 6.63639 14.2926 7.03482 14.4375 7.66407C14.4609 9.19525 14.4688 10.7265 14.4609 12.2578C12.8047 12.2578 11.1484 12.2578 9.49219 12.2578C9.48436 10.8203 9.49219 9.38275 9.51562 7.94532C9.61983 7.05217 10.112 6.53654 10.9922 6.39845ZM19.3828 6.39845C20.1502 6.38026 20.9159 6.4037 21.6797 6.46876C22.3314 6.68298 22.7142 7.12829 22.8281 7.8047C22.8516 9.289 22.8594 10.7734 22.8516 12.2578C21.1953 12.2578 19.539 12.2578 17.8828 12.2578C17.875 10.7734 17.8828 9.289 17.9062 7.8047C17.9754 7.23582 18.2644 6.82173 18.7734 6.56251C18.9778 6.48831 19.181 6.43361 19.3828 6.39845ZM0.632812 12.9141C2.64844 12.9141 4.66406 12.9141 6.67969 12.9141C6.68747 13.1334 6.67964 13.3521 6.65625 13.5703C6.59934 13.6429 6.52903 13.6976 6.44531 13.7344C4.58594 13.7657 2.72656 13.7657 0.867188 13.7344C0.783469 13.6976 0.713156 13.6429 0.65625 13.5703C0.63285 13.3521 0.625041 13.1334 0.632812 12.9141ZM8.97656 12.9141C10.9922 12.9141 13.0078 12.9141 15.0234 12.9141C15.0462 13.1578 15.015 13.3922 14.9297 13.6172C14.8751 13.668 14.8126 13.7071 14.7422 13.7344C12.8985 13.7657 11.0547 13.7657 9.21094 13.7344C9.10936 13.6953 9.03905 13.625 9 13.5234C8.97661 13.3209 8.96878 13.1178 8.97656 12.9141ZM17.3672 12.9141C19.3984 12.9141 21.4297 12.9141 23.4609 12.9141C23.534 13.2677 23.4246 13.5412 23.1328 13.7344C21.3047 13.7657 19.4766 13.7657 17.6484 13.7344C17.5341 13.6981 17.4481 13.6278 17.3906 13.5234C17.3672 13.3209 17.3594 13.1178 17.3672 12.9141ZM7.24219 13.6172C7.6185 13.6017 7.9935 13.6173 8.36719 13.6641C8.45138 14.0217 8.67014 14.2482 9.02344 14.3438C9.72637 14.3672 10.4295 14.375 11.1328 14.3672C11.1328 15.4297 11.1328 16.4922 11.1328 17.5547C8.91408 17.5547 6.6953 17.5547 4.47656 17.5547C4.47656 16.4922 4.47656 15.4297 4.47656 14.3672C5.17987 14.375 5.883 14.3672 6.58594 14.3438C6.92883 14.2119 7.14759 13.9697 7.24219 13.6172ZM15.6328 13.6172C16.0078 13.6172 16.3828 13.6172 16.7578 13.6172C16.8187 13.9985 17.0374 14.2407 17.4141 14.3438C18.1014 14.3672 18.7889 14.375 19.4766 14.3672C19.4766 15.4297 19.4766 16.4922 19.4766 17.5547C17.2734 17.5547 15.0703 17.5547 12.8672 17.5547C12.8672 16.4922 12.8672 15.4297 12.8672 14.3672C13.5548 14.375 14.2424 14.3672 14.9297 14.3438C15.2996 14.2316 15.534 13.9895 15.6328 13.6172ZM3.39844 14.3672C3.55469 14.3672 3.71094 14.3672 3.86719 14.3672C3.86719 15.4297 3.86719 16.4922 3.86719 17.5547C3.71094 17.5547 3.55469 17.5547 3.39844 17.5547C3.39844 16.4922 3.39844 15.4297 3.39844 14.3672ZM11.7891 14.3672C11.9297 14.3672 12.0703 14.3672 12.2109 14.3672C12.2109 15.4297 12.2109 16.4922 12.2109 17.5547C12.0703 17.5547 11.9297 17.5547 11.7891 17.5547C11.7891 16.4922 11.7891 15.4297 11.7891 14.3672ZM20.1328 14.3672C20.289 14.3672 20.4453 14.3672 20.6016 14.3672C20.6016 15.4297 20.6016 16.4922 20.6016 17.5547C20.4453 17.5547 20.289 17.5547 20.1328 17.5547C20.1328 16.4922 20.1328 15.4297 20.1328 14.3672Z"
                    fill="#20478D"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_966_3515">
                    <rect width="24" height="24" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              <div className="justify-center text-text text-xs font-medium text-black">
                المقاعد : {subject?.capacity}
              </div>
            </div>
          </div>

          <div className="text-black self-stretch inline-flex justify-between items-center">
            <div className="h-9 flex justify-center items-center gap-1">
              <div className="flex justify-start items-center gap-0.5">
                <div className="justify-center text-text text-[10px] font-medium">
                  {course.rating}
                </div>
                <div className="w-3 h-3 relative overflow-hidden">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M6 0L7.854 4.146L12 4.854L8.854 7.854L9.708 12L6 10.146L2.292 12L3.146 7.854L0 4.854L4.146 4.146L6 0Z"
                      fill="#FFD700"
                    />
                  </svg>
                </div>
              </div>
              <div className="justify-center text-text text-[10px] font-medium">
                ({course.reviews} تقييمًا)
              </div>
            </div>
            <div className="flex justify-start items-center gap-[5px]">
              <img
                className="w-6 h-6 relative rounded-xl"
                src={course.instructorImage}
                alt="instructor"
              />
              <div className="justify-center text-text text-[10px] font-medium">
                المدرس: {course.instructor}
              </div>
            </div>
          </div>

          <div className="flex gap-2 items-center">
            <p className="text-primary text-xl font-bold">السعر :</p>
            <h4 className="text-primary text-xl font-bold">
              <span className="font-mono">{subject?.price}</span> ر.س
            </h4>
          </div>
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-5"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
};

export default CourseCard;
