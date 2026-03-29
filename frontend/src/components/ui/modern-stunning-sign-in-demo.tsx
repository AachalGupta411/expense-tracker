/**
 * Optional isolated demo. The live app uses `SignIn1` from `Landing.tsx` with Google OAuth wired up.
 */
import { SignIn1 } from '@/components/ui/modern-stunning-sign-in'
import { useRef } from 'react'

export function ModernStunningSignInDemo() {
  const ref = useRef<HTMLDivElement>(null)
  return (
    <SignIn1
      googleButtonRef={ref}
      isGoogleLoaded={false}
      googleScriptError={null}
      loginError={null}
    />
  )
}
