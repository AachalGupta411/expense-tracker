import { useMemo, useState } from 'react'
import { useExpenses } from '../hooks/useExpenses'
import { EXPENSE_CATEGORIES, categoryLabel, categoryTint } from '../constants/categories'
import { formatApiError } from '../utils/apiError'

const card = {
  background: 'linear-gradient(145deg, #1e293b 0%, #161f30 100%)',
  borderRadius: 16,
  padding: '1.25rem 1.35rem',
  border: '1px solid rgba(255, 255, 255, 0.06)',
  boxShadow: '0 1px 0 rgba(255, 255, 255, 0.04) inset',
}

const inputStyle = {
  width: '100%',
  padding: '0.65rem 0.85rem',
  borderRadius: 10,
  border: '1px solid rgba(255, 255, 255, 0.1)',
  background: 'rgba(0, 0, 0, 0.2)',
  color: '#f1f5f9',
  fontSize: '0.9375rem',
  outline: 'none',
}

const labelStyle = {
  display: 'block',
  fontSize: '0.7rem',
  fontWeight: 600,
  color: '#94a3b8',
  marginBottom: '0.35rem',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
}

function formatInr(amountStr) {
  const n = Number(amountStr)
  if (Number.isNaN(n)) return amountStr
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(n)
}

function monthTitle(year, month) {
  return new Intl.DateTimeFormat('en-IN', { month: 'long', year: 'numeric' }).format(
    new Date(year, month - 1, 1),
  )
}

function todayIso() {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export default function DashboardHome() {
  const [filterCategory, setFilterCategory] = useState('')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const filters = useMemo(
    () => ({
      category: filterCategory,
      fromDate,
      toDate,
    }),
    [filterCategory, fromDate, toDate],
  )

  const { expenses, summary, loading, error, reload, createExpense } = useExpenses(filters)

  const isConnectionError = Boolean(
    error &&
      (error.includes('Cannot reach the API') ||
        error.toLowerCase().includes('network') ||
        error.toLowerCase().includes('econnaborted')),
  )

  const [modalOpen, setModalOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState(null)
  const [form, setForm] = useState({
    amount: '',
    category: 'food',
    note: '',
    expense_date: todayIso(),
  })

  const openModal = () => {
    setForm({ amount: '', category: 'food', note: '', expense_date: todayIso() })
    setFormError(null)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setFormError(null)
  }

  const submitExpense = async (e) => {
    e.preventDefault()
    setFormError(null)
    const amt = form.amount.trim()
    const n = Number(amt)
    if (!amt || Number.isNaN(n) || n <= 0) {
      setFormError('Enter a valid amount greater than zero.')
      return
    }
    setSaving(true)
    try {
      const payload = {
        amount: amt,
        category: form.category,
        expense_date: form.expense_date,
      }
      const trimmedNote = form.note.trim()
      if (trimmedNote) {
        payload.note = trimmedNote
      }
      await createExpense(payload)
      closeModal()
    } catch (err) {
      setFormError(formatApiError(err, 'Could not save expense'))
    } finally {
      setSaving(false)
    }
  }

  const maxBar = useMemo(() => {
    if (!summary?.by_category?.length) return 1
    return Math.max(...summary.by_category.map((c) => Number(c.total)), 1)
  }, [summary])

  const clearFilters = () => {
    setFilterCategory('')
    setFromDate('')
    setToDate('')
  }

  return (
    <main className="dashboard-main">
      <div className="dashboard-container">
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            marginBottom: '1.5rem',
          }}
        >
          <div>
            <h1 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#fff', margin: '0 0 0.25rem' }}>
              This month
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem', margin: 0 }}>
              {summary ? monthTitle(summary.year, summary.month) : '—'}
            </p>
          </div>
          <button
            type="button"
            onClick={openModal}
            disabled={isConnectionError}
            title={
              isConnectionError
                ? 'Start the API first — see the message below'
                : undefined
            }
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '0.7rem 1.25rem',
              borderRadius: 999,
              border: 'none',
              background: isConnectionError ? 'rgba(255,255,255,0.35)' : '#fff',
              color: '#0f172a',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: isConnectionError ? 'not-allowed' : 'pointer',
            }}
          >
            + Add expense
          </button>
        </div>

        {error ? (
          <div
            role="alert"
            style={{
              ...card,
              marginBottom: '1.25rem',
              borderColor: 'rgba(248, 113, 113, 0.35)',
              background: 'rgba(127, 29, 29, 0.25)',
            }}
          >
            <p style={{ color: '#fecaca', fontWeight: 700, fontSize: '0.95rem', margin: '0 0 0.5rem' }}>
              {isConnectionError ? 'Backend not reachable' : 'Something went wrong'}
            </p>
            <p style={{ color: '#fca5a5', fontSize: '0.875rem', margin: '0 0 0.75rem', lineHeight: 1.5 }}>
              {error}
            </p>
            {isConnectionError ? (
              <p style={{ color: '#fdba74', fontSize: '0.8125rem', margin: '0 0 1rem', lineHeight: 1.55 }}>
                Adding or loading expenses needs the API running (default{' '}
                <code style={{ color: '#fed7aa' }}>http://localhost:8000</code>). In a separate terminal, from
                your project&apos;s <code style={{ color: '#fed7aa' }}>backend</code> folder run:{' '}
                <code style={{ color: '#fed7aa' }}>python run.py</code> or{' '}
                <code style={{ color: '#fed7aa' }}>uvicorn app.main:app --reload --port 8000</code>
                . Then click Retry. If the API uses another port, set{' '}
                <code style={{ color: '#fed7aa' }}>VITE_API_URL</code> in <code style={{ color: '#fed7aa' }}>frontend/.env</code> and restart{' '}
                <code style={{ color: '#fed7aa' }}>npm run dev</code>.
              </p>
            ) : null}
            <button
              type="button"
              onClick={() => reload()}
              disabled={loading}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: 10,
                border: '1px solid rgba(255,255,255,0.2)',
                background: 'rgba(255,255,255,0.1)',
                color: '#fff',
                fontWeight: 600,
                fontSize: '0.8125rem',
              }}
            >
              {loading ? 'Retrying…' : 'Retry'}
            </button>
          </div>
        ) : null}

        <section
          style={{
            display: 'grid',
            gap: '1rem',
            gridTemplateColumns: '1fr',
            marginBottom: '1.75rem',
          }}
          className="summary-grid"
        >
          <div style={{ ...card, padding: '1.5rem 1.6rem' }}>
            <p style={{ color: '#94a3b8', fontSize: '0.8125rem', fontWeight: 500, marginBottom: '0.5rem' }}>
              Total spent (this month)
            </p>
            <p style={{ fontSize: 'clamp(1.75rem, 4vw, 2.25rem)', fontWeight: 700, color: '#fff', margin: 0 }}>
              {loading && !summary ? '…' : formatInr(summary?.total ?? '0')}
            </p>
          </div>

          <div style={{ ...card }}>
            <p
              style={{
                color: '#94a3b8',
                fontSize: '0.7rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '1rem',
              }}
            >
              By category
            </p>
            {!summary || summary.by_category.length === 0 ? (
              <p style={{ color: '#64748b', fontSize: '0.875rem', margin: 0 }}>
                No expenses this month yet. Add one to see the breakdown.
              </p>
            ) : (
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {summary.by_category.map((row) => {
                  const pct = Math.round((Number(row.total) / maxBar) * 100)
                  return (
                    <li key={row.category}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, gap: 8 }}>
                        <span style={{ color: '#e2e8f0', fontSize: '0.875rem', fontWeight: 600 }}>
                          {categoryLabel(row.category)}
                        </span>
                        <span style={{ color: '#f1f5f9', fontSize: '0.875rem', fontWeight: 600 }}>
                          {formatInr(row.total)}
                        </span>
                      </div>
                      <div
                        style={{
                          height: 6,
                          borderRadius: 999,
                          background: 'rgba(255,255,255,0.08)',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            height: '100%',
                            width: `${pct}%`,
                            borderRadius: 999,
                            background: categoryTint(row.category),
                            transition: 'width 0.25s ease',
                          }}
                        />
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </section>

        <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', margin: '0 0 0.75rem' }}>All expenses</h2>
        <p style={{ color: '#94a3b8', fontSize: '0.8125rem', marginBottom: '1rem' }}>
          Filter by category or date range. List updates as you type.
        </p>

        <div style={{ ...card, marginBottom: '1rem' }} className="filter-grid">
          <div>
            <label htmlFor="flt-cat" style={labelStyle}>
              Category
            </label>
            <select
              id="flt-cat"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              style={{ ...inputStyle, cursor: 'pointer' }}
            >
              <option value="">All categories</option>
              {EXPENSE_CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="flt-from" style={labelStyle}>
              From date
            </label>
            <input
              id="flt-from"
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              style={inputStyle}
            />
          </div>
          <div>
            <label htmlFor="flt-to" style={labelStyle}>
              To date
            </label>
            <input id="flt-to" type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} style={inputStyle} />
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button
              type="button"
              onClick={clearFilters}
              style={{
                padding: '0.6rem 1rem',
                borderRadius: 10,
                border: '1px solid rgba(255, 255, 255, 0.12)',
                background: 'transparent',
                color: '#94a3b8',
                fontWeight: 600,
                fontSize: '0.8125rem',
              }}
            >
              Clear filters
            </button>
          </div>
        </div>

        <div className="expense-list-scroll" style={{ ...card, padding: 0, overflow: 'hidden' }}>
          {loading && expenses.length === 0 ? (
            <p style={{ padding: '1.5rem', color: '#94a3b8', margin: 0 }}>Loading expenses…</p>
          ) : expenses.length === 0 ? (
            <p style={{ padding: '1.5rem', color: '#64748b', margin: 0 }}>
              No expenses match these filters. Adjust filters or add a new expense.
            </p>
          ) : (
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {expenses.map((ex) => (
                <li
                  key={ex.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '0.9rem 1.1rem',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      background: categoryTint(ex.category),
                      flexShrink: 0,
                      opacity: 0.9,
                    }}
                    aria-hidden
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: 600, color: '#fff', fontSize: '0.9rem', margin: '0 0 0.2rem' }}>
                      {categoryLabel(ex.category)}
                      {ex.note ? (
                        <span style={{ fontWeight: 500, color: '#94a3b8' }}> · {ex.note}</span>
                      ) : null}
                    </p>
                    <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0 }}>{ex.expense_date}</p>
                  </div>
                  <span style={{ fontWeight: 700, color: '#fff', fontSize: '0.9rem', flexShrink: 0 }}>
                    {formatInr(ex.amount)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {modalOpen ? (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
        >
          <div
            role="presentation"
            onClick={closeModal}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(2, 6, 23, 0.72)',
              backdropFilter: 'blur(6px)',
            }}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-expense-title"
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: 420,
              background: '#1e293b',
              borderRadius: 16,
              border: '1px solid rgba(255, 255, 255, 0.08)',
              boxShadow: '0 24px 64px rgba(0, 0, 0, 0.5)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem 1.25rem',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <h2 id="add-expense-title" style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', margin: 0 }}>
                Add expense
              </h2>
              <button
                type="button"
                onClick={closeModal}
                aria-label="Close"
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: '#94a3b8',
                  fontSize: '1.35rem',
                  lineHeight: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 0,
                }}
              >
                ×
              </button>
            </div>
            <form onSubmit={submitExpense} style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label htmlFor="exp-amt" style={labelStyle}>
                  Amount (₹)
                </label>
                <input
                  id="exp-amt"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.amount}
                  onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                  placeholder="0.00"
                  style={inputStyle}
                  required
                />
              </div>
              <div>
                <label htmlFor="exp-cat" style={labelStyle}>
                  Category
                </label>
                <select
                  id="exp-cat"
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  style={{ ...inputStyle, cursor: 'pointer' }}
                >
                  {EXPENSE_CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="exp-date" style={labelStyle}>
                  Date
                </label>
                <input
                  id="exp-date"
                  type="date"
                  value={form.expense_date}
                  onChange={(e) => setForm((f) => ({ ...f, expense_date: e.target.value }))}
                  style={inputStyle}
                  required
                />
              </div>
              <div>
                <label htmlFor="exp-note" style={labelStyle}>
                  Note (optional)
                </label>
                <input
                  id="exp-note"
                  value={form.note}
                  onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
                  placeholder="Coffee, fuel, etc."
                  style={inputStyle}
                />
              </div>
              {formError ? <p style={{ color: '#fca5a5', fontSize: '0.875rem', margin: 0 }}>{formError}</p> : null}
              <button
                type="submit"
                disabled={saving}
                style={{
                  marginTop: '0.25rem',
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: 10,
                  border: 'none',
                  background: saving ? 'rgba(255,255,255,0.5)' : '#fff',
                  color: '#0f172a',
                  fontWeight: 600,
                  fontSize: '0.9375rem',
                }}
              >
                {saving ? 'Saving…' : 'Save expense'}
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </main>
  )
}
