import { Link } from 'react-router-dom'
import Layout from '../components/Layout.jsx'
import OrderSummary from '../components/OrderSummary.jsx'
import Stepper from '../components/Stepper.jsx'
import { useCart } from '../context/CartContext.jsx'
import { formatPrice } from '../data/products.js'

function Cart() {
  const { cartItems, updateQuantity, removeFromCart } = useCart()

  if (cartItems.length === 0) {
    return (
      <Layout>
        <section className="checkout-page">
          <Stepper activeStep={0} />
          <div className="checkout-main">
            <h1>Tu carrito</h1>
            <p>No hay productos en el carrito.</p>
            <Link className="button secondary" to="/productos">Ver productos</Link>
          </div>
        </section>
      </Layout>
    )
  }

  return (
    <Layout>
      <section className="checkout-page">
        <Stepper activeStep={0} />
        <div className="checkout-grid">
          <div className="checkout-main">
            <h1>Tu carrito</h1>

            <div className="cart-items-list">
              {cartItems.map(({ key, product, variante, quantity }) => {
                const precio = variante?.precio ?? product.price
                const subtotal = precio * quantity
                return (
                  <article className="cart-item" key={key}>
                    <img src={product.image} alt={product.name} />
                    <div>
                      <h2>{product.name}</h2>
                      <p>Talle {variante?.talle ?? '-'} / {product.categoryLabel}</p>
                      <div className="quantity-control">
                        <button type="button" onClick={() => updateQuantity(key, quantity - 1)}>-</button>
                        <span>{quantity}</span>
                        <button type="button" onClick={() => updateQuantity(key, quantity + 1)}>+</button>
                      </div>
                      <button
                        className="cart-remove"
                        type="button"
                        onClick={() => removeFromCart(key)}
                      >
                        Quitar
                      </button>
                    </div>
                    <strong>{formatPrice(subtotal)}</strong>
                  </article>
                )
              })}
            </div>

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

          <OrderSummary ctaLabel="Continuar a envio" ctaTo="/checkout/envio" showCoupon />
        </div>
      </section>
    </Layout>
  )
}

export default Cart
