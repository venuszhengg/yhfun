import { act, fireEvent, render } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import OverlayScrollbar from '../OverlayScrollbar.jsx'

afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
})

describe('OverlayScrollbar', () => {
  it('tracks scrolling, fades after inactivity, and restores the native scrollbar on unmount', () => {
    vi.useFakeTimers()
    const root = document.createElement('div')
    root.id = 'root'
    document.body.appendChild(root)
    vi.spyOn(document.documentElement, 'clientHeight', 'get').mockReturnValue(800)
    vi.spyOn(document.documentElement, 'scrollHeight', 'get').mockReturnValue(4000)
    vi.spyOn(window, 'scrollY', 'get').mockReturnValue(1600)

    const { unmount } = render(<OverlayScrollbar />, { container: root })
    const track = document.querySelector('.overlay-scrollbar')
    const thumb = track.firstElementChild

    expect(document.documentElement).toHaveClass('has-overlay-scrollbar')
    expect(track).not.toHaveAttribute('hidden')
    expect(thumb).toHaveStyle({ height: '160px', transform: 'translateY(320px)' })

    fireEvent.scroll(window)
    expect(track).toHaveClass('is-visible')
    act(() => vi.advanceTimersByTime(1000))
    expect(track).not.toHaveClass('is-visible')

    unmount()
    expect(document.documentElement).not.toHaveClass('has-overlay-scrollbar')
    expect(document.querySelector('.overlay-scrollbar')).toBeNull()
    root.remove()
  })

  it('hides the indicator when the document does not scroll', () => {
    const root = document.createElement('div')
    root.id = 'root'
    document.body.appendChild(root)
    vi.spyOn(document.documentElement, 'clientHeight', 'get').mockReturnValue(800)
    vi.spyOn(document.documentElement, 'scrollHeight', 'get').mockReturnValue(800)

    const { unmount } = render(<OverlayScrollbar />, { container: root })
    expect(document.querySelector('.overlay-scrollbar')).toHaveAttribute('hidden')
    unmount()
    root.remove()
  })

  it('keeps the native scrollbar on mobile and coarse-pointer devices', () => {
    vi.spyOn(window, 'matchMedia').mockReturnValue({ matches: true })
    const root = document.createElement('div')
    root.id = 'root'
    document.body.appendChild(root)

    const { unmount } = render(<OverlayScrollbar />, { container: root })

    expect(document.documentElement).not.toHaveClass('has-overlay-scrollbar')
    expect(document.querySelector('.overlay-scrollbar')).toHaveAttribute('hidden')

    unmount()
    root.remove()
  })
})
