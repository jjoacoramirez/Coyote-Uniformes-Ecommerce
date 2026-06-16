import { createContext, useContext, useState } from 'react'
import { api } from '../services/api.js'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [cartItem, setCartItem] = useState(null)
  const [appliedCoupon, setAppliedCoupon] = useState(null)

  function addToCart(product, variante) {
    setCartItem({ product, variante, quantity: 1 })
  }

  function updateQuantity(quantity) {
    setCartItem(prev => prev ? { ...prev, quantity: Math.max(1, quantity) } : null)
  }

  async function applyCoupon(code) {
    const descuento = await api.get(`/descuentos/validar/${encodeURIComponent(code.trim().toUpperCase())}`)
    setAppliedCoupon(descuento)
  }

  function removeCoupon() {
    setAppliedCoupon(null)
  }

  return (
    <CartContext.Provider value={{ cartItem, addToCart, updateQuantity, appliedCoupon, applyCoupon, removeCoupon }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
