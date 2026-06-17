import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Layout from '../components/Layout.jsx'
import ProductCard from '../components/ProductCard.jsx'
import ToastNotif from '../components/ToastNotif.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { api } from '../services/api.js'

function toProductShape(producto) {
  const categoriaNombre = producto.categoria?.nombre ?? producto.Categoria?.nombre
  return {
    id: producto.idProducto,
    name: producto.nombre,
    image: producto.imagenUrl || 'https://placehold.co/400x300?text=Sin+imagen',
    price: producto.precioBase,
    category: categoriaNombre?.toLowerCase() ?? 'general',
    categoryLabel: categoriaNombre ?? 'General',
    sizes: [],
  }
}

function Products() {
  const [searchParams] = useSearchParams()
  const initialCategory = searchParams.get('categoria') ?? 'all'
  const [category, setCategory] = useState(initialCategory)
  const [sort, setSort] = useState('relevance')
  const [toast, setToast] = useState('')
  const [products, setProducts] = useState([])
  const [categoryFilters, setCategoryFilters] = useState([{ id: 'all', label: 'Todas' }])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { user } = useAuth()

  useEffect(() => {
    setCategory(searchParams.get('categoria') ?? 'all')
  }, [searchParams])

  useEffect(() => {
    Promise.all([api.get('/productos'), api.get('/categorias')])
      .then(([productosData, categoriasData]) => {
        const mapped = productosData.map((p) => toProductShape(p))
        setProducts(mapped)
        const filters = [
          { id: 'all', label: 'Todas' },
          ...categoriasData.map((c) => ({ id: c.nombre.toLowerCase(), label: c.nombre })),
        ]
        setCategoryFilters(filters)
      })
      .catch(() => setError('No se pudieron cargar los productos.'))
      .finally(() => setLoading(false))
  }, [])

  const filteredProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      return category === 'all' || product.category === category
    })

    if (sort === 'price-asc') {
      return [...filtered].sort((a, b) => a.price - b.price)
    }

    if (sort === 'price-desc') {
      return [...filtered].sort((a, b) => b.price - a.price)
    }

    return filtered
  }, [products, category, sort])

  const handleAdd = (product) => {
    if (!user) {
      setToast(`${product.name} requiere iniciar sesion`)
      window.setTimeout(() => navigate('/login'), 900)
      return
    }
    navigate(`/productos/${product.id}`)
  }

  return (
    <Layout>
      <ToastNotif message={toast} />
      <section className="catalog-page">
        <aside className="filters-panel">
          <h2>Catalogo</h2>
          <div className="filter-group">
            <span>Categoria</span>
            {categoryFilters.map((filter) => (
              <label key={filter.id}>
                <input
                  type="radio"
                  name="category"
                  checked={category === filter.id}
                  onChange={() => setCategory(filter.id)}
                />
                {filter.label}
              </label>
            ))}
          </div>

          <label className="filter-group">
            <span>Ordenar por</span>
            <select value={sort} onChange={(event) => setSort(event.target.value)}>
              <option value="relevance">Relevancia</option>
              <option value="price-asc">Menor precio</option>
              <option value="price-desc">Mayor precio</option>
            </select>
          </label>
        </aside>

        <section className="catalog-content">
          <span className="breadcrumb">Inicio / Productos</span>
          <div className="catalog-title-row">
            <div>
              <h1>Productos</h1>
              <p>{filteredProducts.length} productos encontrados</p>
            </div>
          </div>

          <div className="product-grid">
            {loading && <p>Cargando productos...</p>}
            {error && <p className="form-error">{error}</p>}
            {!loading && !error && filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </section>
    </Layout>
  )
}

export default Products
