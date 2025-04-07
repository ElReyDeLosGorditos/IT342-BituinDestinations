import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

function Login() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      // Call the login API
      const response = await axios.post('http://localhost:8080/user/login', formData)

      if (response.data.status === 'success') {
        // Store login status
        localStorage.setItem('isLoggedIn', 'true')

        // Get user ID by email
        const userResponse = await axios.get(`http://localhost:8080/user/getAll`)
        const users = userResponse.data
        const user = users.find(u => u.email === formData.email)

        if (user) {
          localStorage.setItem('userId', user.userId)
        }

        // Redirect to home page
        navigate('/home')
      } else {
        setError('Invalid email or password. Please try again.')
      }
    } catch (error) {
      console.error('Login error:', error)
      setError(error.response?.data?.message || 'Invalid email or password. Please try again.')
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen bg-cover bg-center relative" style={{ backgroundImage: 'url(images/login2.jpg)' }}>
      <div className="absolute inset-0 bg-black opacity-50"></div> {/* Overlay for darker effect */}
      <div className="max-w-7xl mx-auto px-8 py-16 relative z-10">
        {/* Added margin-top to avoid touching the navbar */}
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
                  className="w-full flex justify-center py-3 px-6 border border-transparent rounded-xl shadow-lg text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Sign in
                </button>
              </div>
            </form>
            <div className="mt-4 text-center">
              <p className="text-lg text-white">
                Don't have an account?{' '}
                <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
