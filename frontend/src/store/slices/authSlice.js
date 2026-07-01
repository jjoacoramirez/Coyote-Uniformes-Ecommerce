import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { api } from '../../services/api.js'

// Clave donde se respalda el token en sessionStorage (sobrevive al F5,
// se borra al cerrar la pestaña). El token siempre vive en el store; esto
// es solo respaldo para rehidratar la sesion.
export const TOKEN_KEY = 'coyote_token'

function normalizeRole(rol) {
  return String(rol ?? '').toUpperCase().includes('ADMIN') ? 'admin' : 'cliente'
}

// Asincrono (fuera del slice). Sin try/catch: si algo falla, el thunk se
// rechaza y RTK guarda el mensaje en action.error.message.
export const login = createAsyncThunk('auth/login', async ({ email, password }, { dispatch }) => {
  const { token } = await api.post('/auth/login', { email, password })
  dispatch(setToken(token)) // habilita el token para el siguiente request
  const me = await api.get('/usuarios/me')
  return { token, user: { email: me.email, role: normalizeRole(me.rol) } }
})

export const register = createAsyncThunk('auth/register', async (formData, { dispatch }) => {
  const { token } = await api.post('/auth/register', {
    nombre: formData.name,
    apellido: formData.lastName,
    email: formData.email,
    contrasena: formData.password,
  })
  dispatch(setToken(token))
  const me = await api.get('/usuarios/me')
  return { token, user: { email: me.email, role: normalizeRole(me.rol) } }
})

// Restaura la sesion al iniciar la app si hay un token respaldado.
export const restoreSession = createAsyncThunk('auth/restore', async (_, { getState }) => {
  if (!getState().auth.token) return null
  const me = await api.get('/usuarios/me')
  return { user: { email: me.email, role: normalizeRole(me.rol) } }
})

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: sessionStorage.getItem(TOKEN_KEY),
    user: null,
    status: 'idle',
    error: null,
  },
  // Sincrono (dentro del slice).
  reducers: {
    setToken(state, action) {
      state.token = action.payload
    },
    logout(state) {
      state.token = null
      state.user = null
      state.status = 'idle'
      state.error = null
    },
    clearAuthError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (s) => { s.status = 'loading'; s.error = null })
      .addCase(login.fulfilled, (s, a) => { s.status = 'succeeded'; s.token = a.payload.token; s.user = a.payload.user })
      .addCase(login.rejected, (s, a) => { s.status = 'failed'; s.error = a.error.message })
      .addCase(register.pending, (s) => { s.status = 'loading'; s.error = null })
      .addCase(register.fulfilled, (s, a) => { s.status = 'succeeded'; s.token = a.payload.token; s.user = a.payload.user })
      .addCase(register.rejected, (s, a) => { s.status = 'failed'; s.error = a.error.message })

      // Restaurar sesion: si el token guardado ya no sirve, se limpia.
      .addCase(restoreSession.fulfilled, (s, a) => { if (a.payload) s.user = a.payload.user })
      .addCase(restoreSession.rejected, (s) => { s.token = null; s.user = null })
  },
})

export const { setToken, logout, clearAuthError } = authSlice.actions
export default authSlice.reducer
