import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../shared/api";

const initialState = {
  general_rating_loading : false,
  general_rating_list : [],

  add_rating_loading : false,
  edit_rating_loading : false,
  delete_rating_loading : false,

  get_rating_answers_loading : false,
  get_rating_answers_list : [],

  add_rating_answers_loading : false,
  edit_rating_answers_loading : false,
  delete_rating_answers_loading : false,
}

export const handleGetAllGeneralRatings  = createAsyncThunk("ratingSlice/handleGetAllGeneralRatings",async({page , per_page}) => {
  const response = await api.get(`admin/general-ratings/index?page=${page}&per_page=${per_page}`);
  return response ;
})

export const handleAddRating = createAsyncThunk("ratingSlice/handleAddRating",async({body}) => {
  const response=await api.post("admin/general-ratings/store", {body}); 
  return response
})

export const handleEditRating = createAsyncThunk("ratingSlice/handleEditRating",async({body}) => {
  const response=await api.post("admin/general-ratings/update", {body}); 
  return response
})

export const handleDeleteRating = createAsyncThunk("ratingSlice/handleDeleteRating",async({body}) => {
  const response=await api.post("admin/general-ratings/delete", {body}); 
  return response
})

export const handleGetAllRatingAnswers = createAsyncThunk('ratingSlice/handleGetAllRatingAnswers',async({body}) => {
  const response = await api.post(`admin/general-answers-ratings/index`, {body});
  return response;
})

export const handleAddRatingAnswers = createAsyncThunk("ratingSlice/handleAddRatingAnswers", async({body}) =>{
  const response = await api.post("admin/general-answers-ratings/store",{body});
  return response;
})

export const handleEditRatingAnswers = createAsyncThunk("ratingSlice/handleEditRatingAnswers", async({body}) =>{
  const response = await api.post("admin/general-answers-ratings/update",{body});
  return response;
})

export const handleDeleteRatingAnswers = createAsyncThunk("ratingSlice/handleDeleteRatingAnswers", async({body}) =>{
  const response = await api.post("admin/general-answers-ratings/delete",{body});
  return response;
})

export const ratingSlice = createSlice({
  name :"ratingSlice",
  initialState,
  extraReducers : (builder) => {
    builder
    .addCase(handleGetAllGeneralRatings.pending , (state) => {
      state.general_rating_loading = true;
    })
    .addCase(handleGetAllGeneralRatings.fulfilled , (state, action) => {
      state.general_rating_loading = false;
      state.general_rating_list = action.payload
    })
    .addCase(handleGetAllGeneralRatings.rejected ,(state) => {
      state.general_rating_loading = false;
    })

    .addCase(handleAddRating.pending , (state) => {
      state.add_rating_loading = true;
    })
    .addCase(handleAddRating.fulfilled , (state, action) => {
      state.add_rating_loading = false;
    })
    .addCase(handleAddRating.rejected ,(state) => {
      state.add_rating_loading = false;
    })

    .addCase(handleEditRating.pending , (state) => {
      state.edit_rating_loading = true;
    })
    .addCase(handleEditRating.fulfilled , (state, action) => {
      state.edit_rating_loading = false;
    })
    .addCase(handleEditRating.rejected ,(state) => {
      state.edit_rating_loading = false;
    })

    .addCase(handleDeleteRating.pending , (state) => {
      state.delete_rating_loading = true;
    })
    .addCase(handleDeleteRating.fulfilled , (state, action) => {
      state.delete_rating_loading = false;
    })
    .addCase(handleDeleteRating.rejected ,(state) => {
      state.delete_rating_loading = false;
    })

     .addCase(handleGetAllRatingAnswers.pending , (state) => {
      state.get_rating_answers_loading = true;
    })
    .addCase(handleGetAllRatingAnswers.fulfilled , (state, action) => {
      state.get_rating_answers_loading = false;
      state.get_rating_answers_list = action.payload
    })
    .addCase(handleGetAllRatingAnswers.rejected ,(state) => {
      state.get_rating_answers_loading = false;
    })

    .addCase(handleAddRatingAnswers.pending , (state) => {
      state.add_rating_answers_loading = true;
    })
    .addCase(handleAddRatingAnswers.fulfilled , (state, action) => {
      state.add_rating_answers_loading = false;
    })
    .addCase(handleAddRatingAnswers.rejected ,(state) => {
      state.add_rating_answers_loading = false;
    })

    .addCase(handleEditRatingAnswers.pending , (state) => {
      state.edit_rating_answers_loading = true;
    })
    .addCase(handleEditRatingAnswers.fulfilled , (state, action) => {
      state.edit_rating_answers_loading = false;
    })
    .addCase(handleEditRatingAnswers.rejected ,(state) => {
      state.edit_rating_answers_loading = false;
    })

    .addCase(handleDeleteRatingAnswers.pending , (state) => {
      state.delete_rating_answers_loading = true;
    })
    .addCase(handleDeleteRatingAnswers.fulfilled , (state, action) => {
      state.delete_rating_answers_loading = false;
    })
    .addCase(handleDeleteRatingAnswers.rejected ,(state) => {
      state.delete_rating_answers_loading = false;
    })
  }
})

export default ratingSlice.reducer;