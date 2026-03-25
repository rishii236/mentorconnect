function MentorCard({ mentor, onAskDoubt, onBookAppointment }) {
  const subjectIcons = {
    'Digital Electronics': '💻',
    'AI': '🤖',
    'OOPS': '🎯',
    'Communication': '💬',
    'Commercial Applications': '📊',
    'default': '📚'
  }

  const getIcon = (subject) => {
    return subjectIcons[subject] || subjectIcons['default']
  }

  return (
    <div className="glass rounded-xl p-6 hover-lift transition-all duration-300 hover:border-purple-500">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div className="w-12 h-12 rounded-full gradient-bg flex items-center justify-center text-2xl">
            {getIcon(mentor.subject)}
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-bold text-white">{mentor.name}</h3>
            <p className="text-sm text-purple-400">{mentor.subject}</p>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-semibold gradient-bg">
          Available
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <p className="text-sm text-gray-400">
          <span className="text-gray-300 font-medium">Expertise:</span> {mentor.expertise}
        </p>
        {mentor.bio && (
          <p className="text-sm text-gray-400 line-clamp-2">
            {mentor.bio}
          </p>
        )}
      </div>

      <div className="space-y-2 pt-4 border-t border-gray-700">
        {/* Ask Doubt Button */}
        {onAskDoubt && (
          <button 
            onClick={onAskDoubt}
            className="w-full py-2 px-4 rounded-lg gradient-bg text-white font-semibold hover:glow-purple transition-all"
          >
            💡 Ask a Doubt
          </button>
        )}
        
        {/* Book Appointment Button */}
        {onBookAppointment && (
          <button 
            onClick={onBookAppointment}
            className="w-full py-2 px-4 rounded-lg text-white font-semibold hover:glow-purple transition-all border border-purple-500/50 hover:bg-purple-500/10"
          >
            📅 Book Appointment
          </button>
        )}
      </div>
    </div>
  )
}

export default MentorCard