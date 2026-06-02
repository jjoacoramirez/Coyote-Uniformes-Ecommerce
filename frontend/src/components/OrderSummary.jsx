import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { cartSummary, formatPrice } from '../data/products.js'

function calcularDescuento(subtotal, coupon) {
  if (!coupon) return 0
  const valor = Number(coupon.valor)
  if (coupon.tipo === 'PORCENTAJE') return Math.round(subtotal * (valor / 100))
  return Math.min(valor, subtotal) // MONTO_FIJO, cap al subtotal
}

function OrderSummary({ ctaLabel, ctaTo, paymentMethod, showCoupon = false }) {
  const { cartItem, appliedCoupon, applyCoupon, removeCoupon } = useCart()
  const [inputCoupon, setInputCoupon] = useState('')
  const [error, setError] = useState('')
  const [applying, setApplying] = useState(false)

  if (!cartItem) return null

  const { product, variante, quantity } = cartItem
  const precio = variante?.precio ?? product.price
  const subtotal = precio * quantity
  const discount = calcularDescuento(subtotal, appliedCoupon)
  const total = subtotal - discount + cartSummary.shipping + cartSummary.tax

  async function handleApply(e) {
    e.preventDefault()
    if (!inputCoupon.trim()) return
    setApplying(true)
    try {
      await applyCoupon(inputCoupon)
      setError('')
      setInputCoupon('')
    } catch (err) {
      setError(err.message || 'Cupón inválido')
    } finally {
      setApplying(false)
    }
  }

  return (
    <aside className="order-summary">
      <h2>Resumen de compra</h2>
      <div className="summary-product">
        <img src={product.image} alt="" />
        <div>
          <strong>{product.name}</strong>
          <span>Talle {variante?.talle ?? '—'} / Cantidad {quantity}</span>
        </div>
      </div>

      {showCoupon && (
        <div className="coupon-field">
          {appliedCoupon ? (
            <div className="coupon-applied">
              <span>Cupón <strong>{appliedCoupon.codigo}</strong> aplicado</span>
              <button type="button" className="coupon-remove" onClick={removeCoupon}>✕</button>
            </div>
          ) : (
            <form className="coupon-form" onSubmit={handleApply}>
              <input
                value={inputCoupon}
                onChange={e => { setInputCoupon(e.target.value); setError('') }}
                placeholder="Código de cupón"
                disabled={applying}
              />
              <button type="submit" className="button secondary compact" disabled={applying}>
                {applying ? '...' : 'Aplicar'}
              </button>
            </form>
          )}
          {error && <p className="form-error">{error}</p>}
        </div>
      )}

      <dl>
        <div>
          <dt>Subtotal</dt>
          <dd>{formatPrice(subtotal)}</dd>
        </div>
        {discount > 0 && (
          <div>
            <dt>Descuento ({appliedCoupon.codigo})</dt>
            <dd>-{formatPrice(discount)}</dd>
          </div>
        )}
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

      {ctaTo && (
        <Link className="button primary full" to={ctaTo}>
          {ctaLabel}
        </Link>
      )}
    </aside>
  )
}

export default OrderSummary
