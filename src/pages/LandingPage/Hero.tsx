import { BookMarked, Shield, Zap, ArrowRight, Sparkles, Upload, Database } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { t } from '@/locales'

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-sky-50/20 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-sky-500/10 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent" />

      {/* Animated Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40 dark:opacity-20" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div
            className={`text-center lg:text-left transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-sm mb-8">
              <Sparkles className="w-4 h-4" />
              <span>{t('hero.badge')}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6 leading-tight">
              {t('hero.headline')}
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-400">
                {t('hero.headlineHighlight')}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-muted mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              {t('hero.description')}
            </p>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-10 text-sm text-muted">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>{t('hero.trust.local')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>{t('hero.trust.noSignup')}</span>
              </div>
              <div className="flex items-center gap-2">
                <BookMarked className="w-4 h-4 text-sky-400" />
                <span>{t('hero.trust.pwa')}</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                to="/app/upload"
                className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-400 hover:to-indigo-400 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40 hover:scale-105"
              >
                {t('hero.getStarted')}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="https://github.com/holtwood-projects/bookmarks-manager"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 bg-card-hover/50 hover:bg-card-hover text-muted hover:text-foreground font-medium rounded-xl border border-border transition-all duration-300"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                {t('hero.github')}
              </a>
            </div>
          </div>

          {/* Right Visual */}
          <div
            className={`relative transition-all duration-1000 delay-300 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            {/* Main Card */}
            <div className="relative bg-card/80 backdrop-blur-xl rounded-2xl border border-border/50 p-6 shadow-2xl">
              {/* Browser Chrome */}
              <div className="flex items-center gap-2 mb-4 pb-4 border-b border-border/50">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <div className="flex-1 mx-4">
                  <div className="bg-card-hover rounded-md px-3 py-1.5 text-xs text-muted flex items-center gap-2">
                    <BookMarked className="w-3 h-3" />
                    holtwood-projects.github.io/bookmarks-manager
                  </div>
                </div>
              </div>

              {/* App Preview Content */}
              <div className="space-y-4">
                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-card-hover/50 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-sky-400">1,247</div>
                    <div className="text-xs text-muted">{t('hero.stats.total')}</div>
                  </div>
                  <div className="bg-card-hover/50 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-rose-400">86</div>
                    <div className="text-xs text-muted">{t('hero.stats.duplicates')}</div>
                  </div>
                  <div className="bg-card-hover/50 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-emerald-400">342</div>
                    <div className="text-xs text-muted">{t('hero.stats.domains')}</div>
                  </div>
                </div>

                {/* Chart Preview */}
                <div className="bg-card-hover/30 rounded-lg p-4">
                  <div className="flex items-end justify-between h-24 gap-2">
                    {[40, 65, 45, 80, 55, 90, 70, 85, 60, 75].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-gradient-to-t from-sky-500/50 to-sky-400/80 rounded-t"
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                  <div className="text-xs text-muted mt-2 text-center">{t('hero.stats.trend')}</div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Link
                    to="/app/upload"
                    className="flex-1 bg-sky-500/20 hover:bg-sky-500/30 border border-sky-500/30 hover:border-sky-500/50 rounded-lg py-2 text-center text-sm font-medium text-sky-400 transition cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Upload className="w-4 h-4" />
                    <span>{t('hero.preview.upload')}</span>
                  </Link>
                  <Link
                    to="/app/backup"
                    className="flex-1 bg-card-hover/50 hover:bg-card-hover border border-border/40 hover:border-border rounded-lg py-2 text-center text-sm font-medium text-muted hover:text-foreground transition cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Database className="w-4 h-4" />
                    <span>{t('hero.preview.backup')}</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 bg-emerald-500/10 backdrop-blur border border-emerald-500/20 rounded-lg px-3 py-2 text-xs text-emerald-400 animate-pulse">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-emerald-400 rounded-full" />
                {t('hero.preview.processed')}
              </div>
            </div>

            <div className="absolute -bottom-4 -left-4 bg-indigo-500/10 backdrop-blur border border-indigo-500/20 rounded-lg px-3 py-2 text-xs text-indigo-400">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" />
                {t('hero.preview.restore')}
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted">
          <span className="text-xs">{t('hero.scrollHint')}</span>
          <div className="w-6 h-10 border-2 border-border rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-muted rounded-full animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  )
}
