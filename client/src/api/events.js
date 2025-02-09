import axiosInstance from '../utils/axios';

export const fetchEvents = async (filter) => {
  const response = await axiosInstance.get('/events', { params: filter });
  return response.data;
};

export const fetchEventById = async (id) => {
  const response = await axiosInstance.get(`/events/${id}`);
  return response.data;
};

export const createEvent = async (eventData) => {
  const response = await axiosInstance.post('/events', eventData, {
    headers: { 
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

export const attendEvent = async (eventId) => {
  const response = await axiosInstance.post(`/events/${eventId}/attend`);
  return response.data;
};

export const cancelEvent = async (eventId) => {
  const response = await axiosInstance.delete(`/events/${eventId}`);
  return response.data;
};

export const unattendEvent = async (eventId) => {
  const response = await axiosInstance.post(`/events/${eventId}/unattend`);
  return response.data;
};

export const apiUpdateEvent = async (id, eventData) => {
  const response = await axiosInstance.put(`/events/${id}`, eventData);
  return response.data;
};
