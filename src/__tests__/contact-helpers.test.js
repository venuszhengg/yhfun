import { describe, expect, it } from 'vitest'
import { createCountryOptions, filterCountryOptions, getInitialCountry } from '../contact/countries.js'
import { validateContactField, validateContactForm } from '../contact/validation.js'

const copy = {
  chooseEnquiry: 'Choose an enquiry type.',
  nameError: 'Enter your name.',
  emailRequired: 'Enter your email address.',
  emailInvalid: 'Enter an address like name@example.com.',
  phoneInvalid: 'Enter a valid phone number or check the country code.',
  messageError: 'Tell us how we can help.',
}

describe('contact validation helpers', () => {
  it('validates required fields and email format without changing field values', () => {
    const values = { enquiryType: '', name: ' ', email: 'invalid', phone: '', message: '' }

    expect(validateContactForm(values, 'IE', copy)).toEqual({
      enquiryType: copy.chooseEnquiry,
      name: copy.nameError,
      email: copy.emailInvalid,
      phone: '',
      message: copy.messageError,
    })
    expect(values).toEqual({ enquiryType: '', name: ' ', email: 'invalid', phone: '', message: '' })
  })

  it('keeps phone numbers optional and rejects invalid provided numbers', () => {
    expect(validateContactField('phone', '', 'IE', copy)).toBe('')
    expect(validateContactField('phone', '123', 'IE', copy)).toBe(copy.phoneInvalid)
  })
})

describe('contact country helpers', () => {
  it('uses the first supported locale region and falls back to Ireland', () => {
    expect(getInitialCountry(['IE', 'US'], ['en-GB', 'en-US'])).toBe('US')
    expect(getInitialCountry(['IE', 'US'], ['invalid_locale'])).toBe('IE')
  })

  it('creates localized country options and filters by name, code, or calling code', () => {
    const countries = createCountryOptions('en-GB')

    expect(countries.find(({ code }) => code === 'IE')).toMatchObject({
      code: 'IE',
      name: 'Ireland',
      callingCode: '353',
      flag: '🇮🇪',
    })
    expect(filterCountryOptions(countries, '+353').map(({ code }) => code)).toContain('IE')
    expect(filterCountryOptions(countries, 'ireland').map(({ code }) => code)).toEqual(['IE'])
  })
})
