import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Provider } from "react-redux"
import { store } from "./store"
import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import EventDashboard from "./pages/EventDashboard"
import EventCreation from "./pages/EventCreation"
import EventDetails from "./pages/EventDetails"
import { Toaster } from 'react-hot-toast'
import SocketInitializer from './components/SocketInitializer'

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <SocketInitializer />
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/events" element={<EventDashboard />} />
              <Route path="/events/create" element={<EventCreation />} />
              <Route path="/events/:id" element={<EventDetails />} />
            </Routes>
          </main>
          <Toaster position="top-right" />
        </div>
      </Router>
    </Provider>
  )
}

export default App

