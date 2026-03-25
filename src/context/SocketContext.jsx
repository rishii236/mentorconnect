import { createContext, useContext, useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { useAuth } from './AuthContext'
import { toast } from 'react-toastify'

const SocketContext = createContext()

export const useSocket = () => {
  const context = useContext(SocketContext)
  if (!context) {
    throw new Error('useSocket must be used within SocketProvider')
  }
  return context
}

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const { user, token } = useAuth()

  useEffect(() => {
    if (user && token) {
      // Connect to Socket.io server
      const newSocket = io('http://localhost:5000', {
        transports: ['websocket'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000
      })

      newSocket.on('connect', () => {
        console.log('✅ Socket connected:', newSocket.id)
        // Join with user ID
        newSocket.emit('join', user._id)
      })

      newSocket.on('disconnect', () => {
        console.log('❌ Socket disconnected')
      })

      // Listen for notifications
      newSocket.on('notification', (notification) => {
        console.log('🔔 New notification:', notification)
        setNotifications(prev => [notification, ...prev])
        setUnreadCount(prev => prev + 1)
        
        // Show toast notification
        toast.info(notification.title, {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        })
      })

      setSocket(newSocket)

      return () => {
        newSocket.disconnect()
      }
    }
  }, [user, token])

  const sendMessage = (receiverId, message, senderId, senderName) => {
    if (socket) {
      socket.emit('send_message', {
        receiverId,
        message,
        senderId,
        senderName
      })
    }
  }

  const emitTyping = (receiverId, isTyping, senderName) => {
    if (socket) {
      socket.emit('typing', {
        receiverId,
        isTyping,
        senderName
      })
    }
  }

  const value = {
    socket,
    notifications,
    unreadCount,
    setUnreadCount,
    sendMessage,
    emitTyping
  }

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  )
}