"use client";

import React, { useState, useEffect } from "react";
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
  ShareAltOutlined,
  HeartOutlined,
  StarOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined,
  EditOutlined,
  DeleteOutlined,
  MoneyCollectFilled,
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
  Rate,
  Badge,
  Tooltip,
  Space,
  Typography,
  Image,
  ConfigProvider,
  message,
} from "antd";
import dayjs from "dayjs";
import { DollarSign, Star } from "lucide-react";

const { Title, Text, Paragraph } = Typography;

// Mock data - replace with actual API call
const mockSubjectData = {
  id: 1,
  code: "MTH101",
  name: "الرياضيات المتقدمة",
  imageUrl: "https://via.placeholder.com/400x250/0F7490/FFFFFF?text=الرياضيات",
  price: 499,
  duration: "3 شهور",
  attachment: "شامل كتاب الدورة PDF + مذكرات إضافية",
  description:
    "مفاهيم الرياضيات الأساسية بما في ذلك الجبر والهندسة وحساب التفاضل والتكامل",
  status: "نشط",
  genderPolicy: "female",
  capacity: 300,
  currentEnrollment: 245,
  availableFrom: "2025-08-01",
  availableTo: "2025-12-01",
  summary:
    "<p>هذه الدورة تغطي المفاهيم الأساسية في الرياضيات بطريقة مبسطة ومفهومة للطلاب.</p>",
  terms:
    "<ul><li>سياسة الاسترجاع خلال 7 أيام من بداية الدورة</li><li>حقوق الاستخدام محفوظة للمنصة</li><li>يمنع مشاركة المحتوى خارج المنصة</li></ul>",
  features:
    "<ul><li>محاضرات مسجلة عالية الجودة</li><li>اختبارات تفاعلية</li><li>شهادة اجتياز معتمدة</li><li>دعم فني على مدار الساعة</li></ul>",
  overview:
    "<p>تفاصيل موسعة عن محاور الدورة وأهداف التعلم. تشمل الدورة 12 وحدة تعليمية تغطي جميع جوانب الرياضيات الأساسية والمتقدمة.</p>",
  rating: 4.8,
  reviewsCount: 156,
  instructor: {
    name: "د. أحمد محمد",
    avatar: "https://via.placeholder.com/64x64/0F7490/FFFFFF?text=د.أ",
    specialization: "أستاذ الرياضيات التطبيقية",
  },
  createdAt: "2025-01-15",
  updatedAt: "2025-08-10",
};

const SubjectDetails = ({ subjectId }) => {
  const [subject, setSubject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    // Simulate API call
    const fetchSubject = async () => {
      setLoading(true);
      try {
        // Replace with actual API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setSubject(mockSubjectData);
      } catch (error) {
        message.error("فشل في تحميل بيانات المادة");
      } finally {
        setLoading(false);
      }
    };

    fetchSubject();
  }, [subjectId]);

  const getStatusColor = (status) => {
    switch (status) {
      case "نشط":
        return "green";
      case "غير نشط":
        return "red";
      case "مسودة":
        return "orange";
      default:
        return "default";
    }
  };

  const getGenderPolicyText = (policy) => {
    switch (policy) {
      case "male":
        return "للذكور فقط";
      case "female":
        return "للإناث فقط";
      case "both":
        return "للجميع";
      default:
        return "غير محدد";
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
        return "❓";
    }
  };

  const handleEnroll = () => {
    message.success("تم التسجيل في الدورة بنجاح!");
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    message.success("تم نسخ رابط المادة!");
  };

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
    message.success(isFavorite ? "تم إزالة من المفضلة" : "تم إضافة للمفضلة");
  };

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
          لم يتم العثور على المادة
        </Title>
      </div>
    );
  }

  const enrollmentProgress =
    (subject.currentEnrollment / subject.capacity) * 100;
  const daysLeft = dayjs(subject.availableTo).diff(dayjs(), "day");

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#0F7490",
          borderRadius: 12,
        },
      }}
    >
      <div className=" bg-gray-50">
        <div className=" mx-auto px-4 py-8">
          {/* Content Sections */}
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={16}>
              <div className="space-y-6">
                {/* Overview */}
                <Card title={""} className="shadow-sm">
                  {/* Statistics Cards */}
                  <Row gutter={[16, 16]} className="">
                    <Col xs={24} sm={12} lg={12}>
                      <Card  className="text-center h-full">
                        <div className="mb-2">
                          {/* <TeamOutlined className="text-lg text-[#0F7490]" /> */}
                          <div className="text-2xl font-semibold text-primary">
                            معدل الإشغال
                          </div>
                        </div>
                        <Progress
                          type="circle"
                          percent={Math.round(enrollmentProgress)}
                          width={80}
                          strokeColor="#0F7490"
                          format={(percent) => `${percent}%`}
                        />
                        <div className="text-xs text-gray-600 mt-2">
                          {subject.currentEnrollment} / {subject.capacity}
                        </div>
                      </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={12}>
                      <Card className="text-center h-full">
                        <Statistic
                          title="التقييم"
                          value={subject.rating}
                          suffix="/ 5"
                          prefix={<Star />}
                          precision={1}
                          valueStyle={{ color: "#faad14" }}
                        />
                        <div className="text-2xl text-primary font-semibold">
                          ({subject.reviewsCount} تقييم)
                        </div>
                      </Card>
                    </Col>
                  </Row>
                </Card>
                {/* Summary */}
                {subject.summary && (
                  <Card
                    title={
                      <div className="flex items-center gap-2">
                        <FileTextOutlined className="text-[#0F7490]" />
                        <span>نبذة مختصرة</span>
                      </div>
                    }
                    className="shadow-sm"
                  >
                    <div
                      className="prose prose-lg max-w-none"
                      dangerouslySetInnerHTML={{ __html: subject.summary }}
                    />
                  </Card>
                )}

                <Card
                  title={
                    <div className="flex items-center gap-2">
                      <BookOutlined className="text-[#0F7490]" />
                      <span>نبذة عن الدورة</span>
                    </div>
                  }
                  className="shadow-sm"
                >
                  <div
                    className="prose prose-lg max-w-none"
                    dangerouslySetInnerHTML={{ __html: subject.overview }}
                  />
                </Card>

                {/* Features */}
                <Card
                  title={
                    <div className="flex items-center gap-2">
                      <CheckCircleOutlined className="text-[#0F7490]" />
                      <span>مميزات الدورة</span>
                    </div>
                  }
                  className="shadow-sm"
                >
                  <div
                    className="prose prose-lg max-w-none"
                    dangerouslySetInnerHTML={{ __html: subject.features }}
                  />
                </Card>

                {/* Terms */}
                <Card
                  title={
                    <div className="flex items-center gap-2">
                      <InfoCircleOutlined className="text-[#0F7490]" />
                      <span>الشروط والأحكام</span>
                    </div>
                  }
                  className="shadow-sm"
                >
                  <div
                    className="prose prose-lg max-w-none"
                    dangerouslySetInnerHTML={{ __html: subject.terms }}
                  />
                </Card>
              </div>
            </Col>

            <Col xs={24} lg={8}>
              <div className="space-y-6">
                {/* Instructor Info */}
                <Card title="المدرس" className="shadow-sm">
                  <div className="flex items-center gap-4 mb-4">
                    <Avatar size={64} src={subject.instructor.avatar} />
                    <div>
                      <Title level={4} className="mb-1">
                        {subject.instructor.name}
                      </Title>
                      <Text className="text-gray-600">
                        {subject.instructor.specialization}
                      </Text>
                    </div>
                  </div>
                  <Button type="primary" ghost block>
                    عرض الملف الشخصي
                  </Button>
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
                        {subject.price} ر.س
                      </Text>
                    </div>
                    <Divider className="my-3" />
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 flex items-center gap-2">
                        <DollarSign />
                        المدة
                      </span>
                      <Text strong className="">
                        {subject.duration}
                      </Text>
                    </div>
                    <Divider className="my-3" />
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 flex items-center gap-2">
                        <CalendarOutlined />
                        تاريخ البداية
                      </span>
                      <Text>
                        {dayjs(subject.availableFrom).format("DD/MM/YYYY")}
                      </Text>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 flex items-center gap-2">
                        <CalendarOutlined />
                        تاريخ النهاية
                      </span>
                      <Text>
                        {dayjs(subject.availableTo).format("DD/MM/YYYY")}
                      </Text>
                    </div>
                    <Divider className="my-3" />
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 flex items-center gap-2">
                        <UserOutlined />
                        السياسة
                      </span>
                      <Text>{getGenderPolicyText(subject.genderPolicy)}</Text>
                    </div>
                    {subject.attachment && (
                      <>
                        <Divider className="my-3" />
                        <div>
                          <span className="text-gray-600 flex items-center gap-2 mb-2">
                            <DownloadOutlined />
                            المرفقات
                          </span>
                          <Text className="text-sm">{subject.attachment}</Text>
                        </div>
                      </>
                    )}
                  </div>
                </Card>

                {/* Admin Actions (if user is admin) */}
                <Card title="إجراءات إدارية" className="shadow-sm">
                  <Space direction="vertical" className="w-full">
                    <Button icon={<EditOutlined />} block className="text-left">
                      تعديل المادة
                    </Button>
                    <Button
                      icon={<DeleteOutlined />}
                      danger
                      block
                      className="text-left"
                    >
                      حذف المادة
                    </Button>
                  </Space>
                </Card>

                {/* Quick Stats */}
                <Card title="إحصائيات سريعة" className="shadow-sm">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">تاريخ الإنشاء:</span>
                      <Text>
                        {dayjs(subject.createdAt).format("DD/MM/YYYY")}
                      </Text>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">آخر تحديث:</span>
                      <Text>
                        {dayjs(subject.updatedAt).format("DD/MM/YYYY")}
                      </Text>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">المشاهدات:</span>
                      <Text>1,234</Text>
                    </div>
                  </div>
                </Card>
              </div>
            </Col>
          </Row>
        </div>
      </div>

      {/* Custom styles for RTL content */}
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
