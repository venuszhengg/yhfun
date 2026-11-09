import { describe, expect, it, vi } from 'vitest'
import worker from '../../worker/contact.js'

const valid = {
  enquiryType: 'General enquiries',
  name: 'Alex Murphy',
  email: 'alex@example.com',
  phone: '+353871234567',
  countryCode: 'IE',
  message: 'Please contact me.',
}

function environment() {
  return {
    ASSETS: { fetch: vi.fn().mockResolvedValue(new Response('asset')) },
    CONTACT_EMAIL: { send: vi.fn().mockResolvedValue({}) },
    CONTACT_RATE_LIMIT: { limit: vi.fn().mockResolvedValue({ success: true }) },
    CONTACT_GLOBAL_RATE_LIMIT: { limit: vi.fn().mockResolvedValue({ success: true }) },
  }
}

function request(data = valid, options = {}) {
  const { origin = 'https://example.test', contentType = 'application/json', ip = '192.0.2.1', body = JSON.stringify(data) } = options
  const headers = { Origin: origin, 'Content-Type': contentType }
  if (ip) headers['CF-Connecting-IP'] = ip
  return new Request('https://example.test/api/contact', { method: 'POST', headers, body })
}

describe('contact Worker', () => {
  it.each([
    ['General enquiries', 'hello@yhfunhq.com'],
    ['Business and service support', 'info@yhfunhq.com'],
  ])('delivers %s to the correct inbox', async (enquiryType, recipient) => {
    const env = environment()
    const response = await worker.fetch(request({ ...valid, enquiryType }), env)
    expect(response.status).toBe(200)
    expect(env.CONTACT_EMAIL.send).toHaveBeenCalledOnce()
    expect(env.CONTACT_EMAIL.send).toHaveBeenCalledWith(expect.objectContaining({
      from: 'hello@yhfunhq.com',
      to: recipient,
      replyTo: valid.email,
      text: expect.stringContaining(valid.message),
    }))
    expect(response.headers.get('Cache-Control')).toBe('no-store')
  })

  it('passes unrelated routes to static assets', async () => {
    const env = environment()
    const response = await worker.fetch(new Request('https://example.test/?page=about'), env)
    expect(await response.text()).toBe('asset')
    expect(env.CONTACT_EMAIL.send).not.toHaveBeenCalled()
  })

  it('rejects unsupported methods and cross-origin requests', async () => {
    const env = environment()
    expect((await worker.fetch(new Request('https://example.test/api/contact'), env)).status).toBe(405)
    expect((await worker.fetch(request(valid, { origin: 'https://other.test' }), env)).status).toBe(403)
    expect((await worker.fetch(request(valid, { origin: '' }), env)).status).toBe(403)
    expect((await worker.fetch(request(valid, { contentType: 'text/plain' }), env)).status).toBe(415)
    expect(env.CONTACT_EMAIL.send).not.toHaveBeenCalled()
  })

  it.each([
    ['unknown enquiry type', { ...valid, enquiryType: 'Other' }],
    ['prototype property as type', { ...valid, enquiryType: 'toString' }],
    ['missing name', { ...valid, name: ' ' }],
    ['multiline name', { ...valid, name: 'Alex\nB' }],
    ['invalid email', { ...valid, email: 'invalid' }],
    ['control characters in email', { ...valid, email: 'a\0b@example.com' }],
    ['invalid phone', { ...valid, phone: '+123' }],
    ['invalid country', { ...valid, countryCode: 'xxx' }],
    ['empty message', { ...valid, message: '  ' }],
    ['excessive message', { ...valid, message: 'x'.repeat(5001) }],
  ])('rejects %s without sending email', async (_label, payload) => {
    const env = environment()
    expect((await worker.fetch(request(payload), env)).status).toBe(400)
    expect(env.CONTACT_EMAIL.send).not.toHaveBeenCalled()
  })

  it('accepts an absent optional phone', async () => {
    const env = environment()
    expect((await worker.fetch(request({ ...valid, phone: '' }), env)).status).toBe(200)
  })

  it('rejects malformed or oversized bodies', async () => {
    const env = environment()
    expect((await worker.fetch(request(valid, { body: '{' }), env)).status).toBe(400)
    expect((await worker.fetch(request(valid, { body: 'x'.repeat(17000) }), env)).status).toBe(400)
    expect(env.CONTACT_EMAIL.send).not.toHaveBeenCalled()
  })

  it('fails closed without rate limiting or visitor IP', async () => {
    const env = environment()
    expect((await worker.fetch(request(valid, { ip: '' }), env)).status).toBe(503)
    delete env.CONTACT_RATE_LIMIT
    const logger = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect((await worker.fetch(request(), env)).status).toBe(503)
    expect(logger).toHaveBeenCalled()
    expect(env.CONTACT_EMAIL.send).not.toHaveBeenCalled()
    logger.mockRestore()
  })

  it.each(['CONTACT_RATE_LIMIT', 'CONTACT_GLOBAL_RATE_LIMIT'])('enforces %s', async (binding) => {
    const env = environment()
    env[binding].limit.mockResolvedValue({ success: false })
    expect((await worker.fetch(request(), env)).status).toBe(429)
    expect(env.CONTACT_EMAIL.send).not.toHaveBeenCalled()
  })

  it('reports a delivery failure without a false success', async () => {
    const env = environment()
    env.CONTACT_EMAIL.send.mockRejectedValue(new Error('delivery failed'))
    const logger = vi.spyOn(console, 'error').mockImplementation(() => {})
    const response = await worker.fetch(request(), env)
    expect(response.status).toBe(503)
    expect(await response.json()).toEqual({ error: 'Service unavailable' })
    expect(logger).toHaveBeenCalled()
    logger.mockRestore()
  })
})
