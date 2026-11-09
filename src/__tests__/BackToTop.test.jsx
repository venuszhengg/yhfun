import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import BackToTop from '../BackToTop.jsx'

afterEach(() => {
  vi.restoreAllMocks()
})

describe('Back to top', () => {
  it('appears after the first heading passes the header and returns to the top', () => {
    let frame
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
      frame = callback
      return 1
    })
    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {})
    vi.spyOn(window, 'matchMedia').mockReturnValue({ matches: true })
    const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
    const { container } = render(<>
      <header className="yhf-header" />
      <h2 id="first-heading">First heading</h2>
      <BackToTop showAfterId="first-heading" />
    </>)
    const header = container.querySelector('header')
    const heading = container.querySelector('h2')
    let headingTop = 100
    vi.spyOn(header, 'getBoundingClientRect').mockReturnValue({ bottom: 64 })
    vi.spyOn(heading, 'getBoundingClientRect').mockImplementation(() => ({ top: headingTop }))
    const flush = () => act(() => frame())
    const button = screen.getByRole('button', { hidden: true })

    flush()
    expect(button).toHaveAttribute('aria-hidden', 'true')
    expect(button).toHaveAttribute('tabindex', '-1')

    headingTop = 64
    fireEvent.scroll(window)
    flush()
    expect(button).toHaveAttribute('aria-hidden', 'false')
    expect(button).toHaveAccessibleName('Back to top')
    expect(button).toHaveTextContent('')
    expect(button).not.toHaveAttribute('tabindex')
    fireEvent.click(button)
    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'instant' })

    headingTop = 100
    fireEvent.scroll(window)
    flush()
    expect(button).toHaveAttribute('aria-hidden', 'true')
  })
})
