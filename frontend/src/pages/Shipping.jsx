import { useState } from 'react'
import Layout from '../components/Layout.jsx'
import OrderSummary from '../components/OrderSummary.jsx'
import Stepper from '../components/Stepper.jsx'

function Shipping() {
  const [method, setMethod] = useState('Retiro en sucursal')

  return (
    <Layout>
      <section className="checkout-page">
        <Stepper activeStep={1} />
        <div className="checkout-grid">
          <form className="checkout-main form-panel">
            <h1>Envio</h1>
            <div className="form-grid">
              <label>
                Nombre completo
                <input defaultValue="Joaquin Ramirez" />
              </label>
              <label>
                Correo electronico
                <input defaultValue="joaquin@email.com" />
              </label>
              <label>
                Telefono
                <input defaultValue="+54 11 4000 0000" />
              </label>
              <label>
                Codigo postal
                <input defaultValue="1638" />
              </label>
              <label>
                Provincia
                <select defaultValue="Buenos Aires">
                  <option>Buenos Aires</option>
                  <option>CABA</option>
                </select>
              </label>
              <label>
                Ciudad
                <input defaultValue="Vicente Lopez" />
              </label>
              <label className="wide">
                Direccion
                <input defaultValue="Sarmiento 1728" />
              </label>
              <label>
                Piso / Depto
                <input placeholder="Opcional" />
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

          <OrderSummary ctaLabel="Proceder al pago" ctaTo="/checkout/pago" />
        </div>
      </section>
    </Layout>
  )
}

export default Shipping
