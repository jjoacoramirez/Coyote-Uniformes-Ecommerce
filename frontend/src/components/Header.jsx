import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

function Header() {
  const { user, logout } = useAuth()

  return (
    <header className="site-header">
      <Link className="brand" to="/" aria-label="Coyote Uniformes - inicio">
        Coyote Uniformes
      </Link>

      <nav className="main-nav" aria-label="Navegacion principal">
        <NavLink to="/">Inicio</NavLink>
        <NavLink to="/productos">Productos</NavLink>
        <NavLink to="/contacto">Contacto</NavLink>
        {user?.role === 'admin' && <NavLink to="/admin">Admin</NavLink>}
      </nav>

      <div className="header-actions" aria-label="Acciones de usuario">
        <Link className="icon-button" to="/carrito" aria-label="Abrir carrito">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M7 18a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm10 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM4.2 4H2V2h3.8l2.1 11h8.7l2.2-7H8.2l-.4-2H21.5l-3.4 11H6.2L4.2 4Z" />
          </svg>
        </Link>
        {user ? (
          <button className="session-pill" type="button" onClick={logout}>
            {user.role === 'admin' ? 'Admin' : 'Cliente'} / Salir
          </button>
        ) : (
          <Link className="icon-button" to="/login" aria-label="Abrir perfil">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4.4 0-8 2.2-8 5v1h16v-1c0-2.8-3.6-5-8-5Z" />
            </svg>
          </Link>
        )}
      </div>
    </header>
  )
}

export default Header
