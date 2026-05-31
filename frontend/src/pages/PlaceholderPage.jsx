import { Link } from 'react-router-dom'
import Layout from '../components/Layout.jsx'

const copy = {
  login: {
    title: 'Login',
    text: 'Vista pendiente para el bloque de autenticacion.',
  },
  carrito: {
    title: 'Carrito',
    text: 'Vista pendiente para el bloque de checkout.',
  },
  contacto: {
    title: 'Contacto',
    text: 'Vista pendiente para el bloque institucional.',
  },
}

function PlaceholderPage({ type }) {
  const content = copy[type]

  return (
    <Layout>
      <section className="not-found">
        <p className="eyebrow">Pendiente de integracion</p>
        <h1>{content.title}</h1>
        <p>{content.text}</p>
        <Link className="button primary" to="/productos">
          Volver al catalogo
        </Link>
      </section>
    </Layout>
  )
}

export default PlaceholderPage
