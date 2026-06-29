import { Link, useLocation, useSearchParams } from 'react-router-dom'
import Layout from '../components/Layout.jsx'
import { formatPrice } from '../utils/format.js'

function Confirmation() {
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const checkout = location.state?.checkout
  const pedidoId = checkout?.idPedido ?? searchParams.get('pedido')

  return (
    <Layout>
      <section className="confirmation-page">
        <span>Pedido #{pedidoId ?? 'confirmado'}</span>
        <h1>Compra confirmada</h1>
        <p>Recibimos el pedido y enviamos el comprobante al correo registrado.</p>
        {checkout?.total != null && <p>Total: {formatPrice(checkout.total)}</p>}
        <Link className="button primary" to="/productos">
          Volver al catalogo
        </Link>
      </section>
    </Layout>
  )
}

export default Confirmation
