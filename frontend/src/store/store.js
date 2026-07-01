import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice.js'
import usuariosReducer from './slices/usuariosSlice.js'
import productosReducer from './slices/productosSlice.js'
import categoriasReducer from './slices/categoriasSlice.js'
import variantesReducer from './slices/variantesSlice.js'
import descuentosReducer from './slices/descuentosSlice.js'
import pedidosReducer from './slices/pedidosSlice.js'
import carritoReducer from './slices/carritoSlice.js'
import contactoReducer from './slices/contactoSlice.js'

// Redux Toolkit incluye thunk y habilita Redux DevTools en desarrollo.
export const store = configureStore({
  reducer: {
    auth: authReducer,
    usuarios: usuariosReducer,
    productos: productosReducer,
    categorias: categoriasReducer,
    variantes: variantesReducer,
    descuentos: descuentosReducer,
    pedidos: pedidosReducer,
    carrito: carritoReducer,
    contacto: contactoReducer,
  },
})
