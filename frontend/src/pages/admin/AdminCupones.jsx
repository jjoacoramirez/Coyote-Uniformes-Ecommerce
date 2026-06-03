import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../services/api'

function parseLocalDate(val) {
  if (!val) return null
  if (Array.isArray(val)) {
    const [y, m, d] = val
    return new Date(y, m - 1, d)
  }
  return new Date(val + 'T00:00:00')
}

function formatFecha(val) {
  const d = parseLocalDate(val)
  if (!d) return '—'
  return d.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

function estadoCupon(c) {
  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)
  const fin = parseLocalDate(c.fechaFin)
  const inicio = parseLocalDate(c.fechaInicio)
  if (fin && fin < hoy) return 'vencido'
  if (!c.activo) return 'inactivo'
  if (inicio && inicio > hoy) return 'pendiente'
  return 'activo'
}

const ESTADO_LABEL = {
  activo: 'Activo',
  inactivo: 'Inactivo',
  vencido: 'Vencido',
  pendiente: 'Pendiente',
}

function formatValor(c) {
  if (c.tipo === 'PORCENTAJE') return `${Number(c.valor)}%`
  return `AR$ ${Number(c.valor).toLocaleString('es-AR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
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

export default function AdminCupones() {
  const navigate = useNavigate()
  const [cupones, setCupones] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  const [busqueda, setBusqueda] = useState('')
  const [tipoFiltro, setTipoFiltro] = useState('')
  const [estadoFiltro, setEstadoFiltro] = useState('')
  const [ordenFiltro, setOrdenFiltro] = useState('nuevo')

  useEffect(() => {
    cargarCupones()
  }, [])

  async function cargarCupones() {
    try {
      const data = await api.get('/descuentos')
      setCupones(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setCargando(false)
    }
  }

  const cuponesFiltrados = useMemo(() => {
    let lista = cupones.filter((c) => {
      if (tipoFiltro && c.tipo !== tipoFiltro) return false
      if (estadoFiltro && estadoCupon(c) !== estadoFiltro) return false
      if (busqueda) {
        const q = busqueda.toLowerCase()
        if (!c.codigo?.toLowerCase().includes(q)) return false
      }
      return true
    })

    switch (ordenFiltro) {
      case 'nuevo':
        lista = [...lista].sort((a, b) => b.idDescuento - a.idDescuento)
        break
      case 'codigo':
        lista = [...lista].sort((a, b) =>
          (a.codigo ?? '').localeCompare(b.codigo ?? '')
        )
        break
      case 'fecha-asc':
        lista = [...lista].sort((a, b) => {
          const da = parseLocalDate(a.fechaInicio)
          const db = parseLocalDate(b.fechaInicio)
          return (da ?? 0) - (db ?? 0)
        })
        break
      case 'fecha-desc':
        lista = [...lista].sort((a, b) => {
          const da = parseLocalDate(a.fechaInicio)
          const db = parseLocalDate(b.fechaInicio)
          return (db ?? 0) - (da ?? 0)
        })
        break
    }

    return lista
  }, [cupones, busqueda, tipoFiltro, estadoFiltro, ordenFiltro])

  async function handleToggleActivo(c) {
    try {
      const actualizado = await api.put(`/descuentos/${c.idDescuento}`, {
        activo: !c.activo,
      })
      setCupones((prev) =>
        prev.map((x) => (x.idDescuento === c.idDescuento ? actualizado : x))
      )
    } catch (e) {
      alert(`Error: ${e.message}`)
    }
  }

  async function handleEliminar(id, codigo) {
    if (
      !window.confirm(
        `¿Eliminar el cupón "${codigo}"? Esta acción no se puede deshacer.`
      )
    )
      return
    try {
      await api.delete(`/descuentos/${id}`)
      setCupones((prev) => prev.filter((c) => c.idDescuento !== id))
    } catch (e) {
      alert(`Error al eliminar: ${e.message}`)
    }
  }

  if (cargando) return <div className="inv-empty">Cargando cupones...</div>
  if (error)
    return (
      <div className="inv-empty" style={{ color: 'var(--color-primary)' }}>
        Error al cargar cupones: {error}
      </div>
    )

  return (
    <>
      <div className="inv-header">
        <div>
          <h1 className="inv-title">Cupones de Descuento</h1>
          <p className="inv-subtitle">
            Gestioná los cupones y promociones de tu tienda
          </p>
        </div>
        <button
          className="button primary"
          type="button"
          onClick={() => navigate('/admin/cupones/nuevo')}
        >
          + Nuevo Cupón
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
          placeholder="Buscar por código..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      <div className="inv-filters">
        <label className="inv-filter-select">
          <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
            <path d="M2 4.75A.75.75 0 0 1 2.75 4h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 4.75zM4 10a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 0 1.5H4.75A.75.75 0 0 1 4 10zm2.75 4.5a.75.75 0 0 0 0 1.5h6.5a.75.75 0 0 0 0-1.5h-6.5z" />
          </svg>
          <select value={tipoFiltro} onChange={(e) => setTipoFiltro(e.target.value)}>
            <option value="">Tipo: Todos</option>
            <option value="PORCENTAJE">Porcentaje (%)</option>
            <option value="MONTO_FIJO">Monto Fijo (AR$)</option>
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
          <select
            value={estadoFiltro}
            onChange={(e) => setEstadoFiltro(e.target.value)}
          >
            <option value="">Estado: Todos</option>
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
            <option value="vencido">Vencido</option>
            <option value="pendiente">Pendiente</option>
          </select>
          <svg viewBox="0 0 16 16" fill="currentColor" width="11" height="11">
            <path d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06z" />
          </svg>
        </label>

        <label className="inv-filter-select">
          <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
            <path d="M2 4.75A.75.75 0 0 1 2.75 4h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 4.75zM2 10a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 2 10zm0 5.25a.75.75 0 0 1 .75-.75h3.5a.75.75 0 0 1 0 1.5h-3.5a.75.75 0 0 1-.75-.75z" />
          </svg>
          <select
            value={ordenFiltro}
            onChange={(e) => setOrdenFiltro(e.target.value)}
          >
            <option value="nuevo">Ordenar: Más reciente</option>
            <option value="codigo">Ordenar: Código A-Z</option>
            <option value="fecha-asc">Inicio: más antiguo</option>
            <option value="fecha-desc">Inicio: más reciente</option>
          </select>
          <svg viewBox="0 0 16 16" fill="currentColor" width="11" height="11">
            <path d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06z" />
          </svg>
        </label>

        <span className="inv-count">
          {cuponesFiltrados.length}{' '}
          {cuponesFiltrados.length === 1 ? 'cupón' : 'cupones'}
        </span>
      </div>

      <div className="inv-table-card">
        <table className="inv-table">
          <thead>
            <tr>
              <th>Código</th>
              <th>Descuento</th>
              <th>Vigencia</th>
              <th>Usos</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {cuponesFiltrados.length === 0 ? (
              <tr>
                <td colSpan={6}>
                  <div className="inv-empty">No se encontraron cupones</div>
                </td>
              </tr>
            ) : (
              cuponesFiltrados.map((c) => {
                const estado = estadoCupon(c)
                const usoMax = c.usoMaximo != null ? c.usoMaximo : null
                const usoActual = c.usoActual ?? 0
                return (
                  <tr key={c.idDescuento}>
                    <td>
                      <div className="cup-codigo-cell">
                        <span className="cup-codigo">{c.codigo}</span>
                        <span
                          className={`cup-tipo-badge ${c.tipo === 'PORCENTAJE' ? 'pct' : 'fijo'}`}
                        >
                          {c.tipo === 'PORCENTAJE' ? '%' : 'AR$'}
                        </span>
                      </div>
                      {c.montoMinimo != null && Number(c.montoMinimo) > 0 && (
                        <div className="cup-minimo">
                          Mín. AR${' '}
                          {Number(c.montoMinimo).toLocaleString('es-AR', {
                            minimumFractionDigits: 0,
                          })}
                        </div>
                      )}
                    </td>
                    <td>
                      <span className="cup-valor">{formatValor(c)}</span>
                    </td>
                    <td>
                      <div className="cup-vigencia">
                        <span>{formatFecha(c.fechaInicio)}</span>
                        <span className="cup-vigencia-sep">–</span>
                        <span>
                          {c.fechaFin ? formatFecha(c.fechaFin) : 'Sin venc.'}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="cup-usos">
                        <span className="cup-usos-actual">{usoActual}</span>
                        <span className="cup-usos-sep">/</span>
                        <span className="cup-usos-max">
                          {usoMax != null ? usoMax : '∞'}
                        </span>
                      </div>
                      {usoMax != null && (
                        <div className="cup-usos-bar">
                          <div
                            className="cup-usos-fill"
                            style={{
                              width: `${Math.min((usoActual / usoMax) * 100, 100)}%`,
                            }}
                          />
                        </div>
                      )}
                    </td>
                    <td>
                      <span className={`inv-status cup-estado-${estado}`}>
                        {ESTADO_LABEL[estado]}
                      </span>
                    </td>
                    <td>
                      <div className="inv-actions">
                        <button
                          className={`inv-action-btn${c.activo ? ' toggle-on' : ' toggle-off'}`}
                          title={c.activo ? 'Desactivar' : 'Activar'}
                          onClick={() => handleToggleActivo(c)}
                        >
                          <svg
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            width="15"
                            height="15"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                        <button
                          className="inv-action-btn"
                          title="Editar"
                          onClick={() =>
                            navigate(`/admin/cupones/${c.idDescuento}/editar`)
                          }
                        >
                          <IconoEditar />
                        </button>
                        <button
                          className="inv-action-btn delete"
                          title="Eliminar"
                          onClick={() => handleEliminar(c.idDescuento, c.codigo)}
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
      </div>
    </>
  )
}
