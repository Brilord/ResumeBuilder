import React, { useRef } from 'react'
import { createExampleResumeData } from '../types/resume'
import type { ResumeData, Education, WorkExperience, Certification, LanguageSkill, Award } from '../types/resume'

interface Props {
  data: ResumeData
  onChange: (data: ResumeData) => void
}

export default function ResumeForm({ data, onChange }: Props) {
  const photoInputRef = useRef<HTMLInputElement>(null)
  const country = data.country ?? 'KR'
  const isUS = country === 'US'

  const set = (path: string, value: unknown) => {
    const keys = path.split('.')
    const next = structuredClone(data) as unknown as Record<string, unknown>
    let cur = next as Record<string, unknown>
    for (let i = 0; i < keys.length - 1; i++) {
      cur = cur[keys[i]] as Record<string, unknown>
    }
    cur[keys[keys.length - 1]] = value
    onChange(next as unknown as ResumeData)
  }

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => set('personalInfo.photo', reader.result as string)
    reader.readAsDataURL(file)
  }

  // Education helpers
  const addEducation = () => {
    onChange({
      ...data,
      education: [
        ...data.education,
        { id: crypto.randomUUID(), schoolName: '', major: '', degree: '', startDate: '', endDate: '', status: '', gpa: '', gpaMax: '4.5' },
      ],
    })
  }
  const removeEducation = (id: string) => onChange({ ...data, education: data.education.filter(e => e.id !== id) })
  const updateEducation = (id: string, field: keyof Education, value: string) => {
    onChange({ ...data, education: data.education.map(e => e.id === id ? { ...e, [field]: value } : e) })
  }

  // Work Experience helpers
  const addWork = () => {
    onChange({
      ...data,
      workExperience: [
        ...data.workExperience,
        { id: crypto.randomUUID(), companyName: '', department: '', position: '', startDate: '', endDate: '', isCurrent: false, responsibilities: '' },
      ],
    })
  }
  const removeWork = (id: string) => onChange({ ...data, workExperience: data.workExperience.filter(w => w.id !== id) })
  const updateWork = (id: string, field: keyof WorkExperience, value: unknown) => {
    onChange({ ...data, workExperience: data.workExperience.map(w => w.id === id ? { ...w, [field]: value } : w) })
  }

  // Certification helpers
  const addCert = () => {
    onChange({ ...data, certifications: [...data.certifications, { id: crypto.randomUUID(), name: '', issuer: '', issueDate: '', score: '' }] })
  }
  const removeCert = (id: string) => onChange({ ...data, certifications: data.certifications.filter(c => c.id !== id) })
  const updateCert = (id: string, field: keyof Certification, value: string) => {
    onChange({ ...data, certifications: data.certifications.map(c => c.id === id ? { ...c, [field]: value } : c) })
  }

  // Language helpers
  const addLang = () => {
    onChange({ ...data, languageSkills: [...data.languageSkills, { id: crypto.randomUUID(), language: '', testName: '', score: '', acquiredDate: '', level: '' }] })
  }
  const removeLang = (id: string) => onChange({ ...data, languageSkills: data.languageSkills.filter(l => l.id !== id) })
  const updateLang = (id: string, field: keyof LanguageSkill, value: string) => {
    onChange({ ...data, languageSkills: data.languageSkills.map(l => l.id === id ? { ...l, [field]: value } : l) })
  }

  // Award helpers
  const addAward = () => {
    onChange({ ...data, awards: [...data.awards, { id: crypto.randomUUID(), name: '', issuer: '', date: '', description: '' }] })
  }
  const removeAward = (id: string) => onChange({ ...data, awards: data.awards.filter(a => a.id !== id) })
  const updateAward = (id: string, field: keyof Award, value: string) => {
    onChange({ ...data, awards: data.awards.map(a => a.id === id ? { ...a, [field]: value } : a) })
  }

  return (
    <div className="form-container">
      {/* ── 지원 정보 ── */}
      <section className="form-section">
        <h2 className="section-title">{isUS ? 'Resume Setup' : '지원 정보'}</h2>
        <div className="form-row">
          <label>{isUS ? 'Country' : '국가'}</label>
          <select value={country} onChange={e => set('country', e.target.value)}>
            <option value="KR">Korea / 한국</option>
            <option value="US">United States / 미국</option>
          </select>
        </div>
        <div className="form-row">
          <label>{isUS ? 'Target Role' : '지원 직종 / 부서'}</label>
          <input value={data.applyingFor} onChange={e => set('applyingFor', e.target.value)} placeholder={isUS ? 'Software Engineer' : '예: 소프트웨어 엔지니어'} />
        </div>
        {!isUS && (
          <div className="form-row">
            <label>작성일</label>
            <input type="date" value={data.applicationDate} onChange={e => set('applicationDate', e.target.value)} />
          </div>
        )}
        <div className="form-row">
          <label>{isUS ? 'Example' : '예시'}</label>
          <button className="example-fill-btn" onClick={() => onChange(createExampleResumeData(country))}>
            {isUS ? 'Fill US Example Resume' : '한국 이력서 예시 채우기'}
          </button>
        </div>
      </section>

      {/* ── 인적사항 ── */}
      <section className="form-section">
        <h2 className="section-title">{isUS ? 'Contact Information' : '인적사항'}</h2>
        <div className={isUS ? undefined : 'photo-row'}>
          {!isUS && (
            <div className="photo-upload" onClick={() => photoInputRef.current?.click()}>
              {data.personalInfo.photo
                ? <img src={data.personalInfo.photo} alt="증명사진" />
                : <span>증명사진<br />클릭하여 업로드</span>}
              <input ref={photoInputRef} type="file" accept="image/*" onChange={handlePhoto} style={{ display: 'none' }} />
            </div>
          )}
          <div className="personal-fields">
            {!isUS && (
              <div className="form-row">
                <label>성명 (한글)</label>
                <input value={data.personalInfo.nameKo} onChange={e => set('personalInfo.nameKo', e.target.value)} placeholder="홍길동" />
              </div>
            )}
            <div className="form-row">
              <label>{isUS ? 'Full Name' : '성명 (영문)'}</label>
              <input value={data.personalInfo.nameEn} onChange={e => set('personalInfo.nameEn', e.target.value)} placeholder={isUS ? 'Alex Kim' : 'HONG GIL DONG'} />
            </div>
            {!isUS && (
              <>
                <div className="form-row">
                  <label>생년월일</label>
                  <input type="date" value={data.personalInfo.birthDate} onChange={e => set('personalInfo.birthDate', e.target.value)} />
                </div>
                <div className="form-row">
                  <label>성별</label>
                  <select value={data.personalInfo.gender} onChange={e => set('personalInfo.gender', e.target.value)}>
                    <option value="">선택</option>
                    <option value="남">남</option>
                    <option value="여">여</option>
                  </select>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="form-row">
          <label>{isUS ? 'Location' : '주소'}</label>
          <input value={data.personalInfo.address} onChange={e => set('personalInfo.address', e.target.value)} placeholder={isUS ? 'Seattle, WA' : '서울특별시 강남구 테헤란로 00길 00'} />
        </div>
        <div className="form-row">
          <label>{isUS ? 'Phone' : '연락처'}</label>
          <input value={data.personalInfo.phone} onChange={e => set('personalInfo.phone', e.target.value)} placeholder={isUS ? '(555) 000-0000' : '010-0000-0000'} />
        </div>
        <div className="form-row">
          <label>{isUS ? 'Email' : '이메일'}</label>
          <input type="email" value={data.personalInfo.email} onChange={e => set('personalInfo.email', e.target.value)} placeholder="example@email.com" />
        </div>
        {!isUS && (
          <>
            <div className="form-row">
              <label>국적</label>
              <input value={data.personalInfo.nationality} onChange={e => set('personalInfo.nationality', e.target.value)} />
            </div>
            <div className="form-row">
              <label>취미 / 특기</label>
              <input value={data.personalInfo.hobbies} onChange={e => set('personalInfo.hobbies', e.target.value)} placeholder="독서, 등산, 프로그래밍" />
            </div>
          </>
        )}
      </section>

      {/* ── 학력사항 ── */}
      <section className="form-section">
        <h2 className="section-title">{isUS ? 'Education' : '학력사항'}</h2>
        {data.education.map((edu) => (
          <div key={edu.id} className="repeatable-item">
            <button className="remove-btn" onClick={() => removeEducation(edu.id)}>✕</button>
            <div className="form-grid-2">
              <div className="form-row">
                <label>{isUS ? 'School' : '학교명'}</label>
                <input value={edu.schoolName} onChange={e => updateEducation(edu.id, 'schoolName', e.target.value)} placeholder={isUS ? 'University of Washington' : 'OO대학교'} />
              </div>
              <div className="form-row">
                <label>{isUS ? 'Field' : '전공'}</label>
                <input value={edu.major} onChange={e => updateEducation(edu.id, 'major', e.target.value)} placeholder={isUS ? 'Computer Science' : '컴퓨터공학과'} />
              </div>
              <div className="form-row">
                <label>{isUS ? 'Degree' : '학위'}</label>
                <select value={edu.degree} onChange={e => updateEducation(edu.id, 'degree', e.target.value)}>
                  <option value="">{isUS ? 'Select' : '선택'}</option>
                  {isUS ? (
                    <>
                      <option value="High School">High School</option>
                      <option value="Associate">Associate</option>
                      <option value="Bachelor">Bachelor</option>
                      <option value="Master">Master</option>
                      <option value="Doctorate">Doctorate</option>
                    </>
                  ) : (
                    <>
                      <option value="고졸">고졸</option>
                      <option value="전문학사">전문학사</option>
                      <option value="학사">학사</option>
                      <option value="석사">석사</option>
                      <option value="박사">박사</option>
                    </>
                  )}
                </select>
              </div>
              <div className="form-row">
                <label>{isUS ? 'Status' : '상태'}</label>
                <select value={edu.status} onChange={e => updateEducation(edu.id, 'status', e.target.value)}>
                  <option value="">{isUS ? 'Select' : '선택'}</option>
                  {isUS ? (
                    <>
                      <option value="Graduated">Graduated</option>
                      <option value="Expected">Expected</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Incomplete">Incomplete</option>
                      <option value="Certificate">Certificate</option>
                    </>
                  ) : (
                    <>
                      <option value="졸업">졸업</option>
                      <option value="졸업예정">졸업예정</option>
                      <option value="재학중">재학중</option>
                      <option value="중퇴">중퇴</option>
                      <option value="수료">수료</option>
                    </>
                  )}
                </select>
              </div>
              <div className="form-row">
                <label>{isUS ? 'Start' : '입학년월'}</label>
                <input type="month" value={edu.startDate} onChange={e => updateEducation(edu.id, 'startDate', e.target.value)} />
              </div>
              <div className="form-row">
                <label>{isUS ? 'End' : '졸업년월'}</label>
                <input type="month" value={edu.endDate} onChange={e => updateEducation(edu.id, 'endDate', e.target.value)} />
              </div>
              <div className="form-row">
                <label>{isUS ? 'GPA' : '학점'}</label>
                <input value={edu.gpa} onChange={e => updateEducation(edu.id, 'gpa', e.target.value)} placeholder={isUS ? '3.8' : '3.8'} style={{ width: '80px' }} />
                <span style={{ margin: '0 6px', alignSelf: 'center' }}>/</span>
                <input value={edu.gpaMax} onChange={e => updateEducation(edu.id, 'gpaMax', e.target.value)} placeholder="4.5" style={{ width: '80px' }} />
              </div>
            </div>
          </div>
        ))}
        <button className="add-btn" onClick={addEducation}>{isUS ? '+ Add Education' : '+ 학력 추가'}</button>
      </section>

      {/* ── 경력사항 ── */}
      <section className="form-section">
        <h2 className="section-title">{isUS ? 'Experience' : '경력사항'}</h2>
        {data.workExperience.map((work) => (
          <div key={work.id} className="repeatable-item">
            <button className="remove-btn" onClick={() => removeWork(work.id)}>✕</button>
            <div className="form-grid-2">
              <div className="form-row">
                <label>{isUS ? 'Company' : '회사명'}</label>
                <input value={work.companyName} onChange={e => updateWork(work.id, 'companyName', e.target.value)} placeholder={isUS ? 'Acme Inc.' : '(주)OO회사'} />
              </div>
              <div className="form-row">
                <label>{isUS ? 'Team' : '부서'}</label>
                <input value={work.department} onChange={e => updateWork(work.id, 'department', e.target.value)} placeholder={isUS ? 'Platform Engineering' : '개발팀'} />
              </div>
              <div className="form-row">
                <label>{isUS ? 'Title' : '직위 / 직책'}</label>
                <input value={work.position} onChange={e => updateWork(work.id, 'position', e.target.value)} placeholder={isUS ? 'Senior Software Engineer' : '선임연구원'} />
              </div>
              <div className="form-row">
                <label>{isUS ? 'Start' : '입사년월'}</label>
                <input type="month" value={work.startDate} onChange={e => updateWork(work.id, 'startDate', e.target.value)} />
              </div>
              <div className="form-row">
                <label>{isUS ? 'End' : '퇴사년월'}</label>
                <input type="month" value={work.endDate} onChange={e => updateWork(work.id, 'endDate', e.target.value)} disabled={work.isCurrent} />
              </div>
              <div className="form-row checkbox-row">
                <label>
                  <input type="checkbox" checked={work.isCurrent} onChange={e => updateWork(work.id, 'isCurrent', e.target.checked)} />
                  &nbsp;{isUS ? 'Current role' : '현재 재직 중'}
                </label>
              </div>
            </div>
            <div className="form-row">
              <label>{isUS ? 'Highlights' : '담당 업무'}</label>
              <textarea
                value={work.responsibilities}
                onChange={e => updateWork(work.id, 'responsibilities', e.target.value)}
                placeholder={isUS ? 'Use bullet-style achievements, metrics, and scope.' : '주요 업무 내용을 기술해 주세요'}
                rows={3}
              />
            </div>
          </div>
        ))}
        <button className="add-btn" onClick={addWork}>{isUS ? '+ Add Experience' : '+ 경력 추가'}</button>
      </section>

      {/* ── 병역사항 ── */}
      {!isUS && <section className="form-section">
        <h2 className="section-title">병역사항</h2>
        <div className="form-grid-2">
          <div className="form-row">
            <label>병역 구분</label>
            <select value={data.militaryService.serviceType} onChange={e => set('militaryService.serviceType', e.target.value)}>
              <option value="">선택</option>
              <option value="복무완료">복무완료</option>
              <option value="병역미필">병역미필</option>
              <option value="면제">면제</option>
              <option value="해당없음">해당없음</option>
            </select>
          </div>
          {data.militaryService.serviceType === '복무완료' && (
            <>
              <div className="form-row">
                <label>군별</label>
                <input value={data.militaryService.branch} onChange={e => set('militaryService.branch', e.target.value)} placeholder="육군" />
              </div>
              <div className="form-row">
                <label>최종 계급</label>
                <input value={data.militaryService.rank} onChange={e => set('militaryService.rank', e.target.value)} placeholder="병장" />
              </div>
              <div className="form-row">
                <label>복무 기간 (시작)</label>
                <input type="month" value={data.militaryService.startDate} onChange={e => set('militaryService.startDate', e.target.value)} />
              </div>
              <div className="form-row">
                <label>복무 기간 (종료)</label>
                <input type="month" value={data.militaryService.endDate} onChange={e => set('militaryService.endDate', e.target.value)} />
              </div>
            </>
          )}
          {data.militaryService.serviceType === '면제' && (
            <div className="form-row">
              <label>면제 사유</label>
              <input value={data.militaryService.exemptionReason} onChange={e => set('militaryService.exemptionReason', e.target.value)} placeholder="면제 사유" />
            </div>
          )}
        </div>
      </section>}

      {/* ── 자격증 / 면허 ── */}
      <section className="form-section">
        <h2 className="section-title">{isUS ? 'Certifications' : '자격증 / 면허'}</h2>
        {data.certifications.map((cert) => (
          <div key={cert.id} className="repeatable-item">
            <button className="remove-btn" onClick={() => removeCert(cert.id)}>✕</button>
            <div className="form-grid-2">
              <div className="form-row">
                <label>{isUS ? 'Name' : '자격증명'}</label>
                <input value={cert.name} onChange={e => updateCert(cert.id, 'name', e.target.value)} placeholder={isUS ? 'AWS Certified Developer' : '정보처리기사'} />
              </div>
              <div className="form-row">
                <label>{isUS ? 'Issuer' : '발급 기관'}</label>
                <input value={cert.issuer} onChange={e => updateCert(cert.id, 'issuer', e.target.value)} placeholder={isUS ? 'Amazon Web Services' : '한국산업인력공단'} />
              </div>
              <div className="form-row">
                <label>{isUS ? 'Date' : '취득일'}</label>
                <input type="month" value={cert.issueDate} onChange={e => updateCert(cert.id, 'issueDate', e.target.value)} />
              </div>
              <div className="form-row">
                <label>{isUS ? 'Detail' : '점수 / 급수'}</label>
                <input value={cert.score} onChange={e => updateCert(cert.id, 'score', e.target.value)} placeholder={isUS ? 'Active' : '1급 / 합격'} />
              </div>
            </div>
          </div>
        ))}
        <button className="add-btn" onClick={addCert}>{isUS ? '+ Add Certification' : '+ 자격증 추가'}</button>
      </section>

      {/* ── 어학 능력 ── */}
      <section className="form-section">
        <h2 className="section-title">{isUS ? 'Languages' : '어학 능력'}</h2>
        {data.languageSkills.map((lang) => (
          <div key={lang.id} className="repeatable-item">
            <button className="remove-btn" onClick={() => removeLang(lang.id)}>✕</button>
            <div className="form-grid-2">
              <div className="form-row">
                <label>{isUS ? 'Language' : '언어'}</label>
                <input value={lang.language} onChange={e => updateLang(lang.id, 'language', e.target.value)} placeholder={isUS ? 'English' : '영어'} />
              </div>
              <div className="form-row">
                <label>{isUS ? 'Test' : '시험명'}</label>
                <input value={lang.testName} onChange={e => updateLang(lang.id, 'testName', e.target.value)} placeholder={isUS ? 'TOEFL' : 'TOEIC'} />
              </div>
              <div className="form-row">
                <label>{isUS ? 'Score' : '점수 / 등급'}</label>
                <input value={lang.score} onChange={e => updateLang(lang.id, 'score', e.target.value)} placeholder="900" />
              </div>
              <div className="form-row">
                <label>{isUS ? 'Date' : '취득일'}</label>
                <input type="month" value={lang.acquiredDate} onChange={e => updateLang(lang.id, 'acquiredDate', e.target.value)} />
              </div>
              <div className="form-row">
                <label>{isUS ? 'Level' : '수준'}</label>
                <select value={lang.level} onChange={e => updateLang(lang.id, 'level', e.target.value)}>
                  <option value="">{isUS ? 'Select' : '선택'}</option>
                  <option value="native">{isUS ? 'Native' : '원어민 수준'}</option>
                  <option value="advanced">{isUS ? 'Advanced' : '고급'}</option>
                  <option value="intermediate">{isUS ? 'Intermediate' : '중급'}</option>
                  <option value="beginner">{isUS ? 'Beginner' : '초급'}</option>
                </select>
              </div>
            </div>
          </div>
        ))}
        <button className="add-btn" onClick={addLang}>{isUS ? '+ Add Language' : '+ 어학 추가'}</button>
      </section>

      {/* ── 수상 / 활동 ── */}
      <section className="form-section">
        <h2 className="section-title">{isUS ? 'Awards / Activities' : '수상 / 대외 활동'}</h2>
        {data.awards.map((award) => (
          <div key={award.id} className="repeatable-item">
            <button className="remove-btn" onClick={() => removeAward(award.id)}>✕</button>
            <div className="form-grid-2">
              <div className="form-row">
                <label>{isUS ? 'Name' : '활동명 / 수상명'}</label>
                <input value={award.name} onChange={e => updateAward(award.id, 'name', e.target.value)} placeholder={isUS ? 'Hackathon Winner' : '교내 프로그래밍 대회 1위'} />
              </div>
              <div className="form-row">
                <label>{isUS ? 'Organization' : '기관명'}</label>
                <input value={award.issuer} onChange={e => updateAward(award.id, 'issuer', e.target.value)} placeholder={isUS ? 'University Club' : 'OO대학교'} />
              </div>
              <div className="form-row">
                <label>{isUS ? 'Date' : '날짜'}</label>
                <input type="month" value={award.date} onChange={e => updateAward(award.id, 'date', e.target.value)} />
              </div>
              <div className="form-row">
                <label>{isUS ? 'Description' : '내용'}</label>
                <input value={award.description} onChange={e => updateAward(award.id, 'description', e.target.value)} placeholder={isUS ? 'Brief achievement or scope' : '간략한 설명'} />
              </div>
            </div>
          </div>
        ))}
        <button className="add-btn" onClick={addAward}>{isUS ? '+ Add Activity' : '+ 활동 추가'}</button>
      </section>

      {/* ── 자기소개서 ── */}
      <section className="form-section">
        <h2 className="section-title">{isUS ? 'Professional Summary' : '자기소개서'}</h2>
        <p className="section-hint">{isUS ? 'Write a concise 2-4 sentence summary tailored to the target role.' : '성장 과정, 성격의 장단점, 지원 동기, 입사 후 포부 등을 기술하세요.'}</p>
        <textarea
          className="self-intro-textarea"
          value={data.selfIntroduction}
          onChange={e => set('selfIntroduction', e.target.value)}
          placeholder={isUS ? 'Results-driven software engineer with experience building...' : '자기소개서를 작성해 주세요...'}
          rows={isUS ? 5 : 12}
        />
        <div className="char-count">{data.selfIntroduction.length}{isUS ? ' characters' : '자'}</div>
      </section>
    </div>
  )
}
