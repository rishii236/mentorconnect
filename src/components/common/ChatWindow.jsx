import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useSocket } from '../../context/SocketContext'
import axios from 'axios'

function ChatWindow({ doubt, onClose }) {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [otherUserTyping, setOtherUserTyping] = useState(false)
  
  const { user, API_URL } = useAuth()
  const { socket, emitTyping } = useSocket()
  const messagesEndRef = useRef(null)
  const typingTimeoutRef = useRef(null)

  // Determine who we're chatting with
  const isStudent = user.role === 'student'
  const otherUser = isStudent ? doubt.mentor : doubt.student
  const otherUserId = otherUser?._id

  useEffect(() => {
    fetchMessages()
    
    // Listen for incoming messages
    if (socket) {
      socket.on('receive_message', (data) => {
        if (data.senderId === otherUserId) {
          setMessages(prev => [...prev, {
            sender: { _id: data.senderId, name: data.senderName },
            message: data.message,
            createdAt: data.timestamp
          }])
          // Mark as read
          markMessagesAsRead()
        }
      })

      socket.on('user_typing', (data) => {
        setOtherUserTyping(data.isTyping)
      })
    }

    return () => {
      if (socket) {
        socket.off('receive_message')
        socket.off('user_typing')
      }
    }
  }, [socket, otherUserId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const fetchMessages = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${API_URL}/api/chat/${doubt._id}`)
      setMessages(response.data.data)
      markMessagesAsRead()
    } catch (error) {
      console.error('Failed to fetch messages:', error)
    } finally {
      setLoading(false)
    }
  }

  const markMessagesAsRead = async () => {
    try {
      await axios.put(`${API_URL}/api/chat/${doubt._id}/read`)
    } catch (error) {
      console.error('Failed to mark messages as read:', error)
    }
  }

  const handleTyping = (e) => {
    setNewMessage(e.target.value)
    
    if (!isTyping) {
      setIsTyping(true)
      emitTyping(otherUserId, true, user.name)
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    // Set new timeout
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false)
      emitTyping(otherUserId, false, user.name)
    }, 1000)
  }

  const sendMessage = async (e) => {
    e.preventDefault()
    
    if (!newMessage.trim() || sending) return

    try {
      setSending(true)
      
      // Send via API (saves to database)
      const response = await axios.post(`${API_URL}/api/chat/${doubt._id}`, {
        message: newMessage
      })

      // Add to local state
      setMessages(prev => [...prev, response.data.data])

      // Send via Socket.io (real-time)
      if (socket) {
        socket.emit('send_message', {
          receiverId: otherUserId,
          message: newMessage,
          senderId: user._id,
          senderName: user.name
        })
      }

      setNewMessage('')
      setIsTyping(false)
      emitTyping(otherUserId, false, user.name)
    } catch (error) {
      console.error('Failed to send message:', error)
    } finally {
      setSending(false)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}>
      <div className="glass rounded-2xl w-full max-w-2xl h-[600px] flex flex-col">
        
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center" style={{ borderColor: '#2A2A2A' }}>
          <div>
            <h2 className="text-xl font-bold text-white">
              💬 Chat with {otherUser?.name}
            </h2>
            <p className="text-sm text-gray-400">
              {doubt.subject}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="spinner"></div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <p className="text-4xl mb-2">💭</p>
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            <>
              {messages.map((message, index) => {
                const isMine = message.sender._id === user._id
                return (
                  <div
                    key={index}
                    className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg ${
                        isMine
                          ? 'gradient-bg text-white'
                          : 'bg-gray-800 text-gray-200'
                      }`}
                    >
                      {!isMine && (
                        <p className="text-xs text-gray-400 mb-1">
                          {message.sender.name}
                        </p>
                      )}
                      <p className="text-sm">{message.message}</p>
                      <p className="text-xs mt-1 opacity-70">
                        {new Date(message.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                )
              })}
              <div ref={messagesEndRef} />
            </>
          )}

          {/* Typing Indicator */}
          {otherUserTyping && (
            <div className="flex items-center space-x-2 text-gray-400 text-sm">
              <div className="flex space-x-1">
                <span className="animate-bounce">•</span>
                <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>•</span>
                <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>•</span>
              </div>
              <span>{otherUser?.name} is typing...</span>
            </div>
          )}
        </div>

        {/* Input */}
        <form onSubmit={sendMessage} className="p-4 border-t" style={{ borderColor: '#2A2A2A' }}>
          <div className="flex space-x-3">
            <input
              type="text"
              value={newMessage}
              onChange={handleTyping}
              placeholder="Type your message..."
              className="flex-1 px-4 py-3 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              style={{ backgroundColor: '#2A2A2A', border: '1px solid #3A3A3A' }}
            />
            <button
              type="submit"
              disabled={!newMessage.trim() || sending}
              className="px-6 py-3 rounded-lg gradient-bg text-white font-semibold hover:glow-purple transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sending ? '...' : 'Send'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ChatWindow