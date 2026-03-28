import { useGoogleAuth } from '../hooks/useGoogleAuth'

export default function Landing() {
  function handleGoogleSuccess(idToken) {
    console.log('ID TOKEN:', idToken)
  }

  const { buttonRef, isGoogleLoaded } = useGoogleAuth(handleGoogleSuccess)

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