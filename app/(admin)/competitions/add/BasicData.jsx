import { Card, DatePicker, Form, Input, InputNumber, Select, Upload, Progress, Alert, Typography, Row, Col, Tooltip, Tag } from "antd";
import React, { useState, useEffect } from "react";
import { 
  InboxOutlined, 
  InfoCircleOutlined, 
  CalendarOutlined, 
  UserOutlined, 
  FileImageOutlined,
  TrophyOutlined,
  BulbOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined
} from "@ant-design/icons";
import dynamic from "next/dynamic";

const { RangePicker } = DatePicker;
const { Dragger } = Upload;
const { Title, Text, Paragraph } = Typography;

const ReactQuill = dynamic(
  () => import("react-quill-new").then((m) => m.default),
  { ssr: false }
);

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ align: [] }],
    ["link", "blockquote", "code-block", "image"],
    ["clean"],
  ],
};

const quillFormats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "list",
  "bullet",
  "align",
  "link",
  "blockquote",
  "code-block",
  "image",
];

const normFile = (e) => (Array.isArray(e) ? e : e?.fileList ?? []);

// Enhanced Rich Text Editor with better UI
const RichText = ({ label, name, required, placeholder = "اكتب هنا...", icon, description }) => (
  <div className="mb-6">
    <div className="flex items-center gap-2 mb-3">
      {icon && <div className="p-1.5 bg-blue-50 rounded-lg text-blue-600">{icon}</div>}
      <div>
        <div className="flex items-center gap-2">
          <Text strong className="text-gray-800">{label}</Text>
          {required && <span className="text-red-500 text-xs">*</span>}
        </div>
        {description && <Text type="secondary" className="text-xs">{description}</Text>}
      </div>
    </div>
    <Form.Item
      name={name}
      rules={required ? [{ required: true, message: `أدخل ${label}` }] : []}
      className="mb-0"
    >
      <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        <ReactQuill
          theme="snow"
          modules={quillModules}
          formats={quillFormats}
          placeholder={placeholder}
          style={{ minHeight: '120px' }}
        />
      </div>
    </Form.Item>
  </div>
);

// Progress indicator component
const FormProgress = ({ form }) => {
  const [progress, setProgress] = useState(0);
  const [completedFields, setCompletedFields] = useState([]);
  
  useEffect(() => {
    const values = form.getFieldsValue();
    let completed = [];
    let total = 4; // Required fields count
    
    if (values.title?.trim()) completed.push('العنوان');
    if (values.type) completed.push('النوع');
    if (values.range?.length === 2) completed.push('الفترة الزمنية');
    if (values.coverFile?.length > 0) completed.push('صورة الغلاف');
    
    setCompletedFields(completed);
    setProgress(Math.round((completed.length / total) * 100));
  }, [form]);

  return (
    <Card className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
    
      <div className="flex flex-wrap gap-1">
        {completedFields.map(field => (
          <Tag key={field} color="success" className="text-xs">
            <CheckCircleOutlined className="mr-1" />
            {field}
          </Tag>
        ))}
      </div>
    </Card>
  );
};

// Image preview component
const ImagePreview = ({ fileList }) => {
  if (!fileList || fileList.length === 0) return null;
  
  const file = fileList[0];
  const imageUrl = file.originFileObj ? URL.createObjectURL(file.originFileObj) : file.url;
  
  return (
    <Card size="small" className="mt-4 overflow-hidden">
      <div className="flex items-center gap-3">
        <img 
          src={imageUrl} 
          alt="معاينة الغلاف" 
          className="w-20 h-20 object-cover rounded-lg border"
        />
        <div>
          <Text strong className="block">معاينة الغلاف</Text>
          <Text type="secondary" className="text-xs">
            {file.name} • {(file.size / 1024).toFixed(1)} KB
          </Text>
        </div>
      </div>
    </Card>
  );
};

export default function BasicData() {
  const [form] = Form.useForm();
  const [selectedType, setSelectedType] = useState('daily');
  const [uploadedFiles, setUploadedFiles] = useState([]);

  // Type descriptions
  const typeDescriptions = {
    daily: "مسابقة سريعة تستمر ليوم واحد، مناسبة للأسئلة البسيطة والمتوسطة",
    weekly: "مسابقة أسبوعية تتيح مشاركة أوسع وأسئلة أكثر تنوعاً",
    monthly: "مسابقة شهرية شاملة مع جوائز كبيرة وتحديات متقدمة"
  };

  const handleUploadChange = (info) => {
    setUploadedFiles(info.fileList);
  };

  return (
    <div className="space-y-8" dir="rtl">
      {/* <FormProgress form={form} /> */}
      
      {/* Main Information Card */}
      <Card 
        className="rounded-2xl shadow-lg border-0 overflow-hidden"
        bodyStyle={{ padding: 0 }}
      >
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6">
          <div className="flex items-center gap-3 text-white">
            <div className="p-3 bg-white/20 rounded-xl">
              <InfoCircleOutlined className="text-2xl" />
            </div>
            <div>
              <Title level={3} className="!text-white !mb-1">المعلومات الأساسية</Title>
              <Text className="text-blue-100">أدخل البيانات الرئيسية للمسابقة</Text>
            </div>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={12}>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Text strong className="text-gray-800">عنوان المسابقة</Text>
                  <span className="text-red-500">*</span>
                  <Tooltip title="اختر عنواناً جذاباً ومميزاً">
                    <InfoCircleOutlined className="text-gray-400 text-xs" />
                  </Tooltip>
                </div>
                <Form.Item
                  name="title"
                  rules={[
                    { required: true, message: "أدخل عنوان المسابقة" },
                    { min: 3, message: "العنوان قصير جداً" },
                    { max: 100, message: "العنوان طويل جداً" }
                  ]}
                  className="mb-0"
                >
                  <Input 
                    placeholder="مثال: مسابقة الثقافة العامة الأسبوعية"
                    size="large"
                    className="rounded-xl"
                    showCount
                    maxLength={100}
                  />
                </Form.Item>
              </div>
            </Col>
            
            <Col xs={24} lg={12}>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Text strong className="text-gray-800">نوع المسابقة</Text>
                  <span className="text-red-500">*</span>
                </div>
                <Form.Item
                  name="type"
                  rules={[{ required: true, message: "اختر نوع المسابقة" }]}
                  className="mb-0"
                >
                  <Select
                    placeholder="اختر النوع"
                    size="large"
                    className="rounded-xl"
                    onChange={setSelectedType}
                    options={[
                      { 
                        value: "daily", 
                        label: (
                          <div className="flex items-center gap-2 py-1">
                            <ClockCircleOutlined className="text-orange-500" />
                            <div>
                              <div className="font-medium">يومية</div>
                              {/* <div className="text-xs text-gray-500">مدة قصيرة - نتائج سريعة</div> */}
                            </div>
                          </div>
                        )
                      },
                      { 
                        value: "weekly", 
                        label: (
                          <div className="flex items-center gap-2 py-1">
                            <CalendarOutlined className="text-blue-500" />
                            <div>
                              <div className="font-medium">أسبوعية</div>
                              {/* <div className="text-xs text-gray-500">مشاركة واسعة - تفاعل أكبر</div> */}
                            </div>
                          </div>
                        )
                      },
                      { 
                        value: "monthly", 
                        label: (
                          <div className="flex items-center gap-2 py-1">
                            <TrophyOutlined className="text-green-500" />
                            <div>
                              <div className="font-medium">شهرية</div>
                              {/* <div className="text-xs text-gray-500">مسابقة كبيرة - جوائز مميزة</div> */}
                            </div>
                          </div>
                        )
                      },
                    ]}
                  />
                </Form.Item>
                {selectedType && (
                  <Alert
                    message={typeDescriptions[selectedType]}
                    type="info"
                    showIcon={false}
                    className="text-xs mt-2 bg-blue-50 border-blue-200"
                  />
                )}
              </div>
            </Col>
          </Row>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Text strong className="text-gray-800">وصف مختصر</Text>
              <Tooltip title="اكتب وصفاً جذاباً يوضح محتوى المسابقة">
                <InfoCircleOutlined className="text-gray-400 text-xs" />
              </Tooltip>
            </div>
            <Form.Item
              name="description"
              rules={[{ max: 300, message: "الوصف طويل جداً" }]}
              className="mb-0"
            >
              <Input.TextArea 
                rows={4} 
                placeholder="نبذة مختصرة وجذابة عن المسابقة وأهدافها..."
                className="rounded-xl resize-none"
                showCount
                maxLength={300}
              />
            </Form.Item>
          </div>

          <Row gutter={[24, 24]}>
            <Col xs={24} lg={12}>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CalendarOutlined className="text-blue-500" />
                  <Text strong className="text-gray-800">فترة المسابقة</Text>
                  <span className="text-red-500">*</span>
                </div>
                <Form.Item
                  name="range"
                  rules={[{ required: true, message: "حدد موعد بداية ونهاية المسابقة" }]}
                  className="mb-0"
                >
                  <RangePicker 
                    showTime={{ format: 'HH:mm' }}
                    className="w-full rounded-xl" 
                    size="large"
                    placeholder={['تاريخ البداية', 'تاريخ النهاية']}
                    format="YYYY-MM-DD HH:mm"
                  />
                </Form.Item>
              </div>
            </Col>
            
            <Col xs={24} lg={12}>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <UserOutlined className="text-green-500" />
                  <Text strong className="text-gray-800">عدد المشاركين</Text>
                  <span className="text-red-500">*</span>
                </div>
                <Form.Item
                  name="capacity"
                  rules={[
                    { required: true, message: "حدد العدد الأقصى للمشاركين" },
                    { type: 'number', min: 10, message: 'الحد الأدنى 10 مشاركين' }
                  ]}
                  className="mb-0"
                >
                  <InputNumber 
                    min={10} 
                    max={10000}
                    className="w-full rounded-xl" 
                    size="large"
                    placeholder="50"
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    addonAfter="مشارك"
                  />
                </Form.Item>
              </div>
            </Col>
          </Row>
        </div>
      </Card>

      {/* Cover Image Card */}
      <Card 
        className="rounded-2xl shadow-lg border-0 overflow-hidden"
        bodyStyle={{ padding: 0 }}
      >
        <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-6">
          <div className="flex items-center gap-3 text-white">
            <div className="p-3 bg-white/20 rounded-xl">
              <FileImageOutlined className="text-2xl" />
            </div>
            <div>
              <Title level={3} className="!text-white !mb-1">صورة الغلاف</Title>
              <Text className="text-purple-100">اختر صورة جذابة تمثل المسابقة</Text>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <Form.Item
            name="coverFile"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            rules={[{ required: true, message: "ارفع صورة غلاف للمسابقة" }]}
            className="mb-0"
          >
            <Dragger 
              beforeUpload={() => false} 
              maxCount={1} 
              accept="image/*"
              className="!border-dashed !border-2 hover:!border-purple-400 transition-colors rounded-xl"
              onChange={handleUploadChange}
            >
              <div className="py-8">
                <p className="ant-upload-drag-icon">
                  <InboxOutlined className="text-5xl text-purple-500" />
                </p>
                <p className="ant-upload-text text-lg font-medium text-gray-700 mb-2">
                  اسحب الصورة هنا أو اضغط للاختيار
                </p>
                <p className="ant-upload-hint text-gray-500">
                  PNG, JPG, JPEG • أقصى حجم 5MB • أبعاد مقترحة: 1200x600
                </p>
              </div>
            </Dragger>
          </Form.Item>
          
          <ImagePreview fileList={uploadedFiles} />
        </div>
      </Card>

      {/* Additional Details Card */}
      <Card 
        className="rounded-2xl shadow-lg border-0 overflow-hidden"
        bodyStyle={{ padding: 0 }}
      >
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-white">
              <div className="p-3 bg-white/20 rounded-xl">
                <BulbOutlined className="text-2xl" />
              </div>
              <div>
                <Title level={3} className="!text-white !mb-1">تفاصيل إضافية</Title>
                <Text className="text-emerald-100">معلومات تفصيلية لجعل المسابقة أكثر جاذبية</Text>
              </div>
            </div>
            <Tag color="default" className="bg-white/20 border-white/30 text-white">
              اختياري
            </Tag>
          </div>
        </div>
        
        <div className="p-6 space-y-8">
          <Alert
            message="نصيحة"
            description="إضافة تفاصيل غنية ومعلومات شاملة تجعل المسابقة أكثر احترافية وجاذبية للمشاركين"
            type="info"
            showIcon
            className="mb-6 border-blue-200 bg-blue-50"
          />
          
          <RichText 
            label="متى تبدأ المسابقة" 
            name="startsAtRich"
            icon={<ClockCircleOutlined />}
            description="معلومات تفصيلية عن موعد وآلية بدء المسابقة"
            placeholder="مثال: تبدأ المسابقة يوم السبت الساعة 9 صباحاً بتوقيت الرياض..."
          />
          
          <RichText 
            label="الجوائز والحوافز" 
            name="prizes"
            icon={<TrophyOutlined />}
            description="تفاصيل الجوائز والمكافآت للفائزين"
            placeholder="مثال: المركز الأول: 1000 ريال، المركز الثاني: 500 ريال..."
          />
          
          <RichText 
            label="فكرة المسابقة" 
            name="idea"
            icon={<BulbOutlined />}
            description="الهدف والرسالة من وراء هذه المسابقة"
            placeholder="مثال: تهدف هذه المسابقة إلى نشر الثقافة العامة وتشجيع التعلم..."
          />
        </div>
      </Card>
    </div>
  );
}