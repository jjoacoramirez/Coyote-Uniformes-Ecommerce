import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { api } from '../../services/api.js'

export const fetchProductos = createAsyncThunk('productos/fetchAll', () => api.get('/productos'))
export const fetchProductosAdmin = createAsyncThunk('productos/fetchAdmin', () => api.get('/productos/admin'))

export const fetchProductoById = createAsyncThunk('productos/fetchById', (id) => api.get(`/productos/${id}`))

export const deleteProducto = createAsyncThunk('productos/delete', async (id) => {
  await api.delete(`/productos/${id}`)
  return id
})

// Orquesta el guardado completo: producto (multipart) + alta/baja/edicion de
// variantes. Sin try/catch: si algo falla, el thunk se rechaza.
export const guardarProducto = createAsyncThunk(
  'productos/guardar',
  async ({ id, productoPayload, imagenFile, variantes, eliminados }) => {
    const fd = new FormData()
    fd.append('producto', new Blob([JSON.stringify(productoPayload)], { type: 'application/json' }))
    if (imagenFile) fd.append('imagen', imagenFile)

    let savedId = id ? Number(id) : null
    if (id) {
      await api.multipart(`/productos/${id}`, fd, 'PUT')
    } else {
      const creado = await api.multipart('/productos', fd)
      savedId = creado.idProducto
    }

    await Promise.all((eliminados ?? []).map((eid) => api.delete(`/variantes/${eid}`)))

    for (const v of variantes ?? []) {
      const body = {
        producto: { idProducto: savedId },
        talle: v.talle?.trim() || null,
        color: v.color?.trim() || null,
        stock: Number(v.stock),
        sku: v.sku || null,
        precio: Number(v.precio) || 0,
        activo: v.activo ?? true,
      }
      if (v.idVariante) {
        await api.put(`/variantes/${v.idVariante}`, body)
      } else {
        await api.post('/variantes', body)
      }
    }

    return savedId
  }
)

const initialState = {
  items: [],
  status: 'idle',
  error: null,
  byId: {},
  byIdStatus: {},
  adminItems: [],
  adminStatus: 'idle',
  adminError: null,
  saveStatus: 'idle',
  saveError: null,
  deleteStatus: 'idle',
  deleteError: null,
}

const productosSlice = createSlice({
  name: 'productos',
  initialState,
  reducers: {
    resetProductoSave(state) {
      state.saveStatus = 'idle'
      state.saveError = null
    },
    clearProductoDeleteError(state) {
      state.deleteStatus = 'idle'
      state.deleteError = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductos.pending, (s) => { s.status = 'loading'; s.error = null })
      .addCase(fetchProductos.fulfilled, (s, a) => { s.status = 'succeeded'; s.items = a.payload })
      .addCase(fetchProductos.rejected, (s, a) => { s.status = 'failed'; s.error = a.error.message })

      .addCase(fetchProductosAdmin.pending, (s) => { s.adminStatus = 'loading'; s.adminError = null })
      .addCase(fetchProductosAdmin.fulfilled, (s, a) => { s.adminStatus = 'succeeded'; s.adminItems = a.payload })
      .addCase(fetchProductosAdmin.rejected, (s, a) => { s.adminStatus = 'failed'; s.adminError = a.error.message })

      .addCase(fetchProductoById.pending, (s, a) => { s.byIdStatus[a.meta.arg] = 'loading' })
      .addCase(fetchProductoById.fulfilled, (s, a) => {
        s.byIdStatus[a.payload.idProducto] = 'succeeded'
        s.byId[a.payload.idProducto] = a.payload
      })
      .addCase(fetchProductoById.rejected, (s, a) => { s.byIdStatus[a.meta.arg] = 'failed' })

      .addCase(guardarProducto.pending, (s) => { s.saveStatus = 'loading'; s.saveError = null })
      .addCase(guardarProducto.fulfilled, (s, a) => {
        s.saveStatus = 'succeeded'
        // Invalida caches para que listado y detalle se refresquen.
        s.adminStatus = 'idle'
        s.status = 'idle'
        delete s.byId[a.payload]
        delete s.byIdStatus[a.payload]
      })
      .addCase(guardarProducto.rejected, (s, a) => { s.saveStatus = 'failed'; s.saveError = a.error.message })

      .addCase(deleteProducto.pending, (s) => { s.deleteStatus = 'loading'; s.deleteError = null })
      .addCase(deleteProducto.fulfilled, (s, a) => {
        s.deleteStatus = 'succeeded'
        s.adminItems = s.adminItems.filter((p) => p.idProducto !== a.payload)
      })
      .addCase(deleteProducto.rejected, (s, a) => { s.deleteStatus = 'failed'; s.deleteError = a.error.message })
  },
})

export const { resetProductoSave, clearProductoDeleteError } = productosSlice.actions
export default productosSlice.reducer
