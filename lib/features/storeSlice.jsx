import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../shared/api";
import { apiRoutes } from "../shared/routes";

const initialState ={ 
  add_store_loading : false, 
  edit_store_loading: false,
  delete_store_loading : false,
  all_store_list : [],
  all_store_loading : false,
}

export const handleGetAllStoreData = createAsyncThunk("storeSlice/handleGetAllStoreData",async() =>{
  const response = await api.get(apiRoutes.get_store);
  return response;
})

export const handleAddStoreData = createAsyncThunk("storeSlice/handleAddStoreData",async({body}) => {
  const response = await api.post(apiRoutes.add_store ,{body , isFile : true});
  return response;
})


export const handleEditStoreData = createAsyncThunk("storeSlice/handleEditStoreData",async({body}) => {
  const response = await api.post(apiRoutes.edit_store ,{body , isFile : true});
  return response;
})

export const handleDeleteStoreData = createAsyncThunk("storeSlice/handleDeleteStoreData",async({body}) => {
  const response = await api.post(apiRoutes.delete_store ,{body , isFile : true});
  return response;
})


export const storeSlice = createSlice({
  name:"storeSlice",
  initialState,
  extraReducers :(builder) => {
    builder
    .addCase(handleAddStoreData.pending ,(state) => {
      state.add_store_loading = true;
    })
    .addCase(handleAddStoreData.fulfilled , (state) => {
      state.add_store_loading = false;
    })
    .addCase(handleAddStoreData.rejected ,(state) => {
      state.add_store_loading = false;
    })

    .addCase(handleEditStoreData.pending ,(state) => {
      state.edit_store_loading = true;
    })
    .addCase(handleEditStoreData.fulfilled , (state) => {
      state.edit_store_loading = false;
    })
    .addCase(handleEditStoreData.rejected ,(state) => {
      state.edit_store_loading = false;
    })

    .addCase(handleDeleteStoreData.pending ,(state) => {
      state.delete_store_loading = true;
    })
    .addCase(handleDeleteStoreData.fulfilled , (state) => {
      state.delete_store_loading = false;
    })
    .addCase(handleDeleteStoreData.rejected ,(state) => {
      state.delete_store_loading = false;
    })

    .addCase(handleGetAllStoreData.pending ,(state) => {
      state.all_store_loading = true;
    })
    .addCase(handleGetAllStoreData.fulfilled , (state , action) => {
      state.all_store_loading = false;
      state.all_store_list = action.payload;
    })
    .addCase(handleGetAllStoreData.rejected ,(state) => {
      state.all_store_loading = false;
    })
  }
})

export default storeSlice.reducer;