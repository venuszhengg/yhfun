import { useEffect, useRef, useState } from 'react';
import './CopyEmail.css';

export default function CopyText({
  value,
  display = value,
  className = '',
  copyLabel,
  copiedLabel,
  copiedStatus,
  failureMessage,
  ariaLabel,
  interactiveTooltip = false,
  prefix,
}) {
  const [status, setStatus] = useState('');
  const timer = useRef();
  const address = useRef(null);
  const copied = status === 'copied';

  useEffect(() => () => clearTimeout(timer.current), []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setStatus('copied');
    } catch {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(address.current);
      selection?.removeAllRanges();
      selection?.addRange(range);
      setStatus('failed');
    }
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus(''), 3000);
  }

  const icon = (
    <span className="yhf-copy-icon" aria-hidden="true">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        {copied ? <path d="m5 12 4 4L19 6" /> : <><rect x="8" y="8" width="12" height="12" rx="2" /><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" /></>}
      </svg>
    </span>
  );

  return (
    <span className={`yhf-copy-email ${interactiveTooltip ? 'yhf-copy--interactive' : ''} ${className}`.trim()} data-copied={copied ? '' : undefined}>
      <button
        type="button"
        className="yhf-copy-trigger"
        onClick={copy}
        data-copied={copied ? '' : undefined}
        aria-label={ariaLabel}
      >
        {prefix && <span className="yhfc-social-name">{prefix}</span>}
        <span ref={address} className="yhf-copy-address">{display}</span>
        {!interactiveTooltip && icon}
        {!interactiveTooltip && <span className="yhf-copy-tip" aria-hidden="true">{copied ? copiedLabel : copyLabel}</span>}
      </button>
      {interactiveTooltip && (
        <button type="button" className="yhf-copy-tip yhf-copy-tip-action" onClick={copy} aria-label={copied ? copiedStatus : ariaLabel}>
          {icon}<span>{copied ? copiedLabel : copyLabel}</span>
        </button>
      )}
      <span className={status === 'failed' ? 'yhf-copy-error' : 'yhf-copy-status'} role="status">
        {copied ? copiedStatus : status === 'failed' ? <>{failureMessage}{interactiveTooltip && <> {value}</>}</> : ''}
      </span>
    </span>
  );
}
