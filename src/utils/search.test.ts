import { describe, expect, it } from 'vitest'
import type { Bookmark } from './bookmarkParser'
import { SearchIndex } from './search'

function makeBookmarks(count: number): Bookmark[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `bookmark-${index}`,
    title: `Alpha resource ${index}`,
    url: `https://example.com/${index}`,
    path: ['Reading'],
    sourceFile: 'bookmarks.html'
  }))
}

describe('SearchIndex', () => {
  it('returns every match by default instead of truncating to 50', () => {
    const index = new SearchIndex()
    index.create(makeBookmarks(120))

    expect(index.search('alpha')).toHaveLength(120)
  })

  it('still supports an explicit result limit', () => {
    const index = new SearchIndex()
    index.create(makeBookmarks(120))

    expect(index.search('alpha', 10)).toHaveLength(10)
  })
})
