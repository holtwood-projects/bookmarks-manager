/**
 * Bookmark Worker Client
 * Web Worker wrapper with Promise-based API and progress callbacks
 */

import type { Bookmark } from '@/utils/bookmarkParser'
import type { SimilarGroup } from '@/utils/bookmarkProcessing'
import type { WorkerMessage, WorkerResponse } from './bookmarkWorker'

export interface MergeDedupResult {
  merged: Bookmark[]
  duplicates: Record<string, Bookmark[]>
  similarGroups: SimilarGroup[]
  stats: {
    total: number
    duplicates: number
    byDomain: Record<string, number>
    byYear: Record<string, number>
    byCategory: Record<string, number>
  }
}

export class BookmarkWorkerClient {
  private worker: Worker | null = null
  private activeMerge: {
    resolve: (value: MergeDedupResult) => void
    reject: (reason: Error) => void
    onProgress?: (stage: string) => void
  } | null = null

  constructor() {
    this.initWorker()
  }

  private initWorker() {
    this.worker = new Worker(new URL('./bookmarkWorker.ts', import.meta.url), { type: 'module' })

    this.worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
      const data = event.data

      if (!this.activeMerge) {
        return
      }

      if (data.type === 'MERGE_BOOKMARKS_PROGRESS') {
        this.activeMerge.onProgress?.(data.payload.stage)
        return
      }

      if (data.type === 'ERROR') {
        this.activeMerge.reject(new Error(data.payload.message))
        this.activeMerge = null
        return
      }

      this.activeMerge.resolve({
        merged: data.payload.merged,
        duplicates: data.payload.groups,
        similarGroups: data.payload.similarGroups,
        stats: {
          total: data.payload.total,
          duplicates: data.payload.duplicates,
          byDomain: data.payload.byDomain,
          byYear: data.payload.byYear,
          byCategory: data.payload.byCategory
        }
      })
      this.activeMerge = null
    }

    this.worker.onerror = (error) => {
      console.error('Worker error:', error)
      this.activeMerge?.reject(new Error('Worker error: ' + error.message))
      this.activeMerge = null
    }
  }

  private postMessage(message: WorkerMessage): void {
    if (!this.worker) {
      throw new Error('Worker not initialized')
    }

    this.worker.postMessage(message)
  }

  /**
   * Merge and deduplicate bookmarks
   */
  async mergeAndDedup(
    bookmarks: Bookmark[],
    onProgress?: (stage: string) => void
  ): Promise<MergeDedupResult> {
    return new Promise((resolve, reject) => {
      if (this.activeMerge) {
        reject(new Error('Worker is already processing a merge job'))
        return
      }

      this.activeMerge = {
        resolve,
        reject,
        onProgress
      }

      try {
        this.postMessage({ type: 'MERGE_BOOKMARKS', payload: { bookmarks } })
      } catch (error) {
        this.activeMerge = null
        reject(error)
      }
    })
  }

  /**
   * Terminate the worker
   */
  terminate(): void {
    if (this.worker) {
      this.worker.terminate()
      this.worker = null
    }
    this.activeMerge?.reject(new Error('Worker terminated'))
    this.activeMerge = null
  }
}

// Singleton instance
let workerClient: BookmarkWorkerClient | null = null

export function getWorkerClient(): BookmarkWorkerClient {
  if (!workerClient) {
    workerClient = new BookmarkWorkerClient()
  }
  return workerClient
}

export function terminateWorker(): void {
  if (workerClient) {
    workerClient.terminate()
    workerClient = null
  }
}
