import { useState, useEffect, useRef } from 'react'
import { useSocket } from '../../context/SocketContext'
import { useAuth } from '../../context/AuthContext'
import axios from 'axios'

function NotificationBell() {
  const [showDropdown, setShowDropdown] = useState(false)
  const [notifications, setNotifications] = useState([])
  const { unreadCount, setUnreadCount } = useSocket()
  const { API_URL } = useAuth()
  const dropdownRef = useRef(null)

  useEffect(() => {
    fetchNotifications()
    
    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(`${API_URL}/notifications`)
      setNotifications(response.data.data)
      setUnreadCount(response.data.unreadCount)
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
    }
  }

  const markAsRead = async (id) => {
    try {
      await axios.put(`${API_URL}/notifications/${id}/read`)
      setNotifications(prev =>
        prev.map(n => n._id === id ? { ...n, read: true } : n)
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (error) {
      console.error('Failed to mark as read:', error)
    }
  }

  const markAllAsRead = async () => {
    try {
      await axios.put(`${API_URL}/notifications/read-all`)
      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
      setUnreadCount(0)
    } catch (error) {
      console.error('Failed to mark all as read:', error)
    }
  }

  const deleteNotification = async (id) => {
    try {
      await axios.delete(`${API_URL}/notifications/${id}`)
      setNotifications(prev => prev.filter(n => n._id !== id))
    } catch (error) {
      console.error('Failed to delete notification:', error)
    }
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'doubt_submitted': return '📚'
      case 'doubt_response': return '💬'
      case 'status_update': return '✅'
      case 'new_message': return '💭'
      case 'feedback_received': return '⭐'
      default: return '🔔'
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Icon */}
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 rounded-lg hover:bg-gray-800 transition-all"
      >
        <span className="text-2xl">🔔</span>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {showDropdown && (
        <div
          className="absolute right-0 mt-2 w-96 glass rounded-xl shadow-2xl z-50 max-h-96 overflow-y-auto"
          style={{ borderColor: '#2A2A2A' }}
        >
          {/* Header */}
          <div className="p-4 border-b flex justify-between items-center" style={{ borderColor: '#2A2A2A' }}>
            <h3 className="text-lg font-bold text-white">Notifications</h3>
            {notifications.length > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-purple-400 hover:text-purple-300"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="divide-y" style={{ borderColor: '#2A2A2A' }}>
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                <p className="text-4xl mb-2">🔕</p>
                <p>No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`p-4 hover:bg-gray-800/50 transition-all cursor-pointer ${
                    !notification.read ? 'bg-purple-500/10' : ''
                  }`}
                  onClick={() => !notification.read && markAsRead(notification._id)}
                >
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">{getNotificationIcon(notification.type)}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white">
                        {notification.title}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteNotification(notification._id)
                      }}
                      className="text-gray-500 hover:text-red-400 text-sm"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default NotificationBell