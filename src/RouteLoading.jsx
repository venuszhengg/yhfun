export default function RouteLoading({ language = 'en', form = false }) {
  const message = language === 'zh-Hans'
    ? form ? '正在准备表单' : '正在准备页面'
    : form ? 'Preparing contact form' : 'Preparing page'

  return <div className={`route-loading-shell${form ? ' route-loading-shell--form' : ''}`} role="status" aria-label={message} aria-live="polite" aria-busy="true" />
}
