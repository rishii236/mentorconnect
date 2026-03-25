import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function PrivateRoute({ children, role }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0A0A0A' }}>
        <div className="spinner"></div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (role && user.role !== role) {
    // Redirect to appropriate dashboard based on user role
    if (user.role === 'student') {
      return <Navigate to="/student-dashboard" replace />
    } else if (user.role === 'mentor') {
      return <Navigate to="/mentor-dashboard" replace />
    } else if (user.role === 'admin') {
      return <Navigate to="/admin-dashboard" replace />
    }
  }

  return children
}

export default PrivateRoute