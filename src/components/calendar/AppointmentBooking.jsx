import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

function AppointmentBooking({ mentor, doubt, onClose, onSuccess }) {
  const [availability, setAvailability] = useState([])
  const [selectedDay, setSelectedDay] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [meetLink, setMeetLink] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(true)
  const [booking, setBooking] = useState(false)
  const { API_URL } = useAuth()

  useEffect(() => {
    fetchMentorAvailability()
  }, [])

  const fetchMentorAvailability = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      const response = await axios.get(`${API_URL}/availability/mentor/${mentor._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setAvailability(response.data.data)
    } catch (error) {
      console.error('Failed to fetch availability:', error)
      toast.error('Failed to load mentor availability')
    } finally {
      setLoading(false)
    }
  }

  const getNextDateForDay = (dayName) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const targetDay = days.indexOf(dayName)
    const today = new Date()
    const currentDay = today.getDay()
    
    let daysToAdd = targetDay - currentDay
    if (daysToAdd <= 0) daysToAdd += 7
    
    const nextDate = new Date(today)
    nextDate.setDate(today.getDate() + daysToAdd)
    return nextDate.toISOString().split('T')[0]
  }

  const generateTimeSlots = (startTime, endTime) => {
    const slots = []
    const start = parseInt(startTime.split(':')[0])
    const end = parseInt(endTime.split(':')[0])
    
    for (let hour = start; hour < end; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`)
    }
    return slots
  }

  const handleDaySelect = (day, slot) => {
    setSelectedDay(day)
    setSelectedDate(getNextDateForDay(day))
    setSelectedTime('')
  }

  const handleBookAppointment = async () => {
    if (!selectedDate || !selectedTime || !meetLink) {
      toast.error('Please fill all required fields')
      return
    }

    try {
      setBooking(true)
      const token = localStorage.getItem('token')
      const slot = availability.find(a => a.dayOfWeek === selectedDay)
      const startHour = parseInt(selectedTime.split(':')[0])
      const endHour = startHour + 1

      await axios.post(`${API_URL}/availability/book`, {
        mentorId: mentor._id,
        doubtId: doubt?._id,
        subject: doubt?.subject || mentor.subject,
        appointmentDate: selectedDate,
        startTime: selectedTime,
        endTime: `${endHour.toString().padStart(2, '0')}:00`,
        meetLink,
        notes
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })

      toast.success('Appointment booked successfully! 🎉')
      onSuccess()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to book appointment')
      console.error(error)
    } finally {
      setBooking(false)
    }
  }

  // ✅ FIX: Proper close handler with event prevention
  const handleClose = (e) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    onClose()
  }

  // ✅ FIX: Backdrop click handler
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose(e)
    }
  }

  const selectedSlot = availability.find(a => a.dayOfWeek === selectedDay)
  const timeSlots = selectedSlot ? generateTimeSlots(selectedSlot.startTime, selectedSlot.endTime) : []

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4" 
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
      onClick={handleBackdropClick}
    >
      <div 
        className="glass rounded-2xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold gradient-text mb-2">
              📅 Book Appointment
            </h2>
            <p className="text-gray-400 text-sm">
              With {mentor.name} • {mentor.subject}
            </p>
          </div>
          {/* ✅ FIX: Proper close button with SVG icon and event handling */}
          <button
            onClick={handleClose}
            type="button"
            className="text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg p-2 transition-all"
            aria-label="Close modal"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M6 18L18 6M6 6l12 12" 
              />
            </svg>
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="spinner"></div>
          </div>
        ) : availability.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-4xl mb-4">🔭</p>
            <p className="text-gray-400 text-lg">
              {mentor.name} hasn't set their availability yet.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* Step 1: Select Day */}
            <div>
              <h3 className="text-lg font-bold text-white mb-4">1️⃣ Select Day</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {availability.map(slot => (
                  <button
                    key={slot._id}
                    type="button"
                    onClick={() => handleDaySelect(slot.dayOfWeek, slot)}
                    className={`p-4 rounded-lg font-semibold transition-all ${
                      selectedDay === slot.dayOfWeek
                        ? 'gradient-bg text-white glow-purple'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    <div className="text-sm mb-1">{slot.dayOfWeek}</div>
                    <div className="text-xs opacity-75">{slot.startTime} - {slot.endTime}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Select Time */}
            {selectedDay && (
              <div>
                <h3 className="text-lg font-bold text-white mb-4">2️⃣ Select Time Slot</h3>
                <p className="text-sm text-gray-400 mb-3">
                  Next {selectedDay}: {selectedDate}
                </p>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                  {timeSlots.map(time => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setSelectedTime(time)}
                      className={`p-3 rounded-lg font-semibold transition-all ${
                        selectedTime === time
                          ? 'gradient-bg text-white'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Meeting Details */}
            {selectedTime && (
              <div>
                <h3 className="text-lg font-bold text-white mb-4">3️⃣ Meeting Details</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">
                      Google Meet Link *
                    </label>
                    <input
                      type="url"
                      value={meetLink}
                      onChange={(e) => setMeetLink(e.target.value)}
                      placeholder="https://meet.google.com/..."
                      className="w-full px-4 py-3 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      style={{ backgroundColor: '#2A2A2A', border: '1px solid #3A3A3A' }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-2">
                      Notes (Optional)
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                      placeholder="Any specific topics you want to discuss..."
                      className="w-full px-4 py-3 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      style={{ backgroundColor: '#2A2A2A', border: '1px solid #3A3A3A' }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Summary & Book */}
            {selectedTime && meetLink && (
              <div className="p-6 rounded-xl" style={{ backgroundColor: '#1A1A1A' }}>
                <h4 className="text-lg font-bold text-white mb-4">📋 Appointment Summary</h4>
                <div className="space-y-2 text-sm mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Mentor:</span>
                    <span className="text-white font-semibold">{mentor.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Subject:</span>
                    <span className="text-white">{doubt?.subject || mentor.subject}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Date:</span>
                    <span className="text-white">{selectedDay}, {selectedDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Time:</span>
                    <span className="text-purple-400 font-semibold">{selectedTime} - {parseInt(selectedTime) + 1}:00</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleBookAppointment}
                  disabled={booking}
                  className="w-full py-3 rounded-lg gradient-bg text-white font-semibold hover:glow-purple transition-all disabled:opacity-50"
                >
                  {booking ? 'Booking...' : '✓ Confirm Appointment'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default AppointmentBooking