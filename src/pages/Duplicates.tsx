import { useMemo, useState } from 'react'
import {
  AlertCircle,
  Calendar,
  Check,
  Copy,
  Layers,
  RotateCcw,
  ScanSearch,
  Trash2
} from 'lucide-react'
import { t, getI18nLanguage } from '@/locales'
import useBookmarksStore from '@/store/useBookmarksStore'
import type { Bookmark } from '@/utils/bookmarkParser'
import { SafeExternalLink } from '@/ui/SafeExternalLink'

function formatDate(ts?: number) {
  if (!ts) return 'N/A'
  const locale = getI18nLanguage()
  return new Date(ts * 1000).toLocaleDateString(locale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

function BookmarkMeta({ item }: { item: Bookmark }) {
  return (
    <div className="flex flex-wrap items-center gap-3 mt-2.5 text-xs text-muted">
      {item.path && item.path.length > 0 && (
        <span className="chip">📁 {item.path.join(' / ')}</span>
      )}
      {item.addDate && (
        <span className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {formatDate(item.addDate)}
        </span>
      )}
      <span>{t('duplicates.source', { source: item.sourceFile })}</span>
    </div>
  )
}

export default function Duplicates() {
  const {
    duplicates,
    similarGroups,
    mergedItems,
    needsMerge,
    hasFullMergeData,
    swapDuplicate,
    restoreDuplicateGroup,
    removeSimilarItems,
    dismissSimilarGroup
  } = useBookmarksStore()

  const exactGroups = useMemo(() => Object.entries(duplicates), [duplicates])
  const removedExactCount = useMemo(
    () => exactGroups.reduce((sum, [, group]) => sum + Math.max(0, group.length - 1), 0),
    [exactGroups]
  )
  const similarItemCount = useMemo(
    () => similarGroups.reduce((sum, group) => sum + group.items.length, 0),
    [similarGroups]
  )
  const activeIds = useMemo(() => new Set(mergedItems.map((item) => item.id)), [mergedItems])

  const [selected, setSelected] = useState<Record<string, string[]>>({})
  const [busy, setBusy] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function run(key: string, action: () => Promise<void>) {
    setBusy(key)
    setError(null)
    try {
      await action()
    } catch (actionError) {
      setError(
        t('duplicates.actionFailed', {
          error: actionError instanceof Error ? actionError.message : String(actionError)
        })
      )
    } finally {
      setBusy(null)
    }
  }

  function toggleSelection(groupId: string, id: string) {
    setSelected((current) => {
      const ids = new Set(current[groupId] || [])
      if (ids.has(id)) ids.delete(id)
      else ids.add(id)
      return { ...current, [groupId]: Array.from(ids) }
    })
  }

  function toggleAll(groupId: string, ids: string[]) {
    setSelected((current) => {
      const selectedIds = current[groupId] || []
      const allSelected = ids.every((id) => selectedIds.includes(id))
      return { ...current, [groupId]: allSelected ? [] : ids }
    })
  }

  function deleteSimilarGroup(groupId: string, count: number) {
    if (!confirm(t('duplicates.deleteConfirm', { count }))) return
    return run(`similar-${groupId}`, async () => {
      const ids = selected[groupId] || []
      await removeSimilarItems(groupId, ids)
      setSelected((current) => ({ ...current, [groupId]: [] }))
    })
  }

  if (needsMerge) {
    return (
      <div className="text-center py-16 text-muted rounded-2xl border border-dashed border-border/70 bg-card/30">
        <AlertCircle className="w-12 h-12 mx-auto mb-3 text-amber-400 opacity-90" />
        <p className="font-medium">{t('duplicates.needsMerge')}</p>
        <p className="text-xs mt-2">{t('duplicates.needsMergeHint')}</p>
      </div>
    )
  }

  if (!hasFullMergeData && exactGroups.length === 0) {
    return (
      <div className="text-center py-16 text-muted rounded-2xl border border-dashed border-border/70 bg-card/30">
        <AlertCircle className="w-12 h-12 mx-auto mb-3 text-muted opacity-80" />
        <p className="font-medium">{t('duplicates.noFullMergeData')}</p>
        <p className="text-xs mt-2">{t('duplicates.noFullMergeDataHint')}</p>
      </div>
    )
  }

  const hasAnything = exactGroups.length > 0 || similarGroups.length > 0

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border/80 bg-card/70 backdrop-blur-md p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="icon-badge h-11 w-11 bg-gradient-to-br from-rose-500/15 via-rose-500/10 to-amber-500/15 border border-rose-500/20 text-rose-500 dark:text-rose-400">
              <ScanSearch className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight text-foreground">
                {t('duplicates.reviewTitle')}
              </h2>
              <p className="text-xs text-muted mt-1">{t('duplicates.reviewHint')}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="chip bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-300">
              <Layers className="w-3.5 h-3.5" />
              {t('duplicates.exactCount', { groups: exactGroups.length, items: removedExactCount })}
            </div>
            <div className="chip bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-300">
              <Copy className="w-3.5 h-3.5" />
              {t('duplicates.similarCount', {
                groups: similarGroups.length,
                items: similarItemCount
              })}
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 p-4 text-sm text-rose-600 dark:text-rose-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {!hasAnything && (
        <div className="text-center py-16 text-muted rounded-2xl border border-dashed border-border/70 bg-card/30">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500">
            <Check className="w-8 h-8" />
          </div>
          <p className="font-medium">{t('duplicates.empty')}</p>
          <p className="text-xs mt-2">{t('duplicates.noDuplicatesHint')}</p>
        </div>
      )}

      {exactGroups.length > 0 && (
        <section className="space-y-4">
          <div>
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Copy className="w-4 h-4 text-rose-500" />
              {t('duplicates.exactTitle')}
            </h3>
            <p className="text-xs text-muted mt-1">{t('duplicates.exactHint')}</p>
          </div>

          {exactGroups.map(([normalizedUrl, items], idx) => (
            <div key={normalizedUrl} className="glass-card overflow-hidden animate-fade-in-down">
              <div className="flex items-center justify-between gap-3 border-b border-border/60 bg-card-hover/40 px-5 py-3.5">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-amber-500 text-xs font-bold text-white shadow-sm">
                    {idx + 1}
                  </span>
                  <span className="text-sm font-semibold text-muted">
                    {t('duplicates.cluster', { index: idx + 1, count: items.length })}
                  </span>
                </div>
                <span className="text-xs font-mono text-muted truncate max-w-[45%] hidden sm:block">
                  {normalizedUrl}
                </span>
              </div>

              <div className="space-y-2.5 p-4">
                {items.map((item) => {
                  const isKept = activeIds.has(item.id)
                  return (
                    <div
                      key={item.id}
                      className={`group rounded-xl border p-3.5 transition-all duration-200 ${
                        isKept
                          ? 'bg-emerald-500/[0.06] border-emerald-500/25'
                          : 'bg-card-hover/40 border-border/60 hover:border-sky-500/40 hover:bg-card'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`icon-badge h-8 w-8 mt-0.5 ${
                            isKept
                              ? 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/25'
                              : 'bg-card-hover text-muted border border-border/60'
                          }`}
                        >
                          {isKept ? <Check className="w-4 h-4" /> : <Trash2 className="w-4 h-4" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <SafeExternalLink
                              href={item.url}
                              className="text-sky-500 hover:text-sky-400 text-sm font-medium break-all dark:text-sky-400 transition-colors"
                              unsafeClassName="text-sky-500 dark:text-sky-400 text-sm font-medium break-all"
                            >
                              {item.title || item.url}
                            </SafeExternalLink>
                            {isKept ? (
                              <span className="text-xs bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 px-2 py-0.5 rounded-full flex-shrink-0 font-medium">
                                {t('duplicates.keep')}
                              </span>
                            ) : (
                              <button
                                type="button"
                                disabled={busy !== null}
                                onClick={() =>
                                  run(`swap-${normalizedUrl}`, () =>
                                    swapDuplicate(normalizedUrl, item.id)
                                  )
                                }
                                className="text-xs px-2.5 py-1 rounded-lg border border-sky-500/30 bg-sky-500/10 text-sky-600 dark:text-sky-300 hover:bg-sky-500/20 disabled:opacity-50 transition"
                              >
                                {t('duplicates.setKeep')}
                              </button>
                            )}
                          </div>
                          <div className="text-xs text-muted mt-1 break-all font-mono opacity-80">
                            {item.url}
                          </div>
                          <BookmarkMeta item={item} />
                        </div>
                      </div>
                    </div>
                  )
                })}

                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    disabled={busy !== null}
                    onClick={() =>
                      run(`restore-${normalizedUrl}`, () =>
                        restoreDuplicateGroup(normalizedUrl)
                      )
                    }
                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-border/70 bg-card/60 text-muted hover:text-emerald-600 hover:border-emerald-500/30 hover:bg-emerald-500/10 disabled:opacity-50 transition"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    {t('duplicates.restoreGroup')}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </section>
      )}

      {exactGroups.length === 0 && hasAnything && (
        <div className="rounded-2xl border border-dashed border-border/70 bg-card/30 px-5 py-6 text-center text-sm text-muted">
          {t('duplicates.noExact')}
        </div>
      )}

      {similarGroups.length > 0 && (
        <section className="space-y-4">
          <div>
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <ScanSearch className="w-4 h-4 text-amber-500" />
              {t('duplicates.similarTitle')}
            </h3>
            <p className="text-xs text-muted mt-1">{t('duplicates.similarHint')}</p>
          </div>

          {similarGroups.map((group, idx) => {
            const groupSelected = selected[group.id] || []
            const allSelected = group.items.every((item) => groupSelected.includes(item.id))
            return (
              <div key={group.id} className="glass-card overflow-hidden">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 bg-card-hover/40 px-5 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-orange-500 text-xs font-bold text-white shadow-sm">
                      {idx + 1}
                    </span>
                    <span className="text-sm font-semibold text-muted">
                      {t('duplicates.similarGroup', { index: idx + 1 })}
                    </span>
                    {group.host && (
                      <span className="text-xs font-mono text-muted hidden sm:inline">
                        {group.host}
                      </span>
                    )}
                  </div>
                  <span className="chip bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-300">
                    {t('duplicates.similarScore', { score: Math.round(group.score * 100) })}
                  </span>
                </div>

                <div className="space-y-2.5 p-4">
                  {group.items.map((item) => {
                    const checked = groupSelected.includes(item.id)
                    return (
                      <label
                        key={item.id}
                        className={`flex items-start gap-3 rounded-xl border p-3.5 cursor-pointer transition-all duration-200 ${
                          checked
                            ? 'border-rose-500/40 bg-rose-500/[0.06]'
                            : 'border-border/60 bg-card-hover/40 hover:border-sky-500/40 hover:bg-card'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleSelection(group.id, item.id)}
                          className="mt-1.5 rounded border-border text-rose-500 focus:ring-rose-500/40"
                        />
                        <div className="flex-1 min-w-0">
                          <SafeExternalLink
                            href={item.url}
                            className="text-sky-500 hover:text-sky-400 text-sm font-medium break-all dark:text-sky-400 transition-colors"
                            unsafeClassName="text-sky-500 dark:text-sky-400 text-sm font-medium break-all"
                          >
                            {item.title || item.url}
                          </SafeExternalLink>
                          <div className="text-xs text-muted mt-1 break-all font-mono opacity-80">
                            {item.url}
                          </div>
                          <BookmarkMeta item={item} />
                        </div>
                      </label>
                    )
                  })}

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() =>
                        toggleAll(
                          group.id,
                          group.items.map((item) => item.id)
                        )
                      }
                      className="text-xs px-3 py-1.5 rounded-lg border border-border/70 bg-card/60 text-muted hover:text-foreground transition"
                    >
                      {allSelected ? t('duplicates.clearSelection') : t('duplicates.selectAll')}
                    </button>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={busy !== null}
                        onClick={() => run(`dismiss-${group.id}`, () => dismissSimilarGroup(group.id))}
                        className="text-xs px-3 py-1.5 rounded-lg border border-border/70 bg-card/60 text-muted hover:text-emerald-600 hover:border-emerald-500/30 hover:bg-emerald-500/10 disabled:opacity-50 transition"
                      >
                        {t('duplicates.dismissGroup')}
                      </button>
                      <button
                        type="button"
                        disabled={busy !== null || groupSelected.length === 0}
                        onClick={() => deleteSimilarGroup(group.id, groupSelected.length)}
                        className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-rose-600 text-white hover:bg-rose-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        {t('duplicates.deleteSelected', { count: groupSelected.length })}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </section>
      )}

      {similarGroups.length === 0 && hasAnything && (
        <div className="rounded-2xl border border-dashed border-border/70 bg-card/30 px-5 py-6 text-center text-sm text-muted">
          {t('duplicates.noSimilar')}
        </div>
      )}
    </div>
  )
}
