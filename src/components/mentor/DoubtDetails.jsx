import { useState } from 'react'
import { mentorAPI } from '../../services/api'

function DoubtDetails({ doubt, onClose, onUpdate }) {
  const [response, setResponse] = useState('')
  const [status, setStatus] = useState(doubt.status)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const getStatusColor = (s) => {
    switch(s) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'
      case 'in-progress': return 'bg-blue-500/20 text-blue-400 border-blue-500/50'
      case 'resolved': return 'bg-green-500/20 text-green-400 border-green-500/50'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50'
    }
  }

  const handleStatusUpdate = async (newStatus) => {
    setLoading(true)
    setError('')
    
    try {
      await mentorAPI.updateDoubtStatus(doubt._id, newStatus)
      setStatus(newStatus)
      onUpdate()
      if (newStatus === 'resolved') {
        alert('Doubt marked as resolved! 🎉')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status')
    } finally {
      setLoading(false)
    }
  }

  const handleResponseSubmit = async () => {
    if (!response.trim()) {
      setError('Please enter a response')
      return
    }

    setLoading(true)
    setError('')

    try {
      await mentorAPI.respondToDoubt(doubt._id, response)
      alert('Response sent successfully! ✅')
      setResponse('')
      onUpdate()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send response')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.9)' }}>
      <div className="glass rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Doubt Details 📝
            </h2>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(status)}`}>
              {status}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors text-2xl"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/50 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Student Info */}
        <div className="glass rounded-xl p-6 mb-6">
          <h3 className="text-lg font-bold text-white mb-4">Student Information</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-gray-400 mb-1">Name</p>
              <p className="text-white font-semibold">{doubt.studentId?.name}</p>
            </div>
            <div>
              <p className="text-gray-400 mb-1">Class</p>
              <p className="text-white font-semibold">{doubt.studentId?.class}</p>
            </div>
            <div>
              <p className="text-gray-400 mb-1">Course</p>
              <p className="text-white font-semibold">{doubt.studentId?.course}</p>
            </div>
            <div>
              <p className="text-gray-400 mb-1">Email</p>
              <p className="text-purple-400 font-semibold text-xs">{doubt.studentId?.email}</p>
            </div>
          </div>
        </div>

        {/* Doubt Details */}
        <div className="glass rounded-xl p-6 mb-6">
          <h3 className="text-lg font-bold text-white mb-4">Doubt Information</h3>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-400 mb-1">Subject</p>
              <p className="text-white font-semibold">{doubt.subject}</p>
            </div>

            <div>
              <p className="text-sm text-gray-400 mb-2">Doubt Description</p>
              <p className="text-white p-4 rounded-lg" style={{ backgroundColor: '#1A1A1A' }}>
                {doubt.remarks}
              </p>
            </div>

            {doubt.doubtImage && (
              <div>
                <p className="text-sm text-gray-400 mb-2">Attached Image</p>
                <img 
                  src={`${process.env.REACT_APP_API_URL}${doubt.doubtImage}`}
                  alt="Doubt" 
                  className="max-w-full rounded-lg border border-gray-700"
                />
              </div>
            )}

            {doubt.meetLink && (
              <div>
                <p className="text-sm text-gray-400 mb-2">Meeting Link</p>
                <a 
                  href={doubt.meetLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-4 py-2 rounded-lg gradient-bg text-white font-semibold hover:glow-purple transition-all"
                >
                  Join Google Meet 🔗
                </a>
              </div>
            )}

            <div>
              <p className="text-sm text-gray-400 mb-1">Submitted On</p>
              <p className="text-white">
                {new Date(doubt.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Status Update */}
        {status !== 'resolved' && (
          <div className="glass rounded-xl p-6 mb-6">
            <h3 className="text-lg font-bold text-white mb-4">Update Status</h3>
            <div className="flex gap-3">
              {status === 'pending' && (
                <button
                  onClick={() => handleStatusUpdate('in-progress')}
                  disabled={loading}
                  className="px-6 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-all font-semibold disabled:opacity-50"
                >
                  Mark In Progress 🔄
                </button>
              )}
              {(status === 'pending' || status === 'in-progress') && (
                <button
                  onClick={() => handleStatusUpdate('resolved')}
                  disabled={loading}
                  className="px-6 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-all font-semibold disabled:opacity-50"
                >
                  Mark as Resolved ✅
                </button>
              )}
            </div>
          </div>
        )}

        {/* Previous Response */}
        {doubt.mentorResponse && (
          <div className="glass rounded-xl p-6 mb-6">
            <h3 className="text-lg font-bold text-white mb-4">Your Previous Response</h3>
            <p className="text-gray-300 p-4 rounded-lg" style={{ backgroundColor: '#1A1A1A' }}>
              {doubt.mentorResponse}
            </p>
          </div>
        )}

        {/* Response Section */}
        <div className="glass rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">
            {doubt.mentorResponse ? 'Add Another Response' : 'Respond to Student'}
          </h3>
          
          <textarea
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            rows={4}
            className="w-full px-4 py-3 rounded-lg text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 mb-4"
            style={{ backgroundColor: '#2A2A2A', border: '1px solid #3A3A3A' }}
            placeholder="Write your response or guidance here..."
          />

          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-lg font-semibold text-gray-400 hover:text-white transition-all"
              style={{ backgroundColor: '#2A2A2A' }}
            >
              Close
            </button>
            <button
              onClick={handleResponseSubmit}
              disabled={loading || !response.trim()}
              className="flex-1 py-3 rounded-lg font-semibold text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed gradient-bg glow-purple"
            >
              {loading ? 'Sending...' : 'Send Response 📨'}
            </button>
          </div>
        </div>

        {/* Feedback Section (if resolved) */}
        {doubt.feedback && (
          <div className="glass rounded-xl p-6 mt-6">
            <h3 className="text-lg font-bold text-white mb-4">Student Feedback</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-yellow-400 text-2xl">
                  {'★'.repeat(doubt.feedback.rating)}
                  {'☆'.repeat(5 - doubt.feedback.rating)}
                </span>
                <span className="text-gray-400">({doubt.feedback.rating}/5)</span>
              </div>
              {doubt.feedback.comment && (
                <p className="text-gray-300 p-4 rounded-lg" style={{ backgroundColor: '#1A1A1A' }}>
                  {doubt.feedback.comment}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default DoubtDetails