import React from "react";
import { Modal, Button } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  handleDeleteBadge,
  handleGetAllBadges,
} from "../../../lib/features/badgeSlice";
import { toast } from "react-toastify";

export default function DeleteBadgeModal({ open, setOpen }) {
  const dispatch = useDispatch();
  const { delete_badge_loading } = useSelector((state) => state?.badges);

  function handleClose() {
    setOpen(false); // or setOpen(null) لو انت بتخزن object
  }

  function handleDelete() {
    const data_send = {
      id: open?.id,
    };

    dispatch(handleDeleteBadge({ body: data_send }))
      .unwrap()
      .then((res) => {
        if (res?.data?.status === "success") {
          toast.success(res?.data?.message);
          dispatch(handleGetAllBadges());
          handleClose();
        } else {
          toast.error(res?.data?.message || "حدث خطأ أثناء حذف الشارة");
        }
      })
      .catch((e) => {
        console.log(e);
        toast.error("حدث خطأ غير متوقع");
      });
  }

  return (
    <Modal
      open={!!open}          // because open is an object {id, name,...}
      onCancel={handleClose}
      title="حذف الشارة"
      centered
      footer={[
        <Button key="cancel" onClick={handleClose}>
          إلغاء
        </Button>,
        <Button
          key="delete"
          type="primary"
          danger
          onClick={handleDelete}
          loading={delete_badge_loading}
        >
          حذف الشارة
        </Button>,
      ]}
    >
      <div dir="rtl" className="text-right">
        <p className="mb-2 text-base">
          هل أنت متأكد أنك تريد حذف هذه الشارة؟
        </p>

        {open?.name && (
          <p className="mb-3 text-sm">
            الشارة: <span className="font-semibold">{open?.name}</span>
          </p>
        )}

        <p className="text-xs text-gray-500">
          لن تتمكن من استعادة هذه الشارة بعد الحذف، وسيتم إزالتها من حسابات
          جميع المستخدمين المرتبطة بها.
        </p>
      </div>
    </Modal>
  );
}
