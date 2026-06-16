import { useState } from 'react'

const tabs = [
  { id: 'description', label: 'Descripcion' },
  { id: 'details', label: 'Detalles' },
  { id: 'care', label: 'Cuidados' },
]

function TabGroup({ product }) {
  const [activeTab, setActiveTab] = useState('description')

  const content = {
    description: product.description,
    details: product.details,
    care: product.care,
  }

  return (
    <section className="tab-panel">
      <div className="tab-list" role="tablist" aria-label="Informacion del producto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={activeTab === tab.id ? 'active' : ''}
            onClick={() => setActiveTab(tab.id)}
            role="tab"
            aria-selected={activeTab === tab.id}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <p>{content[activeTab]}</p>
      <ul className="feature-list">
        <li>Terminacion resistente a manchas leves.</li>
        <li>Costuras reforzadas para conservar la forma.</li>
        <li>Interior suave para uso prolongado.</li>
      </ul>
    </section>
  )
}

export default TabGroup
