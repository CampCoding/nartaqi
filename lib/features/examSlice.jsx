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

  all_exam_lessons_list : [],
  all_exam_lesson_loading : false,

  add_question_loading : false,
  get_exam_details_loading: false,
  edit_question_loading : false,
  delete_question_loading : false,
  exam_details: [],

  add_exam_video_loading: false,
  edit_exam_video_loading : false,
  delete_exam_video_loading: false,

  add_exam_pdf:false,
  edit_exam_pdf:false,
  delete_exam_pdf:false,

  all_exam_data_list : [],
  all_exam_data_loading : false,
  
  all_exam_round_list : [],
  all_exam_round_loading : false,

  edit_paragraph_loading : false,
  delete_paragraph_loading : false,

  add_paragraph_question_loading : false,

  student_exam_score_list:[],
  student_exam_score_loading : false
}


export const handleGetAllExamByRoundId = createAsyncThunk("examSlice/handleGetAllExamByRoundId",async({body , page , per_page})=> {
  const response = await api.post(`admin/exams/getAllExamsByRoundId?page=${page}&per_page=${per_page}`,{body});
  return response
})

export const handleGetAllExamByLessonId = createAsyncThunk("examSlice/handleGetAllExamByLessonId",async({body})=> {
  const response = await api.post(`admin/exams/GetAllExamsLessonByLessonId`,{body});
  return response
})


export const handleGetAllExams = createAsyncThunk(
  "examSlice/handleGetAllExams", 
  async ({ page, per_page }) => {  // Destructure here
    if (page && per_page) {
      const response = await api.post(apiRoutes.get_exams, {
        body: {
          page,
          per_page
        }
      });
      return response;
    } else {
      const response = await api.post(apiRoutes.get_exams);
      return response;
    }
  }
);


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

export const handleUpdateExamQuestions = createAsyncThunk("examSlice/handleUpdateExamQuestions",async({body}) =>{
  const response = await api.post(`admin/questions/edit_question`,{body});
  return response;
})

export const handleDeleteExamQuestions = createAsyncThunk("examSlice/handleDeleteExamQuestions",async({body}) =>{
  const response = await api.post(`admin/questions/delete_question`,{body});
  return response;
})

export const handleGetAllExamData = createAsyncThunk("examSlice/handleGetAllExamData",async({body}) => {
  const response = await api.post("admin/exams/get_exam_all_data_by_id" ,{body});
  return response
})

export const handleAddQuestion = createAsyncThunk("examSlice/handleAddQuestion",async({body}) => {
  const response = await api.post(apiRoutes.store_question , {body});
  return response;
})


export const handleGetExamDetails = createAsyncThunk("examSlice/handleGetExamDetails", async ({ exam_id }) => {
  const body = {exam_id}
  const response = await api.post(apiRoutes.get_exam_sections, { body }, );
  return response;
})

export const handleAddExamPdf = createAsyncThunk("examSlice/handleAddExamPdf",async({body}) => {
  const response = await api.post(apiRoutes.add_exam_pdf , {body , isFile: true});
  return response;
})

export const handleEditExamPdf = createAsyncThunk("examSlice/handleEditExamPdf",async({body}) => {
  const response = await api.post(apiRoutes.edit_exam_pdf , {body , isFile : true});
  return response;
})


export const handleDeleteExamPdf = createAsyncThunk("examSlice/handleDeleteExamPdf",async({body}) => {
  const response = await api.post(apiRoutes.delete_exam_pdf , {body});
  return response;
})

export const handleEditParagraph = createAsyncThunk("examSlice/handleEditParagraph",async({body}) =>{
  const response = await api.post("admin/questions/editParagraphQuestions",{body});
  return response;
})

export const handleDeleteParagraph = createAsyncThunk("examSlice/handleDeleteParagraph",async({body}) =>{
  const response = await api.post("admin/questions/deleteParagraphQuestions",{body});
  return response;
})


export const handleEditExamPdfFile = createAsyncThunk(
  "examSlice/handleEditExamPdfFile",
  async ({ body }) => {
    const response = await api.post(apiRoutes.edit_exam_pdf, {
      body,
      isFile: true
    });
    return response;
  }
);

export const handleAddExamVideo = createAsyncThunk("examSlice/handleAddExamVideo",async({body}) => {
  const response = await api.post(apiRoutes.add_exam_video , {body});
  return response;
})

export const handleEditExamVideo = createAsyncThunk("examSlice/handleEditExamVideo",async({body}) => {
  const response = await api.post(apiRoutes.edit_exam_video , {body});
  return response;
})


export const handleDeleteExamVideo = createAsyncThunk("examSlice/handleDeleteExamVideo",async({body}) => {
  const response = await api.post(apiRoutes.delete_exam_video , {body});
  return response;
})


export const handleAddParagraphQuestion  = createAsyncThunk("examSlice/handleAddParagraphQuestion",async({body}) => {
  const response = await api.post("admin/questions/StoreParagraphQuestionWithAnswers",{body});
  return response;
})

export const handleGetAllStudentExamScore = createAsyncThunk("examSlice/handleGetAllStudentExamScore",async({body}) =>{
  const response = await api.post("admin/exams/GetStudentScoresByExamId",{body});
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

    .addCase(handleUpdateExamQuestions.pending ,(state) => {
      state.edit_question_loading = true;
    })
    .addCase(handleUpdateExamQuestions.fulfilled ,(state , action) => {
      state.edit_question_loading = false;
    })
    .addCase(handleUpdateExamQuestions.rejected ,(state) => {
      state.edit_question_loading = false;
    })

    .addCase(handleDeleteExamQuestions.pending ,(state) => {
      state.delete_question_loading = true;
    })
    .addCase(handleDeleteExamQuestions.fulfilled ,(state , action) => {
      state.delete_question_loading = false;
    })
    .addCase(handleDeleteExamQuestions.rejected ,(state) => {
      state.delete_question_loading = false;
    })

     .addCase(handleGetExamDetails.pending, (state) => {
        state.get_exam_details_loading = true;
      })
      .addCase(handleGetExamDetails.fulfilled, (state, action) => {
        state.get_exam_details_loading = false;
        state.exam_details = action.payload
      })
      .addCase(handleGetExamDetails.rejected, (state) => {
        state.get_exam_details_loading = false;
      })


      .addCase(handleAddExamPdf.pending ,(state) => {
      state.add_exam_pdf = true;
    })
    .addCase(handleAddExamPdf.fulfilled ,(state , action) => {
      state.add_exam_pdf = false;
    })
    .addCase(handleAddExamPdf.rejected ,(state) => {
      state.add_exam_pdf = false;
    })

    .addCase(handleEditExamPdf.pending ,(state) => {
      state.edit_exam_pdf = true;
    })
    .addCase(handleEditExamPdf.fulfilled ,(state , action) => {
      state.edit_exam_pdf = false;
    })
    .addCase(handleEditExamPdf.rejected ,(state) => {
      state.edit_exam_pdf = false;
    })

    .addCase(handleDeleteExamPdf.pending ,(state) => {
      state.delete_exam_pdf = true;
    })
    .addCase(handleDeleteExamPdf.fulfilled ,(state , action) => {
      state.delete_exam_pdf = false;
    })
    .addCase(handleDeleteExamPdf.rejected ,(state) => {
      state.delete_exam_pdf = false;
    })

    .addCase(handleAddExamVideo.pending ,(state) => {
      state.add_exam_video_loading = true;
    })
    .addCase(handleAddExamVideo.fulfilled ,(state , action) => {
      state.add_exam_video_loading = false;
    })
    .addCase(handleAddExamVideo.rejected ,(state) => {
      state.add_exam_video_loading = false;
    })

    .addCase(handleEditExamVideo.pending ,(state) => {
      state.edit_exam_video_loading = true;
    })
    .addCase(handleEditExamVideo.fulfilled ,(state , action) => {
      state.edit_exam_video_loading = false;
    })
    .addCase(handleEditExamVideo.rejected ,(state) => {
      state.edit_exam_video_loading = false;
    })

    .addCase(handleDeleteExamVideo.pending ,(state) => {
      state.delete_exam_video_loading = true;
    })
    .addCase(handleDeleteExamVideo.fulfilled ,(state , action) => {
      state.delete_exam_video_loading = false;
    })
    .addCase(handleDeleteExamVideo.rejected ,(state) => {
      state.delete_exam_video_loading = false;
    })

    .addCase(handleGetAllExamData.pending ,(state) => {
      state.all_exam_data_loading = true;
    })
    .addCase(handleGetAllExamData.fulfilled ,(state , action) => {
      state.all_exam_data_loading = false;
      state.all_exam_data_list= action.payload;
    })
    .addCase(handleGetAllExamData.rejected ,(state) => {
      state.all_exam_data_loading = false;
    })

     .addCase(handleGetAllExamByRoundId.pending ,(state) => {
      state.all_exam_round_loading = true;
    })
    .addCase(handleGetAllExamByRoundId.fulfilled ,(state , action) => {
      state.all_exam_round_loading = false;
      state.all_exam_round_list= action.payload;
    })
    .addCase(handleGetAllExamByRoundId.rejected ,(state) => {
      state.all_exam_round_loading = false;
    })

     .addCase(handleEditParagraph.pending ,(state) => {
      state.edit_paragraph_loading = true;
    })
    .addCase(handleEditParagraph.fulfilled ,(state , action) => {
      state.edit_paragraph_loading = false;
    })
    .addCase(handleEditParagraph.rejected ,(state) => {
      state.edit_paragraph_loading = false;
    })

     .addCase(handleDeleteParagraph.pending ,(state) => {
      state.delete_paragraph_loading = true;
    })
    .addCase(handleDeleteParagraph.fulfilled ,(state , action) => {
      state.delete_paragraph_loading = false;
    })
    .addCase(handleDeleteParagraph.rejected ,(state) => {
      state.delete_paragraph_loading = false;
    })

     .addCase(handleAddParagraphQuestion.pending ,(state) => {
      state.add_paragraph_question_loading = true;
    })
    .addCase(handleAddParagraphQuestion.fulfilled ,(state , action) => {
      state.add_paragraph_question_loading = false;
    })
    .addCase(handleAddParagraphQuestion.rejected ,(state) => {
      state.add_paragraph_question_loading = false;
    })

    

     .addCase(handleGetAllExamByLessonId.pending ,(state) => {
      state.all_exam_lesson_loading = true;
    })
    .addCase(handleGetAllExamByLessonId.fulfilled ,(state , action) => {
      state.all_exam_lesson_loading = false;
      state.all_exam_lessons_list = action.payload
    })
    .addCase(handleGetAllExamByLessonId.rejected ,(state) => {
      state.all_exam_lesson_loading = false;
    })

    
     .addCase(handleGetAllStudentExamScore.pending ,(state) => {
      state.student_exam_score_loading = true;
    })
    .addCase(handleGetAllStudentExamScore.fulfilled ,(state , action) => {
      state.student_exam_score_loading = false;
      state.student_exam_score_list = action.payload
    })
    .addCase(handleGetAllStudentExamScore.rejected ,(state) => {
      state.student_exam_score_loading = false;
    })
  }
})

export default examSlice.reducer;