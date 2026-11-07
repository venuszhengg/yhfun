import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import './Header.css';
import LanguageSwitcher from './LanguageSwitcher.jsx';

function Icon({ name }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {name === 'chevron' ? <path d="m6 9 6 6 6-6" /> : name === 'check' ? <path d="m5 12 4 4L19 6" /> : name === 'close' ? <path d="m6 6 12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
    </svg>
  );
}

export default function Header({ language = 'en', onLanguageChange, activeId = 'home', items, homeHref = '/' }) {
  const zh = language === 'zh-Hans';
  const [mobileOpen, setMobileOpen] = useState(false);
  const [indicator, setIndicator] = useState(null);
  const headerRef = useRef(null);
  const navRef = useRef(null);
  const mobileRef = useRef(null);

  useLayoutEffect(() => {
    const nav = navRef.current;
    let disposed = false;
    const measure = () => {
      if (disposed) return;
      const active = nav.querySelector('[aria-current="page"]');
      if (!active || !nav.getClientRects().length) return;
      const a = active.getBoundingClientRect();
      const n = nav.getBoundingClientRect();
      setIndicator({ left: a.left - n.left + 8, top: a.bottom - n.top - 5, width: a.width - 16 });
    };
    measure();
    const observer = typeof ResizeObserver === 'function' ? new ResizeObserver(measure) : null;
    observer?.observe(nav);
    window.addEventListener('resize', measure);
    document.fonts?.ready.then(measure);
    return () => { disposed = true; observer?.disconnect(); window.removeEventListener('resize', measure); };
  }, [activeId, language, mobileOpen, items]);

  useEffect(() => {
    const dismiss = (event) => {
      if (!headerRef.current?.contains(event.target)) setMobileOpen(false);
    };
    document.addEventListener('pointerdown', dismiss);
    return () => document.removeEventListener('pointerdown', dismiss);
  }, []);

  const navigate = () => setMobileOpen(false);

  return (
    <header className="yhf-header" ref={headerRef} onBlur={(event) => {
      if (!event.currentTarget.contains(event.relatedTarget)) setMobileOpen(false);
    }} onKeyDown={(event) => {
      if (event.key !== 'Escape') return;
      if (mobileOpen) { setMobileOpen(false); mobileRef.current?.focus(); }
    }}>
      <a className="yhf-logo" href={homeHref} aria-label={zh ? 'Y. H. FUN 首页' : 'Y. H. FUN home'} onClick={navigate}>Y. H. FUN</a>

      <nav id="yhf-main-nav" className={`yhf-nav${mobileOpen ? ' is-open' : ''}`} ref={navRef} aria-label={zh ? '主导航' : 'Main navigation'}>
        {items.map((item) => {
          const label = item[zh ? 'zh-Hans' : 'en'];
          return <a key={item.id} href={item.href} className="yhf-nav-link" data-label={label} aria-current={activeId === item.id ? 'page' : undefined} onClick={navigate}><span>{label}</span></a>;
        })}
        <span className="yhf-active-line" aria-hidden="true" style={indicator ? { ...indicator, opacity: 1 } : { opacity: 0 }} />
      </nav>

      <div className="yhf-actions">
        <LanguageSwitcher language={language} onLanguageChange={onLanguageChange} onOpen={() => setMobileOpen(false)} />
        <button ref={mobileRef} type="button" className="yhf-mobile-toggle" aria-controls="yhf-main-nav" aria-expanded={mobileOpen} aria-label={zh ? (mobileOpen ? '关闭导航' : '打开导航') : (mobileOpen ? 'Close navigation' : 'Open navigation')} onClick={() => setMobileOpen(!mobileOpen)}><Icon name={mobileOpen ? 'close' : 'menu'} /></button>
      </div>
    </header>
  );
}
