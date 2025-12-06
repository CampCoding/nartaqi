import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiRoutes } from "../shared/routes";
import { api } from "../shared/api";

const initialState = {
  loading : false,
  login_data : [],
}

export const handleSubmitLogin = createAsyncThunk("authSlice/handleLogin",async({body}) => {
  console.log(body);
  const response = await api.post(apiRoutes.login , {body});
  return response ;
})

export const authSlice = createSlice({
  name:"authSlice",
  initialState,
  extraReducers:(builder) => {
    builder
    .addCase(handleSubmitLogin.pending , (state) => {
      state.loading = true;
    })
    .addCase(handleSubmitLogin.fulfilled ,(state , action) => {
      state.loading = false;
      state.login_data = action.payload
    })
    .addCase(handleSubmitLogin.rejected ,(state) => {
      state.loading = false
    })
  }
})

export default authSlice.reducer;