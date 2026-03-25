import { useState } from 'react'

function DoubtList({ doubts, onSelectDoubt }) {
  const [filter, setFilter] = useState('all')

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

  const filteredDoubts = filter === 'all' 
    ? doubts 
    : doubts.filter(d => d.status === filter)

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="glass rounded-xl p-2 inline-flex gap-2">
        {['all', 'pending', 'in-progress', 'resolved'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg font-semibold transition-all capitalize ${
              filter === status
                ? 'gradient-bg text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {status === 'all' ? 'All' : status.replace('-', ' ')}
          </button>
        ))}
      </div>

      {/* Doubts List */}
      {filteredDoubts.length === 0 ? (
        <div className="glass rounded-xl p-8 text-center">
          <p className="text-gray-400 text-lg">
            No {filter !== 'all' ? filter : ''} doubts found 📭
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredDoubts.map((doubt) => (
            <div
              key={doubt._id}
              onClick={() => onSelectDoubt(doubt)}
              className="glass rounded-xl p-6 hover-lift cursor-pointer transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-white">
                      {doubt.studentId?.name}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(doubt.status)}`}>
                      {getStatusIcon(doubt.status)} {doubt.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span>📚 {doubt.subject}</span>
                    <span>🎓 {doubt.studentId?.class}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">
                    {new Date(doubt.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-gray-600">
                    {new Date(doubt.createdAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-300 line-clamp-2">
                  <span className="font-medium text-purple-400">Doubt: </span>
                  {doubt.remarks}
                </p>

                {doubt.doubtImage && (
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <span>📎 Image attached</span>
                  </div>
                )}

                {doubt.meetLink && (
                  <div className="flex items-center gap-2 text-sm text-purple-400">
                    <span>🔗 Meeting link provided</span>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-700 flex justify-between items-center">
                <div className="text-xs text-gray-500">
                  Click to {doubt.status === 'resolved' ? 'view details' : 'respond'}
                </div>
                <div className="text-purple-400 font-semibold">
                  →
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default DoubtList