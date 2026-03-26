import axios from 'axios'

// ✅ Never hardcode a URL. Read from the environment variable first,
//    fall back to localhost only for local development.
const API = import.meta.env.VITE_API_URL;
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,          // send cookies / auth headers cross-origin
  headers: {
    'Content-Type': 'application/json',
  },
})

// ---------------------------------------------------------------------------
// Request interceptor – attach JWT stored in localStorage (if present)
// ---------------------------------------------------------------------------
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ---------------------------------------------------------------------------
// Response interceptor – centralise error handling
// ---------------------------------------------------------------------------
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid → redirect to login
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// ---------------------------------------------------------------------------
// Auth endpoints
// ---------------------------------------------------------------------------
export const authAPI = {
  login:    (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  logout:   ()     => api.post('/auth/logout'),
  getMe:    ()     => api.get('/auth/me'),
}

// ---------------------------------------------------------------------------
// Admin endpoints
// ---------------------------------------------------------------------------
export const adminAPI = {
  getAllMentors:  ()     => api.get('/admin/mentors'),
  getStats:      ()     => api.get('/admin/stats'),
  deleteMentor:  (id)   => api.delete(`/admin/mentors/${id}`),
  updateMentor:  (id, data) => api.put(`/admin/mentors/${id}`, data),
}

// ---------------------------------------------------------------------------
// Mentor endpoints
// ---------------------------------------------------------------------------
export const mentorAPI = {
  getProfile:    ()     => api.get('/mentor/profile'),
  updateProfile: (data) => api.put('/mentor/profile', data),
  getDoubts:     ()     => api.get('/mentor/doubts'),
  resolveDoubt:  (id, data) => api.put(`/mentor/doubts/${id}/resolve`, data),
}

// ---------------------------------------------------------------------------
// Student / doubts endpoints
// ---------------------------------------------------------------------------
export const doubtAPI = {
  submitDoubt: (data) => api.post('/doubts', data),
  getMyDoubts: ()     => api.get('/doubts/my'),
  getDoubt:    (id)   => api.get(`/doubts/${id}`),
}

export default api