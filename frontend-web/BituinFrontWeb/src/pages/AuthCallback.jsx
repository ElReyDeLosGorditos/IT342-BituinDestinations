import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

function AuthCallback() {
  const navigate = useNavigate();
  const location = useLocation();

// Modified part of src/pages/AuthCallback.jsx - update the useEffect

  useEffect(() => {
    // Extract token and user info from URL parameters
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const userId = params.get('userId');
    const name = params.get('name');

    if (token && userId) {
      // Store authentication data in localStorage
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userId', userId);
      localStorage.setItem('userName', name);
      localStorage.setItem('token', token);

      // Set Authorization header for future API requests
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }

      // Fetch user role
      const fetchUserRole = async () => {
        try {
          const response = await axios.get(`http://localhost:8080/user/getUserById?userId=${userId}`);
          if (response.data && response.data.role) {
            localStorage.setItem('userRole', response.data.role);

            // Redirect based on role
            if (response.data.role === 'ADMIN') {
              navigate('/admin');
            } else {
              navigate('/home');
            }
          } else {
            navigate('/home'); // Default to home if role not found
          }
        } catch (error) {
          console.error('Failed to fetch user role:', error);
          navigate('/home'); // Default to home on error
        }
      };

      fetchUserRole();
    } else {
      // Handle authentication error
      console.error('Authentication failed: Missing token or user ID');
      navigate('/login', { state: { error: 'Authentication failed. Please try again.' } });
    }
  }, [location, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        <h2 className="mt-4 text-xl font-semibold text-gray-700">Completing authentication...</h2>
        <p className="mt-2 text-gray-500">Please wait while we log you in.</p>
      </div>
    </div>
  );
}

export default AuthCallback;
