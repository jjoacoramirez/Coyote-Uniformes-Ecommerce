import { useState } from 'react'
import { formatPrice } from '../data/products.js'
import { useCart } from '../context/CartContext.jsx'
import TabGroup from './TabGroup.jsx'

function ProductDetail({ product, onAddToCart }) {
  const { addToCart } = useCart()
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] ?? '')

  const varianteActual = product.variantes?.find(v => v.talle === selectedSize)
  const precio = varianteActual?.precio ?? product.price

  return (
    <section className="product-detail">
      <div className="product-gallery">
        <div className="thumbnail">
          <img src={product.image} alt="" />
        </div>
        <div className="main-product-image">
          <span className={`badge ${product.category}`}>{product.categoryLabel}</span>
          <img src={product.image} alt={product.name} />
        </div>
      </div>

      <div className="product-info">
        <span className="breadcrumb">Home / {product.categoryLabel} / {product.name}</span>
        <h1>{product.name}</h1>
        <p className="muted">{product.categoryLabel} / Esencial institucional</p>
        <strong className="price">{formatPrice(precio)}</strong>

        <div className="size-header">
          <span>Talle</span>
          <button type="button">Guia de talles</button>
        </div>

        {product.sizes.length > 0 ? (
          <select
            className="size-select"
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
          >
            {product.sizes.map((size) => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        ) : (
          <select className="size-select" disabled>
            <option>Sin talles disponibles</option>
          </select>
        )}

        <button className="button primary full" type="button" onClick={() => { addToCart(product, varianteActual); onAddToCart(product, varianteActual) }}>
          Agregar al carrito
        </button>

        <TabGroup product={product} />
      </div>
    </section>
  )
}

export default ProductDetail
