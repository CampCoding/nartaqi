import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiRoutes } from "../shared/routes";
import { api } from "../shared/api";

const initialState = {
  videos_data_loading : false,
  videos_data:[],

  create_video:false,
  edit_video:false,
  delete_video:false
}

export const handleGetAllFreeVideos = createAsyncThunk("freeVideoSlice/handleGetAllFreeVideos",async({page, per_page , body}) =>{
  const response = await api.post(`admin/categories/free_videos/get_all_free_videos?page=${page}&per_page=${per_page}` , {body});
  return response;
})

export const handleCreateFreeVideos = createAsyncThunk("freeVideoSlice/handleCreateFreeVideos",async({body}) =>{
  const response = await api.post("admin/categories/free_videos/add_free_video" ,{body , isFile:true});
  return response;
})


export const handleEditFreeVideos = createAsyncThunk("freeVideoSlice/handleEditFreeVideos",async({body}) =>{
  const response = await api.post("admin/categories/free_videos/edit_free_video" ,{body , isFile:true});
  return response;
})


export const handleDeleteFreeVideos = createAsyncThunk("freeVideoSlice/handleDeleteFreeVideos",async({body}) =>{
  const response = await api.post("admin/categories/free_videos/delete_free_video" ,{body});
  return response;
})



export const freeVideoSlice = createSlice({
  name:"freeVideoSlice",
  initialState,
  extraReducers:(builder) => {
    builder
    .addCase(handleGetAllFreeVideos.pending , (state) => {
      state.videos_data_loading = true;
    })
    .addCase(handleGetAllFreeVideos.fulfilled ,(state , action) => {
      state.videos_data_loading = false;
      state.videos_data = action.payload
    })
    .addCase(handleGetAllFreeVideos.rejected ,(state) => {
      state.videos_data_loading = false
    })

    .addCase(handleCreateFreeVideos.pending , (state) => {
      state.create_video = true;
    })
    .addCase(handleCreateFreeVideos.fulfilled ,(state , action) => {
      state.create_video = false;
      state.videos_data = action.payload
    })
    .addCase(handleCreateFreeVideos.rejected ,(state) => {
      state.create_video = false
    })

    .addCase(handleEditFreeVideos.pending , (state) => {
      state.edit_video = true;
    })
    .addCase(handleEditFreeVideos.fulfilled ,(state , action) => {
      state.edit_video = false;
    })
    .addCase(handleEditFreeVideos.rejected ,(state) => {
      state.edit_video = false
    })

    .addCase(handleDeleteFreeVideos.pending , (state) => {
      state.delete_video = true;
    })
    .addCase(handleDeleteFreeVideos.fulfilled ,(state , action) => {
      state.delete_video = false;
    })
    .addCase(handleDeleteFreeVideos.rejected ,(state) => {
      state.delete_video = false
    })
  }
})

export default freeVideoSlice.reducer;