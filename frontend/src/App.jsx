import { Navigate, Route, Routes } from 'react-router-dom'
import AdminDashboard from './pages/AdminDashboard.jsx'
import Cart from './pages/Cart.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Confirmation from './pages/Confirmation.jsx'
import Contact from './pages/Contact.jsx'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Payment from './pages/Payment.jsx'
import Products from './pages/Products.jsx'
import ProductDetailPage from './pages/ProductDetailPage.jsx'
import Register from './pages/Register.jsx'
import Shipping from './pages/Shipping.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/productos" element={<Products />} />
      <Route path="/productos/:productId" element={<ProductDetailPage />} />
      <Route path="/carrito" element={<Cart />} />
      <Route path="/checkout/envio" element={<Shipping />} />
      <Route path="/checkout/pago" element={<Payment />} />
      <Route path="/checkout/confirmacion" element={<Confirmation />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/contacto" element={<Contact />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute role="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
