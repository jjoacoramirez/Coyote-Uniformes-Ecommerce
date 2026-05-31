import { Link } from 'react-router-dom'
import Layout from '../components/Layout.jsx'

function Confirmation() {
  return (
    <Layout>
      <section className="confirmation-page">
        <span>Pedido #CU-1027</span>
        <h1>Compra confirmada</h1>
        <p>Recibimos el pedido y enviamos el comprobante al correo registrado.</p>
        <Link className="button primary" to="/productos">
          Volver al catalogo
        </Link>
      </section>
    </Layout>
  )
}

export default Confirmation
