import { useState } from 'react'
import { studentAPI } from '../../services/api'
import { useAuth } from '../../context/AuthContext'

function DoubtForm({ mentor, onClose }) {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    subject: mentor.subject,
    remarks: '',
    meetLink: ''
  })
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('Image size should be less than 5MB')
        return
      }
      setImage(file)
      setImagePreview(URL.createObjectURL(file))
      setError('')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const submitData = new FormData()
      submitData.append('mentorId', mentor._id)
      submitData.append('subject', formData.subject)
      submitData.append('remarks', formData.remarks)
      submitData.append('meetLink', formData.meetLink)
      if (image) {
        submitData.append('image', image)
      }

      await studentAPI.submitDoubt(submitData)
      setSuccess(true)
      
      setTimeout(() => {
        onClose()
        window.location.reload() // Refresh to show new doubt
      }, 1500)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit doubt')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}>
      <div className="glass rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">
            Submit Doubt to {mentor.name} 📝
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors text-2xl"
          >
            ✕
          </button>
        </div>

        {success && (
          <div className="mb-4 p-4 rounded-lg bg-green-500/10 border border-green-500/50 text-green-400">
            ✅ Doubt submitted successfully! Redirecting...
          </div>
        )}

        {error && (
          <div className="mb-4 p-4 rounded-lg bg-red-500/10 border border-red-500/50 text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Student Info (Read-only) */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Your Name
              </label>
              <input
                type="text"
                value={user?.name}
                disabled
                className="w-full px-4 py-3 rounded-lg text-gray-400 cursor-not-allowed"
                style={{ backgroundColor: '#1A1A1A', border: '1px solid #2A2A2A' }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Class
              </label>
              <input
                type="text"
                value={user?.class}
                disabled
                className="w-full px-4 py-3 rounded-lg text-gray-400 cursor-not-allowed"
                style={{ backgroundColor: '#1A1A1A', border: '1px solid #2A2A2A' }}
              />
            </div>
          </div>

          {/* Subject (Pre-filled) */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Subject/Course Name
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

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Upload Doubt Image 📷
            </label>
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="block w-full px-4 py-3 rounded-lg cursor-pointer transition-all duration-300 hover:border-purple-500 text-center"
                style={{ 
                  backgroundColor: '#2A2A2A', 
                  border: '2px dashed #3A3A3A' 
                }}
              >
                {imagePreview ? (
                  <div className="space-y-2">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="max-h-48 mx-auto rounded-lg"
                    />
                    <p className="text-purple-400 text-sm">Click to change image</p>
                  </div>
                ) : (
                  <div className="text-gray-400">
                    <p>Click to upload doubt image</p>
                    <p className="text-xs mt-1">PNG, JPG up to 5MB</p>
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* Remarks */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Describe Your Doubt 💭
            </label>
            <textarea
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-4 py-3 rounded-lg text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              style={{ backgroundColor: '#2A2A2A', border: '1px solid #3A3A3A' }}
              placeholder="Explain what you're struggling with..."
            />
          </div>

          {/* Google Meet Link */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Google Meet Link 🔗
            </label>
            <input
              type="url"
              name="meetLink"
              value={formData.meetLink}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              style={{ backgroundColor: '#2A2A2A', border: '1px solid #3A3A3A' }}
              placeholder="https://meet.google.com/xxx-xxxx-xxx (optional)"
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-lg font-semibold text-gray-400 hover:text-white transition-all"
              style={{ backgroundColor: '#2A2A2A' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.remarks}
              className="flex-1 py-3 rounded-lg font-semibold text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed gradient-bg glow-purple"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="spinner mr-2"></div>
                  Submitting...
                </div>
              ) : (
                'Submit Doubt 🚀'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default DoubtForm