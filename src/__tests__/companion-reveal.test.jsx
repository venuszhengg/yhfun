import { act, render, waitFor } from '@testing-library/react'
import { expect, it, vi } from 'vitest'
import { useScrollReveals } from '../useScrollReveals.js'

function RevealHost() {
  useScrollReveals()
  return <div />
}

it('reveals content added after the route loads', async () => {
  let onIntersect
  const observe = vi.fn()
  const unobserve = vi.fn()
  const disconnect = vi.fn()
  vi.stubGlobal('IntersectionObserver', class {
    constructor(callback) { onIntersect = callback }
    observe = observe
    unobserve = unobserve
    disconnect = disconnect
  })

  const { unmount } = render(<RevealHost />)
  const element = document.createElement('div')
  element.dataset.reveal = 'text'
  element.getBoundingClientRect = () => ({ top: 1000, height: 100 })
  act(() => document.body.append(element))
  await waitFor(() => expect(observe).toHaveBeenCalledWith(element))
  expect(element).toHaveAttribute('data-reveal-state', 'pending')

  act(() => onIntersect([{
    target: element,
    isIntersecting: true,
    intersectionRatio: 1,
    boundingClientRect: { top: 200, height: 100 },
    intersectionRect: { height: 100 },
  }]))
  expect(element).toHaveAttribute('data-reveal-state', 'visible')
  unmount()
  expect(disconnect).toHaveBeenCalled()
  element.remove()
})
