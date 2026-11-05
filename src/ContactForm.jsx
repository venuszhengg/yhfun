import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { getCountries, getCountryCallingCode, parsePhoneNumber } from 'libphonenumber-js/max'
import ActionButton from './ActionButton.jsx'
import './ContactForm.css'

const ENQUIRY_TYPES = ['General enquiries', 'Business and service support']
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const SUBMISSION_ENDPOINT = import.meta.env.VITE_CONTACT_FORM_ENDPOINT?.trim()
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
    email: 'Email address',
    phone: 'Phone number',
    optional: '· Optional',
    message: 'How can we help?',
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
    notConfigured: 'Website submission is not configured, so your enquiry has not been sent. Please try again later or contact us directly.',
    failed: 'We couldn’t send your enquiry. Your details are still here; please check your connection and try again.',
    success: (email) => `Enquiry sent. We’ll reply to ${email}.`,
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
    email: '电子邮箱',
    phone: '电话号码',
    optional: '· 可选',
    message: '我们可以如何帮助您？',
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
    notConfigured: '网站咨询提交功能尚未配置，因此您的信息尚未发送。请稍后重试或直接联系我们。',
    failed: '未能发送您的咨询。已保留填写内容；请检查网络连接后重试。',
    success: (email) => `咨询已发送。我们会回复至 ${email}。`,
    followup: '发送咨询后，我们会通过电子邮件与您联系。您也可以通过微信或本页列出的社交媒体账号联系我们。',
  },
}

function getInitialCountry(countries) {
  for (const locale of navigator.languages?.length ? navigator.languages : [navigator.language]) {
    try {
      const region = new Intl.Locale(locale).region
      if (countries.includes(region)) return region
    } catch {
      // Ignore malformed browser locale entries and try the next one.
    }
  }
  return countries.includes('IE') ? 'IE' : countries[0]
}

function createCountryOptions(language) {
  const displayNames = new Intl.DisplayNames([language], { type: 'region' })
  return getCountries()
    .map((code) => ({
      code,
      name: displayNames.of(code) || code,
      callingCode: getCountryCallingCode(code),
      flag: String.fromCodePoint(...[...code].map((letter) => 127397 + letter.charCodeAt(0))),
    }))
    .sort((left, right) => left.name.localeCompare(right.name))
}

function validateField(name, value, countryCode, copy) {
  const trimmed = value.trim()
  if (name === 'name' && !trimmed) return copy.nameError
  if (name === 'email') {
    if (!trimmed) return copy.emailRequired
    if (!EMAIL_PATTERN.test(trimmed)) return copy.emailInvalid
  }
  if (name === 'message' && !trimmed) return copy.messageError
  if (name === 'phone' && trimmed) {
    const number = parsePhoneNumber(trimmed, { defaultCountry: countryCode, extract: false })
    if (!number?.isValid()) return copy.phoneInvalid
  }
  return ''
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
  const submissionLockRef = useRef(false)

  const filteredCountries = useMemo(() => {
    const query = countryQuery.trim().toLocaleLowerCase()
    if (!query) return countryOptions
    return countryOptions.filter(({ code, name, callingCode }) => (
      `${name} ${code} +${callingCode}`.toLocaleLowerCase().includes(query)
    ))
  }, [countryOptions, countryQuery])

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
    if (errors[name] || hasSubmitted) {
      setErrors((current) => ({ ...current, [name]: validateField(name, value, countryCode, copy) }))
    }
    if (name === 'phone' && value.trim()) {
      const parsed = parsePhoneNumber(value.trim(), { defaultCountry: countryCode, extract: false })
      if (parsed?.isValid() && parsed.country && countryOptions.some(({ code }) => code === parsed.country)) {
        setCountryCode(parsed.country)
      }
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
      setErrors((current) => ({ ...current, phone: validateField('phone', values.phone, code, copy) }))
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
    const nextErrors = {
      enquiryType: values.enquiryType ? '' : copy.chooseEnquiry,
      name: validateField('name', values.name, countryCode, copy),
      email: validateField('email', values.email, countryCode, copy),
      phone: validateField('phone', values.phone, countryCode, copy),
      message: validateField('message', values.message, countryCode, copy),
    }
    setErrors(nextErrors)
    const firstInvalid = ['enquiryType', 'name', 'email', 'phone', 'message'].find((name) => nextErrors[name])
    if (firstInvalid) {
      if (firstInvalid === 'enquiryType') enquiryTriggerRef.current?.focus()
      else fieldRefs.current[firstInvalid]?.focus()
      return
    }

    void submitEnquiry()
  }

  async function submitEnquiry() {
    if (!SUBMISSION_ENDPOINT) {
      setStatusMessage(copy.notConfigured)
      return
    }

    submissionLockRef.current = true
    setSubmissionState('sending')
    setStatusMessage('')
    try {
      const parsedPhone = values.phone.trim()
        ? parsePhoneNumber(values.phone.trim(), { defaultCountry: countryCode, extract: false })
        : undefined
      const response = await fetch(SUBMISSION_ENDPOINT, {
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
    enquiryTriggerRef.current?.focus()
  }

  const busy = submissionState === 'sending'
  const locked = busy || submissionState === 'sent'

  return (
    <section className="contact-form-panel" aria-labelledby={`${id}-title`}>
      <header className="contact-form-heading">
        <h2 id={`${id}-title`}>{copy.title}</h2>
        <p>{copy.introduction}</p>
      </header>
      <form id="contact-form" className="contact-form" noValidate onSubmit={validateAndSubmit} aria-busy={busy}>
        <p className="contact-form-note">{copy.requiredNote}</p>
        <div className="contact-form-grid">
          <div className="contact-full contact-enquiry" ref={enquiryRef} onKeyDown={handleEnquiryKeyDown} onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) setEnquiryOpen(false)
          }}>
            <button
              ref={enquiryTriggerRef}
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

          <div className="contact-floating-field">
            <input ref={(element) => { fieldRefs.current.name = element }} id={`${id}-name`} className="contact-field" name="name" autoComplete="name" placeholder=" " required maxLength={100} value={values.name} disabled={locked} aria-describedby={`${id}-name-error`} aria-invalid={errors.name ? 'true' : undefined} onChange={(event) => updateField('name', event.target.value)} onBlur={() => {
              if (values.name.trim() || hasSubmitted) setErrors((current) => ({ ...current, name: validateField('name', values.name, countryCode, copy) }))
            }} />
            <label htmlFor={`${id}-name`}>{copy.name}</label>
            <p className="contact-field-error" id={`${id}-name-error`} aria-live="polite">{errors.name}</p>
          </div>

          <div className="contact-floating-field">
            <input ref={(element) => { fieldRefs.current.email = element }} id={`${id}-email`} className="contact-field" name="email" type="email" autoComplete="email" placeholder=" " required maxLength={254} value={values.email} disabled={locked} aria-describedby={`${id}-email-error`} aria-invalid={errors.email ? 'true' : undefined} onChange={(event) => updateField('email', event.target.value)} onBlur={() => {
              if (values.email.trim() || hasSubmitted) setErrors((current) => ({ ...current, email: validateField('email', values.email, countryCode, copy) }))
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
              <div className="contact-floating-field contact-phone-field">
                <input ref={(element) => { fieldRefs.current.phone = element }} id={`${id}-phone`} className="contact-field" name="phone" type="tel" autoComplete="tel" placeholder=" " maxLength={40} value={values.phone} disabled={locked} aria-describedby={`${id}-phone-error`} aria-invalid={errors.phone ? 'true' : undefined} onChange={(event) => updateField('phone', event.target.value)} onBlur={() => {
                  if (values.phone.trim() || hasSubmitted) setErrors((current) => ({ ...current, phone: validateField('phone', values.phone, countryCode, copy) }))
                }} />
                <label htmlFor={`${id}-phone`}>{copy.phone} <span>{copy.optional}</span></label>
              </div>
            </div>
            <p className="contact-field-error" id={`${id}-phone-error`} aria-live="polite">{errors.phone}</p>
          </div>

          <div className="contact-full contact-floating-field contact-message-field">
            <textarea ref={(element) => { fieldRefs.current.message = element }} id={`${id}-message`} className="contact-field" name="message" rows={4} placeholder=" " required maxLength={3000} value={values.message} disabled={locked} aria-describedby={`${id}-message-error`} aria-invalid={errors.message ? 'true' : undefined} onChange={(event) => updateField('message', event.target.value)} onBlur={() => {
              if (values.message.trim() || hasSubmitted) setErrors((current) => ({ ...current, message: validateField('message', values.message, countryCode, copy) }))
            }} />
            <label htmlFor={`${id}-message`}>{copy.message}</label>
            <p className="contact-field-error" id={`${id}-message-error`} aria-live="polite">{errors.message}</p>
          </div>
        </div>

        <div className="contact-privacy">
          <span className="contact-privacy-icon"><ShieldIcon /></span>
          <p>{copy.privacyBefore} <a href={href('privacy', language === 'zh-Hans' ? 'en' : undefined)}>Privacy Policy</a> {copy.privacyAfter}</p>
        </div>

        <div className="contact-form-actions">
          <ActionButton
            className="contact-submit"
            variant="split"
            tone={submissionState === 'sent' ? 'olive' : 'amber'}
            type="submit"
            disabled={locked}
            data-state={submissionState}
            arrowContent={submissionState === 'sent' ? <CheckIcon /> : undefined}
          >
            {busy ? copy.sending : submissionState === 'sent' ? copy.sent : copy.send}
          </ActionButton>
          {submissionState === 'sent' && <ActionButton className="contact-new-enquiry" variant="solid" tone="olive" type="button" onClick={startNewEnquiry}>{copy.newEnquiry}</ActionButton>}
        </div>

        {statusMessage && <p className="contact-form-status" role={submissionState === 'sent' ? 'status' : 'alert'}>{statusMessage}</p>}
        <p className="contact-form-followup">{copy.followup}</p>
      </form>
    </section>
  )
}
