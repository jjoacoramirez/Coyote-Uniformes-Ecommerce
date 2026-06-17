import { createContext, useContext, useState } from 'react'
import { api } from '../services/api.js'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([])
  const [appliedCoupon, setAppliedCoupon] = useState(null)

  function getItemKey(product, variante) {
    return `${product.id}-${variante?.idVariante ?? 'sin-variante'}`
  }

  function addToCart(product, variante) {
    const key = getItemKey(product, variante)
    setCartItems(prev => {
      const existingItem = prev.find(item => item.key === key)
      if (existingItem) {
        return prev.map(item =>
          item.key === key ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...prev, { key, product, variante, quantity: 1 }]
    })
  }

  function updateQuantity(key, quantity) {
    setCartItems(prev =>
      prev.map(item =>
        item.key === key ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    )
  }

  function removeFromCart(key) {
    setCartItems(prev => prev.filter(item => item.key !== key))
  }

  async function applyCoupon(code) {
    const descuento = await api.get(`/descuentos/validar/${encodeURIComponent(code.trim().toUpperCase())}`)
    setAppliedCoupon(descuento)
  }

  function removeCoupon() {
    setAppliedCoupon(null)
  }

  const cartItem = cartItems[0] ?? null

  return (
    <CartContext.Provider value={{ cartItem, cartItems, addToCart, updateQuantity, removeFromCart, appliedCoupon, applyCoupon, removeCoupon }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
