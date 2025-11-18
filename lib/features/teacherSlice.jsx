import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../shared/api";
import { apiRoutes } from "../shared/routes";

const initialState = {
  teachers_list : [],
  teachers_loading: false,

  add_teacher_loading : false,
  edit_teacher_loading : false,
  delete_teahcer_loading : false,
}

export const handleGetAllTeachers = createAsyncThunk("teahcerSlice/handleGetAllTeachers",async() => {
  const response = await api.get(apiRoutes.get_teacher);
  return response;
})

export const handleAddTeacher = createAsyncThunk("teahcerSlice/handleAddTeacher",async({body}) => {
  const response = await api.post(apiRoutes.add_teacher , {body , isFile : true});
  return response;
})

export const handleEditTeacher = createAsyncThunk("teahcerSlice/handleEditTeacher",async({body}) => {
  const response = await api.post(apiRoutes.edit_teacher , {body , isFile : true});
  return response;
})


export const handleDeleteTeacher = createAsyncThunk("teahcerSlice/handleDeleteTeacher",async({body}) => {
  const response = await api.post(apiRoutes.delete_teacher , {body});
  return response;
})

export const teacherSlice = createSlice({
  name:"teahcerSlice",
  initialState,
  extraReducers : (builder) => {
    builder
    .addCase(handleGetAllTeachers.pending , (state) => {
      state.teachers_loading = true;
    })
    .addCase(handleGetAllTeachers.fulfilled ,(state , action) => {
      state.teachers_loading = false;
      state.teachers_list = action.payload
    })
    .addCase(handleGetAllTeachers.rejected ,(state) => {
      state.teachers_loading = false
    })

     .addCase(handleAddTeacher.pending , (state) => {
      state.add_teacher_loading = true;
    })
    .addCase(handleAddTeacher.fulfilled ,(state , action) => {
      state.add_teacher_loading = false;
      state.teachers_list = action.payload
    })
    .addCase(handleAddTeacher.rejected ,(state) => {
      state.add_teacher_loading = false
    })

    .addCase(handleEditTeacher.pending , (state) => {
      state.edit_teacher_loading = true;
    })
    .addCase(handleEditTeacher.fulfilled ,(state , action) => {
      state.edit_teacher_loading = false;
      state.teachers_list = action.payload
    })
    .addCase(handleEditTeacher.rejected ,(state) => {
      state.edit_teacher_loading = false
    })

    .addCase(handleDeleteTeacher.pending , (state) => {
      state.delete_teahcer_loading = true;
    })
    .addCase(handleDeleteTeacher.fulfilled ,(state , action) => {
      state.delete_teahcer_loading = false;
      state.teachers_list = action.payload
    })
    .addCase(handleDeleteTeacher.rejected ,(state) => {
      state.delete_teahcer_loading = false
    })
  }
})

export default teacherSlice.reducer;