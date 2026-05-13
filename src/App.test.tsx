import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { readFileSync } from 'node:fs'
import { describe, expect, it, vi } from 'vitest'
import App from './App'
import { exportResume } from './utils/exportResume'

const { printMock } = vi.hoisted(() => ({
  printMock: vi.fn(),
}))

vi.mock('react-to-print', () => ({
  useReactToPrint: () => printMock,
}))

vi.mock('./contexts/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    loading: false,
    logout: vi.fn(),
  }),
}))

vi.mock('./hooks/useResumeSync', async () => {
  const React = await import('react')
  const { populatedKrResume } = await import('./test/fixtures')

  return {
    useResumeSync: (
      _uid: string | null,
      _isGuest: boolean,
      _data: unknown,
      setData: (data: unknown) => void,
      _onStatus: (status: string) => void,
      onReady: () => void
    ) => {
      React.useEffect(() => {
        setData(populatedKrResume())
        onReady()
      }, [])
    },
  }
})

vi.mock('./utils/exportResume', () => ({
  exportResume: vi.fn(),
}))

describe('App preview and export controls', () => {
  it('switches to preview before printing when the header print button is clicked from the form tab', async () => {
    const user = userEvent.setup()
    render(<App />)

    await screen.findByRole('heading', { name: '지원 정보' })
    await user.click(screen.getByRole('button', { name: '🖨 출력 / PDF' }))

    expect(await screen.findByRole('heading', { name: '이 력 서' })).toBeInTheDocument()
    expect(printMock).not.toHaveBeenCalled()
  })

  it('calls react-to-print from the preview tab', async () => {
    const user = userEvent.setup()
    render(<App />)

    await screen.findByRole('heading', { name: '지원 정보' })
    await user.click(screen.getByRole('button', { name: '👁 미리보기' }))
    await user.click(await screen.findByRole('button', { name: '🖨 출력 / PDF 저장' }))

    await waitFor(() => expect(printMock).toHaveBeenCalledTimes(1))
  })

  it('keeps all export buttons usable from preview', async () => {
    const user = userEvent.setup()
    render(<App />)

    await screen.findByRole('heading', { name: '지원 정보' })
    await user.click(screen.getByRole('button', { name: '👁 미리보기' }))

    for (const label of ['DOC', 'HTML', 'TXT', 'JSON']) {
      const button = await screen.findByRole('button', { name: label })
      expect(button).toBeEnabled()
      await user.click(button)
    }

    expect(exportResume).toHaveBeenCalledTimes(4)
    expect(vi.mocked(exportResume).mock.calls.map(([, format]) => format)).toEqual([
      'doc',
      'html',
      'txt',
      'json',
    ])
  })

  it('uses the mobile Korean paper preview frame', async () => {
    const user = userEvent.setup()
    const { container } = render(<App />)

    await screen.findByRole('heading', { name: '지원 정보' })
    await user.click(screen.getByRole('button', { name: '👁 미리보기' }))

    expect(container.querySelector('.preview-document-frame--paper')).toBeInTheDocument()
    expect(container.querySelector('.preview-actions-bar')).toBeInTheDocument()
  })

  it('defines mobile CSS for preview scrolling and export button grid', () => {
    const css = readFileSync('src/index.css', 'utf8')

    expect(css).toContain('@media (max-width: 700px)')
    expect(css).toContain('.preview-document-frame')
    expect(css).toContain('overflow-x: auto')
    expect(css).toContain('.preview-document-frame--paper .resume-preview')
    expect(css).toContain('width: 760px')
    expect(css).toContain('grid-template-columns: repeat(2, minmax(0, 1fr))')
    expect(css).toContain('.us-entry-heading { flex-direction: column; gap: 2px; }')
  })
})
