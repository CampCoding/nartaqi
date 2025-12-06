"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  handleGetBlogComments,
  handleDeleteBlogComment,
  handleShowHideBlogComment,
} from "../../../../../lib/features/blogSlice";
import {
  Spin,
  Empty,
  Card,
  Tag,
  Button,
  message,
  Rate,
  Modal,
} from "antd";
import {
  DeleteOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  CommentOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";

export default function Page() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const {
    blog_comments_loading,
    blog_comments_data,
    blog_comment_delete_loading,
    blog_comment_show_hide_loading,
  } = useSelector((state) => state?.blogs);

  const [comments, setComments] = useState([]);

  // Modal state for actions (delete / toggle)
  const [actionModal, setActionModal] = useState({
    open: false,
    type: null, // 'delete' | 'toggle'
    comment: null,
  });

  // Fetch comments on mount / id change
  useEffect(() => {
    if (!id) return;
    const body = { blog_id: id };
    dispatch(handleGetBlogComments({ body }));
  }, [id, dispatch]);

  // Sync local comments state when API data changes
  useEffect(() => {
    const list = blog_comments_data?.data?.message || [];
    setComments(list);
  }, [blog_comments_data]);

  const loading = blog_comments_loading;

  const refreshComments = () => {
    dispatch(handleGetBlogComments({ body: { blog_id: id } }));
  };

  const handleDelete = async (commentId) => {
    try {
      const body = { id: commentId };
      const res = await dispatch(handleDeleteBlogComment({ body })).unwrap();

      if (res?.data?.status === "success") {
        toast.success(res?.data?.message || "تم حذف التعليق بنجاح");
      } else {
        toast.success("تم حذف التعليق بنجاح");
      }

      refreshComments();
    } catch (err) {
      console.error(err);
      toast.error("حدث خطأ أثناء حذف التعليق");
    }
  };

  const handleToggleVisibility = async (comment) => {
    try {
      const body = { id: comment.id, hidden: comment?.hidden ? 0 : 1 };
      const res = await dispatch(handleShowHideBlogComment({ body })).unwrap();

      const isHiddenNow =
        typeof comment.hidden === "number"
          ? comment.hidden === 0
            ? 1
            : 0
          : !comment.hidden;

      if (res?.data?.status === "success") {
        toast.success(
          res?.data?.message ||
            (isHiddenNow ? "تم إخفاء التعليق" : "تم إظهار التعليق")
        );
      } else {
        toast.success(isHiddenNow ? "تم إخفاء التعليق" : "تم إظهار التعليق");
      }

      refreshComments();
    } catch (err) {
      console.error(err);
      toast.error("حدث خطأ أثناء تحديث حالة التعليق");
    }
  };

  const openActionModal = (type, comment) => {
    setActionModal({
      open: true,
      type,
      comment,
    });
  };

  const closeActionModal = () => {
    setActionModal({
      open: false,
      type: null,
      comment: null,
    });
  };

  const handleModalConfirm = async () => {
    if (!actionModal.comment) return;

    if (actionModal.type === "delete") {
      await handleDelete(actionModal.comment.id);
    } else if (actionModal.type === "toggle") {
      await handleToggleVisibility(actionModal.comment);
    }

    closeActionModal();
  };

  const modalTitle =
    actionModal.type === "delete"
      ? "حذف التعليق"
      : actionModal.type === "toggle"
      ? actionModal.comment?.hidden
        ? "إظهار التعليق"
        : "إخفاء التعليق"
      : "";

  const modalText =
    actionModal.type === "delete"
      ? "هل أنت متأكد أنك تريد حذف هذا التعليق؟ هذا الإجراء نهائي ولا يمكن التراجع عنه."
      : actionModal.type === "toggle"
      ? actionModal.comment?.hidden
        ? "هل تريد إظهار هذا التعليق مرة أخرى؟"
        : "هل تريد إخفاء هذا التعليق من الواجهة؟"
      : "";

  const modalLoading =
    actionModal.type === "delete"
      ? blog_comment_delete_loading
      : actionModal.type === "toggle"
      ? blog_comment_show_hide_loading
      : false;

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <Spin size="large" spinning />
      </div>
    );
  }

  return (
    <>
      <div className="p-6 mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
              <CommentOutlined className="text-white text-lg" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                تعليقات المقال
              </h1>
              <p className="text-slate-500 text-sm">
                عرض وإدارة تعليقات المقال رقم #{id}
              </p>
            </div>
          </div>
          <Tag color="blue" className="text-sm px-3 py-1 rounded-full">
            إجمالي التعليقات: {comments.length}
          </Tag>
        </div>

        {comments.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 flex flex-col items-center justify-center">
            <Empty description="لا توجد تعليقات حتى الآن" />
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => {
              const isHidden =
                typeof comment.hidden === "number"
                  ? comment.hidden === 1
                  : !!comment.hidden;

              return (
                <Card
                  key={comment.id}
                  className="shadow-sm border border-slate-100"
                  bodyStyle={{ padding: "16px 20px" }}
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                          <UserOutlined className="text-slate-500 text-sm" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-800">
                              طالب #{comment.student_id ?? "غير معروف"}
                            </span>
                            <Tag
                              color={isHidden ? "red" : "green"}
                              className="text-xs"
                            >
                              {isHidden ? "مخفي" : "ظاهر"}
                            </Tag>
                          </div>
                        </div>
                      </div>

                      <p className="mt-2 text-slate-700 leading-relaxed">
                        {comment.comment}
                      </p>

                      <Rate value={comment?.rateing} disabled />

                      {comment.created_at && (
                        <p className="mt-2 text-xs text-slate-400">
                          تم الإضافة في: {comment.created_at?.split("T")[0]}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-row md:flex-col gap-2 md:items-end">
                      <Button
                        size="small"
                        type={isHidden ? "default" : "dashed"}
                        icon={isHidden ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                        onClick={() => openActionModal("toggle", comment)}
                      >
                        {isHidden ? "إظهار" : "إخفاء"}
                      </Button>

                      <Button
                        size="small"
                        danger
                        type="primary"
                        icon={<DeleteOutlined />}
                        onClick={() => openActionModal("delete", comment)}
                      >
                        حذف
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Action Modal */}
      <Modal
        open={actionModal.open}
        title={modalTitle}
        onCancel={closeActionModal}
        okText={
          actionModal.type === "delete"
            ? "نعم، حذف"
            : actionModal.type === "toggle"
            ? actionModal.comment?.hidden
              ? "إظهار"
              : "إخفاء"
            : "تأكيد"
        }
        okButtonProps={{className:"text-white !bg-blue-500"}}
        cancelText="إلغاء"
        confirmLoading={modalLoading}
        onOk={handleModalConfirm}
        centered
      >
        <p className="mb-3">{modalText}</p>
        {actionModal.comment && (
          <div className="p-3 rounded-md bg-slate-50 border border-slate-100 text-sm text-slate-700">
            {actionModal.comment.comment}
          </div>
        )}
      </Modal>
    </>
  );
}
