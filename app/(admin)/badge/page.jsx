"use client";

import React, { useEffect, useMemo, useState } from "react";
import PageLayout from "../../../components/layout/PageLayout";
import BreadcrumbsShowcase from "../../../components/ui/BreadCrumbs";
import { Badge as BadgeIcon, BarChart3, Plus, Edit3, Trash2 } from "lucide-react";
import PagesHeader from "../../../components/ui/PagesHeader";
import { useDispatch, useSelector } from "react-redux";
import { handleAssignBadgeToStudent, handleGetAllBadges } from "../../../lib/features/badgeSlice";
import { Spin, Modal, Select, Form, message } from "antd";
import { handleGetAllTeachers } from "../../../lib/features/teacherSlice";
import { handleGetAllRoundResources } from "../../../lib/features/resourcesSlice";
import { handleGetSourceRound } from "../../../lib/features/roundsSlice";
import axios from "axios";
import { base_url } from "../../../constants";
import { apiRoutes } from "../../../lib/shared/routes";
import { configs } from "../../../configs";
import { toast } from "react-toastify";
import AddBadgeModal from "../../../components/Badge/AddBadgeModal/AddBadgeModal";
import DeleteBadgeModal from "../../../components/Badge/DeleteBadgeModal/DeleteBadgeModal";
import EditBadgeModal from "../../../components/Badge/EditBadgeModal/EditBadgeModal";

// ===== Breadcrumbs =====
const breadcrumbs = [
  { label: "الرئيسية", href: "/", icon: BarChart3 },
  { label: "الشارات", href: "#", icon: BadgeIcon, current: true },
];

/* ===================== Badge Card Component ===================== */

const BadgeCard = ({
  badge,
  setEditingBadge,
  setIsEditing,
  handleDeleteBadge,
  onAssign,
  setRowData , 
  setOpenEdit
}) => {
  const typeLabel = badge.category || "غير مُصنّف";

  const containerClass =
    "w-20 h-20 rounded-3xl flex items-center justify-center text-4xl shadow-2xl transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500";

  const startEditing = (badge) => {
    setRowData(badge);
    setOpenEdit(true);
    setEditingBadge({ ...badge });
    setIsEditing(true);
  };

  return (
    <div className="group relative p-6 rounded-3xl border-2 hover:border-transparent transition-all duration-500 cursor-pointer transform hover:-translate-y-2 hover:scale-105 bg-gradient-to-br from-white to-gray-50 border-gray-200 hover:shadow-2xl">
      {/* Edit / Delete buttons */}
      <div className="absolute top-4 left-4 flex gap-2">
        <button
          onClick={() => startEditing(badge)}
          className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors"
          title="تعديل"
        >
          <Edit3 size={14} />
        </button>
        <button
          onClick={() => handleDeleteBadge(badge.id)}
          className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors"
          title="حذف"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* Icon / Image */}
      <div className="flex justify-center mb-4 mt-4">
        <div
          className={`${containerClass} bg-gradient-to-br ${
            badge.color || "from-primary to-secondary"
          }`}
        >
          {badge.imageUrl ? (
            <img
              src={badge.imageUrl}
              alt={badge.name}
              className="w-12 h-12 object-contain rounded-xl"
            />
          ) : (
            <span className="drop-shadow-lg filter">
              {badge.icon || "🏅"}
            </span>
          )}
        </div>
      </div>

      <div className="text-center space-y-3">
        <h3 className="font-bold text-lg text-gray-800 group-hover:text-gray-900">
          {badge.name}
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed min-h-[40px]">
          {badge.description}
        </p>
        <div className="pt-2 border-t border-gray-100 flex flex-col gap-3 items-center">
          <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
            {typeLabel}
          </span>

          {/* Assign badge button */}
          <button
            type="button"
            onClick={() => onAssign?.(badge)}
            className="px-4 py-1.5 rounded-full bg-primary text-white text-xs font-medium hover:bg-secondary transition-colors"
          >
            تعيين الشارة
          </button>
        </div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl" />
    </div>
  );
};

/* ===================== Page Component ===================== */

export default function BadgesPage() {
  const [openAdd, setOpenAdd] = useState(false);
  const [openDelete , setOpenDelete] = useState(false);
  const [openEdit ,  setOpenEdit] = useState(false);
  const [rowData , setRowData] = useState({});

  const dispatch = useDispatch();
  const { all_badges_list, all_badges_loading  , assign_badge_loading } = useSelector(
    (state) => state?.badges
  );
  const {teachers_list} = useSelector(state => state?.teachers);


  // If you have students & rounds slices, adjust these selectors:
  const { all_students_list } = useSelector(
    (state) => state?.students || {}
  );
  const { source_round_list } = useSelector((state) => state?.rounds || {});

  const [badges, setBadges] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [filterType, setFilterType] = useState("all");

  // Editing badge (existing edit flow)
  const [isEditing, setIsEditing] = useState(false);
  const [editingBadge, setEditingBadge] = useState(null);

  // ===== Assign badge modal state =====
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedBadgeForAssign, setSelectedBadgeForAssign] = useState(null);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [selectedRoundId, setSelectedRoundId] = useState(null);
  const [assignLoading, setAssignLoading] = useState(false);
  const [teachersOptions , setTeachersOptions] = useState([]);
  const [roundsOptions , setRoundsOptions] = useState([]);

  /* ===== Load badges ===== */
  useEffect(() => {
    dispatch(handleGetAllTeachers())
    dispatch(handleGetSourceRound())
    dispatch(handleGetAllBadges());
  }, [dispatch]);



  useEffect(() => {
    console.log(source_round_list?.data?.message);
    setTeachersOptions(teachers_list?.data?.message?.map(item => ({label : item?.name , value: item?.id})))
    setRoundsOptions(source_round_list?.data?.message?.data?.map(item => ({label : item?.name , value: item?.id})))
  } , [teachers_list , source_round_list])

  useEffect(() => {
    console.log(teachersOptions , roundsOptions)
  } , [teachersOptions , roundsOptions])


  useEffect(() => {
    const list = all_badges_list?.data?.message || [];
    setBadges(list);

    const categorySet = new Set(
      list.map((item) => item.category).filter(Boolean)
    );

    const cats = [
      { key: "all", label: "الكل", icon: BadgeIcon },
      ...Array.from(categorySet).map((cat) => ({
        key: cat,
        label: cat,
        icon: BadgeIcon,
      })),
    ];

    setAllCategories(cats);
  }, [all_badges_list]);

  /* ===== Build students & rounds options for select ===== */


  /* ===== Filtered badges by category ===== */

  const filteredBadges = useMemo(() => {
    if (filterType === "all") return badges;
    return badges.filter((b) => b.category === filterType);
  }, [badges, filterType]);

  /* ===== Delete handler (temporary) ===== */

  const handleDeleteBadge = (id) => {
    console.log("Delete badge with id:", id);
    setBadges((prev) => prev.filter((b) => b.id !== id));
  };

  /* ===== Open / close assign modal ===== */

  const handleOpenAssign = (badge) => {
    setSelectedBadgeForAssign(badge);
    setSelectedStudentId(null);
    setSelectedRoundId(null);
    setAssignModalOpen(true);
  };

  const handleCloseAssign = () => {
    if (assignLoading) return;
    setAssignModalOpen(false);
    setSelectedBadgeForAssign(null);
    setSelectedStudentId(null);
    setSelectedRoundId(null);
  };

  const handleConfirmAssign = async () => {

    if (!selectedBadgeForAssign) {
      message.error("لا توجد شارة مختارة");
      return;
    }
    if (!selectedStudentId) {
      message.error("من فضلك اختر المتدرب");
      return;
    }
    if (!selectedRoundId) {
      message.error("من فضلك اختر الدورة");
      return;
    }

    try {
      setAssignLoading(true);

      const payload = {
        badge_id: 4,
        student_id: 6,
        round_id: 5,
      };

      dispatch(handleAssignBadgeToStudent({body : payload}))
      .unwrap()
      .then(res => {
        console.log(res)
        if(res?.data?.status == "success") {
          toast.success(res?.data?.message);
          handleCloseAssign();
        }else {
          toast.error(res?.data?.message)
        }
      })
    } catch (e) {
      console.error(e);
      message.error("حدث خطأ أثناء تعيين الشارة");
    } finally {
      setAssignLoading(false);
    }
  };

  /* ===== Loading state ===== */

  if (all_badges_loading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <Spin size="large" spinning />
      </div>
    );
  }

  /* ===================== RENDER ===================== */

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto p-6" dir="rtl">
        <BreadcrumbsShowcase variant="pill" items={breadcrumbs} />

        <PagesHeader
          title="الشارات"
          subtitle="استمر في التعلم لتحصل على المزيد من الشارات!"
          extra={
            <button
              onClick={() => setOpenAdd(true)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white font-medium hover:from-purple-600 hover:to-indigo-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              إضافة مكافأة
            </button>
          }
        />

        {/* Category filter pills */}
        <div className="flex flex-wrap gap-2 mb-8 p-2 bg-gray-50 rounded-2xl">
          {allCategories.map((type) => {
            const Icon = type.icon;

            const count =
              type.key === "all"
                ? badges.length
                : badges.filter((b) => b.category === type.key).length;

            return (
              <button
                key={type.key}
                onClick={() => setFilterType(type.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  filterType === type.key
                    ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg scale-105"
                    : "bg-white text-gray-700 hover:bg-gray-100 hover:scale-102"
                }`}
              >
                {Icon && <Icon size={16} />}
                {type.label}
                {count > 0 && (
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-bold ${
                      filterType === type.key
                        ? "bg-white/20 text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Badges grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredBadges.map((badge) => (
            <BadgeCard
            setRowData={setRowData}
            setOpenEdit={setOpenEdit}
              key={badge.id}
              badge={{
                id: badge.id,
                name: badge.name,
                description: badge.description,
                imageUrl: badge?.image,
                category: badge.category,
                color: "from-primary to-secondary",
                icon: "🏅",
              }}
              setEditingBadge={setEditingBadge}
              setIsEditing={setIsEditing}
              handleDeleteBadge={() => setOpenDelete(badge)}
              onAssign={handleOpenAssign}
            />
          ))}

          {filteredBadges.length === 0 && (
            <div className="col-span-full text-center text-gray-500 py-10">
              لا توجد شارات ضمن هذا الفلتر حاليًا
            </div>
          )}
        </div>

        {/* Assign Badge Modal */}
        <Modal
          open={assignModalOpen}
          onCancel={handleCloseAssign}
          onOk={handleConfirmAssign}
          confirmLoading={assign_badge_loading}
          title="تعيين شارة للمتدرب"
          okText="تعيين"
          cancelText="إلغاء"
          centered
        >
          {selectedBadgeForAssign && (
            <div className="mb-4 p-3 rounded-xl bg-gray-50 border text-sm text-gray-700">
              الشارة المختارة: <strong>{selectedBadgeForAssign.name}</strong>
            </div>
          )}

          <Form layout="vertical">
            <Form.Item label="اختر المتدرب" required>
              <Select
                placeholder="اختر متدربًا"
                options={teachersOptions}
                value={selectedStudentId}
                onChange={setSelectedStudentId}
                showSearch
                optionFilterProp="label"
              />
            </Form.Item>

            <Form.Item label="اختر الدورة / الجولة" required>
              <Select
                placeholder="اختر دورة"
                options={roundsOptions}
                value={selectedRoundId}
                onChange={setSelectedRoundId}
                showSearch
                optionFilterProp="label"
              />
            </Form.Item>
          </Form>
        </Modal>
      </div>

      <AddBadgeModal open={openAdd} setOpen={setOpenAdd}/>
      <DeleteBadgeModal open={openDelete} setOpen={setOpenDelete}/>
      <EditBadgeModal open={openEdit} setOpen={setOpenEdit} rowData={rowData}/>
    </PageLayout>
  );
}
