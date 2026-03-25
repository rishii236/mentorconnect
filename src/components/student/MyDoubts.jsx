import { useState } from 'react'

function MyDoubts({ doubts, onFeedback }) {
  const [selectedDoubt, setSelectedDoubt] = useState(null)
  const [rating, setRating] = useState(0)
  const [feedback, setFeedback] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'
      case 'in-progress':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/50'
      case 'resolved':
        return 'bg-green-500/20 text-green-400 border-green-500/50'
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50'
    }
  }

  const getStatusIcon = (status) => {
    switch(status) {
      case 'pending': return '⏳'
      case 'in-progress': return '🔄'
      case 'resolved': return '✅'
      default: return '📝'
    }
  }

  const handleFeedbackSubmit = async () => {
    if (rating === 0) {
      alert('Please select a rating')
      return
    }

    setSubmitting(true)
    try {
      await onFeedback(selectedDoubt._id, { rating, feedback })
      alert('Feedback submitted successfully!')
      setSelectedDoubt(null)
      setRating(0)
      setFeedback('')
    } catch (error) {
      alert('Failed to submit feedback')
    } finally {
      setSubmitting(false)
    }
  }

  if (!doubts || doubts.length === 0) {
    return (
      <div className="glass rounded-xl p-8 text-center">
        <p className="text-gray-400 text-lg">No doubts submitted yet 📭</p>
        <p className="text-gray-500 text-sm mt-2">Select a mentor to ask your first doubt!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {doubts.map((doubt) => (
        <div key={doubt._id} className="glass rounded-xl p-6 hover-lift transition-all">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-bold text-white">
                  {doubt.mentorId?.name || 'Unknown Mentor'}
                </h3>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(doubt.status)}`}>
                  {getStatusIcon(doubt.status)} {doubt.status}
                </span>
              </div>
              <p className="text-sm text-purple-400">{doubt.subject}</p>
            </div>
            <p className="text-xs text-gray-500">
              {new Date(doubt.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-gray-300 mb-1">Your Doubt:</p>
              <p className="text-sm text-gray-400">{doubt.remarks}</p>
            </div>

            {doubt.doubtImage && (
              <div>
                <p className="text-sm font-medium text-gray-300 mb-2">Attached Image:</p>
                <img 
                  src={`http://localhost:5000${doubt.doubtImage}`}
                  alt="Doubt" 
                  className="max-w-xs rounded-lg border border-gray-700"
                />
              </div>
            )}

            {doubt.meetLink && (
              <div>
                <p className="text-sm font-medium text-gray-300 mb-1">Meeting Link:</p>
                <a 
                  href={doubt.meetLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-purple-400 hover:text-purple-300 underline"
                >
                  Join Google Meet 🔗
                </a>
              </div>
            )}

            {doubt.mentorResponse && (
              <div className="mt-4 p-4 rounded-lg" style={{ backgroundColor: '#1A1A1A' }}>
                <p className="text-sm font-medium text-green-400 mb-2">✨ Mentor Response:</p>
                <p className="text-sm text-gray-300">{doubt.mentorResponse}</p>
              </div>
            )}

            {doubt.status === 'resolved' && !doubt.feedback && (
              <button
                onClick={() => setSelectedDoubt(doubt)}
                className="mt-4 px-4 py-2 rounded-lg gradient-bg text-white font-semibold hover:glow-purple transition-all"
              >
                Give Feedback ⭐
              </button>
            )}

            {doubt.feedback && (
              <div className="mt-4 p-4 rounded-lg" style={{ backgroundColor: '#1A1A1A' }}>
                <p className="text-sm font-medium text-purple-400 mb-2">
                  Your Feedback: {'⭐'.repeat(doubt.feedback.rating)}
                </p>
                {doubt.feedback.comment && (
                  <p className="text-sm text-gray-400">{doubt.feedback.comment}</p>
                )}
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Feedback Modal */}
      {selectedDoubt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}>
          <div className="glass rounded-2xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-white mb-4">
              Rate Your Experience ⭐
            </h2>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-300 mb-3">How was the session?</p>
                <div className="flex gap-2 justify-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className={`text-4xl transition-all ${
                        star <= rating ? 'text-yellow-400' : 'text-gray-600'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Additional Comments (Optional)
                </label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  style={{ backgroundColor: '#2A2A2A', border: '1px solid #3A3A3A' }}
                  placeholder="Share your experience..."
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setSelectedDoubt(null)}
                  className="flex-1 py-3 rounded-lg font-semibold text-gray-400 hover:text-white transition-all"
                  style={{ backgroundColor: '#2A2A2A' }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleFeedbackSubmit}
                  disabled={submitting || rating === 0}
                  className="flex-1 py-3 rounded-lg font-semibold text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed gradient-bg glow-purple"
                >
                  {submitting ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MyDoubts