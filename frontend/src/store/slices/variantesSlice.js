import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { api } from '../../services/api.js'
import { deleteProducto, guardarProducto } from './productosSlice.js'

export const fetchVariantesByProducto = createAsyncThunk(
  'variantes/fetchByProducto',
  async (productoId) => {
    const variantes = await api.get(`/variantes/producto/${productoId}`)
    return { productoId, variantes: variantes ?? [] }
  },
  { condition: (id, { getState }) => getState().variantes.statusByProducto[id] == null }
)

const variantesSlice = createSlice({
  name: 'variantes',
  initialState: { byProducto: {}, statusByProducto: {}, error: null },
  reducers: {
    invalidarVariantes(state, action) {
      delete state.byProducto[action.payload]
      delete state.statusByProducto[action.payload]
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVariantesByProducto.pending, (s, a) => {
        s.statusByProducto[a.meta.arg] = 'loading'
      })
      .addCase(fetchVariantesByProducto.fulfilled, (s, a) => {
        s.statusByProducto[a.payload.productoId] = 'succeeded'
        s.byProducto[a.payload.productoId] = a.payload.variantes
      })
      .addCase(fetchVariantesByProducto.rejected, (s, a) => {
        s.statusByProducto[a.meta.arg] = 'failed'
        s.error = a.error.message
      })
      .addCase(guardarProducto.fulfilled, (s, a) => {
        delete s.byProducto[a.payload]
        delete s.statusByProducto[a.payload]
      })
      .addCase(deleteProducto.fulfilled, (s, a) => {
        delete s.byProducto[a.payload]
        delete s.statusByProducto[a.payload]
      })
  },
})

export const { invalidarVariantes } = variantesSlice.actions
export default variantesSlice.reducer
