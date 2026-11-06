import MiniSearch from 'minisearch'
import type { Bookmark } from './bookmarkParser'

export type SearchResultItem = Partial<
  Pick<Bookmark, 'title' | 'url' | 'path' | 'addDate' | 'lastModified' | 'sourceFile'>
> & {
  id: string
  score?: number
}

/**
 * SearchIndex encapsulates MiniSearch with explicit state management
 */
class SearchIndex {
  private index: MiniSearch<Bookmark> | null = null

  create(bookmarks: Bookmark[]): void {
    this.index = new MiniSearch({
      fields: ['title', 'url', 'path'],
      storeFields: ['id', 'title', 'url', 'path', 'addDate', 'lastModified', 'sourceFile'],
      searchOptions: {
        boost: { title: 2, url: 1, path: 1 },
        fuzzy: 0.2,
        prefix: true
      },
      extractField: (document, fieldName) => {
        if (fieldName === 'path') {
          return document.path.join(' ')
        }
        return (document as Record<string, unknown>)[fieldName] as string
      }
    })
    this.index.addAll(bookmarks)
  }

  search(query: string, limit = Number.POSITIVE_INFINITY): SearchResultItem[] {
    if (!this.index || !query.trim()) return []
    const results = this.index.search(query)
    const limited = Number.isFinite(limit) ? results.slice(0, limit) : results
    return limited.map((r) => ({
      id: r.id as string,
      score: r.score,
      title: r.title as string | undefined,
      url: r.url as string | undefined,
      path: r.path as string[] | undefined,
      addDate: r.addDate as number | undefined,
      lastModified: r.lastModified as number | undefined,
      sourceFile: r.sourceFile as string | undefined
    }))
  }

  reset(): void {
    this.index = null
  }
}

// Singleton instance for backward compatibility
const searchIndex = new SearchIndex()

// Export functions for backward compatibility
export function createSearchIndex(bookmarks: Bookmark[]): void {
  searchIndex.create(bookmarks)
}

export function search(query: string, limit = Number.POSITIVE_INFINITY): SearchResultItem[] {
  return searchIndex.search(query, limit)
}

export function resetSearchIndex(): void {
  searchIndex.reset()
}

// Export class for explicit instantiation
export { SearchIndex }
