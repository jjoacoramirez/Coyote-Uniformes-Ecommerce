import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { api } from '../../services/api.js'

export const fetchDescuentos = createAsyncThunk('descuentos/fetchAll', () => api.get('/descuentos'))
export const fetchDescuentoById = createAsyncThunk('descuentos/fetchById', (id) => api.get(`/descuentos/${id}`))
export const createDescuento = createAsyncThunk('descuentos/create', (body) => api.post('/descuentos', body))
export const updateDescuento = createAsyncThunk('descuentos/update', ({ id, body }) => api.put(`/descuentos/${id}`, body))
export const deleteDescuento = createAsyncThunk('descuentos/delete', async (id) => {
  await api.delete(`/descuentos/${id}`)
  return id
})

const initialState = {
  items: [],
  status: 'idle',
  error: null,
  current: null,
  currentStatus: 'idle',
  currentError: null,
  saveStatus: 'idle',
  saveError: null,
  deleteStatus: 'idle',
  deleteError: null,
}

const descuentosSlice = createSlice({
  name: 'descuentos',
  initialState,
  reducers: {
    resetDescuentoSave(state) {
      state.saveStatus = 'idle'
      state.saveError = null
    },
    clearDescuentoDeleteError(state) {
      state.deleteStatus = 'idle'
      state.deleteError = null
    },
    clearDescuentoActual(state) {
      state.current = null
      state.currentStatus = 'idle'
      state.currentError = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDescuentos.pending, (s) => { s.status = 'loading'; s.error = null })
      .addCase(fetchDescuentos.fulfilled, (s, a) => { s.status = 'succeeded'; s.items = a.payload })
      .addCase(fetchDescuentos.rejected, (s, a) => { s.status = 'failed'; s.error = a.error.message })

      .addCase(fetchDescuentoById.pending, (s) => { s.currentStatus = 'loading'; s.current = null; s.currentError = null })
      .addCase(fetchDescuentoById.fulfilled, (s, a) => { s.currentStatus = 'succeeded'; s.current = a.payload })
      .addCase(fetchDescuentoById.rejected, (s, a) => { s.currentStatus = 'failed'; s.currentError = a.error.message })

      .addCase(createDescuento.pending, (s) => { s.saveStatus = 'loading'; s.saveError = null })
      .addCase(createDescuento.fulfilled, (s) => { s.saveStatus = 'succeeded'; s.status = 'idle' })
      .addCase(createDescuento.rejected, (s, a) => { s.saveStatus = 'failed'; s.saveError = a.error.message })

      .addCase(updateDescuento.pending, (s) => { s.saveStatus = 'loading'; s.saveError = null })
      .addCase(updateDescuento.fulfilled, (s, a) => {
        s.saveStatus = 'succeeded'
        s.items = s.items.map((d) => (d.idDescuento === a.payload.idDescuento ? a.payload : d))
      })
      .addCase(updateDescuento.rejected, (s, a) => { s.saveStatus = 'failed'; s.saveError = a.error.message })

      .addCase(deleteDescuento.pending, (s) => { s.deleteStatus = 'loading'; s.deleteError = null })
      .addCase(deleteDescuento.fulfilled, (s, a) => {
        s.deleteStatus = 'succeeded'
        s.items = s.items.filter((d) => d.idDescuento !== a.payload)
      })
      .addCase(deleteDescuento.rejected, (s, a) => { s.deleteStatus = 'failed'; s.deleteError = a.error.message })
  },
})

export const { resetDescuentoSave, clearDescuentoDeleteError, clearDescuentoActual } = descuentosSlice.actions
export default descuentosSlice.reducer
