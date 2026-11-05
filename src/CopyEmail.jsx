import { useEffect, useRef, useState } from 'react';
import './CopyEmail.css';

export default function CopyEmail({ email, language = 'en' }) {
  const [status, setStatus] = useState('');
  const timer = useRef();
  const address = useRef(null);
  const zh = language === 'zh-Hans';
  const copied = status === 'copied';
  const label = copied ? (zh ? '已复制' : 'Copied!') : (zh ? '复制邮箱' : 'Copy email');

  useEffect(() => () => clearTimeout(timer.current), []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
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

  return (
    <span className="yhf-copy-email">
      <button type="button" className="yhf-copy-trigger" onClick={copy} data-copied={copied ? '' : undefined} aria-label={zh ? `复制邮箱 ${email}` : `Copy email ${email}`}>
        <span ref={address} className="yhf-copy-address">{email}</span>
        <span className="yhf-copy-icon" aria-hidden="true">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            {copied ? <path d="m5 12 4 4L19 6" /> : <><rect x="8" y="8" width="12" height="12" rx="2" /><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" /></>}
          </svg>
        </span>
        <span className="yhf-copy-tip" aria-hidden="true">{label}</span>
      </button>
      <span className={status === 'failed' ? 'yhf-copy-error' : 'yhf-copy-status'} role="status">
        {copied ? (zh ? '邮箱已复制' : 'Email copied') : status === 'failed' ? (zh ? '请手动复制所选邮箱。' : 'Copy the selected address manually.') : ''}
      </span>
    </span>
  );
}
