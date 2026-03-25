import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import NotificationBell from './NotificationBell'
import SettingsModal from './SettingsModal'

function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [showSettings, setShowSettings] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const getDashboardRoute = () => {
    if (user?.role === 'student') return '/student-dashboard'
    if (user?.role === 'mentor') return '/mentor-dashboard'
    if (user?.role === 'admin') return '/admin-dashboard'
    return '/'
  }

  return (
    <>
      <nav className="glass sticky top-0 z-50 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div 
              onClick={() => navigate(getDashboardRoute())}
              className="flex items-center cursor-pointer gap-3 hover:opacity-80 transition-opacity"
            >
              <img 
                src="/logo.png" 
                alt="MentorConnect Logo" 
                className="h-13 w-15"
              />
              <h1 className="text-2xl font-bold gradient-text">
                MentorConnect
              </h1>
            </div>

            {/* User Info & Actions */}
            <div className="flex items-center gap-4">
              {/* Notification Bell */}
              {(user?.role === 'student' || user?.role === 'mentor') && (
                <NotificationBell />
              )}

              {/* User Info */}
              <div className="hidden md:block text-right">
                <p className="text-white font-semibold text-sm">{user?.name}</p>
                <p className="text-gray-400 text-xs capitalize">{user?.role}</p>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all text-sm font-semibold border border-red-500/30"
              >
                Logout
              </button>

              {/* Settings Icon - MOVED TO FAR RIGHT! */}
              <button
                onClick={() => setShowSettings(true)}
                className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-all relative group"
                aria-label="Settings"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                {/* Tooltip */}
                <span className="absolute right-0 top-full mt-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Settings
                </span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Settings Modal */}
      <SettingsModal 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)} 
      />
    </>
  )
}

export default Navbar