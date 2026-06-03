import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../services/api'

function parseLocalDate(val) {
  if (!val) return null
  if (Array.isArray(val)) {
    const [y, m, d] = val
    return new Date(y, m - 1, d)
  }
  return new Date(val + 'T00:00:00')
}

function toInputDate(val) {
  if (!val) return ''
  if (Array.isArray(val)) {
    const [y, m, d] = val
    return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`
  }
  return val
}

const FORM_VACIO = {
  codigo: '',
  tipo: 'PORCENTAJE',
  valor: '',
  fechaInicio: '',
  fechaFin: '',
  montoMinimo: '',
  usoMaximo: '',
  activo: true,
}

export default function AdminCuponForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const modoEditar = !!id

  const [cargando, setCargando] = useState(modoEditar)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState(FORM_VACIO)

  useEffect(() => {
    if (!modoEditar) return
    api
      .get(`/descuentos/${id}`)
      .then((c) =>
        setForm({
          codigo: c.codigo ?? '',
          tipo: c.tipo ?? 'PORCENTAJE',
          valor: c.valor != null ? String(c.valor) : '',
          fechaInicio: toInputDate(c.fechaInicio),
          fechaFin: toInputDate(c.fechaFin),
          montoMinimo: c.montoMinimo != null ? String(c.montoMinimo) : '',
          usoMaximo: c.usoMaximo != null ? String(c.usoMaximo) : '',
          activo: c.activo ?? true,
        })
      )
      .catch((e) => setError(e.message))
      .finally(() => setCargando(false))
  }, [id])

  function buildBody() {
    return {
      codigo: form.codigo.trim().toUpperCase(),
      tipo: form.tipo,
      valor: form.valor !== '' ? Number(form.valor) : null,
      fechaInicio: form.fechaInicio || null,
      fechaFin: form.fechaFin || null,
      montoMinimo: form.montoMinimo !== '' ? Number(form.montoMinimo) : null,
      usoMaximo: form.usoMaximo !== '' ? Number(form.usoMaximo) : null,
      activo: form.activo,
    }
  }

  async function handleGuardar() {
    setError('')
    if (!form.codigo.trim()) {
      setError('El código es obligatorio.')
      return
    }
    if (!form.valor || Number(form.valor) <= 0) {
      setError('El valor del descuento debe ser mayor a 0.')
      return
    }
    if (!form.fechaInicio) {
      setError('La fecha de inicio es obligatoria.')
      return
    }
    if (form.tipo === 'PORCENTAJE' && Number(form.valor) > 100) {
      setError('El porcentaje no puede superar 100%.')
      return
    }
    setGuardando(true)
    try {
      if (modoEditar) {
        await api.put(`/descuentos/${id}`, buildBody())
      } else {
        await api.post('/descuentos', buildBody())
      }
      navigate('/admin/cupones')
    } catch (e) {
      setError(e.message || 'Error al guardar')
    } finally {
      setGuardando(false)
    }
  }

  // --- Vista Previa ---
  const codigoDisplay = form.codigo.trim() || 'CUPONCODE'

  const descuentoDisplay =
    form.valor && Number(form.valor) > 0
      ? form.tipo === 'PORCENTAJE'
        ? `AHORRA ${form.valor}%`
        : `AHORRA AR$ ${Number(form.valor).toLocaleString('es-AR', { minimumFractionDigits: 0 })}`
      : 'AHORRA 0%'

  function estadoPreview() {
    if (!form.activo) return 'inactivo'
    if (!form.fechaInicio) return 'borrador'
    const hoy = new Date()
    hoy.setHours(0, 0, 0, 0)
    const inicio = new Date(form.fechaInicio + 'T00:00:00')
    const fin = form.fechaFin ? new Date(form.fechaFin + 'T00:00:00') : null
    if (fin && fin < hoy) return 'vencido'
    if (inicio > hoy) return 'pendiente'
    return 'activo'
  }

  const estado = estadoPreview()
  const estadoLabel = {
    borrador: 'BORRADOR',
    activo: 'ACTIVO',
    inactivo: 'INACTIVO',
    pendiente: 'PENDIENTE',
    vencido: 'VENCIDO',
  }[estado]

  if (cargando) return <div className="inv-empty">Cargando...</div>

  return (
    <>
      {/* Topbar con breadcrumb */}
      <div className="cpf-topbar">
        <div className="cpf-breadcrumb">
          <span>Admin</span>
          <span>›</span>
          <span>Cupones</span>
          <span>›</span>
          <span>{modoEditar ? 'Editar' : 'Nuevo'}</span>
        </div>
        <div className="pf-topbar">
          <button
            className="pf-back-btn"
            type="button"
            onClick={() => navigate('/admin/cupones')}
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
            {modoEditar ? 'Editar Cupón' : 'Añadir Cupón'}
          </h1>
          <div className="pf-topbar-right">
            <button
              className="button secondary"
              type="button"
              onClick={() => navigate('/admin/cupones')}
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
                : 'Guardar Cupón'}
            </button>
          </div>
        </div>
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
                  d="M5.5 3A2.5 2.5 0 0 0 3 5.5v2.879a2.5 2.5 0 0 0 .732 1.767l6.5 6.5a2.5 2.5 0 0 0 3.536 0l2.878-2.878a2.5 2.5 0 0 0 0-3.536l-6.5-6.5A2.5 2.5 0 0 0 8.38 3H5.5zM6 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"
                  clipRule="evenodd"
                />
              </svg>
              <h2 className="pf-card-title">Información General</h2>
            </div>

            <div className="cpf-info-row">
              <div className="pf-field" style={{ flex: 1 }}>
                <label className="pf-label" htmlFor="cpf-codigo">
                  Código del Cupón <span aria-hidden="true">*</span>
                </label>
                <input
                  id="cpf-codigo"
                  className="pf-input"
                  type="text"
                  placeholder="Ej: WINTER25"
                  value={form.codigo}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      codigo: e.target.value.toUpperCase(),
                    }))
                  }
                  autoFocus={!modoEditar}
                  style={{ textTransform: 'uppercase', fontFamily: 'monospace', letterSpacing: '0.05em' }}
                />
              </div>
              <div className="pf-field cpf-estado-field">
                <label className="pf-label">Estado</label>
                <label className="cup-toggle-label" style={{ paddingTop: '0.55rem' }}>
                  <input
                    type="checkbox"
                    className="cup-toggle-input"
                    checked={form.activo}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, activo: e.target.checked }))
                    }
                  />
                  <span className="cup-toggle-track">
                    <span className="cup-toggle-thumb" />
                  </span>
                  <span className="cup-toggle-text">
                    {form.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Configuración */}
          <div className="pf-card">
            <div className="pf-card-header">
              <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                <path
                  fillRule="evenodd"
                  d="M7.84 1.804A1 1 0 0 1 8.82 1h2.36a1 1 0 0 1 .98.804l.331 1.652a6.993 6.993 0 0 1 1.929 1.115l1.598-.54a1 1 0 0 1 1.186.447l1.18 2.044a1 1 0 0 1-.205 1.251l-1.267 1.113a7.047 7.047 0 0 1 0 2.228l1.267 1.113a1 1 0 0 1 .206 1.25l-1.18 2.045a1 1 0 0 1-1.187.447l-1.598-.54a6.993 6.993 0 0 1-1.929 1.115l-.33 1.652a1 1 0 0 1-.98.804H8.82a1 1 0 0 1-.98-.804l-.331-1.652a6.993 6.993 0 0 1-1.929-1.115l-1.598.54a1 1 0 0 1-1.186-.447l-1.18-2.044a1 1 0 0 1 .205-1.251l1.267-1.114a7.05 7.05 0 0 1 0-2.227L1.821 7.773a1 1 0 0 1-.206-1.25l1.18-2.045a1 1 0 0 1 1.187-.447l1.598.54A6.992 6.992 0 0 1 7.51 3.456l.33-1.652zM10 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"
                  clipRule="evenodd"
                />
              </svg>
              <h2 className="pf-card-title">Configuración</h2>
            </div>

            <div className="pf-var-row">
              <div className="pf-field">
                <label className="pf-label" htmlFor="cpf-tipo">
                  Tipo de Descuento
                </label>
                <select
                  id="cpf-tipo"
                  className="pf-select"
                  value={form.tipo}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, tipo: e.target.value }))
                  }
                >
                  <option value="PORCENTAJE">Porcentaje (%)</option>
                  <option value="MONTO_FIJO">Monto Fijo (AR$)</option>
                </select>
              </div>
              <div className="pf-field">
                <label className="pf-label" htmlFor="cpf-valor">
                  Valor <span aria-hidden="true">*</span>
                </label>
                <div className="pf-input-affix">
                  <span className="pf-affix">
                    {form.tipo === 'PORCENTAJE' ? '%' : 'AR$'}
                  </span>
                  <input
                    id="cpf-valor"
                    className="pf-input with-affix"
                    type="number"
                    min="0.01"
                    step="0.01"
                    max={form.tipo === 'PORCENTAJE' ? '100' : undefined}
                    placeholder={form.tipo === 'PORCENTAJE' ? '15' : '500'}
                    value={form.valor}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, valor: e.target.value }))
                    }
                  />
                </div>
              </div>
            </div>

            <div className="pf-var-row">
              <div className="pf-field">
                <label className="pf-label" htmlFor="cpf-uso-max">
                  Límite Total de Usos
                </label>
                <input
                  id="cpf-uso-max"
                  className="pf-input"
                  type="number"
                  min="1"
                  step="1"
                  placeholder="Sin límite"
                  value={form.usoMaximo}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, usoMaximo: e.target.value }))
                  }
                />
              </div>
              <div className="pf-field">
                <label className="pf-label" htmlFor="cpf-minimo">
                  Monto Mínimo de Compra
                </label>
                <div className="pf-input-affix">
                  <span className="pf-affix">AR$</span>
                  <input
                    id="cpf-minimo"
                    className="pf-input with-affix"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Sin mínimo"
                    value={form.montoMinimo}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, montoMinimo: e.target.value }))
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Vigencia */}
          <div className="pf-card">
            <div className="pf-card-header">
              <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                <path
                  fillRule="evenodd"
                  d="M5.75 2a.75.75 0 0 1 .75.75V4h7V2.75a.75.75 0 0 1 1.5 0V4h.25A2.75 2.75 0 0 1 18 6.75v8.5A2.75 2.75 0 0 1 15.25 18H4.75A2.75 2.75 0 0 1 2 15.25v-8.5A2.75 2.75 0 0 1 4.75 4H5V2.75A.75.75 0 0 1 5.75 2zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75z"
                  clipRule="evenodd"
                />
              </svg>
              <h2 className="pf-card-title">Vigencia</h2>
            </div>

            <div className="pf-var-row">
              <div className="pf-field">
                <label className="pf-label" htmlFor="cpf-inicio">
                  Fecha de Inicio <span aria-hidden="true">*</span>
                </label>
                <input
                  id="cpf-inicio"
                  className="pf-input"
                  type="date"
                  value={form.fechaInicio}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, fechaInicio: e.target.value }))
                  }
                />
              </div>
              <div className="pf-field">
                <label className="pf-label" htmlFor="cpf-fin">
                  Fecha de Finalización
                </label>
                <input
                  id="cpf-fin"
                  className="pf-input"
                  type="date"
                  min={form.fechaInicio || undefined}
                  value={form.fechaFin}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, fechaFin: e.target.value }))
                  }
                />
              </div>
            </div>
          </div>

          {error && <p className="pf-error">{error}</p>}
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

            <div className="cpf-preview-card">
              <div className="cpf-preview-brand">Coyote Uniformes</div>
              <div className="cpf-preview-code">{codigoDisplay}</div>
              <div className="cpf-preview-valid">
                <svg viewBox="0 0 16 16" fill="currentColor" width="12" height="12">
                  <path
                    fillRule="evenodd"
                    d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207z"
                    clipRule="evenodd"
                  />
                </svg>
                Válido en toda la tienda
              </div>
              <div className="cpf-preview-ahorra">{descuentoDisplay}</div>
            </div>

            <div className="cpf-stats">
              <div className="cpf-stat-row">
                <span className="cpf-stat-label">Estado</span>
                <span className={`cpf-estado-badge ${estado}`}>
                  {estadoLabel}
                </span>
              </div>
              <div className="cpf-stat-row">
                <span className="cpf-stat-label">Tipo</span>
                <span className="cpf-stat-value">
                  {form.tipo === 'PORCENTAJE' ? 'Porcentaje' : 'Monto Fijo'}
                </span>
              </div>
              <div className="cpf-stat-row">
                <span className="cpf-stat-label">Usos Permitidos</span>
                <span className="cpf-stat-value">
                  {form.usoMaximo || 'Ilimitados'}
                </span>
              </div>
            </div>
          </div>

          {/* Tip */}
          <div className="cpf-tip-card">
            <svg
              className="cpf-tip-icon"
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
              Este cupón se aplicará al finalizar la compra. Asegurate de que
              las fechas de vigencia sean correctas para evitar errores de
              redención.
            </span>
          </div>
        </div>
      </div>
    </>
  )
}
