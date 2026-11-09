import { Component, lazy, Suspense, useEffect } from 'react'
import '../styles/tokens.css'
import '../styles/components.css'
import '../styles/home.css'
import '../styles/hero-cutouts.css'
import '../styles/section-layout.css'
import '../styles/reveal.css'
import Header from './Header.jsx'
import ActionButton from './ActionButton.jsx'
import RouteLoading from './RouteLoading.jsx'
import Footer from './Footer.jsx'
import { chinesePolicyTitles } from './pageTitles.js'
import { useScrollReveals } from './useScrollReveals.js'
import { useHeroCurtain } from './useHeroCurtain.js'
import OverlayScrollbar from './OverlayScrollbar.jsx'

const HomeSections = lazy(() => import('./HomeSections.jsx').then((module) => ({ default: module.HomeSections })))
const ServicesPage = lazy(() => import('./ServicesPage.jsx'))
const ContentPage = lazy(() => import('./ContentPages.jsx'))

// Desktop geometry/type now follow the supplied Figma CSS. Missing assets/copy remain documented.
const content = {
  en: { nav: ['Home', 'Services', 'Case Studies', 'About Us', 'Contact'], menu: 'Menu', close: 'Close menu', skip: 'Skip to content', title: 'Your', emphasis: 'problem-solving partner.', body: 'Make sense of your challenges and find a clear way forward.', action: 'Explore our services', contact: 'Get in touch', note: 'Working preview · V2 pending approval', pending: 'This page is outside the Home preview. Its destination is reserved for a later build.', back: 'Back to Home' },
  'zh-Hans': { nav: ['首页', '服务', '案例研究', '关于我们', '联系我们'], menu: '菜单', close: '关闭菜单', skip: '跳至正文', title: '你的', emphasis: '问题解决伙伴', body: '一起理清眼前的问题，找到能开始的下一步。', action: '探索我们的服务', contact: '联系我们', note: '预览草稿 · V2 仍待审批', pending: '本页尚未纳入首轮预览，已为下一阶段预留链接。', back: '返回首页' },
}
const routes = ['', 'services', 'case-studies', 'about', 'contact']
const params = new URLSearchParams(window.location.search)
const locale = params.get('lang') === 'zh-Hans' ? 'zh-Hans' : 'en'
const policyTitles = { privacy: 'Privacy Policy', terms: 'Terms of Service', refunds: 'Refunds & Cancellations Policy' }
const chinesePageTitles = { 'case-studies': '优选案例', ...chinesePolicyTitles }
const page = [...routes, ...Object.keys(policyTitles)].includes(params.get('page')) ? params.get('page') : ''
const contentPages = ['case-studies', 'about', 'contact', 'privacy', 'terms', 'refunds']
const chineseContentPages = ['case-studies', 'about', 'privacy', 'terms', 'refunds']
const href = (route = '', lang = locale) => `/?lang=${lang}${route ? `&page=${route}` : ''}`
const navigationItems = routes.map((route, index) => ({
  id: route || 'home',
  href: href(route),
  en: content.en.nav[index],
  'zh-Hans': content['zh-Hans'].nav[index],
}))

function HomeHero({ locale, t }) {
  return <section className="home-hero hero-cutout-hero" data-curtain-hero aria-labelledby="hero-heading">
    <div className="hero-photo-slot" aria-hidden="true"><img src="/images/heroes/home-hero.png" alt="" /></div>
    <div className="container hero-content">
      <div className="hero-copy" data-curtain-copy>
        <p className="hero-eyebrow" data-hero-reveal="eyebrow">{locale === 'zh-Hans' ? '欢迎来到 Y. H. FUN' : 'WELCOME TO Y. H. FUN'}</p>
        <h1 id="hero-heading" data-hero-reveal="headline">{t.title}{locale === 'en' ? ' ' : null}<span className="hero-emphasis">{t.emphasis}</span></h1>
      </div>
      <div className="hero-actions hero-cutout-actions" data-hero-reveal="actions" data-curtain-actions>{locale === 'en' ? <>
        <ActionButton href={href('services')} variant="solid" tone="olive">{t.action}</ActionButton>
        <ActionButton href={href('contact')} variant="split">Let’s talk</ActionButton>
      </> : <>
        <ActionButton href={href('services')} variant="solid" tone="olive">了解我们的服务</ActionButton>
        <ActionButton href={href('contact')} variant="split">我们聊聊吧</ActionButton>
      </>}</div>
    </div>
  </section>
}

export class RouteErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error('A route chunk failed to load.', error, info)
  }

  render() {
    if (!this.state.hasError) return this.props.children

    const chinese = this.props.language === 'zh-Hans'
    return <section className="route-load-error" role="alert">
      <p>{chinese ? '页面加载失败，请重新加载后重试。' : 'This page could not be loaded. Please reload and try again.'}</p>
      <button type="button" onClick={() => window.location.reload()}>{chinese ? '重新加载页面' : 'Reload page'}</button>
    </section>
  }
}

export default function App() {
  useScrollReveals()
  useHeroCurtain()
  const t = content[locale]
  const isEnglishContentPage = locale === 'en' && contentPages.includes(page)
  const isContactPage = page === 'contact' && (locale === 'en' || locale === 'zh-Hans')
  const isChineseContentPage = locale === 'zh-Hans' && chineseContentPages.includes(page)
  const isRenderedContentPage = isEnglishContentPage || isContactPage || isChineseContentPage
  useEffect(() => {
    document.documentElement.lang = locale
    document.title = `${(locale === 'zh-Hans' && chinesePageTitles[page]) || policyTitles[page] || t.nav[routes.indexOf(page)]} · Y. H. FUN`
  }, [t])
  return <><OverlayScrollbar /><div id="site-top" className={!page ? 'desktop-home' : page === 'services' ? 'desktop-services' : isRenderedContentPage ? `desktop-content-pages${['case-studies', 'about', 'contact'].includes(page) ? ' content-page-with-hero' : ' policy-content-page'}` : undefined}>
    <a className="skip-link" href="#main">{t.skip}</a>
    <Header
      language={locale}
      onLanguageChange={(nextLocale) => window.location.assign(href(page, nextLocale))}
      activeId={page || 'home'}
      items={navigationItems}
      homeHref={href()}
    />
    <main id="main" tabIndex={-1} className={page === 'services' ? 'services-main' : undefined}>
      <RouteErrorBoundary language={locale}>
        {page === 'services' || isRenderedContentPage ? (
          <Suspense fallback={<RouteLoading language={locale} />}>
            {page === 'services'
              ? <ServicesPage href={href} language={locale} />
              : <ContentPage page={page} href={href} language={locale} />}
          </Suspense>
        ) : page ? (
          <section className="container destination-preview">
            <h1>{(policyTitles[page] || t.nav[routes.indexOf(page)])}</h1>
            <p>{t.pending}</p>
            <ActionButton href={href()} variant="solid" tone="olive">{t.back}</ActionButton>
          </section>
        ) : <>
          <div className="hero-curtain-track home-curtain-track" data-hero-curtain>
            <HomeHero locale={locale} t={t} />
            <div className="hero-curtain-content home-curtain-content">
              <section className="home-intro full-width-background" aria-labelledby="intro-heading">
                <div className="container intro-content">
                  <div><h2 id="intro-heading" data-reveal="text">{locale === 'zh-Hans' ? '问题梳理，想法落地。' : <>Work through the problem.<br />Put ideas into practice.</>}</h2>
                    <p data-reveal="text" data-reveal-order="1">{locale === 'zh-Hans' ? '一起理清眼前的问题，找到能开始的下一步。' : 'Let’s map out the problem together and find a next step you can take.'}</p>
                  </div>
                  <div className="intro-artwork" data-reveal="visual" data-reveal-order="1"><img src="/images/mockup-illustrations/Page=home,%20Section=hero.svg" width="486" height="160" alt="" /></div>
                </div>
              </section>
              <div className="audience-strip full-width-background"><strong>{locale === 'zh-Hans' ? '服务对象' : 'WHO WE ARE FOR'}</strong><div className="audience-labels">{(locale === 'zh-Hans' ? ['个人', '独立经营者', '精简团队'] : ['Small teams', 'Independent business owners', 'Individuals']).map((item, index) => <span key={item}>{index > 0 && <span aria-hidden="true">•</span>}<span>{item}</span></span>)}</div></div>
            </div>
          </div>
          <Suspense fallback={<RouteLoading language={locale} />}>
            <HomeSections href={href} language={locale} />
          </Suspense>
        </>}
      </RouteErrorBoundary>
    </main>
    {(!page || page === 'services' || isEnglishContentPage || isContactPage || isChineseContentPage) && (locale === 'en' || isContactPage || isChineseContentPage || (page === 'services' && locale === 'zh-Hans') || (!page && locale === 'zh-Hans')) && <Footer href={href} language={locale} onLanguageChange={(nextLocale) => window.location.assign(href(page, nextLocale))} />}
    {!page && locale === 'zh-Hans' && <aside className="preview-note">{t.note}</aside>}
  </div></>
}
