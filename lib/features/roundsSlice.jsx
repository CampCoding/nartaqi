import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../shared/api";
import { apiRoutes } from "../shared/routes";

const initialState = {
  rounds_list: [],
  rounds_loading: false,

  source_round_list : [],
  source_round_loading : false,

  add_round_loading: false,
  edit_round_loading: false,
  active_round_loading : false,
  copy_round_loading : false,
  delet_round_loading :false,

  round_resources_list : [],
  round_resources_loading : false,

  all_round_lessons:[],
  all_round_lessons_loading : false,

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

export const handleGetSourceRound = createAsyncThunk(
  "roundesSlice/handleGetSourceRound",
  async ({ page, per_page } = {}) => {
    // لو بعت page و per_page استخدمهم في الكويري
    if (page && per_page) {
      const response = await api.get(
        `${apiRoutes.get_source_rounds}?page=${page}&per_page=${per_page}`
      );
      return response;
    }

    // لو مبعتهمش خالص أو ناقصين هيرجع الداتا الديفولت من غير pagination params
    const response = await api.get(apiRoutes.get_source_rounds);
    return response;
  }
);

export const handleGetRoundLessons = createAsyncThunk("roundesSlice/handleGetRoundLessons",async({body}) => {
  const response = await api.post(`admin/contents/lessons/get_all_lessons`, {body}) ;
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

export const handleEditBaiskRound = createAsyncThunk(
  "roundesSlice/handleEditBaiskRound",
  async ({ body }) => {
    const response = await api.post(apiRoutes.edit_basic_round, {
      body,
      isFile: true,
    });
    return response;
  }
);

export const handleActiveRound = createAsyncThunk("roundesSlice/handleActiveRound",async({body}) =>{
  const response = await api.post(apiRoutes.active_round , {body , isFile: true});
  return response;
})


export const handleCopyRound=  createAsyncThunk("roundesSlice/handleCopyRound",async({body}) => {
  const response = await api.post(apiRoutes.copy_round , {body});
  return response;
})

export const handleDeleteRound = createAsyncThunk("roundesSlice/handleDeleteRound",async({body}) => {
  const response = await api.post(apiRoutes.delete_round, {body});
  return response;
})

export const handleGetRoundResources = createAsyncThunk("roundesSlice/handleGetRoundResources",async({body}) => {
  const response = await api.post(apiRoutes.get_resources ,{body});
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
      })

      .addCase(handleCopyRound.pending, (state) => {
        state.copy_round_loading = true;
      })
      .addCase(handleCopyRound.fulfilled, (state, action) => {
        state.copy_round_loading = false;
      })
      .addCase(handleCopyRound.rejected, (state) => {
        state.copy_round_loading = false;
      })

      .addCase(handleDeleteRound.pending, (state) => {
        state.delet_round_loading = true;
      })
      .addCase(handleDeleteRound.fulfilled, (state, action) => {
        state.delet_round_loading = false;
      })
      .addCase(handleDeleteRound.rejected, (state) => {
        state.delet_round_loading = false;
      })

      .addCase(handleGetRoundLessons.pending, (state) => {
        state.all_round_lessons_loading = true;
      })
      .addCase(handleGetRoundLessons.fulfilled, (state, action) => {
        state.all_round_lessons_loading = false;
        state.all_round_lessons = action.payload
      })
      .addCase(handleGetRoundLessons.rejected, (state) => {
        state.all_round_lessons_loading = false;
      })

       .addCase(handleEditBaiskRound.pending, (state) => {
        state.edit_round_loading = true;
      })
      .addCase(handleEditBaiskRound.fulfilled, (state, action) => {
        state.edit_round_loading = false;
      })
      .addCase(handleEditBaiskRound.rejected, (state) => {
        state.edit_round_loading = false;
      })
  },
});

export default roundsSlice.reducer;
