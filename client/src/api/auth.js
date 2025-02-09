import { axiosInstance } from './config'

export const loginUser = async (credentials) => {
  const response = await axiosInstance.post('/api/auth/login', credentials)
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  return response.data;
}

export const registerUser = async (userData) => {
  const response = await axiosInstance.post('/api/auth/register', userData)
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  return response.data;
}

export const logoutUser = async () => {
  try {
    const response = await axiosInstance.post('/api/auth/logout')
    return response.data
  } finally {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
}

export const getCurrentUser = async () => {
  const response = await axiosInstance.get('/api/auth/me')
  return response.data
}
