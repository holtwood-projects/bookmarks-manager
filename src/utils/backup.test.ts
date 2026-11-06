import { beforeEach, describe, expect, it } from 'vitest'
import { db, saveAIConfig, saveBookmarks, type StoredBookmark } from './db'
import { createBackup, restoreFromBackup } from './backup'

const sampleBookmarks: StoredBookmark[] = [
  {
    id: '1',
    title: 'React',
    url: 'https://react.dev',
    normalized: 'react.dev',
    path: ['Dev'],
    sourceFile: 'sample.html'
  }
]

describe('backup after closure hardening', () => {
  beforeEach(async () => {
    await db.bookmarks.clear()
    await db.aiConfig.clear()
  })

  it('creates a backup with bookmarks and optional AI config only', async () => {
    await saveBookmarks(sampleBookmarks)
    await saveAIConfig({
      provider: 'openai',
      apiKey: 'test-key',
      model: 'gpt-4o-mini',
      maxTokens: 2000,
      temperature: 0.7
    })

    const backup = await createBackup()

    expect(backup.bookmarks).toHaveLength(1)
    expect(backup.aiConfig?.provider).toBe('openai')
    expect('aiCache' in backup).toBe(false)
    expect('aiUsage' in backup).toBe(false)
    expect('aiPrompts' in backup).toBe(false)
    expect('aiUsageLimits' in backup).toBe(false)
    expect('cleanupSessions' in backup).toBe(false)
  })

  it('restores bookmarks and AI config without legacy restore stats', async () => {
    const result = await restoreFromBackup(
      {
        version: 1,
        exportedAt: new Date().toISOString(),
        bookmarks: sampleBookmarks,
        aiConfig: {
          id: 'default',
          provider: 'claude',
          apiKey: 'test-key',
          model: 'claude-3-5-sonnet-20241022',
          maxTokens: 2000,
          temperature: 0.7,
          updatedAt: Date.now()
        }
      },
      'replace'
    )

    expect(result.success).toBe(true)
    expect(result.stats.bookmarksRestored).toBe(1)
    expect(result.stats.aiConfigRestored).toBe(true)
    expect('aiCacheRestored' in result.stats).toBe(false)
    expect('aiUsageRestored' in result.stats).toBe(false)
    expect('aiPromptsRestored' in result.stats).toBe(false)
    expect('cleanupSessionsRestored' in result.stats).toBe(false)
  })

  it('rolls back a failed replace restore instead of losing existing data', async () => {
    await saveBookmarks(sampleBookmarks)

    const result = await restoreFromBackup(
      {
        version: 1,
        exportedAt: new Date().toISOString(),
        bookmarks: [sampleBookmarks[0], sampleBookmarks[0]]
      },
      'replace'
    )

    expect(result.success).toBe(false)
    expect(await db.bookmarks.count()).toBe(1)
  })
})
