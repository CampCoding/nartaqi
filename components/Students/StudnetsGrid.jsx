"use client";

import React, { useMemo, useState, useEffect } from "react";
import {
  Card,
  Tag,
  Button,
  Tooltip,
  Avatar,
  Pagination,
  Select,
  ConfigProvider,
  Dropdown,
  Segmented,
  Badge,
  Modal,
} from "antd";
import {
  EyeOutlined,
  UserOutlined,
  MoreOutlined,
  DeleteOutlined,
  CalendarOutlined,
  FacebookOutlined,
  InstagramOutlined,
  LinkedinOutlined,
  TwitterOutlined,
  YoutubeOutlined,
  FacebookFilled,
} from "@ant-design/icons";
import { subjects } from "../../data/subjects";
import EditStudentModal from "./EditStudentModal";
import DeleteStudentModal from "./DeleteStudentModal";
import { Globe, Phone } from "lucide-react";
import { useRouter } from "next/navigation";
import { handleInrollStudentRound } from "../../lib/features/studentSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { handleGetAllCoursesCategories } from "../../lib/features/categoriesSlice";
import { handleGetAllRounds } from "../../lib/features/roundsSlice";

const PALETTE = {
  primary: "#0F7490",
  secondary: "#C9AE6C",
  accent: "#8B5CF6",
  background: "#F9FAFC",
  text: "#202938",
};

const toStatus = (s) => (s ?? "").toString().trim().toLowerCase();

const STATUS_META = {
  approved: { color: "success", dot: "🟢", label: "معتمد" },
  pending: { color: "warning", dot: "🟡", label: "قيد المراجعة" },
  rejected: { color: "error", dot: "🔴", label: "مرفوض" },
};

function initials(name = "") {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase() || "").join("");
}

function StudentsGrid({
  data = [],
  pageSizeOptions = [6, 9, 12],
  defaultPageSize = 9,
  onView,
  onApprove,
  onReject,
  onChangeStatus,
  onDelete,
  onEdit,
}) {
  const [page, setPage] = useState(1);
  const [ps, setPs] = useState(defaultPageSize);
  const [edit, setEdit] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all"); // all | approved | pending | rejected
  const [deleteModal, setDeleteModal] = useState(false);
  const router = useRouter();
  const { all_courses_categories_list, all_courses_categories_loading } = useSelector(
    (state) => state?.categories
  );
  const {rounds_list} = useSelector(state => state?.rounds);
  
  const normalizedData = useMemo(
    () =>
      (data || []).map((t) => ({
        ...t,
        _status: toStatus(t.status || "approved"),
      })),
    [data]
  );

  const counts = useMemo(() => {
    const c = {
      approved: 0,
      pending: 0,
      rejected: 0,
      all: normalizedData.length,
    };
    normalizedData.forEach((t) => {
      c[t._status] = (c[t._status] || 0) + 1;
    });
    return c;
  }, [normalizedData]);

  const filtered = useMemo(() => {
    if (statusFilter === "all") return normalizedData;
    return normalizedData.filter((t) => t._status === statusFilter);
  }, [normalizedData, statusFilter]);

  const total = filtered.length;

  const pageData = useMemo(() => {
    const start = (page - 1) * ps;
    return filtered.slice(start, start + ps);
  }, [filtered, page, ps]);

  useEffect(() => {
    const maxPage = Math.max(1, Math.ceil(total / ps));
    if (page > maxPage) setPage(1);
  }, [total, ps, page]);

  const [enrollModalOpen , setEnrollModalOpen] = useState(false);
  const [selectedStudent , setSelectedStudent] = useState({});
  const [selectedRound , setSelectedRound] = useState({});
  const [selectedCategory , setSelectedCategory] = useState({});

  const dispatch = useDispatch();


    useEffect(() => {
    dispatch(handleGetAllCoursesCategories());
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      dispatch(handleGetAllRounds({ course_category_id: selectedCategory }));
    }
  }, [selectedCategory]);

  const openEnrollModal = (student) => {
    setSelectedStudent(student);
    setEnrollModalOpen(true);
  };

  const closeEnrollModal = () => {
    setEnrollModalOpen(false);
    setSelectedStudent(null);
    setSelectedCategory(null);
    setSelectedRound(null);
  };

  const handleConfirmEnroll = () => {
    if (!selectedRound) {
      notification.error({
        message: "خطأ",
        description: "يجب عليك اختيار دورة لتسجيل الطالب.",
      });
      return;
    }

    // Dispatch the enrollment action
    dispatch(
      handleInrollStudentRound({
        body: {
          student_id: selectedStudent.id,
          round_id: selectedRound,
        },
      })
    ).unwrap().then((res) => {
      console.log(res);
      if (res?.data?.status == "success") {
        setEnrollModalOpen(false);
        toast.success("تم تسجيل الطالب ف الدورة بنجاح");
      }else {
        toast.error("حدث خطأ أثناء محاولة تسجيل الطالب في الدورة.")
      }
    }).catch(() => {
      toast.error("حدث خطأ أثناء محاولة تسجيل الطالب في الدورة.")
    });
  };



  const moreMenu = (teacher) => ({
    items: [
      { type: "divider" },
      {
        key: "delete",
        danger: true,
        icon: <DeleteOutlined />,
        label: "حذف",
      },
       {
        key: "assign",
        danger: false,
        icon: "",
        label: "تسجيل في دورة",
      },
    ],
    onClick: ({ key }) => {
      if (key === "edit") {
        setEdit(true);
        setSelectedTeacher(teacher);
        onEdit?.(teacher);
        return;
      }
      if(key == "assign") {
        openEnrollModal(teacher)
      }
      if (key.startsWith("status:")) {
        const newStatus = key.split(":")[1]; // approved | pending | rejected
        onChangeStatus?.(teacher, newStatus);
        return;
      }
      if (key === "delete") {
        setDeleteModal(true);
        setSelectedTeacher(teacher);
        onDelete?.(teacher);
      }
    },
  });

  const footerLabel = useMemo(() => {
    const map = {
      all: "المعلمين",
      approved: "المعلمين المعتمدين",
      pending: "المعلمين قيد المراجعة",
      rejected: "المعلمين المرفوضين",
    };
    return map[statusFilter];
  }, [statusFilter]);

  return (
    <ConfigProvider
      direction="rtl"
      theme={{
        token: {
          colorPrimary: PALETTE.primary,
          borderRadius: 14,
          colorText: PALETTE.text,
        },
      }}
    >
      <div className="space-y-4" dir="rtl">
        {/* (Optional) status segmented filter - uncomment if you want it */}
        {/* 
        <div className="flex items-center justify-between">
          <Segmented
            value={statusFilter}
            onChange={(v) => {
              setStatusFilter(v);
              setPage(1);
            }}
            options={[
              {
                label: (
                  <div className="flex items-center gap-2 px-5">
                    <span>الكل</span>
                    <Badge count={counts.all} />
                  </div>
                ),
                value: "all",
              },
              {
                label: (
                  <div className="flex items-center gap-2">
                    <span>🟢 معتمد</span>
                    <Badge count={counts.approved} />
                  </div>
                ),
                value: "approved",
              },
              {
                label: (
                  <div className="flex items-center gap-2">
                    <span>🟡 قيد المراجعة</span>
                    <Badge count={counts.pending} />
                  </div>
                ),
                value: "pending",
              },
              {
                label: (
                  <div className="flex items-center gap-2">
                    <span>🔴 مرفوض</span>
                    <Badge count={counts.rejected} />
                  </div>
                ),
                value: "rejected",
              },
            ]}
          />

          <Select
            value={ps}
            onChange={(v) => {
              setPs(v);
              setPage(1);
            }}
            options={pageSizeOptions.map((n) => ({
              label: `${n} / صفحة`,
              value: n,
            }))}
            className="min-w-[130px] rounded-lg"
          />
        </div>
        */}

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {pageData.map((t) => {
            return (
              <Card
                key={t.id}
                className="rounded-2xl flex flex-col justify-between shadow-sm border border-gray-200 hover:shadow-md transition-all"
                styles={{ body: { padding: 16, height: "100%" } }}
              >
                {/* Header */}
                <div className="flex items-start gap-3">
                  <Avatar
                    size={48}
                    src={t.avatar || t.image_url || t.image}
                    style={{
                      background:
                        "linear-gradient(135deg, #8B5CF6 0%, #0F7490 100%)",
                    }}
                    icon={
                      !t.avatar && !t.image_url && !t.image ? (
                        <UserOutlined />
                      ) : undefined
                    }
                  >
                    {!t.avatar && !t.image_url && !t.image && initials(t.name)}
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <h3 className="text-lg font-semibold text-[#202938] m-0">
                        {t.name}
                      </h3>
                      <Tag
                        color={t?.gender === "male" ? "blue" : "pink"}
                        className="rounded-full px-3 py-1 text-[12px]"
                      >
                        {t?.gender === "male" ? "ذكر" : "أنثى"}
                      </Tag>
                    </div>
                    <p className="text-gray-500 text-sm m-0">{t.email}</p>
                    <div className="text-gray-500 flex gap-1 items-center text-sm mt-2 m-0">
                      <Phone className="w-4 h-4 text-green-500"/>
                      <span>{t.phone}</span>
                    </div>
                    <p className="text-gray-400 text-sm m-0">
                      {t?.description}
                    </p>
                  </div>
                </div>

                {/* Subjects (if any) */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {(t.subjects || []).map((s, i) => (
                    <Tag
                      key={s + i}
                      className="rounded-full px-3 py-1 text-[12px] border-0"
                      style={{
                        backgroundColor: "#0F74900F",
                        color: PALETTE.primary,
                      }}
                    >
                      {s}
                    </Tag>
                  ))}
                </div>

                <div className="mt-auto">
                  {/* Meta row */}
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 text-[#202938]">
                      <CalendarOutlined style={{ color: PALETTE.accent }} />
                      <span className="text-sm">
                        {(t.joinDate || t.created_at || "")
                          ?.toString()
                          ?.split("T")[0] || "—"}
                      </span>
                    </div>
                  </div>

                  {/* Social links */}
                  <div className="grid grid-cols-7 my-3 gap-1">
                    {t?.facebook && (
                      <a href={t?.facebook} target="_blank" rel="noreferrer">
                        <FacebookFilled className="w-7 h-7 text-blue-600" />
                      </a>
                    )}

                    {t?.instagram && (
                      <a href={t?.instagram} target="_blank" rel="noreferrer">
                        <InstagramOutlined className="w-7 h-7 text-pink-500" />
                      </a>
                    )}

                    {t?.linkedin && (
                      <a href={t?.linkedin} target="_blank" rel="noreferrer">
                        <LinkedinOutlined className="w-7 h-7 text-blue-400" />
                      </a>
                    )}

                    {t?.tiktok && (
                      <a href={t?.tiktok} target="_blank" rel="noreferrer">
                        <Globe className="w-4 h-4 text-black mx-auto" />
                      </a>
                    )}

                    {t?.twitter && (
                      <a href={t?.twitter} target="_blank" rel="noreferrer">
                        <TwitterOutlined className="w-7 h-7 text-blue-400" />
                      </a>
                    )}

                    {t?.youtube && (
                      <a href={t?.youtube} target="_blank" rel="noreferrer">
                        <YoutubeOutlined className="w-7 h-7 text-red-500" />
                      </a>
                    )}

                    {t?.website && (
                      <a
                        href={t?.website}
                        className="flex justify-center items-center"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Globe className="w-4 h-4 text-gray-500" />
                      </a>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="mt-5 flex items-center justify-between">
                    <Tooltip title="عرض الملف الشخصي">
                      <Button
                        icon={<EyeOutlined />}
                        onClick={() => router.push(`/students/${t?.id}`)}
                        className="rounded-lg"
                      >
                        عرض
                      </Button>
                    </Tooltip>

                     {/* <button
                  onClick={() => openEnrollModal(t)}
                  className="flex-1 px-3 py-2 rounded-lg bg-emerald-600 text-white text-xs hover:bg-emerald-700 transition"
                >
                  تسجيل في دورة
                </button> */}

                    <div className="flex items-center gap-2">
                      <Dropdown
                        trigger={["click"]}
                        placement="bottomRight"
                        menu={moreMenu(t)}
                      >
                        <Button
                          className="rounded-lg"
                          icon={<MoreOutlined />}
                        />
                      </Dropdown>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Footer: pagination + range info */}
        <div className="flex items-center justify-between pt-2">
          <div className="text-sm text-gray-600">
            عرض{" "}
            <span className="font-medium">
              {total === 0 ? 0 : (page - 1) * ps + 1}-
              {Math.min(page * ps, total)}
            </span>{" "}
            من <span className="font-medium">{total}</span> {footerLabel}
          </div>

          <Pagination
            current={page}
            pageSize={ps}
            total={total}
            showSizeChanger={false}
            onChange={(p) => setPage(p)}
          />
        </div>
      </div>

      <EditStudentModal
        open={edit}
        onCancel={() => setEdit(false)}
        student={selectedTeacher}
        subjectOptions={subjects}
      />
      <DeleteStudentModal
        open={deleteModal}
        setOpen={setDeleteModal}
        rowData={selectedTeacher}
      />

       <Modal
        open={enrollModalOpen}
        onCancel={closeEnrollModal}
        onOk={handleConfirmEnroll}
        okText="تأكيد التسجيل"
        cancelText="إلغاء"
        centered
        title="تسجيل الطالب في دورة"
      >
        {selectedStudent && (
          <div className="space-y-3 text-right">
            <p>
              سيتم تسجيل الطالب:{" "}
              <b className="text-emerald-700">{selectedStudent.name}</b> في أحد
              الدورات.
            </p>
            <div className="flex flex-col gap-2">
              <label>فئات الدورات</label>
              <Select
                loading={all_courses_categories_loading}
                onChange={(e) => setSelectedCategory(e)}
                options={all_courses_categories_list?.data?.message?.data?.map(item => ({
                  label: item?.name,
                  value: item?.id,
                }))}
              />
            </div>

            {/* Show rounds after selecting category */}
            {selectedCategory && rounds_list?.data?.message?.data && (
              <div className="flex flex-col gap-2 mt-2">
                <label>اختر الدورة</label>
                <Select
                  onChange={(value) => setSelectedRound(value)}
                  options={rounds_list?.data?.message?.data?.map(round => ({
                    label: round?.name,
                    value: round?.id,
                  }))}
                />
              </div>
            )}
          </div>
        )}
      </Modal>
    </ConfigProvider>
  );
}

export default StudentsGrid;
