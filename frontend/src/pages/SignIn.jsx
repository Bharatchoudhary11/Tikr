import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function SignIn() {
  const [formValues, setFormValues] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const canSubmit = useMemo(() => {
    return Boolean(formValues.email.trim() && formValues.password.trim())
  }, [formValues.email, formValues.password])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormValues((prev) => ({ ...prev, [name]: value }))
    if (error) setError('')
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!canSubmit) {
      setError('Enter your work email and password to continue.')
      return
    }

    navigate('/deals')
  }

  return (
    <main className="login-layout">
      <form className="login-card" onSubmit={handleSubmit}>
        <div className="form-header">
          <p className="eyebrow">Tikr IC Workspace</p>
          <h1>Sign in</h1>
          <p>Enter your credentials to review deals and IC memos.</p>
        </div>

        <label className="field">
          <span>Work Email</span>
          <input
            name="email"
            type="email"
            autoComplete="email"
            placeholder="analyst@tikr.vc"
            value={formValues.email}
            onChange={handleChange}
          />
        </label>

        <label className="field">
          <span>Password</span>
          <input
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            value={formValues.password}
            onChange={handleChange}
          />
        </label>

        <div className="actions">
          <label className="remember">
            <input type="checkbox" name="remember" defaultChecked />
            Keep me signed in
          </label>
          <button type="button" className="link-button">
            Forgot password?
          </button>
        </div>

        <button type="submit">Access workspace</button>

        {error && <p className="status status-error">{error}</p>}
      </form>
    </main>
  )
}

export default SignIn
