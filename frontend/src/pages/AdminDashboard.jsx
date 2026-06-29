import { useEffect, useState } from 'react'
import Layout from '../components/Layout.jsx'
import { api } from '../services/api.js'
import { formatPrice } from '../utils/format.js'

function AdminDashboard() {
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([api.get('/productos/admin'), api.get('/pedidos')])
      .then(([productosData, pedidosData]) => {
        setProducts(productosData)
        setOrders(pedidosData)
      })
      .catch(() => setError('No se pudieron cargar los datos del panel.'))
  }, [])

  const totalVentas = orders.reduce((acc, order) => acc + Number(order.total ?? 0), 0)
  const activeOrders = orders.filter((order) => order.estado !== 'FINALIZADO').length

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
            <span>Ventas registradas</span>
            <strong>{formatPrice(totalVentas)}</strong>
          </article>
          <article>
            <span>Pedidos activos</span>
            <strong>{activeOrders}</strong>
          </article>
          <article>
            <span>Productos publicados</span>
            <strong>{products.length}</strong>
          </article>
        </div>

        {error && <p className="form-error">{error}</p>}

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
                  <tr key={product.idProducto}>
                    <td>{product.nombre}</td>
                    <td>{product.categoriaNombre}</td>
                    <td>{formatPrice(product.precioBase)}</td>
                    <td>{product.stockTotal}</td>
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
                  <tr key={order.idPedido}>
                    <td>#{order.idPedido}</td>
                    <td>Cliente {order.idCliente}</td>
                    <td>{order.estado}</td>
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
