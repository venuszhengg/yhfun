import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { parsePhoneNumberFromString } from 'libphonenumber-js/max'
import ActionButton from './ActionButton.jsx'
import { createCountryOptions, filterCountryOptions, getInitialCountry } from './contact/countries.js'
import { ENQUIRY_TYPES, validateContactField, validateContactForm } from './contact/validation.js'
import './ContactForm.css'

const COPY = {
  en: {
    title: 'Get in touch',
    introduction: 'Tell us what’s on your mind. We’ll reply by email.',
    requiredNote: 'All fields are required unless marked optional.',
    enquiryLabel: 'Enquiry type',
    enquiryOptions: ENQUIRY_TYPES,
    enquiryGroup: 'Enquiry types',
    chooseEnquiry: 'Choose an enquiry type.',
    name: 'Your name',
    namePlaceholder: 'e.g. Alex Murphy',
    email: 'Email address',
    emailPlaceholder: 'name@example.com',
    phone: 'Phone number',
    phonePlaceholder: 'e.g. 87 123 4567',
    optional: '· Optional',
    message: 'How can we help?',
    messagePlaceholder: 'Tell us what you’re enquiring about, any relevant details, and how we can help.',
    messageHelper: 'A brief description is fine. Include any context that will help us respond.',
    phoneHelper: 'Optional, if you would also like us to have a number to reach you on.',
    errorSummary: 'Please check the following before continuing:',
    nameError: 'Enter your name.',
    emailRequired: 'Enter your email address.',
    emailInvalid: 'Enter an address like name@example.com.',
    phoneInvalid: 'Enter a valid phone number or check the country code.',
    messageError: 'Tell us how we can help.',
    phoneCountryCode: 'Phone country code',
    countrySearch: 'Search countries or dial codes',
    countrySearchPlaceholder: 'Search country or code',
    countryGroup: 'Countries and dial codes',
    noCountries: 'No matching countries.',
    privacyBefore: 'Please read our',
    privacyAfter: 'before sending your message. Don’t include identity documents, bank card details, passwords or confidential client information in your initial enquiry.',
    send: 'Send enquiry',
    sending: 'Sending…',
    sent: 'Sent',
    newEnquiry: 'Start a new enquiry',
    notConfigured: 'Website submission is not configured. Please try again later or contact us directly.',
    failed: 'We couldn’t send your enquiry. Your details are still here; please check your connection and try again.',
    successTitle: (name) => `Thanks, ${name}.`,
    successMessage: 'Your enquiry has been received.',
    successNextTitle: 'What happens next',
    successNext: (email) => `We’ll review your message and follow up by email at ${email}.`,
    successEmailLabel: 'Reply to',
    successEnquiryLabel: 'Enquiry type',
    successAnnouncement: 'Your enquiry has been received successfully.',
    followup: 'After you send your enquiry, we’ll be in touch by email. You can also reach us on WeChat or through the social media accounts listed on this page.',
  },
  'zh-Hans': {
    title: '联系我们',
    introduction: '告诉我们您在考虑什么，我们会通过电子邮件回复。',
    requiredNote: '除标注为可选的项目外，其他项目均为必填。',
    enquiryLabel: '咨询类型',
    enquiryOptions: ['一般咨询', '业务与服务支持'],
    enquiryGroup: '咨询类型',
    chooseEnquiry: '请选择咨询类型。',
    name: '您的姓名',
    namePlaceholder: '例如：张明',
    email: '电子邮箱',
    emailPlaceholder: 'name@example.com',
    phone: '电话号码',
    phonePlaceholder: '例如：87 123 4567',
    optional: '· 可选',
    message: '我们可以如何帮助您？',
    messagePlaceholder: '请告诉我们您想咨询的事项、相关详情，以及您希望我们如何帮助您。',
    messageHelper: '简要说明即可，请提供有助于我们回复的背景信息。',
    phoneHelper: '可选。如果您希望我们也能通过电话联系您，可以填写。',
    errorSummary: '请在继续前检查以下内容：',
    nameError: '请输入您的姓名。',
    emailRequired: '请输入您的电子邮箱。',
    emailInvalid: '请输入有效的电子邮箱地址。',
    phoneInvalid: '请输入有效的电话号码，或检查国家/地区代码。',
    messageError: '请告诉我们我们可以如何帮助您。',
    phoneCountryCode: '电话国家/地区代码',
    countrySearch: '搜索国家/地区或区号',
    countrySearchPlaceholder: '搜索国家/地区或区号',
    countryGroup: '国家/地区和电话区号',
    noCountries: '没有找到匹配的国家/地区。',
    privacyBefore: '发送消息前，请阅读我们的',
    privacyAfter: '。请勿在首次咨询中填写身份证件、银行卡信息、密码或客户机密信息。',
    send: '发送咨询',
    sending: '正在发送…',
    sent: '已发送',
    newEnquiry: '开始新的咨询',
    notConfigured: '网站咨询提交功能尚未配置。请稍后重试或直接联系我们。',
    failed: '未能发送您的咨询。已保留填写内容；请检查网络连接后重试。',
    successTitle: (name) => `谢谢您，${name}。`,
    successMessage: '我们已收到您的咨询。',
    successNextTitle: '接下来',
    successNext: (email) => `我们会查看您的留言，并通过电子邮件回复至 ${email}。`,
    successEmailLabel: '回复至',
    successEnquiryLabel: '咨询类型',
    successAnnouncement: '您的咨询已成功提交。',
    followup: '发送咨询后，我们会通过电子邮件与您联系。您也可以通过微信或本页列出的社交媒体账号联系我们。',
  },
}

function ChevronIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
}

function ShieldIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" /><path d="m9 12 2 2 4-4" /></svg>
}

function CheckIcon() {
  return <svg className="contact-check-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m5 12 4 4L19 6" /></svg>
}

export default function ContactForm({ href, language = 'en' }) {
  const copy = COPY[language] ?? COPY.en
  const id = useId()
  const countryOptions = useMemo(() => createCountryOptions(language === 'zh-Hans' ? 'zh-Hans' : 'en-GB'), [language])
  const initialCountry = useMemo(() => getInitialCountry(countryOptions.map(({ code }) => code)), [countryOptions])
  const [values, setValues] = useState({ enquiryType: '', name: '', email: '', phone: '', message: '' })
  const [countryCode, setCountryCode] = useState(initialCountry)
  const [errors, setErrors] = useState({})
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [submissionState, setSubmissionState] = useState('idle')
  const [statusMessage, setStatusMessage] = useState('')
  const [submittedEnquiry, setSubmittedEnquiry] = useState(null)
  const [enquiryOpen, setEnquiryOpen] = useState(false)
  const [countryOpen, setCountryOpen] = useState(false)
  const [countryQuery, setCountryQuery] = useState('')
  const [activeCountry, setActiveCountry] = useState(countryCode)
  const enquiryRef = useRef(null)
  const enquiryTriggerRef = useRef(null)
  const enquiryOptionRefs = useRef([])
  const countryPickerRef = useRef(null)
  const countryTriggerRef = useRef(null)
  const countrySearchRef = useRef(null)
  const countryOptionRefs = useRef([])
  const fieldRefs = useRef({})
  const errorSummaryRef = useRef(null)
  const successMessageRef = useRef(null)
  const submissionLockRef = useRef(false)

  const filteredCountries = useMemo(
    () => filterCountryOptions(countryOptions, countryQuery),
    [countryOptions, countryQuery],
  )

  const selectedCountry = countryOptions.find(({ code }) => code === countryCode) ?? countryOptions[0]

  useEffect(() => {
    if (enquiryOpen) {
      const selectedIndex = ENQUIRY_TYPES.indexOf(values.enquiryType)
      enquiryOptionRefs.current[selectedIndex < 0 ? 0 : selectedIndex]?.focus()
    }
  }, [enquiryOpen, values.enquiryType])

  useEffect(() => {
    if (countryOpen) countrySearchRef.current?.focus()
  }, [countryOpen])

  useEffect(() => {
    if (!enquiryOpen && !countryOpen) return undefined
    function dismissOutside(event) {
      if (!enquiryRef.current?.contains(event.target)) setEnquiryOpen(false)
      if (!countryPickerRef.current?.contains(event.target)) setCountryOpen(false)
    }
    document.addEventListener('pointerdown', dismissOutside)
    return () => document.removeEventListener('pointerdown', dismissOutside)
  }, [enquiryOpen, countryOpen])

  useEffect(() => {
    if (submissionState === 'sent') successMessageRef.current?.focus()
  }, [submissionState])

  function clearSubmissionForEditing() {
    if (submissionState === 'sent') {
      submissionLockRef.current = false
      setSubmissionState('idle')
      setStatusMessage('')
    }
  }

  function updateField(name, value) {
    clearSubmissionForEditing()
    setValues((current) => ({ ...current, [name]: value }))
    let validationCountry = countryCode
    if (name === 'phone' && value.trim().startsWith('+')) {
      const parsed = parsePhoneNumberFromString(value.trim(), { defaultCountry: countryCode, extract: false })
      if (parsed?.isValid() && parsed.country && countryOptions.some(({ code }) => code === parsed.country)) {
        validationCountry = parsed.country
        setCountryCode(parsed.country)
      }
    }
    if (errors[name] && !validateContactField(name, value, validationCountry, copy)) {
      setErrors((current) => ({ ...current, [name]: '' }))
    }
  }

  function chooseEnquiry(type) {
    clearSubmissionForEditing()
    setValues((current) => ({ ...current, enquiryType: type }))
    setErrors((current) => ({ ...current, enquiryType: '' }))
    setEnquiryOpen(false)
    enquiryTriggerRef.current?.focus()
  }

  function selectCountry(code) {
    clearSubmissionForEditing()
    setCountryCode(code)
    setActiveCountry(code)
    setCountryOpen(false)
    setCountryQuery('')
    if (values.phone.trim() && (errors.phone || hasSubmitted)) {
      setErrors((current) => ({ ...current, phone: validateContactField('phone', values.phone, code, copy) }))
    }
    countryTriggerRef.current?.focus()
  }

  function handleEnquiryTriggerKeyDown(event) {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return
    event.preventDefault()
    setEnquiryOpen(true)
    const selectedIndex = ENQUIRY_TYPES.indexOf(values.enquiryType)
    const nextIndex = selectedIndex < 0
      ? (event.key === 'ArrowUp' ? ENQUIRY_TYPES.length - 1 : 0)
      : selectedIndex
    requestAnimationFrame(() => enquiryOptionRefs.current[nextIndex]?.focus())
  }

  function handleEnquiryOptionKeyDown(event, index) {
    const nextIndex = {
      ArrowDown: (index + 1) % ENQUIRY_TYPES.length,
      ArrowUp: (index + ENQUIRY_TYPES.length - 1) % ENQUIRY_TYPES.length,
      Home: 0,
      End: ENQUIRY_TYPES.length - 1,
    }[event.key]
    if (nextIndex === undefined) return
    event.preventDefault()
    enquiryOptionRefs.current[nextIndex]?.focus()
  }

  function handleEnquiryKeyDown(event) {
    if (event.key !== 'Escape' || !enquiryOpen) return
    event.preventDefault()
    event.stopPropagation()
    setEnquiryOpen(false)
    enquiryTriggerRef.current?.focus()
  }

  function handleCountryKeyDown(event) {
    if (event.key === 'Escape' && countryOpen) {
      event.preventDefault()
      event.stopPropagation()
      setCountryOpen(false)
      countryTriggerRef.current?.focus()
      return
    }
    if (!countryOpen || !filteredCountries.length) return
    if (event.target === countrySearchRef.current && event.key === 'ArrowDown') {
      event.preventDefault()
      const option = filteredCountries.find(({ code }) => code === activeCountry) ?? filteredCountries[0]
      countryOptionRefs.current[countryOptions.findIndex(({ code }) => code === option.code)]?.focus()
      return
    }
    if (event.target === countrySearchRef.current && event.key === 'ArrowUp') {
      event.preventDefault()
      const option = filteredCountries[filteredCountries.length - 1]
      countryOptionRefs.current[countryOptions.findIndex(({ code }) => code === option.code)]?.focus()
      return
    }
    const currentCode = event.target.dataset?.countryCode
    const visibleIndex = filteredCountries.findIndex(({ code }) => code === currentCode)
    let nextIndex
    if (event.key === 'ArrowDown') nextIndex = visibleIndex < 0 ? 0 : (visibleIndex + 1) % filteredCountries.length
    if (event.key === 'ArrowUp') nextIndex = visibleIndex < 0 ? filteredCountries.length - 1 : (visibleIndex + filteredCountries.length - 1) % filteredCountries.length
    if (event.key === 'Home') nextIndex = 0
    if (event.key === 'End') nextIndex = filteredCountries.length - 1
    if (nextIndex === undefined) return
    event.preventDefault()
    const option = filteredCountries[nextIndex]
    setActiveCountry(option.code)
    countryOptionRefs.current[countryOptions.findIndex(({ code }) => code === option.code)]?.focus()
  }

  function validateAndSubmit(event) {
    event.preventDefault()
    if (submissionLockRef.current || submissionState !== 'idle') return
    setHasSubmitted(true)
    const nextErrors = validateContactForm(values, countryCode, copy)
    setErrors(nextErrors)
    const firstInvalid = ['enquiryType', 'name', 'email', 'phone', 'message'].find((name) => nextErrors[name])
    if (firstInvalid) {
      requestAnimationFrame(() => errorSummaryRef.current?.focus())
      return
    }

    void submitEnquiry()
  }

  async function submitEnquiry() {
    if (import.meta.env.DEV) {
      // Only local development can simulate success; production needs a configured service.
      submissionLockRef.current = true
      setSubmissionState('sending')
      setStatusMessage('')
      await new Promise((resolve) => window.setTimeout(resolve, 500))
      setSubmittedEnquiry({
        name: values.name.trim(),
        email: values.email.trim(),
        enquiryType: values.enquiryType,
      })
      setSubmissionState('sent')
      setStatusMessage(copy.successAnnouncement)
      return
    }

    const submissionEndpoint = import.meta.env.VITE_CONTACT_FORM_ENDPOINT?.trim()
    if (!submissionEndpoint) {
      setStatusMessage(copy.notConfigured)
      return
    }

    submissionLockRef.current = true
    setSubmissionState('sending')
    setStatusMessage('')
    try {
      const parsedPhone = values.phone.trim()
        ? parsePhoneNumberFromString(values.phone.trim(), { defaultCountry: countryCode, extract: false })
        : undefined
      const response = await fetch(submissionEndpoint, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({
          enquiryType: values.enquiryType,
          name: values.name.trim(),
          email: values.email.trim(),
          phone: parsedPhone?.number ?? '',
          countryCode,
          message: values.message.trim(),
        }),
      })
      if (!response.ok) throw new Error('The submission service returned an unsuccessful response.')
      setSubmissionState('sent')
      setStatusMessage(copy.success(values.email.trim()))
    } catch {
      submissionLockRef.current = false
      setSubmissionState('idle')
      setStatusMessage(copy.failed)
    }
  }

  function startNewEnquiry() {
    setValues({ enquiryType: '', name: '', email: '', phone: '', message: '' })
    setCountryCode(initialCountry)
    setErrors({})
    setHasSubmitted(false)
    submissionLockRef.current = false
    setSubmissionState('idle')
    setStatusMessage('')
    setSubmittedEnquiry(null)
    requestAnimationFrame(() => enquiryTriggerRef.current?.focus())
  }

  const busy = submissionState === 'sending'
  const complete = submissionState === 'sent'
  const locked = busy || complete
  const errorFields = ['enquiryType', 'name', 'email', 'phone', 'message'].filter((name) => errors[name])

  return (
    <section className="contact-form-panel" aria-labelledby={`${id}-title`}>
      <header className="contact-form-heading">
        <h2 id={`${id}-title`}>{copy.title}</h2>
        <p>{copy.introduction}</p>
      </header>
      <form id="contact-form" className="contact-form" noValidate onSubmit={validateAndSubmit} aria-busy={busy}>
        <p className="contact-form-note" hidden={complete}>{copy.requiredNote}</p>
        {errorFields.length > 0 && <div className="contact-error-summary" ref={errorSummaryRef} tabIndex={-1} role="alert">
          <p>{copy.errorSummary}</p>
          <ul>{errorFields.map((name) => <li key={name}><a href={`#${id}-${name}`} onClick={(event) => {
            event.preventDefault()
            if (name === 'enquiryType') enquiryTriggerRef.current?.focus()
            else fieldRefs.current[name]?.focus()
          }}>{errors[name]}</a></li>)}</ul>
        </div>}
        {complete && submittedEnquiry && <section className="contact-success" ref={successMessageRef} tabIndex={-1} role="status" aria-labelledby={`${id}-success-title`}>
          <div className="contact-success-heading">
            <span className="contact-success-icon" aria-hidden="true"><CheckIcon /></span>
            <div>
              <h2 id={`${id}-success-title`}>{copy.successTitle(submittedEnquiry.name)}</h2>
              <p>{copy.successMessage}</p>
            </div>
          </div>
          <div className="contact-success-next">
            <h3>{copy.successNextTitle}</h3>
            <p>{copy.successNext(submittedEnquiry.email)}</p>
          </div>
          <dl className="contact-success-details">
            <div>
              <dt>{copy.successEmailLabel}</dt>
              <dd>{submittedEnquiry.email}</dd>
            </div>
            <div>
              <dt>{copy.successEnquiryLabel}</dt>
              <dd>{copy.enquiryOptions[ENQUIRY_TYPES.indexOf(submittedEnquiry.enquiryType)]}</dd>
            </div>
          </dl>
        </section>}
        <div className="contact-form-grid" hidden={complete}>
          <div className="contact-full contact-enquiry contact-field-icon contact-field-icon--enquiry" ref={enquiryRef} onKeyDown={handleEnquiryKeyDown} onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) setEnquiryOpen(false)
          }}>
            <button
              ref={enquiryTriggerRef}
              id={`${id}-enquiryType`}
              type="button"
              className={`contact-field contact-picker-trigger${values.enquiryType ? ' has-value' : ''}`}
              aria-expanded={enquiryOpen}
              aria-haspopup="listbox"
              aria-controls={`${id}-enquiry-options`}
              aria-describedby={errors.enquiryType ? `${id}-enquiry-error` : undefined}
              aria-label={values.enquiryType ? `${copy.enquiryLabel}: ${copy.enquiryOptions[ENQUIRY_TYPES.indexOf(values.enquiryType)]}` : copy.enquiryLabel}
              aria-required="true"
              aria-invalid={errors.enquiryType ? 'true' : undefined}
              disabled={locked}
              onClick={() => setEnquiryOpen((open) => !open)}
              onKeyDown={handleEnquiryTriggerKeyDown}
            >
              <span className="contact-picker-copy">
                <span className="contact-picker-label">{copy.enquiryLabel}</span>
                {values.enquiryType && <span className="contact-picker-value">{copy.enquiryOptions[ENQUIRY_TYPES.indexOf(values.enquiryType)]}</span>}
              </span>
              <span className="contact-chevron"><ChevronIcon /></span>
            </button>
            {enquiryOpen && <div id={`${id}-enquiry-options`} className="contact-picker-menu" role="listbox" aria-label={copy.enquiryGroup}>
              {ENQUIRY_TYPES.map((type, index) => (
                <button
                  key={type}
                  ref={(element) => { enquiryOptionRefs.current[index] = element }}
                  type="button"
                  role="option"
                  aria-selected={values.enquiryType === type}
                  tabIndex={-1}
                  disabled={locked}
                  onClick={() => chooseEnquiry(type)}
                  onKeyDown={(event) => handleEnquiryOptionKeyDown(event, index)}
                >
                  <span>{copy.enquiryOptions[index]}</span>
                  <span className="contact-option-check" aria-hidden="true">✓</span>
                </button>
              ))}
            </div>}
            <p className="contact-field-error" id={`${id}-enquiry-error`} aria-live="polite">{errors.enquiryType}</p>
          </div>

          <div className="contact-floating-field contact-field-icon contact-field-icon--name">
            <input ref={(element) => { fieldRefs.current.name = element }} id={`${id}-name`} className="contact-field" name="name" autoComplete="name" placeholder={copy.namePlaceholder} required maxLength={100} value={values.name} disabled={locked} aria-describedby={`${id}-name-error`} aria-invalid={errors.name ? 'true' : undefined} onChange={(event) => updateField('name', event.target.value)} onBlur={() => {
              if (values.name.trim() || hasSubmitted) setErrors((current) => ({ ...current, name: validateContactField('name', values.name, countryCode, copy) }))
            }} />
            <label htmlFor={`${id}-name`}>{copy.name}</label>
            <p className="contact-field-error" id={`${id}-name-error`} aria-live="polite">{errors.name}</p>
          </div>

          <div className="contact-floating-field contact-field-icon contact-field-icon--email">
            <input ref={(element) => { fieldRefs.current.email = element }} id={`${id}-email`} className="contact-field" name="email" type="email" autoComplete="email" placeholder={copy.emailPlaceholder} required maxLength={254} value={values.email} disabled={locked} aria-describedby={`${id}-email-error`} aria-invalid={errors.email ? 'true' : undefined} onChange={(event) => updateField('email', event.target.value)} onBlur={() => {
              if (values.email.trim() || hasSubmitted) setErrors((current) => ({ ...current, email: validateContactField('email', values.email, countryCode, copy) }))
            }} />
            <label htmlFor={`${id}-email`}>{copy.email}</label>
            <p className="contact-field-error" id={`${id}-email-error`} aria-live="polite">{errors.email}</p>
          </div>

          <div className="contact-full">
            <div className={`contact-phone${errors.phone ? ' has-error' : ''}`} onKeyDown={handleCountryKeyDown}>
              <div className="contact-country-picker" ref={countryPickerRef} onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) setCountryOpen(false)
              }}>
                <button
                  ref={countryTriggerRef}
                  type="button"
                  className="contact-country-trigger"
                  aria-label={`${copy.phoneCountryCode}: ${selectedCountry.name} +${selectedCountry.callingCode}`}
                  aria-expanded={countryOpen}
                  aria-haspopup="listbox"
                  aria-controls={`${id}-country-options`}
                  disabled={locked}
                  onClick={() => {
                    setActiveCountry(countryCode)
                    setCountryQuery('')
                    setCountryOpen((open) => !open)
                  }}
                  onKeyDown={(event) => {
                    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
                      event.preventDefault()
                      setActiveCountry(countryCode)
                      setCountryQuery('')
                      setCountryOpen(true)
                    }
                  }}
                >
                  <span aria-hidden="true">{selectedCountry.flag} +{selectedCountry.callingCode}</span>
                  <span className="contact-chevron"><ChevronIcon /></span>
                </button>
                {countryOpen && <div className="contact-picker-menu contact-country-menu">
                  <input
                    ref={countrySearchRef}
                    className="contact-country-search"
                    type="search"
                    aria-label={copy.countrySearch}
                    aria-controls={`${id}-country-options`}
                    placeholder={copy.countrySearchPlaceholder}
                    autoComplete="off"
                    value={countryQuery}
                    onChange={(event) => setCountryQuery(event.target.value)}
                  />
                  <div id={`${id}-country-options`} className="contact-country-options" role="listbox" aria-label={copy.countryGroup}>
                    {filteredCountries.map((country) => {
                      const index = countryOptions.findIndex(({ code }) => code === country.code)
                      return <button
                        key={country.code}
                        ref={(element) => { countryOptionRefs.current[index] = element }}
                        type="button"
                        role="option"
                        aria-selected={countryCode === country.code}
                        tabIndex={-1}
                        data-country-code={country.code}
                        onClick={() => selectCountry(country.code)}
                      >
                        <span>{country.flag} {country.name} +{country.callingCode}</span>
                        <span className="contact-option-check" aria-hidden="true">✓</span>
                      </button>
                    })}
                  </div>
                  {!filteredCountries.length && <p className="contact-no-countries" role="status">{copy.noCountries}</p>}
                </div>}
                <input type="hidden" name="countryCode" value={countryCode} />
              </div>
              <div className="contact-floating-field contact-phone-field contact-field-icon contact-field-icon--phone">
                <input ref={(element) => { fieldRefs.current.phone = element }} id={`${id}-phone`} className="contact-field" name="phone" type="tel" autoComplete="tel" placeholder={copy.phonePlaceholder} maxLength={40} value={values.phone} disabled={locked} aria-describedby={`${id}-phone-helper ${id}-phone-error`} aria-invalid={errors.phone ? 'true' : undefined} onChange={(event) => updateField('phone', event.target.value)} />
                <label htmlFor={`${id}-phone`}>{copy.phone} <span>{copy.optional}</span></label>
              </div>
            </div>
            <p className="contact-field-error" id={`${id}-phone-error`} aria-live="polite">{errors.phone}</p>
            <p className="contact-field-helper" id={`${id}-phone-helper`}>{copy.phoneHelper}</p>
          </div>

          <div className="contact-full contact-floating-field contact-message-field contact-field-icon contact-field-icon--message">
            <textarea ref={(element) => { fieldRefs.current.message = element }} id={`${id}-message`} className="contact-field" name="message" rows={4} placeholder={copy.messagePlaceholder} required maxLength={3000} value={values.message} disabled={locked} aria-describedby={`${id}-message-helper ${id}-message-error`} aria-invalid={errors.message ? 'true' : undefined} onChange={(event) => updateField('message', event.target.value)} onBlur={() => {
              if (values.message.trim() || hasSubmitted) setErrors((current) => ({ ...current, message: validateContactField('message', values.message, countryCode, copy) }))
            }} />
            <label htmlFor={`${id}-message`}>{copy.message}</label>
            <p className="contact-field-error" id={`${id}-message-error`} aria-live="polite">{errors.message}</p>
            <p className="contact-field-helper" id={`${id}-message-helper`}>{copy.messageHelper}</p>
          </div>
        </div>

        <div className="contact-privacy" hidden={complete}>
          <span className="contact-privacy-icon"><ShieldIcon /></span>
          <p>{copy.privacyBefore} <a href={href('privacy', language === 'zh-Hans' ? 'en' : undefined)}>Privacy Policy</a> {copy.privacyAfter}</p>
        </div>

        <div className="contact-form-actions">
          <ActionButton
            className="contact-submit"
            variant="solid"
            tone={submissionState === 'sent' ? 'olive' : 'amber'}
            type="submit"
            disabled={locked}
            data-state={submissionState}
          >
            {submissionState === 'sent' && <CheckIcon />}
            {busy ? copy.sending : submissionState === 'sent' ? copy.sent : copy.send}
          </ActionButton>
          {complete && <ActionButton className="contact-new-enquiry" variant="solid" tone="olive" type="button" onClick={startNewEnquiry}>{copy.newEnquiry}</ActionButton>}
        </div>

        {statusMessage && !complete && <p className="contact-form-status" role="alert">{statusMessage}</p>}
        {!complete && <p className="contact-form-followup">{copy.followup}</p>}
      </form>
    </section>
  )
}
