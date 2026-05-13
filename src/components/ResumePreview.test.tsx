import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import ResumePreview from './ResumePreview'
import { emptyKrResume, populatedKrResume, populatedUsResume } from '../test/fixtures'

describe('ResumePreview', () => {
  it('renders all populated Korean resume sections', () => {
    render(<ResumePreview data={populatedKrResume()} />)

    expect(screen.getByRole('heading', { name: '이 력 서' })).toBeInTheDocument()
    expect(screen.getByText('인 적 사 항')).toBeInTheDocument()
    expect(screen.getByText('학 력 사 항')).toBeInTheDocument()
    expect(screen.getByText('경 력 사 항')).toBeInTheDocument()
    expect(screen.getByText('병 역 사 항')).toBeInTheDocument()
    expect(screen.getByText('자 격 증 / 면 허')).toBeInTheDocument()
    expect(screen.getByText('어 학 능 력')).toBeInTheDocument()
    expect(screen.getByText('수 상 / 대 외 활 동')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '자 기 소 개 서' })).toBeInTheDocument()

    expect(screen.getByText('홍길동')).toBeInTheDocument()
    expect(screen.getAllByText('한국대학교').length).toBeGreaterThan(0)
    expect(screen.getByText('테크회사')).toBeInTheDocument()
    expect(screen.getByText('정보처리기사')).toBeInTheDocument()
    expect(screen.getByText('TOEIC')).toBeInTheDocument()
    expect(screen.getByText('해커톤 대상')).toBeInTheDocument()
  })

  it('renders all populated US resume sections', () => {
    render(<ResumePreview data={populatedUsResume()} />)

    expect(screen.getByRole('heading', { name: 'ALEX KIM' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Professional Summary' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Experience' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Education' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Certifications' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Languages' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Awards / Activities' })).toBeInTheDocument()

    expect(screen.getByText('Northstar Software', { exact: false })).toBeInTheDocument()
    expect(screen.getByText('University of Washington')).toBeInTheDocument()
    expect(screen.getByText('AWS Certified Developer - Associate')).toBeInTheDocument()
    expect(screen.getByText('Korean')).toBeInTheDocument()
    expect(screen.getByText('Campus Hackathon Winner')).toBeInTheDocument()
  })

  it('hides empty Korean optional sections', () => {
    render(<ResumePreview data={emptyKrResume()} />)

    expect(screen.getByText('인 적 사 항')).toBeInTheDocument()
    expect(screen.queryByText('학 력 사 항')).not.toBeInTheDocument()
    expect(screen.queryByText('경 력 사 항')).not.toBeInTheDocument()
    expect(screen.queryByText('병 역 사 항')).not.toBeInTheDocument()
    expect(screen.queryByText('자 격 증 / 면 허')).not.toBeInTheDocument()
    expect(screen.queryByText('어 학 능 력')).not.toBeInTheDocument()
    expect(screen.queryByText('수 상 / 대 외 활 동')).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: '자 기 소 개 서' })).not.toBeInTheDocument()
  })

  it('uses stacked US entry markup for date ranges', () => {
    const { container } = render(<ResumePreview data={populatedUsResume()} />)
    const experience = screen.getByRole('heading', { name: 'Experience' }).closest('section')
    expect(experience).toBeInTheDocument()

    const entryHeading = within(experience as HTMLElement)
      .getByText('Software Engineer', { exact: false })
      .closest('.us-entry-heading')
    const dateRange = within(entryHeading as HTMLElement).getByText('Mar 2022 - Present')

    expect(entryHeading).toHaveClass('us-entry-heading')
    expect(dateRange).toHaveClass('us-date-range')
    expect(container.querySelector('.resume-preview--us')).toBeInTheDocument()
  })
})
