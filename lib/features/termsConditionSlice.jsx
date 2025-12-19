import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../shared/api";

const initialState = {
  add_terms_loading : false ,
  edit_terms_loading : false,
  delete_terms_loading : false,
}

export const handleAddTerms = createAsyncThunk("termsConditionSlice/handleAddTerms",async({body}) => {
  const response = await api.post("admin/rounds/addRoundTerm", {body});
  return response;
})

export const handleEditTerms = createAsyncThunk("termsConditionSlice/handleEditTerms",async({body}) => {
  const response = await api.post("admin/rounds/editRoundTerm", {body});
  return response;
})

export const handleDeleteTerms = createAsyncThunk("termsConditionSlice/handleDeleteTerms",async({body}) => {
  const response = await api.post("admin/rounds/deleteRoundTerm", {body});
  return response;
})


export const termsConditionSlice = createSlice({
  name:"termsConditionSlice",
  initialState,
  extraReducers : (builder) => {
     builder
     .addCase(handleAddTerms.pending , (state) => {
      state.add_terms_loading = true;
     })
      .addCase(handleAddTerms.fulfilled , (state) => {
      state.add_terms_loading = false;
     })
      .addCase(handleAddTerms.rejected , (state) => {
      state.add_terms_loading = false;
     })


     .addCase(handleEditTerms.pending , (state) => {
      state.edit_terms_loading = true;
     })
      .addCase(handleEditTerms.fulfilled , (state) => {
      state.edit_terms_loading = false;
     })
      .addCase(handleEditTerms.rejected , (state) => {
      state.edit_terms_loading = false;
     })


     .addCase(handleDeleteTerms.pending , (state) => {
      state.delete_terms_loading = true;
     })
      .addCase(handleDeleteTerms.fulfilled , (state) => {
      state.delete_terms_loading = false;
     })
      .addCase(handleDeleteTerms.rejected , (state) => {
      state.delete_terms_loading = false;
     })
  }
})

export default termsConditionSlice.reducer;