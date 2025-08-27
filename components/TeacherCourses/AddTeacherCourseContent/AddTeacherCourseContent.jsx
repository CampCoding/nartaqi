"use client";
import { Button, Form, Input } from "antd";
import { BookOpen, Check, FileText, Plus, Video } from "lucide-react";
import React, { useState } from "react";

export default function AddTeacherCourseContent({
  insideTab,
  setInsideTab,
  activeTab , 
}) {
  const [form] = Form.useForm();
  // Video tab states
  const [videoUnit, setVideoUnit] = useState("");
  const [isNewVideo, setIsNewVideo] = useState(true);
  const [videoUrl, setVideoUrl] = useState("");
  const [selectedVideo, setSelectedVideo] = useState("");
  const [videoDuration, setVideoDuration] = useState("");
  const [videoTitle, setVideoTitle] = useState("");

  // Exam tab states
  const [examUnit, setExamUnit] = useState("");
  const [examUrl, setExamUrl] = useState("");
  const [examTitle, setExamTitle] = useState("");
  const [examDuration, setExamDuration] = useState("");

  // Sample data for existing videos
  const existingVideos = [
    { id: 1, title: "مقدمة في الرياضيات", duration: "15:30" },
    { id: 2, title: "الجبر الأساسي", duration: "22:45" },
    { id: 3, title: "الهندسة المستوية", duration: "18:20" },
  ];

  const insideTabs = [
    { id: 1, title: "إضافة فيديو", icon: Video },
    { id: 2, title: "إضافة اختبار", icon: FileText },
  ];

  const handleVideoChange = (videoId) => {
    setSelectedVideo(videoId);
    const video = existingVideos.find((v) => v.id === videoId);
    if (video) {
      setVideoTitle(video.title);
      setVideoDuration(video.duration);
    }
  };

  const handleAddVideo = () => {
    if (!videoUnit || (!videoUrl && !selectedVideo)) {
      alert("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    console.log("Adding video:", {
      unit: videoUnit,
      isNew: isNewVideo,
      url: videoUrl,
      selectedVideo: selectedVideo,
      title: videoTitle,
      duration: videoDuration,
    });

    // Reset form
    setVideoUnit("");
    setVideoUrl("");
    setSelectedVideo("");
    setVideoTitle("");
    setVideoDuration("");

    alert("تم إضافة الفيديو بنجاح!");
  };

  const handleAddExam = () => {
    if (!examUnit || !examUrl || !examTitle) {
      alert("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    console.log("Adding exam:", {
      unit: examUnit,
      url: examUrl,
      title: examTitle,
      duration: examDuration,
    });

    // Reset form
    setExamUnit("");
    setExamUrl("");
    setExamTitle("");
    setExamDuration("");

    alert("تم إضافة الاختبار بنجاح!");
  };

  if (activeTab !== 5) return null;

  return (
    <div>
   <div className="flex gap-3 mb-8 p-2 bg-gray-50 rounded-xl">
        {insideTabs.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <button
              key={item.id}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                insideTab === index + 1
                  ? "bg-blue-600 text-white shadow-lg transform scale-105"
                  : "text-gray-600 hover:bg-white hover:shadow-md"
              }`}
              onClick={() => setInsideTab(index + 1)}
            >
              <IconComponent size={18} />
              {item.title}
            </button>
          );
        })}
      </div>

      {/* Video Tab Content */}
      {insideTab === 1 && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Video className="text-blue-600" size={24} />
              إضافة فيديو تعليمي
            </h3>

            {/* Unit Name */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                اسم الوحدة *
              </label>
              <input
                type="text"
                value={videoUnit}
                onChange={(e) => setVideoUnit(e.target.value)}
                placeholder="أدخل اسم الوحدة"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Video Type Selection */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                نوع الفيديو
              </label>
              <div className="flex gap-3">
                {["فيديو جديد", "فيديو موجود"].map((item, index) => (
                  <button
                    key={index}
                    onClick={() => setIsNewVideo(item === "فيديو جديد")}
                    className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                      (isNewVideo && item === "فيديو جديد") || (!isNewVideo && item === "فيديو موجود")
                        ? "bg-blue-600 text-white shadow-lg"
                        : "bg-white border border-gray-300 text-gray-700 hover:border-blue-300"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Video Content */}
            {isNewVideo ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    عنوان الفيديو *
                  </label>
                  <input
                    type="text"
                    value={videoTitle}
                    onChange={(e) => setVideoTitle(e.target.value)}
                    placeholder="أدخل عنوان الفيديو"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    رابط الفيديو *
                  </label>
                  <input
                    type="url"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="https://youtube.com/watch?v=..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
              </div>
            ) : (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  اختر فيديو موجود *
                </label>
                <select
                  value={selectedVideo}
                  onChange={(e) => handleVideoChange(Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">-- اختر فيديو --</option>
                  {existingVideos.map((video) => (
                    <option key={video.id} value={video.id}>
                      {video.title} ({video.duration})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              onClick={handleAddVideo}
              className="mt-6 w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              <Plus size={20} />
              إضافة الفيديو
            </button>
          </div>
        </div>
      )}

      {/* Exam Tab Content */}
      {insideTab === 2 && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-100">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <FileText className="text-green-600" size={24} />
              إضافة اختبار
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  اسم الوحدة *
                </label>
                <input
                  type="text"
                  value={examUnit}
                  onChange={(e) => setExamUnit(e.target.value)}
                  placeholder="أدخل اسم الوحدة"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  عنوان الاختبار *
                </label>
                <input
                  type="text"
                  value={examTitle}
                  onChange={(e) => setExamTitle(e.target.value)}
                  placeholder="أدخل عنوان الاختبار"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  رابط الاختبار *
                </label>
                <input
                  type="url"
                  value={examUrl}
                  onChange={(e) => setExamUrl(e.target.value)}
                  placeholder="أدخل رابط الاختبار"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

             
            </div>

            <button
              onClick={handleAddExam}
              className="mt-6 w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-4 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              <Check size={20} />
              إضافة الاختبار
            </button>
          </div>
        </div>
      )}

      {/* Preview Section */}
      <div className="mt-8 p-6 bg-gray-50 rounded-xl">
        <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <BookOpen size={20} />
          معاينة المحتوى المضاف
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg border border-blue-100">
            <h5 className="font-semibold text-blue-800 mb-2">الفيديوهات</h5>
            <p className="text-gray-600 text-sm">سيظهر هنا المحتوى المضاف</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-green-100">
            <h5 className="font-semibold text-green-800 mb-2">الاختبارات</h5>
            <p className="text-gray-600 text-sm">سيظهر هنا المحتوى المضاف</p>
          </div>
        </div>
      </div>
      {/* <div>
                           <Form.Item label="اسم الدرس">
                             <Input
                               value={newLesson.name}
                               onChange={(e) => setNewLesson({...newLesson, name: e.target.value})}
                               placeholder="أدخل اسم الدرس"
                             />
                           </Form.Item>
                           
                           <h4 className="mb-2">فيديوهات الدرس:</h4>
                           {newLesson.videos.map((video, index) => (
                             <Card key={index} size="small" className="mb-3">
                               <Row gutter={16} align="middle">
                                 <Col xs={24} md={10}>
                                   <Form.Item label={`رابط الفيديو ${index + 1}`}>
                                     <Input
                                       value={video.link}
                                       onChange={(e) => handleUpdateVideoInLesson(index, "link", e.target.value)}
                                       placeholder="أدخل رابط الفيديو"
                                     />
                                   </Form.Item>
                                 </Col>
                                 <Col xs={24} md={10}>
                                   <Form.Item label={`مدة الفيديو ${index + 1}`}>
                                     <Input
                                       value={video.duration}
                                       onChange={(e) => handleUpdateVideoInLesson(index, "duration", e.target.value)}
                                       placeholder="أدخل مدة الفيديو"
                                     />
                                   </Form.Item>
                                 </Col>
                                 <Col xs={24} md={4}>
                                   {newLesson.videos.length > 1 && (
                                     <Button 
                                       danger 
                                       icon={<DeleteOutlined />}
                                       onClick={() => handleRemoveVideoFromLesson(index)}
                                     >
                                       حذف
                                     </Button>
                                   )}
                                 </Col>
                               </Row>
                             </Card>
                           ))}
                           
                           <Button 
                             type="dashed" 
                             onClick={handleAddVideoToLesson}
                             className="mb-4"
                             block
                             icon={<PlusOutlined />}
                           >
                             إضافة فيديو آخر
                           </Button>
                           
                           <Button 
                             type="primary" 
                             onClick={handleAddLesson}
                             className="mb-4"
                             block
                             icon={<PlayCircleOutlined />}
                           >
                             إضافة درس جديد
                           </Button>
   
                           <Divider />
   
                           <div className="mt-4">
                             <h4 className="mb-2">الدروس المضافة:</h4>
                             {lessons.length > 0 ? (
                               <Row gutter={16}>
                                 {lessons.map((lesson, index) => (
                                   <Col xs={24} md={12} lg={8} key={index} className="mb-3">
                                     <Card 
                                       size="small" 
                                       title={lesson.name}
                                       extra={
                                         <Button 
                                           type="text" 
                                           danger 
                                           icon={<DeleteOutlined />}
                                           onClick={() => handleRemoveLesson(index)}
                                         />
                                       }
                                     >
                                       <p>عدد الفيديوهات: {lesson.videos.length}</p>
                                       <ul>
                                         {lesson.videos.map((video, vidIndex) => (
                                           <li key={vidIndex}>
                                             الفيديو {vidIndex + 1}: {video.duration}
                                           </li>
                                         ))}
                                       </ul>
                                     </Card>
                                   </Col>
                                 ))}
                               </Row>
                             ) : (
                               <p className="text-gray-500">لم يتم إضافة أي دروس بعد</p>
                             )}
                           </div>
                         </div> */}
    </div>
  );
}
