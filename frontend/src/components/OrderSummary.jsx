import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { formatPrice } from '../utils/format.js'
import { applyCoupon, removeCoupon, clearCouponError } from '../store/slices/carritoSlice.js'

const IVA_RATE = 0.21

function calcularDescuento(subtotal, coupon) {
  if (!coupon) return 0
  // El descuento solo aplica si se alcanza el monto mínimo de compra.
  const minimo = Number(coupon.montoMinimo) || 0
  if (subtotal < minimo) return 0
  const valor = Number(coupon.valor)
  if (coupon.tipo === 'PORCENTAJE') return Math.round(subtotal * (valor / 100))
  return Math.min(valor, subtotal)
}

function OrderSummary({ ctaLabel, ctaTo, onCtaClick, paymentMethod, showCoupon = false }) {
  const dispatch = useDispatch()
  const { items: cartItems, appliedCoupon, couponStatus, couponError } = useSelector((s) => s.carrito)
  const [inputCoupon, setInputCoupon] = useState('')

  useEffect(() => {
    if (couponStatus === 'succeeded') setInputCoupon('')
  }, [couponStatus])

  if (cartItems.length === 0) return null

  const subtotal = cartItems.reduce((acc, { product, variante, quantity }) => {
    const precio = variante?.precio ?? product.price
    return acc + precio * quantity
  }, 0)
  const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0)
  const discount = calcularDescuento(subtotal, appliedCoupon)
  const baseImponible = subtotal - discount
  const iva = Math.round(baseImponible * IVA_RATE)
  const total = baseImponible + iva
  const applying = couponStatus === 'loading'

  function handleApply(e) {
    e.preventDefault()
    if (!inputCoupon.trim()) return
    dispatch(applyCoupon({ code: inputCoupon, subtotal }))
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
              <button type="button" className="coupon-remove" onClick={() => dispatch(removeCoupon())}>x</button>
            </div>
          ) : (
            <form className="coupon-form" onSubmit={handleApply}>
              <input
                value={inputCoupon}
                onChange={e => { setInputCoupon(e.target.value); if (couponError) dispatch(clearCouponError()) }}
                placeholder="Codigo de cupon"
                disabled={applying}
              />
              <button type="submit" className="button secondary compact" disabled={applying}>
                {applying ? '...' : 'Aplicar'}
              </button>
            </form>
          )}
          {couponError && <p className="form-error">{couponError}</p>}
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
        <div>
          <dt>IVA (21%)</dt>
          <dd>{formatPrice(iva)}</dd>
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
