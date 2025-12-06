import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../shared/api";
import { apiRoutes } from "../shared/routes";

const initialState = {
  all_lives_list : [],
  all_lives_loading : false,

  store_live_loading : false,
  edit_live_loading : false,
  delete_live_loading : false,
  active_live_loading:false,
  mark_live_finish_loading : false,
}

export const handleGetAllLives  = createAsyncThunk("livesSlice/handleGetAllLives",async({body}) =>{
  const response  = await api.post(apiRoutes.get_lives , {body});
  return response
})

export const handleStoreLive  = createAsyncThunk("livesSlice/handleStoreLive",async({body}) => {
  const response = await api.post(apiRoutes.store_live ,{body});
  return response;
})

export const handleEditLive  = createAsyncThunk("livesSlice/handleEditLive",async({body}) => {
  const response = await api.post(apiRoutes.edit_live ,{body});
  return response;
})

export const handleDeleteLive  = createAsyncThunk("livesSlice/handleDeleteLive",async({body}) => {
  const response = await api.post(apiRoutes.delete_live ,{body});
  return response;
})

export const handleActiveLive  = createAsyncThunk("livesSlice/handleActiveLive",async({body}) => {
  const response = await api.post(apiRoutes.active_live ,{body});
  return response;
})

export const handleMarkLiveAsFinish  = createAsyncThunk("livesSlice/handleMarkLiveAsFinish",async({body}) => {
  const response = await api.post(apiRoutes.mark_live ,{body});
  return response;
})


export const livesSlice = createSlice({
  name:"livesSlice",
  initialState,
  extraReducers:(builder) => {
    builder
    .addCase(handleGetAllLives.pending , (state) => {
      state.all_lives_loading = true;
    })
    .addCase(handleGetAllLives.fulfilled ,(state , action) => {
       state.all_lives_loading = false;
       state.all_lives_list = action.payload;
    })
    .addCase(handleGetAllLives.rejected ,(state) => {
      state.all_lives_loading = false
    })

    .addCase(handleStoreLive.pending , (state) => {
      state.store_live_loading = true;
    })
    .addCase(handleStoreLive.fulfilled ,(state , action) => {
       state.store_live_loading = false;
    })
    .addCase(handleStoreLive.rejected ,(state) => {
      state.store_live_loading = false
    })

    .addCase(handleEditLive.pending , (state) => {
      state.edit_live_loading = true;
    })
    .addCase(handleEditLive.fulfilled ,(state , action) => {
       state.edit_live_loading = false;
    })
    .addCase(handleEditLive.rejected ,(state) => {
      state.edit_live_loading = false
    })

    .addCase(handleActiveLive.pending , (state) => {
      state.active_live_loading = true;
    })
    .addCase(handleActiveLive.fulfilled ,(state , action) => {
       state.active_live_loading = false;
    })
    .addCase(handleActiveLive.rejected ,(state) => {
      state.active_live_loading = false
    })

    .addCase(handleMarkLiveAsFinish.pending , (state) => {
      state.mark_live_finish_loading = true;
    })
    .addCase(handleMarkLiveAsFinish.fulfilled ,(state , action) => {
       state.mark_live_finish_loading = false;
    })
    .addCase(handleMarkLiveAsFinish.rejected ,(state) => {
      state.mark_live_finish_loading = false
    })

     .addCase(handleDeleteLive.pending , (state) => {
      state.delete_live_loading = true;
    })
    .addCase(handleDeleteLive.fulfilled ,(state , action) => {
       state.delete_live_loading = false;
    })
    .addCase(handleDeleteLive.rejected ,(state) => {
      state.delete_live_loading = false
    })
  }
})

export default livesSlice.reducer;