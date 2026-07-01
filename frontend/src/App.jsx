import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, Route, Routes } from 'react-router-dom'
import { fetchCarrito, clearCarrito } from './store/slices/carritoSlice.js'
import { restoreSession } from './store/slices/authSlice.js'
import AdminLayout from './pages/admin/AdminLayout.jsx'
import UserAccount from './pages/UserAccount.jsx'
import AdminCategorias from './pages/admin/AdminCategorias.jsx'
import AdminCategoriaForm from './pages/admin/AdminCategoriaForm.jsx'
import AdminCupones from './pages/admin/AdminCupones.jsx'
import AdminCuponForm from './pages/admin/AdminCuponForm.jsx'
import AdminProductoForm from './pages/admin/AdminProductoForm.jsx'
import AdminProductos from './pages/admin/AdminProductos.jsx'
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
  const dispatch = useDispatch()
  const user = useSelector((s) => s.auth.user)

  useEffect(() => {
    dispatch(restoreSession())
  }, [dispatch])

  // Sincroniza el carrito con la sesion: al loguearse lo trae del backend,
  // al desloguearse lo limpia (lo que antes hacia CartContext).
  useEffect(() => {
    if (user) {
      dispatch(fetchCarrito())
    } else {
      dispatch(clearCarrito())
    }
  }, [user, dispatch])

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
      <Route path="/mi-cuenta" element={<UserAccount />} />

      <Route
        path="/admin"
        element={
          <ProtectedRoute role="admin">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="productos" replace />} />
        <Route path="productos" element={<AdminProductos />} />
        <Route path="productos/nuevo" element={<AdminProductoForm />} />
        <Route path="productos/:id/editar" element={<AdminProductoForm />} />
        <Route path="categorias" element={<AdminCategorias />} />
        <Route path="categorias/nuevo" element={<AdminCategoriaForm />} />
        <Route path="categorias/:id/editar" element={<AdminCategoriaForm />} />
        <Route path="cupones" element={<AdminCupones />} />
        <Route path="cupones/nuevo" element={<AdminCuponForm />} />
        <Route path="cupones/:id/editar" element={<AdminCuponForm />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
