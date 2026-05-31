import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('cliente@coyote.com')
  const [password, setPassword] = useState('Cliente123')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = (event) => {
    event.preventDefault()
    const result = login(email, password)

    if (!result.ok) {
      setError(result.message)
      return
    }

    navigate(result.user.role === 'admin' ? '/admin' : '/productos/buzo-capucha-cst')
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
          Contrasena
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
        <div className="demo-accounts">
          <strong>Cuentas de prueba</strong>
          <span>Cliente: cliente@coyote.com / Cliente123</span>
          <span>Admin: admin@coyote.com / Admin123</span>
        </div>
        <button className="button primary full" type="submit">
          Iniciar sesion
        </button>
        <Link to="/register">No tenes cuenta? Registrate</Link>
      </form>
    </main>
  )
}

export default Login
