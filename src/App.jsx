import { useEffect } from 'react'
import '../styles/tokens.css'
import '../styles/components.css'
import '../styles/home.css'
import '../styles/services.css'
import '../styles/content-pages.css'
import '../styles/hero-cutouts.css'
import Header from './Header.jsx'
import ActionButton from './ActionButton.jsx'
import { HomeSections } from './HomeSections.jsx'
import Footer from './Footer.jsx'
import ServicesPage from './ServicesPage.jsx'
import ContentPage from './ContentPages.jsx'
import HeroCutoutClipPath from './HeroCutoutClipPath.jsx'
import { useHeroCutout } from './useHeroCutout.js'

// Desktop geometry/type now follow the supplied Figma CSS. Missing assets/copy remain documented.
const content = {
  en: { nav: ['Home', 'Services', 'Case Studies', 'About Us', 'Contact'], menu: 'Menu', close: 'Close menu', skip: 'Skip to content', title: 'Your', emphasis: 'problem-solving partner.', body: 'Make sense of your challenges and find a clear way forward.', action: 'Explore our services', contact: 'Get in touch', note: 'Working preview · V2 pending approval', pending: 'This page is outside the Home preview. Its destination is reserved for a later build.', back: 'Back to Home' },
  'zh-Hans': { nav: ['首页', '服务', '案例研究', '关于我们', '联系我们'], menu: '菜单', close: '关闭菜单', skip: '跳至正文', title: '你的', emphasis: '问题解决伙伴', body: '一起理清眼前的挑战，找到适合你的下一步。', action: '探索我们的服务', contact: '联系我们', note: '预览草稿 · V2 仍待审批', pending: '本页尚未纳入首轮预览，已为下一阶段预留链接。', back: '返回首页' },
}
const routes = ['', 'services', 'case-studies', 'about', 'contact']
const params = new URLSearchParams(window.location.search)
const locale = params.get('lang') === 'zh-Hans' ? 'zh-Hans' : 'en'
const policyTitles = { privacy: 'Privacy Policy', terms: 'Terms of Service', refunds: 'Refunds & Cancellations Policy' }
const page = [...routes, ...Object.keys(policyTitles)].includes(params.get('page')) ? params.get('page') : ''
const contentPages = ['about', 'contact', 'privacy', 'terms', 'refunds']
const href = (route = '', lang = locale) => `/?lang=${lang}${route ? `&page=${route}` : ''}`
const navigationItems = routes.map((route, index) => ({
  id: route || 'home',
  href: href(route),
  en: content.en.nav[index],
  'zh-Hans': content['zh-Hans'].nav[index],
}))

function HomeHero({ locale, t }) {
  const [heroRef, mediaRef, copyRef, actionsRef, pathRef, clipId] = useHeroCutout('center')

  return <section ref={heroRef} className="home-hero hero-cutout-hero" aria-labelledby="hero-heading">
    <HeroCutoutClipPath id={clipId} pathRef={pathRef} />
    <div ref={mediaRef} className="hero-photo-slot hero-cutout-media" style={{ clipPath: `url(#${clipId})` }} aria-hidden="true"><img src="/images/heroes/hero-home.png" alt="" /></div>
    <div className="container hero-content">
      <div ref={copyRef} className="hero-copy">
        {locale === 'en' && <p className="hero-eyebrow">WELCOME TO Y. H. FUN</p>}
        <h1 id="hero-heading">{t.title}{locale === 'en' ? ' ' : <br />}<span className="hero-emphasis">{t.emphasis}</span></h1>
        {locale !== 'en' && <p>{t.body}</p>}
      </div>
      <div ref={actionsRef} className="hero-actions hero-cutout-actions">{locale === 'en' ? <>
        <ActionButton href={href('services')} variant="solid" tone="olive">{t.action}</ActionButton>
        <ActionButton href={href('contact')} variant="split">Let’s talk</ActionButton>
      </> : <>
        <ActionButton href={href('services')} variant="solid" tone="olive">{t.action}</ActionButton>
        <ActionButton href={href('contact')} variant="split">{t.contact}</ActionButton>
      </>}</div>
    </div>
  </section>
}

export default function App() {
  const t = content[locale]
  const isEnglishContentPage = locale === 'en' && contentPages.includes(page)
  const isContactPage = page === 'contact' && (locale === 'en' || locale === 'zh-Hans')
  const isRenderedContentPage = isEnglishContentPage || isContactPage
  useEffect(() => {
    let animationFrame
    const stopScroll = () => {
      if (animationFrame) window.cancelAnimationFrame(animationFrame)
      animationFrame = undefined
    }
    const onClick = (event) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      const link = event.target instanceof Element ? event.target.closest('a[href]') : null
      if (!link || link.hasAttribute('download') || (link.target && link.target !== '_self')) return

      const destination = new URL(link.href, window.location.href)
      if (destination.origin !== window.location.origin || destination.pathname !== window.location.pathname || destination.search !== window.location.search || !destination.hash) return
      const target = document.getElementById(decodeURIComponent(destination.hash.slice(1)))
      if (!target) return

      event.preventDefault()
      stopScroll()
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        if (window.location.hash !== destination.hash) window.history.pushState(null, '', destination.hash)
        window.scrollTo(0, target.getBoundingClientRect().top + window.scrollY)
        if (target.hasAttribute('tabindex')) target.focus({ preventScroll: true })
        return
      }

      if (window.location.hash !== destination.hash) window.history.pushState(null, '', destination.hash)
      if (target.hasAttribute('tabindex')) target.focus({ preventScroll: true })

      const startY = window.scrollY
      const endY = Math.max(0, Math.min(target.getBoundingClientRect().top + startY, document.documentElement.scrollHeight - window.innerHeight))
      const distance = endY - startY
      const duration = Math.min(1400, Math.max(700, Math.abs(distance) * 0.45))
      const startTime = performance.now()
      const animate = (now) => {
        const progress = Math.min((now - startTime) / duration, 1)
        const eased = progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - ((-2 * progress + 2) ** 3) / 2
        window.scrollTo(0, startY + distance * eased)
        if (progress < 1) animationFrame = window.requestAnimationFrame(animate)
        else animationFrame = undefined
      }
      animationFrame = window.requestAnimationFrame(animate)
    }
    const interrupt = () => stopScroll()
    const onKeyDown = (event) => {
      if ([' ', 'ArrowDown', 'ArrowUp', 'End', 'Home', 'PageDown', 'PageUp'].includes(event.key)) interrupt()
    }
    document.addEventListener('click', onClick)
    window.addEventListener('wheel', interrupt, { passive: true })
    window.addEventListener('touchstart', interrupt, { passive: true })
    window.addEventListener('pointerdown', interrupt, { passive: true })
    window.addEventListener('keydown', onKeyDown)
    return () => {
      stopScroll()
      document.removeEventListener('click', onClick)
      window.removeEventListener('wheel', interrupt)
      window.removeEventListener('touchstart', interrupt)
      window.removeEventListener('pointerdown', interrupt)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [])
  useEffect(() => {
    document.documentElement.lang = locale
    document.title = `${(policyTitles[page] || t.nav[routes.indexOf(page)])} · Y. H. FUN`
  }, [t])
  return <div id="site-top" className={!page && locale === 'en' ? 'desktop-home' : page === 'services' && locale === 'en' ? 'desktop-services' : isRenderedContentPage ? `desktop-content-pages${['about', 'contact'].includes(page) ? ' content-page-with-hero' : ''}` : undefined}>
    <a className="skip-link" href="#main">{t.skip}</a>
    <Header
      language={locale}
      onLanguageChange={(nextLocale) => window.location.assign(href(page, nextLocale))}
      activeId={page || 'home'}
      items={navigationItems}
      homeHref={href()}
    />
    <main id="main" tabIndex={-1} className={page === 'services' && locale === 'en' ? 'services-main' : undefined}>
      {page === 'services' && locale === 'en' ? <ServicesPage href={href} /> : isRenderedContentPage ? <ContentPage page={page} href={href} language={locale} /> : page ? <section className="container destination-preview"><h1>{(policyTitles[page] || t.nav[routes.indexOf(page)])}</h1><p>{t.pending}</p><ActionButton href={href()} variant="solid" tone="olive">{t.back}</ActionButton></section> :
        <HomeHero locale={locale} t={t} />}
      {!page && locale === 'en' && <section className="home-intro" aria-labelledby="intro-heading">
        <div className="container intro-content">
          <div><h2 id="intro-heading">Work through the problem.<br />Put ideas into practice.</h2>
            <p>Let’s map out the problem together and find a next step you can take.</p>
          </div>
          <div className="intro-artwork"><img src="/images/mockup-illustrations/Page=home,%20Section=hero.svg" width="486" height="160" alt="" /></div>
        </div>
        <div className="audience-strip"><strong>WHO WE ARE FOR</strong><div className="audience-labels"><span>Small teams</span><span aria-hidden="true">•</span><span>Independent business owners</span><span aria-hidden="true">•</span><span>Individuals</span></div></div>
      </section>}
      {!page && locale === 'en' && <HomeSections href={href} />}
    </main>
    {(!page || page === 'services' || isEnglishContentPage || isContactPage) && (locale === 'en' || isContactPage) && <Footer href={href} language={locale} onLanguageChange={(nextLocale) => window.location.assign(href(page, nextLocale))} />}
    {!(page === 'services' && locale === 'en') && !isRenderedContentPage && <aside className="preview-note">{t.note}</aside>}
  </div>
}
