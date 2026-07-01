import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { api } from '../../services/api.js'
import { login, logout, register, restoreSession } from './authSlice.js'

export const updatePerfil = createAsyncThunk('usuarios/updatePerfil', (body) => api.put('/usuarios/me', body))
export const updateDireccion = createAsyncThunk('usuarios/updateDireccion', (body) => api.put('/usuarios/me', body))
export const updatePassword = createAsyncThunk('usuarios/updatePassword', (body) => api.put('/usuarios/me/password', body))

const initialState = {
  perfil: null,
  status: 'idle',
  error: null,
  perfilStatus: 'idle',
  perfilError: null,
  direccionStatus: 'idle',
  direccionError: null,
  passwordStatus: 'idle',
  passwordError: null,
}

const usuariosSlice = createSlice({
  name: 'usuarios',
  initialState,
  reducers: {
    resetUsuariosStatus(state) {
      state.perfilStatus = 'idle'
      state.perfilError = null
      state.direccionStatus = 'idle'
      state.direccionError = null
      state.passwordStatus = 'idle'
      state.passwordError = null
    },
  },
  extraReducers: (builder) => {
    builder
      // El mismo GET /usuarios/me que restaura auth hidrata también el perfil.
      .addCase(restoreSession.pending, (s) => { s.status = 'loading'; s.error = null })
      .addCase(restoreSession.fulfilled, (s, a) => {
        s.status = 'succeeded'
        s.perfil = a.payload.profile
        s.error = null
      })
      .addCase(restoreSession.rejected, (s) => { s.status = 'idle'; s.perfil = null; s.error = null })
      .addCase(login.fulfilled, (s, a) => { s.status = 'succeeded'; s.perfil = a.payload.profile; s.error = null })
      .addCase(register.fulfilled, (s, a) => { s.status = 'succeeded'; s.perfil = a.payload.profile; s.error = null })
      .addCase(logout.fulfilled, () => ({ ...initialState }))

      .addCase(updatePerfil.pending, (s) => { s.perfilStatus = 'loading'; s.perfilError = null })
      .addCase(updatePerfil.fulfilled, (s, a) => { s.perfilStatus = 'succeeded'; s.perfil = a.payload })
      .addCase(updatePerfil.rejected, (s, a) => { s.perfilStatus = 'failed'; s.perfilError = a.error.message })

      .addCase(updateDireccion.pending, (s) => { s.direccionStatus = 'loading'; s.direccionError = null })
      .addCase(updateDireccion.fulfilled, (s, a) => { s.direccionStatus = 'succeeded'; s.perfil = a.payload })
      .addCase(updateDireccion.rejected, (s, a) => { s.direccionStatus = 'failed'; s.direccionError = a.error.message })

      .addCase(updatePassword.pending, (s) => { s.passwordStatus = 'loading'; s.passwordError = null })
      .addCase(updatePassword.fulfilled, (s) => { s.passwordStatus = 'succeeded' })
      .addCase(updatePassword.rejected, (s, a) => { s.passwordStatus = 'failed'; s.passwordError = a.error.message })
  },
})

export const { resetUsuariosStatus } = usuariosSlice.actions
export default usuariosSlice.reducer
