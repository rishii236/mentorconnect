import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import axios from 'axios'
import { toast } from 'react-toastify'

function SettingsModal({ isOpen, onClose }) {
  const { user, logout, API_URL } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
  const [loading, setLoading] = useState(false)

  // Profile Form
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    bio: '',
    expertise: '',
    class: '',
    course: ''
  })

  // Password Form
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    doubtUpdates: true,
    appointmentReminders: true,
    feedbackAlerts: true
  })

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        bio: user.bio || '',
        expertise: user.expertise || '',
        class: user.class || '',
        course: user.course || ''
      })
    }
  }, [user])

  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const token = localStorage.getItem('token')
      const response = await axios.put(`${API_URL}/api/auth/update-profile`, profileData, {
        headers: { Authorization: `Bearer ${token}` }
      })

      toast.success('Profile updated successfully! ✓')
      
      // Update user in context (you might need to add this to AuthContext)
      window.location.reload() // Temporary solution
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match!')
      return
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    try {
      const token = localStorage.getItem('token')
      await axios.put(`${API_URL}/api/auth/change-password`, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })

      toast.success('Password changed successfully! 🔒')
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleNotificationToggle = (key) => {
    setNotificationSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
    // TODO: Save to backend
    toast.success('Notification settings updated!')
  }

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      '⚠️ Are you absolutely sure? This action CANNOT be undone. All your data will be permanently deleted.'
    )

    if (!confirmed) return

    const doubleConfirmed = window.confirm(
      '⚠️ FINAL WARNING: This will delete your account forever. Type "DELETE" to confirm.'
    )

    if (!doubleConfirmed) return

    try {
      const token = localStorage.getItem('token')
      await axios.delete(`${API_URL}/api/auth/delete-account`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      toast.success('Account deleted successfully')
      logout()
    } catch (error) {
      toast.error('Failed to delete account')
      console.error(error)
    }
  }

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  if (isOpen === false) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
      onClick={handleBackdropClick}
    >
      <div 
        className="glass rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold gradient-text">⚙️ Settings</h2>
              <p className="text-gray-400 text-sm mt-1">Manage your account preferences</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg p-2 transition-all"
              aria-label="Close settings"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar Tabs */}
          <div className="w-48 border-r border-gray-800 p-4 overflow-y-auto">
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all ${
                  activeTab === 'profile'
                    ? 'gradient-bg text-white'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                👤 Profile
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all ${
                  activeTab === 'security'
                    ? 'gradient-bg text-white'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                🔒 Security
              </button>
              <button
                onClick={() => setActiveTab('notifications')}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all ${
                  activeTab === 'notifications'
                    ? 'gradient-bg text-white'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                🔔 Notifications
              </button>
              <button
                onClick={() => setActiveTab('account')}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all ${
                  activeTab === 'account'
                    ? 'gradient-bg text-white'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                🗑️ Account
              </button>
            </nav>
          </div>

          {/* Content Area */}
          <div className="flex-1 p-6 overflow-y-auto">
            
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Profile Information</h3>
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      style={{ backgroundColor: '#2A2A2A', border: '1px solid #3A3A3A' }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Email</label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      style={{ backgroundColor: '#2A2A2A', border: '1px solid #3A3A3A' }}
                    />
                  </div>

                  {user?.role === 'student' && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-gray-300 mb-2">Class</label>
                          <input
                            type="text"
                            value={profileData.class}
                            onChange={(e) => setProfileData({ ...profileData, class: e.target.value })}
                            className="w-full px-4 py-3 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                            style={{ backgroundColor: '#2A2A2A', border: '1px solid #3A3A3A' }}
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-300 mb-2">Course</label>
                          <input
                            type="text"
                            value={profileData.course}
                            onChange={(e) => setProfileData({ ...profileData, course: e.target.value })}
                            className="w-full px-4 py-3 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                            style={{ backgroundColor: '#2A2A2A', border: '1px solid #3A3A3A' }}
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {user?.role === 'mentor' && (
                    <>
                      <div>
                        <label className="block text-sm text-gray-300 mb-2">Expertise</label>
                        <input
                          type="text"
                          value={profileData.expertise}
                          onChange={(e) => setProfileData({ ...profileData, expertise: e.target.value })}
                          placeholder="e.g., Digital Electronics, Physics"
                          className="w-full px-4 py-3 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                          style={{ backgroundColor: '#2A2A2A', border: '1px solid #3A3A3A' }}
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-300 mb-2">Bio</label>
                        <textarea
                          value={profileData.bio}
                          onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                          rows={4}
                          placeholder="Tell students about yourself..."
                          className="w-full px-4 py-3 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                          style={{ backgroundColor: '#2A2A2A', border: '1px solid #3A3A3A' }}
                        />
                      </div>
                    </>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-lg gradient-bg text-white font-semibold hover:glow-purple transition-all disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : '💾 Save Changes'}
                  </button>
                </form>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Change Password</h3>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Current Password</label>
                    <input
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      required
                      className="w-full px-4 py-3 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      style={{ backgroundColor: '#2A2A2A', border: '1px solid #3A3A3A' }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-2">New Password</label>
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      required
                      minLength={6}
                      className="w-full px-4 py-3 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      style={{ backgroundColor: '#2A2A2A', border: '1px solid #3A3A3A' }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Confirm New Password</label>
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      required
                      minLength={6}
                      className="w-full px-4 py-3 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      style={{ backgroundColor: '#2A2A2A', border: '1px solid #3A3A3A' }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-lg gradient-bg text-white font-semibold hover:glow-purple transition-all disabled:opacity-50"
                  >
                    {loading ? 'Changing...' : '🔒 Change Password'}
                  </button>
                </form>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Notification Preferences</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: '#1A1A1A' }}>
                    <div>
                      <p className="text-white font-medium">Email Notifications</p>
                      <p className="text-gray-400 text-sm">Receive updates via email</p>
                    </div>
                    <button
                      onClick={() => handleNotificationToggle('emailNotifications')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        notificationSettings.emailNotifications ? 'bg-purple-600' : 'bg-gray-700'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          notificationSettings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: '#1A1A1A' }}>
                    <div>
                      <p className="text-white font-medium">Doubt Updates</p>
                      <p className="text-gray-400 text-sm">Get notified when doubts are resolved</p>
                    </div>
                    <button
                      onClick={() => handleNotificationToggle('doubtUpdates')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        notificationSettings.doubtUpdates ? 'bg-purple-600' : 'bg-gray-700'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          notificationSettings.doubtUpdates ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: '#1A1A1A' }}>
                    <div>
                      <p className="text-white font-medium">Appointment Reminders</p>
                      <p className="text-gray-400 text-sm">Reminders before scheduled sessions</p>
                    </div>
                    <button
                      onClick={() => handleNotificationToggle('appointmentReminders')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        notificationSettings.appointmentReminders ? 'bg-purple-600' : 'bg-gray-700'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          notificationSettings.appointmentReminders ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: '#1A1A1A' }}>
                    <div>
                      <p className="text-white font-medium">Feedback Alerts</p>
                      <p className="text-gray-400 text-sm">Notifications for new feedback</p>
                    </div>
                    <button
                      onClick={() => handleNotificationToggle('feedbackAlerts')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        notificationSettings.feedbackAlerts ? 'bg-purple-600' : 'bg-gray-700'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          notificationSettings.feedbackAlerts ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Account Tab */}
            {activeTab === 'account' && (
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Account Management</h3>
                
                <div className="space-y-6">
                  <div className="p-6 rounded-lg" style={{ backgroundColor: '#1A1A1A' }}>
                    <h4 className="text-lg font-semibold text-white mb-2">Account Information</h4>
                    <div className="space-y-2 text-sm">
                      <p className="text-gray-400">
                        <span className="text-white font-medium">Role:</span> {user?.role}
                      </p>
                      <p className="text-gray-400">
                        <span className="text-white font-medium">Email:</span> {user?.email}
                      </p>
                      <p className="text-gray-400">
                        <span className="text-white font-medium">Member since:</span> {new Date(user?.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="p-6 rounded-lg border-2 border-red-500/30" style={{ backgroundColor: '#1A1A1A' }}>
                    <h4 className="text-lg font-semibold text-red-400 mb-2">⚠️ Danger Zone</h4>
                    <p className="text-gray-400 text-sm mb-4">
                      Once you delete your account, there is no going back. Please be certain.
                    </p>
                    <button
                      onClick={handleDeleteAccount}
                      className="px-6 py-3 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition-all"
                    >
                      🗑️ Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsModal