import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../shared/api";
import { apiRoutes } from "../shared/routes";

const initialState = {
  all_videos_list : [],
  all_videos_loading : false,

  add_video_loading : false,
  edit_video_laoding : false,
  delete_video_loading : false,
}

export const handleGetAllLessonVideo = createAsyncThunk("videoSlice/handleGetAllLessonVideo",async({body}) => {
  const response = await api.post(apiRoutes.get_videos , {body});
  return response;
})


export const handleAddLessonVideo = createAsyncThunk("videoSlice/handleAddLessonVideo",async({body}) => {
  const response = await api.post(apiRoutes.add_video , {body});
  return response;
})

export const handleEditLessonVideo = createAsyncThunk("videoSlice/handleEditLessonVideo",async({body}) => {
  const response = await api.post(apiRoutes.edit_video , {body});
  return response;
})

export const handleDeleteLessonVideo = createAsyncThunk("videoSlice/handleDeleteLessonVideo",async({body}) => {
  const response = await api.post(apiRoutes.delete_video , {body});
  return response;
})

export const videoSlice = createSlice({
  name:"videoSlice",
  initialState,
  extraReducers : (builder) => {
    builder
    .addCase(handleGetAllLessonVideo.pending,(state) => {
      state.all_videos_loading = true;
    })
    .addCase(handleGetAllLessonVideo.fulfilled ,(state,action) => {
      state.all_videos_loading = false;
      state.all_videos_list = action.payload;
    })
    .addCase(handleGetAllLessonVideo.rejected ,(state) => {
      state.all_videos_loading = false;
    })

    .addCase(handleAddLessonVideo.pending,(state) => {
      state.add_video_loading = true;
    })
    .addCase(handleAddLessonVideo.fulfilled ,(state,action) => {
      state.add_video_loading = false;
    })
    .addCase(handleAddLessonVideo.rejected ,(state) => {
      state.add_video_loading = false;
    })

    .addCase(handleEditLessonVideo.pending,(state) => {
      state.edit_video_laoding = true;
    })
    .addCase(handleEditLessonVideo.fulfilled ,(state,action) => {
      state.edit_video_laoding = false;
    })
    .addCase(handleEditLessonVideo.rejected ,(state) => {
      state.edit_video_laoding = false;
    })

     .addCase(handleDeleteLessonVideo.pending,(state) => {
      state.delete_video_loading = true;
    })
    .addCase(handleDeleteLessonVideo.fulfilled ,(state,action) => {
      state.delete_video_loading = false;
    })
    .addCase(handleDeleteLessonVideo.rejected ,(state) => {
      state.delete_video_loading = false;
    })
  }
})

export default videoSlice.reducer;