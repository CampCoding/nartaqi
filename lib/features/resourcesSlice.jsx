import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../shared/api";
import { apiRoutes } from "../shared/routes";

const initialState = {
  all_resources_list : [],
  all_resources_loading : false,

  all_resources_links : [],
  all_resources_links_loading : false,

  add_resource_loading : false,
  edit_resource_loading : false,
  delete_resource_loading : false,

  add_resource_link_loading : false,
  edit_resource_link_loading : false,
  delete_resource_link_loading :false,
}

export const handleGetAllRoundResourcesLinks = createAsyncThunk("resourcesSlice/handleGetAllRoundResourcesLinks",async({body}) => {
  const response = await api.post("admin/rounds-resources/getResourceLinks" , {body});
  return response;
})

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


export const handleAddRoundResourceLink = createAsyncThunk("resourcesSlice/handleAddRoundResourceLink",async({body}) => {
  const response = await api.post("admin/rounds-resources/storeResourceLinks" , {body , isFile : true});
  return response;
})

export const handleEditRoundResourceLink = createAsyncThunk("resourcesSlice/handleEditRoundResourceLink",async({body}) => {
  const response = await api.post("admin/rounds-resources/editResourceLinks" , {body , isFile : true});
  return response;
})

export const handleDeleteRoundResourceLink = createAsyncThunk("resourcesSlice/handleDeleteRoundResourceLink",async({body}) => {
  const response = await api.post("admin/rounds-resources/deleteResourceLinks" , {body});
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

    .addCase(handleGetAllRoundResourcesLinks.pending, (state) => {
      state.all_resources_links_loading = true;
    })
    .addCase(handleGetAllRoundResourcesLinks.fulfilled , (state , action) => {
      state.all_resources_links_loading = false;
      state.all_resources_links = action.payload;
    })
    .addCase(handleGetAllRoundResourcesLinks.rejected ,(state) => {
      state.all_resources_links_loading = false
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

    .addCase(handleAddRoundResourceLink.pending, (state) => {
      state.add_resource_link_loading = true;
    })
    .addCase(handleAddRoundResourceLink.fulfilled , (state , action) => {
      state.add_resource_link_loading = false;
    })
    .addCase(handleAddRoundResourceLink.rejected ,(state) => {
      state.add_resource_link_loading = false
    })

    .addCase(handleEditRoundResourceLink.pending, (state) => {
      state.edit_resource_link_loading = true;
    })
    .addCase(handleEditRoundResourceLink.fulfilled , (state , action) => {
      state.edit_resource_link_loading = false;
    })
    .addCase(handleEditRoundResourceLink.rejected ,(state) => {
      state.edit_resource_link_loading = false
    })

    .addCase(handleDeleteRoundResourceLink.pending, (state) => {
      state.delete_resource_link_loading = true;
    })
    .addCase(handleDeleteRoundResourceLink.fulfilled , (state , action) => {
      state.delete_resource_link_loading = false;
    })
    .addCase(handleDeleteRoundResourceLink.rejected ,(state) => {
      state.delete_resource_link_loading = false
    })
  }
})

export default resourcesSlice.reducer;