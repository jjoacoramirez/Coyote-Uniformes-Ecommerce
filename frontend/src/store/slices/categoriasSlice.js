import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { api } from '../../services/api.js'

export const fetchCategorias = createAsyncThunk('categorias/fetchAll', () => api.get('/categorias'))
export const fetchCategoriasAdmin = createAsyncThunk('categorias/fetchAdmin', () => api.get('/categorias/admin'))
export const fetchCategoriaById = createAsyncThunk('categorias/fetchById', (id) => api.get(`/categorias/${id}`))
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
  current: null,
  currentStatus: 'idle',
  currentError: null,
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
    clearCategoriaActual(state) {
      state.current = null
      state.currentStatus = 'idle'
      state.currentError = null
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

      .addCase(fetchCategoriaById.pending, (s) => { s.currentStatus = 'loading'; s.current = null; s.currentError = null })
      .addCase(fetchCategoriaById.fulfilled, (s, a) => { s.currentStatus = 'succeeded'; s.current = a.payload })
      .addCase(fetchCategoriaById.rejected, (s, a) => { s.currentStatus = 'failed'; s.currentError = a.error.message })

      .addCase(createCategoria.pending, (s) => { s.saveStatus = 'loading'; s.saveError = null })
      .addCase(createCategoria.fulfilled, (s) => { s.saveStatus = 'succeeded'; s.adminStatus = 'idle'; s.status = 'idle' })
      .addCase(createCategoria.rejected, (s, a) => { s.saveStatus = 'failed'; s.saveError = a.error.message })

      .addCase(updateCategoria.pending, (s) => { s.saveStatus = 'loading'; s.saveError = null })
      .addCase(updateCategoria.fulfilled, (s) => { s.saveStatus = 'succeeded'; s.adminStatus = 'idle'; s.status = 'idle' })
      .addCase(updateCategoria.rejected, (s, a) => { s.saveStatus = 'failed'; s.saveError = a.error.message })

      .addCase(deleteCategoria.pending, (s) => { s.deleteStatus = 'loading'; s.deleteError = null })
      .addCase(deleteCategoria.fulfilled, (s, a) => {
        s.deleteStatus = 'succeeded'
        s.adminItems = s.adminItems.filter((c) => c.idCategoria !== a.payload)
      })
      .addCase(deleteCategoria.rejected, (s, a) => { s.deleteStatus = 'failed'; s.deleteError = a.error.message })
  },
})

export const { resetCategoriaSave, clearCategoriaDeleteError, clearCategoriaActual } = categoriasSlice.actions
export default categoriasSlice.reducer
