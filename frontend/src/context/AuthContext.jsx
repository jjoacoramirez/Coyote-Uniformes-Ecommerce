/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState } from 'react'
import { demoUsers } from '../data/users.js'

const AuthContext = createContext(null)

function getStoredUser() {
  const rawUser = localStorage.getItem('coyote_user')
  return rawUser ? JSON.parse(rawUser) : null
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser)

  const login = (email, password) => {
    const foundUser = demoUsers.find(
      (demoUser) =>
        demoUser.email.toLowerCase() === email.toLowerCase() && demoUser.password === password,
    )

    if (!foundUser) {
      return { ok: false, message: 'Correo o contrasena incorrectos.' }
    }

    const sessionUser = {
      id: foundUser.id,
      name: foundUser.name,
      email: foundUser.email,
      role: foundUser.role,
    }

    localStorage.setItem('coyote_user', JSON.stringify(sessionUser))
    setUser(sessionUser)
    return { ok: true, user: sessionUser }
  }

  const register = (formData) => {
    const sessionUser = {
      id: Date.now(),
      name: `${formData.name} ${formData.lastName}`.trim(),
      email: formData.email,
      role: 'cliente',
    }

    localStorage.setItem('coyote_user', JSON.stringify(sessionUser))
    setUser(sessionUser)
    return sessionUser
  }

  const logout = () => {
    localStorage.removeItem('coyote_user')
    setUser(null)
  }

  const value = useMemo(() => ({ user, login, register, logout }), [user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
