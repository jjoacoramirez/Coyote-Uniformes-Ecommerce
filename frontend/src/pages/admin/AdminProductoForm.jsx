import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../services/api'

const VARIANTE_VACIA = { talle: '', color: '', stock: '', sku: '', precio: '0', activo: true }

const COLORES = {
  rojo: '#ef4444', azul: '#3b82f6', verde: '#22c55e', negro: '#111827',
  blanco: '#f3f4f6', amarillo: '#eab308', naranja: '#f97316',
  violeta: '#8b5cf6', rosa: '#ec4899', gris: '#6b7280',
  granate: '#7f1d1d', 'azul cielo': '#7dd3fc', celeste: '#38bdf8',
  marrón: '#92400e', marron: '#92400e', beige: '#d4b896',
  bordó: '#7f1d1d', bordo: '#7f1d1d', turquesa: '#14b8a6',
}

function colorDot(color) {
  return COLORES[color?.toLowerCase().trim()] || '#d1d5db'
}

const IconoEditar = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
    <path d="M5.433 13.917l1.262-3.155A4 4 0 0 1 7.58 9.42l6.92-6.918a2.121 2.121 0 0 1 3 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 0 1-.65-.65z" />
    <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0 0 10 3H4.75A2.75 2.75 0 0 0 2 5.75v9.5A2.75 2.75 0 0 0 4.75 18h9.5A2.75 2.75 0 0 0 17 15.25V10a.75.75 0 0 0-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
  </svg>
)

const IconoEliminar = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
    <path
      fillRule="evenodd"
      d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5z"
      clipRule="evenodd"
    />
  </svg>
)

export default function AdminProductoForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const modoEditar = !!id

  const [cargando, setCargando] = useState(modoEditar)
  const [guardando, setGuardando] = useState(false)
  const [errorPagina, setErrorPagina] = useState(null)
  const [errorForm, setErrorForm] = useState('')
  const [categorias, setCategorias] = useState([])

  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    precioBase: '',
    idCategoria: '',
    activo: true,
  })

  const [imagenFile, setImagenFile] = useState(null)
  const [imagenPreview, setImagenPreview] = useState(null)
  const fileRef = useRef()

  const [variantes, setVariantes] = useState([])
  const [eliminados, setEliminados] = useState([])
  const [modalVar, setModalVar] = useState(null)
  const [errorVar, setErrorVar] = useState('')
  const keyRef = useRef(0)

  function nextKey() {
    return ++keyRef.current
  }

  useEffect(() => {
    async function cargar() {
      try {
        const peticiones = [api.get('/categorias')]
        if (modoEditar) {
          peticiones.push(api.get(`/productos/${id}`))
          peticiones.push(api.get(`/variantes/producto/${id}`))
        }
        const [cats, prod, vars] = await Promise.all(peticiones)
        setCategorias(cats)
        if (prod) {
          setForm({
            nombre: prod.nombre ?? '',
            descripcion: prod.descripcion ?? '',
            precioBase: prod.precioBase != null ? String(prod.precioBase) : '',
            idCategoria:
              prod.categoria?.idCategoria != null
                ? String(prod.categoria.idCategoria)
                : '',
            activo: prod.activo ?? true,
          })
          if (prod.imagenUrl) setImagenPreview(prod.imagenUrl)
        }
        if (vars) {
          setVariantes(vars.map((v) => ({ ...v, _key: nextKey() })))
        }
      } catch (e) {
        setErrorPagina(e.message)
      } finally {
        setCargando(false)
      }
    }
    cargar()
  }, [id])

  function handleImagenChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setImagenFile(file)
    setImagenPreview(URL.createObjectURL(file))
  }

  function handleDrop(e) {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file?.type.startsWith('image/')) {
      setImagenFile(file)
      setImagenPreview(URL.createObjectURL(file))
    }
  }

  function abrirCrearVariante() {
    setErrorVar('')
    setModalVar({ key: null, form: { ...VARIANTE_VACIA } })
  }

  function abrirEditarVariante(v) {
    setErrorVar('')
    setModalVar({
      key: v._key,
      form: {
        talle: v.talle ?? '',
        color: v.color ?? '',
        stock: v.stock != null ? String(v.stock) : '',
        sku: v.sku ?? '',
        precio: v.precio != null ? String(v.precio) : '0',
        activo: v.activo ?? true,
      },
    })
  }

  function cerrarModalVar() {
    setModalVar(null)
    setErrorVar('')
  }

  function handleGuardarVariante(e) {
    e.preventDefault()
    const f = modalVar.form
    const talle = f.talle.trim()
    const color = f.color.trim()
    if (!talle && !color) {
      setErrorVar('Indicá al menos un talle o un color.')
      return
    }
    if (f.stock === '' || Number(f.stock) < 0) {
      setErrorVar('El stock debe ser 0 o mayor.')
      return
    }
    if (modalVar.key === null) {
      const talleNorm = talle.toLowerCase()
      const colorNorm = color.toLowerCase()
      const dup = variantes.find(
        (v) =>
          (v.talle ?? '').toLowerCase().trim() === talleNorm &&
          (v.color ?? '').toLowerCase().trim() === colorNorm
      )
      if (dup) {
        setErrorVar('Ya existe una variante con esa combinación de talle y color.')
        return
      }
      setVariantes((prev) => [
        ...prev,
        {
          talle,
          color,
          stock: Number(f.stock),
          sku: f.sku.trim(),
          precio: Number(f.precio) || 0,
          activo: f.activo,
          _key: nextKey(),
        },
      ])
    } else {
      setVariantes((prev) =>
        prev.map((v) =>
          v._key === modalVar.key
            ? {
                ...v,
                talle,
                color,
                stock: Number(f.stock),
                sku: f.sku.trim(),
                precio: Number(f.precio) || 0,
                activo: f.activo,
              }
            : v
        )
      )
    }
    cerrarModalVar()
  }

  function handleEliminarVariante(v) {
    if (v.idVariante) setEliminados((prev) => [...prev, v.idVariante])
    setVariantes((prev) => prev.filter((x) => x._key !== v._key))
  }

  async function handleGuardar() {
    setErrorForm('')
    if (!form.nombre.trim()) {
      setErrorForm('El nombre del producto es obligatorio.')
      return
    }
    if (!form.precioBase || isNaN(Number(form.precioBase)) || Number(form.precioBase) < 0) {
      setErrorForm('El precio debe ser un número válido.')
      return
    }
    if (!form.idCategoria) {
      setErrorForm('Seleccioná una categoría.')
      return
    }

    setGuardando(true)
    try {
      const productoPayload = {
        nombre: form.nombre.trim(),
        descripcion: form.descripcion.trim(),
        precioBase: Number(form.precioBase),
        idCategoria: Number(form.idCategoria),
        activo: form.activo,
      }

      const fd = new FormData()
      fd.append(
        'producto',
        new Blob([JSON.stringify(productoPayload)], { type: 'application/json' })
      )
      if (imagenFile) fd.append('imagen', imagenFile)

      let savedId = modoEditar ? Number(id) : null
      if (modoEditar) {
        await api.multipart(`/productos/${id}`, fd, 'PUT')
      } else {
        const creado = await api.multipart('/productos', fd)
        savedId = creado.idProducto
      }

      await Promise.all(eliminados.map((eid) => api.delete(`/variantes/${eid}`)))

      for (const v of variantes) {
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

      navigate('/admin/productos')
    } catch (e) {
      setErrorForm(e.message || 'Error al guardar el producto.')
    } finally {
      setGuardando(false)
    }
  }

  const formatPrecio = (p) =>
    p
      ? `AR$ ${Number(p).toLocaleString('es-AR', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`
      : '—'

  if (cargando) return <div className="inv-empty">Cargando...</div>
  if (errorPagina)
    return (
      <div className="inv-empty" style={{ color: 'var(--color-primary)' }}>
        Error: {errorPagina}
      </div>
    )

  return (
    <>
      {/* Encabezado de página */}
      <div className="pf-topbar">
        <button
          className="pf-back-btn"
          type="button"
          onClick={() => navigate('/admin/productos')}
          title="Volver al listado"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
            <path
              fillRule="evenodd"
              d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        <h1 className="pf-title">
          {modoEditar ? 'Editar Producto' : 'Añadir Producto'}
        </h1>
      </div>

      <div className="pf-body">
        {/* ===== Columna principal ===== */}
        <div className="pf-main">

          {/* Información General */}
          <div className="pf-card">
            <div className="pf-card-header">
              <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                <path
                  fillRule="evenodd"
                  d="M4.5 2A1.5 1.5 0 0 0 3 3.5v13A1.5 1.5 0 0 0 4.5 18h11a1.5 1.5 0 0 0 1.5-1.5V7.621a1.5 1.5 0 0 0-.44-1.06l-4.12-4.122A1.5 1.5 0 0 0 11.378 2H4.5zm2.25 8.5a.75.75 0 0 0 0 1.5h6.5a.75.75 0 0 0 0-1.5h-6.5zm0 3a.75.75 0 0 0 0 1.5h6.5a.75.75 0 0 0 0-1.5h-6.5zm0-6a.75.75 0 0 0 0 1.5h3a.75.75 0 0 0 0-1.5h-3z"
                  clipRule="evenodd"
                />
              </svg>
              <h2 className="pf-card-title">Información General</h2>
            </div>
            <div className="pf-field">
              <label className="pf-label" htmlFor="pf-nombre">
                Nombre del Producto
              </label>
              <input
                id="pf-nombre"
                className="pf-input"
                type="text"
                placeholder="Ej. Bata Médica Signature"
                value={form.nombre}
                onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
                autoFocus={!modoEditar}
              />
            </div>
            <div className="pf-field">
              <label className="pf-label" htmlFor="pf-descripcion">
                Descripción
              </label>
              <textarea
                id="pf-descripcion"
                className="pf-textarea"
                placeholder="Escribí los detalles del producto aquí..."
                rows={5}
                value={form.descripcion}
                onChange={(e) => setForm((f) => ({ ...f, descripcion: e.target.value }))}
              />
            </div>
          </div>

          {/* Precios e Inventario */}
          <div className="pf-card">
            <div className="pf-card-header">
              <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                <path d="M2.5 4A1.5 1.5 0 0 0 1 5.5v1A1.5 1.5 0 0 0 2.5 8h15A1.5 1.5 0 0 0 19 6.5v-1A1.5 1.5 0 0 0 17.5 4h-15zM1 11.5A1.5 1.5 0 0 1 2.5 10h15a1.5 1.5 0 0 1 1.5 1.5v1a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 1 12.5v-1z" />
              </svg>
              <h2 className="pf-card-title">Precios e Inventario</h2>
            </div>
            <div className="pf-field">
              <label className="pf-label" htmlFor="pf-precio">
                Precio Base
              </label>
              <div className="pf-input-affix">
                <span className="pf-affix">AR$</span>
                <input
                  id="pf-precio"
                  className="pf-input with-affix"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={form.precioBase}
                  onChange={(e) => setForm((f) => ({ ...f, precioBase: e.target.value }))}
                />
              </div>
            </div>
          </div>

          {/* Variantes */}
          <div className="pf-card">
            <div className="pf-card-header">
              <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                <path
                  fillRule="evenodd"
                  d="M2.5 3A1.5 1.5 0 0 0 1 4.5v4A1.5 1.5 0 0 0 2.5 10h4A1.5 1.5 0 0 0 8 8.5v-4A1.5 1.5 0 0 0 6.5 3h-4zm9 0A1.5 1.5 0 0 0 10 4.5v4a1.5 1.5 0 0 0 1.5 1.5h4a1.5 1.5 0 0 0 1.5-1.5v-4A1.5 1.5 0 0 0 15.5 3h-4zm-9 9A1.5 1.5 0 0 0 1 13.5v4A1.5 1.5 0 0 0 2.5 19h4A1.5 1.5 0 0 0 8 17.5v-4A1.5 1.5 0 0 0 6.5 12h-4zm9 0a1.5 1.5 0 0 0-1.5 1.5v4a1.5 1.5 0 0 0 1.5 1.5h4a1.5 1.5 0 0 0 1.5-1.5v-4a1.5 1.5 0 0 0-1.5-1.5h-4z"
                  clipRule="evenodd"
                />
              </svg>
              <h2 className="pf-card-title">Variantes de Producto</h2>
              <button
                type="button"
                className="button primary pf-btn-addvar"
                onClick={abrirCrearVariante}
              >
                + Añadir Variante
              </button>
            </div>

            {variantes.length === 0 ? (
              <p className="pf-variantes-empty">
                No hay variantes. Añadí una variante para gestionar talles, colores y stock.
              </p>
            ) : (
              <div className="pf-var-table-wrap">
                <table className="pf-var-table">
                  <thead>
                    <tr>
                      <th>Talle</th>
                      <th>Color</th>
                      <th>Stock</th>
                      <th>Precio Extra</th>
                      <th>SKU</th>
                      <th>Activo</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {variantes.map((v) => (
                      <tr key={v._key}>
                        <td>{v.talle}</td>
                        <td>
                          <span className="pf-color-cell">
                            <span
                              className="pf-color-dot"
                              style={{ background: colorDot(v.color) }}
                            />
                            {v.color}
                          </span>
                        </td>
                        <td>{v.stock}</td>
                        <td>
                          {Number(v.precio) === 0 ? (
                            <span style={{ color: '#9ca3af' }}>—</span>
                          ) : (
                            formatPrecio(v.precio)
                          )}
                        </td>
                        <td>
                          <span className="pf-sku-cell">{v.sku || '—'}</span>
                        </td>
                        <td>
                          <span className={`pf-activo-badge ${v.activo ? 'si' : 'no'}`}>
                            {v.activo ? 'Sí' : 'No'}
                          </span>
                        </td>
                        <td>
                          <div className="inv-actions">
                            <button
                              className="inv-action-btn"
                              title="Editar"
                              type="button"
                              onClick={() => abrirEditarVariante(v)}
                            >
                              <IconoEditar />
                            </button>
                            <button
                              className="inv-action-btn delete"
                              title="Eliminar"
                              type="button"
                              onClick={() => handleEliminarVariante(v)}
                            >
                              <IconoEliminar />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* ===== Sidebar ===== */}
        <div className="pf-sidebar">

          {/* Estado + guardar */}
          <div className="pf-card">
            <div className="pf-field">
              <label className="pf-label" htmlFor="pf-estado">
                Estado del Producto
              </label>
              <select
                id="pf-estado"
                className="pf-select"
                value={form.activo ? 'activo' : 'inactivo'}
                onChange={(e) =>
                  setForm((f) => ({ ...f, activo: e.target.value === 'activo' }))
                }
              >
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </div>

            {errorForm && <p className="pf-error">{errorForm}</p>}

            <button
              className="button primary pf-btn-save"
              type="button"
              onClick={handleGuardar}
              disabled={guardando}
            >
              {guardando ? 'Guardando...' : 'Guardar Producto'}
            </button>
            <button
              className="button secondary pf-btn-discard"
              type="button"
              onClick={() => navigate('/admin/productos')}
              disabled={guardando}
            >
              Descartar Cambios
            </button>
          </div>

          {/* Imágenes */}
          <div className="pf-card">
            <div className="pf-card-header">
              <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                <path
                  fillRule="evenodd"
                  d="M1 5.25A2.25 2.25 0 0 1 3.25 3h13.5A2.25 2.25 0 0 1 19 5.25v9.5A2.25 2.25 0 0 1 16.75 17H3.25A2.25 2.25 0 0 1 1 14.75v-9.5zm1.5 5.81v3.69c0 .414.336.75.75.75h13.5a.75.75 0 0 0 .75-.75v-2.69l-2.22-2.219a.75.75 0 0 0-1.06 0l-1.91 1.909.47.47a.75.75 0 1 1-1.06 1.06L6.53 8.091a.75.75 0 0 0-1.06 0l-2.97 2.97zM12 7a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"
                  clipRule="evenodd"
                />
              </svg>
              <h2 className="pf-card-title">Imágenes</h2>
            </div>
            <div
              className={`pf-dropzone${imagenPreview ? ' has-image' : ''}`}
              onClick={() => fileRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
            >
              {imagenPreview ? (
                <img
                  className="pf-preview-img"
                  src={imagenPreview}
                  alt="Vista previa"
                />
              ) : (
                <>
                  <svg
                    className="pf-upload-icon"
                    viewBox="0 0 40 40"
                    fill="none"
                    width="36"
                    height="36"
                  >
                    <path
                      d="M20 28V12M20 12l-5 5M20 12l5 5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M8 30h24"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                  <p className="pf-dropzone-text">
                    Arrastrá tus fotos o{' '}
                    <span className="pf-dropzone-link">explorá</span>
                  </p>
                  <p className="pf-dropzone-hint">PNG, JPG hasta 10MB</p>
                </>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleImagenChange}
            />
            {imagenPreview && (
              <button
                type="button"
                className="pf-img-change-btn"
                onClick={(e) => {
                  e.stopPropagation()
                  fileRef.current?.click()
                }}
              >
                Cambiar imagen
              </button>
            )}
          </div>

          {/* Organización */}
          <div className="pf-card">
            <div className="pf-card-header">
              <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                <path
                  fillRule="evenodd"
                  d="M5.5 3A2.5 2.5 0 0 0 3 5.5v2.879a2.5 2.5 0 0 0 .732 1.767l6.5 6.5a2.5 2.5 0 0 0 3.536 0l2.878-2.878a2.5 2.5 0 0 0 0-3.536l-6.5-6.5A2.5 2.5 0 0 0 8.38 3H5.5zM6 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"
                  clipRule="evenodd"
                />
              </svg>
              <h2 className="pf-card-title">Organización</h2>
            </div>
            <div className="pf-field">
              <label className="pf-label" htmlFor="pf-categoria">
                Categoría
              </label>
              <select
                id="pf-categoria"
                className="pf-select"
                value={form.idCategoria}
                onChange={(e) => setForm((f) => ({ ...f, idCategoria: e.target.value }))}
              >
                <option value="">Seleccionar categoría...</option>
                {categorias.map((c) => (
                  <option key={c.idCategoria} value={String(c.idCategoria)}>
                    {c.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Modal variante */}
      {modalVar && (
        <div className="cat-modal-overlay" onClick={cerrarModalVar}>
          <div
            className="pf-var-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="cat-modal-header">
              <h2 className="cat-modal-titulo">
                {modalVar.key === null ? 'Nueva Variante' : 'Editar Variante'}
              </h2>
              <button
                className="cat-modal-close"
                type="button"
                onClick={cerrarModalVar}
                aria-label="Cerrar"
              >
                <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
                  <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22z" />
                </svg>
              </button>
            </div>
            <form className="pf-var-form" onSubmit={handleGuardarVariante}>
              <div className="pf-var-row">
                <div className="pf-field">
                  <label className="pf-label">Talle</label>
                  <input
                    className="pf-input"
                    type="text"
                    placeholder="Ej. M, XL, 42"
                    value={modalVar.form.talle}
                    onChange={(e) =>
                      setModalVar((m) => ({
                        ...m,
                        form: { ...m.form, talle: e.target.value },
                      }))
                    }
                    autoFocus
                  />
                </div>
                <div className="pf-field">
                  <label className="pf-label">Color</label>
                  <input
                    className="pf-input"
                    type="text"
                    placeholder="Ej. Azul Cielo"
                    value={modalVar.form.color}
                    onChange={(e) =>
                      setModalVar((m) => ({
                        ...m,
                        form: { ...m.form, color: e.target.value },
                      }))
                    }
                  />
                </div>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--color-muted)', margin: '-6px 0 2px' }}>
                Indicá al menos un talle o un color.
              </p>
              <div className="pf-var-row">
                <div className="pf-field">
                  <label className="pf-label">
                    Stock <span aria-hidden="true">*</span>
                  </label>
                  <input
                    className="pf-input"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={modalVar.form.stock}
                    onChange={(e) =>
                      setModalVar((m) => ({
                        ...m,
                        form: { ...m.form, stock: e.target.value },
                      }))
                    }
                  />
                </div>
                <div className="pf-field">
                  <label className="pf-label">Precio Extra</label>
                  <div className="pf-input-affix">
                    <span className="pf-affix">AR$</span>
                    <input
                      className="pf-input with-affix"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={modalVar.form.precio}
                      onChange={(e) =>
                        setModalVar((m) => ({
                          ...m,
                          form: { ...m.form, precio: e.target.value },
                        }))
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="pf-field">
                <label className="pf-label">SKU</label>
                <input
                  className="pf-input"
                  type="text"
                  placeholder="Ej. CYT-2024-001-M-AZ"
                  value={modalVar.form.sku}
                  onChange={(e) =>
                    setModalVar((m) => ({
                      ...m,
                      form: { ...m.form, sku: e.target.value },
                    }))
                  }
                />
              </div>
              <div className="pf-activo-row">
                <label className="cup-toggle-label">
                  <input
                    type="checkbox"
                    className="cup-toggle-input"
                    checked={modalVar.form.activo}
                    onChange={(e) =>
                      setModalVar((m) => ({
                        ...m,
                        form: { ...m.form, activo: e.target.checked },
                      }))
                    }
                  />
                  <span className="cup-toggle-track">
                    <span className="cup-toggle-thumb" />
                  </span>
                  <span className="cup-toggle-text">
                    {modalVar.form.activo ? 'Activa' : 'Inactiva'}
                  </span>
                </label>
              </div>
              {errorVar && <p className="cat-modal-error">{errorVar}</p>}
              <div className="cat-modal-actions">
                <button
                  type="button"
                  className="button secondary"
                  onClick={cerrarModalVar}
                >
                  Cancelar
                </button>
                <button type="submit" className="button primary">
                  {modalVar.key === null ? 'Añadir Variante' : 'Guardar Cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
