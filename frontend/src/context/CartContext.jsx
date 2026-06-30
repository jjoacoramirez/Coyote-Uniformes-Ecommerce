/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContext.jsx'
import { api } from '../services/api.js'
import { toCartProductShape } from '../utils/catalog.js'
import { formatPrice } from '../utils/format.js'

const CartContext = createContext(null)

function toCartItems(cart) {
  return (cart?.items ?? []).map((item) => ({
    key: String(item.idItemCarrito),
    idItemCarrito: item.idItemCarrito,
    product: toCartProductShape(item),
    variante: {
      idVariante: item.idVariante,
      talle: item.talle,
      color: item.color,
      precio: Number(item.precioUnitario ?? 0),
    },
    quantity: item.cantidad ?? 1,
  }))
}

export function CartProvider({ children }) {
  const { user } = useAuth()
  const [cartItems, setCartItems] = useState([])
  const [appliedCoupon, setAppliedCoupon] = useState(null)
  const [loadingCart, setLoadingCart] = useState(false)

  function syncCart(cart) {
    setCartItems(toCartItems(cart))
  }

  useEffect(() => {
    if (!user) {
      Promise.resolve().then(() => {
        setCartItems([])
        setAppliedCoupon(null)
      })
      return
    }

    Promise.resolve().then(() => setLoadingCart(true))
    api.get('/carritos/me')
      .then(syncCart)
      .catch(() => setCartItems([]))
      .finally(() => setLoadingCart(false))
  }, [user])

  async function addToCart(product, variante) {
    if (!variante?.idVariante) {
      throw new Error('Selecciona una variante disponible.')
    }
    const cart = await api.post('/carritos/me/items', {
      idVariante: variante.idVariante,
      cantidad: 1,
    })
    syncCart(cart)
  }

  async function updateQuantity(key, quantity) {
    const item = cartItems.find(currentItem => currentItem.key === key)
    if (!item) return
    const cart = await api.put(`/carritos/me/items/${item.idItemCarrito}`, {
      cantidad: Math.max(1, quantity),
    })
    syncCart(cart)
  }

  async function removeFromCart(key) {
    const item = cartItems.find(currentItem => currentItem.key === key)
    if (!item) return
    const cart = await api.delete(`/carritos/me/items/${item.idItemCarrito}`)
    syncCart(cart)
  }

  async function applyCoupon(code, subtotal = 0) {
    const descuento = await api.get(`/descuentos/validar/${encodeURIComponent(code.trim().toUpperCase())}`)
    const minimo = Number(descuento.montoMinimo) || 0
    if (minimo > 0 && subtotal < minimo) {
      throw new Error(`Este cupón requiere una compra mínima de ${formatPrice(minimo)}.`)
    }
    setAppliedCoupon(descuento)
  }

  function removeCoupon() {
    setAppliedCoupon(null)
  }

  const cartItem = cartItems[0] ?? null

  return (
    <CartContext.Provider value={{
      cartItem,
      cartItems,
      loadingCart,
      addToCart,
      updateQuantity,
      removeFromCart,
      appliedCoupon,
      applyCoupon,
      removeCoupon,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
