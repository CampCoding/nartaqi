"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import Card from "../../atoms/Card";
import Badge from "../../atoms/Badge";
import {
  Calendar,
  Edit3,
  Trash2,
  Clock,
  Tag as TagIcon,
  Users,
  X,
  Search,
  Mars,
  Venus,
  VenusAndMars,
  Layers3,
  HelpCircle,
  MoreVertical,
  Edit,
  Delete,
  Eye,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../../atoms/Button";
import PreserveSubjectLink from "../../PreserveSubjectLink";
import { Dropdown, Button as AntdButton, Modal } from "antd";
import '@ant-design/v5-patch-for-react-19';
import Link from "next/link";
import { useRouter } from "next/navigation";

const TeacherSubjectCard = ({
  subject,
  setSelectedSubject,
  fetchStudents,
  setEditOpen,
  setActivationModal,
  setDeleteModal,
}) => {
  // ---------- Local state ----------
  const [isStudentsOpen, setIsStudentsOpen] = useState(false);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [studentsError, setStudentsError] = useState("");
  const router = useRouter();
  const [students, setStudents] = useState(() =>
    Array.isArray(subject?.enrolledStudents) ? subject.enrolledStudents : []
  );
  const [query, setQuery] = useState("");

  // ---------- Derived data ----------
  const enrolledCount = useMemo(() => {
    if (typeof subject?.students === "number") return subject.students;
    if (Array.isArray(subject?.enrolledStudents))
      return subject.enrolledStudents.length;
    return 0;
  }, [subject]);

  const capacity =
    typeof subject?.capacity === "number" ? subject.capacity : undefined;
  const isCapped = typeof capacity === "number" && capacity > 0;
  const clampedEnrolled = isCapped
    ? Math.min(enrolledCount, capacity)
    : enrolledCount;
  const remaining = isCapped
    ? Math.max(capacity - enrolledCount, 0)
    : undefined;
  const isFull = isCapped ? enrolledCount >= capacity : false;
  const fillPct = isCapped
    ? Math.min((clampedEnrolled / capacity) * 100, 100)
    : 0;

  // Round to 2 decimal places for hydration consistency
  const roundedFillPct = Math.round(fillPct * 100) / 100;

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "blue";
      case "draft":
        return "purple";
      case "archived":
        return "default";
      default:
        return "default";
    }
  };

  const getGenderMeta = (gp) => {
    switch (gp) {
      case "male":
        return { label: "للذكور فقط", color: "cyan", Icon: Mars };
      case "female":
        return { label: "للإناث فقط", color: "pink", Icon: Venus };
      case "both":
        return { label: "للجميع", color: "green", Icon: VenusAndMars };
      default:
        return null;
    }
  };

  const genderMeta = getGenderMeta(subject?.genderPolicy);

  const capacityBarClass = !isCapped
    ? "bg-gray-200"
    : isFull
    ? "bg-red-500"
    : roundedFillPct >= 80
    ? "bg-amber-500"
    : "bg-emerald-500";

  // ---------- Availability (new) ----------
  const fmt = useMemo(
    () => new Intl.DateTimeFormat("ar-EG", { dateStyle: "medium" }),
    []
  );

  const startDate = useMemo(() => {
    const s = subject?.availableFrom;
    const d = s ? new Date(s) : null;
    return d && !isNaN(d) ? d : null;
  }, [subject?.availableFrom]);

  const endDate = useMemo(() => {
    const e = subject?.availableTo;
    const d = e ? new Date(e) : null;
    return d && !isNaN(d) ? d : null;
  }, [subject?.availableTo]);

  const now = new Date();
  const hasStart = !!startDate;
  const hasEnd = !!endDate;

  const availabilityPhase = useMemo(() => {
    if (hasStart && hasEnd) {
      if (now < startDate) return "upcoming";
      if (now > endDate) return "ended";
      return "ongoing";
    }
    if (hasStart && !hasEnd) {
      return now < startDate ? "upcoming" : "ongoing";
    }
    if (!hasStart && hasEnd) {
      return now <= endDate ? "ongoing" : "ended";
    }
    return "always"; // لا يوجد نافذة محددة
  }, [hasStart, hasEnd, now, startDate, endDate]);

  const availabilityLabel = useMemo(() => {
    if (availabilityPhase === "upcoming" && hasStart)
      return `يبدأ ${fmt.format(startDate)}`;
    if (availabilityPhase === "ongoing" && hasEnd)
      return `ينتهي ${fmt.format(endDate)}`;
    if (availabilityPhase === "ended") return "منتهي";
    if (hasStart && hasEnd)
      return `من ${fmt.format(startDate)} إلى ${fmt.format(endDate)}`;
    return null;
  }, [availabilityPhase, hasStart, hasEnd, startDate, endDate, fmt]);

  const daysDiff = (a, b) =>
    Math.ceil((a.getTime() - b.getTime()) / (1000 * 60 * 60 * 24));
  const daysToStart = hasStart ? Math.max(daysDiff(startDate, now), 0) : null;
  const daysToEnd = hasEnd ? Math.max(daysDiff(endDate, now), 0) : null;

  const windowPct = useMemo(() => {
    if (hasStart && hasEnd) {
      const total = endDate.getTime() - startDate.getTime();
      if (total <= 0) return 100;
      if (availabilityPhase === "upcoming") return 0;
      if (availabilityPhase === "ended") return 100;
      const elapsed = now.getTime() - startDate.getTime();
      const calculatedPct = (elapsed / total) * 100;
      // Round to 2 decimal places for hydration consistency
      return Math.round(calculatedPct * 100) / 100;
    }
    return availabilityPhase === "ended"
      ? 100
      : availabilityPhase === "upcoming"
      ? 0
      : 100;
  }, [hasStart, hasEnd, startDate, endDate, availabilityPhase, now]);

  const windowBarClass =
    availabilityPhase === "upcoming"
      ? "bg-gray-300"
      : availabilityPhase === "ended"
      ? "bg-red-500"
      : "bg-emerald-500";

  const isAvailableNow =
    availabilityPhase === "always" || availabilityPhase === "ongoing";

  const handleUnavailableClick = useCallback(() => {
    let content = "هذه الدورة غير متاحة حاليًا.";
    if (availabilityPhase === "upcoming" && hasStart) {
      content = `تبدأ الدورة في ${fmt.format(startDate)}${
        daysToStart
          ? ` (بعد ${daysToStart} يوم${daysToStart === 1 ? "" : "ًا"})`
          : ""
      }.`;
    } else if (availabilityPhase === "ended") {
      content = "تم انتهاء فترة إتاحة الدورة.";
    }
    Modal.info({
      title: "غير متاح",
      content,
      okText: "حسنًا",
    });
  }, [availabilityPhase, hasStart, startDate, fmt, daysToStart]);

  // ---------- Handlers ----------
  const openStudents = useCallback(async () => {
    setStudentsError("");
    setIsStudentsOpen(true);

    if (
      Array.isArray(subject?.enrolledStudents) &&
      subject.enrolledStudents.length
    ) {
      setStudents(subject.enrolledStudents);
      return;
    }

    if (typeof fetchStudents === "function") {
      try {
        setStudentsLoading(true);
        const data = await fetchStudents(subject);
        setStudents(Array.isArray(data) ? data : []);
      } catch (e) {
        setStudentsError("حدث خطأ أثناء تحميل قائمة الطلاب. حاول مرة أخرى.");
      } finally {
        setStudentsLoading(false);
      }
    }
  }, [fetchStudents, subject]);

  useEffect(() => {
    const onEsc = (e) => {
      if (e.key === "Escape") setIsStudentsOpen(false);
    };
    if (isStudentsOpen) document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [isStudentsOpen]);

  const filtered = useMemo(() => {
    const list = Array.isArray(students) ? students : [];
    const q = (query || "").toLowerCase();
    if (!q) return list;
    return list.filter(
      (s) =>
        String(s?.name || "")
          .toLowerCase()
          .includes(q) ||
        String(s?.email || "")
          .toLowerCase()
          .includes(q)
    );
  }, [students, query]);

  const moreMenu = (subject) => ({
    items: [
      {key:"Details" , label:"تفاصيل" , icon : <Eye className="w-4 h-4" />},
      {key :"Students", label:"الطلاب" ,icon : <Users className="w-4 h-4"/>},
      { key: "edit", icon: <Edit className="w-4 h-4" />, label: "تعديل" },
      {
        key: "status",
        icon: <Eye className="w-4 h-4" />,
        label: subject.status === "نشط" ? "إلغاء التنشيط" : "تنشيط",
      },
      { type: "divider" },
      { key: "delete", danger: true, icon: <Delete />, label: "حذف" },
    ],
    onClick: ({ key }) => {
      if(key ==  "Details") {
        router.push(`/teachers-courses/${subject?.id}`)
      }
      if (key === "edit") {
        setSelectedSubject(subject);
        setEditOpen(true);
      }
      if (key === "delete") {
        setSelectedSubject(subject);
        setDeleteModal(true);
      }
      if (key === "status") {
        setActivationModal(true);
        setSelectedSubject(subject);
      }
      if (key == "Students") {
        router.push(`/teachers-courses/students/${subject?.code}`)
      }
    },
  });

  // ---------- UI ----------
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        whileHover={{ scale: 1.05 }}
      >
        <Card className="p-0 overflow-hidden hover:shadow-lg transition-all duration-300">
          {/* Media header */}
          <div className="relative h-40 w-full">
            <img
              src={subject.imageUrl}
              alt={subject.name}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0" />

            <div className="absolute top-2 left-2 flex flex-wrap items-center gap-2">
              {genderMeta && (
                <Badge
                  color={genderMeta.color}
                  className="w-fit flex items-center gap-1 whitespace-nowrap bg-white/90 backdrop-blur text-[#202938]"
                >
                  <genderMeta.Icon className="w-3.5 h-3.5" />
                  {genderMeta.label}
                </Badge>
              )}

              {isCapped &&
                (isFull ? (
                  <Badge
                    color="red"
                    className="w-fit bg-white/90 backdrop-blur text-[#202938]"
                  >
                    مكتمل
                  </Badge>
                ) : remaining <= 5 ? (
                  <Badge
                    color="orange"
                    className="w-fit bg-white/90 backdrop-blur text-[#202938]"
                  >
                    متبقي {remaining} مقعد
                  </Badge>
                ) : (
                  <Badge
                    color="green"
                    className="w-fit bg-white/90 backdrop-blur text-[#202938]"
                  >
                    متاح للتسجيل
                  </Badge>
                ))}

              {/* شارة الإتاحة */}
              {(hasStart || hasEnd) && availabilityLabel && (
                <Badge className="w-fit bg-white/90 backdrop-blur text-[#202938] flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {availabilityLabel}
                </Badge>
              )}
            </div>

            <div className="absolute top-2 right-2">
              <Badge
                color={getStatusColor(subject.status)}
                className="w-fit bg-white/90 backdrop-blur text-[#202938]"
              >
                {subject.status}
              </Badge>
            </div>
          </div>

          {/* Body */}
          <div className="p-6">
            <h3 className="text-xl font-bold text-[#202938] mb-1">
              {subject.name}
            </h3>
            <p className="text-sm text-[#202938]/80 mb-4 line-clamp-2">
              {subject.description}
            </p>

            {/* Stats pills */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-3 text-center">
                <div className="flex items-center justify-center gap-1 text-[#0F7490]">
                  <Layers3 className="w-4 h-4" />
                  <span className="text-base font-bold">
                    {subject?.units?.length || 0}
                  </span>
                </div>
                <div className="text-[11px] text-[#202938]/60 mt-1">
                  الوحدات
                </div>
              </div>
              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-3 text-center">
                <div className="text-[#C9AE6C] text-base font-bold">
                  {isCapped ? `${clampedEnrolled}/${capacity}` : enrolledCount}
                </div>
                <div className="text-[11px] text-[#202938]/60 mt-1">الطلاب</div>
              </div>
              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-3 text-center">
                <div className="text-[#8B5CF6] text-base font-bold">
                  {subject.questions}
                </div>
                <div className="text-[11px] text-[#202938]/60 mt-1">
                  الأسئلة
                </div>
              </div>
            </div>

            {/* Availability timeline */}
            {(hasStart || hasEnd) && (
              <div className="mb-4">
                <div className="flex items-center justify-between text-xs text-[#202938]/70 mb-1">
                  <span>{hasStart ? fmt.format(startDate) : "—"}</span>
                  <span className="font-medium">
                    {availabilityPhase === "upcoming" && hasStart
                      ? `يبدأ بعد ${daysToStart} يوم`
                      : availabilityPhase === "ongoing" && hasEnd
                      ? `ينتهي بعد ${daysToEnd} يوم`
                      : availabilityPhase === "ended"
                      ? "انتهى"
                      : ""}
                  </span>
                  <span>{hasEnd ? fmt.format(endDate) : "—"}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
                  <div
                    className={`h-full ${windowBarClass} transition-all`}
                    style={{ width: `${windowPct}%` }}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={Math.round(windowPct)}
                    role="progressbar"
                  />
                </div>
              </div>
            )}

            {/* Capacity progress bar */}
            {isCapped && (
              <div className="mb-4">
                <div className="flex items-center justify-between text-xs text-[#202938]/70 mb-1">
                  <span>0</span>
                  <span className="font-medium">
                    {isFull
                      ? "مكتمل"
                      : remaining <= 5
                      ? `متبقي ${remaining} مقاعد`
                      : "متاح للتسجيل"}
                  </span>
                  <span>{capacity}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
                  <div
                    className={`h-full ${capacityBarClass} transition-all`}
                    style={{
                      width: `${roundedFillPct}%` // Fixed: using rounded value
                    }}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={Math.round(roundedFillPct)}
                    role="progressbar"
                  />
                </div>
              </div>
            )}

            {/* Footer actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center w-full justify-between gap-2">
                <div className="flex items-center gap-3">
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      openStudents();
                    }}
                    type="text"
                    size="small"
                    className={`flex items-center gap-1 ${
                      isFull
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-green-600 hover:bg-green-50"
                    }`}
                    aria-label="عرض الطلاب المسجلين"
                  >
                    <Users className="w-4 h-4" />
                    <span className="hidden sm:inline">الطلاب</span>
                  </Button>

                  <h4 className="text-primary text-xl font-bold ">
                    <span className="font-mono">{subject.price}</span> ر.س
                  </h4>

                  {/* {isAvailableNow ? (
                    <PreserveSubjectLink
                      href={`/subjects/${subject.code}/units`}
                    >
                      <Button
                        type="default"
                        size="small"
                        className="hover:bg-gray-100"
                      >
                        عرض الوحدات
                      </Button>
                    </PreserveSubjectLink>
                  ) : (
                    <Button
                      type="default"
                      size="small"
                      onClick={handleUnavailableClick}
                      className="opacity-70 cursor-not-allowed"
                    >
                      عرض الوحدات
                    </Button>
                  )} */}
                </div>
                <div onClick={(e) => e.preventDefault()}>
                  <Dropdown
                    trigger={["click"]}
                    placement="bottomRight"
                    menu={moreMenu(subject)}
                  >
                    <AntdButton
                      onClick={(e) => {
                        e.preventDefault();
                      }}
                      className="rounded-lg"
                      icon={<MoreVertical />}
                    />
                  </Dropdown>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Students Modal */}
      <AnimatePresence>
        {isStudentsOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setIsStudentsOpen(false)}
            />

            <motion.div
              role="dialog"
              aria-modal="true"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              className="relative bg-white w-full max-w-2xl rounded-2xl shadow-xl p-4 sm:p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-bold text-[#202938]">
                  الطلاب المسجلون — {subject.name}
                </h4>
                <button
                  onClick={() => setIsStudentsOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100"
                  aria-label="إغلاق"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Capacity hint inside modal */}
              {isCapped && (
                <div
                  className={`mb-3 rounded-xl border p-3 text-sm ${
                    isFull
                      ? "border-red-200 bg-red-50 text-red-800"
                      : remaining <= 5
                      ? "border-amber-200 bg-amber-50 text-amber-900"
                      : "border-emerald-200 bg-emerald-50 text-emerald-900"
                  }`}
                >
                  السعة: {clampedEnrolled} / {capacity}
                  {isFull
                    ? " — مكتمل، لا توجد مقاعد متاحة."
                    : ` — متبقي ${remaining} مقعد.`}
                </div>
              )}

              {/* Search */}
              <div className="mb-4">
                <div className="flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2">
                  <Search className="w-4 h-4 text-gray-500" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="ابحث بالاسم أو البريد…"
                    className="w-full outline-none text-sm"
                  />
                </div>
              </div>

              {/* Status */}
              {studentsLoading && (
                <div className="space-y-2">
                  <SkeletonRow />
                  <SkeletonRow />
                  <SkeletonRow />
                </div>
              )}
              {!!studentsError && (
                <p className="text-sm text-red-600 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4" /> {studentsError}
                </p>
              )}

              {/* List */}
              {!studentsLoading &&
                !studentsError &&
                (Array.isArray(filtered) && filtered.length > 0 ? (
                  <div className="max-h-[50vh] overflow-auto rounded-xl border border-gray-100">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 sticky top-0">
                        <tr>
                          <th className="text-right p-3 font-semibold text-gray-700">
                            الاسم
                          </th>
                          <th className="text-right p-3 font-semibold text-gray-700">
                            البريد
                          </th>
                          <th className="text-right p-3 font-semibold text-gray-700">
                            تاريخ التسجيل
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filtered.map((s) => (
                          <tr
                            key={s.id ?? `${s.name}-${s.email}`}
                            className="border-t border-gray-50 hover:bg-gray-50"
                          >
                            <td className="p-3">{s.name || "—"}</td>
                            <td className="p-3">{s.email || "—"}</td>
                            <td className="p-3">{s.joinedAt || "—"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-900 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4" />
                    لا توجد بيانات طلاب لعرضها حاليًا.
                  </div>
                ))}

              <div className="mt-4 flex justify-end gap-2">
                <Button
                  type="default"
                  onClick={() => setIsStudentsOpen(false)}
                  className="px-4"
                >
                  إغلاق
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// ---------- Small skeleton for loading rows ----------
const SkeletonRow = () => (
  <div className="h-10 w-full animate-pulse rounded-lg bg-gray-100" />
);

export default TeacherSubjectCard;