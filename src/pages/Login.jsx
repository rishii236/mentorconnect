import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Vortex } from '../components/ui/Vortex'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const data = await login(email, password)
      
      // Redirect based on role
      if (data.role === 'student') {
        navigate('/student-dashboard')
      } else if (data.role === 'mentor') {
        navigate('/mentor-dashboard')
      } else if (data.role === 'admin') {
        navigate('/admin-dashboard')
      }
    } catch (err) {
      setError(err.message || 'Invalid credentials. Please check your email and password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full overflow-hidden">
      <Vortex
        backgroundColor="#000000"
        rangeY={800}
        particleCount={500}
        baseHue={270}
        className="flex items-center justify-center px-2 md:px-10 py-4 w-full h-full"
        containerClassName="w-full h-screen"
      >
        <div className="w-full max-w-md">
          
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold gradient-text mb-3">
              MentorConnect
            </h1>
            <p className="text-gray-400 text-base">
              A platform bridging students and mentors for academic excellence
            </p>
          </div>

          {/* Login Form */}
          <div className="glass rounded-2xl p-8 shadow-2xl">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white">
                Sign In
              </h2>
              <p className="text-gray-400 text-sm mt-1">
                Access your dashboard to continue learning
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/50 text-red-300 text-sm">
                <strong>Error:</strong> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Input */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  style={{ 
                    backgroundColor: '#2A2A2A',
                    border: '1px solid #3A3A3A'
                  }}
                  placeholder="your.email@example.com"
                  autoComplete="email"
                />
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  style={{ 
                    backgroundColor: '#2A2A2A',
                    border: '1px solid #3A3A3A'
                  }}
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg font-semibold text-white transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed gradient-bg glow-purple mt-6"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="spinner mr-2"></div>
                    Authenticating...
                  </div>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            {/* Register Link */}
            <div className="mt-6 pt-6 border-t border-gray-700">
              <p className="text-gray-400 text-sm text-center">
                New to MentorConnect?{' '}
                <Link 
                  to="/register" 
                  className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
                >
                  Create an account
                </Link>
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-6 space-y-2">
            <p className="text-gray-500 text-xs">
            
            </p>
            <p className="text-gray-600 text-xs">
              © 2026 MentorConnect • Built with 💜 by Swara 
            </p>
          </div>
        </div>
      </Vortex>
    </div>
  )
}

export default Login