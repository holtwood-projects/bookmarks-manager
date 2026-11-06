import { describe, it, expect, beforeEach } from 'vitest'
import useBookmarksStore from './useBookmarksStore'
import { db } from '@/utils/db'
import type { StoredBookmark } from '@/utils/db'
import type { Bookmark } from '@/utils/bookmarkParser'

const bookmark = (overrides: Partial<Bookmark> = {}): Bookmark => ({
  id: crypto.randomUUID(),
  title: 'Example',
  url: 'https://example.com',
  path: ['Root'],
  sourceFile: 'bookmarks.html',
  addDate: 1700000000,
  ...overrides
})

const storedBookmark = (overrides: Partial<StoredBookmark> = {}): StoredBookmark => ({
  ...bookmark(),
  normalized: 'https://example.com/',
  ...overrides
})

describe('useBookmarksStore', () => {
  beforeEach(async () => {
    await db.bookmarks.clear()
    useBookmarksStore.setState({
      rawItems: [],
      restoredItems: [],
      mergedItems: [],
      duplicates: {},
      similarGroups: [],
      lastAction: null,
      importing: false,
      merging: false,
      loading: false,
      needsMerge: false,
      hasFullMergeData: false,
      stage: '',
      stats: { total: 0, duplicates: 0, byDomain: {}, byYear: {}, byCategory: {} }
    })
  })

  it('loadFromDB restores only merged snapshot state', async () => {
    await db.bookmarks.bulkAdd([
      storedBookmark({ id: '1', url: 'https://a.com', normalized: 'https://a.com/' }),
      storedBookmark({ id: '2', url: 'https://b.com', normalized: 'https://b.com/' })
    ])

    await useBookmarksStore.getState().loadFromDB()
    const state = useBookmarksStore.getState()

    expect(state.rawItems).toEqual([])
    expect(state.restoredItems).toHaveLength(2)
    expect(state.mergedItems).toHaveLength(2)
    expect(state.hasFullMergeData).toBe(false)
    expect(state.needsMerge).toBe(false)
    expect(state.duplicates).toEqual({})
    expect(state.stats.total).toBe(2)
  })

  it('removeSourceFile invalidates stale derived data', () => {
    const first = bookmark({ id: '1', sourceFile: 'a.html', url: 'https://a.com' })
    const second = bookmark({ id: '2', sourceFile: 'b.html', url: 'https://b.com' })

    useBookmarksStore.setState({
      rawItems: [first, second],
      restoredItems: [],
      mergedItems: [first],
      duplicates: { dup: [first, second] },
      needsMerge: false,
      hasFullMergeData: true,
      stats: { total: 1, duplicates: 1, byDomain: { 'a.com': 1 }, byYear: { '2023': 1 }, byCategory: {} }
    })

    useBookmarksStore.getState().removeSourceFile('a.html')
    const state = useBookmarksStore.getState()

    expect(state.rawItems).toEqual([second])
    expect(state.mergedItems).toEqual([])
    expect(state.duplicates).toEqual({})
    expect(state.needsMerge).toBe(true)
    expect(state.hasFullMergeData).toBe(false)
    expect(state.stats.total).toBe(0)
  })


  it('deletes an active bookmark, promotes a duplicate alternative, and undo restores it', async () => {
    const a = bookmark({ id: 'a', title: 'A', url: 'https://a.com' })
    const b = bookmark({ id: 'b', title: 'B', url: 'https://b.com' })
    const a2 = bookmark({ id: 'a2', title: 'A alt', url: 'https://a.com?utm_source=x' })

    useBookmarksStore.setState({
      mergedItems: [a, b],
      duplicates: { 'https://a.com/': [a, a2] },
      similarGroups: [],
      hasFullMergeData: true,
      stats: { total: 2, duplicates: 1, byDomain: {}, byYear: {}, byCategory: {} }
    })

    await useBookmarksStore.getState().deleteBookmarks(['a'])
    let state = useBookmarksStore.getState()

    expect(state.mergedItems.map((item) => item.id)).toEqual(['b', 'a2'])
    expect(state.duplicates).toEqual({})
    expect(await db.bookmarks.count()).toBe(2)
    expect(state.lastAction).not.toBeNull()

    await state.undo()
    state = useBookmarksStore.getState()

    expect(state.mergedItems.map((item) => item.id)).toEqual(['a', 'b'])
    expect(state.duplicates['https://a.com/'].map((item) => item.id)).toEqual(['a', 'a2'])
    expect(await db.bookmarks.count()).toBe(2)
    expect(state.lastAction).toBeNull()
  })

  it('switches the kept copy without losing the previous one', async () => {
    const a = bookmark({ id: 'a', title: 'A', url: 'https://a.com' })
    const a2 = bookmark({ id: 'a2', title: 'A alt', url: 'https://a.com?utm_source=x' })

    useBookmarksStore.setState({
      mergedItems: [a],
      duplicates: { 'https://a.com/': [a, a2] },
      similarGroups: [],
      hasFullMergeData: true,
      stats: { total: 1, duplicates: 1, byDomain: {}, byYear: {}, byCategory: {} }
    })

    await useBookmarksStore.getState().swapDuplicate('https://a.com/', 'a2')
    const state = useBookmarksStore.getState()

    expect(state.mergedItems.map((item) => item.id)).toEqual(['a2'])
    expect(state.duplicates['https://a.com/'].map((item) => item.id)).toEqual(['a2', 'a'])
    expect(await db.bookmarks.count()).toBe(1)
  })

  it('restores a whole duplicate group into the active set', async () => {
    const a = bookmark({ id: 'a', title: 'A', url: 'https://a.com' })
    const a2 = bookmark({ id: 'a2', title: 'A alt', url: 'https://a.com?utm_source=x' })

    useBookmarksStore.setState({
      mergedItems: [a],
      duplicates: { 'https://a.com/': [a, a2] },
      similarGroups: [],
      hasFullMergeData: true,
      stats: { total: 1, duplicates: 1, byDomain: {}, byYear: {}, byCategory: {} }
    })

    await useBookmarksStore.getState().restoreDuplicateGroup('https://a.com/')
    const state = useBookmarksStore.getState()

    expect(state.mergedItems.map((item) => item.id).sort()).toEqual(['a', 'a2'])
    expect(state.duplicates).toEqual({})
    expect(state.stats.duplicates).toBe(0)
    expect(await db.bookmarks.count()).toBe(2)
  })

  it('removes only the selected similar-title bookmark and can undo', async () => {
    const a = bookmark({ id: 'a', title: 'React 官方文档', url: 'https://react.dev/learn' })
    const b = bookmark({ id: 'b', title: 'React 官方文档', url: 'https://react.dev/reference' })
    const c = bookmark({ id: 'c', title: 'Vite 构建工具', url: 'https://react.dev/vite' })

    useBookmarksStore.setState({
      mergedItems: [a, b, c],
      duplicates: {},
      similarGroups: [{ id: 'g1', host: 'react.dev', score: 1, items: [a, b] }],
      hasFullMergeData: true,
      stats: { total: 3, duplicates: 0, byDomain: {}, byYear: {}, byCategory: {} }
    })

    await useBookmarksStore.getState().removeSimilarItems('g1', ['a'])
    let state = useBookmarksStore.getState()

    expect(state.mergedItems.map((item) => item.id)).toEqual(['b', 'c'])
    expect(state.similarGroups).toEqual([])
    expect(await db.bookmarks.count()).toBe(2)

    await state.undo()
    state = useBookmarksStore.getState()

    expect(state.mergedItems.map((item) => item.id)).toEqual(['a', 'b', 'c'])
    expect(state.similarGroups).toHaveLength(1)
  })


  it('rejects a bookmark file that contains no bookmarks', async () => {
    const file = {
      name: 'empty.html',
      text: async () => '<html><body>not a bookmark export</body></html>'
    } as unknown as File

    await expect(useBookmarksStore.getState().importFiles([file])).rejects.toThrow()
    expect(useBookmarksStore.getState().rawItems).toEqual([])
    expect(useBookmarksStore.getState().importing).toBe(false)
  })


  it('adds a new import to the restored library instead of replacing it', async () => {
    await db.bookmarks.bulkAdd([
      storedBookmark({ id: 'old-1', title: 'Old A', url: 'https://a.com' }),
      storedBookmark({ id: 'old-2', title: 'Old B', url: 'https://b.com' })
    ])
    await useBookmarksStore.getState().loadFromDB()

    const html = [
      '<!DOCTYPE NETSCAPE-Bookmark-file-1>',
      '<DL><p>',
      '<DT><A HREF="https://new.com" ADD_DATE="1700000000">New</A>',
      '</DL><p>'
    ].join('\n')
    const file = {
      name: 'new.html',
      text: async () => html
    } as unknown as File

    const imported = await useBookmarksStore.getState().importFiles([file])
    expect(imported).toBe(1)

    const state = useBookmarksStore.getState()
    expect(state.rawItems.map((item) => item.url).sort()).toEqual([
      'https://a.com',
      'https://b.com',
      'https://new.com'
    ])
    expect(state.needsMerge).toBe(true)
    expect(state.restoredItems).toEqual([])
  })


  it('clears stale state when an empty database is loaded explicitly', async () => {
    useBookmarksStore.setState({
      mergedItems: [bookmark({ id: 'stale' })],
      restoredItems: [bookmark({ id: 'stale-restored' })],
      hasFullMergeData: true,
      stats: { total: 1, duplicates: 0, byDomain: {}, byYear: {}, byCategory: {} }
    })

    await useBookmarksStore.getState().loadFromDB(true)
    const state = useBookmarksStore.getState()

    expect(state.mergedItems).toEqual([])
    expect(state.restoredItems).toEqual([])
    expect(state.hasFullMergeData).toBe(false)
    expect(state.stats.total).toBe(0)
  })


  it('does not resurrect bookmarks deleted before a new import', async () => {
    await db.bookmarks.bulkAdd([
      storedBookmark({ id: 'old-1', title: 'Old A', url: 'https://a.com' }),
      storedBookmark({ id: 'old-2', title: 'Old B', url: 'https://b.com' })
    ])
    await useBookmarksStore.getState().loadFromDB()
    await useBookmarksStore.getState().deleteBookmarks(['old-1'])

    const html = [
      '<!DOCTYPE NETSCAPE-Bookmark-file-1>',
      '<DL><p>',
      '<DT><A HREF="https://new.com" ADD_DATE="1700000000">New</A>',
      '</DL><p>'
    ].join('\n')
    const file = {
      name: 'new.html',
      text: async () => html
    } as unknown as File

    await useBookmarksStore.getState().importFiles([file])

    expect(useBookmarksStore.getState().rawItems.map((item) => item.url).sort()).toEqual([
      'https://b.com',
      'https://new.com'
    ])
  })

  it('clear resets restored snapshot state too', async () => {
    const saved = storedBookmark({ id: '1', normalized: 'https://example.com/' })
    await db.bookmarks.add(saved)

    useBookmarksStore.setState({
      rawItems: [bookmark({ id: 'raw-1' })],
      restoredItems: [bookmark({ id: 'restored-1' })],
      mergedItems: [bookmark({ id: 'merged-1' })],
      duplicates: { dup: [bookmark({ id: 'd1' }), bookmark({ id: 'd2' })] },
      needsMerge: true,
      hasFullMergeData: true,
      stats: { total: 1, duplicates: 1, byDomain: { 'example.com': 1 }, byYear: { '2023': 1 }, byCategory: {} }
    })

    await useBookmarksStore.getState().clear()
    const state = useBookmarksStore.getState()

    expect(state.rawItems).toEqual([])
    expect(state.restoredItems).toEqual([])
    expect(state.mergedItems).toEqual([])
    expect(state.duplicates).toEqual({})
    expect(state.needsMerge).toBe(false)
    expect(state.hasFullMergeData).toBe(false)
    expect(state.stats.total).toBe(0)
    expect(await db.bookmarks.count()).toBe(0)
  })
})
