import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import ContactForm from '../ContactForm.jsx'

const href = (route = '', language = 'en') => `/?lang=${language}${route ? `&page=${route}` : ''}`

function renderForm() {
  return render(<ContactForm href={href} />)
}

async function fillValidForm(user) {
  await user.click(screen.getByRole('button', { name: 'Enquiry type' }))
  await user.click(screen.getByRole('option', { name: 'General enquiries' }))
  await user.type(screen.getByLabelText('Your name'), 'Alex Murphy')
  await user.type(screen.getByLabelText('Email address'), 'alex@example.com')
  await user.type(screen.getByLabelText('How can we help?'), 'I would like to discuss a project.')
}

describe('Contact form validation', () => {
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
