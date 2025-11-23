// "use client";
// import React, { useEffect, useState } from "react";
// import Card from "./ExamCard";
// import Input from "./ExamInput";
// import { FileText } from "lucide-react";
// import { useDispatch, useSelector } from "react-redux";
// import { handleGetSourceRound } from "../../lib/features/roundsSlice";
// import { handleCreateExam } from "../../lib/features/examSlice";
// import { toast } from "react-toastify";

// export default function ExamMainInfo({
//   examData,
//   colorMap,
//   setExamData,
//   exam_types,
//   getEstimatedDuration,
// }) {
//   const dispatch = useDispatch();
//   const { source_round_list, all_round_lessons, all_round_lessons_loading } =
//     useSelector((state) => state?.rounds);
//     const {add_exam_loading} = useSelector(state => state?.exam)
//   const [exmaInfoData, setExamInfoData] = useState({
//     title: "", // required, string, max 255 chars
//     description: "", // required, string
//     free: 0, // required, string, 0 or 1
//     time: "", // required, string, exam duration
//     date: "", // required, string, exam date,
//     type:"mock",
//   });
//   useEffect(() => {
//     dispatch(handleGetSourceRound());
//   }, []);

//   useEffect(() => {
//     console.log(source_round_list);
//   }, [source_round_list]);

//   const handleInputChange = (field, value) => {
//     setExamInfoData((prev) => ({ ...prev, [field]: value }));
//   };

//   const handleExamTypeChange = (type) => {
//     console.log(type);
//     setExamInfoData({...exmaInfoData , type : type?.value})
//     setExamData({
//       ...examData,
//       exam_type: type.value,
//       lesson_id: type.value === "full_round" ? "" : examData.lesson_id,
//       sections: [],
//     });
//   };

//   useEffect(() => {
//     console.log(examData);
//   }, [examData]);

//   function handleSubmit() {
//     console.log(exmaInfoData)
//     if(!exmaInfoData?.title)  {
//       toast.warn("ادخل اسم الاختبار أولا!");
//       return
//     }

//      if(!exmaInfoData?.description)  {
//       toast.warn("ادخل وصف الاختبار أولا!");
//       return
//     }

//     const data_send = {
//       title : exmaInfoData?.title ,
//       description : exmaInfoData?.description,
//       free : exmaInfoData?.free ,
//       time : exmaInfoData?.time,
//       date : exmaInfoData?.date
//     }
//    console.log(data_send);
//     dispatch(handleCreateExam({body : data_send}))
//     .unwrap()
//     .then(res => {
//       console.log(res)
//     })
//   }

//   return (
//     <Card title="معلومات الاختبار الأساسية" icon={FileText}>
//       <div className="space-y-6">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <Input
//             label="اسم الاختبار"
//             placeholder="أدخل اسم الاختبار"
//             value={exmaInfoData?.title || ""}
//             onChange={(e) => handleInputChange("title", e.target.value)}
//           />

         
//           <Input
//             label="الوصف"
//             placeholder="أدخل وصف الاختبار"
//             value={exmaInfoData?.description || ""}
//             onChange={(e) => handleInputChange("description", e.target.value)}
//             multiline
//           />


//           <div className="space-y-2">
//             <label className="block text-sm font-medium text-gray-700">
//               مجاني
//             </label>
//             <select
//               value={exmaInfoData?.free || "0"}
//               onChange={(e) => handleInputChange("free", e.target.value)}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             >
//               <option value="0">لا</option>
//               <option value="1">نعم</option>
//             </select>
//           </div>
//         </div>

//                <div>
//           <label className="block text-sm font-medium text-gray-700 mb-4">
//             نوع الاختبار
//           </label>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {exam_types.map((type) => {
//               const Icon = type.icon;
//               const isSelected = examData?.exam_type === type.value;
//               const palette = colorMap[type.color];

//               return (
//                 <button
//                   key={type.id}
//                   type="button"
//                   onClick={() => handleExamTypeChange(type)}
//                   className={`p-6 rounded-xl border-2 transition-all duration-200 text-right hover:scale-[1.02] ${
//                     isSelected
//                       ? `${palette.cardSelected} shadow-lg`
//                       : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
//                   }`}
//                 >
//                   <div className="flex items-start gap-4">
//                     <div
//                       className={`p-3 rounded-lg ${
//                         isSelected ? palette?.chip : "bg-gray-100"
//                       }`}
//                     >
//                       <Icon
//                         className={`h-6 w-6 ${
//                           isSelected ? palette?.icon : "text-gray-600"
//                         }`}
//                       />
//                     </div>
//                     <div className="flex-1 text-right">
//                       <h3 className="font-semibold text-gray-900 mb-2">
//                         {type.title}
//                       </h3>
//                       <p className="text-sm text-gray-600">
//                         {type.description}
//                       </p>
//                     </div>
//                   </div>
//                 </button>
//               );
//             })}
//           </div>
//         </div>

//          {exmaInfoData?.type == "mock" &&<div className="grid grid-cols-2 gap-3">
//            <Input
//             label="المدة (س:د:ث)"
//             placeholder="أدخل مدة الاختبار (01:00:00)"
//             value={exmaInfoData?.time || ""}
//             onChange={(e) => handleInputChange("time", e.target.value)}
//           />

//           <Input
//             label="التاريخ"
//             type="date"
//             value={exmaInfoData?.date || ""}
//             onChange={(e) => handleInputChange("date", e.target.value)}
//           />
//           </div>}

//         {/* Exam Type Selection - Keeping your existing UI for visual selection */}
     
//       </div>

//       <button
//         className="bg-blue-500 mt-3 ms-auto text-white p-3 rounded-md"
//         onClick={handleSubmit}
//       >
//         {add_exam_loading ? "جاري الاضافة....":"إضافة"}
//       </button>
//     </Card>
//   );
// }


"use client";

import React from "react";
import Input from "./ExamInput";
import { FileText } from "lucide-react";
import { toast } from "react-toastify";
import Card from "./ExamCard";

export default function ExamMainInfo({
  examData,
  setExamData,
  examInfoData,
  handleBasicDataChange,
  handleExamTypeChange,
  handleSubmitBasicData,
  exam_types,
  add_exam_loading
}) {

  const currentDate = new Date().toISOString().split("T")[0];

  return (
    <Card title="معلومات الاختبار الأساسية" icon={FileText}>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="اسم الاختبار"
            placeholder="أدخل اسم الاختبار"
            value={examInfoData?.title || ""}
            onChange={(e) => handleBasicDataChange("title", e.target.value)}
          />
          <Input
            label="الوصف"
            placeholder="أدخل وصف الاختبار"
            value={examInfoData?.description || ""}
            onChange={(e) => handleBasicDataChange("description", e.target.value)}
            multiline
          />
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">مجاني</label>
            <select
              value={examInfoData?.free || "0"}
              onChange={(e) => handleBasicDataChange("free", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="0">لا</option>
              <option value="1">نعم</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">نوع الاختبار</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Looping through exam types */}
            {exam_types?.map((type) => {
              const isSelected = examInfoData?.type == type.value;
              return (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => handleExamTypeChange(type)}
                  className={`p-6 rounded-xl border-2 transition-all duration-200 text-right hover:scale-[1.02] ${
                    isSelected ? "bg-blue-600 !text-white" : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`p-3 rounded-lg ${isSelected ? "bg-blue-500" : "bg-gray-100 text-blue-500"}`}
                    >
                      <type.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1 text-right">
                      <h3 className={isSelected? "font-semibold text-white mb-2" : "font-semibold text-gray-900 mb-2"}>{type.title}</h3>
                      <p className={isSelected?"text-sm text-white" :"text-sm text-gray-600"}>{type.description}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {examInfoData?.type =="mock" && <div className="grid grid-cols-2 gap-3">
          <Input
            label="الوقت"
            placeholder=""
            type="time"
            value={examInfoData?.time || ""}
            onChange={(e) => handleBasicDataChange("time", e.target.value)}
          />
          <Input
          min={currentDate}
            label="التاريخ"
            type="date"
            placeholder=""
            value={examInfoData?.date || ""}
            onChange={(e) => handleBasicDataChange("date", e.target.value)}
          />
          </div>}
      </div>

      <button
        className="bg-blue-500 text-white p-3 rounded-md mt-3"
        onClick={handleSubmitBasicData}
      >
        {add_exam_loading ? "جاري الاضافة...." : "إضافة"}
      </button>
    </Card>
  );
}
