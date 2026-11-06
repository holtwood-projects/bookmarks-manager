/**
 * Backup and Restore Service
 * Provides focused backup (bookmarks + optional AI config) and restore functionality
 */

import { db, type StoredBookmark, type AIConfig } from './db'
import { t } from '@/locales'

export interface BackupData {
  version: number
  exportedAt: string
  bookmarks: StoredBookmark[]
  aiConfig?: AIConfig
}

export interface BackupOptions {
  includeBookmarks?: boolean
  includeAIConfig?: boolean
}

const CURRENT_SCHEMA_VERSION = 1

export async function createBackup(options: BackupOptions = {}): Promise<BackupData> {
  const { includeBookmarks = true, includeAIConfig = true } = options

  const backup: BackupData = {
    version: CURRENT_SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    bookmarks: includeBookmarks ? await db.bookmarks.toArray() : []
  }

  if (includeAIConfig) {
    backup.aiConfig = await db.aiConfig.get('default')
  }

  return backup
}

export async function exportBackupAsJSON(options?: BackupOptions): Promise<string> {
  const backup = await createBackup(options)
  return JSON.stringify(backup, null, 2)
}

export function validateBackup(data: unknown): { valid: boolean; error?: string } {
  if (typeof data !== 'object' || data === null) {
    return { valid: false, error: t('backup.validation.invalidFormat') }
  }

  const backup = data as Partial<BackupData>

  if (backup.version !== CURRENT_SCHEMA_VERSION) {
    return {
      valid: false,
      error: t('backup.validation.unsupportedVersion', { version: backup.version })
    }
  }

  if (!Array.isArray(backup.bookmarks)) {
    return { valid: false, error: t('backup.validation.invalidBookmarks') }
  }

  for (const bookmark of backup.bookmarks) {
    if (!bookmark.id || !bookmark.url) {
      return { valid: false, error: t('backup.validation.incompleteBookmark') }
    }
  }

  return { valid: true }
}

export function parseBackup(jsonString: string): {
  success: boolean
  data?: BackupData
  error?: string
} {
  try {
    const parsed = JSON.parse(jsonString)
    const validation = validateBackup(parsed)

    if (!validation.valid) {
      return { success: false, error: validation.error }
    }

    return { success: true, data: parsed as BackupData }
  } catch {
    return { success: false, error: t('backup.jsonParseFailed') }
  }
}

export async function restoreFromBackup(
  backup: BackupData,
  strategy: 'merge' | 'replace' = 'replace'
): Promise<{ success: boolean; stats: RestoreStats; error?: string }> {
  const stats: RestoreStats = {
    bookmarksRestored: 0,
    aiConfigRestored: false
  }

  try {
    await db.transaction('rw', db.bookmarks, db.aiConfig, async () => {
      if (strategy === 'replace') {
        await db.bookmarks.clear()
        await db.aiConfig.clear()
      }

      if (backup.bookmarks.length > 0) {
        if (strategy === 'merge') {
          await db.bookmarks.bulkPut(backup.bookmarks)
        } else {
          await db.bookmarks.bulkAdd(backup.bookmarks)
        }
      }

      if (backup.aiConfig) {
        await db.aiConfig.put(backup.aiConfig)
      }
    })

    stats.bookmarksRestored = backup.bookmarks.length
    stats.aiConfigRestored = Boolean(backup.aiConfig)

    return { success: true, stats }
  } catch (error) {
    return { success: false, stats, error: String(error) }
  }
}

export interface RestoreStats {
  bookmarksRestored: number
  aiConfigRestored: boolean
}

export async function estimateBackupSize(options?: BackupOptions): Promise<number> {
  const backup = await createBackup(options)
  const json = JSON.stringify(backup)
  return new Blob([json]).size
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
