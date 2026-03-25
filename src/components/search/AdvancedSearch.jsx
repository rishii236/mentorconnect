import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import axios from 'axios'
import { toast } from 'react-toastify'

function AdvancedSearch({ type = 'doubts', onResults, initialFilters = {} }) {
  const { API_URL } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [filterOptions, setFilterOptions] = useState({
    subjects: [],
    statuses: [],
    classes: []
  })

  // Search filters
  const [filters, setFilters] = useState({
    keyword: initialFilters.keyword || '',
    subject: initialFilters.subject || '',
    status: initialFilters.status || '',
    studentClass: initialFilters.studentClass || '',
    dateFrom: initialFilters.dateFrom || '',
    dateTo: initialFilters.dateTo || '',
    sortBy: initialFilters.sortBy || 'createdAt',
    order: initialFilters.order || 'desc',
    minRating: initialFilters.minRating || '',
    expertise: initialFilters.expertise || ''
  })

  useEffect(() => {
    if (type === 'doubts') {
      fetchFilterOptions()
    }
  }, [type])

  const fetchFilterOptions = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`${API_URL}/search/${type}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.data.filterOptions) {
        setFilterOptions(response.data.filterOptions)
      }
    } catch (error) {
      console.error('Failed to fetch filter options:', error)
    }
  }

  const handleSearch = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')

      // Build query params
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value)
      })

      const response = await axios.get(`${API_URL}/search/${type}?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.data.success) {
        onResults(response.data.data, response.data.pagination)
        setIsOpen(false)
        toast.success(`Found ${response.data.pagination.totalItems} results`)
      }
    } catch (error) {
      toast.error('Search failed')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setFilters({
      keyword: '',
      subject: '',
      status: '',
      studentClass: '',
      dateFrom: '',
      dateTo: '',
      sortBy: 'createdAt',
      order: 'desc',
      minRating: '',
      expertise: ''
    })
  }

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const activeFiltersCount = Object.values(filters).filter(v => v && v !== 'createdAt' && v !== 'desc').length

  return (
    <div className="relative">
      {/* Search Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 transition-all"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <span>Advanced Search</span>
        {activeFiltersCount > 0 && (
          <span className="ml-1 px-2 py-0.5 rounded-full bg-purple-500 text-white text-xs font-semibold">
            {activeFiltersCount}
          </span>
        )}
      </button>

      {/* Search Panel */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-96 glass rounded-xl p-6 z-50 shadow-2xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-white">🔍 Advanced Search</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4 max-h-96 overflow-y-auto">
            {/* Keyword Search */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">Keyword</label>
              <input
                type="text"
                value={filters.keyword}
                onChange={(e) => updateFilter('keyword', e.target.value)}
                placeholder="Search by keyword..."
                className="w-full px-3 py-2 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                style={{ backgroundColor: '#2A2A2A', border: '1px solid #3A3A3A' }}
              />
            </div>

            {/* Subject Filter (for doubts and appointments) */}
            {(type === 'doubts' || type === 'appointments') && (
              <div>
                <label className="block text-sm text-gray-300 mb-2">Subject</label>
                <select
                  value={filters.subject}
                  onChange={(e) => updateFilter('subject', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  style={{ backgroundColor: '#2A2A2A', border: '1px solid #3A3A3A' }}
                >
                  <option value="">All Subjects</option>
                  {filterOptions.subjects?.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Status Filter (for doubts and appointments) */}
            {(type === 'doubts' || type === 'appointments') && (
              <div>
                <label className="block text-sm text-gray-300 mb-2">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => updateFilter('status', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  style={{ backgroundColor: '#2A2A2A', border: '1px solid #3A3A3A' }}
                >
                  <option value="">All Statuses</option>
                  {type === 'doubts' ? (
                    <>
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                    </>
                  ) : (
                    <>
                      <option value="scheduled">Scheduled</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="rescheduled">Rescheduled</option>
                    </>
                  )}
                </select>
              </div>
            )}

            {/* Class Filter (for doubts) */}
            {type === 'doubts' && filterOptions.classes?.length > 0 && (
              <div>
                <label className="block text-sm text-gray-300 mb-2">Class</label>
                <select
                  value={filters.studentClass}
                  onChange={(e) => updateFilter('studentClass', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  style={{ backgroundColor: '#2A2A2A', border: '1px solid #3A3A3A' }}
                >
                  <option value="">All Classes</option>
                  {filterOptions.classes.map(cls => (
                    <option key={cls} value={cls}>{cls}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Minimum Rating (for mentors) */}
            {type === 'mentors' && (
              <div>
                <label className="block text-sm text-gray-300 mb-2">Minimum Rating</label>
                <select
                  value={filters.minRating}
                  onChange={(e) => updateFilter('minRating', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  style={{ backgroundColor: '#2A2A2A', border: '1px solid #3A3A3A' }}
                >
                  <option value="">Any Rating</option>
                  <option value="4">4+ Stars</option>
                  <option value="3">3+ Stars</option>
                  <option value="2">2+ Stars</option>
                </select>
              </div>
            )}

            {/* Expertise (for mentors) */}
            {type === 'mentors' && (
              <div>
                <label className="block text-sm text-gray-300 mb-2">Expertise</label>
                <input
                  type="text"
                  value={filters.expertise}
                  onChange={(e) => updateFilter('expertise', e.target.value)}
                  placeholder="e.g., Calculus, Physics..."
                  className="w-full px-3 py-2 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  style={{ backgroundColor: '#2A2A2A', border: '1px solid #3A3A3A' }}
                />
              </div>
            )}

            {/* Date Range */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">Date Range</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => updateFilter('dateFrom', e.target.value)}
                  className="px-3 py-2 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  style={{ backgroundColor: '#2A2A2A', border: '1px solid #3A3A3A' }}
                />
                <input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => updateFilter('dateTo', e.target.value)}
                  className="px-3 py-2 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  style={{ backgroundColor: '#2A2A2A', border: '1px solid #3A3A3A' }}
                />
              </div>
            </div>

            {/* Sort Options */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">Sort By</label>
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={filters.sortBy}
                  onChange={(e) => updateFilter('sortBy', e.target.value)}
                  className="px-3 py-2 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  style={{ backgroundColor: '#2A2A2A', border: '1px solid #3A3A3A' }}
                >
                  <option value="createdAt">Date Created</option>
                  {type === 'mentors' && (
                    <>
                      <option value="rating">Rating</option>
                      <option value="resolved">Resolved Doubts</option>
                    </>
                  )}
                  {type === 'appointments' && <option value="appointmentDate">Appointment Date</option>}
                </select>
                <select
                  value={filters.order}
                  onChange={(e) => updateFilter('order', e.target.value)}
                  className="px-3 py-2 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  style={{ backgroundColor: '#2A2A2A', border: '1px solid #3A3A3A' }}
                >
                  <option value="desc">Newest First</option>
                  <option value="asc">Oldest First</option>
                </select>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-6">
            <button
              onClick={handleReset}
              className="flex-1 px-4 py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 transition-all text-sm font-semibold"
            >
              Reset
            </button>
            <button
              onClick={handleSearch}
              disabled={loading}
              className="flex-1 px-4 py-2 rounded-lg gradient-bg text-white hover:glow-purple transition-all text-sm font-semibold disabled:opacity-50"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdvancedSearch