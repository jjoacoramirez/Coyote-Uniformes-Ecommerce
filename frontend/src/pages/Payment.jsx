import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Layout from '../components/Layout.jsx'
import OrderSummary from '../components/OrderSummary.jsx'
import Stepper from '../components/Stepper.jsx'
import { useCart } from '../context/CartContext.jsx'
import { api } from '../services/api.js'

const methods = ['Tarjeta de credito', 'Mercado Pago', 'Transferencia bancaria']

function Payment() {
  const navigate = useNavigate()
  const { cartItems } = useCart()
  const [method, setMethod] = useState(methods[1])
  const [error, setError] = useState('')
  const [confirming, setConfirming] = useState(false)

  async function handleConfirm() {
    if (cartItems.length === 0) {
      setError('El carrito esta vacio.')
      return
    }

    setConfirming(true)
    setError('')
    try {
      const checkout = await api.post('/carritos/me/checkout', { metodoPago: method })
      navigate(`/checkout/confirmacion?pedido=${checkout.idPedido}`, { state: { checkout } })
    } catch (err) {
      setError(err.message || 'No se pudo confirmar el pago.')
    } finally {
      setConfirming(false)
    }
  }

  return (
    <Layout>
      <section className="checkout-page">
        <Stepper activeStep={2} />
        <div className="checkout-grid">
          <div className="checkout-main form-panel">
            <Link className="checkout-back-link" to="/checkout/envio">
              Volver al envio
            </Link>
            <h1>Pago</h1>
            <p>Elegi el medio de pago para finalizar la compra de forma segura.</p>

            <div className="method-grid payment-methods">
              {methods.map((option) => (
                <button
                  key={option}
                  type="button"
                  className={method === option ? 'selected' : ''}
                  onClick={() => setMethod(option)}
                >
                  <strong>{option}</strong>
                  <span>
                    {option === 'Mercado Pago'
                      ? 'Tarjetas, dinero en cuenta o QR'
                      : 'Confirmacion al finalizar'}
                  </span>
                </button>
              ))}
            </div>

            {method === 'Tarjeta de credito' && (
              <div className="form-grid">
                <label className="wide">
                  Numero de tarjeta
                  <input placeholder="0000 0000 0000 0000" />
                </label>
                <label>
                  Vencimiento
                  <input placeholder="MM/AA" />
                </label>
                <label>
                  CVV
                  <input placeholder="123" />
                </label>
              </div>
            )}

            {error && <p className="form-error">{error}</p>}

            <button className="button primary full" type="button" onClick={handleConfirm} disabled={confirming}>
              {confirming ? 'Confirmando...' : 'Confirmar pago'}
            </button>
          </div>

          <OrderSummary paymentMethod={method} />
        </div>
      </section>
    </Layout>
  )
}

export default Payment
