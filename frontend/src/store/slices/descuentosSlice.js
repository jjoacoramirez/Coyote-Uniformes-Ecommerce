import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { api } from '../../services/api.js'

export const fetchDescuentos = createAsyncThunk(
  'descuentos/fetchAll',
  () => api.get('/descuentos'),
  { condition: (_, { getState }) => getState().descuentos.status === 'idle' }
)
export const fetchDescuentoById = createAsyncThunk(
  'descuentos/fetchById',
  (id) => api.get(`/descuentos/${id}`),
  { condition: (id, { getState }) => getState().descuentos.byIdStatus[id] == null }
)
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
  byId: {},
  byIdStatus: {},
  byIdError: {},
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDescuentos.pending, (s) => { s.status = 'loading'; s.error = null })
      .addCase(fetchDescuentos.fulfilled, (s, a) => { s.status = 'succeeded'; s.items = a.payload })
      .addCase(fetchDescuentos.rejected, (s, a) => { s.status = 'failed'; s.error = a.error.message })

      .addCase(fetchDescuentoById.pending, (s, a) => {
        s.byIdStatus[a.meta.arg] = 'loading'
        delete s.byIdError[a.meta.arg]
      })
      .addCase(fetchDescuentoById.fulfilled, (s, a) => {
        const id = String(a.payload.idDescuento)
        s.byIdStatus[id] = 'succeeded'
        s.byId[id] = a.payload
      })
      .addCase(fetchDescuentoById.rejected, (s, a) => {
        s.byIdStatus[a.meta.arg] = 'failed'
        s.byIdError[a.meta.arg] = a.error.message
      })

      .addCase(createDescuento.pending, (s) => { s.saveStatus = 'loading'; s.saveError = null })
      .addCase(createDescuento.fulfilled, (s) => { s.saveStatus = 'succeeded'; s.status = 'idle' })
      .addCase(createDescuento.rejected, (s, a) => { s.saveStatus = 'failed'; s.saveError = a.error.message })

      .addCase(updateDescuento.pending, (s) => { s.saveStatus = 'loading'; s.saveError = null })
      .addCase(updateDescuento.fulfilled, (s, a) => {
        s.saveStatus = 'succeeded'
        s.items = s.items.map((d) => (d.idDescuento === a.payload.idDescuento ? a.payload : d))
        s.byId[a.payload.idDescuento] = a.payload
        s.byIdStatus[a.payload.idDescuento] = 'succeeded'
      })
      .addCase(updateDescuento.rejected, (s, a) => { s.saveStatus = 'failed'; s.saveError = a.error.message })

      .addCase(deleteDescuento.pending, (s) => { s.deleteStatus = 'loading'; s.deleteError = null })
      .addCase(deleteDescuento.fulfilled, (s, a) => {
        s.deleteStatus = 'succeeded'
        s.items = s.items.filter((d) => d.idDescuento !== a.payload)
        delete s.byId[a.payload]
        delete s.byIdStatus[a.payload]
        delete s.byIdError[a.payload]
      })
      .addCase(deleteDescuento.rejected, (s, a) => { s.deleteStatus = 'failed'; s.deleteError = a.error.message })
  },
})

export const { resetDescuentoSave, clearDescuentoDeleteError } = descuentosSlice.actions
export default descuentosSlice.reducer
