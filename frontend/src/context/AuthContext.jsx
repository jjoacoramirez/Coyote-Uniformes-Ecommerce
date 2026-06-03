/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState } from 'react'
import { api } from '../services/api.js'

const AuthContext = createContext(null)

function normalizeRole(rawRole) {
  const normalizedRole = String(rawRole ?? '').toUpperCase()
  return normalizedRole.includes('ADMIN') ? 'admin' : 'cliente'
}

function extractRole(payload) {
  const roles = payload.roles ?? payload.role ?? payload.authorities ?? payload.authority

  if (Array.isArray(roles)) {
    const adminRole = roles.find((role) => normalizeRole(
      role?.authority ?? role?.role ?? role?.name ?? role
    ) === 'admin')
    const selectedRole = adminRole ?? roles[0]
    return selectedRole?.authority ?? selectedRole?.role ?? selectedRole?.name ?? selectedRole
  }

  return roles
}

function decodeJwtPayload(token) {
  const base64Url = token.split('.')[1]
  if (!base64Url) return null

  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
  const paddedBase64 = base64.padEnd(base64.length + ((4 - base64.length % 4) % 4), '=')
  return JSON.parse(decodeURIComponent(escape(atob(paddedBase64))))
}

function decodeToken(token) {
  try {
    const payload = decodeJwtPayload(token)
    if (!payload) return null
    const rawRole = extractRole(payload) ?? 'ROLE_USER'
    return {
      email: payload.sub,
      role: normalizeRole(rawRole),
    }
  } catch {
    return null
  }
}

function getStoredUser() {
  const token = localStorage.getItem('coyote_token')
  if (!token) {
    localStorage.removeItem('coyote_user')
    return null
  }

  const decoded = decodeToken(token)
  if (!decoded) {
    localStorage.removeItem('coyote_token')
    localStorage.removeItem('coyote_user')
    return null
  }

  const sessionUser = { email: decoded.email, role: decoded.role }
  localStorage.setItem('coyote_user', JSON.stringify(sessionUser))
  return sessionUser
}

function storeSession(token) {
  const decoded = decodeToken(token)
  if (!decoded) return null
  localStorage.setItem('coyote_token', token)
  const sessionUser = { email: decoded.email, role: decoded.role }
  localStorage.setItem('coyote_user', JSON.stringify(sessionUser))
  return sessionUser
}

function getFriendlyLoginMessage(message) {
  if (!message || message === 'Bad credentials' || message.startsWith('Error 401')) {
    return 'Correo o contraseña incorrectos. Verifica los datos e intenta nuevamente.'
  }

  return message
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
      if (!err.message || err.message === 'Bad credentials' || err.message.startsWith('Error 401')) {
        return { ok: false, message: getFriendlyLoginMessage(err.message) }
      }
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
