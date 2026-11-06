import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import Dashboard from './Dashboard'
import useBookmarksStore from '@/store/useBookmarksStore'

// Mock the store
vi.mock('@/store/useBookmarksStore', () => ({
  default: vi.fn()
}))

// Mock Chart component
vi.mock('@/ui/Chart', () => ({
  default: vi.fn(({ 'aria-label': label }) => (
    <div role="img" aria-label={label} data-testid="chart-mock" />
  ))
}))

describe('Dashboard', () => {
  const mockStore = {
    stats: {
      total: 100,
      duplicates: 20,
      byDomain: { 'github.com': 30, 'google.com': 20 },
      byYear: { '2023': 50, '2024': 50 },
      byCategory: { '编程': 30, '工具': 20 }
    },
    mergedItems: [],
    needsMerge: false,
    hasFullMergeData: true
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useBookmarksStore).mockReturnValue(mockStore as ReturnType<typeof useBookmarksStore>)
  })

  it('renders stats cards', () => {
    render(<Dashboard />)

    expect(screen.getByText('书签总量')).toBeInTheDocument()
    expect(screen.getByText('100')).toBeInTheDocument()
    expect(screen.getByText('完全重复数量')).toBeInTheDocument()
    expect(screen.getByText('20')).toBeInTheDocument()
    expect(screen.getByText('域名数')).toBeInTheDocument()
  })

  it('renders charts', () => {
    render(<Dashboard />)

    expect(screen.getByRole('img', { name: '书签重复占比饼图' })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: '书签域名分布柱状图' })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: '书签按年份新增趋势图' })).toBeInTheDocument()
  })

  it('shows warning when needsMerge is true', () => {
    vi.mocked(useBookmarksStore).mockReturnValue({
      ...mockStore,
      needsMerge: true
    } as ReturnType<typeof useBookmarksStore>)

    render(<Dashboard />)

    expect(screen.getByText(/当前导入会话已变更/)).toBeInTheDocument()
  })

  it('shows bookmark list when mergedItems exist', () => {
    vi.mocked(useBookmarksStore).mockReturnValue({
      ...mockStore,
      mergedItems: [{ id: '1', title: 'Test Bookmark', url: 'https://example.com', path: [] }]
    } as ReturnType<typeof useBookmarksStore>)

    render(<Dashboard />)

    expect(screen.getByText(/书签列表/)).toBeInTheDocument()
  })

  it('does not render unsafe imported bookmark URLs as clickable links', async () => {
    vi.mocked(useBookmarksStore).mockReturnValue({
      ...mockStore,
      mergedItems: [{ id: '1', title: 'Bad Bookmark', url: 'javascript:alert(1)', path: [] }]
    } as ReturnType<typeof useBookmarksStore>)

    render(<Dashboard />)

    fireEvent.click(screen.getByRole('button', { name: /书签列表/ }))

    expect(await screen.findByText('Bad Bookmark')).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Bad Bookmark' })).not.toBeInTheDocument()
  })
})
