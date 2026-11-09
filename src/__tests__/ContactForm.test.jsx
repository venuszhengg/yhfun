import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import ContactForm from '../ContactForm.jsx'

const href = (route = '', language = 'en') => `/?lang=${language}${route ? `&page=${route}` : ''}`

function renderForm(language = 'en') {
  return render(<ContactForm href={href} language={language} />)
}

async function fillValidForm(user) {
  await user.click(screen.getByRole('button', { name: 'Enquiry type' }))
  await user.click(screen.getByRole('option', { name: 'General enquiries' }))
  await user.type(screen.getByLabelText('Your name'), 'Alex Murphy')
  await user.type(screen.getByLabelText('Email address'), 'alex@example.com')
  await user.type(screen.getByLabelText('How can we help?'), 'I would like to discuss a project.')
}

describe('Contact form validation', () => {
  it('removes only the requested helper copy and keeps the optional phone field and privacy notice', () => {
    renderForm()

    expect(screen.queryByText('All fields are required unless marked optional.')).not.toBeInTheDocument()
    expect(screen.queryByText('Optional, if you would also like us to have a number to reach you on.')).not.toBeInTheDocument()
    expect(screen.queryByText('A brief description is fine. Include any context that will help us respond.')).not.toBeInTheDocument()
    expect(screen.queryByText(/After you send your enquiry/)).not.toBeInTheDocument()
    expect(screen.getByLabelText(/Phone number/)).toHaveAttribute('type', 'tel')
    expect(screen.getByText(/Please read our/)).toBeInTheDocument()
  })

  it('also omits translated helper paragraphs', () => {
    renderForm('zh-Hans')

    expect(screen.queryByText('除标注为可选的项目外，其他项目均为必填。')).not.toBeInTheDocument()
    expect(screen.queryByText('可选。如果您希望我们也能通过电话联系您，可以填写。')).not.toBeInTheDocument()
    expect(screen.queryByText('简要说明即可，请提供有助于我们回复的背景信息。')).not.toBeInTheDocument()
    expect(screen.queryByText(/发送咨询后/)).not.toBeInTheDocument()
    expect(screen.getByLabelText(/电话号码/)).toHaveAttribute('type', 'tel')
    expect(screen.getByText(/发送消息前，请阅读我们的/)).toBeInTheDocument()
  })

  it('summarizes required-field errors and focuses the summary', async () => {
    const user = userEvent.setup()
    renderForm()

    await user.click(screen.getByRole('button', { name: 'Send enquiry' }))

    const summary = screen.getByRole('alert')
    expect(summary).toHaveTextContent('Please check the following before continuing:')
    expect(summary).toHaveTextContent('Choose an enquiry type.')
    expect(summary).toHaveTextContent('Enter your name.')
    expect(summary).toHaveTextContent('Enter your email address.')
    expect(summary).toHaveTextContent('Tell us how we can help.')
    await waitFor(() => expect(summary).toHaveFocus())
  })

  it('rejects an invalid email address', async () => {
    const user = userEvent.setup()
    renderForm()

    await user.type(screen.getByLabelText('Email address'), 'not-an-email')
    await user.tab()

    const email = screen.getByLabelText('Email address')
    expect(await screen.findByText('Enter an address like name@example.com.', { selector: 'p' })).toBeInTheDocument()
    expect(email).toHaveAttribute('aria-invalid', 'true')
  })
})

describe('Contact form keyboard interactions', () => {
  it('opens enquiry options and selects the focused option with Enter', async () => {
    const user = userEvent.setup()
    renderForm()

    const trigger = screen.getByRole('button', { name: 'Enquiry type' })
    trigger.focus()
    await user.keyboard('{ArrowDown}')

    const generalOption = screen.getByRole('option', { name: 'General enquiries' })
    await waitFor(() => expect(generalOption).toHaveFocus())

    await user.keyboard('{Enter}')
    expect(screen.getByRole('button', { name: 'Enquiry type: General enquiries' })).toHaveFocus()
    expect(screen.queryByRole('listbox', { name: 'Enquiry types' })).not.toBeInTheDocument()
  })

  it('closes the country picker with Escape and restores focus', async () => {
    const user = userEvent.setup()
    renderForm()

    const trigger = screen.getByRole('button', { name: /Phone country code/ })
    await user.click(trigger)

    const search = screen.getByRole('searchbox', { name: 'Search countries or dial codes' })
    expect(search).toHaveFocus()

    await user.keyboard('{ArrowDown}')
    await waitFor(() => expect(document.activeElement).toHaveAttribute('data-country-code'))
    await user.keyboard('{Escape}')

    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(trigger).toHaveFocus()
  })
})

describe('Contact form preview submission', () => {
  it('completes the local preview without making external requests', async () => {
    const user = userEvent.setup()
    const fetch = vi.fn()
    const xhrOpen = vi.spyOn(XMLHttpRequest.prototype, 'open').mockImplementation(() => {})
    const xhrSend = vi.spyOn(XMLHttpRequest.prototype, 'send').mockImplementation(() => {})
    vi.stubEnv('DEV', true)
    vi.stubEnv('VITE_CONTACT_FORM_ENDPOINT', 'https://submission.example.invalid/submit')
    vi.stubGlobal('fetch', fetch)
    renderForm()

    await fillValidForm(user)
    await user.click(screen.getByRole('button', { name: 'Send enquiry' }))

    const completion = await screen.findByRole('status')
    expect(within(completion).getByText('Your enquiry has been received.')).toBeInTheDocument()
    expect(completion).not.toHaveTextContent(/preview|demo|simulation|no enquiry was sent/i)
    expect(fetch).not.toHaveBeenCalled()
    expect(xhrOpen).not.toHaveBeenCalled()
    expect(xhrSend).not.toHaveBeenCalled()
  })

  it('fails closed outside development when no submission endpoint is configured', async () => {
    const user = userEvent.setup()
    const fetch = vi.fn()
    const xhrOpen = vi.spyOn(XMLHttpRequest.prototype, 'open').mockImplementation(() => {})
    const xhrSend = vi.spyOn(XMLHttpRequest.prototype, 'send').mockImplementation(() => {})
    vi.stubEnv('DEV', false)
    vi.stubEnv('VITE_CONTACT_FORM_ENDPOINT', '')
    vi.stubGlobal('fetch', fetch)
    renderForm()

    await fillValidForm(user)
    await user.click(screen.getByRole('button', { name: 'Send enquiry' }))

    const status = await screen.findByRole('alert')
    expect(status).toHaveTextContent('Website submission is not configured.')
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
    expect(fetch).not.toHaveBeenCalled()
    expect(xhrOpen).not.toHaveBeenCalled()
    expect(xhrSend).not.toHaveBeenCalled()
  })
})

describe('Contact form configured production submission', () => {
  it('shows the confirmation after an accepted request and can start a new enquiry', async () => {
    const user = userEvent.setup()
    const fetch = vi.fn().mockResolvedValue({ ok: true })
    vi.stubEnv('DEV', false)
    vi.stubEnv('VITE_CONTACT_FORM_ENDPOINT', 'https://submission.example.invalid/submit')
    vi.stubGlobal('fetch', fetch)
    renderForm()

    await fillValidForm(user)
    await user.click(screen.getByRole('button', { name: 'Send enquiry' }))

    const completion = await screen.findByRole('status')
    expect(completion).toHaveTextContent('Thanks, Alex Murphy.')
    expect(completion).toHaveTextContent('Your enquiry has been received.')
    expect(completion).toHaveTextContent('alex@example.com')
    expect(completion).toHaveTextContent('General enquiries')
    expect(fetch).toHaveBeenCalledTimes(1)
    expect(fetch).toHaveBeenCalledWith(
      'https://submission.example.invalid/submit',
      expect.objectContaining({
        method: 'POST',
        body: expect.stringContaining('"email":"alex@example.com"'),
      }),
    )
    await waitFor(() => expect(completion).toHaveFocus())

    await user.click(screen.getByRole('button', { name: 'Send a new message' }))
    expect(screen.getByLabelText('Your name')).toHaveValue('')
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it.each([
    ['an unsuccessful response', () => Promise.resolve({ ok: false })],
    ['a network error', () => Promise.reject(new Error('Network error'))],
  ])('preserves the form and allows retry after %s', async (_description, failure) => {
    const user = userEvent.setup()
    const fetch = vi.fn().mockImplementationOnce(failure).mockResolvedValueOnce({ ok: true })
    vi.stubEnv('DEV', false)
    vi.stubEnv('VITE_CONTACT_FORM_ENDPOINT', 'https://submission.example.invalid/submit')
    vi.stubGlobal('fetch', fetch)
    renderForm()

    await fillValidForm(user)
    await user.click(screen.getByRole('button', { name: 'Send enquiry' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('We couldn’t send your enquiry.')
    expect(screen.getByLabelText('Your name')).toHaveValue('Alex Murphy')
    expect(screen.getByLabelText('Email address')).toHaveValue('alex@example.com')
    expect(screen.queryByRole('status')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Send enquiry' }))
    expect(await screen.findByRole('status')).toHaveTextContent('Your enquiry has been received.')
    expect(fetch).toHaveBeenCalledTimes(2)
  })
})
