import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

function Register() {
  const [accepted, setAccepted] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    email: '',
  })
  const navigate = useNavigate()
  const { register } = useAuth()

  const updateField = (field, value) => {
    setFormData((currentData) => ({ ...currentData, [field]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    register(formData)
    navigate('/productos/buzo-capucha-cst')
  }

  return (
    <main className="auth-page">
      <form className="auth-card auth-card-wide" onSubmit={handleSubmit}>
        <h1>Coyote Uniformes</h1>
        <p>Crear una cuenta profesional</p>
        <div className="form-grid">
          <label>
            Nombre
            <input
              placeholder="Carlos"
              value={formData.name}
              onChange={(event) => updateField('name', event.target.value)}
              required
            />
          </label>
          <label>
            Apellido
            <input
              placeholder="Gomez"
              value={formData.lastName}
              onChange={(event) => updateField('lastName', event.target.value)}
              required
            />
          </label>
          <label className="wide">
            Email
            <input
              type="email"
              placeholder="correo@empresa.com"
              value={formData.email}
              onChange={(event) => updateField('email', event.target.value)}
              required
            />
          </label>
          <label className="wide">
            Contrasena
            <input type="password" placeholder="Minimo 8 caracteres" required />
          </label>
          <label className="wide">
            Confirmar contrasena
            <input type="password" placeholder="Repeti la contrasena" required />
          </label>
        </div>
        <label className="check-row">
          <input
            type="checkbox"
            checked={accepted}
            onChange={(event) => setAccepted(event.target.checked)}
          />
          Acepto los Terminos y Condiciones y la Politica de Privacidad.
        </label>
        <button className="button primary full" type="submit" disabled={!accepted}>
          Crear cuenta
        </button>
        <Link to="/login">Ya tenes cuenta? Inicia sesion</Link>
      </form>
    </main>
  )
}

export default Register
