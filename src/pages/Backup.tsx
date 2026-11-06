import { useState, useRef, useEffect } from 'react'
import { Download, Upload, Database, Settings, Brain, AlertCircle, CheckCircle, HelpCircle } from 'lucide-react'
import {
  exportBackupAsJSON,
  parseBackup,
  restoreFromBackup,
  estimateBackupSize,
  formatBytes,
  type BackupOptions
} from '@/utils/backup'
import useBookmarksStore from '@/store/useBookmarksStore'
import { t } from '@/locales'

export default function Backup() {
  const [isCreatingBackup, setIsCreatingBackup] = useState(false)
  const [isRestoring, setIsRestoring] = useState(false)
  const [message, setMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)
  const [backupSize, setBackupSize] = useState<number>(0)

  const [options, setOptions] = useState<BackupOptions>({
    includeBookmarks: true,
    includeAIConfig: true
  })

  const fileInputRef = useRef<HTMLInputElement>(null)
  const { loadFromDB } = useBookmarksStore()

  useEffect(() => {
    estimateBackupSize(options)
      .then(setBackupSize)
      .catch(() => setBackupSize(0))
  }, [options])

  async function handleCreateBackup() {
    setIsCreatingBackup(true)
    setMessage(null)

    try {
      const json = await exportBackupAsJSON(options)
      const blob = new Blob([json], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      const timestamp = new Date().toISOString().split('T')[0]
      a.download = `bookmarks_backup_${timestamp}.json`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)

      setMessage({ type: 'success', text: t('backup.success', { size: formatBytes(blob.size) }) })
    } catch (error) {
      setMessage({ type: 'error', text: t('backup.failed', { error: String(error) }) })
    } finally {
      setIsCreatingBackup(false)
    }
  }

  function handleFileSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    setIsRestoring(true)
    setMessage(null)

    const reader = new FileReader()
    reader.onload = async (e) => {
      try {
        const content = e.target?.result as string
        const parseResult = parseBackup(content)

        if (!parseResult.success || !parseResult.data) {
          setMessage({ type: 'error', text: parseResult.error || t('backup.parseFailed') })
          setIsRestoring(false)
          return
        }

        // Show confirmation dialog with stats
        const backup = parseResult.data
        const confirmMessage = [
          t('backup.confirmRestore'),
          '',
          t('backup.bookmarkCount', { count: backup.bookmarks?.length || 0 }),
          `${t('backup.aiConfigLabel')}: ${backup.aiConfig ? t('common.yes') : t('common.no')}`,
          '',
          t('backup.warning')
        ].join('\n')

        if (!confirm(confirmMessage)) {
          setIsRestoring(false)
          return
        }

        const restoreResult = await restoreFromBackup(parseResult.data, 'replace')

        if (restoreResult.success) {
          const stats = restoreResult.stats
          setMessage({
            type: 'success',
            text: t('backup.restoreSuccess', {
              bookmarks: stats.bookmarksRestored,
              aiConfig: stats.aiConfigRestored ? t('backup.aiConfigRestored') : ''
            })
          })
          // Reload bookmarks
          await loadFromDB(true)
        } else {
          setMessage({
            type: 'error',
            text: t('backup.restoreFailed', { error: restoreResult.error })
          })
        }
      } catch (error) {
        setMessage({ type: 'error', text: t('backup.restoreFailed', { error: String(error) }) })
      } finally {
        setIsRestoring(false)
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      }
    }

    reader.readAsText(file)
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="icon-badge h-11 w-11 bg-gradient-to-br from-sky-500/15 via-sky-500/10 to-indigo-500/15 border border-sky-500/20 text-sky-500 dark:text-sky-400">
            <Database className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold tracking-tight">{t('backup.pageTitle')}</h2>
        </div>

        <p className="text-muted text-sm mb-6 leading-relaxed">
          {t('backup.description')}
          <br />
          <span className="text-amber-500 dark:text-amber-400 font-medium">
            {t('backup.localNote')}
          </span>
        </p>

        {message && (
          <div
            className={`rounded-xl border p-4 flex items-center gap-3 mb-6 shadow-sm backdrop-blur-sm animate-fade-in-down ${
              message.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-600 dark:text-emerald-300'
                : 'bg-rose-500/10 border-rose-500/40 text-rose-600 dark:text-rose-300'
            }`}
          >
            {message.type === 'success' ? (
              <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-500 flex-shrink-0">
                <CheckCircle className="w-4 h-4" />
              </div>
            ) : (
              <div className="p-1.5 rounded-lg bg-rose-500/20 text-rose-500 flex-shrink-0">
                <AlertCircle className="w-4 h-4" />
              </div>
            )}
            <span className="text-sm font-medium">{message.text}</span>
          </div>
        )}

        {/* Backup Options */}
        <div className="rounded-xl border border-border/70 bg-card/40 p-5 mb-6">
          <div className="flex items-center gap-2 mb-4 text-sm font-semibold text-foreground">
            <div className="icon-badge h-8 w-8 bg-sky-500/10 text-sky-500 dark:text-sky-400">
              <Settings className="w-4 h-4" />
            </div>
            {t('backup.options')}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <label className="flex items-center gap-3 text-sm text-muted cursor-pointer rounded-xl border border-border/60 bg-card/50 px-4 py-3 transition-all hover:border-sky-500/40 hover:bg-card hover:shadow-subtle">
              <input
                type="checkbox"
                checked={options.includeBookmarks}
                onChange={(e) => setOptions((o) => ({ ...o, includeBookmarks: e.target.checked }))}
                className="rounded border-border text-sky-500 focus:ring-sky-500/40"
              />
              <Database className="w-4 h-4 text-sky-400 flex-shrink-0" />
              <span className="font-medium text-foreground">{t('backup.bookmarkData')}</span>
            </label>

            <label className="flex items-center gap-3 text-sm text-muted cursor-pointer rounded-xl border border-border/60 bg-card/50 px-4 py-3 transition-all hover:border-sky-500/40 hover:bg-card hover:shadow-subtle">
              <input
                type="checkbox"
                checked={options.includeAIConfig}
                onChange={(e) => setOptions((o) => ({ ...o, includeAIConfig: e.target.checked }))}
                className="rounded border-border text-sky-500 focus:ring-sky-500/40"
              />
              <Brain className="w-4 h-4 text-violet-400 flex-shrink-0" />
              <span className="font-medium text-foreground">{t('backup.aiConfigData')}</span>
            </label>
          </div>

          <div className="mt-4 pt-4 border-t border-border/60 text-xs text-muted flex items-center gap-2">
            <span>{t('backup.estimatedSize')}:</span>
            <span className="font-mono font-semibold text-foreground">{formatBytes(backupSize)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleCreateBackup}
            disabled={isCreatingBackup}
            className="btn-primary"
          >
            <Download className="w-4 h-4" />
            {isCreatingBackup ? t('backup.creating') : t('backup.create')}
          </button>

          <label className="btn-success cursor-pointer">
            <Upload className="w-4 h-4" />
            {isRestoring ? t('backup.restoring') : t('backup.restore')}
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileSelect}
              disabled={isRestoring}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* FAQ */}
      <div className="glass-card p-6">
        <h3 className="flex items-center gap-2 font-semibold text-foreground mb-5">
          <div className="icon-badge h-8 w-8 bg-violet-500/10 text-violet-500 dark:text-violet-400">
            <HelpCircle className="w-4 h-4" />
          </div>
          {t('backup.faq.title')}
        </h3>

        <div className="space-y-4 text-sm text-muted">
          <div className="rounded-xl border border-border/60 bg-card/40 p-4">
            <div className="text-foreground font-medium mb-1.5">{t('backup.faq.q1')}</div>
            <p className="leading-relaxed">{t('backup.faq.a1')}</p>
          </div>

          <div className="rounded-xl border border-border/60 bg-card/40 p-4">
            <div className="text-foreground font-medium mb-1.5">{t('backup.faq.q2')}</div>
            <p className="leading-relaxed">{t('backup.faq.a2')}</p>
          </div>

          <div className="rounded-xl border border-border/60 bg-card/40 p-4">
            <div className="text-foreground font-medium mb-1.5">{t('backup.faq.q3')}</div>
            <p className="leading-relaxed">{t('backup.faq.a3')}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
