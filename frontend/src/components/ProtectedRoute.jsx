import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

function ProtectedRoute({ children, role }) {
  const { user, initialized } = useSelector((s) => s.auth)

  if (!initialized) {
    return <p>Cargando sesion...</p>
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (role && user.role !== role) {
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute
