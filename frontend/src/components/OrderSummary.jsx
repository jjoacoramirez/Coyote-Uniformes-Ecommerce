import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { formatPrice } from '../utils/format.js'

function calcularDescuento(subtotal, coupon) {
  if (!coupon) return 0
  const valor = Number(coupon.valor)
  if (coupon.tipo === 'PORCENTAJE') return Math.round(subtotal * (valor / 100))
  return Math.min(valor, subtotal)
}

function OrderSummary({ ctaLabel, ctaTo, onCtaClick, paymentMethod, showCoupon = false }) {
  const { cartItems, appliedCoupon, applyCoupon, removeCoupon } = useCart()
  const [inputCoupon, setInputCoupon] = useState('')
  const [error, setError] = useState('')
  const [applying, setApplying] = useState(false)

  if (cartItems.length === 0) return null

  const subtotal = cartItems.reduce((acc, { product, variante, quantity }) => {
    const precio = variante?.precio ?? product.price
    return acc + precio * quantity
  }, 0)
  const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0)
  const discount = calcularDescuento(subtotal, appliedCoupon)
  const total = subtotal - discount

  async function handleApply(e) {
    e.preventDefault()
    if (!inputCoupon.trim()) return
    setApplying(true)
    try {
      await applyCoupon(inputCoupon)
      setError('')
      setInputCoupon('')
    } catch (err) {
      setError(err.message || 'Cupon invalido')
    } finally {
      setApplying(false)
    }
  }

  return (
    <aside className="order-summary">
      <h2>Resumen de compra</h2>
      <div className="summary-products-list">
        {cartItems.map(({ key, product, variante, quantity }) => (
          <div className="summary-product" key={key}>
            <img src={product.image} alt="" />
            <div>
              <strong>{product.name}</strong>
              <span>Talle {variante?.talle ?? '-'} / Cantidad {quantity}</span>
            </div>
          </div>
        ))}
      </div>

      {showCoupon && (
        <div className="coupon-field">
          {appliedCoupon ? (
            <div className="coupon-applied">
              <span>Cupon <strong>{appliedCoupon.codigo}</strong> aplicado</span>
              <button type="button" className="coupon-remove" onClick={removeCoupon}>x</button>
            </div>
          ) : (
            <form className="coupon-form" onSubmit={handleApply}>
              <input
                value={inputCoupon}
                onChange={e => { setInputCoupon(e.target.value); setError('') }}
                placeholder="Codigo de cupon"
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
          <dt>Items</dt>
          <dd>{totalQuantity}</dd>
        </div>
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

      {onCtaClick ? (
        <button className="button primary full" type="button" onClick={onCtaClick}>
          {ctaLabel}
        </button>
      ) : ctaTo && (
        <Link className="button primary full" to={ctaTo}>
          {ctaLabel}
        </Link>
      )}
    </aside>
  )
}

export default OrderSummary
