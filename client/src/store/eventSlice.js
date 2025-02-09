import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { 
  fetchEvents, 
  fetchEventById, 
  createEvent as apiCreateEvent,
  attendEvent as apiAttendEvent, 
  unattendEvent as apiUnattendEvent,
  updateEvent as apiUpdateEvent,
  deleteEvent as apiDeleteEvent
} from "../api/events"

// Get all events
export const getEvents = createAsyncThunk(
  "events/getEvents",
  async (filter, { rejectWithValue }) => {
    try {
      return await fetchEvents(filter)
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch events')
    }
  }
)

// Get single event
export const getEventById = createAsyncThunk(
  "events/getEventById",
  async (id, { rejectWithValue }) => {
    try {
      return await fetchEventById(id)
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch event')
    }
  }
)

// Create event
export const createEvent = createAsyncThunk(
  "events/createEvent",
  async (eventData, { rejectWithValue }) => {
    try {
      return await apiCreateEvent(eventData)
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to create event')
    }
  }
)

// Update event
export const updateEvent = createAsyncThunk(
  "events/updateEvent",
  async ({ id, ...updateData }, { rejectWithValue }) => {
    try {
      return await apiUpdateEvent(id, updateData)
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update event')
    }
  }
)

// Delete event
export const deleteEvent = createAsyncThunk(
  "events/deleteEvent",
  async (id, { rejectWithValue }) => {
    try {
      return await apiDeleteEvent(id)
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to delete event')
    }
  }
)

// Attend event
export const attendEvent = createAsyncThunk(
  "events/attendEvent",
  async (eventId, { rejectWithValue }) => {
    try {
      return await apiAttendEvent(eventId)
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to attend event')
    }
  }
)

// Unattend event
export const unattendEvent = createAsyncThunk(
  "events/unattendEvent",
  async (eventId, { rejectWithValue }) => {
    try {
      return await apiUnattendEvent(eventId)
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to leave event')
    }
  }
)

const initialState = {
  list: [],
  currentEvent: null,
  status: "idle",
  error: null,
}

const eventSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    updateEventAttendees: (state, action) => {
      const { eventId, attendees } = action.payload
      if (state.currentEvent?._id === eventId) {
        state.currentEvent.attendees = attendees
      }
      const event = state.list.find(e => e._id === eventId)
      if (event) {
        event.attendees = attendees
      }
    },
    clearEventError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      // Get Events
      .addCase(getEvents.pending, (state) => {
        state.status = "loading"
        state.error = null
      })
      .addCase(getEvents.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.list = action.payload
      })
      .addCase(getEvents.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload
      })
      // Get Event By Id
      .addCase(getEventById.pending, (state) => {
        state.status = "loading"
        state.error = null
      })
      .addCase(getEventById.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.currentEvent = action.payload
      })
      .addCase(getEventById.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload
      })
      // Create Event
      .addCase(createEvent.pending, (state) => {
        state.status = "loading"
        state.error = null
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.list.push(action.payload)
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload
      })
      // Update Event
      .addCase(updateEvent.pending, (state) => {
        state.status = "loading"
        state.error = null
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        state.status = "succeeded"
        const index = state.list.findIndex(event => event._id === action.payload._id)
        if (index !== -1) {
          state.list[index] = action.payload
        }
        if (state.currentEvent?._id === action.payload._id) {
          state.currentEvent = action.payload
        }
      })
      .addCase(updateEvent.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload
      })
      // Attend/Unattend Event
      .addCase(attendEvent.fulfilled, (state, action) => {
        const event = state.list.find(e => e._id === action.payload._id)
        if (event) {
          event.attendees = action.payload.attendees
        }
        if (state.currentEvent?._id === action.payload._id) {
          state.currentEvent.attendees = action.payload.attendees
        }
      })
      .addCase(unattendEvent.fulfilled, (state, action) => {
        const event = state.list.find(e => e._id === action.payload._id)
        if (event) {
          event.attendees = action.payload.attendees
        }
        if (state.currentEvent?._id === action.payload._id) {
          state.currentEvent.attendees = action.payload.attendees
        }
      })
  },
})

export const { updateEventAttendees, clearEventError } = eventSlice.actions
export default eventSlice.reducer

