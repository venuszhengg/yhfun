import { useEffect, useRef, useState } from 'react';
import './LanguageSwitcher.css';

const SLIDE_DURATION = 280;
const LANGUAGES = [
  { id: 'en', text: 'EN', flag: '🇬🇧', lang: 'en-GB', label: 'English', zhLabel: '英语' },
  { id: 'zh-Hans', text: '中文', flag: '🇨🇳', lang: 'zh-Hans', label: 'Simplified Chinese', zhLabel: '简体中文' },
];

export default function LanguageSwitcher({ language = 'en', onLanguageChange, placement = 'header', onOpen }) {
  const [selection, setSelection] = useState({ language, selected: language });
  const timerRef = useRef(null);
  const selected = selection.language === language ? selection.selected : language;
  const zh = language === 'zh-Hans';

  useEffect(() => () => {
    window.clearTimeout(timerRef.current);
  }, [language]);

  function selectLanguage(nextLanguage) {
    if (nextLanguage === selected) return;

    onOpen?.();
    window.clearTimeout(timerRef.current);
    setSelection({ language, selected: nextLanguage });

    // Returning to the current route cancels a pending navigation.
    if (nextLanguage === language) return;

    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      onLanguageChange?.(nextLanguage);
      return;
    }

    timerRef.current = window.setTimeout(() => {
      timerRef.current = null;
      onLanguageChange?.(nextLanguage);
    }, SLIDE_DURATION);
  }

  return (
    <div
      className={`yhf-language yhf-language--${placement}`}
      role="group"
      aria-label={zh ? '选择语言' : 'Choose language'}
      data-selected={selected}
    >
      <span className="yhf-language-indicator" aria-hidden="true" />
      {LANGUAGES.map((option) => (
        <button
          key={option.id}
          type="button"
          className="yhf-language-choice"
          aria-label={zh ? option.zhLabel : option.label}
          aria-pressed={selected === option.id}
          lang={option.lang}
          onClick={() => selectLanguage(option.id)}
        >
          <span className="yhf-language-flag" aria-hidden="true">{option.flag}</span>
          <span>{option.text}</span>
        </button>
      ))}
    </div>
  );
}
