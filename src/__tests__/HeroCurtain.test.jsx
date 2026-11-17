import { fireEvent, render, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useHeroCurtain } from '../useHeroCurtain.js'

function HeroCurtainHost() {
  useHeroCurtain()
  return <div data-hero-curtain>
    <section data-curtain-hero>Hero</section>
    <div className="hero-curtain-content">Content</div>
  </div>
}

describe('hero curtain motion', () => {
  it('keeps the scroll-linked motion active at mobile widths', async () => {
    vi.spyOn(window, 'matchMedia').mockImplementation((query) => ({
      matches: query === '(max-width: 700px)',
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }))
    vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function getBounds() {
      if (this.matches('[data-curtain-hero]')) return { top: 0, height: 800 }
      if (this.matches('.hero-curtain-content')) return { top: 400, height: 1000 }
      return { top: 0, height: 0 }
    })
    vi.spyOn(window, 'scrollY', 'get').mockReturnValue(400)

    const { container } = render(<HeroCurtainHost />)
    fireEvent.resize(window)
    fireEvent.scroll(window)

    await waitFor(() => expect(container.firstChild.style.getPropertyValue('--curtain-progress')).toBe('0.500'))
  })
})
