import type { Bookmark } from './bookmarkParser'
import { dedupeUrlKey, getHostname, normalizeUrl } from './url'
import { classifyBookmarks } from './classify'

export type BookmarkStats = {
  total: number
  duplicates: number
  byDomain: Record<string, number>
  byYear: Record<string, number>
  byCategory: Record<string, number>
}

export type SimilarGroup = {
  id: string
  host: string
  items: Bookmark[]
  score: number
}

export type BookmarkProcessingResult = {
  merged: Bookmark[]
  duplicates: Record<string, Bookmark[]>
  similarGroups: SimilarGroup[]
  stats: BookmarkStats
}

const TITLE_SIMILARITY_THRESHOLD = 0.7

export function createBookmarkStats(merged: Bookmark[], duplicateCount: number): BookmarkStats {
  const byDomain: Record<string, number> = {}
  const byYear: Record<string, number> = {}

  for (const item of merged) {
    const host = getHostname(item.url) || 'unknown'
    byDomain[host] = (byDomain[host] || 0) + 1
    const timestamp = item.addDate || item.lastModified
    const year = timestamp ? new Date(timestamp * 1000).getFullYear().toString() : 'Unknown'
    byYear[year] = (byYear[year] || 0) + 1
  }

  return {
    total: merged.length,
    duplicates: duplicateCount,
    byDomain,
    byYear,
    byCategory: classifyBookmarks(merged)
  }
}

export function countRemovedDuplicates(groups: Record<string, Bookmark[]>): number {
  return Object.values(groups).reduce((sum, group) => sum + Math.max(0, group.length - 1), 0)
}

function getBookmarkTimestamp(item: Bookmark): number {
  const timestamp = item.addDate ?? item.lastModified
  return typeof timestamp === 'number' && timestamp > 0 ? timestamp : Number.POSITIVE_INFINITY
}

/**
 * Normalize a title for near-duplicate comparison.
 * Punctuation and whitespace are removed so "React - Docs" and "React Docs"
 * compare on the same footing, and CJK titles work without word separators.
 */
function normalizeTitle(title: string): string {
  return title
    .normalize('NFKC')
    .toLowerCase()
    .replace(/https?:\/\/\S+/g, ' ')
    .replace(/[\p{P}\p{S}\s]+/gu, '')
}

function bigramDice(a: string, b: string): number {
  if (!a || !b) return 0
  if (a === b) return 1
  const charsA = Array.from(a)
  const charsB = Array.from(b)
  if (charsA.length < 2 || charsB.length < 2) return 0

  const grams = (chars: string[]) => {
    const set = new Set<string>()
    for (let i = 0; i < chars.length - 1; i++) set.add(chars[i] + chars[i + 1])
    return set
  }

  const gramsA = grams(charsA)
  const gramsB = grams(charsB)
  let intersection = 0
  for (const gram of gramsA) {
    if (gramsB.has(gram)) intersection++
  }
  return (2 * intersection) / (gramsA.size + gramsB.size)
}

/**
 * Compare titles with a character-bigram Dice coefficient. This works for
 * both space-separated Latin titles and unsegmented CJK titles.
 */
type UnionFind = {
  find: (index: number) => number
  union: (a: number, b: number) => void
}

function createUnionFind(size: number): UnionFind {
  const parent = Array.from({ length: size }, (_, index) => index)
  const rank = new Array<number>(size).fill(0)

  function find(index: number): number {
    let root = index
    while (parent[root] !== root) root = parent[root]
    while (parent[index] !== index) {
      const next = parent[index]
      parent[index] = root
      index = next
    }
    return root
  }

  function union(a: number, b: number): void {
    const rootA = find(a)
    const rootB = find(b)
    if (rootA === rootB) return
    if (rank[rootA] < rank[rootB]) {
      parent[rootA] = rootB
    } else if (rank[rootA] > rank[rootB]) {
      parent[rootB] = rootA
    } else {
      parent[rootB] = rootA
      rank[rootA]++
    }
  }

  return { find, union }
}

/**
 * Find, but never remove, bookmarks that share a domain and a highly similar
 * title. These are review candidates: browser imports often contain the same
 * resource with different URLs, but a false positive should never cost the
 * user a bookmark.
 */
function findSimilarGroups(bookmarks: Bookmark[]): SimilarGroup[] {
  const domainGroups = new Map<string, Bookmark[]>()
  for (const item of bookmarks) {
    const host = getHostname(item.url)
    const group = domainGroups.get(host) || []
    group.push(item)
    domainGroups.set(host, group)
  }

  const similarGroups: SimilarGroup[] = []

  for (const [host, group] of domainGroups) {
    if (group.length < 2) continue

    const normalizedTitles = group.map((item) => normalizeTitle(item.title))
    const prefixBuckets = new Map<string, number[]>()

    for (let index = 0; index < group.length; index++) {
      const normalized = normalizedTitles[index]
      // Similar titles nearly always share a short prefix. Bucketing keeps
      // the pairwise comparison from becoming quadratic on large domains.
      const key = normalized ? normalized.slice(0, 4) : `#${index}`
      const bucket = prefixBuckets.get(key) || []
      bucket.push(index)
      prefixBuckets.set(key, bucket)
    }

    for (const indexes of prefixBuckets.values()) {
      if (indexes.length < 2) continue

      const unionFind = createUnionFind(indexes.length)
      for (let i = 0; i < indexes.length; i++) {
        for (let j = i + 1; j < indexes.length; j++) {
          const score = bigramDice(
            normalizedTitles[indexes[i]],
            normalizedTitles[indexes[j]]
          )
          if (score >= TITLE_SIMILARITY_THRESHOLD) {
            unionFind.union(i, j)
          }
        }
      }

      const buckets = new Map<number, number[]>()
      for (let i = 0; i < indexes.length; i++) {
        const root = unionFind.find(i)
        const bucket = buckets.get(root) || []
        bucket.push(indexes[i])
        buckets.set(root, bucket)
      }

      for (const groupIndexes of buckets.values()) {
        if (groupIndexes.length < 2) continue

        let maxScore = 0
        for (let i = 0; i < groupIndexes.length; i++) {
          for (let j = i + 1; j < groupIndexes.length; j++) {
            maxScore = Math.max(
              maxScore,
              bigramDice(
                normalizedTitles[groupIndexes[i]],
                normalizedTitles[groupIndexes[j]]
              )
            )
          }
        }

        similarGroups.push({
          id: `similar-${host || 'unknown'}-${similarGroups.length}`,
          host,
          items: groupIndexes.map((index) => group[index]),
          score: maxScore
        })
      }
    }
  }

  return similarGroups.sort((a, b) => b.items.length - a.items.length)
}

/**
 * Phase 1: deduplicate by normalized URL.
 * Phase 2: surface similar titles for manual review without deleting them.
 */
function dedupByUrl(bookmarks: Bookmark[]): {
  merged: Bookmark[]
  duplicates: Record<string, Bookmark[]>
} {
  const groups = new Map<string, Bookmark[]>()

  for (const item of bookmarks) {
    const key = dedupeUrlKey(item.url)
    const group = groups.get(key) || []
    group.push(item)
    groups.set(key, group)
  }

  const merged: Bookmark[] = []
  const duplicates: Record<string, Bookmark[]> = {}

  for (const group of groups.values()) {
    let best = group[0]
    for (const item of group) {
      if (getBookmarkTimestamp(item) < getBookmarkTimestamp(best)) {
        best = item
      }
    }
    if (group.length > 1) {
      duplicates[normalizeUrl(best.url)] = [best, ...group.filter((item) => item.id !== best.id)]
    }
    merged.push(best)
  }

  return { merged, duplicates }
}

export function processBookmarks(bookmarks: Bookmark[]): BookmarkProcessingResult {
  const urlResult = dedupByUrl(bookmarks)
  const similarGroups = findSimilarGroups(urlResult.merged)
  const stats = createBookmarkStats(
    urlResult.merged,
    bookmarks.length - urlResult.merged.length
  )

  return {
    merged: urlResult.merged,
    duplicates: urlResult.duplicates,
    similarGroups,
    stats
  }
}
