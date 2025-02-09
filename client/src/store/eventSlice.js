import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { fetchEvents, fetchEventById, createEvent as apiCreateEvent } from "../api/events"

export const getEvents = createAsyncThunk("events/getEvents", async (filter) => {
  const response = await fetchEvents(filter)
  return response
})

export const getEventById = createAsyncThunk("events/getEventById", async (id) => {
  const response = await fetchEventById(id)
  return response
})

export const createEvent = createAsyncThunk("events/createEvent", async (eventData) => {
  const response = await apiCreateEvent(eventData)
  return response
})

const eventSlice = createSlice({
  name: "events",
  initialState: {
    list: [],
    currentEvent: null,
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getEvents.pending, (state) => {
        state.status = "loading"
      })
      .addCase(getEvents.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.list = action.payload
      })
      .addCase(getEvents.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message
      })
      .addCase(getEventById.pending, (state) => {
        state.status = "loading"
      })
      .addCase(getEventById.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.currentEvent = action.payload
      })
      .addCase(getEventById.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.list.push(action.payload)
      })
  },
})

export default eventSlice.reducer

