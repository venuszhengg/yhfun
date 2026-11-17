// @vitest-environment-options {"url":"http://localhost/?lang=en"}

import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import App from '../App.jsx'

describe('client-side page navigation', () => {
  it('keeps the current page visible until the next route image is ready', async () => {
    let releaseImage
    class PendingImage {
      set src(value) {
        this.currentSrc = value
        releaseImage = () => this.onload?.()
      }
    }
    vi.stubGlobal('Image', PendingImage)
    const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})

    render(<App />)
    expect(await screen.findByRole('heading', { name: 'Featured case studies' })).toBeInTheDocument()

    const navigation = within(screen.getByRole('navigation', { name: 'Main navigation' }))
    const servicesLink = navigation.getByRole('link', { name: 'Services' })
    servicesLink.focus()
    expect(servicesLink).toHaveFocus()
    fireEvent.click(servicesLink)

    expect(screen.getByRole('heading', { name: /Work through the problem/ })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: /Find the support/ })).not.toBeInTheDocument()

    await act(async () => releaseImage())

    expect(await screen.findByRole('heading', { name: /Find the support/ })).toBeInTheDocument()
    expect(window.location.search).toBe('?lang=en&page=services')
    expect(document.getElementById('main')).toHaveFocus()
    expect(scrollTo).toHaveBeenCalledWith({ top: 0, left: 0, behavior: 'instant' })
    const header = document.querySelector('.yhf-header')
    expect(header).not.toHaveClass('is-scrolled')

    vi.spyOn(window, 'scrollY', 'get').mockReturnValue(100)
    fireEvent.scroll(window)
    await waitFor(() => expect(header).toHaveClass('is-hidden'))
  })

  it('selects a discovery call from both contact-page calls to action', async () => {
    class ReadyImage {
      set src(value) {
        this.currentSrc = value
        this.complete = true
        this.naturalWidth = 1
      }
    }
    vi.stubGlobal('Image', ReadyImage)
    window.history.pushState({}, '', '/?lang=en&page=contact')
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
    Element.prototype.scrollIntoView = vi.fn()
    const user = userEvent.setup()

    render(<App />)

    await user.click(await screen.findByRole('link', { name: 'Request your free 30-minute discovery call' }))
    expect(await screen.findByRole('button', { name: 'Enquiry type: Free discovery call' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Enquiry type: Free discovery call' }))
    await user.click(screen.getByRole('option', { name: 'General enquiries' }))
    await user.click(screen.getByRole('link', { name: 'Book your free discovery call' }))

    expect(await screen.findByRole('button', { name: 'Enquiry type: Free discovery call' })).toBeInTheDocument()
  })
})
