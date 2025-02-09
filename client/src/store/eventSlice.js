import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { fetchEvents, fetchEventById, createEvent as apiCreateEvent, attendEvent as apiAttendEvent, unattendEvent as apiUnattendEvent, apiUpdateEvent } from "../api/events"

export const getEvents = createAsyncThunk("events/getEvents", async (filter) => {
  const response = await fetchEvents(filter)
  return response
})

export const getEventById = createAsyncThunk("events/getEventById", async (id) => {
  const response = await fetchEventById(id)
  return response
})

export const createEvent = createAsyncThunk(
  "events/createEvent",
  async (eventData, { rejectWithValue }) => {
    try {
      const response = await apiCreateEvent(eventData);
      return response;
    } catch (error) {
      if (error.response?.status === 401) {
        window.location.href = '/login';
      }
      return rejectWithValue(error.response?.data?.error || 'Failed to create event');
    }
  }
);

export const attendEvent = createAsyncThunk(
  "events/attendEvent",
  async (eventId, { rejectWithValue }) => {
    try {
      const response = await apiAttendEvent(eventId);
      return response;
    } catch (error) {
      if (error.response?.status === 401) {
        window.location.href = '/login';
      }
      return rejectWithValue(
        error.response?.data?.error || 
        error.message || 
        'Failed to attend event'
      );
    }
  }
);

export const unattendEvent = createAsyncThunk(
  "events/unattendEvent",
  async (eventId, { rejectWithValue }) => {
    try {
      const response = await apiUnattendEvent(eventId);
      return response;
    } catch (error) {
      if (error.response?.status === 401) {
        window.location.href = '/login';
      }
      return rejectWithValue(
        error.response?.data?.error || 
        error.message || 
        'Failed to leave event'
      );
    }
  }
);

export const updateEvent = createAsyncThunk(
  "events/updateEvent",
  async ({ id, ...eventData }, { rejectWithValue }) => {
    try {
      const response = await apiUpdateEvent(id, eventData)
      return response
    } catch (error) {
      if (error.response?.status === 401) {
        window.location.href = '/login'
      }
      return rejectWithValue(error.response?.data?.error || 'Failed to update event')
    }
  }
)

const eventSlice = createSlice({
  name: "events",
  initialState: {
    list: [],
    currentEvent: null,
    status: "idle",
    error: null,
  },
  reducers: {
    updateEventAttendees: (state, action) => {
      const { eventId, attendees } = action.payload;
      // Update current event if it matches
      if (state.currentEvent && state.currentEvent._id === eventId) {
        state.currentEvent.attendees = attendees;
      }
      // Update event in list if it exists
      const eventInList = state.list.find(e => e._id === eventId);
      if (eventInList) {
        eventInList.attendees = attendees;
      }
    }
  },
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
      .addCase(attendEvent.fulfilled, (state, action) => {
        state.currentEvent = action.payload
        state.status = "succeeded"
      })
      .addCase(attendEvent.pending, (state) => {
        state.status = "loading"
      })
      .addCase(attendEvent.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload
      })
      .addCase(unattendEvent.fulfilled, (state, action) => {
        state.currentEvent = action.payload
        state.status = "succeeded"
      })
      .addCase(unattendEvent.pending, (state) => {
        state.status = "loading"
      })
      .addCase(unattendEvent.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        // Update in list
        const index = state.list.findIndex(e => e._id === action.payload._id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
        // Update current event if it matches
        if (state.currentEvent?._id === action.payload._id) {
          state.currentEvent = action.payload;
        }
        state.status = "succeeded";
      })
      .addCase(updateEvent.pending, (state) => {
        state.status = "loading"
      })
      .addCase(updateEvent.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload
      })
  },
})

export const { updateEventAttendees } = eventSlice.actions
export default eventSlice.reducer

