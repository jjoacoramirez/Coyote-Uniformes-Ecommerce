import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { api } from '../../services/api.js'

function normalizeUser(me) {
  const role = String(me.rol ?? '').toUpperCase().includes('ADMIN') ? 'admin' : 'cliente'
  return { email: me.email, role }
}

async function loadAuthenticatedUser() {
  const me = await api.get('/usuarios/me')
  return normalizeUser(me)
}

export const restoreSession = createAsyncThunk(
  'auth/restoreSession',
  loadAuthenticatedUser,
  { condition: (_, { getState }) => getState().auth.restoreStatus === 'idle' }
)

export const login = createAsyncThunk('auth/login', async ({ email, password }) => {
  await api.post('/auth/login', { email, password })
  return loadAuthenticatedUser()
})

export const register = createAsyncThunk('auth/register', async (formData) => {
  await api.post('/auth/register', {
    nombre: formData.name,
    apellido: formData.lastName,
    email: formData.email,
    contrasena: formData.password,
  })
  return loadAuthenticatedUser()
})

export const logout = createAsyncThunk('auth/logout', () => api.post('/auth/logout'))

const clearSession = (state) => {
  state.user = null
  state.status = 'idle'
  state.error = null
}

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    status: 'idle',
    error: null,
    initialized: false,
    restoreStatus: 'idle',
  },
  reducers: {
    clearAuthError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(restoreSession.pending, (s) => { s.restoreStatus = 'loading' })
      .addCase(restoreSession.fulfilled, (s, a) => {
        s.user = a.payload
        s.initialized = true
        s.restoreStatus = 'succeeded'
      })
      .addCase(restoreSession.rejected, (s) => {
        s.user = null
        s.initialized = true
        s.restoreStatus = 'failed'
      })
      .addCase(login.pending, (s) => { s.status = 'loading'; s.error = null })
      .addCase(login.fulfilled, (s, a) => {
        s.status = 'succeeded'
        s.user = a.payload
        s.initialized = true
      })
      .addCase(login.rejected, (s, a) => {
        s.status = 'failed'
        s.user = null
        s.initialized = true
        s.error = a.error.message
      })
      .addCase(register.pending, (s) => { s.status = 'loading'; s.error = null })
      .addCase(register.fulfilled, (s, a) => {
        s.status = 'succeeded'
        s.user = a.payload
        s.initialized = true
      })
      .addCase(register.rejected, (s, a) => {
        s.status = 'failed'
        s.user = null
        s.initialized = true
        s.error = a.error.message
      })
      .addCase(logout.pending, (s) => { s.status = 'loading'; s.error = null })
      .addCase(logout.fulfilled, (s) => {
        clearSession(s)
        s.initialized = true
        s.restoreStatus = 'idle'
      })
      .addCase(logout.rejected, (s, a) => {
        s.status = 'failed'
        s.error = a.error.message
      })
  },
})

export const { clearAuthError } = authSlice.actions
export default authSlice.reducer
