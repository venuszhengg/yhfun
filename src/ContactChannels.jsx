import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import copyToClipboard from './copyToClipboard.js';
import { SOCIAL_CHANNELS } from './socialChannels.js';
import arrowIcon from './Right.svg';
import mailIcon from './assets/contact-icons/mail.svg';
import copyIcon from './assets/contact-icons/copy.svg';
import checkIcon from './assets/contact-icons/check.svg';
import qrIcon from './assets/contact-icons/qr.svg';
import './ContactChannels.css';

const EMAILS = [
  { id: 'general', email: 'hello@yhfunhq.com' },
  { id: 'business', email: 'info@yhfunhq.com' },
];

const FEEDBACK_MS = 1800;
const HOVER_QUERY = '(hover: hover) and (pointer: fine) and (min-width: 768px)';
const WECHAT_QR_SRC = '/images/contact/333.JPG';
const WECHAT_PANEL_ID = 'yhfc-wechat-panel';
const DISPLAY_NAMES = { rednote: 'Rednote' };
const displayHandle = (channel) => (channel.handle.startsWith('@') ? channel.handle : `@${channel.handle}`);

const COPY = {
  en: {
    general: 'General enquiries',
    business: 'Services support',
    email: 'EMAIL US',
    social: 'SOCIAL',
    copyEmail: 'Copy email address',
    copiedToast: 'Copied to clipboard.',
    copyFailure: 'Could not copy. Please copy it manually:',
    wechatQr: 'WeChat QR code',
    qrDescription: 'Scan the QR code to connect with us on WeChat, or copy our WeChat ID.',
    qrAlt: 'Y.H.FUN WeChat contact QR code',
    copyWechatId: 'Copy WeChat ID',
    copied: 'Copied',
    opensNewTab: 'opens in a new tab',
  },
  'zh-Hans': {
    general: '一般咨询',
    business: '服务支持',
    email: '邮件联系',
    social: '社交媒体',
    copyEmail: '复制邮箱地址',
    copiedToast: '已复制到剪贴板。',
    copyFailure: '复制失败，请手动复制：',
    wechatQr: '微信二维码',
    qrDescription: '使用微信扫描二维码或复制我们的微信号。',
    qrAlt: 'Y.H.FUN 微信联系二维码',
    copyWechatId: '复制微信号',
    copied: '已复制',
    opensNewTab: '在新标签页打开',
  },
};

// Icons are alpha masks so their colour follows the button state.
function Icon({ src, className = '' }) {
  return <span className={`yhfc-icon ${className}`.trim()} style={{ '--yhfc-icon': `url("${src}")` }} aria-hidden="true" />;
}

// Split pill: a label section and an action circle that separate on hover.
// Name and handle are stacked in one clipped window for the upward text flip.
function ContactButton({ as: Tag = 'button', ref, leading, name, handle, action, className = '', ...props }) {
  const extra = Tag === 'button' ? { type: 'button' } : {};
  return (
    <Tag ref={ref} {...extra} {...props} className={`yhfc-btn ${className}`.trim()}>
      <span className="yhfc-btn-body">
        {leading}
        <span className="yhfc-label">
          <span className="yhfc-label-default">{name}</span>
          {handle && <span className="yhfc-label-hover">{handle}</span>}
        </span>
      </span>
      <span className="yhfc-btn-action" aria-hidden="true">
        <span className="yhfc-btn-circle">{action}</span>
      </span>
    </Tag>
  );
}

function useFlash(duration = FEEDBACK_MS) {
  const [active, setActive] = useState(false);
  const timer = useRef();
  useEffect(() => () => clearTimeout(timer.current), []);
  function flash() {
    setActive(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setActive(false), duration);
  }
  return [active, flash];
}

function canHover() {
  return typeof window.matchMedia === 'function' && window.matchMedia(HOVER_QUERY).matches;
}

function WeChatChannel({ channel, labels, onCopy }) {
  const [pinned, setPinned] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [copied, flashCopied] = useFlash();
  const wrapRef = useRef(null);
  const buttonRef = useRef(null);
  const leaveTimer = useRef();
  const open = pinned || hovered;

  useEffect(() => () => clearTimeout(leaveTimer.current), []);

  useEffect(() => {
    function openFromHash() {
      if (window.location.hash !== '#wechat') return;
      setPinned(true);
      wrapRef.current?.scrollIntoView({ block: 'center' });
    }
    openFromHash();
    window.addEventListener('hashchange', openFromHash);
    return () => window.removeEventListener('hashchange', openFromHash);
  }, []);

  useEffect(() => {
    if (!pinned) return undefined;
    function onPointerDown(event) {
      if (canHover() && !wrapRef.current?.contains(event.target)) setPinned(false);
    }
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [pinned]);

  function close() {
    setPinned(false);
    setHovered(false);
  }

  function handlePointerEnter(event) {
    if (event.pointerType !== 'mouse' || !canHover()) return;
    clearTimeout(leaveTimer.current);
    setHovered(true);
  }

  function handlePointerLeave(event) {
    if (event.pointerType !== 'mouse') return;
    clearTimeout(leaveTimer.current);
    leaveTimer.current = setTimeout(() => setHovered(false), 80);
  }

  function handleKeyDown(event) {
    if (event.key === 'Escape' && open) {
      event.stopPropagation();
      close();
      buttonRef.current?.focus();
    }
  }

  async function handleCopy() {
    if (await onCopy(channel.copyValue, { silentSuccess: true })) flashCopied();
  }

  return (
    <div
      ref={wrapRef}
      className="yhfc-wechat"
      data-open={open ? '' : undefined}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onKeyDown={handleKeyDown}
    >
      <ContactButton
        ref={buttonRef}
        className="yhfc-btn--qr"
        leading={<Icon src={channel.icon} className="yhfc-social-icon" />}
        name={channel.name}
        handle={displayHandle(channel)}
        action={<Icon src={qrIcon} />}
        aria-expanded={open}
        aria-controls={WECHAT_PANEL_ID}
        aria-label={`${channel.name} ${displayHandle(channel)}`}
        onClick={() => (pinned ? close() : setPinned(true))}
        data-open={open ? '' : undefined}
      />
      <div id={WECHAT_PANEL_ID} className="yhfc-qr-panel" role="region" aria-label={labels.wechatQr} inert={!open}>
        <div className="yhfc-qr-card">
          <p className="yhfc-qr-description">{labels.qrDescription}</p>
          <img className="yhfc-qr-image" src={WECHAT_QR_SRC} alt={labels.qrAlt} decoding="async" />
          <button type="button" className="yhfc-copy-id" data-copied={copied ? '' : undefined} onClick={handleCopy}>
            <span aria-live="polite">{copied ? labels.copied : labels.copyWechatId}</span>
            <Icon src={copied ? checkIcon : copyIcon} className="yhfc-copy-id-icon" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ContactChannels({ language = 'en' }) {
  const labels = COPY[language] || COPY.en;
  const zh = language === 'zh-Hans';
  const [copiedEmail, setCopiedEmail] = useState('');
  const [toast, setToast] = useState(null);
  const emailTimer = useRef();
  const toastTimer = useRef();

  useEffect(() => () => {
    clearTimeout(emailTimer.current);
    clearTimeout(toastTimer.current);
  }, []);

  function showToast(text, tone = 'success') {
    clearTimeout(toastTimer.current);
    setToast({ text, tone });
    toastTimer.current = setTimeout(() => setToast(null), tone === 'error' ? 4000 : FEEDBACK_MS);
  }

  async function copyValue(value, { silentSuccess = false } = {}) {
    const ok = await copyToClipboard(value);
    if (ok) {
      if (!silentSuccess) showToast(labels.copiedToast);
    } else {
      showToast(`${labels.copyFailure} ${value}`, 'error');
    }
    return ok;
  }

  async function copyEmail(email) {
    if (!(await copyValue(email))) return;
    setCopiedEmail(email);
    clearTimeout(emailTimer.current);
    emailTimer.current = setTimeout(() => setCopiedEmail(''), FEEDBACK_MS);
  }

  return (
    <aside className="yhfc-contact-channels" aria-label={zh ? '联系信息和社交媒体' : 'Contact information and social channels'}>
      <section className="yhfc-email-group">
        <h3 className="yhfc-heading">{labels.email}</h3>
        <div className="yhfc-social-list">
          {EMAILS.map(({ id, email }) => {
            const copied = copiedEmail === email;
            return (
              <ContactButton
                key={id}
                className={`yhfc-btn--email${copied ? ' yhfc-btn--copied' : ''}`}
                leading={<Icon src={mailIcon} className="yhfc-lead-icon" />}
                name={labels[id]}
                handle={email}
                action={<Icon src={copied ? checkIcon : copyIcon} />}
                aria-label={`${labels.copyEmail}: ${email}`}
                onClick={() => copyEmail(email)}
              />
            );
          })}
        </div>
      </section>

      <section className="yhfc-social-group" id="contact-social">
        <h3 className="yhfc-heading">{labels.social}</h3>
        <div className="yhfc-social-list">
          {SOCIAL_CHANNELS.map((channel) => {
            const name = DISPLAY_NAMES[channel.id] || channel.name;
            if (channel.id === 'wechat') {
              return <WeChatChannel key={channel.id} channel={{ ...channel, name }} labels={labels} onCopy={copyValue} />;
            }
            return (
              <ContactButton
                key={channel.id}
                as="a"
                className="yhfc-btn--link"
                href={channel.url}
                target="_blank"
                rel="noopener noreferrer"
                leading={<Icon src={channel.icon} className="yhfc-social-icon" />}
                name={name}
                handle={displayHandle(channel)}
                action={<Icon src={arrowIcon} className="yhfc-arrow" />}
                aria-label={`${name} ${displayHandle(channel)} (${labels.opensNewTab})`}
              />
            );
          })}
        </div>
      </section>

      {createPortal(
        <div className="yhfc-toast" role="status" aria-live="polite" data-tone={toast?.tone} data-visible={toast ? '' : undefined}>
          {toast?.text}
        </div>,
        document.body,
      )}
    </aside>
  );
}
