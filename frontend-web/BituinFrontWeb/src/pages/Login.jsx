import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check for error message in URL parameters (from failed OAuth login)
    const params = new URLSearchParams(location.search);
    const errorMsg = params.get('error');
    if (errorMsg) {
      setError(decodeURIComponent(errorMsg).replace(/_/g, ' '));
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Call the login API
      const response = await axios.post('http://localhost:8080/user/login', formData);

      if (response.data.status === 'success') {
        // Store login status
        localStorage.setItem('isLoggedIn', 'true');

        // Get user ID by email
        const userResponse = await axios.get(`http://localhost:8080/user/getAll`);
        const users = userResponse.data;
        const user = users.find(u => u.email === formData.email);

        if (user) {
          localStorage.setItem('userId', user.userId);
          localStorage.setItem('userName', user.name);
        }

        // Redirect to home page
        navigate('/home');
      } else {
        setError('Invalid email or password. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle Google login - use window.location.href for direct redirection
  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  };

  return (
      <div className="min-h-screen bg-cover bg-center relative" style={{ backgroundImage: 'url(images/login2.jpg)' }}>
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="max-w-7xl mx-auto px-8 py-16 relative z-10">
          <div className="max-w-md mx-auto bg-black bg-opacity-40 rounded-2xl shadow-xl overflow-hidden mt-32">
            <div className="p-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white">BituinDestinations</h2>
                <p className="mt-3 text-lg text-white">Sign in to your account</p>
              </div>

              {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-red-600">{error}</p>
                  </div>
              )}

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="email" className="block text-lg font-medium text-white mb-2">
                    Email address
                  </label>
                  <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className="appearance-none block w-full px-6 py-3 border-2 border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-lg font-medium text-white mb-2">
                    Password
                  </label>
                  <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      className="appearance-none block w-full px-6 py-3 border-2 border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                  />
                </div>

                <div>
                  <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex justify-center py-3 px-6 border border-transparent rounded-xl shadow-lg text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Signing in...' : 'Sign in'}
                  </button>
                </div>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-black bg-opacity-40 text-white">Or continue with</span>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                      onClick={handleGoogleLogin}
                      type="button"
                      className="w-full flex items-center justify-center py-3 px-6 border border-gray-300 rounded-xl shadow-md text-lg font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" width="24" height="24">
                      <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                        <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z" />
                        <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z" />
                        <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z" />
                        <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.349 C -9.084 40.129 -11.754 38.999 -14.754 38.999 C -19.444 38.999 -23.494 41.699 -25.464 45.619 L -21.484 48.709 C -20.534 45.859 -17.884 43.989 -14.754 43.989 Z" />
                      </g>
                    </svg>
                    Sign in with Google
                  </button>
                </div>
              </div>

              <div className="mt-8 text-center">
                <p className="text-white">
                  Don't have an account?{' '}
                  <Link to="/signup" className="font-medium text-blue-400 hover:text-blue-300">
                    Sign up
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}

export default Login;