// @vitest-environment-options {"url":"http://localhost/?lang=en"}

import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
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
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {})

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
    const header = document.querySelector('.yhf-header')
    expect(header).not.toHaveClass('is-scrolled')

    vi.spyOn(window, 'scrollY', 'get').mockReturnValue(100)
    fireEvent.scroll(window)
    await waitFor(() => expect(header).toHaveClass('is-hidden'))
  })
})
