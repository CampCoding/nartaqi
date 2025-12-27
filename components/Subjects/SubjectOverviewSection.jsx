// "use client";

// import React, { useState, useEffect } from "react";
// import {
//   BookOutlined,
//   FileTextOutlined,
//   CalendarOutlined,
//   UserOutlined,
//   DollarOutlined,
//   ClockCircleOutlined,
//   TeamOutlined,
//   TagOutlined,
//   DownloadOutlined,
//   ShareAltOutlined,
//   HeartOutlined,
//   StarOutlined,
//   CheckCircleOutlined,
//   InfoCircleOutlined,
//   EditOutlined,
//   DeleteOutlined,
//   MoneyCollectFilled,
//   YoutubeFilled,
//   TwitterOutlined,
//   TikTokFilled,
//   InstagramFilled,
//   LinkedinFilled,
//   FacebookFilled
// } from "@ant-design/icons";
// import {
//   Card,
//   Tag,
//   Button,
//   Divider,
//   Row,
//   Col,
//   Statistic,
//   Progress,
//   Avatar,
//   Rate,
//   Badge,
//   Tooltip,
//   Space,
//   Typography,
//   Image,
//   ConfigProvider,
//   message
// } from "antd";
// import dayjs from "dayjs";
// import { CheckCircle2, DollarSign, Edit, Star } from "lucide-react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   handleGetAllRounds,
//   handleGetSourceRound
// } from "../../lib/features/roundsSlice";
// import { handleGetAllRoundFeatures } from "../../lib/features/featuresSlice";
// import { useRouter, useSearchParams } from "next/navigation";

// const { Title, Text, Paragraph } = Typography;

// const SubjectDetails = ({ subjectId, setSelectedUnit }) => {
//   const params = useSearchParams();
//   const [subject, setSubject] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [isFavorite, setIsFavorite] = useState(false);
//   const dispatch = useDispatch();
//   const {
//     source_round_list,
//     source_round_loading,
//     rounds_list,
//     rounds_loading
//   } = useSelector((state) => state?.rounds);
//   const { all_features_list, all_features_loading } = useSelector(
//     (state) => state?.features
//   );

//   const [filteredRound, setFilteredRound] = useState(null);
//   const [features, setFeatures] = useState([]);
//   const [teacher, setTeacher] = useState(null);
//   const catId = params.get("category_id");
//   const router = useRouter();
//   useEffect(() => {
//     if (catId) {
//       // When category_id exists, fetch rounds by category
//       dispatch(
//         handleGetAllRounds({
//           course_category_id: catId,
//           page: 1,
//           per_page: 100000000
//         })
//       );
//     } else {
//       // When no category_id, fetch all source rounds
//       dispatch(handleGetSourceRound({ page: 1, per_page: 1000000 }));
//     }

//     if (subjectId) {
//       dispatch(
//         handleGetAllRoundFeatures({
//           body: {
//             round_id: subjectId
//           }
//         })
//       );
//     }
//   }, [subjectId, dispatch, catId]);

//   useEffect(() => {
//     let foundRound = null;

//     // Find round based on category_id presence
//     if (catId && rounds_list?.data?.message?.data) {
//       // Search in rounds_list when category_id exists
//       foundRound = rounds_list.data.message.data.find(
//         (item) => item?.id?.toString() === subjectId?.toString()
//       );
//     } else if (!catId && source_round_list?.data?.message?.data) {
//       // Search in source_round_list when no category_id
//       foundRound = source_round_list.data.message.data.find(
//         (item) => item?.id?.toString() === subjectId?.toString()
//       );
//     }

//     setFilteredRound(foundRound);

//     // Set teacher data if available
//     if (foundRound?.teachers && foundRound.teachers.length > 0) {
//       setTeacher(foundRound.teachers);
//     }
//   }, [source_round_list, rounds_list, subjectId, catId]);

//   useEffect(() => {
//     // Set features from the response
//     if (all_features_list?.data?.message) {
//       setFeatures(all_features_list.data.message);
//     }
//   }, [all_features_list]);

//   useEffect(() => {
//     if (filteredRound) {
//       // Format the data to match your component structure
//       const formattedSubject = {
//         id: filteredRound.id,
//         name: filteredRound.name || "اسم الدورة",
//         price: parseFloat(filteredRound.price) || 0,
//         source: filteredRound.source || 0,
//         category_id: filteredRound.course_category_id || 0,
//         free: filteredRound.free === "1",
//         description: filteredRound.description || "لا يوجد وصف",
//         capacity: parseInt(filteredRound.capacity) || 0,
//         currentEnrollment: 0, // You might need to get this from another endpoint
//         availableFrom: filteredRound.start_date || new Date().toISOString(),
//         availableTo: filteredRound.end_date || new Date().toISOString(),
//         duration: `${filteredRound.total_days || 0} أيام`,
//         rating: 0, // You might need to get this from another endpoint
//         reviewsCount: 0, // You might need to get this from another endpoint
//         teachers: filteredRound?.teachers
//         ,
//         genderPolicy: filteredRound.gender || "both",
//         attachment: filteredRound.round_book
//           ? "شامل كتاب الدورة"
//           : "لا يوجد مرفقات",
//         summary: `<p>${filteredRound.description || "لا يوجد وصف مفصل"}</p>`,
//         overview: `
//           <div className="max-w-[100%] whitespace-pre-wrap">
//             <h3 className="max-w-[100%] whitespace-pre-wrap">تفاصيل الدورة</h3>
//             <p className="max-w-[100%] whitespace-pre-wrap">${filteredRound.description || "لا يوجد وصف مفصل"
//           }</p>
//             <p className="max-w-[100%] whitespace-pre-wrap overflow-hidden">
//             <strong className= "max-w-[100%] whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html:${
//           // replace all &nbsp; With " "
//           filteredRound.goal
//             ?.replaceAll("&nbsp;", " ")
//             ?.replace(/\s+/g, " ")
//             ?.trim()
//           }</strong> </p>
//             <p className="max-w-[100%] whitespace-pre-wrap"><strong>الفئة المستهدفة:</strong> ${filteredRound.for || "الجميع"
//           }</p>
//             <p className="max-w-[100%] whitespace-pre-wrap"><strong>الوقت:</strong> ${filteredRound.time_show || "غير محدد"
//           }</p>
//             <p className="max-w-[100%] whitespace-pre-wrap"><strong>المدة الإجمالية:</strong> ${filteredRound.total_hours || "غير محدد"
//           } ساعات</p>
//           </div>
//         `,
//         features:
//           features.length > 0
//             ? `<ul>${features
//               .map((f) => `<li>${f.name || f.description || "ميزة"}</li>`)
//               .join("")}</ul>`
//             : "<ul><li>لا توجد مميزات محددة</li></ul>",
//         terms: `
//           <ul>
//             <li>الحد الأقصى للسعة: ${filteredRound.capacity} طالب</li>
//             <li>الدورة ${filteredRound.free === "1" ? "مجانية" : "مدفوعة"}</li>
//             <li>مخصصة ${filteredRound.gender === "male"
//             ? "للذكور"
//             : filteredRound.gender === "female"
//               ? "للإناث"
//               : "للجميع"
//           }</li>
//           </ul>
//         `,
//         round_terms: filteredRound?.round_terms
//       };

//       setSubject(formattedSubject);
//       setSelectedUnit(formattedSubject?.name);
//       setLoading(false);
//     } else if (source_round_loading || rounds_loading || all_features_loading) {
//       setLoading(true);
//     } else {
//       setLoading(false);
//     }
//   }, [
//     filteredRound,
//     features,
//     teacher,
//     source_round_loading,
//     rounds_loading,
//     all_features_loading
//   ]);

//   const getGenderPolicyText = (policy) => {
//     switch (policy) {
//       case "male":
//         return "للذكور فقط";
//       case "female":
//         return "للإناث فقط";
//       case "both":
//         return "للجميع";
//       default:
//         return "للجميع";
//     }
//   };

//   const getGenderPolicyIcon = (policy) => {
//     switch (policy) {
//       case "male":
//         return "👨";
//       case "female":
//         return "👩";
//       case "both":
//         return "👥";
//       default:
//         return "👥";
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0F7490]"></div>
//       </div>
//     );
//   }

//   if (!subject) {
//     return (
//       <div className="text-center py-16">
//         <InfoCircleOutlined className="text-6xl text-gray-400 mb-4" />
//         <Title level={3} className="text-gray-500">
//           لم يتم العثور على الدورة
//         </Title>
//         <Text type="secondary">
//           Subject ID: {subjectId}, Category ID: {catId || "لا يوجد"}
//         </Text>
//       </div>
//     );
//   }

//   const enrollmentProgress =
//     subject.capacity > 0
//       ? ((subject.currentEnrollment || 0) / subject.capacity) * 100
//       : 0;

//   const daysLeft = dayjs(subject.availableTo).diff(dayjs(), "day");

//   return (
//     <ConfigProvider
//       theme={{
//         token: {
//           colorPrimary: "#0F7490",
//           borderRadius: 12
//         }
//       }}
//     >
//       <div className="bg-gray-50">
//         <div className="mx-auto px-4 py-8">
//           {/* Header Section */}
//           <Card className="mb-6 shadow-sm w-[100%]">
//             <Row gutter={[24, 24]} align="middle">
//               <Col xs={24} md={16} className="w-[100%]">
//                 <div className="flex items-center justify-between w-[100%]">
//                   <Title level={2} className="mb-2 text-primary w-[100%]">
//                     {subject.name}
//                   </Title>
//                 </div>
//                 {/* <Paragraph className="text-gray-600 text-lg">
//                   {subject.description}
//                 </Paragraph> */}
//                 <div className="flex flex-wrap gap-2 mt-4">
//                   <Tag color="blue" icon={<TagOutlined />}>
//                     {subject.free ? "مجانية" : "مدفوعة"}
//                   </Tag>
//                   <Tag color="green" icon={<CalendarOutlined />}>
//                     {subject.duration}
//                   </Tag>
//                   <Tag color="orange" icon={<TeamOutlined />}>
//                     {subject.capacity} مقاعد
//                   </Tag>
//                   <Tag color="purple">
//                     {getGenderPolicyIcon(subject.genderPolicy)}{" "}
//                     {getGenderPolicyText(subject.genderPolicy)}
//                   </Tag>
//                 </div>
//               </Col>
//               <Col xs={24} md={8}>
//                 <div className="text-right md:text-left">
//                   <div className="text-3xl font-bold text-primary mb-2 flex flex-col items-end gap-3">
//                     {/* {console.log("subject.price09240394034", subject)} */}
//                     {subject.free ? "مجانية" : `${subject.price} ر.س`}
//                     {/* <button
//                       onClick={() => {
//                         router.push(
//                           `/saudi_source_course/edit/${subject?.id}?page=1&pageSize=1000000000&isSource=${subject?.source}&category_id=${subject?.category_id}`
//                         );
//                       }}
//                       className="w-fit px-3 py-2 text-right   flex items-center gap-2 text-[25px] text-[white] font-semibold border border-gray-200 rounded-lg shadow-sm  bg-blue-600 hover:shadow-md transition"
//                     >
//                       <Edit size={14} className="text-[white]" />
//                       <span className="text-[white]">تعديل</span>
//                     </button> */}
//                   </div>
//                 </div>
//               </Col>
//             </Row>
//           </Card>

//           {/* Content Sections */}
//           <Row gutter={[24, 24]}>
//             <Col xs={24} lg={16}>
//               <div className="space-y-6">
//                 {/* Overview */}
//                 <Card title="" className="shadow-sm">
//                   <div className="space-y-4">
//                     <div
//                       className="prose prose-lg !whitespace-per-wrap !max-w-[100%]"
//                       dangerouslySetInnerHTML={{ __html: subject.overview }}
//                     />
//                   </div>
//                 </Card>

//                 {/* Features */}
//                 <Card
//                   title={
//                     <div className="flex items-center gap-2">
//                       <CheckCircleOutlined className="text-[#0F7490]" />
//                       <span>مميزات الدورة</span>
//                     </div>
//                   }
//                   className="shadow-sm"
//                 >
//                   <div
//                     className="prose prose-lg max-w-none"
//                     dangerouslySetInnerHTML={{ __html: subject.features }}
//                   />
//                 </Card>

//                 {/* Terms */}
//                 {subject?.round_terms?.length && <Card
//                   title={
//                     <div className="flex items-center gap-2">
//                       <InfoCircleOutlined className="text-[#0F7490]" />
//                       <span>الشروط والأحكام</span>
//                     </div>
//                   }
//                   className="shadow-sm"
//                 >
//                   <div className="flex flex-col gap-2">
//                     {subject?.round_terms?.map((item) => (
//                       <div className="flex flex-col gap-1">
//                         <h3 className="text-2xl font-bold text-gray-900">
//                           {item?.title}
//                         </h3>
//                         <div className="space-y-4">
//                           {item?.points?.map((point, idx) => (
//                             <div
//                               key={idx}
//                               className="flex items-start gap-4 p-4 bg-gradient-to-r from-indigo-50/50 to-purple-50/50 rounded-2xl"
//                             >
//                               <CheckCircle2 className="w-6 h-6 text-indigo-600 mt-0.5 flex-shrink-0" />
//                               <p className="text-gray-700 leading-relaxed">
//                                 {point}
//                               </p>
//                             </div>
//                           ))}
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </Card>}
//               </div>
//             </Col>

//             <Col xs={24} lg={8}>
//               <div className="space-y-6">
//                 {/* Instructor Info */}
//                 <Card title="المدرب" className="shadow-sm">
//                   {subject?.teachers?.length > 0 && subject?.teachers?.map(teacher =>
//                     <div 
//                     key={teacher?.id}
//                     className="flex flex-col gap-1">
//                       <div className="flex items-center gap-4 mb-4">
//                         <Avatar size={64} src={teacher?.image_url} />
//                         {/* <Tag title={subject?.gender} /> */}
//                         <div>
//                           <Title level={4} className="mb-1">
//                             {teacher?.name}
//                           </Title>
//                           <Text className="text-gray-600">
//                             {teacher?.description}
//                           </Text>
//                         </div>
//                       </div>

//                       <div className="space-y-2">
//                         {teacher?.email && (
//                           <div className="flex items-center gap-2">
//                             <Text type="secondary">البريد:</Text>
//                             <Text>{teacher?.email}</Text>
//                           </div>
//                         )}
//                         {teacher?.website && (
//                           <div className="flex items-center gap-2">
//                             <Text type="secondary">الموقع:</Text>
//                             <a
//                               href={teacher?.website}
//                               target="_blank"
//                               rel="noopener noreferrer"
//                             >
//                               {teacher?.website}
//                             </a>
//                           </div>
//                         )}

//                         {teacher?.youtube && (
//                           <div className="flex items-center gap-2">
//                             <YoutubeFilled type="secondary">يوتيوب:</YoutubeFilled>
//                             <a
//                               href={teacher?.youtube}
//                               target="_blank"
//                               rel="noopener noreferrer"
//                             >
//                               {teacher?.youtube}
//                             </a>
//                           </div>
//                         )}

//                         {teacher?.tiktok && (
//                           <div className="flex items-center gap-2">
//                             <TikTokFilled type="secondary">تيك توك:</TikTokFilled>
//                             <a
//                               href={teacher?.tiktok}
//                               target="_blank"
//                               rel="noopener noreferrer"
//                             >
//                               {teacher?.tiktok}
//                             </a>
//                           </div>
//                         )}

//                         {teacher?.facebook && (
//                           <div className="flex items-center gap-2">
//                             <FacebookFilled type="secondary">فيس بوك  :</FacebookFilled>
//                             <a
//                               href={teacher?.facebook}
//                               target="_blank"
//                               rel="noopener noreferrer"
//                             >
//                               {teacher?.facebook}
//                             </a>
//                           </div>
//                         )}

//                         {teacher?.linkedin && (
//                           <div className="flex items-center gap-2">
//                             <LinkedinFilled type="secondary">لينكد ان :</LinkedinFilled>
//                             <a
//                               href={teacher?.linkedin}
//                               target="_blank"
//                               rel="noopener noreferrer"
//                             >
//                               {teacher?.linkedin}
//                             </a>
//                           </div>
//                         )}


//                         {teacher?.instagram && (
//                           <div className="flex items-center gap-2">
//                             <InstagramFilled type="secondary">انستاجرام :</InstagramFilled>
//                             <a
//                               href={teacher?.instagram}
//                               target="_blank"
//                               rel="noopener noreferrer"
//                             >
//                               {teacher?.instagram}
//                             </a>
//                           </div>
//                         )}


//                         {teacher?.twitter && (
//                           <div className="flex items-center gap-2">
//                             <TwitterOutlined type="secondary">تويتر:</TwitterOutlined>
//                             <a
//                               href={teacher?.twitter}
//                               target="_blank"
//                               rel="noopener noreferrer"
//                             >
//                               {teacher?.twitter}
//                             </a>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   )
//                   }

//                 </Card>

//                 {/* Course Details */}
//                 <Card title="تفاصيل الدورة" className="shadow-sm">
//                   <div className="space-y-4">
//                     <div className="flex items-center justify-between">
//                       <span className="text-gray-600 flex items-center gap-2">
//                         <DollarSign />
//                         السعر
//                       </span>
//                       <Text strong className="text-primary font-bold text-xl">
//                         {subject.free ? "مجانية" : `${subject.price} ر.س`}
//                       </Text>
//                     </div>
//                     <Divider className="my-3" />
//                     <div className="flex items-center justify-between">
//                       <span className="text-gray-600 flex items-center gap-2">
//                         <CalendarOutlined />
//                         تاريخ البداية
//                       </span>
//                       <Text>
//                         {dayjs(subject.availableFrom).format("DD/MM/YYYY")}
//                       </Text>
//                     </div>
//                     <div className="flex items-center justify-between">
//                       <span className="text-gray-600 flex items-center gap-2">
//                         <CalendarOutlined />
//                         تاريخ النهاية
//                       </span>
//                       <Text>
//                         {dayjs(subject.availableTo).format("DD/MM/YYYY")}
//                       </Text>
//                     </div>
//                     <Divider className="my-3" />
//                     <div className="flex items-center justify-between">
//                       <span className="text-gray-600 flex items-center gap-2">
//                         <ClockCircleOutlined />
//                         المدة
//                       </span>
//                       <Text strong>{subject.duration}</Text>
//                     </div>
//                     <Divider className="my-3" />
//                     <div className="flex items-center justify-between">
//                       <span className="text-gray-600 flex items-center gap-2">
//                         <TeamOutlined />
//                         السعة
//                       </span>
//                       <Text>{subject.capacity} مقعد</Text>
//                     </div>
//                     <Divider className="my-3" />
//                     <div className="flex items-center justify-between">
//                       <span className="text-gray-600 flex items-center gap-2">
//                         <UserOutlined />
//                         السياسة
//                       </span>
//                       <Text>{getGenderPolicyText(subject.genderPolicy)}</Text>
//                     </div>
//                     <div
//                       className="prose prose-lg max-w-none"
//                       dangerouslySetInnerHTML={{ __html: subject?.terms }}
//                     />
//                     {subject.attachment && (
//                       <>
//                         <Divider className="my-3" />
//                         <div>
//                           <span className="text-gray-600 flex items-center gap-2 mb-2">
//                             <DownloadOutlined />
//                             المرفقات
//                           </span>
//                           <Text className="text-sm">{subject.attachment}</Text>
//                         </div>
//                       </>
//                     )}
//                   </div>
//                 </Card>

//                 {/* Enrollment Progress */}
//                 <Card title="حالة التسجيل" className="shadow-sm">
//                   <Progress
//                     percent={Math.round(enrollmentProgress)}
//                     status={enrollmentProgress >= 100 ? "exception" : "active"}
//                   />
//                   <div className="flex justify-between mt-2">
//                     <Text type="secondary">
//                       المسجلين: {subject.currentEnrollment || 0}
//                     </Text>
//                     <Text type="secondary">
//                       المتبقي:{" "}
//                       {subject.capacity - (subject.currentEnrollment || 0)}
//                     </Text>
//                   </div>
//                   {daysLeft > 0 && (
//                     <div className="mt-4 text-center">
//                       <Text type="secondary">متبقي {daysLeft} يوم للتسجيل</Text>
//                     </div>
//                   )}
//                 </Card>
//               </div>
//             </Col>
//           </Row>
//         </div>
//       </div>

//       {/* Custom styles for RTL content */}
//       <style jsx global>{`
//         .prose {
//           direction: rtl;
//           text-align: right;
//         }
//         .prose ul,
//         .prose ol {
//           padding-right: 1.5rem;
//           padding-left: 0;
//         }
//         .prose li {
//           text-align: right;
//         }
//       `}</style>
//     </ConfigProvider>
//   );
// };

// export default SubjectDetails;


"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  BookOutlined,
  FileTextOutlined,
  CalendarOutlined,
  UserOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  TagOutlined,
  DownloadOutlined,
  InfoCircleOutlined,
  YoutubeFilled,
  TwitterOutlined,
  TikTokFilled,
  InstagramFilled,
  LinkedinFilled,
  FacebookFilled,
  MailOutlined,
  LinkOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import {
  Card,
  Tag,
  Button,
  Divider,
  Row,
  Col,
  Statistic,
  Progress,
  Avatar,
  Badge,
  Tooltip,
  Space,
  Typography,
  Image,
  ConfigProvider,
  Empty,
  Collapse,
} from "antd";
import dayjs from "dayjs";
import { CheckCircle2, DollarSign, Globe, Mail } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  handleGetAllRounds,
  handleGetSourceRound,
} from "../../lib/features/roundsSlice";
import { handleGetAllRoundFeatures } from "../../lib/features/featuresSlice";
import { useRouter, useSearchParams } from "next/navigation";
import { handleGetAllCoursesCategories, handleGetCategoryParts } from "../../lib/features/categoriesSlice";

const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;

const SubjectDetails = ({ subjectId, setSelectedUnit }) => {
  const params = useSearchParams();
  const [subject, setSubject] = useState(null);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();
  const { source_round_list, source_round_loading, rounds_list, rounds_loading } =
    useSelector((state) => state?.rounds);

  const { all_features_list, all_features_loading } = useSelector(
    (state) => state?.features
  );

  const [filteredRound, setFilteredRound] = useState(null);
  const [features, setFeatures] = useState([]);
  const { all_courses_categories_list, get_categories_parts_list, get_categories_parts_loading } = useSelector(state => state?.categories)

  const catId = params.get("category_id");
  const router = useRouter();

  useEffect(() => {
    dispatch(handleGetAllCoursesCategories({
      page: 1,
      per_page: 1000000000
    }))
  }, [])



  // -------------------------
  // Helpers
  // -------------------------
  const cleanHtmlText = (html = "") =>
    String(html || "")
      .replaceAll("&nbsp;", " ")
      .replace(/\s+/g, " ")
      .trim();

  const safeLink = (url) => {
    if (!url) return "";
    const u = String(url).trim();
    if (!u) return "";
    if (u.startsWith("http://") || u.startsWith("https://")) return u;
    // لو حد حاطط www. أو دومين بدون بروتوكول
    return `https://${u.replace(/^\/\//, "")}`;
  };

  const featureArrayFromResponse = useMemo(() => {
    // أشكال محتملة:
    // 1) all_features_list.data.message = [{...}]
    // 2) all_features_list.data.message.message = [{...}]
    // 3) all_features_list.message = [{...}]
    const root = all_features_list?.data ?? all_features_list;
    const msg = root?.message ?? root?.data?.message;

    if (Array.isArray(msg)) return msg;
    if (Array.isArray(msg?.message)) return msg.message;
    return [];
  }, [all_features_list]);

  // -------------------------
  // Fetch rounds + features
  // -------------------------
  useEffect(() => {
    if (catId) {
      dispatch(
        handleGetAllRounds({
          course_category_id: catId,
          page: 1,
          per_page: 100000000,
        })
      );
    } else {
      dispatch(handleGetSourceRound({ page: 1, per_page: 1000000 }));
    }

    if (subjectId) {
      dispatch(
        handleGetAllRoundFeatures({
          body: { round_id: subjectId },
        })
      );
    }
  }, [subjectId, dispatch, catId]);

  // -------------------------
  // Find round by ID
  // -------------------------
  useEffect(() => {
    let foundRound = null;

    if (catId && rounds_list?.data?.message?.data) {
      foundRound = rounds_list.data.message.data.find(
        (item) => item?.id?.toString() === subjectId?.toString()
      );
    } else if (!catId && source_round_list?.data?.message?.data) {
      foundRound = source_round_list.data.message.data.find(
        (item) => item?.id?.toString() === subjectId?.toString()
      );
    }

    setFilteredRound(foundRound || null);
  }, [source_round_list, rounds_list, subjectId, catId]);

  // -------------------------
  // Set features
  // -------------------------
  useEffect(() => {
    setFeatures(featureArrayFromResponse || []);
  }, [featureArrayFromResponse]);

  // -------------------------
  // Build subject model
  // -------------------------
  useEffect(() => {
    if (filteredRound) {
      const goalClean = cleanHtmlText(filteredRound.goal || "");
      const gender = filteredRound.gender || "both";

      const formattedSubject = {
        id: filteredRound.id,
        name: filteredRound.name || "اسم الدورة",
        price: parseFloat(filteredRound.price) || 0,
        source: filteredRound.source || 0,
        category_id: filteredRound.course_category_id || 0,
        part_id: filteredRound?.category_part_id || 0,
        free: filteredRound.free === "1",
        description: filteredRound.description || "لا يوجد وصف",
        capacity: parseInt(filteredRound.capacity) || 0,
        currentEnrollment: 0,
        availableFrom: filteredRound.start_date || new Date().toISOString(),
        availableTo: filteredRound.end_date || new Date().toISOString(),
        duration: `${filteredRound.total_days || 0} أيام`,
        rating: 0,
        reviewsCount: 0,
        teachers: Array.isArray(filteredRound?.teachers)
          ? filteredRound.teachers
          : [],
        genderPolicy: gender,
        attachment_1: filteredRound?.round_book_url,
        attachment_2: filteredRound?.round_road_map_book_url,
        certificate: filteredRound?.have_certificate == "1",
        overview: `
          <div class="max-w-[100%] whitespace-pre-wrap">
            <h3 class="max-w-[100%] whitespace-pre-wrap">تفاصيل الدورة</h3>
            <p class="max-w-[100%] whitespace-pre-wrap">${filteredRound.description || "لا يوجد وصف مفصل"
          }</p>

            ${goalClean
            ? `<p class="max-w-[100%] whitespace-pre-wrap"><strong>الهدف:</strong> ${goalClean}</p>`
            : ""
          }

            <p class="max-w-[100%] whitespace-pre-wrap"><strong>الفئة المستهدفة:</strong> ${filteredRound.for || "الجميع"
          }</p>
            <p class="max-w-[100%] whitespace-pre-wrap"><strong>الوقت:</strong> ${filteredRound.time_show || "غير محدد"
          }</p>
            <p class="max-w-[100%] whitespace-pre-wrap"><strong>المدة الإجمالية:</strong> ${filteredRound.total_hours || "غير محدد"
          } ساعات</p>
          </div>
        `,
        features, // ✅ خليها Array مش HTML
        terms: `
          <ul>
            <li>الحد الأقصى للسعة: ${parseInt(filteredRound.capacity) || 0} طالب</li>
            <li>الدورة ${filteredRound.free === "1" ? "مجانية" : "مدفوعة"}</li>
            <li>مخصصة ${gender === "male" ? "للذكور" : gender === "female" ? "للإناث" : "للجميع"
          }</li>
          </ul>
        `,
        round_terms: filteredRound?.round_terms || [],
      };

      setSubject(formattedSubject);
      setSelectedUnit?.(formattedSubject?.name);
      setLoading(false);
      return;
    }

    if (source_round_loading || rounds_loading || all_features_loading) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [
    filteredRound,
    features,
    source_round_loading,
    rounds_loading,
    all_features_loading,
    setSelectedUnit,
  ]);

  const getGenderPolicyText = (policy) => {
    switch (policy) {
      case "male":
        return "للذكور فقط";
      case "female":
        return "للإناث فقط";
      case "both":
        return "للجميع";
      default:
        return "للجميع";
    }
  };

  const getGenderPolicyIcon = (policy) => {
    switch (policy) {
      case "male":
        return "👨";
      case "female":
        return "👩";
      case "both":
        return "👥";
      default:
        return "👥";
    }
  };
  const [selectedCategory, setSelectedCategory] = useState({});
  const [selectedSection, setSelectedSection] = useState({});


  useEffect(() => {
    setSelectedCategory(all_courses_categories_list?.data?.message?.data?.find(item => item?.id == subject?.category_id));
  }, [subject?.category_id, all_courses_categories_list])

  useEffect(() => {
    dispatch(handleGetCategoryParts({
      body: {
        course_category_id: selectedCategory?.id
      }
    }))
  }, [selectedCategory])

  const selectedCategorySection = useMemo(() => {
    return (get_categories_parts_list?.data?.message?.find(item => item?.id == subject?.part_id))
  }, [subject, get_categories_parts_list])

  // -------------------------
  // Loading / Not Found
  // -------------------------
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0F7490]"></div>
      </div>
    );
  }

  if (!subject) {
    return (
      <div className="text-center py-16">
        <InfoCircleOutlined className="text-6xl text-gray-400 mb-4" />
        <Title level={3} className="text-gray-500">
          لم يتم العثور على الدورة
        </Title>
        <Text type="secondary">
          Subject ID: {subjectId}, Category ID: {catId || "لا يوجد"}
        </Text>
      </div>
    );
  }

  const enrollmentProgress =
    subject.capacity > 0
      ? ((subject.currentEnrollment || 0) / subject.capacity) * 100
      : 0;

  const daysLeft = dayjs(subject.availableTo).diff(dayjs(), "day");

  // -------------------------
  // UI: Feature card
  // -------------------------
  const FeatureCard = ({ f }) => {
    const title = f?.title || f?.name || "ميزة";
    const desc = f?.description || "";

    return (
      <Card
        hoverable
        className="shadow-sm h-full"
        cover={
          f?.image_url ? (
            <div className="p-3">
              <Image
                src={f.image_url}
                alt={title}
                className="rounded-xl"
                preview={false}
              />
            </div>
          ) : null
        }
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <Title level={5} className="!mb-1">
              {title}
            </Title>

            <Paragraph
              className="text-gray-600 !mb-3"
              ellipsis={{ rows: 3, expandable: false }}
            >
              {desc}
            </Paragraph>
          </div>
          <Badge count="ميزة" color="blue" />
        </div>

        {desc ? (
          <Collapse ghost>
            <Panel header="عرض التفاصيل" key={`f-${f?.id || title}`}>
              <Paragraph className="text-gray-700 whitespace-pre-wrap">
                {desc}
              </Paragraph>
            </Panel>
          </Collapse>
        ) : (
          <Text type="secondary">لا يوجد تفاصيل إضافية</Text>
        )}
      </Card>
    );
  };

  // -------------------------
  // UI: Teacher card
  // -------------------------
  const TeacherCard = ({ t }) => {
    const name = t?.name || "مدرب";
    const bio = t?.description || "";

    const email = t?.email || "";
    const website = safeLink(t?.website);
    const youtube = safeLink(t?.youtube);
    const tiktok = safeLink(t?.tiktok);
    const facebook = safeLink(t?.facebook);
    const linkedin = safeLink(t?.linkedin);
    const instagram = safeLink(t?.instagram);
    const twitter = safeLink(t?.twitter);

    const social = [
      { key: "youtube", url: youtube, icon: <YoutubeFilled />, label: "YouTube" },
      { key: "tiktok", url: tiktok, icon: <TikTokFilled />, label: "TikTok" },
      { key: "facebook", url: facebook, icon: <FacebookFilled />, label: "Facebook" },
      { key: "linkedin", url: linkedin, icon: <LinkedinFilled />, label: "LinkedIn" },
      { key: "instagram", url: instagram, icon: <InstagramFilled />, label: "Instagram" },
      { key: "twitter", url: twitter, icon: <TwitterOutlined />, label: "Twitter" },
    ].filter((x) => !!x.url);

    return (
      <Card className="shadow-sm">
        <div className="flex items-start gap-4">
          <Avatar size={64} src={t?.image_url} icon={<UserOutlined />} />
          <div className="flex-1">
            <div className="flex items-start justify-between gap-3">
              <div>
                <Title level={4} className="!mb-1">
                  {name}
                </Title>
                {bio ? (
                  <Paragraph
                    className="text-gray-600 !mb-2"
                    ellipsis={{ rows: 2, expandable: false }}
                  >
                    {bio}
                  </Paragraph>
                ) : (
                  <Text type="secondary">لا يوجد وصف للمدرب</Text>
                )}
              </div>

              <Tag color="geekblue" className="rounded-full">
                مدرب
              </Tag>
            </div>

            <div className="flex flex-col gap-2 mt-3">
              {email && (
                <div className="flex items-center gap-2">
                  {/* <MailOutlined className="text-gray-500" /> */}
                  <Text type="secondary">البريد:</Text>
                  <a href={`mailto:${email}`} className="text-[#0F7490]">
                    {email}
                  </a>
                </div>
              )}

              {website && (
                <div className="flex items-center gap-2">
                  {/* <LinkOutlined className="text-gray-500" /> */}
                  <Text type="secondary">الموقع:</Text>
                  <a
                    href={website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#0F7490]"
                  >
                    {website}
                  </a>
                </div>
              )}
            </div>

            {social.length > 0 && (
              <>
                <Divider className="!my-3" />
                <div className="flex items-center justify-between">
                  <Text type="secondary">حسابات التواصل</Text>
                  <Space size="small" wrap>
                    {social.map((s) => (
                      <Tooltip key={s.key} title={s.label}>
                        <Button
                          type="text"
                          icon={s.icon}
                          onClick={() => window.open(s.url, "_blank")}
                        />
                      </Tooltip>
                    ))}
                  </Space>
                </div>
              </>
            )}
          </div>
        </div>
      </Card>
    );
  };

  // -------------------------
  // Render
  // -------------------------
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#0F7490",
          borderRadius: 12,
        },
      }}
    >
      <div className="bg-gray-50">
        <div className="mx-auto px-4 py-8">
          {/* Header */}
          <Card className="mb-6 shadow-sm w-[100%]">
            <Row gutter={[24, 24]} align="middle">
              <Col xs={24} md={16} className="w-[100%]">
                <div className="flex flex-col gap-1 justify-between  w-[100%]">
                  <Title level={2} className="mb-2 text-primary w-[100%]">
                    {subject.name}
                  </Title>

                  <div className="flex gap-2 items-center">
                    <div className="flex gap-1 items-center">
                      <Tag color="blue" title="الفئة">
                        الفئة
                        </Tag>
                      <p  level={6}>
                        {selectedCategory?.name}
                      </p>
                    </div>

                    ||


                    <div className="flex gap-1 items-center">
                      <Tag color="orange" title="القسم" >
                        القسم
                        </Tag>
                      <p level={6}>
                        {selectedCategorySection?.name}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  <Tag color="blue" icon={<TagOutlined />}>
                    {subject.free ? "مجانية" : "مدفوعة"}
                  </Tag>
                  <Tag color="green" icon={<CalendarOutlined />}>
                    {subject.duration}
                  </Tag>
                  <Tag color="orange" icon={<TeamOutlined />}>
                    {subject.capacity} مقاعد
                  </Tag>
                  <Tag color="purple">
                    {getGenderPolicyIcon(subject.genderPolicy)}{" "}
                    {getGenderPolicyText(subject.genderPolicy)}
                  </Tag>
                </div>
              </Col>

              <Col xs={24} md={8}>
                <div className="text-right md:text-left">
                  <div className="text-3xl font-bold text-primary mb-2 flex flex-col items-end gap-3">
                    {subject.free ? "مجانية" : `${subject.price} ر.س`}
                  </div>
                </div>
              </Col>
            </Row>
          </Card>

          <Row gutter={[24, 24]}>
            {/* Left */}
            <Col xs={24} lg={16}>
              <div className="space-y-6">
                {/* Overview */}
                <Card title="" className="shadow-sm">
                  <div
                    className="prose prose-lg !whitespace-pre-wrap !max-w-[100%]"
                    dangerouslySetInnerHTML={{ __html: subject.overview }}
                  />
                </Card>

                {/* Features - NEW DESIGN */}
                <Card
                  title={
                    <div className="flex items-center gap-2">
                      <CheckCircleOutlined className="text-[#0F7490]" />
                      <span>مميزات الدورة</span>
                      <Badge
                        count={subject.features?.length || 0}
                        color="blue"
                        showZero
                      />
                    </div>
                  }
                  className="shadow-sm"
                >
                  {subject.features?.length ? (
                    <Row gutter={[16, 16]}>
                      {subject.features.map((f) => (
                        <Col key={f?.id || f?.title} xs={24} md={12}>
                          <FeatureCard f={f} />
                        </Col>
                      ))}
                    </Row>
                  ) : (
                    <Empty description="لا توجد مميزات محددة" />
                  )}
                </Card>

                {/* Terms */}
                {!!subject?.round_terms?.length && (
                  <Card
                    title={
                      <div className="flex items-center gap-2">
                        <InfoCircleOutlined className="text-[#0F7490]" />
                        <span>الشروط والأحكام</span>
                      </div>
                    }
                    className="shadow-sm"
                  >
                    <div className="flex flex-col gap-2">
                      {subject?.round_terms?.map((item) => (
                        <div key={item?.id || item?.title} className="flex flex-col gap-1">
                          <h3 className="text-2xl font-bold text-gray-900">
                            {item?.title}
                          </h3>
                          <div className="space-y-4">
                            {item?.points?.map((point, idx) => (
                              <div
                                key={idx}
                                className="flex items-start gap-4 p-4 bg-gradient-to-r from-indigo-50/50 to-purple-50/50 rounded-2xl"
                              >
                                <CheckCircle2 className="w-6 h-6 text-indigo-600 mt-0.5 flex-shrink-0" />
                                <p className="text-gray-700 leading-relaxed">
                                  {point}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}
              </div>
            </Col>

            {/* Right */}
            <Col xs={24} lg={8}>
              <div className="space-y-6">
                {/* Teachers - NEW DESIGN */}
                <Card
                  title={
                    <div className="flex items-center justify-between">
                      <span>المدرب</span>
                      <Badge
                        count={subject?.teachers?.length || 0}
                        color="purple"
                        showZero
                      />
                    </div>
                  }
                  className="shadow-sm"
                >
                  {subject?.teachers?.length ? (
                    <div className="space-y-4">
                      {subject.teachers.map((t) => (
                        <TeacherCard key={t?.id || t?.email || t?.name} t={t} />
                      ))}
                    </div>
                  ) : (
                    <Empty description="لا يوجد مدربين مسجلين لهذه الدورة" />
                  )}
                </Card>

                {/* Course Details */}
                <Card title="تفاصيل الدورة" className="shadow-sm">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 flex items-center gap-2">
                        <DollarSign />
                        السعر
                      </span>
                      <Text strong className="text-primary font-bold text-xl">
                        {`${subject.price} ر.س`}
                      </Text>
                    </div>

                    <Divider className="my-3" />

                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 flex items-center gap-2">
                        <CalendarOutlined />
                        تاريخ البداية
                      </span>
                      <Text>{dayjs(subject.availableFrom).format("DD/MM/YYYY")}</Text>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 flex items-center gap-2">
                        <CalendarOutlined />
                        تاريخ النهاية
                      </span>
                      <Text>{dayjs(subject.availableTo).format("DD/MM/YYYY")}</Text>
                    </div>

                    <Divider className="my-3" />

                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 flex items-center gap-2">
                        <ClockCircleOutlined />
                        المدة
                      </span>
                      <Text strong>{subject.duration}</Text>
                    </div>

                    <Divider className="my-3" />

                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 flex items-center gap-2">
                        <TeamOutlined />
                        السعة
                      </span>
                      <Text>{subject.capacity} مقعد</Text>
                    </div>

                    <Divider className="my-3" />

                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 flex items-center gap-2">
                        <UserOutlined />
                        السياسة
                      </span>
                      <Text>{getGenderPolicyText(subject.genderPolicy)}</Text>
                    </div>

                    {subject?.certificate && <div className="flex items-center justify-between">
                      <span className="text-gray-600 flex items-center gap-2">
                        <FileTextOutlined />
                        تمتلك شهادة
                      </span>
                    </div>}

                    <div
                      className="prose prose-lg max-w-none"
                      dangerouslySetInnerHTML={{ __html: subject?.terms }}
                    />

                    {subject.attachment_1 || subject.attachment_2 ? (
                      <>
                        <Divider className="my-3" />
                        <div>
                          <span className="text-gray-600 flex items-center gap-2 mb-2">
                            <DownloadOutlined />
                            المرفقات
                          </span>
                          <div className="flex flex-col gap-1">
                            <a href={subject.attachment_1} className="underline" target="_blank"><Text className="text-sm">كتاب الدورة</Text></a>
                            <a href={subject.attachment_2} className="underline" target="_blank"><Text className="text-sm">جدول الدورة</Text></a>
                          </div>
                        </div>
                      </>
                    ) : null}


                  </div>
                </Card>

                {/* Enrollment Progress */}
                {/* <Card title="حالة التسجيل" className="shadow-sm">
                  <Progress
                    percent={Math.round(enrollmentProgress)}
                    status={enrollmentProgress >= 100 ? "exception" : "active"}
                  />
                  <div className="flex justify-between mt-2">
                    <Text type="secondary">
                      المسجلين: {subject.currentEnrollment || 0}
                    </Text>
                    <Text type="secondary">
                      المتبقي: {subject.capacity - (subject.currentEnrollment || 0)}
                    </Text>
                  </div>
                  {daysLeft > 0 && (
                    <div className="mt-4 text-center">
                      <Text type="secondary">متبقي {daysLeft} يوم للتسجيل</Text>
                    </div>
                  )}
                </Card> */}
              </div>
            </Col>
          </Row>
        </div>
      </div>

      {/* RTL styles */}
      <style jsx global>{`
        .prose {
          direction: rtl;
          text-align: right;
        }
        .prose ul,
        .prose ol {
          padding-right: 1.5rem;
          padding-left: 0;
        }
        .prose li {
          text-align: right;
        }
      `}</style>
    </ConfigProvider>
  );
};

export default SubjectDetails;
