import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from './context/useAuth'
import Layout from './components/Layout'
import Loading from './components/Loading'
import Ask from './pages/Ask'
import Home from './pages/Home'
import Login from './pages/Login'
import QuestionDetail from './pages/QuestionDetail'
import Register from './pages/Register'
import './App.css'

function ProtectedRoute({ children }) {
  const { user, isLoading } = useAuth()

  if (isLoading) return <Loading label="Checking authentication..." />
  return user ? children : <Navigate to="/login" replace />
}

function PublicRoute({ children }) {
  const { user, isLoading } = useAuth()

  if (isLoading) return <Loading label="Checking authentication..." />
  return user ? <Navigate to="/" replace /> : children
}

function ProtectedLayout({ children }) {
  return <Layout>{children}</Layout>
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
      <Route path="/" element={<Layout><Home /></Layout>} />
      <Route path="/ask" element={<ProtectedRoute><ProtectedLayout><Ask /></ProtectedLayout></ProtectedRoute>} />
      <Route path="/questions/:questionid" element={<ProtectedRoute><ProtectedLayout><QuestionDetail /></ProtectedLayout></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
