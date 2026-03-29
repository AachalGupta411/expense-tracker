import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'

export default function App() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return <p style={{ padding: '2rem' }}>Loading...</p>
  }

  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={user ? <Navigate to="/dashboard" /> : <Landing />}
        />

        <Route
          path="/dashboard"
          element={user ? <Dashboard /> : <Navigate to="/" />}
        />

      </Routes>
    </BrowserRouter>
  )
}