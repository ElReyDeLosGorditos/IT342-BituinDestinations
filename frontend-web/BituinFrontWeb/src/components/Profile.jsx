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
        const response = await axios.get(`https://it342-bituindestinations-qrwd.onrender.com/user/getUserById?userId=${userId}`)
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
      const response = await axios.put(`https://it342-bituindestinations-qrwd.onrender.com/user/update/${user.userId}`, user)
      
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
      <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-stone-100 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="inline-block w-12 h-12 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin"></div>
            <p className="mt-3 text-stone-600">Loading profile...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-stone-100 pt-16">
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-8 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-emerald-100 mb-4">
                <svg className="h-10 w-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-serif font-bold text-stone-900 mb-2">Password Updated!</h3>
              <p className="text-lg text-stone-600">{popupMessage}</p>
              <p className="text-sm text-stone-500 mt-4">Redirecting to login page...</p>
            </div>
          </div>
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm -z-10"></div>
        </div>
      )}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-stone-800 mb-4">
            Your Profile
          </h1>
          <p className="text-stone-600 text-lg max-w-3xl mx-auto">
            Manage your account information and preferences
          </p>
        </div>

        <div className="max-w-lg mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
            <div className="p-8">
              {message.text && (
                <div className={`mb-8 p-4 rounded-lg ${
                  message.type === 'error' 
                    ? 'bg-red-100 text-red-700 border-l-4 border-red-500' 
                    : 'bg-emerald-100 text-emerald-700 border-l-4 border-emerald-500'
                }`}>
                  <p className="font-medium">{message.text}</p>
                </div>
              )}

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-stone-700 mb-1">Full Name</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="w-full px-4 py-3 border-0 bg-stone-50 rounded-lg focus:ring-2 focus:ring-amber-300 transition-all"
                    placeholder="Enter your full name"
                    value={user.name || ''}
                    onChange={handleChange}
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-1">Email address</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="w-full px-4 py-3 border-0 bg-stone-50 rounded-lg focus:ring-2 focus:ring-amber-300 transition-all"
                    placeholder="Enter your email"
                    value={user.email || ''}
                    onChange={handleChange}
                    disabled
                  />
                  <p className="mt-2 text-xs text-stone-500">Email cannot be changed</p>
                </div>
                
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-stone-700 mb-1">New Password</label>
                  <input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    className="w-full px-4 py-3 border-0 bg-stone-50 rounded-lg focus:ring-2 focus:ring-amber-300 transition-all"
                    placeholder="Enter new password (leave blank to keep current)"
                    value={newPassword}
                    onChange={handlePasswordChange}
                  />
                </div>
                
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-stone-700 mb-1">Confirm New Password</label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    className="w-full px-4 py-3 border-0 bg-stone-50 rounded-lg focus:ring-2 focus:ring-amber-300 transition-all"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                  />
                </div>

                <div>
                  <button
                    type="submit"
                    className="w-full flex justify-center py-3 px-6 rounded-lg shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors"
                  >
                    Update Profile
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
