import { useEffect, useState } from 'react';
import { axiosInstance } from '../api/config';

function ApiTest() {
  const [status, setStatus] = useState('Loading...');
  const [error, setError] = useState(null);

  useEffect(() => {
    const testConnection = async () => {
      try {
        const response = await axiosInstance.get('/api/test');
        console.log('Test response:', response.data);
        setStatus(`API Connected: ${response.data.message}`);
      } catch (err) {
        console.error('API Test Error:', {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status
        });
        // Just log the error, don't show it in UI
        setStatus('Checking API connection...');
      }
    };

    testConnection();
  }, []);

  // Only show status when connected successfully
  if (status.includes('API Connected')) {
    return (
      <div className="fixed bottom-4 right-4 p-4 bg-gray-800 text-white rounded-lg shadow-lg">
        <h3 className="font-bold mb-2">API Status</h3>
        <p className="mb-2">{status}</p>
      </div>
    );
  }

  // Return null when not connected
  return null;
}

export default ApiTest; 