import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

function initials(name) {
  if (!name || typeof name !== 'string') return '?'
  const parts = name.trim().split(/\s+/)
  const a = parts[0]?.[0] ?? ''
  const b = parts.length > 1 ? parts[parts.length - 1][0] : ''
  return (a + b).toUpperCase() || '?'
}

const card = {
  background: 'linear-gradient(145deg, #1e293b 0%, #161f30 100%)',
  borderRadius: 16,
  padding: '1.5rem 1.75rem',
  border: '1px solid rgba(255, 255, 255, 0.06)',
  boxShadow: '0 1px 0 rgba(255, 255, 255, 0.04) inset',
}

export default function DashboardProfile() {
  const { user, logout } = useAuth()
  const letter = useMemo(() => initials(user?.name), [user?.name])

  if (!user) return null

  return (
    <main className="dashboard-main">
      <div className="dashboard-container">
        <p style={{ marginBottom: '1.25rem' }}>
          <Link
            to="/dashboard"
            style={{ color: '#94a3b8', fontSize: '0.875rem', fontWeight: 500, textDecoration: 'none' }}
          >
            ← Back to overview
          </Link>
        </p>

        <div style={{ ...card, maxWidth: 520 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                overflow: 'hidden',
                border: '2px solid rgba(255, 255, 255, 0.1)',
                background: '#0f172a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '1.1rem',
                color: '#94a3b8',
                flexShrink: 0,
              }}
            >
              {user.picture ? (
                <img src={user.picture} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                letter
              )}
            </div>
            <div style={{ minWidth: 0 }}>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', margin: '0 0 0.25rem' }}>
                {user.name}
              </h1>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0, wordBreak: 'break-word' }}>{user.email}</p>
            </div>
          </div>
          <p style={{ color: '#64748b', fontSize: '0.8125rem', marginBottom: '1.25rem', lineHeight: 1.5 }}>
            Signed in with Google. Signing out clears your session on this device only.
          </p>
          <button
            type="button"
            onClick={logout}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              borderRadius: 10,
              border: 'none',
              background: '#ef4444',
              color: '#fff',
              fontWeight: 600,
              fontSize: '0.9375rem',
            }}
          >
            Sign out
          </button>
        </div>
      </div>
    </main>
  )
}
