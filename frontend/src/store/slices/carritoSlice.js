import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { api } from '../../services/api.js'
import { toCartProductShape } from '../../utils/catalog.js'
import { formatPrice } from '../../utils/format.js'

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

export const fetchCarrito = createAsyncThunk('carrito/fetch', () => api.get('/carritos/me'))

export const addItem = createAsyncThunk('carrito/addItem', (variante) => {
  if (!variante?.idVariante) {
    throw new Error('Selecciona una variante disponible.')
  }
  return api.post('/carritos/me/items', { idVariante: variante.idVariante, cantidad: 1 })
})

export const updateItem = createAsyncThunk('carrito/updateItem', ({ idItemCarrito, cantidad }) =>
  api.put(`/carritos/me/items/${idItemCarrito}`, { cantidad: Math.max(1, cantidad) })
)

export const removeItem = createAsyncThunk('carrito/removeItem', (idItemCarrito) =>
  api.delete(`/carritos/me/items/${idItemCarrito}`)
)

export const applyCoupon = createAsyncThunk('carrito/applyCoupon', async ({ code, subtotal }) => {
  const descuento = await api.get(`/descuentos/validar/${encodeURIComponent(code.trim().toUpperCase())}`)
  const minimo = Number(descuento.montoMinimo) || 0
  if (minimo > 0 && subtotal < minimo) {
    throw new Error(`Este cupon requiere una compra minima de ${formatPrice(minimo)}.`)
  }
  return descuento
})

export const checkout = createAsyncThunk('carrito/checkout', ({ metodoPago, codigoDescuento }) =>
  api.post('/carritos/me/checkout', { metodoPago, codigoDescuento: codigoDescuento ?? null })
)

const initialState = {
  items: [],
  appliedCoupon: null,
  status: 'idle',
  error: null,
  addStatus: 'idle',
  addError: null,
  couponStatus: 'idle',
  couponError: null,
  checkout: null,
  checkoutStatus: 'idle',
  checkoutError: null,
}

const carritoSlice = createSlice({
  name: 'carrito',
  initialState,
  reducers: {
    removeCoupon(state) {
      state.appliedCoupon = null
      state.couponStatus = 'idle'
      state.couponError = null
    },
    clearCarrito(state) {
      state.items = []
      state.appliedCoupon = null
      state.status = 'idle'
    },
    clearCheckout(state) {
      state.checkout = null
      state.checkoutStatus = 'idle'
      state.checkoutError = null
    },
    resetAddStatus(state) {
      state.addStatus = 'idle'
      state.addError = null
    },
    clearCouponError(state) {
      state.couponStatus = 'idle'
      state.couponError = null
    },
  },
  extraReducers: (builder) => {
    const syncCart = (s, a) => { s.items = toCartItems(a.payload) }
    builder
      .addCase(fetchCarrito.pending, (s) => { s.status = 'loading'; s.error = null })
      .addCase(fetchCarrito.fulfilled, (s, a) => { s.status = 'succeeded'; syncCart(s, a) })
      .addCase(fetchCarrito.rejected, (s, a) => { s.status = 'failed'; s.error = a.error.message; s.items = [] })

      .addCase(addItem.pending, (s) => { s.addStatus = 'loading'; s.addError = null })
      .addCase(addItem.fulfilled, (s, a) => { s.addStatus = 'succeeded'; syncCart(s, a) })
      .addCase(addItem.rejected, (s, a) => { s.addStatus = 'failed'; s.addError = a.error.message })
      .addCase(updateItem.fulfilled, syncCart)
      .addCase(removeItem.fulfilled, syncCart)

      .addCase(applyCoupon.pending, (s) => { s.couponStatus = 'loading'; s.couponError = null })
      .addCase(applyCoupon.fulfilled, (s, a) => { s.couponStatus = 'succeeded'; s.appliedCoupon = a.payload })
      .addCase(applyCoupon.rejected, (s, a) => { s.couponStatus = 'failed'; s.couponError = a.error.message })

      .addCase(checkout.pending, (s) => { s.checkoutStatus = 'loading'; s.checkoutError = null })
      .addCase(checkout.fulfilled, (s, a) => {
        s.checkoutStatus = 'succeeded'
        s.checkout = a.payload
        s.items = []
        s.appliedCoupon = null
      })
      .addCase(checkout.rejected, (s, a) => { s.checkoutStatus = 'failed'; s.checkoutError = a.error.message })
  },
})

export const { removeCoupon, clearCarrito, clearCheckout, resetAddStatus, clearCouponError } = carritoSlice.actions
export default carritoSlice.reducer
