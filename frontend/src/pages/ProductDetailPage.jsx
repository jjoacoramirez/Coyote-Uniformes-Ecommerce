import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Layout from '../components/Layout.jsx'
import ProductDetail from '../components/ProductDetail.jsx'
import ToastNotif from '../components/ToastNotif.jsx'
import { products } from '../data/products.js'

function ProductDetailPage() {
  const { productId } = useParams()
  const [toast, setToast] = useState('')
  const product = products.find((item) => item.id === productId)

  const handleAddToCart = (selectedProduct) => {
    setToast(`${selectedProduct.name} agregado al carrito`)
  }

  if (!product) {
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
