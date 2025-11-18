import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../shared/api";
import { apiRoutes } from "../shared/routes";

const initialState = {
    team_list : [],
    team_loading : false,

    add_team_loading : false,
    edit_team_loading : false,
    show_hide_team_loading : false
}

export const handleGetAllTeams = createAsyncThunk("teamSlice/handleGetAllTeams",async() => {
    const response = await api.get(apiRoutes.getTeams);
    return response ;
})

export const handleAddTeamMember = createAsyncThunk("teamSlice/handleAddTeamMember",async({body}) => {
    const response = await api.post(apiRoutes.add_team , {body , isFile : true}) ;
    return response;
})

export const teamSlice = createSlice({
    name:"teamSlice",
    initialState,
    extraReducers:(builder) => {
        builder
        .addCase(handleGetAllTeams.pending , (state) => {
             state.team_loading = true;
        })
        .addCase(handleGetAllTeams.fulfilled , (state , action) => {
            state.team_loading = false;
            state.team_list = action.payload;
        })
        .addCase(handleGetAllTeams.rejected , (state ) => {
            state.team_loading = false;
        })
        .addCase(handleAddTeamMember.pending , (state) => {
            state.add_team_loading = true;
       })
       .addCase(handleAddTeamMember.fulfilled , (state , action) => {
           state.add_team_loading = false;
       })
       .addCase(handleAddTeamMember.rejected , (state ) => {
           state.add_team_loading = false;
       })
    }
})

export default teamSlice.reducer;