import { Routes, Route, Navigate, NavLink, Link, useLocation } from 'react-router-dom'
import { useEffect, Suspense, lazy, useState } from 'react'
import { AlertCircle, BookMarked, RotateCcw, X } from 'lucide-react'
import useBookmarksStore from '@/store/useBookmarksStore'
import {
  usePreferencesStore,
  initializePreferences,
  watchSystemTheme
} from '@/store/usePreferencesStore'
import { LazyErrorBoundary } from '@/ui/ErrorBoundary'
import { ThemeSwitch } from '@/ui/ThemeSwitch'
import { LanguageSwitch } from '@/ui/LanguageSwitch'
import { t } from '@/locales'
import { normalizeLegacyHashRoute } from '@/utils/routes'

const LandingPage = lazy(() => import('@/pages/LandingPage'))
const UploadMerge = lazy(() => import('@/pages/UploadMerge'))
const Dashboard = lazy(() => import('@/pages/Dashboard'))
const Search = lazy(() => import('@/pages/Search'))
const Duplicates = lazy(() => import('@/pages/Duplicates'))
const AI = lazy(() => import('@/pages/AI'))
const Backup = lazy(() => import('@/pages/Backup'))

const appLinks = [
  { to: '/app/upload', labelKey: 'nav.upload' as const },
  { to: '/app/dashboard', labelKey: 'nav.dashboard' as const },
  { to: '/app/search', labelKey: 'nav.search' as const },
  { to: '/app/duplicates', labelKey: 'nav.duplicates' as const },
  { to: '/app/ai', labelKey: 'nav.ai' as const },
  { to: '/app/backup', labelKey: 'nav.backup' as const }
]

function AppHeader() {
  const { needsMerge, duplicates, similarGroups } = useBookmarksStore()
  const pendingReviewCount = Object.keys(duplicates).length + similarGroups.length
  usePreferencesStore((state) => state.language)

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border/70 bg-header-bg backdrop-blur-md shadow-subtle transition-all">
        <div className="mx-auto flex h-15 max-w-6xl items-center justify-between gap-3 px-4 py-2">
          <Link
            to="/"
            className="group flex items-center gap-2.5 font-bold tracking-tight text-foreground transition flex-shrink-0"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 via-sky-600 to-indigo-600 text-white shadow-md shadow-sky-500/20 group-hover:scale-105 group-hover:shadow-sky-500/40 transition-all duration-300">
              <BookMarked className="h-4.5 w-4.5" />
            </div>
            <span className="hidden sm:inline bg-gradient-to-r from-foreground via-foreground to-foreground/80 bg-clip-text">
              Bookmarks Manager
            </span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <nav
              className="flex items-center gap-1 p-1 rounded-xl bg-card-hover/40 border border-border/40 overflow-x-auto text-sm whitespace-nowrap shadow-subtle"
              aria-label={t('aria.mainNav')}
            >
              {appLinks.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `rounded-lg px-3 py-1.5 text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                      isActive
                        ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-sm shadow-sky-500/25 font-semibold'
                        : 'text-muted hover:bg-card-hover hover:text-foreground'
                    }`
                  }
                >
                  <span className="flex items-center gap-1.5">
                    {t(item.labelKey)}
                    {item.to === '/app/duplicates' && pendingReviewCount > 0 && (
                      <span className="inline-flex min-w-4 h-4 items-center justify-center rounded-full bg-amber-500 px-1 text-[10px] font-bold leading-none text-white">
                        {pendingReviewCount}
                      </span>
                    )}
                  </span>
                </NavLink>
              ))}
            </nav>
            <div className="h-4 w-px bg-border/80 flex-shrink-0 hidden xs:block" />
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <ThemeSwitch />
              <LanguageSwitch />
            </div>
          </div>
        </div>
      </header>

      {needsMerge && (
        <div
          className="border-b border-amber-500/30 bg-gradient-to-r from-amber-500/15 via-amber-500/10 to-amber-500/15 backdrop-blur-sm text-amber-700 dark:text-amber-300 shadow-sm"
          role="alert"
        >
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2.5 text-xs sm:text-sm">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="p-1 rounded-lg bg-amber-500/20 text-amber-500 flex-shrink-0">
                <AlertCircle className="h-4 w-4" aria-hidden="true" />
              </div>
              <div className="truncate font-medium">{t('alert.needsMerge')}</div>
            </div>
            <NavLink
              to="/app/upload"
              className="rounded-lg bg-amber-500/20 px-3 py-1 text-xs font-semibold text-amber-800 dark:text-amber-200 transition hover:bg-amber-500/30 shadow-subtle flex-shrink-0"
            >
              {t('alert.goMerge')}
            </NavLink>
          </div>
        </div>
      )}
    </>
  )
}

function UndoBanner() {
  const lastAction = useBookmarksStore((state) => state.lastAction)
  const undo = useBookmarksStore((state) => state.undo)
  const dismissUndo = useBookmarksStore((state) => state.dismissUndo)
  const [undoing, setUndoing] = useState(false)

  if (!lastAction) return null

  async function handleUndo() {
    setUndoing(true)
    try {
      await undo()
    } catch (error) {
      console.error('Failed to undo bookmark action:', error)
    } finally {
      setUndoing(false)
    }
  }

  return (
    <div className="sticky top-16 z-40 border-b border-sky-500/25 bg-sky-500/10 backdrop-blur-md text-sky-700 dark:text-sky-200 shadow-subtle">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-2.5 text-xs sm:text-sm">
        <div className="flex items-center gap-2 min-w-0">
          <RotateCcw className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
          <span className="font-medium truncate">{t('undo.message', { action: lastAction.label })}</span>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            type="button"
            disabled={undoing}
            onClick={() => void handleUndo()}
            className="rounded-lg bg-sky-600 px-3 py-1.5 font-semibold text-white transition hover:bg-sky-500 disabled:opacity-50"
          >
            {t('undo.button')}
          </button>
          <button
            type="button"
            onClick={dismissUndo}
            className="rounded-lg p-1.5 text-sky-700/80 transition hover:bg-sky-500/15 hover:text-sky-700 dark:text-sky-200/80 dark:hover:text-sky-100"
            aria-label={t('undo.dismiss')}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

function AppContent() {
  const { loadFromDB } = useBookmarksStore()

  useEffect(() => {
    void loadFromDB()
  }, [loadFromDB])

  return (
    <div className="relative min-h-screen bg-background">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-gradient-to-b from-sky-500/[0.04] via-indigo-500/[0.02] to-transparent dark:from-sky-500/[0.035]" />
      <AppHeader />
      <UndoBanner />
      <main className="relative mx-auto max-w-6xl px-4 py-8">
        <LazyErrorBoundary>
          <Suspense
            fallback={
              <div
                className="flex items-center justify-center gap-3 py-24 text-sm text-muted"
                role="status"
                aria-live="polite"
              >
                <div
                  className="h-5 w-5 animate-spin rounded-full border-2 border-sky-400 border-t-transparent shadow-sm"
                  aria-hidden="true"
                />
                <span className="font-medium">{t('common.loading')}</span>
              </div>
            }
          >
            <Routes>
              <Route path="" element={<Navigate to="/app/upload" replace />} />
              <Route path="upload" element={<UploadMerge />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="search" element={<Search />} />
              <Route path="duplicates" element={<Duplicates />} />
              <Route path="ai" element={<AI />} />
              <Route path="backup" element={<Backup />} />
              <Route path="*" element={<Navigate to="/app/upload" replace />} />
            </Routes>
          </Suspense>
        </LazyErrorBoundary>
      </main>
    </div>
  )
}

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
  }, [pathname])

  return null
}

function LegacyRedirectHandler() {
  const location = useLocation()

  useEffect(() => {
    const normalizedHash = normalizeLegacyHashRoute(window.location.hash)
    if (normalizedHash) {
      window.location.hash = normalizedHash
    }
  }, [location])

  return null
}

export default function App() {
  const language = usePreferencesStore((state) => state.language)

  useEffect(() => {
    initializePreferences()
    const cleanup = watchSystemTheme()
    return cleanup
  }, [])

  return (
    <div key={language} className="min-h-screen bg-background text-foreground">
      <ScrollToTop />
      <LegacyRedirectHandler />
      <Routes>
        <Route
          path="/"
          element={
            <Suspense
              fallback={
                <div className="flex min-h-screen items-center justify-center bg-background">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-sky-400 border-t-transparent" />
                </div>
              }
            >
              <LandingPage />
            </Suspense>
          }
        />
        <Route path="/app/*" element={<AppContent />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}
