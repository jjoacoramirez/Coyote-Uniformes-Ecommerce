import { Link } from 'react-router-dom'

function CategoryCard({ category }) {
  return (
    <Link className="category-card" to={`/productos?categoria=${encodeURIComponent(category.id)}`}>
      <img src={category.image} alt="" />
      <span>{category.title}</span>
      <h3>{category.title}</h3>
      <p>{category.subtitle}</p>
    </Link>
  )
}

export default CategoryCard
