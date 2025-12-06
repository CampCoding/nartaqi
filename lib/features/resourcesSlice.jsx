import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../shared/api";
import { apiRoutes } from "../shared/routes";

const initialState = {
  all_resources_list : [],
  all_resources_loading : false,

  add_resource_loading : false,
  edit_resource_loading : false,
  delete_resource_loading : false,
}

export const handleGetAllRoundResources  = createAsyncThunk("resourcesSlice/handleGetAllRoundResources",async({body}) => {
  const response = await api.post(apiRoutes.get_resources , {body});
  return response;
})

export const handleAddRoundResource = createAsyncThunk("resourcesSlice/handleAddRoundResource",async({body}) => {
  const response = await api.post(apiRoutes.add_resources , {body , isFile : true});
  return response;
})

export const handleEditRoundResource = createAsyncThunk("resourcesSlice/handleEditRoundResource",async({body}) => {
  const response = await api.post(apiRoutes.edit_resources , {body , isFile : true});
  return response;
})

export const handleDeleteRoundResource = createAsyncThunk("resourcesSlice/handleDeleteRoundResource",async({body}) => {
  const response = await api.post(apiRoutes.delete_resource , {body});
  return response;
})


export const resourcesSlice = createSlice({
  name:"resourcesSlice",
  initialState,
  extraReducers : (builder) => {
    builder
    .addCase(handleGetAllRoundResources.pending, (state) => {
      state.all_resources_loading = true;
    })
    .addCase(handleGetAllRoundResources.fulfilled , (state , action) => {
      state.all_resources_loading = false;
      state.all_resources_list = action.payload;
    })
    .addCase(handleGetAllRoundResources.rejected ,(state) => {
      state.all_resources_loading = false
    })

    .addCase(handleAddRoundResource.pending, (state) => {
      state.add_resource_loading = true;
    })
    .addCase(handleAddRoundResource.fulfilled , (state , action) => {
      state.add_resource_loading = false;
    })
    .addCase(handleAddRoundResource.rejected ,(state) => {
      state.add_resource_loading = false
    })

    .addCase(handleEditRoundResource.pending, (state) => {
      state.edit_resource_loading = true;
    })
    .addCase(handleEditRoundResource.fulfilled , (state , action) => {
      state.edit_resource_loading = false;
    })
    .addCase(handleEditRoundResource.rejected ,(state) => {
      state.edit_resource_loading = false
    })

    .addCase(handleDeleteRoundResource.pending, (state) => {
      state.delete_resource_loading = true;
    })
    .addCase(handleDeleteRoundResource.fulfilled , (state , action) => {
      state.delete_resource_loading = false;
    })
    .addCase(handleDeleteRoundResource.rejected ,(state) => {
      state.delete_resource_loading = false
    })
  }
})

export default resourcesSlice.reducer;