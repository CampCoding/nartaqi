import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../shared/api";
import { apiRoutes } from "../shared/routes";

const initialState ={
  all_lessons_list : [],
  all_lessons_loading : false,

  add_lesson_loading : false,
  edit_lesson_loading : false,
  delete_lesson_loading : false
}

export const handleGetAllRoundLessons= createAsyncThunk("lessonSlice/handleGetAllRoundLessons",async({body}) => {
  const response = await api.post(apiRoutes.get_lessons , {body});
  return response
})

export const handleAddRoundLessons= createAsyncThunk("lessonSlice/handleAddRoundLessons",async({body}) => {
  const response = await api.post(apiRoutes.add_lesson , {body});
  return response
})


export const handleEditRoundLessons= createAsyncThunk("lessonSlice/handleEditRoundLessons",async({body}) => {
  const response = await api.post(apiRoutes.edit_lesson , {body});
  return response
})


export const handleDeleteRoundLessons= createAsyncThunk("lessonSlice/handleDeleteRoundLessons",async({body}) => {
  const response = await api.post(apiRoutes.delete_lesson , {body});
  return response
})



export const lessonSlice = createSlice({
  name:"lessonSlice",
  initialState,
  extraReducers :(builder) => {
    builder
    .addCase(handleGetAllRoundLessons.pending ,(state) => {
      state.all_lessons_loading = true;
    })
    .addCase(handleGetAllRoundLessons.fulfilled ,(state,action) => {
      state.all_lessons_loading = false;
      state.all_lessons_list = action.payload
    })
    .addCase(handleGetAllRoundLessons.rejected ,(state) => {
      state.all_lessons_loading = false
    })

    .addCase(handleAddRoundLessons.pending ,(state) => {
      state.add_lesson_loading = true;
    })
    .addCase(handleAddRoundLessons.fulfilled ,(state,action) => {
      state.add_lesson_loading = false;
    })
    .addCase(handleAddRoundLessons.rejected ,(state) => {
      state.add_lesson_loading = false
    })


    .addCase(handleEditRoundLessons.pending ,(state) => {
      state.edit_lesson_loading = true;
    })
    .addCase(handleEditRoundLessons.fulfilled ,(state,action) => {
      state.edit_lesson_loading = false;
    })
    .addCase(handleEditRoundLessons.rejected ,(state) => {
      state.edit_lesson_loading = false
    })

    .addCase(handleDeleteRoundLessons.pending ,(state) => {
      state.delete_lesson_loading = true;
    })
    .addCase(handleDeleteRoundLessons.fulfilled ,(state,action) => {
      state.delete_lesson_loading = false;
    })
    .addCase(handleDeleteRoundLessons.rejected ,(state) => {
      state.delete_lesson_loading = false
    })
  }
})

export default lessonSlice.reducer;