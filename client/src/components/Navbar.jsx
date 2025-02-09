import { Link } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { logout } from "../store/authSlice"

function Navbar() {
  const user = useSelector((state) => state.auth.user)
  const dispatch = useDispatch()

  const handleLogout = () => {
    dispatch(logout())
  }

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-2xl font-bold text-gray-800">
            EventHub
          </Link>
          <div className="space-x-4">
            <Link to="/events" className="text-gray-600 hover:text-gray-800">
              Events
            </Link>
            {user ? (
              <>
                <Link to="/events/create" className="text-gray-600 hover:text-gray-800">
                  Create Event
                </Link>
                <button onClick={handleLogout} className="text-gray-600 hover:text-gray-800">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-gray-800">
                  Login
                </Link>
                <Link to="/register" className="text-gray-600 hover:text-gray-800">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

