import { parsePhoneNumberFromString } from 'libphonenumber-js/max'

const recipients = {
  'General enquiries': 'hello@yhfunhq.com',
  'Business and service support': 'info@yhfunhq.com',
}
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const maxBodyBytes = 16 * 1024

function hasControlCharacters(value) {
  return [...value].some((character) => character.charCodeAt(0) < 32 || character.charCodeAt(0) === 127)
}

function respond(status, error) {
  return Response.json(error ? { error } : { ok: true }, {
    status,
    headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' },
  })
}

async function readJson(request) {
  if (!request.body) return null
  const reader = request.body.getReader()
  const chunks = []
  let length = 0
  for (;;) {
    const { done, value } = await reader.read()
    if (done) break
    length += value.byteLength
    if (length > maxBodyBytes) {
      await reader.cancel()
      return null
    }
    chunks.push(value)
  }
  const bytes = new Uint8Array(length)
  let offset = 0
  for (const chunk of chunks) {
    bytes.set(chunk, offset)
    offset += chunk.byteLength
  }
  try {
    return JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes))
  } catch (error) {
    if (error instanceof SyntaxError || error instanceof TypeError) return null
    throw error
  }
}

function validate(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) return null
  const { enquiryType, name, email, phone, countryCode, message } = data
  if (typeof enquiryType !== 'string' || !Object.hasOwn(recipients, enquiryType)) return null
  if (typeof name !== 'string' || !name.trim() || name.trim().length > 120 || hasControlCharacters(name)) return null
  if (typeof email !== 'string' || email.length > 254 || hasControlCharacters(email) || !emailPattern.test(email)) return null
  if (typeof phone !== 'string' || phone.length > 20 || typeof countryCode !== 'string' || !/^[A-Z]{2}$/.test(countryCode)) return null
  if (typeof message !== 'string' || !message.trim() || message.trim().length > 5000) return null
  if (phone) {
    const parsed = parsePhoneNumberFromString(phone, { extract: false })
    if (!parsed?.isValid() || parsed.number !== phone || parsed.country !== countryCode) return null
  }
  return { enquiryType, name: name.trim(), email, phone, message: message.trim() }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    if (url.pathname !== '/api/contact') return env.ASSETS.fetch(request)
    if (request.method !== 'POST') return respond(405, 'Method not allowed')
    if (request.headers.get('Origin') !== url.origin) return respond(403, 'Invalid origin')
    if (!/^application\/json(?:\s*;|$)/i.test(request.headers.get('Content-Type') || '')) {
      return respond(415, 'Expected JSON')
    }
    if (!env.CONTACT_EMAIL || !env.CONTACT_RATE_LIMIT || !env.CONTACT_GLOBAL_RATE_LIMIT) {
      console.error('Contact service bindings are not configured')
      return respond(503, 'Service unavailable')
    }
    const ip = request.headers.get('CF-Connecting-IP')
    if (!ip) return respond(503, 'Service unavailable')

    try {
      const [individual, overall] = await Promise.all([
        env.CONTACT_RATE_LIMIT.limit({ key: ip }),
        env.CONTACT_GLOBAL_RATE_LIMIT.limit({ key: 'contact' }),
      ])
      if (!individual.success || !overall.success) return respond(429, 'Please try again later')

      const enquiry = validate(await readJson(request))
      if (!enquiry) return respond(400, 'Invalid enquiry')

      await env.CONTACT_EMAIL.send({
        from: 'hello@yhfunhq.com',
        to: recipients[enquiry.enquiryType],
        replyTo: enquiry.email,
        subject: `Website enquiry: ${enquiry.enquiryType}`,
        text: [
          `Enquiry type: ${enquiry.enquiryType}`,
          `Name: ${enquiry.name}`,
          `Email: ${enquiry.email}`,
          `Phone: ${enquiry.phone || 'Not provided'}`,
          '',
          enquiry.message,
        ].join('\n'),
      })
      return respond(200)
    } catch (error) {
      const code = error && typeof error.code === 'string' && /^E_[A-Z_]+$/.test(error.code) ? error.code : 'UNKNOWN'
      console.error('Contact service could not process an enquiry', code)
      return respond(503, 'Service unavailable')
    }
  },
}
