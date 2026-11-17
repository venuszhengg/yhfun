import { useLayoutEffect, useRef } from 'react'
import './ClosingActions.css'

export default function ClosingActions({ className, children }) {
  const containerRef = useRef(null)

  useLayoutEffect(() => {
    const container = containerRef.current
    const solid = container.querySelector(':scope > .yhf-action--solid')
    const split = container.querySelector(':scope > .yhf-action--split')
    const label = split.querySelector('.yhf-action-label')
    const arrow = split.querySelector('.yhf-action-arrow')
    let solidShift = 0
    let splitShift = 0
    let resizeFrame

    const align = () => {
      const containerRect = container.getBoundingClientRect()
      const solidRect = solid.getBoundingClientRect()
      const labelRect = label.getBoundingClientRect()
      const stacked = solid.offsetTop < split.offsetTop
      const center = containerRect.left + containerRect.width / 2
      const nextSolidShift = stacked ? center - (solidRect.left + solidRect.width / 2 - solidShift) : 0
      const nextSplitShift = stacked
        ? center - (labelRect.left + (labelRect.width + arrow.offsetWidth) / 2 - splitShift)
        : 0
      if (Math.abs(nextSolidShift - solidShift) > 0.01) {
        solidShift = nextSolidShift
        container.style.setProperty('--closing-solid-shift', `${solidShift}px`)
      }
      if (Math.abs(nextSplitShift - splitShift) > 0.01) {
        splitShift = nextSplitShift
        container.style.setProperty('--closing-split-shift', `${splitShift}px`)
      }
    }

    align()
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(align)
    if (observer) {
      observer.observe(container)
      observer.observe(solid)
      observer.observe(split)
      observer.observe(label)
      observer.observe(arrow)
    }
    const handleResize = () => {
      cancelAnimationFrame(resizeFrame)
      resizeFrame = requestAnimationFrame(align)
    }
    window.addEventListener('resize', handleResize)
    return () => {
      observer?.disconnect()
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(resizeFrame)
    }
  }, [])

  return <div ref={containerRef} className={`${className} closing-actions-aligned`}>{children}</div>
}
