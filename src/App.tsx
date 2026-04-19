import { useState, useRef } from 'react'
import { useReactToPrint } from 'react-to-print'
import ResumeForm from './components/ResumeForm'
import ResumePreview from './components/ResumePreview'
import LoginPage from './pages/LoginPage'
import { useAuth } from './contexts/AuthContext'
import { useResumeSync } from './hooks/useResumeSync'
import type { SaveStatus } from './hooks/useResumeSync'
import type { ResumeData } from './types/resume'
import { defaultResumeData } from './types/resume'

type Tab = 'form' | 'preview'

const saveStatusLabel: Record<SaveStatus, string> = {
  idle: '',
  saving: '⏳ 저장 중...',
  saved: '☁ 저장됨',
  error: '⚠ 저장 실패',
}

const saveStatusClass: Record<SaveStatus, string> = {
  idle: '',
  saving: 'save-status--saving',
  saved: 'save-status--saved',
  error: 'save-status--error',
}

export default function App() {
  const { user, loading, logout } = useAuth()
  const [data, setData] = useState<ResumeData>(defaultResumeData)
  const [tab, setTab] = useState<Tab>('form')
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle')
  const printRef = useRef<HTMLDivElement>(null)

  useResumeSync(user?.uid ?? null, data, setData, setSaveStatus)

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `이력서_${data.personalInfo.nameKo || '홍길동'}`,
  })

  if (loading) {
    return (
      <div className="auth-loading">
        <div className="auth-loading-spinner" />
        <p>잠시만 기다려 주세요...</p>
      </div>
    )
  }

  if (!user) return <LoginPage />

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
            {saveStatus !== 'idle' && (
              <span className={`save-status ${saveStatusClass[saveStatus]}`}>
                {saveStatusLabel[saveStatus]}
              </span>
            )}
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
              🖨 출력 / PDF
            </button>
            <div className="user-menu">
              <img
                src={user.photoURL ?? ''}
                alt={user.displayName ?? ''}
                className="user-avatar"
                referrerPolicy="no-referrer"
              />
              <div className="user-dropdown">
                <div className="user-info">
                  <strong>{user.displayName}</strong>
                  <span>{user.email}</span>
                </div>
                <div className="auto-save-note">☁ 자동 저장 활성화됨</div>
                <button className="logout-btn" onClick={logout}>로그아웃</button>
              </div>
            </div>
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
