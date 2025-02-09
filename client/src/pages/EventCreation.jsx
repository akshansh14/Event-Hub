"use client"

import { useState } from "react"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { createEvent } from "../store/eventSlice"
import { toast } from "react-hot-toast"

const EVENT_CATEGORIES = [
  "Social Events",
  "Corporate Events",
  "Cultural Events",
  "Sporting Events",
  "Educational Events",
  "Political Events",
  "Charity Events",
  "Religious Events",
  "Trade and Commercial Events",
  "Entertainment Events",
  "Environmental Events",
  "Technological Events",
  "Government Events"
]

function EventCreation() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    date: "",
    time: "",
    location: "",
    category: "",
    image: null,
  })
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      // Ensure time is in HH:mm format
      let formattedTime = formData.time;
      
      // If time is in H:mm format, pad with leading zero
      if (formattedTime.length === 4 && formattedTime.includes(':')) {
        formattedTime = `0${formattedTime}`;
      }
      
      // If time doesn't match HH:mm format
      if (!formattedTime.match(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/)) {
        toast.error('Please enter time in HH:mm format (e.g., 14:30)');
        return;
      }

      // Create FormData object
      const eventFormData = new FormData();
      
      // Log the data being sent
      console.log('Sending data:', {
        name: formData.name,
        description: formData.description,
        date: formData.date,
        time: formattedTime,
        location: formData.location,
        category: formData.category
      });

      // Append all fields to FormData
      eventFormData.append('name', formData.name);
      eventFormData.append('description', formData.description);
      eventFormData.append('date', formData.date);
      eventFormData.append('time', formattedTime);
      eventFormData.append('location', formData.location);
      eventFormData.append('category', formData.category);
      
      // Append image if it exists
      if (formData.image) {
        eventFormData.append('image', formData.image);
      }

      // Update the createEvent action in eventSlice.js to handle FormData
      await dispatch(createEvent(eventFormData)).unwrap();
      toast.success('Event created successfully!');
      navigate("/events");
    } catch (error) {
      console.error("Failed to create event:", error);
      toast.error(error.message || 'Failed to create event');
    }
  }

  const handleChange = (e) => {
    const { name, value, files } = e.target
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    })
  }

  const handleTimeChange = (e) => {
    const { value } = e.target;
    // Only allow valid time inputs
    if (value === '' || value.match(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)) {
      setFormData(prev => ({
        ...prev,
        time: value
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold mb-4">Create Event</h2>
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Event Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]} // Prevent past dates
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Time
              </label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleTimeChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <p className="mt-1 text-sm text-gray-500">
                24-hour format (e.g., 14:30)
              </p>
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Enter event location"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select a category</option>
              {EVENT_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Event Image
            </label>
            <input
              type="file"
              name="image"
              onChange={handleChange}
              accept="image/*"
              className="mt-1 block w-full"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Create Event
          </button>
        </form>
      </div>
    </div>
  )
}

export default EventCreation

