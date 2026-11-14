import ActionButton from './ActionButton.jsx'
import './FeaturedCaseCard.css'

export default function FeaturedCaseCard({ study, href, index, variant, language = 'en' }) {
  const isHome = variant === 'home'
  const cardClass = isHome ? 'case-study-card' : 'services-case-card'
  const detailsClass = isHome ? 'case-study-details' : 'services-case-details'
  const linkClass = isHome ? 'case-study-link' : 'services-case-link'
  const imageClass = isHome ? 'case-study-artwork' : 'services-case-image'

  return <article className={`${cardClass} featured-case-card`} data-reveal="visual" data-reveal-order={index}>
    <div className={detailsClass}>
      <div><h3>{study.title}</h3><p>{study.description}</p></div>
      <ActionButton href={href} variant="arrow" tone="olive" className={linkClass} aria-label={language === 'zh-Hans' ? `阅读案例：${study.title}` : `Read case study: ${study.title}`}>{study.title}</ActionButton>
    </div>
    <div className={`${imageClass} featured-case-image`}>
      <img src={study.image.src} alt={study.image.alt} loading="lazy" />
    </div>
  </article>
}
