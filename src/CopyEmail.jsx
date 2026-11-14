import CopyText from './CopyText.jsx';

export default function CopyEmail({ email, language = 'en', interactiveTooltip = false }) {
  const zh = language === 'zh-Hans';
  return (
    <CopyText
      value={email}
      display={email}
      copyLabel={zh ? '复制邮箱' : 'Copy email'}
      copiedLabel={zh ? '已复制' : 'Copied!'}
      copiedStatus={zh ? '邮箱已复制' : 'Email copied'}
      failureMessage={zh ? '请手动复制所选邮箱。' : 'Copy the selected address manually.'}
      ariaLabel={zh ? `复制邮箱 ${email}` : `Copy email ${email}`}
      interactiveTooltip={interactiveTooltip}
    />
  );
}
