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
    newEnquiry: 'Send a new message',
    notConfigured: 'Website submission is not configured. Please try again later or contact us directly.',
    failed: 'We couldn’t send your enquiry. Your details are still here; please check your connection and try again.',
    successTitle: (name) => `Thanks, ${name}.`,
    successMessage: 'Your enquiry has been received.',
    successNext: () => 'We’ll review your message and follow up by email.',
    successEmailLabel: 'Replying to',
    successEnquiryLabel: 'Enquiry type',
    successAnnouncement: 'Your enquiry has been received successfully.',
  },
  'zh-Hans': {
    title: '联系我们',
    introduction: '告诉我们您在考虑什么，我们会通过电子邮件回复。',
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
    successNext: () => '我们会查看您的留言，并通过电子邮件回复。',
    successEmailLabel: '回复至',
    successEnquiryLabel: '咨询类型',
    successAnnouncement: '您的咨询已成功提交。',
  },
}

function ChevronIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
}

function ShieldIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12,23.949c-.077,0-.153-.018-.224-.053l-.425-.212c-2.194-1.098-9.354-5.191-9.354-11.8l.002-5.346c0-1.943,1.239-3.66,3.084-4.271L11.843,.025c.102-.034,.213-.034,.314,0l6.759,2.241c1.845,.612,3.084,2.329,3.084,4.271l-.003,5.346c0,7.498-7.172,10.967-9.37,11.852l-.441,.177c-.06,.024-.124,.036-.187,.036ZM12,1.027L5.398,3.216c-1.435,.476-2.398,1.811-2.398,3.322l-.002,5.346c0,6.035,6.736,9.874,8.801,10.906l.224,.112,.232-.093c2.051-.825,8.743-4.052,8.743-10.924l.003-5.346c0-1.511-.964-2.846-2.398-3.322L12,1.027Z" /><path d="M10.981,15c-.641,0-1.282-.244-1.77-.732l-3.056-2.905c-.2-.19-.208-.507-.018-.707,.19-.199,.506-.208,.707-.018l3.065,2.914c.594,.593,1.545,.594,2.13,.009l5.612-5.42c.2-.191,.517-.185,.707,.013,.192,.198,.187,.515-.012,.707l-5.607,5.414c-.483,.483-1.121,.726-1.759,.726Z" /></svg>
}

function CheckIcon() {
  return <svg className="contact-check-icon" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M23.855,6.353l-13.883,14c-.419,.418-.973,.647-1.562,.647s-1.144-.229-1.561-.646L.152,13.859c-.198-.192-.203-.509-.012-.707,.194-.198,.51-.203,.707-.012l6.703,6.5c.469,.467,1.256,.461,1.713,.006L23.145,5.647c.195-.194,.511-.197,.708-.003,.195,.195,.197,.512,.003,.708Z" /></svg>
}

function ThanksIcon() {
  return <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="m7.982,19.299c-.061.223-.262.369-.482.369C3,18.5,0,14.502,0,10,0,4.486,4.486,0,10,0c4.949,0,9.103,3.542,9.876,8.422.043.272-.144.529-.416.572-.268.041-.528-.142-.572-.416-.695-4.391-4.434-7.578-8.888-7.578C5.037,1,1,5.038,1,10c0,4.052,2.727,7.623,6.631,8.686.267.072.424.348.352.613Zm16.018-1.799v4c0,1.379-1.121,2.5-2.5,2.5h-6.879c-1.9,0-3.55-1.353-3.923-3.216l-.63-2.154c-.187-.926.04-1.833.612-2.531h0c.572-.698,1.418-1.099,2.32-1.099h3.183l-.58-3.265c-.008-.065-.019-.556-.007-.598.121-.444.402-.794.792-.985.393-.193.848-.199,1.28-.02.255.106.503.368.682.719l2.193,4.148h.956c1.379,0,2.5,1.121,2.5,2.5Zm-3.958-1.637c-.159-.092-.292-.226-.382-.395l-2.197-4.155c-.103-.203-.196-.266-.197-.266-.143-.059-.305-.061-.438.003-.11.054-.195.154-.246.285l.014.291.572,3.2c.053.291-.026.589-.217.816-.193.229-.472.358-.768.358h-3.183c-.602,0-1.165.267-1.547.732s-.533,1.071-.415,1.66l.63,2.154c.289,1.438,1.527,2.453,2.952,2.453h5.382l.039-7.137Zm2.958,1.637c0-.827-.673-1.5-1.5-1.5h-.459l-.038,7h.497c.827,0,1.5-.673,1.5-1.5v-4Zm-7.955-10c.196-.194.198-.511.004-.707-.193-.197-.51-.198-.707-.004l-4.34,4.294c-.559.553-1.466.552-2.022,0l-2.128-2.103c-.197-.195-.514-.191-.707.004-.194.197-.192.513.004.707l2.128,2.103c.473.467,1.093.701,1.714.701s1.242-.234,1.715-.702l4.34-4.294Z" /></svg>
}

function EnquiryIcon() {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M23.149,.854c-.719-.719-1.729-1.007-2.708-.769L4.219,4.309C2.139,4.596,.532,6.108,.125,8.16c-.31,1.56,.224,3.209,1.439,4.424l1.437,1.354v4.562c0,.686,.278,1.308,.727,1.76,.002,.002,.003,.005,.005,.008s.005,.003,.008,.005c.452,.449,1.074,.727,1.76,.727h4.574l1.381,1.476c.982,.982,2.301,1.521,3.603,1.521,.466,0,.93-.069,1.375-.211,1.784-.569,3.044-2.046,3.279-3.799L23.91,3.6c.244-.999-.04-2.024-.76-2.745ZM2.26,11.866c-.967-.968-1.399-2.28-1.155-3.512,.323-1.627,1.599-2.826,3.309-3.066L20.686,1.056c.144-.035,.29-.052,.434-.052,.321,0,.633,.093,.915,.255L4.15,19.143c-.094-.196-.15-.412-.15-.643v-4.778c0-.138-.057-.27-.157-.364l-1.583-1.492ZM22.939,3.357l-4.208,16.438c-.193,1.423-1.19,2.587-2.603,3.037-1.339,.426-2.896,.008-3.956-1.052l-1.518-1.622c-.095-.101-.227-.158-.365-.158H5.5c-.231,0-.447-.057-.643-.15L22.746,1.961c.238,.416,.312,.912,.193,1.396Z" /></svg>
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
      setSubmittedEnquiry({
        name: values.name.trim(),
        email: values.email.trim(),
        enquiryType: values.enquiryType,
      })
      setSubmissionState('sent')
      setStatusMessage(copy.successAnnouncement)
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
      <form id="contact-form" tabIndex={-1} className="contact-form" noValidate onSubmit={validateAndSubmit} aria-busy={busy}>
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
            <span className="contact-success-icon" aria-hidden="true"><ThanksIcon /></span>
            <h2 id={`${id}-success-title`}>{copy.successTitle(submittedEnquiry.name)}</h2>
          </div>
          <div className="contact-success-next">
            <p>{copy.successMessage}</p>
            <p>{copy.successNext()}</p>
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
                <input ref={(element) => { fieldRefs.current.phone = element }} id={`${id}-phone`} className="contact-field" name="phone" type="tel" autoComplete="tel" placeholder={copy.phonePlaceholder} maxLength={40} value={values.phone} disabled={locked} aria-describedby={`${id}-phone-error`} aria-invalid={errors.phone ? 'true' : undefined} onChange={(event) => updateField('phone', event.target.value)} />
                <label htmlFor={`${id}-phone`}>{copy.phone} <span>{copy.optional}</span></label>
              </div>
            </div>
            <p className="contact-field-error" id={`${id}-phone-error`} aria-live="polite">{errors.phone}</p>
          </div>

          <div className="contact-full contact-floating-field contact-message-field contact-field-icon contact-field-icon--message">
            <textarea ref={(element) => { fieldRefs.current.message = element }} id={`${id}-message`} className="contact-field" name="message" rows={4} placeholder={copy.messagePlaceholder} required maxLength={3000} value={values.message} disabled={locked} aria-describedby={`${id}-message-error`} aria-invalid={errors.message ? 'true' : undefined} onChange={(event) => updateField('message', event.target.value)} onBlur={() => {
              if (values.message.trim() || hasSubmitted) setErrors((current) => ({ ...current, message: validateContactField('message', values.message, countryCode, copy) }))
            }} />
            <label htmlFor={`${id}-message`}>{copy.message}</label>
            <p className="contact-field-error" id={`${id}-message-error`} aria-live="polite">{errors.message}</p>
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
            {submissionState === 'sent' ? <CheckIcon /> : <EnquiryIcon />}
            {busy ? copy.sending : submissionState === 'sent' ? copy.sent : copy.send}
          </ActionButton>
          {complete && <ActionButton className="contact-new-enquiry" variant="solid" tone="amber" type="button" onClick={startNewEnquiry}>{copy.newEnquiry}</ActionButton>}
        </div>

        {statusMessage && !complete && <p className="contact-form-status" role="alert">{statusMessage}</p>}
      </form>
    </section>
  )
}
