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
          <form className="form-panel">
            <h2>Envianos un mensaje</h2>
            <div className="form-grid">
              <label>
                Nombre
                <input placeholder="Tu nombre" />
              </label>
              <label>
                Correo
                <input type="email" placeholder="mail@empresa.com" />
              </label>
              <label className="wide">
                Motivo de consulta
                <select defaultValue="Uniformes escolares">
                  <option>Uniformes escolares</option>
                  <option>Uniformes medicos</option>
                  <option>Compra mayorista</option>
                </select>
              </label>
              <label className="wide">
                Mensaje
                <textarea placeholder="Contanos que necesitas" />
              </label>
            </div>
            <button className="button primary" type="button">
              Enviar mensaje
            </button>
          </form>

          <aside className="contact-card">
            <h2>Atencion directa</h2>
            <p>Sarmiento 1728, Florida, Vicente Lopez</p>
            <p>WhatsApp: +54 11 5555 1200</p>
            <p>Email: contacto@coyoteuniformes.com</p>
            <div className="map-box">
              <span>Mapa de ubicacion</span>
              <a className="button secondary" href="https://maps.google.com" target="_blank">
                Ver en Google Maps
              </a>
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
