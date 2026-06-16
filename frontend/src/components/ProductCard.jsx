import { Link } from 'react-router-dom'
import { formatPrice } from '../data/products.js'

function ProductCard({ product }) {
  return (
    <article className="product-card">
      <Link to={`/productos/${product.id}`} className="product-image-link">
        <img src={product.image} alt={product.name} />
      </Link>
      <div className="product-card-body">
        <span className={`badge ${product.category}`}>{product.categoryLabel}</span>
        <Link to={`/productos/${product.id}`}>
          <h3>{product.name}</h3>
        </Link>
        <p>{formatPrice(product.price)}</p>
      </div>
    </article>
  )
}

export default ProductCard
