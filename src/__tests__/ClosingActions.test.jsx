import { act, render } from '@testing-library/react'
import { afterEach, expect, it, vi } from 'vitest'
import ActionButton from '../ActionButton.jsx'
import ClosingActions from '../ClosingActions.jsx'

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

it('centers the solid button and the split button at its default arrow width when stacked', () => {
  let stacked = true
  let labelLeft = 100
  let arrowWidth = 56
  let animatedArrowWidth = 56
  let notifyResize
  const disconnect = vi.fn()
  class ResizeObserverMock {
    constructor(callback) { notifyResize = callback }
    observe() {}
    disconnect = disconnect
  }
  vi.stubGlobal('ResizeObserver', ResizeObserverMock)
  vi.spyOn(HTMLElement.prototype, 'offsetTop', 'get').mockImplementation(function () {
    return this.classList.contains('yhf-action--split') && stacked ? 60 : 0
  })
  vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockImplementation(function () {
    return this.classList.contains('yhf-action-arrow') ? arrowWidth : 0
  })
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function () {
    if (this.classList.contains('yhf-action--solid')) {
      const shift = parseFloat(this.parentElement.style.getPropertyValue('--closing-solid-shift')) || 0
      return { left: 150 + shift, width: 100 }
    }
    if (this.classList.contains('yhf-action-label')) {
      const shift = parseFloat(this.parentElement.parentElement.style.getPropertyValue('--closing-split-shift')) || 0
      return { left: labelLeft + shift, width: 180 }
    }
    if (this.classList.contains('yhf-action-arrow')) return { left: 300, width: animatedArrowWidth }
    if (this.classList.contains('closing-actions')) return { left: 10, width: 400 }
    return { left: 0, width: 0 }
  })

  const { container, unmount } = render(
    <ClosingActions className="closing-actions">
      <ActionButton variant="solid">Let’s talk</ActionButton>
      <ActionButton variant="split" tone="olive">Explore our services</ActionButton>
    </ClosingActions>,
  )
  const group = container.firstChild
  expect(group.style.getPropertyValue('--closing-solid-shift')).toBe('10px')
  expect(group.style.getPropertyValue('--closing-split-shift')).toBe('-8px')

  animatedArrowWidth = 80
  act(() => notifyResize())
  expect(group.style.getPropertyValue('--closing-split-shift')).toBe('-8px')

  labelLeft = 120
  act(() => notifyResize())
  expect(group.style.getPropertyValue('--closing-split-shift')).toBe('-28px')

  arrowWidth = 72
  act(() => notifyResize())
  expect(group.style.getPropertyValue('--closing-split-shift')).toBe('-36px')

  stacked = false
  act(() => notifyResize())
  expect(group.style.getPropertyValue('--closing-solid-shift')).toBe('0px')
  expect(group.style.getPropertyValue('--closing-split-shift')).toBe('0px')

  unmount()
  expect(disconnect).toHaveBeenCalledOnce()
})
