// Date formatting helpers
export const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export const formatDateTime = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export const timeAgo = (date) => {
  if (!date) return 'N/A'
  
  const seconds = Math.floor((new Date() - new Date(date)) / 1000)
  
  let interval = seconds / 31536000
  if (interval > 1) return Math.floor(interval) + ' years ago'
  
  interval = seconds / 2592000
  if (interval > 1) return Math.floor(interval) + ' months ago'
  
  interval = seconds / 86400
  if (interval > 1) return Math.floor(interval) + ' days ago'
  
  interval = seconds / 3600
  if (interval > 1) return Math.floor(interval) + ' hours ago'
  
  interval = seconds / 60
  if (interval > 1) return Math.floor(interval) + ' minutes ago'
  
  return Math.floor(seconds) + ' seconds ago'
}

// Status helpers
export const getStatusColor = (status) => {
  const colors = {
    pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
    'in-progress': 'bg-blue-500/20 text-blue-400 border-blue-500/50',
    resolved: 'bg-green-500/20 text-green-400 border-green-500/50'
  }
  return colors[status] || 'bg-gray-500/20 text-gray-400 border-gray-500/50'
}

export const getStatusIcon = (status) => {
  const icons = {
    pending: '⏳',
    'in-progress': '🔄',
    resolved: '✅'
  }
  return icons[status] || '📝'
}

// File helpers
export const validateImageFile = (file) => {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
  const maxSize = 5 * 1024 * 1024 // 5MB
  
  if (!file) return { valid: false, error: 'No file selected' }
  
  if (!validTypes.includes(file.type)) {
    return { valid: false, error: 'Please upload a valid image file (JPG, PNG, GIF, WEBP)' }
  }
  
  if (file.size > maxSize) {
    return { valid: false, error: 'File size must be less than 5MB' }
  }
  
  return { valid: true }
}

export const getFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

// String helpers
export const truncateText = (text, maxLength = 100) => {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

export const capitalizeFirst = (str) => {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export const toTitleCase = (str) => {
  if (!str) return ''
  return str.replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  })
}

// Email validation
export const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

// Password validation
export const validatePassword = (password) => {
  const errors = []
  
  if (password.length < 6) {
    errors.push('Password must be at least 6 characters long')
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number')
  }
  
  return {
    valid: errors.length === 0,
    errors
  }
}

// Number helpers
export const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

// Calculate percentage
export const calculatePercentage = (part, whole) => {
  if (whole === 0) return 0
  return Math.round((part / whole) * 100)
}

// Subject icon mapping
export const getSubjectIcon = (subject) => {
  const icons = {
    'Digital Electronics': '💻',
    'AI': '🤖',
    'OOPS': '🎯',
    'Communication': '💬',
    'Commercial Applications': '📊',
    'Data Structures': '🗂️',
    'Database Management': '🗄️',
    'Web Development': '🌐',
    'Mobile Development': '📱',
    'Machine Learning': '🧠',
    'Cloud Computing': '☁️',
    'Cybersecurity': '🔒'
  }
  return icons[subject] || '📚'
}

// Generate random color for avatars
export const getRandomColor = (name) => {
  const colors = [
    'bg-red-500',
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-cyan-500'
  ]
  
  if (!name) return colors[0]
  
  const index = name.charCodeAt(0) % colors.length
  return colors[index]
}

// Get initials from name
export const getInitials = (name) => {
  if (!name) return '?'
  
  const parts = name.trim().split(' ')
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase()
  }
  
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
}

// Local storage helpers
export const saveToLocalStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch (error) {
    console.error('Error saving to localStorage:', error)
    return false
  }
}

export const getFromLocalStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.error('Error reading from localStorage:', error)
    return defaultValue
  }
}

export const removeFromLocalStorage = (key) => {
  try {
    localStorage.removeItem(key)
    return true
  } catch (error) {
    console.error('Error removing from localStorage:', error)
    return false
  }
}

// Debounce function for search inputs
export const debounce = (func, wait = 300) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Copy to clipboard
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (error) {
    console.error('Failed to copy:', error)
    return false
  }
}

// Download file
export const downloadFile = (url, filename) => {
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export default {
  formatDate,
  formatDateTime,
  timeAgo,
  getStatusColor,
  getStatusIcon,
  validateImageFile,
  getFileSize,
  truncateText,
  capitalizeFirst,
  toTitleCase,
  isValidEmail,
  validatePassword,
  formatNumber,
  calculatePercentage,
  getSubjectIcon,
  getRandomColor,
  getInitials,
  saveToLocalStorage,
  getFromLocalStorage,
  removeFromLocalStorage,
  debounce,
  copyToClipboard,
  downloadFile
}