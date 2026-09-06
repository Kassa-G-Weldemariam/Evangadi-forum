import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link className="brand" to="/" aria-label="Evangadi Forum home">
          Evangadi Forum
        </Link>
        <nav className="site-nav" aria-label="Primary navigation">
          {user ? (
            <>
              <Link to="/ask">Ask Question</Link>
              <span className="user-greeting">Hello, {user.username}</span>
              <button className="button button--secondary" type="button" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link className="button" to="/register">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Header
