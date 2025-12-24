"use client";
import React, { useEffect, useState } from 'react'
import PageLayout from '../../../components/layout/PageLayout'
import PagesHeader from '../../../components/ui/PagesHeader'
import BreadcrumbsShowcase from '../../../components/ui/BreadCrumbs'
import {
  Folder,
  Plus,
  Upload,
  Link as LinkIcon,
  FileText,
  Download,
  Edit,
  Trash2,
  Eye,
  Paperclip,
  Calendar,
  Users,
  MessageCircle,
  ExternalLink,
  Globe,
  Share2,
  Copy,
  CheckCircle,
  XCircle,
  AlertCircle,
  MoreVertical,
  Search,
  Filter,
  Grid,
  List
} from 'lucide-react'
import Button from '../../../components/atoms/Button'
import { useRouter, useSearchParams } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux';
import {
  handleGetAllRoundResources,
  handleGetAllRoundResourcesLinks,
  handleAddRoundResource,
  handleEditRoundResource,
  handleDeleteRoundResource,
  handleAddRoundResourceLink,
  handleEditRoundResourceLink,
  handleDeleteRoundResourceLink
} from '../../../lib/features/resourcesSlice';
import {
  Modal,
  Form,
  Input,
  DatePicker,
  Upload as AntUpload,
  Card,
  Row,
  Col,
  Tag,
  Tooltip,
  Space,
  Alert,
  message,
  Dropdown,
  Menu,
  Avatar,
  Progress,
  Badge,
  Empty,
  Select,
  Pagination
} from 'antd';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';

const { TextArea } = Input;
const { Search: AntSearch } = Input;

const breadcrumbs = [
  {
    label: "الرئيسية",
    href: "/",
  },
  {
    label: "مصادر الدورة",
    href: "#",
    current: true
  }
]

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roundId = searchParams.get("roundId");
  const dispatch = useDispatch();

  const [form] = Form.useForm();
  const [linkForm] = Form.useForm();

  const [linksData, setLinksData] = useState({
    whatsapp_link: "",
    telegram_link: "",
  });

  const [newFileData, setNewFileData] = useState({
    name: "",
    description: "",
    file: null,
    show_date: dayjs(),
  });

  const [openAddLinksModal, setOpenAddLinksModal] = useState(false);
  const [openEditLinksModal, setOpenEditLinksModal] = useState(false);
  const [openAddFileModal, setOpenAddFileModal] = useState(false);
  const [openEditFileModal, setOpenEditFileModal] = useState(false);
  const [openDeleteFileModal, setOpenDeleteFileModal] = useState(false);
  const [openDeleteLinkModal, setOpenDeleteLinkModal] = useState(false);

  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedLink, setSelectedLink] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [fileTypeFilter, setFileTypeFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const {
    all_resources_loading,
    all_resources_links,
    all_resources_list,
    add_resource_loading,
    edit_resource_loading,
    delete_resource_loading,
    add_resource_link_loading,
    edit_resource_link_loading,
    delete_resource_link_loading
  } = useSelector(state => state?.resource);

  useEffect(() => {
    if (roundId) {
      dispatch(handleGetAllRoundResources({ body: { round_id: roundId } }));
      dispatch(handleGetAllRoundResourcesLinks({ body: { round_id: roundId } }));
    }
  }, [roundId, dispatch]);

  useEffect(() => {
    const links = all_resources_links?.data?.message;
    if (links && Array.isArray(links) && links.length > 0 && links[0]) {
      setLinksData({
        whatsapp_link: links[0]?.whatsapp_link || "",
        telegram_link: links[0]?.telegram_link || ""
      });
    }
  }, [all_resources_links]);

  // Debug useEffect
  useEffect(() => {
    console.log("Links data structure:", all_resources_links?.data?.message);
    console.log("Is array?", Array.isArray(all_resources_links?.data?.message));
    console.log("Type:", typeof all_resources_links?.data?.message);

    if (all_resources_links?.data?.message) {
      console.log("Keys:", Object.keys(all_resources_links.data.message));
      console.log("First item if array:",
        Array.isArray(all_resources_links.data.message)
          ? all_resources_links.data.message[0]
          : "Not an array"
      );
    }
  }, [all_resources_links]);

  // Handle link submission
  const handleLinksSubmit = async (values) => {
    console.log("Submitting links:", values);
    console.log("Existing links:", all_resources_links?.data?.message);

    // Check if we have existing links
    const existingLinks = all_resources_links?.data?.message;
    const hasExistingLinks = existingLinks && Array.isArray(existingLinks) && existingLinks.length > 0;

    console.log("Has existing links:", hasExistingLinks);
    console.log("Existing link ID:", hasExistingLinks ? existingLinks[0]?.id : "No ID");

    const payload = {
      round_id: roundId,
      whatsapp_link: values.whatsapp_link || "",
      telegram_link: values.telegram_link || ""
    };

    try {
      if (hasExistingLinks && existingLinks[0]?.id) {
        // Edit existing links
        const editPayload = {
          ...payload,
          id: existingLinks[0].id
        };

        console.log("Editing links with payload:", editPayload);

        const result = await dispatch(handleEditRoundResourceLink({
          body: editPayload
        })).unwrap();

        console.log("Edit result:", result);

        if (result?.data?.status === "success") {
          toast.success("تم تحديث الروابط بنجاح");
          dispatch(handleGetAllRoundResourcesLinks({ body: { round_id: roundId } }));
          setOpenEditLinksModal(false);
        } else {
          toast.error(result?.error?.response?.data?.message || "فشل في تحديث الروابط");
        }
      } else {
        // Add new links
        console.log("Adding new links with payload:", payload);

        const result = await dispatch(handleAddRoundResourceLink({
          body: payload
        })).unwrap();

        console.log("Add result:", result);

        if (result?.data?.status === "success") {
          toast.success("تم إضافة الروابط بنجاح");
          dispatch(handleGetAllRoundResourcesLinks({ body: { round_id: roundId } }));
          setOpenAddLinksModal(false);
        } else {
          toast.error(result?.error?.response?.data?.message || "فشل في إضافة الروابط");
        }
      }
    } catch (error) {
      console.error("Error submitting links:", error);
      toast.error("حدث خطأ أثناء حفظ الروابط");
    }
  };

  // Handle file submission
  const handleFileSubmit = (values) => {
    const formData = new FormData();
    formData.append("round_id", roundId);
    formData.append("title", values.name);
    formData.append("description", values.description || "");
    formData.append("show_date", values.show_date.format("YYYY-MM-DD"));


    if (values?.file && values?.file?.length > 0) {
      const fileObj = values?.file[0]?.originFileObj || values?.file[0];
      formData.append("file", fileObj);
    }

    dispatch(handleAddRoundResource({ body: formData }))
      .unwrap()
      .then(res => {
        if (res?.data?.status === "success") {
          toast.success("تم إضافة الملف بنجاح");
          dispatch(handleGetAllRoundResources({ body: { round_id: roundId } }));
          setOpenAddFileModal(false);
          form.resetFields();
        } else {
          toast.error("فشل في إضافة الملف");
        }
      });
  };

  // Handle file edit
  const handleFileEdit = (values) => {
    const formData = new FormData();
    formData.append("id", selectedFile?.id);
    formData.append("title", values.name);
    formData.append("description", values.description || "");
    formData.append("show_date", values.show_date.format("YYYY-MM-DD"));

    if (values.file && values.file.length > 0) {
      const fileObj = values?.file[0]?.originFileObj || values?.file[0];
      formData.append("file", fileObj);
    }

    dispatch(handleEditRoundResource({ body: formData }))
      .unwrap()
      .then(res => {
        if (res?.data?.status === "success") {
          toast.success("تم تحديث الملف بنجاح");
          dispatch(handleGetAllRoundResources({ body: { round_id: roundId } }));
          setOpenEditFileModal(false);
          setSelectedFile(null);
        } else {
          toast.error("فشل في تحديث الملف");
        }
      });
  };

  // Handle file deletion
  const handleFileDelete = () => {
    dispatch(handleDeleteRoundResource({ body: { id: selectedFile?.id } }))
      .unwrap()
      .then(res => {
        if (res?.data?.status === "success") {
          toast.success("تم حذف الملف بنجاح");
          dispatch(handleGetAllRoundResources({ body: { round_id: roundId } }));
          setOpenDeleteFileModal(false);
          setSelectedFile(null);
        } else {
          toast.error("فشل في حذف الملف");
        }
      });
  };

  // Handle link deletion
  const handleLinkDelete = () => {
    const links = all_resources_links?.data?.message;
    if (links && Array.isArray(links) && links.length > 0 && links[0]?.id) {
      dispatch(handleDeleteRoundResourceLink({ body: { id: links[0].id } }))
        .unwrap()
        .then(res => {
          if (res?.data?.status === "success") {
            toast.success("تم حذف الروابط بنجاح");
            dispatch(handleGetAllRoundResourcesLinks({ body: { round_id: roundId } }));
            setOpenDeleteLinkModal(false);
            setSelectedLink(null);
          } else {
            toast.error("فشل في حذف الروابط");
          }
        });
    }
  };

  const getFileType = (fileName) => {
    const extension = fileName?.split('.').pop()?.toLowerCase();
    const types = {
      pdf: { color: 'red', icon: '📕', label: 'PDF' },
      doc: { color: 'blue', icon: '📘', label: 'Word' },
      docx: { color: 'blue', icon: '📘', label: 'Word' },
      ppt: { color: 'orange', icon: '📙', label: 'PowerPoint' },
      pptx: { color: 'orange', icon: '📙', label: 'PowerPoint' },
      xls: { color: 'green', icon: '📗', label: 'Excel' },
      xlsx: { color: 'green', icon: '📗', label: 'Excel' },
      zip: { color: 'purple', icon: '📦', label: 'Archive' },
      rar: { color: 'purple', icon: '📦', label: 'Archive' },
      txt: { color: 'gray', icon: '📄', label: 'Text' },
    };
    return types[extension] || { color: 'gray', icon: '📎', label: 'File' };
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return 'غير معروف';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i];
  };

  const resources = all_resources_list?.data?.message?.resource || [];
  const links = all_resources_links?.data?.message || [];

  return (
    <PageLayout>
      <div dir="rtl">
        <BreadcrumbsShowcase items={breadcrumbs} variant="pill" />

        <PagesHeader
          title="إدارة مصادر الدورة"
          subtitle="نظّم وأدر مصادر الدورة من ملفات وروابط التواصل"
          extra={
            <div className="flex items-center gap-3">
              {all_resources_links?.data?.message &&
                (!Array.isArray(all_resources_links.data.message) ||
                  all_resources_links.data.message.length === 0) &&
                <Button
                  type="default"
                  size="large"
                  icon={<LinkIcon className="w-5 h-5" />}
                  onClick={() => setOpenAddLinksModal(true)}
                >
                  إضافة روابط
                </Button>
              }
              <Button
                type="primary"
                size="large"
                icon={<Upload className="w-5 h-5" />}
                onClick={() => setOpenAddFileModal(true)}
              >
                إضافة ملف
              </Button>
            </div>
          }
        />

        {/* Links Section */}
        <div className="mb-8">
          <Card
            className="border-none shadow-lg bg-gradient-to-r from-indigo-50 to-purple-50"
            title={
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-2 rounded-lg">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 m-0">مجموعات التواصل</h3>
                    <p className="text-sm text-gray-500 m-0">روابط مجموعات الواتساب والتليجرام للدورة</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {links && Array.isArray(links) && links.length > 0 && links[0] && (
                    <>
                      <Button
                        type="default"
                        size="small"
                        icon={<Edit className="w-4 h-4" />}
                        onClick={() => {
                          if (links[0]) {
                            setSelectedLink(links[0]);
                            setOpenEditLinksModal(true);
                          }
                        }}
                      >
                        تعديل
                      </Button>
                      <Button
                        type="default"
                        danger
                        size="small"
                        icon={<Trash2 className="w-4 h-4" />}
                        onClick={() => {
                          if (links[0]) {
                            setSelectedLink(links[0]);
                            setOpenDeleteLinkModal(true);
                          }
                        }}
                      >
                        حذف
                      </Button>
                    </>
                  )}
                </div>
              </div>
            }
          >
            <Row gutter={[24, 24]}>
              <Col xs={24} md={12}>
                <div className={`p-4 rounded-xl border ${links && Array.isArray(links) && links[0]?.whatsapp_link ? 'border-green-200 bg-green-50/50' : 'border-gray-200 bg-gray-50'}`}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-lg ${links && Array.isArray(links) && links[0]?.whatsapp_link ? 'bg-green-500 text-white' : 'bg-gray-300'}`}>
                      <MessageCircle className="w-5 h-5" />
                    </div>
                    <h4 className="font-semibold text-gray-800 m-0">مجموعة الواتساب</h4>
                    {links && Array.isArray(links) && links[0]?.whatsapp_link && (
                      <Tag color="green" className="ml-2">نشط</Tag>
                    )}
                  </div>
                  {links && Array.isArray(links) && links[0]?.whatsapp_link ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <a
                          href={links[0]?.whatsapp_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm truncate"
                        >
                          {links[0]?.whatsapp_link}
                        </a>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          type="link"
                          size="small"
                          icon={<Copy className="w-3 h-3" />}
                          onClick={() => {
                            navigator.clipboard.writeText(links[0]?.whatsapp_link);
                            message.success('تم نسخ الرابط');
                          }}
                        >
                          نسخ الرابط
                        </Button>
                        <Button
                          type="link"
                          size="small"
                          icon={<Share2 className="w-3 h-3" />}
                          onClick={() => window.open(links[0]?.whatsapp_link, '_blank')}
                        >
                          زيارة المجموعة
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500 text-sm">لم يتم إضافة رابط مجموعة الواتساب</p>
                      <Button
                        type="dashed"
                        size="small"
                        onClick={() => setOpenAddLinksModal(true)}
                      >
                        إضافة رابط
                      </Button>
                    </div>
                  )}
                </div>
              </Col>

              <Col xs={24} md={12}>
                <div className={`p-4 rounded-xl border ${links && Array.isArray(links) && links[0]?.telegram_link ? 'border-blue-200 bg-blue-50/50' : 'border-gray-200 bg-gray-50'}`}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-lg ${links && Array.isArray(links) && links[0]?.telegram_link ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}>
                      <Globe className="w-5 h-5" />
                    </div>
                    <h4 className="font-semibold text-gray-800 m-0">مجموعة التليجرام</h4>
                    {links && Array.isArray(links) && links[0]?.telegram_link && (
                      <Tag color="blue" className="ml-2">نشط</Tag>
                    )}
                  </div>
                  {links && Array.isArray(links) && links[0]?.telegram_link ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <a
                          href={links[0]?.telegram_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm truncate"
                        >
                          {links[0]?.telegram_link}
                        </a>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          type="link"
                          size="small"
                          icon={<Copy className="w-3 h-3" />}
                          onClick={() => {
                            navigator.clipboard.writeText(links[0]?.telegram_link);
                            message.success('تم نسخ الرابط');
                          }}
                        >
                          نسخ الرابط
                        </Button>
                        <Button
                          type="link"
                          size="small"
                          icon={<Share2 className="w-3 h-3" />}
                          onClick={() => window.open(links[0]?.telegram_link, '_blank')}
                        >
                          زيارة المجموعة
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500 text-sm">لم يتم إضافة رابط مجموعة التليجرام</p>
                      <Button
                        type="dashed"
                        size="small"
                        onClick={() => setOpenAddLinksModal(true)}
                      >
                        إضافة رابط
                      </Button>
                    </div>
                  )}
                </div>
              </Col>
            </Row>
          </Card>
        </div>

        {/* Files Section */}
        <Card
          className="border-none shadow-lg"
          title={
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-2 rounded-lg">
                  <Folder className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 m-0">الملفات الإضافية</h3>
                  <p className="text-sm text-gray-500 m-0">إدارة ملفات الدورة التعليمية</p>
                </div>
              </div>
             
            </div>
          }
        >
          {all_resources_loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : resources?.length === 0 ? (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <div className="space-y-4">
                  <p className="text-lg text-gray-600">لا توجد ملفات مضافة للدورة</p>
                  <p className="text-gray-500">ابدأ بإضافة أول ملف للدورة</p>
                </div>
              }
            >
              <Button
                type="primary"
                size="large"
                icon={<Upload className="w-5 h-5" />}
                onClick={() => setOpenAddFileModal(true)}
              >
                إضافة أول ملف
              </Button>
            </Empty>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {resources?.map((file) => {
                  const fileType = getFileType(file.file_path);
                  const isFuture = dayjs(file.show_date).isAfter(dayjs());

                  return (
                    <Card
                      key={file.id}
                      className="group hover:shadow-xl transition-all duration-300 border border-gray-200"
                      cover={
                        <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100">
                          <div className="text-center">
                            <div className="text-4xl mb-2">{fileType.icon}</div>
                            <div className="text-sm text-gray-600">نوع الملف</div>
                            <div className="font-semibold text-gray-800">{fileType.label}</div>
                          </div>
                        </div>
                      }
                    >
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-bold text-lg text-gray-800 line-clamp-1">
                            {file?.title}
                          </h4>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {file?.description || 'لا يوجد وصف'}
                          </p>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-1 text-gray-500">
                              <Calendar className="w-4 h-4" />
                              <span>تاريخ الظهور:</span>
                            </div>
                            <Tag color={isFuture ? 'orange' : 'green'}>
                              {dayjs(file.show_date).format('DD/MM/YYYY')}
                            </Tag>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <div className="flex items-center gap-2">
                            <Tooltip title="معاينة">
                              <Button
                                type="text"
                                size="small"
                                icon={<Eye className="w-4 h-4" />}
                                onClick={() => window.open(file?.url, '_blank')}
                              />
                            </Tooltip>
                            <Tooltip title="تحميل">
                              <Button
                                type="text"
                                size="small"
                                icon={<Download className="w-4 h-4" />}
                                onClick={() => {
                                  const link = document.createElement('a');
                                  link.href = file?.url;
                                  link.download = file?.title;
                                  link.click();
                                }}
                              />
                            </Tooltip>
                          </div>

                          <div className="flex items-center gap-2">
                            <Tooltip title="تعديل">
                              <Button
                                type="text"
                                size="small"
                                icon={<Edit className="w-4 h-4" />}
                                onClick={() => {
                                  setSelectedFile(file);
                                  setOpenEditFileModal(true);
                                }}
                              />
                            </Tooltip>
                            <Tooltip title="حذف">
                              <Button
                                type="text"
                                danger
                                size="small"
                                icon={<Trash2 className="w-4 h-4" />}
                                onClick={() => {
                                  setSelectedFile(file);
                                  setOpenDeleteFileModal(true);
                                }}
                              />
                            </Tooltip>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>

              <div className="flex justify-center">
                <Pagination
                  current={currentPage}
                  pageSize={pageSize}
                  total={resources?.length}
                  onChange={(page, size) => {
                    setCurrentPage(page);
                    setPageSize(size);
                  }}
                  showSizeChanger
                  pageSizeOptions={['10', '20', '50']}
                />
              </div>
            </>
          )}
        </Card>
      </div>

      {/* Add Links Modal */}
      <Modal
        open={openAddLinksModal}
        onCancel={() => setOpenAddLinksModal(false)}
        title={
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-2 rounded-lg">
              <LinkIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800 m-0">إضافة روابط التواصل</h2>
              <p className="text-sm text-gray-500 m-0">أضف روابط مجموعات الواتساب والتليجرام</p>
            </div>
          </div>
        }
        footer={null}
        width={600}
        centered
      >
        <Form
          layout="vertical"
          className="space-y-6"
          onFinish={handleLinksSubmit}
          initialValues={linksData}
        >
          <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl">
            <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-green-500" />
              رابط مجموعة الواتساب
            </h4>
            <Form.Item
              name="whatsapp_link"
              rules={[
                { type: 'url', message: 'يرجى إدخال رابط صحيح' }
              ]}
            >
              <Input
                size="large"
                placeholder="https://chat.whatsapp.com/..."
                prefix={<MessageCircle className="text-gray-400" />}
                className="rounded-lg"
              />
            </Form.Item>
          </div>

          <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl">
            <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-500" />
              رابط مجموعة التليجرام
            </h4>
            <Form.Item
              name="telegram_link"
              rules={[
                { type: 'url', message: 'يرجى إدخال رابط صحيح' }
              ]}
            >
              <Input
                size="large"
                placeholder="https://t.me/..."
                prefix={<Globe className="text-gray-400" />}
                className="rounded-lg"
              />
            </Form.Item>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button onClick={() => setOpenAddLinksModal(false)}>
              إلغاء
            </Button>
            <Button
              disabled={add_resource_link_loading}
              type="primary"
              htmlType="submit"
              loading={add_resource_link_loading}
              className="bg-gradient-to-r from-green-500 to-emerald-600"
            >
              {add_resource_link_loading ? "Loading..." : "إضافة الروابط"}
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Edit Links Modal */}
      <Modal
        open={openEditLinksModal}
        onCancel={() => setOpenEditLinksModal(false)}
        title={
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-2 rounded-lg">
              <LinkIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800 m-0">تعديل روابط التواصل</h2>
              <p className="text-sm text-gray-500 m-0">تعديل روابط مجموعات الواتساب والتليجرام</p>
            </div>
          </div>
        }
        footer={null}
        width={600}
        centered
      >
        <Form
          layout="vertical"
          className="space-y-6"
          onFinish={handleLinksSubmit}
          initialValues={linksData}
        >
          <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl">
            <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-green-500" />
              رابط مجموعة الواتساب
            </h4>
            <Form.Item
              name="whatsapp_link"
              rules={[
                { type: 'url', message: 'يرجى إدخال رابط صحيح' },
                { required: false }
              ]}
            >
              <Input
                size="large"
                placeholder="https://chat.whatsapp.com/..."
                prefix={<MessageCircle className="text-gray-400" />}
                className="rounded-lg"
              />
            </Form.Item>
          </div>

          <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl">
            <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-500" />
              رابط مجموعة التليجرام
            </h4>
            <Form.Item
              name="telegram_link"
              rules={[
                { type: 'url', message: 'يرجى إدخال رابط صحيح' },
                { required: false }
              ]}
            >
              <Input
                size="large"
                placeholder="https://t.me/..."
                prefix={<Globe className="text-gray-400" />}
                className="rounded-lg"
              />
            </Form.Item>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button onClick={() => setOpenEditLinksModal(false)}>
              إلغاء
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              disabled={edit_resource_link_loading}
              loading={edit_resource_link_loading}
              className="bg-gradient-to-r from-blue-500 to-blue-600"
            >
              {edit_resource_link_loading ? "Loading...." : " تحديث الروابط"}
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Add File Modal */}
      <Modal
        open={openAddFileModal}
        onCancel={() => setOpenAddFileModal(false)}
        title={
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-2 rounded-lg">
              <Upload className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800 m-0">إضافة ملف جديد</h2>
              <p className="text-sm text-gray-500 m-0">رفع ملف للدورة</p>
            </div>
          </div>
        }
        footer={null}
        width={600}
        centered
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFileSubmit}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              label="اسم الملف"
              name="name"
              rules={[{ required: true, message: 'يرجى إدخال اسم الملف' }]}
            >
              <Input
                size="large"
                placeholder="أدخل اسم الملف"
                className="rounded-lg"
              />
            </Form.Item>

            <Form.Item
              label="تاريخ الظهور"
              name="show_date"
              rules={[{ required: true, message: 'يرجى اختيار تاريخ الظهور' }]}
            >
              <DatePicker
                size="large"
                className="w-full rounded-lg"
                format="DD/MM/YYYY"
              />
            </Form.Item>
          </div>

          <Form.Item
            label="وصف الملف"
            name="description"
          >
            <TextArea
              rows={3}
              placeholder="أدخل وصفاً للملف"
              className="rounded-lg"
              showCount
              maxLength={500}
            />
          </Form.Item>

          <Form.Item
            label="رفع الملف"
            name="file"
            rules={[{ required: true, message: 'يرجى رفع ملف' }]}
            valuePropName="fileList"
            getValueFromEvent={(e) => {
              if (Array.isArray(e)) return e;
              return e?.fileList;
            }}
          >
            <AntUpload.Dragger
              name="file"
              multiple={false}
              beforeUpload={() => false}
              accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.zip,.rar,.txt"
              className="rounded-lg"
            >
              <div className="p-8">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-700">اسحب الملف هنا أو انقر للاختيار</p>
                <p className="text-sm text-gray-500">يدعم: PDF, Word, Excel, PowerPoint, ZIP</p>
              </div>
            </AntUpload.Dragger>
          </Form.Item>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button onClick={() => setOpenAddFileModal(false)}>
              إلغاء
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              disabled={add_resource_loading}
              loading={add_resource_loading}
              className="bg-gradient-to-r from-blue-500 to-blue-600"
            >
              {add_resource_loading ? "Loading..." : " إضافة الملف"}
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Edit File Modal */}
      <Modal
        open={openEditFileModal}
        onCancel={() => setOpenEditFileModal(false)}
        title={
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-2 rounded-lg">
              <Edit className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800 m-0">تعديل الملف</h2>
              <p className="text-sm text-gray-500 m-0">تعديل معلومات الملف</p>
            </div>
          </div>
        }
        footer={null}
        width={600}
        centered
      >
        <Form
          layout="vertical"
          onFinish={handleFileEdit}
          initialValues={{
            ...selectedFile,
            name: selectedFile?.title,
            description: selectedFile?.description,
            show_date: selectedFile?.show_date ? dayjs(selectedFile.show_date) : null
          }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              label="اسم الملف"
              name="name"
              rules={[{ required: true, message: 'يرجى إدخال اسم الملف' }]}
            >
              <Input
                size="large"
                placeholder="أدخل اسم الملف"
                className="rounded-lg"
              />
            </Form.Item>

            <Form.Item
              label="تاريخ الظهور"
              name="show_date"
              rules={[{ required: true, message: 'يرجى اختيار تاريخ الظهور' }]}
            >
              <DatePicker
                size="large"
                className="w-full rounded-lg"
                format="DD/MM/YYYY"
              />
            </Form.Item>
          </div>

          <Form.Item
            label="وصف الملف"
            name="description"
          >
            <TextArea
              rows={3}
              placeholder="أدخل وصفاً للملف"
              className="rounded-lg"
              showCount
              maxLength={500}
            />
          </Form.Item>

          <Form.Item
            label="رفع ملف جديد (اختياري)"
            name="file"
            valuePropName="fileList"
            getValueFromEvent={(e) => {
              if (Array.isArray(e)) return e;
              return e?.fileList;
            }}
          >
            <AntUpload.Dragger
              name="file"
              multiple={false}
              beforeUpload={() => false}
              accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.zip,.rar,.txt"
              className="rounded-lg"
            >
              <div className="p-8">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-700">اسحب الملف هنا أو انقر للاختيار</p>
                <p className="text-sm text-gray-500">يدعم: PDF, Word, Excel, PowerPoint, ZIP</p>
              </div>
            </AntUpload.Dragger>
          </Form.Item>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button onClick={() => setOpenEditFileModal(false)}>
              إلغاء
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              disabled={edit_resource_loading}
              loading={edit_resource_loading}
              className="bg-gradient-to-r from-blue-500 to-blue-600"
            >
              {edit_resource_loading ? "Loading..." : " تحديث الملف"}
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Delete File Confirmation Modal */}
      <Modal
        open={openDeleteFileModal}
        onCancel={() => setOpenDeleteFileModal(false)}
        title="تأكيد الحذف"
        footer={
          <div className="flex justify-end gap-3">
            <Button onClick={() => setOpenDeleteFileModal(false)}>
              إلغاء
            </Button>
            <Button
              type="primary"
              danger
              onClick={handleFileDelete}
              disabled={delete_resource_loading}
              loading={delete_resource_loading}
            >
              {delete_resource_loading ? "Loading..." : " تأكيد الحذف"}
            </Button>
          </div>
        }
        width={400}
        centered
      >
        <div className="text-center py-4">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-gray-800 mb-2">هل أنت متأكد من حذف الملف؟</h4>
          <p className="text-gray-600">سيتم حذف الملف "{selectedFile?.name}" بشكل دائم ولا يمكن التراجع عن هذا الإجراء.</p>
        </div>
      </Modal>

      {/* Delete Link Confirmation Modal */}
      <Modal
        open={openDeleteLinkModal}
        onCancel={() => setOpenDeleteLinkModal(false)}
        title="تأكيد حذف الروابط"
        footer={
          <div className="flex justify-end gap-3">
            <Button onClick={() => setOpenDeleteLinkModal(false)}>
              إلغاء
            </Button>
            <Button
              type="primary"
              danger
              disabled={delete_resource_link_loading}
              onClick={handleLinkDelete}
              loading={delete_resource_link_loading}
            >
              {delete_resource_link_loading ? "Loading..." : " تأكيد الحذف"}
            </Button>
          </div>
        }
        width={400}
        centered
      >
        <div className="text-center py-4">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-gray-800 mb-2">هل أنت متأكد من حذف الروابط؟</h4>
          <p className="text-gray-600">سيتم حذف جميع روابط التواصل للدورة.</p>
        </div>
      </Modal>
    </PageLayout>
  );
}