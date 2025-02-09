import { useEffect } from "react"
import { useSelector } from "react-redux"
import socketService from "../utils/socketService"

function SocketInitializer() {
  const user = useSelector((state) => state.auth.user)

  useEffect(() => {
    if (user) {
      const socket = socketService.connect()

      // Handle socket events
      socket.on('eventUpdated', (data) => {
        console.log('Event updated:', data)
      })

      socket.on('eventCancelled', (data) => {
        console.log('Event cancelled:', data)
      })

      return () => {
        socketService.disconnect()
      }
    }
  }, [user])

  return null
}

export default SocketInitializer 