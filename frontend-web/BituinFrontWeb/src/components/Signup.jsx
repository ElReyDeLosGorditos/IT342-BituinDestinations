import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

function Signup() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [showPopup, setShowPopup] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    try {
      // Send registration request to backend
      const response = await axios.post('https://it342-bituindestinations-qrwd.onrender.com/user/save', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: "USER"
      })

      if (response.data) {
        // Show success popup
        setShowPopup(true)
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate('/login')
        }, 2000)
      }
    } catch (error) {
      console.error('Signup error:', error)
      setError(error.response?.data?.message || 'Registration failed. Please try again.')
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="h-screen w-full fixed top-0 left-0 bg-cover bg-center bg-fixed" style={{ backgroundImage: 'url(/images/signup.jpg)' }}>
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="h-full w-full overflow-y-auto pt-20">
        <div className="max-w-7xl mx-auto px-8 py-16 relative z-10">
          {showPopup && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
                <div className="text-center">
                  <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                    <svg className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Registration Successful!</h3>
                  <p className="text-lg text-gray-600">Redirecting you to login...</p>
                </div>
              </div>
            </div>
          )}
          <div className="max-w-md mx-auto bg-white bg-opacity-80 rounded-2xl shadow-xl overflow-hidden">
            <div className="p-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
                <p className="mt-4 text-lg text-gray-600">Join Bituin Destinations today</p>
              </div>

              {error && (
                <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-red-600">{error}</p>
                </div>
              )}

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="name" className="block text-lg font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="appearance-none block w-full px-6 py-3 border-2 border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg transition duration-300 ease-in-out"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-lg font-medium text-gray-700 mb-2">
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="appearance-none block w-full px-6 py-3 border-2 border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg transition duration-300 ease-in-out"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-lg font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="appearance-none block w-full px-6 py-3 border-2 border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg transition duration-300 ease-in-out"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="block text-lg font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    className="appearance-none block w-full px-6 py-3 border-2 border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg transition duration-300 ease-in-out"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <button
                    type="submit"
                    className="w-full flex justify-center py-4 px-6 border border-transparent rounded-xl shadow-xl text-lg font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-4 focus:ring-amber-500 focus:ring-opacity-50 transition duration-300 ease-in-out"
                  >
                    Create Account
                  </button>
                </div>
              </form>
              <div className="mt-8 text-center">
                <p className="text-lg text-gray-600">
                  Already have an account?{' '}
                  <Link to="/login" className="font-medium text-amber-600 hover:text-amber-700">
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signup
