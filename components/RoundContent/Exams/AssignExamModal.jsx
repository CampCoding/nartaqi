import { Modal, Select } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { handleAssignExam, handleGetAllExamByRoundId, handleGetAllExams } from '../../../lib/features/examSlice';
import { toast } from 'react-toastify';

export default function AssignExamModal({ open, setOpen, round_id }) {
  const dispatch = useDispatch();
  const { all_exam_list, all_exam_loading, assign_exam_loading } = useSelector(state => state?.exam);
  const [selectedExam, setSelectedExam] = useState(null);


  useEffect(() => {
    dispatch(handleGetAllExams({ page: 1, per_page: 100000000 }))
  }, [dispatch])

  const options = useMemo(() => {
    return (all_exam_list?.data?.message?.data?.map(item => ({ label: item?.title, value: item?.id })));
  }, [all_exam_list])

  const handleSubmit = () => {
    if (!round_id) {
      alert("Please select a round or lesson to assign.");
      return;
    }

    const data_send = {
      type: "full_round", // 'full_round' or 'lesson'
      exam_id: selectedExam, // Assuming an exam_id
      lesson_or_round_id: round_id,

    };

    dispatch(handleAssignExam({ body: data_send }))
      .unwrap()
      .then(res => {
        console.log(res);
        if (res?.data?.status == "success") {
          toast.success("تم تعيين الاختبار بنجاح");
          dispatch(handleGetAllExamByRoundId({
            body: {
              round_id: round_id
            },
            page: 1,
            per_page: 10000000
          }))
          setOpen(false);
          setSelectedExam(null);
        } else {
          toast.error(res?.data?.message || "فشل في تعيين الاختبار")
        }
      }).catch(e => console.log(e))
    // Call dispatch or API to assign the exam (this would be handled in your backend)
  };


  useEffect(() => {
    console.log("selectedExam", selectedExam)
  }, [selectedExam])

  return (
    <Modal
      onOk={handleSubmit}
      cancelText="إلغاء"
      okText={assign_exam_loading ? "جاري الحفظ...." : "حفظ"}
      open={open} onCancel={() => setOpen(false)} title="اختر اختبار">
      <div className="flex flex-col gap-2">
        <label>اختر اختبار</label>
        <Select
        value={selectedExam}
          loading={all_exam_loading}
          onChange={(e) => {
            setSelectedExam(e);
          }}
          options={options}>
        </Select>
      </div>
    </Modal>
  )
}
