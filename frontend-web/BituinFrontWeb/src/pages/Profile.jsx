import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function Profile() {
  const navigate = useNavigate()
  const [user, setUser] = useState({
    userId: '',
    name: '',
    email: '',
    password: ''
  })
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState({ text: '', type: '' })
  const [loading, setLoading] = useState(true)
  const [showPopup, setShowPopup] = useState(false)
  const [popupMessage, setPopupMessage] = useState('')

  useEffect(() => {
    const userId = localStorage.getItem('userId')
    if (!userId) {
      navigate('/login')
      return
    }

    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/user/getUserById?userId=${userId}`)
        if (response.data) {
          setUser(response.data)
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
        setMessage({ text: 'Failed to load user data', type: 'error' })
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [navigate])

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value
    })
  }

  const handlePasswordChange = (e) => {
    setNewPassword(e.target.value)
  }

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage({ text: '', type: '' })

    if (newPassword) {
      if (newPassword !== confirmPassword) {
        setMessage({ text: 'Passwords do not match', type: 'error' })
        return
      }
      user.password = newPassword
    }

    try {
      const response = await axios.put(`http://localhost:8080/user/update/${user.userId}`, user)
      
      if (response.data) {
        setMessage({ text: 'Profile updated successfully!', type: 'success' })
        
        if (newPassword) {
          setPopupMessage('Your password has been updated successfully. You will be logged out for security reasons.')
          setShowPopup(true)
          
          setNewPassword('')
          setConfirmPassword('')
          
          setTimeout(() => {
            localStorage.removeItem('isLoggedIn')
            localStorage.removeItem('userId')
            navigate('/login')
          }, 3000)
        } else {
          setNewPassword('')
          setConfirmPassword('')
        }
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      setMessage({ text: 'Failed to update profile', type: 'error' })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="text-2xl text-gray-600">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-16 bg-gray-50">
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                <svg className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Password Updated!</h3>
              <p className="text-lg text-gray-600">{popupMessage}</p>
              <p className="text-sm text-gray-500 mt-4">Redirecting to login page...</p>
            </div>
          </div>
          <div className="fixed inset-0 bg-black bg-opacity-50 -z-10"></div>
        </div>
      )}
      
      <div className="max-w-7xl mx-auto px-8 py-16">
        <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Your Profile</h2>
              <p className="mt-4 text-xl text-gray-600">Manage your account information</p>
            </div>

            {message.text && (
              <div className={`mb-8 p-4 rounded-xl ${message.type === 'error' ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'}`}>
                <p className={message.type === 'error' ? 'text-red-600' : 'text-green-600'}>
                  {message.text}
                </p>
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name" className="block text-lg font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="appearance-none block w-full px-4 py-3 border-2 border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                  placeholder="Enter your full name"
                  value={user.name || ''}
                  onChange={handleChange}
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-lg font-medium text-gray-700 mb-2">Email address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="appearance-none block w-full px-4 py-3 border-2 border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                  placeholder="Enter your email"
                  value={user.email || ''}
                  onChange={handleChange}
                  disabled
                />
                <p className="mt-2 text-sm text-gray-500">Email cannot be changed</p>
              </div>
              
              <div>
                <label htmlFor="newPassword" className="block text-lg font-medium text-gray-700 mb-2">New Password</label>
                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  className="appearance-none block w-full px-4 py-3 border-2 border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                  placeholder="Enter new password (leave blank to keep current)"
                  value={newPassword}
                  onChange={handlePasswordChange}
                />
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-lg font-medium text-gray-700 mb-2">Confirm New Password</label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  className="appearance-none block w-full px-4 py-3 border-2 border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                />
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-3 px-6 border border-transparent rounded-xl shadow-lg text-lg font-medium text-white bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Update Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
