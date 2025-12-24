import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../shared/api";

const initialState = {
  all_content_list : [],
  all_content_loading : false,

  store_content_loading : false,
  edit_content_loading:  false,
  delete_content_loading : false,

  get_free_videos:[],
  get_free_video_loading : false,
};

export const handleGetAllContentFreeVideos = createAsyncThunk("roundContentSlice/handleGetAllContentFreeVideos",async({body}) => {
  const response = await api.post("admin/rounds/getRoundFreeVideos",{body});
  return response;
})

export const handleGetAllRoundContent = createAsyncThunk("roundContentSlice/handleGetAllRoundContent",async({body}) => {
  const response = await api.post(`admin/rounds-contents/get_all_round_contents`,{body});
  return response;
})

export const handleAddRoundContent = createAsyncThunk("roundContentSlice/handleAddRoundContent",async({body}) => {
  const response = await api.post(`admin/rounds-contents/store_round_content`,{body});
  return response;
})

export const handleEditRoundContent = createAsyncThunk("roundContentSlice/handleEditRoundContent",async({body}) => {
  const response = await api.post(`admin/rounds-contents/edit_round_content`,{body});
  return response;
})

export const handleDeleteContent = createAsyncThunk("roundContentSlice/handleDeleteContent",async({body}) => {
  const  response = await api.post("admin/rounds-contents/delete_round_content", {body});
  return response;
})

export const roundContentSlice = createSlice({
  name:"roundContentSlice",
  initialState,
  extraReducers :(builder) => {
    builder
    .addCase(handleGetAllRoundContent.pending ,(state) =>{ 
      state.all_content_loading = true;
    })
    .addCase(handleGetAllRoundContent.fulfilled ,(state , action) => {
      state.all_content_loading = false;
      state.all_content_list = action.payload;
    })
    .addCase(handleGetAllRoundContent.rejected , (state) => {
      state.all_content_loading = false;
    })

    .addCase(handleAddRoundContent.pending ,(state) =>{ 
      state.store_content_loading = true;
    })
    .addCase(handleAddRoundContent.fulfilled ,(state , action) => {
      state.store_content_loading = false;
    })
    .addCase(handleAddRoundContent.rejected , (state) => {
      state.store_content_loading = false;
    })

     .addCase(handleEditRoundContent.pending ,(state) =>{ 
      state.edit_content_loading = true;
    })
    .addCase(handleEditRoundContent.fulfilled ,(state , action) => {
      state.edit_content_loading = false;
    })
    .addCase(handleEditRoundContent.rejected , (state) => {
      state.edit_content_loading = false;
    })

     .addCase(handleDeleteContent.pending ,(state) =>{ 
      state.delete_content_loading = true;
    })
    .addCase(handleDeleteContent.fulfilled ,(state , action) => {
      state.delete_content_loading = false;
    })
    .addCase(handleDeleteContent.rejected , (state) => {
      state.delete_content_loading = false;
    })

     .addCase(handleGetAllContentFreeVideos.pending ,(state) =>{ 
      state.get_free_video_loading = true;
    })
    .addCase(handleGetAllContentFreeVideos.fulfilled ,(state , action) => {
      state.get_free_video_loading = false;
      state.get_free_videos = action.payload;
    })
    .addCase(handleGetAllContentFreeVideos.rejected , (state) => {
      state.get_free_video_loading = false;
    })
  }
})

export default roundContentSlice.reducer;