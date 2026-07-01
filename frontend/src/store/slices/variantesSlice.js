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
  initialState: { byProducto: {}, statusByProducto: {}, errorByProducto: {} },
  reducers: {
    invalidarVariantes(state, action) {
      delete state.byProducto[action.payload]
      delete state.statusByProducto[action.payload]
      delete state.errorByProducto[action.payload]
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVariantesByProducto.pending, (s, a) => {
        s.statusByProducto[a.meta.arg] = 'loading'
        delete s.errorByProducto[a.meta.arg]
      })
      .addCase(fetchVariantesByProducto.fulfilled, (s, a) => {
        s.statusByProducto[a.payload.productoId] = 'succeeded'
        s.byProducto[a.payload.productoId] = a.payload.variantes
        delete s.errorByProducto[a.payload.productoId]
      })
      .addCase(fetchVariantesByProducto.rejected, (s, a) => {
        s.statusByProducto[a.meta.arg] = 'failed'
        s.errorByProducto[a.meta.arg] = a.error.message
      })
      .addCase(guardarProducto.fulfilled, (s, a) => {
        delete s.byProducto[a.payload]
        delete s.statusByProducto[a.payload]
        delete s.errorByProducto[a.payload]
      })
      .addCase(deleteProducto.fulfilled, (s, a) => {
        delete s.byProducto[a.payload]
        delete s.statusByProducto[a.payload]
        delete s.errorByProducto[a.payload]
      })
  },
})

export const { invalidarVariantes } = variantesSlice.actions
export default variantesSlice.reducer
