import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import Header from '../Header.jsx'

const items = [
  { id: 'home', href: '/?lang=en', en: 'Home', 'zh-Hans': '首页' },
  { id: 'services', href: '/?lang=en&page=services', en: 'Services', 'zh-Hans': '服务' },
]

describe('Header navigation', () => {
  it('opens the mobile navigation and closes it with Escape, restoring focus', async () => {
    const user = userEvent.setup()
    render(<Header items={items} />)

    const toggle = screen.getByRole('button', { name: 'Open navigation', hidden: true })
    await user.click(toggle)

    expect(toggle).toHaveAttribute('aria-expanded', 'true')

    const navigation = screen.getByRole('navigation', { name: 'Main navigation', hidden: true })
    expect(navigation).toHaveClass('is-open')

    await user.keyboard('{Escape}')

    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(toggle).toHaveFocus()
  })

  it('shows both language choices and switches to Simplified Chinese', async () => {
    const user = userEvent.setup()
    const onLanguageChange = vi.fn()
    const { container } = render(<Header items={items} onLanguageChange={onLanguageChange} />)
    const switcher = within(container.querySelector('.yhf-desktop-language'))

    expect(switcher.getByRole('button', { name: 'English' })).toHaveAttribute('aria-pressed', 'true')
    const chinese = switcher.getByRole('button', { name: 'Simplified Chinese' })
    expect(chinese).toHaveAttribute('aria-pressed', 'false')

    await user.click(chinese)

    expect(chinese).toHaveAttribute('aria-pressed', 'true')
    expect(onLanguageChange).not.toHaveBeenCalled()
    await vi.waitFor(() => expect(onLanguageChange).toHaveBeenCalledWith('zh-Hans'))
  })

  it('keeps the mobile menu open while its language selection slides', async () => {
    const user = userEvent.setup()
    const onLanguageChange = vi.fn()
    render(<Header items={items} onLanguageChange={onLanguageChange} />)
    await user.click(screen.getByRole('button', { name: 'Open navigation', hidden: true }))
    const navigation = screen.getByRole('navigation', { name: 'Main navigation' })
    const chinese = within(navigation).getByRole('button', { name: 'Simplified Chinese' })
    await user.click(chinese)
    expect(navigation).toHaveClass('is-open')
    expect(chinese).toHaveAttribute('aria-pressed', 'true')
    await vi.waitFor(() => expect(onLanguageChange).toHaveBeenCalledWith('zh-Hans'))
  })
})
