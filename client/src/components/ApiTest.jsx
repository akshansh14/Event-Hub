import { useEffect, useState } from 'react';
import { axiosInstance } from '../api/config';

function ApiTest() {
  const [status, setStatus] = useState('Loading...');
  const [error, setError] = useState(null);

  useEffect(() => {
    const testConnection = async () => {
      try {
        // Try root endpoint first
        const rootResponse = await axiosInstance.get('/');
        console.log('Root response:', rootResponse.data);

        // Then try test endpoint
        const testResponse = await axiosInstance.get('/api/test');
        console.log('Test response:', testResponse.data);

        setStatus(`API Connected: ${testResponse.data.message}`);
      } catch (err) {
        console.error('API Test Error:', {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status
        });
        setError(`${err.message} - ${err.response?.data?.error || 'Unknown error'}`);
        setStatus('API Connection Failed');
      }
    };

    testConnection();
  }, []);

  return (
    <div className="fixed bottom-4 right-4 p-4 bg-gray-800 text-white rounded-lg shadow-lg">
      <h3 className="font-bold mb-2">API Status</h3>
      <p className="mb-2">{status}</p>
      {error && (
        <p className="text-red-400 text-sm">
          Error: {error}
        </p>
      )}
    </div>
  );
}

export default ApiTest; 