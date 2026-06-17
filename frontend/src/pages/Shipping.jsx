import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Layout from '../components/Layout.jsx'
import OrderSummary from '../components/OrderSummary.jsx'
import Stepper from '../components/Stepper.jsx'

const initialForm = {
  fullName: '',
  email: '',
  phone: '',
  postalCode: '',
  province: '',
  city: '',
  address: '',
  apartment: '',
}

function Shipping() {
  const navigate = useNavigate()
  const [method, setMethod] = useState('Retiro en sucursal')
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})

  function updateField(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
    setErrors(prev => ({ ...prev, [field]: '' }))
  }

  function validate() {
    const nextErrors = {}
    const requiredFields = {
      fullName: 'Ingresa nombre y apellido.',
      email: 'Ingresa un correo electronico.',
      phone: 'Ingresa un telefono.',
      postalCode: 'Ingresa el codigo postal.',
      province: 'Selecciona una provincia.',
      city: 'Ingresa la ciudad.',
      address: 'Ingresa la direccion.',
    }

    Object.entries(requiredFields).forEach(([field, message]) => {
      if (!form[field].trim()) nextErrors[field] = message
    })

    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      nextErrors.email = 'Ingresa un correo electronico valido.'
    }

    if (form.phone.trim() && form.phone.replace(/\D/g, '').length < 8) {
      nextErrors.phone = 'Ingresa un telefono valido.'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return
    navigate('/checkout/pago')
  }

  return (
    <Layout>
      <section className="checkout-page">
        <Stepper activeStep={1} />
        <div className="checkout-grid">
          <form className="checkout-main form-panel" onSubmit={handleSubmit} noValidate>
            <Link className="checkout-back-link" to="/carrito">
              Volver al carrito
            </Link>
            <h1>Envio</h1>
            <div className="form-grid">
              <label>
                Nombre completo
                <input
                  value={form.fullName}
                  onChange={(e) => updateField('fullName', e.target.value)}
                  placeholder="Nombre y apellido"
                  aria-invalid={Boolean(errors.fullName)}
                />
                {errors.fullName && <span className="field-error">{errors.fullName}</span>}
              </label>
              <label>
                Correo electronico
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  placeholder="correo@empresa.com"
                  aria-invalid={Boolean(errors.email)}
                />
                {errors.email && <span className="field-error">{errors.email}</span>}
              </label>
              <label>
                Telefono
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  placeholder="+54 11 4000 0000"
                  aria-invalid={Boolean(errors.phone)}
                />
                {errors.phone && <span className="field-error">{errors.phone}</span>}
              </label>
              <label>
                Codigo postal
                <input
                  value={form.postalCode}
                  onChange={(e) => updateField('postalCode', e.target.value)}
                  placeholder="Codigo postal"
                  aria-invalid={Boolean(errors.postalCode)}
                />
                {errors.postalCode && <span className="field-error">{errors.postalCode}</span>}
              </label>
              <label>
                Provincia
                <select
                  value={form.province}
                  onChange={(e) => updateField('province', e.target.value)}
                  aria-invalid={Boolean(errors.province)}
                >
                  <option value="" disabled>Seleccionar provincia</option>
                  <option>Buenos Aires</option>
                  <option>CABA</option>
                </select>
                {errors.province && <span className="field-error">{errors.province}</span>}
              </label>
              <label>
                Ciudad
                <input
                  value={form.city}
                  onChange={(e) => updateField('city', e.target.value)}
                  placeholder="Ciudad"
                  aria-invalid={Boolean(errors.city)}
                />
                {errors.city && <span className="field-error">{errors.city}</span>}
              </label>
              <label className="wide">
                Direccion
                <input
                  value={form.address}
                  onChange={(e) => updateField('address', e.target.value)}
                  placeholder="Calle y numero"
                  aria-invalid={Boolean(errors.address)}
                />
                {errors.address && <span className="field-error">{errors.address}</span>}
              </label>
              <label>
                Piso / Depto
                <input
                  value={form.apartment}
                  onChange={(e) => updateField('apartment', e.target.value)}
                  placeholder="Opcional"
                />
              </label>
            </div>

            <h2>Metodo de envio</h2>
            <div className="method-grid">
              {['Envio a domicilio', 'Retiro en sucursal'].map((option) => (
                <button
                  key={option}
                  type="button"
                  className={method === option ? 'selected' : ''}
                  onClick={() => setMethod(option)}
                >
                  <strong>{option}</strong>
                  <span>{option === 'Retiro en sucursal' ? 'Gratis' : '$4.500 / 3-5 dias'}</span>
                </button>
              ))}
            </div>
          </form>

          <OrderSummary ctaLabel="Proceder al pago" onCtaClick={handleSubmit} />
        </div>
      </section>
    </Layout>
  )
}

export default Shipping
