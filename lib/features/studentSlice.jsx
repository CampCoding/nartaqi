import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../shared/api";
import { apiRoutes } from "../shared/routes";

const initialState = {
  get_students_list : [],
  get_students_loading: false,

  get_student_rounds_list:[],
  get_student_rounds_loading:  false,

  cancel_student_round_loading: false,
  inroll_student_round_loading: false,

  get_student_by_phone_list:[],
  get_student_by_phone_loading: false,
}

export const handleGetAllStudents = createAsyncThunk("studentSlice/handleGetAllStudents",async({body}) => {
  const response = await api.post(apiRoutes.get_students ,{body});
  return response
})


export const handleGetStudentDetails = createAsyncThunk("studentSlice/handleGetStudentDetails",async({body}) => {
  const response = await api.post(apiRoutes.get_student_by_phone ,{body});
  return response
})

export const handleGetStudentRounds = createAsyncThunk("studentSlice/handleGetStudentRounds",async({body}) => {
  const response = await api.post(apiRoutes.get_student_round ,{body});
  return response
})

export const handleInrollStudentRound = createAsyncThunk("studentSlice/handleInrollStudentRound",async({body}) => {
  const response = await api.post(apiRoutes.inroll_student_round ,{body});
  return response
})

export const handleCancelStudentRound = createAsyncThunk("studentSlice/handleCancelStudentRound",async({body}) => {
  const response = await api.post(apiRoutes.cancel_student_round ,{body});
  return response
})

export const studentSlice = createSlice({
  name:"studentSlice",
  initialState ,
  extraReducers : (builder) => { 
    builder
    .addCase(handleGetAllStudents.pending ,(state) => {
      state.get_students_loading = true;
    })
    .addCase(handleGetAllStudents.fulfilled ,(state,action) => {
      state.get_students_loading = false;
      state.get_students_list = action.payload;
    })
    .addCase(handleGetAllStudents.rejected,(state) => {
      state.get_students_loading = false;
    })

     .addCase(handleGetStudentDetails.pending ,(state) => {
      state.get_student_by_phone_loading = true;
    })
    .addCase(handleGetStudentDetails.fulfilled ,(state,action) => {
      state.get_student_by_phone_loading = false;
      state.get_student_by_phone_list = action.payload;
    })
    .addCase(handleGetStudentDetails.rejected,(state) => {
      state.get_student_by_phone_loading = false;
    })

     .addCase(handleInrollStudentRound.pending ,(state) => {
      state.inroll_student_round_loading = true;
    })
    .addCase(handleInrollStudentRound.fulfilled ,(state,action) => {
      state.inroll_student_round_loading = false;
    })
    .addCase(handleInrollStudentRound.rejected,(state) => {
      state.inroll_student_round_loading = false;
    })

     .addCase(handleCancelStudentRound.pending ,(state) => {
      state.cancel_student_round_loading = true;
    })
    .addCase(handleCancelStudentRound.fulfilled ,(state,action) => {
      state.cancel_student_round_loading = false;
    })
    .addCase(handleCancelStudentRound.rejected,(state) => {
      state.cancel_student_round_loading = false;
    })

     .addCase(handleGetStudentRounds.pending ,(state) => {
      state.get_student_rounds_loading = true;
    })
    .addCase(handleGetStudentRounds.fulfilled ,(state,action) => {
      state.get_student_rounds_loading = false;
      state.get_student_rounds_list = action.payload;
    })
    .addCase(handleGetStudentRounds.rejected,(state) => {
      state.get_student_rounds_loading = false;
    })
  }
})


export default studentSlice.reducer;