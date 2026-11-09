import { useEffect } from 'react'

export function useHeroCurtain() {
  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const tracks = new Map()
    let frame = 0

    const measure = (track) => {
      const state = tracks.get(track)
      if (!state) return
      const bounds = state.hero.getBoundingClientRect()
      const content = track.querySelector(':scope > .hero-curtain-content')
      state.height = bounds.height
      const contentHeight = content?.getBoundingClientRect().height ?? 0
      const spacerHeight = Math.max(0, state.height - contentHeight)
      const spacer = `${spacerHeight.toFixed(2)}px`
      if (track.style.getPropertyValue('--curtain-spacer-height') !== spacer) {
        track.style.setProperty('--curtain-spacer-height', spacer)
      }
      state.start = content
        ? content.getBoundingClientRect().top + window.scrollY - state.height
        : bounds.top + window.scrollY
      state.progress = undefined
    }

    const update = () => {
      frame = 0
      tracks.forEach((state, track) => {
        if (motion.matches || !state.height) {
          if (state.progress !== 0) {
            track.style.removeProperty('--curtain-progress')
            state.progress = 0
          }
          return
        }

        const progress = Math.max(0, Math.min(1, (window.scrollY - state.start) / state.height))
        if (progress === state.progress) return
        state.progress = progress
        track.style.setProperty('--curtain-progress', progress.toFixed(3))
      })
    }

    const scheduleUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }

    const resizeObserver = typeof ResizeObserver === 'undefined'
      ? null
      : new ResizeObserver((entries) => {
        entries.forEach((entry) => {
          const track = entry.target.matches('[data-hero-curtain]')
            ? entry.target
            : entry.target.closest('[data-hero-curtain]')
          if (track) measure(track)
        })
        scheduleUpdate()
      })

    const addTracks = (root) => {
      if (!(root instanceof Element)) return
      const candidates = [
        ...(root.matches('[data-hero-curtain]') ? [root] : []),
        ...root.querySelectorAll('[data-hero-curtain]'),
      ]
      candidates.forEach((track) => {
        if (tracks.has(track)) return
        const hero = track.querySelector('[data-curtain-hero]')
        if (!hero) return
        tracks.set(track, { track, hero, start: 0, height: 0, progress: undefined })
        measure(track)
        resizeObserver?.observe(track)
        const content = track.querySelector(':scope > .hero-curtain-content')
        if (content) resizeObserver?.observe(content)
      })
      if (candidates.length) scheduleUpdate()
    }

    const onResize = () => {
      tracks.forEach((_, track) => measure(track))
      scheduleUpdate()
    }

    addTracks(document.documentElement)
    const mutationObserver = typeof MutationObserver === 'undefined'
      ? null
      : new MutationObserver((records) => {
        records.forEach(({ addedNodes }) => {
          addedNodes.forEach(addTracks)
        })
      })
      mutationObserver?.observe(document.body, { childList: true, subtree: true })

    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', onResize, { passive: true })
    window.addEventListener('pageshow', scheduleUpdate)
    motion.addEventListener('change', scheduleUpdate)
    scheduleUpdate()

    return () => {
      mutationObserver?.disconnect()
      resizeObserver?.disconnect()
      window.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('pageshow', scheduleUpdate)
      motion.removeEventListener('change', scheduleUpdate)
      window.removeEventListener('resize', onResize)
      if (frame) window.cancelAnimationFrame(frame)
      tracks.forEach((_, track) => {
        track.style.removeProperty('--curtain-progress')
        track.style.removeProperty('--curtain-spacer-height')
      })
    }
  }, [])
}
