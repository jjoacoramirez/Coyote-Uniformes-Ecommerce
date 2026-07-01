import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { register, clearAuthError } from '../store/slices/authSlice.js'

function Register() {
  const [accepted, setAccepted] = useState(false)
  const [localError, setLocalError] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user, status, error } = useSelector((s) => s.auth)

  useEffect(() => {
    if (user) {
      navigate('/productos')
    }
  }, [user, navigate])

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setLocalError('')
    if (error) dispatch(clearAuthError())
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      setLocalError('Las contraseñas no coinciden')
      return
    }
    dispatch(register(formData))
  }

  const loading = status === 'loading'
  const shownError = localError || error

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
              onChange={e => updateField('name', e.target.value)}
              required
            />
          </label>
          <label>
            Apellido
            <input
              placeholder="Gomez"
              value={formData.lastName}
              onChange={e => updateField('lastName', e.target.value)}
              required
            />
          </label>
          <label className="wide">
            Email
            <input
              type="email"
              placeholder="correo@empresa.com"
              value={formData.email}
              onChange={e => updateField('email', e.target.value)}
              required
            />
          </label>
          <label className="wide">
            Contraseña
            <input
              type="password"
              placeholder="Mínimo 8 caracteres"
              value={formData.password}
              onChange={e => updateField('password', e.target.value)}
              minLength={8}
              required
            />
          </label>
          <label className="wide">
            Confirmar contraseña
            <input
              type="password"
              placeholder="Repetí la contraseña"
              value={formData.confirmPassword}
              onChange={e => updateField('confirmPassword', e.target.value)}
              required
            />
          </label>
        </div>

        {shownError && <p className="form-error">{shownError}</p>}

        <label className="check-row">
          <input
            type="checkbox"
            checked={accepted}
            onChange={e => setAccepted(e.target.checked)}
          />
          Acepto los Términos y Condiciones y la Política de Privacidad.
        </label>
        <button
          className="button primary full"
          type="submit"
          disabled={!accepted || loading}
        >
          {loading ? 'Creando cuenta...' : 'Crear cuenta'}
        </button>
        <Link to="/login">¿Ya tenés cuenta? Iniciá sesión</Link>
      </form>
    </main>
  )
}

export default Register
