import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../shared/api";
import { apiRoutes } from "../shared/routes";

const initialState = {
  all_exam_list : [],
  all_exam_loading : false,

  add_exam_loading : false,
}

export const handleGetAllExams = createAsyncThunk("examSlice/handleGetAllExams", async() => {
  const response = await api.get(apiRoutes.get_exams);
  return response;
})

export const handleCreateExam = createAsyncThunk("examSlice/handleCreateExam",async({body}) => {
  const response = await api.post(apiRoutes.add_exam , {body});
  return response;
})

export const examSlice = createSlice({
  name:"examSlice",
  initialState,
  reducers : {

  },
  extraReducers : (builder) => {
    builder
    .addCase(handleGetAllExams.pending ,(state) => {
      state.all_exam_loading = true;
    })
    .addCase(handleGetAllExams.fulfilled ,(state , action) => {
      state.all_exam_loading = false;
      state.all_exam_list = action.payload
    })
    .addCase(handleGetAllExams.rejected ,(state) => {
      state.all_exam_loading = false;
    })

    .addCase(handleCreateExam.pending ,(state) => {
      state.add_exam_loading = true;
    })
    .addCase(handleCreateExam.fulfilled ,(state , action) => {
      state.add_exam_loading = false;
    })
    .addCase(handleCreateExam.rejected ,(state) => {
      state.add_exam_loading = false;
    })

  }
})

export default examSlice.reducer;