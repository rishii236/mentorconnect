import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import axios from 'axios'

function DoubtModal({ mentor, onClose, onSuccess }) {
  const { API_URL } = useAuth()
  
  const [formData, setFormData] = useState({
    subject: mentor.subject,
    remarks: '',
    meetLink: ''
  })
  const [doubtImage, setDoubtImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setDoubtImage(file)
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setDoubtImage(null)
    setImagePreview(null)
    // Reset file input
    const fileInput = document.getElementById('doubt-image')
    if (fileInput) fileInput.value = ''
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Create FormData for file upload
      const data = new FormData()
      data.append('mentorId', mentor._id)
      data.append('subject', formData.subject)
      data.append('remarks', formData.remarks)
      data.append('meetLink', formData.meetLink)
      
      // Only append image if one was selected
      if (doubtImage) {
        data.append('doubtImage', doubtImage)
      }

      await axios.post(`${API_URL}/api/doubts`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      // Success
      onSuccess()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit doubt')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}>
      <div className="glass rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold gradient-text mb-2">
              Submit Your Doubt
            </h2>
            <p className="text-gray-400 text-sm">
              Asking {mentor.name} • {mentor.subject}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/50 text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Subject (pre-filled) */}
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
            />
          </div>

          {/* Doubt Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Describe your doubt *
            </label>
            <textarea
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-4 py-3 rounded-lg text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              style={{ backgroundColor: '#2A2A2A', border: '1px solid #3A3A3A' }}
              placeholder="Explain your doubt in detail..."
            />
          </div>

          {/* Image Upload - NOW OPTIONAL! */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              📸 Upload Image <span className="text-gray-500 font-normal">(Optional)</span>
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              id="doubt-image"
            />
            <label
              htmlFor="doubt-image"
              className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-300 hover:border-purple-500"
              style={{ borderColor: '#3A3A3A', backgroundColor: '#2A2A2A' }}
            >
              {imagePreview ? (
                <div className="relative w-full h-full flex items-center justify-center">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-h-36 rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      handleRemoveImage()
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-all"
                    title="Remove image"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-4xl mb-2">📷</p>
                  <p className="text-sm text-gray-400">Click to upload image</p>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB (Optional)</p>
                </div>
              )}
            </label>
            <p className="text-xs text-gray-500 mt-2">
              💡 Upload an image if you have diagrams, equations, or screenshots. For career guidance or general questions, this is optional.
            </p>
          </div>

          {/* Google Meet Link */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Google Meet Link *
            </label>
            <input
              type="url"
              name="meetLink"
              value={formData.meetLink}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              style={{ backgroundColor: '#2A2A2A', border: '1px solid #3A3A3A' }}
              placeholder="https://meet.google.com/..."
            />
            <p className="text-xs text-gray-500 mt-1">
              Create a Google Meet link where mentor can connect with you
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-lg font-semibold bg-gray-800 text-gray-400 hover:bg-gray-700 transition-all duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 rounded-lg font-semibold gradient-bg text-white transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed glow-purple"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="spinner mr-2"></div>
                  Submitting...
                </div>
              ) : (
                'Submit Doubt'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default DoubtModal