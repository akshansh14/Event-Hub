import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const login = async (email, password) => {
  const response = await axios.post(`${API_URL}/auth/login`, { email, password });
  return response.data;
};

export const register = async (name, email, password) => {
  const response = await axios.post(`${API_URL}/auth/register`, { name, email, password });
  return response.data;
};

export const logout = async () => {
  await axios.post(`${API_URL}/auth/logout`);
};
