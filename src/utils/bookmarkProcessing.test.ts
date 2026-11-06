import { describe, expect, it } from 'vitest'
import type { Bookmark } from './bookmarkParser'
import { processBookmarks } from './bookmarkProcessing'

const bookmark = (overrides: Partial<Bookmark> = {}): Bookmark => ({
  id: crypto.randomUUID(),
  title: 'Example',
  url: 'https://example.com',
  path: ['Root'],
  sourceFile: 'bookmarks.html',
  ...overrides
})

describe('processBookmarks', () => {
  it('counts removed duplicate items instead of duplicate groups', () => {
    const result = processBookmarks([
      bookmark({ id: 'kept', url: 'https://example.com?a=1&utm_source=newsletter', addDate: 1 }),
      bookmark({ id: 'dup-1', url: 'https://example.com?utm_medium=email&a=1', addDate: 2 }),
      bookmark({ id: 'dup-2', url: 'https://example.com?a=1&utm_campaign=spring', addDate: 3 }),
      bookmark({ id: 'other', url: 'https://other.example.com', addDate: 4 })
    ])

    expect(result.merged.map((item) => item.id)).toEqual(['kept', 'other'])
    expect(result.stats.total).toBe(2)
    expect(result.stats.duplicates).toBe(2)
    expect(result.duplicates['https://example.com/?a=1'].map((item) => item.id)).toEqual([
      'kept',
      'dup-1',
      'dup-2'
    ])
  })

  it('keeps similar-title bookmarks and reports them for manual review', () => {
    const result = processBookmarks([
      bookmark({ id: 'a', title: 'React 官方文档', url: 'https://react.dev/learn' }),
      bookmark({ id: 'b', title: 'React 官方文档', url: 'https://react.dev/reference' }),
      bookmark({ id: 'c', title: 'Vite 构建工具', url: 'https://react.dev/vite' })
    ])

    expect(result.merged.map((item) => item.id)).toEqual(['a', 'b', 'c'])
    expect(result.stats.total).toBe(3)
    expect(result.stats.duplicates).toBe(0)
    expect(result.similarGroups).toHaveLength(1)
    expect(result.similarGroups[0].items.map((item) => item.id).sort()).toEqual(['a', 'b'])
  })

  it('detects near-identical CJK titles without word separators', () => {
    const result = processBookmarks([
      bookmark({ id: 'a', title: '机器学习入门教程', url: 'https://example.com/ml-guide' }),
      bookmark({ id: 'b', title: '机器学习入门指南', url: 'https://example.com/ml-tutorial' })
    ])

    expect(result.merged).toHaveLength(2)
    expect(result.similarGroups).toHaveLength(1)
    expect(result.similarGroups[0].items).toHaveLength(2)
  })

  it('does not group unrelated titles on the same domain', () => {
    const result = processBookmarks([
      bookmark({ id: 'a', title: 'Node.js 教程', url: 'https://example.com/node' }),
      bookmark({ id: 'b', title: 'Python 教程', url: 'https://example.com/python' }),
      bookmark({ id: 'c', title: '产品定价', url: 'https://example.com/pricing' })
    ])

    expect(result.merged).toHaveLength(3)
    expect(result.similarGroups).toHaveLength(0)
  })


  it('treats http and https as the same resource while keeping the original URL', () => {
    const result = processBookmarks([
      bookmark({ id: 'http', title: 'Example HTTP', url: 'http://example.com/docs', addDate: 10 }),
      bookmark({ id: 'https', title: 'Example HTTPS', url: 'https://example.com/docs', addDate: 20 })
    ])

    expect(result.merged).toHaveLength(1)
    expect(result.merged[0].url).toBe('http://example.com/docs')
    expect(result.stats.duplicates).toBe(1)
    expect(result.duplicates['http://example.com/docs'].map((item) => item.id)).toEqual([
      'http',
      'https'
    ])
  })

  it('keeps earliest bookmark when duplicates collapse', () => {
    const result = processBookmarks([
      bookmark({ id: 'late', url: 'https://example.com/docs', addDate: 30 }),
      bookmark({ id: 'earliest', url: 'https://example.com/docs', addDate: 10 }),
      bookmark({ id: 'middle', url: 'https://example.com/docs', addDate: 20 })
    ])

    expect(result.merged).toHaveLength(1)
    expect(result.merged[0]?.id).toBe('earliest')
    expect(result.duplicates['https://example.com/docs'].map((item) => item.id)).toEqual([
      'earliest',
      'late',
      'middle'
    ])
  })
})
