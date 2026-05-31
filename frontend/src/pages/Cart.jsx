import { useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout.jsx'
import OrderSummary from '../components/OrderSummary.jsx'
import Stepper from '../components/Stepper.jsx'
import { cartProduct, cartSummary, formatPrice } from '../data/products.js'

function Cart() {
  const [quantity, setQuantity] = useState(cartSummary.quantity)
  const subtotal = cartProduct.price * quantity

  return (
    <Layout>
      <section className="checkout-page">
        <Stepper activeStep={0} />
        <div className="checkout-grid">
          <div className="checkout-main">
            <h1>Tu carrito</h1>
            <article className="cart-item">
              <img src={cartProduct.image} alt={cartProduct.name} />
              <div>
                <h2>{cartProduct.name}</h2>
                <p>Talle M / Color institucional</p>
                <div className="quantity-control">
                  <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                    -
                  </button>
                  <span>{quantity}</span>
                  <button type="button" onClick={() => setQuantity(quantity + 1)}>
                    +
                  </button>
                </div>
              </div>
              <strong>{formatPrice(subtotal)}</strong>
            </article>

            <section className="payment-strip" aria-label="Medios de pago aceptados">
              <span>Medios de pago</span>
              <div>
                <strong>VISA</strong>
                <strong>Mastercard</strong>
                <strong>Mercado Pago</strong>
              </div>
            </section>

            <Link className="button secondary" to="/productos">
              Seguir comprando
            </Link>
          </div>

          <OrderSummary ctaLabel="Continuar a envio" ctaTo="/checkout/envio" quantity={quantity} />
        </div>
      </section>
    </Layout>
  )
}

export default Cart
