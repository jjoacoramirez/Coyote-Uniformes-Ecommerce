import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { api } from '../../services/api.js'

export const fetchPedidos = createAsyncThunk('pedidos/fetchAll', () => api.get('/pedidos'))

const pedidosSlice = createSlice({
  name: 'pedidos',
  initialState: { items: [], status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPedidos.pending, (s) => { s.status = 'loading'; s.error = null })
      .addCase(fetchPedidos.fulfilled, (s, a) => { s.status = 'succeeded'; s.items = a.payload })
      .addCase(fetchPedidos.rejected, (s, a) => { s.status = 'failed'; s.error = a.error.message })
  },
})

export default pedidosSlice.reducer
