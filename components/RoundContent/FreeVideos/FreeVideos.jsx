"use client";
import { useParams, useSearchParams } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { handleGetAllContentFreeVideos } from '../../../lib/features/roundContentSlice';
import { PlayCircleIcon, Plus } from 'lucide-react';
import AddContentVideoModal from './AddContentFreeVideo';
import { Spin } from 'antd';
import EditContentVideoModal from './EditContentFreeVideo';
import DeleteVideoModal from '../Videos/DeleteVideoModal';


export default function FreeVideos() {
  const dispatch = useDispatch();
  const { get_free_video_loading, get_free_videos } = useSelector(state => state?.content);
  const searchParams = useSearchParams();
  const {id} = useParams();
  const round_id = searchParams.get("id");

  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal , setOpenEditModal] =useState(false);
  const [deleteModal , setDeleteModal] = useState(false);
  const [rowData , setRowData] = useState({});

  useEffect(() => {
    dispatch(handleGetAllContentFreeVideos({
      body: {
        round_id : round_id || id
      }
    }))
  }, [round_id , id])

  const videos = useMemo(() => {
    return get_free_videos?.data?.message
  }, [get_free_videos])


  useEffect(() =>{
    console.log('get_free_videos', get_free_videos, "videos", videos)
  },[get_free_videos , videos])

  if (get_free_video_loading) {
    return (
      <div className='flex justify-center items-center'>
        <Spin size="large" spinning />
      </div>
    )
  }

  return (
    <div>
      <div className="max-w-6xl mx-auto gap-8">
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              هيكل الشروحات المجانية
            </h2>
            <button
              onClick={() => setOpenAddModal(true)}
              className="flex items-center px-4 py-2 text-white bg-green-600 rounded-lg shadow-md hover:bg-green-700 transition duration-150"
            >
              <Plus className="ml-2" /> إضافة
            </button>
          </div>


        </div>
      </div>

      {videos && videos?.length > 0 ? videos?.map(video => <div
        key={video?.id}
        className="bg-blue-50/70 p-4 mb-3 rounded-lg border border-blue-100 flex justify-between items-start">
        <div className="flex items-start flex-1 min-w-0">
          <PlayCircleIcon className="text-blue-600 text-lg mt-1 ml-3 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="font-medium text-gray-800 truncate">
                {video?.title}
              </p>
              {video?.free == "1" && (
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                  مجاني
                </span>
              )}

            </div>
            {video?.description && <p className="text-gray-600 text-sm mt-1">{video?.description}</p>}
            {video?.youtube_link && <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
              <span>لينك (Youtube)</span>
              {video?.youtube_link && (
                <a
                  href={video?.youtube_link}
                  target="_blank"
                  rel="noreferrer"
                  className="truncate max-w-xs text-blue-600 hover:text-blue-700"
                >
                  {video?.youtube_link}
                </a>
              )}
            </div>}

            {video?.vimeo_link && <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
              <span>لينك (Vimeo)</span>
              {video?.vimeo_link && (
                <a
                  href={video?.vimeo_link}
                  target="_blank"
                  rel="noreferrer"
                  className="truncate max-w-xs text-blue-600 hover:text-blue-700"
                >
                  {video?.vimeo_link}
                </a>
              )}
            </div>}
          </div>
        </div>
        <div className="flex space-x-2 space-x-reverse ml-4 flex-shrink-0">
          <button
            className="bg-blue-500 text-white p-2 rounded-md"
          // title="تعديل الفيديو"
          // icon={<EditOutlined className="text-blue-600" />}
           onClick={(e) => {
            setOpenEditModal(true)
            setRowData(video)
           }}
          >
            تعديل الفيديو
          </button>
          <button
            // title="حذف الفيديو"
            className="bg-red-500 text-white p-2 rounded-md"
            // icon={<DeleteOutlined className="text-red-600" />}
            onClick={(e) => {
              e.stopPropagation();
              setDeleteModal(true);
              setRowData(video);
            }}
          >
            حذف الفيديو
          </button>
        </div>
      </div>):  <p className="text-gray-400 text-center py-3 text-2xl">
                  لا توجد فيديوهات  بعد.
                </p>}

      <AddContentVideoModal id={round_id || id} open={openAddModal} setOpen={setOpenAddModal} />
      <EditContentVideoModal id={round_id || id} open={openEditModal} rowData={rowData} setRowData={setRowData} setOpen={setOpenEditModal}/>
      <DeleteVideoModal  open={deleteModal} setOpen={setDeleteModal} round_id={round_id || id} rowData={rowData} />
    </div>
  )
}
