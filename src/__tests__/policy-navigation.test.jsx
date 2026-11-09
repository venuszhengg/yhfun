import { act, fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import ContentPage from '../ContentPages.jsx'

vi.mock('../BackToTop.jsx', () => ({ default: () => null }))

afterEach(() => {
  vi.restoreAllMocks()
})

describe.each(['privacy', 'terms', 'refunds'])('%s policy navigation', (page) => {
  it.each(['en', 'zh-Hans'])('tracks sections while scrolling in %s', (language) => {
    let frame
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
      frame = callback
      return 1
    })
    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {})

    const { container, unmount } = render(<ContentPage page={page} language={language} href={(route) => `/?page=${route}`} />)
    const sections = [...container.querySelectorAll('.policy-copy section')]
    let tops = sections.map((_, index) => 300 + index * 300)
    let lastBottom = window.innerHeight + 100
    sections.forEach((section, index) => {
      vi.spyOn(section, 'getBoundingClientRect').mockImplementation(() => ({
        top: tops[index],
        bottom: index === sections.length - 1 ? lastBottom : tops[index] + 200,
      }))
    })
    const links = within(screen.getByRole('navigation', { name: 'On this page' })).getAllByRole('link')
    const flush = () => act(() => frame())

    flush()
    expect(links[0]).toHaveAttribute('aria-current', 'location')

    tops = sections.map((_, index) => -250 + index * 300)
    fireEvent.scroll(window)
    flush()
    expect(links[1]).toHaveAttribute('aria-current', 'location')
    expect(links[0]).not.toHaveAttribute('aria-current')

    tops = sections.map((_, index) => 150 + index * 300)
    fireEvent.scroll(window)
    flush()
    expect(links[0]).toHaveAttribute('aria-current', 'location')

    tops = sections.map((_, index) => 96 + (index - 2) * 300)
    fireEvent.resize(window)
    flush()
    expect(links[2]).toHaveAttribute('aria-current', 'location')

    tops = sections.map((_, index) => 200 + (index - sections.length + 1) * 300)
    lastBottom = window.innerHeight
    fireEvent.scroll(window)
    flush()
    expect(links.at(-1)).toHaveAttribute('aria-current', 'location')

    lastBottom = window.innerHeight + 1
    fireEvent.scroll(window)
    flush()
    expect(links.at(-2)).toHaveAttribute('aria-current', 'location')

    tops = sections.map((_, index) => 150 + index * 20)
    lastBottom = window.innerHeight - 1
    fireEvent.resize(window)
    flush()
    expect(links[0]).toHaveAttribute('aria-current', 'location')

    tops = sections.map((_, index) => 20 + index * 100)
    fireEvent.scroll(window)
    flush()
    expect(links[0]).toHaveAttribute('aria-current', 'location')

    unmount()
  })
})
