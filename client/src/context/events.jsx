import axiosInstance from '../utils/axios';

export const fetchEvents = async (filter = {}) => {
  const response = await axiosInstance.get('/events', { 
    params: filter
  });
  return response.data;
};

export const fetchEventById = async (id) => {
  const response = await axiosInstance.get(`/events/${id}`);
  return response.data;
};

export const createEvent = async (eventData) => {
  const formData = new FormData();
  
  // Add all event data to FormData
  Object.keys(eventData).forEach(key => {
    if (eventData[key] !== null && eventData[key] !== undefined) {
      if (key === 'date' && eventData.time) {
        // Combine date and time
        formData.append('date', `${eventData.date}T${eventData.time}`);
      } else if (key !== 'time') { // Skip the time field as it's combined with date
        formData.append(key, eventData[key]);
      }
    }
  });

  const response = await axiosInstance.post('/events', formData, {
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
