"use client";

import { handleDeleteLive } from "@/lib/features/livesSlice";
import { handleGetAllRoundContent } from "@/lib/features/roundContentSlice";
import { handleDeleteLessonVideo } from "@/lib/features/videoSlice";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle
} from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

export default function DeleteLiveModal({ open, setOpen }) {
  const dispatch = useDispatch();
  const deleteData = async () => {
    dispatch(handleDeleteLive({ body: open })).then((payload) => {
      console.log("payload", payload?.payload?.error?.response?.data?.message);
      if (
        payload?.payload?.status == 200 &&
        payload?.payload?.data?.status === "success"
      ) {
        toast.success("Live Deleted successfully");
        dispatch(
          handleGetAllRoundContent({ body: { round_id: open.round_id } })
        );
        setOpen(null);
      } else {
        toast.error(payload?.payload?.error?.response?.data?.message);
      }
    });
  };
  return (
    <div>
      <Dialog
        open={open ? true : false}
        onClose={setOpen}
        className="relative z-10"
        style={{ direction: "rtl", textAlign: "right" }}
      >
        <DialogBackdrop
          transition
          className="fixed inset-0 transition-opacity bg-gray-500/75 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
        />

        <div
          className="fixed inset-0 z-10 w-screen overflow-y-auto"
          style={{ direction: "rtl", textAlign: "right" }}
        >
          <div className="flex items-end justify-center min-h-full p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative overflow-hidden text-left transition-all transform bg-white rounded-lg shadow-xl data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95"
            >
              <div className="px-4 pt-5 pb-4 bg-white sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="flex items-center justify-center mx-auto bg-red-100 rounded-full size-12 shrink-0 sm:mx-0 sm:size-10">
                    <ExclamationTriangleIcon
                      aria-hidden="true"
                      className="text-red-600 size-6"
                    />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <DialogTitle
                      as="h3"
                      className="m-1 text-base font-semibold text-right text-gray-900"
                    >
                      حذف البث المباشر - {open?.title}.
                    </DialogTitle>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        هل أنت متأكد من عملية الحذف ؟
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-4 py-3 bg-gray-50 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  onClick={() => deleteData()}
                  className="inline-flex justify-center w-full px-3 py-2 text-sm font-semibold text-white bg-red-600 rounded-md shadow-xs hover:bg-red-500 sm:ml-3 sm:w-auto"
                >
                  تأكيد
                </button>
                <button
                  type="button"
                  data-autofocus
                  onClick={() => setOpen(false)}
                  className="inline-flex justify-center w-full px-3 py-2 mt-3 text-sm font-semibold text-gray-900 bg-white rounded-md shadow-xs inset-ring inset-ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                >
                  إلغاء
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
