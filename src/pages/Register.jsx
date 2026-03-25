import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Vortex } from '../components/ui/Vortex'

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    // Student fields
    class: '',
    course: '',
    // Mentor fields
    subject: '',
    expertise: '',
    bio: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    // Client-side validation
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long')
      return
    }
    
    setLoading(true)

    try {
      const data = await register(formData)
      
      // Redirect based on role
      if (data.role === 'student') {
        navigate('/student-dashboard')
      } else if (data.role === 'mentor') {
        navigate('/mentor-dashboard')
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full overflow-hidden">
      <Vortex
        backgroundColor="#000000"
        rangeY={800}
        particleCount={400}
        baseHue={270}
        baseOpacity={0.3}
        className="flex items-center justify-center px-2 md:px-10 py-8 w-full min-h-screen"
        containerClassName="w-full min-h-screen"
      >
        <div className="w-full max-w-2xl">
          
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold gradient-text mb-3">
              Get Started with MentorConnect
            </h1>
            <p className="text-gray-400 text-base">
              Join our community of learners and educators
            </p>
          </div>

          {/* Register Form */}
          <div className="glass rounded-2xl p-8 shadow-2xl">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold text-white">
                     Create Your Account
              </h2>
              <p className="text-gray-400 text-sm mt-1">
                Please fill in your details to register
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/50 text-red-300 text-sm">
                <strong>Error:</strong> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Role Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Account Type
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'student' })}
                    className={`p-4 rounded-lg font-semibold transition-all duration-300 border ${
                      formData.role === 'student'
                        ? 'gradient-bg text-white glow-purple border-transparent'
                        : 'glass text-gray-300 border-gray-600 hover:border-purple-500'
                    }`}
                  >
                    <div className="text-2xl mb-1">🎓</div>
                    <div>Student</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'mentor' })}
                    className={`p-4 rounded-lg font-semibold transition-all duration-300 border ${
                      formData.role === 'mentor'
                        ? 'gradient-bg text-white glow-purple border-transparent'
                        : 'glass text-gray-300 border-gray-600 hover:border-purple-500'
                    }`}
                  >
                    <div className="text-2xl mb-1">👨‍🏫</div>
                    <div>Mentor</div>
                  </button>
                </div>
              </div>

              {/* Common Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    style={{ backgroundColor: '#2A2A2A', border: '1px solid #3A3A3A' }}
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    style={{ backgroundColor: '#2A2A2A', border: '1px solid #3A3A3A' }}
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password <span className="text-red-400">*</span>
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
                  placeholder="Minimum 6 characters"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Use a strong password with letters, numbers, and symbols
                </p>
              </div>

              {/* Student Specific Fields */}
              {formData.role === 'student' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Current Class <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="class"
                      value={formData.class}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      style={{ backgroundColor: '#2A2A2A', border: '1px solid #3A3A3A' }}
                      placeholder="e.g., BSCIT Sem 3"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Course/Program <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="course"
                      value={formData.course}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      style={{ backgroundColor: '#2A2A2A', border: '1px solid #3A3A3A' }}
                      placeholder="e.g., BSCIT"
                    />
                  </div>
                </div>
              )}

              {/* Mentor Specific Fields */}
              {formData.role === 'mentor' && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Subject Area <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-lg text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        style={{ backgroundColor: '#2A2A2A', border: '1px solid #3A3A3A' }}
                        placeholder="e.g., Computer Science"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Areas of Expertise <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        name="expertise"
                        value={formData.expertise}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-lg text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        style={{ backgroundColor: '#2A2A2A', border: '1px solid #3A3A3A' }}
                        placeholder="e.g., Data Structures, Algorithms"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Professional Bio
                    </label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-3 rounded-lg text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                      style={{ backgroundColor: '#2A2A2A', border: '1px solid #3A3A3A' }}
                      placeholder="Brief introduction about your teaching experience and approach..."
                    />
                  </div>
                </>
              )}

              {/* Register Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg font-semibold text-white transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed gradient-bg glow-purple mt-6"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="spinner mr-2"></div>
                    Creating your account...
                  </div>
                ) : (
                  'Register'
                )}
              </button>

              {/* Terms Notice */}
              <p className="text-xs text-gray-500 text-center mt-4">
                By registering, you agree to our Terms of Service and Privacy Policy
              </p>
            </form>

            {/* Login Link */}
            <div className="mt-6 pt-6 border-t border-gray-700">
              <p className="text-gray-400 text-sm text-center">
                Already have an account?{' '}
                <Link 
                  to="/login" 
                  className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-6 space-y-2">
            <p className="text-gray-500 text-xs">
              
            </p>
            <p className="text-gray-600 text-xs">
              © 2026 MentorConnect. All rights reserved.
            </p>
          </div>
        </div>
      </Vortex>
    </div>
  )
}

export default Register