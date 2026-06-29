import { useEffect, useState } from 'react'
import CategoryCard from '../components/CategoryCard.jsx'
import HeroBanner from '../components/HeroBanner.jsx'
import Layout from '../components/Layout.jsx'
import { api } from '../services/api.js'
import { toCategoryShape } from '../utils/catalog.js'

function Home() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/categorias')
      .then((categoriasData) => {
        setCategories(categoriasData.map(toCategoryShape))
      })
      .catch(() => setError('No se pudieron cargar las colecciones.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <Layout>
      <HeroBanner />

      <section className="section">
        <div className="section-heading">
          <p className="eyebrow">Colecciones</p>
          <h2>Colecciones destacadas</h2>
          <p>Lineas pensadas para instituciones medicas, colegios y equipos profesionales.</p>
        </div>

        <div className="category-grid">
          {loading && <p>Cargando colecciones...</p>}
          {error && <p className="form-error">{error}</p>}
          {!loading && !error && categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      <section className="section value-section">
        <div className="value-copy">
          <p className="eyebrow">Detalles que marcan la diferencia</p>
          <h2>Calidad pensada para uso real</h2>
          <div className="value-list">
            <article>
              <span>01</span>
              <h3>Telas Premium</h3>
              <p>Materiales resistentes que conservan forma, color y comodidad.</p>
            </article>
            <article>
              <span>02</span>
              <h3>Ajuste Profesional</h3>
              <p>Prendas diseñadas para moverse bien sin perder presencia.</p>
            </article>
            <article>
              <span>03</span>
              <h3>Identidad de Equipo</h3>
              <p>Terminaciones y bordados que acompañan la imagen institucional.</p>
            </article>
          </div>
        </div>
      </section>
    </Layout>
  )
}

export default Home
