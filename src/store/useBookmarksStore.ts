import { create } from 'zustand'
import { parseNetscapeBookmarks, type Bookmark } from '@/utils/bookmarkParser'
import { normalizeUrl } from '@/utils/url'
import { exportBookmarks, type ExportFormat, type ExportOptions } from '@/utils/exporters'
import { normalizePath } from '@/utils/folders'
import { clearBookmarks, saveBookmarks, loadBookmarks, type StoredBookmark } from '@/utils/db'
import {
  countRemovedDuplicates,
  createBookmarkStats,
  processBookmarks,
  type BookmarkStats,
  type SimilarGroup
} from '@/utils/bookmarkProcessing'
import {
  createSearchIndex,
  resetSearchIndex,
  search as searchBookmarks,
  type SearchResultItem
} from '@/utils/search'
import { getWorkerClient, terminateWorker } from '@/workers/bookmarkWorkerClient'
import { t } from '@/locales'

type DerivedState = {
  mergedItems: Bookmark[]
  duplicates: Record<string, Bookmark[]>
  similarGroups: SimilarGroup[]
  stats: BookmarkStats
}

type LastAction = {
  label: string
  snapshot: DerivedState
}

type State = DerivedState & {
  rawItems: Bookmark[]
  restoredItems: Bookmark[]
  importing: boolean
  merging: boolean
  loading: boolean
  needsMerge: boolean
  hasFullMergeData: boolean
  stage: string
  useWorker: boolean
  lastAction: LastAction | null
  importFiles: (files: FileList | File[]) => Promise<number>
  removeSourceFile: (sourceFile: string) => void
  mergeAndDedup: () => Promise<void>
  clear: () => Promise<void>
  deleteBookmarks: (ids: string[], label?: string) => Promise<void>
  swapDuplicate: (groupKey: string, keepId: string) => Promise<void>
  restoreDuplicateGroup: (groupKey: string) => Promise<void>
  removeSimilarItems: (groupId: string, ids: string[]) => Promise<void>
  dismissSimilarGroup: (groupId: string) => Promise<void>
  undo: () => Promise<void>
  dismissUndo: () => void
  exportHTML: () => string
  exportAsFormat: (format: ExportFormat, options?: ExportOptions) => string
  loadFromDB: (clearWhenEmpty?: boolean) => Promise<void>
  search: (query: string) => SearchResultItem[]
  toggleWorker: () => void
}

const emptyStats: BookmarkStats = {
  total: 0,
  duplicates: 0,
  byDomain: {},
  byYear: {},
  byCategory: {}
}

const emptyDerived: DerivedState = {
  mergedItems: [],
  duplicates: {},
  similarGroups: [],
  stats: emptyStats
}

function buildStats(
  merged: Bookmark[],
  duplicates: Record<string, Bookmark[]>
): BookmarkStats {
  return createBookmarkStats(merged, countRemovedDuplicates(duplicates))
}

function snapshot(state: DerivedState): DerivedState {
  return {
    mergedItems: state.mergedItems,
    duplicates: state.duplicates,
    similarGroups: state.similarGroups,
    stats: state.stats
  }
}

function removeIdsFromDerived(state: DerivedState, ids: string[]): DerivedState {
  const removed = new Set(ids)
  const merged = state.mergedItems.filter((item) => !removed.has(item.id))
  const duplicates: Record<string, Bookmark[]> = {}

  for (const [key, group] of Object.entries(state.duplicates)) {
    const remaining = group.filter((item) => !removed.has(item.id))
    if (remaining.length === 0) continue

    if (remaining.length === 1) {
      if (!merged.some((item) => item.id === remaining[0].id)) {
        merged.push(remaining[0])
      }
      continue
    }

    duplicates[key] = remaining
    if (!merged.some((item) => item.id === remaining[0].id)) {
      merged.push(remaining[0])
    }
  }

  const similarGroups = state.similarGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => !removed.has(item.id))
    }))
    .filter((group) => group.items.length >= 2)

  return {
    mergedItems: merged,
    duplicates,
    similarGroups,
    stats: buildStats(merged, duplicates)
  }
}

const useBookmarksStore = create<State>((set, get) => {
  const invalidateDerivedData = () => {
    resetSearchIndex()
    set({
      ...emptyDerived,
      lastAction: null,
      restoredItems: [],
      needsMerge: true,
      hasFullMergeData: false
    })
  }

  const persistMergedItems = async (items: Bookmark[]) => {
    // Rebuild the in-memory index before awaiting IndexedDB so a user can
    // navigate to search immediately after an action or undo.
    createSearchIndex(items)
    const storedItems: StoredBookmark[] = items.map((item) => ({
      ...item,
      normalized: normalizeUrl(item.url)
    }))
    await saveBookmarks(storedItems)
  }

  const applyDerivedAction = async (label: string, next: DerivedState) => {
    const previous = snapshot(get())
    set({ ...next, lastAction: { label, snapshot: previous } })
    try {
      await persistMergedItems(next.mergedItems)
    } catch (error) {
      set({ ...previous, lastAction: null })
      createSearchIndex(previous.mergedItems)
      throw error
    }
  }

  return {
    ...emptyDerived,
    rawItems: [],
    restoredItems: [],
    importing: false,
    merging: false,
    loading: false,
    needsMerge: false,
    hasFullMergeData: false,
    stage: '',
    useWorker: typeof Worker !== 'undefined',
    lastAction: null,

    async importFiles(files) {
      set({ importing: true, stage: t('stage.importing') })
      try {
        const list = Array.isArray(files) ? files : Array.from(files)
        const all: Bookmark[] = []
        for (let i = 0; i < list.length; i++) {
          const f = list[i]
          set({ stage: t('stage.parsing', { file: f.name, current: i + 1, total: list.length }) })
          const text = await f.text()
          const items = parseNetscapeBookmarks(text, f.name).map((it) => ({
            ...it,
            path: normalizePath(it.path)
          }))
          all.push(...items)
        }

        if (all.length === 0 && list.length > 0) {
          throw new Error(t('upload.noBookmarksFound'))
        }

        const state = get()
        const hadDerivedData =
          state.mergedItems.length > 0 ||
          state.restoredItems.length > 0 ||
          state.hasFullMergeData

        // When the user starts a new import after reopening the app, the
        // active set came from IndexedDB. Seed the raw pool with it so a new
        // file adds to the existing library instead of replacing it.
        const existingRaw =
          state.rawItems.length === 0 && state.mergedItems.length > 0
            ? state.mergedItems
            : state.rawItems

        set({ rawItems: existingRaw.concat(all) })

        if (hadDerivedData) {
          invalidateDerivedData()
        } else {
          set({ needsMerge: true })
        }

        return all.length
      } finally {
        set({ importing: false, stage: '' })
      }
    },

    removeSourceFile(sourceFile: string) {
      const { rawItems } = get()
      const next = rawItems.filter((it) => (it.sourceFile || 'Unknown') !== sourceFile)
      if (next.length === rawItems.length) return

      if (next.length === 0) {
        void get().clear()
        return
      }

      set({ rawItems: next })
      invalidateDerivedData()
    },

    async mergeAndDedup() {
      set({ merging: true, stage: t('stage.merging') })
      try {
        const raw = get().rawItems
        const useWorker = get().useWorker && typeof Worker !== 'undefined' && raw.length > 500

        if (useWorker) {
          set({ stage: t('stage.workerProcessing') })
          const worker = getWorkerClient()
          try {
            const result = await worker.mergeAndDedup(raw, (stageMsg) => {
              const translated =
                stageMsg === 'normalizing'
                  ? t('stage.normalizing')
                  : stageMsg === 'computing'
                    ? t('stage.computingDuplicates')
                    : stageMsg
              set({ stage: translated })
            })

            const derived: DerivedState = {
              mergedItems: result.merged,
              duplicates: result.duplicates,
              similarGroups: result.similarGroups,
              stats: result.stats
            }

            set({
              ...derived,
              lastAction: null,
              restoredItems: [],
              needsMerge: false,
              hasFullMergeData: true
            })

            set({ stage: t('stage.saving') })
            await persistMergedItems(result.merged)
            return
          } catch (workerError) {
            console.error('Worker failed, falling back to main thread:', workerError)
            set({ useWorker: false })
            set({ stage: t('stage.workerFallback') })
          }
        }

        set({ stage: t('stage.computingClusters') })
        const result = processBookmarks(raw)
        const derived: DerivedState = {
          mergedItems: result.merged,
          duplicates: result.duplicates,
          similarGroups: result.similarGroups,
          stats: result.stats
        }

        set({
          ...derived,
          lastAction: null,
          restoredItems: [],
          needsMerge: false,
          hasFullMergeData: true
        })

        set({ stage: t('stage.saving') })
        await persistMergedItems(result.merged)
      } finally {
        set({ merging: false, stage: '' })
      }
    },

    async deleteBookmarks(ids, label) {
      const state = get()
      const removedCount = state.mergedItems.filter((item) => ids.includes(item.id)).length
      const next = removeIdsFromDerived(state, ids)
      await applyDerivedAction(
        label || t('duplicates.removedCount', { count: removedCount }),
        next
      )
    },

    async swapDuplicate(groupKey, keepId) {
      const state = get()
      const group = state.duplicates[groupKey]
      if (!group) return

      const selected = group.find((item) => item.id === keepId)
      if (!selected) return

      const currentKeep = group[0]
      const merged = state.mergedItems.map((item) =>
        item.id === currentKeep.id ? selected : item
      )
      if (!merged.some((item) => item.id === selected.id)) {
        merged.push(selected)
      }

      const duplicates = {
        ...state.duplicates,
        [groupKey]: [selected, ...group.filter((item) => item.id !== selected.id)]
      }

      await applyDerivedAction(t('duplicates.swappedKeep'), {
        mergedItems: merged,
        duplicates,
        similarGroups: state.similarGroups,
        stats: buildStats(merged, duplicates)
      })
    },

    async restoreDuplicateGroup(groupKey) {
      const state = get()
      const group = state.duplicates[groupKey]
      if (!group) return

      const merged = [...state.mergedItems]
      for (const item of group) {
        if (!merged.some((existing) => existing.id === item.id)) {
          merged.push(item)
        }
      }

      const duplicates = { ...state.duplicates }
      delete duplicates[groupKey]

      await applyDerivedAction(t('duplicates.restoredGroup', { count: group.length }), {
        mergedItems: merged,
        duplicates,
        similarGroups: state.similarGroups,
        stats: buildStats(merged, duplicates)
      })
    },

    async removeSimilarItems(groupId, ids) {
      const state = get()
      const group = state.similarGroups.find((candidate) => candidate.id === groupId)
      if (!group) return

      const idsToRemove = new Set(ids.filter((id) => group.items.some((item) => item.id === id)))
      if (idsToRemove.size === 0) return

      const next = removeIdsFromDerived(state, Array.from(idsToRemove))
      await applyDerivedAction(
        t('duplicates.similarRemoved', { count: idsToRemove.size }),
        next
      )
    },

    async dismissSimilarGroup(groupId) {
      const state = get()
      const group = state.similarGroups.find((candidate) => candidate.id === groupId)
      if (!group) return

      await applyDerivedAction(t('duplicates.similarDismissed'), {
        mergedItems: state.mergedItems,
        duplicates: state.duplicates,
        similarGroups: state.similarGroups.filter((candidate) => candidate.id !== groupId),
        stats: state.stats
      })
    },

    async undo() {
      const action = get().lastAction
      if (!action) return

      const previous = action.snapshot
      set({ ...previous, lastAction: null })
      try {
        await persistMergedItems(previous.mergedItems)
      } catch (error) {
        set({ lastAction: action })
        throw error
      }
    },

    dismissUndo() {
      set({ lastAction: null })
    },

    async loadFromDB(clearWhenEmpty = false) {
      set({ loading: true, stage: t('stage.restoring') })
      try {
        const stored = await loadBookmarks()
        if (stored.length > 0) {
          const restored = stored.map(({ normalized: _normalized, ...rest }) => rest)
          const stats = createBookmarkStats(restored, 0)
          set({
            rawItems: [],
            restoredItems: restored,
            mergedItems: restored,
            duplicates: {},
            similarGroups: [],
            lastAction: null,
            stats,
            needsMerge: false,
            hasFullMergeData: false
          })
          createSearchIndex(restored)
        } else if (clearWhenEmpty) {
          resetSearchIndex()
          set({
            rawItems: [],
            restoredItems: [],
            ...emptyDerived,
            lastAction: null,
            needsMerge: false,
            hasFullMergeData: false
          })
        }
      } catch (error) {
        console.error('Failed to load bookmarks from DB:', error)
      } finally {
        set({ loading: false, stage: '' })
      }
    },

    async clear() {
      resetSearchIndex()
      set({ stage: t('stage.clearing') })
      set({
        rawItems: [],
        restoredItems: [],
        ...emptyDerived,
        lastAction: null,
        needsMerge: false,
        hasFullMergeData: false
      })
      try {
        await clearBookmarks()
        terminateWorker()
      } catch (error) {
        console.error('Failed to clear bookmarks from DB:', error)
      } finally {
        set({ stage: '' })
      }
    },

    exportHTML() {
      return exportBookmarks(get().mergedItems, 'html')
    },

    exportAsFormat(format, options) {
      return exportBookmarks(get().mergedItems, format, options)
    },

    search(query) {
      return searchBookmarks(query)
    },

    toggleWorker() {
      set({ useWorker: !get().useWorker })
    }
  }
})

export default useBookmarksStore
