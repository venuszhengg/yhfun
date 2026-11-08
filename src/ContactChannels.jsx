import { useEffect, useRef, useState } from 'react';
import CopyEmail from './CopyEmail.jsx';
import CopyText from './CopyText.jsx';
import ActionButton from './ActionButton.jsx';
import { SOCIAL_CHANNELS } from './socialChannels.js';
import './ContactChannels.css';

const EMAILS = [
  { id: 'general', email: 'hello@yhfunhq.com' },
  { id: 'business', email: 'info@yhfunhq.com' },
];

function WeChatDialog({ id, onClose, labels }) {
  const dialogRef = useRef(null);
  const closeRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    dialog.showModal();
    closeRef.current.focus();
    return () => {
      if (dialog.open) dialog.close();
    };
  }, []);

  return (
    <dialog ref={dialogRef} id={id} className="yhfc-qr-dialog" aria-labelledby="yhfc-qr-heading" onCancel={(event) => { event.preventDefault(); onClose(); }}>
      <div className="yhfc-dialog-heading">
        <span id="yhfc-qr-heading">{labels.wechatHeading}</span>
        <button ref={closeRef} type="button" onClick={onClose} aria-label={labels.closeQr} className="yhfc-close">×</button>
      </div>
      <p className="yhfc-qr-description">{labels.qrDescription}</p>
      <img className="yhfc-qr-image" src="/images/contact/333.JPG" alt={labels.qrAlt} loading="lazy" />
      <div className="yhfc-qr-footer">
        <CopyText
          value="YShouyishansi"
          display="YShouyishansi"
          className="yhfc-social-copy"
          copyLabel={labels.copyId}
          copiedLabel={labels.copied}
          copiedStatus={labels.wechatCopied}
          failureMessage={labels.copyFailure}
          ariaLabel={`${labels.copyId}: YShouyishansi`}
          interactiveTooltip
        />
      </div>
    </dialog>
  );
}

const COPY = {
  en: {
    general: 'GENERAL ENQUIRIES',
    business: 'BUSINESS AND SERVICES SUPPORT',
    social: 'SOCIAL',
    openEmail: 'Open email app',
    viewQr: 'Scan QR',
    viewQrLabel: 'View WeChat QR code',
    wechatHeading: 'Connect on WeChat',
    closeQr: 'Close QR code',
    qrDescription: 'Scan with WeChat or copy our ID.',
    qrAlt: 'Y.H.FUN WeChat contact QR code',
    copyId: 'Copy ID',
    copied: 'Copied!',
    copyFailure: 'Copy this value manually:',
    wechatCopied: 'WeChat ID copied',
    rednoteCopied: 'RedNote ID copied',
    youtubeCopied: 'YouTube handle copied',
    openRednote: 'Open RedNote',
    visitChannel: 'Visit channel',
  },
  'zh-Hans': {
    general: '一般咨询',
    business: '业务与服务支持',
    social: '社交媒体',
    openEmail: '打开邮件应用',
    viewQr: '查看二维码',
    viewQrLabel: '查看微信二维码',
    wechatHeading: '通过微信联系',
    closeQr: '关闭二维码',
    qrDescription: '使用微信扫描二维码或复制我们的微信号。',
    qrAlt: 'Y.H.FUN 微信联系二维码',
    copyId: '复制微信号',
    copied: '已复制',
    copyFailure: '请手动复制此账号：',
    wechatCopied: '微信号已复制',
    rednoteCopied: '小红书账号已复制',
    youtubeCopied: 'YouTube 账号已复制',
    openRednote: '打开小红书',
    visitChannel: '访问频道',
  },
};

export default function ContactChannels({ language = 'en' }) {
  const [qrOpen, setQrOpen] = useState(false);
  const qrTriggerRef = useRef(null);
  const labels = COPY[language] || COPY.en;
  const zh = language === 'zh-Hans';

  useEffect(() => {
    if (!qrOpen) qrTriggerRef.current?.focus();
  }, [qrOpen]);

  function closeDialog() {
    setQrOpen(false);
  }

  return (
    <aside className="yhfc-contact-channels" aria-label={zh ? '联系信息和社交媒体' : 'Contact information and social channels'}>
      {EMAILS.map(({ id, email }) => {
        return (
          <section className="yhfc-email-group" key={id}>
            <h3 className="yhfc-heading">{labels[id]}</h3>
            <div className="yhfc-email-row">
              <CopyEmail email={email} language={language} interactiveTooltip />
              <ActionButton href={`mailto:${email}`} tone="olive" className="yhfc-contact-action" aria-label={`${labels.openEmail}: ${email}`}>
                {labels.openEmail}
              </ActionButton>
            </div>
          </section>
        );
      })}

      <section className="yhfc-social-group" id="contact-social">
        <h3 className="yhfc-heading">{labels.social}</h3>
        <div className="yhfc-social-list">
          {SOCIAL_CHANNELS.map((channel) => (
              <div className="yhfc-social-row" key={channel.id}>
                <img className="yhfc-social-icon" src={channel.icon} alt="" aria-hidden="true" />
                <div className="yhfc-social-details">
                  <CopyText
                    value={channel.copyValue}
                    display={channel.handle}
                    prefix={channel.name}
                    className="yhfc-social-copy"
                    copyLabel={zh ? '复制账号' : channel.copyLabel}
                    copiedLabel={labels.copied}
                    copiedStatus={zh ? labels[`${channel.id}Copied`] : channel.copiedStatus}
                    failureMessage={labels.copyFailure}
                    ariaLabel={`${zh ? '复制' : channel.copyLabel} ${channel.name}: ${channel.handle}`}
                    interactiveTooltip
                  />
                {channel.id === 'wechat' ? (
                  <>
                    <ActionButton
                      tone="olive"
                      className="yhfc-contact-action"
                      onClick={(event) => {
                        qrTriggerRef.current = event.currentTarget;
                        setQrOpen(true);
                      }}
                      aria-haspopup="dialog"
                      aria-expanded={qrOpen}
                      aria-controls="yhfc-wechat-dialog"
                      aria-label={labels.viewQrLabel}
                    >
                      {labels.viewQr}
                    </ActionButton>
                    {qrOpen && <WeChatDialog id="yhfc-wechat-dialog" onClose={closeDialog} labels={labels} />}
                  </>
                ) : (
                  <ActionButton
                    href={channel.url}
                    tone="olive"
                    className="yhfc-contact-action"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={channel.id === 'rednote' ? labels.openRednote : `${labels.visitChannel}: ${channel.name}`}
                  >
                    {channel.id === 'rednote' ? labels.openRednote : labels.visitChannel}
                  </ActionButton>
                )}
                </div>
              </div>
          ))}
        </div>
      </section>
    </aside>
  );
}
