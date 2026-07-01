import { configureStore } from '@reduxjs/toolkit'
import authReducer, { TOKEN_KEY } from './slices/authSlice.js'
import usuariosReducer from './slices/usuariosSlice.js'
import productosReducer from './slices/productosSlice.js'
import categoriasReducer from './slices/categoriasSlice.js'
import variantesReducer from './slices/variantesSlice.js'
import descuentosReducer from './slices/descuentosSlice.js'
import pedidosReducer from './slices/pedidosSlice.js'
import carritoReducer from './slices/carritoSlice.js'
import contactoReducer from './slices/contactoSlice.js'

// Redux Toolkit ya incluye el middleware thunk y habilita Redux DevTools.
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

// Respalda el token en sessionStorage cada vez que cambia (sin efectos en los
// reducers). Al cerrar la pestaña se limpia solo; el F5 mantiene la sesion.
let tokenPrevio = store.getState().auth.token
store.subscribe(() => {
  const token = store.getState().auth.token
  if (token === tokenPrevio) return
  tokenPrevio = token
  if (token) sessionStorage.setItem(TOKEN_KEY, token)
  else sessionStorage.removeItem(TOKEN_KEY)
})
