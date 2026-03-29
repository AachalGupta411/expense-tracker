import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import Landing from './pages/Landing'
import DashboardLayout from './pages/DashboardLayout'
import DashboardHome from './pages/DashboardHome'
import DashboardProfile from './pages/DashboardProfile'

export default function App() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-sm font-medium text-slate-500">
        Loading…
      </div>
    )
  }

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <Landing />} />
      {/* Same screen as / — there is no separate /signup; Google OAuth is sign-in + account create */}
      <Route path="/sign-in" element={user ? <Navigate to="/dashboard" replace /> : <Landing />} />

      <Route
        path="/dashboard"
        element={user ? <DashboardLayout /> : <Navigate to="/" replace />}
      >
        <Route index element={<DashboardHome />} />
        <Route path="profile" element={<DashboardProfile />} />
      </Route>

      <Route path="*" element={<Navigate to={user ? '/dashboard' : '/'} replace />} />
    </Routes>
  )
}
