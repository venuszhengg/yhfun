import { render, screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import CompanionSection from '../CompanionSection.jsx'

describe('CompanionSection', () => {
  it('shows all three principles and their original illustrations in document order', () => {
    const { container } = render(<CompanionSection language="en" />)
    expect(screen.getByRole('heading', { level: 2, name: 'A companion you can count on.' })).toBeVisible()

    const articles = screen.getAllByRole('article')
    const expected = [
      ['Understand first', 'Start with your situation as it really is.', "What%20you're%20facing.svg"],
      ['Then try it out', 'Take small steps and learn from what happens.', 'Bring%20ideas%20into%20the%20workflow.svg'],
      ['Use it again', 'Keep methods you can draw on in future.', 'Let%20feedback%20guide%20decisions.svg'],
    ]
    expect(articles).toHaveLength(3)
    expected.forEach(([title, description, file], index) => {
      expect(within(articles[index]).getByRole('heading', { name: title })).toBeVisible()
      expect(within(articles[index]).getByText(description)).toBeVisible()
      expect(articles[index].querySelector('img')).toHaveAttribute('src', `/images/service-icons/${file}`)
      expect(articles[index].querySelector('[data-reveal="text"]')).toHaveAttribute('data-reveal-order', String(index))
    })
    expect(container.querySelector('.companion-snap-points')).not.toBeInTheDocument()
    expect(document.documentElement).not.toHaveClass('has-companion-snap')
  })

  it('preserves the Chinese text', () => {
    render(<CompanionSection language="zh-Hans" />)
    for (const title of ['先理解', '再尝试', '能复用']) {
      expect(screen.getByRole('heading', { name: title })).toBeVisible()
    }
  })

  it('uses the scroll sequence only when the viewport fits and motion is allowed', () => {
    vi.spyOn(window, 'matchMedia').mockImplementation((query) => ({
      matches: query === '(min-width: 768px) and (min-height: 600px)',
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }))

    const { container } = render(<CompanionSection language="en" />)

    expect(container.querySelector('.companion-section')).toHaveClass('is-enhanced')
  })

  it('keeps the complete static version when reduced motion is requested', () => {
    vi.spyOn(window, 'matchMedia').mockImplementation((query) => ({
      matches: true,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }))

    const { container } = render(<CompanionSection language="en" />)

    expect(container.querySelector('.companion-section')).not.toHaveClass('is-enhanced')
    expect(screen.getAllByRole('article')).toHaveLength(3)
  })
})
