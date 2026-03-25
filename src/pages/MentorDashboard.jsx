import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'
import MentorCalendar from '../components/calendar/MentorCalendar'
import FeedbackView from '../components/mentor/FeedbackView'
import ChatWindow from '../components/common/ChatWindow'
import NotificationBell from '../components/common/NotificationBell'
import SettingsModal from '../components/common/SettingsModal'
import Chatbot from '../components/common/Chatbot'
import { Vortex } from '../components/ui/Vortex'

function MentorDashboard() {
  const { user, logout, API_URL } = useAuth()
  
  const [doubts, setDoubts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('doubts')
  const [selectedDoubt, setSelectedDoubt] = useState(null)
  const [statusFilter, setStatusFilter] = useState('all')
  const [responseText, setResponseText] = useState('')
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [selectedDoubtForChat, setSelectedDoubtForChat] = useState(null)
  const [showChatWindow, setShowChatWindow] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  useEffect(() => {
    if (activeTab === 'doubts') {
      fetchDoubts()
    }
  }, [statusFilter, activeTab])

  const fetchDoubts = async () => {
    try {
      setLoading(true)
      const url = statusFilter === 'all' 
        ? `${API_URL}/doubts/mentor-doubts`
        : `${API_URL}/doubts/mentor-doubts?status=${statusFilter}`
      
      const response = await axios.get(url)
      setDoubts(response.data.data)
      setError('')
    } catch (err) {
      setError('Unable to load questions. Please refresh and try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async (doubtId, newStatus) => {
    try {
      setUpdatingStatus(true)
      await axios.put(`${API_URL}/doubts/${doubtId}/status`, {
        status: newStatus,
        mentorResponse: responseText || undefined
      })
      
      fetchDoubts()
      setSelectedDoubt(null)
      setResponseText('')
      setError('')
    } catch (err) {
      setError('Failed to update question status. Please try again.')
      console.error(err)
    } finally {
      setUpdatingStatus(false)
    }
  }

  const getStatusCounts = () => {
    return {
      total: doubts.length,
      pending: doubts.filter(d => d.status === 'pending').length,
      inProgress: doubts.filter(d => d.status === 'in-progress').length,
      resolved: doubts.filter(d => d.status === 'resolved').length
    }
  }

  const stats = getStatusCounts()

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'resolved':
        return 'bg-green-500/20 text-green-400 border-green-500/50'
      case 'in-progress':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'
      default:
        return 'bg-purple-500/20 text-purple-400 border-purple-500/50'
    }
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending': return 'Awaiting Review'
      case 'in-progress': return 'In Progress'
      case 'resolved': return 'Resolved'
      default: return status
    }
  }

  return (
    <Vortex
      backgroundColor="#000000"
      rangeY={800}
      particleCount={300}
      baseHue={270}
      baseOpacity={0.25}
      containerClassName="min-h-screen"
      className="w-full"
    >
      <div className="min-h-screen">
        {/* Navbar */}
        <nav className="glass sticky top-0 z-50 backdrop-blur-lg border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-3">
                <img src="/logo.png" alt="MentorConnect" className="h-10 w-10" />
                <h1 className="text-2xl font-bold gradient-text">MentorConnect</h1>
              </div>
              
              <div className="flex items-center gap-4">
                <NotificationBell />
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-white">{user?.name}</p>
                  <p className="text-xs text-gray-400">Mentor</p>
                </div>
                <button
                  onClick={logout}
                  className="px-4 py-2 rounded-lg bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500 hover:text-white transition-all duration-300 text-sm font-medium"
                >
                  Sign Out
                </button>
                <button
                  onClick={() => setShowSettings(true)}
                  className="p-2 rounded-lg glass text-gray-400 hover:text-white transition-colors"
                  title="Settings"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
              {getGreeting()}, {user?.name?.split(' ')[0]}
            </h2>
            <p className="text-gray-400">
              Let's help some students today
            </p>
          </div>

          {/* Stats Overview */}
          {activeTab === 'doubts' && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="glass rounded-xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-gray-400 text-sm font-medium">Total Questions</p>
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
              </div>
              
              <div className="glass rounded-xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-gray-400 text-sm font-medium">Awaiting Review</p>
                  <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-2xl font-bold text-purple-400">{stats.pending}</p>
              </div>
              
              <div className="glass rounded-xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-gray-400 text-sm font-medium">In Progress</p>
                  <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <p className="text-2xl font-bold text-yellow-400">{stats.inProgress}</p>
              </div>
              
              <div className="glass rounded-xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-gray-400 text-sm font-medium">Resolved</p>
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-2xl font-bold text-green-400">{stats.resolved}</p>
                {stats.total > 0 && (
                  <p className="text-xs text-gray-500 mt-1">
                    {Math.round((stats.resolved / stats.total) * 100)}% completion
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Tab Navigation */}
          <div className="glass rounded-xl p-2 mb-8 inline-flex gap-2 flex-wrap">
            <button
              onClick={() => setActiveTab('doubts')}
              className={`px-5 py-2.5 rounded-lg font-medium transition-all whitespace-nowrap ${
                activeTab === 'doubts'
                  ? 'gradient-bg text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Student Questions
            </button>
            <button
              onClick={() => setActiveTab('calendar')}
              className={`px-5 py-2.5 rounded-lg font-medium transition-all whitespace-nowrap ${
                activeTab === 'calendar'
                  ? 'gradient-bg text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              My Availability
            </button>
            <button
              onClick={() => setActiveTab('feedback')}
              className={`px-5 py-2.5 rounded-lg font-medium transition-all whitespace-nowrap ${
                activeTab === 'feedback'
                  ? 'gradient-bg text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Student Feedback
            </button>
          </div>

          {/* Error State */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div className="flex-1">
                  <p className="font-medium mb-1">Something went wrong</p>
                  <p className="text-sm opacity-90">{error}</p>
                </div>
                <button
                  onClick={fetchDoubts}
                  className="px-4 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 text-sm font-medium transition-colors"
                >
                  Retry
                </button>
              </div>
            </div>
          )}

          {/* Content Area */}
          {activeTab === 'doubts' && (
            <div>
              {/* Filter Tabs */}
              {!selectedDoubt && (
                <div className="flex gap-2 mb-6 flex-wrap">
                  {[
                    { value: 'all', label: 'All Questions' },
                    { value: 'pending', label: 'Awaiting Review' },
                    { value: 'in-progress', label: 'In Progress' },
                    { value: 'resolved', label: 'Resolved' }
                  ].map((filter) => (
                    <button
                      key={filter.value}
                      onClick={() => setStatusFilter(filter.value)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        statusFilter === filter.value
                          ? 'bg-purple-500 text-white'
                          : 'glass text-gray-400 hover:text-white'
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              )}

              {loading ? (
                <div className="flex flex-col items-center justify-center h-64 gap-4">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
                  </div>
                  <p className="text-gray-400">Loading questions...</p>
                </div>
              ) : selectedDoubt ? (
                // Doubt Detail View
                <div className="glass rounded-xl p-6">
                  <button
                    onClick={() => setSelectedDoubt(null)}
                    className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to questions
                  </button>

                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-2xl font-bold text-white mb-2">{selectedDoubt.subject}</h3>
                          <p className="text-sm text-gray-400">
                            From <span className="text-gray-300">{selectedDoubt.studentName}</span> • {selectedDoubt.studentClass}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(selectedDoubt.status)}`}>
                          {getStatusLabel(selectedDoubt.status)}
                        </span>
                      </div>

                      <div className="bg-gray-900/50 rounded-lg p-4 mb-4">
                        <p className="text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wide">Question</p>
                        <p className="text-gray-300">{selectedDoubt.remarks}</p>
                      </div>

                      {selectedDoubt.doubtImage && (
                        <div className="mb-4">
                          <p className="text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wide">Attachment</p>
                          <img 
                            src={selectedDoubt.doubtImage} 
                            alt="Student's question" 
                            className="max-w-full rounded-lg border border-gray-700"
                          />
                        </div>
                      )}

                      {selectedDoubt.meetLink && (
                        <div className="mb-4">
                          <p className="text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wide">Meeting Link</p>
                          <a 
                            href={selectedDoubt.meetLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 underline text-sm break-all"
                          >
                            {selectedDoubt.meetLink}
                          </a>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        Your Response
                      </label>
                      <textarea
                        value={responseText}
                        onChange={(e) => setResponseText(e.target.value)}
                        placeholder="Provide your guidance to the student..."
                        className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors resize-none"
                        rows="5"
                      />
                    </div>

                    <div className="flex gap-3 flex-wrap">
                      {selectedDoubt.status === 'pending' && (
                        <button
                          onClick={() => handleUpdateStatus(selectedDoubt._id, 'in-progress')}
                          disabled={updatingStatus}
                          className="px-6 py-3 rounded-lg bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 font-semibold hover:bg-yellow-500/30 transition-all disabled:opacity-50"
                        >
                          {updatingStatus ? 'Updating...' : 'Mark In Progress'}
                        </button>
                      )}
                      
                      <button
                        onClick={() => handleUpdateStatus(selectedDoubt._id, 'resolved')}
                        disabled={updatingStatus || !responseText.trim()}
                        className="px-6 py-3 rounded-lg bg-green-500/20 text-green-300 border border-green-500/30 font-semibold hover:bg-green-500/30 transition-all disabled:opacity-50"
                      >
                        {updatingStatus ? 'Updating...' : 'Mark as Resolved'}
                      </button>

                      <button
                        onClick={() => {
                          setSelectedDoubtForChat(selectedDoubt)
                          setShowChatWindow(true)
                        }}
                        className="px-6 py-3 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30 font-semibold hover:bg-purple-500/30 transition-all"
                      >
                        Open Chat
                      </button>
                    </div>
                  </div>
                </div>
              ) : doubts.length === 0 ? (
                <div className="glass rounded-2xl p-12 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/10 flex items-center justify-center">
                    <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">All caught up!</h4>
                  <p className="text-gray-400 text-sm">
                    {statusFilter === 'all' 
                      ? 'No questions at the moment. Check back soon.'
                      : `No ${statusFilter} questions right now.`
                    }
                  </p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {doubts.map((doubt) => (
                    <div
                      key={doubt._id}
                      className="glass rounded-xl p-6 hover:border-purple-500/50 transition-all cursor-pointer"
                      onClick={() => setSelectedDoubt(doubt)}
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-white mb-2">{doubt.subject}</h4>
                          <p className="text-sm text-gray-400 mb-3">
                            {doubt.studentName} • {doubt.studentClass}
                          </p>
                          <p className="text-gray-300 line-clamp-2 text-sm">{doubt.remarks}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border whitespace-nowrap ${getStatusColor(doubt.status)}`}>
                          {getStatusLabel(doubt.status)}
                        </span>
                      </div>
                      
                      <div className="mt-4 flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {new Date(doubt.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                        {doubt.doubtImage && (
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Attachment
                          </span>
                        )}
                        {doubt.meetLink && (
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            Meeting link
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Calendar Tab */}
          {activeTab === 'calendar' && (
            <div>
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-1">
                  Manage Your Schedule
                </h3>
                <p className="text-sm text-gray-400">
                  Set when you're available for student sessions
                </p>
              </div>
              <MentorCalendar />
            </div>
          )}

          {/* Feedback Tab */}
          {activeTab === 'feedback' && (
            <div>
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-1">
                  Your Feedback
                </h3>
                <p className="text-sm text-gray-400">
                  See what students are saying about your mentorship
                </p>
              </div>
              <FeedbackView />
            </div>
          )}
        </div>

        {/* Chat Window */}
        {showChatWindow && selectedDoubtForChat && (
          <ChatWindow
            doubt={selectedDoubtForChat}
            onClose={() => {
              setShowChatWindow(false)
              setSelectedDoubtForChat(null)
            }}
          />
        )}

        {/* Settings Modal */}
        {showSettings && (
          <SettingsModal onClose={() => setShowSettings(false)} />
        )}

        <Chatbot />

        {/* Footer */}
        <footer className="mt-16 py-8 border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-gray-500 text-sm text-center sm:text-left">
                © 2026 MentorConnect • Built with 💜 by Swara
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <a href="#" className="hover:text-gray-300 transition-colors">Privacy</a>
                <span>•</span>
                <a href="#" className="hover:text-gray-300 transition-colors">Terms</a>
                <span>•</span>
                <a href="#" className="hover:text-gray-300 transition-colors">Support</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </Vortex>
  )
}

export default MentorDashboard