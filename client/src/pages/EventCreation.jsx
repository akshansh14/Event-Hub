"use client"

import { useState } from "react"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { createEvent } from "../store/eventSlice"

function EventCreation() {
  const [eventData, setEventData] = useState({
    name: "",
    description: "",
    date: "",
    category: "",
    image: null,
  })
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await dispatch(createEvent(eventData)).unwrap()
      navigate("/events")
    } catch (error) {
      console.error("Failed to create event:", error)
    }
  }

  const handleChange = (e) => {
    const { name, value, files } = e.target
    setEventData({
      ...eventData,
      [name]: files ? files[0] : value,
    })
  }

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Create Event</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block mb-1">
            Event Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={eventData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="description" className="block mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={eventData.description}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="date" className="block mb-1">
            Date
          </label>
          <input
            type="datetime-local"
            id="date"
            name="date"
            value={eventData.date}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="category" className="block mb-1">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={eventData.category}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          >
            <option value="">Select a category</option>
            {/* Add category options */}
          </select>
        </div>
        <div>
          <label htmlFor="image" className="block mb-1">
            Event Image
          </label>
          <input
            type="file"
            id="image"
            name="image"
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            accept="image/*"
          />
        </div>
        <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
          Create Event
        </button>
      </form>
    </div>
  )
}

export default EventCreation

