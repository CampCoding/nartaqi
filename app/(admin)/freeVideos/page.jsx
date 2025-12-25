"use client";
import React, { useEffect, useMemo, useState } from 'react'
import Button from "@/components/atoms/Button";
import PageLayout from "@/components/layout/PageLayout";
import BreadcrumbsShowcase from "@/components/ui/BreadCrumbs";
import PagesHeader from "@/components/ui/PagesHeader";
import { 
  Plus, 
  Search, 
  Filter, 
  PlayCircle, 
  Clock, 
  Eye, 
  Edit, 
  Trash2, 
  ExternalLink,
  Calendar,
  Video,
  Download,
  Users,
  BarChart3,
  CheckCircle,
  XCircle,
  MoreVertical,
  Grid,
  List,
  Link,
  Share2,
  Copy,
  Flag,
  Youtube,
  Hash
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { handleGetAllFreeVideos } from '../../../lib/features/freeVideoSlice';
import AddFreeVideoModal from '../../../components/FreeVideos/AddFreeVideoModal';
import EditFreeVideoModal from '../../../components/FreeVideos/EditFreeVideoModal';
import DeleteFreeVideoModal from '../../../components/FreeVideos/DeleteFreeVideoModal';
import { 
  Empty, 
  Pagination, 
  Input, 
  Select, 
  Tag, 
  Card, 
  Row, 
  Col,
  Dropdown,
  Menu,
  Tooltip,
  Statistic,
  Progress,
  Badge,
  Space,
  Avatar
} from 'antd';
import dayjs from 'dayjs';
import { useSearchParams } from 'next/navigation';

const { Search: AntSearch } = Input;

const breadcrumbs = [
  {
    label: "الرئيسية",
    href: "/",
  },
  {
    label: "الفيديوهات المجانية",
    current: true,
    href: "#"
  }
];

export default function Page() {
  const dispatch = useDispatch();
  const { videos_data_loading, videos_data } = useSelector(state => state?.free_videos);
  const searchParams =useSearchParams();
  const categoryId = searchParams.get("categoryId");

  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [rowData, setRowData] = useState({});

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    dispatch(handleGetAllFreeVideos({ page, per_page: perPage , body : {
      course_category_id : categoryId
    }}))
  }, [dispatch, page, perPage , categoryId]);

  useEffect(() => {
    if (videos_data?.data?.message) {
      setPage(videos_data.data.message.current_page || 1);
      setPerPage(videos_data.data.message.per_page || 10);
    }
  }, [videos_data]);

  const videos = useMemo(() => {
    return videos_data?.data?.message?.data || [];
  }, [videos_data]);

  // Filter and sort videos
  const filteredVideos = useMemo(() => {
    let filtered = [...videos];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(video =>
        video.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        video.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return b.id - a.id;
        case 'oldest':
          return a.id - b.id;
        case 'title':
          return (a.title || '').localeCompare(b.title || '');
        case 'duration':
          return (parseInt(b.time) || 0) - (parseInt(a.time) || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [videos, searchTerm, sortBy]);

  // Statistics
  const stats = useMemo(() => {
    const totalVideos = videos.length;
    const totalDuration = videos.reduce((sum, video) => sum + (parseInt(video.time) || 0), 0);
    const avgDuration = totalVideos > 0 ? Math.round(totalDuration / totalVideos) : 0;
    const hasVimeo = videos.filter(v => v.vimeo_link).length;
    const hasYouTube = videos.filter(v => v.youtube_link).length;

    return {
      totalVideos,
      totalDuration: `${Math.floor(totalDuration / 60)} ساعة ${totalDuration % 60} دقيقة`,
      avgDuration: `${avgDuration} دقيقة`,
      vimeoCount: hasVimeo,
      youtubeCount: hasYouTube,
      lastAdded: videos.length > 0 
        ? dayjs().diff(dayjs(videos[0].created_at), 'days')
        : 0
    };
  }, [videos]);

  const handleEdit = (video) => {
    setRowData(video);
    setOpenEditModal(true);
  };

  const handleDelete = (video) => {
    console.log(video)
    setRowData(video);
    setOpenDeleteModal(true);
  };

  const handlePageChange = (newPage, newPageSize) => {
    setPage(newPage);
    setPerPage(newPageSize);
  };

  const getVideoThumbnail = (video) => {
    if (video.image_url && video.image_url !== "0") {
      return video.image_url;
    }
    if (video?.vimeo_link) {
      const vimeoId = video?.vimeo_link.match(/\/(\d+)$/);
      if (vimeoId) return `https://vumbnail.com/${vimeoId[1]}.jpg`;
    }
    return 'https://via.placeholder.com/400x225/3b82f6/ffffff?text=Video+Thumbnail';
  };

  const formatDuration = (seconds) => {
    if (!seconds) return 'غير محدد';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

const VideoCard = ({ video }) => (
  <div className="group relative bg-gradient-to-br from-white to-gray-50 rounded-3xl border border-gray-100 overflow-hidden hover:shadow-2xl hover:shadow-blue-100/50 hover:border-blue-100 transition-all duration-500 h-full flex flex-col hover:-translate-y-1">
    {/* Floating decorative elements */}
    <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-blue-100/30 to-purple-100/30 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
    <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-br from-green-100/20 to-emerald-100/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
    
    {/* Top accent with corner decoration */}
    <div className="absolute top-0 left-0 w-0 h-0 border-t-[40px] border-t-blue-500 border-r-[40px] border-r-transparent"></div>
    
    {/* Video thumbnail with layered effects */}
    <div className="relative overflow-hidden rounded-t-3xl">
      <div className="relative h-56 overflow-hidden">
        {/* Main image with gradient overlay */}
        <img
          alt={video.title}
          src={video?.image_url || 'https://via.placeholder.com/400x225/3b82f6/ffffff?text=Video+Thumbnail'}
          className="h-full w-full object-cover transform group-hover:scale-110 transition-transform duration-700"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x225/3b82f6/ffffff?text=Video+Thumbnail';
          }}
        />
        
        {/* Layered gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        
        {/* Play button with glowing effect */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-60 animate-pulse"></div>
            <div className="relative bg-white rounded-full p-1 shadow-2xl">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-full p-3 transform group-hover:scale-105 transition-transform duration-300">
                <PlayCircle className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Top-right badges */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
          <div className="flex gap-2">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm">
              <span className="flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                مجاني
              </span>
            </div>
          </div>
          
          <div className="flex gap-2">
            <div className="bg-black/60 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-medium shadow-lg">
              <span className="flex items-center gap-1">
                <Hash className="w-3 h-3" />
                {video.id}
              </span>
            </div>
          </div>
        </div>
        
        {/* Bottom overlay with duration and platform */}
        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
          <div className="flex gap-2">
            {video?.time && (
              <div className="bg-black/70 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm font-medium shadow-lg">
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {video.time}
                </span>
              </div>
            )}
          </div>
          
          {/* {video.vimeo_link || video.youtube_link ? (
            <div className={`px-4 py-2 rounded-full backdrop-blur-sm text-white text-sm font-medium shadow-lg ${video.vimeo_link ? 'bg-gradient-to-r from-blue-500 to-blue-600' : 'bg-gradient-to-r from-red-500 to-red-600'}`}>
              <span className="flex items-center gap-2">
                {video.vimeo_link ? (
                  <Video className="w-4 h-4" />
                ) : (
                  <Youtube className="w-4 h-4" />
                )}
                {video.vimeo_link  ? 'Vimeo' : 'YouTube'}
              </span>
            </div>
          ) : null} */}
        </div>
      </div>
    </div>
    
    {/* Content area with subtle padding */}
    <div className="p-6 flex-1 flex flex-col bg-gradient-to-b from-white to-gray-50">
      {/* Title with subtle underline effect */}
      <div className="mb-4 relative">
        <h3 className="font-bold text-xl text-gray-900 line-clamp-1 mb-3 group-hover:text-blue-700 transition-colors">
          {video.title}
        </h3>
        <div className="w-16 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      
      {/* Description with fade effect */}
      <div className="mb-6 flex-1 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
          {video.description || 'لا يوجد وصف لهذا الفيديو'}
        </p>
      </div>
      
      {/* Links section with collapsible design */}
      <div className="mb-6 space-y-2">
        {video?.vimeo_link && (
          <div className="group/link relative overflow-hidden rounded-xl border border-gray-200 bg-gray-50/50 hover:bg-blue-50/50 hover:border-blue-200 transition-all duration-300">
            <div className="p-3 flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-2 rounded-lg">
                  <Video className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700">رابط Vimeo</span>
              </div>
              <Link className="w-4 h-4 text-gray-400 group-hover/link:text-blue-500 transition-colors" />
            </div>
            <a 
              href={video.vimeo_link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="block p-3 pt-0 text-xs text-gray-500 hover:text-blue-600 truncate"
            >
              {video.vimeo_link}
            </a>
          </div>
        )}
        
        {video?.youtube_link && (
          <div className="group/link relative overflow-hidden rounded-xl border border-gray-200 bg-gray-50/50 hover:bg-red-50/50 hover:border-red-200 transition-all duration-300">
            <div className="p-3 flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-r from-red-500 to-red-600 p-2 rounded-lg">
                  <Youtube className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700">رابط YouTube</span>
              </div>
              <Link className="w-4 h-4 text-gray-400 group-hover/link:text-red-500 transition-colors" />
            </div>
            <a 
              href={video.youtube_link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="block p-3 pt-0 text-xs text-gray-500 hover:text-red-600 truncate"
            >
              {video.youtube_link}
            </a>
          </div>
        )}
      </div>
      
      {/* Action buttons with hover effects */}
      <div className="pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleEdit(video)}
            className="group/edit flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-gray-200 text-gray-700 hover:border-green-200 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 hover:text-green-700 transition-all duration-300"
          >
            <div className="p-1.5 bg-gradient-to-r from-green-100 to-green-50 rounded-lg group-hover/edit:from-green-200 group-hover/edit:to-green-100 transition-all">
              <Edit className="w-4 h-4 text-green-600" />
            </div>
            <span className="font-medium">تعديل</span>
          </button>
          
          <button
            onClick={() => handleDelete(video)}
            className="group/delete flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-gray-200 text-gray-700 hover:border-red-200 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 hover:text-red-700 transition-all duration-300"
          >
            <div className="p-1.5 bg-gradient-to-r from-red-100 to-red-50 rounded-lg group-hover/delete:from-red-200 group-hover/delete:to-red-100 transition-all">
              <Trash2 className="w-4 h-4 text-red-600" />
            </div>
            <span className="font-medium">حذف</span>
          </button>
       
        </div>
      </div>
    </div>
  </div>
);


  const VideoListItem = ({ video }) => (
    <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-lg transition-shadow duration-300 mb-3">
      <div className="flex items-start gap-4">
        {/* Thumbnail */}
        <div className="relative flex-shrink-0">
          <img
            alt={video.title}
            src={getVideoThumbnail(video)}
            className="w-40 h-24 rounded-lg object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg" />
          <div className="absolute bottom-2 right-2">
            <div className="bg-black/70 text-white text-xs px-2 py-1 rounded-full">
              {formatDuration(video.time)}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-bold text-lg text-gray-800 mb-1">
                {video.title}
              </h3>
              <p className="text-sm text-gray-600 mb-2 line-clamp-1">
                {video.description}
              </p>
            </div>
            <Tag color="green" className="ml-2">مجاني</Tag>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
            <div className="flex items-center gap-1">
              <Video className="w-4 h-4" />
              <span>ID: {video.id}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{formatDuration(video.time)}</span>
            </div>
            <div className="flex items-center gap-2">
              {video.vimeo_link && (
                <Tag color="blue" size="small">Vimeo</Tag>
              )}
              {video.youtube_link && (
                <Tag color="red" size="small">YouTube</Tag>
              )}
            </div>
          </div>

          {/* Progress bar for views (example) */}
          <div className="mb-3">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>التفاعل</span>
              <span>{video.views || 0} مشاهدة</span>
            </div>
            <Progress percent={Math.min((video.views || 0) * 2, 100)} size="small" showInfo={false} />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
           
            <Button
              type="default"
              size="small"
              icon={<Edit className="w-4 h-4" />}
              onClick={() => handleEdit(video)}
            >
              تعديل
            </Button>
            <Button
              type="default"
              size="small"
              danger
              icon={<Trash2 className="w-4 h-4" />}
              onClick={() => handleDelete(video)}
            >
              حذف
            </Button>
            <Dropdown
              overlay={
                <Menu>
                  <Menu.Item key="stats" icon={<BarChart3 className="w-4 h-4" />}>
                    إحصائيات
                  </Menu.Item>
                  <Menu.Item key="share" icon={<ExternalLink className="w-4 h-4" />}>
                    مشاركة
                  </Menu.Item>
                </Menu>
              }
            >
              <Button type="text" size="small" icon={<MoreVertical className="w-4 h-4" />} />
            </Dropdown>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <PageLayout style={{ dir: "rtl" }}>
      <BreadcrumbsShowcase variant="pill" items={breadcrumbs} />

      <PagesHeader
        title="إدارة الشروحات المجانية"
        subtitle="نظّم وأدر الشروحات المجانية لتعزيز تجربة التعلم"
        extra={
          <div className="flex items-center gap-3">
            <Button
              onClick={() => setOpenAddModal(true)}
              type="primary"
              size="large"
              icon={<Plus className="w-5 h-5" />}
            >
              إضافة فيديو جديد
            </Button>
          </div>
        }
      />


      {/* Videos Content */}
      {videos_data_loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : filteredVideos.length > 0 ? (
        <>

          {/* Videos Grid/List */}
          {viewMode === 'grid' ? (
            <Row gutter={[16, 16]} className="mb-8">
              {filteredVideos.map((video) => (
                <Col key={video.id} xs={24} sm={12} md={8}>
                  <VideoCard video={video} />
                </Col>
              ))}
            </Row>
          ) : (
            <div className="mb-8">
              {filteredVideos.map((video) => (
                <VideoListItem key={video.id} video={video} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {videos_data?.data?.message?.total > perPage && (
            <div className="flex justify-center mt-8">
              <Pagination
                current={page}
                pageSize={perPage}
                total={videos_data.data.message.total}
                onChange={handlePageChange}
                // showSizeChanger
                // onShowSizeChange={(current, size) => {
                //   setPage(1);
                //   setPerPage(size);
                // }}
                // pageSizeOptions={['10', '20', '50', '100']}
                // showTotal={(total, range) => 
                //   `عرض ${range[0]}-${range[1]} من ${total} فيديو`
                // }
                // locale={{ items_per_page: 'لكل صفحة' }}
              />
            </div>
          )}
        </>
      ) : (
        <div className="py-16">
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              searchTerm ? (
                <div className="space-y-4">
                  <p className="text-lg text-gray-600">
                    لا توجد نتائج لـ "<span className="text-blue-600 font-semibold">{searchTerm}</span>"
                  </p>
                  <p className="text-gray-500">جرب مصطلحات بحث أخرى</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-lg text-gray-600">لا توجد فيديوهات مجانية حالياً</p>
                  <p className="text-gray-500">ابدأ بإضافة أول فيديو مجاني للمستخدمين</p>
                </div>
              )
            }
          >
            {!searchTerm && (
              <Button
                type="primary"
                size="large"
                icon={<Plus className="w-5 h-5" />}
                onClick={() => setOpenAddModal(true)}
              >
                إضافة أول فيديو
              </Button>
            )}
          </Empty>
        </div>
      )}

      {/* Modals */}
      <AddFreeVideoModal categoryId={categoryId} page={page} per_page={perPage} open={openAddModal} setOpen={setOpenAddModal} />
      <EditFreeVideoModal categoryId={categoryId} page={page} per_page={perPage} open={openEditModal} setOpen={setOpenEditModal} rowData={rowData} setRowData={setRowData} />
      <DeleteFreeVideoModal categoryId={categoryId} page={page} per_page={perPage}  open={openDeleteModal} setOpen={setOpenDeleteModal} rowData={rowData} />
    </PageLayout>
  );
}