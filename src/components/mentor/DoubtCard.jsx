import { useState } from 'react'
import { toast } from 'react-toastify'

function DoubtCard({ doubt, onUpdate }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [response, setResponse] = useState('')
  const [status, setStatus] = useState(doubt.status)
  const [updating, setUpdating] = useState(false)

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'text-yellow-400'
      case 'in-progress': return 'text-blue-400'
      case 'resolved': return 'text-green-400'
      default: return 'text-gray-400'
    }
  }

  const getStatusEmoji = (status) => {
    switch(status) {
      case 'pending': return '⏳'
      case 'in-progress': return '🔄'
      case 'resolved': return '✅'
      default: return '📝'
    }
  }

  const handleStatusUpdate = async (newStatus) => {
    if (!response && newStatus === 'resolved') {
      toast.error('Please provide a response before marking as resolved')
      return
    }

    setUpdating(true)
    try {
      await onUpdate(doubt._id, { status: newStatus, mentorResponse: response })
      setStatus(newStatus)
      toast.success(`Doubt marked as ${newStatus}`)
      setIsExpanded(false)
    } catch (error) {
      toast.error('Failed to update doubt')
    } finally {
      setUpdating(false)
    }
  }

  return (
    <div className="glass rounded-xl p-6 hover:glow-purple transition-all">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-lg font-bold ${getStatusColor(status)}`}>
              {getStatusEmoji(status)} {status.toUpperCase()}
            </span>
          </div>
          <h3 className="text-white font-bold text-lg mb-1">{doubt.subject}</h3>
          <p className="text-gray-400 text-sm">
            Student: {doubt.studentName} • {doubt.studentClass}
          </p>
        </div>
        <div className="text-right">
          <span className="text-gray-500 text-xs">
            {new Date(doubt.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Student's Question */}
      <div className="mb-4">
        <p className="text-gray-300 text-sm mb-2">
          <strong>Student's Query:</strong> {doubt.remarks}
        </p>
        {doubt.doubtImage && (
          <img
            src={doubt.doubtImage}
            alt="Doubt"
            className="w-full max-w-md rounded-lg mt-2 cursor-pointer"
            onClick={() => window.open(doubt.doubtImage, '_blank')}
          />
        )}
      </div>

      {/* Your Response (if exists) */}
      {doubt.mentorResponse && (
        <div className="bg-purple-900/20 rounded-lg p-4 mb-4">
          <p className="text-purple-400 text-sm font-semibold mb-1">Your Response:</p>
          <p className="text-gray-300 text-sm">{doubt.mentorResponse}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2 flex-wrap">
        {doubt.meetLink && (
          <a
            href={doubt.meetLink}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-all text-sm"
          >
            🔗 Join Meet
          </a>
        )}

        {status !== 'resolved' && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-4 py-2 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 transition-all text-sm"
          >
            {isExpanded ? 'Cancel' : '💬 Respond'}
          </button>
        )}

        {status === 'pending' && (
          <button
            onClick={() => handleStatusUpdate('in-progress')}
            disabled={updating}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all text-sm disabled:opacity-50"
          >
            🔄 Mark In Progress
          </button>
        )}
      </div>

      {/* Response Form */}
      {isExpanded && (
        <div className="mt-4 p-4 rounded-lg" style={{ backgroundColor: '#1A1A1A' }}>
          <label className="block text-sm text-gray-300 mb-2">
            Your Response *
          </label>
          <textarea
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            rows={4}
            placeholder="Provide your solution or guidance..."
            className="w-full px-4 py-3 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 mb-4"
            style={{ backgroundColor: '#2A2A2A', border: '1px solid #3A3A3A' }}
          />

          <div className="flex gap-2">
            <button
              onClick={() => handleStatusUpdate('resolved')}
              disabled={updating || !response}
              className="px-4 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-all text-sm disabled:opacity-50"
            >
              {updating ? 'Updating...' : '✓ Mark as Resolved'}
            </button>
            <button
              onClick={() => handleStatusUpdate('in-progress')}
              disabled={updating || !response}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all text-sm disabled:opacity-50"
            >
              {updating ? 'Updating...' : '💾 Save Response'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default DoubtCard