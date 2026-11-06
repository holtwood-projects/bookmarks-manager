import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Search as SearchIcon,
  ExternalLink,
  Folder,
  Filter,
  Download,
  AlertCircle,
  CheckCircle,
  Trash2
} from 'lucide-react'
import { t } from '@/locales'
import useBookmarksStore from '@/store/useBookmarksStore'
import type { SearchResultItem } from '@/utils/search'
import type { Bookmark } from '@/utils/bookmarkParser'
import {
  exportBookmarks,
  type ExportFormat,
  getExportFileExtension,
  getExportMimeType
} from '@/utils/exporters'
import { getHostname } from '@/utils/url'
import { VirtualList } from '@/ui/VirtualList'
import { SafeExternalLink } from '@/ui/SafeExternalLink'
import { EXPORT_FORMAT_OPTIONS } from '@/utils/exporters/formats'
import { downloadFile } from '@/utils/download'

export default function Search() {
  const { search, deleteBookmarks, mergedItems, needsMerge } = useBookmarksStore()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResultItem[]>([])
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const [domain, setDomain] = useState('')
  const [rootFolder, setRootFolder] = useState('')
  const [folderKeyword, setFolderKeyword] = useState('')
  const [dateStart, setDateStart] = useState('')
  const [dateEnd, setDateEnd] = useState('')

  const [exportScope, setExportScope] = useState<'filtered' | 'all'>('filtered')
  const [preserveFolders, setPreserveFolders] = useState(true)
  const [exportFormat, setExportFormat] = useState<ExportFormat>('html')
  const [limit, setLimit] = useState(50)

  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const byId = useMemo(() => {
    const map = new Map<string, Bookmark>()
    for (const it of mergedItems) map.set(it.id, it)
    return map
  }, [mergedItems])

  const baseItems = useMemo(() => {
    if (query.trim()) {
      const arr: Bookmark[] = []
      for (const r of results) {
        const it = byId.get(r.id)
        if (it) arr.push(it)
      }
      return arr
    }
    return mergedItems
  }, [byId, mergedItems, query, results])

  const domainOptions = useMemo(() => {
    const counts = new Map<string, number>()
    for (const it of mergedItems) {
      const host = getHostname(it.url) || 'unknown'
      counts.set(host, (counts.get(host) || 0) + 1)
    }
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1])
  }, [mergedItems])

  const rootFolderOptions = useMemo(() => {
    const counts = new Map<string, number>()
    for (const it of mergedItems) {
      const key = it.path && it.path.length > 0 ? it.path[0] : t('search.noFolder')
      counts.set(key, (counts.get(key) || 0) + 1)
    }
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1])
  }, [mergedItems])

  const filteredItems = useMemo(() => {
    let items = baseItems

    if (domain) {
      items = items.filter((it) => (getHostname(it.url) || 'unknown') === domain)
    }

    if (rootFolder) {
      items = items.filter((it) => {
        const key = it.path && it.path.length > 0 ? it.path[0] : t('search.noFolder')
        return key === rootFolder
      })
    }

    const kw = folderKeyword.trim().toLowerCase()
    if (kw) {
      items = items.filter((it) => (it.path || []).join(' / ').toLowerCase().includes(kw))
    }

    if (dateStart || dateEnd) {
      const startTs = dateStart
        ? Math.floor(new Date(`${dateStart}T00:00:00`).getTime() / 1000)
        : null
      const endTs = dateEnd ? Math.floor(new Date(`${dateEnd}T23:59:59`).getTime() / 1000) : null
      items = items.filter((it) => {
        const ts = it.addDate ?? it.lastModified
        if (typeof ts !== 'number') return false
        if (startTs !== null && ts < startTs) return false
        if (endTs !== null && ts > endTs) return false
        return true
      })
    }

    return items
  }, [baseItems, dateEnd, dateStart, domain, folderKeyword, rootFolder])

  const displayItems = useMemo(() => filteredItems.slice(0, limit), [filteredItems, limit])
  const hasActiveFilters = Boolean(
    domain || rootFolder || folderKeyword.trim() || dateStart || dateEnd
  )

  useEffect(() => {
    setLimit(50)
  }, [query, domain, rootFolder, folderKeyword, dateStart, dateEnd])

  function escapeRegExp(str: string) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  }

  function highlightText(text: string, q: string) {
    const tokens = q.trim().split(/\s+/).filter(Boolean)
    if (tokens.length === 0) return text
    const re = new RegExp(`(${tokens.map(escapeRegExp).join('|')})`, 'gi')
    const parts = text.split(re)
    return parts.map((part, i) =>
      i % 2 === 1 ? (
        <mark
          key={`${part}-${i}`}
          className="rounded bg-sky-500/20 px-1 text-sky-600 dark:text-sky-200"
        >
          {part}
        </mark>
      ) : (
        <span key={`${part}-${i}`}>{part}</span>
      )
    )
  }

  function handleSearch(q: string) {
    setQuery(q)
  }

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    searchTimeoutRef.current = setTimeout(() => {
      if (query.trim()) {
        setResults(search(query.trim()))
      } else {
        setResults([])
      }
    }, 200)

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [mergedItems, query, search])

  function resetFilters() {
    setDomain('')
    setRootFolder('')
    setFolderKeyword('')
    setDateStart('')
    setDateEnd('')
  }

  async function deleteBookmark(item: Bookmark) {
    const title = item.title || item.url
    if (!confirm(t('search.deleteConfirm', { title }))) return

    try {
      await deleteBookmarks([item.id])
      if (query.trim()) {
        setResults(search(query.trim()))
      }
    } catch {
      setMessage({ type: 'error', text: t('search.deleteFailed') })
    }
  }

  function onExport() {
    try {
      const items = exportScope === 'all' ? mergedItems : filteredItems
      if (items.length === 0) {
        setMessage({ type: 'error', text: t('search.noExport') })
        return
      }

      const content = exportBookmarks(items, exportFormat, {
        preserveFolders,
        includeMetadata: exportFormat === 'json' || exportFormat === 'csv'
      })

      const timestamp = new Date().toISOString().split('T')[0]
      const scopeTag = exportScope === 'all' ? 'all' : 'filtered'
      const folderTag = preserveFolders ? 'tree' : 'flat'
      const ext = getExportFileExtension(exportFormat)
      const filename = `bookmarks_${scopeTag}_${folderTag}_${timestamp}.${ext}`

      downloadFile(content, filename, getExportMimeType(exportFormat))
      setMessage({
        type: 'success',
        text: t('search.exportedAs', { format: exportFormat.toUpperCase() })
      })
    } catch {
      setMessage({ type: 'error', text: t('search.exportFailed') })
    }
  }

  if (needsMerge) {
    return (
      <div className="text-center py-12 text-muted">
        <AlertCircle className="w-12 h-12 mx-auto mb-3 text-amber-400 opacity-80" />
        <p>{t('search.needsMerge')}</p>
        <p className="text-xs mt-2">{t('search.needsMergeHint')}</p>
      </div>
    )
  }

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      <div className="group relative">
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted transition-colors duration-200 group-focus-within:text-sky-500" />
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder={t('search.placeholderFull')}
          className="input-base pl-12 pr-12 py-3.5 rounded-2xl text-base shadow-card transition-all duration-300 hover:shadow-card-hover focus:shadow-glow-sky"
        />
        {query && (
          <button
            onClick={() => handleSearch('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded-full bg-card-hover text-muted transition-colors hover:bg-rose-500/10 hover:text-rose-500"
            aria-label={t('search.clear')}
          >
            <span className="text-sm leading-none">×</span>
          </button>
        )}
      </div>

      {mergedItems.length > 0 && (
        <div className="glass-card p-5 space-y-5 animate-fade-in-down">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <div className="icon-badge h-8 w-8 bg-sky-500/10 text-sky-500 dark:text-sky-400">
                <Filter className="w-4 h-4" />
              </div>
              {t('search.advancedFilter')}
            </div>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="text-xs px-3 py-1.5 rounded-lg bg-card hover:bg-rose-500/10 hover:text-rose-500 border border-border text-muted transition-colors"
              >
                {t('search.reset')}
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <label className="space-y-1.5">
              <div className="text-xs font-medium text-muted">{t('search.domain')}</div>
              <select
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="input-base"
              >
                <option value="">{t('search.allDomains')}</option>
                {domainOptions.map(([host, count]) => (
                  <option key={host} value={host}>
                    {host} ({count})
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-1.5">
              <div className="text-xs font-medium text-muted">{t('search.rootFolder')}</div>
              <select
                value={rootFolder}
                onChange={(e) => setRootFolder(e.target.value)}
                className="input-base"
              >
                <option value="">{t('search.allFolders')}</option>
                {rootFolderOptions.map(([name, count]) => (
                  <option key={name} value={name}>
                    {name} ({count})
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-1.5">
              <div className="text-xs font-medium text-muted">{t('search.folderKeyword')}</div>
              <input
                type="text"
                value={folderKeyword}
                onChange={(e) => setFolderKeyword(e.target.value)}
                placeholder={t('search.folderKeywordPlaceholder')}
                className="input-base"
              />
            </label>

            <div className="grid grid-cols-2 gap-2">
              <label className="space-y-1.5">
                <div className="text-xs font-medium text-muted">{t('search.dateStart')}</div>
                <input
                  type="date"
                  value={dateStart}
                  onChange={(e) => setDateStart(e.target.value)}
                  className="input-base"
                />
              </label>
              <label className="space-y-1.5">
                <div className="text-xs font-medium text-muted">{t('search.dateEnd')}</div>
                <input
                  type="date"
                  value={dateEnd}
                  onChange={(e) => setDateEnd(e.target.value)}
                  className="input-base"
                />
              </label>
            </div>
          </div>

          <div className="pt-4 border-t border-border/60">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <div className="icon-badge h-8 w-8 bg-emerald-500/10 text-emerald-500 dark:text-emerald-400">
                  <Download className="w-4 h-4" />
                </div>
                {t('search.export')}
              </div>

              <div className="flex items-center gap-1 rounded-xl border border-border/70 bg-card/50 p-1">
                <button
                  onClick={() => setExportScope('filtered')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    exportScope === 'filtered'
                      ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-sm'
                      : 'text-muted hover:text-foreground'
                  }`}
                >
                  {t('search.currentResults')} ({filteredItems.length})
                </button>
                <button
                  onClick={() => setExportScope('all')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    exportScope === 'all'
                      ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-sm'
                      : 'text-muted hover:text-foreground'
                  }`}
                >
                  {t('search.all')} ({mergedItems.length})
                </button>
              </div>

              <label className="flex items-center gap-2 text-sm text-muted cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={preserveFolders}
                  onChange={(e) => setPreserveFolders(e.target.checked)}
                  className="rounded border-border text-sky-500 focus:ring-sky-500/40"
                />
                {t('search.preserveFolder')}
              </label>

              <div className="ml-auto flex items-center gap-2">
                <select
                  value={exportFormat}
                  onChange={(e) => setExportFormat(e.target.value as ExportFormat)}
                  className="input-base w-auto"
                >
                  {EXPORT_FORMAT_OPTIONS.map((opt) => (
                    <option key={opt.format} value={opt.format}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <button
                  onClick={onExport}
                  className="btn-success"
                  disabled={
                    exportScope === 'all' ? mergedItems.length === 0 : filteredItems.length === 0
                  }
                >
                  <Download className="w-4 h-4" />
                  {t('search.exportButton', {
                    format: EXPORT_FORMAT_OPTIONS.find((o) => o.format === exportFormat)?.label
                  })}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {message && (
        <div
          className={`rounded-xl border p-4 flex items-center gap-3 shadow-sm backdrop-blur-sm animate-fade-in-down ${
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

      {mergedItems.length === 0 && (
        <div className="text-center py-14 text-muted rounded-2xl border border-dashed border-border/70 bg-card/30">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-card-hover/70 text-muted">
            <SearchIcon className="w-8 h-8" />
          </div>
          <p className="font-medium">{t('search.importFirst')}</p>
        </div>
      )}

      {(query || hasActiveFilters) && filteredItems.length === 0 && mergedItems.length > 0 && (
        <div className="text-center py-14 text-muted rounded-2xl border border-dashed border-border/70 bg-card/30">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-card-hover/70 text-muted">
            <Filter className="w-8 h-8" />
          </div>
          <p className="font-medium">{t('search.noMatch')}</p>
        </div>
      )}

      {(query || hasActiveFilters) && filteredItems.length > 0 && (
        <div>
          <div className="flex items-center gap-2 text-sm text-muted mb-3">
            <div className="icon-badge h-7 w-7 bg-sky-500/10 text-sky-500 dark:text-sky-400">
              <SearchIcon className="w-3.5 h-3.5" />
            </div>
            <span className="font-medium">{t('search.found', { count: filteredItems.length })}</span>
            {query && results.length > 0 && (
              <span className="text-muted-foreground">
                {t('search.searchHits', { count: results.length })}
              </span>
            )}
          </div>

          {/* Use virtual list for large datasets (>200 items) */}
          {filteredItems.length > 200 ? (
            <VirtualList
              items={filteredItems}
              itemHeight={112}
              containerHeight={600}
              renderItem={(item) => (
                <div className="group mx-1 rounded-xl bg-card/70 border border-border/80 p-4 hover:border-sky-500/40 hover:shadow-card-hover transition-all duration-200">
                  <div className="flex items-start gap-3">
                    <div className="icon-badge h-8 w-8 bg-sky-500/10 text-sky-500 dark:text-sky-400 mt-0.5 transition-transform group-hover:scale-105">
                      <ExternalLink className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <SafeExternalLink
                        href={item.url}
                        className="text-sky-500 hover:text-sky-400 font-medium break-all dark:text-sky-400 transition-colors"
                        unsafeClassName="text-sky-500 dark:text-sky-400 font-medium break-all"
                      >
                        {highlightText(item.title || item.url, query)}
                      </SafeExternalLink>
                      <div className="text-xs text-muted mt-1 break-all font-mono opacity-80">
                        {highlightText(item.url, query)}
                      </div>
                      {item.path && item.path.length > 0 && (
                        <div className="chip mt-2">
                          <Folder className="w-3 h-3" />
                          <span>{highlightText(item.path.join(' / '), query)}</span>
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => void deleteBookmark(item)}
                      className="p-2 rounded-lg text-muted hover:text-rose-500 hover:bg-rose-500/10 transition-colors flex-shrink-0"
                      aria-label={t('search.delete')}
                      title={t('search.delete')}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            />
          ) : (
            <div className="space-y-2">
              {displayItems.map((item) => (
                <div
                  key={item.id}
                  className="group rounded-xl bg-card/70 border border-border/80 p-4 hover:border-sky-500/40 hover:shadow-card-hover transition-all duration-200 animate-fade-in"
                >
                  <div className="flex items-start gap-3">
                    <div className="icon-badge h-8 w-8 bg-sky-500/10 text-sky-500 dark:text-sky-400 mt-0.5 transition-transform group-hover:scale-105">
                      <ExternalLink className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <SafeExternalLink
                        href={item.url}
                        className="text-sky-500 hover:text-sky-400 font-medium break-all dark:text-sky-400 transition-colors"
                        unsafeClassName="text-sky-500 dark:text-sky-400 font-medium break-all"
                      >
                        {highlightText(item.title || item.url, query)}
                      </SafeExternalLink>
                      <div className="text-xs text-muted mt-1 break-all font-mono opacity-80">
                        {highlightText(item.url, query)}
                      </div>
                      {item.path && item.path.length > 0 && (
                        <div className="chip mt-2">
                          <Folder className="w-3 h-3" />
                          <span>{highlightText(item.path.join(' / '), query)}</span>
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => void deleteBookmark(item)}
                      className="p-2 rounded-lg text-muted hover:text-rose-500 hover:bg-rose-500/10 transition-colors flex-shrink-0"
                      aria-label={t('search.delete')}
                      title={t('search.delete')}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              {filteredItems.length > limit && (
                <button
                  onClick={() => setLimit(limit + 50)}
                  className="w-full py-3 text-sm font-medium text-muted hover:text-sky-500 transition-colors border border-dashed border-border/80 rounded-xl hover:border-sky-500/40 hover:bg-sky-500/5"
                >
                  {t('search.loadMore', { count: filteredItems.length - limit })}
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
