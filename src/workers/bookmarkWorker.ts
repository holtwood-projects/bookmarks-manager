/**
 * Bookmark Processing Web Worker
 * Handles merge + deduplication off the main thread
 */

import type { Bookmark } from '@/utils/bookmarkParser'
import type { SimilarGroup } from '@/utils/bookmarkProcessing'
import { processBookmarks } from '@/utils/bookmarkProcessing'

// Worker message types
export type WorkerMessage = { type: 'MERGE_BOOKMARKS'; payload: { bookmarks: Bookmark[] } }

export type WorkerResponse =
  | {
      type: 'MERGE_BOOKMARKS_RESULT'
      payload: {
        merged: Bookmark[]
        groups: Record<string, Bookmark[]>
        similarGroups: SimilarGroup[]
        total: number
        duplicates: number
        byDomain: Record<string, number>
        byYear: Record<string, number>
        byCategory: Record<string, number>
      }
    }
  | { type: 'MERGE_BOOKMARKS_PROGRESS'; payload: { stage: string } }
  | { type: 'ERROR'; payload: { message: string; details?: string } }

function mergeBookmarks(
  bookmarks: Bookmark[]
): WorkerResponse & { type: 'MERGE_BOOKMARKS_RESULT' } {
  self.postMessage({
    type: 'MERGE_BOOKMARKS_PROGRESS',
    payload: { stage: 'normalizing' }
  } as WorkerResponse)

  self.postMessage({
    type: 'MERGE_BOOKMARKS_PROGRESS',
    payload: { stage: 'computing' }
  } as WorkerResponse)

  const result = processBookmarks(bookmarks)

  return {
    type: 'MERGE_BOOKMARKS_RESULT',
    payload: {
      merged: result.merged,
      groups: result.duplicates,
      similarGroups: result.similarGroups,
      total: result.stats.total,
      duplicates: result.stats.duplicates,
      byDomain: result.stats.byDomain,
      byYear: result.stats.byYear,
      byCategory: result.stats.byCategory
    }
  }
}

// Message handler
self.onmessage = function (event: MessageEvent<WorkerMessage>) {
  const { type, payload } = event.data

  try {
    switch (type) {
      case 'MERGE_BOOKMARKS': {
        self.postMessage(mergeBookmarks(payload.bookmarks))
        break
      }

      default:
        self.postMessage({
          type: 'ERROR',
          payload: { message: `Unknown message type: ${type}` }
        } as WorkerResponse)
    }
  } catch (error) {
    self.postMessage({
      type: 'ERROR',
      payload: {
        message: error instanceof Error ? error.message : 'Worker processing error',
        details: error instanceof Error ? error.stack : undefined
      }
    } as WorkerResponse)
  }
}
