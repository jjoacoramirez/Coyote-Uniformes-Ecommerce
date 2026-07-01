import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../../store/slices/authSlice.js'

const NAV = [
  {
    to: '/admin/productos',
    label: 'Productos',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
        <path d="M4 3a1 1 0 0 0-1 1v1h14V4a1 1 0 0 0-1-1H4zm13 4H3l1 9a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-9z" />
      </svg>
    ),
  },
  {
    to: '/admin/categorias',
    label: 'Categorías',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
        <path fillRule="evenodd" d="M17.707 9.293a1 1 0 0 1 0 1.414l-7 7a1 1 0 0 1-1.414 0l-7-7A.997.997 0 0 1 2 10V5a3 3 0 0 1 3-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    to: '/admin/cupones',
    label: 'Cupones',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
        <path fillRule="evenodd" d="M5.5 3A2.5 2.5 0 0 0 3 5.5v2.879a2.5 2.5 0 0 0 .732 1.767l6.5 6.5a2.5 2.5 0 0 0 3.536 0l2.878-2.878a2.5 2.5 0 0 0 0-3.536l-6.5-6.5A2.5 2.5 0 0 0 8.38 3H5.5zM6 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" clipRule="evenodd" />
      </svg>
    ),
  },
]

export default function AdminLayout() {
  const user = useSelector((s) => s.auth.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  function handleLogout() {
    dispatch(logout())
    navigate('/login')
  }

  const initials = user?.email
    ? user.email.slice(0, 2).toUpperCase()
    : 'AD'

  return (
    <div className="admin-shell">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <strong>Coyote<br />Uniformes</strong>
          <small>Admin Management</small>
        </div>

        <nav className="admin-nav">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `admin-nav-link${isActive ? ' active' : ''}`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <NavLink
            to="/admin/soporte"
            className={({ isActive }) =>
              `admin-nav-link${isActive ? ' active' : ''}`
            }
          >
            <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
              <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM9 9a.75.75 0 0 0 0 1.5h.253a.25.25 0 0 1 .244.304l-.459 2.066A1.75 1.75 0 0 0 10.747 15H11a.75.75 0 0 0 0-1.5h-.253a.25.25 0 0 1-.244-.304l.459-2.066A1.75 1.75 0 0 0 9.253 9H9z" clipRule="evenodd" />
            </svg>
            Soporte
          </NavLink>
          <button className="admin-nav-link admin-logout-btn" onClick={handleLogout}>
            <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
              <path fillRule="evenodd" d="M3 4.25A2.25 2.25 0 0 1 5.25 2h5.5A2.25 2.25 0 0 1 13 4.25v2a.75.75 0 0 1-1.5 0v-2a.75.75 0 0 0-.75-.75h-5.5a.75.75 0 0 0-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 0 0 .75-.75v-2a.75.75 0 0 1 1.5 0v2A2.25 2.25 0 0 1 10.75 18h-5.5A2.25 2.25 0 0 1 3 15.75V4.25z" clipRule="evenodd" />
              <path fillRule="evenodd" d="M6 10a.75.75 0 0 1 .75-.75h9.546l-1.048-.943a.75.75 0 1 1 1.004-1.114l2.5 2.25a.75.75 0 0 1 0 1.114l-2.5 2.25a.75.75 0 1 1-1.004-1.114l1.048-.943H6.75A.75.75 0 0 1 6 10z" clipRule="evenodd" />
            </svg>
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Área principal */}
      <div className="admin-main">
        {/* Barra superior */}
        <header className="admin-topbar">
          <div className="admin-topbar-actions">
            <Link className="icon-button" to="/" title="Volver a la tienda">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.707 2.293a1 1 0 0 0-1.414 0l-7 7a1 1 0 0 0 1.414 1.414L4 10.414V17a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-3h2v3a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-6.586l.293.293a1 1 0 0 0 1.414-1.414l-7-7z" />
              </svg>
            </Link>
            <div className="admin-avatar" title={user?.email}>
              {initials}
            </div>
          </div>
        </header>

        {/* Contenido de la página */}
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
