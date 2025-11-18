import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../shared/api";
import { apiRoutes } from "../shared/routes";

const initialState = {
    marketers_list : [],
    marketers_loading : false,

    generate_code_loading : false,
    generate_code_list : []
}

export const handleGetAllMarketers = createAsyncThunk("marketersSlice/handleGetAllMarketers",async() => {
    const response = await api.get(apiRoutes.get_marketeres) ;
    return response
})

export const handleGenerateMarketersCode  = createAsyncThunk("marketersSlice/handleGenerateMarketersCode", async({body}) =>{
    const response = await api.post(apiRoutes.generate_code , {body});
    return response;
})

export const marketersSlice = createSlice({
    name:"marketersSlice",
    initialState,
    extraReducers :(builder) => {
        builder
        .addCase(handleGetAllMarketers.pending ,(state) => {
            state.marketers_loading = true;
        })
        .addCase(handleGetAllMarketers.fulfilled ,(state, action) => {
            state.marketers_loading = false;
            state.marketers_list = action.payload
        })
        .addCase(handleGetAllMarketers.rejected ,(state) => {
            state.marketers_loading = false;
        })

        .addCase(handleGenerateMarketersCode.pending ,(state) => {
            state.generate_code_loading = true;
        })
        .addCase(handleGenerateMarketersCode.fulfilled ,(state, action) => {
            state.generate_code_loading = false;
        })
        .addCase(handleGenerateMarketersCode.rejected ,(state) => {
            state.generate_code_loading = false;
        })
    }
})

export default marketersSlice.reducer;