import { Link, NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'

function Header() {
  const user = useSelector((s) => s.auth.user)

  return (
    <header className="site-header">
      <Link className="brand" to="/" aria-label="Coyote Uniformes - inicio">
        Coyote Uniformes
      </Link>

      <nav className="main-nav" aria-label="Navegacion principal">
        <NavLink to="/">Inicio</NavLink>
        <NavLink to="/productos">Productos</NavLink>
        <NavLink to="/contacto">Contacto</NavLink>
      </nav>

      <div className="header-actions" aria-label="Acciones de usuario">
        <Link className="icon-button" to="/carrito" aria-label="Abrir carrito">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M7 18a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm10 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM4.2 4H2V2h3.8l2.1 11h8.7l2.2-7H8.2l-.4-2H21.5l-3.4 11H6.2L4.2 4Z" />
          </svg>
        </Link>
        {user?.role === 'admin' && (
          <Link
            className="icon-button admin-panel-btn"
            to="/admin/productos"
            aria-label="Panel de administración"
            title="Panel de administración"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path
                fillRule="evenodd"
                d="M2.5 3A1.5 1.5 0 0 0 1 4.5v4A1.5 1.5 0 0 0 2.5 10h4A1.5 1.5 0 0 0 8 8.5v-4A1.5 1.5 0 0 0 6.5 3h-4zm9 0A1.5 1.5 0 0 0 10 4.5v4A1.5 1.5 0 0 0 11.5 10h4A1.5 1.5 0 0 0 17 8.5v-4A1.5 1.5 0 0 0 15.5 3h-4zm-9 9A1.5 1.5 0 0 0 1 13.5v4A1.5 1.5 0 0 0 2.5 19h4A1.5 1.5 0 0 0 8 17.5v-4A1.5 1.5 0 0 0 6.5 12h-4zm9 0a1.5 1.5 0 0 0-1.5 1.5v4a1.5 1.5 0 0 0 1.5 1.5h4a1.5 1.5 0 0 0 1.5-1.5v-4a1.5 1.5 0 0 0-1.5-1.5h-4z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        )}
        <Link
          className="icon-button"
          to={user ? '/mi-cuenta' : '/login'}
          aria-label={user ? 'Ver mi cuenta' : 'Iniciar sesión'}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4.4 0-8 2.2-8 5v1h16v-1c0-2.8-3.6-5-8-5Z" />
          </svg>
        </Link>
      </div>
    </header>
  )
}

export default Header
