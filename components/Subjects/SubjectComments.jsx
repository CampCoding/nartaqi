"use client";

import React, { useMemo, useState } from "react";
import {
  List,
  Avatar,
  Rate,
  Button,
  Form,
  Tooltip,
  Popconfirm,
  message,
  Empty,
} from "antd";
import {
  SendOutlined,
  EditOutlined,
  DeleteOutlined,
  CommentOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ar";
dayjs.extend(relativeTime);
dayjs.locale("ar");

import dynamic from "next/dynamic";
import DOMPurify from "isomorphic-dompurify";
// Keep the CSS import once globally if you already imported it elsewhere
import "react-quill-new/dist/quill.snow.css";
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

/** Quill (compact) toolbar/formats */
const quillModules = {
  toolbar: [
    ["bold", "italic", "underline"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ align: ["", "center", "right", "justify"] }],
    [{ direction: "rtl" }],
    ["link", "clean"],
  ],
};
const quillFormats = [
  "bold",
  "italic",
  "underline",
  "list",
  // "bullet",
  "align",
  "direction",
  "link",
];

const sanitize = (html) =>
  DOMPurify.sanitize(html || "", {
    ALLOWED_TAGS: [
      "p",
      "b",
      "strong",
      "i",
      "em",
      "u",
      "span",
      "br",
      "ul",
      "ol",
      "li",
      "blockquote",
      "code",
      "pre",
      "a",
    ],
    ALLOWED_ATTR: ["href", "target", "rel", "style", "class"],
  });

/** Helper to get initials/avatar fallback */
const initials = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("") || "?";

/**
 * Props:
 * - subjectId: string|number (optional)
 * - comments: Array<{
 *     id: string|number,
 *     authorName: string,
 *     authorAvatar?: string,
 *     rating?: number,
 *     contentHtml: string,
 *     createdAt: string, // ISO
 *     authorId?: string|number
 *   }>
 * - currentUser?: { id?: string|number, isAdmin?: boolean }
 * - onCreate?: (data) => Promise|void
 * - onUpdate?: (id, data) => Promise|void
 * - onDelete?: (id) => Promise|void
 * - pageSize?: number (default 5)
 * - allowRating?: boolean (default true)
 */
const SubjectComments = ({
  subjectId,
  comments = [],
  currentUser,
  onCreate,
  onUpdate,
  onDelete,
  pageSize = 5,
  allowRating = true,
}) => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(0);

  const [editingId, setEditingId] = useState(null);
  const [editingContent, setEditingContent] = useState("");
  const [editingRating, setEditingRating] = useState(0);

  const [page, setPage] = useState(1);

  const total = comments.length;
  const pagedComments = useMemo(() => {
    const start = (page - 1) * pageSize;
    return comments.slice(start, start + pageSize);
  }, [comments, page, pageSize]);

  const canEdit = (c) =>
    currentUser?.isAdmin || (currentUser?.id && currentUser.id === c.authorId);

  const handleCreate = async () => {
    if (!content || sanitize(content).replace(/<[^>]*>/g, "").trim().length < 2) {
      message.error("اكتب تعليقًا مناسبًا.");
      return;
    }
    if (allowRating && rating === 0) {
      message.error("من فضلك قيّم الدورة بنجمة واحدة على الأقل.");
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        subjectId,
        contentHtml: sanitize(content),
        rating: allowRating ? rating : undefined,
        createdAt: new Date().toISOString(),
      };
      await onCreate?.(payload);
      form.resetFields();
      setContent("");
      setRating(0);
      message.success("تم إضافة التعليق.");
    } catch (e) {
      message.error("تعذّر إرسال التعليق.");
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (c) => {
    setEditingId(c.id);
    setEditingContent(c.contentHtml || "");
    setEditingRating(c.rating || 0);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingContent("");
    setEditingRating(0);
  };

  const saveEdit = async (id) => {
    if (!editingContent || sanitize(editingContent).replace(/<[^>]*>/g, "").trim().length < 2) {
      message.error("اكتب تعليقًا مناسبًا.");
      return;
    }
    try {
      await onUpdate?.(id, {
        contentHtml: sanitize(editingContent),
        rating: allowRating ? editingRating : undefined,
      });
      message.success("تم تحديث التعليق.");
      cancelEdit();
    } catch (e) {
      message.error("تعذّر تحديث التعليق.");
    }
  };

  const removeComment = async (id) => {
    try {
      await onDelete?.(id);
      message.success("تم حذف التعليق.");
    } catch (e) {
      message.error("تعذّر حذف التعليق.");
    }
  };

  return (
    <section dir="rtl" className="rounded-2xl bg-white border border-gray-200 p-5 md:p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl md:text-2xl font-bold text-[#202938] flex items-center gap-2">
          <CommentOutlined /> التعليقات
        </h2>
      </div>

    

      {/* Comments list */}
      {total === 0 ? (
        <Empty description="لا توجد تعليقات بعد." />
      ) : (
        <List
          itemLayout="vertical"
          dataSource={pagedComments}
          renderItem={(item) => {
            const isEditing = editingId === item.id;
            return (
              <List.Item key={item.id} className="border-b last:border-b-0">
                <div className="flex items-start gap-3">
                  <Avatar src={item.authorAvatar} alt={item.authorName}>
                    {!item.authorAvatar ? initials(item.authorName) : null}
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-[#202938]">
                        {item.authorName || "مستخدم"}
                      </span>
                      {item.rating ? (
                        <Rate disabled defaultValue={item.rating} />
                      ) : null}
                      <span className="text-xs text-gray-500">
                        {dayjs(item.createdAt).fromNow()}
                      </span>
                    </div>

                    {/* content */}
                    {!isEditing ? (
                      <div
                        className="comment-content prose prose-sm md:prose-base max-w-none mt-2 leading-7"
                        // eslint-disable-next-line react/no-danger
                        dangerouslySetInnerHTML={{
                          __html: sanitize(item.contentHtml),
                        }}
                      />
                    ) : (
                      <div className="mt-3 space-y-3">
                        {allowRating && (
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-600">التقييم:</span>
                            <Rate value={editingRating} onChange={setEditingRating} />
                          </div>
                        )}
                        <div dir="rtl">
                          <ReactQuill
                            className="ql-rtl"
                            theme="snow"
                            value={editingContent}
                            onChange={setEditingContent}
                            modules={quillModules}
                            formats={quillFormats}
                            placeholder="حرّر تعليقك..."
                          />
                        </div>
                        <div className="flex gap-2 justify-end">
                          <Button onClick={cancelEdit}>إلغاء</Button>
                          <Button
                            type="primary"
                            onClick={() => saveEdit(item.id)}
                            icon={<EditOutlined />}
                            className="bg-[#0F7490] hover:!bg-[#0d5f75]"
                          >
                            حفظ
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* actions */}
                    <div className="mt-2 flex gap-3">
                      {canEdit(item) && !isEditing && (
                        <>
                          <Tooltip title="تعديل">
                            <Button
                              size="small"
                              icon={<EditOutlined />}
                              onClick={() => startEdit(item)}
                            >
                              تعديل
                            </Button>
                          </Tooltip>
                          <Popconfirm
                            title="حذف التعليق"
                            description="هل أنت متأكد من حذف هذا التعليق؟"
                            okText="نعم"
                            okButtonProps={{className:"bg-red-500 hover:!bg-red-600"}}
                            cancelText="لا"
                            onConfirm={() => removeComment(item.id)}
                          >
                            <Button size="small" danger icon={<DeleteOutlined />}>
                              حذف
                            </Button>
                          </Popconfirm>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </List.Item>
            );
          }}
          pagination={{
            current: page,
            pageSize,
            total,
            onChange: setPage,
            showSizeChanger: false,
            position: "bottom",
            align: "center",
          }}
        />
      )}

      {/* RTL + Quill tweaks */}
      <style jsx global>{`
        .ql-rtl .ql-editor {
          direction: rtl;
          text-align: right;
        }
        .ql-rtl .ql-editor.ql-blank::before {
          right: 12px;
          left: auto;
          text-align: right;
        }
        .comment-content {
          direction: rtl;
          text-align: right;
          word-break: break-word;
        }
        .comment-content a {
          color: #0f7490;
          text-decoration: underline;
        }
        .comment-content ul {
          list-style: disc;
          padding-right: 1.25rem;
        }
        .comment-content ol {
          list-style: decimal;
          padding-right: 1.25rem;
        }
        .comment-content blockquote {
          border-right: 4px solid #e5e7eb;
          margin-right: 0;
          padding-right: 1rem;
          color: #374151;
        }
        .comment-content pre,
        .comment-content code {
          background: #f6f8fa;
          border-radius: 8px;
          padding: 0.2rem 0.4rem;
          direction: ltr;
          text-align: left;
          display: inline-block;
        }
        .comment-content pre {
          display: block;
          padding: 0.75rem 1rem;
          overflow-x: auto;
        }
      `}</style>
    </section>
  );
};

export default SubjectComments;
