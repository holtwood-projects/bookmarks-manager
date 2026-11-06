import { useMemo, useRef, useState, type ChangeEvent } from 'react'
import { Upload, FileText, Trash2, Download, AlertCircle, CheckCircle } from 'lucide-react'
import useBookmarksStore from '@/store/useBookmarksStore'
import type { ExportFormat } from '@/utils/exporters'
import { getExportFileExtension, getExportMimeType } from '@/utils/exporters'
import { EXPORT_FORMAT_OPTIONS } from '@/utils/exporters/formats'
import { downloadFile } from '@/utils/download'
import { t } from '@/locales'

export default function UploadMerge() {
  const {
    rawItems,
    mergedItems,
    duplicates,
    importing,
    merging,
    loading,
    stage,
    needsMerge,
    hasFullMergeData,
    importFiles,
    mergeAndDedup,
    clear,
    exportAsFormat,
    removeSourceFile
  } = useBookmarksStore()

  const readyToExport = mergedItems.length > 0 && !needsMerge
  const hasRestoredSnapshot = mergedItems.length > 0 && rawItems.length === 0 && !hasFullMergeData
  const busy = importing || merging || loading || Boolean(stage)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const dragCounter = useRef(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const importedFiles = useMemo(() => {
    const counts = new Map<string, number>()
    for (const it of rawItems) {
      const key = it.sourceFile || 'Unknown'
      counts.set(key, (counts.get(key) || 0) + 1)
    }
    return Array.from(counts.entries()).sort((a, b) => a[0].localeCompare(b[0]))
  }, [rawItems])

  const isBookmarkFile = (f: File) => {
    const name = f.name.toLowerCase()
    const validExtensions = ['.html', '.htm']
    const validTypes = ['text/html', 'application/xhtml+xml']
    const isValidByName = validExtensions.some((ext) => name.endsWith(ext))
    const isValidByType = validTypes.some((type) => f.type === type) || f.type === '' // empty type for some OS
    return isValidByName && isValidByType
  }

  const getInvalidFiles = (files: File[]) => {
    return files.filter((f) => !isBookmarkFile(f))
  }

  async function doImport(files: FileList | File[]) {
    if (busy) return
    const list = Array.isArray(files) ? files : Array.from(files)
    const accepted = list.filter(isBookmarkFile)
    const rejected = getInvalidFiles(list)

    if (accepted.length === 0) {
      const rejectedNames = rejected
        .slice(0, 3)
        .map((f) => f.name)
        .join(', ')
      const moreCount = rejected.length > 3 ? `... +${rejected.length - 3}` : ''
      setMessage({
        type: 'error',
        text:
          t('upload.invalidFiles') +
          (rejectedNames
            ? `\n${t('upload.rejectedFiles', { names: rejectedNames, more: moreCount })}`
            : '')
      })
      return
    }

    setMessage(null)
    try {
      const importedCount = await importFiles(accepted)
      const successMsg =
        rejected.length > 0
          ? t('upload.importPartialSuccess', {
              accepted: accepted.length,
              rejected: rejected.length,
              bookmarks: importedCount
            })
          : t('upload.importSuccess', { count: accepted.length, bookmarks: importedCount })
      setMessage({ type: 'success', text: successMsg })
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : t('common.unknownError')
      setMessage({ type: 'error', text: t('upload.importFailed', { error: errorMsg }) })
    }
  }

  async function onChange(e: ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files || files.length === 0) return
    await doImport(files)
    e.target.value = ''
  }

  async function onMerge() {
    if (busy) return
    if (rawItems.length === 0) {
      setMessage({ type: 'error', text: t('upload.importFirst') })
      return
    }
    setMessage(null)
    try {
      await mergeAndDedup()
      setMessage({ type: 'success', text: t('upload.mergeComplete') })
    } catch {
      setMessage({ type: 'error', text: t('upload.mergeFailed') })
    }
  }

  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('html')

  function onExport(format: ExportFormat = selectedFormat) {
    try {
      const content = exportAsFormat(format)
      const timestamp = new Date().toISOString().split('T')[0]
      const ext = getExportFileExtension(format)
      const filename = `bookmarks_merged_${timestamp}.${ext}`
      downloadFile(content, filename, getExportMimeType(format))
      setMessage({
        type: 'success',
        text: t('upload.exportSuccess', { format: format.toUpperCase() })
      })
    } catch {
      setMessage({ type: 'error', text: t('upload.exportFailed') })
    }
  }

  return (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="icon-badge h-9 w-9 bg-sky-500/10 text-sky-500 dark:text-sky-400">
            <Upload className="w-4.5 h-4.5" />
          </div>
          <h3 className="font-semibold text-foreground">{t('upload.selectFiles')}</h3>
        </div>
        <label className="block cursor-pointer">
          <div
            onDragEnter={(e) => {
              e.preventDefault()
              e.stopPropagation()
              dragCounter.current += 1
              setDragActive(true)
            }}
            onDragOver={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setDragActive(true)
            }}
            onDragLeave={(e) => {
              e.preventDefault()
              e.stopPropagation()
              dragCounter.current -= 1
              if (dragCounter.current <= 0) {
                dragCounter.current = 0
                setDragActive(false)
              }
            }}
            onDrop={(e) => {
              e.preventDefault()
              e.stopPropagation()
              dragCounter.current = 0
              setDragActive(false)
              void doImport(Array.from(e.dataTransfer.files))
            }}
            className={`group relative overflow-hidden border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-300 ${
              dragActive
                ? 'border-sky-500 bg-sky-500/10 shadow-glow-sky scale-[1.008]'
                : 'border-border/80 bg-card/50 hover:bg-card/75 hover:border-sky-500/50 hover:shadow-card'
            } ${busy ? 'opacity-60 pointer-events-none' : ''}`}
          >
            <div className="pointer-events-none absolute -top-12 left-1/2 -translate-x-1/2 h-32 w-64 rounded-full bg-gradient-to-b from-sky-500/10 to-transparent blur-2xl" />
            <div className="relative z-10 flex flex-col items-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500/15 via-sky-500/10 to-indigo-500/15 border border-sky-500/20 text-sky-500 dark:text-sky-400 shadow-sm mb-4 transition-transform duration-300 group-hover:scale-110">
                <FileText className="w-8 h-8" />
              </div>
              <div className="text-base font-semibold text-foreground mb-1.5">{t('upload.dragOrClick')}</div>
              <div className="text-xs text-muted mb-5 max-w-sm leading-relaxed">{t('upload.supportedFormats')}</div>
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-400 hover:to-indigo-400 text-white text-sm font-semibold shadow-md shadow-sky-500/20 hover:shadow-sky-500/35 active:scale-[0.98] transition-all">
                <Upload className="w-4 h-4" />
                <span>{t('upload.selectFiles')}</span>
              </div>
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".html,.htm"
            disabled={busy}
            onChange={onChange}
            className="hidden"
          />
        </label>
      </div>

      {importedFiles.length > 0 && (
        <div className="rounded-2xl border border-border/80 p-6 bg-card/75 backdrop-blur-md shadow-sm">
          <div className="flex items-center justify-between mb-3.5">
            <div className="text-sm font-semibold text-foreground">{t('upload.importSessionFiles')}</div>
            <span className="text-xs text-muted font-mono">{importedFiles.length} files</span>
          </div>
          <div className="space-y-2.5">
            {importedFiles.map(([name, count]) => (
              <div
                key={name}
                className="flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-card/50 px-4 py-2.5 hover:bg-card hover:border-border transition-all"
              >
                <div className="min-w-0 flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-500 flex-shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-foreground truncate">{name}</div>
                    <div className="text-xs text-muted">
                      {t('upload.bookmarkCountShort', { count })}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    removeSourceFile(name)
                    setMessage({
                      type: 'success',
                      text: t('upload.fileRemoved', { name })
                    })
                  }}
                  disabled={busy}
                  className="px-3 py-1.5 rounded-lg bg-card hover:bg-rose-500/10 hover:text-rose-500 hover:border-rose-500/30 border border-border/70 text-muted text-xs font-medium transition active:scale-[0.97]"
                >
                  {t('upload.remove')}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {hasRestoredSnapshot && (
        <div className="rounded-xl border border-sky-500/25 bg-sky-500/10 backdrop-blur-sm p-3.5 text-sm text-sky-600 dark:text-sky-300 shadow-subtle flex items-center gap-3 animate-fade-in-down">
          <div className="p-1.5 rounded-lg bg-sky-500/20 text-sky-500 flex-shrink-0">
            <AlertCircle className="w-4 h-4" />
          </div>
          <span className="font-medium">{t('upload.restoredHint', { count: mergedItems.length })}</span>
        </div>
      )}

      {needsMerge && rawItems.length > 0 && (
        <div className="rounded-xl border p-4 flex items-start gap-3 bg-amber-500/10 border-amber-500/40 text-amber-600 dark:text-amber-300 shadow-sm backdrop-blur-sm">
          <div className="p-1 rounded-lg bg-amber-500/20 text-amber-500 flex-shrink-0 mt-0.5">
            <AlertCircle className="w-4 h-4" />
          </div>
          <div className="text-sm font-medium leading-relaxed">{t('upload.needsMergeWarning')}</div>
        </div>
      )}

      {message && (
        <div
          className={`rounded-xl border p-4 flex items-center gap-3 shadow-sm backdrop-blur-sm ${
            message.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-600 dark:text-emerald-300'
              : 'bg-rose-500/10 border-rose-500/40 text-rose-600 dark:text-rose-300'
          }`}
        >
          {message.type === 'success' ? (
            <div className="p-1 rounded-lg bg-emerald-500/20 text-emerald-500 flex-shrink-0">
              <CheckCircle className="w-4 h-4" />
            </div>
          ) : (
            <div className="p-1 rounded-lg bg-rose-500/20 text-rose-500 flex-shrink-0">
              <AlertCircle className="w-4 h-4" />
            </div>
          )}
          <span className="text-sm font-medium">{message.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="group rounded-2xl border border-border/80 p-5 bg-card/75 backdrop-blur-md shadow-sm hover:-translate-y-0.5 hover:border-sky-500/40 hover:shadow-card-hover transition-all duration-300">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted mb-1">{t('upload.rawItems')}</div>
          <div className="text-3xl font-extrabold tracking-tight text-sky-500 dark:text-sky-400">{rawItems.length}</div>
          <div className="text-xs text-muted mt-2">
            {rawItems.length > 0 ? t('upload.rawItemsLabel') : t('upload.noRawItems')}
          </div>
          <div className="mt-3 h-1 w-full rounded-full bg-border/40 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-sky-500 to-blue-500 rounded-full w-full opacity-80" />
          </div>
        </div>
        <div className="group rounded-2xl border border-border/80 p-5 bg-card/75 backdrop-blur-md shadow-sm hover:-translate-y-0.5 hover:border-emerald-500/40 hover:shadow-card-hover transition-all duration-300">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted mb-1">{t('upload.mergedItems')}</div>
          <div className="text-3xl font-extrabold tracking-tight text-emerald-500 dark:text-emerald-400">{mergedItems.length}</div>
          <div className="text-xs text-muted mt-2">
            {hasRestoredSnapshot ? t('upload.restoredLabel') : t('upload.mergedItemsLabel')}
          </div>
          <div className="mt-3 h-1 w-full rounded-full bg-border/40 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full w-full opacity-80" />
          </div>
        </div>
        <div className="group rounded-2xl border border-border/80 p-5 bg-card/75 backdrop-blur-md shadow-sm hover:-translate-y-0.5 hover:border-amber-500/40 hover:shadow-card-hover transition-all duration-300">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted mb-1">{t('upload.duplicateItems')}</div>
          <div className="text-3xl font-extrabold tracking-tight text-amber-500 dark:text-amber-400">{Object.keys(duplicates).length}</div>
          <div className="text-xs text-muted mt-2">
            {hasFullMergeData ? t('upload.duplicatesLabel') : t('upload.duplicatesUnavailable')}
          </div>
          <div className="mt-3 h-1 w-full rounded-full bg-border/40 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full w-full opacity-80" />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          disabled={busy}
          onClick={() => fileInputRef.current?.click()}
          className="px-5 py-2.5 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-sky-500 dark:text-sky-400 font-semibold transition active:scale-[0.98] flex items-center gap-2 shadow-subtle"
        >
          <Upload className="w-4 h-4" />
          {t('upload.selectFiles')}
        </button>
        <button
          disabled={busy}
          onClick={onMerge}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition shadow-md shadow-sky-500/25 active:scale-[0.98] flex items-center gap-2"
        >
          <CheckCircle className="w-4 h-4" />
          {t('upload.mergeButton')}
        </button>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex rounded-xl overflow-hidden border border-border/80 bg-card-hover/40 p-0.5 backdrop-blur-sm shadow-subtle">
            {EXPORT_FORMAT_OPTIONS.map((opt) => (
              <button
                key={opt.format}
                onClick={() => setSelectedFormat(opt.format)}
                disabled={busy || !readyToExport || mergedItems.length === 0}
                title={t(opt.descriptionKey)}
                className={`px-3 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed
                  ${selectedFormat === opt.format ? 'bg-emerald-600 text-white shadow-sm' : 'text-muted hover:text-foreground hover:bg-card-hover/80'}`}
              >
                {opt.icon}
                {opt.label}
              </button>
            ))}
          </div>
          <button
            disabled={busy || !readyToExport || mergedItems.length === 0}
            onClick={() => onExport()}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition shadow-md shadow-emerald-600/25 active:scale-[0.98] flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            {t('upload.exportButton', {
              format: EXPORT_FORMAT_OPTIONS.find((o) => o.format === selectedFormat)?.label
            })}
          </button>
        </div>
        <button
          disabled={busy}
          onClick={() => {
            if (!confirm(t('upload.clearConfirm'))) return
            void clear()
            setMessage(null)
          }}
          className="px-4 py-2.5 rounded-xl bg-card hover:bg-rose-500/10 hover:text-rose-500 hover:border-rose-500/30 border border-border text-muted disabled:opacity-50 disabled:cursor-not-allowed font-medium transition active:scale-[0.98] flex items-center gap-2 shadow-subtle"
        >
          <Trash2 className="w-4 h-4" />
          {t('upload.clearButton')}
        </button>
      </div>

      {stage && (
        <div className="flex items-center gap-2.5 text-sm text-muted py-1">
          <div className="w-4 h-4 border-2 border-sky-400 border-t-transparent rounded-full animate-spin shadow-sm" />
          <span className="font-medium">{stage}</span>
        </div>
      )}
    </div>
  )
}
