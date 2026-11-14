import { act, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import HeaderLoadProgress from '../components/HeaderLoadProgress.jsx'

describe('HeaderLoadProgress', () => {
  it('finishes once and does not restart after the route is ready', () => {
    vi.useFakeTimers()
    const frames = []
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
      frames.push(callback)
      return frames.length
    })
    const onComplete = vi.fn()
    const { container, rerender } = render(<HeaderLoadProgress ready={false} onComplete={onComplete} />)

    act(() => {
      frames.shift()()
    })
    expect(container.firstChild).toHaveClass('yh-progress--loading')

    rerender(<HeaderLoadProgress ready onComplete={onComplete} />)
    act(() => {
      frames.shift()()
    })

    act(() => vi.advanceTimersByTime(1000))

    expect(container.firstChild).toHaveClass('yh-progress--done')
    expect(screen.getByRole('status')).toHaveTextContent('Website ready')
    expect(onComplete).toHaveBeenCalledTimes(1)
    vi.useRealTimers()
  })
})
