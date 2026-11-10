import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

export default function OverlayScrollbar() {
  const trackRef = useRef(null)
  const thumbRef = useRef(null)

  useEffect(() => {
    const track = trackRef.current
    const thumb = thumbRef.current
    const root = document.documentElement
    const prefersNativeScrollbar = window.matchMedia?.('(max-width: 700px), (pointer: coarse)')
    if (prefersNativeScrollbar?.matches) return

    let timer
    let dragging = false
    let dragOffset = 0

    const update = () => {
      const viewport = root.clientHeight
      const height = root.scrollHeight
      const scrollable = Math.max(0, height - viewport)
      const thumbHeight = scrollable ? Math.min(viewport, Math.max(32, viewport * viewport / height)) : 0
      const top = scrollable ? (viewport - thumbHeight) * Math.max(0, Math.min(scrollable, window.scrollY)) / scrollable : 0
      thumb.style.height = `${thumbHeight}px`
      thumb.style.transform = `translateY(${top}px)`
      track.hidden = !scrollable
    }

    const show = () => {
      track.classList.add('is-visible')
      window.clearTimeout(timer)
      if (!dragging) timer = window.setTimeout(() => track.classList.remove('is-visible'), 1000)
    }

    const onScroll = () => {
      update()
      show()
    }

    const scrollToPointer = (clientY) => {
      const travel = root.clientHeight - thumb.offsetHeight
      const scrollable = root.scrollHeight - root.clientHeight
      if (travel > 0) window.scrollTo(0, Math.max(0, Math.min(travel, clientY - dragOffset)) * scrollable / travel)
    }

    const onPointerDown = (event) => {
      if (event.button !== 0) return
      event.preventDefault()
      dragging = true
      dragOffset = event.target === thumb ? event.clientY - thumb.getBoundingClientRect().top : thumb.offsetHeight / 2
      track.setPointerCapture(event.pointerId)
      track.classList.add('is-dragging')
      show()
      scrollToPointer(event.clientY)
    }
    const onPointerMove = (event) => {
      if (dragging) scrollToPointer(event.clientY)
    }
    const onPointerEnd = () => {
      if (!dragging) return
      dragging = false
      track.classList.remove('is-dragging')
      show()
    }

    const observer = new ResizeObserver(update)
    observer.observe(document.body)
    observer.observe(document.getElementById('root'))
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', update)
    track.addEventListener('pointerdown', onPointerDown)
    track.addEventListener('pointermove', onPointerMove)
    track.addEventListener('pointerup', onPointerEnd)
    track.addEventListener('pointercancel', onPointerEnd)
    track.addEventListener('lostpointercapture', onPointerEnd)
    root.classList.add('has-overlay-scrollbar')
    update()

    return () => {
      root.classList.remove('has-overlay-scrollbar')
      window.clearTimeout(timer)
      observer.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', update)
      track.removeEventListener('pointerdown', onPointerDown)
      track.removeEventListener('pointermove', onPointerMove)
      track.removeEventListener('pointerup', onPointerEnd)
      track.removeEventListener('pointercancel', onPointerEnd)
      track.removeEventListener('lostpointercapture', onPointerEnd)
    }
  }, [])

  return createPortal(
    <div ref={trackRef} className="overlay-scrollbar" aria-hidden="true" hidden>
      <div ref={thumbRef} className="overlay-scrollbar-thumb" />
    </div>,
    document.body,
  )
}
