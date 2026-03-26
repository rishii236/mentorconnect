import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import MentorCard from '../components/student/MentorCard'
import DoubtModal from '../components/student/DoubtModal'
import AppointmentBooking from '../components/calendar/AppointmentBooking'
import RatingModal from '../components/rating/RatingModal'
import AdvancedSearch from '../components/search/AdvancedSearch'
import ChatWindow from '../components/common/ChatWindow'
import NotificationBell from '../components/common/NotificationBell'
import Chatbot from '../components/common/Chatbot'
import SettingsModal from '../components/common/SettingsModal'
import { Vortex } from '../components/ui/Vortex'

function StudentDashboard() {
  const { user, logout, API_URL } = useAuth()
  const navigate = useNavigate()
  
  const [mentors, setMentors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('mentors')
  const [selectedMentor, setSelectedMentor] = useState(null)
  const [showDoubtModal, setShowDoubtModal] = useState(false)
  const [myDoubts, setMyDoubts] = useState([])
  const [selectedDoubtForChat, setSelectedDoubtForChat] = useState(null)
  const [showChatWindow, setShowChatWindow] = useState(false)
  const [selectedMentorForAppointment, setSelectedMentorForAppointment] = useState(null)
  const [showRating, setShowRating] = useState(false)
  const [ratingDoubt, setRatingDoubt] = useState(null)
  const [showSettings, setShowSettings] = useState(false)

  useEffect(() => {
    if (activeTab === 'mentors') {
      fetchMentors()
    } else if (activeTab === 'my-doubts') {
      fetchMyDoubts()
    }
  }, [activeTab])

  const fetchMentors = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${API_URL}/api/mentors`)

      setMentors(response.data.data)
      setError('')
    } catch (err) {
      setError('Unable to load mentors. Please check your connection and try again.')
      console.error('Mentor fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchMyDoubts = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${API_URL}/api/doubts/my-doubts`)
      setMyDoubts(response.data.data)
      setError('')
    } catch (err) {
      setError('Could not retrieve your doubts. Please try again.')
      console.error('Doubts fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAskDoubt = (mentor) => {
    setSelectedMentor(mentor)
    setShowDoubtModal(true)
  }

  const handleBookAppointment = (mentor) => {
    setSelectedMentorForAppointment(mentor)
    setActiveTab('appointments')
  }

  const handleRateSession = (doubt) => {
    setRatingDoubt(doubt)
    setShowRating(true)
  }

  const handleDoubtSubmitted = () => {
    setShowDoubtModal(false)
    setSelectedMentor(null)
    if (activeTab === 'my-doubts') {
      fetchMyDoubts()
    }
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <Vortex
      backgroundColor="#000000"
      rangeY={800}
      particleCount={400}
      baseHue={270}
      baseOpacity={0.3}
      containerClassName="min-h-screen"
      className="w-full"
    >
      <div className="min-h-screen">
        {/* Navigation */}
        <nav className="glass sticky top-0 z-50 backdrop-blur-lg border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => navigate('/')}>
                <img src="/logo.png" alt="MentorConnect" className="h-10 w-10" />
                <h1 className="text-2xl font-bold gradient-text">MentorConnect</h1>
              </div>
              
              <div className="flex items-center gap-4">
                <NotificationBell />
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-white">{user?.name}</p>
                  <p className="text-xs text-gray-400">{user?.class}</p>
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
              Ready to learn something new today?
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="glass rounded-xl p-2 mb-8 inline-flex gap-2 flex-wrap">
            <button
              onClick={() => setActiveTab('mentors')}
              className={`px-5 py-2.5 rounded-lg font-medium transition-all whitespace-nowrap ${
                activeTab === 'mentors'
                  ? 'gradient-bg text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Find Mentors
            </button>
            <button
              onClick={() => setActiveTab('my-doubts')}
              className={`px-5 py-2.5 rounded-lg font-medium transition-all whitespace-nowrap ${
                activeTab === 'my-doubts'
                  ? 'gradient-bg text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              My Questions
            </button>
            <button
              onClick={() => setActiveTab('appointments')}
              className={`px-5 py-2.5 rounded-lg font-medium transition-all whitespace-nowrap ${
                activeTab === 'appointments'
                  ? 'gradient-bg text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Schedule Session
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
                  onClick={() => activeTab === 'mentors' ? fetchMentors() : fetchMyDoubts()}
                  className="px-4 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 text-sm font-medium transition-colors"
                >
                  Retry
                </button>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && activeTab !== 'appointments' ? (
            <div className="flex flex-col items-center justify-center h-64 gap-4">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
              </div>
              <p className="text-gray-400">Loading your dashboard...</p>
            </div>
          ) : (
            <>
              {/* Mentors Tab */}
              {activeTab === 'mentors' && (
                <div>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        Available Mentors
                      </h3>
                      <p className="text-sm text-gray-400 mt-1">
                        Browse {mentors.length} expert{mentors.length !== 1 ? 's' : ''} ready to help you
                      </p>
                    </div>
                    <AdvancedSearch
                      type="mentors"
                      onResults={(results) => setMentors(results)}
                    />
                  </div>
                  
                  {mentors.length === 0 ? (
                    <div className="glass rounded-2xl p-12 text-center">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-500/10 flex items-center justify-center">
                        <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <h4 className="text-lg font-semibold text-white mb-2">No mentors found</h4>
                      <p className="text-gray-400 text-sm">
                        Try adjusting your search filters or check back later
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {mentors.map((mentor) => (
                        <MentorCard
                          key={mentor._id}
                          mentor={mentor}
                          onAskDoubt={() => handleAskDoubt(mentor)}
                          onBookAppointment={() => handleBookAppointment(mentor)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* My Doubts Tab */}
              {activeTab === 'my-doubts' && (
                <div>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        Your Questions
                      </h3>
                      <p className="text-sm text-gray-400 mt-1">
                        {myDoubts.length === 0 
                          ? 'No questions submitted yet' 
                          : `${myDoubts.length} question${myDoubts.length !== 1 ? 's' : ''} tracked`
                        }
                      </p>
                    </div>
                    {myDoubts.length > 0 && (
                      <AdvancedSearch
                        type="doubts"
                        onResults={(results) => setMyDoubts(results)}
                      />
                    )}
                  </div>
                  
                  {myDoubts.length === 0 ? (
                    <div className="glass rounded-2xl p-12 text-center">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-500/10 flex items-center justify-center">
                        <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h4 className="text-lg font-semibold text-white mb-2">No questions yet</h4>
                      <p className="text-gray-400 text-sm mb-6">
                        Start your learning journey by asking your first question
                      </p>
                      <button
                        onClick={() => setActiveTab('mentors')}
                        className="px-6 py-3 rounded-xl gradient-bg text-white font-semibold hover:scale-105 transition-transform"
                      >
                        Browse Mentors
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {myDoubts.map((doubt) => (
                        <div
                          key={doubt._id}
                          className="glass rounded-xl p-6 hover:border-purple-500/50 transition-all duration-300"
                        >
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
                            <div className="flex-1">
                              <h4 className="text-lg font-semibold text-white mb-2">
                                {doubt.subject}
                              </h4>
                              <p className="text-sm text-gray-400">
                                Mentor: <span className="text-gray-300">{doubt.mentor?.name}</span>
                              </p>
                            </div>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                                doubt.status === 'resolved'
                                  ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                                  : doubt.status === 'in-progress'
                                  ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50'
                                  : 'bg-purple-500/20 text-purple-400 border border-purple-500/50'
                              }`}
                            >
                              {doubt.status === 'pending' ? 'Under Review' : 
                               doubt.status === 'in-progress' ? 'In Progress' : 
                               'Resolved'}
                            </span>
                          </div>
                          
                          <p className="text-gray-300 mb-4 line-clamp-2">{doubt.remarks}</p>
                          
                          {doubt.doubtImage && (
                            <img
                              src={doubt.doubtImage}
                              alt="Question attachment"
                              className="w-full max-w-md rounded-lg mb-4 border border-gray-700"
                            />
                          )}
                          
                          {doubt.mentorResponse && (
                            <div className="mt-4 p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
                              <p className="text-xs font-semibold text-purple-400 mb-2 uppercase tracking-wide">
                                Mentor's Response
                              </p>
                              <p className="text-gray-300 text-sm">{doubt.mentorResponse}</p>
                            </div>
                          )}
                          
                          <div className="mt-4 flex flex-wrap gap-3">
                            <button
                              onClick={() => {
                                setSelectedDoubtForChat(doubt)
                                setShowChatWindow(true)
                              }}
                              className="px-5 py-2 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30 font-medium hover:bg-purple-500/30 transition-all text-sm"
                            >
                              Chat with Mentor
                            </button>
                            
                            {doubt.meetLink && (
                              <a
                                href={doubt.meetLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-5 py-2 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/30 font-medium hover:bg-blue-500/30 transition-all text-sm"
                              >
                                Join Video Call
                              </a>
                            )}

                            {doubt.status === 'resolved' && (
                              <button
                                onClick={() => handleRateSession(doubt)}
                                className="px-5 py-2 rounded-lg bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 font-medium hover:bg-yellow-500/30 transition-all text-sm"
                              >
                                Rate Session
                              </button>
                            )}
                          </div>
                          
                          <p className="text-xs text-gray-500 mt-4">
                            Asked on {new Date(doubt.createdAt).toLocaleDateString('en-US', { 
                              month: 'long', 
                              day: 'numeric', 
                              year: 'numeric' 
                            })}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Appointments Tab */}
              {activeTab === 'appointments' && (
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    Schedule a Session
                  </h3>
                  <p className="text-sm text-gray-400 mb-6">
                    Book 1-on-1 time with your mentor
                  </p>
                  
                  {selectedMentorForAppointment ? (
                    <AppointmentBooking 
                      mentor={selectedMentorForAppointment}
                      onClose={() => {
                        setSelectedMentorForAppointment(null)
                        setActiveTab('mentors')
                      }}
                    />
                  ) : (
                    <div className="glass rounded-2xl p-12 text-center">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-indigo-500/10 flex items-center justify-center">
                        <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <h4 className="text-lg font-semibold text-white mb-2">Select a mentor first</h4>
                      <p className="text-gray-400 text-sm mb-6">
                        Choose a mentor from the browse section to schedule your session
                      </p>
                      <button
                        onClick={() => setActiveTab('mentors')}
                        className="px-6 py-3 rounded-xl gradient-bg text-white font-semibold hover:scale-105 transition-transform"
                      >
                        View Mentors
                      </button>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Modals */}
        {showDoubtModal && selectedMentor && (
          <DoubtModal
            mentor={selectedMentor}
            onClose={() => {
              setShowDoubtModal(false)
              setSelectedMentor(null)
            }}
            onSuccess={handleDoubtSubmitted}
          />
        )}

        {showChatWindow && selectedDoubtForChat && (
          <ChatWindow
            doubt={selectedDoubtForChat}
            onClose={() => {
              setShowChatWindow(false)
              setSelectedDoubtForChat(null)
            }}
          />
        )}

        {showRating && ratingDoubt && (
          <RatingModal
            doubt={ratingDoubt}
            mentor={ratingDoubt.mentor || ratingDoubt.mentorId}
            onClose={() => {
              setShowRating(false)
              setRatingDoubt(null)
            }}
            onSuccess={() => {
              setShowRating(false)
              setRatingDoubt(null)
              fetchMyDoubts()
            }}
          />
        )}

        <Chatbot />

        {/* Settings Modal */}
        {showSettings && (
          <SettingsModal onClose={() => setShowSettings(false)} />
        )}

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

export default StudentDashboard