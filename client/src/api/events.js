import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const fetchEvents = async (filter) => {
  const response = await axios.get(`${API_URL}/events`, { params: filter });
  return response.data;
};

export const fetchEventById = async (id) => {
  const response = await axios.get(`${API_URL}/events/${id}`);
  return response.data;
};

export const createEvent = async (eventData) => {
  const formData = new FormData();
  for (const key in eventData) {
    formData.append(key, eventData[key]);
  }
  const response = await axios.post(`${API_URL}/events`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};
