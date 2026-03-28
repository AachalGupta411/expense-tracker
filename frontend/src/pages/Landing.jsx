import { useEffect } from 'react'
import api from '../services/api'

export default function Landing() {
  useEffect(() => {
    api.get('/health')
      .then(res => {
        console.log('API WORKING:', res.data)
      })
      .catch(err => {
        console.error('API ERROR:', err)
      })
  }, [])

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Expense Tracker</h1>
      <p>Check console for API response</p>
    </div>
  )
}