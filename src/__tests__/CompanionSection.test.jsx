import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import CompanionSection from '../CompanionSection.jsx'

function mediaMatches({ reduced = false, tall = true } = {}) {
  window.matchMedia.mockImplementation((query) => ({
    matches: query.includes('reduced-motion') ? reduced : tall,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }))
}

describe('CompanionSection', () => {
  it('updates the accessible principle in both scroll directions', async () => {
    mediaMatches()
    const { container, unmount } = render(<CompanionSection language="en" />)
    const track = container.querySelector('.companion-track')
    let top = 0
    track.getBoundingClientRect = () => ({ top, height: 4000 })
    Object.defineProperty(track.firstElementChild, 'offsetHeight', { value: 1000 })

    expect(screen.getByRole('heading', { level: 1, name: 'A companion you can count on.' })).toBeVisible()
    expect(screen.getByRole('heading', { name: 'Understand first' })).toBeVisible()
    expect(screen.queryByRole('heading', { name: 'Then try it out' })).not.toBeInTheDocument()

    for (const [offset, title] of [
      [-1500, 'Then try it out'],
      [-3000, 'Use it again'],
      [-1500, 'Then try it out'],
      [0, 'Understand first'],
    ]) {
      top = offset
      fireEvent.scroll(window)
      await waitFor(() => expect(screen.getByRole('heading', { name: title })).toBeVisible())
      expect(container.querySelectorAll('.companion-principle[aria-hidden="true"]')).toHaveLength(2)
    }

    expect(document.documentElement).toHaveClass('has-companion-snap')
    unmount()
    expect(document.documentElement).not.toHaveClass('has-companion-snap')
  })

  it('keeps all messages in normal flow on short viewports', () => {
    mediaMatches({ tall: false })
    const { container } = render(<CompanionSection language="en" />)
    expect(container.querySelector('.companion-track')).not.toHaveClass('is-enhanced')
    for (const title of ['Understand first', 'Then try it out', 'Use it again']) {
      expect(screen.getByRole('heading', { name: title })).toBeVisible()
    }
  })

  it('removes movement for reduced motion and retains Chinese content', () => {
    mediaMatches({ reduced: true })
    const { container } = render(<CompanionSection language="zh-Hans" />)
    expect(screen.getByRole('heading', { name: '先理解' })).toBeVisible()
    expect(container.querySelector('.companion-principle img')).not.toHaveAttribute('style')
    expect(container.querySelectorAll('.companion-principle img')).toHaveLength(3)
  })
})
