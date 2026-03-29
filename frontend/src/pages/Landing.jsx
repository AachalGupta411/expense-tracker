import { useGoogleAuth } from '../hooks/useGoogleAuth'
import { useAuth } from '../hooks/useAuth'
import api from '../services/api'

export default function Landing() {
  const { login } = useAuth()  // ✅ USE THIS

  const handleLogin = async (id_token) => {
    try {
      console.log('ID TOKEN:', id_token)

      // ✅ use axios (api) instead of fetch
      const res = await api.post('/auth/google', {
        id_token,
      })

      const { access_token, user } = res.data

      console.log('JWT:', access_token)
      console.log('USER:', user)

      // ✅ THIS IS THE KEY CHANGE
      login(access_token, user)

    } catch (err) {
      console.error('Login failed:', err)
    }
  }

  const { buttonRef, isGoogleLoaded } = useGoogleAuth(handleLogin)

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Expense Tracker</h1>

      {isGoogleLoaded ? (
        <div ref={buttonRef}></div>
      ) : (
        <p>Loading sign-in...</p>
      )}
    </div>
  )
}