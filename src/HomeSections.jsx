import { useEffect, useRef } from 'react'
import ActionButton from './ActionButton.jsx'
import rightArrow from './Right.svg'

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
const caseStudies = [
  { title: 'Clothing Studio', description: 'Make the first step easy.', image: 'Make the first step easy.png', imagePosition: 'right' },
  { title: 'Small Hotel', description: 'Guiding investment with cost-effective pilots.', image: 'Guiding investment with cost-effective pilots.png', imagePosition: 'left' },
  { title: 'Neighbourhood Restaurant', description: 'From campaign planning to delivery.', image: 'From campaign planning to delivery.png', imagePosition: 'right' },
]
const artworkUrl = (file) => `/images/mockup-illustrations/${encodeURI(file)}`

export function HomeSections({ href }) {
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
      if (last.viewportY <= readingLine) section?.setAttribute('data-complete', '')
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
      <h2 id="situations-heading">What’s on your mind?</h2>
      <div className="situation-columns">
        {[0, 2].map(start => <div className="situation-column" key={start}>
          {situations.slice(start, start + 2).map((statement, i) => <a className={`situation-bubble bubble-${start + i + 1}`} key={i} href={href('services')}>
            <span>{statement}</span><span className="bubble-arrow" aria-hidden="true"><img src={rightArrow} width="24" height="24" alt="" /></span>
          </a>)}
        </div>)}
      </div>
    </section>
    <section className="services-section home-section full-width-background" aria-labelledby="services-heading">
      <h2 id="services-heading">How we can help</h2>
      <div className="home-service-grid">
        {services.map(([title, body, image]) => <article className="home-service-card" key={title}>
          <div className="service-card-content"><img className="home-artwork service-artwork" src={artworkUrl(image)} alt="" />
            <div className="service-card-copy"><h3>{title}</h3><p>{body}</p></div>
          </div>
          <ActionButton href={href('services')} variant="text">Learn more</ActionButton>
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
      <div className="process-heading"><h2 id="process-heading">Start small before deciding where<br />to invest next</h2>
        <p>Use what you learn in practice to decide what comes next.</p></div>
      <ol className="process-timeline" ref={processTimelineRef}>
        {steps.map(([title, body, illustration, marker], i) => <li className={`process-step step-${i + 1}`} key={title}>
          <div className="step-marker"><img src={artworkUrl(`Steps Section/${marker}`)} alt="" /></div>
          <div className="step-content"><h3>{title}</h3><p>{body}</p><img className="home-artwork process-artwork" src={artworkUrl(`Page=home, Section=${illustration}`)} alt="" /></div>
        </li>)}
      </ol>
      <ActionButton href={href('contact')}>Begin your journey</ActionButton>
    </section>
    <section className="case-studies-section home-section" aria-labelledby="case-studies-heading">
      <div className="case-studies-panel">
        <div className="case-studies-heading">
          <h2 id="case-studies-heading">Featured case studies</h2>
          <ActionButton href={href('case-studies')}>Read more about our work</ActionButton>
        </div>
        <div className="case-studies-grid">
          {caseStudies.map((caseStudy) => <article className={`case-study-card image-${caseStudy.imagePosition}`} key={caseStudy.title}>
            <div className="case-study-details">
              <div><h3>{caseStudy.title}</h3><p>{caseStudy.description}</p></div>
              <ActionButton href={href('case-studies')} variant="arrow" tone="olive" className="case-study-link" aria-label={`Read case study: ${caseStudy.title}`}>{caseStudy.title}</ActionButton>
            </div>
            <img className="case-study-artwork" src={`/images/case-studies/${caseStudy.image}`} alt={caseStudy.title} />
          </article>)}
        </div>
      </div>
    </section>
    <section className="closing-section" aria-labelledby="closing-heading">
      <img className="closing-artwork full-width-artwork" src={artworkUrl('Page=all, Section=cta.svg')} alt="" />
      <div className="closing-copy"><h2 id="closing-heading">Talk it through with us</h2>
        <p>Tell us what you're thinking about, and let's see how<br />we can move it forward together.</p>
      </div>
      <div className="closing-actions"><ActionButton href={href('contact')} variant="solid">Let’s talk</ActionButton><ActionButton href={href('services')} variant="split" tone="olive">Explore our services</ActionButton></div>
    </section>
  </div>
}
