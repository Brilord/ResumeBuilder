import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

export default function LoginPage() {
  const { signInWithGoogle } = useAuth()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleGoogle = async () => {
    setError('')
    setLoading(true)
    try {
      await signInWithGoogle()
    } catch {
      setError('로그인에 실패했습니다. 다시 시도해 주세요.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        {/* Left decorative panel */}
        <div className="login-panel">
          <div className="login-panel-content">
            <div className="login-brand-icon">📄</div>
            <h1 className="login-panel-title">한국식<br />이력서 작성기</h1>
            <p className="login-panel-sub">Korean Resume Builder</p>
            <ul className="login-features">
              <li>✓ 표준 한국식 이력서 양식</li>
              <li>✓ 실시간 미리보기</li>
              <li>✓ 자동 저장 기능</li>
              <li>✓ PDF / 인쇄 출력</li>
              <li>✓ 자기소개서 작성</li>
            </ul>
          </div>
        </div>

        {/* Right login form */}
        <div className="login-form-panel">
          <div className="login-form-inner">
            <h2 className="login-title">로그인 / 회원가입</h2>
            <p className="login-subtitle">
              Google 계정으로 로그인하면 이력서 작성 내용이<br />
              자동으로 저장됩니다.
            </p>

            {error && <div className="login-error">{error}</div>}

            <button
              className="google-btn"
              onClick={handleGoogle}
              disabled={loading}
            >
              <GoogleIcon />
              {loading ? '로그인 중...' : 'Google로 계속하기'}
            </button>

            <div className="login-divider">
              <span>또는</span>
            </div>

            <div className="login-guest-note">
              <p>로그인 없이 사용하면 데이터가 저장되지 않습니다.</p>
              <p>계정을 만들면 언제 어디서든 이력서를 이어서 작성할 수 있습니다.</p>
            </div>

            <div className="login-terms">
              로그인 시 <a href="#">이용약관</a> 및 <a href="#">개인정보처리방침</a>에 동의하게 됩니다.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
      <path fill="none" d="M0 0h48v48H0z"/>
    </svg>
  )
}
