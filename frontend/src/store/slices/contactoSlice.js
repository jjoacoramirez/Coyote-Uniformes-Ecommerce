import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { api } from '../../services/api.js'

export const enviarContacto = createAsyncThunk('contacto/enviar', (campos) => api.post('/contactos', campos))

const contactoSlice = createSlice({
  name: 'contacto',
  initialState: { status: 'idle', error: null },
  reducers: {
    resetContacto(state) {
      state.status = 'idle'
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(enviarContacto.pending, (s) => { s.status = 'loading'; s.error = null })
      .addCase(enviarContacto.fulfilled, (s) => { s.status = 'succeeded' })
      .addCase(enviarContacto.rejected, (s, a) => { s.status = 'failed'; s.error = a.error.message })
  },
})

export const { resetContacto } = contactoSlice.actions
export default contactoSlice.reducer
