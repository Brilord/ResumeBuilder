import type { ResumeData } from '../types/resume'

export function populatedKrResume(): ResumeData {
  return {
    country: 'KR',
    applyingFor: '프론트엔드 개발자',
    applicationDate: '2026-05-12',
    personalInfo: {
      nameKo: '홍길동',
      nameEn: 'HONG GIL DONG',
      photo: '',
      birthDate: '1998-04-12',
      gender: '남',
      address: '서울특별시 강남구 테헤란로 123',
      phone: '010-1234-5678',
      email: 'gildong@example.com',
      nationality: '대한민국',
      hobbies: '독서, 러닝',
    },
    education: [
      {
        id: 'edu-1',
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
        id: 'work-1',
        companyName: '테크회사',
        department: '제품개발팀',
        position: '프론트엔드 개발자',
        startDate: '2021-03',
        endDate: '',
        isCurrent: true,
        responsibilities: 'React 기반 지원자 대시보드 개발\n모바일 사용성 개선',
      },
    ],
    militaryService: {
      serviceType: '복무완료',
      branch: '육군',
      rank: '병장',
      startDate: '2018-01',
      endDate: '2019-09',
      exemptionReason: '',
    },
    certifications: [
      {
        id: 'cert-1',
        name: '정보처리기사',
        issuer: '한국산업인력공단',
        issueDate: '2022-06',
        score: '합격',
      },
    ],
    languageSkills: [
      {
        id: 'lang-1',
        language: '영어',
        testName: 'TOEIC',
        score: '930',
        acquiredDate: '2023-04',
        level: 'advanced',
      },
    ],
    awards: [
      {
        id: 'award-1',
        name: '해커톤 대상',
        issuer: '한국대학교',
        date: '2020-11',
        description: '모바일 이력서 서비스 개발',
      },
    ],
    selfIntroduction: '사용자 경험을 중요하게 생각하는 개발자입니다.',
  }
}

export function populatedUsResume(): ResumeData {
  return {
    country: 'US',
    applyingFor: 'Software Engineer',
    applicationDate: '2026-05-12',
    personalInfo: {
      nameKo: '',
      nameEn: 'ALEX KIM',
      photo: '',
      birthDate: '',
      gender: '',
      address: 'Seattle, WA',
      phone: '(555) 013-4829',
      email: 'alex@example.com',
      nationality: '',
      hobbies: '',
    },
    education: [
      {
        id: 'edu-us-1',
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
        id: 'work-us-1',
        companyName: 'Northstar Software',
        department: 'Platform Engineering',
        position: 'Software Engineer',
        startDate: '2022-03',
        endDate: '',
        isCurrent: true,
        responsibilities: 'Built responsive React dashboards.\nImproved mobile performance.',
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
        id: 'cert-us-1',
        name: 'AWS Certified Developer - Associate',
        issuer: 'Amazon Web Services',
        issueDate: '2024-05',
        score: 'Active',
      },
    ],
    languageSkills: [
      {
        id: 'lang-us-1',
        language: 'Korean',
        testName: 'TOPIK',
        score: 'Level 6',
        acquiredDate: '2022-10',
        level: 'advanced',
      },
    ],
    awards: [
      {
        id: 'award-us-1',
        name: 'Campus Hackathon Winner',
        issuer: 'University of Washington',
        date: '2020-04',
        description: 'Built a scheduling tool.',
      },
    ],
    selfIntroduction: 'Software engineer focused on accessible, high-performing web apps.',
  }
}

export function emptyKrResume(): ResumeData {
  return {
    ...populatedKrResume(),
    education: [],
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
  }
}
