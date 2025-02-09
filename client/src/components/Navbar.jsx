import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { logout } from "../store/authSlice"
import { updateEvent } from "../store/eventSlice"
import toast from 'react-hot-toast'

function Navbar() {
  const user = useSelector((state) => state.auth.user)
  const events = useSelector((state) => state.events.list)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [isMyEventsOpen, setIsMyEventsOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    date: '',
    category: '',
    location: ''
  })

  // Prevent body scroll when dialog is open
  useEffect(() => {
    if (isMyEventsOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMyEventsOpen])

  // Handle edit button click
  const handleEditClick = (event) => {
    setEditingEvent(event._id)
    setEditForm({
      name: event.name,
      description: event.description,
      date: new Date(event.date).toISOString().split('T')[0],
      category: event.category,
      location: event.location
    })
  }

  // Handle save changes
  const handleSaveChanges = async (eventId) => {
    try {
      await dispatch(updateEvent({ id: eventId, ...editForm })).unwrap()
      setEditingEvent(null)
      toast.success('Event updated successfully')
    } catch (error) {
      toast.error('Failed to update event')
      console.error('Update failed:', error)
    }
  }

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditingEvent(null)
    setEditForm({
      name: '',
      description: '',
      date: '',
      category: '',
      location: ''
    })
  }

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap()
      toast.success("You're now visiting as guest")
      navigate('/')
    } catch (error) {
      console.error('Logout failed:', error)
      toast.error('Failed to logout')
    }
  }

  const myEvents = events.filter(event => {
    // Check if the event has a creator and the creator has a name
    return event.creator?.name === user?.name || event.creator === user?._id;
  })

  return (
    <>
      {/* Main Navigation */}
      <nav className="fixed w-full z-50 bg-gradient-to-r from-gray-900/80 to-gray-800/80 backdrop-blur-lg border-b border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-purple-500 text-transparent bg-clip-text">
                EventHub
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <Link
                    to="/events/create"
                    className="px-4 py-2 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white rounded-full transition-all duration-300 transform hover:-translate-y-0.5"
                  >
                    Create Event
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-gradient-to-r from-pink-500 to-red-600 hover:from-pink-600 hover:to-red-700 text-white rounded-full transition-all duration-300 transform hover:-translate-y-0.5"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-4 py-2 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white rounded-full transition-all duration-300 transform hover:-translate-y-0.5"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-full transition-all duration-300 transform hover:-translate-y-0.5"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Modal */}
      {isMyEventsOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto pt-16 sm:pt-24">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMyEventsOpen(false)}
          />

          {/* Modal Content */}
          <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-auto">
              <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">My Events</h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Events created by {user?.name}
                    </p>
                  </div>
                  <button
                    onClick={() => setIsMyEventsOpen(false)}
                    className="text-gray-400 hover:text-gray-500 transition-colors p-1 hover:bg-gray-100 rounded-full"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Content */}
                {myEvents.length === 0 ? (
                  <div className="text-center py-12">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <p className="mt-4 text-gray-500 mb-6">
                      You haven't created any events yet.
                    </p>
                    <Link 
                      to="/events/create" 
                      className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors font-medium space-x-2"
                      onClick={() => setIsMyEventsOpen(false)}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                      </svg>
                      <span>Create Your First Event</span>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                    {myEvents.map(event => (
                      <div 
                        key={event._id} 
                        className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden group"
                      >
                        {editingEvent === event._id ? (
                          // Edit Form (remains mostly the same, just updated styling)
                          <div className="space-y-4">
                            <input
                              type="text"
                              value={editForm.name}
                              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                              placeholder="Event Name"
                            />
                            <textarea
                              value={editForm.description}
                              onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                              placeholder="Description"
                              rows="3"
                            />
                            <input
                              type="date"
                              value={editForm.date}
                              onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            />
                            <select
                              value={editForm.category}
                              onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            >
                              <option value="">Select Category</option>
                              <option value="Social Events">Social Events</option>
                              <option value="Corporate Events">Corporate Events</option>
                              <option value="Cultural Events">Cultural Events</option>
                              <option value="Sporting Events">Sporting Events</option>
                              <option value="Educational Events">Educational Events</option>
                              <option value="Political Events">Political Events</option>
                              <option value="Religious Events">Religious Events</option>
                              <option value="Entertainment Events">Entertainment Events</option>
                            </select>
                            <input
                              type="text"
                              value={editForm.location}
                              onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                              placeholder="Event Location"
                            />
                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={() => handleCancelEdit()}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleSaveChanges(event._id)}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                              >
                                Save Changes
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="relative">
                            {/* Event Image */}
                            {event.image ? (
                              <img
                                src={event.image}
                                alt={event.name}
                                className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-200"
                              />
                            ) : (
                              <div className="w-full h-32 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                <span className="text-white text-2xl font-semibold">
                                  {event.name.charAt(0)}
                                </span>
                              </div>
                            )}
                            
                            {/* Edit Button */}
                            <button
                              onClick={() => handleEditClick(event)}
                              className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md text-gray-600 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-all duration-200"
                            >
                              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                              </svg>
                            </button>

                            {/* Content */}
                            <div className="p-4">
                              <div className="flex items-center justify-between mb-3">
                                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                                  {event.category}
                                </span>
                                <span className="text-sm text-gray-500">
                                  {new Date(event.date).toLocaleDateString()}
                                </span>
                              </div>
                              <h3 className="text-lg font-semibold text-gray-900 mb-2">{event.name}</h3>
                              <p className="text-sm text-gray-600 line-clamp-2 mb-4">{event.description}</p>
                              <div className="flex items-center text-sm text-gray-600">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                {event.attendees?.length || 0} Attendees
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Footer */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setIsMyEventsOpen(false)}
                    className="w-full sm:w-auto px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Navbar

