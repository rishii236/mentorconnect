import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import axios from 'axios'
import { toast } from 'react-toastify'

function FeedbackView() {
  const { API_URL } = useAuth()
  const [feedback, setFeedback] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFeedback()
  }, [])

  const fetchFeedback = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      
      const response = await axios.get(`${API_URL}/feedback/received`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.data.success) {
        setFeedback(response.data.data)
        setStats(response.data.stats)
      }
    } catch (error) {
      console.error('Failed to fetch feedback:', error)
      toast.error('Failed to load feedback')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="spinner"></div>
      </div>
    )
  }

  if (!feedback || feedback.length === 0) {
    return (
      <div className="glass rounded-xl p-12 text-center">
        <p className="text-6xl mb-4">🔭</p>
        <p className="text-gray-400 text-xl mb-2">No feedback received yet</p>
        <p className="text-gray-500 text-sm">
          Keep helping students and you'll receive ratings soon!
        </p>
      </div>
    )
  }

  const avgRating = stats?.avgRating?.toFixed(1) || '0.0'
  const totalFeedback = stats?.totalFeedback || 0
  const satisfactionRate = feedback.length > 0
    ? Math.round((feedback.filter(f => f.rating >= 4).length / feedback.length) * 100)
    : 0

  // Calculate rating distribution
  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  feedback.forEach(f => {
    distribution[f.rating] = (distribution[f.rating] || 0) + 1
  })

  return (
    <div className="space-y-6">
      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass rounded-xl p-6 text-center hover:glow-purple transition-all">
          <p className="text-gray-400 text-sm mb-2">Average Rating</p>
          <div className="flex items-center justify-center gap-2">
            <p className="text-5xl font-bold text-yellow-400">{avgRating}</p>
            <span className="text-3xl text-yellow-400">★</span>
          </div>
          <p className="text-gray-500 text-xs mt-2">out of 5.0</p>
        </div>

        <div className="glass rounded-xl p-6 text-center hover:glow-purple transition-all">
          <p className="text-gray-400 text-sm mb-2">Total Feedback</p>
          <p className="text-5xl font-bold text-purple-400">{totalFeedback}</p>
          <p className="text-gray-500 text-xs mt-2">reviews received</p>
        </div>

        <div className="glass rounded-xl p-6 text-center hover:glow-purple transition-all">
          <p className="text-gray-400 text-sm mb-2">Satisfaction Rate</p>
          <p className="text-5xl font-bold text-green-400">{satisfactionRate}%</p>
          <p className="text-gray-500 text-xs mt-2">4+ stars</p>
        </div>
      </div>

      {/* Rating Distribution */}
      <div className="glass rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-6">⭐ Rating Distribution</h3>
        <div className="space-y-3">
          {[5, 4, 3, 2, 1].map(star => {
            const count = distribution[star] || 0
            const percentage = totalFeedback > 0 ? (count / totalFeedback) * 100 : 0
            
            return (
              <div key={star} className="flex items-center gap-4">
                <span className="text-yellow-400 text-sm font-semibold w-16">
                  {star} ★
                </span>
                <div className="flex-1 h-8 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full gradient-bg transition-all duration-500 flex items-center justify-end pr-3"
                    style={{ width: `${percentage}%` }}
                  >
                    {percentage > 10 && (
                      <span className="text-white text-xs font-semibold">
                        {percentage.toFixed(0)}%
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-gray-400 text-sm w-16 text-right font-semibold">
                  {count}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Top Tags */}
      {stats?.topTags && stats.topTags.length > 0 && (
        <div className="glass rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">🏷️ Most Common Tags</h3>
          <div className="flex flex-wrap gap-3">
            {stats.topTags.map((tag, idx) => (
              <div 
                key={idx}
                className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30"
              >
                <span className="text-purple-300 font-semibold text-sm">
                  {tag._id}
                </span>
                <span className="text-gray-400 text-xs ml-2">
                  ({tag.count})
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Feedback */}
      <div className="glass rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-6">💬 Recent Feedback</h3>
        <div className="space-y-4">
          {feedback.slice(0, 10).map(item => (
            <div 
              key={item._id} 
              className="p-5 rounded-xl hover:bg-gray-800/50 transition-all" 
              style={{ backgroundColor: '#1A1A1A' }}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-white font-semibold text-lg">{item.student?.name || 'Anonymous'}</p>
                  <p className="text-sm text-gray-400">
                    {item.student?.class} • {item.student?.course}
                  </p>
                  {item.doubt?.subject && (
                    <p className="text-xs text-purple-400 mt-1">
                      Subject: {item.doubt.subject}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span 
                      key={i} 
                      className={`text-xl ${i < item.rating ? 'text-yellow-400' : 'text-gray-700'}`}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>

              {item.comment && (
                <p className="text-gray-300 text-sm mb-3 italic pl-4 border-l-2 border-purple-500">
                  "{item.comment}"
                </p>
              )}

              {item.tags && item.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {item.tags.map((tag, idx) => (
                    <span 
                      key={idx}
                      className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 text-xs font-medium border border-purple-500/20"
                    >
                      {tag.replace('-', ' ')}
                    </span>
                  ))}
                </div>
              )}

              <p className="text-xs text-gray-500">
                {new Date(item.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>

        {feedback.length > 10 && (
          <div className="mt-6 text-center">
            <button className="px-6 py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 transition-all text-sm font-semibold">
              Load More
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default FeedbackView