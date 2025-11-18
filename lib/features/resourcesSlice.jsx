import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../shared/api";
import { apiRoutes } from "../shared/routes";

const initialState = {
  all_resources_list : [],
  all_resources_loading : false,
}

export const handleGetAllRoundResources  = createAsyncThunk("resourcesSlice/handleGetAllRoundResources",async({body}) => {
  const response = await api.post(apiRoutes.get_resources , {body});
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
  }
})

export default resourcesSlice.reducer;