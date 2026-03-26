import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const RATING_TAGS = [
  'helpful',
  'knowledgeable',
  'patient',
  'clear-explanation',
  'responsive',
  'friendly'
]

function RatingModal({ doubt, mentor, appointment, onClose, onSuccess }) {
  const { API_URL } = useAuth()
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [comment, setComment] = useState('')
  const [selectedTags, setSelectedTags] = useState([])
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (rating === 0) {
      toast.error('Please select a rating')
      return
    }

    try {
      setSubmitting(true)
      const token = localStorage.getItem('token')

      await axios.post(`${API_URL}/api/feedback`, {
        mentorId: mentor?._id,
        doubtId: doubt?._id,
        appointmentId: appointment?._id,
        rating,
        comment,
        tags: selectedTags
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })

      toast.success('Thank you for your feedback! ⭐')
      if (onSuccess) onSuccess()
      onClose()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit feedback')
      console.error(error)
    } finally {
      setSubmitting(false)
    }
  }

  const toggleTag = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
      onClick={handleBackdropClick}
    >
      <div className="glass rounded-2xl p-8 max-w-lg w-full">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold gradient-text mb-2">
              ⭐ Rate Your Experience
            </h2>
            <p className="text-gray-400 text-sm">
              How was your session with {mentor?.name}?
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg"
            type="button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Star Rating */}
          <div className="text-center">
            <p className="text-gray-300 mb-4">Select your rating</p>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="text-5xl transition-all transform hover:scale-110"
                >
                  {star <= (hoveredRating || rating) ? (
                    <span className="text-yellow-400">⭐</span>
                  ) : (
                    <span className="text-gray-600">⭐</span>
                  )}
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-purple-400 mt-2 font-semibold">
                {rating === 5 && '🎉 Excellent!'}
                {rating === 4 && '😊 Great!'}
                {rating === 3 && '👍 Good'}
                {rating === 2 && '😐 Fair'}
                {rating === 1 && '😞 Needs Improvement'}
              </p>
            )}
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm text-gray-300 mb-3">
              What did you like? (Optional)
            </label>
            <div className="flex flex-wrap gap-2">
              {RATING_TAGS.map(tag => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedTags.includes(tag)
                      ? 'gradient-bg text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {tag.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Additional Comments (Optional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              placeholder="Share your thoughts about this session..."
              className="w-full px-4 py-3 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              style={{ backgroundColor: '#2A2A2A', border: '1px solid #3A3A3A' }}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting || rating === 0}
            className="w-full py-3 rounded-lg gradient-bg text-white font-semibold hover:glow-purple transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Submitting...' : '✓ Submit Feedback'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default RatingModal