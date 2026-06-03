import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../services/api'

const PAGE_SIZE = 12

function formatPrecio(precio) {
  return `AR$ ${Number(precio).toLocaleString('es-AR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

function estadoDeStock(stock) {
  const n = Number(stock) || 0
  if (n === 0) return 'sin-stock'
  if (n <= 10) return 'poco-stock'
  return 'en-stock'
}

const ESTADO_LABEL = {
  'en-stock': 'En Stock',
  'poco-stock': 'Poco Stock',
  'sin-stock': 'Sin Stock',
}

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

const IconoImagen = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
    <path
      fillRule="evenodd"
      d="M1 5.25A2.25 2.25 0 0 1 3.25 3h13.5A2.25 2.25 0 0 1 19 5.25v9.5A2.25 2.25 0 0 1 16.75 17H3.25A2.25 2.25 0 0 1 1 14.75v-9.5zm1.5 5.81v3.69c0 .414.336.75.75.75h13.5a.75.75 0 0 0 .75-.75v-2.69l-2.22-2.219a.75.75 0 0 0-1.06 0l-1.91 1.909.47.47a.75.75 0 1 1-1.06 1.06L6.53 8.091a.75.75 0 0 0-1.06 0l-2.97 2.97zM12 7a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"
      clipRule="evenodd"
    />
  </svg>
)

export default function AdminProductos() {
  const navigate = useNavigate()
  const [productos, setProductos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  const [busqueda, setBusqueda] = useState('')
  const [categoriaFiltro, setCategoriaFiltro] = useState('')
  const [ordenFiltro, setOrdenFiltro] = useState('nuevo')
  const [estadoFiltro, setEstadoFiltro] = useState('')
  const [pagina, setPagina] = useState(1)

  useEffect(() => {
    async function cargar() {
      try {
        const [prods, cats] = await Promise.all([
          api.get('/productos/admin'),
          api.get('/categorias'),
        ])
        setProductos(prods)
        setCategorias(cats)
      } catch (e) {
        setError(e.message)
      } finally {
        setCargando(false)
      }
    }
    cargar()
  }, [])

  useEffect(() => {
    setPagina(1)
  }, [busqueda, categoriaFiltro, estadoFiltro, ordenFiltro])

  const productosFiltrados = useMemo(() => {
    let lista = productos.filter((p) => {
      if (categoriaFiltro && String(p.idCategoria) !== categoriaFiltro) return false
      if (estadoFiltro && estadoDeStock(p.stockTotal) !== estadoFiltro) return false
      if (busqueda) {
        const q = busqueda.toLowerCase()
        const coincide =
          p.nombre?.toLowerCase().includes(q) ||
          p.skuPrincipal?.toLowerCase().includes(q) ||
          p.categoriaNombre?.toLowerCase().includes(q)
        if (!coincide) return false
      }
      return true
    })

    switch (ordenFiltro) {
      case 'nuevo':
        lista = [...lista].sort((a, b) => b.idProducto - a.idProducto)
        break
      case 'precio-asc':
        lista = [...lista].sort((a, b) => Number(a.precioBase) - Number(b.precioBase))
        break
      case 'precio-desc':
        lista = [...lista].sort((a, b) => Number(b.precioBase) - Number(a.precioBase))
        break
      case 'nombre':
        lista = [...lista].sort((a, b) => (a.nombre ?? '').localeCompare(b.nombre ?? ''))
        break
    }

    return lista
  }, [productos, busqueda, categoriaFiltro, estadoFiltro, ordenFiltro])

  const totalPaginas = Math.ceil(productosFiltrados.length / PAGE_SIZE)
  const pagActual = Math.min(pagina, totalPaginas || 1)
  const inicio = (pagActual - 1) * PAGE_SIZE
  const productosPage = productosFiltrados.slice(inicio, inicio + PAGE_SIZE)

  async function handleEliminar(id, nombre) {
    if (!window.confirm(`¿Eliminar "${nombre}"? Esta acción no se puede deshacer.`)) return
    try {
      await api.delete(`/productos/${id}`)
      setProductos((prev) => prev.filter((p) => p.idProducto !== id))
    } catch (e) {
      alert(`Error al eliminar: ${e.message}`)
    }
  }

  function paginasBotones() {
    if (totalPaginas <= 7) return Array.from({ length: totalPaginas }, (_, i) => i + 1)
    const pages = new Set([1, totalPaginas, pagActual])
    if (pagActual > 1) pages.add(pagActual - 1)
    if (pagActual < totalPaginas) pages.add(pagActual + 1)
    return Array.from(pages).sort((a, b) => a - b)
  }

  if (cargando) {
    return <div className="inv-empty">Cargando inventario...</div>
  }

  if (error) {
    return (
      <div className="inv-empty" style={{ color: 'var(--color-primary)' }}>
        Error al cargar productos: {error}
      </div>
    )
  }

  const btnPages = paginasBotones()

  return (
    <>
      {/* Encabezado */}
      <div className="inv-header">
        <div>
          <h1 className="inv-title">Inventario de Productos</h1>
          <p className="inv-subtitle">
            Gestioná tu colección de uniformes profesionales y niveles de stock
          </p>
        </div>
        <button
          className="button primary"
          type="button"
          onClick={() => navigate('/admin/productos/nuevo')}
        >
          + Nuevo Producto
        </button>
      </div>

      {/* Buscador */}
      <div className="inv-search">
        <svg className="inv-search-icon" viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
          <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11zM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9z" clipRule="evenodd" />
        </svg>
        <input
          type="search"
          placeholder="Buscar por nombre, SKU o categoría..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      {/* Filtros */}
      <div className="inv-filters">
        <label className="inv-filter-select">
          <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
            <path d="M2 4.75A.75.75 0 0 1 2.75 4h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 4.75zM4 10a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 0 1.5H4.75A.75.75 0 0 1 4 10zm2.75 4.5a.75.75 0 0 0 0 1.5h6.5a.75.75 0 0 0 0-1.5h-6.5z" />
          </svg>
          <select value={categoriaFiltro} onChange={(e) => setCategoriaFiltro(e.target.value)}>
            <option value="">Todas las Categorías</option>
            {categorias.map((c) => (
              <option key={c.idCategoria} value={String(c.idCategoria)}>
                {c.nombre}
              </option>
            ))}
          </select>
          <svg viewBox="0 0 16 16" fill="currentColor" width="11" height="11">
            <path d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06z" />
          </svg>
        </label>

        <label className="inv-filter-select">
          <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
            <path d="M2 4.75A.75.75 0 0 1 2.75 4h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 4.75zM2 10a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 2 10zm0 5.25a.75.75 0 0 1 .75-.75h3.5a.75.75 0 0 1 0 1.5h-3.5a.75.75 0 0 1-.75-.75z" />
          </svg>
          <select value={ordenFiltro} onChange={(e) => setOrdenFiltro(e.target.value)}>
            <option value="nuevo">Ordenar: Más reciente</option>
            <option value="nombre">Ordenar: Nombre A-Z</option>
            <option value="precio-asc">Precio: menor a mayor</option>
            <option value="precio-desc">Precio: mayor a menor</option>
          </select>
          <svg viewBox="0 0 16 16" fill="currentColor" width="11" height="11">
            <path d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06z" />
          </svg>
        </label>

        <label className="inv-filter-select">
          <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
            <path
              fillRule="evenodd"
              d="M5.5 3A2.5 2.5 0 0 0 3 5.5v2.879a2.5 2.5 0 0 0 .732 1.767l6.5 6.5a2.5 2.5 0 0 0 3.536 0l2.878-2.878a2.5 2.5 0 0 0 0-3.536l-6.5-6.5A2.5 2.5 0 0 0 8.38 3H5.5zM6 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"
              clipRule="evenodd"
            />
          </svg>
          <select value={estadoFiltro} onChange={(e) => setEstadoFiltro(e.target.value)}>
            <option value="">Estado: Todos</option>
            <option value="en-stock">En Stock</option>
            <option value="poco-stock">Poco Stock</option>
            <option value="sin-stock">Sin Stock</option>
          </select>
          <svg viewBox="0 0 16 16" fill="currentColor" width="11" height="11">
            <path d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06z" />
          </svg>
        </label>

        <span className="inv-count">
          Mostrando {productosPage.length} de {productosFiltrados.length} productos
        </span>
      </div>

      {/* Tabla */}
      <div className="inv-table-card">
        <table className="inv-table">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productosPage.length === 0 ? (
              <tr>
                <td colSpan={6}>
                  <div className="inv-empty">No se encontraron productos</div>
                </td>
              </tr>
            ) : (
              productosPage.map((p) => {
                const stock = Number(p.stockTotal) || 0
                const estado = estadoDeStock(stock)
                return (
                  <tr key={p.idProducto}>
                    <td>
                      <div className="inv-product-cell">
                        {p.imagenUrl ? (
                          <img
                            className="inv-product-img"
                            src={p.imagenUrl}
                            alt={p.nombre}
                          />
                        ) : (
                          <div className="inv-product-img-placeholder">
                            <IconoImagen />
                          </div>
                        )}
                        <div>
                          <div className="inv-product-name">{p.nombre}</div>
                          <div className="inv-product-sku">
                            SKU: {p.skuPrincipal ?? `CY-${p.idProducto}`}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>{p.categoriaNombre ?? '—'}</td>
                    <td>{formatPrecio(p.precioBase)}</td>
                    <td>
                      {stock} {stock === 1 ? 'Unidad' : 'Unidades'}
                    </td>
                    <td>
                      <span className={`inv-status ${estado}`}>
                        {ESTADO_LABEL[estado]}
                      </span>
                    </td>
                    <td>
                      <div className="inv-actions">
                        <button
                          className="inv-action-btn"
                          title="Editar"
                          onClick={() => navigate(`/admin/productos/${p.idProducto}/editar`)}
                        >
                          <IconoEditar />
                        </button>
                        <button
                          className="inv-action-btn delete"
                          title="Eliminar"
                          onClick={() => handleEliminar(p.idProducto, p.nombre)}
                        >
                          <IconoEliminar />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>

        {/* Paginación */}
        {totalPaginas > 1 && (
          <div className="inv-pagination">
            <span className="inv-pagination-info">
              Página {pagActual} de {totalPaginas}
            </span>
            <div className="inv-page-btns">
              <button
                className="inv-page-btn"
                disabled={pagActual <= 1}
                onClick={() => setPagina(pagActual - 1)}
                title="Anterior"
              >
                ‹
              </button>

              {btnPages.reduce((acc, pg, i) => {
                const prev = btnPages[i - 1]
                if (prev && pg - prev > 1) {
                  acc.push(
                    <span key={`dots-${pg}`} className="inv-page-dots">
                      …
                    </span>
                  )
                }
                acc.push(
                  <button
                    key={pg}
                    className={`inv-page-btn${pagActual === pg ? ' active' : ''}`}
                    onClick={() => setPagina(pg)}
                  >
                    {pg}
                  </button>
                )
                return acc
              }, [])}

              <button
                className="inv-page-btn"
                disabled={pagActual >= totalPaginas}
                onClick={() => setPagina(pagActual + 1)}
                title="Siguiente"
              >
                ›
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
