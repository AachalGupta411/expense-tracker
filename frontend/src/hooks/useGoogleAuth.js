import { useEffect, useState, useRef } from 'react'

/** Google only allows one `initialize` per full page load */
let googleIdentityInitialized = false

export function useGoogleAuth(onSuccess) {
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false)
  const [gsiError, setGsiError] = useState(null)
  const buttonRef = useRef(null)
  const onSuccessRef = useRef(onSuccess)

  useEffect(() => {
    onSuccessRef.current = onSuccess
  }, [onSuccess])

  useEffect(() => {
    if (window.google) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- GIS: script already present
      setIsGoogleLoaded(true)
      return
    }

    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.onload = () => setIsGoogleLoaded(true)
    script.onerror = () => {
      setGsiError('Could not load Google Sign-In script. Check your network or ad blockers.')
    }

    document.body.appendChild(script)

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
    }
  }, [])

  useEffect(() => {
    if (!isGoogleLoaded || !buttonRef.current) return

    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim()
    if (!clientId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- GIS: validate env before renderButton
      setGsiError('Missing VITE_GOOGLE_CLIENT_ID in .env — add your Google OAuth client ID.')
      return
    }

    buttonRef.current.innerHTML = ''

    try {
      if (!googleIdentityInitialized) {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: (response) => {
            if (response.credential) {
              onSuccessRef.current(response.credential)
            }
          },
        })
        googleIdentityInitialized = true
      }

      const el = buttonRef.current
      const width = Math.min(400, Math.max(260, el.offsetWidth || 320))

      window.google.accounts.id.renderButton(el, {
        theme: 'filled_black',
        size: 'large',
        width,
        text: 'continue_with',
        shape: 'pill',
        logo_alignment: 'left',
      })
    } catch (e) {
      console.error('Google Sign-In init failed:', e)
      setGsiError(
        'Google Sign-In could not start. If the console says the origin is not allowed, add this exact URL to Authorized JavaScript origins in Google Cloud Console.',
      )
    }
  }, [isGoogleLoaded])

  return { buttonRef, isGoogleLoaded, gsiError }
}
