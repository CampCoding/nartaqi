import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../shared/api";
import { apiRoutes } from "../shared/routes";

const initialState = {
  rounds_list: [],
  rounds_loading: false,

  source_round_list : [],
  source_round_loading : false,

  add_round_loading: false,
  active_round_loading : false,
};

export const handleGetAllRounds = createAsyncThunk(
  "roundesSlice/handleGetAllRounds",
  async ({ course_category_id, per_page, page }) => {
    const response = await api.get(
      `${apiRoutes.get_rounds}?course_category_id=${course_category_id}&per_page=${per_page}&page=${page}`
    );
    return response;
  }
);

export const handleGetSourceRound = createAsyncThunk("roundesSlice/handleGetSourceRound",async({page , per_page}) => {
    const response = await api.get(`${apiRoutes.get_source_rounds}?page=${page}&per_page=${per_page}`);
    return response;
})

export const handleAddBaiskRound = createAsyncThunk(
  "roundesSlice/handleAddBaiskRound",
  async ({ body }) => {
    const response = await api.post(apiRoutes.add_basic_round, {
      body,
      isFile: true,
    });
    return response;
  }
);

export const handleActiveRound = createAsyncThunk("roundesSlice/handleActiveRound",async({body}) =>{
  const response = await api.post(apiRoutes.active_round , {body});
  return response;
})



export const roundsSlice = createSlice({
  name: "roundesSlice",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(handleGetAllRounds.pending, (state) => {
        state.rounds_loading = true;
      })
      .addCase(handleGetAllRounds.fulfilled, (state, action) => {
        state.rounds_loading = false;
        state.rounds_list = action.payload;
      })
      .addCase(handleGetAllRounds.rejected, (state) => {
        state.rounds_loading = false;
      })

      .addCase(handleGetSourceRound.pending, (state) => {
        state.source_round_loading = true;
      })
      .addCase(handleGetSourceRound.fulfilled, (state, action) => {
        state.source_round_loading = false;
        state.source_round_list = action.payload;
      })
      .addCase(handleGetSourceRound.rejected, (state) => {
        state.source_round_loading = false;
      })

      .addCase(handleAddBaiskRound.pending, (state) => {
        state.add_round_loading = true;
      })
      .addCase(handleAddBaiskRound.fulfilled, (state, action) => {
        state.add_round_loading = false;
      })
      .addCase(handleAddBaiskRound.rejected, (state) => {
        state.add_round_loading = false;
      })

      .addCase(handleActiveRound.pending, (state) => {
        state.active_round_loading = true;
      })
      .addCase(handleActiveRound.fulfilled, (state, action) => {
        state.active_round_loading = false;
      })
      .addCase(handleActiveRound.rejected, (state) => {
        state.active_round_loading = false;
      });
  },
});

export default roundsSlice.reducer;
