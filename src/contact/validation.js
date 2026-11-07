import { parsePhoneNumberFromString } from 'libphonenumber-js/max'

export const ENQUIRY_TYPES = ['General enquiries', 'Business and service support']

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateContactField(name, value, countryCode, copy) {
  const trimmed = value.trim()
  if (name === 'name' && !trimmed) return copy.nameError
  if (name === 'email') {
    if (!trimmed) return copy.emailRequired
    if (!EMAIL_PATTERN.test(trimmed)) return copy.emailInvalid
  }
  if (name === 'message' && !trimmed) return copy.messageError
  if (name === 'phone' && trimmed) {
    const number = parsePhoneNumberFromString(trimmed, { defaultCountry: countryCode, extract: false })
    if (!number?.isValid() || number.country !== countryCode) return copy.phoneInvalid
  }
  return ''
}

export function validateContactForm(values, countryCode, copy) {
  return {
    enquiryType: values.enquiryType ? '' : copy.chooseEnquiry,
    name: validateContactField('name', values.name, countryCode, copy),
    email: validateContactField('email', values.email, countryCode, copy),
    phone: validateContactField('phone', values.phone, countryCode, copy),
    message: validateContactField('message', values.message, countryCode, copy),
  }
}
