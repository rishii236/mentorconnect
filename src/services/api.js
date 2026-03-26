import axios from 'axios'

const API_URL = `${import.meta.env.VITE_API_URL}/api`; 
// Get token from localStorage
const getToken = () => localStorage.getItem('token')

// Configure axios defaults
axios.defaults.baseURL = API_URL
axios.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Student APIs
export const studentAPI = {
  getAllMentors: () => axios.get('/student/mentors'),
  submitDoubt: (doubtData) => axios.post('/student/doubt', doubtData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getMyDoubts: () => axios.get('/student/my-doubts'),
  submitFeedback: (doubtId, feedbackData) => 
    axios.post(`/student/doubt/${doubtId}/feedback`, feedbackData)
}

// Mentor APIs
export const mentorAPI = {
  getMyDoubts: (filter = 'all') => axios.get(`/mentor/doubts?status=${filter}`),
  getDoubtDetails: (doubtId) => axios.get(`/mentor/doubt/${doubtId}`),
  updateDoubtStatus: (doubtId, status) => 
    axios.patch(`/mentor/doubt/${doubtId}/status`, { status }),
  respondToDoubt: (doubtId, response) => 
    axios.post(`/mentor/doubt/${doubtId}/respond`, { response })
}

// Admin APIs
export const adminAPI = {
  getAllMentors: () => axios.get('/admin/mentors'),
  addMentor: (mentorData) => axios.post('/admin/mentor', mentorData),
  deleteMentor: (mentorId) => axios.delete(`/admin/mentor/${mentorId}`),
  getStats: () => axios.get('/admin/stats')
}

export default { studentAPI, mentorAPI, adminAPI }