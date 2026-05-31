import { Link } from 'react-router-dom'
import { cartProduct, cartSummary, formatPrice } from '../data/products.js'

function OrderSummary({ ctaLabel, ctaTo, paymentMethod, quantity = cartSummary.quantity }) {
  const subtotal = cartProduct.price * quantity
  const discount = Math.round(subtotal * cartSummary.discountRate)
  const total = subtotal - discount + cartSummary.shipping + cartSummary.tax

  return (
    <aside className="order-summary">
      <h2>Resumen de compra</h2>
      <div className="summary-product">
        <img src={cartProduct.image} alt="" />
        <div>
          <strong>{cartProduct.name}</strong>
          <span>Talle M / Cantidad {quantity}</span>
        </div>
      </div>

      <dl>
        <div>
          <dt>Subtotal</dt>
          <dd>{formatPrice(subtotal)}</dd>
        </div>
        <div>
          <dt>Descuento ({cartSummary.coupon})</dt>
          <dd>-{formatPrice(discount)}</dd>
        </div>
        <div>
          <dt>Envio estimado</dt>
          <dd>{cartSummary.shipping === 0 ? 'Gratis' : formatPrice(cartSummary.shipping)}</dd>
        </div>
        <div>
          <dt>IVA</dt>
          <dd>{formatPrice(cartSummary.tax)}</dd>
        </div>
        {paymentMethod && (
          <div>
            <dt>Medio de pago</dt>
            <dd>{paymentMethod}</dd>
          </div>
        )}
        <div className="summary-total">
          <dt>Total</dt>
          <dd>{formatPrice(total)}</dd>
        </div>
      </dl>

      <p className="discount-note">
        El descuento se aplica en el carrito mediante cupon, antes de calcular el total.
      </p>

      {ctaTo && (
        <Link className="button primary full" to={ctaTo}>
          {ctaLabel}
        </Link>
      )}
    </aside>
  )
}

export default OrderSummary
