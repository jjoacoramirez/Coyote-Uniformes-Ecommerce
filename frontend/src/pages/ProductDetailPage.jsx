import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Layout from '../components/Layout.jsx'
import ProductDetail from '../components/ProductDetail.jsx'
import ToastNotif from '../components/ToastNotif.jsx'
import { fetchProductoById } from '../store/slices/productosSlice.js'
import { fetchVariantesByProducto } from '../store/slices/variantesSlice.js'
import { toProductShape } from '../utils/catalog.js'

function ProductDetailPage() {
  const { productId } = useParams()
  const [toast, setToast] = useState('')
  const dispatch = useDispatch()

  const producto = useSelector((s) => s.productos.byId[productId])
  const byIdStatus = useSelector((s) => s.productos.byIdStatus[productId])
  const variantes = useSelector((s) => s.variantes.byProducto[productId])
  const variantesStatus = useSelector((s) => s.variantes.statusByProducto[productId])

  // GET una sola vez por id (cache en el store).
  useEffect(() => {
    if (!producto && byIdStatus !== 'loading' && byIdStatus !== 'failed') {
      dispatch(fetchProductoById(productId))
    }
  }, [productId, producto, byIdStatus, dispatch])

  // Las variantes son no-criticas: si fallan, el producto igual carga.
  useEffect(() => {
    if (variantes === undefined && variantesStatus !== 'loading' && variantesStatus !== 'failed') {
      dispatch(fetchVariantesByProducto(productId))
    }
  }, [productId, variantes, variantesStatus, dispatch])

  const product = useMemo(
    () => (producto ? toProductShape(producto, variantes ?? []) : null),
    [producto, variantes]
  )

  const handleAddToCart = (selectedProduct, _selectedVariant, errorMessage) => {
    setToast(errorMessage || `${selectedProduct.name} agregado al carrito`)
  }

  const notFound = byIdStatus === 'failed'
  const loading = !product && !notFound

  if (loading) {
    return (
      <Layout>
        <section className="not-found">
          <p>Cargando producto...</p>
        </section>
      </Layout>
    )
  }

  if (notFound || !product) {
    return (
      <Layout>
        <section className="not-found">
          <h1>Producto no encontrado</h1>
          <Link className="button primary" to="/productos">
            Volver al catalogo
          </Link>
        </section>
      </Layout>
    )
  }

  return (
    <Layout>
      <ToastNotif message={toast} />
      <ProductDetail product={product} onAddToCart={handleAddToCart} />
    </Layout>
  )
}

export default ProductDetailPage
