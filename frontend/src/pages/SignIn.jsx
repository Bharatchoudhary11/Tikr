import { useMemo, useState } from 'react'
import '../App.css'

function SignIn() {
  const [formValues, setFormValues] = useState({ email: '', password: '' })
  const [status, setStatus] = useState('idle')
  const [message, setMessage] = useState('')

  const disabled = status === 'loading'

  const canSubmit = useMemo(() => {
    return Boolean(formValues.email.trim() && formValues.password.trim())
  }, [formValues.email, formValues.password])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormValues((prev) => ({ ...prev, [name]: value }))
    if (status !== 'idle') {
      setStatus('idle')
      setMessage('')
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!canSubmit) {
      setStatus('error')
      setMessage('Enter your work email and password to continue.')
      return
    }

    setStatus('loading')
    setMessage('')

    window.setTimeout(() => {
      setStatus('success')
      setMessage('Demo login successful. Wire this form to FastAPI auth next.')
    }, 900)
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

        <button type="submit" disabled={disabled}>
          {disabled ? 'Signing in…' : 'Access workspace'}
        </button>

        {status === 'error' && (
          <p className="status status-error">{message}</p>
        )}
        {status === 'success' && (
          <p className="status status-success">{message}</p>
        )}
      </form>
    </main>
  )
}

export default SignIn
