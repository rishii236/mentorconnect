import { useState } from 'react'
import { adminAPI } from '../../services/api'

function MentorManagement({ mentors, onUpdate }) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    subject: '',
    expertise: '',
    bio: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await adminAPI.addMentor(formData)
      alert('Mentor added successfully! ✅')
      setShowAddForm(false)
      setFormData({
        name: '',
        email: '',
        password: '',
        subject: '',
        expertise: '',
        bio: ''
      })
      onUpdate()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add mentor')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (mentorId) => {
    if (!confirm('Are you sure you want to delete this mentor?')) {
      return
    }

    try {
      await adminAPI.deleteMentor(mentorId)
      alert('Mentor deleted successfully!')
      onUpdate()
    } catch (err) {
      alert('Failed to delete mentor')
    }
  }

  return (
    <div className="space-y-6">
      {/* Add Mentor Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Mentor Management 👨‍🏫</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-6 py-2 rounded-lg gradient-bg text-white font-semibold hover:glow-purple transition-all"
        >
          {showAddForm ? 'Cancel' : '+ Add Mentor'}
        </button>
      </div>

      {/* Add Mentor Form */}
      {showAddForm && (
        <div className="glass rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Add New Mentor</h3>
          
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/50 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  style={{ backgroundColor: '#2A2A2A', border: '1px solid #3A3A3A' }}
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  style={{ backgroundColor: '#2A2A2A', border: '1px solid #3A3A3A' }}
                  placeholder="mentor@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                  className="w-full px-4 py-3 rounded-lg text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  style={{ backgroundColor: '#2A2A2A', border: '1px solid #3A3A3A' }}
                  placeholder="Min 6 characters"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  style={{ backgroundColor: '#2A2A2A', border: '1px solid #3A3A3A' }}
                  placeholder="Digital Electronics"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Expertise
                </label>
                <input
                  type="text"
                  name="expertise"
                  value={formData.expertise}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  style={{ backgroundColor: '#2A2A2A', border: '1px solid #3A3A3A' }}
                  placeholder="Logic Gates, Circuits"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Bio
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 rounded-lg text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                style={{ backgroundColor: '#2A2A2A', border: '1px solid #3A3A3A' }}
                placeholder="Brief introduction..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg font-semibold text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed gradient-bg glow-purple"
            >
              {loading ? 'Adding Mentor...' : 'Add Mentor'}
            </button>
          </form>
        </div>
      )}

      {/* Mentors List */}
      <div className="space-y-4">
        {!mentors || mentors.length === 0 ? (
          <div className="glass rounded-xl p-8 text-center">
            <p className="text-gray-400">No mentors found</p>
          </div>
        ) : (
          mentors.map((mentor) => (
            <div key={mentor._id} className="glass rounded-xl p-6 hover-lift transition-all">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-1">
                    {mentor.name}
                  </h3>
                  <p className="text-purple-400 text-sm mb-2">{mentor.subject}</p>
                  <div className="space-y-1 text-sm text-gray-400">
                    <p><span className="text-gray-300">Email:</span> {mentor.email}</p>
                    <p><span className="text-gray-300">Expertise:</span> {mentor.expertise}</p>
                    {mentor.bio && (
                      <p className="text-xs mt-2">{mentor.bio}</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(mentor._id)}
                  className="px-4 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all text-sm font-semibold"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default MentorManagement