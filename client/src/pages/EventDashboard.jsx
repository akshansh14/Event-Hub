"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { 
  Calendar, 
  MapPin, 
  Users, 
  Plus,
  Search,
  Filter,
  Clock,
  Tag,
  ChevronRight
} from "lucide-react"
import { getEvents, updateEventAttendees } from "../store/eventSlice"
import socketService from "../utils/socketService"

const EVENT_CATEGORIES = [
  "Social Events",
  "Corporate Events",
  "Cultural Events",
  "Sporting Events",
  "Educational Events",
  "Political Events",
  "Religious Events",
  "Entertainment Events",
]

const TABS = {
  UPCOMING: 'upcoming',
  TODAY: 'today',
  PAST: 'past'
}

function EventDashboard() {
  const [filter, setFilter] = useState({ category: "", search: "" })
  const [activeTab, setActiveTab] = useState(TABS.UPCOMING)
  const dispatch = useDispatch()
  const { list: events, status } = useSelector((state) => state.events)
  const user = useSelector((state) => state.auth.user)

  useEffect(() => {
    dispatch(getEvents(filter))

    // Connect to socket
    const socket = socketService.connect()

    // Listen for event updates
    socket.on('eventUpdated', (data) => {
      if (data.type === 'newAttendee') {
        // Update the specific event's attendees in the list
        dispatch(updateEventAttendees({
          eventId: data.eventId,
          attendees: data.attendees
        }))
      }
    })

    return () => {
      socket.off('eventUpdated')
    }
  }, [dispatch, filter])

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const filteredEvents = events.filter(event => {
    const eventDate = new Date(event.date)
    eventDate.setHours(0, 0, 0, 0)
    
    const matchesSearch = !filter.search || 
      event.name.toLowerCase().includes(filter.search.toLowerCase()) ||
      event.description.toLowerCase().includes(filter.search.toLowerCase())
    
    const matchesCategory = !filter.category || event.category === filter.category
    
    const matchesTab = (() => {
      switch (activeTab) {
        case TABS.UPCOMING:
          return eventDate > today
        case TABS.TODAY:
          return eventDate.getTime() === today.getTime()
        case TABS.PAST:
          return eventDate < today
        default:
          return true
      }
    })()

    return matchesSearch && matchesCategory && matchesTab
  })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Discover Amazing Events
            </h1>
            <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
              Find and join events that match your interests, or create your own to connect with people.
            </p>
            {user && (
              <Link
                to="/events/create"
                className="inline-flex items-center px-6 py-3 bg-white text-blue-600 rounded-full hover:bg-blue-50 transition-colors font-medium space-x-2 shadow-lg"
              >
                <Plus className="w-5 h-5" />
                <span>Create New Event</span>
              </Link>
            )}
          </motion.div>

          {/* Search and Filter */}
          <div className="mt-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 grid md:grid-cols-3 gap-4">
              <div className="relative md:col-span-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search events..."
                  value={filter.search}
                  onChange={(e) => setFilter(prev => ({ ...prev, search: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={filter.category}
                  onChange={(e) => setFilter(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                >
                  <option value="">All Categories</option>
                  {EVENT_CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Tabs */}
        <div className="flex justify-center mb-12">
          <nav className="flex space-x-2 bg-white rounded-full p-1 shadow-md">
            {Object.values(TABS).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`
                  px-6 py-2 rounded-full font-medium text-sm transition-all
                  ${activeTab === tab
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                  }
                `}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                <span className="ml-2 text-xs">
                  ({events.filter(event => {
                    const eventDate = new Date(event.date)
                    eventDate.setHours(0, 0, 0, 0)
                    switch (tab) {
                      case TABS.UPCOMING:
                        return eventDate > today
                      case TABS.TODAY:
                        return eventDate.getTime() === today.getTime()
                      case TABS.PAST:
                        return eventDate < today
                      default:
                        return true
                    }
                  }).length})
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* Events Grid */}
        {status === "loading" ? (
          <div className="flex justify-center items-center h-64">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full"
            />
          </div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredEvents.map((event) => (
              <motion.div
                key={event._id}
                variants={itemVariants}
                className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <Link to={`/events/${event._id}`}>
                  <div className="relative">
                    {event.image ? (
                      <img
                        src={event.image}
                        alt={event.name}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                        <span className="text-white text-2xl font-bold">
                          {event.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-blue-600 text-xs font-medium rounded-full">
                        {event.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {event.name}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                      {event.description}
                    </p>
                    
                    <div className="space-y-3">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span className="text-sm">
                          {new Date(event.date).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Clock className="w-4 h-4 mr-2" />
                        <span className="text-sm">{event.time}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span className="text-sm">{event.location}</span>
                      </div>
                    </div>

                    <div className="mt-6 flex items-center justify-between">
                      <div className="flex items-center text-gray-600">
                        <Users className="w-5 h-5 mr-2" />
                        <span className="text-sm">
                          {event.attendees?.length || 0} attending
                        </span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-blue-600 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}

        {filteredEvents.length === 0 && status !== "loading" && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center">
              <Calendar className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No events found
              {filter.category && ` in ${filter.category}`}
              {filter.search && ` matching "${filter.search}"`}
            </h3>
            <p className="text-gray-500">
              {activeTab === TABS.UPCOMING 
                ? "Try adjusting your filters or create a new event!"
                : activeTab === TABS.TODAY
                ? "No events scheduled for today."
                : "No past events match your criteria."
              }
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default EventDashboard

