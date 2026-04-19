import { useState, useRef } from 'react'
import { useReactToPrint } from 'react-to-print'
import ResumeForm from './components/ResumeForm'
import ResumePreview from './components/ResumePreview'
import type { ResumeData } from './types/resume'
import { defaultResumeData } from './types/resume'

type Tab = 'form' | 'preview'

export default function App() {
  const [data, setData] = useState<ResumeData>(defaultResumeData)
  const [tab, setTab] = useState<Tab>('form')
  const printRef = useRef<HTMLDivElement>(null)

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `이력서_${data.personalInfo.nameKo || '홍길동'}`,
  })

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-inner">
          <div className="header-brand">
            <span className="brand-icon">📄</span>
            <div>
              <h1 className="brand-title">한국식 이력서 작성기</h1>
              <p className="brand-sub">Korean Resume Builder</p>
            </div>
          </div>
          <div className="header-actions">
            <div className="tab-switcher">
              <button
                className={`tab-btn ${tab === 'form' ? 'active' : ''}`}
                onClick={() => setTab('form')}
              >
                ✏️ 작성
              </button>
              <button
                className={`tab-btn ${tab === 'preview' ? 'active' : ''}`}
                onClick={() => setTab('preview')}
              >
                👁 미리보기
              </button>
            </div>
            <button className="print-btn" onClick={() => handlePrint()}>
              🖨 출력 / PDF 저장
            </button>
          </div>
        </div>
      </header>

      <main className="app-main">
        {tab === 'form' ? (
          <div className="form-page">
            <ResumeForm data={data} onChange={setData} />
          </div>
        ) : (
          <div className="preview-page">
            <div className="preview-actions-bar">
              <button className="print-btn" onClick={() => handlePrint()}>
                🖨 출력 / PDF 저장
              </button>
            </div>
            <div ref={printRef}>
              <ResumePreview data={data} />
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
