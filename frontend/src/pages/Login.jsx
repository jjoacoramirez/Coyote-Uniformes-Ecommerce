import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = async (event) => {
    event.preventDefault()
    const result = await login(email, password)

    if (!result.ok) {
      setError(result.message)
      return
    }

    navigate(result.user.role === 'admin' ? '/admin' : '/productos')
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
            onChange={(event) => setEmail(event.target.value)}
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
              onChange={(event) => setPassword(event.target.value)}
              required
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? 'Ocultar' : 'Ver'}
            </button>
          </div>
        </label>
        {error && <p className="form-error">{error}</p>}
        <button className="button primary full" type="submit">
          Iniciar sesion
        </button>
        <Link to="/register">No tenes cuenta? Registrate</Link>
      </form>
    </main>
  )
}

export default Login
