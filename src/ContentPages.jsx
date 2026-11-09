import { lazy, Suspense, useEffect, useMemo, useState } from 'react'
import '../styles/content-pages.css'
import ActionButton from './ActionButton.jsx'
import ClosingActions from './ClosingActions.jsx'
import BackToTop from './BackToTop.jsx'
import ContactChannels from './ContactChannels.jsx'
import { caseStudies } from './caseStudies.js'
import { caseStudiesZh, policyDataZh } from './chineseContent.js'
import RouteLoading from './RouteLoading.jsx'
import CompanionSection from './CompanionSection.jsx'

const ContactForm = lazy(() => import('./ContactForm.jsx'))

const artwork = (file) => `/images/mockup-illustrations/${encodeURI(file)}`

const policyData = {
  privacy: {
    title: 'Privacy Policy',
    updated: '19 October 2026',
    related: [['terms', 'Terms of Service'], ['refunds', 'Refunds & Cancellations Policy']],
    sections: [
      {
        title: 'The personal data we collect',
        paragraphs: [
          'Contact details: Your name and email address, and any telephone number or messaging account you choose to provide.',
          'Service information: Your enquiry, appointment details, project materials, correspondence and delivery records. We obtain your consent before making a recording.',
          'Transaction information: The services purchased, amounts paid, payment status and necessary billing information.',
          'Technical information: IP addresses, browser information and access logs needed to operate and protect the website.',
          'We collect most information directly from you. We may also receive it from someone authorised to contact us on your behalf, or from payment and technical service providers. Please do not include identity documents, payment-card details, health information or sensitive information about others in an initial enquiry. If you do not provide information necessary for a service, we may be unable to provide that service and will explain why.',
        ],
      },
      {
        title: 'Why we use your personal data',
        paragraphs: [
          'Enquiries and services: To respond to enquiries you request, arrange appointments, provide agreed services and handle related payments and refunds. Where necessary, we rely on taking steps at your request before entering into a contract, or on performing our contract with you.',
          'Legal records: To meet applicable accounting, tax and other legal requirements, we rely on the relevant legal obligation.',
          'Security and legal claims: To protect the website, maintain necessary business records and establish, exercise or defend legal claims, we rely on appropriate legitimate interests, taking account of your rights and reasonable expectations.',
          'Optional activities: Where an activity relies on consent, such as recording a session or subscribing to marketing emails, we obtain that consent separately. Making an enquiry does not subscribe you to marketing emails, and you can opt out of those emails.',
        ],
      },
      {
        title: 'Recordings and AI-assisted processing',
        paragraphs: [
          'Recordings: If we wish to record a session, we explain the purpose and obtain your consent in advance. You can decline or ask us to stop recording. We can take written notes instead.',
          'AI assistance: Before using client materials for AI-assisted organisation or analysis, we remove or replace unnecessary identifying information locally. Information that could still identify someone remains protected. Our staff review the results of AI-assisted processing.',
          'Limits on use: We do not use identifiable client information to train general-purpose AI models. Processing involving external tools must be covered by appropriate data protection arrangements. If we materially change how we process your information, we update our notice and obtain consent where required.',
        ],
      },
      {
        title: 'Payments and service providers',
        paragraphs: [
          'Stripe payments: Once online payments are enabled, Stripe will process payment information. We receive the transaction records needed to manage orders, accounting, refunds and disputes. We do not store full payment-card numbers or security codes in our own systems. Stripe explains its processing in its Privacy Policy.',
          'Necessary sharing: Information needed to operate the website and provide our services may also be processed by providers of email, cloud storage, hosting, security, communications and collaboration services. We limit what we share and put appropriate contractual and confidentiality arrangements in place for processing carried out on our behalf. We may disclose information to professional advisers or public authorities where legally required.',
          'We do not sell or rent your personal data.',
        ],
      },
      {
        title: 'Security and international transfers',
        paragraphs: [
          'Security: We use access controls, confidentiality measures and security safeguards appropriate to the risks. Access is limited to people who need the information for their work.',
          'International transfers: Some service providers may process information outside the European Economic Area. Where applicable, we use lawful transfer mechanisms, such as adequacy decisions or Standard Contractual Clauses, to protect that information. You can contact us for information about the relevant safeguards.',
        ],
      },
      {
        title: 'Retention and deletion',
        paragraphs: [
          'Retention principle: We keep personal data only for as long as needed to provide services, meet legal record-keeping requirements and handle necessary disputes. We review and clear records regularly.',
          'Different types of records: We delete recordings once necessary transcription and checking are complete and the recording is no longer needed. We retain project materials as needed for the service and subsequent support. Financial, contractual or dispute records may need to be kept longer under applicable law. Requests for deletion do not override legal retention requirements.',
        ],
      },
      {
        title: 'Cookies and third-party links',
        paragraphs: [
          'Cookie choices: The website may use cookies or similar technologies necessary for its operation and security. Before enabling analytics, advertising or other non-essential tracking that requires consent, we provide a choice. You can withdraw that consent.',
          'Third-party platforms: If you follow a link from this website to a third-party website or messaging platform, that provider also processes information under its own privacy policy.',
        ],
      },
      {
        title: 'Your rights and how to contact us',
        paragraphs: [
          'Your rights: Subject to applicable law, you can request access, correction, erasure, restriction of processing or object to processing, and exercise data portability rights where applicable. Where we rely on consent, you can withdraw it without affecting the lawfulness of processing carried out before withdrawal.',
          'Requests and responses: Contact info@yhfunhq.com. We normally respond within one month of receiving a request. If a lawful extension is needed, we will tell you within the first month and explain why.',
          'Complaints: You can complain directly to the Irish Data Protection Commission or another competent supervisory authority. You do not need our permission to do so.',
          'Policy updates: We update the date when this policy changes and give appropriate notice of material changes to our processing.',
        ],
      },
    ],
  },
  terms: {
    title: 'Terms of Service',
    updated: '19 October 2026',
    related: [['privacy', 'Privacy Policy'], ['refunds', 'Refunds & Cancellations Policy']],
    introduction: [
      'Our services are provided by Y. H. FUN LIMITED, trading as Y. H. FUN.',
      'Company registration number: 763264 (Ireland)',
      'Company address: Dock Road, Dunmore East, Co. Waterford, Ireland.',
      'Contact email: info@yhfunhq.com.',
    ],
    sections: [
      {
        title: 'Our services',
        paragraphs: [
          'We offer a Free 30-Minute Discovery Call, a paid Focused Consultation to work through a specific issue, and Consultation & Tailored Action Plan services. A Focused Consultation usually lasts 60 minutes. We agree the number of sessions, objectives and scope before you book. Implementation or ongoing support is included only where separately agreed.',
        ],
      },
      {
        title: 'Confirming services and payment',
        paragraphs: [
          'Before you pay, we confirm in writing the scope, deliverables, schedule, total price, currency, applicable taxes and payment stages. A standalone Focused Consultation is payable in full when the booking is confirmed. Work on a tailored plan begins only after you accept the specific quote and make the agreed payment.',
        ],
      },
      {
        title: 'Standalone sessions and upgrades',
        paragraphs: [
          'You can book a Focused Consultation on its own, choose Consultation & Tailored Action Plan, or request an upgrade after your consultation. We do not charge again for the consultation on the same issue where the earlier consultation still applies. Any package discount, total price and remaining balance after payments already made are set out in the quote you accept. If you decline the plan quote, we will not charge for plan work you have not agreed to.',
        ],
      },
      {
        title: 'Working together and changes to scope',
        paragraphs: [
          'Please provide the information we need, make sure you have the right to share it, and give feedback as agreed. Additional work, deliverables or revisions may affect the price and schedule; we explain any changes and obtain your agreement first. We provide the agreed service but do not guarantee a particular level of income, traffic or other business outcome. General consultancy is not a substitute for advice that must legally be provided by a suitably qualified or licensed professional.',
        ],
      },
      {
        title: 'Your materials, deliverables and privacy',
        paragraphs: [
          'You retain the rights to materials you bring to the project. Use of our deliverables is governed by the written agreement. Our pre-existing methods and templates, and rights in third-party materials, do not automatically transfer to you as part of the service. Please see our Privacy Policy for how we handle personal information, and our Cancellation and Refund Policy for cancellations and refunds.',
        ],
      },
      {
        title: 'Contact, governing law and updates',
        paragraphs: [
          'If you have a question or complaint about our services, please email us at the address above. These terms are governed by Irish law without limiting any mandatory consumer rights that apply to you. Later updates do not change the terms of orders already confirmed.',
        ],
      },
    ],
  },
  refunds: {
    title: 'Refunds & Cancellations Policy',
    updated: '19 October 2026',
    related: [['privacy', 'Privacy Policy'], ['terms', 'Terms of Service']],
    introduction: [
      'This policy applies to paid services provided by Y. H. FUN. The booking arrangements below do not limit consumers’ statutory cancellation, remedy or refund rights. Where a business customer has a separate written project agreement, applicable law and that agreement govern the project.',
    ],
    sections: [
      {
        title: 'Consumers’ statutory right to cancel',
        paragraphs: [
          'For consumer service contracts made online to which a statutory cancellation right applies, you can normally cancel without giving a reason within 14 days of entering into the contract. If you want us to begin during this period, you must expressly request this in advance in a form you can keep, such as email, and acknowledge that you lose this cancellation right once the service has been fully performed. If you cancel after only part of the service has been provided, and the legal conditions for charging have been met, we charge a reasonable proportion for services already provided and refund the balance. Full performance does not affect your statutory rights if there is a problem with the service.',
        ],
      },
      {
        title: 'Focused consultation bookings',
        paragraphs: [
          'Cancellation: If you give at least 24 hours’ notice, we refund the fee for that booking.',
          'Rescheduling: You may reschedule a booking once free of charge if you contact us before it starts. Any further rescheduling must be agreed separately.',
          'Late cancellations and missed appointments: For cancellations with less than 24 hours’ notice and missed appointments, we charge for our reasonable loss, up to the fee for that booking, and refund any balance.',
          'These arrangements do not limit statutory refund rights. If we are unable to provide the service, you can choose to reschedule or receive a refund for the part not provided.',
        ],
      },
      {
        title: 'Tailored plans and other projects',
        paragraphs: [
          'If you cancel a project before work has begun, we refund the advance payment for that project. Once work has begun, we calculate the amount payable based on the terms agreed in advance, the work actually completed and applicable law, and refund the unused balance.',
        ],
      },
      {
        title: 'If we cancel or the service does not meet the agreement',
        paragraphs: [
          'If we cannot provide the service, you may choose a mutually agreed new date or a refund for the part not provided. If the service does not meet the agreement, we provide a remedy, price reduction or refund as required by law.',
        ],
      },
      {
        title: 'Refund methods and timing',
        paragraphs: [
          'Refunds normally go back to the original payment method, unless we agree another method with you. We do not charge an additional refund fee. If you exercise a statutory cooling-off cancellation right, we issue any refund due no later than 14 days after receiving your cancellation notice. Other refunds follow the applicable legal deadlines and the arrangements already agreed. The time it takes for the money to reach you depends on the payment provider.',
        ],
      },
      {
        title: 'How to contact us',
        paragraphs: [
          'Please email info@yhfunhq.com, telling us whether you wish to cancel, reschedule or request a refund. Include your name and any order or booking details you have.',
        ],
      },
    ],
  },
}

function PageAction({ href, children, tone = 'amber' }) {
  const variant = tone === 'text' ? 'text' : 'solid'
  return <ActionButton href={href} variant={variant} tone={tone === 'olive' ? 'olive' : 'amber'} className="content-action">{children}</ActionButton>
}

function ContentHero({ eyebrow, title, href, image, action = 'Explore our services', secondary = 'Book your free discovery call', alignment = 'left' }) {
  return <section className={`content-hero hero-cutout-hero${alignment === 'center' ? ' content-hero--centered' : ''}`} data-curtain-hero aria-label={eyebrow}>
    <div className="content-hero-media" aria-hidden="true"><img src={image} alt="" /></div>
    <div className="content-hero-copy" data-curtain-copy>
      <p className="content-eyebrow" data-hero-reveal="eyebrow">{eyebrow}</p>
      <h1 data-hero-reveal="headline">{title}</h1>
    </div>
    <div className="content-hero-actions hero-cutout-actions" data-hero-reveal="actions" data-curtain-actions>
      {action && <PageAction href={href('services')} tone="olive">{action}</PageAction>}
      <ActionButton href={href('contact#contact-form')} variant="split" className="content-action">{secondary}</ActionButton>
    </div>
  </section>
}

function ClosingCTA({ href, title = 'Let’s work out the next step together.', subtitle, primary = 'Get in touch', secondary = 'Explore our services', ariaLabel = 'Get in touch' }) {
  return <section className="content-closing" aria-label={ariaLabel}>
    <img className="full-width-artwork" src={artwork('Page=all, Section=cta.svg')} alt="" loading="lazy" />
    <div className="content-closing-copy">
      <h2 data-reveal="text">{title}</h2>
      {subtitle && <p data-reveal="text" data-reveal-order="1">{subtitle}</p>}
    </div>
    <ClosingActions className="content-closing-actions">
      <ActionButton href={href('contact#contact-form')} variant="solid" className="content-action">{primary}</ActionButton>
      <ActionButton href={href('services')} variant="split" tone="olive">{secondary}</ActionButton>
    </ClosingActions>
  </section>
}

function CaseStudiesPage({ href, language }) {
  const chinese = language === 'zh-Hans'
  const renderStory = (study, index) => {
    const translated = chinese ? caseStudiesZh[index] : null
    const copy = translated ? { ...study, ...translated, image: { ...study.image, alt: translated.imageAlt } } : study
    const imageSide = index === 1 ? 'right' : 'left'
    return <section className={`case-story case-story-${index + 1} case-story-image-${imageSide}${index % 2 ? ' full-width-background' : ''}`} key={study.title} aria-labelledby={`case-title-${index + 1}`}>
      <div className="case-story-copy">
        <p className="case-story-meta" data-reveal="text"><span><img src={`/images/case-studies-icons/${encodeURIComponent(study.icon)}`} width="24" height="24" alt="" loading="lazy" />{copy.label}</span><span><img src="/images/case-studies-icons/marker%201.svg" width="24" height="24" alt="" loading="lazy" />{copy.location}</span></p>
        <h2 id={`case-title-${index + 1}`} data-reveal="text" data-reveal-order="1">{copy.title}</h2>
        <div className="case-story-detail-list">
          <div className="case-story-detail"><img className="case-story-detail-icon" src="/images/service-icons/What%20you%27re%20facing.svg" width="40" height="40" alt="" loading="lazy" /><h3>{chinese ? '问题' : 'The challenge'}</h3><p>{copy.challenge}</p></div>
          <div className="case-story-detail"><img className="case-story-detail-icon" src="/images/service-icons/What%20we%20do%20together.svg" width="40" height="40" alt="" loading="lazy" /><h3>{chinese ? '解法' : 'Our approach'}</h3><p>{copy.approach}</p></div>
          <div className="case-story-detail"><img className="case-story-detail-icon" src="/images/service-icons/Let%20feedback%20guide%20decisions.svg" width="40" height="40" alt="" loading="lazy" /><h3>{chinese ? '为什么这样做' : 'Why this approach'}</h3><p>{copy.reason}</p></div>
        </div>
      </div>
      <div className="case-story-image" data-reveal="visual">
        <img src={copy.image.src} alt={copy.image.alt} loading="lazy" />
      </div>
    </section>
  }

  return <div className="content-main case-studies-page">
    <div className="hero-curtain-track content-curtain-track case-studies-curtain-track" data-hero-curtain>
      <ContentHero eyebrow={chinese ? '案例研究' : 'Case studies'} title={chinese ? '优选案例' : 'Featured case studies.'} href={href} image="/images/heroes/case-studies-hero.png" {...(chinese ? { action: '了解我们的服务', secondary: '我们聊聊吧' } : {})} />
      <div className="hero-curtain-content">{renderStory(caseStudies[0], 0)}</div>
    </div>
    <div className="case-study-list full-width-background">
      {caseStudies.slice(1).map((study, index) => renderStory(study, index + 1))}
    </div>
    <ClosingCTA href={href} {...(chinese ? { title: '一起看看，下一步怎么走。', primary: '我们聊聊吧', secondary: '了解我们的服务', ariaLabel: '联系我们' } : {})} />
  </div>
}

const aboutChallenges = [
  ['Unclear direction', 'You want something to change, but can’t quite put the problem into words.', 'Page=about, Section=unclear-direction.svg'],
  ['Hard to get started', 'You have plenty of ideas, but can’t find the right first step.', 'Page=about, Section=hard-to-get-started.svg'],
  ['Getting stuck again', 'You rely on experience, but don’t yet have a consistent way of doing things.', 'Page=about, Section=getting-stuck-again.svg'],
]

function AboutPage({ href, language }) {
  const chinese = language === 'zh-Hans'
  const challenges = chinese ? [
    ['方向不清', '知道想改变，却说不清问题。', 'Page=about, Section=unclear-direction.svg'],
    ['难以开始', '想法很多，却找不到合适的第一步。', 'Page=about, Section=hard-to-get-started.svg'],
    ['反复卡住', '事情总靠经验，难以形成稳定做法。', 'Page=about, Section=getting-stuck-again.svg'],
  ] : aboutChallenges
  return <div className="content-main about-page">
    <div className="hero-curtain-track content-curtain-track" data-hero-curtain>
      <ContentHero eyebrow={chinese ? '我们是谁' : 'About us'} title={chinese ? <>有些卡点，<br />不必一个人想。</> : <>You don’t have to<br />figure it all out alone.</>} href={href} image="/images/heroes/about-us-hero.png" {...(chinese ? { action: '了解我们的服务', secondary: '我们聊聊吧' } : {})} />
      <div className="hero-curtain-content">
        <section className="about-intro content-section full-width-background" aria-labelledby="about-intro-heading">
          <div className="about-intro-art" data-reveal="visual"><img src={artwork('about-us.svg')} alt="" loading="lazy" /></div>
          <div><h2 id="about-intro-heading" data-reveal="text">{chinese ? '公司介绍' : 'About Y.H.FUN'}</h2><p data-reveal="text" data-reveal-order="1">{chinese ? 'Y. H. FUN是个人、独立经营者与精简团队的问题解决伙伴。我们一起理清问题，在实践中尝试、调整，留下能重复使用的方法和工具。' : 'Y. H. FUN is a problem-solving partner for individuals, independent business owners and small teams. We work through problems together, test ideas and make adjustments along the way, leaving you with methods and tools you can use again.'}</p></div>
        </section>
      </div>
    </div>
    <section className="about-challenges content-section" aria-labelledby="about-challenges-heading">
      <h2 id="about-challenges-heading" data-reveal="text">{chinese ? '有些卡点，不必一个人想' : 'You don’t have to figure it out all alone'}</h2>
      <div className="about-challenge-grid">
        {challenges.map(([title, description, file], index) => <article className="about-challenge" key={title} data-reveal="text" data-reveal-order={index}>
          <img src={artwork(file)} alt="" loading="lazy" />
          <h3>{title}</h3>
          <p>{description}</p>
          <PageAction href={href('services')} tone="text">{chinese ? '了解更多' : 'Learn more'}</PageAction>
        </article>)}
      </div>
    </section>
    <CompanionSection language={language} />
    <ClosingCTA
      href={href}
      title={chinese ? '一起看看，下一步怎么走。' : undefined}
      primary={chinese ? '我们聊聊吧' : undefined}
      secondary={chinese ? '了解我们的服务' : undefined}
      ariaLabel={chinese ? '联系我们' : undefined}
    />
  </div>
}

function ContactPage({ href, language }) {
  const chinese = language === 'zh-Hans'
  return <div className="content-main contact-page">
    <div className="hero-curtain-track content-curtain-track" data-hero-curtain>
      <ContentHero
        eyebrow={chinese ? '联系我们' : 'Contact us'}
        title={chinese ? <>告诉我们您在考虑什么，<br />看看我们可以如何帮忙。</> : <>Tell us what’s on your mind,<br />let’s see how we can help.</>}
        href={href}
        image="/images/heroes/contact-us-hero.png"
        action={null}
        secondary={chinese ? '预约 30 分钟免费初步沟通' : 'Request your free 30-minute discovery call'}
        alignment="center"
      />
      <div className="hero-curtain-content">
        <section className="contact-details content-section">
          <div className="contact-form-column" data-reveal="visual">
            <Suspense fallback={<RouteLoading language={language} form />}>
              <ContactForm href={href} language={language} />
            </Suspense>
          </div>
          <div className="contact-details-sidebar" data-reveal="visual" data-reveal-order="1">
            <ContactChannels language={language} />
            <img src={artwork('Page=contact, Section=contact-us.svg')} alt="" loading="lazy" />
          </div>
        </section>
      </div>
    </div>
    <ClosingCTA
      href={href}
      title={chinese ? '先聊聊。' : 'Let’s talk first.'}
      subtitle={chinese ? '现在还不需要做决定。' : 'No need to decide just yet.'}
      primary={chinese ? '开始沟通' : 'Let’s talk'}
      secondary={chinese ? '探索我们的服务' : 'Explore our services'}
    />
  </div>
}

function PolicyPage({ page, href, language }) {
  const chinese = language === 'zh-Hans'
  const policy = chinese ? policyDataZh[page] : policyData[page]
  const sectionIds = useMemo(
    () => policy.sections.map((_, index) => `${page}-section-${index + 1}`),
    [page, policy.sections],
  )
  const [activeSection, setActiveSection] = useState(sectionIds[0] ?? '')
  const currentActiveSection = sectionIds.includes(activeSection) ? activeSection : sectionIds[0] ?? ''

  useEffect(() => {
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((section) => section instanceof Element)
    if (!sections.length) return

    let frame
    const updateActiveSection = () => {
      frame = undefined
      const positions = sections.map((section) => section.getBoundingClientRect())
      const lastIndex = sections.length - 1
      const reachedPolicyEnd = positions[Math.max(0, lastIndex - 1)].top <= 96
        && positions[lastIndex].bottom <= window.innerHeight
      const active = reachedPolicyEnd
        ? sections[lastIndex]
        : sections.reduce(
          (current, section, index) => positions[index].top <= 96 ? section : current,
          sections[0],
        )
      setActiveSection(active.id)
    }
    const scheduleUpdate = () => {
      if (frame === undefined) frame = window.requestAnimationFrame(updateActiveSection)
    }

    scheduleUpdate()
    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', scheduleUpdate)
    return () => {
      window.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', scheduleUpdate)
      if (frame !== undefined) window.cancelAnimationFrame(frame)
    }
  }, [sectionIds])

  return <div className={`content-main policy-page policy-${page}`}>
    <header className="policy-heading">
      <h1>{policy.title}</h1>
      <p>Last updated: {policy.updated}</p>
      <nav aria-label="Related policies">{policy.related.map(([route, label]) => <PageAction href={href(route)} key={route}>{label}</PageAction>)}</nav>
    </header>
    <div className="policy-layout">
      <nav className="policy-toc" aria-label="On this page">
        <h2>On this page</h2>
        <ol>{policy.sections.map((section, index) => {
          const sectionId = sectionIds[index]
          return <li key={section.title}><a href={`#${sectionId}`} aria-current={currentActiveSection === sectionId ? 'location' : undefined}>{section.title}</a></li>
        })}</ol>
      </nav>
      <article className="policy-copy">
        {policy.introduction?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        {policy.sections.map((section, index) => <section id={`${page}-section-${index + 1}`} tabIndex={-1} key={section.title} aria-labelledby={`${page}-heading-${index + 1}`}>
          <h2 id={`${page}-heading-${index + 1}`}>{chinese ? section.title : `${index + 1}. ${section.title}`}</h2>
          {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </section>)}
      </article>
      <BackToTop showAfterId={`${page}-heading-1`} />
    </div>
  </div>
}

export default function ContentPage({ page, href, language = 'en' }) {
  if (page === 'case-studies') return <CaseStudiesPage href={href} language={language} />
  if (page === 'about') return <AboutPage href={href} language={language} />
  if (page === 'contact') return <ContactPage href={href} language={language} />
  return <PolicyPage page={page} href={href} language={language} />
}
