export type ResumeCountry = 'KR' | 'US'

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
  degree: '고졸' | '전문학사' | '학사' | '석사' | '박사' | 'High School' | 'Associate' | 'Bachelor' | 'Master' | 'Doctorate' | ''
  startDate: string
  endDate: string
  status: '졸업' | '졸업예정' | '재학중' | '중퇴' | '수료' | 'Graduated' | 'Expected' | 'In Progress' | 'Incomplete' | 'Certificate' | ''
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
  country: ResumeCountry
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
  country: 'KR',
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

export function createExampleResumeData(country: ResumeCountry = 'KR'): ResumeData {
  if (country === 'US') {
    return {
      country: 'US',
      personalInfo: {
        nameKo: '',
        nameEn: 'ALEX KIM',
        photo: '',
        birthDate: '',
        gender: '',
        address: 'Seattle, WA',
        phone: '(555) 013-4829',
        email: 'alex.kim@example.com',
        nationality: '',
        hobbies: '',
      },
      education: [
        {
          id: crypto.randomUUID(),
          schoolName: 'University of Washington',
          major: 'Computer Science',
          degree: 'Bachelor',
          startDate: '2017-09',
          endDate: '2021-06',
          status: 'Graduated',
          gpa: '3.8',
          gpaMax: '4.0',
        },
      ],
      workExperience: [
        {
          id: crypto.randomUUID(),
          companyName: 'Northstar Software',
          department: 'Platform Engineering',
          position: 'Software Engineer',
          startDate: '2022-03',
          endDate: '',
          isCurrent: true,
          responsibilities: 'Built React and TypeScript dashboards used by 40,000+ monthly users.\nReduced API response time by 32% by optimizing database queries and caching high-traffic endpoints.\nLed accessibility fixes that improved Lighthouse accessibility score from 78 to 96.',
        },
        {
          id: crypto.randomUUID(),
          companyName: 'Bright Apps Studio',
          department: 'Product Engineering',
          position: 'Frontend Developer Intern',
          startDate: '2021-06',
          endDate: '2022-02',
          isCurrent: false,
          responsibilities: 'Implemented reusable UI components for a SaaS analytics product.\nPartnered with designers and QA to ship responsive layouts across desktop and mobile views.',
        },
      ],
      militaryService: {
        serviceType: '',
        branch: '',
        rank: '',
        startDate: '',
        endDate: '',
        exemptionReason: '',
      },
      certifications: [
        {
          id: crypto.randomUUID(),
          name: 'AWS Certified Developer - Associate',
          issuer: 'Amazon Web Services',
          issueDate: '2024-05',
          score: 'Active',
        },
        {
          id: crypto.randomUUID(),
          name: 'Professional Scrum Master I',
          issuer: 'Scrum.org',
          issueDate: '2023-11',
          score: 'Passed',
        },
      ],
      languageSkills: [
        {
          id: crypto.randomUUID(),
          language: 'English',
          testName: '',
          score: '',
          acquiredDate: '',
          level: 'native',
        },
        {
          id: crypto.randomUUID(),
          language: 'Korean',
          testName: 'TOPIK',
          score: 'Level 6',
          acquiredDate: '2022-10',
          level: 'advanced',
        },
      ],
      awards: [
        {
          id: crypto.randomUUID(),
          name: 'First Place, Campus Hackathon',
          issuer: 'University of Washington',
          date: '2020-04',
          description: 'Built a scheduling tool selected from 28 student teams.',
        },
      ],
      selfIntroduction: 'Software engineer with 3 years of experience building accessible, high-performing web applications. Strong background in React, TypeScript, API integration, and performance optimization. Known for turning product requirements into polished interfaces and measurable user experience improvements.',
      applyingFor: 'Software Engineer',
      applicationDate: new Date().toISOString().slice(0, 10),
    }
  }

  return {
    country: 'KR',
    personalInfo: {
      nameKo: '홍길동',
      nameEn: 'HONG GIL DONG',
      photo: '',
      birthDate: '1998-04-12',
      gender: '남',
      address: '서울특별시 강남구 테헤란로 123',
      phone: '010-1234-5678',
      email: 'gildong.hong@example.com',
      nationality: '대한민국',
      hobbies: '독서, 러닝, 웹 서비스 개발',
    },
    education: [
      {
        id: crypto.randomUUID(),
        schoolName: '한국대학교',
        major: '컴퓨터공학과',
        degree: '학사',
        startDate: '2017-03',
        endDate: '2021-02',
        status: '졸업',
        gpa: '4.1',
        gpaMax: '4.5',
      },
    ],
    workExperience: [
      {
        id: crypto.randomUUID(),
        companyName: '(주)테크솔루션',
        department: '플랫폼개발팀',
        position: '프론트엔드 개발자',
        startDate: '2021-07',
        endDate: '',
        isCurrent: true,
        responsibilities: 'React 기반 관리자 대시보드 개발 및 유지보수\n공통 컴포넌트 설계로 화면 개발 시간을 약 25% 단축\nAPI 연동 구조 개선 및 사용자 피드백 기반 UX 개선',
      },
      {
        id: crypto.randomUUID(),
        companyName: '(주)디지털랩',
        department: '서비스개발팀',
        position: '인턴 개발자',
        startDate: '2020-06',
        endDate: '2020-12',
        isCurrent: false,
        responsibilities: '사내 업무 자동화 도구 화면 구현\n테스트 케이스 정리 및 배포 전 QA 지원',
      },
    ],
    militaryService: {
      serviceType: '복무완료',
      branch: '육군',
      rank: '병장',
      startDate: '2018-05',
      endDate: '2020-01',
      exemptionReason: '',
    },
    certifications: [
      {
        id: crypto.randomUUID(),
        name: '정보처리기사',
        issuer: '한국산업인력공단',
        issueDate: '2022-06',
        score: '합격',
      },
      {
        id: crypto.randomUUID(),
        name: 'SQLD',
        issuer: '한국데이터산업진흥원',
        issueDate: '2021-12',
        score: '합격',
      },
    ],
    languageSkills: [
      {
        id: crypto.randomUUID(),
        language: '영어',
        testName: 'TOEIC',
        score: '905',
        acquiredDate: '2023-03',
        level: 'advanced',
      },
      {
        id: crypto.randomUUID(),
        language: '일본어',
        testName: 'JLPT',
        score: 'N2',
        acquiredDate: '2022-12',
        level: 'intermediate',
      },
    ],
    awards: [
      {
        id: crypto.randomUUID(),
        name: '교내 소프트웨어 경진대회 우수상',
        issuer: '한국대학교',
        date: '2020-11',
        description: '팀 프로젝트 기반 일정 관리 서비스 개발',
      },
    ],
    selfIntroduction: '저는 사용자 경험을 중심으로 문제를 해결하는 프론트엔드 개발자입니다. 대학 시절부터 웹 서비스 개발 프로젝트를 꾸준히 수행하며 React, TypeScript, API 연동, 반응형 UI 구현 역량을 쌓았습니다.\n\n이전 직장에서는 관리자 대시보드의 공통 컴포넌트를 정리하고 입력 폼 구조를 개선하여 반복 개발 시간을 줄였습니다. 또한 사용자 피드백을 바탕으로 화면 흐름을 개선해 실제 업무 효율 향상에 기여했습니다.\n\n입사 후에는 안정적인 코드 품질과 빠른 협업을 바탕으로 서비스 성장에 기여하고, 사용자가 신뢰할 수 있는 제품을 만드는 개발자가 되겠습니다.',
    applyingFor: '프론트엔드 개발자',
    applicationDate: new Date().toISOString().slice(0, 10),
  }
}
