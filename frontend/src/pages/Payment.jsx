import { useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout.jsx'
import OrderSummary from '../components/OrderSummary.jsx'
import Stepper from '../components/Stepper.jsx'

const methods = ['Tarjeta de credito', 'Mercado Pago', 'Transferencia bancaria']

function Payment() {
  const [method, setMethod] = useState(methods[1])

  return (
    <Layout>
      <section className="checkout-page">
        <Stepper activeStep={2} />
        <div className="checkout-grid">
          <div className="checkout-main form-panel">
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

            <Link className="button primary full" to="/checkout/confirmacion">
              Confirmar pago
            </Link>
          </div>

          <OrderSummary paymentMethod={method} />
        </div>
      </section>
    </Layout>
  )
}

export default Payment
