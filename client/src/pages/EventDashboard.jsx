"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { getEvents } from "../store/eventSlice"

function EventDashboard() {
  const [filter, setFilter] = useState({ category: "", date: "" })
  const dispatch = useDispatch()
  const { list: events, status, error } = useSelector((state) => state.events)

  useEffect(() => {
    dispatch(getEvents(filter))
  }, [dispatch, filter])

  if (status === "loading") return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Event Dashboard</h2>
      <div className="mb-4 flex space-x-4">
        <select
          value={filter.category}
          onChange={(e) => setFilter({ ...filter, category: e.target.value })}
          className="px-3 py-2 border rounded"
        >
          <option value="">All Categories</option>
          {/* Add category options */}
        </select>
        <input
          type="date"
          value={filter.date}
          onChange={(e) => setFilter({ ...filter, date: e.target.value })}
          className="px-3 py-2 border rounded"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.map((event) => (
          <Link key={event._id} to={`/events/${event._id}`} className="block">
            <div className="border rounded p-4 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold mb-2">{event.name}</h3>
              <p className="text-gray-600 mb-2">{new Date(event.date).toLocaleDateString()}</p>
              <p className="text-gray-600">Attendees: {event.attendees.length}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default EventDashboard

