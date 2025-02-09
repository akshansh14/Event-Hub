import { axiosInstance } from './config'

// Get all events
export const fetchEvents = async (filter = {}) => {
  const response = await axiosInstance.get('/api/events', { params: filter })
  return response.data
}

// Get single event
export const fetchEventById = async (id) => {
  const response = await axiosInstance.get(`/api/events/${id}`)
  return response.data
}

// Create event
export const createEvent = async (formData) => {
  const response = await axiosInstance.post('/api/events', formData)
  return response.data
}

// Update event
export const updateEvent = async (id, data) => {
  const response = await axiosInstance.put(`/api/events/${id}`, data)
  return response.data
}

// Delete event
export const deleteEvent = async (id) => {
  const response = await axiosInstance.delete(`/api/events/${id}`)
  return response.data
}

// Attend event
export const attendEvent = async (id) => {
  const response = await axiosInstance.post(`/api/events/${id}/attend`)
  return response.data
}

// Unattend event
export const unattendEvent = async (id) => {
  const response = await axiosInstance.post(`/api/events/${id}/unattend`)
  return response.data
}
