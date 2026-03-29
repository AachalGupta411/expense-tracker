/**
 * Turn axios/FastAPI errors into a single readable string for the UI.
 */
export function formatApiError(err, fallback = 'Something went wrong') {
  if (!err?.response) {
    if (err?.code === 'ERR_NETWORK') {
      const base = import.meta.env.VITE_API_URL?.trim() || 'http://localhost:8000'
      return `Cannot reach the API (${base}). Is it running?`
    }
    return err?.message || fallback
  }

  const { data, status, statusText } = err.response
  const d = data?.detail

  if (typeof d === 'string') return d

  if (Array.isArray(d)) {
    return d
      .map((item) => {
        if (typeof item === 'string') return item
        if (item && typeof item === 'object') {
          const loc = Array.isArray(item.loc) ? item.loc.filter((x) => x !== 'body').join(' → ') : ''
          const m = item.msg || item.message
          return [loc, m].filter(Boolean).join(': ') || JSON.stringify(item)
        }
        return String(item)
      })
      .join(' ')
  }

  if (d && typeof d === 'object') {
    return JSON.stringify(d)
  }

  return statusText || `Request failed (${status})`
}
