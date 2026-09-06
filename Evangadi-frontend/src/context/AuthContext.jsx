import { createContext, useEffect, useMemo, useState } from 'react'
import { authApi, TOKEN_KEY } from '../api/client'

const AuthContext = createContext(null)

function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(getStoredToken)
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    const storedToken = getStoredToken()

    async function restoreSession() {
      if (!storedToken) {
        if (active) setIsLoading(false)
        return
      }

      try {
        const currentUser = await authApi.check(storedToken)
        if (active) {
          setToken(storedToken)
          setUser(currentUser)
        }
      } catch (sessionError) {
        if (active) {
          setError(sessionError.message)
          if (sessionError.status === 401) {
            localStorage.removeItem(TOKEN_KEY)
            setToken(null)
            setUser(null)
          }
        }
      } finally {
        if (active) setIsLoading(false)
      }
    }

    restoreSession()
    return () => { active = false }
  }, [])

  async function login(credentials) {
    setError('')
    try {
      const response = await authApi.login(credentials)
      localStorage.setItem(TOKEN_KEY, response.token)
      const currentUser = await authApi.check(response.token)
      setToken(response.token)
      setUser(currentUser)
      return currentUser
    } catch (checkError) {
      localStorage.removeItem(TOKEN_KEY)
      setToken(null)
      setUser(null)
      setError(checkError.message)
      throw checkError
    }
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY)
    setToken(null)
    setUser(null)
    setError('')
  }

  const value = useMemo(() => ({
    token,
    user,
    isLoading,
    error,
    login,
    logout,
  }), [token, user, isLoading, error])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export { AuthContext }
