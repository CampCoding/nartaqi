import React, { useState } from "react";
import { Card, Badge, Avatar, Tooltip, Button, Row, Col, Tag, Modal, message } from "antd";
import {
  EyeOutlined,
  LockOutlined,
  UnlockOutlined,
  MailOutlined,
  PhoneOutlined,
  CalendarOutlined,
  IdcardOutlined,
  StarOutlined,
  PlusOutlined,
} from "@ant-design/icons";

// Helper functions
const getGradeColor = (grade) => {
  if (grade?.startsWith("12")) return "#8B5CF6"; // purple
  if (grade?.startsWith("11")) return "#0F766E"; // teal
  if (grade?.startsWith("10")) return "#D4A73C"; // gold
  return "#64748B";
};

const getGPAColor = (gpa) => (gpa >= 3.7 ? "#16a34a" : gpa >= 3.3 ? "#eab308" : "#ef4444");
const getStatusAnt = (s) =>
  s === "active" ? "success" : s === "inactive" ? "default" : "warning";

const getInitials = (name = "") =>
  name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

// Student Card Component
function StudentsCards({
  students = [],
  loading = false,
  onView = () => {},
  onChangeStatus = () => {},
}) {
  return (
    <div className="p-3">
      <Row gutter={[16, 16]}>
        {students.map((s) => (
          <Col xs={24} sm={12} lg={8} xl={6} key={s.id}>
            <Card
              loading={loading}
              className="shadow-md border-0 rounded-2xl"
              styles={{ body: { padding: 16 } }}
            >
              {/* Header */}
              <div className="flex items-center gap-3 mb-3">
                <Avatar
                  size={48}
                  className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold"
                >
                  {getInitials(s.name)}
                </Avatar>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900 truncate">
                      {s.name}
                    </span>
                    <Badge status={getStatusAnt(s.status)} />
                  </div>
                  <div className="text-xs text-gray-500 flex items-center gap-1">
                    <IdcardOutlined />
                    {s.studentId}
                  </div>
                </div>
              </div>

              {/* Grade & GPA */}
              <div className="flex items-center justify-between mb-3">
                <Tag
                  className="px-3 py-1 text-xs font-medium border-0"
                  style={{ backgroundColor: getGradeColor(s.grade), color: "#fff" }}
                >
                  {s.grade}
                </Tag>
                <div className="flex items-center text-sm">
                  <StarOutlined className="mr-1 text-yellow-500" />
                  <span style={{ color: getGPAColor(s.gpa), fontWeight: 600 }}>
                    {s.gpa} GPA
                  </span>
                </div>
              </div>

              {/* Contact */}
              <div className="space-y-1 mb-3">
                <div className="text-sm text-blue-600 flex items-center">
                  <MailOutlined className="mr-2 text-xs" />
                  <span className="truncate">{s.email}</span>
                </div>
                <div className="text-sm text-gray-600 flex items-center">
                  <PhoneOutlined className="mr-2 text-xs" /> {s.phone}
                </div>
              </div>

              {/* Enrolled */}
              <div className="flex items-center text-gray-700 text-sm mb-4">
                <CalendarOutlined className="mr-2 text-blue-500" />
                {new Date(s.enrolledAt).toLocaleDateString()}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <Tooltip title="View Details">
                  <Button
                    type="primary"
                    icon={<EyeOutlined />}
                    className="bg-purple-600 hover:bg-purple-700 border-purple-600"
                    onClick={() => onView(s)}
                  />
                </Tooltip>

                {s.status !== "blocked" ? (
                  <Button
                    danger
                    icon={<LockOutlined />}
                    className="!flex-1"
                    onClick={() => onChangeStatus(s.id, "blocked")}
                  >
                    Block
                  </Button>
                ) : (
                  <Button
                    type="primary"
                    icon={<UnlockOutlined />}
                    className="bg-green-600 hover:bg-green-700 border-green-600 !flex-1"
                    onClick={() => onChangeStatus(s.id, "active")}
                  >
                    Unblock
                  </Button>
                )}
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}

// Add Student Modal Component
function AddStudentModal({ open, setOpen }) {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);

  // Mock upload function
  const mockUpload = ({ file, onSuccess, onError }) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setTimeout(() => {
        onSuccess({ url: reader.result });
        message.success(`${file.name} uploaded successfully`);
      }, 1000);
    };
    reader.onerror = (error) => {
      onError(error);
      message.error(`${file.name} upload failed`);
    };
  };

  const handleImageChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const onFinish = (values) => {
    console.log('Form values:', values);
    console.log('Uploaded files:', fileList);
    setOpen(false);
    form.resetFields();
    setFileList([]);
    message.success('Student added successfully!');
  };

  const uploadProps = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('You can only upload image files!');
        return Upload.LIST_IGNORE;
      }
      
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('Image must be smaller than 2MB!');
        return Upload.LIST_IGNORE;
      }
      
      setFileList([...fileList, file]);
      return false;
    },
    fileList,
    multiple: false,
  };

  return (
    <Modal
      title={null}
      open={open}
      onCancel={() => setOpen(false)}
      footer={null}
      width="90%"
      style={{ maxWidth: "600px" }}
    >
      <div dir="rtl">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-[#0F7490] rounded-lg flex items-center justify-center">
              <PlusOutlined className="text-white text-lg" />
            </div>
            <h1 className="text-3xl font-bold text-[#202938]">
              إضافة طالب جديد
            </h1>
          </div>
          <p className="text-gray-600">إضافة طالب جديد إلى النظام</p>
        </div>

        <div className="mx-auto">
          <Form
            form={form}
            onFinish={onFinish}
            layout="vertical"
            initialValues={{ remember: true }}
          >
            <Form.Item
              label="الاسم"
              name="name"
              rules={[{ required: true, message: "يرجى إدخال الاسم" }]}
            >
              <Input placeholder="يرجى إدخال الاسم" />
            </Form.Item>

            <Form.Item
              label="الايميل"
              name="email"
              rules={[
                { required: true, message: "يرجى إدخال الايميل" },
                { type: 'email', message: 'يجب إدخال بريد إلكتروني صحيح' }
              ]}
            >
              <Input placeholder="يرجى إدخال الايميل" />
            </Form.Item>

            <Form.Item
              label="الهاتف"
              name="phone"
              rules={[{ required: true, message: "يرجى إدخال الهاتف" }]}
            >
              <Input placeholder="يرجى إدخال الهاتف" />
            </Form.Item>

            <Form.Item
              label="الصف"
              name="grade"
              rules={[{ required: true, message: "يرجى إدخال الصف" }]}
            >
              <Input placeholder="يرجى إدخال الصف" />
            </Form.Item>

            <Form.Item
              label="المعدل التراكمي"
              name="gpa"
              rules={[{ required: true, message: "يرجى إدخال المعدل التراكمي" }]}
            >
              <Input placeholder="يرجى إدخال المعدل التراكمي" />
            </Form.Item>

            <Form.Item
              label="الصورة"
              name="image"
              rules={[{ required: true, message: "يرجى رفع صورة" }]}
            >
              <Upload
                {...uploadProps}
                listType="picture"
                customRequest={mockUpload}
                onChange={handleImageChange}
              >
                <Button icon={<UploadOutlined />}>اختر صورة</Button>
              </Upload>
              <div className="text-xs text-gray-500 mt-2">
                يمكنك رفع صورة واحدة فقط (أقصى حجم 2MB)
              </div>
            </Form.Item>

            <Form.Item className="flex justify-end mt-8">
              <Button 
                onClick={() => setOpen(false)} 
                className="ml-4"
              >
                إلغاء
              </Button>
              <Button 
                type="primary" 
                className="!bg-primary !text-white" 
                htmltype="submit"
              >
                إضافة المتدرب
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </Modal>
  );
}

// Main Demo Component
export default function StudentManagementDemo() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [students, setStudents] = useState([
    {
      id: 1,
      name: "أحمد محمد",
      studentId: "STU-001",
      grade: "12-A",
      gpa: 3.8,
      email: "ahmed@example.com",
      phone: "+966 123 456 789",
      enrolledAt: "2023-09-01",
      status: "active"
    },
    {
      id: 2,
      name: "سارة عبدالله",
      studentId: "STU-002",
      grade: "11-B",
      gpa: 3.2,
      email: "sara@example.com",
      phone: "+966 987 654 321",
      enrolledAt: "2023-08-15",
      status: "active"
    },
    {
      id: 3,
      name: "فاطمة علي",
      studentId: "STU-003",
      grade: "10-C",
      gpa: 3.9,
      email: "fatima@example.com",
      phone: "+966 555 123 456",
      enrolledAt: "2023-09-05",
      status: "blocked"
    },
    {
      id: 4,
      name: "خالد إبراهيم",
      studentId: "STU-004",
      grade: "12-B",
      gpa: 3.5,
      email: "khaled@example.com",
      phone: "+966 777 888 999",
      enrolledAt: "2023-08-20",
      status: "active"
    }
  ]);

  const handleViewStudent = (student) => {
    Modal.info({
      title: student.name,
      content: (
        <div>
          <p><strong>Student ID:</strong> {student.studentId}</p>
          <p><strong>Grade:</strong> {student.grade}</p>
          <p><strong>GPA:</strong> {student.gpa}</p>
          <p><strong>Email:</strong> {student.email}</p>
          <p><strong>Phone:</strong> {student.phone}</p>
          <p><strong>Enrolled At:</strong> {new Date(student.enrolledAt).toLocaleDateString()}</p>
          <p><strong>Status:</strong> {student.status}</p>
        </div>
      ),
      okText: "Close",
    });
  };

  const handleChangeStatus = (id, status) => {
    setStudents(students.map(student => 
      student.id === id ? {...student, status} : student
    ));
    message.success(`Student status updated to ${status}`);
  };

  const handleAddStudent = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">إدارة المتدربين</h1>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            size="large"
            onClick={handleAddStudent}
            className="bg-blue-600 hover:bg-blue-700 border-blue-600"
          >
            إضافة طالب جديد
          </Button>
        </div>
        
        <StudentsCards
          students={students}
          onView={handleViewStudent}
          onChangeStatus={handleChangeStatus}
        />
        
        <AddStudentModal 
          open={isModalOpen} 
          setOpen={setIsModalOpen} 
        />
      </div>
    </div>
  );
}