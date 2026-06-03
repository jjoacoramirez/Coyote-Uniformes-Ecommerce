/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState } from 'react'
import { api } from '../services/api.js'

const AuthContext = createContext(null)

function decodeToken(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    const rawRole = payload.roles?.[0]?.authority ?? 'ROLE_USER'
    return {
      email: payload.sub,
      role: rawRole === 'ROLE_ADMIN' ? 'admin' : 'cliente',
    }
  } catch {
    return null
  }
}

function getStoredUser() {
  const rawUser = localStorage.getItem('coyote_user')
  return rawUser ? JSON.parse(rawUser) : null
}

function storeSession(token) {
  const decoded = decodeToken(token)
  if (!decoded) return null
  localStorage.setItem('coyote_token', token)
  const sessionUser = { email: decoded.email, role: decoded.role }
  localStorage.setItem('coyote_user', JSON.stringify(sessionUser))
  return sessionUser
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser)

  const login = async (email, password) => {
    try {
      const { token } = await api.post('/auth/login', { email, password })
      const sessionUser = storeSession(token)
      if (!sessionUser) return { ok: false, message: 'Error al procesar el token.' }
      setUser(sessionUser)
      return { ok: true, user: sessionUser }
    } catch (err) {
      return { ok: false, message: err.message ?? 'Correo o contraseña incorrectos.' }
    }
  }

  const register = async (formData) => {
    try {
      const { token } = await api.post('/auth/register', {
        nombre:     formData.name,
        apellido:   formData.lastName,
        email:      formData.email,
        contrasena: formData.password,
      })
      const sessionUser = storeSession(token)
      if (!sessionUser) return { ok: false, message: 'Error al procesar el token.' }
      setUser(sessionUser)
      return { ok: true, user: sessionUser }
    } catch (err) {
      return { ok: false, message: err.message ?? 'Error al crear la cuenta.' }
    }
  }

  const logout = () => {
    localStorage.removeItem('coyote_token')
    localStorage.removeItem('coyote_user')
    setUser(null)
  }

  const value = useMemo(() => ({ user, login, register, logout }), [user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
