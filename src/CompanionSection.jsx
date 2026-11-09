import { useLayoutEffect, useRef, useState } from 'react'
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
    icon: 'What we do together.svg',
  },
  {
    title: 'Use it again',
    description: 'Keep methods you can draw on in future.',
    chineseTitle: '能复用',
    chineseDescription: '留下以后用得上的方法。',
    icon: 'Let feedback guide decisions.svg',
  },
]

const clamp = (value) => Math.max(0, Math.min(1, value))
const ease = (value) => 1 - (1 - clamp(value)) ** 3

function partStyle(position, order, reducedMotion) {
  if (reducedMotion) return undefined

  const incoming = ease((position + 0.5 - order * 0.05) / 0.3)
  const outgoing = ease((position - 0.2 - order * 0.05) / 0.3)
  const minimumOpacity = order === 0 ? 0.35 : 0.85
  return {
    opacity: minimumOpacity + (1 - minimumOpacity) * incoming * (1 - outgoing),
    transform: `translateY(${(1 - incoming) * 20 - outgoing * 20}px)`,
  }
}

export default function CompanionSection({ language }) {
  const trackRef = useRef(null)
  const panelRef = useRef(null)
  const [enhanced, setEnhanced] = useState(false)
  const [progress, setProgress] = useState(0)
  const [reducedMotion, setReducedMotion] = useState(false)
  const chinese = language === 'zh-Hans'
  const active = Math.min(2, Math.max(0, Math.round(progress)))

  useLayoutEffect(() => {
    const track = trackRef.current
    const panel = panelRef.current
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const height = window.matchMedia('(min-height: 521px)')
    let frame = 0
    let enabled = false

    const update = () => {
      frame = 0
      if (!enabled) return
      const bounds = track.getBoundingClientRect()
      const distance = bounds.height - track.firstElementChild.offsetHeight
      if (distance > 0) setProgress(clamp(-bounds.top / distance) * 2)
    }

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }

    const configure = () => {
      setReducedMotion(motion.matches)
      enabled = height.matches
      setEnhanced(enabled)
      document.documentElement.classList.toggle('has-companion-snap', enabled)
      schedule()
    }

    const checkFit = () => {
      if (enabled && panel.getBoundingClientRect().height > window.innerHeight - 24) {
        enabled = false
        setEnhanced(false)
        document.documentElement.classList.remove('has-companion-snap')
      }
    }

    configure()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', configure)
    motion.addEventListener('change', configure)
    height.addEventListener('change', configure)
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(checkFit)
    observer?.observe(panel)

    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', configure)
      motion.removeEventListener('change', configure)
      height.removeEventListener('change', configure)
      observer?.disconnect()
      document.documentElement.classList.remove('has-companion-snap')
    }
  }, [])

  return <section ref={trackRef} className={`companion-track${enhanced ? ' is-enhanced' : ''}`} aria-labelledby="about-companion-heading">
    <div className="companion-sticky">
      <div className="companion-panel" ref={panelRef}>
        <h1 id="about-companion-heading">{chinese ? '像伙伴一样，共同推进' : 'A companion you can count on.'}</h1>
        <div className="companion-principles">
          {principles.map((principle, index) => {
            const hidden = enhanced && index !== active
            const position = progress - index
            return <article className="companion-principle" key={principle.title} aria-hidden={hidden || undefined} data-active={!hidden}>
              <img src={`/images/service-icons/${encodeURIComponent(principle.icon)}`} alt="" width="80" height="80" style={enhanced ? partStyle(position, 0, reducedMotion) : undefined} />
              <h3 style={enhanced ? partStyle(position, 1, reducedMotion) : undefined}>{chinese ? principle.chineseTitle : principle.title}</h3>
              <p style={enhanced ? partStyle(position, 2, reducedMotion) : undefined}>{chinese ? principle.chineseDescription : principle.description}</p>
            </article>
          })}
        </div>
      </div>
    </div>
    {enhanced && <div className="companion-snap-points" aria-hidden="true">
      <span /><span /><span />
    </div>}
  </section>
}
