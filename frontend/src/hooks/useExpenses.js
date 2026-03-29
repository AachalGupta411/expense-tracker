import { useCallback, useEffect, useState } from 'react'
import api from '../services/api'
import { formatApiError } from '../utils/apiError'

/**
 * @param {{ category: string, fromDate: string, toDate: string }} filters
 * category / fromDate / toDate are optional strings for API query params
 */
export function useExpenses(filters) {
  const [expenses, setExpenses] = useState([])
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const reload = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = {}
      if (filters.category) params.category = filters.category
      if (filters.fromDate) params.from_date = filters.fromDate
      if (filters.toDate) params.to_date = filters.toDate
      const [exRes, smRes] = await Promise.all([
        api.get('/expenses', { params }),
        api.get('/expenses/summary'),
      ])
      setExpenses(exRes.data)
      setSummary(smRes.data)
    } catch (e) {
      setError(formatApiError(e, 'Failed to load expenses'))
    } finally {
      setLoading(false)
    }
  }, [filters.category, filters.fromDate, filters.toDate])

  useEffect(() => {
    reload()
  }, [reload])

  const createExpense = useCallback(
    async (body) => {
      await api.post('/expenses', body)
      try {
        await reload()
      } catch (e) {
        console.error('Expense saved; refreshing the list failed:', e)
      }
    },
    [reload],
  )

  return { expenses, summary, loading, error, reload, createExpense }
}
