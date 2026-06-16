import Formulario from '../components/Formulario.jsx'
import Layout from '../components/Layout.jsx'

function Contact() {
  return (
    <Layout>
      <section className="contact-page">
        <div className="section-heading centered">
          <p className="eyebrow">Tradicion y calidad</p>
          <h1>Conectemos con excelencia</h1>
          <p>Estamos para asesorarte en la eleccion de uniformes escolares y corporativos.</p>
        </div>

        <div className="contact-grid">
          <Formulario />

          <aside className="contact-card">
            <h2>Atencion directa</h2>
            <p>Sarmiento 1728, Florida, Vicente Lopez</p>
            <p>WhatsApp: +54 11 5555 1200</p>
            <p>Email: contacto@coyoteuniformes.com</p>

            <div className="social-box">
              <span>Seguinos en redes</span>
              <p>Conoce novedades, trabajos realizados y lanzamientos de temporada.</p>
              <div className="social-links">
                <a href="https://www.instagram.com/coyote.florida/" target="_blank" rel="noreferrer">
                  <strong>Instagram</strong>
                  <small>@coyote.florida</small>
                </a>
                <a href="https://wa.me/541155551200" target="_blank" rel="noreferrer">
                  <strong>WhatsApp</strong>
                  <small>Consultas y presupuestos</small>
                </a>
              </div>
            </div>
          </aside>
        </div>

        <section className="wholesale-banner">
          <div>
            <h2>Necesitas un presupuesto mayorista?</h2>
            <p>Armamos propuestas para colegios, clinicas y empresas.</p>
          </div>
          <button className="button secondary" type="button">
            Solicitar cotizacion
          </button>
        </section>
      </section>
    </Layout>
  )
}

export default Contact
