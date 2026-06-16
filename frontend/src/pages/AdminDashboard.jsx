import Layout from '../components/Layout.jsx'
import { products, formatPrice } from '../data/products.js'

const orders = [
  { id: 'CU-1027', client: 'Colegio San Martin', status: 'Pagado', total: 72500 },
  { id: 'CU-1028', client: 'Clinica Norte', status: 'En preparacion', total: 163000 },
  { id: 'CU-1029', client: 'Estudio Florida', status: 'Pendiente', total: 128000 },
]

function AdminDashboard() {
  return (
    <Layout>
      <section className="admin-page">
        <div className="admin-heading">
          <div>
            <p className="eyebrow">Administrador</p>
            <h1>Panel de gestion</h1>
          </div>
          <button className="button primary" type="button">
            Nuevo producto
          </button>
        </div>

        <div className="metric-grid">
          <article>
            <span>Ventas del mes</span>
            <strong>$ 1.284.000</strong>
          </article>
          <article>
            <span>Pedidos activos</span>
            <strong>18</strong>
          </article>
          <article>
            <span>Productos publicados</span>
            <strong>{products.length}</strong>
          </article>
        </div>

        <div className="admin-grid">
          <section className="admin-panel">
            <h2>Productos</h2>
            <table>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Categoria</th>
                  <th>Precio</th>
                  <th>Stock</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.name}</td>
                    <td>{product.categoryLabel}</td>
                    <td>{formatPrice(product.price)}</td>
                    <td>Disponible</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section className="admin-panel">
            <h2>Pedidos recientes</h2>
            <table>
              <thead>
                <tr>
                  <th>Pedido</th>
                  <th>Cliente</th>
                  <th>Estado</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{order.client}</td>
                    <td>{order.status}</td>
                    <td>{formatPrice(order.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </div>
      </section>
    </Layout>
  )
}

export default AdminDashboard
