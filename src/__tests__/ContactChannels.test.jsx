import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import ContactChannels from '../ContactChannels.jsx'

function stubClipboard(writeText) {
  Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } })
}

afterEach(() => {
  vi.useRealTimers()
  delete navigator.clipboard
})

describe('ContactChannels', () => {
  it('copies an email, shows the toast and check state, then restores', async () => {
    const writeText = vi.fn().mockResolvedValue()
    stubClipboard(writeText)
    render(<ContactChannels />)

    const button = screen.getByRole('button', { name: /hello@yhfunhq.com/ })
    vi.useFakeTimers({ shouldAdvanceTime: true })
    fireEvent.click(button)

    await waitFor(() => expect(button).toHaveClass('yhfc-btn--copied'))
    expect(writeText).toHaveBeenCalledWith('hello@yhfunhq.com')
    expect(screen.getByRole('status')).toHaveTextContent('Copied to clipboard.')

    await act(async () => { vi.advanceTimersByTime(1900) })
    expect(button).not.toHaveClass('yhfc-btn--copied')
  })

  it('does not report success when copying fails', async () => {
    stubClipboard(vi.fn().mockRejectedValue(new Error('denied')))
    document.execCommand = vi.fn().mockReturnValue(false)
    render(<ContactChannels />)

    const button = screen.getByRole('button', { name: /info@yhfunhq.com/ })
    fireEvent.click(button)

    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('Could not copy'))
    expect(button).not.toHaveClass('yhfc-btn--copied')
  })

  it('opens Rednote and YouTube in a new tab', () => {
    render(<ContactChannels />)
    const youtube = screen.getByRole('link', { name: /YouTube/ })
    expect(youtube).toHaveAttribute('href', 'https://www.youtube.com/@yishanthinks')
    expect(youtube).toHaveAttribute('target', '_blank')
    expect(youtube).toHaveAttribute('rel', 'noopener noreferrer')
    const rednote = screen.getByRole('link', { name: /Rednote/ })
    expect(rednote).toHaveAttribute('target', '_blank')
    expect(rednote).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('toggles the WeChat QR panel with aria-expanded and closes on Escape', () => {
    render(<ContactChannels />)
    const button = screen.getByRole('button', { name: /^WeChat @/ })
    expect(button).toHaveAttribute('aria-expanded', 'false')
    expect(button).toHaveAttribute('aria-controls', 'yhfc-wechat-panel')

    fireEvent.click(button)
    expect(button).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('img', { name: /WeChat contact QR code/ })).toBeInTheDocument()

    fireEvent.keyDown(button, { key: 'Escape' })
    expect(button).toHaveAttribute('aria-expanded', 'false')
  })
})
