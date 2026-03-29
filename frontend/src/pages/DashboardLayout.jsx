import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const navClass =
  'rounded-lg px-3.5 py-2 text-sm font-semibold text-slate-400 transition-colors hover:bg-white/5 hover:text-slate-200'

const navActive =
  'bg-white/10 text-white shadow-sm ring-1 ring-white/10'

export default function DashboardLayout() {
  const { user } = useAuth()

  if (!user) {
    return (
      <div className="dashboard-shell flex min-h-screen items-center justify-center text-slate-400">
        Loading…
      </div>
    )
  }

  return (
    <div className="dashboard-shell">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/85 backdrop-blur-xl">
        <div className="dashboard-container flex flex-wrap items-center justify-between gap-3 py-3.5 sm:py-4">
          <p className="text-lg font-bold tracking-tight text-white sm:text-xl">Expense Tracker</p>
          <nav className="flex flex-wrap items-center gap-1 rounded-xl bg-white/[0.04] p-1 ring-1 ring-white/5">
            <NavLink
              to="/dashboard"
              end
              className={({ isActive }) => `${navClass} ${isActive ? navActive : ''}`}
            >
              Overview
            </NavLink>
            <NavLink
              to="/dashboard/profile"
              className={({ isActive }) => `${navClass} ${isActive ? navActive : ''}`}
            >
              Profile
            </NavLink>
          </nav>
        </div>
      </header>
      <Outlet />
    </div>
  )
}
