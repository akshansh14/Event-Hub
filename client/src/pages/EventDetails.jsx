"use client"

import { useEffect, useState, useMemo } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { motion } from "framer-motion"
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  User, 
  Users, 
  Plus, 
  X,
  Clock
} from "lucide-react"
import { getEventById, attendEvent, unattendEvent, updateEventAttendees } from "../store/eventSlice"
import socketService from "../utils/socketService"
import toast from 'react-hot-toast'

function EventDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { currentEvent: event, status, error } = useSelector((state) => state.events)
  const user = useSelector((state) => state.auth.user)
  const [viewerCount, setViewerCount] = useState(0)

  // Update how we check if user is attending
  const isUserAttending = useMemo(() => {
    if (!event?.attendees || !user) return false;
    
    return event.attendees.some(attendee => {
      if (typeof attendee === 'string') {
        return attendee === user._id;
      }
      return attendee._id === user._id;
    });
  }, [event?.attendees, user]);
  const isCreator = event?.creator?._id === user?._id;

  const handleAttendance = async () => {
    try {
      if (isUserAttending) {
        await dispatch(unattendEvent(id)).unwrap();
        toast.success("You've left the event");
      } else {
        await dispatch(attendEvent(id)).unwrap();
        toast.success("You're now attending this event!");
      }
    } catch (error) {
      // Extract error message from the error object
      const errorMessage = error?.response?.data?.error || error?.message || 'Failed to update attendance';
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    if (!user) return;

    dispatch(getEventById(id));
    const socket = socketService.connect();
    
    // Join event room
    socketService.joinEventRoom(id);

    // Socket event listeners
    socket.on('viewerCount', ({ count }) => {
      setViewerCount(count);
    });

    socket.on('eventUpdated', (data) => {
      if (data.eventId === id) {
        if (data.type === 'newAttendee' || data.type === 'attendeeLeft') {
          // Update attendees list in real-time
          dispatch(updateEventAttendees({
            eventId: data.eventId,
            attendees: data.attendees
          }));
          toast.success(data.message);
        } else if (data.type === 'eventModified') {
          // Refresh full event data for other updates
          dispatch(getEventById(id));
          toast.success(data.message);
        }
      }
    });

    socket.on('eventCancelled', (data) => {
      if (data.eventId === id) {
        toast.error(data.message);
        navigate('/events');
      }
    });

    // Cleanup
    return () => {
      socketService.leaveEventRoom(id);
      socket.off('viewerCount');
      socket.off('eventUpdated');
      socket.off('eventCancelled');
    };
  }, [dispatch, id, navigate, user]);

  // Add this function to format join date
  const formatJoinDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <motion.div 
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-red-600">Error: {error}</div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-gray-600">Event not found</div>
      </div>
    );
  }

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pt-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div variants={itemVariants} className="mb-6">
          <Link
            to="/events"
            className="inline-flex items-center text-violet-400 hover:text-violet-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span className="font-medium">Back to Events</span>
          </Link>
        </motion.div>

        <motion.div 
          variants={itemVariants}
          className="bg-white/10 backdrop-blur-lg rounded-xl shadow-xl overflow-hidden border border-gray-100/10"
        >
          {event.image ? (
            <motion.img
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6 }}
              src={event.image}
              alt={event.name}
              className="w-full h-64 object-contain"
            />
          ) : (
            <motion.div 
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              className="w-full h-64 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center"
            >
              <span className="text-white text-4xl font-bold">
                {event.name.charAt(0)}
              </span>
            </motion.div>
          )}
          
          <div className="p-6">
            <motion.div 
              variants={itemVariants}
              className="flex items-center justify-between mb-4"
            >
              <span className="px-3 py-1 bg-gradient-to-r from-violet-500/20 to-purple-500/20 text-violet-300 text-sm font-medium rounded-full backdrop-blur-sm">
                {event.category}
              </span>
              {user && !isCreator && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAttendance}
                  className={`
                    px-6 py-2 rounded-full font-medium transition-all duration-300
                    ${isUserAttending 
                      ? "bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white"
                      : "bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white"
                    }
                  `}
                >
                  <span className="flex items-center space-x-2">
                    {isUserAttending ? (
                      <>
                        <X className="w-5 h-5" />
                        <span>Leave Event</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-5 h-5" />
                        <span>Attend Event</span>
                      </>
                    )}
                  </span>
                </motion.button>
              )}
            </motion.div>

            <motion.h1 
              variants={itemVariants}
              className="text-3xl font-bold text-white mb-4"
            >
              {event.name}
            </motion.h1>

            <motion.div 
              variants={itemVariants}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
            >
              <div className="space-y-4">
                <div className="flex items-center text-gray-300">
                  <Calendar className="w-5 h-5 mr-2 text-violet-400" />
                  <span>{new Date(event.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <Clock className="w-5 h-5 mr-2 text-violet-400" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <MapPin className="w-5 h-5 mr-2 text-violet-400" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <User className="w-5 h-5 mr-2 text-violet-400" />
                  <span>Created by {event.creator?.name}</span>
                </div>
              </div>

              <motion.div 
                variants={itemVariants}
                className="space-y-4"
              >
                <h3 className="font-semibold text-violet-300">Description</h3>
                <p className="text-gray-300 whitespace-pre-wrap">
                  {event.description}
                </p>
              </motion.div>
            </motion.div>

            <motion.div 
              variants={itemVariants}
              className="border-t border-gray-700 pt-6"
            >
              <h3 className="font-semibold text-violet-300 mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2 text-violet-400" />
                Attendees ({event.attendees?.length || 0})
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {event.attendees && event.attendees.length > 0 ? (
                  event.attendees.map((attendee, index) => (
                    <motion.div 
                      key={attendee._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50"
                    >
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-medium">
                          {attendee.name ? attendee.name.charAt(0) : '?'}
                        </span>
                      </div>
                      <span className="text-gray-700 font-medium">
                        {attendee.name || 'Anonymous'}
                      </span>
                    </motion.div>
                  ))
                ) : (
                  <motion.div 
                    variants={itemVariants}
                    className="col-span-full text-center py-4 text-gray-500"
                  >
                    No attendees yet. Be the first to join!
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default EventDetails

