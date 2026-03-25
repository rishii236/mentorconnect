import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'

function Chatbot() {
  const [chatState, setChatState] = useState('closed') // closed | welcome | messages | chat
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)
  const { user } = useAuth()

  // Initialize welcome message based on user role
  useEffect(() => {
    if (user) {
      const welcomeMessage = getWelcomeMessage()
      setMessages([{
        id: 1,
        type: 'bot',
        text: welcomeMessage,
        timestamp: new Date()
      }])
    }
  }, [user])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const getWelcomeMessage = () => {
    const role = user?.role || 'student'
    
    if (role === 'student') {
      return `Hi ${user?.name?.split(' ')[0]}! 👋\n\nWelcome to MentorConnect AI Assistant. I'm here to help you:\n\n• Find mentors\n• Submit doubts\n• Book appointments\n• Track your progress\n• Navigate the platform\n\nWhat would you like to know?`
    } else if (role === 'mentor') {
      return `Hi ${user?.name?.split(' ')[0]}! 👨‍🏫\n\nWelcome to Mentor AI Assistant. I can help you with:\n\n• Managing student doubts\n• Setting your calendar availability\n• Viewing student feedback\n• Understanding platform features\n\nHow can I assist you today?`
    } else if (role === 'admin') {
      return `Hi ${user?.name}! 👑\n\nWelcome to Admin AI Assistant. I'm here to help you:\n\n• View analytics & reports\n• Manage mentors\n• Monitor system health\n• Export data\n• Platform administration\n\nWhat do you need help with?`
    }
    
    return `Hi there! 👋 Welcome to MentorConnect AI Assistant!`
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      text: inputMessage,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsTyping(true)

    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        type: 'bot',
        text: generateAIResponse(inputMessage, user?.role),
        timestamp: new Date()
      }
      setMessages(prev => [...prev, botResponse])
      setIsTyping(false)
    }, 1500)
  }

  const generateAIResponse = (question, role = 'student') => {
    const lowerQuestion = question.toLowerCase()

    // STUDENT RESPONSES
    if (role === 'student') {
      if (lowerQuestion.includes('mentor') && (lowerQuestion.includes('find') || lowerQuestion.includes('available'))) {
        return "To find a mentor:\n\n1. Click on '🔍 Find Mentors' tab\n2. Browse available mentors by subject\n3. Click 'Ask a Doubt' to submit a question\n4. Or click 'Book Appointment' to schedule a session\n\nCurrently available mentors:\n💻 Sabiha - Digital Electronics\n🤖 Deepak - AI\n🎯 Vibhuti - OOPS\n💬 Amrita - Communication\n📊 Hrithik - Commercial Apps"
      }

      if (lowerQuestion.includes('doubt') || lowerQuestion.includes('submit') || lowerQuestion.includes('ask')) {
        return "To submit a doubt:\n\n1. Go to 'Find Mentors' tab\n2. Select a mentor\n3. Click 'Ask a Doubt'\n4. Fill in:\n   - Subject/Course name\n   - Upload image (optional)\n   - Describe your question\n   - Add Google Meet link (optional)\n5. Click 'Submit Doubt'\n\nYour mentor will respond soon! 🎓"
      }

      if (lowerQuestion.includes('appointment') || lowerQuestion.includes('book') || lowerQuestion.includes('schedule')) {
        return "To book an appointment:\n\n1. Click 'Book Appointment' tab\n2. Select a mentor\n3. Choose available day & time slot\n4. Add Google Meet link\n5. Add notes (optional)\n6. Confirm booking\n\nYou'll get a confirmation and can join via the Meet link! 📅"
      }

      if (lowerQuestion.includes('status') || lowerQuestion.includes('track')) {
        return "Track your doubts in '📝 My Doubts' tab:\n\n⏳ Pending - Submitted, waiting for mentor\n🔄 In Progress - Mentor is working on it\n✅ Resolved - Mentor has responded\n\nYou can chat with your mentor and join Google Meet from there!"
      }

      if (lowerQuestion.includes('rate') || lowerQuestion.includes('feedback')) {
        return "To rate a mentor:\n\n1. Go to 'My Doubts' tab\n2. Find a ✅ Resolved doubt\n3. Click '⭐ Rate Mentor'\n4. Give 1-5 stars\n5. Add tags (helpful, knowledgeable, etc.)\n6. Write a comment (optional)\n7. Submit\n\nYour feedback helps mentors improve! 🌟"
      }

      if (lowerQuestion.includes('search') || lowerQuestion.includes('filter')) {
        return "Use Advanced Search to filter:\n\n📚 In Mentors tab:\n- Search by expertise\n- Filter by rating\n- Sort by availability\n\n📝 In My Doubts tab:\n- Search by keyword\n- Filter by status\n- Filter by subject\n- Date range\n\nClick 'Advanced Search' button (top right)!"
      }
    }

    // MENTOR RESPONSES
    if (role === 'mentor') {
      if (lowerQuestion.includes('doubt') || lowerQuestion.includes('respond') || lowerQuestion.includes('student')) {
        return "Managing student doubts:\n\n1. Go to '📚 Doubts' tab\n2. Use filters: All/Pending/In Progress/Resolved\n3. Click on a doubt to view details\n4. Click 'Respond to Doubt'\n5. Write your response\n6. Click 'Mark In Progress' or 'Mark Resolved'\n\nYou can also chat with students and join Google Meet! 💬"
      }

      if (lowerQuestion.includes('calendar') || lowerQuestion.includes('availability') || lowerQuestion.includes('schedule')) {
        return "Setting your availability:\n\n1. Click '📅 Calendar' tab\n2. Select days you're available\n3. Set time ranges (e.g., 9 AM - 5 PM)\n4. Click 'Save Availability'\n\nStudents can then book appointments during your available slots! 🗓️"
      }

      if (lowerQuestion.includes('feedback') || lowerQuestion.includes('rating')) {
        return "View student feedback:\n\n1. Go to '⭐ Feedback' tab\n2. See your average rating\n3. View rating distribution\n4. Read student comments\n5. See satisfaction rate\n\nUse feedback to improve your mentoring! 📊"
      }

      if (lowerQuestion.includes('chat') || lowerQuestion.includes('message')) {
        return "Chatting with students:\n\n1. In any doubt card, click '💬 Chat with Student'\n2. Real-time messaging window opens\n3. Type and send messages\n4. Share links, explain concepts\n5. Schedule meetings\n\nGreat for quick clarifications!"
      }

      if (lowerQuestion.includes('meet') || lowerQuestion.includes('google')) {
        return "Google Meet integration:\n\n• Students can add Meet links to doubts\n• You can join directly from doubt cards\n• Click '📞 Join Google Meet'\n• Have face-to-face sessions\n• Perfect for complex topics!\n\nAlways confirm meeting times with students! 🎥"
      }
    }

    // ADMIN RESPONSES
    if (role === 'admin') {
      if (lowerQuestion.includes('analytics') || lowerQuestion.includes('stats') || lowerQuestion.includes('report')) {
        return "Viewing analytics:\n\n1. Click '📊 Analytics' tab (default view)\n2. See key metrics:\n   - Total students, mentors, doubts\n   - Resolution rates\n   - Subject distribution\n   - Performance trends\n3. View beautiful charts (Pie, Bar, Line)\n4. Click 'Export PDF' to download report\n\nMonitor platform health at a glance! 📈"
      }

      if (lowerQuestion.includes('mentor') && (lowerQuestion.includes('add') || lowerQuestion.includes('manage') || lowerQuestion.includes('delete'))) {
        return "Managing mentors:\n\n1. Click '👨‍🏫 Mentors' tab\n2. View all mentors list\n3. To add: Click '+ Add Mentor'\n   - Enter name, email, subject\n   - Set expertise & bio\n   - Click 'Create Mentor'\n4. To remove: Click delete icon on mentor card\n\nManage your teaching staff efficiently! 🎓"
      }

      if (lowerQuestion.includes('export') || lowerQuestion.includes('download') || lowerQuestion.includes('pdf')) {
        return "Exporting data:\n\n1. Go to 'Analytics' tab\n2. Click '📥 Export PDF' button\n3. Professional report generates\n4. Includes:\n   - All statistics\n   - Charts & graphs\n   - Date stamp\n   - Platform summary\n\nGreat for presentations! 📄"
      }

      if (lowerQuestion.includes('monitor') || lowerQuestion.includes('health') || lowerQuestion.includes('performance')) {
        return "System monitoring:\n\nKey metrics to watch:\n✅ Resolution rate (aim for >80%)\n📊 Student-mentor ratio\n⭐ Average mentor ratings\n⚡ Response time\n\nAll visible in Analytics tab! Use data to improve platform quality. 🔍"
      }

      if (lowerQuestion.includes('student') && (lowerQuestion.includes('total') || lowerQuestion.includes('count'))) {
        return "Student statistics:\n\nView in Analytics tab:\n• Total registered students\n• Active students\n• Doubts per student\n• Engagement rates\n• Class distribution\n\nHelps plan resource allocation! 📚"
      }
    }

    // COMMON RESPONSES (All Roles)
    if (lowerQuestion.includes('help') || lowerQuestion.includes('how')) {
      const roleSpecific = {
        student: "I can help you with:\n✅ Finding mentors\n✅ Submitting doubts\n✅ Booking appointments\n✅ Tracking status\n✅ Rating mentors\n✅ Using search filters",
        mentor: "I can help you with:\n✅ Managing doubts\n✅ Setting availability\n✅ Viewing feedback\n✅ Chatting with students\n✅ Platform navigation",
        admin: "I can help you with:\n✅ Viewing analytics\n✅ Managing mentors\n✅ Exporting reports\n✅ System monitoring\n✅ Platform administration"
      }
      return roleSpecific[role] || "I can help you navigate MentorConnect!"
    }

    // DEFAULT RESPONSE
    const roleDefaults = {
      student: `I'm your MentorConnect AI Assistant! I can help with:\n\n• Finding & selecting mentors\n• Submitting doubts\n• Booking appointments\n• Tracking doubt status\n• Understanding the feedback system\n\nCould you please be more specific?`,
      mentor: `I'm your Mentor AI Assistant! I can help with:\n\n• Managing student doubts\n• Setting calendar availability\n• Understanding feedback\n• Chat & Google Meet features\n\nWhat would you like to know?`,
      admin: `I'm your Admin AI Assistant! I can help with:\n\n• Analytics & reports\n• Mentor management\n• System monitoring\n• Data export\n\nHow can I assist you?`
    }
    
    return roleDefaults[role] || "How can I help you today?"
  }

  return (
    <>
      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {chatState === 'closed' && (
          <button
            onClick={() => setChatState('welcome')}
            className="group relative w-16 h-16 rounded-full gradient-bg shadow-2xl hover:scale-110 transition-all duration-300 glow-purple-strong animate-float"
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-purple-400 animate-pulse-slow opacity-50"></div>
            <div className="relative flex items-center justify-center">
              <svg 
                className="w-8 h-8 text-white" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" 
                />
              </svg>
            </div>
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
              1
            </div>
          </button>
        )}

        {/* Welcome Message Card */}
        {chatState === 'welcome' && (
          <div className="absolute bottom-20 right-0 w-96 animate-float">
            <div className="glass rounded-2xl p-6 shadow-2xl border border-purple-500/30">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full gradient-bg flex items-center justify-center flex-shrink-0">
                  <svg 
                    className="w-6 h-6 text-white" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" 
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-bold mb-2">
                    Hi {user?.name?.split(' ')[0] || 'there'},
                  </h3>
                  <p className="text-gray-300 text-sm mb-3">
                    Welcome to MentorConnect {user?.role === 'admin' ? 'Admin' : user?.role === 'mentor' ? 'Mentor' : ''} AI Assistant! Get help with platform features, guidance, and answers to your questions.
                  </p>
                  <p className="text-gray-400 text-xs mb-4">
                    MentorConnect AI • Just now
                  </p>
                  <button
                    onClick={() => setChatState('messages')}
                    className="px-4 py-2 rounded-lg gradient-bg text-white text-sm font-semibold hover:glow-purple transition-all"
                  >
                    Let's chat!
                  </button>
                </div>
                <button
                  onClick={() => setChatState('closed')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Messages List View */}
        {chatState === 'messages' && (
          <div className="fixed bottom-6 right-6 w-[400px] h-[600px] glass rounded-2xl shadow-2xl flex flex-col border border-purple-500/30 animate-float">
            <div className="p-4 border-b border-gray-700 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Messages</h2>
              <button
                onClick={() => setChatState('closed')}
                className="text-gray-400 hover:text-white transition-colors text-xl"
              >
                ✕
              </button>
            </div>

            <div 
              className="p-4 border-b border-gray-700 hover:bg-white/5 cursor-pointer transition-colors"
              onClick={() => setChatState('chat')}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-white font-semibold text-sm">
                      {user?.role === 'admin' ? 'Admin' : user?.role === 'mentor' ? 'Mentor' : ''} AI Assistant
                    </h3>
                    <span className="text-gray-500 text-xs">Just now</span>
                  </div>
                  <p className="text-gray-400 text-sm truncate">
                    Hi {user?.name?.split(' ')[0]}, how can I help you today?
                  </p>
                </div>
                <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0"></div>
              </div>
            </div>

            <div className="mt-auto border-t border-gray-700 grid grid-cols-2">
              <button
                onClick={() => setChatState('closed')}
                className="p-4 text-gray-400 hover:text-red-400 transition-colors flex flex-col items-center gap-1"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                <span className="text-xs">Close</span>
              </button>
           <button className="p-4 text-purple-400 transition-colors flex flex-col items-center gap-1 border-l border-gray-700 relative">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
                </svg>
                <span className="text-xs">Messages</span>
                <div className="absolute top-2 right-6 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  1
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Full Chat Interface */}
        {chatState === 'chat' && (
          <div className="fixed bottom-6 right-6 w-[450px] h-[650px] glass rounded-2xl shadow-2xl flex flex-col border border-purple-500/30 overflow-hidden">
            <div className="p-4 border-b border-gray-700 flex items-center justify-between" style={{ backgroundColor: '#1A1A1A' }}>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setChatState('messages')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm">MentorConnect AI</h3>
                  <p className="text-gray-400 text-xs">
                    {user?.role === 'admin' ? 'Admin Assistant' : user?.role === 'mentor' ? 'Mentor Assistant' : 'Student Assistant'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setChatState('closed')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-3 bg-purple-500/10 border-b border-purple-500/30 text-center">
              <p className="text-purple-300 text-xs">
                AI-powered assistant for {user?.role === 'admin' ? 'administrators' : user?.role === 'mentor' ? 'mentors' : 'students'}
              </p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ backgroundColor: '#0A0A0A' }}>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                    {message.type === 'bot' && (
                      <div className="flex items-end gap-2 mb-1">
                        <div className="w-6 h-6 rounded-full gradient-bg flex items-center justify-center flex-shrink-0">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                          </svg>
                        </div>
                        <span className="text-xs text-gray-500">MentorConnect AI</span>
                      </div>
                    )}
                    <div
                      className={`p-3 rounded-2xl ${
                        message.type === 'user'
                          ? 'gradient-bg text-white rounded-br-none'
                          : 'bg-gray-800 text-gray-200 rounded-bl-none'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-line">{message.text}</p>
                    </div>
                    {message.type === 'bot' && (
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                        <span>AI Agent</span>
                        <span>•</span>
                        <span>{message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-end gap-2">
                    <div className="w-6 h-6 rounded-full gradient-bg flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <div className="bg-gray-800 p-3 rounded-2xl rounded-bl-none">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-gray-700" style={{ backgroundColor: '#1A1A1A' }}>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your question..."
                  className="flex-1 px-4 py-2 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                  style={{ backgroundColor: '#2A2A2A', border: '1px solid #3A3A3A' }}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim()}
                  className="px-4 py-2 rounded-lg gradient-bg text-white font-semibold hover:glow-purple transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Powered by MentorConnect AI • Role: {user?.role || 'Guest'}
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default Chatbot