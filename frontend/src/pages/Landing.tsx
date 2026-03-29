import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SignIn1 } from '@/components/ui/modern-stunning-sign-in'
import { useGoogleAuth } from '../hooks/useGoogleAuth'
import { useAuth } from '../hooks/useAuth'
import api from '../services/api'

function loginErrorMessage(err: unknown): string {
  if (err && typeof err === 'object' && 'response' in err) {
    const ax = err as {
      response?: { status?: number; data?: { detail?: string | Array<{ msg?: string }> } }
      code?: string
      message?: string
    }
    const status = ax.response?.status
    const code = ax.code
    if (!ax.response && (code === 'ERR_NETWORK' || code === 'ECONNABORTED')) {
      return 'Cannot reach the API. Check that it is running and that VITE_API_URL in .env matches its address (default http://localhost:8000).'
    }
    if (status === 502 || status === 503) {
      return 'The API is not responding. Confirm it is running and VITE_API_URL in .env is correct.'
    }
    const d = ax.response?.data?.detail
    if (typeof d === 'string') return d
    if (Array.isArray(d)) {
      return d.map((x) => x.msg ?? JSON.stringify(x)).join(' ')
    }
  }
  if (err instanceof Error) return err.message
  return 'Sign-in failed. Check the console for details.'
}

export default function Landing() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [loginError, setLoginError] = useState<string | null>(null)

  const handleLogin = useCallback(
    async (id_token: string) => {
      setLoginError(null)
      try {
        const res = await api.post('/auth/google', {
          id_token,
        })
        const { access_token, user } = res.data as {
          access_token: string
          user: { id: string; email: string; name: string; picture?: string | null }
        }
        if (!access_token || !user) {
          setLoginError('Invalid response from server. Try again.')
          return
        }
        login(access_token, user)
        navigate('/dashboard', { replace: true })
      } catch (err) {
        console.error('Login failed:', err)
        setLoginError(loginErrorMessage(err))
      }
    },
    [login, navigate],
  )

  const { buttonRef, isGoogleLoaded, gsiError } = useGoogleAuth(handleLogin)

  return (
    <SignIn1
      googleButtonRef={buttonRef}
      isGoogleLoaded={isGoogleLoaded}
      googleScriptError={gsiError}
      loginError={loginError}
    />
  )
}
