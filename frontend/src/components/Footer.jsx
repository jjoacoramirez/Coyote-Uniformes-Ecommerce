import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="site-footer">
      <div>
        <strong>Coyote Uniformes</strong>
        <p>Indumentaria profesional para equipos que necesitan verse y trabajar mejor.</p>
      </div>
      <nav aria-label="Links secundarios">
        <Link to="/productos">Productos</Link>
        <Link to="/contacto">Contacto</Link>
      </nav>
      <small>© 2026 Coyote Uniformes. Todos los derechos reservados.</small>
    </footer>
  )
}

export default Footer
