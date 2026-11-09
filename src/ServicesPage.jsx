import '../styles/services.css'
import ActionButton from './ActionButton.jsx'
import ClosingActions from './ClosingActions.jsx'
import { featuredCaseStudies, featuredCaseStudiesZh } from './caseStudies.js'
import FeaturedCaseCard from './FeaturedCaseCard.jsx'

const artworkUrl = (file) => `/images/mockup-illustrations/${encodeURI(file)}`

const individualCards = [
  ["What you're facing", ['Difficult decisions', 'Upcoming changes', 'Trouble taking action']],
  ['What we do together', ['Understand the problem', 'Set priorities', 'Find a starting point']],
  ['Possible deliveries', ['A clear outline of the problem', 'Action steps', 'Feedback notes']],
]

const individualCardsZh = [
  ['面对的问题', ['选择难定', '改变在即', '行动受阻'], "What you're facing"],
  ['一起做什么', ['理清问题', '排定先后', '找到起点'], 'What we do together'],
  ['可能的交付', ['问题梳理', '行动步骤', '反馈记录'], 'Possible deliveries'],
]

const businessCardsZh = [
  ['面对的问题', ['经营卡点', '协作不畅', '投入难定'], "What you're facing"],
  ['一起做什么', ['梳理客户', '理清表达', '梳理流程', '小步试行'], 'What we do together'],
  ['可能的交付', ['问题清单', '试行计划', '工作流程'], 'Possible deliveries'],
]

const aiStepsZh = [
  ['从任务出发', '找到值得改善的重复工作或协作环节。', 'Start with the task'],
  ['把工具接进工作', '选择工具，试行流程，整理使用方法。', 'Bring tools into the workflow'],
  ['用反馈作决定', '看效率、准确性和使用负担，再调整。', 'Let feedback guide decisions'],
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

function ServiceIcon({ name }) {
  // The user approved the differently named export for the existing tools card.
  const file = name === 'Bring tools into the workflow' ? 'Bring ideas into the workflow' : name
  return <img className="services-icon" src={`/images/service-icons/${encodeURIComponent(file)}.svg`} width="80" height="80" alt="" loading="lazy" />
}

function ServiceCard({ title, points, index, iconName }) {
  return <article className="services-overview-card" data-reveal="text" data-reveal-order={index}>
    <ServiceIcon name={iconName || title} />
    <div className="services-card-copy">
      <h3>{title}</h3>
      <ul className="services-star-list">{points.map((point) => <li key={point}>{point}</li>)}</ul>
    </div>
  </article>
}

function ServiceAction({ href, children, className = '' }) {
  return <ActionButton href={href} className={`services-action ${className}`.trim()}>{children}</ActionButton>
}

export default function ServicesPage({ href, language = 'en' }) {
  const chinese = language === 'zh-Hans'
  const visibleIndividualCards = chinese ? individualCardsZh : individualCards
  const visibleBusinessCards = chinese ? businessCardsZh : businessCards
  const visibleAiSteps = chinese ? aiStepsZh : aiSteps
  return <>
    <div className="hero-curtain-track services-curtain-track" data-hero-curtain>
      <section className="services-hero hero-cutout-hero" data-curtain-hero aria-labelledby="services-hero-heading">
        <div className="services-hero-photo" aria-hidden="true"><img src="/images/heroes/services-hero.png" alt="" /></div>
        <div className="services-hero-content">
          <div className="services-hero-copy" data-curtain-copy>
            <p className="services-eyebrow" data-hero-reveal="eyebrow">{chinese ? '服务内容' : 'Our services'}</p>
            <h1 id="services-hero-heading" tabIndex={-1} data-hero-reveal="headline">{chinese ? <>找到真正适合<br />你的支持方案。</> : <>Find the support<br />that works for you.</>}</h1>
          </div>
          <div className="services-hero-actions hero-cutout-actions" data-hero-reveal="actions" data-curtain-actions>
            <ActionButton className="services-hero-explore" href="#support-individuals" variant="solid" tone="olive">{chinese ? '了解我们的服务' : 'Explore our services'}</ActionButton>
            <ActionButton className="services-hero-contact" href={href('contact')} variant="split">{chinese ? '我们聊聊吧' : 'Let’s talk'}</ActionButton>
          </div>
        </div>
      </section>

      <section className="hero-curtain-content services-curtain-content">
        <section className="services-individuals" id="support-individuals" tabIndex={-1} aria-labelledby="individuals-heading">
          <div className="services-section-heading">
            <span className="services-section-number" data-reveal="text">01</span>
            <h2 id="individuals-heading" data-reveal="text" data-reveal-order="1">{chinese ? '个人支持' : 'Support for individuals'}</h2>
          </div>
          <div className="services-overview-row">
            <div className="services-intro-copy">
              <p>{chinese ? '面对重要决定、人生方向的转变，或是不知道该从哪里开始？' : 'Facing a big decision, a change in direction, or simply feeling unsure where to start?'}</p>
              <p>{chinese ? '我们陪你一起理清当前的处境，发现自己原本就有的优势，探索真正重要的事情。' : 'We help you make sense of your situation, recognise your natural strengths, and explore what matters most to you.'}</p>
              <p>{chinese ? '通过交流与梳理，把模糊的想法变成更清晰的方向，找到适合自己的下一步。' : 'Together, we turn your thoughts into clearer priorities and practical next steps that feel right for you.'}</p>
              <ServiceAction href={href('contact')}>{chinese ? '获取服务报价' : 'Ask about this service'}</ServiceAction>
            </div>
            <div className="services-overview-cards">{visibleIndividualCards.map(([title, points, iconName], index) => <ServiceCard key={title} title={title} points={points} iconName={iconName} index={index} />)}</div>
          </div>
        </section>
      </section>

    </div>
    <section className="services-business full-width-background" aria-labelledby="business-heading">
      <div className="services-section-heading">
        <span className="services-section-number" data-reveal="text">02</span>
        <h2 id="business-heading" data-reveal="text" data-reveal-order="1">{chinese ? '独立经营者和精简团队' : 'Independent business owners and teams'}</h2>
      </div>
      <div className="services-overview-row">
        <div className="services-business-copy">
          <p>{chinese ? '经营一份事业，常常需要在有限的资源下兼顾不同的事务和优先事项，也难免遇到难以取舍的决定。' : 'Running a business often means juggling competing priorities, limited resources and decisions that aren’t always straightforward.'}</p>
          <p>{chinese ? '我们帮助独立创业者和小型团队理清复杂问题，找到当前最值得关注的重点，探索更有效的工作方式，让零散的想法和不确定性逐渐变成清晰的计划与可执行的下一步。' : 'We help independent business owners and small teams untangle challenges, identify what needs attention, and explore practical ways to improve how things work — turning ideas and uncertainties into clearer plans and actionable next steps.'}</p>
          <ServiceAction href={href('contact')}>{chinese ? '获取服务报价' : 'Ask about this service'}</ServiceAction>
        </div>
        <div className="services-overview-cards">{visibleBusinessCards.map(([title, points, iconName], index) => <ServiceCard key={title} title={title} points={points} iconName={iconName} index={index} />)}</div>
      </div>
    </section>

    <section className="services-ai" aria-labelledby="ai-heading">
      <div className="services-ai-left">
        <div className="services-ai-intro">
          <div className="services-section-heading">
            <span className="services-section-number" data-reveal="text">03</span>
            <h2 id="ai-heading" data-reveal="text" data-reveal-order="1">{chinese ? 'AI工作流落地' : 'AI in everyday work'}</h2>
          </div>
          <div className="services-ai-intro-copy">
            <p>{chinese ? '从实际任务开始，让AI成为工作中的帮手。' : 'Start with a real task and make AI a useful part of your work.'}</p>
            <ServiceAction className="services-ai-action--desktop" href={href('contact')}>{chinese ? '获取服务报价' : 'Ask about this service'}</ServiceAction>
          </div>
        </div>
        <img className="services-ai-artwork" data-reveal="visual" src={artworkUrl('Page=services, Section=ai-in-everyday-work.svg')} width="690" height="343" alt="" loading="lazy" />
      </div>
      <div className="services-ai-steps">
        {visibleAiSteps.map(([title, description, iconName], index) => <article className="services-ai-step" key={title} data-reveal="text" data-reveal-order={index}>
          <ServiceIcon name={iconName || title} />
          <div><h3>{title}</h3><p>{description}</p></div>
        </article>)}
      </div>
      <ServiceAction className="services-ai-action--mobile" href={href('contact')}>{chinese ? '获取服务报价' : 'Ask about this service'}</ServiceAction>
    </section>

    <section className="services-markets full-width-background" aria-labelledby="markets-heading">
      <div className="services-markets-heading">
        <div className="services-markets-title">
          <span className="services-section-number" data-reveal="text">04</span>
          <h2 id="markets-heading" data-reveal="text" data-reveal-order="1">{chinese ? '中国与欧洲市场本地化支持' : 'Adapting your business for Chinese and European markets'}</h2>
        </div>
        <div className="services-markets-copy">
          {chinese ? <p>从本地客户与真实工作情境出发，调整表达、服务与推进方式。</p> : <>
            <p>Every market has its own customers, expectations and ways of doing business.</p>
            <p>We help you understand these differences, identify what needs adapting, and find practical ways to connect with customers in China and Europe.</p>
          </>}
          <ServiceAction href={href('contact')}>{chinese ? '获取服务报价' : 'Ask about this service'}</ServiceAction>
        </div>
      </div>
      <div className="services-market-cards">
        <article className="services-market-card" data-reveal="visual">
          <img src={artworkUrl('Page=services, Section=international-businesses-to-the-chinese-market.svg')} width="227" height="160" alt="" loading="lazy" />
          <div><h3>{chinese ? '海外业务 → 中国市场' : 'International businesses to the Chinese market'}</h3><p>{chinese ? '理解本地情境，先验证关键假设。' : 'Understand the local context and test the key assumptions first.'}</p></div>
        </article>
        <article className="services-market-card" data-reveal="visual" data-reveal-order="1">
          <img src={artworkUrl('Page=services, Section=chinese-businesses-to-european-markets.svg')} width="227" height="160" alt="" loading="lazy" />
          <div><h3>{chinese ? '中国业务 → 欧洲市场' : 'Chinese businesses to European markets'}</h3><p>{chinese ? '结合当地需求，形成可尝试的下一步。' : 'Use local needs to shape a practical next step.'}</p></div>
        </article>
      </div>
    </section>

    <div className="services-working-options">
      <section className="services-working" aria-labelledby="working-heading">
        <div className="services-working-heading">
          <h2 id="working-heading" data-reveal="text">{chinese ? '怎样开始合作' : 'How we work together'}</h2>
          <p data-reveal="text" data-reveal-order="1">{chinese ? '沟通梳理、方案设计与实施陪跑；可按需安排面对面服务。' : <>Consultations, action planning and support with implementation.<br />In-person support can be arranged where needed.</>}</p>
        </div>
        <div className="services-discovery">
          <div className="services-discovery-art" data-reveal="visual">
            <img src={artworkUrl('Page=services, Section=how-we-work-together.svg')} width="588" height="415" alt="" loading="lazy" />
          </div>
          <div className="services-discovery-copy">
            <p className="services-eyebrow" data-reveal="text">{chinese ? '30分钟免费沟通' : 'Start here'}</p>
            <h3 data-reveal="text" data-reveal-order="1">{chinese ? '30分钟免费初步沟通' : 'Free 30-Minute Discovery Call'}</h3>
            <p data-reveal="text" data-reveal-order="2">{chinese ? '聊聊你在想什么，看看我们如何帮你。' : "Tell us what's on your mind, and let's see how we can help."}</p>
            <ServiceAction href={href('contact')}>{chinese ? '预约免费咨询' : 'Book your free discovery call'}</ServiceAction>
          </div>
        </div>
      </section>

      <section className="services-options" aria-labelledby="options-heading">
        <div className="services-options-panel full-width-background">
          <h2 id="options-heading" data-reveal="text">{chinese ? '选择最适合你的支持' : 'Choose what would help you most'}</h2>
          <div className="services-options-grid">
            <article className="services-option" data-reveal="text">
              <h3>{chinese ? '问题梳理' : 'Focused Consultation'}</h3>
              <ul className="services-star-list">
                <li>{chinese ? '通常每次60分钟。' : 'Typically 60 minutes per session.'}</li>
                <li>{chinese ? '梳理情况。' : 'Work through the situation.'}</li>
                <li>{chinese ? '找到行动起点。' : 'Identify a starting point.'}</li>
              </ul>
              <p className="services-addon">{chinese ? '需要时可另加定制方案。' : 'Tailored action plan available as an add-on.'}</p>
            </article>
            <article className="services-option" data-reveal="text" data-reveal-order="1">
              <h3>{chinese ? '定制方案' : 'Consultation & Tailored Action Plan'}</h3>
              <ul className="services-star-list">
                <li>{chinese ? '理清问题。' : 'Map out the problem.'}</li>
                <li>{chinese ? '明确下一步。' : 'Define the next step.'}</li>
                <li>{chinese ? '设计定制方案。' : 'Design a tailored action plan.'}</li>
              </ul>
            </article>
            <article className="services-option services-option-implementation" data-reveal="text" data-reveal-order="2">
              <p className="services-eyebrow">{chinese ? '按需另约' : 'Optional, by separate agreement'}</p>
              <h3>{chinese ? '按需实施与统筹' : 'Implementation and coordination'}</h3>
              <p>{chinese ? '需要时另行约定，让方案进入实际行动。' : 'Agreed separately when needed, to help put the plan into practice.'}</p>
            </article>
          </div>
          <div className="services-booking"><ServiceAction href={href('contact')}>{chinese ? '预约免费咨询' : 'Book your free discovery call'}</ServiceAction></div>
        </div>
        <div className="services-expect full-width-background">
          <strong>{chinese ? '你可以期待' : 'What to expect'}</strong>
          <div>{chinese
            ? <><span>清晰的思路</span><i aria-hidden="true" /><span>可执行的方案</span><i aria-hidden="true" /><span>踏实的陪伴</span></>
            : <><span>Clearer thinking</span><i aria-hidden="true" /><span>A plan you can put into action</span><i aria-hidden="true" /><span>Support you can count on</span></>}</div>
        </div>
      </section>
    </div>

    <section className="services-cases" aria-labelledby="services-cases-heading">
      <div className="services-cases-panel">
        <div className="services-cases-heading">
          <h2 id="services-cases-heading" data-reveal="text">{chinese ? '优选案例' : 'Featured case studies'}</h2>
          <ActionButton href={href('case-studies')}>{chinese ? '查看优选案例' : 'Read more about our work'}</ActionButton>
        </div>
        <div className="services-case-grid">
          {(chinese ? featuredCaseStudiesZh : featuredCaseStudies).map((study, index) => <FeaturedCaseCard key={study.title} study={study} index={index} variant="services" href={href('case-studies')} language={language} />)}
        </div>
      </div>
    </section>

    <section className="services-closing" aria-labelledby="services-closing-heading">
      <img className="services-closing-artwork full-width-artwork" src={artworkUrl('Page=all, Section=cta.svg')} width="1440" height="326" alt="" loading="lazy" />
      <div className="services-closing-copy">
        <h2 id="services-closing-heading" data-reveal="text">{chinese ? '一起看看，下一步怎么走。' : 'Let’s talk first.'}</h2>
        {!chinese && <p data-reveal="text" data-reveal-order="1">No need to decide just yet.</p>}
      </div>
      <ClosingActions className="services-closing-actions">
        <ActionButton className="services-closing-contact" href={href('contact')} variant="solid">{chinese ? '我们聊聊吧' : 'Let’s talk'}</ActionButton>
        <ActionButton href="#services-hero-heading" variant="split" tone="olive">{chinese ? '了解我们的服务' : 'Explore our services'}</ActionButton>
      </ClosingActions>
    </section>
  </>
}
