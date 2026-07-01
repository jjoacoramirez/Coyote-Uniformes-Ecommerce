import { useState, useEffect, useMemo, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Layout from '../components/Layout.jsx'
import { logout } from '../store/slices/authSlice.js'
import { updatePerfil, updateDireccion, updatePassword } from '../store/slices/usuariosSlice.js'
import { fetchPedidos } from '../store/slices/pedidosSlice.js'

const ESTADO_LABELS = {
  pendiente: 'Pendiente',
  en_camino: 'En Camino',
  entregado: 'Entregado',
  cancelado: 'Cancelado',
}

export default function UserAccount() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const user = useSelector((s) => s.auth.user)
  const {
    perfil: perfilData,
    status,
    perfilStatus,
    perfilError,
    direccionStatus,
    direccionError,
    passwordStatus,
    passwordError,
  } = useSelector((s) => s.usuarios)
  const pedidosItems = useSelector((s) => s.pedidos.items)
  const pedidosStatus = useSelector((s) => s.pedidos.status)

  const [perfil, setPerfil] = useState({ nombre: '', apellido: '', email: '', telefono: '' })
  const [direccion, setDireccion] = useState({
    calle: '', numero: '', ciudad: '', provincia: '', codigoPostal: '', pais: 'Argentina',
  })
  const [editandoDireccion, setEditandoDireccion] = useState(false)
  const [errorDireccionLocal, setErrorDireccionLocal] = useState('')
  const [exitoDireccion, setExitoDireccion] = useState('')
  const [errorPerfilLocal, setErrorPerfilLocal] = useState('')
  const [exitoPerfil, setExitoPerfil] = useState('')

  const [pass, setPass] = useState({ actual: '', nueva: '', confirmar: '' })
  const [errorPassLocal, setErrorPassLocal] = useState('')
  const [exitoPass, setExitoPass] = useState('')

  const [notifEmail, setNotifEmail] = useState(true)
  const [notifSms, setNotifSms] = useState(false)
  const [idioma, setIdioma] = useState('es')
  const [prefsSaved, setPrefsSaved] = useState(false)

  const [activeSection, setActiveSection] = useState('perfil')
  const secPerfil = useRef(null)
  const secSeguridad = useRef(null)
  const secNotif = useRef(null)
  const secPedidos = useRef(null)

  const cargando = status === 'idle' || status === 'loading'

  // El perfil ya llega con restoreSession; pedidos conserva su cache en Redux.
  useEffect(() => {
    if (!user) return
    if (pedidosStatus === 'idle') dispatch(fetchPedidos())
  }, [user, pedidosStatus, dispatch])

  // Sincroniza los formularios cuando llega/actualiza el perfil del store.
  useEffect(() => {
    if (perfilData) {
      setPerfil({
        nombre: perfilData.nombre ?? '',
        apellido: perfilData.apellido ?? '',
        email: perfilData.email ?? '',
        telefono: perfilData.telefono ?? '',
      })
      setDireccion({
        calle: perfilData.calle ?? '',
        numero: perfilData.numero ?? '',
        ciudad: perfilData.ciudad ?? '',
        provincia: perfilData.provincia ?? '',
        codigoPostal: perfilData.codigoPostal ?? '',
        pais: perfilData.pais ?? 'Argentina',
      })
    }
  }, [perfilData])

  useEffect(() => {
    if (perfilStatus === 'succeeded') {
      setExitoPerfil('Perfil actualizado correctamente.')
      const t = setTimeout(() => setExitoPerfil(''), 3000)
      return () => clearTimeout(t)
    }
  }, [perfilStatus])

  useEffect(() => {
    if (passwordStatus === 'succeeded') {
      setExitoPass('Contraseña actualizada correctamente.')
      setPass({ actual: '', nueva: '', confirmar: '' })
      const t = setTimeout(() => setExitoPass(''), 3000)
      return () => clearTimeout(t)
    }
  }, [passwordStatus])

  useEffect(() => {
    if (direccionStatus === 'succeeded') {
      setEditandoDireccion(false)
      setExitoDireccion('Direccion guardada correctamente.')
      const t = setTimeout(() => setExitoDireccion(''), 3000)
      return () => clearTimeout(t)
    }
  }, [direccionStatus])

  const ultimosPedidos = useMemo(() => [...pedidosItems].slice(-3).reverse(), [pedidosItems])

  const scrollTo = (ref, section) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setActiveSection(section)
  }

  const handleGuardarPerfil = () => {
    setErrorPerfilLocal('')
    setExitoPerfil('')
    if (!perfil.nombre.trim() || !perfil.apellido.trim()) {
      setErrorPerfilLocal('El nombre y apellido son obligatorios.')
      return
    }
    dispatch(updatePerfil({
      nombre: perfil.nombre.trim(),
      apellido: perfil.apellido.trim(),
      telefono: perfil.telefono.trim() || null,
    }))
  }

  const handleCambiarPass = () => {
    setErrorPassLocal('')
    setExitoPass('')
    if (!pass.actual || !pass.nueva || !pass.confirmar) {
      setErrorPassLocal('Completá todos los campos.')
      return
    }
    if (pass.nueva !== pass.confirmar) {
      setErrorPassLocal('Las contraseñas nuevas no coinciden.')
      return
    }
    if (pass.nueva.length < 6) {
      setErrorPassLocal('La contraseña debe tener al menos 6 caracteres.')
      return
    }
    dispatch(updatePassword({ contrasenaActual: pass.actual, contrasenaNueva: pass.nueva }))
  }

  const direccionCompleta = Boolean(
    direccion.calle.trim() &&
    direccion.numero.trim() &&
    direccion.ciudad.trim() &&
    direccion.provincia.trim() &&
    direccion.codigoPostal.trim()
  )

  const handleGuardarPrefs = () => {
    setPrefsSaved(true)
    setTimeout(() => setPrefsSaved(false), 2000)
  }

  const handleGuardarDireccion = () => {
    setErrorDireccionLocal('')
    setExitoDireccion('')
    if (!direccionCompleta) {
      setErrorDireccionLocal('Completa calle, numero, ciudad, provincia y codigo postal.')
      return
    }
    dispatch(updateDireccion({
      nombre: perfil.nombre.trim(),
      apellido: perfil.apellido.trim(),
      telefono: perfil.telefono.trim() || null,
      actualizarDireccion: true,
      calle: direccion.calle.trim(),
      numero: direccion.numero.trim(),
      ciudad: direccion.ciudad.trim(),
      provincia: direccion.provincia.trim(),
      codigoPostal: direccion.codigoPostal.trim(),
      pais: direccion.pais.trim() || 'Argentina',
    }))
  }

  const handleQuitarDireccion = () => {
    setErrorDireccionLocal('')
    setExitoDireccion('')
    dispatch(updateDireccion({
      nombre: perfil.nombre.trim(),
      apellido: perfil.apellido.trim(),
      telefono: perfil.telefono.trim() || null,
      actualizarDireccion: true,
      calle: null, numero: null, ciudad: null, provincia: null, codigoPostal: null, pais: null,
    }))
  }

  const initials = [perfil.nombre?.[0], perfil.apellido?.[0]]
    .filter(Boolean).join('').toUpperCase() || user?.email?.[0]?.toUpperCase() || '?'

  const fullName = [perfil.nombre, perfil.apellido].filter(Boolean).join(' ')

  const errorPerfil = errorPerfilLocal || perfilError
  const errorPass = errorPassLocal || passwordError
  const errorDireccion = errorDireccionLocal || direccionError
  const guardandoPerfil = perfilStatus === 'loading'
  const guardandoPass = passwordStatus === 'loading'
  const guardandoDireccion = direccionStatus === 'loading'

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
              onClick={() => { dispatch(logout()); navigate('/') }}
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
                <button
                  className="up-add-link"
                  type="button"
                  onClick={() => setEditandoDireccion((value) => !value)}
                >
                  {direccionCompleta ? 'Editar' : '+ Anadir Nueva'}
                </button>
              </div>
              <div className="up-card-body">
                {direccionCompleta && !editandoDireccion && (
                  <div className="up-address-card">
                    <p className="up-address-title">Direccion principal</p>
                    <p className="up-address-line">{direccion.calle} {direccion.numero}</p>
                    <p className="up-address-line">
                      {direccion.ciudad}, {direccion.provincia} ({direccion.codigoPostal})
                    </p>
                    <p className="up-address-line">{direccion.pais || 'Argentina'}</p>
                    <div className="up-address-actions">
                      <button type="button" className="up-text-btn" onClick={() => setEditandoDireccion(true)}>
                        Editar
                      </button>
                      <button type="button" className="up-text-btn danger" onClick={handleQuitarDireccion}>
                        Quitar
                      </button>
                    </div>
                  </div>
                )}

                {!direccionCompleta && !editandoDireccion && (
                  <p style={{ fontSize: '0.82rem', color: 'var(--color-muted)', lineHeight: 1.5 }}>
                    Todavia no tenes direcciones guardadas. Agrega una para usarla en tus proximos envios.
                  </p>
                )}

                {editandoDireccion && (
                  <div className="up-address-form">
                    <div className="up-form-grid">
                      <div className="up-field">
                        <label className="up-label" htmlFor="up-dir-calle">Calle</label>
                        <input
                          id="up-dir-calle"
                          className="up-input"
                          type="text"
                          value={direccion.calle}
                          onChange={(e) => setDireccion((d) => ({ ...d, calle: e.target.value }))}
                          placeholder="Av. Siempre Viva"
                        />
                      </div>
                      <div className="up-field">
                        <label className="up-label" htmlFor="up-dir-numero">Numero</label>
                        <input
                          id="up-dir-numero"
                          className="up-input"
                          type="text"
                          value={direccion.numero}
                          onChange={(e) => setDireccion((d) => ({ ...d, numero: e.target.value }))}
                          placeholder="742"
                        />
                      </div>
                      <div className="up-field">
                        <label className="up-label" htmlFor="up-dir-ciudad">Ciudad</label>
                        <input
                          id="up-dir-ciudad"
                          className="up-input"
                          type="text"
                          value={direccion.ciudad}
                          onChange={(e) => setDireccion((d) => ({ ...d, ciudad: e.target.value }))}
                          placeholder="Ciudad"
                        />
                      </div>
                      <div className="up-field">
                        <label className="up-label" htmlFor="up-dir-provincia">Provincia</label>
                        <input
                          id="up-dir-provincia"
                          className="up-input"
                          type="text"
                          value={direccion.provincia}
                          onChange={(e) => setDireccion((d) => ({ ...d, provincia: e.target.value }))}
                          placeholder="Provincia"
                        />
                      </div>
                      <div className="up-field">
                        <label className="up-label" htmlFor="up-dir-cp">Codigo postal</label>
                        <input
                          id="up-dir-cp"
                          className="up-input"
                          type="text"
                          value={direccion.codigoPostal}
                          onChange={(e) => setDireccion((d) => ({ ...d, codigoPostal: e.target.value }))}
                          placeholder="1000"
                        />
                      </div>
                      <div className="up-field">
                        <label className="up-label" htmlFor="up-dir-pais">Pais</label>
                        <input
                          id="up-dir-pais"
                          className="up-input"
                          type="text"
                          value={direccion.pais}
                          onChange={(e) => setDireccion((d) => ({ ...d, pais: e.target.value }))}
                          placeholder="Argentina"
                        />
                      </div>
                    </div>

                    <div className="up-address-actions form">
                      <button
                        className="button primary"
                        type="button"
                        onClick={handleGuardarDireccion}
                        disabled={guardandoDireccion}
                      >
                        {guardandoDireccion ? 'Guardando...' : 'Guardar Direccion'}
                      </button>
                      <button
                        className="button secondary"
                        type="button"
                        onClick={() => setEditandoDireccion(false)}
                        disabled={guardandoDireccion}
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}

                {errorDireccion && <p className="up-msg error">{errorDireccion}</p>}
                {exitoDireccion && <p className="up-msg success">{exitoDireccion}</p>}
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

            {ultimosPedidos.length > 0 ? (
              <div className="up-orders-grid">
                {ultimosPedidos.map((p) => (
                  <div key={p.idPedido} className="up-order-card">
                    <div className="up-order-img-placeholder">
                      <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
                        <path d="M3 1a1 1 0 0 0 0 2h1.22l.305 1.222a.997.997 0 0 0 .01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 0 0 0-2H6.414l1-1H14a1 1 0 0 0 .894-.553l3-6A1 1 0 0 0 17 3H6.28l-.31-1.243A1 1 0 0 0 5 1H3z" />
                      </svg>
                    </div>
                    <div>
                      <p className="up-order-id">Pedido #{p.idPedido}</p>
                      <p className="up-order-status">{ESTADO_LABELS[p.estado?.toLowerCase()] ?? p.estado}</p>
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
