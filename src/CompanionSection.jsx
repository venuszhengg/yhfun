import { useLayoutEffect, useRef } from 'react'
import './CompanionSection.css'

const principles = [
  {
    title: 'Understand first',
    description: 'Start with your situation as it really is.',
    chineseTitle: '先理解',
    chineseDescription: '从你的真实处境出发。',
    icon: "What you're facing.svg",
  },
  {
    title: 'Then try it out',
    description: 'Take small steps and learn from what happens.',
    chineseTitle: '再尝试',
    chineseDescription: '用小步骤获得实际反馈。',
    icon: 'Bring ideas into the workflow.svg',
  },
  {
    title: 'Use it again',
    description: 'Keep methods you can draw on in future.',
    chineseTitle: '能复用',
    chineseDescription: '留下以后用得上的方法。',
    icon: 'Let feedback guide decisions.svg',
  },
]

export default function CompanionSection({ language }) {
  const chinese = language === 'zh-Hans'
  const trackRef = useRef(null)
  const panelRef = useRef(null)

  useLayoutEffect(() => {
    const track = trackRef.current
    const panel = panelRef.current
    const principles = [...track.querySelectorAll('.companion-principle')]
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const suitableViewport = window.matchMedia('(min-width: 768px) and (min-height: 600px)')
    let frame = 0
    let enhanced = false

    const clearPrincipleStyles = () => {
      principles.forEach((principle) => {
        principle.removeAttribute('aria-hidden')
        principle.removeAttribute('data-active')
        principle.querySelectorAll('img, h3, p').forEach((part) => {
          part.style.removeProperty('opacity')
          part.style.removeProperty('transform')
        })
      })
    }

    const update = () => {
      frame = 0
      if (!enhanced) return
      const bounds = track.getBoundingClientRect()
      const distance = track.offsetHeight - window.innerHeight
      const progress = distance > 0 ? Math.max(0, Math.min(2, (-bounds.top / distance) * 2)) : 0
      const active = Math.min(2, Math.max(0, Math.round(progress)))

      principles.forEach((principle, index) => {
        const position = progress - index
        if (index === active) principle.removeAttribute('aria-hidden')
        else principle.setAttribute('aria-hidden', 'true')
        principle.dataset.active = String(index === active)
        principle.querySelectorAll('img, h3, p').forEach((part, partIndex) => {
          const stagger = partIndex * .05
          const incomingPosition = Math.max(0, Math.min(1, (position + .5 - stagger) / .3))
          const outgoingPosition = Math.max(0, Math.min(1, (position - .2 - stagger) / .3))
          const incoming = 1 - (1 - incomingPosition) ** 3
          const outgoing = 1 - (1 - outgoingPosition) ** 3
          const opacity = (partIndex === 0 ? .35 : .85) + (1 - (partIndex === 0 ? .35 : .85)) * incoming * (1 - outgoing)
          part.style.opacity = opacity.toFixed(3)
          part.style.transform = `translateY(${((1 - incoming) * 20 - outgoing * 20).toFixed(2)}px)`
        })
      })
    }

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }

    const configure = () => {
      enhanced = suitableViewport.matches && !motion.matches
      track.classList.toggle('is-enhanced', enhanced)
      if (!enhanced) clearPrincipleStyles()
      schedule()
    }

    const checkFit = () => {
      if (!enhanced || panel.getBoundingClientRect().height <= window.innerHeight - 48) return
      enhanced = false
      track.classList.remove('is-enhanced')
      clearPrincipleStyles()
    }

    configure()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', configure, { passive: true })
    motion.addEventListener('change', configure)
    suitableViewport.addEventListener('change', configure)
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(checkFit)
    observer?.observe(panel)

    return () => {
      if (frame) window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', configure)
      motion.removeEventListener('change', configure)
      suitableViewport.removeEventListener('change', configure)
      observer?.disconnect()
      clearPrincipleStyles()
    }
  }, [])

  return <section ref={trackRef} className="companion-section" aria-labelledby="about-companion-heading">
    <div className="companion-sticky">
      <h2 id="about-companion-heading" data-reveal="text">{chinese ? '像伙伴一样，共同推进' : 'A companion you can count on.'}</h2>
      <div className="companion-panel" ref={panelRef}>
        {principles.map((principle, index) => <article className="companion-principle" key={principle.title}>
          <div className="companion-principle-content" data-reveal="text" data-reveal-order={index}>
            <img src={`/images/service-icons/${encodeURIComponent(principle.icon)}`} alt="" width="80" height="80" />
            <h3>{chinese ? principle.chineseTitle : principle.title}</h3>
            <p>{chinese ? principle.chineseDescription : principle.description}</p>
          </div>
        </article>)}
      </div>
    </div>
  </section>
}
