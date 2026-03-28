import { useEffect, useState, useRef } from 'react'

export function useGoogleAuth(onSuccess) {
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false)
  const buttonRef = useRef(null)

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
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
    }
  }, [])

  useEffect(() => {
    if (!isGoogleLoaded || !buttonRef.current) return

    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: (response) => {
        if (response.credential) {
          onSuccess(response.credential)
        }
      },
    })

    window.google.accounts.id.renderButton(buttonRef.current, {
      theme: 'outline',
      size: 'large',
    })
  }, [isGoogleLoaded])

  return { buttonRef, isGoogleLoaded }
}