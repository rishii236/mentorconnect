import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { SocketProvider } from './context/SocketContext'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import StudentDashboard from './pages/StudentDashboard'
import MentorDashboard from './pages/MentorDashboard'
import AdminDashboard from './pages/AdminDashboard'
import ComingSoon from  './pages/ComingSoon.jsx'

import PrivateRoute from './components/PrivateRoute'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <Router>
          <div className="min-h-screen">
            <Routes>
              {/* Public Routes */}
              <Route path="/features" element={<ComingSoon />} />
             <Route path="/how-it-works" element={<ComingSoon />} />
            <Route path="/help" element={<ComingSoon />} />
             <Route path="/contact" element={<ComingSoon />} />
             <Route path="/privacy" element={<ComingSoon />} />
             <Route path="/terms" element={<ComingSoon />} />
             <Route path="/docs" element={<ComingSoon />} />
             <Route path="/blog" element={<ComingSoon />} />
             <Route path="/stories" element={<ComingSoon />} />
             <Route path="/events" element={<ComingSoon />} />
             <Route path="/support" element={<ComingSoon />} />

              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected Routes */}
              
              <Route 
                path="/student-dashboard" 
                element={
                  <PrivateRoute role="student">
                    <StudentDashboard />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/mentor-dashboard" 
                element={
                  <PrivateRoute role="mentor">
                    <MentorDashboard />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/admin-dashboard" 
                element={
                  <PrivateRoute role="admin">
                    <AdminDashboard />
                  </PrivateRoute>
                } 
              />
            </Routes>

            {/* Toast Notifications */}
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="dark"
              style={{
                background: 'linear-gradient(135deg, #9333EA 0%, #C084FC 100%)',
              }}
            />
          </div>
        </Router>
      </SocketProvider>
    </AuthProvider>
  )
}

export default App