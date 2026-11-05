import ActionButton from './ActionButton.jsx'
import HeroCutoutClipPath from './HeroCutoutClipPath.jsx'
import { useHeroCutout } from './useHeroCutout.js'

const artworkUrl = (file) => `/images/mockup-illustrations/${encodeURI(file)}`

const individualCards = [
  ["What you're facing", ['Difficult decisions', 'Upcoming changes', 'Trouble taking action']],
  ['What we do together', ['Understand the problem', 'Set priorities', 'Find a starting point']],
  ['Possible deliveries', ['A clear outline of the problem', 'Action steps', 'Feedback notes']],
]

const businessCards = [
  ["What you're facing", ['Business bottlenecks', 'Teamwork issues', 'Deciding where to focus resources']],
  ['What we do together', ['Understand your customers', 'Clarify your messages', 'Map your processes', 'Run small trials']],
  ['Possible deliveries', ['A list of issues', 'A pilot plan', 'Workflows']],
]

const aiSteps = [
  ['Start with the task', 'Identify repetitive tasks or parts of team workflows that could be improved.'],
  ['Bring tools into the workflow', 'Choose tools, test the workflow and document how to use it.'],
  ['Let feedback guide decisions', 'Check efficiency, accuracy and the effort involved, then adjust.'],
]

function IconPlaceholder({ name }) {
  return <div className="services-icon-placeholder" role="img" aria-label={`${name} illustration export pending`}>
    <span>Illustration<br />export pending</span>
  </div>
}

function ServiceCard({ title, points }) {
  return <article className="services-overview-card">
    <IconPlaceholder name={title} />
    <div className="services-card-copy">
      <h3>{title}</h3>
      <ul className="services-star-list">{points.map((point) => <li key={point}>{point}</li>)}</ul>
    </div>
  </article>
}

function ServiceAction({ href, children }) {
  return <ActionButton href={href} className="services-action">{children}</ActionButton>
}

export default function ServicesPage({ href }) {
  const [heroRef, mediaRef, copyRef, actionsRef, pathRef, clipId] = useHeroCutout('left')

  return <>
    <section ref={heroRef} className="services-hero hero-cutout-hero" aria-labelledby="services-hero-heading">
      <HeroCutoutClipPath id={clipId} pathRef={pathRef} />
      <div ref={mediaRef} className="services-hero-photo hero-cutout-media" style={{ clipPath: `url(#${clipId})` }} aria-hidden="true"><img src="/images/heroes/hero-services.png" alt="" /></div>
      <div className="services-hero-content">
        <div ref={copyRef} className="services-hero-copy">
          <p className="services-eyebrow">Our services</p>
          <h1 id="services-hero-heading">Find the support<br />that works for you.</h1>
        </div>
        <div ref={actionsRef} className="services-hero-actions hero-cutout-actions">
          <ActionButton className="services-hero-explore" href="#support-individuals" variant="solid" tone="olive">Explore our services</ActionButton>
          <ActionButton className="services-hero-contact" href={href('contact')} variant="split">Let’s talk</ActionButton>
        </div>
      </div>
    </section>

    <section className="services-individuals" id="support-individuals" aria-labelledby="individuals-heading">
      <div className="services-section-heading">
        <span className="services-section-number">01</span>
        <h2 id="individuals-heading">Support for individuals</h2>
      </div>
      <div className="services-overview-row">
        <div className="services-intro-copy">
          <p>Facing a big decision, a change in direction, or simply feeling unsure where to start?</p>
          <p>We help you make sense of your situation, recognise your natural strengths, and explore what matters most to you.</p>
          <p>Together, we turn your thoughts into clearer priorities and practical next steps that feel right for you.</p>
          <ServiceAction href={href('contact')}>Enquire about this service</ServiceAction>
        </div>
        <div className="services-overview-cards">{individualCards.map(([title, points]) => <ServiceCard key={title} title={title} points={points} />)}</div>
      </div>
    </section>

    <section className="services-business" aria-labelledby="business-heading">
      <div className="services-section-heading">
        <span className="services-section-number">02</span>
        <h2 id="business-heading">Independent business owners and teams</h2>
      </div>
      <div className="services-overview-row">
        <div className="services-overview-cards">{businessCards.map(([title, points]) => <ServiceCard key={title} title={title} points={points} />)}</div>
        <div className="services-business-copy">
          <p>Running a business often means juggling competing priorities, limited resources and decisions that aren’t always straightforward.</p>
          <p>We help independent business owners and small teams untangle challenges, identify what needs attention, and explore practical ways to improve how things work — turning ideas and uncertainties into clearer plans and actionable next steps.</p>
          <ServiceAction href={href('contact')}>Enquire about this service</ServiceAction>
        </div>
      </div>
    </section>

    <section className="services-ai" aria-labelledby="ai-heading">
      <div className="services-ai-left">
        <div className="services-ai-intro">
          <div className="services-section-heading">
            <span className="services-section-number">03</span>
            <h2 id="ai-heading">AI in everyday work</h2>
          </div>
          <div className="services-ai-intro-copy">
            <p>Start with a real task and make AI a useful part of your work.</p>
            <ServiceAction href={href('contact')}>Enquire about this service</ServiceAction>
          </div>
        </div>
        <img className="services-ai-artwork" src={artworkUrl('Page=services, Section=ai-in-everyday-work.svg')} width="690" height="343" alt="" />
      </div>
      <div className="services-ai-steps">
        {aiSteps.map(([title, description]) => <article className="services-ai-step" key={title}>
          <IconPlaceholder name={title} />
          <div><h3>{title}</h3><p>{description}</p></div>
        </article>)}
      </div>
    </section>

    <section className="services-markets" aria-labelledby="markets-heading">
      <div className="services-markets-heading">
        <div className="services-markets-title">
          <span className="services-section-number">04</span>
          <h2 id="markets-heading">Adapting your business for Chinese and European markets</h2>
        </div>
        <div className="services-markets-copy">
          <p>Every market has its own customers, expectations and ways of doing business.</p>
          <p>We help you understand these differences, identify what needs adapting, and find practical ways to connect with customers in China and Europe.</p>
          <ServiceAction href={href('contact')}>Enquire about this service</ServiceAction>
        </div>
      </div>
      <div className="services-market-cards">
        <article className="services-market-card">
          <img src={artworkUrl('Page=services, Section=international-businesses-to-the-chinese-market.svg')} width="227" height="160" alt="" />
          <div><h3>International businesses to the Chinese market</h3><p>Understand the local context and test the key assumptions first.</p></div>
        </article>
        <article className="services-market-card">
          <img src={artworkUrl('Page=services, Section=chinese-businesses-to-european-markets.svg')} width="227" height="160" alt="" />
          <div><h3>Chinese businesses to European markets</h3><p>Use local needs to shape a practical next step.</p></div>
        </article>
      </div>
    </section>

    <div className="services-working-options">
      <section className="services-working" aria-labelledby="working-heading">
        <div className="services-working-heading">
          <h2 id="working-heading">How we work together</h2>
          <p>Consultations, action planning and support with implementation.<br />In-person support can be arranged where needed.</p>
        </div>
        <div className="services-discovery">
          <div className="services-discovery-art">
            <img src={artworkUrl('Page=services, Section=how-we-work-together.svg')} width="588" height="415" alt="" />
          </div>
          <div className="services-discovery-copy">
            <p className="services-eyebrow">Start here</p>
            <h3>Free 30-Minute Discovery Call</h3>
            <p>Tell us what's on your mind, and let's see how we can help.</p>
            <ServiceAction href={href('contact')}>Book your free discovery call</ServiceAction>
          </div>
        </div>
      </section>

      <section className="services-options" aria-labelledby="options-heading">
        <div className="services-options-panel">
          <h2 id="options-heading">Choose what would help you most</h2>
          <div className="services-options-grid">
            <article className="services-option">
              <h3>Focused Consultation</h3>
              <ul className="services-star-list">
                <li>Typically 60 minutes per session.</li>
                <li>Work through the situation.</li>
                <li>Identify a starting point.</li>
              </ul>
              <p className="services-addon">Tailored action plan available as an add-on.</p>
            </article>
            <article className="services-option">
              <h3>Consultation &amp; Tailored Action Plan</h3>
              <ul className="services-star-list">
                <li>Map out the problem.</li>
                <li>Define the next step.</li>
                <li>Design a tailored action plan.</li>
              </ul>
            </article>
            <article className="services-option services-option-implementation">
              <p className="services-eyebrow">Optional, by separate agreement</p>
              <h3>Implementation and coordination</h3>
              <p>Agreed separately when needed, to help put the plan into practice.</p>
            </article>
          </div>
        </div>
        <div className="services-expect">
          <strong>What to expect</strong>
          <div><span>Clearer thinking</span><i aria-hidden="true" /><span>A plan you can put into action</span><i aria-hidden="true" /><span>Support you can count on</span></div>
        </div>
        <div className="services-booking"><ServiceAction href={href('contact')}>Book your free discovery call</ServiceAction></div>
      </section>
    </div>

    <section className="services-closing" aria-labelledby="services-closing-heading">
      <img className="services-closing-artwork" src={artworkUrl('Page=all, Section=cta.svg')} width="1440" height="326" alt="" />
      <div className="services-closing-copy">
        <h2 id="services-closing-heading">Let’s talk first.</h2>
        <p>No need to decide just yet.</p>
        <div className="services-closing-actions">
          <ActionButton className="services-closing-contact" href={href('contact')} variant="solid">Let’s talk</ActionButton>
          <ActionButton href="#services-hero-heading" variant="split" tone="olive">Explore our services</ActionButton>
        </div>
      </div>
    </section>
  </>
}
