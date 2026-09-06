import Footer from './Footer'
import Header from './Header'

function Layout({ children }) {
  return (
    <div className="app-shell">
      <Header />
      <main className="site-main">{children}</main>
      <Footer />
    </div>
  )
}

export default Layout
