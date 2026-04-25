import type { ResumeData } from '../types/resume'

export type ExportFormat = 'doc' | 'html' | 'txt' | 'json'

const levelKo: Record<string, string> = {
  native: '원어민 수준',
  advanced: '고급',
  intermediate: '중급',
  beginner: '초급',
}

const levelEn: Record<string, string> = {
  native: 'Native',
  advanced: 'Advanced',
  intermediate: 'Intermediate',
  beginner: 'Beginner',
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

function linesToHtml(value: string) {
  return escapeHtml(value).replaceAll('\n', '<br>')
}

function formatMonth(ym: string, country: ResumeData['country']) {
  if (!ym) return ''
  const [year, month] = ym.split('-')
  if (country === 'US') {
    return new Date(Number(year), Number(month) - 1).toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    })
  }
  return `${year}년 ${month}월`
}

function formatDate(date: string) {
  if (!date) return ''
  const [year, month, day] = date.split('-')
  return `${year}년 ${Number(month)}월 ${Number(day)}일`
}

function downloadFile(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(url)
}

function filenameFor(data: ResumeData, extension: ExportFormat) {
  const country = data.country ?? 'KR'
  const fallback = country === 'US' ? 'Resume' : '이력서'
  const name = data.personalInfo.nameEn || data.personalInfo.nameKo || fallback
  const safeName = name.replace(/[\\/:*?"<>|]/g, '_').trim() || fallback
  return `${country === 'US' ? 'Resume' : '이력서'}_${safeName}.${extension}`
}

function buildText(data: ResumeData) {
  const country = data.country ?? 'KR'
  const { personalInfo, education, workExperience, certifications, languageSkills, awards } = data

  if (country === 'US') {
    const sections = [
      personalInfo.nameEn || personalInfo.nameKo || 'Your Name',
      [personalInfo.address, personalInfo.phone, personalInfo.email].filter(Boolean).join(' | '),
      data.applyingFor,
      '',
      data.selfIntroduction && `PROFESSIONAL SUMMARY\n${data.selfIntroduction}`,
      workExperience.some(w => w.companyName || w.position) && [
        'EXPERIENCE',
        ...workExperience.filter(w => w.companyName || w.position).map(work => [
          `${work.position || 'Role'}${work.companyName ? ` | ${work.companyName}` : ''}`,
          [formatMonth(work.startDate, country), work.isCurrent ? 'Present' : formatMonth(work.endDate, country)].filter(Boolean).join(' - '),
          work.department,
          work.responsibilities,
        ].filter(Boolean).join('\n')),
      ].join('\n\n'),
      education.some(e => e.schoolName) && [
        'EDUCATION',
        ...education.filter(e => e.schoolName).map(edu => [
          edu.schoolName,
          [edu.degree, edu.major].filter(Boolean).join(', '),
          [formatMonth(edu.startDate, country), formatMonth(edu.endDate, country)].filter(Boolean).join(' - '),
          [edu.status, edu.gpa ? `GPA ${edu.gpa}/${edu.gpaMax}` : ''].filter(Boolean).join(' | '),
        ].filter(Boolean).join('\n')),
      ].join('\n\n'),
      certifications.some(c => c.name) && [
        'CERTIFICATIONS',
        ...certifications.filter(c => c.name).map(cert => [cert.name, cert.issuer, formatMonth(cert.issueDate, country), cert.score].filter(Boolean).join(' | ')),
      ].join('\n'),
      languageSkills.some(l => l.language) && [
        'LANGUAGES',
        ...languageSkills.filter(l => l.language).map(lang => [lang.language, lang.level ? levelEn[lang.level] : '', lang.testName, lang.score].filter(Boolean).join(' | ')),
      ].join('\n'),
      awards.some(a => a.name) && [
        'AWARDS / ACTIVITIES',
        ...awards.filter(a => a.name).map(award => [award.name, award.issuer, formatMonth(award.date, country), award.description].filter(Boolean).join(' | ')),
      ].join('\n'),
    ]
    return sections.filter(Boolean).join('\n\n')
  }

  const military = data.militaryService
  const sections = [
    `이 력 서`,
    data.applyingFor && `지원 직종: ${data.applyingFor}`,
    '',
    `인적사항\n성명: ${personalInfo.nameKo} (${personalInfo.nameEn})\n생년월일: ${formatDate(personalInfo.birthDate)}\n성별: ${personalInfo.gender}\n국적: ${personalInfo.nationality}\n주소: ${personalInfo.address}\n연락처: ${personalInfo.phone}\n이메일: ${personalInfo.email}\n취미/특기: ${personalInfo.hobbies}`,
    education.some(e => e.schoolName) && [
      '학력사항',
      ...education.filter(e => e.schoolName).map(edu => [formatMonth(edu.startDate, country), formatMonth(edu.endDate, country), edu.schoolName, edu.major, edu.degree, edu.status, edu.gpa ? `${edu.gpa}/${edu.gpaMax}` : ''].filter(Boolean).join(' | ')),
    ].join('\n'),
    workExperience.some(w => w.companyName) && [
      '경력사항',
      ...workExperience.filter(w => w.companyName).map(work => [formatMonth(work.startDate, country), work.isCurrent ? '현재' : formatMonth(work.endDate, country), work.companyName, work.department, work.position, work.responsibilities].filter(Boolean).join('\n')),
    ].join('\n\n'),
    military.serviceType && `병역사항\n${[military.serviceType, military.branch, military.rank, formatMonth(military.startDate, country), formatMonth(military.endDate, country), military.exemptionReason].filter(Boolean).join(' | ')}`,
    certifications.some(c => c.name) && [
      '자격증 / 면허',
      ...certifications.filter(c => c.name).map(cert => [formatMonth(cert.issueDate, country), cert.name, cert.issuer, cert.score].filter(Boolean).join(' | ')),
    ].join('\n'),
    languageSkills.some(l => l.language) && [
      '어학 능력',
      ...languageSkills.filter(l => l.language).map(lang => [lang.language, lang.testName, lang.score, formatMonth(lang.acquiredDate, country), lang.level ? levelKo[lang.level] : ''].filter(Boolean).join(' | ')),
    ].join('\n'),
    awards.some(a => a.name) && [
      '수상 / 대외 활동',
      ...awards.filter(a => a.name).map(award => [formatMonth(award.date, country), award.name, award.issuer, award.description].filter(Boolean).join(' | ')),
    ].join('\n'),
    data.selfIntroduction && `자기소개서\n${data.selfIntroduction}`,
  ]
  return sections.filter(Boolean).join('\n\n')
}

function buildHtml(data: ResumeData) {
  const title = filenameFor(data, 'html').replace(/\.html$/, '')
  const country = data.country ?? 'KR'
  const { personalInfo, education, workExperience, militaryService, certifications, languageSkills, awards } = data

  if (country === 'US') {
    const displayName = personalInfo.nameEn || personalInfo.nameKo || 'Your Name'
    const section = (heading: string, body: string) => body ? `<section><h2>${heading}</h2>${body}</section>` : ''
    const entries = workExperience.filter(w => w.companyName || w.position).map(work => `
      <div class="entry">
        <div class="row">
          <strong>${escapeHtml(work.position || 'Role')}${work.companyName ? ` | ${escapeHtml(work.companyName)}` : ''}</strong>
          <span>${escapeHtml([formatMonth(work.startDate, country), work.isCurrent ? 'Present' : formatMonth(work.endDate, country)].filter(Boolean).join(' - '))}</span>
        </div>
        ${work.department ? `<div class="meta">${escapeHtml(work.department)}</div>` : ''}
        ${work.responsibilities ? `<div class="body">${linesToHtml(work.responsibilities)}</div>` : ''}
      </div>
    `).join('')

    const educationRows = education.filter(e => e.schoolName).map(edu => `
      <div class="entry">
        <div class="row">
          <strong>${escapeHtml(edu.schoolName)}</strong>
          <span>${escapeHtml([formatMonth(edu.startDate, country), formatMonth(edu.endDate, country)].filter(Boolean).join(' - '))}</span>
        </div>
        <div class="meta">${escapeHtml([edu.degree, edu.major].filter(Boolean).join(', '))}</div>
        ${(edu.status || edu.gpa) ? `<div class="meta">${escapeHtml([edu.status, edu.gpa ? `GPA ${edu.gpa}/${edu.gpaMax}` : ''].filter(Boolean).join(' | '))}</div>` : ''}
      </div>
    `).join('')

    const listItems = (items: string[]) => items.length ? `<ul>${items.map(item => `<li>${item}</li>`).join('')}</ul>` : ''

    return `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>${escapeHtml(title)}</title>
  <style>
    @page { margin: 0.65in; }
    body { font-family: Arial, Helvetica, sans-serif; color: #111; line-height: 1.4; max-width: 760px; margin: 0 auto; font-size: 11pt; }
    h1 { text-align: center; font-size: 22pt; margin: 0 0 4px; text-transform: uppercase; }
    h2 { border-bottom: 1px solid #333; font-size: 12pt; margin: 16px 0 8px; padding-bottom: 3px; text-transform: uppercase; }
    .contact, .role { text-align: center; margin: 2px 0; }
    .role { font-weight: bold; color: #1a4a8a; }
    .entry { margin-bottom: 10px; }
    .row { display: flex; justify-content: space-between; gap: 16px; }
    .row span { white-space: nowrap; color: #444; }
    .meta { color: #444; font-size: 10pt; }
    .body { white-space: pre-wrap; margin-top: 4px; }
    ul { margin-top: 4px; padding-left: 18px; }
    li { margin-bottom: 3px; }
  </style>
</head>
<body>
  <h1>${escapeHtml(displayName)}</h1>
  <div class="contact">${escapeHtml([personalInfo.address, personalInfo.phone, personalInfo.email].filter(Boolean).join(' | '))}</div>
  ${data.applyingFor ? `<div class="role">${escapeHtml(data.applyingFor)}</div>` : ''}
  ${section('Professional Summary', data.selfIntroduction ? `<div class="body">${linesToHtml(data.selfIntroduction)}</div>` : '')}
  ${section('Experience', entries)}
  ${section('Education', educationRows)}
  ${section('Certifications', listItems(certifications.filter(c => c.name).map(cert => escapeHtml([cert.name, cert.issuer, formatMonth(cert.issueDate, country), cert.score].filter(Boolean).join(' | ')))))}
  ${section('Languages', listItems(languageSkills.filter(l => l.language).map(lang => escapeHtml([lang.language, lang.level ? levelEn[lang.level] : '', lang.testName, lang.score].filter(Boolean).join(' | ')))))}
  ${section('Awards / Activities', listItems(awards.filter(a => a.name).map(award => escapeHtml([award.name, award.issuer, formatMonth(award.date, country), award.description].filter(Boolean).join(' | ')))))}
</body>
</html>`
  }

  const tableRows = (rows: string[][]) => rows.map(row => `<tr>${row.map(cell => `<td>${linesToHtml(cell)}</td>`).join('')}</tr>`).join('')
  const tableHeader = (titleText: string, span: number) => `<tr><th colspan="${span}" class="section-head">${escapeHtml(titleText)}</th></tr>`
  const table = (titleText: string, headers: string[], rows: string[][]) => rows.length ? `
    <table>
      ${tableHeader(titleText, headers.length)}
      <tr>${headers.map(header => `<th>${escapeHtml(header)}</th>`).join('')}</tr>
      ${tableRows(rows)}
    </table>
  ` : ''

  const personalRows = [
    ['성명', `${personalInfo.nameKo}${personalInfo.nameEn ? ` (${personalInfo.nameEn})` : ''}`, '생년월일', formatDate(personalInfo.birthDate)],
    ['성별', personalInfo.gender, '국적', personalInfo.nationality],
    ['주소', personalInfo.address, '연락처', personalInfo.phone],
    ['이메일', personalInfo.email, '취미/특기', personalInfo.hobbies],
  ]

  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>${escapeHtml(title)}</title>
  <style>
    @page { margin: 0.55in; }
    body { font-family: "Malgun Gothic", Arial, sans-serif; color: #111; line-height: 1.45; max-width: 780px; margin: 0 auto; font-size: 10.5pt; }
    h1 { text-align: center; font-size: 22pt; letter-spacing: 8px; color: #1a4a8a; margin: 0 0 12px; }
    .role { text-align: center; margin-bottom: 16px; color: #546e7a; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 14px; table-layout: fixed; }
    th, td { border: 1px solid #546e7a; padding: 6px 8px; vertical-align: middle; word-break: break-word; }
    th { background: #e8f0fb; color: #1a4a8a; font-weight: bold; text-align: center; }
    .section-head { background: #1a4a8a; color: white; letter-spacing: 4px; }
    .label { background: #f5f7fa; color: #1a4a8a; font-weight: bold; text-align: center; width: 18%; }
    .body { white-space: pre-wrap; }
  </style>
</head>
<body>
  <h1>이 력 서</h1>
  ${data.applyingFor ? `<div class="role">지원 직종: ${escapeHtml(data.applyingFor)}</div>` : ''}
  <table>
    ${tableHeader('인 적 사 항', 4)}
    ${personalRows.map(row => `<tr><td class="label">${escapeHtml(row[0])}</td><td>${linesToHtml(row[1])}</td><td class="label">${escapeHtml(row[2])}</td><td>${linesToHtml(row[3])}</td></tr>`).join('')}
  </table>
  ${table('학 력 사 항', ['입학', '졸업', '학교명', '전공', '학위', '상태 / 학점'], education.filter(e => e.schoolName).map(edu => [
    formatMonth(edu.startDate, country),
    formatMonth(edu.endDate, country),
    edu.schoolName,
    edu.major,
    edu.degree,
    [edu.status, edu.gpa ? `${edu.gpa}/${edu.gpaMax}` : ''].filter(Boolean).join(' / '),
  ]))}
  ${table('경 력 사 항', ['입사', '퇴사', '회사명', '부서 / 직위', '담당 업무'], workExperience.filter(w => w.companyName).map(work => [
    formatMonth(work.startDate, country),
    work.isCurrent ? '현재' : formatMonth(work.endDate, country),
    work.companyName,
    [work.department, work.position].filter(Boolean).join('\n'),
    work.responsibilities,
  ]))}
  ${militaryService.serviceType ? `<table>${tableHeader('병 역 사 항', 4)}<tr><td class="label">병역 구분</td><td>${escapeHtml(militaryService.serviceType)}</td><td class="label">군별 / 계급</td><td>${escapeHtml([militaryService.branch, militaryService.rank].filter(Boolean).join(' / '))}</td></tr><tr><td class="label">복무 기간</td><td colspan="3">${escapeHtml([formatMonth(militaryService.startDate, country), formatMonth(militaryService.endDate, country)].filter(Boolean).join(' ~ ') || militaryService.exemptionReason)}</td></tr></table>` : ''}
  ${table('자 격 증 / 면 허', ['취득일', '자격증명', '발급 기관', '점수 / 급수'], certifications.filter(c => c.name).map(cert => [formatMonth(cert.issueDate, country), cert.name, cert.issuer, cert.score]))}
  ${table('어 학 능 력', ['언어', '시험명', '점수 / 등급', '취득일', '수준'], languageSkills.filter(l => l.language).map(lang => [lang.language, lang.testName, lang.score, formatMonth(lang.acquiredDate, country), lang.level ? levelKo[lang.level] : '']))}
  ${table('수 상 / 대 외 활 동', ['날짜', '활동명 / 수상명', '기관', '내용'], awards.filter(a => a.name).map(award => [formatMonth(award.date, country), award.name, award.issuer, award.description]))}
  ${data.selfIntroduction ? `<table>${tableHeader('자 기 소 개 서', 1)}<tr><td class="body">${linesToHtml(data.selfIntroduction)}</td></tr></table>` : ''}
</body>
</html>`
}

export function exportResume(data: ResumeData, format: ExportFormat) {
  if (format === 'json') {
    downloadFile(filenameFor(data, format), JSON.stringify(data, null, 2), 'application/json;charset=utf-8')
    return
  }

  if (format === 'txt') {
    downloadFile(filenameFor(data, format), buildText(data), 'text/plain;charset=utf-8')
    return
  }

  const html = buildHtml(data)
  if (format === 'html') {
    downloadFile(filenameFor(data, format), html, 'text/html;charset=utf-8')
    return
  }

  downloadFile(filenameFor(data, format), html, 'application/msword;charset=utf-8')
}
