"use client";
import React, { useEffect, useState, useMemo } from "react";
import { Modal, Select, message, Tooltip, Input, Button as AntButton, Spin, Button } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { handleGetStudentRounds, handleCancelStudentRound, handleGetStudentDetails, handleGetAllStudents } from "../../../lib/features/studentSlice";
import { toast } from "react-toastify";



export default function StudentCourses({ id }) {
  const dispatch = useDispatch();
  const { get_student_rounds_list, get_student_rounds_loading , get_students_list } = useSelector(
    (state) => state?.students
  );

  useEffect(() => {
    dispatch(
      handleGetStudentRounds({
        body: {
          student_id: id,
        },
      })
    );
  }, [id]);
   
  




  // Cancel Round Action
  const cancelRound = (roundId) => {
    dispatch(handleCancelStudentRound({ body: { round_id: roundId, student_id: id } }))
      .unwrap()
      .then((res) => {
        console.log(res);
        if (res?.data?.status == "success") {
          toast.success("تم إلغاء الدورة بنجاح");
          dispatch(
            handleGetStudentRounds({
              body: {
                student_id: id,
              },
            })
          );
        } else {
          toast.error("هناك خطأ أثناء  الغاء الدورة")
        }
      })
      .catch(() => {
        message.error("فشل في إلغاء الدورة");
      });
  };


  return (
    <div className="min-h-screen p-6" dir="rtl">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Active Courses */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mt-6">
          {get_student_rounds_list?.data?.data?.message?.map((course) => (
            <div
              key={course?.id}
              className="group bg-white rounded-3xl shadow-xl border border-gray-100 p-0 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] cursor-pointer"
            >
              {/* Course Banner */}
              <div className="relative">
                <img
                  src={course?.image}
                  alt={course?.name}
                  className="w-full h-40 object-cover"
                />
              </div>
              <div className="p-6 flex flex-col gap-4">
                <h4 className="font-bold text-lg text-gray-800 group-hover:text-blue-600 transition-colors">
                  {course?.name}
                </h4>
                <div className="flex gap-2">
                  <Button
                    className="bg-blue-600 text-white flex-1"
                    onClick={() => cancelRound(course.id)}
                  >
                    إلغاء الدورة
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {get_student_rounds_loading && (
          <div className="flex justify-center items-center mt-6">
            <Spin size="large" spinning />
          </div>
        )}
      </div>
    </div>
  );
}
