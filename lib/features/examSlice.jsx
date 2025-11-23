import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../shared/api";
import { apiRoutes } from "../shared/routes";

const initialState = {
  all_exam_list : [],
  all_exam_loading : false,

  add_exam_loading : false,

  add_exam_section_loading : false,
  edit_exam_section_loading:  false,
  delete_exam_section_loading:  false,
  get_exam_sections_list :[ ],
  get_exam_sections_loading : false,
  assign_exam_loading : false,
}

export const handleGetAllExams = createAsyncThunk("examSlice/handleGetAllExams", async() => {
  const response = await api.get(apiRoutes.get_exams);
  return response;
})

export const handleCreateExam = createAsyncThunk("examSlice/handleCreateExam",async({body}) => {
  const response = await api.post(apiRoutes.add_exam , {body});
  return response;
})

export const handleCreateExamSection = createAsyncThunk("examSlice/handleCreateExamSection",async({body}) => {
  const response = await api.post(apiRoutes.add_exam_sections ,{body});
  return response;
})

export const handleAssignExam = createAsyncThunk("examSlice/handleAssignExam",async({body}) => {
  const response = await api.post(apiRoutes.assign_exam , {body});
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

    .addCase(handleCreateExamSection.pending ,(state) => {
      state.add_exam_section_loading = true;
    })
    .addCase(handleCreateExamSection.fulfilled ,(state , action) => {
      state.add_exam_section_loading = false;
    })
    .addCase(handleCreateExamSection.rejected ,(state) => {
      state.add_exam_section_loading = false;
    })
    
    .addCase(handleAssignExam.pending ,(state) => {
      state.assign_exam_loading = true;
    })
    .addCase(handleAssignExam.fulfilled ,(state , action) => {
      state.assign_exam_loading = false;
    })
    .addCase(handleAssignExam.rejected ,(state) => {
      state.assign_exam_loading = false;
    })
  }
})

export default examSlice.reducer;