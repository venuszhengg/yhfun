import { Component, lazy, startTransition, Suspense, useCallback, useEffect, useRef, useState } from 'react'
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

const loadHomeSections = () => import('./HomeSections.jsx')
const loadServicesPage = () => import('./ServicesPage.jsx')
const loadContentPage = () => import('./ContentPages.jsx')
const HomeSections = lazy(() => loadHomeSections().then((module) => ({ default: module.HomeSections })))
const ServicesPage = lazy(loadServicesPage)
const ContentPage = lazy(loadContentPage)

// Desktop geometry/type now follow the supplied Figma CSS. Missing assets/copy remain documented.
const content = {
  en: { nav: ['Home', 'Services', 'Case Studies', 'About Us', 'Contact'], menu: 'Menu', close: 'Close menu', skip: 'Skip to content', title: 'Your', emphasis: 'problem-solving partner.', body: 'Make sense of your challenges and find a clear way forward.', action: 'Explore our services', contact: 'Get in touch', pending: 'This page is outside the Home preview. Its destination is reserved for a later build.', back: 'Back to Home' },
  'zh-Hans': { nav: ['首页', '服务', '案例研究', '关于我们', '联系我们'], menu: '菜单', close: '关闭菜单', skip: '跳至正文', title: '你的', emphasis: '问题解决伙伴', body: '一起理清眼前的问题，找到能开始的下一步。', action: '探索我们的服务', contact: '联系我们', pending: '本页尚未纳入首轮预览，已为下一阶段预留链接。', back: '返回首页' },
}
const routes = ['', 'services', 'case-studies', 'about', 'contact']
const policyTitles = { privacy: 'Privacy Policy', terms: 'Terms of Service', refunds: 'Refunds & Cancellations Policy' }
const chinesePageTitles = { 'case-studies': '优选案例', ...chinesePolicyTitles }
const contentPages = ['case-studies', 'about', 'contact', 'privacy', 'terms', 'refunds']
const chineseContentPages = ['case-studies', 'about', 'privacy', 'terms', 'refunds']
const validPages = [...routes, ...Object.keys(policyTitles)]
const heroImages = {
  '': '/images/heroes/home-hero.png',
  services: '/images/heroes/services-hero.png',
  'case-studies': '/images/heroes/case-studies-hero.png',
  about: '/images/heroes/about-us-hero.png',
  contact: '/images/heroes/contact-us-hero.png',
}

function readRoute(url = window.location.href) {
  const destination = new URL(url, window.location.href)
  const requestedPage = destination.searchParams.get('page') || ''

  return {
    page: validPages.includes(requestedPage) ? requestedPage : '',
    locale: destination.searchParams.get('lang') === 'zh-Hans' ? 'zh-Hans' : 'en',
    href: `${destination.pathname}${destination.search}${destination.hash}`,
  }
}

function preloadImage(source) {
  if (!source) return Promise.resolve()

  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = resolve
    image.onerror = reject
    image.src = source
    if (image.complete) {
      if (image.naturalWidth > 0) resolve()
      else reject(new Error(`Unable to load ${source}`))
    }
  })
}

async function prepareRoute(route) {
  const modulePromise = route.page === ''
    ? loadHomeSections()
    : route.page === 'services'
      ? loadServicesPage()
      : contentPages.includes(route.page)
        ? loadContentPage()
        : Promise.resolve()

  await Promise.all([modulePromise, preloadImage(heroImages[route.page])])
}

function InitialLoadReady({ onReady }) {
  useEffect(() => {
    let firstFrame = 0
    let secondFrame = 0

    firstFrame = requestAnimationFrame(() => {
      secondFrame = requestAnimationFrame(() => {
        onReady()
      })
    })

    return () => {
      cancelAnimationFrame(firstFrame)
      cancelAnimationFrame(secondFrame)
    }
  }, [onReady])

  return null
}

function HomeHero({ locale, t, href }) {
  const discoveryHref = `${href('contact')}&enquiry=discovery#contact-form`
  return <section className="home-hero hero-cutout-hero" data-curtain-hero aria-labelledby="hero-heading">
    <div className="hero-photo-slot" aria-hidden="true"><img src="/images/heroes/home-hero.png" alt="" /></div>
    <div className="container hero-content">
      <div className="hero-copy" data-curtain-copy>
        <p className="hero-eyebrow" data-hero-reveal="eyebrow">{locale === 'zh-Hans' ? '欢迎来到 Y. H. FUN' : 'WELCOME TO Y. H. FUN'}</p>
        <h1 id="hero-heading" data-hero-reveal="headline">{t.title}{locale === 'en' ? ' ' : null}<span className="hero-emphasis">{t.emphasis}</span></h1>
      </div>
      <div className="hero-actions hero-cutout-actions" data-hero-reveal="actions" data-curtain-actions>{locale === 'en' ? <>
        <ActionButton href={href('services')} variant="solid" tone="olive">{t.action}</ActionButton>
        <ActionButton href={discoveryHref} variant="split">Let’s talk</ActionButton>
      </> : <>
        <ActionButton href={href('services')} variant="solid" tone="olive">了解我们的服务</ActionButton>
        <ActionButton href={discoveryHref} variant="split">预约免费沟通</ActionButton>
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
  const [currentRoute, setCurrentRoute] = useState(() => readRoute())
  const [initialContentReady, setInitialContentReady] = useState(false)
  const [navigationKey, setNavigationKey] = useState(0)
  const [navigationFailed, setNavigationFailed] = useState(false)
  const [navigationError, setNavigationError] = useState(null)
  const navigationRequest = useRef(0)
  const committedHref = useRef(currentRoute.href)
  const markInitialContentReady = useCallback(() => setInitialContentReady(true), [])
  const { locale, page } = currentRoute
  const href = useCallback((route = '', lang = locale) => `/?lang=${lang}${route ? `&page=${route}` : ''}`, [locale])
  const t = content[locale]
  const navigationItems = routes.map((route, index) => ({
    id: route || 'home',
    href: href(route),
    en: content.en.nav[index],
    'zh-Hans': content['zh-Hans'].nav[index],
  }))
  const isEnglishContentPage = locale === 'en' && contentPages.includes(page)
  const isContactPage = page === 'contact' && (locale === 'en' || locale === 'zh-Hans')
  const isChineseContentPage = locale === 'zh-Hans' && chineseContentPages.includes(page)
  const isRenderedContentPage = isEnglishContentPage || isContactPage || isChineseContentPage

  const navigateTo = useCallback(async (destination, { historyMode = 'push', restoreY = 0 } = {}) => {
    const target = readRoute(destination)
    const targetUrl = new URL(target.href, window.location.origin)
    const committedUrl = new URL(committedHref.current, window.location.origin)

    if (targetUrl.pathname === committedUrl.pathname && targetUrl.search === committedUrl.search) {
      if (targetUrl.hash) document.querySelector(targetUrl.hash)?.scrollIntoView()
      return
    }

    const requestId = ++navigationRequest.current
    setInitialContentReady(false)
    setNavigationFailed(false)
    setNavigationError(null)
    setNavigationKey((current) => current + 1)

    try {
      await prepareRoute(target)
    } catch {
      if (requestId !== navigationRequest.current) return
      if (historyMode === 'pop') window.history.replaceState(window.history.state, '', committedHref.current)
      setNavigationFailed(true)
      setNavigationError({ href: target.href, locale: target.locale })
      return
    }

    if (requestId !== navigationRequest.current) return

    if (historyMode === 'push') {
      window.history.replaceState({ ...window.history.state, yhfunScrollY: window.scrollY }, '')
      window.history.pushState({ yhfunScrollY: 0 }, '', target.href)
    }

    committedHref.current = target.href
    startTransition(() => setCurrentRoute(target))

    requestAnimationFrame(() => {
      const previousScrollBehavior = document.documentElement.style.scrollBehavior
      document.documentElement.style.scrollBehavior = 'auto'
      if (targetUrl.hash) {
        document.querySelector(targetUrl.hash)?.scrollIntoView()
      } else {
        window.scrollTo(0, historyMode === 'pop' ? restoreY : 0)
      }
      document.documentElement.style.scrollBehavior = previousScrollBehavior
    })
  }, [])

  useEffect(() => {
    const handleLink = (event) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      const anchor = event.target.closest?.('a[href]')
      if (!anchor || anchor.target && anchor.target !== '_self' || anchor.hasAttribute('download')) return

      const destination = new URL(anchor.href, window.location.href)
      if (destination.origin !== window.location.origin || destination.pathname !== window.location.pathname) return
      if (!destination.searchParams.has('lang') && !destination.searchParams.has('page')) return

      event.preventDefault()
      navigateTo(destination.href)
    }

    document.addEventListener('click', handleLink)
    return () => document.removeEventListener('click', handleLink)
  }, [navigateTo])

  useEffect(() => {
    const handlePopState = (event) => {
      navigateTo(window.location.href, { historyMode: 'pop', restoreY: event.state?.yhfunScrollY || 0 })
    }

    window.history.replaceState({ ...window.history.state, yhfunScrollY: window.scrollY }, '')
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [navigateTo])

  useEffect(() => {
    document.documentElement.lang = locale
    document.title = `${(locale === 'zh-Hans' && chinesePageTitles[page]) || policyTitles[page] || t.nav[routes.indexOf(page)]} · Y. H. FUN`
  }, [locale, page, t])

  const routeKey = `${locale}:${page}`

  return <><OverlayScrollbar /><div id="site-top" className={!page ? 'desktop-home' : page === 'services' ? 'desktop-services' : isRenderedContentPage ? `desktop-content-pages${['case-studies', 'about', 'contact'].includes(page) ? ' content-page-with-hero' : ' policy-content-page'}` : undefined}>
    <a className="skip-link" href="#main">{t.skip}</a>
    <Header
      language={locale}
      onLanguageChange={(nextLocale) => navigateTo(href(page, nextLocale))}
      activeId={page || 'home'}
      items={navigationItems}
      homeHref={href()}
      initialContentReady={initialContentReady}
      loadKey={navigationKey}
      loadFailed={navigationFailed}
    />
    {navigationError && <div className="route-navigation-error" role="alert">
      <span>{navigationError.locale === 'zh-Hans' ? '页面暂时无法加载。当前页面仍然保留。' : 'The next page could not be loaded. This page has been kept open.'}</span>
      <button type="button" onClick={() => navigateTo(navigationError.href)}>{navigationError.locale === 'zh-Hans' ? '重试' : 'Try again'}</button>
      <button type="button" onClick={() => setNavigationError(null)}>{navigationError.locale === 'zh-Hans' ? '关闭' : 'Dismiss'}</button>
    </div>}
    <main key={routeKey} id="main" tabIndex={-1} className={`${page === 'services' ? 'services-main ' : ''}route-content-entering`}>
      <RouteErrorBoundary key={`${locale}:${page}`} language={locale}>
        {page === 'services' || isRenderedContentPage ? (
          <Suspense fallback={<RouteLoading language={locale} />}>
            {page === 'services'
              ? <ServicesPage href={href} language={locale} />
              : <ContentPage page={page} href={href} language={locale} />}
            <InitialLoadReady key={routeKey} onReady={markInitialContentReady} />
          </Suspense>
        ) : page ? (
          <section className="container destination-preview">
            <h1>{(policyTitles[page] || t.nav[routes.indexOf(page)])}</h1>
            <p>{t.pending}</p>
            <ActionButton href={href()} variant="solid" tone="olive">{t.back}</ActionButton>
            <InitialLoadReady key={routeKey} onReady={markInitialContentReady} />
          </section>
        ) : <>
          <div className="hero-curtain-track home-curtain-track" data-hero-curtain>
            <HomeHero locale={locale} t={t} href={href} />
            <div className="hero-curtain-content home-curtain-content">
              <section className="home-intro full-width-background" aria-labelledby="intro-heading">
                <div className="container intro-content">
                  <div><h2 id="intro-heading" data-reveal="text">{locale === 'zh-Hans' ? '问题梳理，想法落地。' : <>Work through the problem.<br />Put ideas into practice.</>}</h2>
                    <p data-reveal="text" data-reveal-order="1">{locale === 'zh-Hans' ? '一起理清眼前的问题，找到能开始的下一步。' : 'Let’s map out the problem together and find a next step you can take.'}</p>
                  </div>
                  <div className="intro-artwork" data-reveal="visual" data-reveal-order="1"><img src="/images/mockup-illustrations/Page=home,%20Section=hero.svg" width="486" height="160" alt="" /></div>
                </div>
              </section>
              <div className="audience-strip full-width-background"><strong>{locale === 'zh-Hans' ? '我们的服务对象' : 'WHO WE ARE FOR'}</strong><div className="audience-labels">{(locale === 'zh-Hans' ? ['个人', '独立经营者', '精简团队'] : ['Small teams', 'Independent business owners', 'Individuals']).map((item, index) => <span key={item}>{index > 0 && <span aria-hidden="true">•</span>}<span>{item}</span></span>)}</div></div>
            </div>
          </div>
          <Suspense fallback={<RouteLoading language={locale} />}>
            <HomeSections href={href} language={locale} />
            <InitialLoadReady key={routeKey} onReady={markInitialContentReady} />
          </Suspense>
        </>}
      </RouteErrorBoundary>
    </main>
    {(!page || page === 'services' || isEnglishContentPage || isContactPage || isChineseContentPage) && (locale === 'en' || isContactPage || isChineseContentPage || (page === 'services' && locale === 'zh-Hans') || (!page && locale === 'zh-Hans')) && <Footer href={href} language={locale} onLanguageChange={(nextLocale) => navigateTo(href(page, nextLocale))} />}
  </div></>
}
