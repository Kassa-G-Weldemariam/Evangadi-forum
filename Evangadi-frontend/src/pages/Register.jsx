import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authApi } from '../api/client'

const initialForm = { username: '', firstname: '', lastname: '', email: '', password: '' }

function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (Object.values(form).some((value) => !value.trim())) {
      setError('Please complete all fields.')
      return
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    setError('')
    setIsSubmitting(true)
    try {
      await authApi.register(form)
      navigate('/login', { replace: true, state: { message: 'Registration successful. Please log in.' } })
    } catch (registerError) {
      setError(registerError.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1>Create account</h1>
        {error && <p className="error" role="alert">{error}</p>}
        <label htmlFor="register-username">Username</label>
        <input id="register-username" name="username" autoComplete="username" value={form.username} onChange={handleChange} required />
        <label htmlFor="register-firstname">First name</label>
        <input id="register-firstname" name="firstname" autoComplete="given-name" value={form.firstname} onChange={handleChange} required />
        <label htmlFor="register-lastname">Last name</label>
        <input id="register-lastname" name="lastname" autoComplete="family-name" value={form.lastname} onChange={handleChange} required />
        <label htmlFor="register-email">Email</label>
        <input id="register-email" name="email" type="email" autoComplete="email" value={form.email} onChange={handleChange} required />
        <label htmlFor="register-password">Password</label>
        <input id="register-password" name="password" type="password" autoComplete="new-password" minLength="8" value={form.password} onChange={handleChange} required />
        <button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Registering...' : 'Register'}</button>
        <p>Already registered? <Link to="/login">Log in</Link></p>
      </form>
    </main>
  )
}

export default Register
