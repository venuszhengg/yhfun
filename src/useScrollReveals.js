import { useEffect } from 'react'

export function useScrollReveals() {
  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (motion.matches || !('IntersectionObserver' in window)) return

    const elements = new Set()
    const pending = new Set()
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting || !pending.has(entry.target)) return
        const { boundingClientRect: bounds, intersectionRect } = entry
        const enoughVisible = entry.intersectionRatio >= 0.1 ||
          intersectionRect.height >= 80 || bounds.height > window.innerHeight * 0.8
        if (!enoughVisible) return

        const element = entry.target
        if (element.matches(':focus-within')) {
          showImmediately(element)
          return
        }
        observer.unobserve(element)
        pending.delete(element)
        const isBubble = element.dataset.reveal === 'bubble'
        const order = Math.min(isBubble ? 3 : 2, Math.max(0, Number(element.dataset.revealOrder) || 0))
        element.style.setProperty('--reveal-delay', isBubble ? `${order * 100}ms` : bounds.top < window.innerHeight * 0.6 ? '0ms' : `${order * 80}ms`)
        element.dataset.revealState = 'visible'
      })
    }, { threshold: [0, 0.1] })

    const showImmediately = (element) => {
      observer.unobserve(element)
      pending.delete(element)
      delete element.dataset.revealState
      element.style.removeProperty('--reveal-delay')
    }

    const addElements = (root) => {
      if (!(root instanceof Element)) return
      const descendants = root.querySelectorAll('[data-reveal]')
      const candidates = root.matches('[data-reveal]') ? [root, ...descendants] : [...descendants]
      candidates.forEach((element) => {
        if (elements.has(element)) return
        elements.add(element)
        const bounds = element.getBoundingClientRect()
        if (bounds.top >= window.innerHeight && bounds.height > 0) {
          element.dataset.revealState = 'pending'
          pending.add(element)
          observer.observe(element)
        }
      })
    }

    addElements(document.documentElement)
    const mutationObserver = new MutationObserver((records) => {
      records.forEach(({ addedNodes }) => {
        addedNodes.forEach(addElements)
      })
    })
    mutationObserver.observe(document.body, { childList: true, subtree: true })

    const showTarget = (target) => {
      if (!(target instanceof Element)) return
      elements.forEach((element) => {
        if (element === target || element.contains(target) || target.contains(element)) showImmediately(element)
      })
    }
    const onFocus = (event) => showTarget(event.target)
    const onClick = (event) => {
      const link = event.target instanceof Element ? event.target.closest('a[href]') : null
      if (!link) return
      const destination = new URL(link.href, window.location.href)
      if (destination.origin !== window.location.origin || destination.pathname !== window.location.pathname ||
          destination.search !== window.location.search || !destination.hash) return
      const target = document.getElementById(decodeURIComponent(destination.hash.slice(1)))
      if (target) showTarget(target)
    }
    const onHashChange = () => {
      if (!window.location.hash) return
      const target = document.getElementById(decodeURIComponent(window.location.hash.slice(1)))
      if (target) showTarget(target)
    }
    const onPageShow = () => {
      pending.forEach((element) => {
        const bounds = element.getBoundingClientRect()
        if (bounds.top < window.innerHeight && bounds.bottom > 0) showImmediately(element)
      })
      onHashChange()
    }
    const onMotionChange = () => {
      if (motion.matches) {
        elements.forEach(showImmediately)
        document.querySelectorAll('[data-hero-entrance]').forEach((element) => {
          delete element.dataset.heroEntrance
        })
      }
    }
    const onAnimationEnd = (event) => {
      if (event.animationName.startsWith('yhf-reveal-') && event.target instanceof Element) {
        showImmediately(event.target)
      }
      if (event.animationName === 'yhf-hero-up' && event.target instanceof Element) {
        delete event.target.dataset.heroEntrance
      }
    }

    if (!window.location.hash && window.scrollY < 40) {
      document.querySelectorAll('[data-hero-reveal]').forEach((element) => {
        element.dataset.heroEntrance = element.dataset.heroReveal
      })
    }
    onHashChange()
    document.addEventListener('focusin', onFocus)
    document.addEventListener('click', onClick, true)
    document.addEventListener('animationend', onAnimationEnd)
    window.addEventListener('hashchange', onHashChange)
    window.addEventListener('pageshow', onPageShow)
    motion.addEventListener('change', onMotionChange)

    return () => {
      mutationObserver.disconnect()
      observer.disconnect()
      elements.forEach(showImmediately)
      document.querySelectorAll('[data-hero-entrance]').forEach((element) => {
        delete element.dataset.heroEntrance
      })
      document.removeEventListener('focusin', onFocus)
      document.removeEventListener('click', onClick, true)
      document.removeEventListener('animationend', onAnimationEnd)
      window.removeEventListener('hashchange', onHashChange)
      window.removeEventListener('pageshow', onPageShow)
      motion.removeEventListener('change', onMotionChange)
    }
  }, [])
}
