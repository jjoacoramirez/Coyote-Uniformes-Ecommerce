import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { login, clearAuthError } from '../store/slices/authSlice.js'

function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user, status, error } = useSelector((s) => s.auth)

  useEffect(() => {
    if (user) {
      navigate(user.role === 'admin' ? '/admin' : '/productos')
    }
  }, [user, navigate])

  const handleSubmit = (event) => {
    event.preventDefault()
    dispatch(login({ email, password }))
  }

  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Coyote Uniformes</h1>
        <p>Accede a tu cuenta corporativa</p>
        <label>
          Correo electronico
          <input
            type="email"
            placeholder="tu@empresa.com"
            value={email}
            onChange={(event) => { setEmail(event.target.value); if (error) dispatch(clearAuthError()) }}
            required
          />
        </label>
        <label>
          Contraseña
          <div className="password-field">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="********"
              value={password}
              onChange={(event) => { setPassword(event.target.value); if (error) dispatch(clearAuthError()) }}
              required
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? 'Ocultar' : 'Ver'}
            </button>
          </div>
        </label>
        {error && <p className="form-error">{error}</p>}
        <button className="button primary full" type="submit" disabled={status === 'loading'}>
          {status === 'loading' ? 'Ingresando...' : 'Iniciar sesion'}
        </button>
        <Link to="/register">No tenes cuenta? Registrate</Link>
      </form>
    </main>
  )
}

export default Login
