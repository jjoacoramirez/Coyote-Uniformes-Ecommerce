import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Layout from '../components/Layout.jsx'
import ProductCard from '../components/ProductCard.jsx'
import ToastNotif from '../components/ToastNotif.jsx'
import { products } from '../data/products.js'

const categoryFilters = [
  { id: 'all', label: 'Todas' },
  { id: 'colegial', label: 'Escolar' },
  { id: 'profesional', label: 'Profesional' },
  { id: 'medico', label: 'Medico' },
]

const sizeFilters = ['XS', 'S', 'M', 'L', 'XL']

function Products() {
  const [searchParams] = useSearchParams()
  const initialCategory = searchParams.get('categoria') ?? 'all'
  const [category, setCategory] = useState(initialCategory)
  const [size, setSize] = useState('all')
  const [sort, setSort] = useState('relevance')
  const [toast, setToast] = useState('')
  const navigate = useNavigate()

  const filteredProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      const matchesCategory = category === 'all' || product.category === category
      const matchesSize = size === 'all' || product.sizes.includes(size)
      return matchesCategory && matchesSize
    })

    if (sort === 'price-asc') {
      return [...filtered].sort((a, b) => a.price - b.price)
    }

    if (sort === 'price-desc') {
      return [...filtered].sort((a, b) => b.price - a.price)
    }

    return filtered
  }, [category, size, sort])

  const handleAdd = (product) => {
    setToast(`${product.name} requiere iniciar sesion`)
    window.setTimeout(() => navigate('/login'), 900)
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

          <div className="filter-group">
            <span>Talla</span>
            <div className="size-filter-row">
              <button
                type="button"
                className={size === 'all' ? 'selected' : ''}
                onClick={() => setSize('all')}
              >
                Todas
              </button>
              {sizeFilters.map((value) => (
                <button
                  type="button"
                  key={value}
                  className={size === value ? 'selected' : ''}
                  onClick={() => setSize(value)}
                >
                  {value}
                </button>
              ))}
            </div>
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
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} onAdd={handleAdd} />
            ))}
          </div>
        </section>
      </section>
    </Layout>
  )
}

export default Products
