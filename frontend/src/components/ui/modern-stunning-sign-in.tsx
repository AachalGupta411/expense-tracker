import * as React from 'react'
import { Wallet, PieChart, ShieldCheck, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'

const perks = [
  { icon: PieChart, text: 'Monthly totals and category breakdown at a glance.' },
  { icon: TrendingDown, text: 'Log expenses in seconds — filters when you need them.' },
  { icon: ShieldCheck, text: 'Sign in with Google. Data stays tied to your account.' },
] as const

export type SignIn1Props = {
  appTitle?: string
  tagline?: string
  googleButtonRef: React.RefObject<HTMLDivElement | null>
  isGoogleLoaded: boolean
  googleScriptError: string | null
  loginError: string | null
}

function BrandPanel({
  appTitle,
  tagline,
  className,
  compact = false,
}: {
  appTitle: string
  tagline: string
  className?: string
  compact?: boolean
}) {
  return (
    <div className={cn('relative', className)}>
      <div
        className={cn(
          'inline-flex items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 shadow-lg shadow-emerald-900/40 ring-1 ring-white/20',
          compact ? 'mb-5 h-11 w-11' : 'mb-8 h-14 w-14',
        )}
      >
        <Wallet className={cn('text-white', compact ? 'h-5 w-5' : 'h-7 w-7')} strokeWidth={2} aria-hidden />
      </div>

      <h1
        className={cn(
          'max-w-lg font-semibold tracking-tight',
          compact ? 'text-2xl' : 'text-4xl leading-[1.1] xl:text-[2.75rem] xl:leading-[1.08]',
        )}
      >
        <span className="bg-gradient-to-br from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
          {appTitle}
        </span>
      </h1>

      <p
        className={cn(
          'mt-5 max-w-md border-l-2 border-emerald-500/35 pl-5 text-slate-400',
          compact ? 'text-sm leading-relaxed' : 'text-base leading-relaxed xl:text-[1.05rem] xl:leading-relaxed',
        )}
      >
        {tagline}
      </p>

      <div className={cn('relative', compact ? 'mt-8' : 'mt-14')}>
        <div
          className="pointer-events-none absolute left-[1.125rem] top-4 bottom-4 w-px bg-gradient-to-b from-emerald-500/40 via-white/12 to-transparent"
          aria-hidden
        />
        <ul className="relative space-y-3 sm:space-y-4">
          {perks.map(({ icon: Icon, text }, i) => (
            <li key={text} className="relative flex gap-4 sm:gap-5">
              <div className="relative z-10 flex shrink-0 flex-col items-center">
                <span
                  className={cn(
                    'flex items-center justify-center rounded-full bg-slate-950 ring-2 shadow-[0_0_24px_-6px_rgba(16,185,129,0.55)] ring-emerald-500/40',
                    compact ? 'h-9 w-9' : 'h-11 w-11',
                  )}
                >
                  <Icon
                    className={cn('text-emerald-400', compact ? 'h-4 w-4' : 'h-5 w-5')}
                    strokeWidth={2}
                    aria-hidden
                  />
                </span>
              </div>
              <div
                className={cn(
                  'min-w-0 flex-1 rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.06] to-white/[0.02] shadow-inner shadow-white/[0.03] backdrop-blur-sm transition-colors hover:border-emerald-500/20',
                  compact ? 'px-3.5 py-3' : 'px-5 py-4',
                )}
              >
                <span className="mb-1 block text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-emerald-500/80">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p className={cn('leading-relaxed text-slate-300', compact ? 'text-xs sm:text-sm' : 'text-sm xl:text-[0.9375rem]')}>
                  {text}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

const SignIn1 = ({
  appTitle = 'Expense Tracker',
  tagline = 'Know where your money goes — without another spreadsheet.',
  googleButtonRef,
  isGoogleLoaded,
  googleScriptError,
  loginError,
}: SignIn1Props) => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-slate-950 text-slate-100 antialiased">
      <div className="pointer-events-none fixed inset-0" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(16,185,129,0.15),transparent)]" />
        <div className="absolute bottom-0 right-0 h-[50vh] w-[50vw] bg-indigo-600/[0.07] blur-[120px]" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col lg:flex-row">
        {/* Brand column — desktop */}
        <aside className="relative hidden overflow-hidden border-b border-white/5 bg-slate-900/50 lg:flex lg:w-[46%] lg:max-w-xl lg:border-b-0 lg:border-r lg:border-white/[0.06] xl:w-[44%]">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.35]"
            aria-hidden
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)`,
              backgroundSize: '40px 40px',
              maskImage: 'linear-gradient(to bottom, black 0%, black 55%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 55%, transparent 100%)',
            }}
          />
          <div className="pointer-events-none absolute -left-20 top-1/4 h-72 w-72 rounded-full bg-emerald-500/10 blur-[90px]" aria-hidden />
          <div className="relative flex flex-1 flex-col justify-center px-10 py-14 lg:px-12 xl:px-16 xl:py-16">
            <BrandPanel appTitle={appTitle} tagline={tagline} />
          </div>
        </aside>

        {/* Sign-in */}
        <main className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-8 lg:py-16">
          <div className="mb-10 lg:hidden">
            <BrandPanel appTitle={appTitle} tagline={tagline} compact />
          </div>

          <div className="mx-auto w-full max-w-[22rem] sm:max-w-sm">
            <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-7 shadow-xl shadow-black/40 ring-1 ring-white/[0.04] backdrop-blur-xl sm:p-8">
              <h2 className="text-center text-lg font-semibold text-white lg:text-left">Welcome back</h2>
              <p className="mt-1 text-center text-sm text-slate-500 lg:text-left">
                Use your Google account to continue.
              </p>

              <div className="mt-8">
                <div
                  ref={googleButtonRef}
                  className="gsi-slot flex w-full flex-col items-stretch justify-center [&>div]:flex [&>div]:w-full [&>div]:justify-center"
                />
                {!isGoogleLoaded ? (
                  <div className="mt-4 flex justify-center">
                    <span className="inline-flex h-10 w-full max-w-[320px] items-center justify-center rounded-full bg-white/5 text-xs font-medium text-slate-500 ring-1 ring-white/10">
                      Loading sign-in…
                    </span>
                  </div>
                ) : null}
              </div>

              {(googleScriptError || loginError) && (
                <div
                  className="mt-5 rounded-xl border border-red-500/25 bg-red-950/50 px-3.5 py-3 text-sm leading-snug text-red-100/95"
                  role="alert"
                >
                  {googleScriptError ? <p>{googleScriptError}</p> : null}
                  {loginError ? <p className={googleScriptError ? 'mt-2' : ''}>{loginError}</p> : null}
                </div>
              )}
            </div>

          </div>
        </main>
      </div>
    </div>
  )
}

export { SignIn1 }
