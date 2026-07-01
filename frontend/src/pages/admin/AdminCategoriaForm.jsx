import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  createCategoria,
  updateCategoria,
  fetchCategoriaById,
  resetCategoriaSave,
  clearCategoriaActual,
} from '../../store/slices/categoriasSlice.js'

export default function AdminCategoriaForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const modoEditar = !!id

  const { current, currentStatus, currentError, saveStatus, saveError } = useSelector((s) => s.categorias)

  const [form, setForm] = useState({ nombre: '', descripcion: '', imagenUrl: '' })
  const [localError, setLocalError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    dispatch(resetCategoriaSave())
    if (modoEditar) dispatch(fetchCategoriaById(id))
    return () => dispatch(clearCategoriaActual())
  }, [id, modoEditar, dispatch])

  useEffect(() => {
    if (modoEditar && current) {
      setForm({
        nombre: current.nombre ?? '',
        descripcion: current.descripcion ?? '',
        imagenUrl: current.imagenUrl ?? '',
      })
    }
  }, [modoEditar, current])

  useEffect(() => {
    if (submitted && saveStatus === 'succeeded') navigate('/admin/categorias')
  }, [submitted, saveStatus, navigate])

  const cargando = modoEditar && (currentStatus === 'idle' || currentStatus === 'loading')
  const guardando = saveStatus === 'loading'
  const error = localError || saveError || (modoEditar ? currentError : '')

  function handleGuardar() {
    setLocalError('')
    if (!form.nombre.trim()) {
      setLocalError('El nombre es obligatorio.')
      return
    }
    const body = {
      nombre: form.nombre.trim(),
      descripcion: form.descripcion.trim(),
      imagenUrl: form.imagenUrl.trim() || null,
    }
    setSubmitted(true)
    if (modoEditar) dispatch(updateCategoria({ id, body }))
    else dispatch(createCategoria(body))
  }

  if (cargando) return <div className="inv-empty">Cargando...</div>

  return (
    <>
      {/* Topbar */}
      <div className="pf-topbar">
        <button
          className="pf-back-btn"
          type="button"
          onClick={() => navigate('/admin/categorias')}
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
          {modoEditar ? 'Editar Categoría' : 'Añadir Categoría'}
        </h1>
        <div className="pf-topbar-right">
          <button
            className="button secondary"
            type="button"
            onClick={() => navigate('/admin/categorias')}
            disabled={guardando}
          >
            Cancelar
          </button>
          <button
            className="button primary"
            type="button"
            onClick={handleGuardar}
            disabled={guardando}
          >
            {guardando
              ? 'Guardando...'
              : modoEditar
              ? 'Guardar Cambios'
              : 'Guardar Categoría'}
          </button>
        </div>
      </div>

      <div className="pf-body">
        {/* ===== Columna principal ===== */}
        <div className="pf-main">
          <div className="pf-card">
            <div className="pf-card-header">
              <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                <path
                  fillRule="evenodd"
                  d="M2 4.75C2 3.784 2.784 3 3.75 3h4.836c.464 0 .909.184 1.237.513l1.414 1.414c.328.328.773.513 1.237.513H16.25c.966 0 1.75.784 1.75 1.75v8.5A1.75 1.75 0 0 1 16.25 17H3.75A1.75 1.75 0 0 1 2 15.25V4.75zm1.75-.25a.25.25 0 0 0-.25.25v10.5c0 .138.112.25.25.25h12.5a.25.25 0 0 0 .25-.25v-8.5a.25.25 0 0 0-.25-.25h-5.836a.75.75 0 0 1-.53-.22L8.22 4.97a.25.25 0 0 0-.177-.073H3.75z"
                  clipRule="evenodd"
                />
              </svg>
              <h2 className="pf-card-title">Información General</h2>
            </div>

            <div className="pf-field">
              <label className="pf-label" htmlFor="catf-nombre">
                Nombre de la Categoría <span aria-hidden="true">*</span>
              </label>
              <input
                id="catf-nombre"
                className="pf-input"
                type="text"
                placeholder="Ej. Uniformes Médicos Premium"
                value={form.nombre}
                onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
                autoFocus={!modoEditar}
              />
            </div>

            <div className="pf-field">
              <label className="pf-label" htmlFor="catf-descripcion">
                Descripción
              </label>
              <textarea
                id="catf-descripcion"
                className="pf-textarea"
                placeholder="Escribí una descripción detallada para esta categoría..."
                rows={5}
                value={form.descripcion}
                onChange={(e) => setForm((f) => ({ ...f, descripcion: e.target.value }))}
              />
            </div>

            <div className="pf-field">
              <label className="pf-label" htmlFor="catf-imagen">
                URL de imagen
              </label>
              <input
                id="catf-imagen"
                className="pf-input"
                type="url"
                placeholder="https://..."
                value={form.imagenUrl}
                onChange={(e) => setForm((f) => ({ ...f, imagenUrl: e.target.value }))}
              />
            </div>

            {error && <p className="pf-error">{error}</p>}
          </div>
        </div>

        {/* ===== Sidebar ===== */}
        <div className="pf-sidebar">

          {/* Vista Previa */}
          <div className="pf-card">
            <div className="pf-card-header">
              <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                <path d="M10 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" />
                <path
                  fillRule="evenodd"
                  d="M.664 10.59a1.651 1.651 0 0 1 0-1.186A10.004 10.004 0 0 1 10 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0 1 10 17c-4.257 0-7.893-2.66-9.336-6.41zM14 10a4 4 0 1 1-8 0 4 4 0 0 1 8 0z"
                  clipRule="evenodd"
                />
              </svg>
              <h2 className="pf-card-title">Vista Previa</h2>
            </div>

            <div className="catf-preview-card">
              <div className="catf-preview-icon">
                <svg viewBox="0 0 20 20" fill="currentColor" width="22" height="22">
                  <path
                    fillRule="evenodd"
                    d="M2 4.75C2 3.784 2.784 3 3.75 3h4.836c.464 0 .909.184 1.237.513l1.414 1.414c.328.328.773.513 1.237.513H16.25c.966 0 1.75.784 1.75 1.75v8.5A1.75 1.75 0 0 1 16.25 17H3.75A1.75 1.75 0 0 1 2 15.25V4.75zm1.75-.25a.25.25 0 0 0-.25.25v10.5c0 .138.112.25.25.25h12.5a.25.25 0 0 0 .25-.25v-8.5a.25.25 0 0 0-.25-.25h-5.836a.75.75 0 0 1-.53-.22L8.22 4.97a.25.25 0 0 0-.177-.073H3.75z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <p className="catf-preview-name">
                {form.nombre || 'Nombre de Categoría'}
              </p>
              <p className="catf-preview-desc">
                {form.descripcion
                  ? form.descripcion.length > 80
                    ? form.descripcion.slice(0, 80) + '...'
                    : form.descripcion
                  : 'Sin descripción'}
              </p>
            </div>
          </div>

          {/* Consejo */}
          <div className="catf-tip-card">
            <svg
              className="catf-tip-icon"
              viewBox="0 0 20 20"
              fill="currentColor"
              width="18"
              height="18"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM9 9a.75.75 0 0 0 0 1.5h.253a.25.25 0 0 1 .244.304l-.459 2.066A1.75 1.75 0 0 0 10.747 15H11a.75.75 0 0 0 0-1.5h-.253a.25.25 0 0 1-.244-.304l.459-2.066A1.75 1.75 0 0 0 9.253 9H9z"
                clipRule="evenodd"
              />
            </svg>
            <span>
              Usá nombres concisos y descripciones con palabras clave para
              mejorar el posicionamiento de tus productos en buscadores.
            </span>
          </div>
        </div>
      </div>
    </>
  )
}
