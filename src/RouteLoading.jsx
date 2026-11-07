export default function RouteLoading({ language = 'en', form = false }) {
  const message = language === 'zh-Hans'
    ? form ? '正在加载表单…' : '正在加载页面…'
    : form ? 'Loading contact form…' : 'Loading page…'

  return <p className="route-loading" role="status" aria-live="polite">{message}</p>
}
