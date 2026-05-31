import { Link } from 'react-router-dom'

function HeroBanner() {
  return (
    <section className="hero-banner">
      <div className="hero-copy">
        <p className="eyebrow">Uniformes institucionales</p>
        <h1>Tu uniforme, nuestra especialidad</h1>
        <p>
          Disenamos prendas comodas, resistentes y listas para representar la identidad de
          cada equipo.
        </p>
        <div className="button-row">
          <Link className="button primary" to="/productos">
            Comprar ahora
          </Link>
          <Link className="button secondary" to="/productos">
            Ver catalogo
          </Link>
        </div>
      </div>
    </section>
  )
}

export default HeroBanner
