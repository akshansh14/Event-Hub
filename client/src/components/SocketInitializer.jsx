import { useEffect } from "react"
import { useDispatch } from "react-redux"
import socketService from "../utils/socketService"

function SocketInitializer() {
  const dispatch = useDispatch()

  useEffect(() => {
    // Initialize socket connection if user is logged in
    const token = localStorage.getItem('token')
    if (token) {
      socketService.connect()
    }
  }, [dispatch])

  return null
}

export default SocketInitializer 