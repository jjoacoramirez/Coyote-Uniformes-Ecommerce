import Footer from './Footer.jsx'
import Header from './Header.jsx'

function Layout({ children }) {
  return (
    <div className="app-shell">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  )
}

export default Layout
