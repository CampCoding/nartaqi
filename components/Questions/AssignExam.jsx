"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { handleGetRoundLessons, handleGetSourceRound } from "../../lib/features/roundsSlice";
import {  Select, Button, Spin } from "antd";
import { Book } from "lucide-react";
import Input from "./ExamInput";
import Card from './ExamCard';
import { handleAssignExam } from "../../lib/features/examSlice";
import { toast } from "react-toastify";

export default function AssignExam({exam , lessonId}) {
  const { assign_exam_loading } = useSelector((state) => state?.exam);
  const { all_round_lessons, source_round_loading, source_round_list } = useSelector(
    (state) => state?.rounds
  );

  const [assignData, setAssignData] = useState({
    type: "full_round", // Default type
    round_id: null,
    lesson_id: null,
  });

  const dispatch = useDispatch();

  // Fetch rounds and lessons
  useEffect(() => {
    dispatch(handleGetSourceRound({page : 1, per_page: 1000000}));
  }, [dispatch]);





  const handleTypeChange = (value) => {
    setAssignData((prevState) => ({
      ...prevState,
      type: value,
      round_id: value === "full_round" ? prevState.round_id : null,
      lesson_id: value === "lesson" ? prevState.lesson_id : null,
    }));
  };

  const handleRoundChange = (value) => {
    setAssignData((prevState) => ({
      ...prevState,
      round_id: value,
      lesson_id: null, // Reset lesson when a new round is selected
    }));
  };

  useEffect(() => {
    dispatch(handleGetRoundLessons({body : {
      round_content_id : assignData?.round_id
    }}))
  } , [assignData.round_id])

  useEffect(() => {
    console.log("assign data" ,exam)
  } , [exam])

  const handleSubmit = () => {
    const { type, round_id, lesson_id } = assignData;

    if (!round_id && !lesson_id) {
      alert("Please select a round or lesson to assign.");
      return;
    }

    const data_send = {
      type: type, // 'full_round' or 'lesson'
      exam_id: exam?.id, // Assuming an exam_id
      lesson_or_round_id: type === "lesson" ? lesson_id : round_id,
    };
 
    console.log(data_send);
    dispatch(handleAssignExam({body : data_send}))
    .unwrap()
    .then(res => {
      console.log(res);
      if(res?.data?.status=="success") {
        toast.success("تم تعيين الاختبار بنجاح");

      }else {
        toast.error(res?.data?.message || "فشل في تعيين الاختبار")
      }
    }).catch(e => console.log(e))
    // Call dispatch or API to assign the exam (this would be handled in your backend)
  };


  return (
    <Card title="تعيين الاختبار لدوره معينه او درس" icon={Book}>
      <div className="flex flex-col gap-4">
      

        {/* Conditional Rendering for Rounds or Lessons */}
        { (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              اختر الدورة
            </label>
            {source_round_loading ? (
              <Spin size="large" />
            ) : (
              <Select
                value={assignData.round_id}
                onChange={handleRoundChange}
                className="w-full"
                placeholder="اختر دورة"
              >
                {source_round_list?.data?.message?.data?.map((round) => (
                  <Select.Option key={round?.id} value={round?.id}>
                    {round?.name}
                  </Select.Option>
                ))}
              </Select>
            )}
          </div>
        )}

        {assignData.type === "lesson" && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              اختر الدورة
            </label>
            {source_round_loading ? (
              <Spin size="large" />
            ) : (
              <Select
                value={assignData.round_id}
                onChange={handleRoundChange}
                className="w-full"
                placeholder="اختر دورة"
              >
                {source_round_list?.data?.message?.data?.map((round) => (
                  <Select.Option key={round?.id} value={round?.id}>
                    {round?.name}
                  </Select.Option>
                ))}
              </Select>
            )}
          </div>
        )}

        {/* Conditional Rendering for Lessons based on Selected Round */}
        {assignData.type === "lesson" && assignData.round_id && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              اختر الدرس
            </label>
            {source_round_loading ? (
              <Spin size="large" />
            ) : (
              <Select
                value={assignData.lesson_id}
                onChange={(value) => setAssignData((prev) => ({ ...prev, lesson_id: value }))}
                className="w-full"
                placeholder="اختر درس"
              >
                {all_round_lessons?.data?.message?.map((lesson) => (
                    <Select.Option key={lesson?.id} value={lesson?.id}>
                      {lesson?.title}
                    </Select.Option>
                  ))}
              </Select>
            )}
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <Button
            type="default"
            onClick={() => setAssignData({ type: "full_round", round_id: null, lesson_id: null })}
          >
            إلغاء
          </Button>
          <Button
            type="primary"
            onClick={handleSubmit}
            className="!bg-blue-500 !text-white"
            loading={assign_exam_loading}
            disabled={!assignData.round_id && !assignData.lesson_id}
          >
            {assign_exam_loading ? "جاري التعيين..." : "تعيين"}
          </Button>
        </div>
      </div>
    </Card>
  );
}
