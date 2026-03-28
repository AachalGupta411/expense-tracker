import { useEffect, useState } from 'react'

export function useGoogleAuth() {
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false)

  useEffect(() => {
    if (window.google) {
      setIsGoogleLoaded(true)
      return
    }

    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true

    script.onload = () => setIsGoogleLoaded(true)
    script.onerror = () => console.error('Failed to load Google Identity Services')

    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  return { isGoogleLoaded }
}