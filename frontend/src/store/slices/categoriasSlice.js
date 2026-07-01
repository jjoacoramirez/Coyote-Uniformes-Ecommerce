import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { api } from '../../services/api.js'

export const fetchCategorias = createAsyncThunk(
  'categorias/fetchAll',
  () => api.get('/categorias'),
  { condition: (_, { getState }) => getState().categorias.status === 'idle' }
)
export const fetchCategoriasAdmin = createAsyncThunk(
  'categorias/fetchAdmin',
  () => api.get('/categorias/admin'),
  { condition: (_, { getState }) => getState().categorias.adminStatus === 'idle' }
)
export const fetchCategoriaById = createAsyncThunk(
  'categorias/fetchById',
  (id) => api.get(`/categorias/${id}`),
  { condition: (id, { getState }) => getState().categorias.byIdStatus[id] == null }
)
export const createCategoria = createAsyncThunk('categorias/create', (body) => api.post('/categorias', body))
export const updateCategoria = createAsyncThunk('categorias/update', ({ id, body }) => api.put(`/categorias/${id}`, body))
export const deleteCategoria = createAsyncThunk('categorias/delete', async (id) => {
  await api.delete(`/categorias/${id}`)
  return id
})

const initialState = {
  items: [],
  status: 'idle',
  error: null,
  adminItems: [],
  adminStatus: 'idle',
  adminError: null,
  byId: {},
  byIdStatus: {},
  byIdError: {},
  saveStatus: 'idle',
  saveError: null,
  deleteStatus: 'idle',
  deleteError: null,
}

const categoriasSlice = createSlice({
  name: 'categorias',
  initialState,
  reducers: {
    resetCategoriaSave(state) {
      state.saveStatus = 'idle'
      state.saveError = null
    },
    clearCategoriaDeleteError(state) {
      state.deleteStatus = 'idle'
      state.deleteError = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategorias.pending, (s) => { s.status = 'loading'; s.error = null })
      .addCase(fetchCategorias.fulfilled, (s, a) => { s.status = 'succeeded'; s.items = a.payload })
      .addCase(fetchCategorias.rejected, (s, a) => { s.status = 'failed'; s.error = a.error.message })

      .addCase(fetchCategoriasAdmin.pending, (s) => { s.adminStatus = 'loading'; s.adminError = null })
      .addCase(fetchCategoriasAdmin.fulfilled, (s, a) => { s.adminStatus = 'succeeded'; s.adminItems = a.payload })
      .addCase(fetchCategoriasAdmin.rejected, (s, a) => { s.adminStatus = 'failed'; s.adminError = a.error.message })

      .addCase(fetchCategoriaById.pending, (s, a) => {
        s.byIdStatus[a.meta.arg] = 'loading'
        delete s.byIdError[a.meta.arg]
      })
      .addCase(fetchCategoriaById.fulfilled, (s, a) => {
        const id = String(a.payload.idCategoria)
        s.byIdStatus[id] = 'succeeded'
        s.byId[id] = a.payload
      })
      .addCase(fetchCategoriaById.rejected, (s, a) => {
        s.byIdStatus[a.meta.arg] = 'failed'
        s.byIdError[a.meta.arg] = a.error.message
      })

      .addCase(createCategoria.pending, (s) => { s.saveStatus = 'loading'; s.saveError = null })
      .addCase(createCategoria.fulfilled, (s) => { s.saveStatus = 'succeeded'; s.adminStatus = 'idle'; s.status = 'idle' })
      .addCase(createCategoria.rejected, (s, a) => { s.saveStatus = 'failed'; s.saveError = a.error.message })

      .addCase(updateCategoria.pending, (s) => { s.saveStatus = 'loading'; s.saveError = null })
      .addCase(updateCategoria.fulfilled, (s, a) => {
        s.saveStatus = 'succeeded'
        s.adminStatus = 'idle'
        s.status = 'idle'
        s.byId[a.payload.idCategoria] = a.payload
        s.byIdStatus[a.payload.idCategoria] = 'succeeded'
      })
      .addCase(updateCategoria.rejected, (s, a) => { s.saveStatus = 'failed'; s.saveError = a.error.message })

      .addCase(deleteCategoria.pending, (s) => { s.deleteStatus = 'loading'; s.deleteError = null })
      .addCase(deleteCategoria.fulfilled, (s, a) => {
        s.deleteStatus = 'succeeded'
        s.adminItems = s.adminItems.filter((c) => c.idCategoria !== a.payload)
        s.items = s.items.filter((c) => c.idCategoria !== a.payload)
        delete s.byId[a.payload]
        delete s.byIdStatus[a.payload]
        delete s.byIdError[a.payload]
      })
      .addCase(deleteCategoria.rejected, (s, a) => { s.deleteStatus = 'failed'; s.deleteError = a.error.message })
  },
})

export const { resetCategoriaSave, clearCategoriaDeleteError } = categoriasSlice.actions
export default categoriasSlice.reducer
