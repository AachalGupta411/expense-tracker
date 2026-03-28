import { useGoogleAuth } from '../hooks/useGoogleAuth'

export default function Landing() {

  const handleLogin = async (id_token) => {
    try {
      console.log('ID TOKEN:', id_token)

      const res = await fetch('http://localhost:8001/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id_token }),
      })

      const data = await res.json()

      console.log('JWT:', data.access_token)

      localStorage.setItem('token', data.access_token)

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