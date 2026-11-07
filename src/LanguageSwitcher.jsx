import { useEffect, useId, useRef, useState } from 'react';
import './LanguageSwitcher.css';

const LANGUAGES = [
  { id: 'en', native: 'English (UK)', short: 'English', flag: '🇬🇧', lang: 'en-GB' },
  { id: 'zh-Hans', native: '普通话', short: '普通话', flag: '🇨🇳', lang: 'zh-Hans' },
];

export default function LanguageSwitcher({ language = 'en', onLanguageChange, placement = 'header', onOpen }) {
  const zh = language === 'zh-Hans';
  const current = LANGUAGES[zh ? 1 : 0];
  const [languageOpen, setLanguageOpen] = useState(false);
  const menuId = useId();
  const languageRef = useRef(null);
  const triggerRef = useRef(null);
  const optionRefs = useRef([]);

  useEffect(() => {
    function dismiss(event) {
      if (!languageRef.current?.contains(event.target)) setLanguageOpen(false);
    }
    document.addEventListener('pointerdown', dismiss);
    return () => document.removeEventListener('pointerdown', dismiss);
  }, []);

  useEffect(() => {
    if (languageOpen) optionRefs.current[zh ? 1 : 0]?.focus();
  }, [languageOpen, zh]);

  function dismissOnEscape(event) {
    if (event.key !== 'Escape' || !languageOpen) return;
    event.stopPropagation();
    setLanguageOpen(false);
    triggerRef.current?.focus();
  }

  return (
    <div className={`yhf-language yhf-language--${placement}`} ref={languageRef} onKeyDown={dismissOnEscape} onBlur={(event) => {
      if (!event.currentTarget.contains(event.relatedTarget)) setLanguageOpen(false);
    }}>
      <button ref={triggerRef} type="button" className="yhf-language-trigger" aria-expanded={languageOpen} aria-controls={menuId} aria-label={zh ? '显示语言：普通话' : 'Display language: English (UK)'} onClick={() => { setLanguageOpen(!languageOpen); onOpen?.(); }} onKeyDown={(event) => {
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') { event.preventDefault(); setLanguageOpen(true); }
      }}>
        <span className="yhf-flag" aria-hidden="true">{current.flag}</span><span lang={current.lang}>{current.short}</span><span className="yhf-chevron"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg></span>
      </button>
      <div id={menuId} className={`yhf-language-menu${languageOpen ? ' is-open' : ''}`} aria-hidden={!languageOpen} inert={!languageOpen}>
        <div className="yhf-menu-heading">{zh ? '显示语言' : 'Display language'}</div>
        <div role="group" aria-label={zh ? '可用语言' : 'Available languages'}>
          {LANGUAGES.map((option, index) => {
            const selected = current.id === option.id;
            return <button key={option.id} ref={(node) => { optionRefs.current[index] = node; }} type="button" tabIndex={languageOpen ? 0 : -1} className="yhf-language-option" aria-pressed={selected} onClick={() => {
              onLanguageChange?.(option.id); setLanguageOpen(false); triggerRef.current?.focus();
            }} onKeyDown={(event) => {
              const next = { ArrowDown: (index + 1) % 2, ArrowUp: (index + 1) % 2, Home: 0, End: 1 }[event.key];
              if (next !== undefined) { event.preventDefault(); optionRefs.current[next]?.focus(); }
            }}>
              <span className="yhf-flag" aria-hidden="true">{option.flag}</span>
              <span className="yhf-language-names"><span lang={option.lang}>{option.native}</span><span className="yhf-language-description">{selected ? (zh ? '当前语言' : 'Current language') : (zh ? '英语（英国）' : 'Mandarin Chinese')}</span></span>
              <span className="yhf-check">{selected && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m5 12 4 4L19 6" /></svg>}</span>
            </button>;
          })}
        </div>
      </div>
    </div>
  );
}
