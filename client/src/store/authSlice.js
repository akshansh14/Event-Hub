import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { 
  loginUser as apiLogin, 
  registerUser as apiRegister, 
  logoutUser as apiLogout,
  getCurrentUser as apiGetCurrentUser
} from "../api/auth"
import socketService  from "../services/socketService"

export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      return await apiLogin(credentials)
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Login failed")
    }
  }
)

export const register = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      return await apiRegister(userData)
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Registration failed")
    }
  }
)

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await apiLogout()
      // Clear socket connection on logout
      socketService.disconnect()
      return null
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Logout failed")
    }
  }
)

export const getCurrentUser = createAsyncThunk(
  "auth/getCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      return await apiGetCurrentUser()
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Failed to get user")
    }
  }
)

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: JSON.parse(localStorage.getItem('user')) || null,
    status: "idle",
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading"
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.user = action.payload.user
        localStorage.setItem('user', JSON.stringify(action.payload.user))
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload
      })
      .addCase(register.pending, (state) => {
        state.status = "loading"
        state.error = null
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.user = action.payload.user
        localStorage.setItem('user', JSON.stringify(action.payload.user))
      })
      .addCase(register.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload
      })
      .addCase(logout.pending, (state) => {
        state.status = "loading"
      })
      .addCase(logout.fulfilled, (state) => {
        state.status = "idle"
        state.user = null
        state.error = null
        localStorage.removeItem('user')
        localStorage.removeItem('token')
      })
      .addCase(logout.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload
      })
      .addCase(getCurrentUser.pending, (state) => {
        state.status = "loading"
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.user = action.payload
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.status = "failed"
        state.user = null
      })
  },
})

export const { clearError } = authSlice.actions
export default authSlice.reducer

