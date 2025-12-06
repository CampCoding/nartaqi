import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../shared/api";
import { apiRoutes } from "../shared/routes";

const initialState =  {
    faq_list : [],
    faq_loading : false,

    add_faq_loading :  false,
    edit_faq_loading : false,
    show_hide_faq_loading:  false,
}

export const handleGetAllFaqs = createAsyncThunk("faqSlice/handleGetAllFaqs",async() => {
    const response = await api.get(apiRoutes.getFaqs);
    return response ;
})

export const handleAddFaq  = createAsyncThunk("faqSlice/handleAddFaq",async({body}) => {
   const response = await api.post(apiRoutes.add_faq , {body});
   return response;
})


export const handleEditFaq  = createAsyncThunk("faqSlice/handleEditFaq",async({body}) => {
    const response = await api.post(apiRoutes.edit_faq , {body});
    return response;
 })


 export const handleShowHideFaq  = createAsyncThunk("faqSlice/handleShowHideFaq",async({body}) => {
    const response = await api.post(apiRoutes.show_hide_faq , {body});
    return response;
 })
 

 
export const faqSlice = createSlice({
    name:"faqSlice",
    initialState,
    extraReducers : (builder) => {
        builder
        .addCase(handleGetAllFaqs.pending ,(state) => {
            state.faq_loading = true;
        })
        .addCase(handleGetAllFaqs.fulfilled ,(state , action) => {
            state.faq_loading = false;
            state.faq_list = action.payload;
        })
        .addCase(handleGetAllFaqs.rejected , (state) => {
            state.faq_loading = false
        })
        .addCase(handleAddFaq.pending ,(state) => {
            state.add_faq_loading = true;
        })
        .addCase(handleAddFaq.fulfilled ,(state , action) => {
            state.add_faq_loading = false;
        })
        .addCase(handleAddFaq.rejected , (state) => {
            state.add_faq_loading = false
        })
        .addCase(handleEditFaq.pending ,(state) => {
            state.edit_faq_loading = true;
        })
        .addCase(handleEditFaq.fulfilled ,(state , action) => {
            state.edit_faq_loading = false;
        })
        .addCase(handleEditFaq.rejected , (state) => {
            state.edit_faq_loading = false
        })
        .addCase(handleShowHideFaq.pending ,(state) => {
            state.show_hide_faq_loading = true;
        })
        .addCase(handleShowHideFaq.fulfilled ,(state , action) => {
            state.show_hide_faq_loading = false;
        })
        .addCase(handleShowHideFaq.rejected , (state) => {
            state.show_hide_faq_loading = false
        })
    }
})

export default faqSlice.reducer;