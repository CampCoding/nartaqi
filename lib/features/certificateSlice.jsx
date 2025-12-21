import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../shared/api";
import { apiRoutes } from "../shared/routes";

const initialState = {
  certificate_list : [],
  certificate_loading : false,

  applications_list : [],
  applications_loading : false,

  add_certificate_loading: false,
  edit_certificate_loading : false,
  delete_certificate_loading : false,
}

export const handleGetAllApplications = createAsyncThunk("certificateSlice/handleGetAllApplications",async({body}) => {
  const response = await api.post(apiRoutes.get_certificates , {body});
  return response;
})

export const handleAddCertificate  = createAsyncThunk("certificateSlice/handleAddCertificate",async({body}) =>{
  const response = await api.post(apiRoutes.add_certificates ,{body});
  return response;
})

export const handleEditCertificate  = createAsyncThunk("certificateSlice/handleEditCertificate",async({body}) => {
  const response = await api.post(apiRoutes.edit_certificate ,{body});
  return response;
})


export const handleDeleteCertificate  = createAsyncThunk("certificateSlice/handleDeleteCertificate",async({body}) => {
  const response = await api.post(apiRoutes.delete_certificate ,{body});
  return response;
}) 



export const certificateSlice = createSlice({
  name:"certificateSlice",
  initialState,
  extraReducers : (builder) =>{
    builder
    .addCase(handleGetAllApplications.pending ,(state) => {
      state.applications_loading = true;
    })
    .addCase(handleGetAllApplications.fulfilled ,(state , action) => {
      state.applications_list = action.payload ;
      state.applications_loading = false;
    })
    .addCase(handleGetAllApplications.rejected, (state) => {
      state.applications_loading = false
    })

    .addCase(handleAddCertificate.pending ,(state) => {
      state.add_certificate_loading = true;
    })
    .addCase(handleAddCertificate.fulfilled ,(state , action) => {
      state.add_certificate_loading = false;
    })
    .addCase(handleAddCertificate.rejected, (state) => {
      state.add_certificate_loading = false
    })

     .addCase(handleEditCertificate.pending ,(state) => {
      state.edit_certificate_loading = true;
    })
    .addCase(handleEditCertificate.fulfilled ,(state , action) => {
      state.edit_certificate_loading = false;
    })
    .addCase(handleEditCertificate.rejected, (state) => {
      state.edit_certificate_loading = false
    })

     .addCase(handleDeleteCertificate.pending ,(state) => {
      state.delete_certificate_loading = true;
    })
    .addCase(handleDeleteCertificate.fulfilled ,(state , action) => {
      state.delete_certificate_loading = false;
    })
    .addCase(handleDeleteCertificate.rejected, (state) => {
      state.delete_certificate_loading = false
    })
  }
})

export default certificateSlice.reducer;