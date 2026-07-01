import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { enviarContacto, resetContacto } from '../store/slices/contactoSlice.js'

const MOTIVOS = ['Uniformes escolares', 'Uniformes medicos', 'Compra mayorista']

function Formulario() {
  const [campos, setCampos] = useState({
    nombre: '',
    correo: '',
    motivo: MOTIVOS[0],
    mensaje: '',
  })
  const [enviado, setEnviado] = useState(false)
  const [nombreEnviado, setNombreEnviado] = useState('')

  const dispatch = useDispatch()
  const { status, error } = useSelector((s) => s.contacto)
  const enviando = status === 'loading'

  useEffect(() => {
    if (status === 'succeeded') {
      setEnviado(true)
      setCampos({ nombre: '', correo: '', motivo: MOTIVOS[0], mensaje: '' })
      dispatch(resetContacto())
    }
  }, [status, dispatch])

  function handleChange(e) {
    const { name, value } = e.target
    setCampos(prev => ({ ...prev, [name]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    setNombreEnviado(campos.nombre)
    dispatch(enviarContacto(campos))
  }

  if (enviado) {
    return (
      <div className="form-panel">
        <h2>Mensaje enviado</h2>
        <p>Gracias, <strong>{nombreEnviado || 'usuario'}</strong>. Te contactamos a la brevedad.</p>
        <button className="button primary" type="button" onClick={() => setEnviado(false)}>
          Enviar otro mensaje
        </button>
      </div>
    )
  }

  return (
    <form className="form-panel" onSubmit={handleSubmit}>
      <h2>Envianos un mensaje</h2>
      <div className="form-grid">
        <label>
          Nombre
          <input
            name="nombre"
            value={campos.nombre}
            onChange={handleChange}
            placeholder="Tu nombre"
            required
          />
        </label>
        <label>
          Correo
          <input
            name="correo"
            type="email"
            value={campos.correo}
            onChange={handleChange}
            placeholder="mail@empresa.com"
            required
          />
        </label>
        <label className="wide">
          Motivo de consulta
          <select name="motivo" value={campos.motivo} onChange={handleChange}>
            {MOTIVOS.map(m => <option key={m}>{m}</option>)}
          </select>
        </label>
        <label className="wide">
          Mensaje
          <textarea
            name="mensaje"
            value={campos.mensaje}
            onChange={handleChange}
            placeholder="Contanos que necesitas"
            required
          />
        </label>
      </div>
      {error && <p className="form-error">{error}</p>}
      <button className="button primary" type="submit" disabled={enviando}>
        {enviando ? 'Enviando...' : 'Enviar mensaje'}
      </button>
    </form>
  )
}

export default Formulario
