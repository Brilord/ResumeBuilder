export interface PersonalInfo {
  nameKo: string
  nameEn: string
  photo: string
  birthDate: string
  gender: '남' | '여' | ''
  address: string
  phone: string
  email: string
  nationality: string
  hobbies: string
}

export interface Education {
  id: string
  schoolName: string
  major: string
  degree: '고졸' | '전문학사' | '학사' | '석사' | '박사' | ''
  startDate: string
  endDate: string
  status: '졸업' | '졸업예정' | '재학중' | '중퇴' | '수료' | ''
  gpa: string
  gpaMax: string
}

export interface WorkExperience {
  id: string
  companyName: string
  department: string
  position: string
  startDate: string
  endDate: string
  isCurrent: boolean
  responsibilities: string
}

export interface MilitaryService {
  serviceType: '해당없음' | '병역미필' | '복무완료' | '면제' | ''
  branch: string
  rank: string
  startDate: string
  endDate: string
  exemptionReason: string
}

export interface Certification {
  id: string
  name: string
  issuer: string
  issueDate: string
  score: string
}

export interface LanguageSkill {
  id: string
  language: string
  testName: string
  score: string
  acquiredDate: string
  level: 'beginner' | 'intermediate' | 'advanced' | 'native' | ''
}

export interface Award {
  id: string
  name: string
  issuer: string
  date: string
  description: string
}

export interface ResumeData {
  personalInfo: PersonalInfo
  education: Education[]
  workExperience: WorkExperience[]
  militaryService: MilitaryService
  certifications: Certification[]
  languageSkills: LanguageSkill[]
  awards: Award[]
  selfIntroduction: string
  applyingFor: string
  applicationDate: string
}

export const defaultResumeData: ResumeData = {
  personalInfo: {
    nameKo: '',
    nameEn: '',
    photo: '',
    birthDate: '',
    gender: '',
    address: '',
    phone: '',
    email: '',
    nationality: '대한민국',
    hobbies: '',
  },
  education: [
    {
      id: crypto.randomUUID(),
      schoolName: '',
      major: '',
      degree: '',
      startDate: '',
      endDate: '',
      status: '',
      gpa: '',
      gpaMax: '4.5',
    },
  ],
  workExperience: [],
  militaryService: {
    serviceType: '',
    branch: '',
    rank: '',
    startDate: '',
    endDate: '',
    exemptionReason: '',
  },
  certifications: [],
  languageSkills: [],
  awards: [],
  selfIntroduction: '',
  applyingFor: '',
  applicationDate: new Date().toISOString().slice(0, 10),
}
