import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { exportResume } from './exportResume'
import { populatedKrResume, populatedUsResume } from '../test/fixtures'

interface DownloadCapture {
  blob?: Blob
  download?: string
  href?: string
}

const capture: DownloadCapture = {}

beforeEach(() => {
  capture.blob = undefined
  capture.download = undefined
  capture.href = undefined

  vi.spyOn(URL, 'createObjectURL').mockImplementation((blob) => {
    capture.blob = blob as Blob
    return 'blob:test-download'
  })
  vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {})
  vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function click(this: HTMLAnchorElement) {
    capture.download = this.download
    capture.href = this.href
  })
})

afterEach(() => {
  vi.restoreAllMocks()
})

async function exportedText() {
  expect(capture.blob).toBeInstanceOf(Blob)
  return capture.blob!.text()
}

describe('exportResume', () => {
  it('exports DOC as valid Word-compatible HTML content', async () => {
    exportResume(populatedKrResume(), 'doc')

    expect(capture.download).toBe('이력서_HONG GIL DONG.doc')
    expect(capture.href).toBe('blob:test-download')
    expect(capture.blob?.type).toBe('application/msword;charset=utf-8')

    const content = await exportedText()
    expect(content).toContain('<!doctype html>')
    expect(content).toContain('<title>이력서_HONG GIL DONG</title>')
    expect(content).toContain('홍길동')
    expect(content).toContain('학 력 사 항')
  })

  it('exports standalone HTML with resume content', async () => {
    exportResume(populatedUsResume(), 'html')

    expect(capture.download).toBe('Resume_ALEX KIM.html')
    expect(capture.blob?.type).toBe('text/html;charset=utf-8')

    const content = await exportedText()
    expect(content).toContain('<!doctype html>')
    expect(content).toContain('<html>')
    expect(content).toContain('<title>Resume_ALEX KIM</title>')
    expect(content).toContain('Professional Summary')
    expect(content).toContain('Northstar Software')
  })

  it('exports TXT with important resume fields', async () => {
    exportResume(populatedKrResume(), 'txt')

    expect(capture.download).toBe('이력서_HONG GIL DONG.txt')
    expect(capture.blob?.type).toBe('text/plain;charset=utf-8')

    const content = await exportedText()
    expect(content).toContain('이 력 서')
    expect(content).toContain('홍길동')
    expect(content).toContain('한국대학교')
    expect(content).toContain('테크회사')
    expect(content).toContain('정보처리기사')
    expect(content).toContain('TOEIC')
    expect(content).toContain('해커톤 대상')
    expect(content).toContain('사용자 경험을 중요하게 생각하는 개발자입니다.')
  })

  it('exports JSON preserving the full resume object', async () => {
    const data = populatedUsResume()
    exportResume(data, 'json')

    expect(capture.download).toBe('Resume_ALEX KIM.json')
    expect(capture.blob?.type).toBe('application/json;charset=utf-8')

    const parsed = JSON.parse(await exportedText())
    expect(parsed).toEqual(data)
  })
})
