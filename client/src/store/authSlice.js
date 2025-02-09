import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { login as apiLogin, register as apiRegister, logout as apiLogout } from "../api/auth"

export const login = createAsyncThunk("auth/login", async ({ email, password }) => {
  const response = await apiLogin(email, password)
  localStorage.setItem("user", JSON.stringify(response))
  return response
})

export const register = createAsyncThunk("auth/register", async ({ name, email, password }) => {
  const response = await apiRegister(name, email, password)
  localStorage.setItem("user", JSON.stringify(response))
  return response
})

export const logout = createAsyncThunk("auth/logout", async () => {
  await apiLogout()
  localStorage.removeItem("user")
})

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: JSON.parse(localStorage.getItem("user")) || null,
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading"
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.user = action.payload
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message
      })
      .addCase(register.pending, (state) => {
        state.status = "loading"
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.user = action.payload
      })
      .addCase(register.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null
      })
  },
})

export default authSlice.reducer

