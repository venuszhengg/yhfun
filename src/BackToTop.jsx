import { useEffect, useState } from 'react';
import ActionButton from './ActionButton.jsx';
import './BackToTop.css';

export default function BackToTop({ label = 'Back to top', showAfterId }) {
  const [isVisible, setIsVisible] = useState(!showAfterId);

  useEffect(() => {
    if (!showAfterId) return undefined;

    let animationFrame;
    const updateVisibility = () => {
      animationFrame = undefined;
      const heading = document.getElementById(showAfterId);
      if (!heading) return;

      const header = document.querySelector('.yhf-header');
      const headerBottom = header
        ? Math.max(0, header.getBoundingClientRect().bottom)
        : 0;
      const nextVisibility = heading.getBoundingClientRect().top <= headerBottom;
      setIsVisible((currentVisibility) => (
        currentVisibility === nextVisibility ? currentVisibility : nextVisibility
      ));
    };
    const scheduleUpdate = () => {
      if (animationFrame === undefined) {
        animationFrame = window.requestAnimationFrame(updateVisibility);
      }
    };

    scheduleUpdate();
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);

    return () => {
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
      if (animationFrame !== undefined) window.cancelAnimationFrame(animationFrame);
    };
  }, [showAfterId]);

  function scrollToTop() {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'instant' : 'smooth' });
  }

  return (
    <ActionButton
      variant="arrow"
      tone="olive"
      className={`yhf-back-to-top${isVisible ? ' is-visible' : ' is-hidden'}`}
      onClick={scrollToTop}
      aria-label={label}
      aria-hidden={!isVisible}
      tabIndex={isVisible ? undefined : -1}
    />
  );
}
