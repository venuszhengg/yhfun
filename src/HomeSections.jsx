import { useEffect, useLayoutEffect, useRef } from 'react'
import ActionButton from './ActionButton.jsx'
import ClosingActions from './ClosingActions.jsx'
import { featuredCaseStudies, featuredCaseStudiesZh } from './caseStudies.js'
import FeaturedCaseCard from './FeaturedCaseCard.jsx'

// Copy transcribed from the user-supplied Home.pdf; artwork slots are placeholders.
const services = [
  ['Focused Consultation', 'Identify what would be most useful to tackle first.', 'Page=home, Section=focused-consultation.svg'],
  ['Putting ideas to the test', 'Turn ideas into small steps you can try.', 'Page=home, Section=putting-ideas-to-the-test.svg'],
  ['AI in everyday work', 'Make the tools work for the task.', 'Page=home, Section=ai-in-everyday-work.svg'],
]
const steps = [
  ['Understand the problem', 'Understand what you’re facing.', 'understand-the-problem.svg', 'Step-01.svg'],
  ['Choose a priority', 'Choose what would be most useful to do first.', 'choose-a-priority.svg', 'Step-02.svg'],
  ['Try it on a small scale', 'Start with small, manageable steps.', 'try-it-on-a-small-scale.svg', 'Step-03.svg'],
  ['See what happens', 'See what changes before drawing conclusions.', 'see-what-happens.svg', 'Step-04.svg'],
  ['Adjust or expand', 'Use the feedback to decide what to invest next.', 'adjust-or-expand.svg', 'Step-05.svg'],
]
const situations = [
  <>My business has hit a sticking point. What should I tackle first?</>,
  <>There’s too much to do, and your team and processes aren’t working smoothly.</>,
  <>Too many options, and I’m not sure what to do next.</>,
  <>I want to make a change, but I don't know where to start.</>,
]
const artworkUrl = (file) => `/images/mockup-illustrations/${encodeURI(file)}`

const servicesZh = [
  ['问题梳理', '找出值得先解决的事。', 'Page=home, Section=focused-consultation.svg'],
  ['行动与验证', '把想法变成可尝试的小步骤。', 'Page=home, Section=putting-ideas-to-the-test.svg'],
  ['AI工作流落地', '让工具服务实际工作。', 'Page=home, Section=ai-in-everyday-work.svg'],
]

const situationsZh = [
  '选择太多，不知道下一步怎么开始。',
  '想做改变，却找不到起点。',
  '经营遇到卡点，不知道先解决什么。',
  '事情太多，协作和流程不够顺。',
]

const stepsZh = [
  ...steps.map((step, index) => [
    ['理清问题', '选一个关键点', '小范围尝试', '看实际反馈', '调整或扩大'][index],
    ['先看清眼前的情况。', '找到最值得先做的事。', '用可承受的小步骤开始。', '观察变化，不急着下结论。', '根据反馈，再决定投入。'][index],
    step[2],
    step[3],
  ]),
]

function SituationBubble({ statement, index, href }) {
  const bubbleRef = useRef(null)
  const silhouetteRef = useRef(null)

  useLayoutEffect(() => {
    const bubble = bubbleRef.current
    const silhouette = silhouetteRef.current
    const path = silhouette.querySelector('path')

    const updateSilhouette = () => {
      const style = window.getComputedStyle(bubble)
      const width = parseFloat(style.width)
      const height = parseFloat(style.height)
      if (!width || !height) return

      const left = 0.5
      const right = width - 0.5
      const top = 0.5
      const bottom = height - 0.5
      const radius = 23.5
      const tail = index < 2 ? width * 0.25 : width * 0.75
      const direction = index < 2 ? -1 : 1
      silhouette.setAttribute('viewBox', `0 0 ${width} ${height + 16}`)
      path.setAttribute('d', [
        `M ${left + radius} ${top}`,
        `H ${right - radius} A ${radius} ${radius} 0 0 1 ${right} ${top + radius}`,
        `V ${bottom - radius} A ${radius} ${radius} 0 0 1 ${right - radius} ${bottom}`,
        `H ${tail + 15}`,
        `C ${tail + 10} ${bottom} ${tail + 7} ${bottom + 2} ${tail + 4} ${bottom + 5}`,
        `L ${tail + direction * 7 + 2} ${bottom + 14}`,
        `Q ${tail + direction * 7} ${bottom + 16} ${tail + direction * 7 - 2} ${bottom + 14}`,
        `L ${tail - 5} ${bottom + 5}`,
        `C ${tail - 8} ${bottom + 2} ${tail - 11} ${bottom} ${tail - 16} ${bottom}`,
        `H ${left + radius} A ${radius} ${radius} 0 0 1 ${left} ${bottom - radius}`,
        `V ${top + radius} A ${radius} ${radius} 0 0 1 ${left + radius} ${top} Z`,
      ].join(' '))
    }

    updateSilhouette()
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', updateSilhouette)
      return () => window.removeEventListener('resize', updateSilhouette)
    }
    const observer = new ResizeObserver(updateSilhouette)
    observer.observe(bubble)
    return () => observer.disconnect()
  }, [index])

  return <div className={`situation-reveal bubble-${index + 1}`} data-reveal="bubble" data-reveal-order={index}>
    <div className="situation-motion">
      <div className="situation-bubble" ref={bubbleRef}>
        <svg className="situation-silhouette" ref={silhouetteRef} aria-hidden="true" focusable="false">
          <path />
        </svg>
        <span id={`situation-statement-${index}`}>{statement}</span>
        <ActionButton href={href} variant="arrow" tone="olive" aria-labelledby={`situation-statement-${index}`} />
      </div>
    </div>
  </div>
}

export function HomeSections({ href, language = 'en' }) {
  const chinese = language === 'zh-Hans'
  const visibleServices = chinese ? servicesZh : services
  const visibleSituations = chinese ? situationsZh : situations
  const visibleSteps = chinese ? stepsZh : steps
  const processTimelineRef = useRef(null)

  useEffect(() => {
    const timeline = processTimelineRef.current
    if (!timeline) return

    const section = timeline.closest('.process-section')
    const steps = [...timeline.querySelectorAll('.process-step')]
    let frame = 0

    const update = () => {
      frame = 0
      const timelineBounds = timeline.getBoundingClientRect()
      if (!timelineBounds.width || !timelineBounds.height || !steps.length) return

      const centers = steps.map((step) => {
        const markerBounds = step.querySelector('.step-marker').getBoundingClientRect()
        return {
          x: markerBounds.left + markerBounds.width / 2 - timelineBounds.left,
          y: markerBounds.top + markerBounds.height / 2 - timelineBounds.top,
          viewportY: markerBounds.top + markerBounds.height / 2,
        }
      })
      const first = centers[0]
      const last = centers.at(-1)
      const distance = Math.max(1, last.y - first.y)
      const readingLine = window.innerHeight * 0.68
      const travelled = readingLine - first.viewportY

      timeline.style.setProperty('--process-line-x', `${first.x}px`)
      timeline.style.setProperty('--process-line-start', `${first.y}px`)
      timeline.style.setProperty('--process-line-length', `${distance}px`)
      timeline.style.setProperty('--process-line-progress', `${Math.max(0, Math.min(1, travelled / distance))}`)

      steps.forEach((step, index) => {
        step.toggleAttribute('data-reached', centers[index].viewportY <= readingLine)
      })
      section?.toggleAttribute('data-complete', last.viewportY <= readingLine)
    }

    const scheduleUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', scheduleUpdate)
    const observer = typeof ResizeObserver === 'function' ? new ResizeObserver(scheduleUpdate) : null
    observer?.observe(timeline)

    return () => {
      observer?.disconnect()
      window.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', scheduleUpdate)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  return <div className="home-continuation">
    <section className="situations-section home-section" aria-labelledby="situations-heading">
      <h2 id="situations-heading" data-reveal="text">{chinese ? '你正在面对什么？' : 'What’s on your mind?'}</h2>
      <div className="situation-columns">
        {[0, 2].map(start => <div className="situation-column" key={start}>
          {visibleSituations.slice(start, start + 2).map((statement, i) => <SituationBubble key={i} statement={statement} index={start + i} href={href('services')} />)}
        </div>)}
      </div>
    </section>
    <section className="services-section home-section full-width-background" aria-labelledby="services-heading">
      <h2 id="services-heading" data-reveal="text">{chinese ? '我们能怎样帮你' : 'How we can help'}</h2>
      <div className="home-service-grid">
        {visibleServices.map(([title, body, image], index) => <article className="home-service-card" key={title} data-reveal="text" data-reveal-order={index}>
          <div className="service-card-content"><img className="home-artwork service-artwork" src={artworkUrl(image)} alt="" loading="lazy" />
            <div className="service-card-copy"><h3>{title}</h3><p>{body}</p></div>
          </div>
          <ActionButton href={href('services')} variant="text">{chinese ? '了解更多' : 'Learn more'}</ActionButton>
        </article>)}
      </div>
    </section>
    <section className="process-section home-section" aria-labelledby="process-heading">
      {/* Recolor the existing SVG star and number paths without replacing the artwork. */}
      <svg className="process-color-filters" aria-hidden="true" focusable="false">
        <filter id="process-marker-active" colorInterpolationFilters="sRGB">
          <feColorMatrix type="matrix" values="-1.13157895 0 0 0 1.36831785 0 -1.10447761 0 0 1.42218320 0 0 -1.12234043 0 1.12707551 0 0 0 1 0" />
        </filter>
      </svg>
      <div className="process-heading"><h2 id="process-heading" data-reveal="text">{chinese ? '先试一小步，再决定下一步投入。' : <>Start small before deciding where<br />to invest next</>}</h2>
        <p data-reveal="text" data-reveal-order="1">Use what you learn in practice to decide what comes next.</p></div>
      <ol className="process-timeline" ref={processTimelineRef}>
        {visibleSteps.map(([title, body, illustration, marker], i) => <li className={`process-step step-${i + 1}`} key={title}>
          <div className="step-marker"><img src={artworkUrl(`Steps Section/${marker}`)} alt="" loading="lazy" /><span className="step-marker-number" aria-hidden="true">{i + 1}</span></div>
          <div className="step-content" data-reveal="visual"><h3>{title}</h3><p>{body}</p><img className="home-artwork process-artwork" src={artworkUrl(`Page=home, Section=${illustration}`)} alt="" loading="lazy" /></div>
        </li>)}
      </ol>
      <ActionButton href={href('contact')}>{chinese ? '开启探索之旅' : 'Begin your journey'}</ActionButton>
    </section>
    <section className="case-studies-section home-section" aria-labelledby="case-studies-heading">
      <div className="case-studies-panel">
        <div className="case-studies-heading">
          <h2 id="case-studies-heading" data-reveal="text">{chinese ? '优选案例' : 'Featured case studies'}</h2>
          <ActionButton href={href('case-studies')}>{chinese ? '查看优选案例' : 'Read more about our work'}</ActionButton>
        </div>
        <div className="case-studies-grid">
          {(chinese ? featuredCaseStudiesZh : featuredCaseStudies).map((study, index) => <FeaturedCaseCard key={study.title} study={study} index={index} variant="home" href={href('case-studies')} language={language} />)}
        </div>
      </div>
    </section>
    <section className="closing-section" aria-labelledby="closing-heading">
      <img className="closing-artwork full-width-artwork" src={artworkUrl('Page=all, Section=cta.svg')} alt="" loading="lazy" />
      <div className="closing-copy"><h2 id="closing-heading" data-reveal="text">{chinese ? '我们聊聊吧' : 'Talk it through with us'}</h2>
        <p data-reveal="text" data-reveal-order="1">{chinese ? '告诉我们你正在考虑什么，看看我们能否一起推进。' : <>Tell us what you're thinking about, and let's see how<br />we can move it forward together.</>}</p>
      </div>
      <ClosingActions className="closing-actions"><ActionButton href={href('contact')} variant="solid">{chinese ? '我们聊聊吧' : 'Let’s talk'}</ActionButton><ActionButton href={href('services')} variant="split" tone="olive">{chinese ? '了解我们的服务' : 'Explore our services'}</ActionButton></ClosingActions>
    </section>
  </div>
}
