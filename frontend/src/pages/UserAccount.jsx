import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Layout from '../components/Layout.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { api } from '../services/api.js'

const ESTADO_LABELS = {
  pendiente: 'Pendiente',
  en_camino: 'En Camino',
  entregado: 'Entregado',
  cancelado: 'Cancelado',
}

export default function UserAccount() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [perfil, setPerfil] = useState({ nombre: '', apellido: '', email: '', telefono: '' })
  const [cargando, setCargando] = useState(true)
  const [guardandoPerfil, setGuardandoPerfil] = useState(false)
  const [errorPerfil, setErrorPerfil] = useState('')
  const [exitoPerfil, setExitoPerfil] = useState('')

  const [pass, setPass] = useState({ actual: '', nueva: '', confirmar: '' })
  const [errorPass, setErrorPass] = useState('')
  const [exitoPass, setExitoPass] = useState('')
  const [guardandoPass, setGuardandoPass] = useState(false)

  const [notifEmail, setNotifEmail] = useState(() => {
    try { return JSON.parse(localStorage.getItem('up_notif_email') ?? 'true') } catch { return true }
  })
  const [notifSms, setNotifSms] = useState(() => {
    try { return JSON.parse(localStorage.getItem('up_notif_sms') ?? 'false') } catch { return false }
  })
  const [idioma, setIdioma] = useState(() => localStorage.getItem('up_idioma') || 'es')
  const [prefsSaved, setPrefsSaved] = useState(false)

  const [pedidos, setPedidos] = useState([])

  const [activeSection, setActiveSection] = useState('perfil')
  const secPerfil = useRef(null)
  const secSeguridad = useRef(null)
  const secNotif = useRef(null)
  const secPedidos = useRef(null)

  useEffect(() => {
    if (!user) { setCargando(false); return }
    Promise.allSettled([
      api.get('/usuarios/me'),
      api.get('/pedidos'),
    ]).then(([perfilRes, pedidosRes]) => {
      if (perfilRes.status === 'fulfilled') {
        const d = perfilRes.value
        setPerfil({
          nombre: d.nombre ?? '',
          apellido: d.apellido ?? '',
          email: d.email ?? '',
          telefono: d.telefono ?? '',
        })
      }
      if (pedidosRes.status === 'fulfilled') {
        setPedidos([...pedidosRes.value].slice(-3).reverse())
      }
    }).finally(() => setCargando(false))
  }, [user])

  const scrollTo = (ref, section) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setActiveSection(section)
  }

  const handleGuardarPerfil = async () => {
    setErrorPerfil('')
    setExitoPerfil('')
    if (!perfil.nombre.trim() || !perfil.apellido.trim()) {
      setErrorPerfil('El nombre y apellido son obligatorios.')
      return
    }
    setGuardandoPerfil(true)
    try {
      await api.put('/usuarios/me', {
        nombre: perfil.nombre.trim(),
        apellido: perfil.apellido.trim(),
        telefono: perfil.telefono.trim() || null,
      })
      setExitoPerfil('Perfil actualizado correctamente.')
      setTimeout(() => setExitoPerfil(''), 3000)
    } catch (e) {
      setErrorPerfil(e.message || 'Error al guardar el perfil.')
    } finally {
      setGuardandoPerfil(false)
    }
  }

  const handleCambiarPass = async () => {
    setErrorPass('')
    setExitoPass('')
    if (!pass.actual || !pass.nueva || !pass.confirmar) {
      setErrorPass('Completá todos los campos.')
      return
    }
    if (pass.nueva !== pass.confirmar) {
      setErrorPass('Las contraseñas nuevas no coinciden.')
      return
    }
    if (pass.nueva.length < 6) {
      setErrorPass('La contraseña debe tener al menos 6 caracteres.')
      return
    }
    setGuardandoPass(true)
    try {
      await api.put('/usuarios/me/password', {
        contrasenaActual: pass.actual,
        contrasenaNueva: pass.nueva,
      })
      setExitoPass('Contraseña actualizada correctamente.')
      setPass({ actual: '', nueva: '', confirmar: '' })
      setTimeout(() => setExitoPass(''), 3000)
    } catch (e) {
      setErrorPass(e.message || 'Error al cambiar la contraseña.')
    } finally {
      setGuardandoPass(false)
    }
  }

  const handleGuardarPrefs = () => {
    localStorage.setItem('up_notif_email', JSON.stringify(notifEmail))
    localStorage.setItem('up_notif_sms', JSON.stringify(notifSms))
    localStorage.setItem('up_idioma', idioma)
    setPrefsSaved(true)
    setTimeout(() => setPrefsSaved(false), 2000)
  }

  const initials = [perfil.nombre?.[0], perfil.apellido?.[0]]
    .filter(Boolean).join('').toUpperCase() || user?.email?.[0]?.toUpperCase() || '?'

  const fullName = [perfil.nombre, perfil.apellido].filter(Boolean).join(' ')

  if (!user) {
    return (
      <Layout>
        <div className="up-empty-state">
          <svg viewBox="0 0 48 48" fill="none" width="56" height="56">
            <circle cx="24" cy="24" r="24" fill="rgba(92,26,46,0.08)" />
            <path d="M24 24a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-12 14c0-6.627 5.373-12 12-12s12 5.373 12 12" stroke="#5c1a2e" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          <h2 style={{ fontSize: '1.4rem', color: 'var(--color-text)' }}>Mi Cuenta</h2>
          <p>Iniciá sesión para ver y gestionar tu perfil.</p>
          <button className="button primary" type="button" onClick={() => navigate('/login')}>
            Iniciar Sesión
          </button>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="up-page">

        {/* ── Sidebar ── */}
        <aside className="up-sidebar">
          <div className="up-sidebar-avatar">{cargando ? '…' : initials}</div>
          <p className="up-sidebar-name">{fullName || user.email}</p>
          <p className="up-sidebar-subtitle">Gestionar sus preferencias</p>

          <nav className="up-sidebar-nav">
            <button
              type="button"
              className={`up-sidebar-link${activeSection === 'perfil' ? ' active' : ''}`}
              onClick={() => scrollTo(secPerfil, 'perfil')}
            >
              <svg viewBox="0 0 20 20" fill="currentColor" width="15" height="15">
                <path fillRule="evenodd" d="M10 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-7 9a7 7 0 1 1 14 0H3z" clipRule="evenodd" />
              </svg>
              Perfil
            </button>

            <button
              type="button"
              className={`up-sidebar-link${activeSection === 'seguridad' ? ' active' : ''}`}
              onClick={() => scrollTo(secSeguridad, 'seguridad')}
            >
              <svg viewBox="0 0 20 20" fill="currentColor" width="15" height="15">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0 1 10 0v2a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2zm8-2v2H7V7a3 3 0 0 1 6 0z" clipRule="evenodd" />
              </svg>
              Seguridad
            </button>

            <button
              type="button"
              className={`up-sidebar-link${activeSection === 'notificaciones' ? ' active' : ''}`}
              onClick={() => scrollTo(secNotif, 'notificaciones')}
            >
              <svg viewBox="0 0 20 20" fill="currentColor" width="15" height="15">
                <path d="M10 2a6 6 0 0 0-6 6v3.586l-.707.707A1 1 0 0 0 4 14h12a1 1 0 0 0 .707-1.707L16 11.586V8a6 6 0 0 0-6-6zm0 16a3 3 0 0 1-2.83-2h5.66A3 3 0 0 1 10 18z" />
              </svg>
              Notificaciones
            </button>

            <button
              type="button"
              className={`up-sidebar-link${activeSection === 'pedidos' ? ' active' : ''}`}
              onClick={() => scrollTo(secPedidos, 'pedidos')}
            >
              <svg viewBox="0 0 20 20" fill="currentColor" width="15" height="15">
                <path d="M3 1a1 1 0 0 0 0 2h1.22l.305 1.222a.997.997 0 0 0 .01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 0 0 0-2H6.414l1-1H14a1 1 0 0 0 .894-.553l3-6A1 1 0 0 0 17 3H6.28l-.31-1.243A1 1 0 0 0 5 1H3z" />
              </svg>
              Pedidos
            </button>

            {user.role === 'admin' && (
              <Link className="up-sidebar-link admin" to="/admin">
                <svg viewBox="0 0 20 20" fill="currentColor" width="15" height="15">
                  <path fillRule="evenodd" d="M2.5 3A1.5 1.5 0 0 0 1 4.5v4A1.5 1.5 0 0 0 2.5 10h4A1.5 1.5 0 0 0 8 8.5v-4A1.5 1.5 0 0 0 6.5 3h-4zm9 0A1.5 1.5 0 0 0 10 4.5v4A1.5 1.5 0 0 0 11.5 10h4A1.5 1.5 0 0 0 17 8.5v-4A1.5 1.5 0 0 0 15.5 3h-4zm-9 9A1.5 1.5 0 0 0 1 13.5v4A1.5 1.5 0 0 0 2.5 19h4A1.5 1.5 0 0 0 8 17.5v-4A1.5 1.5 0 0 0 6.5 12h-4zm9 0a1.5 1.5 0 0 0-1.5 1.5v4a1.5 1.5 0 0 0 1.5 1.5h4a1.5 1.5 0 0 0 1.5-1.5v-4a1.5 1.5 0 0 0-1.5-1.5h-4z" clipRule="evenodd" />
                </svg>
                Panel Admin
              </Link>
            )}

            <button
              type="button"
              className="up-sidebar-link danger"
              onClick={() => { logout(); navigate('/') }}
            >
              <svg viewBox="0 0 20 20" fill="currentColor" width="15" height="15">
                <path fillRule="evenodd" d="M3 3a1 1 0 0 0-1 1v12a1 1 0 1 0 2 0V4a1 1 0 0 0-1-1zm10.293 9.293a1 1 0 0 0 1.414 1.414l3-3a1 1 0 0 0 0-1.414l-3-3a1 1 0 1 0-1.414 1.414L14.586 9H7a1 1 0 1 0 0 2h7.586l-1.293 1.293z" clipRule="evenodd" />
              </svg>
              Salir de la Cuenta
            </button>
          </nav>
        </aside>

        {/* ── Main ── */}
        <main className="up-main">

          {/* Información Personal */}
          <section ref={secPerfil} className="up-card">
            <div className="up-card-header">
              <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                <path fillRule="evenodd" d="M10 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-7 9a7 7 0 1 1 14 0H3z" clipRule="evenodd" />
              </svg>
              <h2 className="up-card-title">Información Personal</h2>
              <span className={`up-badge ${user.role === 'admin' ? 'admin' : 'cliente'}`}>
                {user.role === 'admin' ? 'Perfil Admin' : 'Perfil Artesanal'}
              </span>
            </div>

            <div className="up-card-body">
              <div className="up-avatar-row">
                <div className="up-avatar-circle">{cargando ? '…' : initials}</div>
                <div className="up-avatar-info">
                  <p className="up-avatar-name">{fullName || '—'}</p>
                  <p className="up-avatar-email">{perfil.email || user.email}</p>
                </div>
              </div>

              <div className="up-form-grid">
                <div className="up-field">
                  <label className="up-label" htmlFor="up-nombre">Nombre</label>
                  <input
                    id="up-nombre"
                    className="up-input"
                    type="text"
                    value={perfil.nombre}
                    onChange={(e) => setPerfil((f) => ({ ...f, nombre: e.target.value }))}
                    placeholder="Tu nombre"
                  />
                </div>

                <div className="up-field">
                  <label className="up-label" htmlFor="up-apellido">Apellido</label>
                  <input
                    id="up-apellido"
                    className="up-input"
                    type="text"
                    value={perfil.apellido}
                    onChange={(e) => setPerfil((f) => ({ ...f, apellido: e.target.value }))}
                    placeholder="Tu apellido"
                  />
                </div>

                <div className="up-field">
                  <label className="up-label" htmlFor="up-email">Correo Electrónico</label>
                  <input
                    id="up-email"
                    className="up-input"
                    type="email"
                    value={perfil.email || user.email}
                    disabled
                    title="El email no se puede modificar"
                  />
                </div>

                <div className="up-field">
                  <label className="up-label" htmlFor="up-telefono">Teléfono</label>
                  <input
                    id="up-telefono"
                    className="up-input"
                    type="tel"
                    value={perfil.telefono}
                    onChange={(e) => setPerfil((f) => ({ ...f, telefono: e.target.value }))}
                    placeholder="+54 11 1234 5678"
                  />
                </div>
              </div>

              {errorPerfil && <p className="up-msg error">{errorPerfil}</p>}
              {exitoPerfil && <p className="up-msg success">{exitoPerfil}</p>}

              <div className="up-btn-row">
                <button
                  className="button primary"
                  type="button"
                  onClick={handleGuardarPerfil}
                  disabled={guardandoPerfil || cargando}
                >
                  {guardandoPerfil ? 'Guardando...' : 'Actualizar Perfil'}
                </button>
              </div>
            </div>
          </section>

          {/* Seguridad */}
          <section ref={secSeguridad} className="up-card">
            <div className="up-card-header">
              <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0 1 10 0v2a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2zm8-2v2H7V7a3 3 0 0 1 6 0z" clipRule="evenodd" />
              </svg>
              <h2 className="up-card-title">Seguridad</h2>
            </div>

            <div className="up-card-body">
              <p className="up-section-help">
                Actualizá tu contraseña periódicamente para mantener tu cuenta segura.
              </p>

              <div className="up-form-grid">
                <div className="up-field full">
                  <label className="up-label" htmlFor="up-pass-actual">Contraseña Actual</label>
                  <input
                    id="up-pass-actual"
                    className="up-input"
                    type="password"
                    value={pass.actual}
                    onChange={(e) => setPass((p) => ({ ...p, actual: e.target.value }))}
                    placeholder="••••••••"
                  />
                </div>

                <div className="up-field">
                  <label className="up-label" htmlFor="up-pass-nueva">Nueva Contraseña</label>
                  <input
                    id="up-pass-nueva"
                    className="up-input"
                    type="password"
                    value={pass.nueva}
                    onChange={(e) => setPass((p) => ({ ...p, nueva: e.target.value }))}
                    placeholder="Nueva contraseña"
                  />
                </div>

                <div className="up-field">
                  <label className="up-label" htmlFor="up-pass-confirmar">Confirmar Nueva Contraseña</label>
                  <input
                    id="up-pass-confirmar"
                    className="up-input"
                    type="password"
                    value={pass.confirmar}
                    onChange={(e) => setPass((p) => ({ ...p, confirmar: e.target.value }))}
                    placeholder="Confirmar contraseña"
                  />
                </div>
              </div>

              {errorPass && <p className="up-msg error">{errorPass}</p>}
              {exitoPass && <p className="up-msg success">{exitoPass}</p>}

              <div className="up-btn-row">
                <button
                  className="button primary"
                  type="button"
                  onClick={handleCambiarPass}
                  disabled={guardandoPass}
                >
                  {guardandoPass ? 'Cambiando...' : 'Cambiar Contraseña'}
                </button>
              </div>
            </div>
          </section>

          {/* Preferencias + Direcciones */}
          <div className="up-two-col">
            <section ref={secNotif} className="up-card">
              <div className="up-card-header">
                <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                  <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 0 1-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 0 1 .947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 0 1 2.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 0 1 2.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 0 1 .947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 0 1-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 0 1-2.287-.947zM10 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" clipRule="evenodd" />
                </svg>
                <h2 className="up-card-title">Preferencias</h2>
              </div>
              <div className="up-card-body">
                <div className="up-pref-group">
                  <label className="up-label" htmlFor="up-idioma">Idioma del Sistema</label>
                  <select
                    id="up-idioma"
                    className="up-input"
                    style={{ marginTop: 5 }}
                    value={idioma}
                    onChange={(e) => setIdioma(e.target.value)}
                  >
                    <option value="es">Español (ES)</option>
                    <option value="en">English (EN)</option>
                    <option value="pt">Português (PT)</option>
                  </select>
                </div>

                <p className="up-pref-subtitle">Notificaciones</p>

                <div className="up-pref-row">
                  <span className="up-pref-label">Correo electrónico</span>
                  <label className="up-toggle">
                    <input
                      type="checkbox"
                      checked={notifEmail}
                      onChange={(e) => setNotifEmail(e.target.checked)}
                    />
                    <span className="up-toggle-slider" />
                  </label>
                </div>

                <div className="up-pref-row">
                  <span className="up-pref-label">SMS de entrega</span>
                  <label className="up-toggle">
                    <input
                      type="checkbox"
                      checked={notifSms}
                      onChange={(e) => setNotifSms(e.target.checked)}
                    />
                    <span className="up-toggle-slider" />
                  </label>
                </div>

                {prefsSaved && <p className="up-msg success" style={{ marginTop: 12 }}>Preferencias guardadas.</p>}

                <div className="up-btn-row">
                  <button className="button primary" type="button" onClick={handleGuardarPrefs}>
                    Guardar Preferencias
                  </button>
                </div>
              </div>
            </section>

            <div className="up-card">
              <div className="up-card-header">
                <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 1 1 9.9 9.9L10 18.9l-4.95-4.95a7 7 0 0 1 0-9.9zM10 11a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" clipRule="evenodd" />
                </svg>
                <h2 className="up-card-title">Direcciones Guardadas</h2>
                <button className="up-add-link" type="button">+ Añadir Nueva</button>
              </div>
              <div className="up-card-body">
                <p style={{ fontSize: '0.82rem', color: 'var(--color-muted)', lineHeight: 1.5 }}>
                  Tus direcciones de envío aparecerán aquí cuando completes tu primera compra.
                </p>
              </div>
            </div>
          </div>

          {/* Resumen de Pedidos Recientes */}
          <section ref={secPedidos} className="up-orders-section">
            <div className="up-orders-head">
              <div>
                <p className="up-orders-title">Resumen de Pedidos Recientes</p>
                <p className="up-orders-subtitle">Rastreá tus pedidos activos y el historial de sastrería.</p>
              </div>
              {user.role === 'admin' && (
                <Link className="up-admin-btn" to="/admin">
                  <svg viewBox="0 0 20 20" fill="currentColor" width="15" height="15">
                    <path fillRule="evenodd" d="M2.5 3A1.5 1.5 0 0 0 1 4.5v4A1.5 1.5 0 0 0 2.5 10h4A1.5 1.5 0 0 0 8 8.5v-4A1.5 1.5 0 0 0 6.5 3h-4zm9 0A1.5 1.5 0 0 0 10 4.5v4A1.5 1.5 0 0 0 11.5 10h4A1.5 1.5 0 0 0 17 8.5v-4A1.5 1.5 0 0 0 15.5 3h-4zm-9 9A1.5 1.5 0 0 0 1 13.5v4A1.5 1.5 0 0 0 2.5 19h4A1.5 1.5 0 0 0 8 17.5v-4A1.5 1.5 0 0 0 6.5 12h-4zm9 0a1.5 1.5 0 0 0-1.5 1.5v4a1.5 1.5 0 0 0 1.5 1.5h4a1.5 1.5 0 0 0 1.5-1.5v-4a1.5 1.5 0 0 0-1.5-1.5h-4z" clipRule="evenodd" />
                  </svg>
                  Ir al Panel Administrativo
                </Link>
              )}
            </div>

            {pedidos.length > 0 ? (
              <div className="up-orders-grid">
                {pedidos.map((p) => (
                  <div key={p.idPedido} className="up-order-card">
                    <div className="up-order-img-placeholder">
                      <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
                        <path d="M3 1a1 1 0 0 0 0 2h1.22l.305 1.222a.997.997 0 0 0 .01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 0 0 0-2H6.414l1-1H14a1 1 0 0 0 .894-.553l3-6A1 1 0 0 0 17 3H6.28l-.31-1.243A1 1 0 0 0 5 1H3z" />
                      </svg>
                    </div>
                    <div>
                      <p className="up-order-id">Pedido #{p.idPedido}</p>
                      <p className="up-order-status">{ESTADO_LABELS[p.estado] ?? p.estado}</p>
                      <p className="up-order-total">AR$ {Number(p.total).toLocaleString('es-AR')}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="up-orders-empty">Todavía no tenés pedidos registrados.</p>
            )}
          </section>

        </main>
      </div>
    </Layout>
  )
}
