import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../shared/api";
import { apiRoutes } from "../shared/routes";

const initialState = {
  all_exam_list : [],
  all_exam_loading : false,

  add_exam_loading : false,
  edit_exam_loading :false,
  delete_exam_loading : false,

  add_exam_section_loading : false,
  edit_exam_section_loading:  false,
  delete_exam_section_loading:  false,
  get_exam_sections_list :[ ],
  get_exam_sections_loading : false,
  assign_exam_loading : false,

  get_exam_questions_list : [],
  get_exam_question_loading : false, 

  add_question_loading : false
}

export const handleGetAllExams = createAsyncThunk("examSlice/handleGetAllExams", async() => {
  const response = await api.get(apiRoutes.get_exams);
  return response;
})

export const handleCreateExam = createAsyncThunk("examSlice/handleCreateExam",async({body}) => {
  const response = await api.post(apiRoutes.add_exam , {body});
  return response;
})

export const handleEditExam = createAsyncThunk("examSlice/handleEditExam",async({body}) => {
  const response = await api.post(apiRoutes.edit_exam ,{body});
  return response
})

export const handleDeleteExam = createAsyncThunk("examSlice/handleDeleteExam",async({body}) => {
  const response = await api.post(apiRoutes.delete_exam ,{body});
  return response
})

export const handleGetAllExamSections = createAsyncThunk("examSlice/handleGetAllExamSections",async({body}) => {
  const response = await api.post(apiRoutes.get_exam_sections , {body});
  return response
})

export const handleCreateExamSection = createAsyncThunk("examSlice/handleCreateExamSection",async({body}) => {
  const response = await api.post(apiRoutes.add_exam_sections ,{body});
  return response;
})

export const handleEditExamSection = createAsyncThunk("examSlice/handleEditExamSection",async({body}) =>{
   const response = await api.post("admin/exams/exam-sections/edit_exam_section",{body});
   return response;
})

export const handleDeleteExamSection = createAsyncThunk("examSlice/handleDeleteExamSection" , async({body}) => {
  const response = await api.post(apiRoutes.delete_exam_sections ,{body});
  return response;
})

export const handleAssignExam = createAsyncThunk("examSlice/handleAssignExam",async({body}) => {
  const response = await api.post(apiRoutes.assign_exam , {body});
  return response;
})

export const handleGetExamQuestions = createAsyncThunk("examSlice/handleGetExamQuestions",async({body}) => {
  const response = await api.post(apiRoutes.get_questions , {body});
  return response;
})

export const handleAddQuestion = createAsyncThunk("examSlice/handleAddQuestion",async({body}) => {
  const response = await api.post(apiRoutes.store_question , {body});
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

     .addCase(handleEditExam.pending ,(state) => {
      state.edit_exam_loading = true;
    })
    .addCase(handleEditExam.fulfilled ,(state , action) => {
      state.edit_exam_loading = false;
    })
    .addCase(handleEditExam.rejected ,(state) => {
      state.edit_exam_loading = false;
    })

     .addCase(handleDeleteExam.pending ,(state) => {
      state.delete_exam_loading = true;
    })
    .addCase(handleDeleteExam.fulfilled ,(state , action) => {
      state.delete_exam_loading = false;
    })
    .addCase(handleDeleteExam.rejected ,(state) => {
      state.delete_exam_loading = false;
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

    .addCase(handleEditExamSection.pending ,(state) => {
      state.edit_exam_section_loading = true;
    })
    .addCase(handleEditExamSection.fulfilled ,(state , action) => {
      state.edit_exam_section_loading = false;
    })
    .addCase(handleEditExamSection.rejected ,(state) => {
      state.edit_exam_section_loading = false;
    })

     .addCase(handleDeleteExamSection.pending ,(state) => {
      state.delete_exam_section_loading = true;
    })
    .addCase(handleDeleteExamSection.fulfilled ,(state , action) => {
      state.delete_exam_section_loading = false;
    })
    .addCase(handleDeleteExamSection.rejected ,(state) => {
      state.delete_exam_section_loading = false;
    })

      .addCase(handleGetAllExamSections.pending ,(state) => {
      state.get_exam_sections_loading = true;
    })
    .addCase(handleGetAllExamSections.fulfilled ,(state , action) => {
      state.get_exam_sections_loading = false;
      state.get_exam_sections_list = action.payload;
    })
    .addCase(handleGetAllExamSections.rejected ,(state) => {
      state.get_exam_sections_loading = false;
    })

    .addCase(handleGetExamQuestions.pending ,(state) => {
      state.get_exam_question_loading = true;
    })
    .addCase(handleGetExamQuestions.fulfilled ,(state , action) => {
      state.get_exam_question_loading = false;
      state.get_exam_questions_list = action.payload;
    })
    .addCase(handleGetExamQuestions.rejected ,(state) => {
      state.get_exam_question_loading = false;
    })

    .addCase(handleAddQuestion.pending ,(state) => {
      state.add_question_loading = true;
    })
    .addCase(handleAddQuestion.fulfilled ,(state , action) => {
      state.add_question_loading = false;
    })
    .addCase(handleAddQuestion.rejected ,(state) => {
      state.add_question_loading = false;
    })
  }
})

export default examSlice.reducer;