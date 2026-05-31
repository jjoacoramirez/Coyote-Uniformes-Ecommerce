import { useState } from 'react'
import { formatPrice } from '../data/products.js'
import TabGroup from './TabGroup.jsx'

function ProductDetail({ product, onAddToCart }) {
  const [selectedSize, setSelectedSize] = useState(product.sizes[1] ?? product.sizes[0])

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
        <strong className="price">{formatPrice(product.price)}</strong>

        <div className="size-header">
          <span>Talle</span>
          <button type="button">Guia de talles</button>
        </div>
        <div className="size-options">
          {product.sizes.map((size) => (
            <button
              key={size}
              type="button"
              className={selectedSize === size ? 'selected' : ''}
              onClick={() => setSelectedSize(size)}
            >
              {size}
            </button>
          ))}
        </div>

        <button className="button primary full" type="button" onClick={() => onAddToCart(product)}>
          Agregar al carrito
        </button>

        <TabGroup product={product} />
      </div>
    </section>
  )
}

export default ProductDetail
