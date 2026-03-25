import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { adminAPI } from '../services/api'
import MentorManagement from '../components/admin/MentorManagement'
import Analytics from '../components/admin/Analytics'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import Chatbot from '../components/common/Chatbot'
import { Vortex } from '../components/ui/Vortex'

function AdminDashboard() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('analytics')
  const [mentors, setMentors] = useState([])
  const [stats, setStats] = useState({
    totalMentors: 0,
    totalStudents: 0,
    totalDoubts: 0,
    resolvedDoubts: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    setError('')
    
    try {
      const [mentorsRes, statsRes] = await Promise.all([
        adminAPI.getAllMentors(),
        adminAPI.getStats()
      ])
      
      setMentors(mentorsRes.data?.data || mentorsRes.data || [])
      setStats(statsRes.data?.data || statsRes.data || {
        totalMentors: 0,
        totalStudents: 0,
        totalDoubts: 0,
        resolvedDoubts: 0
      })
    } catch (err) {
      setError('Unable to load dashboard data. Please refresh the page.')
      console.error('Admin fetch error:', err)
    } finally {
      setLoading(false)
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
      particleCount={300}
      baseHue={270}
      baseOpacity={0.25}
      containerClassName="min-h-screen"
      className="w-full"
    >
      <div className="min-h-screen flex flex-col">
        <Navbar />

        <div className="max-w-7xl mx-auto relative z-10 p-4 md:p-8 flex-1">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold gradient-text">
              Admin Dashboard
            </h1>
            <p className="text-gray-400 mt-2">
              {getGreeting()}, <span className="text-white font-semibold">{user?.name}</span>
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="glass rounded-xl p-2 mb-8 inline-flex gap-2 flex-wrap">
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-5 py-2.5 rounded-lg font-medium transition-all whitespace-nowrap ${
                activeTab === 'analytics'
                  ? 'gradient-bg text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Platform Analytics
            </button>
            <button
              onClick={() => setActiveTab('mentors')}
              className={`px-5 py-2.5 rounded-lg font-medium transition-all whitespace-nowrap ${
                activeTab === 'mentors'
                  ? 'gradient-bg text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Mentor Management
            </button>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 gap-4">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
              </div>
              <p className="text-gray-400">Loading dashboard...</p>
            </div>
          ) : error ? (
            <div className="glass rounded-xl p-8">
              <div className="flex flex-col items-center text-center gap-4">
                <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
                  <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Failed to load data</h3>
                  <p className="text-gray-400 mb-4 text-sm">{error}</p>
                  <button
                    onClick={fetchData}
                    className="px-6 py-2.5 rounded-lg gradient-bg text-white font-semibold hover:scale-105 transition-transform"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Analytics Tab */}
              {activeTab === 'analytics' && (
                <div>
                  {/* Quick Stats Overview */}
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-white mb-1">
                      Platform Overview
                    </h3>
                    <p className="text-sm text-gray-400">
                      Real-time metrics across MentorConnect
                    </p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="glass rounded-xl p-6 hover:border-purple-500/50 transition-all">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-gray-400 text-sm font-medium">Active Mentors</p>
                        <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <p className="text-3xl font-bold text-white mb-1">{stats.totalMentors}</p>
                      <p className="text-xs text-gray-500">registered mentors</p>
                    </div>
                    
                    <div className="glass rounded-xl p-6 hover:border-purple-500/50 transition-all">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-gray-400 text-sm font-medium">Total Students</p>
                        <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      </div>
                      <p className="text-3xl font-bold text-white mb-1">{stats.totalStudents}</p>
                      <p className="text-xs text-gray-500">active learners</p>
                    </div>
                    
                    <div className="glass rounded-xl p-6 hover:border-purple-500/50 transition-all">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-gray-400 text-sm font-medium">Questions</p>
                        <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <p className="text-3xl font-bold text-white mb-1">{stats.totalDoubts}</p>
                      <p className="text-xs text-gray-500">submitted</p>
                    </div>
                    
                    <div className="glass rounded-xl p-6 hover:border-purple-500/50 transition-all">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-gray-400 text-sm font-medium">Resolved</p>
                        <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <p className="text-3xl font-bold text-green-400 mb-1">{stats.resolvedDoubts}</p>
                      {stats.totalDoubts > 0 ? (
                        <p className="text-xs text-gray-500">
                          {Math.round((stats.resolvedDoubts / stats.totalDoubts) * 100)}% success rate
                        </p>
                      ) : (
                        <p className="text-xs text-gray-500">no data yet</p>
                      )}
                    </div>
                  </div>

                  {/* Analytics Component */}
                  <Analytics />
                </div>
              )}

              {/* Mentors Tab */}
              {activeTab === 'mentors' && (
                <div>
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-white mb-1">
                      Mentor Directory
                    </h3>
                    <p className="text-sm text-gray-400">
                      {mentors.length === 0 
                        ? 'No mentors registered yet'
                        : `Managing ${mentors.length} mentor${mentors.length !== 1 ? 's' : ''} on the platform`
                      }
                    </p>
                  </div>

                  {/* Stats Summary */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="glass rounded-xl p-6">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-gray-400 text-sm">Total Mentors</p>
                        <span className="text-xl">👨‍🏫</span>
                      </div>
                      <p className="text-3xl font-bold text-white">{stats.totalMentors}</p>
                    </div>
                    
                    <div className="glass rounded-xl p-6">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-gray-400 text-sm">Students</p>
                        <span className="text-xl">🎓</span>
                      </div>
                      <p className="text-3xl font-bold text-white">{stats.totalStudents}</p>
                    </div>
                    
                    <div className="glass rounded-xl p-6">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-gray-400 text-sm">Questions</p>
                        <span className="text-xl">💬</span>
                      </div>
                      <p className="text-3xl font-bold text-white">{stats.totalDoubts}</p>
                    </div>
                    
                    <div className="glass rounded-xl p-6">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-gray-400 text-sm">Resolution Rate</p>
                        <span className="text-xl">✅</span>
                      </div>
                      <p className="text-3xl font-bold text-green-400">
                        {stats.totalDoubts > 0 
                          ? `${Math.round((stats.resolvedDoubts / stats.totalDoubts) * 100)}%`
                          : '0%'
                        }
                      </p>
                    </div>
                  </div>

                  {/* Mentor Management Component */}
                  <MentorManagement mentors={mentors} onUpdate={fetchData} />
                </div>
              )}
            </>
          )}
        </div>

        <Footer />
        <Chatbot />
      </div>
    </Vortex>
  )
}

export default AdminDashboard