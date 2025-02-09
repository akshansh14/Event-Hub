"use client"

import { useEffect } from "react"
import { useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { getEventById } from "../store/eventSlice"

function EventDetails() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { currentEvent: event, status, error } = useSelector((state) => state.events)
  const user = useSelector((state) => state.auth.user)

  useEffect(() => {
    dispatch(getEventById(id))
  }, [dispatch, id])

  if (status === "loading") return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (!event) return null

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold mb-4">{event.name}</h2>
      <img
        src={event.image || "/placeholder.svg"}
        alt={event.name}
        className="w-full h-64 object-cover rounded-lg mb-4"
      />
      <p className="text-gray-600 mb-4">{new Date(event.date).toLocaleString()}</p>
      <p className="mb-4">{event.description}</p>
      <p className="text-gray-600 mb-4">Category: {event.category}</p>
      <p className="text-gray-600 mb-4">Attendees: {event.attendees.length}</p>
      {user && !event.attendees.includes(user._id) && (
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">Attend Event</button>
      )}
    </div>
  )
}

export default EventDetails

