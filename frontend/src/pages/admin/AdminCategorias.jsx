import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import ConfirmDialog from '../../components/ConfirmDialog'
import {
  fetchCategoriasAdmin,
  deleteCategoria,
  clearCategoriaDeleteError,
} from '../../store/slices/categoriasSlice.js'

const IconoEditar = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" width="15" height="15">
    <path d="M5.433 13.917l1.262-3.155A4 4 0 0 1 7.58 9.42l6.92-6.918a2.121 2.121 0 0 1 3 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 0 1-.65-.65z" />
    <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0 0 10 3H4.75A2.75 2.75 0 0 0 2 5.75v9.5A2.75 2.75 0 0 0 4.75 18h9.5A2.75 2.75 0 0 0 17 15.25V10a.75.75 0 0 0-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
  </svg>
)

const IconoEliminar = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" width="15" height="15">
    <path
      fillRule="evenodd"
      d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5z"
      clipRule="evenodd"
    />
  </svg>
)

export default function AdminCategorias() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const {
    adminItems: categorias,
    adminStatus,
    adminError,
    deleteStatus,
    deleteError,
  } = useSelector((s) => s.categorias)

  const [busqueda, setBusqueda] = useState('')
  const [ordenFiltro, setOrdenFiltro] = useState('nuevo')
  const [confirm, setConfirm] = useState(null)

  useEffect(() => {
    if (adminStatus === 'idle') dispatch(fetchCategoriasAdmin())
  }, [adminStatus, dispatch])

  useEffect(() => {
    if (deleteStatus === 'succeeded' || deleteStatus === 'failed') setConfirm(null)
  }, [deleteStatus])

  const cargando = adminStatus === 'idle' || adminStatus === 'loading'
  const eliminando = deleteStatus === 'loading'

  const categoriasFiltradas = useMemo(() => {
    let lista = categorias.filter((c) => {
      if (!busqueda) return true
      const q = busqueda.toLowerCase()
      return (
        c.nombre?.toLowerCase().includes(q) ||
        c.descripcion?.toLowerCase().includes(q)
      )
    })

    switch (ordenFiltro) {
      case 'nuevo':
        lista = [...lista].sort((a, b) => b.idCategoria - a.idCategoria)
        break
      case 'nombre':
        lista = [...lista].sort((a, b) => (a.nombre ?? '').localeCompare(b.nombre ?? ''))
        break
      case 'productos-desc':
        lista = [...lista].sort((a, b) => Number(b.cantidadProductos) - Number(a.cantidadProductos))
        break
      case 'productos-asc':
        lista = [...lista].sort((a, b) => Number(a.cantidadProductos) - Number(b.cantidadProductos))
        break
    }

    return lista
  }, [categorias, busqueda, ordenFiltro])

  function handleEliminar(id, nombre) {
    dispatch(clearCategoriaDeleteError())
    setConfirm({ id, nombre })
  }

  function confirmarEliminar() {
    dispatch(deleteCategoria(confirm.id))
  }

  if (cargando) return <div className="inv-empty">Cargando categorías...</div>

  if (adminError)
    return (
      <div className="inv-empty" style={{ color: 'var(--color-primary)' }}>
        Error al cargar categorías: {adminError}
      </div>
    )

  return (
    <>
      <ConfirmDialog
        isOpen={confirm !== null}
        title="Eliminar categoría"
        message={`¿Estás seguro de que querés eliminar "${confirm?.nombre}"? Los productos asociados quedarán sin categoría.`}
        onConfirm={confirmarEliminar}
        onCancel={() => setConfirm(null)}
        loading={eliminando}
      />

      {deleteError && (
        <div className="inv-delete-error">
          <span>Error al eliminar: {deleteError}</span>
          <button onClick={() => dispatch(clearCategoriaDeleteError())}>×</button>
        </div>
      )}

      <div className="inv-header">
        <div>
          <h1 className="inv-title">Categorías</h1>
          <p className="inv-subtitle">
            Organizá tu catálogo de productos por categorías
          </p>
        </div>
        <button
          className="button primary"
          type="button"
          onClick={() => navigate('/admin/categorias/nuevo')}
        >
          + Nueva Categoría
        </button>
      </div>

      <div className="inv-search">
        <svg
          className="inv-search-icon"
          viewBox="0 0 20 20"
          fill="currentColor"
          width="16"
          height="16"
        >
          <path
            fillRule="evenodd"
            d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11zM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9z"
            clipRule="evenodd"
          />
        </svg>
        <input
          type="search"
          placeholder="Buscar por nombre o descripción..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      <div className="inv-filters">
        <label className="inv-filter-select">
          <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
            <path d="M2 4.75A.75.75 0 0 1 2.75 4h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 4.75zM2 10a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 2 10zm0 5.25a.75.75 0 0 1 .75-.75h3.5a.75.75 0 0 1 0 1.5h-3.5a.75.75 0 0 1-.75-.75z" />
          </svg>
          <select value={ordenFiltro} onChange={(e) => setOrdenFiltro(e.target.value)}>
            <option value="nuevo">Ordenar: Más reciente</option>
            <option value="nombre">Ordenar: Nombre A-Z</option>
            <option value="productos-desc">Productos: mayor a menor</option>
            <option value="productos-asc">Productos: menor a mayor</option>
          </select>
          <svg viewBox="0 0 16 16" fill="currentColor" width="11" height="11">
            <path d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06z" />
          </svg>
        </label>

        <span className="inv-count">
          {categoriasFiltradas.length}{' '}
          {categoriasFiltradas.length === 1 ? 'categoría' : 'categorías'}
        </span>
      </div>

      <div className="inv-table-card">
        <table className="inv-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Productos</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categoriasFiltradas.length === 0 ? (
              <tr>
                <td colSpan={4}>
                  <div className="inv-empty">No se encontraron categorías</div>
                </td>
              </tr>
            ) : (
              categoriasFiltradas.map((cat) => (
                <tr key={cat.idCategoria}>
                  <td>
                    <span className="cat-nombre">{cat.nombre}</span>
                  </td>
                  <td>
                    <span className="cat-descripcion">
                      {cat.descripcion || (
                        <em style={{ color: 'var(--color-text-muted, #9ca3af)' }}>
                          Sin descripción
                        </em>
                      )}
                    </span>
                  </td>
                  <td>
                    <span className="cat-badge">
                      {Number(cat.cantidadProductos)}{' '}
                      {Number(cat.cantidadProductos) === 1 ? 'producto' : 'productos'}
                    </span>
                  </td>
                  <td>
                    <div className="inv-actions">
                      <button
                        className="inv-action-btn"
                        title="Editar"
                        onClick={() => navigate(`/admin/categorias/${cat.idCategoria}/editar`)}
                      >
                        <IconoEditar />
                      </button>
                      <button
                        className="inv-action-btn delete"
                        title="Eliminar"
                        onClick={() => handleEliminar(cat.idCategoria, cat.nombre)}
                      >
                        <IconoEliminar />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}
