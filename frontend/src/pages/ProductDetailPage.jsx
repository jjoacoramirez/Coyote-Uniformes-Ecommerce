import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Layout from '../components/Layout.jsx'
import ProductDetail from '../components/ProductDetail.jsx'
import ToastNotif from '../components/ToastNotif.jsx'
import { api } from '../services/api.js'
import { toProductShape } from '../utils/catalog.js'

function ProductDetailPage() {
  const { productId } = useParams()
  const [toast, setToast] = useState('')
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    api.get(`/productos/${productId}`)
      .then(async (productoData) => {
        if (!productoData) {
          setNotFound(true)
          return
        }
        let variantes = []
        try {
          variantes = (await api.get(`/variantes/producto/${productId}`)) ?? []
        } catch {
          // Si las variantes no están disponibles el producto igual carga
        }
        setProduct(toProductShape(productoData, variantes))
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [productId])

  const handleAddToCart = (selectedProduct, _selectedVariant, errorMessage) => {
    setToast(errorMessage || `${selectedProduct.name} agregado al carrito`)
  }

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
