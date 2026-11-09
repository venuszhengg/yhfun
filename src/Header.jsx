import { useEffect, useRef, useState } from 'react';
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
  const [headerHidden, setHeaderHidden] = useState(false);
  const [headerScrolled, setHeaderScrolled] = useState(false);
  const headerRef = useRef(null);
  const mobileRef = useRef(null);

  useEffect(() => {
    const dismiss = (event) => {
      if (!headerRef.current?.contains(event.target)) setMobileOpen(false);
    };
    document.addEventListener('pointerdown', dismiss);
    return () => document.removeEventListener('pointerdown', dismiss);
  }, []);

  useEffect(() => {
    let previousY = window.scrollY;
    let direction = 0;
    let accumulated = 0;
    let frame = 0;

    const updateVisibility = () => {
      frame = 0;
      const currentY = window.scrollY;
      const delta = currentY - previousY;
      previousY = currentY;

      if (currentY < 24) {
        direction = 0;
        accumulated = 0;
        setHeaderHidden(false);
        setHeaderScrolled(false);
        return;
      }

      if (mobileOpen || headerRef.current?.contains(document.activeElement)) {
        direction = 0;
        accumulated = 0;
        setHeaderHidden(false);
        setHeaderScrolled(true);
        return;
      }

      const nextDirection = Math.sign(delta);
      if (nextDirection && nextDirection !== direction) {
        direction = nextDirection;
        accumulated = delta;
      } else {
        accumulated += delta;
      }

      if (direction > 0 && accumulated > 12) {
        setHeaderHidden(true);
        setHeaderScrolled(false);
      }
      if (direction < 0 && accumulated < -12) {
        setHeaderHidden(false);
        setHeaderScrolled(true);
      }
    };

    const scheduleVisibilityUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(updateVisibility);
    };

    window.addEventListener('scroll', scheduleVisibilityUpdate, { passive: true });
    return () => {
      window.removeEventListener('scroll', scheduleVisibilityUpdate);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [mobileOpen]);

  const navigate = () => setMobileOpen(false);

  return (
    <header className={`yhf-header${headerHidden ? ' is-hidden' : ''}${headerScrolled ? ' is-scrolled' : ''}${mobileOpen ? ' is-menu-open' : ''}`} ref={headerRef} onFocusCapture={() => {
      setHeaderHidden(false);
      setHeaderScrolled(window.scrollY >= 24);
    }} onBlur={(event) => {
      if (!event.currentTarget.contains(event.relatedTarget)) setMobileOpen(false);
    }} onKeyDown={(event) => {
      if (event.key !== 'Escape') return;
      if (mobileOpen) { setMobileOpen(false); mobileRef.current?.focus(); }
    }}>
      <a className="yhf-logo" href={homeHref} aria-label={zh ? 'Y. H. FUN 首页' : 'Y. H. FUN home'} onClick={navigate}>Y. H. FUN</a>

      <nav id="yhf-main-nav" className={`yhf-nav${mobileOpen ? ' is-open' : ''}`} aria-label={zh ? '主导航' : 'Main navigation'}>
        {items.map((item) => {
          const label = item[zh ? 'zh-Hans' : 'en'];
          return <a key={item.id} href={item.href} className="yhf-nav-link" data-label={label} aria-current={activeId === item.id ? 'page' : undefined} onClick={navigate}><span>{label}</span></a>;
        })}
        <div className="yhf-nav-language">
          <LanguageSwitcher language={language} onLanguageChange={onLanguageChange} />
        </div>
      </nav>

      <div className="yhf-actions">
        <div className="yhf-desktop-language">
          <LanguageSwitcher language={language} onLanguageChange={onLanguageChange} />
        </div>
        <button ref={mobileRef} type="button" className="yhf-mobile-toggle" aria-controls="yhf-main-nav" aria-expanded={mobileOpen} aria-label={zh ? (mobileOpen ? '关闭导航' : '打开导航') : (mobileOpen ? 'Close navigation' : 'Open navigation')} onClick={() => setMobileOpen(!mobileOpen)}><Icon name={mobileOpen ? 'close' : 'menu'} /></button>
      </div>
    </header>
  );
}
