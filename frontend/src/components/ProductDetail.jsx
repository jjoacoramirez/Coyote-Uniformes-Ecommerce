import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { formatPrice } from '../data/products.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useCart } from '../context/CartContext.jsx'
import TabGroup from './TabGroup.jsx'

function unique(arr) {
  return [...new Set(arr.filter(Boolean))]
}

function ProductDetail({ product, onAddToCart }) {
  const { user } = useAuth()
  const { addToCart } = useCart()
  const navigate = useNavigate()
  const variantes = product.variantes ?? []

  const talles  = unique(variantes.map(v => v.talle))
  const colores = unique(variantes.map(v => v.color))
  const hasTalles  = talles.length > 0
  const hasColores = colores.length > 0

  const [selectedTalle, setSelectedTalle]   = useState(talles[0]  ?? '')
  const [selectedColor, setSelectedColor]   = useState(colores[0] ?? '')

  // Colores disponibles para el talle seleccionado
  const coloresParaTalle = hasTalles
    ? unique(variantes.filter(v => v.talle === selectedTalle).map(v => v.color))
    : colores

  function handleTalleChange(talle) {
    setSelectedTalle(talle)
    // Si el color actual no existe para el nuevo talle, resetear al primero disponible
    const nuevosColores = unique(variantes.filter(v => v.talle === talle).map(v => v.color))
    if (hasColores && nuevosColores.length > 0 && !nuevosColores.includes(selectedColor)) {
      setSelectedColor(nuevosColores[0])
    }
  }

  const varianteActual = variantes.find(v => {
    const okTalle = !hasTalles || v.talle === selectedTalle
    const okColor = !hasColores || v.color === selectedColor
    return okTalle && okColor
  }) ?? variantes[0]

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

        <div className="variant-selects">
          {hasTalles && (
            <div className="variant-select-group">
              <div className="size-header">
                <span>Talle</span>
                <button type="button">Guia de talles</button>
              </div>
              <select
                className="size-select"
                value={selectedTalle}
                onChange={e => handleTalleChange(e.target.value)}
              >
                {talles.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          )}

          {hasColores && (
            <div className="variant-select-group">
              <div className="size-header">
                <span>Color</span>
              </div>
              <select
                className="size-select"
                value={selectedColor}
                onChange={e => setSelectedColor(e.target.value)}
              >
                {coloresParaTalle.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          )}

          {!hasTalles && !hasColores && (
            <select className="size-select" disabled>
              <option>Sin variantes disponibles</option>
            </select>
          )}
        </div>

        <button
          className="button primary full"
          type="button"
          onClick={() => {
            if (!user) {
              navigate('/login')
              return
            }
            addToCart(product, varianteActual)
            onAddToCart(product, varianteActual)
          }}
        >
          Agregar al carrito
        </button>

        <TabGroup product={product} />
      </div>
    </section>
  )
}

export default ProductDetail
