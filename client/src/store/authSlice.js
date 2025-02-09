import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { login as apiLogin, register as apiRegister, logout as apiLogout } from "../api/auth"
import socketService  from "../services/socketService"

export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await apiLogin(credentials.email, credentials.password)
      return response
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Login failed')
    }
  }
)

export const register = createAsyncThunk("auth/register", async (userData) => {
  const response = await apiRegister(userData.name, userData.email, userData.password)
  return response
})

export const logout = createAsyncThunk("auth/logout", async () => {
  await apiLogout()
  // Clear socket connection on logout
  socketService.disconnect()
})

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: JSON.parse(localStorage.getItem('user')) || null,
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
        state.user = action.payload.user
        localStorage.setItem('user', JSON.stringify(action.payload.user))
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
        state.user = action.payload.user
        localStorage.setItem('user', JSON.stringify(action.payload.user))
      })
      .addCase(register.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null
        state.status = "idle"
        state.error = null
        localStorage.removeItem('user')
        localStorage.removeItem('token')
      })
      .addCase(logout.rejected, (state) => {
        state.user = null
        state.status = "idle"
        state.error = null
        localStorage.removeItem('user')
        localStorage.removeItem('token')
      })
  },
})

export default authSlice.reducer

