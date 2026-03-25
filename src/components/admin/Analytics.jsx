import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import {
  PieChart, Pie, Cell, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'

const COLORS = ['#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#3B82F6']

function AdminAnalytics() {
  const { API_URL } = useAuth()
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      setError('')
      const token = localStorage.getItem('token')
      
      const response = await axios.get(`${API_URL}/analytics/admin`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      if (response.data.success) {
        setAnalytics(response.data.data)
      }
    } catch (err) {
      console.error('Failed to fetch analytics:', err)
      setError(err.response?.data?.message || 'Failed to load analytics data')
      toast.error('Failed to load analytics')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="spinner"></div>
        <p className="text-gray-400 ml-4">Loading analytics...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="glass rounded-xl p-8 text-center">
        <p className="text-red-400 mb-4">{error}</p>
        <button
          onClick={fetchAnalytics}
          className="px-6 py-2 rounded-lg gradient-bg text-white font-semibold hover:glow-purple transition-all"
        >
          Try Again
        </button>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="glass rounded-xl p-8 text-center">
        <p className="text-gray-400">No analytics data available</p>
      </div>
    )
  }

  const { overview, doubtsByStatus, doubtsBySubject, topMentors, mentorRatings, doubtsTrend, avgResolutionTime } = analytics

  // Format data for charts
  const statusData = doubtsByStatus.map(item => ({
    name: item._id || 'Unknown',
    value: item.count,
    label: item._id.charAt(0).toUpperCase() + item._id.slice(1)
  }))

  const subjectData = doubtsBySubject.slice(0, 8).map(item => ({
    subject: item._id || 'Unknown',
    count: item.count
  }))

  const trendData = doubtsTrend.map(item => ({
    date: new Date(item._id).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    doubts: item.count
  }))

  const resolutionRate = overview.totalDoubts > 0
    ? Math.round((doubtsByStatus.find(s => s._id === 'resolved')?.count || 0) / overview.totalDoubts * 100)
    : 0

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">System Analytics 📊</h2>
        <button
          onClick={fetchAnalytics}
          className="px-4 py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 transition-all text-sm"
        >
          🔄 Refresh
        </button>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass rounded-xl p-6 hover:glow-purple transition-all">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-400 text-sm">Total Mentors</p>
            <span className="text-2xl">👨‍🏫</span>
          </div>
          <p className="text-3xl font-bold text-white">{overview.totalMentors}</p>
          <p className="text-xs text-gray-500 mt-1">Active educators</p>
        </div>

        <div className="glass rounded-xl p-6 hover:glow-purple transition-all">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-400 text-sm">Total Students</p>
            <span className="text-2xl">🎓</span>
          </div>
          <p className="text-3xl font-bold text-white">{overview.totalStudents}</p>
          <p className="text-xs text-gray-500 mt-1">Registered learners</p>
        </div>

        <div className="glass rounded-xl p-6 hover:glow-purple transition-all">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-400 text-sm">Total Doubts</p>
            <span className="text-2xl">📝</span>
          </div>
          <p className="text-3xl font-bold text-white">{overview.totalDoubts}</p>
          <p className="text-xs text-gray-500 mt-1">Questions asked</p>
        </div>

        <div className="glass rounded-xl p-6 hover:glow-purple transition-all">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-400 text-sm">Appointments</p>
            <span className="text-2xl">📅</span>
          </div>
          <p className="text-3xl font-bold text-purple-400">{overview.totalAppointments}</p>
          <p className="text-xs text-gray-500 mt-1">Sessions booked</p>
        </div>
      </div>

      {/* Charts Row 1: Doubt Status & Subject Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Doubt Status Pie Chart */}
        <div className="glass rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">📊 Doubt Status Distribution</h3>
          {statusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-400">
              No data available
            </div>
          )}
          
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            {statusData.map((item, idx) => (
              <div key={idx} className="p-2 rounded-lg" style={{ backgroundColor: '#1A1A1A' }}>
                <div className="w-3 h-3 rounded-full mx-auto mb-1" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                <p className="text-xs text-gray-400">{item.label}</p>
                <p className="text-sm font-bold text-white">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Subject Distribution Bar Chart - FIXED! */}
        <div className="glass rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">📚 Subject Distribution</h3>
          {subjectData.length > 0 ? (
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={subjectData} margin={{ bottom: 90, left: 10, right: 10, top: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis 
                  dataKey="subject" 
                  stroke="#999"
                  angle={-45}
                  textAnchor="end"
                  height={120}
                  interval={0}
                  tick={{ fontSize: 11 }}
                />
                <YAxis stroke="#999" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1A1A1A', border: '1px solid #333' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Bar dataKey="count" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-400">
              No data available
            </div>
          )}
        </div>
      </div>

      {/* Doubt Trend Line Chart */}
      <div className="glass rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">📈 Doubts Trend (Last 7 Days)</h3>
        {trendData.length > 0 ? (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="date" stroke="#999" />
              <YAxis stroke="#999" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1A1A1A', border: '1px solid #333' }}
                labelStyle={{ color: '#fff' }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="doubts" 
                stroke="#8B5CF6" 
                strokeWidth={3}
                dot={{ fill: '#8B5CF6', r: 5 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-64 flex items-center justify-center text-gray-400">
            No trend data available
          </div>
        )}
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Resolution Stats */}
        <div className="glass rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">⚡ Performance Metrics</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Resolution Rate</span>
                <span className="text-white font-semibold">{resolutionRate}%</span>
              </div>
              <div className="h-4 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full gradient-bg transition-all duration-500"
                  style={{ width: `${resolutionRate}%` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: '#1A1A1A' }}>
              <div>
                <p className="text-gray-400 text-sm">Avg Resolution Time</p>
                <p className="text-white text-2xl font-bold">{avgResolutionTime.toFixed(1)} hrs</p>
              </div>
              <span className="text-4xl">⚡</span>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: '#1A1A1A' }}>
              <div>
                <p className="text-gray-400 text-sm">Student-Mentor Ratio</p>
                <p className="text-white text-2xl font-bold">
                  {overview.totalMentors > 0 ? Math.round(overview.totalStudents / overview.totalMentors) : 0}:1
                </p>
              </div>
              <span className="text-4xl">👥</span>
            </div>
          </div>
        </div>

        {/* Top Mentors */}
        <div className="glass rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">🏆 Top Mentors (by resolved doubts)</h3>
          {topMentors && topMentors.length > 0 ? (
            <div className="space-y-3">
              {topMentors.map((mentor, idx) => (
                <div key={mentor._id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-800/50 transition-all" style={{ backgroundColor: '#1A1A1A' }}>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center font-bold text-white">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-semibold">{mentor.name}</p>
                    <p className="text-gray-400 text-xs">{mentor.subject}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-purple-400 font-bold">{mentor.resolvedCount}</p>
                    <p className="text-gray-500 text-xs">resolved</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-40 flex items-center justify-center text-gray-400">
              No mentor data available
            </div>
          )}
        </div>
      </div>

      {/* Mentor Ratings */}
      {mentorRatings && mentorRatings.length > 0 && (
        <div className="glass rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">⭐ Mentor Ratings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mentorRatings.slice(0, 6).map((rating) => (
              <div key={rating._id} className="p-4 rounded-lg" style={{ backgroundColor: '#1A1A1A' }}>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-white font-semibold">{rating.name}</p>
                    <p className="text-gray-400 text-xs">{rating.subject}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-400">⭐</span>
                    <span className="text-white font-bold">{rating.avgRating}</span>
                  </div>
                </div>
                <p className="text-gray-500 text-xs">{rating.totalFeedback} reviews</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminAnalytics