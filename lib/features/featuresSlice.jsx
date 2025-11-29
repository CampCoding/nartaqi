import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../shared/api";
import { apiRoutes } from "../shared/routes";

const initialState ={
  all_features_list : [],
  all_features_loading : false,

  add_feature_loading : false,
  edit_feature_loading : false,
  delete_feature_loading : false
}

export const handleGetAllRoundFeatures = createAsyncThunk("featuresSlice/handleGetAllRoundFeatures",async({body}) => {
  const response = await api.post(apiRoutes.get_features ,{body});
  return response;
})

export const handleAddRoundFeatures = createAsyncThunk("featuresSlice/handleAddRoundFeatures",async({body}) => {
  const response = await api.post(apiRoutes.add_feature ,{body , isFile : true});
  return response;
})


export const handleEditRoundFeatures = createAsyncThunk("featuresSlice/handleEditRoundFeatures",async({body}) => {
  const response = await api.post(apiRoutes.edit_feature ,{body , isFile : true});
  return response;
})


export const handleDeleteRoundFeatures = createAsyncThunk("featuresSlice/handleDeleteRoundFeatures",async({body}) => {
  const response = await api.post(apiRoutes.delete_feature ,{body});
  return response;
})


export const featuresSlice  = createSlice({
  name:"featuresSlice",
  initialState ,
  extraReducers:(builder) => {
    builder
    .addCase(handleGetAllRoundFeatures.pending ,(state) => {
      state.all_features_loading = true;
    })
    .addCase(handleGetAllRoundFeatures.fulfilled, (state,action) => {
      state.all_features_loading = false;
      state.all_features_list = action.payload;
    })
    .addCase(handleGetAllRoundFeatures.rejected,(state) => {
      state.all_features_loading = false;
    })

    .addCase(handleAddRoundFeatures.pending ,(state) => {
      state.add_feature_loading = true;
    })
    .addCase(handleAddRoundFeatures.fulfilled, (state,action) => {
      state.add_feature_loading = false;
    })
    .addCase(handleAddRoundFeatures.rejected,(state) => {
      state.add_feature_loading = false;
    })

    .addCase(handleEditRoundFeatures.pending ,(state) => {
      state.edit_feature_loading = true;
    })
    .addCase(handleEditRoundFeatures.fulfilled, (state,action) => {
      state.edit_feature_loading = false;
    })
    .addCase(handleEditRoundFeatures.rejected,(state) => {
      state.edit_feature_loading = false;
    })

    .addCase(handleDeleteRoundFeatures.pending ,(state) => {
      state.delete_feature_loading = true;
    })
    .addCase(handleDeleteRoundFeatures.fulfilled, (state,action) => {
      state.delete_feature_loading = false;
    })
    .addCase(handleDeleteRoundFeatures.rejected,(state) => {
      state.delete_feature_loading = false;
    })
  }
})

export default featuresSlice.reducer;