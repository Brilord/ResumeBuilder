import { useEffect, useState, useRef } from 'react'
import { useReactToPrint } from 'react-to-print'
import ResumeForm from './components/ResumeForm'
import ResumePreview from './components/ResumePreview'
import LoginPage from './pages/LoginPage'
import { useAuth } from './contexts/AuthContext'
import { useResumeSync } from './hooks/useResumeSync'
import type { SaveStatus } from './hooks/useResumeSync'
import type { ResumeData } from './types/resume'
import { defaultResumeData } from './types/resume'
import { exportResume } from './utils/exportResume'

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
  const [showToast, setShowToast] = useState(false)
  const [dataReady, setDataReady] = useState(false)
  const [isGuest, setIsGuest] = useState(true)
  const printRef = useRef<HTMLDivElement>(null)
  const country = data.country ?? 'KR'

  // Reset ready state when uid or guest mode changes
  const prevKey = useRef<string>('')
  const currentKey = user ? user.uid : isGuest ? 'guest' : ''
  if (currentKey !== prevKey.current) {
    prevKey.current = currentKey
    setDataReady(false)
  }

  useEffect(() => {
    if (user) setIsGuest(false)
  }, [user])

  const handleReady = () => setDataReady(true)
  const handleRestored = () => {
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  useResumeSync(
    user?.uid ?? null,
    isGuest,
    data,
    setData,
    setSaveStatus,
    handleReady,
    handleRestored
  )

  const printResume = useReactToPrint({
    contentRef: printRef,
    documentTitle: `${country === 'US' ? 'Resume' : '이력서'}_${data.personalInfo.nameEn || data.personalInfo.nameKo || (country === 'US' ? 'Your_Name' : '홍길동')}`,
    onPrintError: (_location, error) => {
      console.error('Print failed:', error)
    },
  })

  const handlePrint = () => {
    if (tab !== 'preview') {
      setTab('preview')
      return
    }
    printResume()
  }

  if (loading) {
    return (
      <div className="auth-loading">
        <div className="auth-loading-spinner" />
        <p>잠시만 기다려 주세요...</p>
      </div>
    )
  }

  if (!user && !isGuest) {
    return <LoginPage onGuest={() => setIsGuest(true)} />
  }

  if (!dataReady) {
    return (
      <div className="auth-loading">
        <div className="auth-loading-spinner" />
        <p>이력서 데이터를 불러오는 중...</p>
      </div>
    )
  }

  return (
    <div className="app">
      {showToast && (
        <div className="toast">✅ 저장된 이력서를 불러왔습니다!</div>
      )}

      <header className="app-header">
        <div className="header-inner">
          <div className="header-brand">
            <span className="brand-icon">📄</span>
            <div>
              <h1 className="brand-title">이력서 작성기</h1>
              <p className="brand-sub">Korean / American Resume Builder</p>
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

            {user ? (
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
            ) : (
              <button
                className="guest-login-btn"
                onClick={() => setIsGuest(false)}
              >
                로그인
              </button>
            )}
          </div>
        </div>

        {isGuest && !user && (
          <div className="guest-banner">
            ⚠ 게스트 모드 — 이 기기에만 저장됩니다.&nbsp;
            <button onClick={() => setIsGuest(false)}>Google로 로그인하여 클라우드에 저장하기 →</button>
          </div>
        )}
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
              <button className="export-btn" onClick={() => exportResume(data, 'doc')}>
                DOC
              </button>
              <button className="export-btn" onClick={() => exportResume(data, 'html')}>
                HTML
              </button>
              <button className="export-btn" onClick={() => exportResume(data, 'txt')}>
                TXT
              </button>
              <button className="export-btn" onClick={() => exportResume(data, 'json')}>
                JSON
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
