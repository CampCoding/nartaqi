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

export default function ResourceContent({round_id}) {
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
    if (roundId || round_id) {
      dispatch(handleGetAllRoundResources({ body: { round_id: roundId || round_id } }));
      dispatch(handleGetAllRoundResourcesLinks({ body: { round_id: roundId || round_id } }));
    }
  }, [roundId , round_id, dispatch]);

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
  const resources = all_resources_list?.data?.message?.resource || [];
  const links = all_resources_links?.data?.message || [];

  return (
    <PageLayout>
      <div dir="rtl">
        <BreadcrumbsShowcase items={breadcrumbs} variant="pill" />
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

  
    </PageLayout>
  );
}