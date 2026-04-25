import type { ResumeData } from '../types/resume'

interface Props {
  data: ResumeData
}

const levelMap: Record<string, string> = {
  native: '원어민 수준',
  advanced: '고급',
  intermediate: '중급',
  beginner: '초급',
}

const usLevelMap: Record<string, string> = {
  native: 'Native',
  advanced: 'Advanced',
  intermediate: 'Intermediate',
  beginner: 'Beginner',
}

function formatMonth(ym: string) {
  if (!ym) return ''
  const [y, m] = ym.split('-')
  return `${y}년 ${m}월`
}

function formatMonthUS(ym: string) {
  if (!ym) return ''
  const [y, m] = ym.split('-')
  const date = new Date(Number(y), Number(m) - 1)
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

function formatDate(d: string) {
  if (!d) return ''
  const [y, m, day] = d.split('-')
  return `${y}년 ${parseInt(m)}월 ${parseInt(day)}일`
}

function calcAge(birthDate: string) {
  if (!birthDate) return ''
  const birth = new Date(birthDate)
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--
  return `${age}세`
}

export default function ResumePreview({ data }: Props) {
  const { personalInfo, education, workExperience, militaryService, certifications, languageSkills, awards, selfIntroduction, applyingFor, applicationDate } = data

  if ((data.country ?? 'KR') === 'US') {
    const displayName = personalInfo.nameEn || personalInfo.nameKo

    return (
      <div className="resume-preview resume-preview--us">
        <header className="us-resume-header">
          <h1>{displayName || 'Your Name'}</h1>
          <div className="us-contact-line">
            {[personalInfo.address, personalInfo.phone, personalInfo.email].filter(Boolean).join(' | ')}
          </div>
          {applyingFor && <div className="us-target-role">{applyingFor}</div>}
        </header>

        {selfIntroduction && (
          <section className="us-section">
            <h2>Professional Summary</h2>
            <p>{selfIntroduction}</p>
          </section>
        )}

        {workExperience.some(w => w.companyName || w.position) && (
          <section className="us-section">
            <h2>Experience</h2>
            {workExperience.filter(w => w.companyName || w.position).map(work => (
              <div className="us-entry" key={work.id}>
                <div className="us-entry-heading">
                  <div>
                    <strong>{work.position || 'Role'}</strong>
                    {work.companyName && <span> | {work.companyName}</span>}
                    {work.department && <div className="us-entry-sub">{work.department}</div>}
                  </div>
                  <span className="us-date-range">
                    {formatMonthUS(work.startDate)}
                    {(work.startDate || work.endDate || work.isCurrent) && ' - '}
                    {work.isCurrent ? 'Present' : formatMonthUS(work.endDate)}
                  </span>
                </div>
                {work.responsibilities && <div className="us-body-text">{work.responsibilities}</div>}
              </div>
            ))}
          </section>
        )}

        {education.some(e => e.schoolName) && (
          <section className="us-section">
            <h2>Education</h2>
            {education.filter(e => e.schoolName).map(edu => (
              <div className="us-entry" key={edu.id}>
                <div className="us-entry-heading">
                  <div>
                    <strong>{edu.schoolName}</strong>
                    {(edu.degree || edu.major) && (
                      <div className="us-entry-sub">{[edu.degree, edu.major].filter(Boolean).join(', ')}</div>
                    )}
                    {(edu.status || edu.gpa) && (
                      <div className="us-entry-sub">{[edu.status, edu.gpa ? `GPA ${edu.gpa}/${edu.gpaMax}` : ''].filter(Boolean).join(' | ')}</div>
                    )}
                  </div>
                  <span className="us-date-range">
                    {[formatMonthUS(edu.startDate), formatMonthUS(edu.endDate)].filter(Boolean).join(' - ')}
                  </span>
                </div>
              </div>
            ))}
          </section>
        )}

        {certifications.some(c => c.name) && (
          <section className="us-section">
            <h2>Certifications</h2>
            <ul className="us-compact-list">
              {certifications.filter(c => c.name).map(cert => (
                <li key={cert.id}>
                  <strong>{cert.name}</strong>
                  {[cert.issuer, formatMonthUS(cert.issueDate), cert.score].filter(Boolean).length > 0 &&
                    ` - ${[cert.issuer, formatMonthUS(cert.issueDate), cert.score].filter(Boolean).join(' | ')}`}
                </li>
              ))}
            </ul>
          </section>
        )}

        {languageSkills.some(l => l.language) && (
          <section className="us-section">
            <h2>Languages</h2>
            <ul className="us-compact-list">
              {languageSkills.filter(l => l.language).map(lang => (
                <li key={lang.id}>
                  <strong>{lang.language}</strong>
                  {[lang.level ? usLevelMap[lang.level] : '', lang.testName, lang.score].filter(Boolean).length > 0 &&
                    ` - ${[lang.level ? usLevelMap[lang.level] : '', lang.testName, lang.score].filter(Boolean).join(' | ')}`}
                </li>
              ))}
            </ul>
          </section>
        )}

        {awards.some(a => a.name) && (
          <section className="us-section">
            <h2>Awards / Activities</h2>
            <ul className="us-compact-list">
              {awards.filter(a => a.name).map(award => (
                <li key={award.id}>
                  <strong>{award.name}</strong>
                  {[award.issuer, formatMonthUS(award.date), award.description].filter(Boolean).length > 0 &&
                    ` - ${[award.issuer, formatMonthUS(award.date), award.description].filter(Boolean).join(' | ')}`}
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    )
  }

  return (
    <div className="resume-preview">
      {/* Title */}
      <div className="resume-title-block">
        <h1 className="resume-main-title">이 력 서</h1>
        {applyingFor && <div className="resume-applying-for">지원 직종: {applyingFor}</div>}
      </div>

      {/* ── 인적사항 ── */}
      <table className="resume-table">
        <tbody>
          <tr>
            <th colSpan={4} className="table-section-header">인 적 사 항</th>
          </tr>
          <tr>
            <th className="cell-label">성명</th>
            <td className="cell-value" rowSpan={4} style={{ width: '30%' }}>
              <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{personalInfo.nameKo}</div>
              {personalInfo.nameEn && <div style={{ fontSize: '0.85rem', color: '#555' }}>{personalInfo.nameEn}</div>}
            </td>
            <td className="photo-cell" rowSpan={5}>
              {personalInfo.photo
                ? <img src={personalInfo.photo} alt="증명사진" className="resume-photo" />
                : <div className="resume-photo-placeholder">사진<br />(3×4cm)</div>}
            </td>
          </tr>
          <tr>
            <th className="cell-label">생년월일</th>
            <td className="cell-value">{formatDate(personalInfo.birthDate)} {calcAge(personalInfo.birthDate)}</td>
          </tr>
          <tr>
            <th className="cell-label">성별</th>
            <td className="cell-value">{personalInfo.gender}</td>
          </tr>
          <tr>
            <th className="cell-label">국적</th>
            <td className="cell-value">{personalInfo.nationality}</td>
          </tr>
          <tr>
            <th className="cell-label">주소</th>
            <td className="cell-value" colSpan={2}>{personalInfo.address}</td>
          </tr>
          <tr>
            <th className="cell-label">연락처</th>
            <td className="cell-value">{personalInfo.phone}</td>
            <th className="cell-label">이메일</th>
            <td className="cell-value">{personalInfo.email}</td>
          </tr>
          {personalInfo.hobbies && (
            <tr>
              <th className="cell-label">취미/특기</th>
              <td className="cell-value" colSpan={3}>{personalInfo.hobbies}</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* ── 학력사항 ── */}
      {education.some(e => e.schoolName) && (
        <table className="resume-table">
          <tbody>
            <tr>
              <th colSpan={6} className="table-section-header">학 력 사 항</th>
            </tr>
            <tr className="table-col-header">
              <th>입학</th>
              <th>졸업</th>
              <th>학교명</th>
              <th>전공</th>
              <th>학위</th>
              <th>상태 / 학점</th>
            </tr>
            {education.filter(e => e.schoolName).map(edu => (
              <tr key={edu.id}>
                <td className="cell-center">{formatMonth(edu.startDate)}</td>
                <td className="cell-center">{formatMonth(edu.endDate)}</td>
                <td className="cell-center">{edu.schoolName}</td>
                <td className="cell-center">{edu.major}</td>
                <td className="cell-center">{edu.degree}</td>
                <td className="cell-center">
                  {edu.status}
                  {edu.gpa && ` / ${edu.gpa}/${edu.gpaMax}`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* ── 경력사항 ── */}
      {workExperience.some(w => w.companyName) && (
        <table className="resume-table">
          <tbody>
            <tr>
              <th colSpan={5} className="table-section-header">경 력 사 항</th>
            </tr>
            <tr className="table-col-header">
              <th>입사</th>
              <th>퇴사</th>
              <th>회사명</th>
              <th>부서 / 직위</th>
              <th>담당 업무</th>
            </tr>
            {workExperience.filter(w => w.companyName).map(work => (
              <tr key={work.id}>
                <td className="cell-center">{formatMonth(work.startDate)}</td>
                <td className="cell-center">{work.isCurrent ? '현재' : formatMonth(work.endDate)}</td>
                <td className="cell-center">{work.companyName}</td>
                <td className="cell-center">
                  {work.department && <div>{work.department}</div>}
                  {work.position && <div>{work.position}</div>}
                </td>
                <td style={{ whiteSpace: 'pre-wrap', padding: '6px 10px', fontSize: '0.85rem' }}>{work.responsibilities}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* ── 병역사항 ── */}
      {militaryService.serviceType && (
        <table className="resume-table">
          <tbody>
            <tr>
              <th colSpan={4} className="table-section-header">병 역 사 항</th>
            </tr>
            <tr>
              <th className="cell-label">병역 구분</th>
              <td className="cell-value">{militaryService.serviceType}</td>
              {militaryService.serviceType === '복무완료' && (
                <>
                  <th className="cell-label">군별 / 계급</th>
                  <td className="cell-value">{militaryService.branch} / {militaryService.rank}</td>
                </>
              )}
              {militaryService.serviceType === '면제' && (
                <>
                  <th className="cell-label">면제 사유</th>
                  <td className="cell-value">{militaryService.exemptionReason}</td>
                </>
              )}
              {(militaryService.serviceType === '해당없음' || militaryService.serviceType === '병역미필') && (
                <><td /><td /></>
              )}
            </tr>
            {militaryService.serviceType === '복무완료' && (militaryService.startDate || militaryService.endDate) && (
              <tr>
                <th className="cell-label">복무 기간</th>
                <td className="cell-value" colSpan={3}>
                  {formatMonth(militaryService.startDate)} ~ {formatMonth(militaryService.endDate)}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {/* ── 자격증 / 면허 ── */}
      {certifications.some(c => c.name) && (
        <table className="resume-table">
          <tbody>
            <tr>
              <th colSpan={4} className="table-section-header">자 격 증 / 면 허</th>
            </tr>
            <tr className="table-col-header">
              <th>취득일</th>
              <th>자격증명</th>
              <th>발급 기관</th>
              <th>점수 / 급수</th>
            </tr>
            {certifications.filter(c => c.name).map(cert => (
              <tr key={cert.id}>
                <td className="cell-center">{formatMonth(cert.issueDate)}</td>
                <td className="cell-center">{cert.name}</td>
                <td className="cell-center">{cert.issuer}</td>
                <td className="cell-center">{cert.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* ── 어학 능력 ── */}
      {languageSkills.some(l => l.language) && (
        <table className="resume-table">
          <tbody>
            <tr>
              <th colSpan={5} className="table-section-header">어 학 능 력</th>
            </tr>
            <tr className="table-col-header">
              <th>언어</th>
              <th>시험명</th>
              <th>점수 / 등급</th>
              <th>취득일</th>
              <th>수준</th>
            </tr>
            {languageSkills.filter(l => l.language).map(lang => (
              <tr key={lang.id}>
                <td className="cell-center">{lang.language}</td>
                <td className="cell-center">{lang.testName}</td>
                <td className="cell-center">{lang.score}</td>
                <td className="cell-center">{formatMonth(lang.acquiredDate)}</td>
                <td className="cell-center">{lang.level ? levelMap[lang.level] : ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* ── 수상 / 활동 ── */}
      {awards.some(a => a.name) && (
        <table className="resume-table">
          <tbody>
            <tr>
              <th colSpan={4} className="table-section-header">수 상 / 대 외 활 동</th>
            </tr>
            <tr className="table-col-header">
              <th>날짜</th>
              <th>활동명 / 수상명</th>
              <th>기관</th>
              <th>내용</th>
            </tr>
            {awards.filter(a => a.name).map(award => (
              <tr key={award.id}>
                <td className="cell-center">{formatMonth(award.date)}</td>
                <td className="cell-center">{award.name}</td>
                <td className="cell-center">{award.issuer}</td>
                <td className="cell-center">{award.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* ── 서명란 ── */}
      <div className="signature-block">
        <p>위의 기재 사항은 사실과 다름없음을 확인합니다.</p>
        <p className="signature-date">{formatDate(applicationDate)}</p>
        <div className="signature-line">
          <span>성명: {personalInfo.nameKo}</span>
          <span className="stamp-box">서명 / 인</span>
        </div>
      </div>

      {/* ── 자기소개서 (별지) ── */}
      {selfIntroduction && (
        <div className="self-intro-page">
          <h2 className="self-intro-title">자 기 소 개 서</h2>
          {applyingFor && <div className="self-intro-meta">지원 직종: {applyingFor}</div>}
          <div className="self-intro-name">성명: {personalInfo.nameKo}</div>
          <div className="self-intro-body">{selfIntroduction}</div>
          <div className="signature-block">
            <p className="signature-date">{formatDate(applicationDate)}</p>
            <div className="signature-line">
              <span>성명: {personalInfo.nameKo}</span>
              <span className="stamp-box">서명 / 인</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
