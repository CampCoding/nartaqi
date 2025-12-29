// "use client";
// import React, { useEffect, useState, useMemo } from "react";
// import {
//   BarChart3,
//   Star,
//   Eye,
//   EyeOff,
//   Edit3,
//   Trash2,
//   Grid3X3,
//   List,
//   Plus,
//   Filter,
//   Search,
//   Users,
//   TrendingUp,
//   ChevronRight,
//   ChevronLeft,
//   X,
//   Check,
//   MessageSquare,
//   MoreHorizontal,
//   Copy,
//   ExternalLink,
// } from "lucide-react";
// import BreadcrumbsShowcase from "@/components/ui/BreadCrumbs";
// import PagesHeader from "@/components/ui/PagesHeader";
// import SearchAndFilters from "@/components/ui/SearchAndFilters";
// import { useDispatch, useSelector } from "react-redux";
// import { 
//   handleGetAllGeneralRatings,
//   handleAddRating as handleAddGeneralRating,
//   handleEditRating as handleUpdateGeneralRating,
//   handleDeleteRating as handleDeleteGeneralRating,
//   handleGetAllRatingAnswers,
//   handleAddRatingAnswers,
//   handleEditRatingAnswers,
//   handleDeleteRatingAnswers,
// } from "../../../lib/features/ratingSlice";
// import { 
//   Spin, Modal, message, Rate, Select, Input, Button, Card, Tag, Avatar, Space, 
//   Tooltip, Popover, Form, Collapse, Badge, Alert
// } from "antd";
// import { motion, AnimatePresence } from "framer-motion";
// import { toast } from "react-toastify";

// const { TextArea } = Input;
// const { Option } = Select;
// const { Panel } = Collapse;

// const breadcrumbs = [
//   { label: "الرئيسية", href: "/", icon: BarChart3 },
//   { label: "التقييم", href: "/rating", icon: Star, current: true },
// ];

// const PageLayout = ({ children }) => <div className="w-full">{children}</div>;

// export default function RatingPage() {
//   const dispatch = useDispatch();
//   const { 
//     general_rating_loading, 
//     general_rating_list,
//     add_rating_loading,
//     update_rating_loading,
//     delete_rating_loading,
//     get_rating_answers_loading,
//     add_rating_answers_loading,
//     edit_rating_answers_loading,
//     delete_rating_answers_loading,
//   } = useSelector(state => state?.rating);

//   const [form, setForm] = useState({
//     id: null,
//     question: "",
//     description: "",
//     answers: ["", "", ""],
//     gender: "all",
//     visible: true,
//   });
  
//   const [answersModal, setAnswersModal] = useState({
//     visible: false,
//     ratingId: null,
//     ratingQuestion: "",
//     answers: [],
//   });
  
//   const [answers, setAnswers] = useState([]);

//   const [answerForm, setAnswerForm] = useState({
//     id: null,
//     answer: "",
//     general_rating_id: null,
//   });
  
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [mode, setMode] = useState("grid");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [pagination, setPagination] = useState({
//     current_page: 1,
//     per_page: 10,
//   });
//   const [deleteModal, setDeleteModal] = useState({
//     visible: false,
//     ratingId: null,
//     ratingQuestion: "",
//   });
  
//   const [deleteAnswerModal, setDeleteAnswerModal] = useState({
//     visible: false,
//     answerId: null,
//     answerText: "",
//   });

//   const resetForm = () => {
//     setForm({
//       id: null,
//       question: "",
//       description: "",
//       answers: ["", "", ""],
//       gender: "all",
//       visible: true,
//     });
//     setIsEditing(false);
//   };

//   const resetAnswerForm = () => {
//     setAnswerForm({
//       id: null,
//       answer: "",
//       general_rating_id: null,
//     });
//   };

//   const handleOpenModal = (rating = null) => {
//     if (rating) {
//       const answersArray = rating?.general_answers_ratings?.map(answer => answer.answer) || [];
//       while (answersArray.length < 3) {
//         answersArray.push("");
//       }
      
//       setForm({
//         id: rating.id,
//         question: rating.question,
//         description: rating.description || "",
//         answers: answersArray,
//         gender: rating.gender || "all",
//         visible: rating.visible ?? true,
//       });
//       setIsEditing(true);
//     } else {
//       resetForm();
//     }
//     setIsModalVisible(true);
//   };

//   const handleOpenAnswersModal = async (rating) => {
//     try {
//       setAnswersModal({
//         visible: true,
//         ratingId: rating.id,
//         ratingQuestion: rating.question,
//         answers: rating.general_answers_ratings || [],
//       });
      
//       // جلب أحدث الإجابات من السيرفر
//       const result = await dispatch(handleGetAllRatingAnswers({
//         body: { general_rating_id: rating.id }
//       }));
      
//       if (result.payload?.data) {
//         setAnswersModal(prev => ({
//           ...prev,
//           answers: result.payload.data
//         }));
//       }
//     } catch (error) {
//       toast.error("حدث خطأ أثناء تحميل الإجابات");
//     }
//   };

//   const handleCloseAnswersModal = () => {
//     setAnswersModal({
//       visible: false,
//       ratingId: null,
//       ratingQuestion: "",
//       answers: [],
//     });
//     resetAnswerForm();
//   };

//   const handleOpenAddAnswer = () => {
//     setAnswerForm({
//       id: null,
//       answer: "",
//       general_rating_id: answersModal?.ratingId,
//     });
//   };

//   const handleOpenEditAnswer = (answer) => {
//     setAnswerForm({
//       id: answer.id,
//       answer: answer.answer,
//       general_rating_id: answer.general_rating_id,
//     });
//   };

//   const handleSubmitAnswer = async () => {
//     if (!answerForm.answer.trim()) {
//       toast.error("يرجى إدخال نص الإجابة");
//       return;
//     }

//     try {
//       const body = {
//         general_rating_id: answerForm.general_rating_id,
//         answer: answerForm.answer
//       };

//       if (answerForm.id) {
//         body.id = answerForm.id;
//         await dispatch(handleEditRatingAnswers({ body }));
//         toast.success("تم تحديث الإجابة بنجاح");
//       } else {
//         await dispatch(handleAddRatingAnswers({ body }));
//         toast.success("تم إضافة الإجابة بنجاح");
//       }
      
//       // تحديث قائمة الإجابات
//       const result = await dispatch(handleGetAllRatingAnswers({
//         body: { general_rating_id: answersModal?.ratingId }
//       }));
      
//       if (result.payload?.data) {
//         setAnswersModal(prev => ({
//           ...prev,
//           answers: result.payload.data
//         }));
//       }
      
//       resetAnswerForm();
//     } catch (error) {
//       toast.error("حدث خطأ أثناء حفظ الإجابة");
//     }
//   };

//   const handleDeleteAnswer = async () => {
//     try {
//       await dispatch(handleDeleteRatingAnswers({ 
//         body: { id: deleteAnswerModal.answerId }
//       }));
//       toast.success("تم حذف الإجابة بنجاح");
      
//       // تحديث قائمة الإجابات
//       const result = await dispatch(handleGetAllRatingAnswers({
//         body: { general_rating_id: answersModal?.ratingId }
//       }));
      
//       if (result.payload?.data) {
//         setAnswersModal(prev => ({
//           ...prev,
//           answers: result?.payload?.data
//         }));
//       }
      
//       setDeleteAnswerModal({ visible: false, answerId: null, answerText: "" });
//     } catch (error) {
//       toast.error("حدث خطأ أثناء حذف الإجابة");
//     }
//   };

//   const handleCloseModal = () => {
//     setIsModalVisible(false);
//     resetForm();
//   };

//   const handleAnswerChange = (index, value) => {
//     const newAnswers = [...form.answers];
//     newAnswers[index] = value;
//     setForm({ ...form, answers: newAnswers });
//   };

//   const addAnswerField = () => {
//     setForm({ ...form, answers: [...form.answers, ""] });
//   };

//   const removeAnswerField = (index) => {
//     if (form.answers.length > 1) {
//       const newAnswers = form.answers.filter((_, i) => i !== index);
//       setForm({ ...form, answers: newAnswers });
//     } else {
//       toast.warning("يجب أن يكون هناك إجابة واحدة على الأقل");
//     }
//   };

//   const validateForm = () => {
//     if (!form.question.trim()) {
//       toast.error("يرجى إدخال سؤال التقييم");
//       return false;
//     }
    
//     const nonEmptyAnswers = form.answers.filter(answer => answer.trim() !== "");
//     if (nonEmptyAnswers.length === 0) {
//       toast.error("يرجى إدخال إجابة واحدة على الأقل");
//       return false;
//     }
    
//     return true;
//   };

//   const prepareDataForSubmit = () => {
//     const filteredAnswers = form.answers.filter(answer => answer.trim() !== "");
    
//     return {
//       id: form.id,
//       question: form.question,
//       answers: filteredAnswers,
//     };
//   };

//   useEffect(() => {
//     console.log("answersModal" , answersModal?.answers)
//   } , [answersModal])

//   const handleSubmit = async () => {
//     if (!validateForm()) return;

//     try {
//       const dataToSubmit = prepareDataForSubmit();
      
//       if (isEditing) {
//         await dispatch(handleUpdateGeneralRating({body: dataToSubmit}));
//         toast.success("تم تحديث التقييم بنجاح");
//       } else {
//         await dispatch(handleAddGeneralRating({body: dataToSubmit}));
//         toast.success("تم إضافة التقييم بنجاح");
//       }
//       handleCloseModal();
//       handleGetAllData();
//     } catch (error) {
//       toast.error("حدث خطأ أثناء حفظ التقييم");
//     }
//   };

//   const handleDelete = async () => {
//     try {
//       await dispatch(handleDeleteGeneralRating({body: {
//         id: deleteModal.ratingId
//       }}));
//       toast.success("تم حذف التقييم بنجاح");
//       setDeleteModal({ visible: false, ratingId: null, ratingQuestion: "" });
//       handleGetAllData();
//     } catch (error) {
//       toast.error("حدث خطأ أثناء حذف التقييم");
//     }
//   };

//   const handleGetAllData = (page = 1) => {
//     dispatch(handleGetAllGeneralRatings({ page, per_page: pagination.per_page }));
//     setPagination(prev => ({ ...prev, current_page: page }));
//   };

//   useEffect(() => {
//     handleGetAllData();
//   }, []);

//   const filteredRatings = useMemo(() => {
//     if (!general_rating_list?.data?.message?.data) return [];
    
//     const ratings = general_rating_list?.data?.message?.data;
//     if (!searchTerm.trim()) return ratings;
    
//     return ratings.filter(rating => 
//       rating.question?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       rating.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       rating.general_answers_ratings?.some(answer => 
//         answer.answer?.toLowerCase().includes(searchTerm.toLowerCase())
//       )
//     );
//   }, [general_rating_list?.data, searchTerm]);

//   const getGenderLabel = (gender) => {
//     switch(gender) {
//       case "male": return "ذكر";
//       case "female": return "أنثى";
//       case "all": return "الكل";
//       default: return gender || "الكل";
//     }
//   };

//   const getGenderColor = (gender) => {
//     switch(gender) {
//       case "male": return "blue";
//       case "female": return "pink";
//       case "all": return "green";
//       default: return "default";
//     }
//   };

//   const getGenderIcon = (gender) => {
//     switch(gender) {
//       case "male": return "👨";
//       case "female": return "👩";
//       case "all": return "👥";
//       default: return "👤";
//     }
//   };

//   const truncateText = (text, maxLength = 50) => {
//     if (text.length <= maxLength) return text;
//     return text.substring(0, maxLength) + "...";
//   };

//   if (general_rating_loading && !general_rating_list) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <Spin size="large" spinning />
//       </div>
//     );
//   }

//   return (
//     <PageLayout>
//       <div dir="rtl" className="min-h-screen p-6 bg-gradient-to-br from-gray-50 to-gray-100">
//         <BreadcrumbsShowcase variant="pill" items={breadcrumbs} />
        
//         <PagesHeader
//           title={"إدارة التقييمات"}
//           subtitle={"أضف/عدّل/احذف أسئلة التقييم مع خيارات إجابة متعددة"}
//         />

//         <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//           <SearchAndFilters
//             mode={mode}
//             setMode={setMode}
//             searchTerm={searchTerm}
//             setSearchTerm={setSearchTerm}
//           />
          
//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={() => handleOpenModal()}
//             className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-4 py-3 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
//           >
//             <Plus size={20} />
//             <span>إضافة تقييم جديد</span>
//           </motion.button>
//         </div>

//         {/* Statistics Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//           <motion.div 
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.3 }}
//             className="bg-white rounded-xl p-6 shadow-lg border border-gray-200"
//           >
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-gray-600 text-sm">إجمالي الأسئلة</p>
//                 <h3 className="text-3xl font-bold text-gray-800 mt-2">
//                   {general_rating_list?.data?.message?.total || 0}
//                 </h3>
//               </div>
//               <div className="p-3 bg-blue-100 rounded-full">
//                 <Star className="text-blue-600" size={24} />
//               </div>
//             </div>
//           </motion.div>

//           <motion.div 
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.3, delay: 0.1 }}
//             className="bg-white rounded-xl p-6 shadow-lg border border-gray-200"
//           >
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-gray-600 text-sm">الأسئلة النشطة</p>
//                 <h3 className="text-3xl font-bold text-green-600 mt-2">
//                   {filteredRatings.filter(r => r.visible).length}
//                 </h3>
//               </div>
//               <div className="p-3 bg-green-100 rounded-full">
//                 <Eye className="text-green-600" size={24} />
//               </div>
//             </div>
//           </motion.div>

//           <motion.div 
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.3, delay: 0.2 }}
//             className="bg-white rounded-xl p-6 shadow-lg border border-gray-200"
//           >
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-gray-600 text-sm">إجمالي الإجابات</p>
//                 <h3 className="text-3xl font-bold text-purple-600 mt-2">
//                   {filteredRatings.reduce((total, rating) => 
//                     total + (rating.general_answers_ratings?.length || 0), 0
//                   )}
//                 </h3>
//               </div>
//               <div className="p-3 bg-purple-100 rounded-full">
//                 <Check className="text-purple-600" size={24} />
//               </div>
//             </div>
//           </motion.div>

//           <motion.div 
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.3, delay: 0.3 }}
//             className="bg-white rounded-xl p-6 shadow-lg border border-gray-200"
//           >
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-gray-600 text-sm">متوسط الإجابات/سؤال</p>
//                 <h3 className="text-3xl font-bold text-orange-600 mt-2">
//                   {filteredRatings.length > 0 
//                     ? (filteredRatings.reduce((total, rating) => 
//                         total + (rating.general_answers_ratings?.length || 0), 0) / filteredRatings.length
//                       ).toFixed(1)
//                     : 0}
//                 </h3>
//               </div>
//               <div className="p-3 bg-orange-100 rounded-full">
//                 <TrendingUp className="text-orange-600" size={24} />
//               </div>
//             </div>
//           </motion.div>
//         </div>

//         {/* Ratings List/Grid */}
//         <AnimatePresence mode="wait">
//           {filteredRatings.length === 0 ? (
//             <motion.div
//               key="empty"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               className="text-center py-12 bg-white rounded-xl shadow-lg"
//             >
//               <Star size={48} className="mx-auto text-gray-400 mb-4" />
//               <h3 className="text-xl font-semibold text-gray-600 mb-2">
//                 لا توجد تقييمات
//               </h3>
//               <p className="text-gray-500">
//                 {searchTerm ? "لا توجد نتائج مطابقة للبحث" : "قم بإضافة أول سؤال تقييم الآن"}
//               </p>
//             </motion.div>
//           ) : mode === "grid" ? (
//             <motion.div
//               key="grid"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
//             >
//               {filteredRatings.map((rating, index) => (
//                 <motion.div
//                   key={rating.id}
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.3, delay: index * 0.1 }}
//                   whileHover={{ y: -5, transition: { duration: 0.2 } }}
//                 >
//                   <Card className="h-full hover:shadow-xl transition-shadow duration-300 border border-gray-200 rounded-xl overflow-hidden">
//                     <div className="flex justify-between items-start mb-4">
//                       <Tag 
//                         color={getGenderColor(rating.gender)}
//                         className="flex items-center gap-1"
//                       >
//                         {getGenderIcon(rating.gender)} {getGenderLabel(rating.gender)}
//                       </Tag>
//                       <Badge 
//                         count={rating.general_answers_ratings?.length || 0}
//                         className="bg-blue-100 text-blue-600"
//                       />
//                     </div>
                    
//                     <h3 className="font-bold text-lg text-gray-800 mb-3 line-clamp-2">
//                       {rating.question}
//                     </h3>
                    
//                     {rating.description && (
//                       <p className="text-gray-600 mb-4 line-clamp-3">
//                         {rating.description}
//                       </p>
//                     )}
                    
//                     <div className="mb-4">
//                       <p className="text-sm text-gray-500 mb-2">عرض الإجابات:</p>
//                       <div className="space-y-2 max-h-40 overflow-y-auto p-2 bg-gray-50 rounded-lg">
//                         {rating.general_answers_ratings?.slice(0, 3).map((answer, idx) => (
//                           <div 
//                             key={answer.id}
//                             className="flex items-center justify-between p-2 bg-white rounded border border-gray-200 hover:bg-blue-50 transition-colors"
//                           >
//                             <div className="flex items-center gap-2 flex-1 min-w-0">
//                               <span className="w-6 h-6 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full text-xs">
//                                 {idx + 1}
//                               </span>
//                               <Tooltip title={answer.answer} placement="right">
//                                 <span className="text-sm text-gray-700 truncate">
//                                   {truncateText(answer.answer, 40)}
//                                 </span>
//                               </Tooltip>
//                             </div>
//                             <Button
//                               type="text"
//                               size="small"
//                               onClick={(e) => {
//                                 e.stopPropagation();
//                                 navigator.clipboard.writeText(answer.answer);
//                                 toast.success("تم نسخ الإجابة");
//                               }}
//                               icon={<Copy size={14} />}
//                               className="text-gray-500 hover:text-blue-600"
//                             />
//                           </div>
//                         ))}
                        
//                         {rating.general_answers_ratings?.length > 3 && (
//                           <Button
//                             type="dashed"
//                             block
//                             onClick={() => handleOpenAnswersModal(rating)}
//                             className="text-blue-600 border-blue-200 hover:border-blue-400"
//                           >
//                             عرض المزيد ({rating.general_answers_ratings.length - 3}) إجابات أخرى
//                           </Button>
//                         )}
                        
//                         {rating.general_answers_ratings?.length <= 3 && rating.general_answers_ratings?.length > 0 && (
//                           <Button
//                             type="text"
//                             block
//                             onClick={() => setAnswers(rating?.answers)}
//                             className="text-blue-600 hover:text-blue-800"
//                           >
//                             عرض كامل الإجابات
//                           </Button>
//                         )}
//                       </div>
//                     </div>
                    
//                     <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
//                       <Tooltip title="إدارة الإجابات">
//                         <button
//                           onClick={() => setAnswers(rating?.answers)}
//                           className="flex items-center gap-1 px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
//                         >
//                           <MessageSquare size={16} />
//                           <span>الإجابات</span>
//                         </button>
//                       </Tooltip>

//                       <button
//                         onClick={() => handleOpenModal(rating)}
//                         className="flex items-center gap-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
//                       >
//                         <Edit3 size={16} />
//                         تعديل
//                       </button>

//                       <button
//                         onClick={() => setDeleteModal({
//                           visible: true,
//                           ratingId: rating.id,
//                           ratingQuestion: rating.question
//                         })}
//                         className="flex items-center gap-1 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
//                       >
//                         <Trash2 size={16} />
//                         حذف
//                       </button>
//                     </div>
//                   </Card>
//                 </motion.div>
//               ))}
//             </motion.div>
//           ) : (
//             <motion.div
//               key="list"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               className="bg-white rounded-xl shadow-lg overflow-hidden"
//             >
//               <div className="overflow-x-auto">
//                 <table className="w-full">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th className="py-3 px-4 text-right text-sm font-semibold text-gray-600">السؤال</th>
//                       <th className="py-3 px-4 text-right text-sm font-semibold text-gray-600">الجنس</th>
//                       <th className="py-3 px-4 text-right text-sm font-semibold text-gray-600">عدد الإجابات</th>
//                       <th className="py-3 px-4 text-right text-sm font-semibold text-gray-600">عينة من الإجابات</th>
//                       <th className="py-3 px-4 text-right text-sm font-semibold text-gray-600">الإجراءات</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {filteredRatings?.map((rating) => (
//                       <tr key={rating.id} className="border-t border-gray-100 hover:bg-gray-50">
//                         <td className="py-4 px-4">
//                           <div>
//                             <h4 className="font-medium text-gray-800">{rating.question}</h4>
//                             {rating.description && (
//                               <p className="text-sm text-gray-600 mt-1 line-clamp-1">
//                                 {rating.description}
//                               </p>
//                             )}
//                           </div>
//                         </td>
//                         <td className="py-4 px-4">
//                           <Tag color={getGenderColor(rating.gender)}>
//                             {getGenderIcon(rating.gender)} {getGenderLabel(rating.gender)}
//                           </Tag>
//                         </td>
//                         <td className="py-4 px-4">
//                           <div className="flex items-center gap-2">
//                             <div className="w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full">
//                               {rating.general_answers_ratings?.length || 0}
//                             </div>
//                             <span className="text-gray-700">إجابة</span>
//                           </div>
//                         </td>
//                         <td className="py-4 px-4">
//                           <div className="max-w-xs">
//                             {rating.general_answers_ratings?.slice(0, 2).map((answer, idx) => (
//                               <div key={answer.id} className="mb-1">
//                                 <Tooltip title={answer.answer}>
//                                   <span className="text-xs px-2 py-1 bg-gray-100 rounded inline-block max-w-full truncate">
//                                     {idx + 1}. {truncateText(answer.answer, 30)}
//                                   </span>
//                                 </Tooltip>
//                               </div>
//                             ))}
//                             {rating.general_answers_ratings?.length > 2 && (
//                               <Button
//                                 type="link"
//                                 size="small"
//                                 onClick={() => handleOpenAnswersModal(rating)}
//                                 className="p-0 text-xs text-blue-600"
//                               >
//                                 +{rating.general_answers_ratings.length - 2} أكثر
//                               </Button>
//                             )}
//                           </div>
//                         </td>
//                         <td className="py-4 px-4">
//                           <div className="flex items-center gap-2">
//                             <Tooltip title="إدارة الإجابات">
//                               <button
//                                 onClick={() => handleOpenAnswersModal(rating)}
//                                 className="p-2 hover:bg-green-50 rounded-lg text-green-600"
//                               >
//                                 <MessageSquare size={18} />
//                               </button>
//                             </Tooltip>
                            
//                             <button
//                               onClick={() => handleOpenModal(rating)}
//                               className="p-2 hover:bg-blue-50 rounded-lg text-blue-600"
//                               title="تعديل"
//                             >
//                               <Edit3 size={18} />
//                             </button>
//                             <button
//                               onClick={() => setDeleteModal({
//                                 visible: true,
//                                 ratingId: rating.id,
//                                 ratingQuestion: rating.question
//                               })}
//                               className="p-2 hover:bg-red-50 rounded-lg text-red-600"
//                               title="حذف"
//                             >
//                               <Trash2 size={18} />
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>

//         {/* Pagination */}
//         {general_rating_list?.data?.message?.last_page > 1 && (
//           <div className="flex justify-center items-center gap-4 mt-8">
//             <button
//               onClick={() => handleGetAllData(pagination.current_page - 1)}
//               disabled={pagination.current_page === 1}
//               className={`flex items-center gap-1 px-4 py-2 rounded-lg ${pagination.current_page === 1 ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
//             >
//               <ChevronRight size={18} />
//               السابق
//             </button>
            
//             <div className="flex items-center gap-2">
//               {Array.from({ length: general_rating_list.data.message.last_page }, (_, i) => i + 1)
//                 .filter(page => 
//                   page === 1 || 
//                   page === general_rating_list.data.message.last_page ||
//                   Math.abs(page - pagination.current_page) <= 1
//                 )
//                 .map((page, index, array) => (
//                   <React.Fragment key={page}>
//                     {index > 0 && array[index - 1] !== page - 1 && (
//                       <span className="px-2">...</span>
//                     )}
//                     <button
//                       onClick={() => handleGetAllData(page)}
//                       className={`px-3 py-1 rounded-lg ${pagination.current_page === page ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
//                     >
//                       {page}
//                     </button>
//                   </React.Fragment>
//                 ))}
//             </div>
            
//             <button
//               onClick={() => handleGetAllData(pagination.current_page + 1)}
//               disabled={pagination.current_page === general_rating_list.data.message.last_page}
//               className={`flex items-center gap-1 px-4 py-2 rounded-lg ${pagination.current_page === general_rating_list.data.message.last_page ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
//             >
//               التالي
//               <ChevronLeft size={18} />
//             </button>
//           </div>
//         )}

//         {/* Add/Edit Rating Modal */}
//         <Modal
//           title={
//             <div className="flex items-center gap-2">
//               <Star className="text-yellow-500" />
//               <span>{isEditing ? 'تعديل سؤال التقييم' : 'إضافة سؤال تقييم جديد'}</span>
//             </div>
//           }
//           open={isModalVisible}
//           onCancel={handleCloseModal}
//           footer={[
//             <Button key="cancel" onClick={handleCloseModal}>
//               إلغاء
//             </Button>,
//             <Button
//               key="submit"
//               type="primary"
//               loading={add_rating_loading || update_rating_loading}
//               onClick={handleSubmit}
//               className="bg-blue-600 hover:bg-blue-700"
//             >
//               {isEditing ? 'تحديث' : 'إضافة'}
//             </Button>,
//           ]}
//           centered
//           width={700}
//           className="rounded-xl"
//         >
//           <div className="space-y-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 سؤال التقييم *
//               </label>
//               <Input
//                 value={form.question}
//                 onChange={(e) => setForm({ ...form, question: e.target.value })}
//                 placeholder="أدخل سؤال التقييم"
//                 className="rounded-lg"
//                 size="large"
//               />
//             </div>
   
//             <div>
//               <div className="flex justify-between items-center mb-4">
//                 <label className="block text-sm font-medium text-gray-700">
//                   خيارات الإجابة *
//                 </label>
//                 <Button
//                   type="dashed"
//                   onClick={addAnswerField}
//                   icon={<Plus size={16} />}
//                   className="flex items-center gap-1"
//                 >
//                   إضافة إجابة
//                 </Button>
//               </div>
              
//               <div className="space-y-3">
//                 {form.answers.map((answer, index) => (
//                   <div key={index} className="flex items-center gap-2">
//                     <div className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-lg">
//                       {index + 1}
//                     </div>
//                     <Input
//                       value={answer}
//                       onChange={(e) => handleAnswerChange(index, e.target.value)}
//                       placeholder={`الإجابة ${index + 1}`}
//                       className="flex-1 rounded-lg"
//                     />
//                     {form.answers.length > 1 && (
//                       <Button
//                         type="text"
//                         danger
//                         onClick={() => removeAnswerField(index)}
//                         icon={<X size={16} />}
//                         className="text-red-500 hover:text-red-700"
//                       />
//                     )}
//                   </div>
//                 ))}
//               </div>
              
//               <p className="text-sm text-gray-500 mt-3">
//                 ملاحظة: يمكن ترك الإجابات الفارغة وسيتم تجاهلها
//               </p>
//             </div>
//           </div>
//         </Modal>

//         {/* Answers Management Modal */}
//         <Modal
//           title={
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-2">
//                 <MessageSquare className="text-green-500" />
//                 <span>إدارة إجابات السؤال</span>
//               </div>
//               <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
//                 {answers?.length}
//               </div>
//             </div>
//           }
//           open={answers}
//           onCancel={() => setAnswers(null)}
//           footer={null}
//           centered
//           width={900}
//           className="rounded-xl"
//         >
//           <div className="space-y-6">
           
//             {/* Answers List */}
//             <div>
//               <div className="flex justify-between items-center mb-4">
//                 <h4 className="font-medium text-gray-800">
//                   قائمة الإجابات ({answers?.length})
//                 </h4>
//                 {/* {!answerForm?.id && (
//                   <Button
//                     type="dashed"
//                     // onClick={handleOpenAddAnswer}
//                     // icon={<Plus size={16} />}
//                     className="flex items-center gap-1"
//                   >
//                     إضافة إجابة
//                   </Button>
//                 )} */}
//               </div>

//               {get_rating_answers_loading ? (
//                 <div className="text-center py-8">
//                   <Spin size="large" />
//                 </div>
//               ) : answers?.length === 0 ? (
//                 <div className="text-center py-8 bg-gray-50 rounded-lg">
//                   <MessageSquare size={48} className="mx-auto text-gray-400 mb-4" />
//                   <p className="text-gray-600">لا توجد إجابات لهذا السؤال</p>
//                   {/* <Button
//                     type="primary"
//                     onClick={handleOpenAddAnswer}
//                     className="mt-4 bg-blue-600 hover:bg-blue-700"
//                   >
//                     إضافة أول إجابة
//                   </Button> */}
//                 </div>
//               ) : (
//                 <div className="space-y-3 max-h-96 overflow-y-auto p-2">
//                   {Array.isArray(answers)  && answers?.length > 0 &&  answers?.map((answer, index) => (
//                     <motion.div
//                       key={answer.id}
//                       initial={{ opacity: 0, x: -20 }}
//                       animate={{ opacity: 1, x: 0 }}
//                       transition={{ duration: 0.3, delay: index * 0.05 }}
//                       className="group relative"
//                     >
//                       <div className={`p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-all ${answerForm.id === answer.id ? 'ring-2 ring-blue-500' : ''}`}>
//                         <div className="flex justify-between items-start">
//                           <div className="flex-1 min-w-0">
//                             <div className="flex items-center gap-3 mb-2">
//                               <span className="w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full text-sm">
//                                 {index + 1}
//                               </span>
//                               <span className="text-sm text-gray-500">
//                                 #{answer.id}
//                               </span>
//                             </div>
//                             <p className="text-gray-800 whitespace-pre-wrap break-words">
//                               {answer?.answer}
//                             </p>
//                           </div>
                          
//                           <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
//                             <Tooltip title="نسخ النص">
//                               <Button
//                                 type="text"
//                                 size="small"
//                                 onClick={() => {
//                                   navigator.clipboard.writeText(answer?.answer);
//                                   toast.success("تم نسخ الإجابة");
//                                 }}
//                                 icon={<Copy size={14} />}
//                                 className="text-gray-500 hover:text-blue-600"
//                               />
//                             </Tooltip>
                            
//                             <Tooltip title="تعديل">
//                               <Button
//                                 type="text"
//                                 size="small"
//                                 onClick={() => handleOpenEditAnswer(answer)}
//                                 icon={<Edit3 size={14} />}
//                                 className="text-gray-500 hover:text-green-600"
//                               />
//                             </Tooltip>
                            
//                             <Tooltip title="حذف">
//                               <Button
//                                 type="text"
//                                 danger
//                                 size="small"
//                                 onClick={() => setDeleteAnswerModal({
//                                   visible: true,
//                                   answerId: answer.id,
//                                   answerText: answer.answer
//                                 })}
//                                 icon={<Trash2 size={14} />}
//                               />
//                             </Tooltip>
//                           </div>
//                         </div>
//                       </div>
//                     </motion.div>
//                   ))}
//                 </div>
//               )}
//             </div>

//             <Alert
//               message="معلومات"
//               description="يمكنك إضافة وتعديل وحذف إجابات هذا السؤال. الإجابات الطويلة ستظهر بشكل كامل هنا."
//               type="info"
//               showIcon
//               className="mt-4"
//             />
//           </div>
//         </Modal>

//         {/* Delete Rating Modal */}
//         <Modal
//           title="تأكيد الحذف"
//           open={deleteModal.visible}
//           onCancel={() => setDeleteModal({ visible: false, ratingId: null, ratingQuestion: "" })}
//           footer={[
//             <Button key="cancel" onClick={() => setDeleteModal({ visible: false, ratingId: null, ratingQuestion: "" })}>
//               إلغاء
//             </Button>,
//             <Button
//               key="delete"
//               danger
//               loading={delete_rating_loading}
//               onClick={handleDelete}
//             >
//               حذف
//             </Button>,
//           ]}
//           centered
//         >
//           <div className="text-center py-4">
//             <Trash2 size={48} className="mx-auto text-red-500 mb-4" />
//             <h4 className="text-lg font-semibold text-gray-800 mb-2">
//               هل أنت متأكد من حذف هذا السؤال؟
//             </h4>
//             <p className="text-gray-600">
//               "{deleteModal.ratingQuestion}"
//             </p>
//             <Alert
//               message="تحذير"
//               description="سيتم حذف جميع الإجابات المرتبطة بهذا السؤال أيضاً"
//               type="warning"
//               showIcon
//               className="mt-4"
//             />
//           </div>
//         </Modal>

//         {/* Delete Answer Modal */}
//         <Modal
//           title="تأكيد حذف الإجابة"
//           open={deleteAnswerModal.visible}
//           onCancel={() => setDeleteAnswerModal({ visible: false, answerId: null, answerText: "" })}
//           footer={[
//             <Button key="cancel" onClick={() => setDeleteAnswerModal({ visible: false, answerId: null, answerText: "" })}>
//               إلغاء
//             </Button>,
//             <Button
//               key="delete"
//               danger
//               loading={delete_rating_answers_loading}
//               onClick={handleDeleteAnswer}
//             >
//               حذف
//             </Button>,
//           ]}
//           centered
//           width={500}
//         >
//           <div className="text-center py-4">
//             <Trash2 size={48} className="mx-auto text-red-500 mb-4" />
//             <h4 className="text-lg font-semibold text-gray-800 mb-2">
//               هل أنت متأكد من حذف هذه الإجابة؟
//             </h4>
//             <div className="bg-gray-100 p-4 rounded-lg my-4 max-h-40 overflow-y-auto">
//               <p className="text-gray-800 whitespace-pre-wrap">
//                 {deleteAnswerModal.answerText}
//               </p>
//             </div>
//             <p className="text-red-500 text-sm">
//               هذا الإجراء لا يمكن التراجع عنه
//             </p>
//           </div>
//         </Modal>
//       </div>
//     </PageLayout>
//   );
// }

"use client";
import React, { useEffect, useState, useMemo } from "react";
import {
  BarChart3,
  Star,
  Eye,
  EyeOff,
  Edit3,
  Trash2,
  Grid3X3,
  List,
  Plus,
  Filter,
  Search,
  Users,
  TrendingUp,
  ChevronRight,
  ChevronLeft,
  X,
  Check,
  MessageSquare,
  MoreHorizontal,
  Copy,
  ExternalLink,
} from "lucide-react";
import BreadcrumbsShowcase from "@/components/ui/BreadCrumbs";
import PagesHeader from "@/components/ui/PagesHeader";
import SearchAndFilters from "@/components/ui/SearchAndFilters";
import { useDispatch, useSelector } from "react-redux";
import { 
  handleGetAllGeneralRatings,
  handleAddRating as handleAddGeneralRating,
  handleEditRating as handleUpdateGeneralRating,
  handleDeleteRating as handleDeleteGeneralRating,
  handleGetAllRatingAnswers,
  handleAddRatingAnswers,
  handleEditRatingAnswers,
  handleDeleteRatingAnswers,
} from "../../../lib/features/ratingSlice";
import { 
  Spin, Modal, message, Rate, Select, Input, Button, Card, Tag, Avatar, Space, 
  Tooltip, Popover, Form, Collapse, Badge, Alert
} from "antd";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

const { TextArea } = Input;
const { Option } = Select;
const { Panel } = Collapse;

const breadcrumbs = [
  { label: "الرئيسية", href: "/", icon: BarChart3 },
  { label: "التقييم", href: "/rating", icon: Star, current: true },
];

const PageLayout = ({ children }) => <div className="w-full">{children}</div>;

export default function RatingPage() {
  const dispatch = useDispatch();
  const { 
    general_rating_loading, 
    general_rating_list,
    add_rating_loading,
    update_rating_loading,
    delete_rating_loading,
    get_rating_answers_loading,
    add_rating_answers_loading,
    edit_rating_answers_loading,
    delete_rating_answers_loading,
    get_rating_answers_list,
  } = useSelector(state => state?.rating);

  const [form, setForm] = useState({
    id: null,
    question: "",
    description: "",
    answers: ["", "", ""],
    gender: "all",
    visible: true,
  });
  
  const [answersModal, setAnswersModal] = useState({
    visible: false,
    ratingId: null,
    ratingQuestion: "",
    answers: [],
  });
  
  const [answerForm, setAnswerForm] = useState({
    id: null,
    answer: "",
    general_rating_id: null,
  });
  
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [mode, setMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 10,
  });
  const [deleteModal, setDeleteModal] = useState({
    visible: false,
    ratingId: null,
    ratingQuestion: "",
  });
  
  const [deleteAnswerModal, setDeleteAnswerModal] = useState({
    visible: false,
    answerId: null,
    answerText: "",
  });

  const resetForm = () => {
    setForm({
      id: null,
      question: "",
      description: "",
      answers: ["", "", ""],
      gender: "all",
      visible: true,
    });
    setIsEditing(false);
  };

  const resetAnswerForm = () => {
    setAnswerForm({
      id: null,
      answer: "",
      general_rating_id: null,
    });
  };

  const handleOpenModal = (rating = null) => {
    if (rating) {
      const answersArray = rating.general_answers_ratings?.map(answer => answer.answer) || [];
      while (answersArray.length < 3) {
        answersArray.push("");
      }
      
      setForm({
        id: rating.id,
        question: rating.question,
        description: rating.description || "",
        answers: answersArray,
        gender: rating.gender || "all",
        visible: rating.visible ?? true,
      });
      setIsEditing(true);
    } else {
      resetForm();
    }
    setIsModalVisible(true);
  };

  const handleOpenAnswersModal = async (rating) => {
    try {
      // تعيين البيانات الأولية من السؤال
      setAnswersModal({
        visible: true,
        ratingId: rating.id,
        ratingQuestion: rating.question,
        answers: rating.general_answers_ratings || [],
      });
      
      // جلب أحدث الإجابات من السيرفر
      const result = await dispatch(handleGetAllRatingAnswers({
        body: { general_rating_id: rating.id }
      }));
      
      // التحقق من هيكل البيانات المستلمة
      console.log("API Response for answers:", result);
      
      // تحديث الإجابات بناءً على هيكل الاستجابة
      if (result.payload?.data?.data) {
        // الحالة: { data: { data: [...] } }
        setAnswersModal(prev => ({
          ...prev,
          answers: result.payload.data.data
        }));
      } else if (result.payload?.data) {
        // الحالة: { data: [...] }
        setAnswersModal(prev => ({
          ...prev,
          answers: result.payload.data
        }));
      } else if (Array.isArray(result.payload)) {
        // الحالة: [...]
        setAnswersModal(prev => ({
          ...prev,
          answers: result.payload
        }));
      }
    } catch (error) {
      console.error("Error loading answers:", error);
      toast.error("حدث خطأ أثناء تحميل الإجابات");
    }
  };

  const handleCloseAnswersModal = () => {
    setAnswersModal({
      visible: false,
      ratingId: null,
      ratingQuestion: "",
      answers: [],
    });
    resetAnswerForm();
  };

  const handleOpenAddAnswer = () => {
    setAnswerForm({
      id: null,
      answer: "",
      general_rating_id: answersModal.ratingId,
    });
  };

  const handleOpenEditAnswer = (answer) => {
    setAnswerForm({
      id: answer.id,
      answer: answer.answer,
      general_rating_id: answer.general_rating_id,
    });
  };

  const handleSubmitAnswer = async () => {
    if (!answerForm.answer.trim()) {
      toast.error("يرجى إدخال نص الإجابة");
      return;
    }

    try {
      const body = {
        general_rating_id: answerForm.general_rating_id,
        answer: answerForm.answer
      };

      if (answerForm.id) {
        body.id = answerForm.id;
        await dispatch(handleEditRatingAnswers({ body }));
        toast.success("تم تحديث الإجابة بنجاح");
      } else {
        await dispatch(handleAddRatingAnswers({ body }));
        toast.success("تم إضافة الإجابة بنجاح");
      }
      
      // تحديث قائمة الإجابات
      await refreshAnswersList();
      resetAnswerForm();
    } catch (error) {
      console.error("Error saving answer:", error);
      toast.error("حدث خطأ أثناء حفظ الإجابة");
    }
  };

  const refreshAnswersList = async () => {
    if (!answersModal.ratingId) return;
    
    try {
      const result = await dispatch(handleGetAllRatingAnswers({
        body: { general_rating_id: answersModal.ratingId }
      }));
      
      // تحديث الإجابات بناءً على هيكل الاستجابة
      if (result.payload?.data?.data) {
        setAnswersModal(prev => ({
          ...prev,
          answers: result.payload.data.data
        }));
      } else if (result.payload?.data) {
        setAnswersModal(prev => ({
          ...prev,
          answers: result.payload.data
        }));
      } else if (Array.isArray(result.payload)) {
        setAnswersModal(prev => ({
          ...prev,
          answers: result.payload
        }));
      }
    } catch (error) {
      console.error("Error refreshing answers:", error);
    }
  };

  const handleDeleteAnswer = async () => {
    try {
      await dispatch(handleDeleteRatingAnswers({ 
        body: { id: deleteAnswerModal.answerId }
      }));
      toast.success("تم حذف الإجابة بنجاح");
      
      // تحديث قائمة الإجابات
      await refreshAnswersList();
      setDeleteAnswerModal({ visible: false, answerId: null, answerText: "" });
    } catch (error) {
      console.error("Error deleting answer:", error);
      toast.error("حدث خطأ أثناء حذف الإجابة");
    }
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    resetForm();
  };

  const handleAnswerChange = (index, value) => {
    const newAnswers = [...form.answers];
    newAnswers[index] = value;
    setForm({ ...form, answers: newAnswers });
  };

  const addAnswerField = () => {
    setForm({ ...form, answers: [...form.answers, ""] });
  };

  const removeAnswerField = (index) => {
    if (form.answers.length > 1) {
      const newAnswers = form.answers.filter((_, i) => i !== index);
      setForm({ ...form, answers: newAnswers });
    } else {
      toast.warning("يجب أن يكون هناك إجابة واحدة على الأقل");
    }
  };

  const validateForm = () => {
    if (!form.question.trim()) {
      toast.error("يرجى إدخال سؤال التقييم");
      return false;
    }
    
    const nonEmptyAnswers = form.answers.filter(answer => answer.trim() !== "");
    if (nonEmptyAnswers.length === 0) {
      toast.error("يرجى إدخال إجابة واحدة على الأقل");
      return false;
    }
    
    return true;
  };

  const prepareDataForSubmit = () => {
    const filteredAnswers = form.answers.filter(answer => answer.trim() !== "");
    
    return {
      id: form.id,
      question: form.question,
      answers: filteredAnswers,
    };
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const dataToSubmit = prepareDataForSubmit();
      
      if (isEditing) {
        await dispatch(handleUpdateGeneralRating({body: dataToSubmit}));
        toast.success("تم تحديث التقييم بنجاح");
      } else {
        await dispatch(handleAddGeneralRating({body: dataToSubmit}));
        toast.success("تم إضافة التقييم بنجاح");
      }
      handleCloseModal();
      handleGetAllData();
    } catch (error) {
      console.error("Error saving rating:", error);
      toast.error("حدث خطأ أثناء حفظ التقييم");
    }
  };

  const handleDelete = async () => {
    try {
      await dispatch(handleDeleteGeneralRating({body: {
        id: deleteModal.ratingId
      }}));
      toast.success("تم حذف التقييم بنجاح");
      setDeleteModal({ visible: false, ratingId: null, ratingQuestion: "" });
      handleGetAllData();
    } catch (error) {
      console.error("Error deleting rating:", error);
      toast.error("حدث خطأ أثناء حذف التقييم");
    }
  };

  const handleGetAllData = (page = 1) => {
    dispatch(handleGetAllGeneralRatings({ page, per_page: pagination.per_page }));
    setPagination(prev => ({ ...prev, current_page: page }));
  };

  useEffect(() => {
    handleGetAllData();
  }, []);

  // استخدام useMemo لمراقبة تغييرات get_rating_answers_list
  useEffect(() => {
    if (get_rating_answers_list?.data && answersModal.visible) {
      console.log("Updated answers list from Redux:", get_rating_answers_list);
      
      // تحديث الإجابات في المودال عند تغيير Redux state
      if (get_rating_answers_list.data.data) {
        setAnswersModal(prev => ({
          ...prev,
          answers: get_rating_answers_list.data.data
        }));
      } else if (Array.isArray(get_rating_answers_list.data)) {
        setAnswersModal(prev => ({
          ...prev,
          answers: get_rating_answers_list.data
        }));
      }
    }
  }, [get_rating_answers_list, answersModal.visible]);

  const filteredRatings = useMemo(() => {
    if (!general_rating_list?.data?.message?.data) return [];
    
    const ratings = general_rating_list?.data?.message?.data;
    if (!searchTerm.trim()) return ratings;
    
    return ratings.filter(rating => 
      rating.question?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rating.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rating.general_answers_ratings?.some(answer => 
        answer.answer?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [general_rating_list?.data, searchTerm]);

  // وظيفة مساعدة للحصول على الإجابات للعرض
  const getAnswersForDisplay = useMemo(() => {
    if (!answersModal.answers) return [];
    
    // إذا كانت الإجابات تحتوي على خاصية data
    if (answersModal.answers.data && Array.isArray(answersModal.answers.data)) {
      return answersModal.answers.data;
    }
    
    // إذا كانت الإجابات مصفوفة مباشرة
    if (Array.isArray(answersModal.answers)) {
      return answersModal.answers;
    }
    
    // إذا كانت تحتوي على message
    if (answersModal.answers.message && Array.isArray(answersModal.answers.message)) {
      return answersModal.answers.message;
    }
    
    return [];
  }, [answersModal.answers]);

  const getGenderLabel = (gender) => {
    switch(gender) {
      case "male": return "ذكر";
      case "female": return "أنثى";
      case "all": return "الكل";
      default: return gender || "الكل";
    }
  };

  const getGenderColor = (gender) => {
    switch(gender) {
      case "male": return "blue";
      case "female": return "pink";
      case "all": return "green";
      default: return "default";
    }
  };

  const getGenderIcon = (gender) => {
    switch(gender) {
      case "male": return "👨";
      case "female": return "👩";
      case "all": return "👥";
      default: return "👤";
    }
  };

  const truncateText = (text, maxLength = 50) => {
    if (!text || typeof text !== 'string') return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  if (general_rating_loading && !general_rating_list) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" spinning />
      </div>
    );
  }

  return (
    <PageLayout>
      <div dir="rtl" className="min-h-screen p-6 bg-gradient-to-br from-gray-50 to-gray-100">
        <BreadcrumbsShowcase variant="pill" items={breadcrumbs} />
        
        <PagesHeader
          title={"إدارة التقييمات"}
          subtitle={"أضف/عدّل/احذف أسئلة التقييم مع خيارات إجابة متعددة"}
        />

        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <SearchAndFilters
            mode={mode}
            setMode={setMode}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-4 py-3 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <Plus size={20} />
            <span>إضافة تقييم جديد</span>
          </motion.button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl p-6 shadow-lg border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">إجمالي الأسئلة</p>
                <h3 className="text-3xl font-bold text-gray-800 mt-2">
                  {general_rating_list?.data?.message?.total || 0}
                </h3>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Star className="text-blue-600" size={24} />
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-white rounded-xl p-6 shadow-lg border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">الأسئلة النشطة</p>
                <h3 className="text-3xl font-bold text-green-600 mt-2">
                  {filteredRatings.filter(r => r.visible).length}
                </h3>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Eye className="text-green-600" size={24} />
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-white rounded-xl p-6 shadow-lg border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">إجمالي الإجابات</p>
                <h3 className="text-3xl font-bold text-purple-600 mt-2">
                  {filteredRatings.reduce((total, rating) => 
                    total + (rating.general_answers_ratings?.length || 0), 0
                  )}
                </h3>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Check className="text-purple-600" size={24} />
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="bg-white rounded-xl p-6 shadow-lg border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">متوسط الإجابات/سؤال</p>
                <h3 className="text-3xl font-bold text-orange-600 mt-2">
                  {filteredRatings.length > 0 
                    ? (filteredRatings.reduce((total, rating) => 
                        total + (rating.general_answers_ratings?.length || 0), 0) / filteredRatings.length
                      ).toFixed(1)
                    : 0}
                </h3>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <TrendingUp className="text-orange-600" size={24} />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Ratings List/Grid */}
        <AnimatePresence mode="wait">
          {filteredRatings?.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12 bg-white rounded-xl shadow-lg"
            >
              <Star size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                لا توجد تقييمات
              </h3>
              <p className="text-gray-500">
                {searchTerm ? "لا توجد نتائج مطابقة للبحث" : "قم بإضافة أول سؤال تقييم الآن"}
              </p>
            </motion.div>
          ) : 
          mode === "grid" ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredRatings.map((rating, index) => (
                <motion.div
                  key={rating.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <Card className="h-full hover:shadow-xl transition-shadow duration-300 border border-gray-200 rounded-xl overflow-hidden">
                    <div className="flex justify-between items-start mb-4">
                      <Tag 
                        color={getGenderColor(rating.gender)}
                        className="flex items-center gap-1"
                      >
                        {getGenderIcon(rating.gender)} {getGenderLabel(rating.gender)}
                      </Tag>
                      <Badge 
                        count={rating.general_answers_ratings?.length || 0}
                        className="bg-blue-100 text-blue-600"
                      />
                    </div>
                    
                    <h3 className="font-bold text-lg text-gray-800 mb-3 line-clamp-2">
                      {rating.question}
                    </h3>
                    
                    {rating.description && (
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {rating.description}
                      </p>
                    )}
                    
                    <div className="mb-4">
                      <p className="text-sm text-gray-500 mb-2">عرض الإجابات:</p>
                      <div className="space-y-2 max-h-40 overflow-y-auto p-2 bg-gray-50 rounded-lg">
                        {rating.general_answers_ratings?.slice(0, 3).map((answer, idx) => (
                          <div 
                            key={answer.id}
                            className="flex items-center justify-between p-2 bg-white rounded border border-gray-200 hover:bg-blue-50 transition-colors"
                          >
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <span className="w-6 h-6 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full text-xs">
                                {idx + 1}
                              </span>
                              <Tooltip title={answer.answer} placement="right">
                                <span className="text-sm text-gray-700 truncate">
                                  {truncateText(answer.answer, 40)}
                                </span>
                              </Tooltip>
                            </div>
                            <Button
                              type="text"
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigator.clipboard.writeText(answer.answer);
                                toast.success("تم نسخ الإجابة");
                              }}
                              icon={<Copy size={14} />}
                              className="text-gray-500 hover:text-blue-600"
                            />
                          </div>
                        ))}
                        
                        {rating.general_answers_ratings?.length > 3 && (
                          <Button
                            type="dashed"
                            block
                            onClick={() => handleOpenAnswersModal(rating)}
                            className="text-blue-600 border-blue-200 hover:border-blue-400"
                          >
                            عرض المزيد ({rating.general_answers_ratings.length - 3}) إجابات أخرى
                          </Button>
                        )}
                        
                        {rating.general_answers_ratings?.length <= 3 && rating.general_answers_ratings?.length > 0 && (
                          <Button
                            type="text"
                            block
                            onClick={() => handleOpenAnswersModal(rating)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            عرض كامل الإجابات
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                      <Tooltip title="إدارة الإجابات">
                        <button
                          onClick={() => handleOpenAnswersModal(rating)}
                          className="flex items-center gap-1 px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                        >
                          <MessageSquare size={16} />
                          <span>الإجابات</span>
                        </button>
                      </Tooltip>

                      <button
                        onClick={() => handleOpenModal(rating)}
                        className="flex items-center gap-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        <Edit3 size={16} />
                        تعديل
                      </button>

                      <button
                        onClick={() => setDeleteModal({
                          visible: true,
                          ratingId: rating.id,
                          ratingQuestion: rating.question
                        })}
                        className="flex items-center gap-1 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                      >
                        <Trash2 size={16} />
                        حذف
                      </button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="py-3 px-4 text-right text-sm font-semibold text-gray-600">السؤال</th>
                      <th className="py-3 px-4 text-right text-sm font-semibold text-gray-600">الجنس</th>
                      <th className="py-3 px-4 text-right text-sm font-semibold text-gray-600">عدد الإجابات</th>
                      <th className="py-3 px-4 text-right text-sm font-semibold text-gray-600">عينة من الإجابات</th>
                      <th className="py-3 px-4 text-right text-sm font-semibold text-gray-600">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRatings?.map((rating) => (
                      <tr key={rating.id} className="border-t border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <div>
                            <h4 className="font-medium text-gray-800">{rating.question}</h4>
                            {rating.description && (
                              <p className="text-sm text-gray-600 mt-1 line-clamp-1">
                                {rating.description}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <Tag color={getGenderColor(rating.gender)}>
                            {getGenderIcon(rating.gender)} {getGenderLabel(rating.gender)}
                          </Tag>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full">
                              {rating.general_answers_ratings?.length || 0}
                            </div>
                            <span className="text-gray-700">إجابة</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="max-w-xs">
                            {rating.general_answers_ratings?.slice(0, 2).map((answer, idx) => (
                              <div key={answer.id} className="mb-1">
                                <Tooltip title={answer.answer}>
                                  <span className="text-xs px-2 py-1 bg-gray-100 rounded inline-block max-w-full truncate">
                                    {idx + 1}. {truncateText(answer.answer, 30)}
                                  </span>
                                </Tooltip>
                              </div>
                            ))}
                            {rating.general_answers_ratings?.length > 2 && (
                              <Button
                                type="link"
                                size="small"
                                onClick={() => handleOpenAnswersModal(rating)}
                                className="p-0 text-xs text-blue-600"
                              >
                                +{rating?.general_answers_ratings.length - 2} أكثر
                              </Button>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <Tooltip title="إدارة الإجابات">
                              <button
                                onClick={() => handleOpenAnswersModal(rating)}
                                className="p-2 hover:bg-green-50 rounded-lg text-green-600"
                              >
                                <MessageSquare size={18} />
                              </button>
                            </Tooltip>
                            
                            <button
                              onClick={() => handleOpenModal(rating)}
                              className="p-2 hover:bg-blue-50 rounded-lg text-blue-600"
                              title="تعديل"
                            >
                              <Edit3 size={18} />
                            </button>
                            <button
                              onClick={() => setDeleteModal({
                                visible: true,
                                ratingId: rating?.id,
                                ratingQuestion: rating?.question
                              })}
                              className="p-2 hover:bg-red-50 rounded-lg text-red-600"
                              title="حذف"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pagination */}
        {general_rating_list?.data?.message?.last_page > 1 && (
          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              onClick={() => handleGetAllData(pagination.current_page - 1)}
              disabled={pagination.current_page === 1}
              className={`flex items-center gap-1 px-4 py-2 rounded-lg ${pagination.current_page === 1 ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
            >
              <ChevronRight size={18} />
              السابق
            </button>
            
            <div className="flex items-center gap-2">
              {Array.from({ length: general_rating_list.data.message.last_page }, (_, i) => i + 1)
                .filter(page => 
                  page === 1 || 
                  page === general_rating_list.data.message.last_page ||
                  Math.abs(page - pagination.current_page) <= 1
                )
                .map((page, index, array) => (
                  <React.Fragment key={page}>
                    {index > 0 && array[index - 1] !== page - 1 && (
                      <span className="px-2">...</span>
                    )}
                    <button
                      onClick={() => handleGetAllData(page)}
                      className={`px-3 py-1 rounded-lg ${pagination.current_page === page ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                    >
                      {page}
                    </button>
                  </React.Fragment>
                ))}
            </div>
            
            <button
              onClick={() => handleGetAllData(pagination.current_page + 1)}
              disabled={pagination.current_page === general_rating_list.data.message.last_page}
              className={`flex items-center gap-1 px-4 py-2 rounded-lg ${pagination.current_page === general_rating_list.data.message.last_page ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
            >
              التالي
              <ChevronLeft size={18} />
            </button>
          </div>
        )}

        {/* Add/Edit Rating Modal */}
        <Modal
          title={
            <div className="flex items-center gap-2">
              <Star className="text-yellow-500" />
              <span>{isEditing ? 'تعديل سؤال التقييم' : 'إضافة سؤال تقييم جديد'}</span>
            </div>
          }
          open={isModalVisible}
          onCancel={handleCloseModal}
          footer={[
            <Button key="cancel" onClick={handleCloseModal}>
              إلغاء
            </Button>,
            <Button
              key="submit"
              type="primary"
              loading={add_rating_loading || update_rating_loading}
              onClick={handleSubmit}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isEditing ? 'تحديث' : 'إضافة'}
            </Button>,
          ]}
          centered
          width={700}
          className="rounded-xl"
        >
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                سؤال التقييم *
              </label>
              <Input
                value={form.question}
                onChange={(e) => setForm({ ...form, question: e.target.value })}
                placeholder="أدخل سؤال التقييم"
                className="rounded-lg"
                size="large"
              />
            </div>
   
            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  خيارات الإجابة *
                </label>
                <Button
                  type="dashed"
                  onClick={addAnswerField}
                  icon={<Plus size={16} />}
                  className="flex items-center gap-1"
                >
                  إضافة إجابة
                </Button>
              </div>
              
              <div className="space-y-3">
                {form?.answers?.map((answer, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-lg">
                      {index + 1}
                    </div>
                    <Input
                      value={answer}
                      onChange={(e) => handleAnswerChange(index, e.target.value)}
                      placeholder={`الإجابة ${index + 1}`}
                      className="flex-1 rounded-lg"
                    />
                    {form?.answers?.length > 1 && (
                      <Button
                        type="text"
                        danger
                        onClick={() => removeAnswerField(index)}
                        icon={<X size={16} />}
                        className="text-red-500 hover:text-red-700"
                      />
                    )}
                  </div>
                ))}
              </div>
              
              <p className="text-sm text-gray-500 mt-3">
                ملاحظة: يمكن ترك الإجابات الفارغة وسيتم تجاهلها
              </p>
            </div>
          </div>
        </Modal>

        {/* Answers Management Modal */}
        <Modal
          title={
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="text-green-500" />
                <span>إدارة إجابات السؤال</span>
              </div>
              <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {answersModal.ratingQuestion}
              </div>
            </div>
          }
          open={answersModal.visible}
          onCancel={handleCloseAnswersModal}
          footer={null}
          centered
          width={900}
          className="rounded-xl"
        >
          <div className="space-y-6">
          
            {/* Answers List */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium text-gray-800">
                  قائمة الإجابات ({getAnswersForDisplay?.length})
                </h4>
                
              </div>

              {get_rating_answers_loading ? (
                <div className="text-center py-8">
                  <Spin size="large" />
                </div>
              ) : getAnswersForDisplay?.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <MessageSquare size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">لا توجد إجابات لهذا السؤال</p>
                 
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto p-2">
                  {getAnswersForDisplay?.map((answer, index) => (
                    <motion.div
                      key={answer.id || index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="group relative"
                    >
                      <div className={`p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-all ${answerForm.id === answer.id ? 'ring-2 ring-blue-500' : ''}`}>
                        <div className="flex justify-between items-start">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full text-sm">
                                {index + 1}
                              </span>
                              <span className="text-sm text-gray-500">
                                #{answer?.id || `temp-${index}`}
                              </span>
                            </div>
                            <p className="text-gray-800 whitespace-pre-wrap break-words">
                              {answer?.answer || 'بدون نص'}
                            </p>
                          </div>
                          
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            {answer?.answer && (
                              <Tooltip title="نسخ النص">
                                <Button
                                  type="text"
                                  size="small"
                                  onClick={() => {
                                    navigator.clipboard.writeText(answer?.answer);
                                    toast.success("تم نسخ الإجابة");
                                  }}
                                  icon={<Copy size={14} />}
                                  className="text-gray-500 hover:text-blue-600"
                                />
                              </Tooltip>
                            )}
                            
                          
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

          
          </div>
        </Modal>

        {/* Delete Rating Modal */}
        <Modal
          title="تأكيد الحذف"
          open={deleteModal.visible}
          onCancel={() => setDeleteModal({ visible: false, ratingId: null, ratingQuestion: "" })}
          footer={[
            <Button key="cancel" onClick={() => setDeleteModal({ visible: false, ratingId: null, ratingQuestion: "" })}>
              إلغاء
            </Button>,
            <Button
              key="delete"
              danger
              loading={delete_rating_loading}
              onClick={handleDelete}
            >
              حذف
            </Button>,
          ]}
          centered
        >
          <div className="text-center py-4">
            <Trash2 size={48} className="mx-auto text-red-500 mb-4" />
            <h4 className="text-lg font-semibold text-gray-800 mb-2">
              هل أنت متأكد من حذف هذا السؤال؟
            </h4>
            <p className="text-gray-600">
              "{deleteModal.ratingQuestion}"
            </p>
            <Alert
              message="تحذير"
              description="سيتم حذف جميع الإجابات المرتبطة بهذا السؤال أيضاً"
              type="warning"
              showIcon
              className="mt-4"
            />
          </div>
        </Modal>

        {/* Delete Answer Modal */}
        <Modal
          title="تأكيد حذف الإجابة"
          open={deleteAnswerModal.visible}
          onCancel={() => setDeleteAnswerModal({ visible: false, answerId: null, answerText: "" })}
          footer={[
            <Button key="cancel" onClick={() => setDeleteAnswerModal({ visible: false, answerId: null, answerText: "" })}>
              إلغاء
            </Button>,
            <Button
              key="delete"
              danger
              loading={delete_rating_answers_loading}
              onClick={handleDeleteAnswer}
            >
              حذف
            </Button>,
          ]}
          centered
          width={500}
        >
          <div className="text-center py-4">
            <Trash2 size={48} className="mx-auto text-red-500 mb-4" />
            <h4 className="text-lg font-semibold text-gray-800 mb-2">
              هل أنت متأكد من حذف هذه الإجابة؟
            </h4>
            <div className="bg-gray-100 p-4 rounded-lg my-4 max-h-40 overflow-y-auto">
              <p className="text-gray-800 whitespace-pre-wrap">
                {deleteAnswerModal.answerText}
              </p>
            </div>
            <p className="text-red-500 text-sm">
              هذا الإجراء لا يمكن التراجع عنه
            </p>
          </div>
        </Modal>
      </div>
    </PageLayout>
  );
}