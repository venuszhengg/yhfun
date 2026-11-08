export default function RouteLoading({ language = 'en', form = false }) {
  const message = language === 'zh-Hans'
    ? form ? '正在加载表单…' : '正在加载页面…'
    : form ? 'Loading contact form…' : 'Loading page…'

  return <div className="route-loading" role="status" aria-live="polite" aria-busy="true">
    <span className="route-loading-mark" aria-hidden="true">Y</span>
    <span>{message}</span>
  </div>
}
