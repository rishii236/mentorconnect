import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const TIME_SLOTS = [
  '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', 
  '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
]

function MentorCalendar() {
  const [availability, setAvailability] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { API_URL } = useAuth()

  useEffect(() => {
    fetchAvailability()
  }, [])

  const fetchAvailability = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${API_URL}/api/availability/my-availability`)
      
      // Convert array to object for easier access
      const availabilityMap = {}
      response.data.data.forEach(slot => {
        availabilityMap[slot.dayOfWeek] = {
          startTime: slot.startTime,
          endTime: slot.endTime,
          _id: slot._id
        }
      })
      setAvailability(availabilityMap)
    } catch (error) {
      console.error('Failed to fetch availability:', error)
      toast.error('Failed to load availability')
    } finally {
      setLoading(false)
    }
  }

  const handleTimeChange = (day, field, value) => {
    setAvailability(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value
      }
    }))
  }

  const saveAvailability = async (day) => {
    const slot = availability[day]
    if (!slot?.startTime || !slot?.endTime) {
      toast.error('Please select both start and end time')
      return
    }

    if (slot.startTime >= slot.endTime) {
      toast.error('End time must be after start time')
      return
    }

    try {
      setSaving(true)
      await axios.post(`${API_URL}/api/availability`, {
        dayOfWeek: day,
        startTime: slot.startTime,
        endTime: slot.endTime
      })
      toast.success(`${day} availability saved!`)
      fetchAvailability()
    } catch (error) {
      toast.error('Failed to save availability')
      console.error(error)
    } finally {
      setSaving(false)
    }
  }

  const removeAvailability = async (day) => {
    const slot = availability[day]
    if (!slot?._id) return

    try {
      setSaving(true)
      await axios.delete(`${API_URL}/api/availability/${slot._id}`)
      toast.success(`${day} availability removed`)
      
      // Remove from local state
      const newAvailability = { ...availability }
      delete newAvailability[day]
      setAvailability(newAvailability)
    } catch (error) {
      toast.error('Failed to remove availability')
      console.error(error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Set Your Availability</h2>
          <p className="text-gray-400 text-sm mt-1">
            Configure your available hours for student appointments
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {DAYS.map(day => {
          const hasAvailability = availability[day]
          
          return (
            <div
              key={day}
              className={`glass rounded-xl p-6 transition-all duration-300 ${
                hasAvailability ? 'border-2 border-purple-500' : 'border border-gray-700'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  {hasAvailability && <span className="text-green-400">✓</span>}
                  {day}
                </h3>
                {hasAvailability && (
                  <button
                    onClick={() => removeAvailability(day)}
                    className="text-red-400 hover:text-red-300 text-sm"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Start Time</label>
                  <select
                    value={availability[day]?.startTime || ''}
                    onChange={(e) => handleTimeChange(day, 'startTime', e.target.value)}
                    className="w-full px-4 py-2 rounded-lg text-white bg-gray-800 border border-gray-700 focus:border-purple-500 focus:outline-none"
                  >
                    <option value="">Select time</option>
                    {TIME_SLOTS.map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">End Time</label>
                  <select
                    value={availability[day]?.endTime || ''}
                    onChange={(e) => handleTimeChange(day, 'endTime', e.target.value)}
                    className="w-full px-4 py-2 rounded-lg text-white bg-gray-800 border border-gray-700 focus:border-purple-500 focus:outline-none"
                  >
                    <option value="">Select time</option>
                    {TIME_SLOTS.map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={() => saveAvailability(day)}
                  disabled={saving}
                  className="w-full py-2 rounded-lg gradient-bg text-white font-semibold hover:glow-purple transition-all disabled:opacity-50"
                >
                  {saving ? 'Saving...' : hasAvailability ? 'Update' : 'Set Available'}
                </button>
              </div>
            </div>
          )
        })}
      </div>

      <div className="glass rounded-xl p-6 mt-6">
        <h3 className="text-lg font-bold text-white mb-3">📋 Your Schedule Summary</h3>
        {Object.keys(availability).length === 0 ? (
          <p className="text-gray-400 text-sm">No availability set yet. Configure your schedule above.</p>
        ) : (
          <div className="space-y-2">
            {Object.entries(availability).map(([day, slot]) => (
              <div key={day} className="flex items-center justify-between p-3 rounded-lg bg-gray-800">
                <span className="text-white font-semibold">{day}</span>
                <span className="text-purple-400">{slot.startTime} - {slot.endTime}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MentorCalendar