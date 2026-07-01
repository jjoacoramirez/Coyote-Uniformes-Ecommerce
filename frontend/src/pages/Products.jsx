import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Layout from '../components/Layout.jsx'
import ProductCard from '../components/ProductCard.jsx'
import { fetchProductos } from '../store/slices/productosSlice.js'
import { fetchCategorias } from '../store/slices/categoriasSlice.js'
import { toCategoryShape, toProductShape } from '../utils/catalog.js'

function Products() {
  const [searchParams] = useSearchParams()
  const [category, setCategory] = useState(searchParams.get('categoria') ?? 'all')
  const [sort, setSort] = useState('relevance')

  const dispatch = useDispatch()
  const { items: productosRaw, status: prodStatus, error: prodError } = useSelector((s) => s.productos)
  const { items: categoriasRaw, status: catStatus } = useSelector((s) => s.categorias)

  // GET una sola vez: si ya esta cargado en el store, no se vuelve a pedir.
  useEffect(() => {
    if (prodStatus === 'idle') dispatch(fetchProductos())
  }, [prodStatus, dispatch])
  useEffect(() => {
    if (catStatus === 'idle') dispatch(fetchCategorias())
  }, [catStatus, dispatch])

  const products = useMemo(() => productosRaw.map((p) => toProductShape(p)), [productosRaw])

  const categoryFilters = useMemo(
    () => [
      { id: 'all', label: 'Todas' },
      ...categoriasRaw.map((c) => {
        const cat = toCategoryShape(c)
        return { id: cat.id, label: cat.title }
      }),
    ],
    [categoriasRaw]
  )

  const filteredProducts = useMemo(() => {
    const filtered = products.filter((product) => category === 'all' || product.category === category)
    if (sort === 'price-asc') return [...filtered].sort((a, b) => a.price - b.price)
    if (sort === 'price-desc') return [...filtered].sort((a, b) => b.price - a.price)
    return filtered
  }, [products, category, sort])

  const loading = prodStatus === 'idle' || prodStatus === 'loading'
  const error = prodError ? 'No se pudieron cargar los productos.' : ''

  return (
    <Layout>
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
