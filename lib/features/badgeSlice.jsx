import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../shared/api";
import { apiRoutes } from "../shared/routes";

const initialState = {
  badges_list : [],
  badges_loading : false,

  all_badges_list : [],
  all_badges_loading : false,

  student_badges_loading: false,
  student_badges_list : [],
  assign_badge_loading : false,

  create_badge_loading: false,
  edit_badge_loading : false,
  delete_badge_loading : false
}

export const handleGetAllBadges = createAsyncThunk("badgeSlice/handleGetAllBadges",async() => {
  const response = await api.get(apiRoutes.get_badges);
  return response;
})

export const handleCreateBadge = createAsyncThunk("badgeSlice/handleCreateBadge",async({body}) => {
  const response = await api.post(apiRoutes.add_badge , {body , isFile : true});
  return response;
})

export const handleGetAllStudentBadges = createAsyncThunk("badgeSlice/handleGetAllStudentBadges",async({body}) => {
  const response = await api.post(apiRoutes.studuent_badges , {body});
  return response;
})

export const handleEditBadge = createAsyncThunk('badgeSlice/handleEditBadge', async({body}) => {
  const response = await api.post(apiRoutes.edit_badge , {body , isFile : true});
  return response
})

export const handleDeleteBadge = createAsyncThunk('badgeSlice/handleDeleteBadge', async({body}) => {
  const response = await api.post(apiRoutes.delete_badge , {body});
  return response
})

export const handleAssignBadgeToStudent = createAsyncThunk("badgeSlice/handleAssignBadgeToStudent",async({body}) => {
  const response = await api.post(apiRoutes.assign_page_to_student , {body});
  return response;
})


export const badgeSlice = createSlice({
  name:"badgeSlice",
  initialState,
  extraReducers : (builder) => {
    builder
    .addCase(handleGetAllBadges.pending ,(state) => {
      state.all_badges_loading = true;
    })
    .addCase(handleGetAllBadges.fulfilled ,(state , action) => {
      state.all_badges_loading = false;
      state.all_badges_list = action.payload
    })
    .addCase(handleGetAllBadges.rejected ,(state) => {
      state.all_badges_loading = false
    })

    .addCase(handleCreateBadge.pending ,(state) => {
      state.create_badge_loading = true;
    })
    .addCase(handleCreateBadge.fulfilled ,(state , action) => {
      state.create_badge_loading = false;
    })
    .addCase(handleCreateBadge.rejected ,(state) => {
      state.create_badge_loading = false
    })

    .addCase(handleEditBadge.pending ,(state) => {
      state.edit_badge_loading = true;
    })
    .addCase(handleEditBadge.fulfilled ,(state , action) => {
      state.edit_badge_loading = false;
    })
    .addCase(handleEditBadge.rejected ,(state) => {
      state.edit_badge_loading = false
    })

    .addCase(handleDeleteBadge.pending ,(state) => {
      state.delete_badge_loading = true;
    })
    .addCase(handleDeleteBadge.fulfilled ,(state , action) => {
      state.delete_badge_loading = false;
    })
    .addCase(handleDeleteBadge.rejected ,(state) => {
      state.delete_badge_loading = false
    })

    .addCase(handleGetAllStudentBadges.pending ,(state) => {
      state.student_badges_loading = true;
    })
    .addCase(handleGetAllStudentBadges.fulfilled ,(state , action) => {
      state.student_badges_loading = false;
      state.student_badges_list = action.payload
    })
    .addCase(handleGetAllStudentBadges.rejected ,(state) => {
      state.student_badges_loading = false
    })

    .addCase(handleAssignBadgeToStudent.pending ,(state) => {
      state.assign_badge_loading = true;
    })
    .addCase(handleAssignBadgeToStudent.fulfilled ,(state) => {
      state.assign_badge_loading = false;
    })
    .addCase(handleAssignBadgeToStudent.rejected ,(state) => {
      state.assign_badge_loading = false
    })
  }
})

export default badgeSlice.reducer;